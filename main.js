import { createBrotliCompress, createBrotliDecompress } from 'zlib'
import { readdir, access, unlink, rename } from 'fs/promises'
import { join, parse, isAbsolute, normalize } from 'path'
import { createReadStream, createWriteStream } from 'fs'
import { EOL, cpus, homedir, userInfo, arch } from 'os'
const { createHash } = await import('crypto')
import { createInterface } from 'readline'
import { chdir, cwd } from 'process'
import { fileURLToPath } from 'url'
import { pipeline } from 'stream'
import { promisify } from 'util'
import { constants } from 'fs'
const { F_OK } = constants

const [argv] = process.argv.slice(2)
chdir(homedir()) //or process.env.HOME || process.env.USERPROFILE

;(() => {
  const userInterface = createInterface({
    input: process.stdin,
    output: process.stdout
  })

  if (!argv || !argv.startsWith('--username=')) {
    console.log('Please start the application with command "npm run start -- --username=your_username"')
    userInterface.close()
  } else {
    const userName = argv.split('=').splice(-1)

    console.log(`Welcome to the File Manager, ${userName}!\nYou are currently in ${cwd()}`)

    userInterface.on('SIGINT', () => {
      console.log(`Thank you for using File Manager, ${userName}!`)
      userInterface.close()
    })

    userInterface.on('line', async input => {
      if (input.length) {
        switch (input.split(' ')[0]) {
          case '.exit':
            console.log(`Thank you for using File Manager, ${userName}!`)
            userInterface.close()

            break
          case 'up':
            const { root, dir, base } = parse(cwd())

            switch (cwd()) {
              case `/${base}`:
                chdir(root)
                console.log(`You are currently in ${cwd()}`)
                break
              case `${dir}/${base}`:
                chdir(dir)
                console.log(`You are currently in ${cwd()}`)
                break
              default:
                return chdir(root)
            }

            break
          case 'cd':
            let pathToDirectory = input.split(' ')
            pathToDirectory.shift()
            pathToDirectory = pathToDirectory.join(' ')

            try {
              chdir(pathToDirectory)
              console.log(`You are currently in ${cwd()}`)
            } catch (err) {
              console.error('Invalid input')
            }

            break
          case 'ls':
            const files = await readdir(cwd())
            const listAllFilesAndFolder = []

            for (const file of files) {
              listAllFilesAndFolder.push(file)
            }

            console.log(listAllFilesAndFolder.filter(name => !name.startsWith('.')))

            break
          case 'cat':
            let filePathForRead = input.split(' ')
            filePathForRead.shift()
            filePathForRead = filePathForRead.join(' ')

            if (isAbsolute(filePathForRead)) {
              try {
                await access(filePathForRead, F_OK)

                const data = createReadStream(filePathForRead)

                data.on('data', chunk => console.log(chunk.toString().trim()))
              } catch {
                console.error(`Operation failed\nYou are currently in ${cwd()}`)
              }
            } else {
              try {
                await access(normalize(`${cwd()}/${filePathForRead}`), F_OK)

                const data = createReadStream(
                  normalize(`${cwd()}/${filePathForRead}`)
                )
                data.on('data', chunk => console.log(chunk.toString().trim()))
              } catch {
                console.error(`Operation failed\nYou are currently in ${cwd()}`)
              }
            }

            break
          case 'add':
            let newFileNameForCreate = input.split(' ')
            newFileNameForCreate.shift()
            newFileNameForCreate = newFileNameForCreate.join(' ')

            createWriteStream(newFileNameForCreate)

            break
          case 'rn':
            const [filePathForRename, newFileNameForRename] = input.split(' ').slice(-2)
            const [oldFileNameForRename] = filePathForRename.split('/').slice(-1)

            if (isAbsolute(filePathForRename)) {
              try {
                await access(filePathForRename, F_OK)

                const path = filePathForRename.split('/')
                path.pop()

                await rename(join(fileURLToPath(`file://${filePathForRename}`)),join(fileURLToPath(`file://${path.join('/')}`),`/${newFileNameForRename}`))
              } catch {
                console.error(`Operation failed\nYou are currently in ${cwd()}`)
              }
            } else {
              try {
                await access(normalize(`${cwd()}/${filePathForRename}`), F_OK)
                await rename(join(fileURLToPath(`file://${cwd()}`),`/${oldFileNameForRename}`),join(fileURLToPath(`file://${cwd()}`),`/${newFileNameForRename}`))
              } catch {
                console.error(`Operation failed\nYou are currently in ${cwd()}`)
              }
            }

            break
          case 'cp':
            const [filePathForCopy, directoryPathForFileForCopy] = input.split(' ').slice(-2)
            const [fileNameForCopy] = filePathForCopy.split('/').slice(-1)

            if (isAbsolute(filePathForCopy)) {
              if (isAbsolute(directoryPathForFileForCopy)) {
                try {
                  await access(filePathForCopy, F_OK)
                  await access(directoryPathForFileForCopy, F_OK)

                  createReadStream(filePathForCopy).pipe(createWriteStream(`${directoryPathForFileForCopy}/${fileNameForCopy}`))
                } catch {
                  console.error(`Operation failed\nYou are currently in ${cwd()}`)
                }
              } else {
                try {
                  await access(filePathForCopy, F_OK)
                  await access(normalize(`${cwd()}/${directoryPathForFileForCopy}`),F_OK)

                  createReadStream(filePathForCopy).pipe(createWriteStream(normalize(`${cwd()}/${directoryPathForFileForCopy}/${fileNameForCopy}`)))
                } catch {
                  console.error(`Operation failed\nYou are currently in ${cwd()}`)
                }
              }
            } else {
              if (isAbsolute(directoryPathForFileForCopy)) {
                try {
                  await access(normalize(`${cwd()}/${filePathForCopy}`), F_OK)
                  await access(directoryPathForFileForCopy, F_OK)

                  createReadStream(normalize(`${cwd()}/${filePathForCopy}`)).pipe(createWriteStream(`${directoryPathForFileForCopy}/${fileNameForCopy}`))
                } catch {
                  console.error(`Operation failed\nYou are currently in ${cwd()}`)
                }
              } else {
                try {
                  await access(normalize(`${cwd()}/${filePathForCopy}`), F_OK)
                  await access(normalize(`${cwd()}/${directoryPathForFileForCopy}`),F_OK)

                  createReadStream(normalize(`${cwd()}/${filePathForCopy}`)).pipe(createWriteStream(normalize(`${cwd()}/${directoryPathForFileForCopy}/${fileNameForCopy}`)))
                } catch {
                  console.error(`Operation failed\nYou are currently in ${cwd()}`)
                }
              }
            }

            break
          case 'mv':
            const [filePathForMove, directoryPathForFileForMove] = input.split(' ').slice(-2)
            const [fileNameForMove] = filePathForMove.split('/').slice(-1)

            if (isAbsolute(filePathForMove)) {
              if (isAbsolute(directoryPathForFileForMove)) {
                try {
                  await access(filePathForMove, F_OK)
                  await access(directoryPathForFileForMove, F_OK)

                  createReadStream(filePathForMove).pipe(createWriteStream(`${directoryPathForFileForMove}/${fileNameForMove}`))
                  await unlink(join(fileURLToPath('file://'), filePathForMove))
                } catch {
                  console.error(`Operation failed\nYou are currently in ${cwd()}`)
                }
              } else {
                try {
                  await access(filePathForMove, F_OK)
                  await access(normalize(`${cwd()}/${directoryPathForFileForMove}`),F_OK)

                  createReadStream(filePathForMove).pipe(createWriteStream(normalize(`${cwd()}/${directoryPathForFileForMove}/${fileNameForMove}`)))
                  await unlink(join(fileURLToPath('file://'), filePathForMove))
                } catch {
                  console.error(`Operation failed\nYou are currently in ${cwd()}`)
                }
              }
            } else {
              if (isAbsolute(directoryPathForFileForMove)) {
                try {
                  await access(normalize(`${cwd()}/${filePathForMove}`), F_OK)
                  await access(directoryPathForFileForMove, F_OK)

                  createReadStream(normalize(`${cwd()}/${filePathForMove}`)).pipe(createWriteStream(`${directoryPathForFileForMove}/${fileNameForMove}`))
                  await unlink(join(fileURLToPath(`file://${cwd()}`),`/${filePathForMove}`))
                } catch {
                  console.error(`Operation failed\nYou are currently in ${cwd()}`)
                }
              } else {
                try {
                  await access(normalize(`${cwd()}/${filePathForMove}`), F_OK)
                  await access(normalize(`${cwd()}/${directoryPathForFileForMove}`),F_OK)

                  createReadStream(normalize(`${cwd()}/${filePathForMove}`)).pipe(createWriteStream(normalize(`${cwd()}/${directoryPathForFileForMove}/${fileNameForMove}`)))
                  await unlink(join(fileURLToPath(`file://${cwd()}`),`/${filePathForMove}`))
                } catch {
                  console.error(`Operation failed\nYou are currently in ${cwd()}`)
                }
              }
            }

            break
          case 'rm':
            const [filePathForDelete] = input.split(' ').slice(-1)

            if (isAbsolute(filePathForDelete)) {
              try {
                await access(filePathForDelete, F_OK)
                await unlink(join(fileURLToPath('file://'), filePathForDelete))
              } catch {
                console.error(`Operation failed\nYou are currently in ${cwd()}`)
              }
            } else {
              try {
                await access(normalize(`${cwd()}/${filePathForDelete}`), F_OK)
                await unlink(join(fileURLToPath(`file://${cwd()}`),`/${filePathForDelete}`))
              } catch {
                console.error(`Operation failed\nYou are currently in ${cwd()}`)
              }
            }

            break
          case 'os':
            const [command] = input.split(' ').slice(-1)

            switch (command) {
              case '--EOL':
                console.log(JSON.stringify(EOL))

                break
              case '--cpus':
                const cpusResult = []

                for (const { model, speed } of cpus()) {
                  cpusResult.push({
                    model,
                    speed: Math.trunc(speed / 1000)
                  })
                }

                console.log(cpusResult)

                break
              case '--homedir':
                console.log(homedir())

                break
              case '--username':
                console.log(userInfo().username)

                break
              case '--architecture':
                console.log(arch())

                break
              default:
                return console.error(`Operation failed\nYou are currently in ${cwd()}`)
            }

            break
          case 'hash':
            const [filePathForHash] = input.split(' ').slice(-1)
            const hash = createHash('sha256')

            if (isAbsolute(filePathForHash)) {
              try {
                await access(filePathForHash, F_OK)

                const data = createReadStream(filePathForHash)

                data.on('data', chunk => {
                  hash.update(chunk.toString().trim())
                  console.log(hash.digest('hex'))
                })
              } catch {
                console.error(`Operation failed\nYou are currently in ${cwd()}`)
              }
            } else {
              try {
                await access(normalize(`${cwd()}/${filePathForHash}`), F_OK)

                const data = createReadStream(normalize(`${cwd()}/${filePathForHash}`))

                data.on('data', chunk => {
                  hash.update(chunk.toString().trim())
                  console.log(hash.digest('hex'))
                })
              } catch {
                console.error(`Operation failed\nYou are currently in ${cwd()}`)
              }
            }

            break
          case 'compress':
            const [filePathForCompress,directoryPathForFileForCompress] = input.split(' ').slice(-2)
            const [fileNameForCompress] = filePathForCompress.split('/').slice(-1)
            const BrotliCompress = createBrotliCompress()
            const pipeForCompress = promisify(pipeline)

            if (isAbsolute(filePathForCompress)) {
              if (isAbsolute(directoryPathForFileForCompress)) {
                try {
                  await access(filePathForCompress, F_OK)
                  await access(directoryPathForFileForCompress, F_OK)

                  const inp = createReadStream(filePathForCompress)
                  const out = createWriteStream(`${directoryPathForFileForCompress}/${fileNameForCompress}.br`)

                  await pipeForCompress(inp, BrotliCompress, out)
                } catch {
                  console.error(`Operation failed\nYou are currently in ${cwd()}`)
                }
              } else {
                try {
                  await access(filePathForCompress, F_OK)
                  await access(normalize(`${cwd()}/${directoryPathForFileForCompress}`),F_OK)

                  const inp = createReadStream(filePathForCompress)
                  const out = createWriteStream(normalize(`${cwd()}/${directoryPathForFileForCompress}/${fileNameForCompress}.br`))

                  await pipeForCompress(inp, BrotliCompress, out)
                } catch {
                  console.error(`Operation failed\nYou are currently in ${cwd()}`)
                }
              }
            } else {
              if (isAbsolute(directoryPathForFileForCompress)) {
                try {
                  await access(normalize(`${cwd()}/${filePathForCompress}`),F_OK)
                  await access(directoryPathForFileForCompress, F_OK)

                  const inp = normalize(`${cwd()}/${filePathForCompress}`)
                  const out = createWriteStream(`${directoryPathForFileForCompress}/${fileNameForCompress}.br`)

                  await pipeForCompress(inp, BrotliCompress, out)
                } catch {
                  console.error(`Operation failed\nYou are currently in ${cwd()}`)
                }
              } else {
                try {
                  await access(normalize(`${cwd()}/${filePathForCompress}`),F_OK)
                  await access(normalize(`${cwd()}/${directoryPathForFileForCompress}`),F_OK)

                  const inp = normalize(`${cwd()}/${filePathForCompress}`)
                  const out = createWriteStream(normalize(`${cwd()}/${directoryPathForFileForCompress}/${fileNameForCompress}.br`))

                  await pipeForCompress(inp, BrotliCompress, out)
                } catch {
                  console.error(`Operation failed\nYou are currently in ${cwd()}`)
                }
              }
            }

            break
          case 'decompress':
            const [filePathForDecompress,directoryPathForFileForDecompress] = input.split(' ').slice(-2)
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
                    const out = createWriteStream(`${directoryPathForFileForDecompress}/${fileNameForDecompress.slice(0,-3)}`)

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
                    await access(normalize(`${cwd()}/${directoryPathForFileForDecompress}`),F_OK)

                    const inp = createReadStream(filePathForDecompress)
                    const out = createWriteStream(normalize(`${cwd()}/${directoryPathForFileForDecompress}/${fileNameForDecompress.slice(0,-3)}`))

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
                    await access(normalize(`${cwd()}/${filePathForDecompress}`),F_OK)
                    await access(directoryPathForFileForDecompress, F_OK)

                    const inp = normalize(`${cwd()}/${filePathForDecompress}`)
                    const out = createWriteStream(`${directoryPathForFileForDecompress}/${fileNameForDecompress.slice(0,-3)}`)

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
                    await access(normalize(`${cwd()}/${filePathForDecompress}`),F_OK)
                    await access(normalize(`${cwd()}/${directoryPathForFileForDecompress}`),F_OK)

                    const inp = normalize(`${cwd()}/${filePathForDecompress}`)
                    const out = createWriteStream(normalize(`${cwd()}/${directoryPathForFileForDecompress}/${fileNameForDecompress.slice(0,-3)}`))

                    await pipeForDecompress(inp, BrotliDecompress, out)
                  } catch {
                    console.error(`Operation failed\nYou are currently in ${cwd()}`)
                  }
                }
              }
            }

            break
          default:
            return console.error('Invalid input')
        }
      }
    })
  }
})()
