import { Logout, Login, MeetingRoom } from '@mui/icons-material'
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function AppShell({ children }: { children: React.ReactNode }) {
  const { me, logout } = useAuth()

  return (
    <Box sx={{ minHeight: '100%', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Toolbar>
          <MeetingRoom sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight={900} sx={{ flex: 1, color: 'text.primary' }}>
            Rumli
          </Typography>

          <Button component={RouterLink} to="/rooms" color="inherit">
            Sale
          </Button>
          <Button component={RouterLink} to="/my" color="inherit">
            Moje rezerwacje
          </Button>

          {me ? (
            <>
              <Typography sx={{ mx: 2, color: 'text.secondary' }}>{me.username}</Typography>
              <Button onClick={() => void logout()} color="inherit" startIcon={<Logout />}>
                Wyloguj
              </Button>
            </>
          ) : (
            <Button component={RouterLink} to="/login" color="inherit" startIcon={<Login />}>
              Zaloguj
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container disableGutters maxWidth={false}>
        {children}
      </Container>
    </Box>
  )
}

