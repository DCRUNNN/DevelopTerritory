var vm = new Vue({
    el:'.container',
    data:{
        productSubjects:['木头','砖块','羊毛','粮食','矿石'],
        buildingSubjects:['村庄','城市'],
        woodProduct:{
            productID: 0,
            productName: '木头',
            numOfProduct: 0
        },
        brickProduct:{
            productID: 1,
            productName: '砖块',
            numOfProduct: 0
        },
        woolProduct:{
            productID: 2,
            productName: '羊毛',
            numOfProduct: 0
        },
        foodProduct:{
            productID: 3,
            productName: '粮食',
            numOfProduct: 0
        },
        mineralProduct:{
            productID: 4,
            productName: '矿石',
            numOfProduct: 0
        }
    },
    methods:{
        setWoodData: function(item){
            this.woodProduct.numOfProduct = item.numOfProduct;
        },
        setBrickData: function(item){
            this.brickProduct.numOfProduct = item.numOfProduct;
        },
        setWoolData: function(item){
            this.woolProduct.numOfProduct = item.numOfProduct;
        },
        setFoodData: function(item){
            this.foodProduct.numOfProduct = item.numOfProduct;
        },
        setMineralData: function(item){
            this.mineralProduct.numOfProduct = item.numOfProduct;
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
        var callArgs = "[\"" + from + "\"]";
        var contract = {
            "function": callFunction1,
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

    }
})