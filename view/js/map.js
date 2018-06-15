$(window).on('load', function(){
    luckyNums = ([{"time": "14:00", "number": -1}, {"time": "13:50", "number": 3}, {"time": "13:40", "number": 4}, {"time": "13:30", "number": 5},
    {"time": "13:20", "number": 3}, {"time": "13:10", "number": 4}, {"time": "13:00", "number": 5},
    {"time": "12:50", "number": 3}, {"time": "12:40", "number": 4}, {"time": "12:30", "number": 5},
    {"time": "12:20", "number": 3}, {"time": "12:10", "number": 4}, {"time": "12:00", "number": 5}]);
    
    id = "哈哈哈";
    backNum = 0;
	updateNum();
	$(".lucky-number").find(".right").click(function(){
		if(backNum > 0){
			backNum--;
			updateNum();
		}
	})

	$(".lucky-number").find(".left").click(function(){
		if(backNum < luckyNums.length - 10){
			backNum++;
			updateNum();
		}
	})

	$(".main").width($(window).width());
	$(".main").height($(window).height() - 40);
	$("#infor").hide();

	canvas=document.getElementById('map');
	can = document.createElement("canvas");
	ctx=canvas.getContext('2d');
	bg_img = new Image();
    bg_img.src = "images/background.png";
    scale = 1.5;//图像显示缩放比例
    controlScale = 1.0;//拖动鼠标时地图跟随距离
    n = 6 + 6;//number of resources: map + road
    offsetX = 20;
    offsetY = 10;
    maps = new Array(6);
    //显示数字，序号1~6（0代表无六边形），横位置，纵位置, 左上路径（0无，1可建筑，2已有），左上角建筑（0无，1占位，2乡村，3城市 ），上路径，右上建筑，右上路径
    posSet = ([{"mapInfor":[17, 5, 0, 0, 1, 1, 0, 1, 0], "owner":["小可爱", "小仙女", "#", "哈哈哈", "#"]},
               {"mapInfor":[16, 5,-1,-1, 1, 1, 0, 1, 0], "owner" : ["小可爱",  "小仙女",  "哈哈哈","哈哈哈",  "#"]},
               {"mapInfor":[12, 2,-1, 0, 1, 1, 2, 2, 2],"owner":["小可爱",  "小仙女",  "哈哈哈","哈哈哈",  "小仙女"]}, 
               {"mapInfor":[1, 0, 0,-1, 0, 0, 0, 0, 0], "owner" : ["#",  "#", "#", "#", "#"]},
               {"mapInfor":[2, 0, 1,-1, 1, 0, 0, 0, 0], "owner":["#",  "#", "#", "#", "#"]}, 
               {"mapInfor":[3, 0, 1, 0, 1, 1, 0, 0, 0], "owner" : ["#",  "#", "#", "#", "#"]},
               {"mapInfor":[4, 0, 0, 1, 0, 1, 2, 3, 1], "owner":["#",  "#", "小可爱", "哈哈哈", "#"]}, 
               {"mapInfor":[5, 0,-1, 1, 0, 1, 0, 1, 0], "owner" : ["#",  "小仙女", "#", "#", "#"]},
               {"mapInfor":[6, 0,-2, 1, 0, 0, 1, 2, 1], "owner":["#",  "#", "#", "哈哈哈", "#"]},
               {"mapInfor":[7, 0,-2, 0, 0, 0, 1, 2, 1], "owner" : ["#",  "#", "#", "哈哈哈", "#"]},         
               {"mapInfor":[8, 0,-2,-1, 0, 0, 0, 0, 1], "owner":["#", "#", "#", "#", "#"]}, 
               {"mapInfor":[9, 0,-1,-2, 0, 0, 0, 0, 1], "owner" : ["#", "#", "#", "#", "#"]}]);
    for (var i = 0; i < 6; i++){
    	maps[i] = new Image();
    }
    maps[0].src = "images/maps/草原.png";
    maps[1].src = "images/maps/平原.png";
    maps[2].src = "images/maps/矿山.png";
    maps[3].src = "images/maps/泥土.png";
    maps[4].src = "images/maps/森林.png";
    maps[5].src = "images/maps/沙漠.png";

    road = new Array(6);
    for (var i = 0; i < 6; i++){
    	road[i] = new Image();
    }
    road[0].src = "images/road/circle.png";
    road[1].src = "images/road/village.png";
    road[2].src = "images/road/city.png";
    road[3].src = "images/road/left.png";
    road[4].src = "images/road/horizon.png";
    road[5].src = "images/road/right.png";

    oriX = -(offsetX+1) * 64*scale + $(window).width()/2;
    if(oriX > 0)
    	oriX = 0;
    oriY = -offsetY * 72 * scale + $(window).height()/2;

    x = new Array();
    y = new Array();
    //储存六边形坐标
    if(oriY > 0)
    	oriY = 0;
	bg_img.onload = function () {
	    for(var i = 0; i < 6; i ++){
	    	maps[i].onload = function() {  
               n--;
               //console.log(n);
               if(!n){
               	   resize();
               }
            }
        };
        for(var i = 0; i < 6; i ++){
	    	road[i].onload = function() {  
               n--;
               //console.log(n);
               if(!n){
               	   resize();
               }
            }
        };
    }
    svg = $("#mapElement")[0];
    $(svg).width($(window).width());
    $(svg).height($(window).height());

    svgContainer = d3.select("#mapElement")
    .attr("width",$(window).width())
    .attr("height", $(window).height());


    svgContainer.on("mousedown", function(ev){  
        var e = ev||event;  
        mx = e.clientX;  
        my = e.clientY;  
        mouseDrag(mx, my);  
    })

    hx = 0;
    hy = 0;
    svg.addEventListener("touchstart", function(event){  
        if(event.touches){
        	var e = event.touches[0];  
	        hx = e.clientX;  
	        hy = e.clientY;  
	        handDrag();  
	    }
    }, false)
})

function updateNum(){
	var recent = backNum + 9;
	if(backNum == 0 )
		$(".lucky-number").find(".right").removeClass("active");
	else
		$(".lucky-number").find(".right").addClass("active");
	if(recent == luckyNums.length - 1)
		$(".lucky-number").find(".left").removeClass("active");
	else
		$(".lucky-number").find(".left").addClass("active");

	$(".lucky-number").find("ul").find("li").each(function(){
		if(recent == 0){
			$(this).find(".number").text("?");
			$(this).find(".time").text("9'29''");
			$(this).addClass("active");
		}
		else{
			$(this).removeClass("active");
		    $(this).find(".number").text(luckyNums[recent].number);
            $(this).find(".time").text(luckyNums[recent--].time);
        }
	})
}

 function drawScene(a,b){ 
    ctx.clearRect(-oriX, -oriY, $(window).width(),$(window).height() - 40);
    svgContainer.selectAll("circle").remove();
    svgContainer.selectAll("rect").remove();
    ctx.translate(a,b);
    ctx.fillStyle = ctx.createPattern(can,"repeat");
    ctx.fillRect(-oriX, -oriY, $(window).width(),$(window).height() - 40); 
    for(var i = 0; i < posSet.length; i++){
    	if(scale < 1.0)
    		x[i] = (23 + (offsetX+ posSet[i].mapInfor[2]) * 64 )* 1.0* scale
    	else
    		x[i] = (26 + (offsetX+ posSet[i].mapInfor[2]) * 64 )* 1.0* scale;
    	if(posSet[i].mapInfor[2]%2 == 0)
    		y[i] = ((posSet[i].mapInfor[3] + offsetY) * 72 - 2) * scale;
        else
        	y[i] = ((posSet[i].mapInfor[3] + offsetY) * 72  + 34) * scale;

        if(x[i] < -oriX - 80 * scale || x > -oriX + $(window).width() + 10 * scale || y < -oriY - 75 * scale || y > -oriY + $(window).height()){
        	i--;
        	continue;
        }

        if(posSet[i].mapInfor[1]!= 0){
            ctx.drawImage(maps[posSet[i].mapInfor[1] - 1], x[i], y[i], 75 * scale, 66 * scale);
            ctx.beginPath();  
            ctx.arc(x[i] + 36*scale, y[i] + 32*scale, 12 * scale,Math.PI*2,false);  
	        ctx.fillStyle="rgba(237,239,243,0.9)";//背景色  
	        ctx.fill();  
	        ctx.strokeStyle="rgba(237,239,243,0.45)";//半透明背景色  
	        ctx.stroke();  
	        ctx.font= 12 * scale + "px" +  " 微软雅黑";
	        ctx.fillStyle="rgba(50,50,50,0.9)";
	        if(posSet[i].mapInfor[0] < 10)
	            ctx.fillText(posSet[i].mapInfor[0] ,x[i] + 33 * scale,y[i] + 37 * scale);
	        else
	        	ctx.fillText(posSet[i].mapInfor[0] ,x[i] + 29 * scale,y[i] + 37 * scale);
	    }
        //绘制六边形
    }
    var valid = i;
    for(var i = 0; i < valid; i++){      
        if(posSet[i].mapInfor[4] == 2){
        	ctx.drawImage(road[3], x[i] - 8 * scale, y[i] - 2 * scale, 28 * scale, 37 * scale);
        	lineMask(x[i] - 7 * scale, y[i] + 28 * scale, 36 * scale, 10 * scale, -60, 2, i);
        }
        else if(posSet[i].mapInfor[4] == 1)
        	lineMask(x[i] - 7 * scale, y[i]+ 28 * scale, 36 * scale, 10 * scale, -60, 1, i);
        if(posSet[i].mapInfor[6] == 2){
        	ctx.drawImage(road[4], x[i] + 19* scale, y[i]- 8 * scale, 36 * scale, 10 * scale);
        	lineMask(x[i] + 19* scale, y[i]- 7 * scale, 36 * scale, 10 * scale, 0, 2, i);
        }
        else if (posSet[i].mapInfor[6] == 1)
        	lineMask(x[i] + 19* scale, y[i]- 7 * scale, 36 * scale, 10 * scale, 0, 1, i);
        if(posSet[i].mapInfor[8] == 2){
        	ctx.drawImage(road[5], x[i] + 57* scale, y[i]- 2 * scale, 27 * scale, 37 * scale);
        	lineMask(x[i] + 65* scale, y[i] - 2*scale, 36 * scale, 10 * scale, 60, 2, i);
        }
        else if(posSet[i].mapInfor[8] == 1)
        	lineMask(x[i] + 65* scale, y[i] - 2*scale, 36* scale, 10 * scale, 60, 1, i);
    }//绘制道路

    for(var i = 0; i < valid; i++){  
        if(posSet[i].mapInfor[5]){
        	ctx.drawImage(road[posSet[i].mapInfor[5] - 1], x[i] + 6 * scale, y[i]- 12 * scale, 20 * scale, 20 * scale);
        	circleMask(x[i] + 6 * scale, y[i]- 12 * scale, 0, i);
        }

        if(posSet[i].mapInfor[7]){
        	ctx.drawImage(road[posSet[i].mapInfor[7] - 1], x[i] + 49 * scale, y[i]- 12 * scale, 20 * scale, 20 * scale);
        	circleMask(x[i] + 49 * scale, y[i]- 12 * scale, 1, i);
        }
    }      
} 

$("#in").click(function(){
	if(scale * 1.5 > 4)return;//放大倍数最大为4
	scale*= 1.5;
	ctx.clearRect(-oriX, -oriY, $(window).width(),$(window).height() - 40);
	ctx.translate(-oriX ,-oriY);//移回原始位置
    oriX = oriX * 1.5 - $(window).width()* 0.25;
    if(oriX > 0)
    	oriX  = 0;
    else if(oriX < -4000*scale)
    	oriX = -4000;
    oriY = oriY * 1.5 - $(window).height() * 0.25;
    if(oriY > 0)
    	oriY = 0;
    else if (oriY < -1800*scale)
    	oriY = -1800;
	resize();
});

$("#out").click(function(){
	if(scale / 1.5 < 0.5)return;
	scale/= 1.5;
	ctx.clearRect(-oriX, -oriY, $(window).width(),$(window).height() - 40);
	ctx.translate(-oriX ,-oriY);
    oriX = oriX / 1.5 + $(window).width()* 0.25/1.5;
    if(oriX > 0)
    	oriX  = 0;
    else if(oriX < -4000*scale)
    	oriX = -4000;
    oriY = oriY / 1.5 + $(window).height() * 0.25/1.5;
    if(oriY > 0)
    	oriY = 0;
    else if (oriY < -1800*scale)
    	oriY = -1800;
	resize();
});

function resize(){
    can.width = 128* scale;
    can.height = 72 * scale;
    var ctx2 = can.getContext("2d");
    ctx2.drawImage(bg_img,0,0,128 * scale,72 * scale);
    drawScene(oriX, oriY);
}

//拖拽函数  
function mouseDrag(mx, my){  
    //路径正确, 鼠标移动事件  
    svgContainer.on("mousemove", function(ev){  
        var e = ev||event;   
        var ax = e.clientX;  
        var ay = e.clientY; 
        
        if(oriX + ax -mx< 0 && oriY + ay - my < 0 && oriX + ax -mx> -4000* scale && oriY + ay - my > -1800 * scale)  {
            drawScene(controlScale*(ax - mx),controlScale* (ay - my));  
            oriX = oriX + controlScale * (ax - mx); oriY = oriY + controlScale * (ay - my);
        }
       mx= ax; my = ay;
        console.log("oriX:" + oriX + "  oriY:" + oriY);
    })
    //鼠标松开事件  
    svgContainer.on("mouseup", function(){  
        svgContainer.on("mousemove", null);  
        svgContainer.on("mouseup", null);  
    })
}

function handDrag(){ 
	//移动端 拖动
     svg.addEventListener("touchmove", function(event){  
        var e = event.touches[0];   
        var ax = e.clientX;  
        var ay = e.clientY; 
        
        if(oriX + ax -hx< 0 && oriY + ay - hy < 0 && oriX + ax -hx> -4000* scale && oriY + ay - hy > -1800 * scale)  {
            drawScene(controlScale*(ax - hx),controlScale* (ay - hy));  
            oriX = oriX + controlScale * (ax - hx); oriY = oriY + controlScale * (ay - hy);
        }
        hx= ax; hy = ay;
        console.log("oriX:" + oriX + "  oriY:" + oriY);
    }, false)
    //停止触碰事件  
    svg.addEventListener("touchend", function(){  
        svgContainer.on("touchmove", null);  
        svgContainer.on("touchend", null);  
    }, false)
}

function circleMask(x, y, structType, index){
	var circle = svgContainer.append("circle")
		.attr("cx",x + oriX + 10 * scale)
		.attr("cy", y + oriY + 10 * scale)
		.attr("r",10 * scale)
		.style("fill", "rgba(255, 255, 255, 0)")
		.style("cursor", "pointer")
		.attr("index", index)
		.attr("structType", structType)
		.attr("owner", posSet[index].owner[1 + structType*2]);
	if(circle.attr("owner") != id && circle.attr("owner") != "#")circle.style("fill","rgba(67, 58, 20, 0.2)");
	circle.on("mouseover", function(){
		if(typeof timer != "undefined")clearTimeout(timer);
		var choosenCircle = d3.select(this);
		timer = setTimeout(function(){
			if(circle.attr("owner") != id && circle.attr("owner") != "#")
				choosenCircle.transition(200).style("fill", "rgba(67, 58, 20, 0.3)");
			else
			   	choosenCircle.transition(200).style("fill", "rgba(255, 255, 200, 0.2)");
			
			if(choosenCircle.attr("owner") != "#"){
				var top = parseInt(choosenCircle.attr("cy")) + 40 + 10 * scale;
			    var left =  parseInt(choosenCircle.attr("cx"));
			    $("#infor").css("top", top + "px");
			    $("#infor").css("left", left + "px");
                
                if(posSet[choosenCircle.attr("index")].mapInfor[choosenCircle.attr("structType")*2 + 5] == 2){
				    if(choosenCircle.attr("owner") == id)
				        $("#infor").text("我的村庄");
					else
					    $("#infor").text("村庄拥有者： "+ choosenCircle.attr("owner"));
				}
				else{
                    if(choosenCircle.attr("owner") == id)
				        $("#infor").text("我的城市");
					else
					    $("#infor").text("城市拥有者： "+ choosenCircle.attr("owner"));
				}
				$("#infor").show();
		    }
		},100)
		svgContainer.on("mousedown", null);
	})
	circle.on("mouseout", function(){
		if(typeof timer != "undefined")clearTimeout(timer);
		timer = setTimeout(function(){
			if(circle.attr("owner") != id && circle.attr("owner") != "#")
				circle.style("fill","rgba(67, 58, 20, 0.2)");
			else
			   circle.transition(300).style("fill", "rgba(255, 255, 255, 0)");
			$("#infor").hide();
		}, 100)

		svgContainer.on("mousedown", function(ev){  
            var e = ev||event;  
            x = e.clientX;  
            y = e.clientY;  
            mouseDrag(x,y);  
        })
	})
	circle.on("click", function(){
		console.log("click");
		//to do 
		if(d3.select(this).attr("owner") != "#" && d3.select(this).attr("owner") != id)return;
		if(posSet[d3.select(this).attr("index")].mapInfor[d3.select(this).attr("structType")*2 + 5] == 2)
			$("#structCreate").find(".modal-body").text("你确定花费13单位粮食、6单位砖块、10单位矿石将此村庄扩建成城市吗？");
		else if(posSet[d3.select(this).attr("index")].mapInfor[d3.select(this).attr("structType")*2 + 5] == 1)
            $("#structCreate").find(".modal-body").text("你确定花费4单位木头、3单位砖块、9单位羊毛、6单位粮食在此地建设1个村庄吗？（前666位玩家可以免费建设2个村庄，剩余X/666）");
		else
			return;
		$('#structCreate').modal('show');
	})
}

function lineMask(x, y, width, height, angle, lineType, index){
	var lx = x + oriX;
	var ly = y + oriY;
	var line = svgContainer.append("rect")
		.attr("x", lx)
		.attr("y", ly)
		.attr("width", width)
		.attr("height", height)
		.attr("transform","rotate(" + angle +"," + lx + " " + ly +")")
		.style("fill","rgba(255, 255, 200, 0)")
		.style("cursor", "pointer")
		.attr("index", index)
		.attr("pos", angle / 60)
		.attr("owner", posSet[index].owner[2 + angle/60]);

	if(lineType == 2 && line.attr("owner") != id)line.style("fill","url(#lightRoad)");
	if(lineType){
		line.on("mouseover", function(){
			if(typeof timer != "undefined")clearTimeout(timer);
			var choosenLine = d3.select(this);
			timer = setTimeout(function(){
				if(lineType == 2){
					if(choosenLine.attr("owner") != id)
				        choosenLine.transition(200).style("fill", "url(#darkRoad)");
				    else
				    	choosenLine.transition(200).style("fill", "rgba(255, 255, 200, 0.08)");
				    svgContainer.on("mousedown", null)
					var top = parseInt(choosenLine.attr("y")) + 40 + 10 * scale;
					var left =  parseInt(choosenLine.attr("x"));
					$("#infor").css("top", top + "px");
					$("#infor").css("left", left + "px");
					if(choosenLine.attr("owner") == id)
						 $("#infor").text("我的道路");
					else
					    $("#infor").text("道路拥有者： "+ choosenLine.attr("owner"));
					$("#infor").show();
				}
				else if(lineType == 1)
					choosenLine.transition(200).style("fill", "url(#newRoad)");
				
			},100)
		})
	}
	line.on("mouseout", function(){
		if(typeof timer != "undefined")clearTimeout(timer);
		if(lineType == 2 && line.attr("owner") != id)
			line.style("fill","url(#lightRoad)");
		else
			line.transition(200).style("fill", "rgba(255, 255, 200, 0)");
		$("#infor").hide();
		svgContainer.on("mousedown", function(ev){  
			var e = ev||event;  
            x = e.clientX;  
            y = e.clientY;  
            mouseDrag(x,y);  
		})
	})
	if(lineType == 1){
		line.on("click", function(){
			console.log("click_line");
			//to do
			$("#structCreate").find(".modal-body").text("你确定花费6单位木头、6单位砖块在此地建设1条道路吗？");
			$('#structCreate').modal('show');
		})
	}

}