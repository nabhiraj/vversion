import * as fs from 'fs';
import * as path from 'path';

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
