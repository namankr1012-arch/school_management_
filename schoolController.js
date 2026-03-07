// src/controllers/schoolController.js
const { pool } = require('./database');

/**
 * Haversine formula — calculates great-circle distance (km) between two coordinates.
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * POST /addSchool
 * Adds a new school to the database.
 */
async function addSchool(req, res) {
  try {
    const { name, address, latitude, longitude } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name.trim(), address.trim(), parseFloat(latitude), parseFloat(longitude)]
    );

    const [rows] = await pool.execute('SELECT * FROM schools WHERE id = ?', [result.insertId]);

    return res.status(201).json({
      success: true,
      message: 'School added successfully',
      data: rows[0],
    });
  } catch (error) {
    console.error('addSchool error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while adding school',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

/**
 * GET /listSchools?latitude=<lat>&longitude=<lon>
 * Returns all schools sorted by proximity to the given coordinates.
 */
async function listSchools(req, res) {
  try {
    const userLat = parseFloat(req.query.latitude);
    const userLon = parseFloat(req.query.longitude);

    const [schools] = await pool.execute('SELECT * FROM schools');

    const schoolsWithDistance = schools.map((school) => ({
      ...school,
      distance_km: parseFloat(
        calculateDistance(userLat, userLon, school.latitude, school.longitude).toFixed(2)
      ),
    }));

    schoolsWithDistance.sort((a, b) => a.distance_km - b.distance_km);

    return res.status(200).json({
      success: true,
      message: 'Schools retrieved successfully',
      user_location: { latitude: userLat, longitude: userLon },
      total: schoolsWithDistance.length,
      data: schoolsWithDistance,
    });
  } catch (error) {
    console.error('listSchools error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching schools',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

module.exports = { addSchool, listSchools };
