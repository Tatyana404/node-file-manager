import { createReadStream, createWriteStream, constants } from 'fs'
import { join, isAbsolute, normalize } from 'path'
import { access, unlink } from 'fs/promises'
import { fileURLToPath } from 'url'
import { cwd } from 'process'
import { operationFailed } from './index.js'
const { F_OK, R_OK } = constants

export const moveFile = async input => {
  const [filePathForMove, directoryPathForFileForMove] = input.split(' ').slice(-2)
  const [fileNameForMove] = filePathForMove.split('/').slice(-1)

  if (isAbsolute(filePathForMove)) {
    if (isAbsolute(directoryPathForFileForMove)) {
      try {
        await access(filePathForMove, F_OK | R_OK)
        await access(directoryPathForFileForMove, F_OK)

        const result = createReadStream(filePathForMove).pipe(createWriteStream(`${directoryPathForFileForMove}/${fileNameForMove}`))

        result.on('finish', async () => await unlink(join(fileURLToPath('file://'), filePathForMove)))
        result.on('error', () => operationFailed())
      } catch {
        operationFailed()
      }
    } else {
      try {
        await access(filePathForMove, F_OK | R_OK)
        await access(normalize(`${cwd()}/${directoryPathForFileForMove}`), F_OK)

        const result = createReadStream(filePathForMove).pipe(createWriteStream(normalize(`${cwd()}/${directoryPathForFileForMove}/${fileNameForMove}`)))

        result.on('finish', async () => await unlink(join(fileURLToPath('file://'), filePathForMove)))
        result.on('error', () => operationFailed())
      } catch {
        operationFailed()
      }
    }
  } else {
    if (isAbsolute(directoryPathForFileForMove)) {
      try {
        await access(normalize(`${cwd()}/${filePathForMove}`), F_OK | R_OK)
        await access(directoryPathForFileForMove, F_OK)

        const result = createReadStream(normalize(`${cwd()}/${filePathForMove}`)).pipe(createWriteStream(`${directoryPathForFileForMove}/${fileNameForMove}`))

        result.on('finish', async () => await unlink(join(fileURLToPath(`file://${cwd()}`), `/${filePathForMove}`)))
        result.on('error', () => operationFailed())
      } catch {
        operationFailed()
      }
    } else {
      try {
        await access(normalize(`${cwd()}/${filePathForMove}`), F_OK | R_OK)
        await access(normalize(`${cwd()}/${directoryPathForFileForMove}`), F_OK)

        const result = createReadStream(normalize(`${cwd()}/${filePathForMove}`)).pipe(createWriteStream(normalize(`${cwd()}/${directoryPathForFileForMove}/${fileNameForMove}`)))
        
        result.on('finish', async () => await unlink(join(fileURLToPath(`file://${cwd()}`), `/${filePathForMove}`)))
        result.on('error', () => operationFailed())     
      } catch {
        operationFailed()
      }
    }
  }
}
