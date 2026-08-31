// frontend/src/features/invitation/EventStory.jsx

export const EventStory = ({ stories }) => {
  if (!stories || stories.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Our Story
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto" />
        </div>

        <div className="space-y-8">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-xl shadow-md p-6 md:p-8"
            >
              {story.title && (
                <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
                  {story.title}
                </h3>
              )}
              {story.subtitle && (
                <p className="text-gray-500 text-sm mb-4">{story.subtitle}</p>
              )}
              {story.content && (
                <p className="text-gray-600 leading-relaxed">{story.content}</p>
              )}
              {story.image && (
                <img
                  src={story.image}
                  alt={story.title || 'Story image'}
                  className="mt-4 rounded-lg w-full max-h-96 object-cover"
                  loading="lazy"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};