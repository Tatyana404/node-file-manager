import { EOL, cpus, homedir, userInfo, arch } from 'os'
import { cwd } from 'process'

export const operatingSystemInfo = input => {
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
}
