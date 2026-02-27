import { useState, useEffect } from 'react';
import { Search, Edit } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import Loading from '../components/Loading';

const WardenRooms = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    status: 'Available'
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const { data } = await api.get('/rooms');
      // Filter rooms assigned to this warden
      const wardenRooms = data.filter(room => room.wardenId?._id === user._id);
      setRooms(wardenRooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      status: room.status
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/rooms/${editingRoom._id}`, formData);
      fetchRooms();
      setShowModal(false);
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed');
    }
  };

  const resetForm = () => {
    setFormData({ status: 'Available' });
    setEditingRoom(null);
  };

  const filteredRooms = rooms.filter(room =>
    room.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.blockName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const badges = {
      'Available': 'badge-success',
      'Full': 'badge-danger',
      'Maintenance': 'badge-warning'
    };
    return `badge ${badges[status] || 'badge-info'}`;
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Assigned Rooms</h1>
          <p className="text-gray-600 mt-1">Manage rooms in your block</p>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Room Number</th>
                <th>Block Name</th>
                <th>Capacity</th>
                <th>Occupied</th>
                <th>Available</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRooms.map((room) => (
                <tr key={room._id}>
                  <td className="font-medium">{room.roomNumber}</td>
                  <td>{room.blockName}</td>
                  <td>{room.capacity}</td>
                  <td>{room.occupiedBeds}</td>
                  <td>{room.availableBeds}</td>
                  <td>
                    <span className={getStatusBadge(room.status)}>{room.status}</span>
                  </td>
                  <td>
                    <button onClick={() => handleEdit(room)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                      <Edit size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }} title="Update Room Status">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room: {editingRoom?.roomNumber} - {editingRoom?.blockName}
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="input-field"
            >
              <option value="Available">Available</option>
              <option value="Full">Full</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Update</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default WardenRooms;
