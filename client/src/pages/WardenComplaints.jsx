import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import api from '../services/api';
import Loading from '../components/Loading';

const WardenComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await api.get('/complaints');
      setComplaints(data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/complaints/${id}`, { status });
      fetchComplaints();
    } catch (error) {
      alert(error.response?.data?.message || 'Update failed');
    }
  };

  const filteredComplaints = complaints.filter(complaint =>
    complaint.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.studentId?.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const badges = {
      'Pending': 'badge-warning',
      'In Progress': 'badge-info',
      'Resolved': 'badge-success'
    };
    return `badge ${badges[status]}`;
  };

  const getCategoryBadge = (category) => {
    const badges = {
      'Maintenance': 'badge-danger',
      'Food': 'badge-warning',
      'Cleanliness': 'badge-info',
      'Security': 'badge-danger',
      'Other': 'badge-info'
    };
    return `badge ${badges[category] || 'badge-info'}`;
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complaints Management</h1>
          <p className="text-gray-600 mt-1">Review and resolve student complaints</p>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search complaints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="space-y-4">
          {filteredComplaints.map((complaint) => (
            <div key={complaint._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{complaint.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    By: {complaint.studentId?.userId?.name} • {new Date(complaint.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 mb-3">{complaint.description}</p>
                  <div className="flex space-x-2">
                    <span className={getCategoryBadge(complaint.category)}>{complaint.category}</span>
                    <span className={getStatusBadge(complaint.status)}>{complaint.status}</span>
                  </div>
                </div>
                <div className="ml-4">
                  <select
                    value={complaint.status}
                    onChange={(e) => handleStatusUpdate(complaint._id, e.target.value)}
                    className="text-sm border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          {filteredComplaints.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No complaints found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WardenComplaints;
