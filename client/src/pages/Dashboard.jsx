import { useState, useEffect } from 'react';
import { Users, Building2, Bed, DollarSign, AlertCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatCard from '../components/StatCard';
import Loading from '../components/Loading';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const endpoint = user.role === 'admin' ? '/dashboard/admin' :
                       user.role === 'warden' ? '/dashboard/warden' :
                       `/dashboard/student/${user._id}`;
      
      const { data } = await api.get(endpoint);
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of Hostel Hub</p>
      </div>

      {user.role === 'admin' && stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Students"
              value={stats.totalStudents}
              icon={Users}
              color="primary"
            />
            <StatCard
              title="Total Rooms"
              value={stats.totalRooms}
              icon={Building2}
              color="green"
            />
            <StatCard
              title="Available Beds"
              value={stats.availableBeds}
              icon={Bed}
              color="yellow"
            />
            <StatCard
              title="Pending Complaints"
              value={stats.pendingComplaints}
              icon={AlertCircle}
              color="red"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Revenue</span>
                  <span className="text-2xl font-bold text-green-600">
                    ₹{stats.totalRevenue?.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pending Fees</span>
                  <span className="text-2xl font-bold text-red-600">
                    ₹{stats.pendingFees?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Occupancy Rate</h3>
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary-600">
                    {stats.occupancyRate}%
                  </div>
                  <p className="text-gray-600 mt-2">Current Occupancy</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {user.role === 'warden' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Assigned Rooms"
            value={stats.assignedRooms}
            icon={Building2}
            color="primary"
          />
          <StatCard
            title="Students in Block"
            value={stats.studentsInBlock}
            icon={Users}
            color="green"
          />
          <StatCard
            title="Total Complaints"
            value={stats.totalComplaints}
            icon={AlertCircle}
            color="yellow"
          />
          <StatCard
            title="Pending Complaints"
            value={stats.pendingComplaints}
            icon={AlertCircle}
            color="red"
          />
        </div>
      )}

      {user.role === 'student' && stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Payments"
              value={stats.totalPayments}
              icon={DollarSign}
              color="primary"
            />
            <StatCard
              title="Pending Payments"
              value={stats.pendingPayments}
              icon={DollarSign}
              color="red"
            />
            <StatCard
              title="Total Complaints"
              value={stats.totalComplaints}
              icon={AlertCircle}
              color="yellow"
            />
            <StatCard
              title="Pending Complaints"
              value={stats.pendingComplaints}
              icon={AlertCircle}
              color="red"
            />
          </div>

          {stats.student && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">My Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{stats.student.userId?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{stats.student.userId?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Student ID</p>
                  <p className="font-medium">{stats.student.studentId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Room</p>
                  <p className="font-medium">
                    {stats.student.roomId ? 
                      `${stats.student.roomId.roomNumber} - ${stats.student.roomId.blockName}` : 
                      'Not Assigned'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
