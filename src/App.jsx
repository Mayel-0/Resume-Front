import HomePage from './pages/HomePage'
import ProjectPage from './pages/ProjectD.jsx';
import Notfound from './pages/NotFound.jsx';

import { Routes, Route } from "react-router-dom";
import Header from "./components/header.jsx";
import Footer from "./components/footer.jsx";
import Cursor from "./components/cursor.jsx";
import useSmoothScroll from "./hooks/useSmoothScroll.js";
import useMagnetic from "./hooks/useMagnetic.js";
import useTilt from "./hooks/useTilt.js";

function App() {
  // Scroll smooth (Lenis) synchronisé avec GSAP ScrollTrigger
  useSmoothScroll();
  // Effet magnétique sur les boutons marqués data-magnetic
  useMagnetic();
  // Halo lumineux des cartes + inclinaison 3D (data-tilt)
  useTilt();

  return (
    <>
      <Cursor />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/ProjectsD' element={<ProjectPage/>} />
        <Route path="*" element={<Notfound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App
