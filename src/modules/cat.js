import { createReadStream, constants } from 'fs'
import { isAbsolute, normalize } from 'path'
import { access } from 'fs/promises'
import { cwd } from 'process'
import { operationFailed } from './index.js'
const { F_OK, R_OK } = constants

export const readFile = async input => {
  let filePathForRead = input.split(' ')
  filePathForRead.shift()
  filePathForRead = filePathForRead.join(' ')

  if (!filePathForRead.startsWith('.') && !filePathForRead.startsWith('/')) {
    return operationFailed()
  }

  if (isAbsolute(filePathForRead)) {
    try {
      await access(filePathForRead, F_OK | R_OK)

      const data = createReadStream(filePathForRead)
      let fileData = ''

      data.on('data', chunk => fileData += chunk )
      data.on('end', () => console.log(fileData.toString().trim()))
      data.on('error', () => operationFailed())
    } catch {
      operationFailed()
    }
  } else {
    try {
      await access(normalize(`${cwd()}/${filePathForRead}`), F_OK | R_OK)

      const data = createReadStream(normalize(`${cwd()}/${filePathForRead}`))
      let fileData = ''

      data.on('data', chunk => fileData += chunk )
      data.on('end', () => console.log(fileData.toString().trim()))
      data.on('error', () => operationFailed())
    } catch {
      operationFailed()
    }
  }
}
