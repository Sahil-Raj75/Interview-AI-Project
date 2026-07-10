import React from 'react'
import { RouterProvider } from "react-router";
import { router } from './routes/app.router';
import { AuthProvider } from './features/auth/auth.context';
import { InterviewProvider } from './features/interview/interview.context';
const App = () => {
  return (
    <InterviewProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </InterviewProvider>
  )
}

export default App