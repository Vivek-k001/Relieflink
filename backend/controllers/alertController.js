const DisasterAlert = require('../models/DisasterAlert');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc  Create disaster alert (admin/ngo)
// @route POST /api/alerts
const createAlert = async (req, res) => {
  try {
    const { title, message, disasterType, severity, affectedAreas, broadcastZone, radius, expiresAt, actionRequired, evacuationRoute } = req.body;

    const alert = await DisasterAlert.create({
      issuedBy: req.user._id,
      title, message, disasterType, severity,
      affectedAreas: affectedAreas || [],
      broadcastZone,
      radius,
      expiresAt,
      actionRequired,
      evacuationRoute,
    });

    // Broadcast to all connected users via socket
    const io = req.app.get('io');
    if (io) {
      io.emit('new_alert', {
        alertId: alert._id,
        title: alert.title,
        message: alert.message,
        severity: alert.severity,
        disasterType: alert.disasterType,
        affectedAreas: alert.affectedAreas,
      });
    }

    // Create notifications for all users (bulk)
    const users = await User.find({ isActive: true }, '_id');
    const notifications = users.map((u) => ({
      userId: u._id,
      title: `⚠️ ${alert.title}`,
      message: alert.message,
      type: 'alert',
      relatedId: alert._id,
    }));
    await Notification.insertMany(notifications);

    res.status(201).json({ success: true, alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get active alerts
// @route GET /api/alerts
const getAlerts = async (req, res) => {
  try {
    const { active, disasterType } = req.query;
    let query = {};
    if (active === 'true') {
      query.isActive = true;
      query.$or = [{ expiresAt: { $gt: new Date() } }, { expiresAt: null }];
    }
    if (disasterType) query.disasterType = disasterType;

    const alerts = await DisasterAlert.find(query)
      .populate('issuedBy', 'name role')
      .sort({ createdAt: -1 });
    res.json({ success: true, alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get single alert
// @route GET /api/alerts/:id
const getAlertById = async (req, res) => {
  try {
    const alert = await DisasterAlert.findById(req.params.id).populate('issuedBy', 'name role');
    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' });
    res.json({ success: true, alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Deactivate alert
// @route PUT /api/alerts/:id/deactivate
const deactivateAlert = async (req, res) => {
  try {
    const alert = await DisasterAlert.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    const io = req.app.get('io');
    if (io) io.emit('alert_deactivated', { alertId: alert._id });
    res.json({ success: true, alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createAlert, getAlerts, getAlertById, deactivateAlert };
