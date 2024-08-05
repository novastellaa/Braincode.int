import { Router, Routes, Route, Link, Navigate, hashIntegration } from '@solidjs/router'; 
import LogSimulasi from './pages/LogSimulasi';
import HistorySimulasi from './pages/HistorySimulasi';
import RekamMomen from './pages/RekamMomen';
import { HopeProvider } from '@hope-ui/solid' 
import './App.css'
import NavBar from './component/NavBar';
import Asset from './pages/Asset';
import Gis from './pages/Gis';

function App() {
  return (
   <>
    <Router source={hashIntegration()}>  
      <HopeProvider>
        <NavBar />
   
        <Routes>
          <Route path="/" element={<Navigate href="asset" />} />
          <Route path="gis" element={<Gis />} />
          <Route path="asset" element={<Asset />} />
          <Route path="log-simulasi" element={<LogSimulasi />} />
          <Route path="history-simulasi" element={<HistorySimulasi />} />
          <Route path="rekam-momen" element={<RekamMomen />} />
        </Routes>
   
    </HopeProvider> 
    </Router>
   </>
  );
}

export default App;
