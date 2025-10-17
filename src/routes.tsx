import { lazy } from 'react'

// Lazy placeholders for scenes
const Scene1 = lazy(() => import('./scenes/Scene1'))
const Scene2 = lazy(() => import('./scenes/Scene2'))
const Scene3 = lazy(() => import('./scenes/Scene3'))
const Scene4 = lazy(() => import('./scenes/Scene4'))
const Scene5 = lazy(() => import('./scenes/Scene5'))
const Debrief = lazy(() => import('./scenes/Debrief'))

export default [
  { path: '/scene1', element: <Scene1 /> },
  { path: '/scene2', element: <Scene2 /> },
  { path: '/scene3', element: <Scene3 /> },
  { path: '/scene4', element: <Scene4 /> },
  { path: '/scene5', element: <Scene5 /> },
  { path: '/debrief', element: <Debrief /> },
]
