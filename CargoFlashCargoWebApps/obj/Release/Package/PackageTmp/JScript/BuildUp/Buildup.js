/// <reference path="../../Scripts/references.js" />

var _CityCode_ = "SHJ";
var AddedULD = "";
var arrSPHCList = [];
var arrAircraftCapacityList = [];
var arrULDCapacity = [];
var arrULDCapacity_Final = [];
var User_SNo, User_Name, User_CityCode, User_CitySNo;
var _ISPAX = "";
var _EquipmentSNo = 0;
var FlightNextDestination = "";
var LstULDSPH = [];
var IsFlightPremanifested = "False";
var LstSavedULD = [];
var _PartAirline = "";

$(document).ready(function () {
    PrepareBuildUp();
});
function onGridDataBound(e)
{ }
function PrepareBuildUp() {
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
        url: "Services/Buildup/BuildUpService.svc/GetWebForm/" + _CURR_PRO_ + "/BuildUp/BuildUpSearch/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form>");
            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });
            $("#divContent").html(divContent + divAirlineULDStock + divShowLI);
            $("#divFooter").html(fotter).show();

            //$('#divFooter').css('padding-bottom', '20px');

            //var dataSource = GetDataSource("searchFlightNo", "vFlightDetail", "SNo", "FlightNo", null); 
            //var dataSource = GetDataSource("searchFlightNo", "vBuildupFlight", "GroupFlightSNo", "FlightNo", null);
            var dataSource = GetDataSource("searchFlightNo", "vBuildupFlight_New", "GroupFlightSNo", "FlightNo", null);

            cfi.ChangeAutoCompleteDataSource("searchFlightNo", dataSource, false, ResetSearchByFlight, "FlightNo", "contains");
            //   $('#searchFlightDate').data("kendoDatePicker").value(todayDate);

            //   cfi.AutoComplete("searchFlightNo", "FlightNo", "vFlightDetail", "SNo", "FlightNo", ["FlightNo"], null, "contains");

            var todayDate = new Date();
            $('#searchFlightDate').data("kendoDatePicker").value(todayDate);

            $('#__tblbuildupsearch__').find('td:first').text('Flight Date');
            $('#__tblbuildupsearch__').find('td:first').css('width', '70px');
            $('#__tblbuildupsearch__').find('td:first').css('padding-left', '5px');


            $("#btnSearch").bind("click", function () {
                CleanUI();
                BuildupSearch();
                $("#ApplicationTabs").kendoTabStrip();
                $("#AirlineULDStock").bind("click", function () {
                    $("#divAirlineULDStock").html("<table class='WebFormTable'><tr><td class='formthreelabel'>ULD Type</td><td class='formthreeInputcolumn'><input type='hidden' name='ULDType' id='ULDType' value=''/> <input type='text'  name='Text_ULDType' id='Text_ULDType' tabindex='1' controltype='autocomplete' maxlength='10' /></td><td class='formthreeInputcolumn'> <input type='radio' tabindex='2' class='' name='IsSummaryDetails' checked='True' id='IsSummary' value='0'/>Summary <input type='radio' tabindex='2' class='' name='IsSummaryDetails' id='IsDetails' value='1'/>Details</td><td class='formthreeInputcolumn'><input type='button' tabindex='3' class='btn btn-block btn-success btn-sm' name='searchAirlineULDStock' id='searchAirlineULDStock' style='width:90px;' value='Search' onclick='getAirlineULDStock();'></td></tr><tr><td colspan='4'><div id='divAirlineULDStockDetails' style='overflow-y:scroll;max-height:300px;'></div></td></tr></table>");
                    //cfi.AutoComplete("ULDType", "ULDName", "ULD", "SNo", "ULDName", ["ULDName"], null, "contains");
                    cfi.AutoComplete("ULDType", "ULDName", "vBuildupULDType", "SNo", "ULDName", ["ULDName"], null, "contains");
                    cfi.PopUp("divAirlineULDStock", "Available Airline ULD Stock", 100, null, null);
                });
                $("#ShowLI").bind("click", function () {

                    AssignTeamGrid();
                    //$("#divShowLI").html("<table class='WebFormTable'><tr><td></td></tr></table>");
                    cfi.PopUp("divShowLI", "Show Loading Instruction", 100, null, null);
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

            });

            /**************User Info****************/
            //if ($('#hdn_userInfo').val() != "") {
            //userContext
            var UserInfo = $('#hdn_userInfo').val();
            User_SNo = userContext.UserSNo;//UserInfo.split('#')[0];
            User_Name = userContext.UserName; //UserInfo.split('#')[1];
            User_CityCode = userContext.CityCode; //UserInfo.split('#')[2];
            User_CitySNo = userContext.CitySNo; //UserInfo.split('#')[3];
            _CityCode_ = User_CityCode;
            _LoginSNo_ = User_SNo;
            //}
            /***************************************/
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
        cfi.setFilter(filterFlt, "OriginCity", "eq", User_CityCode);
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

        //cfi.setFilter(filterAND, "AircraftType", "eq", $('span[id="Aircraft"]').text());
        cfi.setFilter(filterAND, "ULDCity", "eq", _CityCode_);
        cfi.setFilter(filterAND, "IsAvailable", "eq", "1");// Change By Manoj on 8.3.2016
        cfi.setFilter(filterAND, "CarrierCode", "eq", CarrierCode);
        //cfi.setFilter(filterAND, "CarrierCode", "in", GetPartnerCarrierCode(_PartAirline));
        cfi.setFilter(filterAND, "IsServiceable", "eq", "1");

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
                    cfi.setFilter(filterAND, "ULDNo", "notin", AddedULD.split(',')[i]);
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
            cfi.setFilter(filterCondition, "BaseULD", "eq", $("#Text_UldBasePallet").data("kendoAutoComplete").key());
            cfi.setFilter(filterCondition, "ULDNo", "notin", $("#Text_UldBasePallet").data("kendoAutoComplete").value());
            $('span.k-icon.k-delete').each(function (index, item) { // Allready Added in Db
                cfi.setFilter(filterCondition, "ULDNo", "notin", item.id);
            });
            var tempAdded = $('#_OtherPallets').val(); // Temp Added
            if (tempAdded != "") {
                var arr = tempAdded.split('=#=');
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] != "") {
                        cfi.setFilter(filterCondition, "ULDNo", "notin", arr[i]);
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
                    cfi.setFilter(SHCOR, "Code", "notin", item);
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
    var databind = false;
    $.ajax({
        url: "Services/BuildUp/BuildUpService.svc/GetWebForm/FlightDetails/FlightDetails/FlightDetails/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            databind = true;
            $("#divShipmentDetails").html(result);
        }
    });
    aircraftTypeSno = 0;
    uldcount = 0;
    if (databind) {
        $("#btnSave").unbind("click").bind("click", function () {

            SaveBuildUpPlan();
        });

        $.ajax({
            url: "Services/BuildUp/BuildUpProcessService.svc/GetBuildUpFlightDetails", async: true, type: "POST", dataType: "json", cache: false,

            data: JSON.stringify({ DailyFlightSNo: dailyflightsno, City: _CityCode_ }),
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

                /*------------------------------------------------------------------------*/
                if (dtFlightNextDestination.length > 0) {
                    FlightNextDestination = dtFlightNextDestination[0].FlightNextDestination;
                    IsFlightPremanifested = dtFlightNextDestination[0].IsFlightPremanifested;
                }
                /*-------------Get Partner Airline-----------------------------------------------*/
                if (PartAirline.length > 0) {
                    _PartAirline = PartAirline[0].PartAirline;
                }
                /*------------------------------------------------------------------------*/

                var out = '[';
                $.each(routeDetail, function (i, item) {
                    if (item) {
                        if (parseInt(i) > 0) {
                            out = out + ',{ Key: "' + routeDetail[i].City + '", Text: "' + routeDetail[i].City + '"}'
                        }
                        else {
                            out = out + '{ Key: "' + routeDetail[i].City + '", Text: "' + routeDetail[i].City + '"}'
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
                    }
                }
            }
        });

        $.ajax({
            url: "Services/BuildUp/BuildUpService.svc/GetWebForm/ADDULD/AddUld/AddUld/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                databind = true;
                $("#divAddUldShipmentSection").html(result);
                cfi.ShowIndexView("divUldShipmentSection", "Services/BuildUp/BuildUpService.svc/GetBuildupULDGridData/" + _CURR_PRO_ + "/BuildupULD/SEARCHBUILDUPULD/" + dailyflightsno);
                cfi.ShowIndexView("divNonUldShipmentSection", "Services/BuildUp/BuildUpService.svc/GetBuildupGridData/" + _CURR_PRO_ + "/Buildup/SEARCHBUILDUP/" + dailyflightsno);

                //Show Loading Instruction
                $("#__tbladduld__ tbody tr td:eq(1)").after("<td class='formtwolabel' title=''><input type='button' class='btn btn-block btn-success btn-sm' name='ShowLI' id='ShowLI' style='width:160px;' value='Show Loading Instruction'></td>");
                $("#__tbladduld__ tbody tr td:eq(3)").remove();

                $("#divShipmentDetails").find("input[type='button'][id='AddUld']").unbind("click").bind("click", function () {
                    AddULD();
                });
                InstantiateControl("divAddUldSection");

                var dataSource = GetDataSource("searchUldType", "v_AircraftULd", "ULDSNo", "ULDName", null);
                cfi.ChangeAutoCompleteDataSource("searchUldType", dataSource, true, ResetULDNo, "ULDName", "contains");

                var udataSource = GetDataSource("searchULDNo", "v_AllAvailableULD", "SNo", "ULDNo", null, "GetBuildupULD_New", "");//GetBuildupULD
                cfi.ChangeAutoCompleteDataSource("searchULDNo", udataSource, false, SelectULDNo, "ULDNo");

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
            }
        });


        $.ajax({
            url: "Services/BuildUp/BuildUpService.svc/GetWebForm/LyingListSearch/LyingListSearch/LyingListSearch/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
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
    cfi.ShowIndexView("divLyingListSection", "Services/BuildUp/BuildUpService.svc/GetLyingListGridData/" + _CURR_PRO_ + "/Buildup/SEARCHLYINGLIST/" + org + "/" + dest + "/" + flight + "/" + date + "/" + awb + "/" + userContext.AirportCode);
}

function AddULD(U_uldstocksno, U_uldno) {

    //var uldstocksno = $("#Text_searchULDNo").data("kendoAutoComplete").key();
    //var uldno = $("#Text_searchULDNo").data("kendoAutoComplete").value();

    var uldstocksno = U_uldstocksno, uldno = U_uldno;

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
                        OriginCity: _CITY_,
                        SNo: uldDetail[0].SNo,
                        Status: uldDetail[0].Status,
                        Shipments: 0,
                        LastPoint: "",
                        ULDStatus: uldDetail[0].ULDStatus,
                        IsUWS: "False" //added for AssignEquipmentBulk
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
                    if (ULDModel.ULDNo == "BULK") {
                        datasource.insert(ULDModel, null, 0);
                    }
                    else {
                        var IsBulkAdded = false;
                        var AddedData = datasource.data();
                        $.each(AddedData, function (index, item) {
                            if (item.ULDNo == "BULK") {
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

                    AttachEventForULD("ADDULD", uldstocksno);
                    if (uldno.toUpperCase() == "BULK")
                        ShowMessage('success', 'Success - ADD BULK', "BULK added successfully.", "bottom-right");
                    else
                        ShowMessage('success', 'Success - ADD ULD', "Selected ULD " + uldno + " added successfully.", "bottom-right");
                    AddedULD = $("#Text_searchULDNo").data("kendoAutoComplete").value() + "," + AddedULD;
                    $("#Text_searchULDNo").data("kendoAutoComplete").value("");
                }
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - ADD ULD', "Unable to process.", "bottom-right");
                return;

            }
        });
    }



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

function AttachEventForULD(AccessFrom, uldsno) {

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
        cfi.AutoComplete(controlId.replace("Text_", ""), "DestinationAirportCode", "vBuildupOffPoint", "DestinationAirportCode", "DestinationAirportCode", null, null, "contains");
        if (value == "")
            //$("#" + controlId).data("kendoAutoComplete").setDefaultValue(lastpoint, lastpoint);
            $("#" + controlId).data("kendoAutoComplete").setDefaultValue(FlightNextDestination, FlightNextDestination);
        else
            $("#" + controlId).data("kendoAutoComplete").setDefaultValue(value, value);

        if (IsFlightPremanifested == "True" && CheckULDExists(controlId.split('_')[2])) {
            $("#" + controlId).data("kendoAutoComplete").enable(false);
        }
        else {
            $("#" + controlId).data("kendoAutoComplete").enable(true);
        }

    });

    if ($("#Text_offloadPoint_0").length > 0) // Hide Off Point From BULK as ULD
    {
        $("#Text_offloadPoint_0").closest('span').hide();
        $("#Text_offloadPoint_0").hide();
    }
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
        masterTableSNo: dailyflightsno,
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
                        name: 'AWBNo', display: 'AWB No', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, isRequired: true, onChange: "return ChangeAWBNoAssignEquipment(this)", tableName: 'vgetBuildUpAssignEquipmentAWB', textColumn: 'AWBNo', keyColumn: 'AWBSNo', filterCriteria: "contains"
                    },
                    {
                        name: 'Pieces', display: 'Pieces', type: 'text', ctrlCss: { width: '100px' }, ctrlAttr: {
                            maxlength: 5, controltype: "text", onblur: "CheckPices(this);"
                        }, isRequired: true
                    },
                    {
                        name: 'EquipmentNo', display: 'Equipment No', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '120px', height: '20px' }, tableName: 'vwAllEquipment', textColumn: 'EquipmentNo', keyColumn: 'EquipmentSNo', isRequired: true

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


        cfi.AutoComplete("txtAirlineAssignEquipmentFlightPopUp", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], ResetAssignEquipmentFlightSearch, "contains");
        cfi.AutoComplete("txtFlightNoAssignEquipmentFlightPopUp", "FlightNo", "vAgentBuildUpFlight", "SNo", "FlightNo", ["FlightNo"], GetOffPointAssignEquipmentFlightPopUp, "contains");
        cfi.AutoComplete("txtOffPointAssignEquipmentFlightPopUp", "DestinationAirportCode", "vBuildupOffPoint", "DestinationAirportCode", "DestinationAirportCode", null, null, "contains");

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
            $tr.find("input[id^='tblAssignEquipmentPopUp_HdnEquipmentNo']").data("kendoAutoComplete").setDefaultValue(txtvalEquipmentNo, hdnvalEquipmentNo);
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
        masterTableSNo: DailyFlightSNo,
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
                      name: 'AWBNo', display: 'AWB No', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '100px', height: '20px' }, tableName: 'vgetBuildUpAssignEquipmentAWB', textColumn: 'AWBNo', keyColumn: 'AWBSNo'
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
                        name: 'EquipmentNo', display: 'Equipment No', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '120px', height: '20px' }, tableName: 'vwAllEquipment', textColumn: 'EquipmentNo', keyColumn: 'EquipmentSNo'
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

    cfi.AutoComplete("txtAirlineAssignEquipmentFlightPopUp", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], ResetAssignEquipmentFlightSearch, "contains");
    cfi.AutoComplete("txtFlightNoAssignEquipmentFlightPopUp", "FlightNo", "vAgentBuildUpFlight", "SNo", "FlightNo", ["FlightNo"], GetOffPointAssignEquipmentFlightPopUp, "contains");
    cfi.AutoComplete("txtOffPointAssignEquipmentFlightPopUp", "DestinationAirportCode", "vBuildupOffPoint", "DestinationAirportCode", "DestinationAirportCode", null, null, "contains");

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
        html = html + '<tr><td class=ui-widget-content>Equipment No :   </td><td class=ui-widget-content>' + uniquetempAssignedEquipment[i].EquipmentNo + '</td><td class=ui-widget-content>Scale Weight :   </td><td class=ui-widget-content>' + uniquetempAssignedEquipment[i].ScaleWeight + '</td><td class=ui-widget-content>Off Point :   </td><td class=ui-widget-content>' + uniquetempAssignedEquipment[i].OffPoint + '</td></tr>'
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
                        cfi.AutoComplete("Offpoint_" + i, "DestinationAirportCode", "vBuildupOffPoint", "DestinationAirportCode", "DestinationAirportCode", ["DestinationAirportCode"], null, "contains");
                        if (OffPoint != "") {
                            $("#Text_Offpoint_" + i).val(OffPoint);
                            $("#Offpoint_" + i).val(OffPoint);
                        }

                    }
                    $("input[type='text'][id^='ScaleWeight_']").on("keypress keyup", function (event) {
                        ISNumeric(this);
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
        if (parseFloat($("#" + obj.id).val()) < parseFloat($("#hdnNewTareWeight_" + index).val())) {
            ShowMessage('warning', 'Warning!', "Scale Weight should be greater than Tare Weight");
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
        cfi.AutoComplete("Offpoint_" + i, "DestinationAirportCode", "vBuildupOffPoint", "DestinationAirportCode", "DestinationAirportCode", ["DestinationAirportCode"], null, "contains");
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
            var r = jConfirm(promptmsg, "", function (r) {
                if (r == true) {
                    if (dataDetails != false) {
                        $.ajax({
                            url: "./Services/Buildup/BuildUpService.svc/SaveBulkRecordForAssignEquipmentBuildUp", async: true, type: "POST", dataType: "json", cache: false,

                            data: JSON.stringify({ dataDetails: dataDetails, ScaleWeightData: EData, dailyFlightSNo: _DailyFlightSNo, AirportSNo: AirportSNo, UserSNo: UserSNo }),
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

            });
        }
        else {
            if (dataDetails != false) {
                $.ajax({
                    url: "./Services/Buildup/BuildUpService.svc/SaveBulkRecordForAssignEquipmentBuildUp", async: true, type: "POST", dataType: "json", cache: false,

                    data: JSON.stringify({ dataDetails: dataDetails, ScaleWeightData: EData, dailyFlightSNo: _DailyFlightSNo, AirportSNo: AirportSNo, UserSNo: UserSNo }),
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
    if (str.toUpperCase() == "D") {
        $.ajax({
            url: "Services/BuildUp/BuildUpService.svc/GetWebForm/ULDDETAILS/ULDDETAILS/ULDBuildUpDetails/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
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

                /*
                $('#AddScaleWeight').blur(function () {
                    var TotalULDWeight = GetULDWeight();
                    if ($("#Text_EquipmentID").data("kendoAutoComplete").key() != "")
                    {
                        var equipmentWeight = $("#Text_EquipmentID").data("kendoAutoComplete").key().split('-')[1];
                        TotalULDWeight = parseFloat(TotalULDWeight) + parseFloat(equipmentWeight);
                    }
                    var ScaleWeight = $('#AddScaleWeight').val();
                    if (ScaleWeight != "" && parseFloat(ScaleWeight) > 0) {
                        if (parseFloat(TotalULDWeight) > parseFloat(ScaleWeight)) {
                            $('#AddScaleWeight').val('');
                            ShowMessage('warning', 'Information', "Scale weight cannot be less than Tare Weight(Equipment + ULD)");
                        }
                    }
                });*/

                $('#Ovng_IsOverhangPallet').click(function () {
                    OverhangControl(this.checked);
                });

                var DSBaseULD = [{ Key: __uldstocksno, Text: __uldno }];

                cfi.AutoComplete("ULDBuildUpLocation", "LocationName", "vwBuildupLocation", "SNo", "LocationName", ["LocationName"], null, "contains");
                cfi.AutoComplete("ULDLocation", "LocationName", "vwBuildupLocation", "SNo", "LocationName", ["LocationName"], null, "contains");
                cfi.AutoComplete("LoadCode", "ULDLoadingCode,Description", "ULDLoadingCodes", "SNo", "ULDLoadingCode", ["ULDLoadingCode", "Description"], null, "contains");
                cfi.AutoComplete("LoadIndicator", "ULDLoadingIndicator,Description", "ULDLoadingIndicator", "SNo", "ULDLoadingIndicator", ["ULDLoadingIndicator", "Description"], null, "contains");
                cfi.AutoComplete("AbbrCode", "AbbrCode,Description", "ULDContour", "SNo", "AbbrCode", ["AbbrCode", "Description"], null, "contains");
                //cfi.EnableAutoComplete("AbbrCode", true, false, "white");
                cfi.AutoCompleteByDataSource("ULDBuild", uldbuild, null, null);
                cfi.AutoCompleteByDataSource("MeasurementUnit", OverhangMesUnit, null, null);
                cfi.AutoCompleteByDataSource("UldBasePallet", DSBaseULD, null, null);

                cfi.AutoComplete("_OtherPallets", "ULDNo", "vBuidupOtherPallet", "ULDNo", "ULDNo", ["ULDNo"], null, "contains", ",");
                cfi.AutoComplete("UldBupType", "Description", "buptype", "SNo", "Description", ["Description"], null, "contains");

                cfi.AutoCompleteByDataSource("Ovng_MasterMesUnit", OverhangMesUnit, null, null);
                cfi.AutoCompleteByDataSource("ULD_MesUnit", OverhangMesUnit, null, null);
                var dataSource_Equipment = GetDataSource("EquipmentID", "vwBuildupEquipment", "SNo", "EquipmentID", null);

                //cfi.ChangeAutoCompleteDataSource("EquipmentID", dataSource_Equipment, false, CheckEquipment, "EquipmentID", "contains");
                cfi.ChangeAutoCompleteDataSource("EquipmentID", dataSource_Equipment, false, null, "EquipmentID", "contains");// CheckEquipment ****No Need to CheckEquipment

                $('#ULDSHC').after("<input type='hidden' name='BuildUPULDSHC' id='BuildUPULDSHC' value=''/> <input type='text'  name='Text_BuildUPULDSHC' id='Text_BuildUPULDSHC' tabindex='9' controltype='autocomplete' maxlength='10' />")

                cfi.AutoComplete("BuildUPULDSHC", "Code", "sphc", "Code", "Code", ["Code"], null, "contains", ",");

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
                                    $("#Text_EquipmentID").data("kendoAutoComplete").setDefaultValue(lstEquipment[0].EquipmentSNo, lstEquipment[0].EquipmentID);
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
                                $("#Text_EquipmentID").data("kendoAutoComplete").setDefaultValue(lstEquipment[0].EquipmentSNo, lstEquipment[0].EquipmentID);
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
                                cfi.AutoComplete($(this).attr("name"), "Item", "BuildupConsumables", "SNo", "Item", ["Item"], null, "contains");
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
            url: "Services/BuildUp/BuildUpService.svc/GetWebForm/ULDDETAILS/CLOSEDULDDETAILS/ULDBuildUpDetails/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
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
        cfi.AutoComplete("AbbrCode", "AbbrCode", "ULDContour", "SNo", "AbbrCode", ["AbbrCode"], null, "contains");
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
        cfi.AutoComplete($(this).attr("name"), "Item", "BuildupConsumables", "SNo", "Item", ["Item"], null, "contains");
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
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "BuildupConsumables", "SNo", "Item", ["Item"]);
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

    var uldtype = "ULD";
    if (ulddataitem.ULDNo == "BULK") {
        uldtype = "BULK";
    }

    RemovedULDStockSNo = RemovedULDStockSNo + ',' + ulddataitem.ULDStockSNo;

    if (parseInt(ulddataitem.Shipments) == 0) {
        vgriddatasource.remove(ulddataitem);
        for (var i = 0; i < processeduld.length; i++)
            processeduld.splice(i, 1)
        ShowMessage('success', 'Success - ' + uldtype + ' Remove', uldtype + " removed successfully.", "bottom-right");
        removeValue(ulddataitem.ULDNo);
        AttachEventForULD("RemoveULD", ulddataitem.ULDStockSNo);
    }
    else {
        ShowMessage('warning', 'Warning - ' + uldtype + ' Remove', "Unable to remove selected " + uldtype, "bottom-right");
    }
}

function MoveToUld() {

    debugger;

    var vgrid = cfi.GetCFGrid("divUldShipmentSection");
    var ULDType = "ULD";
    var ULD_SNo = "";

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
    if (isClosed) {
        ShowMessage('warning', 'Information', "ULD '" + ClosedULDNo + "' already closed.");
        return;
    }
    //******************For BUP Shipment************************/
    var isAllowed = true;
    var ShipmentOD = "";
    var SPHC = "";
    var CheckAddedLen = 0;
    var SelectedULDNo;
    var TotalSelected = $("#divNonUldShipmentSection").find(".k-grid-content").find("input[type='checkbox']:checked").length;
    if (vgrid != undefined) {

        ULD_SNo = vgrid.options.parentValue.toString();

        $.each(vgrid._data, function (i, item_Data) {
            if (item_Data.IsBUP == "1" && vgrid.options.parentValue.toString() == item_Data.ULDStockSNo) {
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
    if (isAllowed == false && (TotalSelected > 0 || vgrid.options.parentValue.toString() != "")) {
        alert(' \'' + SelectedULDNo + '\' accepted as Build Up/BUP. Cannot add more shipments');
        return;
    }

    /************Check ULD Status*********************************************/
    var IsULDPreManifested = false;

    $.each(vgrid._data, function (i, item_Data) {
        if (item_Data.ULDStatus == "PRE" && vgrid.options.parentValue.toString() == item_Data.ULDStockSNo) {
            IsULDPreManifested = true;
            SelectedULDNo = item_Data.ULDNo;
            return false;
        }
    });
    if (IsULDPreManifested == true && (TotalSelected > 0 || vgrid.options.parentValue.toString() != "")) {
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

            pcsindex = trHeader.find("th[data-field='LoadPieces']").index();
            grwtindex = trHeader.find("th[data-field='LoadGrossWeight']").index();
            volwtindex = trHeader.find("th[data-field='LoadVol']").index();

            awbpcsindex = trHeader.find("th[data-field='Pieces']").index();
            awbgrwtindex = trHeader.find("th[data-field='GrossWeight']").index();
            awbvolwtindex = trHeader.find("th[data-field='VolumeWeight']").index();
            lipcsindex = trHeader.find("th[data-field='LIPieces']").index();
            loaddetailindex = trHeader.find("th[data-field='LoadDetail']").index();
            weightdetailindex = trHeader.find("th[data-field='WeightDetail']").index();

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
                var uldgr = parseFloat(grControl.val());
                var uldvol = parseFloat(volControl.val());

                trIndex = $(this).closest("tr").index();

                var avl_pcs = closestTr.find("td:eq(" + awbpcsindex + ")").text().split('/')[0];
                var avl_grwt = closestTr.find("td:eq(" + weightdetailindex + ")").text().split('/')[0];
                var avl_volwt = closestTr.find("td:eq(" + weightdetailindex + ")").text().split('/')[1];

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
                /******************Check ULD MAX Weight Capacity****************/
                if (ULD_SNo != "0") {
                    var IsConfirmDataULDCapacity = true;
                    var _Message = CheckULDMaxWeightCapacity(vgrid, uldgr);
                    if (_Message != "") {
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
                    _sphc = nonuldgriddata[trIndex].SPHC;
                    $.ajax({
                        url: "Services/BuildUp/BuildUpProcessService.svc/CheckForSPHCRestriction", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
                        //data: JSON.stringify({ ProcessedShipmentInfo: processedShipment, ULDStockSNo: vgrid.options.parentValue.toString(), AircraftTypeSNo: aircraftTypeSno, CheckedAWBSNo: CheckedAWBSNo }),
                        data: JSON.stringify({ ProcessedShipmentInfo: processedShipment, ULDStockSNo: nonuldgriddata[trIndex].SPHC, AircraftTypeSNo: aircraftTypeSno, CheckedAWBSNo: CheckedAWBSNo }),
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
                                AWBOffPoint: FlightNextDestination
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
                                        e.GrossWeight = parseFloat(e.GrossWeight + uldgr).toFixed(2);
                                        e.VolumeWeight = parseFloat(e.VolumeWeight + uldvol).toFixed(2);
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
                                    ExecutedPieces: uldpcs
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
                            var gr_wt = 0, vol_wt = 0;
                            if (remainingPcs > 0) {
                                nonulddata.Pieces = remainingPcs.toString() + "/" + nonulddata.AWBPieces;

                                /*********Added By Haider************************/
                                gr_wt = (parseFloat(ToUldShipmentModel.AWBGrossWeight) - ToUldShipmentModel.GrossWeight).toFixed(2);
                                vol_wt = (parseFloat(ToUldShipmentModel.AWBVolumeWeight) - ToUldShipmentModel.VolumeWeight).toFixed(2);

                                nonulddata.AWBGrossWeight = gr_wt;
                                nonulddata.AWBVolumeWeight = vol_wt;
                                /***********************************************/

                                nonulddata.GrossWeight = (parseFloat(nonulddata.GrossWeight) - parseFloat(ToUldShipmentModel.GrossWeight)).toFixed(2);
                                nonulddata.VolumeWeight = (parseFloat(nonulddata.VolumeWeight) - parseFloat(ToUldShipmentModel.VolumeWeight)).toFixed(2);

                                closestTr.find("td:eq(" + weightdetailindex + ")").text(nonulddata.AWBGrossWeight + "/" + nonulddata.AWBVolumeWeight);

                                closestTr.find("td:eq(" + awbpcsindex + ")").text(nonulddata.Pieces);
                                grControl.val(nonulddata.GrossWeight);
                                volControl.val(nonulddata.VolumeWeight);
                                pcsControl.val(remainingPcs.toString());

                                closestTr.find("td:eq(" + grwtindex + ")").text(nonulddata.GrossWeight);
                                closestTr.find("td:eq(" + volwtindex + ")").text(nonulddata.VolumeWeight);
                                closestTr.find("input[type='checkbox']").attr("checked", !closestTr.find("input[type='checkbox']:checked"));

                                processedawb.push({
                                    AWBSno: nonulddata.AWBSNo,
                                    AwbNo: nonulddata.AWBNo,
                                    Pieces: remainingPcs,
                                    GrossWeight: parseFloat(nonulddata.GrossWeight).toFixed(2),
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
                                    AWBOffPoint: FlightNextDestination
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
                                    ToUldShipmentModel.GrossWeight = (parseFloat(e.GrossWeight) + uldgr).toFixed(2);
                                    ToUldShipmentModel.VolumeWeight = (parseFloat(e.VolumeWeight) + uldvol).toFixed(2);
                                    ToUldShipmentModel.Pieces = parseInt(e.Pieces) + uldpcs;
                                    return e;
                                }
                                else {
                                    //****************Added By Haider************************/
                                    $(nonuldgriddata).each(function (index, item) {
                                        if (e.AWBSno != nonuldgriddata[trIndex].AWBSNo) {
                                            nonuldgriddata[index].LoadPieces = parseInt(item.Pieces.split('/')[0]);
                                            nonuldgriddata[index].LoadGrossWeight = item.GrossWeight;
                                            nonuldgriddata[index].LoadVol = item.VolumeWeight;
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
                                    nonuldgriddata[index].WeightDetail = item.GrossWeight + "/" + item.VolumeWeight;
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
                            var usedgrwt = parseFloat(parseFloat(ulddataitem.GrossWeight) + uldgr).toFixed(2);
                            var usedvolwt = parseFloat(parseFloat(ulddataitem.VolumeWeight) + uldvol).toFixed(2);
                            //if(usedgrwt > ulddataitem.) 
                            ulddataitem.GrossWeight = usedgrwt;
                            ulddataitem.VolumeWeight = usedvolwt;
                            ulddataitem.Used = ulddataitem.GrossWeight + " / " + ulddataitem.VolumeWeight;
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

            pcsindex = trHeader.find("th[data-field='LoadPieces']").index();
            grwtindex = trHeader.find("th[data-field='LoadGrossWeight']").index();
            volwtindex = trHeader.find("th[data-field='LoadVol']").index();

            awbpcsindex = trHeader.find("th[data-field='Pieces']").index();
            awbgrwtindex = trHeader.find("th[data-field='GrossWeight']").index();
            awbvolwtindex = trHeader.find("th[data-field='VolumeWeight']").index();
            lipcsindex = trHeader.find("th[data-field='LIPieces']").index();
            loaddetailindex = trHeader.find("th[data-field='LoadDetail']").index();
            weightdetailindex = trHeader.find("th[data-field='WeightDetail']").index();

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

                    var uldpcs = parseInt(pcsControl.val());
                    var uldgr = parseFloat(grControl.val());
                    var uldvol = parseFloat(volControl.val());

                    var lyingddata = lyinggriddata[trIndex];

                    var avl_pcs = closestTr.find("td:eq(" + awbpcsindex + ")").text().split('/')[0];
                    var avl_grwt = closestTr.find("td:eq(" + weightdetailindex + ")").text().split('/')[0];
                    var avl_volwt = closestTr.find("td:eq(" + weightdetailindex + ")").text().split('/')[1];

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
                        var _Message = CheckULDMaxWeightCapacity(vgrid, uldgr);
                        if (_Message != "") {
                            IsConfirmDataULDCapacity = confirm(_Message);
                            if (IsConfirmDataULDCapacity == false) {
                                return;
                            }
                        }
                    }
                    //******************Check Mixed Load in ULD*******************
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
                        }

                        if (lyingddata.ShipmentDetail == undefined) {
                            selectedAWB = lyingddata.OriginCity + '-' + lyingddata.ShipmentDestination;
                        }
                        else {
                            selectedAWB = lyingddata.ShipmentDetail.length > 7 ? lyingddata.ShipmentDetail.substring(0, 7) : lyingddata.ShipmentDetail;
                        }

                        selectedAWB = selectedAWB.split('-')[1]; // Get Destination City

                        if (ULD_SNo != "0" && ShipmentOD != "" && ShipmentOD != selectedAWB) {
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
                        $.ajax({
                            url: "Services/BuildUp/BuildUpProcessService.svc/CheckForSPHCRestriction", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
                            //data: JSON.stringify({ ProcessedShipmentInfo: processedShipment, ULDStockSNo: vgrid.options.parentValue.toString(), AircraftTypeSNo: aircraftTypeSno, CheckedAWBSNo: CheckedAWBSNo }),
                            data: JSON.stringify({ ProcessedShipmentInfo: processedShipment, ULDStockSNo: lyingddata.SPHC, AircraftTypeSNo: aircraftTypeSno, CheckedAWBSNo: CheckedAWBSNo }),
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
                        if (isValidShipment) {
                            var alreadyonulddata = $.grep(executedship, function (e, index) {
                                if (e.FromTableSNo == lyingddata.FromTableSNo && e.FromTable == lyingddata.FromTable && e.AWBSNo == lyingddata.AWBSNo && e.FromTableTotalPieces < e.ExecutedPieces + uldpcs) {
                                    return e;
                                }
                            });
                            if (alreadyonulddata.length == 0) {
                                var alreadyexecuteddata = $.grep(executedship, function (e, index) {
                                    if (e.FromTableSNo == lyingddata.FromTableSNo && e.FromTable == lyingddata.FromTable && e.AWBSNo == lyingddata.AWBSNo) {
                                        e.ExecutedPieces = e.ExecutedPieces + uldpcs;
                                        return e;
                                    }
                                });
                                var ToUldShipmentModel = {
                                    AWBSno: lyingddata.AWBSNo,
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
                                    AWBOffPoint: FlightNextDestination
                                }

                                var alreadyprsulddata = $.grep(processedawb, function (e, index) {
                                    if (e.FromTableSNo == lyingddata.FromTableSNo && e.FromTable == lyingddata.FromTable && e.AWBSno == lyingddata.AWBSNo && e.ULDStockSNo == cdatasource.options.parentValue) {
                                        return e;
                                    }
                                });
                                if (alreadyprsulddata.length == 0) {
                                    processedawb.push(ToUldShipmentModel);
                                }
                                else {
                                    var alreadyprsship = $.grep(processedawb, function (e, index) {
                                        if (e.FromTableSNo == lyingddata.FromTableSNo && e.FromTable == lyingddata.FromTable && e.AWBSno == lyingddata.AWBSNo && e.ULDStockSNo == cdatasource.options.parentValue) {
                                            e.Pieces = e.Pieces + uldpcs;
                                            e.GrossWeight = parseFloat(e.GrossWeight + uldgr).toFixed(2);
                                            e.VolumeWeight = parseFloat(e.VolumeWeight + uldvol).toFixed(2);
                                            return e;
                                        }
                                    });

                                }
                                if (alreadyexecuteddata.length == 0) {
                                    var ship = {
                                        AWBSNo: lyingddata.AWBSNo,
                                        FromTable: lyingddata.FromTable,
                                        FromTableSNo: lyingddata.FromTableSNo,
                                        FromTableTotalPieces: lyingddata.LIPieces,
                                        ExecutedPieces: uldpcs
                                    };
                                    executedship.push(ship);
                                }
                                for (var i = processedawb.length - 1; i >= 0; i--) {
                                    if (processedawb[i].FromTableSNo == lyingddata.FromTableSNo && processedawb[i].FromTable == lyingddata.FromTable && processedawb[i].AWBSno == lyingddata.AWBSNo && processedawb[i].ULDStockSNo == -1) {
                                        processedawb.splice(i, 1);
                                    }
                                }
                                var remainingPcs = parseInt(lyingddata.Pieces.split('/')[0]) - parseInt(ToUldShipmentModel.Pieces);
                                var ly_gr_wt = 0, ly_vol_wt = 0;
                                if (remainingPcs > 0) {
                                    lyingddata.Pieces = remainingPcs.toString() + "/" + lyingddata.AWBPieces;
                                    /*********Added By Haider************************/
                                    gr_wt = (parseFloat(ToUldShipmentModel.AWBGrossWeight) - ToUldShipmentModel.GrossWeight).toFixed(2);
                                    vol_wt = (parseFloat(ToUldShipmentModel.AWBVolumeWeight) - ToUldShipmentModel.VolumeWeight).toFixed(2);

                                    lyingddata.AWBGrossWeight = gr_wt;
                                    lyingddata.AWBVolumeWeight = vol_wt;
                                    /***********************************************/
                                    lyingddata.GrossWeight = parseFloat(parseFloat(lyingddata.GrossWeight) - parseFloat(ToUldShipmentModel.GrossWeight)).toFixed(2);
                                    lyingddata.VolumeWeight = parseFloat(parseFloat(lyingddata.VolumeWeight) - parseFloat(ToUldShipmentModel.VolumeWeight)).toFixed(2);

                                    closestTr.find("td:eq(" + weightdetailindex + ")").text(lyingddata.AWBGrossWeight + "/" + lyingddata.AWBVolumeWeight);

                                    closestTr.find("td:eq(" + awbpcsindex + ")").text(lyingddata.Pieces);
                                    grControl.val(lyingddata.GrossWeight);
                                    volControl.val(lyingddata.VolumeWeight);
                                    pcsControl.val(remainingPcs.toString());

                                    closestTr.find("td:eq(" + grwtindex + ")").text(lyingddata.GrossWeight);
                                    closestTr.find("td:eq(" + volwtindex + ")").text(lyingddata.VolumeWeight);
                                    closestTr.find("input[type='checkbox']").attr("checked", !closestTr.find("input[type='checkbox']:checked"));

                                    //deleteddata.push(nonulddata);


                                    var offloadeddata = {
                                        AWBSNo: lyingddata.AWBSNo,
                                        AWBNo: lyingddata.AWBNo,
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
                                        AWBVolumeWeight: lyingddata.AWBVolumeWeight

                                    };
                                    processedawb.push({
                                        AWBSno: lyingddata.AWBSNo,
                                        AwbNo: lyingddata.AWBNo,
                                        Pieces: remainingPcs,
                                        GrossWeight: parseFloat(lyingddata.GrossWeight).toFixed(2),
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
                                        AWBOffPoint: FlightNextDestination
                                    });
                                    ///lyingdeleteddata.push(lyingddata);

                                }
                                else {
                                    lyingdeleteddata.push(lyingddata);
                                }
                                var existingshipdata = $.grep(cdatasource.data(), function (e, index) {
                                    if (e.AWBSno == lyingddata.AWBSNo) {
                                        ToUldShipmentModel.GrossWeight = parseFloat(parseFloat(e.GrossWeight) + uldgr).toFixed(2);
                                        ToUldShipmentModel.VolumeWeight = parseFloat(parseFloat(e.VolumeWeight) + uldvol).toFixed(2);
                                        ToUldShipmentModel.Pieces = parseFloat(e.Pieces) + uldpcs;
                                        return e;
                                    }
                                });
                                if (existingshipdata.length == 0) {
                                    /*---------If Child Data does not exists in selected ULD(03-Nov-2016)-------------------------------*/
                                    $(lyingddata).each(function (index, item) {
                                        lyingddata.LoadPieces = parseInt(item.Pieces.split('/')[0]);
                                        lyingddata.LoadGrossWeight = item.GrossWeight;
                                        lyingddata.LoadVol = item.VolumeWeight;
                                        lyingddata.WeightDetail = item.GrossWeight + "/" + item.VolumeWeight;
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
                                //if(usedgrwt > ulddataitem.) 
                                ulddataitem.GrossWeight = usedgrwt.toFixed(2);;
                                ulddataitem.VolumeWeight = usedvolwt.toFixed(2);;
                                ulddataitem.Shipments = parseInt(ulddataitem.Shipments) + 1;
                                ulddataitem.Used = ulddataitem.GrossWeight + " / " + ulddataitem.VolumeWeight;
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
            if (selectedShipmentCount == 0) {
                ShowMessage('warning', 'Warning - Move To ULD', "Select a shipment to move.", "bottom-right");
                return false;
            }
            var dlen = deleteddata.length;
            for (var i = dlen - 1; i >= 0; i--) {
                nonuldgriddatasource.remove(deleteddata[i]);
            }

            var lyingdlen = lyingdeleteddata.length;
            for (var i = lyingdlen - 1; i >= 0; i--) {
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
                BindShipmentOffPoint(ULD_SNo, successshipmentSNo, "MoveToULD");
                SetNumericOnly("txtPcs");
                SetNumericOnly("txtLPcs");
            }
            if (notabletoprocessship != "") {
                //ShowMessage('warning', 'Warning - Moved in ' + ULDType, "Due to SHC restriction " + notabletoprocessship + " unable to process.", "bottom-right");
                ShowMessage('warning', 'Warning - Moved in ' + ULDType, "SHC '" + _sphc + "' can not be loaded in this Aircraft", "bottom-right");
            }
        }
        else {
            ShowMessage('warning', 'Warning - Moved in ULD/BULK', "Select a ULD type to move selected shipments into an ULD.", "bottom-right");

        }
    }
}

function MoveFromUld() {
    var vgrid = cfi.GetCFGrid("divUldShipmentSection");
    var childgrid = null;
    var ULDType = "ULD";
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
                            return e;
                        }
                    });

                    if (alreadyprsulddata.length == 0) { // When All Shipments Pushed in ULD
                        crowdata.AWBGrossWeight = crowdata.GrossWeight;//Farogh Haider
                        crowdata.AWBVolumeWeight = crowdata.VolumeWeight;//Farogh Haider
                        var abc = {
                            AWBSno: crowdata.AWBSno,
                            AwbNo: crowdata.AwbNo,
                            Pieces: crowdata.Pieces,
                            GrossWeight: parseFloat(crowdata.GrossWeight).toFixed(2),
                            VolumeWeight: parseFloat(crowdata.VolumeWeight).toFixed(2),
                            SPHC: crowdata.SPHC,
                            ULDStockSNo: -1,
                            FromTable: crowdata.FromTable,
                            FromTableSNo: crowdata.FromTableSNo,
                            FromTableTotalPieces: crowdata.FromTableTotalPieces,
                            AWBPieces: crowdata.AWBPieces,
                            AWBGrossWeight: parseFloat(crowdata.GrossWeight).toFixed(2),//crowdata.AWBGrossWeight,//Farogh Haider
                            AWBVolumeWeight: parseFloat(crowdata.VolumeWeight).toFixed(2),//crowdata.AWBVolumeWeight,//Farogh Haider
                            OffloadStage: crowdata.OffloadStage,
                            AWBOffPoint: FlightNextDestination
                        };
                        processedawb.push(abc);
                    }
                    else {
                        var alreadyprsship = $.grep(processedawb, function (e, index) {
                            if (e.FromTableSNo == crowdata.FromTableSNo && e.FromTable == crowdata.FromTable && e.AWBSno == crowdata.AWBSno && e.ULDStockSNo == -1) {
                                e.Pieces = parseInt(e.Pieces) + parseInt(crowdata.Pieces);
                                e.FromTableTotalPieces = parseInt(crowdata.FromTableTotalPieces);
                                e.GrossWeight = (parseFloat(e.GrossWeight) + parseFloat(crowdata.GrossWeight)).toFixed(2);
                                e.VolumeWeight = (parseFloat(e.VolumeWeight) + parseFloat(crowdata.VolumeWeight)).toFixed(2);
                                e.AWBGrossWeight = (parseFloat(e.AWBGrossWeight) + parseFloat(crowdata.GrossWeight)).toFixed(2);//Farogh Haider
                                e.AWBVolumeWeight = (parseFloat(e.AWBVolumeWeight) + parseFloat(crowdata.VolumeWeight)).toFixed(2);//Farogh Haider
                                crowdata.AWBGrossWeight = e.AWBGrossWeight;//Farogh Haider
                                crowdata.AWBVolumeWeight = e.AWBVolumeWeight;//Farogh Haider
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
                            WeightDetail: crowdata.AWBGrossWeight + "/" + crowdata.AWBVolumeWeight,
                            ShipmentDetail: crowdata.ShipmentDetail,
                            LoadDetail: "",
                            AWBPieces: crowdata.AWBPieces,
                            AWBGrossWeight: crowdata.AWBGrossWeight,
                            AWBVolumeWeight: crowdata.AWBVolumeWeight,
                            OffloadStage: crowdata.OffloadStage
                        };

                        var existingshipdata = $.grep(pregriddatasource.data(), function (e, index) {
                            if (e.AWBSNo == crowdata.AWBSno && e.FromTable == cdata[trIndex].FromTable && e.FromTableSNo == cdata[trIndex].FromTableSNo) {
                                offloadfromuld.GrossWeight = (parseFloat(e.GrossWeight) + parseFloat(offloadfromuld.GrossWeight)).toFixed(2);
                                offloadfromuld.VolumeWeight = (parseFloat(e.VolumeWeight) + parseFloat(offloadfromuld.VolumeWeight)).toFixed(2);
                                offloadfromuld.LIPieces = parseInt(crowdata.FromTableTotalPieces);
                                offloadfromuld.Pieces = (parseInt(e.Pieces.split('/')[0]) + parseInt(crowdata.Pieces)).toString() + "/" + parseInt(crowdata.AWBPieces);
                                offloadfromuld.LoadPieces = parseInt(offloadfromuld.Pieces.split('/')[0]);
                                offloadfromuld.LoadGrossWeight = parseFloat(offloadfromuld.GrossWeight).toFixed(2);
                                offloadfromuld.LoadVol = parseFloat(offloadfromuld.VolumeWeight).toFixed(2);
                                offloadfromuld.WeightDetail = offloadfromuld.AWBGrossWeight + "/" + offloadfromuld.AWBVolumeWeight;
                                offloadfromuld.Plan = "";//e.Plan;//Farogh Haider
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
                                e.WeightDetail = e.AWBGrossWeight + "/" + e.AWBVolumeWeight;
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
                            WeightDetail: crowdata.AWBGrossWeight + "/" + crowdata.AWBVolumeWeight,
                            ShipmentDetail: crowdata.ShipmentDetail,
                            LoadDetail: "",
                            AWBPieces: crowdata.AWBPieces,
                            AWBGrossWeight: crowdata.AWBGrossWeight,
                            AWBVolumeWeight: crowdata.AWBVolumeWeight
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
                                offloadfromuld.WeightDetail = offloadfromuld.AWBGrossWeight + "/" + offloadfromuld.AWBVolumeWeight;
                                offloadfromuld.Plan = "";//e.Plan;//Farogh Haider
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
                                e.WeightDetail = e.AWBGrossWeight + "/" + e.AWBVolumeWeight;
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
                    //if(usedgrwt > ulddataitem.) 
                    ulddataitem.GrossWeight = usedgrwt.toFixed(2);
                    ulddataitem.VolumeWeight = usedvolwt.toFixed(2);
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
            }

            if (successshipment != "") {
                ShowMessage('success', 'Success - Removed from ' + ULDType, "Selected shipment " + successshipment + " processed successfully.", "bottom-right");
                BindShipmentOffPoint(vgrid.options.parentValue.toString(), successshipmentSNo, "MoveFromULD");
                SetNumericOnly("txtPcs");
                SetNumericOnly("txtLPcs");
            }
        }
        else {
            ShowMessage('warning', 'Warning - Removed from ' + ULDType, "Select a ULD type to move selected shipments into an ULD.", "bottom-right");

        }
    }
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


    var closestTr = $(obj).closest("tr");

    var lipcs = parseInt(closestTr.find("td:eq(" + lipcsindex + ")").text());
    var awbno = closestTr.find("td:eq(" + awbnoindex + ")").text();
    var Pieces = parseInt(closestTr.find("td:eq(" + loaddetailindex + ")").find("input[type='text'][id='txtPcs']").val());
    var data = closestTr.find("td:eq(" + planpcsindex + ")").text();
    var maxpcsplanned = parseInt(data.split('/')[0]);
    var pcsControl = closestTr.find("td:eq(" + loaddetailindex + ")").find("input[type='text'][id='txtPcs']");
    var grControl = closestTr.find("td:eq(" + loaddetailindex + ")").find("input[type='text'][id='txtGross']");
    var volControl = closestTr.find("td:eq(" + loaddetailindex + ")").find("input[type='text'][id='txtVol']");
    var WeightDetail_Label = closestTr.find("td:eq(" + WeightDetailIndex + ")").text();

    //var result= CheckTotalValues(awbno, lipcs, closestTr.find("td:eq(" + awbgrwtindex + ")").text(), closestTr.find("td:eq(" + awbvolwtindex + ")").text(),grControl.val());

    if (Pieces > maxpcsplanned) {
        /*
        $(obj).val('0');
        closestTr.find("td:eq(" + grwtindex + ")").text('0');
        closestTr.find("td:eq(" + volwtindex + ")").text('0');
        grControl.val("0");
        volControl.val("0");*/
        $(obj).val(maxpcsplanned);
        closestTr.find("td:eq(" + grwtindex + ")").text(WeightDetail_Label.split('/')[0]);
        closestTr.find("td:eq(" + volwtindex + ")").text(WeightDetail_Label.split('/')[1]);
        grControl.val(WeightDetail_Label.split('/')[0]);
        volControl.val(WeightDetail_Label.split('/')[1]);
        ShowMessage('warning', 'Warning!', "AWB No. [" + awbno + "] -  Unable to process. Check planned piece.", "bottom-right");
        return false;
    }

    //if (result != "Completed") {
    var TotPcs = maxpcsplanned;//lipcs;//closestTr.find("td:eq(" + awbpcsindex + ")").text();
    var GrosWt = parseFloat(WeightDetail_Label.split('/')[0]);// closestTr.find("td:eq(" + awbgrwtindex + ")").text();
    var VolWt = parseFloat(WeightDetail_Label.split('/')[1]); //closestTr.find("td:eq(" + awbvolwtindex + ")").text();
    closestTr.find("td:eq(" + grwtindex + ")").text(((parseFloat(GrosWt) / TotPcs) * Pieces).toFixed(2));
    closestTr.find("td:eq(" + volwtindex + ")").text(((parseFloat(VolWt) / TotPcs) * Pieces).toFixed(2));
    grControl.val(((parseFloat(GrosWt) / TotPcs) * Pieces).toFixed(2));
    volControl.val(((parseFloat(VolWt) / TotPcs) * Pieces).toFixed(2));
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
    var WeightDetail_Label = closestTr.find("td:eq(" + WeightDetailIndex + ")").text();
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
    var WeightDetail_Label = closestTr.find("td:eq(" + WeightDetailIndex + ")").text();
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

    var closestTr = $(obj).closest("tr");
    var lipcs = parseInt(closestTr.find("td:eq(" + lipcsindex + ")").text());
    var awbno = closestTr.find("td:eq(" + awbnoindex + ")").text();
    var Pieces = parseInt(closestTr.find("td:eq(" + loaddetailindex + ")").find("input[type='text'][id='txtLPcs']").val());
    var pcsControl = closestTr.find("td:eq(" + loaddetailindex + ")").find("input[type='text'][id='txtLPcs']");
    var grControl = closestTr.find("td:eq(" + loaddetailindex + ")").find("input[type='text'][id='txtLGross']");
    var volControl = closestTr.find("td:eq(" + loaddetailindex + ")").find("input[type='text'][id='txtLVol']");
    var WeightDetail_Label = closestTr.find("td:eq(" + WeightDetailIndex + ")").text();

    var data = closestTr.find("td:eq(" + planpcsindex + ")").text();
    var maxpcsplanned = parseInt(data.split('/')[0]);
    if (Pieces > maxpcsplanned) {
        /*
        $(obj).val('0');
        closestTr.find("td:eq(" + grwtindex + ")").text('0');
        closestTr.find("td:eq(" + volwtindex + ")").text('0');
        grControl.val("0");
        volControl.val("0");*/
        $(obj).val(maxpcsplanned);
        closestTr.find("td:eq(" + grwtindex + ")").text(WeightDetail_Label.split('/')[0]);
        closestTr.find("td:eq(" + volwtindex + ")").text(WeightDetail_Label.split('/')[1]);
        grControl.val(WeightDetail_Label.split('/')[0]);
        volControl.val(WeightDetail_Label.split('/')[1]);
        ShowMessage('warning', 'Warning!', "AWB No. [" + awbno + "] -  Unable to process. Check planned piece.", "bottom-right");
        return false;
    }
    var TotPcs = maxpcsplanned;//closestTr.find("td:eq(" + awbpcsindex + ")").text();
    var GrosWt = parseFloat(WeightDetail_Label.split('/')[0]);//closestTr.find("td:eq(" + awbgrwtindex + ")").text();
    var VolWt = parseFloat(WeightDetail_Label.split('/')[1]); //closestTr.find("td:eq(" + awbvolwtindex + ")").text();
    closestTr.find("td:eq(" + grwtindex + ")").text(((parseFloat(GrosWt) / TotPcs) * Pieces).toFixed(2));
    closestTr.find("td:eq(" + volwtindex + ")").text(((parseFloat(VolWt) / TotPcs) * Pieces).toFixed(2));
    grControl.val(((parseFloat(GrosWt) / TotPcs) * Pieces).toFixed(2));
    volControl.val(((parseFloat(VolWt) / TotPcs) * Pieces).toFixed(2));
}

function CheckLyingGrossValues(obj) {
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
    var GrossWeight = parseFloat(obj.value);
    var awbno = closestTr.find("td:eq(" + awbnoindex + ")").text();
    var Pieces_Label = closestTr.find("td:eq(" + planpcsindex + ")").text();
    var WeightDetail_Label = closestTr.find("td:eq(" + WeightDetailIndex + ")").text();
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
    var WeightDetail_Label = closestTr.find("td:eq(" + WeightDetailIndex + ")").text();
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
    //processeduld

    if ($('#RegistrationNo').val() != "" && $('#RegistrationNo').val().length < 1 || $('#RegistrationNo').val() != "" && $('#RegistrationNo').val().length > 10) {
        alert('Aircraft Regn Nbr should be Minimum 1 & Maximum 10 characters.');
        return;
    }

    if ($("#chkFFMRemarks").is(":checked") && $('#Remarks').val().trim() == "") {
        ShowMessage('warning', 'Please Enter ULD Remarks.');
        return;
    }
    else if ($("#IsFFMRemarks").is(":checked") && $('#OverhangOtherInfo').val().trim() == "") {
        ShowMessage('warning', 'Please Enter Overhang Other Info.');
        return;
    }

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
                ShowMessage('warning', 'Please add atleast 1 ULD/Bulk to create Build Up.');
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

        uldstocksnoindex = trHeader.find("th[data-field='ULDStockSNo']").index();
        totalshipmentindex = trHeader.find("th[data-field='Shipments']").index();
        ULDNoIndex = trHeader.find("th[data-field='ULDNo']").index();

        var UldMsg = "";
        var AWBMsg = "";

        $("#divUldShipmentSection").find("tr.k-master-row").each(function () {
            var uldStockSNo = $(this).find("td:eq(" + uldstocksnoindex + ")").text();
            var uldStock_No = $(this).find("td:eq(" + ULDNoIndex + ")").text();
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
                            AWBOffPoint: uldStockSNo == "0" ? $("#Text_AWBOffPoint_" + item.AWBSno).data("kendoAutoComplete").value().trim() : $("#Text_offloadPoint_" + uldStockSNo).data("kendoAutoComplete").value().trim(),
                        }
                        processeduldshipment.push(UldModel);

                        if (uldStockSNo == "0" && $("#Text_AWBOffPoint_" + item.AWBSno).data("kendoAutoComplete").value().trim() == "") {
                            AWBMsg = item.AwbNo.trim() + ", " + AWBMsg;
                        }
                    }
                });
            }
            processeduld.push({
                ULDStockSNo: uldStockSNo,
                //OffloadPoint: $(this).find("input[type='hidden']").val(),
                OffloadPoint: $("#Text_offloadPoint_" + uldStockSNo).data("kendoAutoComplete").value().trim(),
                TotalShipment: $(this).find("td:eq(" + totalshipmentindex + ")").text(),
                IsProcessed: isprocessed
            });

            if (uldStockSNo != "0" && $("#Text_offloadPoint_" + uldStockSNo).data("kendoAutoComplete").value().trim() == "") {
                UldMsg = uldStock_No.trim() + ", " + UldMsg;
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
                FromTableSNo: "0"
            });
        }
        if (processeduldshipment.length == 0) {
            processeduldshipment.push({
                ULDStockSNo: -1,
                AWBSNo: -1
            });
        }


        var GroupFlightSNo = $("#Text_searchFlightNo").data("kendoAutoComplete").key();

        /***********Check Off Point*******************/
        if (UldMsg != "") {
            ShowMessage('warning', 'Warning - ULD Off Point', 'Kindly select Off Point against the ULD No. ' + UldMsg, "bottom-right");
            return;
        }
        if (AWBMsg != "") {
            ShowMessage('warning', 'Warning - BULK Off Point', 'Kindly select Off Point against the Waybill Nbr- ' + AWBMsg, "bottom-right");
            return;
        }
        /*********************************************/


        $.ajax({
            url: "Services/BuildUp/BuildUpProcessService.svc/SaveBuildUpPlan", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ ProcessedULDInfo: processeduld, ProcessedULDShipment: processeduldshipment, ProcessedAWB: processedawb, ProcessedFlightInfo: processedFlightInfo, UpdatedBy: _LoginSNo_, RemovedULD: RemovedULDStockSNo, GroupFlightSNo: GroupFlightSNo, AirportSNo: userContext.AirportSNo }),
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

        if (_BUPSHC == "" && LstULDSPH.length > 0) {
            ShowMessage('warning', 'Kindly select atleast one SHC against the ULD');
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
            ShowMessage('warning', 'Please Enter ULD Information - Height.');
            $("#Height").focus();
            return;
        }
        if ($("#Height").val() != "" && $("#Text_MeasurementUnit").data("kendoAutoComplete").value() == "") {
            ShowMessage('warning', 'Please Select ULD Information -  Measurement Unit.');
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
            if (parseFloat(TotalULDWeight) > parseFloat(ScaleWeight)) {
                ShowMessage('warning', 'Information', "Scale weight cannot be less than Tare Weight (Equipment + ULD)");
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
                ShowMessage('warning', 'Warning - Scale Weight', "Kindly plan shipment in ULD '" + __uldno.trim() + "'");
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
            data: JSON.stringify({ ULDDetails: uldDetails, ULDConsumables: uldConsumables, ULDStockSNo: __uldstocksno, DailyFlightSNo: $("input[type='hidden'][id='FlightNo").val(), UpdatedBy: _LoginSNo_, ULDBuildUpOverhangPallet: Model_ULDBuildUpOverhangPallet, ULDBuildUpOverhangTrans: ULDBuildUpOverhangTrans, CityCode: _CityCode_, ULDGrWT: ULDGrossWeight, ULDVolWT: ULDVolumeWeight, AirportSNo: userContext.AirportSNo, ULDSHC: _BUPSHC }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "") {
                    if (uldDetails.EndTime != "+ Add Time" && uldDetails.EndTime != "") {
                        AddLockInULD(__uldno);
                    }
                    ShowMessage('success', 'Success - ULD Details', "ULD No. [" + __uldno + "] -  processed successfully", "bottom-right");
                    cfi.ClosePopUp("divNewBooking");
                    savetype = "";
                    __uldno = "";
                    __uldstocksno = -1;
                }
                else if (result == "BlankQuantity") {
                    ShowMessage('warning', 'Warning - ULD Details', "Plase enter consumable Quantity.", "bottom-right");
                    return;
                }
                else if (result == "ZeroQuantity") {
                    ShowMessage('warning', 'Warning - ULD Details', "Consumable Quantity should be greater than zero.", "bottom-right");
                    return;
                }
                else if (result == "BlankConsumable") {
                    ShowMessage('warning', 'Warning - ULD Details', "Kindly select consumable Item.", "bottom-right");
                    return;
                }
                else if (result == "SessionExpired") {
                    location.href = 'Account/GarudaLogin.cshtml?islogout=true';
                }
                else if (result == "UWSDone") {
                    ShowMessage('warning', 'Warning - ULD Details', "ULD already processed through UWS process. Amendments restricted");
                }
                else
                    ShowMessage('warning', 'Warning - ULD Details', "ULD No. [" + __uldno + "] -  unable to process. (" + result + ")", "bottom-right");
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - ULD Details', "ULD No. [" + __uldno + "]  -  unable to process.", "bottom-right");

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
}

function detailCollapse(e) {
    var expanededUldStockSno = e.data.ULDStockSNo;
    e.sender.options.parentValue = expanededUldStockSno;
    e.sender.options.storedparentValue = expanededUldStockSno;
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

function BindShipmentOffPoint(ULDNo, AWBSNo, Process) {
    /*------------Bind Shipment Off Point--------------------------*/
    var childID = "div__" + ULDNo;
    var _awbsno = "";
    _awbsno = AWBSNo;

    if (childID == "div__0") { // Bind Only For Bulk Shipment
        $("#" + childID).find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
            var controlId = $(this).attr("id");
            cfi.AutoComplete(controlId.replace("Text_", ""), "DestinationAirportCode", "vBuildupOffPoint", "DestinationAirportCode", "DestinationAirportCode", null, SetCurrentOffPoint, "contains");
        });

        $("#" + childID).find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
            var controlId = $(this).attr("id");
            var value = $("#" + controlId.replace("Text_", "")).val();
            var TextField = $("#" + controlId).val();
            if (Process == "AttachProcessedShipment") {
                $("#" + controlId).data("kendoAutoComplete").setDefaultValue(value, value);
            }

            /*****************Check Saved AWB*********************/
            var _IsExists = false;
            if (IsFlightPremanifested == "True" && CheckULDExists("0")) {
                if (processedawb != null && processedawb.length > 0) {
                    for (i = 0; i < processedawb.length; i++) {
                        if (processedawb[i].AWBSno == controlId.split('_')[2]) {

                            _IsExists = true;
                            break;
                        }
                    }
                    if (_IsExists) {
                        $("#" + controlId).data("kendoAutoComplete").enable(true);
                    }
                    else {
                        $("#" + controlId).data("kendoAutoComplete").enable(false);
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
            $('#' + childID + ' input[id="' + controlId + '"]').hide();
            //$("#" + controlId.replace("Text_", "")).closest('td').hide();
            $('#' + childID + ' input[id="' + controlId.replace("Text_", "") + '"]').closest('td').hide();

        });
        $('#' + childID).find("th[data-field='AWBOffPoint']").hide();
    }
    /*----------------------------------------------------*/
}

function SetCurrentOffPoint(txtId, txt, keyId, key) {
    if (cfi.GetNestedCFGrid("div__0").dataSource.data().length > 0) {
        var awbID = txtId.replace("Text_AWBOffPoint_", "");
        var BulkData = cfi.GetNestedCFGrid("div__0").dataSource.data();
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

function AttachProcessedShipment() {
    var vgrid = cfi.GetCFGrid("divUldShipmentSection");
    var expanededUldStockSno = vgrid.options.parentValue;
    if (vgrid != undefined) {
        var detailgrid = cfi.GetNestedCFGrid("div__" + expanededUldStockSno.toString());

        /*************For BUP Shipment************************/
        $.each(vgrid._data, function (i, item_Data) {
            if (item_Data.IsBUP == "1" || item_Data.Status == "Closed" || item_Data.ULDStatus == "PRE") {
                var dvID = "div__" + item_Data.id.toString();
                //$("#" + dvID +" tr").css('background', '#BEF781');
                $("#" + dvID + " input:checkbox").attr('disabled', true)
            }
        });
        /****************************************************/

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
                    OffloadStage: item.OffloadStage
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
                    OffloadStage: item.OffloadStage
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
                            if (detaildata[i].Pieces == item.Pieces) {
                                detaildata.splice(i, 1);
                            }
                        }
                    }
                }
            }
        });

        BindShipmentOffPoint(expanededUldStockSno, 0, "AttachProcessedShipment");
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
                    WeightDetail: item.AWBGrossWeight + "/" + item.AWBVolumeWeight,
                    ShipmentDetail: item.ShipmentDetail,
                    LoadDetail: "",
                    AWBPieces: item.AWBPieces,
                    AWBGrossWeight: item.AWBGrossWeight,
                    AWBVolumeWeight: item.AWBVolumeWeight,
                };
                var existinginulddata = $.grep(detaildatasource.data(), function (e, index) {
                    if (item.ULDStockSNo > -1 && e.AWBSNo == item.AWBSno && e.AWBNo == item.AwbNo && e.FromTable == offloadfromuld.FromTable && e.FromTableSNo == item.FromTableSNo) {
                        offloadfromuld.GrossWeight = parseFloat(parseFloat(e.GrossWeight) - parseFloat(offloadfromuld.GrossWeight)).toFixed(2);
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
                        return e;
                    }
                });
                if (existinginulddata.length == 0) {
                    lyinggriddatasource.insert(offloadfromuld);
                }
                else {
                    //cdatasource.remove(matchingdataitem[0]);
                    detaildatasource.remove(existinginulddata[0]);
                    detaildatasource.insert(offloadfromuld);
                }
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
var fotter = "<div><table style='margin-left:20px;'>" +
                        "<tbody><tr><td> &nbsp; &nbsp;</td>" +
                            //"<td><button class='btn btn-primary btn-sm' style='width:125px;' id='btnNew'>New Booking</button></td>" +
                            //"<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-success btn-sm'  id='btnSave'>Save</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            //"<td><button class='btn btn-block btn-success btn-sm'  id='btnSaveToNext'>Save &amp; Next</button></td>" +
                            //"<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-danger btn-sm' id='btnCancel' onclick='ResetSearchByFlight();'>Cancel</button></td>" +
                        "</tr></tbody></table> </div>";
var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div class='rows'><div id='divShipmentDetails' style='width:100%'></div><div id='divNewDetail'></div><div id='divNewBooking' style='width:100%;top:0px;margin-top:0px;'></div></div></td></tr></table> </td></tr></table></div>";
//var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divShipmentDetails' style='width:100%'></div></td></tr><tr><td valign='top'><div id='divNewBooking' style='width:100%'></div></td></tr><tr> <td valign='top'> <table style='width:100%'> <tr> <td style='width:15%;' valign='top' class='tdInnerPadding'> <table class='WebFormTable' style='width: 100%; margin: 0px; padding: 0px; display:none; ' id='tblShipmentInfo'> <tr><td class='formSection' colspan='3' >AWB Information</td></tr><tr> <td>AWB No<input type='hidden' id='hdnAWBSNo'/></td><td>:</td><td id='tdAWBNo'></td></tr><tr> <td>AWB Date</td><td>:</td><td id='tdAWBDate'></td></tr><tr> <td>OD</td><td>:</td><td id='tdOD'></td></tr><tr> <td>Flight No</td><td>:</td><td id='tdFlightNo'></td></tr><tr> <td>Flight Date</td><td>:</td><td id='tdFlightDate'></td></tr><tr> <td>Pieces</td><td>:</td><td id='tdPcs'></td></tr><tr> <td>Ch. Wt.</td><td>:</td><td id='tdChWt'></td></tr><tr> <td>Commodity</td><td>:</td><td id='tdCommodity'></td></tr><tr> <td>FBL Wt.</td><td>:</td><td id='tdFBLwt'></td></tr><tr> <td>FWB Wt.</td><td>:</td><td id='tdFWBwt'></td></tr><tr> <td>FOH Wt.</td><td>:</td><td id='tdRCSwt'></td></tr><tr> <td id='IdAWBPrint' colspan='3'><a href='#' onclick='showAWBPrint()'>Print AWB</a></td></tr><tr> <td id='IdAWBlbl' colspan='3'><a href='#' onclick='showAWBlbl()'>Print AWB Label</a></td></tr><tr> <td id='IdAcptNote' colspan='3'><a href='#'>Print Acceptance Note</a></td></tr><tr> <td id='IdEDINote' colspan='3'><a href='#' onclick='ShowEDI()'>EDI Messages</a></td></tr><tr> <td id='IdPayrecpt' colspan='3'><a href='#' onclick='showPayRcpt()'>Print Payment Receipt </a></td></tr></table> </td><td style='width:70%;' valign='top' class='tdInnerPadding'> <div id='tabstrip'> <ul id='ulTab' style='display:none;'> <li class='k-state-active'> Genral </li><li> SPHC Wise </li><li>Tab 3</li><li>Tab 4</li><li>Tab 5</li></ul> <div> <div id='divDetail'></div></div><div> <div id='divDetailSHC'> </div></div><div><div id='divTab3'></div></div><div><div id='divTab4'></div></div><div><div id='divTab5'></div></div></div></div></td></tr></table> </td></tr></table></div>";
var divAirlineULDStock = "<div id='divAirlineULDStock'></div>";
var divShowLI = "<div id='divShowLI'></div>";

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
                $(arrShipment).each(function () {
                    trIndex = $(this).closest("tr").index();
                    if (nonuldgriddata != null) {
                        CurrentSHC = nonuldgriddata[trIndex].SPHC;
                        if (item.SPHC1 == CurrentSHC || item.SPHC2 == CurrentSHC || CurrentSHC.indexOf(item.SPHC1) > -1 || CurrentSHC.indexOf(item.SPHC2) > -1) {
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
            str = str.split('/');
            finallogo = str[3] + "/" + str[4];


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
                AllResult += "<span style='font-weight: bold; font-size:10pt'>Transfer At :</span><span id='spntransferat' style='font-weight: bold; font-size:10pt'>" + ResultData.Table0[0].Destination + "</span>"
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

function CheckUnPlanShipment(obj) {
    var AWBSNo = obj.id.split('_')[1];
    if (obj.checked) {
        $.ajax({
            url: "Services/BuildUp/BuildUpProcessService.svc/CheckOnHoldShipment", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ AWBSNo: AWBSNo }),
            success: function (result) {
               
                    if (result.split('?')[1] == '1') {
                        $(obj).attr("checked", false);
                        ShowMessage('warning', 'Information', result.split('?')[0]);
                        obj.preventDefault();
                    }
                    else if (result.split('?')[1] == '0') {
                        ShowMessage('warning', 'Information', result.split('?')[0]);
                    }
               


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