import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App.jsx'
import "./main.css"
import { BrowserRouter } from 'react-router-dom'

const onRedirectCallback = (appState) => {
  window.history.replaceState({}, document.title, appState?.returnTo || "/");
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter >
<Auth0Provider
    domain="dev-lxi2vw3wbdo4kdcp.us.auth0.com"
    clientId="n2Z6qcKT4lYv5f8q23uCVuZdhHLFSypt"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <App />
  </Auth0Provider>,
  </BrowserRouter>
  </StrictMode>,
)
