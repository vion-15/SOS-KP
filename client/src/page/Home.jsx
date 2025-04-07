import { MdRestaurantMenu } from "react-icons/md";
import { RiDrinksFill } from "react-icons/ri";
import { PiBowlFoodFill } from "react-icons/pi";
import { LuDessert } from "react-icons/lu";
import { Button } from "flowbite-react";
import { FaArrowUp } from "react-icons/fa";
import Header from "../components/Header";
import ProductGrid from "../components/CardProduk";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Keranjang from "../components/Keranjang";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [productCount, setProductCount] = useState(0);
    const [makananCount, setMakananCount] = useState(0);
    const [minumanCount, setMinumanCount] = useState(0);
    const [dessertCount, setDessertCount] = useState(0);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        const getMenu = async () => {
            try {
                const res = await fetch("/api/post/getposts");
                const data = await res.json();

                const kategorimakanan = data.posts.filter(
                    (product) => product.category === "Makanan"
                );
                const kategoriminuman = data.posts.filter(
                    (product) => product.category === "Minuman"
                );
                const kategoridessert = data.posts.filter(
                    (product) => product.category === "Dessert"
                );

                setProducts(data.posts);
                setProductCount(data.posts.length);
                setMakananCount(kategorimakanan.length);
                setMinumanCount(kategoriminuman.length);
                setDessertCount(kategoridessert.length);
            } catch (err) {
                console.error("Gagal ambil data menu:", err);
            }
        };

        getMenu();
    }, []);

    const handleScrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-100">
                {/* Kategori Navigasi */}
                <div className="flex gap-4 overflow-x-auto py-5 px-4 hide-scrollbar">
                    <Link to="/">
                        <div
                            className={`flex flex-col items-center gap-2 p-4 border rounded-xl min-w-[140px] cursor-pointer 
                ${isActive("/") ? "bg-red-500 text-white" : "bg-white text-gray-800"}`}
                        >
                            <MdRestaurantMenu size="28" />
                            <p className="text-sm font-medium">All Menu</p>
                            <span className={`${isActive("/") ? "text-white" : "text-gray-600"}`}>
                                {productCount} items
                            </span>
                        </div>
                    </Link>

                    <Link to="/minuman">
                        <div
                            className={`flex flex-col items-center gap-2 p-4 border rounded-xl min-w-[140px] cursor-pointer 
                ${isActive("/minuman") ? "bg-red-500 text-white" : "bg-white text-gray-800"}`}
                        >
                            <RiDrinksFill size="28" />
                            <p className="text-sm font-medium">Drinks</p>
                            <span className={`${isActive("/minuman") ? "text-white" : "text-gray-600"}`}>
                                {minumanCount} items
                            </span>
                        </div>
                    </Link>

                    <Link to="/makanan">
                        <div
                            className={`flex flex-col items-center gap-2 p-4 border rounded-xl min-w-[140px] cursor-pointer 
                ${isActive("/makanan") ? "bg-red-500 text-white" : "bg-white text-gray-800"}`}
                        >
                            <PiBowlFoodFill size="28" />
                            <p className="text-sm font-medium">Foods</p>
                            <span className={`${isActive("/makanan") ? "text-white" : "text-gray-600"}`}>
                                {makananCount} items
                            </span>
                        </div>
                    </Link>

                    <Link to="/dessert">
                        <div
                            className={`flex flex-col items-center gap-2 p-4 border rounded-xl min-w-[140px] cursor-pointer 
                ${isActive("/dessert") ? "bg-red-500 text-white" : "bg-white text-gray-800"}`}
                        >
                            <LuDessert size="28" />
                            <p className="text-sm font-medium">Dessert</p>
                            <span className={`${isActive("/dessert") ? "text-white" : "text-gray-600"}`}>
                                {dessertCount} items
                            </span>
                        </div>
                    </Link>
                </div>

                <div className="fixed left-5 bottom-5 z-50">
                    <Keranjang />
                </div>

                {/* Produk */}
                <div className="px-4 pb-10">
                    <ProductGrid products={products} />
                </div>
            </div>
        </>
    );
}
