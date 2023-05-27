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

  async add(params: AddAccount.Params): Promise<void> {
    await this.checkAccountByEmailRepository.checkByEmail(params.email)
  }
}

const mockAddAccountParams = (): AddAccount.Params => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

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
    const params = mockAddAccountParams()
    await sut.add(params)
    expect(checkAccountByEmailRepositorySpy.email).toBe(params.email)
  })
})
