import { readdir } from 'fs/promises'
import { cwd } from 'process'

export const getListAllFilesAndFolders = async () => {
  const files = await readdir(cwd())
  const listAllFilesAndFolder = []

  for (const file of files) {
    listAllFilesAndFolder.push(file)
  }

  console.log(listAllFilesAndFolder.filter(name => !name.startsWith('.')))
}
