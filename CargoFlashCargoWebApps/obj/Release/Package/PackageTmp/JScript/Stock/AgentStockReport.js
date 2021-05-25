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
        $('#Text_CitySNo_input').val(userContext.CityCode);


        $('#AgentSNo').val(userContext.AgentSNo == 0 ? "" : userContext.AgentSNo);
        $('#Text_AgentSNo_input').val(userContext.AgentName);


        cfi.EnableAutoComplete('AirlineSNo', false, false, null);//diasble
        cfi.EnableAutoComplete('OfficeSNo', false, false, null);//diasble
        cfi.EnableAutoComplete('CitySNo', false, false, null);//diasble
        cfi.EnableAutoComplete('AgentSNo', false, false, null);//diasble
    }

});


function ExtraCondition(textId) {
    var filterAirline = cfi.getFilter("AND");

    if (textId == "Text_AirlineSNo") {
        //cfi.setFilter(filterAirline, "IsInterline", "eq", "0")
        //return OriginCityAutoCompleteFilter2;
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

var AirlineSNo = "";
var OfficeSNo = "";
var CitySNo = "";
var AgentSNo = "";
var WhereCondition = "";
var OrderBy = "";


function DownloadExcelReport() {

    //AirlineSNo = $('#Text_AirlineSNo').val().substring(0, 3);
    //if (AirlineSNo == "") {
    //    AirlineSNo = $('#Text_AirlineSNo_input').val().substring(0, 3);
    //}
    AirlineSNo = $('#AirlineSNo').val();
    OfficeSNo = $("#OfficeSNo").val() == null ? "" : $("#OfficeSNo").val();
    CitySNo = $("#CitySNo").val() == null ? "" : $("#CitySNo").val();
    AgentSNo = $("#AgentSNo").val() == null ? "" : $("#AgentSNo").val();

    if (AirlineSNo != "") {
        $.ajax({
            url: 'GetRecordInExcel',
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                AWBPrefix: AirlineSNo, OfficeSNo: OfficeSNo, CitySNo: CitySNo, AgentSNo: AgentSNo, WhereCondition: WhereCondition, OrderBy: OrderBy
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                var str = "<table border='1' style='border : 1px solid black;border-collapse: collapse;'><tr><th bgcolor='lightblue'>AWBNo</th><th bgcolor='lightblue'>Status</th><th bgcolor='lightblue'>AirlineName</th><th bgcolor='lightblue'>StockType</th><th bgcolor='lightblue'>AWBType</th><th bgcolor='lightblue'>OfficeName </th><th bgcolor='lightblue'>CityName</th><th bgcolor='lightblue'>AgentName</th><th bgcolor='lightblue'>Issued on</th></tr>";

                if (result != undefined) {
                    if (result.Data.length > 0) {
                        for (var i = 0; i < result.Data.length; i++) {
                            str += "<tr>";

                            str += "<td>" + result.Data[i].AWBNo + "</td>";
                            str += "<td>" + result.Data[i].Status + "</td>";
                            str += "<td>" + result.Data[i].AirlineName + "</td>";
                            str += "<td>" + result.Data[i].StockType + "</td>";
                            str += "<td>" + result.Data[i].AWBType + "</td>";

                            str += "<td>" + result.Data[i].OfficeName + "</td>";
                            str += "<td>" + result.Data[i].CityName + "</td>";
                            str += "<td>" + result.Data[i].AgentName + "</td>";
                            str += "<td>" + result.Data[i].Issuedon + "</td>";
                            str += "</tr>";
                        }
                    }
                    else {
                        str += "<td colspan='10'><center>No Record Found !</center></td>";
                    }
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
                a.download = 'AgentStockStatus_' + today + '_.xls';
                a.click();
                //}
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
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




