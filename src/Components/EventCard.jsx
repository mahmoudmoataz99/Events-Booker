import React from 'react'
import { Link } from 'react-router';
import heroBg from '../assets/events.jpg';

function EventCard(props) {
  return (
    <Link to={`/event/${props.id}`} className='space-y-2 p-4 rounded-4xl hover:scale-105'>
      <img src={props.img ? props.img : heroBg} className='h-80 rounded-xl object-fill' />

      <div className="bg-purple-300/50 rounded-xl p-4 space-y-4">
        <h1 className='text-xl font-bold'>{props.title}</h1>
        <h1 className='text-sm text-black/50'>{props.location}</h1>
        <p className='text-md'>{props.description.substring(0, 30) + '...'}</p>
        <h1 className='text-sm'>{new Date(props.date).toUTCString().replace("00:00:00 GMT","")} | {props.time}</h1>
        {props.categories.length > 0 && <div className='space-x-2 md:space-x-4'>
          {props.categories.map((cats => <span className='px-3 py-1 bg-purple-400 rounded-4xl'>{cats}</span>))}
        </div>}
      </div>
    </Link>
  )
}

export default EventCard
