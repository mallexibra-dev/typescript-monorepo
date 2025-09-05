export function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

export function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0')
  const month = date.toLocaleString('id-ID', { month: 'long' })
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

export function formatDateTime(date: Date): string {
  return `${formatDate(date)}, ${formatTime(date)}`
}

export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInSeconds = Math.floor(diffInMs / 1000)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)
  const diffInWeeks = Math.floor(diffInDays / 7)
  const diffInMonths = Math.floor(diffInDays / 30)
  const diffInYears = Math.floor(diffInDays / 365)

  if (diffInSeconds < 60) {
    return 'baru saja'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} menit yang lalu`
  } else if (diffInHours < 24) {
    return `${diffInHours} jam yang lalu`
  } else if (diffInDays < 7) {
    return `${diffInDays} hari yang lalu`
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks} minggu yang lalu`
  } else if (diffInMonths < 12) {
    return `${diffInMonths} bulan yang lalu`
  } else {
    return `${diffInYears} tahun yang lalu`
  }
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  } else {
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
}

export function parseDateTime(dateString: string): Date | null {
  try {
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? null : date
  } catch {
    return null
  }
}

export function formatTimeForDisplay(
  date: Date | string | null,
  options: {
    showTime?: boolean
    showRelative?: boolean
    format?: 'short' | 'long' | 'full'
  } = {}
): string {
  if (!date) return '-'

  const dateObj = typeof date === 'string' ? parseDateTime(date) : date
  if (!dateObj) return '-'

  const { showTime = true, showRelative = false, format = 'short' } = options

  if (showRelative) {
    return formatRelativeTime(dateObj)
  }

  if (format === 'short') {
    return showTime ? formatDateTime(dateObj) : formatDate(dateObj)
  } else if (format === 'long') {
    const day = dateObj.getDate().toString().padStart(2, '0')
    const month = dateObj.toLocaleString('id-ID', { month: 'long' })
    const year = dateObj.getFullYear()
    const time = showTime ? `, ${formatTime(dateObj)}` : ''
    return `${day} ${month} ${year}${time}`
  } else {
    const day = dateObj.getDate().toString().padStart(2, '0')
    const month = dateObj.toLocaleString('id-ID', { month: 'long' })
    const year = dateObj.getFullYear()
    const dayName = dateObj.toLocaleString('id-ID', { weekday: 'long' })
    const time = showTime ? `, ${formatTime(dateObj)}` : ''
    return `${dayName}, ${day} ${month} ${year}${time}`
  }
}

export function isOverdue(date: Date | string | null): boolean {
  if (!date) return false
  
  const dateObj = typeof date === 'string' ? parseDateTime(date) : date
  if (!dateObj) return false
  
  return dateObj < new Date()
}

export function calculateTimeDifference(startDate: Date | string, endDate: Date | string): {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalSeconds: number
} {
  const start = typeof startDate === 'string' ? parseDateTime(startDate) : startDate
  const end = typeof endDate === 'string' ? parseDateTime(endDate) : endDate
  
  if (!start || !end) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 }
  }
  
  const diffInMs = end.getTime() - start.getTime()
  const totalSeconds = Math.floor(diffInMs / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  
  return { days, hours, minutes, seconds, totalSeconds }
}