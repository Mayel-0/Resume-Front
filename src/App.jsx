import HomePage from './pages/HomePage'
import ProjectPage from './pages/ProjectD.jsx';

import { Routes, Route } from "react-router-dom";
import Header from "./components/header.jsx";
import Footer from "./components/footer.jsx";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/ProjectsD' element={<ProjectPage/>} />
      </Routes>
      <Footer />
    </>
  );
}

export default App
