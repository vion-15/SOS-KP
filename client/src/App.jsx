import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./page/Home";
import AdminPage from "./page/AdminPage";
import Header from "./components/Header";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AdminLogin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  )
}
