import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./page/Home";
import AdminPage from "./page/AdminPage";
import MenuAdmin from "./page/MenuAdmin";
import Inventory from "./page/Inventory";
import AddMenu from "./page/AddMenu";
import UpdateMenu from "./page/UpdateMenu";
import MinumanPage from "./components/MinumanPage";
import MakananPage from "./components/MakananPage";
import DessertPage from "./components/DessertPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AdminLogin" element={<AdminPage />} />
        <Route path="/menuAdmin" element={<MenuAdmin />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/tambah-menu" element={<AddMenu />} />
        <Route path="/update-post/:postId" element={<UpdateMenu />} />
        <Route path="/minuman" element={<MinumanPage />} />
        <Route path="/makanan" element={<MakananPage />} />
        <Route path="/dessert" element={<DessertPage />} />
      </Routes>
    </BrowserRouter>
  )
}
