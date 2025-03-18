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
<<<<<<< HEAD
import DashboardEns from "./PAGES/PAGE__ENSEIGN/DashboardEns.jsx";
=======
import ExamList from './PAGES/PAGE_ETU/ExamList.jsx';
import Stats from './PAGES/PAGE_ETU/Stats.jsx';
import Notes from './PAGES/PAGE_ETU/Notes.jsx';
import Param from './PAGES/PAGE_ETU/Param.jsx';
import MesExams from './PAGES/PAGE_ETU/MesExams.jsx';
>>>>>>> 2141b2cf41a9fd2732de82fb6074e8310cf11e0a

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
          <Route element={<ProtectedRoute />}>
<<<<<<< HEAD
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard-ens" element={<DashboardEns />} />
=======
          <Route path="/examlist" element={<ExamList />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/param" element={<Param />} />
          <Route path="/mesExams" element={<MesExams />} />
          <Route path="/dashboard" element={<Dashboard />} />
>>>>>>> 2141b2cf41a9fd2732de82fb6074e8310cf11e0a
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;