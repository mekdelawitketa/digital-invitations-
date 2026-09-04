// frontend/src/features/owner/EventEditor.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventsAPI } from '../../api/events';
import { eventSchema } from '../../utils/validators';
import { useAuthStore } from '../../store/authStore';

export const EventEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const isEdit = !!id;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      type: 'wedding',
      description: '',
      startDate: '',
      timezone: 'Africa/Addis_Ababa',
      venueName: '',
      venueAddress: '',
      isPublic: true,
    },
  });

  const selectedType = watch('type');

  useEffect(() => {
    if (isEdit) {
      const fetchEvent = async () => {
        setLoading(true);
        try {
          const response = await eventsAPI.getById(id);
          const event = response.data;
          setValue('title', event.title);
          setValue('type', event.typeKey);
          setValue('description', event.description || '');
          setValue('startDate', event.startDate.split('T')[0]);
          setValue('timezone', event.timezone);
          setValue('venueName', event.venueName || '');
          setValue('venueAddress', event.venueAddress || '');
          setValue('isPublic', event.isPublic);
        } catch (err) {
          setError('Failed to load event');
        } finally {
          setLoading(false);
        }
      };
      fetchEvent();
    }
  }, [id, isEdit, setValue]);

  const onSubmit = async (data) => {
    setSaving(true);
    setError('');
    setSuccess(false);
    
    try {
      const themePresets = {
        wedding: { primaryColor: '#D4AF37', secondaryColor: '#F5F5DC', font: 'Playfair Display' },
        birthday: { primaryColor: '#FF6B6B', secondaryColor: '#FFE66D', font: 'Nunito' },
        graduation: { primaryColor: '#2C3E50', secondaryColor: '#F1C40F', font: 'Lora' },
      };

      const eventData = {
        ...data,
        themeSettings: themePresets[data.type] || themePresets.wedding,
        ownerId: user.id,
      };

      let response;
      if (isEdit) {
        response = await eventsAPI.update(id, eventData);
      } else {
        response = await eventsAPI.create(eventData);
        console.log('Created event response:', response);
      }

      setSuccess(true);
      
      // Redirect to my-events after success
      setTimeout(() => {
        navigate('/my-events');
      }, 1500);
      
    } catch (err) {
      console.error('Error creating event:', err);
      setError(err.response?.data?.message || 'Failed to save event');
      setSuccess(false);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading event...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        {isEdit ? 'Edit Event' : 'Create New Event'}
      </h1>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
          ✅ Event {isEdit ? 'updated' : 'created'} successfully! Redirecting to My Events...
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Title *
          </label>
          <input
            type="text"
            {...register('title')}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Abraham & Sara Wedding"
          />
          {errors.title && (
            <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Event Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Type *
          </label>
          <select
            {...register('type')}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="wedding">💒 Wedding</option>
            <option value="birthday">🎂 Birthday</option>
            <option value="graduation">🎓 Graduation</option>
          </select>
          {errors.type && (
            <p className="text-sm text-red-600 mt-1">{errors.type.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register('description')}
            rows="4"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell your guests about this special occasion..."
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Date & Timezone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date *
            </label>
            <input
              type="date"
              {...register('startDate')}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.startDate && (
              <p className="text-sm text-red-600 mt-1">{errors.startDate.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Timezone *
            </label>
            <select
              {...register('timezone')}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="UTC">UTC</option>
              <option value="Africa/Addis_Ababa">Africa/Addis_Ababa</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Europe/London">Europe/London</option>
              <option value="Asia/Dubai">Asia/Dubai</option>
            </select>
          </div>
        </div>

        {/* Venue */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Venue Name
          </label>
          <input
            type="text"
            {...register('venueName')}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Millennium Wedding Hall"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Venue Address
          </label>
          <input
            type="text"
            {...register('venueAddress')}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Bole Road, Addis Ababa"
          />
        </div>

        {/* Visibility */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            {...register('isPublic')}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            id="isPublic"
          />
          <label htmlFor="isPublic" className="text-sm text-gray-700">
            Make this event public (visible to everyone)
          </label>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : isEdit ? 'Update Event' : 'Create Event'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/my-events')}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};