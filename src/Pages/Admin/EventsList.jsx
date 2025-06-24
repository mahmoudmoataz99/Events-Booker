import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const EventsList = ({ 
  events, 
  onDelete, 
  onEdit, 
  searchTerm, 
  onSearchChange,
  onLoadMore,
  hasMoreEvents 
}) => {
  const [expandedEvent, setExpandedEvent] = useState(null);

  const toggleExpand = (id) => {
    setExpandedEvent(expandedEvent === id ? null : id);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">All Events</h2>
        <input
          type="text"
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search events..."
          className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-4">
        {events.length === 0 ? (
          <p className="text-gray-500">No events found</p>
        ) : (
          events.map((event) => (
            <div key={event._id} className="border rounded-lg overflow-hidden">
              <div className="p-4">
                <div className="flex items-start">
                  <img 
                    src={event.image} 
                    alt={event.name} 
                    className="w-32 h-32 object-cover rounded mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-xl font-bold">{event.name}</h3>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => onEdit(event._id)}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => onDelete(event._id)}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {event.categories.map((category, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 text-gray-600">{new Date(event.date).toUTCString().replace("00:00:00 GMT","")} • {event.time}</p>
                    <p className="text-gray-600">{event.location}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold">${event.price}</span>
                      <span className="text-sm text-gray-500">
                        {event.availableSeats} seats available
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleExpand(event._id)}
                  className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {expandedEvent === event._id ? 'Show Less' : 'Show More'}
                </button>

                {expandedEvent === event._id && (
                  <div className="mt-3 pt-3 border-t">
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-gray-700">{event.description}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {hasMoreEvents && (
        <div className="mt-6 text-center">
          <button
            onClick={onLoadMore}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
          >
            Load More Events
          </button>
        </div>
      )}
    </div>
  );
};

export default EventsList;