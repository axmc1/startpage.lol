import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Startpage from './Startpage.tsx'
import { Route } from 'wouter'
import Edit from './Edit.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Route path="/" component={Startpage}/>
    <Route path="/edit" component={Edit}/>
  </StrictMode>,
)
