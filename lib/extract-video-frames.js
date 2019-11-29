'use strict'

const ffmpeg = require('fluent-ffmpeg')

module.exports = (opts) => {
  const {
    log,
    videoPath,
    framePattern
  } = opts

  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .outputOptions([
        '-pix_fmt', 'rgba',
        '-start_number', '0'
      ])
      .output(framePattern)
      .on('start', cmd => log({ cmd }))
      .on('end', () => resolve(framePattern))
      .on('error', (err) => {
        log({ err });
        reject(err);
      })
      .run()
  })
}
