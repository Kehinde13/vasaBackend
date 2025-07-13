// controllers/vaClients.js
import VaClient from '../models/vaClient.js';

// Create new VA client
export const createVaClient = async (req, res) => {
  try {
    const newClient = new VaClient({ ...req.body });
    const savedClient = await newClient.save();
    res.status(201).json(savedClient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all VA clients
export const getVaClients = async (req, res) => {
  try {
    const clients = await VaClient.find();
    res.status(200).json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update client
export const updateVaClient = async (req, res) => {
  try {
    const updatedClient = await VaClient.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    res.status(200).json(updatedClient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete client
export const deleteVaClient = async (req, res) => {
  try {
    await VaClient.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
