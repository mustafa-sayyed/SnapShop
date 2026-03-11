# SnapShop

**Production-Ready E-Commerce Platform**

A full-stack e-commerce application featuring secure REST APIs, Dockerized backend deployed on Azure App Service with CI/CD automation, and a responsive admin dashboard with real-time analytics.

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=react,nodejs,express,mongodb,tailwind,docker,azure,githubactions,vite,cloudflare&theme=dark" />
  </a>
</p>


## All Features

- **Secure REST APIs** — Built production-grade APIs with Node.js, Express, and MongoDB featuring JWT + OAuth authentication and secure token-based password reset flow
- **Dockerized Deployment** — Multi-stage Docker builds deployed on Azure App Service with optimized images
- **CI/CD Pipeline** — Automated build and deployment workflow using GitHub Actions
- **Admin Analytics** — MongoDB aggregation pipelines powering real-time dashboard insights
- **Payment Integration** — Razorpay gateway with secure webhook verification handling success/failure flows
- **Email Marketing** — Dynamic email workflows using Resend API and Quill.js rich text editor for admin-driven campaigns
- **Image Management** — Multer + Cloudinary integration for optimized image uploads and storage

## Features

###  Client Application Features
- 🔐 **Authentication** - JWT + Google OAuth with secure token-based password reset feature
- 🛒 **Shopping Cart** - Add, update, remove items with persistent cart sync
- 📦 **Order Management** - Track orders and view detailed order history
- 💳 **Payments** - Razorpay integration with webhook verification + COD
- 📍 **Address Management** - Save and manage multiple delivery addresses
- ⭐ **Product Reviews** - Rate and review purchased products
- 🔍 **Search & Filter** - Browse products by category and subcategory
- 📧 **Newsletter** - Subscribe for updates and marketing campaigns

### Admin Dashboard Features
- 📊 **Analytics Dashboard** - MongoDB aggregation pipelines powering sales insights with Recharts
- 📝 **Product Management** - Add, edit, and delete products with Quill.js rich text editor
- 📋 **Order Management** - View and update order statuses with TanStack Table
- 👥 **Customer Management** - View and manage registered customers
- 🖼️ **Banner Management** - Manage featured banners with image uploads
- 📬 **Email Marketing** - Dynamic email campaigns with Resend and rich text editor
- 🌓 **Theme Toggle** - Light/dark mode with persistent preferences

## 🛠️ Tech Stack

### Frontend (Client & Admin)
| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| Vite | Build Tool |
| Tailwind CSS 4 | Styling |
| Shadcn UI / Radix UI | Accessible UI Components |
| TanStack Table | Data Tables (Admin) |
| React Router 7 | Routing |
| Axios | HTTP Client |
| Recharts | Analytics Charts (Admin) |
| Quill.js | Rich Text Editor (Admin) |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express 5 | Web Framework |
| MongoDB | Database + Aggregation Pipelines |
| Mongoose 8 | ODM |
| JWT + OAuth | Authentication |
| Bcrypt | Password Hashing |
| Multer | File Upload Handling |
| Cloudinary | Image Storage & CDN |
| Razorpay | Payment Gateway + Webhooks |
| Resend | Transactional & Marketing Emails |
| Zod | Schema Validation |

### DevOps
| Technology | Purpose |
|------------|----------|
| Docker | Multi-stage containerization |
| GitHub Actions | CI/CD Pipeline |
| Azure App Service | Cloud Deployment |
| Cloudflare | Frontend Hosting |

## 📁 Project Structure

```
SnapShop/
├── client/                 # Customer-facing React app
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React Context (Shop, User)
│   │   ├── pages/          # Page components
│   │   └── Config/         # App configuration
│   └── public/
│
├── admin/                  # Admin dashboard React app
│   ├── src/
│   │   ├── components/     # UI components (charts, sidebar, etc.)
│   │   ├── context/        # Theme and user context
│   │   ├── layouts/        # Auth and dashboard layouts
│   │   └── pages/          # Admin pages
│   └── public/
│
└── server/                 # Express.js backend
    ├── src/
    │   ├── controllers/    # Request handlers
    │   ├── models/         # Mongoose schemas
    │   ├── routes/         # API routes
    │   ├── middlewares/    # Auth, rate limiting, error handling
    │   ├── utils/          # Helpers (Cloudinary, etc.)
    │   └── db/             # Database connection
    └── server.js           # Entry point
```
