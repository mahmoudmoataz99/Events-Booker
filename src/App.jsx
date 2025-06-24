import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import MainLayout from './MainLayout';
import Home from './Pages/Home';
import AllEvents from './Pages/AllEvents';
import Contact from './Pages/Contact';
import EventDetails from './Pages/EventDetails';
import AdminPanel from './Pages/Admin/AdminPanel';
import SearchRes from './Pages/SearchRes';
import { UserProvider } from './Context/UserContext';
import Profile from './Pages/Profile';
import ProtectedRoute from './ProtectedRoute';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { path: '', element: <Home /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { 
          path: 'events', 
          element: <AllEvents />
        },
        { 
          path: 'contact', 
          element: <Contact />
        },
        { 
          path: 'event/:id', 
          element: <EventDetails />
        },
        { 
          path: 'search', 
          element:<SearchRes />
        },
        { 
          path: 'profile', 
          element: <Profile />
        },
        {
          path: 'admin',
          element: (
            <ProtectedRoute adminOnly={true}>
              <AdminPanel />
            </ProtectedRoute>
          )
        },
      ]
    }
  ]);

  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;