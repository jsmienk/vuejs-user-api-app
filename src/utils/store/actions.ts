import { Commit } from 'vuex'
import { Commits } from '.'
import State from './state'

import API from '@/utils/api'
import { User } from '@/utils/api/models'

interface Action {
  commit: Commit,
  state: State
}

interface GetCachedData {
  readonly id: string,
  readonly force?: boolean
}

export default {
  /**
   * 
   * @param options 
   */
  async getUser({ commit, state }: Action, options: GetCachedData): Promise<User> {
    return new Promise((resolve, reject) => {
      const cached = state.users.get(options.id)
      // If cached user is valid and force is false
      if (cached && !cached.isExpired && !options.force) {
        console.log('Returned cached user')
        resolve(cached.val)
      } else {
        console.log('Getting user from API...')
        // Get user from API
        API.getUserById(options.id)
          .then(res => {
            // Cache user
            commit(Commits.SET_USER, res.user)
            resolve(res.user)
          })
          .catch(reject)
      }
    })
  },
}