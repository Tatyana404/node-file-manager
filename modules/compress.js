import { createReadStream, createWriteStream, constants } from 'fs'
import { isAbsolute, normalize } from 'path'
import { createBrotliCompress } from 'zlib'
import { access } from 'fs/promises'
import { pipeline } from 'stream'
import { promisify } from 'util'
import { cwd } from 'process'
import { operationFailed } from './index.js'
const { F_OK } = constants

export const compressFile = async input => {
  const [filePathForCompress, directoryPathForFileForCompress] = input
    .split(' ')
    .slice(-2)
  const [fileNameForCompress] = filePathForCompress.split('/').slice(-1)
  const BrotliCompress = createBrotliCompress()
  const pipeForCompress = promisify(pipeline)

  if (isAbsolute(filePathForCompress)) {
    if (isAbsolute(directoryPathForFileForCompress)) {
      try {
        await access(filePathForCompress, F_OK)
        await access(directoryPathForFileForCompress, F_OK)

        const inp = createReadStream(filePathForCompress)
        const out = createWriteStream(
          `${directoryPathForFileForCompress}/${fileNameForCompress}.br`
        )

        await pipeForCompress(inp, BrotliCompress, out)
      } catch {
        operationFailed()
      }
    } else {
      try {
        await access(filePathForCompress, F_OK)
        await access(
          normalize(`${cwd()}/${directoryPathForFileForCompress}`),
          F_OK
        )

        const inp = createReadStream(filePathForCompress)
        const out = createWriteStream(
          normalize(
            `${cwd()}/${directoryPathForFileForCompress}/${fileNameForCompress}.br`
          )
        )

        await pipeForCompress(inp, BrotliCompress, out)
      } catch {
        operationFailed()
      }
    }
  } else {
    if (isAbsolute(directoryPathForFileForCompress)) {
      try {
        await access(normalize(`${cwd()}/${filePathForCompress}`), F_OK)
        await access(directoryPathForFileForCompress, F_OK)

        const inp = normalize(`${cwd()}/${filePathForCompress}`)
        const out = createWriteStream(
          `${directoryPathForFileForCompress}/${fileNameForCompress}.br`
        )

        await pipeForCompress(inp, BrotliCompress, out)
      } catch {
        operationFailed()
      }
    } else {
      try {
        await access(normalize(`${cwd()}/${filePathForCompress}`), F_OK)
        await access(
          normalize(`${cwd()}/${directoryPathForFileForCompress}`),
          F_OK
        )

        const inp = normalize(`${cwd()}/${filePathForCompress}`)
        const out = createWriteStream(
          normalize(
            `${cwd()}/${directoryPathForFileForCompress}/${fileNameForCompress}.br`
          )
        )

        await pipeForCompress(inp, BrotliCompress, out)
      } catch {
        operationFailed()
      }
    }
  }
}
