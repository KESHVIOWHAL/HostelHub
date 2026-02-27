import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Building2 } from 'lucide-react';
import api from '../services/api';
import Modal from '../components/Modal';
import Loading from '../components/Loading';

const Wardens = () => {
  const [wardens, setWardens] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingWarden, setEditingWarden] = useState(null);
  const [assigningWarden, setAssigningWarden] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  useEffect(() => {
    fetchWardens();
    fetchRooms();
  }, []);

  const fetchWardens = async () => {
    try {
      const { data } = await api.get('/auth/users?role=warden');
      setWardens(data);
    } catch (error) {
      console.error('Error fetching wardens:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const { data } = await api.get('/rooms');
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingWarden) {
        await api.put(`/auth/users/${editingWarden._id}`, formData);
      } else {
        await api.post('/auth/register', { ...formData, role: 'warden' });
      }
      fetchWardens();
      setShowModal(false);
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this warden?')) {
      try {
        await api.delete(`/auth/users/${id}`);
        fetchWardens();
      } catch (error) {
        alert(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  const handleEdit = (warden) => {
    setEditingWarden(warden);
    setFormData({
      name: warden.name || '',
      email: warden.email || '',
      phone: warden.phone || '',
      password: ''
    });
    setShowModal(true);
  };

  const handleAssignRooms = (warden) => {
    setAssigningWarden(warden);
    // Get rooms already assigned to this warden
    const wardenRooms = rooms.filter(room => room.wardenId?._id === warden._id);
    setSelectedRooms(wardenRooms.map(room => room._id));
    setShowAssignModal(true);
  };

  const handleRoomToggle = (roomId) => {
    setSelectedRooms(prev => 
      prev.includes(roomId) 
        ? prev.filter(id => id !== roomId)
        : [...prev, roomId]
    );
  };

  const handleSaveRoomAssignment = async () => {
    try {
      // Update all rooms - assign or unassign warden
      const updatePromises = rooms.map(room => {
        if (selectedRooms.includes(room._id)) {
          // Assign this warden to the room
          return api.put(`/rooms/${room._id}`, { wardenId: assigningWarden._id });
        } else if (room.wardenId?._id === assigningWarden._id) {
          // Unassign this warden from the room
          return api.put(`/rooms/${room._id}`, { wardenId: null });
        }
        return Promise.resolve();
      });

      await Promise.all(updatePromises);
      
      fetchRooms();
      setShowAssignModal(false);
      setAssigningWarden(null);
      setSelectedRooms([]);
      alert('Room assignments updated successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update room assignments');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: ''
    });
    setEditingWarden(null);
  };

  const filteredWardens = wardens.filter(warden =>
    warden.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warden.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getWardenRooms = (wardenId) => {
    return rooms.filter(room => room.wardenId?._id === wardenId);
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Warden Management</h1>
          <p className="text-gray-600 mt-1">Manage wardens and assign rooms</p>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Warden</span>
        </button>
      </div>

      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search wardens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Assigned Rooms</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWardens.map((warden) => {
                const assignedRooms = getWardenRooms(warden._id);
                return (
                  <tr key={warden._id}>
                    <td className="font-medium">{warden.name}</td>
                    <td>{warden.email}</td>
                    <td>{warden.phone || 'N/A'}</td>
                    <td>
                      {assignedRooms.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {assignedRooms.map(room => (
                            <span key={room._id} className="badge badge-info text-xs">
                              {room.roomNumber}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No rooms assigned</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${warden.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {warden.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleAssignRooms(warden)} 
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded"
                          title="Assign Rooms"
                        >
                          <Building2 size={18} />
                        </button>
                        <button onClick={() => handleEdit(warden)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(warden._id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Warden Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }} title={editingWarden ? 'Edit Warden' : 'Add Warden'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="input-field"
              required
            />
          </div>
          {!editingWarden && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="input-field"
                required
                minLength="6"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="input-field"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editingWarden ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      {/* Assign Rooms Modal */}
      <Modal 
        isOpen={showAssignModal} 
        onClose={() => { setShowAssignModal(false); setAssigningWarden(null); setSelectedRooms([]); }} 
        title={`Assign Rooms to ${assigningWarden?.name}`}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Select rooms to assign to this warden:</p>
          
          <div className="max-h-96 overflow-y-auto space-y-2">
            {rooms.map(room => {
              const isSelected = selectedRooms.includes(room._id);
              const isAssignedToOther = room.wardenId && room.wardenId._id !== assigningWarden?._id;
              
              return (
                <div 
                  key={room._id} 
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    isSelected 
                      ? 'border-purple-500 bg-purple-50' 
                      : isAssignedToOther
                      ? 'border-gray-200 bg-gray-50 opacity-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => !isAssignedToOther && handleRoomToggle(room._id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        Room {room.roomNumber} - {room.blockName}
                      </p>
                      <p className="text-sm text-gray-500">
                        Capacity: {room.capacity} | Occupied: {room.occupiedBeds}
                      </p>
                      {isAssignedToOther && (
                        <p className="text-xs text-red-600 mt-1">
                          Assigned to: {room.wardenId.name}
                        </p>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => !isAssignedToOther && handleRoomToggle(room._id)}
                      disabled={isAssignedToOther}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button 
              type="button" 
              onClick={() => { setShowAssignModal(false); setAssigningWarden(null); setSelectedRooms([]); }} 
              className="btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="button" 
              onClick={handleSaveRoomAssignment} 
              className="btn-primary"
            >
              Save Assignments
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Wardens;
