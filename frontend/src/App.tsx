import { CircularProgress, Box } from '@mui/material'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './auth/AuthContext'
import { AppShell } from './components/AppShell'
import { LoginPage } from './pages/LoginPage'
import { MyReservationsPage } from './pages/MyReservationsPage'
import { ProfilePage } from './pages/ProfilePage'
import { RegisterPage } from './pages/RegisterPage'
import { RoomsPage } from './pages/RoomsPage'

function Protected({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth()
  if (isLoading) {
    return (
      <Box sx={{ height: '100%', display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  const { token } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/rooms" replace /> : <LoginPage />} />
      <Route path="/register" element={token ? <Navigate to="/rooms" replace /> : <RegisterPage />} />
      <Route
        path="/rooms"
        element={
          <AppShell>
            <RoomsPage />
          </AppShell>
        }
      />
      <Route
        path="/my"
        element={
          <Protected>
            <AppShell>
              <MyReservationsPage />
            </AppShell>
          </Protected>
        }
      />
      <Route
        path="/profile"
        element={
          <Protected>
            <AppShell>
              <ProfilePage />
            </AppShell>
          </Protected>
        }
      />
      <Route path="*" element={<Navigate to="/rooms" replace />} />
    </Routes>
  )
}
