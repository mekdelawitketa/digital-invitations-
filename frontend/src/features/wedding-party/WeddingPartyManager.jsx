// frontend/src/features/wedding-party/WeddingPartyManager.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { weddingPartyAPI } from '../../api/weddingParty';

export const WeddingPartyManager = () => {
  const { id } = useParams();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    profileImage: '',
    instagram: '',
    facebook: '',
    displayOrder: 0,
  });

  const roles = [
    'Bride',
    'Groom',
    'Maid of Honor',
    'Best Man',
    'Bridesmaid',
    'Groomsman',
    'Flower Girl',
    'Ring Bearer',
    'Parents',
    'Family',
    'Other',
  ];

  useEffect(() => {
    fetchMembers();
  }, [id]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await weddingPartyAPI.getByEvent(id);
      setMembers(response.data || []);
    } catch (error) {
      console.error('Failed to fetch wedding party:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name: formData.name,
        role: formData.role,
        bio: formData.bio,
        profileImage: formData.profileImage,
        socialLinks: {
          instagram: formData.instagram,
          facebook: formData.facebook,
        },
        displayOrder: members.length,
      };

      if (editingMember) {
        await weddingPartyAPI.update(id, editingMember.id, data);
      } else {
        await weddingPartyAPI.create(id, data);
      }

      setShowForm(false);
      setEditingMember(null);
      setFormData({
        name: '',
        role: '',
        bio: '',
        profileImage: '',
        instagram: '',
        facebook: '',
        displayOrder: 0,
      });
      fetchMembers();
    } catch (error) {
      alert('Failed to save wedding party member');
    }
  };

  const handleDelete = async (memberId) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    try {
      await weddingPartyAPI.delete(id, memberId);
      fetchMembers();
    } catch (error) {
      alert('Failed to delete member');
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio || '',
      profileImage: member.profileImage || '',
      instagram: member.socialLinks?.instagram || '',
      facebook: member.socialLinks?.facebook || '',
      displayOrder: member.displayOrder || 0,
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingMember(null);
    setFormData({
      name: '',
      role: '',
      bio: '',
      profileImage: '',
      instagram: '',
      facebook: '',
      displayOrder: 0,
    });
  };

  // Group members by role
  const groupedMembers = members.reduce((acc, member) => {
    if (!acc[member.role]) acc[member.role] = [];
    acc[member.role].push(member);
    return acc;
  }, {});

  // Sort roles in a specific order
  const roleOrder = ['Bride', 'Groom', 'Maid of Honor', 'Best Man', 'Bridesmaid', 'Groomsman', 'Flower Girl', 'Ring Bearer', 'Parents', 'Family', 'Other'];
  
  const sortedRoles = Object.keys(groupedMembers).sort((a, b) => {
    const indexA = roleOrder.indexOf(a);
    const indexB = roleOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">💒 Wedding Party</h1>
          <p className="text-gray-500 mt-1">Manage your wedding party members</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Member
          </button>
          <Link
            to={`/my-events/${id}`}
            className="text-blue-600 hover:text-blue-700"
          >
            ← Back
          </Link>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {editingMember ? 'Edit Member' : 'Add New Member'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows="3"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description about this person..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Image URL
              </label>
              <input
                type="url"
                value={formData.profileImage}
                onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://instagram.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={formData.facebook}
                  onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://facebook.com/username"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingMember ? 'Update Member' : 'Add Member'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Members List */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="text-gray-500">Loading wedding party...</div>
        </div>
      ) : members.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="text-6xl mb-4">💒</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Wedding Party Members</h3>
          <p className="text-gray-500 mb-4">
            Add your wedding party members to showcase them on your invitation
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add First Member
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedRoles.map((role) => (
            <div key={role}>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                {role}s
                <span className="text-sm text-gray-400 ml-2">
                  ({groupedMembers[role].length})
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedMembers[role].map((member) => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    onEdit={() => handleEdit(member)}
                    onDelete={() => handleDelete(member.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Member Card Component
const MemberCard = ({ member, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 bg-gray-100">
        {member.profileImage ? (
          <img
            src={member.profileImage}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-8xl bg-gradient-to-br from-pink-200 to-purple-200">
            {member.name.charAt(0)}
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={onEdit}
            className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors text-sm"
          >
            ✏️
          </button>
          <button
            onClick={onDelete}
            className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors text-sm"
          >
            ×
          </button>
        </div>
      </div>

      <div className="p-4">
        <h4 className="font-semibold text-gray-800">{member.name}</h4>
        <p className="text-sm text-gray-500">{member.role}</p>
        {member.bio && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{member.bio}</p>
        )}
        {member.socialLinks && (member.socialLinks.instagram || member.socialLinks.facebook) && (
          <div className="mt-3 flex gap-2">
            {member.socialLinks.instagram && (
              <a
                href={member.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-700 text-sm"
              >
                📸 Instagram
              </a>
            )}
            {member.socialLinks.facebook && (
              <a
                href={member.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                📘 Facebook
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};