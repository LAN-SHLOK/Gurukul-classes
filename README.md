# Gurukul Classes - Offline Tuition Excellence

A premium, modernized web application for Gurukul Classes, providing comprehensive features for students and administrators. Built with a focus on ease of use, security, and performance.

## 🚀 Features

### For Students
- **Course Exploration**: Detailed information about offline batches for Gujarat Board (NCERT), JEE, and NEET.
- **Student Dashboard**: Personalized portal to view study materials and track progress.
- **Secure Authentication**: Robust login and registration system with Google OAuth integration.
- **Smart Password Reset**: 2-step verification flow with email-based 6-digit codes for secure account recovery.
- **AI Search**: Intelligent search assistant that answers student queries about Gurukul Classes using AI.

### For Administrators
- **Admin Portal**: A dedicated secure dashboard to manage student records and inquiries.
- **Data Tracking**: Real-time visualization and management of student data.
- **Inquiry Management**: View and follow up on admission inquiries submitted through the website.

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+)
- **Backend**: Node.js with Express
- **Database**: MongoDB (Atlas) for persistent cloud storage
- **Authentication**: Firebase Authentication & Google OAuth
- **Email Service**: Nodemailer (Gmail SMTP) for automated communication
- **AI Engine**: Gemini API for the intelligent search assistant

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd GurukulWebsite
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and add the following:
   ```env
   # API Keys
   GEMINI_API_KEY=your_gemini_api_key
   GOOGLE_CLIENT_ID=your_google_client_id
   
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # Email Configuration (Nodemailer)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

4. **Run the application**:
   ```bash
   npm run dev
   # or
   node server.js
   ```

5. **Access the site**:
   Open `http://localhost:3000` in your browser.

## 📁 Project Structure

```
GurukulWebsite/
├── public/              # Static frontend assets
│   ├── css/            # Stylesheets
│   ├── js/             # Frontend logic
│   ├── images/         # Logo and branding assets
│   └── *.html          # Web pages
├── models/             # Mongoose database schemas
├── server.js           # Express backend server
├── .env                # Sensitive credentials (git-ignored)
└── package.json        # Dependencies and scripts
```

## 🔒 Security Note
- Never commit the `.env` file to version control.
- Ensure Google OAuth redirect URIs are correctly configured in the Google Cloud Console for production.

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
