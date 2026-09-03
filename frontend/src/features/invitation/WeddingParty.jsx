// frontend/src/features/invitation/WeddingParty.jsx
import React from 'react';

export const WeddingParty = ({ members }) => {
  if (!members || members.length === 0) {
    return null;
  }

  // Group members by role
  const grouped = members.reduce((acc, member) => {
    if (!acc[member.role]) {
      acc[member.role] = [];
    }
    acc[member.role].push(member);
    return acc;
  }, {});

  // Order roles
  const roleOrder = [
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
    'Other'
  ];

  const sortedRoles = Object.keys(grouped).sort((a, b) => {
    const indexA = roleOrder.indexOf(a);
    const indexB = roleOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Wedding Party
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto" />
        </div>

        {sortedRoles.map((role) => (
          <div key={role} className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
              {role}s
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {grouped[role].map((member) => (
                <div
                  key={member.id}
                  className="bg-gray-50 rounded-xl p-4 text-center hover:shadow-md transition-shadow"
                >
                  {member.profileImage ? (
                    <img
                      src={member.profileImage}
                      alt={member.name}
                      className="w-20 h-20 rounded-full mx-auto object-cover mb-3"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full mx-auto bg-gradient-to-r from-pink-300 to-purple-300 flex items-center justify-center text-3xl text-white mb-3">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <p className="font-medium text-gray-800">{member.name}</p>
                  {member.bio && (
                    <p className="text-sm text-gray-500">{member.bio}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WeddingParty;