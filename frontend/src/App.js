import './App.css';
import {ChartModal} from './components/Chart';
import { Link } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {Automation} from './components/Automation';
import { useEffect } from 'react';
import { fetchVariables, getVariableData } from './components/BackendInterpolation';

function App() {

  return (
    <Router>
      <div className='bg-slate-600 w-full absolute'>
        <Routes>
          <Route path="/" element={<ChartModal />} />
          <Route path="/automation" element={<Automation />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
