import fs from 'fs'
import path from 'path'


const PUBLIC_FOLDER_PATH = path.join(process.cwd(), 'public')

export const readPublicFile = <T>(
  filePath: string
): T => {
  const result = fs.readFileSync(`${PUBLIC_FOLDER_PATH}/${filePath}`, 'utf8')
  return JSON.parse(result) as T
}