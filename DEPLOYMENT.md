# 🚀 Deployment Guide - Es Teh Cashier

## ✅ Pre-Deployment Checklist

### 1. Environment Variables
Pastikan file `.env` sudah ada dengan variabel berikut:
```env
# Database (Neon PostgreSQL)
DATABASE_URL=your_neon_database_url

# NextAuth
AUTH_SECRET=your_secret_key_here
NEXTAUTH_URL=http://localhost:3000
```

### 2. Database Setup
- ✅ Neon PostgreSQL database sudah dibuat
- ✅ Schema sudah di-push: `npx drizzle-kit push`
- ✅ Database sudah di-seed: `npm run db:reset`

### 3. Code Quality
- ✅ Build test: `npm run build`
- ✅ No TypeScript errors
- ✅ No ESLint errors

---

## 🌐 Vercel Deployment Steps

### Step 1: Prepare Repository
```bash
# Commit semua perubahan
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Vercel Setup
1. Buka [vercel.com](https://vercel.com)
2. Login dengan GitHub
3. Click "Add New Project"
4. Import repository: `KreativLabs-id/esteh_cashier`

### Step 3: Configure Project
**Framework Preset:** Next.js
**Root Directory:** ./
**Build Command:** `npm run build`
**Output Directory:** .next

### Step 4: Environment Variables
Tambahkan di Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL = postgresql://...  (dari Neon)
AUTH_SECRET = generate_random_secret_here
NEXTAUTH_URL = https://your-app.vercel.app
```

**Generate AUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Step 5: Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Visit deployment URL

---

## 🗄️ Database Migration (Production)

Setelah deploy, jalankan seed di production:

### Option 1: Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Run seed command
vercel env pull .env.production
npx tsx scripts/reset-seed.ts
```

### Option 2: Via API Route
Buat endpoint `/api/admin/seed` untuk seed database dari browser.

---

## 🔐 Security Checklist

- ✅ AUTH_SECRET adalah random string yang kuat
- ✅ DATABASE_URL tidak di-commit ke Git
- ✅ .env ada di .gitignore
- ✅ Admin credentials sudah diganti dari default

---

## 📝 Post-Deployment

### 1. Test Login
- Admin: `admin` / `admin123`
- Kasir: `kasir1` / `cashier123`

### 2. Test Features
- ✅ Login/Logout
- ✅ POS Checkout
- ✅ Admin Dashboard
- ✅ Reports
- ✅ PDF Export

### 3. Performance
- Check Lighthouse score
- Test on mobile devices
- Verify all images load

---

## 🐛 Common Issues

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Database Connection
- Verify DATABASE_URL is correct
- Check Neon database is active
- Ensure IP whitelist allows Vercel

### Auth Issues
- Verify NEXTAUTH_URL matches deployment URL
- Check AUTH_SECRET is set
- Clear browser cookies

---

## 📊 Monitoring

### Vercel Analytics
- Enable in Project Settings
- Monitor performance
- Track errors

### Database
- Monitor Neon dashboard
- Check query performance
- Set up backups

---

## 🔄 Updates

### Deploy Updates
```bash
git add .
git commit -m "Update: description"
git push origin main
# Vercel auto-deploys
```

### Database Updates
```bash
# Update schema
npx drizzle-kit push

# Seed new data
npm run db:seed
```

---

## 📞 Support

**Issues?** Check:
1. Vercel deployment logs
2. Browser console
3. Network tab
4. Database logs

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Drizzle Docs: https://orm.drizzle.team

---

## ✨ Success!

Your app should now be live at: `https://your-app.vercel.app`

🎉 Congratulations on deploying Es Teh Cashier!
