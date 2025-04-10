import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';

export const test = (req, res) => {
    res.json({message: "API work"});
};

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'anda tidak diizikan untuk update'));
    }
    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHandler(400, 'password harus minimal 6 karakter'));
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username.length > 20) {
            return next(errorHandler(400, 'Username harus diantara 7 sampai 20 karakter'));
        }

        if (req.body.username.includes(' ')) {
            return next(errorHandler(400, 'Username tidak boleh ada spasi'));
        }
        if (req.body.username !== req.body.username.toLowerCase()) {
            return next(errorHandler(400, 'Username harus huruf kecil'));
        }
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return next(errorHandler(400, 'Username hanya mengandung huruf dan angka'));
        }
    }

        try {
            const updateUser = await User.findByIdAndUpdate(req.params.userId, {
                $set: {
                    username: req.body.username,
                    profilePicture: req.body.profilePicture,
                    password: req.body.password,
                },
            }, { new: true });
            const { password, ...rest } = updateUser._doc;
            res.status(200).json(rest);
        } catch (error) {
            next(error);
        }
};

export const signOut = async (req, res, next) => {
    try {
        res.clearCookie('akses_token').status(200).json('Admin telah logout');
    } catch (error) {
        next(error);
    }
};