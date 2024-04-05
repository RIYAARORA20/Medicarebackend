import jwt from 'jsonwebtoken';
import Doctor from '../models/DoctorSchema.js';
import User from '../models/UserSchema.js';

export const authenticate = async (req, res, next) => {
    const authToken = req.headers.authorization;

    if (!authToken || !authToken.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'No token provided, authorization denied' });
    }

    try {
        const token = authToken.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decoded.id;
        req.role = decoded.role;
        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(403).json({ success: false, message: 'Token is expired' });
        }
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

export const restrict = roles => async (req, res, next) => {
    const userId = req.userId;

    let user;
    try {
        user = await User.findById(userId) || await Doctor.findById(userId);
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

    if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ success: false, message: "You're not authorized" });
    }
    next();
};