"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewLogs = void 0;
const BranchManager_1 = require("./../BranchManager");
function viewLogs() {
    let bm = new BranchManager_1.BranchManager();
    let branchInfo = bm.getBranchInfo();
    let res = branchInfo.commits.map((x) => { return { "Id": x.commitVersion, "message": x.commitMessage }; });
    for (let i = 0; i < res.length; i++) {
        console.log("-----");
        console.log("id :: ", res[i].Id);
        console.log("message :: ", res[i].message);
        console.log("-----");
    }
}
exports.viewLogs = viewLogs;
