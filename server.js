require('dotenv').config({ override: true });
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');
const Groq = require('groq-sdk');

const app = express();
const PORT = process.env.PORT || 3000;

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Groq AI
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── MongoDB Connection ──────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gurukul';
console.log('Connecting to MongoDB at:', MONGODB_URI);
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// ── Schemas & Models ────────────────────────────────────────
const inquirySchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    class_name: String,
    message: String,
    created_at: { type: Date, default: Date.now }
});
const Inquiry = mongoose.model('Inquiry', inquirySchema);

const studentSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    mobile: String,
    email: { type: String, unique: true, required: true },
    gender: String,
    password: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});
const Student = mongoose.model('Student', studentSchema);

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
        const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
        if (!verifyRes.ok) throw new Error('Invalid token');
        const payload = await verifyRes.json();

        if (payload.error) throw new Error(payload.error);

        const { name, email, given_name: firstName, family_name: lastName } = payload;

        let student = await Student.findOne({ email });

        if (student) {
            return res.json({ success: true, name: student.first_name, email: student.email });
        }

        const parts = (name || email).split(' ');
        const fName = firstName || parts[0] || email.split('@')[0];
        const lName = lastName || parts[1] || '';

        student = new Student({
            first_name: fName,
            last_name: lName,
            mobile: '',
            email: email,
            gender: '',
            password: 'google_oauth'
        });

        await student.save();
        console.log(`New Google student: ${email}`);
        res.json({ success: true, name: fName, email });
    } catch (err) {
        console.error('Google auth error:', err.message);
        res.status(401).json({ error: 'Google sign-in failed. Please try again.' });
    }
});

// ── Admission Inquiry ──────────────────────────────────────
app.post('/api/inquiry', async (req, res) => {
    const { 'first-name': firstName, 'last-name': lastName, email, class: className, message } = req.body;

    const classNum = parseInt(className);
    if (isNaN(classNum) || classNum < 1 || classNum > 12) {
        return res.send(`<script>alert('Invalid class! Please enter a value between 1 and 12.'); window.history.back();</script>`);
    }

    try {
        const newInquiry = new Inquiry({
            first_name: firstName,
            last_name: lastName,
            email,
            class_name: className,
            message
        });
        await newInquiry.save();
        res.send(`<script>alert('Inquiry submitted! We will get back to you soon.'); window.location.href='/Admission_Inquiry.html';</script>`);
    } catch (err) {
        console.error('Inquiry error:', err.message);
        res.status(500).send('Error submitting inquiry');
    }
});

// ── Student Registration ───────────────────────────────────
app.post('/api/register', async (req, res) => {
    const { 'first-name': firstName, 'last-name': lastName, mobile, email, gender, password, 'confirm-password': confirmPassword } = req.body;
    if (password !== confirmPassword)
        return res.send('<script>alert("Passwords do not match!"); window.history.back();</script>');

    try {
        const hashed = await bcrypt.hash(password, 10);
        const newStudent = new Student({
            first_name: firstName,
            last_name: lastName,
            mobile,
            email,
            gender,
            password: hashed
        });
        await newStudent.save();
        res.send(`<script>alert('Registration successful! Please login.'); window.location.href='/Student_Login.html';</script>`);
    } catch (err) {
        if (err.code === 11000) return res.send('<script>alert("Email already registered!"); window.history.back();</script>');
        console.error('Registration error:', err.message);
        res.status(500).send('Error registering');
    }
});

// ── Student Login ──────────────────────────────────────────
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const student = await Student.findOne({ email });
        if (!student) return res.send('<script>alert("Invalid email or password"); window.history.back();</script>');

        const match = await bcrypt.compare(password, student.password);
        if (match) {
            res.send(`<script>
                sessionStorage.setItem('student_name','${student.first_name}');
                sessionStorage.setItem('student_email','${student.email}');
                sessionStorage.setItem('student_logged_in','true');
                window.location.href='/Dashboard.html';
            </script>`);
        } else {
            res.send('<script>alert("Invalid email or password"); window.history.back();</script>');
        }
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).send('Login error');
    }
});

// ── Password Reset: In-memory code store ───────────────────
const resetCodes = {}; // { email: { code, expiresAt } }

// ── Step 1: Send Reset Code ────────────────────────────────
app.post('/reset-password', async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            return res.send('<script>alert("Email is required"); window.history.back();</script>');
        }

        const student = await Student.findOne({ email });
        if (!student) {
            console.log(`[AUTH] Password reset requested for UNKNOWN email: ${email}`);
            return res.send(`<script>alert('Error: This email is not registered in our records.'); window.history.back();</script>`);
        }

        // Generate a 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        // Store with 10-minute expiry
        resetCodes[email] = { code, expiresAt: Date.now() + 10 * 60 * 1000 };
        console.log(`[AUTH] Reset code generated for: ${email}`);

        // Email the code
        const mailOptions = {
            from: `"Gurukul Classes" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your Verification Code | Gurukul Classes',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px; background: #fafafa;">
                    <h2 style="color: #4a3728; text-align: center; margin-bottom: 5px;">Gurukul Classes</h2>
                    <p style="text-align: center; color: #888; font-size: 13px; margin-top: 0;">Foundation for Future</p>
                    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                    <p>Hello <b>${student.first_name}</b>,</p>
                    <p>Your password reset verification code is:</p>
                    <div style="background: #4a3728; color: white; text-align: center; padding: 18px; border-radius: 8px; font-size: 32px; letter-spacing: 8px; font-family: monospace; margin: 20px 0;">
                        ${code}
                    </div>
                    <p>This code is valid for <b>10 minutes</b>. Do not share it with anyone.</p>
                    <p style="color: #888; font-size: 12px; margin-top: 30px;">If you did not request this, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                    <p style="text-align: center; color: #aaa; font-size: 11px;">&copy; 2026 Gurukul Classes | All Rights Reserved</p>
                </div>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`[AUTH] Verification code emailed to: ${email}`);
            // Redirect to verification page with email as query param
            res.redirect(`/reset-verify.html?email=${encodeURIComponent(email)}`);
        } catch (mailErr) {
            console.error('[AUTH] Email Error:', mailErr.message);
            res.send(`<script>alert('Could not send verification email. Please try again later.'); window.history.back();</script>`);
        }
    } catch (err) {
        console.error('[AUTH] Reset error:', err.message);
        res.status(500).send('<script>alert("Internal server error. Please try again later."); window.history.back();</script>');
    }
});

// ── Step 2: Verify Code ────────────────────────────────────
app.post('/verify-reset-code', (req, res) => {
    const { email, code } = req.body;
    const stored = resetCodes[email];

    if (!stored) {
        return res.json({ success: false, message: 'No reset code found. Please request a new one.' });
    }
    if (Date.now() > stored.expiresAt) {
        delete resetCodes[email];
        return res.json({ success: false, message: 'Code has expired. Please request a new one.' });
    }
    if (stored.code !== code) {
        return res.json({ success: false, message: 'Invalid code. Please try again.' });
    }

    // Code is valid
    res.json({ success: true });
});

// ── Step 3: Set New Password ───────────────────────────────
app.post('/set-new-password', async (req, res) => {
    const { email, code, password } = req.body;

    // Re-verify the code
    const stored = resetCodes[email];
    if (!stored || stored.code !== code || Date.now() > stored.expiresAt) {
        return res.json({ success: false, message: 'Invalid or expired code. Please restart the process.' });
    }

    try {
        const student = await Student.findOne({ email });
        if (!student) {
            return res.json({ success: false, message: 'Student not found.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        student.password = hashedPassword;
        await student.save();

        // Clean up the used code
        delete resetCodes[email];
        console.log(`[AUTH] Password successfully reset for: ${email}`);

        res.json({ success: true, message: 'Password updated successfully!' });
    } catch (err) {
        console.error('[AUTH] Set password error:', err.message);
        res.json({ success: false, message: 'Server error. Please try again.' });
    }
});


// ── Admin: Get Inquiries ───────────────────────────────────
app.get('/api/admin/inquiries', async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ created_at: -1 });
        res.json(inquiries);
    } catch (err) {
        console.error('Fetch inquiries error:', err.message);
        res.status(500).json({ error: 'Failed' });
    }
});

// ── Admin: Get Students ────────────────────────────────────
app.get('/api/admin/students', async (req, res) => {
    try {
        const students = await Student.find({}, 'first_name last_name mobile email gender created_at').sort({ created_at: -1 });
        res.json(students);
    } catch (err) {
        console.error('Fetch students error:', err.message);
        res.status(500).json({ error: 'Failed' });
    }
});

// ── Admin: Delete Inquiry ──────────────────────────────────
app.delete('/api/admin/inquiries/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`[ADMIN] Delete inquiry request for ID: ${id}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.warn(`[ADMIN] Invalid ObjectId format: ${id}`);
        return res.status(400).json({ error: 'Invalid inquiry ID format' });
    }

    try {
        const result = await Inquiry.findByIdAndDelete(id);
        if (!result) {
            console.warn(`[ADMIN] Delete failed: No inquiry found with id ${id}`);
            return res.status(404).json({ error: 'Inquiry not found' });
        }
        console.log(`[ADMIN] Successfully deleted inquiry: ${id}`);
        res.json({ success: true, message: 'Inquiry deleted' });
    } catch (err) {
        console.error('[ADMIN] ERROR deleting inquiry:', err);
        res.status(500).json({
            error: 'Internal server error during deletion',
            details: err.message
        });
    }
});

// ── Admin: Delete Student ──────────────────────────────────
app.delete('/api/admin/students/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`[ADMIN] Delete student request for ID: ${id}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.warn(`[ADMIN] Invalid ObjectId format: ${id}`);
        return res.status(400).json({ error: 'Invalid student ID format' });
    }

    try {
        const result = await Student.findByIdAndDelete(id);
        if (!result) {
            console.warn(`[ADMIN] Delete failed: No student found with id ${id}`);
            return res.status(404).json({ error: 'Student not found' });
        }
        console.log(`[ADMIN] Successfully deleted student: ${id}`);
        res.json({ success: true, message: 'Student deleted' });
    } catch (err) {
        console.error('[ADMIN] ERROR deleting student:', err);
        res.status(500).json({
            error: 'Internal server error during deletion',
            details: err.message
        });
    }
});

// ── Start Server ───────────────────────────────────────────
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
