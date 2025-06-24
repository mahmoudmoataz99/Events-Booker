import React, { useEffect, useState } from 'react';
import { useUser } from '../Context/UserContext';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';

const Profile = () => {
  const { isAuthenticated, user, logoutUser } = useUser();
  const [userBookings, setUserBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserBookings = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const response = await axios.get(`https://tickets-books.vercel.app/bookings/user/${user.id}`);
        setUserBookings(response.data);
      } catch (err) {
        setError('Failed to fetch bookings');
        console.error('Error fetching bookings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserBookings();
  }, [user]);

  const cancelBooking = async (bookingId) => {
    try {
      setIsLoading(true);
      await axios.put(`https://tickets-books.vercel.app/bookings/cancel/${bookingId}`);
      
      // Update the bookings list after cancellation
      setUserBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: 'cancelled' } 
            : booking
        )
      );
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
      console.error('Error canceling booking:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-4xl mx-auto my-10 p-6">
      {/* User Profile Section */}
      <div className="bg-white rounded-lg shadow-md p-10 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">
              {user.name || user.username}
            </h1>
            <p className="text-gray-600 mb-2">{user.email}</p>
            <div className="flex gap-4 mt-2">
              {user.role !== 'admin' && (
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {userBookings.length} Bookings
                </div>
              )}
            </div>
          </div>
          <button 
            className='bg-red-600 text-white rounded-lg p-2' 
            onClick={() => logoutUser()}
          >
            Logout
          </button>
        </div>
      </div>

      {/* User Bookings Section */}
      {user.role !== 'admin' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Bookings</h2>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : userBookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No Bookings Found</p>
              <Link
                to="/events"
                className="text-blue-600 hover:underline"
              >
                Browse Events
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {userBookings.map(booking => (
                <div key={booking._id} className="border-b border-gray-200 pb-6 last:border-0">
                  <Link to={`/event/${booking.eventId._id}`}>
                    <div className="flex flex-col md:flex-row gap-4">
                      {booking.eventId?.image && (
                        <img
                          src={booking.eventId.image}
                          alt={booking.eventId.name}
                          className="w-full md:w-48 h-32 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {booking.eventId?.name || 'Event'}
                        </h3>
                        <div className="text-gray-600 text-sm mt-1 space-y-1">
                          <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
                          <p>Time: {booking.time}</p>
                          <p>Location: {booking.location}</p>
                          <p>Seats: {booking.seats}</p>
                          <p>Total: ${(booking.price || 0).toFixed(2)}</p>
                          <p className={`text-sm font-medium ${
                            booking.status === 'cancelled' ? 'text-red-500' : 'text-green-500'
                          }`}>
                            Status: {booking.status}
                          </p>
                        </div>
                        {booking.status !== 'cancelled' && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              cancelBooking(booking._id);
                            }}
                            disabled={isLoading}
                            className="mt-3 text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            {isLoading ? 'Processing...' : 'Cancel Booking'}
                          </button>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;