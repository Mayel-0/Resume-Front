import HomePage from './pages/HomePage'
import ProjectPage from './pages/ProjectD';
import Notfound from './pages/NotFound';

import { Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import Cursor from "./components/cursor";
import useSmoothScroll from "./hooks/useSmoothScroll";
import useMagnetic from "./hooks/useMagnetic";
import useTilt from "./hooks/useTilt";

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
