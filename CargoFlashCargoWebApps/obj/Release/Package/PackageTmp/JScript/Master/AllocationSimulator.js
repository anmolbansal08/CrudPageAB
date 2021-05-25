var Chart;
var Chart2;
var ChartType = 'column';
var BucketName = [];
var Sliders = [];
var MajorSlider;
var Allocation = [];
var Allocated = 0;
var Capacity = 0;
var Rate = 0;
var BucketRevenue=0;
var ChartData = [{
    name: "Revenue",
    axis: "AxisRevenue",
    data: $.map(Allocation, function (val, key) {
        return (parseFloat(val))
    })
}, {
    name: "Weight",
    axis: "AxisAllocation",
    data: Allocation
}];
var ChartData2 = [{
    name: "Revenue",
    axis: "ARevenue",
    data: []
},  {
        name: "Weight",
        axis: "AAllocation",
        data: []
    },{
    name: "Bucket Revenue",
    axis: "ARevenue",
    data: []
}
];
var MaxRevenue = 0;
var MaxWeight = 0;
var AxisValue = [];
function createChart() {
    ChartData[1].data = $.map(Allocation, function (val, key) {
        return (Capacity * MajorSlider.value() / 100 * Sliders[key].value() / 100);
    }); 
    ChartData[0].data = $.map(Allocation, function (val, key) {
        var computedValue = 0;
        var isPrecentage = $("#txtPrecentage" + (key + 1)).val();
        var Effect = $("#txtEffect" + (key + 1)).val();
        var curRate = $("#txtRate" + (key + 1)).val();
        var Weight = Capacity * Sliders[key].value() / 100;
        if (isPrecentage == 'P')
        {
            computedValue = ((Rate * MajorSlider.value() / 100) * curRate / 100);
        }
        else
        {
            computedValue = curRate;
        }
        computedValue = MajorSlider.value()==0?0:(Rate * MajorSlider.value() / 100) + parseFloat((Effect == "+" ? computedValue : computedValue * -1));
        return (parseFloat(computedValue*Weight));
    });
    Chart=$("#chart").kendoChart({
//        title: {
//            text: "Revenue vs Slabs"
//        },
        legend: {
            position: "top"
        },
        chartArea: {
            background: ""
        },
        			
        seriesDefaults: {
            type: ChartType
        },
        series: ChartData,
        valueAxes: [{
            name: "AxisRevenue",
            color: "#ec5e0a",
            title: { text: "Revenue" },
            
        }, {
            name: "AxisAllocation",
            color:"#A0A700",
            title: { text: "Allocation in Kg" },
           
        }],
        categoryAxis: {
            categories: AxisValue,
            majorGridLines: {
                visible: false
            },
            axisCrossingValues: [0, 10]
        },
        tooltip: {
            visible: true,
            format: "{0}",
            template: "#= series.name #: #= value #"
        }
    });
}

function createChartRevenue() {
    ChartData2[0].data=[];
    ChartData2[1].data=[];
    ChartData2[2].data=[];
    //REVENUE
    ChartData2[0].data.push(Capacity * Rate * MajorSlider.value()/100);
    ChartData2[1].data.push(0);
    ChartData2[2].data.push(0);
    //Bucket Revenue
    BucketRevenue=0;
    $.each( ChartData[0].data,function(key,val){
        BucketRevenue+=val;
    })
    ChartData2[0].data.push(0);
    ChartData2[1].data.push(0);
    ChartData2[2].data.push(BucketRevenue);
    //RATE
    ChartData2[0].data.push(0);
    ChartData2[1].data.push(Capacity * MajorSlider.value()/100);
    ChartData2[2].data.push(0);
    Chart2 = $("#chart1").kendoChart({
      
        legend: {
            position: "top"
        },
        chartArea: {
            background: ""
        },

        seriesDefaults: {
            type: "column"
        },
        series: ChartData2,
        valueAxes: [{
            name: "ARevenue",
             color: "#ec5e0a",
            title: { text: "Revenue" },

        },
        {
            name: "AAllocation",
            color:"#A0A700",
            title: { text: "Allocation in Kg" },

        }
        ],
        categoryAxis: {
            categories: ["Tariff Revenue  ","Bucket Revenue","Allocation"],
            majorGridLines: {
                visible: false
            },
            axisCrossingValues: [0, 10]
        },
        tooltip: {
            visible: true,
            format: "{0}%",
            template: "#= series.name #: #= value #"
        }
    });
}
function changeSliders(id,val) {
    var curKey = parseInt(id.replace("Text", ""), 10);
    var oldSum = 0;
    var newSum = 0;
    if (curKey == 0) {
        $("#divRateValueSlider0").text((MajorSlider.value() * Capacity / 100).toFixed(2)+"Kg ("+MajorSlider.value()+"%)");
        createChartRevenue();
        createChart();
        $.each(Sliders, function (key, val) {
           $("#divCurValueSlider" + (key + 1).toString()).text((val.value()*Capacity*MajorSlider.value()/10000).toFixed(2)+"Kg ("+(val.value()) + "%)");
        });
        return;
    }
    else 
    {
        oldSum=0;
        $.each(Sliders, function (key, val) {
            if (key != curKey-1) {
                oldSum += val.value();
            }
        });
        var delta = 100 - (oldSum + Sliders[curKey - 1].value());
        //newSum=0;
        $.each(Sliders, function (key, val) {
            if (key != curKey - 1) {
                var newval = parseFloat((val.value() + val.value() * (delta / (oldSum==0?Sliders.length-1:oldSum))).toFixed(0));
                //newSum += parseFloat(newval);
                val.value(newval);
            }
        });

        oldSum=0;
        $.each(Sliders, function (key, val) {
                oldSum += val.value();
        });
        delta=100-oldSum
        if(delta<0)
        {
            while(delta<0)
            {
                $.each(Sliders, function (key, val) 
                {
                    if (key != curKey-1) 
                    {
                        if(val.value()>0 && delta<0)
                        {
                            val.value(val.value()-1);
                            delta++;
                        }
                    }
                });
            }
        }
        else if(delta>0)
        {
            while(delta>0)
            {
                $.each(Sliders, function (key, val) 
                {
                    if (key != curKey-1) 
                    {
                        if(delta>0)
                        {
                            val.value(val.value()+1);
                            delta--;
                        }
                    }
                });
            }
        }
        $.each(Sliders, function (key, val) {
                        $("#divCurValueSlider" + (key + 1).toString()).text((val.value()*Capacity*MajorSlider.value()/10000).toFixed(2)+"Kg ("+(val.value()) + "%)");
        });
        createChart();
        createChartRevenue();
    }
}
$(document).ready(function () {
    $(document).bind("kendo:skinChange", createChart);
    $(document).bind("kendo:skinChange", createChartRevenue);   
    cfi.ValidateForm();
    cfi.AutoComplete('txtFlightNo', "FlightNo", "vDailyFlight", "FlightNo", "FlightNo", null, null, "contains", null, null, null, null, null);
    $("#btnSubmit").click(function () {
        if (!cfi.IsValidForm()) {
            return;
        }
        Check();
        $("#wrapper").html("");
        Sliders = [];
        $.ajax({
            type: "GET",
            url: "./Services/DashBoardHomeService.svc/GetRevenueVsSlabs",
            data: {UserId:1,FlightNo: $("#txtFlightNo").val(), FlightDate: $("#txtFlightDate").val() },
            dataType: "json",
            success: function (response) {
                $("#wrapper").append($("<table style='border:1px solid #BEBDBE;border-spacing:0'>").append($("<tr/><tr/><tr/><tr/><tr/><tr/><tr/><tr/>")));
                $.each(response, function (key, val) {
                    var divs = $('<td><div class="divs"><input id="Text' + key + '" class="balSlider"/><span style="color:#0574B8"></div></td>')
                    if (key == 0) {
                        Allocation = [];
                        AxisValue = [];
                        $("#wrapper table tr:eq(0)").append($("<td style='width:100px;text-align:left;border-bottom:1px solid red'>ALLOCATED</td>"));
                        $("#wrapper table tr:eq(1)").append($("<td style='width:100px;text-align:left;border-bottom:1px solid red'>MAXIMUM</td>"));
                        $("#wrapper table tr:eq(2)").append($("<td/>"));
                        $("#wrapper table tr:eq(3)").append($("<td style='border-top:1px solid #BEBDBE'>").append('BUCKET NAME'));
                        $("#wrapper table tr:eq(4)").append($('<td style="">RATE</td>'));
                        $("#wrapper table tr:eq(5)").append($('<td style="" colspan="2">EFFECT</td>'));
                        $("#wrapper table tr:eq(6)").append($('<td style="" colspan="2">PERCENTAGE</td>'));
                        $("#wrapper table tr:eq(7)").append($('<td style="" colspan="2"></td>'));
                    }
                    if (key == 0) {
                        Capacity = val.Allocated;
                        Rate = val.Rate;
                        $("#wrapper table tr:eq(4)").append($('<td id="colRate" colspan="1"></td>').append("<span style='color:black'>"+val.Rate.toFixed(2)+"</span>"));
                        $("#wrapper table tr:eq(0)").append($('<td style="border-bottom:1px solid red"><div id="divRateValueSlider' + key + '"style="height:30px;color:#ff6800;text-align:left">' + val.Allocated + 'Kg (100%)</div></td>'));
                    }
                    else {
                        AxisValue.push(val.BucketName);
                        Allocation.push(val.Allocated);
                        var Input = "<input type='text' id='txtRate" + key + "' value='" + val.Rate + "' style='width:50px'>";
                        $("#wrapper table tr:eq(4)").append($('<td id="colRate" style="width:40px">').append($(Input)));
                        Input="";
                        Input += "<input type='hidden'  name='txtEffect" + key + "' id='txtEffect" + key + "' value='" + val.Effect + "' style='width:20px'>";
                        Input += "<input type='text' controltype='autocomplete' autocomplete='off' data-role='autocomplete' name='Text_txtEffect" + key + "' id='Text_txtEffect" + key + "' value='" + val.Effect + "' style='width:20px'>";
                        $("#wrapper table tr:eq(5)").append($('<td id="colRate" style="width:40px">').append($(Input)));
                        Input="";
                        Input += "<input type='hidden'  name='txtPrecentage" + key + "' id='txtPrecentage" + key + "' value='" + (val.IsPercent ? "P" : "F") + "' style='width:20px'>";
                        Input += "<input type='text' controltype='autocomplete' autocomplete='off' data-role='autocomplete'  name='Text_txtPrecentage" + key + "' id='Text_txtPrecentage" + key + "' value='" + (val.IsPercent ? "Y" : "N") + "' style='width:20px'>";
                        $("#wrapper table tr:eq(6)").append($('<td id="colRate"> style="width:40px"').append($(Input)));
                        $("#wrapper table tr:eq(0)").append($('<td style="border-bottom:1px solid red"><div id="divCurValueSlider' + key + '"style="height:30px;color:green;text-align:left">'+(val.Allocated*Capacity/100).toFixed(2)+'Kg (' + val.Allocated + '%)</div></td>'));
                        cfi.AutoCompleteByDataSource('txtEffect' + key, [{ Key: "+", Text: "+" }, { Key: "-", Text: "-" }]);
                        cfi.AutoCompleteByDataSource('txtPrecentage' + key, [{ Key: "P", Text: "Y" }, { Key: "F", Text: "N" }]);
                        cfi.Numeric("txtRate" + key,2);
                        $("#txtRate" + key).unbind("change").bind("change",function(){
                            createChart();
                            createChartRevenue();
                        });
                        $("#Text_txtEffect" + key).unbind("change").bind("change",function(){
                            $("#txtEffect").val($(this).val());
                            createChart();
                            createChartRevenue();
                        });
                         $("#Text_txtPrecentage" + key).unbind("change").bind("change",function(){
                            $("#txtPrecentage").val($(this).val());
                            createChart();
                            createChartRevenue();
                        })
                    }
                    $("#wrapper table tr:eq(1)").append($('<td style="border-bottom:1px solid red"><div><span style="color:red">' + 100 + ' %</span></div></td>'));
                    $("#wrapper table tr:eq(2)").append($('<td style="">').append(divs));
                    if(key==0)
                    {
                       $("#wrapper table tr:eq(3)").append($('<td style="color:black;border-top:1px solid darkgray;font-weight:normal">').append(val.BucketName));
                    }
                    else
                    {
                       $("#wrapper table tr:eq(3)").append($('<td style="color:#0774B8;border-top:1px solid #BEBDBE">').append(val.BucketName)); 
                    }
                    var num = 100;
                    large = 10;
                    small = 2;
                    var slider = $("#Text" + key.toString()).kendoSlider({
                        orientation: "vertical",
                        change: function (e) {
                            $(e.sender.element.attr("id").replace("Text", "#divCurValueSlider")).text(e.value + " %");
                            changeSliders(e.sender.element.attr("id"), e.value);
                        },
                        slide: function (e) {
                            $(e.sender.element.attr("id").replace("Text", "#divCurValueSlider")).text(e.value + " %");
                            changeSliders(e.sender.element.attr("id"), e.value);
                        },
                        name: "Slider",
                        min: 0,
                        tooltip: { visible: true, format: "{0}", template: "" },
                        tickPlacement: "both",
                        max: 100,
                        smallStep: small,
                        largeStep: large,
                        value: key==0?100:val.Allocated,
                        showButtons: false
                    }).data("kendoSlider");
                    if (key > 0) {
                        // console.log("slider", key);
                        Sliders.push(slider);
                    }
                    else {
                        MajorSlider = slider;
                    }
                })
                //end of each
                createChart();
                createChartRevenue();
            },
            complete: function () {
            StopProgress();
            }
        });
    })
})