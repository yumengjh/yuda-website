import { execFile } from 'node:child_process'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { afterEach, describe, expect, it } from 'vitest'

const execFileAsync = promisify(execFile)
const temporaryDirectories: string[] = []

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { force: true, recursive: true })))
})

describe('generate-og script', () => {
  it('creates a PNG OG image from command-line configuration', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'tanstack-og-'))
    temporaryDirectories.push(directory)
    const output = join(directory, 'social.png')

    await execFileAsync(process.execPath, [
      'scripts/generate-og.mjs',
      '--title',
      'Acme Starter',
      '--description',
      'A reusable web application template.',
      '--output',
      output,
    ])

    const image = await readFile(output)
    expect(image.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    expect(image.length).toBeGreaterThan(1_000)
  })
})
