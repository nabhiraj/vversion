import {BranchManager} from './../BranchManager';
import {currentDir,setCurrentDir} from './../fileUtils';
import * as fs from 'fs';

export function applyInit(){
    let bm = new BranchManager();
    if(!fs.existsSync('./.vversion')){
        fs.mkdirSync('.vversion');
    }
    setCurrentDir();
    if (currentDir == null){
        process.exit();
    }
    if (!bm.branchExist('main')){
       bm.createBranch('main',null); 
       bm.setCurrentBranch('main')
    }
    return true;
}