# Step-by-Step Installation Guide

Follow these steps exactly to get your Hostel Management System running.

## Step 1: Verify Prerequisites

### Check Node.js Installation
```bash
node --version
```
Should show v16.0.0 or higher. If not installed, download from https://nodejs.org/

### Check MongoDB Installation
```bash
mongod --version
```
If not installed, follow MongoDB installation guide for your OS.

## Step 2: Start MongoDB

### Windows
```bash
net start MongoDB
```

### Mac
```bash
brew services start mongodb-community
```

### Linux
```bash
sudo systemctl start mongod
sudo systemctl status mongod
```

Verify MongoDB is running on port 27017.

## Step 3: Clone/Download Project

If you have the project folder, navigate to it:
```bash
cd hostel-management-system
```

## Step 4: Backend Setup

### 4.1 Navigate to Server Directory
```bash
cd server
```

### 4.2 Install Dependencies
```bash
npm install
```

Wait for all packages to install. This may take 2-3 minutes.

### 4.3 Create Environment File
```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

### 4.4 Edit .env File

Open `.env` file in a text editor and update:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hostel_management
JWT_SECRET=your_super_secret_jwt_key_12345
JWT_EXPIRE=7d
NODE_ENV=development
```

**Important:** Change `JWT_SECRET` to a random string for security.

### 4.5 Seed Database (Optional but Recommended)
```bash
npm run seed
```

This will create:
- Admin user: admin@hostel.com / admin123
- Warden user: warden@hostel.com / warden123
- Student user: john@student.com / student123
- Sample rooms, payments, and complaints

### 4.6 Start Backend Server
```bash
npm run dev
```

You should see:
```
Server running in development mode on port 5000
MongoDB Connected: localhost
```

**Keep this terminal window open!**

## Step 5: Frontend Setup

### 5.1 Open New Terminal

Open a new terminal/command prompt window.

### 5.2 Navigate to Client Directory
```bash
cd hostel-management-system/client
```

### 5.3 Install Dependencies
```bash
npm install
```

Wait for all packages to install. This may take 2-3 minutes.

### 5.4 Create Environment File
```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

### 5.5 Edit .env File

Open `.env` file and verify:

```env
VITE_API_URL=http://localhost:5000/api
```

### 5.6 Start Frontend Server
```bash
npm run dev
```

You should see:
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:3000/
```

**Keep this terminal window open too!**

## Step 6: Access Application

### 6.1 Open Browser

Open your web browser (Chrome, Firefox, Edge, Safari)

### 6.2 Navigate to Application

Go to: **http://localhost:3000**

### 6.3 Login

If you ran the seed script, use:

**Admin Login:**
- Email: `admin@hostel.com`
- Password: `admin123`

**Or Register New User:**
- Click "Register here"
- Fill in the form
- Submit

## Step 7: Verify Everything Works

### Test Admin Features:
1. ✅ Dashboard shows statistics
2. ✅ Click "Students" - see list
3. ✅ Click "Add Student" - form opens
4. ✅ Click "Rooms" - see list
5. ✅ Click "Add Room" - form opens
6. ✅ Click "Payments" - see list
7. ✅ Click "Complaints" - see list
8. ✅ Click "Attendance" - see list

### Test Navigation:
1. ✅ Sidebar links work
2. ✅ Profile dropdown works
3. ✅ Logout works
4. ✅ Login again works

## Troubleshooting

### Problem: MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
1. Make sure MongoDB is running
2. Check MongoDB service status
3. Restart MongoDB service

### Problem: Port 5000 Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
1. Change PORT in `server/.env` to 5001
2. Update `client/.env` VITE_API_URL to use new port
3. Restart both servers

### Problem: Port 3000 Already in Use
```
Port 3000 is in use
```

**Solution:**
1. Vite will automatically suggest another port (like 3001)
2. Press 'y' to use the suggested port
3. Access application on the new port

### Problem: npm install Fails
```
npm ERR! code ENOENT
```

**Solution:**
1. Make sure you're in the correct directory
2. Check Node.js is installed: `node --version`
3. Clear npm cache: `npm cache clean --force`
4. Try again: `npm install`

### Problem: Cannot Find Module
```
Error: Cannot find module 'express'
```

**Solution:**
1. Delete `node_modules` folder
2. Delete `package-lock.json`
3. Run `npm install` again

### Problem: Frontend Shows Blank Page
```
White screen or no content
```

**Solution:**
1. Check browser console (F12) for errors
2. Make sure backend is running
3. Check VITE_API_URL in client/.env
4. Clear browser cache
5. Restart frontend server

### Problem: Login Not Working
```
Invalid credentials or network error
```

**Solution:**
1. Check backend is running on port 5000
2. Check MongoDB is running
3. Check browser console for errors
4. Verify credentials if using seed data
5. Try registering a new user

## Verification Checklist

Before considering installation complete, verify:

- [ ] MongoDB is running
- [ ] Backend server is running (port 5000)
- [ ] Frontend server is running (port 3000)
- [ ] Can access http://localhost:3000
- [ ] Can see login page
- [ ] Can login or register
- [ ] Dashboard loads with data
- [ ] Can navigate between pages
- [ ] Can open modals
- [ ] Can logout
- [ ] No errors in browser console
- [ ] No errors in backend terminal

## Next Steps

Once everything is working:

1. **Explore the Application**
   - Try all features
   - Test different user roles
   - Create, edit, delete records

2. **Read Documentation**
   - README.md for overview
   - API_DOCUMENTATION.md for API details
   - PROJECT_SUMMARY.md for features

3. **Customize**
   - Modify colors in tailwind.config.js
   - Add new features
   - Adjust business logic

4. **Deploy**
   - Follow SETUP_GUIDE.md for deployment
   - Use Render/Railway for backend
   - Use Vercel/Netlify for frontend

## Getting Help

If you encounter issues:

1. Check this guide again
2. Review error messages carefully
3. Check browser console (F12)
4. Check backend terminal logs
5. Verify all prerequisites are met
6. Try restarting servers
7. Try clearing cache and reinstalling

## Success!

If you can login and see the dashboard, congratulations! 🎉

Your Hostel Management System is now running successfully!

Enjoy managing your hostel! 🏠
