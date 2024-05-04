import { BranchManager } from "../BranchManager";
import { revert } from "./revertCommit";
export function checkoutBranch(targetBranch:string,srcBranch:string|null){
    let bm = new BranchManager();
    let currentBranch = bm.getCurrentBranchName();
    if (currentBranch === targetBranch){
        console.log('already on the same branch.');
        return;
    }
    
    if(!bm.branchExist(targetBranch)){
        console.log('creating the new branch');
        bm.createBranch(targetBranch,srcBranch);
    }
    console.log('switching to the new branch');
    bm.setCurrentBranch(targetBranch);
    let branchInfo = bm.getBranchInfo();
    let lastCommitId = branchInfo.commits[branchInfo.commits.length-1].commitVersion;
    revert(lastCommitId);
}