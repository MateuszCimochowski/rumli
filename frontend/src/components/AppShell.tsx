import { Logout, Login, MeetingRoom, Person } from '@mui/icons-material'
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function AppShell({ children }: { children: React.ReactNode }) {
  const { me, logout } = useAuth()

  return (
    <Box sx={{ minHeight: '100%', bgcolor: 'background.default' }}>
      <AppBar
        position="sticky"
        color="primary"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar>
          <MeetingRoom sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight={900} sx={{ flex: 1 }}>
            Rumli
          </Typography>

          <Button component={RouterLink} to="/rooms" color="inherit" sx={{ fontWeight: 600 }}>
            Sale
          </Button>
          {me && (
            <Button
              component={RouterLink}
              to="/profile"
              color="inherit"
              startIcon={<Person />}
              sx={{ fontWeight: 600 }}
            >
              Profil
            </Button>
          )}

          {me ? (
            <>
              <Typography sx={{ mx: 2, opacity: 0.9 }}>{me.username}</Typography>
              <Button
                onClick={() => void logout()}
                color="inherit"
                startIcon={<Logout />}
                sx={{
                  fontWeight: 600,
                  borderRadius: 999,
                  px: 1.5,
                }}
              >
                Wyloguj
              </Button>
            </>
          ) : (
            <Button
              component={RouterLink}
              to="/login"
              color="inherit"
              startIcon={<Login />}
              sx={{
                fontWeight: 600,
                borderRadius: 999,
                px: 1.5,
              }}
            >
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

