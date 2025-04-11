import DayReport from '../models/dayReport.model.js';

// SIMPAN DATA LAPORAN HARI INI
export const saveDayReport = async (req, res) => {
    try {
        const { totalPenjualan, totalProfit, jumlahPelanggan, menuFavorit } = req.body;

        const newReport = new DayReport({
            totalPenjualan,
            totalProfit,
            jumlahPelanggan,
            menuFavorit,
        });

        await newReport.save();
        res.status(201).json({ message: "Laporan harian berhasil disimpan" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menyimpan laporan", error: error.message });
    }
};

// AMBIL LAPORAN HARI INI
export const getTodayReport = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const report = await DayReport.findOne({
            createdAt: {
                $gte: today,
                $lt: tomorrow
            }
        });

        if (!report) return res.status(404).json({ message: "Belum ada laporan hari ini" });

        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil laporan hari ini", error: error.message });
    }
};

// AMBIL LAPORAN KEMARIN
export const getYesterdayReport = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const report = await DayReport.findOne({
            createdAt: {
                $gte: yesterday,
                $lt: today
            }
        });

        if (!report) return res.status(404).json({ message: "Belum ada laporan kemarin" });

        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil laporan kemarin", error: error.message });
    }
};
