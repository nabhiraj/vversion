import { StageManager } from "./../StageManager";
import { BranchManager } from "../BranchManager";
export function getStatus(){
    let sm = new StageManager();
    sm.initStage();
    let temp = sm.getFilesStatus();
    let bm = new BranchManager();
    console.log('current branch name :: ',bm.getCurrentBranchName());
    console.log('file which are changed',temp.changed);
    console.log('files which are deleted',temp.deleted);
}