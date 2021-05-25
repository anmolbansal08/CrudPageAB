var Viewflag = 1;
var NoofReplanNo = 0;
var NoOfREExecutedNo = 0;
var AccountNoofReplanNo
var TPieces = 0;
var TotalPremAmount = 0;
var IsApproveCancelShipment = '';
var ExecutionCompleteforLion = 0;
var HideActionButtonforLion = 0;
var BookingTypeIndexNo = "";
var IsAsAgreedAgent = 0;
var DimensionMandatoryOrNotInEcecutionAtCity = 1;
var IsCCAllowedAirline = "";
var PrefixAirlineName = "";
var ReplanCompleteIndexNo = 0;
var AWBStatusNo = 0;
var BookingRefNo = 0;
var currentprocess = "";
var currentawbsno = 0;
var currentawbno = "";
var currentPrefix = "";
var DimSaved = false;
var AWBReferenceBookingPrimarySNo = 0;
var BookingPrimaryRefNo = "";
var BookingOrigin = "";
var BookingDestination = "";
var AWBStatusDetails = "";
var DGRSPHC = [];
var tblhtml, tblNogHtml;
var AWBFillCarrierCode = "";
var array = [];
var sno = [];
var org = "";
var ArrSelectedDateValue = "";
var ArrSelectedDate = "";
var ArrETATime = "";
var etd, date;
var AWBSPieces = 0;
var AWBSGrossWeight = 0;
var AWBSVolume = 0;
var AWBStock = "";
var SplitLoaded = "";
var IsSplitShipmentAllowed = false;
var resulawbprinttreturn = "0";
var FlightDate = "";
var ETDTime = "";
var hdnBookingMasterRefNo = '0'
var ShipentList = false;
var IsChargeableWt = 0;

$(function () {
    $(document.body).append('<script type="text/javascript" src="../JScript/Shipment/table2excel.js" ></script>');
    LoadNonExecutedBookingDetails();
    $(document.body).append('<div id="divPrintableTBLDetails" style="width: 100%"></div>');
    window.onbeforeunload = function () {
        $('#saveVersionDetails').attr("disabled", "disabled");
    };
  
});

function GetAgentMultiOriginPermission() {
    AgentMultiOriginPermission = '';
    //if (userContext.AgentSNo > 0) {
    $.ajax({
        url: "Services/Report/NonExecutedBookingService.svc/GetAgentMultiOriginPermission",
        async: false,
        type: "GET",
        dataType: "json",
        data: { AgentSNo: userContext.AgentSNo },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    AgentMultiOriginPermission = myData.Table0[0].OriginSNo;
                    OtherAirlineAccess = myData.Table0[0].OtherAirlineAccess;
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
    //}
}

function LoadNonExecutedBookingDetails() {
    _CURR_PRO_ = "NonExecutedBooking";
    $("#divSearch").html("");
    $("#divShipmentDetails").html("");
    $.ajax({
        url: "../Services/Report/NonExecutedBookingService.svc/GetWebForm/" + _CURR_PRO_ + "/Report/NonExecutedBookingSearch/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContent);

           
            cfi.AutoCompleteV2("searchOriginCity", "AirportCode,AirportName", "FreightBookingList_Airport", null, "contains");
           
            cfi.AutoCompleteV2("searchDestinationCity", "AirportCode,AirportName", "FreightBookingList_Airport", null, "contains");
         
            cfi.AutoCompleteV2("searchFlightNo", "FlightNo", "FreightBookingList_Flight", null, "contains");
            
            cfi.AutoCompleteV2("searchAWBPrefix", "AWBPrefix", "FreightBookingList_AWBPrefix", null, "contains");
           
            cfi.AutoCompleteV2("searchAWBNumber", "AWBNumber", "FreightBookingList_AWBNumber", null, "contains");
           
            $("#__tblfblsearch__ tr").append("<td><button class='btn btn-block btn-primary' style='width:90px; height:26px' id='btnInitiateFBR' onclick=FBR();>Initiate FBR</button></td>");
            $("#__tblfblsearch__ tbody").append("<div id='divInitiateFBR'></div>")
            //$('#searchFlightDate').data("kendoDatePicker").value("");
            //cfi.DateType("searchFlightDate");
            $("#searchFlightDate").attr('readonly', true);
            var todaydate = new Date("01/02/2018");
            var validBkTodate = $("#searchFlightDate").data("kendoDatePicker");
            validBkTodate.min(todaydate);

            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });
            $("#btnSearch").bind("click", function () {
                CleanUI();
                ShipmentSearch();
            });
            
        }
    });
}

function InstantiateSearchControl(cntrlId) {
    $("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("input[type='text']").each(function () {
        var controlId = $(this).attr("id");
        var decimalPosition = cfi.IsValidNumeric(controlId);
        if (decimalPosition >= -1) {
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

    //$("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
    //    var controlId = $(this).attr("id");
    //    cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), _DefaultAutoComplete_);
    //});
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
}
//function InitializePage(subprocess, cntrlid, isdblclick) {
//    $("#tblShipmentInfo").show();
//    InstantiateControl(cntrlid);
//    if (subprocess.toUpperCase() == "FBL") {
//        BindFBLSection();
//        //$("#btnSave").unbind("click").bind("click", function () {
//        //    if (cfi.IsValidSection(cntrlid)) {
//        //        if (SaveFormData(subprocess)) {
//        //            ShipmentSearch();
//        //        }

//        //    } else {
//        //        return false;
//        //    }
//        //});
//        //$("#btnSaveToNext").unbind("click").bind("click", function () {
//        //    if (cfi.IsValidSection(cntrlid)) {
//        //        if (SaveFormData(subprocess)) {
//        //            $("#divDetailSHC").html("");
//        //            $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(1);
//        //            ShowProcessDetailsNew("RATE", "divDetailSHC", isdblclick);
//        //        }

//        //    } else {
//        //        return false;
//        //    }

//        //});
//        //// Disable Save & Next button tempor..
//        //$("#btnSaveToNext").unbind("click");
//        //return false;
//    }

//}

function ShipmentSearch() {
    var AWBNumber = $('#searchAWBNumber').val() == "" ? "0" : $('#searchAWBNumber').val();
    var OriginCity = $("#searchOriginCity").val() == "" ? "0" : $("#searchOriginCity").val();
    var DestinationCity = $("#searchDestinationCity").val() == "" ? "0" : $("#searchDestinationCity").val();
    var FlightNo = $("#searchFlightNo").val() == "" ? "A~A" : $("#searchFlightNo").val().trim();
    var FlightDate = "0";
    if ($("#searchFlightDate").val() != "") {
        FlightDate = cfi.CfiDate("searchFlightDate") == "" ? "0" : cfi.CfiDate("searchFlightDate");// "";//month + "-" + day + "-" + year;
    }

    var AWBPrefix = $("#searchAWBPrefix").val() == "" ? "A~A" : $("#searchAWBPrefix").val();
    var AWBNo = $("#searchAWBNo").val() == "" ? "A~A" : $("#searchAWBNo").val();
    var LoggedInCity = userContext.CityCode;
    cfi.ShowIndexView("divShipmentDetails", "../Services/Report/NonExecutedBookingService.svc/GetGridData/" + _CURR_PRO_ + "/Report/NonExecutedBooking/" + AWBNumber+"/" + OriginCity + "/" + DestinationCity + "/" + FlightNo + "/" + FlightDate);
    //setTimeout(function () {
    //    if (userContext.SpecialRights.SENDFBL == true) {

    //        $("input[type='button'][title='SEND FBL']").show()
    //    }
    //    else {

    //        $("input[type='button'][title='SEND FBL']").hide()

    //    }
    //    if (userContext.SpecialRights.PRINT == true) {

    //        $("input[type='button'][title='Print Booking List']").show()
    //    }
    //    else {

    //        $("input[type='button'][title='Print Booking List']").hide()

    //    }
    //    if (userContext.SpecialRights.VERSION == true) {

    //        $("input[type='button'][title='Booking List Version']").show()
    //    }
    //    else {

    //        $("input[type='button'][title='Booking List Version']").hide()

    //    }
    //}, 1000);
    var isView = false, IsBlocked = false;
    //setTimeout(function () {
    //    $(userContext.ProcessRights).each(function (i, e) {
    //        if (e.SubProcessSNo == 2078) {
    //            isView = e.IsView;
    //            return;
    //        }
    //    });
    //    if (isView) {
    //        $("input[type='button'][title='SEND FBL']").attr("disabled", true)
    //    }
    //    else {
    //        $("input[type='button'][title='SEND FBL']").attr("disabled", false)

    //    }
    //}, 2000)

}

var divContent = "<div class='rows'><table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divShipmentDetails' style='width:100%'></div></td></tr><tr><td valign='top'><div id='divNewBooking' style='width:100%'></div></td></tr><tr> <td valign='top'> <div id='divDetail'></div></td></tr></table></div>";//<option value='EDI'>EDI Messages</option>

function checkProgrss(item, subprocess, displaycaption) {
}
var ServiceableProduct = [];
function FormDataBind(Action, ProcessNameDetails) {
    HideActionButtonforLion = 0;
    if (Action == "NEW" || Action == "COPY")
        AWBStatusNo = 0;
    $.ajax({
        url: 'HtmlFiles/Shipment/NonExecutedBooking.html', cache: false,
        success: function (result) {
            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });
            $("#divContent1").remove()
            $('#aspnetForm').append(result);
            $('#aspnetForm').append(NogDiv);
            InstantiateControl("htmldivdetails");
            PageLoaded("COPY", ProcessNameDetails);
            $("#btnExecute").unbind("click").bind("click", function () {
                ApplyRequired();
                if (SaveData(ProcessNameDetails)) {
                     ShipmentSearch();
                    CleanUI();
                    AWBStatusDetails = "";
                  //  LoadNonExecutedBookingDetails();
                }
            });

            $("#btnCancel").unbind("click").bind("click", function () {
                ShipmentSearch();
                CleanUI();
                AWBStatusDetails = "";
               // LoadNonExecutedBookingDetails();

            });
        }
    });
    
   

}

function PageLoaded(Action, ProcessName) {


    cfi.AutoCompleteV2("AWBCode", "AirlineCode", "Reservation_Airline", GetItineraryCarrierCode, "contains");
    cfi.AutoCompleteV2("Product", "ProductName", "Reservation_Product", ClearPriority, "contains");
    var ChargeCodeSource = [{ Key: "1", Text: "PP" }, { Key: "2", Text: "CC" }];
    cfi.AutoCompleteByDataSource("ChargeCode", ChargeCodeSource, CheckIsCCAllowed, null);
    cfi.AutoCompleteV2("AWBOrigin", "CityCode,CityName", "Reservation_City1", SelectedAWBOriginDestination, "contains");
    cfi.AutoCompleteV2("AWBOrigin1", "CityCode,CityName", "Reservation_City1", null, "contains");
    cfi.AutoCompleteV2("AWBDestination", "CityCode,CityName", "Reservation_City1", SelectedAWBOriginDestination, "contains");
    cfi.AutoCompleteV2("AWBOffice", "Name", "Reservation_Office", null, "contains");
    cfi.AutoCompleteV2("AWBAgent", "Name", "Reservation_Agent", CheckValidAWBNumber, "contains");
    var UMSource = [{ Key: "0", Text: "K" }, { Key: "1", Text: "L" }];
    cfi.AutoCompleteByDataSource("UM", UMSource);
    if (userContext.SysSetting.ICMSEnvironment == 'JT')
        cfi.AutoCompleteV2("Priority", "Code,PriorityName", "Reservation_vwPriority", null, "contains");
    else
        cfi.AutoCompleteV2("Priority", "Code,PriorityName", "Reservation_Priority", null, "contains");

    //cfi.AutoCompleteV2("HSCode", "HSCode,DescriptionOFGoods", "Reservation_HSCode", null, "contains", ",", null, null, null, HSCodeDetails, true);
    cfi.AutoCompleteV2("Commodity", "CommodityCode,CommodityDescription", "Reservation_Commodity", FillCommoditySHC, "contains");
    cfi.AutoCompleteV2("SHC", "CODE,Description", "Reservation_SPHC1", null, "contains", ",", null, null, null, SHCDetails, true);
    cfi.AutoCompleteV2("ItineraryOrigin", "AirportCode,AirportName", "Reservation_Airport", CheckPiecesOnOD, "contains");
    cfi.AutoCompleteV2("ItineraryDestination", "AirportCode,AirportName", "Reservation_Airport", CheckPiecesOnOD, "contains");
    cfi.AutoCompleteV2("ItineraryCarrierCode", "CarrierCode", "Reservation_Airline1", IsItineraryCarrierCodeInterline, "contains");
    cfi.AutoCompleteV2("ItineraryFlightNo", "FlightNo", "Reservation_searchFlightNo", null, "contains");
    cfi.DateType("ItineraryDate", true);
    cfi.AutoCompleteV2("ItineraryTransit", "AirportCode,AirportName", "Reservation_Airport", null, "contains");
    cfi.AutoCompleteV2("SHIPPER_AccountNo", "CustomerNo", "Reservation_ShipperConsignee", GetShipperConsigneeDetails, "contains", null, null, null, null, null, null, null, true);
    cfi.AutoCompleteV2("SHIPPER_CountryCode", "CountryCode,CountryName", "Reservation_ShipperConsigneeCountryCode", null, "contains");
    cfi.AutoCompleteV2("SHIPPER_City", "CityCode,CityName", "Reservation_City", null, "contains");
    cfi.AutoCompleteV2("CONSIGNEE_AccountNo", "CustomerNo", "Reservation_ShipperConsignee", GetShipperConsigneeDetails, "contains", null, null, null, null, null, null, null, true);
    cfi.AutoCompleteV2("CONSIGNEE_CountryCode", "CountryCode,CountryName", "Reservation_ShipperConsigneeCountryCode", null, "contains");
    cfi.AutoCompleteV2("CONSIGNEE_City", "CityCode,CityName", "Reservation_City", null, "contains");
    $("#ApplicationTabs").kendoTabStrip();
    if (userContext.SysSetting.ICMSEnvironment != 'JT')
        $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").disable($('#litermsandcondtion'));
    //if(userContext.SysSetting.ExecutionByPass == '1')
    //	$("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").enable($('#liCustoms'));
    //else
    //$("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").disable($('#liCustoms'));
    if (userContext.SysSetting.ICMSEnvironment == 'JT') {
        $('a#ahref_CallerCode').remove();
        $('#lblbupintact').remove();
        $('#chkIsBUP').remove();
        if (userContext.UserTypeName.toUpperCase() == "AGENT") {
            $('#ItineraryPieces').attr("disabled", "disabled");
            $('#_tempItineraryPieces').attr("disabled", "disabled");
            $('#ItineraryGrossWeight').attr("disabled", "disabled");
            $('#_tempItineraryGrossWeight').attr("disabled", "disabled");

        }
    }
    //if (userContext.SysSetting.ICMSEnvironment == 'JT' && AWBStatusNo >= 5) {
    //    $("#liPti").css("display", "");
    //}
    $('#AWBNoofBUPIntact').remove();
    $('#_tempAWBNoofBUPIntact').remove();
    $("#AWBNumber").unbind("blur").bind("blur", function () {
        if (Action == "NEW" || Action == "COPY")
            CheckValidAWBNumber();
    });
    $("#AWBPieces").unbind("blur").bind("blur", function () {
        CalculatedPieces();
    });
    $("#NoofHouse").unbind("blur").bind("blur", function () {
        NoofHousePieces();
    });
    $("#AWBNoofBUP").unbind("blur").bind("blur", function () {
        CalculatedBUPPieces('AWBNoofBUP');
    });
    $("#AWBNoofBUPIntact").unbind("blur").bind("blur", function () {
        CalculatedBUPPieces('AWBNoofBUPIntact');
    });
    $("#AWBChargeableWeight").bind("blur", function () {
        compareGrossVolValue();
    });
    $("#AWBGrossWeight").bind("blur", function () {
        if ($("#Text_Commodity").data("kendoAutoComplete").key() != "") {
            BindMinimumChWt();
        }
        CalculateGrossVolumeWeight(this);
    });
    $("#AWBCBM").bind("blur", function () {
        CalculateShipmentChWt(this);
    });
    $("#AWBVolumeWeight").bind("blur", function () {
        CalculateShipmentCBM();
    });
    $("#ItineraryPieces").unbind("blur").bind("blur", function () {
        ItineraryPieces();
    });
    $("#ItineraryGrossWeight").bind("blur", function () {
        ItineraryGrossWeight();
    });
    $("#ItineraryVolumeWeight").bind("blur", function () {
        ItineraryCBM();
    });
    $("#ItineraryMainVolumeWeight").bind("blur", function () {
        ItineraryMainVolumeWeight();
    });
    $("div[id^='divMultiSHC']").css("overflow", "auto");
    $("div[id^='divMultiSHC']").css("width", "15em");
    $("#btnNew").css("display", "none");
    $("#tdItineraryInterlineFlightNo").css("display", "none");
    if (userContext.AgentSNo > 0 || userContext.OfficeSNo > 0) {
        if (userContext.GroupName != "POS-OPS" && userContext.GroupName != "POS-KSO" && userContext.GroupName != "POS-CSC") {
            $("#tdBCT").css("display", "none");
            $("#tdMCT").css("display", "none");
        }
    }
   if (Action != "UPDATE") {
      
        $("#btnExecute").css("display", "block");
       
        if (userContext.AirlineName != null && userContext.AirlineName != "") {
            if (userContext.AirlineName.length > 6) {
                $("#Text_AWBCode").data("kendoAutoComplete").setDefaultValue(userContext.AirlineName.split('-')[0], userContext.AirlineName.split('-')[0]);
                GetItineraryCarrierCode(userContext.AirlineName.split('-')[0]);
            }
        }
     
        $.ajax({
            url: "Services/Report/NonExecutedBookingService.svc/GenerateAndGetReferenceNumber",
            async: false,
            type: "GET",
            dataType: "json",
            data: { BookingRefNo: 'GenerateAndGetReferenceNumber' },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                       hdnBookingMasterRefNo=myData.Table0[0].ReferenceNumber;
                       
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
        $.ajax({
            url: "Services/Report/NonExecutedBookingService.svc/GetCompleteReservationData",
            async: false,
            type: "GET",
            dataType: "json",
            data: {               
                AWBNo: currentawbno
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    var shipperData = myData.Table1;
                    var consigneeData = myData.Table2;
                    var Itinerary = myData.Table3;

                    if (myData.Table0.length > 0) {
                        if (userContext.SysSetting.ICMSEnvironment == 'JT' && myData.Table0[0].AsAgreed == "True") {
                            if (userContext.SpecialRights.ASAGREED == true) { }
                            else
                                $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").disable($('#liRate'));
                        }
                        if (myData.Table0[0].BookingType == "1")
                            $("#Text_Product").data("kendoAutoComplete").enable(false);
                        $('input[name=BookingType][value=' + myData.Table0[0].BookingType + ']').attr('checked', true);
                        $('input[name=AWBStock][value=' + myData.Table0[0].AWBStock + ']').attr('checked', true);
                        $("#Text_AWBCode").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].AWBPrefix, myData.Table0[0].AWBPrefix);
                        $("#AWBNumber").val(myData.Table0[0].AWBNo);
                        $("#_tempAWBNumber").val(myData.Table0[0].AWBNo);
                        $("#Text_ChargeCode").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].PaymentType, myData.Table0[0].PaymentType == 1 ? 'PP' : 'CC');
                        $("#Text_Product").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].ProductSNo, myData.Table0[0].ProductName);
                        $("#Text_AWBOrigin").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].OriginCitySNo, myData.Table0[0].OriginCityCode + '-' + myData.Table0[0].OriginCityName);
                        $("#Text_AWBDestination").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].DestinationCitySNo, myData.Table0[0].DestinationCityCode + '-' + myData.Table0[0].DestinationCityName);
                        $("#Text_AWBAgent").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].AccountSNo, myData.Table0[0].Text_AccountSNo);
                        $("#Text_UM").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].GrossUnit == 'False' ? 0 : 1, myData.Table0[0].GrossUnit == 'False' ? 'K' : 'L');
                        if (myData.Table0[0].PrioritySNo != "" && myData.Table0[0].PrioritySNo != "0")
                            $("#Text_Priority").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].PrioritySNo, myData.Table0[0].PriorityCode + '-' + myData.Table0[0].PriorityName);
                        $("#Text_Commodity").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].CommoditySNo, myData.Table0[0].CommodityCode + '-' + myData.Table0[0].CommodityDescription);
                        cfi.BindMultiValue("SHC", myData.Table0[0].Text_SHC, myData.Table0[0].SHC)
                        $("#SHC").val(myData.Table0[0].SHC);
                        $("#NatureOfGoods").val(myData.Table0[0].NatureOfGoods);
                        $("#NoofHouse").val(myData.Table0[0].NoofHouse == "0" ? "" : myData.Table0[0].NoofHouse);
                        $("#_tempNoofHouse").val(myData.Table0[0].NoofHouse == "0" ? "" : myData.Table0[0].NoofHouse);
                        $("#AWBPieces").val(myData.Table0[0].AWBPieces);
                        $("#_tempAWBPieces").val(myData.Table0[0].AWBPieces);
                        $("#AWBGrossWeight").val(myData.Table0[0].GrossWeight);
                        $("#_tempAWBGrossWeight").val(myData.Table0[0].GrossWeight);
                        $("#AWBCBM").val(myData.Table0[0].Volume);
                        $("#_tempAWBCBM").val(myData.Table0[0].Volume);
                        $("#AWBVolumeWeight").val(myData.Table0[0].VolumeWeight);
                        $("#_tempAWBVolumeWeight").val(myData.Table0[0].VolumeWeight);
                        $("#AWBChargeableWeight").val(myData.Table0[0].ChargeableWeight);
                        $("#_tempAWBChargeableWeight").val(myData.Table0[0].ChargeableWeight);
                        $("#hdnHandlingInformation").val(myData.Table0[0].HandlingInformation);
                        DimensionMandatoryOrNotInEcecutionAtCity = myData.Table0[0].IsDimensioMandatoryAtCity == 'False' ? 0 : 1;
                        IsAsAgreedAgent = myData.Table0[0].AsAgreed == 'True' ? 1 : 0;
                        if (myData.Table0[0].IsBUP == "True") {
                            $("#chkIsBUP").prop('checked', true);
                            //$("#tdAWBNoofBUP").css("display", "none");
                            $("#tdAWBNoofBUP").css("display", "block");

                            if (myData.Table0[0].BupPieces > 0) {
                                $("#AWBNoofBUP").attr("data-valid", "min[1],required");
                                $("#AWBNoofBUP").val(myData.Table0[0].BupPieces == "0" ? "" : myData.Table0[0].BupPieces);
                                $("#_tempAWBNoofBUP").val(myData.Table0[0].BupPieces == "0" ? "" : myData.Table0[0].BupPieces);
                                $("#AWBNoofBUPIntact").val('');
                                $("#_tempAWBNoofBUPIntact").val('');
                                $("#AWBNoofBUPIntact").attr('disabled', true);
                                $("#_tempAWBNoofBUPIntact").attr('disabled', true);
                            }
                            else if (myData.Table0[0].BupIntactPieces > 0) {
                                $("#AWBNoofBUPIntact").attr("data-valid", "min[1],required");
                                $("#AWBNoofBUPIntact").val(myData.Table0[0].BupIntactPieces == "0" ? "" : myData.Table0[0].BupIntactPieces);
                                $("#_tempAWBNoofBUPIntact").val(myData.Table0[0].BupIntactPieces == "0" ? "" : myData.Table0[0].BupIntactPieces);
                                $("#AWBNoofBUP").val('');
                                $("#_tempAWBNoofBUP").val('');
                                $("#AWBNoofBUP").attr('disabled', true);
                                $("#_tempAWBNoofBUP").attr('disabled', true);
                            }
                            else {
                                $("#AWBNoofBUP").val('');
                                $("#_tempAWBNoofBUP").val('');
                                $("#AWBNoofBUP").attr('disabled', false);
                                $("#_tempAWBNoofBUP").attr('disabled', false);
                                $("#AWBNoofBUPIntact").val('');
                                $("#_tempAWBNoofBUPIntact").val('');
                                $("#AWBNoofBUPIntact").attr('disabled', false);
                                $("#_tempAWBNoofBUPIntact").attr('disabled', false);
                            }

                            if (myData.Table0[0].BookingRefULDDimensionCount == 1) {
                                $("#AWBVolumeWeight").attr('disabled', true);
                                $("#_tempAWBVolumeWeight").attr('disabled', true);
                               // $("#AWBCBM").attr('disabled', true);
                              //  $("#_tempAWBCBM").attr('disabled', true);
                            }
                        }
                        else {
                            $("#AWBNoofBUP").val('');
                            $("#_tempAWBNoofBUP").val('');
                            $("#tdAWBNoofBUP").css("display", "none");
                            $("#AWBNoofBUP").removeAttr("data-valid");
                            $("#_tempAWBNoofBUP").removeAttr("class");
                            $("#_tempAWBNoofBUP").attr("class", "k-formatted-value k-input transSection k-state-default");

                            $("#AWBNoofBUPIntact").val('');
                            $("#_tempAWBNoofBUPIntact").val('');
                            $("#AWBNoofBUPIntact").removeAttr("data-valid");
                            $("#_tempAWBNoofBUPIntact").removeAttr("class");
                            $("#_tempAWBNoofBUPIntact").attr("class", "k-formatted-value k-input transSection k-state-default");

                            if (myData.Table0[0].BookingRefDimensionCount == 1) {
                                $("#AWBVolumeWeight").attr('disabled', true);
                                $("#_tempAWBVolumeWeight").attr('disabled', true);
                             //   $("#AWBCBM").attr('disabled', true);
                              //  $("#_tempAWBCBM").attr('disabled', true);
                            }
                        }
                        if (myData.Table0[0].IsRoutingComplete == "True") {
                            $("#chkIsRoutingComplete").prop('checked', true);
                        }
                        $("#hdnCallerCode").val(myData.Table0[0].CallerCode);
                        if (myData.Table0[0].IsMarineInsurance == "1") {
                            $("#chkInsurance").prop('checked', true);
                            $("#liInsurance").css("display", "");
                            $("#lbliece").text(myData.Table0[0].AWBPieces);
                            $("#lblweight").text(myData.Table0[0].GrossWeight);
                            $("#InsuranceCertificate").css("display", "");
                        }
                        var theDiv = document.getElementById("divUserDetails");
                        theDiv.innerHTML = "";
                        var table = "";
                        //table = "<table  border='1' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='2'>User Action Information</td></tr>";
                        //table += "<tr><td style='text-align: left;'>Created By : " + myData.Table0[0].CreatedUser + "</td><td style='text-align: right;'>Updated By : " + myData.Table0[0].UpdatedUser + "</td></tr></table>";
                        table = "<table  border='1' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' style='text-align: left;'>Created By : " + myData.Table0[0].CreatedUser + "</td><td class='formSection' style='text-align: right;'>Updated By : " + myData.Table0[0].UpdatedUser + "</td></tr></table>";
                        theDiv.innerHTML = table;
                    }
                    if (shipperData.length > 0) {
                        $("#hdnShipperSNo").val(shipperData[0].SNo);
                        $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperAccountNo, shipperData[0].CustomerNo);
                        if (shipperData[0].ShipperAccountNo != "") {
                            $("#chkSHIPPER_AccountNo").closest('td').hide();
                            $("#chkShipper").attr('disabled', true);
                            $("#chkShipper").removeAttr("title");
                        }
                        $("#SHIPPER_Name").val(shipperData[0].ShipperName);
                        $("#SHIPPER_Name2").val(shipperData[0].ShipperName2);
                        $("#SHIPPER_Street").val(shipperData[0].ShipperStreet);
                        $("#SHIPPER_Street2").val(shipperData[0].ShipperStreet2);
                        $("#SHIPPER_TownLocation").val(shipperData[0].ShipperLocation);
                        $("#SHIPPER_State").val(shipperData[0].ShipperState);
                        $("#SHIPPER_PostalCode").val(shipperData[0].ShipperPostalCode);
                        $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCountryCode == "" ? "" : shipperData[0].ShipperCountryCode, shipperData[0].ShipperCountryCode == "" ? "" : shipperData[0].CountryCode + '-' + shipperData[0].ShipperCountryName);
                        $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCity == "" ? "" : shipperData[0].ShipperCity, shipperData[0].ShipperCity == "" ? "" : shipperData[0].CityCode + '-' + shipperData[0].ShipperCityName);
                        $("#SHIPPER_MobileNo").val(shipperData[0].ShipperMobile);
                        $("#SHIPPER_MobileNo2").val(shipperData[0].ShipperMobile2);
                        $("#SHIPPER_Email").val(shipperData[0].ShipperEMail);
                        $("#SHipper_Fax").val(shipperData[0].Fax);
                        $("#SHipper_GarudaMiles").val(shipperData[0].GarudaMiles);
                        $("#_tempSHipper_GarudaMiles").val(shipperData[0].GarudaMiles);
                        $("#_tempSHIPPER_MobileNo").val(shipperData[0].ShipperMobile);
                        $("#_tempSHipper_Fax").val(shipperData[0].Fax);
                    }
                    if (consigneeData.length > 0) {
                        $("#hdnConsigneeSNo").val(consigneeData[0].SNo);
                        $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeAccountNo, consigneeData[0].CustomerNo);
                        if (consigneeData[0].ConsigneeAccountNo != "") {
                            $("#chkCONSIGNEE_AccountNo").closest('td').hide();
                            $("#chkconsignee").attr('disabled', true);
                            $("#chkconsignee").removeAttr("title");
                        }
                        $("#CONSIGNEE_AccountNoName").val(consigneeData[0].ConsigneeName);
                        $("#CONSIGNEE_AccountNoName2").val(consigneeData[0].ConsigneeName2);
                        $("#CONSIGNEE_Street").val(consigneeData[0].ConsigneeStreet);
                        $("#CONSIGNEE_Street2").val(consigneeData[0].ConsigneeStreet2);
                        $("#CONSIGNEE_TownLocation").val(consigneeData[0].ConsigneeLocation);
                        $("#CONSIGNEE_State").val(consigneeData[0].ConsigneeState);
                        $("#CONSIGNEE_PostalCode").val(consigneeData[0].ConsigneePostalCode);
                        $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCity == "" ? "" : consigneeData[0].ConsigneeCity, consigneeData[0].ConsigneeCity == "" ? "" : consigneeData[0].CityCode + '-' + consigneeData[0].ConsigneeCityName);
                        $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCountryCode == "" ? "" : consigneeData[0].ConsigneeCountryCode, consigneeData[0].ConsigneeCountryCode == "" ? "" : consigneeData[0].CountryCode + '-' + consigneeData[0].ConsigneeCountryName);
                        $("#CONSIGNEE_MobileNo").val(consigneeData[0].ConsigneeMobile);
                        $("#CONSIGNEE_MobileNo2").val(consigneeData[0].ConsigneeMobile2);
                        $("#CONSIGNEE_Email").val(consigneeData[0].ConsigneeEMail);
                        $("#CONSIGNEE_Fax").val(consigneeData[0].Fax);
                        $("#_tempCONSIGNEE_MobileNo").val(consigneeData[0].ConsigneeMobile);
                        $("#_tempCONSIGNEE_Fax").val(consigneeData[0].Fax);
                    }
                    if (Itinerary.length > 0) {
                        for (var i = 0; i < Itinerary.length; i++) {
                            var SoftEmbargo = "0";
                            $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue(Itinerary[i].OriginAirportSNo == "" ? "" : Itinerary[i].OriginAirportSNo, Itinerary[i].OriginAirportSNo == "" ? "" : Itinerary[i].OriginAirportCode + '-' + Itinerary[i].OriginAirportName);
                            $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue(Itinerary[i].DestinationAirportSNo == "" ? "" : Itinerary[i].DestinationAirportSNo, Itinerary[i].DestinationAirportSNo == "" ? "" : Itinerary[i].DestinationAirportCode + '-' + Itinerary[i].DestinationAirportName);
                            $("#ItineraryPieces").val(Itinerary[i].FlightPieces)
                            $("#_tempItineraryPieces").val(Itinerary[i].FlightPieces)
                            $("#ItineraryGrossWeight").val(Itinerary[i].FlightGrWeight)
                            $("#_tempItineraryGrossWeight").val(Itinerary[i].FlightGrWeight)
                            $("#ItineraryVolumeWeight").val(Itinerary[i].FlightVolume)
                            $("#_tempItineraryVolumeWeight").val(Itinerary[i].FlightVolume)
                            $("#ItineraryMainVolumeWeight").val(Itinerary[i].FlightVolumeWeight)
                            $("#_tempItineraryMainVolumeWeight").val(Itinerary[i].FlightVolumeWeight)
                            if (Itinerary[i].IsSoftEmbargoApply == "True")
                                SoftEmbargo = "1"
                            SelectdRoute(Itinerary[i].DailyFlightSNo, 'SearchFlight', 'UPDATE', Itinerary[i].AllotmentSNo, Itinerary[i].AllotementCode, '0', Itinerary[i].RouteStatus, Itinerary[i].Status, SoftEmbargo, Itinerary[i].OverrideBCT, Itinerary[i].OverrideMCT);
                        }

                    }
                    if (myData.Table0[0].HSCode != "" && myData.Table0[0].Text_HSCode != "") {
                        HSCode = myData.Table0[0].HSCode;
                        Text_HSCode = myData.Table0[0].Text_HSCode;
                    }
                    if (userContext.SysSetting.IsAWBReservationMarineInsurance == '1' && AWBStatusNo >= 4)
                        $("#lblinsurance").css("display", "");
                    if ($('input:radio[name=AWBStock]:checked').val() === '0') {
                        $('#AWBNumber').removeAttr("disabled");
                    } else if ($('input:radio[name=AWBStock]:checked').val() === '1') {
                        $('#AWBNumber').attr('disabled', true);
                    }
                    if (AWBStatusNo > 5 && AWBStatusNo != 15) {       //No Show Work Commented
                        //if (AWBStatusNo > 5) {
                        var table44 = document.getElementById("tblSelectdRouteResult");
                        if (table44 != null && table44.rows.length > 1) {
                            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                $(tr).find("button[id^='Delete_']").css("display", "none");
                            });
                        }
                    }

                    if (Action == "UPDATE" && AWBStatusDetails == "Cancel" && AWBStock == 'YES' && userContext.SysSetting.ICMSEnvironment == 'GA') {
                        var table123 = document.getElementById("tblSelectdRouteResult");
                        if (table123 != null && table123.rows.length > 1) {
                            ClearItineraryRoute();
                        }
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
       

        
    }
 
               

 
    //if (userContext.SysSetting.ICMSEnvironment == 'JT' && AWBStatusNo == 15) {
    //    if (userContext.SysSetting.ICMSEnvironment == 'JT' && AWBStatusNo == 15 && IsApproveCancelShipment == 'True') { }
    //    else {
    //        $("#btnSave").css("display", "none");
    //        $("#btnUpdate").css("display", "none");
    //        //$("#btnCopyBooking").css("display", "none");
    //        $("#btnExecute").css("display", "none");

    //        $("#AddDimension").css("display", "none");

    //        $("#ItineraryViewRoute").css("display", "none");
    //        $("#ItinerarySearch").css("display", "none");
    //        $("#btnClearItineraryRoute").css("display", "none");
    //        $("#tblItinerary").css("display", "none");
    //        var table = document.getElementById("tblSelectdRouteResult");
    //        if (table != null && table.rows.length > 1) {
    //            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
    //                $(tr).find("button[id^='Delete_']").css("display", "none");
    //            });
    //        }
    //        ShowMessage('warning', 'Information!', "Air Waybill is already marked as NO SHOW. Cannot be executed again.");
    //    }
    //}
    //if (AWBStatusNo == 15)       //No Show Work Commented
    //    ClearItineraryRoute();
    //if (userContext.AgentSNo > 0 && AWBStatusDetails != "Booked" && AWBStatusDetails != "BKD" && AWBStatusDetails != "" && (Action != "NEW" || Action != "COPY")) {
    //    $("#btnSave").css("display", "none");
    //    $("#btnUpdate").css("display", "none");
    //    $("#btnCopyBooking").css("display", "block");
    //    if (userContext.SysSetting.ICMSEnvironment != 'JT') {
    //        $("#btnExecute").css("display", "none");
    //        $("#AddDimension").css("display", "none");

    //        $("#ItineraryViewRoute").css("display", "none");
    //        $("#ItinerarySearch").css("display", "none");
    //        $("#btnClearItineraryRoute").css("display", "none");
    //        $("#tblItinerary").css("display", "none");
    //        var table = document.getElementById("tblSelectdRouteResult");
    //        if (table != null && table.rows.length > 1) {
    //            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
    //                $(tr).find("button[id^='Delete_']").css("display", "none");
    //            });
    //        }
    //    }
    //}
    //if (userContext.AgentSNo > 0)
    GetAgentMultiOriginPermission();
}
function BindEvents(obj, e, isdblclick) {
    $("#MainDiv").remove()
    $("#ApplicationTabs-1").html('');  
    $("#ApplicationTabs").show();
 
    ResetDetails();
    $("#btnCancel").unbind("click").bind("click", function () {
        $("#ApplicationTabs-1").html("");
         $("#ApplicationTabs").hide();
        ResetDetails();
        $("#hdnBookingSNo").val('');
        $("#hdnBookingMasterRefNo").val('');
        currentawbsno = 0;
        currentawbno = "";
        HSCode = "";
        Text_HSCode = "";
        $("#btnSave").css("display", "none");
        $("#btnUpdate").css("display", "none");
        $("#btnCopyBooking").css("display", "none");
        $("#btnExecute").css("display", "none");
       // $("#btnNew").css("display", "block");
        //cfi.SaveUpdateLockedProcess(0, 0, "", "", userContext.UserSNo, 0, " ", 2, "");
    });
    var subprocess = $(obj).attr("process").toUpperCase();
    var subprocesssno = $(obj).attr("subprocesssno").toUpperCase();
    currentprocess = subprocess;
    var closestTr = $(obj).closest("tr");

    var AWBStatusNoIndex = 0;
    var AWBSNoIndex = 0;
    var AWBReferenceBookingSNoIndex = 0;
    var BookingRefNoIndex = 0;
    var OriginIndex = 0;
    var DestinationIndex = 0;
    var AWBStatusIndex = 0;
    var AwbnoIndex = 0;
    var PrefixIndex = 0;
    var ReplanCompleteIndex = 0;
    var BookingTypeIndex = 0;
    var ApproveCancelShipmentIndex = 0;
    var NoofReplan = 0;
    var NoOfREExecuted = 0;
    var AccountNoofReplan = 0;
    var AWBPiecesIndex = 0;
    var AWBGrossWeightIndex = 0;
    var AWBVolumeIndex = 0;
    var AWBStockIndex = 0;
    var SplitLoadedIndex = 0;
    var trLocked = $(".k-grid-header-wrap tr");
    var trRow = $(".k-grid-header-wrap tr");

    AwbnoIndex = trLocked.find("th[data-field='AWBNo']").index();
    currentawbno = closestTr.find("td:eq(" + AwbnoIndex + ")").text();
    //if (userContext.AgentSNo > 0 && AWBStatusDetails != "Booked") {
    //    ShowMessage('warning', 'Information!', "Already Executed");
    //}
    //else {
    ShowProcessDetails(subprocess, isdblclick, subprocesssno);
    //}

}

function ShowProcessDetails(subprocess, isdblclick, subprocesssno) {
   
        FormDataBind('NEW', subprocess);
        $("#divFooter").html(fotter).show();
       
}

var NogDiv = '<div id="divareaTrans_shipment_shipmentnog" style="display:none" cfi-aria-trans="trans">'
	+ '<table class="WebFormTable"><tbody>'
	+ '<tr><td class="formHeaderLabel snowidth" id="transSNo" name="transSNo">SNo</td><td class="formHeaderLabel" title="Enter Pieces"><span id="spnPieces"> Pieces</span></td><td class="formHeaderLabel" title="Enter Gross Weight"><span id="spnNogGrossWt"> Gr. Wt.</span></td><td class="formHeaderLabel" title="Enter Commodity"><span id="spnNOG"> Commodity</span></td><td class="formHeaderLabel" title="Other Commodity"><span id="spnOtherNOG">Other</span></td></tr>'
	+ '<tr data-popup="true" id="areaTrans_shipment_shipmentnog"><td id="tdSNoCol" class="formSNo snowidth">1</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces" id="Pieces" onblur="CalculatePieces(this);" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt" id="NogGrossWt" recname="NogGrossWt" style="width: 120px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods" id="OtherNatureofGoods" value=""><input type="text" class="" name="Text_OtherNatureofGoods" id="Text_OtherNatureofGoods" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG" id="NOG" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
	+ '<tr data-popup="true" id="areaTrans_shipment_shipmentnog_0"><td id="tdSNoCol_0" class="formSNo snowidth" style="" name="_0">2</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_0"  onblur="CalculatePieces(this);" id="Pieces_0" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_0" id="NogGrossWt_0" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_0" id="OtherNatureofGoods_0" value=""><input type="text" class="" name="Text_OtherNatureofGoods_0" id="Text_OtherNatureofGoods_0" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_0" id="NOG_0" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
	+ '<tr data-popup="true" id="areaTrans_shipment_shipmentnog_1"><td id="tdSNoCol_1" class="formSNo snowidth" style="" name="_1">3</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_1"  onblur="CalculatePieces(this);" id="Pieces_1" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_1" id="NogGrossWt_1" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_1" id="OtherNatureofGoods_1" value=""><input type="text" class="" name="Text_OtherNatureofGoods_1" id="Text_OtherNatureofGoods_1" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_1" id="NOG_1" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
	+ '<tr data-popup="true" id="areaTrans_shipment_shipmentnog_2"><td id="tdSNoCol_2" class="formSNo snowidth" style="" name="_2">4</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_2"  onblur="CalculatePieces(this);" id="Pieces_2" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_2" id="NogGrossWt_2" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_2" id="OtherNatureofGoods_2" value=""><input type="text" class="" name="Text_OtherNatureofGoods_2" id="Text_OtherNatureofGoods_2" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_2" id="NOG_2" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
	+ '<tr data-popup="true" id="areaTrans_shipment_shipmentnog_3"><td id="tdSNoCol_3" class="formSNo snowidth" style="" name="_3">5</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_3"  onblur="CalculatePieces(this);" id="Pieces_3" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_3" id="NogGrossWt_3" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_3" id="OtherNatureofGoods_3" value=""><input type="text" class="" name="Text_OtherNatureofGoods_3" id="Text_OtherNatureofGoods_3" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_3" id="NOG_3" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
	+ '<tr data-popup="true" id="areaTrans_shipment_shipmentnog_4"><td id="tdSNoCol_4" class="formSNo snowidth" style="" name="_4">6</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_4"  onblur="CalculatePieces(this);" id="Pieces_4" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_4" id="NogGrossWt_4" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_4" id="OtherNatureofGoods_4" value=""><input type="text" class="" name="Text_OtherNatureofGoods_4" id="Text_OtherNatureofGoods_4" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_4" id="NOG_4" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
	+ '<tr data-popup="true" id="areaTrans_shipment_shipmentnog_5"><td id="tdSNoCol_5" class="formSNo snowidth" style="" name="_5">7</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_5"  onblur="CalculatePieces(this);" id="Pieces_5" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_5" id="NogGrossWt_5" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_5" id="OtherNatureofGoods_5" value=""><input type="text" class="" name="Text_OtherNatureofGoods_5" id="Text_OtherNatureofGoods_5" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_5" id="NOG_5" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
	+ '<tr data-popup="true" id="areaTrans_shipment_shipmentnog_6"><td id="tdSNoCol_6" class="formSNo snowidth" style="" name="_6">8</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_6"  onblur="CalculatePieces(this);" id="Pieces_6" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_6" id="NogGrossWt_6" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_6" id="OtherNatureofGoods_6" value=""><input type="text" class="" name="Text_OtherNatureofGoods_6" id="Text_OtherNatureofGoods_6" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_6" id="NOG_6" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
	+ '<tr data-popup="true" id="areaTrans_shipment_shipmentnog_7"><td id="tdSNoCol_7" class="formSNo snowidth" style="" name="_7">9</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_7"  onblur="CalculatePieces(this);" id="Pieces_7" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_7" id="NogGrossWt_7" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_7" id="OtherNatureofGoods_7" value=""><input type="text" class="" name="Text_OtherNatureofGoods_7" id="Text_OtherNatureofGoods_7" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_7" id="NOG_7" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
	+ '<tr data-popup="true" id="areaTrans_shipment_shipmentnog_8"><td id="tdSNoCol_8" class="formSNo snowidth" style="" name="_8">10</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_8"  onblur="CalculatePieces(this);" id="Pieces_8" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_8" id="NogGrossWt_8" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_8" id="OtherNatureofGoods_8" value=""><input type="text" class="" name="Text_OtherNatureofGoods_8" id="Text_OtherNatureofGoods_8" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_8" id="NOG_8" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
	+ '<tr data-popup="true" id="areaTrans_shipment_shipmentnog_9"><td id="tdSNoCol_9" class="formSNo snowidth" style="" name="_9">11</td><td class="formtwoInputcolumn"><input type="text" class="k-input k-state-default transSection" name="Pieces_9"  onblur="CalculatePieces(this);" id="Pieces_9" recname="Pieces" style="width: 47.7778px; text-align: right;" controltype="number" maxlength="5" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input k-state-default" name="NogGrossWt_9" id="NogGrossWt_9" recname="NogGrossWt" style="width: 119.778px; text-align: right;" controltype="decimal3" allowchar="." maxlength="8" value="" placeholder="" data-role="numerictextbox"></td><td class="formtwoInputcolumn"><input type="hidden" name="OtherNatureofGoods_9" id="OtherNatureofGoods_9" value=""><input type="text" class="" name="Text_OtherNatureofGoods_9" id="Text_OtherNatureofGoods_9" controltype="autocomplete" maxlength="20" value="" placeholder=""></td><td class="formtwoInputcolumn"><input type="text" class="transSection k-input" name="NOG_9" id="NOG_9" recname="NOG" style="width: 200px; text-transform: uppercase;" controltype="uppercase" maxlength="40" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td></tr>'
	+ '</tbody></table>'
	+ '</div>'
var fotter = "<div><table style='margin-left:20px;'>" +
	"<tbody><tr><td> &nbsp; &nbsp;</td>" +
	//"<td><button class='btn btn-primary btn-sm' style='width:125px' id='btnNew'>New Booking</button></td>" +
	"<td> &nbsp; &nbsp;</td>" +
	"<td><button class='btn btn-block btn-success btn-sm' style='display:none;' id='btnSave'>Save</button><button style='display:none;' class='btn btn-block btn-success btn-sm'  id='btnUpdate'>Update</button><button style='display:none;' class='btn btn-block btn-success btn-sm'  id='btnExecute'>Execute</button></td>" +
	"<td> <button class='btn btn-block btn-success btn-sm' style='display:none;' id='btnCopyBooking'>Copy</button></td>" +
	//"<td><button class='btn btn-block btn-success btn-sm' onclick='AWBPrint()'  id='btnAWBPrint'>AWB Print</button></td>" +
	//"<td><button class='btn btn-block btn-success btn-sm' style='display:none;' id='btnSaveToNext'>Save &amp; Next</button></td>" +
	"<td> &nbsp; &nbsp;</td>" +
	"<td><button class='btn btn-block btn-danger btn-sm' id='btnCancel'>Cancel</button></td>" +

	"</tr></tbody></table> </div>";

function BackToReservation() {
    $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").select(0);
}
//Dimension Tab commented by akhtar
/*
function DimensionTab(id) {

    var ResultofChkBUP = true;
    var BUPPieces = ($("#AWBNoofBUP").val() == "" ? 0 : parseFloat($("#AWBNoofBUP").val()));
    var AWBNoofBUPIntact = ($("#AWBNoofBUPIntact").val() == "" ? 0 : parseFloat($("#AWBNoofBUPIntact").val()));
    var BUPORIntactPieces = 0;
    $('#tdlblNoofBups').attr("style", "display:none;");
    $("#lblDimensionTotalPieces").text($("#AWBPieces").val());
    $("#lblDimensionGrossWeight").text($("#AWBGrossWeight").val());
    $("#lblDimensionVolumeWeight").text($("#AWBVolumeWeight").val());

    if ($("#chkIsBUP").prop('checked') == true) {
        if (BUPPieces > 0)
            BUPORIntactPieces = BUPPieces;
        else if (AWBNoofBUPIntact > 0)
            BUPORIntactPieces = AWBNoofBUPIntact;
        $("#lblNoofBups").text(BUPORIntactPieces);
        if (BUPORIntactPieces == $("#AWBPieces").val()) {
            ResultofChkBUP = false;
            if (BUPPieces > 0) {
                if (BUPPieces == $("#AWBPieces").val())
                    ResultofChkBUP = true;
            }
        }
    }

    if (kendo.parseFloat($("#AWBPieces").val()) > 0 && kendo.parseFloat($("#AWBGrossWeight").val()) > 0) {

        var table111 = document.getElementById("tblDimensionTab");
        if (table111 != null && table111.rows.length > 0) {
            table111.innerHTML = "";
        }
        var table222 = document.getElementById("tblDimensionULDTab");
        if (table222 != null && table222.rows.length > 0) {
            table222.innerHTML = "";
        }
        if (ResultofChkBUP == true) {
            //if ($("#chkIsBUP").prop('checked') != true) {
            var dbTableName = 'DimensionTab';
            var pageType = 'View';
            if (userContext.SysSetting.ICMSEnvironment == 'JT' && AWBStatusNo == 16 && IsApproveCancelShipment == 'True')
                pageType = HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();
            else {
                if (AWBStatusNo == 16 && AWBStock == 'YES' && userContext.SysSetting.ICMSEnvironment == 'GA')
                    pageType = (AWBStatusNo > 5 && AWBStatusNo != 15 && AWBStatusNo != 16) || HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();
                else
                    pageType = (AWBStatusNo > 5 && AWBStatusNo != 15) || HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();       //No Show Work Commented
                //var pageType = (AWBStatusNo > 5 && AWBStatusNo != 15) || HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();       //No Show Work Commented
                //var pageType = AWBStatusNo > 5 ? 'View' : $('#hdnPageType').val();
            }
            // var flag =  '1'
            $('#tbl' + dbTableName).appendGrid({
                tableID: 'tbl' + dbTableName,
                //contentEditable: Viewflag == "0" ? false : true,//pageType != 'View',
                contentEditable: pageType == 'View' ? false : Viewflag == "0" ? false : true,
                //  contentEditable: pageType != 'View',
                tableColumns: 'SNo,Pieces,Length,Width,Height,VolumeWeight,CBM',
                masterTableSNo: $('#hdnBookingMasterRefNo').val(),
                currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
                servicePath: 'Services/Shipment/ReservationBookingService.svc',

                getRecordServiceMethod: 'Get' + dbTableName + 'Record',
                createUpdateServiceMethod: 'createUpdate' + dbTableName,
                deleteServiceMethod: 'delete' + dbTableName,
                caption: '',
                initRows: 1,
                isGetRecord: true,
                columns: [
					{ name: 'SNo', type: 'hidden', value: 0 },
					{ name: 'BookingSNo', type: 'hidden', value: $('#hdnBookingSNo').val() },
					{ name: 'BookingRefNo', type: 'hidden', value: $('#hdnBookingMasterRefNo').val() },
					{ name: 'Length', display: 'Length', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedVolumeCBM(this.id);" }, ctrlCss: { width: '90px' }, isRequired: true },
					{ name: 'Width', display: 'Width', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedVolumeCBM(this.id);" }, ctrlCss: { width: '90px' }, isRequired: true },
					{ name: 'Height', display: 'Height', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedVolumeCBM(this.id);" }, ctrlCss: { width: '90px' }, isRequired: true },
					{ name: 'Pieces', display: 'Pieces', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedDimensionPieces(this.id);" }, ctrlCss: { width: '90px' }, isRequired: true },
					{ name: 'VolumeWeight', display: 'Volume Weight', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'number', disabled: true }, ctrlCss: { width: '90px' }, isRequired: true },
					{ name: 'Volume', display: 'Volume (CBM)', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'number', disabled: true }, ctrlCss: { width: '90px' }, isRequired: true },

					{ name: pageType == 'View' ? 'CMS' : 'IsCMS', display: 'Mes. Unit', type: 'radiolist', ctrlOptions: { 0: 'Inc', 1: 'Cm' }, selectedIndex: 1, onClick: function (evt, rowIndex) { CalculatedVolumeCBM(evt.target.id); } },
					{ name: 'CreatedBy', type: 'hidden', value: userContext.UserSNo },
					{ name: 'UpdatedBy', type: 'hidden', value: userContext.UserSNo }
                ],
                beforeRowRemove: function (caller, rowIndex) {
                    CheckDimensionTabRowdata(rowIndex);
                },
                OnUpdateSuccess: function () {
                    //SetAndCalculateVolumeWeightAndCBM();
                    SetAndCalculateVolumeWeightAndCBMNEW('tblDimensionTab');

                },
                isPaging: false,
                hideButtons: { updateAll: false, insert: false, removeLast: true, append: true },
                i18n: { customValidationMessage: "Kindly enter respective dimensions." },
                dataLoaded: function () {
                    setTimeout(function () {
                        if ($("#_temptbl" + dbTableName + "_Length_1")) {
                            $("#_temptbl" + dbTableName + "_Length_1").focus();
                            $("#tblDimensionTab_btnUpdateText").detach().appendTo($("#tblDimensionTab tfoot tr td:eq(0)"));
                        }
                    }, 500);
                },
                customFooterButtons: [
					{
					    uiButton: { label: 'Update & Back to Reservation', text: true }, btnAttr: { title: 'Update & Back to Reservation', tabindex: '', id: 'tblDimensionTab_btnUpdateText' }, click: function (evt) {
					        if (validateTableData('tbl' + dbTableName, [], $('#tbl' + dbTableName).data('appendGrid'))) {
					            $("#tblDimensionTab_btnUpdateAll").trigger("click");
					            setTimeout(function () { BackToReservation(); }, 1000);
					            setTimeout(function () { $("#Text_Commodity").focus(); $("#Text_Priority").focus(); }, 1500);
					        }
					    }, atTheFront: true
					},
                ],
            });
            //}
        }

        if ($("#chkIsBUP").prop('checked') == true) {
            var BUPPieces = ($("#AWBNoofBUP").val() == "" ? 0 : parseFloat($("#AWBNoofBUP").val()));
            var AWBNoofBUPIntact = ($("#AWBNoofBUPIntact").val() == "" ? 0 : parseFloat($("#AWBNoofBUPIntact").val()));
            $('#tdlblNoofBups').attr("style", "display:block;");
            var dbTableName1 = 'DimensionULDTab';
            var pageType = 'View';
            if (userContext.SysSetting.ICMSEnvironment == 'JT' && AWBStatusNo == 16 && IsApproveCancelShipment == 'True')
                pageType = HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();
            else {
                if (AWBStatusNo == 16 && AWBStock == 'YES' && userContext.SysSetting.ICMSEnvironment == 'GA')
                    pageType = (AWBStatusNo > 5 && AWBStatusNo != 15 && AWBStatusNo != 16) || HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();
                else
                    pageType = (AWBStatusNo > 5 && AWBStatusNo != 15) || HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();       //No Show Work Commented
                //var pageType = (AWBStatusNo > 5 && AWBStatusNo != 15) || HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();       //No Show Work Commented
                //var pageType = AWBStatusNo > 5 ? 'View' : $('#hdnPageType').val();
            }
            //cfi.ValidateForm();
            if (BUPPieces > 0) {
                $('#tbl' + dbTableName1).appendGrid({
                    tableID: 'tbl' + dbTableName1,
                    contentEditable: pageType != 'View',
                    tableColumns: 'SNo,Pieces,Length,Width,Height,VolumeWeight,CBM',
                    masterTableSNo: $('#hdnBookingMasterRefNo').val(),
                    currentPage: 1, itemsPerPage: 20, whereCondition: null, sort: '',
                    servicePath: 'Services/Shipment/ReservationBookingService.svc',
                    getRecordServiceMethod: 'Get' + dbTableName1 + 'Record',
                    createUpdateServiceMethod: 'createUpdate' + dbTableName1,
                    deleteServiceMethod: 'delete' + dbTableName1,
                    caption: 'ULD Information',
                    initRows: 1,
                    isGetRecord: true,
                    columns: [



						{ name: 'SNo', type: 'hidden', value: 0 },
						{ name: 'BookingSNo', type: 'hidden', value: $('#hdnBookingSNo').val() },
						{ name: 'BookingRefNo', type: 'hidden', value: $('#hdnBookingMasterRefNo').val() },

						{ name: 'ULDTypeSNo', display: 'ULD Type', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: true, AutoCompleteName: 'Reservation_ULDType', filterField: 'ULDName' },
						{ name: 'ULDNo', display: 'ULD No', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'alphanumeric' }, ctrlCss: { width: '90px' }, onClick: function (evt, rowIndex) { SetNumeric(evt.target.id); }, minlength: 4 },
						{ name: 'OwnerCode', display: 'OW', type: 'text', value: '', ctrlAttr: { maxlength: 3, minlength: 2, controltype: 'alphanumericupper' }, ctrlCss: { width: '90px' } },
						{ name: 'SLAC', display: 'SLAC', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedDimensionULDSlac(this.id);", disabled: true }, ctrlCss: { width: '90px' } },
						{ name: 'Length', display: 'Length', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedVolumeCBM(this.id);", disabled: true }, ctrlCss: { width: '90px' } },
						{ name: 'Width', display: 'Width', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedVolumeCBM(this.id);", disabled: true }, ctrlCss: { width: '90px' } },
						{ name: 'Height', display: 'Height', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedVolumeCBM(this.id);", disabled: true }, ctrlCss: { width: '90px' } },
						{ name: 'Pieces', display: 'Pieces', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedDimensionULDPieces(this.id);", disabled: true }, ctrlCss: { width: '90px' } },
						{ name: 'VolumeWeight', display: 'Volume Weight', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', disabled: true }, ctrlCss: { width: '90px' } },
						{ name: 'Volume', display: 'Volume (CBM)', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', disabled: true }, ctrlCss: { width: '90px' } },

						{ name: pageType == 'View' ? 'CMS' : 'IsCMS', display: 'Mes. Unit', type: 'radiolist', ctrlAttr: { disabled: true }, ctrlOptions: { 0: 'Inc', 1: 'Cm' }, selectedIndex: 1, onClick: function (evt, rowIndex) { CalculatedVolumeCBM(evt.target.id); } },
						{ name: 'CreatedBy', type: 'hidden', value: userContext.UserSNo },
						{ name: 'UpdatedBy', type: 'hidden', value: userContext.UserSNo }
                    ],
                    customFooterButtons: [
						{ uiButton: { label: 'Update All', text: true }, btnAttr: { title: 'Update All' }, click: function (evt) { SaveULDDimensionData(this) }, atTheFront: true },
                    ],
                    beforeRowRemove: function (caller, rowIndex) {
                        CheckDimensionULDTabRowdata(rowIndex);
                    },
                    OnUpdateSuccess: function () {
                        //ULDDimensionSetAndCalculateVolumeWeightAndCBM();
                        SetAndCalculateVolumeWeightAndCBMNEW('tblDimensionULDTab');
                    },
                    afterRowRemoved: function (caller, rowIndex) {
                        //CheckDimensionULDTabRowdata(rowIndex);
                    },
                    afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
                        //if ($("#Text_Destination").text() == $('#ViaRoute').val()) {
                        //    //$('#tblScheduleTrans_SDDifference_' + i.toString()).prop('disabled', 'disabled');
                        //    $('#tblScheduleTrans_DayDifference_' + parseInt(addedRowIndex + 1).toString()).prop('disabled', 'disabled');

                        //}

                        DimensionULDTabafterRowAppended(caller, parentRowIndex, addedRowIndex)
                    },
                    beforeRowAppend: function (caller, parentRowIndex, addedRowIndex) {
                        var GroupBy = {};
                        var CheckAndValidateDataArray = [];
                        var res = true;
                        $("tr[id^='tblDimensionULDTab_Row']").each(function (row, tr) {
                            var CheckAndValidateDataArrayItems = {
                                ULDType: $(tr).find("input[id^='tblDimensionULDTab_HdnULDTypeSNo_']").val(),// $(tr).find("tblDimensionULDTab_HdnULDTypeSNo_").val(),
                                ULDNo: $(tr).find("input[id^='tblDimensionULDTab_ULDNo_']").val(),
                                OwnerCode: $(tr).find("input[id^='tblDimensionULDTab_OwnerCode_']").val(),
                                SLAC: $(tr).find("input[id^='tblDimensionULDTab_SLAC_']").val()
                            };
                            CheckAndValidateDataArray.push(CheckAndValidateDataArrayItems);
                        });



                        if (CheckAndValidateDataArray.length > 0) {
                            var BUPPieces = ($("#AWBNoofBUP").val() == "" ? 0 : parseFloat($("#AWBNoofBUP").val()));
                            var AWBNoofBUPIntact = ($("#AWBNoofBUPIntact").val() == "" ? 0 : parseFloat($("#AWBNoofBUPIntact").val()));
                            var BUPORIntactPieces = 0;
                            if (BUPPieces > 0)
                                BUPORIntactPieces = BUPPieces;
                            else if (AWBNoofBUPIntact > 0)
                                BUPORIntactPieces = AWBNoofBUPIntact;

                            if (CheckAndValidateDataArray.length >= parseInt(BUPORIntactPieces))
                                res = false;
                        }

                        return res;
                    },
                    isPaging: false,
                    hideButtons: { updateAll: true, insert: true, removeLast: true }
                });
            }
            else if (AWBNoofBUPIntact > 0) {
                $('#tbl' + dbTableName1).appendGrid({
                    tableID: 'tbl' + dbTableName1,
                    contentEditable: pageType != 'View',
                    tableColumns: 'SNo,Pieces,Length,Width,Height,VolumeWeight,CBM',
                    masterTableSNo: $('#hdnBookingMasterRefNo').val(),
                    currentPage: 1, itemsPerPage: 20, whereCondition: null, sort: '',
                    servicePath: 'Services/Shipment/ReservationBookingService.svc',
                    getRecordServiceMethod: 'Get' + dbTableName1 + 'Record',
                    createUpdateServiceMethod: 'createUpdate' + dbTableName1,
                    deleteServiceMethod: 'delete' + dbTableName1,
                    caption: 'ULD Information',
                    initRows: 1,
                    isGetRecord: true,
                    columns: [
						{ name: 'SNo', type: 'hidden', value: 0 },
						{ name: 'BookingSNo', type: 'hidden', value: $('#hdnBookingSNo').val() },
						{ name: 'BookingRefNo', type: 'hidden', value: $('#hdnBookingMasterRefNo').val() },

						{ name: 'ULDTypeSNo', display: 'ULD Type', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: true, AutoCompleteName: 'Reservation_ULDType', filterField: 'ULDName' },
						{ name: 'ULDNo', display: 'ULD No', type: 'text', value: '', ctrlAttr: { maxlength: 5, controltype: 'alphanumeric' }, ctrlCss: { width: '90px' }, isRequired: true, onClick: function (evt, rowIndex) { SetNumeric(evt.target.id); }, minlength: 4 },
						{ name: 'OwnerCode', display: 'OW', type: 'text', value: '', ctrlAttr: { maxlength: 3, minlength: 2, controltype: 'alphanumericupper' }, isRequired: true, ctrlCss: { width: '90px' } },
						{ name: 'SLAC', display: 'SLAC', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedDimensionULDSlac(this.id);", disabled: true }, ctrlCss: { width: '90px' } },
						{ name: 'Length', display: 'Length', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedVolumeCBM(this.id);", disabled: true }, ctrlCss: { width: '90px' } },
						{ name: 'Width', display: 'Width', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedVolumeCBM(this.id);", disabled: true }, ctrlCss: { width: '90px' } },
						{ name: 'Height', display: 'Height', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedVolumeCBM(this.id);", disabled: true }, ctrlCss: { width: '90px' } },
						{ name: 'Pieces', display: 'Pieces', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', onblur: "return CalculatedDimensionULDPieces(this.id);", disabled: true }, ctrlCss: { width: '90px' } },
						{ name: 'VolumeWeight', display: 'Volume Weight', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', disabled: true }, ctrlCss: { width: '90px' } },
						{ name: 'Volume', display: 'Volume (CBM)', type: 'text', value: '0', ctrlAttr: { maxlength: 5, controltype: 'number', disabled: true }, ctrlCss: { width: '90px' } },

						{ name: pageType == 'View' ? 'CMS' : 'IsCMS', display: 'Mes. Unit', type: 'radiolist', ctrlAttr: { disabled: true }, ctrlOptions: { 0: 'Inc', 1: 'Cm' }, selectedIndex: 1, onClick: function (evt, rowIndex) { CalculatedVolumeCBM(evt.target.id); } },
						{ name: 'CreatedBy', type: 'hidden', value: userContext.UserSNo },
						{ name: 'UpdatedBy', type: 'hidden', value: userContext.UserSNo }
                    ],
                    customFooterButtons: [
						{ uiButton: { label: 'Update All', text: true }, btnAttr: { title: 'Update All' }, click: function (evt) { SaveULDDimensionData(this) }, atTheFront: true },
                    ],
                    beforeRowRemove: function (caller, rowIndex) {
                        CheckDimensionULDTabRowdata(rowIndex);
                    },
                    OnUpdateSuccess: function () {
                        SetAndCalculateVolumeWeightAndCBMNEW('tblDimensionULDTab');
                    },
                    afterRowRemoved: function (caller, rowIndex) {
                        //CheckDimensionULDTabRowdata(rowIndex);
                    },
                    afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
                        DimensionULDTabafterRowAppended(caller, parentRowIndex, addedRowIndex)
                    },
                    beforeRowAppend: function (caller, parentRowIndex, addedRowIndex) {
                        var GroupBy = {};
                        var CheckAndValidateDataArray = [];
                        var res = true;
                        $("tr[id^='tblDimensionULDTab_Row']").each(function (row, tr) {
                            var CheckAndValidateDataArrayItems = {
                                ULDType: $(tr).find("input[id^='tblDimensionULDTab_HdnULDTypeSNo_']").val(),// $(tr).find("tblDimensionULDTab_HdnULDTypeSNo_").val(),
                                ULDNo: $(tr).find("input[id^='tblDimensionULDTab_ULDNo_']").val(),
                                OwnerCode: $(tr).find("input[id^='tblDimensionULDTab_OwnerCode_']").val(),
                                SLAC: $(tr).find("input[id^='tblDimensionULDTab_SLAC_']").val()
                            };
                            CheckAndValidateDataArray.push(CheckAndValidateDataArrayItems);
                        });

                        if (CheckAndValidateDataArray.length > 0) {
                            var BUPPieces = ($("#AWBNoofBUP").val() == "" ? 0 : parseFloat($("#AWBNoofBUP").val()));
                            var AWBNoofBUPIntact = ($("#AWBNoofBUPIntact").val() == "" ? 0 : parseFloat($("#AWBNoofBUPIntact").val()));
                            var BUPORIntactPieces = 0;
                            if (BUPPieces > 0)
                                BUPORIntactPieces = BUPPieces;
                            else if (AWBNoofBUPIntact > 0)
                                BUPORIntactPieces = AWBNoofBUPIntact;

                            if (CheckAndValidateDataArray.length >= parseInt(BUPORIntactPieces))
                                res = false;
                        }

                        return res;
                    },
                    isPaging: false,
                    hideButtons: { updateAll: true, insert: true, removeLast: true }
                });
            }
            else
                $('#tblDimensionULDTab').empty()
        }
        else {
            $('#tblDimensionULDTab').empty()
        }
        if (id == "AddDimension") {
            $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").select(1);
        }
        if (getQueryStringValue("FormAction").toUpperCase() == "INDEXVIEW") {
            var Dimensionrows = 0;
            var DimensionULDrows = 0;
            $("tr[id^='tblDimensionTab_Row']").each(function (row, tr) {
                Dimensionrows = tr.id.split('_')[2];
            });
            $("tr[id^='tblDimensionULDTab_Row']").each(function (row, tr) {
                DimensionULDrows = tr.id.split('_')[2];
            });
            if (Dimensionrows == 0) {
                //if ($("#chkIsBUP").prop('checked') != true) {
                $('#tblDimensionTab').appendGrid('insertRow', 1, 0);
                GetAwbDetails(1, 0, 0, "tblDimensionTab", 1);
                //}
            }
            if (DimensionULDrows == 0) {
                if ($("#chkIsBUP").prop('checked') == true) {
                    $('#tblDimensionULDTab').appendGrid('insertRow', 1, 0);
                    GetAwbDetails(1, 0, 0, "tblDimensionULDTab", 1);
                }
            }

        }
    }
    else {
        ShowMessage('warning', 'Information!', "Enter Pieces and Gross Weight to add Dimension.");
        return;
    }

}
function SaveULDDimensionData(obj) {
    var rows = $("tr[id^='tblDimensionULDTab']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
    getUpdatedRowIndex(rows.join(","), "tblDimensionULDTab");
    var ValidData = $('#tblDimensionULDTab').appendGrid('getStringJson');
    if (ValidData != "[]" && ValidData != false) {
        var res = false;
        var CheckAndValidateDataArray = [];

        $("tr[id^='tblDimensionULDTab_Row']").each(function (row, tr) {
            var CheckAndValidateDataArrayItems = {
                ULDType: $(tr).find("input[id^='tblDimensionULDTab_HdnULDTypeSNo_']").val(),// $(tr).find("tblDimensionULDTab_HdnULDTypeSNo_").val(),
                ULDNo: $(tr).find("input[id^='tblDimensionULDTab_ULDNo_']").val(),
                OwnerCode: $(tr).find("input[id^='tblDimensionULDTab_OwnerCode_']").val(),
                SLAC: $(tr).find("input[id^='tblDimensionULDTab_SLAC_']").val(),
                Length: $(tr).find("input[id^='tblDimensionULDTab_Length_']").val(),
                Width: $(tr).find("input[id^='tblDimensionULDTab_Width_']").val(),
                Height: $(tr).find("input[id^='tblDimensionULDTab_Height_']").val(),
                Pieces: $(tr).find("input[id^='tblDimensionULDTab_Pieces_']").val(),
                VolumeWeight: $(tr).find("input[id^='tblDimensionULDTab_VolumeWeight_']").val(),
                Volume: $(tr).find("input[id^='tblDimensionULDTab_Volume_']").val(),
            };
            CheckAndValidateDataArray.push(CheckAndValidateDataArrayItems);
        });

        if (CheckAndValidateDataArray.length > 0) {
            var BUPPieces = ($("#AWBNoofBUP").val() == "" ? 0 : parseFloat($("#AWBNoofBUP").val()));
            var AWBNoofBUPIntact = ($("#AWBNoofBUPIntact").val() == "" ? 0 : parseFloat($("#AWBNoofBUPIntact").val()));
            var BUPORIntactPieces = 0;
            if (BUPPieces > 0)
                BUPORIntactPieces = BUPPieces;
            else if (AWBNoofBUPIntact > 0)
                BUPORIntactPieces = AWBNoofBUPIntact;
            if (CheckAndValidateDataArray.length == parseInt(BUPORIntactPieces))
                res = true;
        }

        if (res == true) {
            $.ajax({
                //url: "./Services/Shipment/ReservationBookingService.svc/createUpdateDimensionULDTab?strData=" + ValidData,
                url: "./Services/Shipment/ReservationBookingService.svc/createUpdateDimensionULDTab",
                async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ strData: btoa(ValidData) }),
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if (data == '<value>ULD Added Successfully.</value>') {
                        ShowMessage('success', 'Success!', 'ULD Added Successfully.');
                        DimensionTab("AddDimension");
                    }
                    else if (data == '<value>ULD Updated Successfully.</value>') {
                        ShowMessage('success', 'Success!', 'ULD Updated Successfully.');
                        DimensionTab("AddDimension");
                    }
                    else if (data == '<value>ULD Deleted Successfully.</value>') {
                        ShowMessage('success', 'Success!', 'ULD Deleted Successfully.');
                        DimensionTab("AddDimension");
                    }
                    else {
                        ShowMessage('warning', 'Warning.', null);
                    }
                }
            });
        }
        else {
            ShowMessage('warning', 'Information!', "Enter Total No of BUP.");
            return;
        }

    }
    else {
        return false;
    }
}
*/
//Dimension Tab commented by akhtar END
function SetNumeric(obj, event) {
    var Piece_ID = obj;
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
function GetroundValue(numbervalue, precision) {
    var multiplier = Math.pow(10, precision || 0);
    if (userContext.SysSetting.IsRoundValue == "1") {
        if (parseFloat(numbervalue) > 0 && parseFloat(numbervalue) < 1)
            return 1;
        else
            return Math.round(parseFloat(parseFloat(numbervalue).toFixed(0)) * multiplier) / multiplier;
    }
    else {
        var Decimalnumbervalue = numbervalue.toString().split('.')[1] || 0;
        var Returnnumbervalue = "";
        Decimalnumbervalue = '.' + Decimalnumbervalue;
        if (parseFloat(Decimalnumbervalue) > .5)
            Returnnumbervalue = parseFloat(numbervalue.toString().split('.')[0]) + 1
        else if (parseFloat(Decimalnumbervalue) == .0)
            Returnnumbervalue = parseFloat(numbervalue.toString().split('.')[0]) + 0
        else
            Returnnumbervalue = parseFloat(numbervalue.toString().split('.')[0]) + .5


        return Math.round(parseFloat(Returnnumbervalue) * multiplier) / multiplier;
    }
}
function CalculatedVolumeCBM(id) {
    var VolumeCBM = 0;
    var DummyVolumeWeight = 0;
    var VolumeWeight = 0;
    var TableNamerowIndex = id.split('_')[0];
    var rowIndex = id.split('_')[2];
    var IsCMS = $('input:radio[name=' + TableNamerowIndex + '_RbtnIsCMS_' + rowIndex + ']:checked').val();
    var Pieces = parseInt(($('#' + TableNamerowIndex + '_Pieces_' + rowIndex).val() || 0) == 0 ? ($('#_temp' + TableNamerowIndex + '_Pieces_' + rowIndex).val() || 0) : ($('#' + TableNamerowIndex + '_Pieces_' + rowIndex).val() || 0));
    var Length = parseInt(($('#' + TableNamerowIndex + '_Length_' + rowIndex).val() || 0) == 0 ? ($('#_temp' + TableNamerowIndex + '_Length_' + rowIndex).val() || 0) : ($('#' + TableNamerowIndex + '_Length_' + rowIndex).val() || 0));
    var Width = parseInt(($('#' + TableNamerowIndex + '_Width_' + rowIndex).val() || 0) == 0 ? ($('#_temp' + TableNamerowIndex + '_Width_' + rowIndex).val() || 0) : ($('#' + TableNamerowIndex + '_Width_' + rowIndex).val() || 0));
    var Height = parseInt(($('#' + TableNamerowIndex + '_Height_' + rowIndex).val() || 0) == 0 ? ($('#_temp' + TableNamerowIndex + '_Height_' + rowIndex).val() || 0) : ($('#' + TableNamerowIndex + '_Height_' + rowIndex).val() || 0));
    if (IsCMS == 1) {
        //VolumeCBM = ((parseInt(Pieces) * parseInt(Length) * parseInt(Width) * parseInt(Height)) / userContext.SysSetting.CMSDivisor).toFixed(3)
        //VolumeWeight = (VolumeCBM * 166.66).toFixed(2)
        DummyVolumeWeight = ((parseInt(Pieces) * parseInt(Length) * parseInt(Width) * parseInt(Height)) / userContext.SysSetting.CMSDivisor)
        //VolumeWeight = ((parseInt(Pieces) * parseInt(Length) * parseInt(Width) * parseInt(Height)) / userContext.SysSetting.CMSDivisor).toFixed(0)        //Decimal By Tarun
        VolumeWeight = GetroundValue(((parseInt(Pieces) * parseInt(Length) * parseInt(Width) * parseInt(Height)) / userContext.SysSetting.CMSDivisor), 1)
        VolumeCBM = (((parseInt(Pieces) * parseInt(Length) * parseInt(Width) * parseInt(Height)) / userContext.SysSetting.CMSDivisor) / 166.66).toFixed(3)
        if (VolumeCBM == '0.000')
            VolumeCBM = 0.001
        //VolumeWeight = (VolumeCBM * 166.66).toFixed(2)
    }
    else {
        //VolumeCBM = ((parseInt(Pieces) * parseInt(Length) * parseInt(Width) * parseInt(Height)) / userContext.SysSetting.INHDivisor).toFixed(3)
        //VolumeWeight = ((VolumeCBM * 135.3147) / 12).toFixed(2)
        DummyVolumeWeight = ((parseInt(Pieces) * parseInt(Length) * parseInt(Width) * parseInt(Height)) / userContext.SysSetting.INHDivisor)
        //VolumeWeight = ((parseInt(Pieces) * parseInt(Length) * parseInt(Width) * parseInt(Height)) / userContext.SysSetting.INHDivisor).toFixed(0)       //Decimal By Tarun
        VolumeWeight = GetroundValue(((parseInt(Pieces) * parseInt(Length) * parseInt(Width) * parseInt(Height)) / userContext.SysSetting.INHDivisor), 1)
        VolumeCBM = (((parseInt(Pieces) * parseInt(Length) * parseInt(Width) * parseInt(Height)) / userContext.SysSetting.INHDivisor) / 166.66).toFixed(3)
        if (VolumeCBM == '0.000')
            VolumeCBM = 0.001
        //VolumeWeight = (VolumeCBM * 166.66).toFixed(2)
    }
    //if (DummyVolumeWeight > 0 && DummyVolumeWeight < 1)    //Decimal By Tarun
    //    VolumeWeight = 1;
    $('#_temp' + TableNamerowIndex + '_VolumeWeight_' + rowIndex).val(VolumeWeight);
    $('#' + TableNamerowIndex + '_VolumeWeight_' + rowIndex).val(VolumeWeight);
    $('#_temp' + TableNamerowIndex + '_Volume_' + rowIndex).val(VolumeCBM);
    $('#' + TableNamerowIndex + '_Volume_' + rowIndex).val(VolumeCBM);

    var CalculateVolumeWeight = 0;
    var CalculateCBM = 0;
    //if (TableNamerowIndex == "tblDimensionULDTab") {
    $("#tblDimensionULDTab tbody").find("tr[id^='tblDimensionULDTab_Row_']").each(function () {
        if ($(this).find("input[id^='tblDimensionULDTab_VolumeWeight_']").val() != "")
            CalculateVolumeWeight = parseFloat(CalculateVolumeWeight) + parseFloat($(this).find("input[id^='tblDimensionULDTab_VolumeWeight_']").val());
        if ($(this).find("input[id^='tblDimensionULDTab_Volume_']").val() != "")
            CalculateCBM = parseFloat(CalculateCBM) + parseFloat($(this).find("input[id^='tblDimensionULDTab_Volume_']").val());
    });
    //}
    //else {
    $("#tblDimensionTab tbody").find("tr[id^='tblDimensionTab_Row_']").each(function () {
        if ($(this).find("input[id^='tblDimensionTab_VolumeWeight_']").val() != "")
            CalculateVolumeWeight = parseFloat(CalculateVolumeWeight) + parseFloat($(this).find("input[id^='tblDimensionTab_VolumeWeight_']").val());
        if ($(this).find("input[id^='tblDimensionTab_Volume_']").val() != "")
            CalculateCBM = parseFloat(CalculateCBM) + parseFloat($(this).find("input[id^='tblDimensionTab_Volume_']").val());
    });
    //}
    //$("#lblDimensionVolumeWeight").text(CalculateVolumeWeight.toFixed(0));       //Decimal By Tarun
    $("#lblDimensionVolumeWeight").text(GetroundValue(CalculateVolumeWeight, 1));
}
function SetAndCalculateVolumeWeightAndCBMNEW(id) {
    if (id == 'tblDimensionTab') {
        var CalculateVolumeWeight = 0;
        var CalculateCBM = 0;
        $("#tblDimensionTab tbody").find("tr[id^='tblDimensionTab_Row_']").each(function () {
            if ($(this).find("input[id^='tblDimensionTab_VolumeWeight_']").val() != "")
                CalculateVolumeWeight = parseFloat(CalculateVolumeWeight) + parseFloat($(this).find("input[id^='tblDimensionTab_VolumeWeight_']").val());
            if ($(this).find("input[id^='tblDimensionTab_Volume_']").val() != "")
                CalculateCBM = parseFloat(CalculateCBM) + parseFloat($(this).find("input[id^='tblDimensionTab_Volume_']").val());
        });

        var OtherTable = document.getElementById("tblDimensionULDTab");
        if (OtherTable != null && OtherTable.rows.length > 2) {
            $("#tblDimensionULDTab tbody").find("tr[id^='tblDimensionULDTab_Row_']").each(function () {
                if ($(this).find("input[id^='tblDimensionULDTab_VolumeWeight_']").val() != "")
                    CalculateVolumeWeight = parseFloat(CalculateVolumeWeight) + parseFloat($(this).find("input[id^='tblDimensionULDTab_VolumeWeight_']").val());
                if ($(this).find("input[id^='tblDimensionULDTab_Volume_']").val() != "")
                    CalculateCBM = parseFloat(CalculateCBM) + parseFloat($(this).find("input[id^='tblDimensionULDTab_Volume_']").val());
            });
        }

        //$("#AWBVolumeWeight").val(CalculateVolumeWeight.toFixed(0));       //Decimal By Tarun
        //$("#_tempAWBVolumeWeight").val(CalculateVolumeWeight.toFixed(0));       //Decimal By Tarun
        $("#AWBVolumeWeight").val(GetroundValue(CalculateVolumeWeight, 1));
        $("#_tempAWBVolumeWeight").val(GetroundValue(CalculateVolumeWeight, 1));
        $("#AWBCBM").val(CalculateCBM.toFixed(3));
        $("#_tempAWBCBM").val(CalculateCBM.toFixed(3));

        $("#AWBVolumeWeight").attr('disabled', true);
        $("#_tempAWBVolumeWeight").attr('disabled', true);
      //  $("#AWBCBM").attr('disabled', true);
       // $("#_tempAWBCBM").attr('disabled', true);

        $("#ItineraryVolumeWeight").val(CalculateCBM.toFixed(3));
        $("#_tempItineraryVolumeWeight").val(CalculateCBM.toFixed(3));
        //$("#ItineraryMainVolumeWeight").val(CalculateVolumeWeight.toFixed(0));       //Decimal By Tarun
        //$("#_tempItineraryMainVolumeWeight").val(CalculateVolumeWeight.toFixed(0));       //Decimal By Tarun
        $("#ItineraryMainVolumeWeight").val(GetroundValue(CalculateVolumeWeight, 1));
        $("#_tempItineraryMainVolumeWeight").val(GetroundValue(CalculateVolumeWeight, 1));

        var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
        thedivFlightSearchResult.innerHTML = "";

        var grosswt = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));
        var volwt = ($("#AWBVolumeWeight").val() == "" ? 0 : parseFloat($("#AWBVolumeWeight").val()));

        var chwt = grosswt > volwt ? GetroundValue(grosswt, 1) : GetroundValue(volwt, 1);

        $("#AWBChargeableWeight").val(chwt);
        $("#_tempAWBChargeableWeight").val(chwt);
        //CalculateShipmentChWt('');
        var result = false;
        var RowCount = 0;
        var SetAndCalculateVolumeArray = [];
        var table = document.getElementById("tblSelectdRouteResult");
        if (table != null && table.rows.length > 1) {
            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                var SetAndCalculateVolumeArrayItems = {
                    Origin: $(tr).find("td")[2].innerText.split("/")[0].trim(),
                    Destination: $(tr).find("td")[2].innerText.split("/")[1].trim()
                };
                SetAndCalculateVolumeArray.push(SetAndCalculateVolumeArrayItems);
            });

            if (SetAndCalculateVolumeArray.length > 0) {
                for (var i = 0; i < SetAndCalculateVolumeArray.length; i++) {
                    RowCount = 0;
                    $.map(SetAndCalculateVolumeArray, function (item) {
                        if (item.Origin == SetAndCalculateVolumeArray[i].Origin) {
                            RowCount = parseInt(RowCount) + parseInt(1);
                        }
                    });
                    if (RowCount > 1) {
                        result = false;
                        return false;
                    }
                    else {
                        result = true;
                    }
                }
            }
            if (result = true) {
                $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                    $(tr).find("td")[5].innerText = CalculateCBM.toFixed(3);
                    $(tr).find("input[id^='hdnItineraryMainVolumeWeight_']").val(volwt);
                });
            }
        }
    }
    else if (id == 'tblDimensionULDTab') {
        var CalculateVolumeWeight = 0;
        var CalculateCBM = 0;
        $("#tblDimensionULDTab tbody").find("tr[id^='tblDimensionULDTab_Row_']").each(function () {
            if ($(this).find("input[id^='tblDimensionULDTab_VolumeWeight_']").val() != "")
                CalculateVolumeWeight = parseFloat(CalculateVolumeWeight) + parseFloat($(this).find("input[id^='tblDimensionULDTab_VolumeWeight_']").val());
            if ($(this).find("input[id^='tblDimensionULDTab_Volume_']").val() != "")
                CalculateCBM = parseFloat(CalculateCBM) + parseFloat($(this).find("input[id^='tblDimensionULDTab_Volume_']").val());
        });

        var OtherTable = document.getElementById("tblDimensionTab");
        if (OtherTable != null && OtherTable.rows.length > 1) {
            $("#tblDimensionTab tbody").find("tr[id^='tblDimensionTab_Row_']").each(function () {
                if ($(this).find("input[id^='tblDimensionTab_VolumeWeight_']").val() != "")
                    CalculateVolumeWeight = parseFloat(CalculateVolumeWeight) + parseFloat($(this).find("input[id^='tblDimensionTab_VolumeWeight_']").val());
                if ($(this).find("input[id^='tblDimensionTab_Volume_']").val() != "")
                    CalculateCBM = parseFloat(CalculateCBM) + parseFloat($(this).find("input[id^='tblDimensionTab_Volume_']").val());
            });
        }

        //$("#AWBVolumeWeight").val(CalculateVolumeWeight.toFixed(0));       //Decimal By Tarun
        //$("#_tempAWBVolumeWeight").val(CalculateVolumeWeight.toFixed(0));       //Decimal By Tarun
        $("#AWBVolumeWeight").val(GetroundValue(CalculateVolumeWeight, 1));
        $("#_tempAWBVolumeWeight").val(GetroundValue(CalculateVolumeWeight, 1));
        $("#AWBCBM").val(CalculateCBM.toFixed(3));
        $("#_tempAWBCBM").val(CalculateCBM.toFixed(3));

        $("#AWBVolumeWeight").attr('disabled', true);
        $("#_tempAWBVolumeWeight").attr('disabled', true);
      //  $("#AWBCBM").attr('disabled', true);
      //  $("#_tempAWBCBM").attr('disabled', true);

        $("#ItineraryVolumeWeight").val(CalculateCBM.toFixed(3));
        $("#_tempItineraryVolumeWeight").val(CalculateCBM.toFixed(3));
        //$("#ItineraryMainVolumeWeight").val(CalculateVolumeWeight.toFixed(0));       //Decimal By Tarun
        //$("#_tempItineraryMainVolumeWeight").val(CalculateVolumeWeight.toFixed(0));       //Decimal By Tarun
        $("#ItineraryMainVolumeWeight").val(GetroundValue(CalculateVolumeWeight, 1));
        $("#_tempItineraryMainVolumeWeight").val(GetroundValue(CalculateVolumeWeight, 1));

        var grosswt = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));
        var volwt = ($("#AWBVolumeWeight").val() == "" ? 0 : parseFloat($("#AWBVolumeWeight").val()));

        var chwt = grosswt > volwt ? GetroundValue(grosswt, 1) : GetroundValue(volwt, 1);
        $("#AWBChargeableWeight").val(chwt);
        $("#_tempAWBChargeableWeight").val(chwt);
        //CalculateShipmentChWt('');
        var result = false;
        var RowCount = 0;
        var SetAndCalculateVolumeArray = [];
        var table = document.getElementById("tblSelectdRouteResult");
        if (table != null && table.rows.length > 1) {
            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                var SetAndCalculateVolumeArrayItems = {
                    Origin: $(tr).find("td")[2].innerText.split("/")[0].trim(),
                    Destination: $(tr).find("td")[2].innerText.split("/")[1].trim()
                };
                SetAndCalculateVolumeArray.push(SetAndCalculateVolumeArrayItems);
            });

            if (SetAndCalculateVolumeArray.length > 0) {
                for (var i = 0; i < SetAndCalculateVolumeArray.length; i++) {
                    $.map(SetAndCalculateVolumeArray, function (item) {
                        if (item.Origin == SetAndCalculateVolumeArray[i].Origin) {
                            RowCount = parseInt(RowCount) + parseInt(1);
                        }
                    });
                    if (RowCount > 1) {
                        result = false;
                        return false;
                    }
                    else {
                        result = true;
                    }
                }
            }
            if (result = true) {
                $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                    $(tr).find("td")[5].innerText = CalculateCBM.toFixed(3);
                    $(tr).find("input[id^='hdnItineraryMainVolumeWeight_']").val(volwt);
                });
            }
        }
    }
    else if (id == 'GrossWeight') {
        var grosswt = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));
        var result = false;
        var RowCount = 0;
        var SetAndCalculateVolumeArray = [];
        var table = document.getElementById("tblSelectdRouteResult");
        if (table != null && table.rows.length > 1) {
            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                var SetAndCalculateVolumeArrayItems = {
                    Origin: $(tr).find("td")[2].innerText.split("/")[0].trim(),
                    Destination: $(tr).find("td")[2].innerText.split("/")[1].trim()
                };
                SetAndCalculateVolumeArray.push(SetAndCalculateVolumeArrayItems);
            });
            if (SetAndCalculateVolumeArray.length > 0) {
                for (var i = 0; i < SetAndCalculateVolumeArray.length; i++) {
                    RowCount = 0;
                    $.map(SetAndCalculateVolumeArray, function (item) {
                        if (item.Origin == SetAndCalculateVolumeArray[i].Origin) {
                            RowCount = parseInt(RowCount) + parseInt(1);
                        }
                    });
                    if (RowCount > 1) {
                        result = false;
                        return false;
                    }
                    else {
                        result = true;
                    }
                }
            }
            if (result = true) {
                $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                    $(tr).find("td")[4].innerText = grosswt;
                });
            }
        }
    }
}
function ULDDimensionSetAndCalculateVolumeWeightAndCBM() {
    var CalculateVolumeWeight = 0;
    var CalculateCBM = 0;
    $("#tblDimensionULDTab tbody").find("tr[id^='tblDimensionULDTab_Row_']").each(function () {
        CalculateVolumeWeight = parseFloat(CalculateVolumeWeight) + parseFloat($(this).find("input[id^='tblDimensionULDTab_VolumeWeight_']").val())
        CalculateCBM = parseFloat(CalculateCBM) + parseFloat($(this).find("input[id^='tblDimensionULDTab_Volume_']").val())
    });
    $("#AWBVolumeWeight").val(CalculateVolumeWeight.toFixed(2));
    $("#_tempAWBVolumeWeight").val(CalculateVolumeWeight.toFixed(2));
    $("#AWBCBM").val(CalculateCBM.toFixed(3));
    $("#_tempAWBCBM").val(CalculateCBM.toFixed(3));

    $("#AWBVolumeWeight").attr('disabled', true);
    $("#_tempAWBVolumeWeight").attr('disabled', true);
   // $("#AWBCBM").attr('disabled', true);
   // $("#_tempAWBCBM").attr('disabled', true);

    $("#ItineraryVolumeWeight").val(CalculateCBM.toFixed(3));
    $("#_tempItineraryVolumeWeight").val(CalculateCBM.toFixed(3));

    var grosswt = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));

    var chwt = grosswt > CalculateVolumeWeight ? grosswt : CalculateVolumeWeight;
    $("#AWBChargeableWeight").val(chwt);
    $("#_tempAWBChargeableWeight").val(chwt);
    //CalculateShipmentChWt('');
    var result = false;
    var RowCount = 0;
    var SetAndCalculateVolumeArray = [];
    var table = document.getElementById("tblSelectdRouteResult");
    if (table != null && table.rows.length > 1) {
        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
            var SetAndCalculateVolumeArrayItems = {
                Origin: $(tr).find("td")[2].innerText.split("/")[0].trim(),
                Destination: $(tr).find("td")[2].innerText.split("/")[1].trim()
            };
            SetAndCalculateVolumeArray.push(SetAndCalculateVolumeArrayItems);
        });

        if (SetAndCalculateVolumeArray.length > 0) {
            for (var i = 0; i < SetAndCalculateVolumeArray.length; i++) {
                $.map(SetAndCalculateVolumeArray, function (item) {
                    if (item.Origin == SetAndCalculateVolumeArray[i].Origin) {
                        RowCount = parseInt(RowCount) + parseInt(1);
                    }
                });
                if (RowCount > 1) {
                    result = false;
                    return false;
                }
                else {
                    result = true;
                }
            }
        }
        if (result = true) {
            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                $(tr).find("td")[5].innerText = CalculateCBM;
            });
        }
    }

}
function SetAndCalculateVolumeWeightAndCBM() {
    var CalculateVolumeWeight = 0;
    var CalculateCBM = 0;
    $("#tblDimensionTab tbody").find("tr[id^='tblDimensionTab_Row_']").each(function () {
        CalculateVolumeWeight = parseFloat(CalculateVolumeWeight) + parseFloat($(this).find("input[id^='tblDimensionTab_VolumeWeight_']").val())
        CalculateCBM = parseFloat(CalculateCBM) + parseFloat($(this).find("input[id^='tblDimensionTab_Volume_']").val())
    });
    $("#AWBVolumeWeight").val(CalculateVolumeWeight.toFixed(2));
    $("#_tempAWBVolumeWeight").val(CalculateVolumeWeight.toFixed(2));
    $("#AWBCBM").val(CalculateCBM.toFixed(3));
    $("#_tempAWBCBM").val(CalculateCBM.toFixed(3));

    $("#AWBVolumeWeight").attr('disabled', true);
    $("#_tempAWBVolumeWeight").attr('disabled', true);
  //  $("#AWBCBM").attr('disabled', true);
  //  $("#_tempAWBCBM").attr('disabled', true);

    $("#ItineraryVolumeWeight").val(CalculateCBM.toFixed(3));
    $("#_tempItineraryVolumeWeight").val(CalculateCBM.toFixed(3));

    var grosswt = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));

    var chwt = grosswt > CalculateVolumeWeight ? grosswt : CalculateVolumeWeight;
    $("#AWBChargeableWeight").val(chwt);
    $("#_tempAWBChargeableWeight").val(chwt);
    //CalculateShipmentChWt('');
    var result = false;
    var RowCount = 0;
    var SetAndCalculateVolumeArray = [];
    var table = document.getElementById("tblSelectdRouteResult");
    if (table != null && table.rows.length > 1) {
        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
            var SetAndCalculateVolumeArrayItems = {
                Origin: $(tr).find("td")[2].innerText.split("/")[0].trim(),
                Destination: $(tr).find("td")[2].innerText.split("/")[1].trim()
            };
            SetAndCalculateVolumeArray.push(SetAndCalculateVolumeArrayItems);
        });

        if (SetAndCalculateVolumeArray.length > 0) {
            for (var i = 0; i < SetAndCalculateVolumeArray.length; i++) {
                RowCount = 0;
                $.map(SetAndCalculateVolumeArray, function (item) {
                    if (item.Origin == SetAndCalculateVolumeArray[i].Origin) {
                        RowCount = parseInt(RowCount) + parseInt(1);
                    }
                });
                if (RowCount > 1) {
                    result = false;
                    return false;
                }
                else {
                    result = true;
                }
            }
        }
        if (result = true) {
            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                $(tr).find("td")[5].innerText = CalculateCBM;
            });
        }
    }

}
function AddNewRowDimensionULDTab() {

    var row = 0;
    $("#tblDimensionTab").find("tr[id^='tblDimensionTab_Row_']").each(function () {
        //totalPieces = totalPieces + parseInt(($(this).find("input[id^='tblDimensionTab_Pieces']").val() || 0) == 0 ? ($(this).find("input[id^='tblDimensionTab_Pieces']").val() || 0) : ($(this).find("input[id^='tblDimensionTab_Pieces']").val() || 0));
        row = this.id.split('_')[2];
    });
    $('#tblDimensionULDTab').appendGrid('insertRow', 1, (parseInt(row) + parseInt(1)));
    //$('#tblDimensionULDTab').appendGrid('insertRow', 1, 0);
    GetAwbDetails(1, 0, 0, "tblDimensionULDTab", 1);
}
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
function DimensionULDTabafterRowAppended(caller, parentRowIndex, addedRowIndex) {
    var rows = 0;
    //var ULDTypeDataArray = [];
    var BUPPieces = parseInt(($("#AWBNoofBUP").val() || 0) == 0 ? ($("#_tempAWBNoofBUP").val() || 0) : ($("#AWBNoofBUP").val() || 0));
    var AWBNoofBUPIntact = ($("#AWBNoofBUPIntact").val() == "" ? 0 : parseFloat($("#AWBNoofBUPIntact").val()));
    var BUPORIntactPieces = 0;
    if (BUPPieces > 0)
        BUPORIntactPieces = BUPPieces;
    else if (AWBNoofBUPIntact > 0)
        BUPORIntactPieces = AWBNoofBUPIntact;
    $("tr[id^='tblDimensionULDTab_Row']").each(function (row, tr) {
        rows = tr.id.split('_')[2];


    });

    if (BUPORIntactPieces == 1)
        $('#tblDimensionULDTab_btnAppendRow').attr("style", "display:none;");


}
function CheckDimensionTabRowdata(rows) {
    var TotalAWBPieces = 0;
    if ($("#chkIsBUP").prop('checked') == true) {
        var BUPPieces = ($("#AWBNoofBUP").val() == "" ? 0 : parseFloat($("#AWBNoofBUP").val()));
        var AWBNoofBUPIntact = ($("#AWBNoofBUPIntact").val() == "" ? 0 : parseFloat($("#AWBNoofBUPIntact").val()));
        if (BUPPieces > 0)
            TotalAWBPieces = (parseInt(($("#AWBPieces").val() || 0) == 0 ? ($("#_tempAWBPieces").val() || 0) : ($("#AWBPieces").val() || 0)));
        else if (AWBNoofBUPIntact > 0)
            TotalAWBPieces = (parseInt(($("#AWBPieces").val() || 0) == 0 ? ($("#_tempAWBPieces").val() || 0) : ($("#AWBPieces").val() || 0)) - parseInt(AWBNoofBUPIntact));


    }
    else
        TotalAWBPieces = parseInt(($("#AWBPieces").val() || 0) == 0 ? ($("#_tempAWBPieces").val() || 0) : ($("#AWBPieces").val() || 0));
    var lastRowPieces = 0;
    var totalPieces = 0;
    var row = 0;
    $("#tblDimensionTab").find("tr[id^='tblDimensionTab_Row_']").each(function () {
        totalPieces = totalPieces + parseInt(($(this).find("input[id^='tblDimensionTab_Pieces']").val() || 0) == 0 ? ($(this).find("input[id^='tblDimensionTab_Pieces']").val() || 0) : ($(this).find("input[id^='tblDimensionTab_Pieces']").val() || 0));
        row = this.id.split('_')[2];
    });
    lastRowPieces = $('#tblDimensionTab_Pieces_' + row).val();
    $('#tblDimensionTab_Pieces_' + row).val(parseInt(lastRowPieces) + (parseInt(TotalAWBPieces) - parseInt(totalPieces)));
    $('#_temptblDimensionTab_Pieces_' + row).val(parseInt(lastRowPieces) + (parseInt(TotalAWBPieces) - parseInt(totalPieces)));
    if (row == 1)
        $('input:radio[name=tblDimensionTab_RbtnIsCMS_1]').attr("disabled", false);
    if (row == 0) {
        $("#AWBVolumeWeight").attr('disabled', true);
        $("#_tempAWBVolumeWeight").attr('disabled', true);
       // $("#AWBCBM").attr('disabled', true);
      //  $("#_tempAWBCBM").attr('disabled', true);
    }
    CalculatedVolumeCBM('tblDimensionTab_Pieces_' + row);
}
function CheckDimensionULDTabRowdata(rows) {
    CalculatedVolumeCBM('tblDimensionULDTab_Pieces_' + rows);
    var ULDTypeSNo = $('#tblDimensionULDTab_ULDTypeSNo_' + rows).val();
    var HdnULDTypeSNo = $('#tblDimensionULDTab_HdnULDTypeSNo_' + rows).val();
    var ULDNo = $('#tblDimensionULDTab_ULDNo_' + rows).val();
    var OwnerCode = $('#tblDimensionULDTab_OwnerCode_' + rows).val();
    var SLAC = $('#tblDimensionULDTab_SLAC_' + rows).val();
    var TotalAWBPieces = parseInt(($("#AWBPieces").val() || 0) == 0 ? ($("#_tempAWBPieces").val() || 0) : ($("#AWBPieces").val() || 0));
    var lastRowPieces = 0;
    var totalPieces = 0;
    var row = 0;
    var TotalRow = 0;




    $("#tblDimensionULDTab").find("tr[id^='tblDimensionULDTab_Row_']").each(function () {
        if ($(this).find("input[id^='tblDimensionULDTab_HdnULDTypeSNo']").val() == HdnULDTypeSNo && $(this).find("input[id^='tblDimensionULDTab_ULDNo']").val() == ULDNo && $(this).find("input[id^='tblDimensionULDTab_OwnerCode']").val() == OwnerCode && $(this).find("input[id^='tblDimensionULDTab_SLAC']").val() == SLAC) {
            totalPieces = totalPieces + parseInt(($(this).find("input[id^='tblDimensionULDTab_Pieces']").val() || 0) == 0 ? ($(this).find("input[id^='tblDimensionULDTab_Pieces']").val() || 0) : ($(this).find("input[id^='tblDimensionULDTab_Pieces']").val() || 0));
            row = this.id.split('_')[2];
            TotalRow = parseInt(TotalRow) + parseInt(1);
        }
    });
    lastRowPieces = $('#tblDimensionULDTab_Pieces_' + row).val();
    $('#tblDimensionULDTab_Pieces_' + row).val(parseInt(lastRowPieces) + (parseInt(SLAC) - parseInt(totalPieces)));
    $('#_temptblDimensionULDTab_Pieces_' + row).val(parseInt(lastRowPieces) + (parseInt(SLAC) - parseInt(totalPieces)));
    if (TotalRow == 1) {
        $('#tblDimensionULDTab_ULDTypeSNo_' + parseInt(row)).data("kendoAutoComplete").enable(true)
        $('#tblDimensionULDTab_ULDNo_' + parseInt(row)).removeAttr("disabled");
        $('#tblDimensionULDTab_OwnerCode_' + parseInt(row)).removeAttr("disabled");
        $('#tblDimensionULDTab_SLAC_' + parseInt(row)).removeAttr("disabled");
        $('input:radio[name=tblDimensionULDTab_RbtnIsCMS_' + parseInt(row) + ']').attr("disabled", false);
    }
}
function CalculatedDimensionPieces(id) {
    //CalculatedVolumeCBM(id);
    var TotalAWBPieces = 0;
    if ($("#chkIsBUP").prop('checked') == true) {
        var BUPPieces = ($("#AWBNoofBUP").val() == "" ? 0 : parseFloat($("#AWBNoofBUP").val()));
        var AWBNoofBUPIntact = ($("#AWBNoofBUPIntact").val() == "" ? 0 : parseFloat($("#AWBNoofBUPIntact").val()));
        if (BUPPieces > 0)
            TotalAWBPieces = (parseInt(($("#AWBPieces").val() || 0) == 0 ? ($("#_tempAWBPieces").val() || 0) : ($("#AWBPieces").val() || 0)));
        else if (AWBNoofBUPIntact > 0)
            TotalAWBPieces = (parseInt(($("#AWBPieces").val() || 0) == 0 ? ($("#_tempAWBPieces").val() || 0) : ($("#AWBPieces").val() || 0)) - parseInt(AWBNoofBUPIntact));


    }
    else
        TotalAWBPieces = parseInt(($("#AWBPieces").val() || 0) == 0 ? ($("#_tempAWBPieces").val() || 0) : ($("#AWBPieces").val() || 0));
    var rowIndex = id.split('_')[2];
    var Pieces = $('#tblDimensionTab_Pieces_' + rowIndex).val();
    var Length = $('#tblDimensionTab_Length_' + rowIndex).val();
    var Width = $('#tblDimensionTab_Width_' + rowIndex).val();
    var Height = $('#tblDimensionTab_Height_' + rowIndex).val();
    var totalPieces = 0;
    var row = 0;
    var lastRow = 0;
    var ValidateAllCondition = 1;
    $("#tblDimensionTab").find("tr[id^='tblDimensionTab_Row_']").each(function () {
        totalPieces = totalPieces + parseInt(($(this).find("input[id^='tblDimensionTab_Pieces']").val() || 0) == 0 ? ($(this).find("input[id^='tblDimensionTab_Pieces']").val() || 0) : ($(this).find("input[id^='tblDimensionTab_Pieces']").val() || 0));
        row = this.id.split('_')[2];

        var Pieces1 = $(this).find("input[id^='tblDimensionTab_Pieces_']").val() || 0;
        var Length1 = $(this).find("input[id^='tblDimensionTab_Length_']").val() || 0;
        var Width1 = $(this).find("input[id^='tblDimensionTab_Width_']").val() || 0;
        var Height1 = $(this).find("input[id^='tblDimensionTab_Height_']").val() || 0;
        if (Length1 == 0 || Width1 == 0 || Height1 == 0) {
            ValidateAllCondition = 0;
            return false;
        }
    });
    if (Pieces > 0) {
        if (TotalAWBPieces != totalPieces) {
            var CurrentPieces = 0;
            if (totalPieces > TotalAWBPieces) {
                CurrentPieces = parseInt(TotalAWBPieces) - (parseInt(totalPieces) - parseInt(Pieces))
                ShowMessage('warning', 'Information!', "Pieces cannot be greater than Total AWB Pieces.");
                $('#tblDimensionTab_Pieces_' + rowIndex).val(CurrentPieces);
                $('#_temptblDimensionTab_Pieces_' + rowIndex).val(CurrentPieces);
                CalculatedVolumeCBM(id);
                return;
            }
            else {
                CalculatedVolumeCBM(id);
                CurrentPieces = parseInt(TotalAWBPieces) - parseInt(totalPieces);
                if (Length > 0 && Width > 0 && Height > 0 && ValidateAllCondition == 1) {
                    $('#tblDimensionTab').appendGrid('insertRow', 1, (parseInt(row) + parseInt(1)));
                    $("#tblDimensionTab").find("tr[id^='tblDimensionTab_Row_']").each(function () {
                        lastRow = this.id.split('_')[2];
                    });
                    $("#_temptblDimensionTab_Length_" + lastRow).focus();
                    GetAwbDetails(parseInt(lastRow), parseInt(row), CurrentPieces, "tblDimensionTab", 0);
                }
                else {
                    ShowMessage('warning', 'Information!', "Enter Length, Weight and Height for split Pieces.");
                    $('#tblDimensionTab_Pieces_' + rowIndex).val(parseInt(CurrentPieces) + parseInt(Pieces));
                    $('#_temptblDimensionTab_Pieces_' + rowIndex).val(parseInt(CurrentPieces) + parseInt(Pieces));
                    return;
                }
            }
        }
        else
            CalculatedVolumeCBM(id);
    }
    else {
        ShowMessage('warning', 'Information!', "Pieces must be greater than 0.");
        $('#tblDimensionTab_Pieces_' + rowIndex).val(parseInt(TotalAWBPieces) - parseInt(totalPieces));
        $('#_temptblDimensionTab_Pieces_' + rowIndex).val(parseInt(TotalAWBPieces) - parseInt(totalPieces));
        return;
    }

}
function CalculatedDimensionULDSlac(id) {
    var TotalAWBPieces = parseInt(($("#AWBPieces").val() || 0) == 0 ? ($("#_tempAWBPieces").val() || 0) : ($("#AWBPieces").val() || 0));
    var rowIndex = id.split('_')[2];
    var ULDTypeSNo = $('#tblDimensionULDTab_ULDTypeSNo_' + rowIndex).val();
    var HdnULDTypeSNo = $('#tblDimensionULDTab_HdnULDTypeSNo_' + rowIndex).val();
    var ULDNo = $('#tblDimensionULDTab_ULDNo_' + rowIndex).val();
    var OwnerCode = $('#tblDimensionULDTab_OwnerCode_' + rowIndex).val();
    var SLAC = $('#tblDimensionULDTab_SLAC_' + rowIndex).val();
    var Pieces = $('#tblDimensionULDTab_Pieces_' + rowIndex).val();
    var Length = $('#tblDimensionULDTab_Length_' + rowIndex).val();
    var Width = $('#tblDimensionULDTab_Width_' + rowIndex).val();
    var Height = $('#tblDimensionULDTab_Height_' + rowIndex).val();
    var totalPieces = 0;
    var row = 0;
    if (kendo.parseFloat(HdnULDTypeSNo) > 0) {
        if (SLAC > 0) {
            $('#tblDimensionULDTab_Pieces_' + rowIndex).val(SLAC)
            $('#_temptblDimensionULDTab_Pieces_' + rowIndex).val(SLAC)
        }
    }
    else {
        $('#tblDimensionULDTab_SLAC_' + rowIndex).val('')
        $('#_temptblDimensionULDTab_SLAC_' + rowIndex).val('')
        ShowMessage('warning', 'Information!', "Enter ULD Type for SLAc.");
        return;
    }
}
function CalculatedDimensionULDPieces(id) {
    var TotalAWBPieces = parseInt(($("#AWBPieces").val() || 0) == 0 ? ($("#_tempAWBPieces").val() || 0) : ($("#AWBPieces").val() || 0));
    var rowIndex = id.split('_')[2];
    var ULDTypeSNo = $('#tblDimensionULDTab_ULDTypeSNo_' + rowIndex).val();
    var HdnULDTypeSNo = $('#tblDimensionULDTab_HdnULDTypeSNo_' + rowIndex).val();
    var ULDNo = $('#tblDimensionULDTab_ULDNo_' + rowIndex).val();
    var OwnerCode = $('#tblDimensionULDTab_OwnerCode_' + rowIndex).val();
    var SLAC = $('#tblDimensionULDTab_SLAC_' + rowIndex).val();
    var Pieces = $('#tblDimensionULDTab_Pieces_' + rowIndex).val();
    var Length = $('#tblDimensionULDTab_Length_' + rowIndex).val();
    var Width = $('#tblDimensionULDTab_Width_' + rowIndex).val();
    var Height = $('#tblDimensionULDTab_Height_' + rowIndex).val();
    var totalPieces = 0;
    var totalSLAC = 0;
    var row = 0;
    var lastRow = 0;
    var TotalRow = 0;
    $("#tblDimensionULDTab").find("tr[id^='tblDimensionULDTab_Row_']").each(function () {
        if ($(this).find("input[id^='tblDimensionULDTab_HdnULDTypeSNo']").val() == HdnULDTypeSNo && $(this).find("input[id^='tblDimensionULDTab_ULDNo']").val() == ULDNo && $(this).find("input[id^='tblDimensionULDTab_OwnerCode']").val() == OwnerCode && $(this).find("input[id^='tblDimensionULDTab_SLAC']").val() == SLAC) {
            totalPieces = totalPieces + parseInt(($(this).find("input[id^='tblDimensionULDTab_Pieces']").val() || 0) == 0 ? ($(this).find("input[id^='tblDimensionULDTab_Pieces']").val() || 0) : ($(this).find("input[id^='tblDimensionULDTab_Pieces']").val() || 0));
            row = this.id.split('_')[2];
            TotalRow = parseInt(TotalRow) + parseInt(1);
        }
        lastRow = this.id.split('_')[2];
    });
    if (Pieces > 0 && SLAC > 0 && row > 0) {
        if (SLAC != totalPieces) {
            var CurrentPieces = 0;
            if (totalPieces > SLAC) {
                CurrentPieces = parseInt(SLAC) - (parseInt(totalPieces) - parseInt(Pieces))
                ShowMessage('warning', 'Information!', "Total Pieces Can not be greater than SLAC.");
                $('#tblDimensionULDTab_Pieces_' + rowIndex).val(CurrentPieces);
                $('#_temptblDimensionULDTab_Pieces_' + rowIndex).val(CurrentPieces);
                return;
            }
            else {
                CalculatedVolumeCBM(id);
                CurrentPieces = parseInt(SLAC) - parseInt(totalPieces);
                if (Length > 0 && Width > 0 && Height > 0) {
                    $('#tblDimensionULDTab').appendGrid('insertRow', 1, (parseInt(row) + parseInt(1)));
                    $("#tblDimensionULDTab").find("tr[id^='tblDimensionULDTab_Row_']").each(function () {
                        lastRow = this.id.split('_')[2];
                    });
                    BindULDOwner(parseInt(row), parseInt(lastRow), parseInt(TotalRow), "tblDimensionULDTab");
                    GetAwbDetails(parseInt(lastRow), parseInt(row), CurrentPieces, "tblDimensionULDTab", 0);


                }
                else {
                    ShowMessage('warning', 'Information!', "Enter Length, Weight and Height for split Pieces.");
                    $('#tblDimensionULDTab_Pieces_' + rowIndex).val(parseInt(CurrentPieces) + parseInt(Pieces));
                    $('#_temptblDimensionULDTab_Pieces_' + rowIndex).val(parseInt(CurrentPieces) + parseInt(Pieces));
                    return;
                }
            }
        }
    }
    else {
        ShowMessage('warning', 'Information!', "Pieces must be greater than 0.");
        $('#tblDimensionULDTab_Pieces_' + rowIndex).val('');
        $('#_temptblDimensionULDTab_Pieces_' + rowIndex).val('');
        return;
    }
}
function GetAwbDetails(Lastrow, PreviousRow, CurrentPieces, table, IsDeleted) {
    if (table == "tblDimensionTab") {
        var IsCMS = $('input:radio[name=tblDimensionTab_RbtnIsCMS_' + PreviousRow + ']:checked').val();
        if (Lastrow > 1) {
            $('#_temptblDimensionTab_Pieces_' + Lastrow).val(CurrentPieces);
            $('#tblDimensionTab_Pieces_' + Lastrow).val(CurrentPieces);
            $('#_temptblDimensionTab_VolumeWeight_' + Lastrow).val($("#AWBVolumeWeight").val());
            $('#tblDimensionTab_VolumeWeight_' + Lastrow).val($("#AWBVolumeWeight").val());
            $('#_temptblDimensionTab_Volume_' + Lastrow).val($("#AWBCBM").val());
            $('#tblDimensionTab_Volume_' + Lastrow).val($("#AWBCBM").val());

            if (IsCMS == 1)
                $('input:radio[name=tblDimensionTab_RbtnIsCMS_' + parseInt(Lastrow) + ']:eq(1)').attr("checked", 1);
            else
                $('input:radio[name=tblDimensionTab_RbtnIsCMS_' + parseInt(Lastrow) + ']:eq(0)').attr("checked", 1);
            if (userContext.SysSetting.ICMSEnvironment == 'JT') {
                // $('input:radio[name=tblDimensionTab_RbtnIsCMS_' + parseInt(Lastrow) + ']').attr("disabled", true);
                // $('input:radio[name=tblDimensionTab_RbtnIsCMS_1]').attr("disabled", true);
            }
            else {
                $('input:radio[name=tblDimensionTab_RbtnIsCMS_' + parseInt(Lastrow) + ']').attr("disabled", true);
                $('input:radio[name=tblDimensionTab_RbtnIsCMS_1]').attr("disabled", true);
            }
        }
        else {
            $('#tblDimensionTab_Delete_1').attr("style", "display:none;");
            if ($("#chkIsBUP").prop('checked') == true) {
                var BUPPieces = ($("#AWBNoofBUP").val() == "" ? 0 : parseFloat($("#AWBNoofBUP").val()));
                var AWBNoofBUPIntact = ($("#AWBNoofBUPIntact").val() == "" ? 0 : parseFloat($("#AWBNoofBUPIntact").val()));
                var TotalAWBPieces = 0;
                if (BUPPieces > 0)
                    TotalAWBPieces = (parseInt(($("#AWBPieces").val() || 0) == 0 ? ($("#_tempAWBPieces").val() || 0) : ($("#AWBPieces").val() || 0)));
                else if (AWBNoofBUPIntact > 0)
                    TotalAWBPieces = (parseInt(($("#AWBPieces").val() || 0) == 0 ? ($("#_tempAWBPieces").val() || 0) : ($("#AWBPieces").val() || 0)) - parseInt(AWBNoofBUPIntact));



                $('#_temptblDimensionTab_Pieces_1').val(TotalAWBPieces);
                $('#tblDimensionTab_Pieces_1').val(TotalAWBPieces);
            }
            else {
                $('#_temptblDimensionTab_Pieces_1').val($("#AWBPieces").val());
                $('#tblDimensionTab_Pieces_1').val($("#AWBPieces").val());
            }
            $('#_temptblDimensionTab_VolumeWeight_1').val($("#AWBVolumeWeight").val());
            $('#tblDimensionTab_VolumeWeight_1').val($("#AWBVolumeWeight").val());
            $('#_temptblDimensionTab_Volume_1').val($("#AWBCBM").val());
            $('#tblDimensionTab_Volume_1').val($("#AWBCBM").val());
        }
    }
    if (table == "tblDimensionULDTab") {
        if (Lastrow > 1) {

        }
        else {
            $('#tblDimensionULDTab_Delete_1').attr("style", "display:none;");

        }
    }
}
function BindULDOwner(PreviousRow, CurrentRow, TotalRow, Table) {
    var ULDTypeSNo = $('#tblDimensionULDTab_ULDTypeSNo_' + PreviousRow).val();
    var HdnULDTypeSNo = $('#tblDimensionULDTab_HdnULDTypeSNo_' + PreviousRow).val();
    var ULDNo = $('#tblDimensionULDTab_ULDNo_' + PreviousRow).val();
    var OwnerCode = $('#tblDimensionULDTab_OwnerCode_' + PreviousRow).val();
    var SLAC = $('#tblDimensionULDTab_SLAC_' + PreviousRow).val();
    var IsCMS = $('input:radio[name=tblDimensionULDTab_RbtnIsCMS_' + PreviousRow + ']:checked').val();

    if (kendo.parseFloat(HdnULDTypeSNo) > 0) {
        $('#tblDimensionULDTab_ULDTypeSNo_' + parseInt(CurrentRow)).val(ULDTypeSNo)
        $('#tblDimensionULDTab_HdnULDTypeSNo_' + parseInt(CurrentRow)).val(HdnULDTypeSNo)
        $('#tblDimensionULDTab_ULDNo_' + parseInt(CurrentRow)).val(ULDNo)
        $('#_temptblDimensionULDTab_ULDNo_' + parseInt(CurrentRow)).val(ULDNo)
        $('#tblDimensionULDTab_OwnerCode_' + parseInt(CurrentRow)).val(OwnerCode)
        $('#tblDimensionULDTab_SLAC_' + parseInt(CurrentRow)).val(SLAC)
        $('#_temptblDimensionULDTab_SLAC_' + parseInt(CurrentRow)).val(SLAC)
        if (IsCMS == 1)
            $('input:radio[name=tblDimensionULDTab_RbtnIsCMS_' + parseInt(CurrentRow) + ']:eq(1)').attr("checked", 1);
        else
            $('input:radio[name=tblDimensionULDTab_RbtnIsCMS_' + parseInt(CurrentRow) + ']:eq(0)').attr("checked", 1);


        $('#tblDimensionULDTab_Delete_' + parseInt(PreviousRow)).attr("style", "display:none;");
        $('#tblDimensionULDTab_Delete_' + parseInt(CurrentRow)).attr("style", "display:block;");
        $('#tblDimensionULDTab_ULDTypeSNo_' + parseInt(CurrentRow)).data("kendoAutoComplete").enable(false)
        $('#tblDimensionULDTab_ULDNo_' + parseInt(CurrentRow)).attr('disabled', true);
        $('#tblDimensionULDTab_OwnerCode_' + parseInt(CurrentRow)).attr('disabled', true);
        $('#tblDimensionULDTab_SLAC_' + parseInt(CurrentRow)).attr('disabled', true);
        $('#_temptblDimensionULDTab_SLAC_' + parseInt(CurrentRow)).attr('disabled', true);
        $('input:radio[name=tblDimensionULDTab_RbtnIsCMS_' + parseInt(CurrentRow) + ']').attr("disabled", true);
        if (TotalRow == 1) {
            $('#tblDimensionULDTab_ULDTypeSNo_' + parseInt(PreviousRow)).data("kendoAutoComplete").enable(false)
            $('#tblDimensionULDTab_ULDNo_' + parseInt(PreviousRow)).attr('disabled', true);
            $('#tblDimensionULDTab_OwnerCode_' + parseInt(PreviousRow)).attr('disabled', true);
            $('#tblDimensionULDTab_SLAC_' + parseInt(PreviousRow)).attr('disabled', true);
            $('#_temptblDimensionULDTab_SLAC_' + parseInt(PreviousRow)).attr('disabled', true);
            $('input:radio[name=tblDimensionULDTab_RbtnIsCMS_' + parseInt(PreviousRow) + ']').attr("disabled", true);
        }
    }
}

function RateTab(id) {


    if (userContext.GroupName == "AGENT" && userContext.SysSetting.ICMSEnvironment == 'JT' && Viewflag == "0") {
        $('#btnSaveRateData').hide();
    }
    else
        $('#btnSaveRateData').show();
    if (AWBStatusDetails == "Cancel" || AWBStatusDetails == "Booked" || AWBStatusDetails == "BKD")
        $("#btnApplySpotCode").css("display", "none");
    //if (AWBStatusDetails != "Executed" && AWBStatusDetails != "RCS")
    //    $("#btnApplySpotCode").css("display", "none");
    var RateType = "";
    var MarketRate = "";
    var MKTFreight = "";
    var Currency = "";
    var PaymentType = "";
    var RateAirlineMasterSNo = "";
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/RateDetailsTab",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            BookingRefNo: $('#hdnBookingMasterRefNo').val(),
            AWBSNo: currentawbsno
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            var theDivULDDetails = document.getElementById("DivULDDetails");
            var theDivConstructRateDetails = document.getElementById("DivConstructRateDetails");
            theDivULDDetails.innerHTML = "";
            theDivConstructRateDetails.innerHTML = "";
            var theDiv = document.getElementById("divRateDetailsTab");
            theDiv.innerHTML = "";
            var theDiv1 = document.getElementById("divtblRateTab");
            theDiv1.innerHTML = "";
            var theDiv2 = document.getElementById("divtblTotalAmountTab");
            theDiv2.innerHTML = "";
            var trDiscount = "";
            var tdColumeSpotCode = "";
            var RateType = "";
            var Rate = "";
            var Freight = "";
            var RateCurrency = "";
            var AgentCurrency = "";
            var PaymentType = "";
            var ReferenceCode = "";
            var ULDRate = "";
            var SpotRate = "";
            var Commissionable = "";
            var RateClassCode = "";
            var AllinRate = "";
            var WeightBreakup = "";
            var DeclaredCarriageValue = "";
            var DeclaredCustomsValue = "";
            var PrepaidWeightCharge = "";
            var PrepaidValuation = "";
            var PrepaidTax = "";
            var PrepaidTotalChargesDueAgent = "";
            var PrepaidTotalChargesDueCarrier = "";
            var PrepaidTotalAmount = "";
            var CollectWeightCharge = "";
            var CollectValuation = "";
            var CollectTax = "";
            var CollectTotalChargesDueAgent = "";
            var CollectTotalChargesDueCarrier = "";
            var CollectTotalAmount = "";
            var trCommissionable = "";
            var ClassRateName = "";
            var RateAirlineClassRate = "";
            var RateAirlineClassRateAmount = "";
            var ClassRateRefNo = "";
            var DiscountedRate = "";
            var DiscountedFreight = "";
            var DiscountedTotalAmount = "";
            var TotalAmountAfterCommission = "";
            var table = "<table id='Ratetabtable' validateonsubmit='true'>";
            var table1 = "<table id='Ratetabtable1' validateonsubmit='true'>";
            var table2 = "<table id='Ratetabtable2' validateonsubmit='true'>";
            var ULDLink = "";
            var ConstructLink = "";
            var IsRepriced = "";
            var NoOfReprice = "0";
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    if (myData.Table0[0].SpotRate.toUpperCase() == "YES")
                        tdColumeSpotCode = "Spot Code :  " + myData.Table0[0].SpotCode + "";
                    if (userContext.SysSetting.DiscountApplicableOnBooking == "1")
                        trDiscount = "Discount :  " + myData.Table0[0].DiscountAmount + " ";//"<tr><td class='ui-widget-content'>Discount :  " + myData.Table0[0].DiscountAmount + "</td><td class='ui-widget-content'></td><td class='ui-widget-content'></td><td class='ui-widget-content'></td><td class='ui-widget-content'></td><td class='ui-widget-content'></td><td class='ui-widget-content'></td></tr>"

                    if (myData.Table0.length > 0) {
                        if (myData.Table0[0].Commissionable.toUpperCase() == "YES") {
                            trCommissionable = "<td class='ui-widget-content'>Commission:  " + myData.Table0[0].Commission + "</td><td class='ui-widget-content'>Commission Amount :  " + myData.Table0[0].CommissionAmount + "</td><td class='ui-widget-content'>Reference Code  :  " + myData.Table0[0].CommissionRefNo + "</td><td class='ui-widget-content'></td><td class='ui-widget-content'></td><td class='ui-widget-content'></td>"
                        }
                        else {
                            trCommissionable = "<td class='ui-widget-content'></td><td class='ui-widget-content'></td><td class='ui-widget-content'></td><td class='ui-widget-content'></td><td class='ui-widget-content'></td><td class='ui-widget-content'></td>"
                        }
                    }
                    RateType = myData.Table0[0].RateTypeName;
                    Rate = myData.Table0[0].MKTRate;
                    Freight = myData.Table0[0].MKTFreight;
                    RateCurrency = myData.Table0[0].RateCurrencyCode;
                    AgentCurrency = myData.Table0[0].AgentCurrencyCode;
                    PaymentType = myData.Table0[0].PaymentType;
                    ReferenceCode = myData.Table0[0].RateRefNo;
                    ULDRate = myData.Table0[0].ULDRating;
                    SpotRate = myData.Table0[0].SpotRate;
                    Commissionable = myData.Table0[0].Commissionable;
                    RateClassCode = myData.Table0[0].RateClassCode;
                    AllinRate = myData.Table0[0].AllINRate;
                    WeightBreakup = myData.Table0[0].WeightBreakupAdvantageYesORNo;
                    DeclaredCarriageValue = myData.Table0[0].DeclaredCarriageValue;
                    DeclaredCustomsValue = myData.Table0[0].DeclaredCustomsValue;
                    ClassRateNae = myData.Table0[0].ClassRateName;
                    RateAirlineClassRate = myData.Table0[0].RateAirlineClassRate;
                    RateAirlineClassRateAmount = myData.Table0[0].RateAirlineClassRateAmount;
                    ClassRateRefNo = myData.Table0[0].ClassRateRefNo;
                    DiscountedRate = myData.Table0[0].DiscountedRate;
                    DiscountedFreight = myData.Table0[0].DiscountedFreight;
                    DiscountedTotalAmount = myData.Table0[0].DiscountedTotalAmount;
                    IsRepriced = myData.Table0[0].IsRateProceeFromBackend == "undefined" ? "" : myData.Table0[0].IsRateProceeFromBackend;
                    NoOfReprice = myData.Table0[0].NumberOfReprice == "undefined" ? "0" : myData.Table0[0].NumberOfReprice;
                    if (myData.Table0[0].PaymentType == "Prepaid") {
                        PrepaidWeightCharge = myData.Table0[0].MKTFreight;
                        PrepaidTotalChargesDueCarrier = myData.Table0[0].OtherChargePrepaidDueCarrierTotal;
                        PrepaidTotalChargesDueAgent = myData.Table0[0].OtherChargePrepaidDueAgentTotal;
                        PrepaidTax = myData.Table0[0].TotalTaxAmount;
                        PrepaidValuation = myData.Table0[0].TotalPrepaidValuationsCharges;
                        PrepaidTotalAmount = myData.Table0[0].TotalAmount;
                        TotalAmountAfterCommission = (myData.Table0[0].TotalAmount - myData.Table0[0].CommissionAmount)
                    }
                    if (myData.Table0[0].PaymentType == "Collect") {
                        CollectWeightCharge = myData.Table0[0].MKTFreight;
                        CollectTotalChargesDueCarrier = myData.Table0[0].OtherChargeCollectDueCarrierTotal;
                        CollectTotalChargesDueAgent = myData.Table0[0].OtherChargeCollectDueAgentTotal;
                        CollectTax = myData.Table0[0].TotalTaxAmount;
                        CollectValuation = myData.Table0[0].TotalCollectValuationsCharges;
                        CollectTotalAmount = myData.Table0[0].TotalAmount;
                    }
                    if (myData.Table0[0].RateShowOnAWBPrint == "1")
                        $("#hdnRateShowOnAWBPrint").val('1');
                    else if (myData.Table0[0].RateShowOnAWBPrint == "2")
                        $("#hdnRateShowOnAWBPrint").val('2');
                    else
                        $("#hdnRateShowOnAWBPrint").val('3');
                    if (ULDRate.toUpperCase() == "YES") {
                        ULDLink = '<a title="ULD Rate Details" style="color: blue;" id="ahref_ULDDetails" href="javascript:void(0);"><span id="ULDDetails">ULD Rate Details</span></a>';
                    }
                }


                table += "<table class='appendGrid ui-widget'><thead class='ui-widget-header'>";

                var IsConstructRateValue = userContext.SysSetting.IsConstructRateApplicable;
                var IsConstructRate = '';
                if (IsConstructRateValue == "FALSE") {
                    IsConstructRate = "No";
                }
                else {
                    IsConstructRate = "Yes";
                    ConstructLink = '<a title="Construct Rate Details" style="color: blue;" id="ahref_ConstructRateDetails" href="javascript:void(0);"><span id="ConstructRateDetails">Construction Rate Details</span></a>';
                }
                // table += "<tr><td class='ui-widget-content'>Construct Rate : " + IsConstructRate + '&nbsp;&nbsp;&nbsp;&nbsp;' + ConstructLink + "</td></tr>";

                table += "<tr><td class='ui-widget-header' colspan='7'>Rate Information : </td></tr></thead><tbody class='ui-widget-content'>";
                table += "<tr><td class='ui-widget-content'>Rate Type : " + RateType + " &nbsp;&nbsp; " + ConstructLink + "</td><td class='ui-widget-content'>Rate :  " + Rate + "</td><td class='ui-widget-content'>Freight :  " + Freight + "</td><td class='ui-widget-content'>Rate Currency :  " + RateCurrency + "</td><td class='ui-widget-content'>Agent Currency :  " + AgentCurrency + "</td><td class='ui-widget-content'>Payment Type : " + PaymentType + "</td><td class='ui-widget-content'>Reference Code : " + ReferenceCode + "</td></tr>";
                table += "<tr><td class='ui-widget-content'>ULD Rate : " + ULDRate + '&nbsp;&nbsp;&nbsp;&nbsp;' + ULDLink + "</td><td class='ui-widget-content'>Spot Rate :  " + SpotRate + "</td><td class='ui-widget-content'>Rate Class Code :  " + RateClassCode + "</td><td class='ui-widget-content'>All in Rate :  " + AllinRate + "</td><td class='ui-widget-content'>Weight Break up :  " + WeightBreakup + "</td> <td class='ui-widget-content'>" + trDiscount + "</td> <td class='ui-widget-content'>" + tdColumeSpotCode + "</td></tr>";
                table += "<tr><td class='ui-widget-content' colspan='7' height='15'></td></tr>";
                table += "<tr><td class='ui-widget-content'>Class Name: " + ClassRateName + "</td><td class='ui-widget-content'>Class Rate :  " + RateAirlineClassRate + "</td><td class='ui-widget-content'>Class Amount :  " + RateAirlineClassRateAmount + "</td><td class='ui-widget-content'>Class Reference Code :  " + ClassRateRefNo + "</td><td class='ui-widget-content'>Re-Priced: " + IsRepriced + "</td><td class='ui-widget-content'>Number Of Reprice: " + NoOfReprice + "</td><td class='ui-widget-content'></td></tr>";




                // table += "" + trDiscount + "";

                table += "<tr><td class='ui-widget-content' colspan='7' height='15'></td></tr>";
                table += "<tr><td class='ui-widget-content'>Commissionable :  " + Commissionable + "</td>" + trCommissionable + "</tr>";// Added by Akaram Ali  on 11 Dec 2017 for Commission Type AND Commission Amount and trDiscount is commented 

                table += "<tr><td class='ui-widget-content' colspan='7' height='15'></td></tr>";

                table += "<tr><td class='ui-widget-content'>Discounted Rate(%) :  " + DiscountedRate + "</td><td class='ui-widget-content'>Discounted Freight :  " + DiscountedFreight + "</td><td class='ui-widget-content'>Discounted Total Amount :  " + DiscountedTotalAmount + "</td><td class='ui-widget-content'></td><td class='ui-widget-content'></td><td class='ui-widget-content'></td><td class='ui-widget-content'></td></tr>";

                table += "</tbody></table>";

                table += "</br><table class='appendGrid ui-widget'><thead class='ui-widget-header'>";
                table += "<tr><td class='ui-widget-header' colspan='3'>Show on AWB Print : </td></tr></thead><tbody class='ui-widget-content'>";
                table += "<tr><td class='ui-widget-content'><input id='chkTactRate' name='chkTactRate' type='checkbox' value='1' onclick='SelectClicked(this);'>TACT Rate</td><td class='ui-widget-content'><input id='chkPubRate' name='chkPubRate' type='checkbox' value='2' onclick='SelectClicked(this);'>Published Rate</td><td class='ui-widget-content'><input id='chkAsAgreed' name='chkAsAgreed' type='checkbox' value='3' onclick='SelectClicked(this);'>As Agreed</td></tr>";
                table += "</tbody></table>";

                table1 += "</br><table class='appendGrid ui-widget'><thead class='ui-widget-header'>";
                table1 += "<tr><td class='ui-widget-header' colspan='4'>Charge Declarations : </td></tr></thead><tbody class='ui-widget-content'>";
                table1 += "<tr><td class='ui-widget-content'>Currency : <div><input type='hidden' name='Currency' id='Currency' value=''><input type='text' class='' name='Text_Currency' id='Text_Currency' data-valid='required' data-valid-msg='Select Currency' controltype='autocomplete' maxlength='10' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td class='ui-widget-content'>Charge Code : <div><input type='hidden' name='RateChargeCode' id='RateChargeCode' value=''><input type='text' class='' name='Text_RateChargeCode' id='Text_RateChargeCode' data-valid='required' data-valid-msg='Select Charge Code' controltype='autocomplete' maxlength='10' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td class='ui-widget-content'>Weight/Valuation : <div><input type='hidden' name='Valuation' id='Valuation' value=''><input type='text' class='' name='Text_Valuation' id='Text_Valuation' data-valid='required' data-valid-msg='Select Valuation' controltype='autocomplete' maxlength='10' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td class='ui-widget-content'>Other Charge : <div><input type='hidden' name='OtherCharge' id='OtherCharge' value=''><input type='text' class='' name='Text_OtherCharge' id='Text_OtherCharge' data-valid='required' data-valid-msg='Select Other Charge' controltype='autocomplete' maxlength='10' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td></tr>";
                table1 += "<tr><td class='ui-widget-content'>Declared Value for Carriage : <div><input type='text' class='' name='DeclaredCarriageValue' id='DeclaredCarriageValue' style='text-transform: uppercase;width: 150px;' controltype='alphanumericupper' maxlength='12' value='NVD' data-role='alphabettextbox' autocomplete='off'></div></td><td class='ui-widget-content'>Declared Value for Customs : <div><input type='text' class='' name='DeclaredCustomsValue' id='DeclaredCustomsValue' style='text-transform: uppercase;width: 150px;' controltype='alphanumericupper' maxlength='12' value='NCV' data-role='alphabettextbox' autocomplete='off'></div></td><td class='ui-widget-content'>Insurance :<div><input type='text' class='' name='Insurance' id='Insurance' style='text-transform: uppercase;width: 150px;' controltype='alphanumericupper' maxlength='12' value='XXX' data-role='alphabettextbox' autocomplete='off'></div></td><td class='ui-widget-content'>Valuation Charge : <div><input type='text' class='' name='ValuationCharge' style='width: 150px;' id='ValuationCharge' controltype='number' maxlength='12' value='' data-role='numerictextbox'></div></td></tr>";
                table1 += "</tbody></table>";

                table1 += "</br><table class='appendGrid ui-widget'><thead class='ui-widget-header'>";
                table1 += "<tr><td class='ui-widget-header' colspan='5'>CC Charges in Destination Currency : </td></tr></thead><tbody class='ui-widget-content'>";
                table1 += "<tr><td class='ui-widget-content'>Currency Code : <div><input type='hidden' name='CDCCurrencyCode' id='CDCCurrencyCode' value=''><input type='text' data-valid='required' data-valid-msg='Enter Declared Value for Carriage' class='' name='Text_CDCCurrencyCode' id='Text_CDCCurrencyCode' data-valid='required' data-valid-msg='Select Currency Code' controltype='autocomplete' maxlength='10' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td class='ui-widget-content'>Conversion Rate : <div><input type='text' class='' name='CDCConversionRate' style='width: 120px;' id='CDCConversionRate' controltype='decimal3' maxlength='12' value='' data-role='numerictextbox'></div></td><td class='ui-widget-content'>Destination Currency Code : <div><input type='hidden' name='CDCDestCurrencyCode' id='CDCDestCurrencyCode' value=''><input type='text' class='' name='Text_CDCDestCurrencyCode' id='Text_CDCDestCurrencyCode' data-valid='required' data-valid-msg='Select Destination Currency Code' controltype='autocomplete' maxlength='10' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td class='ui-widget-content'>Charge Amount : <div><input type='text' class='' name='ChargeAmount' style='width: 120px;' id='ChargeAmount' controltype='decimal2' maxlength='12' value='' data-role='numerictextbox'></div></td><td class='ui-widget-content'>Total Charge Amount : <div><input type='text' class='' name='TotalChargeAmount' style='width: 120px;' id='TotalChargeAmount' controltype='decimal2' maxlength='12' value='' data-role='numerictextbox'></div></td></tr>";
                table1 += "</tbody></table>";

                if (userContext.SysSetting.ICMSEnvironment == 'JT') {
                    table1 += "</br><table class='appendGrid ui-widget' id='tblhandling'><thead class='ui-widget-header'>";
                    table1 += "<tr><td class='ui-widget-header' colspan='5'>Handling Information: </td></tr></thead><tbody class='ui-widget-content'>";
                    table1 += "<tr><td class='ui-widget-content first' style='text-align: left;'>Transaction By:<input type='radio' name='transactionby' value='1'  checked> Cash<input type='radio' name='transactionby' value='2'> Debit card</td><td class='ui-widget-content'>Transaction Amount:<input type='text' class='k-input k-state-default' name='transactonamount' style='width: 120px; text-align: right; display: none;' id='transactonamount' controltype='decimal2' maxlength='15' value='' data-role='numerictextbox'></td><td class='ui-widget-content'>Transaction No.:<input type='text' class='k-input' name='transactionno' id='transactionno' style='text-transform: uppercase; width: 150px;' controltype='alphanumericupper' maxlength='16' value='' data-role='alphabettextbox' autocomplete='off'></td></tr>";
                    table1 += "</tbody></table>";

                }
                table2 += "</br><table class='appendGrid ui-widget'><thead class='ui-widget-header'>";
                table2 += "<tr><td class='ui-widget-header' colspan='6'>Prepaid Amount Details : </td></tr></thead><tbody class='ui-widget-content'>";
                table2 += "<tr><td class='ui-widget-content'>Total Weight Charge : " + PrepaidWeightCharge + "</td><td class='ui-widget-content'>Total Due Carrier Charges :  " + PrepaidTotalChargesDueCarrier + "</td><td class='ui-widget-content'>Total Due Agent Charges :  " + PrepaidTotalChargesDueAgent + "</td><td class='ui-widget-content'>Total Tax :  " + PrepaidTax + "</td><td style='display: none;' class='ui-widget-content'>Total Valuation :  " + PrepaidValuation + "</td><td class='ui-widget-content'>Total Amount : " + PrepaidTotalAmount + "</td></tr>";
                table2 += "<tr><td class='ui-widget-content'></td><td class='ui-widget-content'></td><td class='ui-widget-content'></td><td class='ui-widget-content'></td><td style='display: none;' class='ui-widget-content'></td><td class='ui-widget-content'>Total Amount After Commission : " + TotalAmountAfterCommission + "</td></tr>";
                table2 += "</tbody></table>";

                table2 += "</br><table class='appendGrid ui-widget'><thead class='ui-widget-header'>";
                table2 += "<tr><td class='ui-widget-header' colspan='6'>Collect Amount Details : </td></tr></thead><tbody class='ui-widget-content'>";
                table2 += "<tr><td class='ui-widget-content'>Total Weight Charge : " + CollectWeightCharge + "</td><td class='ui-widget-content'>Total Due Carrier Charges :  " + CollectTotalChargesDueCarrier + "</td><td class='ui-widget-content'>Total Due Agent Charges :  " + CollectTotalChargesDueAgent + "</td><td class='ui-widget-content'>Total Tax :  " + CollectTax + "</td><td  style='display: none;' class='ui-widget-content'>Total Valuation :  " + CollectValuation + "</td><td class='ui-widget-content'>Total Amount : " + CollectTotalAmount + "</td></tr>";
                table2 += "</tbody></table>";

                table += "</table></br>";
                table1 += "</table></br>";
                table2 += "</table>";
                theDiv.innerHTML += table;
                theDiv1.innerHTML += table1;
                theDiv2.innerHTML += table2;

                InstantiateControl("DivRateTab");


                cfi.AutoCompleteV2("Currency", "CurrencyCode", "Reservation_Currency", null, "contains");
                cfi.AutoCompleteV2("RateChargeCode", "AWBChargeCode", "Reservation_RateChargeCode", null, "contains");
                cfi.AutoCompleteByDataSource("Valuation", WeightValuation);
                cfi.AutoCompleteByDataSource("OtherCharge", WeightValuation);
                cfi.AutoCompleteV2("CDCCurrencyCode", "CurrencyCode", "Reservation_Currency", null, "contains");
                cfi.AutoCompleteV2("CDCDestCurrencyCode", "CurrencyCode", "Reservation_Currency", null, "contains");
                if ($("#hdnRateShowOnAWBPrint").val() == "1") {
                    $("#chkTactRate").prop("checked", true);
                    $("#chkPubRate").prop("checked", false);
                    $("#chkAsAgreed").prop("checked", false);
                }
                else if ($("#hdnRateShowOnAWBPrint").val() == "2") {
                    $("#chkTactRate").prop("checked", false);
                    $("#chkPubRate").prop("checked", true);
                    $("#chkAsAgreed").prop("checked", false);
                }
                else if ($("#hdnRateShowOnAWBPrint").val() == "3") {
                    $("#chkTactRate").prop("checked", false);
                    $("#chkPubRate").prop("checked", false);
                    $("#chkAsAgreed").prop("checked", true);
                }
                else {
                    $("#chkTactRate").prop("checked", false);
                    $("#chkPubRate").prop("checked", true);
                    $("#chkAsAgreed").prop("checked", false);
                }

                if (myData.Table1.length > 0) {
                    if (myData.Table1[0].CVDCurrencyCode != "")
                        $("#Text_Currency").data("kendoAutoComplete").setDefaultValue(myData.Table1[0].CVDCurrencyCode, myData.Table1[0].CVDCurrencyCode + '-' + myData.Table1[0].CVDCurrencyCodeName);
                    if (myData.Table1[0].CVDChargeCode != "")
                        $("#Text_RateChargeCode").data("kendoAutoComplete").setDefaultValue(myData.Table1[0].CVDChargeCode, myData.Table1[0].CVDChargeCode + '-' + myData.Table1[0].CVDChargeCodeDescription);
                    if (myData.Table1[0].CVDWeightValuation != "")
                        $("#Text_Valuation").data("kendoAutoComplete").setDefaultValue(myData.Table1[0].CVDWeightValuation, myData.Table1[0].CVDWeightValuationDescription);
                    if (myData.Table1[0].CVDOtherCharges != "")
                        $("#Text_OtherCharge").data("kendoAutoComplete").setDefaultValue(myData.Table1[0].CVDOtherCharges, myData.Table1[0].CVDOtherChargesDescription);
                    $("#DeclaredCarriageValue").val(myData.Table1[0].CVDDeclareCarriageValue);
                    $("#DeclaredCustomsValue").val(myData.Table1[0].CVDDeclareCustomValue);
                    $("#Insurance").val(myData.Table1[0].CVDDeclareInsurenceValue);
                    $("#ValuationCharge").val(myData.Table1[0].CVDValuationCharge);
                    $("#_tempValuationCharge").val(myData.Table1[0].CVDValuationCharge);
                    if (myData.Table1[0].CDCCurrencyCode != "")
                        $("#Text_CDCCurrencyCode").data("kendoAutoComplete").setDefaultValue(myData.Table1[0].CDCCurrencyCode, myData.Table1[0].CDCCurrencyCode + '-' + myData.Table1[0].CDCCurrencyCodeName);
                    $("#CDCConversionRate").val(myData.Table1[0].CDCCurrencyConversionRate);
                    $("#_tempCDCConversionRate").val(myData.Table1[0].CDCCurrencyConversionRate);
                    if (myData.Table1[0].CDCDestinationCurrencyCode != "")
                        $("#Text_CDCDestCurrencyCode").data("kendoAutoComplete").setDefaultValue(myData.Table1[0].CDCDestinationCurrencyCode, myData.Table1[0].CDCDestinationCurrencyCode + '-' + myData.Table1[0].CDCDestinationCurrencyCodeName);
                    $("#ChargeAmount").val(myData.Table1[0].CDCChargeAmount);
                    $("#_tempChargeAmount").val(myData.Table1[0].CDCChargeAmount);
                    $("#TotalChargeAmount").val(myData.Table1[0].CDCTotalChargeAmount);
                    $("#_tempTotalChargeAmount").val(myData.Table1[0].CDCTotalChargeAmount);
                }

                if (myData.Table2.length > 0) {
                    var table = "<table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'></table><table class='appendGrid ui-widget'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>ULD Name</td><td class='ui-widget-header'>Pivot Wt.</td><td class='ui-widget-header'>Pivot Rate</td><td class='ui-widget-header'>Over Pivot Rate</td><td class='ui-widget-header'>Freight</td><td class='ui-widget-header'>Rate Ref No.</td></tr></thead><tbody class='ui-widget-content'>";
                    for (var i = 0; i < myData.Table2.length; i++) {
                        table += "<tr><td class='ui-widget-content first'>" + myData.Table2[i].ULDName + "</td><td class='ui-widget-content first'>" + myData.Table2[i].PivotWt + "</td><td class='ui-widget-content first'>" + myData.Table2[i].PivotRate + "</td><td class='ui-widget-content first'>" + myData.Table2[i].OverPivotRate + "</td><td class='ui-widget-content first'>" + myData.Table2[i].MKTFreight + "</td><td class='ui-widget-content first'>" + myData.Table2[i].RateRefNo + "</td></tr>";
                    }
                    table += "</tbody></table>";
                    theDivULDDetails.innerHTML += table;
                }

                if (myData.Table3.length > 0) {
                    $('input:radio[name=transactionby][value="' + myData.Table3[0].TransactionBy + '"]').prop('checked', true);
                    $('#transactonamount').val(myData.Table3[0].TransactionAmount);
                    $('#_temptransactonamount').val(myData.Table3[0].TransactionAmount);
                    $("#transactionno").val(myData.Table3[0].TransactionNo);
                }
                if (myData.Table4.length > 0) {
                    var table = "<table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'></table><table class='appendGrid ui-widget'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>RateType Name</td><td class='ui-widget-header'>Rate</td><td class='ui-widget-header'>Freight</td><td class='ui-widget-header'>Rate Currency</td><td class='ui-widget-header'>Rate Ref No.</td></tr></thead><tbody class='ui-widget-content'>";
                    for (var i = 0; i < myData.Table4.length; i++) {
                        table += "<tr><td class='ui-widget-content first'>" + myData.Table4[i].RateTypeName + "</td><td class='ui-widget-content first'>" + myData.Table4[i].MKTRate + "</td><td class='ui-widget-content first'>" + myData.Table4[i].MKTFreight + "</td><td class='ui-widget-content first'>" + myData.Table4[i].CurrencyCode + "</td><td class='ui-widget-content first'>" + myData.Table4[i].RateRaferenceNumber + "</td></tr>";
                    }
                    table += "</tbody></table>";
                    theDivConstructRateDetails.innerHTML += table;
                }

                $("a[id^='ahref_ULDDetails']").unbind("click").bind("click", function () {
                    cfi.PopUp("DivULDDetails", "ULD Rate Details");
                });
                $("a[id^='ahref_ConstructRateDetails']").unbind("click").bind("click", function () {
                    cfi.PopUp("DivConstructRateDetails", "Construction Rate Details");
                });
            }
        },
        error: function (xhr) {
            var a = "";
        }
    });

    var dbTableName = 'DueCarrierOtherChargeTab';
    var pageType = 'View';
    if (userContext.SysSetting.ICMSEnvironment == 'JT' && AWBStatusNo == 16 && IsApproveCancelShipment == 'True')
        pageType = HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();
    else {
        if (AWBStatusNo == 16 && AWBStock == 'YES' && userContext.SysSetting.ICMSEnvironment == 'GA')
            pageType = (AWBStatusNo > 5 && AWBStatusNo != 15 && AWBStatusNo != 16) || HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();
        else
            pageType = (AWBStatusNo > 5 && AWBStatusNo != 15) || HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();
    }
    $('#tbl' + dbTableName).appendGrid({
        V2: true,
        tableID: 'tbl' + dbTableName,
        contentEditable: pageType != 'View',
        tableColumns: 'SNo,OtherChargeCode,OtherchargeDetail,ChargeValue',
        masterTableSNo: $('#hdnBookingMasterRefNo').val(),
        currentPage: 1, itemsPerPage: 50,
        model: { AWBSNo: currentawbsno == "" ? 0 : parseFloat(currentawbsno) },
        sort: '',
        servicePath: 'Services/Shipment/ReservationBookingService.svc',
        getRecordServiceMethod: 'Get' + dbTableName + 'Record',
        createUpdateServiceMethod: 'createUpdate' + dbTableName,
        deleteServiceMethod: 'delete' + dbTableName,
        caption: 'Due Carrier Other Charges Information',
        initRows: 1,
        isGetRecord: true,
        columns: [
			{ name: 'SNo', type: 'hidden', value: 0 },
			{ name: 'AWBSNo', type: 'hidden', value: currentawbsno },
			{ name: 'BookingSNo', type: 'hidden', value: $('#hdnBookingSNo').val() },
			{ name: 'BookingRefNo', type: 'hidden', value: $('#hdnBookingMasterRefNo').val() },
			{ name: 'Type', display: 'Payment Type', type: 'select', ctrlOptions: { '1': 'PREPAID', '2': 'COLLECT' }, isRequired: true, onChange: function (evt, rowIndex) { }, ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
			{ name: 'OtherChargeCode', display: 'Charge Code', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '70px' }, isRequired: true, AutoCompleteName: 'Reservation_DueCarrier', filterField: "Code", filterCriteria: "contains" },
			{ name: 'OtherchargeDetail', display: 'Charge Detail', type: 'text', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
			//{ name: 'OtherchargeCurrency', display: 'Other Charges Currency', type: 'text', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
			{ name: 'OtherchargeCurrency', display: 'Other Charge Currency', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '70px' }, isRequired: true, AutoCompleteName: 'Reservation_AgentOtherChargeCurrency', filterField: "CurrencyCode", filterCriteria: "contains" },

			{ name: 'ChargeValue', display: 'Amount', type: 'text', value: '', ctrlAttr: { maxlength: 10, controltype: 'decimal2' }, ctrlCss: { width: '90px' }, isRequired: true },
			{ name: 'ConvertedCurrencyCode', display: 'Rate Currency', type: 'label', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
			{ name: 'ConvertedChargeValue', display: 'Rate Charge', type: 'label', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
			{ name: 'ReferenceNumber', display: 'Reference Number', type: 'label', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
			{ name: 'ChargeType', display: 'Mode of Charge', type: 'label', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
			{ name: 'CreatedBy', type: 'hidden', value: userContext.UserSNo },
			{ name: 'UpdatedBy', type: 'hidden', value: userContext.UserSNo }

        ],
        beforeRowRemove: function (caller, rowIndex) {
            //CheckDimensionTabRowdata(rowIndex);
        },
        OnUpdateSuccess: function () {
            RateTab();
        }, rowUpdateExtraFunction: function (id) {

            hidetblDueCarrierOtherChargeTab()
        },
        afterRowRemoved: function (caller, rowIndex) {

            RateTab();
        },

        isPaging: false,
        hideButtons: { updateAll: false, insert: true, removeLast: true },

    });

    var dbTableName = 'AgentOtherChargeTab';
    //var pageType = $('#hdnPageType').val();
    var pageType = 'View';
    if (userContext.SysSetting.ICMSEnvironment == 'JT' && AWBStatusNo == 16 && IsApproveCancelShipment == 'True')
        pageType = HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();
    else {
        if (AWBStatusNo == 16 && AWBStock == 'YES' && userContext.SysSetting.ICMSEnvironment == 'GA')
            pageType = (AWBStatusNo > 5 && AWBStatusNo != 15 && AWBStatusNo != 16) || HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();
        else
            pageType = (AWBStatusNo > 5 && AWBStatusNo != 15) || HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();       //No Show Work Commented
        //var pageType = (AWBStatusNo > 5 && AWBStatusNo != 15) || HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();       //No Show Work Commented
        //var pageType = AWBStatusNo > 5 ? 'View' : $('#hdnPageType').val();
    }
    $('#tbl' + dbTableName).appendGrid({
        V2: true,
        tableID: 'tbl' + dbTableName,
        contentEditable: pageType != 'View',
        tableColumns: 'SNo,Pieces,Length,Width,Height,VolumeWeight,CBM',
        masterTableSNo: $('#hdnBookingMasterRefNo').val(),
        currentPage: 1, itemsPerPage: 5,
        model: { AWBSNo: currentawbsno == "" ? 0 : parseFloat(currentawbsno) },
        sort: '',
        servicePath: 'Services/Shipment/ReservationBookingService.svc',
        getRecordServiceMethod: 'Get' + dbTableName + 'Record',
        createUpdateServiceMethod: 'createUpdate' + dbTableName,
        deleteServiceMethod: 'delete' + dbTableName,
        caption: 'Due Agent Other Charges Information',
        initRows: 1,
        isGetRecord: true,
        columns: [
			{ name: 'SNo', type: 'hidden', value: 0 },
			{ name: 'AWBSNo', type: 'hidden', value: currentawbsno },
			{ name: 'BookingSNo', type: 'hidden', value: $('#hdnBookingSNo').val() },
			{ name: 'BookingRefNo', type: 'hidden', value: $('#hdnBookingMasterRefNo').val() },
			{ name: 'Type', display: 'Payment Type', type: 'select', ctrlOptions: { '1': 'PREPAID', '2': 'COLLECT' }, isRequired: true, onChange: function (evt, rowIndex) { }, ctrlCss: { width: '90px' } },
			{ name: 'OtherChargeType', display: 'Charge Type', type: 'hidden', ctrlOptions: { '1': 'DUE CARRIER', '2': 'DUE AGENT' }, isRequired: true, onChange: function (evt, rowIndex) { }, ctrlCss: { width: '100px' } },
			{ name: 'OtherChargeCode', display: 'Charge Code', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '70px' }, isRequired: true, AutoCompleteName: 'Reservation_DueCarrier', filterField: "Code", filterCriteria: "contains" },
			{ name: 'OtherchargeDetail', display: 'Charge Detail', type: 'text', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '150px' } },
			{ name: 'AgentOtherchargeCurrency', display: 'Other Charge Currency', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '70px' }, isRequired: true, AutoCompleteName: 'Reservation_AgentOtherChargeCurrency', filterField: "CurrencyCode", filterCriteria: "contains" },
			{ name: 'ChargeValue', display: 'Amount', type: 'text', value: '', ctrlAttr: { maxlength: 10, controltype: 'decimal2' }, ctrlCss: { width: '90px' }, isRequired: true },
			{ name: 'ConvertedCurrencyCode', display: 'Rate Currency', type: 'label', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
			{ name: 'ConvertedChargeValue', display: 'Rate Charge', type: 'label', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
			{ name: 'ReferenceNumber', display: 'Reference Number', type: 'label', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
			{ name: 'ChargeType', display: 'Mode of Charge', type: 'label', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
			{ name: 'CreatedBy', type: 'hidden', value: userContext.UserSNo },
			{ name: 'UpdatedBy', type: 'hidden', value: userContext.UserSNo }
        ],
        beforeRowRemove: function (caller, rowIndex) {
            //CheckDimensionTabRowdata(rowIndex);
        },
        OnUpdateSuccess: function () {
            $("tr[id^='tblAgentOtherChargeTab_Row']").each(function (row, tr) {
                $(tr).find("select[id^='tblAgentOtherChargeTab_Type_']").attr("disabled", true);
                $(tr).find("select[id^='tblAgentOtherChargeTab_OtherChargeType_']").attr("disabled", true);
                $(tr).find("input[id^='tblAgentOtherChargeTab_OtherChargeCode_']").attr("disabled", true);
                $(tr).find("input[id^='tblAgentOtherChargeTab_OtherchargeDetail_']").attr("disabled", true);
                $(tr).find("input[id^='_temptblAgentOtherChargeTab_ChargeValue_']").attr("disabled", true);
                //$(tr).find("input[id^='tblAgentOtherChargeTab_AgentOtherchargeCurrency_']").attr("disabled", true);
                $(tr).find("input[id^='tblAgentOtherChargeTab_AgentOtherchargeCurrency_']").data("kendoAutoComplete").enable(false);
                $(tr).find("input[id^='tblAgentOtherChargeTab_ChargeValue_']").attr("disabled", true);

                //$(tr).find("button[id^='tblAgentOtherChargeTab_Delete_']").attr("disabled", true);
                //  $(tr).find("button[id^='tblAgentOtherChargeTab_Delete_']").attr("style", "display:none;");
            });
            RateTab();
        },
        rowUpdateExtraFunction: function (id) {

            hidetblAgentOtherChargeTab();
        },
        afterRowRemoved: function (caller, rowIndex) {

            RateTab();
        },
        isPaging: false,
        hideButtons: { updateAll: false, insert: true, removeLast: true },
    });
    var refcode = $("#divRateDetailsTab table td:contains(Reference Code :)").text().split(':')[1]
    if (refcode == " ")
        $("#tblAgentOtherChargeTab_btnAppendRow").hide();
    else
        $("#tblAgentOtherChargeTab_btnAppendRow").show();
    $("tr[id^='tblAgentOtherChargeTab_Row']").each(function (row, tr) {
        $(tr).find("select[id^='tblAgentOtherChargeTab_Type_']").attr("disabled", true);
        $(tr).find("select[id^='tblAgentOtherChargeTab_OtherChargeType_']").attr("disabled", true);
        $(tr).find("input[id^='tblAgentOtherChargeTab_OtherChargeCode_']").attr("disabled", true);
        $(tr).find("input[id^='tblAgentOtherChargeTab_OtherchargeDetail_']").attr("disabled", true);
        $(tr).find("input[id^='_temptblAgentOtherChargeTab_ChargeValue_']").attr("disabled", true);
        if (pageType != 'View') {
            if ($(tr).find("input[id^='tblAgentOtherChargeTab_HdnAgentOtherchargeCurrency_']").val() != "")
                $(tr).find("input[id^='tblAgentOtherChargeTab_AgentOtherchargeCurrency_']").data("kendoAutoComplete").enable(false);
            else
                $(tr).find("input[id^='tblAgentOtherChargeTab_AgentOtherchargeCurrency_']").attr("disabled", true);
        }
        $(tr).find("input[id^='tblAgentOtherChargeTab_ChargeValue_']").attr("disabled", true);

        //$(tr).find("button[id^='tblAgentOtherChargeTab_Delete_']").attr("disabled", true);
        //$(tr).find("button[id^='tblAgentOtherChargeTab_Delete_']").attr("style", "display:none;");

    });

    var dbTableName = 'TaxChargeInformationTab';
    var pageType = 'View';
    $('#tbl' + dbTableName).appendGrid({
        V2: true,
        tableID: 'tbl' + dbTableName,
        contentEditable: pageType != 'View',
        tableColumns: 'SNo,TaxCode,TaxValue',
        masterTableSNo: $('#hdnBookingMasterRefNo').val(),
        currentPage: 1, itemsPerPage: 50,
        model: { AWBSNo: currentawbsno == "" ? 0 : parseFloat(currentawbsno) },
        sort: '',
        servicePath: 'Services/Shipment/ReservationBookingService.svc',
        getRecordServiceMethod: 'Get' + dbTableName + 'Record',
        createUpdateServiceMethod: 'createUpdate' + dbTableName,
        deleteServiceMethod: 'delete' + dbTableName,
        caption: 'Tax Information',
        initRows: 1,
        isGetRecord: true,
        columns: [
			{ name: 'SNo', type: 'hidden', value: 0 },
			{ name: 'BookingSNo', type: 'hidden', value: $('#hdnBookingSNo').val() },
			{ name: 'BookingRefNo', type: 'hidden', value: $('#hdnBookingMasterRefNo').val() },
			{ name: 'TaxCode', display: 'Tax Code', type: 'text', value: '', ctrlAttr: { maxlength: 10 }, ctrlCss: { width: '90px' } },
			{ name: 'TaxName', display: 'Tax Name', type: 'text', value: '', ctrlAttr: { maxlength: 10 }, ctrlCss: { width: '90px' } },
			{ name: 'TaxType', display: 'Tax Type', type: 'text', value: '', ctrlAttr: { maxlength: 10 }, ctrlCss: { width: '90px' } },
			{ name: 'TaxApplicable', display: 'Tax Applicable', type: 'text', value: '', ctrlAttr: { maxlength: 10 }, ctrlCss: { width: '90px' } },
			{ name: 'TaxRate', display: 'Tax Rate', type: 'text', value: '', ctrlAttr: { maxlength: 10 }, ctrlCss: { width: '90px' } },
			//{ name: 'TotalTaxAmount', display: 'Total Tax Amount', type: 'text', value: '', ctrlAttr: { maxlength: 10 }, ctrlCss: { width: '90px' } },
			{ name: 'TaxCurrency', display: 'Tax Currency', type: 'text', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
			{ name: 'TaxAmount', display: 'Tax Amount', type: 'text', value: '', ctrlAttr: { maxlength: 10 }, ctrlCss: { width: '90px' } },
			{ name: 'ConvertedCurrencyCode', display: 'Rate Currency', type: 'text', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
			{ name: 'ConvertedChargeValue', display: 'Rate Charge', type: 'text', value: '', ctrlAttr: { maxlength: 10 }, ctrlCss: { width: '90px' } },

			{ name: 'ReferenceNumber', display: 'Reference Number', type: 'text', value: '', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '90px' } },
			{ name: 'CreatedBy', type: 'hidden', value: userContext.UserSNo },
			{ name: 'UpdatedBy', type: 'hidden', value: userContext.UserSNo }
        ],
        beforeRowRemove: function (caller, rowIndex) {
            //CheckDimensionTabRowdata(rowIndex);
        },
        isPaging: false,
        hideButtons: { updateAll: false, insert: true, removeLast: true },

    });

    if (AWBStatusDetails == "Executed" || AWBStatusDetails == "EXE" || AWBStatusDetails == "FOH" || AWBStatusDetails == "Booked" || AWBStatusDetails == "BKD") {
        if (HideActionButtonforLion == 1)
            $("#btnSaveRateData").css("display", "none");
    }
    else {
        if (userContext.SysSetting.ICMSEnvironment == 'JT' && AWBStatusNo == 16 && IsApproveCancelShipment == 'True') { }
        else
            $("#btnSaveRateData").css("display", "none");
    }
}
function SelectClicked(obj) {
    $(obj).closest("tr").find("input[type='checkbox']").attr("Checked", false);
    var messgae = "";
    var Flag = true;


    if (($(obj).attr("id") == "chkTactRate")) {
        $("#hdnRateShowOnAWBPrint").val('1');
    } else if (($(obj).attr("id") == "chkPubRate")) {
        $("#hdnRateShowOnAWBPrint").val('2');
    } else if (($(obj).attr("id") == "chkAsAgreed")) {
        $("#hdnRateShowOnAWBPrint").val('3');
    }
    $(obj).attr("Checked", true);
}

function CustomsTab() {
    if (userContext.SysSetting.ICMSEnvironment == 'JT') {
        $('#btnSaveHandlingInformation').hide();
    }
    else
        $('#btnSaveHandlingInformation').show();
    if (userContext.GroupName == "AGENT" && userContext.SysSetting.ICMSEnvironment == 'JT' && Viewflag == "0") {
        $('#btnSaveNotifyData').hide();
    }
    else
        $('#btnSaveNotifyData').show();
    if ($("#hdnHandlingInformation").val() != "") {
        var resultHandlingInformation = $("#hdnHandlingInformation").val();
        $("#HandlingInformation").val(resultHandlingInformation);
    }

    $("#HandlingInformation").unbind("blur").bind("blur", function () {
        var HandlingInformation = $("#HandlingInformation").val();
        $("#hdnHandlingInformation").val(HandlingInformation);
    });

    var dbTableName = 'CustomsOtherInformationTab';
    var pageType = 'View';
    if (userContext.SysSetting.ICMSEnvironment == 'JT' && AWBStatusNo == 16 && IsApproveCancelShipment == 'True')
        pageType = HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();
    else {
        if (AWBStatusNo == 16 && AWBStock == 'YES' && userContext.SysSetting.ICMSEnvironment == 'GA')
            pageType = (AWBStatusNo > 5 && AWBStatusNo != 15 && AWBStatusNo != 16) || HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();
        else
            pageType = (AWBStatusNo > 5 && AWBStatusNo != 15) || HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();       //No Show Work Commented
        //var pageType = (AWBStatusNo > 5 && AWBStatusNo != 15) || HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();       //No Show Work Commented
        //var pageType = AWBStatusNo > 5 ? 'View' : $('#hdnPageType').val();
    }
    $('#tbl' + dbTableName).appendGrid({
        V2: true,
        tableID: 'tbl' + dbTableName,
        contentEditable: pageType != 'View',
        tableColumns: 'SNo,OSI',
        masterTableSNo: $('#hdnBookingMasterRefNo').val(),
        currentPage: 1, itemsPerPage: 50,
        model: { AWBSNo: currentawbsno == "" ? 0 : parseFloat(currentawbsno) },
        sort: '',
        servicePath: 'Services/Shipment/ReservationBookingService.svc',
        getRecordServiceMethod: 'Get' + dbTableName + 'Record',
        createUpdateServiceMethod: 'createUpdate' + dbTableName,
        deleteServiceMethod: 'delete' + dbTableName,
        caption: 'Other Information',
        initRows: 1,
        isGetRecord: true,
        columns: [
			{ name: 'SNo', type: 'hidden', value: 0 },
			{ name: 'AWBSNo', type: 'hidden', value: currentawbsno },
			{ name: 'BookingSNo', type: 'hidden', value: $('#hdnBookingSNo').val() },
			{ name: 'BookingRefNo', type: 'hidden', value: $('#hdnBookingMasterRefNo').val() },
			{ name: 'OSI', display: 'OSI', type: 'text', value: '', ctrlAttr: { maxlength: 65, controltype: 'alphanumericupper' }, ctrlCss: { width: '500px' }, isRequired: true },
			{ name: 'CreatedBy', type: 'hidden', value: userContext.UserSNo },
			{ name: 'UpdatedBy', type: 'hidden', value: userContext.UserSNo }
        ],
        beforeRowRemove: function (caller, rowIndex) {
            //CheckDimensionTabRowdata(rowIndex);
        },
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            HideOCIAppend();
        },
        afterRowRemoved: function (caller, rowIndex) {
            HideOCIAppend();
        },
        isPaging: false,
        hideButtons: { updateAll: false, insert: true, removeLast: true },

    });
    var RowCount = 0;
    $("tr[id^='tblCustomsOtherInformationTab_Row']").each(function (row, tr) {
        RowCount = parseInt(RowCount) + parseInt(1);
    });
    if (RowCount >= 3) {
        $('#tblCustomsOtherInformationTab_btnAppendRow').attr("style", "display:none;");
    }
    HideOCIAppend();
    var dbTableName = 'CustomsOCIInformationTab';
    var pageType = 'View';
    if (userContext.SysSetting.ICMSEnvironment == 'JT' && AWBStatusNo == 16 && IsApproveCancelShipment == 'True')
        pageType = HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();
    else {
        if (AWBStatusNo == 16 && AWBStock == 'YES' && userContext.SysSetting.ICMSEnvironment == 'GA')
            pageType = (AWBStatusNo > 5 && AWBStatusNo != 15 && AWBStatusNo != 16) || HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();
        else
            pageType = (AWBStatusNo > 5 && AWBStatusNo != 15) || HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();       //No Show Work Commented
        //var pageType = (AWBStatusNo > 5 && AWBStatusNo != 15) || HideActionButtonforLion == 1 ? 'View' : $('#hdnPageType').val();       //No Show Work Commented
        //var pageType = AWBStatusNo > 5 ? 'View' : $('#hdnPageType').val();
    }
    $('#tbl' + dbTableName).appendGrid({
        V2: true,
        tableID: 'tbl' + dbTableName,
        contentEditable: pageType != 'View',
        tableColumns: 'SNo,Pieces,Length,Width,Height,VolumeWeight,CBM',
        masterTableSNo: $('#hdnBookingMasterRefNo').val(),
        currentPage: 1, itemsPerPage: 5,
        model: { AWBSNo: currentawbsno == "" ? 0 : parseFloat(currentawbsno) },
        sort: '',
        servicePath: 'Services/Shipment/ReservationBookingService.svc',
        getRecordServiceMethod: 'Get' + dbTableName + 'Record',
        createUpdateServiceMethod: 'createUpdate' + dbTableName,
        deleteServiceMethod: 'delete' + dbTableName,
        caption: 'Other Customs, Security & Regulatory Control Information',
        initRows: 1,
        isGetRecord: true,
        columns: [
			{ name: 'SNo', type: 'hidden', value: 0 },
			{ name: 'AWBSNo', type: 'hidden', value: currentawbsno },
			{ name: 'BookingSNo', type: 'hidden', value: $('#hdnBookingSNo').val() },
			{ name: 'BookingRefNo', type: 'hidden', value: $('#hdnBookingMasterRefNo').val() },

			{ name: 'CountryCode', display: 'Country Code', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, isRequired: true, AutoCompleteName: 'Reservation_AppendGrid_Country', filterField: 'CountryCode' },
			{ name: 'InfoType', display: 'Information Type', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, AutoCompleteName: 'Reservation_AppendGrid_InfoType', filterField: 'InformationCode' },
			{ name: 'CSControlInfoIdentifire', display: 'Customs, Security', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, AutoCompleteName: 'Reservation_AppendGrid_CSControlInfoIdentifire', filterField: 'CustomsCode' },
			{ name: 'SCSControlInfoIdentifire', display: 'Supplementary Customs', type: 'text', value: '', ctrlAttr: { maxlength: 35, controltype: 'alphanumericupper' }, ctrlCss: { width: '200px' }, isRequired: true },
			{ name: 'CreatedBy', type: 'hidden', value: userContext.UserSNo },
			{ name: 'UpdatedBy', type: 'hidden', value: userContext.UserSNo }
        ],
        beforeRowRemove: function (caller, rowIndex) {
            //CheckDimensionTabRowdata(rowIndex);
        },
        isPaging: false,
        hideButtons: { updateAll: false, insert: true, removeLast: true },
    });

    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/NotifyDetailsTab",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            BookingRefNo: $('#hdnBookingMasterRefNo').val(),
            AWBSNo: currentawbsno
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            var thedivtblNotifyDetails = document.getElementById("divtblNotify");
            thedivtblNotifyDetails.innerHTML = "";
            if (userContext.SysSetting.ICMSEnvironment != 'JT') {
                var table = "<table id='GroupBookingRemarkstabtable' validateonsubmit='true'>";
                table += "</br><table class='appendGrid ui-widget'><thead class='ui-widget-header'>";
                table += "<tr><td class='ui-widget-header' colspan='4'>Group Booking Remarks : </td></tr></thead><tbody class='ui-widget-content'>";
                table += "<tr><td class='ui-widget-content'>Remarks :</td><td> <div><label id='lblremarks'></label></div></td></tr>";
                table += "</tbody></table>";
                thedivtblNotifyDetails.innerHTML += table;
            }
            var table = "<table id='Notifytabtable' validateonsubmit='true'>";
            table += "</br><table class='appendGrid ui-widget'><thead class='ui-widget-header'>";
            table += "<tr><td class='ui-widget-header' colspan='4'>Notify Party Details : </td></tr></thead><tbody class='ui-widget-content'>";
            table += "<tr><td class='ui-widget-content'>Name 1 : <div><input type='text' class='' name='Notify_Name' id='Notify_Name' style='text-transform: uppercase;width: 150px;' controltype='default' maxlength='35' data-role='alphabettextbox' autocomplete='off'></div></td><td class='ui-widget-content'>Name 2 : <div><input type='text' class='' name='Notify_Name2' id='Notify_Name2' style='text-transform: uppercase;width: 150px;' controltype='default' maxlength='35' data-role='alphabettextbox' autocomplete='off'></div></td><td class='ui-widget-content'>Country : <div><input type='hidden' name='Notify_CountryCode' id='Notify_CountryCode' value=''><input type='text' class='' name='Text_Notify_CountryCode' id='Text_Notify_CountryCode' data-valid='required' data-valid-msg='Select Country' controltype='autocomplete' maxlength='10' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td><td class='ui-widget-content'>City : <div><input type='hidden' name='Notify_City' id='Notify_City' value=''><input type='text' class='' name='Text_Notify_City' id='Text_Notify_City' data-valid='required' data-valid-msg='Select City' controltype='autocomplete' maxlength='10' value='' placeholder='' data-role='autocomplete' autocomplete='off' style='text-transform: uppercase;'></div></td></tr>";
            table += "<tr><td class='ui-widget-content'>Contact Number : <div><input type='text' class='' name='Notify_MobileNo' style='width: 150px;' id='Notify_MobileNo' controltype='number' maxlength='25' value='' data-role='numerictextbox'></div></td><td class='ui-widget-content'>Telex : <div><input type='text' class='' name='Notify_MobileNo2' style='width: 150px;' id='Notify_MobileNo2' controltype='number' maxlength='25' value='' data-role='numerictextbox'></div></td><td class='ui-widget-content'>Address 1 : <div><input type='text' class='' name='Notify_Address' id='Notify_Address' style='text-transform: uppercase;width: 150px;' controltype='default' maxlength='35' data-role='alphabettextbox' autocomplete='off'></div></td><td class='ui-widget-content'>Address 2 : <div><input type='text' class='' name='Notify_Address2' id='Notify_Address2' style='text-transform: uppercase;width: 150px;' controltype='default' maxlength='35' data-role='alphabettextbox' autocomplete='off'></div></td></tr>";
            table += "<tr><td class='ui-widget-content'>State : <div><input type='text' class='' name='Notify_State' id='Notify_State' style='text-transform: uppercase;width: 150px;' controltype='default' maxlength='10' data-role='alphabettextbox' autocomplete='off'></div></td><td class='ui-widget-content'>Place : <div><input type='text' class='' name='Notify_Place' id='Notify_Place' style='text-transform: uppercase;width: 150px;' controltype='default' maxlength='20' data-role='alphabettextbox' autocomplete='off'></div></td><td class='ui-widget-content'>Postal Code :<div><input type='text' class='' name='Notify_PostalCode' id='Notify_PostalCode' style='text-transform: uppercase;width: 150px;' controltype='alphanumericupper' maxlength='10' data-role='alphabettextbox' autocomplete='off'></div></td><td class='ui-widget-content'>Fax :<div><input type='text' class='' name='Notify_Fax' id='Notify_Fax' style='text-transform: uppercase;width: 150px;' controltype='alphanumericupper' maxlength='10' data-role='alphabettextbox' autocomplete='off'></div></td></tr>";
            table += "</tbody></table>";
            table += "<table class='appendGrid ui-widget'><thead class='ui-widget-header'>";
            table += "<tr><td class='ui-widget-header' colspan='4'>Nominated Handling Party : </td></tr></thead><tbody class='ui-widget-content'>";
            table += "<tr><td class='ui-widget-content'>Name : <div><input type='text' class='' name='Nominate_Name' id='Nominate_Name' style='text-transform: uppercase;width: 150px;' controltype='default' maxlength='35' data-role='alphabettextbox' autocomplete='off'></div></td><td class='ui-widget-content'>Place : <div><input type='text' class='' name='Nominate_Place' id='Nominate_Place' style='text-transform: uppercase;width: 150px;' controltype='default' maxlength='20' data-role='alphabettextbox' autocomplete='off'></div></td></tr>";
            table += "</tbody></table>";
            thedivtblNotifyDetails.innerHTML += table;

            InstantiateControl("DivNotifyTab");


            cfi.AutoCompleteV2("Notify_CountryCode", "CountryCode,CountryName", "Reservation_Country", null, "contains");
            cfi.AutoCompleteV2("Notify_City", "CityCode,CityName", "Reservation_City", null, "contains");


            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                var notifyData = myData.Table0;
                var nominyData = myData.Table1;
                var gpbData = myData.Table2;

                if (notifyData.length > 0) {
                    $("#Notify_Name").val(notifyData[0].CustomerName);
                    $("#Notify_Name2").val(notifyData[0].CustomerName2);
                    if (notifyData[0].CountrySno > 0) {
                        $("#Text_Notify_CountryCode").data("kendoAutoComplete").setDefaultValue(notifyData[0].CountrySno, notifyData[0].CountryCode + '-' + notifyData[0].CountryName);
                    }
                    if (notifyData[0].CitySno > 0) {
                        $("#Text_Notify_City").data("kendoAutoComplete").setDefaultValue(notifyData[0].CitySno, notifyData[0].CityCode + '-' + notifyData[0].CityName);
                    }
                    $("#Notify_MobileNo").val(notifyData[0].Phone);
                    $("#_tempNotify_MobileNo").val(notifyData[0].Phone);
                    $("#Notify_MobileNo2").val(notifyData[0].Phone2);
                    $("#_tempNotify_MobileNo2").val(notifyData[0].Phone2);
                    $("#Notify_Address").val(notifyData[0].Street);
                    $("#Notify_Address2").val(notifyData[0].Street2);
                    $("#Notify_State").val(notifyData[0].State);
                    $("#Notify_Place").val(notifyData[0].Location);
                    $("#Notify_PostalCode").val(notifyData[0].PostalCode);
                    $("#Notify_Fax").val(notifyData[0].Fax);

                    if ($("#hdnHandlingInformation").val() != "") {
                        var resultHandlingInformation = $("#hdnHandlingInformation").val();
                        $("#HandlingInformation").val(resultHandlingInformation);
                    }
                    if (notifyData[0].HandlingInformation != "") {
                        $("#HandlingInformation").val(notifyData[0].HandlingInformation);
                        $("#hdnHandlingInformation").val(notifyData[0].HandlingInformation);
                    }
                }
                if (nominyData.length > 0) {
                    $('#Nominate_Name').val(nominyData[0].NOMName);
                    $('#Nominate_Place').val(nominyData[0].NOMPlace);
                }
                if (gpbData.length > 0 && userContext.SysSetting.ICMSEnvironment != 'JT') {
                    $('#lblremarks').text(gpbData[0].Remarks);
                }


            }
        },
        error: function (xhr) {
            var a = "";
        }
    });
}
function SaveNotifyData() {
    //if (currentawbsno > 0) {
    var NotifyModel = {
        NotifyName: $("#Notify_Name").val(),
        NotifyName2: $("#Notify_Name2").val(),
        NotifyCountryCode: $("#Text_Notify_CountryCode").data("kendoAutoComplete").key(),
        NotifyCityCode: $("#Text_Notify_City").data("kendoAutoComplete").key(),
        NotifyMobile: $("#Notify_MobileNo").val(),
        NotifyMobile2: $("#Notify_MobileNo2").val(),
        NotifyAddress: $("#Notify_Address").val(),
        NotifyAddress2: $("#Notify_Address2").val(),
        NotifyState: $("#Notify_State").val(),
        NotifyPlace: $("#Notify_Place").val(),
        NotifyPostalCode: $("#Notify_PostalCode").val(),
        NotifyFax: $("#Notify_Fax").val(),
    }
    var NominyModel = {
        NominyName: $("#Nominate_Name").val(),
        NominyAddress: $("#Nominate_Place").val(),
    }
    $.ajax({
        url: "Services/Shipment/ReservationBookingService.svc/SaveNotifyData", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: currentawbsno || 0, NotifyModel: NotifyModel, NominyModel: NominyModel, ReferenceNumber: $('#hdnBookingMasterRefNo').val(), AwbReferenceBookingSNo: $('#hdnBookingSNo').val() || "0", HandlingInformation: $('#HandlingInformation').val() }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result.split('?')[0] == "0") {
                ShowMessage('success', 'Success - Handling & Customs Information', "Processed Successfully", "bottom-right");
            }
            else if (result.split('?')[0] == "1") {
                ShowMessage('warning', 'Warning - Handling & Customs Information', result.split('?')[1], "bottom-right");
            }
            else {
                ShowMessage('warning', 'Warning - Handling & Customs Information', "unable to process.", "bottom-right");
            }
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Handling & Customs Information', "unable to process.", "bottom-right");
        }
    });
    //}
    //else
    //    ShowMessage('warning', 'Information!', "First Execute Shipment than Notify Process.");
}
function HideOCIAppend() {
    var RowCount = 0;
    $("tr[id^='tblCustomsOtherInformationTab_Row']").each(function (row, tr) {
        RowCount = parseInt(RowCount) + parseInt(1);
    });
    if (RowCount >= 3)
        $('#tblCustomsOtherInformationTab_btnAppendRow').attr("style", "display:none;");
    else
        $('#tblCustomsOtherInformationTab_btnAppendRow').attr("style", "display:block;");
}

function checkSHCSnoExist(groupSno, Sno) {
    var retval;
    for (var i = 0; i < groupSno.split(',').length; i++) {
        if (groupSno.split(',')[i] == Sno) {
            retval = 1;
            return retval;
        }
        else { retval = 0; }
    }
    return retval;
}
function BindSHCGroup(valueId, value, keyId, key) {
    var GroupName = value.split(',')[0];
    var GroupSNo = key;
    var shcVal = ($('#SPHCSNo').val());
    var shcText = ($('#Text_SPHCSNo').val());

    if (GroupName != '') {
        $.ajax({
            type: "POST",
            url: "./Services/Reservation/ViewUpdateDoorOpenService.svc/GetSHCGroupDetail?GroupName=" + GroupName + "&GroupSNo=" + GroupSNo,
            //data: { data: 1 },
            dataType: "json",
            success: function (data) {
                if (data != null && data != '') {
                    var ExistGroupVal = $('#divMultiSPHCSNo').find('ul')[0].innerHTML;
                    $('#Text_SPHCSNo')[0].defaultValue = '';
                    $('#Text_SPHCSNo')[0].Value = '';
                    $('#Text_SPHCSNo').val('');

                    var i = 0;

                    var strDivdata = '';

                    if (shcVal.split(',').length > 0) {
                        while (i < shcVal.split(',').length) {
                            if (shcVal.split(',')[i] != '')
                                if (shcText.split(',')[i] != GroupName && shcText.split(',')[i] != '') {
                                    strDivdata += ("<li class='k-button' style='margin-right: 3px; margin-bottom: 3px;'><span>" + shcText.split(',')[i] + "</span><span class='k-icon k-delete' id='" + shcVal.split(',')[i] + "'></span></li>");
                                }
                            i++;
                        }
                    }

                    for (var i = 0; i < data.length; i++) {
                        if (shcVal == GroupSNo) { shcVal = ''; }
                        //if (ExistGroupVal.indexOf(data[i].SNo) == -1) {
                        var checkexixtval = checkSHCSnoExist($('#Multi_SPHCSNo').val(), data[i].SNo);
                        if (checkexixtval == 0) {
                            shcVal += "," + data[i].SNo;
                            shcText += "," + data[i].Code;
                            strDivdata += ("<li class='k-button' style='margin-right: 3px; margin-bottom: 3px;'><span>" + data[i].Code + "</span><span class='k-icon k-delete' id='" + data[i].SNo + "'></span></li>");
                        }
                    }

                    //    if (shcVal != '') {
                    $('#divMultiSPHCSNo').find('ul').append(strDivdata);

                    if (ExistGroupVal.indexOf(GroupName) == -1) {
                        $('#Multi_SPHCSNo').val($('#Multi_SPHCSNo').val() + ',' + shcVal);
                        $('#FieldKeyValuesSPHCSNo')[0].innerHTML = $('#FieldKeyValuesSPHCSNo')[0].innerHTML + ',' + shcVal;
                        $('#SPHCSNo').val($('#SPHCSNo').val() + ',' + shcVal);


                    } else {
                        $('#Multi_SPHCSNo').val(removeLastComma($('#Multi_SPHCSNo').val()) + ',' + shcVal);
                        $('#FieldKeyValuesSPHCSNo')[0].innerHTML = removeLastComma($('#FieldKeyValuesSPHCSNo')[0].innerHTML) + ',' + shcVal;
                        $('#SPHCSNo').val(removeLastComma($('#SPHCSNo').val()) + ',' + shcVal);

                    }

                    // }
                    $("#divMultiSPHCSNo ul li:contains('" + GroupName + "')").remove();
                }
            }
            //ViewUpdateDoorOpen();
            //divThroughputRuleProperties.innerHTML = code;
            //}
        });

    }


}

function GetItineraryCarrierCode(e) {
    var AWBCode = "";
    if (e != "Text_AWBCode") {
        AWBCode = e;
    }
    else {
        AWBCode = $("#" + e).data("kendoAutoComplete").key() == "" ? 0 : $("#" + e).data("kendoAutoComplete").key()
    }
    if (AWBCode != "") {
        $.ajax({
            url: "Services/Report/NonExecutedBookingService.svc/GetItineraryCarrierCode",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                AWBCode: AWBCode
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        AWBFillCarrierCode = myData.Table0[0].CarrierCode;
                        PrefixAirlineName = myData.Table0[0].AirlineName;
                        IsCCAllowedAirline = myData.Table0[0].IsCCAllowed;
                        if (IsCCAllowedAirline == "False") {
                            if ($("#Text_ChargeCode").data("kendoAutoComplete").key() == 2) {
                                $("#Text_ChargeCode").data("kendoAutoComplete").setDefaultValue("1", "PP");
                                ShowMessage('warning', 'Information!', "Collect Shipment booking not allowed for " + PrefixAirlineName + ".");
                            }
                        }
                        if (userContext.SysSetting.ICMSEnvironment != 'JT')
                            $("#Text_ItineraryCarrierCode").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].CarrierCode, myData.Table0[0].CarrierCode);
                        IsItineraryCarrierCodeInterline();
                        if (myData.Table0[0].IsInterline == "True") {
                            $('input[name=AWBStock][value=0]').attr('checked', true);
                            $('input[name=AWBStock][value=0]').click();
                            $('#AWBNumber').removeAttr("disabled");
                            $('#_tempAWBNumber').removeAttr("disabled");
                            $('input[type=radio][name=AWBStock]').attr('disabled', true);
                            if (userContext.AgentSNo > 0) { }
                            else {
                                if (userContext.SysSetting.InterlineAgentName != "" && userContext.SysSetting.InterlineAgentName != undefined) {
                                    $("#Text_AWBAgent").data("kendoAutoComplete").setDefaultValue(userContext.SysSetting.InterlineAgentSNo, userContext.SysSetting.InterlineAgentName);
                                    $("#Text_AWBAgent").data("kendoAutoComplete").enable(false);
                                }
                            }
                        }
                        else {
                            if ($("#Text_AWBAgent").data("kendoAutoComplete").value() != "" && $("#Text_AWBAgent").prop('disabled') == true) {
                                if ($("#Text_AWBAgent").data("kendoAutoComplete").key() == userContext.SysSetting.InterlineAgentSNo) {
                                    $("#Text_AWBAgent").data("kendoAutoComplete").enable(true);
                                    $("#Text_AWBAgent").data("kendoAutoComplete").setDefaultValue("", "");

                                }
                            }
                            if (userContext.GroupName == "POS-OPS" || userContext.GroupName == "POS-KSO" || userContext.GroupName == "POS-CSC") {
                            }
                            else {
                                $('input[name=AWBStock][value=1]').attr('checked', true);
                                $('#AWBNumber').val('');
                                $('#_tempAWBNumber').val('');

                                $('#AWBNumber').attr('disabled', true);
                                $('input[type=radio][name=AWBStock]').attr('disabled', false);
                                AutoStockAgentOrNot();
                            }
                        }
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
}
function CheckFlightNoLength() {
    if ($("#ItineraryInterlineFlightNo").val() != "") {
        if ($("#ItineraryInterlineFlightNo").val().length < 4) {
            if ($("#ItineraryInterlineFlightNo").val().length == 1) {
                $("#ItineraryInterlineFlightNo").val('000' + $("#ItineraryInterlineFlightNo").val());
                //$("#_tempItineraryInterlineFlightNo").val('000' + $("#ItineraryInterlineFlightNo").val());
            }
            else if ($("#ItineraryInterlineFlightNo").val().length == 2) {
                $("#ItineraryInterlineFlightNo").val('00' + $("#ItineraryInterlineFlightNo").val());
                //$("#_tempItineraryInterlineFlightNo").val('00' + $("#ItineraryInterlineFlightNo").val());
            }
            else {
                $("#ItineraryInterlineFlightNo").val('0' + $("#ItineraryInterlineFlightNo").val());
                //$("#_tempItineraryInterlineFlightNo").val('0' + $("#ItineraryInterlineFlightNo").val());
            }
        }
    }
}
function IsItineraryCarrierCodeInterline() {
    if ($("#Text_ItineraryCarrierCode").data("kendoAutoComplete").key() != "") {
        $.ajax({
            url: "Services/Report/NonExecutedBookingService.svc/IsItineraryCarrierCodeInterline",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                ItineraryCarrierCode: $("#Text_ItineraryCarrierCode").data("kendoAutoComplete").key(),
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        if (myData.Table0[0].Result == "1") {
                            $("#tdItineraryFlightNo").css("display", "none");
                            $("#tdItineraryInterlineFlightNo").css("display", "block");
                            $("#Text_ItineraryFlightNo").data("kendoAutoComplete").setDefaultValue("", "");
                            $("#hdnIsItineraryCarrierCodeInterline").val("1");
                            var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
                            thedivFlightSearchResult.innerHTML = "";
                        }
                        else {
                            $("#tdItineraryFlightNo").css("display", "block");
                            $("#tdItineraryInterlineFlightNo").css("display", "none");
                            $("#ItineraryInterlineFlightNo").val('');
                            //$("#_tempItineraryInterlineFlightNo").val('');
                            $("#hdnIsItineraryCarrierCodeInterline").val("0");
                            var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
                            thedivFlightSearchResult.innerHTML = "";
                        }
                    }
                }
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
}
function BindULDAutoComplete(elem, mainElem) {
    var NewULDSPHCId = $(elem).find("div[id^='divMultiULDSPHCCode']").attr("id");
    $(elem).find("input[id^='ULDSPHCCode']").each(function () {
        if (!$("#Text_" + $(this).attr("name")).data("kendoAutoComplete")) {
            //cfi.AutoComplete($(this).attr("name"), "CODE", "SPHC", "SNO", "CODE", ["CODE"], SetRequired, "contains", ",", null, null, null, null, true, null, true);
            cfi.AutoCompleteV2($(this).attr("name"), "CODE", "Reservation_SPHC", SetRequired, "contains", ",", null, null, null, null, true, null, true);
        }
        $(this).css("width", "120px");

    });
    $(elem).find("input[id^='ContourCode']").each(function () {
        if (!$("#Text_" + $(this).attr("name")).data("kendoAutoComplete")) {
            //cfi.AutoComplete($(this).attr("name"), "ContourCode", "vw_GetSLIContourCodes", "SNO", "ContourCode", ["ContourCode"], GetContour, "contains", null, null, null, null, null, true, null, true);
            cfi.AutoCompleteV2($(this).attr("name"), "ContourCode", "Reservation_ContourCode", GetContour, "contains", null, null, null, null, null, true, null, true);
        }
        //$(this).css("width", "100px");

    });


    var getName = $(elem).find("div[id^='divMultiULDSPHCCode']").attr("name");

    //$("#" + NewULDSPHCId + " li").remove();
    $("div[name=" + getName + "][id=" + NewULDSPHCId + "]").remove();


    //$(elem).find("input[id^='ULDPackingTypeSNo']").each(function () {
    //    cfi.AutoComplete($(this).attr("name"), "PackingName", "IrregularityPacking", "SNo", "PackingName", ["PackingName"], null, "contains");
    //});

    $(elem).find("input[id^='Unit']").each(function () {
        //cfi.AutoComplete($(this).attr("name"), "UnitCode", "MeasurementUnitCode", "SNo", "UnitCode", ["UnitCode"], ResetLWH, "contains");
        cfi.AutoCompleteV2($(this).attr("name"), "UnitCode", "Reservation_Unit", ResetLWH, "contains");
        $(elem).find("input[id^='Text_ULDSPHCCode']").each(function () {
            $(this).css("width", "120px");
        });

        $(elem).find("input[id^='Text_Unit']").each(function () {
            $(this).val("CMT");
            $(this).css("width", "50px");
        });
        $(elem).find("input[id^='Unit']").each(function () {
            $(this).val("2");
        });
    });
    $(elem).find("td[id^=transAction]").find("i[title='Delete']").unbind("click").bind("click", function (e) {
        fn_RemoveULDRow(this);
    });
    //$(elem).find("input[id^='ULDNoSNo']").each(function () {
    //    cfi.AutoComplete($(this).attr("name"), "ULDNo", "v_AvailableULD", "SNo", "ULDNo", ["ULDNo"], null, "contains");
    //});
    $(elem).find("input[id^='ULDTypeSNo']").each(function () {
        //cfi.AutoComplete($(this).attr("name"), "ULDName", "V_ULD_Reservation", "SNo", "ULDName", ["ULDName"], CheckBULKULDType, "contains");
        cfi.AutoCompleteV2($(this).attr("name"), "ULDName", "Reservation_ULDTypeSNo", CheckBULKULDType, "contains");
        $(this).css("width", "60px");

    });
    $(elem).find("input[id^='SLINo']").each(function () {
        $(this).val(slino);
    });
    $(elem).find("span[id^='SLINo']").each(function () {
        $(this).text(slino);
    });

    //$(elem).find("input[id^=ULDNo]").unbind("keypress").bind("keypress", function () {
    //    ISNumeric(this); 
    //});

    $(elem).find("input[id^='ULDNo']").keydown(function (e) {
        IsNumericNewCheck(e);
    });

    $(elem).find("input[id^='SLACPieces']").keydown(function (e) {
        IsNumericNewCheck(e);
    });
    $(elem).find("input[id^='UldPieces']").keydown(function (e) {
        IsNumericNewCheck(e);
    });
    $(elem).find("input[id^=ULDLength]").keydown(function (e) {
        IsNumericNewCheck(e);
    });
    $(elem).find("input[id^=ULDWidth]").keydown(function (e) {
        IsNumericNewCheck(e);
    });
    $(elem).find("input[id^=ULDHeight]").keydown(function (e) {
        IsNumericNewCheck(e);
    });
    $(elem).prev().find("td:last div").append($(elem).prev().prev().find(".icon-trans-plus-sign").clone(true));
    $(elem).find("td[id^='tdSNoCol']").text(parseInt($(elem).prev().find("td[id^='tdSNoCol']").text()) + 1);
    $(elem).find("a[id^='ahref_ClassDetails']").unbind("click").bind("click", function () {
        GetULDDetails(this);
    });
    $(elem).find("a[id^='ahref_ULDGetWeight']").unbind("click").bind("click", function () {
        GetWeigingWeight(this);
    });
    $(elem).find("a[id^='ahref_Equipment']").unbind("click").bind("click", function () {
        Getequipment(this);
    });


    CalculateULDVolume();
    //fn_RemoveRequired();
}
function IsBUPCheckOrNot() {
    //var Pieces = ($("#AWBPieces").val() == "" ? "" : parseFloat($("#AWBPieces").val()));
    if ($("#chkIsBUP").prop('checked') == true) {
        $("#tdAWBNoofBUP").css("display", "block");
        $("#AWBNoofBUP").attr("data-valid", "min[1],required");
        //$("#AWBNoofBUP").val(Pieces);
        //$("#_tempAWBNoofBUP").val(Pieces);


        $("#AWBNoofBUP").val('');
        $("#_tempAWBNoofBUP").val('');
        $("#AWBNoofBUPIntact").val('');
        $("#_tempAWBNoofBUPIntact").val('');
        $("#AWBNoofBUP").attr('disabled', false);
        $("#_tempAWBNoofBUP").attr('disabled', false);
        $("#AWBNoofBUPIntact").attr('disabled', false);
        $("#_tempAWBNoofBUPIntact").attr('disabled', false);
    }
    else {
        $("#AWBNoofBUP").val('');
        $("#_tempAWBNoofBUP").val('');
        $("#AWBNoofBUP").removeAttr("data-valid");
        $("#_tempAWBNoofBUP").removeAttr("class");
        $("#_tempAWBNoofBUP").attr("class", "k-formatted-value k-input transSection k-state-default");
        $("#AWBNoofBUPIntact").val('');
        $("#_tempAWBNoofBUPIntact").val('');
        $("#tdAWBNoofBUP").css("display", "none");
        $("#AWBNoofBUPIntact").removeAttr("data-valid");
        $("#_tempAWBNoofBUPIntact").removeAttr("class");
        $("#_tempAWBNoofBUPIntact").attr("class", "k-formatted-value k-input transSection k-state-default");
    }
}
function CheckIsCCAllowed() {
    if (IsCCAllowedAirline == "False") {
        if ($("#Text_ChargeCode").data("kendoAutoComplete").key() == 2) {
            $("#Text_ChargeCode").data("kendoAutoComplete").setDefaultValue("1", "PP");
            ShowMessage('warning', 'Information!', "Collect Shipment booking not allowed for " + PrefixAirlineName + ".");
        }
    }
}

function ClearPriority() {
    if (userContext.SysSetting.PriorityBasedOnProduct == "True")
        $('#Text_Priority').val('');
    ClearItineraryRoute();
}

function SHCDetails(e) {
    if ($("#divMultiSHC").find("li[class='k-button']").not(":first").length >= 9) {
        e.preventDefault()
    }
    //else {
    //    GetDGRDetailsBySHC(($("#Multi_SHC").val() == "" ? "" : $("#Multi_SHC").val() + ",") + this.dataItem(e.item.index()).Key);
    //}
}
function HSCodeDetails(e) {
    if ($("#divMultiHSCode").find("li[class='k-button']").not(":first").length >= 9) {
        e.preventDefault()
    }
}


function FillCommoditySHC(e) {
    $("#divMultiSHC").find('span[class="k-icon k-delete"][style="display: none;"]').click() // remove pre selected shc
    $.ajax({
        url: "Services/Report/NonExecutedBookingService.svc/FillCommoditySHC",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            CommoditySNo: $("#" + e).data("kendoAutoComplete").key() == "" ? 0 : $("#" + e).data("kendoAutoComplete").key()

        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    if (myData.Table0[0].SPHCSNo != "") {
                        if (!$("#SHC").val().includes(myData.Table0[0].SPHCSNo)) {
                            var shc = myData.Table0[0].SPHCSNo.split(",");
                            for (var i in shc) {
                                $("span#" + shc[i]).click();
                            }
                            cfi.BindMultiValue("SHC", myData.Table0[0].Text_SPHCSNo, myData.Table0[0].SPHCSNo);
                            $("#SHC").val(myData.Table0[0].SPHCSNo);
                            $("div[id^='divMultiSHC']").css("overflow", "auto");
                            $("div[id^='divMultiSHC']").css("width", "15em");

                            for (var i in shc) {
                                $("span#" + shc[i]).hide();
                            }
                        }
                    }

                }
                if (myData.Table1.length > 0) {
                    if (myData.Table1[0].ChWt != 0) {
                        var valwt = $("#AWBVolumeWeight").val() || 0;
                        if (valwt == 0) {
                            if (parseFloat($("#AWBGrossWeight").val()) > (parseFloat(myData.Table1[0].ChWt))) {
                                $("#AWBGrossWeight").blur();
                                IsChargeableWt = 0;
                            }
                            else {
                                $("#_tempAWBChargeableWeight").val(myData.Table1[0].ChWt);
                                $("#AWBChargeableWeight").val(myData.Table1[0].ChWt);
                                IsChargeableWt = 1;
                                MinimumChWt = $("#AWBChargeableWeight").val();
                            }
                        }
                        else if (valwt != 0) {
                            if (parseFloat($("#AWBGrossWeight").val()) > (parseFloat((myData.Table1[0].ChWt))) || parseFloat($("#AWBVolumeWeight").val()) > parseFloat((myData.Table1[0].ChWt))) {
                                $("#AWBGrossWeight").blur();
                                IsChargeableWt = 0;
                            }
                            else {
                                $("#_tempAWBChargeableWeight").val(myData.Table1[0].ChWt);
                                $("#AWBChargeableWeight").val(myData.Table1[0].ChWt);
                                IsChargeableWt = 1;
                                MinimumChWt = $("#AWBChargeableWeight").val();
                            }
                        }
                        else {
                            $("#_tempAWBChargeableWeight").val(myData.Table1[0].ChWt);
                            $("#AWBChargeableWeight").val(myData.Table1[0].ChWt);
                            IsChargeableWt = 1;
                            MinimumChWt = $("#AWBChargeableWeight").val();
                        }
                    }
                    else {
                        $("#_tempAWBChargeableWeight").val('');
                        $("#AWBChargeableWeight").val('');
                        $("#AWBGrossWeight").blur();
                        IsChargeableWt = 0;
                        MinimumChWt = $("#AWBChargeableWeight").val();
                    }

                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
}
function AssignAWBNoForInterline() {
    var AWBPrefix = $("#Text_AWBCode").data("kendoAutoComplete").key();
    var AWBNumber = $("#AWBNumber").val();
    var SevenDigitofAWBNumber = AWBNumber.substring(0, 7);
    var LastDigitofAWBNumber = AWBNumber.substring(7, 8);
    var ModOfAWBNumber = (SevenDigitofAWBNumber % 7)
    var usersn0 = userContext.UserSNo;
    if (LastDigitofAWBNumber != ModOfAWBNumber) {
        $("#AWBNumber").val(SevenDigitofAWBNumber + ModOfAWBNumber)
        ShowMessage('warning', 'Information!', "Invalid AWB number. Valid AWB Number has been updated in respective field. Kindly validate & proceed.");
    }

}
function ValidateAndCheckValidAWBNumber(e) {
    var AWBStock = $('input:radio[name=AWBStock]:checked').val();
    var BookingType = $('input:radio[name=BookingType]:checked').val();
    if (AWBStock == 0 && $("#AWBNumber").val().trim().length == 8) {
        $.ajax({
            url: "Services/Report/NonExecutedBookingService.svc/CheckValidAWBNumber",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                BookingType: BookingType,
                AWBPrefix: $("#Text_AWBCode").data("kendoAutoComplete").key(),
                AWBNumber: $("#AWBNumber").val(),
                OriginCitySNo: $("#Text_AWBOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBOrigin").data("kendoAutoComplete").key(),
                AccountSNo: $("#Text_AWBAgent").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBAgent").data("kendoAutoComplete").key()
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        if (myData.Table0[0].SNo == 'Interline') {
                            if (myData.Table0[0].AWBNo != '') {
                                ShowMessage('warning', 'Information!', "AWB already Used, Please try other AWB.");
                                $("#AWBNumber").val('');
                                $("#_tempAWBNumber").val('');
                            }
                        }
                        else if (myData.Table0[0].SNo == 'Error') {
                            ShowMessage('warning', 'Information!', myData.Table0[0].ErrorMessage);
                            $("#AWBNumber").val('');
                            $("#_tempAWBNumber").val('');
                        }
                    }
                    else {
                        if (myData.Table1.length > 0) {
                            if (myData.Table1[0].SNo == 'Error') {
                                ShowMessage('warning', 'Information!', myData.Table1[0].ErrorMessage);
                                $("#AWBNumber").val('');
                                $("#_tempAWBNumber").val('');
                            }
                            else {
                                ShowMessage('warning', 'Information!', "Invalid AWB number. Please use an another AWB number to proceed.");
                                $("#AWBNumber").val('');
                                $("#_tempAWBNumber").val('');
                            }
                        }
                        else {
                            ShowMessage('warning', 'Information!', "Invalid AWB number. Please use an another AWB number to proceed.");
                            $("#AWBNumber").val('');
                            $("#_tempAWBNumber").val('');
                        }
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
}
function AutoStockAgentOrNot() {
    var AWBStock = $('input:radio[name=AWBStock]:checked').val();
    var BookingType = $('input:radio[name=BookingType]:checked').val();

    if (AWBStock == 1 && $("#Text_AWBAgent").data("kendoAutoComplete").value() != "") {
        $.ajax({
            url: "Services/Report/NonExecutedBookingService.svc/AutoStockAgentOrNot",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                BookingType: BookingType,
                AccountSNo: $("#Text_AWBAgent").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBAgent").data("kendoAutoComplete").key()
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);

                    if (myData.Table0.length > 0) {
                        if (myData.Table0[0].Result == '0') {
                            ShowMessage('warning', 'Information!', "Auto AWB Stock not available for agent, Please try Manual AWB Stock.");
                            if (userContext.AgentSNo > 0) {
                                $('input[name=AWBStock][value=0]').attr('checked', true);
                                $('input[name=AWBStock][value=0]').click();
                                $('#AWBNumber').removeAttr("disabled");
                                $('#_tempAWBNumber').removeAttr("disabled");
                            }
                            else
                                $("#Text_AWBAgent").data("kendoAutoComplete").setDefaultValue('', '');
                        }
                        else if (myData.Table0[0].Result == '1') {
                            $("#_tempAWBNumber").attr('disabled', true);
                            $('#AWBNumber').attr('disabled', true);
                        }
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
}
function ManualStockAgentOrNot() {
    var AWBStock = $('input:radio[name=AWBStock]:checked').val();
    var BookingType = $('input:radio[name=BookingType]:checked').val();

    if (AWBStock == 0 && $("#Text_AWBAgent").data("kendoAutoComplete").value() != "") {
        $.ajax({
            url: "Services/Report/NonExecutedBookingService.svc/ManualStockAgentOrNot",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                BookingType: BookingType,
                AccountSNo: $("#Text_AWBAgent").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBAgent").data("kendoAutoComplete").key()
				, AWBPrefix: $("#Text_AWBCode").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBCode").data("kendoAutoComplete").key()
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);

                    if (myData.Table0.length > 0) {
                        if (myData.Table0[0].Result == '0') {
                            ShowMessage('warning', 'Information!', "Manual AWB Stock not available for agent, Please try Auto AWB Stock.");
                            if (userContext.AgentSNo > 0) {
                                $('input[name=AWBStock][value=1]').attr('checked', true);
                                $('input[name=AWBStock][value=1]').click();
                            }
                            else
                                $("#Text_AWBAgent").data("kendoAutoComplete").setDefaultValue('', '');
                        }
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
}
function CheckValidAWBNumber(e) {
    if (e == "Text_AWBAgent") {
        GetProductAsPerAgent();
        ClearItineraryRoute();
    }
    if ($("#Text_Product").prop('disabled') == false && e == "Text_AWBAgent") {
        cfi.ResetAutoComplete("Product");
    }
    var AWBStock = $('input:radio[name=AWBStock]:checked').val();
    var BookingType = $('input:radio[name=BookingType]:checked').val();
    if (AWBStock == 1 && e == "Text_AWBAgent") {
        AutoStockAgentOrNot();
    }
    else if (AWBStock == 0 && e == "Text_AWBAgent") {
        ManualStockAgentOrNot();
    }
    //if (e == "Text_AWBAgent" && BookingType == 0) {
    //FillProductForAgent('POSTOFFICE');
    //}
    if (AWBStock == 0 && $("#AWBNumber").val().trim().length == 8) {
        $.ajax({
            url: "Services/Report/NonExecutedBBookingService.svc/CheckValidAWBNumber",
            async: true,
            type: "GET",
            dataType: "json",
            data: {
                BookingType: BookingType,
                AWBPrefix: $("#Text_AWBCode").data("kendoAutoComplete").key(),
                AWBNumber: $("#AWBNumber").val(),
                OriginCitySNo: $("#Text_AWBOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBOrigin").data("kendoAutoComplete").key(),
                AccountSNo: $("#Text_AWBAgent").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBAgent").data("kendoAutoComplete").key()
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        if (myData.Table0[0].SNo == 'Interline') {
                            if (myData.Table0[0].AWBNo == '') {
                                AssignAWBNoForInterline();
                                if (userContext.AgentSNo <= 0) {
                                    if ($("#Text_AWBAgent").data("kendoAutoComplete").value() != "" && $("#Text_AWBAgent").prop('disabled') == true) {
                                        if ($("#Text_AWBAgent").data("kendoAutoComplete").key() == userContext.SysSetting.InterlineAgentSNo) {
                                            $("#Text_AWBAgent").data("kendoAutoComplete").enable(false);
                                        }
                                        else
                                            $("#Text_AWBAgent").data("kendoAutoComplete").enable(true);
                                    }
                                    else
                                        $("#Text_AWBAgent").data("kendoAutoComplete").enable(true);
                                    $("#Text_AWBOrigin").data("kendoAutoComplete").enable(true);
                                }
                            }
                            else {
                                ShowMessage('warning', 'Information!', "AWB already Used, Please try other AWB.");
                                $("#AWBNumber").val('');
                                $("#_tempAWBNumber").val('');
                            }
                        }
                        else {
                            if (myData.Table1.length > 0 && myData.Table1[0].SNo == 'Error') {
                                ShowMessage('warning', 'Information!', myData.Table1[0].ErrorMessage);
                                $("#AWBNumber").val('');
                                $("#_tempAWBNumber").val('');
                            }
                            else {
                                $("#Text_AWBAgent").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].AccountSNo == "" ? "" : myData.Table0[0].AccountSNo, myData.Table0[0].AccountSNo == "" ? "" : myData.Table0[0].Name);
                                IsAsAgreedAgent = myData.Table0[0].AsAgreed == 'True' ? 1 : 0;
                                if (myData.Table0[0].AccountSNo > 0) {
                                    $("#Text_AWBAgent").data("kendoAutoComplete").enable(false);
                                    $("#Text_AWBOrigin").data("kendoAutoComplete").enable(false);
                                }
                            }
                        }
                    }
                    else {
                        if (myData.Table1.length > 0) {
                            if (myData.Table1[0].SNo == 'Error') {
                                ShowMessage('warning', 'Information!', myData.Table1[0].ErrorMessage);
                                $("#AWBNumber").val('');
                                $("#_tempAWBNumber").val('');
                            }
                            else {
                                ShowMessage('warning', 'Information!', "Invalid AWB number. Please use an another AWB number to proceed.");
                                $("#AWBNumber").val('');
                                $("#_tempAWBNumber").val('');
                                if (userContext.AgentSNo <= 0) {
                                    $("#Text_AWBAgent").data("kendoAutoComplete").enable(true);
                                    $("#Text_AWBOrigin").data("kendoAutoComplete").enable(true);
                                }
                            }
                        }
                        else {
                            ShowMessage('warning', 'Information!', "Invalid AWB number. Please use an another AWB number to proceed.");
                            $("#AWBNumber").val('');
                            $("#_tempAWBNumber").val('');
                            if (userContext.AgentSNo <= 0) {
                                $("#Text_AWBAgent").data("kendoAutoComplete").enable(true);
                                $("#Text_AWBOrigin").data("kendoAutoComplete").enable(true);
                            }
                        }
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
    else {
        if (e != "Text_AWBAgent") {
            if (userContext.AgentSNo > 0) {
                $("#Text_AWBOrigin").data("kendoAutoComplete").setDefaultValue(userContext.CitySNo, userContext.CityCode + '-' + userContext.CityName);
                $("#Text_AWBAgent").data("kendoAutoComplete").setDefaultValue(userContext.AgentSNo, userContext.AgentName);
                //$("#Text_AWBOrigin").data("kendoAutoComplete").enable(false)
                $("#Text_AWBAgent").data("kendoAutoComplete").enable(false)
            }
            else {
                $("#AWBNumber").val('');
                $("#_tempAWBNumber").val('');
                cfi.ResetAutoComplete("AWBAgent");
                $("#Text_AWBAgent").data("kendoAutoComplete").enable(true);
                $("#Text_AWBOrigin").data("kendoAutoComplete").enable(true);
            }
        }
    }
}
function CheckPiecesOnOD(e) {
    var IsmatchAWBOriginCity = false;
    var IsmatchAWBDestinationCity = false;
    var AWBPieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
    var AWBOriginCitySNo = $("#Text_AWBOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBOrigin").data("kendoAutoComplete").key();
    var AWBDestinationCitySNo = $("#Text_AWBDestination").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBDestination").data("kendoAutoComplete").key();
    var ItineraryPieces = ($("#ItineraryPieces").val() == "" ? 0 : parseFloat($("#ItineraryPieces").val()));
    var ItineraryOrigin = $("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0];
    var ItineraryDestination = $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0];
    var SelectedItineraryPieces = 0;

    var table = document.getElementById("tblSelectdRouteResult");
    if (table != null && table.rows.length > 1) {
        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
            if (ItineraryOrigin != "" && ItineraryDestination != "") {
                if (ItineraryOrigin == $(tr).find("td")[2].innerText.split("/")[0].trim() && ItineraryDestination == $(tr).find("td")[2].innerText.split("/")[1].trim())
                    SelectedItineraryPieces = parseInt(SelectedItineraryPieces) + parseInt($(tr).find("td")[3].innerText.trim());
                if (AWBOriginCitySNo == $(tr).find("input[id^='hdnOriginCitySNo_']").val() && SelectedItineraryPieces == AWBPieces) {
                    IsmatchAWBOriginCity = true;
                }
                if (AWBDestinationCitySNo == $(tr).find("input[id^='hdnDestinationCitySNo_']").val() && SelectedItineraryPieces == AWBPieces) {
                    IsmatchAWBDestinationCity = true;
                }
            }
        });
    }
    var CheckAndValidateDataArray = [];
    $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
        var CheckAndValidateDataArrayItems = {
            Origin: $(tr).find("td")[2].innerText.split("/")[0].trim(),
            Destination: $(tr).find("td")[2].innerText.split("/")[1].trim(),
            Pieces: $(tr).find("td")[3].innerText.trim(),
            GrossWeight: $(tr).find("td")[4].innerText.trim(),
            VolumeWeight: $(tr).find("td")[5].innerText.trim(),
            AWBOriginCitySNo: $(tr).find("input[id^='hdnOriginCitySNo_']").val(),
            AWBDestinationCitySNo: $(tr).find("input[id^='hdnDestinationCitySNo_']").val()
        };
        CheckAndValidateDataArray.push(CheckAndValidateDataArrayItems);
    });

    if (CheckAndValidateDataArray.length > 0) {
        for (var i = 0; i < CheckAndValidateDataArray.length; i++) {
            var ItemAWBPiecesOrigin = 0;
            var ItemAWBGrossWeightOrigin = 0;
            var ItemVolumeWeightOrigin = 0;
            var ItemAWBPiecesDestination = 0;
            var ItemAWBGrossWeightDestination = 0;
            var ItemVolumeWeightDestination = 0;
            $.map(CheckAndValidateDataArray, function (item) {
                if (item.Origin == CheckAndValidateDataArray[i].Origin) {
                    ItemAWBPiecesOrigin = parseInt(ItemAWBPiecesOrigin) + parseInt(item.Pieces);
                    ItemAWBGrossWeightOrigin = parseFloat(ItemAWBGrossWeightOrigin) + parseFloat(item.GrossWeight);
                    ItemVolumeWeightOrigin = parseFloat(ItemVolumeWeightOrigin) + parseFloat(item.VolumeWeight);
                }
                if (item.Destination == CheckAndValidateDataArray[i].Destination) {
                    ItemAWBPiecesDestination = parseInt(ItemAWBPiecesDestination) + parseInt(item.Pieces);
                    ItemAWBGrossWeightDestination = parseFloat(ItemAWBGrossWeightDestination) + parseFloat(item.GrossWeight);
                    ItemVolumeWeightDestination = parseFloat(ItemVolumeWeightDestination) + parseFloat(item.VolumeWeight);
                }
            });
            if (AWBOriginCitySNo == CheckAndValidateDataArray[i].AWBOriginCitySNo && ItemAWBPiecesOrigin == AWBPieces)
                IsmatchAWBOriginCity = true;
            if (AWBDestinationCitySNo == CheckAndValidateDataArray[i].AWBDestinationCitySNo && ItemAWBPiecesDestination == AWBPieces)
                IsmatchAWBDestinationCity = true;

        }
    }
    if (IsmatchAWBOriginCity = true && IsmatchAWBDestinationCity == true) {
        ShowMessage('warning', 'Information!', "Route Completed.");
        $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue('', '');
        $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue('', '');
        return false;
    }
    if (IsmatchAWBOriginCity = false) {
        if (e == "Text_ItineraryOrigin") {
        }
    }
    ItineraryPieces = parseInt(ItineraryPieces) + parseInt(SelectedItineraryPieces);
    if (AWBPieces == 0 && ItineraryPieces > 0) {
        $("#ItineraryPieces").val('');
        $("#_tempItineraryPieces").val('');
        ShowMessage('warning', 'Information!', "First Enter AWB Pieces.");
        return false;
    }
    else if (ItineraryPieces > AWBPieces) {
        $("#ItineraryPieces").val('');
        $("#_tempItineraryPieces").val('');
        if (e == "Text_ItineraryOrigin") {
            $("#ItineraryOrigin").val('');
            $("#Text_ItineraryOrigin").val('');
        }
        else {
            $("#ItineraryDestination").val('');
            $("#Text_ItineraryDestination").val('');
        }
        ShowMessage('warning', 'Information!', "Itinerary Pieces less than AWB Pieces.");
        return false;
    }
    if (e == "Text_ItineraryDestination" && userContext.SysSetting.ICMSEnvironment == 'JT') {
        cfi.ResetAutoComplete("ItineraryFlightNo");
    }
}
function SelectedAWBOriginDestination(e) {
    if (e == "Text_AWBOrigin") {
        cfi.ResetAutoComplete('SHIPPER_CountryCode');
        cfi.ResetAutoComplete('SHIPPER_City');
        cfi.ResetAutoComplete('ItineraryOrigin');
    }
    if (e == "Text_AWBDestination") {
        cfi.ResetAutoComplete('CONSIGNEE_CountryCode');
        cfi.ResetAutoComplete('CONSIGNEE_City');
        cfi.ResetAutoComplete('ItineraryDestination');

        if (userContext.SysSetting.ICMSEnvironment == 'JT' && userContext.UserTypeName.toUpperCase() == "AGENT") {
            if ($("#Text_AWBDestination").data("kendoAutoComplete").key() != "")
                SplitShipmentAllowed();
        }
    }
    if (e == "Copy")
        e = "Text_AWBDestination";
    $.ajax({
        url: "Services/Report/NonExecutedBookingService.svc/GetAirportofSelectedAWBOriginDestination",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            CitySNo: $("#" + e).data("kendoAutoComplete").key() == "" ? 0 : $("#" + e).data("kendoAutoComplete").key()
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    if (e == "Text_AWBOrigin") {
                        $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].SNo == "" ? "" : myData.Table0[0].SNo, myData.Table0[0].SNo == "" ? "" : myData.Table0[0].AirportCode + '-' + myData.Table0[0].AirportName);
                        DimensionMandatoryOrNotInEcecutionAtCity = myData.Table0[0].IsDimensioMandatoryAtCity == 'False' ? 0 : 1;
                        if (userContext.AgentSNo > 0) { }
                        else {
                            if ($("#Text_AWBAgent").data("kendoAutoComplete").key() != userContext.SysSetting.InterlineAgentSNo) {
                                $("#Text_AWBAgent").data("kendoAutoComplete").setDefaultValue("", "");
                            }
                        }
                    }
                    else {
                        $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].SNo == "" ? "" : myData.Table0[0].SNo, myData.Table0[0].SNo == "" ? "" : myData.Table0[0].AirportCode + '-' + myData.Table0[0].AirportName);
                        if (myData.Table0[0].IsHouse == "True") {
                            $("#NoofHouse").attr("data-valid", "min[1],required");
                        }
                        else
                            $("#NoofHouse").removeAttr("data-valid", "");
                    }
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });

}
function GetShipperConsigneeDetails(e) {

    var UserTyp = (e == "Text_SHIPPER_AccountNo" || e == "Text_SHIPPER_Name") ? "S" : "C";
    var FieldType = (e == "Text_SHIPPER_Name" || e == "Text_CONSIGNEE_AccountNoName") ? "NAME" : "AC";

    if ($("#" + e).data("kendoAutoComplete").key() != "") {
        if (UserTyp == "S") {
            $("#chkShipper").prop('checked', false);
            $("#chkShipper").attr('disabled', true);
            $("#chkShipper").removeAttr("title");
        }
        if (UserTyp == "C") {
            $("#chkconsignee").prop('checked', false);
            $("#chkconsignee").attr('disabled', true);
            $("#chkconsignee").removeAttr("title");
        }

        $.ajax({
            url: "Services/Report/NonExecutedBookingService.svc/GetShipperConsigneeDetails?UserType=" + UserTyp + "&FieldType=" + FieldType + "&SNO=" + $("#" + e).data("kendoAutoComplete").key(), async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var shipperConsigneeData = Data.Table0;

                if (shipperConsigneeData.length > 0) {
                    if (UserTyp == "S") {
                        $("#SHIPPER_Name").val(shipperConsigneeData[0].ShipperName);
                        $("#SHIPPER_Name2").val(shipperConsigneeData[0].Name2);
                        $("#SHIPPER_Street").val(shipperConsigneeData[0].ShipperStreet);
                        $("#SHIPPER_Street2").val(shipperConsigneeData[0].Address2);
                        $("#SHIPPER_TownLocation").val(shipperConsigneeData[0].ShipperLocation);
                        $("#SHIPPER_State").val(shipperConsigneeData[0].ShipperState);
                        $("#SHIPPER_PostalCode").val(shipperConsigneeData[0].ShipperPostalCode);
                        $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ShipperCountryCode == "" ? "" : shipperConsigneeData[0].ShipperCountryCode, shipperConsigneeData[0].ShipperCountryCode == "" ? "" : shipperConsigneeData[0].CountryCode + '-' + shipperConsigneeData[0].ShipperCountryName);
                        $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ShipperCity == "" ? "" : shipperConsigneeData[0].ShipperCity, shipperConsigneeData[0].ShipperCity == "" ? "" : shipperConsigneeData[0].CityCode + '-' + shipperConsigneeData[0].ShipperCityName);
                        $("#SHIPPER_MobileNo").val(shipperConsigneeData[0].ShipperMobile);
                        $("#_tempSHIPPER_MobileNo").val(shipperConsigneeData[0].ShipperMobile);
                        $("#SHIPPER_MobileNo2").val(shipperConsigneeData[0].Telex);
                        $("#SHIPPER_Email").val(shipperConsigneeData[0].ShipperEMail);
                        $("#SHipper_Fax").val(shipperConsigneeData[0].Fax);
                        $("#_tempSHipper_Fax").val(shipperConsigneeData[0].Fax);
                    }
                    else if (UserTyp == "C") {
                        $("#CONSIGNEE_AccountNoName").val(shipperConsigneeData[0].ConsigneeName);
                        $("#CONSIGNEE_AccountNoName2").val(shipperConsigneeData[0].Name2);
                        $("#CONSIGNEE_Street").val(shipperConsigneeData[0].ConsigneeStreet);
                        $("#CONSIGNEE_Street2").val(shipperConsigneeData[0].Address2);
                        $("#CONSIGNEE_TownLocation").val(shipperConsigneeData[0].ConsigneeLocation);
                        $("#CONSIGNEE_State").val(shipperConsigneeData[0].ConsigneeState);
                        $("#CONSIGNEE_PostalCode").val(shipperConsigneeData[0].ConsigneePostalCode);
                        $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ConsigneeCity == "" ? "" : shipperConsigneeData[0].ConsigneeCity, shipperConsigneeData[0].ConsigneeCity == "" ? "" : shipperConsigneeData[0].CityCode + '-' + shipperConsigneeData[0].ConsigneeCityName);
                        $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ConsigneeCountryCode == "" ? "" : shipperConsigneeData[0].ConsigneeCountryCode, shipperConsigneeData[0].ConsigneeCountryCode == "" ? "" : shipperConsigneeData[0].CountryCode + '-' + shipperConsigneeData[0].ConsigneeCountryName);
                        $("#CONSIGNEE_MobileNo").val(shipperConsigneeData[0].ConsigneeMobile);
                        $("#_tempCONSIGNEE_MobileNo").val(shipperConsigneeData[0].ConsigneeMobile);
                        $("#CONSIGNEE_MobileNo2").val(shipperConsigneeData[0].Telex);
                        $("#CONSIGNEE_Email").val(shipperConsigneeData[0].ConsigneeEMail);
                        $("#CONSIGNEE_Fax").val(shipperConsigneeData[0].Fax);
                        $("#_tempCONSIGNEE_Fax").val(shipperConsigneeData[0].Fax);
                    }

                }
                else {
                    if (UserTyp == "S") {
                        $("#SHIPPER_Name").val('');
                        $("#SHIPPER_Name2").val('');
                        $("#SHIPPER_Street").val('');
                        $("#SHIPPER_Street2").val('');
                        $("#SHIPPER_TownLocation").val('');
                        $("#SHIPPER_State").val('');
                        $("#SHIPPER_PostalCode").val('');
                        $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#SHIPPER_MobileNo").val('');
                        $("#_tempSHIPPER_MobileNo").val('');
                        $("#SHIPPER_MobileNo2").val('');
                        $("#SHIPPER_Email").val('');
                        $("#SHipper_Fax").val('');
                        $("#_tempSHipper_Fax").val('');
                    }
                    else if (UserTyp == "C") {
                        $("#CONSIGNEE_AccountNoName").val('');
                        $("#CONSIGNEE_AccountNoName2").val('');
                        $("#CONSIGNEE_Street").val('');
                        $("#CONSIGNEE_Street2").val('');
                        $("#CONSIGNEE_TownLocation").val('');
                        $("#CONSIGNEE_State").val('');
                        $("#CONSIGNEE_PostalCode").val('');
                        $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#CONSIGNEE_MobileNo").val('');
                        $("#_tempCONSIGNEE_MobileNo").val('');
                        $("#CONSIGNEE_MobileNo2").val('');
                        $("#CONSIGNEE_Email").val('');
                        $("#CONSIGNEE_Fax").val('');
                        $("#_tempCONSIGNEE_Fax").val('');
                    }
                }

            },
            error: {

            }
        });
    } else {
        if (UserTyp == "S") {
            $("#chkShipper").removeAttr('disabled');
            $("#chkShipper").attr("title", "Select to add in Participant as Shipper");

            $("#SHIPPER_Name").val('');
            $("#SHIPPER_Name2").val('');
            $("#SHIPPER_Street").val('');
            $("#SHIPPER_Street2").val('');
            $("#SHIPPER_TownLocation").val('');
            $("#SHIPPER_State").val('');
            $("#SHIPPER_PostalCode").val('');
            $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue("", "");
            $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue("", "");
            $("#SHIPPER_MobileNo").val('');
            $("#_tempSHIPPER_MobileNo").val('');
            $("#SHIPPER_MobileNo2").val('');
            $("#SHIPPER_Email").val('');
            $("#SHipper_Fax").val('');
            $("#_tempSHipper_Fax").val('');
        } else if (UserTyp == "C") {
            $("#chkconsignee").removeAttr('disabled');
            $("#chkconsignee").attr("title", "Select to add in Participant as Consignee");

            $("#CONSIGNEE_AccountNoName").val('');
            $("#CONSIGNEE_AccountNoName2").val('');
            $("#CONSIGNEE_Street").val('');
            $("#CONSIGNEE_Street2").val('');
            $("#CONSIGNEE_TownLocation").val('');
            $("#CONSIGNEE_State").val('');
            $("#CONSIGNEE_PostalCode").val('');
            $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue("", "");
            $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue("", "");
            $("#CONSIGNEE_MobileNo").val('');
            $("#_tempCONSIGNEE_MobileNo").val('');
            $("#CONSIGNEE_MobileNo2").val('');
            $("#CONSIGNEE_Email").val('');
            $("#CONSIGNEE_Fax").val('');
            $("#_tempCONSIGNEE_Fax").val('');
        }
    }

}
function SelectedAWBOriginDestinationItineary(e) {
    if (e == "Text_AWBOrigin") {
        cfi.ResetAutoComplete('ItineraryOrigin');
    }
    if (e == "Text_AWBDestination") {
        cfi.ResetAutoComplete('ItineraryDestination');
    }
    $.ajax({
        url: "Services/Report/NonExecutedBookingService.svc/GetAirportofSelectedAWBOriginDestination",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            CitySNo: $("#" + e).data("kendoAutoComplete").key() == "" ? 0 : $("#" + e).data("kendoAutoComplete").key()
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    if (e == "Text_AWBOrigin") {
                        $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].SNo == "" ? "" : myData.Table0[0].SNo, myData.Table0[0].SNo == "" ? "" : myData.Table0[0].AirportCode + '-' + myData.Table0[0].AirportName);
                    }
                    else {
                        $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].SNo == "" ? "" : myData.Table0[0].SNo, myData.Table0[0].SNo == "" ? "" : myData.Table0[0].AirportCode + '-' + myData.Table0[0].AirportName);
                    }
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
}
function FillProductForAgent(Type) {
    $.ajax({
        url: "Services/Report/NonExecutedBookingService.svc/FillProductForAgent",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            AccountSNo: $("#Text_AWBAgent").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBAgent").data("kendoAutoComplete").key()
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    $("#Text_Product").data("kendoAutoComplete").setDefaultValue(myData.Table0[0].SNo, myData.Table0[0].ProductName);
                    $("#Text_Product").data("kendoAutoComplete").enable(false);
                }
                else {
                    $("#Text_Product").data("kendoAutoComplete").enable(true);
                    if (Type == '') {
                        GETProductASPerBookingType('0', userContext.GroupName);
                    }
                }
            }
            else {
                if (userContext.GroupName == "POS-OPS" || userContext.GroupName == "POS-KSO" || userContext.GroupName == "POS-CSC") {
                }
                else {
                    $("#Text_Product").data("kendoAutoComplete").enable(true);
                }
                if (Type == '') {
                    GETProductASPerBookingType('0', userContext.GroupName);
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
}

function NoofHousePieces() {
    var NoofHouse = ($("#NoofHouse").val() == "" ? 0 : parseFloat($("#NoofHouse").val()));
    var Pieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
    if (Pieces > 0) {
        if (NoofHouse > 0) {
            if (NoofHouse > Pieces) {
                $("#NoofHouse").val('');
                $("#_tempNoofHouse").val('');
                ShowMessage('warning', 'Information!', "AWB Pieces cannot be less than count of HAWB.");

            }
        }
    }
}
function CalculatedBUPPieces(id) {
    var Pieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
    if (id == 'AWBNoofBUP') {
        var BUPPieces = ($("#AWBNoofBUP").val() == "" ? 0 : parseFloat($("#AWBNoofBUP").val()));
        if (Pieces > 0) {
            if ($("#chkIsBUP").prop('checked') == true) {
                if (BUPPieces > Pieces) {
                    $("#AWBNoofBUP").val('');
                    $("#_tempAWBNoofBUP").val('');
                    $("#AWBNoofBUPIntact").val('');
                    $("#_tempAWBNoofBUPIntact").val('');
                    $("#AWBNoofBUPIntact").attr('disabled', false);
                    $("#_tempAWBNoofBUPIntact").attr('disabled', false);
                    ShowMessage('warning', 'Information!', "BUP Pieces less than AWB Pieces.");
                }
                else if (BUPPieces > 0) {
                    $("#AWBNoofBUPIntact").val('');
                    $("#_tempAWBNoofBUPIntact").val('');
                    $("#AWBNoofBUPIntact").attr('disabled', true);
                    $("#_tempAWBNoofBUPIntact").attr('disabled', true);
                }
                else {
                    $("#AWBNoofBUPIntact").val('');
                    $("#_tempAWBNoofBUPIntact").val('');
                    $("#AWBNoofBUPIntact").attr('disabled', false);
                    $("#_tempAWBNoofBUPIntact").attr('disabled', false);
                }
            }
        }
        else if (BUPPieces > 0) {
            $("#AWBNoofBUPIntact").val('');
            $("#_tempAWBNoofBUPIntact").val('');
            $("#AWBNoofBUPIntact").attr('disabled', true);
            $("#_tempAWBNoofBUPIntact").attr('disabled', true);
        }
        else {
            $("#AWBNoofBUPIntact").val('');
            $("#_tempAWBNoofBUPIntact").val('');
            $("#AWBNoofBUPIntact").attr('disabled', false);
            $("#_tempAWBNoofBUPIntact").attr('disabled', false);
        }
    }
    else if (id == 'AWBNoofBUPIntact') {
        var AWBNoofBUPIntact = ($("#AWBNoofBUPIntact").val() == "" ? 0 : parseFloat($("#AWBNoofBUPIntact").val()));
        if (Pieces > 0) {
            if ($("#chkIsBUP").prop('checked') == true) {
                if (AWBNoofBUPIntact > Pieces) {
                    $("#AWBNoofBUPIntact").val('');
                    $("#_tempAWBNoofBUPIntact").val('');
                    $("#AWBNoofBUP").val('');
                    $("#_tempAWBNoofBUP").val('');
                    $("#AWBNoofBUP").attr('disabled', false);
                    $("#_tempAWBNoofBUP").attr('disabled', false);
                    ShowMessage('warning', 'Information!', "BUP Pieces less than AWB Pieces.");
                }
                else if (AWBNoofBUPIntact > 0) {
                    $("#AWBNoofBUP").val('');
                    $("#_tempAWBNoofBUP").val('');
                    $("#AWBNoofBUP").attr('disabled', true);
                    $("#_tempAWBNoofBUP").attr('disabled', true);
                }
                else {
                    $("#AWBNoofBUP").val('');
                    $("#_tempAWBNoofBUP").val('');
                    $("#AWBNoofBUP").attr('disabled', false);
                    $("#_tempAWBNoofBUP").attr('disabled', false);
                }
            }
        }
        else if (AWBNoofBUPIntact > 0) {
            $("#AWBNoofBUP").val('');
            $("#_tempAWBNoofBUP").val('');
            $("#AWBNoofBUP").attr('disabled', true);
            $("#_tempAWBNoofBUP").attr('disabled', true);
        }
        else {
            $("#AWBNoofBUP").val('');
            $("#_tempAWBNoofBUP").val('');
            $("#AWBNoofBUP").attr('disabled', false);
            $("#_tempAWBNoofBUP").attr('disabled', false);
        }
    }
}
function CalculatedPieces() {
    var NoofHouse = ($("#NoofHouse").val() == "" ? 0 : parseFloat($("#NoofHouse").val()));
    var Pieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
    var BUPPieces = ($("#AWBNoofBUP").val() == "" ? 0 : parseFloat($("#AWBNoofBUP").val()));
    var AWBNoofBUPIntact = ($("#AWBNoofBUPIntact").val() == "" ? 0 : parseFloat($("#AWBNoofBUPIntact").val()));
    if (Pieces > 0) {
        if (NoofHouse > 0) {
            if (NoofHouse > Pieces) {
                $("#AWBPieces").val('');
                $("#_tempAWBPieces").val('');
                ShowMessage('warning', 'Information!', "AWB Pieces cannot be less than count of HAWB.");
                return false;
            }
        }
    }
    if ($("#chkIsBUP").prop('checked') == true) {
        if (Pieces > 0) {
            if (BUPPieces > 0) {
                if (BUPPieces > Pieces) {
                    $("#AWBPieces").val('');
                    $("#_tempAWBPieces").val('');
                    $("#ItineraryPieces").val('');
                    $("#_tempItineraryPieces").val('');
                    ShowMessage('warning', 'Information!', "AWB Pieces not less than BUP Pieces.");
                }
                else {
                    var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
                    thedivFlightSearchResult.innerHTML = "";
                    $("#ItineraryPieces").val(Pieces);
                    $("#_tempItineraryPieces").val(Pieces);
                }
            }
            else if (AWBNoofBUPIntact > 0) {
                if (AWBNoofBUPIntact > Pieces) {
                    $("#AWBPieces").val('');
                    $("#_tempAWBPieces").val('');
                    $("#ItineraryPieces").val('');
                    $("#_tempItineraryPieces").val('');
                    ShowMessage('warning', 'Information!', "AWB Pieces not less than BUP Pieces.");
                }
                else {
                    var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
                    thedivFlightSearchResult.innerHTML = "";
                    $("#ItineraryPieces").val(Pieces);
                    $("#_tempItineraryPieces").val(Pieces);
                }
            }
            //$("#AWBNoofBUP").val(Pieces);
            //$("#_tempAWBNoofBUP").val(Pieces);
            //$("#ItineraryPieces").val(Pieces);
            //$("#_tempItineraryPieces").val(Pieces);
        }
    }
    else {
        if (Pieces > 0) {
            $("#ItineraryPieces").val(Pieces);
            $("#_tempItineraryPieces").val(Pieces);
            var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
            thedivFlightSearchResult.innerHTML = "";
        }
    }

    if (Pieces > 0) {
        var grosswt = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));   //Per Piece SHC Work Commented
        var PerPicesgrossWt = 0;
        var PerPiecesCheckWeightforSHC = 0;
        var AWBPrefix = $("#AWBCode").val();
        if (AWBPrefix == '126') {
            if (userContext.SysSetting.GAPerPiecesCheckWeightforSHC != "" && userContext.SysSetting.GAPerPiecesCheckWeightforSHC != undefined)
                PerPiecesCheckWeightforSHC = userContext.SysSetting.GAPerPiecesCheckWeightforSHC;
        }
        else if (AWBPrefix == '888') {
            if (userContext.SysSetting.QGPerPiecesCheckWeightforSHC != "" && userContext.SysSetting.QGPerPiecesCheckWeightforSHC != undefined)
                PerPiecesCheckWeightforSHC = userContext.SysSetting.QGPerPiecesCheckWeightforSHC;
        }
        PerPicesgrossWt = grosswt / Pieces;
        if (parseFloat(PerPicesgrossWt) >= parseFloat(PerPiecesCheckWeightforSHC) && parseFloat(PerPiecesCheckWeightforSHC) > 0)
            SHCForPerPiecesGrossWt('');
        else
            SHCForPerPiecesGrossWt('1');

    }
}
function SHCForPerPiecesGrossWt(HEASPHC) {
    var SPHC = $("#Text_SHC").data("kendoAutoComplete").key() || 0;
    if (HEASPHC == '1') {
        if (SPHC != '' && SPHC != 0) {
            $.ajax({
                url: "Services/Report/NonExecutedBookingService.svc/GetSHCForPerPiecesGrossWt",
                async: false,
                type: "GET",
                dataType: "json",
                data: {
                    SPHC: SPHC,
                    HEASPHC: HEASPHC
                },
                contentType: "application/json; charset=utf-8", cache: false,
                success: function (result) {
                    if (result.substring(1, 0) == "{") {
                        var myData = jQuery.parseJSON(result);
                        if (myData.Table0.length > 0) {
                            if (myData.Table0[0].SHC != "" && myData.Table0[0].Text_SHC != "") {
                                $("div[id='divMultiSHC']").find("li").each(function (i, row) {
                                    if (i > 0) {
                                        $(this).remove();
                                    }
                                });
                                cfi.BindMultiValue("SHC", myData.Table0[0].Text_SHC, myData.Table0[0].SHC);
                                //var a = myData.Table0[0].SHC;
                                //$("span[id=" + a + "][class='k-icon k-delete']").remove();
                                $("#SHC").val(myData.Table0[0].SHC);
                            }
                            else {
                                $("div[id='divMultiSHC']").find("li").each(function (i, row) {
                                    if (i > 0) {
                                        $(this).remove();
                                    }
                                    else {
                                        $(row).find("input[id^='Multi_SHC']").val('')
                                        $(row).find("span[id='FieldKeyValuesSHC']").text('');
                                        $("#SHC").val('');
                                    }
                                });
                            }
                        }
                    }
                    return false
                },
                error: function (xhr) {
                    var a = "";
                }
            });
        }
    }
    else {
        $.ajax({
            url: "Services/Report/NonExecutedBookingService.svc/GetSHCForPerPiecesGrossWt",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                SPHC: SPHC,
                HEASPHC: HEASPHC
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        if (myData.Table0[0].SHC != "" && myData.Table0[0].Text_SHC != "") {
                            $("div[id='divMultiSHC']").find("li").each(function (i, row) {
                                if (i > 0) {
                                    $(this).remove();
                                }
                            });
                            cfi.BindMultiValue("SHC", myData.Table0[0].Text_SHC, myData.Table0[0].SHC);
                            $("#SHC").val(myData.Table0[0].SHC);
                        }
                    }
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
}
function compareGrossVolValue() {
    var grosswt = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));
    var AWBVolumeWeight = ($("#AWBVolumeWeight").val() == "" ? 0 : parseFloat($("#AWBVolumeWeight").val()));
    var cw = ($("#AWBChargeableWeight").val() == "" ? 0 : parseFloat($("#AWBChargeableWeight").val()));
    var chwt = parseFloat(grosswt) > parseFloat(AWBVolumeWeight) ? grosswt : AWBVolumeWeight;
    if (cw > 0) {
        if (userContext.SpecialRights.RESCHARGEABLE == true) {
            if (parseFloat(cw) > parseFloat(chwt)) {
                var chwt1 = $("#AWBChargeableWeight").val();
                $("#AWBChargeableWeight").val(chwt1 == 0 ? "" : GetroundValue(chwt1, 1));
                $("#_tempAWBChargeableWeight").val(chwt1 == 0 ? "" : GetroundValue(chwt1, 1));
            }
            else {
                $("#AWBChargeableWeight").val(chwt == 0 ? "" : chwt);
                $("#_tempAWBChargeableWeight").val(chwt == 0 ? "" : chwt);
            }
        }
        else {
            $("#AWBChargeableWeight").val(chwt == 0 ? "" : chwt);
            $("#_tempAWBChargeableWeight").val(chwt == 0 ? "" : chwt);
        }
    }
    else {
        $("#AWBChargeableWeight").val(chwt == 0 ? "" : chwt);
        $("#_tempAWBChargeableWeight").val(chwt == 0 ? "" : chwt);
    }
}
function CalculateGrossVolumeWeight(obj) {

    var grosswt = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));
    var AWBVolumeWeight = ($("#AWBVolumeWeight").val() == "" ? 0 : parseFloat($("#AWBVolumeWeight").val()));
    var AWBPieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));

    var chwt = parseFloat(grosswt) > parseFloat(AWBVolumeWeight) ? grosswt : AWBVolumeWeight;
    //$("#AWBChargeableWeight").val(chwt.toFixed(0).toString() == 0 ? "" : chwt.toFixed(0).toString());       //Decimal By Tarun
    //$("#_tempAWBChargeableWeight").val(chwt.toFixed(0).toString() == 0 ? "" : chwt.toFixed(0).toString());       //Decimal By Tarun
    $("#AWBChargeableWeight").val(IsChargeableWt == 0 ? GetroundValue(chwt, 1) : MinimumChWt == 0 || MinimumChWt < chwt ? GetroundValue(chwt, 1) : MinimumChWt);
    $("#_tempAWBChargeableWeight").val(IsChargeableWt == 0 ? GetroundValue(chwt, 1) : MinimumChWt == 0 || MinimumChWt < chwt ? GetroundValue(chwt, 1) : MinimumChWt);
    if (parseFloat(grosswt) > 0) {
        var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
        thedivFlightSearchResult.innerHTML = "";
        $("#ItineraryGrossWeight").val(grosswt);
        $("#_tempItineraryGrossWeight").val(grosswt);
        if (AWBPieces > 0) {    //Per Piece SHC Work Commented
            var PerPicesgrossWt = 0;
            var PerPiecesCheckWeightforSHC = 0;
            var AWBPrefix = $("#AWBCode").val();
            if (AWBPrefix == '126') {
                if (userContext.SysSetting.GAPerPiecesCheckWeightforSHC != "" && userContext.SysSetting.GAPerPiecesCheckWeightforSHC != undefined)
                    PerPiecesCheckWeightforSHC = userContext.SysSetting.GAPerPiecesCheckWeightforSHC;
            }
            else if (AWBPrefix == '888') {
                if (userContext.SysSetting.QGPerPiecesCheckWeightforSHC != "" && userContext.SysSetting.QGPerPiecesCheckWeightforSHC != undefined)
                    PerPiecesCheckWeightforSHC = userContext.SysSetting.QGPerPiecesCheckWeightforSHC;
            }
            PerPicesgrossWt = grosswt / AWBPieces;
            if (parseFloat(PerPicesgrossWt) >= parseFloat(PerPiecesCheckWeightforSHC) && parseFloat(PerPiecesCheckWeightforSHC) > 0)
                SHCForPerPiecesGrossWt('');
            else
                SHCForPerPiecesGrossWt('1');

        }
        SetAndCalculateVolumeWeightAndCBMNEW('GrossWeight');
    }
}
function CalculateShipmentChWt(obj) {

    var grosswt = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));

    var cbm = ($("#AWBCBM").val() == "" ? 0 : parseFloat($("#AWBCBM").val()));
    var volwt = cbm * 166.66;
    //if ($(obj).attr('id').toUpperCase() == "AWBCBM") {
    //    $("span[id='AWBVolumeWeight']").text(volwt.toFixed(1) == 0 ? "" : volwt.toFixed(1));
    //$("#AWBVolumeWeight").val(volwt.toFixed(0) == 0 ? "" : volwt.toFixed(0));       //Decimal By Tarun
    //$("#_tempAWBVolumeWeight").val(volwt.toFixed(0) == 0 ? "" : volwt.toFixed(0));       //Decimal By Tarun
    //$("#ItineraryMainVolumeWeight").val(volwt.toFixed(0) == 0 ? "" : volwt.toFixed(0));       //Decimal By Tarun
    //$("#_tempItineraryMainVolumeWeight").val(volwt.toFixed(0) == 0 ? "" : volwt.toFixed(0));       //Decimal By Tarun
    $("#AWBVolumeWeight").val(volwt == 0 ? "" : GetroundValue(volwt, 1));
    $("#_tempAWBVolumeWeight").val(volwt == 0 ? "" : GetroundValue(volwt, 1));
    $("#ItineraryMainVolumeWeight").val(volwt == 0 ? "" : GetroundValue(volwt, 1));
    $("#_tempItineraryMainVolumeWeight").val(volwt == 0 ? "" : GetroundValue(volwt, 1));
    $("#ItineraryVolumeWeight").val(cbm == 0 ? "" : cbm);
    $("#_tempItineraryVolumeWeight").val(cbm == 0 ? "" : cbm);
    //}
    var chwt = parseFloat(grosswt) > parseFloat(volwt) ? grosswt : volwt;
    //$("#AWBChargeableWeight").val(chwt.toFixed(0) == 0 ? "" : chwt.toFixed(0));       //Decimal By Tarun
    //$("#_tempAWBChargeableWeight").val(chwt.toFixed(0) == 0 ? "" : chwt.toFixed(0));       //Decimal By Tarun
    $("#AWBChargeableWeight").val(IsChargeableWt == 0 ? GetroundValue(chwt, 1) : MinimumChWt == 0 || MinimumChWt < chwt ? GetroundValue(chwt, 1) : MinimumChWt);
    $("#_tempAWBChargeableWeight").val(IsChargeableWt == 0 ? GetroundValue(chwt, 1) : MinimumChWt == 0 || MinimumChWt < chwt ? GetroundValue(chwt, 1) : MinimumChWt);
    if (parseFloat(grosswt) > 0) {
        $("#ItineraryGrossWeight").val(grosswt);
        $("#_tempItineraryGrossWeight").val(grosswt);
    }
}
function CalculateShipmentCBM() {
    if ($("#AWBVolumeWeight").val() != "") {        //Decimal By Tarun
        $("#AWBVolumeWeight").val(GetroundValue($("#AWBVolumeWeight").val(), 1));
        $("#_tempAWBVolumeWeight").val(GetroundValue($("#AWBVolumeWeight").val(), 1));
    }
    var grosswt = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));
    var volwt = ($("#AWBVolumeWeight").val() == "" ? 0 : parseFloat($("#AWBVolumeWeight").val()));
    var cbm = volwt / 166.66;
    $("#AWBCBM").val(cbm.toFixed(3) == 0 ? "" : cbm.toFixed(3));
    $("#_tempAWBCBM").val(cbm.toFixed(3) == 0 ? "" : cbm.toFixed(3));
    var chwt = parseFloat(grosswt) > parseFloat(volwt) ? grosswt : volwt;
    //$("#AWBChargeableWeight").val(chwt.toFixed(0) == 0 ? "" : chwt.toFixed(0));       //Decimal By Tarun
    //$("#_tempAWBChargeableWeight").val(chwt.toFixed(0) == 0 ? "" : chwt.toFixed(0));       //Decimal By Tarun
    $("#AWBChargeableWeight").val(IsChargeableWt == 0 ? GetroundValue(chwt, 1) : MinimumChWt == 0 || MinimumChWt < chwt ? GetroundValue(chwt, 1) : MinimumChWt);
    $("#_tempAWBChargeableWeight").val(IsChargeableWt == 0 ? GetroundValue(chwt, 1) : MinimumChWt == 0 || MinimumChWt < chwt ? GetroundValue(chwt, 1) : MinimumChWt);
    $("#ItineraryVolumeWeight").val(cbm.toFixed(3));
    $("#_tempItineraryVolumeWeight").val(cbm.toFixed(3));
    $("#ItineraryMainVolumeWeight").val(volwt);
    $("#_tempItineraryMainVolumeWeight").val(volwt);
    var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
    thedivFlightSearchResult.innerHTML = "";
}
function ItineraryPieces() {
    var AWBPieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
    var AWBGrossWeight = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));
    var AWBCBM = ($("#AWBCBM").val() == "" ? 0 : parseFloat($("#AWBCBM").val()));
    var AWBVolumeWeight = ($("#AWBVolumeWeight").val() == "" ? 0 : parseFloat($("#AWBVolumeWeight").val()));
    var ItineraryPieces = ($("#ItineraryPieces").val() == "" ? 0 : parseFloat($("#ItineraryPieces").val()));
    var ItineraryGrossWeight = ($("#ItineraryGrossWeight").val() == "" ? 0 : parseFloat($("#ItineraryGrossWeight").val()));
    var ItineraryCBM = ($("#ItineraryVolumeWeight").val() == "" ? 0 : parseFloat($("#ItineraryVolumeWeight").val()));
    var ItineraryMainVolumeWeight = ($("#ItineraryMainVolumeWeight").val() == "" ? 0 : parseFloat($("#ItineraryMainVolumeWeight").val()));
    var ItineraryOrigin = $("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0];
    var ItineraryDestination = $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0];
    var SelectedItineraryPieces = 0;
    var SelectedItineraryGrossWeight = 0;
    var SelectedItineraryCBM = 0;
    var SelectedItineraryMainVolumeWeight = 0;

    var RemainingItineraryGrossWeight = ((parseFloat(ItineraryPieces) * parseFloat(AWBGrossWeight)) / AWBPieces).toFixed(2)
    var RemainingItineraryCBM = ((parseFloat(ItineraryPieces) * parseFloat(AWBCBM)) / AWBPieces).toFixed(3)
    var RemainingItineraryMainVolumeWeight = ((parseFloat(ItineraryPieces) * parseFloat(AWBVolumeWeight)) / AWBPieces).toFixed(2)

    var table = document.getElementById("tblSelectdRouteResult");
    if (table != null && table.rows.length > 1) {
        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
            if (ItineraryOrigin == $(tr).find("td")[2].innerText.split("/")[0].trim() && ItineraryDestination == $(tr).find("td")[2].innerText.split("/")[1].trim()) {
                SelectedItineraryPieces = parseInt(SelectedItineraryPieces) + parseInt($(tr).find("td")[3].innerText.trim());
                SelectedItineraryGrossWeight = parseFloat(SelectedItineraryGrossWeight) + parseFloat($(tr).find("td")[4].innerText.trim());
                SelectedItineraryCBM = parseFloat(SelectedItineraryCBM) + parseFloat($(tr).find("td")[5].innerText.trim());
                SelectedItineraryMainVolumeWeight = parseFloat(parseFloat(SelectedItineraryMainVolumeWeight) + parseFloat($(tr).find("input[id^='hdnItineraryMainVolumeWeight_']").val())).toFixed(2);
            }
        });
    }
    ItineraryPieces = parseInt(ItineraryPieces) + parseInt(SelectedItineraryPieces);
    var RemGrossWeight = (parseFloat(AWBGrossWeight) - parseFloat(SelectedItineraryGrossWeight)).toFixed(2);
    var RemCBM = (parseFloat(AWBCBM) - parseFloat(SelectedItineraryCBM)).toFixed(3);
    var RemItineraryMainVolumeWeight = (parseFloat(AWBVolumeWeight) - parseFloat(SelectedItineraryMainVolumeWeight)).toFixed(2);
    if (AWBPieces == 0 && ItineraryPieces > 0) {
        $("#ItineraryPieces").val('');
        $("#_tempItineraryPieces").val('');
        ShowMessage('warning', 'Information!', "First Enter AWB Pieces.");
        return false;
    }
    else if (ItineraryPieces > AWBPieces) {
        $("#ItineraryPieces").val('');
        $("#_tempItineraryPieces").val('');
        ShowMessage('warning', 'Information!', "Itinerary Pieces less than AWB Pieces.");
        return false;
    }

    if (ItineraryPieces == AWBPieces) {
        $("#ItineraryGrossWeight").val(RemGrossWeight);
        $("#_tempItineraryGrossWeight").val(RemGrossWeight);
        $("#ItineraryVolumeWeight").val(RemCBM);
        $("#_tempItineraryVolumeWeight").val(RemCBM);
        $("#ItineraryMainVolumeWeight").val(RemItineraryMainVolumeWeight);
        $("#_tempItineraryMainVolumeWeight").val(RemItineraryMainVolumeWeight);
    }
    else {
        $("#ItineraryGrossWeight").val(parseFloat(RemainingItineraryGrossWeight) < parseFloat(RemGrossWeight) ? parseFloat(RemainingItineraryGrossWeight).toFixed(2) : parseFloat(RemGrossWeight).toFixed(2));
        $("#_tempItineraryGrossWeight").val(parseFloat(RemainingItineraryGrossWeight) < parseFloat(RemGrossWeight) ? parseFloat(RemainingItineraryGrossWeight).toFixed(2) : parseFloat(RemGrossWeight).toFixed(2));
        $("#ItineraryVolumeWeight").val(parseFloat(RemainingItineraryCBM) < parseFloat(RemCBM) ? RemainingItineraryCBM : RemCBM);
        $("#_tempItineraryVolumeWeight").val(parseFloat(RemainingItineraryCBM) < parseFloat(RemCBM) ? RemainingItineraryCBM : RemCBM);
        $("#ItineraryMainVolumeWeight").val(parseFloat(RemainingItineraryMainVolumeWeight) < parseFloat(RemItineraryMainVolumeWeight) ? parseFloat(RemainingItineraryMainVolumeWeight) : parseFloat(RemItineraryMainVolumeWeight));
        $("#_tempItineraryMainVolumeWeight").val(parseFloat(RemainingItineraryMainVolumeWeight) < parseFloat(RemItineraryMainVolumeWeight) ? parseFloat(RemainingItineraryMainVolumeWeight) : parseFloat(RemItineraryMainVolumeWeight));
    }
}
function ItineraryGrossWeight() {
    var AWBGrossWeight = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));
    var ItineraryGrossWeight = ($("#ItineraryGrossWeight").val() == "" ? 0 : parseFloat($("#ItineraryGrossWeight").val()));
    var ItineraryOrigin = $("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0];
    var ItineraryDestination = $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0];
    var SelectedItineraryPieces = 0;
    var SelectedItineraryGrossWeight = 0;
    var SelectedItineraryCBM = 0;

    var table = document.getElementById("tblSelectdRouteResult");
    if (table != null && table.rows.length > 1) {
        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
            if (ItineraryOrigin == $(tr).find("td")[2].innerText.split("/")[0].trim() && ItineraryDestination == $(tr).find("td")[2].innerText.split("/")[1].trim()) {
                SelectedItineraryPieces = parseInt(SelectedItineraryPieces) + parseInt($(tr).find("td")[3].innerText.trim());
                SelectedItineraryGrossWeight = parseFloat(SelectedItineraryGrossWeight) + parseFloat($(tr).find("td")[4].innerText.trim());
                SelectedItineraryCBM = parseFloat(SelectedItineraryCBM) + parseFloat($(tr).find("td")[5].innerText.trim());
            }
        });
    }
    ItineraryGrossWeight = parseFloat(ItineraryGrossWeight) + parseFloat(SelectedItineraryGrossWeight)
    if (AWBGrossWeight == 0 && ItineraryGrossWeight > 0) {
        $("#ItineraryGrossWeight").val('');
        $("#_tempItineraryGrossWeight").val('');
        ShowMessage('warning', 'Information!', "First Enter AWB Gross Weight.");
        return false;
    }
    else if (ItineraryGrossWeight > AWBGrossWeight) {
        $("#ItineraryGrossWeight").val('');
        $("#_tempItineraryGrossWeight").val('');
        ShowMessage('warning', 'Information!', "Itinerary Gross Weight less than AWB Gross Weight.");
        return false;
    }
}
function ItineraryCBM() {
    var AWBCBM = ($("#AWBCBM").val() == "" ? 0 : parseFloat($("#AWBCBM").val()));
    var ItineraryVolumeWeight = ($("#ItineraryVolumeWeight").val() == "" ? 0 : parseFloat($("#ItineraryVolumeWeight").val()));
    var ItineraryOrigin = $("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0];
    var ItineraryDestination = $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0];
    var SelectedItineraryPieces = 0;
    var SelectedItineraryGrossWeight = 0;
    var SelectedItineraryVolumeWeight = 0;

    var table = document.getElementById("tblSelectdRouteResult");
    if (table != null && table.rows.length > 1) {
        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
            if (ItineraryOrigin == $(tr).find("td")[2].innerText.split("/")[0].trim() && ItineraryDestination == $(tr).find("td")[2].innerText.split("/")[1].trim()) {
                SelectedItineraryPieces = parseInt(SelectedItineraryPieces) + parseInt($(tr).find("td")[3].innerText.trim());
                SelectedItineraryGrossWeight = parseFloat(SelectedItineraryGrossWeight) + parseFloat($(tr).find("td")[4].innerText.trim());
                SelectedItineraryVolumeWeight = parseFloat(SelectedItineraryVolumeWeight) + parseFloat($(tr).find("td")[5].innerText.trim());
            }
        });
    }
    ItineraryVolumeWeight = parseFloat(ItineraryVolumeWeight) + parseFloat(SelectedItineraryVolumeWeight)
    if (AWBCBM == 0 && ItineraryVolumeWeight > 0) {
        $("#ItineraryVolumeWeight").val('');
        $("#_tempItineraryVolumeWeight").val('');
        ShowMessage('warning', 'Information!', "First Enter AWB Volume (CBM).");
        return false;
    }
    else if (ItineraryVolumeWeight > AWBCBM) {
        $("#ItineraryVolumeWeight").val('');
        $("#_tempItineraryVolumeWeight").val('');
        ShowMessage('warning', 'Information!', "Itinerary Volume Weight less than AWB Volume (CBM).");
        return false;
    }
}

function ItineraryMainVolumeWeight() {
    var AWBVolumeWeight = ($("#AWBVolumeWeight").val() == "" ? 0 : parseFloat($("#AWBVolumeWeight").val()));
    var ItineraryMainVolumeWeight = ($("#ItineraryMainVolumeWeight").val() == "" ? 0 : parseFloat($("#ItineraryMainVolumeWeight").val()));
    var ItineraryOrigin = $("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0];
    var ItineraryDestination = $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0];
    var SelectedItineraryPieces = 0;
    var SelectedItineraryGrossWeight = 0;
    var SelectedItineraryMainVolumeWeight = 0;

    var table = document.getElementById("tblSelectdRouteResult");
    if (table != null && table.rows.length > 1) {
        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
            if (ItineraryOrigin == $(tr).find("td")[2].innerText.split("/")[0].trim() && ItineraryDestination == $(tr).find("td")[2].innerText.split("/")[1].trim()) {
                SelectedItineraryPieces = parseInt(SelectedItineraryPieces) + parseInt($(tr).find("td")[3].innerText.trim());
                SelectedItineraryGrossWeight = parseFloat(SelectedItineraryGrossWeight) + parseFloat($(tr).find("td")[4].innerText.trim());
                SelectedItineraryMainVolumeWeight = parseFloat(parseFloat(SelectedItineraryMainVolumeWeight) + parseFloat($(tr).find("input[id^='hdnItineraryMainVolumeWeight_']").val())).toFixed(2);
            }
        });
    }
    ItineraryMainVolumeWeight = parseFloat(parseFloat(ItineraryMainVolumeWeight) + parseFloat(SelectedItineraryMainVolumeWeight)).toFixed(2)
    if (AWBVolumeWeight == 0 && ItineraryMainVolumeWeight > 0) {
        $("#ItineraryMainVolumeWeight").val('');
        $("#_tempItineraryMainVolumeWeight").val('');
        ShowMessage('warning', 'Information!', "First Enter AWB Volume Weight.");
        return false;
    }
    else if (ItineraryMainVolumeWeight > AWBVolumeWeight) {
        $("#ItineraryMainVolumeWeight").val('');
        $("#_tempItineraryMainVolumeWeight").val('');
        ShowMessage('warning', 'Information!', "Itinerary Volume Weight less than AWB Volume Weight.");
        return false;
    }
}


function SelectdRoute(SelectedRouteID, Mode, Action, AllotSNo, AllotCode, Check, RouteStatus, Status, IsSoftEmbargo, OverrideBCT, OverrideMCT) {
    getFlightNo(SelectedRouteID, "1")
    var ValidationResult = true;
    //if (Action.toUpperCase() != "UPDATE") {
    //    ValidationResult = cfi.IsValidSection("ApplicationTabs-1");
    //    if (ValidationResult == true) {
    //        if (userContext.SysSetting.ICMSEnvironment == 'JT') {
    //            var CheckFillDropAllotmentR = true;
    //            CheckFillDropAllotmentR = CheckFillDropAllotment(SelectedRouteID);
    //            if (CheckFillDropAllotmentR == false) {
    //                ValidationResult = false;
    //                ShowMessage('warning', 'Information!', "First Select Allotment code.");
    //                return false;
    //            }
    //        }
    //    }
    //}
    if (ValidationResult == true) {
        var IsPerPiecesCheckAllow = true;
        var IsConfirmData = true;
        var ULDCheck = true;
        var SoftEmbargo = "0";
        var ItineraryPieces = $("#ItineraryPieces").val();
        var ItineraryGrossWeight = ($("#ItineraryGrossWeight").val() == "" ? 0 : parseFloat($("#ItineraryGrossWeight").val()));
        var ItineraryVolumeWeight = ($("#ItineraryVolumeWeight").val() == "" ? 0 : parseFloat($("#ItineraryVolumeWeight").val()));
        //var ItineraryGrossWeight = $("#ItineraryGrossWeight").val();
        //var ItineraryVolumeWeight = $("#ItineraryVolumeWeight").val();
        var MaxGrossPerPcs = parseFloat($("#lblMaxGrossPerPcs_" + SelectedRouteID).text());
        var MaxVolumePerPcs = parseFloat($("#lblMaxVolumePerPcs_" + SelectedRouteID).text());
        var FlightCapacityGrWt = parseFloat($("#lblFlightCapacityGrWt_" + SelectedRouteID).text());
        var FlightCapacityVol = parseFloat($("#lblFlightCapacityVol_" + SelectedRouteID).text());
        var TotalFlightCapacityGrWt = parseFloat($("#hdnOverbookAVLGross_" + SelectedRouteID).val());
        var TotalFlightCapacityVol = parseFloat($("#hdnOverbookAVLVol_" + SelectedRouteID).val());
        var TotalMaxGrossPerPcs = parseFloat($("#lblMaxGrossPerPcs_" + SelectedRouteID).text()) * parseFloat(ItineraryPieces);
        var TotalMaxVolumePerPcs = parseFloat($("#lblMaxVolumePerPcs_" + SelectedRouteID).text()) * parseFloat(ItineraryPieces);
        var OverrideBCT = OverrideBCT;
        var OverrideMCT = OverrideMCT;
        //if (Action.toUpperCase() == "NEW") {
        //    if ($("#Text_Commodity").data("kendoAutoComplete").key() != "" || $("#Text_SHC").data("kendoAutoComplete").key() != "") {
        //        $.ajax({
        //            url: "Services/Shipment/ReservationBookingService.svc/IsPerPiecesCheckAllow",
        //            async: false,
        //            type: "GET",
        //            dataType: "json",
        //            data: {
        //                CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_Commodity").data("kendoAutoComplete").key(),
        //                SPHC: $("#Text_SHC").data("kendoAutoComplete").key(),
        //            },
        //            contentType: "application/json; charset=utf-8", cache: false,
        //            success: function (result) {
        //                if (result.substring(1, 0) == "{") {
        //                    var myData = jQuery.parseJSON(result);
        //                    if (myData.Table0.length > 0) {
        //                        if (myData.Table0[0].Result == "0") {
        //                            IsPerPiecesCheckAllow = false;
        //                        }
        //                    }
        //                }
        //            },
        //            error: function (xhr) {
        //                var a = "";
        //            }
        //        });
        //    }


        //    if (ItineraryGrossWeight > TotalFlightCapacityGrWt) {
        //        ShowMessage('warning', 'Information!', "Itinerary Gross Weight can not be greater than Flight Capacity Gr. Wt .");
        //        return false;
        //    }
        //    //if (ItineraryVolumeWeight > FlightCapacityVol) {
        //    if (ItineraryVolumeWeight > TotalFlightCapacityVol) {
        //        ShowMessage('warning', 'Information!', "Itinerary Volume can not be greater than Flight Capacity Volume .");
        //        return false;
        //    }
        //    if ((ItineraryGrossWeight > TotalMaxGrossPerPcs) && MaxGrossPerPcs != 0 && $("#chkIsBUP").prop('checked') != true && IsPerPiecesCheckAllow == true) {
        //        ShowMessage('warning', 'Information!', "Single Piece Gross Weight limit exceeds on chosen flight. Cannot proceed.");
        //        return false;
        //    }
        //    if ((ItineraryVolumeWeight > TotalMaxVolumePerPcs) && MaxVolumePerPcs != 0 && $("#chkIsBUP").prop('checked') != true && IsPerPiecesCheckAllow == true) {
        //        ShowMessage('warning', 'Information!', "Volume Per Piece check applicable on Flight.");
        //        return false;
        //    }
        //}

        if ((kendo.parseFloat($("#ItineraryPieces").val()) <= 0 || kendo.parseFloat($("#ItineraryGrossWeight").val()) <= 0 || kendo.parseFloat($("#ItineraryVolumeWeight").val()) <= 0) && Action.toUpperCase() != "UPDATE") {
            ShowMessage('warning', 'Information!', "Enter Pieces, Gross Weight and Volume (CBM) for Search Flight.");
            return false;
        }
        else {
            if (Check == "1") {
                if ($("#chkIsBUP").prop('checked') == true) {
                    $.ajax({
                        url: "Services/Report/NonExecutedBookingService.svc/ULDCheck",
                        async: false,
                        type: "GET",
                        dataType: "json",
                        data: {
                            DailFlightSNo: SelectedRouteID,
                            BookingRefNo: $("#hdnBookingMasterRefNo").val(),
                        },
                        contentType: "application/json; charset=utf-8", cache: false,
                        success: function (result) {
                            if (result.substring(1, 0) == "{") {
                                var myData = jQuery.parseJSON(result);
                                if (myData.Table0.length > 0) {
                                    if (myData.Table0[0].IsValid != "") {
                                        if (myData.Table0[0].IsValid == "False") {
                                            var ValidMessage = myData.Table0[0].ValidMessage;
                                            ULDCheck = false;
                                            ShowMessage('warning', 'Information!', ValidMessage);
                                            return;
                                        }
                                    }
                                }
                            }
                        },
                        error: function (xhr) {
                            var a = "";
                        }
                    });
                }
                /*	//Start Commented By Tarun for New Embargo Work
                if (ULDCheck == true) {
                    $.ajax({
                        url: "Services/Shipment/ReservationBookingService.svc/CheckEmbargoParam",
                        async: false,
                        type: "GET",
                        dataType: "json",
                        data: {
                            DailFlightSNo: SelectedRouteID,
                            AgentSNo: $("#Text_AWBAgent").data("kendoAutoComplete").key(),
                            ProductSNo: $("#Text_Product").data("kendoAutoComplete").key(),
                            CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
                            ItineraryPieces: $("#ItineraryPieces").val(),
                            ItineraryGrossWeight: $("#ItineraryGrossWeight").val(),
                            ItineraryVolumeWeight: $("#ItineraryVolumeWeight").val(),
                            PaymentType: $("#Text_ChargeCode").data("kendoAutoComplete").key(),
                            SPHC: $("#Text_SHC").data("kendoAutoComplete").key(),
                        },
                        contentType: "application/json; charset=utf-8", cache: false,
                        success: function (result) {
                            if (result.substring(1, 0) == "{") {
                                var myData = jQuery.parseJSON(result);
                                if (myData.Table0.length > 0) {
                                    if (myData.Table0[0].IsSoftEmbargo != "") {
                                        if (myData.Table0[0].IsSoftEmbargo != "True") {
                                            var EmbargoName = myData.Table0[0].ValidMessage.split('@')[0];
                                            IsConfirmData = false;
                                            //ShowMessage('warning', 'Information!', EmbargoName + ' - ' + 'Hard Embargo Applied.');
                                            ShowMessage('warning', 'Information!', 'Embargo Levied' + ' - ' + EmbargoName);

                                            return;
                                        }
                                        else if (myData.Table0[0].IsSoftEmbargo == "True") {
                                            var EmbargoName = myData.Table0[0].ValidMessage.split('@')[1];
                                            IsConfirmData = confirm(EmbargoName + ' - ' + 'Soft Embargo Applied. Do you wish to continue?');
                                            SoftEmbargo = "1";
                                        }
                                        if (IsConfirmData == false) {
                                            return;
                                        }
                                    }
                                }
                            }
                        },
                        error: function (xhr) {
                            var a = "";
                        }
                    });
				}
				//End Commented By Tarun for New Embargo Work	*/
            }
            if (IsConfirmData == true && ULDCheck == true) {
                var FlightSearch = true;
                var Selectedflag = false;
                var AllotmentSNo = "";
                var AllotmentCode = "";
                if (Action.toUpperCase() == "NEW") {
                    //AllotmentSNo = $("#Text_Allotment_" + SelectedRouteID).data("kendoAutoComplete").key();
                    //AllotmentCode = $("#Text_Allotment_" + SelectedRouteID).data("kendoAutoComplete").value();
                    AllotmentSNo = $("#DropAllotment_" + SelectedRouteID).val();
                    if ($("#DropAllotment_" + SelectedRouteID).val() != '' && $("#DropAllotment_" + SelectedRouteID).val() != null)
                        AllotmentCode = $("#DropAllotment_" + SelectedRouteID).children("option").filter(":selected")[0].innerHTML;
                    else
                        AllotmentCode = "";
                }
                    // else if (Action.toUpperCase() == "UPDATE" || Action.toUpperCase() == "EXECUTE" || Action.toUpperCase() == "COPY") {
                else if (Action.toUpperCase() == "UPDATE" || Action.toUpperCase() == "EXECUTE") {
                    AllotmentSNo = AllotSNo;
                    AllotmentCode = AllotCode;
                    SoftEmbargo = IsSoftEmbargo;
                }
                var IsSoftEmbargoValue = SoftEmbargo == "1" ? "Yes" : "No";
                if (Mode == "SelectedRoute") {
                    if (SendRouteAaarray.length > 1) {
                        $.ajax({
                            url: "Services/Report/NonExecutedBookingService.svc/SelectdRoute",
                            async: false,
                            type: "GET",
                            dataType: "json",
                            data: {
                                DailFlightSNo: SelectedRouteID
                            },
                            contentType: "application/json; charset=utf-8", cache: false,
                            success: function (result) {
                                var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
                                thedivFlightSearchResult.innerHTML = "";
                                var theDiv = document.getElementById("divFinalSelectedroute");
                                var table = "";
                                if (theDiv.innerHTML == "") {
                                    if (Action.toUpperCase() == "COPY")
                                        $("#Text_AWBOrigin").data("kendoAutoComplete").enable(false)
                                    else
                                        $("#Text_AWBDestination").data("kendoAutoComplete").enable(false);
                                    table = "</br><table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='8'>Flight Itinerary : " + SelectedRouteValue + "</td></tr></table><table class='appendGrid ui-widget' id='tblSelectdRouteResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight No.</td><td class='ui-widget-header'>Date</td><td class='ui-widget-header'>O/D</td><td class='ui-widget-header'>Pieces</td><td class='ui-widget-header'>Gr. Wt.</td><td class='ui-widget-header'>Vol.(CBM)</td><td class='ui-widget-header'>STD/STA</td><td class='ui-widget-header'>A/C Type</td><td class='ui-widget-header'>ALOT Code</td><td id='RouteStatus' class='ui-widget-header'>Route Status</td><td id='Status' class='ui-widget-header'>Status</td><td id='SoftEmbargoApplied' class='ui-widget-header'>Soft Embargo</td><td id='bct' class='ui-widget-header'>BCT</td><td id='mct' class='ui-widget-header'>MCT</td><td class='ui-widget-header'>Action</td></tr></thead><tbody class='ui-widget-content'>";

                                }
                                if (result.substring(1, 0) == "{") {
                                    var myData = jQuery.parseJSON(result);
                                    if (myData.Table0.length > 0) {
                                        for (var i = 0; i < myData.Table0.length; i++) {
                                            if (theDiv.innerHTML == "") {
                                                if (userContext.SysSetting.ICMSEnvironment == 'JT' && Action.toUpperCase() != "COPY" && Action.toUpperCase() != "UPDATE") {
                                                    if ($('input:radio[name=AWBStock]:checked').val() === '0') {
                                                        if (AWBFillCarrierCode != myData.Table0[i].FlightNo.split('-')[0] && myData.Table0[i].IsInterline == 0) {
                                                            if ($("#Text_AWBAgent").data("kendoAutoComplete").value() != "" && $("#Text_AWBAgent").prop('disabled') == true) {
                                                                if ($("#Text_AWBAgent").data("kendoAutoComplete").key() == userContext.SysSetting.InterlineAgentSNo) { }
                                                                else if (userContext.AgentSNo > 0 && ($("#Text_AWBAgent").data("kendoAutoComplete").key() == userContext.AgentSNo)) { }
                                                                else {
                                                                    ShowMessage('warning', 'Information!', "First Leg booking is not allowed on " + myData.Table0[i].FlightNo + " for Manual AWB Stock of " + PrefixAirlineName + ".");
                                                                    return false;
                                                                }
                                                            }
                                                            else {
                                                                ShowMessage('warning', 'Information!', "First Leg booking is not allowed on " + myData.Table0[i].FlightNo + " for Manual AWB Stock of " + PrefixAirlineName + ".");
                                                                return false;
                                                            }
                                                        }
                                                    }
                                                }
                                                table += "<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><input name='hdnOriginAirportSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginAirportSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginSNo + "'/><input name='hdnDestinationAirportSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationAirportSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationSNo + "'/><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + parseFloat($("#ItineraryGrossWeight").val()).toFixed(2) + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td id='Status' class='ui-widget-content first'>" + Status + "</td><td id='SoftEmbargoApplied' class='ui-widget-content first'>" + IsSoftEmbargoValue + "</td><td id='bct' class='ui-widget-content first'>" + OverrideBCT + "</td><td id='mct' class='ui-widget-content first'>" + OverrideMCT + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/><input name='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' id='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + SoftEmbargo + "'/><input name='hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "' id='hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + $("#ItineraryMainVolumeWeight").val() + "'/><input name='hdnArrFlightDate_" + myData.Table0[i].DailyflightSNo + "' id='hdnArrFlightDate_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].ArrFlightDate + "'/></td></tr>";

                                                $("#hdnETDTime").val(myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3));
                                                $("#hdnFlightDate").val(myData.Table0[i].FlightDate);
                                                $("#hdnArrFlightDate").val(myData.Table0[i].ArrFlightDate);
                                            }
                                            else {
                                                var tblSelectdRouteResult = document.getElementById("tblSelectdRouteResult");
                                                if (tblSelectdRouteResult != null && tblSelectdRouteResult.rows.length > 1) {
                                                    $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                                        if ($(tr)[0].id == myData.Table0[i].DailyflightSNo) {
                                                            if ($(tr).find("td")[8].innerText.trim() == "") {
                                                                $(tr).find("td")[3].innerText = parseInt($(tr).find("td")[3].innerText.trim()) + parseInt($("#ItineraryPieces").val());
                                                                $(tr).find("td")[4].innerText = (parseFloat($(tr).find("td")[4].innerText.trim()) + parseFloat($("#ItineraryGrossWeight").val())).toFixed(2);
                                                                $(tr).find("td")[5].innerText = (parseFloat($(tr).find("td")[5].innerText.trim()) + parseFloat($("#ItineraryVolumeWeight").val())).toFixed(3);
                                                                $(tr).find("td")[8].innerText = AllotmentCode;
                                                                $("#hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "").val(AllotmentSNo);
                                                                $("#hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "").val(parseFloat($("#hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "").val() + parseFloat($("#ItineraryMainVolumeWeight").val())).toFixed(2));
                                                                Selectedflag = true;
                                                                return false;
                                                            }
                                                            else if ($(tr).find("td")[8].innerText.trim() == AllotmentCode) {
                                                                $(tr).find("td")[3].innerText = parseInt($(tr).find("td")[3].innerText.trim()) + parseInt($("#ItineraryPieces").val());
                                                                $(tr).find("td")[4].innerText = (parseFloat($(tr).find("td")[4].innerText.trim()) + parseFloat($("#ItineraryGrossWeight").val())).toFixed(2);
                                                                $(tr).find("td")[5].innerText = (parseFloat($(tr).find("td")[5].innerText.trim()) + parseFloat($("#ItineraryVolumeWeight").val())).toFixed(3);
                                                                $("#hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "").val(parseFloat($("#hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "").val() + parseFloat($("#ItineraryMainVolumeWeight").val())).toFixed(2));
                                                                Selectedflag = true;
                                                                return false;
                                                            }
                                                            else {
                                                                Selectedflag = true;
                                                                FlightSearch = false;
                                                                ShowMessage('warning', 'Information!', "Different Allotment Code can not be use in same Flight.");
                                                                return false;
                                                            }
                                                        }
                                                    });
                                                    if (Selectedflag == false) {
                                                        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                                            if ($(tr).find("td")[2].innerText.split("/")[0].trim() == myData.Table0[i].Origin) {
                                                                $(tr).after("<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><input name='hdnOriginAirportSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginAirportSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginSNo + "'/><input name='hdnDestinationAirportSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationAirportSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationSNo + "'/><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryGrossWeight").val() + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td id='Status' class='ui-widget-content first'>" + Status + "</td><td id='SoftEmbargoApplied' class='ui-widget-content first'>" + IsSoftEmbargoValue + "</td><td id='bct' class='ui-widget-content first'>" + OverrideBCT + "</td><td id='mct' class='ui-widget-content first'>" + OverrideMCT + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/><input name='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' id='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + SoftEmbargo + "'/><input name='hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "' id='hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + $("#ItineraryMainVolumeWeight").val() + "'/><input name='hdnArrFlightDate_" + myData.Table0[i].DailyflightSNo + "' id='hdnArrFlightDate_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].ArrFlightDate + "'/></td></tr>")

                                                                $("#hdnETDTime").val(myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3));
                                                                $("#hdnFlightDate").val(myData.Table0[i].FlightDate);
                                                                $("#hdnArrFlightDate").val(myData.Table0[i].ArrFlightDate);
                                                                Selectedflag = true;
                                                                return false;
                                                            }
                                                        });
                                                        if (Selectedflag == false) {
                                                            $('#tblSelectdRouteResult').append("<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><input name='hdnOriginAirportSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginAirportSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginSNo + "'/><input name='hdnDestinationAirportSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationAirportSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationSNo + "'/><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + parseFloat($("#ItineraryGrossWeight").val()).toFixed(2) + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td id='Status' class='ui-widget-content first'>" + Status + "</td><td id='SoftEmbargoApplied' class='ui-widget-content first'>" + IsSoftEmbargoValue + "</td><td id='bct' class='ui-widget-content first'>" + OverrideBCT + "</td><td id='mct' class='ui-widget-content first'>" + OverrideMCT + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/><input name='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' id='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + SoftEmbargo + "'/><input name='hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "' id='hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + $("#ItineraryMainVolumeWeight").val() + "'/><input name='hdnArrFlightDate_" + myData.Table0[i].DailyflightSNo + "' id='hdnArrFlightDate_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].ArrFlightDate + "'/></td></tr>");

                                                            $("#hdnETDTime").val(myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3));
                                                            $("#hdnFlightDate").val(myData.Table0[i].FlightDate);
                                                            $("#hdnArrFlightDate").val(myData.Table0[i].ArrFlightDate);
                                                        }
                                                    }
                                                }
                                                else {
                                                    if (Selectedflag == false) {
                                                        $('#tblSelectdRouteResult').append("<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><input name='hdnOriginAirportSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginAirportSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginSNo + "'/><input name='hdnDestinationAirportSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationAirportSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationSNo + "'/><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + parseFloat($("#ItineraryGrossWeight").val()).toFixed(2) + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td id='Status' class='ui-widget-content first'>" + Status + "</td><td id='SoftEmbargoApplied' class='ui-widget-content first'>" + IsSoftEmbargoValue + "</td><td id='bct' class='ui-widget-content first'>" + OverrideBCT + "</td><td id='mct' class='ui-widget-content first'>" + OverrideMCT + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/><input name='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' id='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + SoftEmbargo + "'/><input name='hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "' id='hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + $("#ItineraryMainVolumeWeight").val() + "'/><input name='hdnArrFlightDate_" + myData.Table0[i].DailyflightSNo + "' id='hdnArrFlightDate_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].ArrFlightDate + "'/></td></tr>");

                                                        $("#hdnETDTime").val(myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3));
                                                        $("#hdnFlightDate").val(myData.Table0[i].FlightDate);
                                                        $("#hdnArrFlightDate").val(myData.Table0[i].ArrFlightDate);
                                                    }
                                                }
                                                if (FlightSearch == true)
                                                    thedivFlightSearchResult.innerHTML = "";
                                            }
                                        }
                                        if (theDiv.innerHTML == "") {
                                            table += "</tbody></table>";
                                            theDiv.innerHTML += table;
                                        }
                                        window.scrollTo(0, 0);
                                        var tblSelectdRouteResultDelete = document.getElementById("tblSelectdRouteResult");
                                        if (tblSelectdRouteResultDelete != null && tblSelectdRouteResultDelete.rows.length > 2) {
                                            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                                if (row != (tblSelectdRouteResultDelete.rows.length - 2))
                                                    $(tr).find("[id^='Delete_']").css("display", "none");
                                            });
                                        }
                                        SendRouteAaarray.shift();
                                        SearchFlightMode("SelectedRoute");
                                    }
                                }
                            },
                            error: function (xhr) {
                                var a = "";
                            }
                        });
                    }
                }
                else {
                    SelectedRouteValue = "";
                    $.ajax({
                        url: "Services/Report/NonExecutedBookingService.svc/SelectdRoute",
                        async: false,
                        type: "GET",
                        dataType: "json",
                        data: {
                            DailFlightSNo: SelectedRouteID
                        },
                        contentType: "application/json; charset=utf-8", cache: false,
                        success: function (result) {

                            var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
                            //thedivFlightSearchResult.innerHTML = "";
                            var theDiv = document.getElementById("divFinalSelectedroute");
                            var table = "";
                            if (theDiv.innerHTML == "") {
                                if (Action.toUpperCase() == "COPY")
                                    $("#Text_AWBOrigin").data("kendoAutoComplete").enable(false)
                                else
                                    $("#Text_AWBDestination").data("kendoAutoComplete").enable(false);
                                table = "</br><table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='8'>Flight Itinerary : " + SelectedRouteValue + "</td></tr></table><table class='appendGrid ui-widget' id='tblSelectdRouteResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight No.</td><td class='ui-widget-header'>Date</td><td class='ui-widget-header'>O/D</td><td class='ui-widget-header'>Pieces</td><td class='ui-widget-header'>Gr. Wt.</td><td class='ui-widget-header'>Vol.(CBM)</td><td class='ui-widget-header'>STD/STA</td><td class='ui-widget-header'>A/C Type</td><td class='ui-widget-header'>ALOT Code</td><td id='RouteStatus' class='ui-widget-header'>Route Status</td><td id='Status' class='ui-widget-header'>Status</td><td id='SoftEmbargoApplied' class='ui-widget-header'>Soft Embargo</td><td id='bct' class='ui-widget-header'>BCT</td><td id='mct' class='ui-widget-header'>MCT</td><td class='ui-widget-header'>Action</td></tr></thead><tbody class='ui-widget-content'>";

                            }
                            if (result.substring(1, 0) == "{") {
                                var myData = jQuery.parseJSON(result);
                                if (myData.Table0.length > 0) {

                                    for (var i = 0; i < myData.Table0.length; i++) {
                                        if (theDiv.innerHTML == "") {
                                            if (userContext.SysSetting.ICMSEnvironment == 'JT' && Action.toUpperCase() != "COPY" && Action.toUpperCase() != "UPDATE") {
                                                if ($('input:radio[name=AWBStock]:checked').val() === '0') {
                                                    if (AWBFillCarrierCode != myData.Table0[i].FlightNo.split('-')[0] && myData.Table0[i].IsInterline == 0) {
                                                        if ($("#Text_AWBAgent").data("kendoAutoComplete").value() != "" && $("#Text_AWBAgent").prop('disabled') == true) {
                                                            if ($("#Text_AWBAgent").data("kendoAutoComplete").key() == userContext.SysSetting.InterlineAgentSNo) { }
                                                            else if (userContext.AgentSNo > 0 && ($("#Text_AWBAgent").data("kendoAutoComplete").key() == userContext.AgentSNo)) { }
                                                            else {
                                                                ShowMessage('warning', 'Information!', "First Leg booking is not allowed on " + myData.Table0[i].FlightNo + " for Manual AWB Stock of " + PrefixAirlineName + ".");
                                                                return false;
                                                            }
                                                        }
                                                        else {
                                                            ShowMessage('warning', 'Information!', "First Leg booking is not allowed on " + myData.Table0[i].FlightNo + " for Manual AWB Stock of " + PrefixAirlineName + ".");
                                                            return false;
                                                        }
                                                    }
                                                }
                                            }
                                            table += "<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><input name='hdnOriginAirportSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginAirportSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginSNo + "'/><input name='hdnDestinationAirportSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationAirportSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationSNo + "'/><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + parseFloat($("#ItineraryGrossWeight").val()).toFixed(2) + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td id='Status' class='ui-widget-content first'>" + Status + "</td><td id='SoftEmbargoApplied' class='ui-widget-content first'>" + IsSoftEmbargoValue + "</td><td id='bct' class='ui-widget-content first'>" + OverrideBCT + "</td><td id='mct' class='ui-widget-content first'>" + OverrideMCT + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/><input name='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' id='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + SoftEmbargo + "'/><input name='hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "' id='hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + $("#ItineraryMainVolumeWeight").val() + "'/><input name='hdnArrFlightDate_" + myData.Table0[i].DailyflightSNo + "' id='hdnArrFlightDate_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].ArrFlightDate + "'/></td></tr>";

                                            $("#hdnETDTime").val(myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3));
                                            $("#hdnFlightDate").val(myData.Table0[i].FlightDate);
                                            $("#hdnArrFlightDate").val(myData.Table0[i].ArrFlightDate);
                                        }
                                        else {
                                            var tblSelectdRouteResult = document.getElementById("tblSelectdRouteResult");
                                            if (tblSelectdRouteResult != null && tblSelectdRouteResult.rows.length > 1) {
                                                $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                                    if ($(tr)[0].id == myData.Table0[i].DailyflightSNo) {
                                                        if ($(tr).find("td")[8].innerText.trim() == "") {
                                                            $(tr).find("td")[3].innerText = parseInt($(tr).find("td")[3].innerText.trim()) + parseInt($("#ItineraryPieces").val());
                                                            $(tr).find("td")[4].innerText = (parseFloat($(tr).find("td")[4].innerText.trim()) + parseFloat($("#ItineraryGrossWeight").val())).toFixed(2);
                                                            $(tr).find("td")[5].innerText = (parseFloat($(tr).find("td")[5].innerText.trim()) + parseFloat($("#ItineraryVolumeWeight").val())).toFixed(3);
                                                            $(tr).find("td")[8].innerText = AllotmentCode;
                                                            $("#hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "").val(AllotmentSNo);
                                                            $("#hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "").val(parseFloat($("#hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "").val() + parseFloat($("#ItineraryMainVolumeWeight").val())).toFixed(2));
                                                            Selectedflag = true;
                                                            return false;
                                                        }
                                                        else if ($(tr).find("td")[8].innerText.trim() == AllotmentCode) {
                                                            $(tr).find("td")[3].innerText = parseInt($(tr).find("td")[3].innerText.trim()) + parseInt($("#ItineraryPieces").val());
                                                            $(tr).find("td")[4].innerText = (parseFloat($(tr).find("td")[4].innerText.trim()) + parseFloat($("#ItineraryGrossWeight").val())).toFixed(2);
                                                            $(tr).find("td")[5].innerText = (parseFloat($(tr).find("td")[5].innerText.trim()) + parseFloat($("#ItineraryVolumeWeight").val())).toFixed(3);
                                                            $("#hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "").val(parseFloat(parseFloat($("#hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "").val()) + parseFloat($("#ItineraryMainVolumeWeight").val())).toFixed(2));
                                                            Selectedflag = true;
                                                            return false;
                                                        }
                                                        else {
                                                            Selectedflag = true;
                                                            FlightSearch = false;
                                                            ShowMessage('warning', 'Information!', "Different Allotment Code can not be use in same Flight.");
                                                            return false;
                                                        }
                                                    }
                                                });
                                                if (Selectedflag == false) {
                                                    var rowcountforOrigin = 0;
                                                    $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                                        if (rowcountforOrigin == 0) {
                                                            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                                                if ($(tr).find("td")[2].innerText.split("/")[0].trim() == myData.Table0[i].Origin) {
                                                                    rowcountforOrigin = parseInt(rowcountforOrigin) + parseInt(1);
                                                                }
                                                            });
                                                        }
                                                        if ($(tr).find("td")[2].innerText.split("/")[0].trim() == myData.Table0[i].Origin) {
                                                            if (row == parseInt(rowcountforOrigin)) {
                                                                $(tr).after("<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><input name='hdnOriginAirportSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginAirportSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginSNo + "'/><input name='hdnDestinationAirportSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationAirportSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationSNo + "'/><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + parseFloat($("#ItineraryGrossWeight").val()).toFixed(2) + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td id='Status' class='ui-widget-content first'>" + Status + "</td><td id='SoftEmbargoApplied' class='ui-widget-content first'>" + IsSoftEmbargoValue + "</td><td id='bct' class='ui-widget-content first'>" + OverrideBCT + "</td><td id='mct' class='ui-widget-content first'>" + OverrideMCT + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/><input name='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' id='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + SoftEmbargo + "'/><input name='hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "' id='hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + $("#ItineraryMainVolumeWeight").val() + "'/><input name='hdnArrFlightDate_" + myData.Table0[i].DailyflightSNo + "' id='hdnArrFlightDate_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].ArrFlightDate + "'/></td></tr>")

                                                                $("#hdnETDTime").val(myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3));
                                                                $("#hdnFlightDate").val(myData.Table0[i].FlightDate);
                                                                $("#hdnArrFlightDate").val(myData.Table0[i].ArrFlightDate);
                                                                Selectedflag = true;
                                                                return false;
                                                            }
                                                        }
                                                    });
                                                    if (Selectedflag == false) {
                                                        $('#tblSelectdRouteResult').append("<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><input name='hdnOriginAirportSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginAirportSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginSNo + "'/><input name='hdnDestinationAirportSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationAirportSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationSNo + "'/><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + parseFloat($("#ItineraryGrossWeight").val()).toFixed(2) + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td id='Status' class='ui-widget-content first'>" + Status + "</td><td id='SoftEmbargoApplied' class='ui-widget-content first'>" + IsSoftEmbargoValue + "</td><td id='bct' class='ui-widget-content first'>" + OverrideBCT + "</td><td id='mct' class='ui-widget-content first'>" + OverrideMCT + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/><input name='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' id='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + SoftEmbargo + "'/><input name='hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "' id='hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + $("#ItineraryMainVolumeWeight").val() + "'/><input name='hdnArrFlightDate_" + myData.Table0[i].DailyflightSNo + "' id='hdnArrFlightDate_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].ArrFlightDate + "'/></td></tr>");

                                                        $("#hdnETDTime").val(myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3));
                                                        $("#hdnFlightDate").val(myData.Table0[i].FlightDate);
                                                        $("#hdnArrFlightDate").val(myData.Table0[i].ArrFlightDate);
                                                    }
                                                }
                                            }
                                            else {
                                                if (Selectedflag == false) {
                                                    $('#tblSelectdRouteResult').append("<tr id='" + myData.Table0[i].DailyflightSNo + "'><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><input name='hdnOriginAirportSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginAirportSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginSNo + "'/><input name='hdnDestinationAirportSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationAirportSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationSNo + "'/><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + parseFloat($("#ItineraryGrossWeight").val()).toFixed(2) + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td class='ui-widget-content first'><input name='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnAllotmentSNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + AllotmentSNo + "'/>" + AllotmentCode + "</td><td id='RouteStatus' class='ui-widget-content first'>" + RouteStatus + "</td><td id='Status' class='ui-widget-content first'>" + Status + "</td><td id='SoftEmbargoApplied' class='ui-widget-content first'>" + IsSoftEmbargoValue + "</td><td id='bct' class='ui-widget-content first'>" + OverrideBCT + "</td><td id='mct' class='ui-widget-content first'>" + OverrideMCT + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_" + myData.Table0[i].DailyflightSNo + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].Origin + "\",\"" + myData.Table0[i].Destination + "\",\"" + myData.Table0[i].OriginSNo + "\",\"" + myData.Table0[i].DestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnOriginCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].OriginCitySNo + "'/><input name='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' id='hdnDestinationCitySNo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].DestinationCitySNo + "'/><input name='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' id='hdnSoftEmbargo_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + SoftEmbargo + "'/><input name='hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "' id='hdnItineraryMainVolumeWeight_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + $("#ItineraryMainVolumeWeight").val() + "'/><input name='hdnArrFlightDate_" + myData.Table0[i].DailyflightSNo + "' id='hdnArrFlightDate_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value='" + myData.Table0[i].ArrFlightDate + "'/></td></tr>");

                                                    $("#hdnETDTime").val(myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3));
                                                    $("#hdnFlightDate").val(myData.Table0[i].FlightDate);
                                                    $("#hdnArrFlightDate").val(myData.Table0[i].ArrFlightDate);
                                                }
                                            }
                                            if (FlightSearch == true)
                                                thedivFlightSearchResult.innerHTML = "";
                                        }
                                    }
                                    if (theDiv.innerHTML == "") {
                                        table += "</tbody></table>";
                                        theDiv.innerHTML += table;
                                        thedivFlightSearchResult.innerHTML = "";
                                    }
                                    window.scrollTo(0, 0);
                                    var tblSelectdRouteResultDelete = document.getElementById("tblSelectdRouteResult");
                                    if (tblSelectdRouteResultDelete != null && tblSelectdRouteResultDelete.rows.length > 2) {
                                        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                            if (row != (tblSelectdRouteResultDelete.rows.length - 2))
                                                $(tr).find("[id^='Delete_']").css("display", "none");
                                        });
                                    }
                                }
                            }
                        },
                        error: function (xhr) {
                            var a = "";
                        }
                    });
                }
                if (Action.toUpperCase() == "NEW") {
                    var IsmatchAWBOriginCity = false;
                    var IsmatchAWBDestinationCity = false;
                    var AWBOriginCitySNo = $("#Text_AWBOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBOrigin").data("kendoAutoComplete").key();
                    var AWBDestinationCitySNo = $("#Text_AWBDestination").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBDestination").data("kendoAutoComplete").key();
                    var AWBPieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
                    var AWBGrossWeight = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));
                    var AWBCBM = ($("#AWBCBM").val() == "" ? 0 : parseFloat($("#AWBCBM").val()));
                    var AWBVolumeWeight = ($("#AWBVolumeWeight").val() == "" ? 0 : parseFloat($("#AWBVolumeWeight").val()));
                    var ItineraryOrigin = $("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0];
                    var ItineraryDestination = $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0];
                    var SelectedItineraryPieces = 0;
                    var SelectedItineraryGrossWeight = 0;
                    var SelectedItineraryCBM = 0;
                    var SelectedItineraryMainVolumeWeight = 0;
                    var RemainingPieces = 0;
                    var RemainingItineraryGrossWeight = 0;
                    var RemainingItineraryCBM = 0;
                    var RemainingItineraryMainVolumeWeight = 0;
                    var table = document.getElementById("tblSelectdRouteResult");
                    if (table != null && table.rows.length > 1) {
                        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                            if (ItineraryOrigin == $(tr).find("td")[2].innerText.split("/")[0].trim() && ItineraryDestination == $(tr).find("td")[2].innerText.split("/")[1].trim()) {
                                SelectedItineraryPieces = parseInt(SelectedItineraryPieces) + parseInt($(tr).find("td")[3].innerText.trim());
                                SelectedItineraryGrossWeight = parseFloat(SelectedItineraryGrossWeight) + parseFloat($(tr).find("td")[4].innerText.trim());
                                SelectedItineraryCBM = parseFloat(SelectedItineraryCBM) + parseFloat($(tr).find("td")[5].innerText.trim());
                                SelectedItineraryMainVolumeWeight = parseFloat(parseFloat(SelectedItineraryMainVolumeWeight) + parseFloat($(tr).find("input[id^='hdnItineraryMainVolumeWeight_']").val())).toFixed(2);
                            }
                            if (AWBOriginCitySNo == $(tr).find("input[id^='hdnOriginCitySNo_']").val()) {
                                IsmatchAWBOriginCity = true;
                            }
                            if (AWBDestinationCitySNo == $(tr).find("input[id^='hdnDestinationCitySNo_']").val()) {
                                IsmatchAWBDestinationCity = true;
                            }
                        });
                    }
                    RemainingPieces = parseInt(AWBPieces) - parseInt(SelectedItineraryPieces);
                    RemainingItineraryGrossWeight = (parseFloat(AWBGrossWeight) - parseFloat(SelectedItineraryGrossWeight)).toFixed(2);
                    RemainingItineraryCBM = (parseFloat(AWBCBM) - parseFloat(SelectedItineraryCBM)).toFixed(3);
                    RemainingItineraryMainVolumeWeight = (parseFloat(AWBVolumeWeight) - parseFloat(SelectedItineraryMainVolumeWeight)).toFixed(2);
                    if (SelectedItineraryPieces < AWBPieces) {
                        $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(false)
                        $("#Text_ItineraryDestination").data("kendoAutoComplete").enable(false)
                        $("#ItineraryPieces").val(RemainingPieces == 0 ? '' : RemainingPieces)
                        $("#_tempItineraryPieces").val(RemainingPieces == 0 ? '' : RemainingPieces)

                        $("#ItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? '' : RemainingItineraryGrossWeight)
                        $("#_tempItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? '' : RemainingItineraryGrossWeight)
                        $("#ItineraryVolumeWeight").val(RemainingItineraryCBM == 0.000 ? '' : RemainingItineraryCBM)
                        $("#_tempItineraryVolumeWeight").val(RemainingItineraryCBM == 0.000 ? '' : RemainingItineraryCBM)
                        $("#ItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? '' : RemainingItineraryMainVolumeWeight)
                        $("#_tempItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? '' : RemainingItineraryMainVolumeWeight)
                    }
                    else {
                        if (IsmatchAWBOriginCity = true && IsmatchAWBDestinationCity == true) {
                            $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(true);
                            $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue('', '');
                            $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue('', '');

                            $("#ItineraryPieces").val('')
                            $("#_tempItineraryPieces").val('')
                            $("#ItineraryGrossWeight").val('')
                            $("#_tempItineraryGrossWeight").val('')
                            $("#ItineraryVolumeWeight").val('')
                            $("#_tempItineraryVolumeWeight").val('')
                            $("#ItineraryMainVolumeWeight").val('')
                            $("#_tempItineraryMainVolumeWeight").val('')

                            var FlightDateForRateSearch = "";
                            var FlightNoForRateSearch = "";
                            var AllotmentCODEForRateSearch = "";





                            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                if (row == 0)
                                    FlightDateForRateSearch = $(tr).find("td")[1].innerText.trim();
                                FlightNoForRateSearch += $(tr).find("td")[0].innerText.trim() + ',';
                                if ($(tr).find("td")[8].innerText.trim() != '')
                                    AllotmentCODEForRateSearch += $(tr).find("td")[0].innerText.trim() + '~' + $(tr).find("td")[8].innerText.trim() + '~' + $(tr)[0].id.trim() + ',';
                            });
                            if (FlightNoForRateSearch != "")
                                FlightNoForRateSearch = FlightNoForRateSearch.substring(0, FlightNoForRateSearch.length - 1);
                            if (AllotmentCODEForRateSearch != "")
                                AllotmentCODEForRateSearch = AllotmentCODEForRateSearch.substring(0, AllotmentCODEForRateSearch.length - 1);
                            var RateAvailableNEW = RateAvailableOrNotNEW(FlightDateForRateSearch, FlightNoForRateSearch, AllotmentCODEForRateSearch);
                            if (RateAvailableNEW != true) {
                                ClearItineraryRoute();
                                ShowMessage('warning', 'Information!', "Rate Not Available for Booking.");
                            }
                        }
                        else if (IsmatchAWBOriginCity = true && IsmatchAWBDestinationCity == false) {
                            $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue($("#Text_ItineraryDestination").data("kendoAutoComplete").key(), $("#Text_ItineraryDestination").data("kendoAutoComplete").value());
                            $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue('', '');
                            $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(false);

                            $("#ItineraryPieces").val(RemainingPieces == 0 ? AWBPieces : RemainingPieces)
                            $("#_tempItineraryPieces").val(RemainingPieces == 0 ? AWBPieces : RemainingPieces)
                            $("#ItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? AWBGrossWeight : RemainingItineraryGrossWeight)
                            $("#_tempItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? AWBGrossWeight : RemainingItineraryGrossWeight)
                            $("#ItineraryVolumeWeight").val(RemainingItineraryCBM == 0.000 ? AWBCBM : RemainingItineraryCBM)
                            $("#_tempItineraryVolumeWeight").val(RemainingItineraryCBM == 0.000 ? AWBCBM : RemainingItineraryCBM)
                            $("#ItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? AWBVolumeWeight : RemainingItineraryMainVolumeWeight)
                            $("#_tempItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? AWBVolumeWeight : RemainingItineraryMainVolumeWeight)
                        }
                        else {
                            $("#ItineraryPieces").val(RemainingPieces == 0 ? AWBPieces : RemainingPieces)
                            $("#_tempItineraryPieces").val(RemainingPieces == 0 ? AWBPieces : RemainingPieces)
                            $("#ItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? AWBGrossWeight : RemainingItineraryGrossWeight)
                            $("#_tempItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? AWBGrossWeight : RemainingItineraryGrossWeight)
                            $("#ItineraryVolumeWeight").val(RemainingItineraryCBM == 0.000 ? AWBCBM : RemainingItineraryCBM)
                            $("#_tempItineraryVolumeWeight").val(RemainingItineraryCBM == 0.000 ? AWBCBM : RemainingItineraryCBM)
                            $("#ItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? AWBVolumeWeight : RemainingItineraryMainVolumeWeight)
                            $("#_tempItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? AWBVolumeWeight : RemainingItineraryMainVolumeWeight)
                        }
                        $("#Text_ItineraryDestination").data("kendoAutoComplete").enable(true)

                    }


                }
                if (Action.toUpperCase() == "NEW" || Action.toUpperCase() == "COPY") {
                    var tableSelected = document.getElementById("tblSelectdRouteResult");
                    if (tableSelected != null && tableSelected.rows.length > 1) {
                        $('#tblSelectdRouteResult  tr').each(function (row, tr) {
                            $(tr).find("[id^='RouteStatus']").css("display", "none");
                            $(tr).find("[id^='Status']").css("display", "none");
                            $(tr).find("[id^='SoftEmbargoApplied']").css("display", "none");
                        });
                    }
                }
                if (Action.toUpperCase() != "NEW") {
                    $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue('', '');
                    $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue('', '');
                    $("#ItineraryPieces").val('')
                    $("#_tempItineraryPieces").val('')
                    $("#ItineraryGrossWeight").val('')
                    $("#_tempItineraryGrossWeight").val('')
                    $("#ItineraryVolumeWeight").val('')
                    $("#_tempItineraryVolumeWeight").val('')
                    $("#ItineraryMainVolumeWeight").val('')
                    $("#_tempItineraryMainVolumeWeight").val('')
                }
            }
        }
    }
}

function getFlightNo(FlightSNo, i) {
    $.ajax({
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: SiteUrl + "Services/Common/CommonService.svc/GetFlightNo?FlightSNo=" + FlightSNo,
        success: function (result) {
            if (i == "0") {

                // OldFlightNo += "/" + result;
                sessionStorage.setItem("OldFlightNo", result)  // getItem("OldRateRefCode");
            }
            else {


                // NewFlightNo += "/" + result;
                sessionStorage.setItem("NewFlightNo", result)
            }

        }
    });
}
function ClearItineraryRoute(obj) {
    var theDiv = document.getElementById("divFinalSelectedroute");
    theDiv.innerHTML = "";
    var theDiv1 = document.getElementById("divFlightSearchResult");
    theDiv1.innerHTML = "";
    cfi.ResetAutoComplete("ItineraryOrigin");
    cfi.ResetAutoComplete("ItineraryDestination");
    $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(true);
    $("#Text_ItineraryDestination").data("kendoAutoComplete").enable(true);
    $("#Text_AWBDestination").data("kendoAutoComplete").enable(true);
    $("#hdnETDTime").val('00:00');
    $("#hdnFlightDate").val('');
    $("#hdnArrFlightDate").val('');
    var AWBPieces = ($("#AWBPieces").val() == "" ? "" : parseFloat($("#AWBPieces").val()));
    var AWBGrossWeight = ($("#AWBGrossWeight").val() == "" ? "" : parseFloat($("#AWBGrossWeight").val()));
    var AWBCBM = ($("#AWBCBM").val() == "" ? "" : parseFloat($("#AWBCBM").val()));
    var AWBVolumeWeight = ($("#AWBVolumeWeight").val() == "" ? "" : parseFloat($("#AWBVolumeWeight").val()));
    //$("#ItinerarySearch").attr('disabled', false);
    $("#ItineraryPieces").val(AWBPieces);
    $("#_tempItineraryPieces").val(AWBPieces);
    $("#ItineraryGrossWeight").val(AWBGrossWeight);
    $("#_tempItineraryGrossWeight").val(AWBGrossWeight);
    $("#ItineraryVolumeWeight").val(AWBCBM);
    $("#_tempItineraryVolumeWeight").val(AWBCBM);
    $("#ItineraryMainVolumeWeight").val(AWBVolumeWeight)
    $("#_tempItineraryMainVolumeWeight").val(AWBVolumeWeight)
    //if (userContext.SysSetting.ICMSEnvironment == 'JT') {
    //    $("#Text_AWBOrigin").data("kendoAutoComplete").setDefaultValue(userContext.CitySNo, userContext.CityCode + '-' + userContext.CityName);
    //    $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue(userContext.AirportSNo, userContext.AirportCode + '-' + userContext.AirportName);
    //    SelectedAWBOriginDestinationItineary('Text_AWBDestination');
    //}
    //else
    //{
    SelectedAWBOriginDestinationItineary('Text_AWBOrigin');
    SelectedAWBOriginDestinationItineary('Text_AWBDestination');
    //}
    if (!obj)
        window.scrollTo(0, 0);
}
function SearchFlight() {
    if (cfi.IsValidSection("ApplicationTabs-1")) {
        if (true) {
            var theDivSearch = document.getElementById("divFlightSearchResult");
            theDivSearch.innerHTML = "";
            //if ($("#hdnIsItineraryCarrierCodeInterline").val() == "0") {
                var RateAvailable =  RateAvailableOrNot();
                if (RateAvailable != true) {
            //        if (kendo.parseFloat($("#ItineraryOrigin").val()) > 0 && kendo.parseFloat($("#ItineraryDestination").val()) > 0 && $("#ItineraryDate").val() != '') {
            //            var result = IsInternationalBookingAgent($("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ItineraryOrigin").data("kendoAutoComplete").key(), $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ItineraryDestination").data("kendoAutoComplete").key());
            //            if (result == true) {
            //                if (kendo.parseFloat($("#ItineraryPieces").val()) > 0 && kendo.parseFloat($("#ItineraryGrossWeight").val()) > 0 && kendo.parseFloat($("#ItineraryVolumeWeight").val()) > 0) {
            //                    SearchFlightMode("SearchFlight");
            //                }
            //                else
            //                    ShowMessage('warning', 'Information!', "Enter Pieces, Gross Weight and Volume (CBM) for Search Flight.");
            //            }
            //        }
            //        else
            //            ShowMessage('warning', 'Information!', "Select Origin Airport, Destination Airport and Date for Search Flight.");

            //        //else
            //        //    ShowMessage('warning', 'Information!', "Agent Booking not allow for given Origin Destination Pair.");
            //    }
            //    else
                    ShowMessage('warning', 'Information!', "Rate Not Available for Booking.");
            }
                else {
            if (kendo.parseFloat($("#ItineraryOrigin").val()) > 0 && kendo.parseFloat($("#ItineraryDestination").val()) > 0 && $("#ItineraryDate").val() != '') {
                if (kendo.parseFloat($("#ItineraryPieces").val()) > 0 && kendo.parseFloat($("#ItineraryGrossWeight").val()) > 0 && kendo.parseFloat($("#ItineraryVolumeWeight").val()) > 0) {
                    if (($("#ItineraryInterlineFlightNo").val() == "" ? $("#ItineraryFlightNo").val() : $("#ItineraryInterlineFlightNo").val()) != "") {
                        //   if ($("#ItineraryInterlineFlightNo").val() != "") {
                        if ($("#ItineraryCarrierCode").val() != "") {
                            //   if ($("#ItineraryInterlineFlightNo").val() != "" && $("#hdnIsItineraryCarrierCodeInterline").val() == "1") {
                            //     if ($("#ItineraryInterlineFlightNo").val() != "" && $("#hdnIsItineraryCarrierCodeInterline").val() == "1") {
                            var SearchFlightValid = true;
                            if ($("#hdnFlightDate").val() != "" && $("#ItineraryDate").val() != "") {
                                var month = { "JAN": "01", "FEB": "02", "MAR": "03", "APR": "04", "MAY": "05", "JUN": "06", "JUL": "07", "AUG": "08", "SEP": "09", "OCT": "10", "NOV": "11", "DEC": "12" };

                                var date = $("#hdnFlightDate").val();
                                var Selecteddate_components = date.split("-");
                                var Selectedcurrent_day = Selecteddate_components[0];
                                var Selectedcurrent_month = month[Selecteddate_components[1].toString().toUpperCase()];
                                var Selectedcurrent_year = Selecteddate_components[2];
                                SelectedDateValue = Selectedcurrent_year + "-" + Selectedcurrent_month + "-" + Selectedcurrent_day;
                                var SelectedDate = new Date(SelectedDateValue);

                                var Date1 = $("#ItineraryDate").val();
                                var Previousdate_components = Date1.split("-");
                                var Previouscurrent_day = Previousdate_components[0];
                                var Previouscurrent_month = month[Previousdate_components[1].toString().toUpperCase()];
                                var Previouscurrent_year = Previousdate_components[2];
                                PreviousDateValue = Previouscurrent_year + "-" + Previouscurrent_month + "-" + Previouscurrent_day;
                                var ItineraryDate = new Date(PreviousDateValue);

                                if (ItineraryDate < SelectedDate) {
                                    ShowMessage('warning', 'Information!', "Itinerary Flight Date can not be less than Selected Date .");
                                    SearchFlightValid = false;
                                }
                            }
                            if (SearchFlightValid == true) {

                                var ItineraryOrigin = $("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0];
                                var ItineraryDestination = $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0];
                                var ItineraryOriginSNo = $("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ItineraryOrigin").data("kendoAutoComplete").key();
                                var ItineraryDestinationSNo = $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ItineraryDestination").data("kendoAutoComplete").key();
                                var ItineraryOriginCitySNo = 0;
                                var ItineraryDestinationCitySNo = 0;
                                $.ajax({
                                    url: "Services/Shipment/BackDateBookingService.svc/GETCitySNofromItinerary",
                                    async: false,
                                    type: "GET",
                                    dataType: "json",
                                    data: {
                                        ItineraryOriginSNo: ItineraryOriginSNo,
                                        ItineraryDestinationSNo: ItineraryDestinationSNo,
                                    },
                                    contentType: "application/json; charset=utf-8", cache: false,
                                    success: function (result) {
                                        if (result.substring(1, 0) == "{") {
                                            var myData = jQuery.parseJSON(result);
                                            if (myData.Table0.length > 0) {
                                                ItineraryOriginCitySNo = myData.Table0[0].OriginCitySNo;
                                                ItineraryDestinationCitySNo = myData.Table0[0].DestinationCitySNo;
                                            }
                                        }
                                    },
                                    error: function (xhr) {
                                        var a = "";
                                    }
                                });
                                var theDiv = document.getElementById("divFinalSelectedroute");
                                var table = "";
                                if (theDiv.innerHTML == "") {
                                    table = "</br><table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='8'>Flight Itinerary : </td></tr></table><table class='appendGrid ui-widget' id='tblSelectdRouteResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight No.</td><td class='ui-widget-header'>Date</td><td class='ui-widget-header'>O/D</td><td class='ui-widget-header'>Pieces</td><td class='ui-widget-header'>Gr. Wt.</td><td class='ui-widget-header'>Vol.(CBM)</td><td class='ui-widget-header'>Action</td></tr></thead><tbody class='ui-widget-content'>";
                                }
                                if (theDiv.innerHTML == "") {
                                    table += "<tr id='Interline_0'><td class='ui-widget-content first'>" + ($("#ItineraryInterlineFlightNo").val() == "" ? $("#ItineraryFlightNo").val() : $("#ItineraryCarrierCode").val() + "-" + $("#ItineraryInterlineFlightNo").val()).toUpperCase() + "</td><td class='ui-widget-content first'>" + $("#ItineraryDate").val() + "</td><td class='ui-widget-content first'>" + ItineraryOrigin + "/" + ItineraryDestination + "</td><input name='hdnOriginAirportSNo_Interline_0' id='hdnOriginAirportSNo_Interline_0' type='hidden' value='" + ItineraryOriginSNo + "'/><input name='hdnDestinationAirportSNo_Interline_0' id='hdnDestinationAirportSNo_Interline_0' type='hidden' value='" + ItineraryDestinationSNo + "'/><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + parseFloat($("#ItineraryGrossWeight").val()).toFixed(2) + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_Interline_0' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"Interline_0\",\"" + ItineraryOrigin + "\",\"" + ItineraryDestination + "\",\"" + ItineraryOriginSNo + "\",\"" + ItineraryDestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_Interline_0' id='hdnOriginCitySNo_Interline_0' type='hidden' value='" + ItineraryOriginCitySNo + "'/><input name='hdnDestinationCitySNo_Interline_0' id='hdnDestinationCitySNo_Interline_0' type='hidden' value='" + ItineraryDestinationCitySNo + "'/><input name='hdnSoftEmbargo_Interline_0' id='hdnSoftEmbargo_Interline_0' type='hidden' value=''/><input name='hdnItineraryMainVolumeWeight_Interline_0' id='hdnItineraryMainVolumeWeight_Interline_0' type='hidden' value='" + $("#ItineraryMainVolumeWeight").val() + "'/><input name='hdnArrFlightDate_Interline_0' id='hdnArrFlightDate_Interline_0' type='hidden' value='" + $("#ItineraryDate").val() + "'/></td></tr>";
                                    $("#hdnETDTime").val('00:00');
                                    $("#hdnFlightDate").val($("#ItineraryDate").val());
                                    $("#hdnArrFlightDate").val($("#ItineraryDate").val());
                                }
                                else {
                                    var tableroute = document.getElementById("tblSelectdRouteResult");
                                    var RowID = tableroute.rows.length - 1;
                                    $('#tblSelectdRouteResult').append("<tr id='Interline_" + RowID + "'><td class='ui-widget-content first'>" + ($("#ItineraryInterlineFlightNo").val() == "" ? $("#ItineraryFlightNo").val() : $("#ItineraryCarrierCode").val() + "-" + $("#ItineraryInterlineFlightNo").val()).toUpperCase() + "</td><td class='ui-widget-content first'>" + $("#ItineraryDate").val() + "</td><td class='ui-widget-content first'>" + ItineraryOrigin + "/" + ItineraryDestination + "</td><input name='hdnOriginAirportSNo_Interline_" + RowID + "' id='hdnOriginAirportSNo_Interline_" + RowID + "' type='hidden' value='" + ItineraryOriginSNo + "'/><input name='hdnDestinationAirportSNo_Interline_" + RowID + "' id='hdnDestinationAirportSNo_Interline_" + RowID + "' type='hidden' value='" + ItineraryDestinationSNo + "'/><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + parseFloat($("#ItineraryGrossWeight").val()).toFixed(2) + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_Interline_" + RowID + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"Interline_" + RowID + "\",\"" + ItineraryOrigin + "\",\"" + ItineraryDestination + "\",\"" + ItineraryOriginSNo + "\",\"" + ItineraryDestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_Interline_" + RowID + "' id='hdnOriginCitySNo_Interline_" + RowID + "' type='hidden' value='" + ItineraryOriginCitySNo + "'/><input name='hdnDestinationCitySNo_Interline_" + RowID + "' id='hdnDestinationCitySNo_Interline_" + RowID + "' type='hidden' value='" + ItineraryDestinationCitySNo + "'/><input name='hdnSoftEmbargo_Interline_" + RowID + "' id='hdnSoftEmbargo_Interline_" + RowID + "' type='hidden' value=''/><input name='hdnItineraryMainVolumeWeight_Interline_" + RowID + "' id='hdnItineraryMainVolumeWeight_Interline_" + RowID + "' type='hidden' value='" + $("#ItineraryMainVolumeWeight").val() + "'/><input name='hdnArrFlightDate_Interline_" + RowID + "' id='hdnArrFlightDate_Interline_" + RowID + "' type='hidden' value='" + $("#ItineraryDate").val() + "'/></td></tr>");
                                    $("#hdnETDTime").val('00:00');
                                    $("#hdnFlightDate").val($("#ItineraryDate").val());
                                    $("#hdnArrFlightDate").val($("#ItineraryDate").val());
                                }
                                if (theDiv.innerHTML == "") {
                                    table += "</tbody></table>";
                                    theDiv.innerHTML += table;
                                }
                                var tblSelectdRouteResultDelete = document.getElementById("tblSelectdRouteResult");
                                if (tblSelectdRouteResultDelete != null && tblSelectdRouteResultDelete.rows.length > 2) {
                                    $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                        if (row != (tblSelectdRouteResultDelete.rows.length - 2))
                                            $(tr).find("[id^='Delete_']").css("display", "none");
                                    });
                                }



                                var IsmatchAWBOriginCity = false;
                                var IsmatchAWBDestinationCity = false;
                                var AWBOriginCitySNo = $("#Text_AWBOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBOrigin").data("kendoAutoComplete").key();
                                var AWBDestinationCitySNo = $("#Text_AWBDestination").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBDestination").data("kendoAutoComplete").key();
                                var AWBPieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
                                var AWBGrossWeight = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));
                                var AWBCBM = ($("#AWBCBM").val() == "" ? 0 : parseFloat($("#AWBCBM").val()));
                                var AWBVolumeWeight = ($("#AWBVolumeWeight").val() == "" ? 0 : parseFloat($("#AWBVolumeWeight").val()));

                                var SelectedItineraryPieces = 0;
                                var SelectedItineraryGrossWeight = 0;
                                var SelectedCBM = 0;
                                var SelectedItineraryMainVolumeWeight = 0;
                                var RemainingPieces = 0;
                                var RemainingItineraryGrossWeight = 0;
                                var RemainingCBM = 0;
                                var RemainingItineraryMainVolumeWeight = 0;
                                var table = document.getElementById("tblSelectdRouteResult");
                                if (table != null && table.rows.length > 1) {
                                    $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                        if (ItineraryOrigin == $(tr).find("td")[2].innerText.split("/")[0] && ItineraryDestination == $(tr).find("td")[2].innerText.split("/")[1]) {
                                            SelectedItineraryPieces = parseInt(SelectedItineraryPieces) + parseInt($(tr).find("td")[3].innerText);
                                            SelectedItineraryGrossWeight = parseFloat(SelectedItineraryGrossWeight) + parseFloat($(tr).find("td")[4].innerText);
                                            SelectedCBM = parseFloat(SelectedCBM) + parseFloat($(tr).find("td")[5].innerText);
                                            SelectedItineraryMainVolumeWeight = parseFloat(parseFloat(SelectedItineraryMainVolumeWeight) + parseFloat($(tr).find("input[id^='hdnItineraryMainVolumeWeight_']").val())).toFixed(2);
                                        }
                                        if (AWBOriginCitySNo == $(tr).find("input[id^='hdnOriginCitySNo_']").val()) {
                                            IsmatchAWBOriginCity = true;
                                        }
                                        if (AWBDestinationCitySNo == $(tr).find("input[id^='hdnDestinationCitySNo_']").val()) {
                                            IsmatchAWBDestinationCity = true;
                                        }
                                    });
                                }
                                RemainingPieces = parseInt(AWBPieces) - parseInt(SelectedItineraryPieces);
                                RemainingItineraryGrossWeight = (parseFloat(AWBGrossWeight) - parseFloat(SelectedItineraryGrossWeight)).toFixed(2);
                                RemainingCBM = (parseFloat(AWBCBM) - parseFloat(SelectedCBM)).toFixed(3);
                                RemainingItineraryMainVolumeWeight = (parseFloat(AWBVolumeWeight) - parseFloat(SelectedItineraryMainVolumeWeight)).toFixed(2);
                                if (SelectedItineraryPieces < AWBPieces) {
                                    $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(false)
                                    $("#Text_ItineraryDestination").data("kendoAutoComplete").enable(false)
                                    $("#ItineraryPieces").val(RemainingPieces == 0 ? '' : RemainingPieces)
                                    $("#_tempItineraryPieces").val(RemainingPieces == 0 ? '' : RemainingPieces)

                                    $("#ItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? '' : RemainingItineraryGrossWeight)
                                    $("#_tempItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? '' : RemainingItineraryGrossWeight)
                                    $("#ItineraryVolumeWeight").val(RemainingCBM == 0.000 ? '' : RemainingCBM)
                                    $("#_tempItineraryVolumeWeight").val(RemainingCBM == 0.000 ? '' : RemainingCBM)
                                    $("#ItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? '' : RemainingItineraryMainVolumeWeight)
                                    $("#_tempItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? '' : RemainingItineraryMainVolumeWeight)
                                }
                                else {
                                    if (IsmatchAWBOriginCity = true && IsmatchAWBDestinationCity == true) {
                                        $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(true);
                                        $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue('', '');
                                        $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue('', '');

                                        $("#ItineraryPieces").val('');
                                        $("#_tempItineraryPieces").val('');
                                        $("#ItineraryGrossWeight").val('');
                                        $("#_tempItineraryGrossWeight").val('');
                                        $("#ItineraryVolumeWeight").val('');
                                        $("#_tempItineraryVolumeWeight").val('');
                                        $("#ItineraryMainVolumeWeight").val('');
                                        $("#_tempItineraryMainVolumeWeight").val('');


                                        var FlightDateForRateSearch = "";
                                        var FlightNoForRateSearch = "";
                                        var AllotmentCODEForRateSearch = "";


                                        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                            if (row == 0)
                                                FlightDateForRateSearch = $(tr).find("td")[1].innerText;
                                            FlightNoForRateSearch += $(tr).find("td")[0].innerText + ',';
                                            //if ($(tr).find("td")[8].innerText != '')
                                            //    AllotmentCODEForRateSearch += $(tr).find("td")[0].innerText + '~' + $(tr).find("td")[8].innerText + '~' + $(tr)[0].id + ',';
                                        });
                                        if (FlightNoForRateSearch != "")
                                            FlightNoForRateSearch = FlightNoForRateSearch.substring(0, FlightNoForRateSearch.length - 1);
                                        if (AllotmentCODEForRateSearch != "")
                                            AllotmentCODEForRateSearch = AllotmentCODEForRateSearch.substring(0, AllotmentCODEForRateSearch.length - 1);
                                        //var RateAvailableNEW = RateAvailableOrNotNEW(FlightDateForRateSearch, FlightNoForRateSearch, AllotmentCODEForRateSearch);
                                        //if (RateAvailableNEW != true) {
                                        //    ClearItineraryRoute();
                                        //    ShowMessage('warning', 'Information!', "Rate Not Available for Booking.");
                                        //}
                                    }
                                    else if (IsmatchAWBOriginCity = true && IsmatchAWBDestinationCity == false) {
                                        $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue($("#Text_ItineraryDestination").data("kendoAutoComplete").key(), $("#Text_ItineraryDestination").data("kendoAutoComplete").value());
                                        $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue('', '');
                                        $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(false);

                                        $("#ItineraryPieces").val(RemainingPieces == 0 ? AWBPieces : RemainingPieces)
                                        $("#_tempItineraryPieces").val(RemainingPieces == 0 ? AWBPieces : RemainingPieces)
                                        $("#ItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? AWBGrossWeight : RemainingItineraryGrossWeight)
                                        $("#_tempItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? AWBGrossWeight : RemainingItineraryGrossWeight)
                                        $("#ItineraryVolumeWeight").val(RemainingCBM == 0.000 ? AWBCBM : RemainingCBM)
                                        $("#_tempItineraryVolumeWeight").val(RemainingCBM == 0.000 ? AWBCBM : RemainingCBM)
                                        $("#ItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? AWBVolumeWeight : RemainingItineraryMainVolumeWeight)
                                        $("#_tempItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? AWBVolumeWeight : RemainingItineraryMainVolumeWeight)
                                    }
                                    else {
                                        $("#ItineraryPieces").val(RemainingPieces == 0 ? AWBPieces : RemainingPieces)
                                        $("#_tempItineraryPieces").val(RemainingPieces == 0 ? AWBPieces : RemainingPieces)
                                        $("#ItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? AWBGrossWeight : RemainingItineraryGrossWeight)
                                        $("#_tempItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? AWBGrossWeight : RemainingItineraryGrossWeight)
                                        $("#ItineraryVolumeWeight").val(RemainingCBM == 0.000 ? AWBCBM : RemainingCBM)
                                        $("#_tempItineraryVolumeWeight").val(RemainingCBM == 0.000 ? AWBCBM : RemainingCBM)
                                        $("#ItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? AWBVolumeWeight : RemainingItineraryMainVolumeWeight)
                                        $("#_tempItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? AWBVolumeWeight : RemainingItineraryMainVolumeWeight)
                                    }
                                    $("#Text_ItineraryDestination").data("kendoAutoComplete").enable(true)

                                }


                                //if (Action.toUpperCase() == "NEW") {
                                var tableSelected = document.getElementById("tblSelectdRouteResult");
                                if (tableSelected != null && tableSelected.rows.length > 1) {
                                    $('#tblSelectdRouteResult  tr').each(function (row, tr) {
                                        //   $(tr).find("[id^='RouteStatus']").css("display", "none");
                                        // $(tr).find("[id^='Status']").css("display", "none");
                                        //   $(tr).find("[id^='SoftEmbargoApplied']").css("display", "none");
                                    });
                                }
                                //}

                            }
                            // }
                        }
                        else
                            ShowMessage('warning', 'Information!', "Enter Carrier Code.");
                    }
                    else
                        ShowMessage('warning', 'Information!', "Enter Flight No.");
                }
                else
                    ShowMessage('warning', 'Information!', "Enter Pieces, Gross Weight and Volume (CBM) for Search Flight.");
            }
            else
                ShowMessage('warning', 'Information!', "Select Origin Airport, Destination Airport and Date for Search Flight.");
             }
        }
    }

}
//function SearchFlight() {
//    if (cfi.IsValidSection("ApplicationTabs-1")) {
//        if (true) {
//            var theDivSearch = document.getElementById("divFlightSearchResult");
//            theDivSearch.innerHTML = "";
//            //if ($("#hdnIsItineraryCarrierCodeInterline").val() == "0") {
//            //    var RateAvailable = true; // RateAvailableOrNot();
//            //    if (RateAvailable == true) {
//            //        if (kendo.parseFloat($("#ItineraryOrigin").val()) > 0 && kendo.parseFloat($("#ItineraryDestination").val()) > 0 && $("#ItineraryDate").val() != '') {
//            //            var result = IsInternationalBookingAgent($("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ItineraryOrigin").data("kendoAutoComplete").key(), $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ItineraryDestination").data("kendoAutoComplete").key());
//            //            if (result == true) {
//            //                if (kendo.parseFloat($("#ItineraryPieces").val()) > 0 && kendo.parseFloat($("#ItineraryGrossWeight").val()) > 0 && kendo.parseFloat($("#ItineraryVolumeWeight").val()) > 0) {

//            //                    SearchFlightMode("SearchFlight");
//            //                }
//            //                else
//            //                    ShowMessage('warning', 'Information!', "Enter Pieces, Gross Weight and Volume (CBM) for Search Flight.");
//            //            }
//            //        }
//            //        else
//            //            ShowMessage('warning', 'Information!', "Select Origin Airport, Destination Airport and Date for Search Flight.");

//            //        //else
//            //        //    ShowMessage('warning', 'Information!', "Agent Booking not allow for given Origin Destination Pair.");
//            //    }
//            //    else
//            //        ShowMessage('warning', 'Information!', "Rate Not Available for Booking.");
//            //}
//          //  else {
//                if (kendo.parseFloat($("#ItineraryOrigin").val()) > 0 && kendo.parseFloat($("#ItineraryDestination").val()) > 0 && $("#ItineraryDate").val() != '') {
//                    if (kendo.parseFloat($("#ItineraryPieces").val()) > 0 && kendo.parseFloat($("#ItineraryGrossWeight").val()) > 0 && kendo.parseFloat($("#ItineraryVolumeWeight").val()) > 0) {
//                        if ($("#ItineraryFlightNo").val() != "") {
//                         //   if ($("#ItineraryCarrierCode").val() != "") {
//                              //  if ($("#ItineraryInterlineFlightNo").val() != "" && $("#hdnIsItineraryCarrierCodeInterline").val() == "1") {
//                                    var SearchFlightValid = true;
//                                    if ($("#hdnFlightDate").val() != "" && $("#ItineraryDate").val() != "") {
//                                        var month = { "JAN": "01", "FEB": "02", "MAR": "03", "APR": "04", "MAY": "05", "JUN": "06", "JUL": "07", "AUG": "08", "SEP": "09", "OCT": "10", "NOV": "11", "DEC": "12" };

//                                        var date = $("#hdnFlightDate").val();
//                                        var Selecteddate_components = date.split("-");
//                                        var Selectedcurrent_day = Selecteddate_components[0];
//                                        var Selectedcurrent_month = month[Selecteddate_components[1].toString().toUpperCase()];
//                                        var Selectedcurrent_year = Selecteddate_components[2];
//                                        SelectedDateValue = Selectedcurrent_year + "-" + Selectedcurrent_month + "-" + Selectedcurrent_day;
//                                        var SelectedDate = new Date(SelectedDateValue);

//                                        var Date1 = $("#ItineraryDate").val();
//                                        var Previousdate_components = Date1.split("-");
//                                        var Previouscurrent_day = Previousdate_components[0];
//                                        var Previouscurrent_month = month[Previousdate_components[1].toString().toUpperCase()];
//                                        var Previouscurrent_year = Previousdate_components[2];
//                                        PreviousDateValue = Previouscurrent_year + "-" + Previouscurrent_month + "-" + Previouscurrent_day;
//                                        var ItineraryDate = new Date(PreviousDateValue);

//                                        if (ItineraryDate < SelectedDate) {
//                                            ShowMessage('warning', 'Information!', "Itinerary Flight Date can not be less than Selected Date .");
//                                            SearchFlightValid = false;
//                                        }
//                                    }
//                                    if (SearchFlightValid == true) {

//                                        var ItineraryOrigin = $("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0];
//                                        var ItineraryDestination = $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0];
//                                        var ItineraryOriginSNo = $("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ItineraryOrigin").data("kendoAutoComplete").key();
//                                        var ItineraryDestinationSNo = $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ItineraryDestination").data("kendoAutoComplete").key();
//                                        var ItineraryOriginCitySNo = 0;
//                                        var ItineraryDestinationCitySNo = 0;
//                                        $.ajax({
//                                            url: "Services/Report/NonExecutedBookingService.svc/GETCitySNofromItinerary",
//                                            async: false,
//                                            type: "GET",
//                                            dataType: "json",
//                                            data: {
//                                                ItineraryOriginSNo: ItineraryOriginSNo,
//                                                ItineraryDestinationSNo: ItineraryDestinationSNo,
//                                            },
//                                            contentType: "application/json; charset=utf-8", cache: false,
//                                            success: function (result) {
//                                                if (result.substring(1, 0) == "{") {
//                                                    var myData = jQuery.parseJSON(result);
//                                                    if (myData.Table0.length > 0) {
//                                                        ItineraryOriginCitySNo = myData.Table0[0].OriginCitySNo;
//                                                        ItineraryDestinationCitySNo = myData.Table0[0].DestinationCitySNo;
//                                                    }
//                                                }
//                                            },
//                                            error: function (xhr) {
//                                                var a = "";
//                                            }
//                                        });
//                                        var theDiv = document.getElementById("divFinalSelectedroute");
//                                        var table = "";
//                                        if (theDiv.innerHTML == "") {
//                                            table = "</br><table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='8'>Flight Itinerary : </td></tr></table><table class='appendGrid ui-widget' id='tblSelectdRouteResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight No.</td><td class='ui-widget-header'>Date</td><td class='ui-widget-header'>O/D</td><td class='ui-widget-header'>Pieces</td><td class='ui-widget-header'>Gr. Wt.</td><td class='ui-widget-header'>Vol.(CBM)</td><td class='ui-widget-header'>STD/STA</td><td class='ui-widget-header'>A/C Type</td><td class='ui-widget-header'>ALOT Code</td><td id='RouteStatus' class='ui-widget-header'>Route Status</td><td id='Status' class='ui-widget-header'>Status</td><td id='SoftEmbargoApplied' class='ui-widget-header'>Soft Embargo</td><td id='bct' class='ui-widget-header'>BCT</td><td id='mct' class='ui-widget-header'>MCT</td><td class='ui-widget-header'>Action</td></tr></thead><tbody class='ui-widget-content'>";
//                                        }
//                                        if (theDiv.innerHTML == "") {
//                                            table += "<tr id='Interline_0'><td class='ui-widget-content first'>" +  $("#ItineraryFlightNo").val().toUpperCase() + "</td><td class='ui-widget-content first'>" + $("#ItineraryDate").val() + "</td><td class='ui-widget-content first'>" + ItineraryOrigin + "/" + ItineraryDestination + "</td><input name='hdnOriginAirportSNo_Interline_0' id='hdnOriginAirportSNo_Interline_0' type='hidden' value='" + ItineraryOriginSNo + "'/><input name='hdnDestinationAirportSNo_Interline_0' id='hdnDestinationAirportSNo_Interline_0' type='hidden' value='" + ItineraryDestinationSNo + "'/><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + parseFloat($("#ItineraryGrossWeight").val()).toFixed(2) + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>00:00/00:00</td><td class='ui-widget-content first'></td><td class='ui-widget-content first'></td><td id='RouteStatus' class='ui-widget-content first'></td><td id='Status' class='ui-widget-content first'></td><td id='SoftEmbargoApplied' class='ui-widget-content first'></td><td id='bct' class='ui-widget-content first'>NO</td><td id='mct' class='ui-widget-content first'>NO</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_Interline_0' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"Interline_0\",\"" + ItineraryOrigin + "\",\"" + ItineraryDestination + "\",\"" + ItineraryOriginSNo + "\",\"" + ItineraryDestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_Interline_0' id='hdnOriginCitySNo_Interline_0' type='hidden' value='" + ItineraryOriginCitySNo + "'/><input name='hdnDestinationCitySNo_Interline_0' id='hdnDestinationCitySNo_Interline_0' type='hidden' value='" + ItineraryDestinationCitySNo + "'/><input name='hdnSoftEmbargo_Interline_0' id='hdnSoftEmbargo_Interline_0' type='hidden' value=''/><input name='hdnItineraryMainVolumeWeight_Interline_0' id='hdnItineraryMainVolumeWeight_Interline_0' type='hidden' value='" + $("#ItineraryMainVolumeWeight").val() + "'/><input name='hdnArrFlightDate_Interline_0' id='hdnArrFlightDate_Interline_0' type='hidden' value='" + $("#ItineraryDate").val() + "'/></td></tr>";
//                                            $("#hdnETDTime").val('00:00');
//                                            $("#hdnFlightDate").val($("#ItineraryDate").val());
//                                            $("#hdnArrFlightDate").val($("#ItineraryDate").val());
//                                        }
//                                        else {
//                                            var tableroute = document.getElementById("tblSelectdRouteResult");
//                                            var RowID = tableroute.rows.length - 1;
//                                            $('#tblSelectdRouteResult').append("<tr id='Interline_" + RowID + "'><td class='ui-widget-content first'>" + $("#ItineraryFlightNo").val().toUpperCase() + "</td><td class='ui-widget-content first'>" + $("#ItineraryDate").val() + "</td><td class='ui-widget-content first'>" + ItineraryOrigin + "/" + ItineraryDestination + "</td><input name='hdnOriginAirportSNo_Interline_" + RowID + "' id='hdnOriginAirportSNo_Interline_" + RowID + "' type='hidden' value='" + ItineraryOriginSNo + "'/><input name='hdnDestinationAirportSNo_Interline_" + RowID + "' id='hdnDestinationAirportSNo_Interline_" + RowID + "' type='hidden' value='" + ItineraryDestinationSNo + "'/><td class='ui-widget-content first'>" + $("#ItineraryPieces").val() + "</td><td class='ui-widget-content first'>" + parseFloat($("#ItineraryGrossWeight").val()).toFixed(2) + "</td><td class='ui-widget-content first'>" + $("#ItineraryVolumeWeight").val() + "</td><td class='ui-widget-content first'>00:00/00:00</td><td class='ui-widget-content first'></td><td class='ui-widget-content first'></td><td id='RouteStatus' class='ui-widget-content first'></td><td id='Status' class='ui-widget-content first'></td><td id='SoftEmbargoApplied' class='ui-widget-content first'></td><td id='bct' class='ui-widget-content first'>NO</td><td id='mct' class='ui-widget-content first'>NO</td><button aria-disabled='false' role='button' title='Delete' type='button' id='Delete_Interline_" + RowID + "' value='' tabindex='16' class='btn btn-block btn-primary' style='width:50px;' onclick='DeleteRoute(this,\"Interline_" + RowID + "\",\"" + ItineraryOrigin + "\",\"" + ItineraryDestination + "\",\"" + ItineraryOriginSNo + "\",\"" + ItineraryDestinationSNo + "\");'><span class='ui-button-text'>Delete</span></button><input name='hdnOriginCitySNo_Interline_" + RowID + "' id='hdnOriginCitySNo_Interline_" + RowID + "' type='hidden' value='" + ItineraryOriginCitySNo + "'/><input name='hdnDestinationCitySNo_Interline_" + RowID + "' id='hdnDestinationCitySNo_Interline_" + RowID + "' type='hidden' value='" + ItineraryDestinationCitySNo + "'/><input name='hdnSoftEmbargo_Interline_" + RowID + "' id='hdnSoftEmbargo_Interline_" + RowID + "' type='hidden' value=''/><input name='hdnItineraryMainVolumeWeight_Interline_" + RowID + "' id='hdnItineraryMainVolumeWeight_Interline_" + RowID + "' type='hidden' value='" + $("#ItineraryMainVolumeWeight").val() + "'/><input name='hdnArrFlightDate_Interline_" + RowID + "' id='hdnArrFlightDate_Interline_" + RowID + "' type='hidden' value='" + $("#ItineraryDate").val() + "'/></td></tr>");
//                                            $("#hdnETDTime").val('00:00');
//                                            $("#hdnFlightDate").val($("#ItineraryDate").val());
//                                            $("#hdnArrFlightDate").val($("#ItineraryDate").val());
//                                        }
//                                        if (theDiv.innerHTML == "") {
//                                            table += "</tbody></table>";
//                                            theDiv.innerHTML += table;
//                                        }
//                                        var tblSelectdRouteResultDelete = document.getElementById("tblSelectdRouteResult");
//                                        if (tblSelectdRouteResultDelete != null && tblSelectdRouteResultDelete.rows.length > 2) {
//                                            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
//                                                if (row != (tblSelectdRouteResultDelete.rows.length - 2))
//                                                    $(tr).find("[id^='Delete_']").css("display", "none");
//                                            });
//                                        }



//                                        var IsmatchAWBOriginCity = false;
//                                        var IsmatchAWBDestinationCity = false;
//                                        var AWBOriginCitySNo = $("#Text_AWBOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBOrigin").data("kendoAutoComplete").key();
//                                        var AWBDestinationCitySNo = $("#Text_AWBDestination").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBDestination").data("kendoAutoComplete").key();
//                                        var AWBPieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
//                                        var AWBGrossWeight = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));
//                                        var AWBCBM = ($("#AWBCBM").val() == "" ? 0 : parseFloat($("#AWBCBM").val()));
//                                        var AWBVolumeWeight = ($("#AWBVolumeWeight").val() == "" ? 0 : parseFloat($("#AWBVolumeWeight").val()));

//                                        var SelectedItineraryPieces = 0;
//                                        var SelectedItineraryGrossWeight = 0;
//                                        var SelectedCBM = 0;
//                                        var SelectedItineraryMainVolumeWeight = 0;
//                                        var RemainingPieces = 0;
//                                        var RemainingItineraryGrossWeight = 0;
//                                        var RemainingCBM = 0;
//                                        var RemainingItineraryMainVolumeWeight = 0;
//                                        var table = document.getElementById("tblSelectdRouteResult");
//                                        if (table != null && table.rows.length > 1) {
//                                            $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
//												if (ItineraryOrigin == $(tr).find("td")[2].innerText.split("/")[0].trim() && ItineraryDestination == $(tr).find("td")[2].innerText.split("/")[1].trim()) {
//													SelectedItineraryPieces = parseInt(SelectedItineraryPieces) + parseInt($(tr).find("td")[3].innerText.trim());
//													SelectedItineraryGrossWeight = parseFloat(SelectedItineraryGrossWeight) + parseFloat($(tr).find("td")[4].innerText.trim());
//													SelectedCBM = parseFloat(SelectedCBM) + parseFloat($(tr).find("td")[5].innerText.trim());
//                                                    SelectedItineraryMainVolumeWeight = parseFloat(parseFloat(SelectedItineraryMainVolumeWeight) + parseFloat($(tr).find("input[id^='hdnItineraryMainVolumeWeight_']").val())).toFixed(2);
//                                                }
//                                                if (AWBOriginCitySNo == $(tr).find("input[id^='hdnOriginCitySNo_']").val()) {
//                                                    IsmatchAWBOriginCity = true;
//                                                }
//                                                if (AWBDestinationCitySNo == $(tr).find("input[id^='hdnDestinationCitySNo_']").val()) {
//                                                    IsmatchAWBDestinationCity = true;
//                                                }
//                                            });
//                                        }
//                                        RemainingPieces = parseInt(AWBPieces) - parseInt(SelectedItineraryPieces);
//                                        RemainingItineraryGrossWeight = (parseFloat(AWBGrossWeight) - parseFloat(SelectedItineraryGrossWeight)).toFixed(2);
//                                        RemainingCBM = (parseFloat(AWBCBM) - parseFloat(SelectedCBM)).toFixed(3);
//                                        RemainingItineraryMainVolumeWeight = (parseFloat(AWBVolumeWeight) - parseFloat(SelectedItineraryMainVolumeWeight)).toFixed(2);
//                                        if (SelectedItineraryPieces < AWBPieces) {
//                                            $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(false)
//                                            $("#Text_ItineraryDestination").data("kendoAutoComplete").enable(false)
//                                            $("#ItineraryPieces").val(RemainingPieces == 0 ? '' : RemainingPieces)
//                                            $("#_tempItineraryPieces").val(RemainingPieces == 0 ? '' : RemainingPieces)

//                                            $("#ItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? '' : RemainingItineraryGrossWeight)
//                                            $("#_tempItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? '' : RemainingItineraryGrossWeight)
//                                            $("#ItineraryVolumeWeight").val(RemainingCBM == 0.000 ? '' : RemainingCBM)
//                                            $("#_tempItineraryVolumeWeight").val(RemainingCBM == 0.000 ? '' : RemainingCBM)
//                                            $("#ItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? '' : RemainingItineraryMainVolumeWeight)
//                                            $("#_tempItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? '' : RemainingItineraryMainVolumeWeight)
//                                        }
//                                        else {
//                                            if (IsmatchAWBOriginCity = true && IsmatchAWBDestinationCity == true) {
//                                                $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(true);
//                                                $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue('', '');
//                                                $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue('', '');

//                                                $("#ItineraryPieces").val('');
//                                                $("#_tempItineraryPieces").val('');
//                                                $("#ItineraryGrossWeight").val('');
//                                                $("#_tempItineraryGrossWeight").val('');
//                                                $("#ItineraryVolumeWeight").val('');
//                                                $("#_tempItineraryVolumeWeight").val('');
//                                                $("#ItineraryMainVolumeWeight").val('');
//                                                $("#_tempItineraryMainVolumeWeight").val('');


//                                                var FlightDateForRateSearch = "";
//                                                var FlightNoForRateSearch = "";
//                                                var AllotmentCODEForRateSearch = "";


//                                                $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
//													if (row == 0)
//														FlightDateForRateSearch = $(tr).find("td")[1].innerText.trim();
//													FlightNoForRateSearch += $(tr).find("td")[0].innerText.trim() + ',';
//													if ($(tr).find("td")[8].innerText.trim() != '')
//														AllotmentCODEForRateSearch += $(tr).find("td")[0].innerText.trim() + '~' + $(tr).find("td")[8].innerText.trim() + '~' + $(tr)[0].id.trim() + ',';
//                                                });
//                                                if (FlightNoForRateSearch != "")
//                                                    FlightNoForRateSearch = FlightNoForRateSearch.substring(0, FlightNoForRateSearch.length - 1);
//                                                if (AllotmentCODEForRateSearch != "")
//                                                    AllotmentCODEForRateSearch = AllotmentCODEForRateSearch.substring(0, AllotmentCODEForRateSearch.length - 1);
//                                                var RateAvailableNEW = RateAvailableOrNotNEW(FlightDateForRateSearch, FlightNoForRateSearch, AllotmentCODEForRateSearch);
//                                                if (RateAvailableNEW != true) {
//                                                    ClearItineraryRoute();
//                                                    ShowMessage('warning', 'Information!', "Rate Not Available for Booking.");
//                                                }
//                                            }
//                                            else if (IsmatchAWBOriginCity = true && IsmatchAWBDestinationCity == false) {
//                                                $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue($("#Text_ItineraryDestination").data("kendoAutoComplete").key(), $("#Text_ItineraryDestination").data("kendoAutoComplete").value());
//                                                $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue('', '');
//                                                $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(false);

//                                                $("#ItineraryPieces").val(RemainingPieces == 0 ? AWBPieces : RemainingPieces)
//                                                $("#_tempItineraryPieces").val(RemainingPieces == 0 ? AWBPieces : RemainingPieces)
//                                                $("#ItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? AWBGrossWeight : RemainingItineraryGrossWeight)
//                                                $("#_tempItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? AWBGrossWeight : RemainingItineraryGrossWeight)
//                                                $("#ItineraryVolumeWeight").val(RemainingCBM == 0.000 ? AWBCBM : RemainingCBM)
//                                                $("#_tempItineraryVolumeWeight").val(RemainingCBM == 0.000 ? AWBCBM : RemainingCBM)
//                                                $("#ItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? AWBVolumeWeight : RemainingItineraryMainVolumeWeight)
//                                                $("#_tempItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? AWBVolumeWeight : RemainingItineraryMainVolumeWeight)
//                                            }
//                                            else {
//                                                $("#ItineraryPieces").val(RemainingPieces == 0 ? AWBPieces : RemainingPieces)
//                                                $("#_tempItineraryPieces").val(RemainingPieces == 0 ? AWBPieces : RemainingPieces)
//                                                $("#ItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? AWBGrossWeight : RemainingItineraryGrossWeight)
//                                                $("#_tempItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? AWBGrossWeight : RemainingItineraryGrossWeight)
//                                                $("#ItineraryVolumeWeight").val(RemainingCBM == 0.000 ? AWBCBM : RemainingCBM)
//                                                $("#_tempItineraryVolumeWeight").val(RemainingCBM == 0.000 ? AWBCBM : RemainingCBM)
//                                                $("#ItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? AWBVolumeWeight : RemainingItineraryMainVolumeWeight)
//                                                $("#_tempItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? AWBVolumeWeight : RemainingItineraryMainVolumeWeight)
//                                            }
//                                            $("#Text_ItineraryDestination").data("kendoAutoComplete").enable(true)

//                                        }


//                                        //if (Action.toUpperCase() == "NEW") {
//                                        var tableSelected = document.getElementById("tblSelectdRouteResult");
//                                        if (tableSelected != null && tableSelected.rows.length > 1) {
//                                            $('#tblSelectdRouteResult  tr').each(function (row, tr) {
//                                                $(tr).find("[id^='RouteStatus']").css("display", "none");
//                                                $(tr).find("[id^='Status']").css("display", "none");
//                                                $(tr).find("[id^='SoftEmbargoApplied']").css("display", "none");
//                                            });
//                                        }
//                                        //}

//                                    }
//                               // }
//                            //}
//                            //else
//                            //    ShowMessage('warning', 'Information!', "Enter Carrier Code.");
//                        }
//                        else
//                            ShowMessage('warning', 'Information!', "Enter Flight No.");
//                    }
//                    else
//                        ShowMessage('warning', 'Information!', "Enter Pieces, Gross Weight and Volume (CBM) for Search Flight.");
//                }
//                else
//                    ShowMessage('warning', 'Information!', "Select Origin Airport, Destination Airport and Date for Search Flight.");
//          //  }
//        }
//    }

//}
function SearchTransitFlight() {
    if (kendo.parseFloat($("#ItineraryOrigin").val()) > 0 && kendo.parseFloat($("#ItineraryDestination").val()) > 0 && $("#ItineraryDate").val() != '') {
        if (kendo.parseFloat($("#ItineraryPieces").val()) > 0 && kendo.parseFloat($("#ItineraryGrossWeight").val()) > 0 && kendo.parseFloat($("#ItineraryVolumeWeight").val()) > 0) {
            SearchFlightMode("TransitFlight");
        }
        else
            ShowMessage('warning', 'Information!', "Enter Pieces, Gross Weight and Volume (CBM) for Transit Flight.");
    }
    else {
        ShowMessage('warning', 'Information!', "Select Origin Airport, Transit Airport, Destination Airport and Date for Transit Flight.");
    }
}
function ViewRoute() {
    if (cfi.IsValidSection("ApplicationTabs-1")) {
        if (true) {
            var theDivSearch = document.getElementById("divFlightSearchResult");
            theDivSearch.innerHTML = "";
            var RateAvailable = true; // RateAvailableOrNot();
            if (RateAvailable == true) {
                var result = IsInternationalBookingAgent($("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ItineraryOrigin").data("kendoAutoComplete").key(), $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ItineraryDestination").data("kendoAutoComplete").key());
                if (result == true) {
                    if (kendo.parseFloat($("#ItineraryOrigin").val()) > 0 && kendo.parseFloat($("#ItineraryDestination").val()) > 0 && $("#ItineraryDate").val() != '') {
                        if (kendo.parseFloat($("#ItineraryPieces").val()) > 0 && kendo.parseFloat($("#ItineraryGrossWeight").val()) > 0 && kendo.parseFloat($("#ItineraryVolumeWeight").val()) > 0) {
                            if ($("#AWBPieces").val() == $("#ItineraryPieces").val()) {
                                $.ajax({
                                    url: "Services/Report/NonExecutedBookingService.svc/ViewRoute?ItineraryOrigin=" + $("#ItineraryOrigin").val() + '&ItineraryDestination=' + $("#ItineraryDestination").val() + '&AWBPrefix=' + $("#Text_AWBCode").data("kendoAutoComplete").key(), async: false, type: "get", dataType: "json", cache: false,
                                    contentType: "application/json; charset=utf-8",
                                    success: function (result) {
                                        var ViewRouteData = jQuery.parseJSON(result);
                                        var ViewRouteDetailData = ViewRouteData.Table0;
                                        if (ViewRouteDetailData.length > 0) {
                                            var str = "<table  class='WebFormTable'>";
                                            var no = 0;
                                            for (var i = 0; i < ViewRouteDetailData.length; i++) {
                                                no = (i + 1)
                                                str += "<tr><td>" + no + "</td><td><a href='javascript:void(0);' onClick='SelectedRoute(this);' id=" + ViewRouteDetailData[i].Routing + ">" + ViewRouteDetailData[i].Routing + "</a></td></tr>";
                                            }
                                            no = (no + 1)
                                            str += "<tr><td>" + no + "</td><td><a href='javascript:void(0);'  onClick='SelectedRoute(this);' id='Manual'>Manual</a></td></tr>";
                                            str += "</table>";
                                            $("#divViewRoutePopUp").html(str);
                                            cfi.PopUp("divViewRoutePopUp", "Available Route", 300, PopUpOnOpen, PopUpOnClose);
                                        }
                                    }
                                });
                            }
                            else
                                ShowMessage('warning', 'Information!', "Part shipment planning is not allowed from View Route option. Kindly search flights or manually enter flights for part shipment planning.");
                        }
                        else
                            ShowMessage('warning', 'Information!', "Enter Pieces, Gross Weight and Volume (CBM) for view Route.");
                    }
                    else {
                        ShowMessage('warning', 'Information!', "Select Origin & Destination airports with Date to View Route.");
                    }
                }
                //else
                //    ShowMessage('warning', 'Information!', "Agent Booking not allow for given Origin Destination Pair.");
            }
            else
                ShowMessage('warning', 'Information!', "Rate Not Available for Booking.");
        }
    }
}
var SendRouteAaarray = [];
var SelectedRouteValueArray = [];
var SelectedRouteValue = "";
function SelectedRoute(ss) {
    var theDiv = document.getElementById("divFinalSelectedroute");
    theDiv.innerHTML = "";
    var theDiv1 = document.getElementById("divFlightSearchResult");
    theDiv1.innerHTML = "";

    SelectedRouteValue = ss.id;
    SelectedRouteValueArray = [];
    SendRouteAaarray = [];
    SelectedRouteValueArray = SelectedRouteValue.split("-");
    SendRouteAaarray = SelectedRouteValue.split("-");
    CloseViewRoutepopUp();
    if (SelectedRouteValue == "Manual") {
        //$("#Text_ItineraryTransit").data("kendoAutoComplete").enable(true)
    }
    else {
        //cfi.ResetAutoComplete("ItineraryTransit");
        //$("#Text_ItineraryTransit").data("kendoAutoComplete").enable(false)
        SearchFlightMode("SelectedRoute");
    }
}
function SearchFlightMode(Mode) {
    var OriginSNo = $("#Text_AWBOrigin").data("kendoAutoComplete").key();
    var DestSNo = $("#Text_AWBDestination").data("kendoAutoComplete").key();
    var Pcs = $("#AWBPieces").val();
    var Gwt = $("#AWBGrossWeight").val();
    var Vol = $("#AWBVolumeWeight").val();
    var Cbm = $("#AWBCBM").val();
    var Chwt = $("#AWBChargeableWeight").val();
    var productSNo = $("#Text_Product").data("kendoAutoComplete").key();
    var CommoSNo = $("#Text_Commodity").data("kendoAutoComplete").key();
    var SHCSNo = $("#SHC").val() == "" ? 0 : $("#SHC").val();
    var AgentSNo = $("#Text_AWBAgent").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_AWBAgent").data("kendoAutoComplete").key();
    var pom = $("#Text_ChargeCode").data("kendoAutoComplete").key();
    var BookingType = $('input:radio[name=BookingType]:checked').val();
    var NOH = $("#NoofHouse").val() == "" ? 0 : $("#NoofHouse").val();
    var OriginAirportSNo = $("#Text_ItineraryOrigin").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_ItineraryOrigin").data("kendoAutoComplete").key();
    var DestAirportSNo = $("#Text_ItineraryDestination").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_ItineraryDestination").data("kendoAutoComplete").key();


    var Goahead = true;
    if (Mode == "SelectedRoute") {
        var TempItineraryDate = "";
        var TempItineraryETDTime = "00:00";
        if ($("#hdnFlightDate").val() != "") {
            var month = { "JAN": "01", "FEB": "02", "MAR": "03", "APR": "04", "MAY": "05", "JUN": "06", "JUL": "07", "AUG": "08", "SEP": "09", "OCT": "10", "NOV": "11", "DEC": "12" };

            var date = $("#hdnFlightDate").val();
            var Selecteddate_components = date.split("-");
            var Selectedcurrent_day = Selecteddate_components[0];
            var Selectedcurrent_month = month[Selecteddate_components[1].toString().toUpperCase()];
            var Selectedcurrent_year = Selecteddate_components[2];
            SelectedDateValue = Selectedcurrent_year + "-" + Selectedcurrent_month + "-" + Selectedcurrent_day;
            var SelectedDate = new Date(SelectedDateValue);

            var Date1 = $("#ItineraryDate").val();
            var Previousdate_components = Date1.split("-");
            var Previouscurrent_day = Previousdate_components[0];
            var Previouscurrent_month = month[Previousdate_components[1].toString().toUpperCase()];
            var Previouscurrent_year = Previousdate_components[2];
            PreviousDateValue = Previouscurrent_year + "-" + Previouscurrent_month + "-" + Previouscurrent_day;
            var ItineraryDate = new Date(PreviousDateValue);


            if (ItineraryDate > SelectedDate) {
                TempItineraryDate = $("#ItineraryDate").val();
                TempItineraryETDTime = "00:00";
            }
            else {
                TempItineraryDate = $("#hdnFlightDate").val();
                TempItineraryETDTime = $("#hdnETDTime").val();
            }
        }
        else {
            TempItineraryDate = $("#hdnFlightDate").val() == "" ? $("#ItineraryDate").val() : $("#hdnFlightDate").val();
            TempItineraryETDTime = $("#hdnETDTime").val();
        }
        if (SendRouteAaarray.length > 1) {



            var SecondLegORNot = ISSecondLegORNot(SendRouteAaarray[0], SendRouteAaarray[1]);
            if (SecondLegORNot == true) {


                org = $("#Text_ItineraryOrigin").val().split('-')[0]
                //sno = [];
                $("#tblSelectdRouteResult tbody tr td").each(function () {

                    if ($(this).index() == 2) {
                        //alert($(this).text());
                        if ($(this).text().split('/')[1] == SendRouteAaarray[0]) {

                            etd = $(this).closest('tr').find('td:eq(6)').text().split('/')[1]  // hdnArrFlightDate_15199298
                            date = $(this).closest('tr').find('input[type="hidden"][id^="hdnArrFlightDate_"]').val()
                            array.push(date + ' ' + etd)
                            sno.push($(this).closest('tr').attr('id') + '/' + date + ' ' + etd)
                        }
                    }
                });
                sno.sort(function (x, y) {
                    return Date.parse(y.split('/')[1]) - Date.parse(x.split('/')[1]);
                })

                ArrSelectedDateValue = sno[0].split('/')[1];
                ArrSelectedDate = ArrSelectedDateValue.split(' ')[0];
                ArrETATime = ArrSelectedDateValue.split(' ')[1];

                if (Date.parse(($("#ItineraryDate").val()) > Date.parse(ArrSelectedDate))) {
                    TempItineraryDate = $("#ItineraryDate").val();
                    TempItineraryETDTime = "00:00";
                }
                else {
                    TempItineraryDate = ArrSelectedDate;
                    TempItineraryETDTime = ArrETATime;
                }

            }
            ShowLoader(true);
            $.ajax({
                url: "Services/Report/NonExecutedBookingService.svc/SearchFlightResult",
                async: false,
                type: "GET",
                dataType: "json",
                data: {
                    Origin: SendRouteAaarray[0],
                    Destination: SendRouteAaarray[1],
                    ItineraryDate: TempItineraryDate,//$("#hdnFlightDate").val() == "" ? $("#ItineraryDate").val() : $("#hdnFlightDate").val(),
                    ItineraryCarrierCode: $("#ItineraryCarrierCode").val(),
                    ItineraryFlightNo: $("#ItineraryFlightNo").val(),
                    ItineraryTransit: "",
                    ItineraryGrossWeight: $("#ItineraryGrossWeight").val(),
                    ItineraryVolumeWeight: $("#ItineraryVolumeWeight").val(),
                    Product: $("#Product").val() == "" ? 0 : parseFloat($("#Product").val()),
                    Commodity: $("#Commodity").val(),
                    SHCSNo: $("#SHC").val(), //$("#hdnETDTime").val(), //$("#SHC").val(),
                    AgentSNo: $("#Text_AWBAgent").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBAgent").data("kendoAutoComplete").key(),
                    OverrideBCT: $("#chkBCTOverrideConnectionTime").prop('checked') == true ? 1 : 0,
                    OverrideMCT: $("#chkMCTOverrideConnectionTime").prop('checked') == true ? 1 : 0,
                    IsMCT: SecondLegORNot == false ? 0 : 1,
                    ETD: TempItineraryETDTime //$("#hdnETDTime").val()
					, SearchFrom: currentawbsno > 0 ? 'E' : 'B',
                    BookingNo: currentawbsno > 0 ? currentPrefix + '-' + currentawbno : $("#hdnBookingMasterRefNo").val()
                },
                contentType: "application/json; charset=utf-8", cache: false,
                success: function (result) {
                    ShowLoader(false);
                    var theDiv = document.getElementById("divFlightSearchResult");
                    theDiv.innerHTML = "";

                    var table = "</br><table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='8'>Flight Itinerary :</td></tr><tr><td class='formSection' colspan='8'><span style='color: black;font-size: 9pt;'>*</span><span>(Created/Available/Utilised)</span></td></tr></table><table class='appendGrid ui-widget' id='tblFlightSearchResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight No.</td><td class='ui-widget-header'>Date</td><td class='ui-widget-header'>O/D</td><td id='flightRoute' class='ui-widget-header'>Flight Route</td><td class='ui-widget-header'>STD/STA</td><td class='ui-widget-header'>A/C Type</td><td id='FreeSpaceGrVol' class='ui-widget-header'>Free Space Gr. Wt.*</td><td id='FreeSpaceGrVol' class='ui-widget-header'>Free Space Vol*</td><td id='AllocatedGrVol' class='ui-widget-header'>Allocated Gr. Wt.*</td><td id='AllocatedGrVol' class='ui-widget-header'>Allocated Vol*</td><td class='ui-widget-header'>ALOT Code</td><td id='MaxGrossPer' class='ui-widget-header'>Max Gross Per Pcs</td><td id='MaxVolPer' class='ui-widget-header'>Max Vol Per Pcs</td><td id='FlightCapacityGrWt' class='ui-widget-header'>Flight Capacity Gr. Wt.</td><td id='FlightCapacityVol' class='ui-widget-header'>Flight Capacity Vol</td><td id='FlightType' class='ui-widget-header'>Flight Type</td><td class='ui-widget-header'>Action</td></tr></thead><tbody class='ui-widget-content'>";
                    if (result.substring(1, 0) == "{") {
                        var myData = jQuery.parseJSON(result);
                        if (myData.Table0.length > 0) {
                            if (myData.Table0[0].ErrorMassage == undefined || myData.Table0[0].ErrorMassage == '') {
                                for (var i = 0; i < myData.Table0.length; i++) {
                                    if (myData.Table0[i].OverFlightCapacity == "1")
                                        table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td id='flightRoute' class='ui-widget-content first'>" + myData.Table0[i].FlightRoute + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td class='ui-widget-content first'><select style='width:100px' onclick='FillDropAllotment(\"DropAllotment_" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].DailyflightSNo + "\")' id='DropAllotment_" + myData.Table0[i].DailyflightSNo + "'></select><input name='Allotment_" + myData.Table0[i].DailyflightSNo + "' id='Allotment_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=''/></td><td class='ui-widget-content first'><label id='lblMaxGrossPerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxGrossPerPcs + "</label></td><td class='ui-widget-content first'><label id='lblMaxVolumePerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxVolumePerPcs + "</label></td><td id='FlightCapacityGrWt' class='ui-widget-content first'><label id='lblFlightCapacityGrWt_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].GrossWeight + "</label></td><td id='FlightCapacityVol' class='ui-widget-content first'><label id='lblFlightCapacityVol_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].Volume + "</label><input name='hdnOverbookAVLVol_" + myData.Table0[i].DailyflightSNo + "' id='hdnOverbookAVLVol_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=" + myData.Table0[i].OverbookAVLVol + "/><input name='hdnOverbookAVLGross_" + myData.Table0[i].DailyflightSNo + "' id='hdnOverbookAVLGross_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=" + myData.Table0[i].OverbookAVLGross + "/></td></td><td class='ui-widget-content first'></td></tr>";
                                    else
                                        table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td id='flightRoute' class='ui-widget-content first'>" + myData.Table0[i].FlightRoute + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td class='ui-widget-content first'><select style='width:100px' onclick='FillDropAllotment(\"DropAllotment_" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].DailyflightSNo + "\")' id='DropAllotment_" + myData.Table0[i].DailyflightSNo + "'></select><input name='Allotment_" + myData.Table0[i].DailyflightSNo + "' id='Allotment_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=''/></td><td id='MaxGrossPer' class='ui-widget-content first'><label id='lblMaxGrossPerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxGrossPerPcs + "</label></td><td id='MaxVolPer' class='ui-widget-content first'><label id='lblMaxVolumePerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxVolumePerPcs + "</label></td><td id='FlightCapacityGrWt' class='ui-widget-content first'><label id='lblFlightCapacityGrWt_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].GrossWeight + "</label></td><td id='FlightCapacityVol' class='ui-widget-content first'><label id='lblFlightCapacityVol_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].Volume + "</label><input name='hdnOverbookAVLVol_" + myData.Table0[i].DailyflightSNo + "' id='hdnOverbookAVLVol_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=" + myData.Table0[i].OverbookAVLVol + "/><input name='hdnOverbookAVLGross_" + myData.Table0[i].DailyflightSNo + "' id='hdnOverbookAVLGross_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=" + myData.Table0[i].OverbookAVLGross + "/></td><td class='ui-widget-content first'>" + myData.Table0[i].FlightType + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='View Rate' type='button' id='View_" + myData.Table0[i].DailyflightSNo + "' value='View_" + myData.Table0[i].DailyflightSNo + "' tabindex='16' class='btn btn-success' style='width:60px;' onclick='ViewFlightDetail(\"" + myData.Table0[i].DailyflightSNo + "\",\"" + OriginSNo + "\",\"" + DestSNo + "\",\"" + Pcs + "\",\"" + Gwt + "\",\"" + Vol + "\",\"" + Cbm + "\",\"" + Chwt + "\",\"" + productSNo + "\",\"" + CommoSNo + "\",\"" + SHCSNo + "\",\"" + AgentSNo + "\",\"" + pom + "\",\"" + BookingType + "\",\"" + NOH + "\",\"" + myData.Table0[i].FlightDate + "\",\"" + myData.Table0[i].FlightNo + "\",\"" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "\",\"" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "\",\"" + $('#Allotment_').text() + "\",\"" + myData.Table0[i].FlightType + "\",\"" + myData.Table0[i].FlightNo.split("-")[0] + "\",\"" + OriginAirportSNo + "\",\"" + DestAirportSNo + "\");'><span class='ui-button-text'>View Rate</span></button><button aria-disabled='false' role='button' title='Select' type='button' id=" + myData.Table0[i].DailyflightSNo + " value='1' tabindex='17' class='btn btn-success' style='width:50px;' onclick='SelectdRoute(\"" + myData.Table0[i].DailyflightSNo + "\",\"" + Mode + "\",\"NEW\",\"\",\"\",\"1\",\"\",\"\",\"\",\"" + myData.Table0[i].OverrideBCT + "\",\"" + myData.Table0[i].OverrideMCT + "\");'><span class='ui-button-text'>Select</span></button></td></tr>";


                                }
                                table += "</tbody></table>";
                                theDiv.innerHTML += table;

                                $('#tblFlightSearchResult tr').mouseenter(function () {
                                    $(this).find("td").each(function () {
                                        $(this).removeClass('ui-widget-content first');
                                        $(this).addClass('highlightReservation');
                                    });
                                });
                                $('#tblFlightSearchResult tr').mouseleave(function () {
                                    $(this).find("td").each(function () {
                                        $(this).addClass('ui-widget-content first');
                                        $(this).removeClass('highlightReservation');
                                    });
                                });

                                if ((userContext.GroupName != "ADMIN" && userContext.GroupName != "SUPER ADMIN")) {
                                    var table = document.getElementById("tblFlightSearchResult");
                                    if (table != null && table.rows.length > 1) {
                                        if (userContext.SysSetting.IsMaxGrossMaxVolPerPcs == "True") {
                                            $('#tblFlightSearchResult  tr').each(function (row, tr) {
                                                // $(tr).find("[id^='FreeSpaceGrVol']").css("display", "none");
                                                $(tr).find("[id^='AllocatedGrVol']").css("display", "none");
                                                $(tr).find("[id^='FlightCapacityGrWt']").css("display", "none");
                                                $(tr).find("[id^='FlightCapacityVol']").css("display", "none");
                                                $(tr).find("[id^='MaxGrossPer']").css("display", "none");
                                                $(tr).find("[id^='MaxVolPer']").css("display", "none");
                                            });
                                        }
                                        else {
                                            $('#tblFlightSearchResult  tr').each(function (row, tr) {
                                                $(tr).find("[id^='FreeSpaceGrVol']").css("display", "none");
                                                $(tr).find("[id^='AllocatedGrVol']").css("display", "none");
                                                $(tr).find("[id^='FlightCapacityGrWt']").css("display", "none");
                                                $(tr).find("[id^='FlightCapacityVol']").css("display", "none");
                                                $(tr).find("[id^='flightRoute']").css("display", "none");
                                            });
                                        }
                                    }
                                }
                                $('#tblFlightSearchResult  tr').each(function (row, tr) {
                                    if (userContext.SysSetting.ICMSEnvironment != 'JT') {
                                        $(tr).find("[id^='View_']").css("display", "none");
                                    }
                                    else {
										if (IsAsAgreedAgent == 1) {
											if (userContext.SpecialRights.ASAGREED == true) { }
											else
												$(tr).find("[id^='View_']").css("display", "none");
                                        }
                                    }
                                });

                            }
                            else {
                                var table = "<table class='appendGrid ui-widget' id='tblFlightSearchResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>" + myData.Table0[0].ErrorMassage + "</td></tr></thead></table";
                                theDiv.innerHTML += table;
                            }
                        }
                        else {
                            var table = "<table class='appendGrid ui-widget' id='tblFlightSearchResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight not found on '" + SendRouteAaarray[0] + "-" + SendRouteAaarray[1] + "' sector to complete route. Please select an alternate route.</td></tr></thead></table";
                            theDiv.innerHTML += table;

                        }

                    }
                },
                error: function (xhr) {
                    ShowLoader(false);
                    var a = "";
                }
            });
        }
    }
    else if (Mode == "SearchFlight") {
        var TempItineraryDate = "";
        var TempItineraryETDTime = "00:00";
        if ($("#hdnFlightDate").val() != "") {
            var month = { "JAN": "01", "FEB": "02", "MAR": "03", "APR": "04", "MAY": "05", "JUN": "06", "JUL": "07", "AUG": "08", "SEP": "09", "OCT": "10", "NOV": "11", "DEC": "12" };

            var date = $("#hdnFlightDate").val();
            var Selecteddate_components = date.split("-");
            var Selectedcurrent_day = Selecteddate_components[0];
            var Selectedcurrent_month = month[Selecteddate_components[1].toString().toUpperCase()];
            var Selectedcurrent_year = Selecteddate_components[2];
            SelectedDateValue = Selectedcurrent_year + "-" + Selectedcurrent_month + "-" + Selectedcurrent_day;
            var SelectedDate = new Date(SelectedDateValue);

            var Date1 = $("#ItineraryDate").val();
            var Previousdate_components = Date1.split("-");
            var Previouscurrent_day = Previousdate_components[0];
            var Previouscurrent_month = month[Previousdate_components[1].toString().toUpperCase()];
            var Previouscurrent_year = Previousdate_components[2];
            PreviousDateValue = Previouscurrent_year + "-" + Previouscurrent_month + "-" + Previouscurrent_day;
            var ItineraryDate = new Date(PreviousDateValue);



            if (ItineraryDate > SelectedDate) {
                TempItineraryDate = $("#ItineraryDate").val();
                TempItineraryETDTime = "00:00";
            }
            else {
                TempItineraryDate = $("#hdnFlightDate").val();
                TempItineraryETDTime = $("#hdnETDTime").val();
            }
        }
        else {
            TempItineraryDate = $("#hdnFlightDate").val() == "" ? $("#ItineraryDate").val() : $("#hdnFlightDate").val();
            TempItineraryETDTime = $("#hdnETDTime").val();
        }


        var SecondLegORNot = ISSecondLegORNot($("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0], $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0]);

        if (SecondLegORNot == true) {
            org = $("#Text_ItineraryOrigin").val().split('-')[0]
            sno = [];
            $("#tblSelectdRouteResult tbody tr td").each(function () {

                if ($(this).index() == 2) {
                    //alert($(this).text());
                    if ($(this).text().split('/')[1] == org) {

                        etd = $(this).closest('tr').find('td:eq(6)').text().split('/')[1]  // hdnArrFlightDate_15199298
                        date = $(this).closest('tr').find('input[type="hidden"][id^="hdnArrFlightDate_"]').val()
                        array.push(date + ' ' + etd)
                        sno.push($(this).closest('tr').attr('id') + '/' + date + ' ' + etd)
                    }
                }
            });
            sno.sort(function (x, y) {
                return Date.parse(y.split('/')[1]) - Date.parse(x.split('/')[1]);
            })

            ArrSelectedDateValue = sno[0].split('/')[1];
            ArrSelectedDate = ArrSelectedDateValue.split(' ')[0];
            ArrETATime = ArrSelectedDateValue.split(' ')[1];

            if (Date.parse($("#ItineraryDate").val()) > Date.parse(ArrSelectedDate)) {
                TempItineraryDate = $("#ItineraryDate").val();
                TempItineraryETDTime = "00:00";
            }
            else {
                TempItineraryDate = ArrSelectedDate;
                TempItineraryETDTime = ArrETATime;
            }
        }
        currentawbsno = 0;
        $.ajax({
            url: "Services/Report/NonExecutedBookingService.svc/SearchFlightResult",
            async: true,
            type: "GET",
            dataType: "json",
            data: {
                Origin: $("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0], //$("#Text_ItineraryOrigin").data("kendoAutoComplete").key(),
                Destination: $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0], //$("#Text_ItineraryDestination").data("kendoAutoComplete").key(),
                ItineraryDate: TempItineraryDate,//$("#hdnFlightDate").val() == "" ? $("#ItineraryDate").val() : $("#hdnFlightDate").val(),
                ItineraryCarrierCode: $("#ItineraryCarrierCode").val(),
                ItineraryFlightNo: $("#ItineraryFlightNo").val(),
                ItineraryTransit: "",
                ItineraryGrossWeight: $("#ItineraryGrossWeight").val(),
                ItineraryVolumeWeight: $("#ItineraryVolumeWeight").val(),
                Product: $("#Product").val() == "" ? 0 : parseFloat($("#Product").val()),
                Commodity: $("#Commodity").val(),
                SHCSNo: $("#SHC").val(), //$("#hdnETDTime").val(), //$("#SHC").val(),
                AgentSNo: $("#Text_AWBAgent").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBAgent").data("kendoAutoComplete").key(),
                OverrideBCT: $("#chkBCTOverrideConnectionTime").prop('checked') == true ? 1 : 0,
                OverrideMCT: $("#chkMCTOverrideConnectionTime").prop('checked') == true ? 1 : 0,
                IsMCT: SecondLegORNot == false ? 0 : 1,
                ETD: TempItineraryETDTime //$("#hdnETDTime").val()
				, SearchFrom:  'B',
				BookingNo:'126-22034084'//currentawbsno > 0 ? currentPrefix + '-' + currentawbno : $("#hdnBookingMasterRefNo").val()
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                var theDiv = document.getElementById("divFlightSearchResult");
                theDiv.innerHTML = "";

                var table = "</br><table border='0' cellspacing='0' cellpadding='0' style='width: 100%; margin: 0px; padding: 0px;'><tr><td class='formSection' colspan='8'>Flight Itinerary :</td></tr><tr><td class='formSection' colspan='8'><span style='color: black;font-size: 9pt;'>*</span><span>(Created/Available/Utilised)</span></td></tr></table><table class='appendGrid ui-widget' id='tblFlightSearchResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header' >Flight No.</td><td class='ui-widget-header'>Date</td><td class='ui-widget-header'>O/D</td><td id='flightRoute' class='ui-widget-header' >Flight Route</td><td class='ui-widget-header'>STD/STA</td><td class='ui-widget-header'>A/C Type</td><td id='FreeSpaceGrVol' class='ui-widget-header'>Free Space Gr. Wt.*</td><td id='FreeSpaceGrVol' class='ui-widget-header'>Free Space Vol*</td><td id='AllocatedGrVol' class='ui-widget-header'>Allocated Gr. Wt.*</td><td id='AllocatedGrVol' class='ui-widget-header'>Allocated Vol*</td><td class='ui-widget-header'>ALOT Code</td><td id='MaxGrossPer' class='ui-widget-header'>Max Gross Per Pcs</td><td id='MaxVolPer' class='ui-widget-header'>Max Vol Per Pcs</td><td id='FlightCapacityGrWt' class='ui-widget-header'>Flight Capacity Gr. Wt.</td><td id='FlightCapacityVol' class='ui-widget-header'>Flight Capacity Vol</td><td id='FlightType' class='ui-widget-header'>Flight Type</td><td class='ui-widget-header'>Action</td></tr></thead><tbody class='ui-widget-content'>";
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        if (myData.Table0[0].ErrorMassage == undefined || myData.Table0[0].ErrorMassage == '') {
                            for (var i = 0; i < myData.Table0.length; i++) {
                                if (myData.Table0[i].OverFlightCapacity == "1")
                                    table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td id='flightRoute' class='ui-widget-content first'>" + myData.Table0[i].FlightRoute + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td class='ui-widget-content first'><select style='width:100px' onclick='FillDropAllotment(\"DropAllotment_" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].DailyflightSNo + "\")' id='DropAllotment_" + myData.Table0[i].DailyflightSNo + "'></select><input name='Allotment_" + myData.Table0[i].DailyflightSNo + "' id='Allotment_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=''/></td><td id='MaxGrossPer' class='ui-widget-content first'><label id='lblMaxGrossPerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxGrossPerPcs + "</label></td><td id='MaxVolPer' class='ui-widget-content first'><label id='lblMaxVolumePerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxVolumePerPcs + "</label></td><td id='FlightCapacityGrWt' class='ui-widget-content first'><label id='lblFlightCapacityGrWt_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].GrossWeight + "</label></td><td id='FlightCapacityVol' class='ui-widget-content first'><label id='lblFlightCapacityVol_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].Volume + "</label><input name='hdnOverbookAVLVol_" + myData.Table0[i].DailyflightSNo + "' id='hdnOverbookAVLVol_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=" + myData.Table0[i].OverbookAVLVol + "/><input name='hdnOverbookAVLGross_" + myData.Table0[i].DailyflightSNo + "' id='hdnOverbookAVLGross_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=" + myData.Table0[i].OverbookAVLGross + "/></td><td class='ui-widget-content first'></td></tr>";
                                else
                                    table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Origin + "/" + myData.Table0[i].Destination + "</td><td id='flightRoute' class='ui-widget-content first'>" + myData.Table0[i].FlightRoute + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "/" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AircraftType + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleGrossAvailUsed + "</td><td id='FreeSpaceGrVol' class='ui-widget-content first'>" + myData.Table0[i].FreeSaleVolumeAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedGrossAvailUsed + "</td><td id='AllocatedGrVol' class='ui-widget-content first'>" + myData.Table0[i].AllocatedVolumeAvailUsed + "</td><td class='ui-widget-content first'><select style='width:100px' onclick='FillDropAllotment(\"DropAllotment_" + myData.Table0[i].DailyflightSNo + "\",\"" + myData.Table0[i].DailyflightSNo + "\")' id='DropAllotment_" + myData.Table0[i].DailyflightSNo + "'></select><input name='Allotment_" + myData.Table0[i].DailyflightSNo + "' id='Allotment_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=''/></td><td id='MaxGrossPer' class='ui-widget-content first'><label id='lblMaxGrossPerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxGrossPerPcs + "</label></td><td id='MaxVolPer' class='ui-widget-content first'><label id='lblMaxVolumePerPcs_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].MaxVolumePerPcs + "</label></td><td id='FlightCapacityGrWt' class='ui-widget-content first'><label id='lblFlightCapacityGrWt_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].GrossWeight + "</label></td><td id='FlightCapacityVol' class='ui-widget-content first'><label id='lblFlightCapacityVol_" + myData.Table0[i].DailyflightSNo + "'>" + myData.Table0[i].Volume + "</label><input name='hdnOverbookAVLVol_" + myData.Table0[i].DailyflightSNo + "' id='hdnOverbookAVLVol_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=" + myData.Table0[i].OverbookAVLVol + "/><input name='hdnOverbookAVLGross_" + myData.Table0[i].DailyflightSNo + "' id='hdnOverbookAVLGross_" + myData.Table0[i].DailyflightSNo + "' type='hidden' value=" + myData.Table0[i].OverbookAVLGross + "/></td><td class='ui-widget-content first'>" + myData.Table0[i].FlightType + "</td><td class='ui-widget-content first'><button aria-disabled='false' role='button' title='View Rate' type='button' id='View_" + myData.Table0[i].DailyflightSNo + "' value='View_" + myData.Table0[i].DailyflightSNo + "' tabindex='16' class='btn btn-success' style='width:60px;' onclick='ViewFlightDetail(\"" + myData.Table0[i].DailyflightSNo + "\",\"" + OriginSNo + "\",\"" + DestSNo + "\",\"" + Pcs + "\",\"" + Gwt + "\",\"" + Vol + "\",\"" + Cbm + "\",\"" + Chwt + "\",\"" + productSNo + "\",\"" + CommoSNo + "\",\"" + SHCSNo + "\",\"" + AgentSNo + "\",\"" + pom + "\",\"" + BookingType + "\",\"" + NOH + "\",\"" + myData.Table0[i].FlightDate + "\",\"" + myData.Table0[i].FlightNo + "\",\"" + myData.Table0[i].ETD.substring(0, myData.Table0[i].ETD.length - 3) + "\",\"" + myData.Table0[i].ETA.substring(0, myData.Table0[i].ETA.length - 3) + "\",\"" + $('#Allotment_').text() + "\",\"" + myData.Table0[i].FlightType + "\",\"" + myData.Table0[i].FlightNo.split("-")[0] + "\",\"" + OriginAirportSNo + "\",\"" + DestAirportSNo + "\");'><span class='ui-button-text'>View Rate</span></button><button aria-disabled='false' role='button' title='Select' type='button' id=" + myData.Table0[i].DailyflightSNo + " value='1' tabindex='17' class='btn btn-success' style='width:50px;' onclick='SelectdRoute(\"" + myData.Table0[i].DailyflightSNo + "\",\"" + Mode + "\",\"NEW\",\"\",\"\",\"1\",\"\",\"\",\"\",\"" + myData.Table0[i].OverrideBCT + "\",\"" + myData.Table0[i].OverrideMCT + "\");'><span class='ui-button-text'>Select</span></button></td></tr>";


                            }
                            table += "</tbody></table>";
                            theDiv.innerHTML += table;
                            $('#tblFlightSearchResult tr').mouseenter(function () {
                                $(this).find("td").each(function () {
                                    $(this).removeClass('ui-widget-content first');
                                    $(this).addClass('highlightReservation');
                                });
                            });
                            $('#tblFlightSearchResult tr').mouseleave(function () {
                                $(this).find("td").each(function () {
                                    $(this).addClass('ui-widget-content first');
                                    $(this).removeClass('highlightReservation');
                                });
                            });

                            if ((userContext.GroupName != "ADMIN" && userContext.GroupName != "SUPER ADMIN")) {
                                var table = document.getElementById("tblFlightSearchResult");
                                if (table != null && table.rows.length > 1) {
                                    if (userContext.SysSetting.IsMaxGrossMaxVolPerPcs == "True") {
                                        $('#tblFlightSearchResult  tr').each(function (row, tr) {
                                            //  $(tr).find("[id^='FreeSpaceGrVol']").css("display", "none");
                                            $(tr).find("[id^='AllocatedGrVol']").css("display", "none");
                                            $(tr).find("[id^='FlightCapacityGrWt']").css("display", "none");
                                            $(tr).find("[id^='FlightCapacityVol']").css("display", "none");
                                            $(tr).find("[id^='MaxGrossPer']").css("display", "none");
                                            $(tr).find("[id^='MaxVolPer']").css("display", "none");
                                        });
                                    }
                                    else {
                                        $('#tblFlightSearchResult  tr').each(function (row, tr) {
                                            $(tr).find("[id^='FreeSpaceGrVol']").css("display", "none");
                                            $(tr).find("[id^='AllocatedGrVol']").css("display", "none");
                                            $(tr).find("[id^='FlightCapacityGrWt']").css("display", "none");
                                            $(tr).find("[id^='FlightCapacityVol']").css("display", "none");
                                            $(tr).find("[id^='flightRoute']").css("display", "none");
                                        });
                                    }
                                }
                            }
                            $('#tblFlightSearchResult  tr').each(function (row, tr) {
                                if (userContext.SysSetting.ICMSEnvironment != 'JT') {
                                    $(tr).find("[id^='View_']").css("display", "none");


                                }
                                else {
									if (IsAsAgreedAgent == 1) {
										if (userContext.SpecialRights.ASAGREED == true) { }
										else
											$(tr).find("[id^='View_']").css("display", "none");
                                    }
                                }
                            });
                        }
                        else {
                            var table = "<table class='appendGrid ui-widget' id='tblFlightSearchResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>" + myData.Table0[0].ErrorMassage + "</td></tr></thead></table";
                            theDiv.innerHTML += table;
                        }
                    }
                    else {
                        var table = "<table class='appendGrid ui-widget' id='tblFlightSearchResult'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Flight not found on '" + $("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0] + "-" + $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0] + "' sector to complete route. Please select an alternate route.</td></tr></thead></table";
                        theDiv.innerHTML += table;
                    }

                }
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }

}

function ViewFlightDetail(DailyFlightSNo, OriginSNo, DestSNo, Pcs, Gwt, Vol, Cbm, Chwt, productSNo, CommoSNo, SHCSNo, AgentSNo, pom, BookingType, NOH, FlightDate, FlightNo, ETD, ETA, AllotmentCode, FlightType, CarrierCode, OriginAirportSNo, DestAirportSNo) {

    $.ajax({
        url: "Services/Report/NonExecutedBookingService.svc/ViewFlightDetail",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            DailyFlightSNo: DailyFlightSNo, OriginSNo: OriginSNo, DestSNo: DestSNo, Pcs: Pcs, Gwt: Gwt, Vol: Vol, Chwt: Chwt, productSNo: productSNo, CommoSNo: CommoSNo, SHCSNo: SHCSNo, AgentSNo: AgentSNo, pom: pom, NOH: NOH, FlightDate: FlightDate, FlightNo: FlightNo, ETD: ETD, ETA: ETA, AllotmentCode: AllotmentCode, FlightType: FlightType, CarrierCode: CarrierCode, OriginAirportSNo: OriginAirportSNo, DestAirportSNo: DestAirportSNo,
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            //var myData = jQuery.parseJSON(result);
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    var table = "<table class='appendGrid ui-widget' id='tblFlightDetail' style='height:100px;'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Tariff Rate</td><td class='ui-widget-header'>Tariff Amount</td><td class='ui-widget-header'>Due Carrier</td><td class='ui-widget-header'>Tax Amount</td><td class='ui-widget-header'>Replan Charges (If applicable)</td><td class='ui-widget-header'>Surcharge</td><td class='ui-widget-header'>Total Freight</td><td class='ui-widget-header'>NTA</td></tr></thead><tbody class='ui-widget-content'>";
                    //if (myData.Table0[0].ErrorMassage == undefined || myData.Table0[0].ErrorMassage == '') {
                    //    for (var i = 0; i < myData.Table0.length; i++) {
                    table += "<tr><td class='ui-widget-content first'>" + myData.Table0[0].TariffRate
						+ "</td><td class='ui-widget-content first'>" + myData.Table0[0].TariffAmount + "</td><td  class='ui-widget-content first'>" + myData.Table0[0].AdminFee + "</td><td  class='ui-widget-content first'>" + myData.Table0[0].TaxAmount + "</td><td  class='ui-widget-content first'>" + myData.Table0[0].ReplanCharges + "</td><td  class='ui-widget-content first'>" + myData.Table0[0].SurchargeAmount + "</td><td  class='ui-widget-content first'>" + myData.Table0[0].TotalFreight + "</td><td  class='ui-widget-content first'>" + myData.Table0[0].NTA + "</td></tr>"; table += "</tbody></table>";
                    $("#divViewFlightDetailPopUp").html(table);
                    cfi.PopUp("divViewFlightDetailPopUp", "Flight Information", 800, PopUpOnOpen, PopUpOnClose);
                }
            }
        },
        error: function (xhr) {
            var a = "";
        }
    });
}
function IsInternationalBookingAgent(ItineraryAirportOrigin, ItineraryAirportDestination) {
    var Result = true;
    $.ajax({
        url: "Services/Report/NonExecutedBookingService.svc/IsInternationalBookingAgent",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            OriginCitySNo: $("#Text_AWBOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBOrigin").data("kendoAutoComplete").key(),
            DestinationCitySNo: $("#Text_AWBDestination").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBDestination").data("kendoAutoComplete").key(),
            AccountSNo: $("#Text_AWBAgent").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBAgent").data("kendoAutoComplete").key(),
            ItineraryOrigin: ItineraryAirportOrigin,//$("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ItineraryOrigin").data("kendoAutoComplete").key(),
            ItineraryDestination: ItineraryAirportDestination,//$("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_ItineraryDestination").data("kendoAutoComplete").key(),
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    if (myData.Table0[0].Result == "1") {
                        Result = true;
                    }
                    else {
                        Result = false;
                        ShowMessage('warning', 'Information!', myData.Table0[0].ResultMessage);
                    }
                }
            }
        },
        error: function (xhr) {
            var a = "";
        }
    });
    return Result;
}

function ISSecondLegORNot(Origin, Destination) {
    var resultreturn = false;
    var AWBOriginCitySNo = $("#Text_AWBOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBOrigin").data("kendoAutoComplete").key();
    var AWBDestinationCitySNo = $("#Text_AWBDestination").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBDestination").data("kendoAutoComplete").key();

    $.ajax({
        url: "Services/Report/NonExecutedBookingService.svc/ISSecondLegORNot",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            ItineraryOrigin: Origin,
            ItineraryDestination: Destination
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    if (myData.Table0[0].ItineraryOriginSNo != AWBOriginCitySNo) {
                        resultreturn = true;
                    }
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
    return resultreturn;
}


function SaveData(ProcessNameDetails) {
    var Dmns = true;
    var flag = false;
    var ULDCheck = true;
    var IsConfirmData = true;
    var SoftEmbargo = "0";
    if (ProcessNameDetails == "NONEXECUTEDBOOKINGLIST") {
        //if ($("#AWBNumber").val() != "") {
        //    ValidateAndCheckValidAWBNumber();
        //}
        if (cfi.IsValidSection("ApplicationTabs-1")) {
            if (true) {
                //if ($("#chkIsBUP").prop('checked') == true) {
                //    $.ajax({
                //        url: "Services/Shipment/BackDateBookingService.svc/IsPerPiecesCheckAllow",
                //        async: false,
                //        type: "GET",
                //        dataType: "json",
                //        data: {
                //            CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_Commodity").data("kendoAutoComplete").key(),
                //            SPHC: $("#Text_SHC").data("kendoAutoComplete").key(),
                //        },
                //        contentType: "application/json; charset=utf-8", cache: false,
                //        success: function (result) {
                //            if (result.substring(1, 0) == "{") {
                //                var myData = jQuery.parseJSON(result);
                //                if (myData.Table0.length > 0) {
                //                    if (myData.Table0[0].Result == "0") {
                //                        ULDCheck = false;
                //                        ShowMessage('warning', 'Information!', 'Human should not be allowed in bup shipment');
                //                        return;
                //                    }
                //                }
                //            }
                //        },
                //        error: function (xhr) {
                //            var a = "";
                //        }
                //    });

                //    $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                //        if ($(tr)[0].id.indexOf('_') > 0) {
                //        }
                //        else {
                //            $.ajax({
                //                url: "Services/Shipment/BackDateBookingService.svc/ULDCheck",
                //                async: false,
                //                type: "GET",
                //                dataType: "json",
                //                data: {
                //                    DailFlightSNo: $(tr)[0].id,
                //                    BookingRefNo: $("#hdnBookingMasterRefNo").val(),
                //                },
                //                contentType: "application/json; charset=utf-8", cache: false,
                //                success: function (result) {
                //                    if (result.substring(1, 0) == "{") {
                //                        var myData = jQuery.parseJSON(result);
                //                        if (myData.Table0.length > 0) {
                //                            if (myData.Table0[0].IsValid != "") {
                //                                if (myData.Table0[0].IsValid == "False") {
                //                                    var ValidMessage = myData.Table0[0].ValidMessage;
                //                                    ULDCheck = false;
                //                                    ShowMessage('warning', 'Information!', ValidMessage + ' - ' + 'ULD Check.');
                //                                    return;
                //                                }
                //                            }
                //                        }
                //                    }
                //                },
                //                error: function (xhr) {
                //                    var a = "";
                //                }
                //            });
                //        }
                //    });
                //}
             //   if (ULDCheck == true) {
                    //$('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                    //    var Agentresult = IsInternationalBookingAgent($(tr).find("input[id^='hdnOriginAirportSNo_']").val() == "" ? 0 : $(tr).find("input[id^='hdnOriginAirportSNo_']").val(), $(tr).find("input[id^='hdnDestinationAirportSNo_']").val() == "" ? 0 : $(tr).find("input[id^='hdnDestinationAirportSNo_']").val());
                    //    if (Agentresult != true) {
                    //        IsConfirmData = false;
                    //        return;
                    //    }
                    //    else {
                    //        if ($(tr)[0].id.indexOf('_') > 0) {
                    //        }
                    //        else {
                    //            $.ajax({
                    //                url: "Services/Shipment/BackDateBookingService.svc/CheckEmbargoParam",
                    //                async: false,
                    //                type: "GET",
                    //                dataType: "json",
                    //                data: {
                    //                    DailFlightSNo: $(tr)[0].id,
                    //                    AgentSNo: $("#Text_AWBAgent").data("kendoAutoComplete").key(),
                    //                    ProductSNo: $("#Text_Product").data("kendoAutoComplete").key(),
                    //                    CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
                    //                    ItineraryPieces: $(tr).find("td")[3].innerText,
                    //                    ItineraryGrossWeight: $(tr).find("td")[4].innerText,
                    //                    ItineraryVolumeWeight: $(tr).find("td")[5].innerText,
                    //                    PaymentType: $("#Text_ChargeCode").data("kendoAutoComplete").key(),
                    //                    SPHC: $("#Text_SHC").data("kendoAutoComplete").key(),
                    //                },
                    //                contentType: "application/json; charset=utf-8", cache: false,
                    //                success: function (result) {
                    //                    if (result.substring(1, 0) == "{") {
                    //                        var myData = jQuery.parseJSON(result);
                    //                        if (myData.Table0.length > 0) {
                    //                            if (myData.Table0[0].IsSoftEmbargo != "") {
                    //                                if (myData.Table0[0].IsSoftEmbargo != "True") {
                    //                                    var EmbargoName = myData.Table0[0].ValidMessage.split('@')[0];
                    //                                    IsConfirmData = false;
                    //                                    ShowMessage('warning', 'Information!', 'Embargo Levied' + ' - ' + EmbargoName);
                    //                                    return;
                    //                                }
                    //                                else if (myData.Table0[0].IsSoftEmbargo == "True") {
                    //                                    var EmbargoName = myData.Table0[0].ValidMessage.split('@')[1];
                    //                                    IsConfirmData = confirm(EmbargoName + ' - ' + 'Soft Embargo Applied. Do you wish to continue?');
                    //                                    SoftEmbargo = "1";
                    //                                }
                    //                                if (IsConfirmData == false) {
                    //                                    return;
                    //                                }
                    //                                else if (IsConfirmData == true) {
                    //                                    $("#hdnSoftEmbargo_" + $(tr)[0].id).val("1");
                    //                                }
                    //                            }
                    //                            else
                    //                                $("#hdnSoftEmbargo_" + $(tr)[0].id).val("0");
                    //                        }
                    //                        else
                    //                            $("#hdnSoftEmbargo_" + $(tr)[0].id).val("0");
                    //                    }
                    //                },
                    //                error: function (xhr) {
                    //                    var a = "";
                    //                }
                    //            });
                    //        }
                    //    }
                    //});
                    if (IsConfirmData == true) {
                     
                      
                        if (Dmns == true) {
                            var result = CheckAndValidateData();
                            if (result == true) {
                                var ReservationItinerarySNo = 0;
                                var ReservationItineraryViewModel = [];
                                var ReservationViewModel = {
                                    ReservationBookingSNo: "0",
                                    ReservationBookingRefNo: hdnBookingMasterRefNo,
                                    BookingType: $('input:radio[name=BookingType]:checked').val(),
                                    AWBStock: $('input:radio[name=AWBStock]:checked').val(),
                                    AWBPrefix: $("#Text_AWBCode").data("kendoAutoComplete").key(),
                                    AWBNo: $("#AWBNumber").val(),
                                    PaymentType: $("#Text_ChargeCode").data("kendoAutoComplete").key(),
                                    IsBUP: $("#chkIsBUP").prop('checked') == true ? 1 : 0,
                                    BupPieces: $("#chkIsBUP").prop('checked') == true ? $("#AWBNoofBUP").val() : "",
                                    BupIntactPieces: $("#chkIsBUP").prop('checked') == true ? $("#AWBNoofBUPIntact").val() : "",
                                    ProductSNo: $("#Text_Product").data("kendoAutoComplete").key(),
                                    OriginCitySNo: $("#Text_AWBOrigin").data("kendoAutoComplete").key(),
                                    DestinationCitySNo: $("#Text_AWBDestination").data("kendoAutoComplete").key(),
                                    AccountSNo: $("#Text_AWBAgent").data("kendoAutoComplete").key(),
                                    AWBPieces: $("#AWBPieces").val(),
                                    GrossWeight: $("#AWBGrossWeight").val(),
                                    VolumeWeight: $("#AWBVolumeWeight").val(),
                                    ChargeableWeight: $("#AWBChargeableWeight").val(),
                                    Volume: $("#AWBCBM").val(),
                                    Priority: $("#Text_Priority").data("kendoAutoComplete").key(),
                                    UM: $("#Text_UM").data("kendoAutoComplete").key(),
                                    CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
                                    NOG: $("#NatureOfGoods").val(),
                                    SPHC: $("#Text_SHC").data("kendoAutoComplete").key(),
                                    NoofHouse: $("#NoofHouse").val(),
                                    IsRoutingComplete: $("#chkIsRoutingComplete").prop('checked') == true ? 1 : 0,
                                }

                                $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
                                    var ReservationItineraryInfo = {
                                        SNo: parseInt(ReservationItinerarySNo) + parseInt(1),
                                        ReservationBookingSNo: "0",
                                        ReservationBookingRefNo: hdnBookingMasterRefNo,
                                        AWBPieces: $("#AWBPieces").val(),
                                        AWBGrossWeight: $("#AWBGrossWeight").val(),
                                        AWBVolumeWeight: $("#AWBCBM").val(),
                                        UM: $("#Text_UM").data("kendoAutoComplete").key(),
                                        DailyFlightSNo: $(tr)[0].id.indexOf('_') > 0 ? 0 : $(tr)[0].id, //function () { if ($(tr)[0].id.indexOf('_') > 0) return 0; else return $(tr)[0].id; },
                                        CarrierCode: $(tr).find("td")[0].innerText.split("-")[0],
                                        FlightNo: $(tr).find("td")[0].innerText,
                                        FlightDate: $(tr).find("td")[1].innerText,
                                        Origin: $(tr).find("td")[2].innerText.split("/")[0],
                                        Destination: $(tr).find("td")[2].innerText.split("/")[1],
                                        Pieces: $(tr).find("td")[3].innerText,
                                        GrossWeight: $(tr).find("td")[4].innerText,
                                        VolumeWeight: $(tr).find("td")[5].innerText,
                                        ETD: $(tr).find("td")[6].innerText.split("/")[0],
                                        ETA: $(tr).find("td")[6].innerText.split("/")[1],
                                        AircraftType: "",
                                        FreeSpaceGrossWeight: "",
                                        FreeSpaceVolumeWeight: "",
                                        AllotmentCode: "",//$(tr).find("td")[8].innerText
                                        AllocatedGrossWeight: "",
                                        AllocatedVolumeWeight: "",
                                        AvailableGrossWeight: "",
                                        AvailableVolumeWeight: "",
                                        SoftEmbargo: $("#hdnSoftEmbargo_" + $(tr)[0].id).val(),
                                        FlightVolumeWeight: $("#hdnItineraryMainVolumeWeight_" + $(tr)[0].id).val(),
                                        OriginAirportSNo: $("#hdnOriginAirportSNo_" + $(tr)[0].id).val(),
                                        DestinationAirportSNo: $("#hdnDestinationAirportSNo_" + $(tr)[0].id).val()
                                    };
                                    ReservationItineraryViewModel.push(ReservationItineraryInfo);
                                });
                                var ShipperViewModel = {
                                    SNo: "0",
                                    ReservationBookingSNo: "0",
                                    ReservationBookingRefNo: hdnBookingMasterRefNo,
                                    ShipperAccountNo: $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").key(),
                                    ShipperName: $("#SHIPPER_Name").val() == '' ? $('#Text_AWBAgent').val().split('-')[1] : $("#SHIPPER_Name").val(),
                                    ShipperName2: $("#SHIPPER_Name2").val(),
                                    ShipperStreet: $("#SHIPPER_Street").val(),
                                    ShipperStreet2: $("#SHIPPER_Street2").val(),
                                    ShipperLocation: $("#SHIPPER_TownLocation").val(),
                                    ShipperState: $("#SHIPPER_State").val(),
                                    ShipperPostalCode: $("#SHIPPER_PostalCode").val(),
                                    ShipperCity: $("#Text_SHIPPER_City").data("kendoAutoComplete").key(),
                                    ShipperCountryCode: $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").key(),
                                    ShipperMobile: $("#SHIPPER_MobileNo").val(),
                                    ShipperMobile2: $("#SHIPPER_MobileNo2").val(),
                                    ShipperEMail: $("#SHIPPER_Email").val(),
                                    ShipperFax: $("#SHipper_Fax").val(),
                                    ShipperGarudaMiles: $("#SHipper_GarudaMiles").val(),
                                };

                                var ConsigneeViewMode = {
                                    SNo: "0",
                                    ReservationBookingSNo: "0",
                                    ReservationBookingRefNo: hdnBookingMasterRefNo,
                                    ConsigneeAccountNo: $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").key(),
                                    ConsigneeName: $("#CONSIGNEE_AccountNoName").val() == '' ? $('#Text_AWBAgent').val().split('-')[1] : $("#CONSIGNEE_AccountNoName").val(),
                                    ConsigneeName2: $("#CONSIGNEE_AccountNoName2").val(),
                                    ConsigneeStreet: $("#CONSIGNEE_Street").val(),
                                    ConsigneeStreet2: $("#CONSIGNEE_Street2").val(),
                                    ConsigneeLocation: $("#CONSIGNEE_TownLocation").val(),
                                    ConsigneeState: $("#CONSIGNEE_State").val(),
                                    ConsigneePostalCode: $("#CONSIGNEE_PostalCode").val(),
                                    ConsigneeCity: $("#Text_CONSIGNEE_City").data("kendoAutoComplete").key(),
                                    ConsigneeCountryCode: $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").key(),
                                    ConsigneeMobile: $("#CONSIGNEE_MobileNo").val(),
                                    ConsigneeMobile2: $("#CONSIGNEE_MobileNo2").val(),
                                    ConsigneeEMail: $("#CONSIGNEE_Email").val(),
                                    ConsigneeFax: $("#CONSIGNEE_Fax").val(),
                                };
                                var CreateShipperParticipants = $("#chkShipper").prop("checked") ? "1" : "0";
                                var CreateConsigneerParticipants = $("#chkconsignee").prop("checked") ? "1" : "0";
                                $.ajax({
                                    url: "Services/Report/NonExecutedBookingService.svc/AddBookingShipperandConsigneeInformation", async: false, type: "POST", dataType: "json", cache: false,
                                    data: JSON.stringify({ BookingRefNo: hdnBookingMasterRefNo, ReservationInformation: ReservationViewModel, ReservationItineraryInformation: ReservationItineraryViewModel, ReservationShipperInformation: ShipperViewModel, ReservationConsigneeInformation: ConsigneeViewMode, ShipperSno: $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").key() || "0", ConsigneeSno: $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").key() || "0", CreateShipperParticipants: CreateShipperParticipants, CreateConsigneerParticipants: CreateConsigneerParticipants, CallerCode: $("#hdnCallerCode").val() || "", BookingDate: $("#BookingDate").val() }),
                                    contentType: "application/json; charset=utf-8",
                                    success: function (result) {
                                        if (result.split('?')[0] == "0") {
                                            ShowMessage('success', 'Success - Reservation', "Processed Successfully", "bottom-right");
                                            HideTooltipSpanStyleInfo();
                                            AuditLogSaveNewValue("ApplicationTabs-1", true, ProcessNameDetails, "REFERENCENUMBER", hdnBookingMasterRefNo, 0, 'New', userContext.TerminalSNo, userContext.NewTerminalName);
                                            //Added by Shivali Thakur
                                            if (sessionStorage.getItem("auditlog") != null) {
                                                var auditLog = JSON.parse(sessionStorage.getItem("auditlog"));
                                                SaveAppendGridAuditLog(auditLog.KeyColumn, auditLog.KeyValue, auditLog.keySNo, auditLog.arrVal, auditLog.FormAction, auditLog.TerminalSNo, auditLog.TerminalName)
                                            }
                                            flag = true;
                                        }
                                        else if (result.split('?')[0] == "1") {
                                            ShowMessage('warning', 'Warning - Reservation', result.split('?')[1], "bottom-right");
                                            flag = false;
                                        }
                                        else if (result.split('?')[0] == "2") {
                                            ShowMessage('warning', 'Warning - Reservation', result.split('?')[1], "bottom-right");
                                            flag = true;
                                        }
                                        else if (result.split('?')[0] == "3") {
                                            ShowMessage('warning', 'Warning - Reservation', result.split('?')[1], "bottom-right");
                                            flag = false;
                                        }
                                        else if (result.split('?')[0] == "7") {
                                            ShowMessage('warning', 'Warning - Reservation', result.split('?')[1], "bottom-right");
                                            flag = false;
                                        }
                                        else if (result.split('?')[0] == "8") {
                                            ShowMessage('warning', 'Warning - Reservation', result.split('?')[1], "bottom-right");
                                            flag = false;
                                        }
                                        else if (result.split('?')[0] == "10") {
                                            ShowMessage('warning', 'Warning - Reservation', "AWB Stock not available.", "bottom-right");
                                            flag = false;
                                        }
                                        else if (result.split('?')[0] == "11") {
                                            ShowMessage('warning', 'Warning - Reservation', result.split('?')[1], "bottom-right");
                                            flag = false;
                                        }
                                        else {
                                            ShowMessage('warning', 'Warning - Reservation', "unable to process.", "bottom-right");
                                            flag = false;
                                        }
                                    },
                                    error: function (xhr) {
                                        ShowMessage('warning', 'Warning - Customer', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
                                        flag = false;
                                    }
                                });
                            }
                        }
                    }
              //  }

                //else {
                //    ShowMessage('warning', 'Warning - Reservation', "Pieces or Gross Weight or Volume not match Origin Destination Pair.", "bottom-right");
                //}
                return flag;
            }
        }
    }
}

function ResetDetails(obj, e) {

    $("#ApplicationTabs-1").html("");   
    $('#ApplicationTabs ul:first li:eq(0) a').hide();

}


function ApplyRequired() {
    $("#SHIPPER_Name").attr("data-valid", "required");
    $('#SHIPPER_Name').attr('data-valid-msg', 'Enter Shipper Name.');
    $("#SHIPPER_Street").attr("data-valid", "required");
    $('#SHIPPER_Street').attr('data-valid-msg', 'Enter Shipper Street.');
    $("#SHIPPER_TownLocation").attr("data-valid", "required");
    $('#SHIPPER_TownLocation').attr('data-valid-msg', 'Enter Shipper Town/Location.');
    $("#Text_SHIPPER_City").attr("data-valid", "required");
    $('#Text_SHIPPER_City').attr('data-valid-msg', 'Select Shipper City.');
    $("#Text_SHIPPER_CountryCode").attr("data-valid", "required");
    $('#Text_SHIPPER_CountryCode').attr('data-valid-msg', 'Select Shipper Country.');

    $("#CONSIGNEE_AccountNoName").attr("data-valid", "required");
    $('#CONSIGNEE_AccountNoName').attr('data-valid-msg', 'Enter Consignee Name.');
    $("#CONSIGNEE_Street").attr("data-valid", "required");
    $('#CONSIGNEE_Street').attr('data-valid-msg', 'Enter Consignee Street.');
    $("#CONSIGNEE_TownLocation").attr("data-valid", "required");
    $('#CONSIGNEE_TownLocation').attr('data-valid-msg', 'Enter Consignee Town/Location.');
    $("#Text_CONSIGNEE_City").attr("data-valid", "required");
    $('#Text_CONSIGNEE_City').attr('data-valid-msg', 'Select Consignee City.');
    $("#Text_CONSIGNEE_CountryCode").attr("data-valid", "required");
    $('#Text_CONSIGNEE_CountryCode').attr('data-valid-msg', 'Select Consignee Country.');

    $("#NatureOfGoods").attr("data-valid", "required");
    $('#NatureOfGoods').attr('data-valid-msg', 'Enter NOG.');

}


function CleanUI() {
    $("#ApplicationTabs-1").html("");
  

    $("#btnSave").unbind("click");
    $("#btnUpdate").unbind("click");
    $("#btnCopyBooking").unbind("click");
    $("#btnExecute").unbind("click");
    $("#ulReservation").hide();
    $("#ApplicationTabs").hide();

    $("#btnSave").css("display", "none");
    $("#btnUpdate").css("display", "none");
    $("#btnCopyBooking").css("display", "none");
    $("#btnExecute").css("display", "none");
    $("#btnNew").css("display", "block");
    $("#divEDox").html("");

  
}
function BindMinimumChWt() {

    $.ajax({
        url: "Services/Report/NonExecutedBookingService.svc/BindMinimumChWt",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key()
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0 && myData.Table0[0].ChWt > 0) {
                    IsChargeableWt = 1;
                    MinimumChWt = myData.Table0[0].ChWt;
                }
                else {
                    IsChargeableWt = 0;
                    MinimumChWt = 0;
                }
            }
            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
}
function DeleteRoute(e, DailFlightSNo, Origin, Destination, OriginSNo, DestinationSNo) {
    var thedivFlightSearchResult = document.getElementById("divFlightSearchResult");
    thedivFlightSearchResult.innerHTML = "";
    $(e).closest('tr').remove();
    $("#Text_ItineraryOrigin").data("kendoAutoComplete").setDefaultValue(OriginSNo, Origin);

    $("#Text_ItineraryDestination").data("kendoAutoComplete").setDefaultValue(DestinationSNo, Destination);
    var DailyFlightSNoForDelete = 0;
    var AWBPieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
    var AWBGrossWeight = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));
    var AWBCBM = ($("#AWBCBM").val() == "" ? 0 : parseFloat($("#AWBCBM").val()));
    var AWBVolumeWeight = ($("#AWBVolumeWeight").val() == "" ? 0 : parseFloat($("#AWBVolumeWeight").val()));
    var ItineraryOrigin = $("#Text_ItineraryOrigin").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryOrigin").data("kendoAutoComplete").value().split('-')[0];
    var ItineraryDestination = $("#Text_ItineraryDestination").data("kendoAutoComplete").value() == "" ? "" : $("#Text_ItineraryDestination").data("kendoAutoComplete").value().split('-')[0];
    var SelectedItineraryPieces = 0;
    var SelectedItineraryGrossWeight = 0;
    var SelectedItineraryCBM = 0;
    var SelectedItineraryMainVolumeWeight = 0;
    var RemainingPieces = 0;
    var RemainingItineraryGrossWeight = 0;
    var RemainingItineraryCBM = 0;
    var RemainingItineraryMainVolumeWeight = 0;
    var table = document.getElementById("tblSelectdRouteResult");
    if (table != null && table.rows.length > 1) {
        $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
            DailyFlightSNoForDelete = $(tr)[0].id;
            $("#hdnETDTime").val($(tr).find("td")[6].innerText.split("/")[1]);
            $("#hdnFlightDate").val($(tr).find("td")[1].innerText);
            $("#hdnArrFlightDate").val($(tr).find("input[id^='hdnArrFlightDate_']").val());
            if (ItineraryOrigin == $(tr).find("td")[2].innerText.split("/")[0] && ItineraryDestination == $(tr).find("td")[2].innerText.split("/")[1]) {
                SelectedItineraryPieces = parseInt(SelectedItineraryPieces) + parseInt($(tr).find("td")[3].innerText);
                SelectedItineraryGrossWeight = parseFloat(SelectedItineraryGrossWeight) + parseFloat($(tr).find("td")[4].innerText);
                SelectedItineraryCBM = parseFloat(SelectedItineraryCBM) + parseFloat($(tr).find("td")[5].innerText);
                SelectedItineraryMainVolumeWeight = parseFloat(parseFloat(SelectedItineraryMainVolumeWeight) + parseFloat($(tr).find("input[id^='hdnItineraryMainVolumeWeight_']").val())).toFixed(2);
            }
        });
    }
    RemainingPieces = parseInt(AWBPieces) - parseInt(SelectedItineraryPieces);
    RemainingItineraryGrossWeight = (parseFloat(AWBGrossWeight) - parseFloat(SelectedItineraryGrossWeight)).toFixed(2);
    RemainingItineraryCBM = (parseFloat(AWBCBM) - parseFloat(SelectedItineraryCBM)).toFixed(3);
    RemainingItineraryMainVolumeWeight = (parseFloat(AWBVolumeWeight) - parseFloat(SelectedItineraryMainVolumeWeight)).toFixed(2);
    if (SelectedItineraryPieces < AWBPieces) {
        $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(false)
        $("#Text_ItineraryDestination").data("kendoAutoComplete").enable(false)
        $("#ItineraryPieces").val(RemainingPieces == 0 ? '' : RemainingPieces)
        $("#_tempItineraryPieces").val(RemainingPieces == 0 ? '' : RemainingPieces)

        $("#ItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? '' : RemainingItineraryGrossWeight)
        $("#_tempItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? '' : RemainingItineraryGrossWeight)
        $("#ItineraryVolumeWeight").val(RemainingItineraryCBM == 0.000 ? '' : RemainingItineraryCBM)
        $("#_tempItineraryVolumeWeight").val(RemainingItineraryCBM == 0.000 ? '' : RemainingItineraryCBM)
        $("#ItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? '' : RemainingItineraryMainVolumeWeight)
        $("#_tempItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? '' : RemainingItineraryMainVolumeWeight)
    }
    else {
        $("#Text_ItineraryOrigin").data("kendoAutoComplete").enable(true)
        $("#Text_ItineraryDestination").data("kendoAutoComplete").enable(true)
        $("#ItineraryPieces").val(RemainingPieces == 0 ? '' : RemainingPieces)
        $("#_tempItineraryPieces").val(RemainingPieces == 0 ? '' : RemainingPieces)

        $("#ItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? '' : RemainingItineraryGrossWeight)
        $("#_tempItineraryGrossWeight").val(RemainingItineraryGrossWeight == 0.00 ? '' : RemainingItineraryGrossWeight)
        $("#ItineraryVolumeWeight").val(RemainingItineraryCBM == 0.000 ? '' : RemainingItineraryCBM)
        $("#_tempItineraryVolumeWeight").val(RemainingItineraryCBM == 0.000 ? '' : RemainingItineraryCBM)
        $("#ItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? '' : RemainingItineraryMainVolumeWeight)
        $("#_tempItineraryMainVolumeWeight").val(RemainingItineraryMainVolumeWeight == 0.00 ? '' : RemainingItineraryMainVolumeWeight)
    }
    if (table != null && table.rows.length == 1) {

        ClearItineraryRoute();
    }
    $("#Delete_" + DailyFlightSNoForDelete).css("display", "block");
}



function RateAvailableOrNotNEW(FlightDate, FlightNo, AllotmentCode) {
    var Result = false;
    var BUPPieces = ($("#AWBNoofBUP").val() == "" ? 0 : parseFloat($("#AWBNoofBUP").val()));
    var AWBNoofBUPIntact = ($("#AWBNoofBUPIntact").val() == "" ? 0 : parseFloat($("#AWBNoofBUPIntact").val()));
    var BUPORIntactPieces = 0;
    if (BUPPieces > 0)
        BUPORIntactPieces = BUPPieces;
    else if (AWBNoofBUPIntact > 0)
        BUPORIntactPieces = AWBNoofBUPIntact;
    var Product = $("#Text_Product").data("kendoAutoComplete").value().toUpperCase();
    if (ServiceableProduct.length > 0) {
        if ($.inArray(Product, ServiceableProduct[0]) != '-1')
            Result = true;
    }

    //if ($("#Text_Product").data("kendoAutoComplete").value().toUpperCase() == "COMET")
    //    Result = true;
    //else {
    if (Result == false) {
        $.ajax({
            url: "Services/Report/NonExecutedBookingService.svc/RateAvailableOrNotNEW",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                BookingType: $('input:radio[name=BookingType]:checked').val(),
                AWBStock: $('input:radio[name=AWBStock]:checked').val(),
                AWBPrefix: $("#Text_AWBCode").data("kendoAutoComplete").key(),
                PaymentType: $("#Text_ChargeCode").data("kendoAutoComplete").key(),
                IsBUP: $("#chkIsBUP").prop('checked') == true ? 1 : 0,
                //BupPieces: $("#chkIsBUP").prop('checked') == true ? $("#AWBNoofBUP").val() : 0,
                BupPieces: $("#chkIsBUP").prop('checked') == true ? BUPORIntactPieces : 0,
                ProductSNo: $("#Text_Product").data("kendoAutoComplete").key(),
                OriginCity: $("#Text_AWBOrigin").data("kendoAutoComplete").value().split('-')[0],
                DestinationCity: $("#Text_AWBDestination").data("kendoAutoComplete").value().split('-')[0],
                AccountSNo: $("#Text_AWBAgent").data("kendoAutoComplete").key(),
                AWBPieces: $("#AWBPieces").val(),
                GrossWeight: $("#AWBGrossWeight").val(),
                VolumeWeight: $("#AWBVolumeWeight").val(),
                ChargeableWeight: $("#AWBChargeableWeight").val(),
                Volume: $("#AWBCBM").val(),
                UM: $("#Text_UM").data("kendoAutoComplete").value(),
                CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
                NOG: $("#NatureOfGoods").val(),
                SPHC: $("#Text_SHC").data("kendoAutoComplete").key(),
                FlightDate: FlightDate,
                FlightNo: FlightNo,
                BookingReferenceNo: $("#hdnBookingMasterRefNo").val(),
                AllotmentCode: AllotmentCode
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        if (myData.Table0[0].FinalRate != "") {
                            Result = true;
                        }
                        else {
                            Result = false;
                        }
                    }
                }
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
    return Result;
}
function RateAvailableOrNot() {
    var Result = false;
    var BUPPieces = ($("#AWBNoofBUP").val() == "" ? 0 : parseFloat($("#AWBNoofBUP").val()));
    var AWBNoofBUPIntact = ($("#AWBNoofBUPIntact").val() == "" ? 0 : parseFloat($("#AWBNoofBUPIntact").val()));
    var BUPORIntactPieces = 0;
    if (BUPPieces > 0)
        BUPORIntactPieces = BUPPieces;
    else if (AWBNoofBUPIntact > 0)
        BUPORIntactPieces = AWBNoofBUPIntact;
    var Product = $("#Text_Product").data("kendoAutoComplete").value().toUpperCase();
    if (ServiceableProduct.length > 0) {
        if ($.inArray(Product, ServiceableProduct[0]) != '-1')
            Result = true;
    }

    //if ($("#Text_Product").data("kendoAutoComplete").value().toUpperCase() == "COMET")
    //    Result = true;
    //else {
    if (Result == false) {
        $.ajax({
            url: "Services/Report/NonExecutedBookingService.svc/RateAvailableOrNot",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                BookingType: $('input:radio[name=BookingType]:checked').val(),
                AWBStock: $('input:radio[name=AWBStock]:checked').val(),
                AWBPrefix: $("#Text_AWBCode").data("kendoAutoComplete").key(),
                PaymentType: $("#Text_ChargeCode").data("kendoAutoComplete").key(),
                IsBUP: $("#chkIsBUP").prop('checked') == true ? 1 : 0,
                //BupPieces: $("#chkIsBUP").prop('checked') == true ? $("#AWBNoofBUP").val() : 0,
                BupPieces: $("#chkIsBUP").prop('checked') == true ? BUPORIntactPieces : 0,
                ProductSNo: $("#Text_Product").data("kendoAutoComplete").key(),
                OriginCity: $("#Text_AWBOrigin").data("kendoAutoComplete").value().split('-')[0],
                DestinationCity: $("#Text_AWBDestination").data("kendoAutoComplete").value().split('-')[0],
                AccountSNo: $("#Text_AWBAgent").data("kendoAutoComplete").key(),
                AWBPieces: $("#AWBPieces").val(),
                GrossWeight: $("#AWBGrossWeight").val(),
                VolumeWeight: $("#AWBVolumeWeight").val(),
                ChargeableWeight: $("#AWBChargeableWeight").val(),
                Volume: $("#AWBCBM").val(),
                UM: $("#Text_UM").data("kendoAutoComplete").value(),
                CommoditySNo: $("#Text_Commodity").data("kendoAutoComplete").key(),
                NOG: $("#NatureOfGoods").val(),
                SPHC: $("#Text_SHC").data("kendoAutoComplete").key(),
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        if (myData.Table0[0].FinalRate != "") {
                            Result = true;
                        }
                        else {
                            Result = false;
                        }
                    }
                }
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
    return Result;
}

function ExtraCondition(textId) {
    if (textId.indexOf("Text_Product") >= 0 && textId.indexOf("Text_Product") < 2) {
        GetProductAsPerAgent();
    }
    if (userContext.AgentSNo > 0) {
        if (textId.indexOf("Text_AWBAgent") >= 0 && textId.indexOf("Text_AWBAgent") < 2) {
            GetAccountAirlineTransDetails();
        }
    }
    var MainfiltertblDimensionULDTab_ULDTypeSNo = cfi.getFilter("AND");
    var filterAWBAgent = cfi.getFilter("AND");
    var MainfilterOtherNatureofGoods = cfi.getFilter("AND");
    var SPHCDGRFilter = cfi.getFilter("AND");
    var filterShipperCity = cfi.getFilter("AND");
    var filterConsigneeCity = cfi.getFilter("AND");
    var ShipperAccountFilter = cfi.getFilter("AND");
    var ConsigneeFilter = cfi.getFilter("AND");
    var ItineraryFlightNoFilter = cfi.getFilter("AND");
    var AllotmentFilter = cfi.getFilter("AND");
    var AWBOriginFilter = cfi.getFilter("AND");
    var AWBDestinationFilter = cfi.getFilter("AND");
    var searchOriginCityFilter = cfi.getFilter("AND");
    var searchDestinationCityFilter = cfi.getFilter("AND");
    var ItineraryOriginFilter = cfi.getFilter("AND");
    var ItineraryDestinationFilter = cfi.getFilter("AND");
    var SPHCFilter = cfi.getFilter("AND");
    var filterUnNo = cfi.getFilter("AND");
    var filterSubRisk = cfi.getFilter("AND");
    var filterSLINo = cfi.getFilter("AND");
    var filterPakagingGroup = cfi.getFilter("AND");
    var filterPackingInst = cfi.getFilter("AND");
    var filterErg = cfi.getFilter("AND");
    var SHCSubGrioupFilter = cfi.getFilter("AND");
    var DocTypeFilter = cfi.getFilter("AND");
    var AWBCodeFilter = cfi.getFilter("AND");
    var ItineraryCarrierCodeFilter = cfi.getFilter("AND");
    var searchReferenceNoFilter = cfi.getFilter("AND");
    var searchAWBNoFilter = cfi.getFilter("AND");
    var ProductFilter = cfi.getFilter("AND");
    var filterNotifyCity = cfi.getFilter("AND");
    var filterMCommoditiy = cfi.getFilter("AND");
    var filterPriority = cfi.getFilter("AND");
    var filterDueCarrierCode = cfi.getFilter("AND");
    var searchHSCode = cfi.getFilter("AND");
    var searchOriginAirportFilter = cfi.getFilter("AND");
    var searchDestinationAirportFilter = cfi.getFilter("AND");

    if (textId.indexOf("tblDimensionULDTab_ULDTypeSNo") >= 0) {
        var FilterAirlineCode = "";
        if ($("#Text_AWBCode").data("kendoAutoComplete").key() != "" && $("#Text_AWBCode").data("kendoAutoComplete").key() != undefined) {
            FilterAirlineCode = $("#Text_AWBCode").data("kendoAutoComplete").key();
        }
        else if (userContext.AirlineName != null && userContext.AirlineName != "") {
            if (userContext.AirlineName.length > 6) {
                FilterAirlineCode = userContext.AirlineName.split('-')[0];
            }
        }

        //var filtertblDimensionULDTab_ULDTypeSNo = cfi.getFilter("AND");
        //cfi.setFilter(filtertblDimensionULDTab_ULDTypeSNo, "AirlineCode", "eq", FilterAirlineCode);

        //MainfiltertblDimensionULDTab_ULDTypeSNo = cfi.autoCompleteFilter(filtertblDimensionULDTab_ULDTypeSNo);
        //return MainfiltertblDimensionULDTab_ULDTypeSNo;
    }
    else if (textId.indexOf("Text_Notify_City") >= 0) {
        var filterNCity = cfi.getFilter("AND");
        cfi.setFilter(filterNCity, "CountrySNo", "eq", $("#Text_Notify_CountryCode").data("kendoAutoComplete").key());
        filterNotifyCity = cfi.autoCompleteFilter(filterNCity);
        return filterNotifyCity;
    }
    else if (textId.indexOf("Text_Product") >= 0) {
        //var BookingType = $('input:radio[name=BookingType]:checked').val();
        //if (BookingType == 1) {

        //}
        if (ProductAsPerAgent != "" && ProductAsPerAgent != "0") {
            var filterProduct = cfi.getFilter("AND");
            cfi.setFilter(filterProduct, "SNo", "in", ProductAsPerAgent);
            ProductFilter = cfi.autoCompleteFilter(filterProduct);
            return ProductFilter;
        }
    }
    else if (textId.indexOf("Text_ItineraryFlightNo") >= 0) {
       
        var filter = cfi.getFilter("AND");
        if ($("#Text_ItineraryCarrierCode").data("kendoAutoComplete").key() != "")
            cfi.setFilter(filter, "CarrierCode", "eq", $("#Text_ItineraryCarrierCode").data("kendoAutoComplete").key());

        cfi.setFilter(filter, "OriginAirportSno", "eq", $("#ItineraryOrigin").val());
       cfi.setFilter(filter, "DestinationAirportSno", "eq", $("#ItineraryDestination").val());

        cfi.setFilter(filter, "FlightDate", "eq", $("#ItineraryDate").val());
        cfi.setFilter(filter, "IsCancelled", "eq", "0");
        ItineraryFlightNoFilter = cfi.autoCompleteFilter(filter);
        return ItineraryFlightNoFilter;
    }
    else if (textId.indexOf("Text_AWBCode") >= 0) {
        var filterAWBCode = cfi.getFilter("AND");
        //if (userContext.GroupName == "POS-OPS" || userContext.GroupName == "POS-KSO" || userContext.GroupName == "POS-CSC")
        //if (userContext.GroupName == "POS-OPS" || userContext.GroupName == "POS-KSO" || userContext.GroupName == "POS-CSC" || userContext.AgentSNo > 0)
        if (userContext.SysSetting.ICMSEnvironment == 'JT') {
            if (userContext.AgentSNo > 0) {
                if (OtherAirlineAccess != "1" && OtherAirlineAccess != "" && OtherAirlineAccess != undefined)
                    cfi.setFilter(filterAWBCode, "SNo", "in", OtherAirlineAccess);
            }
            AWBCodeFilter = cfi.autoCompleteFilter(filterAWBCode);
            return AWBCodeFilter;
        }
    }
    else if (textId.indexOf("Text_ItineraryCarrierCode") >= 0) {
        var filterItineraryCarrierCode = cfi.getFilter("AND");
        //if (userContext.GroupName == "POS-OPS" || userContext.GroupName == "POS-KSO" || userContext.GroupName == "POS-CSC")
        //	cfi.setFilter(filterItineraryCarrierCode, "IsInterline", "notin", 1);
        ItineraryCarrierCodeFilter = cfi.autoCompleteFilter(filterItineraryCarrierCode);
        return ItineraryCarrierCodeFilter;
    }
    else if (textId.indexOf("Text_AWBOrigin") >= 0) {
        var filterAWBOrigin = cfi.getFilter("AND");
        cfi.setFilter(filterAWBOrigin, "SNo", "notin", $("#Text_AWBDestination").data("kendoAutoComplete").key());
        if (userContext.SysSetting.ICMSEnvironment != 'GA') {
            if (AgentMultiOriginPermission != "1")
                cfi.setFilter(filterAWBOrigin, "SNo", "in", AgentMultiOriginPermission);
            //if (userContext.AgentSNo > 0)
            //    cfi.setFilter(filterAWBOrigin, "SNo", "in", AgentMultiOriginPermission);
        }
        AWBOriginFilter = cfi.autoCompleteFilter(filterAWBOrigin);
        return AWBOriginFilter;
    }
    else if (textId.indexOf("Text_AWBDestination") >= 0) {
        var filterAWBDestination = cfi.getFilter("AND");
        cfi.setFilter(filterAWBDestination, "SNo", "notin", $("#Text_AWBOrigin").data("kendoAutoComplete").key());
        AWBDestinationFilter = cfi.autoCompleteFilter(filterAWBDestination);
        return AWBDestinationFilter;

    }
    else if (textId.indexOf("Text_ItineraryOrigin") >= 0) {
        var filterItineraryOrigin = cfi.getFilter("AND");
        cfi.setFilter(filterItineraryOrigin, "SNo", "notin", $("#Text_ItineraryDestination").data("kendoAutoComplete").key());
        ItineraryOriginFilter = cfi.autoCompleteFilter(filterItineraryOrigin);
        return ItineraryOriginFilter;
    }
    else if (textId.indexOf("Text_ItineraryDestination") >= 0) {
        var filterItineraryDestination = cfi.getFilter("AND");
        cfi.setFilter(filterItineraryDestination, "SNo", "notin", $("#Text_ItineraryOrigin").data("kendoAutoComplete").key());
        ItineraryDestinationFilter = cfi.autoCompleteFilter(filterItineraryDestination);
        return ItineraryDestinationFilter;
    }
    else if (textId.indexOf("Text_searchReferenceNo") >= 0) {
        var filtersearchReferenceNo = cfi.getFilter("AND");
        //cfi.setFilter(filtersearchReferenceNo, "OriginCitySNo", "eq", userContext.CitySNo);
        if (AgentMultiOriginPermission != "1")
            cfi.setFilter(filtersearchReferenceNo, "OriginCitySNo", "in", AgentMultiOriginPermission);
        searchReferenceNoFilter = cfi.autoCompleteFilter(filtersearchReferenceNo);
        return searchReferenceNoFilter;
    }
    else if (textId.indexOf("Text_searchAWBNo") >= 0) {
        var filtersearchAWBNo = cfi.getFilter("AND");
        //cfi.setFilter(filtersearchAWBNo, "OriginCitySNo", "eq", userContext.CitySNo);
        if (AgentMultiOriginPermission != "1")
            cfi.setFilter(filtersearchAWBNo, "OriginCitySNo", "in", AgentMultiOriginPermission);
        searchAWBNoFilter = cfi.autoCompleteFilter(filtersearchAWBNo);
        return searchAWBNoFilter;
    }
    else if (textId.indexOf("Text_searchOriginCity") >= 0) {
        var filtersearchOriginCity = cfi.getFilter("AND");
        cfi.setFilter(filtersearchOriginCity, "CityCode", "notin", $("#Text_searchDestinationCity").data("kendoAutoComplete").key());
        searchOriginCityFilter = cfi.autoCompleteFilter(filtersearchOriginCity);
        return searchOriginCityFilter;
    }
    else if (textId.indexOf("Text_searchDestinationCity") >= 0) {
        var filtersearchDestinationCity = cfi.getFilter("AND");
        cfi.setFilter(filtersearchDestinationCity, "CityCode", "notin", $("#Text_searchOriginCity").data("kendoAutoComplete").key());
        searchDestinationCityFilter = cfi.autoCompleteFilter(filtersearchDestinationCity);
        return searchDestinationCityFilter;
    }
    else if (textId.indexOf("Text_Allotment_") >= 0) {
        var result = textId.split('_')[2];
        var filterAllotment = cfi.getFilter("AND");
        cfi.setFilter(filterAllotment, "DailyFlightSNo", "eq", result);
        cfi.setFilter(filterAllotment, "AccountSNo", "eq", $("#Text_AWBAgent").data("kendoAutoComplete").key());
        AllotmentFilter = cfi.autoCompleteFilter(filterAllotment);
        return AllotmentFilter;
    }
    else if (textId.indexOf("Text_AWBAgent") >= 0) {
        var FilterAirlineCode = "";
        if (userContext.AirlineName != null && userContext.AirlineName != "") {
            if (userContext.AirlineName.length > 6) {
                FilterAirlineCode = userContext.AirlineName.split('-')[0];
            }
        }
        var AWBAgentfilter = cfi.getFilter("AND");
        var AWBAgentfilterOR = cfi.getFilter("OR");
        if (userContext.SysSetting.InterlineAgentSNo != "" && userContext.SysSetting.InterlineAgentSNo != undefined)
            cfi.setFilter(AWBAgentfilter, "SNo", "notin", userContext.SysSetting.InterlineAgentSNo);
        if (userContext.SysSetting.ICMSEnvironment == 'GA') {
            //cfi.setFilter(AWBAgentfilter, "CitySNo", "in", "" + $("#Text_AWBOrigin").data("kendoAutoComplete").key() + ',' + userContext.CitySNo + "");
            cfi.setFilter(AWBAgentfilter, "CitySNo", "in", "" + userContext.CitySNo + "");
        }
        else
            cfi.setFilter(AWBAgentfilter, "CitySNo", "eq", $("#Text_AWBOrigin").data("kendoAutoComplete").key());

        // cfi.setFilter(AWBAgentfilter, "AirlineCode", "eq", FilterAirlineCode);
        //cfi.setFilter(AWBAgentfilter, "AirlineCode", "eq", $("#Text_AWBCode").data("kendoAutoComplete").key());//agent was not comming of othere ailine due to userContext.AirlineName condition
        if (userContext.GroupName == "POS-OPS" || userContext.GroupName == "POS-KSO" || userContext.GroupName == "POS-CSC") {
            //cfi.setFilter(AWBAgentfilter, "AccountTypeName", "in", "POS,SUB AGENT,CORPORATE");
            cfi.setFilter(AWBAgentfilter, "AirlineCode", "eq", $("#Text_AWBCode").data("kendoAutoComplete").key());
            if (userContext.OfficeSNo > 0) {
                cfi.setFilter(AWBAgentfilter, "AccountTypeName", "neq", "FORWARDER");
                if (userContext.GroupName == "POS-CSC")
                    cfi.setFilter(AWBAgentfilter, "AccountTypeName", "in", "SUB AGENT,CORPORATE,POST OFFICE");
                else
                    cfi.setFilter(AWBAgentfilter, "AccountTypeName", "in", "SUB AGENT,CORPORATE");
                cfi.setFilter(AWBAgentfilterOR, "OfficeSNo", "eq", userContext.OfficeSNo);
            }
            else {
                if (userContext.GroupName == "POS-CSC")
                    cfi.setFilter(AWBAgentfilter, "AccountTypeName", "in", "POS,SUB AGENT,CORPORATE,POST OFFICE");
                else
                    cfi.setFilter(AWBAgentfilter, "AccountTypeName", "in", "POS,SUB AGENT,CORPORATE");
            }
        }
        else if (userContext.GroupName == "OUTLET") {
            cfi.setFilter(AWBAgentfilter, "AirlineCode", "eq", $("#Text_AWBCode").data("kendoAutoComplete").key());
            cfi.setFilter(AWBAgentfilter, "AccountTypeName", "in", "OUTLET");
        }
        else if (userContext.GroupName == "ADMIN" || userContext.GroupName == "SUPER ADMIN") {
            cfi.setFilter(AWBAgentfilter, "TransAirlineCode", "contains", $("#Text_AWBCode").data("kendoAutoComplete").key());

            //cfi.setFilter(AWBAgentfilter, "AirlineCode", "eq", $("#Text_AWBCode").data("kendoAutoComplete").key());
            ////cfi.setFilter(AWBAgentfilter, "CitySNo", "eq", $("#Text_AWBOrigin").data("kendoAutoComplete").key());
        }

        else if (userContext.UserTypeName == "GSA" || userContext.UserTypeName == "CSA" || userContext.UserTypeName == "GSSA") {
            cfi.setFilter(AWBAgentfilter, "AirlineCode", "eq", $("#Text_AWBCode").data("kendoAutoComplete").key());
            cfi.setFilter(AWBAgentfilter, "OfficeSNo", "eq", userContext.OfficeSNo);
        }
        else {
            if (userContext.AgentSNo > 0) {
                if (AccountAirlineTransDetails != '')
                    cfi.setFilter(AWBAgentfilter, "AirlineCode", "in", AccountAirlineTransDetails);
                else
                    cfi.setFilter(AWBAgentfilter, "AirlineCode", "eq", $("#Text_AWBCode").data("kendoAutoComplete").key());
                cfi.setFilter(AWBAgentfilter, "AccountTypeName", "eq", "FORWARDER");
            }
            else {
                cfi.setFilter(AWBAgentfilter, "AirlineCode", "eq", $("#Text_AWBCode").data("kendoAutoComplete").key());
                //cfi.setFilter(AWBAgentfilter, "CitySNo", "eq", $("#Text_AWBOrigin").data("kendoAutoComplete").key());
            }
        }
        if ($('input:radio[name=BookingType]:checked').val() == "2")
            cfi.setFilter(AWBAgentfilter, "AccountTypeName", "eq", "GO BAGGAGE");
        if ((userContext.GroupName == "POS-OPS" || userContext.GroupName == "POS-KSO" || userContext.GroupName == "POS-CSC") && userContext.OfficeSNo > 0) {
            filterAWBAgent = cfi.autoCompleteFilter([AWBAgentfilter, AWBAgentfilterOR], "OR");
        }
        else {
            filterAWBAgent = cfi.autoCompleteFilter(AWBAgentfilter);
        }

        ////filterAWBAgent = cfi.autoCompleteFilter(AWBAgentfilter);
        //filterAWBAgent = cfi.autoCompleteFilter([AWBAgentfilter, AWBAgentfilterOR], "OR");
        return filterAWBAgent;
    }
    else if (textId.indexOf("Text_OtherNatureofGoods") >= 0) {
        var filterOtherNatureofGoods = cfi.getFilter("AND");
        cfi.setFilter(filterOtherNatureofGoods, "CommoditySNo", "notin", $("#Text_OtherNatureofGoods").data("kendoAutoComplete").key());
        for (var i = 0; i <= 10; i++) {
            if ($('#OtherNatureofGoods_' + [i]).val() != undefined && $('#OtherNatureofGoods_' + [i]).val() != '' && 'OtherNatureofGoods_' + [i] != 'OtherNatureofGoods_' + textId.split('_')[2])
                cfi.setFilter(filterOtherNatureofGoods, "CommoditySNo", "notin", $('#OtherNatureofGoods_' + [i]).val());
        }
        MainfilterOtherNatureofGoods = cfi.autoCompleteFilter(filterOtherNatureofGoods);
        return MainfilterOtherNatureofGoods;
    }
    else if (textId.indexOf("Text_SHC") >= 0) {
        var filterSPHC2 = cfi.getFilter("AND");
        //cfi.setFilter(filterSPHC2, "IsDGR", "eq", "0");
        cfi.setFilter(filterSPHC2, "SNo", "notin", $("#SHC").val());
        SPHCDGRFilter = cfi.autoCompleteFilter(filterSPHC2);
        return SPHCDGRFilter;
    }
    else if (textId.indexOf("Text_SHIPPER_City") >= 0) {
        var filterSCity = cfi.getFilter("AND");
        cfi.setFilter(filterSCity, "CountrySNo", "eq", $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").key());
        cfi.setFilter(filterSCity, "SNo", "notin", $("#Text_CONSIGNEE_City").data("kendoAutoComplete").key());
        cfi.setFilter(filterSCity, "SNo", "notin", $("#Text_AWBDestination").data("kendoAutoComplete").key());
        filterShipperCity = cfi.autoCompleteFilter(filterSCity);
        return filterShipperCity;
    }
    else if (textId.indexOf("Text_CONSIGNEE_City") >= 0) {
        var filterCCity = cfi.getFilter("AND");
        cfi.setFilter(filterCCity, "CountrySNo", "eq", $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").key());
        cfi.setFilter(filterCCity, "SNo", "notin", $("#Text_SHIPPER_City").data("kendoAutoComplete").key());
        cfi.setFilter(filterCCity, "SNo", "notin", $("#Text_AWBOrigin").data("kendoAutoComplete").key());
        filterConsigneeCity = cfi.autoCompleteFilter(filterCCity);
        return filterConsigneeCity;
    }
        //else if (textId.indexOf("Text_SHIPPER_CountryCode") >= 0) {
        //    var filterSCity = cfi.getFilter("AND");
        //    cfi.setFilter(filterSCity, "SNo", "eq", $("#Text_AWBOrigin").data("kendoAutoComplete").key());
        //    filterShipperCity = cfi.autoCompleteFilter(filterSCity);
        //    return filterShipperCity;
        //}
        //else if (textId.indexOf("Text_CONSIGNEE_CountryCode") >= 0) {
        //    var filterCCity = cfi.getFilter("AND");
        //    cfi.setFilter(filterCCity, "SNo", "eq", $("#Text_AWBDestination").data("kendoAutoComplete").key());
        //    filterConsigneeCity = cfi.autoCompleteFilter(filterCCity);
        //    return filterConsigneeCity;
        //}

    else if ((textId.indexOf("SHIPPER_AccountNo") >= 0) || (textId.indexOf("SHIPPER_Name") >= 0)) {
        var SHIPPER_AccountNo2 = cfi.getFilter("AND");
        if (userContext.SysSetting.IsShowShipperConsigneeOnAgent == "True" && userContext.AgentSNo > 0) {
            cfi.setFilter(SHIPPER_AccountNo2, "CustomerTypeName", "eq", "SHIPPER");
            cfi.setFilter(SHIPPER_AccountNo2, "CitySNo", "eq", $("#Text_AWBOrigin").data("kendoAutoComplete").key());
            cfi.setFilter(SHIPPER_AccountNo2, "AccountSNo", "eq", $("#Text_AWBAgent").data("kendoAutoComplete").key());
            ShipperAccountFilter = cfi.autoCompleteFilter(SHIPPER_AccountNo2);
            return ShipperAccountFilter;
        }
        else {
            cfi.setFilter(SHIPPER_AccountNo2, "CustomerTypeName", "eq", "SHIPPER");
            cfi.setFilter(SHIPPER_AccountNo2, "CitySNo", "eq", $("#Text_AWBOrigin").data("kendoAutoComplete").key());
            ShipperAccountFilter = cfi.autoCompleteFilter(SHIPPER_AccountNo2);
            return ShipperAccountFilter;
        }
    }
    else if ((textId.indexOf("CONSIGNEE_AccountNo") >= 0) || (textId.indexOf("CONSIGNEE_AccountNoName") >= 0)) {
        var ConsigneeFilter2 = cfi.getFilter("AND");
        if (userContext.SysSetting.IsShowShipperConsigneeOnAgent == "True" && userContext.AgentSNo > 0) {
            cfi.setFilter(ConsigneeFilter2, "CustomerTypeName", "eq", "CONSIGNEE");
            cfi.setFilter(ConsigneeFilter2, "CitySNo", "eq", $("#Text_AWBDestination").data("kendoAutoComplete").key());
            cfi.setFilter(ConsigneeFilter2, "AccountSNo", "eq", $("#Text_AWBAgent").data("kendoAutoComplete").key());
            ConsigneeFilter = cfi.autoCompleteFilter(ConsigneeFilter2);
            return ConsigneeFilter;
        }
        else {
            cfi.setFilter(ConsigneeFilter2, "CustomerTypeName", "eq", "CONSIGNEE");
            cfi.setFilter(ConsigneeFilter2, "CitySNo", "eq", $("#Text_AWBDestination").data("kendoAutoComplete").key());
            ConsigneeFilter = cfi.autoCompleteFilter(ConsigneeFilter2);
            return ConsigneeFilter;
        }
    }
    else if (textId.indexOf("Text_SPHC") >= 0) {
        var filterSPHC1 = cfi.getFilter("AND");
        cfi.setFilter(filterSPHC1, "IsDGR", "eq", "1");
        SPHCFilter = cfi.autoCompleteFilter(filterSPHC1);
        return SPHCFilter;
    }
    else if (textId.indexOf("Text_UnNo") >= 0) {
        var _filterUnNo = cfi.getFilter("AND");
        cfi.setFilter(_filterUnNo, "UNNumber", "neq", '');
        filterUnNo = cfi.autoCompleteFilter(_filterUnNo);
        return filterUnNo;
    }
    else if (textId.indexOf("Text_SubRisk") >= 0) {
        var _filterSubRisk = cfi.getFilter("AND");
        cfi.setFilter(_filterSubRisk, "SubRisk", "neq", '');
        cfi.setFilter(_filterSubRisk, "ID", "eq", $("#" + textId).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete").key());
        filterSubRisk = cfi.autoCompleteFilter(_filterSubRisk);
        return filterSubRisk;
    }
    else if (textId.indexOf("Text_Class") >= 0) {
        var _filterSLINo = cfi.getFilter("AND");
        cfi.setFilter(_filterSLINo, "ClassDivSub", "neq", '');
        cfi.setFilter(_filterSLINo, "ID", "eq", $("#" + textId).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete").key());
        filterSLINo = cfi.autoCompleteFilter(_filterSLINo);
        return filterSLINo;
    }
    else if (textId.indexOf("Text_PackingGroup") >= 0) {
        var _filterPakagingGroup = cfi.getFilter("AND");
        cfi.setFilter(_filterPakagingGroup, "PackingGroup", "neq", '');
        cfi.setFilter(_filterPakagingGroup, "UNNumber", "eq", $("#" + textId).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete").value().split("-")[0]);
        filterPakagingGroup = cfi.autoCompleteFilter(_filterPakagingGroup);
        return filterPakagingGroup;
    }
    else if (textId.indexOf("Text_PackingInst") >= 0) {
        var _filterPackingInst = cfi.getFilter("AND");
        cfi.setFilter(_filterPackingInst, "PackingInst", "neq", '');
        cfi.setFilter(_filterPackingInst, "UNNumber", "eq", $("#" + textId).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete").value().split("-")[0]);
        if (($("#" + textId).closest('tr').find("input[id^='Text_PackingGroup']").data("kendoAutoComplete").key() || 0) != 0) {
            cfi.setFilter(_filterPackingInst, "PackingGroup", "eq", $("#" + textId).closest('tr').find("input[id^='Text_PackingGroup']").data("kendoAutoComplete").value());
        }
        filterPackingInst = cfi.autoCompleteFilter(_filterPackingInst);
        return filterPackingInst;
    }
    else if (textId.indexOf("Text_ERG") >= 0) {
        var _filterErg = cfi.getFilter("AND");
        cfi.setFilter(_filterErg, "ERGN", "neq", '');
        cfi.setFilter(_filterErg, "ID", "eq", $("#" + textId).closest('tr').find("input[id^='Text_UnNo']").data("kendoAutoComplete").key());
        filterErg = cfi.autoCompleteFilter(_filterErg);
        return filterErg;
    }
    else if (textId.indexOf("Text_SubGroup_") >= 0) {
        var _SHCSubgrpErg = cfi.getFilter("AND");
        cfi.setFilter(_SHCSubgrpErg, "SPHCSNo", "eq", $("#" + textId).closest('tr').find("input[id^='SHCSNo_']").val());
        SHCSubGrioupFilter = cfi.autoCompleteFilter(_SHCSubgrpErg);
        return SHCSubGrioupFilter;
    }
    else if (textId.indexOf("Text_DocType") >= 0) {
        var FilterDocType = cfi.getFilter("AND");
        cfi.setFilter(FilterDocType, "ApplicableIn", "in", "0,3");
        DocTypeFilter = cfi.autoCompleteFilter(FilterDocType);
        return DocTypeFilter;
    }
    else if (textId.indexOf("tblInsurance_CommoditySNo_") >= 0) {
        var filterMcom = cfi.getFilter("AND");
        cfi.setFilter(filterMcom, "AirlineSNo", "eq", userContext.AirlineSNo);
        filterMCommoditiy = cfi.autoCompleteFilter(filterMcom);
        return filterMCommoditiy;
    }

    else if (textId.indexOf("Text_Priority") >= 0 && userContext.SysSetting.PriorityBasedOnProduct == "True") {
        var filterPrt = cfi.getFilter("AND");
        cfi.setFilter(filterPrt, "ProductSNo", "eq", $("#Text_Product").data("kendoAutoComplete").key());
        filterPriority = cfi.autoCompleteFilter(filterPrt);
        return filterPriority;
    }
    else if (textId.indexOf("tblAgentOtherChargeTab_OtherChargeCode_") >= 0) {
        var filterDuecrcode = cfi.getFilter("AND");
        cfi.setFilter(filterDuecrcode, "IsCarrier", "eq", 0);

        filterDueCarrierCode = cfi.autoCompleteFilter(filterDuecrcode);
        return filterDueCarrierCode;
    }
    else if (textId.indexOf("tblDueCarrierOtherChargeTab_OtherChargeCode_") >= 0) {
        var filterDuecrcode = cfi.getFilter("AND");
        cfi.setFilter(filterDuecrcode, "IsCarrier", "eq", 1);

        filterDueCarrierCode = cfi.autoCompleteFilter(filterDuecrcode);
        return filterDueCarrierCode;
    }
    else if (textId.indexOf("Text_HSCode10") >= 0) {
        var filterHSCode = cfi.getFilter("AND");
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode1").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode2").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode3").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode4").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode5").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode6").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode7").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode8").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode9").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode11").data("kendoAutoComplete").key());
        searchHSCode = cfi.autoCompleteFilter(filterHSCode);
        return searchHSCode;
    }
    else if (textId.indexOf("Text_HSCode11") >= 0) {
        var filterHSCode = cfi.getFilter("AND");
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode1").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode2").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode3").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode4").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode5").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode6").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode7").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode8").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode9").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode10").data("kendoAutoComplete").key());
        searchHSCode = cfi.autoCompleteFilter(filterHSCode);
        return searchHSCode;
    }
    else if (textId.indexOf("Text_HSCode1") >= 0) {
        var filterHSCode = cfi.getFilter("AND");
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode2").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode3").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode4").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode5").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode6").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode7").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode8").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode9").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode10").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode11").data("kendoAutoComplete").key());
        searchHSCode = cfi.autoCompleteFilter(filterHSCode);
        return searchHSCode;
    }
    else if (textId.indexOf("Text_HSCode2") >= 0) {
        var filterHSCode = cfi.getFilter("AND");
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode1").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode3").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode4").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode5").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode6").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode7").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode8").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode9").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode10").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode11").data("kendoAutoComplete").key());
        searchHSCode = cfi.autoCompleteFilter(filterHSCode);
        return searchHSCode;
    }
    else if (textId.indexOf("Text_HSCode3") >= 0) {
        var filterHSCode = cfi.getFilter("AND");
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode1").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode2").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode4").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode5").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode6").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode7").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode8").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode9").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode10").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode11").data("kendoAutoComplete").key());
        searchHSCode = cfi.autoCompleteFilter(filterHSCode);
        return searchHSCode;
    }
    else if (textId.indexOf("Text_HSCode4") >= 0) {
        var filterHSCode = cfi.getFilter("AND");
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode1").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode2").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode3").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode5").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode6").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode7").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode8").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode9").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode10").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode11").data("kendoAutoComplete").key());
        searchHSCode = cfi.autoCompleteFilter(filterHSCode);
        return searchHSCode;
    }
    else if (textId.indexOf("Text_HSCode5") >= 0) {
        var filterHSCode = cfi.getFilter("AND");
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode1").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode2").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode3").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode4").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode6").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode7").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode8").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode9").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode10").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode11").data("kendoAutoComplete").key());
        searchHSCode = cfi.autoCompleteFilter(filterHSCode);
        return searchHSCode;
    }
    else if (textId.indexOf("Text_HSCode6") >= 0) {
        var filterHSCode = cfi.getFilter("AND");
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode1").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode2").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode3").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode4").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode5").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode7").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode8").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode9").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode10").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode11").data("kendoAutoComplete").key());
        searchHSCode = cfi.autoCompleteFilter(filterHSCode);
        return searchHSCode;
    }
    else if (textId.indexOf("Text_HSCode7") >= 0) {
        var filterHSCode = cfi.getFilter("AND");
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode1").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode2").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode3").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode4").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode5").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode6").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode8").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode9").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode10").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode11").data("kendoAutoComplete").key());
        searchHSCode = cfi.autoCompleteFilter(filterHSCode);
        return searchHSCode;
    }
    else if (textId.indexOf("Text_HSCode8") >= 0) {
        var filterHSCode = cfi.getFilter("AND");
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode1").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode2").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode3").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode4").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode5").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode6").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode7").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode9").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode10").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode11").data("kendoAutoComplete").key());
        searchHSCode = cfi.autoCompleteFilter(filterHSCode);
        return searchHSCode;
    }
    else if (textId.indexOf("Text_HSCode9") >= 0) {
        var filterHSCode = cfi.getFilter("AND");
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode1").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode2").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode3").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode4").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode5").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode6").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode7").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode8").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode10").data("kendoAutoComplete").key());
        cfi.setFilter(filterHSCode, "SNo", "notin", $("#Text_HSCode11").data("kendoAutoComplete").key());
        searchHSCode = cfi.autoCompleteFilter(filterHSCode);
        return searchHSCode;
    }
    else if (textId.indexOf("Text_searchOriginAirport") >= 0) {
        var filtersearchOriginAirport = cfi.getFilter("AND");
        cfi.setFilter(filtersearchOriginAirport, "AirportCode", "notin", $("#Text_searchDestinationAirport").data("kendoAutoComplete").key());
        searchOriginAirportFilter = cfi.autoCompleteFilter(filtersearchOriginAirport);
        return searchOriginAirportFilter;
    }
    else if (textId.indexOf("Text_searchDestinationAirport") >= 0) {
        var filtersearchDestinationAirport = cfi.getFilter("AND");
        cfi.setFilter(filtersearchDestinationAirport, "AirportCode", "notin", $("#Text_searchOriginAirport").data("kendoAutoComplete").key());
        searchDestinationAirportFilter = cfi.autoCompleteFilter(filtersearchDestinationAirport);
        return searchDestinationAirportFilter;
    }
}

function CheckAndValidateData() {
    var CheckAndValidateDataArray = [];
    var result = false;
    var IsmatchAWBOriginCity = false;
    var IsmatchAWBDestinationCity = false;
    var IsRoutingComplete = $("#chkIsRoutingComplete").prop("checked") ? "1" : "0";
    var AWBPieces = ($("#AWBPieces").val() == "" ? 0 : parseFloat($("#AWBPieces").val()));
    var AWBGrossWeight = ($("#AWBGrossWeight").val() == "" ? 0 : parseFloat($("#AWBGrossWeight").val()));
    var AWBCBM = ($("#AWBCBM").val() == "" ? 0 : parseFloat($("#AWBCBM").val()));
    var AWBVolumeWeight = ($("#AWBVolumeWeight").val() == "" ? 0 : parseFloat($("#AWBVolumeWeight").val()));
    var AWBOriginCitySNo = $("#Text_AWBOrigin").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBOrigin").data("kendoAutoComplete").key();
    var AWBDestinationCitySNo = $("#Text_AWBDestination").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBDestination").data("kendoAutoComplete").key();
    $('#tblSelectdRouteResult  tbody  tr').each(function (row, tr) {
        var CheckAndValidateDataArrayItems = {
            Origin: $(tr).find("td")[2].innerText.split("/")[0],
            Destination: $(tr).find("td")[2].innerText.split("/")[1],
            Pieces: $(tr).find("td")[3].innerText,
            GrossWeight: $(tr).find("td")[4].innerText,
            CBM: $(tr).find("td")[5].innerText,
            AWBOriginCitySNo: $(tr).find("input[id^='hdnOriginCitySNo_']").val(),
            AWBDestinationCitySNo: $(tr).find("input[id^='hdnDestinationCitySNo_']").val()
        };
        CheckAndValidateDataArray.push(CheckAndValidateDataArrayItems);
    });

    if (CheckAndValidateDataArray.length > 0) {
        for (var i = 0; i < CheckAndValidateDataArray.length; i++) {
            var ItemAWBPieces = 0;
            var ItemAWBGrossWeight = 0.00;
            var ItemCBM = 0.000;
            $.map(CheckAndValidateDataArray, function (item) {
                if (item.Origin == CheckAndValidateDataArray[i].Origin) {
                    ItemAWBPieces = parseInt(ItemAWBPieces) + parseInt(item.Pieces);

                    ItemAWBGrossWeight = parseFloat(ItemAWBGrossWeight) + parseFloat(item.GrossWeight) || 0.00;
                    ItemCBM = parseFloat(ItemCBM) + parseFloat(item.CBM) || 0.000;
                }
            });
            if (AWBOriginCitySNo == CheckAndValidateDataArray[i].AWBOriginCitySNo)
                IsmatchAWBOriginCity = true;
            if (AWBDestinationCitySNo == CheckAndValidateDataArray[i].AWBDestinationCitySNo)
                IsmatchAWBDestinationCity = true;
            //if (ItemAWBPieces == AWBPieces && ItemAWBGrossWeight == AWBGrossWeight && ItemCBM == AWBCBM)
            if (ItemAWBPieces == AWBPieces)
                result = true;
            else {
                result = false;
                ShowMessage('warning', 'Information!', "Pieces does not match to Itinerary Pieces, Please delete Itinerary and Search.");
                return false;
            }
            //if (parseFloat(ItemAWBGrossWeight).toFixed(2) == AWBGrossWeight)
            if (parseFloat(ItemAWBGrossWeight).toFixed(2) == parseFloat(AWBGrossWeight).toFixed(2))
                result = true;
            else {
                result = false;
                ShowMessage('warning', 'Information!', "Gross Weight does not match to Itinerary Weight, Please delete Itinerary and Search.");
                return false;
            }
            if (parseFloat(ItemCBM).toFixed(3) == AWBCBM)
                result = true;
            else {
                result = false;
                ShowMessage('warning', 'Information!', "Volume does not match to Itinerary Volume, Please delete Itinerary and Search.");
                return false;
            }
        }
    }
    else {
        result = false;
        ShowMessage('warning', 'Information!', "Please Select Itinerary information.");
        return false;
    }

    if (IsRoutingComplete == 0) {
        if (IsmatchAWBOriginCity == true) {
            result = true;
        }
        else {
            result = false;
            ShowMessage('warning', 'Information!', "Incomplete itinerary for the selected Route. Kindly complete route to proceed.");
            return false;
        }
        if (IsmatchAWBDestinationCity == true) {
            result = true;
        }
        else {
            result = false;
            ShowMessage('warning', 'Information!', "Incomplete itinerary for the selected Route. Kindly complete route to proceed.");
            return false;
        }
    }
    else {
        if (IsmatchAWBOriginCity == true) {
            result = true;
        }
        else {
            result = false;
            ShowMessage('warning', 'Information!', "Incomplete itinerary for the selected Route. Kindly complete route to proceed.");
            return false;
        }
    }
    return result;
}

function GetProductAsPerAgent() {
    ProductAsPerAgent = '';
    if ($("#Text_AWBAgent").val() != "" && $("#Text_AWBAgent").val() != undefined) {
        $.ajax({
            url: "Services/Report/NonExecutedBookingService.svc/GetProductAsPerAgent",
            async: false,
            type: "GET",
            dataType: "json",
            data: { AgentSNo: $("#Text_AWBAgent").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AWBAgent").data("kendoAutoComplete").key() },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    //if (myData.Table0.length > 0) {
                    ProductAsPerAgent = myData.Table0[0].ProductSNo;
                    IsAsAgreedAgent = myData.Table0[0].IsAsAgreedAgent;
                    //}
                }
                return false
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
}

//------------------------For Hiding Span Style on Tooltip----------------------------------------------
function HideTooltipSpanStyleInfo() {
    setTimeout(function () {
        //---------- grid column-----
        $("[data-field='AWBPrefix']").closest('tr').find('th').each(function () {
            $(this).attr('title', $(this).attr('data-title'))

        })
        if (userContext.SysSetting.ICMSEnvironment == 'JT') {
            $(".k-grid-header-wrap tr").find("th[data-field='BookingReleaseTime']").find('.k-link').text('Acceptance Cut Off Time');
            $(".k-grid-header-wrap tr").find("th[data-field='BookingReleaseTime']").attr('Title', 'Acceptance Cut Off Time');


            $("[data-field='AWBPrefix']").closest('tr').find('th').each(function () {
                $(this).attr('title', $(this).attr('data-title'))

            })
        }
    }, 200);
    setTimeout(function () {
        $('.k-grid-content table tbody tr td').find('span:eq(1)').each(function () {
            var color = $(this).attr('style');
            $(this).closest('td').find('span:eq(0)').attr('style', color);
            $(this).closest('td').find('span:eq(0)').attr('title', $(this).text());

        });
        $(".k-pager-info").closest('span').on('DOMSubtreeModified', function () {
            $('.k-grid-content table tbody tr td').find('span:eq(1)').each(function () {
                var color = $(this).attr('style');
                $(this).closest('td').find('span:eq(0)').attr('style', color);
                $(this).closest('td').find('span:eq(0)').attr('title', $(this).text());
                //---------- grid column-----
                if (userContext.SysSetting.ICMSEnvironment == 'JT') {
                    $(".k-grid-header-wrap tr").find("th[data-field='BookingReleaseTime']").find('.k-link').text('Acceptance Cut Off Time');
                    $(".k-grid-header-wrap tr").find("th[data-field='BookingReleaseTime']").attr('Title', 'Acceptance Cut Off Time');

                }
            });
        });

    }, 3000);
}
//----------------------------------------------------------------------------------------------------------------------------------------
