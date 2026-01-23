import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MapBuilder from './Pages/MapBuilder';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/builder" />} />
        <Route path="/builder" element={<MapBuilder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
