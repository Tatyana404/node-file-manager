import { join, isAbsolute, normalize } from 'path'
import { access, rename } from 'fs/promises'
import { fileURLToPath } from 'url'
import { constants } from 'fs'
import { cwd } from 'process'
import { operationFailed } from './index.js'
const { F_OK } = constants

export const renameFile = async input => {
  const prepare = input.split(' ')
  prepare.shift()
  const newFileNameForRename = prepare.pop()
  const filePathForRename = prepare.join(' ')
  const pathForRename = filePathForRename.split('/')
  pathForRename.pop()
  const basePathForRename = pathForRename.join('/')

  if (isAbsolute(filePathForRename)) {
    try {
      await access(filePathForRename, F_OK)
      await rename(join(fileURLToPath(`file://${filePathForRename}`)),join(fileURLToPath(`file://${basePathForRename}/`),newFileNameForRename))
    } catch {
      operationFailed()
    }
  } else {
    try {
      await access(normalize(`${cwd()}/${filePathForRename}`), F_OK)
      await rename(join(fileURLToPath(`file://${cwd()}/`), filePathForRename),join(fileURLToPath(`file://${cwd()}/`),`${basePathForRename}/${newFileNameForRename}`))
    } catch {
      operationFailed()
    }
  }
}
