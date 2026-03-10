export type Room = {
  id: number
  name: string
  location: string
  capacity: number
}

export type Reservation = {
  id: number
  user: string
  room: number
  room_name: string
  start_at: string
  end_at: string
  created_at: string
}

