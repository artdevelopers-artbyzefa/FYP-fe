import { BrowserRouter, Routes, Route } from "react-router-dom";
import Process from "./pages/Process";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Process />} />
        <Route path="/process" element={<Process />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;