import { join, isAbsolute, normalize } from 'path'
import { access, unlink } from 'fs/promises'
import { fileURLToPath } from 'url'
import { constants } from 'fs'
import { cwd } from 'process'
const { F_OK, R_OK } = constants

export const deleteFile = async input => {
  let filePathForDelete = input.split(' ')
  filePathForDelete.shift()
  filePathForDelete = filePathForDelete.join(' ')

  if (!filePathForDelete.startsWith('.') && !filePathForDelete.startsWith('/')) {
    return console.error(`Operation failed\nYou are currently in ${cwd()}`)
  }

  if (isAbsolute(filePathForDelete)) {
    try {
      await access(filePathForDelete, F_OK | R_OK)
      await unlink(join(fileURLToPath('file://'), filePathForDelete))
    } catch {
      console.error(`Operation failed\nYou are currently in ${cwd()}`)
    }
  } else {
    try {
      await access(normalize(`${cwd()}/${filePathForDelete}`), F_OK | R_OK)
      await unlink(join(fileURLToPath(`file://${cwd()}`), `/${filePathForDelete}`))
    } catch {
      console.error(`Operation failed\nYou are currently in ${cwd()}`)
    }
  }
}
