import {
  AddAccountRepository,
  CheckAccountByEmailRepository
} from '@/data/contracts/db'
import { MongoHelper } from '@/infra/db/mongodb'

export class AccountMongoRepository
  implements AddAccountRepository, CheckAccountByEmailRepository
{
  async add(
    data: AddAccountRepository.Params
  ): Promise<AddAccountRepository.Result> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection?.insertOne(data)
    return result?.insertedId !== null
  }

  async checkByEmail(
    email: string
  ): Promise<CheckAccountByEmailRepository.Result> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne(
      {
        email
      },
      {
        projection: {
          _id: 1
        }
      }
    )

    return account !== null
  }
}
