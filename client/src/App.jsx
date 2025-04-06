import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./page/Home";
import AdminPage from "./page/AdminPage";
import MenuAdmin from "./page/MenuAdmin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AdminLogin" element={<AdminPage />} />
        <Route path="/menuAdmin" element={<MenuAdmin />} />
      </Routes>
    </BrowserRouter>
  )
}
