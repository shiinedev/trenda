# 🛍️ Trenda – Fullstack E-Commerce Platform  

Trenda is a modern fullstack e-commerce web application built with **Next.js 15**, **Prisma + MongoDB**, **Better Auth**, and **shadcn/ui**.  
It provides a seamless shopping experience for customers and a powerful admin dashboard for managing products, orders, and users.  

---

## 🚀 Features  

### 👤 Authentication  
- Secure authentication with **Better Auth** 
- **Google Login** via OAuth 2.0  
- Role-based access (Admin & User) with **middleware protection**  
- Session cookies with extended payload (role included for edge-safe checks)  

### 🛒 User Features  
- Browse products by categories  
- Grid/List product view toggle  
- Product reviews with rating summary  
- Add to cart and checkout flow  
- Order history  

### 🧑‍💻 Admin Features  
- Admin dashboard with role-based access control  
- Manage products (CRUD with images & categories)  
- Upload product images via **UploadThing** 
- Manage orders and update status  
- Sales analytics with charts (monthly sales, revenue, orders)  

### 🎨 UI/UX  
- Built with **shadcn/ui** components & Tailwind CSS  
- Skeleton loaders for smooth UX  
- Review and product card layouts (grid & list view)  

---

## 🛠️ Tech Stack  

- **Frontend:** [Next.js 15 (App Router)](https://nextjs.org/) + React + TailwindCSS  
- **UI Library:** [shadcn/ui](https://ui.shadcn.com/)  
- **Database:** MongoDB (via [Prisma ORM](https://www.prisma.io/))  
**Auth:** [Better Auth](https://better-auth.com/) with **Google OAuth** & session cookies  
- **Image Uploads:** [UploadThing](https://uploadthing.com/) for product image storage  
- **Deployment:** Vercel  

---

## 📦 Installation  

Clone the repo and install dependencies:  

```bash
git clone https://github.com/shiinedev/trenda.git
cd trenda
npm install  
```

### Setup environment variables in **.env**:
```bash
DATABASE_URL="mongodb+srv://..."
BETTER_AUTH_SECRET="your-secret"
BETTER_AUTH_URL="http://localhost:3000",
GOOGLE_CLIENT_ID="your-google-clientId"
GOOGLE_CLIENT_SECRET="your-google-secret"
UPLOADTHING_TOKEN="your=uploadthing-token"
```


## 📜 License

MIT License © 2025 shiinedev
