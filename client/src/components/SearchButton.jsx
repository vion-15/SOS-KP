import { Button } from "flowbite-react";
import { AiOutlineSearch } from 'react-icons/ai';

export default function SearchButton() {
    return (
        <>
            <Button
                color="gray"
                size="sm"
                className="text-gray-500 shadow-lg w-full"
            >
                <AiOutlineSearch className="w-5 h-5 mr-2" /> Search...
            </Button>
        </>
    )
}
