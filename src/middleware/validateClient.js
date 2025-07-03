// middleware/validateClient.js
const validateClient = (req, res, next) => {
    const {
        fullName,
        email,
        password,
        businessName,
        role,
        phone,
        timeZone
    } = req.body;

    if (!fullName || !email || !password || !businessName || !role || !phone || !timeZone) {
        return res.status(400).json({ error: 'Missing essential fields' });
    }

    next();
};

export default validateClient;
// This middleware checks if all required fields are present in the request body.
// If any field is missing, it responds with a 400 status code and an error message