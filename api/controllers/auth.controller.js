import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

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

export const signin = async (req, res, next) => {
    const {username, password} = req.body;

    if(!username || !password || username === '' || password === ''){
        return next(errorHandler(404, "Semua field harus diisi"));
    };

    try {
        const validUser = await User.findOne({username});
        if(!validUser){
            return next(errorHandler(404, 'Username tidak ditemukan'));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if(!validPassword){
            return next(errorHandler(400, "Password Salah"));
        }
        const token = jwt.sign(
            {id: validUser._id, isAdmin: validUser.isAdmin},
            process.env.JWT_SECRET
        );

        const {password: pass, ...rest} = validUser._doc;
        res.status(200).cookie('akses_token', token, {
            httpOnly: true,
        }).json({
            ...rest,
            token,
        });
    } catch (error) {
        next(error);
    }
};