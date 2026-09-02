// frontend/src/features/schedule/ScheduleManager.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { scheduleAPI } from '../../api/schedule';

export const ScheduleManager = () => {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    image: '',
  });

  useEffect(() => {
    fetchItems();
  }, [id]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await scheduleAPI.getByEvent(id);
      setItems(response.data || []);
    } catch (error) {
      console.error('Failed to fetch schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        displayOrder: items.length,
      };

      if (editingItem) {
        await scheduleAPI.update(id, editingItem.id, data);
      } else {
        await scheduleAPI.create(id, data);
      }

      setShowForm(false);
      setEditingItem(null);
      setFormData({
        title: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        image: '',
      });
      fetchItems();
    } catch (error) {
      alert('Failed to save schedule item');
    }
  };

  const handleDelete = async (itemId) => {
    if (!confirm('Are you sure you want to delete this schedule item?')) return;
    try {
      await scheduleAPI.delete(id, itemId);
      fetchItems();
    } catch (error) {
      alert('Failed to delete schedule item');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      date: item.date ? item.date.split('T')[0] : '',
      startTime: item.startTime || '',
      endTime: item.endTime || '',
      location: item.location || '',
      image: item.image || '',
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      image: '',
    });
  };

  // Sort items by display order
  const sortedItems = [...items].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">📅 Schedule Manager</h1>
          <p className="text-gray-500 mt-1">Create and manage your event timeline</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Schedule Item
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
            {editingItem ? 'Edit Schedule Item' : 'Add Schedule Item'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Wedding Ceremony"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe this event..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Wedding Hall"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingItem ? 'Update Item' : 'Add Item'}
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

      {/* Schedule Items List */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="text-gray-500">Loading schedule...</div>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Schedule Items</h3>
          <p className="text-gray-500 mb-4">
            Create your event timeline to keep guests informed
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add First Item
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {sortedItems.map((item, index) => (
              <ScheduleItemCard
                key={item.id}
                item={item}
                index={index}
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDelete(item.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Schedule Item Card Component
const ScheduleItemCard = ({ item, index, onEdit, onDelete }) => {
  return (
    <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start gap-4">
        {/* Timeline Number */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
          {index + 1}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold text-gray-800">{item.title}</h4>
              {item.description && (
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              )}
              <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                {item.date && (
                  <span>📅 {new Date(item.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}</span>
                )}
                {item.startTime && (
                  <span>🕐 {item.startTime} {item.endTime && `- ${item.endTime}`}</span>
                )}
                {item.location && (
                  <span>📍 {item.location}</span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                ✏️ Edit
              </button>
              <button
                onClick={onDelete}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
          {item.image && (
            <img
              src={item.image}
              alt={item.title}
              className="mt-2 w-32 h-20 object-cover rounded-lg"
            />
          )}
        </div>
      </div>
    </div>
  );
};