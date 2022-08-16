import { join, isAbsolute, normalize } from 'path'
import { access, unlink } from 'fs/promises'
import { fileURLToPath } from 'url'
import { constants } from 'fs'
import { cwd } from 'process'
import { operationFailed } from './index.js'
const { F_OK } = constants

export const deleteFile = async input => {
  let filePathForDelete = input.split(' ')
  filePathForDelete.shift()
  filePathForDelete = filePathForDelete.join(' ')

  if (!filePathForDelete.startsWith('.') && !filePathForDelete.startsWith('/')) {
    return operationFailed()
  }

  if (isAbsolute(filePathForDelete)) {
    try {
      await access(filePathForDelete, F_OK)
      await unlink(join(fileURLToPath('file://'), filePathForDelete))
    } catch {
      operationFailed()
    }
  } else {
    try {
      await access(normalize(`${cwd()}/${filePathForDelete}`), F_OK)
      await unlink(join(fileURLToPath(`file://${cwd()}`), `/${filePathForDelete}`))
    } catch {
      operationFailed()
    }
  }
}
