import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router';

function Register() {
 const [name, setName] = useState('');
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [submitted, setSubmitted] = useState(false);

 const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
 };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitted(true);

  if (name && isValidEmail(email) && password.length >= 6) {
   await axios.post('https://tickets-books.vercel.app/users/register',{name,email,password,role:'user'})
   alert('Registration successful!');
  }
 };

 return (
  <>
   <section className='mx-[20%] py-10'>
    <article className='border-2 rounded-lg p-4 space-y-10'>
     <h2 className='text-3xl text-center font-bold'>Register</h2>
     <form className='space-y-6' onSubmit={handleSubmit} noValidate>
      <div className='flex flex-col gap-y-4'>
       <label className='text-xl'>Name</label>
       <input type="text" value={name} onChange={(e) => setName(e.target.value)}
        className={`bg-gray-200 p-2 rounded-lg focus:outline-0 ${submitted && !name ? 'bg-red-300' : ''}`} />
       {submitted && !name && (
        <p className='text-purple-600'>Name is required</p>
       )}
      </div>
      <div className='flex flex-col gap-y-4'>
       <label className='text-xl'>Email</label>
       <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
        className={`bg-gray-200 p-2 rounded-lg focus:outline-0 ${submitted && !isValidEmail(email) ? 'bg-red-300' : ''}`} />
       {submitted && !isValidEmail(email) && (
        <p className='text-purple-600'>Email is not correct</p>
       )}
      </div>
      <div className='flex flex-col gap-y-4'>
       <label className='text-xl'>Password</label>
       <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
        className={`bg-gray-200 p-2 rounded-lg focus:outline-0 ${submitted && password.length < 6 ? 'bg-purple-300' : ''}`} />
       {submitted && password.length < 6 && (
        <p className='text-red-600'>Password must be at least 6 characters</p>
       )}
      </div>
      <div className="flex">
       <p>
        Already Have An Account?{' '}
        <Link to='/login' className='text-blue-600 font-bold hover:text-blue-800 cursor-pointer'>
         Login
        </Link>
       </p>
      </div>
      <div className="flex justify-center">
       <button type="submit" className='my-6 px-40 p-2 bg-blue-600 text-2xl text-white rounded-lg hover:bg-blue-800'>
        Register
       </button>
      </div>
     </form>
    </article>
   </section>
  </>
 );
}

export default Register;
