import { useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { addItemToCart } from "../redux/keranjang/keranjangSlice";
import { useDispatch } from 'react-redux';

const ProductGrid = ({ products, isFiltered }) => {
    const [allProducts, setAllProducts] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const getMenu = async () => {
            try {
                const res = await fetch("/api/post/getposts");
                const data = await res.json();
                setAllProducts(data.posts);
            } catch (err) {
                console.error("Gagal ambil data menu:", err);
            }
        };

        // Hanya fetch jika tidak sedang filter pencarian
        if (!isFiltered) {
            getMenu();
        }
    }, [isFiltered]);

    const handleAddToCart = async (product) => {
        try {
            const res = await fetch('/api/cart/keranjang', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...product, quantity: 1 }),
            });

            const data = await res.json();
            if (res.ok) {
                dispatch(addItemToCart(product));
                console.log("Berhasil ditambah:", data);
            } else {
                console.log("Gagal ditambah:", data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const displayProducts = isFiltered ? products : [];


    return (
        <div className="grid grid-cols-3 gap-4 p-4">
            {displayProducts.map((product) => {
                const hargaDiskon =
                    product.promo > 0
                        ? Math.round(product.harga * (100 - product.promo) / 100)
                        : product.harga;

                return (
                    <div key={product._id} className="bg-white rounded-xl shadow-md p-2 flex flex-col justify-between">
                        <img
                            src={product.image}
                            alt={product.judul}
                            className="h-full w-full object-cover rounded-md mb-2"
                        />
                        <div className="flex justify-between items-center px-3">
                            <div className="text-sm">
                                <p className="font-medium line-clamp-1">{product.judul}</p>
                                {product.promo > 0 ? (
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 line-through text-xs">
                                            Rp {product.harga.toLocaleString()}
                                        </span>
                                        <span className="text-red-500 font-bold">
                                            Rp {hargaDiskon.toLocaleString()}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-gray-800 font-bold">
                                        Rp {product.harga.toLocaleString()}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => handleAddToCart(product)}
                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full ml-2"
                            >
                                <FaPlusCircle className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ProductGrid;
