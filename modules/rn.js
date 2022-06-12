import { join, isAbsolute, normalize } from 'path'
import { access, rename } from 'fs/promises'
import { fileURLToPath } from 'url'
import { constants } from 'fs'
import { cwd } from 'process'
const { F_OK } = constants

export const renameFile = async input => {
  const [filePathForRename, newFileNameForRename] = input.split(' ').slice(-2)
  const [oldFileNameForRename] = filePathForRename.split('/').slice(-1)

  if (isAbsolute(filePathForRename)) {
    try {
      await access(filePathForRename, F_OK)

      const path = filePathForRename.split('/')
      path.pop()

      await rename(
        join(fileURLToPath(`file://${filePathForRename}`)),
        join(
          fileURLToPath(`file://${path.join('/')}`),
          `/${newFileNameForRename}`
        )
      )
    } catch {
      console.error(`Operation failed\nYou are currently in ${cwd()}`)
    }
  } else {
    try {
      await access(normalize(`${cwd()}/${filePathForRename}`), F_OK)
      await rename(
        join(fileURLToPath(`file://${cwd()}`), `/${oldFileNameForRename}`),
        join(fileURLToPath(`file://${cwd()}`), `/${newFileNameForRename}`)
      )
    } catch {
      console.error(`Operation failed\nYou are currently in ${cwd()}`)
    }
  }
}
