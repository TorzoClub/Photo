require('arr-ext')

const yaml = require('js-yaml')
const fs = require('fs')
const gulp = require('gulp')
const imgSizeOf = require('image-size')
const imageSize = function (file) {
  return new Promise((res, rej) => {
    imgSizeOf(file, (err, dimensions) => err ? rej(err) : res(dimensions))
  })
}
const path = require('path')
const flatMap = require('flat-map').default
const scaleImages = require('gulp-scale-images')


const variantsPerFile = (file, cb) => {
  const jpegFile = file.clone()
  jpegFile.scale = { maxWidth: 700, format: 'jpg' }
  cb(null, [jpegFile])
}

const computeFileName = (output, scale, cb) => {
  const filename = path.basename(output.history[0])

  const fileName = [
      path.basename(output.path, output.extname), // strip extension
      scale.format || output.extname
  ].join('.')

  cb(null, fileName)
}

function generateThumbnail(year, imageFilename, photo) {
  return gulp.src(`resource/${year}/${imageFilename}`)
    .pipe(flatMap(variantsPerFile))
    .pipe(scaleImages())
    .pipe(gulp.dest(`resource/thumbnail/${year}/`))
}

const gallery_list = []
gulp.task('thumbnail', () => {
  return gulp.src('resource/*/*.{jpeg,jpg,png,gif}')
    .pipe(
      flatMap((file, next) => {
        const filePath = file.history[0]

        const relativePath = path.relative(__dirname, filePath).replace(/^resource\//, '')

        let [year, filename] = relativePath.split('/')

        if (Number.isInteger(parseInt(year))) {
          year = parseInt(year)
          // console.log(year, filename)
          let gallery = gallery_list.findBy('year', year)
          if (!gallery) {
            gallery = { year, gallery: [] }
            gallery_list.push(gallery)
          }

          const p = path.parse(filename)

          let info = {}
          try {
            const pmdPath = `resource/${year}/${p.name}.pmd`
            const pmdRaw = fs.readFileSync(pmdPath).toString()
            const pmdSeries = pmdRaw.split(/\/\/\-{1,}/g).map(item => item.trim())

            if (pmdSeries.length >= 2) {
              info.comment = pmdSeries[1]
              const yamlRaw = pmdSeries[0]
              const parsed = yaml.safeLoad(yamlRaw)
              Object.assign(info, parsed)
            } else {
              info.comment = pmdSeries[0]
            }
          } catch (err) {
            if (err.code !== 'ENOENT') {
              throw err
            }
          }

          gallery.gallery.push({
            _index: parseInt(p.name),
            id: filename,
            url: `${year}/${filename}`,
            thum_url: `thumbnail/${year}/${p.name}.jpg`,
            comment: info.comment,
            author: info.author === undefined ? null : info.author
          })
        }

        next(null, [file])
      })
    )
    .pipe(flatMap(variantsPerFile))
    .pipe(scaleImages(computeFileName))
    .pipe(gulp.dest('resource/thumbnail/'))
})

gulp.task('after', async done => {
  // console.dir(gallery_list, { colors: true, depth: 10 })
  for (const gallery of gallery_list) {
    for (const photo of gallery.gallery) {
      const filePath = path.join('resource', photo.url)
      const dimensions = await imageSize(filePath)
      Object.assign(photo, {
        height: dimensions.height,
        width: dimensions.width
      })
    }

    gallery.gallery = gallery.gallery.sort((a, b) => {
      return a._index - b._index
    })
  }

  gallery_list.sort((a, b) => b.year - a.year)

  fs.writeFileSync(
    path.join('resource', 'gallery.json'),
    JSON.stringify(gallery_list, '  ', '  ')
  )
  // done()
})

exports.default = gulp.series('thumbnail', 'after')
