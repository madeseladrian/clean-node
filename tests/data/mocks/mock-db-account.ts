import { CheckAccountByEmailRepository } from '@/data/contracts/'

export class CheckAccountByEmailRepositorySpy
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
