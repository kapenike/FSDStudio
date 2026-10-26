<?php

require('app.php');

// NEVER change this url from what is set in the public repository!
const PROJECT = 'https://github.com/kapenike/FSDStudio/archive/main.zip';

// ignored files and directory paths
const IGNORE = [
	'./FSDStudio.hta',
	'./loader.gif',
	'./output.log',
	'./.git',
	'./apps/app_data',
	'./php',
	'./overlay_output',
	'./data',
	'./fonts',
	'./api/ext'
];

// #
echo "
____________________________    _________ __            .___.__        
\_   _____/   _____/\______ \  /   _____//  |_ __ __  __| _/|__| ____  
 |    __) \_____  \  |    |  \ \_____  \\   __\  |  \/ __ | |  |/  _ \ 
 |     \  /        \ |    `   \/        \|  | |  |  / /_/ | |  (  <_> )
 \___  / /_______  //_______  /_______  /|__| |____/\____ | |__|\____/ 
     \/          \/         \/        \/                 \/            
                                       #".strip_tags(file_get_contents('./version.txt'))."

Shutting down servers...
";

// shutdown all services
app('FSDStudio')->stop(['all']);

// #
echo "Initializing install...";

// stash current files
$current_files = app('directoryFileList')->get([], '.', IGNORE);

// if existing project import or temp directory exists remove it
if (file_exists('FSDStudio.zip')) {
	unlink('FSDStudio.zip');
}
if (is_dir('./temp')) {
	app('directoryFileList')->delete('./temp', false);
}

// #
echo "Downloading Git Repository...";

// download new project zip
file_put_contents('FSDStudio.zip', file_get_contents(PROJECT));

// create temp extract to dir
mkdir('./temp');

// extract project archive to a temporary directory
$zip = new ZipArchive;
if ($zip->open('./FSDStudio.zip') === true) {
	$zip->extractTo('./temp');
	$zip->close();
} else {
	echo "Failed to extract project archive. \n";
	exit;
}

// #
echo "Installing * ".strip_tags(file_get_contents('./temp/FSDStudio-main/version.txt'))."\n";

// get update file list and strip parent directory paths
$update_files = array_map(function ($n) {
	return './'.substr($n, 22);
}, app('directoryFileList')->get([], './temp', IGNORE));

// copy new files into current project
app('directoryFileList')->copyDir('./temp/FSDStudio-main','./');

// remove archive
unlink('FSDStudio.zip');

// remove temp directory
app('directoryFileList')->delete('./temp', false);

// look for any files that have been removed from the project since last update and remove
foreach (array_diff($current_files, $update_files) as $diff) {
	unlink($diff);
}

// remove server config
if (file_exists('./apps/app_data/server_data.json')) {
	unlink('./apps/app_data/server_data.json');
}

// #
echo "Installation complete! You may close this window and re-start your application.\n\n"

?>