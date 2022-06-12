import { createWriteStream } from 'fs'
import { cwd } from 'process'

export const createEmptyFile = input => {
  let newFileNameForCreate = input.split(' ')
  newFileNameForCreate.shift()
  newFileNameForCreate = newFileNameForCreate.join(' ')

  if (!newFileNameForCreate.startsWith('.') && !newFileNameForCreate.startsWith('/')) {
    return console.error(`Operation failed\nYou are currently in ${cwd()}`)
  }

  const result = createWriteStream(newFileNameForCreate)
  result.on('error', () => console.error(`Operation failed\nYou are currently in ${cwd()}`))
}
