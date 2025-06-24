import React from 'react';
import { Link } from 'react-router-dom';

import { FaTicketAlt } from "react-icons/fa";

function SwiperElement(props) {
  return (
    <div className="relative h-[600px] w-full rounded-xl overflow-hidden border-8 border-transparent">
      {/* Image */}
      <img src={props.img} className="object-fit"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Text Content */}
      <div className="absolute bottom-20 right-20 text-white z-10 space-y-4 text-start">
        <h1 className="text-xl md:text-4xl lg:text-7xl font-bold">{props.title}</h1>
        <h2 className="text-lg md:text-2xl">{new Date(props.date).toUTCString().replace("00:00:00 GMT", "")} | {props.time}</h2>
        <Link to={`/event/${props.id}`}
          className="flex justify-center items-center gap-x-4 text-xl md:text-2xl bg-purple-600 p-3 rounded-lg hover:bg-purple-800">
          <FaTicketAlt /> Book Now
        </Link>
      </div>
    </div>
  );
}

export default SwiperElement;
