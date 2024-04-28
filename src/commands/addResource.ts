import {StageManager} from './../StageManager';
import {setCurrentDir} from './../fileUtils';
import * as path from 'path';
export function addResource(){
    if(process.argv.length >= 4){
        let filePath = process.argv[3];
        let absPath = path.resolve(filePath);
        setCurrentDir();
        filePath = path.relative(process.cwd(), absPath);
        let sm = new StageManager();
        sm.initStage();
        sm.addFile(filePath);
    }else{
        console.log('problem with command giving format');
    }
}