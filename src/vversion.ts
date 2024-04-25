#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

function getStartingDirectory(): string | null {
    let currentDir: string = process.cwd();
    while (true) {
        if (fs.existsSync(path.join(currentDir, '.vversion'))) {
            return currentDir;
        } else {
            let parentDir: string = path.dirname(currentDir);
            if (parentDir === currentDir) { // Check if it's the root directory
                return null;
            } else {
                process.chdir(parentDir);
                currentDir = parentDir;
            }
        }
    }
}

console.log(getStartingDirectory())