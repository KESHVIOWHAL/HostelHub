import { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, MapPin, BookOpen, Home, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Loading from '../components/Loading';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    guardianName: '',
    guardianPhone: ''
  });

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      if (user.role === 'student') {
        // Find student by userId
        const { data: students } = await api.get('/students');
        const studentProfile = students.find(s => s.userId._id === user._id);
        
        if (studentProfile) {
          setProfile(studentProfile);
          setFormData({
            name: studentProfile.userId?.name || '',
            email: studentProfile.userId?.email || '',
            phone: studentProfile.userId?.phone || '',
            address: studentProfile.address || '',
            guardianName: studentProfile.guardianName || '',
            guardianPhone: studentProfile.guardianPhone || ''
          });
        }
      } else {
        // For admin and warden, just show user info
        const { data } = await api.get('/auth/me');
        setProfile({ userId: data });
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    // Reset form data
    if (profile) {
      setFormData({
        name: profile.userId?.name || '',
        email: profile.userId?.email || '',
        phone: profile.userId?.phone || '',
        address: profile.address || '',
        guardianName: profile.guardianName || '',
        guardianPhone: profile.guardianPhone || ''
      });
    }
  };

  const handleSave = async () => {
    try {
      if (user.role === 'student' && profile._id) {
        await api.put(`/students/${profile._id}`, formData);
      } else {
        // Update user info for admin/warden
        await api.put(`/auth/update`, formData);
      }
      
      await fetchProfile();
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">View and manage your Hostel Hub profile</p>
        </div>
        {!editing ? (
          <button onClick={handleEdit} className="btn-primary flex items-center space-x-2">
            <Edit2 size={18} />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button onClick={handleCancel} className="btn-secondary flex items-center space-x-2">
              <X size={18} />
              <span>Cancel</span>
            </button>
            <button onClick={handleSave} className="btn-primary flex items-center space-x-2">
              <Save size={18} />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mx-auto flex items-center justify-center mb-4">
              <User size={64} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {profile?.userId?.name || user.name}
            </h2>
            <p className="text-primary-600 font-medium capitalize mb-4">
              {user.role}
            </p>
            {user.role === 'student' && profile?.studentId && (
              <div className="inline-flex items-center px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium">
                ID: {profile.studentId}
              </div>
            )}
          </div>

          {user.role === 'student' && profile?.roomId && (
            <div className="card mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Home size={20} className="mr-2 text-primary-600" />
                Room Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Room Number</p>
                  <p className="font-medium text-gray-900">{profile.roomId.roomNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Block</p>
                  <p className="font-medium text-gray-900">{profile.roomId.blockName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Capacity</p>
                  <p className="font-medium text-gray-900">
                    {profile.roomId.occupiedBeds} / {profile.roomId.capacity} occupied
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Details Card */}
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="mr-2 text-gray-400" />
                  Full Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile?.userId?.name || 'N/A'}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Mail size={16} className="mr-2 text-gray-400" />
                  Email Address
                </label>
                {editing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile?.userId?.email || 'N/A'}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Phone size={16} className="mr-2 text-gray-400" />
                  Phone Number
                </label>
                {editing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile?.userId?.phone || 'N/A'}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="mr-2 text-gray-400" />
                  Role
                </label>
                <p className="text-gray-900 font-medium capitalize">{user.role}</p>
              </div>

              {/* Student-specific fields */}
              {user.role === 'student' && (
                <>
                  {/* Course */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <BookOpen size={16} className="mr-2 text-gray-400" />
                      Course
                    </label>
                    <p className="text-gray-900 font-medium">{profile?.course || 'N/A'}</p>
                  </div>

                  {/* Year */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Calendar size={16} className="mr-2 text-gray-400" />
                      Year
                    </label>
                    <p className="text-gray-900 font-medium">Year {profile?.year || 'N/A'}</p>
                  </div>

                  {/* Date of Birth */}
                  {profile?.dateOfBirth && (
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <Calendar size={16} className="mr-2 text-gray-400" />
                        Date of Birth
                      </label>
                      <p className="text-gray-900 font-medium">
                        {new Date(profile.dateOfBirth).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {/* Joining Date */}
                  {profile?.joiningDate && (
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <Calendar size={16} className="mr-2 text-gray-400" />
                        Joining Date
                      </label>
                      <p className="text-gray-900 font-medium">
                        {new Date(profile.joiningDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <MapPin size={16} className="mr-2 text-gray-400" />
                      Address
                    </label>
                    {editing ? (
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="input-field"
                        rows="2"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{profile?.address || 'N/A'}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Guardian Information (Student only) */}
          {user.role === 'student' && (
            <div className="card mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Guardian Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Guardian Name */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <User size={16} className="mr-2 text-gray-400" />
                    Guardian Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="guardianName"
                      value={formData.guardianName}
                      onChange={handleChange}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profile?.guardianName || 'N/A'}</p>
                  )}
                </div>

                {/* Guardian Phone */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Phone size={16} className="mr-2 text-gray-400" />
                    Guardian Phone
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      name="guardianPhone"
                      value={formData.guardianPhone}
                      onChange={handleChange}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profile?.guardianPhone || 'N/A'}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Account Information */}
          <div className="card mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Account Status
                </label>
                <span className="badge badge-success">Active</span>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Member Since
                </label>
                <p className="text-gray-900 font-medium">
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
