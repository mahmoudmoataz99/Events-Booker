import React from 'react';

function Contact() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-4xl font-bold text-center mb-12">Contact Us</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Info Section */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">About EventBook</h3>
          <p className="text-gray-700">
            EventBook is your go-to platform for discovering, booking, and managing events with ease.
            From concerts and festivals to workshops and networking events, we make sure you never miss out.
          </p>
          <p className="text-gray-700">
            Our mission is to connect people through meaningful experiences and empower event organizers with the tools they need to succeed.
          </p>
        </div>

        {/* Contact Details */}
        <div className="bg-gray-100 p-8 rounded-lg shadow-md space-y-4">
          <h4 className="text-xl font-semibold">Get in Touch</h4>
          <p><span className="font-semibold">Email:</span> support@eventbook.com</p>
          <p><span className="font-semibold">Phone:</span> +1 (800) 123-4567</p>
          <p><span className="font-semibold">Address:</span> 123 Event Street, Cityville, USA</p>
          <p><span className="font-semibold">Support Hours:</span> Mon–Fri, 9:00 AM – 6:00 PM</p>
        </div>
      </div>
    </section>
  );
}

export default Contact;
