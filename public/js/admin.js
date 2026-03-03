// Admin Dashboard Logic

// ── Auth Gate ──────────────────────────────────────────────
const ADMIN_PASSWORD = 'GurukulAdmin123';

function verifyAdmin() {
    const input = document.getElementById('adminPassInput').value;
    const errorEl = document.getElementById('authError');

    if (input === ADMIN_PASSWORD) {
        sessionStorage.setItem('gurukul_admin_auth', 'granted');
        document.getElementById('authGate').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        fetchData();
    } else {
        errorEl.textContent = '❌ Incorrect passkey. Please try again.';
        document.getElementById('adminPassInput').value = '';
        document.getElementById('adminPassInput').focus();
        setTimeout(() => { errorEl.textContent = ''; }, 3000);
    }
}

function lockDashboard() {
    sessionStorage.removeItem('gurukul_admin_auth');
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('authGate').style.display = 'flex';
    document.getElementById('adminPassInput').value = '';
}

// On page load — skip gate if already authenticated this session
document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('gurukul_admin_auth') === 'granted') {
        document.getElementById('authGate').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        fetchData();
    }
});

// ── Tab Switching ──────────────────────────────────────────
function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick') === `switchTab('${tabId}')`) {
            btn.classList.add('active');
        }
    });
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
}

// ── Fetch All Data ─────────────────────────────────────────
async function fetchData() {
    await Promise.all([fetchInquiries(), fetchStudents()]);
}

// ── Utilities ──────────────────────────────────────────────
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// ── Fetch Inquiries ────────────────────────────────────────
async function fetchInquiries() {
    const tbody = document.getElementById('inquiries-body');
    tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Loading...</td></tr>';
    try {
        const res = await fetch('/api/admin/inquiries');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No inquiries found yet.</td></tr>';
            return;
        }

        tbody.innerHTML = data.map(item => `
            <tr>
                <td>#${item.id}</td>
                <td>${formatDate(item.created_at)}</td>
                <td style="font-weight:500;">${item.first_name} ${item.last_name}</td>
                <td><a href="mailto:${item.email}" style="color:var(--primary);">${item.email}</a></td>
                <td>${item.class_name}</td>
                <td style="max-width:280px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${item.message}">${item.message || '-'}</td>
            </tr>`).join('');

    } catch (err) {
        console.error('Inquiries fetch error:', err);
        tbody.innerHTML = `<tr><td colspan="6" class="empty-state" style="color:var(--danger);">
            ⚠️ Error loading inquiries. Make sure the server is running on port 3000.</td></tr>`;
    }
}

// ── Fetch Students ─────────────────────────────────────────
async function fetchStudents() {
    const tbody = document.getElementById('students-body');
    tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Loading...</td></tr>';
    try {
        const res = await fetch('/api/admin/students');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No students registered yet.</td></tr>';
            return;
        }

        tbody.innerHTML = data.map(s => `
            <tr>
                <td>#${s.id}</td>
                <td>${formatDate(s.created_at)}</td>
                <td style="font-weight:500;">${s.first_name} ${s.last_name}</td>
                <td>${s.mobile}</td>
                <td><a href="mailto:${s.email}" style="color:var(--primary);">${s.email}</a></td>
                <td style="text-transform:capitalize;">${s.gender}</td>
            </tr>`).join('');

    } catch (err) {
        console.error('Students fetch error:', err);
        tbody.innerHTML = `<tr><td colspan="6" class="empty-state" style="color:var(--danger);">
            ⚠️ Error loading students. Make sure the server is running on port 3000.</td></tr>`;
    }
}

// ── Search ─────────────────────────────────────────────────
function searchData() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const activeTab = document.querySelector('.tab-content.active').id;
    const rows = document.getElementById(activeTab + '-body').getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        if (rows[i].querySelector('.empty-state')) continue;
        const text = rows[i].textContent.toLowerCase();
        rows[i].style.display = text.includes(input) ? '' : 'none';
    }
}

// ── Export CSV ─────────────────────────────────────────────
function exportCSV() {
    const activeTab = document.querySelector('.tab-content.active').id;
    const table = document.getElementById(activeTab + '-body').closest('table');
    const rows = table.querySelectorAll('tr');
    let csv = [];

    rows.forEach(row => {
        if (row.style.display === 'none') return;
        const cols = row.querySelectorAll('td, th');
        const rowData = Array.from(cols).map(col =>
            '"' + (col.innerText || col.textContent).replace(/"/g, '""').trim() + '"'
        );
        csv.push(rowData.join(','));
    });

    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const link = document.createElement('a');
    link.download = `${activeTab}_export.csv`;
    link.href = URL.createObjectURL(blob);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
