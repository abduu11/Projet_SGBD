import { CssBaseline } from '@mui/material';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Acceuil from "./Acceuil.jsx";
import ProtectedRoute from './Components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import Connexion from "./PAGES/Connexion.jsx";
import Inscription from "./PAGES/Inscription.jsx";
import Dashboard from './PAGES/PAGE_ETU/Dashboard.jsx';
import Recuperation from "./PAGES/Recuperation.jsx";
import Update from "./PAGES/Update.jsx";
import DashboardEns from "./PAGES/PAGE__ENSEIGN/DashboardEns.jsx";
import ProtectedRouteEns from './Components/ProtectedRouteEns.jsx';
import ViewCorrections from "./PAGES/PAGE__ENSEIGN/ViewCorrections.jsx";

function App() {
  return (
    <AuthProvider>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Acceuil />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/recuperation" element={<Recuperation />} />
          <Route path="/mis-a-jour" element={<Update />} />
          <Route element={<ProtectedRoute role="etudiant" />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route element={<ProtectedRouteEns role="enseignant" />}>
            <Route path="/dashboard-ens" element={<DashboardEns />} />
            <Route path="/view-corrections" element={<ViewCorrections />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;