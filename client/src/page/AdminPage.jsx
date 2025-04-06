import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-gray-200 flex justify-center items-center">
            <div className="p-10 w-full max-w-md bg-white rounded-xl shadow">
                <form className="flex flex-col gap-4">
                    <h1 className="font-bold text-center">Khusus Karyawan</h1>
                    <h1 className="text-2xl pt-5 font-bold text-center">Login</h1>

                    <div>
                        <Label value="Username :" />
                        <TextInput type="text" placeholder="Username" id="username" />
                    </div>

                    <div>
                        <Label value="Password :" />
                        <TextInput type="password" placeholder="******" id="password" />
                    </div>

                    <Button 
                    type="submit"
                    color="failure">Sign-in</Button>
                </form>
            </div>
        </div>

    )
}
