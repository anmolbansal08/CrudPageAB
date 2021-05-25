/// <reference path="../../Scripts/references.js" />
///<reference path="../../Scripts/signalRFactory.js" />

var _CityCode_ = "SHJ";
var AddedULD = "";
var arrSPHCList = [];
var arrAircraftCapacityList = [];
var arrULDCapacity = [];
var arrULDCapacity_Final = [];
var User_SNo, User_Name, User_CityCode, User_CitySNo;
var _ISPAX = "";
var _ISFreighter = "";
var _EquipmentSNo = 0;
var FlightNextDestination = "";
var LstULDSPH = [];
var IsFlightPremanifested = "False";
var IsFlightManifested = 'False';
var LstSavedULD = [];
var _PartAirline = "";
var plannedPcs = 0;
var tmpPlannedPcs = 0;
// Changes By Vipin Kumar
var IsOffloadFromBulk = 0;
var LoadPopUPStatus = false;
// Changes by Vipin Kumar 
var processeduldshipmentCheck = [];
// Changes by Vipin Kumar 
var ULD_SNo = "";
var CheckCollepsRow = 0;


$(document).ready(function () {
    PrepareBuildUp();

    signalR.startHub();



});

$(function () {
    signalR.getProcessList(function (completeProcessList) {
        processList = completeProcessList;
    });

    signalR.updateProcessList(function (newProcessObj) {
        // alert('Open by another user');
        processList.push(newProcessObj);
    });

});
function onGridDataBound(e) { }
function PrepareBuildUp() {
    // Changes by Vipin Kumar
    IsOffloadFromBulk = 0;
    // Ends
    _CURR_PRO_ = "BUILDUP";
    _CURR_OP_ = "Build-Up";
    $("#btnSaveToNext").hide();
    $("#btnNew").hide();
    $("#licurrentop").html(_CURR_OP_);
    $("#divShipmentDetails").html("");
    $("#divNewBooking").html("");
    $("#btnSave").unbind("click");

    CleanUI();
    $("#divSearch").html("");
    $.ajax({
        url: "Services/Buildup/BuildUpService.svc/GetWebForm",//" + _CURR_PRO_ + "/BuildUp/BuildUpSearch/Search/1",
        type: "POST",
        cache: false,
        data: JSON.stringify({ model: { processName: _CURR_PRO_, moduleName: "BuildUp", appName: "BuildUpSearch", Action: "Search", IsSubModule: "1" } }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {

            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form>");
            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });
            $("#divContent").html(divContent + divAirlineULDStock + divShowLI);
            $("#divFooter").html(fotter).show();
            if (userContext.SysSetting.IsBuildUpPrintRequired.toUpperCase() == "TRUE") {
                $('#tdbuildupprint').show();
            }
            var dataSource = GetDataSource("searchFlightNo", "BuildUp_searchFlightNoByDataSource");
            cfi.ChangeAutoCompleteDataSource("searchFlightNo", dataSource, false, ResetSearchByFlight, "FlightNo", "contains");

            var todayDate = new Date();
            $('#searchFlightDate').data("kendoDatePicker").value(todayDate);

            $('#__tblbuildupsearch__').find('td:first').text('Flight Date');
            $('#__tblbuildupsearch__').find('td:first').css('width', '70px');
            $('#__tblbuildupsearch__').find('td:first').css('padding-left', '5px');


            $("#btnSearch").bind("click", function () {

                signalR.startHub();
                signalR.getProcessList(function (completeProcessList) {
                    processList = completeProcessList;
                });

                signalR.updateProcessList(function (newProcessObj) {
                    // alert('Open by another user');
                    processList.push(newProcessObj);
                });

                IsChanged = false;
                /*Added By Brajendra for lock flight*/
                // SaveUpdateLockedProcess(0, "", "", "", userContext.UserSNo, "30", "BuildUpSearch", "", "");

                var msg = GetAWBLockedEvent(userContext.UserSNo, 0, $("#searchFlightNo").val(), "", "", "", "30");
                if (msg == "Fail") { return false; };
                SaveUpdateLockedProcess(0, $("#searchFlightNo").val(), "", "", userContext.UserSNo, 30, "", 3, "");

                /*End*/
                //Changes by Vipin Kumar
                processeduldshipmentCheck = [];
                CleanUI();
                BuildupSearch();
                LyingListPOMailDetailsArray = [];

                //var trHeader = $("div#divUldShipmentSection").find(".k-grid-header").find("tr[role='row']");
                //var uldstocksnoindex = -1;
                //var isCartindex = -1;

                //uldstocksnoindex = trHeader.find("th[data-field='ULDStockSNo']").index();
                //isCartindex = trHeader.find("th[data-field='IsCart']").index();

                //$("#divUldShipmentSection").find("tr.k-master-row").each(function () {
                //    var uldStockSNo = $(this).find("td:eq(" + uldstocksnoindex + ")").text();
                //    var IsCart = $(this).find("td:eq(" + isCartindex + ")").text();
                //    if (uldStockSNo == "0" || IsCart == "1") {
                //        $("#Text_offloadPoint_" + uldStockSNo).closest('span').hide();
                //        $("#Text_offloadPoint_" + uldStockSNo).hide();
                //    }
                //});

                setTimeout(function () { PageRightsCheckBuildUP() }, 500)
            });



            /**************User Info****************/
            //if ($('#hdn_userInfo').val() != "") {
            //userContext
            var UserInfo = $('#hdn_userInfo').val();
            User_SNo = userContext.UserSNo;//UserInfo.split('#')[0];
            User_Name = userContext.UserName; //UserInfo.split('#')[1];
            User_CityCode = userContext.AirportCode; //UserInfo.split('#')[2];
            User_CitySNo = userContext.CitySNo; //UserInfo.split('#')[3];
            _CityCode_ = User_CityCode;
            _LoginSNo_ = User_SNo;
            //}
            /***************************************/
        }
    });


    setTimeout(function () { PageRightsCheckBuildUP() }, 500)
}


function BindKendoTab() {
    if (userContext.SysSetting.IsShowOffLoadedULD == "True") {
        $("#OffLoadedULD").show();
    }
    getDNDetails();


    $("#ApplicationTabs").kendoTabStrip();

    /*Following code inserted by brajendra on 27 Mar 2018 for hide lying list tab in Lion*/
    if (userContext.SysSetting.IsHideLyingListInBuildup == "True") $($("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").items()[1]).hide();

    $("#AirlineULDStock").bind("click", function () {
        $("#divAirlineULDStock").html("<table class='WebFormTable'><tr><td class='formthreelabel'>ULD Type</td><td class='formthreeInputcolumn'><input type='hidden' name='ULDType' id='ULDType' value=''/> <input type='text'  name='Text_ULDType' id='Text_ULDType' tabindex='1' controltype='autocomplete' maxlength='10' /></td><td class='formthreeInputcolumn'> <input type='radio' tabindex='2' class='' name='IsSummaryDetails' checked='True' id='IsSummary' value='0'/>Summary <input type='radio' tabindex='2' class='' name='IsSummaryDetails' id='IsDetails' value='1'/>Details</td><td class='formthreeInputcolumn'><input type='button' tabindex='3' class='btn btn-block btn-success btn-sm' name='searchAirlineULDStock' id='searchAirlineULDStock' style='width:90px;' value='Search' onclick='getAirlineULDStock();'></td></tr><tr><td colspan='4'><div id='divAirlineULDStockDetails' style='overflow-y:scroll;max-height:300px;'></div></td></tr></table>");

        //Commented by brajendra when new autocomplete implemented  ("ULDType", "ULDName", "vBuildupULDType", "SNo", "ULDName", ["ULDName"], null, "contains");                 

        cfi.AutoComplete("ULDType", "ULDName", "BuildUp_ULDType", null, "contains");
        cfi.PopUp("divAirlineULDStock", "Available Airline ULD Stock", 100, null, null);
    });
    $("#ShowLI").bind("click", function () {

        AssignTeamGrid();
        //$("#divShowLI").html("<table class='WebFormTable'><tr><td></td></tr></table>");
        cfi.PopUp("divShowLI", "Show Loading Instruction", 100, null, null);
    });



    $("#OffLoadedULD").bind("click", function () {
        LoadPopUPStatus = true;
        $('#divOffloadedULD').html('');
        $("#divOffloadedULDButton").next('div').remove();
        if (processedawb.length == 0) {
            ShowOffloadedShipment();
            $('#btnSaveOffload').show();
            cfi.PopUp("divOffloadedULDButton", "Off-Loaded ULDs/Carts", 80, null, PopUpOnClose);
        } else {

            $("#divOffloadedULDButton").after('<div id="divWindow"><table validateonsubmit="true" class="WebFormTable" ><tr><td class="formlabel" style="font-size: 14px;text-align:left;"><b>Few Shipments are planned but not saved in  Build-Up. Planning Off-Loaded ULDs/Carts would remove all such shipments from planned section to unplanned section Do you wish to continue ?</b></td></tr></table></div>');
            $("#divWindow").dialog({
                autoResize: true,
                maxWidth: 510,
                maxHeight: 250,
                width: 500,
                height: 200,
                modal: true,
                title: 'Confirmation',
                draggable: false,
                resizable: false,
                buttons:
                {
                    'Yes': function () {
                        $(this).dialog('close');
                        //$.ajax({

                        //});
                        ShowOffloadedShipment();
                        $('#btnSaveOffload').show();
                        cfi.PopUp("divOffloadedULDButton", "Off-Loaded ULDs/Carts", 80, null, PopUpOnClose);
                        $(this).find("#yes").click();
                    },
                    'No': function () {
                        //$.ajax({
                        //    url: "./Services/Accounts/CashRegisterService.svc/NewCashRegister",
                        //    contentType: "application/json; charset=utf-8",
                        //    data: JSON.stringify({ CashierID: CashierID, GroupSNo: GroupSNo }),
                        //    async: false,
                        //    type: 'post',
                        //    cache: false,
                        //    success: function (result) {

                        //    }
                        //});
                        $(this).dialog('close');
                        $(this).find("#no").click();
                    }
                }
            });
        }

    });




    $('#RegistrationNo').keypress(function (e) {
        var allowedChars = new RegExp("^[a-zA-Z0-9\-]+$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (allowedChars.test(str)) {
            return true;
        }
        e.preventDefault();
        return false;
    }).keyup(function () {
        // the addition, which whill check the value after a keyup (triggered by Ctrl+V)
        // We take the same regex as for allowedChars, but we add ^ after the first bracket : it means "all character BUT these"
        var forbiddenChars = new RegExp("[^a-zA-Z0-9\-]", 'g');
        if (forbiddenChars.test($(this).val())) {
            $(this).val($(this).val().replace(forbiddenChars, ''));
        }
    });


}

_LoginSNo_ = 1;
//_CITY_ = 'DEL';

var aircraftTypeSno = 0;
var uldcount = 0;
var processedawb = [];
var processeduld = [];
var flightroute = [];
var flightrouteStr = "";
var executedship = [];
var lastpoint = "";
var dailyflightsno = 0;
var __uldstocksno = -1;
var __uldno = "";
var savetype = "";
var quantity = [{ Key: "1", Text: "1" }, { Key: "2", Text: "2" }, { Key: "3", Text: "3" }, { Key: "4", Text: "4" }, { Key: "5", Text: "5" }, { Key: "6", Text: "6" }, { Key: "7", Text: "7" }, { Key: "8", Text: "8" }, { Key: "9", Text: "9" }, { Key: "10", Text: "10" }];
//var loadindicator = [{ Key: "1", Text: "LD" }, { Key: "2", Text: "MD" }];
//var uldLoadCode = [{ Key: "1", Text: "LD" }, { Key: "2", Text: "MD" }];
//var uldlocation = [{ Key: "1", Text: "LOC1" }, { Key: "2", Text: "LOC2" }, { Key: "3", Text: "LOC3" }, { Key: "4", Text: "LOC4" }];
var uldbuild = [{ Key: "1", Text: "CLEAN LOAD" }, { Key: "2", Text: "THROUGH LOAD" }, { Key: "3", Text: "MIXED LOAD" }];//Clean Load, Mixed Load, Through Load
//var OverhangDirection = [{ Key: "1", Text: "Left" }, { Key: "2", Text: "Right" }];
var OverhangDirection = [{ Key: "1", Text: "AFT" }, { Key: "2", Text: "FWD" }];
//var OverhangType = [{ Key: "1", Text: "Overlap" }, { Key: "2", Text: "Innerlap" }];
var OverhangType = [{ Key: "1", Text: "Aisle O/H" }, { Key: "2", Text: "Lateral O/H" }, { Key: "3", Text: "Lateral Loading" }];
var OverhangMesUnit = [{ Key: "1", Text: "Inch" }, { Key: "2", Text: "Cms" }, { Key: "3", Text: "Feet" }, { Key: "4", Text: "Meter" }];


var currentprocess = "";
var currentawbsno = 0;
var selecteddatasource = null;
var RemovedULDStockSNo = "";
var RetOdULDStockSNo = "";
var RemovedULDStcockSNoToLying = "";

function AssignTeamGrid() {
    var DailyFlightSNo = dailyflightsno;

    if (DailyFlightSNo != "") {
        DailyFlightSNo = dailyflightsno.split(',')[0];
    }

    $.ajax({
        url: "Services/Shipment/AssignTeamService.svc/AssignTeamTable",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            DailyFlightSNo: DailyFlightSNo, MovementTypeSNo: 2
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            var myData1 = jQuery.parseJSON(result)
            var GroupSNo = "*";
            var theDiv = document.getElementById("divShowLI");
            theDiv.innerHTML = "";
            var table = "<table class='appendGrid ui-widget' id='tblAssignTeamData'><thead class='ui-widget-header' style='text-align:center'>";
            table += "<tr><td colspan='6' class='ui-widget-header'>Flight No : <span id='spnFlightNo'>" + myData1.Table0[0].FlightNo + "</span></td><td colspan='6' class='ui-widget-header'>Flight Date  : <span id='spnFlightDate'>" + myData1.Table0[0].FlightDate + "</span></td></tr>";
            table += "<tr><td class='ui-widget-header'>AWB</td><td class='ui-widget-header'>Nature of Goods</td><td class='ui-widget-header'>No.Of Pcs</td><td class='ui-widget-header'>Gross Wt</td><td class='ui-widget-header'>Ori/Dest</td><td class='ui-widget-header'>Priority</td><td class='ui-widget-header'>Remarks</td><td class='ui-widget-header'>ULD Type/BULK</td><td class='ui-widget-header'>ULD Count</td><td class='ui-widget-header'>Group</td><td class='ui-widget-header'>Assign Team/Personnel</td><td class='ui-widget-header'>Time(Hrs)</td>";
            //table += "<td class='ui-widget-header'>Assign Team/Personnel</td><td class='ui-widget-header'>Time(Hrs)</td>";
            //table += "<td class='ui-widget-header'>Action</td>";
            //table += "</tr></thead><tbody class='ui-widget-content'>";
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    for (var i = 0; i < myData.Table0.length; i++) {
                        var tempType = (myData.Table0[i].ULDNoOrType == 'Select') ? '' : myData.Table0[i].ULDNoOrType;
                        if (GroupSNo != myData.Table0[i].ULDGroupNo && GroupSNo != "*")
                            table += "<tr><td style='height: 15px;'  colspan='12'></td></tr>";
                        table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].AWBNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].NatureOfGoods + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Pieces + "</td><td class='ui-widget-content first'>" + myData.Table0[i].GrossWeight + "</td><td class='ui-widget-content first'>" + myData.Table0[i].OriginAirportCode + "/" + myData.Table0[i].DestinationAirportCode + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Priority + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Remarks + "</td><td class='ui-widget-content first'>" + tempType + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ULDCount + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ULDGroupNo + "</td>";
                        table += "<td class='ui-widget-content first'>" + myData.Table0[i].AssignTeamTxt + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Time + "</td>";
                        //if (GroupSNo != myData.Table0[i].ULDGroupNo) {
                        //    table += "<td class='ui-widget-content first'><input name='AssignTeam" + myData.Table0[i].ULDGroupNo + "' id='AssignTeam" + myData.Table0[i].ULDGroupNo + "' type='hidden' value=''/>" + myData.Table0[i].ULDGroupNo + "</td><td class='ui-widget-content first'><input name='Time" + myData.Table0[i].ULDGroupNo + "' id='Time" + myData.Table0[i].ULDGroupNo + "' type='hidden' value=''/>"+ myData.Table0[i].ULDGroupNo + "</td><input name='HdnDailyFlightSNo" + myData.Table0[i].ULDGroupNo + "' id='HdnDailyFlightSNo" + myData.Table0[i].ULDGroupNo + "' type='hidden' value='" + myData.Table0[i].DailyFlightSNo + "'/></tr>";
                        //    //timeauto += "" + myData.Table0[i].ULDGroupNo + ",";
                        //    //employeSno += "" + myData.Table0[i].AssignTeam + "*";
                        //    //employeTxt += "" + myData.Table0[i].AssignTeamTxt + "*";
                        //    //timetxt += "" + myData.Table0[i].Time + "*";

                        //    //document.getElementById("hdnFlightNo").value = myData.Table0[i].FlightNo;
                        //    //document.getElementById("hdnFlightDate").value = myData.Table0[i].FlightDate;

                        //    //$("#hdnFlightNo").val(myData.Table0[i].FlightNo);
                        //    //$("#hdnFlightDate").val(myData.Table0[i].FlightDate);

                        //}
                        //else
                        //    table += "<td class='ui-widget-content first'></td><td class='ui-widget-content first'></td><td class='ui-widget-content first'></td></tr>";
                        GroupSNo = myData.Table0[i].ULDGroupNo;
                    }
                    table += "</tbody></table>";
                    theDiv.innerHTML += table;
                }
                else {
                    var table = "<table class='appendGrid ui-widget' id='tblAssignTeamData'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>No Record Found</td></tr></thead></table";
                    theDiv.innerHTML += table;
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
}
function ExtraCondition(textId) {

    var filterFlight = cfi.getFilter("AND");

    if (textId.indexOf("searchFlightNo") >= 0) {
        var filterFlt = cfi.getFilter("AND");

        cfi.setFilter(filterFlt, "FlightDate", "eq", cfi.CfiDate("searchFlightDate"));
        cfi.setFilter(filterFlt, "OriginAirport", "eq", User_CityCode);
        if (userContext.SysSetting.ICMSEnvironment.toString() == 'JT') {
            cfi.setFilter(filterFlt, "IsLoadingInstruction", "eq", 1);
        }
        filterFlight = cfi.autoCompleteFilter(filterFlt);
        return filterFlight;
    }
    else if (textId.indexOf("searchUldType") >= 0 && uldcount > 0) {
        var filteruld = cfi.getFilter("AND");

        filterFlight = cfi.autoCompleteFilter(filteruld);
        return filterFlight;
    }

    else if (textId.indexOf("searchULDNo") >= 0) {


        var filterAND = cfi.getFilter("AND");

        var flightCntrl = $("#Text_searchFlightNo").data("kendoAutoComplete");
        var FlightNo = flightCntrl.value();
        var CarrierCode = FlightNo.split('-')[0];
        var filterOR = cfi.getFilter("AND");
        var filterOR1 = cfi.getFilter("OR");
        //cfi.setFilter(filterAND, "AircraftType", "eq", $('span[id="Aircraft"]').text());
        // cfi.setFilter(filterAND, "ULDCity", "eq", _CityCode_);
        cfi.setFilter(filterAND, "CurrentAirportSNo", "eq", userContext.AirportSNo);
        cfi.setFilter(filterAND, "IsAvailable", "eq", "1");// Change By Manoj on 8.3.2016
        // cfi.setFilter(filterAND, "CarrierCode", "eq", CarrierCode);
        cfi.setFilter(filterAND, "CarrierCode", "in", GetPartnerCarrierCode(_PartAirline));
        cfi.setFilter(filterAND, "IsServiceable", "eq", "1");
        //cfi.setFilter(filterAND, "ContentType", "neq", "2");
        //cfi.setFilter(filterAND, "ContentType", "neq", "3");
        cfi.setFilter(filterAND, "BaggageType", "eq", 1)

        if (IsNarrowBodyAircraft == 1 && _ISFreighter == 'No') {
            /// cfi.setFilter(filterAND, "UldStockSNo", "eq", "0");
            cfi.setFilter(filterAND, "IsCart", "eq", userContext.SysSetting.IsShowCartInBuildUp);
        }


        /************Check Already Added ULD's*******************/
        if (AddedULD == "") {
            var vgrid_uld = cfi.GetCFGrid("divUldShipmentSection");
            if (vgrid_uld != undefined) {
                var datasource_uld = vgrid_uld.dataSource;
                var data_uld = datasource_uld.data();
                if (data_uld.length > 0) {
                    $.each(data_uld, function (i, item) {
                        AddedULD = item.ULDNo + "," + AddedULD;
                    });
                }
            }
        }
        /*****************************************/

        if (AddedULD != "" && AddedULD.split(',').indexOf("BULK") > -1) {
            var found = "yes";
        }
        else {
            cfi.setFilter(filterOR, "ULDNo", "eq", "BULK");
        }

        if (AddedULD != "") {
            for (var i = 0; i < AddedULD.split(',').length; i++) {
                if (AddedULD.split(',')[i] != "") {
                    cfi.setFilter(filterAND, "ULDNo", "neq", AddedULD.split(',')[i]);
                }
            }
        }

        var uldFilter = cfi.autoCompleteFilter([filterAND, filterOR], "OR");

        return uldFilter;

    }
    /*
    else if (textId.indexOf("searchULDNo") >= 0) {
        var filteruld = cfi.getFilter("AND");
        var filteruldBulk = cfi.getFilter("OR");
        //_CityCode_ = "DEL";
 
        var flightCntrl = $("#Text_searchFlightNo").data("kendoAutoComplete");
        var FlightNo = flightCntrl.value();
        var CarrierCode = FlightNo.split('-')[0];
 
        cfi.setFilter(filteruld, "AircraftTypeSNo", "eq", aircraftTypeSno);
        cfi.setFilter(filteruld, "ULDCity", "eq", _CityCode_);
        cfi.setFilter(filteruld, "CarrierCode", "eq", CarrierCode);
        //cfi.setFilter(filteruldBulk, "ULDNo", "eq", "BULK");
        ////cfi.setFilter(filteruld, "ULDNo", "neq", "BULK");
        ////cfi.setFilter(filteruld, "IsAvailable", "eq", 1);
        ////cfi.setFilter(filteruld, "ULDType", "eq", $("#Text_searchUldType").data("kendoAutoComplete").value());
        //var countryAutoCompleteFilter = cfi.autoCompleteFilter([filteruld, filteruldBulk]);
        ////var filterFlighttran = cfi.autoCompleteFilter(filteruld);
        ////filterFlighttran = cfi.autoCompleteFilter(filteruldBulk);
        //return countryAutoCompleteFilter;
        return filterFlight;
    }*/
    else if (textId.indexOf("ULDType") >= 0) {
        var filteruld = cfi.getFilter("AND");
        cfi.setFilter(filteruld, "ULDName", "neq", "BULK");
        filterFlight = cfi.autoCompleteFilter(filteruld);
        return filterFlight;
    }
    else if (textId.indexOf("ULDBuildUpLocation") >= 0) { //ULD Build Up Location
        var filterCondition = cfi.getFilter("AND");
        cfi.setFilter(filterCondition, "AirportSNo", "eq", userContext.AirportSNo);
        cfi.setFilter(filterCondition, "LocationTypeSNo", "eq", "7");
        filterFlight = cfi.autoCompleteFilter(filterCondition);
        return filterFlight;
    }
    else if (textId.indexOf("ULDLocation") >= 0) { //ULD Location
        var filterCondition = cfi.getFilter("AND");
        cfi.setFilter(filterCondition, "AirportSNo", "eq", userContext.AirportSNo);
        cfi.setFilter(filterCondition, "LocationTypeSNo", "eq", "8");
        filterFlight = cfi.autoCompleteFilter(filterCondition);
        return filterFlight;
    }
    else if (textId.indexOf("EquipmentID") >= 0) { //EquipmentID
        var EquipmentfilterAnd = cfi.getFilter("AND");
        var EquipmentfilterOR = cfi.getFilter("AND");
        cfi.setFilter(EquipmentfilterAnd, "UWS", "eq", "0");
        cfi.setFilter(EquipmentfilterAnd, "CityCode", "eq", userContext.CityCode);
        cfi.setFilter(EquipmentfilterOR, "EquipmentSNo", "eq", _EquipmentSNo);
        var EquipmentSNoFilter = cfi.autoCompleteFilter([EquipmentfilterAnd, EquipmentfilterOR], "OR");
        return EquipmentSNoFilter;
    }
    else if (textId.indexOf("_OtherPallets") >= 0) { //Other Pallets 
        if ($('#Text_UldBasePallet').data("kendoAutoComplete").value() == "") {
            ShowMessage('warning', 'Warning - ULD Build Details', "Please Select Base Pallet");
            var filterCondition = cfi.getFilter("AND");
            cfi.setFilter(filterCondition, "ULDNo", "eq", "#");
            filterFlight = cfi.autoCompleteFilter(filterCondition);
            return filterFlight;
        }
        else {
            var filterCondition = cfi.getFilter("AND");
            cfi.setFilter(filterCondition, "BaseULD", "in", $("#Text_UldBasePallet").data("kendoAutoComplete").key() + ',' + '0');
            //cfi.setFilter(cfi.getFilter("OR"), "BaseULD", "eq",0);
            cfi.setFilter(filterCondition, "ULDNo", "neq", $("#Text_UldBasePallet").data("kendoAutoComplete").value().trim());

            //var EquipmentfilterAnd = cfi.getFilter("AND");
            //var EquipmentfilterOR = cfi.getFilter("AND");
            //cfi.setFilter(EquipmentfilterAnd, "BaseULD", "eq", "0");
            //cfi.setFilter(EquipmentfilterAnd, "BaseULD", "eq", $("#Text_UldBasePallet").data("kendoAutoComplete").key());
            //cfi.setFilter(EquipmentfilterOR, "ULDNo", "neq", $("#Text_UldBasePallet").data("kendoAutoComplete").value().trim());
            //var filterCondition = cfi.autoCompleteFilter([EquipmentfilterAnd, EquipmentfilterOR], "OR");



            $('span.k-icon.k-delete').each(function (index, item) { // Allready Added in Db
                cfi.setFilter(filterCondition, "ULDNo", "neq", item.id);
            });
            var tempAdded = $('#_OtherPallets').val(); // Temp Added
            if (tempAdded != "") {
                var arr = tempAdded.split('=#=');
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] != "") {
                        cfi.setFilter(filterCondition, "ULDNo", "neq", arr[i]);
                    }
                }
            }

            filterFlight = cfi.autoCompleteFilter(filterCondition);
            return filterFlight;
        }
    }
    else if (textId.indexOf("Text_ConsumablesSNo") >= 0) {
        var currentIndex = textId.split('_')[2];
        var currentConsumableType;
        if (currentIndex == undefined) {
            currentConsumableType = "ConsumableType";
        }
        else {
            currentConsumableType = "ConsumableType_" + currentIndex;
        }
        var filterCondition = cfi.getFilter("AND");

        if ($("input[type='radio'][name='" + currentConsumableType + "']:checked").val() == "0")//Airline
        {
            cfi.setFilter(filterCondition, "Owner", "eq", "1");
            cfi.setFilter(filterCondition, "CarrierCode", "eq", $('span#FlightNo').text().split('-')[0]);
        }
        else if ($("input[type='radio'][name='" + currentConsumableType + "']:checked").val() == "1")//Self
        {
            cfi.setFilter(filterCondition, "Owner", "eq", "2");
            cfi.setFilter(filterCondition, "OwnerSno", "eq", "0");
        }

        cfi.setFilter(filterCondition, "CitySno", "eq", userContext.CitySNo);

        filterFlight = cfi.autoCompleteFilter(filterCondition);
        return filterFlight;

    }
    else if (textId.indexOf("AWBOffPoint") >= 0 || textId.indexOf("offloadPoint") >= 0) { // Shipment Off Point 
        var filterFlt = cfi.getFilter("AND");

        cfi.setFilter(filterFlt, "GroupFlightSNo", "eq", $('#searchFlightNo').val());
        cfi.setFilter(filterFlt, "OriginAirportCode", "eq", userContext.AirportCode);

        filterFlight = cfi.autoCompleteFilter(filterFlt);

        return filterFlight;
    }
    else if (textId.indexOf("BuildUPULDSHC") >= 0) { //BuildUPULDSHC

        GetExpandedSHC(); // Get Expanded ULD SHC's 

        if (LstULDSPH != null && LstULDSPH.length > 0) {

            var get_SHc = GetULDSHC();

            var filterFlt = cfi.getFilter("OR");
            $.each(LstULDSPH, function (index, item) {

                if (get_SHc.indexOf(item.Key) == -1) {
                    cfi.setFilter(filterFlt, "Code", "eq", item.Key);
                }
            });

            cfi.setFilter(filterFlt, "Code", "eq", "1"); // Add OR condition to prevent all SHC

            var SHCOR = cfi.getFilter("AND");


            if (get_SHc != "") {
                var arrSHC = get_SHc.split(',');
                $.each(arrSHC, function (index, item) {
                    cfi.setFilter(SHCOR, "Code", "neq", item);
                });
            }

            filterFlight = cfi.autoCompleteFilter([filterFlt, SHCOR], "AND");
            return filterFlight;
        }
        else {
            var filterFlt = cfi.getFilter("AND");
            cfi.setFilter(filterFlt, "Code", "eq", "#");
            filterFlight = cfi.autoCompleteFilter(filterFlt);
            return filterFlight;
        }
    }
    //added for AssignEquipmentBulk

    else if (textId.indexOf("tblAssignEquipmentPopUp_AWBNo_") >= 0) { // AWB for Assign equipment 
        var filterFlt = cfi.getFilter("AND");
        cfi.setFilter(filterFlt, "DailyFlightSNo", "in", dailyflightsno);
        cfi.setFilter(filterFlt, "UldStockSNo", "eq", 0);
        filterFlight = cfi.autoCompleteFilter(filterFlt);
        return filterFlight;
    }
    else if (textId.indexOf("tblAssignEquipmentPopUp_EquipmentNo") >= 0) { // AWB for Assign equipment 
        var filterFlt = cfi.getFilter("AND");
        cfi.setFilter(filterFlt, "IsAvailable", "eq", 1);
        cfi.setFilter(filterFlt, "CityCode", "eq", userContext.CityCode);
        filterFlight = cfi.autoCompleteFilter(filterFlt);
        return filterFlight;
    }
    else if (textId.indexOf("Offpoint_") >= 0) { // AWB for Assign equipment 
        var filterFlt = cfi.getFilter("AND");
        //var groupflightsno = $("#Text_txtFlightNoAssignEquipmentFlightPopUp").data("kendoAutoComplete").key().split('-')[1];
        //cfi.setFilter(filterFlt, "GroupFlightSNo", "eq", groupflightsno);
        //cfi.setFilter(filterFlt, "OriginAirportCode", "eq", userContext.AirportCode);

        //filterFlight = cfi.autoCompleteFilter(filterFlt);

        //return filterFlight;
        cfi.setFilter(filterFlt, "GroupFlightSNo", "eq", $('#searchFlightNo').val());
        cfi.setFilter(filterFlt, "OriginAirportCode", "eq", userContext.AirportCode);

        filterFlight = cfi.autoCompleteFilter(filterFlt);

        return filterFlight;

    }

    else if (textId.indexOf("ConnectingFlight") >= 0) { // AWB for Assign equipment 
        var filterFlt = cfi.getFilter("AND");

        cfi.setFilter(filterFlt, "AWBSNo", "eq", textId.split('_')[3].toString());
        filterFlight = cfi.autoCompleteFilter(filterFlt);
        return filterFlight;

    }

    // end
}

function ValidateBasePallet() {
    if ($('#Text_UldBupType').data("kendoAutoComplete").value() == "" && $('#Text_UldBasePallet').data("kendoAutoComplete").value() != "") {
        $('#Text_UldBasePallet').data("kendoAutoComplete").value('');
        $('#Text_UldBasePallet').data("kendoAutoComplete").key('');
        ShowMessage('warning', 'Warning - ULD Build Details', "Please Select BUP Type");
    }
    if ($('#Text_UldBupType').data("kendoAutoComplete").value() == "" || $('#Text_UldBasePallet').data("kendoAutoComplete").value() == "") {
        $('#divMulti_OtherPallets li').remove();
        $('#_OtherPallets').val();
    }
}
function ValidateBUPType() {
    if ($('#Text_UldBupType').data("kendoAutoComplete").value() == "" && $('#Text_UldBasePallet').data("kendoAutoComplete").value() != "") {
        $('#Text_UldBasePallet').data("kendoAutoComplete").value('');
        $('#Text_UldBasePallet').data("kendoAutoComplete").key('');
    }
    if ($('#Text_UldBupType').data("kendoAutoComplete").value() == "" || $('#Text_UldBasePallet').data("kendoAutoComplete").value() == "") {
        $('#divMulti_OtherPallets li').remove();
        $('#_OtherPallets').val();
    }
}


function ResetSearch(obj) {
    cfi.ResetAutoComplete("searchFlightNo");
    CleanUI();
}

function ResetSearchByFlight(obj) {
    CleanUI();
    //Added By Brajendra for unlock flight when user cancel buildup 
    SaveUpdateLockedProcess(0, $("#searchFlightNo").val(), "", "", userContext.UserSNo, 30, "", "", "");

}

function CleanUI() {
    $("#divShipmentDetails").html("");
    $("#divNewBooking").html("");
    $("#btnSave").unbind("click");
    aircraftTypeSno = 0;
    uldcount = 0;
    processedawb = [];
    processeduld = [];
    flightroute = [];
    executedship = [];
    lastpoint = "";
    dailyflightsno = 0;
    __uldstocksno = -1;
    __uldno = "";
    savetype = "";
    arrSPHCList = [];
    arrAircraftCapacityList = [];

}

function BuildupSearch() {
    //  $('#btnSave').attr("disabled", true);
    signalR.startHub();
    //ClientEnv = userContext.SysSetting.ICMSEnvironment;;

    AddedULD = "";
    CleanUI();
    $("#UldAdd").hide();
    var flightCntrl = $("#Text_searchFlightNo").data("kendoAutoComplete");
    dailyflightsno = flightCntrl.key();
    var FlightNo = flightCntrl.value() == "" ? "A~A" : flightCntrl.value();
    var FlightDate = "0";
    if ($("#searchFlightDate").val() != "") {
        FlightDate = cfi.CfiDate("searchFlightDate");// "";//month + "-" + day + "-" + year;
    }
    if (FlightDate == "0" && FlightNo == "A~A") {
        ShowMessage('warning', 'Warning - Build-Up Search', "Please select Flight Date & Flight No.", "bottom-right");
        return;
    }
    if (FlightDate == "0") {
        ShowMessage('warning', 'Warning - Build-Up Search', "Please select Flight Date", "bottom-right");
        return;
    }
    else if (FlightNo == "A~A") {
        ShowMessage('warning', 'Warning - Build-Up Search', "Please select Flight No.", "bottom-right");
        return;
    }

    /*************Check Flight No is Valid/Exist*********/
    if ($("#Text_searchFlightNo").data("kendoAutoComplete").key() == "") {
        var message = CheckFlight();
        if (message != "Exists") {
            ShowMessage('warning', 'Warning - Build-Up Search', message, "bottom-right");
            $('#Text_searchFlightNo').data("kendoAutoComplete").key('');
            $('#Text_searchFlightNo').data("kendoAutoComplete").value('');
            return;
        }
    }
    /**************************************************/

    $("#imgprocessing").show();
    signalR.userEnterInProcess({ GroupFlightSNo: dailyflightsno, ProcessSNo: 30, EventType: 'OPEN' });

    $.ajax({
        url: "Services/BuildUp/BuildUpService.svc/GetWebForm",///FlightDetails/FlightDetails/FlightDetails/New/1",
        type: "POST",
        cache: false,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ model: { processName: "FlightDetails", moduleName: "FlightDetails", appName: "FlightDetails", Action: "New", IsSubModule: "1" } }),
        success: function (result) {
            databind = true;
            $("#divShipmentDetails").html(result);
            GetBuildUpDetails();

            validateManifasteddata();
            //if (IsNarrowBodyAircraft == 1)
            //    ShowMessage('warning', 'Warning - Build-Up Search', "ULD can not be loaded on Narrow Body Aircraft.", "bottom-right");
        }
    });
    //  $('#btnSave').attr("disabled", true);




}


var IsNarrowBodyAircraft = 0;
function GetBuildUpDetails() {

    aircraftTypeSno = 0;
    uldcount = 0;

    $("#btnSave").unbind("click").bind("click", function () {


        var vgrid = cfi.GetCFGrid("divUldShipmentSection");
        vgrid.options.parentValue.toString()

        var IsULDNoExists = false;
        $.each(vgrid._data, function (i, item_Data) {
            if (item_Data.ULDStockSNo > 0) {
                IsULDNoExists = true;
                return false;
            }
        });

        $.each(vgrid._data, function (i, item_Data) {
            if (item_Data.ULDNo != "BULK") {
                IsCartStatus = (item_Data.IsCart == "true" || item_Data.IsCart == "1") ? "1" : "0";
                return false;
            }
        });

        if (IsNarrowBodyAircraft == 1 && IsULDNoExists == true && IsCartStatus == 0 && _ISFreighter == 'No') {
            var IsNarrow = confirm("All ULD will be offloaded, Are you sure to save buildup ?");
            if (!IsNarrow) return false;
        }




        SaveBuildUpPlan();

        //Added By Brajendra for unlock flight when user save buildup 
        SaveUpdateLockedProcess(0, $("#searchFlightNo").val(), "", "", userContext.UserSNo, 30, "", "", "");

    });

    $.ajax({
        url: "Services/BuildUp/BuildUpProcessService.svc/GetBuildUpFlightDetails",
        async: true,
        type: "POST",
        dataType: "json",
        cache: false,

        data: JSON.stringify({ DailyFlightSNo: dailyflightsno, City: _CityCode_, AirlineSNo: userContext.AirlineSNo, UserSNo: userContext.UserSNo, FlightDate: $('#searchFlightDate').val(), AirportSNo: userContext.AirportSNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var flightData = jQuery.parseJSON(result);
            var routeDetail = flightData.Table0;
            var lastPointDetail = flightData.Table1;
            var flightDetail = flightData.Table2;
            var ULDCapacity = flightData.Table3;
            var AircraftCodeClassification = flightData.Table4;
            var dtFlightNextDestination = flightData.Table5;
            var PartAirline = flightData.Table6;
            var CheckBuilUpStartTime = flightData.Table7[0];

            /*------------------------------------------------------------------------*/
            if (dtFlightNextDestination.length > 0) {
                FlightNextDestination = dtFlightNextDestination[0].FlightNextDestination;
                IsFlightPremanifested = dtFlightNextDestination[0].IsFlightPremanifested;
                IsFlightManifested = dtFlightNextDestination[0].IsFlightManifested;
            }

            validateManifasteddata();
            /*-------------Get Partner Airline-----------------------------------------------*/
            if (PartAirline.length > 0) {
                _PartAirline = PartAirline[0].PartAirline;
            }
            /*------------------------------------------------------------------------*/
            flightrouteStr = "";
            var out = '[';
            $.each(routeDetail, function (i, item) {
                if (item) {
                    if (parseInt(i) > 0) {
                        out = out + ',{ Key: "' + routeDetail[i].City + '", Text: "' + routeDetail[i].City + '"}'
                        flightrouteStr += (flightrouteStr == "" ? "" : ",") + routeDetail[i].City;
                    }
                    else {
                        out = out + '{ Key: "' + routeDetail[i].City + '", Text: "' + routeDetail[i].City + '"}'
                        flightrouteStr += (flightrouteStr == "" ? "" : ",") + routeDetail[i].City;
                    }
                }
            });

            out = out + ']';
            flightroute = eval(out);
            lastpoint = lastPointDetail[0].CITY;
            if (flightDetail.length > 0) {
                $("input[type='hidden'][id='FlightNo']").val(flightDetail[0].SNo);
                $("input[type='hidden'][id='FlightDate']").val($("#searchFlightDate").val());
                $("input[type='hidden'][id='Origin']").val(flightDetail[0].Origin);
                $("input[type='hidden'][id='Destination']").val(flightDetail[0].Destination);
                $("input[type='hidden'][id='ETD']").val(flightDetail[0].ETD);
                $("input[type='hidden'][id='ETA']").val(flightDetail[0].ETA);
                $("input[type='hidden'][id='Aircraft']").val(flightDetail[0].AircraftTypeSNo);

                $("span[id='FlightNo']").text(flightDetail[0].FlightNo);
                $("span[id='FlightDate']").text($("#searchFlightDate").val());
                $("span[id='Origin']").text(flightDetail[0].Origin);
                $("span[id='Destination']").text(flightDetail[0].Destination);
                $("span[id='ETD']").text(flightDetail[0].ETD);
                $("span[id='ETA']").text(flightDetail[0].ETA);
                $("span[id='Aircraft']").text(flightDetail[0].Aircraft.toUpperCase());
                $("#RegistrationNo").val(flightDetail[0].RegistrationNo);
                aircraftTypeSno = flightDetail[0].AircraftTypeSNo;
                uldcount = flightDetail[0].ULDCount;
                IsNarrowBodyAircraft = flightDetail[0].IsNarrowBodyAircraft

                /*************Get Saved ULD Capacity***********************/
                arrULDCapacity = [];
                $(ULDCapacity).each(function (index, item) {
                    var arr = {
                        SPHCCode: item.SPHCCode,
                        GrossWeight: item.GrossWeight,
                        ULDStockSNo: item.ULDStockSNo
                    };
                    arrULDCapacity.push(arr);
                });
                arrULDCapacity_Final = arrULDCapacity;

                /*************Check Aircraft CodeClassification************/
                if (AircraftCodeClassification != undefined && AircraftCodeClassification.length > 0) {
                    _ISPAX = AircraftCodeClassification[0].IsPAX;
                    _ISFreighter = AircraftCodeClassification[0].IsFreighter;
                }
            }
            if (CheckBuilUpStartTime.CheckBuilUpStartTime != 'UA') {
                ShowMessage('warning', '', CheckBuilUpStartTime.CheckBuilUpStartTime + ' ' + CheckBuilUpStartTime.Hours + ' before ETD of this flight!', "bottom-right");
                $('#btnSave').hide();
                $('#btnCancel').hide();
                $('#divFlightSection').hide();
                $('#divShipmentDetails').hide();
                return;

            } else {
                AppendBuildUpBody()
            }
        }

    });




}
function AppendBuildUpBody() {
    var divUldShipmentSection = {
        processName: _CURR_PRO_,
        moduleName: 'BuildupULD',
        appName: 'SEARCHBUILDUPULD',
        DailyFlightSNo: dailyflightsno
    }

    $.ajax({
        url: "Services/BuildUp/BuildUpService.svc/GetWebForm",//ADDULD/AddUld/AddUld/New/1",
        async: false,
        type: "POST",
        cache: false,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ model: { processName: "ADDULD", moduleName: "AddUld", appName: "AddUld", Action: "New", IsSubModule: "1" } }),

        success: function (result) {
            databind = true;
            $("#divAddUldShipmentSection").html(result);

            //cfi.ShowIndexView("divUldShipmentSection", "Services/BuildUp/BuildUpService.svc/GetBuildupULDGridData/" + _CURR_PRO_ + "/BuildupULD/SEARCHBUILDUPULD/" + dailyflightsno);
            //cfi.ShowIndexView("divNonUldShipmentSection", "Services/BuildUp/BuildUpService.svc/GetBuildupGridData/" + _CURR_PRO_ + "/Buildup/SEARCHBUILDUP/" + dailyflightsno);


            cfi.ShowIndexViewV2("divUldShipmentSection", "Services/BuildUp/BuildUpService.svc/GetBuildupULDGridData", divUldShipmentSection);


            cfi.ShowIndexViewV2("divNonUldShipmentSection", "Services/BuildUp/BuildUpService.svc/GetBuildupGridData", { processName: _CURR_PRO_, moduleName: "Buildup", appName: "SEARCHBUILDUP", DailyFlightSNo: dailyflightsno });

            //Show Loading Instruction
            $("#__tbladduld__ tbody tr td:eq(1)").after("<td class='formtwolabel' title=''><input type='button' class='btn btn-block btn-success btn-sm' name='OffLoadedULD' id='OffLoadedULD' style='width:160px;display:none;' value='Off-Loaded ULDs/Carts'></td><td class='formtwolabel' title=''><input type='button' class='btn btn-block btn-success btn-sm' name='ShowLI' id='ShowLI' style='width:160px;' value='Show Loading Instruction'></td>");
            $("#__tbladduld__ tbody tr td:eq(4)").remove();

            //$("#__tbladduld__ tbody tr td:eq(1)").after("<td class='formtwolabel' title=''><input type='button' class='btn btn-block btn-success btn-sm' name='ShowLI' id='ShowLI' style='width:160px;' value='Show Loading Instruction'></td>");
            //$("#__tbladduld__ tbody tr td:eq(3)").remove();

            $("#divShipmentDetails").find("input[type='button'][id='AddUld']").unbind("click").bind("click", function () {
                AddULD();
            });
            InstantiateControl("divAddUldSection");



            var dataSource = GetDataSource("searchUldType", "BuildUp_searchUldTypeByGetDataSource");
            cfi.ChangeAutoCompleteDataSource("searchUldType", dataSource, true, ResetULDNo, "ULDName", "contains");

            var udataSource = GetDataSource("searchULDNo", "BuildUp_searchULDNoByGetDataSource");
            cfi.ChangeAutoCompleteDataSource("searchULDNo", udataSource, false, SelectULDNo, "ULDNo", "contains");

            $('#AddUld').hide();

            $("#RegistrationNo").attr("tabindex", "1000");

            $('#Text_searchULDNo').attr("need-focus", true);

            $("#divShipmentMoveSection").find("img").each(function () {
                if ($(this).attr("id") == "btnMoveToUld") {
                    $(this).unbind("click").bind("click", function () {
                        MoveToUld();
                    });
                }
                else if ($(this).attr("id") == "btnMoveFromUld") {
                    $(this).unbind("click").bind("click", function () {
                        MoveFromUld();
                    });
                }
            });
            divShipmentMoveSectionFloatingImage();
            $("span[data-action='fromuldmove']").unbind("click").bind("click", function () {
                MoveFromUld();
            });
            $("span[data-action='touldmove']").unbind("click").bind("click", function () {
                MoveToUld();
            });

            BindKendoTab();
        }
    });


    $.ajax({
        url: "Services/BuildUp/BuildUpService.svc/GetWebForm",//LyingListSearch/LyingListSearch/LyingListSearch/Search/1",
        async: true,
        type: "POST",
        cache: false,
        contentType: "application/json; charset=utf-8",

        data: JSON.stringify({ model: { processName: "LyingListSearch", moduleName: "LyingListSearch", appName: "LyingListSearch", Action: "Search", IsSubModule: "1" } }),
        success: function (result) {
            $("#divLyingListSearchSection").html(result);
            $("#divLyingListSearchSection").find("table[cfi-aria-search='search']").css("width", "100%");
            $("#divLyingListSearchSection").find("table[cfi-aria-search='search']").find("button[id='btnSearch']").each(function () {
                $(this).unbind("click").bind("click", function () {
                    ShowLyingListShipment();
                });
            });


        }
    });

    $('[id^=Text_offloadPoint]').keypress(function (event) {

        if (event.keyCode === 10 || event.keyCode === 13) {
            event.preventDefault();
        }
    });


    validateManifasteddata();

}


function validateManifasteddata() {
    if (IsFlightManifested == "True") {
        if (userContext.SysSetting.IsShowOffLoadedULD == "True") {
            $('#OffLoadedULD').hide();
            $('#Text_searchULDNo').attr('disabled', 'disabled');
            $('#btnSave').attr("disabled", true);
        }
    } else {
        if (userContext.SysSetting.IsShowOffLoadedULD == "True") {
            $('#OffLoadedULD').show();
            $('#Text_searchULDNo').removeAttr('disabled');
            $('#btnSave').attr("disabled", false);
        }
    }
}


function SetNumericOnly(Piece_ID) {

    $('input[type="text"][id="' + Piece_ID + '"]').keydown(function (e) {
        if (e.shiftKey || e.ctrlKey || e.altKey) {
            e.preventDefault();
        } else {
            var key = e.keyCode;
            if (!((key == 8) || (key == 46) || (key >= 35 && key <= 40) || (key >= 48 && key <= 57) || (key >= 96 && key <= 105))) {
                e.preventDefault();
            }
        }
    });

    $('input[type="text"][id="txtGross"],[id="txtVol"],[id="txtLGross"],[id="txtLVol"]').keypress(function (event) {
        var $this = $(this);
        if ((event.which != 46 || $this.val().indexOf('.') != -1) &&
            ((event.which < 48 || event.which > 57) &&
                (event.which != 0 && event.which != 8))) {
            event.preventDefault();
        }

        var text = $(this).val();
        if ((event.which == 46) && (text.indexOf('.') == -1)) {
            setTimeout(function () {
                if ($this.val().substring($this.val().indexOf('.')).length > 3) {
                    $this.val($this.val().substring(0, $this.val().indexOf('.') + 3));
                }
            }, 1);
        }

        if ((text.indexOf('.') != -1) &&
            (text.substring(text.indexOf('.')).length > 2) &&
            (event.which != 0 && event.which != 8) &&
            ($(this)[0].selectionStart >= text.length - 2)) {
            event.preventDefault();
        }
    });
}

function SelectULDNo(txtId, txt, keyId, key) {
    if (txtId == "Text_searchULDNo" && txt != "" && key != "") {
        AddULD(key, txt);
    }
}

function ResetULDNo(txtId, txt, keyId, key) {
    cfi.ResetAutoComplete("searchULDNo");
}

function ShowOffloadedShipment() {
    var divUldShipmentSection = {
        processName: _CURR_PRO_,
        moduleName: 'BuildupULD',
        appName: 'SEARCHBUILDUPOFFLOADEDULD',
        DailyFlightSNo: dailyflightsno
    }

    cfi.ShowIndexViewV2("divOffloadedULD", "Services/BuildUp/BuildUpService.svc/GetBuildupULDGridData", divUldShipmentSection);


}


function ShowLyingListShipment() {
    var org = $("#LyingOriginCity").val();
    var dest = $("#LyingDestinationCity").val();
    var flight = $("#LyingFlightNo").val();
    var awb = $("#LyingAWBNo").val();
    var date = cfi.CfiDate("LyingFlightDate");
    var flightCntrl = $("#Text_searchFlightNo").data("kendoAutoComplete");
    dailyflightsno = flightCntrl.key();

    if (org == "")
        org = "A~A";
    if (dest == "")
        dest = "A~A";
    if (flight == "") {
        var FlightNo = $.trim(flightCntrl.value()) + "_A~A";
        flight = $.trim(FlightNo);
    }
    else {
        var FlightNo = $.trim(flightCntrl.value()) + "_" + flight;
        flight = $.trim(FlightNo);
    }
    if (awb == "")
        awb = "A~A";
    if (date == "")
        date = "0";

    //cfi.ShowIndexView("divLyingListSection", "Services/BuildUp/BuildUpService.svc/GetLyingListGridData/" + _CURR_PRO_ + "/Buildup/SEARCHLYINGLIST/" + org + "/" + dest + "/" + flight + "/" + date + "/" + awb + "/" + userContext.AirportCode);



    cfi.ShowIndexViewV2("divLyingListSection", "Services/BuildUp/BuildUpService.svc/GetLyingListGridData", { processName: _CURR_PRO_, moduleName: "Buildup", appName: "SEARCHLYINGLIST", Origin: org, Destination: dest, FlightNo: flight, FlightDate: date, AWBNo: awb, LoggedInCity: userContext.AirportCode, DailyFlightSNo: dailyflightsno });


}


function AddULD(U_uldstocksno, U_uldno) {

    //var uldstocksno = $("#Text_searchULDNo").data("kendoAutoComplete").key();
    //var uldno = $("#Text_searchULDNo").data("kendoAutoComplete").value();

    var uldstocksno = U_uldstocksno, uldno = U_uldno;

    /*Check and Locked AWB Coded By Brajendra On Aug-16-2017*/
    var msg = GetAWBLockedEvent(userContext.UserSNo, 0, 0, "", "", uldno, "30");
    if (msg == "Fail") { return false };

    SaveUpdateLockedProcess(0, "", "", "", userContext.UserSNo, "31", 'FlightBuildUp', 1, uldno);
    /*End*/

    if (uldstocksno == "" || uldno == "") {
        ShowMessage('warning', 'Warning - ADD ULD', "Select ULD Number.", "bottom-right");
        return;
    }
    var vgrid = cfi.GetCFGrid("divUldShipmentSection");
    if (vgrid != undefined) {
        var datasource = vgrid.dataSource;
        var data = datasource.data();

        var existingdata = $.grep(data, function (e, index) {
            return e.ULDStockSNo == uldstocksno;
        });
        if (existingdata.length > 0) {
            if (uldno == "BULK") {
                ShowMessage('warning', 'Warning - ADD ULD', "Bulk details already exist in ULD/Bulk details section.", "bottom-right");
            }
            else {
                ShowMessage('warning', 'Warning - ADD ULD', "Already exists in ULD/Bulk details section.", "bottom-right");
            }
            $("#Text_searchULDNo").data("kendoAutoComplete").value("");
            return;
        }
        processeduld.push(uldstocksno);

        var _groupflightsno = $("#Text_searchFlightNo").data("kendoAutoComplete").key();

        $.ajax({
            url: "Services/BuildUp/BuildUpProcessService.svc/GetULDDetails?ULDStockSNo=" + uldstocksno + "&GroupFlightSNo=" + _groupflightsno, async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var uldData = jQuery.parseJSON(result);
                var uldDetail = uldData.Table0;
                var arrSPHC = [];
                arrSPHC = uldData.Table1;

                if (uldDetail.length > 0) {
                    var ULDModel = {
                        ULDStockSNo: (uldno.toUpperCase() == "BULK" ? 0 : uldstocksno),
                        Pieces: 0,
                        MaxVolumeWeight: (uldno.toUpperCase() == "BULK" ? 0 : uldDetail[0].VolumeWeight),
                        MaxGrossWeight: (uldno.toUpperCase() == "BULK" ? 0 : uldDetail[0].GrossWeight),
                        EmptyWeight: (uldno.toUpperCase() == "BULK" ? 0 : uldDetail[0].EmptyWeight),
                        ULDWeight: (uldno.toUpperCase() == "BULK" ? "" : uldDetail[0].EmptyWeight + " / " + uldDetail[0].GrossWeight + " / " + uldDetail[0].VolumeWeight),
                        ULDNo: (uldno.toUpperCase() == "BULK" ? "BULK" : uldno),
                        GrossWeight: 0,
                        VolumeWeight: 0,
                        Used: "",
                        FlightNo: $("span[id='FlightNo']").text(),
                        FlightDate: cfi.CfiDate("FlightDate"),
                        OriginCity: _CITY_ + "/" + uldDetail[0].IsCart,
                        SNo: uldDetail[0].SNo,
                        Status: uldDetail[0].Status,
                        Shipments: 0,
                        LastPoint: "",
                        ULDStatus: uldDetail[0].ULDStatus,
                        IsUWS: "False", //added for AssignEquipmentBulk
                        SHC: uldDetail[0].SHC,
                        CBM: 0,
                        ShipmentId: 'UnPlanned_' + (uldno.toUpperCase() == "BULK" ? 0 : uldstocksno) + '_' + (uldno.toUpperCase() == "BULK" ? 0 : uldstocksno),
                        Priority: "",
                        Action: "",
                        IsCart: uldDetail[0].isCart,
                        FlightStatus: ""

                    }
                    ///********************Check SPHC Compatibility**********************/
                    if (arrSPHC.length > 0) {
                        var isExist = false;
                        for (i = 0; i < arrSPHCList.length; i++) {
                            var currentULD = arrSPHCList[i].ULDNo;
                            if (currentULD == uldno.toUpperCase().trim()) {
                                isExist = true;
                                break;
                            }
                        }
                        if (isExist == false) {
                            $(arrSPHC).each(function (index, item) {
                                var arr = {
                                    ULDNo: item.ULDNo,
                                    UldTypeName: item.UldTypeName,
                                    SPHC1: item.SPHC1,
                                    SPHC2: item.SPHC2,
                                    ULDStockSNo: item.ULDStockSNo
                                }
                                arrSPHCList.push(arr);
                            });
                        }
                    }
                    ///**********************************************************************/
                    if (ULDModel.ULDNo == "BULK" || ULDModel.IsCart == "1" || ULDModel.IsCart == "true") {
                        datasource.insert(ULDModel, null, 0);
                    }
                    else {
                        var IsBulkAdded = false;
                        var AddedData = datasource.data();
                        $.each(AddedData, function (index, item) {
                            if (item.ULDNo == "BULK" || ULDModel.IsCart == "1" || ULDModel.IsCart == "true") {
                                IsBulkAdded = true;
                                return false;
                            }
                        });
                        if (IsBulkAdded) {
                            datasource.insert(ULDModel, null, 1);
                        }
                        else {
                            datasource.insert(ULDModel, null, 0);
                        }
                    }


                    AttachEventForULD("ADDULD", uldstocksno, ULDModel.IsCart);
                    if (uldno.toUpperCase() == "BULK")
                        ShowMessage('success', 'Success - ADD BULK', "BULK added successfully.", "bottom-right");
                    else {

                        ShowMessage('success', 'Success - ADD ' + (ULDModel.IsCart == "0" ? " ULD " : " CART "), "Selected " + (ULDModel.IsCart == "0" ? " ULD " : " CART " + uldno) + " added successfully.", "bottom-right");
                    }
                    $('[id^= "UnPlanned"]').hide();
                    AddedULD = $("#Text_searchULDNo").data("kendoAutoComplete").value() + "," + AddedULD;
                    $("#Text_searchULDNo").data("kendoAutoComplete").value("");
                }

            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - ADD' + (ULDModel.IsCart == "0" ? " ULD " : " CART "), "Unable to process.", "bottom-right");
                return;

            }
        });
    }


    CheckCollepsRow = 0;
}

function SortDatasource(datasource) {
    $(datasource).each(function () {

    });
}

function removeValue(value) {
    if (AddedULD != null && AddedULD.length > 0) {
        var list = AddedULD;
        AddedULD = list.replace(new RegExp(",?" + value + ",?"), function (match) {
            var first_comma = match.charAt(0) === ',',
                second_comma;

            if (first_comma &&
                (second_comma = match.charAt(match.length - 1) === ',')) {
                return ',';
            }
            return '';
        });
    }
}

function AttachEventForULD(AccessFrom, uldsno, IsCart) {
    if (LoadPopUPStatus)
        return;

    if (uldsno == undefined && IsFlightPremanifested == "True") { //Get Only First Time
        GetSavedULD();
    }

    //$("#divUldShipmentSection").find(".k-grid-content:eq(0)").find("tr").each(function () {
    $("#divUldShipmentSection").find("tr").each(function () {
        $(this).find("input[type='radio']").each(function () {
            $(this).closest("td").addClass("k-hierarchy-cell");
            $(this).addClass("k-plus");
        });
        $(this).find("a.removed").unbind("click").bind("click", function () {
            RemoveULD(this);
        })
        $(this).find("a.closed").unbind("click").bind("click", function () {
            __uldstocksno = $(this).closest("tr.k-master-row").find("td:eq(2)").text(),
                __uldno = $(this).closest("tr.k-master-row").find("td:eq(3)").text(),
                //ShowULDDetails(this, "C");
                ExpandSelectedULD(this);
            ShowULDDetails(this, "D", "Closed");
        })
        $(this).find("a.details").unbind("click").bind("click", function () {
            __uldstocksno = $(this).closest("tr.k-master-row").find("td:eq(2)").text(),
                __uldno = $(this).closest("tr.k-master-row").find("td:eq(3)").text(),
                ExpandSelectedULD(this);
            ShowULDDetails(this, "D", "Details");
        })

        //**************For BUP Shipment**********************/
        var IsBUP = $(this).closest("tr.k-master-row").find("td:eq(16)").text();
        if (IsBUP == "1") {
            $(this).css('background', '#BEF781');
        }
        //*****************************************************//
    });
    $("#divUldShipmentSection").find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
        var controlId = $(this).attr("id");
        var value = $("#" + controlId.replace("Text_", "")).val();
        //cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), flightroute, null, null);

        //Commented Old Autocomplete cfi.AutoComplete(controlId.replace("Text_", ""), "DestinationAirportCode", "vBuildupOffPoint", "DestinationAirportCode", "DestinationAirportCode", null, null, "contains");
        // if ($('#' + controlId).data("kendoAutoComplete") == undefined)
        cfi.AutoComplete(controlId.replace("Text_", ""), "DestinationAirportCode", "BuildUp_OffPoint", null, "contains");


        //if (controlId.indexOf("ConnectingFlight") >= 0)

        //Below lines commented by brajendra on request of Abhishek for blank uld offpoint, user has  to set offpoint on 4-Nov-2017
        //if (value == "")
        //    //$("#" + controlId).data("kendoAutoComplete").setDefaultValue(lastpoint, lastpoint);
        //    $("#" + controlId).data("kendoAutoComplete").setDefaultValue(FlightNextDestination, FlightNextDestination);
        //else
        //    $("#" + controlId).data("kendoAutoComplete").setDefaultValue(value, value);
        var IsBUP = $(this).closest("tr.k-master-row").find("td:eq(17)").text();


        if (IsFlightPremanifested == "True" && CheckULDExists(controlId.split('_')[2])) {
            $("#" + controlId).data("kendoAutoComplete").enable(false);
        }
        else {
            $("#" + controlId).data("kendoAutoComplete").enable(true);
        }

    });



    //if ($("#Text_offloadPoint_0").length > 0) // Hide Off Point From BULK as ULD
    //{
    //    $("#Text_offloadPoint_0").closest('span').hide();
    //    $("#Text_offloadPoint_0").hide();
    //}
    //if ($("#Text_offloadPoint_" + uldsno).length > 0 && IsCart == "1") // Hide Off Point From BULK as ULD
    //{
    //    $("#Text_offloadPoint_" + uldsno).closest('span').hide();
    //    $("#Text_offloadPoint_" + uldsno).hide();
    //}

    var trHeader = $("div#divUldShipmentSection").find(".k-grid-header").find("tr[role='row']");
    var uldstocksnoindex = -1;
    var isCartindex = -1;

    uldstocksnoindex = trHeader.find("th[data-field='ULDStockSNo']").index();
    isCartindex = trHeader.find("th[data-field='IsCart']").index();

    $("#divUldShipmentSection").find("tr.k-master-row").each(function () {
        var uldStockSNo = $(this).find("td:eq(" + uldstocksnoindex + ")").text();
        var IsCart = $(this).find("td:eq(" + isCartindex + ")").text();
        if (uldStockSNo == "0" || IsCart == "1" || IsCart == "true") {
            $("#Text_offloadPoint_" + uldStockSNo).closest('span').hide();
            $("#Text_offloadPoint_" + uldStockSNo).hide();
        }
    });


    $('[id^=Text_offloadPoint]').keypress(function (event) {
        if (event.keyCode === 10 || event.keyCode === 13) {
            event.preventDefault();
        }
    })
}

fromuldmove = function () {
    alert("move");
}

function GetSavedULD() {
    LstSavedULD = [];
    var uld = cfi.GetCFGrid("divUldShipmentSection");
    var data = uld.dataSource.data();
    $.each(data, function (index, item) {
        LstSavedULD.push(item.ULDStockSNo);
    });
}

function CheckULDExists(UldStockSNo) // Check ULD exists in Saved ULD
{
    var result = false;
    if (LstSavedULD != null && LstSavedULD.length > 0) {
        for (i = 0; i < LstSavedULD.length; i++) {
            if (LstSavedULD[i] == UldStockSNo) {
                result = true;
                break;
            }
        }
    }
    return result;
}
//added for AssignEquipmentBulk

function getAssignEquipmentGrid() {
    $("#tblAssignEquipmentPopUp").appendGrid({
        tableID: "tblAssignEquipmentPopUp",
        contentEditable: true,
        masterTableSNo: dailyflightsno.split(',')[0],
        currentPage: 1,
        itemsPerPage: 10,
        whereCondition: null,
        sort: "",
        servicePath: "./Services/BuildUp/BuildUpService.svc",
        getRecordServiceMethod: "GetBulkRecordForAssignEquipmentBuildUp",
        deleteServiceMethod: "",
        isGetRecord: true,
        caption: '',
        captionTooltip: 'Assign Equipment For BULK',
        initRows: 1,
        caption: '',
        captionTooltip: 'Assign Equipment',
        columns: [
            { name: 'SNo', type: 'hidden', value: 0 },

            {
                name: 'DailyFlightSNo', type: 'hidden', value: dailyflightsno
            },

            {
                name: 'AWBNo', display: 'AWB No', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, isRequired: true, onChange: "return ChangeAWBNoAssignEquipment(this)", AutoCompleteName: 'BuildUp_AppendGridAWBNo', filterField: 'AWBNo', filterCriteria: "contains"
            },
            {
                name: 'Pieces', display: 'Pieces', type: 'text', ctrlCss: { width: '100px' }, ctrlAttr: {
                    maxlength: 5, controltype: "text", onblur: "CheckPices(this);"
                },
                isRequired: true
            },
            {
                name: 'EquipmentNo', display: 'Equipment No', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '120px', height: '20px' }, AutoCompleteName: 'BuildUp_AppendGridEquipmentNo', filterField: 'EquipmentNo', isRequired: true

            }
        ],
        isPaging: false,
        hideButtons: {
            remove: true,
            removeLast: false,
            insert: true,
            append: false,
            updateAll: true
        },
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {

            RowIndex = addedRowIndex.length;
            $('input[id^="tblAssignEquipmentPopUp_EquipmentNo"]').bind("keyup", function () {
                PutHyphenInEquipmentAssignEquipment($(this));
            });

            $('input[type="text"][id^="tblAssignEquipmentPopUp_Pieces"]').keydown(function (e) {
                if (e.shiftKey || e.ctrlKey || e.altKey) {
                    e.preventDefault();
                } else {
                    var key = e.keyCode;
                    if (!((key == 8) || (key == 46) || (key >= 35 && key <= 40) || (key >= 48 && key <= 57) || (key >= 96 && key <= 105))) {
                        e.preventDefault();
                    }
                }
            });

            $('input[type="text"][id^="tblAssignEquipmentPopUp_Pieces"]').keypress(function (event) {
                var $this = $(this);
                if ((event.which != 46 || $this.val().indexOf('.') != -1) &&
                    ((event.which < 48 || event.which > 57) &&
                        (event.which != 0 && event.which != 8))) {
                    event.preventDefault();
                }

                var text = $(this).val();
                if ((event.which == 46) && (text.indexOf('.') == -1)) {
                    setTimeout(function () {
                        if ($this.val().substring($this.val().indexOf('.')).length > 3) {
                            $this.val($this.val().substring(0, $this.val().indexOf('.') + 3));
                        }
                    }, 1);
                }

                if ((text.indexOf('.') != -1) &&
                    (text.substring(text.indexOf('.')).length > 2) &&
                    (event.which != 0 && event.which != 8) &&
                    ($(this)[0].selectionStart >= text.length - 2)) {
                    event.preventDefault();
                }
            });
        }
    });
    // $("#tblAssignEquipmentPopUp_tfoot").before('<div id="Button"><input type="button" value="Save" class="btn btn-success" id="btnGenerate" onclick="SaveReceiveStatus()"><input type="button" value="Validate" class="btn btn-success" id="btnGenerate" onclick="SaveReceiveStatus()"></div>')
    $("#tblAssignEquipmentPopUp_btnRemoveLast").after('<div id="Button" align="right"><input type="hidden" id=\"IsValidated\" value=\"0\"><input type="button" value="Validate" class="btn btn-success" id="btnValidateBulkRecordForAssignEquipment" onclick="ValidateBulkRecordForAssignEquipment()"><input type="button" value="Save" class="btn btn-success" id="btnSaveBulkRecordForAssignEquipment" onclick="SaveBulkRecordForAssignEquipment()"></div>')

    $('input[id^="tblAssignEquipmentPopUp_EquipmentNo"]').bind("keyup", function () {
        PutHyphenInEquipmentAssignEquipment($(this));
    });

}
function AssignEquipment(DailyFlightSNo, index) {

    $("#tblAssignEquipmentPopUp").remove();
    if ($("#dvAssignEquipmentPopUp").length > 0)
        $("#dvAssignEquipmentPopUp").remove();
    if ($("#dvAssignEquipmentFlightPopUp").length > 0)
        $("#dvAssignEquipmentFlightPopUp").remove();
    $("<div id=dvAssignEquipmentPopUp><table id=\"tblAssignEquipmentPopUp\"></table></div>").appendTo('body');
    getAssignEquipmentGrid();
    if ($('#tblAssignEquipmentPopUp >tbody >tr').length > 0) {
        cfi.PopUp("tblAssignEquipmentPopUp", "UWS for BULK", 900, null, null, null);
        $("#tblAssignEquipmentPopUp").before('<div id="dvAssignEquipmentFlightPopUp"></div>');
        // $("#dvAssignEquipmentFlightPopUp").append("<table border=\"0\" cellpadding='0' cellspacing='0' align=\"center\"><tr style=\"height:25px; font-weight:bold\"><td>Airline</td><td style=\"padding-left:10px\">Flight Date</td><td style=\"padding-left:10px\">Flight No</td><td style=\"padding-left:10px;display:none\">ULD Off Point</td></tr><tr><td> <input type=\"hidden\" name=\"txtAirlineAssignEquipmentFlightPopUp\" id=\"txtAirlineAssignEquipmentFlightPopUp\" value=\"\"><input id=\"Text_txtAirlineAssignEquipmentFlightPopUp\" type=text style=\"width:150px\" name=\"Text_txtAirlineAssignEquipmentFlightPopUp\" controltype=\"autocomplete\" value=\"\"></td><td style=\"padding-left:10px\"><input type=\"text\" style='width:100px' id=\"txtFlightDtAssignEquipmentFlightPopUp\"></td><td style=\"padding-left:10px\"><input type=\"hidden\" name=\"txtFlightNoAssignEquipmentFlightPopUp\" id=\"txtFlightNoAssignEquipmentFlightPopUp\" value=\"\"><input type=\"text\" id=\"Text_txtFlightNoAssignEquipmentFlightPopUp\" name=\"Text_txtFlightNoAssignEquipmentFlightPopUp\" sytle=\"width:40px\" controltype=\"autocomplete\" value=\"\"></td><td style=\"padding-left:10px;display:none\"><input type=\"hidden\" name=\"txtOffPointAssignEquipmentFlightPopUp\" id=\"txtOffPointAssignEquipmentFlightPopUp\" value=\"\"><input type=\"text\" id=\"Text_txtOffPointAssignEquipmentFlightPopUp\" name=\"Text_txtOffPointAssignEquipmentFlightPopUp\" sytle=\"width:40px\" controltype=\"autocomplete\" value=\"\"></td></tr><tr align='center'  style=\"height:20px; text-align:bottom\"><td colspan='6'></td></td></tr></table>");


        //Commented Old Autocomplete
        //cfi.AutoComplete("txtAirlineAssignEquipmentFlightPopUp", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], ResetAssignEquipmentFlightSearch, "contains");
        //cfi.AutoComplete("txtFlightNoAssignEquipmentFlightPopUp", "FlightNo", "vAgentBuildUpFlight", "SNo", "FlightNo", ["FlightNo"], GetOffPointAssignEquipmentFlightPopUp, "contains");
        //cfi.AutoComplete("txtOffPointAssignEquipmentFlightPopUp", "DestinationAirportCode", "vBuildupOffPoint", "DestinationAirportCode", "DestinationAirportCode", null, null, "contains");



        cfi.AutoComplete("txtAirlineAssignEquipmentFlightPopUp", "CarrierCode,AirlineName", "Airline", "BuildUp_txtAirlineAssignEquipmentFlightPopUp", ResetAssignEquipmentFlightSearch, "contains");
        cfi.AutoComplete("txtFlightNoAssignEquipmentFlightPopUp", "FlightNo", "BuildUp_txtFlightNoAssignEquipmentFlightPopUp", GetOffPointAssignEquipmentFlightPopUp, "contains");
        cfi.AutoComplete("txtOffPointAssignEquipmentFlightPopUp", "DestinationAirportCode", "BuildUp_txtOffPointAssignEquipmentFlightPopUp", null, "contains");



        $("#txtFlightDtAssignEquipmentFlightPopUp").kendoDatePicker();
        $("#txtFlightDtAssignEquipmentFlightPopUp").closest("span.k-datepicker").width(100);
        //$("#Text_txtAirlineAssignEquipmentFlightPopUp").data("kendoAutoComplete").setDefaultValue($("#Text_AirlineSNo").data("kendoAutoComplete").key(), $("#Text_AirlineSNo").data("kendoAutoComplete").value());
        //$("#Text_txtAirlineAssignEquipmentFlightPopUp").data("kendoAutoComplete").enable(false);

        $("#txtFlightDtAssignEquipmentFlightPopUp").kendoDatePicker({
            change: function () {
                ResetAssignEquipmentFlightSearch();
            }
        });

        $("#tblAssignEquipmentPopUp").closest(".k-window").css({
            position: 'fixed',
            top: '5%'
        });
    }
    $("tr[id^='tblAssignEquipmentPopUp_Row']").each(function () {
        var $tr = $(this);
        var txtval = document.getElementById($tr.find("input[id^='tblAssignEquipmentPopUp_AWBNo']").attr("id")).value;
        var hdnval = document.getElementById($tr.find("input[id^='tblAssignEquipmentPopUp_HdnAWBNo']").attr("id")).value;
        if (txtval != "" && hdnval != "") {
            $tr.find("input[id^='tblAssignEquipmentPopUp_AWBNo']").data("kendoAutoComplete").setDefaultValue(hdnval, txtval);

        }
        var txtvalEquipmentNo = document.getElementById($tr.find("input[id^='tblAssignEquipmentPopUp_EquipmentNo']").attr("id")).value;
        var hdnvalEquipmentNo = document.getElementById($tr.find("input[id^='tblAssignEquipmentPopUp_HdnEquipmentNo']").attr("id")).value;
        if (txtvalEquipmentNo != "" && hdnvalEquipmentNo != "") {
            //$tr.find("input[id^='tblAssignEquipmentPopUp_HdnEquipmentNo']").val(hdnvalEquipmentNo);
            //$tr.find("input[id^='tblAssignEquipmentPopUp_EquipmentNo']").val(txtvalEquipmentNo);
            // if ($tr.find("input[id^='tblAssignEquipmentPopUp_HdnEquipmentNo']").data("kendoAutoComplete") != undefined) {
            $tr.find("input[id^='tblAssignEquipmentPopUp_EquipmentNo']").data("kendoAutoComplete").setDefaultValue(hdnvalEquipmentNo, txtvalEquipmentNo);
            //}

        }
    });



}
function getViewAssignEquipmentGrid() {

    var DailyFlightSNo = dailyflightsno;

    if (DailyFlightSNo != "") {
        DailyFlightSNo = dailyflightsno.split(',')[0];
    }

    $("#tblAssignEquipmentPopUp").appendGrid({
        tableID: "tblAssignEquipmentPopUp",
        contentEditable: true,
        masterTableSNo: dailyflightsno.split(',')[0],
        currentPage: 1,
        itemsPerPage: 10,
        whereCondition: null,
        sort: "",
        servicePath: "./Services/BuildUp/BuildUpService.svc",
        getRecordServiceMethod: "GetViewBulkRecordForAssignEquipmentBuildUp",
        deleteServiceMethod: "",
        isGetRecord: true,
        caption: '',
        captionTooltip: 'Assign Equipment For BULK',
        initRows: 1,
        caption: '',
        captionTooltip: 'Assign Equipment',
        columns: [
            { name: 'SNo', type: 'hidden', value: 0 },

            { name: 'DailyFlightSNo', type: 'hidden', value: dailyflightsno },

            {
                name: 'AWBNo', display: 'AWB No', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '100px', height: '20px' }, AutoCompleteName: 'BuildUp_AppendGridEquipmentAWB', filterField: 'AWBNo'
            },

            {
                name: 'Pieces', display: 'Pieces', type: 'text', ctrlCss: { width: '100px' }, ctrlAttr: {
                    maxlength: 5, controltype: "text"
                }
            },
            {
                name: 'FlightDate', type: 'hidden'
            },
            {
                name: 'FlightNo', type: 'hidden'
            },
            {
                name: 'ScaleWeight', type: 'hidden'
            },
            {
                name: 'OffPoint', type: 'hidden'
            },

            {
                name: 'EquipmentNo', display: 'Equipment No', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '120px', height: '20px' }, AutoCompleteName: 'BuildUp_AppendGridAllEquipment', filterField: 'EquipmentNo'
            },

        ],
        isPaging: false,
        hideButtons: {
            remove: true,
            removeLast: false,
            insert: true,
            append: false,
            updateAll: true
        },
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {

            RowIndex = addedRowIndex.length;

            $('input[type="text"][id^="tblAssignEquipmentPopUp_Pieces"]').keydown(function (e) {
                if (e.shiftKey || e.ctrlKey || e.altKey) {
                    e.preventDefault();
                } else {
                    var key = e.keyCode;
                    if (!((key == 8) || (key == 46) || (key >= 35 && key <= 40) || (key >= 48 && key <= 57) || (key >= 96 && key <= 105))) {
                        e.preventDefault();
                    }
                }
            });

            $('input[type="text"][id^="tblAssignEquipmentPopUp_Pieces"]').keypress(function (event) {
                var $this = $(this);
                if ((event.which != 46 || $this.val().indexOf('.') != -1) &&
                    ((event.which < 48 || event.which > 57) &&
                        (event.which != 0 && event.which != 8))) {
                    event.preventDefault();
                }

                var text = $(this).val();
                if ((event.which == 46) && (text.indexOf('.') == -1)) {
                    setTimeout(function () {
                        if ($this.val().substring($this.val().indexOf('.')).length > 3) {
                            $this.val($this.val().substring(0, $this.val().indexOf('.') + 3));
                        }
                    }, 1);
                }

                if ((text.indexOf('.') != -1) &&
                    (text.substring(text.indexOf('.')).length > 2) &&
                    (event.which != 0 && event.which != 8) &&
                    ($(this)[0].selectionStart >= text.length - 2)) {
                    event.preventDefault();
                }
            });
        }
    });
}

function CheckPices(obj) {
    if (obj.value != "" && parseInt(obj.value) == 0) {
        ShowMessage('warning', 'Warning!', "Piece No. can not be zero.");
        $("#" + obj.id).val("");
    }
}

function SetNumericPiece(obj, event) {
    var Piece_ID = obj.id;
    //$('input[type="text"][id="' + Piece_ID + '"]').keydown(function (e) {
    //    if (e.shiftKey || e.ctrlKey || e.altKey) {
    //        e.preventDefault();
    //    } else {
    //        var key = e.keyCode;
    //        if (!((key == 8) || (key == 46) || (key >= 35 && key <= 40) || (key >= 48 && key <= 57) || (key >= 96 && key <= 105))) {
    //            e.preventDefault();
    //        }
    //    }
    //});

    $('input[type="text"][id="' + Piece_ID + '"]').keypress(function (event) {
        var $this = $(this);
        if ((event.which != 46 || $this.val().indexOf('.') != -1) &&
            ((event.which < 48 || event.which > 57) &&
                (event.which != 0 && event.which != 8))) {
            event.preventDefault();
        }

        var text = $(this).val();
        if ((event.which == 46) && (text.indexOf('.') == -1)) {
            setTimeout(function () {
                if ($this.val().substring($this.val().indexOf('.')).length > 3) {
                    $this.val($this.val().substring(0, $this.val().indexOf('.') + 3));
                }
            }, 1);
        }

        if ((text.indexOf('.') != -1) &&
            (text.substring(text.indexOf('.')).length > 2) &&
            (event.which != 0 && event.which != 8) &&
            ($(this)[0].selectionStart >= text.length - 2)) {
            event.preventDefault();
        }
    });
}
function ViewAssignEquipment(DailyFlightSNo, index) {
    $("#tblAssignEquipmentPopUp").remove();
    if ($("#dvAssignEquipmentPopUp").length > 0)
        $("#dvAssignEquipmentPopUp").remove();
    if ($("#dvAssignEquipmentFlightPopUp").length > 0)
        $("#dvAssignEquipmentFlightPopUp").remove();
    $("<div id=dvAssignEquipmentPopUp><table id=\"tblAssignEquipmentPopUp\"></table></div>").appendTo('body');
    getViewAssignEquipmentGrid();
    cfi.PopUp("tblAssignEquipmentPopUp", "UWS for BULK", 900, null, null, null);
    $("#tblAssignEquipmentPopUp").before('<div id="dvAssignEquipmentFlightPopUp"></div>');
    // $("#dvAssignEquipmentFlightPopUp").append("<table border=\"0\" cellpadding='0' cellspacing='0' align=\"center\"><tr style=\"height:25px; font-weight:bold\"><td>Airline</td><td style=\"padding-left:10px\">Flight Date</td><td style=\"padding-left:10px\">Flight No</td><td style=\"padding-left:10px;display:none\">ULD Off Point</td></tr><tr><td> <input type=\"hidden\" name=\"txtAirlineAssignEquipmentFlightPopUp\" id=\"txtAirlineAssignEquipmentFlightPopUp\" value=\"\"><input id=\"Text_txtAirlineAssignEquipmentFlightPopUp\" type=text style=\"width:150px\" name=\"Text_txtAirlineAssignEquipmentFlightPopUp\" controltype=\"autocomplete\" value=\"\"></td><td style=\"padding-left:10px\"><input type=\"text\" style='width:100px' id=\"txtFlightDtAssignEquipmentFlightPopUp\"></td><td style=\"padding-left:10px\"><input type=\"hidden\" name=\"txtFlightNoAssignEquipmentFlightPopUp\" id=\"txtFlightNoAssignEquipmentFlightPopUp\" value=\"\"><input type=\"text\" id=\"Text_txtFlightNoAssignEquipmentFlightPopUp\" name=\"Text_txtFlightNoAssignEquipmentFlightPopUp\" sytle=\"width:40px\" controltype=\"autocomplete\" value=\"\"></td><td style=\"padding-left:10px;display:none\"><input type=\"hidden\" name=\"txtOffPointAssignEquipmentFlightPopUp\" id=\"txtOffPointAssignEquipmentFlightPopUp\" value=\"\"><input type=\"text\" id=\"Text_txtOffPointAssignEquipmentFlightPopUp\" name=\"Text_txtOffPointAssignEquipmentFlightPopUp\" sytle=\"width:40px\" controltype=\"autocomplete\" value=\"\"></td></tr><tr align='center'  style=\"height:20px; text-align:bottom\"><td colspan='6'></td></td></tr></table>");

    //Commented Old Autocomplete
    //cfi.AutoComplete("txtAirlineAssignEquipmentFlightPopUp", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], ResetAssignEquipmentFlightSearch, "contains");
    //cfi.AutoComplete("txtFlightNoAssignEquipmentFlightPopUp", "FlightNo", "vAgentBuildUpFlight", "SNo", "FlightNo", ["FlightNo"], GetOffPointAssignEquipmentFlightPopUp, "contains");
    //cfi.AutoComplete("txtOffPointAssignEquipmentFlightPopUp", "DestinationAirportCode", "vBuildupOffPoint", "DestinationAirportCode", "DestinationAirportCode", null, null, "contains");



    cfi.AutoComplete("txtAirlineAssignEquipmentFlightPopUp", "CarrierCode,AirlineName", "Airline", "BuildUp_txtAirlineAssignEquipmentFlightPopUp", ResetAssignEquipmentFlightSearch, "contains");
    cfi.AutoComplete("txtFlightNoAssignEquipmentFlightPopUp", "FlightNo", "BuildUp_txtFlightNoAssignEquipmentFlightPopUp", GetOffPointAssignEquipmentFlightPopUp, "contains");
    cfi.AutoComplete("txtOffPointAssignEquipmentFlightPopUp", "DestinationAirportCode", "BuildUp_txtOffPointAssignEquipmentFlightPopUp", null, "contains");




    $("#txtFlightDtAssignEquipmentFlightPopUp").kendoDatePicker();
    $("#txtFlightDtAssignEquipmentFlightPopUp").closest("span.k-datepicker").width(100);
    //   $("#Text_txtAirlineAssignEquipmentFlightPopUp").data("kendoAutoComplete").setDefaultValue($("#Text_AirlineSNo").data("kendoAutoComplete").key(), $("#Text_AirlineSNo").data("kendoAutoComplete").value());
    //   $("#Text_txtAirlineAssignEquipmentFlightPopUp").data("kendoAutoComplete").enable(false);

    $("#txtFlightDtAssignEquipmentFlightPopUp").kendoDatePicker({
        change: function () {
            ResetAssignEquipmentFlightSearch();
        }
    });

    $("#tblAssignEquipmentPopUp").closest(".k-window").css({
        position: 'fixed',
        top: '5%'
    });
    ////////////////////hide/////////////////////
    $("#tblAssignEquipmentPopUp_btnAppendRow").hide();
    $("#tblAssignEquipmentPopUp_btnRemoveLast").hide();
    //  $("#Text_txtFlightNoAssignEquipmentFlightPopUp").data("kendoAutoComplete").setDefaultValue($("#tblAssignEquipmentPopUp_FlightNo_1").val(), $("#tblAssignEquipmentPopUp_FlightNo_1").val());
    $("#txtFlightDtAssignEquipmentFlightPopUp").val($("#tblAssignEquipmentPopUp_FlightDate_1").val());
    var tempAssignedEquipment = []

    $('#tblAssignEquipmentPopUp >tbody >tr').each(function (i, e) {

        tempAssignedEquipment.push({
            "EquipmentNo": $("#tblAssignEquipmentPopUp_EquipmentNo_" + parseInt(i + 1)).val(),
            "ScaleWeight": $("#tblAssignEquipmentPopUp_ScaleWeight_" + parseInt(i + 1)).val(),
            "OffPoint": $("#tblAssignEquipmentPopUp_OffPoint_" + parseInt(i + 1)).val(),
        });
    });

    var html = "";
    var uniquetempAssignedEquipment = RemoveDuplicates(tempAssignedEquipment, "EquipmentNo");
    for (var i = 0; i < uniquetempAssignedEquipment.length; i++) {
        html = html + '<tr><td class=ui-widget-content>Equipment No :   </td><td class=ui-widget-content>' + uniquetempAssignedEquipment[i].EquipmentNo + '</td><td class=ui-widget-content>Scale Weight:   </td><td class=ui-widget-content>' + uniquetempAssignedEquipment[i].ScaleWeight + '</td><td class=ui-widget-content>Off Point :   </td><td class=ui-widget-content>' + uniquetempAssignedEquipment[i].OffPoint + '</td></tr>'
    }
    $("#tblAssignEquipmentPopUp_btnRemoveLast").after("<table  id=\"tblScaleWeightPopUp\" border=\"0\" cellpadding='0' cellspacing='0' align=\"center\">" + html + "</table>");
}
function ValidateBulkRecordForAssignEquipment() {

    //$("input[type='text'][id^='tblAssignEquipmentPopUp_Pieces']").kendoNumericTextBox({
    //    spinners: false,
    //    format: "#",
    //    decimals: 0
    //});


    var res = $("#tblAssignEquipmentPopUp tr[id^='tblAssignEquipmentPopUp']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
    getUpdatedRowIndex(res, 'tblAssignEquipmentPopUp');
    var dataDetails = JSON.parse(($('#tblAssignEquipmentPopUp').appendGrid('getStringJson')));
    var FlightNoAssignEquipmentFlightPopUp = $("#Text_txtFlightNoAssignEquipmentFlightPopUp").val();

    if (dataDetails != false) {
        //if (FlightNoAssignEquipmentFlightPopUp == "") {
        //    ShowMessage('warning', 'Warning', "Please Enter Flight No.");
        //}
        //else {
        $.ajax({
            url: "./Services/Buildup/BuildUpService.svc/ValidateBulkRecordForAssignEquipmentBuildUp", async: false, type: "POST", dataType: "json", cache: false,

            data: JSON.stringify({ dataDetails: dataDetails }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var MsgTable = jQuery.parseJSON(result);
                var MsgData = MsgTable.Table0;
                if (MsgData[0].IsValidate == 1) {

                    if ($("#tblScaleWeightPopUp").length > 0) {
                        $("#tblScaleWeightPopUp").remove();
                    }
                    $("#IsValidated").val("1");
                    var OffPoint = $("#txtOffPointAssignEquipmentFlightPopUp").val();
                    $("#btnSaveBulkRecordForAssignEquipment").after("<table  id=\"tblScaleWeightPopUp\" border=\"0\" cellpadding='0' cellspacing='0' align=\"center\">" + MsgData[0].Msg + "</table>");
                    /*
                    $('#tblAssignEquipmentPopUp >tbody >tr').each(function (i, e) {
                        $("#" + $(this).find("input[id^='tblAssignEquipmentPopUp_EquipmentNo_']").attr("id")).data("kendoAutoComplete").enable(false);
                    });*/

                    var EDataLen = $('#tblScaleWeightPopUp tr').length;
                    for (var i = 1; i <= EDataLen; i++) {


                        //Commented Old Autocomplete
                        // cfi.AutoComplete("Offpoint_" + i, "DestinationAirportCode", "vBuildupOffPoint", "DestinationAirportCode", "DestinationAirportCode", ["DestinationAirportCode"], null, "contains");

                        if ($("#Text_Offpoint_" + i).data("kendoAutoComplete") == undefined)
                            cfi.AutoComplete("Offpoint_" + i, "DestinationAirportCode", "BuildUp_OffPointWithTemplate", null, "contains");


                        if (OffPoint != "" && OffPoint !== undefined) {
                            $("#Text_Offpoint_" + i).val(OffPoint);
                            $("#Offpoint_" + i).val(OffPoint);
                        }

                    }
                    $("input[type='text'][id^='ScaleWeight_']").on("keypress keyup", function (event) {
                        ISNumeric(this);
                    });

                    $("input[type='text'][id^='ScaleWeight_']").each(function (i, e) {
                        var ScaleWeight = (this.value);
                        $("#" + this.id).removeAttr("value");
                        $("#" + this.id).val(parseFloat(ScaleWeight))
                    });

                    //$('#tblScaleWeightPopUp tr').each(function (i, e) {
                    //    cfi.AutoComplete($(this).find("input[id^='Offpoint_']").attr("id"), "DestinationAirportCode", "vBuildupOffPoint", "DestinationAirportCode", "DestinationAirportCode", null, null, "contains");
                    //})
                    //ShowMessage('success', 'Success!', "Amount Transferred Successfully");
                    //$("#tblAssignEquipmentPopUp").data("kendoWindow").close();
                }
                else if (MsgData[0].IsValidate == 0) {
                    if ($("#tblScaleWeightPopUp").length > 0) {
                        $("#tblScaleWeightPopUp").remove();
                    }
                    $("#IsValidated").val("0");
                    $("#btnSaveBulkRecordForAssignEquipment").after("<table    id=\"tblScaleWeightPopUp\" border=\"0\" cellpadding='0' cellspacing='0' align=\"center\">" + MsgData[0].Msg + "</table>");
                    // ShowMessage('warning', '', "Contact Admin!");
                    //$("#tblAssignEquipmentPopUp").data("kendoWindow").close();

                }
                else
                    return;
            }
        });
        // }
    }
}
function ISNumeric(obj) {
    if ((event.which != 46 || $(obj).val().indexOf('.') != -1) &&
        ((event.which < 48 || event.which > 57) &&
            (event.which != 0 && event.which != 8))) {
        event.preventDefault();
    }

    var text = obj.value;//$(obj).val();

    if (text != undefined && (text.indexOf('.') != -1) && (text.substring(text.indexOf('.')).length > 2)) {
        event.preventDefault();
    }
}

function CheckEquipmentTareWeight(obj) {
    //ISNumeric("#" + obj.id);
    ISNumeric(obj);
    var index = obj.id.replace('ScaleWeight_', '');
    if ($("#" + obj.id).val() != "") {
        if (parseFloat($("#" + obj.id).val()) <= parseFloat($("#hdnNewTareWeight_" + index).val())) {
            ShowMessage('warning', 'Warning!', "Scale weight can not be equal or less than Equipment Tare Weight (" + parseFloat($("#hdnNewTareWeight_" + index).val()) + ")");
            $("#" + obj.id).val("");
        }
    }

}
function RemoveDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
    return newArray;
}

function ResetAssignEquipmentFlightSearch() {
    $("#Text_txtFlightNoAssignEquipmentFlightPopUp").data("kendoAutoComplete").value("");
    $("#Text_txtFlightNoAssignEquipmentFlightPopUp").data("kendoAutoComplete").key("");
    var EDataLen = $('#tblScaleWeightPopUp tr').length;
    for (var i = 1; i <= EDataLen; i++) {

        //Commented Old Autocomplete cfi.AutoComplete("Offpoint_" + i, "DestinationAirportCode", "vBuildupOffPoint", "DestinationAirportCode", "DestinationAirportCode", ["DestinationAirportCode"], null, "contains");

        if ($("#Text_Offpoint_" + i).data("kendoAutoComplete") == undefined)
            cfi.AutoComplete("Offpoint_" + i, "DestinationAirportCode", "BuildUp_OffPointWithTemplate", null, "contains");

        $("#Text_Offpoint_" + i).data("kendoAutoComplete").setDefaultValue("", "");
    }

}
function GetOffPointAssignEquipmentFlightPopUp() {
    if ($("#Text_txtFlightNoAssignEquipmentFlightPopUp").data("kendoAutoComplete").key() != "") {
        var str = $("#Text_txtFlightNoAssignEquipmentFlightPopUp").data("kendoAutoComplete").key();
        var offPoint = str.split('-');
        if (offPoint.length > 2 && offPoint[2] != "") {
            $("#Text_txtOffPointAssignEquipmentFlightPopUp").data("kendoAutoComplete").setDefaultValue(offPoint[2], offPoint[2]);
        }
        else {
            $("#Text_txtOffPointAssignEquipmentFlightPopUp").data("kendoAutoComplete").setDefaultValue("", "");
        }
    }
    var EDataLen = $('#tblScaleWeightPopUp tr').length;
    if (EDataLen > 0) {
        var str = $("#Text_txtFlightNoAssignEquipmentFlightPopUp").data("kendoAutoComplete").key();
        var offPoint = str.split('-');
        if (offPoint.length > 2 && offPoint[2] != "") {
            // $("#Text_txtOffPointAssignEquipmentFlightPopUp").data("kendoAutoComplete").setDefaultValue(offPoint[2], offPoint[2]);
            for (var i = 1; i <= EDataLen; i++) {
                $("#Text_Offpoint_" + i).data("kendoAutoComplete").setDefaultValue(offPoint[2], offPoint[2]);
            }
        }
        else {

            for (var i = 1; i <= EDataLen; i++) {
                $("#Text_Offpoint_" + i).data("kendoAutoComplete").setDefaultValue("", "");
            }
        }

    }
}
function ChangeAWBNoAssignEquipment(obj) {
    var index = obj.id.replace('Text_tblAssignEquipmentPopUp_AWBNo_', '');
    $("#tblAssignEquipmentPopUp_Pieces_" + index).val('');
    //$("#_temptblAssignEquipmentPopUp_Pieces_" + index).val('');
}
function PutHyphenInEquipmentAssignEquipment(obj) {

    var EquipmentLength = $(obj).val().length;
    var firstchar = $(obj).val().charAt(0);
    if (firstchar != "" && $.isNumeric(firstchar) == false) {
        if (EquipmentLength == 3 || EquipmentLength == 7) {
            $(obj).val($(obj).val() + "-");
        }
    }
}
function SaveBulkRecordForAssignEquipment() {
    var UserSNo = userContext.UserSNo;
    var AirportSNo = userContext.AirportSNo;

    var EData = [];
    var ValidateEquipment = [];
    var EDataLen = $('#tblScaleWeightPopUp tr').length;
    var _DailyFlightSNo;
    // _DailyFlightSNo = $("#Text_txtFlightNoAssignEquipmentFlightPopUp").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_txtFlightNoAssignEquipmentFlightPopUp").data("kendoAutoComplete").key().split('-')[0];
    var IsEnterScaleWeight = 1;
    var IsEnterOffPoint = 1;
    for (var i = 1; i <= EDataLen; i++) {
        var EquipmentSNo = $("#hdnNewEquipmentSNo_" + i).val();
        var ScaleWeight = parseFloat($("#ScaleWeight_" + i).val());
        var OffPoint = $("#Offpoint_" + i).val();
        if (!(EquipmentSNo > 0 && ScaleWeight > 0)) {
            IsEnterScaleWeight = 0;
        }
        if (OffPoint == "") {
            IsEnterOffPoint = 0;
        }

        EData.push({
            "EquipmentSNo": EquipmentSNo,
            "ScaleWeight": ScaleWeight,
            "OffPoint": OffPoint
        });
    }
    //if (_DailyFlightSNo == 0) {
    //    ShowMessage('warning', 'Warning!', "Please Enter Flight No.");
    //}
    //else 
    if ($("#IsValidated").val() == "0") {
        ShowMessage('warning', 'Warning!', "Kindly Validate first");
    }
    else if (IsEnterScaleWeight == 0) {
        ShowMessage('warning', 'Warning!', "Please Enter Scale Weight");
    }
    else if (IsEnterOffPoint == 0) {
        ShowMessage('warning', 'Warning!', "Please Select Off Point");
    }
    else {
        var res = $("#tblAssignEquipmentPopUp tr[id^='tblAssignEquipmentPopUp']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
        getUpdatedRowIndex(res, 'tblAssignEquipmentPopUp');
        var dataDetails = JSON.parse(($('#tblAssignEquipmentPopUp').appendGrid('getStringJson')));

        $.each(dataDetails, function (index, item) {
            ValidateEquipment.push({
                AWBNo: item.AWBNo,
                EquipmentSNo: item.HdnEquipmentNo,
                OffPoint: ""
            });
        });

        $.each(EData, function (index, item) {
            var currentEqp = item.EquipmentSNo;
            for (var i = 0; i < ValidateEquipment.length; i++) {
                if (ValidateEquipment[i]["EquipmentSNo"] == currentEqp) {
                    ValidateEquipment[i]["OffPoint"] = item.OffPoint;
                }
            }
        });

        var Msg = "";

        $.each(ValidateEquipment, function (index, item) {
            var currentAWB = item.AWBNo;
            var currentAWBOffPoint = item.OffPoint;
            if (!(Msg.indexOf(currentAWB) >= 0)) {
                for (var i = 0; i < ValidateEquipment.length; i++) {
                    if (ValidateEquipment[i]["AWBNo"] == currentAWB && ValidateEquipment[i]["OffPoint"] != currentAWBOffPoint) {
                        Msg = currentAWB + ',' + Msg;
                        break;
                    }
                }
            }

        });
        if (Msg != "") {
            jQuery.alerts.okButton = 'Yes';
            jQuery.alerts.cancelButton = 'No';
            var promptmsg = "AWB No " + Msg.substring(0, Msg.length - 1) + " assigned in multiple equipments with different Off-Point.\n Do you wish to continue?";
            var r = confirm(promptmsg)
            if (r == true) {
                if (dataDetails != false) {
                    $.ajax({
                        url: "./Services/Buildup/BuildUpService.svc/SaveBulkRecordForAssignEquipmentBuildUp", async: true, type: "POST", dataType: "json", cache: false,

                        data: JSON.stringify({ dataDetails: dataDetails, ScaleWeightData: EData, dailyFlightSNo: dailyflightsno, AirportSNo: AirportSNo, UserSNo: UserSNo }),
                        contentType: "application/json; charset=utf-8",
                        success: function (result) {
                            var MsgTable = jQuery.parseJSON(result);
                            var MsgData = MsgTable.Table0;
                            if (MsgData[0].IsValidate == 1) {
                                ShowMessage('success', 'Success!', "Equipment Assigned Successfully");
                                var HDNBuildupDailyFlightSNo = $('input[id^=tblAssignEquipmentPopUp_DailyFlightSNo_]').val();
                                $('#AssignEquipmentLink').closest('tr').find("td:eq(0)").html("<a onclick=\"ViewAssignEquipment(" + HDNBuildupDailyFlightSNo + ")\" id=\"ViewAssignEquipmentLink\" style=\"cursor:pointer;color:blue\">" + 'BULK' + "</a>");
                                var $link = $('#AssignEquipmentLink');
                                var $span = $('<span>');
                                //     var flight = $("#Text_txtFlightNoAssignEquipmentFlightPopUp").data("kendoAutoComplete").value() + " / " + $("#txtFlightDtAssignEquipmentFlightPopUp").val();

                                //   $link.after($span.html(flight)).remove();

                                $("#tblAssignEquipmentPopUp").data("kendoWindow").close();
                                $('#btnSearch').click();
                                //$("a#AssignEquipmentLink").replaceWith($("a#AssignEquipmentLink").text());

                            }
                            if (MsgData[0].IsValidate == 0) {
                                if ($("#tblScaleWeightPopUp").length > 0) {
                                    $("#tblScaleWeightPopUp").remove();
                                }
                                $("#IsValidated").val("0");
                                $("#btnSaveBulkRecordForAssignEquipment").after("<table    id=\"tblScaleWeightPopUp\" border=\"0\" cellpadding='0' cellspacing='0' align=\"center\">" + MsgData[0].Msg + "</table>");
                                //ShowMessage('warning', '', "Contact Admin!");

                            }
                            else
                                return;
                        }
                    });
                }
            }


        }
        else {
            if (dataDetails != false) {
                $.ajax({
                    url: "./Services/Buildup/BuildUpService.svc/SaveBulkRecordForAssignEquipmentBuildUp", async: true, type: "POST", dataType: "json", cache: false,

                    data: JSON.stringify({ dataDetails: dataDetails, ScaleWeightData: EData, dailyFlightSNo: dailyflightsno, AirportSNo: AirportSNo, UserSNo: UserSNo }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        var MsgTable = jQuery.parseJSON(result);
                        var MsgData = MsgTable.Table0;
                        if (MsgData[0].IsValidate == 1) {
                            ShowMessage('success', 'Success!', "Equipment Assigned Successfully");
                            var HDNBuildupDailyFlightSNo = $('input[id^=tblAssignEquipmentPopUp_DailyFlightSNo_]').val();
                            $('#AssignEquipmentLink').closest('tr').find("td:eq(0)").html("<a onclick=\"ViewAssignEquipment(" + HDNBuildupDailyFlightSNo + ")\" id=\"ViewAssignEquipmentLink\" style=\"cursor:pointer;color:blue\">" + 'BULK' + "</a>");
                            var $link = $('#AssignEquipmentLink');
                            var $span = $('<span>');
                            //var flight = $("#Text_txtFlightNoAssignEquipmentFlightPopUp").data("kendoAutoComplete").value() + " / " + $("#txtFlightDtAssignEquipmentFlightPopUp").val();

                            //$link.after($span.html(flight)).remove();

                            $("#tblAssignEquipmentPopUp").data("kendoWindow").close();
                            //$("a#AssignEquipmentLink").replaceWith($("a#AssignEquipmentLink").text());

                            $('#btnSearch').click(); //for refresh
                        }
                        if (MsgData[0].IsValidate == 0) {
                            if ($("#tblScaleWeightPopUp").length > 0) {
                                $("#tblScaleWeightPopUp").remove();
                            }
                            $("#IsValidated").val("0");
                            $("#btnSaveBulkRecordForAssignEquipment").after("<table    id=\"tblScaleWeightPopUp\" border=\"0\" cellpadding='0' cellspacing='0' align=\"center\">" + MsgData[0].Msg + "</table>");
                            //ShowMessage('warning', '', "Contact Admin!");

                        }
                        else
                            return;
                    }
                });
            }
        }

    }

}

//end
function ShowULDDetails(obj, str, OpenFrom) {
    //alert("Hello");

    //var trHeader = $("#divNonUldShipmentSection").find(".k-grid-header");

    //var ULDNoindex = -1;
    //var EquipmentSNoindex = -1;
    //var awbvolwtindex = -1;

    //var pcsindex = -1;
    //var grwtindex = -1;
    //var volwtindex = -1;
    //var lipcsindex = -1;
    //var loaddetailindex = -1;
    //var weightdetailindex = -1;
    //var CBMIndex = -1;

    //ULDNoindex = trHeader.find("th[data-field='ULDNo']").index();
    //EquipmentSNoindex = trHeader.find("th[data-field='EquipmentSNo']").index();
    //volwtindex = trHeader.find("th[data-field='LoadVol']").index();

    //awbpcsindex = trHeader.find("th[data-field='Pieces']").index();
    //awbgrwtindex = trHeader.find("th[data-field='GrossWeight']").index();
    //awbvolwtindex = trHeader.find("th[data-field='VolumeWeight']").index();
    //lipcsindex = trHeader.find("th[data-field='LIPieces']").index();
    //loaddetailindex = trHeader.find("th[data-field='LoadDetail']").index();
    //weightdetailindex = trHeader.find("th[data-field='WeightDetail']").index();
    //var CBMIndex = trHeader.find("th[data-field='CBM']").index();

    //var nonuldgrid = cfi.GetCFGrid("divNonUldShipmentSection");
    //var nonuldgriddatasource = nonuldgrid.dataSource;
    //var nonuldgriddata = nonuldgriddatasource.data();

    //var trIndex = undefined;
    //var selectedShipmentCount = 0;
    //var invalidshipment = "";
    //var successshipment = "";
    //var successshipmentSNo = "";
    //var alreadyonuldship = "";
    //var notabletoprocessship = "";
    //var uldmasterrow = undefined;
    //var ulddataitem = undefined;
    //var _sphc = "";

    //$("#divNonUldShipmentSection").find(".k-grid-content").find("input[type='checkbox']").each(function () {
    //    if ($(this).closest("tr").index() == currentIndex) {
    //        var closestTr = $(this).closest("tr");
    //    }
    //});

    var uldno = '';
    var EquipmentSno = '';
    var Scalewt = 0;
    var ISCartStatus = false;

    var vgrid = cfi.GetCFGrid("divUldShipmentSection");
    $.each(vgrid._data, function (i, item_Data) {
        if (item_Data.ULDNo != "BULK" && vgrid.options.parentValue.toString() == item_Data.ULDStockSNo && item_Data.IsCart == "true") {
            ISCartStatus = item_Data.IsCart;
            if (item_Data.EquipmentSNo != undefined || item_Data.EquipmentSNo != "") {
                uldno = item_Data.ULDNo;
                EquipmentSno = item_Data.EquipmentSNo;
                Scalewt = (item_Data.EquipmentSNo.split('-').length == 4 || (item_Data.EquipmentSNo.split('-')[3] == '' ? 0 : item_Data.EquipmentSNo.split('-')[3]) > 0) ? item_Data.EquipmentSNo.split('-')[3] : (parseFloat(item_Data.EquipmentSNo.split('-')[1] == '' ? 0 : item_Data.EquipmentSNo.split('-')[1]) + parseFloat(item_Data.GrossWeight == '' ? 0 : item_Data.GrossWeight));
            }
            return false;
        }
    });


    if (str.toUpperCase() == "D") {
        $.ajax({
            url: "Services/BuildUp/BuildUpService.svc/GetWebForm",//ULDDETAILS/ULDDETAILS/ULDBuildUpDetails/New/1",

            data: JSON.stringify({ model: { processName: "ULDDETAILS", moduleName: "ULDDETAILS", appName: "ULDBuildUpDetails", Action: "New", IsSubModule: "1" } }),
            async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                databind = true;
                $("#divNewBooking").html(result);
                InstantiateControl("divNewBooking");

                $('#Height').css("width", "50px");

                //$('span[id="StartTime"]').after("<span class=\"actionView\" style=\"cursor:pointer;color:blue;\" id=\"spnULDStartTime\" onclick=\"AddULDTime(this,'StartTime')\">+ Add Time</span>");
                //$('span[id="EndTime"]').after("<span class=\"actionView\" style=\"cursor:pointer;color:blue;\" id=\"spnULDEndTime\" onclick=\"AddULDEndTime(this,'EndTime')\">+ Add Time</span>");

                $('#Text_LoadCode').width(200);
                $('#Text_LoadIndicator').width(200);
                $('#Text_AbbrCode').width(200);

                $('#ULDSHC').hide();

                $('#Text_ULDLocation').width(150);

                $('#__tbluldbuildupdetails__ tr td:eq(0)').html($('#__tbluldbuildupdetails__ tr td:eq(0)').html() + "<input type='hidden' name='ULDBuildUpLocation' id='ULDBuildUpLocation' value=''/> <input type='text'  name='Text_ULDBuildUpLocation' id='Text_ULDBuildUpLocation' tabindex='1' controltype='autocomplete' maxlength='10' />");

                $('#OtherPallets').after("<input type='hidden' name='_OtherPallets' id='_OtherPallets' value=''/> <input type='text'  name='Text__OtherPallets' id='Text__OtherPallets' tabindex='18' controltype='autocomplete' maxlength='10' />");

                $('#Text_ULDBuildUpLocation').width(200);
                $('#Text__OtherPallets').width(200);

                $('#Ovng_MasterRemarks').hide();
                $('#spnOvng_MasterRemarks').hide();

                $("#Height").on("keypress keyup blur", function (event) {

                    $(this).val($(this).val().replace(/[^\d].+/, ""));
                    if ((event.which < 48 || event.which > 57)) {
                        event.preventDefault();
                    }

                    if (event.type == "blur")
                        CheckZeroValue(this, "Height");

                });
                $('input[type="text"][id^="OverhangWidth"]').on("keypress keyup blur", function (event) {

                    $(this).val($(this).val().replace(/[^\d].+/, ""));
                    if ((event.which < 48 || event.which > 57)) {
                        event.preventDefault();
                    }

                    if (event.type == "blur")
                        CheckZeroValue(this, "Overhang Width");
                });

                $('input[type="text"][id^="Quantity"]').on("keypress keyup blur", function (event) {

                    $(this).val($(this).val().replace(/[^\d].+/, ""));
                    if ((event.which < 48 || event.which > 57)) {
                        event.preventDefault();
                    }
                });

                $("#Ovng_MasterCutOffHeight").on("keypress keyup blur", function (event) { // Cut off Height

                    $(this).val($(this).val().replace(/[^\d].+/, ""));
                    if ((event.which < 48 || event.which > 57)) {
                        event.preventDefault();
                    }

                    if (event.type == "blur")
                        CheckZeroValue(this, "Cut off Height");
                });
                // added by santosh gupta
                $('#Text_EquipmentID').bind("keyup", function (event) {
                    var EquipmentLength = $(this).val().length;
                    var firstchar = $(this).val().charAt(0);
                    if (firstchar != "" && $.isNumeric(firstchar) == false) {
                        if (EquipmentLength == 3 || EquipmentLength == 7) {
                            $('#Text_EquipmentID').val($('#Text_EquipmentID').val() + "-");
                        }
                    }
                });


                //$('#AddScaleWeight').bind("keyup", function (event) {
                //    var TotalULDWeight = GetULDWeight();
                //    if ($("#Text_EquipmentID").data("kendoAutoComplete").key() != "") {
                //        var equipmentWeight = $("#Text_EquipmentID").data("kendoAutoComplete").key().split('-')[1];
                //        TotalULDWeight = parseFloat(TotalULDWeight) + parseFloat(equipmentWeight);
                //    }
                //    var ScaleWeight = $('#AddScaleWeight').val();
                //    if (ScaleWeight != "" && parseFloat(ScaleWeight) > 0) {
                //        if (parseFloat(TotalULDWeight) > parseFloat(ScaleWeight)) {
                //            $('#AddScaleWeight').val('');
                //            ShowMessage('warning', 'Information', "Scale weight should be greater than the total of ULD Tare weight & Equipment Tare weight.[Total Tare weight=" + TotalULDWeight + "]");
                //        }
                //    }
                //});

                //$('#AddScaleWeight').blur(function (event) {
                //    var TotalULDWeight = GetULDWeight();
                //    if ($("#Text_EquipmentID").data("kendoAutoComplete").key() != "") {
                //        var equipmentWeight = $("#Text_EquipmentID").data("kendoAutoComplete").key().split('-')[1];
                //        TotalULDWeight = parseFloat(TotalULDWeight) + parseFloat(equipmentWeight);
                //    }
                //    var ScaleWeight = $('#AddScaleWeight').val();
                //    if (ScaleWeight != "" && parseFloat(ScaleWeight) > 0) {
                //        if (parseFloat(TotalULDWeight) > parseFloat(ScaleWeight)) {
                //            $('#AddScaleWeight').val('');
                //            ShowMessage('warning', 'Information', "Scale weight should be greater than the total of ULD Tare weight & Equipment Tare weight.[Total Tare weight=" + TotalULDWeight + "]");
                //        }
                //    }
                //});


                /***************Check Scale Weight******************************/
                //var TotalULDWeight = GetULDWeight();
                //if ($("#Text_EquipmentID").data("kendoAutoComplete").key() != "") {
                //    var equipmentWeight = $("#Text_EquipmentID").data("kendoAutoComplete").key().split('-')[1];
                //    TotalULDWeight = parseFloat(TotalULDWeight) + parseFloat(equipmentWeight);
                //}
                //var ScaleWeight = $('#AddScaleWeight').val();
                //if (ScaleWeight != "") {
                //    if (parseFloat(TotalULDWeight) > parseFloat(ScaleWeight)) {
                //        //ShowMessage('warning', 'Information', "Scale weight cannot be less than Tare Weight (Equipment + ULD)");
                //        ShowMessage('warning', 'Information', "Scale weight should be greater than the total of ULD Tare weight & Equipment Tare weight.[Total Tare weight=" + TotalULDWeight + "]");

                //        return;
                //    }
                //}

                if (ISCartStatus == "true") {
                    $('#AddScaleWeight').val(Scalewt);
                    $("#AddScaleWeight").attr("disabled", "disabled");
                }

                $('#Ovng_IsOverhangPallet').click(function () {
                    OverhangControl(this.checked);
                });

                var DSBaseULD = [{ Key: __uldstocksno, Text: __uldno }];

                cfi.AutoComplete("ULDBuildUpLocation", "LocationName", "BuildUp_uldbuilduplocation", null, "contains");
                cfi.AutoComplete("ULDLocation", "LocationName", "BuildUp_uldlocation", null, "contains");
                cfi.AutoComplete("LoadCode", "ULDLoadingCode,Description", "BuildUp_loadcode", null, "contains");
                cfi.AutoComplete("LoadIndicator", "ULDLoadingIndicator,Description", "BuildUp_loadindicator", null, "contains");
                cfi.AutoComplete("AbbrCode", "abbrcode,description", "BuildUp_abbrcode", null, "contains");




                //cfi.EnableAutoComplete("AbbrCode", true, false, "white");
                cfi.AutoCompleteByDataSource("ULDBuild", uldbuild, null, null);
                cfi.AutoCompleteByDataSource("MeasurementUnit", OverhangMesUnit, null, null);
                cfi.AutoCompleteByDataSource("UldBasePallet", DSBaseULD, null, null);

                cfi.AutoComplete("_OtherPallets", "ULDNo", "BuildUp__OtherPallets", null, "contains", ",");
                cfi.AutoComplete("UldBupType", "Description", "BuildUp__UldBupType", null, "contains");

                cfi.AutoCompleteByDataSource("Ovng_MasterMesUnit", OverhangMesUnit, null, null);
                cfi.AutoCompleteByDataSource("ULD_MesUnit", OverhangMesUnit, null, null);



                var dataSource_Equipment = GetDataSource("EquipmentID", "BuildUp_EquipmentIDByGetDataSource");

                //cfi.ChangeAutoCompleteDataSource("EquipmentID", dataSource_Equipment, false, CheckEquipment, "EquipmentID", "contains");
                cfi.ChangeAutoCompleteDataSource("EquipmentID", dataSource_Equipment, false, null, "EquipmentID", "contains");// CheckEquipment ****No Need to CheckEquipment

                if (EquipmentSno != '') {
                    $("#Text_EquipmentID").data("kendoAutoComplete").setDefaultValue(EquipmentSno, uldno);
                    $("#Text_EquipmentID").attr("disabled", "disabled");

                }


                $('#ULDSHC').after("<input type='hidden' name='BuildUPULDSHC' id='BuildUPULDSHC' value=''/> <input type='text'  name='Text_BuildUPULDSHC' id='Text_BuildUPULDSHC' tabindex='9' controltype='autocomplete' maxlength='10' />")


                cfi.AutoComplete("BuildUPULDSHC", "Code", "BuildUp__BuildUPULDSHC", null, "contains", ",");

                $('#Text_UldBupType').blur(function () {
                    ValidateBUPType();
                });
                $('#Text_UldBasePallet').blur(function () {
                    ValidateBasePallet();
                });
                _EquipmentSNo = 0; // Reset Equipment
                var _RouteFlightSNo = $("input[type='hidden'][id='FlightNo']").val() == "" ? "0" : $("input[type='hidden'][id='FlightNo']").val();
                $.ajax({
                    //url: "Services/BuildUp/BuildUpProcessService.svc/GetULDBuildUpDetails?ULDStockSNo=" + __uldstocksno, async: false, type: "get", dataType: "json", cache: false,
                    url: "Services/BuildUp/BuildUpProcessService.svc/GetULDBuildUpDetails?ULDStockSNo=" + __uldstocksno + '&DailyFlightSNo=' + _RouteFlightSNo, async: false, type: "get", dataType: "json", cache: false,
                    //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {

                        var uldData = jQuery.parseJSON(result);
                        var uldDetailData = uldData.Table0;
                        var listArray = uldData.Table1;

                        var listArrayOverhangMaster = uldData.Table2;
                        var listArrayOverhangTrans = uldData.Table3;

                        /************Get Dummy Equipment******************/
                        var lstEquipment = uldData.Table5;

                        /**********Get ULD SPHC*************************/
                        LstULDSPH = [];
                        var _lstULDSPHC = uldData.Table4;

                        if (_lstULDSPHC.length > 0) {
                            $.each(_lstULDSPHC, function (index, item) {
                                LstULDSPH.push({
                                    Key: item.Code, Text: item.Code
                                });
                            });
                        }

                        var detailgrid = cfi.GetNestedCFGrid("div__" + __uldstocksno.toString());
                        if (detailgrid != undefined) {
                            var detaildatasource = detailgrid.dataSource;
                            var detaildata = detaildatasource.data();
                            $.each(detaildata, function (i, item) {
                                var arrSPHC = item.SPHC.split(',');
                                $.each(arrSPHC, function (index, data) {
                                    if (data != "") {
                                        LstULDSPH.push({
                                            Key: data, Text: data
                                        });
                                    }
                                });

                            });
                        }

                        var uniqueSHCArray = RemoveDuplicates(LstULDSPH, "Key");
                        if (uldDetailData.length > 0) {
                            var uldDetailItem = uldDetailData[0];

                            var _startTime = uldDetailItem.StartTime == "" ? "+ Add Time" : uldDetailItem.StartTime;
                            var _EndTime = uldDetailItem.EndTime == "" ? "+ Add Time" : uldDetailItem.EndTime;

                            $('span[id="StartTime"]').after("<span class=\"actionView\" style=\"cursor:pointer;color:blue;\" id=\"spnULDStartTime\" onclick=\"AddULDTime(this,'StartTime')\">" + _startTime + "</span>");
                            //if (OpenFrom == "Details") {
                            if (_EndTime == "" || _EndTime == "+ Add Time") {
                                $('span[id="EndTime"]').after("<span class=\"actionView\" style=\"cursor:pointer;color:blue;\" id=\"spnULDEndTime\" onclick=\"AddULDEndTime(this,'EndTime')\">" + _EndTime + "</span>");
                            }
                            else {
                                $('span[id="EndTime"]').after("<span class=\"actionView\" id=\"spnULDEndTime\">" + _EndTime + "</span>");
                            }


                            $("#Text_ULDBuildUpLocation").data("kendoAutoComplete").setDefaultValue(uldDetailItem.ULDBuildUpLocation, uldDetailItem.Text_ULDBuildUpLocation);
                            $("#Text_ULDLocation").data("kendoAutoComplete").setDefaultValue(uldDetailItem.ULDLocationSNo, uldDetailItem.Text_ULDLocationSNo);
                            $("#Text_ULDBuild").data("kendoAutoComplete").setDefaultValue(uldDetailItem.ULDBuild, uldDetailItem.Text_ULDBuildSNo);
                            $("#Text_LoadIndicator").data("kendoAutoComplete").setDefaultValue(uldDetailItem.LoadIndicationSNo, uldDetailItem.Text_LoadIndicator);
                            $("#Text_AbbrCode").data("kendoAutoComplete").setDefaultValue(uldDetailItem.ULDContourSNo, uldDetailItem.Text_AbbrCode);
                            if (uldDetailItem.BaseULDSNo != "" && uldDetailItem.BaseULDSNo != "0")
                                $("#Text_UldBasePallet").data("kendoAutoComplete").setDefaultValue(uldDetailItem.BaseULDSNo, __uldno.trim());
                            $("#Text_LoadCode").data("kendoAutoComplete").setDefaultValue(uldDetailItem.LoadCodeSNo, uldDetailItem.Text_LoadCode);
                            $("#StartTime").val(uldDetailItem.StartTime);
                            $("#EndTime").val(uldDetailItem.EndTime);
                            if (uldDetailItem.ScaleWeight == "-1.00" || uldDetailItem.ScaleWeight == "-1") {
                                $("#AddScaleWeight").val("");
                            }
                            else {
                                $("#AddScaleWeight").val(uldDetailItem.ScaleWeight);

                            }
                            ///added by santosh

                            if (uldDetailItem.Text_EquipmentID != "") {
                                $("#Text_EquipmentID").data("kendoAutoComplete").setDefaultValue(uldDetailItem.EquipmentIDSNo, uldDetailItem.Text_EquipmentID);
                            }
                            else {
                                if (lstEquipment.length > 0) {
                                    $("#Text_EquipmentID").data("kendoAutoComplete").setDefaultValue(lstEquipment[0].SNo, lstEquipment[0].EquipmentID);
                                }
                            }


                            if (uldDetailItem.EquipmentIDSNo != undefined && uldDetailItem.EquipmentIDSNo != "") {
                                _EquipmentSNo = uldDetailItem.EquipmentIDSNo.split('-')[0];
                            }
                            else {
                                _EquipmentSNo = 0;
                            }
                            $("textarea#Remarks").val(uldDetailItem.Remarks);
                            $("#NotToBeManifested").attr("checked", (uldDetailItem.NotToBeManifest.toString().toLowerCase() == "true"));

                            if (uldDetailItem.IsTeamPersonnel.toString().toLowerCase() == "true") {
                                $('input[name=IsTeamPersonal][value=1]').attr('checked', true);
                            }
                            else {
                                $('input[name=IsTeamPersonal][value=0]').attr('checked', true);
                            }

                            $("#Height").val(uldDetailItem.Height == "-1" ? "" : uldDetailItem.Height);
                            $("#Text_MeasurementUnit").data("kendoAutoComplete").setDefaultValue(uldDetailItem.MeasurementUnit, uldDetailItem.text_MeasurementUnit);
                            $("#Text_UldBupType").data("kendoAutoComplete").setDefaultValue(uldDetailItem.BUPTypeSNo, uldDetailItem.Text_UldBupType);
                            //$('#OtherPallets').val(uldDetailItem.OtherPallets);
                            if (uldDetailItem.OtherPallets != "")
                                cfi.BindMultiValue("_OtherPallets", uldDetailItem.OtherPallets, uldDetailItem.OtherPallets);
                            $('#_OtherPallets').val(uldDetailItem.OtherPallets);

                            if (uldDetailItem.BuildUPULDSHC != "") {
                                cfi.BindMultiValue("BuildUPULDSHC", uldDetailItem.BuildUPULDSHC, uldDetailItem.BuildUPULDSHC);
                                $('#BuildUPULDSHC').val(uldDetailItem.HdnULDSHC);
                            }
                        }
                        else {
                            //$("#Text_UldBasePallet").data("kendoAutoComplete").setDefaultValue(__uldstocksno, __uldno.trim());
                            $('span[id="StartTime"]').after("<span class=\"actionView\" style=\"cursor:pointer;color:blue;\" id=\"spnULDStartTime\" onclick=\"AddULDTime(this,'StartTime')\">+ Add Time</span>");
                            $('span[id="EndTime"]').after("<span class=\"actionView\" style=\"cursor:pointer;color:blue;\" id=\"spnULDEndTime\" onclick=\"AddULDEndTime(this,'EndTime')\">+ Add Time</span>");

                            /************Get Dummy Equipment******************/
                            if (lstEquipment.length > 0) {
                                $("#Text_EquipmentID").data("kendoAutoComplete").setDefaultValue(lstEquipment[0].SNo, lstEquipment[0].EquipmentID);
                            }
                            /*************************************************/
                        }

                        if (listArrayOverhangMaster.length > 0) {
                            var ArrayOverhangMaster = uldData.Table2[0];
                            $('#Ovng_MasterCutOffHeight').val(ArrayOverhangMaster.CutOffHeight == "-1" ? "" : ArrayOverhangMaster.CutOffHeight);
                            $('#Ovng_MasterRemarks').val(ArrayOverhangMaster.Remarks);
                            $("#Text_Ovng_MasterMesUnit").data("kendoAutoComplete").setDefaultValue(ArrayOverhangMaster.CutOffMesUnit, ArrayOverhangMaster.text_CutOffMesUnit);
                            $("#Ovng_IsOverhangPallet").attr("checked", (ArrayOverhangMaster.IsOverhangPallet.toString().toLowerCase() == "true"));

                            OverhangControl($('#Ovng_IsOverhangPallet').is(":checked"));
                        }
                        else {
                            OverhangControl($('#Ovng_IsOverhangPallet').is(":checked"));
                        }

                        $("<br><table><tr><td><input type='checkbox' id='chkFFMRemarks'></td><td id='tdFFM'></td></tr></table>").insertAfter("#spnRemarks");
                        $("#tdFFM").text("Show In FFM");

                        $('#spnRemarks').text("Remarks");

                        $('#chkFFMRemarks').click(function () {
                            if (this.checked) {
                                $('input[type="checkbox"][id^="IsFFMRemarks"]').removeAttr("checked");
                                $('#Remarks').addClass('k-input valid_invalid');
                                $('#Remarks').attr('data-valid', 'required');
                                $('#Remarks').attr('data-valid-msg', 'Please Enter ULD Remarks.');

                                $('#OverhangOtherInfo').removeAttr('data-valid');
                                $('#OverhangOtherInfo').removeAttr('data-valid-msg');
                                $('#OverhangOtherInfo').removeClass('valid_invalid');
                            }
                            else {
                                $('#Remarks').removeAttr('data-valid');
                                $('#Remarks').removeAttr('data-valid-msg');
                                $('#Remarks').removeClass('k-input valid_invalid');
                            }
                        });

                        /*****Call: When Click on ADD/DELETE************************/
                        cfi.makeTrans("ulddetails_uldconsumables", null, null, BindConsumablesAutoComplete, ReBindConsumablesAutoComplete, null, listArray);

                        SetTabIndex();

                        $('#divareaTrans_ulddetails_uldconsumables input[id^="Quantity"]').each(function () {
                            if ($(this).val() == "0") {
                                $(this).val('');
                            }
                        });

                        /*******************Overhang Autocomplete******************************/
                        cfi.makeTrans("ulddetails_uldoverhangpallet", null, null, BindOverhangAutoComplete, null, null, listArrayOverhangTrans);

                        $("div[id$='divareaTrans_ulddetails_uldoverhangpallet']").find("[id='areaTrans_ulddetails_uldoverhangpallet']").each(function () {

                            $(this).find("input[id^='OverhangDirection']").each(function () {
                                cfi.AutoCompleteByDataSource($(this).attr("name").replace("Text_", ""), OverhangDirection, null, null);
                            });
                            $(this).find("input[id^='OverhangType']").each(function () {
                                cfi.AutoCompleteByDataSource($(this).attr("name").replace("Text_", ""), OverhangType, null, null);
                            });
                            $(this).find("input[id^='OverhangMesUnit']").each(function () {
                                cfi.AutoCompleteByDataSource($(this).attr("name").replace("Text_", ""), OverhangMesUnit, null, null);
                            });
                        });

                        /**********For Already Added Trans Data*********************/
                        $('input[type="text"][id^="OverhangWidth"]').each(function () {
                            var currentID = $(this)[0].id;
                            var currentValue = $(this)[0].value;
                            $('#' + currentID).css("width", "50px");
                        });
                        /**********************************************************/

                        $('input[type="checkbox"][id="IsFFMRemarks"]').click(function () {
                            if (this.checked) {
                                $('input[type="checkbox"][id="chkFFMRemarks"]').removeAttr("checked");
                                $('#OverhangOtherInfo').addClass('valid_invalid');
                                $('#OverhangOtherInfo').attr('data-valid', 'required');
                                $('#OverhangOtherInfo').attr('data-valid-msg', 'Please Enter Overhang Other Info.');

                                $('#Remarks').removeAttr('data-valid');
                                $('#Remarks').removeAttr('data-valid-msg');
                                $('#Remarks').removeClass('k-input valid_invalid');
                            }
                            else {
                                $('#OverhangOtherInfo').removeAttr('data-valid');
                                $('#OverhangOtherInfo').removeAttr('data-valid-msg');
                                $('#OverhangOtherInfo').removeClass('valid_invalid');
                            }
                        });

                        $('input[type="checkbox"][id^="IsFFMRemarks"]:not(:first)').hide();
                        $('input[type="text"][id^="OverhangOtherInfo"]:not(:first)').hide();

                        if (uldDetailItem != undefined && uldDetailItem.IsShowInFFM == "1") {
                            $('input[type="checkbox"][id^="chkFFMRemarks"]').attr("checked", "checked");
                        }
                        else if (uldDetailItem != undefined && uldDetailItem.IsShowInFFM == "2") {
                            $('input[type="checkbox"][id^="IsFFMRemarks"]').attr("checked", "checked");
                        }

                        $("div[id$='divareaTrans_ulddetails_uldconsumables']").find("[id='areaTrans_ulddetails_uldconsumables']").each(function () {
                            $(this).find("input[id^='ConsumablesSNo']").each(function () {
                                //Commented Old Autocomplete
                                // cfi.AutoComplete($(this).attr("name"), "Item", "BuildupConsumables", "SNo", "Item", ["Item"], null, "contains");
                                cfi.AutoComplete($(this).attr("name"), "Item", "BuildUp_ConsumableName", null, "contains");


                            });

                            //$(this).find("input[id^='Quantity']").each(function () {
                            //    cfi.AutoCompleteByDataSource($(this).attr("name").replace("Text_", ""), quantity, null, null);
                            //});
                        });

                        OnChangeConsumableType();

                        /******************Check Consumable Type****************************************/
                        $(listArray).each(function (index, item) {
                            if (index == 0) {
                                $("input[type='radio'][name='ConsumableType'][data-radioval='Airline']").val('0');
                                $("input[type='radio'][name='ConsumableType'][data-radioval='Self']").val('1');

                                if (item.consumabletype == "0") {
                                    $("input[type='radio'][name='ConsumableType'][data-radioval='Airline']").attr('checked', 'checked');
                                }
                                else {
                                    $("input[type='radio'][name='ConsumableType'][data-radioval='Self']").attr('checked', 'checked');
                                }
                            }
                            else {
                                $("input[type='radio'][name='ConsumableType_" + (index - 1) + "'][data-radioval='Airline']").val('0');
                                $("input[type='radio'][name='ConsumableType_" + (index - 1) + "'][data-radioval='Self']").val('1');

                                if (item.consumabletype == "0") {
                                    $("input[type='radio'][name='ConsumableType_" + (index - 1) + "'][data-radioval='Airline']").attr('checked', 'checked');
                                }
                                else {
                                    $("input[type='radio'][name='ConsumableType_" + (index - 1) + "'][data-radioval='Self']").attr('checked', 'checked');
                                }
                            }

                        });

                        /*******************************************************************************/
                    },
                    error: {

                    }
                });
                savetype = "ULDDETAILS";
                //$('#divNewBooking').dialog({ title: 'Build Up - ULD Details', modal: true, height: 'auto', width: 'auto' });
                $('#divNewBooking').prepend("<div id='divULDTag' style='display:none'></div>");
                $('#divNewBooking').prepend("<div id='divAfterContent'></div>");
                cfi.PopUp("divNewBooking", "ULD Build Details", null, PopUpOnOpen, PopUpOnClose);
            }
        });
    }
    else {

        $.ajax({
            url: "Services/BuildUp/BuildUpService.svc/GetWebForm",//ULDDETAILS/CLOSEDULDDETAILS/ULDBuildUpDetails/New/1",

            data: JSON.stringify({ model: { processName: "ULDDETAILS", moduleName: "CLOSEDULDDETAILS", appName: "ULDBuildUpDetails", Action: "New", IsSubModule: "1" } }),

            async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                databind = true;
                $("#divNewBooking").html(result);
                InstantiateControl("divNewBooking");
                $.ajax({
                    url: "Services/BuildUp/BuildUpProcessService.svc/GetULDBuildUpDetails?ULDStockSNo=" + __uldstocksno + '&DailyFlightSNo=' + $("input[type='hidden'][id='FlightNo").val(), async: false, type: "get", dataType: "json", cache: false,
                    //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        var uldData = jQuery.parseJSON(result);
                        var uldDetailData = uldData.Table0;
                        var listArray = uldData.Table1;

                        if (uldDetailData.length > 0) {
                            var uldDetailItem = uldDetailData[0];
                            $("span#ULDBuildUpLocation").text(uldDetailItem.Text_ULDBuildUpLocation);
                            $("span#ULDBuild").text(uldDetailItem.Text_ULDBuildSNo);
                            $("span#ULDLocation").text(uldDetailItem.Text_ULDLocationSNo);
                            $("span#LoadCode").text(uldDetailItem.Text_LoadCode);
                            $("span#LoadIndicator").text(uldDetailItem.Text_LoadIndicator);
                            $("span#AbbrCode").text(uldDetailItem.Text_ULDBText_AbbrCodeuildSNo);
                            $("span#StartTime").text(uldDetailItem.StartTime);
                            $("span#EndTime").text(uldDetailItem.EndTime);
                            $("span#AddScaleWeight").text(uldDetailItem.ScaleWeight);
                            $("span#feet").text(uldDetailItem.Feet);
                            $("span#Inches").text(uldDetailItem.Inch);
                            $("span#Remarks").text(uldDetailItem.Remarks);
                            $("span#NotToBeManifested").text((uldDetailItem.NotToBeManifest.toString().toLowerCase() == "true" ? "YES" : "NO"));
                        }

                        cfi.makeTrans("closedulddetails_uldconsumables", null, null, BindConsumablesAutoComplete, ReBindConsumablesAutoComplete, null, listArray);


                        $("div[id$='divareaTrans_closedulddetails_uldconsumables']").find("table").find("tr").each(function () {
                            $(this).find("td:last").html("");
                        });
                    },
                    error: {

                    }
                });
                savetype = "CLOSEDULD";
                cfi.PopUp("divNewBooking", "ULD Build Details", null, ReadPopUpOnOpen, ReadPopUpOnClose);
                //$('#divNewBooking').dialog({ title: 'Build Up - ULD Details', modal: true, height: 'auto', width: 'auto' });
            }
        });
    }
}

function CheckForContourCode(textId, text, keyId, key) {
    if (key == 2) {
        cfi.EnableAutoComplete("AbbrCode", false, true, "light-grey");
        cfi.AutoCompleteByDataSource("AbbrCode", _DefaultAutoComplete_, null, null);
    }
    else {
        cfi.EnableAutoComplete("AbbrCode", true, true, "white");

        //Commented Old Autocomplete
        //cfi.AutoComplete("AbbrCode", "AbbrCode", "ULDContour", "SNo", "AbbrCode", ["AbbrCode"], null, "contains");
        cfi.AutoComplete("AbbrCode", "AbbrCode", "ULDContour", "BuildUp__AbbrCode", null, "contains");
    }
}

function PopUpOnOpen(cntrlId) {
    savetype = "ULDDETAILS";
    return false;
}

function PopUpOnClose(cntrlId) {
    savetype = "";
    __uldstocksno = -1;
    __uldno = "";
    $("#divPopUpBackground").hide();
    LoadPopUPStatus = false;
    return false;
}

function ReadPopUpOnOpen(cntrlId) {
    savetype = "CLOSEDULDDETAILS";
    return false;
}

function ReadPopUpOnClose(cntrlId) {
    savetype = "";
    __uldstocksno = -1;
    __uldno = "";
    return false;
}

function OnChangeConsumableType() {
    $("input[type='radio'][name^='ConsumableType']").change(function () {

        var itemID = this.id.replace('ConsumableType', 'Text_ConsumablesSNo');
        $("#" + itemID).data("kendoAutoComplete").key('');
        $("#" + itemID).data("kendoAutoComplete").value('');

        //var itemID = this.id.replace('ConsumableType', 'Text_Quantity');
        //$("#" + itemID).data("kendoAutoComplete").key('');
        //$("#" + itemID).data("kendoAutoComplete").value('');

        var itemID = this.id.replace('ConsumableType', 'Quantity');
        $("#" + itemID).val('');

    });
}

function BindConsumablesAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='ConsumablesSNo']").each(function () {

        //Commented Old Autocomplete
        //cfi.AutoComplete($(this).attr("name"), "Item", "BuildupConsumables", "SNo", "Item", ["Item"], null, "contains");
        cfi.AutoComplete($(this).attr("name"), "Item", "BuildUp_ConsumableName", null, "contains");
    });

    //$(elem).find("input[id^='Quantity']").each(function () {
    //    cfi.AutoCompleteByDataSource($(this).attr("name").replace("Text_", ""), quantity, null, null);
    //});

    $(elem).find("input[id^='Quantity']").each(function () {
        var currentID = $(this)[0].id;

        $('#' + currentID).css("width", "50px");

        $('#' + currentID).on("keypress keyup blur", function (event) {
            $(this).val($(this).val().replace(/[^\d].+/, ""));
            if ((event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        });
    });
    OnChangeConsumableType();
    SetTabIndex();
}

function ReBindConsumablesAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_ulddetails_uldconsumables']").find("[id^='areaTrans_ulddetails_uldconsumables']").each(function () {
        $(this).find("input[id^='ConsumablesSNo']").each(function () {

            //Commented Old Autocomplete
            //var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "BuildupConsumables", "SNo", "Item", ["Item"]);

            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "BuildUp_BuildupConsumables");

            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
        //$(this).find("input[id^='Quantity']").each(function () {
        //    cfi.ChangeAutoCompleteDataSource($(this).attr("name"), quantity, false);
        //});
    });
    OnChangeConsumableType();
    SetTabIndex();
}

function BindOverhangAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='OverhangDirection']").each(function () {
        cfi.AutoCompleteByDataSource($(this).attr("name").replace("Text_", ""), OverhangDirection, null, null);
    });

    $(elem).find("input[id^='OverhangMesUnit']").each(function () {
        cfi.AutoCompleteByDataSource($(this).attr("name").replace("Text_", ""), OverhangMesUnit, null, null);
    });

    $(elem).find("input[id^='OverhangType']").each(function () {
        cfi.AutoCompleteByDataSource($(this).attr("name").replace("Text_", ""), OverhangType, null, null);
    });

    $(elem).find("input[id^='OverhangWidth']").each(function () {
        var currentID = $(this)[0].id;

        $('#' + currentID).css("width", "50px");

        $('#' + currentID).on("keypress keyup blur", function (event) {
            $(this).val($(this).val().replace(/[^\d].+/, ""));
            if ((event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
            if (event.type == "blur")
                CheckZeroValue(this, "Overhang Width");
        });
    });

    OverhangControl($('#Ovng_IsOverhangPallet').is(":checked"));

    $('input[type="checkbox"][id^="IsFFMRemarks"]:not(:first)').hide();
    $('input[type="text"][id^="OverhangOtherInfo"]:not(:first)').hide();
}

function RemoveULD(obj) {

    var vgrid = cfi.GetCFGrid("divUldShipmentSection");
    var vgriddatasource = vgrid.dataSource;
    var uldmasterrow = $(obj).closest("tr");
    ulddataitem = vgrid.dataItem(uldmasterrow);

    var uldtype = ulddataitem.IsCart == "true" || ulddataitem.IsCart == "1" ? "CART" : "ULD";
    if (ulddataitem.ULDNo == "BULK") {
        uldtype = "BULK";
    }

    RemovedULDStockSNo = RemovedULDStockSNo + ',' + ulddataitem.ULDStockSNo;


    /*Following is added by Brajendra for unlocked when remove uld on 16 Aug, 2017 */
    SaveUpdateLockedProcess(0, "", "", "", userContext.UserSNo, "31", 'FlightBuildUp', "", ulddataitem.ULDNo);



    if (parseInt(ulddataitem.Shipments) == 0) {
        vgriddatasource.remove(ulddataitem);
        for (var i = 0; i < processeduld.length; i++)
            processeduld.splice(i, 1)
        ShowMessage('success', 'Success - ' + uldtype + ' Remove', uldtype + " removed successfully.", "bottom-right");
        removeValue(ulddataitem.ULDNo);
        AttachEventForULD("RemoveULD", ulddataitem.ULDStockSNo, 0);
    }
    else {
        ShowMessage('warning', 'Warning - ' + uldtype + ' Remove', "Unable to remove selected " + uldtype, "bottom-right");
    }
}
var moveFromLy = false;
var DnNoPcsForDisable
var IsCartStatus = "";
function MoveToUld() {

    var IsLITobeRefersh = false;

    var LIdata = jQuery.grep(processList, function (n, i) {
        return (n.GroupFlightSNo == $("#Text_searchFlightNo").data("kendoAutoComplete").key() && n.ProcessSNo == 35 && n.EventType == "SAVE");
    });

    if (LIdata.length > 0) { IsLITobeRefersh = true }
    else {
        signalR.updateProcessStatus({
            GroupFlightSNo: $("#Text_searchFlightNo").data("kendoAutoComplete").key(), ProcessSNo: 30, EventType: 'SAVE'
        });
    }

    //if (IsLITobeRefersh) {
    //    ShowMessage('warning', 'Warning', "Loading Instruction for this flight is being updated simultaneously. Please save Build Up to fetch latest records.", "bottom-right");
    //    return;
    //}


    $('#btnSave').attr("disabled", true);
    //Merging array for PoMailDetails
    //mergedArr = [];
    //bupArr = [];
    //mergedArr = POMailDetailsArray.concat(bupArr);
    //if(IsChanged)
    //if (MCBkngSNo > 0 )
    //        ShowMessage('warning', 'Warning', "Pls. Select DN Information", "bottom-right");
    //        return;

    //var NonuldgridForMCBookingSNo = cfi.GetCFGrid("divNonUldShipmentSection");
    //var nonuuldgridForMCBookingSNodatasource = nonuldgrid.dataSource;
    //var uldgridForMCBookingSNodata = nonuldgriddatasource.data();

    //var FPSNoIndex = trHeader.find("th[data-field='FPSNo']").index();
    //var FPSNo = $(obj).closest('tr').find('td:eq(' + FPSNoIndex + ')').text();

    //$.each(uldgridForMCBookingSNodata, function (index, value) {
    //    if ($("#divNonUldShipmentSection").find(".k-grid-content").find("input[type='checkbox']:checked").index()==index)
    //    alert(value.MCBookingSNo);
    //    //$("#divNonUldShipmentSection").find(".k-grid-content").find("input[type='checkbox']:checked").length

    //});

    //isSelectDNSNo = false;

    /*Pomail worked on 23-Oct-2017 below content is going to line no 3314*/
    //var gridLying = $("#divLyingListSection").find(".k-grid").data('kendoGrid');
    //var checkedLyingData = $.map($("#divLyingListSection").find(".k-grid-content").find("input[type='checkbox']:checked"), function (checkbox) {
    //    var LyingdataItem = gridLying.dataSource.getByUid($(checkbox).closest('tr').attr('data-uid'));
    //    return LyingdataItem.MCBookingSNo;

    //});

    //$.each(POMailDetailsArray, function (index, val) {
    //    if (checkedLyingData.join(',').indexOf(val.MCBookingSNo) >= 0) {
    //        if (IsChanged == false) { if (val.Planned == 0) { val.Planned = 1; val.isSelect == 1; val.ULDStockSNo = cfi.GetCFGrid("divUldShipmentSection").options.parentValue.toString(); } }
    //        else
    //        {
    //            if (val.isSelect == 1 && val.Planned == 0) { val.Planned = 1; val.ULDStockSNo = cfi.GetCFGrid("divUldShipmentSection").options.parentValue.toString(); }
    //        }
    //    }

    //});
    //IsChanged = false;
    /*End Pomail*/


    //$.each(LyingListPOMailDetailsArray, function (index, val) {
    //    if (checkedLyingData.join(',').indexOf(val.MCBookingSNo) >= 0) {
    //        if (IsChanged == false) { if (val.Planned == 0) { val.Planned = 1; val.isSelect == 1; val.ULDStockSNo = expanededUldStockSnoForMovetoULD; } }
    //        else
    //        {
    //            if (val.isSelect == 1 && val.Planned == 0) { val.Planned = 1; val.ULDStockSNo = expanededUldStockSnoForMovetoULD; }
    //        }
    //    }

    //});





    /*Pomail worked on 23-Oct-2017 below content is going to line no 3314*/
    //var grid = $("#divNonUldShipmentSection").find(".k-grid").data('kendoGrid');
    //var checkedData = $.map($("#divNonUldShipmentSection").find(".k-grid-content").find("input[type='checkbox']:checked"), function (checkbox) {
    //    var dataItem = grid.dataSource.getByUid($(checkbox).closest('tr').attr('data-uid'));
    //    return dataItem.MCBookingSNo;

    //});

    //$.each(POMailDetailsArray, function (index, val) {
    //    if (checkedData.join(',').indexOf(val.MCBookingSNo) >= 0) {
    //        if (IsChanged == false) { if (val.Planned == 0) { val.Planned = 1; val.isSelect == 1; val.ULDStockSNo = cfi.GetCFGrid("divUldShipmentSection").options.parentValue.toString(); } }
    //        else
    //        {
    //            if (val.isSelect == 1 && val.Planned == 0) { val.Planned = 1; val.ULDStockSNo = cfi.GetCFGrid("divUldShipmentSection").options.parentValue.toString(); }
    //        }
    //    }

    //});
    //IsChanged = false;

    /*End */





    // Changes by Vipin Kumar
    IsOffloadFromBulk = 0;
    // Ends
    var vgrid = cfi.GetCFGrid("divUldShipmentSection");
    var ULDType = "ULD";
    //var ULD_SNo = "";
    var SelectedULDNo = "";


    if (vgrid.options.parentValue.toString() != "") {
        GetAircraftCapacity(); // Get Aircraft Capacity
    }

    //******************For Closed ULD Details***********************/
    var isClosed = false;
    var ClosedULDNo = "";
    $.each(vgrid._data, function (i, item_Data) {
        if (item_Data.Status == "Closed" && vgrid.options.parentValue.toString() == item_Data.ULDStockSNo) {
            ClosedULDNo = item_Data.ULDNo.trim();
            isClosed = true;
            return false;
        }
    });
    $.each(vgrid._data, function (i, item_Data) {
        if (item_Data.ULDNo != "BULK" && vgrid.options.parentValue.toString() == item_Data.ULDStockSNo) {
            IsCartStatus = item_Data.IsCart == "true" || item_Data.IsCart == "1" ? "1" : "0";
            return false;
        } else {
            IsCartStatus = 0;

        }
    });
    if (isClosed) {
        if (IsCartStatus == 1) { ShowMessage('warning', 'Information', "Cart '" + ClosedULDNo + "' already closed."); } else {

            ShowMessage('warning', 'Information', "ULD '" + ClosedULDNo + "' already closed.");
        }
        return;
    }
    //Added by karan for Cart messate------------------
    if (IsCartStatus == 1) {
        ULDType = "Cart";
    } else {
        ULDType = "ULD";
    }
    //******************For BUP Shipment************************/
    var isAllowed = true;
    var ShipmentOD = "";
    var SPHC = "";
    var CheckAddedLen = 0;

    var TotalSelected = $("#divNonUldShipmentSection").find(".k-grid-content").find("input[type='checkbox']:checked").length;
    if (vgrid != undefined) {

        ULD_SNo = vgrid.options.parentValue.toString();

        $.each(vgrid._data, function (i, item_Data) {
            if ((item_Data.IsBUP == "1" || item_Data.IsBUP == "True") && vgrid.options.parentValue.toString() == item_Data.ULDStockSNo) {
                isAllowed = false;
                SelectedULDNo = item_Data.ULDNo;
                return false;
            }
        });

        //*****************Check For Mixed Load in ULD*****************************
        var childgrid = cfi.GetNestedCFGrid("div__" + vgrid.options.parentValue.toString())
        if (childgrid != undefined) {
            var cdatasource = childgrid.dataSource;
            var data = cdatasource.data();
            if (data != null && data.length > 0) {
                ShipmentOD = data[0].ShipmentDetail;
                ShipmentOD = ShipmentOD.split('-')[1]; // Get Destination City
                //Added By KK
                SPHC = data[0].SPHC;
                CheckAddedLen = data.length;
            }
        }
        //****************************************************************************

    }
    if (isAllowed == false && (TotalSelected > 0 || vgrid.options.parentValue.toString() == "0" ? "" : vgrid.options.parentValue.toString() != "")) {
        //alert(' \'' + SelectedULDNo + '\' accepted as Build Up/BUP. Cannot add more shipments');
        // alert(' \'' + SelectedULDNo + '\' arrived as Through, shipments cannot be added without ULD breakdown.');
        ShowMessage('warning', 'Information', "'" + SelectedULDNo + "' arrived as Through, shipments cannot be added without ULD breakdown.", "bottom-right");
        return;
    }

    /************Check ULD Status*********************************************/
    var IsULDPreManifested = false;

    $.each(vgrid._data, function (i, item_Data) {
        if (item_Data.ULDStatus == "PRE" && vgrid.options.parentValue.toString() == item_Data.ULDStockSNo.toString()) {
            IsULDPreManifested = true;
            SelectedULDNo = item_Data.ULDNo;
            return false;
        }
    });
    //TotalSelected > 0 || vgrid.options.parentValue.toString() != ""
    if (IsULDPreManifested == true && vgrid.options.parentValue.toString() > 0) {
        ShowMessage('warning', 'Information', "'" + SelectedULDNo + "' is already Pre-Manifested. Cannot add more shipments", "bottom-right");
        return;
    }
    /*********************************************************/

    var childgrid = null;
    var processedShipment = [];
    if (vgrid != undefined) {
        if (vgrid.options.parentValue.toString() != "") {
            var uldusedindex = -1;
            var uldtotalship = -1;

            var trUldHeader = $("#divUldShipmentSection").find(".k-grid-header");

            uldusedindex = trUldHeader.find("th[data-field='Used']").index();
            uldtotalship = trUldHeader.find("th[data-field='Shipments']").index();

            var trHeader = $("#divNonUldShipmentSection").find(".k-grid-header");

            var awbpcsindex = -1;
            var awbgrwtindex = -1;
            var awbvolwtindex = -1;

            var pcsindex = -1;
            var grwtindex = -1;
            var volwtindex = -1;
            var lipcsindex = -1;
            var loaddetailindex = -1;
            var weightdetailindex = -1;
            var CBMIndex = -1;

            pcsindex = trHeader.find("th[data-field='LoadPieces']").index();
            grwtindex = trHeader.find("th[data-field='LoadGrossWeight']").index();
            volwtindex = trHeader.find("th[data-field='LoadVol']").index();

            awbpcsindex = trHeader.find("th[data-field='Pieces']").index();
            awbgrwtindex = trHeader.find("th[data-field='GrossWeight']").index();
            awbvolwtindex = trHeader.find("th[data-field='VolumeWeight']").index();
            lipcsindex = trHeader.find("th[data-field='LIPieces']").index();
            loaddetailindex = trHeader.find("th[data-field='LoadDetail']").index();
            weightdetailindex = trHeader.find("th[data-field='WeightDetail']").index();
            var CBMIndex = trHeader.find("th[data-field='CBM']").index();

            var deleteddata = [];
            var deletedindex = [];
            var lyingdeleteddata = [];
            var offloaddeleteddata = [];
            var ulddatasource = vgrid.dataSource;
            var ulddata = ulddatasource.data();
            var childgrid = cfi.GetNestedCFGrid("div__" + vgrid.options.parentValue.toString())
            var cdatasource = childgrid.dataSource;
            var data = cdatasource.data();

            $.each(data, function (i, item) {
                if (item) {
                    var shipModel = {
                        AWBSNo: item.AWBSno
                    }
                    processedShipment.push(shipModel);
                }
            });
            if (processedShipment.length == 0) {
                var emptyShipModel = {
                    AWBSNo: 0
                }
                processedShipment.push(emptyShipModel);
            }

            var nonuldgrid = cfi.GetCFGrid("divNonUldShipmentSection");
            var nonuldgriddatasource = nonuldgrid.dataSource;
            var nonuldgriddata = nonuldgriddatasource.data();



            var trIndex = undefined;
            var selectedShipmentCount = 0;
            var invalidshipment = "";
            var successshipment = "";
            var successshipmentSNo = "";
            var alreadyonuldship = "";
            var notabletoprocessship = "";
            var uldmasterrow = undefined;
            var ulddataitem = undefined;
            var _sphc = "";


            selectedShipmentCount = $("#divNonUldShipmentSection").find(".k-grid-content").find("input[type='checkbox']:checked").length;

            //******************Check Mixed Load in ULD For Multiple Selected AWB**************
            if (selectedShipmentCount > 1 && nonuldgriddata != null && ULD_SNo != "0") {
                var IsConfirmData_mixed = true;
                var ismixedload_data = CheckMixedLoad(nonuldgriddata, $("#divNonUldShipmentSection").find(".k-grid-content").find("input[type='checkbox']:checked"), "Buildup");
                if (ismixedload_data) {
                    if (IsCartStatus == 0)
                        IsConfirmData_mixed = confirm('Planned shipments belong to different destinations. Do you wish to continue?');
                }
                if (IsConfirmData_mixed == false) {
                    return;
                }
            }
            //*****************Check SHC Compatibility************************************//
            if (ULD_SNo != "0") {
                var message_sphc = CheckSHCCompatibility(data, ULD_SNo, nonuldgriddata, $("#divNonUldShipmentSection").find(".k-grid-content").find("input[type='checkbox']:checked"), selectedShipmentCount)
                if (message_sphc != "") {
                    ShowMessage('warning', 'Information', message_sphc, "bottom-right");
                    return;
                }
            }
            //*****************Check Aircraft Capacity************************************//
            if (selectedShipmentCount > 0) {
                var message_sphc_capacity = CheckAircraftCapacity($("#divNonUldShipmentSection input[type='checkbox']:checked").closest("tr"), "NonULD");
                if (message_sphc_capacity != "") {
                    ShowMessage('warning', 'Information', message_sphc_capacity, "bottom-right");
                    return;
                }
            }
            //*****************************************************************************//

            $("#divNonUldShipmentSection").find(".k-grid-content").find("input[type='checkbox']:checked").each(function () {
                var closestTr = $(this).closest("tr");

                var pcsControl = closestTr.find("td:eq(" + loaddetailindex + ")").find("input[type='text'][id='txtPcs']");
                var grControl = closestTr.find("td:eq(" + loaddetailindex + ")").find("input[type='text'][id='txtGross']");
                var volControl = closestTr.find("td:eq(" + loaddetailindex + ")").find("input[type='text'][id='txtVol']");

                var uldpcs = parseInt(pcsControl.val());
                var uldgr = parseFloat(parseFloat(grControl.val()).toFixed(1));
                var uldvol = parseFloat(parseFloat(volControl.val()).toFixed(2));
                var uldCBM = parseFloat(parseFloat(closestTr.find("td:eq(" + CBMIndex + ")").text()).toFixed(3));



                debugger;
                trIndex = $(this).closest("tr").index();

                var avl_pcs = closestTr.find("td:eq(" + awbpcsindex + ")").text().split('/')[0];
                var avl_grwt = closestTr.find("td:eq(" + weightdetailindex + ") ").text().split('/')[0];
                var avl_volwt = closestTr.find("td:eq(" + weightdetailindex + ") ").text().split('/')[1];
                var avl_CBM = closestTr.find("td:eq(" + weightdetailindex + ") ").text().split('/')[2];

                if (avl_pcs != uldpcs && parseFloat(avl_volwt) == uldvol) {
                    ShowMessage('warning', 'Warning!', "AWB No. [" + nonuldgriddata[trIndex].AWBNo + "] -  Unable to process. Please check volume weight.", "bottom-right");
                    return;
                }
                else if (avl_pcs != uldpcs && parseFloat(avl_grwt) == uldgr) {
                    ShowMessage('warning', 'Warning!', "AWB No. [" + nonuldgriddata[trIndex].AWBNo + "] -  Unable to process. Please check gross weight.", "bottom-right");
                    return;
                }
                else if (uldpcs == 0) {
                    ShowMessage('warning', 'Warning!', "AWB No. [" + nonuldgriddata[trIndex].AWBNo + "] -  Unable to process. Planned piece should be greater than zero.", "bottom-right");
                    return;
                }
                else if (uldgr == 0) {
                    ShowMessage('warning', 'Warning!', "AWB No. [" + nonuldgriddata[trIndex].AWBNo + "] -  Unable to process. Gross Weight should be greater than zero.", "bottom-right");
                    return;
                }
                else if (uldvol == 0) {
                    ShowMessage('warning', 'Warning!', "AWB No. [" + nonuldgriddata[trIndex].AWBNo + "] -  Unable to process. Volume Weight should be greater than zero.", "bottom-right");
                    return;
                }
                /******************Check Aircraft Cargo Classification********/
                if (_ISPAX == "Yes" && nonuldgriddata[trIndex].SPHC.toLowerCase().indexOf("cao") >= 0) {
                    var msg = "AWB '" + nonuldgriddata[trIndex].AWBNo + "' with SHC-CAO ( Cargo Aircraft only ) not allowed on Passenger Flight '" + $('#Text_searchFlightNo').data("kendoAutoComplete").value().trim() + "'/" + $('#searchFlightDate').val() + "";
                    ShowMessage('warning', 'Warning!', msg, "bottom-right");
                    closestTr.find("input[type='checkbox']").removeAttr("checked");
                    return;
                }
                ////Nayak on 2020-03-13 Desc AWB from lying list and build to Bulk/ULD and flight destination is different from AWB destination than system will give warning "AWB Destination is different from Flight Destination" Do you want to continue 
                //if (nonuldgriddata != null) {
                //    var FlightActulaRoute = flightrouteStr;
                //    var selectedAWBDestinaton = nonuldgriddata[trIndex].ShipmentDetail;
                //    var AwbActulaRoute = selectedAWBDestinaton.split('-')[1];
                //    var IsConfirm = true;
                //    if (FlightActulaRoute.indexOf(AwbActulaRoute) != -1) {
                //        IsConfirm = true;
                //    } else {
                //        IsConfirm = confirm('Planned shipments belong to different destinations. Do you wish to continue?');
                //    }
                //    if (IsConfirm == false) {
                //        return;
                //    }
                //}
                /******************Check ULD MAX Weight Capacity****************/
                var _Message = "";
                if (ULD_SNo != "0") {
                    var IsConfirmDataULDCapacity = true;

                    //Added by karan for not checking cart weight capacity in narrow body-----------------
                    if (IsNarrowBodyAircraft == 0 && IsCartStatus == 0) {
                        _Message = CheckULDMaxWeightCapacity(vgrid, uldgr);
                    }
                    if (_Message != "" && IsCartStatus == 0) {

                        IsConfirmDataULDCapacity = confirm(_Message);

                        if (IsConfirmDataULDCapacity == false) {
                            return;
                        }
                    }
                }
                //******************Check Mixed Load in ULD*******************
                var IsConfirmData = true;

                if (nonuldgriddata != null) {
                    var selectedAWB = "";
                    selectedAWB = nonuldgriddata[trIndex].ShipmentDetail;

                    selectedAWB = selectedAWB.split('-')[1]; // Get Destination City



                    if (ULD_SNo != "0" && ShipmentOD != "" && ShipmentOD != selectedAWB) {
                        if (IsCartStatus == 0)
                            IsConfirmData = confirm('Planned shipments belong to different destinations. Do you wish to continue?');
                    }

                    if (IsConfirmData == false) {
                        return;
                    }
                }
                //************************************************************

                if (uldpcs > 0) {
                    var isValidShipment = false;
                    var CheckedAWBSNo = nonuldgriddata[trIndex].AWBSNo;

                    /*Check and Locked AWB Coded By Brajendra On May-28-2017*/
                    var msg = GetAWBLockedEvent(userContext.UserSNo, CheckedAWBSNo, 0, "", "", "30");
                    if (msg == "Fail") { $(this).attr("checked", false); return false };
                    SaveUpdateLockedProcess(CheckedAWBSNo, "", "", "", userContext.UserSNo, "31", 'FlightBuildUp', $(this).is(":checked") == true ? 1 : 0, "");

                    /*End*/


                    _sphc = nonuldgriddata[trIndex].SPHC;
                    $.ajax({
                        url: "Services/BuildUp/BuildUpProcessService.svc/CheckForSPHCRestriction", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
                        //data: JSON.stringify({ ProcessedShipmentInfo: processedShipment, ULDStockSNo: vgrid.options.parentValue.toString(), AircraftTypeSNo: aircraftTypeSno, CheckedAWBSNo: CheckedAWBSNo }),
                        data: JSON.stringify({ ProcessedShipmentInfo: processedShipment, ULDStockSNo: nonuldgriddata[trIndex].SPHC, AircraftTypeSNo: aircraftTypeSno.toString() == '' ? 0 : aircraftTypeSno.toString(), CheckedAWBSNo: CheckedAWBSNo }),
                        success: function (result) {
                            if (result == "0")
                                isValidShipment = false;
                            else {
                                var validShipModel = {
                                    AWBSNo: CheckedAWBSNo
                                }
                                processedShipment.push(validShipModel);
                                isValidShipment = true;
                            }
                        }
                    });

                    /*Added By Brajendra For check offpoint is domestic or international */

                    //var IsULDInternational = "";
                    //var IsShipmentInternational = "";
                    //$.ajax({
                    //    url: "Services/BuildUp/BuildUpProcessService.svc/IsInternationalOffpoint",
                    //    async: false,
                    //    type: "POST",
                    //    cache: false,
                    //    contentType: "application/json; charset=utf-8",
                    //    data: JSON.stringify({ UldOffPoint: FlightNextDestination, ShipmentDestination: nonuldgriddata[trIndex].ShipmentDetail.split('-')[1] }),
                    //    success: function (result) {
                    //        var table = JSON.parse(result);
                    //        IsULDInternational = table.Table0[0].IsInternational;
                    //        IsShipmentInternational = table.Table1[0].IsInternational;
                    //    }
                    //});

                    //if (IsULDInternational == 1 && IsShipmentInternational == 0 && cfi.GetCFGrid("divUldShipmentSection").options.parentValue.toString() > 0) { ShowMessage('warning', 'Warning - Offpoint', "Domestic shipment cann't be built with international ULD.", "bottom-right"); return false; }

                    /*End*/

                    /*Added By Brajendra For QRT shipment on 11-Oct-2017*/

                    //var detailgridQRT = cfi.GetCFGrid("divNonUldShipmentSection");
                    //var detaildatasourceQRT = detailgridQRT.dataSource;
                    //var detaildataQRT = detaildatasourceQRT.data();
                    //var dataDetails = detaildataQRT[trIndex];

                    //if (ULD_SNo != "0")
                    //    if (dataDetails != null) {
                    //        var selectedAWB = "";
                    //        var ListSPHC = ""; var currentSelectedSPHC = "";
                    //        var IsConfirm = true;
                    //        var SelectedSPHC = dataDetails.SPHC;
                    //        if (SPHC != "") {
                    //            var SPHCArr = SPHC.split(",");
                    //            for (var i = 0; i < SPHCArr.length; i++) {
                    //                if (SPHCArr[i].toUpperCase() == "QRT") {
                    //                    ListSPHC = "QRT";
                    //                }
                    //            }
                    //        }
                    //        if (SelectedSPHC != "") {
                    //            var SPHCArr1 = SelectedSPHC.split(",");
                    //            for (var i = 0; i < SPHCArr1.length; i++) {
                    //                if (SPHCArr1[i].toUpperCase() == "QRT") {
                    //                    currentSelectedSPHC = "QRT";
                    //                }
                    //            }
                    //        }
                    //        if (CheckAddedLen > 0) {
                    //            if (SPHC == "" || ListSPHC == "") {
                    //                if (currentSelectedSPHC == "QRT") {
                    //                    ShowMessage('warning', 'Warning - BuildUp', "QRT shipments can not be planned with non QRT shipments", "bottom-right");
                    //                    return;
                    //                }
                    //            }

                    //            if (SPHC != "" && ListSPHC == "QRT") {
                    //                if (currentSelectedSPHC != "QRT") {
                    //                    ShowMessage('warning', 'Warning - BuildUp', "Non QRT shipments can not be planned with QRT shipments", "bottom-right");
                    //                    return;
                    //                }
                    //            }

                    //            /*Added By Brajendra for check destination for QRT shipment*/
                    //            if (dataDetails.ShipmentDetail == undefined) {
                    //                selectedAWB = dataDetails.OriginCity + '-' + dataDetails.ShipmentDestination;
                    //            }
                    //            else {
                    //                selectedAWB = dataDetails.ShipmentDetail.length > 7 ? dataDetails.ShipmentDetail.substring(0, 7) : dataDetails.ShipmentDetail;
                    //            }

                    //            selectedAWB = selectedAWB.split('-')[1]; // Get Destination City

                    //            if (ULD_SNo != "0" && ShipmentOD != "" && ShipmentOD != selectedAWB) {
                    //                ShowMessage('warning', 'Warning - Diffrent Destinatioin', "QRT shipments belong to different destinations.", "bottom-right");
                    //            }
                    //            /*End*/
                    //        }

                    //    }

                    /*End*/



                    /*Added By Brajendra to check ULD SHC compare to Shipment SHC On 9-Sept-2017*/

                    var IsCompatibleSHC = false;
                    var vgridForSHC = cfi.GetCFGrid("divUldShipmentSection");
                    $.each(vgridForSHC._data, function (i, item_Data) {
                        if (vgridForSHC.options.parentValue.toString() == item_Data.ULDStockSNo) {
                            if ((_sphc.indexOf(item_Data.SHC) >= 0 && item_Data.ULDStockSNo > 0) || item_Data.SHC == "") IsCompatibleSHC = true;
                        }
                    });
                    if (!IsCompatibleSHC) {
                        //Added by karan for cart Message --------------------------
                        if (IsCartStatus == 1) {
                            ShowMessage('warning', 'Warning - Move To Cart', "Selected shipment's SHC is not matching with Cart's SHC.", "bottom-right");
                        }
                        else {
                            ShowMessage('warning', 'Warning - Move To ULD', "Selected shipment's SHC is not matching with ULD's SHC.", "bottom-right");
                        }
                        return true;
                    }

                    /* End By Brajendra */


                    if (isValidShipment) {

                        /*Pomail worked on 23-Oct-2017 below content is coming from above*/

                        var grid = $("#divNonUldShipmentSection").find(".k-grid").data('kendoGrid');
                        var checkedData = $.map($("#divNonUldShipmentSection").find(".k-grid-content").find("input[type='checkbox']:checked"), function (checkbox) {
                            var dataItem = grid.dataSource.getByUid($(checkbox).closest('tr').attr('data-uid'));
                            return dataItem.MCBookingSNo;

                        });
                        var plndPcs = uldpcs;
                        $.each(POMailDetailsArray, function (index, val) {

                            if (checkedData.join(',').indexOf(val.MCBookingSNo) >= 0 && plndPcs > 0) {

                                if (IsChanged == false) {
                                    if (val.Planned == 0) {
                                        val.Planned = 1; val.isSelect == 1; val.ULDStockSNo = cfi.GetCFGrid("divUldShipmentSection").options.parentValue.toString();
                                        plndPcs--;
                                    }
                                }
                                else {
                                    if (val.isSelect == 1 && val.Planned == 0) { val.Planned = 1; val.ULDStockSNo = cfi.GetCFGrid("divUldShipmentSection").options.parentValue.toString(); }
                                }
                            }

                        });

                        /*End Pomail*/

                        var alreadyonulddata = $.grep(executedship, function (e, index) {
                            if (e.FromTableSNo == nonuldgriddata[trIndex].FromTableSNo && e.FromTable != 3 && e.FromTable == nonuldgriddata[trIndex].FromTable && e.AWBSNo == nonuldgriddata[trIndex].AWBSNo && e.FromTableTotalPieces < e.ExecutedPieces + uldpcs) {
                                return e;
                            }
                        });
                        if (alreadyonulddata.length == 0) {
                            var alreadyexecuteddata = $.grep(executedship, function (e, index) {
                                if (e.FromTableSNo == nonuldgriddata[trIndex].FromTableSNo && e.FromTable != 3 && e.FromTable == nonuldgriddata[trIndex].FromTable && e.AWBSNo == nonuldgriddata[trIndex].AWBSNo) {
                                    e.ExecutedPieces = e.ExecutedPieces + uldpcs;
                                    return e;
                                }
                            });

                            /*Added By Brajendra For Getting Destinatioin on behalf of FPSNo*/
                            var fpDestination = "";
                            $.ajax({
                                url: "Services/BuildUp/BuildUpProcessService.svc/GetDestinationAgainstFPSNo",
                                async: false,
                                type: "POST",
                                cache: false,
                                contentType: "application/json; charset=utf-8",
                                data: JSON.stringify({ FPSNo: (nonuldgriddata[trIndex].FPSNo == null ? 0 : nonuldgriddata[trIndex].FPSNo) }),
                                success: function (result) {
                                    fpDestination = result || "abc";
                                }
                            });
                            /*End*/
                            // Add BY Sushant : On 21-11-2019 Desc : If Flight is multisector  then below condition should be applied ..
                            if (flightrouteStr.length > 3) {
                                var str1 = flightrouteStr;
                                var AwbFound = nonuldgriddata[trIndex].ShipmentDetail.split('-')[1];
                                if (str1.indexOf(AwbFound) != -1) {
                                    FlightNextDestination = AwbFound;
                                } else {
                                    FlightNextDestination = "";
                                }
                            }

                            var ToUldShipmentModel = {
                                AWBSno: nonuldgriddata[trIndex].AWBSNo,
                                FPSNo: nonuldgriddata[trIndex].FPSNo,
                                AwbNo: nonuldgriddata[trIndex].AWBNo,
                                Pieces: uldpcs,
                                GrossWeight: uldgr,
                                VolumeWeight: uldvol,
                                SPHC: nonuldgriddata[trIndex].SPHC,
                                ULDStockSNo: cdatasource.options.parentValue,
                                FromTable: nonuldgriddata[trIndex].FromTable,
                                FromTableSNo: nonuldgriddata[trIndex].FromTableSNo,
                                FromTableTotalPieces: nonuldgriddata[trIndex].LIPieces,
                                ShipmentDetail: nonuldgriddata[trIndex].ShipmentDetail,
                                AWBPieces: nonuldgriddata[trIndex].AWBPieces,
                                AWBGrossWeight: nonuldgriddata[trIndex].AWBGrossWeight,
                                AWBVolumeWeight: nonuldgriddata[trIndex].AWBVolumeWeight,
                                OffloadStage: nonuldgriddata[trIndex].OffloadStage,
                                AWBOffPoint: (flightrouteStr.indexOf(fpDestination) != -1) ? fpDestination : FlightNextDestination,
                                ConnectingFlight: "",
                                MCBookingSNo: nonuldgriddata[trIndex].MCBookingSNo,
                                ShipmentType: nonuldgriddata[trIndex].ShipmentType,
                                Status: nonuldgriddata[trIndex].Status,
                                AWBCBM: parseFloat(nonuldgriddata[trIndex].AWBCBM).toFixed(3),
                                CBM: uldCBM,
                                IsPlanned: nonuldgriddata[trIndex].IsPlanned,
                                ShipmentId: nonuldgriddata[trIndex].IsPlanned == '0' ? 'UnPlanned_0_0_0' : nonuldgriddata[trIndex].ShipmentId,
                                Priority: nonuldgriddata[trIndex].Priority,
                                //Action: nonuldgriddata[trIndex].Action == '0' ? '' : '<a id="' + nonuldgriddata[trIndex].ShipmentId + '" onclick=\"fnMoveToLyingList(this);\"><i class=\"fa fa-mail-forward\" style=\"font-size:15px;\" title=\"Move to Lying List\"></i></a>'
                                //  Action: nonuldgriddata[trIndex].Action
                                Action: '',
                                HDQ: ''
                                //IsChanged: nonuldgriddata[trIndex].IsChanged,
                                //OffloadStage: nonuldgriddata[trIndex].OffloadStage
                            }
                            var alreadyprsulddata = $.grep(processedawb, function (e, index) {
                                if (e.FromTableSNo == nonuldgriddata[trIndex].FromTableSNo && e.FromTable == nonuldgriddata[trIndex].FromTable && e.AWBSno == nonuldgriddata[trIndex].AWBSNo && e.ULDStockSNo == cdatasource.options.parentValue) {
                                    return e;
                                }
                            });
                            if (alreadyprsulddata.length == 0) {
                                processedawb.push(ToUldShipmentModel);
                            }
                            else {
                                var alreadyprsship = $.grep(processedawb, function (e, index) {
                                    if (e.FromTableSNo == nonuldgriddata[trIndex].FromTableSNo && e.FromTable == nonuldgriddata[trIndex].FromTable && e.AWBSno == nonuldgriddata[trIndex].AWBSNo && e.ULDStockSNo == cdatasource.options.parentValue) {
                                        e.Pieces = e.Pieces + uldpcs;
                                        e.GrossWeight = parseFloat(e.GrossWeight + uldgr).toFixed(1);
                                        e.VolumeWeight = parseFloat(e.VolumeWeight + uldvol).toFixed(2);
                                        e.CBM = parseFloat(parseFloat(e.CBM) + parseFloat(uldCBM)).toFixed(3);
                                        e.IsPlanned = e.IsPlanned,
                                            e.ShipmentId = e.IsPlanned == '0' ? 'UnPlanned_0_0_0' : e.ShipmentId,
                                            //e.Action = e.Action
                                            //e.Action = e.Action == '0' ? '' : '<a id="' + e.ShipmentId + '" onclick=\"fnMoveToLyingList(this);\"><i class=\"fa fa-mail-forward\" style=\"font-size:15px;\" title=\"Move to Lying List\"></i></a>'
                                            e.Action = e.Action
                                        return e;
                                    }
                                });

                            }
                            if (alreadyexecuteddata.length == 0) {
                                var ship = {
                                    AWBSNo: nonuldgriddata[trIndex].AWBSNo,
                                    FromTable: nonuldgriddata[trIndex].FromTable,
                                    FromTableSNo: nonuldgriddata[trIndex].FromTableSNo,
                                    FromTableTotalPieces: nonuldgriddata[trIndex].LIPieces,
                                    ExecutedPieces: uldpcs,
                                    //IsPlanned: '0'
                                    //ShipmentId: 'UnPlanned_0'
                                    IsPlanned: nonuldgriddata[trIndex].IsPlanned,
                                    ShipmentId: nonuldgriddata[trIndex].IsPlanned == '0' ? 'UnPlanned_0_0_0' : nonuldgriddata[trIndex].ShipmentId,
                                    //Action: nonuldgriddata[trIndex].Action
                                    //Action: nonuldgriddata[trIndex].Action == '0' ? '' : '<a id="' + nonuldgriddata[trIndex].ShipmentId + '" onclick=\"fnMoveToLyingList(this);\"><i class=\"fa fa-mail-forward\" style=\"font-size:15px;\" title=\"Move to Lying List\"></i></a>'
                                    Action: nonuldgriddata[trIndex].Action
                                };
                                executedship.push(ship);
                            }
                            var nonulddata = nonuldgriddata[trIndex];
                            for (var i = processedawb.length - 1; i >= 0; i--) {
                                //Commented by karan------------------///////////////////////////
                                if (processedawb[i].FromTableSNo == nonulddata.FromTableSNo && processedawb[i].FromTable == nonulddata.FromTable && processedawb[i].AWBSno == nonulddata.AWBSNo && processedawb[i].ULDStockSNo == -1) {
                                    //   if ( processedawb[i].FromTable == nonulddata.FromTable && processedawb[i].AWBSno == nonulddata.AWBSNo && processedawb[i].ULDStockSNo == -1) {
                                    processedawb.splice(i, 1);
                                    // NAYAK Checking 
                                }
                            }
                            var remainingPcs = parseInt(nonulddata.Pieces.split('/')[0]) - parseInt(ToUldShipmentModel.Pieces);
                            var gr_wt = 0, vol_wt = 0, CBM_wt = 0;
                            if (remainingPcs > 0) {
                                nonulddata.Pieces = remainingPcs.toString() + "/" + nonulddata.AWBPieces;

                                /*********Added By Haider************************/

                                var totalGrossWt = 0, totalVolWt = 0, totalCBM = 0;

                                totalGrossWt = parseFloat(ToUldShipmentModel.AWBGrossWeight);
                                totalVolWt = parseFloat(ToUldShipmentModel.AWBVolumeWeight);
                                totalCBM = parseFloat(ToUldShipmentModel.AWBCBM);



                                gr_wt = (parseFloat(ToUldShipmentModel.AWBGrossWeight) - ToUldShipmentModel.GrossWeight).toFixed(1);
                                vol_wt = (parseFloat(ToUldShipmentModel.AWBVolumeWeight) - ToUldShipmentModel.VolumeWeight).toFixed(2);
                                CBM_wt = parseFloat(parseFloat(ToUldShipmentModel.AWBCBM) - parseFloat(ToUldShipmentModel.CBM)).toFixed(3);
                                nonulddata.AWBGrossWeight = gr_wt;
                                nonulddata.AWBVolumeWeight = vol_wt;
                                nonulddata.AWBCBM = CBM_wt;
                                /***********************************************/

                                nonulddata.GrossWeight = (parseFloat(nonulddata.GrossWeight) - parseFloat(ToUldShipmentModel.GrossWeight)).toFixed(1);
                                nonulddata.VolumeWeight = (parseFloat(nonulddata.VolumeWeight) - parseFloat(ToUldShipmentModel.VolumeWeight)).toFixed(2);
                                nonulddata.CBM = parseFloat(parseFloat(nonulddata.CBM) - parseFloat(ToUldShipmentModel.CBM)).toFixed(3);
                                //nonulddata.IsPlanned = '0';
                                //nonulddata.ShipmentId = 'UnPlanned_0'
                                nonulddata.IsPlanned = nonulddata.IsPlanned;
                                nonulddata.ShipmentId = nonulddata.IsPlanned == '0' ? 'UnPlanned_0_0_0' : nonulddata.ShipmentId;
                                nonulddata.Action = nonulddata.Action;

                                closestTr.find("td:eq(" + weightdetailindex + ") ").text(nonulddata.AWBGrossWeight + "/" + nonulddata.AWBVolumeWeight + "/" + nonulddata.AWBCBM);

                                closestTr.find("td:eq(" + awbpcsindex + ")").text(nonulddata.Pieces);
                                grControl.val(parseFloat(nonulddata.GrossWeight).toFixed(1));
                                volControl.val(parseFloat(nonulddata.VolumeWeight).toFixed(2));
                                pcsControl.val(remainingPcs.toString());

                                closestTr.find("td:eq(" + CBMIndex + ") ").text(parseFloat(nonulddata.CBM).toFixed(3));

                                closestTr.find("td:eq(" + grwtindex + ") ").text(parseFloat(nonulddata.GrossWeight).toFixed(1));
                                closestTr.find("td:eq(" + volwtindex + ") ").text(parseFloat(nonulddata.VolumeWeight).toFixed(2));
                                closestTr.find("input[type='checkbox']").attr("checked", !closestTr.find("input[type='checkbox']:checked"));

                                processedawb.push({
                                    AWBSno: nonulddata.AWBSNo,
                                    FPSNo: nonulddata.FPSNo,
                                    AwbNo: nonulddata.AWBNo,
                                    Pieces: remainingPcs,
                                    GrossWeight: parseFloat(nonulddata.GrossWeight).toFixed(1),
                                    VolumeWeight: parseFloat(nonulddata.VolumeWeight).toFixed(2),
                                    SPHC: nonulddata.SPHC,
                                    ULDStockSNo: -1,
                                    FromTable: nonulddata.FromTable,
                                    FromTableSNo: nonulddata.FromTableSNo,
                                    ShipmentDetail: nonulddata.ShipmentDetail,
                                    FromTableTotalPieces: nonulddata.LIPieces,
                                    AWBPieces: nonulddata.AWBPieces,
                                    AWBGrossWeight: nonulddata.AWBGrossWeight,
                                    AWBVolumeWeight: nonulddata.AWBVolumeWeight,
                                    AWBOffPoint: (flightrouteStr.indexOf(fpDestination) != -1) ? fpDestination : FlightNextDestination,
                                    ConnectingFlight: "",
                                    MCBookingSNo: nonulddata.MCBookingSNo,
                                    ShipmentType: nonulddata.ShipmentType,
                                    Status: nonulddata.Status,
                                    AWBCBM: parseFloat(nonulddata.AWBCBM).toFixed(3),
                                    CBM: parseFloat(nonulddata.CBM).toFixed(3),
                                    //IsPlanned: '0',
                                    //ShipmentId: 'UnPlanned_0'
                                    IsPlanned: nonulddata.IsPlanned,
                                    ShipmentId: nonulddata.IsPlanned == '0' ? "UnPlanned_0_0_0" : nonulddata.ShipmentId,
                                    Priority: nonulddata.Priority,
                                    //Action: nonulddata.Action == '0' ? '' : '<a id="' + nonulddata.ShipmentId + '" onclick=\"fnMoveToLyingList(this);\"><i class=\"fa fa-mail-forward\" style=\"font-size:15px;\" title=\"Move to Lying List\"></i></a>'
                                    Action: nonulddata.Action
                                    //IsChanged: nonulddata.IsChanged,
                                    //OffloadStage: nonuldgriddata[trIndex].OffloadStage
                                });

                                //deleteddata.push(nonulddata);
                                //offloadgriddatasource.insert(FromUldShipmentModel);
                            }
                            else {
                                deleteddata.push(nonulddata);
                            }

                            /*--------If Chlid Data exists in selected ULD----------------------*/
                            var existingshipdata = $.grep(cdatasource.data(), function (e, index) {
                                if (e.AWBSno == nonuldgriddata[trIndex].AWBSNo) {
                                    matchingdataitem = e;
                                    ToUldShipmentModel.GrossWeight = parseFloat(parseFloat(e.GrossWeight) + uldgr).toFixed(1);
                                    ToUldShipmentModel.VolumeWeight = parseFloat(parseFloat(e.VolumeWeight) + uldvol).toFixed(2);
                                    ToUldShipmentModel.Pieces = parseInt(e.Pieces) + uldpcs;
                                    ToUldShipmentModel.CBM = parseFloat(e.CBM) + parseFloat(uldCBM);

                                    /*---Added By Brajendra for when data come from LI For i.e. 10,10,10,10,10 and 10 planned from 50 on 9-Oct-2017*/
                                    nonuldgriddata[trIndex].LoadPieces = parseInt(nonuldgriddata[trIndex].Pieces.split('/')[0]);
                                    nonuldgriddata[trIndex].LoadGrossWeight = parseFloat(nonuldgriddata[trIndex].GrossWeight).toFixed(1);
                                    nonuldgriddata[trIndex].LoadVol = parseFloat(nonuldgriddata[trIndex].VolumeWeight).toFixed(2);
                                    nonuldgriddata[trIndex].LoadCBM = parseFloat(nonuldgriddata[trIndex].CBM).toFixed(3);
                                    //nonuldgriddata[trIndex].IsPlanned = '0';
                                    //nonuldgriddata[trIndex].ShipmentId = 'UnPlanned_0'
                                    nonuldgriddata[trIndex].IsPlanned = nonuldgriddata[trIndex].IsPlanned;
                                    nonuldgriddata[trIndex].ShipmentId = nonuldgriddata[trIndex].IsPlanned == '0' ? "UnPlanned_0_0_0" : nonuldgriddata[trIndex].ShipmentId;
                                    //nonuldgriddata[trIndex].Action = nonuldgriddata[trIndex].Action;
                                    //nonuldgriddata[trIndex].Action = nonuldgriddata[trIndex].Action == '0' ? '' : '<a id="' + nonuldgriddata[trIndex].ShipmentId + '" onclick=\"fnMoveToLyingList(this);\"><i class=\"fa fa-mail-forward\" style=\"font-size:15px;\" title=\"Move to Lying List\"></i></a>'
                                    nonuldgriddata[trIndex].Action = nonuldgriddata[trIndex].Action
                                    return e;
                                }
                                else {
                                    //****************Added By Haider************************/
                                    $(nonuldgriddata).each(function (index, item) {
                                        if (e.AWBSno != nonuldgriddata[trIndex].AWBSNo) {
                                            nonuldgriddata[index].LoadPieces = parseInt(item.Pieces.split('/')[0]);
                                            nonuldgriddata[index].LoadGrossWeight = parseFloat(item.GrossWeight).toFixed(1);
                                            nonuldgriddata[index].LoadVol = parseFloat(item.VolumeWeight).toFixed(2);
                                            nonuldgriddata[index].LoadCBM = parseFloat(item.CBM).toFixed(3);
                                            //nonuldgriddata[index].IsPlanned = '0';
                                            //nonuldgriddata[index].ShipmentId = 'UnPlanned_0'
                                            nonuldgriddata[index].IsPlanned = item.IsPlanned;
                                            nonuldgriddata[index].ShipmentId = item.IsPlanned == '0' ? 'UnPlanned_0_0_0' : item.ShipmentId;
                                            //nonuldgriddata[index].Action = item.Action;
                                            //nonuldgriddata[index].Action = item.Action == '0' ? '' : '<a id="' + item.ShipmentId + '" onclick=\"fnMoveToLyingList(this);\"><i class=\"fa fa-mail-forward\" style=\"font-size:15px;\" title=\"Move to Lying List\"></i></a>'
                                            nonuldgriddata[index].Action = item.Action
                                        }
                                    });
                                }
                            });


                            if (existingshipdata.length == 0) {
                                /*---------If Child Data does not exists in selected ULD(03-Nov-2016)-------------------------------*/
                                $(nonuldgriddata).each(function (index, item) {
                                    nonuldgriddata[index].LoadPieces = parseInt(item.Pieces.split('/')[0]);
                                    nonuldgriddata[index].LoadGrossWeight = item.GrossWeight;
                                    nonuldgriddata[index].LoadVol = item.VolumeWeight;
                                    nonuldgriddata[index].LoadCBM = item.CBM;
                                    nonuldgriddata[index].WeightDetail = item.GrossWeight + "/" + item.VolumeWeight + "/" + parseFloat(item.CBM).toFixed(3);
                                    //nonuldgriddata[index].IsPlanned = '0';
                                    //nonuldgriddata[index].ShipmentId = 'UnPlanned_0'
                                    nonuldgriddata[index].IsPlanned = item.IsPlanned;
                                    nonuldgriddata[index].ShipmentId = item.IsPlanned == '0' ? 'UnPlanned_0_0_0' : item.ShipmentId;
                                    //nonuldgriddata[index].Action = item.Action;
                                    //nonuldgriddata[index].Action = item.Action == '0' ? '' : '<a id="' + item.ShipmentId + '" onclick=\"fnMoveToLyingList(this);\"><i class=\"fa fa-mail-forward\" style=\"font-size:15px;\" title=\"Move to Lying List\"></i></a>'
                                    nonuldgriddata[index].Action = item.Action
                                });
                                /*----------------------------------------*/
                                cdatasource.insert(ToUldShipmentModel);
                            }
                            else {

                                cdatasource.pushUpdate(ToUldShipmentModel);
                            }


                            if (uldmasterrow == undefined || ulddataitem == undefined) {
                                uldmasterrow = $("#div__" + vgrid.options.parentValue.toString()).closest("tr.k-detail-row").prev();
                                ulddataitem = vgrid.dataItem(uldmasterrow);

                            }
                            var usedgrwt = parseFloat(parseFloat(ulddataitem.GrossWeight) + uldgr).toFixed(1);
                            var usedvolwt = parseFloat(parseFloat(ulddataitem.VolumeWeight) + uldvol).toFixed(2);
                            var usedCBM = parseFloat(parseFloat(ulddataitem.CBM) + parseFloat(uldCBM)).toFixed(3);
                            //if(usedgrwt > ulddataitem.) 
                            ulddataitem.GrossWeight = usedgrwt;
                            ulddataitem.VolumeWeight = usedvolwt;
                            ulddataitem.CBM = usedCBM;
                            ulddataitem.Used = ulddataitem.GrossWeight + " / " + ulddataitem.VolumeWeight;// + " / " + ulddataitem.CBM;
                            ulddataitem.Shipments = parseInt(cdatasource.data().length);// parseInt(ulddataitem.Shipments) + 1;//Farogh Haider

                            uldmasterrow.find("td:eq(" + uldusedindex + ")").text(ulddataitem.Used);
                            uldmasterrow.find("td:eq(" + uldtotalship + ")").text(cdatasource.data().length);

                            successshipment = successshipment + (successshipment == "" ? "" : " , ") + "[" + nonuldgriddata[trIndex].AWBNo + "]";

                            successshipmentSNo = successshipmentSNo + (successshipmentSNo == "" ? "" : " , ") + nonuldgriddata[trIndex].AWBSNo;

                            /**********Check ULD Type in Build UP List(Moved in ULD/BULK)*********************/
                            if (ulddataitem != undefined && ulddataitem.ULDNo == "BULK") {
                                ULDType = "BULK";
                            }
                            /**********************************************************************************/
                        }
                        else {
                            alreadyonuldship = alreadyonuldship + (alreadyonuldship == "" ? "" : " , ") + "[" + nonuldgriddata[trIndex].AWBNo + "]";
                        }
                    }
                    else {
                        notabletoprocessship = notabletoprocessship + (notabletoprocessship == "" ? "" : " , ") + "[" + nonuldgriddata[trIndex].AWBNo + "]";
                    }
                }
                else {
                    invalidshipment = invalidshipment + (invalidshipment == "" ? "" : " , ") + "[" + nonuldgriddata[trIndex].AWBNo + "]";
                }

            });
            trHeader = $("#divLyingListSection").find(".k-grid-header").find("tr[role='row']");

            var awbpcsindex = -1;
            var awbgrwtindex = -1;
            var awbvolwtindex = -1;

            var pcsindex = -1;
            var grwtindex = -1;
            var volwtindex = -1;
            var lipcsindex = -1;
            var loaddetailindex = -1;
            var weightdetailindex = -1;
            var CBMIndex = -1;

            pcsindex = trHeader.find("th[data-field='LoadPieces']").index();
            grwtindex = trHeader.find("th[data-field='LoadGrossWeight']").index();
            volwtindex = trHeader.find("th[data-field='LoadVol']").index();

            awbpcsindex = trHeader.find("th[data-field='Pieces']").index();
            awbgrwtindex = trHeader.find("th[data-field='GrossWeight']").index();
            awbvolwtindex = trHeader.find("th[data-field='VolumeWeight']").index();
            lipcsindex = trHeader.find("th[data-field='LIPieces']").index();
            loaddetailindex = trHeader.find("th[data-field='LoadDetail']").index();
            weightdetailindex = trHeader.find("th[data-field='WeightDetail']").index();
            CBMIndex = trHeader.find("th[data-field='CBM']").index();

            var lyinggrid = cfi.GetCFGrid("divLyingListSection");
            if (lyinggrid != undefined) {
                var lyinggriddatasource = lyinggrid.dataSource;
                var lyinggriddata = lyinggriddatasource.data();
                selectedShipmentCount = selectedShipmentCount + $("#divLyingListSection").find(".k-grid-content").find("input[type='checkbox']:checked").length;



                //******************Check Mixed Load in ULD For Multiple Selected AWB**************
                if (selectedShipmentCount > 1 && lyinggriddata != null) {
                    var IsConfirmData_mixed_lying = true;
                    var ismixedload_data = CheckMixedLoad(lyinggriddata, $("#divLyingListSection").find(".k-grid-content").find("input[type='checkbox']:checked"), "LyingList");
                    if (ismixedload_data) {
                        if (IsCartStatus == 0)
                            IsConfirmData_mixed_lying = confirm('Planned shipments belong to different destinations. Do you wish to continue?');
                    }
                    if (IsConfirmData_mixed_lying == false) {
                        return;
                    }
                }
                //*****************Check SHC Compatibility************************************//
                if (ULD_SNo != "0") {
                    var message_sphc = CheckSHCCompatibility(data, ULD_SNo, lyinggriddata, $("#divLyingListSection").find(".k-grid-content").find("input[type='checkbox']:checked"), selectedShipmentCount)
                    if (message_sphc != "") {
                        ShowMessage('warning', 'Information', message_sphc, "bottom-right");
                        return;
                    }
                }
                //*****************Check Aircraft Capacity-Lying List************************************//
                if (selectedShipmentCount > 0) {
                    var message_sphc_capacity = CheckAircraftCapacity($("#divLyingListSection input[type='checkbox']:checked").closest("tr"), "NonULDLyingList");
                    if (message_sphc_capacity != "") {
                        ShowMessage('warning', 'Information', message_sphc_capacity, "bottom-right");
                        return;
                    }
                }
                //*****************************************************************************//

                $("#divLyingListSection").find(".k-grid-content").find("input[type='checkbox']:checked").each(function () {
                    var closestTr = $(this).closest("tr");
                    var trIndex = $(this).closest("tr").index();

                    var pcsControl = closestTr.find("td:eq(" + loaddetailindex + ")").find("input[type='text'][id='txtLPcs']");
                    var grControl = closestTr.find("td:eq(" + loaddetailindex + ")").find("input[type='text'][id='txtLGross']");
                    var volControl = closestTr.find("td:eq(" + loaddetailindex + ")").find("input[type='text'][id='txtLVol']");


                    //New Part Pcs/GrWt/CBM00001
                    var uldpcs = parseInt(pcsControl.val());
                    var uldgr = parseFloat(parseFloat(grControl.val()).toFixed(1));
                    var uldvol = parseFloat(parseFloat(volControl.val()).toFixed(2));
                    var uldCBM = parseFloat(parseFloat(closestTr.find("td:eq(" + CBMIndex + ")").text()).toFixed(3));
                    //Added by karan on 8 april for lying list move to uld shipment issue after search lying list.
                    var lyingddata = lyinggriddatasource.getByUid($(this).closest("tr").attr('data-uid'));
                    //var lyingddata = lyinggriddata[trIndex];
                    //ALL Pcs/GrWt/VolWt.00002
                    var avl_pcs = closestTr.find("td:eq(" + awbpcsindex + ")").text().split('/')[0];
                    var avl_grwt = closestTr.find("td:eq(" + weightdetailindex + ") ").text().split('/')[0];
                    var avl_volwt = closestTr.find("td:eq(" + weightdetailindex + ") ").text().split('/')[1];
                    var avl_CBM = closestTr.find("td:eq(" + weightdetailindex + ") ").text().split('/')[2];


                    if (avl_pcs != uldpcs && parseFloat(avl_volwt) == uldvol) {
                        ShowMessage('warning', 'Warning!', "AWB No. [" + lyingddata.AWBNo + "] -  Unable to process. Please check volume weight.", "bottom-right");
                        return;
                    }
                    else if (avl_pcs != uldpcs && parseFloat(avl_grwt) == uldgr) {
                        ShowMessage('warning', 'Warning!', "AWB No. [" + lyingddata.AWBNo + "] -  Unable to process. Please check gross weight.", "bottom-right");
                        return;
                    }
                    else if (uldpcs == 0) {
                        ShowMessage('warning', 'Warning!', "AWB No. [" + lyingddata.AWBNo + "] -  Unable to process. Planned piece should be greater than zero.", "bottom-right");
                        return;
                    }
                    else if (uldgr == 0) {
                        ShowMessage('warning', 'Warning!', "AWB No. [" + lyingddata.AWBNo + "] -  Unable to process. Gross Weight should be greater than zero.", "bottom-right");
                        return;
                    }
                    else if (uldvol == 0) {
                        ShowMessage('warning', 'Warning!', "AWB No. [" + lyingddata.AWBNo + "] -  Unable to process. Volume Weight should be greater than zero.", "bottom-right");
                        return;
                    }
                    /******************Check Aircraft Cargo Classification********/
                    if (_ISPAX == "Yes" && lyingddata.SPHC.toLowerCase().indexOf("cao") >= 0) {
                        var msg = "AWB '" + lyingddata.AWBNo + "' with SHC-CAO ( Cargo Aircraft only ) not allowed on Passenger Flight '" + $('#Text_searchFlightNo').data("kendoAutoComplete").value().trim() + "'/" + $('#searchFlightDate').val() + "";
                        ShowMessage('warning', 'Warning!', msg, "bottom-right");
                        closestTr.find("input[type='checkbox']").removeAttr("checked");
                        return;
                    }
                    /******************Check ULD MAX Weight Capacity****************/
                    if (ULD_SNo != "0") {
                        var IsConfirmDataULDCapacity = true;
                        if (IsNarrowBodyAircraft == 0 && IsCartStatus == 0) {
                            var _Message = CheckULDMaxWeightCapacity(vgrid, uldgr);
                        }
                        if (_Message != "" && IsCartStatus == 0) {

                            if (_Message != undefined) {
                                IsConfirmDataULDCapacity = confirm(_Message);
                                if (IsConfirmDataULDCapacity == false) {
                                    return;
                                }
                            }
                        }
                    }

                    //******************Check Mixed Load in ULD*******************
                    if (ULD_SNo != "0")
                        if (lyingddata != null) {
                            var selectedAWB = "";
                            var ListSPHC = ""; var currentSelectedSPHC = "";
                            var IsConfirm = true;
                            var SelectedSPHC = lyingddata.SPHC;
                            if (SPHC != "") {
                                var SPHCArr = SPHC.split(",");
                                for (var i = 0; i < SPHCArr.length; i++) {
                                    if (SPHCArr[i].toUpperCase() == "QRT") {
                                        ListSPHC = "QRT";
                                    }
                                }
                            }
                            if (SelectedSPHC != "") {
                                var SPHCArr1 = SelectedSPHC.split(",");
                                for (var i = 0; i < SPHCArr1.length; i++) {
                                    if (SPHCArr1[i].toUpperCase() == "QRT") {
                                        currentSelectedSPHC = "QRT";
                                    }
                                }
                            }
                            var selectAWBSPHC = lyingddata.SPHC;
                            if (CheckAddedLen > 0) {
                                if (SPHC == "" || ListSPHC == "") {
                                    if (currentSelectedSPHC == "QRT") {
                                        ShowMessage('warning', 'Warning - BuildUp', "QRT shipments can not be planned with non QRT shipments", "bottom-right");
                                        return;
                                    }
                                }

                                if (SPHC != "" && ListSPHC == "QRT") {
                                    if (currentSelectedSPHC != "QRT") {
                                        ShowMessage('warning', 'Warning - BuildUp', "Non QRT shipments can not be planned with QRT shipments", "bottom-right");
                                        return;
                                    }
                                }

                                /*Added By Brajendra for check destination for QRT shipment*/
                                if (lyingddata.ShipmentDetail == undefined) {
                                    selectedAWB = lyingddata.OriginCity + '-' + lyingddata.ShipmentDestination;
                                }
                                else {
                                    selectedAWB = lyingddata.ShipmentDetail.length > 7 ? lyingddata.ShipmentDetail.substring(0, 7) : lyingddata.ShipmentDetail;
                                }

                                selectedAWB = selectedAWB.split('-')[1]; // Get Destination City                                

                                if (ULD_SNo != "0" && ShipmentOD != "" && ShipmentOD != selectedAWB && selectAWBSPHC.includes("QRT") == true) {
                                    ShowMessage('warning', 'Warning - Diffrent Destinatioin', "QRT shipments belong to different destinations.", "bottom-right");
                                }
                                /*End*/
                            }

                            if (lyingddata.ShipmentDetail == undefined) {
                                selectedAWB = lyingddata.OriginCity + '-' + lyingddata.ShipmentDestination;
                            }
                            else {
                                selectedAWB = lyingddata.ShipmentDetail.length > 7 ? lyingddata.ShipmentDetail.substring(0, 7) : lyingddata.ShipmentDetail;
                            }

                            selectedAWB = selectedAWB.split('-')[1]; // Get Destination City

                            if (ULD_SNo != "0" && ShipmentOD != "" && ShipmentOD != selectedAWB) {
                                if (IsCartStatus == 0)
                                    IsConfirm = confirm('Planned shipments belong to different destinations. Do you wish to continue?');
                            }

                            if (IsConfirm == false) {
                                return;
                            }
                        }
                    //************************************************************


                    if (uldpcs > 0) {
                        var isValidShipment = false;
                        var CheckedAWBSNo = lyingddata.AWBSNo;
                        _sphc = lyingddata.SPHC;
                        var msg = GetAWBLockedEvent(userContext.UserSNo, CheckedAWBSNo, 0, "", "", "30");
                        if (msg == "Fail") { $(this).attr("checked", false); return false };
                        SaveUpdateLockedProcess(CheckedAWBSNo, "", "", "", userContext.UserSNo, "31", 'FlightBuildUp', $(this).is(":checked") == true ? 1 : 0, "");

                        $.ajax({
                            url: "Services/BuildUp/BuildUpProcessService.svc/CheckForSPHCRestriction", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
                            //data: JSON.stringify({ ProcessedShipmentInfo: processedShipment, ULDStockSNo: vgrid.options.parentValue.toString(), AircraftTypeSNo: aircraftTypeSno, CheckedAWBSNo: CheckedAWBSNo }),
                            data: JSON.stringify({ ProcessedShipmentInfo: processedShipment, ULDStockSNo: lyingddata.SPHC, AircraftTypeSNo: aircraftTypeSno.toString() == '' ? 0 : aircraftTypeSno.toString(), CheckedAWBSNo: CheckedAWBSNo }),
                            success: function (result) {
                                if (result == "0")
                                    isValidShipment = false;
                                else {
                                    var validShipModel = {
                                        AWBSNo: CheckedAWBSNo
                                    }
                                    processedShipment.push(validShipModel);
                                    isValidShipment = true;
                                }
                            }
                        });


                        /*Added By Brajendra For check offpoint is domestic or international */

                        //var IsULDInternational = "";
                        //var IsShipmentInternational = "";
                        //$.ajax({
                        //    url: "Services/BuildUp/BuildUpProcessService.svc/IsInternationalOffpoint",
                        //    async: false,
                        //    type: "POST",
                        //    cache: false,
                        //    contentType: "application/json; charset=utf-8",
                        //    data: JSON.stringify({ UldOffPoint: FlightNextDestination, ShipmentDestination: lyingddata.ShipmentDetail.split("/")[0].split("-")[1] }),
                        //    success: function (result) {
                        //        var table = JSON.parse(result);
                        //        IsULDInternational = table.Table0[0].IsInternational;
                        //        IsShipmentInternational = table.Table1[0].IsInternational;
                        //    }
                        //});

                        //if (IsULDInternational == 1 && IsShipmentInternational == 0 && cfi.GetCFGrid("divUldShipmentSection").options.parentValue.toString() > 0) { ShowMessage('warning', 'Warning - Offpoint', "Domestic shipment cann't be built with international ULD.", "bottom-right"); return true; }


                        /*Added By Brajendra to check ULD SHC compare to Shipment SHC On 9-Sept-2017*/

                        var IsCompatibleSHC = true;
                        var vgridForSHC = cfi.GetCFGrid("divUldShipmentSection");
                        $.each(vgridForSHC._data, function (i, item_Data) {
                            if (vgridForSHC.options.parentValue.toString() > 0) {
                                if (vgridForSHC._data[i].ULDStockSNo == vgridForSHC.options.parentValue.toString()) {
                                    //Changes by Vipin Kumar
                                    if (vgridForSHC._data[i].SHC != '') {
                                        //Ends
                                        if (vgridForSHC._data[i].SHC == selectAWBSPHC || (vgridForSHC._data[i].SHC.includes(selectAWBSPHC) && selectAWBSPHC.length > 0))
                                            IsCompatibleSHC = true;
                                        else
                                            IsCompatibleSHC = false;
                                    }
                                }
                                //if ((_sphc.indexOf(item_Data.SHC) >= 0 && item_Data.ULDStockSNo > 0) || item_Data.SHC == selectAWBSPHC) IsCompatibleSHC = true;
                                //if ((_sphc.indexOf(item_Data.SHC) >= 0 && item_Data.ULDStockSNo > 0) || item_Data.SHC == selectAWBSPHC) IsCompatibleSHC = true;
                            }
                            //if (vgridForSHC.options.parentValue.toString() == item_Data.ULDStockSNo) {
                            //    if ((_sphc.indexOf(item_Data.SHC) >= 0 && item_Data.ULDStockSNo > 0) || item_Data.SHC == selectAWBSPHC) IsCompatibleSHC = true;
                            //    //if ((_sphc.indexOf(item_Data.SHC) >= 0 && item_Data.ULDStockSNo > 0) || item_Data.SHC == selectAWBSPHC) IsCompatibleSHC = true;
                            //}
                            //if (item_Data.ULDStockSNo == 0) { IsCompatibleSHC = false; }
                            //if (item_Data.ULDStockSNo > 0 && item_Data.SHC != selectAWBSPHC) { IsCompatibleSHC = true; }
                            //if (IsCompatibleSHC) { return; }

                            //if (IsCompatibleSHC) { ShowMessage('warning', 'Warning - Move To ULD', "Selected shipment's SHC is not matching with ULD's SHC.", "bottom-right"); return false; }
                        });
                        if (!IsCompatibleSHC) {
                            if (IsCartStatus == 1) { ShowMessage('warning', 'Warning - Move To Cart', "Selected shipment's SHC is not matching with Cart's SHC.", "bottom-right"); } else {
                                ShowMessage('warning', 'Warning - Move To ULD', "Selected shipment's SHC is not matching with ULD's SHC.", "bottom-right");
                            } return false;
                        }

                        /* End By Brajendra */

                        if (isValidShipment) {

                            /*Pomail worked, below contents is coming from above */

                            var gridLying = $("#divLyingListSection").find(".k-grid").data('kendoGrid');
                            var checkedLyingData = $.map($("#divLyingListSection").find(".k-grid-content").find("input[type='checkbox']:checked"), function (checkbox) {
                                var LyingdataItem = gridLying.dataSource.getByUid($(checkbox).closest('tr').attr('data-uid'));
                                return LyingdataItem.MCBookingSNo;

                            });

                            var plndPcs = uldpcs;

                            $.each(POMailDetailsArray, function (index, val) {
                                if (checkedLyingData.join(',').indexOf(val.MCBookingSNo) >= 0 && plndPcs > 0) {
                                    if (IsChanged == false) {
                                        if (val.Planned == 0) {
                                            val.Planned = 1; val.isSelect == 1; val.ULDStockSNo = cfi.GetCFGrid("divUldShipmentSection").options.parentValue.toString();
                                            plndPcs--;
                                        }
                                    }
                                    else {
                                        if (val.isSelect == 1 && val.Planned == 0) { val.Planned = 1; val.ULDStockSNo = cfi.GetCFGrid("divUldShipmentSection").options.parentValue.toString(); }
                                    }
                                }

                            });


                            /*End// Pomail*/

                            var alreadyonulddata = $.grep(executedship, function (e, index) {
                                if (e.FromTableSNo == lyingddata.FromTableSNo && e.FromTable == lyingddata.FromTable && e.AWBSNo == lyingddata.AWBSNo && e.FromTableTotalPieces < e.ExecutedPieces + uldpcs && e.FPSNo == lyingddata.FPSNo) {
                                    return e;
                                }
                            });
                            if (alreadyonulddata.length == 0) {
                                var alreadyexecuteddata = $.grep(executedship, function (e, index) {
                                    if (e.FromTableSNo == lyingddata.FromTableSNo && e.FromTable == lyingddata.FromTable && e.AWBSNo == lyingddata.AWBSNo && e.FPSNo == lyingddata.FPSNo) {
                                        e.ExecutedPieces = e.ExecutedPieces + uldpcs;
                                        return e;
                                    }
                                });
                                /*Added By Brajendra For Getting Destinatioin on behalf of FPSNo*/
                                var fpDestination = "";
                                $.ajax({
                                    url: "Services/BuildUp/BuildUpProcessService.svc/GetDestinationAgainstFPSNo",
                                    async: false,
                                    type: "POST",
                                    cache: false,
                                    contentType: "application/json; charset=utf-8",
                                    data: JSON.stringify({ FPSNo: lyingddata.AWBSNo }),
                                    success: function (result) {
                                        fpDestination = result || "abc";
                                    }
                                });
                                /*End*/
                                // Add BY Sushant : On 21-11-2019 Desc : If Flight is multisector  then below condition should be applied ..
                                if (flightrouteStr.length > 3) {
                                    var str1 = flightrouteStr;
                                    var AwbFound = lyingddata.ShipmentDestination;
                                    if (str1.indexOf(AwbFound) != -1) {
                                        FlightNextDestination = AwbFound;
                                    } else {
                                        FlightNextDestination = "";
                                    }
                                }

                                var ToUldShipmentModel = {
                                    AWBSno: lyingddata.AWBSNo,
                                    FPSNo: lyingddata.FPSNo,
                                    AwbNo: lyingddata.AWBNo,
                                    Pieces: uldpcs,
                                    GrossWeight: uldgr,
                                    VolumeWeight: uldvol,
                                    SPHC: lyingddata.SPHC,
                                    ULDStockSNo: cdatasource.options.parentValue,
                                    FromTable: lyingddata.FromTable,
                                    FromTableSNo: lyingddata.FromTableSNo,
                                    FromTableTotalPieces: lyingddata.LIPieces,
                                    ShipmentDetail: lyingddata.ShipmentDetail.split('/')[0],
                                    AWBPieces: lyingddata.AWBPieces,
                                    AWBGrossWeight: lyingddata.AWBGrossWeight,
                                    AWBVolumeWeight: lyingddata.AWBVolumeWeight,
                                    AWBOffPoint: (flightrouteStr.indexOf(fpDestination) != -1) ? fpDestination : FlightNextDestination,
                                    ConnectingFlight: "",
                                    FPSNo: lyingddata.FPSNo,
                                    MCBookingSNo: lyingddata.MCBookingSNo,
                                    ShipmentType: lyingddata.ShipmentType,
                                    Status: lyingddata.Status,
                                    AWBCBM: parseFloat(lyingddata.AWBCBM).toFixed(3),
                                    CBM: uldCBM,
                                    IsPlanned: '0',
                                    ShipmentId: 'UnPlanned_0_0_0',
                                    Action: '',
                                    Priority: lyingddata.Priority,
                                    HDQ: ''
                                    //IsChanged: lyingddata.IsChanged,
                                    //OffloadStage: lyingddata.OffloadStage
                                }

                                var alreadyprsulddata = $.grep(processedawb, function (e, index) {
                                    if (e.FromTableSNo == lyingddata.FromTableSNo && e.FromTable == lyingddata.FromTable && e.AWBSno == lyingddata.AWBSNo && e.ULDStockSNo == cdatasource.options.parentValue && e.FPSNo == lyingddata.FPSNo) {
                                        return e;
                                    }
                                });

                                //00003
                                if (alreadyprsulddata.length == 0) {
                                    processedawb.push(ToUldShipmentModel);
                                }
                                else {
                                    var alreadyprsship = $.grep(processedawb, function (e, index) {
                                        if (e.FromTableSNo == lyingddata.FromTableSNo && e.FromTable == lyingddata.FromTable && e.AWBSno == lyingddata.AWBSNo && e.ULDStockSNo == cdatasource.options.parentValue && e.FPSNo == lyingddata.FPSNo) {
                                            e.Pieces = e.Pieces + uldpcs;
                                            e.GrossWeight = parseFloat(e.GrossWeight + uldgr).toFixed(1);
                                            e.VolumeWeight = parseFloat(e.VolumeWeight + uldvol).toFixed(2);
                                            e.CBM = parseFloat(parseFloat(e.CBM) + parseFloat(uldCBM)).toFixed(3);
                                            e.IsPlanned = '0';
                                            e.ShipmentId = 'UnPlanned_0_0_0';
                                            e.Action = '';
                                            return e;
                                        }
                                    });

                                }
                                //00004
                                if (alreadyexecuteddata.length == 0) {
                                    var ship = {
                                        AWBSNo: lyingddata.AWBSNo,
                                        FromTable: lyingddata.FromTable,
                                        FromTableSNo: lyingddata.FromTableSNo,
                                        FromTableTotalPieces: lyingddata.LIPieces,
                                        ExecutedPieces: uldpcs,
                                        FPSNo: lyingddata.FPSNo,
                                        IsPlanned: '0',
                                        ShipmentId: 'UnPlanned_0_0_0',
                                        Action: ''
                                    };
                                    executedship.push(ship);
                                }
                                for (var i = processedawb.length - 1; i >= 0; i--) {


                                    if (processedawb[i].FromTableSNo == lyingddata.FromTableSNo && processedawb[i].FromTable == lyingddata.FromTable && processedawb[i].AWBSno == lyingddata.AWBSNo && processedawb[i].ULDStockSNo == -1 && processedawb[i].FPSNo == lyingddata.FPSNo) {

                                        processedawb.splice(i, 1);
                                        // NAYAK Checking 
                                    }
                                }

                                //00005
                                var remainingPcs = parseInt(lyingddata.Pieces.split('/')[0]) - parseInt(ToUldShipmentModel.Pieces);
                                var ly_gr_wt = 0, ly_vol_wt = 0, ly_CBM = 0;
                                if (remainingPcs > 0) {
                                    lyingddata.Pieces = remainingPcs.toString() + "/" + lyingddata.AWBPieces;
                                    /*********Added By Haider************************/
                                    gr_wt = (parseFloat(ToUldShipmentModel.AWBGrossWeight) - ToUldShipmentModel.GrossWeight).toFixed(1);
                                    vol_wt = (parseFloat(ToUldShipmentModel.AWBVolumeWeight) - ToUldShipmentModel.VolumeWeight).toFixed(2);
                                    ly_CBM = parseFloat(parseFloat(ToUldShipmentModel.AWBCBM) - parseFloat(ToUldShipmentModel.CBM)).toFixed(3);

                                    lyingddata.AWBGrossWeight = gr_wt;
                                    lyingddata.AWBVolumeWeight = vol_wt;
                                    lyingddata.AWBCBM = ly_CBM;
                                    /***********************************************/
                                    lyingddata.GrossWeight = parseFloat(parseFloat(lyingddata.GrossWeight) - parseFloat(ToUldShipmentModel.GrossWeight)).toFixed(1);
                                    lyingddata.VolumeWeight = parseFloat(parseFloat(lyingddata.VolumeWeight) - parseFloat(ToUldShipmentModel.VolumeWeight)).toFixed(2);
                                    lyingddata.CBM = parseFloat(parseFloat(lyingddata.CBM) - parseFloat(ToUldShipmentModel.CBM)).toFixed(3);
                                    lyingddata.ShipmentId = 'UnPlanned_0_0_0'
                                    closestTr.find("td:eq(" + weightdetailindex + ") ").text(lyingddata.AWBGrossWeight + "/" + lyingddata.AWBVolumeWeight + "/" + lyingddata.AWBCBM);

                                    closestTr.find("td:eq(" + awbpcsindex + ")").text(lyingddata.Pieces);
                                    grControl.val(lyingddata.GrossWeight);
                                    volControl.val(lyingddata.VolumeWeight);
                                    pcsControl.val(remainingPcs.toString());
                                    // closestTr.find("td:eq(" + CBMIndex + ")").text(lyingddata.CBM);



                                    closestTr.find("td:eq(" + grwtindex + ")  ").text(lyingddata.GrossWeight);
                                    closestTr.find("td:eq(" + volwtindex + ") ").text(lyingddata.VolumeWeight);
                                    closestTr.find("td:eq(" + CBMIndex + ") ").text(lyingddata.CBM);
                                    closestTr.find("input[type='checkbox']").attr("checked", !closestTr.find("input[type='checkbox']:checked"));

                                    //deleteddata.push(nonulddata);

                                    //00006
                                    var offloadeddata = {
                                        AWBSNo: lyingddata.AWBSNo,
                                        AWBNo: lyingddata.AWBNo,
                                        FPSNo: lyingddata.FPSNo,
                                        LIPieces: remainingPcs,
                                        GrossWeight: lyingddata.GrossWeight,
                                        VolumeWeight: lyingddata.VolumeWeight,
                                        SPHC: lyingddata.SPHC,
                                        Plan: "",//lyingddata.Plan,//Farogh Haider
                                        FromTable: lyingddata.FromTable,
                                        FromTableSNo: lyingddata.FromTableSNo,
                                        FromTableTotalPieces: lyingddata.FromTableTotalPieces,
                                        AWBPieces: lyingddata.AWBPieces,
                                        AWBGrossWeight: lyingddata.AWBGrossWeight,
                                        AWBVolumeWeight: lyingddata.AWBVolumeWeight,
                                        AWBCBM: parseFloat(lyingddata.AWBCBM).toFixed(3),
                                        CBM: lyingddata.CBM,
                                        ShipmentId: 'UnPlanned_0_0_0',
                                        Action: '',
                                        Priority: lyingddata.Priority
                                    };
                                    processedawb.push({
                                        AWBSno: lyingddata.AWBSNo,
                                        FPSNo: lyingddata.FPSNo,
                                        AwbNo: lyingddata.AWBNo,
                                        Pieces: remainingPcs,
                                        GrossWeight: parseFloat(lyingddata.GrossWeight).toFixed(1),
                                        VolumeWeight: parseFloat(lyingddata.VolumeWeight).toFixed(2),
                                        SPHC: lyingddata.SPHC,
                                        ULDStockSNo: -1,
                                        FromTable: lyingddata.FromTable,
                                        FromTableSNo: lyingddata.FromTableSNo,
                                        FromTableTotalPieces: lyingddata.LIPieces,
                                        ShipmentDetail: lyingddata.ShipmentDetail.split('/')[0],
                                        AWBPieces: lyingddata.AWBPieces,
                                        AWBGrossWeight: lyingddata.AWBGrossWeight,
                                        AWBVolumeWeight: lyingddata.AWBVolumeWeight,
                                        AWBOffPoint: (flightrouteStr.indexOf(fpDestination) != -1) ? fpDestination : FlightNextDestination,
                                        ConnectingFlight: "",
                                        FPSNo: lyingddata.FPSNo,
                                        MCBookingSNo: lyingddata.MCBookingSNo,
                                        ShipmentType: lyingddata.ShipmentType,
                                        Status: lyingddata.Status,
                                        AWBCBM: parseFloat(lyingddata.AWBCBM).toFixed(3),
                                        CBM: lyingddata.CBM,
                                        ShipmentId: 'UnPlanned_0_0_0',
                                        Action: '',
                                        Priority: lyingddata.Priority
                                        //  IsChanged: lyingddata.IsChanged,
                                        // OffloadStage: lyingddata.OffloadStage
                                    });
                                    ///lyingdeleteddata.push(lyingddata);

                                }
                                else {
                                    lyingdeleteddata.push(lyingddata);
                                }
                                var existingshipdata = $.grep(cdatasource.data(), function (e, index) {
                                    if (e.AWBSno == lyingddata.AWBSNo) {
                                        ToUldShipmentModel.GrossWeight = parseFloat(parseFloat(e.GrossWeight) + uldgr).toFixed(1);
                                        ToUldShipmentModel.VolumeWeight = parseFloat(parseFloat(e.VolumeWeight) + uldvol).toFixed(2);
                                        ToUldShipmentModel.Pieces = parseFloat(e.Pieces) + uldpcs;
                                        ToUldShipmentModel.CBM = parseFloat(parseFloat(e.CBM) + parseFloat(uldCBM)).toFixed(3);
                                        ToUldShipmentModel.IsPlanned = e.IsPlanned;
                                        //ToUldShipmentModel.ShipmentId = 'UnPlanned_0_0_0';
                                        ToUldShipmentModel.ShipmentId = e.ShipmentId;
                                        ToUldShipmentModel.Action = '';
                                        return e;
                                    }
                                });
                                if (existingshipdata.length == 0) {
                                    /*---------If Child Data does not exists in selected ULD(03-Nov-2016)-------------------------------*/
                                    $(lyingddata).each(function (index, item) {
                                        lyingddata.LoadPieces = parseInt(item.Pieces.split('/')[0]);
                                        lyingddata.LoadGrossWeight = item.GrossWeight;
                                        lyingddata.LoadVol = item.VolumeWeight;
                                        lyingddata.WeightDetail = item.GrossWeight + "/" + item.VolumeWeight + "/" + item.CBM;
                                        //lyingddata.ShipmentId = 'UnPlanned_0_0_0';
                                        lyingddata.isPlanned = item.isPlanned;
                                        lyingddata.ShipmentId = item.ShipmentId;
                                        lyingddata.Action = '';
                                    });
                                    /*----------------------------------------*/
                                    cdatasource.insert(ToUldShipmentModel);
                                }
                                else {
                                    cdatasource.pushUpdate(ToUldShipmentModel);
                                }

                                if (uldmasterrow == undefined || ulddataitem == undefined) {
                                    uldmasterrow = $("#div__" + vgrid.options.parentValue.toString()).closest("tr.k-detail-row").prev();
                                    ulddataitem = vgrid.dataItem(uldmasterrow);

                                }
                                var usedgrwt = parseFloat(ulddataitem.GrossWeight) + uldgr;
                                var usedvolwt = parseFloat(ulddataitem.VolumeWeight) + uldvol;
                                var usedCBM = parseFloat(ulddataitem.CBM) + parseFloat(uldCBM);
                                //if(usedgrwt > ulddataitem.) 
                                ulddataitem.GrossWeight = usedgrwt.toFixed(1);;
                                ulddataitem.VolumeWeight = usedvolwt.toFixed(2);;
                                ulddataitem.CBM = parseFloat(usedCBM).toFixed(3);;
                                ulddataitem.Shipments = parseInt(ulddataitem.Shipments) + 1;
                                ulddataitem.Used = ulddataitem.GrossWeight + " / " + ulddataitem.VolumeWeight;//+ " / " + ulddataitem.CBM;
                                uldmasterrow.find("td:eq(" + uldusedindex + ")").text(ulddataitem.Used);
                                uldmasterrow.find("td:eq(" + uldtotalship + ")").text(cdatasource.data().length);

                                successshipment = successshipment + (successshipment == "" ? "" : " , ") + "[" + lyingddata.AWBNo + "]";
                                successshipmentSNo = successshipmentSNo + (successshipmentSNo == "" ? "" : " , ") + lyingddata.AWBSNo;
                                /**********Check ULD Type in Lying List(Moved in ULD/BULK)*********************/
                                if (ulddataitem != undefined && ulddataitem.ULDNo == "BULK") {
                                    ULDType = "BULK";
                                }
                                /********************************************/
                            }
                            else {
                                alreadyonuldship = alreadyonuldship + (alreadyonuldship == "" ? "" : " , ") + "[" + lyingddata.AWBNo + "]";
                            }
                        }
                        else {
                            notabletoprocessship = notabletoprocessship + (notabletoprocessship == "" ? "" : " , ") + "[" + lyingddata.AWBNo + "]";
                        }
                    }
                    else {
                        invalidshipment = invalidshipment + (invalidshipment == "" ? "" : " , ") + "[" + lyingddata.AWBNo + "]";
                    }

                });
            }
            IsChanged = false;

            if (selectedShipmentCount == 0) {
                //Added by karan for cart message------------------
                if (IsCartStatus == 1) {
                    ShowMessage('warning', 'Warning - Move To Cart', "Select a shipment to move.", "bottom-right");
                }
                else {
                    ShowMessage('warning', 'Warning - Move To ULD', "Select a shipment to move.", "bottom-right");
                }
                return false;
            }
            var dlen = deleteddata.length;
            for (var i = dlen - 1; i >= 0; i--) {
                nonuldgriddatasource.remove(deleteddata[i]);
            }

            var lyingdlen = lyingdeleteddata.length;
            for (var i = lyingdlen - 1; i >= 0; i--) {
                debugger;
                lyinggriddatasource.remove(lyingdeleteddata[i]);
            }

            //var offdlen = offloaddeleteddata.length;
            //for (var i = offdlen - 1; i >= 0; i--) {
            //    offloadgriddatasource.remove(offloaddeleteddata[i]);
            //}

            var executeddetails = {
                DailyFlightSNo: $("input[type='hidden'][id='FlightNo").val(),
                LockedProcessName: "BUILDUP"
            };
            //$.ajax({
            //    url: "Services/CommonService.svc/MarkAsLockedShipment", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
            //    data: JSON.stringify({ lockedShipment: executedship, lockDetails: executeddetails, UpdatedBy: _USER_, LoggedInCity: _CITY_ }),
            //    success: function (result) {
            //    },
            //    beforeSend: function (jqXHR, settings) {
            //    },
            //    complete: function (jqXHR, textStatus) {
            //    },
            //    error: function (xhr) {
            //        var a = "";
            //    }
            //});
            var a = processedawb.length;
            if (alreadyonuldship != "") {
                ShowMessage('warning', 'Warning - Moved in ' + ULDType, "Selected shipment " + alreadyonuldship + " already processed.", "bottom-right");
            }
            if (invalidshipment != "") {
                ShowMessage('warning', 'Warning - Moved in ' + ULDType, "Selected shipment " + invalidshipment + " pieces can’t be 0 for processing.", "bottom-right");
            }
            if (successshipment != "") {
                ShowMessage('success', 'Success - Moved in ' + ULDType, "Selected shipment " + successshipment + " processed successfully.", "bottom-right");
                BindShipmentOffPoint(ULD_SNo, successshipmentSNo, "MoveToULD", IsCartStatus);
                SetNumericOnly("txtPcs");
                SetNumericOnly("txtLPcs");
                $('[id^= "UnPlanned"]').hide();
            }
            if (notabletoprocessship != "") {
                //ShowMessage('warning', 'Warning - Moved in ' + ULDType, "Due to SHC restriction " + notabletoprocessship + " unable to process.", "bottom-right");
                ShowMessage('warning', 'Warning - Moved in ' + ULDType, "SHC '" + _sphc + "' can not be loaded in this Aircraft", "bottom-right");
            }
        }
        else {
            ShowMessage('warning', 'Warning - Moved in ULD/BULK', "Select a ULD type/Bulk to move selected shipments into an ULD/Bulk.", "bottom-right");

        }

    }
    CheckCollepsRow = 0;


    $('[id^=Text_AWBOffPoint_0_]').keypress(function (event) {
        if (event.keyCode === 10 || event.keyCode === 13) {
            event.preventDefault();
        }
    });
    $('#btnSave').attr("disabled", false);
}


///////////////////--------------END MoveToULD Function------------///////////////////////////////////////////
//var mergedArr = [];
//var moveFromUldArr=[]

function MoveFromUld() {


    var IsLITobeRefersh = false;

    var LIdata = jQuery.grep(processList, function (n, i) {
        return (n.GroupFlightSNo == $("#Text_searchFlightNo").data("kendoAutoComplete").key() && n.ProcessSNo == 35 && n.EventType == "SAVE");
    });

    if (LIdata.length > 0) { IsLITobeRefersh = true }
    else {
        signalR.updateProcessStatus({
            GroupFlightSNo: $("#Text_searchFlightNo").data("kendoAutoComplete").key(), ProcessSNo: 30, EventType: 'SAVE'
        });
    }

    ////if (IsLITobeRefersh) {
    ////    ShowMessage('warning', 'Warning', "Loading Instruction for this flight is being updated simultaneously. Please save Build Up to fetch latest records.", "bottom-right");
    ////    return;
    ////}

    $('#btnSave').attr("disabled", true);
    //mergedArr = POMailDetailsArray.concat(bupArr);
    //moveFromUldArr = moveFromUldPoMailDetails.slice();

    //ArrayArray = moveFromUldPoMailDetails.reduce(function (item, e1) {
    //    var matches = item.filter(function (e2)
    //    { return e1.EmpID == e2.EmpID });
    //    if (matches.length == 0) {
    //        item.push(e1);
    //    }
    //    return item;
    //}, []);
    // Changes by Vipin Kumar
    var IsCartStatus = 0;
    IsOffloadFromBulk = 0;
    // Ends
    var vgrid = cfi.GetCFGrid("divUldShipmentSection");
    var childgrid = cfi.GetNestedCFGrid("div__" + vgrid.options.parentValue.toString());

    var checkedData = $.map($("#divUldShipmentSection").find("[id='div__" + vgrid.options.parentValue.toString() + "' ]").find("input[type='checkbox']:checked"), function (checkbox) {
        var dataItem = childgrid.dataSource.getByUid($(checkbox).closest('tr').attr('data-uid'));
        return dataItem.MCBookingSNo + ":" + (dataItem.OffloadStage == undefined || dataItem.OffloadStage == "" ? "undef" : dataItem.OffloadStage);
    });

    $.each(POMailDetailsArray, function (index, val) {
        if (checkedData.join(',').indexOf(val.MCBookingSNo + ":BUILD-UP") >= 0 || checkedData.join(',').indexOf(val.MCBookingSNo + ":undef") >= 0 || checkedData.join(',').indexOf(val.MCBookingSNo + ":RCS") >= 0 || checkedData.join(',').indexOf(val.MCBookingSNo + ":PRE") >= 0 || checkedData.join(',').indexOf(val.MCBookingSNo + ":MAN") || checkedData.join(',').indexOf(val.MCBookingSNo + ":BUILD") || checkedData.join(',').indexOf(val.MCBookingSNo + ":OFLD") || checkedData.join(',').indexOf(val.MCBookingSNo + ":\"\"")) {
            if (val.ULDStockSNo == vgrid.options.parentValue.toString()) {
                val.Planned = 0;
                val.isSelect = 0;
                val.ULDStockSNo = 0;
            }
        }
    });


    //$.each(LyingListPOMailDetailsArray, function (index, val) {
    //    if (checkedData.join(',').indexOf(val.MCBookingSNo + ":PRE") >= 0 || checkedData.join(',').indexOf(val.MCBookingSNo + ":MAN") || checkedData.join(',').indexOf(val.MCBookingSNo + ":BUILD") || checkedData.join(',').indexOf(val.MCBookingSNo + ":OFLD") || checkedData.join(',').indexOf(val.MCBookingSNo + ":\"\"")) {
    //        if (val.ULDStockSNo == vgrid.options.parentValue.toString()) {
    //            val.Planned = 0;
    //            val.isSelect = 0;
    //            val.ULDStockSNo = 0;
    //        }
    //    }
    //});







    var vgrid = cfi.GetCFGrid("divUldShipmentSection");
    var childgrid = null;
    var ULDType = "ULD";

    $.each(vgrid._data, function (i, item_Data) {
        if (item_Data.ULDNo != "BULK" && vgrid.options.parentValue.toString() == item_Data.ULDStockSNo) {
            IsCartStatus = item_Data.IsCart == "true" || item_Data.IsCart == "1" ? "1" : "0";
            return false;
        }
    });
    //Added by karan for Cart messate------------------
    if (IsCartStatus == 1) {
        ULDType = "Cart";
    } else {
        ULDType = "ULD";
    }

    if (vgrid != undefined) {
        if (vgrid.options.parentValue.toString() != "") {



            var deleteddata = []
            var deletedindex = []

            var trUldHeader = $("#divUldShipmentSection").find(".k-grid-header");

            uldusedindex = trUldHeader.find("th[data-field='Used']").index();
            uldtotalship = trUldHeader.find("th[data-field='Shipments']").index();

            var childgrid = cfi.GetNestedCFGrid("div__" + vgrid.options.parentValue.toString())

            var cdatasource = childgrid.dataSource;
            var cdata = cdatasource.data();

            var pregrid = cfi.GetCFGrid("divNonUldShipmentSection");
            var pregriddatasource = pregrid.dataSource;
            var pregriddata = pregriddatasource.data();

            var lyinggrid = cfi.GetCFGrid("divLyingListSection");
            var lyinggriddatasource = [];
            var lyinggriddata = [];
            if (lyinggrid == undefined) {

            }
            else {
                lyinggriddatasource = lyinggrid.dataSource;
                lyinggriddata = lyinggriddatasource.data();
            }
            var trIndex = undefined;
            var selectedShipmentCount = 0;
            var successshipment = "";
            var successshipmentSNo = "";
            var uldmasterrow = undefined;
            var ulddataitem = undefined;
            selectedShipmentCount = $("#div__" + vgrid.options.parentValue.toString()).find(".k-grid-content").find("input[type='checkbox']:checked").length;
            $("#div__" + vgrid.options.parentValue.toString()).find(".k-grid-content").find("input[type='checkbox']:checked").each(function () {

                var masterrow = $(this).closest("tr.k-detail-row").prev();
                var dataitem = cfi.GetCFGrid("divUldShipmentSection").dataItem(masterrow);
                trIndex = $(this).closest("tr").index();
                if (parseInt(cdata[trIndex].Pieces) > 0) {
                    var crowdata = cdata[trIndex];

                    //$.each(pregriddata, function (i, item) {
                    //    if (crowdata.AWBSno == item.AWBSNo && executedship.length==0)
                    //    {
                    //        var ship = {
                    //            AWBSNo: item.AWBSNo,
                    //            FromTable: crowdata.FromTable,
                    //            FromTableSNo: crowdata.FromTableSNo,
                    //            FromTableTotalPieces: item.AWBPieces,
                    //            ExecutedPieces: item.LIPieces,
                    //            //IsPlanned: '0'
                    //            //ShipmentId: 'UnPlanned_0'
                    //            IsPlanned: item.IsPlanned,
                    //            ShipmentId: item.IsPlanned == '0' ? 'UnPlanned_0_0_0' : item.ShipmentId,
                    //            //Action: nonuldgriddata[trIndex].IsAction
                    //            //Action: nonuldgriddata[trIndex].Action == '0' ? '' : '<a id="' + nonuldgriddata[trIndex].ShipmentId + '" onclick=\"fnMoveToLyingList(this);\"><i class=\"fa fa-mail-forward\" style=\"font-size:15px;\" title=\"Move to Lying List\"></i></a>'
                    //            Action: item.Action
                    //        };
                    //        executedship.push(ship);

                    //        var offUldShipmentModel = {
                    //            AWBSno: item.AWBSNo,
                    //            AwbNo: item.AWBNo,
                    //                                Pieces: item.LoadPieces,
                    //                                GrossWeight: item.LoadGrossWeight,
                    //                                VolumeWeight: item.LoadVol,
                    //                                SPHC: item.SPHC,
                    //                                ULDStockSNo: -1,
                    //                                FromTable: crowdata.FromTable,
                    //                                FromTableSNo: crowdata.FromTableSNo,
                    //                                FromTableTotalPieces: item.LIPieces,
                    //                                ShipmentDetail: item.ShipmentDetail,
                    //                                AWBPieces: item.AWBPieces,
                    //                                AWBGrossWeight: item.AWBGrossWeight,
                    //                                AWBVolumeWeight: item.AWBVolumeWeight,
                    //                                AWBOffPoint: item.ShipmentDestination,
                    //                                OffloadStage: item.OffloadStage,
                    //                                ConnectingFlight: "",
                    //                                ShipmentType: item.ShipmentType,
                    //                                Status: item.Status,
                    //                                CBM: item.CBM
                    //        }
                    //        processedawb.push(offUldShipmentModel);
                    //    }
                    //})

                    var alreadyonulddata = $.grep(executedship, function (e, index) {
                        if (e.FromTableSNo == crowdata.FromTableSNo && e.FromTable == crowdata.FromTable && e.AWBSNo == crowdata.AWBSno) {
                            return e;
                        }
                    });
                    if (alreadyonulddata.length > 0) {
                        var alreadyexecuteddata = $.grep(executedship, function (e, index) {
                            if (e.FromTableSNo == crowdata.FromTableSNo && e.FromTable == crowdata.FromTable && e.AWBSNo == crowdata.AWBSno) {
                                e.ExecutedPieces = e.ExecutedPieces - parseInt(crowdata.Pieces);
                                return e;
                            }
                        });
                    }

                    for (var i = processedawb.length - 1; i >= 0; i--) {
                        if (processedawb[i].FromTableSNo == crowdata.FromTableSNo && processedawb[i].FromTable == crowdata.FromTable && processedawb[i].AWBSno == crowdata.AWBSno && processedawb[i].ULDStockSNo == vgrid.options.parentValue.toString()) {
                            processedawb.splice(i, 1);
                        }
                    }




                    var alreadyprsulddata = $.grep(processedawb, function (e, index) {
                        if (e.FromTableSNo == crowdata.FromTableSNo && e.FromTable == crowdata.FromTable && e.AWBSno == crowdata.AWBSno && e.ULDStockSNo == -1) {
                            //  if ( e.FromTable == crowdata.FromTable && e.AWBSno == crowdata.AWBSno && e.ULDStockSNo == -1) {
                            return e;
                        }
                    });

                    if (alreadyprsulddata.length == 0) { // When All Shipments Pushed in ULD
                        crowdata.AWBGrossWeight = crowdata.GrossWeight;//Farogh Haider
                        crowdata.AWBVolumeWeight = crowdata.VolumeWeight;//Farogh Haider
                        crowdata.AWBCBM = crowdata.CBM;
                        var abc = {
                            AWBSno: crowdata.AWBSno,
                            AwbNo: crowdata.AwbNo,
                            Pieces: crowdata.Pieces,
                            GrossWeight: parseFloat(crowdata.GrossWeight).toFixed(1),
                            VolumeWeight: parseFloat(crowdata.VolumeWeight).toFixed(2),
                            SPHC: crowdata.SPHC,
                            ULDStockSNo: -1,
                            FromTable: crowdata.FromTable,
                            FromTableSNo: crowdata.FromTableSNo,
                            FromTableTotalPieces: crowdata.FromTableTotalPieces,
                            AWBPieces: crowdata.AWBPieces,
                            AWBGrossWeight: parseFloat(crowdata.GrossWeight).toFixed(1),//crowdata.AWBGrossWeight,//Farogh Haider
                            AWBVolumeWeight: parseFloat(crowdata.VolumeWeight).toFixed(2),//crowdata.AWBVolumeWeight,//Farogh Haider
                            OffloadStage: crowdata.OffloadStage,
                            AWBOffPoint: FlightNextDestination,
                            ConnectingFlight: "",
                            FPSNo: crowdata.FPSNo,
                            MCBookingSNo: crowdata.MCBookingSNo,
                            ShipmentType: crowdata.ShipmentType,
                            Status: crowdata.Status,
                            AWBCBM: parseFloat(crowdata.CBM).toFixed(3),
                            CBM: parseFloat(crowdata.CBM).toFixed(3),
                            ShipmentId: crowdata.ShipmentId,
                            IsPlanned: crowdata.IsPlanned,
                            Priority: crowdata.Priority,
                            //Action: '' 
                            Action: crowdata.Action
                            //Action: '<a id="AWB_"' + crowdata.AWBSno + 'onclick=\"fnMoveToLyingList(this,1);\"><i class=\"fa fa-mail-forward\" style=\"font-size:15px;\" title=\"Move to Lying List\"></i></a>',
                            //Action: '' 
                            //IsChanged: crowdata.IsChanged,
                            //OffloadStage: crowdata.OffloadStage
                        };
                        processedawb.push(abc);
                    }
                    else {
                        var alreadyprsship = $.grep(processedawb, function (e, index) {
                            // if ( e.FromTable == crowdata.FromTable && e.AWBSno == crowdata.AWBSno && e.ULDStockSNo == -1) {
                            if (e.FromTableSNo == crowdata.FromTableSNo && e.FromTable == crowdata.FromTable && e.AWBSno == crowdata.AWBSno && e.ULDStockSNo == -1) {
                                e.Pieces = parseInt(e.Pieces) + parseInt(crowdata.Pieces);
                                e.FromTableTotalPieces = parseInt(crowdata.FromTableTotalPieces);
                                e.GrossWeight = parseFloat(parseFloat(e.GrossWeight) + parseFloat(crowdata.GrossWeight)).toFixed(1);
                                e.VolumeWeight = parseFloat(parseFloat(e.VolumeWeight) + parseFloat(crowdata.VolumeWeight)).toFixed(2);
                                e.AWBGrossWeight = parseFloat(parseFloat(e.AWBGrossWeight) + parseFloat(crowdata.GrossWeight)).toFixed(1);//Farogh Haider
                                e.AWBVolumeWeight = parseFloat(parseFloat(e.AWBVolumeWeight) + parseFloat(crowdata.VolumeWeight)).toFixed(2);//Farogh Haider

                                e.AWBCBM = parseFloat(parseFloat(e.AWBCBM) + parseFloat(crowdata.CBM)).toFixed(3);
                                e.CBM = parseFloat(parseFloat(e.CBM) + parseFloat(crowdata.CBM)).toFixed(3);

                                crowdata.AWBGrossWeight = e.AWBGrossWeight;//Farogh Haider
                                crowdata.AWBVolumeWeight = e.AWBVolumeWeight;//Farogh Haider
                                crowdata.AWBCBM = e.AWBCBM;
                                crowdata.IsPlanned = e.IsPlanned;
                                crowdata.Action = e.Action;
                                //crowdata.Action = '<a id="' + e.ShipmentId + '" onclick=\"fnMoveToLyingListNew(this,1);\"><i class=\"fa fa-mail-forward\" style=\"font-size:15px;\" title=\"Move to Lying List\"></i></a>';
                                return e;
                            }
                        });

                    }
                    var offloadfromuld = [];

                    var _OffloadStage = crowdata.OffloadStage;

                    /***********LI AND Build up Shipment**********************************************************************/
                    if (crowdata.FromTable == 1 || crowdata.FromTable == 3 || _OffloadStage == "BUILD-UP") {
                        offloadfromuld = {
                            AWBSNo: crowdata.AWBSno,
                            AWBNo: crowdata.AwbNo,
                            FlightNo: $("span[id='FlightNo']").text(),
                            FlightDate: $("span[id='FlightDate").text(),
                            OriginCity: $("span[id='Origin']").text(),
                            Pieces: crowdata.Pieces + "/" + crowdata.AWBPieces,
                            LIPieces: crowdata.FromTableTotalPieces,
                            LoadPieces: crowdata.Pieces,
                            GrossWeight: crowdata.GrossWeight,
                            VolumeWeight: crowdata.VolumeWeight,
                            LoadGrossWeight: crowdata.GrossWeight,
                            LoadVol: crowdata.VolumeWeight,
                            SPHC: crowdata.SPHC,
                            Plan: "",//dataitem.ULDNo.substr(0, 3),//Farogh Haider
                            FromTable: crowdata.FromTable,
                            FromTableSNo: crowdata.FromTableSNo,
                            WeightDetail: crowdata.AWBGrossWeight + "/" + crowdata.AWBVolumeWeight + "/" + crowdata.AWBCBM,
                            ShipmentDetail: crowdata.ShipmentDetail,
                            LoadDetail: "",
                            AWBPieces: crowdata.AWBPieces,
                            AWBGrossWeight: crowdata.AWBGrossWeight,
                            AWBVolumeWeight: crowdata.AWBVolumeWeight,
                            OffloadStage: crowdata.OffloadStage,
                            FPSNo: crowdata.FPSNo,
                            MCBookingSNo: crowdata.MCBookingSNo,
                            ShipmentType: crowdata.ShipmentType,
                            Status: crowdata.Status,
                            AWBCBM: crowdata.AWBCBM,
                            CBM: crowdata.CBM,
                            LoadCBM: crowdata.CBM,
                            ShipmentId: crowdata.ShipmentId,
                            IsPlanned: crowdata.IsPlanned,
                            Action: crowdata.Action,
                            Priority: crowdata.Priority

                            //Action: '<a id="' + crowdata.ShipmentId + '" onclick=\"fnMoveToLyingListNew(this,1);\"><i class=\"fa fa-mail-forward\" style=\"font-size:15px;\" title=\"Move to Lying List\"></i></a>'
                            //IsChanged: crowdata.IsChanged,
                            //OffloadStage: crowdata.OffloadStage
                        };
                        /////////////////////////////need to add //////////////////////////////////////////////////////

                        //  var existingshipdata = $.grep(processedawb, function (e, index) {
                        var existingshipdata = $.grep(pregriddatasource.data(), function (e, index) {
                            if (e.AWBSNo == crowdata.AWBSno && e.FromTable == cdata[trIndex].FromTable && e.FromTableSNo == cdata[trIndex].FromTableSNo) {
                                // if (e.AWBSNo == crowdata.AWBSno) {
                                offloadfromuld.GrossWeight = parseFloat(parseFloat(e.GrossWeight) + parseFloat(offloadfromuld.GrossWeight)).toFixed(1);
                                offloadfromuld.VolumeWeight = parseFloat(parseFloat(e.VolumeWeight) + parseFloat(offloadfromuld.VolumeWeight)).toFixed(2);
                                offloadfromuld.LIPieces = parseInt(crowdata.FromTableTotalPieces);
                                offloadfromuld.Pieces = (parseInt(e.Pieces.split('/')[0]) + parseInt(crowdata.Pieces)).toString() + "/" + parseInt(crowdata.AWBPieces);
                                offloadfromuld.LoadPieces = parseInt(offloadfromuld.Pieces.split('/')[0]);
                                offloadfromuld.LoadGrossWeight = parseFloat(offloadfromuld.GrossWeight).toFixed(1);
                                offloadfromuld.LoadVol = parseFloat(offloadfromuld.VolumeWeight).toFixed(2);
                                offloadfromuld.WeightDetail = offloadfromuld.AWBGrossWeight + "/" + offloadfromuld.AWBVolumeWeight + "/" + offloadfromuld.AWBCBM;
                                offloadfromuld.Plan = "";//e.Plan;//Farogh Haider

                                offloadfromuld.CBM = parseFloat(parseFloat(e.CBM) + parseFloat(offloadfromuld.CBM)).toFixed(3);
                                offloadfromuld.LoadCBM = parseFloat(offloadfromuld.CBM).toFixed(3);
                                //offloadfromuld.Action = '<a id="' + e.ShipmentId + '" onclick=\"fnMoveToLyingListNew(this,1);\"><i class=\"fa fa-mail-forward\" style=\"font-size:15px;\" title=\"Move to Lying List\"></i></a>'
                                offloadfromuld.Action = offloadfromuld.Action;
                                offloadfromuld.IsPlanned = offloadfromuld.IsPlanned;
                                return e;
                            }
                            //***************Added by Haider*****************************/
                            else {
                                //e.GrossWeight = parseFloat(e.GrossWeight) + parseFloat(e.GrossWeight);
                                //e.VolumeWeight = parseFloat(e.VolumeWeight) + parseFloat(e.VolumeWeight);
                                //e.LIPieces = parseInt(crowdata.FromTableTotalPieces);
                                //e.Pieces = (parseInt(e.Pieces.split('/')[0]) + parseInt(crowdata.Pieces)).toString() + "/" + parseInt(crowdata.AWBPieces);
                                e.LoadPieces = parseInt(e.Pieces.split('/')[0]);
                                e.LoadGrossWeight = e.GrossWeight;
                                e.LoadVol = e.VolumeWeight;
                                e.LoadCBM = e.CBM;
                                e.WeightDetail = e.AWBGrossWeight + "/" + e.AWBVolumeWeight + "/" + e.AWBCBM;
                                e.Action = e.Action;
                                e.IsPlanned = e.IsPlanned;
                                //e.Plan = e.Plan;
                                //return e;
                            }
                        });
                        if (existingshipdata.length == 0) {
                            pregriddatasource.insert(offloadfromuld);
                        }
                        else {
                            //cdatasource.remove(matchingdataitem[0]);
                            pregriddatasource.remove(existingshipdata[0]);
                            pregriddatasource.insert(offloadfromuld);
                        }
                    }

                    /***********Lying List(Offloaded) AND AWB Shipment**********************************************************************/
                    else if (crowdata.FromTable == 0 || crowdata.FromTable == 2) {
                        offloadfromuld = {
                            AWBSNo: crowdata.AWBSno,
                            AWBNo: crowdata.AwbNo,
                            FlightNo: $("span[id='FlightNo']").text(),
                            FlightDate: $("span[id='FlightDate").text(),
                            OriginCity: $("span[id='Origin']").text(),
                            Pieces: crowdata.Pieces + "/" + crowdata.AWBPieces,
                            LIPieces: crowdata.FromTableTotalPieces,
                            LoadPieces: crowdata.Pieces,
                            GrossWeight: crowdata.GrossWeight,
                            VolumeWeight: crowdata.VolumeWeight,
                            LoadGrossWeight: crowdata.GrossWeight,
                            LoadVol: crowdata.VolumeWeight,
                            SPHC: crowdata.SPHC,
                            Plan: "",//dataitem.ULDNo.substr(0, 3),//Farogh Haider
                            FromTable: crowdata.FromTable,
                            FromTableSNo: crowdata.FromTableSNo,
                            WeightDetail: crowdata.AWBGrossWeight + "/" + crowdata.AWBVolumeWeight + "/" + crowdata.AWBCBM,
                            ShipmentDetail: crowdata.ShipmentDetail,
                            LoadDetail: "",
                            AWBPieces: crowdata.AWBPieces,
                            AWBGrossWeight: crowdata.AWBGrossWeight,
                            AWBVolumeWeight: crowdata.AWBVolumeWeight,
                            FPSNo: crowdata.FPSNo,
                            MCBookingSNo: crowdata.MCBookingSNo,
                            ShipmentType: crowdata.ShipmentType,
                            Status: crowdata.Status,
                            AWBCBM: crowdata.AWBCBM,
                            CBM: crowdata.CBM,
                            LoadCBM: crowdata.CBM,
                            ShipmentId: crowdata.ShipmentId,
                            IsPlanned: crowdata.IsPlanned,
                            Action: crowdata.Action,
                            Priority: crowdata.Priority
                            //Action: '<a id="' + crowdata.ShipmentId + '" onclick=\"fnMoveToLyingListNew(this,1);\"><i class=\"fa fa-mail-forward\" style=\"font-size:15px;\" title=\"Move to Lying List\"></i></a>'
                            //IsChanged: crowdata.IsChanged,
                            //OffloadStage: crowdata.OffloadStage
                        };

                        var existingshipdata = $.grep(lyinggriddatasource.data(), function (e, index) {
                            if (e.AWBSNo == crowdata.AWBSno && e.FromTable == cdata[trIndex].FromTable && e.FromTableSNo == cdata[trIndex].FromTableSNo) {
                                offloadfromuld.GrossWeight = parseFloat(e.GrossWeight) + parseFloat(offloadfromuld.GrossWeight);
                                offloadfromuld.VolumeWeight = parseFloat(e.VolumeWeight) + parseFloat(offloadfromuld.VolumeWeight);
                                offloadfromuld.LIPieces = parseInt(crowdata.FromTableTotalPieces);
                                offloadfromuld.Pieces = (parseInt(e.Pieces.split('/')[0]) + parseInt(crowdata.Pieces)).toString() + "/" + parseInt(crowdata.AWBPieces);
                                offloadfromuld.LoadPieces = parseInt(offloadfromuld.Pieces.split('/')[0]);
                                offloadfromuld.LoadGrossWeight = offloadfromuld.GrossWeight;
                                offloadfromuld.LoadVol = offloadfromuld.VolumeWeight;
                                offloadfromuld.WeightDetail = offloadfromuld.AWBGrossWeight + "/" + offloadfromuld.AWBVolumeWeight + "/" + offloadfromuld.AWBCBM;
                                offloadfromuld.Plan = "";//e.Plan;//Farogh Haider

                                offloadfromuld.CBM = parseFloat(parseFloat(e.CBM) + parseFloat(offloadfromuld.CBM)).toFixed(3);
                                offloadfromuld.LoadCBM = parseFloat(offloadfromuld.CBM).toFixed(3);
                                offloadfromuld.Action = '';
                                offloadfromuld.IsPlanned = offloadfromuld.IsPlanned;
                                return e;
                            }
                            //***************Added by Haider*****************************/
                            else {
                                //e.GrossWeight = parseFloat(e.GrossWeight) + parseFloat(e.GrossWeight);
                                //e.VolumeWeight = parseFloat(e.VolumeWeight) + parseFloat(e.VolumeWeight);
                                //e.LIPieces = parseInt(crowdata.FromTableTotalPieces);
                                //e.Pieces = (parseInt(e.Pieces.split('/')[0]) + parseInt(crowdata.Pieces)).toString() + "/" + parseInt(crowdata.AWBPieces);
                                e.LoadPieces = parseInt(e.Pieces.split('/')[0]);
                                e.LoadGrossWeight = e.GrossWeight;
                                e.LoadVol = e.VolumeWeight;
                                e.LoadCBM = e.CBM;
                                e.WeightDetail = e.AWBGrossWeight + "/" + e.AWBVolumeWeight + "/" + e.AWBCBM;
                                e.IsPlanned = e.IsPlanned;
                                e.Action = '';
                                //e.Action = '<a id="' + e.ShipmentId + '" onclick=\"fnMoveToLyingListNew(this,1);\"><i class=\"fa fa-mail-forward\" style=\"font-size:15px;\" title=\"Move to Lying List\"></i></a>'
                                //e.Plan = e.Plan;
                                //return e;
                            }
                        });
                        if (existingshipdata.length == 0) {
                            lyinggriddatasource.insert(offloadfromuld);
                        }
                        else {
                            //cdatasource.remove(matchingdataitem[0]);
                            lyinggriddatasource.remove(existingshipdata[0]);
                            lyinggriddatasource.insert(offloadfromuld);
                        }
                    }

                    /*************ULD Details*********************************************************/

                    var matchingdataitem = [];

                    deleteddata.push(cdata[trIndex]);
                    if (uldmasterrow == undefined || ulddataitem == undefined) {
                        uldmasterrow = $("#div__" + vgrid.options.parentValue.toString()).closest("tr.k-detail-row").prev();
                        ulddataitem = vgrid.dataItem(uldmasterrow);


                    }
                    var usedgrwt = parseFloat(ulddataitem.GrossWeight) - parseFloat(crowdata.GrossWeight);
                    var usedvolwt = parseFloat(ulddataitem.VolumeWeight) - parseFloat(crowdata.VolumeWeight);

                    var usedCBM = parseFloat(parseFloat(ulddataitem.CBM) - parseFloat(crowdata.CBM)).toFixed(3);


                    //if(usedgrwt > ulddataitem.) 
                    ulddataitem.GrossWeight = usedgrwt.toFixed(1);
                    ulddataitem.VolumeWeight = usedvolwt.toFixed(2);
                    ulddataitem.CBM = parseFloat(usedCBM).toFixed(3);
                    ulddataitem.Shipments = parseInt(ulddataitem.Shipments) - 1;

                    ulddataitem.Used = ulddataitem.GrossWeight + " / " + ulddataitem.VolumeWeight;
                    uldmasterrow.find("td:eq(" + uldusedindex + ")").text(ulddataitem.Used);

                    uldmasterrow.find("td:eq(" + uldtotalship + ")").text(cdatasource.data().length - deleteddata.length);
                    successshipment = successshipment + (successshipment == "" ? "" : " , ") + "[" + crowdata.AwbNo + "]";

                    successshipmentSNo = successshipmentSNo + (successshipmentSNo == "" ? "" : " , ") + crowdata.AWBSno;
                    /**********Check ULD Type*********************/
                    if (ulddataitem != undefined && ulddataitem.ULDNo == "BULK") {
                        ULDType = "BULK";
                    }
                    /********************************************/
                }
                else {
                    ShowMessage('warning', 'Warning - Removed from ' + ULDType, "AWB No " + crowdata.AwbNo + " -  check piece value ", "bottom-right");

                }
            });

            if (selectedShipmentCount == 0) {
                ShowMessage('warning', 'Warning - Removed from ' + ULDType, "Select a shipment to move.", "bottom-right");
                return false;
            }
            var dlen = deleteddata.length;
            for (var i = dlen - 1; i >= 0; i--) {
                cdatasource.remove(deleteddata[i]);

                /*Unlocked AWBNo when move to non uld section --Brajendra*/
                SaveUpdateLockedProcess(deleteddata[i].AWBSno, "", "", "", userContext.UserSNo, "31", "FlightBuildUp", "", "");

            }

            if (successshipment != "") {
                ShowMessage('success', 'Success - Removed from ' + ULDType, "Selected shipment " + successshipment + " processed successfully.", "bottom-right");
                BindShipmentOffPoint(vgrid.options.parentValue.toString(), successshipmentSNo, "MoveFromULD", IsCartStatus);
                SetNumericOnly("txtPcs");
                SetNumericOnly("txtLPcs");
            }
        }
        else {
            ShowMessage('warning', 'Warning - Removed from ' + ULDType, "Select a ULD type/Bulk to move selected shipments into an ULD/Bulk.", "bottom-right");

        }
    }
    CheckCollepsRow = 0;
    $('#btnSave').attr("disabled", false);
}

function CalculateValues(obj) {
    var trHeader = $(obj).closest("div#divNonUldShipmentSection").find(".k-grid-header").find("tr[role='row']");
    var awbpcsindex = -1;
    var planpcsindex = -1;
    var awbgrwtindex = -1;
    var awbvolwtindex = -1;
    var lipcsindex = -1;
    var pcsindex = -1;
    var grwtindex = -1;
    var volwtindex = -1;
    var awbnoindex = -1;
    var loaddetailindex = -1;
    var WeightDetailIndex = -1;
    var CBMIndex = -1;


    awbnoindex = trHeader.find("th[data-field='AWBNo']").index();
    planpcsindex = trHeader.find("th[data-field='Pieces']").index();
    awbpcsindex = trHeader.find("th[data-field='AWBPieces']").index();
    awbgrwtindex = trHeader.find("th[data-field='AWBGrossWeight']").index();
    awbvolwtindex = trHeader.find("th[data-field='AWBVolumeWeight']").index();
    lipcsindex = trHeader.find("th[data-field='LIPieces']").index();
    pcsindex = trHeader.find("th[data-field='LoadPieces']").index();
    grwtindex = trHeader.find("th[data-field='LoadGrossWeight']").index();
    volwtindex = trHeader.find("th[data-field='LoadVol']").index();
    loaddetailindex = trHeader.find("th[data-field='LoadDetail']").index();
    WeightDetailIndex = trHeader.find("th[data-field='WeightDetail']").index();
    CBMIndex = trHeader.find("th[data-field='CBM']").index();

    var closestTr = $(obj).closest("tr");

    var lipcs = parseInt(closestTr.find("td:eq(" + lipcsindex + ")").text());
    var awbno = closestTr.find("td:eq(" + awbnoindex + ")").text();
    var Pieces = parseInt(closestTr.find("td:eq(" + loaddetailindex + ")").find("input[type='text'][id='txtPcs']").val());
    var data = closestTr.find("td:eq(" + planpcsindex + ")").text();
    var maxpcsplanned = parseInt(data.split('/')[0]);
    var pcsControl = closestTr.find("td:eq(" + loaddetailindex + ")").find("input[type='text'][id='txtPcs']");
    var grControl = closestTr.find("td:eq(" + loaddetailindex + ")").find("input[type='text'][id='txtGross']");
    var volControl = closestTr.find("td:eq(" + loaddetailindex + ")").find("input[type='text'][id='txtVol']");
    var WeightDetail_Label = closestTr.find("td:eq(" + WeightDetailIndex + ") ").text();

    //var result= CheckTotalValues(awbno, lipcs, closestTr.find("td:eq(" + awbgrwtindex + ")").text(), closestTr.find("td:eq(" + awbvolwtindex + ")").text(),grControl.val());

    if (Pieces > maxpcsplanned || Pieces == "" || Pieces == 0 || Pieces == undefined || isNaN(Pieces)) {
        /*
        $(obj).val('0');
        closestTr.find("td:eq(" + grwtindex + ")").text('0');
        closestTr.find("td:eq(" + volwtindex + ")").text('0');
        grControl.val("0");
        volControl.val("0");*/
        $(obj).val(maxpcsplanned);
        closestTr.find("td:eq(" + grwtindex + ")  ").text(WeightDetail_Label.split('/')[0]);
        closestTr.find("td:eq(" + volwtindex + ") ").text(WeightDetail_Label.split('/')[1]);
        grControl.val(WeightDetail_Label.split('/')[0]);
        volControl.val(WeightDetail_Label.split('/')[1]);
        closestTr.find("td:eq(" + CBMIndex + ") ").text(parseFloat(closestTr.find("td:eq(" + CBMIndex + ") ").text()).toFixed(3));
        ShowMessage('warning', 'Warning!', "AWB No. [" + awbno + "] -  Unable to process. Check planned piece.", "bottom-right");
        return false;
    }

    //if (result != "Completed") {
    var TotPcs = maxpcsplanned;//lipcs;//closestTr.find("td:eq(" + awbpcsindex + ")").text();
    var GrosWt = parseFloat(WeightDetail_Label.split('/')[0]);// closestTr.find("td:eq(" + awbgrwtindex + ")").text();
    var VolWt = parseFloat(WeightDetail_Label.split('/')[1]); //closestTr.find("td:eq(" + awbvolwtindex + ")").text();
    closestTr.find("td:eq(" + grwtindex + ") ").text(((parseFloat(GrosWt) / TotPcs) * Pieces).toFixed(2));
    closestTr.find("td:eq(" + volwtindex + ") ").text(((parseFloat(VolWt) / TotPcs) * Pieces).toFixed(2));
    grControl.val(((parseFloat(GrosWt) / TotPcs) * Pieces).toFixed(2));
    volControl.val(((parseFloat(VolWt) / TotPcs) * Pieces).toFixed(2));
    closestTr.find("td:eq(" + CBMIndex + ") ").text(((parseFloat(closestTr.find("td:eq(" + CBMIndex + ") ").text()) / TotPcs) * Pieces).toFixed(3));
    //}
}

function CheckGrossValues(obj) {
    var trHeader = $(obj).closest("div#divNonUldShipmentSection").find(".k-grid-header").find("tr[role='row']");
    var awbnoindex = -1;
    var loaddetailindex = -1;
    var WeightDetailIndex = -1;
    var planpcsindex = -1;

    awbnoindex = trHeader.find("th[data-field='AWBNo']").index();
    loaddetailindex = trHeader.find("th[data-field='LoadDetail']").index();
    WeightDetailIndex = trHeader.find("th[data-field='WeightDetail']").index();
    planpcsindex = trHeader.find("th[data-field='Pieces']").index();

    var closestTr = $(obj).closest('tr');
    var GrossWeight = parseFloat(obj.value);
    var awbno = closestTr.find("td:eq(" + awbnoindex + ")").text();
    var Pieces_Label = closestTr.find("td:eq(" + planpcsindex + ")").text();
    var WeightDetail_Label = closestTr.find("td:eq(" + WeightDetailIndex + ") ").text();
    var maxpcsplanned_Pieces = parseInt(Pieces_Label.split('/')[0]);
    var maxpcsplanned_GRWT = parseFloat(WeightDetail_Label.split('/')[0]);
    var pcsControl = closestTr.find("td:eq(" + loaddetailindex + ")").find("input[type='text'][id='txtPcs']");
    var grControl = closestTr.find("td:eq(" + loaddetailindex + ")").find("input[type='text'][id='txtGross']");

    if (GrossWeight > maxpcsplanned_GRWT) {
        ShowMessage('warning', 'Warning!', "AWB No. [" + awbno + "] -  Unable to process. Check Gross Weight.", "bottom-right");
        grControl.val(maxpcsplanned_GRWT);
        return false;
    }
    else if (parseInt(pcsControl.val()) == maxpcsplanned_Pieces && GrossWeight != maxpcsplanned_GRWT) {
        ShowMessage('warning', 'Warning!', "AWB No. [" + awbno + "] -  Unable to process. Check Gross Weight.", "bottom-right");
        grControl.val(maxpcsplanned_GRWT);
        return false;
    }

}

function CheckVolValues(obj) {

    var trHeader = $(obj).closest("div#divNonUldShipmentSection").find(".k-grid-header").find("tr[role='row']");
    var awbnoindex = -1;
    var loaddetailindex = -1;
    var WeightDetailIndex = -1;
    var planpcsindex = -1;
    awbnoindex = trHeader.find("th[data-field='AWBNo']").index();
    loaddetailindex = trHeader.find("th[data-field='LoadDetail']").index();
    WeightDetailIndex = trHeader.find("th[data-field='WeightDetail']").index();
    planpcsindex = trHeader.find("th[data-field='Pieces']").index();

    var closestTr = $(obj).closest('tr');
    var VolumeWeight = parseFloat(obj.value);
    var awbno = closestTr.find("td:eq(" + awbnoindex + ")").text();
    var Pieces_Label = closestTr.find("td:eq(" + planpcsindex + ")").text();
    var WeightDetail_Label = closestTr.find("td:eq(" + WeightDetailIndex + ") ").text();
    var maxpcsplanned_Pieces = parseInt(Pieces_Label.split('/')[0]);
    var maxpcsplanned_VolWT = parseFloat(WeightDetail_Label.split('/')[1]);
    var pcsControl = closestTr.find("td:eq(" + loaddetailindex + ")").find("input[type='text'][id='txtPcs']");
    var volControl = closestTr.find("td:eq(" + loaddetailindex + ")").find("input[type='text'][id='txtVol']");

    if (VolumeWeight > maxpcsplanned_VolWT) {
        ShowMessage('warning', 'Warning!', "AWB No. [" + awbno + "] -  Unable to process. Check Volume Weight.", "bottom-right");
        volControl.val(maxpcsplanned_VolWT);
        return false;
    }
    else if (parseInt(pcsControl.val()) == maxpcsplanned_Pieces && VolumeWeight != maxpcsplanned_VolWT) {
        ShowMessage('warning', 'Warning!', "AWB No. [" + awbno + "] -  Unable to process. Check Volume Weight.", "bottom-right");
        volControl.val(maxpcsplanned_VolWT);
        return false;
    }

}

function CalculateLyingValues(obj) {
    var trHeader = $(obj).closest("div#divLyingListSection").find(".k-grid-header").find("tr[role='row']");
    var awbpcsindex = -1;
    var planpcsindex = -1;
    var awbgrwtindex = -1;
    var awbvolwtindex = -1;
    var lipcsindex = -1;
    var pcsindex = -1;
    var grwtindex = -1;
    var volwtindex = -1;
    var awbnoindex = -1;
    var loaddetailindex = -1;
    var WeightDetailIndex = -1;
    var CBMIndex = -1;

    awbnoindex = trHeader.find("th[data-field='AWBNo']").index();
    planpcsindex = trHeader.find("th[data-field='Pieces']").index();
    awbpcsindex = trHeader.find("th[data-field='AWBPieces']").index();
    awbgrwtindex = trHeader.find("th[data-field='AWBGrossWeight']").index();
    awbvolwtindex = trHeader.find("th[data-field='AWBVolumeWeight']").index();
    lipcsindex = trHeader.find("th[data-field='LIPieces']").index();
    pcsindex = trHeader.find("th[data-field='LoadPieces']").index();
    grwtindex = trHeader.find("th[data-field='LoadGrossWeight']").index();
    volwtindex = trHeader.find("th[data-field='LoadVol']").index();
    loaddetailindex = trHeader.find("th[data-field='LoadDetail']").index();
    WeightDetailIndex = trHeader.find("th[data-field='WeightDetail']").index();
    CBMIndex = trHeader.find("th[data-field='CBM']").index();
    var closestTr = $(obj).closest("tr");
    var lipcs = parseInt(closestTr.find("td:eq(" + lipcsindex + ")").text());
    var awbno = closestTr.find("td:eq(" + awbnoindex + ")").text();
    var Pieces = parseInt(closestTr.find("td:eq(" + loaddetailindex + ")").find("input[type='text'][id='txtLPcs']").val());
    var pcsControl = closestTr.find("td:eq(" + loaddetailindex + ")").find("input[type='text'][id='txtLPcs']");
    var grControl = closestTr.find("td:eq(" + loaddetailindex + ")").find("input[type='text'][id='txtLGross']");
    var volControl = closestTr.find("td:eq(" + loaddetailindex + ")").find("input[type='text'][id='txtLVol']");
    var WeightDetail_Label = closestTr.find("td:eq(" + WeightDetailIndex + ") ").text();
    var CBM = parseFloat(closestTr.find("td:eq(" + CBMIndex + ")").text());

    var data = closestTr.find("td:eq(" + planpcsindex + ")").text();
    var maxpcsplanned = parseInt(data.split('/')[0]);

    if (Pieces > maxpcsplanned || Pieces == "" || Pieces == 0 || Pieces == undefined || isNaN(Pieces)) {
        /*
        $(obj).val('0');
        closestTr.find("td:eq(" + grwtindex + ")").text('0');
        closestTr.find("td:eq(" + volwtindex + ")").text('0');
        grControl.val("0");
        volControl.val("0");*/
        $(obj).val(maxpcsplanned);
        closestTr.find("td:eq(" + grwtindex + ")  ").text(WeightDetail_Label.split('/')[0]);
        closestTr.find("td:eq(" + volwtindex + ") ").text(WeightDetail_Label.split('/')[1]);
        grControl.val(WeightDetail_Label.split('/')[0]);
        volControl.val(WeightDetail_Label.split('/')[1]);
        closestTr.find("td:eq(" + CBMIndex + ") ").text(parseFloat(closestTr.find("td:eq(" + CBMIndex + ") ").text()).toFixed(3));
        ShowMessage('warning', 'Warning!', "AWB No. [" + awbno + "] -  Unable to process. Check planned piece.", "bottom-right");
        return false;
    }
    var TotPcs = maxpcsplanned;//closestTr.find("td:eq(" + awbpcsindex + ")").text();
    var GrosWt = parseFloat(WeightDetail_Label.split('/')[0]);//closestTr.find("td:eq(" + awbgrwtindex + ")").text();
    var VolWt = parseFloat(WeightDetail_Label.split('/')[1]); //closestTr.find("td:eq(" + awbvolwtindex + ")").text();
    closestTr.find("td:eq(" + grwtindex + ") ").text(((parseFloat(GrosWt) / TotPcs) * Pieces).toFixed(2));
    closestTr.find("td:eq(" + volwtindex + ") ").text(((parseFloat(VolWt) / TotPcs) * Pieces).toFixed(2));
    grControl.val(((parseFloat(GrosWt) / TotPcs) * Pieces).toFixed(2));
    volControl.val(((parseFloat(VolWt) / TotPcs) * Pieces).toFixed(2));
    closestTr.find("td:eq(" + CBMIndex + ") ").text(((parseFloat(closestTr.find("td:eq(" + CBMIndex + ")").text()) / TotPcs) * Pieces).toFixed(3));
}

function CheckLyingGrossValues(obj) {
    var trHeader = $(obj).closest("div#divLyingListSection").find(".k-grid-header").find("tr[role='row']");
    var awbnoindex = -1;
    var loaddetailindex = -1;
    var WeightDetailIndex = -1;
    var planpcsindex = -1;
    var CBMIndex = -1;


    awbnoindex = trHeader.find("th[data-field='AWBNo']").index();
    loaddetailindex = trHeader.find("th[data-field='LoadDetail']").index();
    WeightDetailIndex = trHeader.find("th[data-field='WeightDetail']").index();
    planpcsindex = trHeader.find("th[data-field='Pieces']").index();
    CBMIndex = trHeader.find("th[data-field='CBM']").index();

    var closestTr = $(obj).closest('tr');
    var GrossWeight = parseFloat(obj.value);
    var awbno = closestTr.find("td:eq(" + awbnoindex + ")").text();
    var Pieces_Label = closestTr.find("td:eq(" + planpcsindex + ")").text();
    var WeightDetail_Label = closestTr.find("td:eq(" + WeightDetailIndex + ") ").text();
    var maxpcsplanned_Pieces = parseInt(Pieces_Label.split('/')[0]);
    var maxpcsplanned_GRWT = parseFloat(WeightDetail_Label.split('/')[0]);
    var pcsControl = closestTr.find("td:eq(" + loaddetailindex + ")").find("input[type='text'][id='txtLPcs']");
    var grControl = closestTr.find("td:eq(" + loaddetailindex + ")").find("input[type='text'][id='txtLGross']");

    if (GrossWeight > maxpcsplanned_GRWT) {
        ShowMessage('warning', 'Warning!', "AWB No. [" + awbno + "] -  Unable to process. Check Gross Weight.", "bottom-right");
        grControl.val(maxpcsplanned_GRWT);
        return false;
    }
    else if (parseInt(pcsControl.val()) == maxpcsplanned_Pieces && GrossWeight != maxpcsplanned_GRWT) {
        ShowMessage('warning', 'Warning!', "AWB No. [" + awbno + "] -  Unable to process. Check Gross Weight.", "bottom-right");
        grControl.val(maxpcsplanned_GRWT);
        return false;
    }
}

function CheckLyingVolValues(obj) {
    var trHeader = $(obj).closest("div#divLyingListSection").find(".k-grid-header").find("tr[role='row']");
    var awbnoindex = -1;
    var loaddetailindex = -1;
    var WeightDetailIndex = -1;
    var planpcsindex = -1;
    awbnoindex = trHeader.find("th[data-field='AWBNo']").index();
    loaddetailindex = trHeader.find("th[data-field='LoadDetail']").index();
    WeightDetailIndex = trHeader.find("th[data-field='WeightDetail']").index();
    planpcsindex = trHeader.find("th[data-field='Pieces']").index();

    var closestTr = $(obj).closest('tr');
    var VolumeWeight = parseFloat(obj.value);
    var awbno = closestTr.find("td:eq(" + awbnoindex + ")").text();
    var Pieces_Label = closestTr.find("td:eq(" + planpcsindex + ")").text();
    var WeightDetail_Label = closestTr.find("td:eq(" + WeightDetailIndex + ") ").text();
    var maxpcsplanned_Pieces = parseInt(Pieces_Label.split('/')[0]);
    var maxpcsplanned_VolWT = parseFloat(WeightDetail_Label.split('/')[1]);
    var pcsControl = closestTr.find("td:eq(" + loaddetailindex + ")").find("input[type='text'][id='txtLPcs']");
    var volControl = closestTr.find("td:eq(" + loaddetailindex + ")").find("input[type='text'][id='txtLVol']");

    if (VolumeWeight > maxpcsplanned_VolWT) {
        ShowMessage('warning', 'Warning!', "AWB No. [" + awbno + "] -  Unable to process. Check Volume Weight.", "bottom-right");
        volControl.val(maxpcsplanned_VolWT);
        return false;
    }
    else if (parseInt(pcsControl.val()) == maxpcsplanned_Pieces && VolumeWeight != maxpcsplanned_VolWT) {
        ShowMessage('warning', 'Warning!', "AWB No. [" + awbno + "] -  Unable to process. Check Volume Weight.", "bottom-right");
        volControl.val(maxpcsplanned_VolWT);
        return false;
    }
}

function SaveBuildUpPlan() {

    signalR.startHub();
    //processeduld
    // Changes by Vipin Kumar
    processeduldshipmentCheck = [];

    ///Added By karan for Uld or Cart message type-------------
    var Iscartstatus = 0;
    var ULDTypeForCart = 'ULD';
    var vgridForCart = cfi.GetCFGrid("divUldShipmentSection");
    var IsPreTobeRefersh = false;


    var predata = jQuery.grep(processList, function (n, i) {
        return (n.GroupFlightSNo == $("#Text_searchFlightNo").data("kendoAutoComplete").key() && n.ProcessSNo == 33 && n.EventType == "SAVE");
    });
    var preTime = predata.length > 0 ? predata[0].ProcessSaveTime : null;
    var BUPdata = jQuery.grep(processList, function (n, i) {
        return (n.GroupFlightSNo == $("#Text_searchFlightNo").data("kendoAutoComplete").key() && n.ProcessSNo == 30 && (new Date(preTime) > new Date(n.ProcessOpenTime) && new Date(preTime) < new Date()));
    });
    if (predata.length > 0 && BUPdata.length > 0) { IsPreTobeRefersh = true }
    else {
        signalR.updateProcessStatus({
            GroupFlightSNo: $("#Text_searchFlightNo").data("kendoAutoComplete").key(), ProcessSNo: 30, EventType: 'SAVE'
        });
    }

    if (IsPreTobeRefersh) {
        ShowMessage('warning', 'Warning', "Some changes have been made at Premanifest. Kindly refresh the page to proceed with Buildup.", "bottom-right");
        return;
    }

    if (vgridForCart != undefined) {
        var datasource_uldForCart = vgridForCart.dataSource;
        var data_uldForCart = datasource_uldForCart.data();


        $.each(data_uldForCart, function (i, item) {
            Iscartstatus = (item.IsCart == "true" ? "1" : item.IsCart);
        });
        if (Iscartstatus == 1) {
            ULDTypeForCart = 'Cart';
        } else { ULDTypeForCart = 'ULD'; }
    }

    if ($('#RegistrationNo').val() != "" && $('#RegistrationNo').val().length < 1 || $('#RegistrationNo').val() != "" && $('#RegistrationNo').val().length > 10) {
        alert('Aircraft Regn Nbr should be Minimum 1 & Maximum 10 characters.');
        return;
    }

    if ($("#chkFFMRemarks").is(":checked") && $('#Remarks').val().trim() == "") {
        ShowMessage('warning', 'Please Enter ' + ULDTypeForCart + ' Remarks.');
        return;
    }
    else if ($("#IsFFMRemarks").is(":checked") && $('#OverhangOtherInfo').val().trim() == "") {
        ShowMessage('warning', 'Please Enter Overhang Other Info.');
        return;
    }
    ///***************Check Scale Weight******************************/
    //var TotalULDWeight = GetULDWeight();
    //if ($("#Text_EquipmentID").data("kendoAutoComplete").key() != "") {
    //    var equipmentWeight = $("#Text_EquipmentID").data("kendoAutoComplete").key().split('-')[1];
    //    TotalULDWeight = parseFloat(TotalULDWeight) + parseFloat(equipmentWeight);
    //}
    //var ScaleWeight = $('#AddScaleWeight').val();
    //if (ScaleWeight != "") {
    //    if (parseFloat(TotalULDWeight) > parseFloat(ScaleWeight)) {
    //        //ShowMessage('warning', 'Information', "Scale weight cannot be less than Tare Weight (Equipment + ULD)");
    //        ShowMessage('warning', 'Information', "Scale weight should be greater than the total of ULD Tare weight & Equipment Tare weight.[Total Tare weight=" + TotalULDWeight + "]");

    //        return;
    //    }
    //}

    if (savetype == "") {
        processeduld = [];
        processeduldshipment = [];

        var vgrid = cfi.GetCFGrid("divUldShipmentSection");
        var IsShipment = true;
        var CurrentULDNo = "";

        if (vgrid != undefined) {
            var datasource_uld = vgrid.dataSource;
            var data_uld = datasource_uld.data();
            if (data_uld.length == 0) {
                ShowMessage('warning', 'Please add atleast 1 Cart/ULD/Bulk to create Build Up.');
                return;
            }


            $.each(data_uld, function (i, item) {
                if (item.Shipments == 0) {
                    IsShipment = false;
                    CurrentULDNo = item.ULDNo;
                    return false;
                }

            });
            if (IsShipment == false) {
                ShowMessage('warning', 'Please add atleast 1 shipment in ' + CurrentULDNo);
                return;
            }
        }

        var trHeader = $("div#divUldShipmentSection").find(".k-grid-header").find("tr[role='row']");
        var uldstocksnoindex = -1;
        var totalshipmentindex = -1;
        var ULDNoIndex = -1;
        var IsCartIndex = -1;

        uldstocksnoindex = trHeader.find("th[data-field='ULDStockSNo']").index();
        totalshipmentindex = trHeader.find("th[data-field='Shipments']").index();
        ULDNoIndex = trHeader.find("th[data-field='ULDNo']").index();
        IsCartIndex = trHeader.find("th[data-field='IsCart']").index();

        var McBookingSNoIndex = trHeader.find("th[data-field='MCBookingSNo']").index();

        var UldMsg = "";
        var AWBMsg = "";

        $("#divUldShipmentSection").find("tr.k-master-row").each(function () {
            var uldStockSNo = $(this).find("td:eq(" + uldstocksnoindex + ")").text();
            var uldStock_No = $(this).find("td:eq(" + ULDNoIndex + ")").text();
            var IsCart = $(this).find("td:eq(" + IsCartIndex + ")").text();

            var McBookingSNo = $(this).find("td:eq(" + McBookingSNoIndex + ")").text();

            var isprocessed = 0;
            var detailgrid = cfi.GetNestedCFGrid("div__" + uldStockSNo.toString());
            if (detailgrid != undefined) {
                isprocessed = 1;
                var detaildatasource = detailgrid.dataSource;
                var detaildata = detaildatasource.data();
                $.each(detaildata, function (i, item) {
                    if (item) {
                        var UldModel = {
                            ULDStockSNo: uldStockSNo,
                            AWBSNo: item.AWBSno,
                            Pieces: item.Pieces,
                            GrossWeight: item.GrossWeight,
                            VolumeWeight: item.VolumeWeight,
                            //AWBOffPoint: item.AWBOffPoint
                            AWBOffPoint: (IsCart == "true" || IsCart == "1") ? (uldStockSNo == "0" ? ($("#Text_AWBOffPoint_0_" + item.AWBSno).data("kendoAutoComplete") == undefined
                                ? $("#Text_AWBOffPoint_0_" + item.AWBSno).val().toUpperCase().trim()
                                : $("#Text_AWBOffPoint_0_" + item.AWBSno).data("kendoAutoComplete").value().trim()) : ($("#Text_AWBOffPoint_" + uldStockSNo + "_" + item.AWBSno).data("kendoAutoComplete") == undefined
                                    ? $("#Text_AWBOffPoint_" + uldStockSNo + "_" + item.AWBSno).val().toUpperCase().trim()
                                    : $("#Text_AWBOffPoint_" + uldStockSNo + "_" + item.AWBSno).data("kendoAutoComplete").value().trim())) : (uldStockSNo == "0" ? ($("#Text_AWBOffPoint_0_" + item.AWBSno).data("kendoAutoComplete") == undefined
                                        ? $("#Text_AWBOffPoint_0_" + item.AWBSno).val().toUpperCase().trim()
                                        : $("#Text_AWBOffPoint_0_" + item.AWBSno).data("kendoAutoComplete").value().trim()) : ($("#Text_offloadPoint_" + uldStockSNo).data("kendoAutoComplete") == undefined
                                            ? $("#Text_offloadPoint_" + uldStockSNo).val().toUpperCase().trim()
                                            : $("#Text_offloadPoint_" + uldStockSNo).data("kendoAutoComplete").value().trim())),
                            // AWBOffPoint: (IsCart == "true" || IsCart == "1") ? (uldStockSNo == "0" ? ($("#Text_AWBOffPoint_0_" + item.AWBSno).data("kendoAutoComplete") == undefined ? '' : $("#Text_AWBOffPoint_0_" + item.AWBSno).data("kendoAutoComplete").value().trim()) : ($("#Text_AWBOffPoint_" + uldStockSNo + "_" + item.AWBSno).data("kendoAutoComplete") == undefined ? '' : $("#Text_AWBOffPoint_" + uldStockSNo + "_" + item.AWBSno).data("kendoAutoComplete").value().trim())) : ($("#Text_offloadPoint_" + uldStockSNo).data("kendoAutoComplete").value() == undefined ? '' : $("#Text_offloadPoint_" + uldStockSNo).data("kendoAutoComplete").value().trim()),
                            ConnectingFlight: $("#ConnectingFlight_" + uldStockSNo + "_" + item.AWBSno).val() == undefined ? 0 : ($("#ConnectingFlight_" + uldStockSNo + "_" + item.AWBSno).val() == '' ? 0 : $("#ConnectingFlight_" + uldStockSNo + "_" + item.AWBSno).val().trim()),
                            MCBookingSNo: item.MCBookingSNo,
                            CBM: item.CBM
                            // IsChanged: item.IsChanged

                        }
                        processeduldshipment.push(UldModel);

                        if (uldStockSNo == "0" && ($("#Text_AWBOffPoint_0_" + item.AWBSno).data("kendoAutoComplete") == undefined ? $("#Text_AWBOffPoint_0_" + item.AWBSno).val().trim() : $("#Text_AWBOffPoint_0_" + item.AWBSno).data("kendoAutoComplete").value().trim()) == "") {
                            AWBMsg = item.AwbNo.trim() + ", " + AWBMsg;
                        }
                    }
                });
            }


            processeduld.push({
                ULDStockSNo: uldStockSNo,
                //OffloadPoint: $(this).find("input[type='hidden']").val(),
                OffloadPoint: $("#Text_offloadPoint_" + uldStockSNo).data("kendoAutoComplete") == undefined ? '' : $("#Text_offloadPoint_" + uldStockSNo).data("kendoAutoComplete").value().trim(),
                TotalShipment: $(this).find("td:eq(" + totalshipmentindex + ")").text(),
                IsProcessed: isprocessed
            });

            if (uldStockSNo != "0" && IsCart == "0" && ($("#Text_offloadPoint_" + uldStockSNo).data("kendoAutoComplete") == undefined ? '' : $("#Text_offloadPoint_" + uldStockSNo).data("kendoAutoComplete").value().trim()) == "") {
                UldMsg = uldStock_No == '' ? '' : uldStock_No.trim() + ", " + UldMsg;
            }

        });
        var processedFlightInfo = {
            DailyFlightSNo: $("input[type='hidden'][id='FlightNo").val(),
            RegistrationNo: $("#RegistrationNo").val()
        }
        if (processedawb.length == 0) {
            processedawb.push({
                AWBSno: "0",
                AwbNo: "",
                Pieces: "0",
                GrossWeight: "0",
                VolumeWeight: "0",
                SPHC: "",
                ULDStockSNo: -2,
                FromTable: "-1",
                FromTableSNo: "0",
                CBM: "0"
            });
            //processeduldshipment = [];
            //processeduldshipment.push({
            //    ULDStockSNo: -1,
            //    AWBSNo: -1
            //});
        }
        // Changes by Vipin Kumar
        //if (processeduldshipment.length == 0) {
        //    processeduldshipment.push({
        //        ULDStockSNo: -1,
        //        AWBSNo: -1
        //    });
        //}
        if (IsOffloadFromBulk == 1) {
            processeduldshipment = [];
            processeduldshipment.push({
                ULDStockSNo: -1,
                AWBSNo: -1
            });
        }
        else {
            if (processeduldshipment.length == 0) {
                processeduldshipment.push({
                    ULDStockSNo: -1,
                    AWBSNo: -1
                });
            }
        }
        // Ends


        var GroupFlightSNo = $("#Text_searchFlightNo").data("kendoAutoComplete").key();

        /***********Check Off Point*******************/
        if (UldMsg != "") {
            ShowMessage('warning', 'Warning - ULD Off Point', 'Kindly select the Off Point against the ULD No. ' + UldMsg, "bottom-right");

            return;
        }
        if (AWBMsg != "") {

            /// Kindly select the Off Point against the Waybill Nbr 

            var Awbmessage = AWBMsg.trim().length > 13 ? AWBMsg : AWBMsg.replace(',', ' .')
            ShowMessage('warning', 'Warning - BULK Off Point', 'Kindly select the Off Point against the Waybill Number ' + Awbmessage, "bottom-right");
            return;
        }
        /*********************************************/
        var prsMcBookingship = $.map(processedawb, function (e, index) {
            return e.MCBookingSNo;
        });

        //var prsdMcBookingship = $.map(processeduldshipment, function (e, index) {
        //    return e.MCBookingSNo;
        //});

        var processedawbNew = $.map(processedawb, function (item) {
            if (item.Action)
                item.Action = '';
            return item;
        });
        //delete processeduld.Action;
        //delete processeduldshipment.Action;
        //delete processedawb.Action;
        //delete POMailDetailsArray.Action;

        $.ajax({
            url: "Services/BuildUp/BuildUpProcessService.svc/SaveBuildUpPlan", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({
                ProcessedULDInfo: processeduld, ProcessedULDShipment: processeduldshipment, ProcessedAWB: processedawbNew, ProcessedFlightInfo: processedFlightInfo, POMailDNDetails: $.grep(POMailDetailsArray, function (i) {
                    return prsMcBookingship.join(',').indexOf(i.MCBookingSNo) >= 0;// prsMcBookingship.concat(prsdMcBookingship).join(',').indexOf(i.MCBookingSNo) >= 0

                }), UpdatedBy: _LoginSNo_, RemovedULD: RemovedULDStockSNo, GroupFlightSNo: GroupFlightSNo, AirportSNo: userContext.AirportSNo
            }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "") {
                    ShowMessage('success', 'Success - Build Up', "Flight No. [" + $("#Text_searchFlightNo").data("kendoAutoComplete").value() + "] -  Processed Successfully", "bottom-right");
                    ResetSearchByFlight();
                }
                else
                    ShowMessage('warning', 'Warning - Build Up', "Flight No. [" + $("#Text_searchFlightNo").data("kendoAutoComplete").value() + "] -  " + result, "bottom-right");
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - Build Up', "Flight No. [" + $("#Text_searchFlightNo").data("kendoAutoComplete").value() + "]  -  unable to process.", "bottom-right");

            }
        });
    }
    else if (savetype == "ULDDETAILS") {

        /*-------------------------Overhang Details-------------------------------*/
        var AFT_FWD = $("#Text_OverhangDirection").data("kendoAutoComplete").value();
        var OverhangWidth = $("#OverhangWidth").val();
        var OverhangMesUnit = $("#Text_OverhangMesUnit").data("kendoAutoComplete").value();
        var OverhangType = $("#Text_OverhangType").data("kendoAutoComplete").value();
        /*-----------------------------------------------------------------------*/

        var ULDGrossWeight = 0, ULDVolumeWeight = 0;

        var _BUPSHC = GetULDSHC();

        if (_BUPSHC == "" && LstULDSPH.length > 0 && Iscartstatus == 0) {

            ShowMessage('warning', 'Kindly select atleast one SHC against the ' + ULDTypeForCart);

            return;
        }

        if ($("#Text_UldBupType").data("kendoAutoComplete").value() != "" && $("#Text_UldBasePallet").data("kendoAutoComplete").value() == "") {
            ShowMessage('warning', 'Please select Base Pallet.');
            return;
        }

        /*
        if ($("#Text_EquipmentID").data("kendoAutoComplete").key() != "" && $("input[type='text'][id='AddScaleWeight']").val() == "") {
            ShowMessage('warning', 'Please Add Scale Weight');
            //alert("Please Add Scale Weight");
            return;

        }*/

        if ($("#Text_EquipmentID").data("kendoAutoComplete").value() == "" && $("input[type='text'][id='AddScaleWeight']").val() != "") {
            ShowMessage('warning', 'Warning - Scale Weight', 'Kindly Select Equipment ID');
            return;
        }

        if ($("#IsFFMRemarks").is(":checked") && (AFT_FWD == "" || OverhangWidth == "" || OverhangMesUnit == "" || OverhangType == "")) {
            ShowMessage('warning', 'Please Enter Overhang Details.');
            return;
        }
        if ($("#Height").val() == "" && $("#Text_MeasurementUnit").data("kendoAutoComplete").value() != "") {
            ShowMessage('warning', 'Please Enter ' + ULDTypeForCart + ' Information - Height.');

            $("#Height").focus();
            return;
        }
        if ($("#Height").val() != "" && $("#Text_MeasurementUnit").data("kendoAutoComplete").value() == "") {
            ShowMessage('warning', 'Please Select ' + ULDTypeForCart + ' Information -  Measurement Unit.');

            $("#Text_MeasurementUnit").focus();
            return;
        }
        if ($("#Ovng_IsOverhangPallet").is(":checked") && ($("#Ovng_MasterCutOffHeight").val() == "" && $("#Text_Ovng_MasterMesUnit").data("kendoAutoComplete").value() != "")) {
            ShowMessage('warning', 'Please Enter Overhang Details - Height.');
            $("#Ovng_MasterCutOffHeight").focus();
            return;
        }
        if ($("#Ovng_IsOverhangPallet").is(":checked") && ($("#Ovng_MasterCutOffHeight").val() != "" && $("#Text_Ovng_MasterMesUnit").data("kendoAutoComplete").value() == "")) {
            ShowMessage('warning', 'Please Select Overhang Details -  Measurement Unit.');
            $("#Text_Ovng_MasterMesUnit").focus();
            return;
        }

        var _OvngHeightMsg = false, _OvngHeightUnit = false;

        $("div[id$='areaTrans_ulddetails_uldoverhangpallet']").find("[id^='areaTrans_ulddetails_uldoverhangpallet']").each(function () {

            if ($("#Ovng_IsOverhangPallet").is(":checked") && ($(this).find("[id^='OverhangWidth']").val() != "" && $(this).find("[id^='Text_OverhangMesUnit']").data("kendoAutoComplete").value() == "")) {
                _OvngHeightUnit = true;
                $(this).find("[id^='Text_OverhangMesUnit']").data("kendoAutoComplete").focus();
                return false;
            }

            if ($("#Ovng_IsOverhangPallet").is(":checked") && ($(this).find("[id^='OverhangWidth']").val() == "" && $(this).find("[id^='Text_OverhangMesUnit']").data("kendoAutoComplete").value() != "")) {
                _OvngHeightMsg = true;
                $(this).find("[id^='OverhangWidth']").focus();
                return false;
            }
        });

        if (_OvngHeightUnit) {
            ShowMessage('warning', 'Please Select Overhang Details -  Measurement Unit.');
            return;
        }
        if (_OvngHeightMsg) {
            ShowMessage('warning', 'Please Enter Overhang Details.');
            return;
        }
        /***************Check Scale Weight******************************/
        var TotalULDWeight = GetULDWeight();
        if ($("#Text_EquipmentID").data("kendoAutoComplete").key() != "") {
            var equipmentWeight = $("#Text_EquipmentID").data("kendoAutoComplete").key().split('-')[1];
            TotalULDWeight = parseFloat(TotalULDWeight) + parseFloat(equipmentWeight);
        }
        var ScaleWeight = $('#AddScaleWeight').val();
        if (ScaleWeight != "") {
            if (parseFloat(TotalULDWeight) >= parseFloat(ScaleWeight)) {
                //ShowMessage('warning', 'Information', "Scale weight cannot be less than Tare Weight (Equipment + ULD)");

                ShowMessage('warning', 'Information', "Scale weight should be greater than the total of " + ULDTypeForCart + " Tare weight & Equipment Tare weight.[Total Tare weight=" + TotalULDWeight + "]");


                return;
            }
        }
        /******************************************************/

        var totalWeight = GetULDVolGRWt();

        //if ($("#Text_EquipmentID").data("kendoAutoComplete").key() != "" && $("input[type='text'][id='AddScaleWeight']").val() != "") {
        if (totalWeight != "") {
            ULDGrossWeight = totalWeight.split('/')[0];
            ULDVolumeWeight = totalWeight.split('/')[1];
        }
        //}

        /*************Check ULD Shipment***************************/
        if ((ScaleWeight != "" && parseFloat(ScaleWeight) > 0) || $("#Text_EquipmentID").data("kendoAutoComplete").key() != "") {
            if (totalWeight.split('/')[0].trim() == "" || totalWeight.split('/')[0].trim() == "0.00" || totalWeight.split('/')[0].trim() == "0") {
                ShowMessage('warning', 'Warning - Scale Weight', "Kindly plan shipment in " + ULDTypeForCart + " '" + __uldno.trim() + "'");
                return;
            }
        }
        /*****************************************/

        var uldConsumables = [];
        var _IsShowInFFM = "0"; // 0=>Not Check, 1=>ULD Remarks, 2=>Over hang Other Info
        if ($("#chkFFMRemarks").is(":checked")) {
            _IsShowInFFM = "1";
        }
        else if ($("#IsFFMRemarks").is(":checked")) {
            _IsShowInFFM = "2";
        }

        var uldDetails = {
            ULDStockSNo: __uldstocksno,
            ULDBuildUpLocation: $("#Text_ULDBuildUpLocation").data("kendoAutoComplete").key() == '' ? 0 : $("#Text_ULDBuildUpLocation").data("kendoAutoComplete").key(),
            StartTime: $("#spnULDStartTime").text() == "+ Add Time" ? "" : $("#spnULDStartTime").text(),
            EndTime: $("#spnULDEndTime").text() == "+ Add Time" ? "" : $("#spnULDEndTime").text(),
            NotToBeManifested: $("#NotToBeManifested").is(":checked"),
            //Location: $("input[type='text'][id='Text_ULDLocation']").data("kendoAutoComplete").key() == '' ? 0 : $("input[type='text'][id='Text_ULDLocation']").data("kendoAutoComplete").key(),
            LocationSNo: $("#Text_ULDLocation").data("kendoAutoComplete").key() == '' ? 0 : $("#Text_ULDLocation").data("kendoAutoComplete").key(),
            //Build: $("input[type='text'][id='Text_ULDBuild']").data("kendoAutoComplete").key() == '' ? 0 : $("input[type='text'][id='Text_ULDBuild']").data("kendoAutoComplete").key(),
            BuildSNo: $("input[type='text'][id='Text_ULDBuild']").data("kendoAutoComplete").key() == '' ? 0 : $("input[type='text'][id='Text_ULDBuild']").data("kendoAutoComplete").key(),
            ScaleWeight: $("input[type='text'][id='AddScaleWeight']").val() == '' ? -1 : $("input[type='text'][id='AddScaleWeight']").val(),
            IsTeamPersonnel: $("input[type='radio'][name='IsTeamPersonal']:checked").val(),
            Height: $("#Height").val() == '' ? -1 : $("#Height").val(),
            MeasurementUnit: $("#Text_MeasurementUnit").data("kendoAutoComplete").key() == '' ? 0 : $("#Text_MeasurementUnit").data("kendoAutoComplete").key(),
            Remarks: $("textarea#Remarks").val(),
            LoadCodeSNo: $("#Text_LoadCode").data("kendoAutoComplete").key() == '' ? 0 : $("#Text_LoadCode").data("kendoAutoComplete").key(),
            //LoadIndicator: $("#Text_LoadIndicator").data("kendoAutoComplete").key() == '' ? 0 : $("#Text_LoadIndicator").data("kendoAutoComplete").key(),
            LoadIndicationSNo: $("#Text_LoadIndicator").data("kendoAutoComplete").key() == '' ? 0 : $("#Text_LoadIndicator").data("kendoAutoComplete").key(),
            //AbbrCode: $("#Text_AbbrCode").data("kendoAutoComplete").key() == '' ? 0 : $("#Text_AbbrCode").data("kendoAutoComplete").key(),
            ULDContourSNo: $("#Text_AbbrCode").data("kendoAutoComplete").key() == '' ? 0 : $("#Text_AbbrCode").data("kendoAutoComplete").key(),
            //Feet: $("input[type='text'][id='feet']").val() == '' ? 0 : $("input[type='text'][id='feet']").val(),
            //Inch: $("input[type='text'][id='Inches']").val() == '' ? 0 : $("input[type='text'][id='Inches']").val(),
            BUPTypeSNo: $("#Text_UldBupType").data("kendoAutoComplete").key() == '' ? 0 : $("#Text_UldBupType").data("kendoAutoComplete").key(),
            BaseULDSNo: $("#Text_UldBasePallet").data("kendoAutoComplete").key() == '' ? 0 : $("#Text_UldBasePallet").data("kendoAutoComplete").key(),
            OtherPallets: GetOtherPalletValue(),//$("#_OtherPallets").val()
            IsShowInFFM: _IsShowInFFM,
            EquipmentID: $("#Text_EquipmentID").data("kendoAutoComplete").key() == '' ? 0 : $("#Text_EquipmentID").data("kendoAutoComplete").key().split('-')[0]
        }

        $("div[id$='areaTrans_ulddetails_uldconsumables']").find("[id^='areaTrans_ulddetails_uldconsumables']").each(function () {
            var uldConsumablesViewModel = {
                ULDStockSNo: __uldstocksno,
                ConsumablesSNo: $(this).find("[id^='Text_ConsumablesSNo']").data("kendoAutoComplete").value() == "" ? "" : $(this).find("[id^='Text_ConsumablesSNo']").data("kendoAutoComplete").key(),
                //Quantity: $(this).find("[id^='Text_Quantity']").data("kendoAutoComplete").key()
                Quantity: $(this).find("[id^='Quantity']").val() == "" ? -1 : $(this).find("[id^='Quantity']").val()
            };
            uldConsumables.push(uldConsumablesViewModel);

        });
        if (uldConsumables.length == 0) {
            var uldConsumablesViewModel = {
                ConsumablesSNo: "",
                Quantity: ""
            };
            uldConsumables.push(uldConsumablesViewModel);
        }

        /*****************Overhang Model**************************/
        var ULDBuildUpOverhangTrans = [];

        var Model_ULDBuildUpOverhangPallet = {
            SNo: 0,
            ULDStockDetailsSNo: 0,
            IsOverhangPallet: $("#Ovng_IsOverhangPallet").is(":checked"),
            CutOffHeight: $("#Ovng_MasterCutOffHeight").val() == "" ? -1 : $("#Ovng_MasterCutOffHeight").val(),
            CutOffMesUnit: $("#Text_Ovng_MasterMesUnit").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_Ovng_MasterMesUnit").data("kendoAutoComplete").key(),
            Remarks: $("#Ovng_MasterRemarks").val()
        };

        $("div[id$='areaTrans_ulddetails_uldoverhangpallet']").find("[id^='areaTrans_ulddetails_uldoverhangpallet']").each(function () {
            var Model_ULDBuildUpOverhangTrans = {
                SNo: 0,
                OverhangPalletSNo: 0,
                OverhangDirection: $(this).find("[id^='Text_OverhangDirection']").data("kendoAutoComplete").value() == "" ? 0 : $(this).find("[id^='Text_OverhangDirection']").data("kendoAutoComplete").key(),
                Width: $(this).find("[id^='OverhangWidth']").val() == "" ? -1 : $(this).find("[id^='OverhangWidth']").val(),
                WidthMesUnit: $(this).find("[id^='Text_OverhangMesUnit']").data("kendoAutoComplete").value() == "" ? 0 : $(this).find("[id^='Text_OverhangMesUnit']").data("kendoAutoComplete").key(),
                OverhangType: $(this).find("[id^='Text_OverhangType']").data("kendoAutoComplete").value() == "" ? 0 : $(this).find("[id^='Text_OverhangType']").data("kendoAutoComplete").key(),
                OtherInfo: $(this).find("[id^='OverhangOtherInfo']").val(),
                IsFFMRemarks: $(this).find("[id^='IsFFMRemarks']").is(":checked"),
            };
            ULDBuildUpOverhangTrans.push(Model_ULDBuildUpOverhangTrans);

        });
        /********************************************************/

        $.ajax({
            url: "Services/BuildUp/BuildUpProcessService.svc/SaveULDDetails", async: false, type: "POST", dataType: "json", cache: false,
            //data: JSON.stringify({ ULDDetails: uldDetails, ULDConsumables: uldConsumables, ULDStockSNo: __uldstocksno, DailyFlightSNo: $("input[type='hidden'][id='FlightNo").val(), UpdatedBy: _LoginSNo_, ULDBuildUpOverhangPallet: Model_ULDBuildUpOverhangPallet, ULDBuildUpOverhangTrans: ULDBuildUpOverhangTrans, CityCode:_CityCode_ }),
            data: JSON.stringify({ ULDDetails: uldDetails, ULDConsumables: uldConsumables, ULDStockSNo: __uldstocksno, DailyFlightSNo: $("input[type='hidden'][id='FlightNo").val(), UpdatedBy: _LoginSNo_, ULDBuildUpOverhangPallet: Model_ULDBuildUpOverhangPallet, ULDBuildUpOverhangTrans: ULDBuildUpOverhangTrans, CityCode: _CityCode_, ULDGrWT: parseFloat(ULDGrossWeight), ULDVolumeWeight: parseFloat(ULDVolumeWeight), AirportSNo: userContext.AirportSNo, ULDSHC: _BUPSHC }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "") {
                    if (uldDetails.EndTime != "+ Add Time" && uldDetails.EndTime != "") {
                        AddLockInULD(__uldno);
                    }
                    ShowMessage('success', 'Success - ' + ULDTypeForCart + ' Details', ULDTypeForCart + " No. [" + __uldno + "] -  processed successfully", "bottom-right");
                    cfi.ClosePopUp("divNewBooking");
                    savetype = "";

                    __uldno = "";
                    __uldstocksno = -1;
                }
                else if (result == "BlankQuantity") {
                    ShowMessage('warning', 'Warning - ' + ULDTypeForCart + ' Details', "Plase enter consumable Quantity.", "bottom-right");
                    return;
                }
                else if (result == "ZeroQuantity") {
                    ShowMessage('warning', 'Warning - ' + ULDTypeForCart + ' Details', "Consumable Quantity should be greater than zero.", "bottom-right");
                    return;
                }
                else if (result == "BlankConsumable") {
                    ShowMessage('warning', 'Warning - ' + ULDTypeForCart + ' Details', "Kindly select consumable Item.", "bottom-right");
                    return;
                }
                else if (result == "SessionExpired") {
                    //location.href = 'Account/GarudaLogin.cshtml?islogout=true'; // Commented By akash on 28 March 2018
                    location.href = 'Account/' + userContext.SysSetting.LoginPage + '?islogout=true';
                }
                else if (result == "UWSDone") {
                    ShowMessage('warning', 'Warning - ' + ULDTypeForCart + ' Details', ULDTypeForCart + "already processed through UWS process. Amendments restricted");
                }
                else if (result == "Stop") {
                    ShowMessage('warning', 'Warning - ' + ULDTypeForCart + ' Details', "Before save Build up process can not be save Uld Build details");
                }
                else
                    ShowMessage('warning', 'Warning - ' + ULDTypeForCart + ' Details', ULDTypeForCart + " No. [" + __uldno + "] -  unable to process. (" + result + ")", "bottom-right");
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - ' + ULDTypeForCart + ' Details', ULDTypeForCart + " No. [" + __uldno + "]  -  unable to process.", "bottom-right");

            }
        });
    }

}


function AddLockInULD(ULDNo) {
    $("#divUldShipmentSection").find("tr.k-master-row").each(function () {
        var _ULD = $(this).find("td:eq(3)").text();
        if (_ULD.trim() == ULDNo.trim()) {
            var vgrid = cfi.GetCFGrid("divUldShipmentSection");
            $("#div__" + vgrid.options.parentValue.toString()).find("input:checkbox").attr("disabled", "disabled");// Disabled all opened shipments
            var ulddataitem = vgrid.dataItem($(this));
            ulddataitem.Status = "Closed";
            $(this).find('a.label').find('i.fa.fa-edit').removeClass('fa fa-edit').addClass('fa fa-lock');
            return false;
        }
    });
}

function GetOtherPalletValue() {
    var _item = "";
    $('#divMulti_OtherPallets span.k-icon.k-delete').each(function (index, item) { // Allready Added in Db
        if (item.id != "")
            _item = item.id + "," + _item;
    });

    if (_item != "" && _item.length > 2) {
        var iscomma = _item.substring(_item.length - 1, _item.length);
        if (iscomma == ",") {
            var _item = _item.substring(0, _item.length - 1);
        }
    }

    var tempAdded = $('#_OtherPallets').val(); // Temp Added
    if (tempAdded != "") {
        var arr = tempAdded.split('=#=');
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] != "") {
                _item = arr[i] + "," + _item;
            }
        }
    }

    if (_item != "" && _item.length > 2) {
        var iscomma = _item.substring(_item.length - 1, _item.length);
        if (iscomma == ",") {
            var _item = _item.substring(0, _item.length - 1);
        }
    }

    return _item;
}

function GetULDSHC() {

    var _item = "";

    $("#divMultiBuildUPULDSHC li span").each(function (a, b) {
        if (!$(this).hasClass('k-delete')) {
            if (b.innerText != "") {
                _item = b.innerText + "," + _item;
            }
        }
    });

    if (_item != "" && _item.length > 2) {
        var iscomma = _item.substring(_item.length - 1, _item.length);
        if (iscomma == ",") {
            var _item = _item.substring(0, _item.length - 1);
        }
    }
    /*
    $('#divMultiBuildUPULDSHC span.k-icon.k-delete').each(function (index, item) { // Allready Added in Db
        if (item.id != "")
            _item = item.id + "," + _item;
    });

    if (_item != "" && _item.length > 2) {
        var iscomma = _item.substring(_item.length - 1, _item.length);
        if (iscomma == ",") {
            var _item = _item.substring(0, _item.length - 1);
        }
    }

    var tempAdded = $('#BuildUPULDSHC').val(); // Temp Added
    if (tempAdded != "") {
        var arr = tempAdded.split('=#=');
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] != "") {
                _item = arr[i] + "," + _item;
            }
        }
    }

    if (_item != "" && _item.length > 2) {
        var iscomma = _item.substring(_item.length - 1, _item.length);
        if (iscomma == ",") {
            var _item = _item.substring(0, _item.length - 1);
        }
    }*/

    return _item;
}

function detailExpand(e) {
    var expanededUldStockSno = e.data.ULDStockSNo;
    e.sender.options.parentValue = expanededUldStockSno;
    e.sender.options.storedparentValue = expanededUldStockSno;

    if (e.data.Shipments == 0) {
        CheckCollepsRow = 1;
    } else {
        CheckCollepsRow = 0;
    }
}

function detailCollapse(e) {
    var expanededUldStockSno = e.data.ULDStockSNo;
    e.sender.options.parentValue = expanededUldStockSno;
    e.sender.options.storedparentValue = expanededUldStockSno;
    if (e.data.Shipments == 0) {
        CheckCollepsRow = 1;
    } else {
        CheckCollepsRow = 0;
    }
}

function GetSavedULDCapacity() {
    var vgrid = cfi.GetCFGrid("divUldShipmentSection");
    var expanededUldStockSno = vgrid.options.parentValue;
    arrULDCapacity_Final = [];
    arrULDCapacity_Final = $.grep(arrULDCapacity, function (e, index) {
        return e.ULDStockSNo != expanededUldStockSno;
    });
    if (arrULDCapacity_Final.length > 0)
        arrULDCapacity = arrULDCapacity_Final;


}

function BindShipmentOffPoint(ULDNo, AWBSNo, Process, IsCartStatus) {
    /*------------Bind Shipment Off Point--------------------------*/
    var childID = "div__" + ULDNo;
    var _awbsno = "";
    _awbsno = AWBSNo;
    if (childID == "div__0" || IsCartStatus == "1" || IsCartStatus == "true") { // Bind Only For Bulk Shipment
        $("#" + childID).find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
            var controlId = $(this).attr("id");
            // //Commented Old Autocomplete 
            //cfi.AutoComplete(controlId.replace("Text_", ""), "DestinationAirportCode", "vBuildupOffPoint", "DestinationAirportCode", "DestinationAirportCode", null, SetCurrentOffPoint, "contains");

            if (controlId.indexOf("Text_AWBOffPoint") >= 0) {

                //if ($('#' + controlId).data("kendoAutoComplete") == undefined)
                cfi.AutoComplete(controlId.replace("Text_", ""), "DestinationAirportCode", "BuildUp_BindShipmentOffPoint", SetCurrentOffPoint, "contains");
            }
            if (controlId.indexOf("ConnectingFlight") >= 0) {
                //Commented Old Autocomplete cfi.AutoComplete(controlId.replace("Text_", ""), "FlightNo", "vConnectingFlight", "SNo", "FlightNo", null, SetCurrentConnectingFlight, "contains");
                cfi.AutoComplete(controlId.replace("Text_", ""), "FlightNo", "BuildUp_ConnectingFlight", SetCurrentConnectingFlight, "contains");
            }
        });

        $("#" + childID).find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
            var controlId = $(this).attr("id");
            var value = $("#" + controlId.replace("Text_", "")).val();
            var TextField = $("#" + controlId).val();
            if (Process == "AttachProcessedShipment") {
                $("#" + controlId).data("kendoAutoComplete").setDefaultValue(value, value);

                if (controlId.indexOf("ConnectingFlight") >= 0) {
                    var trHRow = $("#" + controlId).closest('tr').closest("div.k-grid").find("div.k-grid-header");
                    var ConnectingFlightSNoIndex = trHRow.find("th[data-field='ConnectingFlightSNo']").index();
                    var ConnectingFlightSNo = $("#" + controlId).closest('tr').find('td:eq(' + ConnectingFlightSNoIndex + ')').text();

                    $("#" + controlId).data("kendoAutoComplete").setDefaultValue(ConnectingFlightSNo, value);

                }


            }

            /*****************Check Saved AWB*********************/
            var _IsExists = false; AWBOffPoint = 'ABC';
            if (IsFlightPremanifested == "True" && CheckULDExists("0")) {
                if (processedawb != null && processedawb.length > 0) {
                    for (i = 0; i < processedawb.length; i++) {
                        if (processedawb[i].AWBSno == controlId.split('_')[2]) {

                            _IsExists = true;
                            AWBOffPoint = processedawb[i].AWBOffPoint
                            break;
                        }
                    }
                    if (_IsExists) {
                        $("#" + controlId).data("kendoAutoComplete").enable(true);
                    }
                    else {
                        if ($("#" + controlId).val() != "") {
                            $("#" + controlId).data("kendoAutoComplete").enable(false);
                        }
                        //$("#div__0").find("input[type='text'][name='Text_AWBOffPoint_" + controlId.split('_')[2] + "']").closest("tr").find("input:checkbox[id='chkAWB']").prop("disabled", true).css("cursor", "not-allowed");
                        $("#div__0").find("input[type='text'][name='Text_AWBOffPoint_" + controlId.split('_')[2] + "']").closest("tr").find("input:checkbox[id='chkAWB']").prop("disabled", false).css("cursor", "not-allowed");
                    }

                }
                else {
                    $("#" + controlId).data("kendoAutoComplete").enable(false);

                }
            }
            /*************************************************/

        });



    }


    else {
        $("#" + childID).find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {

            var controlId = $(this).attr("id");
            //$("#" + controlId).hide();
            if (controlId.indexOf("ConnectingFlight") >= 0) {
                // //Commented Old Autocomplete cfi.AutoComplete(controlId.replace("Text_", ""), "FlightNo", "vConnectingFlight", "SNo", "FlightNo", null, SetCurrentConnectingFlightForUld, "contains");
                cfi.AutoComplete(controlId.replace("Text_", ""), "FlightNo", "BuildUp_ConnectingFlight", SetCurrentConnectingFlightForUld, "contains");
                var value = $("#" + controlId.replace("Text_", "")).val();
                var TextField = $("#" + controlId).val();
                if (Process == "AttachProcessedShipment") {
                    var trHRow = $("#" + controlId).closest('tr').closest("div.k-grid").find("div.k-grid-header");
                    var ConnectingFlightSNoIndex = trHRow.find("th[data-field='ConnectingFlightSNo']").index();
                    var ConnectingFlightSNo = $("#" + controlId).closest('tr').find('td:eq(' + ConnectingFlightSNoIndex + ')').text();
                    $("#" + controlId).data("kendoAutoComplete").setDefaultValue(ConnectingFlightSNo, value);
                }


            }
            else {
                $('#' + childID + ' input[id="' + controlId + '"]').hide();
                //$("#" + controlId.replace("Text_", "")).closest('td').hide();
                $('#' + childID + ' input[id="' + controlId.replace("Text_", "") + '"]').closest('td').hide();
            }

        });
        $('#' + childID).find("th[data-field='AWBOffPoint']").hide();
    }

    $('[id^=Text_AWBOffPoint_0_]').keypress(function (event) {
        if (event.keyCode === 10 || event.keyCode === 13) {
            event.preventDefault();
        }
    });
}
$(document).on('keyup', '[id^=Text_AWBOffPoint_0_]', function (e) {
    if ($("#" + this.name).data("kendoAutoComplete") == undefined) {
        if (this.value.length < 3) {
            ShowMessage('warning', '', "Destination should be three character");
            this.value = $("#Destination").val().toUpperCase()
            return;
        }

        if (this.value.length >= 3) {
            var str1 = flightroute.map(function (a) { return a.Key }).join(',');
            var str2 = this.value.toUpperCase();
            if (str1.indexOf(str2) != -1) {
            } else {
                ShowMessage('warning', '', "Please enter correct destination");
                this.value = $("#Destination").val().toUpperCase()
                return;
            }
        }
    }

});

function SetCurrentConnectingFlightForUld(txtId, txt, keyId, key) {
    var uldStockSNo = keyId.split('_')[1].toString();
    if (cfi.GetNestedCFGrid("div__" + uldStockSNo).dataSource.data().length > 0) {
        var awbID = txtId.split('_')[3];
        var BulkData = cfi.GetNestedCFGrid("div__" + uldStockSNo).dataSource.data();

        $(BulkData).each(function (index, item) {
            if (item.AWBSno == awbID) {
                item.ConnectingFlight = key;
                return false;
            }
        });

        var alreadyprsship = $.grep(processedawb, function (e, index) {
            if (e.AWBSno == awbID) {
                e.ConnectingFlight = key;
                return e;
            }
        });
    }
}

function SetCurrentConnectingFlight(txtId, txt, keyId, key) {
    if (cfi.GetNestedCFGrid("div__" + ULD_SNo).dataSource.data().length > 0) {
        var awbID = txtId.split('_')[3];
        var BulkData = cfi.GetNestedCFGrid("div__" + ULD_SNo).dataSource.data();

        $(BulkData).each(function (index, item) {
            if (item.AWBSno == awbID) {
                item.ConnectingFlight = key;
                return false;
            }
        });
        var alreadyprsship = $.grep(processedawb, function (e, index) {
            if (e.AWBSno == awbID) {
                e.ConnectingFlight = key;
                return e;
            }
        });
    }
}


function SetCurrentOffPoint(txtId, txt, keyId, key) {
    if (cfi.GetNestedCFGrid("div__" + ULD_SNo).dataSource.data().length > 0) {
        var awbID = txtId.replace("Text_AWBOffPoint_0_", "");

        var BulkData = cfi.GetNestedCFGrid("div__" + ULD_SNo).dataSource.data();


        $(BulkData).each(function (index, item) {
            if (item.AWBSno == awbID) {
                item.AWBOffPoint = txt;
                return false;
            }
        });

        var alreadyprsship = $.grep(processedawb, function (e, index) {
            if (e.AWBSno == awbID && e.ULDStockSNo == "0") {
                e.AWBOffPoint = txt;
                return e;
            }
        });
    }

}
//var expanededUldStockSnoForMovetoULD = "";

//function AttachProcessedShipment() {
//    var vgrid = cfi.GetCFGrid("divUldShipmentSection");
//    var expanededUldStockSno = vgrid.options.parentValue;
//    // expanededUldStockSnoForMovetoULD = vgrid.options.parentValue; use cfi.GetCFGrid("divUldShipmentSection").options.parentValue.toString() instead of that every where

//    if (vgrid != undefined) {
//        var detailgrid = cfi.GetNestedCFGrid("div__" + expanededUldStockSno.toString());

//        /*************For BUP Shipment************************/
//        $.each(vgrid._data, function (i, item_Data) {
//            if (item_Data.IsBUP == "1" || item_Data.Status == "Closed" || item_Data.ULDStatus == "PRE") {
//                var dvID = "div__" + item_Data.id.toString();
//                //$("#" + dvID +" tr").css('background', '#BEF781');
//                $("#" + dvID + " input:checkbox").attr('disabled', true)
//            }
//        });
//        /****************************************************/

//        var detaildatasource = detailgrid.dataSource;
//        var existingshipdata = $.grep(processedawb, function (e, index) {
//            if (e.ULDStockSNo == expanededUldStockSno) {
//                return e;
//            }
//        });

//        $.each(existingshipdata, function (i, item) {
//            if (item) {
//                var ToUldShipmentModel = {
//                    AWBSno: item.AWBSno,
//                    AwbNo: item.AwbNo,
//                    Pieces: item.Pieces,
//                    GrossWeight: item.GrossWeight,
//                    VolumeWeight: item.VolumeWeight,
//                    SPHC: item.SPHC,
//                    ULDStockSNo: item.ULDStockSNo,
//                    FromTable: item.FromTable,
//                    FromTableSNo: item.FromTableSNo,
//                    ShipmentDetail: item.ShipmentDetail,
//                    FromTableTotalPieces: item.FromTableTotalPieces,
//                    AWBPieces: item.AWBPieces,
//                    AWBGrossWeight: item.AWBGrossWeight,
//                    AWBVolumeWeight: item.AWBVolumeWeight,
//                    AWBOffPoint: item.AWBOffPoint,
//                    OffloadStage: item.OffloadStage,
//                    ConnectingFlight: item.ConnectingFlight,
//                    ShipmentType: item.ShipmentType,
//                    Status: item.Status,
//                    CBM: item.CBM,
//                    IsPlanned: item.isPlanned,
//                    ShipmentId: item.isPlanned == '0' ? "UnPlanned_0_0" : item.ShipmentId

//                }
//                var existinginulddata = $.grep(detaildatasource.data(), function (e, index) {
//                    if (e.ULDStockSNo == item.ULDStockSNo && e.AWBSno == item.AWBSno) {
//                        return e;
//                    }
//                });
//                if (existinginulddata.length == 0) {
//                    detaildatasource.insert(ToUldShipmentModel);
//                }
//                else {
//                    detaildatasource.pushUpdate(ToUldShipmentModel);
//                }
//            }
//        });

//        $.each(processedawb, function (i, item) {
//            if (item) {
//                var offUldShipmentModel = {
//                    AWBSno: item.AWBSno,
//                    AwbNo: item.AwbNo,
//                    Pieces: item.Pieces,
//                    GrossWeight: item.GrossWeight,
//                    VolumeWeight: item.VolumeWeight,
//                    SPHC: item.SPHC,
//                    ULDStockSNo: item.ULDStockSNo,
//                    FromTable: item.FromTable,
//                    FromTableSNo: item.FromTableSNo,
//                    FromTableTotalPieces: item.LIPieces,
//                    ShipmentDetail: item.ShipmentDetail,
//                    AWBPieces: item.AWBPieces,
//                    AWBGrossWeight: item.AWBGrossWeight,
//                    AWBVolumeWeight: item.AWBVolumeWeight,
//                    AWBOffPoint: item.AWBOffPoint,
//                    OffloadStage: item.OffloadStage,
//                    ConnectingFlight: item.ConnectingFlight,
//                    ShipmentType: item.ShipmentType,
//                    Status: item.Status,
//                    CBM: item.CBM
//                }
//                var existinginulddata = $.grep(detaildatasource.data(), function (e, index) {
//                    if (e.ULDStockSNo == -1 && e.AWBSno == item.AWBSno && e.FromTable == 3 && e.FromTableSNo == item.FromTableSNo) {
//                        return e;
//                    }
//                });
//                var detaildata = detaildatasource.data();
//                if (existinginulddata.length == 0) {
//                    for (var i = detaildata.length - 1; i >= 0; i--) {
//                        if (item.ULDStockSNo == -1 && detaildata[i].AWBSno == item.AWBSno && detaildata[i].FromTable == 3 && detaildata[i].FromTableSNo == item.FromTableSNo) {
//                            if (detaildata[i].Pieces == item.Pieces) {
//                                detaildata.splice(i, 1);
//                            }
//                        }
//                    }
//                }
//            }
//        });

//        BindShipmentOffPoint(expanededUldStockSno, 0, "AttachProcessedShipment");
//        bindCheckAWB();
//    }
//}

function AttachProcessedShipment() {
    var vgrid = cfi.GetCFGrid("divUldShipmentSection");
    var expanededUldStockSno = vgrid.options.parentValue;
    ULD_SNo = expanededUldStockSno;
    var IsCart = 0;
    // expanededUldStockSnoForMovetoULD = vgrid.options.parentValue; use cfi.GetCFGrid("divUldShipmentSection").options.parentValue.toString() instead of that every where
    $.each(vgrid._data, function (i, item_Data) {
        if (item_Data.ULDNo != "BULK" && vgrid.options.parentValue.toString() == item_Data.ULDStockSNo) {
            IsCart = item_Data.IsCart == "true" || item_Data.IsCart == 1 ? 1 : 0;
            return false;
        }
    });
    if (vgrid != undefined) {
        var detailgrid = cfi.GetNestedCFGrid("div__" + expanededUldStockSno.toString());

        /*************For BUP Shipment************************/
        $.each(vgrid._data, function (i, item_Data) {
            if (item_Data.IsBUP == "1" || item_Data.IsBUP == "True" || item_Data.Status == "Closed" || item_Data.ULDStatus == "PRE") {
                var dvID = "div__" + item_Data.id.toString();
                //$("#" + dvID +" tr").css('background', '#BEF781');
                $("#" + dvID + " input:checkbox").attr('disabled', true)
            }
        });
        /****************************************************/

        $.each(detailgrid.dataSource._data, function (i, item_data) {
            if (item_data.Status == "PRE") {
                var dvID = "div__" + item_data.ULDStockSNo.toString();
                var aid = $("#" + dvID + " input:checkbox")[i];
                $(aid).attr('disabled', true);

            }
        }
        );

        var detaildatasource = detailgrid.dataSource;
        var existingshipdata = $.grep(processedawb, function (e, index) {
            if (e.ULDStockSNo == expanededUldStockSno) {
                return e;
            }
        });

        $.each(existingshipdata, function (i, item) {
            if (item) {
                var ToUldShipmentModel = {
                    AWBSno: item.AWBSno,
                    AwbNo: item.AwbNo,
                    Pieces: item.Pieces,
                    GrossWeight: item.GrossWeight,
                    VolumeWeight: item.VolumeWeight,
                    SPHC: item.SPHC,
                    ULDStockSNo: item.ULDStockSNo,
                    FromTable: item.FromTable,
                    FromTableSNo: item.FromTableSNo,
                    ShipmentDetail: item.ShipmentDetail,
                    FromTableTotalPieces: item.FromTableTotalPieces,
                    AWBPieces: item.AWBPieces,
                    AWBGrossWeight: item.AWBGrossWeight,
                    AWBVolumeWeight: item.AWBVolumeWeight,
                    AWBOffPoint: item.AWBOffPoint,
                    OffloadStage: item.OffloadStage,
                    ConnectingFlight: item.ConnectingFlight,
                    ShipmentType: item.ShipmentType,
                    Status: item.Status,
                    CBM: item.CBM,
                    IsPlanned: item.isPlanned,
                    ShipmentId: item.isPlanned == '0' ? "UnPlanned_0_0" : item.ShipmentId,
                    Action: "",
                    Priority: item.Priority,
                    HDQ: ""

                }
                var existinginulddata = $.grep(detaildatasource.data(), function (e, index) {
                    if (e.ULDStockSNo == item.ULDStockSNo && e.AWBSno == item.AWBSno) {
                        return e;
                    }
                });
                if (existinginulddata.length == 0) {
                    detaildatasource.insert(ToUldShipmentModel);
                }
                else {
                    detaildatasource.pushUpdate(ToUldShipmentModel);
                }
            }
        });

        $.each(processedawb, function (i, item) {
            if (item) {
                var offUldShipmentModel = {
                    AWBSno: item.AWBSno,
                    AwbNo: item.AwbNo,
                    Pieces: item.Pieces,
                    GrossWeight: item.GrossWeight,
                    VolumeWeight: item.VolumeWeight,
                    SPHC: item.SPHC,
                    ULDStockSNo: item.ULDStockSNo,
                    FromTable: item.FromTable,
                    FromTableSNo: item.FromTableSNo,
                    FromTableTotalPieces: item.LIPieces,
                    ShipmentDetail: item.ShipmentDetail,
                    AWBPieces: item.AWBPieces,
                    AWBGrossWeight: item.AWBGrossWeight,
                    AWBVolumeWeight: item.AWBVolumeWeight,
                    AWBOffPoint: item.AWBOffPoint,
                    OffloadStage: item.OffloadStage,
                    ConnectingFlight: item.ConnectingFlight,
                    ShipmentType: item.ShipmentType,
                    Status: item.Status,
                    CBM: item.CBM,
                    Action: "",
                }
                var existinginulddata = $.grep(detaildatasource.data(), function (e, index) {
                    if (e.ULDStockSNo == -1 && e.AWBSno == item.AWBSno && e.FromTable == 3 && e.FromTableSNo == item.FromTableSNo) {
                        return e;
                    }
                });
                var detaildata = detaildatasource.data();
                if (existinginulddata.length == 0) {
                    for (var i = detaildata.length - 1; i >= 0; i--) {
                        if (item.ULDStockSNo == -1 && detaildata[i].AWBSno == item.AWBSno && detaildata[i].FromTable == 3 && detaildata[i].FromTableSNo == item.FromTableSNo) {
                            //if ( detaildata[i].AWBSno == item.AWBSno && detaildata[i].FromTable == 3 && detaildata[i].FromTableSNo == item.FromTableSNo) {
                            if (detaildata[i].Pieces == item.Pieces) {
                                detaildata.splice(i, 1);
                            }

                        }
                    }
                    for (var i = detaildata.length - 1; i >= 0; i--) {
                        if (CheckCollepsRow == 1 && detaildata[i].ULDStockSNo != item.ULDStockSNo && detaildata[i].AWBSno == item.AWBSno && detaildata[i].FromTable == 3 && detaildata[i].FromTableSNo == item.FromTableSNo) {
                            detaildata.splice(i, 1);
                        }
                    }

                }

            }

        });

        BindShipmentOffPoint(expanededUldStockSno, 0, "AttachProcessedShipment", IsCart);
        bindCheckAWB();
    }
}

function AttachLyingListShipment() {
    var vgrid = cfi.GetCFGrid("divLyingListSection");
    if (vgrid != undefined) {
        var detaildatasource = vgrid.dataSource;

        $.each(processedawb, function (i, item) {
            if (item && (item.FromTable == 0 || item.FromTable == 2) && item.ULDStockSNo > -1) {
                var offloadfromuld = {
                    AWBSNo: item.AWBSno,
                    AWBNo: item.AwbNo,
                    FlightNo: $("span[id='FlightNo']").text(),
                    FlightDate: $("span[id='FlightDate").text(),
                    OriginCity: $("span[id='Origin']").text(),
                    Pieces: item.Pieces + "/" + item.FromTableTotalPieces,
                    FromTableTotalPieces: item.FromTableTotalPieces,
                    LIPieces: item.FromTableTotalPieces,
                    LoadPieces: item.Pieces,
                    GrossWeight: item.GrossWeight,
                    VolumeWeight: item.VolumeWeight,
                    LoadGrossWeight: item.GrossWeight,
                    LoadVol: item.VolumeWeight,
                    SPHC: item.SPHC,
                    Plan: "",
                    FromTable: item.FromTable,
                    FromTableSNo: item.FromTableSNo,
                    WeightDetail: item.AWBGrossWeight + "/" + item.AWBVolumeWeight + "/" + item.CBM,
                    ShipmentDetail: item.ShipmentDetail,
                    LoadDetail: "",
                    AWBPieces: item.AWBPieces,
                    AWBGrossWeight: item.AWBGrossWeight,
                    AWBVolumeWeight: item.AWBVolumeWeight,
                    MCBookingSNo: item.MCBookingSNo,
                    ShipmentType: item.ShipmentType,
                    Status: item.Status,
                    CBM: item.CBM,
                    //Added by karan on 8 april for lying list move to uld shipment issue after search lying list.
                    Priority: item.Priority

                };
                var existinginulddata = $.grep(detaildatasource.data(), function (e, index) {
                    if (item.ULDStockSNo > -1 && e.AWBSNo == item.AWBSno && e.AWBNo == item.AwbNo && e.FromTable == offloadfromuld.FromTable && e.FromTableSNo == item.FromTableSNo) {
                        offloadfromuld.GrossWeight = parseFloat(parseFloat(e.GrossWeight) - parseFloat(offloadfromuld.GrossWeight)).toFixed(1);
                        offloadfromuld.VolumeWeight = parseFloat(parseFloat(e.VolumeWeight) - parseFloat(offloadfromuld.VolumeWeight)).toFixed(2);
                        offloadfromuld.LIPieces = parseInt(offloadfromuld.FromTableTotalPieces);
                        offloadfromuld.Pieces = (parseInt(e.Pieces.split('/')[0]) - parseInt(offloadfromuld.Pieces)).toString() + "/" + parseInt(offloadfromuld.FromTableTotalPieces);
                        offloadfromuld.LoadPieces = parseInt(offloadfromuld.Pieces.split('/')[0]);
                        offloadfromuld.LoadGrossWeight = offloadfromuld.GrossWeight;
                        offloadfromuld.LoadVol = offloadfromuld.VolumeWeight;
                        offloadfromuld.WeightDetail = offloadfromuld.AWBGrossWeight + "/" + offloadfromuld.AWBVolumeWeight;
                        offloadfromuld.Plan = e.Plan;
                        offloadfromuld.FlightNo = e.FlightNo;
                        offloadfromuld.FlightDate = e.FlightDate;
                        offloadfromuld.OriginCity = e.OriginCity;
                        offloadfromuld.ShipmentDetail = e.ShipmentDetail;
                        offloadfromuld.CBM = e.CBM;
                        offloadfromuld.Priority = e.Priority;
                        return e;
                    }
                });

                //Added by karan on 8 april for lying list move to uld shipment issue after search lying list.
                if (existinginulddata.length > 0) {
                    detaildatasource.remove(existinginulddata[0]);
                    if (offloadfromuld.LoadPieces > 0)
                        detaildatasource.insert(offloadfromuld);
                }
                //else if (existinginulddata.length == 0) {
                //    lyinggriddatasource.insert(offloadfromuld);

                //}

                //if (existinginulddata.length == 0) {
                //    lyinggriddatasource.insert(offloadfromuld);
                //}
                //else {
                //    //cdatasource.remove(matchingdataitem[0]);
                //    detaildatasource.remove(existinginulddata[0]);
                //   // detaildatasource.insert(offloadfromuld);
                //}
            }
        });

        SetNumericOnly("txtLPcs");

    }
}

function AttachUnBilledShipment() {
    SetNumericOnly("txtPcs");
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

    $("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
        var controlId = $(this).attr("id");
        cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), _DefaultAutoComplete_);
    });
    //cfi.AutoComplete("searchOriginCity", "CityCode", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
    //cfi.AutoComplete("searchDestinationCity", "CityCode", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
}

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

    $("#" + containerId).find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
        if ($(this).attr("recname") == undefined) {
            var controlId = $(this).attr("id");
            cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), _DefaultAutoComplete_);
        }
    });
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
    $("div[id^='divareaTrans_'][cfi-aria-trans='trans']").each(function () {
        var transid = this.id.replace("divareaTrans_", "");
        cfi.makeTrans(transid, null, null, null, null, null, null);
    });
    //    $("td.formtwoInputcolumn").html("TEST<STRONG>ASDFA<EM>SASDFASDF</EM></STRONG>");
    //    ChangeAllControlToLable("aspnetForm");
    PageRightsCheckBuildUP()
}
function getAirlineULDStock() {
    var ULDSNo = $("#ULDType").val();
    var IsSummaryDetail = $("input:radio[name=IsSummaryDetails]:checked").val();
    //alert(IsSummaryDetail);

    var uldType = $("#Text_ULDType").data("kendoAutoComplete").value();
    var uldCity = _CityCode_;

    $.ajax({
        url: "Services/BuildUp/BuildUpProcessService.svc/getAirlineULDDetails?ULDType=" + uldType + "&ULDCity=" + _CityCode_, async: false, type: "get", dataType: "json", cache: false,
        //FlightNo + "/" + FlightDate + "/" + _CITY_
        // data: JSON.stringify({ FlightNo: FlightNo, FlightDate: FlightDate, LoggedInCity: _CITY_ }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var uldData = jQuery.parseJSON(result);
            var uldSummary = uldData.Table0;
            var uldDetail = uldData.Table1;
            if (IsSummaryDetail == '0') {
                if (uldSummary.length <= 0) {
                    ShowMessage('warning', 'Warning - ULD Stock Availability', "ULD Stock Not Available.", "bottom-right");
                    return false;
                }
            }

            else {
                if (uldDetail.length <= 0) {
                    ShowMessage('warning', 'Warning - ULD Stock Availability', "ULD Stock Not Available.", "bottom-right");
                    return false;
                }
            }

            var uldString = '<table class="WebFormTable">';
            // summary
            if (IsSummaryDetail == '0' && uldSummary.length > 0) {

                uldString += '<tr class="grdTableHeader"><td style="font-weight:bold;">ULD Type</td><td>Available Unit</td></tr>';
                for (var i = 0; i < uldSummary.length; i++) {
                    uldString += '<tr><td>' + uldSummary[i].ULDType + '</td><td>' + uldSummary[i].AvlUnits + '</td></tr>';
                }
            }
            else if (IsSummaryDetail == '1' && uldDetail.length > 0) {
                var oldULDNo = '', newULDNo = '';
                for (var i = 0; i < uldSummary.length; i++) {
                    //if (uldSummary[i].ULDType != (uldType == '' ? 'BULK' : '')) {
                    uldString += '<tr class="grdTableHeader"><td>' + uldSummary[i].ULDType + '</td><td>Available Unit</td><td>' + uldSummary[i].AvlUnits + '</td></tr>';
                    uldString += '<tr class="grdTableHeader"><td>ULD No.</td><td>Location</td><td></td></tr>';
                    //}
                    for (var j = 0; j < uldDetail.length; j++) {
                        //&& uldSummary[i].ULDType != (uldType == '' ? 'BULK' : '')
                        if (uldSummary[i].ULDType == uldDetail[j].ULDType)
                            uldString += '<tr><td>' + uldDetail[j].ULDNo + '</td><td>' + uldDetail[j].Location + '</td><td ><input type="checkbox" style="display:none" id="_cbox_' + uldSummary[i].ULDType + '_' + j + '" name="_cbox_' + uldSummary[i].ULDType + '_' + j + '"/> </td></tr>';
                    }
                }
            }
            uldString += '</table>';
            $('#divAirlineULDStockDetails').html(uldString);

            //var ULDModel = {
            //    ULDStockSNo: (uldno.toUpperCase() == "BULK" ? 0 : uldstocksno),
            //    Pieces: 0,
            //    MaxVolumeWeight: (uldno.toUpperCase() == "BULK" ? 0 : uldDetail[0].VolumeWeight),
            //    MaxGrossWeight: (uldno.toUpperCase() == "BULK" ? 0 : uldDetail[0].GrossWeight),
            //    EmptyWeight: (uldno.toUpperCase() == "BULK" ? 0 : uldDetail[0].EmptyWeight),
            //    ULDWeight: (uldno.toUpperCase() == "BULK" ? "" : uldDetail[0].EmptyWeight + " / " + uldDetail[0].GrossWeight + " / " + uldDetail[0].VolumeWeight),
            //    ULDNo: (uldno.toUpperCase() == "BULK" ? "BULK" : uldno),
            //    GrossWeight: 0,
            //    VolumeWeight: 0,
            //    Used: "",
            //    FlightNo: $("span[id='FlightNo']").text(),
            //    FlightDate: cfi.CfiDate("FlightDate"),
            //    OriginCity: _CITY_,
            //    SNo: uldDetail[0].SNo,
            //    Status: uldDetail[0].Status,
            //    Shipments: 0,
            //    LastPoint: ""
            //}

            //datasource.insert(ULDModel);
            //AttachEventForULD();
            //ShowMessage('success', 'Success - ADD ULD', "Selected ULD " + (uldno.toUpperCase() == "BULK" ? "BULK" : uldno) + " assigned successfully.", "bottom-right");

        },
        error: function (xhr) {
            //ShowMessage('warning', 'Warning - ADD ULD', "Unable to process.", "bottom-right");
            return;

        }
    });

}

var POMailDetailsDiv = '<div id="divPOMailDetails" style=""> <table class="WebFormTable"><tbody><tr><td>CN No. : <b><label id="lblCN38No"></label></b></td><td>Plan Piece : <b><label id="lblPlanPcs"></label></b></td></tr><tr><td colspan="3"></td></tr></tbody></table><table class="WebFormTable"><thead><tr><td class="ui-widget-header"><input type="checkbox" id="chkAll" checked="1"> Select / Unselect</td><td class="ui-widget-header">DN Number</td><td class="ui-widget-header">Origin City</td><td class="ui-widget-header">Destination City</td><td class="ui-widget-header">Mail Category</td><td class="ui-widget-header">Sub Category</td><td class="ui-widget-header">Receptacle Number</td><td class="ui-widget-header">Receptacle Weight</td></tr></thead><tbody id ="bodyPOMailDetails"></tbody></table></div>';


var fotter = "<div><table style='margin-left:20px;'>" +
    "<tbody><tr><td> &nbsp; &nbsp;</td>" +
    //"<td><button class='btn btn-primary btn-sm' style='width:125px;' id='btnNew'>New Booking</button></td>" +
    //"<td> &nbsp; &nbsp;</td>" +
    "<td><button class='btn btn-block btn-success btn-sm'  id='btnSave'>Save</button></td>" +
    "<td> &nbsp; &nbsp;</td>" +
    //"<td><button class='btn btn-block btn-success btn-sm'  id='btnSaveToNext'>Save &amp; Next</button></td>" +
    //"<td> &nbsp; &nbsp;</td>" +
    "<td><button class='btn btn-block btn-danger btn-sm' id='btnCancel' onclick='ResetSearchByFlight();'>Cancel</button></td>" +
    "<td> &nbsp; &nbsp;</td>" +
    "<td  id='tdbuildupprint' style='display:none;'><button class='btn btn-block btn-info btn-sm' id='Print' onclick=BuildUpPrint()>Build Up Print</button></td>" +
    "</tr></tbody></table> </div>";

var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div class='rows'><div id='divShipmentDetails' style='width:100%'></div><div id='divNewDetail'></div><div id='divNewBooking' style='width:100%;top:0px;margin-top:0px;'></div></div></td></tr></table> </td></tr></table></div><div id='divDetailPop'></div>";
//var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divShipmentDetails' style='width:100%'></div></td></tr><tr><td valign='top'><div id='divNewBooking' style='width:100%'></div></td></tr><tr> <td valign='top'> <table style='width:100%'> <tr> <td style='width:15%;' valign='top' class='tdInnerPadding'> <table class='WebFormTable' style='width: 100%; margin: 0px; padding: 0px; display:none; ' id='tblShipmentInfo'> <tr><td class='formSection' colspan='3' >AWB Information</td></tr><tr> <td>AWB No<input type='hidden' id='hdnAWBSNo'/></td><td>:</td><td id='tdAWBNo'></td></tr><tr> <td>AWB Date</td><td>:</td><td id='tdAWBDate'></td></tr><tr> <td>OD</td><td>:</td><td id='tdOD'></td></tr><tr> <td>Flight No</td><td>:</td><td id='tdFlightNo'></td></tr><tr> <td>Flight Date</td><td>:</td><td id='tdFlightDate'></td></tr><tr> <td>Pieces</td><td>:</td><td id='tdPcs'></td></tr><tr> <td>Ch. Wt.</td><td>:</td><td id='tdChWt'></td></tr><tr> <td>Commodity</td><td>:</td><td id='tdCommodity'></td></tr><tr> <td>FBL Wt.</td><td>:</td><td id='tdFBLwt'></td></tr><tr> <td>FWB Wt.</td><td>:</td><td id='tdFWBwt'></td></tr><tr> <td>FOH Wt.</td><td>:</td><td id='tdRCSwt'></td></tr><tr> <td id='IdAWBPrint' colspan='3'><a href='#' onclick='showAWBPrint()'>Print AWB</a></td></tr><tr> <td id='IdAWBlbl' colspan='3'><a href='#' onclick='showAWBlbl()'>Print AWB Label</a></td></tr><tr> <td id='IdAcptNote' colspan='3'><a href='#'>Print Acceptance Note</a></td></tr><tr> <td id='IdEDINote' colspan='3'><a href='#' onclick='ShowEDI()'>EDI Messages</a></td></tr><tr> <td id='IdPayrecpt' colspan='3'><a href='#' onclick='showPayRcpt()'>Print Payment Receipt </a></td></tr></table> </td><td style='width:70%;' valign='top' class='tdInnerPadding'> <div id='tabstrip'> <ul id='ulTab' style='display:none;'> <li class='k-state-active'> Genral </li><li> SPHC Wise </li><li>Tab 3</li><li>Tab 4</li><li>Tab 5</li></ul> <div> <div id='divDetail'></div></div><div> <div id='divDetailSHC'> </div></div><div><div id='divTab3'></div></div><div><div id='divTab4'></div></div><div><div id='divTab5'></div></div></div></div></td></tr></table> </td></tr></table></div>";
var divAirlineULDStock = "<div id='divAirlineULDStock'></div>";
var divShowLI = "<div id='divShowLI'></div><div id='divOffloadedULDButton'><button class='btn btn-block btn-success btn-sm'  id='btnSaveOffload' style='display:none' onclick='SaveOffloadedUld();'>Save</button></br><div id='divOffloadedULD'></div></div><div id='divMovetoLyingPopUP'></div>";

function CheckMixedLoad(nonuldgriddata, arrShipment, dataFrom) {
    var IsMixedLoad = false;
    var ShipmentOD = "";
    var selectedAWB = "";
    $(arrShipment).each(function () {

        trIndex = $(this).closest("tr").index();

        if (nonuldgriddata != null) {

            //ShipmentDetail.length > 7 From Lying List
            selectedAWB = nonuldgriddata[trIndex].ShipmentDetail.length > 7 ? nonuldgriddata[trIndex].ShipmentDetail.substring(0, 7) : nonuldgriddata[trIndex].ShipmentDetail;

            selectedAWB = selectedAWB.split('-')[1]; // Get Destination City

            if (ShipmentOD == "") {
                ShipmentOD = selectedAWB;
            }

            if (selectedAWB != ShipmentOD) {
                IsMixedLoad = true;
                return false;
            }

        }
    });
    return IsMixedLoad;
}

function CheckSHCCompatibility(childGriddata, ULDStockSNo, nonuldgriddata, arrShipment, TotalShipment) {
    var CurrentSHC = "";
    var count = 0;
    var message = "";
    var SelectedSPHC = "";

    if (arrSPHCList != null && arrSPHCList.length > 0 && TotalShipment > 1) // When selected multiple shipments.
    {
        $(arrSPHCList).each(function (index, item) {
            if (item.ULDStockSNo == ULDStockSNo) {
                count = 0;
                //$(arrShipment).each(function () {
                //    trIndex = $(this).closest("tr").index();
                //    if (nonuldgriddata != null) {
                //        CurrentSHC = nonuldgriddata[trIndex].SPHC;
                //        if (item.SPHC1 == CurrentSHC || item.SPHC2 == CurrentSHC || CurrentSHC.indexOf(item.SPHC1) > -1 || CurrentSHC.indexOf(item.SPHC2) > -1) {
                //            count = 0;
                //            // if (SelectedSPHC.indexOf(CurrentSHC) == -1)
                //            SelectedSPHC = CurrentSHC + " & " + SelectedSPHC;
                //        } else {
                //            count = count + 1;
                //            // if (SelectedSPHC.indexOf(CurrentSHC) == -1)
                //            SelectedSPHC = CurrentSHC + " & " + SelectedSPHC;
                //        }
                //        if (count == 2) {
                //            SelectedSPHC = SelectedSPHC.replace(/&(\s+)?$/, '');
                //            message = SelectedSPHC + " cannot be loaded together in '" + item.UldTypeName + "' ";
                //            return false;
                //        }
                //    }
                //});
                $(arrShipment).each(function () {
                    trIndex = $(this).closest("tr").index();
                    if (nonuldgriddata != null) {
                        CurrentSHC = nonuldgriddata[trIndex].SPHC;
                        if ((item.SPHC1 == CurrentSHC || CurrentSHC.indexOf(item.SPHC1) > -1)) {
                            count = 1;
                            //SelectedSPHC = CurrentSHC + " & " + SelectedSPHC;
                        } else if (item.SPHC2 == CurrentSHC || CurrentSHC.indexOf(item.SPHC2) > -1) {
                            count = count + 1;
                            SelectedSPHC = CurrentSHC + " & " + SelectedSPHC;
                        }
                        if (count == 2) {
                            SelectedSPHC = SelectedSPHC.replace(/&(\s+)?$/, '');
                            message = SelectedSPHC + " cannot be loaded together in '" + item.UldTypeName + "' ";
                            return false;
                        }
                    }
                });
            }
            if (count == 2) {
                return false;
            }
        });
    }
    if (message == "" && TotalShipment == 1) // when selected 1 shipment.
    {
        $(arrShipment).each(function () {
            trIndex = $(this).closest("tr").index();
            if (nonuldgriddata != null) {
                CurrentSHC = nonuldgriddata[trIndex].SPHC;
            }

            $(arrSPHCList).each(function (index, item) {
                if (item.ULDStockSNo == ULDStockSNo) {
                    if (CurrentSHC.indexOf(item.SPHC1 + "," + item.SPHC2) > -1 || CurrentSHC.indexOf(item.SPHC2 + "," + item.SPHC1) > -1) {
                        SelectedSPHC = CurrentSHC + " & " + SelectedSPHC;
                        SelectedSPHC = SelectedSPHC.replace(/&(\s+)?$/, '');
                        message = SelectedSPHC + " cannot be loaded together in '" + item.UldTypeName + "' ";
                        return false;
                    }
                }
            });
        });
    }

    if (message == "" && childGriddata != null && childGriddata.length > 0) // when selected 1 shipment and child grid exists.
    {
        var BothSPHC = [];

        $(arrShipment).each(function () {
            trIndex = $(this).closest("tr").index();
            if (nonuldgriddata != null) {
                CurrentSHC = nonuldgriddata[trIndex].SPHC;
                if (CurrentSHC != "") {
                    BothSPHC.push(CurrentSHC);
                }
            }
        });

        $(childGriddata).each(function (index, item) {
            if (item.SPHC != "") {
                if (BothSPHC.indexOf(item.SPHC) == -1)
                    BothSPHC.push(item.SPHC);
            }
        });

        if (BothSPHC != null && BothSPHC.length > 0) {
            $(arrSPHCList).each(function (index, item) {
                if (item.ULDStockSNo == ULDStockSNo) {
                    count = 0;
                    $(BothSPHC).each(function (index, arrItem) {
                        //if (nonuldgriddata != null) {
                        CurrentSHC = arrItem;
                        if (item.SPHC1 == CurrentSHC || item.SPHC2 == CurrentSHC || CurrentSHC.indexOf(item.SPHC1) > -1 || CurrentSHC.indexOf(item.SPHC2) > -1) {
                            count = count + 1;
                            SelectedSPHC = CurrentSHC + " & " + SelectedSPHC;
                        }
                        if (count == 2) {
                            SelectedSPHC = SelectedSPHC.replace(/&(\s+)?$/, '');
                            message = SelectedSPHC + " cannot be loaded together in '" + item.UldTypeName + "' ";
                            return false;
                        }
                        //}
                    });
                }
                if (count == 2) {
                    return false;
                }
            });
        }
    }

    return message;
}

function PrintULDTag() {
    var HTMLResult = "";
    var IsDGR = CheckDGR(__uldstocksno);
    var _DailyFlightSNo = $("#Text_searchFlightNo").data("kendoAutoComplete").key();
    var EquipmentTareWeight = 0;

    $.ajax({

        url: "HtmlFiles/ULD Print/uld.html", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            HTMLResult = result;
            //var w = window.open();
            //w.document.writeln(HTMLResult);
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
        url: "Services/Buildup/BuildUpProcessService.svc/GetULDPrint?DailyFlightSNo=" + _DailyFlightSNo + "&ULDStockSNo=" + __uldstocksno + "&UserSNo=" + userContext.UserSNo,
        contentType: "application/json; charset=utf-8",
        async: false,
        type: 'get',
        cache: false,
        success: function (result) {
            /********************************************************/
            var TareWeight, NetWeight, TotalWeight;
            var vgrid_uld = cfi.GetCFGrid("divUldShipmentSection");
            if (vgrid_uld != undefined) {
                var datasource_uld = vgrid_uld.dataSource;
                var data_uld = datasource_uld.data();
                if (data_uld.length > 0) {
                    $.each(data_uld, function (i, item) {
                        if (item.ULDStockSNo.toString() == __uldstocksno) {
                            TareWeight = item.ULDWeight.split('/')[0];
                            TareWeight = TareWeight == "" ? "0" : TareWeight;

                            if ($('#AddScaleWeight').val() != "" && parseFloat($('#AddScaleWeight').val()) > 0) {
                                NetWeight = parseFloat($('#AddScaleWeight').val());
                            }
                            else {
                                NetWeight = item.Used.split('/')[0];
                                NetWeight = NetWeight == "" ? "0" : NetWeight;
                            }

                            TotalWeight = (parseFloat(TareWeight) + parseFloat(NetWeight)).toFixed(2);
                            return false;
                        }
                    });
                }
            }

            if ($('#EquipmentID').val() != "") {
                EquipmentTareWeight = parseFloat($('#EquipmentID').val().split('-')[1]).toFixed(2);
            }
            /*******************************************************/
            var ResultData = jQuery.parseJSON(result);
            var FinalData = ResultData.Table0;
            var FinalAWBData = ResultData.Table1;
            //$("#divULDTag").html('');
            //////////////////ULD tag AWb Detail/////////////////

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
            /////////////////////////////////////
            //HTMLResult = HTMLResult.replace("<head>", "<head><script type=\"text/javascript\" src=\"Scripts/jquery-ui-1.10.2.custom.min.js\"></script>");
            var url;
            if (location.hostname == "localhost" || location.hostname.toLowerCase() == "saslive.cargoflash.com")
                url = "";
            else
                url = "http://" + location.hostname + "/" + window.location.pathname.replace(/^\/([^\/]*).*$/, '$1');

            var AllResult = "<script src=\"" + url + "/JScript/Roster/Schedular/jquery.min.js\"></script><script type=\"text/javascript\" src=\"" + url + "/Scripts/jqueryPrintNew.js\"></script><script type=\"text/javascript\">function PrintULD(){$(\"#btnPrint\").css('display', 'none');$(\"#tblDetails\").printArea();};</script>";
            AllResult = AllResult + "<table id=tblDetails style='font-size: .80em; font-family: Helvetica Neue,Lucida Grande,Segoe UI, Arial, Helvetica, Verdana, sans-serif;'><tr><td><button class='btn btn-primary btn-sm' style='width:125px;' onclick='PrintULD();' id='btnPrint'>Print</button></td></tr><tr>";
            AllResult = AllResult + "</tr></table>";


            debugger;

            var NetWeight = 0.00;
            var EmptyWeight = 0.00;
            var GrossWeight = 0.00;

            var str = userContext.SysSetting.LogoURL;
            var finallogo = "";

            if (FinalData[0].AirlineLogo == '') {
                str = str.split('/');
                finallogo = str[3] + "/" + str[4];
            } else {
                finallogo = '/BLOBUploadAndDownload/DownloadFromBlob/?filenameOrUrl=' + FinalData[0].AirlineLogo;
            }
            //$('#Aimg').find('img').attr('src', '')
            //$('#Aimg').find('img').attr('src', '/BLOBUploadAndDownload/DownloadFromBlob/?filenameOrUrl=' + FinalData[0].AirlineLogo);
            //$('#Aimg').find('img').attr('onError', 'this.style.display=\"none\"');

            if (FinalAWBData.length > 0) {
                NetWeight = FinalAWBData[0].NetWeight
                EmptyWeight = FinalAWBData[0].EmptyWeight
                GrossWeight = FinalAWBData[0].GrossWeight

            }

            if (ResultData.Table0.length > 0) {
                AllResult = "";

                AllResult += "<table border='0'  cellpadding='0' cellspacing='0' style='width: 7.0in; height: 8.5in;'> <tr><td colspan='1'><center>"
                AllResult += " <button class='btn btn-primary btn-sm' style='width:125px;' id='btnPrint'  onclick='PrintULD();'>Print</button>"
                AllResult += "</center>"
                AllResult += "</td>"
                AllResult += "</tr>"
                AllResult += "<tr>"

                AllResult += "<td>"
                AllResult += "<div id='divdetails'>"
                AllResult += "<table border='1' id='tblulddetails' cellpadding='0' cellspacing='0' style='border-collapse: collapse; width: 6.0in; height: 7.5in;'>"
                AllResult += "<tr>"
                AllResult += "<td colspan='2'>"
                AllResult += "<center>"
                AllResult += "<img id='ImgLogo' src='" + finallogo + "' style='width:130px;height:50px' /><br/>"
                AllResult += "<span style='font-weight: bold; font-size:15pt'>CONTAINER/PALLET TAG</span>"
                AllResult += "</center>"
                AllResult += " </td>"
                AllResult += "</tr>"
                AllResult += " <td>"
                AllResult += " <center>"
                AllResult += "<table border='1' cellpadding='0' cellspacing='0' style='border-collapse: collapse; width: 5.0in; height: 6.5in;'>"
                AllResult += "<tr>"

                AllResult += "<td colspan='2'>"
                AllResult += "<span style='font-weight: bold; font-size:10pt'>ULD Serial Number :" + ResultData.Table0[0].ULDNo + "</span>"
                AllResult += " </td>"
                AllResult += "</tr>"
                AllResult += "<tr>"

                AllResult += "<td width='50%'>"
                AllResult += "<span style='font-weight: bold; font-size:10pt'>Destination :</span> <span id='spnDestination' style='font-weight: bold; font-size:10pt'>" + ResultData.Table0[0].Destination + "</span>"
                AllResult += "</td>"
                AllResult += "<td width='50%'>"
                AllResult += "<span style='font-weight: bold; font-size:10pt'>Position on A/C</span>"
                AllResult += "</td>"
                AllResult += "</tr>"

                AllResult += " <tr>"

                AllResult += "<td width='50%'>"
                AllResult += "<span style='font-weight: bold; font-size:10pt'>Flight/Date :</span><span id='spnFlightDate1' style='font-weight: bold; font-size:10pt'>" + ResultData.Table0[0].FlightDate + "</span>"

                AllResult += "</td>"
                AllResult += "<td width='50%'>"
                AllResult += "<span style='font-weight: bold; font-size:10pt'> Loaded At :</span><span id='spnloadedat' style='font-weight: bold; font-size:10pt'>" + ResultData.Table0[0].Origin + "</span>"

                AllResult += "</td>"
                AllResult += " </tr>"
                AllResult += "<tr>"

                AllResult += "<td width='50%'>"
                AllResult += "<span style='font-weight: bold; font-size:10pt'>Contents (Circle) :</span><span style='color:black; font-size:50pt' id='spnContents1'>C</span>"

                AllResult += "</td>"
                AllResult += "<td width='50%'>"
                AllResult += "<table width='100%'>"
                AllResult += " <tr>"
                AllResult += " <td>"
                AllResult += "<span style='font-weight: bold; font-size:10pt'>Transfer At :</span><span id='spntransferat' style='font-weight: bold; font-size:10pt'></span>"
                //" + ResultData.Table0[0].Destination + "
                AllResult += " </td>"
                AllResult += "</tr>"
                AllResult += "<tr>"
                AllResult += "<td><span style='font-weight: bold; font-size:10pt'>Flight/Date :</span> <span id='spntransferFlightDate1' style='font-weight: bold; font-size:10pt'>" + ResultData.Table0[0].FlightDate + "</span></td>"
                AllResult += " </tr>"
                AllResult += " </table>"

                AllResult += "</td>"
                AllResult += "</tr>"
                AllResult += "<tr>"

                AllResult += " <td colspan='2'>"
                AllResult += "<table width='100%'>"
                AllResult += "<tr>"
                AllResult += " <td width='20%'>"
                AllResult += "<span style='font-weight: bold; font-size:10pt'>Net Weight</span>"
                AllResult += "</td>"
                AllResult += "<td width='1%'>:</td>"
                AllResult += "<td width='80%'><span id='spnNetWeight1' style='font-weight: bold; font-size:10pt'>" + NetWeight + "</span></td>"
                AllResult += "<td><span style='font-weight: bold; font-size:10pt'>Kg</span></td>"
                AllResult += " </tr>"

                AllResult += "<tr>"
                AllResult += " <td>"
                AllResult += "<span style='font-weight: bold; font-size:10pt'>Tare Weight</span>"
                AllResult += "</td>"
                AllResult += " <td><span style='font-weight: bold; font-size:10pt'>:</span></td>"
                AllResult += "<td><span id='spnTareWeight' style='font-weight: bold; font-size:10pt'>" + EmptyWeight + "</span></td>"
                AllResult += "<td><span style='font-weight: bold; font-size:10pt'>Kg</span></td>"
                AllResult += " </tr>"


                AllResult += "<tr>"
                AllResult += "<td>"
                AllResult += "<span style='font-weight: bold; font-size:10pt'>Total Weight</span>"

                AllResult += "</td>"
                AllResult += "<td><span style='font-weight: bold; font-size:10pt'>:</span></td>"
                AllResult += "<td><span id='spnTotal' style='font-weight: bold; font-size:10pt'>" + GrossWeight + "</span></td>"
                AllResult += "<td><span style='font-weight: bold; font-size:10pt'>Kg</span></td>"
                AllResult += "</tr>"
                AllResult += " <tr>"
                AllResult += "<td>"
                AllResult += " <span style='font-weight: bold; font-size:10pt'>Remarks</span>"

                AllResult += "</td>"
                AllResult += " <td> <span style='font-weight: bold; font-size:10pt'>:</span></td>"
                AllResult += "<td><span id='spnRemark' style='font-weight: bold; font-size:10pt'>" + ResultData.Table0[0].ULDContourCode + "</span></td>"
                AllResult += "<td></td>"
                AllResult += "</tr>"


                AllResult += " </table>"

                AllResult += " </td>"

                AllResult += " </tr>"
                AllResult += "<tr>"

                AllResult += "<td colspan='2'>"
                AllResult += "<table width='100%'>"
                AllResult += " <tr>"

                AllResult += "<td>"
                AllResult += "<span style='font-weight: bold; font-size:10pt'>PIC</span>"
                AllResult += "</td>"
                AllResult += "<td><span style='font-weight: bold; font-size:10pt'>Name</td>"
                AllResult += "<td><span style='font-weight: bold; font-size:10pt'>Signature </td>"
                AllResult += "<td><span style='font-weight: bold; font-size:10pt'>Position</td>"
                AllResult += "</tr>"

                AllResult += " </table>"

                AllResult += "</td>"
                AllResult += " </tr></table></center></td></tr></table></div></td></tr></table>"

                AllResult += "<script src=\"" + url + "/JScript/Roster/Schedular/jquery.min.js\"></script><script type=\"text/javascript\" src=\"" + url + "/Scripts/jqueryPrintNew.js\"></script><script type=\"text/javascript\">function PrintULD(){$(\"#btnPrint\").css('display', 'none');$(\"#tblulddetails\").printArea();};</script>";


            }
            $("#divNewDetail").html('');
            // $("#divNewDetail").html(AllResult);
            //$('#ImgLogo').attr('src', userContext.SysSetting.LogoURL);
            var w = window.open();
            w.document.writeln(AllResult);

            AllResult = "";

            //$("#btnPrint").bind("click", function () {
            //    funPrintRSReportData();
            //});

        },
        error: function (err) {
            alert("Generated Error!");
        }
    });
}


function SaveOffloadedUld() {
    var vgriduld = cfi.GetCFGrid("divOffloadedULD");
    if (vgriduld != undefined) {
        var detaildatasource = vgriduld.dataSource;
        var offULD1 = [];

        var detaildata = detaildatasource.data();
        $.each(detaildata, function (i, item) {
            if (item) {
                var chkid = "chkSelect_" + item.ULDStockSNo;
                if ($("input[type='checkbox'][id='" + chkid + "']").is(':checked')) {
                    var UldModel = {
                        UldStockSno: parseInt(item.ULDStockSNo),
                        DailyFlightSNo: dailyflightsno

                    }
                    offULD1.push(UldModel);
                }

            }
        });
        $("#imgprocessing").show();

        if (offULD1.length > 0) {
            $.ajax({
                url: "Services/BuildUp/BuildUpProcessService.svc/SaveBuildOffloadedULD", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({
                    ProcessedULDInfo: offULD1
                }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result == "") {
                        cfi.ClosePopUp("divOffloadedULDButton");
                        if ($("#black_overlay").length > 0)
                            $("#black_overlay").remove();

                        BuildupSearch();
                        ShowMessage('success', 'Success - Build Up', "Flight No. [" + $("#Text_searchFlightNo").data("kendoAutoComplete").value() + "] -  Processed Successfully", "bottom-right");
                        //ResetSearchByFlight();

                    }
                    else
                        ShowMessage('warning', 'Warning - Build Up', "Flight No. [" + $("#Text_searchFlightNo").data("kendoAutoComplete").value() + "] -  " + result, "bottom-right");
                },
                error: function (xhr) {
                    ShowMessage('warning', 'Warning - Build Up', "Flight No. [" + $("#Text_searchFlightNo").data("kendoAutoComplete").value() + "]  -  unable to process.", "bottom-right");

                }
            });
        } else {
            ShowMessage('warning', 'Warning - Build Up', "Kindly select at least one ULD to SAVE.", "bottom-right");

            $('#cfMessage-container').css('right', '40%');
        }
    }


}
function funPrintRSReportData() {
    debugger;
    // PrintDiv($(divID).html(), $(bac).html());

    $("#btnPrint").css('display', 'none');
    $("#divdetails").printArea();
}

function PrintDiv(data, bac) {
    var mywindow = window.open('', 'my div', 'height=500,width=800');
    mywindow.document.write('<html><head><title></title>');
    mywindow.document.write('</head><body >');
    mywindow.document.write(data);
    mywindow.document.write('</body></html>');
    mywindow.document.close();
    mywindow.focus();
    mywindow.print();
    mywindow.close();
    return true;
}
function UWSPrint() {
    $("#btnPrints").hide();
    $("#divNewDetail").printArea();
}
function CheckDGR(UldStockSNo) {
    var IsDGR = false;
    var AllSPHC = "";

    var childgrid = cfi.GetNestedCFGrid("div__" + UldStockSNo.toString())
    if (childgrid != undefined) {
        var cdatasource = childgrid.dataSource;
        var data = cdatasource.data();
        if (data != null && data.length > 0) {
            $(data).each(function (index, item) {
                if (item.SPHC != "") {
                    AllSPHC = AllSPHC + "," + item.SPHC;
                }
            });
        }
    }
    /*
    if (AllSPHC.length > 1) {
        $.ajax({
            url: "Services/BuildUp/BuildUpProcessService.svc/CheckForDGR?SPHC=" + AllSPHC,
            async: false,
            type: "get",
            cache: false,
            contentType: "application/json; charset=utf-8",
            //data: { SPHC:AllSPHC },
            success: function (result) {
                if (parseInt(result) > 0) {
                    IsDGR = true;
                }
            }
        });
    }
}*/

    if (childgrid == undefined) {
        if (LstULDSPH != undefined && LstULDSPH.length > 0) {
            $.each(LstULDSPH, function (index, item) {
                if (item.Key != "") {
                    AllSPHC = AllSPHC + "," + item.Key;
                }
            });
        }
    }

    if (AllSPHC.length > 1) {
        $.ajax({
            url: "Services/BuildUp/BuildUpProcessService.svc/CheckForDGR?SPHC=" + AllSPHC,
            async: false,
            type: "get",
            cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (parseInt(result) > 0) {
                    IsDGR = true;
                }
            }
        });
    }

    return IsDGR;
}

var seletedObj1;
var seletedObj2;

function AddULDTime(obj, AddFrom) {

    //$("#divAfterContent").show();   

    if ($("#tblBuildupTime").length === 0) {
        $("#tblBuildupTime").html('');
        $("#divAfterContent").html('');
        $("#divAfterContent").html("<table id='tblBuildupTime' align='center' width='402px' height='79px'><tr><td align='center'><input type='text' controltype='datetype' id='txtBuildupStartDate' class='datepicker' />&nbsp;<input type='text' class='timePicker' id='txtBuildupStartTime'  /><input type='button' value='Save' class='btn btn-block btn-success btn-sm' onclick='UpdateBuildupTime(\"" + obj.id + "\");' /></td></tr></table>");

        $("#tblBuildupTime").find(".datepicker").kendoDatePicker({
            format: "dd-MMM-yyyy",
            value: new Date()
        });

        var ULDStartTime = $("#tblBuildupTime").find(".timePicker").kendoTimePicker({
            interval: 1,
            format: "HH:mm",
            change: function () {
                var startTime = ULDStartTime.value();
                if (startTime) {
                    startTime = new Date(startTime);
                    startTime.setMinutes(startTime.getMinutes() + this.options.interval);
                } else {
                    $("#tblBuildupTime").find(".timePicker").val('');
                }
                //alert(startTime);
            }
        }).data("kendoTimePicker");

        //$('#tblBuildupTime').css('padding-top', '8px');
        //$('.k-widget.k-window').css('background-color', 'white');
    }

    delete seletedObj1;
    seletedObj1 = obj;

    //cfi.PopUp_Common("divAfterContent", "ULD Build Up Time", 400, null, null, 100); 
    cfi.PopUp_Common("tblBuildupTime", "ULD Build Start Time", 400, null, null, 100);
    $('.k-widget.k-window').removeClass("k-state-focused");
    //$('.k-widget.k-window').css('background-color', 'white');

}

function StartTime_PopUpOnClose(cntrlId) {
    $("#tblBuildupTime").remove();
}

function EndTime_PopUpOnClose(cntrlId) {
    $("#tblBuildupEndTime").remove();
}

function AddULDEndTime(obj, AddFrom) {

    //$("#divAfterContent").show(); 

    var SelectedULDTime = obj.textContent == "+ Add Time" ? "" : obj.textContent;


    if ($("#tblBuildupEndTime").length === 0) {
        $("#tblBuildupEndTime").html('');
        $("#divAfterContent").html('');
        $("#divAfterContent").html("<table id='tblBuildupEndTime' align='center' width='402px' height='79px'><tr><td align='center'><input type='text' controltype='datetype' id='txtBuildupEndDate' class='datepicker' />&nbsp;<input type='text' class='timePicker' id='txtBuildupEndTime'  /><input type='button' value='Save' class='btn btn-block btn-success btn-sm' onclick='UpdateBuildupTime(\"" + obj.id + "\");' /></td></tr></table>");

        $("#tblBuildupEndTime").find(".datepicker").kendoDatePicker({
            format: "dd-MMM-yyyy",
            value: SelectedULDTime != "" ? new Date(SelectedULDTime) : new Date(),
        });

        var ULDStartTime = $("#tblBuildupEndTime").find(".timePicker").kendoTimePicker({
            interval: 1,
            format: "HH:mm",
            value: SelectedULDTime != "" ? new Date(SelectedULDTime) : "",
            change: function () {
                var startTime = ULDStartTime.value();
                if (startTime) {
                    startTime = new Date(startTime);
                    startTime.setMinutes(startTime.getMinutes() + this.options.interval);
                } else {
                    $("#tblBuildupEndTime").find(".timePicker").val('');
                }
                //alert(startTime);
            }
        }).data("kendoTimePicker");

        //$('#tblBuildupEndTime').css('padding-top', '8px');
        //$('.k-widget.k-window').css('background-color', 'white');
    }

    //delete seletedObj2;
    seletedObj2 = obj;

    //cfi.PopUp_Common("divAfterContent", "ULD Build Up Time", 400, null, null, 100); 
    cfi.PopUp_Common("tblBuildupEndTime", "ULD Build End Time", 400, null, EndTime_PopUpOnClose, 100);
    //$('.k-widget.k-window').css('background-color', 'white');
    $('.k-widget.k-window').removeClass("k-state-focused");
}

function UpdateBuildupTime(obj) {
    if (obj == "spnULDStartTime") {
        var CalTime, CalDate, CalDateTime;
        if ($("#txtBuildupStartDate").val() == "") {
            ShowMessage("warning", "Information", "ULD Build Up Date is required.");
            return;
        }
        else if ($("#txtBuildupStartTime").val() == "") {
            ShowMessage("warning", "Information", "ULD Build Up Time is required.");
            return;
        }

        CalTime = ($("#txtBuildupStartTime").val() == '') ? '00:00' : $("#txtBuildupStartTime").val();
        CalDate = $("#txtBuildupStartDate").val();
        CalDateTime = CalDate + ' ' + CalTime;

        //var udlStartTime = $('#spnULDStartTime').text();

        //if (udlStartTime != "" && udlStartTime != "+ Add Time") {
        //    var _datePart = udlStartTime.split(' ')[0];
        //    var _timePart = udlStartTime.split(' ')[1];
        //    udlStartTime = _datePart.replace('-', ' ').replace('-', ' ');
        //    udlStartTime = GetDate(udlStartTime) + ' ' + _timePart + ':00';
        //}

        var udlEndTime = $('#spnULDEndTime').text();

        if (udlEndTime != "" && udlEndTime != "+ Add Time") {
            var _datePart = udlEndTime.split(' ')[0];
            var _timePart = udlEndTime.split(' ')[1];
            udlEndTime = _datePart.replace('-', ' ').replace('-', ' ');
            udlEndTime = GetDate(udlEndTime) + ' ' + _timePart + ':00';
        }

        var FinalDateTime = CalDate.replace('-', ' ').replace('-', ' ');
        FinalDateTime = GetDate(FinalDateTime) + ' ' + CalTime + ':00';

        //if (udlStartTime != "" && udlStartTime != "+ Add Time" && CalDateTime != "" && Date.parse(udlStartTime) > Date.parse(FinalDateTime)) {
        //    ShowMessage("warning", "Information", "ULD Build End Time should be greater than ULD Build Start Time .");
        //    $("#txtBuildupStartTime").val("");
        //    return;
        //}
        if (udlEndTime != "" && udlEndTime != "+ Add Time" && CalDateTime != "" && Date.parse(udlEndTime) < Date.parse(FinalDateTime)) {
            ShowMessage("warning", "Information", "ULD Build Start Time should be greater than ULD Build End Time .");
            $("#txtBuildupStartTime").val("");
            return;
        }
        else {
            $('#' + obj).text(CalDateTime);
            $(".k-window:visible > .k-window-content").data("kendoWindow").close();
            //$("#tblBreakdownStartTime").data("kendoWindow").close();
        }
    }
    else if (obj == "spnULDEndTime") {
        var CalTime, CalDate, CalDateTime;
        if ($("#txtBuildupEndDate").val() == "") {
            ShowMessage("warning", "Information", "ULD Build Up Date is required.");
            return;
        }
        else if ($("#txtBuildupEndTime").val() == "") {
            ShowMessage("warning", "Information", "ULD Build Up Time is required.");
            return;
        }

        CalTime = ($("#txtBuildupEndTime").val() == '') ? '00:00' : $("#txtBuildupEndTime").val();
        CalDate = $("#txtBuildupEndDate").val();
        CalDateTime = CalDate + ' ' + CalTime;

        var udlStartTime = $('#spnULDStartTime').text();

        if (udlStartTime != "" && udlStartTime != "+ Add Time") {
            var _datePart = udlStartTime.split(' ')[0];
            var _timePart = udlStartTime.split(' ')[1];
            udlStartTime = _datePart.replace('-', ' ').replace('-', ' ');
            udlStartTime = GetDate(udlStartTime) + ' ' + _timePart + ':00';
        }

        //var udlEndTime = $('#spnULDEndTime').text();

        //if (udlEndTime != "" && udlEndTime != "+ Add Time") {
        //    var _datePart = udlEndTime.split(' ')[0];
        //    var _timePart = udlEndTime.split(' ')[1];
        //    udlEndTime = _datePart.replace('-', ' ').replace('-', ' ');
        //    udlEndTime = GetDate(udlEndTime) + ' ' + _timePart + ':00';
        //}

        var FinalDateTime = CalDate.replace('-', ' ').replace('-', ' ');
        FinalDateTime = GetDate(FinalDateTime) + ' ' + CalTime + ':00';

        if (udlStartTime != "" && udlStartTime != "+ Add Time" && CalDateTime != "" && Date.parse(udlStartTime) > Date.parse(FinalDateTime)) {
            ShowMessage("warning", "Information", "ULD Build End Time should be greater than ULD Build Start Time .");
            $("#txtBuildupEndTime").val("");
            return;
        }
        //else if (udlEndTime != "" && udlEndTime != "+ Add Time" && CalDateTime != "" && Date.parse(udlEndTime) < Date.parse(FinalDateTime)) {
        //    ShowMessage("warning", "Information", "ULD Build End Time should be greater than ULD Build Start Time .");
        //    $("#txtBuildupStartTime").val("");
        //    return;
        //}
        else {
            $('#' + obj).text(CalDateTime);
            $(".k-window:visible > .k-window-content").data("kendoWindow").close();
            //$("#tblBreakdownStartTime").data("kendoWindow").close();
        }
    }
}

function GetDate(str) {
    var arr = str.split(" ");
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var month = ('0' + (months.indexOf(arr[1]) + 1)).slice(-2);
    //var final = arr[2] + '-' + month + '-' + arr[0];
    var final = month + '/' + arr[0] + '/' + arr[2]; //mm/dd/yyy
    return final;
}

function CheckAircraftCapacity(nonULDData, DataFrom) {
    var result = "";
    var AircraftNo = $('span#Aircraft').text();
    var AllULDShipmentTR = $('#divUldShipmentSection input[type=checkbox]').closest("tr");

    /**************Get Selected SHC Only******************/
    var arrCapacity = [];
    $(nonULDData).each(function (index1, item1) {
        $(arrAircraftCapacityList).each(function (index, item) {
            if ($(item1).find("td:eq(12)").text() == item.SPHC) {
                var arr = {
                    SPHC: item.SPHC,
                    Capacity: item.Capacity,
                }
                arrCapacity.push(arr);
            }
        });
    });
    /**************************************************/

    if (arrCapacity.length > 0) {
        $(arrCapacity).each(function (masterindex, masteritem) {
            var TotalGRWT = 0;
            var AWBNo = "";
            $(AllULDShipmentTR).each(function (index, item) { // ULD Data
                var _currentSPHC, _currentGRWT;
                _currentSPHC = $(item).find("td:eq(6)").text();
                _currentGRWT = $(item).find("td:eq(4)").text(); // Gross Weight
                if (_currentSPHC != "" && _currentSPHC == masteritem.SPHC) {
                    TotalGRWT = parseFloat(TotalGRWT) + parseFloat(_currentGRWT);
                    if (AWBNo.indexOf($(item).find("td:eq(2)").text()) == -1) {
                        AWBNo = $(item).find("td:eq(2)").text() + "," + AWBNo;
                    }
                }
            });

            if (AWBNo != "") {
                AWBNo = RemoveLastComma(AWBNo);
            }

            $(nonULDData).each(function (index, item) { // Non ULD Data
                var _currentSPHC, _currentGRWT;
                _currentSPHC = $(item).find("td:eq(12)").text();
                //_currentGRWT = $(item).find("td:eq(10)").text(); //Gross Weight

                var loaddetailindex = -1;
                var trHeader = $(this).closest("div#divNonUldShipmentSection").find(".k-grid-header").find("tr[role='row']");
                loaddetailindex = trHeader.find("th[data-field='LoadDetail']").index();
                var GRWTControl = $(this).find("td:eq(" + loaddetailindex + ")").find("input[type='text'][id='txtGross']");
                _currentGRWT = GRWTControl.val();

                if (_currentSPHC != "" && _currentSPHC == masteritem.SPHC) {
                    TotalGRWT = parseFloat(TotalGRWT) + parseFloat(_currentGRWT);
                    if (AWBNo.indexOf($(item).find("td:eq(2)").text()) == -1) {
                        AWBNo = $(item).find("td:eq(2)").text() + "," + AWBNo;
                    }
                }

                /**************Check Capacity From Saved ULD***************/
                $(arrULDCapacity_Final).each(function (index3, item3) {
                    if (item3.SPHCCode == _currentSPHC) {
                        TotalGRWT = parseFloat(TotalGRWT) + parseFloat(item3.GrossWeight);
                    }
                });
                /**********************************************************/
            });

            if (AWBNo != "") {
                AWBNo = RemoveLastComma(AWBNo);
            }

            var MaxCapacity = parseFloat(masteritem.Capacity);
            if (TotalGRWT > MaxCapacity) {
                result = "AWB '" + AWBNo + "' with SHC '" + masteritem.SPHC + "' exceeds the permissible weight in the Aircraft '" + AircraftNo + "'";
                return false;
            }
        });
    }
    return result;
}

function GetAircraftCapacity() {
    arrAircraftCapacityList = [];
    var arrAircraftCapacity = [];
    var AircraftNo = $('span[id="Aircraft"]').text();
    var CarrierCode = $('span[id="FlightNo"]').text();
    if (CarrierCode != "") {
        CarrierCode = CarrierCode.split('-')[0];
    }

    $.ajax({
        url: "Services/BuildUp/BuildUpProcessService.svc/GetAircraftCapacity?AircraftNo=" + AircraftNo + "&CarrierCode=" + CarrierCode, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var ds = jQuery.parseJSON(result);
            arrAircraftCapacity = ds.Table0;
            if (arrAircraftCapacity.length > 0) {
                $(arrAircraftCapacity).each(function (index, item) {
                    var arr = {
                        SPHC: item.SPHCCode,
                        Capacity: item.AircraftCapacity,
                    }
                    arrAircraftCapacityList.push(arr);
                });
            }
        }
    });
}

function RemoveLastComma(_item) {
    if (_item != "" && _item.length > 2) {
        var iscomma = _item.substring(_item.length - 1, _item.length);
        if (iscomma == ",") {
            var _item = _item.substring(0, _item.length - 1);
        }
    }
    return _item;
}

function GetULDWeight() {
    var TareWeight = 0, NetWeight, TotalWeight;
    var vgrid_uld = cfi.GetCFGrid("divUldShipmentSection");
    if (vgrid_uld != undefined) {
        var datasource_uld = vgrid_uld.dataSource;
        var data_uld = datasource_uld.data();
        if (data_uld.length > 0) {
            $.each(data_uld, function (i, item) {
                if (item.ULDStockSNo.toString() == __uldstocksno) {
                    TareWeight = item.ULDWeight.split('/')[0];
                    TareWeight = TareWeight == "" ? "0" : TareWeight;
                    NetWeight = item.Used.split('/')[0];
                    NetWeight = NetWeight == "" ? "0" : NetWeight;
                    //TotalWeight = (parseFloat(TareWeight) + parseFloat(NetWeight)).toFixed(2); /*****No Need to Check Net Weight(TFS: CR: 6304 )
                    TotalWeight = (parseFloat(TareWeight)).toFixed(2);
                    return false;
                }
            });
        }
    }
    return TotalWeight;
}

function OverhangControl(status) {
    if (!status) {
        $('#Ovng_MasterCutOffHeight').attr("disabled", true);
        $('#Text_Ovng_MasterMesUnit').attr("disabled", true);
        $('[id^="areaTrans_ulddetails_uldoverhangpallet"] input[type="text"]').attr("disabled", true);

        $('#Ovng_MasterCutOffHeight').val('');
        $('#Ovng_MasterMesUnit').val('');
        $('#Text_Ovng_MasterMesUnit').val('');
        $('[id^="areaTrans_ulddetails_uldoverhangpallet"] input[type="text"]').val('');
        $('[id^="areaTrans_ulddetails_uldoverhangpallet"] input[type="hidden"]').val('');
        $('input[type="checkbox"][id^="IsFFMRemarks"]').attr("disabled", true);
        $('input[type="checkbox"][id^="IsFFMRemarks"]').removeAttr("checked");
    }
    else {
        $('#Ovng_MasterCutOffHeight').attr("disabled", false);
        $('#Text_Ovng_MasterMesUnit').attr("disabled", false);
        $('[id^="areaTrans_ulddetails_uldoverhangpallet"] input[type="text"]').attr("disabled", false);
        $('input[type="checkbox"][id^="IsFFMRemarks"]').attr("disabled", false);

    }
}

function CheckUnPlanShipment(obj, McBookingSNo) {
    var AWBSNo = obj.id.split('_')[1];

    var trHeader = $(obj).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var plannedPcsIndex = trHeader.find("th[data-field='LoadDetail']").index();
    var plannedPcs = $(obj).closest('tr').find('td:eq(' + plannedPcsIndex + ') input[type=text][id="txtPcs"]').val();

    var FPSNoIndex = trHeader.find("th[data-field='FPSNo']").index();
    var FPSNo = $(obj).closest('tr').find('td:eq(' + FPSNoIndex + ')').text();

    if (obj.checked) {
        $.ajax({
            url: "Services/BuildUp/BuildUpProcessService.svc/CheckOnHoldShipment", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ AWBSNo: AWBSNo, McBookingSNo: McBookingSNo }),
            success: function (result) {
                if (result) {
                    var Data = jQuery.parseJSON(result);
                    //Nayak on 2020-03-13 Desc AWB from lying list and build to Bulk/ULD and flight destination is different from AWB destination than system will give warning "AWB Destination is different from Flight Destination" Do you want to continue 
                    var FlightActulaRoute = flightrouteStr;
                    var AwbActulaRoute = Data.Table0[0].AwbFlightplanRoute;
                    var IsConfirm = true;
                    if (Data.Table0[0].AwbFlightplanRoute.length <= 4) {
                        if (FlightActulaRoute.indexOf(AwbActulaRoute) > -1) {
                            IsConfirm = true;
                        } else {
                            IsConfirm = confirm('Planned shipments belong to different destinations. Do you wish to continue?');
                        }
                    } else {
                        var FlightPlanDestinationCheck = 0;
                        var sAwbActulaRoute = AwbActulaRoute.split(',');
                        for (var i = 0; i < sAwbActulaRoute.length; i++) {
                            if (FlightActulaRoute.indexOf(sAwbActulaRoute[i]) > -1) {
                                FlightPlanDestinationCheck = 1;
                            } 
                        }
                    }
                    if (FlightPlanDestinationCheck == 0) {
                        IsConfirm = confirm('Planned shipments belong to different destinations. Do you wish to continue?');
                    }
                    if (IsConfirm == false) {
                        $(obj).attr("checked", false);
                        return false;
                    }
                    if (Data.Table1[0].Result.split('?')[1] == '1') {
                        if (FPSNo != "0") {
                            $(obj).attr("checked", false);
                            ShowMessage('warning', 'Information', Data.Table1[0].Result.split('?')[0]);
                            return false;
                        }
                    }
                    else if (Data.Table1[0].Result.split('?')[1] == '0') {
                        ShowMessage('warning', 'Information', Data.Table1[0].Result.split('?')[0]);
                    }
                    else if (parseInt(plannedPcs) > parseInt(Data.Table1[0].Result.split('?')[2])) {
                        ShowMessage('warning', 'Information', Data.Table1[0].Result.split('?')[0] + ", You can plan only " + Data.Table1[0].Result.split('?')[2] + " Pcs.");
                        $(obj).attr("checked", false);
                        return false;
                    }
                }

                //tmpPlannedPcs = parseInt(tmpPlannedPcs) + parseInt(plannedPcs);
                //if (parseInt(tmpPlannedPcs) > parseInt(result.split('?')[2])) {
                //    ShowMessage('warning', 'Information', result.split('?')[0] + ", pcs exceeded.");
                //    $(obj).attr("checked", false);
                //    return false;
                //}               

                //if (result != "Valid") {
                //    //obj.checked = false;
                //    ShowMessage('warning', 'Information', result);
                //}
            }
        });
    }
}

function divShipmentMoveSectionFloatingImage() {
    $("#divShipmentMoveSection").closest('td').css('vertical-align', 'top');
    $("#divShipmentMoveSection").attr('align', 'center');
    $("#divShipmentMoveSection").css('width', '100%').css('float', 'none');
    var offset = $("#divShipmentMoveSection").offset();
    var topPadding = 15;
    $(window).scroll(function () {
        if ($(window).scrollTop() > offset.top) {
            $("#divShipmentMoveSection").stop().animate({
                marginTop: $(window).scrollTop() - offset.top + topPadding
            });
        } else {
            $("#divShipmentMoveSection").stop().animate({
                marginTop: 0
            });
        };
    });
}


function btnSaveCancelImage() {
    $("#divbtnSaveCancelImage").css('vertical-align', 'top');
    $("#divbtnSaveCancelImage").attr('align', 'center');
    $("#divbtnSaveCancelImage").css('width', '100%').css('float', 'none');
    $("#divbtnSaveCancelImage").css({ marginTop: parseInt($("#divPOMailDetails").height() + 12) });


    var offset = $("#divbtnSaveCancelImage").offset();
    var topPadding = 15;
    $("#divPOMailDetails").scroll(function () {
        if ($("#divPOMailDetails").scrollTop() > offset.top) {
            $("#divbtnSaveCancelImage").stop().animate({
                marginTop: parseInt($("#divPOMailDetails").height() + 12)// $("#divPOMailDetails").scrollTop() - offset.top + topPadding
            });
        } else {
            $("#divbtnSaveCancelImage").stop().animate({
                marginTop: 0
            });
        };
    });
}

function CheckFlight() {
    var _FlightNo, _FlightDate, _OriginCity, Message;

    _FlightNo = $("#Text_searchFlightNo").data("kendoAutoComplete").value();
    _FlightDate = cfi.CfiDate("searchFlightDate");
    _OriginCity = User_CityCode;

    $.ajax({
        url: "Services/BuildUp/BuildUpProcessService.svc/CheckFlight", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ FlightNo: _FlightNo, FlightDate: _FlightDate, OriginCity: _OriginCity }),
        success: function (result) {
            Message = result;
        }
    });
    return Message;
}

function CheckULDMaxWeightCapacity(vgrid, PlannedGrWt) {
    var Message = "";
    var ULDMaster;
    ULDMaster = $("#div__" + vgrid.options.parentValue.toString()).closest("tr.k-detail-row").prev();
    if (ULDMaster != undefined && ULDMaster.length > 0) {
        ULDMasterItem = vgrid.dataItem(ULDMaster);
        var ULDWeight, UsedWeight;
        ULDWeight = parseFloat(ULDMasterItem.MaxGrossWeight);
        if (ULDMasterItem.Used == "") {
            UsedWeight = 0;
        }
        else {
            UsedWeight = parseFloat(ULDMasterItem.GrossWeight);
        }
        if (ULDWeight < UsedWeight + PlannedGrWt) {
            Message = "Planned Gross Weight in ULD '" + ULDMasterItem.ULDNo + "' exceeds the permissible limit. Do you wish to proceed?";
        }
    }
    return Message;
}

//added by santosh
function CheckEquipment() {
    /*
    var equipmentID = $("#Text_EquipmentID").data("kendoAutoComplete").key();
    if(equipmentID!="")
    {
        if (equipmentID.split('-')[2] == "UTILIZED" && _EquipmentSNo != equipmentID.split('-')[0])
        {
            var IsUtilized = confirm('Equipment is already occupied.Do you want to add ULD in this Equipment?');

            if (IsUtilized == false) {
                $("#Text_EquipmentID").data("kendoAutoComplete").key('');
                $("#Text_EquipmentID").data("kendoAutoComplete").value('');
            }
        }
    }*/
    if ($("#Text_EquipmentID").data("kendoAutoComplete").key() == "") {
        $('#AddScaleWeight').val('');

        $('#AddScaleWeight').removeAttr('data-valid');
        $('#AddScaleWeight').removeAttr('data-valid-msg');
        $('#AddScaleWeight').removeClass('k-input valid_invalid');
    }
    else {
        $('#AddScaleWeight').addClass('k-input valid_invalid');
        $('#AddScaleWeight').attr('data-valid', 'required');
        $('#AddScaleWeight').attr('data-valid-msg', 'Please Enter Scale Weight.');
    }
}
function GetULDVolGRWt() {
    var TotalWeight;
    var vgrid_uld = cfi.GetCFGrid("divUldShipmentSection");
    if (vgrid_uld != undefined) {
        var datasource_uld = vgrid_uld.dataSource;
        var data_uld = datasource_uld.data();
        if (data_uld.length > 0) {
            $.each(data_uld, function (i, item) {
                if (item.ULDStockSNo.toString() == __uldstocksno) {
                    TotalWeight = item.Used;
                    return false;
                }
            });
        }
    }
    return TotalWeight;
}

function SetTabIndex() {
    $("#divareaTrans_ulddetails_uldconsumables input").each(function (i) {
        $(this).attr('tabindex', i + 1000);
    });
}

function RemoveDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
    return newArray;
}

function GetPartnerCarrierCode(PartnerCarrierCode) {
    var Arr = PartnerCarrierCode.split(',');
    var FPartnerCarrierCode = "";
    $(Arr).each(function (row, tr) {
        FPartnerCarrierCode += "" + tr + ",";
    });
    return FPartnerCarrierCode.substr(0, FPartnerCarrierCode.length - 1);
}

function CheckZeroValue(obj, from) {
    if (obj.value != "" && parseInt(obj.value) == 0) {
        ShowMessage('warning', 'Warning - ULD Build Details', "" + from + " should be greater than zero.");
        obj.value = "";
    }
}

function ExpandSelectedULD(obj) {
    $(obj).closest("tr.k-master-row").find('td[class="k-hierarchy-cell"]').find('a[class="k-icon k-plus"]').trigger("click");
}

function GetExpandedSHC() {
    var detailgrid = cfi.GetNestedCFGrid("div__" + __uldstocksno.toString());
    if (detailgrid != undefined) {
        var detaildatasource = detailgrid.dataSource;
        var detaildata = detaildatasource.data();
        $.each(detaildata, function (i, item) {
            var arrSPHC = item.SPHC.split(',');
            $.each(arrSPHC, function (index, data) {
                if (data != "") {
                    LstULDSPH.push({
                        Key: data, Text: data
                    });
                }
            });

        });
    }

    var uniqueSHCArray = RemoveDuplicates(LstULDSPH, "Key");
}
/*Added By Brajendra*/
function GetAWBLockedEvent(UserSNo, AWBSNo, DailyFlightSNo, FlightNo, FlightDate, ULDNo, SubProcessSNo) {
    var message = "";
    $.ajax({
        url: "Services/CommonService.svc/GetAWBLockedEvent",
        data: JSON.stringify({ awbLockedEvent: { UserSNo: parseInt(UserSNo), AWBSNo: parseInt(AWBSNo), DailyFlightSNo: DailyFlightSNo, FlightNo: FlightNo, FlightDate: FlightDate, ULDNo: ULDNo, SubProcessSNo: SubProcessSNo } }),
        async: false,
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            if (Data.Table0.length > 0) {
                if (Data.Table0[0].Status1 == 1) {
                    //change by ashish 30aug19 for fetch alter message
                    //ShowMessage('warning', 'Warning - AWB Locked Information', "AWB No <b>" + Data.Table0[0].AWBNo + "</b> is currently in use for <b>" + Data.Table0[0].LockedProcessName + "</b> by <b>" + Data.Table0[0].UserName + "</b> since <b>" + Data.Table0[0].LockedOn + "</b>.", "bottom-right");
                    ShowMessage('warning', 'Warning - AWB Locked Information', Data.Table0[0].Message, "bottom-right");
                    message = "Fail";
                }
                else if (Data.Table0[0].Status1 == 2) {
                    //ShowMessage('warning', 'Warning - ULD Locked Information', "ULD No <b>" + Data.Table0[0].AWBNo + "</b> is currently in use for <b>" + Data.Table0[0].LockedProcessName + "</b> by <b>" + Data.Table0[0].UserName + "</b> since <b>" + Data.Table0[0].LockedOn + "</b>.", "bottom-right");
                    ShowMessage('warning', 'Warning - AWB Locked Information', Data.Table0[0].Message, "bottom-right");
                    message = "Fail";
                }
                else if (Data.Table0[0].Status1 == 3) {
                    //ShowMessage('warning', 'Warning - Flight Locked Information', "Flight No <b>" + Data.Table0[0].AWBNo + "</b> is currently in use for <b>" + Data.Table0[0].LockedProcessName + "</b> by <b>" + Data.Table0[0].UserName + "</b> since <b>" + Data.Table0[0].LockedOn + "</b>.", "bottom-right");
                    ShowMessage('warning', 'Warning - AWB Locked Information', Data.Table0[0].Message, "bottom-right");
                    message = "Fail";
                }

            }
        },
        error: function (error) {
            debugger;
        }
    });
    return message;
}
function SaveUpdateLockedProcess(AWBSNo, DailyFlightSNo, FlightNo, FlightDate, UpdatedBy, SubprocessSNo, SUbprocess, Event, ULDNo) {
    $.ajax({
        url: "Services/CommonService.svc/SaveUpdateLockedProcess", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: AWBSNo, DailyFlightSNo: DailyFlightSNo, FlightNo: FlightNo, FlightDate: FlightDate, UpdatedBy: UpdatedBy, SubprocessSNo: SubprocessSNo, SUbprocess: SUbprocess, Event: Event, ULDNo: ULDNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
        }
    });
}



function fn_GetLyingPOMAilDNDetails(input, TotalPcs, ULDStockSNo, McBookingSNo, ProcessStage) {
    MCBkngSNo = McBookingSNo;
    POMailDetailsArray = [];
    var nonuldgrid = cfi.GetCFGrid("divNonUldShipmentSection");
    var nonuldgriddatasource = nonuldgrid.dataSource;
    var nonuldgriddata = nonuldgriddatasource.data();

    if (parseInt($(input).val()) != TotalPcs && McBookingSNo > 0) {
        ClickThis = input;
        if (parseInt($(input).val()) <= 0) {
            fn_CalculateOFLD(ClickThis);;
            return;
        }
        IsChanged = true;


        //$.each(nonuldgriddata, function (index, val) {

        //    if (MCBookingSNo == val.MCBookingSNo) {
        //        val.IsChanged = true;
        //    }

        //});        
        $.ajax({
            url: "Services/BuildUp/BuildUpProcessService.svc/POMailDNInfo", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ GroupFlightSNo: $("#Text_searchFlightNo").data("kendoAutoComplete").key(), ULDStockSNo: ULDStockSNo, MCBookingSNo: McBookingSNo, Stage: ProcessStage }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var table = JSON.parse(result);
                $("#divPOMailDetails").remove();
                $("#divbtnSaveCancelImage").remove();
                $("#divPOMailDetails_wnd_title").closest('div').remove()
                $("div[id$='divDetail']").append(POMailDetailsDiv);
                cfi.PopUp("divPOMailDetails", "PO Mail Details", 500, null, null, 100);
                $('div[class="k-window-actions k-header"]').hide();
                $("span#divPOMailDetails_wnd_title").closest('div').hide();

                var trRow = $(input).closest("div.k-grid").find("div.k-grid-header");
                var CN38NoIndex = trRow.find("th[data-field='AWBNo']").index();
                $('#lblCN38No').text($(input).closest('tr').find("td:eq(" + CN38NoIndex + ")").text().toUpperCase());

                $('#lblPlanPcs').text($(input).val());
                //$('#lblTotalPcs').text(TotalPcs);
                // cfi.PopUp("divPOMailDetails", "");




                $(table.Table0).each(function (row, tr) {

                    $("#bodyPOMailDetails").append('<tr>' + '<input type="hidden" id="hdnMCBookingSNo" value=' + tr.MCBookingSNo + '><input type="hidden" id="hdnULDSNo" value=' + tr.ULDStockSNo + '><input type="hidden" id="hdnDailyFlightSNo" value=' + tr.DailyFlightSNo + '><input type="hidden" id="hdnPlanned" value=' + tr.Planned + '><input type="hidden" id="hdnDNSNo" value=' + tr.DNSNo + '><td class="ui-widget-content"><input type="checkbox" id="chkDNNo" checked=1 ></td><td class="ui-widget-content"><Label id="DNNo">' + tr.DNNo + '</Label></td><td class="ui-widget-content"><Label id="OriginCity">' + tr.OriginCity + '</Label></td><td class="ui-widget-content"><Label id="DestinationCity">' + tr.DestinationCity + '</Label></td><td class="ui-widget-content"><Label id="MailCategory">' + tr.MailCategory + '</Label></td><td class="ui-widget-content"><Label id="SubCategory">' + tr.SubCategory + '</Label></td><td class="ui-widget-content"><Label id="ReceptacleNumber">' + tr.ReceptacleNumber + '</Label></td><td class="ui-widget-content"><Label id="ReceptacleWeight">' + tr.ReceptacleWeight + '</Label></td></tr>')

                });

                $('<div id="divbtnSaveCancelImage" class="div.k-window-content" style="vertical-align: 100px;margin-top: 500px;position: fixed;float: right; align="center"><input type="button" class="btn btn-block btn-success btn-sm" name="" id="saveDNDetails" style="width:90px;float:right;"value="Save" onclick="SavePoMailDNDetails(' + McBookingSNo + ',' + ULDStockSNo + ',' + $(input).val() + ',1)"><input type="button" class="btn btn-block btn-danger btn-sm" name="" id="btnDNSCancel" style="width:90px;float:right;"value="Cancel" onclick=fn_CancelDNDetails(this,"BUPOFLD")></div>').insertBefore("#divPOMailDetails");


                //$("#bodyPOMailDetails tr").each(function (r, t) {
                //    $(LyingListPOMailDetailsArray).each(function (row, n) {
                //        if ($(t).find("[id^='hdnDNSNo']").val() == n.DNSNo)
                //            $(t).find('input[type=checkbox]').prop('checked', n.isSelect);
                //    });
                //});

                $("#bodyPOMailDetails tr").each(function (r, t) {
                    $(LyingListPOMailDetailsArray).each(function (row, n) {
                        if ($(t).find("[id^='hdnDNSNo']").val() == n.DNSNo)
                            // $(t).find('input[type=checkbox]').prop('checked', n.Planned);
                            $(t).find('input[type=checkbox]').prop('disabled', n.Planned == "0" ? false : true);
                    });
                });


            }
        });
    }
    btnSaveCancelImage();
}



var ClickThis;
var MCBkngSNo = "";

var IsChanged = false;
function fn_GetPOMAilDNDetails(input, TotalPcs, MCBookingSNo) {

    MCBkngSNo = MCBookingSNo;

    var nonuldgrid = cfi.GetCFGrid("divNonUldShipmentSection");
    var nonuldgriddatasource = nonuldgrid.dataSource;
    var nonuldgriddata = nonuldgriddatasource.data();



    if (parseInt($(input).val()) != TotalPcs && MCBookingSNo > 0) {
        ClickThis = input;

        if (parseInt($(input).val()) <= 0) {
            if ($(input).attr("id") == "txtLPcs") fn_CalculateOFLD(ClickThis);
            else fn_CalPRE_BuildUp_GVCBM(ClickThis);
            return;
        }


        //$.each(nonuldgriddata, function (index, val) {

        //    if (MCBookingSNo == val.MCBookingSNo) {
        //        val.IsChanged = true;
        //    }

        //});

        IsChanged = true;

        $("#divPOMailDetails").remove();
        $("#divbtnSaveCancelImage").remove();
        $("#divPOMailDetails_wnd_title").closest('div').remove();
        $("div[id$='divDetail']").append(POMailDetailsDiv);
        cfi.PopUp("divPOMailDetails", "PO Mail Details", 500, null, null, 100);
        //$('div[class="k-window-actions k-header"]').hide();
        //$("span#divPOMailDetails_wnd_title").closest('div').hide();



        var trRow = $(input).closest("div.k-grid").find("div.k-grid-header");
        var CN38NoIndex = trRow.find("th[data-field='AWBNo']").index();
        $('#lblCN38No').text($(input).closest('tr').find("td:eq(" + CN38NoIndex + ")").text());


        $('#lblPlanPcs').text($(input).val());
        //$('#lblTotalPcs').text(TotalPcs);
        // cfi.PopUp("divPOMailDetails", "");      

        $.each(POMailDetailsArray, function (row, tr) {

            if (tr.MCBookingSNo == MCBookingSNo) {

                $("#bodyPOMailDetails").append('<tr>' + '<input type="hidden" id="hdnMCBookingSNo" value=' + tr.MCBookingSNo + '><input type="hidden" id="hdnULDSNo" value=' + tr.ULDStockSNo + '><input type="hidden" id="hdnDailyFlightSNo" value=' + tr.DailyFlightSNo + '><input type="hidden" id="hdnPlanned" value=' + tr.Planned + '><input type="hidden" id="hdnDNSNo" value=' + tr.DNSNo + '><td class="ui-widget-content"><input type="checkbox" id="chkDNNo" checked=1 ></td><td class="ui-widget-content"><Label id="DNNo">' + tr.DNNo + '</Label></td><td class="ui-widget-content"><Label id="OriginCity">' + tr.OriginCity + '</Label></td><td class="ui-widget-content"><Label id="DestinationCity">' + tr.DestinationCity + '</Label></td><td class="ui-widget-content"><Label id="MailCategory">' + tr.MailCategory + '</Label></td><td class="ui-widget-content"><Label id="SubCategory">' + tr.SubCategory + '</Label></td><td class="ui-widget-content"><Label id="ReceptacleNumber">' + tr.ReceptacleNumber + '</Label></td><td class="ui-widget-content"><Label id="ReceptacleWeight">' + tr.ReceptacleWeight + '</Label></td></tr>');
            }

        });


        //$("#bodyPOMailDetails").append($('<tfoot/>').append('<div id="divbtnSaveCancelImage" ><input type="button" class="btn btn-block btn-success btn-sm" name="" id="saveDNDetails" style="width:90px;float:right;"value="Save" onclick="SavePoMailDNDetails(' + MCBookingSNo + ',' + 0 + ',' + $(input).val() + ',0)"><input type="button" class="btn btn-block btn-danger btn-sm" name="" id="btnDNSCancel" style="width:90px;float:right;"value="Cancel" onclick=fn_CancelDNDetails(this,"BUILD-UP")></div>'));

        $('<div id="divbtnSaveCancelImage" class="div.k-window-content" style="vertical-align: 100px;position: absolute;float: right; align="center"><input type="button" class="btn btn-block btn-success btn-sm" name="" id="saveDNDetails" style="width:90px;float:right;"value="Save" onclick="SavePoMailDNDetails(' + MCBookingSNo + ',' + 0 + ',' + $(input).val() + ',0)"><input type="button" class="btn btn-block btn-danger btn-sm" name="" id="btnDNSCancel" style="width:90px;float:right;"value="Cancel" onclick=fn_CancelDNDetails(this,"BUILD-UP")></div>').insertBefore("#divPOMailDetails");


        $("#bodyPOMailDetails tr").each(function (r, t) {
            $(POMailDetailsArray).each(function (row, n) {
                if ($(t).find("[id^='hdnDNSNo']").val() == n.DNSNo)
                    // $(t).find('input[type=checkbox]').prop('checked', n.Planned);
                    $(t).find('input[type=checkbox]').prop('disabled', n.Planned == "0" ? false : true);
            });
        });

        //$.ajax({
        //    url: "Services/BuildUp/BuildUpProcessService.svc/POMailDNInfo", async: false, type: "POST", dataType: "json", cache: false,
        //    data: JSON.stringify({ GroupFlightSNo: $("#Text_searchFlightNo").data("kendoAutoComplete").key(), ULDStockSNo: ULDStockSNo, MCBookingSNo: MCBookingSNo, Stage: ProcessStage }),
        //    contentType: "application/json; charset=utf-8",
        //    success: function (result) {
        //        var table = JSON.parse(result);
        //        $("#divPOMailDetails").remove();
        //        $("div[id$='divDetail']").append(POMailDetailsDiv);
        //        cfi.PopUp("divPOMailDetails", "PO Mail Details", 500, null, null, 100);
        //        $('div[class="k-window-actions k-header"]').hide();

        //        $('#lblCN38No').text($(input).closest('tr').find('td[data-column="AWBNo"]').text());
        //        $('#lblPlanPcs').text($(input).val());
        //        //$('#lblTotalPcs').text(TotalPcs);
        //        // cfi.PopUp("divPOMailDetails", "");
        //        $(table.Table0).each(function (row, tr) {
        //            $("#bodyPOMailDetails").append('<tr>' + '<input type="hidden" id="hdnMCBookingSNo" value=' + tr.MCBookingSNo + '><input type="hidden" id="hdnULDSNo" value=' + tr.ULDStockSNo + '><input type="hidden" id="hdnDailyFlightSNo" value=' + tr.DailyFlightSNo + '><input type="hidden" id="hdnDNSNo" value=' + tr.DNSNo + '><td class="ui-widget-content"><input type="checkbox" id="chkDNNo" checked=1  ></td><td class="ui-widget-content"><Label id="DNNo">' + tr.DNNo + '</Label></td><td class="ui-widget-content"><Label id="OriginCity">' + tr.OriginCity + '</Label></td><td class="ui-widget-content"><Label id="DestinationCity">' + tr.DestinationCity + '</Label></td><td class="ui-widget-content"><Label id="MailCategory">' + tr.MailCategory + '</Label></td><td class="ui-widget-content"><Label id="SubCategory">' + tr.SubCategory + '</Label></td><td class="ui-widget-content"><Label id="ReceptacleNumber">' + tr.ReceptacleNumber + '</Label></td><td class="ui-widget-content"><Label id="ReceptacleWeight">' + tr.ReceptacleWeight + '</Label></td></tr>')

        //        });

        //        if (moveFromUldArr.length > 0) {
        //            $.each(moveFromUldArr, function (index, val) {
        //                $("#bodyPOMailDetails").append('<tr>' + '<input type="hidden" id="hdnMCBookingSNo" value=' + val.MCBookingSNo + '><input type="hidden" id="hdnULDSNo" value=' + val.ULDStockSNo + '><input type="hidden" id="hdnDailyFlightSNo" value=' + val.DailyFlightSNo + '><input type="hidden" id="hdnDNSNo" value=' + val.DNSNo + '><td class="ui-widget-content"><input type="checkbox" id="chkDNNo" checked=1  ></td><td class="ui-widget-content"><Label id="DNNo">' + val.DNNo + '</Label></td><td class="ui-widget-content"><Label id="OriginCity">' + val.OriginCity + '</Label></td><td class="ui-widget-content"><Label id="DestinationCity">' + val.DestinationCity + '</Label></td><td class="ui-widget-content"><Label id="MailCategory">' + val.MailCategory + '</Label></td><td class="ui-widget-content"><Label id="SubCategory">' + val.SubCategory + '</Label></td><td class="ui-widget-content"><Label id="ReceptacleNumber">' + val.ReceptacleNumber + '</Label></td><td class="ui-widget-content"><Label id="ReceptacleWeight">' + val.ReceptacleWeight + '</Label></td></tr>')

        //            });
        //        }


        //        $("#bodyPOMailDetails").append('<td colspan="8"><input type="button" class="btn btn-block btn-success btn-sm" name="" id="saveDNDetails" style="width:90px;float:right;"value="Save" onclick="SavePoMailDNDetails(' + MCBookingSNo + ',' + ULDStockSNo + ',' + $(input).val() + ')"><input type="button" class="btn btn-block btn-danger btn-sm" name="" id="btnDNSCancel" style="width:90px;float:right;"value="Cancel" onclick=fn_CancelDNDetails(this,"' + ProcessStage + '")></td>');


        //        $("#bodyPOMailDetails tr").each(function (r, t) {
        //            $(POMailDetailsArray).each(function (row, n) {
        //                if ($(t).find("[id^='hdnDNSNo']").val() == n.DNSNo)
        //                    $(t).find('input[type=checkbox]').prop('checked', n.isSelect);
        //            });
        //        });
        //    }
        //});

        $("#divPOMailDetails_wnd_title").closest('div').find('a').hide();

    }

    $("#chkAll").click(function () {
        var checked = $(this).prop('checked');
        $("#divPOMailDetails").find('input:checkbox').prop('checked', checked);

    });
    btnSaveCancelImage();

}

function fn_CancelDNDetails(input, ProcessStage) {
    if (ProcessStage == "") ProcessStage = 'BUILD-UP';

    var nonuldgrid = cfi.GetCFGrid("divNonUldShipmentSection");
    var nonuldgriddatasource = nonuldgrid.dataSource;
    var nonuldgriddata = nonuldgriddatasource.data();
    IsChanged = false;
    //$.each(nonuldgriddata, function (index, val) {

    //    if (MCBkngSNo == val.MCBookingSNo) {
    //        val.IsChanged = false;
    //    }

    //});

    if ($(ClickThis).attr("id") == "txtLPcs")
        ProcessStage = 'BUPOFLD';

    if (ProcessStage == 'BUPOFLD') {
        //$(ClickThis).closest('tr').find('td[data-column="PlannedPieces"] input[type="text"]').val($(ClickThis).closest('tr').find('td[data-column="OLCPieces"]').text());
        fn_CalculateOFLD(ClickThis);
    }
    else {
        // $(ClickThis).closest('tr').find('td[data-column="PlannedPieces"] input[type="text"]').val($(ClickThis).closest('tr').find('td[data-column="TotalPPcs"]').text());
        fn_CalPRE_BuildUp_GVCBM(ClickThis);
    }


    // cfi.ClosePopUp("divPOMailDetails");
    $("#divPOMailDetails").data("kendoWindow").close();
    // $("#divPOMailDetails").remove();
    //$("#divbtnSaveCancelImage").remove();
    //$("#divPOMailDetails_wnd_title").closest('div').remove();
    // $("div[id$='divDetail']").append(POMailDetailsDiv);
}

function fn_CalculateOFLD(input) {
    var flag = false;
    var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");

    var TotalPcsIndex = trRow.find("th[data-field='Pieces']").index();
    var PlannedPiecesIndex = trRow.find("th[data-field='LoadDetail']").index();

    var ActGRWT_Index = trRow.find("th[data-field='WeightDetail']").index();
    var PlanGRWT_Index = trRow.find("th[data-field='LoadDetail']").index();

    var ActGRWT = $(input).closest('tr').find('td:eq(' + ActGRWT_Index + ')').text().split('/')[0];
    var PlannedGRWT = $(input).closest('tr').find('td:eq(' + PlanGRWT_Index + ') input[id="txtLGross"]').val();

    var ActVOLWT = $(input).closest('tr').find('td:eq(' + ActGRWT_Index + ')').text().split('/')[1];
    var PlannedVOLWT = $(input).closest('tr').find('td:eq(' + PlanGRWT_Index + ') input[id="txtLVol"]').val();


    var totalPcs = $(input).closest('tr').find('td:eq(' + TotalPcsIndex + ')').text().split('/')[0];
    var PlannedPcs = $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type="text"][id$="txtLPcs"]').val();

    //var PG = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    //var PV = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    //var PCBM = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');


    if ($(input).val() != "") {
        if ($(input).val() != 0 && $(input).val() > 0) {
            if ($.isNumeric($(input).val())) {


                if ($(input).val() > parseInt(totalPcs)) {
                    ShowMessage('warning', 'Warning -Planned Pieces should be less than Or Equal to Total Pieces', " ", "bottom-right");
                    $(input).val(totalPcs);
                    fn_CalculateOFLD(input);
                    flag = false;
                }
                else {

                    $(input).closest('tr').find('td:eq(' + PlanGRWT_Index + ') input[id="txtLGross"]').val(parseFloat((ActGRWT) / ($(input).closest('tr').find('td:eq(' + TotalPcsIndex + ')').text().split('/')[0]) * totalPcs).toFixed(2));
                    $(input).closest('tr').find('td:eq(' + PlanGRWT_Index + ') input[id="txtLVol"]').val(parseFloat(ActVOLWT / ($(input).closest('tr').find('td:eq(' + TotalPcsIndex + ')').text().split('/')[0]) * totalPcs).toFixed(2));
                    $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type="text"][id$="txtLPcs"]').val(totalPcs);
                    flag = true;
                }
            }
            else {
                // alert("Enter Valid Number");
                ShowMessage('warning', 'Warning - Enter Valid Number ', " ", "bottom-right");
                $(input).val(totalPcs);
                fn_CalculateOFLD(input);
                //fn_CalculatePREGVCBM(input);
                flag = false;

            }
        }
        else {
            $(input).val(totalPcs);
            fn_CalculateOFLD(input);
        }
    }

    // fn_CalculateSplitTotalPcs(input);
    return flag;

}

function fn_CalPRE_BuildUp_GVCBM(input) {
    var flag = false;
    var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");

    var TotalPcsIndex = trRow.find("th[data-field='Pieces']").index();
    var PlannedPiecesIndex = trRow.find("th[data-field='LoadDetail']").index();

    var ActGRWT_Index = trRow.find("th[data-field='WeightDetail']").index();
    var PlanGRWT_Index = trRow.find("th[data-field='LoadDetail']").index();


    var ActGRWT = $(input).closest('tr').find('td:eq(' + ActGRWT_Index + ')').text().split('/')[0];
    var PlannedGRWT = $(input).closest('tr').find('td:eq(' + PlanGRWT_Index + ') input[id="txtGross"]').val();

    var ActVOLWT = $(input).closest('tr').find('td:eq(' + ActGRWT_Index + ')').text().split('/')[1];
    var PlannedVOLWT = $(input).closest('tr').find('td:eq(' + PlanGRWT_Index + ') input[id="txtVol"]').val();


    var totalPcs = $(input).closest('tr').find('td:eq(' + TotalPcsIndex + ')').text().split('/')[0];
    var PlannedPcs = $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type="text"][id$="txtPcs"]').val();

    //var PG = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    //var PV = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    //var PCBM = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');


    if ($(input).val() != "") {
        if ($(input).val() != 0 && $(input).val() > 0) {
            if ($.isNumeric($(input).val())) {


                if ($(input).val() > parseInt(totalPcs)) {
                    ShowMessage('warning', 'Warning -Planned Pieces should be less than Or Equal to Total Pieces', " ", "bottom-right");
                    $(input).val(totalPcs);
                    fn_CalPRE_BuildUp_GVCBM(input);
                    flag = false;
                }
                else {

                    $(input).closest('tr').find('td:eq(' + PlanGRWT_Index + ') input[id="txtGross"]').val(parseFloat((ActGRWT) / ($(input).closest('tr').find('td:eq(' + TotalPcsIndex + ')').text().split('/')[0]) * totalPcs).toFixed(2));
                    $(input).closest('tr').find('td:eq(' + PlanGRWT_Index + ') input[id="txtVol"]').val(parseFloat(ActVOLWT / ($(input).closest('tr').find('td:eq(' + TotalPcsIndex + ')').text().split('/')[0]) * totalPcs).toFixed(2));
                    $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type="text"][id$="txtPcs"]').val(totalPcs);
                    flag = true;
                }
            }
            else {
                // alert("Enter Valid Number");
                ShowMessage('warning', 'Warning - Enter Valid Number ', " ", "bottom-right");
                $(input).val(totalPcs);
                fn_CalPRE_BuildUp_GVCBM(input);
                //fn_CalculatePREGVCBM(input);
                flag = false;

            }
        }
        else {
            $(input).val(totalPcs);
            fn_CalPRE_BuildUp_GVCBM(input);
        }
    }

    // fn_CalculateSplitTotalPcs(input);
    return flag;

}

function removeValueFromArray(Arr, key, value) {
    for (var i = Arr.length - 1; i >= 0; i--) {
        if (Arr[i][key] == value) {
            Arr.splice(i, 1)
        }
    }
}

var POMailDetailsArray = [];
var LyingListPOMailDetailsArray = [];

//var isSelectDNSNo = false;



function SavePoMailDNDetails(MCBookingSNo, ULDStockSNo, PlanPcs, IsFromLying) {



    if ($("#bodyPOMailDetails tr td input:checked").not(":disabled").length != PlanPcs) {
        ShowMessage('warning', 'Warning - POMail Details  ', "Selected DN should be equal to Plan Piece!", "bottom-right");
    }
    else {
        removeValueFromArray(POMailDetailsArray, 'MCBookingSNo', MCBookingSNo);
        //if (IsFromLying == 0) {
        $("div[id$='divPOMailDetails']").find("[id^='bodyPOMailDetails']").find("tr").each(function () {
            POMailDetailsArray.push({
                isSelect: $(this).find("[id^='chkDNNo']").prop('checked') == true ? 1 : 0,
                GroupFlightSNo: $("#Text_searchFlightNo").data("kendoAutoComplete").key(),
                DailyFlightSNo: dailyflightsno.split(',')[0],
                MCBookingSNo: $(this).find("[id^='hdnMCBookingSNo']").val(),
                ULDStockSNo: $(this).find("[id^='hdnULDSNo']").val(),
                DNSNo: $(this).find("[id^='hdnDNSNo']").val(),
                OriginCity: $(this).find("[id^='OriginCity']").text(),
                DestinationCity: $(this).find("[id^='DestinationCity']").text(),
                MailCategory: $(this).find("[id^='MailCategory']").text(),
                SubCategory: $(this).find("[id^='SubCategory']").text(),
                ReceptacleNumber: $(this).find("[id^='ReceptacleNumber']").text(),
                ReceptacleWeight: $(this).find("[id^='ReceptacleWeight']").text(),
                Planned: $(this).find("[id^='hdnPlanned']").val(),
                DNNo: $(this).find("[id^='DNNo']").text()
            });

        });


        //}
        //else {

        //    $("div[id$='divPOMailDetails']").find("[id^='bodyPOMailDetails']").find("tr").each(function () {
        //        LyingListPOMailDetailsArray.push({
        //            isSelect: $(this).find("[id^='chkDNNo']").prop('checked') == true ? 1 : 0,
        //            GroupFlightSNo: $("#Text_searchFlightNo").data("kendoAutoComplete").key(),
        //            DailyFlightSNo: $(this).find("[id^='hdnDailyFlightSNo']").val(),
        //            MCBookingSNo: $(this).find("[id^='hdnMCBookingSNo']").val(),
        //            ULDStockSNo: $(this).find("[id^='hdnULDSNo']").val(),
        //            DNSNo: $(this).find("[id^='hdnDNSNo']").val(),
        //            OriginCity: $(this).find("[id^='OriginCity']").text(),
        //            DestinationCity: $(this).find("[id^='DestinationCity']").text(),
        //            MailCategory: $(this).find("[id^='MailCategory']").text() ,
        //            SubCategory: $(this).find("[id^='SubCategory']").text(),
        //            ReceptacleNumber: $(this).find("[id^='ReceptacleNumber']").text(),
        //            ReceptacleWeight: $(this).find("[id^='ReceptacleWeight']").text(),
        //            Planned: $(this).find("[id^='hdnPlanned']").val(),
        //            DNNo: $(this).find("[id^='DNNo']").text()
        //        });

        //    });

        //}
        $("#divPOMailDetails").data("kendoWindow").close();
        // isSelectDNSNo = true;
    }
}
var McBookingSNoMoveFromUld = "";
function bindCheckAWB() {
    $("#div__0 table tr").each(function () {
        $("#chkAWB").unbind("click").bind("click", function () {

            if ($(this).is(":checked") == true) {

                //var vgrid = cfi.GetCFGrid("divUldShipmentSection");
                //var IsULDPreManifested = false;
                //$.each(vgrid._data, function (i, item_Data) {
                //    if (item_Data.ULDStatus == "PRE" && vgrid.options.parentValue.toString() == 0) {
                //        IsULDPreManifested = true;
                //        SelectedULDNo = item_Data.ULDNo;
                //        return false;
                //    }
                //});
                //if (IsULDPreManifested == true) {
                //    ShowMessage('warning', 'Information', "'" + SelectedULDNo + "' is already Pre-Manifested. Cannot move shipments.", "bottom-right");
                //    $(this).prop("checked", false);
                //    return;
                //}




                var trRow = $(this).closest("div.k-grid").find("div.k-grid-header");
                var McBookingSNoIndex = trRow.find("th[data-field='MCBookingSNo']").index();
                McBookingSNoMoveFromUld = $(this).closest('tr').find("td:eq(" + McBookingSNoIndex + ")").text();
            }
        });
    });
}

//var bupArr = [];
//var moveFromUldPoMailDetails = [];
//function bindCheckAWB() {
//    $("#div__0 table tr").each(function () {
//        $("#chkAWB").unbind("click").bind("click", function () {

//            if ($("#chkAWB").is(":checked") == true) {
//                var trRow = $(this).closest("div.k-grid").find("div.k-grid-header");
//                var McBookingSNoIndex = trRow.find("th[data-field='MCBookingSNo']").index();
//                McBookingSNo =$(this).closest('tr').find("td:eq(" + McBookingSNoIndex + ")").text();



//                $.ajax({
//                    url: "Services/BuildUp/BuildUpProcessService.svc/POMailDNInfo", async: false, type: "POST", dataType: "json", cache: false,
//                    data: JSON.stringify({ GroupFlightSNo: $("#Text_searchFlightNo").data("kendoAutoComplete").key(), ULDStockSNo: 0, MCBookingSNo: McBookingSNo, Stage: "BUILD" }),
//                    contentType: "application/json; charset=utf-8",
//                    success: function (result) {
//                        var table = JSON.parse(result);
//                        $.each(table.Table0, function (index, val) {
//                            bupArr.push({
//                                isSelect: 0,
//                                GroupFlightSNo: val.DailyFlightSNo,
//                                DailyFlightSNo: val.DailyFlightSNo,
//                                MCBookingSNo: val.MCBookingSNo,
//                                ULDStockSNo: 0,
//                                DNSNo: val.DNSNo

//                            });
//                            moveFromUldPoMailDetails.push({
//                                MCBookingSNo: val.MCBookingSNo,
//                                ULDStockSNo: val.ULDStockSNo,
//                                DailyFlightSNo: val.DailyFlightSNo,
//                                DNSNo: val.DNSNo,
//                                DNNo: val.DNNo,
//                                OriginCity: val.OriginCity,
//                                DestinationCity: val.DestinationCity,
//                                MailCategory: val.MailCategory,
//                                SubCategory:val.SubCategory,
//                                ReceptacleNumber:val.ReceptacleNumber,
//                                ReceptacleWeight:val.ReceptacleWeight
//                            });


//                        });
//                    },
//                    error: function (error) {
//                    }

//                });
//            }
//            else {
//                bupArr = [];
//            }
//        });
//    });


//}


function getDNDetails() {

    //var trRow = $(this).closest("div.k-grid").find("div.k-grid-header");
    //var McBookingSNoIndex = trRow.find("th[data-field='MCBookingSNo']").index();
    //McBookingSNo = $(this).closest('tr').find("td:eq(" + McBookingSNoIndex + ")").text();
    $.ajax({
        url: "Services/BuildUp/BuildUpProcessService.svc/POMailDNInfo", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ GroupFlightSNo: $("#Text_searchFlightNo").data("kendoAutoComplete").key(), ULDStockSNo: 0, MCBookingSNo: 0, Stage: "BUILD-UP" }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            POMailDetailsArray = [];
            var table = JSON.parse(result);
            $.each(table.Table0, function (index, val) {
                POMailDetailsArray.push({
                    MCBookingSNo: val.MCBookingSNo,
                    ULDStockSNo: val.ULDStockSNo,
                    GroupFlightSNo: $("#Text_searchFlightNo").data("kendoAutoComplete").key(),
                    DailyFlightSNo: dailyflightsno.split(',')[0],
                    DNSNo: val.DNSNo,
                    DNNo: val.DNNo,
                    OriginCity: val.OriginCity,
                    DestinationCity: val.DestinationCity,
                    MailCategory: val.MailCategory,
                    SubCategory: val.SubCategory,
                    ReceptacleNumber: val.ReceptacleNumber,
                    ReceptacleWeight: val.ReceptacleWeight,
                    Planned: val.Planned,
                    isSelect: 0
                });

            });
        },
        error: function (error) {
        }

    });
}
$(window).unload(function () {
    SaveUpdateLockedProcess(0, $("#searchFlightNo").val(), "", "", userContext.UserSNo, 30, "", "", "");
});
window.onbeforeunload = function () {
    SaveUpdateLockedProcess(0, $("#searchFlightNo").val(), "", "", userContext.UserSNo, 30, "", "", "");
}

function fnMoveToLyingList(input) {
    var IsPreTobeRefersh = false;

    //var predata = jQuery.grep(processList, function (n, i) {
    //    return (n.GroupFlightSNo == $("#Text_searchFlightNo").data("kendoAutoComplete").key() && n.ProcessSNo == 33 && n.EventType == "SAVE");
    //});
    //var preTime = predata.length > 0 ? predata[0].ProcessSaveTime : null;
    //var BUPdata = jQuery.grep(processList, function (n, i) {
    //    return (n.GroupFlightSNo == $("#Text_searchFlightNo").data("kendoAutoComplete").key() && n.ProcessSNo == 30 && (new Date(preTime) > new Date(n.ProcessOpenTime) && new Date(preTime) < new Date()));
    //});
    //if (predata.length > 0 && BUPdata.length > 0) { IsPreTobeRefersh = true }
    //else {
    //    signalR.updateProcessStatus({
    //        GroupFlightSNo: $("#Text_searchFlightNo").data("kendoAutoComplete").key(), ProcessSNo: 30, EventType: 'SAVE'
    //    });
    //}

    //if (IsPreTobeRefersh) {
    //    ShowMessage('warning', 'Warning', "Some changes have been made at Premanifest. Kindly refresh the page to proceed with Buildup.", "bottom-right");
    //    return;
    //}


    if (IsFlightPremanifested == "true") {
        showmessage('warning', 'information', "flight is already pre-manifested", "bottom-right");
        return false;
    }

    var awbsno = input.id.split('_')[2];
    //  checkHoldshipmentForMovetolying(awbsno, 0);
    var holdStatus = 0;
    $.ajax({
        url: "Services/BuildUp/BuildUpProcessService.svc/CheckOnHoldShipment", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ AWBSNo: awbsno, McBookingSNo: 0 }),
        success: function (result) {
            if (result) {
                var Data = jQuery.parseJSON(result);
                if (Data.Table1[0].Result.split('?')[1] == '1') {
                    holdStatus = 1;

                } else { holdStatus = 0; }
            }

        }
    });

    if (holdStatus == 1 && input.id.split('_')[0] == "AWB") { ShowMessage('warning', 'Information', "Shipment has not yet arrived at station. Cannot be pushed into Lying List"); } else {

        var IsCStatus, ULDNO = '';
        var UldStockSNoVal = input.id.split('_')[1].trim();



        var vgrid = cfi.GetCFGrid("divUldShipmentSection");
        $.each(vgrid._data, function (i, item_Data) {
            if (item_Data.ULDStockSNo == UldStockSNoVal) {
                IsCStatus = (item_Data.IsCart == "true" || item_Data.IsCart == "1") ? "Cart" : "ULD";
                ULDNO = item_Data.ULDNo;
                // return false;
            }
        });

        $("#divMovetoLyingPopUP").html("");
        if (input.id.split('_')[0] == "AWB") {
            $("#divMovetoLyingPopUP").html('<div id="divWindow1"></div>');
            if ($("#divWindow1").length > 0)
                $("#divWindow1").html('<table validateonsubmit="true" class="WebFormTable" ><tr><td class="formlabel" style="font-size: 14px;text-align:left;"><b> AWB  would be completely pushed into Lying List/Off-Load. Do you wish to continue ?</b></td></tr></table>')

        }
        else if (IsCStatus == 'Cart' || (ULDNO == 'BULK' && input.id.split('_')[0] != "AWB")) {
            $("#divMovetoLyingPopUP").html('<div id="divWindow1"></div>');
            if ($("#divWindow1").length > 0)
                $("#divWindow1").html('<table validateonsubmit="true" class="WebFormTable" ><tr><td class="formlabel" style="font-size: 14px;text-align:left;"><b> ' + (input.id.split('_')["0"] == 'BULK' ? '' : IsCStatus) + ' ' + ULDNO + '  would be completely pushed into Lying List/Off-Load as built unit. Do you wish to continue ?</b></td></tr></table>')
        }

        else {
            $("#divMovetoLyingPopUP").html('<div id="divWindow1"></div>');

            if ($("#divWindow1").length > 0)
                $("#divWindow1").html('<table validateonsubmit="true" class="WebFormTable" ><tr><td class="formlabel" style="font-size: 14px;text-align:left;"><b> ' + (input.id.split('_')["0"] == 'BULK' ? '' : IsCStatus) + ' ' + ULDNO + '  would be completely pushed into Lying List/Off-Load. Do you wish to continue ?</b></td></tr></table>')

        }
        $("#divWindow1").dialog({
            autoResize: true,
            maxWidth: 510,
            maxHeight: 250,
            width: 500,
            height: 200,
            modal: true,
            title: 'Confirmation',
            draggable: false,
            resizable: false,
            buttons:
            {
                'Yes': function () {
                    $(this).dialog('close');

                    $(this).find("#yes").click();

                    var pieces = 0
                    var grossWeight = 0;
                    var volume = 0;
                    var CBM = 0;
                    var inputId = "#" + input.id;
                    var piecesBefore = 0;
                    var grossWeightBefore = 0;
                    var volumeBefore = 0;
                    var CBMBefore = 0;
                    var isPlanned = $(inputId).closest('td').next().text();
                    var TotalPieces = 0;
                    var recordSNo = 0;
                    if (isPlanned == '') { isPlanned = 1 }
                    if ($(input).closest('tr').find('[id="txtPcs"]').length > 0) {
                        piecesBefore = $(input).closest('tr').find("td:eq(" + $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header").find("th[data-field='Pieces']").index() + ")").text().split('/')[0];
                        TotalPieces = $(input).closest('tr').find("td:eq(" + $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header").find("th[data-field='Pieces']").index() + ")").text().split('/')[1];
                        var PreviousGrossVolumeCBM = $(input).closest('tr').find("td:eq(" + $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header").find("th[data-field='WeightDetail']").index() + ")").text().split('/');
                        grossWeightBefore = PreviousGrossVolumeCBM[0].trim();
                        volumeBefore = PreviousGrossVolumeCBM[1].trim();
                        CBMBefore = PreviousGrossVolumeCBM[2].trim();
                        pieces = $(input).closest('tr').find('[id="txtPcs"]').val().trim();
                        grossWeight = $(input).closest('tr').find('[id="txtGross"]').val().trim();
                        volume = $(input).closest('tr').find('[id="txtVol"]').val().trim();
                        CBM = $(input).closest('tr').find("td:eq(" + $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header").find("th[data-field='CBM']").index() + ")").text();
                    }

                    var ShipmentType = input.id.split('_')[0].trim();
                    var UldStockSNo = input.id.split('_')[1].trim();
                    var ShipmentNo = input.id.split('_')[2].trim();
                    if (ShipmentType == 'AWB') {
                        recordSNo = input.id.split('_')[3].trim();
                    }

                    if (ShipmentType == 'ULD' || ShipmentType == 'BULK') {
                        if (processeduldshipmentCheck.length > 0) {
                            var processeduldshipmentMoveToLying = [];
                            var processeduldshipmentBefore = [];
                            var detailgrid = cfi.GetNestedCFGrid("div__" + UldStockSNo.toString());
                            if (detailgrid != undefined) {
                                var detaildatasource = detailgrid.dataSource;
                                var detaildata = detaildatasource.data();
                                $.each(detaildata, function (i, item) {
                                    if (item && item.ULDStockSNo == UldStockSNo) {
                                        var UldModel = {
                                            ULDStockSNo: UldStockSNo,
                                            AWBSNo: item.AWBSno,
                                            Pieces: item.Pieces,
                                            GrossWeight: item.GrossWeight,
                                            VolumeWeight: item.VolumeWeight
                                        }
                                        processeduldshipmentMoveToLying.push(UldModel);
                                    }
                                });
                            }
                            $.each(processeduldshipmentCheck, function (i, item) {
                                if (item && item.ULDStockSNo == UldStockSNo) {
                                    var UldModel = {
                                        ULDStockSNo: UldStockSNo,
                                        AWBSNo: item.AWBSNo,
                                        Pieces: item.Pieces,
                                        GrossWeight: item.GrossWeight,
                                        VolumeWeight: item.VolumeWeight
                                    }
                                    processeduldshipmentBefore.push(UldModel);
                                }
                            });
                            if (processeduldshipmentBefore.length != processeduldshipmentMoveToLying.length) {
                                ShowMessage('warning', 'Warning - Move Shipment', "Kindly refresh the page to move all shipments to Lying List at once or try to move one shipment at a time.", "bottom-right");
                                return;
                            }
                            else {
                                var isCorrect = 1;
                                for (var i = 0; i < processeduldshipmentMoveToLying.length; i++) {
                                    for (var j = 0; j < processeduldshipmentBefore.length; j++) {
                                        if (processeduldshipmentBefore[i].AWBSNo == processeduldshipmentMoveToLying[j].AWBSNo) {
                                            if (processeduldshipmentBefore[i].Pieces != processeduldshipmentMoveToLying[j].Pieces) {
                                                isCorrect = 0;
                                            }
                                        }
                                        else {
                                            isCorrect = 1;
                                        }
                                    }
                                }
                                if (isCorrect == 0) {
                                    ShowMessage('warning', 'Warning - Move Shipment', "Pieces Not Matched.", "bottom-right");
                                    return;
                                }
                            }
                        }
                    }
                    if (ShipmentType == "ULD") {
                        /*Check and Locked AWB Coded By Brajendra On Aug-16-2017*/
                        var msg = GetAWBLockedEvent(userContext.UserSNo, 0, 0, "", "", UldStockSNo, "30");
                        if (msg == "Fail") { return false };

                        SaveUpdateLockedProcess(0, "", "", "", userContext.UserSNo, "31", 'FlightBuildUp', 1, UldStockSNo);
                        /*End*/
                    } else {
                        if (ShipmentType == 'AWB') {
                            recordSNo = input.id.split('_')[3].trim();
                            /*Check and Locked AWB Coded By Brajendra On May-28-2017*/
                            var msg = GetAWBLockedEvent(userContext.UserSNo, recordSNo, 0, "", "", "30");
                            if (msg == "Fail") { $(this).attr("checked", false); return false };
                            SaveUpdateLockedProcess(recordSNo, "", "", "", userContext.UserSNo, "31", 'FlightBuildUp', 1, "");

                            /*End*/
                        } else {
                            for (var i = processeduldshipmentMoveToLying - 1; i >= 0; i--) {


                                /*Unlocked AWBNo when move to non uld section --Brajendra*/
                                SaveUpdateLockedProcess(processeduldshipmentMoveToLying[i].AWBSno, "", "", "", userContext.UserSNo, "31", "FlightBuildUp", "", "");

                            }


                        }
                    }

                    $.ajax({
                        url: "Services/BuildUp/BuildUpProcessService.svc/MoveToLyingList", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
                        data: JSON.stringify({ DailyFlightSNo: dailyflightsno, ShipmentType: ShipmentType, ShipmentNo: ShipmentNo, recordSNo: recordSNo, UldStockSNo: parseInt(UldStockSNo), Pieces: parseInt(pieces), GrossWeight: grossWeight, Volume: volume, CBM: CBM, IsPlanned: isPlanned }),
                        success: function (result) {
                            if (result != null && result != "") {
                                var MsgTable = jQuery.parseJSON(result);
                                var MsgData = MsgTable.Table0;
                                if (MsgData.length > 0) {
                                    if (MsgData[0].MessageNumber == '1') {
                                        BuildupSearch();
                                        ShowMessage('success', 'Success - Move Shipment', MsgData[0].Message, "bottom-right");
                                        if (ShipmentType == 'ULD' || ShipmentType == 'BULK') {
                                            $(input).closest('tr').hide();
                                            MoveULDFromLying(inputId);
                                        }
                                        else if (ShipmentType == 'AWB' && isPlanned == 1 && pieces == 0 && MsgData[0].NoOfRecordsLeft == '0') {
                                            $(input).closest('tr').hide();
                                            var parentDivId = "#div__" + UldStockSNo;
                                            $(parentDivId).hide();
                                            var parentControlId = (UldStockSNo > 0) ? '#ULD_' + UldStockSNo + '_' + UldStockSNo : '#BULK_' + UldStockSNo + '_' + UldStockSNo;
                                            $(parentControlId).closest('tr').hide();
                                            MoveULDFromLying(parentControlId);
                                        }
                                        else {
                                            if (isPlanned == 1 && pieces == 0) {
                                                var $tr = $(inputId).closest('tr');
                                                var g = cfi.GetNestedCFGrid("div__" + UldStockSNo.toString());
                                                var itm = g.dataItem($tr);
                                                g.dataSource.remove(itm);
                                                if (UldStockSNo == 0) {
                                                    IsOffloadFromBulk = 1;
                                                }
                                                $(input).closest('tr').remove();
                                                $("input[id^='Text_AWBOffPoint']").closest("td").hide();
                                            }
                                            else {
                                                if (piecesBefore == pieces) {
                                                    var $tr = $(inputId).closest('tr');
                                                    var g = cfi.GetCFGrid("divNonUldShipmentSection");
                                                    var itm = g.dataItem($tr);
                                                    g.dataSource.remove(itm);
                                                    $(input).closest('tr').remove();
                                                }
                                                else {
                                                    var currentIndex = $(input).closest('tr').index();
                                                    //$(input).closest('tr').find('[id="txtPcs"]').val(piecesBefore - pieces);
                                                    //$(input).closest('tr').find('[id="txtGross"]').val(grossWeightBefore - grossWeight);
                                                    //$(input).closest('tr').find('[id="txtVol"]').val(volumeBefore - volume);
                                                    //$(input).closest('tr').find("td:eq(" + $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header").find("th[data-field='CBM']").index() + ")").text(CBMBefore - CBM);
                                                    //$(input).closest('tr').find("td:eq(" + $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header").find("th[data-field='Pieces']").index() + ")").text(piecesBefore - pieces + "/" + TotalPieces);

                                                    var trUldHeader = $("#divUldShipmentSection").find(".k-grid-header");

                                                    uldusedindex = trUldHeader.find("th[data-field='Used']").index();
                                                    uldtotalship = trUldHeader.find("th[data-field='Shipments']").index();

                                                    var trHeader = $("#divNonUldShipmentSection").find(".k-grid-header");

                                                    var awbpcsindex = -1;
                                                    var awbgrwtindex = -1;
                                                    var awbvolwtindex = -1;

                                                    var pcsindex = -1;
                                                    var grwtindex = -1;
                                                    var volwtindex = -1;
                                                    var lipcsindex = -1;
                                                    var loaddetailindex = -1;
                                                    var weightdetailindex = -1;
                                                    var CBMIndex = -1;

                                                    pcsindex = trHeader.find("th[data-field='LoadPieces']").index();
                                                    grwtindex = trHeader.find("th[data-field='LoadGrossWeight']").index();
                                                    volwtindex = trHeader.find("th[data-field='LoadVol']").index();

                                                    awbpcsindex = trHeader.find("th[data-field='Pieces']").index();
                                                    awbgrwtindex = trHeader.find("th[data-field='GrossWeight']").index();
                                                    awbvolwtindex = trHeader.find("th[data-field='VolumeWeight']").index();
                                                    lipcsindex = trHeader.find("th[data-field='LIPieces']").index();
                                                    loaddetailindex = trHeader.find("th[data-field='LoadDetail']").index();
                                                    weightdetailindex = trHeader.find("th[data-field='WeightDetail']").index();
                                                    var CBMIndex = trHeader.find("th[data-field='CBM']").index();

                                                    var nonuldgrid = cfi.GetCFGrid("divNonUldShipmentSection");
                                                    var nonuldgriddatasource = nonuldgrid.dataSource;
                                                    var nonuldgriddata = nonuldgriddatasource.data();

                                                    var trIndex = undefined;
                                                    var selectedShipmentCount = 0;
                                                    var invalidshipment = "";
                                                    var successshipment = "";
                                                    var successshipmentSNo = "";
                                                    var alreadyonuldship = "";
                                                    var notabletoprocessship = "";
                                                    var uldmasterrow = undefined;
                                                    var ulddataitem = undefined;
                                                    var _sphc = "";

                                                    $("#divNonUldShipmentSection").find(".k-grid-content").find("input[type='checkbox']").each(function () {
                                                        if ($(this).closest("tr").index() == currentIndex) {
                                                            var closestTr = $(this).closest("tr");

                                                            var pcsControl = closestTr.find("td:eq(" + loaddetailindex + ")").find("input[type='text'][id='txtPcs']");
                                                            var grControl = closestTr.find("td:eq(" + loaddetailindex + ")").find("input[type='text'][id='txtGross']");
                                                            var volControl = closestTr.find("td:eq(" + loaddetailindex + ")").find("input[type='text'][id='txtVol']");

                                                            var uldpcs = parseInt(pcsControl.val());
                                                            var uldgr = parseFloat(parseFloat(grControl.val()).toFixed(1));
                                                            var uldvol = parseFloat(parseFloat(volControl.val()).toFixed(2));
                                                            var uldCBM = parseFloat(parseFloat(closestTr.find("td:eq(" + CBMIndex + ")").text()).toFixed(3));
                                                            debugger;
                                                            trIndex = $(this).closest("tr").index();

                                                            var avl_pcs = closestTr.find("td:eq(" + awbpcsindex + ")").text().split('/')[0];
                                                            var avl_grwt = closestTr.find("td:eq(" + weightdetailindex + ") ").text().split('/')[0];
                                                            var avl_volwt = closestTr.find("td:eq(" + weightdetailindex + ") ").text().split('/')[1];
                                                            var avl_CBM = closestTr.find("td:eq(" + weightdetailindex + ") ").text().split('/')[2];

                                                            if (uldpcs > 0) {
                                                                var isValidShipment = true;
                                                                var CheckedAWBSNo = nonuldgriddata[trIndex].AWBSNo;

                                                                if (isValidShipment) {
                                                                    var alreadyonulddata = $.grep(executedship, function (e, index) {
                                                                        if (e.FromTableSNo == nonuldgriddata[trIndex].FromTableSNo && e.FromTable != 3 && e.FromTable == nonuldgriddata[trIndex].FromTable && e.AWBSNo == nonuldgriddata[trIndex].AWBSNo && e.FromTableTotalPieces < e.ExecutedPieces + uldpcs) {
                                                                            return e;
                                                                        }
                                                                    });
                                                                    if (alreadyonulddata.length == 0) {
                                                                        var alreadyexecuteddata = $.grep(executedship, function (e, index) {
                                                                            if (e.FromTableSNo == nonuldgriddata[trIndex].FromTableSNo && e.FromTable != 3 && e.FromTable == nonuldgriddata[trIndex].FromTable && e.AWBSNo == nonuldgriddata[trIndex].AWBSNo) {
                                                                                e.ExecutedPieces = e.ExecutedPieces + uldpcs;
                                                                                return e;
                                                                            }
                                                                        });

                                                                        var ToUldShipmentModel = {
                                                                            AWBSno: nonuldgriddata[trIndex].AWBSNo,
                                                                            FPSNo: nonuldgriddata[trIndex].FPSNo,
                                                                            AwbNo: nonuldgriddata[trIndex].AWBNo,
                                                                            Pieces: uldpcs,
                                                                            GrossWeight: uldgr,
                                                                            VolumeWeight: uldvol,
                                                                            SPHC: nonuldgriddata[trIndex].SPHC,
                                                                            ULDStockSNo: 0,
                                                                            FromTable: nonuldgriddata[trIndex].FromTable,
                                                                            FromTableSNo: nonuldgriddata[trIndex].FromTableSNo,
                                                                            FromTableTotalPieces: nonuldgriddata[trIndex].LIPieces,
                                                                            ShipmentDetail: nonuldgriddata[trIndex].ShipmentDetail,
                                                                            AWBPieces: nonuldgriddata[trIndex].AWBPieces,
                                                                            AWBGrossWeight: nonuldgriddata[trIndex].AWBGrossWeight,
                                                                            AWBVolumeWeight: nonuldgriddata[trIndex].AWBVolumeWeight,
                                                                            OffloadStage: nonuldgriddata[trIndex].OffloadStage,
                                                                            AWBOffPoint: "",
                                                                            ConnectingFlight: "",
                                                                            MCBookingSNo: nonuldgriddata[trIndex].MCBookingSNo,
                                                                            ShipmentType: nonuldgriddata[trIndex].ShipmentType,
                                                                            Status: nonuldgriddata[trIndex].Status,
                                                                            AWBCBM: parseFloat(nonuldgriddata[trIndex].AWBCBM).toFixed(3),
                                                                            CBM: uldCBM,
                                                                            IsPlanned: nonuldgriddata[trIndex].IsPlanned,
                                                                            ShipmentId: nonuldgriddata[trIndex].IsPlanned == '0' ? 'UnPlanned_0_0_0' : nonuldgriddata[trIndex].ShipmentId,
                                                                            Priority: nonuldgriddata[trIndex].Priority,
                                                                            //Action: nonuldgriddata[trIndex].IsAction
                                                                            //Action: nonuldgriddata[trIndex].Action == '0' ? '' : '<a id="' + nonuldgriddata[trIndex].ShipmentId + '" onclick=\"fnMoveToLyingList(this);\"><i class=\"fa fa-mail-forward\" style=\"font-size:15px;\" title=\"Move to Lying List\"></i></a>'
                                                                            Action: nonuldgriddata[trIndex].Action
                                                                            //IsChanged: nonuldgriddata[trIndex].IsChanged,
                                                                            //OffloadStage: nonuldgriddata[trIndex].OffloadStage
                                                                        }
                                                                        processedawb = [];
                                                                        var alreadyprsulddata = $.grep(processedawb, function (e, index) {
                                                                            if (e.FromTableSNo == nonuldgriddata[trIndex].FromTableSNo && e.FromTable == nonuldgriddata[trIndex].FromTable && e.AWBSno == nonuldgriddata[trIndex].AWBSNo && e.ULDStockSNo == cdatasource.options.parentValue) {
                                                                                return e;
                                                                            }
                                                                        });
                                                                        if (alreadyprsulddata.length == 0) {
                                                                            processedawb.push(ToUldShipmentModel);
                                                                        }
                                                                        else {
                                                                            var alreadyprsship = $.grep(processedawb, function (e, index) {
                                                                                if (e.FromTableSNo == nonuldgriddata[trIndex].FromTableSNo && e.FromTable == nonuldgriddata[trIndex].FromTable && e.AWBSno == nonuldgriddata[trIndex].AWBSNo && e.ULDStockSNo == cdatasource.options.parentValue) {
                                                                                    e.Pieces = e.Pieces + uldpcs;
                                                                                    e.GrossWeight = parseFloat(e.GrossWeight + uldgr).toFixed(1);
                                                                                    e.VolumeWeight = parseFloat(e.VolumeWeight + uldvol).toFixed(2);
                                                                                    e.CBM = parseFloat(parseFloat(e.CBM) + parseFloat(uldCBM)).toFixed(3);
                                                                                    e.IsPlanned = e.IsPlanned,
                                                                                        e.ShipmentId = e.IsPlanned == '0' ? 'UnPlanned_0_0_0' : e.ShipmentId,
                                                                                        //e.Action = e.IsAction
                                                                                        //e.Action = e.Action == '0' ? '' : '<a id="' + e.ShipmentId + '" onclick=\"fnMoveToLyingList(this);\"><i class=\"fa fa-mail-forward\" style=\"font-size:15px;\" title=\"Move to Lying List\"></i></a>'
                                                                                        e.Action = e.Action
                                                                                    return e;
                                                                                }
                                                                            });

                                                                        }
                                                                        if (alreadyexecuteddata.length == 0) {
                                                                            var ship = {
                                                                                AWBSNo: nonuldgriddata[trIndex].AWBSNo,
                                                                                FromTable: nonuldgriddata[trIndex].FromTable,
                                                                                FromTableSNo: nonuldgriddata[trIndex].FromTableSNo,
                                                                                FromTableTotalPieces: nonuldgriddata[trIndex].LIPieces,
                                                                                ExecutedPieces: uldpcs,
                                                                                //IsPlanned: '0'
                                                                                //ShipmentId: 'UnPlanned_0'
                                                                                IsPlanned: nonuldgriddata[trIndex].IsPlanned,
                                                                                ShipmentId: nonuldgriddata[trIndex].IsPlanned == '0' ? 'UnPlanned_0_0_0' : nonuldgriddata[trIndex].ShipmentId,
                                                                                //Action: nonuldgriddata[trIndex].IsAction
                                                                                //Action: nonuldgriddata[trIndex].Action == '0' ? '' : '<a id="' + nonuldgriddata[trIndex].ShipmentId + '" onclick=\"fnMoveToLyingList(this);\"><i class=\"fa fa-mail-forward\" style=\"font-size:15px;\" title=\"Move to Lying List\"></i></a>'
                                                                                Action: nonuldgriddata[trIndex].Action
                                                                            };
                                                                            executedship.push(ship);
                                                                        }
                                                                        var nonulddata = nonuldgriddata[trIndex];
                                                                        for (var i = processedawb.length - 1; i >= 0; i--) {
                                                                            if (processedawb[i].FromTableSNo == nonulddata.FromTableSNo && processedawb[i].FromTable == nonulddata.FromTable && processedawb[i].AWBSno == nonulddata.AWBSNo && processedawb[i].ULDStockSNo == -1) {
                                                                                processedawb.splice(i, 1);
                                                                            }
                                                                        }
                                                                        var remainingPcs = parseInt(nonulddata.Pieces.split('/')[0]) - parseInt(ToUldShipmentModel.Pieces);
                                                                        var gr_wt = 0, vol_wt = 0, CBM_wt = 0;
                                                                        if (remainingPcs > 0) {
                                                                            nonulddata.Pieces = remainingPcs.toString() + "/" + nonulddata.AWBPieces;

                                                                            /*********Added By Haider************************/

                                                                            var totalGrossWt = 0, totalVolWt = 0, totalCBM = 0;

                                                                            totalGrossWt = parseFloat(ToUldShipmentModel.AWBGrossWeight);
                                                                            totalVolWt = parseFloat(ToUldShipmentModel.AWBVolumeWeight);
                                                                            totalCBM = parseFloat(ToUldShipmentModel.AWBCBM);



                                                                            gr_wt = (parseFloat(ToUldShipmentModel.AWBGrossWeight) - ToUldShipmentModel.GrossWeight).toFixed(1);
                                                                            vol_wt = (parseFloat(ToUldShipmentModel.AWBVolumeWeight) - ToUldShipmentModel.VolumeWeight).toFixed(2);
                                                                            CBM_wt = parseFloat(parseFloat(ToUldShipmentModel.AWBCBM) - parseFloat(ToUldShipmentModel.CBM)).toFixed(3);
                                                                            nonulddata.AWBGrossWeight = gr_wt;
                                                                            nonulddata.AWBVolumeWeight = vol_wt;
                                                                            nonulddata.AWBCBM = CBM_wt;
                                                                            /***********************************************/

                                                                            nonulddata.GrossWeight = (parseFloat(nonulddata.GrossWeight) - parseFloat(ToUldShipmentModel.GrossWeight)).toFixed(1);
                                                                            nonulddata.VolumeWeight = (parseFloat(nonulddata.VolumeWeight) - parseFloat(ToUldShipmentModel.VolumeWeight)).toFixed(2);
                                                                            nonulddata.CBM = parseFloat(parseFloat(nonulddata.CBM) - parseFloat(ToUldShipmentModel.CBM)).toFixed(3);
                                                                            //nonulddata.IsPlanned = '0';
                                                                            //nonulddata.ShipmentId = 'UnPlanned_0'
                                                                            nonulddata.IsPlanned = nonulddata.IsPlanned;
                                                                            nonulddata.ShipmentId = nonulddata.IsPlanned == '0' ? 'UnPlanned_0_0_0' : nonulddata.ShipmentId

                                                                            closestTr.find("td:eq(" + weightdetailindex + ") ").text(nonulddata.AWBGrossWeight + "/" + nonulddata.AWBVolumeWeight + "/" + nonulddata.AWBCBM);

                                                                            closestTr.find("td:eq(" + awbpcsindex + ")").text(nonulddata.Pieces);
                                                                            grControl.val(parseFloat(nonulddata.GrossWeight).toFixed(1));
                                                                            volControl.val(parseFloat(nonulddata.VolumeWeight).toFixed(2));
                                                                            pcsControl.val(remainingPcs.toString());

                                                                            closestTr.find("td:eq(" + CBMIndex + ") ").text(parseFloat(nonulddata.CBM).toFixed(3));

                                                                            closestTr.find("td:eq(" + grwtindex + ") ").text(parseFloat(nonulddata.GrossWeight).toFixed(1));
                                                                            closestTr.find("td:eq(" + volwtindex + ") ").text(parseFloat(nonulddata.VolumeWeight).toFixed(2));
                                                                            closestTr.find("input[type='checkbox']").attr("checked", !closestTr.find("input[type='checkbox']:checked"));

                                                                            processedawb.push({
                                                                                AWBSno: nonulddata.AWBSNo,
                                                                                FPSNo: nonulddata.FPSNo,
                                                                                AwbNo: nonulddata.AWBNo,
                                                                                Pieces: remainingPcs,
                                                                                GrossWeight: parseFloat(nonulddata.GrossWeight).toFixed(1),
                                                                                VolumeWeight: parseFloat(nonulddata.VolumeWeight).toFixed(2),
                                                                                SPHC: nonulddata.SPHC,
                                                                                ULDStockSNo: -1,
                                                                                FromTable: nonulddata.FromTable,
                                                                                FromTableSNo: nonulddata.FromTableSNo,
                                                                                ShipmentDetail: nonulddata.ShipmentDetail,
                                                                                FromTableTotalPieces: nonulddata.LIPieces,
                                                                                AWBPieces: nonulddata.AWBPieces,
                                                                                AWBGrossWeight: nonulddata.AWBGrossWeight,
                                                                                AWBVolumeWeight: nonulddata.AWBVolumeWeight,
                                                                                AWBOffPoint: "",
                                                                                ConnectingFlight: "",
                                                                                MCBookingSNo: nonulddata.MCBookingSNo,
                                                                                ShipmentType: nonulddata.ShipmentType,
                                                                                Status: nonulddata.Status,
                                                                                AWBCBM: parseFloat(nonulddata.AWBCBM).toFixed(3),
                                                                                CBM: parseFloat(nonulddata.CBM).toFixed(3),
                                                                                //IsPlanned: '0',
                                                                                //ShipmentId: 'UnPlanned_0'
                                                                                IsPlanned: nonulddata.IsPlanned,
                                                                                ShipmentId: nonulddata.ShipmentId,
                                                                                Priority: nonulddata.Priority,
                                                                                //Action: nonulddata.IsAction
                                                                                //Action: nonulddata.Action == '0' ? '' : '<a id="' + nonulddata.ShipmentId + '" onclick=\"fnMoveToLyingList(this);\"><i class=\"fa fa-mail-forward\" style=\"font-size:15px;\" title=\"Move to Lying List\"></i></a>'
                                                                                Action: nonulddata.Action
                                                                                //IsChanged: nonulddata.IsChanged,
                                                                                //OffloadStage: nonuldgriddata[trIndex].OffloadStage
                                                                            });

                                                                            //deleteddata.push(nonulddata);
                                                                            //offloadgriddatasource.insert(FromUldShipmentModel);
                                                                        }
                                                                        else {
                                                                            deleteddata.push(nonulddata);
                                                                        }

                                                                        //if (existingshipdata.length == 0) {
                                                                        //    /*---------If Child Data does not exists in selected ULD(03-Nov-2016)-------------------------------*/
                                                                        //    $(nonuldgriddata).each(function (index, item) {
                                                                        //        nonuldgriddata[index].LoadPieces = parseInt(item.Pieces.split('/')[0]);
                                                                        //        nonuldgriddata[index].LoadGrossWeight = item.GrossWeight;
                                                                        //        nonuldgriddata[index].LoadVol = item.VolumeWeight;
                                                                        //        nonuldgriddata[index].LoadCBM = item.CBM;
                                                                        //        nonuldgriddata[index].WeightDetail = item.GrossWeight + "/" + item.VolumeWeight + "/" + parseFloat(item.CBM).toFixed(3);
                                                                        //        //nonuldgriddata[index].IsPlanned = '0';
                                                                        //        //nonuldgriddata[index].ShipmentId = 'UnPlanned_0'
                                                                        //        //nonuldgriddata[index].IsPlanned = item.IsPlanned;
                                                                        //        //nonuldgriddata[index].ShipmentId = item.IsPlanned == '0' ? 'UnPlanned_0' : item.ShipmentId
                                                                        //    });
                                                                        //    /*----------------------------------------*/
                                                                        //    cdatasource.insert(ToUldShipmentModel);
                                                                        //}
                                                                        //else {

                                                                        //    cdatasource.pushUpdate(ToUldShipmentModel);
                                                                        //}
                                                                    }
                                                                    else {
                                                                        alreadyonuldship = alreadyonuldship + (alreadyonuldship == "" ? "" : " , ") + "[" + nonuldgriddata[trIndex].AWBNo + "]";
                                                                    }
                                                                }
                                                                else {
                                                                    notabletoprocessship = notabletoprocessship + (notabletoprocessship == "" ? "" : " , ") + "[" + nonuldgriddata[trIndex].AWBNo + "]";
                                                                }
                                                            }
                                                            else {
                                                                invalidshipment = invalidshipment + (invalidshipment == "" ? "" : " , ") + "[" + nonuldgriddata[trIndex].AWBNo + "]";
                                                            }
                                                        }
                                                    });
                                                    processedawb = [];
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        ShowMessage('warning', 'Warning - Move Shipment', MsgData[0].Message, "bottom-right");
                                    }
                                }
                            }
                        },
                        error: function (xhr) {
                            var a = "";
                        }
                    });
                },
                'No': function () {

                    $(this).dialog('close');
                    $(this).find("#no").click();
                }
            }
        });
    }
}


function MoveULDFromLying(obj) {

    var vgrid = cfi.GetCFGrid("divUldShipmentSection");
    if (vgrid != undefined) {
        var vgriddatasource = vgrid.dataSource;
        var uldmasterrow = $(obj).closest("tr");
        ulddataitem = vgrid.dataItem(uldmasterrow);

        var uldtype = "ULD";
        if (ulddataitem.ULDNo == "BULK") {
            uldtype = "BULK";
        }

        RemovedULDStcockSNoToLying = RemovedULDStcockSNoToLying + ',' + ulddataitem.ULDStockSNo;

        /*Following is added by Brajendra for unlocked when remove uld on 16 Aug, 2017 */
        SaveUpdateLockedProcess(0, "", "", "", userContext.UserSNo, "31", 'FlightBuildUp', "", ulddataitem.ULDNo);

        vgriddatasource.remove(ulddataitem);
        for (var i = 0; i < processeduld.length; i++)
            processeduld.splice(i, 1)
        //ShowMessage('success', 'Success - ' + uldtype + ' Remove', uldtype + " removed successfully.", "bottom-right");
        removeValue(ulddataitem.ULDNo);
        AttachEventForULD("RemoveULD", ulddataitem.ULDStockSNo, 0);
    }
}


// Added by Vipin Kumar
function fnBuildUpSuccess() {
    if (LoadPopUPStatus)
        return;

    processeduldshipmentCheck = [];
    //processeduldshipmentCheck = [];
    var trHeader = $("div#divUldShipmentSection").find(".k-grid-header").find("tr[role='row']");
    var uldstocksnoindex = -1;
    var totalshipmentindex = -1;
    var ULDNoIndex = -1;
    uldstocksnoindex = trHeader.find("th[data-field='ULDStockSNo']").index();
    totalshipmentindex = trHeader.find("th[data-field='Shipments']").index();
    ULDNoIndex = trHeader.find("th[data-field='ULDNo']").index();
    var McBookingSNoIndex = trHeader.find("th[data-field='MCBookingSNo']").index();
    $("#divUldShipmentSection").find("tr.k-master-row").each(function () {
        var uldStockSNo = $(this).find("td:eq(" + uldstocksnoindex + ")").text();
        var uldStock_No = $(this).find("td:eq(" + ULDNoIndex + ")").text();
        var McBookingSNo = $(this).find("td:eq(" + McBookingSNoIndex + ")").text();
        var isDuplicate = 0;
        var detailgrid = cfi.GetNestedCFGrid("div__" + uldStockSNo.toString());
        if (detailgrid != undefined) {

            var detaildatasource = detailgrid.dataSource;
            var detaildata = detaildatasource.data();
            $.each(detaildata, function (i, item) {
                if (item) {
                    //if (processeduldshipmentCheck.length > 0) {
                    //    $.each(processeduldshipmentCheck, function (i, awb) {
                    //        if (awb.AWBSNo == item.AWBSNo && awb.ULDStockSNo == uldStockSNo) {
                    //            isDuplicate = 1;
                    //        }
                    //    });
                    //    if (isDuplicate == 0) {
                    //        var UldModel = {
                    //            ULDStockSNo: uldStockSNo,
                    //            AWBSNo: item.AWBSno,
                    //            Pieces: item.Pieces,
                    //            GrossWeight: item.GrossWeight,
                    //            VolumeWeight: item.VolumeWeight
                    //        }
                    //        processeduldshipmentCheck.push(UldModel);
                    //    }
                    //}
                    //else {
                    var UldModel = {
                        ULDStockSNo: uldStockSNo,
                        AWBSNo: item.AWBSno,
                        Pieces: item.Pieces,
                        GrossWeight: item.GrossWeight,
                        VolumeWeight: item.VolumeWeight
                    }
                    processeduldshipmentCheck.push(UldModel);
                    //}
                }
            });
        }
    })

    setTimeout(function () { PageRightsCheckBuildUP() }, 100)

}



function HDQReramks(AWBSNO, CurrentFlightSno) {

    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetHDQRemarks?DFGroupSNo=" + CurrentFlightSno + "&AWBSNo=" + AWBSNO, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            // alert(result);
            var ResultData = jQuery.parseJSON(result);
            var Data = ResultData.Table0;
            $("#divDetailPop").html("<span><b>" + Data[0].Remarks + "<b></span>");
            // $('#Remarks').val($(e).parent().find('input[type=hidden]').val() == "Add" ? "" : $(e).parent().find('input[type=hidden]').val());
            cfi.PopUp("divDetailPop", "AWB HDQ Remarks", 200, null, null);
            // $('.k-window').closest("div:hidden").remove();

        }
    });

}
var YesReady = false;
function PageRightsCheckBuildUP() {

    var CheckIsFalse = 0;
    $(userContext.PageRights).each(function (e, i) {

        if (i.Apps.toString().toUpperCase() == "BUILDUP") {

            if (i.Apps.toString().toUpperCase() == "BUILDUP" && i.PageRight == "New") {
                YesReady = false;
                CheckIsFalse = 1;
                return
            } if (i.Apps.toString().toUpperCase() == "BUILDUP" && i.PageRight == "Edit") {
                YesReady = false;
                CheckIsFalse = 1;
                return
            } else if (CheckIsFalse == 0 && i.PageRight == "Read") {
                YesReady = true;
                return
            }

        }
    });

    if (YesReady) {
        $("#divFooter").hide()
        $("#btnSaveULD").hide()
        $("#btnPrintULD").hide()
        $("#divShipmentMoveSection").hide()
        $("#divShipmentDetails").find("a").hide();

        $("#divAddUldSection").find('span').hide();

        //  $("#divShipmentDetails").find("a").hide(); 

        $('#divShipmentDetails').find('input').each(function () {

            var ctrltype = $(this).attr("type");
            var dataRole = $(this).attr("data-role");
            if (ctrltype != "hidden") {
                if (dataRole == "autocomplete") {
                    $(this).parent().parent().replaceWith("<span>" + this.value + "</span>");
                }
                else if (dataRole == "datepicker") {
                    $(this).parent().replaceWith("<span>" + this.value + "</span>");
                }
                else if (ctrltype == "radio") {
                    var name = $(this).attr("name");
                    if ($(this).attr("data-radioval"))
                        $(this).closest("td").html("<span>" + $("input[name='" + name + "']:checked").attr("data-radioval") + "</span>");
                    else
                        $(this).attr("disabled", true);
                }
                else if (ctrltype == "checkbox" || ctrltype == "radio") {// && (this.value == "0" || this.value == "1")
                    $(this).attr("disabled", true);
                }
                else if ($(this).attr("id").indexOf("_temp") >= 0) {
                    $(this).replaceWith("<input type='hidden' id='" + $(this).attr("id") + "' value='" + this.value + "' />");
                }
                else {
                    $(this).replaceWith("<span id='" + $(this).attr("id") + "'>" + this.value + "</span>");
                }
            }

        });

        //  $("#Text_searchULDNo").data("kendoAutoComplete").enable(false);
    }
}


function BuildUpPrint() {
    var view = '';
    var flightCntrl = $("#Text_searchFlightNo").data("kendoAutoComplete");
    dailyflightsno = flightCntrl.key();

    if ($('#searchFlightDate').val() == "" && $('#searchFlightNo').val() == "") {
        ShowMessage('warning', 'Warning - Build-Up Report', "Please select Flight Date & Flight No.", "bottom-right");
        return;
    }
    if ($('#searchFlightDate').val() == "") {
        ShowMessage('warning', 'Warning - Build-Up Report', "Please select Flight Date", "bottom-right");
        return;
    }
    else if ($('#searchFlightNo').val() == "") {
        ShowMessage('warning', 'Warning - Build-Up Report', "Please select Flight No.", "bottom-right");
        return;
    }
    else {
        $("head").after('<div id="divBuilUpReport" style="overflow:auto"></div>');
        GetReportData(dailyflightsno);
    }
    //return Message;
}

function GetReportData(FlightSNo) {
    $("#divBuilUpReport").html("");
    $("#divBuilUpReport").css('display', 'none');
    var FlightSNoArray = FlightSNo.split(',');
    $(FlightSNoArray).each(function (r, i) {
        //  if (r < (FlightSNoArray.length - 1)) {
        $.ajax({
            url: "Services/BuildUp/BuildUpProcessService.svc/BuildUPReport?DailyFlightSNo=" + i, async: false, type: "GET", dataType: "html", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#divBuilUpReport").append(result);
                if (r < (FlightSNoArray.length - 1)) {
                    $("#divBuilUpReport").append('</br><div class="page-break"></div>');
                }
            },
            error: function (rex) {
                //   alert(rex);
            }
        });
        // }
    })
    printDiv('BuildUpPrint');
    //$("#divDetail #btnPrint:last").closest('tr').show();
}
function printDiv(PageTitle) {
    var divToPrint = document.getElementById('divBuilUpReport');
    var newWin = window.open('', '_blank');
    newWin.document.open();
    newWin.document.title = PageTitle;
    newWin.document.write('<html><head><link type="text/css" rel="stylesheet" href="Styles/Application.css" /><title>' + PageTitle + '</title></head><body ><div><input id="btnPrint" type="button" value="Print" class="no-print" onclick="window.print();"/></div><br\>' + divToPrint.innerHTML + '</body></html>');
    newWin.document.close();
    newWin.focus();

}
