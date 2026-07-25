# 🚀 Quick Start Guide - Depot Shipping Website

## ✅ System Status: FULLY OPERATIONAL

**Backend Server**: Running on http://localhost:3000 ✅
**Database**: Active with SQLite (shipments.db) ✅
**All Pages**: Accessible and functional ✅

---

## 🌐 Access Your Website

### 1️⃣ Main Landing Page
**URL**: http://localhost:3000
- Professional shipping company website
- 12 responsive sections
- Services, testimonials, pricing, contact form
- Track package form
- Mobile-friendly design

### 2️⃣ Admin Panel
**URL**: http://localhost:3000/admin.html
- Create new shipments
- Manage all shipments
- View real-time notifications
- See dashboard statistics
- Update shipment status

### 3️⃣ Customer Tracking Page
**URL**: http://localhost:3000/tracking.html
- Navy blue theme
- Search by tracking number
- View detailed shipment information
- See progress timeline
- Print or download receipt

---

## 📝 Quick Workflow

### Step 1: Create a Shipment
1. Open **Admin Panel**: http://localhost:3000/admin.html
2. Click "📝 Create Shipment" in the sidebar
3. Fill out the form:
   - **Sender**: Name, Phone, Email
   - **Receiver**: Name, Phone, Email
   - **Shipment**: Country, Package details, Weight, Delivery date
4. Click "✅ Create Shipment"
5. **Copy the tracking number** (e.g., TRK-1784803701233-33GWOQ9MS)

### Step 2: Track the Shipment
1. Open **Tracking Page**: http://localhost:3000/tracking.html
2. Paste the tracking number in the search box
3. Press Enter or click "Track Now"
4. View complete shipment details:
   - Sender & receiver information
   - Package details
   - Current status
   - Delivery progress timeline

### Step 3: Update Shipment Status
1. Open **Admin Panel**: http://localhost:3000/admin.html
2. Click "📦 Manage Shipments" in the sidebar
3. Find your shipment in the list
4. Click the "Update" button
5. Select new status:
   - Pending → Processing → In Transit → Out for Delivery → Delivered
6. Click "Save Changes"
7. **Refresh tracking page** - customer sees the update immediately!

### Step 4: View Notifications
1. Open **Admin Panel**: http://localhost:3000/admin.html
2. Click "🔔 Notifications" in the sidebar
3. See all real-time events:
   - 📦 New shipments created
   - 🔄 Status updates
   - 👁️ Visitor tracking
4. Notifications auto-refresh every 5 seconds

### Step 5: View Dashboard
1. Open **Admin Panel**: http://localhost:3000/admin.html
2. Click "📊 Dashboard" in the sidebar
3. See statistics:
   - Total shipments
   - Pending vs delivered
   - Visitors in last 24 hours
   - Recent activity

---

## 🎯 Key Features

### Frontend (Customer-Facing)
✅ Responsive design (works on mobile, tablet, desktop)
✅ Beautiful gradients and animations
✅ Package tracking search
✅ Contact form
✅ Service details and testimonials
✅ Fast loading (all static files)

### Admin Panel
✅ Professional dashboard interface
✅ Create shipments with full details
✅ Manage all shipments in real-time
✅ Update shipment status
✅ View all notifications
✅ See statistics at a glance
✅ Sidebar navigation

### Tracking Page (Navy Blue)
✅ Simple search interface
✅ Beautiful receipt display
✅ Status timeline visualization
✅ Sender & receiver details
✅ Print functionality
✅ Download receipt
✅ Share tracking link

### Backend
✅ REST API for all operations
✅ SQLite database (auto-created)
✅ Real-time notifications
✅ Visitor tracking
✅ Data validation
✅ Error handling

---

## 💾 Database Status

**Location**: C:\Users\ezeor\AppData\Local\Temp\shipping-website\shipments.db

**Tables**:
- 📦 **shipments** (1 record) - All shipment data
- 👁️ **page_visits** (0 records) - Landing page visitor tracking
- 🔔 **admin_notifications** (1 record) - Event log

**Size**: ~50 KB (grows with each shipment)

---

## 🔌 API Endpoints for Developers

### POST /api/shipments/create
Create a new shipment
```bash
curl -X POST http://localhost:3000/api/shipments/create \
  -H "Content-Type: application/json" \
  -d '{
    "sender_name": "John",
    "sender_phone": "+1-800-555-0123",
    "sender_email": "john@example.com",
    "receiver_name": "Jane",
    "receiver_phone": "+44-207-946-0958",
    "receiver_email": "jane@example.com",
    "origin_country": "USA",
    "destination_country": "UK",
    "package_description": "Laptop",
    "package_weight": "2.5 kg",
    "estimated_delivery": "2024-12-31"
  }'
```

### GET /api/shipments/track/:trackingNumber
Track a shipment
```bash
curl http://localhost:3000/api/shipments/track/TRK-1784803701233-33GWOQ9MS
```

### POST /api/shipments/update-status
Update shipment status
```bash
curl -X POST http://localhost:3000/api/shipments/update-status \
  -H "Content-Type: application/json" \
  -d '{
    "trackingNumber": "TRK-1784803701233-33GWOQ9MS",
    "status": "In Transit"
  }'
```

### GET /api/admin/stats
Get dashboard statistics
```bash
curl http://localhost:3000/api/admin/stats
```

### GET /api/admin/notifications
Get all notifications
```bash
curl http://localhost:3000/api/admin/notifications
```

---

## 🎨 Color Scheme Reference

### Website (Purple/Blue)
- Primary Blue: `#0066cc`
- Secondary Purple: `#667eea`
- Dark Purple: `#764ba2`

### Admin Panel
- Sidebar: Dark gray `#1a1a2e`
- Header: Blue gradient
- Cards: White with shadows

### Tracking Page (Navy Blue)
- Primary Navy: `#001a4d`
- Secondary Navy: `#003366`
- Text: White
- Accents: Light colors

---

## 🚀 Server Management

### Start the Server
```bash
cd C:\Users\ezeor\AppData\Local\Temp\shipping-website
npm start
```

### Stop the Server
- Press **Ctrl+C** in the terminal

### Check Server Status
```bash
curl http://localhost:3000
# Returns HTTP 200 if running
```

### Clear Database (Start Fresh)
```bash
rm shipments.db
npm start
# Creates fresh database
```

---

## 🐛 Troubleshooting

**Q: "Cannot reach http://localhost:3000"**
A: Start the server with `npm start`

**Q: "Shipment not found" when tracking**
A: Create a shipment first in the admin panel

**Q: Admin panel shows loading spinner**
A: Wait a few seconds, then refresh the page

**Q: Port 3000 already in use**
A: Kill the process: `netstat -ano | findstr :3000`

---

## 📊 Example Test Data

### Sample Shipment
```
Sender: John Smith (+1-800-555-0123)
Receiver: Jane Doe (+44-207-946-0958)
From: United States
To: United Kingdom
Package: Electronics - Laptop
Weight: 2.5 kg
Delivery: 2024-12-31
Status: Pending → In Transit → Delivered
```

### Create this via Admin Panel
1. Go to http://localhost:3000/admin.html
2. Click "Create Shipment"
3. Use data above
4. Click "Create Shipment"
5. Note the tracking number
6. Go to http://localhost:3000/tracking.html
7. Paste tracking number
8. See full details!

---

## 📱 Mobile Testing

All pages are **fully responsive**:
- ✅ Works on iPhone/Android
- ✅ Hamburger menu on mobile
- ✅ Touch-friendly buttons
- ✅ Readable text sizes
- ✅ Optimized images

**Test on mobile**:
1. Keep backend running on desktop
2. Find your computer's IP: `ipconfig` (look for IPv4 Address)
3. On mobile, visit: `http://YOUR_IP:3000`
4. Example: `http://192.168.1.100:3000`

---

## 🔐 Security Notes

**For Development Only** ⚠️
- No authentication (add before production)
- No password protection on admin panel
- CORS enabled for all origins
- No input sanitization (add validation before production)

**Before Deployment**:
1. Add user authentication
2. Add HTTPS/SSL certificates
3. Validate all inputs
4. Rate limit API calls
5. Back up database regularly
6. Use environment variables for secrets

---

## 📚 File Reference

```
shipping-website/
├── index.html           (Main website - 14 KB)
├── admin.html           (Admin panel - 30 KB)
├── tracking.html        (Tracking page - 24 KB)
├── styles.css           (Styling - 12.5 KB)
├── script.js            (JavaScript - 4.8 KB)
├── server.js            (Backend - 11.5 KB)
├── package.json         (Dependencies)
├── package-lock.json    (Dependency lock)
├── README.md            (Full documentation)
├── QUICKSTART.md        (This file)
├── shipments.db         (SQLite database)
└── node_modules/        (npm packages - 124)
```

---

## ✨ Next Steps

### Short Term
1. ✅ Create and track test shipments
2. ✅ Test admin panel functionality
3. ✅ View notifications in real-time
4. ✅ Update shipment statuses
5. ✅ Print/download receipts

### Medium Term
1. 🔜 Add email notifications
2. 🔜 Add admin authentication
3. 🔜 Customize branding
4. 🔜 Add more fields/validation
5. 🔜 Deploy to production

### Long Term
1. 🔜 Mobile app (React Native)
2. 🔜 Payment integration
3. 🔜 SMS notifications
4. 🔜 Analytics dashboard
5. 🔜 Multi-user support

---

## 💬 Support

**Having issues?**
1. Check if backend is running: `npm start`
2. Check console (F12) for JavaScript errors
3. Check browser network tab for API errors
4. Read full README.md for detailed docs
5. Test API endpoints directly with curl

---

## 📞 Contact

- **Main Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin.html
- **Tracking**: http://localhost:3000/tracking.html
- **Backend**: http://localhost:3000/api/*

---

**Status**: ✅ **READY TO USE**
**Last Updated**: July 23, 2026
**Version**: 1.0.0

Enjoy your shipping management system! 🚀
