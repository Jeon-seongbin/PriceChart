var socket = io.connect("http://127.0.0.1:8080");

var priceChart = document.getElementById("myChart");
var priceChart = document.getElementById("myChart").getContext("2d"); 

var chartData = [];
var chartTime = [];

function pricedataParser(json){
    for (var length = 0; length < Object.keys(json).length; length++) {
        if(json[length].exchange === "coincheck"){
            chartData.push(json[length].price);
            chartTime.push(json[length].time)
        }
    }
}

$(document).ready(function(){

    setInterval(function(){

         $.ajax({
            //url:"localhost:8080/getPriceData",
            url:"./getPriceData",
            type: 'post',
            dataType:'json',
            success : function(data){
                chartData = [];
                chartTime = [];
                console.log("success",data);
                pricedataParser(data);

                var priceChart = document.getElementById("myChart");
                var myChart = new Chart(priceChart, {
                    type: 'line',
                    data: {
                        labels: chartTime,
                        datasets: [{
                            label: 'Coin chart',
                            data: chartData,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                            ],
                            borderColor: [
                                'rgba(255,99,132,1)',
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero:true
                                }
                            }]
                        }
                    }
                });
            },
           error: function( data ) {
                console.log("fail");
              //    alert(data);
            }
        });
     },5000);

    $('form').submit(function(){
        socket.emit('chat message', $('#message').val());
        $('#message').val('');
        return false;
    });
});