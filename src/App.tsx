import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Solved from "./components/Solved";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/solved" element={<Solved />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
