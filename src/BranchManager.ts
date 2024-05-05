import * as fs from 'fs';
import {getFileNameFromBranch,getJsonFromFile,createJsonFile,currentDir,getHashFromData} from './fileUtils';
import { StageManager } from './StageManager';

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
        createJsonFile(getFileNameFromBranch(this.getCurrentBranchName()), data);
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
    
    getNextCommitHash(state:any,branchInfo:any){
        let data = '';
        for(let key in state){
            data += state[key].lastHash;
        }
        if (branchInfo.commits && branchInfo.commits.length > 0){
            data += branchInfo.commits[branchInfo.commits.length - 1].commitVersion;
        }
        return getHashFromData(data);
    }

    createCommit(commitMessage = 'default commit message'){
        let sm = new StageManager();
        sm.initStage();
        if(!sm.isChanged()){
            console.log('no change staged which can be commited');
            return false;
        }
        let state = sm.getStateCopy();
        for (let key in state){
            if(state[key].stageDiff.length > 0){
                state[key].diffs.push(state[key].stageDiff[0]);
            }
            delete state[key].stageDiff;
        }
        let branchInfo = this.getBranchInfo();
        let lastCommit = {
            "commitVersion": this.getNextCommitHash(sm,branchInfo),
            "commitMessage": commitMessage,
            "files": state
        };
        branchInfo.commits.push(lastCommit);
        this.setBranchInfo(branchInfo);
        let newState = branchInfo.commits[branchInfo.commits.length-1].files;
        for(let key in newState){
            newState[key].stageDiff = []
        }
        sm.setState(newState);
        sm.flushState();
        return true;
    }

}
