import { createReadStream, createWriteStream, constants } from 'fs'
import { createBrotliDecompress } from 'zlib'
import { isAbsolute, normalize } from 'path'
import { access } from 'fs/promises'
import { pipeline } from 'stream'
import { promisify } from 'util'
import { cwd } from 'process'
const { F_OK } = constants

export const decompressFile = async input => {
  const [
    filePathForDecompress,
    directoryPathForFileForDecompress
  ] = input.split(' ').slice(-2)
  const [fileNameForDecompress] = filePathForDecompress.split('/').slice(-1)
  const BrotliDecompress = createBrotliDecompress()
  const pipeForDecompress = promisify(pipeline)

  if (isAbsolute(filePathForDecompress)) {
    if (isAbsolute(directoryPathForFileForDecompress)) {
      if (!fileNameForDecompress.endsWith('.br')) {
        console.error(`Operation failed\nYou are currently in ${cwd()}`)
      } else {
        try {
          await access(filePathForDecompress, F_OK)
          await access(directoryPathForFileForDecompress, F_OK)

          const inp = createReadStream(filePathForDecompress)
          const out = createWriteStream(
            `${directoryPathForFileForDecompress}/${fileNameForDecompress.slice(
              0,
              -3
            )}`
          )

          await pipeForDecompress(inp, BrotliDecompress, out)
        } catch {
          console.error(`Operation failed\nYou are currently in ${cwd()}`)
        }
      }
    } else {
      if (!fileNameForDecompress.endsWith('.br')) {
        console.error(`Operation failed\nYou are currently in ${cwd()}`)
      } else {
        try {
          await access(filePathForDecompress, F_OK)
          await access(
            normalize(`${cwd()}/${directoryPathForFileForDecompress}`),
            F_OK
          )

          const inp = createReadStream(filePathForDecompress)
          const out = createWriteStream(
            normalize(
              `${cwd()}/${directoryPathForFileForDecompress}/${fileNameForDecompress.slice(
                0,
                -3
              )}`
            )
          )

          await pipeForDecompress(inp, BrotliDecompress, out)
        } catch {
          console.error(`Operation failed\nYou are currently in ${cwd()}`)
        }
      }
    }
  } else {
    if (isAbsolute(directoryPathForFileForDecompress)) {
      if (!fileNameForDecompress.endsWith('.br')) {
        console.error(`Operation failed\nYou are currently in ${cwd()}`)
      } else {
        try {
          await access(normalize(`${cwd()}/${filePathForDecompress}`), F_OK)
          await access(directoryPathForFileForDecompress, F_OK)

          const inp = normalize(`${cwd()}/${filePathForDecompress}`)
          const out = createWriteStream(
            `${directoryPathForFileForDecompress}/${fileNameForDecompress.slice(
              0,
              -3
            )}`
          )

          await pipeForDecompress(inp, BrotliDecompress, out)
        } catch {
          console.error(`Operation failed\nYou are currently in ${cwd()}`)
        }
      }
    } else {
      if (!fileNameForDecompress.endsWith('.br')) {
        console.error(`Operation failed\nYou are currently in ${cwd()}`)
      } else {
        try {
          await access(normalize(`${cwd()}/${filePathForDecompress}`), F_OK)
          await access(
            normalize(`${cwd()}/${directoryPathForFileForDecompress}`),
            F_OK
          )

          const inp = normalize(`${cwd()}/${filePathForDecompress}`)
          const out = createWriteStream(
            normalize(
              `${cwd()}/${directoryPathForFileForDecompress}/${fileNameForDecompress.slice(
                0,
                -3
              )}`
            )
          )

          await pipeForDecompress(inp, BrotliDecompress, out)
        } catch {
          console.error(`Operation failed\nYou are currently in ${cwd()}`)
        }
      }
    }
  }
}
