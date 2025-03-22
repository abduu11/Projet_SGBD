import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ViewSubmissions from './components/ViewSubmissions';
import ViewCorrections from './components/ViewCorrections';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/submissions" element={<ViewSubmissions />} />
        <Route path="/corrections" element={<ViewCorrections />} />
      </Routes>
    </Router>
  );
}

export default App; 