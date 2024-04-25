import * as fs from 'fs';

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
