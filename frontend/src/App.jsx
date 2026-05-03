import { BrowserRouter, Routes, Route } from "react-router-dom";
import Process from "./pages/Process";

import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/process" element={<Process />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;