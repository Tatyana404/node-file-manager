import { EOL, cpus, homedir, userInfo, arch } from 'os'

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
          speed: `${(speed / 1000).toFixed(1)} GHz`
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
      return console.error('Invalid input')
  }
}
