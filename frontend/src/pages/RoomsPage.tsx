import { AccessTime, MeetingRoom } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { formatISO } from 'date-fns'
import { useMemo, useState } from 'react'
import { checkAvailability, createReservation, listRooms } from '../api/booking'
import type { Room } from '../api/types'
import { useAuth } from '../auth/AuthContext'

function toIsoFromLocalInput(value: string) {
  // value is "YYYY-MM-DDTHH:mm" (local). Convert to ISO with timezone offset.
  const d = new Date(value)
  return formatISO(d)
}

export function RoomsPage() {
  const { token } = useAuth()
  const [rooms, setRooms] = useState<Room[] | null>(null)
  const [available, setAvailable] = useState<Room[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const [startLocal, setStartLocal] = useState('')
  const [endLocal, setEndLocal] = useState('')

  const canCheck = Boolean(startLocal && endLocal)

  const startIso = useMemo(() => (startLocal ? toIsoFromLocalInput(startLocal) : ''), [startLocal])
  const endIso = useMemo(() => (endLocal ? toIsoFromLocalInput(endLocal) : ''), [endLocal])

  async function loadRooms() {
    setError(null)
    setBusy(true)
    try {
      setRooms(await listRooms())
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'Nie udało się pobrać sal')
    } finally {
      setBusy(false)
    }
  }

  async function onCheckAvailability() {
    setError(null)
    setBusy(true)
    try {
      setAvailable(await checkAvailability(startIso, endIso))
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'Nie udało się sprawdzić dostępności')
    } finally {
      setBusy(false)
    }
  }

  async function onReserve(roomId: number) {
    if (!token) {
      setError('Zaloguj się, aby utworzyć rezerwację.')
      return
    }
    setError(null)
    setBusy(true)
    try {
      await createReservation(roomId, startIso, endIso)
      await onCheckAvailability()
    } catch (err: any) {
      const msg =
        err?.response?.data?.non_field_errors?.[0] ??
        err?.response?.data?.detail ??
        err?.response?.data ??
        'Nie udało się zarezerwować'
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg))
    } finally {
      setBusy(false)
    }
  }

  const listToShow = available ?? rooms

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
            <Typography variant="h5" fontWeight={800} sx={{ flex: 1 }}>
              Sale
            </Typography>
            <Button variant="outlined" onClick={loadRooms} disabled={busy}>
              Odśwież listę
            </Button>
          </Stack>

          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    label="Start"
                    type="datetime-local"
                    value={startLocal}
                    onChange={(e) => setStartLocal(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                  <TextField
                    label="Koniec"
                    type="datetime-local"
                    value={endLocal}
                    onChange={(e) => setEndLocal(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                  <Button variant="contained" onClick={onCheckAvailability} disabled={!canCheck || busy}>
                    Sprawdź dostępność
                  </Button>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Po sprawdzeniu dostępności możesz kliknąć „Rezerwuj” przy wybranej sali.
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          {error && <Alert severity="error">{error}</Alert>}

          <Divider />

          {!listToShow && (
            <Alert severity="info">
              Kliknij „Odśwież listę”, aby pobrać sale, albo wybierz zakres czasu i sprawdź dostępność.
            </Alert>
          )}

          {listToShow && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' },
                gap: 2,
              }}
            >
              {listToShow.map((r) => (
                <Card key={r.id} variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
                  <CardContent>
                    <Stack spacing={1.5}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <MeetingRoom fontSize="small" />
                        <Typography fontWeight={800}>{r.name}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        <Chip size="small" label={r.location || '—'} />
                        <Chip size="small" label={`Capacity: ${r.capacity}`} />
                        {available && <Chip size="small" color="success" label="Available" icon={<AccessTime />} />}
                      </Stack>
                      <Button
                        variant="contained"
                        disabled={!canCheck || busy || !available || !token}
                        onClick={() => onReserve(r.id)}
                      >
                        Rezerwuj
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  )
}

