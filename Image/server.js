const express = require('express');
const Database = require('better-sqlite3');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Database initialization
const db = new Database('./shipments.db');
db.pragma('journal_mode = WAL');

console.log('✅ Connected to SQLite database');
initializeDatabase();

// Initialize database tables
function initializeDatabase() {
    try {
        // Shipments table
        db.exec(`CREATE TABLE IF NOT EXISTS shipments (
            id TEXT PRIMARY KEY,
            tracking_number TEXT UNIQUE,
            sender_name TEXT NOT NULL,
            sender_phone TEXT NOT NULL,
            sender_email TEXT,
            receiver_name TEXT NOT NULL,
            receiver_phone TEXT NOT NULL,
            receiver_email TEXT,
            origin_country TEXT NOT NULL,
            destination_country TEXT NOT NULL,
            package_description TEXT NOT NULL,
            package_weight TEXT NOT NULL,
            estimated_delivery TEXT NOT NULL,
            status TEXT DEFAULT 'Pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Page visits table
        db.exec(`CREATE TABLE IF NOT EXISTS page_visits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip_address TEXT,
            user_agent TEXT,
            page TEXT,
            visited_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Admin notifications table
        db.exec(`CREATE TABLE IF NOT EXISTS admin_notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT,
            message TEXT,
            related_shipment_id TEXT,
            is_read INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        console.log('✅ Database tables initialized');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
}

// Helper function to get client IP
function getClientIp(req) {
    return req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress;
}

// ============ LANDING PAGE TRACKING ============

app.get('/api/track-visit', (req, res) => {
    try {
        const ip = getClientIp(req);
        const userAgent = req.headers['user-agent'];
        const page = req.query.page || 'landing';

        const insertVisit = db.prepare(`
            INSERT INTO page_visits (ip_address, user_agent, page) VALUES (?, ?, ?)
        `);
        insertVisit.run(ip, userAgent, page);

        // Create notification for admin
        const insertNotif = db.prepare(`
            INSERT INTO admin_notifications (type, message, related_shipment_id) VALUES (?, ?, ?)
        `);
        insertNotif.run('page_visit', `New visitor on ${page} from ${ip}`, null);

        res.json({ success: true, message: 'Visit tracked' });
    } catch (err) {
        console.error('Error tracking visit:', err);
        res.status(500).json({ error: 'Failed to track visit' });
    }
});

// ============ SHIPMENT MANAGEMENT APIS ============

// Create new shipment
app.post('/api/shipments/create', (req, res) => {
    try {
        const {
            sender_name, sender_phone, sender_email,
            receiver_name, receiver_phone, receiver_email,
            origin_country, destination_country,
            package_description, package_weight, estimated_delivery
        } = req.body;

        // Validation
        if (!sender_name || !sender_phone || !receiver_name || !receiver_phone) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const shipmentId = uuidv4();
        const trackingNumber = 'TRK-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();

        const insertShipment = db.prepare(`
            INSERT INTO shipments (
                id, tracking_number, sender_name, sender_phone, sender_email,
                receiver_name, receiver_phone, receiver_email,
                origin_country, destination_country, package_description,
                package_weight, estimated_delivery, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        insertShipment.run(
            shipmentId, trackingNumber, sender_name, sender_phone, sender_email,
            receiver_name, receiver_phone, receiver_email,
            origin_country, destination_country, package_description,
            package_weight, estimated_delivery, 'Pending'
        );

        // Create admin notification
        const insertNotif = db.prepare(`
            INSERT INTO admin_notifications (type, message, related_shipment_id) VALUES (?, ?, ?)
        `);
        insertNotif.run('new_shipment', `New shipment created: ${trackingNumber}`, shipmentId);

        res.json({
            success: true,
            message: 'Shipment created successfully',
            shipmentId,
            trackingNumber
        });
    } catch (err) {
        console.error('Error creating shipment:', err);
        res.status(500).json({ error: 'Failed to create shipment' });
    }
});

// Get all shipments (for admin panel)
app.get('/api/shipments/all', (req, res) => {
    try {
        const getAll = db.prepare(`SELECT * FROM shipments ORDER BY created_at DESC`);
        const shipments = getAll.all();
        res.json({ success: true, shipments });
    } catch (err) {
        console.error('Error fetching shipments:', err);
        res.status(500).json({ error: 'Failed to fetch shipments' });
    }
});

// Get shipment by tracking number (for customer tracking)
app.get('/api/shipments/track/:trackingNumber', (req, res) => {
    try {
        const { trackingNumber } = req.params;

        const getShipment = db.prepare(`SELECT * FROM shipments WHERE tracking_number = ?`);
        const shipment = getShipment.get(trackingNumber);

        if (!shipment) {
            return res.status(404).json({ success: false, error: 'Shipment not found' });
        }

        res.json({ success: true, shipment });
    } catch (err) {
        console.error('Error fetching shipment:', err);
        res.status(500).json({ error: 'Failed to fetch shipment' });
    }
});

// Update shipment status
app.post('/api/shipments/update-status', (req, res) => {
    try {
        const { trackingNumber, status } = req.body;

        if (!trackingNumber || !status) {
            return res.status(400).json({ error: 'Tracking number and status required' });
        }

        const updateStatus = db.prepare(`
            UPDATE shipments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE tracking_number = ?
        `);
        const result = updateStatus.run(status, trackingNumber);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Shipment not found' });
        }

        // Create notification
        const insertNotif = db.prepare(`
            INSERT INTO admin_notifications (type, message, related_shipment_id) VALUES (?, ?, ?)
        `);
        insertNotif.run('status_update', `Shipment ${trackingNumber} status updated to ${status}`, trackingNumber);

        res.json({ success: true, message: 'Shipment status updated' });
    } catch (err) {
        console.error('Error updating shipment:', err);
        res.status(500).json({ error: 'Failed to update shipment' });
    }
});

// Delete shipment
app.post('/api/shipments/delete', (req, res) => {
    try {
        const { trackingNumber } = req.body;

        if (!trackingNumber) {
            return res.status(400).json({ error: 'Tracking number required' });
        }

        const deleteShipment = db.prepare(`DELETE FROM shipments WHERE tracking_number = ?`);
        const result = deleteShipment.run(trackingNumber);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Shipment not found' });
        }

        res.json({ success: true, message: 'Shipment deleted successfully' });
    } catch (err) {
        console.error('Error deleting shipment:', err);
        res.status(500).json({ error: 'Failed to delete shipment' });
    }
});

// ============ ADMIN NOTIFICATIONS ============

// Get all notifications
app.get('/api/admin/notifications', (req, res) => {
    try {
        const getNotif = db.prepare(`
            SELECT * FROM admin_notifications ORDER BY created_at DESC LIMIT 50
        `);
        const notifications = getNotif.all();
        res.json({ success: true, notifications });
    } catch (err) {
        console.error('Error fetching notifications:', err);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

// Mark notification as read
app.post('/api/admin/notifications/read', (req, res) => {
    try {
        const { id } = req.body;

        const markRead = db.prepare(`UPDATE admin_notifications SET is_read = 1 WHERE id = ?`);
        markRead.run(id);

        res.json({ success: true });
    } catch (err) {
        console.error('Error marking notification as read:', err);
        res.status(500).json({ error: 'Failed to update notification' });
    }
});

// Get dashboard statistics
app.get('/api/admin/stats', (req, res) => {
    try {
        const getTotalShipments = db.prepare(`SELECT COUNT(*) as total FROM shipments`);
        const getPendingShipments = db.prepare(`SELECT COUNT(*) as count FROM shipments WHERE status = 'Pending'`);
        const getDeliveredShipments = db.prepare(`SELECT COUNT(*) as count FROM shipments WHERE status = 'Delivered'`);
        const getVisits24h = db.prepare(`
            SELECT COUNT(*) as count FROM page_visits WHERE visited_at > datetime('now', '-24 hours')
        `);

        const stats = {
            totalShipments: getTotalShipments.get().total,
            pendingShipments: getPendingShipments.get().count,
            deliveredShipments: getDeliveredShipments.get().count,
            visitsLast24h: getVisits24h.get().count
        };

        res.json({ success: true, stats });
    } catch (err) {
        console.error('Error fetching stats:', err);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// ============ SERVER START ============

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║   🚀 Shipping Backend Server Started   ║
╚════════════════════════════════════════╝

🌐 Main Website:        http://localhost:${PORT}
📦 Admin Panel:         http://localhost:${PORT}/admin.html
🔍 Tracking Page:       http://localhost:${PORT}/tracking.html

📝 API Endpoints:
   POST   /api/shipments/create
   GET    /api/shipments/all
   GET    /api/shipments/track/:trackingNumber
   POST   /api/shipments/update-status
   POST   /api/shipments/delete
   GET    /api/admin/notifications
   POST   /api/admin/notifications/read
   GET    /api/admin/stats
   GET    /api/track-visit

✅ Database: ./shipments.db
    `);
});
