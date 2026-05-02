import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Eligibility from './pages/Eligibility';
import Process from './pages/Process';
import Guidelines from './pages/Guidelines';
import Team from './pages/Team';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="eligibility" element={<Eligibility />} />
          <Route path="process" element={<Process />} />
          <Route path="guidelines" element={<Guidelines />} />
          <Route path="team" element={<Team />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
