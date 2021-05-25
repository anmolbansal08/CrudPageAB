$(document).ready(function () {
    cfi.AutoComplete("AirlineSNo", "AirlineCode,AirlineName", "Airline", "SNo", "AirlineCode", ["AirlineCode", "AirlineName"], null, "contains");

    cfi.AutoComplete("CitySNo", "CityCode,CityName", "City", "SNo", "CityCode", ["CityCode", "CityName"], null, "contains");

    //var MnType = [{ Key: "1", Text: "SERVICEABLE" }, { Key: "2", Text: "DAMAGED" }, { Key: "3", Text: "AVAILABLE" }];
    //cfi.AutoCompleteByDataSource("Condition", MnType);

    //cfi.AutoComplete("OfficeSNo", "SNo,Name", "vw_Office", "SNo", "Name", null, null, "contains");

    //cfi.AutoComplete("AgentSNo", "SNo,Name", "AllotmentAgents", "SNo", "Name", null, "contains");
});

var AirlineSNo = "";
var CitySNo = "";
var Condition = "";

function GetReportData() {
    $('#grid').empty();
    AirlineSNo = $('#AirlineSNo').val();
    //if (AirlineSNo == "") {
    //    AirlineSNo = $('#Text_AirlineSNo_input').val().substring(0, 3);
    //}
    //OfficeSNo = $("#OfficeSNo").val() == null ? "" : $("#OfficeSNo").val();
    CitySNo = $("#CitySNo").val() == null ? "" : $("#CitySNo").val();
    //Condition = $("#Condition").val() == null ? "" : $("#Condition").val();
    //AgentSNo = $("#AgentSNo").val() == null ? "" : $("#AgentSNo").val();

    if (AirlineSNo != "") {
        $("#grid").kendoGrid({
            dataSource: {
                transport: {
                    read: {
                        url: "GetRecord",
                        datatype: 'json',
                        method: 'post',
                        data: { AirlineSNo: AirlineSNo, CitySNo: CitySNo }
                    }
                }, parameterMap: function (data, operation) {
                    alert(JSON.stringify(data));
                    return JSON.stringify(data);
                },
                schema: {
                    model: {
                        id: "AWBPrefix",
                        hidden: {},
                        fields: {
                            //AWBPrefix: { type: "number" },
                            ASNo: { type: 'string' },
                            Name: { type: "string" },
                            Total: { type: "number" },
                            Serviceable: { type: "number" },
                            Damaged: { type: "number" }
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
            { field: "ASNo", title: "Airline SNo", hidden: true },
            { field: "Name", title: "Airline Name" },
                { field: "Total", title: "Total ULD", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(#= Total #,\"" + AirlineSNo + "\",\"c\",\"Total\",\"Airline\")'>#= Total #</a>" },
                { field: "Serviceable", title: "Serviceable ULD", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(#= Serviceable #,\"" + AirlineSNo + "\",\"c\",\"Serviceable\",\"Airline\")'>#= Serviceable #</a>" },
                  { field: "Damaged", title: "Damaged ULD", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(#= Damaged #,\"" + AirlineSNo + "\",\"c\",\"Damaged\",\"Airline\")'>#= Damaged #</a>" }
            ]
        });
        //AWBPrefix = e.data.AWBPrefix;
    }
}

function detailInit(e) {
    $("<div/>").appendTo(e.detailCell).kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: "GetCityData",
                    datatype: 'json',
                    method: 'post',
                    //data: { AWBPrefix: e.data.AWBPrefix }
                    data: { AirlineSNo: e.data.ASNo, CitySNo: CitySNo }
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
                        ASNo: { type: 'string' },
                        CSNo: { type: "string" },
                        Name: { type: "string" },
                        Total: { type: "number" },
                        Serviceable: { type: "number" },
                        Damaged: { type: "number" }
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
            { field: "ASNo", title: "Airline SNo", hidden: true },
              { field: "CSNo", title: "City SNo", hidden: true },
            { field: "Name", title: "City Name" },
                { field: "Total", title: "Total ULD", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(#= Total #,\"" + AirlineSNo + "\",#= CSNo #,\"Total\",\"City\")'>#= Total #</a>" },
                { field: "Serviceable", title: "Serviceable ULD", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(#= Serviceable #,\"" + AirlineSNo + "\",#= CSNo #,\"Serviceable\",\"City\")'>#= Serviceable #</a>" },
                  { field: "Damaged", title: "Damaged ULD", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(#= Damaged #,\"" + AirlineSNo + "\",#= CSNo #,\"Damaged\",\"City\")'>#= Damaged #</a>" }
        ]
    });

}

function detailInit1(e) {
    $("<div/>").appendTo(e.detailCell).kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: "GetULDTypeData",
                    datatype: 'json',
                    method: 'post',
                    //data: { AWBPrefix: e.data.AWBPrefix }
                    data: { AirlineSNo: e.data.ASNo, CitySNo: e.data.CSNo }
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
                        ASNo: { type: 'string' },
                        CSNo: { type: "string" },
                        ULDTp: { type: "string" },
                        ULDType: { type: "string" },
                        Total: { type: "number" },
                        Serviceable: { type: "number" },
                        Damaged: { type: "number" }
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
            { field: "ASNo", title: "Airline SNo", hidden: true },
              { field: "CSNo", title: "City SNo", hidden: true },
              { field: "ULDTp", title: "ULDTp", hidden: true },
            { field: "ULDType", title: "ULD Type" },
                { field: "Total", title: "Total ULD", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(#= Total #,\"" + AirlineSNo + "\",#= CSNo #,\"Total\",\"ULDType\",#= ULDTp #)'>#= Total #</a>" },
                { field: "Serviceable", title: "Serviceable ULD", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(#= Serviceable #,\"" + AirlineSNo + "\",#= CSNo #,\"Serviceable\",\"ULDType\",#= ULDTp #)'>#= Serviceable #</a>" },
                  { field: "Damaged", title: "Damaged ULD", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(#= Damaged #,\"" + AirlineSNo + "\",#= CSNo #,\"Damaged\",\"ULDType\",#= ULDTp #)'>#= Damaged #</a>" }
        ]
    });

}

function detailInit2(e) {
    $("<div/>").appendTo(e.detailCell).kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: "GetULDTypeMainData",
                    datatype: 'json',
                    method: 'post',
                    //data: { AWBPrefix: e.data.AWBPrefix }
                    data: { AirlineSNo: e.data.ASNo, CitySNo: e.data.CSNo, ULDType: e.data.ULDTp }
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
                        ASNo: { type: 'string' },
                        CSNo: { type: "string" },
                        ULDTp: { type: "string" },
                        ULDType: { type: "string" },
                        Total: { type: "number" },
                        Serviceable: { type: "number" },
                        Damaged: { type: "number" },
                        Deviation: { type: "string" },
                        DeviationPercentage: { type: "string" }
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
        detailInit: null,
        dataBound: function () {
            //this.expandRow(this.tbody.find("tr.k-master-row").first());
        },
        columns: [
            { field: "ASNo", title: "Airline SNo", hidden: true },
              { field: "CSNo", title: "City SNo", hidden: true },
              { field: "ULDTp", title: "ULDTp", hidden: true },
            { field: "ULDType", title: "ULD Type" },
                { field: "Total", title: "Total ULD", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(#= Total #,\"" + AirlineSNo + "\",#= CSNo #,\"Total\",\"ULD\",#= ULDTp #,\"#= ULDType #\")'>#= Total #</a>" },
                { field: "Serviceable", title: "Serviceable ULD", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(#= Serviceable #,\"" + AirlineSNo + "\",#= CSNo #,\"Serviceable\",\"ULD\",#= ULDTp #,\"#= ULDType #\")'>#= Serviceable #</a>" },
                  { field: "Damaged", title: "Damaged ULD", template: "<a href='\\\#' class='name-link' onclick='ExportToExcel(#= Damaged #,\"" + AirlineSNo + "\",#= CSNo #,\"Damaged\",\"ULD\",#= ULDTp #,\"#= ULDType #\")'>#= Damaged #</a>" },
                  { field: "Deviation", title: "Deviation" },
                  { field: "DeviationPercentage", title: "Deviation %" }
        ]
    });

}

function ExportToExcel(Count, AirlineSNo, CitySNo, field, Status, ULDTp, ULD) {
    if (Count) {
        if (ULDTp == 0) {
            ULDTp = "0";
        }
        
        $.ajax({
            url: 'GetRecordInExcel',
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                AirlineSNo: AirlineSNo, CitySNo: CitySNo, field: field, Status: Status, ULDTp: (ULDTp || 'No'), ULD: (ULD || 'No')
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                //var a = '';
                var str = "<table border='1' style='border : 1px solid black;border-collapse: collapse;'><tr><th bgcolor='lightblue'>Stock Type</th><th bgcolor='lightblue'>Container/Pallet</th><th bgcolor='lightblue'>ULD Stock No.</th><th bgcolor='lightblue'>Serviceable</th><th bgcolor='lightblue'>Damaged </th><th bgcolor='lightblue'>AirlineName</th><th bgcolor='lightblue'>CityName</th></tr>";

                for (var i = 0; i < result.Data.length; i++) {
                    str += "<tr>";
                    str += "<td>" + result.Data[i].StockType + "</td>";
                    str += "<td>" + result.Data[i].ULDType + "</td>";
                    str += "<td>" + result.Data[i].ULDNo + "</td>";
                    str += "<td>" + result.Data[i].Serviceable + "</td>";
                    str += "<td>" + result.Data[i].Damaged + "</td>";

                    str += "<td>" + result.Data[i].AirlineName + "</td>";
                    str += "<td>" + result.Data[i].CityName + "</td>";
                    //str += "<td>" + result.Data[i].AgentName + "</td>";
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
                a.download = 'ULDStockReport_' + today + '_.xls';
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