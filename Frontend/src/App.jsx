import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import HomePage from './Pages/HomePage';
import MapPage from './Pages/MapPage';
import MapBuilder from './Pages/MapBuilder';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-900 text-white">
        <Navbar />
        <main className="flex-grow pt-16"> {/* pt-16 to offset fixed navbar */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/admin" element={<MapBuilder />} />
          </Routes>
        </main>
        {/* We generally don't want the footer on the Map Page as it's full screen, 
            but for consistency we can conditionally render it or just leave it off 
            MapPage by handling layouts. For now, let's keep it simple. */}
        {/* Actually, MapPage is h-screen overflow-hidden, so Footer might break layout.
            Let's only show footer on Home Page by putting it inside HomePage or using a Layout route.
            Better: Put Footer in HomePage.jsx instead? Or use useLocation here.
            
            Let's keep Navbar always, but main/Footer structure simple.
         */}
      </div>
    </Router>
  );
}

// Re-write App to handle layout better:
// MapPage needs full height without footer interference.
// HomePage needs scrolling with footer.

const AppLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow pt-16">
        {children}
      </div>
    </div>
  );
};

// Actually, simpler approach:
// Just render Navbar in App.
// Routes handle their own containers.
// HomePage will have Footer.
// MapPage will be full screen.

export default function MainApp() {
  return (
    <Router>
      <Navbar />
      <div className="pt-16 h-[calc(100vh)]">
        <Routes>
          <Route path="/" element={
            <div className="h-full overflow-y-auto">
              <HomePage />
              <Footer />
            </div>
          } />
          <Route path="/map" element={<MapPage />} />
          <Route path="/admin" element={<MapBuilder />} />
        </Routes>
      </div>
    </Router>
  );
}
