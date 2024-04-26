import * as fs from 'fs';
import {getFileNameFromBranch,getJsonFromFile,createJsonFile,currentDir} from './fileUtils';


interface Data {
    version: number;
    commits: any[];
}



export class BranchManager {

    branchExist(branchName: string): boolean {
        const branchFilePath = `${currentDir}/.vversion/${branchName}_branch.json`;
        return fs.existsSync(branchFilePath);
    }

    createBranch(targetBranch: string, srcBranch: string | null = 'main'): boolean {
        let data: Data = { version: 0, commits: [] };
        if (srcBranch !== null) {
            const srcBranchFile = getFileNameFromBranch(srcBranch);
            data = getJsonFromFile(srcBranchFile);
        }
        const targetBranchFile = getFileNameFromBranch(targetBranch);
        return createJsonFile(targetBranchFile, data);
    }

    setCurrentBranch(branch: string): void {
        const data = { currentBranchName: branch };
        createJsonFile('./.vversion/currentBranch.json', data);
    }

    getCurrentBranchName(): string {
        const data = getJsonFromFile('./.vversion/currentBranch.json');
        return data.currentBranchName;
    }
}
