const PORT = 3000;
var socket = io.connect("http://127.0.0.1:"+ PORT);

var dataPointsInfo = [];
var flag = 0;
var exchange = "coincheck";
var moneyMark = "¥";
var exchangeValue = "Coincheck(JP)";
var intervalOption;
var scrollFlag = true;

function pricedataParser(json){
    var count = Object.keys(json).length;
    console.log("dataPointsInfo ",json[0].time);

    for (var length = 0; length < count; length++) {
        dataPointsInfo.push({x :new Date( json[length].time), y : json[length].price});
        console.log("dataPointsInfo ", {x : json[length].time , y : json[length].price});
    }
}

var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,  
    title :  { text:exchangeValue+ " Bitcoin Chart"},
    axisY: {
        valueFormatString: "#0,000",
        prefix: moneyMark
    },
    data: [{
        type: "area",
        color: "rgba(54,158,173,.7)",
        markerSize: 0,
        xValueFormatString: "HH:MM",
        yValueFormatString: moneyMark + "#,##0.##",
        dataPoints : dataPointsInfo
        }]
    });

function requestInterval(){
    $.ajax({
        //url:"localhost:8080/getPriceData",
        url:"/getPriceData",
        data : { "flag" : flag , "exchange" : exchange },
        type: 'POST',
        dataType:'json',
        success : function(data){
            if(chart == null){
                chart = new CanvasJS.Chart("chartContainer", {
                animationEnabled: true,  
                title : { text: exchangeValue + " Bitcoin Chart"},
                axisY: {
                    valueFormatString: "#0,000",
                    prefix: moneyMark
                },
                data: [{
                    type: "area",
                    color: "rgba(54,158,173,.7)",
                    markerSize: 0,
                    xValueFormatString: "HH:MM",
                    yValueFormatString: moneyMark + "#,##0.##",
                    dataPoints : dataPointsInfo
                    }]
                });
            }

            console.log("success",data);
            pricedataParser(data);
            flag = 1;
            chart.render();
        },
        error: function(data) {
            flag = 2;
            console.log("fail",flag);
            if( chart != null ){
                chartReset();
                clearInterval(intervalOption);
            }
        }
    });
}

function chartReset(){
    chart.destroy();
    chart = null;
    dataPointsInfo = [];
}

function scrollEvent(){
    scrollFlag = false;
}

$(document).ready(function(){
    if(chart != null){
        chart.render();
    }

    socket.on('serverStatus',function(serverStatusFlag){
        console.log(serverStatusFlag)
        flag = serverStatusFlag;
        intervalOption = setInterval(requestInterval,1*1000);
    });

    $('form').submit(function(){
        var message = $('#message').val();
        if(message == ''){
            return false;
        }
        socket.emit('chat message', message);
        $('#message').val('');
        scrollFlag = true;
        return false;
    });

    socket.on('chat message', function(msg){
        $('#messages').append($('<li class="list-group-item">').text(msg));
        if(scrollFlag){
           document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
        }
 
    });

    $("input#exchangeBtn").click(function(){

        if(exchangeValue == this.value){
            return;
        }
        exchangeValue = this.value;

        if(exchangeValue === "Coincheck(JP)"){
            exchange = "coincheck";
            moneyMark = "¥"
        }else if(exchangeValue ==="Bithumb(KR)"){
            exchange = "bithumb";
            moneyMark = "₩"
        }

        flag = 0;
        chartReset();
        requestInterval();
    });

});