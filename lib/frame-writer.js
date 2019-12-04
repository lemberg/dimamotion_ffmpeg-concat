'use strict'

const fs = require('fs-extra')
const sharp = require('sharp')

const supportedFormats = new Set([
  'png',
  'jpg',
  'webp',
  'raw'
])

module.exports = async (opts) => {
  const {
    frameFormat = 'raw',
    gl,
    width,
    height
  } = opts

  if (!supportedFormats.has(frameFormat)) {
    throw new Error(`frame writer unsupported format "${frameFormat}"`)
  }

  let worker = {
    byteArray: new Uint8Array(width * height * 4),
    encoder: null
  }

  if (frameFormat === 'png') {
    const buffer = Buffer.from(worker.byteArray.buffer)
    worker.encoder = sharp(buffer, {
      raw: {
        width,
        height,
        channels: 4
      }
    }).png({
      compressionLevel: 5,
      adaptiveFiltering: false
    })
  } else if (frameFormat === 'jpg') {
    const buffer = Buffer.from(worker.byteArray.buffer)
    worker.encoder = sharp(buffer, {
      raw: {
        width,
        height,
        channels: 4
      }
    }).jpeg({
      quality: 100,
      chromaSubsampling: '4:4:4'
    })
  } else if (frameFormat === 'webp') {
    const buffer = Buffer.from(worker.byteArray.buffer)
    worker.encoder = sharp(buffer, {
      raw: {
        width,
        height,
        channels: 4
      }
    }).webp({
      lossless: true
    })
  }

  return {
    write: async (filePath) => {
      gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, worker.byteArray)

      if (frameFormat === 'raw') {
        fs.writeFileSync(filePath, worker.byteArray)
      } else {
        await worker.encoder.toFile(filePath)
      }
    },

    flush: async () => {
      return Promise.resolve()
    },

    dispose: () => {
      worker = null
    }
  }
}
