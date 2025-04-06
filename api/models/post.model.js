import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        judul: {
            type: String,
            required: true,
            unique: true,
        },
        harga: {
            type: Number,
            required: true,
        },
        stock: {
            type: Number,
            required: true,
        },
        promo: {
            type: Number,
            default: 0,
        },
        image: {
            type: String,
            default: 'https://th.bing.com/th/id/OIP.S_NgPKD0Y_tNGQV8GxFmvgHaE8?w=276&h=184&c=7&r=0&o=5&pid=1.7',
        },
        category: {
            type: String,
            default: 'Uncategorized',
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        }, 
    }, {timestamps: true}
);

const Post = mongoose.model('Post', postSchema);

export default Post;