$(document).ready(function ()
{
    UWSInfoList();
   
    //$("input[name^='ULDNo']").keydown(function (e) { // Allow: backspace, delete, tab, escape, enter and .
    //    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 || (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) || (e.keyCode >= 35 && e.keyCode <= 40)) {
    //        // let it happen, don't do anything return; 
    //    }
    //    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) { e.preventDefault(); }
    //});

});


var paymentList = null;
var currentprocess = "";
var currentslisno = 0;
var currentUWSSNo = 0;
var currentGrossWeight = 0;
var CurrentFlightNo = "";
var CurrentFlightDate = "";
var CurrentEquipmentNo = "";
var CurrentIsDGR = 0;
var printorigin = "";
var accpcs = 0;
var accgrwt = 0;
var accvolwt = 0;
var bkdpcs = 0;
var bkdgrwt = 0;
var bkdvolwt = 0;
var awborigin = "";
var slino = "";
var isBUP = false;
var IsULD = false;
var IsProcessed = false;
var IsFinalSLI = false;
var TempSLINo = 0;

var Tpcs = 0.000;
var Tgwt = 0.000;
var Tnwt = 0.000;
var len = 0;

var _IS_DEPEND = false;
function PutColoninStartRange(obj) {
    if ($("#LoadType").val() == "") {
        //alert("Please Select Load Type First");
        ShowMessage('warning', 'Warning - UWS', "Please Select Load Type First.", "bottom-right");
        $("#LoadType").val('');
        return false;
    }

    var s = $("#" + obj.id).val().length
    if (s == 3) {
        $("#" + obj.id).val($("#" + obj.id).val() + '-');
    }
    if (s == 7) {
        $("#" + obj.id).val($("#" + obj.id).val() + '-');
    }

}
function GetProcessSequence(processName) {

    $.ajax({
        url: "Services/Shipment/UWSInfoService.svc/GetProcessSequence?ProcessName=" + processName, async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (data) {
            var processdata = jQuery.parseJSON(data);
            // alert(processdata.Table0)
            if (processdata.Table0 != undefined && processdata.Table0.length > 0) {
                var processlist = processdata.Table0;
                var out = '[';
                $.each(processlist, function (i, item) {
                    if (item) {
                        if (parseInt(i) > 0) {
                            out = out + ',{ key: "' + item.rownum + '", value: "' + item.subprocessname + '", isoneclick: "' + item.isoneclick.toLowerCase() + '"}'
                        }
                        else {
                            out = out + '{ key: "' + item.rownum + '", value: "' + item.subprocessname + '", isoneclick: "' + item.isoneclick.toLowerCase() + '"}'
                        }
                    }
                });
            }
            out = out + ']';
            processList = eval(out);

        }
    });
}
function UWSInfoList() {

    _CURR_PRO_ = "UWSInfo";
    _CURR_OP_ = "UWS";
    $("#licurrentop").html(_CURR_OP_);
    // $("#divSearch").html("");
    //$("#divShipmentDetails").html("");
    //$("#btnSave").unbind("click");
    CleanUI();
    // cfi.ShowIndexView("divShipmentDetails", "Services/FormService.svc/GetGridData/" + _CURR_PRO_ + "/Shipment/Booking");



    $.ajax({
        url: "Services/Shipment/UWSInfoService.svc/GetWebForm/" + _CURR_PRO_ + "/UWS/UWSSearch/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {

            //var theDiv = document.getElementById("divbody");
            //theDiv.innerHTML += "<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form";
            $("#divbody").html(divContent);//.html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            // $("#divContent").html(divContent);
            $('#divSearchDetail').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form>");
            $("#divFooter").html(fotter).show();
            //Check Page New rights
            var rights = GetPageRightsByAppName("Shipment", "UWSInfo");
            if (!rights.IsNew) {
                $("#btnNew").remove();
            }

            //var theDiv = document.getElementById("divbody").innerHTML;
            //theDiv += "<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form>";
            //$("#divContent").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + theDiv + "</form>");
            $("#btnSearch").hide();

            //$('tr').find('td[class="form2buttonrow"]').remove();
            //$("#divContent").html(divContent);
            //$("#divFooter").html(fotter).show();
            // cfi.AutoComplete("searchAPTDestCity", "AirportCode,AirportName", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
            cfi.AutoComplete("searchRouting", "AirportCode,AirportName", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
            cfi.AutoComplete("searchAirline", "CarrierCode,AirlineName", "v_ActiveAirline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");
            cfi.AutoComplete("searchProcess", "ProcessName", "UWSProcess", "SNo", "ProcessName", ["ProcessName"], null, "contains");
            //cfi.AutoComplete("searchSLINo", "SLINO", "vGetSLINOSearch", "SLINO", "SLINO", ["SLINO"], null, "contains");
            cfi.AutoComplete("searchFlightNo", "SNo,FlightNo", "vwUWSDailyFlight", "SNo", "FlightNo", ["FlightNo"], null, "contains");

            if (_CURR_PRO_ == "UWSInfo") {

                cfi.ShowIndexView("divDetail", "Services/Shipment/UWSInfoService.svc/GetUWSGridData/" + _CURR_PRO_ + "/UWS/Booking/0/0/0/0/1222", "Scripts/maketrans.js?" + Math.random());
                //$("#divContent").html(divContent);
                //$("#divFooter").html(fotter).show();

            }

            //$('#aspnetForm').on('submit', function (e) {
            //    e.preventDefault();
            //});
            //$("#btnSearch").bind("click", function () {
            //    CleanUI();
            //    $('#divShipmentDetails').unbind("click").bind("click", function () {
            //        $(".k-loading-mask").attr("style", "display:none");
            //    })
            //    UWSSearch();
            //   // $('tr').find('td.form2buttonrow').hide();
            //});
            $('tr').find('td[class="form2buttonrow"]').remove();
            $("#btnNew").unbind("click").bind("click", function () {

                // CleanUI();
                $("#hdnAWBSNo").val("");
                $("#divDetailSHC").html("");
                currentslisno = 0;
                IsFinalSLI = false;
                IsProcessed = false;
                var module = "UWS";
                var FlightDate = $("#searchFlightDate").val();
                var FlightSNo = $("#searchFlightNo").val();
                var ProcessSNo = $("#searchProcess").val();
                //if (FlightDate != "" && FlightSNo != "" && ProcessSNo!="") {
                //if (true) {
                $.ajax({
                    url: "Services/Shipment/UWSInfoService.svc/GetWebForm/" + _CURR_PRO_ + "/" + module + "/UWSAWB/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        $('#btnSave').show();
                        $('#btnSaveToNext').hide();
                        // $('#divNewDetail').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form>");
                        $("#divNewDetail").html(result);
                        // BindSLICode();
                        if (result != undefined || result != "") {
                            InitializePage("UWSAWB", "divNewDetail");
                            currentprocess = "UWSAWB";
                            //  font
                            // $('#SLINo').attr('disabled', 1);
                            // OnTypeSelection("Text_BookingType");
                            // $("#tblShipmentInfo").hide();
                            //GetProcessSequence("UWSInfo"); //later on
                            //  CheckSLIType();
                            $("#IsManual").val(0);
                            $('tr').find('td.form2buttonrow').remove();

                        }
                    }
                });
                // }
                //else {
                //    ShowMessage('warning', 'Warning - UWS', "Flight Date,Flight No,Process are mandatory", "bottom-right");
                //}

            });


        }
    });
}
function BindEvents(obj, e, isdblclick) {

    $("#divGraph").show();
    $("#divXRAY").hide();
    if ($(obj).attr("class") == "dependentprocess")
        _IS_DEPEND = true;
    else
        _IS_DEPEND = false;
    ResetDetails();
    $("#btnCancel").unbind("click").bind("click", function () {
        ResetDetails();
    });

    var subprocess = $(obj).attr("process").toUpperCase();
    currentprocess = subprocess;
    var closestTr = $(obj).closest("tr");

    var sliSNoIndex = 0;
    var sliNoIndex = 0;
    var UWSFlightDateIndex = "";
    var trLocked = $(".k-grid-header-wrap tr");
    var trRow = $(".k-grid-header-wrap tr");
    //console.log($(trLocked).html())
    //  sliSNoIndex =trRow  0;
    //var trRow = $(obj).closest("div.k-grid").find("div.k-grid-header").find("tr[role='row']");
    sliSNoIndex = 1;
    var isBUPIndex = trLocked.find("th[data-field='isBup']").index();
    var IsULDIndex = trLocked.find("th[data-field='IsULD']").index();
    var IsProcessedIndex = trLocked.find("th[data-field='IsProcessed']").index();
    var IsFinalSLIIndex = trLocked.find("th[data-field='IsFinalSLI']").index();
    var IsDGRIndex = trLocked.find("th[data-field='IsDGR']").index();
    var EquipmentNoIndex = trLocked.find("th[data-field='EquipmentNo']").index();
    var TareWeightIndex = trLocked.find("th[data-field='TareWeight']").index();

    var IsGrossWeightIndex = trLocked.find("th[data-field='ScaleWeight']").index();
    var UWSSNoIndex = 0;
    currentUWSSNo = closestTr.find("td:eq(" + UWSSNoIndex + ")").text();
    sliNoIndex = trLocked.find("th[data-field='SLINo']").index();
    CurrentFlightNo = closestTr.find("td:eq(" + sliSNoIndex + ")").text();
    currentGrossWeight = closestTr.find("td:eq(" + IsGrossWeightIndex + ")").text();
    CurrentIsDGR = closestTr.find("td:eq(" + IsDGRIndex + ")").text();
    UWSFlightDateIndex = sliSNoIndex + 1;
    CurrentEquipmentNo = closestTr.find("td:eq(" + EquipmentNoIndex + ")").text();

    CurrentTareWeight = closestTr.find("td:eq(" + TareWeightIndex + ")").text();
    CurrentFlightDate = closestTr.find("td:eq(" + UWSFlightDateIndex + ")").text();
    slino = closestTr.find("td:eq(" + sliNoIndex + ")").text();
    isBUP = closestTr.find("td:eq(" + isBUPIndex + ")").text() == "true" ? true : false;
    IsULD = closestTr.find("td:eq(" + IsULDIndex + ")").text() == "true" ? true : false;
    IsProcessed = closestTr.find("td:eq(" + IsProcessedIndex + ")").text() == "true" ? true : false;
    IsFinalSLI = closestTr.find("td:eq(" + IsFinalSLIIndex + ")").text() == "true" ? true : false;

    // alert(closestTr.find("td:eq(" + sliSNoIndex + ")").text());
    //alert(slino)
    // alert(currentslisno)
    $('#btnSave').show();
    $('#btnSaveToNext').show();
    ShowProcessDetails(subprocess, isdblclick);
    //GetProcessSequence("UWSInfo");



    $("#btnSave").unbind("click").bind("click", function () {
        //alert('Test');
        if (cfi.IsValidSection('divDetail')) {
            if (true) {
                if (SaveFormData(subprocess))
                    SLISearch();
            }
        }
        else {
            return false
        }
    });



}
function ResetDetails(obj, e) {
    //$("#divDetail").html("");
    //$("#tblShipmentInfo").hide();
    $("#divNewDetail").html("");
    //$("#divDetailSHC").html("");

}
function ShowProcessDetails(subprocess, isdblclick) {


    if (subprocess.toUpperCase() == "UWSPRINT") {
        $('#btnSave').hide();
        $('#btnSaveToNext').hide();
        $('#divDetailSHC').html("");

        $.ajax({
            url: "HtmlFiles/ULD Print/uld.html", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#divNewDetail").html(result);
                if (result != undefined || result != "") {

                    InitializePage(subprocess, "divNewDetail", isdblclick);
                    //$("#Validate").addClass("btn-info");
                    // var jj = "jjjkjk";


                }
            },
            beforeSend: function (jqXHR, settings) {
            },
            complete: function (jqXHR, textStatus) {
            },
            error: function (xhr) {
                // var a = "";
            }
        });
    }
    else if (subprocess.toUpperCase() == "EQUIPMENTTAG") {
        $('#btnSave').hide();
        $('#btnSaveToNext').hide();
        $('#divDetailSHC').html("");
        $.ajax({
            url: "HtmlFiles/ULD Print/uld.html", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#divNewDetail").html(result);
                if (result != undefined || result != "")
                {
                    InitializePage(subprocess, "divNewDetail", isdblclick);
                }
            },
            beforeSend: function (jqXHR, settings)
            {
            },
            complete: function (jqXHR, textStatus)
            {
            },
            error: function (xhr)
            {
            }
        });
    }
    else if (subprocess.toUpperCase() == "REMOVEBULK")
    {
        $('#btnSave').hide();
        $('#btnSaveToNext').hide();
        InitializePage(subprocess, "divNewDetail", isdblclick);
    }
    else if (subprocess.toUpperCase() == "REWEIGING") {
        $('#btnSave').hide();
        $('#btnSaveToNext').hide();
        InitializePage(subprocess, "divNewDetail", isdblclick);
    }
    else if (subprocess.toUpperCase() == "UWSFLIGHTASSIGN") {

        $("#divDetailSHC").html("");
        var HTMLResult = "";
        HTMLResult = "<table class='WebFormTable'><tr><td class='formthreelabel'>Flight Date</td><td><span class='k-widget k-datepicker k-header' style='width: 100px;'><span class='k-picker-wrap k-state-default'><input type='text' class='k-input' name='FlightDate' id='FlightDate' style='width: 100%;' data-valid='required' data-valid-msg='Select Flight Date' tabindex='1' addonchange='ResetSearch' controltype='datetype' maxlength='' value='' data-role='datepicker' role='combobox' aria-expanded='false' aria-owns='FlightDate_dateview' aria-disabled='false' aria-readonly='false' aria-activedescendant='527627cd-3389-404d-bb84-6a69111de534_cell_selected'><span unselectable='on' class='k-select' role='button' aria-controls='FlightDate_dateview'><span unselectable='on' class='k-icon k-i-calendar'>select</span></span></span></span></td><td class='formthreelabel'>Flight No</td><td class='formthreeInputcolumn'><input type='hidden' name='FlightNo' id='FlightNo' value=''/> <input type='text'  name='Text_FlightNo' id='Text_FlightNo' tabindex='2' controltype='autocomplete' maxlength='10' /></td><td class='formthreeInputcolumn'><input type='button' tabindex='3' class='btn btn-block btn-success btn-sm' name='btnSaveFlight' id='btnSaveFlight' style='width:90px;' value='Save' onclick='SaveAssignFlight();'></td></tr><tr><td colspan='5'></td></tr>";
        // added for release equipment button by anmol
        if (CurrentFlightNo == "") {
            HTMLResult = HTMLResult + "<tr><td colspan='5' style='text-align:right' class='formthreeInputcolumn' ><input type='button' tabindex='5' class='btn btn-block btn-success btn-sm' name='btnReleaseEquipment' id='btnReleaseEquipment' style='width:120px;' value='Release Equipment' onclick='ReleaseEquipment();'></td></tr>";
        }
        //end
        if (CurrentFlightNo != "") {
            HTMLResult = HTMLResult + "<tr><td colspan='4' style='text-align:right' class='formthreeInputcolumn' ><input type='button' tabindex='4' class='btn btn-block btn-success btn-sm' name='btnSaveUnassignFlight' id='btnSaveUnassignFlight' style='width:120px;' value='Unassign Flight' onclick='SaveUnAssignFlight();'></td><td colspan='1' style='text-align:right' class='formthreeInputcolumn' ><input type='button' tabindex='5' class='btn btn-block btn-success btn-sm' name='btnGetUnAssignFlightNReleaseEquipment' id='btnGetUnAssignFlightNReleaseEquipment' style='width:220px;' value='Unassign Flight & Release Equipment' onclick='GetUnAssignFlightNReleaseEquipment();'></td></tr>";
            //HTMLResult = HTMLResult + "<tr><td colspan='5' style='text-align:right' class='formthreeInputcolumn' ><input type='button' tabindex='4' class='btn btn-block btn-success btn-sm' name='btnSaveUnassignFlight' id='btnSaveUnassignFlight' style='width:120px;' value='Unassign Flight' onclick='SaveUnAssignFlight();'></td></tr>";
        }
        HTMLResult = HTMLResult + "</table>";

        $("#divFlightAssign").html(HTMLResult)
        //cfi.AutoComplete("ULDType", "ULDName", "ULD", "SNo", "ULDName", ["ULDName"], null, "contains");
        cfi.AutoComplete("FlightNo", "FlightNo", "v_DailyFlight", "SNo", "FlightNo", ["FlightNo"], null, "contains");
        cfi.PopUp("divFlightAssign", "Assign Flight", 700);
        $("#FlightDate").kendoDatePicker();
    }
    else {
        $.ajax({
            url: "Services/Shipment/SLInfoService.svc/GetWebForm/" + _CURR_PRO_ + "/SLI/" + subprocess + "/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#divDetail").html(result);
                if (result != undefined || result != "") {

                    InitializePage(subprocess, "divDetail", isdblclick);
                    $("#Validate").addClass("btn-info");
                }
            },
            beforeSend: function (jqXHR, settings) {
            },
            complete: function (jqXHR, textStatus) {
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
    // }

}
function UWSSearch() {

    //var DestinationAirportSNo = $("#Text_searchAPTDestCity").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_searchAPTDestCity").data("kendoAutoComplete").key();
    var AirlineSNo = $("#Text_searchAirline").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_searchAirline").data("kendoAutoComplete").key();
    //var RoutingCitySNo = $("#Text_searchRouting").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_searchRouting").data("kendoAutoComplete").key();
    var searchProcessSNo = $("#Text_searchProcess").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_searchProcess").data("kendoAutoComplete").key();
    var searchFlightSNo = $("#Text_searchFlightNo").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_searchFlightNo").data("kendoAutoComplete").key();
    var FlightDate = "0";
    if ($("#searchFlightDate").val() != "") {
        FlightDate = cfi.CfiDate("searchFlightDate") == "" ? "0" : cfi.CfiDate("searchFlightDate");// "";//month + "-" + day + "-" + year;
    }
    //var AWBPrefix = $("#searchAWBPrefix").val() == "" ? "A~A" : $("#searchAWBPrefix").val();
    //var AWBNo = $("#searchAWBNo").val() == "" ? "A~A" : $("#searchAWBNo").val();
    var LoggedInCity = "SHJ";
    $("#imgprocessing").show();
    // if (AirlineSNo != "0" && searchProcessSNo != "0" && searchFlightSNo != "0" && FlightDate != "0") {
    //if (_CURR_PRO_ == "UWSInfo") {
    //    cfi.ShowIndexView("divShipmentDetails", "Services/Shipment/UWSInfoService.svc/GetUWSGridData/" + _CURR_PRO_ + "/UWS/Booking/" + AirlineSNo + "/" + searchProcessSNo + "/" + FlightDate + "/" + searchFlightSNo + "/1222", "Scripts/maketrans.js?" + Math.random());

    //}
    //}
    //else {
    //    ShowMessage('warning', 'Warning - SLI', "Flight Date,Flight No,Process are mandatory", "bottom-right");
    //}

    $('tr').find('td.form2buttonrow').remove();
    //$('td[class="form2buttonrow"]').hide();

    $("#imgprocessing").hide();

}

function OnSuccessGrid() {

    $('tr').find('td.form2buttonrow').remove();
    var TrHeader = $("div[id$='divDetail']").find("div[class^='k-grid-header'] thead tr");
    // var ScaleWeight = TrHeader.find("th[data-field='ScaleWeight']").index();
    var ScaleWeightIndex = TrHeader.find("th[data-field='ScaleWeight']").index();
    var ShipmentIndex = TrHeader.find("th[data-field='IsULD']").index();
    var ProcessIndex = TrHeader.find("th[data-field='Process']").index();
    var FlightIndex = TrHeader.find("th[data-field='FlightNo']").index();
    var PrintIndex = TrHeader.find("th[data-field='IsPrint']").index();
    var DepartedIndex = TrHeader.find("th[data-field='IsDeparted']").index();


    $("div[id$='divDetail']").find("div[class^='k-grid-content'] tbody tr").each(function (row, tr) {
        //$(tr).find("td:eq(" + ScaleWeightIndex + ")").text() == 0 &&
        if ($(tr).find("td:eq(" + ShipmentIndex + ")").text() == "true" && $(tr).find("td:eq(" + ScaleWeightIndex + ")").text() > 0 && ($(tr).find("td:eq(" + ProcessIndex + ")").text() == "Export" ) && $(tr).find("td:eq(" + FlightIndex + ")").text() != "") {
            $(tr).find('input[type="button"][process="UWSPRINT"]').css("display", "block");
        }
        else {
            $(tr).find('input[type="button"][process="UWSPRINT"]').css("display", "none");
        }
        if ($(tr).find("td:eq(" + ScaleWeightIndex + ")").text() > 0 && ($(tr).find("td:eq(" + ProcessIndex + ")").text() == "Export" ) && $(tr).find("td:eq(" + FlightIndex + ")").text() != "") {
            $(tr).find('input[type="button"][process="EQUIPMENTTAG"]').css("display", "block");
        }
        else {
            $(tr).find('input[type="button"][process="EQUIPMENTTAG"]').css("display", "none");
        }
        var SpecialRights = userContext.SpecialRights.UWSAFT == true ? 1 : 0;
        if ($(tr).find("td:eq(" + DepartedIndex + ")").text() == "false" && SpecialRights == 1 && $(tr).find("td:eq(" + ProcessIndex + ")").text() == "Export") {
            $(tr).find('input[type="button"][process="UWSFLIGHTASSIGN"]').css("display", "block");
        }
        else {
            $(tr).find('input[type="button"][process="UWSFLIGHTASSIGN"]').css("display", "none");
        }
        if ($(tr).find("td:eq(" + DepartedIndex + ")").text() == "false" && $(tr).find("td:eq(" + ShipmentIndex + ")").text() == "false" && ($(tr).find("td:eq(" + ProcessIndex + ")").text() == "Export" ) && $(tr).find("td:eq(" + FlightIndex + ")").text() != "") {
            $(tr).find('input[type="button"][process="REMOVEBULK"]').css("display", "block");
        }
        else {
            $(tr).find('input[type="button"][process="REMOVEBULK"]').css("display", "none");
        }
        if ($(tr).find("td:eq(" + DepartedIndex + ")").text() == "false" && $(tr).find("td:eq(" + ScaleWeightIndex + ")").text() > 0 && ($(tr).find("td:eq(" + ProcessIndex + ")").text() == "Export" || $(tr).find("td:eq(" + ProcessIndex + ")").text() == "Offload") && $(tr).find("td:eq(" + FlightIndex + ")").text() != "") {
            $(tr).find('input[type="button"][process="REWEIGING"]').css("display", "block");
        }
        else {
            $(tr).find('input[type="button"][process="REWEIGING"]').css("display", "none");
        }

    });
}

function ShowGridBulkData(obj) {
    var UWSSNo = $(obj).closest("tr").find("td:eq(0)").text();
    var EquipmentNo = $(obj).closest("tr").find("td:eq(4)").text();
    if (UWSSNo != "" && EquipmentNo != "") {
        $.ajax({
            url: "Services/Shipment/UWSInfoService.svc/GetGridWaybillDetails?UWSSNo=" + UWSSNo + "&EquipmentNo=" + EquipmentNo, async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var data = jQuery.parseJSON(result);
                $("#divGridBulkData").html("");
                if (data.Table0.length >= 1) {
                    var tbl = "";
                    tbl += "<table width='100%'><thead  style='text-align:center'><tr class='ui-widget-header'><td>Waybill No</td><td>Count of Pieces</td><td>Pieces </td></tr>";
                    for (var i = 0; i < data.Table0.length; i++) {
                        tbl += "<tr><td style='text-align:center' width='50%'><label id='lblGridBulkWaybillNo' name='lblGridBulkWaybillNo'>" + data.Table0[i].AWBNo + "</label></td><td style='text-align:center' width='50%'><label id='lblGridBulkCountofPieces' name='lblGridBulkCountofPieces'>" + data.Table0[i].CountOfPieces + "</label></td><td  width='50%' style='text-align:left'><label id='lblGridBulkPiece' name='lblGridBulkPiece'><div class='new' style='word-wrap:break-word; display:block; width:600px;'>" + data.Table0[i].Pieces + "</div></label></td></tr>";
                    }
                    tbl += "</thead></table>"
                    $("#divGridBulkData").html(tbl);
                    cfi.PopUp("divGridBulkData", "Bulk Details", "800");
                }
            },
            error: {

            }
        });
    }
    else {
        ShowMessage('warning', 'Need your Kind Attention!', 'Data Not found!');
    }
}

function ReWeights() {
    $("#ScaleWeight").val('');
    $("#_tempScaleWeight").val('');

}

function showShipment(EquipmentSNo, UWSSNo, obj, typeOfShipment) {

    //alert(EquipmentSNo + "-" + $(obj).text())
    var ULDNo = $(obj).text();
    // cfi.PopUp("tblMessageType", "Shipment Details", "500");
    if (EquipmentSNo > 0 && $(obj).text() != "" && typeOfShipment == 0) {
        $.ajax({
            url: "Services/Shipment/UWSInfoService.svc/GetULDDetails?ULDNo=" + $(obj).text() + "&UWSSNo=" + UWSSNo, async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var data = jQuery.parseJSON(result);
                // var data = result.split(',');
                $("#divNewBooking").html("");
                if (data.Table0.length == 1) {
                    var theDiv = document.getElementById("divNewBooking");
                    theDiv.innerHTML = "";
                    if (data.Table1.length == 0) {
                        var table = "<table width='100%'><thead  style='text-align:center'><tr><td colspan='3'></td><td ><a href='#' onClick='showOverhangData(); return false;'><b>Overhang Details</b></a></td></tr><tr class='ui-widget-header'><td>ULD Class</td><td>ULD Loading Code </td><td> ULD Loading Indicator</td><td>ULD Contour Code</td></tr><tr><td style='text-align:center'><label id='lblULDClass'>" + data.Table0[0].ULDClass + "</label></td><td style='text-align:center'><label id='lblULDLoadingCode'>" + data.Table0[0].ULDLoadingCode + "</label></td><td><label id='lblULDLoadingIndicator' name='lblULDLoadingIndicator'>" + data.Table0[0].ULDLoadingIndicator + "</label></td><td style='text-align:center'>" + data.Table0[0].ULDContour + "</td></tr></table>"
                        var Waybilltable = "<table width='100%'><thead  style='text-align:center'><tr class='ui-widget-header'><td>No data found</td></tr>";

                        Waybilltable += "</thead></table>";
                        theDiv.innerHTML += table;
                        theDiv.innerHTML += Waybilltable;
                        cfi.PopUp("divNewBooking", "Shipment Details", "500");
                    }
                    else {
                        var table = "<table width='100%'><thead  style='text-align:center'><tr><td colspan='3'></td><td ><a href='#' onClick='showOverhangData(\"" + data.Table1[0].ULDStockSNo + "\",\"" + data.Table1[0].DailyFlightSNo + "\"); return false;'><b>Overhang Details</b></a></td></tr><tr class='ui-widget-header'><td>ULD Class</td><td>ULD Loading Code </td><td> ULD Loading Indicator</td><td>ULD Contour Code</td></tr><tr><td style='text-align:center'><label id='lblULDClass'>" + data.Table0[0].ULDClass + "</label></td><td style='text-align:center'><label id='lblULDLoadingCode'>" + data.Table0[0].ULDLoadingCode + "</label></td><td><label id='lblULDLoadingIndicator' name='lblULDLoadingIndicator'>" + data.Table0[0].ULDLoadingIndicator + "</label></td><td style='text-align:center'>" + data.Table0[0].ULDContour + "</td></tr></table>"
                        var Waybilltable = "<table width='100%'><thead  style='text-align:center'><tr class='ui-widget-header'><td>AWB No</td><td>Total Pieces </td></tr>";
                        for (var i = 0; i < data.Table1.length; i++) {
                            Waybilltable += "<tr><td><label id='lblWaybillNo'>" + data.Table1[i].AWBNo + "</label></td><td ><label id='lblTotalPieces'>" + data.Table1[i].TotalPieces + "</label></td></tr>";
                        }
                        Waybilltable += "</thead></table>";
                        theDiv.innerHTML += table;
                        theDiv.innerHTML += Waybilltable;
                        cfi.PopUp("divNewBooking", "Shipment Details", "500");
                    }
                }
                ULDNo = "";
            },
            error: {

            }
        });
    }
    else if (EquipmentSNo > 0 && $(obj).text() != "" && typeOfShipment == 1) {
        $.ajax({
            url: "Services/Shipment/UWSInfoService.svc/GetWaybillDetails?EquipmentSNo=" + EquipmentSNo + "&UWSSNo=" + UWSSNo, async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var data = jQuery.parseJSON(result);
                // var data = result.split(',');
                $("#divNewBooking").html("");
                if (data.Table0.length >= 1) {
                    var tbl = "";
                    // var theDiv = document.getElementById("divDetailSHC");
                    tbl += "<table width='100%'><thead  style='text-align:center'><tr class='ui-widget-header'><td>Waybill No</td><td>Pieces </td></tr>";
                    //var shipment = data.Table0[0].Shipment.split(',');
                    for (var i = 0; i < data.Table0.length; i++) {
                        tbl += "<tr><td style='text-align:center' width='50%'><label id='lblWaybillNo'>" + data.Table0[i].AWBNo + "</label></td><td style='text-align:center' width='50%'><label id='lblPiece' name='lblPiece'>" + data.Table0[i].Pieces + "</label></td></tr>";

                    }
                    tbl += "</thead></table>"
                    $("#divNewBooking").html(tbl);
                    cfi.PopUp("divNewBooking", "Shipment Details", "500");
                }
            },
            error: {

            }
        });
    }

}

function showOverhangData(ULDStockSNo, DailyFlightSNo) {
    $.ajax({
        url: "Services/Shipment/UWSInfoService.svc/GetULDOverhangData?ULDStockSNo=" + ULDStockSNo + "&DailyFlightSNo=" + DailyFlightSNo, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var data = jQuery.parseJSON(result);
            // var data = result.split(',');
            $("#divULDOverhang").html("");
            var theDiv = document.getElementById("divULDOverhang");
            theDiv.innerHTML = "";
            if (data.Table1.length >= 1) {

                var Waybilltable = "<table width='100%'><thead  style='text-align:center'><tr class='ui-widget-header'><td>SNo</td><td>	Left/Right </td><td>Overhang Details</td><td>Measurement Unit</td><td>Type</td><td>Other Info</td></tr>";
                for (var i = 0; i < data.Table1.length; i++) {
                    Waybilltable += "<tr><td><label id='lblSNo'>" + data.Table1[i].list + "</label></td><td ><label id='lblLR'>" + data.Table1[i].text_overhangdirection + "</label></td><td ><label id='lblOverhang'>" + data.Table1[i].overhangwidth + "</label></td><td ><label id='lblMeasurement'>" + data.Table1[i].text_overhangmesunit + "</label></td><td ><label id='lblType'>" + data.Table1[i].text_overhangtype + "</label></td><td ><label id='lblOtherInfo'>" + data.Table1[i].overhangotherinfo + "</label></td></tr>";
                }

                Waybilltable += "</thead></table>";
                var Waybill = "<table width='100%'><thead  style='text-align:center'><tr class='ui-widget-header'><td colspan='3'>Cut off Height</td><td colspan='3'>	Measurement Unit </td></tr>";
                Waybill += "<tr ><td colspan='3'><label id='lblCutOffHeight'>" + (data.Table0[0].CutOffHeight == "-1") ? "" : (data.Table0[0].CutOffHeight) + "</label></td><td colspan='3'><label id='lblCutOffMesUnit'>" + data.Table0[0].text_CutOffMesUnit + "</label></td></tr>";
                theDiv.innerHTML += Waybilltable;
                theDiv.innerHTML += Waybill;
                cfi.PopUp("divULDOverhang", "ULD Overhang", "600");

            }
            else {
                var Waybilltable = "<table width='100%'><thead  style='text-align:center'><tr class='ui-widget-header'><td>No Data Found</td></tr>";

                Waybilltable += "</thead></table>";
                theDiv.innerHTML += Waybilltable;
                cfi.PopUp("divULDOverhang", "ULD Overhang", "500");
            }
        },
        error: {

        }
    });
}
function checkProgrss(item, subprocess, displaycaption) {

    if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_1_P") >= 0) {
        return "\"completeprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_1_F") >= 0) {
        return "\"completeprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_2_F") >= 0) {
        return "\"partialprocess\"";
    }
    else {
        return "\"incompleteprocess\"";
    }
}

function CleanUI() {
    //$("#divDetail").html("");
    $("#btnSave").unbind("click");
    $("#btnSaveToNext").unbind("click");
    $("#divDetailSHC").html("");
}

function InitializePage(subprocess, cntrlid, isdblclick) {
    // $("#tblShipmentInfo").show();
    InstantiateControl(cntrlid);
    $('#btnSave').text('Save')
    $('#btnSaveToNext').text('Save & Next')
    // alert(subprocess.toUpperCase());
    if (subprocess.toUpperCase() == "SLICUSTOMER") {
        BindSLICustomerInfo();
    }
    else if (subprocess.toUpperCase() == "SLIDIMENSION") {
        BindSLIDimensionEvents();
    }
    else if (subprocess.toUpperCase() == "UWSAWB") {
        BindUWSAWB();
    }
    else if (subprocess.toUpperCase() == "SLICHARGES") {
        BindSLICharges();
        // return
    }
    else if (subprocess.toUpperCase() == "SLIUNLOADING") {

        BindSLIUnloading();
    }
    else if (subprocess.toUpperCase() == "UWSPRINT") {
        GetUWSprint();

    }
    else if (subprocess.toUpperCase() == "EQUIPMENTTAG") {
        GetUWSEquipmentPrint();

    }
    else if (subprocess.toUpperCase() == "REMOVEBULK") {
        GetUWSRemoveBulk();

    }
    else if (subprocess.toUpperCase() == "REWEIGING") {
        GetReWeiging();

    }


    if (subprocess.toUpperCase() != "SLICHARGES")
        InstantiateControl(cntrlid);
    $("#btnSave").unbind("click").bind("click", function () {
        // alert('Test');
        if (cfi.IsValidSection('divDetail')) {
            if (true) {
                if (SaveFormData(subprocess))
                    UWSSearch();
            }
        }
        else {
            return false
        }
    });
    $("#btnSaveToNext").unbind("click").bind("click", function () {
        debugger
        var saveflag = false;
        if (cfi.IsValidSection('divDetail')) {
            if (true) {
                saveflag = SaveFormData(subprocess);
            }
        }
        else {
            saveflag = false
        }
        if (saveflag) {
            SLISearch();
            for (var i = 0; i < processList.length; i++) {
                if (processList[i].value.toUpperCase() == currentprocess.toUpperCase() && i < (processList.length - 1)) {
                    if (currentslisno > 0) {
                        currentprocess = processList[i + 1].value;
                        subprocess = processList[i + 1].value;
                        ShowProcessDetails(currentprocess, processList[i + 1].isoneclick);
                    }
                    else {
                        CleanUI();
                        SLISearch();
                        //cfi.ShowIndexView("divShipmentDetails", "Services/Shipment/AcceptanceService.svc/GetGridData/" + _CURR_PRO_ + "/Shipment/Booking");
                    }
                    return;
                }
            }
        }
    });

}
function SaveUWSPrintDetail() {
    var tblGrid = "tblTaxSlab";
    var rows = $("tr[id^='" + tblGrid + "']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
    getUpdatedRowIndex(rows.join(","), tblGrid);
    $("#hdnFormData").val($('#tblTaxSlab').appendGrid('getStringJson'));
}
function GetUWSprint()
{
    var FlightNo = CurrentFlightNo;
    var FlightDate = CurrentFlightDate;
    var IsDGR = CurrentIsDGR;
    var UserSNo = userContext.UserSNo;
    var EquipmentNo = CurrentEquipmentNo;
    var HTMLResult = "";
    $.ajax({
        url: "HtmlFiles/ULD Print/uld.html", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result)
        {
            HTMLResult = result;
        },
        beforeSend: function (jqXHR, settings)
        {
        },
        complete: function (jqXHR, textStatus)
        {
        },
        error: function (xhr)
        {
            // var a = "";
        }
    });
    $.ajax({
        url: "Services/Shipment/UWSInfoService.svc/GetUWSULDPrint?UWSSNo=" + currentUWSSNo + "&EquipmentNo=" + EquipmentNo + "&UserSNo=" + UserSNo,
        contentType: "application/json; charset=utf-8",
        //data: JSON.stringify({ FlightNo: FlightNo, FlightDate: FlightDate, UserSNo: UserSNo }),
        async: false,
        type: 'get',
        cache: false,
        success: function (result)
        {
            var ResultData = jQuery.parseJSON(result);
            var FinalData = ResultData.Table0;
            var FinalAWBData = ResultData.Table1;
            //if (myData.Table0.length > 0) {
            //    for (var i = 0; i < myData.Table0.length; i++) {
            //        table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].ULDType + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ULDType + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ULDNumber + "</td><td class='ui-widget-content first'>" + myData.Table0[i].TareWeight + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ULDType + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ULDType + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ULDType + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ULDType + "</td></tr>";
            //    }

            //var TableData = ResultData.Table1;
            //len = TableData.length;
            ///////////////////AWB Details/////////////////

            var AWBdetailsForULDTag = "";
            var AWBData = ""
            var blankRow = "";
            AWBdetailsForULDTag = "<table style='width: 5.826in; height:7.5in; border:1px solid black;' cellspacing='0' cellpadding='0'><tr height='50px'><td style='border-left: 0px solid black; border-right:0px solid black; border-bottom:1px solid black; border-top:0px solid black; width:15%;' align='center'><b>MAWB-Nbr</b></td><td style='border-left: 1px solid black; border-right:0px solid black; border-bottom:1px solid black; border-top:0px solid black;width:8%;' align='center'><b>SHC</b></td><td style='border-left: 1px solid black; border-right:0px solid black; border-bottom:1px solid black; border-top:0px solid black;width:8%;' align='center'><b>CLASS/DIV</b></td><td style='border-left: 1px solid black; border-right:0px solid black; border-bottom:1px solid black; border-top:0px solid black;width:8%;' align='center'><b>SUBS.RISK</b></td><td style='border-left: 1px solid black; border-right:0px solid black; border-bottom:1px solid black; border-top:0px solid black;width:8%;' align='center'><b>PCS Of</b></td></tr>";
            for (var j = 0; j < FinalAWBData.length; j++) {
                AWBData = AWBData + "<tr height='40px'><td align='center'>" + FinalAWBData[j].AWBNo + "</td><td align='center'>" + FinalAWBData[j].Code + "</td><td align='center'>" + FinalAWBData[j].ClassDivSub + "</td><td align='center'>" + FinalAWBData[j].SubRisk + "</td><td align='center'>" + FinalAWBData[j].Pieces + "</td></tr>";
            }
            var blankRowCount = parseInt(15) - parseInt(FinalAWBData.length);
            for (var k = 0; k < blankRowCount; k++) {
                blankRow = blankRow + "<tr><td></td><td> </td><td> </td><td> </td><td> </td></tr>";
            }

            if (FinalAWBData.length > 0) {
                blankRow = blankRow + "<tr><td colspan='2'></td><td>Build By:-</td><td colspan='2'> " + FinalAWBData[0].buildBy + "</td></tr>";
            }
            AWBdetailsForULDTag = AWBdetailsForULDTag + AWBData + blankRow + "</table>";
            /////////////////////////////////////////////////
            $("#divULDTag").html('');
            $("#divNewDetail").html('');
            var AllResult = "<table id=tblDetails ><tr><td><button class='btn btn-primary btn-sm' style='width:125px;' id='btnPrint'>Print</button></td></tr>";
            for (var i = 0; i < ResultData.Table0.length; i++) {
                $("#divULDTag").html('');
                $("#divULDTag").html(HTMLResult);
                //$("#divULDTag").find("#spnDestination").text(ResultData.Table0[i].Destination);
                $("#divULDTag").find("#spnDestination").text(ResultData.Table0[i].Destination);
                $("#divULDTag").find("#spnNetWeight").text(ResultData.Table0[i].NetWeight);
                $("#divULDTag").find("#spnTareWeight").text(ResultData.Table0[i].EmptyWeight);
                $("#divULDTag").find("#spnTotal").text(ResultData.Table0[i].GrossWeight);
                $("#divULDTag").find("#spnloadedat").text(ResultData.Table0[i].Origin);
                $("#divULDTag").find("#spntransferat").text(ResultData.Table0[i].Destination);
                $("#divULDTag").find("#spnflightat1st").text(ResultData.Table0[i].FlightNo);
                $("#divULDTag").find("#spnAirline").text(ResultData.Table0[i].AirlineName);
                $("#divULDTag").find("#spnContents").text(ResultData.Table0[i].SHC == "" ? "" : ResultData.Table0[i].SHC.substring(0, ResultData.Table0[i].SHC.length - 1));
                $("#divULDTag").find("#spnRemark").text(ResultData.Table0[i].ULDContourCode);
                $("#divULDTag").find("#Barcode").barcode(ResultData.Table0[i].ULDNo, "code39", { barWidth: 1, barHeight: 40, fontSize: 15, moduleSize: 50 });
                $("#divULDTag").find("#spnbarcode").barcode(ResultData.Table0[i].ULDNo, "code39", { barWidth: 1, barHeight: 40, fontSize: 15, moduleSize: 50 });
                //  $(HTMLResult).find("#spnDestination").closest("table").text('santosh');
                if (IsDGR == "false") {
                    AllResult = AllResult + '<tr><td>' + $("#divULDTag").html() + '</td><td>' + AWBdetailsForULDTag + '</td></tr>';
                }
                else {
                    //AllResult = AllResult + '<td style="border: 70px solid transparent;padding: 0px;-webkit-border-image: url(./Images/DangrousGoodsFront.png) 50 stretch; -o-border-image: url(./Images/DangrousGoodsFront.png) 50 stretch; border-image: url(./Images/DangrousGoodsFront.png) 50 stretch;">' + $("#divULDTag").html() + '</td>';
                    AllResult = AllResult + '<tr><td style="background: url(./Images/DangrousGoodsFront.png) ;-webkit-print-color-adjust:exact;">' + $("#divULDTag").html() + '</td><td>' + AWBdetailsForULDTag + '</td></tr>';
                }


            }
            AllResult = AllResult + "</table>";
            $("#divNewDetail").html(AllResult);
            $("#btnPrint").bind("click", function ()
            {
                UWSPrint();
            });
            $("#divULDTag").html('');
            AllResult = "";
            AllResult += "<table border='0' cellpadding='0' cellspacing='0' style='width: 7.0in; height: 8.5in;'> <tr><td><center>"
            AllResult +=" <button class='btn btn-primary btn-sm' style='width:125px;' id='btnPrint'>Print</button>"
            AllResult += "</center>"
            AllResult += "</td>"
            AllResult += "</tr>"
            AllResult +="<tr>"

           AllResult +=  "<td>"
           AllResult += "<table border='1' cellpadding='0' cellspacing='0' style='border-collapse: collapse; width: 6.0in; height: 7.5in;'>"
           AllResult += "<tr>"
           AllResult += "<td colspan='2'>"
           AllResult += "<center>"
           AllResult += "<img id='ImgLogo' style='width:130px;height:50px' /><br/>"
           AllResult += "<span style='font-weight: bold; font-size:15pt'>CONTAINER/PALLET TAG</span>"
           AllResult += "</center>"
           AllResult += " </td>"
           AllResult += "</tr>"
                   AllResult +=" <td>"
                   AllResult +=" <center>"
                   AllResult +=  "<table border='1' cellpadding='0' cellspacing='0' style='border-collapse: collapse; width: 5.0in; height: 6.5in;'>"
                   AllResult +=   "<tr>"
            
            AllResult += "<td colspan='2'>"
            AllResult += "<span style='font-weight: bold; font-size:10pt'>ULD Serial Number :</span>   <span id='spnuldno1' style='font-weight: bold; font-size:10pt'></span>"
            AllResult += " </td>"
            AllResult += "</tr>"
            AllResult += "<tr>"

            AllResult += "<td width='50%'>"
            AllResult += "<span style='font-weight: bold; font-size:10pt'>Destination :</span> <span id='spnDestination1' style='font-weight: bold; font-size:10pt'></span>"
            AllResult += "</td>"
            AllResult += "<td width='50%'>"
            AllResult += "<span style='font-weight: bold; font-size:10pt'>Position on A/C</span>"
            AllResult += "</td>"
            AllResult += "</tr>"

            AllResult +=" <tr>"

            AllResult += "<td width='50%'>"
            AllResult += "<span style='font-weight: bold; font-size:10pt'>Flight/Date :</span><span id='spnFlightDate1' style='font-weight: bold; font-size:10pt'></span>"

            AllResult += "</td>"
            AllResult += "<td width='50%'>"
            AllResult += "<span style='font-weight: bold; font-size:10pt'> Loaded At :</span><span id='spnloadedat1' style='font-weight: bold; font-size:10pt'></span>"

            AllResult += "</td>"
            AllResult += " </tr>"
            AllResult += "<tr>"

            AllResult += "<td width='50%'>"
            AllResult += "<span style='font-weight: bold; font-size:10pt'>Contents (Circle) :</span><span style='color:black; font-size:50pt' id='spnContents1'>C</span>"


            AllResult += "</td>"
            AllResult += "<td width='50%'>"
            AllResult +=  "<table width='100%'>"
            AllResult +=  " <tr>"
            AllResult +=   " <td>"
            AllResult += "<span style='font-weight: bold; font-size:10pt'>Transfer At :</span><span id='spntransferat1' style='font-weight: bold; font-size:10pt'></span>"
            AllResult +=" </td>"
            AllResult += "</tr>"
            AllResult +=  "<tr>"
            AllResult += "<td><span style='font-weight: bold; font-size:10pt'>Flight/Date :</span> <span id='spntransferFlightDate1' style='font-weight: bold; font-size:10pt'></span></td>"
            AllResult += " </tr>"
            AllResult +=" </table>"

            AllResult += "</td>"
            AllResult += "</tr>"
            AllResult += "<tr>"

            AllResult +=" <td colspan='2'>"
            AllResult += "<table width='100%'>"
            AllResult +=  "<tr>"
            AllResult += " <td width='20%'>"
            AllResult += "<span style='font-weight: bold; font-size:10pt'>Net Weight</span>"
            AllResult +=  "</td>"
            AllResult += "<td width='1%'>:</td>"
            AllResult += "<td width='80%'><span id='spnNetWeight1' style='font-weight: bold; font-size:10pt'></span></td>"
            AllResult += "<td><span style='font-weight: bold; font-size:10pt'>Kg</span></td>"
            AllResult +=" </tr>"

            AllResult +=  "<tr>"
            AllResult +=  " <td>"
            AllResult += "<span style='font-weight: bold; font-size:10pt'>Tare Weight</span>"
            AllResult += "</td>"
            AllResult += " <td><span style='font-weight: bold; font-size:10pt'>:</span></td>"
            AllResult += "<td><span id='spnTareWeight1' style='font-weight: bold; font-size:10pt'></span></td>"
            AllResult += "<td><span style='font-weight: bold; font-size:10pt'>Kg</span></td>"
            AllResult +=" </tr>"


            AllResult += "<tr>"
            AllResult += "<td>"
            AllResult += "<span style='font-weight: bold; font-size:10pt'>Total Weight</span>"

            AllResult +=  "</td>"
            AllResult += "<td><span style='font-weight: bold; font-size:10pt'>:</span></td>"
            AllResult += "<td><span id='spnTotal1' style='font-weight: bold; font-size:10pt'></span></td>"
            AllResult += "<td><span style='font-weight: bold; font-size:10pt'>Kg</span></td>"
            AllResult += "</tr>"
            AllResult +=" <tr>"
            AllResult +=  "<td>"
            AllResult += " <span style='font-weight: bold; font-size:10pt'>Remarks</span>"
            AllResult += "</td>"
            AllResult += " <td> <span style='font-weight: bold; font-size:10pt'>:</span></td>"
            AllResult += "<td><span id='spnRemark' style='font-weight: bold; font-size:10pt'></span></td>"
            AllResult +=  "<td></td>"
            AllResult += "</tr>"
            AllResult +=" </table>"

           AllResult +=" </td>"

           AllResult +=" </tr>"
           AllResult += "<tr>"

           AllResult += "<td colspan='2'>"
           AllResult +=  "<table width='100%'>"
           AllResult += " <tr>"

           AllResult +=  "<td>"
           AllResult +=  "<span style='font-weight: bold; font-size:10pt'>PIC</span>"
           AllResult += "</td>"
           AllResult += "<td><span style='font-weight: bold; font-size:10pt'>Name</td>"
           AllResult += "<td><span style='font-weight: bold; font-size:10pt'>Signature </td>"
           AllResult += "<td><span style='font-weight: bold; font-size:10pt'>Position</td>"
           AllResult +=  "</tr>"

           AllResult += " </table>"

           AllResult += "</td>"
   AllResult +=" </tr></table></center></td></tr></table></td></tr></table>"

   $("#divNewDetail").html('');
   $("#divNewDetail").html(AllResult);
   $('#ImgLogo').attr('src', userContext.SysSetting.LogoURL);
   for (var j = 0; j < ResultData.Table0.length; j++)
   {
                $('#spnuldno1').text(ResultData.Table0[j].ULDNo);
                $('#spnDestination1').text(ResultData.Table0[j].Destination);
                $('#spnFlightDate1').text(ResultData.Table0[j].FlightDate);
                $('#spnloadedat1').text(ResultData.Table0[j].Origin);
                $("#spntransferat1").text(ResultData.Table0[j].Destination);
                $('#spntransferFlightDate1').text(ResultData.Table0[j].FlightDate);
                $("#spnNetWeight1").text(ResultData.Table0[j].NetWeight);
                $("#spnTareWeight1").text(ResultData.Table0[j].EmptyWeight);
                $("#spnTotal1").text(ResultData.Table0[j].GrossWeight);
                $("#spnRemark1").text(ResultData.Table0[j].ULDContourCode);
            }
            $("#btnPrint").bind("click", function ()
            {
                UWSPrint();
            });
        },
        error: function (err)
        {
            alert("Generated Error!");
        }
    });
}
function GetUWSEquipmentPrint()
{
    var FlightNo = CurrentFlightNo;
    var FlightDate = CurrentFlightDate;
    var IsDGR = CurrentIsDGR;
    var UserSNo = userContext.UserSNo;
    var EquipmentNo = CurrentEquipmentNo;
    var HTMLResult = "";
    $.ajax({
        url: "HtmlFiles/ULD Print/uld.html", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            HTMLResult = result;
        },
        beforeSend: function (jqXHR, settings) {
        },
        complete: function (jqXHR, textStatus) {
        },
        error: function (xhr) {
            // var a = "";
        }
    });
    $.ajax({
        url: "Services/Shipment/UWSInfoService.svc/GetUWSEquipmentPrint?UWSSNo=" + currentUWSSNo + "&EquipmentNo=" + EquipmentNo + "&IsULD=" + IsULD + "&UserSNo=" + UserSNo,
        contentType: "application/json; charset=utf-8",
        async: false,
        type: 'get',
        cache: false,
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            var FinalData = ResultData.Table0;
            var FinalAWBData = ResultData.Table1;
            $("#divULDTag").html('');
            $("#divNewDetail").html('');
            ///////////////////////ULD Tag AWB Details////////////////////////

            var AWBdetailsForULDTag = "";
            var AWBData = ""
            var blankRow = "";
            AWBdetailsForULDTag = "<table style='width: 5.826in; height:7.5in; border:1px solid black;' cellspacing='0' cellpadding='0'><tr height='50px'><td style='border-left: 0px solid black; border-right:0px solid black; border-bottom:1px solid black; border-top:0px solid black; width:15%;' align='center'><b>MAWB-Nbr</b></td><td style='border-left: 1px solid black; border-right:0px solid black; border-bottom:1px solid black; border-top:0px solid black;width:8%;' align='center'><b>SHC</b></td><td style='border-left: 1px solid black; border-right:0px solid black; border-bottom:1px solid black; border-top:0px solid black;width:8%;' align='center'><b>CLASS/DIV</b></td><td style='border-left: 1px solid black; border-right:0px solid black; border-bottom:1px solid black; border-top:0px solid black;width:8%;' align='center'><b>SUBS.RISK</b></td><td style='border-left: 1px solid black; border-right:0px solid black; border-bottom:1px solid black; border-top:0px solid black;width:8%;' align='center'><b>PCS Of</b></td></tr>";
            for (var j = 0; j < FinalAWBData.length; j++) {
                AWBData = AWBData + "<tr height='40px'><td align='center'>" + FinalAWBData[j].AWBNo + "</td><td align='center'>" + FinalAWBData[j].Code + "</td><td align='center'>" + FinalAWBData[j].ClassDivSub + "</td><td align='center'>" + FinalAWBData[j].SubRisk + "</td><td align='center'>" + FinalAWBData[j].Pieces + "</td></tr>";
            }
            var blankRowCount = parseInt(15) - parseInt(FinalAWBData.length);
            for (var k = 0; k < blankRowCount; k++) {
                blankRow = blankRow + "<tr><td></td><td> </td><td> </td><td> </td><td> </td></tr>";
            }
            if (FinalAWBData.length > 0) {
                blankRow = blankRow + "<tr><td colspan='2'></td><td>Build By:-</td><td colspan='2'> " + FinalAWBData[0].buildBy + "</td></tr>";
            }

            AWBdetailsForULDTag = AWBdetailsForULDTag + AWBData + blankRow + "</table>";
            /////////////////////////////////////////////////////////////////////
            //var AllResult = "<table id=tblDetails ><tr><td><button class='btn btn-primary btn-sm' style='width:125px;' id='btnPrint'>Print</button></td></tr>";
            ////for (var i = 0; i < ResultData.Table0.length; i++) {
            //$("#divULDTag").html('');
            //$("#divULDTag").html(HTMLResult);
            //$("#divULDTag").find("#spnDestination").text(ResultData.Table0[0].Destination);
            //$("#divULDTag").find("#spnNetWeight").text(ResultData.Table0[0].NetWeight);
            //$("#divULDTag").find("#spnTareWeight").text(ResultData.Table0[0].TareWeight);
            //$("#divULDTag").find("#spnTotal").text(ResultData.Table0[0].ScaleWeight);
            //$("#divULDTag").find("#spnloadedat").text(ResultData.Table0[0].Origin);
            //$("#divULDTag").find("#spntransferat").text(ResultData.Table0[0].Destination);
            //$("#divULDTag").find("#spnflightat1st").text(ResultData.Table0[0].FlightNo);
            //$("#divULDTag").find("#spnAirline").text(ResultData.Table0[0].AirlineName);
            //$("#divULDTag").find("#spnContents").text(ResultData.Table0[0].SHC == "" ? "" : ResultData.Table0[0].SHC.substring(0, ResultData.Table0[0].SHC.length - 1));
            //$("#divULDTag").find("#spnRemark").text(ResultData.Table0[0].ULDContourCode);
            //$("#divULDTag").find("#Barcode").barcode(CurrentEquipmentNo, "code39", { barWidth: 1, barHeight: 40, fontSize: 15, moduleSize: 50 });
            //$("#divULDTag").find("#spnbarcode").barcode(CurrentEquipmentNo, "code39", { barWidth: 1, barHeight: 40, fontSize: 15, moduleSize: 50 });
            //if (IsDGR == "false") {
            //    AllResult = AllResult + '<tr><td>' + $("#divULDTag").html() + '</td><td>' + AWBdetailsForULDTag + '</td></tr>';
            //}
            //else {
            //    AllResult = AllResult + '<tr><td style="background: url(./Images/DangrousGoodsFront.png) ;-webkit-print-color-adjust:exact;">' + $("#divULDTag").html() + '</td><td>' + AWBdetailsForULDTag + '</td></tr>';
            //}
            //// }
            //AllResult = AllResult + "</table>";
            //$("#divNewDetail").html(AllResult);
            //$("#btnPrint").bind("click", function ()
            //{

            //    UWSPrint();
            //});
            //$("#divULDTag").html('');
        },
        error: function (err) {
            alert("Generated Error!");
        }
    });
}
function GetUWSRemoveBulk() {
    var FlightNo = CurrentFlightNo;
    var FlightDate = CurrentFlightDate;
    var IsDGR = CurrentIsDGR;
    var UserSNo = userContext.UserSNo;
    var EquipmentNo = CurrentEquipmentNo;
    var UWSSNo = currentUWSSNo;
    var HTMLResult = "";

    $.ajax({
        url: "Services/Shipment/UWSInfoService.svc/GetUWSRemoveBulk?UWSSNo=" + UWSSNo + "&EquipmentNo=" + EquipmentNo + "&UserSNo=" + UserSNo,
        contentType: "application/json; charset=utf-8",
        async: false,
        type: 'get',
        cache: false,
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            var FinalData = ResultData.Table0;
            $("#divULDTag").html('');
            $("#divNewDetail").html('');
            $("#divDetailSHC").html("");
            $("#divFlightAssign").html("");
            $("#divReWeiging").html("");

            //$("#divBulkRemove").html
            HTMLResult = "<table class='WebFormTable'><tr><td class='ui-widget-header' style='text-align:center'>No<input type='hidden' name='hdnNewScaleWeightUWSSNo' id='hdnNewScaleWeightUWSSNo' value='" + currentUWSSNo + "'/><input type='hidden' name='hdnRemoveBulkEquipmentNo' id='hdnRemoveBulkEquipmentNo' value='" + EquipmentNo + "'/></td><td class='ui-widget-header' style='text-align:center'>AWB No</td><td class='ui-widget-header' style='text-align:center'>Total Pieces</td><td class='ui-widget-header' style='text-align:center'>Remove Pieces</td><td class='ui-widget-header' style='text-align:center'>Average Gross Weight</td><td class='ui-widget-header' style='text-align:right'></td></tr>"
            for (var i = 0; i < FinalData.length; i++) {
                HTMLResult = HTMLResult + "<tr><td class='formthreelabel' style='text-align:center'>" + FinalData[i].No + "</td><td class='formthreelabel' style='text-align:center'><label id='lblAWBNo" + i + "'>" + FinalData[i].AWBNo + "</label></td><td class='formthreelabel' style='text-align:center'><label id='lblPieces" + i + "'>" + FinalData[i].Pieces + "</label></td><td class='formthreelabel' style='text-align:center'><input type='text' id='txtRemovedpieces" + i + "' controltype='number' data-role='numerictextbox' style='width:70px' maxlength='5' name='txtRemovedpieces" + i + "'/></td><input type='hidden' name='SNo" + i + "' id='SNo" + i + "' value='" + FinalData[i].SNo + "'/></td><td class='formthreelabel' style='text-align:center'><label id='lblGrossWeight" + i + "' style='display:none'>" + FinalData[i].GrossWeight + "</label><label id='lblAverageGrossWeight" + i + "'></label></td><td class='formthreelabel' style='text-align:right'><input type='button' class='btn btn-block btn-success btn-sm' id='btnRemovePieces" + i + "' value='Save' onClick='SaveRemovepieces(this)'/></td></tr>";
            }
            HTMLResult = HTMLResult + "<tr><td colspan='6'></td></tr>";
            if (currentGrossWeight > 0) {
                HTMLResult = HTMLResult + "<tr><td colspan='2'></td><td class='formthreelabel' style='font-size-bold'>New Scale Weight</td><td><input type='text' id='txtNewScaleWeight' controltype='number' data-role='numerictextbox' style='width:70px' maxlength='10' name='txtNewScaleWeight'/></td><td></td></tr>";
                //<td class='formthreelabel' style='text-align:right'><input type='button' class='btn btn-block btn-success btn-sm' id='btnNewScaleWeight' value='Save Scale Weight' onClick='SaveNewScaleWeight(1)'/></td>
            }

            HTMLResult = HTMLResult + "</table>"
            $("#divBulkRemove").html(HTMLResult);
            //$('[id^=txtNewScaleWeight]').bind("blur", function () {
            //    ISNumeric(this.value);
            //});
            $('[id^=txtNewScaleWeight]').bind("keydown", function () {
                if (event.shiftKey == true) {
                    event.preventDefault();
                }
                if (!((event.keyCode >= 48 && event.keyCode <= 57)) && !((event.keyCode >= 96 && event.keyCode <= 105)) && !(event.keyCode == 8) && !(event.keyCode == 37) && !(event.keyCode == 46) && !(event.keyCode == 190) && !(event.keyCode == 110)) {
                    //not a number key or period so prevent
                    event.preventDefault();
                }
            });

            $('[id^=txtRemovedpieces]').bind("keydown", function () {
                if (event.shiftKey == true) {
                    event.preventDefault();
                }
                if (!((event.keyCode >= 48 && event.keyCode <= 57)) && !((event.keyCode >= 96 && event.keyCode <= 105)) && !(event.keyCode == 8) && !(event.keyCode == 37) && !(event.keyCode == 46)) {
                    //not a number key or period so prevent
                    event.preventDefault();
                }
            }).keyup(function () {
                var Pieces = parseInt($("#" + this.id).val() == "" ? 0 : $("#" + this.id).val());
                var posi = this.id.charAt((this.id.length) - 1);
                var Totalpieces = parseInt($("#lblPieces" + posi).text());
                var totalGrossWeight = parseFloat($("#lblGrossWeight" + posi).text());
                var AverageGrossWeight = parseFloat(totalGrossWeight / Totalpieces * Pieces);
                $("#lblAverageGrossWeight" + posi).text(AverageGrossWeight.toFixed(2));
                if (Pieces > Totalpieces) {
                    $("#" + this.id).val('');
                }
            });
            //cfi.AutoComplete("ULDType", "ULDName", "ULD", "SNo", "ULDName", ["ULDName"], null, "contains");
            // cfi.AutoComplete("FlightNo", "FlightNo", "v_DailyFlight", "SNo", "FlightNo", ["FlightNo"], null, "contains");

            cfi.PopUp("divBulkRemove", "Remove Pieces", 800);
            $("#FlightDate").kendoDatePicker();
        },
        error: function (err) {
            alert("Generated Error!");
        }
    });
}
function GetReWeiging() {
    var UserSNo = userContext.UserSNo;
    var HTMLResult = "";
    $("#divBulkRemove").html("");
    HTMLResult = "<table class='WebFormTable'><tr><td>New Scale Weight</td><td class='formthreeInputcolumn'><input type='hidden' name='hdnNewScaleWeightUWSSNo' id='hdnNewScaleWeightUWSSNo' value='" + currentUWSSNo + "'/> <input type='hidden' name='hdnReWeighingEquipmentNo' id='hdnReWeighingEquipmentNo' value='" + CurrentEquipmentNo + "'/><input type='text'  name='txtNewScaleWeight' id='txtNewScaleWeight' tabindex='1' controltype='autocomplete' maxlength='10' /></td><td class='formthreeInputcolumn'><input type='button' tabindex='2' class='btn btn-block btn-success btn-sm' name='btnNewScaleWeight' id='btnNewScaleWeight' style='width:90px;' value='Save' onclick='SaveNewScaleWeight(2);'></td></tr></table>"

    $("#divReWeiging").html(HTMLResult);

    cfi.PopUp("divReWeiging", "Re-Weigh", 500);
    $("input[id='txtNewScaleWeight']").keydown(function (event) {
        //prevent using shift with numbers
        if (event.shiftKey == true) {
            event.preventDefault();
        }
        if (!((event.keyCode >= 48 && event.keyCode <= 57)) && !((event.keyCode >= 96 && event.keyCode <= 105)) && !(event.keyCode == 8) && !(event.keyCode == 37) && !(event.keyCode == 46) && !(event.keyCode == 110) && !(event.keyCode == 190)) {
            //not a number key or period so prevent
            event.preventDefault();
        }

    });
    //$('[id^=txtRemovedpieces]').bind("blur", function () {
    //    // var P = $("txtRemovedpieces").find("tdPieces").text();

    //    ISNumeric(this);
    //    var Pieces = parseInt($("#" + this.id).val());
    //    var posi = this.id.charAt((this.id.length) - 1);
    //    var Totalpieces = parseInt($("#lblPieces" + posi).text());
    //    if (Pieces > Totalpieces) {
    //        $("#" + this.id).val('');
    //    }

    //});
    //cfi.AutoComplete("ULDType", "ULDName", "ULD", "SNo", "ULDName", ["ULDName"], null, "contains");
    // cfi.AutoComplete("FlightNo", "FlightNo", "v_DailyFlight", "SNo", "FlightNo", ["FlightNo"], null, "contains");

}
function SaveRemovepieces(obj) {
    var posi = obj.id.charAt((obj.id.length) - 1);
    var Pieces = parseInt($("#txtRemovedpieces" + posi).val() == "" ? 0 : $("#txtRemovedpieces" + posi).val());
    var Totalpieces = parseInt($("#lblPieces" + posi).text());
    var GrossWeight = parseInt($("#lblGrossWeight" + posi).text());
    var RemainGrossWeight = (GrossWeight / Totalpieces) * (Totalpieces - Pieces);
    var AWBNo = $("#lblAWBNo" + posi).text();
    ////////////////////////////////////Save with New Scale Weight//////////////

    var NewScaleWeight = $("#txtNewScaleWeight").val();

    /////////////////////////////////////
    if (Pieces > Totalpieces) {
        ShowMessage('warning', 'Warning - UWS', "Please enter correct pieces.", "bottom-right");
    }
    else if (Pieces == 0) {
        ShowMessage('warning', 'Warning - UWS', "Please enter pieces.", "bottom-right");
    }
        //else if (NewScaleWeight == "" || parseFloat(NewScaleWeight) <= parseFloat(CurrentTareWeight)) {
        //    ShowMessage('warning', 'Warning - UWS', "Please enter New Scale Weight and Scale Weight should be greater than Tare Weight.", "bottom-right");
        //}
    else if (Pieces > 0) {
        var SNo = $("#SNo" + posi).val();
        //if (NewScaleWeight==undefined) {
        //    NewScaleWeight = 0;
        //}
        if (NewScaleWeight != undefined && NewScaleWeight == "") {
            ShowMessage('warning', 'Warning - UWS', "Please enter New Scale Weight.", "bottom-right");
        }
        else if (parseFloat(NewScaleWeight) <= parseFloat(CurrentTareWeight) && NewScaleWeight != undefined) {
            ShowMessage('warning', 'Warning - UWS', "Scale Weight should be greater than Tare Weight.", "bottom-right");
        }
        else {
            if (NewScaleWeight == undefined) {
                NewScaleWeight = 0;
            }
            $.ajax({
                url: "Services/Shipment/UWSInfoService.svc/SaveRemovepieces", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ SNo: SNo, AWBNo: AWBNo, Removepieces: Pieces, Totalpieces: Totalpieces, NewScaleWeight: NewScaleWeight }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result == "1") {
                        ShowMessage('warning', 'Warning - UWS', "Please enter correct pieces.", "bottom-right");
                    }
                    else if (result == "2") {
                        ShowMessage('success', 'Success -UWS', "" + AWBNo + " deleted successfully.", "bottom-right");
                    }
                    else if (result == "3") {
                        $("#lblPieces" + posi).text(Totalpieces - Pieces);
                        $("#lblGrossWeight" + posi).text(RemainGrossWeight.toFixed(2));
                        ShowMessage('success', 'Success -UWS', "Pieces removed successfully for Waybill No.- " + AWBNo, "bottom-right");
                    }
                    $("#btnRemovePieces" + posi).css("display", "none");
                    cfi.ShowIndexView("divDetail", "Services/Shipment/UWSInfoService.svc/GetUWSGridData/" + _CURR_PRO_ + "/UWS/Booking/0/0/0/0/1222", "Scripts/maketrans.js?" + Math.random());
                    $("#divBulkRemove").data("kendoWindow").close();
                },
                error: function (xhr) {
                    ShowMessage('warning', 'Warning - UWS', "unable to process.", "bottom-right");
                }
            });
        }
        //$("#divBulkRemove").data("kendoWindow").close();
    }
    else {
        ShowMessage('warning', 'Warning - UWS', "unable to process.", "bottom-right");
    }
}
function SaveNewScaleWeight(obj) {
    var NewScaleWeight = 0;
    var UWSSNo = 0;
    if (obj == "1") {
        NewScaleWeight = $("#divBulkRemove #txtNewScaleWeight").val();
        UWSSNo = $("#divBulkRemove #hdnNewScaleWeightUWSSNo").val();
    }
    else {
        NewScaleWeight = $("#divReWeiging #txtNewScaleWeight").val();
        UWSSNo = $("#divReWeiging #hdnNewScaleWeightUWSSNo").val();
    }
    //var UWSSNo = $("#hdnUWSSNo").val();
    // var EquipmentNo = $("#hdnRemoveBulkEquipmentNo").val();
    if (parseFloat(NewScaleWeight) <= parseFloat(CurrentTareWeight)) {
        ShowMessage('info', 'Need your Kind Attention!', "Scale Weight should be greater than Tare Weight.", "bottom-left");
        return false;
    }
    else {
        $.ajax({
            url: "Services/Shipment/UWSInfoService.svc/SaveNewScaleWeight", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ UWSSNo: UWSSNo, EquipmentNo: CurrentEquipmentNo, NewScaleWeight: NewScaleWeight }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "1") {
                    cfi.ShowIndexView("divDetail", "Services/Shipment/UWSInfoService.svc/GetUWSGridData/" + _CURR_PRO_ + "/UWS/Booking/0/0/0/0/1222", "Scripts/maketrans.js?" + Math.random());
                    if (obj == "1") {
                        $("#divBulkRemove").data("kendoWindow").close();
                    }
                    else {

                        $("#divReWeiging").data("kendoWindow").close();
                    }
                    ShowMessage('success', 'Success - UWS', "Scale Weight is changed for Equipment No.-" + CurrentEquipmentNo, "bottom-right");
                }
                else {
                    ShowMessage('warning', 'Warning - UWS', "unable to process.", "bottom-right");
                }

            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - UWS', "unable to process.", "bottom-right");
            }
        });
    }

}
function UWSPrint()
{
    $("#btnPrint").css('display', 'none');
    $("#divNewDetail").printArea();
}
function getParameterByName(name, url)
{
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function SaveUWSPrintDetail()
{
    var tblGrid = "tblTaxSlab";
    var rows = $("tr[id^='" + tblGrid + "']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
    getUpdatedRowIndex(rows.join(","), tblGrid);
    $("#hdnFormData").val($('#tblTaxSlab').appendGrid('getStringJson'));
}
function OnScaleWeightChange() {
    if ($("#ScaleWeight").val() != "" && $("#EquipmentNo").val() != "") {

        var tareWeight = parseFloat($("#lbltareweight").html() || "0");
        var ScaleWeight = parseFloat($("#ScaleWeight").val());

        //var TotalShipmentWeight = parseFloat($("#hdnTotalWeight").val());
        //var TotalWeight = parseFloat(TotalShipmentWeight) + parseFloat(tareWeight);
        //var NetWeight = parseFloat(TotalWeight) - parseFloat(tareWeight);
        var NetWeight = parseFloat(ScaleWeight) - parseFloat(tareWeight);
        // $("#lblNetweight").html(NetWeight);
        //if (tareWeight==0) {
        //    ShowMessage('info', 'Need your Kind Attention!', "Click Fetch Detail Button to Scale Weight.", "bottom-left");
        //    $("#ScaleWeight").val('');
        //}
        if (tareWeight >= ScaleWeight) {
            ShowMessage('info', 'Need your Kind Attention!', "Scale Weight should be greater than Tare Weight.", "bottom-left");
            $("#ScaleWeight").val('');
        }
        else {
            $("label[name='lblNetweight']").html(NetWeight);
        }

    }
    else {
        $("label[name='lblNetweight']").html('');
        $("#ScaleWeight").val('');
    }
}

////Santosh Gupta FetchDetail
function FetchDetail() {

    //if ($("#LoadType").val() == "") {
    //    ShowMessage('warning', 'Warning - UWS', "Please select Load type First", "bottom-right");
    //    $("#LoadType").val('');
    //    return false;
    //}

    // else {
    var FlightSNo = $("#searchFlightNo").val() == "" ? 0 : $("#searchFlightNo").val();
    var ProcessSNo = $("#searchProcess").val() == "" ? 0 : $("#searchProcess").val();
    var EquiLen = $('#EquipmentNo').val().split('-').length;
    var ValidFlag = false;
    //var LoadType = $('#LoadType').val();
    var SpecialRights = userContext.SpecialRights.UWS == true ? 1 : 0;
    if (EquiLen != 3) {
        ShowMessage('warning', 'Warning - UWS', "Invalid Equipment No", "bottom-right");
        $('#EquipmentNo').val('');
        ValidFlag = true;
    }
    else {
        $.ajax({
            url: "Services/Shipment/UWSInfoService.svc/GetEquipmentExist?EquipmentNo=" + $("#EquipmentNo").val().toUpperCase() + "&FlightSNo=" + FlightSNo + "&ProcessSNo=" + ProcessSNo + "&SpecialRights=" + SpecialRights, async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var data = jQuery.parseJSON(result);
                // var data = result.split(',');
                $("#ScaleWeight").val('');
                $("#_tempScaleWeight").val('');

                if (data.Table0[0].EquipmentSNo == 0) {
                    ValidFlag = true;
                    //  ShowMessage('warning', 'Warning - UWS', "Planned cargo on this equipment has already departed. Cannot proceed with Weighing process.", "bottom-right");
                    if (data.Table0[0].AssignEquipment == 1)
                        ShowMessage('warning', 'Warning - UWS', "Scale weight already captured for Equipment " + $("#EquipmentNo").val().toUpperCase() + ". Kindly use Re-Weigh Option to capture new Scale Weight.", "bottom-right");
                    else
                        ShowMessage('warning', 'Warning - UWS', "Invalid or Already utilized equipment. Please use another equipment.", "bottom-right");
                    $('#EquipmentNo').val('');
                    $("#divDetailSHC").html("");
                }
                else if (data.Table0[0].AssignEquipment == 1) {

                    var theDiv = document.getElementById("divDetailSHC");
                    theDiv.innerHTML = "";
                    var table = "<table class='appendGrid ui-widget' id='tblULDBreakdownAction'><thead class='ui-widget-header' style='text-align:center'><tr><td>BTR No :-&nbsp;&nbsp;<label id='lblBTRNo'>" + $('#EquipmentNo').val().toUpperCase() + "</label><input name='hdnEquipmentSNo' id='hdnEquipmentSNo' type='hidden' value=" + data.Table0[0].EquipmentSNo + "><input name='hdnUWSSNo' id='hdnUWSSNo' type='hidden' value=" + data.Table0[0].UWSSNo + "><input name='hdnAssignEquipment' id='hdnAssignEquipment' type='hidden' value=" + data.Table0[0].AssignEquipment + "><input name='hdnTotalWeight' id='hdnTotalWeight' type='hidden' value=" + data.Table0[0].TotalWeight + "><td class='ui-widget-header'>Tare Weight :-&nbsp;&nbsp;<label id='lbltareweight'>" + data.Table0[0].TareWeight + "</label></td><td class='ui-widget-header'>Net Weight :-&nbsp;&nbsp;<label id='lblNetweight' name='lblNetweight'></label></td><td class='ui-widget-header'>Total Air Waybills:-&nbsp;&nbsp;<label id='lblTotalWeight'>0</label></td></tr></thead></table>";
                    theDiv.innerHTML += table;
                }
                else if (data.Table0[0].AssignEquipment == 2) {
                    $('span#SHC').html(data.Table0[0].SHC.substring(0, data.Table0[0].SHC.length - 1));
                    if (data.Table0[0].TypeofShipment == "False") {
                        //////////////for ULD
                        var tbl = "";
                        // var theDiv = document.getElementById("divDetailSHC");
                        tbl += "<table width='100%'><thead  style='text-align:center'><tr class='ui-widget-header'><td>PDY No.</td><td>Tare Weight </td><td>Net Weight </td><td>ULD No.</td></tr>";
                        var shipment = data.Table0[0].Shipment.split(',');
                        for (var i = 0; i < data.Table0[0].totalpieces; i++) {
                            tbl += "<tr><td style='text-align:center'><label id='lblBTRNo'>" + $('#EquipmentNo').val().toUpperCase() + "</label><input name='hdnEquipmentSNo' id='hdnEquipmentSNo' type='hidden' value=" + data.Table0[0].EquipmentSNo + "><input name='hdnUWSSNo' id='hdnUWSSNo' type='hidden' value=" + data.Table0[0].UWSSNo + "><input name='hdnAssignEquipment' id='hdnAssignEquipment' type='hidden' value=" + data.Table0[0].AssignEquipment + "><input name='hdnTotalWeight' id='hdnTotalWeight' type='hidden' value=" + data.Table0[0].TotalWeight + "></td><td style='text-align:center'><label id='lbltareweight'>" + data.Table0[0].TareWeight + "</label></td><td><label id='lblNetweight' name='lblNetweight'>0</label></td><td style='text-align:center'><a href='#' onClick='showShipment(" + data.Table0[0].EquipmentSNo + "," + data.Table0[0].UWSSNo + ",this,0); return false;'>" + shipment[i] + "</a></td></tr>";

                        }
                        tbl += "</thead></table>"
                        $("#divDetailSHC").html(tbl);
                    }
                    else if (data.Table0[0].TypeofShipment == "True") {
                        //////////////for Waybills

                        var tbl = "";
                        tbl += "<table width='100%'><thead  style='text-align:center'><tr class='ui-widget-header'><td>BTR No.</td><td>Tare Weight </td><td>Net Weight </td><td>Total Air Waybills</td></tr>";
                        var shipment = data.Table0[0].Shipment.split(',');
                        tbl += "<tr><td style='text-align:center'><label id='lblBTRNo'>" + $('#EquipmentNo').val().toUpperCase() + "</label><input name='hdnEquipmentSNo' id='hdnEquipmentSNo' type='hidden' value=" + data.Table0[0].EquipmentSNo + "><input name='hdnUWSSNo' id='hdnUWSSNo' type='hidden' value=" + data.Table0[0].UWSSNo + "><input name='hdnAssignEquipment' id='hdnAssignEquipment' type='hidden' value=" + data.Table0[0].AssignEquipment + "><input name='hdnTotalWeight' id='hdnTotalWeight' type='hidden' value=" + data.Table0[0].TotalWeight + "></td><td style='text-align:center'><label id='lbltareweight'>" + data.Table0[0].TareWeight + "</label></td><td><label id='lblNetweight' name='lblNetweight'>0</label></td><td style='text-align:center'><a href='#' onClick='showShipment(" + data.Table0[0].EquipmentSNo + "," + data.Table0[0].UWSSNo + ",this,1)'>" + data.Table0[0].totalpieces + "</a></td></tr>";


                        tbl += "</thead></table>"
                        $("#divDetailSHC").html(tbl);
                        //var theDiv = document.getElementById("divDetailSHC");
                        //theDiv.innerHTML = "";
                        //var table = "</br><table class='appendGrid ui-widget' id='tblULDBreakdownAction'><thead class='ui-widget-header' style='text-align:center'><tr><td>BTR No :-&nbsp;&nbsp;<label id='lblBTRNo'>" + $('#EquipmentNo').val().toUpperCase() + "</label><input name='hdnEquipmentNo' id='hdnEquipmentNo' type='hidden' value=" + data.Table0[0].EquipmentSNo + "><td class='ui-widget-header'>Tare Weight :-&nbsp;&nbsp;<label id='lbltareweight'>" + data.Table0[0].TareWeight + "</label></td><td class='ui-widget-header'>Net Weight :-&nbsp;&nbsp;<label id='lblNetweight'></label></td><td class='ui-widget-header'>TotalWaybills:-&nbsp;&nbsp;<label id='lblTotalWaybills'>" + data.Table0[0].totalpieces + "</label></td></tr></thead></table>";
                        //theDiv.innerHTML += table;
                    }

                }
            },
            error: {

            }
        });
    }


    // }

}
function SetManualWeight() {
    $("#IsManual").val(1);
}
function GetFetchWeight() {

    $("#IsManual").val(0);
}
function SaveFormData(subprocess) {
    var issave = false;
    var MSGHeader = subprocess == "SLICUSTOMER" ? "CUSTOMER" : subprocess == "SLIDIMENSION" ? "DIMENSION" : subprocess == "SLIAWB" ? "AWB Information" : subprocess == "SLICHARGES" ? "CHARGES" : "";
    if (!IsProcessed) {
        if (!IsFinalSLI) {
            if (subprocess.toUpperCase() == "SLICUSTOMER") {
                issave = SaveCustomerInfo();
            }
            else if (subprocess.toUpperCase() == "SLIDIMENSION") {
                issave = SaveDimensionInfo();
            }
            else if (subprocess.toUpperCase() == "UWSAWB") {
                if (cfi.IsValidSection("divNewDetail")) {
                    issave = SaveUWSAWBInfo();
                    //if (issave == true) {
                    //    UWSInfoList();
                    //}
                }

            }
            else if (subprocess.toUpperCase() == "SLICHARGES") {
                issave = SaveSLIChargeHeader();
            }
            else if (subprocess.toUpperCase() == "SLIUNLOADING") {
                issave = SaveSLIUnloading();
            }
        }
        else {

            ShowMessage('warning', 'Warning - ' + MSGHeader + '', "SLI already Finalized, cannot be Amend", "bottom-right");
            issave = false;
        }
    }
    else {
        ShowMessage('warning', 'Warning - ' + MSGHeader + '', "SLI already Processed.", "bottom-right");
        issave = false;
    }
    //$("#btnSave").unbind("click").bind("click", function () {
    //    //  alert('Test');
    //    if (cfi.IsValidSection('divDetail')) {
    //        if (true) {
    //            if (SaveFormData(subprocess))
    //                SLISearch();
    //        }
    //    }
    //    else {
    //        return false
    //    }
    //});
    return issave;
}

//Save UWS Info
function SaveUWSAWBInfo() {
    var flag = false;
    var sliSNo = (currentslisno == "" ? 0 : currentslisno);
    var awbNo = $("#AWBNo").val();
    var ShipmentInfo = $("#divNewDetail").serializeToJSON();
    var AirlineSNo = $("#Text_searchAirline").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_searchAirline").data("kendoAutoComplete").key();
    var searchProcessSNo = $("#Text_searchProcess").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_searchProcess").data("kendoAutoComplete").key();
    var searchFlightSNo = $("#Text_searchFlightNo").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_searchFlightNo").data("kendoAutoComplete").key();
    var FlightDate = "0";
    if ($("#searchFlightDate").val() != "") {
        FlightDate = cfi.CfiDate("searchFlightDate") == "" ? "0" : cfi.CfiDate("searchFlightDate");// "";//month + "-" + day + "-" + year;
    }
    var ValidSLIPart = true;
    var EquipmentSNo = $("#hdnEquipmentSNo").val();
    var EquipmentNo = $("#EquipmentNo").val();
    var AssignEquipment = $("#hdnAssignEquipment").val();
    var hdnUWSSNo = $("#hdnUWSSNo").val();
    if (AssignEquipment == 2) {
        searchFlightSNo = 0;
        searchProcessSNo = 0;
    }
    //added for export without cargo by Anmol Sharma
    if (AssignEquipment == 1 && searchProcessSNo == "2") {

        ValidSLIPart = false;
        ShowMessage('warning', 'Warning - UWS', "Scale weight cannot be captured for Empty Equipment", "bottom-right");
        return false;
    }
    if (AssignEquipment == 1) {
        if (AirlineSNo == "0" || searchProcessSNo == "0" || searchFlightSNo == "0" || FlightDate == "0" || EquipmentSNo == undefined) {
            ValidSLIPart = false;
            ShowMessage('warning', 'Warning - UWS', "Airline,Flight Date,Flight No,Process are mandatory", "bottom-right");
            return false;

        }

    }
    //else {
    //    if ((($("#AWBPrefix").val().toUpperCase() == 'SLI') && ($('#HAWBNo').val() != '')) || ($("#AWBPrefix").val() == '') || ($("#AWBNo").val() == ''))
    //        ValidSLIPart = false;
    //}


    if (ValidSLIPart == true && EquipmentSNo != undefined) {
        //if (!GetSLIAWBExist()) {
        $.ajax({
            url: "Services/Shipment/UWSInfoService.svc/SaveUWSInfo", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ FlightSNo: searchFlightSNo, ProcessSNo: searchProcessSNo, AirlineSNo: AirlineSNo, FlightDate: FlightDate, EquipmentSNo: EquipmentSNo, UWSSNo: hdnUWSSNo, EquipmentNo: EquipmentNo, ShipmentInformation: ShipmentInfo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var resultStatus = result.split('?')[0];
                var resultVal = result.split('?')[1];
                if (resultStatus == "1") {
                    //CleanUI();
                    //  cfi.ShowIndexView("divShipmentDetails", "Services/Shipment/AcceptanceService.svc/GetGridData/" + _CURR_PRO_ + "/SLI/Booking");
                    //  cfi.ShowIndexView("divShipmentDetails", "Services/Shipment/SLInfoService.svc/GetSLIGridData/" + _CURR_PRO_ + "/SLI/Booking/" + AWBPrefix + "/" + AWBNo + "/" + LoggedInCity, "Scripts/maketrans.js?" + Math.random());
                    cfi.ShowIndexView("divDetail", "Services/Shipment/UWSInfoService.svc/GetUWSGridData/" + _CURR_PRO_ + "/UWS/Booking/0/0/0/0/1222", "Scripts/maketrans.js?" + Math.random());

                    ShowMessage('success', 'Success -UWS', "Equipment No " + $('#EquipmentNo').val().toUpperCase() + " Processed Successfully", "bottom-right");
                    $("#btnSave").unbind("click");
                    //if(currentslisno==0)
                    //    funGetNewForm();
                    //$('#divDetail').html('');
                    $("#divNewDetail").html('');
                    $("#divDetailSHC").html('');
                    //OnSuccessGrid();



                    flag = true;
                }

                else
                    ShowMessage('warning', 'Warning - UWS', "unable to process.", "bottom-right");
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - UWS', "unable to process.", "bottom-right");

            }
        });

        // }
    }
    else {
        ShowMessage('warning', 'Warning - UWS', "Click Fetch Detail to verify data before Save.", "bottom-right");
        flag = false;
    }

    return flag;
}
function SaveAssignFlight() {

    var FlightDate = $("#FlightDate").val();
    var FlightSNo = $("#FlightNo").val() == "" ? 0 : $("#FlightNo").val();
    if (FlightDate == "" || FlightSNo == 0) {
        ShowMessage('warning', 'Warning - UWS', "Flight Date & Flight No is mandatory", "bottom-right");
        return false;
    }
    else {
        $.ajax({
            url: "Services/Shipment/UWSInfoService.svc/SaveAssignFlight", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ FlightSNo: FlightSNo, EquipmentNo: CurrentEquipmentNo, UWSSNo: currentUWSSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "1") {
                    cfi.ShowIndexView("divDetail", "Services/Shipment/UWSInfoService.svc/GetUWSGridData/" + _CURR_PRO_ + "/UWS/Booking/0/0/0/0/1222", "Scripts/maketrans.js?" + Math.random());
                    ShowMessage('success', 'Success -UWS', " Flight Assigned successfully for Equipment No.- " + CurrentEquipmentNo, "bottom-right");
                }
                else if (result == "2") {
                    cfi.ShowIndexView("divDetail", "Services/Shipment/UWSInfoService.svc/GetUWSGridData/" + _CURR_PRO_ + "/UWS/Booking/0/0/0/0/1222", "Scripts/maketrans.js?" + Math.random());
                    ShowMessage('success', 'Success -UWS', " Flight Unassigned successfully for Equipment No.- " + CurrentEquipmentNo, "bottom-right");
                }
                else if (result == "3") {
                    cfi.ShowIndexView("divDetail", "Services/Shipment/UWSInfoService.svc/GetUWSGridData/" + _CURR_PRO_ + "/UWS/Booking/0/0/0/0/1222", "Scripts/maketrans.js?" + Math.random());
                    ShowMessage('success', 'Success -UWS', " Flight can not be Unassigned for Equipment No.- " + CurrentEquipmentNo, "bottom-right");
                }
                else
                    ShowMessage('warning', 'Warning - UWS', "unable to process.", "bottom-right");
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - UWS', "unable to process.", "bottom-right");

            }
        });
        $("#divFlightAssign").data("kendoWindow").close();
    }
}
function SaveUnAssignFlight() {
    $.ajax({
        url: "Services/Shipment/UWSInfoService.svc/SaveAssignFlight", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ FlightSNo: 0, EquipmentNo: CurrentEquipmentNo, UWSSNo: currentUWSSNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "1") {
                cfi.ShowIndexView("divDetail", "Services/Shipment/UWSInfoService.svc/GetUWSGridData/" + _CURR_PRO_ + "/UWS/Booking/0/0/0/0/1222", "Scripts/maketrans.js?" + Math.random());
                ShowMessage('success', 'Success -UWS', " Flight Assigned successfully for Equipment No.- " + CurrentEquipmentNo, "bottom-right");
            }
            else if (result == "2") {
                cfi.ShowIndexView("divDetail", "Services/Shipment/UWSInfoService.svc/GetUWSGridData/" + _CURR_PRO_ + "/UWS/Booking/0/0/0/0/1222", "Scripts/maketrans.js?" + Math.random());
                ShowMessage('success', 'Success -UWS', " Flight Unassigned successfully for Equipment No.- " + CurrentEquipmentNo, "bottom-right");
            }
            else if (result == "3") {
                cfi.ShowIndexView("divDetail", "Services/Shipment/UWSInfoService.svc/GetUWSGridData/" + _CURR_PRO_ + "/UWS/Booking/0/0/0/0/1222", "Scripts/maketrans.js?" + Math.random());
                ShowMessage('success', 'Success -UWS', " Flight can not be Unassigned for Equipment No.- " + CurrentEquipmentNo, "bottom-right");
            }
            else
                ShowMessage('warning', 'Warning - UWS', "unable to process.", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - UWS', "unable to process.", "bottom-right");

        }
    });
    $("#divFlightAssign").data("kendoWindow").close();
}

////////////////////////////New changes for Unassign Flight ////////////


function SaveUnAssignFlightNReleaseEquipment() {
    var DataLen = $('#tblDatalist tr').length;
    var ShipmentData = [];
    for (var i = 0; i < DataLen; i++) {
        var AWBSNo = $("#hdnAWBSNo" + i).val();
        var Location = $("#Location" + i).val();
        var AWBPieces = $("#hdnAWBPieces" + i).val();

        if (!(AWBSNo > 0 && Location > 0)) {
            IsEnterScaleWeight = 0;
        }

        ShipmentData.push({
            "AWBSNo": AWBSNo,
            "LocationSNo": Location,
            "AWBPieces": AWBPieces
        });
    }
    var NewEquipmentSNo = $("#UnAssignEquipmentNo").val() == "" ? 0 : $("#UnAssignEquipmentNo").val();
    var ShipemntTypeforFlightUnAssign = $("#ShipemntTypeforFlightUnAssign").val();
    $.ajax({
        url: "Services/Shipment/UWSInfoService.svc/SaveUnAssignFlightNReleaseEquipment", async: true, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ Data: ShipmentData, OldEquipmentNo: CurrentEquipmentNo, NewEquipmentSNo: NewEquipmentSNo, UWSSNo: currentUWSSNo, ShipmentType: ShipemntTypeforFlightUnAssign }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var MsgTable = jQuery.parseJSON(result);
            var MsgData = MsgTable.Table0;
            if (MsgData[0].Message == "Done") {

                $("#divFlightUnAssign").data("kendoWindow").close();
                $("#divFlightAssign").data("kendoWindow").close();
                $("div").remove(".k-overlay");
                cfi.ShowIndexView("divDetail", "Services/Shipment/UWSInfoService.svc/GetUWSGridData/" + _CURR_PRO_ + "/UWS/Booking/0/0/0/0/1222", "Scripts/maketrans.js?" + Math.random());
                ShowMessage('success', 'Success!', "Flight Unassigned successfully for Equipment No.- " + CurrentEquipmentNo);

            }
            else {
                ShowMessage('warning', 'Warning!', MsgData[0].Message);
            }

        }
    });

}
function GetUnAssignFlightNReleaseEquipment() {
    var UserSNo = userContext.UserSNo;
    $.ajax({
        url: "Services/Shipment/UWSInfoService.svc/GetUnAssignFlightNReleaseEquipment?UWSSNo=" + currentUWSSNo + "&EquipmentNo=" + CurrentEquipmentNo + "&UserSNo=" + UserSNo,
        contentType: "application/json; charset=utf-8",
        async: false,
        type: 'get',
        cache: false,
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            var FinalData = ResultData.Table0;
            var ShipmentType = FinalData[0].IsBulk == 1 ? "AWB No.:" : "ULD No.:";
            var HTMLResult = "<table class='WebFormTable' id='tblDatalist'  border=\"0\" cellpadding='0' cellspacing='0' align=\"center\">";
            for (var i = 0; i < FinalData.length; i++) {
                HTMLResult = HTMLResult + "<tr><td style='height:30px;text-align:right;font-size:12px; font-family: Verdana'>" + ShipmentType + "</td><td class='formthreeInputcolumn'>" + FinalData[i].AWBNo + "<input type='hidden' name='hdnAWBSNo" + i + "' id='hdnAWBSNo" + i + "' value='" + FinalData[i].AWBSNo + "'/> </td><td style='height:30px;text-align:right;font-size:12px; font-family: Verdana'>Pieces :</td><td class='formthreeInputcolumn'>" + FinalData[i].AWBPieces + "<input type='hidden' name='hdnAWBPieces" + i + "' id='hdnAWBPieces" + i + "' value='" + FinalData[i].AWBPieces + "'/><td style='height:30px;text-align:right;font-size:12px; font-family: Verdana'>Location :</td><td class='formthreeInputcolumn'><input type='hidden' name='Location" + i + "' id='Location" + i + "'/> <input type='text'  name='Text_Location" + i + "' id='Text_Location" + i + "' tabindex='2' controltype='autocomplete' maxlength='10' /></td></tr>";
            }
            HTMLResult = HTMLResult + "</table><table class='WebFormTable' id='tblSave'  border=\"0\" cellpadding='0' cellspacing='0' align=\"center\"><tr><td style='height:30px;text-align:right;font-size:12px; font-family: Verdana'>New Equipment No:</td><td class='formthreeInputcolumn'><input type='hidden' name='UnAssignEquipmentNo' id='UnAssignEquipmentNo' value=''/><input type='hidden' name='ShipemntTypeforFlightUnAssign' id='ShipemntTypeforFlightUnAssign' value='" + FinalData[0].IsBulk + "'/> <input type='text'  name='Text_UnAssignEquipmentNo' id='Text_UnAssignEquipmentNo' tabindex='2' controltype='autocomplete' maxlength='20' /></td><td><input type='button' tabindex='3' class='btn btn-block btn-success btn-sm' name='btnSaveFlight' id='btnSaveFlight' style='width:90px;' value='Save' onclick='SaveUnAssignFlightNReleaseEquipment();'></td></tr></table>";
            //HTMLResult = "<tr><td class='formthreelabel'>Location</td><td class='formthreeInputcolumn'><input type='hidden' name='Location' id='Location' value=''/> <input type='text'  name='Text_Location' id='Text_Location' tabindex='2' controltype='autocomplete' maxlength='10' /></td><td class='formthreeInputcolumn'></td><td class='formthreelabel'>New Equipment ID</td><td class='formthreeInputcolumn'><input type='hidden' name='UnAssignEquipmentNo' id='UnAssignEquipmentNo' value=''/> <input type='text'  name='Text_UnAssignEquipmentNo' id='Text_UnAssignEquipmentNo' tabindex='2' controltype='autocomplete' maxlength='20' /></td><td class='formthreeInputcolumn'><input type='button' tabindex='3' class='btn btn-block btn-success btn-sm' name='btnSaveFlight' id='btnSaveFlight' style='width:90px;' value='Save' onclick='SaveUnAssignFlightNReleaseEquipment();'></td></tr><tr><td colspan='5'></td></tr>";
            //HTMLResult = HTMLResult + "</table>";
            $("#divFlightUnAssign").html(HTMLResult)
            //cfi.AutoComplete("ULDType", "ULDName", "ULD", "SNo", "ULDName", ["ULDName"], null, "contains");
            $("input[id^='Location']").each(function (index, value) {
                cfi.AutoComplete("Location" + index, "LocationName", "vAssignLocation", "SNo", "LocationName", ["LocationName"], null, "contains");
            });
            // cfi.AutoComplete("Location", "LocationName", "vAssignLocation", "SNo", "LocationName", ["LocationName"], null, "contains");
            cfi.AutoComplete("UnAssignEquipmentNo", "EquipmentNo", "vwAllEquipment", "EquipmentSNo", "EquipmentNo", ["EquipmentNo"], null, "contains");
            cfi.PopUp("divFlightUnAssign", "Unassign Flight", 900);
            $("#FlightDate").kendoDatePicker();
        }
    });

}

//////////////////////////////////////////////////////////////////////////
//added function for Release Equipment button by Anmol Sharma
function ReleaseEquipment() {
    $.ajax({
        url: "Services/Shipment/UWSInfoService.svc/ReleaseEquipment", async: true, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ EquipmentNo: CurrentEquipmentNo, UWSSNo: currentUWSSNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "Equipment Released successfully")
            {
                cfi.ShowIndexView("divDetail", "Services/Shipment/UWSInfoService.svc/GetUWSGridData/" + _CURR_PRO_ + "/UWS/Booking/0/0/0/0/1222", "Scripts/maketrans.js?" + Math.random());
                ShowMessage('success', 'Success -UWS', " Equipment " + CurrentEquipmentNo + " Released successfully ", "bottom-right");
            }

            else
                ShowMessage('warning', 'Warning - UWS', result, "bottom-right");
        },
        error: function (xhr)
        {
            ShowMessage('warning', 'Warning - UWS', "unable to process.", "bottom-right");
        }
    });
    $("#divFlightAssign").data("kendoWindow").close();
   // $("").html("");

    // alert('anmol');
}
//end

function GetSLIAction(e) {
    $(".tool-items").hide();
    var RecID = $(e).attr('href').split('=')[1];
    $(e).attr('href', '#RecID=' + RecID);
    var _CurrentSLISNo = RecID;
    currentslisno = RecID;
    var module = "SLI";

    // alert('sdhjkfg');
    $.ajax({
        url: "Services/Shipment/SLInfoService.svc/GetWebForm/" + _CURR_PRO_ + "/" + module + "/SLIAWB/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divDetail").html(result);
            // BindSLICode();
            $('#SLINo').attr('disabled', 1);
            if (result != undefined || result != "") {
                //   InstantiateControl('divDetail');
                currentprocess = "SLIAWB";
                if ($(e).find('span').html().toUpperCase() == "FINAL") {
                    currentslisno = 0;
                    InitializePage("SLIAWB", "divDetail");
                    GetSLIAWBDetails(_CurrentSLISNo);
                    $('input:radio[name=SLIType]:eq(1)').attr("checked", 1);
                    currentslisno = _CurrentSLISNo;
                    SetAWBPrefixCode('Text_AirlineSNo');
                    var Part = $('#SLINo').val().split('-')[1];
                    var MainSLINO = $('#SLINo').val().split('-')[0];
                    $('#SLINo').val(MainSLINO + '-' + (parseInt(Part) - 1));
                    $('#NewSLINo').val(MainSLINO + '-' + (parseInt(Part) - 1));
                    $('span[id="NewSLINo"]').text(MainSLINO + '-' + (parseInt(Part) - 1));
                    $('#btnSave').show();
                    if ($("#HAWBNo").val() != "") {
                        $('#spn').parent().find('font').text('*');
                        $('#AWBNo').attr("data-valid", "minlength[8],required");
                        // SetAWBPrefixCode('Text_AirlineSNo');

                    }
                    else {
                        $('#spn').parent().find('font').text('   ');
                        $('#AWBNo').removeAttr("data-valid");
                    }
                    funRuleForHAWB();

                }
                else if ($(e).find('span').html().toUpperCase() == "READ") {
                    currentslisno = _CurrentSLISNo;
                    InitializePage("SLIAWB", "divDetail");
                    $('#divDetail input,#divDetail select').attr('disabled', 1);
                    $('#btnSave').hide();
                    $('#btnSaveToNext').hide();
                    $('#divDetail input[controltype="autocomplete"]').each(function () {
                        $("#" + $(this).attr("name")).data("kendoAutoComplete").enable(false);
                    })
                    $('div[id$="divMultiSPHCCode"]').find('li span[class="k-icon k-delete"]').hide();

                }
                else {
                    currentslisno = 0;
                    InitializePage("SLIAWB", "divDetail");
                    GetSLIAWBDetails(_CurrentSLISNo);
                    $('#btnSave').show();
                    if ($("#HAWBNo").val() != "") {
                        $('#spn').parent().find('font').text('*');
                        $('#AWBNo').attr("data-valid", "minlength[8],required");
                        // SetAWBPrefixCode('Text_AirlineSNo');

                    }
                    else {
                        $('#spn').parent().find('font').text('   ');
                        $('#AWBNo').removeAttr("data-valid");
                    }
                    funRuleForHAWB();
                }
                $('input:radio[name=SLIType]').attr('disabled', 1);
                $('#SLINo').attr('disabled', 1);

                // alert($('input:radio[name=IDRetained]:checked').val());

                if ($('input:radio[name=IDRetained]:checked').val() == 0) {
                    $('#spnIDNumber').show();
                    $('#IDNumber').show();
                    $('#IDNumber').attr("data-valid", "required");
                    $('#IDNumber').attr("data-valid-msg", "Enter ID Number");
                    $('#spnIDNumber').parent().find('font').show();
                }
                else {
                    $('#spnIDNumber').hide();
                    $('#IDNumber').hide();
                    $('#IDNumber').val("");
                    $('#IDNumber').removeAttr("data-valid");
                    $('#IDNumber').removeAttr("data-valid-msg");
                    $('#spnIDNumber').parent().find('font').hide();
                }


                $('input[name=IDRetained]').click(function () {
                    OnIDRetainedSelection(this);
                });
                //$('span[id="NewSLINo"]').text($('#SLINo').val().split('-')[0] + '-' + (parseInt($('#SLINo').val().split('-')[1]) + 1));
                //$('#SLINo').val($('#SLINo').val().split('-')[0] + '-' + (parseInt($('#SLINo').val().split('-')[1]) + 1));
                //$('span[id="SLINobks"]').text("/");

                //$('#Text_CustomerType').focus();
                //$('#AWBPrefix').val($('#AWBPrefix').val());
                //$('span[id="Hypn"]').text('-');
                //$('#AWBNo').val('00' + $('#SLINo').val().split('-')[0].substr(2, 6));
                $("#tblShipmentInfo").hide();
                //GetProcessSequence("SLIBOOKING");
            }
            $('#btnSaveToNext').hide();
            fun_BindAWBPrefix();
            // return true;
        }
        , error: function (rex) {
            alert(rex);
        }
    });

}
function funGetNewForm() {
    $('#btnSaveToNext').hide();
    CleanUI();
    $("#hdnAWBSNo").val("");
    currentslisno = 0;
    IsFinalSLI = false;
    IsProcessed = false;
    var module = "SLI";
    $.ajax({
        url: "Services/Shipment/SLInfoService.svc/GetWebForm/" + _CURR_PRO_ + "/" + module + "/SLIAWB/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divDetail").html(result);
            BindSLICode();
            if (result != undefined || result != "") {
                InitializePage("SLIAWB", "divDetail");
                currentprocess = "SLIAWB";
                //  font
                $('#SLINo').attr('disabled', 1);
                $("#tblShipmentInfo").hide();
                //GetProcessSequence("SLIBOOKING");
                //CheckSLIType();
            }
        }
    });


}
var IsCheckModulus7 = false;
function SetAWBPrefixCode(e) {
    //  $('#AWBPrefix').val($('#Text_AirlineSNo').val().split('-')[0]);
    if ($("#" + e).data("kendoAutoComplete").key() != "") {
        if ($('input[name="SLIType"]:checked').val() == 1) {
            $.ajax({
                url: "Services/Shipment/SLInfoService.svc/GetSLIAirlineCode?AirlineSNo=" + $("#" + e).data("kendoAutoComplete").key(), async: false, type: "get", dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var Data = jQuery.parseJSON(result);
                    var AirlineData = Data.Table0;
                    // if (AirlineData[0].IsCheckModulus7=="True")
                    $('#AWBPrefix').val(AirlineData[0].AirlineCode);
                    IsCheckModulus7 = AirlineData[0].IsCheckModulus7 == "True" ? true : false;

                },
                error: {

                }
            });
        }
    }

}
function ISNumeric(obj) {
    if ((event.which != 46 || $(obj).val().indexOf('.') != -1) &&
      ((event.which < 48 || event.which > 57) &&
        (event.which != 0 && event.which != 8))) {
        event.preventDefault();
    }

    var text = $(obj).val();
    if ((text.indexOf('.') != -1) && (text.substring(text.indexOf('.')).length > 3)) {
        event.preventDefault();
    }
}
function OnSelectLoadType() {

    if ($("#EquipmentNo").val() != "") {
        $("#EquipmentNo").val('');
    }
}
function BindUWSAWB() {
    //cfi.AutoComplete("DestinationAirportSNo", "AirportCode,AirportName", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
    // cfi.AutoComplete("RoutingCity", "AirportCode,AirportName", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoComplete("AirlineSNo", "CarrierCode,AirlineName", "v_ActiveAirline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], SetAWBPrefixCode, "contains");
    // cfi.AutoComplete("CurrencySNo", "CurrencyCode,CurrencyName", "Currency", "SNo", "CurrencyName", ["CurrencyCode", "CurrencyName"], null, "contains");
    // cfi.AutoCompleteByDataSource("BookingType", SLITYPE, OnTypeSelection);
    //cfi.AutoCompleteByDataSource("CustomerType", SLICustomerTYPE, OnCustomerTypeSelection);
    cfi.AutoCompleteByDataSource("Priority", PreorityType);
    //cfi.AutoComplete("LoadType", "Item", "vwConsumableDistinct", "SNo", "Item", ["Item"], OnSelectLoadType, "contains");
    //cfi.AutoCompleteByDataSource("ChargeCode", SLIChargeCode);
    // cfi.AutoComplete("SHC", "Code", "vwsphc", "SNo", "Code", ["Code"], null, "contains", ",");
    //cfi.AutoComplete("SPHCCode", "CODE", "SPHC", "SNO", "CODE", ["CODE", "Description"], onselectSphcCode, "contains", ",");
    // cfi.AutoComplete("AccountSNo", "AgentName", "v_WMSAgent", "SNo", "AgentName", ["AgentName"], onAgentSelection, "contains");
    // $("#AWBDate").data("kendoDatePicker").value(new Date());
    // $('#AWBDate').prop('readonly', true);
    var SLISNo = (currentslisno == "" ? 0 : currentslisno);
    /////////////////////////////////////
    $('input[name="EquipmentNo"]').bind("keyup", function () {

        PutColoninStartRange(this);
    });
    //$("#ScaleWeight").attr("disabled", "disabled");
    $("#btnCancel").unbind("click").bind("click", function () {
        UWSInfoList();
    });
    $('input[name="EquipmentNo"]').focus();
    //$.ajax({
    //    url: "Services/Shipment/SLInfoService.svc/GetSLIAWBInformation?SLISNo=" + SLISNo, async: false, type: "get", dataType: "json", cache: false,
    //    //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
    //    contentType: "application/json; charset=utf-8",
    //    success: function (result) {
    //        var Data = jQuery.parseJSON(result);
    //        var resData = Data.Table0;
    //        var sphcArray = Data.Table1;
    //        var MaxTempArray = Data.Table2;
    //        TempSLINo = MaxTempArray[0].TempSLINo;

    //        /////////////////////////////////////
    //        $('input[name="EquipmentNo"]').bind("keyup", function () {

    //            PutColoninStartRange(this);
    //        });
    //        //$("#ScaleWeight").attr("disabled", "disabled");
    //        $("#btnCancel").unbind("click").bind("click", function () {
    //            UWSInfoList();
    //        });
    //        // alert(JSON.stringify(sphcArray));
    //        if (resData.length > 0) {

    //            var resItem = resData[0];
    //            $('span[id="NewSLINo"]').text(resItem.SLINo);
    //            $('span[id="SLINobks"]').text("/");

    //            $('#AWBPrefix').val(resItem.AWBPrefix);
    //            $('span[id="Hypn"]').text("-");
    //            // Hypn
    //            $("#Text_CustomerType").data("kendoAutoComplete").setDefaultValue(resItem.CustomerTypeSNo, resItem.CustomerType);
    //            $("#CustomerType").val(resItem.CustomerTypeSNo);
    //            $("#Text_CurrencySNo").data("kendoAutoComplete").setDefaultValue(resItem.CurrencySNo, resItem.CurrencyCode + '-' + resItem.CurrencyName);
    //            $("#CurrencySNo").val(resItem.CurrencySNo);
    //            $("#Text_BookingType").data("kendoAutoComplete").setDefaultValue(resItem.BookingTypeSNo, resItem.BookingType);
    //            $("#BookingType").val(resItem.BookingTypeSNo);
    //            $("#AWBNo").val(resItem.AWBNo);
    //            $("#SLINo").val(resItem.SLINo);
    //            $("#Text_AirlineSNo").data("kendoAutoComplete").setDefaultValue(resItem.AirlineSNo, resItem.CarrierCode + '-' + resItem.Airline);
    //            $("#Text_DestinationAirportSNo").data("kendoAutoComplete").setDefaultValue(resItem.DestinationAirportSNo, resItem.DestinationAirportCode + '-' + resItem.DestinationAirportName);
    //            $("#Text_RoutingCity").data("kendoAutoComplete").setDefaultValue(resItem.RoutingCitySNo, resItem.RoutingAirportCode + '-' + resItem.RoutingAirportName);
    //            $("#Text_AccountSNo").data("kendoAutoComplete").setDefaultValue(resItem.AccountSNo, resItem.AgentName);
    //            $("#DeclaredCarriagevalue").val(resItem.DeclaredCarriagevalue);
    //            $("#DeclaredCustomValue").val(resItem.DeclaredCustomValue);
    //            $("#StartTemperature").val(resItem.StartTemperature);
    //            $("#EndTemperature").val(resItem.EndTemperature);
    //            $("#_tempStartTemperature").val(resItem.StartTemperature);
    //            $("#_tempEndTemperature").val(resItem.EndTemperature);

    //            $('input:radio[name=SLIType]:eq(' + resItem.SLIType + ')').attr("checked", 1);

    //            resItem.isBup == "True" ? $("#isBup").prop('checked', true) : $("#isBup").prop('checked', false);
    //            // alert(resItem.IDRetained);
    //            OnTypeSelection('BookingType');

    //            $('#SLINo').attr('disabled', 1);

    //        }



    //        if (sphcArray.length > 0) {
    //            if (sphcArray[0].SPHCCodeSNo != "") {
    //                $("#SPHCCode").val(sphcArray[0].SPHCCodeSNo);
    //                cfi.BindMultiValue("SPHCCode", sphcArray[0].SPHCCode, sphcArray[0].SPHCCodeSNo)
    //            }
    //        }


    //        $("input[name=AWBNo]").keypress(function (evt) {

    //            var theEvent = evt || window.event;
    //            var key = theEvent.keyCode || theEvent.which;
    //            key = String.fromCharCode(key);
    //            var regex = /^[0-9]{0,9}$/;    // allow only numbers [0-9] 
    //            if (!regex.test(key)) {
    //                theEvent.returnValue = false;
    //                if (theEvent.preventDefault) theEvent.preventDefault();
    //            }

    //        });


    //        funValidateDeclare();


    //        // funRuleForHAWB();
    //        // fun_BindAWBPrefix();
    //        // RH 051015 ends 

    //    },
    //    error: {

    //    }
    //});
}

var PreorityType = [{ Key: "1", Text: "1" }, { Key: "2", Text: "2" }, { Key: "3", Text: "3" }, { Key: "4", Text: "4" }, { Key: "5", Text: "5" }, { Key: "6", Text: "6" }, { Key: "7", Text: "7" }, { Key: "8", Text: "8" }, { Key: "9", Text: "9" }, { Key: "10", Text: "10" }];

function fun_BindAWBPrefix() {

    $('#AWBPrefix').unbind("blur").bind("blur", function () {
        if ($(this).val().length < 3) {
            ShowMessage('warning', 'Warning - UWS', "Enter Valid AWB No.", "bottom-right");
            return false
        }
        else
            return true;
    });
    $('#AWBNo').unbind("blur").bind("blur", function () {
        if ($(this).val().length < 8) {
            ShowMessage('warning', 'Warning - UWS', "Enter Valid AWB No.", "bottom-right");
            return false
        }
        else
            return true;
    });

}


function funValidateDeclare() {
    $("input[name=DeclaredCarriagevalue]").bind("blur", function () {
        if ($("#DeclaredCarriagevalue").val() == "") {
            $("#DeclaredCarriagevalue").val("NVD");
            $("#_tempDeclaredCarriagevalue").val("NVD");
        }
    });
    $("input[name=DeclaredCustomValue]").bind("blur", function () {
        if ($("#DeclaredCustomValue").val() == "") {
            $("#DeclaredCustomValue").val("NCV");
            $("#_tempDeclaredCustomValue").val("NCV");
        }
    });

    //$("input[name=DeclaredCarriagevalue]").keyup(function (evt) {
    //    var theEvent = evt || window.event;
    //    var key = theEvent.keyCode || theEvent.which;
    //    key = String.fromCharCode(key);
    //    var regex = /^[0-9]{0,9}$/;    // allow only numbers [0-9] 
    //    if (!regex.test(key)) {
    //        theEvent.returnValue = false;
    //        if (theEvent.preventDefault) theEvent.preventDefault();
    //    }

    //  //  ISDecCarriageNumber(this);
    //});
    //$("input[name=DeclaredCustomValue]").keypress(function (evt) {
    //    ISDecCustomNumber(this);
    //});
}

function BindSLIData(resItem, sphcArray) {
    $("#Text_CustomerType").data("kendoAutoComplete").setDefaultValue(resItem.CustomerTypeSNo, resItem.CustomerType);
    $("#CustomerType").val(resItem.CustomerTypeSNo);
    $("#Text_CurrencySNo").data("kendoAutoComplete").setDefaultValue(resItem.CurrencySNo, resItem.CurrencyCode + '-' + resItem.CurrencyName);
    $("#CurrencySNo").val(resItem.CurrencySNo);
    $("#Text_BookingType").data("kendoAutoComplete").setDefaultValue(resItem.BookingTypeSNo, resItem.BookingType);
    $("#BookingType").val(resItem.BookingTypeSNo);
    $("#AWBNo").val(resItem.AWBNo);
    $("#SLINo").val(resItem.SLINo);
    $('span[id="SLINobks"]').text("/");
    $('span[id="NewSLINo"]').text(resItem.SLINo);
    //$('#Text_CustomerType').focus();
    $('#AWBPrefix').val(resItem.AWBPrefix != '' ? resItem.AWBPrefix : 'SLI');
    $('span[id="Hypn"]').text('-');

    $("#Text_AirlineSNo").data("kendoAutoComplete").setDefaultValue(resItem.AirlineSNo, resItem.CarrierCode + '-' + resItem.Airline);
    $("#Text_DestinationAirportSNo").data("kendoAutoComplete").setDefaultValue(resItem.DestinationAirportSNo, resItem.DestinationAirportCode + '-' + resItem.DestinationAirportName);
    $("#Text_RoutingCity").data("kendoAutoComplete").setDefaultValue(resItem.RoutingCitySNo, resItem.RoutingAirportCode + '-' + resItem.RoutingAirportName);
    //  $("#Text_SPHCCode").data("kendoAutoComplete").setDefaultValue(resItem.SPHCCodeSNo, resItem.SPHCCode + '-' + resItem.SPHCName);
    $("#Text_AccountSNo").data("kendoAutoComplete").setDefaultValue(resItem.AccountSNo, resItem.AgentName);

    //$("#DeclaredCarriagevalue").val(resItem.DeclaredCarriagevalue);
    //$("#DeclaredCustomValue").val(resItem.DeclaredCustomValue);

    $("#DeclaredCarriagevalue").val(resItem.DeclaredCarriagevalue);
    $("#DeclaredCustomValue").val(resItem.DeclaredCustomValue);
    //$("#_tempDeclaredCustomValue").val(parseFloat(resItem.DeclaredCustomValue).toFixed(2));
    //$("#_tempDeclaredCarriagevalue").val(parseFloat(resItem.DeclaredCarriagevalue).toFixed(2));

    //$("#DeclaredCarriagevalue").data("kendoNumericTextBox").value(parseFloat(resItem.DeclaredCarriagevalue).toFixed(2));
    //$("#DeclaredCustomValue").data("kendoNumericTextBox").value(parseFloat(resItem.DeclaredCustomValue).toFixed(2));
    //$("#_tempDeclaredCustomValue").val(parseFloat(resItem.DeclaredCustomValue).toFixed(2));
    //$("#_tempDeclaredCarriagevalue").val(parseFloat(resItem.DeclaredCarriagevalue).toFixed(2));


    $("#ChargeCode").val(resItem.ChargeCodeSNo);
    $("#Text_ChargeCode").data("kendoAutoComplete").setDefaultValue(resItem.ChargeCodeSNo, resItem.ChargeCode);
    $("#HAWBNo").val(resItem.HAWBNo);
    $("#Shipper_Agent").val(resItem.ShipperAgent);
    $("#BOENo").val(resItem.BookingTypeSNo == 1 ? resItem.ExitFormNo : resItem.BOENo);
    $("#GRNNo").val(resItem.GRNNo);
    $("#IDNumber").val(resItem.IDNumber);
    if (resItem.IDRetained == "True") {
        $('input:radio[name=IDRetained]:eq(0)').attr("checked", 1);
        $('#spnIDNumber').show();
        $('#IDNumber').show();
        $('#spnIDNumber').parent().find('font').show();
    }
    else {
        $('input:radio[name=IDRetained]:eq(1)').attr("checked", 1);
        $('#spnIDNumber').hide();
        $('#IDNumber').hide();
        $('#IDNumber').val("");
        $('#spnIDNumber').parent().find('font').hide();

    }
    if (sphcArray.length > 0) {
        //alert(sphcArray[0].SPHCCodeSNo)
        if (sphcArray[0].SPHCCodeSNo != "") {
            // $("#SPHCCode").val(0);
            //  cfi.BindMultiValue("SPHCCode", "", 0);
            // $('#divMultiSPHCCode ul').html("");
            $("#SPHCCode").val(sphcArray[0].SPHCCodeSNo);
            cfi.BindMultiValue("SPHCCode", sphcArray[0].SPHCCode, sphcArray[0].SPHCCodeSNo)
        }
    }
    $('input:radio[name=SLIType]:eq(' + resItem.SLIType + ')').attr("checked", 1);
    resItem.isBup == "True" ? $("#isBup").prop('checked', true) : $("#isBup").prop('checked', false);
    OnTypeSelection('BookingType');

}
function GetSLIAWBDetails(SLISNo) {
    // var No = $('#' + ByType).val();
    //  alert(No)
    $.ajax({
        url: "Services/Shipment/SLInfoService.svc/GetSLIAWBDetails?SLISNo=" + SLISNo, async: false, type: "get", dataType: "json", cache: false,
        //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.Table0;
            var sphcArray = Data.Table1;
            //   alert(resData.length);
            if (resData.length > 0) {
                var resItem = resData[0];


                if (resItem.SLIType != 1) {
                    //  alert(JSON.stringify(resItem));
                    BindSLIData(resItem, sphcArray);
                    $('#Text_AirlineSNo').first().focus();
                    $('#AirlineSNo').first().focus();

                }
                else {
                    var r = confirm('This SLI is already finalized, only data would be populated');
                    if (r == true) {
                        BindSLIData(resItem, sphcArray);
                        $('#AWBNo').val("");
                        BindSLICode();
                        $('input:radio[name=SLIType]:eq(0)').attr("checked", 1);
                        $('#Text_AirlineSNo').first().focus();
                        $('#AirlineSNo').first().focus();
                        currentslisno = 0;

                    } else {
                        var module = "SLI";
                        // IsFinalSLI = false;
                        //IsProcessed = false;
                        $.ajax({
                            url: "Services/Shipment/SLInfoService.svc/GetWebForm/" + _CURR_PRO_ + "/" + module + "/SLIAWB/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                            success: function (result) {
                                $("#divDetail").html(result);
                                BindSLICode();
                                if (result != undefined || result != "") {
                                    InitializePage("SLIAWB", "divDetail");
                                    currentprocess = "SLIAWB";
                                    $('#SLINo').attr('disabled', 1);
                                    $("#tblShipmentInfo").hide();
                                    //  GetProcessSequence("SLIBOOKING");
                                }
                                $('#Text_AirlineSNo').first().focus();
                                $('#AirlineSNo').first().focus();

                            }
                        });
                    }

                }
            }
            else {
                $.ajax({
                    url: "Services/Shipment/SLInfoService.svc/GetSLICode", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        var Data = jQuery.parseJSON(result);
                        $('#SLINo').val(Data.Table0[0].SLINo + '-1')
                        $('span[id="SLINobks"]').text("/");
                        $('span[id="NewSLINo"]').text(Data.Table0[0].SLINo + '-1');
                        //$('#Text_CustomerType').focus();
                        $('#AWBPrefix').val('SLI');
                        $('span[id="Hypn"]').text('-');
                        $('#AWBNo').val('00' + Data.Table0[0].SLINo.substr(2, 6));
                    }
                });
            }
            //  $("#AWBNo").unbind("keyup").bind("keyup", function () {
            //     if ($(this).val().length == 3) {
            //        $(this).val($(this).val() + "-");
            //    }
            // });
            // RH 051015 ends 
            // ResetDetails();
            $("#btnCancel").unbind("click").bind("click", function () {
                ResetDetails();
            });
            $("#DeclaredCarriagevalue").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });
            $("#DeclaredCustomValue").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });
            funValidateDeclare();
            fun_BindAWBPrefix();
        },
        error: {

        }
    });


}
// Santosh Gupta check Equipment Exist---GetSLIAWBExist
function GetEquipmentExist() {
    var EquiLen = $('#EquipmentNo').val().split('-').length;
    var LoadType = $('#LoadType').val();
    var ValidFlag = false;
    if (EquiLen != 3) {
        ShowMessage('warning', 'Warning - UWS', "Invalid Equipment No", "bottom-right");
        ValidFlag = true;
    }

    $.ajax({
        url: "Services/Shipment/UWSInfoService.svc/GetEquipmentExist?EquipmentNo=" + $("#EquipmentNo").val() + "&LoadType=" + LoadType, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == 0) {
                ValidFlag = true;
                ShowMessage('warning', 'Warning - UWS', "Invalid or Already utilized equipment. Please use another equipment.", "bottom-right");
            }
            else {

            }
        },
        error: {

        }
    });

    return ValidFlag;
}

function BindSLICustomerInfo() {

    cfi.AutoComplete("SHIPPER_AccountNo", "CustomerNo", "vSLIShipperDetails", "SNo", "CustomerNo", ["CustomerNo"], GetShipperConsigneeDetails, "contains");
    //cfi.AutoComplete("SHIPPER_Name", "Name", "vShipperDetails", "SNo", "Name", ["Name"], GetShipperConsigneeDetails, "contains");
    cfi.AutoComplete("SHIPPER_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], ClearShipperCity, "contains");
    cfi.AutoComplete("SHIPPER_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");
    cfi.AutoComplete("CONSIGNEE_AccountNo", "CustomerNo", "vSLIConsigneeDetails", "SNo", "CustomerNo", ["CustomerNo"], GetShipperConsigneeDetails, "contains");
    // cfi.AutoComplete("CONSIGNEE_AccountNoName", "Name", "vConsigneeDetails", "SNo", "Name", ["Name"], GetShipperConsigneeDetails, "contains");
    cfi.AutoComplete("CONSIGNEE_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], ClearCONSIGNEECity, "contains");
    cfi.AutoComplete("CONSIGNEE_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");


    $.ajax({
        url: "Services/Shipment/SLInfoService.svc/GetShipperAndConsigneeInformation?SLISNo=" + currentslisno, async: false, type: "get", dataType: "json", cache: false,
        //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
        data: JSON.stringify({ SLISNO: currentslisno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var customerData = jQuery.parseJSON(result);
            var shipperData = customerData.Table0;
            var consigneeData = customerData.Table1;
            // var agentData = customerData.Table2;
            // alert(JSON.stringify(shipperData));
            if (shipperData.length == 1) {
                $("#SHIPPER_AccountNo").val(shipperData[0].SNo);
                $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperAccountNo, shipperData[0].CustomerNo);
                // $("#Text_SHIPPER_Name").data("kendoAutoComplete").setDefaultValue(shipperData[0].CustomerSNo, shipperData[0].ShipperName);
                $("#SHIPPER_Name").val(shipperData[0].ShipperName);
                $("#SHIPPER_Street").val(shipperData[0].ShipperStreet);
                $("#SHIPPER_TownLocation").val(shipperData[0].ShipperLocation);
                $("#SHIPPER_State").val(shipperData[0].ShipperState);
                $("#SHIPPER_PostalCode").val(shipperData[0].ShipperPostalCode);
                $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCountryCode, shipperData[0].ShipperCountryName);
                $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCity, shipperData[0].ShipperCityName);
                $("#SHIPPER_MobileNo").data("kendoNumericTextBox").value(shipperData[0].ShipperMobile);
                $("#_tempSHIPPER_MobileNo").val(shipperData[0].ShipperMobile);
                $("#SHIPPER_Email").val(shipperData[0].ShipperEMail);

                //$("#SHIPPER_MobileNo").data("kendoNumericTextBox").value(parseFloat(resItem.DeclaredCarriagevalue).toFixed(2));
                //$("#DeclaredCustomValue").data("kendoNumericTextBox").value(parseFloat(resItem.DeclaredCustomValue).toFixed(2));
                //$("#_tempDeclaredCustomValue").val(parseFloat(resItem.DeclaredCustomValue).toFixed(2));
                //$("#_tempDeclaredCarriagevalue").val(parseFloat(resItem.DeclaredCarriagevalue).toFixed(2));
            }
            if (consigneeData.length == 1) {

                //  alert(JSON.stringify(consigneeData[0]));
                $("#CONSIGNEE_AccountNo").val(consigneeData[0].SNo);
                $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeAccountNo, consigneeData[0].CustomerNo);
                // $("#Text_CONSIGNEE_AccountNoName").data("kendoAutoComplete").setDefaultValue(consigneeData[0].CustomerSNo, consigneeData[0].ConsigneeName);
                $("#CONSIGNEE_AccountNoName").val(consigneeData[0].ConsigneeName);
                $("#CONSIGNEE_Street").val(consigneeData[0].ConsigneeStreet);
                $("#CONSIGNEE_TownLocation").val(consigneeData[0].ConsigneeLocation);
                $("#CONSIGNEE_State").val(consigneeData[0].ConsigneeState);
                // $("#CONSIGNEE_PostalCode").data("kendoNumericTextBox").value(parseFloat(shipperData[0].ShipperPostalCode).toFixed(2));
                $("#CONSIGNEE_PostalCode").val(consigneeData[0].ConsigneePostalCode);
                $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCity, consigneeData[0].ConsigneeCityName);
                $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCountryCode, consigneeData[0].ConsigneeCountryName);
                $("#CONSIGNEE_MobileNo").data("kendoNumericTextBox").value(consigneeData[0].ConsigneeMobile);
                $("#_tempCONSIGNEE_MobileNo").val(consigneeData[0].ConsigneeMobile);
                $("#CONSIGNEE_Email").val(consigneeData[0].ConsigneeEMail);

            }
            //if (agentData.length == 1) {
            //    $('#AGENT_AccountNo').val(agentData[0].AccountNo);
            //    $('span[id=AGENT_AccountNo]').text(agentData[0].AccountNo);
            //    $('#AGENT_Participant').val(agentData[0].Participant);
            //    $('span[id=AGENT_Participant]').text(agentData[0].Participant);
            //    $('#AGENT_IATACODE').val(agentData[0].IATANo);
            //    $('span[id=AGENT_IATACODE]').text(agentData[0].IATANo);
            //    $('#AGENT_Name').val(agentData[0].AgentName);
            //    $('span[id=AGENT_Name]').text(agentData[0].AgentName);
            //    $('#AGENT_IATACASSADDRESS').val(agentData[0].CASSAddress);
            //    $('span[id=AGENT_IATACASSADDRESS]').text(agentData[0].CASSAddress);
            //    $('#AGENT_PLACE').val(agentData[0].Location);
            //    $('span[id=AGENT_PLACE]').text(agentData[0].Location);
            //}
        },
        error: {

        }
    });

    //$("input[id='SHIPPER_AccountNo']").unbind("blur").bind("blur", function () {
    //    GetShipperConsigneeDetails('S', currentawbsno);
    //});
    //$("input[id='CONSIGNEE_AccountNo']").unbind("blur").bind("blur", function () {
    //    GetShipperConsigneeDetails('C', currentawbsno);
    //});    

}


function BindPackingAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='PackingTypeSNo']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "PackingName", "IrregularityPacking", "SNo", "PackingName", ["PackingName"], null, "contains");
    });

    $(elem).find("input[id^='SLINo']").each(function () {
        $(this).val(slino);
    });
    $(elem).find("span[id^='SLINo']").each(function () {
        $(this).text(slino);
    });
    //$(elem).find("input[id^='SLINo']").each(function () {
    //    $('#'+$(this).attr("name")).val(slino);
    //    $("span[id^='SLINo']").text(slino);
    //});
}
function BindServiceNameAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='ServiceName']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "Code", "vServicesHeader", "ChildSNo", "Code", ["Code", "ChargeName"], CheckServiceValidate, "contains");
    });
    $(elem).find("span[class='k-widget k-combobox k-header']").each(function () {

        $(this).css('width', '60%');
    });
    $(elem).find("input[id^='SLINo']").each(function () {
        $(this).val(slino);
    });
    $(elem).find("span[id^='SLINo']").each(function () {
        $(this).text(slino);
    });
}


function CheckBULKULDType(e) {
    if ($('#' + e).val().toUpperCase() == "BULK") {
        $('#' + e).closest('tr').find('input[id^="ULDNo"]').val('');
        $('#' + e).closest('tr').find('input[id^="ULDNo"]').attr('disabled', 1);
    }
    else {
        $('#' + e).closest('tr').find('input[id^="ULDNo"]').removeAttr('disabled');
    }
}

function BindULDAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='ULDPackingTypeSNo']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "PackingName", "IrregularityPacking", "SNo", "PackingName", ["PackingName"], null, "contains");
    });

    $(elem).find("input[id^='Unit']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "UnitCode", "MeasurementUnitCode", "SNo", "UnitCode", ["UnitCode", "UnitName"], CalculateULDVolume, "contains");
        $("input[id^='Unit']").attr("width", "100px");
    });

    //$(elem).find("input[id^='ULDNoSNo']").each(function () {
    //    cfi.AutoComplete($(this).attr("name"), "ULDNo", "v_AvailableULD", "SNo", "ULDNo", ["ULDNo"], null, "contains");
    //});
    $(elem).find("input[id^='ULDTypeSNo']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "ULDName", "ULD", "SNo", "ULDName", ["ULDName"], CheckBULKULDType, "contains");
    });
    $(elem).find("input[id^='SLINo']").each(function () {
        $(this).val(slino);
    });
    $(elem).find("span[id^='SLINo']").each(function () {
        $(this).text(slino);
    });

}


function checkonRemove(elem) {
    var closestTable = elem.closest("table");
    var currentIndexPos = $(closestTable).find("[id^='Length']").length - 1;
    if (elem.closest("table").find("[id^='Pieces']").length < 2)
        $('.disablechk').removeAttr('disabled');
    $(closestTable).find("[id^='Pieces']")[currentIndexPos].disabled = false;
    CalculateVolume(elem);
}

///
function InstantiateControl(containerId) {
    $("#" + containerId).find("input[type='text']").each(function () {
        var controlId = $(this).attr("id");
        var decimalPosition = cfi.IsValidNumeric(controlId);
        if (decimalPosition >= -1) {
            //            $(this).css("text-align", "right");
            cfi.Numeric(controlId, decimalPosition);
        }
        else {
            var alphabetstyle = cfi.IsValidAlphabet(controlId);
            if (alphabetstyle != "") {
                if (alphabetstyle == "datetype") {
                    cfi.DateType(controlId);
                }
                else {
                    cfi.AlphabetTextBox(controlId, alphabetstyle);
                }
            }
        }
    });
    $("#" + containerId).find("textarea").each(function () {
        var controlId = $(this).attr("id");
        var alphabetstyle = cfi.IsValidAlphabet(controlId);
        if (alphabetstyle != "") {
            if (alphabetstyle == "editor") {
                cfi.Editor(controlId);
            }
            else {
                cfi.AlphabetTextBox(controlId, alphabetstyle);
            }
        }
    });
    $("#" + containerId).find("span").each(function () {
        var attr = $(this).attr('controltype');

        // For some browsers, `attr` is undefined; for others,
        // `attr` is false.  Check for both.
        if (typeof attr !== 'undefined' && attr !== false) {
            // ...
            var controlId = $(this).attr("id");

            var decimalPosition = cfi.IsValidSpanNumeric(controlId);
            if (decimalPosition >= -1) {
                //            $(this).css("text-align", "right");
                cfi.Numeric(controlId, decimalPosition, true);
            }

            else {
                var alphabetstyle = cfi.IsValidSpanAlphabet(controlId);
                if (alphabetstyle != "") {
                    if (alphabetstyle == "datetype") {
                        cfi.DateType(controlId, true);
                    }
                    //                                else {
                    //                                    cfi.AlphabetTextBox(controlId, alphabetstyle);
                    //                                }
                }
            }
        }
    });
    SetDateRangeValue();

    //$("#" + containerId).find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
    //    if ($(this).attr("recname") == undefined) {
    //        var controlId = $(this).attr("id");
    //        cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), _DefaultAutoComplete_);
    //    }
    //});
    cfi.ValidateSubmitSection();
    $("div[id^='__appTab_").each(function () {
        $(this).kendoTabStrip().data("kendoTabStrip");
    });
    $("input[name='operation']").click(function () {
        _callBack();
    });
    $("[id$='divRemoveRecord']").hide();
    $("input[name='operation']").click(function () {
        if (cfi.IsValidSubmitSection()) {
            StartProgress();
            if ($(this).hasClass("removeop")) {
                $("#" + formid).trigger("submit");
            }
            StopProgress();
            return true;
        }
        else {
            return false
        }
    });
    _callBack = function () {
        if ($.isFunction(window.MakeTransDetailsData)) {
            return MakeTransDetailsData();
        }
    }

    _ExtraCondition = function (textId) {
        if ($.isFunction(window.ExtraCondition)) {
            return ExtraCondition(textId);
        }
    }
    $(".removepopup").click(function () {
        $("#divRemovePanel").show();
        cfi.PopUp("divRemoveRecord", "");
    });
    $(".cancelpopup").click(function () {
        $("#divRemovePanel").hide();
        cfi.ClosePopUp("divRemoveRecord");
    });
    //$("div[id^='divareaTrans_'][cfi-aria-trans='trans']").each(function () {
    //    var transid = this.id.replace("divareaTrans_", "");
    //    cfi.makeTrans(transid, null, null, null, null, null, null);
    //});
    //    $("td.formtwoInputcolumn").html("TEST<STRONG>ASDFA<EM>SASDFASDF</EM></STRONG>");
    //    ChangeAllControlToLable("aspnetForm");
}
function InstantiateSearchControl(cntrlId) {
    $("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("input[type='text']").each(function () {
        var controlId = $(this).attr("id");
        var decimalPosition = cfi.IsValidNumeric(controlId);
        if (decimalPosition >= -1) {
            //            $(this).css("text-align", "right");
            cfi.Numeric(controlId, decimalPosition);
        }
        else {
            var alphabetstyle = cfi.IsValidAlphabet(controlId);
            if (alphabetstyle != "") {
                if (alphabetstyle == "datetype") {
                    cfi.DateType(controlId);
                }
                else {
                    cfi.AlphabetTextBox(controlId, alphabetstyle);
                }
            }
        }
    });
    $("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("textarea").each(function () {
        var controlId = $(this).attr("id");
        var alphabetstyle = cfi.IsValidAlphabet(controlId);
        if (alphabetstyle != "") {
            if (alphabetstyle == "editor") {
                cfi.Editor(controlId);
            }
            else {
                cfi.AlphabetTextBox(controlId, alphabetstyle);
            }
        }
    });
    $("table[cfi-aria-search='search']").find("span").each(function () {
        var attr = $(this).attr('controltype');

        // For some browsers, `attr` is undefined; for others,
        // `attr` is false.  Check for both.
        if (typeof attr !== 'undefined' && attr !== false) {
            // ...
            var controlId = $(this).attr("id");

            var decimalPosition = cfi.IsValidSpanNumeric(controlId);
            if (decimalPosition >= -1) {
                //            $(this).css("text-align", "right");
                cfi.Numeric(controlId, decimalPosition, true);
            }

            else {
                var alphabetstyle = cfi.IsValidSpanAlphabet(controlId);
                if (alphabetstyle != "") {
                    if (alphabetstyle == "datetype") {
                        cfi.DateType(controlId, true);
                    }
                    //                                else {
                    //                                    cfi.AlphabetTextBox(controlId, alphabetstyle);
                    //                                }
                }
            }
        }
    });


}
function ExtraCondition(textId) {

    var CarrierCode = $("#Text_searchAirline").val().substring(0, 2);
    var filterShipperCity = cfi.getFilter("AND");
    var filterConsigneeCity = cfi.getFilter("AND");
    var ShipperAccountFilter = cfi.getFilter("AND");
    var ConsigneeFilter = cfi.getFilter("AND");
    var AirlineFilter = cfi.getFilter("AND");
    var IssuingAgentFilter = cfi.getFilter("AND");
    var filterSPHCCode = cfi.getFilter("AND");
    var filterULDTypeSNo = cfi.getFilter("AND");

    if (textId.indexOf("Text_searchFlightNo") >= 0) {
        var filterSCity = cfi.getFilter("AND");
        cfi.setFilter(filterSCity, "FlightDate", "eq", cfi.CfiDate("searchFlightDate"));
        if ($("#searchProcess").val() == "1") {
            cfi.setFilter(filterSCity, "DestinationAirPortSNo", "eq", userContext.AirportSNo);
            cfi.setFilter(filterSCity, "CarrierCode", "eq", CarrierCode);
            cfi.setFilter(filterSCity, "ArrivalStatus", "eq", 1);

        }
        else {
            cfi.setFilter(filterSCity, "OriginAirportSNo", "eq", userContext.AirportSNo);
            cfi.setFilter(filterSCity, "CarrierCode", "eq", CarrierCode);
            cfi.setFilter(filterSCity, "IsDeparted", "eq", 0);
            cfi.setFilter(filterSCity, "IsDirectFlight", "eq", 1);
        }
        filterShipperCity = cfi.autoCompleteFilter(filterSCity);
        return filterShipperCity;
    }

    else if (textId.indexOf("Text_FlightNo") >= 0) {
        var filterFAssign = cfi.getFilter("AND");
        cfi.setFilter(filterFAssign, "FlightDate", "eq", cfi.CfiDate("FlightDate"));
        cfi.setFilter(filterFAssign, "OriginAirportSNo", "eq", userContext.AirportSNo);
        cfi.setFilter(filterFAssign, "IsDirectFlight", "eq", "1");
        cfi.setFilter(filterFAssign, "IsDeparted", "eq", "0");
        filterFlight = cfi.autoCompleteFilter(filterFAssign);
        return filterFlight;
    }
    else if (textId.indexOf("Text_searchAirline") >= 0) {
        var filterULDSNo = cfi.getFilter("AND");
        $("#Text_searchFlightNo").val("");
        return filterULDTypeSNo;
    }
    else if (textId.indexOf("Text_ULDTypeSNo") >= 0) {
        var filterULDSNo = cfi.getFilter("AND");
        cfi.setFilter(filterULDSNo, "ULDName", "neq", "BULK");
        filterULDTypeSNo = cfi.autoCompleteFilter(filterULDSNo);
        return filterULDTypeSNo;
    }
    else if (textId.indexOf("Text_SPHCCode") >= 0) {
        var filterSPHCC = cfi.getFilter("AND");
        cfi.setFilter(filterSPHCC, "SNO", "notin", $("#Text_SPHCCode").data("kendoAutoComplete").key());
        filterSPHCCode = cfi.autoCompleteFilter(filterSPHCC);
        return filterSPHCCode;
    }
    else if (textId.indexOf("searchProcess") >= 0) {
        var filterSPHCC = cfi.getFilter("AND");
        filterSPHCCode = cfi.autoCompleteFilter(filterSPHCC);
        $("#Text_searchFlightNo").val("");
        return filterSPHCCode;
    }
    else if (textId.indexOf("Text_UnAssignEquipmentNo") >= 0) {
        var filterEAssign = cfi.getFilter("AND");
        cfi.setFilter(filterEAssign, "IsAvailable", "eq", "1");
        filterEquipment = cfi.autoCompleteFilter(filterEAssign);
        return filterEquipment;
    }
    

}

var fotter = "<div><table style='margin-left:20px;'>" +
                        "<tbody><tr><td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-primary btn-sm' style='width:125px;' id='btnNew'>New</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-success btn-sm'  id='btnSave'>Save</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            //"<td><button class='btn btn-block btn-success btn-sm'  id='btnSaveToNext'>Save &amp; Next</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-danger btn-sm' id='btnCancel'>Cancel</button></td>" +
                        "</tr></tbody></table> </div>";
var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divShipmentDetails' style='width:100%'></div></td></tr><tr> <td valign='top'> <table style='width:100%'> <tr> <td style='width:70%;' valign='top' class='tdInnerPadding'>  <div id='divDetail'></div><div id='divSearchDetail'></div><div id='divNewDetail'></div> <div id='divNewBooking'></div><div id='divULDOverhang'></div><div id='divGridBulkData'></div><div id='divFlightAssign'></div><div id='divFlightUnAssign'></div><div id='divBulkRemove'></div><div id='divReWeiging'></div><div id='divDetailSHC'> </div><div id='divULDTag'> </div></td></tr></table> </td></tr></table></div>";





