import jwt from 'jsonwebtoken';
import Client from '../models/clients.js';
import bcrypt from 'bcryptjs';

const generateToken = (client) => {
  return jwt.sign(
    { id: client._id, email: client.email, role: client.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// REGISTER
export const registerClient = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const client = new Client({ ...req.body, password: hashedPassword });
    await client.save();

    const token = generateToken(client);

    const user = {
      id: client._id,
      fullName: client.fullName,
      email: client.email,
      businessName: client.businessName,
      role: client.role,
      phone: client.phone,
      timeZone: client.timeZone,
    };

    res.status(201).json({ token, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// LOGIN
export const loginClient = async (req, res) => {
  try {
    const { email, password } = req.body;

    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(client);

    const user = {
      id: client._id,
      fullName: client.fullName,
      email: client.email,
      businessName: client.businessName,
      role: client.role,
      phone: client.phone,
      timeZone: client.timeZone,
    };

    res.status(200).json({ token, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// LOGOUT
export const logoutClient = (req, res) => {
  res.status(200).json({ message: 'Logout successful.' });
};
