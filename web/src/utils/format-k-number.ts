export const formatKNumber = (number: number) => {
  return number.toLocaleString('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  })
}