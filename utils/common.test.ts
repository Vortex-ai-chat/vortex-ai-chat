import { getRandomKey } from './common'
const { shuffleArray } = require('./common')

// utils/common.test.ts

jest.mock('./common', () => {
  const original = jest.requireActual('./common')
  return {
    ...original,
    shuffleArray: jest.fn((arr) => arr.reverse()), // predictable shuffle
  }
})


describe('getRandomKey', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('returns the single AI key if only one is provided', () => {
    const key = 'AI123456789012345678901234567890123456789'
    expect(getRandomKey(key)).toBe(key)
  })

  it('returns the first AI key if useUploadKey is true', () => {
    const key = 'AI123456789012345678901234567890123456789,AI987654321098765432109876543210987654321'
    expect(getRandomKey(key, true)).toBe('AI123456789012345678901234567890123456789')
  })

  it('returns a shuffled AI key if useUploadKey is false', () => {
    const key = 'AI123456789012345678901234567890123456789,AI987654321098765432109876543210987654321'
    expect(getRandomKey(key, false)).toBe('AI987654321098765432109876543210987654321')
    expect(shuffleArray).toHaveBeenCalled()
  })

  it('returns the original key if not an AI key', () => {
    const key = 'sk-abcdef'
    expect(getRandomKey(key)).toBe(key)
  })

  it('returns the original key if empty', () => {
    expect(getRandomKey('')).toBe('')
  })

  it('handles undefined apiKey gracefully', () => {
    // @ts-expect-error
    expect(() => getRandomKey(undefined)).toThrow()
  })

  it('trims spaces and ignores empty entries', () => {
    const key = '  AI123456789012345678901234567890123456789  , ,AI987654321098765432109876543210987654321'
    expect(getRandomKey(key, true)).toBe('AI123456789012345678901234567890123456789')
    expect(getRandomKey(key, false)).toBe('AI987654321098765432109876543210987654321')
  })
})