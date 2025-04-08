import Report from "../models/report.model.js";
import { errorHandler } from "../utils/error.js";

export const laporan = async (req, res, next) => {
    try {
        const { items, totalHarga, username, meja, email } = req.body;

        if(!username || !meja || !email){
            return res.status(400).json({ message: 'Harus isi username meja, dan email' });
        }

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Items tidak boleh kosong' });
        }

        if (!totalHarga) {
            return res.status(400).json({ message: 'Total harga diperlukan' });
        }

        // Cari dokumen yang cocok berdasarkan totalHarga (atau kriteria lain jika ada)
        let laporan = await Report.findOne({ totalHarga });

        if (laporan) {

            const existingItemIds = laporan.items.map(item => item._id);
            const newItems = items.filter(item => !existingItemIds.includes(item._id));
            
            if (newItems.length > 0) {
                laporan.items.push(...newItems);
                laporan.totalHarga += totalHarga;
                laporan = await laporan.save();
            }

            
        } else {
            // Jika tidak ada dokumen, buat dokumen baru
            laporan = new Report({ username, meja, email, items, totalHarga });
            await laporan.save();
        }

        res.status(201).json(laporan);
    } catch (error) {
        next(error);
    }
};