import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import Navigation from "./Navigation.jsx";
import Acceuil from "./Acceuil.jsx";
import Connexion from "./PAGES/Connexion.jsx";
import Inscription from "./PAGES/Inscription.jsx";
import Recuperation from "./PAGES/Recuperation.jsx";
import Update from "./PAGES/Update.jsx";
import Chatbot from './PAGES/PAGE_ETU/Chatbot.jsx';
import Dashboard from './PAGES/PAGE_ETU/Dashboard.jsx';



function App() {
  return (
    <>
            <CssBaseline />
            <Router>
                <Routes>
                    <Route path="/" element={<Acceuil />} />
                    <Route path="/connexion" element={<Connexion />} />
                    <Route path="/inscription" element={<Inscription />} />
                    <Route path="/recuperation" element={<Recuperation />} />
                    <Route path="/mis-a-jour" element={<Update />}/>
                    <Route path="/chatBot" element={<Chatbot/>}/>
                    <Route path="/dashboard" element={<Dashboard/>}/>
               </Routes>
            </Router>
    </>
  )
}

export default App;
