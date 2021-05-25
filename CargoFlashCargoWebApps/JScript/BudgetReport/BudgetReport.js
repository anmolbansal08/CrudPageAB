var Airports = new Array();

$(document).ready(function () {
    $("#ToDate,#FromDate").kendoDatePicker({
        // defines the start view
        start: "year",
        // defines when the calendar should return date
        depth: "year",
        // display month and year in the input
        format: "MMM-yyyy",
        // specifies that DateInput is used for masking the input element
        dateInput: false,
        value: new Date(),
        readonly:false
    });

    cfi.AutoCompleteV2("OriginSNo", 'AirportCode,AirportName', 'BudgetReport_Airport', null, "contains");
    cfi.AutoCompleteV2("DestinationSNo", 'AirportCode,AirportName', 'BudgetReport_Airport', null, "contains");

    $('#OriginSNo').val(userContext.AirportSNo);
    $('#Text_OriginSNo_input').val((userContext.AirportCode + '-' + userContext.AirportName).toUpperCase());

    $("#tabstripSearch, #tabstripReport").kendoTabStrip({
        animation: {
            open: {
                effects: "fadeIn"
            }
        }
    })

    var tabStrip = $("#tabstripReport").kendoTabStrip().data("kendoTabStrip");    
    tabStrip.disable(tabStrip.tabGroup.children().eq(1));
    tabStrip.disable(tabStrip.tabGroup.children().eq(2));

    $("#ToDate").change(function (e) {
        var EndValue = $(e.target).val();
        var StartValue = $('#' + $(this).attr("id").replace("ToDate", "FromDate")).val();

        if ((new Date(StartValue) > new Date(EndValue)) && EndValue != '' && StartValue != '') {
            $("input[id^=ToDate]").val('');
            e.preventDefault();
            return false;
        }
        

    });

    $("#FromDate").change(function (e) {
        var StartValue  = $(e.target).val();
        var EndValue = $('#' + $(this).attr("id").replace("FromDate", "ToDate")).val();

        if ((new Date(StartValue) > new Date(EndValue)) && EndValue != '' && StartValue != '') {
            $("input[id^=FromDate]").val('');
            e.preventDefault();
            return false;
        }
        if ($('#FromDate').val()!='')
        {
            $("#FromDate").data("kendoDatePicker").min($('#FromDate').val());
        }

    });

    $('input[name="ReportType"]').on('click', function (e) {

        var tabStrip = $("#tabstripReport").kendoTabStrip().data("kendoTabStrip");
        if ($('input[name="ReportType"]:checked').val() == "Graph") {
            tabStrip.disable(tabStrip.tabGroup.children().eq(0));
            tabStrip.enable(tabStrip.tabGroup.children().eq(1), true);
            tabStrip.enable(tabStrip.tabGroup.children().eq(2), true);
            tabStrip.select(1);
        }
        else {
            tabStrip.disable(tabStrip.tabGroup.children().eq(1));
            tabStrip.disable(tabStrip.tabGroup.children().eq(2));
            tabStrip.enable(tabStrip.tabGroup.children().eq(0), true);
            tabStrip.select(0);
        }

    });
})
//ajax call for grid data.
function GetTargetBudgetData() {

    ShowLoader(true);
    
    $('#tabstripReport-1,#tabstripReport-2,#tabstripReport-3').html('');

    $("#tabstripReport-1").html('<div id="Grid" style="width:100%; overflow:auto;"></div>');
    $("#tabstripReport-2").html('<div id="RevenueGraph" style="width:100%; overflow:auto; background-color: white;"><div id="RevenueChart" style="height:400px; width:auto;"> </div></div>');
    $("#tabstripReport-3").html('<div id="TonnageGraph" style="width:100%; overflow:auto;background-color: white;"><div id="TonnageChart" style="height:400px; width:auto;"> </div></div>');

    Model = {
        FromDate: $('#FromDate').val() || '',
        ToDate: $("#ToDate").val() || '',
        OriginSNo: $('#OriginSNo').val() || 0,
        DestinationSNo: $("#DestinationSNo").val() || 0,
        Type:( $('input[name="ReportType"]:checked').val() == 'Grid'?0:1)
    };

    if (!cfi.IsValidSubmitSection()) {
        ShowLoader(false);
        return false;
    }
    else if ($('input[name="ReportType"]:checked').val() == 'Grid') {

        $("#Grid").kendoGrid({
            autoBind: true,
            toolbar: ["excel"],
            excel: {
                allPages: true
            },
            dataSource: new kendo.data.DataSource({
                type: "json",
                serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 50,
                transport: {
                    read: {
                        cache: false,
                        url: "GetTargetBudgetGridData",
                        dataType: "json",
                        global: true,
                        type: 'POST',
                        method: 'POST',
                        contentType: "application/json; charset=utf-8",
                        data: {Budget : Model },
                    }, parameterMap: function (options) {
                        if (options.filter == undefined)
                            options.filter = null;
                        if (options.sort == undefined)
                            options.sort = null; return JSON.stringify(options);
                    },
                },
                schema: {
                    model: {
                        fields: {
                            Months: { type: "string" },
                            BaseNoOfFlights: { type: "number" },
                            BaseCapacityWeight: { type: "number" },
                            BaseTargetPercent: { type: "number" },
                            BaseTargetWeight: { type: "number" },
                            BaseTargetYield: { type: "number" },
                            BaseTargetRevenue: { type: "number" },
                            RevisedNoOfFlights: { type: "number" },
                            RevisedCapacityWeight: { type: "number" },
                            RevisedTargetPercent: { type: "number" },
                            RevisedTargetWeight: { type: "number" },
                            RevisedTargetYield: { type: "number" },
                            RevisedTargetRevenue: { type: "number" },
                            AchievedNoOfFlights: { type: "number" },
                            AchievedCapacityWeight: { type: "number" },
                            AchievedTargetPercent: { type: "number" },
                            AchievedTargetWeight: { type: "number" },
                            AchievedTargetYield: { type: "number" },
                            AchievedTargetRevenue: { type: "number" },
                            AchievedVsBaseTonnageTarget: { type: "number" },
                            AchievedVsBaseRevenueTarget: { type: "number" },
                            AchievedVsRevisedTonnageTarget: { type: "number" },
                            AchievedVsRevisedRevenueTarget: { type: "number" }
                        }
                    }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
                },

            }),
            sortable: false, filterable: false,
            pageable: { refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: true, },
            scrollable: { virtual: true },
            dataBound: onGridDataBound,
            columns: [                  
                { field: "BudgetName", title: "Budget Name", width: "auto" },
                {
                    field: "Months", title: "Months", width: "auto",
                    // template: '<a  href="" onclick="ViewGraph(this)"> #:Months# </a>'
                    template: '<input type="button" class="btn-info" onclick="ViewGraph(this)" value=" #:Months#">'

                },
                {
                    title: "Base Target",
                    columns: [
                   { field: "BaseNoOfFlights", title: "No of Flights", width:"auto" },
                   { field: "BaseCapacityWeight", title: "Capacity Weight(Kg)", width: "auto" },
                   { field: "BaseTargetPercent", title: "Target %", width: "auto" },
                   { field: "BaseTargetWeight", title: "Tonnage Target", width: "auto" },
                   { field: "BaseTargetYield", title: "Yield", width: "auto" },
                   { field: "BaseTargetRevenue", title: "Revenue Target", width: "auto" }
                    ]
                },

                {
                    title: "Revised Target",
                    columns: [
                        { field: "RevisedNoOfFlights", title: "No of Flights", width: "auto" },
                        { field: "RevisedCapacityWeight", title: "Capacity Weight(Kg)", width: "auto" },
                        { field: "RevisedTargetPercent", title: "Target %", width: "auto" },
                        { field: "RevisedTargetWeight", title: "Tonnage Target", width: "auto" },
                        { field: "RevisedTargetYield", title: "Yield", width: "auto" },
                        { field: "RevisedTargetRevenue", title: "Revenue Target", width: "auto" }
                    ]
                },
                {
                    title: "Achieved Target",
                    columns: [
                        { field: "AchievedNoOfFlights", title: "No of Flights", width: "auto" },
                        { field: "AchievedCapacityWeight", title: "Capacity Weight(Kg)", width: "auto" },
                    { field: "AchievedTargetPercent", title: "Target %", width: "auto" },
                    { field: "AchievedTargetWeight", title: "Tonnage Target", width: "auto" },
                    { field: "AchievedTargetYield", title: "Yield", width: "auto" },
                    { field: "AchievedTargetRevenue", title: "Revenue Target", width: "auto" }
                    ]
                },
                {
                    title: "Achieved Vs Base",
                    columns: [
                        { field: "AchievedVsBaseTonnageTarget", title: "Tonnage %", width: "auto" },
                        { field: "AchievedVsBaseRevenueTarget", title: "Revenue %", width: "auto" },
                    ]
                },
                {
                    title: "Achieved vs Revised",
                    columns: [
                        { field: "AchievedVsRevisedTonnageTarget", title: "Tonnage %", width: "auto" },
                        { field: "AchievedVsRevisedRevenueTarget", title: "Revenue %", width: "auto" },
                    ]
                }
            ]
        });
        $('span.k-i-excel').removeClass('k-icon');

        $("#Grid").kendoTooltip({
            filter: "table tr:not(.k-grouping-row):not(.k-footer-template) :nth-child(n):not(.k-group-cell):not(:empty):not(:has(div)):not(:has(input)):not(:has(span:not(.k-dirty):not(.k-filter):empty)):not(a)",
                content: function (e) {
                    var target = e.target;
                    return $(target).text();
                }
        });
    }
    else if ($('input[name="ReportType"]:checked').val() == 'Graph')
    {
            $.ajax({
                url: "../BudgetReport/GetTargetBudgetGridData",
                async: true,
                type: "POST",
                dataType: "json",
                data: ({}, {}, {}, Model),
                success: function (result) {

                    var Length = result.Data.length;
                    var Data = result.Data;

                    if (Length > 0)
                    {                        
                        var TonBaseData = [];
                        var TonRevData = [];
                        var TonAchData = [];
                        var RevBaseData = [];
                        var RevRevData = [];
                        var RevAchData = [];
                        var Categories = [];

                        $.each(Data, function (idx, item) {
                            Categories.push(item.Months);
                            TonBaseData.push(item.BaseTargetWeight);
                            TonRevData.push(item.RevisedTargetWeight);
                            TonAchData.push(item.AchievedTargetWeight);

                            RevBaseData.push(item.BaseTargetRevenue);
                            RevRevData.push(item.RevisedTargetRevenue);
                            RevAchData.push(item.AchievedTargetRevenue);

                        });

                        MakeGraph("RevenueChart", "Revenue Comparison", RevBaseData, RevRevData, RevAchData, Categories);
                        MakeGraph("TonnageChart", "Tonnage Comparison", TonBaseData, TonRevData, TonAchData, Categories);
                    }
                    else 
                        ShowMessage('warning', 'Warning - Budget Graph Report', 'No Record Found.', " ", "bottom-right");
                },                              
                error: function (xhr) {
                    ShowMessage('warning', 'Warning - Budget Graph Report', 'No Record Found.', " ", "bottom-right");
                }
            });
    }

    ShowLoader(false);
}

function ViewGraph(obj) {
    var GraphData = [];
    var data = [];
    var Key = ["Base Target", "Revised Target", "Actual Achieved"];
    var i = 0;
    var row = $(obj).closest('tr');
    var BudgetName = row.find('td:eq(0)').text();
    var MonthName = (row.find('td:eq(1) input').val()).toUpperCase().trim();
    //var MaxValueAxis = 0.00;    

    row.find('td:gt(1):lt(18):not(:eq(1)):not(:eq(1)):not(:eq(5)):not(:eq(5)):not(:eq(9)):not(:eq(9))').each(function (idx, item) {
        var DT = parseFloat(item.textContent) || 0;
        data.push(DT);
        if ((idx + 1) % 4 == 0 )
        {
            GraphData.push({ key: Key[i], val: data });
            data = [];
            i++;
        }
        //if (MaxValueAxis < DT)
        //{
        //    MaxValueAxis = DT;
        //}
    });

    //var MaxValueAxis = parseInt('1' + PostZeros(MaxValueAxis.toString()).split('.')[0].length)/1000; // 1000 to convert in tons
    //var MinValueAxis = MaxValueAxis/10;

    PopUp("BudgetPopUp", BudgetName, 550, null, null, 40);
    $('#PopChart').html('');
    $("#PopChart").kendoChart({
        title: {
            text: MonthName+" Budget Report"
        },
        legend: {
            position: "top"
        },
        seriesDefaults: {
            type: "column"
        },
        /* series: [{
             name: "Base Target",
             data: [60, 168000, 5, 840000],
             labels: {
                 visible: true,
                 template: "#= value #"
             },
 
         }, {
             name: "Revised Target",
             data: [48, 134400, 4, 672000],
             labels: {
                 visible: true,
                 template: "#= value #"
             },
         }, {
             name: "Actual Achieved",
             data: [38, 107520, 3, 537600],
             labels: {
                 visible: true,
                 template: "#= value #"
             },
         }
         ],
         */
        series: [{
            name: GraphData[0].key,
            data: GraphData[0].val,
            labels: {
                visible: true,
                template: "#= value #"
            },
        },
        {
            name: GraphData[1].key,
            data: GraphData[1].val,
            labels: {
                visible: true,
                template: "#= value #"
            },
        }, {
            name: GraphData[2].key,
            data: GraphData[2].val,
            labels: {
                visible: true,
                template: "#= value #"
            },
        }
        ],
        seriesColors: ['#C9F2FF', '#FFB1CD', '#DDFFAF'],
        valueAxis: {
            name: "value",
            labels: {
                format: "{0:n0}",
            },
            //max: MaxValueAxis,
            //min: 0,
            ////majorUnit: (MaxValueAxis/10),
            //labels: {
            //    //format: '{0:N0}'
            //    template: "#= kendo.format('{0:N0}', MaxValueAxis / MinValueAxis) # Tons"
            //},
            //line: {
            //    //visible: false
            //    visible: false,
            //    background: "transparent"
            //}
            ////  ,          axisCrossingValue: 0
        },
        categoryAxis: {
            categories: ["No Of Flights", "Tonnage Target", "Yield", "Revenue Target"],
            line: {
                visible: false
            },
            labels: {
                // padding: { top: 60 }
            }
        },
        tooltip: {
            visible: true,
            format: '{0:N0}',
            template: "#= series.name.split(' ')[0]# #= category # : #= value #"
        },
        render: function (e) {           
            var range = e.sender.getAxis("value").range();
            var majorUnit = range.max / 10;
            var axis = e.sender.options.valueAxis;

            if (axis.majorUnit !== majorUnit) {
                axis.majorUnit = majorUnit;

                // We need to redraw the chart to apply the changes
                e.sender.redraw();
            }
        }
    });
}

function PostZeros(Len)
{    var RT='';
    for(var i=1;i<=Len;i++)
    {
        RT+='0';
    }
    return RT;
}

function MakeGraph(EleID, Name, BaseData, RevData, AchData, Categories)
{
    $("#"+EleID).kendoChart({
        title: {
            text: Name + " Budget Report"
        },
        legend: {
            position: "top"
        },
        seriesDefaults: {
            type: "column"
        },
        series: [{
            name: "Base Target",
            data: BaseData,
            labels: {
                visible: true,
                template: "#= value #"
            },
        },
        {
            name: "Revised Target",
            data: RevData,
            labels: {
                visible: true,
                template: "#= value #"
            },
        }, {
            name: "Actual Achieved",
            data: AchData,
            labels: {
                visible: true,
                template: "#= value #"
            },
        }
        ],
        seriesColors: ['#C9F2FF', '#FFB1CD', '#DDFFAF'],
        valueAxis: {
            name: "value",
            labels: {
                format: "{0:n0}",
            },
            //max: 2000000,
            //min: 0,
            //majorUnit: 200000,
            //line: {
            //    visible: false,
            //    background: "transparent"
            //}
        },
        categoryAxis: {
            categories: Categories,
            line: {
                visible: false
            },
            labels: {
                // padding: { top: 60 }
            }
        },
        tooltip: {
            visible: true,
            format: '{0:N0}',
            template: "#= series.name#: #= value #"
        },
        render: function (e) {
            var range = e.sender.getAxis("value").range();
            var majorUnit = range.max / 10;
            var axis = e.sender.options.valueAxis;

            if (axis.majorUnit !== majorUnit) {
                axis.majorUnit = majorUnit;

                // We need to redraw the chart to apply the changes
                e.sender.redraw();
            }
        }
    });
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function ExtraCondition(textId) {
    var filter = cfi.getFilter("AND");
    if (textId == "Text_OriginSNo") 
        cfi.setFilter(filter, "SNo", "neq", $('#DestinationSNo').val());
    if (textId == "Text_DestinationSNo") 
        cfi.setFilter(filter, "SNo", "neq", $('#OriginSNo').val());

    var RT_Filter = cfi.autoCompleteFilter(filter);
    return RT_Filter;
}

function PopUp(cntrlId, title, width, OnOpen, OnClose, topPosition) {
    var Kwindow = $("#" + cntrlId);

    if (!Kwindow.data("kendoWindow")) {
        Kwindow.kendoWindow({
            width: ((width == null || width == undefined || width == "") ? "800px" : width + "px"),
            actions: ["Minimize", "Maximize", "Close"],
            title: title,
            modal: true,
            maxHeight: 500,
            close: (OnClose == undefined ? null : OnClose),
            open: (OnOpen == undefined ? null : OnOpen)
        });
        Kwindow.data("kendoWindow").open();
    }
    else {
        var a = Kwindow.data("kendoWindow");
        a.setOptions({ title: title });
        a.open();
    }
    $(document).bind("keydown", function (e) {
        if (e.keyCode == kendo.keys.ESC) {
            var visibleWindow = $(".k-window:visible:last > .k-window-content")
            if (visibleWindow.length)
                visibleWindow.data("kendoWindow").close();
        }
    });

    Kwindow.data("kendoWindow").center();
    $("#" + cntrlId).closest(".k-window").centerTop(topPosition);

}

$.fn.centerTop = function (topPosition) {
    this.css("position", "absolute");
    if (topPosition)
        this.css("top", topPosition + "px");
    else
        this.css("top", ($(window).height() - this.height()) / 2 + $(window).scrollTop() + "px");
    this.css("left", ($(window).width() - this.width()) / 2 + $(window).scrollLeft() + "px");
    return this;
};