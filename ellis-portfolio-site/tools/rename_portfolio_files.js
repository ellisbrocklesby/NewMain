#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const folder = path.join(__dirname, '..', 'assets', 'portfolio');
const manifestPath = path.join(folder, 'manifest.json');

function slugifyName(name){
  return name
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9.\-\_]/g, '')
    .replace(/\-+/g, '-')
    .toLowerCase();
}

function main(){
  if(!fs.existsSync(folder)){
    console.error('Folder not found:', folder);
    process.exit(1);
  }
  const files = fs.readdirSync(folder).filter(f => f !== 'manifest.json');
  if(files.length === 0){
    console.log('No files to rename in', folder);
    return;
  }

  const mapping = [];
  files.forEach(f => {
    const oldPath = path.join(folder, f);
    const ext = path.extname(f);
    const base = path.basename(f, ext);
    const newBase = slugifyName(base) + ext.toLowerCase();
    const newPath = path.join(folder, newBase);

    if(oldPath === newPath){
      mapping.push({ old: f, new: f });
      return;
    }

    // avoid overwriting existing file
    let finalNewPath = newPath;
    let i = 1;
    while(fs.existsSync(finalNewPath)){
      const candidate = path.join(folder, slugifyName(base) + '-' + i + ext.toLowerCase());
      finalNewPath = candidate; i++;
    }

    fs.renameSync(oldPath, finalNewPath);
    mapping.push({ old: f, new: path.basename(finalNewPath) });
    console.log('Renamed:', f, '→', path.basename(finalNewPath));
  });

  // update manifest.json: list all files in folder (excluding manifest.json) as assets/portfolio/<name>
  const newFiles = fs.readdirSync(folder).filter(f => f !== 'manifest.json').map(f => 'assets/portfolio/' + f);
  fs.writeFileSync(manifestPath, JSON.stringify(newFiles, null, 2), 'utf8');
  console.log('Updated manifest.json with', newFiles.length, 'entries.');
  console.log('Done.');
}

main();
