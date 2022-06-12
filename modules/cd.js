import { chdir, cwd } from 'process'

export const goTo = input => {
  let pathToDirectory = input.split(' ')
  pathToDirectory.shift()
  pathToDirectory = pathToDirectory.join(' ')

  try {
    chdir(pathToDirectory)
    console.log(`You are currently in ${cwd()}`)
  } catch (err) {
    console.error(`Operation failed\nYou are currently in ${cwd()}`)
  }
}
