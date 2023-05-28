import { Controller, Validation } from '@/presentation/contracts'
import { HttpResponse, badRequest } from '@/presentation/helpers'

export class SignUpController implements Controller {
  constructor(private readonly validation: Validation) {}

  async handle(request: SignUpController.Request): Promise<any> {
    const error = this.validation.validate(request)
    if (error) {
      return badRequest(error)
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
