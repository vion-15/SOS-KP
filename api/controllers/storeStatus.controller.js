// controllers/storeStatus.controller.js
import StoreStatus from '../models/status.model.js';

// GET /api/store-status
export const getStoreStatus = async (req, res) => {
    try {
        const status = await StoreStatus.findOne();
        if (!status) {
            const newStatus = new StoreStatus();
            await newStatus.save();
            return res.status(200).json(newStatus);
        }
        res.status(200).json(status);
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil status toko', error: err.message });
    }
};

// PATCH /api/store-status
export const updateStoreStatus = async (req, res) => {
    try {
        const { isOpen } = req.body;

        const status = await StoreStatus.findOne();
        if (!status) {
            const newStatus = new StoreStatus({ isOpen });
            await newStatus.save();
            return res.status(200).json(newStatus);
        }

        status.isOpen = isOpen;
        await status.save();
        res.status(200).json(status);
    } catch (err) {
        res.status(500).json({ message: 'Gagal update status toko', error: err.message });
    }
};

export const updateStoreStatusOnLogout = async (req, res, next) => {
    try {
        let storeStatus = await StoreStatus.findOne({});

        // Jika status toko belum ada, buat status toko dengan isOpen = false
        if (!storeStatus) {
            storeStatus = new StoreStatus({ isOpen: false });
            await storeStatus.save();
            return res.status(201).json({
                success: true,
                message: "Store status created with closed state",
                storeStatus,
            });
        }

        // Jika sudah ada, update isOpen menjadi false
        storeStatus.isOpen = false;
        await storeStatus.save();

        return res.status(200).json({
            success: true,
            message: "Store status updated to closed",
            storeStatus,
        });
    } catch (error) {
        next(error);
    }
};

