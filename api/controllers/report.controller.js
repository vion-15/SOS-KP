import Report from "../models/report.model.js";
import { errorHandler } from "../utils/error.js";

export const laporan = async (req, res, next) => {
    try {
        const { items, totalHarga, username, meja, email, order_id, status } = req.body;

        const status_payment = status === 'settlement' || status === 'capture' ? true : false;

        if (!username || !meja || !email) {
            return res.status(400).json({ message: 'Harus isi username, meja, dan email' });
        }

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Items tidak boleh kosong' });
        }

        if (!totalHarga) {
            return res.status(400).json({ message: 'Total harga diperlukan' });
        }

        // Gunakan order_id untuk pencarian (jika unik)
        let laporan = await Report.findOne({ order_id });

        if (laporan) {
            const existingItemJudul = laporan.items.map(item => item.judul);
            const newItems = items.filter(item => !existingItemJudul.includes(item.judul));

            if (newItems.length > 0) {
                laporan.items.push(...newItems);
                laporan.totalHarga += totalHarga;
                laporan = await laporan.save();
            }
        } else {
            laporan = new Report({ username, meja, email, items, totalHarga, order_id, status_payment });
            await laporan.save();
        }

        res.status(201).json(laporan);
    } catch (error) {
        next(error);
    }
};
