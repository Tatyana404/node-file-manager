import { createReadStream, constants } from 'fs'
const { createHash } = await import('crypto')
import { isAbsolute, normalize } from 'path'
import { access } from 'fs/promises'
import { cwd } from 'process'
const { F_OK, R_OK } = constants

export const calculateHashForFile = async input => {
  const hash = createHash('sha256')

  let filePathForHash = input.split(' ')
  filePathForHash.shift()
  filePathForHash = filePathForHash.join(' ')

  if (!filePathForHash.startsWith('.') && !filePathForHash.startsWith('/')) {
    return console.error(`Operation failed\nYou are currently in ${cwd()}`)
  }

  if (isAbsolute(filePathForHash)) {
    try {
      await access(filePathForHash, F_OK | R_OK)

      const data = createReadStream(filePathForHash)

      data.on('data', chunk => {
        hash.update(chunk.toString().trim())
        console.log(hash.digest('hex'))
      })
    } catch {
      console.error(`Operation failed\nYou are currently in ${cwd()}`)
    }
  } else {
    try {
      await access(normalize(`${cwd()}/${filePathForHash}`), F_OK | R_OK)

      const data = createReadStream(normalize(`${cwd()}/${filePathForHash}`))

      data.on('data', chunk => {
        hash.update(chunk.toString().trim())
        console.log(hash.digest('hex'))
      })
    } catch {
      console.error(`Operation failed\nYou are currently in ${cwd()}`)
    }
  }
}
