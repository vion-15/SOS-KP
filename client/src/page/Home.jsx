import { MdRestaurantMenu } from "react-icons/md";
import { RiDrinksFill } from "react-icons/ri";
import { PiBowlFoodFill } from "react-icons/pi";
import { LuDessert } from "react-icons/lu";
import { Button } from "flowbite-react";
import { FaShoppingBag } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import Header from "../components/Header";
import ProductGrid from "../components/CardProduk";

export default function Home() {
    return (
        <>
        <Header />
        <div className="min-h-screen bg-gray-200">
            <div className="flex gap-3 overflow-x-auto py-5 px-5 hide-scrollbar">
                <div className="flex flex-col items-center gap-2 p-3 border rounded-xl justify-center bg-white min-w-[150px]">
                    <MdRestaurantMenu />
                    <p>All Menu</p>
                    <p className="text-gray-600">0 items</p>
                </div>

                <div className="flex flex-col items-center gap-2 p-3 border rounded-xl justify-center bg-white min-w-[150px]">
                    <RiDrinksFill />
                    <p>Drinks</p>
                    <p className="text-gray-600">0 items</p>
                </div>

                <div className="flex flex-col items-center gap-2 p-3 border rounded-xl justify-center bg-white min-w-[150px]">
                    <PiBowlFoodFill />
                    <p>Foods</p>
                    <p className="text-gray-600">0 items</p>
                </div>

                <div className="flex flex-col items-center gap-2 p-3 border rounded-xl justify-center bg-white min-w-[150px]">
                    <LuDessert />
                    <p>Dessert</p>
                    <p className="text-gray-600">0 items</p>
                </div>
            </div>


            <Button className="fixed bottom-4 left-4 rounded-full p-3 z-50"
                color="failure">
                <FaShoppingBag />
            </Button>

            <Button className="fixed bottom-4 right-4 rounded-full p-3 z-50"
                color="failure">
                <FaArrowUp />
            </Button>

            <ProductGrid />
        </div>
        </>
    )
}
