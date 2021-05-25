var Chart;
var Chart2;
var ChartType = 'column';
var BucketName = [];
var Sliders = [];
var MajorSlider;
var Allocation = [];
var Rates=[];
var Effect=[];
var isPercentage=[];
var Allocated = 0;
var Capacity = 0;
var Rate = 0;
var ChartData = [{
    name: "Revenue",
    axis: "AxisRevenue",
    data: $.map(Allocation, function (val, key) {
        return (parseFloat(val))
    })
}, {
    name: "New Revenue",
    axis: "AxisAllocation",
    data: Allocation
}];
var ChartData2 = [{
    name: "Rate",
    axis: "ARevenue",
    data: []
}, {
    name: "NewRate",
    axis: "AAllocation",
    data: []
}];
var MaxRevenue = 0;
var MaxWeight = 0;
var AxisValue = [];
function createChart() {
    ChartData[0].name="Revenue";
    ChartData[0].data = $.map(Allocation, function (val, key) {
        var rate=parseFloat(Rates[key]);
        var computedValue;
        if(isPercentage[key])
        {
            computedValue=Rate*rate/100;
        }
        else
        {
            computedValue=rate;
        }
       // console.log(Effect[key]);
        computedValue=Effect[key]=="+"?computedValue:-1*computedValue;
        computedValue=Rate+computedValue;
        return (computedValue*(Capacity*(Allocation[key]/100)));
    }); 
    ChartData[1].name="New Revenue";
    ChartData[1].data =$.map(Allocation, function (val, key) {
        var rate=parseFloat(Rates[key]);
        var val=(rate*Capacity *Allocation[key] / 100);
        // console.log(delta,"delta",val,newval);
        var delta=val*isNaN(parseFloat($("#txtRevenueChange").val()))?0:parseFloat($("#txtRevenueChange").val());
        delta=val*delta/100; 
        var newval=val+delta*(Effect[key]=="+"?1:-1);
        newrate=(newval*100/(Capacity*Allocation[key]));
        var computedValue;
        if(isPercentage[key])
        {
            computedValue=Rate*newrate/100;
        }
        else
        {
            computedValue=newrate;
        }
       // console.log(Effect[key]);
        computedValue=Effect[key]=="+"?computedValue:-1*computedValue;
        computedValue=Rate+computedValue;
        return (computedValue*(Capacity*(Allocation[key]/100)));
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
            title: { text: "New Revenue" },
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
            format: "{0}%",
            template: "#= series.name #: #= value #"
        }
    });
}
function createChartRates() {
    ChartData[0].data = $.map(Allocation, function (val, key) {
        var computedValue;
        if(isPercentage[key])
        {
            computedValue=Rate*Rates[key]/100;
        }
        else
        {
            computedValue=newrate;
        }
       // console.log(Effect[key]);
        computedValue=Effect[key]=="+"?computedValue:-1*computedValue;
        computedValue=Rate+computedValue;
        return (computedValue);
    });
    ChartData[0].name="Rates";
    ChartData[1].name="New Rates";
    ChartData[1].data =$.map(Allocation, function (val, key) {
        var rate=parseFloat(Rates[key]);
        var val=(rate*Capacity *Allocation[key] / 100);
         //console.log(delta,"delta",val,newval);
        var delta=val*isNaN(parseFloat($("#txtRevenueChange").val()))?0:parseFloat($("#txtRevenueChange").val());
        delta=val*delta/100; 
        var newval=val+delta*(Effect[key]=="+"?1:-1);
        newrate=(newval*100/(Capacity*Allocation[key]))

         var computedValue;
        if(isPercentage[key])
        {
            computedValue=Rate*newrate/100;
        }
        else
        {
            computedValue=newrate;
        }
       // console.log(Effect[key]);
        computedValue=Effect[key]=="+"?computedValue:-1*computedValue;
        computedValue=Rate+computedValue;

        return (computedValue);
    }); 
    Chart=$("#chart2").kendoChart({
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
            title: { text: "Rates" },
        }, {
            name: "AxisAllocation",
            color:"#A0A700",
            title: { text: "New Rates" },
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
            format: "{0}%",
            template: "#= series.name #: #= value #"
        }
    });
}

$(document).ready(function () {
    $(document).bind("kendo:skinChange", createChart);
    $(document).bind("kendo:skinChange", createChartRates);   
    cfi.ValidateForm();
    $("#txtRevenueChange").change(function(){
        if(parseFloat($(this).val())<0||parseFloat($(this).val())>100)
        {
            if(parseFloat($(this).val())>100)
            {
                $(this).val('100');
            }
            else
            {
                 $(this).val('0');
            }
        }
        createChart();
        createChartRates();
    })
    cfi.AutoComplete('txtFlightNo', "FlightNo", "vDailyFlight", "FlightNo", "FlightNo", null, null, "contains", null, null, null, null, null);
    $("#btnSubmit").click(function () {
        if (!cfi.IsValidForm()) {
            return;
        }
        $("#wrapper").html("");
       Check();
        $.ajax({
            type: "GET",
            url: "./Services/DashBoardHomeService.svc/GetRevenueVsSlabs",
            data: {UserId:1,FlightNo: $("#txtFlightNo").val(), FlightDate: $("#txtFlightDate").val() },
            dataType: "json",
            success: function (response) {
            Allocation=[];
            Rates=[];
            AxisValue = [];
            Effect=[];
            isPercentage=[];
            $.each(response, function (key, val) {
                    if (key == 0) {
                        Capacity = val.Allocated;
                        Rate = val.Rate;
                    }
                    else 
                    {
                        AxisValue.push(val.BucketName);
                        Effect.push(val.Effect);
                        isPercentage.push(val.IsPercent);
                        Rates.push(val.Rate)
                        Allocation.push(val.Allocated);
                        // console.log(Allocation);
                    }
             })
             //end of each
              createChart();
              createChartRates();
            },
            complete: function () {
            StopProgress();
            }
        });
    })
})