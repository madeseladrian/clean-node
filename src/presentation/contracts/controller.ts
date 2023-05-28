import { HttpResponse } from '@/presentation/helpers'

export interface Controller<T = any> {
  handle: (request: T) => Promise<HttpResponse>
}
