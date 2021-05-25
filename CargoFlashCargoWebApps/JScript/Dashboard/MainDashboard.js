/// <reference path="F:\ProjectsCollection\naRes\Cargoflash.Garuda.Reservation\GADev\CargoFlashCargoWebApps\Scripts/references.js" />

$(function () {
    $.ajax({
        url: 'HtmlFiles/Dashboard/MainDashboard.html',
        success: function (result) {
            $("body").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });
            cfi.ValidateForm();
            // window.parent.$("#divSlider").trigger("click");
            PrepareView();
            $("#Airline").val(userContext.AirlineSNo);
            var a = new Date();
            var b = new Date(a.getFullYear(), a.getMonth(), 1);
            $("#StartDate").attr("sqldatevalue", kendo.toString(b, 'yyyy-MM-dd'));
            $("#EndDate").attr("sqldatevalue", kendo.toString(new Date(), 'yyyy-MM-dd'));
            $("#Country").val("107");//107
            $("#City").val("");
            $("#Currency").val("");

            $("#divRightContent").append("<iframe id='ifra' width='99%' height='600px' src='HtmlFiles/Dashboard/DashboardChart.html'></iframe>");
        }
    });
});



function onpanelbarSelect(e) {
    // alert("Select: " + $(e.item).find("> .k-link").text());
}
function PrepareView() {
    function startChange() {
        var startDate = start.value(),
        endDate = end.value();

        if (startDate) {
            startDate = new Date(startDate);
            startDate.setDate(startDate.getDate());
            end.min(startDate);
        } else if (endDate) {
            start.max(new Date(endDate));
        } else {
            endDate = new Date();
            start.max(endDate);
            end.min(endDate);
        }
    }

    function endChange() {
        var endDate = end.value(),
        startDate = start.value();

        if (endDate) {
            endDate = new Date(endDate);
            endDate.setDate(endDate.getDate());
            start.max(endDate);
        } else if (startDate) {
            end.min(new Date(startDate));
        } else {
            endDate = new Date();
            start.max(endDate);
            end.min(endDate);
        }
    }
    var d = new Date();
    d.setHours(d.getHours() - 1);
    var start = $("#StartDate").kendoDatePicker({
        change: startChange,
        value: d,
        format: "dd-MMM-yyyy",
    }).data("kendoDatePicker");

    var d = new Date();
    var end = $("#EndDate").kendoDatePicker({
        change: endChange,
        value: d,
        format: "dd-MMM-yyyy",
    }).data("kendoDatePicker");

    start.max(end.value());
    end.min(start.value());

    cfi.AutoCompleteV2("Airline", "CarrierCode,AirlineName", "Shipment_Walking_AirlineCode", null, "contains");
    cfi.AutoCompleteV2("Currency", "CurrencyCode,CurrencyName", "Office_Currency", null, "contains");
    cfi.AutoCompleteV2("Country", "CountryCode,CountryName", "Manage_Penalty_Country", null, "contains");
    cfi.AutoCompleteV2("City", "CityCode,CityName", "Manage_Penalty_City", null, "contains", ",");


    //$("#splitter").kendoSplitter({
    //    contentLoad: function (e) {
    //    },
    //    panes: [
    //        { collapsible: true, collapsedSize: "100%", resizable: false, size: "250px" },
    //    ]
    //});
    //$("#panelbar").kendoPanelBar({
    //    expandMode: "single",
    //    select: onpanelbarSelect
    //});

    $("#Search").click(function () { GridChartChange(); });

    $("input[name='radGrid']").click(function () {
        GridChartChange();
    });
}
function GridChartChange() {
    $("#divRightContent").html('');
    if ($("input[name='radGrid']:checked").val() == 0) {
        Search();
    }
    else {
        if (!cfi.IsValidForm()) return false;

        $("#divRightContent").append("<iframe id='ifra' width='" + ($(window).width() - 10) + "' height='" + ($(window).height() - 10) + "' src='HtmlFiles/Dashboard/DashboardChart.html'></iframe>");
    }
}

function ExtraCondition(textId) {
    if (textId.indexOf("Text_City") >= 0) {
        var filter1 = cfi.getFilter("AND");
        cfi.setFilter(filter1, "CountrySNo", "eq", $('#Country').val());
        return cfi.autoCompleteFilter(filter1);
    }
}

function Search() {
    if (!cfi.IsValidForm()) return false;
    $("#divRightContent").html('').hide();
    var obj = {
        Airline: $("#Airline").val(), FromDate: $("#StartDate").attr("sqldatevalue"), ToDate: $("#EndDate").attr("sqldatevalue"), Country: $("#Country").val(), City: $("#City").val(), Currency: $("#Currency").val(), Mode: "0"
    };
    $.ajax({
        url: "Services/Dashboard/MainDashboardService.svc/GetRecord",
        type: "POST",
        dataType: 'json',
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            try {
                if (response) {
                    var res = JSON.parse(response);
                    res = Object.values(res);

                    var k = 1;
                    for (var i = 0; i < res.length; i++) {
                        var t = '<div class="k-box" style="box-shadow: 5px 10px ' + getRandomColor() + ';"><ul>';
                        var tbl = Object.values(res[i]);
                        tbl = Object.values(tbl[0]);
                        for (var j = 0; j < tbl.length; j++) {
                            var v = tbl[j].split(':')[0].trim();
                            var vv = (tbl[j].split(':')[1]).replace('<b>', '').replace('</b>', '').trim();
                            t += '<li onclick="GetLiData(' + k + ',this)" >' + v + ' : <b>' + parseInt(vv).toLocaleString() + '</b></li>';
                            k++;
                        }
                        t += '</ul></div>';
                        $("#divRightContent").append(t);
                        setTimeout(function () { $("#divRightContent").show('slow') }, 100);
                    }

                }
            } catch (e) {
                ShowMessage("info", "", "No Data found.");
            }
        }
    });

}
var excelResult = '';
function GetLiData(i, li) {
    $("#divPopup").html('');
    excelResult = '';
    var obj = {
        Airline: $("#Airline").val(), FromDate: $("#StartDate").attr("sqldatevalue"), ToDate: $("#EndDate").attr("sqldatevalue"), Country: $("#Country").val(), City: $("#City").val(), Currency: $("#Currency").val(), Mode: i
    };
    $.ajax({
        url: "Services/Dashboard/MainDashboardService.svc/GetLiData",
        type: "POST",
        dataType: 'json',
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            try {
                if (response) {
                    var result = JSON.parse(response);
                    excelResult = result;
                    var tbl = "<table id='tblMainData' class='appendGrid ui-widget'><tr>";
                    $.each(result.Table0[0], function (key, value, i) {
                        tbl += '<td class="ui-widget-header">' + key + '</td>';
                    });
                    tbl += '</tr>';
                    for (var i = 0; i < result.Table0.length; i++) {
                        tbl += '<tr>';
                        $.each(result.Table0[i], function (key, value, i) {
                            tbl += '<td class="ui-widget-content">' + value + '</td>';
                        });
                        tbl += '</tr>';
                    }
                    tbl += "</table>";
                    $("#divPopup").html(tbl);
                    PopUp("divPopup", $(li).text(), ($(window).width() - 100), null, null, 10);
                    if ($(".fa-file-excel-o").length == 0)
                        $(".k-window-actions").prepend('<a href="#" title="Export to excel" onclick="ExportExcel(this)" class="k-window-action k-link"><span class="fa fa-file-excel-o"></span></a>');

                }

            } catch (e) {
                ShowMessage("info", "", "No Data found.");
            }
        }
    });
}

function ExportExcel(obj) {
    var tbl = "<html><body><table id='tblMainData' width='100%' cellspacing=0 border='1px'><tr bgcolor='#7bd2f6'>";
    $.each(excelResult.Table0[0], function (key, value, i) {
        tbl += '<td class="ui-widget-header">' + key + '</td>';
    });
    tbl += '</tr>';
    for (var i = 0; i < excelResult.Table0.length; i++) {
        var co = i % 2 == 0 ? "#EFF7FA" : "#FFFFFF";
        tbl += "<tr style='background-color:" + co + "'>";
        $.each(excelResult.Table0[i], function (key, value, i) {
            tbl += '<td class="ui-widget-content">' + value + '</td>';
        });
        tbl += '</tr>';
    }
    tbl += "</table></html></body>";
    var data_type = 'data:application/vnd.ms-excel';
    var a = document.createElement('a');
    a.href = data_type + ', ' + encodeURIComponent(tbl);
    a.download = $("#divPopup").data("kendoWindow").options.title.split(':')[0].trim() + '_.xls';
    a.click();
}

function PopUp(cntrlId, title, width, OnOpen, OnClose, topPosition) {

    var Kwindow = $("#" + cntrlId);

    if (!Kwindow.data("kendoWindow")) {
        Kwindow.kendoWindow({
            appendTo: "form#aspnetForm",
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
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}