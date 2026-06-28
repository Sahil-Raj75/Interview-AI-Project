import { createBrowserRouter } from 'react-router'

import Login from '../features/auth/pages/Login.jsx'
import Register from "../features/auth/pages/Register.jsx";
import Protected from '../features/auth/components/protected.jsx';
import Home from '../features/interview/pages/Home.jsx';

export const router = createBrowserRouter([
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/',
        element: <Protected><Home /></Protected>
    }
])