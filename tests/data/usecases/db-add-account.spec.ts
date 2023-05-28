import { DbAddAccount } from '@/data/usecases'

import { mockAddAccountParams } from '@/tests/domain/mocks'
import { CheckAccountByEmailRepositorySpy, HasherSpy } from '@/tests/data/mocks'

type SutTypes = {
  sut: DbAddAccount
  checkAccountByEmailRepositorySpy: CheckAccountByEmailRepositorySpy
  hasherSpy: HasherSpy
}

const params = mockAddAccountParams()

const makeSut = (): SutTypes => {
  const checkAccountByEmailRepositorySpy =
    new CheckAccountByEmailRepositorySpy()
  const hasherSpy = new HasherSpy()

  const sut = new DbAddAccount(checkAccountByEmailRepositorySpy, hasherSpy)
  return {
    sut,
    checkAccountByEmailRepositorySpy,
    hasherSpy
  }
}

describe('DbAddAccount Usecase', () => {
  test('1 - Should call CheckAccountByEmailRepository with correct email', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut()
    await sut.add(params)
    expect(checkAccountByEmailRepositorySpy.email).toBe(params.email)
  })

  test('2 - Should return true if CheckAccountByEmailRepository returns false', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut()
    checkAccountByEmailRepositorySpy.result = false
    const result = await sut.add(params)
    expect(result).toBe(true)
  })

  test('3 - Should return false if CheckAccountByEmailRepository returns true', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut()
    checkAccountByEmailRepositorySpy.result = true
    const result = await sut.add(params)
    expect(result).toBe(false)
  })

  test('4 - Should throw if CheckAccountByEmailRepository throws', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut()
    jest
      .spyOn(checkAccountByEmailRepositorySpy, 'checkByEmail')
      .mockRejectedValueOnce(new Error())
    const promise = sut.add(params)
    await expect(promise).rejects.toThrow()
  })

  test('5 - Should call Hasher with correct plaintext', async () => {
    const { sut, hasherSpy } = makeSut()
    await sut.add(params)
    expect(hasherSpy.plaintext).toBe(params.password)
  })

  test('6 - Should throw if Hasher throws', async () => {
    const { sut, hasherSpy } = makeSut()
    jest.spyOn(hasherSpy, 'hash').mockRejectedValueOnce(new Error())
    const promise = sut.add(params)
    await expect(promise).rejects.toThrow()
  })
})
