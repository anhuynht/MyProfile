// Authentication & JWT helpers for Admin Dashboard
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getAdminByEmail } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'huynh-thien-an-executive-portfolio-secret-2026';

export async function verifyAdminCredentials(email, password) {
  const defaultAdminPassword = process.env.ADMIN_PASSWORD || 'ThienAn@CIO2026!';
  const admin = await getAdminByEmail(email);

  if (!admin) {
    // If not found in DB yet, check against default admin email and configured password
    if (email.toLowerCase() === 'an.huynht@gmail.com' && password === defaultAdminPassword) {
      return { id: 1, email: 'an.huynht@gmail.com', name: 'Huỳnh Thiên An' };
    }
    return null;
  }

  // 1. Check bcrypt hash stored in DB
  const isValid = await bcrypt.compare(password, admin.password_hash);
  if (isValid) {
    return { id: admin.id, email: admin.email, name: admin.name };
  }

  // 2. Also check if configured ADMIN_PASSWORD matches
  if (password === defaultAdminPassword) {
    return { id: admin.id, email: admin.email, name: admin.name };
  }

  return null;
}

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export function getAdminFromRequest(request) {
  // Check cookie or header
  const authHeader = request.headers.get('authorization');
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    // Try cookie
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/admin_token=([^;]+)/);
    if (match) {
      token = match[1];
    }
  }

  if (!token) return null;
  return verifyToken(token);
}
