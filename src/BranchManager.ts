import * as fs from 'fs';
import {getFileNameFromBranch,getJsonFromFile,createJsonFile,currentDir} from './fileUtils';


interface Data {
    IndexCounter: number;
    commits: any[];
}



export class BranchManager {



    branchExist(branchName: string): boolean {
        const branchFilePath = `${currentDir}/.vversion/${branchName}_branch.json`;
        return fs.existsSync(branchFilePath);
    }

    createBranch(targetBranch: string, srcBranch: string | null = 'main'): boolean {
        let data: Data = { IndexCounter: 0, commits: [] };
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

    getBranchInfo(){
        return getJsonFromFile(getFileNameFromBranch(this.getCurrentBranchName()));
    }

    setBranchInfo(data:any){
        createJsonFile(this.getCurrentBranchName()+'_branchg.json', data);
    }

    getNextIndex(){
        let data = this.getBranchInfo();
        let count = data.IndexCounter;
        data.IndexCounter++;
        this.setBranchInfo(data);
        return count;
    }

    getNextDiffFileName(){
        let index = this.getNextIndex();
        return this.getCurrentBranchName()+'_diff_'+index;
    }

}
