const { spawn, execSync } = require('node:child_process')
const { join } = require('node:path')
const { once } = require('node:events')

const FLAGS = {
  '--max-semi-space-size': [16, 32, 64, 128, 256, 512, 1024, 2048],
  '--max-old-space-size': [1024, 2048, 4096, 8192, 16384]
}

function sleep (seconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000)
  })
}

async function runAutocannon(port) {
  const output = execSync(`autocannon -c 100 -d 30 http://localhost:${port}/`)
  return output
}

async function main () {
  for (const flag of Object.keys(FLAGS)) {
    const fValues = FLAGS[flag]
    for (const value of fValues) {
      console.log(`Running server ${flag}=${value}`)
      const server = spawn(process.execPath, [
        `${flag}=${value}`,
        join('./memory-bound', 'index.js')
      ])
      await sleep(2)
      const results = await runAutocannon(3000);
      console.log('Flag: ', flag, ' Value: ', value)
      console.log(results.toString())
      server.kill()
      await once(server, 'close')
    }
  }
}

main()
// const server = spawnSync(process.execPath, [
//   '--max-semi-space-size=16',
//   './memory-bound/index.js'
// ])
// console.log(server.stderr.toString())
