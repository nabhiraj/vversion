import * as fs from 'fs';
import {getFileNameFromBranch,getJsonFromFile,createJsonFile} from './fileUtils';
interface CommonData {
    currentDir: string;
}

interface Data {
    version: number;
    commits: any[];
}



class BranchManager {
    commonData: CommonData;

    constructor(commonData: CommonData) {
        this.commonData = commonData;
    }

    branchExist(branchName: string): boolean {
        console.log('the value of common data is ', this.commonData.currentDir);
        const branchFilePath = `${this.commonData.currentDir}/.vversion/${branchName}_branch.json`;
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

    getCurrentBranch(): string {
        return this.getCurrentBranchName();
    }

    getCurrentBranchName(): string {
        const data = getJsonFromFile('./.vversion/currentBranch.json');
        return data.currentBranchName;
    }
}
