"use strict";

var hexagonItem = function(text) {
    if (text) {
        var obj = JSON.parse(text);
        var hexagonID = obj.hexagonID; //六边形ID
        var hasLuckyNumberItem = obj.hasLuckyNumberItem; //六边形幸运数字
        var productType = obj.productType; //六边形资源类型
        var posX = obj.posX; //X轴位置
        var posY = obj.posY; //Y轴位置
    } else {
        var hexagonID = -1;
        var luckyNumber = -1;
        var sourceType = -1;
        var posX = -1;
        var posY = -1;
    }
};

var pathItem = function(text) {
    if (text) {
        var obj = JSON.parse(text);
        var pathID = obj.pathID; //路径ID
        var pathBelongToItem = obj.pathBelongToItem; //属于User
        //var pathBelongToHexagon = obj.pathBelongToHexagon; //在哪个六边形上
        var posXOfHexagon = obj.posXOfHexagon; // 属于的六边形的 X position
        var posYOfHexagon = obj.posYOfHexagon; // 属于的六边形的 Y position
        var relativePos = obj.relativePos; //相对于六边形的位置，左上、上、右上
    } else {
        var pathID = -1;
        var pathBelongToUserID = -1;
        var posXOfHexagon = -1;
        var posYOfHexagon = -1;
        var relativePos = -1;
    }
};

var buildingItem = function(text) {
    if (text) {
        var obj = JSON.parse(text);
        var buildingID = obj.buildingID; //建筑ID
        var buildingBelongToItem = obj.buildingBelongToItem; //建筑Item
        var posXOfHexagon = obj.posXOfHexagon; // 属于的六边形的 X position
        var posYOfHexagon = obj.posYOfHexagon; // 属于的六边形的 Y position
        var relativePos = obj.relativePos; //相对于六边形的位置, 左上、右上
    } else {
        var buildingID = -1;
        var buildingBelongToItem = -1;
        var posXOfHexagon = -1;
        var posYOfHexagon = -1;
        var relativePos = -1;
    }
};

var TerritoryService = function() {
    LocalContractStorage.defineMapProperty(this, "hexagonRepo", {
        parse: function(text) {
            return JSON.parse(text);
        },
        stringify: function(o) {
            return JSON.stringify(o);
        }
    });

    // userID => all paths of user
    LocalContractStorage.defineMapProperty(this, "pathRepo", {
        parse: function(text) {
            return new productItem(text);
        },
        stringify: function(o) {
            return JSON.stringify(o);
        }
    });

    // userID => all buildings of user
    LocalContractStorage.defineMapProperty(this, "buildingRepo", {
        parse: function(text) {
            return new buildingItem(text);
        },
        stringify: function(o) {
            return JSON.stringify(o);
        }
    });

};

TerritoryService.prototype = {
    init: function () {
        this.data.set('buildingID', 1); // 建筑ID
        this.data.set('hexagonID', 1); // 六边形ID
        this.buildingRepo.set('allBuildingList',[]); // 建筑列表
        this.luckyNumRepo.set('allHexagonList',[]); //六边形列表
        this.userInfoRepo.set('allRoadList',[]); //路径列表
        // TODO: board
    },
    
    //判断地图规模并且扩张地图
    judgeAndExpand:function(){
        var buildingIndex = this.data.get('buildingID');
        var hexagonIndex = this.data.get('hexagonID');
        var ratio = buildingIndex / hexagonIndex;
        //比例大于0.666则扩张地图
        if(ratio>0.666){
            var hexagonItem = new haxagonItem();
            hexagonItem.hexagonID = hexagonIndex+1;
            this.data.set('hexagonID',hexagonIndex+1); 
            var luckyNum = parseInt(Math.random()*17+16); //生成17个随机数
        }
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