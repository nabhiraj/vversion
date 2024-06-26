import * as fs from 'fs';
import * as path from 'path';
import { getJsonFromFile,createJsonFile,getHash,getFileNameFromBranch,constructFileFromDiffArray,createDiffFile,listFiles} from './fileUtils';
import { BranchManager } from './BranchManager';
export class StageManager{
    state:any;
    statePath:string = './.vversion/state.json';
    
    setState(state:any){
        this.state = state;
    }

    flushState(){
        createJsonFile(this.statePath,this.state);
    }

    getStateCopy(){
        return JSON.parse(JSON.stringify(this.state));
    }

    getState(){
        return this.state;
    }

    isChanged(){
        for(let key in this.state){
            if(this.state[key].stageDiff && this.state[key].stageDiff.length){
                return true;
            }
        }
        return false;
    }
    
    initStage(){
        if(fs.existsSync(this.statePath)){
            this.state = getJsonFromFile(this.statePath);
        }else{
            this.state = {};
            let bm = new BranchManager();
            let branchInfo = bm.getBranchInfo();
            if(branchInfo.commits.length > 0){
                this.state = branchInfo.commits[branchInfo.commits.length-1].files
                for(let key in this.state){
                    this.state[key].stageDiff = []
                }
            } 
            createJsonFile(this.statePath, this.state);
        }
    }

    getFilesStatus(){
        let allFiles = listFiles('.','.vversion');
        let filesChanges = [];
        let filesNotChanged = [];
        let filesDeleted = [];
        for(let i=0;i<allFiles.length;i++){
            let file = allFiles[i];
            if(!this.state[file] || (this.state[file] && this.state[file].lastHash != getHash(file))){
                filesChanges.push(file);
            }else{
                filesNotChanged.push(file);
            }
        }
        for(let key in this.state){
            if(!allFiles.includes(key)){
                filesDeleted.push(key);
            } 
        }
        return {'changed':filesChanges,'nochange':filesNotChanged,'deleted':filesDeleted};
    }

    addFile(filePath:string){
        if(fs.existsSync(filePath)){
            let newHash = getHash(filePath);
            if (this.state[filePath] && this.state[filePath].lastHash == newHash) return false;
            let bm = new BranchManager();
            let diffFileName = bm.getNextDiffFileName();
            if(!this.state[filePath]){
                createDiffFile(null,filePath,'./.vversion/'+diffFileName);
                this.state[filePath] = {"lastHash":newHash,"diffs":[],"stageDiff":[diffFileName]}
            }else{
                let diffArr = JSON.parse(JSON.stringify(this.state[filePath].diffs));
                diffArr = diffArr.map( (x:any) => './.vversion/'+x);
                let previousDiffFileName = null;
                if (this.state[filePath].stageDiff.length > 0){
                    previousDiffFileName = this.state[filePath].stageDiff[0];
                }
                constructFileFromDiffArray(diffArr,'./.vversion/temp988');
                createDiffFile('./.vversion/temp988',filePath,'./.vversion/'+diffFileName);
                this.state[filePath].lastHash = newHash;
                this.state[filePath].stageDiff = [diffFileName];
                fs.unlinkSync('./.vversion/temp988');
                if(previousDiffFileName != null){
                    fs.unlinkSync('./.vversion/'+previousDiffFileName);
                }
            }
            this.flushState();
        }else{
            if(this.state[filePath]){
                delete this.state[filePath];
                this.flushState();
            }else{
                console.log('some input is wrong');
            }
            return false;
        }
    }

    resetStage(){
        let bm = new BranchManager();
        let branchInfo = bm.getBranchInfo();
        let lastCommitFiles = branchInfo.commits[branchInfo.commits.length-1].files;
        this.state = JSON.parse(JSON.stringify(lastCommitFiles));
        for(const path in this.state){
            this.state[path].stageDiff = [];
        }
        this.flushState();
    }

}