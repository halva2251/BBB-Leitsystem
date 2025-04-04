import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import UserView from './pages/UserView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/" element={<UserView />} />
      </Routes>
    </Router>
  );
}

export default App;
