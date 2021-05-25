$(document).ready(function () {

    //cfi.AutoComplete("AirlineSNo", "AirlineCode,AirlineName", "Airline", "SNo", "AirlineCode", ["AirlineCode", "AirlineName"], null, "contains");

    cfi.AutoComplete("AirlineSNo", "CarrierCode,AirlineName", "Airline", "AirlineCode", "CarrierCode", ["CarrierCode", "AirlineName"], null, "contains");


    cfi.AutoComplete("CitySNo", "CityCode,CityName", "City", "SNo", "CityCode", ["CityCode", "CityName"], null, "contains");

    cfi.AutoComplete("OfficeSNo", "SNo,Name", "vw_Office", "SNo", "Name", null, null, "contains");

    cfi.AutoComplete("AgentSNo", "SNo,Name", "AllotmentAgents", "SNo", "Name", null, "contains");

    if (userContext.GroupName == 'ADMIN') {

    }
    else {
        $('#AirlineSNo').val(userContext.AirlineSNo == 0 ? "" : userContext.AirlineSNo);
        $('#Text_AirlineSNo_input').val(userContext.AirlineName);

        $('#OfficeSNo').val(userContext.OfficeSNo == 0 ? "" : userContext.OfficeSNo);
        $('#Text_OfficeSNo_input').val(userContext.OfficeName);


        $('#CitySNo').val(userContext.CitySNo == 0 ? "" : userContext.CitySNo);
        $('#Text_CitySNo_input').val(userContext.CityName);


        $('#AgentSNo').val(userContext.AgentSNo == 0 ? "" : userContext.AgentSNo);
        $('#Text_AgentSNo_input').val(userContext.AgentName);

        //$("#Text_AirlineSNo").data("kendoAutoComplete").enable(false);
        //$("#Text_OfficeSNo").data("kendoAutoComplete").enable(false);
        //$("#Text_CitySNo").data("kendoAutoComplete").enable(false);
        //$("#Text_AgentSNo").data("kendoAutoComplete").enable(false);
        //$('#Text_AirlineSNo_input').attr('Disabled', true);
        //$('#Text_OfficeSNo_input').attr('Disabled', true);
        //$('#Text_CitySNo_input').attr('Disabled', true);
        //$('#Text_AgentSNo_input').attr('Disabled', true);

        cfi.EnableAutoComplete('AirlineSNo', false, false, null);//diasble
        cfi.EnableAutoComplete('OfficeSNo', false, false, null);//diasble
        cfi.EnableAutoComplete('CitySNo', false, false, null);//diasble
        cfi.EnableAutoComplete('AgentSNo', false, false, null);//diasble
    }
    $('#grid').css('display', 'none')
    $("#grid").kendoGrid({
        autoBind: false,
        dataSource: {
            transport: {
                read: {
                    url: "GetRecord",
                    datatype: 'json',
                    method: 'post',
                    data: { AirlineSNo: AirlineSNo, OfficeSNo: OfficeSNo, CitySNo: CitySNo, AgentSNo: AgentSNo }
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
                }, data: "Data"
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
            //{ field: "AWBPrefix" },
             { field: "Name", title: "Airline Name" },
            { field: "TotalStockIssued", title: "Total Stock Issued", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"#=AWBPrefix#\",\"" + OfficeSNo + "\",\"" + CitySNo + "\",\"" + AgentSNo + "\",\"0\")'>#= TotalStockIssued #</a>" },
            { field: "StockUnused", title: "Stock Unused", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"#=AWBPrefix#\",\"" + OfficeSNo + "\",\"" + CitySNo + "\",\"" + AgentSNo + "\",\"1\")'>#= StockUnused #</a>" },
              { field: "StockIssuedToOffice", title: "Stock Issued To Office", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"#=AWBPrefix#\",\"" + OfficeSNo + "\",\"" + CitySNo + "\",\"" + AgentSNo + "\",\"2\")'>#= StockIssuedToOffice #</a>" },
        { field: "StockIssuedToAgent", title: "Stock Issued To Agent", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"#=AWBPrefix#\",\"" + OfficeSNo + "\",\"" + CitySNo + "\",\"" + AgentSNo + "\",\"3\")'>#= StockIssuedToAgent #</a>" }
        ]
    });

});


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
}

var AWBPrefix = "";
var AirlineSNo = "";
var OfficeSNo = "";
var CitySNo = "";
var AgentSNo = "";

function GetReportData() {
    AirlineSNo = $('#AirlineSNo').val();
    //if (AirlineSNo == "") {
    //    AirlineSNo = $('#Text_AirlineSNo_input').val().substring(0, 3);
    //}
    OfficeSNo = $("#OfficeSNo").val() == null ? "" : $("#OfficeSNo").val();
    CitySNo = $("#CitySNo").val() == null ? "" : $("#CitySNo").val();
    AgentSNo = $("#AgentSNo").val() == null ? "" : $("#AgentSNo").val();

    if (AirlineSNo != "") {
        $('#grid').css('display', '')
        $("#grid").data('kendoGrid').dataSource.read({ AirlineSNo: AirlineSNo, OfficeSNo: OfficeSNo, CitySNo: CitySNo, AgentSNo: AgentSNo })
        //AWBPrefix = e.data.AWBPrefix;
    }
}


function detailInit(e) {
    $("<div/>").appendTo(e.detailCell).kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: "GetOfficeData",
                    datatype: 'json',
                    method: 'post',
                    //data: { AWBPrefix: e.data.AWBPrefix }
                    data: { AWBPrefix: e.data.AWBPrefix, OfficeSNo: OfficeSNo, CitySNo: CitySNo, AgentSNo: AgentSNo }
                }
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
                data: "Data"
            },
            pageSize: 20,
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
            { field: "TotalStockIssued", title: "Total Stock Issued", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"#=OfficeSNo#\",\"" + CitySNo + "\",\"" + AgentSNo + "\",\"0\")'>#= TotalStockIssued #</a>" },
            { field: "StockUnused", title: "Stock Unused", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"#=OfficeSNo#\",\"" + CitySNo + "\",\"" + AgentSNo + "\",\"1\")'>#= StockUnused #</a>" },
            { field: "StockIssuedToAgent", title: "Stock Issued To Agent", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"#=OfficeSNo#\",\"" + CitySNo + "\",\"" + AgentSNo + "\",\"3\")'>#= StockIssuedToAgent #</a>" }
        ]
    });
    OfficeSNo = e.data.OfficeSNo;
}





function detailInit1(e) {
    $("<div/>").appendTo(e.detailCell).kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: "GetCityData",
                    datatype: 'json',
                    method: 'post',
                    data: { AWBPrefix: AirlineSNo, OfficeSNo: e.data.OfficeSNo, CitySNo: CitySNo, AgentSNo: AgentSNo }
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
                data: "Data"
            },
            pageSize: 20,
            serverPaging: true,
            serverFiltering: true

            //filter: { field: "OfficeSNo", operator: "eq", value: e.data.OfficeSNo }
        },
        scrollable: false,
        sortable: true,
        pageable: true,
        detailInit: detailInit2,
        dataBound: function () {
            //this.expandRow(this.tbody.find("tr.k-master-row").first());
        },
        columns: [
            //{ CitySNo: "CitySNo", title: "CitySNo" },
              { field: "Name", title: "City Name" },
            { field: "TotalStockIssued", title: "Total Stock Issued", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"" + e.data.OfficeSNo + "\",\"#=CitySNo#\",\"" + AgentSNo + "\",\"0\")'>#= TotalStockIssued #</a>" },
            { field: "StockUnused", title: "Stock Unused", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"" + e.data.OfficeSNo + "\",\"#=CitySNo#\",\"" + AgentSNo + "\",\"1\")'>#= StockUnused #</a>" },
            { field: "StockIssuedToAgent", title: "Stock Issued To Agent", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"" + e.data.OfficeSNo + "\",\"#=CitySNo#\",\"" + AgentSNo + "\",\"3\")'>#= StockIssuedToAgent #</a>" },
            { field: "StockBooked", title: "Stock Booked", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"" + e.data.OfficeSNo + "\",\"#=CitySNo#\",\"" + AgentSNo + "\",\"4\")'>#= StockBooked #</a>" },
            { field: "Void", title: "Void", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"" + e.data.OfficeSNo + "\",\"#=CitySNo#\",\"\",\"5\")'>#= Void #</a>" },
            { field: "BlackListed", title: "Black Listed", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"" + e.data.OfficeSNo + "\",\"#=CitySNo#\",\"" + AgentSNo + "\",\"6\")'>#= BlackListed #</a>" }
        ]
    });
    OfficeSNo = e.data.OfficeSNo;
}




function detailInit2(e) {
    $("<div/>").appendTo(e.detailCell).kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: "GetAccountData",
                    datatype: 'json',
                    method: 'post',
                    data: { AWBPrefix: AirlineSNo, OfficeSNo: OfficeSNo, CitySNo: e.data.CitySNo, AgentSNo: AgentSNo }
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
                        Void: { type: "number" },
                        BlackListed: { type: "number" }
                    }
                },
                data: "Data"
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
            { field: "TotalStockIssued", title: "Total Stock Issued", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"" + OfficeSNo + "\",\"" + e.data.CitySNo + "\",\"#=AccountSNo#\",\"0\")'>#= TotalStockIssued #</a>" },
            //{ field: "StockUnused", template: "<a href='\\\#' class='name-link'>#= StockUnused #</a>" },
            //{ field: "StockIssuedToAgent", template: "<a href='\\\#' class='name-link'>#= StockIssuedToAgent #</a>" },
            { field: "StockBooked", title: "Stock Booked", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"" + OfficeSNo + "\",\"" + e.data.CitySNo + "\",\"#=AccountSNo#\",\"4\")'>#= StockBooked #</a>" },
            { field: "Void", title: "Void", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"" + OfficeSNo + "\",\"" + e.data.CitySNo + "\",\"#=AccountSNo#\",\"5\")'>#= Void #</a>" },
            { field: "BlackListed", title: "Black Listed", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(\"" + AirlineSNo + "\",\"" + OfficeSNo + "\",\"" + e.data.CitySNo + "\",\"#=AccountSNo#\",\"6\")'>#= BlackListed #</a>" }
        ]
    });
}



function ExportToExcel(AWBPrefix, OfficeSNo, CitySNo, AgentSNo, StockStatus) {

    $.ajax({
        url: 'GetRecordInExcel',
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            AWBPrefix: AWBPrefix, OfficeSNo: OfficeSNo, CitySNo: CitySNo, AgentSNo: AgentSNo, stockStatus: StockStatus
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            var str = "<table border='1' style='border : 1px solid black;border-collapse: collapse;'><tr><th bgcolor='lightblue'>AWBPrefix</th><th bgcolor='lightblue'>AWBNo</th><th bgcolor='lightblue'>AirlineName</th><th bgcolor='lightblue'>StockType</th><th bgcolor='lightblue'>AWBType</th><th bgcolor='lightblue'>OfficeName </th><th bgcolor='lightblue'>CityName</th><th bgcolor='lightblue'>AgentName</th></tr>";

            for (var i = 0; i < result.Data.length; i++) {
                str += "<tr>";
                str += "<td>" + result.Data[i].AWBPrefix + "</td>";
                str += "<td>" + result.Data[i].AWBNo + "</td>";
                str += "<td>" + result.Data[i].AirlineName + "</td>";
                str += "<td>" + result.Data[i].StockType + "</td>";
                str += "<td>" + result.Data[i].AWBType + "</td>";

                str += "<td>" + result.Data[i].OfficeName + "</td>";
                str += "<td>" + result.Data[i].CityName + "</td>";
                str += "<td>" + result.Data[i].AgentName + "</td>";
                str += "</tr>";
            }
            str += "</table>";

            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!

            var yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            var today = dd + '_' + mm + '_' + yyyy;


            var a = document.createElement('a');
            var data_type = 'data:application/vnd.ms-excel';
            var table_div = str;
            var table_html = table_div.replace(/ /g, '%20');
            a.href = data_type + ', ' + table_html;
            a.download = 'AWBStockStatus_' + today + '_.xls';
            a.click();
            //}
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
}





//function detailInit1(e) {
//    $("<div/>").appendTo(e.detailCell).kendoGrid({
//        dataSource: {
//            type: "odata",
//            transport: {
//                read: "https://demos.telerik.com/kendo-ui/service/Northwind.svc/Orders"
//            },
//            detailInit: detailInit1,
//            serverPaging: true,
//            serverSorting: true,
//            serverFiltering: true,
//            pageSize: 10,
//            filter: { field: "EmployeeID", operator: "eq", value: e.data.EmployeeID }
//        },
//        scrollable: false,
//        sortable: true,
//        pageable: true,
//        columns: [
//            { field: "OrderID", width: "110px" },
//            { field: "ShipCountry", title: "Ship Country", width: "110px" },
//            { field: "ShipAddress", title: "Ship Address" },
//            { field: "ShipName", title: "Ship Name", width: "300px" }
//        ]
//    });
//}


//var whereCondition = "";
//var element = $("#grid").kendoGrid({
//    dataSource: {
//        type: "odata",
//        //data:JSON.stringify({currentPage : 1, itemsPerPage: 10, whereCondition: whereCondition, sort: ""}),
//         data: JSON.stringify({ currentPage: 1, itemsPerPage: 10, whereCondition: whereCondition, sort: "" }),
//        transport: {
//            read: "http://demos.telerik.com/kendo-ui/service/Northwind.svc/Employees"
//            //read: "./Services/AWBStockStatus/AWBStockStatusService.svc",
//            //http://localhost:3135/services/AWBStockStatus/AWBStockStatusService.svc/GetGridData
//            //getRecordServiceMethod: "GetChargeCodeOnAwbSno",
//        },
//        pageSize: 6,
//        serverPaging: true,
//        serverSorting: true,
//        schema: {
//            model: {
//                id: "OfficeSNo"
//            }
//        }
//    },
//    height: 600,
//    sortable: true,
//    pageable: true,
//    //detailInit: detailInit,
//    //dataBound: function () {
//    //    this.expandRow(this.tbody.find("tr.k-master-row").first());
//    //},
//    columns: [
//        // {
//        //     field: "OfficeSNo",
//        //     title: "OfficeSNo",
//        //     width: "210px"
//        // },
//        //{
//        //    field: "Name",
//        //    title: "Name",
//        //    width: "210px"
//        //},
//        //{
//        //    field: "TotalStockIssued",
//        //    title: "TotalStockIssued",
//        //    width: "210px"
//        //},
//        //{
//        //    field: "StockUnused",
//        //    width: "210px"
//        //},
//        //{
//        //    field: "StockIssuedToOffice",
//        //    //width: "110px"
//        //}
//         {
//             field: "FirstName",
//             title: "First Name",
//             width: "110px"
//         },
//                {
//                    field: "LastName",
//                    title: "Last Name",
//                    width: "110px"
//                },
//                {
//                    field: "Country",
//                    width: "110px"
//                },
//                {
//                    field: "City",
//                    width: "110px"
//                },
//                {
//                    field: "Title"
//                }
//        //,
//        //{
//        //    field: "Title"
//        //}
//    ]
//});




