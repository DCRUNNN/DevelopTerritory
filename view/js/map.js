$(window).on('load', function(){
    luckyNums = ([{"time": "14:00", "number": -1}, {"time": "13:50", "number": 3}, {"time": "13:40", "number": 4}, {"time": "13:30", "number": 5},
    {"time": "13:20", "number": 3}, {"time": "13:10", "number": 4}, {"time": "13:00", "number": 5},
    {"time": "12:50", "number": 3}, {"time": "12:40", "number": 4}, {"time": "12:30", "number": 5},
    {"time": "12:20", "number": 3}, {"time": "12:10", "number": 4}, {"time": "12:00", "number": 5}]);

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

	canvas=document.getElementById('map');
	can = document.createElement("canvas");
	ctx=canvas.getContext('2d');
	bg_img = new Image();
    bg_img.src = "images/background.png";
    scale = 1.5;//图像显示缩放比例
    controlScale = 1.5;//拖动鼠标时地图跟随距离
    n = 6 + 6;//number of resources: map + road
    offsetX = 20;
    offsetY = 10;
    maps = new Array(6);
    posSet = //显示数字，序号1~6（0代表无六边形），横位置，纵位置, 左上路径（0无，1有），左上角建筑（0无，1占位，2乡村，3城市 ），上路径，右上建筑，右上路径
              [[17, 5, 0,-1, 1, 1, 1, 3, 1],
               [12, 4,-1,-1, 0, 1, 1, 2, 1],
               [ 0, 0, 1,-1, 1, 1, 0, 0, 0],
               [ 0, 0, 0, 0, 0, 1, 1, 2, 0]];
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
    svgContainer = d3.select("#mapElement")
    .attr("width",$(window).width())
    .attr("height", $(window).height());


    svgContainer.on("mousedown", function(ev){  
        var e = ev||event;  
        x = e.clientX;  
        y = e.clientY;  
        drag(x,y);  
    })
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
    		x = (23 + (offsetX+ posSet[i][2]) * 64 )* 1.0* scale
    	else
    		x = (27 + (offsetX+ posSet[i][2]) * 64 )* 1.0* scale;
    	if(posSet[i][2]%2 == 0)
    		y = ((posSet[i][3] + offsetY) * 72 - 1) * scale;
        else
        	y = ((posSet[i][3] + offsetY) * 72  + 34) * scale;
        if(x < -oriX - 80 * scale || x > -oriX + $(window).width() + 10 * scale || y < -oriY - 75 * scale || y > -oriY + $(window).height())
        	continue;
        if(posSet[i][1]!= 0){
            ctx.drawImage(maps[posSet[i][1] - 1], x, y, 74 * scale, 66 * scale);
            ctx.beginPath();  
            ctx.arc(x + 36*scale, y + 32*scale, 12 * scale,Math.PI*2,false);  
	        ctx.fillStyle="rgba(237,239,243,0.9)";//背景色  
	        ctx.fill();  
	        ctx.strokeStyle="rgba(237,239,243,0.45)";//半透明背景色  
	        ctx.stroke();  
	        ctx.font= 12 * scale + "px" +  " 微软雅黑";
	        ctx.fillStyle="rgba(50,50,50,0.9)";
	        if(posSet[i][0] < 10)
	            ctx.fillText(posSet[i][0] ,x + 32 * scale,y + 37 * scale);
	        else
	        	ctx.fillText(posSet[i][0] ,x + 29 * scale,y + 37 * scale);
	    }
        //绘制六边形
        
        if(posSet[i][4]){
        	ctx.drawImage(road[3], x - 9 * scale, y - 2 * scale, 28 * scale, 37 * scale);
        	lineMask(x - 9 * scale, y + 29 * scale, 30 * scale, 10 * scale, -60, 1, i);
        }
        else
        	lineMask(x - 9 * scale, y + 29 * scale, 30 * scale, 10 * scale, -60, 0, i);
        if(posSet[i][6]){
        	ctx.drawImage(road[4], x + 19* scale, y - 8 * scale, 36 * scale, 10 * scale);
        	lineMask(x + 24* scale, y - 7 * scale, 32 * scale, 10 * scale, 0, 1, i);
        }
        else
        	lineMask(x + 24* scale, y - 7 * scale, 32 * scale, 10 * scale, 0);
        if(posSet[i][8]){
        	ctx.drawImage(road[5], x + 56* scale, y - 2 * scale, 27 * scale, 37 * scale);
        	lineMask(x + 68* scale, y + 3 * scale , 30 * scale, 10 * scale, 60, 1, i);
        }
        else
        	lineMask(x + 68* scale, y + 3 * scale, 30 * scale, 10 * scale, 60, 0);

        //绘制道路
        

        if(posSet[i][5]){
        	ctx.drawImage(road[posSet[i][5] - 1], x + 6 * scale, y - 12 * scale, 20 * scale, 20 * scale);
        	circleMask(x + 6 * scale, y - 12 * scale, 0, i);
        }

        if(posSet[i][7]){
        	ctx.drawImage(road[posSet[i][7] - 1], x + 49 * scale, y - 12 * scale, 20 * scale, 20 * scale);
        	circleMask(x + 49 * scale, y - 12 * scale, 1, i);
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
function drag(x,y){  
    // 当画布上有多个路径时，isPointInPath只能判断最后那一个绘制的路径  
        //路径正确，鼠标移动事件  
    svgContainer.on("mousemove", function(ev){  
        var e = ev||event;   
        var ax = e.clientX;  
        var ay = e.clientY; 
        
        if(oriX + ax - x < 0 && oriY + ay - y < 0 && oriX + ax - x > -4000* scale && oriY + ay - y > -1800 * scale)  {
            drawScene(controlScale*(ax - x),controlScale* (ay - y));  
            oriX = oriX + controlScale * (ax - x); oriY = oriY + controlScale * (ay - y);
        }
        x = ax; y = ay;
        console.log("oriX:" + oriX + "  oriY:" + oriY);
    })
    //鼠标移开事件  
    svgContainer.on("mouseup", function(ev){  
        svgContainer.on("mousemove", null);  
        svgContainer.on("mouseup", null);  
    })
}

function circleMask(x, y, structType, index){
	var circle = svgContainer.append("circle")
		.attr("cx",x + oriX + 10 * scale)
		.attr("cy", y + oriY + 10 * scale)
		.attr("r",10 * scale)
		.style("fill", "rgba(255, 255, 255, 0)")
		.style("cursor", "pointer")
		.attr("index", index)
		.attr("structType", structType);
	circle.on("mouseover", function(){
		d3.select(this).transition(300).style("fill", "rgba(255, 255, 200, 0.2)");
		svgContainer.on("mousedown", null);
	})
	circle.on("mouseout", function(){
		d3.select(this).transition(300).style("fill", "rgba(255, 255, 255, 0)");
		svgContainer.on("mousedown", function(ev){  
            var e = ev||event;  
            x = e.clientX;  
            y = e.clientY;  
            drag(x,y);  
        })
	})
	circle.on("click", function(){
		console.log("click");
		//to do 
		if(posSet[d3.select(this).attr("index")][d3.select(this).attr("structType")*2 + 5] == 2)
			$("#structCreate").find(".modal-body").text("你确定花费13单位粮食、6单位砖块、10单位矿石将此村庄扩建成城市吗？");
		else if(posSet[d3.select(this).attr("index")][d3.select(this).attr("structType")*2 + 5] == 1)
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
		.style("fill","rgba(255, 255, 200, 0.0)")
		.style("cursor", "pointer")
		.attr("index", index)
		.attr("pos", angle / 60);
	line.on("mouseover", function(){
		if(lineType)
		    d3.select(this).transition(300).style("fill", "rgba(255, 255, 200, 0.08)");
		else
			d3.select(this).transition(300).style("fill", "rgba(188, 176, 134, 0.5)");
		svgContainer.on("mousedown", null)
	})
	line.on("mouseout", function(){
		d3.select(this).transition(300).style("fill", "rgba(255, 255, 255, 0)");
		svgContainer.on("mousedown", function(ev){  
			var e = ev||event;  
            x = e.clientX;  
            y = e.clientY;  
            drag(x,y);  
		})
	})
	if(!lineType){
		line.on("click", function(){
			console.log("click_line");
			//to do
			$("#structCreate").find(".modal-body").text("你确定花费6单位木头、6单位砖块在此地建设1条道路吗？");
			$('#structCreate').modal('show');
		})
	}
}