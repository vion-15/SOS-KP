import mongoose from "mongoose";

const storeStatusSchema = new mongoose.Schema({
    isOpen: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true});

export default mongoose.model('StoreStatus', storeStatusSchema);