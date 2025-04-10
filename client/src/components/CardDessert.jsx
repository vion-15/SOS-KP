import { useEffect, useState } from "react";

const CardDessert = () => {
    const [makananCount, setMakananCount] = useState([]);

    useEffect(() => {
        const getMenu = async () => {
            try {
                const res = await fetch("/api/post/getposts"); // Sesuaikan dengan endpoint kamu
                const data = await res.json();
                const makananFilter = data.posts.filter(products => products.category === "Dessert");
                setMakananCount(makananFilter);
            } catch (err) {
                console.error("Gagal ambil data menu:", err);
            }
        };

        getMenu();
    }, []);

    const handleAddToCart = () => {
    };

    return (
        <div className="grid grid-cols-2 gap-4 p-4">
            {makananCount.map((product) => {
                const hargaDiskon =
                    product.promo > 0
                        ? Math.round(product.harga * (100 - product.promo) / 100)
                        : product.harga;

                return (
                    <div key={product._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-2 flex flex-col justify-between">
                        <img
                            src={product.image}
                            alt={product.judul}
                            className="h-24 w-full object-cover rounded-md mb-2"
                        />

                        <div className="text-sm mb-1">
                            <p className="font-medium line-clamp-1">{product.judul}</p>
                            {product.promo > 0 ? (
                                <div className="flex flex-col">
                                    <span className="text-gray-400 line-through text-xs">Rp {product.harga.toLocaleString()}</span>
                                    <span className="text-red-500 font-bold">Rp {hargaDiskon.toLocaleString()}</span>
                                </div>
                            ) : (
                                <span className="text-gray-800 font-bold">Rp {product.harga.toLocaleString()}</span>
                            )}
                        </div>

                        <button
                            onClick={() => handleAddToCart(product)}
                            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 rounded-lg"
                        >
                            Tambah
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default CardDessert;
