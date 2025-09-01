# Elysian Admin Panel

A modern, responsive admin dashboard built with Next.js 15, TypeScript, and Tailwind CSS for managing the Elysian mental health support platform.

## ✨ Features

- **Modern UI/UX**: Beautiful gradient backgrounds, glassmorphism effects, and smooth animations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Dashboard**: Live statistics and charts for user growth and system health
- **User Management**: Add, edit, and manage users with role-based access control
- **Category Management**: Organize support categories for better user experience
- **Connection Monitoring**: Track and manage user connections between seekers and listeners
- **Secure Authentication**: JWT-based authentication with proper error handling
- **Dark Theme**: Eye-friendly dark theme optimized for long admin sessions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (Django)

### Installation

1. **Clone the repository**
   ```bash
   cd Admin/admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   NEXT_PUBLIC_API_URL1=http://localhost:8000/api
   ```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── login/          # Admin login page
│   │   ├── users/          # User management
│   │   ├── category/       # Category management
│   │   ├── connections/    # Connection monitoring
│   │   └── layout.tsx      # Admin layout
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Root page (redirects to admin)
├── components/
│   ├── admin/
│   │   ├── SideBar.tsx     # Navigation sidebar
│   │   ├── UserTable.js    # User management table
│   │   └── StatCard.jsx    # Statistics cards
│   ├── AddUserModal.tsx    # User creation modal
│   └── VerifyOtpModal.tsx  # OTP verification modal
```

## 🎨 UI Components

### Design System
- **Color Palette**: Modern gradients with blue, purple, and green accents
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent spacing using Tailwind's spacing scale
- **Animations**: Smooth transitions and hover effects

### Key Components
- **Glassmorphism Cards**: Semi-transparent cards with backdrop blur
- **Gradient Buttons**: Beautiful gradient buttons with hover effects
- **Status Badges**: Color-coded status indicators
- **Loading States**: Elegant loading spinners and skeleton screens
- **Error Handling**: User-friendly error messages with retry options

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS v4 with custom configuration for:
- Color schemes
- Typography scales
- Component variants
- Responsive breakpoints

### Chart.js Integration
- Line charts for user growth trends
- Pie charts for user distribution
- Responsive chart containers
- Dark theme chart styling

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables for Production
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_API_URL1=https://your-api-domain.com/api
NODE_ENV=production
```

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Verify your backend API is running
   - Check environment variables
   - Ensure CORS is properly configured

2. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT token validity
   - Verify API endpoints

3. **Styling Issues**
   - Clear browser cache
   - Restart development server
   - Check Tailwind CSS compilation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the Elysian mental health support platform.

## 🆘 Support

For support and questions:
- Check the troubleshooting section
- Review API documentation
- Contact the development team

---

**Built with ❤️ for mental health support**
