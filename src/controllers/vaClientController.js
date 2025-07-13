// controllers/vaClients.js
import VaClient from '../models/vaClient.js';

export const createVaClient = async (req, res) => {
  try {
    const newClient = new VaClient({
      ...req.body,
      owner: req.user.id
    });
    const savedClient = await newClient.save();
    res.status(201).json(savedClient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getVaClients = async (req, res) => {
  try {
    const clients = await VaClient.find({ owner: req.user.id });
    res.status(200).json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateVaClient = async (req, res) => {
  try {
    const updated = await VaClient.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(403).json({ error: 'Forbidden' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteVaClient = async (req, res) => {
  try {
    const deleted = await VaClient.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id
    });
    if (!deleted) return res.status(403).json({ error: 'Forbidden' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
