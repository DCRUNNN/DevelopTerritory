"use strict";

var productItem = function (text) {
    if (text) {
        var obj = JSON.parse(text);
        this.productID = obj.productID; // 资源ID
        this.numOfProduct = obj.numOfProduct; // 资源数量
        this.owner = obj.owner; // 资源所有者，用户钱包地址
    } else {
        this.productID = -1;//-1表示什么资源都不是
        this.numOfProduct = 0;
        this.owner = '';
    }
};

var buildingItem = function (text) {
    if (text) {
        var obj = JSON.parse(text);
        this.cityID = obj.cityID; // 资源ID
        this.numOfBuilding = obj.numOfBuilding; // 资源数量
        this.owner = obj.owner; // 资源所有者，用户钱包地址
    } else {
        this.buildingID = -1;//-1表示什么资源都不是
        this.numOfBuilding = 0;
        this.owner = '';
    }
};

var luckyNumItem = function (text) {
    if (text) {
        var obj = JSON.parse(text);
        this.luckyNum = obj.luckyNum; // 幸运数字
        this.generateTime = obj.generateTime; //幸运数字生成时间
    } else {
        this.luckyNum = -1; // 幸运数字
        this.generateTime = 0; //幸运数字生成时间 时间戳默认是？？？
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
    // novelSubject => novelItem
    LocalContractStorage.defineMapProperty(this, "productRepo", {
        parse: function (text) {
            return new productItem(text);
        },
        stringify: function (o) {
            return JSON.stringify(o);
        }
    });
    LocalContractStorage.defineMapProperty(this, "buildingRepo", {
        parse: function (text) {
            return new buildingItem(text);
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
        this.productRepo.set('productList', []); // 资源列表
        this.buildingRepo.set('buildingList',[]); // 建筑列表
        this.luckyNumRepo.set('luckyNumList',[]);
        // TODO: board
    },

    //获取所有的玩家拥有的资源信息
    getProducts: function () {
        var items = this.productRepo.get('productList');
        var result = [];
        for (var i = 0; i < items.length; i++) {
            var product = this.productRepo.get(items[i]);
            if (product) {
                result.push(product);
            }
        }
        return result;
    },

    //通过建筑ID获取建筑的信息
    getBuilding: function(buildingID){
        var items = this.buildingRepo.get('buildingList');
        var result = [];
        for (var i = 0; i < items.length; i++) {
            var building = this.buildingRepo.get(items[i]);
            if (building && building.buildingID == buildingID) {
                result.push(building);
            }
        }
        return result;
    },

    //通过资源ID获取资源的信息
    getProduct: function(productID){
        var items = this.productRepo.get('productList');
        var result = [];
        for (var i = 0; i < items.length; i++) {
            var product = this.productRepo.get(items[i]);
            if (product && product.productID == productID) {
                result.push(product);
            }
        }
        return result;
    },

    //通过用户钱包地址获取用户的资源的信息
    getAllInfoByUser: function(userID){
        var buildingItems = this.buildingRepo.get('buildingList');
        var productItems = this.productRepo.get('productList');
        var result = [];
        for (var i = 0; i < buildingItems.length; i++) {
            var building = this.buildingRepo.get(items[i]);
            if (building && building.owner == userID) {
                result.push(building);
            }
        }
        for (var i = 0; i < productItems.length; i++) {
            var product = this.productRepo.get(items[i]);
            if (product && product.owner == userID) {
                result.push(product);
            }
        }
        return result;
    },
    
    //记录产生的幸运数字
    recordLuckyNumber: function(luckyNum) {
        var luckyNums = this.luckyNumRepo.get('luckyNumList');

        var timestamp = Date.parse(new Date()); //获取当前时间戳
        //??? var time = Blockchain.block.timestamp;

        var luckyNumItem = new luckyNumItem();
        luckyNumItem.luckyNum = luckyNum;
        luckyNumItem.generateTime = timestamp;

        luckyNums.push(luckyNumItem);
        this.luckyNumRepo.set('luckyNumList', luckyNums);
    },
    
};
module.exports = TerritoryService;
