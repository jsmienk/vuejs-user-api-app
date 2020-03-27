import State, { Cache } from './state'
import { User } from '@/utils/api/models'

export default {
  setUser(state: State, user: User) {
    state.users.set(user._id, new Cache(user))
  }
}