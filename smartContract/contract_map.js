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