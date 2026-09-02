// frontend/src/features/invitation/RSVPForm.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { rsvpSchema } from '../../utils/validators';
import { rsvpAPI } from '../../api/rsvp';

export const RSVPForm = ({ eventId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      status: 'attending',
      numberOfGuests: 1,
    },
  });

  const status = watch('status');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError('');
    try {
      await rsvpAPI.submit(eventId, data);
      setSuccess(true);
      reset();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit RSVP');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">Thank You!</h3>
        <p className="text-green-600">
          Your RSVP has been submitted successfully. We look forward to seeing you!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">RSVP</h3>
      <p className="text-sm text-gray-500 mb-4">
        Please let us know if you can attend
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Name *
          </label>
          <input
            type="text"
            {...register('name')}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              {...register('phone')}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+251 911 223 344"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Will you attend? *
          </label>
          <div className="grid grid-cols-3 gap-2">
            <label className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                {...register('status')}
                value="attending"
              />
              <span>✅ Yes</span>
            </label>
            <label className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                {...register('status')}
                value="maybe"
              />
              <span>🤔 Maybe</span>
            </label>
            <label className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                {...register('status')}
                value="not_attending"
              />
              <span>❌ No</span>
            </label>
          </div>
          {errors.status && (
            <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>
          )}
        </div>

        {status !== 'not_attending' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Guests *
              </label>
              <input
                type="number"
                {...register('numberOfGuests', { valueAsNumber: true })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="20"
              />
              {errors.numberOfGuests && (
                <p className="text-sm text-red-600 mt-1">{errors.numberOfGuests.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Names of Additional Guests
              </label>
              <input
                type="text"
                {...register('guestNames')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John, Jane, etc."
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            {...register('message')}
            rows="3"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Leave a message for the host..."
          />
          {errors.message && (
            <p className="text-sm text-red-600 mt-1">{errors.message.message}</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
        </button>
      </form>
    </div>
  );
};