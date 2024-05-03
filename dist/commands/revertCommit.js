"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revert = void 0;
const BranchManager_1 = require("../BranchManager");
const fileUtils_1 = require("../fileUtils");
const fs = __importStar(require("fs"));
function revert(commitId) {
    let bm = new BranchManager_1.BranchManager();
    let branchInfo = bm.getBranchInfo();
    let enviomentList = branchInfo.commits.filter((x) => x.commitVersion == commitId);
    if (enviomentList.length) {
        let selectedEnv = enviomentList[0].files;
        let allExistingFiles = (0, fileUtils_1.listFiles)('.', '.vversion');
        console.log('we will be deleting the follwoing files', allExistingFiles);
        for (let i = 0; i < allExistingFiles.length; i++) {
            fs.unlinkSync(allExistingFiles[i]);
        }
        (0, fileUtils_1.deleteDirectoriesExceptSync)('.vversion');
        for (let filePath in selectedEnv) {
            let diffsPathList = selectedEnv[filePath].diffs.map((x) => './.vversion/' + x);
            (0, fileUtils_1.constructFileFromDiffArray)(diffsPathList, filePath);
        }
    }
    else {
        console.log('required commit id not found in branch info');
    }
}
exports.revert = revert;
