from py3dbp import Packer, Bin, Item
import json

packer = Packer()

with open('bbox.json') as fp:
    data = json.load(fp)
    # print (data)
    for b in data:
        packer.add_bin(Bin(b['BoxCode'],b['W'],b['H'],b['D'],10))

sbox = {'arr':[]}

with open('sbox.json') as fp:
    data = json.load(fp)
    # print (data)
    for b in data:
        sbox['arr'].append(b)

# packer.add_bin(Bin('small-envelope', 11.5, 6.125, 0.25, 10))
# packer.add_bin(Bin('large-envelope', 15.0, 12.0, 0.75, 15))
# packer.add_bin(Bin('small-box', 8.625, 5.375, 1.625, 70.0))
# packer.add_bin(Bin('medium-box', 11.0, 8.5, 5.5, 70.0))
# packer.add_bin(Bin('medium-2-box', 13.625, 11.875, 3.375, 70.0))
# packer.add_bin(Bin('large-box', 12.0, 12.0, 5.5, 70.0))
# packer.add_bin(Bin('large-2-box', 23.6875, 11.75, 3.0, 70.0))

# packer.add_item(Item('50g [powder 1]', 3.9370, 1.9685, 1.9685, 1))
# packer.add_item(Item('50g [powder 2]', 3.9370, 1.9685, 1.9685, 2))
# packer.add_item(Item('50g [powder 3]', 3.9370, 1.9685, 1.9685, 3))
# packer.add_item(Item('250g [powder 4]', 7.8740, 3.9370, 1.9685, 4))
# packer.add_item(Item('250g [powder 5]', 7.8740, 3.9370, 1.9685, 5))
# packer.add_item(Item('250g [powder 6]', 7.8740, 3.9370, 1.9685, 6))
# packer.add_item(Item('250g [powder 7]', 7.8740, 3.9370, 1.9685, 7))
# packer.add_item(Item('250g [powder 8]', 7.8740, 3.9370, 1.9685, 8))
# packer.add_item(Item('250g [powder 9]', 7.8740, 3.9370, 1.9685, 9))

packer.pack()

for b in packer.bins:
    print(":::::::::::", b.string())

    print("FITTED ITEMS:")
    for item in b.items:
        print("====> ", item.string())

    print("UNFITTED ITEMS:")
    for item in b.unfitted_items:
        print("====> ", item.string())

    print("***************************************************")
    print("***************************************************")

from flask import Flask, redirect, url_for, request, jsonify
app = Flask(__name__)
 
 
@app.route('/success/<name>')
def success(name):
    return 'welcome %s' % name
 
 
@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        user = request.form['nm']
        return redirect(url_for('success', name=user))
    else:
        user = request.args.get('nm')
        return redirect(url_for('success', name=user))

@app.route('/pack', methods=['POST', 'GET'])
def getSBoxInfo():
    import json
    print(sbox)
    global packer
    packer = Packer()
    with open('bbox.json') as fp:
        data = json.load(fp)
        # print (data)
        for b in data:
            packer.add_bin(Bin(b['BoxCode'],b['W'],b['H'],b['D'],10))

    if request.method == 'POST':
        # readcsv()
        print(request.data)
        countList = None
        countList = json.loads(request.data.decode())
        print("Received data: ",countList["countArray"])
        setOfBoxes = []
        # if (not allBigBoxes or len(allBigBoxes)==0):
        # allBigBoxes = cBox + othercBox
        # if (not allSmallBoxes or len(allSmallBoxes)==0):
        # allSmallBoxes = rBox + ssBox + watchBox
        # print(rBox)
        # for row in allBigBoxes:
        #     print(row)
        # setOfBoxes.append(Box(25,25,14))
        # setOfBoxes.append(Box(25,25,14))
        # setOfBoxes.append(Box(25,25,14))
        # setOfBoxes.append(Box(25,25,14))
        setOfBoxes = []
        for i in range(len(countList["countArray"])):
            count = (countList["countArray"][i])
            if (count>0):
                for j in range(count):
                    packer.add_item(Item(sbox['arr'][i]['BoxCode']+"_"+str(j),sbox['arr'][i]['W'],sbox['arr'][i]['H'],sbox['arr'][i]['D'],0))
                    # setOfBoxes.append(Box(allSmallBoxes[i].w,allSmallBoxes[i].d,allSmallBoxes[i].h))

        totalVolOfBoxes = 0
        for b in setOfBoxes:
            totalVolOfBoxes = totalVolOfBoxes + b.vol

        utilizationArray = {}
        packer.pack()

        for b in packer.bins:
            print(":::::::::::", b.string())
            if (len(b.unfitted_items)==0):
                utilizationArray[b.name] = "Yes!"
            else:
                utilizationArray[b.name] = "No"

            print("FITTED ITEMS:")
            for item in b.items:
                print("====> ", item.string())

            print("UNFITTED ITEMS:")
            for item in b.unfitted_items:
                print("====> ", item.string())

            print("***************************************************")
            print("***************************************************")
        # atleastOneTrue = False
        # print ("size of allBigBoxes: ", len(allBigBoxes))
        # for c in allBigBoxes:
        #     container = Box(c.w,c.d,c.h)
        #     setOfBoxes_ = []
        #     for b in setOfBoxes:
        #         setOfBoxes_.append(Box(b.w,b.d,b.h))

        #     val, volUtilized, levelArray = laffPack(setOfBoxes_, container)
        #     if (val):
        #         containerEffeciency = totalVolOfBoxes/((levelArray[-1].levelHeight+levelArray[-1].boxesInLevel[0].box.h)*container.w*container.d)
        #         atleastOneTrue = True
        #         utilizationArray.append([containerEffeciency,totalVolOfBoxes/c.vol])
        #     else:
        #         utilizationArray.append([0,0])
        #     # print (val)
        #     # print (volUtilized)
        #     # for lev in levelArray:
        #     #     print (lev)
        # print ("SetOfBoxes : ")
        # for b in setOfBoxes:
        #     print (b)
        # print ("___________________________________________")
        # print ("isAnyTrue: ", atleastOneTrue)
        # print ("___________________________________________")
        # # if (atleastOneTrue):
        # #     # utilizationArray.sort(reverse = True, key = keyGiver)
        # #     for ua in utilizationArray:
        # #         print (ua[0])
        # #         print (ua[1])
        # # for b in setOfBoxes:
        # #     print(b)
        # # laffPack(setOfBoxes)
        # print(utilizationArray)
        rjson ={}
        rjson["ua"]=utilizationArray
        response = jsonify(utilizationArray)
        response.headers.add('Access-Control-Allow-Origin', '*')
        print(utilizationArray)
        return (response)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0' ,port=5001)