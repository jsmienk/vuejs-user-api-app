import Axios from 'axios'
import Config from '@/config'
import sha1 from 'sha1'
import _ from 'lodash'

const API = Axios.create({
  timeout: Config.API_TIMEOUT
})

const PASSWORD_LENGTH_ADVICE = 10

export async function testStrength(password: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const hash: string = sha1(password)
    const prefix: string = hash.substring(0, 5)
    const suffix: string = hash.substring(5)

    API.get('https://api.pwnedpasswords.com/range/' + prefix)
      .then(res => {
        // Parse result
        const rows: string[] = _.split(res.data, '\n')
        const parsed: [string, number][] = _.map(rows, row => {
          const parts = row.split(':')
          return [parts[0], _.parseInt(parts[1])]
        })
        // Find hash in result
        const ourRow: [string, number] | undefined = _.find(parsed, (row: [string, number]) => _.toLower(row[0]) === _.toLower(suffix))
        const occurrences: number = ourRow ? ourRow[1] : 0

        // Calculate strength using occurrences
        const strength: number = Math.min(password.length / PASSWORD_LENGTH_ADVICE, Math.pow(10, -occurrences / 100))
        console.log(strength)
        resolve(strength)
      })
      .catch(reject)
  })
}
