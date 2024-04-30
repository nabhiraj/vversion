#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { currentDir,setCurrentDir } from './fileUtils';
import { applyInit } from './commands/init';
import { getStatus } from './commands/status';
import {addResource} from './commands/addResource';
import { createCommit } from './commands/createCommit';



if (process.argv.length >= 3){
    let command = process.argv[2];
    //now one by one we will write the code to execute the commands which we are supporting for the vversion software.
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
    } 



}else{
    console.log('acha se argument daalo bhai....');
}