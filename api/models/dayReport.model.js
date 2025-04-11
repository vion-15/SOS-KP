import mongoose from "mongoose";

const dayReport = new mongoose.Schema(
    {
        totalPenjualan: {
            type: Number,
            required: true,
        },
        totalProfit: {
            type: Number,
            required: true,
        },
        jumlahPelanggan: {
            type: Number,
            required: true,
        },
        menuFavorit: {
            type: String,
            default: '',
        },
    }, {timestamps: true}
);

const reportDay = mongoose.model('dayReport', dayReport);

export default reportDay;
