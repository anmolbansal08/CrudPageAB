var OnBlob = false;
$(document).ready(function () {
    $.ajax({
        url: "../Reports/ReportGenerateOnBlob",
        data: { Apps: getQueryStringValue("Apps").toUpperCase() },
        success: function (result) {
            OnBlob = (result == 'True');
        }
    });

    cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,AirlineName", "AWBStockStatus_Airline", null, "contains");
    cfi.AutoCompleteV2("CitySNo", "CityCode,CityName", "AWBStockStatus_City", null, "contains");
    cfi.AutoCompleteV2("OfficeSNo", "SNo,Name", "AWBStockStatus_Office", null, "contains");
    cfi.AutoCompleteV2("AgentSNo", "SNo,Name", "AWBStockStatus_Agent", null, "contains");
    cfi.AutoCompleteV2("StockType", "STSNo,StockType", "CreateStock_stocktypeStock", null, "contains");



    //if (userContext.GroupName == 'ADMIN' || userContext.GroupName == 'SUPER ADMIN')
    if (userContext.GroupName.indexOf('ADMIN') >= 0) {    //Comment By Akash bcz of Super Admin

    }
    else if (userContext.GroupName == "AGENT" || userContext.SysSetting.ClientEnvironment != "UK" && userContext.GroupName == "GSA" || userContext.GroupName == "GSSA") {

        if (userContext.AirlineName.substring(0, 3) != "" && userContext.AirlineName != "") {
            $('#AirlineSNo').val(userContext.AirlineName.substring(0, 3) == 0 ? "" : userContext.AirlineName.substring(0, 3));
            $('#Text_AirlineSNo_input').val(userContext.AirlineName);
        }

        if (userContext.OfficeSNo != "" && userContext.OfficeName != "") {
            $('#OfficeSNo').val(userContext.OfficeSNo == 0 ? "" : userContext.OfficeSNo);
            $('#Text_OfficeSNo_input').val(userContext.OfficeName);
        }

        if (userContext.CitySNo != "" && userContext.CityName != "") {
            $('#CitySNo').val(userContext.CitySNo == 0 ? "" : userContext.CitySNo);
            $('#Text_CitySNo_input').val(userContext.CityName);
        }

        if (userContext.AgentSNo != "" && userContext.AgentName != "") {
            $('#AgentSNo').val(userContext.AgentSNo == 0 ? "" : userContext.AgentSNo);
            $('#Text_AgentSNo_input').val(userContext.AgentName);
        }

        if (userContext.StockType != "") {
            $('#StockType').val(userContext.StockType == 0 ? "" : userContext.StockType);
            $('#Text_StockType_input').val(userContext.StockType);
        }

        cfi.EnableAutoComplete('AirlineSNo', false, false, null);//diasble
        cfi.EnableAutoComplete('OfficeSNo', false, false, null);//diasble
        cfi.EnableAutoComplete('CitySNo', false, false, null);//diasble
        cfi.EnableAutoComplete('AgentSNo', false, false, null);//diasble
        cfi.EnableAutoComplete('StockType', false, false, null);//diasble
    }
    else { }


    //$('#grid').css('display', 'none')


});

var CitySNoTemp = '';

function ExtraCondition(textId) {

    var filterAirline = cfi.getFilter("AND");

    if (textId == "Text_AirlineSNo") {
        cfi.setFilter(filterAirline, "IsInterline", "eq", "0");
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }

    if (textId == "Text_OfficeSNo") {
        cfi.setFilter(filterAirline, "AirlineCode", "eq", $("#Text_AirlineSNo").data("kendoComboBox").key());
        cfi.setFilter(filterAirline, "CitySNo", "eq", $("#Text_CitySNo").data("kendoComboBox").key());
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
        return OriginCityAutoCompleteFilter2;
    }

    if (textId == "Text_AgentSNo") {
        try {
            cfi.setFilter(filterAirline, "AirlineCode", "eq", $("#Text_AirlineSNo").data("kendoComboBox").key());
            cfi.setFilter(filterAirline, "OfficeSNo", "eq", $("#Text_OfficeSNo").data("kendoComboBox").key())
            cfi.setFilter(filterAirline, "IsBlacklist", "eq", 0);
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterAirline]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }

    if (textId == "Text_CitySNo") {
        if (CitySNoTemp != $("#Text_CitySNo").data("kendoComboBox").key()) {
            CitySNoTemp = $("#Text_CitySNo").data("kendoComboBox").key();

            $("#Text_OfficeSNo").data("kendoComboBox").value('');
            $("#Text_AgentSNo").data("kendoComboBox").value('');
        }
    }

}

//var AWBPrefix = "";
//var AirlineSNo = "";
//var OfficeSNo = "";
//var CitySNo = "";
//var AgentSNo = "";
//var StockType = "";
//var isColHide_Auto = false;
//var isColHide_NoAuto = false;

var Model=[];
function GetReportData() {
    //  debugger
    Model={
        AirlineSNo : $('#AirlineSNo').val(),
    OfficeSNo : $("#OfficeSNo").val() == null ? "" : $("#OfficeSNo").val(),
    CitySNo : $("#CitySNo").val() == null ? "" : $("#CitySNo").val(),
    AgentSNo : $("#AgentSNo").val() == null ? "" : $("#AgentSNo").val(),
    StockType : $("#Text_StockType").val(),

    isColHide_Auto : StockType == "AUTO" ? true : false,
    isColHide_NoAuto: StockType != "AUTO" ? true : false,
    pagesize: 10,
    IsAutoProcess: (OnBlob == true ? 0 : 1)
};
    if (AirlineSNo != "" && StockType != "") {
        if (OnBlob) {
            $.ajax({
                url: "../Reports/AWBStock",
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
            if ($("#grid").data('kendoGrid')) {
                $("#grid").data('kendoGrid').destroy();
                $("#grid").empty();
            }

            $("#grid").kendoGrid({
                dataSource: {
                    transport: {
                        read: {
                            url: "GetRecord",
                            datatype: 'json',
                            method: 'post',
                            data:Model,
                                //{ AirlineSNo: AirlineSNo, OfficeSNo: OfficeSNo, CitySNo: CitySNo, AgentSNo: AgentSNo, StockType: StockType }
                        }
                    }, parameterMap: function (data, operation) {
                        alert(JSON.stringify(data));
                        return JSON.stringify(data);
                    },
                    schema: {
                        model: {
                            id: "AWBPrefix",
                            fields: {
                                //AWBPrefix: { type: "number" },
                                Name: { type: "string" },
                                TotalStockIssued: { type: "number" },
                                StockUnused: { type: "number" },
                                StockIssuedToOffice: { type: "number" },
                                StockIssuedToAgent: { type: "number" }
                            }
                        }, data: "Data",
                        page: 100,
                        total: function (response) {
                            return response != undefined ? response.Data != undefined ? response.Data.length : 0 : 0;
                        }
                    },
                    pageSize: 20,
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true
                },
                height: 550,
                filterable: true,
                sortable: true,
                pageable: true,
                detailInit: detailInit,
                dataBound: function () {
                    //this.expandRow(this.tbody.find("tr.k-master-row").first());
                },
                columns: [
                //{ field: "OfficeSNo", title: "OfficeSNo " },
                { field: "Name", title: "Office Name" },
                { field: "TotalStockIssued", title: "Total Stock Issued", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"#=OfficeSNo#\",\"" + ($("#Text_CitySNo").data("kendoComboBox").key() || 0) + "\",\"" + ($("#Text_AgentSNo").data("kendoComboBox").key() || 0) + "\",\"" + ($("#Text_StockType").data("kendoComboBox").key() || 0) + "\",\"0\")'>#= TotalStockIssued #</a>" }, //, hidden: isColHide_Auto 
                { field: "TotalStockIssued", title: "Total Stock Used", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"#=OfficeSNo#\",\"" + ($("#Text_CitySNo").data("kendoComboBox").key() || 0) + "\",\"" + ($("#Text_AgentSNo").data("kendoComboBox").key() || 0) + "\",\"" + ($("#Text_StockType").data("kendoComboBox").key() || 0) + "\",\"0\")'>#= TotalStockIssued #</a>" },//, hidden: isColHide_NoAuto
                { field: "StockUnused", title: "Stock Not Issued", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"#=OfficeSNo#\",\"" + ($("#Text_CitySNo").data("kendoComboBox").key() || 0) + "\",\"" + ($("#Text_AgentSNo").data("kendoComboBox").key() || 0) + "\",\"" + ($("#Text_StockType").data("kendoComboBox").key() || 0) + "\",\"1\")'>#= StockUnused #</a>" }, //, hidden: isColHide_Auto
                { field: "StockIssuedToAgent", title: "Stock Issued To Agent", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"#=OfficeSNo#\",\"" + ($("#Text_CitySNo").data("kendoComboBox").key() || 0) + "\",\"" + ($("#Text_AgentSNo").data("kendoComboBox").key() || 0) + "\",\"" + ($("#Text_StockType").data("kendoComboBox").key() || 0) + "\",\"3\")'>#= StockIssuedToAgent #</a>" }//, hidden: isColHide_Auto
                ]


            });
            //AWBPrefix = e.data.AWBPrefix;
        }
    }
}


function detailInit(e) {
   var StockType = $("#Text_StockType").val();
  var isColHide_Auto = StockType == "AUTO" ? true : false;
  var isColHide_NoAuto = StockType != "AUTO" ? true : false;
    $("<div/>").appendTo(e.detailCell).kendoGrid({
        dataSource: {
            transport: {
                read: function (options) {

                    $.ajax({
                        type: "POST",
                        url: "GetOfficeData", global: false,
                        //contentType: "application/json; charset=utf-8",dataType: "json",
                        data: { AWBPrefix: e.data.AWBPrefix, OfficeSNo: ($("#Text_OfficeSNo").data("kendoComboBox").key() || ''), CitySNo: ($("#Text_CitySNo").data("kendoComboBox").key() || ''), AgentSNo: ($("#Text_AgentSNo").data("kendoComboBox").key() || ''), StockType: ($("#Text_StockType").data("kendoComboBox").key() || '') },
                        success: function (result) {
                            options.success(result);
                        }
                    });
                }
                //read: {
                //    url: "GetOfficeData",
                //    datatype: 'json',
                //    method: 'post',
                //    //data: { AWBPrefix: e.data.AWBPrefix }
                //    data: { AWBPrefix: e.data.AWBPrefix, OfficeSNo: OfficeSNo, CitySNo: CitySNo, AgentSNo: AgentSNo, StockType: StockType }
                //}
            },
            parameterMap: function (data, operation) {
                alert(JSON.stringify(data));
                return JSON.stringify(data);
            },
            schema: {
                model: {
                    id: "OfficeSNo",
                    fields: {
                        //OfficeSNo: { type: "number" },
                        Name: { type: "string" },
                        TotalStockIssued: { type: "number" },
                        StockUnused: { type: "number" },
                        StockIssuedToOffice: { type: "number" }
                    }
                },
                data: "Data",
                total: function (response) {
                    return response != undefined ? response.Data != undefined ? response.Data.length : 0 : 0;
                }
            },
            pageSize: 10,
            serverPaging: true,
            serverFiltering: true

            //filter: { field: "OfficeSNo", operator: "eq", value: e.data.OfficeSNo }
        },
        scrollable: false,
        sortable: true,
        pageable: true,
        detailInit: detailInit1,
        dataBound: function () {
            //this.expandRow(this.tbody.find("tr.k-master-row").first());
        },
        columns: [
            //{ field: "OfficeSNo", title: "OfficeSNo " },
              { field: "Name", title: "Office Name" },
            { field: "TotalStockIssued", title: "Total Stock Issued", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"#=OfficeSNo#\",\"" + CitySNo + "\",\"" + AgentSNo + "\",\"" + StockType + "\",\"0\")'>#= TotalStockIssued #</a>", hidden: isColHide_Auto },
            { field: "TotalStockIssued", title: "Total Stock Used", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"#=OfficeSNo#\",\"" + CitySNo + "\",\"" + AgentSNo + "\",\"" + StockType + "\",\"0\")'>#= TotalStockIssued #</a>", hidden: isColHide_NoAuto },
            { field: "StockUnused", title: "Stock Not Issued", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"#=OfficeSNo#\",\"" + CitySNo + "\",\"" + AgentSNo + "\",\"" + StockType + "\",\"1\")'>#= StockUnused #</a>", hidden: isColHide_Auto },
            { field: "StockIssuedToAgent", title: "Stock Issued To Agent", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"#=OfficeSNo#\",\"" + CitySNo + "\",\"" + AgentSNo + "\",\"" + StockType + "\",\"3\")'>#= StockIssuedToAgent #</a>", hidden: isColHide_Auto }
        ]
    });
    OfficeSNo = e.data.OfficeSNo;
}





function detailInit1(e) {
    var StockType = $("#Text_StockType").val();
    var isColHide_Auto = StockType == "AUTO" ? true : false;
    var isColHide_NoAuto = StockType != "AUTO" ? true : false;
    $("<div/>").appendTo(e.detailCell).kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: "GetCityData",
                    datatype: 'json',
                    method: 'post',
                    global: false,
                    data: { AWBPrefix: ($("#Text_AirlineSNo").data("kendoComboBox").key() || ''), OfficeSNo: ($("#Text_OfficeSNo").data("kendoComboBox").key() || ''), CitySNo: ($("#Text_CitySNo").data("kendoComboBox").key() || ''), AgentSNo: ($("#Text_AgentSNo").data("kendoComboBox").key() || ''), StockType: ($("#Text_StockType").data("kendoComboBox").key() || '') }
                    //data: { AWBPrefix: AirlineSNo, OfficeSNo: e.data.OfficeSNo, CitySNo: CitySNo, AgentSNo: AgentSNo, StockType: StockType }
                }
            },
            parameterMap: function (data, operation) {
                alert(JSON.stringify(data));
                return JSON.stringify(data);
            },
            schema: {
                model: {
                    id: "CitySNo",
                    fields: {
                        //CitySNo: { type: "number" },
                        Name: { type: "string" },
                        TotalStockIssued: { type: "number" },
                        StockUnused: { type: "number" },
                        StockIssuedToAgent: { type: "number" },
                        StockBooked: { type: "number" },
                        Void: { type: "number" },
                        BlackListed: { type: "number" }

                    }
                },
                data: "Data",
                total: function (response) {
                    return response != undefined ? response.Data != undefined ? response.Data.length : 0 : 0;
                }
            },
            pageSize: 20,
            serverPaging: true,
            serverFiltering: true

            //filter: { field: "OfficeSNo", operator: "eq", value: e.data.OfficeSNo }
        },
        scrollable: false,
        sortable: true,
        pageable: false,
        detailInit: detailInit2,
        dataBound: function () {
            //this.expandRow(this.tbody.find("tr.k-master-row").first());
        },
        columns: [
            //{ CitySNo: "CitySNo", title: "CitySNo" },
              { field: "Name", title: "City Name" },
            { field: "TotalStockIssued", title: "Total Stock Available", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"" + e.data.OfficeSNo + "\",\"#=CitySNo#\",\"" + AgentSNo + "\",\"" + StockType + "\",\"0\")'>#= TotalStockIssued #</a>", hidden: isColHide_Auto },
            { field: "TotalStockIssued", title: "Total Stock Used", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"" + e.data.OfficeSNo + "\",\"#=CitySNo#\",\"" + AgentSNo + "\",\"" + StockType + "\",\"0\")'>#= TotalStockIssued #</a>", hidden: isColHide_NoAuto },
            { field: "StockUnused", title: "Stock Not Issued", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"" + e.data.OfficeSNo + "\",\"#=CitySNo#\",\"" + AgentSNo + "\",\"" + StockType + "\",\"1\")'>#= StockUnused #</a>", hidden: isColHide_Auto },
            { field: "StockIssuedToAgent", title: "Stock Issued To Agent", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"" + e.data.OfficeSNo + "\",\"#=CitySNo#\",\"" + AgentSNo + "\",\"" + StockType + "\",\"3\")'>#= StockIssuedToAgent #</a>", hidden: isColHide_Auto },
            { field: "StockBooked", title: "Stock Booked", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"" + e.data.OfficeSNo + "\",\"#=CitySNo#\",\"" + AgentSNo + "\",\"" + StockType + "\",\"4\")'>#= StockBooked #</a>", hidden: isColHide_Auto },
            { field: "StockBooked", title: "Booked AWB", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"" + e.data.OfficeSNo + "\",\"#=CitySNo#\",\"" + AgentSNo + "\",\"" + StockType + "\",\"4\")'>#= StockBooked #</a>", hidden: isColHide_NoAuto },
            { field: "Void", title: "Void AWB", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"" + e.data.OfficeSNo + "\",\"#=CitySNo#\",\"\",\"" + StockType + "\",\"5\")'>#= Void #</a>" },
            { field: "BlackListed", title: "Black Listed AWB", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"" + e.data.OfficeSNo + "\",\"#=CitySNo#\",\"" + AgentSNo + "\",\"" + StockType + "\",\"6\")'>#= BlackListed #</a>" }
        ]
    });
    OfficeSNo = e.data.OfficeSNo;
}




function detailInit2(e) {

    var StockType = $("#Text_StockType").val();
    var isColHide_Auto = StockType == "AUTO" ? true : false;
    var isColHide_NoAuto = StockType != "AUTO" ? true : false;
    $("<div/>").appendTo(e.detailCell).kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: "GetAccountData",
                    datatype: 'json',
                    method: 'post',
                    global: false,
                    data: { AWBPrefix: ($("#Text_AirlineSNo").data("kendoComboBox").key() || ''), OfficeSNo: ($("#Text_OfficeSNo").data("kendoComboBox").key() || ''), CitySNo: ($("#Text_CitySNo").data("kendoComboBox").key() || ''), AgentSNo: ($("#Text_AgentSNo").data("kendoComboBox").key() || ''), StockType: ($("#Text_StockType").data("kendoComboBox").key() || '') }
                    //data: { AWBPrefix: AirlineSNo, OfficeSNo: OfficeSNo, CitySNo: e.data.CitySNo, AgentSNo: AgentSNo, StockType: StockType }
                }
            },
            parameterMap: function (data, operation) {
                alert(JSON.stringify(data));
                return JSON.stringify(data);
            },
            schema: {
                model: {
                    id: "AccountSNo",
                    fields: {
                        //AccountSNo: { type: "number" },
                        Name: { type: "string" },
                        TotalStockIssued: { type: "number" },
                        //StockUnused: { type: "number" },
                        //StockIssuedToAgent: { type: "number" },
                        StockBooked: { type: "number" },
                        UnusedStock: { type: "number" },
                        BlackListed: { type: "number" }
                    }
                },
                data: "Data",
                total: function (response) {
                    return response != undefined ? response.Data != undefined ? response.Data.length : 0 : 0;
                }
            },
            pageSize: 20,
            serverPaging: true,
            serverFiltering: true

            //filter: { field: "OfficeSNo", operator: "eq", value: e.data.OfficeSNo }
        },
        scrollable: false,
        sortable: true,
        pageable: true,
        columns: [
            //{ field: "AccountSNo", title: "AccountSNo " },
                { field: "Name", title: "Agent Name" },
            { field: "TotalStockIssued", title: "Total Stock Available", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"" + OfficeSNo + "\",\"" + e.data.CitySNo + "\",\"#=AccountSNo#\",\"" + StockType + "\",\"0\")'>#= TotalStockIssued #</a>", hidden: isColHide_Auto },
            { field: "TotalStockIssued", title: "Total Stock Used", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"" + OfficeSNo + "\",\"" + e.data.CitySNo + "\",\"#=AccountSNo#\",\"" + StockType + "\",\"0\")'>#= TotalStockIssued #</a>", hidden: isColHide_NoAuto },
            //{ field: "StockUnused", template: "<a href='\\\#' class='name-link'>#= StockUnused #</a>" },
            //{ field: "StockIssuedToAgent", template: "<a href='\\\#' class='name-link'>#= StockIssuedToAgent #</a>" },
            { field: "StockBooked", title: "Stock Booked", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"" + OfficeSNo + "\",\"" + e.data.CitySNo + "\",\"#=AccountSNo#\",\"" + StockType + "\",\"4\")'>#= StockBooked #</a>", hidden: isColHide_Auto },
            { field: "StockBooked", title: "Booked AWB", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"" + OfficeSNo + "\",\"" + e.data.CitySNo + "\",\"#=AccountSNo#\",\"" + StockType + "\",\"4\")'>#= StockBooked #</a>", hidden: isColHide_NoAuto },
            // Last updated by UMAR Add UnusedStock col to Replace void on 24-Oct-2018
            { field: "UnusedStock", title: "Unused Stock", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"" + OfficeSNo + "\",\"" + e.data.CitySNo + "\",\"#=AccountSNo#\",\"" + StockType + "\",\"1\")'>#= UnusedStock #</a>", hidden: isColHide_Auto },
            { field: "Void", title: "Void AWB", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"" + OfficeSNo + "\",\"" + e.data.CitySNo + "\",\"#=AccountSNo#\",\"" + StockType + "\",\"5\")'>#= Void #</a>" },
            { field: "BlackListed", title: "Black Listed AWB", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"" + OfficeSNo + "\",\"" + e.data.CitySNo + "\",\"#=AccountSNo#\",\"" + StockType + "\",\"6\")'>#= BlackListed #</a>" }
        ]
    });
    OfficeSNo = e.data.OfficeSNo;
}



function ExportToExcel(AWBPrefix, OfficeSNo, CitySNo, AgentSNo, StockType, StockStatus) {

    AirlineSNo = $('#AirlineSNo').val();
    if ($("#OfficeSNo").val() != "") {
        OfficeSNo = $("#OfficeSNo").val() == "" ? "" : $("#OfficeSNo").val();
    }
    if ($("#CitySNo").val() != "") {
        CitySNo = $("#CitySNo").val() == "" ? "" : $("#CitySNo").val();
    }
    if ($("#AgentSNo").val() != "") {
        AgentSNo = $("#AgentSNo").val() == "" ? "" : $("#AgentSNo").val();
    }

    if (AirlineSNo != "") {
        window.location.href = "../awbstockstatus/GetRecordInExcel?aWBPrefix=" + AirlineSNo + "&OfficeSNo=" + OfficeSNo + "&CitySNo=" + CitySNo + "&AgentSNo=" + AgentSNo + "&StockType=" + StockType + "&StockStatus=" + StockStatus;
    }
}


function ExtraParameters(id) {
    var param = [];
    if (id == "Text_AirlineSNo") {
        var UserSNo = userContext.UserSNo;
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }
}