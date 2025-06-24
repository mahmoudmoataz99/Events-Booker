import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SwiperElement from '../Components/SwiperElement';
import heroBg from '../assets/events.jpg';
import EventCard from '../Components/EventCard';
import Search from '../Components/Search';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
        setEvents(response.data);
        
        
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    getEvents();
  }, []);

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold text-red-500">
          Error: {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="mb-20">
      {/* Hero Section */}
      <header className="h-[90vh] bg-cover bg-center text-white" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Discover the Latest & Hottest Events
          </h1>
          <p className="mt-4 text-lg md:text-2xl max-w-2xl mb-8">
            Book tickets, explore experiences, and never miss out on unforgettable moments.
          </p>
          <Link
            to="/events"
            className="px-8 py-3 bg-purple-600 text-white text-xl rounded-full hover:bg-purple-700 transition duration-300"
          >
            Browse All Events
          </Link>
        </div>
      </header>

      {/* Search Section */}
      <div className="container mx-auto px-4">
        <Search
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Search events by name, location or description..."
        />
      </div>

      {/* Featured Events Slider */}
      {filteredEvents.length > 0 ? (
        <div className="container mx-auto px-4 mt-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Events</h2>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay
            pagination={{ clickable: true }}
            className="py-6"
          >
            {filteredEvents.map(event => (
              <SwiperSlide key={event._id} className="pb-10">
                <SwiperElement
                  title={event.name}
                  id={event._id}
                  location={event.location}
                  time={event.time}
                  date={event.date}
                  img={event.image}
                  categories={event.categories}
                  description={event.description}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className="container mx-auto px-4 mt-12 text-center">
          <h2 className="text-3xl font-bold mb-4">No events found</h2>
          <p className="text-xl mb-6">Try adjusting your search or check back later</p>
          <button
            onClick={() => setSearchTerm('')}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Latest Events Section */}
      {filteredEvents.length > 0 && (
        <div className="container mx-auto px-4 mt-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Latest Events</h2>
            <Link to="/events" className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition">
              View More
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.slice(0, 3).map(event => (
              <EventCard
                key={event._id}
                title={event.name}
                id={event._id}
                location={event.location}
                img={event.image}
                time={event.time}
                date={event.date}
                categories={event.categories}
                description={event.description}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default Home;