import express from 'express';
import { getProfile, updateProfile } from '../controllers/clientController.js';
import protect from '../middleware/authMiddleware.js';
import Client from '../models/clients.js'; 
import { upload } from "../middleware/upload.js";

const router = express.Router();

  

router.get("/me", protect, getProfile);
router.put("/update", protect, updateProfile);


// Upload profile image
router.post("/upload-profile-image", protect, upload.single("image"), async (req, res) => {
  try {
    const imagePath = `/uploads/profileImages/${req.file.filename}`;
    const client = await Client.findByIdAndUpdate(
      req.user.id,
      { profileImage: imagePath },
      { new: true }
    ).select("-password");

    if (!client) return res.status(404).json({ error: "Client not found" });

    res.json({ client }); // ✅ Always wrap in an object
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload image" });
  }
});


export default router;
