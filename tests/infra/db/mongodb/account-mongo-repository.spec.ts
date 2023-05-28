import { AccountMongoRepository } from '@/infra/db/mongodb'

import { mockAddAccountParams } from '@/tests/domain/mocks'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe('Account Mongo Repository', () => {
  describe('add()', () => {
    test('1 - Should return an account on success', async () => {
      const sut = makeSut()
      const addAccountParams = mockAddAccountParams()
      const isValid = await sut.add(addAccountParams)
      expect(isValid).toBe(true)
    })
  })
})
