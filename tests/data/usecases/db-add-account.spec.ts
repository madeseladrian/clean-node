import { DbAddAccount } from '@/data/usecases'

import { mockAddAccountParams } from '@/tests/domain/mocks'
import {
  AddAccountRepositorySpy,
  CheckAccountByEmailRepositorySpy,
  HasherSpy
} from '@/tests/data/mocks'

type SutTypes = {
  sut: DbAddAccount
  checkAccountByEmailRepositorySpy: CheckAccountByEmailRepositorySpy
  hasherSpy: HasherSpy
  addAccountRepositorySpy: AddAccountRepositorySpy
}

const params = mockAddAccountParams()

const makeSut = (): SutTypes => {
  const checkAccountByEmailRepositorySpy =
    new CheckAccountByEmailRepositorySpy()
  const hasherSpy = new HasherSpy()
  const addAccountRepositorySpy = new AddAccountRepositorySpy()

  const sut = new DbAddAccount(
    checkAccountByEmailRepositorySpy,
    hasherSpy,
    addAccountRepositorySpy
  )
  return {
    sut,
    checkAccountByEmailRepositorySpy,
    hasherSpy,
    addAccountRepositorySpy
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

  test('7 - Should call AddAccountRepository with correct values', async () => {
    const { sut, hasherSpy, addAccountRepositorySpy } = makeSut()
    await sut.add(params)
    expect(addAccountRepositorySpy.params).toEqual({
      name: params.name,
      email: params.email,
      password: hasherSpy.digest
    })
  })
})
