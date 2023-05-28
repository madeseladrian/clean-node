import { Validation } from '@/presentation/contracts'
import { badRequest, serverError } from '@/presentation/helpers'

export class SignUpController {
  constructor(private readonly validation: Validation) {}

  async handle(request: SignUpController.Request): Promise<any> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
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
