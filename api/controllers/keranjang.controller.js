import Keranjang from "../models/keranjang.model.js";
import { errorHandler } from "../utils/error.js";


export const tambah = async (req, res, next) => {
    if (!req.body.judul) {
        return next(errorHandler(400, 'Tolong isi semua'));
    }
    const slug = req.body.judul.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    const newPost = new Keranjang({
        ...req.body, slug
    });
    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        next(error);
    }
};

export const getCartItems = async (req, res) => {
    try {
        const items = await Keranjang.find();
        res.status(200).json(items);
    } catch (err) {
        console.error("Gagal mengambil item keranjang:", err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil data keranjang." });
    }
};