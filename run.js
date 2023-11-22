const { spawn, execSync } = require('node:child_process')
const { join, resolve } = require('node:path')
const { once } = require('node:events')

const FLAGS = {
  '--max-semi-space-size': [16, 32, 64, 128, 256, 1024],
  '--max-old-space-size': [1024, 2048, 4096, 8192, 16384]
}

function sleep (seconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000)
  })
}

const autocannonPath = resolve('../autocannon/autocannon.js')

async function runAutocannon(port) {
  const output = execSync(`${autocannonPath} -c 100 -d 30 -V=0 http://localhost:${port}/`)
  return output
}

async function main () {
  for (const flag of Object.keys(FLAGS)) {
    const fValues = FLAGS[flag]
    for (const value of fValues) {
      console.log(`Running server ${flag}=${value}`)
      const server = spawn(process.execPath, [
        `${flag}=${value}`,
        join('./simple-http.js')
      ])
      await sleep(2)
      const results = await runAutocannon(3000);
      console.log('Flag: ', flag, ' Value: ', value)
      console.log(results.toString())
      console.log(`${'-'.repeat(process.stdout.columns)}`);
      server.kill()
      await once(server, 'close')
    }
  }
}

main()
