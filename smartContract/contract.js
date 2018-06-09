"use strict";

var ProductItem = function(text){
    if(text){
        var obj = JSON.parse(text);
        this.belongToBuildingID = obj.belongToBuildingID; // 资源所属建筑
        this.productID = obj.productID;
        this.numOfProduct = obj.numOfProduct; // 该资源在该建筑中的数量
        this.productName = obj.productName;
        this.owner = obj.owner; // 资源所有者，用户钱包地址
    }else{
        this.belongToBuildingID = -1;//-1表示什么资源都不是
        this.productID = -1;
        this.numOfProduct = 0;
        this.productName = ''
        this.owner = '';
    }
};

var BuildingItem = function (text) {
    if (text) {
        var obj = JSON.parse(text);
        this.buildingID = obj.buildingID; // 建筑ID
        this.buildingType = obj.buildingType;
        this.owner = obj.owner; // 资源所有者，用户钱包地址
    } else {
        this.buildingID = -1;//-1表示什么资源都不是
        this.buildingType = '';
        this.owner = '';
    }
};

var RoadItem = function (text) {
    if (text) {
        var obj = JSON.parse(text);
        this.roadID = obj.roadID; // 道路ID
        this.owner = obj.owner; // 资源所有者，用户钱包地址
    } else {
        this.roadID = -1; //-1表示什么资源都不是
        this.owner = '';
    }
};

var TransactionItem = function (text) {
    if (text) {
        var obj = JSON.parse(text);
        this.transactionID = obj.transactionID;
        this.seller = obj.seller; // 卖家
        this.buyer = obj.buyer; // 买家
        this.state = obj.state; //交易状态
        this.time = obj.time; //交易发布时间
        this.stuffName = obj.stuffName; //卖的东西名称，村庄/城市/道路/木头等
        this.stuffID = obj.stuffID; //卖的东西的ID
        this.ammount = obj.ammount; //出售多少单位，卖建筑的话为1
        this.availableAmmount = obj.availableAmmount; //剩余多少单位，为0时这个东西不可以卖了
        this.price = obj.price; //卖的价格
    } else {
        this.transactionID = -1;
        this.seller = ''; // 卖家
        this.buyer = ''; // 买家
        this.state = '异常'; //交易状态
        this.time = ''; //交易发布时间
        this.stuffName = ''; //卖的东西名称，村庄/城市/道路/木头等
        this.stuffID = -1;
        this.ammount = -1;
        this.availableAmmount = -1;
        this.price = -1; //卖的价格
    }
};

// L改为大写了
var LuckyNumItem = function (text) {
    if (text) {
        var obj = JSON.parse(text);
        this.luckyNum = obj.luckyNum; // 幸运数字
        this.generateTime = obj.generateTime; //幸运数字生成时间
    } else {
        this.luckyNum = -1; // 幸运数字
        this.generateTime = 0; //幸运数字生成时间 时间戳默认是？？？
    }
};


/**
 * UserInfoItem 感觉可以删去
 */


ProductItem().prototype = {
    toString: function () {
        return JSON.stringify(this);
    }
};

BuildingItem().prototype = {
    toString: function () {
        return JSON.stringify(this);
    }
};

RoadItem().prototype = {
    toString: function () {
        return JSON.stringify(this);
    }
};

TransactionItem().prototype = {
    toString: function () {
        return JSON.stringify(this);
    }
};

LuckyNumItem().prototype = {
    toString: function () {
        return JSON.stringify(this);
    }
};


var TerritoryService = function () {
    LocalContractStorage.defineMapProperty(this, "data", {
        parse: function (text) {
            return JSON.parse(text);
        },
        stringify: function (o) {
            return JSON.stringify(o);
        }
    });

    // userID => all products of user
    LocalContractStorage.defineMapProperty(this, "productRepo", {
        parse: function (text) {
            return new productItem(text);
        },
        stringify: function (o) {
            return JSON.stringify(o);
        }
    });

    // userID => all buildings of user
    LocalContractStorage.defineMapProperty(this, "buildingRepo", {
        parse: function (text) {
            return new buildingItem(text);
        },
        stringify: function (o) {
            return JSON.stringify(o);
        }
    });

    // userID => all roads of user
    LocalContractStorage.defineMapProperty(this, "roadRepo", {
        parse: function (text) {
            return new userInfo(text);
        },
        stringify: function (o) {
            return JSON.stringify(o);
        }
    });

    // 卖家userID => all transactionItem
    LocalContractStorage.defineMapProperty(this, "transactionRepo", {
        parse: function (text) {
            return new userInfo(text);
        },
        stringify: function (o) {
            return JSON.stringify(o);
        }
    });

    LocalContractStorage.defineMapProperty(this, "luckyNumRepo", {
        parse: function (text) {
            return new luckyNum(text);
        },
        stringify: function (o) {
            return JSON.stringify(o);
        }
    });

};

TerritoryService.prototype = {
    init: function () {
        this.data.set('buildingID', 1); // 建筑ID
        this.data.set('productID',1); //资源ID
        this.data.set('roadID',1); //道路ID
        this.data.set('transactionID',1); //交易ID
        this.data.set('allBuildingList',[]);
        this.data.set('allProductList',[])
        this.data.set('allRoadList',[]);
        this.data.set('allTransactionList',[]);

        this.luckyNumRepo.set('luckyNumList',[]); //幸运数字列表

        // TODO: board
    },

    createBuilding:function (type) {

        var from = Blockchain.transaction.from;
        var index = this.data.get('buildingID');

        console.warn(index);

        // 判断用户是否拥有足够资源在前端执行
        var building = new BuildingItem();
        building.buildingID = index;
        building.buildingType = type;
        building.owner = from;

        var buildingOfUser = this.buildingRepo.get(from) || []; //用户拥有的所有building
        buildingOfUser.push(building);

        this.buildingRepo.set(from,buildingOfUser);
        
        this.data.set('buildingID',index+1); // buildingID++

        var allBuildings = this.data.get('allBuildingList');
        allBuildings.push(building);
        this.data.set('allBuildingList',allBuildings);  //更新所有的建筑

    },

    getAllBuildingByUser:function (wallet) {
        return this.buildingRepo.get(wallet);  //wallet即userID
    },

    getAllProductByUser:function (wallet) {
        return this.productRepo.get(wallet);
    },

    getAllRoadByUser:function (wallet) {
        return this.roadRepo.get(wallet);
    },

    //用于在交易所中展示
    getAllBuildings:function () {
        return this.data.get('allBuildingList');
    },

    getAllProducts:function () {
        return this.data.get('allProductList');
    },

    getAllRoads:function () {
        return this.data.get('allRoadList');
    },

    getAllTransactions:function () {
        return this.data.get('allTransactionList');
    },

    //扩建村庄
    changeVillageToCity:function (buildingID) {
        var allBuildings = this.data.get('allBuildingList');

        var target = 0; //要扩建的村庄

        //遍历所有的building，找到要扩建的建筑，没有用buildingID作为key，buildingItem作为value存储
        for(const item in allBuildings){
            if(item.buildingID == buildingID){
                item.buildingType = '城市';
                target = item;
                break;
            }
        }

        this.data.set('allBuildingList',allBuildings);

        var userBuildings = this.buildingRepo.get(target.owner);
        for(const item in userBuildings){
            if(item.buildingID == buildingID){
                item.buildingType = '城市';
                break;
            }
        }

        //还要处理一下 减少用户资源的问题
    },

    createRoad:function () {
        var from = Blockchain.transaction.from;
        var index = this.data.get('roadID');

        console.warn(index);

        // 判断用户是否拥有足够资源在前端执行
        var road = new RoadItem();
        road.roadID = index;
        road.owner = from;

        var roadOfUser = this.roadRepo.get(from) || []; //用户拥有的所有道路
        roadOfUser.push(road);

        this.roadRepo.set(from,roadOfUser);

        this.data.set('roadID',index+1); // roadID++

        var allRoads = this.data.get('allRoadList');
        allRoads.push(road);
        this.data.set('allRoadList',allRoads);  //更新所有的道路

        //道路在地图中的位置如何确定？
    },

    sellProduct:function (productID,productName,price,ammount) {
        var from = Blockchain.transaction.from;
        var index = this.data.get('transactionID');
        var time = Blockchain.block.timestamp;

        console.warn(index);

        // 判断用户是否拥有足够资源在前端执行
        var transaction = new TransactionItem();
        this.transactionID = index;
        this.seller = from; // 卖家
        this.buyer = ''; // 买家
        this.state = '可购买'; //交易状态
        this.time = time; //交易发布时间
        this.stuffName = productName; //卖的资源名称
        this.stuffID = productID;
        this.ammount = ammount;
        this.availableAmmount = ammount;
        this.price = price; //卖的价格

        var userTransactions = this.transactionRepo.get(from) || []; //用户发起的所有交易
        userTransactions.push(transaction);

        this.transactionRepo.set(from,userTransactions);

        this.data.set('transactionID',index+1); // transactionID++

        var allTransactions = this.data.get('allTransactionList');
        allTransactions.push(transaction);
        this.data.set('allTransactionList',allTransactions);  //更新所有的交易

        //减少卖家资源
        
        //现在就减少吗？还是有人买了再减少
        var userProducts = this.productRepo.get(from);
        for(const item in userProducts){
            if(item.productName == productName){
                item.numOfProduct -= ammount;
                break;
            }
        }

        this.productRepo.set(from,userProducts);
        
        //总资源守恒，this.data.get('allProductList')不用改
    },

    //type是村庄 or 城市
    sellBuilding:function (buildingID,type,price) {
        var from = Blockchain.transaction.from;
        var index = this.data.get('transactionID');
        var time = Blockchain.block.timestamp;

        console.warn(index);

        // 判断用户是否拥有足够资源在前端执行
        var transaction = new TransactionItem();
        this.transactionID = index;
        this.seller = from; // 卖家
        this.buyer = ''; // 买家
        this.state = '可购买'; //交易状态
        this.time = time; //交易发布时间
        this.stuffName = type; //卖的资源名称 村庄or城市
        this.stuffID = buildingID;
        this.ammount = 1;
        this.price = price; //卖的价格

        var userTransactions = this.transactionRepo.get(from) || []; //用户发起的所有交易
        userTransactions.push(transaction);

        this.transactionRepo.set(from,userTransactions);

        this.data.set('transactionID',index+1); // transactionID++

        var allTransactions = this.data.get('allTransactionList');
        allTransactions.push(transaction);
        this.data.set('allTransactionList',allTransactions);  //更新所有的交易

        //减少卖家建筑

        //现在就减少吗？还是有人买了再减少
        var userBuildings = this.buildingRepo.get(from);
        for(var i=0; i<userBuildings.length; i++){
            if(userBuildings[i].buildingID == buildingID){
                userBuildings.splice(i,1); //删除卖家拥有的这个建筑
                break;
            }
        }

        this.buildingRepo.set(from,userBuildings);

        //总资源守恒，this.data.get('allBuildingList')不用改
    },


    sellRoad:function (roadID,price) {
        var from = Blockchain.transaction.from;
        var index = this.data.get('transactionID');
        var time = Blockchain.block.timestamp;

        console.warn(index);

        // 判断用户是否拥有足够资源在前端执行
        var transaction = new TransactionItem();
        this.transactionID = index;
        this.seller = from; // 卖家
        this.buyer = ''; // 买家
        this.state = '可购买'; //交易状态
        this.time = time; //交易发布时间
        this.stuffName = '道路'+roadID; //卖的资源名称
        this.stuffID = roadID;
        this.ammount = 1;
        this.availableAmmount = 1;
        this.price = price; //卖的价格

        var userTransactions = this.transactionRepo.get(from) || []; //用户发起的所有交易
        userTransactions.push(transaction);

        this.transactionRepo.set(from,userTransactions);

        this.data.set('transactionID',index+1); // transactionID++

        var allTransactions = this.data.get('allTransactionList');
        allTransactions.push(transaction);
        this.data.set('allTransactionList',allTransactions);  //更新所有的交易

        //减少卖家道路
        //现在就减少
        var userRoads = this.roadRepo.get(from);
        for(var i=0; i<userRoads.length; i++){
            if(userRoads[i].roadID == roadID){
                userRoads.splice(i,1); //删除卖家拥有的这个道路
                break;
            }
        }

        this.roadRepo.set(from,userRoads);

        //总资源守恒，this.data.get('allRoadList')不用改

    },

    //可买家以一单位一单位地买
    //前端可以传入transactionID，以便后端根据ID找到这个交易，设置买家
    //transactionID在前端可以放置在一个隐藏的div里，在调用函数的时候从这个div取得transactionID
    purchaseProduct:function (seller,transactionID,productName,ammount) {
        var buyer = Blockchain.transaction.from;

        var allTransactionList = this.data.get('allTransactionList');
        for(const item in allTransactionList){
            if(item.transactionID == transactionID){
                item.buyer = buyer;
                item.availableAmmount -= ammount;
                if(item.availableAmmount<=0){  //前端要限制买家可以购买的数量单位，不可以超过卖家卖的单位
                    item.state = '交易成功';
                }
                break;
            }
        }

        var allSellerTransactions = this.transactionRepo.get(seller);
        for(const item in allSellerTransactions){
            if(item.transactionID == transactionID){
                item.buyer = buyer;
                item.availableAmmount -= ammount;
                if(item.availableAmmount<=0){  //前端要限制买家可以购买的数量单位，不可以超过卖家卖的单位
                    item.state = '交易成功';
                }
                break;
            }
        }

        //增加买家资源
        var userProducts = this.productRepo.get(buyer);
        for(const item in userProducts){
            if(item.productName == productName){
                item.numOfProduct += ammount;
                break;
            }
        }
    },


    purchaseBuilding:function (seller,transactionID,buildingID) {
        var buyer = Blockchain.transaction.from;

        var allTransactionList = this.data.get('allTransactionList');
        for(const item in allTransactionList){
            if(item.transactionID == transactionID){
                item.buyer = buyer;
                item.availableAmmount -= 1;
                if(item.availableAmmount<=0){  //前端要限制买家可以购买的数量单位，不可以超过卖家卖的单位
                    item.state = '交易成功';
                }
                break;
            }
        }

        var allSellerTransactions = this.transactionRepo.get(seller);
        for(const item in allSellerTransactions){
            if(item.transactionID == transactionID){
                item.buyer = buyer;
                item.availableAmmount -= 1;
                if(item.availableAmmount<=0){  //前端要限制买家可以购买的数量单位，不可以超过卖家卖的单位
                    item.state = '交易成功';
                }
                break;
            }
        }

        //增加买家建筑
        var targetBuilding = 0;
        //找到这个建筑
        var allBuildings = this.data.get('allBuildingList');
        for(const item in allBuildings){
            if(item.buildingID == buildingID){
                targetBuilding = item;
                break;
            }
        }

        var userBuildings = this.buildingRepo.get(buyer);
        userBuildings.push(targetBuilding);

        this.buildingRepo.set(from,userBuildings);
    },


    purchaseRoad:function (seller,transactionID,roadID) {
        var buyer = Blockchain.transaction.from;

        var allTransactionList = this.data.get('allTransactionList');
        for(const item in allTransactionList){
            if(item.transactionID == transactionID){
                item.buyer = buyer;
                item.availableAmmount -= 1;
                if(item.availableAmmount<=0){  //前端要限制买家可以购买的数量单位，不可以超过卖家卖的单位
                    item.state = '交易成功';
                }
                break;
            }
        }

        var allSellerTransactions = this.transactionRepo.get(seller);
        for(const item in allSellerTransactions){
            if(item.transactionID == transactionID){
                item.buyer = buyer;
                item.availableAmmount -= 1;
                if(item.availableAmmount<=0){  //前端要限制买家可以购买的数量单位，不可以超过卖家卖的单位
                    item.state = '交易成功';
                }
                break;
            }
        }

        //增加买家道路
        var targetRoad = 0;
        //找到这个道路
        var allRoads = this.data.get('allRoadList');
        for(const item in allRoads){
            if(item.roadID == roadID){
                targetRoad = item;
                break;
            }
        }

        var userRoads = this.roadRepo.get(buyer);
        userRoads.push(targetRoad);

        this.roadRepo.set(from,userRoads);
    },

    //记录产生的幸运数字
    recordLuckyNumber: function(luckyNum) {
        var luckyNums = this.luckyNumRepo.get('luckyNumList');

        var timestamp = Date.parse(new Date()); //获取当前时间戳
        // var time = Blockchain.block.timestamp;

        var luckyNumItem = new LuckyNumItem();
        luckyNumItem.luckyNum = luckyNum;
        luckyNumItem.generateTime = timestamp;

        luckyNums.push(luckyNumItem);
        this.luckyNumRepo.set('luckyNumList', luckyNums);
    },

};

module.exports = TerritoryService;




