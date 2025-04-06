import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
    console.log(req.body);
    const {username, password} = req.body;
    if(!username || !password || username === '' || password === ''){
        return next(errorHandler(400, 'Semua field harus diisi'));
    }

    const hashedPw = bcryptjs.hashSync(password, 10);

    const newUser = new User({
        username, 
        password: hashedPw, 
    });

    try {
        await newUser.save();
        res.json('behasil membuat akun');   
    } catch (error) {
        next(error);
    }
};