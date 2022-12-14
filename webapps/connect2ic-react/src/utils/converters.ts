export const balanceFromString = (balance: string, decimal = 8): bigint => {
  const list = balance.split(".")
  const aboveZero = list[0]
  const aboveZeroBigInt = BigInt(aboveZero) * BigInt(1 * 10 ** decimal)
  let belowZeroBigInt = BigInt(0)
  const belowZero = list[1]
  if (belowZero !== undefined) {
    belowZeroBigInt = BigInt(
      belowZero.substring(0, decimal).padEnd(decimal, "0"),
    )
  }
  return aboveZeroBigInt + belowZeroBigInt
}

export interface BalanceString {
  total: string
  aboveZero: string
  belowZero: string
  formatAboveZero: string
  formatTotal: string
  formatTotalTo8: string
  formatTotalTo4: string
}

export const balanceToString = (
  balance: bigint,
  decimal = 8,
): BalanceString => {
  const balanceString = balance.toString(10)
  const balanceStringLength = balanceString.length
  let aboveZero = "0"
  let belowZero = "0".padEnd(decimal, "0")
  if (balanceStringLength > decimal) {
    belowZero = balanceString.substring(
      balanceStringLength - decimal,
      balanceStringLength,
    )
    aboveZero = balanceString.substring(0, balanceStringLength - decimal)
  } else {
    belowZero = balanceString.padStart(decimal, "0")
  }
  const formatAboveZero = String(aboveZero).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ",",
  )

  return {
    total: aboveZero + "." + belowZero,
    aboveZero,
    belowZero,
    formatAboveZero,
    formatTotal:
      formatAboveZero +
      "." +
      (parseFloat("0." + belowZero)
        .toString()
        .split(".")[1] ?? "0"),
    formatTotalTo8: formatAboveZero + "." + belowZero,
    formatTotalTo4:
      formatAboveZero +
      "." +
      (parseFloat("0." + belowZero)
        .toFixed(4)
        .toString()
        .split(".")[1] ?? "0"),
  }
}
