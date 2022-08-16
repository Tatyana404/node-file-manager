import { createInterface } from 'readline'
import { chdir } from 'process'
import { homedir } from 'os'
import * as _ from './modules/index.js'

const [argv] = process.argv.slice(2)
chdir(homedir()) //or process.env.HOME || process.env.USERPROFILE

;(() => {
  const userInterface = createInterface({
    input: process.stdin,
    output: process.stdout
  })

  if (!argv || !argv.startsWith('--username=')) {
    _.startFileManager()
    userInterface.close()
  } else {
    const userName = argv.split('=').splice(-1)
    _.welcomeFileManager(userName)

    userInterface.on('SIGINT', () => {
      _.exitFileManager(userName)
      userInterface.close()
    })

    userInterface.on('line', async input => {
      if (input.length) {
        switch (input.split(' ')[0]) {
          case '.exit':
            _.exitFileManager(userName)
            userInterface.close()

            break
          case 'up':
            _.goUpper()

            break
          case 'cd':
            _.goTo(input)

            break
          case 'ls':
            await _.getListAllFilesAndFolders()

            break
          case 'cat':
            await _.readFile(input)

            break
          case 'add':
            _.createEmptyFile(input)

            break
          case 'rn':
            await _.renameFile(input)

            break
          case 'cp':
            await _.copyFile(input)

            break
          case 'mv':
            await _.moveFile(input)

            break
          case 'rm':
            await _.deleteFile(input)

            break
          case 'os':
            _.operatingSystemInfo(input)

            break
          case 'hash':
            await _.calculateHashForFile(input)

            break
          case 'compress':
            await _.compressFile(input)

            break
          case 'decompress':
            await _.decompressFile(input)

            break
          default:
            return console.error('Invalid input')
        }
      }
    })
  }
})()
