import { BranchManager } from "../BranchManager";
import { StageManager } from "../StageManager";
import {getFileNameFromBranch,getJsonFromFile,getHashFromData} from "./../fileUtils";
import { revert } from "./revertCommit";

function getNextCommitHash(pathData:any,branchInfo:any){
    let data = '';
    for(let key in pathData){
        data += pathData[key].lastHash;
    }
    if (branchInfo.commits && branchInfo.commits.length > 0){
        data += branchInfo.commits[branchInfo.commits.length - 1].commitVersion;
    }
    return getHashFromData(data);
}

function createCommit(pathData:any,sourceBranch:string){
    let bm = new BranchManager();
    let branchInfo = bm.getBranchInfo();
    let lastCommit = {
        "commitVersion": getNextCommitHash(pathData,branchInfo),
        "commitMessage": "merge commit from banch " + sourceBranch,
        "files": pathData
    };
    branchInfo.commits.push(lastCommit);
    bm.setBranchInfo(branchInfo);
    let sm = new StageManager();
    sm.initStage();
    let newState = branchInfo.commits[branchInfo.commits.length-1].files;
    for(let key in newState){
        newState[key].stageDiff = []
    }
    sm.setState(newState);
    sm.flushState();
    let lastCommitId = branchInfo.commits[branchInfo.commits.length-1].commitVersion;
    revert(lastCommitId);
}

export function merge(sourceBranch:string){
    let bm = new BranchManager();
    if(!bm.branchExist(sourceBranch)){
        console.log('source branch does not exist',sourceBranch);
        return false;
    }
    let targetBranchInfo = bm.getBranchInfo();
    let sourceBranchInfo = getJsonFromFile(getFileNameFromBranch(sourceBranch));
    let compareMergeConflict = false;
    let targetCommitList = targetBranchInfo.commits;
    let sourceCommitList = sourceBranchInfo.commits;
    let lastCommonCommitAncestorIndex = -1;
    //console.log('the target commit list is ',targetCommitList.map((x:any)=>x.commitVersion));
    //console.log('source commit  list is ',sourceCommitList.map((x:any)=>x.commitVersion))

    if (targetCommitList.length <= sourceCommitList.length){
        for(let i=0;i<targetCommitList.length;i++){
            if(targetCommitList[i].commitVersion != sourceCommitList[i].commitVersion){
                compareMergeConflict = true;
                break;
            }else{
                lastCommonCommitAncestorIndex = i;
            }
        }
    }else{
        for(let i=0;i<sourceCommitList.length;i++){
            if(targetCommitList[i].commitVersion == sourceCommitList[i].commitVersion){
                lastCommonCommitAncestorIndex = i;
            }else{
                break;
            }
        }
        compareMergeConflict = true;
    }
    

    let lastSourceCommit  = sourceCommitList[sourceCommitList.length-1];
    if(compareMergeConflict){
        //control is not going inside this part.
        let commanFiles = sourceCommitList[lastCommonCommitAncestorIndex].files;
        let targetFiles = targetCommitList[targetCommitList.length - 1].files;
        let sourceFiles = lastSourceCommit.files;
        for(const path in commanFiles){
            if(
                (targetFiles[path] && !sourceFiles[path] ) || (sourceFiles[path] && !targetFiles[path]) ||
                (targetFiles[path] && sourceFiles[path] && 
                    (   
                        commanFiles[path].lastHash != targetFiles[path].lastHash && 
                        commanFiles[path].lastHash != sourceFiles[path].lastHash && 
                        targetFiles[path].lastHash!=sourceFiles[path].lastHash
                    )
                ) 
            
            ){
                console.log('there is a merge conflict in ',path);
                return false;
            }
        }
        for(const path in targetFiles){
            if (!lastSourceCommit.files[path] && !commanFiles[path]){
                lastSourceCommit.files[path] = targetFiles[path];
            }
        }
    }
        createCommit(lastSourceCommit.files,sourceBranch);
}