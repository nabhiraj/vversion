import { BranchManager } from "./../BranchManager";
export function viewLogs(){
    let bm = new BranchManager();
    let branchInfo = bm.getBranchInfo();
    let res = branchInfo.commits.map((x:any)=> {return {"Id":x.commitVersion,"message":x.commitMessage} } );
    for(let i=0;i<res.length;i++){
        console.log("-----");
        console.log("id :: ",res[i].Id);
        console.log("message :: ",res[i].message);
        console.log("-----");
    }
}