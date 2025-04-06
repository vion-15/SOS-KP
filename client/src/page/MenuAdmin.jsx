import { Button, TextInput } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { MdPointOfSale, MdInventory } from "react-icons/md";
import { LuSquareActivity } from "react-icons/lu";
import { TbReportAnalytics } from "react-icons/tb";


export default function MenuAdmin() {
    const { currentUser } = useSelector(state => state.user);
    return (
        <div className="min-h-screen bg-gray-200 flex justify-center items-center">
            <div className="p-10 w-full max-w-md bg-white rounded-xl shadow flex flex-col items-center gap-6">

                {/* Form Profile */}
                <form className="flex flex-col items-center w-full gap-4">
                    {/* Foto Profil */}
                    <img
                        src={currentUser.profilePicture}
                        alt="foto"
                        className="w-28 h-28 rounded-full object-cover border-8 border-[lightgray]"
                    />

                    {/* Username */}
                    <input
                        type="text"
                        id="username"
                        placeholder="Username"
                        defaultValue={currentUser.username}
                        className="w-full px-3 py-2 border rounded-md text-center"
                    />
                </form>

                {/* Tombol Navigasi */}
                <div className="flex flex-col w-full gap-4">
                    <Button className="flex items-center justify-center gap-2 w-full">
                        <MdPointOfSale className="text-xl" />
                        <p>Point Of Sales</p>
                    </Button>
                    <Button className="flex items-center justify-center gap-2 w-full">
                        <MdInventory className="text-xl" />
                        <p>Inventory</p>
                    </Button>
                    <Button className="flex items-center justify-center gap-2 w-full">
                        <LuSquareActivity className="text-xl" />
                        <p>Activity</p>
                    </Button>
                    <Button className="flex items-center justify-center gap-2 w-full">
                        <TbReportAnalytics className="text-xl" />
                        <p>Report</p>
                    </Button>

                    <Button
                        className="flex items-center justify-center gap-2 w-full"
                        gradientDuoTone="purpleToBlue"
                        outline
                    >
                        Update Profile
                    </Button>

                    <Button
                        className="flex items-center justify-center gap-2 w-full"
                        color="failure"
                    >
                        Log Out
                    </Button>
                </div>
            </div>
        </div>

    )
}
