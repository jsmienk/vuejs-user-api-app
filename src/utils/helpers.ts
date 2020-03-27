export function getDateString(date: Date) {
  const mm = date.getMonth() + 1  // 0-indexed
  const dd = date.getDate()
  return [
    (dd < 10 ? '0' : '') + dd,
    (mm < 10 ? '0' : '') + mm,
    date.getFullYear()
  ].join('-')
}
  
export function getTimeString(date: Date, seconds=false) {
  const hh = date.getHours()
  const mm = date.getMinutes()
  const ss = date.getSeconds()
  return (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm + (seconds ? ':' + ((ss < 10 ? '0' : '') + ss) : '')
}

export function getDateTimeString(date: Date, seconds=false) {
  return getDateString(date) + ' ' + getTimeString(date, seconds)
}