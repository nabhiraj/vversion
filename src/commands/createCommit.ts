import { BranchManager } from "./../BranchManager";
export function createCommit(){
    let message = '';
    for(let i=3;i<process.argv.length;i++){
        message += process.argv[i];
    }
    let bm = new BranchManager();
    bm.createCommit(message);    
}