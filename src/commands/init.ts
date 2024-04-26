import {BranchManager} from './../BranchManager';
import {currentDir} from './../fileUtils';
import * as fs from 'fs';

export function applyInit(){
    let bm = new BranchManager();
    if(!fs.statSync('.vversion').isDirectory()){
        fs.mkdirSync('.vversion');
    }
    if (currentDir == null){
        process.exit();
    }
    if (!bm.branchExist('main')){
       bm.createBranch('main',null); 
       bm.setCurrentBranch('main')
    }
    return true;
}