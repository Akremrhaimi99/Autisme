import logo from './logo.svg';
import './App.css';
import Signup from './signup';
import Signin from './signin';
import Home from './signin';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  
  return (
    <div className="App">
      <Router>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/" element={<Home />} />
                {/* Autres routes... */}
            </Routes>
        </Router>
    </div>
  );
}

export default App;
