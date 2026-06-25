import {createBrowserRouter} from 'react-router'

import Login from '../features/auth/pages/Login.jsx'
import Register from "../features/auth/pages/Register.jsx";
import Protected from '../features/auth/components/protected.jsx';

export const router = createBrowserRouter([
    {
        path: '/register',
        element:<Register/>
    },
    {
        path: '/login',
        element :<Login/>
    },
    {
        path: '/',
        element: <Protected><h1>Home Page</h1></Protected>
    }
])