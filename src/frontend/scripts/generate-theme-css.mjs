import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const tokensPath = path.resolve(scriptDir, '../../../docs/design/tokens.json')
const outPath = path.resolve(scriptDir, '../src/theme/tokens.generated.css')

const tokens = JSON.parse(readFileSync(tokensPath, 'utf-8'))

const lines = ['@theme {']
for (const [name, scale] of Object.entries(tokens.core.color)) {
  for (const [step, value] of Object.entries(scale)) {
    lines.push(`  --color-${name}-${step}: ${value};`)
  }
}
lines.push('}')

mkdirSync(path.dirname(outPath), { recursive: true })
writeFileSync(
  outPath,
  `/* Generated from docs/design/tokens.json by scripts/generate-theme-css.mjs — do not edit by hand. */\n${lines.join('\n')}\n`,
)
