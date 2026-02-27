import { Link } from 'react-router-dom';
import { Shield, UserCheck, Users, Building2, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building2 size={32} className="text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">Hostel Hub</h1>
            </div>
            <Link to="/login" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Hostel Hub
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Modern hostel management made simple. Manage students, rooms, payments, and more with our comprehensive platform.
          </p>
        </div>

        {/* Login Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {/* Admin Card */}
          <Link to="/admin-login" className="group">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-red-500">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors">
                <Shield size={32} className="text-red-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Admin Portal</h3>
              <p className="text-gray-600 mb-6">
                Full system access. Manage students, rooms, payments, and generate reports.
              </p>
              <div className="flex items-center text-red-600 font-medium group-hover:text-red-700">
                <span>Login as Admin</span>
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Warden Card */}
          <Link to="/warden-login" className="group">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-purple-500">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
                <UserCheck size={32} className="text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Warden Portal</h3>
              <p className="text-gray-600 mb-6">
                Manage your assigned block, handle complaints, and mark attendance.
              </p>
              <div className="flex items-center text-purple-600 font-medium group-hover:text-purple-700 mb-3">
                <span>Login as Warden</span>
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
              <Link 
                to="/warden-register" 
                className="text-sm text-purple-500 hover:text-purple-700 underline"
                onClick={(e) => e.stopPropagation()}
              >
                Register as Warden
              </Link>
            </div>
          </Link>

          {/* Student Card */}
          <Link to="/login" className="group">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-primary-500">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary-600 transition-colors">
                <Users size={32} className="text-primary-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Student Portal</h3>
              <p className="text-gray-600 mb-6">
                View your profile, check payments, raise complaints, and track attendance.
              </p>
              <div className="flex items-center text-primary-600 font-medium group-hover:text-primary-700">
                <span>Login as Student</span>
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h3>
            <p className="text-lg text-gray-600">
              Comprehensive features for efficient hostel management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users size={24} className="text-primary-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Student Management</h4>
              <p className="text-sm text-gray-600">Complete student records and profiles</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Building2 size={24} className="text-primary-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Room Allocation</h4>
              <p className="text-sm text-gray-600">Efficient room and bed management</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield size={24} className="text-primary-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Payment Tracking</h4>
              <p className="text-sm text-gray-600">Monitor fees and payment history</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <UserCheck size={24} className="text-primary-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Attendance System</h4>
              <p className="text-sm text-gray-600">Daily attendance tracking</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2026 Hostel Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
