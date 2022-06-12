import { createReadStream, constants } from 'fs'
import { isAbsolute, normalize } from 'path'
import { access } from 'fs/promises'
import { cwd } from 'process'
const { F_OK, R_OK } = constants

export const readFile = async input => {
  let filePathForRead = input.split(' ')
  filePathForRead.shift()
  filePathForRead = filePathForRead.join(' ')

  if (!filePathForRead.startsWith('.') && !filePathForRead.startsWith('/')) {
    return console.error(`Operation failed\nYou are currently in ${cwd()}`)
  }

  if (isAbsolute(filePathForRead)) {
    try {
      await access(filePathForRead, F_OK | R_OK)

      const data = createReadStream(filePathForRead)

      data.on('data', chunk => console.log(chunk.toString().trim()))
      data.on('error', () => console.error(`Operation failed\nYou are currently in ${cwd()}`))
    } catch {
      console.error(`Operation failed\nYou are currently in ${cwd()}`)
    }
  } else {
    try {
      await access(normalize(`${cwd()}/${filePathForRead}`), F_OK | R_OK)

      const data = createReadStream(normalize(`${cwd()}/${filePathForRead}`))

      data.on('data', chunk => console.log(chunk.toString().trim()))
      data.on('error', () => console.error(`Operation failed\nYou are currently in ${cwd()}`))
    } catch {
      console.error(`Operation failed\nYou are currently in ${cwd()}`)
    }
  }
}
