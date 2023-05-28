import { Validation } from '@/presentation/contracts'

export class SignUpController {
  constructor(private readonly validation: Validation) {}

  async handle(request: SignUpController.Request): Promise<void> {
    this.validation.validate(request)
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
