app.get('/api', (req, res) => {
    res.send('Server is running');
});

// Database Connection Pool
let pool;
try {
    if (process.env.MYSQL_HOST) {
        pool = mysql.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            port: process.env.MYSQL_PORT,
            ssl: {
                rejectUnauthorized: false
            }
        });
    } else {
        console.warn("Missing MYSQL_HOST environment variable");
    }
} catch (err) {
    console.error("Failed to create database pool:", err);
}

// Helper to check DB
const checkDb = (res) => {
    if (!pool) {
        res.status(500).json({ error: 'Database configuration missing or connection failed' });
        return false;
    }
    return true;
};

// LOGIN
app.post('/api/login', async (req, res) => {
    if (!checkDb(res)) return;
    try {
        const { phone, password } = req.body;
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE phone = ? AND password = ?',
            [phone, password]
        );

        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// REGISTER (User + First Assessment)
app.post('/api/register', async (req, res) => {
    if (!checkDb(res)) return;
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        const {
            nameEng, nameChi, dob, gender, address, email, phone, password,
            pacemaker, longTermMedication, medicationDetails, cancer, cancerDetails, pregnancy,
            hra101, itemBMI, itemBP, itemCardio, itemOxygen, consultation, concerns
        } = req.body;

        // 1. Check if user exists
        const [existing] = await conn.execute('SELECT id FROM users WHERE phone = ?', [phone]);
        if (existing.length > 0) {
            throw new Error('Phone number already registered');
        }

        // 2. Insert User
        const [userResult] = await conn.execute(
            `INSERT INTO users (nameEng, nameChi, dob, gender, address, email, phone, password) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [nameEng, nameChi, dob, gender, address, email, phone, password]
        );
        const userId = userResult.insertId;

        // 3. Insert Assessment
        await conn.execute(
            `INSERT INTO assessments (
                user_id, submission_date, pacemaker, long_term_medication, medication_details,
                cancer, cancer_details, pregnancy, hra101, item_bmi, item_bp, item_cardio,
                item_oxygen, consultation, concerns
            ) VALUES (?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId, pacemaker, longTermMedication, medicationDetails,
                cancer, cancerDetails, pregnancy, hra101, itemBMI, itemBP,
                itemCardio, itemOxygen, consultation, concerns
            ]
        );

        await conn.commit();
        res.json({ success: true, userId });

    } catch (err) {
        await conn.rollback();
        console.error(err);
        res.status(500).json({ error: err.message });
    } finally {
        conn.release();
    }
});

// GET HISTORY
app.get('/api/history/:userId', async (req, res) => {
    if (!checkDb(res)) return;
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM assessments WHERE user_id = ? ORDER BY submission_date DESC',
            [req.params.userId]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// UPDATE PROFILE
app.post('/api/update-profile', async (req, res) => {
    if (!checkDb(res)) return;
    try {
        const { userId, nameEng, password } = req.body;
        await pool.execute(
            'UPDATE users SET nameEng = ?, password = ? WHERE id = ?',
            [nameEng, password, userId]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

const PORT = process.env.PORT || 3001;

// Only listen if run directly (not imported)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;