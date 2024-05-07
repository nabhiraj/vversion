#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { currentDir,setCurrentDir } from './fileUtils';
import { applyInit } from './commands/init';
import { getStatus } from './commands/status';
import {addResource} from './commands/addResource';
import { createCommit } from './commands/createCommit';
import { viewLogs } from './commands/viewLogs';
import { revert } from './commands/revertCommit';
import { checkoutBranch } from './commands/checkout';
import { merge } from './commands/mergeLogic';



if (process.argv.length >= 3){
    let command = process.argv[2];
    if(command == 'init'){
        applyInit();
    }else if (command == 'status'){
        setCurrentDir();
        getStatus();
    }else if (command == 'add'){
        addResource();
    }else if (command == 'commit'){
        setCurrentDir();
        createCommit();
    }else if (command == 'logs'){
        setCurrentDir();
        viewLogs();
    }else if(command == 'revert'){
        setCurrentDir();
        if(process.argv.length == 4){
            revert(process.argv[3]);
        }else{
            console.log('issue with input format');
        }
    }else if(command == 'checkout'){
        setCurrentDir();
        if(process.argv.length > 3 ){
            let targetBranch = process.argv[3];
            let srcBranch = process.argv.length >= 5? process.argv[4] : 'main';
            checkoutBranch(targetBranch,srcBranch);
        }else{
            console.log('issue with input format');
        }
    }else if(command == 'merge'){
        setCurrentDir();
        if(process.argv.length == 4){
            merge(process.argv[3]);
        }else{
            console.log('format of the input is wrong');
        }
    }else{
        console.log('this command is not recognised');
    }



}else{
    console.log('acha se argument daalo bhai....');
}