var shell = require('shelljs');
var child_process = require('child_process');
var chalk = require('chalk');

shell.config.fatal = true;

// get the cmd line args
const args = process.argv.slice(2)

// first argument is fullstack config file path
const configFilePath = args[0]
console.log(chalk.green('configPath: '+configFilePath))

// import config from the file
const config =  require(configFilePath)

// define project name
const project_name = config.projectName

// derive projects folder
const dir_projects = config.userFolder + '/' + config.projectsFolder

// derive directories
var dir_project = dir_projects + '/' + project_name
console.log(chalk.yellow('dir_project: ' + dir_project))
var dir_secure = 'secure'
console.log(chalk.yellow('dir_secure: ' + dir_secure))

// derive files
var file_compressed_archive = 'secure.tar.gz'
var file_encrypted_archive = 'secure.tar.gz.gpg'
var file_prod_settings = 'settings.json'

// change to the project directory
shell.cd(dir_project)

// remove old version of security archive if they exist
shell.config.fatal = false
shell.rm(file_compressed_archive)
console.log(chalk.yellow('removed old compressed archive: ' +
    file_encrypted_archive))
shell.rm(file_encrypted_archive)
console.log(chalk.yellow('removed old secured archive: ' +
    file_encrypted_archive))
shell.config.fatal = true

// tar and gzip the security folder
var compressCmd = 'tar -czf '+ file_compressed_archive + ' ' + dir_secure + '/'
shell.exec(compressCmd)
console.log(chalk.yellow('compressed security archive: ' +
    file_compressed_archive))

// encrypt compressed security folder
child_process.execFileSync('gpg2', ['--output', file_encrypted_archive,
     '--symmetric', file_compressed_archive], {stdio: 'inherit'})
console.log(chalk.yellow('encrypted security archive: ' +
    file_encrypted_archive))

// remove compressed security archive
shell.rm(file_compressed_archive)
console.log(chalk.yellow('removed compressed security archive: ' +
    file_compressed_archive))

// remove security folder
shell.rm('-rf', dir_secure)
console.log(chalk.yellow('removed security directory: ' + dir_secure))

// inform user of success
console.log(chalk.black.bgGreen('completed securing project '+project_name))
