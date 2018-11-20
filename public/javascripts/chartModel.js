const PORT = 3000;
var socket = io.connect("http://127.0.0.1:"+ PORT);

var dataPointsInfo = [];
var flag = 0;
var exchange = "coincheck";
var moneyMark = "¥";
var exchangeValue = "Coincheck(JP)";
var intervalOption;
var scrollFlag = true;
var userId = "input your ID";
var anotherUserId = "";

const max = 255;
const min = 1;

const r = Math.floor(Math.random() * (max - min)) + min; 
const g = Math.floor(Math.random() * (max - min)) + min;
const b = Math.floor(Math.random() * (max - min)) + min;

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
    title :  { text:exchangeValue + " Bitcoin Chart"},
    axisY: {
        valueFormatString: "#0,000",
        prefix: moneyMark
    },
    data: [{
        type: "area",
        color: "rgba("+r+","+g+","+b+",.7)",
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
                    color: "rgba("+r+","+g+","+b+",.7)",
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
    document.getElementById("userId").innerHTML = userId;
    
    if(chart != null){
        chart.render();
    }
    
    $("#inputId").modal({
        backdrop: false,
        keyboard:false,
        show:true,
        focus : true
    });

    $("#inputId").on('shown.bs.modal', function (e) {
        $("#userInputId").focus();
    });

    $("#changeId").on('shown.bs.modal', function (e) {
       $("#message").val("");
        $("#userChangeId").focus();
    });

    $("#inputId").on("hidden.bs.modal", function(e){
        $("#userInputId").val("");
        $("#message").focus();
    });

    $("#changeId").on("hidden.bs.modal", function(e){
        $("#userChangeId").val("");
        $("#message").focus();
    });

    $("#changeIdbtn").click(function(){
        userId = $("#userChangeId").val();
        if(userId != ""){
            $("#changeId").modal('hide');
            document.getElementById("userId").innerHTML = userId;
        }
    });

    $("#inputIdBtn").click(function(){
        userId = $("#userInputId").val();
        if(userId != ""){
            $("#inputId").modal('hide');
            document.getElementById("userId").innerHTML = userId;
        }
    });

    $("#changeId").on("keydown",function(e){
        if(e.which == 13) {
           userId = $("#userChangeId").val();
            if(userId != ""){
                $("#changeId").modal('hide');
                document.getElementById("userId").innerHTML = userId;
            }
        }
    });

    $("#inputId").on("keydown",function(e){
        if(e.which == 13) {
            userId = $("#userInputId").val();
            if(userId != ""){
                $("#inputId").modal('hide');
                document.getElementById("userId").innerHTML = userId;
            }
        }
    });

    socket.on('serverStatus',function(serverStatusFlag){
        console.log(serverStatusFlag)
        flag = serverStatusFlag;
        intervalOption = setInterval(requestInterval,1*1000);
    });

    $('form').submit(function(){
        var message = $("#message").val();
        if(message == ''){
            return false;
        }

        var messageBox = {"message" : message, "userId" : userId};

        socket.emit("chat message", messageBox);

        $('#message').val('');
        scrollFlag = true;
        return false;
    });

    socket.on('chat message', function(msg){
        
        var msg = JSON.parse(JSON.stringify(msg));

        $('#messages').append($('<li class="list-group-item"><span>'+msg["userId"]+'</span> '+msg["message"]+'</li>'));
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