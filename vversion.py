#!/usr/bin/env python3
import sys
import os
import commanData
from BranchManager import *

#this code is also responsible for changing the existing direcotry
def getStartingDirectory():
    current_dir = os.getcwd()
    while True:
        if os.path.exists(os.path.join(current_dir, '.vversion')):
            return current_dir
        else:
            parent_dir = os.path.dirname(current_dir)
            if parent_dir == current_dir:  # Check if it's the root directory
                return None
            else:
                os.chdir(parent_dir)
                current_dir = parent_dir

#starting the execution from here.


#now this will be the part of the init method , command line arguments in python
if len(sys.argv) < 2:
    print('must pass some command')
    exit()

command = sys.argv[1]
bm = BranchManager()



if command != 'init':
    commanData.currentDir = getStartingDirectory()
    if commanData.currentDir == None:
        exit()



#we should move each command in a sperate folder.
if command == 'init':
    if not os.path.exists('.vversion'):
        os.makedirs('.vversion')
    commanData.currentDir = getStartingDirectory()
    if commanData.currentDir == None:
        exit()
    if bm.branchExist('main') == False:
        bm.createBranch(targetBranch="main",srcBranch=None)
        bm.setCurrentBranch(branch="main")




