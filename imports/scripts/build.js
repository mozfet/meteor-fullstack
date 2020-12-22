/*
Usage:
$ npm run build <PROJECT_NAME> <PROJECT_SERVER_URL> <PROJECTS_FOLDER_PATH>

Example:
$ npm run build butterfly-diary https://www.butterfly-diary.com

Where:
PROJECT_NAME is also the folder name: e.g. 'butterfly-diary'
PROJECT_SERVER_URL is the URL where the apps will connect to: e.g. 'https://www.butterfly-diary.com'
PROJECTS_FOLDER_PATH (optional) is the folder containing the project; defaults to ~/projects
*/

// imports
var shell = require('shelljs');
var child_process = require('child_process');
var chalk = require('chalk');
shell.config.fatal = true;

// arguments
var args = process.argv.slice(2)
console.log(chalk.green('arguments: '+args))

// define project name
var project_name = args[0]

// defined server address
var server_address = args[1]

// define project folder
var dir_projects = '~/projects';
if (args.length>2) {
  dir_projects = args[2]
}

// define keystore and alias for google upload key
var keystore_name = 'keystore';
var keystore_alias_google_upload = 'googlePlayUpload';

// derive directories
var dir_project = dir_projects + '/' + project_name;
console.log(chalk.yellow('dir_project: ' + dir_project));

var dir_build = dir_projects + '/build';
console.log(chalk.yellow('dir_build: ' + dir_build));

var dir_build_project = dir_build + '/' + project_name;
console.log(chalk.yellow('dir_build_project: ' + dir_build_project));

var dir_build_android = dir_build + '/' + project_name +'/android';
console.log(chalk.yellow('dir_build_android: ' + dir_build_android));

var dir_build_android_apk = dir_build_android + '/project/build/outputs/apk';
console.log(chalk.yellow('dir_build_android_apk: ' + dir_build_android_apk));

var dir_build_ios = dir_build_project + '/ios';
console.log(chalk.yellow('dir_build_ios: ' + dir_build_ios));

// derive file paths
var file_keystore = dir_project + '/secure/' + keystore_name;
console.log(chalk.yellow('file_keystore: ' + file_keystore));

var file_keystore_copy = dir_build_android + '/' + keystore_name;
console.log(chalk.yellow('file_keystore_copy: ' + file_keystore_copy));

var file_tarball = dir_build + '/' + project_name + '.tar.gz';
console.log(chalk.yellow('file_tarball: ' + file_tarball));

var file_apk_debug_unsigned = dir_build_android_apk + '/debug/android-debug.apk';
console.log(chalk.yellow('file_apk_debug_unsigned: ' + file_apk_debug_unsigned));

var file_apk_release_unsigned = dir_build_android_apk + '/release/android-release-unsigned.apk';
console.log(chalk.yellow('file_apk_release_unsigned: ' + file_apk_release_unsigned));

var file_apk_debug_unsigned_copy = project_name + '-debug-unsigned.apk';
console.log(chalk.yellow('file_apk_debug_unsigned_copy: ' + file_apk_debug_unsigned_copy));

var file_apk_release_unsigned_copy = project_name + '-release-unsigned.apk';
console.log(chalk.yellow('file_apk_release_unsigned_copy: ' + file_apk_release_unsigned_copy));

var file_apk_debug_signed = project_name+'-debug-signed.apk';
console.log(chalk.yellow('file_apk_debug_signed: ' + file_apk_debug_signed));

var file_apk_release_signed = project_name+'-release-signed.apk';
console.log(chalk.yellow('file_apk_release_signed: ' + file_apk_release_signed));

var file_apk_debug_optimised = project_name + '-debug.apk';
console.log(chalk.yellow('file_apk_debug_optimised: ' + file_apk_debug_optimised));

var file_apk_release_optimised = project_name + '-release.apk';
console.log(chalk.yellow('file_apk_release_optimised: ' + file_apk_release_optimised));

// check projects folder
if (!shell.test('-d', dir_projects)) {
  var msg = 'projects folder does not exist:'+ dir_projects
  console.log(chalk.red(msg))
  throw(msg)
}
else {
  console.log(chalk.yellow('projects folder exists:' + dir_projects))
}

// check project folder
if (!shell.test('-d', dir_project)) {
  var msg = 'project folder does not exist:'+ dir_project
  console.log(chalk.red(msg))
  throw(msg)
}
else {
  console.log(chalk.yellow('project folder exists:' + dir_project))
}

// create build directory
if (shell.test('-d', dir_build)) {
  console.log(chalk.yellow('build folder exists: ' + dir_build));
}
else {
  shell.mkdir(dir_build);
  console.log(chalk.yellow('build folder created: ' + dir_build));
}

// remove old build folder of this project
shell.rm('-rf', dir_build_project);
console.log(chalk.yellow('removed project build directory: ' + dir_build_project));

// create build directory for this project
shell.mkdir(dir_build_project);
console.log(chalk.yellow('created project build directory: ' + dir_build_project));

// build meteor project for iOS and Android platforms
console.log(chalk.yellow('starting build in ' + dir_build_project +
    ' for server ' + server_address));
shell.exec('meteor build ' + dir_build_project +' --server ' + server_address);
console.log(chalk.black.bgGreen('completed build for server: ' + server_address));

// // copy the keystore from the secure folder to the project build folder
shell.cp(file_keystore, file_keystore_copy);
console.log(chalk.yellow('copied' + file_keystore + 'to ' + file_keystore_copy));

// go to android build directory
shell.cd(dir_build_android);
console.log(chalk.yellow('changed directory to ' + dir_build_project));

// copy the unsigned debug apk
shell.cp(file_apk_debug_unsigned, file_apk_debug_unsigned_copy);
console.log(chalk.yellow('copied debug unsigned apk from ' + file_apk_debug_unsigned +
    ' to ' + file_apk_debug_unsigned_copy));

// copy the unsigned release apk
shell.cp(file_apk_release_unsigned, file_apk_release_unsigned_copy);
console.log(chalk.yellow('copied release unsigned apk from ' + file_apk_release_unsigned +
    ' to ' + file_apk_release_unsigned_copy));

// sign the unsigned release apk
console.log(chalk.yellow('starting signing of release apk using alias ' +
    keystore_alias_google_upload + ' in keystore ' + keystore_name));
console.log(chalk.yellow('jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 '+
    file_apk_release_unsigned_copy +' '+keystore_alias_google_upload + ' -keystore ' +
    keystore_name))
child_process.execFileSync('jarsigner', ['-verbose', '-sigalg', 'SHA1withRSA',
    '-digestalg', 'SHA1', file_apk_release_unsigned_copy, keystore_alias_google_upload,
    '-keystore', keystore_name], {stdio: 'inherit'});

// inform user of success
console.log(chalk.black.bgGreen('completed signing of release apk'));

// rename the unsigned release apk to signed apk
shell.mv(file_apk_release_unsigned, file_apk_release_signed);
console.log(chalk.yellow('renamed ' + file_apk_release_unsigned + ' to ' +
    file_apk_release_signed));

// optimise the signed release apk for android platform
var optimiseCmd = '$ANDROID_HOME/build-tools/28.0.3/zipalign 4 ' +
    file_apk_release_signed + ' ' + file_apk_release_optimised;
console.log(chalk.yellow('optimiseCmd: ' + optimiseCmd));
shell.exec(optimiseCmd);
console.log(chalk.black.bgGreen('completed optimization of release apk'));

// ??? remove release unsigned apk
// ??? remove release signed apk
// ??? remove keystore - not needed, it is encrypted...

// ??? copy release apk to repo resources

// go to project directory
shell.cd(dir_project);
console.log(chalk.yellow('changed directory to ' + dir_build_project));
