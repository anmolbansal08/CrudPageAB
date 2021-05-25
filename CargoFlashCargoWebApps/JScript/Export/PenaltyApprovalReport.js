$(document).ready(function () {

    $('.trpSubmit').hide();
    $('#Penalty').css('display', 'none');
    var str = '';
    var basedOn = '';

      cfi.AutoCompleteV2("AirLineSNo", "AirLineName", "Penalty_Report_AirLineName", null, "contains");
    cfi.AutoCompleteV2("OriginCity", "OriginCity", "Penalty_Report_OriginCity", null, "contains");
     cfi.DateType("FromDate");
    cfi.DateType("ToDate");
 
    $('#FromDate').attr('readonly', true);
    $('#ToDate').attr('readonly', true);
    // $('#FlightDate').attr('readonly', true);
    $('.DateWiseRow').show();
   
    $('.formSection').show();

    $('#btnSearch').show();
    $('#btnExportToExcel').hide();

    var AccountSno = 0;
    if (userContext.GroupName == 'ADMIN') {

        AccountSNo = 0;

        cfi.AutoCompleteV2("PenaltyType", "PenaltyType", "AWB_Penalty_PenaltyTypeForApproval", null, "contains");

    }
    else if (userContext.GroupName == 'AGENT') {


        cfi.AutoCompleteV2("PenaltyType", "PenaltyType", "AWB_Penalty_AGENTPenaltyType", null, "contains");

        AccountSNo = userContext.AgentSNo;



    }

    else if (userContext.GroupName == 'AIRLINE') {

        AccountSNo = 0;

        cfi.AutoCompleteV2("PenaltyType", "PenaltyType", "AWB_Penalty_PenaltyTypeForApproval", null, "contains");

    }
    else {
        AccountSNo = 0;

        cfi.AutoCompleteV2("PenaltyType", "PenaltyType", "AWB_Penalty_PenaltyTypeForApproval", null, "contains");


    }
    // $('#AirLineSNo').val('1');
    // $('#Text_AirLineSNo_input').val('GA-GARUDA AIRLINE');

    $("#AirLineSNo").val(userContext.AirlineSNo);
    $("#Text_AirLineSNo_input").val(userContext.AirlineCarrierCode);

    $("#Text_PenaltyType").change(function () {

        if ($('#Text_PenaltyType_input').val().toUpperCase() == "CANCELLATION" || $('#Text_PenaltyType_input').val().toUpperCase() == "ITL") {
            $('#Text_ReferenceNumber_input').closest('td').contents().show();
            $('#tdreference').closest('td').contents().show();
        }
        else {

            $('#Text_ReferenceNumber_input').closest('td').contents().hide();
            $('#tdreference').closest('td').contents().hide();

        }
    });

    //$("#Text_PenaltyType_input").on('DOMSubtreeModified', function () {

    //});



});
var UserCitySno = '';
var ISAccessAllCities = '';

$.ajax({
    url: 'GetCitiesUSERWISE',
    async: false,
    type: "POST",
    dataType: "json",
    //  data: param = "",
    // data: JSON.stringify(Model),
    contentType: "application/json; charset=utf-8", cache: false,
    success: function (result) {
        if (result.Data.length > 0) {
            ISAccessAllCities = result.Data[0].IsAll;
            UserCitySno = result.Data[0].Cities;

        }
    }
});

function ExtraCondition(textId) {
    var filter = cfi.getFilter("AND");


    if (textId == "Text_PenaltyType") {

        cfi.setFilter(filter, "CarrierCode", "eq", userContext.SysSetting.ICMSEnvironment);

        var filterCitySNo = cfi.autoCompleteFilter([filter]);
        return filterCitySNo;
    }
    if (textId == "Text_OriginCity") {

        if (ISAccessAllCities != 1) {
            cfi.setFilter(filter, "SNo", "in", UserCitySno);
        }
        var filterCitySNo = cfi.autoCompleteFilter([filter]);
        return filterCitySNo;
    }
}



var FromDate = "";
var ToDate = "";
var AirLineSNo = "";
var PenaltyType = "";
var OriginCity = "";
var FlightNo = "";
var AWBNo = "";
var AccountSNo = 0;
var ReferenceNumber = "";
var FlightDate = "";
var BookingDate = "";
var FD = "";
var BD = "";

$('input[type=radio][name=BasedOn]').change(function () {
    // $('#FlightDate').data("kendoDatePicker").value('');

    basedOn = $("input[name='BasedOn']:checked").val();
    if (basedOn == 'FD') {
        

    }
    else {
     
    }

});


var Model = [];


function SearchPenaltyApprovalData() {
  
    basedOn = $("input[name='BasedOn']:checked").val();
   
    Model =
       {
           FromDate: $('#FromDate').val(),
           ToDate: $('#ToDate').val(),
           AirLineSNo: $('#AirLineSNo').val(),
           AccountSNo: AccountSNo,
           PenaltyType: $('#PenaltyType').val(),
           OriginCity: $('#OriginCity').val(),
           FlightNo: $('#FlightNo').val(),
           AWBNo: $('#AWBNo').val(),
           ReferenceNumber: $('#ReferenceNumber').val(),
           FlightDate: FD,
           BookingDate: BD,
           ReportType: basedOn,

       };




    var WhereCondition = "";
    if (Model.AirLineSNo != "") {
        if (Model.PenaltyType == "") {

            //  ShowMessage('warning', 'Warning - Penalty Report ', "Please select one of the Penalty Type!");
            return;
        }
        if (Date.parse(Model.FromDate) > Date.parse(Model.ToDate)) {

            ShowMessage('warning', 'Warning - Penalty Report ', "From Date can not be greater than To Date !");
            //alert('From Date can not be greater than To Date');
            return;
        }
      
        var frmdate = $('#FromDate').val();
        var tdate = $('#ToDate').val();
        if (frmdate != undefined && tdate != undefined) {
            if (frmdate != "" && tdate != "") {
                $('#grid').css('display', '')
                $("#grid").data('kendoGrid').dataSource.page(1);

                if (userContext.SysSetting.ICMSEnvironment == 'JT') {
                    var grid = $("#grid").data("kendoGrid");
                    //  grid.showColumn(0); // Check box
                    grid.hideColumn(14); // tax on penalty
                    grid.hideColumn(15); // total  penalty
                }
                else {
                    var grid = $("#grid").data("kendoGrid");
                    //  grid.showColumn(0); // Check box
                    grid.showColumn(14); // tax on penalty
                    grid.showColumn(15); // total  penalty
                }


                 $('#btnExportToExcel').show();
            }
        }
    }
}

$('#grid').css('display', 'none')
var dataSource = $("#grid").kendoGrid({
    autoBind: false,
    dataSource: new kendo.data.DataSource({
        type: "json",
        serverPaging: true, serverSorting: true, serverFiltering: true, pageSize: 20,
        transport: {
            read: {
                url: "../PenaltyApprovalReport/GetApprovalData",
                dataType: "json",
                global: false,
                type: 'POST',
                contentType: "application/json; charset=utf-8",
               
                //////////////////////////
                data:function GetReportData() {
                            return { Model: Model };
}
                //////////////////////////////////////
            }, parameterMap: function (options) {
                if (options.filter == undefined)
                    options.filter = null;
                if (options.sort == undefined)
                    options.sort = null; return JSON.stringify(options);
            },
        },
        schema: {
            model: {
           
                id: "SNo",
                fields: {
                    SNo: { type: "string" },
                    AWBNumber: { type: "string" },
                    AWBDate: { type: "string" },
                    Origin: { type: "string" },
                    Destination: { type: "string" },
                    FlightNo: { type: "string" },
                    FlightDate: { type: "string" },
                    ProductName: { type: "string" },
                    SHC: { type: "string" },
                    CommodityCode: { type: "string" },
                    NatureOfGoods: { type: "string" },
                    FlightNo: { type: "string" },
                    AjentName: { type: "string" },
                    PCS: { type: "string" },
                    GrossWeight: { type: "string" },
                    Volume: { type: "string" },
                    ProductName: { type: "string" },
                    Commidity: { type: "string" },
                    PenaltyCurrency:{type:"string"},
                    PenaltyCharges: { type: "string" },
                    Tax: { type: "string" },
                    TotalPenalty: { type: "string" },
                    ModeOfPenalty: { type: "string" },
                    BookedBy: { type: "string" },
                    UserName: { type: "string" },
                    Remarks: { type: "string" },
                    PenaltyParameterReferenceNo: { type: "string" },
                    Status: { type: "string" },
                    ApprovedBy: { type: "string" }
                    
                   
                }
            }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
        },

    }),

    //detailInit: detailInit,
    //filterable: { mode: 'menu' },
    sortable: true, filterable: false,
    pageable: {
        refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false
    },
    scrollable: true,
    //height: 450,
    columns: [
        { field: "AWBNumber", title: "AWB Number", width: "120px" },
        { field: "AWBDate", title: "Booking Date", width: "120px" },
        { field: "Origin", title: "Org", width: "50px" },
        { field: "Destination", title: "Dest", width: "50px" },
         { field: "FlightNo", title: "Flight No", width: "90px" },
        { field: "FlightDate", title: "Flight Date", width: "115px" },
        { field: "AjentName", title: "Agent Name", width: "120px" },
         { field: "PCS", title: "Pcs", width: "50px" },
          { field: "GrossWeight", title: "Gr.Wt.", width: "70px" },
             { field: "Volume", title: "Volume", width: "70px" },
                 { field: "ProductName", title: "Product", width: "70px" },
        { field: "Commidity", title: "Commodity", width: "100px" },
        { field: "PenaltyCurrency", title: "Penalty Currency", width: "120px" },
         { field: "PenaltyCharges", title: "Penalty", width: "70px" },
            { field: "Tax", title: "Tax", width: "70px" },
        { field: "TotalPenalty", title: "Total", width: "70px" },
        { field: "ModeOfPenalty", title: "Mode Of Penalty", width: "125px" },
         { field: "BookedBy", title: "Booked By", width: "120px" },
          { field: "UserName", title: "Executed By", width: "120px" },
        { field: "Remarks", title: "Remarks", width: "120px" },
         { field: "PenaltyParameterReferenceNo", title: "Reference No", width: "120px" },
        { field: "Status", title: "Remarks for Approval", width: "160px" },
        { field: "ApprovedBy", title: "Approved By", width: "120px" }
    

    ]
});
dataSource.bind("error", dataSource_error);

////////////////////////////////
function dataSource_error(e) {
    //alert(e.status); // displays "error"
    ShowMessage('warning', 'Something went wrong,please try later !', e.status, "bottom-right");
}

/////////////////////////////

function ExportToExcel() {


    $('#df1 #FromDate').val(Model.FromDate);
    $('#df1 #ToDate').val(Model.ToDate);
    $('#df1 #AirLineSNo').val(Model.AirLineSNo);
    $('#df1 #PenaltyType').val(Model.PenaltyType);
    $('#df1 #OriginCity').val(Model.OriginCity);
    $('#df1 #ReportType').val(Model.ReportType);
    $('#df1').submit();

    //  window.location.href = "../PenaltyReport/PenaltyReportExportToExcel?FromDate=" + Model.FromDate + "&ToDate=" + Model.ToDate + "&AirLineSNo=" + Model.AirLineSNo + "&AccountSNo=" + Model.AccountSNo + "&PenaltyType=" + Model.PenaltyType + "&OriginCity=" + Model.OriginCity + "&FlightNo=" + Model.FlightNo + "&AWBNo=" + Model.AWBNo;


}

//function ExportToExcel() {

//                var today = new Date();
//                var dd = today.getDate();
//                var mm = today.getMonth() + 1; 

//                var yyyy = today.getFullYear();
//                if (dd < 10) {
//                    dd = '0' + dd;
//                }
//                if (mm < 10) {
//                    mm = '0' + mm;
//                }
//                var today = dd + '_' + mm + '_' + yyyy;


//                var a = document.createElement('a');
//                var data_type = 'data:application/vnd.ms-excel';
//                var table_div = str;
//                var table_html = table_div.replace(/ /g, '%20');
//                a.href = data_type + ', ' + table_html;
//                a.download = 'PenaltyReport_' + today + '_.xls';
//                a.click();

//                return false


//}



