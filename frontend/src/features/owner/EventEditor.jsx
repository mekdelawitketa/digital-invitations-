// frontend/src/features/owner/EventEditor.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventsAPI } from '../../api/events';
import { eventSchema } from '../../utils/validators';
import { EventTypeKey, THEME_PRESETS } from '../../types';

export const EventEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
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
      timezone: 'UTC',
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
    try {
      // Add theme settings based on type
      const eventData = {
        ...data,
        themeSettings: THEME_PRESETS[data.type] || THEME_PRESETS.wedding,
      };

      let response;
      if (isEdit) {
        response = await eventsAPI.update(id, eventData);
      } else {
        response = await eventsAPI.create(eventData);
      }

      navigate(`/my-events/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save event');
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
            placeholder="Abraham & Sara Wedding"
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
            placeholder="Millennium Wedding Hall"
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
            placeholder="Bole Road, Addis Ababa, Ethiopia"
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

      {/* Wedding Party Section (only for wedding events) */}
      {selectedType === 'wedding' && isEdit && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            💒 Wedding Party
          </h2>
          <p className="text-gray-500 text-sm">
            Add wedding party members in the event management page.
          </p>
          <Link
            to={`/my-events/${id}/wedding-party`}
            className="mt-3 inline-block text-blue-600 hover:text-blue-700"
          >
            Manage Wedding Party →
          </Link>
        </div>
      )}

      {/* Sections Management */}
      {isEdit && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📋 Event Sections
          </h2>
          <p className="text-gray-500 text-sm">
            Enable or disable sections on your invitation page.
          </p>
          <Link
            to={`/my-events/${id}/settings`}
            className="mt-3 inline-block text-blue-600 hover:text-blue-700"
          >
            Manage Sections →
          </Link>
        </div>
      )}
    </div>
  );
};export default EventEditor;