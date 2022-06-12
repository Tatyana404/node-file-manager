import { cwd } from 'process'

export const operationFailed = () => console.error(`Operation failed\nYou are currently in ${cwd()}`)
