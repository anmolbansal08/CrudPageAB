/// <reference path="../../Scripts/references.js" />

var SelectQuater = [{ Key: "", Text: "All" }, { Key: "1", Text: "1 - 3 Months" }, { Key: "2", Text: "3 - 6 Months" }, { Key: "3", Text: "6 - 9 Months" }, { Key: "4", Text: "9 - 12 Months" }];
//var SelectYear = [{ Key: "2017", Text: "2017" }, { Key: "2016", Text: "2016" }, { Key: "2015", Text: "2015" }, { Key: "2014", Text: "2014" }];
var SelectYear = [];
var OnBlob = false;
//var OnBlob = userContext.SysSetting.GenerateReportOnBlob == "Yes"
$(document).ready(function () {
 

    cfi.AutoCompleteV2("AirlineCode", "CarrierCode,AirlineName", "StockAgeingreport_Airline", null, "contains");
    $.ajax({
        url: "../StockAgeingReport/GetYearDropDown", success: function (result) {
            for (var i = parseInt(result) ; i >= 2014 ; i--) {
                SelectYear.push({ Key: i.toString(), Text: i.toString() })
            }
            cfi.AutoCompleteByDataSource("Year", SelectYear, null);
        }
    });
    $.ajax({
        url: "../Reports/ReportGenerateOnBlob",
        data:  {Apps:getQueryStringValue("Apps").toUpperCase() },
        success: function (result) {            
            OnBlob = (result == 'True');
        }       
    });

    cfi.AutoCompleteByDataSource("Quater", SelectQuater, null);
    cfi.AutoCompleteByDataSource("Year", SelectYear, null);


    if (userContext.AirlineName.substring(0, 3) != "" && userContext.AirlineCarrierCode != "" && userContext.AirlineCarrierCode.length > 3) {
        $("#AirlineCode").val(userContext.AirlineName.substring(0, 3));
        $("#Text_AirlineCode_input").val(userContext.AirlineCarrierCode);
    }

    $("#Quater").val('');
    $("#Text_Quater_input").val('All');

    $("#Year").val('2017');
    $("#Text_Year_input").val('2017');


});

function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");

    if (textId == "Text_AirlineCode") {
        cfi.setFilter(filterAirline, "IsInterline", "eq", "0")
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }
}



var Model = [];
function GetReportData() {
    Model = {
        AirlineCode: $('#AirlineCode').val(),
        Quater: $("#Quater").val(),
        Year: $("#Year").val(),
        IsAutoProcess: (OnBlob == true ? 0 : 1)
       
        
    };


    if (Model.AirlineCode != "" && Model.Year != "") {
      
        if (OnBlob) {
            $.ajax({
                url: "../Reports/StockAgeing",
                async: true,
                type: "GET",
                dataType: "json",
                data: Model,
                success: function (result) {

                    var data = result.Table0[0].ErrorMessage.split('~');

                    if (parseInt(data[0]) == 0)
                        ShowMessage('success', 'Reports!', data[1]);
                    else
                        ShowMessage('warning', 'Reports!', data[1]);
                }
            });
        }
        else {
            $("#grid").kendoGrid({
                dataSource: {
                    transport: {
                        read: {
                            url: "GetRecord",
                            datatype: 'json',
                            method: 'post',
                            data: Model
                        }
                    }, parameterMap: function (data, operation) {
                        alert(JSON.stringify(data));
                        return JSON.stringify(data);
                    },
                    schema: {
                        model: {
                            id: "Quater",
                            fields: {
                                //AWBPrefix: { type: "number" },
                                Quater: { type: "string" },
                                NoofAwb: { type: "string" }
                            }
                        }, data: "Data",
                        total: function (response) {
                            return response != undefined ? response.Data != undefined ? response.Data.length : 0 : 0;
                        }
                    },
                    pageSize: 20,
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true
                },
                height: 350,
                filterable: true,
                sortable: true,
                pageable: true,
                columns: [
                     { field: "Quater", title: "Period of Ageing" },
                    //{ field: "NoofAWb", title: "No of AWb", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"#=Quater#\")'>#= NoofAWb #</a>" },
                      { field: "NoofAwb", title: "No of AWBs", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"#=Quater#\")'>#= NoofAwb #</a>" }
                      //, template: "<a href='\\\#' class='name-link' >#= NoofAWb #</a>"
                ]
            });
        }
        //AWBPrefix = e.data.AWBPrefix;
    }
}

function ExportToExcel(Quater) {
    Model.AirlineCode = $('#AirlineCode').val();
    Model.Year = $("#Year").val();

    if (Quater == "1 - 3 MONTHS") {
        Model.Quater = "1"
    }
    else if (Quater == "3 - 6 MONTHS") {
        Model.Quater = "2"
    }
    else if (Quater == "6 - 9 MONTHS") {
        Model.Quater = "3"
    }
    else if (Quater == "9 - 12 MONTHS") {
        Model.Quater = "4"
    }
    else if (Quater = "All") {
        Model.Quater = ""
    }

    if (Model.AirlineCode != "" && Model.Year != "") {
        window.location.href = "../StockAgeingReport/GetCodeDescription?AirlineSNo=" + Model.AirlineCode + "&Quater=" + Model.Quater + "&Year=" + Model.Year+"&IsAutoProcess=1";

    }
}

