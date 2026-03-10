import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { AuthProvider } from './auth/AuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider
      theme={createTheme({
        palette: {
          mode: 'light',
          primary: {
            main: '#1e293b', // ciemny granat do AppBar
          },
        },
        shape: { borderRadius: 12 },
        typography: { fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif' },
      })}
    >
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
