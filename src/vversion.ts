#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { currentDir,setCurrentDir } from './fileUtils';
import { applyInit } from './commands/init';
import { getStatus } from './commands/status';



if (process.argv.length >= 3){
    let command = process.argv[2];
    if(command != 'init'){
        setCurrentDir();
        if(currentDir == null){
            console.log('no version related information found');
            process.exit(0);
        }
    }

    //now one by one we will write the code to execute the commands which we are supporting for the vversion software.
    if(command == 'init'){
        applyInit();
    }else if (command == 'status'){
        getStatus();
    }



}else{
    console.log('acha se argument daalo bhai....');
}