'use strict'

const ffmpeg = require('fluent-ffmpeg')
const onTranscodeProgress = require('ffmpeg-on-progress')

module.exports = (opts) => {
  const {
    duration,
    onProgress,
    videoPath,
    framePattern,
    verbose = false
  } = opts

  return new Promise((resolve, reject) => {
    const cmd = ffmpeg(videoPath)
      .outputOptions([
        '-loglevel', 'info',
        '-pix_fmt', 'rgba',
        '-start_number', '0'
      ])
      .output(framePattern)
      .on('start', (cmd) => console.log({ cmd }))
      .on('progress', onTranscodeProgress(onProgress, duration))
      .on('end', () => {
        onProgress('PROCESS_END')
        resolve(framePattern)
      })
      .on('error', (err) => {
        console.log(err)
        reject(err)
      })

    if (verbose) {
      cmd.on('stderr', (err) => console.error(err))
    }

    cmd.run()
  })
}
