// controllers/dailyPlanController.js
import DailyPlan from "../models/dailyPlan.js";

/**
 * Get daily plan by owner and date
 */
export const getDailyPlan = async (req, res) => {
  try {
    const owner = req.user.id; 
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: "Date is required" });

    const plan = await DailyPlan.findOne({ owner, date });
    res.json(plan || { events: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch daily plan" });
  }
};

/**
 * Upsert (add or update) a single block in daily plan
 */
export const upsertBlock = async (req, res) => {
  try {
    const owner = req.user.id;
    const { date, editingId, block } = req.body;

    if (!date || !block) return res.status(400).json({ error: "Date and block required" });

    let plan = await DailyPlan.findOne({ owner, date });
    if (!plan) {
      plan = new DailyPlan({ owner, date, events: [] });
    }

    if (editingId) {
      // Update existing block
      const idx = plan.events.findIndex((e) => e._id.toString() === editingId);
      if (idx === -1) return res.status(404).json({ error: "Block not found" });
      plan.events[idx].title = block.title;
      plan.events[idx].type = block.type;
      plan.events[idx].timeBlock = block.timeBlock;
    } else {
      // Add new block
      plan.events.push(block);
    }

    await plan.save();
    res.json(plan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save block" });
  }
};

/**
 * Delete a single block from daily plan
 */
export const deleteBlock = async (req, res) => {
  try {
    const owner = req.user.id;
    const { date, blockId } = req.body;

    const plan = await DailyPlan.findOne({ owner, date });
    if (!plan) return res.status(404).json({ error: "Plan not found" });

    plan.events = plan.events.filter((e) => e._id.toString() !== blockId);
    await plan.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete block" });
  }
};
