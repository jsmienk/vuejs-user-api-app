import { User } from '@/utils/api/models'

export class Cache<T> {
  public  readonly val: T
  private readonly exp: number

  constructor(val: T) {
    this.exp = Date.now() + 30*60*1000  // 30 mins
    this.val = val
  }

  get isExpired(): boolean {
    return (Date.now() - this.exp) > 0
  }
}

export default class State {
  users = new Map<string, Cache<User>>()
}