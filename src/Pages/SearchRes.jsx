import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import EventCard from '../Components/EventCard';
import Search from '../Components/Search';
import { Link } from 'react-router-dom';
import axios from 'axios';

function SearchRes() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q')?.toLowerCase() || '';
  
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://tickets-books.vercel.app/events');
        const eventsWithDefaults = response.data.map(event => ({
          ...event,
          categories: Array.isArray(event.categories) ? event.categories : [],
          description: event.description || 'No description available',
          date: event.date || 'Date not specified',
          time: event.time || 'Time not specified',
          location: event.location || 'Location not specified'
        }));
        setEvents(eventsWithDefaults);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    getEvents();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      const filtered = events.filter(event =>
        event.name.toLowerCase().includes(searchQuery) ||
        event.location.toLowerCase().includes(searchQuery) ||
        event.description.toLowerCase().includes(searchQuery) ||
        event.categories.some(cat => cat.toLowerCase().includes(searchQuery))
      );
      setFilteredEvents(filtered);
    }
  }, [searchQuery, events]);

  if (loading) return <div className="text-center py-8">Loading events...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <section className='px-20'>
      {/* Search Bar */}
      <Search />

      {/* Search Results or Latest Events */}
      <section className='px-8 space-y-4'>
        <div className="flex justify-between items-center">
          <p className='text-4xl font-bold'>Search Results for <span className='font-light'>{searchQuery}</span>
          </p>
          {!searchQuery && (
            <Link to='/events' className='p-3 bg-purple-600 text-white text-xl rounded-4xl'>All Events</Link>
          )}
        </div>

        {filteredEvents.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6 my-10'>
            {filteredEvents.map(event => (
              <EventCard
                key={event.id}
                title={event.name}
                id={event.id}
                location={event.location}
                time={event.time}
                date={event.date}
                categories={event.categories}
                description={event.description.substring(0, 50) + '...'}
              />
            ))}
          </div>
        ) : (
          <p className="text-xl text-center py-8">
            {searchQuery ? 'No events found matching your search.' : 'No events available.'}
          </p>
        )}
      </section>
    </section>
  );
}

export default SearchRes;