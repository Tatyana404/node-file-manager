import { chdir, cwd } from 'process'
import { parse } from 'path'

export const goUpper = () => {
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
}
