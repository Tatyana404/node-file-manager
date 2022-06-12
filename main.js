import { createInterface } from 'readline'
import { chdir } from 'process'
import { homedir } from 'os'

import { getListAllFilesAndFolders } from './modules/ls.js'
import { welcomeFileManager } from './modules/welcome.js'
import { calculateHashForFile } from './modules/hash.js'
import { decompressFile } from './modules/decompress.js'
import { operatingSystemInfo } from './modules/os.js'
import { startFileManager } from './modules/start.js'
import { compressFile } from './modules/compress.js'
import { exitFileManager } from './modules/exit.js'
import { createEmptyFile } from './modules/add.js'
import { renameFile } from './modules/rn.js'
import { deleteFile } from './modules/rm.js'
import { readFile } from './modules/cat.js'
import { moveFile } from './modules/mv.js'
import { copyFile } from './modules/cp.js'
import { goUpper } from './modules/up.js'
import { goTo } from './modules/cd.js'

const [argv] = process.argv.slice(2)
chdir(homedir()) //or process.env.HOME || process.env.USERPROFILE

;(() => {
  const userInterface = createInterface({
    input: process.stdin,
    output: process.stdout
  })

  if (!argv || !argv.startsWith('--username=')) {
    startFileManager()
    userInterface.close()
  } else {
    const userName = argv.split('=').splice(-1)
    welcomeFileManager(userName)

    userInterface.on('SIGINT', () => {
      exitFileManager(userName)
      userInterface.close()
    })

    userInterface.on('line', async input => {
      if (input.length) {
        switch (input.split(' ')[0]) {
          case '.exit':
            exitFileManager(userName)
            userInterface.close()

            break
          case 'up':
            goUpper()

            break
          case 'cd':
            goTo(input)

            break
          case 'ls':
            await getListAllFilesAndFolders()

            break
          case 'cat':
            await readFile(input)

            break
          case 'add':
            createEmptyFile(input)

            break
          case 'rn':
            await renameFile(input)

            break
          case 'cp':
            await copyFile(input)

            break
          case 'mv':
            await moveFile(input)

            break
          case 'rm':
            await deleteFile(input)

            break
          case 'os':
            operatingSystemInfo(input)

            break
          case 'hash':
            await calculateHashForFile(input)

            break
          case 'compress':
            await compressFile(input)

            break
          case 'decompress':
            await decompressFile(input)

            break
          default:
            return console.error('Invalid input')
        }
      }
    })
  }
})()
