import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Loading from './components/Loading';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import WardenLogin from './pages/WardenLogin';
import Register from './pages/Register';
import WardenRegister from './pages/WardenRegister';
import TestLogin from './pages/TestLogin';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Wardens from './pages/Wardens';
import Rooms from './pages/Rooms';
import Payments from './pages/Payments';
import Complaints from './pages/Complaints';
import Attendance from './pages/Attendance';
import Profile from './pages/Profile';
import ActivityLog from './pages/ActivityLog';
import WardenRooms from './pages/WardenRooms';
import WardenComplaints from './pages/WardenComplaints';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <Loading />;
  return user ? children : <Navigate to="/" />;
};

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        <main className="pt-16 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/warden-login" element={<WardenLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/warden-register" element={<WardenRegister />} />
          <Route path="/test-login" element={<TestLogin />} />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Layout><Dashboard /></Layout>
            </PrivateRoute>
          } />
          
          <Route path="/students" element={
            <PrivateRoute>
              <Layout><Students /></Layout>
            </PrivateRoute>
          } />
          
          <Route path="/wardens" element={
            <PrivateRoute>
              <Layout><Wardens /></Layout>
            </PrivateRoute>
          } />
          
          <Route path="/rooms" element={
            <PrivateRoute>
              <Layout><Rooms /></Layout>
            </PrivateRoute>
          } />
          
          <Route path="/payments" element={
            <PrivateRoute>
              <Layout><Payments /></Layout>
            </PrivateRoute>
          } />
          
          <Route path="/complaints" element={
            <PrivateRoute>
              <Layout><Complaints /></Layout>
            </PrivateRoute>
          } />
          
          <Route path="/attendance" element={
            <PrivateRoute>
              <Layout><Attendance /></Layout>
            </PrivateRoute>
          } />
          
          <Route path="/activity-log" element={
            <PrivateRoute>
              <Layout><ActivityLog /></Layout>
            </PrivateRoute>
          } />
          
          <Route path="/profile" element={
            <PrivateRoute>
              <Layout><Profile /></Layout>
            </PrivateRoute>
          } />
          
          <Route path="/warden/rooms" element={
            <PrivateRoute>
              <Layout><WardenRooms /></Layout>
            </PrivateRoute>
          } />
          
          <Route path="/warden/complaints" element={
            <PrivateRoute>
              <Layout><WardenComplaints /></Layout>
            </PrivateRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
