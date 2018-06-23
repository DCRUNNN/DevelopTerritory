var vm = new Vue({
    el:'.container',
    data:{
        productSubjects:['木头','砖块','羊毛','粮食','矿石'],
        buildingSubjects:['村庄','城市'],
        //sell是正在出售中
        sellWoodProduct:{
            owner = '',
            numOfProduct: 0,
            price = 0
        },
        sellBrickProduct:{
            owner = '',
            numOfProduct: 0,
            price = 0
        },
        sellWoolProduct:{
            owner = '',
            numOfProduct: 0,
            price = 0
        },
        sellFoodProduct:{
            owner = '',
            numOfProduct: 0,
            price = 0
        },
        sellMineralProduct:{
            owner = '',
            numOfProduct: 0,
            price = 0
        }
    },
    methods:{
        setSellMineralData: function(item){
            this.sellMineralProduct.numOfProduct = item.numOfProduct;
            this.sellMineralProduct.owner = item.owner;
            this.sellMineralProduct.price = item.price;
        },
        setSellWoodData: function(item){
            this.sellWoodProduct.numOfProduct = item.numOfProduct;
        },
        setSellFoodData: function(item){
            this.sellFoodProduct.numOfProduct = item.numOfProduct;
        },
        setSellBrickData: function(item){
            this.sellBrickProduct.numOfProduct = item.numOfProduct;
        },
        setSellWoolData: function(item){
            this.sellWoolProduct.numOfProduct = item.numOfProduct;
        }
    },
    mounted(){
        const self = this;
        var from = Account.NewAccount().getAddressString();
        var value = "0";
        var nonce = "0"
        var gas_price = "1000000"
        var gas_limit = "2000000"
        var callFunction1 = "getAllProductByUser";
        var callFunction2 = 'getTransactionByUser';
        var callArgs = "[\"" + from + "\"]";
        var contract = {
            "function": callFunction1,
            "args": callArgs
        }
        var contract2 = {
            "function": callFunction2,
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
                if(item.productName == '木头'){
                    self.setWoodData(item);
                }else if(item.productName == '砖块'){
                    self.setBrickData(item);
                }else if(item.productName == '羊毛'){
                    self.setWoolData(item);
                }else if(item.productName == '粮食'){
                    self.setFoodData(item);
                }else if(item.productName == '矿石'){
                    self.setMineralData(item);
                }
            }
        }).catch(function (err) {
            //cbSearch(err)
            console.log("error:" + err.message)
        })

        neb.api.call(from,this.dappAddress,value,nonce,gas_price,gas_limit,contract2).then(function (resp) {
            var result = JSON.parse(resp.result);
            if (!result) {
                throw new Error("访问资源内容出错" + resp);
            }

            console.log(result)

            for(var i=0;i<result.length;i++){
                var item=result[i];
                if(item.stuffName == '木头' && item.state == '可购买'){
                    self.setSellWoodData(item);
                }else if(item.stuffName == '砖块' && item.state == '可购买'){
                    self.setSellBrickData(item);
                }else if(item.stuffName == '羊毛' && item.state == '可购买'){
                    self.setSellWoolData(item);
                }else if(item.stuffName == '粮食' && item.state == '可购买'){
                    self.setSellFoodData(item);
                }else if(item.stuffName == '矿石' && item.state == '可购买'){
                    self.setSellMineralData(item);
                }else if(item.stuffName == '木头' && item.state == '交易成功'){
                    self.setSoldWoodData(item);
                }else if(item.stuffName == '砖块' && item.state == '交易成功'){
                    self.setSoldBrickData(item);
                }else if(item.stuffName == '羊毛' && item.state == '交易成功'){
                    self.setSoldWoolData(item);
                }else if(item.stuffName == '粮食' && item.state == '交易成功'){
                    self.setSoldFoodData(item);
                }else if(item.stuffName == '矿石' && item.state == '交易成功'){
                    self.setSoldMineralData(item);
                }
            }
        }).catch(function (err) {
            //cbSearch(err)
            console.log("error:" + err.message)
        })
    }
})