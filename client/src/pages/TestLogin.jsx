import { useState } from 'react';
import api from '../services/api';

const TestLogin = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await api.get('/health');
      setResult('✅ Backend Connected: ' + JSON.stringify(response.data));
    } catch (error) {
      setResult('❌ Backend Error: ' + error.message);
    }
    setLoading(false);
  };

  const testAdminLogin = async () => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: 'admin@hostel.com',
        password: 'admin123'
      });
      setResult('✅ Admin Login Success: ' + JSON.stringify(response.data));
    } catch (error) {
      setResult('❌ Admin Login Failed: ' + (error.response?.data?.message || error.message));
    }
    setLoading(false);
  };

  const testWardenLogin = async () => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: 'warden@hostel.com',
        password: 'warden123'
      });
      setResult('✅ Warden Login Success: ' + JSON.stringify(response.data));
    } catch (error) {
      setResult('❌ Warden Login Failed: ' + (error.response?.data?.message || error.message));
    }
    setLoading(false);
  };

  const testStudentLogin = async () => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: 'john@student.com',
        password: 'student123'
      });
      setResult('✅ Student Login Success: ' + JSON.stringify(response.data));
    } catch (error) {
      setResult('❌ Student Login Failed: ' + (error.response?.data?.message || error.message));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Login Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Connections</h2>
          <div className="space-y-3">
            <button onClick={testConnection} disabled={loading} className="btn-primary mr-3">
              Test Backend Connection
            </button>
            <button onClick={testAdminLogin} disabled={loading} className="btn-primary mr-3">
              Test Admin Login
            </button>
            <button onClick={testWardenLogin} disabled={loading} className="btn-primary mr-3">
              Test Warden Login
            </button>
            <button onClick={testStudentLogin} disabled={loading} className="btn-primary">
              Test Student Login
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-3">Result:</h3>
            <pre className="bg-gray-50 p-4 rounded overflow-auto text-sm">
              {result}
            </pre>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold mb-3">Expected Credentials:</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Admin:</strong> admin@hostel.com / admin123</p>
            <p><strong>Warden:</strong> warden@hostel.com / warden123</p>
            <p><strong>Student:</strong> john@student.com / student123</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold mb-3">If Tests Fail:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Make sure MongoDB is running</li>
            <li>Make sure backend server is running (port 5000)</li>
            <li>Run seed script: <code className="bg-white px-2 py-1 rounded">cd server && npm run seed</code></li>
            <li>Check backend console for errors</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TestLogin;
