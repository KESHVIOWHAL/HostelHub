import { useState, useEffect } from 'react';
import { Activity, Search, Filter } from 'lucide-react';
import api from '../services/api';
import Loading from '../components/Loading';

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      // Fetch recent data from various endpoints to show activity
      const [students, wardens, rooms, payments, complaints] = await Promise.all([
        api.get('/students'),
        api.get('/auth/users?role=warden'),
        api.get('/rooms'),
        api.get('/payments'),
        api.get('/complaints')
      ]);

      // Combine and format activities
      const allActivities = [
        ...students.data.map(s => ({
          type: 'student',
          action: 'registered',
          user: s.userId?.name,
          details: `Student ID: ${s.studentId}`,
          timestamp: s.createdAt,
          icon: '👨‍🎓'
        })),
        ...wardens.data.map(w => ({
          type: 'warden',
          action: 'registered',
          user: w.name,
          details: `Email: ${w.email}`,
          timestamp: w.createdAt,
          icon: '👮'
        })),
        ...payments.data.map(p => ({
          type: 'payment',
          action: p.status === 'Paid' ? 'completed' : 'pending',
          user: p.studentId?.userId?.name,
          details: `Amount: ₹${p.amount} - ${p.month} ${p.year}`,
          timestamp: p.createdAt,
          icon: '💰'
        })),
        ...complaints.data.map(c => ({
          type: 'complaint',
          action: c.status.toLowerCase(),
          user: c.studentId?.userId?.name,
          details: c.title,
          timestamp: c.createdAt,
          icon: '📝'
        }))
      ];

      // Sort by timestamp (newest first)
      allActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      setActivities(allActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.details?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || activity.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getActivityColor = (type) => {
    const colors = {
      student: 'bg-blue-100 text-blue-800',
      warden: 'bg-purple-100 text-purple-800',
      payment: 'bg-green-100 text-green-800',
      complaint: 'bg-yellow-100 text-yellow-800',
      room: 'bg-red-100 text-red-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
          <p className="text-gray-600 mt-1">Monitor all system activities</p>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 flex items-center space-x-2">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field"
            >
              <option value="all">All Activities</option>
              <option value="student">Students</option>
              <option value="warden">Wardens</option>
              <option value="payment">Payments</option>
              <option value="complaint">Complaints</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredActivities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="text-2xl">{activity.icon}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`badge ${getActivityColor(activity.type)}`}>
                    {activity.type}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="font-medium text-gray-900">
                  {activity.user} - {activity.action}
                </p>
                <p className="text-sm text-gray-600">{activity.details}</p>
              </div>
            </div>
          ))}

          {filteredActivities.length === 0 && (
            <div className="text-center py-12">
              <Activity size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No activities found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
