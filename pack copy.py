
class Box:
   
    def __init__(self, w, d, h):
        self.w = w
        self.d = d
        self.h = h
        self.vol = w*d*h

    def maxFaceArea(self):
        if self.w*self.d>=self.w*self.h and self.w*self.d>=self.d*self.h:
            return self.w*self.d, 0
        elif self.d*self.h>=self.w*self.h and self.d*self.h>=self.d*self.w:
            return self.d*self.h, 1
        elif self.h*self.w>=self.d*self.h and self.h*self.w>=self.d*self.w:
            return self.h*self.w, 2

    def rotate(self, roval):
        if roval == 0:
            pass
        elif roval == 1:
            self.w, self.d, self.h = self.d, self.h, self.w
        elif roval == 2:
            self.w, self.d, self.h = self.h, self.w, self.d

    def rotate2D(self):
        self.w, self.d = self.d, self.w

    def __str__(self) -> str:
        return str(self.w)+","+str(self.d)+","+str(self.h)

class Space:
   
    def __init__(self, xbeg, xend, ybeg, yend):
        self.xbeg = xbeg
        self.xend = xend
        self.ybeg = ybeg
        self.yend = yend

    def findIntersectingSpace(self, s):#returns interects, spaceIfIntesects
        # pass
        # find xbeg, ybeg, xend, yend of (self intesect s)
        if self.xbeg>=s.xend or self.xend<=s.xbeg:
            return False, None
        elif self.ybeg>=s.yend or self.yend<=s.ybeg:
            return False, None
        else:
            xarr = []
            yarr = []
            xarr.append(self.xbeg)
            xarr.append(self.xend)
            xarr.append(s.xbeg)
            xarr.append(s.xend)
            yarr.append(self.ybeg)
            yarr.append(self.yend)
            yarr.append(s.ybeg)
            yarr.append(s.yend)
            xarr.sort()
            yarr.sort()
            return True, Space(xarr[1],xarr[2],yarr[1],yarr[2])
            

    def findSpaceLeftAfterOverlap(self, s):
        # pass
        # come up with 4 empty spaces around s
        emptySpaceArray = []
        if (s.xend<self.xend):
            emptySpaceArray.append(Space(s.xend,self.xend,self.ybeg,self.yend))
        if (s.xbeg>self.xbeg):
            emptySpaceArray.append(Space(self.xbeg,s.xbeg,self.ybeg,self.yend))
        if (s.yend<self.yend):
            emptySpaceArray.append(Space(self.xbeg,self.xend,s.yend,self.yend))
        if (s.ybeg>self.ybeg):
            emptySpaceArray.append(Space(self.xbeg,self.xend,self.ybeg,s.ybeg))
        return emptySpaceArray

class Level:
    def __init__(self, levelHeight, index):
        self.levelHeight = levelHeight
        self.index = index
        self.boxesInLevel = []

    def __str__(self) -> str:
        ret = "level index: "+str(self.index)
        ret += "\n"
        ret += "level height: "+str(self.levelHeight)
        for b in self.boxesInLevel:
            ret += "\n"
            ret += str(b)
        return ret

class BoxesInLevel:
    def __init__(self, box, boxx, boxy):
        self.box = box
        self.boxx = boxx
        self.boxy = boxy
    
    def __str__(self) -> str:
        ret = str(self.box)
        ret += " at "
        ret += "xpos: " + str(self.boxx)
        ret += " and "
        ret += "ypos: " + str(self.boxy)
        return ret

def volReturner(e):
    return e.vol

def canfit(box, space, height):
    W = space.xend - space.xbeg
    D = space.yend - space.ybeg
    H = height
    if (box.vol>W*D*H):
        return False, None, None
    b = Box(box.w,box.d,box.h)
    if (b.w<=W and b.d<=D and b.h<=H):
        return True, 0, 0
    b.rotate2D()
    if (b.w<=W and b.d<=D and b.h<=H):
        return True, 0, 1
    b.rotate2D()
    b.rotate(1)
    if (b.w<=W and b.d<=D and b.h<=H):
        return True, 1, 0
    b.rotate2D()
    if (b.w<=W and b.d<=D and b.h<=H):
        return True, 1, 1
    b.rotate2D()
    b.rotate(1)
    if (b.w<=W and b.d<=D and b.h<=H):
        return True, 2, 0
    b.rotate2D()
    if (b.w<=W and b.d<=D and b.h<=H):
        return True, 2, 1
    return False, None, None

def laffPack(setOfBoxes, containerBox): #return possible, vol utilized, levelArray
    totalVolumeOfBoxes = 0
    for b in setOfBoxes:
        totalVolumeOfBoxes += b.vol
    currentIndex = 0
    currentIndexHeight = 0
    levelArray = []
    while True:
        # if no boxes remain, return true, vol utilized and exit
        if (len(setOfBoxes)==0):
            return True, (totalVolumeOfBoxes/containerBox.vol), levelArray
        # find the box with the largest footprint (then min height)
        i = 0
        lfp = 0
        lfpi = -1
        while i<len(setOfBoxes):
            # i += 1
            cfp, rot = setOfBoxes[i].maxFaceArea()
            setOfBoxes[i].rotate(rot)
            if (cfp>lfp):
                lfp = cfp
                lfpi = i
            elif (cfp==lfp and setOfBoxes[lfpi].h>setOfBoxes[i].h):
                lfpi = i
            i+=1

        # if boxes remain, but the one with largest footprint exceeds height, then return false, _ and exit
        if (currentIndexHeight + setOfBoxes[lfpi].h > containerBox.h):
            return False, None, None
        # place that box in this level, remove it from setOfBoxes
        lfpBox = setOfBoxes.pop(lfpi)
        heightInCurrentIndex = lfpBox.h
        currentLevel = Level(currentIndexHeight, currentIndex)
        currentIndex += 1
        currentIndexHeight += heightInCurrentIndex
        currentLevel.boxesInLevel.append(BoxesInLevel(lfpBox, 0 , 0))
        emptySpaceArray = []
        currentBoxBeingAdded = Space(0,lfpBox.w,0,lfpBox.d)
        emptySpaceArray.append(Space(0,containerBox.w,0,containerBox.d))
        while True:
        # pass
        # fill remaining space:
            # update the array of available space
            if (len(setOfBoxes)==0):
                levelArray.append(currentLevel)
                break 
            j = 0
            newEmptySpaceArray = []
            while (j<len(emptySpaceArray)):
                doesIntersect, intesectSpace = emptySpaceArray[j].findIntersectingSpace(currentBoxBeingAdded)
                if (doesIntersect):
                    newSpaces = emptySpaceArray[j].findSpaceLeftAfterOverlap(intesectSpace)
                    for sp in newSpaces:
                        newEmptySpaceArray.append(sp)
                else:
                    newEmptySpaceArray.append(emptySpaceArray[j])
                j += 1
            emptySpaceArray = newEmptySpaceArray
            if (len(emptySpaceArray)==0):
                levelArray.append(currentLevel)
                break 
            # select max volume box which will fit
            setOfBoxes.sort(reverse=True,key=volReturner)
            foundSomeBoxWhichFits = False
            k = 0
            while (k<len(setOfBoxes)):
                l = 0
                while (l<len(emptySpaceArray)):
                    # print (emptySpaceArray[l])
                    fitVal, rot3d, rot2d = canfit(setOfBoxes[k], emptySpaceArray[l], heightInCurrentIndex)
                    if fitVal:
                        foundSomeBoxWhichFits = True
                        currBox = setOfBoxes.pop(k)
                        x = emptySpaceArray[l].xbeg
                        y = emptySpaceArray[l].ybeg
                        # rotate box
                        currBox.rotate(rot3d)
                        if (rot2d == 1):
                            currBox.rotate2D()
                        currentBoxBeingAdded = Space(x,x+currBox.w,y,y+currBox.d)
                        currentLevel.boxesInLevel.append(BoxesInLevel(currBox, x , y))
                        break
                    l += 1
                if (foundSomeBoxWhichFits == True):
                    break
                k += 1
            # if no box is able to fit in any of the space, exit fill remaining space
            if (foundSomeBoxWhichFits == False):
                levelArray.append(currentLevel)
                break 

        # increment a level

import random

def __main__():
    setOfBoxes = []

    # setOfBoxes.append(Box(25,25,14))
    # setOfBoxes.append(Box(25,25,14))
    # setOfBoxes.append(Box(25,25,14))
    # setOfBoxes.append(Box(25,25,14))
    for i in range(10):
        setOfBoxes.append(Box(random.randint(5,15),random.randint(5,15),random.randint(6,14)))

    container = Box(20,20,35)

    val, volUtilized, levelArray = laffPack(setOfBoxes, container)

    print (val)
    print (volUtilized)
    for lev in levelArray:
        print (lev)
    # for b in setOfBoxes:
    #     print(b)
    # laffPack(setOfBoxes)

rBox = []
cBox = []
ssBox = []
watchBox = []
othercBox = []

allSmallBoxes = []
allBigBoxes = []

def readcsv():
    import csv
    with open('rBox.csv', 'r') as file:
        rBox_ = csv.DictReader(file)
        for row in rBox_:
            rBox.append(Box(float(row['W']),float(row['D']),float(row['H'])))

    with open('cBox.csv', 'r') as file:
        cBox_ = csv.DictReader(file)
        for row in cBox_:
            cBox.append(Box(float(row['W']),float(row['D']),float(row['H'])))

    with open('ssBox.csv', 'r') as file:
        ssBox_ = csv.DictReader(file)
        for row in ssBox_:
            ssBox.append(Box(float(row['W']),float(row['D']),float(row['H'])))

    with open('watchBox.csv', 'r') as file:
        watchBox_ = csv.DictReader(file)
        for row in watchBox_:
            watchBox.append(Box(float(row['W']),float(row['D']),float(row['H'])))

    with open('othercBox.csv', 'r') as file:
        othercBox_ = csv.DictReader(file)
        for row in othercBox_:
            othercBox.append(Box(float(row['W']),float(row['D']),float(row['H'])))

    # allBigBoxes = cBox + othercBox
    # allSmallBoxes = rBox + ssBox + watchBox

    # for row in allSmallBoxes:
    #     print(row)


def readtodf():
    import pandas as pd
    df = pd.read_csv ('cBox.csv')
    # print(df['W'].iloc(0))

def keyGiver(k):
    return (k[1])

def actualdata():
    setOfBoxes = []
    allBigBoxes = cBox + othercBox
    allSmallBoxes = rBox + ssBox + watchBox
    for row in allBigBoxes:
        print(row)
    # setOfBoxes.append(Box(25,25,14))
    # setOfBoxes.append(Box(25,25,14))
    # setOfBoxes.append(Box(25,25,14))
    # setOfBoxes.append(Box(25,25,14))
    for i in range(5):
        index = random.randint(0,len(allSmallBoxes)-1)
        setOfBoxes.append(allSmallBoxes[index])

    totalVolOfBoxes = 0
    for b in setOfBoxes:
        totalVolOfBoxes = totalVolOfBoxes + b.vol

    utilizationArray = []
    atleastOneTrue = False
    for c in allBigBoxes:
        container = Box(c.w,c.d,c.h)
        setOfBoxes_ = []
        for b in setOfBoxes:
            setOfBoxes_.append(Box(b.w,b.d,b.h))

        val, volUtilized, levelArray = laffPack(setOfBoxes_, container)
        if (val):
            containerEffeciency = totalVolOfBoxes/((levelArray[-1].levelHeight+levelArray[-1].boxesInLevel[0].box.h)*container.w*container.d)
            atleastOneTrue = True
            utilizationArray.append([container,containerEffeciency])
        # print (val)
        # print (volUtilized)
        # for lev in levelArray:
        #     print (lev)
    print ("SetOfBoxes : ")
    for b in setOfBoxes:
        print (b)
    print ("___________________________________________")
    print ("isAnyTrue: ", atleastOneTrue)
    print ("___________________________________________")
    if (atleastOneTrue):
        utilizationArray.sort(reverse = True, key = keyGiver)
        for ua in utilizationArray:
            print (ua[0])
            print (ua[1])
    # for b in setOfBoxes:
    #     print(b)
    # laffPack(setOfBoxes)

# __main__()
readcsv()
readtodf()
actualdata()