import bcrypt from 'bcrypt'

import { BcryptAdapter } from '@/infra/cryptography'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return 'any_value_hashed'
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  test('1 - Should call hash with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('2 - Should return a valid hash on hash success', async () => {
    const sut = makeSut()
    const hash = await sut.hash('any_value')
    expect(hash).toBe('any_value_hashed')
  })
})
