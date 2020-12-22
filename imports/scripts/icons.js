// imports
var fs = require('fs')
const shell = require('shelljs')
const chalk = require('chalk')
const _ = require('underscore')

// log start of script
console.log(chalk.black.bgYellow(`Starting to generate icons.`))

// fail hard
shell.config.fatal = true

// input settings
const iconSizes = [
  '16x16',
  '20x20',
  '29x29',
  '32x32',
  '40x40',
  '48x48',
  '50x50',
  '57x57',
  '58x58',
  '60x60',
  '72x72',
  '76x76',
  '80x80',
  '87x87',
  '96x96',
  '100x100',
  '114x114',
  '120x120',
  '144x144',
  '150x150',
  '152x152',
  '167x167',
  '180x180',
  '192x192',
  '320x480',
  '480x320',
  '480x800',
  '512x512',
  '640x960',
  '640x1136',
  '720x1280',
  '750x1334',
  '768x1024',
  '800x480',
  '960x1600',
  '1024x500',
  '1024x768',
  '1024x1024',
  '1125x2436',
  '1242x2208',
  '1280x720',
  '1280x1920',
  '1536x2048',
  '1600x960',
  '1668x2224',
  '1920x1280',
  '2048x1536',
  '2048x2732',
  '2208x1242',
  '2224x1668',
  '2436x1125',
  '2732x2048',
]

// read fullstack-config.json
const config = JSON.parse(fs.readFileSync('./fullstack-config.json', 'utf8'))

// script config
const projectFolder = config.projectFolder?config.projectFolder:
    `${config.projectsFolder}/${config.projectName}`
console.log(chalk.yellow(`projectFolder: ${projectFolder}`))

const validInputExtensions = ['svg', 'png']

//------------------------------------------------------------------------------
// Worker Functions
//------------------------------------------------------------------------------

/**
 * Convert string size to number based object
 * @param {String} iconSize -
 * @returns {Object} with numeric members width and height
 **/
function getDimension(iconSize) {
  const split = iconSize.split('x')
  const result = {
    width: Number(split[0]),
    height: Number(split[1])
  }
  return result
}

/**
 * Checks if icon size is a square
 * @param {String} iconSize - e.g. '128x128'
 * @returns {boolean}
 **/
function isSquare(iconSize) {
  const dimension = getDimension(iconSize)
  const result = dimension.width === dimension.height
  return result
}

/**
 * Calculate the size of the square
 * @param {String} size - the imagemagick size
 * @returns {}
 **/
function squareSize(size) {
  const dimension = getDimension(size)
  const scalar = dimension.height >= dimension.width?dimension.width:
      dimension.height;
  return `${scalar}x${scalar}`
}

/**
 * Create or override an input file to create icons from
* @returns {String} inputFileName
 **/
const createInputFile = () => {

  const caption = config.humanName

  const font = config.icons && config.icons.font?config.icons.font:
      '~/projects/meteor-fullstack/public/fonts/roboto/Roboto-Bold.woff'
  console.log(chalk.yellow(`font: ${font}`))

  const defaultInputFileSize = '2048x2048'
  console.log(chalk.yellow(`defaultInputFileSize: ${defaultInputFileSize}`))

  const defaultBackgroundColor = config.icons && config.icons.backgroundColor?
      config.icons.backgroundColor:'white'
  console.log(chalk.yellow(`defaultBackgroundColor: ${defaultBackgroundColor}`))

  const defaultTextStrokeColor = config.icons && config.icons.textStrokeColor?
      config.icons.textStrokeColor:'black'
  console.log(chalk.yellow(`defaultTextStrokeColor: ${defaultTextStrokeColor}`))

  const defaultTextStrokeWidth = config.icons && config.icons.textStrokeWidth?
      config.icons.textStrokeWidth:'1'
  console.log(chalk.yellow(`defaultTextStrokeWidth: ${defaultTextStrokeWidth}`))

  const defaultTextFillColor = config.icons && config.icons.textFillColor?
      config.icons.textFillColor:'black'
  console.log(chalk.yellow(`defaultTextFillColor: ${defaultTextFillColor}`))

  // create input file name
  const inputFile = `${resourcesFolder}/icon-default.png`

  // if default input file exists
  if (shell.test('-f', inputFile)) {

    // remove previous version of default icon
    shell.rm(inputFile)
  }

  // add text to input file
  const addCaptionCommand = `convert`+
        ` -background ${defaultBackgroundColor}`+
        ` -size ${defaultInputFileSize}`+
        ` -stroke ${defaultTextStrokeColor}`+
        ` -strokewidth ${defaultTextStrokeWidth}`+
        ` -fill ${defaultTextFillColor}`+
        ` -font ${font}`+
        ` -gravity center`+
        ` caption:'${caption}'`+
        ` ${inputFile}`
  shell.exec(addCaptionCommand)
  return inputFile
}

/**
 * Create or override an file containing only a background
 * @param {String} size -
 * @param {String} background -
 * @param {String} outputFile -
 **/
function createBackgroundFile(size, background, outputFile) {
  const createBackgroundFileCommand = `convert`+
      ` -size ${size}`+
      ` canvas:${background}`+
      ` ${outputFile}`
  shell.exec(createBackgroundFileCommand)
  return undefined
}

/**
 * Resize a input file to an output file of size
 * @param {String} size -
 * @param {String} inputFile -
 * @param {String} outputFile -
 **/
function resizeFile(size, inputFile, outputFile) {

  // create input file
  const resizeFileCommand = `convert`+
      ` ${inputFile}`+
      ` -resize ${size}`+
      ` ${outputFile}`
  shell.exec(resizeFileCommand)
  return undefined
}

/**
 * Frame an input file on a background
 * @param {String} backgroundSize -
 * @param {String} backgroundColor -
 * @param {String} inputFile -
 * @param {String} outputFile -
 * @returns {}
 **/
function frameOnBackground(backgroundSize, backgroundColor, inputFile, outputFile) {
  let frameOnBackground = `convert`+
      ` ${inputFile}`+
      ` -background ${backgroundColor}`+
      ` -gravity center`+
      ` -extent ${backgroundSize}`+
      ` ${outputFile}`
  // console.log(chalk.yellow(`frameOnBackground: ${frameOnBackground}`))
  shell.exec(frameOnBackground)
}

/**
 * Delete the content of a folder and create it if it does not exist
 * @param {string} path -
 **/
function cleanFolder(path) {

  // if folder exists
  if (shell.test('-d', path)) {

    // remove the contents
    shell.rm(`-rf`, path)

    // create folder
    shell.mkdir(path)
  }

  // else
  else {

    // create folder
    shell.mkdir(path)
  }
}

//------------------------------------------------------------------------------
// Script Logic
//------------------------------------------------------------------------------

// setup paths
const resourcesFolder = `${projectFolder}/resources`
console.log(chalk.yellow(`resourcesFolder: ${resourcesFolder}`))
const iconsFolder = `${resourcesFolder}/icons`
console.log(chalk.yellow(`iconsFolder: ${iconsFolder}`))
const tempFolder = `${resourcesFolder}/temp`
console.log(chalk.yellow(`tempFolder: ${tempFolder}`))
const possibleInputFiles = _.map(validInputExtensions, extension => {
  return `${resourcesFolder}/icon.${extension}`
})

// find the input file name
// console.log(chalk.yellow(`possibleInputFiles:`, possibleInputFiles))
let inputFile = _.find(possibleInputFiles, possibleInputFile => {
  return shell.test('-f', possibleInputFile)
})

// if input file does not exist
if (!inputFile) {
  console.log(chalk.yellow(`No icon base file found.`))

  // create input icon file name
  inputFile = createInputFile()
  console.log(chalk.yellow(`Created icon base file ${inputFile}`))
}
else {
  console.log(chalk.yellow(`Found icon base file ${inputFile}`))
}

// clean output folders
cleanFolder(iconsFolder)
cleanFolder(tempFolder)

// get the squares
const squares = _.filter(iconSizes, iconSize => {
  return isSquare(iconSize)
})

// for each square
for (let square of squares) {

  // generate temp square icon path
  const squareIconFile = `${tempFolder}/${square}.png`

  // generate an square icon with input file without caption
  resizeFile(square, inputFile, squareIconFile)

  // generate icon path
  const iconFile = `${iconsFolder}/${square}.png`

  // frame the (possibly transparent) square in a square with a background
  frameOnBackground(square, 'white', squareIconFile, iconFile)
  console.log(chalk.yellow(`Created icon file ${iconFile}`))
}

// get the rectangles
const rectangles = _.filter(iconSizes, iconSize => {
  return !isSquare(iconSize)
})

// for each rectangle
for (let rectangle of rectangles) {

  // create square size that will fit in rectangle
  let square = squareSize(rectangle)

  // get the output file for the sqaure icon
  const iconSquareFile = `${tempFolder}/${square}.png`

  // resize input file to square size
  resizeFile(square, inputFile, iconSquareFile)

  // create icon file name
  const iconFile = `${iconsFolder}/${rectangle}.png`

  // compose square on center of rectangle
  frameOnBackground(rectangle, 'white', iconSquareFile, iconFile)
  console.log(chalk.yellow(`Created icon file ${iconFile}`))
}

// remove the temp folder
shell.rm('-rf', tempFolder)

// copy favicons
shell.cp(`${iconsFolder}/16x16.png`,
    `${projectFolder}/public/favicon-16x16.png`)
shell.cp(`${iconsFolder}/32x32.png`,
    `${projectFolder}/public/favicon-32x32.png`)
shell.cp(`${iconsFolder}/48x48.png`,
    `${projectFolder}/public/favicon.ico`)
shell.cp(`${iconsFolder}/150x150.png`,
    `${projectFolder}/public/mstile-150x150.png`)
shell.cp(`${iconsFolder}/180x180.png`,
    `${projectFolder}/public/apple-touch-icon.png`)
shell.cp(`${iconsFolder}/192x192.png`,
    `${projectFolder}/public/android-chrome-192x192.png`)
shell.cp(`${iconsFolder}/512x512.png`,
    `${projectFolder}/public/android-chrome-512x512.png`)
console.log(chalk.yellow(`Copied favicons.`))

console.log(chalk.black.bgGreen(
    `Completed generating icons. See ${resourcesFolder}`))
