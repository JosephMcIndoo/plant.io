import './App.css';
import {ChartModal} from './components/Chart';
import { Link } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {Automation} from './components/Automation';

function App() {
  

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<ChartModal />} />
          <Route path="/automation" element={<Automation />} />
        </Routes>
      </div>
    </Router>


  );
};

export default App;
