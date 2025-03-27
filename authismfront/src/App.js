import logo from './logo.svg';
import './App.css';
import Signup from './signup';
import Signin from './signin';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  
  return (
    <div className="App">
      <Router>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/" element={<h1>Page d'accueil</h1>} />
                {/* Autres routes... */}
            </Routes>
        </Router>
    </div>
  );
}

export default App;
