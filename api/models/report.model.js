import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
    {
        username: { type: String, required: true},
        meja: { type: Number, required: true},
        email: { type: String, required: true},
        items: [
            {
                judul: { type: String, required: true },
                tipe: { type: String},
                jenis: { type: String},
                stock: { type: Number, required: true },
                harga: { type: Number, required: true },
                quantity: {type: Number, required: true},
                totalHargaItem: { type: Number, required: true },
            },
        ],
        totalHarga: { type: Number, required: true },
        order_id: {type: String},
        status_payment: {type: String},
        isDone: {type: Boolean, default: false},
    }, {timestamps: true}
);

const Report = mongoose.model('Report', reportSchema);

export default Report;