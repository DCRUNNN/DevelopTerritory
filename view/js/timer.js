 // 倒计时
 var _ordertimer = null;
 var data = new Date();
 document.getElementById("date2").value = data.getFullYear() + '-' + (data.getMonth() + 1) + '-' + data.getDate() + ' ' + data.getHours() + ':' + data.getMinutes() + ':' + data.getSeconds(); //当前时间

 function leftTimer(enddate) {
     var leftTime = (new Date(enddate)) - new Date(); //计算剩余的毫秒数
     var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
     var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
     var minutes = parseInt(leftTime / 1000 / 60 % 60, 10); //计算剩余的分钟
     var seconds = parseInt(leftTime / 1000 % 60, 10); //计算剩余的秒数
     days = checkTime(days);
     hours = checkTime(hours);
     minutes = checkTime(minutes);
     seconds = checkTime(seconds);
     if (days >= 0 || hours >= 0 || minutes >= 0 || seconds >= 0)
         document.getElementById("timer").innerHTML = days + "天" + hours + "小时" + minutes + "分" + seconds + "秒";
     if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
         window.clearInterval(_ordertimer);
         _ordertimer = null;
     }
 }

 function checkTime(i) { //将0-9的数字前面加上0，例1变为01
     if (i < 10) {
         i = "0" + i;
     }
     return i;
 }

 function go(v) {
     var date1 = new Date(),
         data2 = new Date(v);
     if (data2 < date1) return; //设置的时间小于现在时间退出
     _ordertimer = setInterval(function() {
         leftTimer(data2)
     }, 1000);
 }