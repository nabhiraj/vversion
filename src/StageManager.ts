import * as fs from 'fs';
import * as path from 'path';
import { getJsonFromFile,createJsonFile } from './fileUtils';
export class StageManager{
    state:any;
    statePath:string = './.vversion/stage/state.json';
    stageDirPath:string = './.vversion/stage';

    listFiles(dir: string,exludeDir:string): string[] {
        let files: string[] = [];
        
        const dirContents = fs.readdirSync(dir);
        dirContents.forEach(item => {
            const itemPath = path.join(dir, item);
            const stat = fs.statSync(itemPath);
            
            if (stat.isDirectory()) {
                if(item != exludeDir){
                    files = files.concat(this.listFiles(itemPath,exludeDir));
                }
            } else {
                files.push(itemPath);
            }
        });
        
        return files;
    }
    
    loadStage(){
        if(fs.existsSync(this.statePath)){
            this.state = getJsonFromFile(this.statePath);
            console.log('ths state something looks like this',this.state);
        }else{
            this.state = {}
            fs.mkdirSync(this.stageDirPath, { recursive: true });
            createJsonFile(this.statePath, this.state);
        }
    }

    findFilesWithDifference(){
        let allFiles = this.listFiles('.','.vversion')
        //now we need to calculate the hash of these files.
    }
}