# Restaurant Management System (RMS) - Frontend

A comprehensive React.js frontend application for restaurant management, built with modern web technologies and best practices.

## 🚀 Features

### Authentication & Authorization
- **Secure Login/Registration System**: Role-based authentication for Admin and Staff users
- **Protected Routes**: Route protection based on user roles and authentication status
- **Session Management**: Persistent login sessions with secure token handling

### Admin Dashboard
- **Comprehensive Analytics**: Real-time dashboard with key performance indicators
- **Staff Management**: Complete CRUD operations for staff members
- **Menu Management**: Dynamic menu item management with categories and pricing
- **Inventory Management**: Stock tracking with low-stock alerts and supplier management
- **Order Management**: Real-time order tracking and status updates
- **Reports & Analytics**: Detailed reporting with charts and data visualization

### User Interface
- **Customer Menu**: Interactive menu browsing with categories and search
- **Shopping Cart**: Dynamic cart management with real-time updates
- **Order Tracking**: Real-time order status tracking for customers
- **Billing System**: Comprehensive billing with multiple payment options

### Technical Features
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI Components**: Built with shadcn/ui and Tailwind CSS
- **Real-time Updates**: Live data updates for orders and inventory
- **Security Services**: Encryption, audit logging, and security monitoring
- **Performance Optimized**: Fast loading times and smooth interactions

## 🛠 Technology Stack

### Frontend Framework
- **React 19.1.0**: Latest React with modern hooks and features
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing with protected routes

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality, accessible UI components
- **Lucide React**: Beautiful, customizable icons
- **Recharts**: Responsive chart library for data visualization

### State Management & Data
- **React Context**: Global state management for authentication
- **Local Storage**: Persistent data storage for user sessions
- **React Hook Form**: Efficient form handling and validation

### Development Tools
- **ESLint**: Code linting and quality assurance
- **PostCSS**: CSS processing and optimization
- **Autoprefixer**: Automatic CSS vendor prefixing

## 📁 Project Structure

```
restaurant-management-system/
├── public/                     # Static assets
├── src/
│   ├── components/            # React components
│   │   ├── Admin/            # Admin-specific components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── StaffManagement.jsx
│   │   │   ├── MenuManagement.jsx
│   │   │   ├── InventoryManagement.jsx
│   │   │   ├── Orders.jsx
│   │   │   └── Reports.jsx
│   │   ├── Auth/             # Authentication components
│   │   │   ├── AuthContext.jsx
│   │   │   ├── AuthContextSimple.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── LoginSimple.jsx
│   │   │   └── Register.jsx
│   │   ├── Common/           # Shared components
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── NotFound.jsx
│   │   ├── Layout/           # Layout components
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── User/             # User-facing components
│   │   │   ├── Menu.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Billing.jsx
│   │   │   └── Orders.jsx
│   │   └── ui/               # shadcn/ui components
│   ├── services/             # Business logic services
│   │   ├── authService.js
│   │   ├── encryptionService.js
│   │   ├── auditService.js
│   │   └── logService.js
│   ├── styles/               # Global styles
│   │   └── global.css
│   ├── App.jsx               # Main application component
│   ├── AppSimple.jsx         # Simplified app for testing
│   └── main.jsx              # Application entry point
├── package.json              # Dependencies and scripts
├── tailwind.config.js        # Tailwind CSS configuration
├── vite.config.js            # Vite configuration
└── README.md                 # Project documentation
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd restaurant-management-system
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Install additional dependencies**
   ```bash
   pnpm add crypto-js
   ```

4. **Start the development server**
   ```bash
   pnpm dev --host
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Demo Accounts

For testing purposes, use these demo accounts:

- **Admin Account**
  - Email: `admin@restaurant.com`
  - Password: Any password
  - Access: Full admin dashboard and management features

- **Staff Account**
  - Email: `staff@restaurant.com`
  - Password: Any password
  - Access: Limited staff features

## 🎯 Key Components

### Authentication System
The authentication system provides secure login/logout functionality with role-based access control:

- **AuthContext**: Manages global authentication state
- **ProtectedRoute**: Ensures only authenticated users can access protected pages
- **Login/Register**: User-friendly authentication forms

### Admin Dashboard
Comprehensive management interface for restaurant operations:

- **Real-time Analytics**: Key metrics and performance indicators
- **Staff Management**: Employee records, roles, and scheduling
- **Menu Management**: Dynamic menu creation and pricing
- **Inventory Tracking**: Stock levels, suppliers, and automated alerts
- **Order Management**: Real-time order processing and tracking

### User Interface
Customer-facing components for ordering and interaction:

- **Interactive Menu**: Browse items by category with search functionality
- **Shopping Cart**: Add/remove items with real-time price calculation
- **Order Tracking**: Monitor order status from preparation to delivery
- **Billing System**: Secure payment processing with multiple options

### Services Layer
Backend integration and utility services:

- **Authentication Service**: Secure login, token management, and session handling
- **Encryption Service**: Data encryption and security utilities
- **Audit Service**: Activity logging and compliance monitoring
- **Log Service**: Application logging and error tracking

## 🎨 Design System

### Color Palette
- **Primary**: Orange (#f97316) - Restaurant brand color
- **Secondary**: Gray (#6b7280) - Text and UI elements
- **Success**: Green (#10b981) - Success states and confirmations
- **Warning**: Yellow (#f59e0b) - Warnings and alerts
- **Error**: Red (#ef4444) - Error states and validation

### Typography
- **Font Family**: System fonts for optimal performance
- **Headings**: Bold weights for clear hierarchy
- **Body Text**: Regular weight for readability
- **UI Text**: Medium weight for interface elements

### Components
All UI components follow consistent design patterns:
- **Cards**: Clean, elevated containers for content
- **Buttons**: Multiple variants (primary, secondary, outline)
- **Forms**: Accessible inputs with proper validation
- **Navigation**: Intuitive sidebar and navbar design

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENCRYPTION_KEY=your-encryption-key
REACT_APP_LOG_LEVEL=info
```

### Tailwind CSS
The project uses a custom Tailwind configuration optimized for the restaurant theme:

```javascript
// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#f97316",
        secondary: "#6b7280",
        // ... additional colors
      }
    }
  }
}
```

## 📱 Responsive Design

The application is fully responsive and optimized for:

- **Desktop**: Full-featured interface with sidebar navigation
- **Tablet**: Adapted layout with collapsible sidebar
- **Mobile**: Touch-optimized interface with bottom navigation

### Breakpoints
- **sm**: 640px and up
- **md**: 768px and up
- **lg**: 1024px and up
- **xl**: 1280px and up

## 🔒 Security Features

### Data Protection
- **Encryption**: Sensitive data encryption using AES
- **Input Validation**: XSS and injection attack prevention
- **CSRF Protection**: Cross-site request forgery prevention

### Authentication Security
- **JWT Tokens**: Secure token-based authentication
- **Session Management**: Automatic session expiration
- **Role-based Access**: Granular permission control

### Audit & Logging
- **Activity Tracking**: Comprehensive user action logging
- **Error Monitoring**: Automatic error detection and reporting
- **Compliance**: Audit trails for regulatory compliance

## 🚀 Performance Optimizations

### Code Splitting
- **Route-based Splitting**: Lazy loading for different sections
- **Component Splitting**: Dynamic imports for heavy components

### Caching Strategy
- **Browser Caching**: Optimized cache headers
- **Local Storage**: Efficient data persistence
- **Service Worker**: Offline functionality (future enhancement)

### Bundle Optimization
- **Tree Shaking**: Unused code elimination
- **Minification**: Compressed production builds
- **Asset Optimization**: Optimized images and fonts

## 🧪 Testing Strategy

### Component Testing
- **Unit Tests**: Individual component testing
- **Integration Tests**: Component interaction testing
- **Accessibility Tests**: WCAG compliance testing

### User Testing
- **Demo Accounts**: Pre-configured test accounts
- **Mock Data**: Realistic test data for all features
- **Cross-browser Testing**: Compatibility across browsers

## 📈 Future Enhancements

### Planned Features
- **Real-time Notifications**: WebSocket integration for live updates
- **Advanced Analytics**: Machine learning insights and predictions
- **Mobile App**: React Native companion app
- **API Integration**: Full backend API integration
- **Payment Gateway**: Stripe/PayPal integration
- **Multi-language Support**: Internationalization (i18n)

### Technical Improvements
- **Progressive Web App**: PWA capabilities for offline use
- **Performance Monitoring**: Real-time performance tracking
- **Automated Testing**: Comprehensive test suite
- **CI/CD Pipeline**: Automated deployment pipeline

## 🤝 Contributing

### Development Guidelines
1. Follow the established code style and conventions
2. Write comprehensive tests for new features
3. Update documentation for any changes
4. Use semantic commit messages

### Code Style
- **ESLint**: Follow the configured linting rules
- **Prettier**: Use consistent code formatting
- **Component Structure**: Follow the established patterns
- **Naming Conventions**: Use descriptive, consistent names

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and feature requests via GitHub issues
- **Community**: Join our developer community for discussions

## 🙏 Acknowledgments

- **shadcn/ui**: For the excellent UI component library
- **Tailwind CSS**: For the utility-first CSS framework
- **Lucide**: For the beautiful icon set
- **React Team**: For the amazing React framework
- **Vite Team**: For the fast build tool

---

**Built with ❤️ for the restaurant industry**

