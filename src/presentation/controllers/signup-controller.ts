import { AddAccount } from '@/domain/usecases'

import { Validation } from '@/presentation/contracts'
import { badRequest, serverError } from '@/presentation/helpers'

export class SignUpController {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {}

  async handle(request: SignUpController.Request): Promise<any> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = request
      await this.addAccount.add({ name, email, password })
    } catch (error: any) {
      return serverError(error)
    }
  }
}

export namespace SignUpController {
  export type Request = {
    name: string
    email: string
    password: string
    passwordConfirmation: string
  }
}
