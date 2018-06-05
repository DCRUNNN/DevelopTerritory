var vm = new Vue({
    el:'#container',
    data:{
        productSubjects:['木头','砖块','羊毛','粮食','矿石'],
        buildingSubjects:['村庄','城市'],
        woodProduct:{
            productID: 0,
            productName: '木头',
            numOfProduct: 0,
            owner: ''

        },
        brickProduct:{
            productID: 1,
            productName: '砖块',
            numOfProduct: 0,
            owner: ''
        },
        woolProduct:{
            productID: 2,
            productName: '羊毛',
            numOfProduct: 0,
            owner: ''
        },
        foodProduct:{
            productID: 3,
            productName: '粮食',
            numOfProduct: 0,
            owner: ''
        },
        mineralProduct:{
            productID: 4,
            productName: '矿石',
            numOfProduct: 0,
            owner: ''
        },
        villageBuliding:{
            buildingID: 0,
            buildingName: '村庄',
            requiredResources:{
                // key:value -> productID : number
                0:4,
                1:3,
                2:9,
                3:6
            },
            numOfBuilding: 0,
            owner: ''
        },
        cityBuliding:{
            buildingID: 1,
            buildingName: '城市',
            requiredResources:{
                // key:value -> productID : number
                3:13,
                1:6,
                4:10
            },
            numOfBuilding: 0,
            owner: ''
        },
    },
    methods:{
        setWoodData: function(item){
            this.woodProduct.numOfProduct = item.numOfProduct;
            this.woodProduct.owner = item.owner;
        },
        setBrickData: function(item){
            this.brickProduct.numOfProduct = item.numOfProduct;
            this.brickProduct.owner = item.owner;
        },
        setWoolData: function(item){
            this.woolProduct.numOfProduct = item.numOfProduct;
            this.woolProduct.owner = item.owner;
        },
        setFoodData: function(item){
            this.foodProduct.numOfProduct = item.numOfProduct;
            this.foodProduct.owner = item.owner;
        },
        setMineralData: function(item){
            this.mineralProduct.numOfProduct = item.numOfProduct;
            this.mineralProduct.owner = item.owner;
        },
        setVillageData: function(item){
            this.villageBuliding.numOfProduct = item.numOfProduct;
            this.villageBuliding.owner = item.owner;
        },
        setCityData: function(item){
            this.cityBuliding.numOfProduct = item.numOfProduct;
            this.cityBuliding.owner = item.owner;
        },
    },
    mounted(){
        const self = this;
        var from = Account.NewAccount().getAddressString();
        var value = "0";
        var nonce = "0"
        var gas_price = "1000000"
        var gas_limit = "2000000"
        var callFunction = "getAllInfoByUser";
        var callArgs = "[\"" + 0 + "\"]";
        var contract = {
            "function": callFunction,
            "args": callArgs
        }

        neb.api.call(from,this.dappAddress,value,nonce,gas_price,gas_limit,contract).then(function (resp) {
            var result = JSON.parse(resp.result);
            if (!result) {
                throw new Error("访问资源内容出错" + resp);
            }

            console.log(result)

            for(var i=0;i<result.length;i++){
                var item=result[i];
                if(item.productID == 0){
                    self.setWoodData(item);
                }else if(item.productID == 1){
                    self.setBrickData(item);
                }else if(item.productID == 2){
                    self.setWoolData(item);
                }else if(item.productID == 3){
                    self.setFoodData(item);
                }else if(item.productID == 4){
                    self.setMineralData(item);
                }else if(item.buildingID == 0){
                    self.setVillageData(item);
                }else if(item.buildingID == 1){
                    self.setCityData(item);
                }
            }
        }).catch(function (err) {
            //cbSearch(err)
            console.log("error:" + err.message)
        })
    }
})