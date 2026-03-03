require('dotenv').config({ override: true });
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');
const Groq = require('groq-sdk');

const app = express();
const PORT = process.env.PORT || 3000;

// Groq AI
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database
const dbPath = process.env.DATABASE_URL || path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) return console.error('DB Error:', err.message);
    console.log(`Connected to SQLite database at: ${dbPath}`);
    db.run(`CREATE TABLE IF NOT EXISTS inquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT, last_name TEXT, email TEXT,
        class_name TEXT, message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT, last_name TEXT, mobile TEXT,
        email TEXT UNIQUE, gender TEXT, password TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// ── AI Search ──────────────────────────────────────────────
app.post('/api/ai-search', async (req, res) => {
    const { query } = req.body;
    if (!query || !query.trim()) return res.status(400).json({ error: 'Query is required' });

    const prompt = `You are a helpful assistant for Gurukul Classes, an offline tuition institute in Ahmedabad, Gujarat, India.
Key facts:
- Offline tuition for Grade 1–12 (Gujarat Board / NCERT)
- Specialized JEE (Engineering) and NEET (Medical) coaching
- Admissions: inquiry form at /Admission_Inquiry.html
- Register at /Register.html | Login at /Student_Login.html
- Contact: info@gurukulclasses.com
- Social: Facebook (GurukulClassesAhmedabad), Instagram (@edukulam_)
Answer in 2–3 sentences. For unknown details (fees, timings) say "Contact us at info@gurukulclasses.com". Never make up information.

Student question: ${query}`;

    try {
        const completion = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [
                { role: 'system', content: prompt },
                { role: 'user', content: query }
            ],
            max_tokens: 200,
            temperature: 0.5,
        });
        const answer = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
        res.json({ answer });
    } catch (err) {
        console.error('Groq error:', err.message);
        res.status(503).json({ error: 'AI unavailable. Please try again shortly.' });
    }
});

// ── Google OAuth Login ─────────────────────────────────────
app.post('/api/auth/google', async (req, res) => {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ error: 'No credential provided' });

    try {
        // Verify the Google ID token using Google's public endpoint
        const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
        if (!verifyRes.ok) throw new Error('Invalid token');
        const payload = await verifyRes.json();

        if (payload.error) throw new Error(payload.error);

        const { name, email, given_name: firstName, family_name: lastName } = payload;

        // Check if student already exists
        db.get(`SELECT * FROM students WHERE email = ?`, [email], (err, row) => {
            if (err) return res.status(500).json({ error: 'DB error' });

            if (row) {
                // Existing student — log them in
                return res.json({ success: true, name: row.first_name, email: row.email });
            }

            // New student — create account (no password for Google users)
            const parts = (name || email).split(' ');
            const fName = firstName || parts[0] || email.split('@')[0];
            const lName = lastName || parts[1] || '';

            db.run(
                `INSERT INTO students (first_name, last_name, mobile, email, gender, password) VALUES (?, ?, ?, ?, ?, ?)`,
                [fName, lName, '', email, '', 'google_oauth'],
                function (insertErr) {
                    if (insertErr) return res.status(500).json({ error: 'Could not create account' });
                    console.log(`New Google student: ${email}`);
                    res.json({ success: true, name: fName, email });
                }
            );
        });
    } catch (err) {
        console.error('Google auth error:', err.message);
        res.status(401).json({ error: 'Google sign-in failed. Please try again.' });
    }
});

// ── Admission Inquiry ──────────────────────────────────────
app.post('/api/inquiry', (req, res) => {
    const { 'first-name': firstName, 'last-name': lastName, email, class: className, message } = req.body;
    db.run(
        `INSERT INTO inquiries (first_name, last_name, email, class_name, message) VALUES (?, ?, ?, ?, ?)`,
        [firstName, lastName, email, className, message],
        function (err) {
            if (err) { console.error(err.message); return res.status(500).send('Error submitting inquiry'); }
            res.send(`<script>alert('Inquiry submitted! We will get back to you soon.'); window.location.href='/Admission_Inquiry.html';</script>`);
        }
    );
});

// ── Student Registration ───────────────────────────────────
app.post('/api/register', async (req, res) => {
    const { 'first-name': firstName, 'last-name': lastName, mobile, email, gender, password, 'confirm-password': confirmPassword } = req.body;
    if (password !== confirmPassword)
        return res.send('<script>alert("Passwords do not match!"); window.history.back();</script>');
    try {
        const hashed = await bcrypt.hash(password, 10);
        db.run(
            `INSERT INTO students (first_name, last_name, mobile, email, gender, password) VALUES (?, ?, ?, ?, ?, ?)`,
            [firstName, lastName, mobile, email, gender, hashed],
            function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE')) return res.send('<script>alert("Email already registered!"); window.history.back();</script>');
                    console.error(err.message); return res.status(500).send('Error registering');
                }
                res.send(`<script>alert('Registration successful! Please login.'); window.location.href='/Student_Login.html';</script>`);
            }
        );
    } catch (e) { res.status(500).send('Server error'); }
});

// ── Student Login ──────────────────────────────────────────
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM students WHERE email = ?`, [email], async (err, row) => {
        if (err) { console.error(err.message); return res.status(500).send('Login error'); }
        if (!row) return res.send('<script>alert("Invalid email or password"); window.history.back();</script>');
        const match = await bcrypt.compare(password, row.password);
        if (match) {
            res.send(`<script>
                sessionStorage.setItem('student_name','${row.first_name}');
                sessionStorage.setItem('student_email','${row.email}');
                sessionStorage.setItem('student_logged_in','true');
                window.location.href='/Dashboard.html';
            </script>`);
        } else {
            res.send('<script>alert("Invalid email or password"); window.history.back();</script>');
        }
    });
});

// ── Reset Password ─────────────────────────────────────────
app.post('/reset-password', (req, res) => {
    const { email } = req.body;
    db.get(`SELECT * FROM students WHERE email = ?`, [email], (err) => {
        if (err) console.error(err.message);
        console.log(`Password reset requested for: ${email}`);
        res.send(`<script>alert('If that email is registered, a reset link has been sent.'); window.location.href='/Student_Login.html';</script>`);
    });
});

// ── Admin: Get Inquiries ───────────────────────────────────
app.get('/api/admin/inquiries', (req, res) => {
    db.all(`SELECT * FROM inquiries ORDER BY created_at DESC`, [], (err, rows) => {
        if (err) { console.error(err.message); return res.status(500).json({ error: 'Failed' }); }
        res.json(rows);
    });
});

// ── Admin: Get Students ────────────────────────────────────
app.get('/api/admin/students', (req, res) => {
    db.all(`SELECT id, first_name, last_name, mobile, email, gender, created_at FROM students ORDER BY created_at DESC`, [], (err, rows) => {
        if (err) { console.error(err.message); return res.status(500).json({ error: 'Failed' }); }
        res.json(rows);
    });
});

// ── Start Server ───────────────────────────────────────────
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
