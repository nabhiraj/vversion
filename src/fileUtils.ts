import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { execSync } from 'child_process';

export let  currentDir:string|null = '';

export function getStartingDirectory(): string | null {
    let currentDir: string = process.cwd();
    while (true) {
        if (fs.existsSync(path.join(currentDir, '.vversion'))) {
            return currentDir;
        } else {
            let parentDir: string = path.dirname(currentDir);
            if (parentDir === currentDir) { // Check if it's the root directory
                return null;
            } else {
                process.chdir(parentDir);
                currentDir = parentDir;
            }
        }
    }
}

export function setCurrentDir(){
    currentDir = getStartingDirectory();
    if(currentDir == null){
        console.log('no version related information found');
        process.exit(0);
    }
}

export function getFileNameFromBranch(srcBranch: string): string {
    return `./.vversion/${srcBranch}_branch.json`;
}

export function getJsonFromFile(file: string): any {
    try {
        const data = fs.readFileSync(file, 'utf-8');
        return JSON.parse(data);
    } catch (error:any) {
        if (error.code === 'ENOENT') {
            console.log(`File '${file}' not found.`);
        } else {
            console.log(`Error decoding JSON in file '${file}'.`);
        }
        return {};
    }
}

export function createJsonFile(filePath: string, data: any): boolean {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf-8');
        return true;
    } catch (error) {
        console.log(`Error writing JSON file '${filePath}'.`);
        return false;
    }
}

export function getHash(filePath: string): string {
    const fileData = fs.readFileSync(filePath);
    const hash = crypto.createHash('md5');
    hash.update(fileData);
    return hash.digest('hex');
}

export function createDiffFile(initialFilePath:string|null,changedFilePath:string,targetFilePath:string){
    let tempFileName: string | null = null;
    if (initialFilePath === null) {
        tempFileName = 'empty_old_file_782196.txt';
        createEmptyFile(tempFileName);
        initialFilePath = tempFileName;
    }
    let output:any;
    try {
        const command = `diff ${initialFilePath} ${changedFilePath}`;
        output = execSync(command, { encoding: 'utf-8' }); // Redirect stdout to pipe to avoid throwing errors
        console.log('the output value is ',output);
        fs.writeFileSync(targetFilePath,'');
    } catch (error:any) {
        if (error.status !== 1) { // 1 indicates differences, treat this as expected
            console.log('error in diff');
        }else{
            console.log('writing to the file');
            fs.writeFileSync(targetFilePath, error.stdout);
        }
    } finally {
        if (tempFileName !== null) {
            fs.unlinkSync(tempFileName);
        }
    }
}

function createEmptyFile(filePath: string): void {
    const directory = path.dirname(filePath);
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
    fs.writeFileSync(filePath, '');
}

export function addDiffFile(filePath:string,diffFilePath:string){
    if (!fs.existsSync(filePath)) {
        createEmptyFile(filePath);
    }
    const command = `patch ${filePath} ${diffFilePath}`;
    execSync(command);
}

export function constructFileFromDiffArray(diffFileList:string[],targetPath:string):boolean{
    try{
        for(let i=0;i<diffFileList.length;i++){
            addDiffFile(targetPath,diffFileList[i]);
        }
        return true;
    }catch(e){
        console.error('error occured while joing the dif files',e);
        return false;
    }
}


