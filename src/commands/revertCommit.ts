import { BranchManager } from "../BranchManager";
import { listFiles,deleteDirectoriesExceptSync,constructFileFromDiffArray } from "../fileUtils";
import * as fs from 'fs';

export function revert(commitId:string){
    let bm = new BranchManager();
    let branchInfo = bm.getBranchInfo();
    let enviomentList = branchInfo.commits.filter((x:any)=> x.commitVersion == commitId);
    if(enviomentList.length){
        let selectedEnv = enviomentList[0].files;
        let allExistingFiles = listFiles('.','.vversion');
        console.log('we will be deleting the follwoing files',allExistingFiles);
        for (let i=0;i<allExistingFiles.length;i++){
            fs.unlinkSync(allExistingFiles[i]);
        }
        deleteDirectoriesExceptSync('.vversion');
        for(let filePath in selectedEnv){
            let diffsPathList = selectedEnv[filePath].diffs.map((x:any) => './.vversion/'+x);
            constructFileFromDiffArray(diffsPathList,filePath);
        }
        //we need to create the new stage env.
    }else{
        console.log('required commit id not found in branch info');
    }
}