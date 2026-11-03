export function validCpf(value) {
  if (!/^\d{11}$/.test(value) || /^(\d)\1{10}$/.test(value)) return false
  return [9, 10].every(length => {
    const remainder = [...value.slice(0, length)]
      .reduce((sum, digit, index) => sum + Number(digit) * (length + 1 - index), 0) * 10 % 11
    return (remainder === 10 ? 0 : remainder) === Number(value[length])
  })
}
