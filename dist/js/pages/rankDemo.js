var vm = new Vue({
    el: '#container',
    data: {
        productSubjects: ['木头', '砖块', '羊毛', '粮食', '矿石'],
        buildingSubjects: ['村庄', '城市'],
        woodProduct: {
            productID: 0,
            productName: '木头',
            rank: []
        },
        brickProduct: {
            productID: 1,
            productName: '砖块',
            rank: []
        },
        woolProduct: {
            productID: 2,
            productName: '羊毛',
            rank: []
        },
        foodProduct: {
            productID: 3,
            productName: '粮食',
            rank: []
        },
        mineralProduct: {
            productID: 4,
            productName: '矿石',
            rank: []
        },
        villageBuliding: {
            buildingID: 0,
            buildingName: '村庄',
            rank: []
        },
        cityBuliding: {
            buildingID: 1,
            buildingName: '城市',
            rank: []
        },
    },
    methods: {
        setWoodData: function(item) {
            this.woodProduct.rank = item;
        },
        setBrickData: function(item) {
            this.brickProduct.rank = item;
        },
        setWoolData: function(item) {
            this.woolProduct.rank = item;
        },
        setFoodData: function(item) {
            this.foodProduct.rank = item;
        },
        setMineralData: function(item) {
            this.mineralProduct.rank = item;
        },
        setVillageData: function(item) {
            this.villageBuliding.rank = item;
        },
        setCityData: function(item) {
            this.cityBuliding.rank = item;
        },
    },
    mounted() {
        const self = this;
        var from = Account.NewAccount().getAddressString();
        var value = "0";
        var nonce = "0"
        var gas_price = "1000000"
        var gas_limit = "2000000"
        var callFunction = "getAllProducts";
        var callFunction2 = "getAllBuildings";
        var callArgs = "[\"" + 0 + "\"]";
        var contract = {
            "function": callFunction,
            "args": callArgs
        }
        var contract2 = {
            "function": callFunction2,
            "args": callArgs
        }

        neb.api.call(from, this.dappAddress, value, nonce, gas_price, gas_limit, contract).then(function(resp) {
            var result = JSON.parse(resp.result);
            if (!result) {
                throw new Error("访问资源内容出错" + resp);
            }

            var cityRank = new Array();
            var villageRank = new Array();
            var rankObject = {
                owner: '',
                num: 0
            }

            console.log(result);

            for (var i = 0; i < result.length; i++) {
                if (result[i].buildingType == '城市') {
                    if (cityRank[result[i].owner]) {
                        cityRank[result[i].owner].num += 1;
                    } else {
                        var newRank = new rankObject();
                        newRank.owner = result[i].owner;
                        newRank.num = 1;
                        cityRank[result[i].owner] = newRank;
                    }
                } else {
                    if (villageRank[result[i].owner]) {
                        villageRank[result[i].owner].num += 1;
                    } else {
                        var newRank = new rankObject();
                        newRank.owner = result[i].owner;
                        newRank.num = 1;
                        villageRank[result[i].owner] = newRank;
                    }
                }
            }

            function compare(property) {
                return function(a, b) {
                    return a[property] - b[property];
                }
            }

            cityRank = cityRank.sort(function(a, b) { return a.num - b.num; });
            villageRank = villageRank.sort(function(a, b) { return a.num - b.num; });

            self.setCityData(cityRank);
            self.setVillageData(villageRank);
        }).catch(function(err) {
            //cbSearch(err)
            console.log("error:" + err.message)
        });

        neb.api.call(from, this.dappAddress, value, nonce, gas_price, gas_limit, contract2).then(function(resp) {
            var result = JSON.parse(resp.result);
            if (!result) {
                throw new Error("访问资源内容出错" + resp);
            }

            console.log(result);
            var woodRank = new Array();
            var brickRank = new Array();
            var woolRank = new Array();
            var foodRank = new Array();
            var mineralRank = new Array();
            var rankObject = {
                owner: '',
                num: 0
            }

            for (var i = 0; i < result.length; i++) {
                if (result[i].productName == '木头') {
                    if (woodRank[result[i].owner]) {
                        woodRank[result[i].owner].num += 1;
                    } else {
                        var newRank = new rankObject();
                        newRank.owner = result[i].owner;
                        newRank.num = 1;
                        woodRank[result[i].owner] = newRank;
                    }
                } else if (result[i].productName == '砖块') {
                    if (brickRank[result[i].owner]) {
                        brickRank[result[i].owner].num += 1;
                    } else {
                        var newRank = new rankObject();
                        newRank.owner = result[i].owner;
                        newRank.num = 1;
                        brickRank[result[i].owner] = newRank;
                    }
                } else if (result[i].productName == '羊毛') {
                    if (woolRank[result[i].owner]) {
                        woolRank[result[i].owner].num += 1;
                    } else {
                        var newRank = new rankObject();
                        newRank.owner = result[i].owner;
                        newRank.num = 1;
                        woolRank[result[i].owner] = newRank;
                    }
                } else if (result[i].productName == '食物') {
                    if (foodRank[result[i].owner]) {
                        foodRank[result[i].owner].num += 1;
                    } else {
                        var newRank = new rankObject();
                        newRank.owner = result[i].owner;
                        newRank.num = 1;
                        foodRank[result[i].owner] = newRank;
                    }
                } else {
                    if (mineralRank[result[i].owner]) {
                        mineralRank[result[i].owner].num += 1;
                    } else {
                        var newRank = new rankObject();
                        newRank.owner = result[i].owner;
                        newRank.num = 1;
                        mineralRank[result[i].owner] = newRank;
                    }
                }
            }

            brickRank = brickRank.sort(function(a, b) { return a.num - b.num; });
            foodRank = foodRank.sort(function(a, b) { return a.num - b.num; });
            mineralRank = mineralRank.sort(function(a, b) { return a.num - b.num; });
            woodRank = woodRank.sort(function(a, b) { return a.num - b.num; });
            woolRank = woolRank.sort(function(a, b) { return a.num - b.num; });

            self.setBrickData(brickRank);
            self.setFoodData(foodRank);
            self.setMineralData(mineralRank);
            self.setWoodData(woodRank);
            self.setWoolData(woolRank);
        }).catch(function(err) {
            //cbSearch(err)
            console.log("error:" + err.message)
        });
    }
})