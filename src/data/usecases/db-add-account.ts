import { AddAccount } from '@/domain/usecases'

import { Hasher } from '@/data/contracts/cryptography'
import {
  AddAccountRepository,
  CheckAccountByEmailRepository
} from '@/data/contracts/db'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository,
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add(params: AddAccount.Params): Promise<AddAccount.Result> {
    const exists = await this.checkAccountByEmailRepository.checkByEmail(
      params.email
    )
    let isValid = false
    if (!exists) {
      const hashedPassword = await this.hasher.hash(params.password)
      isValid = await this.addAccountRepository.add({
        ...params,
        password: hashedPassword
      })
    }
    return isValid
  }
}
