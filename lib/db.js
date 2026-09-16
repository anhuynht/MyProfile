// Database layer with native PostgreSQL support and serverless-safe local fallback store
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

let pool = null;

export function getPool() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) return null;

  if (!pool) {
    try {
      pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000,
      });
    } catch (err) {
      console.warn('[DB] Could not initialize PostgreSQL Pool:', err.message);
      return null;
    }
  }
  return pool;
}

// Local fallback store file (safely points to /tmp on Vercel / serverless environments)
const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.VERCEL_ENV);
const dataDir = isServerless ? path.join('/tmp', '.data') : path.join(process.cwd(), '.data');
const storeFile = path.join(dataDir, 'portfolio_db.json');

function initLocalStore() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(storeFile)) {
    const initialData = {
      jd_match_logs: [],
      appointments: [],
      resume_requests: [],
      system_settings: {
        gemini_api_key: process.env.GEMINI_API_KEY || '',
        gemini_model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
        gcp_project_id: process.env.GCP_PROJECT_ID || 'gen-lang-client-0192964575',
        gcp_location: process.env.GCP_LOCATION || 'asia-southeast1',
        smtp_host: process.env.SMTP_HOST || 'smtp.gmail.com',
        smtp_port: parseInt(process.env.SMTP_PORT || '465'),
        smtp_secure: true,
        smtp_user: process.env.SMTP_USER || '',
        smtp_pass: process.env.SMTP_PASS || '',
        notification_email: 'an.huynht@gmail.com',
        notify_on_booking: true,
        notify_on_matching: true,
        notify_on_resume: true,
        custom_system_prompt: process.env.CUSTOM_SYSTEM_PROMPT || '',
      },
      admin_users: [
        {
          id: 1,
          email: 'an.huynht@gmail.com',
          // Default hashed password for 'ThienAn@CIO2026!'
          password_hash: '$2b$10$STJ5MZ2wvziTy1/CuNPfWuWExNZmATUBaW60EwwAL0r4PCZypmt.y',
          name: 'Huỳnh Thiên An',
          created_at: new Date().toISOString()
        }
      ]
    };
    fs.writeFileSync(storeFile, JSON.stringify(initialData, null, 2));
  }
}

function readLocalStore() {
  initLocalStore();
  try {
    const raw = fs.readFileSync(storeFile, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local store:', err);
    return { jd_match_logs: [], appointments: [], resume_requests: [], system_settings: {}, admin_users: [] };
  }
}

function writeLocalStore(data) {
  initLocalStore();
  fs.writeFileSync(storeFile, JSON.stringify(data, null, 2));
}

// PostgreSQL Schema Migration
export async function initDatabase() {
  const p = getPool();
  if (!p) {
    initLocalStore();
    return;
  }

  try {
    const client = await p.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS jd_match_logs (
          id SERIAL PRIMARY KEY,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          user_name VARCHAR(255) NOT NULL,
          user_email VARCHAR(255) NOT NULL,
          company_name VARCHAR(255),
          job_title VARCHAR(255),
          jd_filename VARCHAR(255),
          jd_text TEXT,
          match_score INTEGER,
          ai_result JSONB,
          ip_address VARCHAR(64)
        );

        CREATE TABLE IF NOT EXISTS appointments (
          id SERIAL PRIMARY KEY,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(64),
          company VARCHAR(255),
          meeting_type VARCHAR(100),
          topic VARCHAR(255),
          preferred_date VARCHAR(50),
          preferred_time VARCHAR(50),
          notes TEXT,
          status VARCHAR(50) DEFAULT 'pending'
        );

        CREATE TABLE IF NOT EXISTS resume_requests (
          id SERIAL PRIMARY KEY,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          company VARCHAR(255),
          role VARCHAR(255),
          purpose VARCHAR(255),
          downloaded BOOLEAN DEFAULT TRUE
        );

        CREATE TABLE IF NOT EXISTS system_settings (
          key VARCHAR(100) PRIMARY KEY,
          value JSONB,
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS admin_users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          name VARCHAR(255),
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      // Seed default settings if empty
      const settingsCheck = await client.query('SELECT value FROM system_settings WHERE key = $1', ['app_config']);
      if (settingsCheck.rows.length === 0) {
        const defaultSettings = {
          gemini_api_key: process.env.GEMINI_API_KEY || '',
          gemini_model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
          gcp_project_id: process.env.GCP_PROJECT_ID || 'gen-lang-client-0192964575',
          gcp_location: process.env.GCP_LOCATION || 'asia-southeast1',
          smtp_host: process.env.SMTP_HOST || 'smtp.gmail.com',
          smtp_port: parseInt(process.env.SMTP_PORT || '465'),
          smtp_secure: true,
          smtp_user: process.env.SMTP_USER || '',
          smtp_pass: process.env.SMTP_PASS || '',
          notification_email: 'an.huynht@gmail.com',
          notify_on_booking: true,
          notify_on_matching: true,
          notify_on_resume: true,
          custom_system_prompt: '',
        };
        await client.query('INSERT INTO system_settings (key, value) VALUES ($1, $2)', ['app_config', JSON.stringify(defaultSettings)]);
      }

      // Seed default admin if empty
      const adminCheck = await client.query('SELECT id FROM admin_users WHERE email = $1', ['an.huynht@gmail.com']);
      if (adminCheck.rows.length === 0) {
        await client.query(`
          INSERT INTO admin_users (email, password_hash, name)
          VALUES ($1, $2, $3)
        `, ['an.huynht@gmail.com', '$2b$10$STJ5MZ2wvziTy1/CuNPfWuWExNZmATUBaW60EwwAL0r4PCZypmt.y', 'Huỳnh Thiên An']);
      }
      console.log('[DB] PostgreSQL tables checked & verified.');
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('[DB] PostgreSQL init error:', err.message);
    initLocalStore();
  }
}

// ----------------- CRUD Operations -----------------

// JD Match Logs
export async function insertMatchLog({ userName, userEmail, companyName, jobTitle, jdFilename, jdText, matchScore, aiResult, ipAddress }) {
  const cleanJdText = typeof jdText === 'string' ? jdText.replace(/\0/g, '') : '';
  const p = getPool();
  if (p) {
    const res = await p.query(
      `INSERT INTO jd_match_logs (user_name, user_email, company_name, job_title, jd_filename, jd_text, match_score, ai_result, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [userName, userEmail, companyName, jobTitle, jdFilename, cleanJdText, matchScore, JSON.stringify(aiResult), ipAddress]
    );
    return res.rows[0];
  } else {
    const store = readLocalStore();
    const newLog = {
      id: store.jd_match_logs.length > 0 ? Math.max(...store.jd_match_logs.map(l => l.id)) + 1 : 1,
      created_at: new Date().toISOString(),
      user_name: userName,
      user_email: userEmail,
      company_name: companyName,
      job_title: jobTitle,
      jd_filename: jdFilename,
      jd_text: jdText,
      match_score: matchScore,
      ai_result: aiResult,
      ip_address: ipAddress,
    };
    store.jd_match_logs.unshift(newLog);
    writeLocalStore(store);
    return newLog;
  }
}

export async function getMatchLogs(limit = 100) {
  const p = getPool();
  if (p) {
    const res = await p.query('SELECT * FROM jd_match_logs ORDER BY created_at DESC LIMIT $1', [limit]);
    return res.rows;
  } else {
    const store = readLocalStore();
    return store.jd_match_logs.slice(0, limit);
  }
}

export async function getMatchLogById(id) {
  const p = getPool();
  if (p) {
    const res = await p.query('SELECT * FROM jd_match_logs WHERE id = $1', [id]);
    return res.rows[0] || null;
  } else {
    const store = readLocalStore();
    return store.jd_match_logs.find(l => l.id === parseInt(id)) || null;
  }
}

// Appointments
export async function insertAppointment({ name, email, phone, company, meetingType, topic, preferredDate, preferredTime, notes }) {
  const p = getPool();
  if (p) {
    const res = await p.query(
      `INSERT INTO appointments (name, email, phone, company, meeting_type, topic, preferred_date, preferred_time, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending') RETURNING *`,
      [name, email, phone, company, meetingType, topic, preferredDate, preferredTime, notes]
    );
    return res.rows[0];
  } else {
    const store = readLocalStore();
    const newAppt = {
      id: store.appointments.length > 0 ? Math.max(...store.appointments.map(a => a.id)) + 1 : 1,
      created_at: new Date().toISOString(),
      name,
      email,
      phone,
      company,
      meeting_type: meetingType,
      topic,
      preferred_date: preferredDate,
      preferred_time: preferredTime,
      notes,
      status: 'pending'
    };
    store.appointments.unshift(newAppt);
    writeLocalStore(store);
    return newAppt;
  }
}

export async function getAppointments(limit = 100) {
  const p = getPool();
  if (p) {
    const res = await p.query('SELECT * FROM appointments ORDER BY created_at DESC LIMIT $1', [limit]);
    return res.rows;
  } else {
    const store = readLocalStore();
    return store.appointments.slice(0, limit);
  }
}

export async function updateAppointmentStatus(id, status) {
  const p = getPool();
  if (p) {
    const res = await p.query('UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
    return res.rows[0];
  } else {
    const store = readLocalStore();
    const appt = store.appointments.find(a => a.id === parseInt(id));
    if (appt) {
      appt.status = status;
      writeLocalStore(store);
    }
    return appt;
  }
}

// Resume Requests
export async function insertResumeRequest({ name, email, company, role, purpose }) {
  const p = getPool();
  if (p) {
    const res = await p.query(
      `INSERT INTO resume_requests (name, email, company, role, purpose, downloaded)
       VALUES ($1, $2, $3, $4, $5, true) RETURNING *`,
      [name, email, company, role, purpose]
    );
    return res.rows[0];
  } else {
    const store = readLocalStore();
    const newReq = {
      id: store.resume_requests.length > 0 ? Math.max(...store.resume_requests.map(r => r.id)) + 1 : 1,
      created_at: new Date().toISOString(),
      name,
      email,
      company,
      role,
      purpose,
      downloaded: true
    };
    store.resume_requests.unshift(newReq);
    writeLocalStore(store);
    return newReq;
  }
}

export async function getResumeRequests(limit = 100) {
  const p = getPool();
  if (p) {
    const res = await p.query('SELECT * FROM resume_requests ORDER BY created_at DESC LIMIT $1', [limit]);
    return res.rows;
  } else {
    const store = readLocalStore();
    return store.resume_requests.slice(0, limit);
  }
}

// System Settings
export async function getSystemSettings() {
  const p = getPool();
  if (p) {
    const res = await p.query('SELECT value FROM system_settings WHERE key = $1', ['app_config']);
    if (res.rows.length > 0) {
      return typeof res.rows[0].value === 'string' ? JSON.parse(res.rows[0].value) : res.rows[0].value;
    }
  }
  const store = readLocalStore();
  return store.system_settings || {};
}

export async function updateSystemSettings(newSettings) {
  const p = getPool();
  if (p) {
    const current = await getSystemSettings();
    const updated = { ...current, ...newSettings };
    await p.query(
      `INSERT INTO system_settings (key, value, updated_at)
       VALUES ('app_config', $1, NOW())
       ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()`,
      [JSON.stringify(updated)]
    );
    return updated;
  } else {
    const store = readLocalStore();
    store.system_settings = { ...store.system_settings, ...newSettings };
    writeLocalStore(store);
    return store.system_settings;
  }
}

// Admin Auth
export async function getAdminByEmail(email) {
  const p = getPool();
  if (p) {
    const res = await p.query('SELECT * FROM admin_users WHERE email = $1', [email]);
    return res.rows[0] || null;
  } else {
    const store = readLocalStore();
    return store.admin_users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }
}

export async function updateAdminPassword(email, newHashedPassword) {
  const p = getPool();
  if (p) {
    const res = await p.query('UPDATE admin_users SET password_hash = $1 WHERE email = $2 RETURNING id, email, name', [newHashedPassword, email]);
    return res.rows[0];
  } else {
    const store = readLocalStore();
    const user = store.admin_users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      user.password_hash = newHashedPassword;
      writeLocalStore(store);
    }
    return user;
  }
}
