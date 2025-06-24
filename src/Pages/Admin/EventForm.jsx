import React from 'react';

const EventForm = ({ 
  eventForm, 
  categories, 
  handleInputChange, 
  handleSubmit, 
  resetForm,
  isEditing 
}) => {
  return (
    <div className="mt-10 p-6 border rounded-lg bg-white">
      <h2 className="text-2xl font-semibold mb-6">
        {isEditing ? 'Edit Event' : 'Create New Event'}
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Event Name</label>
          <input 
            type="text" 
            name="name" 
            value={eventForm.name} 
            onChange={handleInputChange} 
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea 
            name="description" 
            value={eventForm.description} 
            onChange={handleInputChange} 
            rows="4"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Categories</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {categories.map((category) => (
              <div key={category._id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`category-${category._id}`}
                  name="categories"
                  value={category.name}
                  checked={eventForm.categories.includes(category.name)}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`category-${category._id}`} className="ml-2 text-sm text-gray-700">
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Date</label>
            <input 
              type="date" 
              name="date" 
              value={eventForm.date} 
              onChange={handleInputChange} 
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Time</label>
            <input 
              type="time" 
              name="time" 
              value={eventForm.time} 
              onChange={handleInputChange} 
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Location</label>
          <input 
            type="text" 
            name="location" 
            value={eventForm.location} 
            onChange={handleInputChange} 
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Price ($)</label>
            <input 
              type="number" 
              name="price" 
              value={eventForm.price} 
              onChange={handleInputChange} 
              min="0"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Available Seats</label>
            <input 
              type="number" 
              name="availableSeats" 
              value={eventForm.availableSeats} 
              onChange={handleInputChange} 
              min="1"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Image URL</label>
          <input 
            type="text" 
            name="image" 
            value={eventForm.image} 
            onChange={handleInputChange} 
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isEditing ? 'Update Event' : 'Create Event'}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventForm;