import { faker } from '@faker-js/faker'

import { Hasher } from '@/data/contracts/cryptography'

export class HasherSpy implements Hasher {
  digest = faker.string.uuid()
  plaintext = ''

  async hash(plaintext: string): Promise<string> {
    this.plaintext = plaintext
    return this.digest
  }
}
