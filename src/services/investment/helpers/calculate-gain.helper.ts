function calculateExpectedBalance(initialAmount: number, differenceMonth: number) {
  return initialAmount * (1 + 0.0052) ** differenceMonth
}

function calculateBalanceGain(initialAmount: number, differenceMonth: number) {
  return initialAmount * (1 + 0.0052) ** differenceMonth - initialAmount
}

function calculateFinalBalance(initialAmount: number, balanceGain: number, taxa: number) {
  const finalBalance = initialAmount + balanceGain - taxa

  return finalBalance
}

export { calculateBalanceGain, calculateExpectedBalance, calculateFinalBalance }
