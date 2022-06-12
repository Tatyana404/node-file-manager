import { createWriteStream } from 'fs'
import { operationFailed } from './index.js'

export const createEmptyFile = input => {
  let newFileNameForCreate = input.split(' ')
  newFileNameForCreate.shift()
  newFileNameForCreate = newFileNameForCreate.join(' ')

  if (!newFileNameForCreate.startsWith('.') && !newFileNameForCreate.startsWith('/')) {
    return operationFailed()
  }

  const result = createWriteStream(newFileNameForCreate)
  result.on('error', () => operationFailed())
}
