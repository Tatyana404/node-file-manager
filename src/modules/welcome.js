import { cwd } from 'process'

export const welcomeFileManager = userName => console.log(`Welcome to the File Manager, ${userName}!\nYou are currently in ${cwd()}`)
