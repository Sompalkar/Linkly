# Linkly - Modern URL Shortener

A full-stack URL shortener application built with Next.js, TypeScript, Node.js, and MongoDB. Features include custom domains, analytics, QR codes, and more.

## 🚀 Features

### Core Features
- **URL Shortening**: Create short, memorable links from long URLs
- **Custom Domains**: Use your own branded domains for short links
- **QR Code Generation**: Automatic QR code generation for every link
- **Link Analytics**: Detailed analytics with charts and insights
- **Bulk Link Creation**: Create multiple links at once
- **Link Management**: Edit, delete, and organize your links

### Advanced Features
- **Custom Slugs**: Create personalized short URLs
- **Link Expiration**: Set expiration dates for temporary links
- **Password Protection**: Secure links with passwords
- **Tag System**: Organize links with custom tags
- **Real-time Analytics**: Live click tracking and statistics
- **Export Data**: Download analytics data as CSV

### Technical Features
- **Responsive Design**: Works perfectly on all devices
- **Dark/Light Mode**: Toggle between themes
- **Real-time Updates**: Live data updates using modern state management
- **SEO Optimized**: Built with SEO best practices
- **Performance Optimized**: Fast loading and smooth interactions

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Recoil** - State management
- **Framer Motion** - Smooth animations
- **Recharts** - Beautiful charts and analytics
- **Radix UI** - Accessible UI components
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe backend development
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **QRCode** - QR code generation

## 📁 Project Structure

\`\`\`
url-shortener/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App Router pages
│   │   ├── dashboard/       # Dashboard pages
│   │   ├── login/          # Authentication pages
│   │   └── register/
│   ├── components/          # Reusable components
│   │   ├── auth/           # Authentication components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── landing/        # Landing page components
│   │   ├── providers/      # Context providers
│   │   └── ui/             # UI components
│   ├── store/              # Recoil state management
│   │   ├── atoms/          # State atoms
│   │   └── selectors/      # State selectors
│   └── lib/                # Utility functions
├── backend/                 # Node.js backend application
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   └── types/          # TypeScript types
│   └── dist/               # Compiled JavaScript
└── README.md
\`\`\`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/url-shortener.git
   cd url-shortener
   \`\`\`

2. **Install backend dependencies**
   \`\`\`bash
   cd backend
   npm install
   \`\`\`

3. **Install frontend dependencies**
   \`\`\`bash
   cd ../frontend
   npm install
   \`\`\`

4. **Set up environment variables**

   **Backend (.env)**
   \`\`\`env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/linkly
   
   # Authentication
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   
   # Application
   DEFAULT_DOMAIN=somn.in
   FRONTEND_URL=http://localhost:3000
   \`\`\`

   **Frontend (.env.local)**
   \`\`\`env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   \`\`\`

5. **Start the development servers**

   **Backend:**
   \`\`\`bash
   cd backend
   npm run dev
   \`\`\`

   **Frontend:**
   \`\`\`bash
   cd frontend
   npm run dev
   \`\`\`

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔧 Configuration

### Domain Configuration

The application supports custom domains for branded short links. Here's how it works:

#### 1. **Default Domain**
- Set `DEFAULT_DOMAIN=somn.in` in your backend environment
- This domain is used for all links by default

#### 2. **Adding Custom Domains**
1. Go to Dashboard → Domains
2. Click "Add Domain"
3. Enter your domain name (e.g., `yourbrand.com`)
4. Add the DNS TXT record provided
5. Click "Verify Domain"

#### 3. **DNS Configuration**
Add this TXT record to your domain's DNS:
\`\`\`
Type: TXT
Name: @
Value: linkly-verify=your-verification-token
\`\`\`

#### 4. **Domain Features**
- **Verification**: Automatic DNS verification
- **Default Domain**: Set any verified domain as default
- **Branded Links**: All new links use your custom domain
- **SSL Support**: Automatic HTTPS for all domains

### Authentication System

The app uses JWT-based authentication with persistent login:

#### 1. **Registration Flow**
- User creates account with email/password
- Password is hashed using bcryptjs
- JWT token is generated and returned

#### 2. **Login Flow**
- User provides credentials
- Server validates and returns JWT token
- Token is stored in localStorage
- Automatic redirect to dashboard

#### 3. **Persistent Login**
- Token is checked on app initialization
- `/api/auth/getme` endpoint validates token
- User state is restored automatically
- Invalid tokens are cleared

#### 4. **Protected Routes**
- Middleware protects dashboard routes
- Automatic redirect to login if unauthenticated
- Token validation on every request

## 📊 Analytics System

### Click Tracking
- **Real-time**: Clicks are tracked immediately
- **Geolocation**: Country-based analytics
- **Device Detection**: Mobile, desktop, tablet tracking
- **Browser Analytics**: Browser and OS information
- **Referrer Tracking**: Source of traffic

### Analytics Dashboard
- **Overview Cards**: Total clicks, links, click rate
- **Interactive Charts**: Line charts, pie charts, bar charts
- **Time-based Filtering**: 7 days, 30 days, 90 days
- **Export Functionality**: Download data as CSV
- **Top Performers**: Most clicked links

### Data Structure
\`\`\`typescript
interface ClickAnalytics {
  totalClicks: number
  totalLinks: number
  clickRate: number
  topCountries: Array<{ country: string; clicks: number }>
  topDevices: Array<{ device: string; clicks: number }>
  topBrowsers: Array<{ browser: string; clicks: number }>
  clicksByDate: Array<{ date: string; clicks: number }>
  topLinks: Array<{ id: string; title: string; clicks: number }>
}
\`\`\`

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/getme` - Get current user
- `POST /api/auth/logout` - User logout

### Links
- `GET /api/links` - Get user's links (with pagination)
- `POST /api/links` - Create new link
- `GET /api/links/:id` - Get specific link
- `PUT /api/links/:id` - Update link
- `DELETE /api/links/:id` - Delete link
- `POST /api/links/bulk` - Create multiple links
- `GET /api/links/tags` - Get all tags

### Domains
- `GET /api/domains` - Get user's domains
- `POST /api/domains` - Add new domain
- `POST /api/domains/:id/verify` - Verify domain
- `POST /api/domains/:id/default` - Set default domain
- `DELETE /api/domains/:id` - Delete domain

### Analytics
- `GET /api/analytics/overview` - Overall analytics
- `GET /api/analytics/links/:id` - Link-specific analytics
- `GET /api/analytics/dashboard` - Dashboard analytics

### Redirect
- `GET /:slug` - Redirect to original URL (tracks click)

## 🎨 UI Components

The application uses a comprehensive design system:

### Core Components
- **Cards**: Information containers with hover effects
- **Buttons**: Multiple variants (primary, secondary, outline, ghost)
- **Forms**: Inputs, textareas, selects with validation
- **Navigation**: Sidebar, breadcrumbs, tabs
- **Modals**: Dialogs, alerts, confirmations

### Dashboard Components
- **Analytics Charts**: Line, bar, pie charts with Recharts
- **Data Tables**: Sortable, filterable tables
- **Link Cards**: Rich link display with actions
- **Stats Cards**: Metric displays with trends
- **Forms**: Link creation, domain management

### Responsive Design
- **Mobile-first**: Optimized for mobile devices
- **Breakpoints**: sm, md, lg, xl responsive breakpoints
- **Touch-friendly**: Large touch targets
- **Adaptive Layout**: Components adapt to screen size

## 🔒 Security Features

### Authentication Security
- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Token Expiration**: Configurable token lifetime
- **Secure Headers**: CORS, security headers

### Data Protection
- **Input Validation**: Server-side validation
- **SQL Injection Prevention**: Mongoose ODM protection
- **XSS Prevention**: Input sanitization
- **Rate Limiting**: API rate limiting (can be added)

### Domain Security
- **DNS Verification**: Verify domain ownership
- **HTTPS Enforcement**: Secure connections only
- **Domain Validation**: Prevent malicious domains

## 🚀 Deployment

### Frontend Deployment (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend Deployment (Railway/Heroku)
1. Create new project on Railway or Heroku
2. Connect GitHub repository
3. Set environment variables
4. Deploy with automatic builds

### Database (MongoDB Atlas)
1. Create MongoDB Atlas cluster
2. Get connection string
3. Update MONGODB_URI in environment variables
4. Configure network access and database users

### Environment Variables for Production
\`\`\`env
# Backend Production
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/linkly
JWT_SECRET=your-production-jwt-secret
DEFAULT_DOMAIN=yourdomain.com
FRONTEND_URL=https://yourdomain.com

# Frontend Production
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - UI components
- [Recharts](https://recharts.org/) - Chart library
- [Lucide](https://lucide.dev/) - Icon library
- [Framer Motion](https://www.framer.com/motion/) - Animation library

## 📞 Support

If you have any questions or need help, please:
1. Check the [Issues](https://github.com/yourusername/url-shortener/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about your setup and the issue

---

**Built with ❤️ by [Your Name]**
