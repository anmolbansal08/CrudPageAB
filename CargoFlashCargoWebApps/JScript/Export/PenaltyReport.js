var OnBlob = false;
$(document).ready(function () {
    $('.trpSubmit').hide();
    $('#Penalty').css('display', 'none');
    var str = '';
    var basedOn = '';

    $.ajax({
        url: "../Reports/ReportGenerateOnBlob",
        data: { Apps: getQueryStringValue("Apps").toUpperCase() },
        success: function (result) {
            OnBlob = (result == 'True');
        }
    });
    // Changes By Vipin Kumar
    cfi.AutoCompleteV2("AirLineSNo", "AirLineName", "Penalty_Report_AirLineName", null, "contains");
    cfi.AutoCompleteV2("OriginCity", "OriginCity", "Penalty_Report_OriginCity", null, "contains");
    cfi.AutoCompleteV2("AgentSno", "AgentName", "PenaltyReport_Agent", null, "contains", null, null, null, null, refreshawbno);
    if (userContext.SysSetting.ICMSEnvironment == 'JT') {
        $('#OriginCity').attr("disabled", "disabled");
        $('#Text_OriginCity_input').attr("disabled", "disabled");
        $('#Text_OriginCity').attr("disabled", "disabled");
        $('#Text_OriginCity').data("kendoComboBox").enable(false);
    }

    cfi.AutoCompleteV2("FlightNo", "FlightNo", "Penalty_Report_FlightNo", null, "contains");
    cfi.AutoCompleteV2("AWBNo", "AWBNo", "Penalty_Report_AWBNo", null, "contains");
    cfi.AutoCompleteV2("ReferenceNumber", "ReferenceNumber", "Penalty_Report_ReferenceNumber", null, "contains");
    cfi.DateType("FromDate");
    cfi.DateType("ToDate");

    $('#FromDate').attr('readonly', true);
    $('#ToDate').attr('readonly', true);
    $('.DateWiseRow').show();
    $('.AWBNoRow').show();
    $('.formSection').show();
    $('#btnSearch').show();
    $("#BlackListTbl").remove();
    $('#btnExportToExcel').hide();
    $('#tdagent').hide();
    $('#tdagentvalue').hide();

    var AccountSno = 0;
    if (userContext.GroupName == 'ADMIN') {
        AccountSNo = 0;
        cfi.AutoCompleteV2("PenaltyType", "PenaltyType", "AWB_Penalty_PenaltyType", null, "contains");
    }
    else if (userContext.GroupName == 'AGENT') {
        cfi.AutoCompleteV2("PenaltyType", "PenaltyType", "AWB_Penalty_AGENTPenaltyType", null, "contains");
        AccountSNo = userContext.AgentSNo;

        if (userContext.SysSetting.ICMSEnvironment == 'JT') {
            cfi.ResetAutoComplete("AirLineSNo")
            cfi.AutoCompleteV2("AirLineSNo", "AirlineName", "PenaltyReport_Airline", null, "contains");
            cfi.ResetAutoComplete("OriginCity")
            cfi.AutoCompleteV2("OriginCity", "OriginCity", "Penalty_Report_OriginCity", null, "contains");
            cfi.EnableAutoComplete('AirLineSNo', false, false, null);//diasble
            cfi.EnableAutoComplete('OriginCity', false, false, null);//diasbleText_ReferenceNumber_input
            cfi.EnableAutoComplete('ReferenceNumber', false, false, null);//diasbleText_ReferenceNumber_input
            $("#AirLineSNo").val(userContext.AirlineSNo);
            $("#Text_AirLineSNo_input").val(userContext.AirlineCarrierCode);
            $("#AgentSno").val(userContext.AgentSNo);
            $("#Text_AgentSno_input").val(userContext.AgentName);
            $('#tdagent').show();
            $('#tdagentvalue').show();
        }
        else {
            $('#tdagent').hide();
            $('#tdagentvalue').hide();
        }
    }
    else if (userContext.GroupName == 'AIRLINE') {
        AccountSNo = 0;
        cfi.AutoCompleteV2("PenaltyType", "PenaltyType", "AWB_Penalty_PenaltyType", null, "contains");
    }
    else {
        AccountSNo = 0;
        cfi.AutoCompleteV2("PenaltyType", "PenaltyType", "AWB_Penalty_PenaltyType", null, "contains");
    }
    
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
});

var UserCitySno = '';
var ISAccessAllCities = '';
$.ajax({
    url: 'GetCitiesUSERWISE',
    async: false,
    type: "POST",
    dataType: "json",
    contentType: "application/json; charset=utf-8", cache: false,
    success: function (result) {
        if (result.Data.length > 0) {
            ISAccessAllCities = result.Data[0].IsAll;
            UserCitySno = result.Data[0].Cities;
        }
    }
});

function ExtraParameters(textId) {
    var param = [];
    if (textId == "Text_OriginCity" || textId == "Text_AgentSno") {
        var UserSNo = userContext.UserSNo;
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }
}

function ExtraCondition(textId) {
    var filter = cfi.getFilter("AND");
    if (textId == "Text_PenaltyType") {
        if (userContext.SysSetting.ICMSEnvironment == 'JT' && userContext.GroupName == 'AGENT') {
            cfi.setFilter(filter, "IsAgentAllowed", "eq", "1");
        }
        else
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

    if (textId == "Text_AWBNo") {
        if (userContext.AgentSNo != 0 && userContext.SysSetting.ICMSEnvironment != 'JT') {
            cfi.setFilter(filter, "AccountSNo", "in", userContext.AgentSNo);
        }
        var filterCitySNo = cfi.autoCompleteFilter([filter]);
        return filterCitySNo;
    }
}


function refreshawbno() {
    cfi.ResetAutoComplete("AgentSno");
}

//var FromDate = "";
//var ToDate = "";
//var AirLineSNo = "";
//var PenaltyType = "";
//var OriginCity = "";
//var FlightNo = "";
//var AWBNo = "";
//var AccountSNo = 0;
//var ReferenceNumber = "";
//var FlightDate = "";
//var BookingDate = "";
var FD = "";
var BD = "";

$('input[type=radio][name=BasedOn]').change(function () {
    basedOn = $("input[name='BasedOn']:checked").val();
    if (basedOn == 'FD') {
        // $("#FlightDate").attr("placeholder", "Flight Date");
    }
    else {
        // $("#FlightDate").attr("placeholder", "Booking Date");
    }
});

var Model = [];
function SearchVoidData() {
   // $("#BlackListTbl").remove();
  //  $("#BlackListTbl").html('');
    basedOn = $("input[name='BasedOn']:checked").val();
    if (basedOn == 'FD') {
        //  FD= $('#FlightDate').val();
        BD = '';
    }
    else {
        FD = '';
        // BD= $('#FlightDate').val();
    }

    var SearchAccountSNo = $("#Text_AgentSno_input").val() == "" ? "" : $("#AgentSno").val();
    Model =
        {
            FromDate: $('#FromDate').val(),
            ToDate: $('#ToDate').val(),
            AirLineSNo: $('#AirLineSNo').val() == "" ? "0" : $('#AirLineSNo').val(),
            AccountSNo:userContext.GroupName == "AGENT" ? SearchAccountSNo : AccountSNo,//== "" ? AccountSNo : $("#AgentSno").val()
            PenaltyType: $('#PenaltyType').val() == "" ? "0" : $('#PenaltyType').val(),
            OriginCity: userContext.SysSetting.ICMSEnvironment == "GA" ? $('#OriginCity').val()||"" : userContext.CitySNo,
            FlightNo: $('#FlightNo').val() == "" ? "0" : $('#FlightNo').val(),
            AWBNo: $('#AWBNo').val() == "" ? "0" : $('#AWBNo').val(),
            ReferenceNumber: $('#ReferenceNumber').val() == "" ? "0" : $('#ReferenceNumber').val(),
            FlightDate: FD,
            BookingDate: BD,
            ReportType: basedOn,
            pageSize: 100000,
            IsAutoProcess : (OnBlob == true ? 0 : 1)
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

        var startDate = new Date($("#FromDate").data("kendoDatePicker").value());
        startDate = new Date(startDate.setHours(0, 0, 0, 0));

        var endDate = new Date($("#ToDate").data("kendoDatePicker").value());
        endDate = new Date(endDate.setHours(0, 0, 0, 0));

        var DaysDiff = Math.round((endDate - startDate) / 1000 / 60 / 60 / 24);
        if ($('#ReferenceNumber').val() == "" && $('#AWBNo').val() == "" && DaysDiff > 61) {
            ShowMessage('info', 'Need your Kind Attention!', "Maximum 61 days date range can be selected");
            return;
        }

        if (Model.FromDate != undefined && Model.FromDate != undefined) {
            if (Model.FromDate != "" && Model.FromDate != "") {
                if (OnBlob)
                    $.ajax({
                        url: "../Reports/PenaltyReport",
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
                else {
                    $('#grid').css('display', '')
                    $("#grid").data('kendoGrid').dataSource.page(1);
                    if (userContext.SysSetting.ICMSEnvironment == 'JT') {
                        var grid = $("#grid").data("kendoGrid");
                        grid.hideColumn(16); // tax on penalty
                        grid.hideColumn(17); // total  penalty
                    }
                    else {
                        var grid = $("#grid").data("kendoGrid");
                        grid.showColumn(16); // tax on penalty
                        grid.showColumn(17); // total  penalty
                    }

                    if ((userContext.SysSetting.ICMSEnvironment == 'JT') && ((Model.PenaltyType == 0) || (Model.PenaltyType == 3) || (Model.PenaltyType == 11) || (Model.PenaltyType == 12)) && (userContext.SpecialRights.PenaltyReport == true)) {
                        var grid = $("#grid").data("kendoGrid");
                        grid.showColumn(0); // Check box
                        grid.hideColumn(9); // Executed Weight
                        grid.showColumn(23);// Approved Remark
                        grid.showColumn(24);// Approved By
                        $('.trpSubmit').show();
                        $('#Penalty').css('display', 'inline');
                    }
                    else if ((userContext.SysSetting.ICMSEnvironment == 'JT') && ((Model.PenaltyType == 0) || (Model.PenaltyType == 3) || (Model.PenaltyType == 11) || (Model.PenaltyType == 12)) && (userContext.SpecialRights.PenaltyReport == false)) {
                        var grid = $("#grid").data("kendoGrid");
                        grid.hideColumn(0);
                        grid.hideColumn(9);
                        grid.showColumn(23);
                        grid.showColumn(24);
                        $('.trpSubmit').hide();
                        $('#Penalty').css('display', 'none');
                    }
                    else {
                        var grid = $("#grid").data("kendoGrid");
                        if ((Model.PenaltyType == 4) || (Model.PenaltyType == 5) || (Model.PenaltyType == 7) || (Model.PenaltyType == 8) || (Model.PenaltyType == 9) || (Model.PenaltyType == 10)) {
                            grid.showColumn(9);
                        }
                        else {
                            grid.hideColumn(9);
                        }
                        grid.hideColumn(0);
                        grid.hideColumn(23);
                        grid.hideColumn(24);
                        $('.trpSubmit').hide();
                        $('#Penalty').css('display', 'none');
                    }

                    function CheckCharter(evt, rowIndex) {
                        alert(rowIndex);
                    }
                    $('#btnExportToExcel').show();
                }
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
                url: "../PenaltyReport/GetVoidData",
                dataType: "json",
                global: false,
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                data: function GetReportData() {
                    return { Model: Model };
                }
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
                    PenaltyCurrency: { type: "string" },
                    PenaltyCharges: { type: "string" },
                    Tax: { type: "string" },
                    TotalPenalty: { type: "string" },
                    ModeOfPenalty: { type: "string" },
                    BookedBy: { type: "string" },
                    UserName: { type: "string" },
                    Remarks: { type: "string" },
                    Status: { type: "string" },
                    ApprovedBy: { type: "string" },
                    ApprovedDateandTime: { type: "string" }
                }
            }, data: function (data) { return data.Data; }, total: function (data) { return data.Total; }
        },
    }),
    sortable: true, filterable: false,
    pageable: {
        refresh: true, pageSizes: true, previousNext: true, numeric: true, buttonCount: 5, totalinfo: false
    },
    scrollable: true,
    columns: [
        {
            headerTemplate: "<input type='checkbox' id='allcb' name='allcb' disabled='disabled'/> ",
            template: "# if( Status=='') {#<input type='checkbox' id='cb1' onclick=functioncheck(#=SNo#,this) name='cb1' class='test'  />#} else {#<input type='checkbox' id='cb1'  name='cb1' class='test' disabled='disabled' /> #}#", width: "50px"
        },
        { field: "AWBNumber", title: "AWB/Ref No", width: "140px" },
        { field: "Origin", title: "Org", width: "50px" },
        { field: "Destination", title: "Dest", width: "50px" },
        { field: "AWBDate", title: "Booked Date", width: "110px" },
        { field: "FlightNo", title: "Flight No", width: "90px" },
        { field: "FlightDate", title: "Flight Date", width: "115px" },
        { field: "PCS", title: "Pcs", width: "50px" },
        { field: "GrossWeight", title: "Gr.Wt.", width: "70px" },
        { field: "PenaltyWeight", title: "Exe.GrWeight.", width: "70px" },
        { field: "AjentName", title: "Agent Name", width: "140px" },
        { field: "ProductName", title: "Product", width: "90px" },
        { field: "Commidity", title: "Commodity", width: "100px" },
        { field: "SHC", title: "SHC", width: "80px" },
        { field: "PenaltyCurrency", title: "Penalty Currency", width: "120px" },
        { field: "PenaltyCharges", title: "Penalty Amount", width: "120px" },
        { field: "Tax", title: "Tax on Penalty", width: "120px" },
        { field: "TotalPenalty", title: "Total Amount", width: "120px" },
        { field: "PenaltyParameterReferenceNo", title: "Penalty Ref No", width: "120px" },
        { field: "ModeOfPenalty", title: "Mode Of Penalty", width: "125px" },
        { field: "BookedBy", title: "Booked By", width: "120px" },
        { field: "UserName", title: "Action By", width: "120px" },
        { field: "Remarks", title: "Remarks", width: "120px" },
        { field: "Status", title: "Remarks for Approval", template: "# if(( Status=='') && (userContext.SpecialRights.PenaltyReport == true)) {#<input type='text' id='txtRemarksApproved' value='' name='txtRemarksApproved' maxlenght='100' />#} else {#<span> #=Status#</span>#} #", width: "160px", height: "23px" },
        { field: "ApprovedBy", title: "Approved By", width: "120px" },
        { field: "ApprovedDateandTime", title: "Approved Date and Time", width: "190px" },
        { field: "SNo", title: "SNo", type: 'hidden', hidden: true, width: "80px" },
    ]
});

dataSource.bind("error", dataSource_error);

////////////////////////////////
function dataSource_error(e) {
    ShowMessage('warning', 'Something went wrong,please try later !', e.status, "bottom-right");
}

function functioncheck(sno, obj) {
    $("input[id^='cb1']").prop("checked", false);
    $(obj).prop("checked", true);
}

function ExportToExcel() {
    $('#df1 #FromDate').val(Model.FromDate);
    $('#df1 #ToDate').val(Model.ToDate);
    $('#df1 #AirLineSNo').val(Model.AirLineSNo);
    $('#df1 #AccountSNo').val(Model.AccountSNo);
    $('#df1 #PenaltyType').val(Model.PenaltyType);
    $('#df1 #OriginCity').val(Model.OriginCity);
    $('#df1 #FlightNo').val(Model.FlightNo);
    $('#df1 #AWBNo').val(Model.AWBNo);
    $('#df1 #ReferenceNumber').val(Model.ReferenceNumber);
    $('#df1 #FlightDate').val(Model.FlightDate);
    $('#df1 #BookingDate').val(Model.BookingDate);
    $('#df1 #ReportType').val(Model.ReportType);
    $('#df1').submit();
}

function UpdateDataAWBReservationPenaltyApproved() {
    var arrayOfValues = [];
    var PenaltyType1 = '0';
    var RemarksBlanks = '0';
    var chk = 0;
    var vgrid = $("#grid").data("kendoGrid");
    //Getting grid items
    var items = vgrid.dataSource.data();
    for (i = 0; i < items.length; i++) {
        var item = items[i];
        var str = $("#Text_AWBNo").val();
        var usersno = userContext.UserSNo;
        var abc = $("table[role='grid']").find('tr:eq(' + i + ')').find("input[name^='txtRemarksApproved']").val();
        var bcd = $("table[role='grid']").find('tr:eq(' + i + ')').find("input[name^='cb1']").prop("checked");
        if ((bcd == true)) {
            chk = 1;
            var ApprovalRemarks = $("table[role='grid']").find('tr:eq(' + i + ')').find("input[name^='txtRemarksApproved']").val();
            if (((PenaltyType1 == '3') || (PenaltyType1 == '0') || (PenaltyType1 == '11') || (PenaltyType1 == '12')) && ApprovalRemarks == '') {
                RemarksBlanks = '1';
            }
            if ((PenaltyType1 == '3') || (PenaltyType1 == '0') || (PenaltyType1 == '11') || (PenaltyType1 == '12')) {
                var Array = {
                    SNo: items[i].SNo,
                    RemarksForApproval: ApprovalRemarks,
                    usersno: usersno
                };
                arrayOfValues.push(Array);
            }
        }
    }

    if (((PenaltyType1 == '3') || (PenaltyType1 == '0') || (PenaltyType1 == '11') || (PenaltyType1 == '12')) && (RemarksBlanks == '1')) {
        ShowMessage('warning', 'Warning -Penalty Report', "Please Enter Remarks ");
        return;
    }
    else {
        if (arrayOfValues.length > 0) {
            $.ajax({
                url: "UpdateAWBPenaltyForApproval", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ AwbNoList: arrayOfValues }),
                success: function (result) {
                    var a = JSON.parse(result);
                    var b = Object.values(a)
                    var GetSucessResult = b[b.length - 1][0].Column1;
                    var GetMessage = b[b.length - 1][0].Column2;

                    if ((userContext.SysSetting.ICMSEnvironment == 'JT') && (GetSucessResult == 1)) {
                        ShowMessage('warning', 'Warning - AWB Penalty', GetMessage);
                        return;
                    }

                    if (GetSucessResult == 0) {
                        ShowMessage('success', 'Success - AWB Penalty', "Approved  successfully !", "bottom-right");
                        $('#Text_ReferenceNumber_input').val('')
                        $("#Text_AWBNo_input").val('');
                        $("#Text_AWBNo").val('');
                        $("#Text_AWBNo1_input").val('');
                        $("#Text_AWBNo1").val('');
                        $("#BlackListTbl").remove();
                        $('.trpSubmit').hide();
                    }
                    else {

                    }
                }
            });
        }
    }

    if (chk == 0) {
        ShowMessage('warning', 'Warning - Penalty Report', "Please Check atleast One AWB/Reference No  !");
    }
}