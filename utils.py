import os
def findDiff(old_file_name,new_file_name,diff_file_name):
    cd='diff '+old_file_name+' '+new_file_name
    p=os.popen(cd)
    fp=open(diff_file_name,'w')
    for line in p.read():
        fp.write(line)
    fp.close()

def addDiff(accu_file,diff_file):#arguments cointain the complete path
    cd='patch '+accu_file+' '+diff_file
    p=os.popen(cd)
    for line in p.read():
        pass

#create_diff('joker.txt','abc.txt','diff.txt')
#add_the_difference('joker.txt','diff.txt')