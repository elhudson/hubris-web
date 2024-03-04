import { generateIndex, generateManyIndex } from 'vscode-generate-index-standalone'
import { join } from 'path'



const generateManyResult = await generateManyIndex({
  patterns: ['./interface/index.js'],
  replaceFile: true
})