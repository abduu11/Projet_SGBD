import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import Navigation from "./Navigation.jsx";
import Acceuil from "./Acceuil.jsx";
import Connexion from "./PAGES/Connexion.jsx";
import Inscription from "./PAGES/Inscription.jsx";

function App() {
  return (
    <>
            <CssBaseline />
            <Router>
                <Routes>
                    <Route path="/" element={<Acceuil />} />
                    <Route path="/connexion" element={<Connexion />} />
                    <Route path="/inscription" element={<Inscription />} />
                </Routes>
            </Router>
    </>
  )
}

export default App;
