import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Scene0Intro from './scenes/Scene0Intro'

const router = createBrowserRouter([
  { path: '/', element: <div /> },
  { path: '/scene0', element: <Scene0Intro /> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
