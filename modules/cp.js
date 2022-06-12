import { createReadStream, createWriteStream, constants } from 'fs'
import { isAbsolute, normalize } from 'path'
import { access } from 'fs/promises'
import { cwd } from 'process'
const { F_OK } = constants

export const copyFile = async input => {
  const [filePathForCopy, directoryPathForFileForCopy] = input
    .split(' ')
    .slice(-2)
  const [fileNameForCopy] = filePathForCopy.split('/').slice(-1)

  if (isAbsolute(filePathForCopy)) {
    if (isAbsolute(directoryPathForFileForCopy)) {
      try {
        await access(filePathForCopy, F_OK)
        await access(directoryPathForFileForCopy, F_OK)

        createReadStream(filePathForCopy).pipe(
          createWriteStream(`${directoryPathForFileForCopy}/${fileNameForCopy}`)
        )
      } catch {
        console.error(`Operation failed\nYou are currently in ${cwd()}`)
      }
    } else {
      try {
        await access(filePathForCopy, F_OK)
        await access(normalize(`${cwd()}/${directoryPathForFileForCopy}`), F_OK)

        createReadStream(filePathForCopy).pipe(
          createWriteStream(
            normalize(
              `${cwd()}/${directoryPathForFileForCopy}/${fileNameForCopy}`
            )
          )
        )
      } catch {
        console.error(`Operation failed\nYou are currently in ${cwd()}`)
      }
    }
  } else {
    if (isAbsolute(directoryPathForFileForCopy)) {
      try {
        await access(normalize(`${cwd()}/${filePathForCopy}`), F_OK)
        await access(directoryPathForFileForCopy, F_OK)

        createReadStream(normalize(`${cwd()}/${filePathForCopy}`)).pipe(
          createWriteStream(`${directoryPathForFileForCopy}/${fileNameForCopy}`)
        )
      } catch {
        console.error(`Operation failed\nYou are currently in ${cwd()}`)
      }
    } else {
      try {
        await access(normalize(`${cwd()}/${filePathForCopy}`), F_OK)
        await access(normalize(`${cwd()}/${directoryPathForFileForCopy}`), F_OK)

        createReadStream(normalize(`${cwd()}/${filePathForCopy}`)).pipe(
          createWriteStream(
            normalize(
              `${cwd()}/${directoryPathForFileForCopy}/${fileNameForCopy}`
            )
          )
        )
      } catch {
        console.error(`Operation failed\nYou are currently in ${cwd()}`)
      }
    }
  }
}
