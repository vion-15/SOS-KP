import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { Alert, Button, Checkbox, FileInput, Label, Select, TextInput } from 'flowbite-react';
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function AddMenu() {
    const [formData, setFormData] = useState({});
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [publishError, setPublishError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/post/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                setPublishError(data.message);
                return;
            }
            if (res.ok) {
                setPublishError(null);
                navigate('/inventory');
            }
        } catch (error) {
            setPublishError("Ada yang tidak benar");
            console.log(error);
        }
    };

    const handleUploadImage = async () => {
        try {
            if (!file) {
                setImageUploadError('Tolong pilih sebuah gambar');
                return;
            }
            setImageUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setImageUploadError(error);
                    setImageUploadProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUploadProgress(null);
                        setImageUploadError(null);
                        setFormData({ ...formData, image: downloadURL });
                    });
                }
            );
        } catch (error) {
            setImageUploadError('Image Upload Gagal');
            setImageUploadProgress(null);
            console.log(error);
        }
    };

    return (
        <div className="p-3 max-w-3xl
        mx-auto min-h-screen">
            <h1 className="text-center
            text-3xl my-7 font-semibold">
                Menambah Menu Baru
            </h1>
            <form className="flex flex-col
            gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col
                gap-4 sm:flex-row justify-between">
                    <TextInput type='text' placeholder='Nama makanan'
                        required id='nama' className='flex-1'
                        onChange={(e) => setFormData({ ...formData, judul: e.target.value })} />
                    <Select required onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                        <option value="uncategorized">Pilih Kategori</option>
                        <option value="Minuman">Drink</option>
                        <option value="Makanan">Food</option>
                        <option value="Dessert">Dessert</option>
                    </Select>
                </div>
                <TextInput type='number' placeholder='Harga'
                    required id='harga' className='flex-1'
                    onChange={(e) => setFormData({ ...formData, harga: e.target.value })} />
                <TextInput type='number' placeholder='Stock'
                    required id='stock' className='flex-1'
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <Checkbox
                        id="promo"
                        onChange={(e) =>
                            setFormData({ ...formData, promo: e.target.checked })
                        }
                    />
                    <Label htmlFor="promo" value="Aktifkan Promo" />

                    {formData.promo && (
                        <TextInput
                            type="number"
                            min="1"
                            max="100"
                            placeholder="Diskon (%)"
                            className="flex-1"
                            onChange={(e) =>
                                setFormData({ ...formData, discount: Number(e.target.value) })
                            }
                        />
                    )}
                </div>
                <div className='flex gap-4 items-center 
                justify-between border-4 border-gray-500
                border-dotted p-3'>
                    <FileInput type='file'
                        accept='image/*'
                        onChange={(e) => setFile(e.target.files[0])} />
                    <Button type='button'
                        gradientDuoTone='purpleToBlue' size='sm'
                        outline
                        onClick={handleUploadImage}
                        disabled={imageUploadProgress}>
                        {imageUploadProgress ? (
                            <div className="w-16 h-16">
                                <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
                            </div>
                        ) : (
                            'Upload Image'
                        )}
                    </Button>
                </div>
                {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
                {formData.image && (
                    <img src={formData.image} alt="upload" className="w-full h-72 object-cover" />
                )}
                <Button type='submit'
                    gradientDuoTone='purpleToPink'>
                    Publish
                </Button>
                {
                    publishError && (<Alert color='failure' className="mt-5">{publishError}</Alert>)
                }
            </form>
        </div>
    )
}
