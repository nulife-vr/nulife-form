const mysql = require('mysql2/promise');
require('dotenv').config();

const createTables = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            port: process.env.MYSQL_PORT,
            ssl: { rejectUnauthorized: false }
        });

        console.log('Connected to database.');

        // Create Users Table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nameEng VARCHAR(255),
                nameChi VARCHAR(255),
                dob VARCHAR(50),
                gender VARCHAR(10),
                address TEXT,
                email VARCHAR(255),
                phone VARCHAR(50) UNIQUE,
                password VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Users table checked/created.');

        // Create Assessments Table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS assessments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                pacemaker VARCHAR(10),
                long_term_medication VARCHAR(10),
                medication_details TEXT,
                cancer VARCHAR(10),
                cancer_details TEXT,
                pregnancy VARCHAR(10),
                hra101 BOOLEAN,
                item_bmi BOOLEAN,
                item_bp BOOLEAN,
                item_cardio BOOLEAN,
                item_oxygen BOOLEAN,
                consultation BOOLEAN,
                concerns TEXT,
                official_remarks TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);
        console.log('Assessments table checked/created.');

        await connection.end();
        console.log('Database initialization complete.');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
};

createTables();
