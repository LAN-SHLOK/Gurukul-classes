# 🎓 Gurukul Classes - Premium Educational Platform

<div align="center">

![Gurukul Classes](https://img.shields.io/badge/Gurukul-Classes-2D31FA?style=for-the-badge&logo=graduation-cap)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

**Foundation for Future** - Elite JEE & NEET Coaching Platform

[🚀 Live Demo](https://gurukul-classes.vercel.app) • [📖 Documentation](./DEPLOYMENT_GUIDE.md) • [🐛 Report Bug](https://github.com/yourusername/gurukul-nextjs/issues)

</div>

---

## ✨ Features

### 🎯 **Core Features**
- **🏠 Modern Homepage** - Stunning hero section with animations
- **📚 Course Management** - JEE, NEET, and Board exam courses
- **👨‍🏫 Faculty Showcase** - Meet our expert teachers
- **🏆 Toppers Gallery** - Celebrate student achievements
- **📅 Event Management** - Workshops, seminars, and announcements
- **📞 Contact System** - Integrated email notifications
- **💼 Career Portal** - Faculty recruitment with resume uploads

### 🔐 **Authentication & User Management**
- **🔑 NextAuth Integration** - Google OAuth & email login
- **👤 Student Dashboard** - Profile management and progress tracking
- **🛡️ Admin Panel** - Complete content and user management
- **📊 Real-time Analytics** - Live stats and monitoring

### 🎨 **Design & UX**
- **📱 Fully Responsive** - Mobile-first design approach
- **🌙 Dark Theme** - Modern glassmorphic UI
- **⚡ Loading Animations** - Beautiful loading screens
- **🎭 Framer Motion** - Smooth page transitions
- **✨ Interactive Elements** - Hover effects and micro-interactions

### 🔧 **Technical Features**
- **🚀 Next.js 14** - App Router with Server Components
- **📡 Real-time Updates** - Socket.io integration
- **🤖 AI Search** - Groq-powered intelligent search
- **📧 Email System** - Automated notifications
- **🔔 Push Notifications** - PWA support
- **☁️ Cloud Storage** - Cloudinary integration
- **🗄️ Database** - MongoDB with optimized queries

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **UI Components:** Custom components with Radix UI
- **Icons:** Lucide React

### **Backend**
- **Runtime:** Node.js
- **Database:** MongoDB with Mongoose
- **Authentication:** NextAuth.js
- **File Upload:** Cloudinary
- **Email:** Nodemailer (Gmail SMTP)
- **Real-time:** Socket.io

### **AI & External Services**
- **AI Search:** Groq API
- **Maps:** Google Maps API
- **Analytics:** Vercel Analytics
- **Deployment:** Vercel (recommended)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Gmail account (for emails)
- Cloudinary account (for images)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gurukul-nextjs.git
   cd gurukul-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` with your credentials:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # Email (Gmail)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-char-app-password
   
   # Authentication
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # Admin
   ADMIN_PASSWORD=YourSecurePassword123
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   
   # AI (Optional)
   GROQ_API_KEY=your-groq-api-key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
gurukul-nextjs/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── 📁 (auth)/            # Authentication pages
│   │   ├── 📁 admin/             # Admin panel
│   │   ├── 📁 api/               # API routes
│   │   ├── 📁 dashboard/         # Student dashboard
│   │   └── 📄 layout.tsx         # Root layout
│   ├── 📁 components/            # Reusable components
│   │   ├── 📁 ui/                # UI components
│   │   ├── 📁 forms/             # Form components
│   │   └── 📁 layout/            # Layout components
│   ├── 📁 lib/                   # Utilities & configurations
│   │   ├── 📁 db/                # Database models
│   │   ├── 📁 services/          # External services
│   │   └── 📁 utils/             # Helper functions
│   └── 📁 hooks/                 # Custom React hooks
├── 📁 public/                    # Static assets
├── 📁 ai-service/                # Python AI service
├── 📄 package.json               # Dependencies
├── 📄 tailwind.config.js         # Tailwind configuration
├── 📄 next.config.js             # Next.js configuration
└── 📄 DEPLOYMENT_GUIDE.md        # Deployment instructions
```

---

## 🎯 Key Pages & Features

### 🏠 **Homepage**
- Hero section with animated elements
- Course overview cards
- Faculty highlights
- Student testimonials
- Real-time statistics

### 👨‍🎓 **Student Features**
- **Registration & Login** - Google OAuth integration
- **Dashboard** - Personal progress tracking
- **Profile Management** - Update personal information
- **Course Enrollment** - Browse and join courses
- **Schedule Viewing** - Class timetables

### 👨‍🏫 **Faculty Features**
- **Profile Showcase** - Detailed faculty information
- **Career Applications** - Join faculty form with resume upload
- **Content Management** - Add/edit courses and materials

### 🛡️ **Admin Panel**
- **Dashboard** - Overview with analytics
- **Student Management** - View, edit, delete students
- **Content Management** - Manage faculty, events, toppers
- **Schedule Management** - Create class timetables
- **Application Review** - Review faculty applications
- **Announcements** - Broadcast messages

### 📞 **Contact & Communication**
- **Contact Form** - Automated email notifications
- **Inquiry Management** - Track and respond to inquiries
- **Push Notifications** - Real-time updates
- **Email Templates** - Professional branded emails

---

## 🔧 Configuration

### **Database Setup**
The application uses MongoDB with the following collections:
- `users` - Student accounts and profiles
- `faculties` - Faculty member information
- `events` - Events and announcements
- `toppers` - Student achievements
- `schedules` - Class timetables
- `inquiries` - Contact form submissions
- `faculty_applications` - Career applications
- `announcements` - Admin announcements

### **Email Configuration**
1. Enable 2-Factor Authentication on Gmail
2. Generate App Password
3. Add credentials to environment variables
4. Test email functionality

### **Authentication Setup**
1. Create Google OAuth application
2. Configure authorized redirect URIs
3. Add client credentials to environment
4. Test login functionality

---

## 🚀 Deployment

### **Recommended: Vercel**
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy automatically

### **Alternative: Railway/Netlify**
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

### **Self-Hosted**
- Ubuntu 20.04+ server
- PM2 for process management
- Nginx reverse proxy
- SSL certificate (Let's Encrypt)

---

## 📊 Performance & SEO

### **Optimizations**
- ⚡ **Next.js App Router** - Server-side rendering
- 🖼️ **Image Optimization** - Next.js Image component
- 📦 **Code Splitting** - Automatic bundle optimization
- 🗜️ **Compression** - Gzip/Brotli compression
- 🎯 **Lazy Loading** - Components and images
- 📱 **PWA Ready** - Service worker support

### **SEO Features**
- 🔍 **Meta Tags** - Dynamic meta descriptions
- 📄 **Sitemap** - Auto-generated sitemap
- 🤖 **Robots.txt** - Search engine directives
- 📊 **Analytics** - Google Analytics integration
- 🏷️ **Schema Markup** - Structured data

---

## 🧪 Testing

### **Run Tests**
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build

# Production test
npm run start
```

### **Manual Testing Checklist**
- [ ] All pages load correctly
- [ ] Authentication flows work
- [ ] Forms submit successfully
- [ ] Admin panel functions
- [ ] Email notifications send
- [ ] Mobile responsiveness
- [ ] Image uploads work
- [ ] Real-time features function

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Test thoroughly before submitting
- Update documentation as needed

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

### **Getting Help**
- 📖 Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- 🐛 [Report Issues](https://github.com/yourusername/gurukul-nextjs/issues)
- 💬 [Discussions](https://github.com/yourusername/gurukul-nextjs/discussions)

### **Common Issues**
- **Build Errors:** Clear `.next` and `node_modules`, reinstall
- **Environment Variables:** Restart after adding new variables
- **Database Connection:** Check MongoDB Atlas IP whitelist
- **Email Issues:** Verify Gmail app password and 2FA

---

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Vercel** - Excellent deployment platform
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Beautiful animations
- **MongoDB** - Flexible database solution

---

## 📈 Roadmap

### **Upcoming Features**
- [ ] Mobile app (React Native)
- [ ] Video conferencing integration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Payment gateway integration
- [ ] Advanced AI tutoring
- [ ] Parent portal
- [ ] Exam management system

---

<div align="center">

**Made with ❤️ for Gurukul Classes**

*Empowering students to achieve their dreams since 2011*

[⭐ Star this repo](https://github.com/yourusername/gurukul-nextjs) • [🍴 Fork it](https://github.com/yourusername/gurukul-nextjs/fork) • [📢 Share it](https://twitter.com/intent/tweet?text=Check%20out%20this%20amazing%20educational%20platform!)

</div>