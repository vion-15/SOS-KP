
import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";


export const create = async (req, res, next) => {
    console.log(req.body);
    if(!req.user.isAdmin){
        return next(errorHandler(403,'Kamu tidak diizikan menambah menu baru'));
    }
    if (!req.body.judul || !req.body.harga || !req.body.stock || !req.body.category || !req.body.image) {
        return next(errorHandler(400, 'Tolong isi semua kolom yang wajib diisi'));
    }
    const slug = req.body.judul.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    const newPost = new Post({
        ...req.body, slug, userId: req.user.id
    });
    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        next(error);
    }
};

export const getposts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    {title: {$regex : req.query.searchTerm, $options: 'i'}},
                    {content: {$regex : req.query.searchTerm, $options: 'i'}},
                ],
            }),
    }).sort({updateAt : sortDirection}).skip(startIndex);

    const totalPosts = await Post.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
    );

    const lastMonthPost = await Post.countDocuments({
        createAt: {$gte : oneMonthAgo},
    });

    res.status(200).json({
        posts,
        totalPosts,
        lastMonthPost
    });

    } catch (error) {
        next(error);
    };
};

export const deleteposts = async (req, res, next) => {
    if(!req.user.isAdmin || req.user.id !== req.params.userId){
        return next(errorHandler(403, 'Kamu tidak diizinkan menghapus post'));
    }
    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json('Post sudah di delete');
    } catch (error) {
        next(error);
    };
};

export const updatepost = async (req, res, next) => {
    if(!req.user.isAdmin || req.user.id !== req.params.userId){
        next(errorHandler(403, "kamu tidak diizinkan mengupdate post"))
    };
    try {
        const updatePost = await Post.findByIdAndUpdate(req.params.postId, 
            {
                $set: {
                    judul: req.body.judul,
                    image: req.body.image,
                    category: req.body.category,
                    harga: req.body.harga,
                    stock: req.body.stock,
                    promo: req.body.promo,
                }
            }, { new:true }
        );
        res.status(200).json(updatePost);
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const updatePost = await Post.findByIdAndUpdate(req.params.postId, 
            {
                $set: {
                    judul: req.body.judul,
                    content: req.body.content,
                    image: req.body.image,
                    category: req.body.category,
                    harga: req.body.harga,
                    stock: req.body.stock,
                }
            }, { new:true }
        );
        res.status(200).json(updatePost);
    } catch (error) {
        next(error);
    }
};