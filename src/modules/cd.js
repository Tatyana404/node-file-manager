import { chdir, cwd } from 'process'
import { operationFailed } from './index.js'

export const goTo = input => {
  let pathToDirectory = input.split(' ')
  pathToDirectory.shift()
  pathToDirectory = pathToDirectory.join(' ')

  try {
    chdir(pathToDirectory)
    console.log(`You are currently in ${cwd()}`)
  } catch (err) {
    operationFailed()
  }
}
