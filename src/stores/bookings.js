import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBookingStore = defineStore('bookings', () => {
  const bookings = ref([
    {
      id: 1,
      programmeId: 1,
      programmeName: 'Community Free Clinic — July Session',
      sessionDate: '2026-07-30',
      sessionTime: '09:00 – 12:00',
      userName: 'Chen Xue',
      userEmail: 'user@test.com',
      phone: '0412345678',
      status: 'confirmed'
    }
  ])

  function addBooking(booking) {
    bookings.value.push({
      id: bookings.value.length + 1,
      status: 'confirmed',
      ...booking
    })
  }

  function updateStatus(id, status) {
    const b = bookings.value.find((x) => x.id === id)
    if (b) b.status = status
  }

  function bookingsForUser(email) {
    return bookings.value.filter((b) => b.userEmail === email)
  }

  // One-click CSV export (persona: Lin Hao, admin dashboard)
  function exportCsv() {
    const header = 'ID,Programme,Date,Time,Name,Email,Phone,Status'
    const rows = bookings.value.map((b) =>
      [b.id, b.programmeName, b.sessionDate, b.sessionTime, b.userName, b.userEmail, b.phone, b.status].join(',')
    )
    const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bookings.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return { bookings, addBooking, updateStatus, bookingsForUser, exportCsv }
})