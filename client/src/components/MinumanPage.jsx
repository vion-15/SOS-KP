import { MdRestaurantMenu } from "react-icons/md";
import { RiDrinksFill } from "react-icons/ri";
import { PiBowlFoodFill } from "react-icons/pi";
import { LuDessert } from "react-icons/lu";
import { Button } from "flowbite-react";
import { FaShoppingBag } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import CardMinuman from "./CardMinuman";

export default function MinumanPage() {
    const [products, setProducts] = useState([]);
    const [productCount, setProductCount] = useState(0);
    const [makananCount, setMakananCount] = useState(0);
    const [minumanCount, setMinumanCount] = useState(0);
    const [dessertCount, setDessertCount] = useState(0);
    const location = useLocation();
    const currentLocation = location.pathname;

    const isActive = (path) => currentLocation === path;

    useEffect(() => {
        const getMenu = async () => {
            try {
                const res = await fetch("/api/post/getposts"); // Sesuaikan dengan endpoint kamu
                const data = await res.json();
                const kategorimakanan = data.posts.filter(products => products.category === "Makanan");
                const kategoriminuman = data.posts.filter(products => products.category === "Minuman");
                const kategoridessert = data.posts.filter(products => products.category === "Dessert");
                setProducts(data.posts); // Pastikan sesuai struktur respon
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
    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-200">
                <div className="flex gap-3 overflow-x-auto py-5 px-5 hide-scrollbar">
                    <Link to="/">
                        <div className={`flex flex-col items-center gap-2 p-3 border rounded-xl justify-center min-w-[150px] cursor-pointer 
                        ${isActive("/") ? "bg-red-500 text-white" : "bg-white text-black"}`}>
                            <MdRestaurantMenu size="30" />
                            <p>All Menu</p>
                            <div className={`flex flex-row text-gray-600 gap-1
                            ${isActive("/") ? "text-white" : "text-black"}`}>
                                {productCount}
                                <p>items</p>
                            </div>
                        </div>
                    </Link>

                    <Link to="/minuman">
                    <div className={`flex flex-col items-center gap-2 p-3 border rounded-xl justify-center min-w-[150px] cursor-pointer 
                        ${isActive("/minuman") ? "bg-red-500 text-white" : "bg-white text-black"}`}>
                        <RiDrinksFill size="30"/>
                        <p>Drinks</p>
                        <div className={`flex flex-row text-gray-600 gap-1
                            ${isActive("/minuman") ? "text-white" : "text-black"}`}>
                            {minumanCount}
                            <p>items</p>
                        </div>
                    </div>
                    </Link>
                    
                    <Link to="/makanan">
                    <div className={`flex flex-col items-center gap-2 p-3 border rounded-xl justify-center min-w-[150px] cursor-pointer 
                        ${isActive("/makanan") ? "bg-red-500 text-white" : "bg-white text-black"}`}>
                        <PiBowlFoodFill size="30" />
                        <p>Foods</p>
                        <div className={`flex flex-row text-gray-600 gap-1
                            ${isActive("/makanan") ? "text-white" : "text-black"}`}>
                            {makananCount}
                            <p>items</p>
                        </div>
                    </div>
                    </Link>
                    
                    <Link to="/dessert">
                    <div className={`flex flex-col items-center gap-2 p-3 border rounded-xl justify-center min-w-[150px] cursor-pointer 
                        ${isActive("/makanan") ? "bg-red-500 text-white" : "bg-white text-black"}`}>
                        <LuDessert size="30"/>
                        <p>Dessert</p>
                        <div className={`flex flex-row text-gray-600 gap-1
                            ${isActive("/makanan") ? "text-white" : "text-black"}`}>
                            {dessertCount}
                            <p>items</p>
                        </div>
                    </div>
                    </Link>
                </div>


                <Button className="fixed bottom-4 left-4 rounded-full p-3 z-50"
                    color="failure">
                    <FaShoppingBag />
                </Button>

                <Button className="fixed bottom-4 right-4 rounded-full p-3 z-50"
                    color="failure">
                    <FaArrowUp />
                </Button>

                <CardMinuman />
            </div>
        </>
    )
}
