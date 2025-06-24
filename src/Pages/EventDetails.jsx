import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../Context/UserContext';

function EventDetails() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [hasBooking, setHasBooking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [seatsRequested, setSeatsRequested] = useState(1);
  const { isAuthenticated, user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const eventResponse = await axios.get(`https://tickets-books.vercel.app/events/${eventId}`);
        setEvent(eventResponse.data);

        if (user) {
          try {
            const bookingResponse = await axios.get(
              `https://tickets-books.vercel.app/bookings/checkBook/${user.id}/${eventId}`
            );
            setHasBooking(bookingResponse.data === true);
          } catch {
            setHasBooking(false); 
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId, user]);

  const handleBooking = async () => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    if (hasBooking) {
      alert('You have already booked this event.');
      return;
    }

    if (seatsRequested > event.availableSeats) {
      alert(`Only ${event.availableSeats} seats available!`);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('https://tickets-books.vercel.app/bookings/create', {
        eventId: event._id,
        userId: user.id,
        seats: seatsRequested
      });

      setHasBooking(true);
      alert(`Successfully booked ${seatsRequested} seat(s) for ${event.name}`);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Booking failed');
      alert('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold">Loading event...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold">Error</h2>
        <p className="mt-4 text-red-500">{error}</p>
        <Link to="/events" className="mt-4 inline-block text-blue-600 hover:underline">
          Back to events
        </Link>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold">Event Not Found</h2>
        <p className="mt-4">Please check the URL or go back to the events list.</p>
        <Link to="/events" className="mt-4 inline-block text-blue-600 hover:underline">
          Back to events
        </Link>
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Event Image */}
        <img src={event.image} alt={event.name} className="w-full h-64 md:h-96 object-fit  rounded-lg shadow-lg"/>

        {/* Event Details */}
        <article className="space-y-5">
          <h1 className="text-3xl md:text-4xl font-bold">{event.name}</h1>

          {event.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {event.categories.map((cat, index) => (
                <span key={index} className="bg-purple-200 text-sm px-3 py-1 rounded-full">
                  {cat}
                </span>
              ))}
            </div>
          )}

          <p className="text-gray-600 text-base md:text-lg">{event.description}</p>

          <div className="text-base md:text-lg space-y-2">
            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {event.time}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Price:</strong> ${event.price.toFixed(2)}</p>
            <p><strong>Seats Available:</strong> {event.availableSeats}</p>
          </div>

          {/* Existing booking message */}
          {hasBooking && (
            <div className="bg-green-100 text-green-800 p-3 rounded-md">
              You already have a booking for this event.
            </div>
          )}

          {/* Seat Selection */}
          <div className="mt-6">
            <label className="block mb-2 font-medium">Number of Seats:</label>
            <input type="number" min="1" max="4" value={seatsRequested}
              onChange={(e) => {
                const value = Math.max(1, Math.min(event.availableSeats, parseInt(e.target.value) || 1));
                setSeatsRequested(value);
              }} className="w-24 p-2 border border-gray-300 rounded" disabled={hasBooking} />
          </div>

          {/* Booking Button */}
          <div className="mt-6">
            {isAuthenticated ? (
              hasBooking ? (
                <Link to="/profile" className="block text-center bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 w-full md:w-auto">
                  View Your Booking
                </Link>
              ) : (
                <button onClick={handleBooking} disabled={loading || event.availableSeats === 0}
                  className={`px-6 py-3 rounded w-full md:w-auto ${loading || event.availableSeats === 0
                    ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}>
                  {loading ? 'Processing...' : event.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
                </button>
              )
            ) : (
              <Link to="/login" className="block text-center bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700 w-full md:w-auto">
                Login to book
              </Link>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

export default EventDetails;
