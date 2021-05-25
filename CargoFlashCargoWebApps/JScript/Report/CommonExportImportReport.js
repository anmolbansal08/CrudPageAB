var Types = [{ Key: "1", Text: "Agent" }, { Key: "2", Text: "Destination" }, { Key: "3", Text: "Product" }, { Key: "4", Text: "Commodity" }, { Key: "5", Text: "Country" }, { Key: "6", Text: "Shipper/Consignee" }];
var Types1 = [{ Key: "1", Text: "Agent" }, { Key: "2", Text: "Origin" }, { Key: "3", Text: "Product" }, { Key: "4", Text: "Commodity" }, { Key: "5", Text: "Country" }, { Key: "6", Text: "Shipper/Consignee" }];

var alphabettypes = [{ Key: "1", Text: "Jan" }, { Key: "2", Text: "Feb" }, { Key: "3", Text: "Mar" },
      { Key: "4", Text: "Apr" }, { Key: "5", Text: "May" }, { Key: "6", Text: "Jun" }, { Key: "7", Text: "Jul" },
      { Key: "8", Text: "Aug" }, { Key: "9", Text: "Sep" }, { Key: "10", Text: "Oct" }, { Key: "11", Text: "Nov" }, { Key: "12", Text: "Dec" }];
var Yr = [{ Key: "2017", Text: "2017" }, { Key: "2018", Text: "2018" }, { Key: "2019", Text: "2019" }, { Key: "2020", Text: "2020" }];
var Data = "";
var ReportType = "";
$(document).ready(function () {
    $(document.body).append('<script type="text/javascript" src="../JScript/Shipment/table2excel.js" ></script>');
    cfi.ValidateForm();
    $("input[name=operation]").closest("td").remove();
    $("input[type=button][class='btn btn-inverse']").hide();
    $("#tbl").find("td[class=formActiontitle]").closest("tr").next().remove()
    $("#tbl").find("td[class=formActiontitle]").closest("tr").remove()

    $("[id='EIType']").unbind("click").bind("click", function (e) {
        if ($("#EIType:checked").val() == "1") {
            cfi.AutoCompleteByDataSource("ReportType", Types1, fnSetDropDown, null);
        }
        else {
            cfi.AutoCompleteByDataSource("ReportType", Types, fnSetDropDown, null);
        }
    });
    cfi.AutoCompleteByDataSource("ReportType", Types, fnSetDropDown, null);

    cfi.AutoCompleteV2("ReportName", "Name", "CommonExportImportReport_Account", null, "contains");
    cfi.AutoCompleteV2("AirlineSNo", "AirlineCode", "CommonExportImportReport_AirlineCode", null, "contains");

    cfi.AutoCompleteByDataSource("Month", alphabettypes);
    cfi.AutoCompleteByDataSource("Year", Yr);

    $("span[id=spnReportName]").text("Agent Name");
    if ($("#btnSearch").val() == undefined && $("#btnExport").val() == undefined && $("#btnSearch1").val() == undefined) {
        $("#Text_ReportName").closest("td").append("<input type=button id=btnSearch name=Summary value=Summary class='btn btn-block btn-primary'></input>&nbsp;<input type=button id=btnSearch1 name=Details value=Details class='btn btn-block btn-primary'></input> &nbsp;");
        //&nbsp;<input type=button id=btnExport1 name='PDF Download' value='PDF Download' title='PDF Download' class='btn btn-block btn-primary'></input>
        $("input[id=lblExcel]").closest("td").append("<input type=button id=btnExport name='Export To Excel' value='Export To Excel' title='Export To Excel' class='btn btn-block btn-primary'></input><input type=button id=btnExportALL name='Export To Excel All' value='Export To Excel All' onclick='DownloadAllData()' title='Export To Excel All' class='btn btn-block btn-primary'></input>");
        //if () {
        //    //&& $("#btnExportAll").val() == undefined &nbsp;<input type=button id=btnExportAll name='Export To All' value='Export To All' class='btn btn-block btn-primary'></input>
        //    $("#divCommonExportImportReport").append("<input type=button id=btnExport name='Export To Excel' value='Export To Excel' class='btn btn-block btn-primary'></input>");
        //}
    }


    $("[id='btnExport']").unbind("click").bind("click", function (e) {
       
        DownloadExcel();
    });
    $("[id='btnExport1']").unbind("click").bind("click", function (e) {
       
        DownloadExcel1();
    });

    $("#btnSearch").unbind("click").bind("click", function () {
        //alert('Test');
        if (cfi.IsValidSection('divbody')) {
            if (true) {
                onselectReport();
            }
        }
        else {
            return false
        }
    });

    $("#btnSearch1").unbind("click").bind("click", function () {
        //alert('Test');
        if (cfi.IsValidSection('divbody')) {
            if (true) {
                onselectDetails();
            }
        }
        else {
            return false
        }
    });
    //$("#tblCommonExportImportReport").append("<tr><td><h1>ABC</h1></td></tr>")

});

function DownloadAllData() {
    var ReportNameSNo = $("#ReportName").val() || 0;
    var AirlineSNo = $("#AirlineSNo").val() || 0;
    var Month = $("#Month").val() || 0;
    var Year = $("#Year").val() || 0;
    var type = $("#Text_ReportType").val().toUpperCase();
    var EIType = $("#EIType:checked").val() || 0;

    if (AirlineSNo != "" && Month != "" && Year != "" && ReportType != "") {
        window.location.href = "../DataSetToExcel/ExportToExcelAll?ReportNameSNo=" + ReportNameSNo + "&AirlineSNo=" + AirlineSNo + "&Month=" + Month + "&Year=" + Year + "&type=" + type + "&EIType=" + EIType + "&ReportType=" + ReportType + "";
    }
}
function fnSetDropDown(input) {
    var type = $("#Text_ReportType").val().toUpperCase();
    var EIType = $("#EIType:checked").val() || 0;

    if (type == "AGENT") {
        cfi.ResetAutoComplete("ReportName");
        var dataSource = GetDataSourceV2("ReportName", "TrasitFWB_ReportName")
        cfi.ChangeAutoCompleteDataSource("ReportName", dataSource, false, null, "Name");
        $("span[id=spnReportName]").text("Agent Name");
    }
    else if (type == "DESTINATION") {
        cfi.ResetAutoComplete("ReportName");
        var dataSource = GetDataSourceV2("ReportName", "TrasitFWB_DESTINATIONReportName")
        cfi.ChangeAutoCompleteDataSource("ReportName", dataSource, false, null, "AirportCode");
        $("span[id=spnReportName]").text("Destination Airport");
    }
    else if (type == "ORIGIN") {
        cfi.ResetAutoComplete("ReportName");
        var dataSource = GetDataSourceV2("ReportName", "TrasitFWB_ORIGINReportName")
        cfi.ChangeAutoCompleteDataSource("ReportName", dataSource, false, null, "AirportCode");
        $("span[id=spnReportName]").text("Origin Airport");
    }
    else if (type == "PRODUCT") {
        cfi.ResetAutoComplete("ReportName");
        var dataSource = GetDataSourceV2("ReportName", "TrasitFWB_PRODUCTReportName")
        cfi.ChangeAutoCompleteDataSource("ReportName", dataSource, false, null, "ProductName");
        $("span[id=spnReportName]").text("Product Name");
    }
    else if (type == "COMMODITY") {
        cfi.ResetAutoComplete("ReportName");
        var dataSource = GetDataSourceV2("ReportName", "TrasitFWB_COMMODITYReportName")
        cfi.ChangeAutoCompleteDataSource("ReportName", dataSource, false, null, "CommodityCode");
        $("span[id=spnReportName]").text("Commodity Code");
    }
    else if (type == "COUNTRY") {
        cfi.ResetAutoComplete("ReportName");
        var dataSource = GetDataSourceV2("ReportName", "TrasitFWB_COUNTRYReportName")
        cfi.ChangeAutoCompleteDataSource("ReportName", dataSource, false, null, "CountryCode");
        $("span[id=spnReportName]").text("Country Name");
    }
    else if (type == "SHIPPER/CONSIGNEE" && EIType == "0") {
        cfi.ResetAutoComplete("ReportName");
        var dataSource = GetDataSourceV2("ReportName", "TrasitFWB_SHIPPERReportName")
        cfi.ChangeAutoCompleteDataSource("ReportName", dataSource, false, null, "CustomerName");
        $("span[id=spnReportName]").text("SHIPPER/CONSIGNEE");
    }
    else if (type == "SHIPPER/CONSIGNEE" && EIType == "1") {
        cfi.ResetAutoComplete("ReportName");
        var dataSource = GetDataSourceV2("ReportName", "TrasitFWB_SHIPPERReportName1")
        cfi.ChangeAutoCompleteDataSource("ReportName", dataSource, false, null, "CustomerName");
        $("span[id=spnReportName]").text("SHIPPER/CONSIGNEE");
    }


}

function onselectReport() {
    ReportType = "S";
    var EIType = $("#EIType:checked").val() || 0;
    var Etype = "";
    if (EIType == "0") {
        Etype = "EXPORT";
    }
    else {
        Etype = "IMPORT";
    }

    var TypeCode = "";
    var TypeName = "";
    var type = $("#Text_ReportType").val().toUpperCase();
    if (type == "AGENT") {
        TypeCode = "Agent Code";
        TypeName = "Agent Name";
    }
    else if (type == "DESTINATION" && EIType == "0") {
        TypeCode = "Destination Code";
        TypeName = "Destination Name";
    }
    else if (type == "ORIGIN" && EIType == "1") {
        TypeCode = "Origin Code";
        TypeName = "Origin Name";
    }
    else if (type == "PRODUCT") {
        TypeCode = "";
        TypeName = "Product Name";
    }
    else if (type == "COMMODITY") {
        TypeCode = "Commodity Code";
        TypeName = "Commodity Name";
    }
    else if (type == "COUNTRY") {
        TypeCode = "Country Code";
        TypeName = "Country Name";
    }
    else if (type == "SHIPPER/CONSIGNEE") {
        TypeCode = "Customer Type";
        TypeName = "SHIPPER/CONSIGNE Name";
    }

    //var ReportName = $("#ReportName").val() || 0;
    //var AirlineSNo = $("#AirlineSNo").val() || 0;
    //var Month = $("#Month").val() || 0;
    //var Year = $("#Year").val() || 0;
    ////type + ":" + ReportName
    var dbtableName = "CommonExportImportReport";
    $("#tbl" + dbtableName).appendGrid({
        V2: true,
        tableID: "tbl" + dbtableName,
        contentEditable: false,
        masterTableSNo: 1,
        currentPage: 1, itemsPerPage: 5, model: BindWhereCondition(),
        //whereCondition: EIType + "@" + type + "@" + ReportName + "@" + AirlineSNo + "@" + Month + "@" + Year,
        sort: "",
        isGetRecord: true,
        servicePath: "./Services/Report/CommonExportImportReportService.svc",
        getRecordServiceMethod: "GetReport",
        deleteServiceMethod: "",
        caption: type + " " + Etype + " REPORT",
        initRows: 1,
        columns: [
         { name: "SNo", type: "hidden" },
         { name: "Code", display: TypeCode, ctrlAttr: { maxlength: 50 }, ctrlCss: { width: "120px" }, isRequired: false },
         { name: "Name", display: TypeName, ctrlAttr: { maxlength: 50 }, ctrlCss: { width: "120px" }, isRequired: false },
         { name: "Cons", display: "No. of Shipments", ctrlAttr: { maxlength: 50 }, ctrlCss: { width: "120px" }, isRequired: false },
         { name: "Pkgs", display: "No. of Packages", ctrlAttr: { maxlength: 50 }, ctrlCss: { width: "120px" }, isRequired: false },
          { name: "GRSWt", display: "Gross Wt.", ctrlAttr: { maxlength: 50 }, ctrlCss: { width: "120px" }, isRequired: false },
         { name: "CHRGWt", display: "Chargeable Wt.", ctrlAttr: { maxlength: 50 }, ctrlCss: { width: "120px" }, isRequired: false },

        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
        },
        isPaging: true,
        isExtraPaging: true,
        isPageRefresh: false,
        hideButtons: { updateAll: true, insert: true, remove: true, append: true, removeLast: true }
    });
    $('#tblCommonExportImportReport button.insert,#tblCommonExportImportReport button.remove').hide();//#tblRateBase button.moveUp,#tblRateBase button.moveDown
    // Buttons at footer row
    $("#tblCommonExportImportReport button.removeLast").hide();
    $('#tblCommonExportImportReport button.append,#tblCommonExportImportReport button.removeLast').hide();


}

function onselectDetails() {
    ReportType = "D";
    var EIType = $("#EIType:checked").val() || 0;
    var Etype = "";
    if (EIType == "0") {
        Etype = "EXPORT";
    }
    else {
        Etype = "IMPORT";
    }

    var TypeCode = "";
    var TypeName = "";
    var type = $("#Text_ReportType").val().toUpperCase();
    if (type == "AGENT") {
        TypeCode = "Agent Code";
        TypeName = "Agent Name";
    }
    else if (type == "DESTINATION" && EIType == "0") {
        TypeCode = "Destination Code";
        TypeName = "Destination Name";
    }
    else if (type == "ORIGIN" && EIType == "1") {
        TypeCode = "Origin Code";
        TypeName = "Origin Name";
    }
    else if (type == "PRODUCT") {
        TypeCode = "";
        TypeName = "Product Name";
    }
    else if (type == "COMMODITY") {
        TypeCode = "Commodity Code";
        TypeName = "Commodity Name";
    }
    else if (type == "COUNTRY") {
        TypeCode = "Country Code";
        TypeName = "Country Name";
    }
    else if (type == "SHIPPER/CONSIGNEE") {
        TypeCode = "Customer Type";
        TypeName = "SHIPPER/CONSIGNE Name";
    }

    //var ReportName = $("#ReportName").val() || 0;
    //var AirlineSNo = $("#AirlineSNo").val() || 0;
    //var Month = $("#Month").val() || 0;
    //var Year = $("#Year").val() || 0;
    //type + ":" + ReportName
    var dbtableName = "CommonExportImportReport";
    $("#tbl" + dbtableName).appendGrid({
        V2: true,
        tableID: "tbl" + dbtableName,
        contentEditable: false,
        masterTableSNo: 1,
        currentPage: 1, itemsPerPage: 5,
        model: BindWhereCondition(),
        sort: "",
        isGetRecord: true,
        servicePath: "./Services/Report/CommonExportImportReportService.svc",
        getRecordServiceMethod: "GetDetails",
        deleteServiceMethod: "",
        caption: type + " " + Etype + " REPORT",
        initRows: 1,
        columns: [
         { name: "SNo", type: "hidden" },
         { name: "Code", display: TypeCode, ctrlAttr: { maxlength: 50 }, ctrlCss: { width: "120px" }, isRequired: false },
         { name: "Name", display: TypeName, ctrlAttr: { maxlength: 50 }, ctrlCss: { width: "120px" }, isRequired: false },
         { name: "AWBNo", display: "AWB No.", ctrlAttr: { maxlength: 50 }, ctrlCss: { width: "120px" }, isRequired: false },
         { name: "FlightNo", display: "Flight No.", ctrlAttr: { maxlength: 50 }, ctrlCss: { width: "120px" }, isRequired: false },
         { name: "FlightDate", display: "Flight Date", ctrlAttr: { maxlength: 50 }, ctrlCss: { width: "120px" }, isRequired: false },
         { name: "OriginAirport", display: "Origin Airport", ctrlAttr: { maxlength: 50 }, ctrlCss: { width: "120px" }, isRequired: false },
         { name: "DestinationAirport", display: "Destination Airport", ctrlAttr: { maxlength: 50 }, ctrlCss: { width: "120px" }, isRequired: false },
         { name: "Cons", display: "No. of Shipments", ctrlAttr: { maxlength: 50 }, ctrlCss: { width: "120px" }, isRequired: false },
         { name: "Pkgs", display: "No. of Packages", ctrlAttr: { maxlength: 50 }, ctrlCss: { width: "120px" }, isRequired: false },
         { name: "GRSWt", display: "Gross Wt.", ctrlAttr: { maxlength: 50 }, ctrlCss: { width: "120px" }, isRequired: false },
         { name: "CHRGWt", display: "Chargeable Wt.", ctrlAttr: { maxlength: 50 }, ctrlCss: { width: "120px" }, isRequired: false },
        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
        },
        isPaging: true,
        isExtraPaging: true,
        isPageRefresh: false,
        hideButtons: { updateAll: true, insert: true, remove: true, append: true, removeLast: true }
    });
    $('#tblCommonExportImportReport button.insert,#tblCommonExportImportReport button.remove').hide();//#tblRateBase button.moveUp,#tblRateBase button.moveDown
    // Buttons at footer row
    $("#tblCommonExportImportReport button.removeLast").hide();
    $('#tblCommonExportImportReport button.append,#tblCommonExportImportReport button.removeLast').hide();


}
function DownloadExcel() {
    //var data_type = 'data:application/vnd.ms-excel';
    //var a = document.createElement('a');
    //a.href = data_type + ', ' + encodeURIComponent('<table style="width:100%; margin:0; padding:0; border-collapse:collapse;text-align:center;" ><tbody><tr><td>' + $("#tblCommonExportImportReport").html() + '</td></tr></tbody></table>');
    //a.download = 'Report.xls';
    //a.click();

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;

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

    $("#tblCommonExportImportReport").find("select").remove();
    $("#tblCommonExportImportReport").find("span[id=tblCommonExportImportReport_spanPageSize]").remove();
    $("#tblCommonExportImportReport").find("div[id=tblCommonExportImportReport_spanPageSize]").remove();
    $("#tblCommonExportImportReport").find("div[id=tblCommonExportImportReport_divStatusMsg]").remove();
    $("#tblCommonExportImportReport").find("div[id=tblCommonExportImportReport_pageNavPosition]").remove();


    var table_div = '<table>' + $('#tblCommonExportImportReport').html() + '</table>';
    var table_html = table_div.replace(/ /g, '%20');
    a.href = data_type + ', ' + table_html;
    a.download = 'Report_' + today + '_.xls';
    a.click();
    if ($("#tblCommonExportImportReport").find("label[id^=tblCommonExportImportReport_AWBNo]").text() == "") {
        onselectReport();
    }
    else {
        onselectDetails();
    }
    //$("#tblCommonExportImportReport").find("select").show();
    //$("#tblCommonExportImportReport").find("span[id=tblCommonExportImportReport_spanPageSize]").show();
    //$("#tblCommonExportImportReport").find("div[id=tblCommonExportImportReport_spanPageSize]").show();
    //$("#tblCommonExportImportReport").find("div[id=tblCommonExportImportReport_divStatusMsg]").show();
    return false;

    // Data = "";
}
function DownloadExcel1() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;

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
    $("#tblCommonExportImportReport").find("select").remove();
    $("#tblCommonExportImportReport").find("span[id=tblCommonExportImportReport_spanPageSize]").remove();
    $("#tblCommonExportImportReport").find("div[id=tblCommonExportImportReport_spanPageSize]").remove();
    $("#tblCommonExportImportReport").find("div[id=tblCommonExportImportReport_divStatusMsg]").remove();
    $("#tblCommonExportImportReport").find("div[id=tblCommonExportImportReport_pageNavPosition]").remove();


    var table_div = '<table>' + $('#tblCommonExportImportReport').html() + '</table>';
    var table_html = table_div.replace(/ /g, '%20');
    a.href = data_type + ', ' + table_html;

    a.download = 'Report_' + today + '_.pdf';
    a.click();
    if ($("#tblCommonExportImportReport").find("label[id^=tblCommonExportImportReport_AWBNo]").text() == "") {
        onselectReport();
    }
    else {
        onselectDetails();
    }
    return false;
}
function BindWhereCondition() {

    return {

        ReportNameSNo: $("#ReportName").val() || 0,
        AirlineSNo: $("#AirlineSNo").val() || 0,
        Month: $("#Month").val() || 0,
        Year: $("#Year").val() || 0,
        type: $("#Text_ReportType").val().toUpperCase(),
        EIType: $("#EIType:checked").val() || 0,

    }
}