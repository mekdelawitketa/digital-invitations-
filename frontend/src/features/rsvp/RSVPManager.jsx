// frontend/src/features/rsvp/RSVPManager.jsx
import { useParams, Link } from 'react-router-dom';
import { RSVPStats } from './RSVPStats';
import { RSVPList } from './RSVPList';

export const RSVPManager = () => {
  const { id } = useParams();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">RSVP Management</h1>
          <p className="text-gray-500 mt-1">Track and manage guest responses</p>
        </div>
        <Link
          to={`/my-events/${id}`}
          className="text-blue-600 hover:text-blue-700"
        >
          ← Back to Event
        </Link>
      </div>

      {/* Statistics */}
      <div className="mb-8">
        <RSVPStats eventId={id} />
      </div>

      {/* Guest List */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Guest List</h2>
        <RSVPList eventId={id} />
      </div>
    </div>
  );
};