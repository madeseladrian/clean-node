import { faker } from '@faker-js/faker'

import { AddAccount } from '@/domain/usecases'

interface CheckAccountByEmailRepository {
  checkByEmail: (email: string) => Promise<CheckAccountByEmailRepository.Result>
}

export namespace CheckAccountByEmailRepository {
  export type Result = boolean
}

class CheckAccountByEmailRepositorySpy
  implements CheckAccountByEmailRepository
{
  email = ''
  result = false

  async checkByEmail(
    email: string
  ): Promise<CheckAccountByEmailRepository.Result> {
    this.email = email
    return this.result
  }
}

type SutTypes = {
  sut: DbAddAccount
  checkAccountByEmailRepositorySpy: CheckAccountByEmailRepositorySpy
}

class DbAddAccount {
  constructor(
    private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository
  ) {}

  async add(params: AddAccount.Params): Promise<AddAccount.Result> {
    const exists = await this.checkAccountByEmailRepository.checkByEmail(
      params.email
    )
    let isValid = false
    if (!exists) {
      isValid = true
    }
    return isValid
  }
}

const mockAddAccountParams = (): AddAccount.Params => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

const params = mockAddAccountParams()

const makeSut = (): SutTypes => {
  const checkAccountByEmailRepositorySpy =
    new CheckAccountByEmailRepositorySpy()
  const sut = new DbAddAccount(checkAccountByEmailRepositorySpy)
  return {
    sut,
    checkAccountByEmailRepositorySpy
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
})
