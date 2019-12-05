'use strict'

const ffmpeg = require('fluent-ffmpeg')
const onTranscodeProgress = require('ffmpeg-on-progress')

module.exports = (opts) => {
  const {
    duration,
    onProgress,
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
      .on('start', (cmd) => console.log({ cmd }))
      .on('progress', onTranscodeProgress(onProgress, duration))
      .on('end', () => resolve(framePattern))
      .on('error', (err) => {
        console.log(err)
        reject(err)
      })
      .run()
  })
}
