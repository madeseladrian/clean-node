import { AddAccount } from '@/domain/usecases'

import { Hasher } from '@/data/contracts/cryptography'
import { CheckAccountByEmailRepository } from '@/data/contracts/db'

export class DbAddAccount {
  constructor(
    private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository,
    private readonly hasher: Hasher
  ) {}

  async add(params: AddAccount.Params): Promise<AddAccount.Result> {
    const exists = await this.checkAccountByEmailRepository.checkByEmail(
      params.email
    )
    let isValid = false
    if (!exists) {
      await this.hasher.hash(params.password)
      isValid = true
    }
    return isValid
  }
}
