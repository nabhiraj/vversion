import * as fs from 'fs';
import * as path from 'path';
import { getJsonFromFile,createJsonFile,getHash,getFileNameFromBranch,constructFileFromDiffArray,createDiffFile} from './fileUtils';
import { BranchManager } from './BranchManager';
export class StageManager{
    state:any;
    statePath:string = './.vversion/state.json';

    listFiles(dir: string,exludeDir:string): string[] {
        let files: string[] = [];
        const dirContents = fs.readdirSync(dir);
        dirContents.forEach(item => {
            const itemPath = path.join(dir, item);
            const stat = fs.statSync(itemPath);
            if (stat.isDirectory()) {
                if(item != exludeDir){
                    files = files.concat(this.listFiles(itemPath,exludeDir));
                }
            } else {
                files.push(itemPath);
            }
        });
        return files;
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

    flushState(){
        createJsonFile(this.statePath,this.state);
    }

    getFilesStatus(){
        let allFiles = this.listFiles('.','.vversion');
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
                let previousDiffFileName = this.state[filePath].stageDiff[0];
                constructFileFromDiffArray(diffArr,'./.vversion/temp988');
                createDiffFile('./.vversion/temp988',filePath,'./.vversion/'+diffFileName);
                this.state[filePath].lastHash = newHash;
                this.state[filePath].stageDiff = [diffFileName];
                fs.unlinkSync('./.vversion/temp988');
                fs.unlinkSync('./.vversion/'+previousDiffFileName);
            }
            this.flushState();
        }else{
            return false;
        }
    }

    //we have to write the code to rollback all the changes.
    rollBackAllChanges(){

    }

}