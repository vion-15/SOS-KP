import mongoose from "mongoose";

const keranjangSchema = new mongoose.Schema(
    {
        image: {
            type: String,
            default: 'https://th.bing.com/th/id/OIP.S_NgPKD0Y_tNGQV8GxFmvgHaE8?w=276&h=184&c=7&r=0&o=5&pid=1.7',
        },
        judul: {
            type: String,
            required: true,
        },
        stock: {
            type: Number,
            required: true,
        },
        tipe: {
            type: String,
        },
        jenis: {
            type: String,
        },
        harga: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            default: 0,
        },
        promo: {
            type: Number,
        },
    }, {timestamps: true}
);

const Keranjang = mongoose.model('Keranjang', keranjangSchema);

export default Keranjang;