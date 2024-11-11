import { describe, expect, it } from 'vitest'
import {
  calculateBalanceGain,
  calculateExpectedBalance,
  calculateFinalBalance,
} from './calculate-gain.helper'

describe('calculate gain helper', () => {
  it('[calculateExpectedBalance] should be able calculate expected balance', () => {
    const result = calculateExpectedBalance(1200, 24)
    expect(result).toBe(1359.0666770569317)
  })

  it('[calculateBalanceGain] should be able calculate balance gain', () => {
    const result = calculateBalanceGain(1200, 24)
    expect(result).toBe(159.06667705693167)
  })

  it('[calculateFinalBalance] should be able calculate final balance', () => {
    const result = calculateFinalBalance(1200, 159.06667705693167, 30)
    expect(result).toBe(1329.0666770569317)
  })
})
