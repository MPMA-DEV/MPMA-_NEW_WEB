// ============================================
// SETUP SQLITE DATABASE
// Creates basic tables for development
// ============================================

const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

const setupDatabase = async () => {
    try {
        console.log('Setting up SQLite database...');

        const db = await open({
            filename: path.join(__dirname, 'database', 'dev.db'),
            driver: sqlite3.Database
        });

        // Create admins table
        await db.exec(`
            CREATE TABLE IF NOT EXISTS admins (
                admin_id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                full_name TEXT NOT NULL,
                role TEXT DEFAULT 'admin',
                is_active INTEGER DEFAULT 1,
                last_login TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create courses table
        await db.exec(`
            CREATE TABLE IF NOT EXISTS courses (
                course_id INTEGER PRIMARY KEY AUTOINCREMENT,
                course_code TEXT UNIQUE NOT NULL,
                course_name TEXT NOT NULL,
                category TEXT NOT NULL,
                description TEXT,
                duration TEXT,
                duration_months INTEGER,
                eligibility TEXT,
                fee REAL,
                course_image TEXT,
                syllabus_pdf TEXT,
                is_active INTEGER DEFAULT 1,
                enrollment_count INTEGER DEFAULT 0,
                created_by INTEGER,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create registrations table
        await db.exec(`
            CREATE TABLE IF NOT EXISTS registrations (
                registration_id INTEGER PRIMARY KEY AUTOINCREMENT,
                registration_number TEXT UNIQUE NOT NULL,
                full_name TEXT NOT NULL,
                name_with_initials TEXT,
                date_of_birth TEXT NOT NULL,
                gender TEXT NOT NULL,
                nationality TEXT DEFAULT 'Sri Lankan',
                nic_number TEXT UNIQUE NOT NULL,
                passport_number TEXT,
                email TEXT NOT NULL,
                phone_mobile TEXT NOT NULL,
                phone_home TEXT,
                address_line1 TEXT NOT NULL,
                address_line2 TEXT,
                city TEXT NOT NULL,
                postal_code TEXT,
                course_id INTEGER NOT NULL,
                preferred_start_date TEXT,
                highest_qualification TEXT,
                institution_name TEXT,
                year_of_completion INTEGER,
                nic_copy TEXT,
                passport_photo TEXT,
                educational_certificates TEXT,
                medical_certificate TEXT,
                emergency_contact_name TEXT,
                emergency_contact_phone TEXT,
                emergency_contact_relationship TEXT,
                previous_maritime_experience TEXT,
                additional_notes TEXT,
                status TEXT DEFAULT 'pending',
                payment_status TEXT DEFAULT 'pending',
                reviewed_by INTEGER,
                reviewed_at TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (course_id) REFERENCES courses(course_id),
                FOREIGN KEY (reviewed_by) REFERENCES admins(admin_id)
            )
        `);

        console.log('✅ Database tables created successfully!');
        await db.close();

    } catch (error) {
        console.error('❌ Error setting up database:', error);
        process.exit(1);
    }
};

setupDatabase();