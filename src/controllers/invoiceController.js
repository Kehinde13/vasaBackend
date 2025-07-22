import Invoice from '../models/invoice.js';

// CREATE
export const createInvoice = async (req, res) => {
  try {
    const { client, amount, dueDate, recurrence, isPaid } = req.body;

    if (!client || !amount || !dueDate || !req.user?.id) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const invoice = new Invoice({
      client,
      amount,
      dueDate,
      recurrence,
      isPaid,
      owner: req.user.id, // Injected from auth middleware
    });

    await invoice.save();
    res.status(201).json(invoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all invoices for the authenticated user
export const getUserInvoices = async (req, res) => {
  try {
    const userId = req.user.id;
    const invoices = await Invoice.find({ owner: userId }).sort({ createdAt: -1 });
    res.status(200).json(invoices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
};

// UPDATE
export const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true }
    );

    if (!invoice) return res.status(404).json({ error: "Invoice not found" });

    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};

// DELETE
export const deleteInvoice = async (req, res) => {
  try {
    const deleted = await Invoice.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!deleted) return res.status(404).json({ error: "Invoice not found" });

    res.json({ message: "Invoice deleted" });
  } catch (err) {
    res.status(500).json({ error: "Deletion failed" });
  }
};
