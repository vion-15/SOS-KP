import mongoose from "mongoose";

const keranjangSchema = new mongoose.Schema(
    {
        judul: {
            type: String,
            required: true,
        },
        stock: {
            type: Number,
            required: true,
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