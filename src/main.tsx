import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Startpage from './Startpage.tsx'
import { Route } from 'wouter'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Route path="/" component={Startpage}/>
  </StrictMode>,
)
