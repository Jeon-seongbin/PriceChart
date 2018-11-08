const PORT = 3000;
var socket = io.connect("http://127.0.0.1:"+ PORT);

var dataPointsInfo = [];
var flag = 0;

function pricedataParser(json){

    var count = Object.keys(json).length;

    console.log("dataPointsInfo ",json[0].time);

    for (var length = 0; length < count; length++) {
        if(json[length].exchange === "coincheck"){  

            dataPointsInfo.push({x :new Date( json[length].time), y : json[length].price});
            console.log("dataPointsInfo ",{x : json[length].time , y : json[length].price});
        }
    }
}

var titleData = { text: " Chart"};
var axisYData = {
        title: " Price",
        valueFormatString: "#0,000",
        //suffix: "1000",
        prefix: "¥"
    };

var chartData =  [{
        type: "area",
        color: "rgba(54,158,173,.7)",
        markerSize: 0,
        xValueFormatString: "HH:MM",
        yValueFormatString: "$#,##0.##",
        dataPoints : dataPointsInfo
        }];

var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,  
    title : titleData,
    axisY: axisYData,
    data: chartData
    });

$(document).ready(function(){
    if(chart != null){
        chart.render();
    }
 
    setInterval(function(){
        
         $.ajax({
            //url:"localhost:8080/getPriceData",
            url:"/getPriceData",
            data : {"flag":flag},
            type: 'POST',
            dataType:'json',
            success : function(data){

                if(chart == null){
                    chart = new CanvasJS.Chart("chartContainer", {
                    animationEnabled: true,  
                    title : titleData,
                    axisY: axisYData,
                    data: chartData
                    });
                }
                console.log("success",data);
                pricedataParser(data);
                flag = 1;
                chart.render();

            },
           error: function( data ) {
                flag = 2;
                console.log("fail",flag);
                if( chart != null ){
                    chart.destroy();
                    chart = null;
                    dataPointsInfo = [];
                }
            }
        });
     },1*1000);

    $('form').submit(function(){
        socket.emit('chat message', $('#message').val());
        $('#message').val('');
        return false;
    });
    socket.on('chat message', function(msg){
      $('#messages').append($('<li>').text(msg));
    });
});