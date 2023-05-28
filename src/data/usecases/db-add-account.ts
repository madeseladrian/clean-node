import { AddAccount } from '@/domain/usecases'
import { CheckAccountByEmailRepository } from '@/data/contracts'

export class DbAddAccount {
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
