$(function () {
    MasterReservation();
});

var currentprocess = "";
var currentawbsno = 0;

function MasterReservation() {
    $.ajax({
        url: "Services/Reservation/ReservationService.svc/GetWebForm/RESERVATION/Reservation/ReservationSearch/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContent);
            $("#divFooter").html(fotter).show();
            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
                //$('#aspnetForm').off('submit');
            });
            cfi.AutoComplete("searchOriginCity", "CountryCode", "vwCountry", "CountryCode", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
            $("#btnSearch").bind("click", function () {
                Reservation_CleanUI();
                Reservation_ShipmentSearch();
            });
            $("#btnNew").unbind("click").bind("click", function () {
                NewBooking();
            });
            $("#btnCancel").unbind("click").bind("click", function () {
                NewBooking();
            });
        }
    });
}
var fotter = "<div><table style='margin-left:20px;'>" +
                        "<tbody><tr><td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-primary btn-sm' style='width:125px;' id='btnNew'>New Booking</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-success btn-sm'  id='btnSave'>Save</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-success btn-sm'  id='btnSaveToNext'>Save &amp; Next</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-danger btn-sm' id='btnCancel'>Cancel</button></td>" +
                        "</tr></tbody></table> </div>";
var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divShipmentDetails' style='width:100%'></div></td></tr><tr><td valign='top'><div id='divNewBooking' style='width:100%'></div></td></tr><tr> <td valign='top'> <table style='width:100%'> <tr> <td style='width:15%;' valign='top' class='tdInnerPadding'> <table class='WebFormTable' style='width: 100%; margin: 0px; padding: 0px; display:none; ' id='tblShipmentInfo'> <tr><td class='formSection' colspan='3' >AWB Information</td></tr><tr> <td>AWB No<input type='hidden' id='hdnAWBSNo'/></td><td>:</td><td id='tdAWBNo'></td></tr><tr> <td>AWB Date</td><td>:</td><td id='tdAWBDate'></td></tr><tr> <td>OD</td><td>:</td><td id='tdOD'></td></tr><tr> <td>Flight No</td><td>:</td><td id='tdFlightNo'></td></tr><tr> <td>Flight Date</td><td>:</td><td id='tdFlightDate'></td></tr><tr> <td>Pieces</td><td>:</td><td id='tdPcs'></td></tr><tr> <td>Ch. Wt.</td><td>:</td><td id='tdChWt'></td></tr><tr> <td>Commodity</td><td>:</td><td id='tdCommodity'></td></tr><tr> <td>FBL Wt.</td><td>:</td><td id='tdFBLwt'></td></tr><tr> <td>FWB Wt.</td><td>:</td><td id='tdFWBwt'></td></tr><tr> <td>FOH Wt.</td><td>:</td><td id='tdRCSwt'></td></tr><tr> <td id='IdAWBPrint' colspan='3'><a href='#' onclick='showAWBPrint()'>Print AWB</a></td></tr><tr> <td id='IdAWBlbl' colspan='3'><a href='#' onclick='showAWBlbl()'>Print AWB Label</a></td></tr><tr> <td id='IdAcptNote' colspan='3'><a href='#'>Print Acceptance Note</a></td></tr><tr> <td id='IdEDINote' colspan='3'><a href='#' onclick='ShowEDI()'>EDI Messages</a></td></tr><tr> <td id='IdPayrecpt' colspan='3'><a href='#' onclick='showPayRcpt()'>Print Payment Receipt </a></td></tr></table> </td><td style='width:70%;' valign='top' class='tdInnerPadding'> <div id='tabstrip'> <ul id='ulTab' style='display:none;'> <li class='k-state-active'> Genral </li><li> SPHC Wise </li></ul> <div> <div id='divDetail'></div></div><div> <div id='divDetailSHC'> </div></div></div></td></tr></table> </td></tr></table></div>";


_USER_ = 2;
_CITY_ = "DEL";
var todayDate = new Date();

function NewBooking()
{
    Reservation_CleanUI();
    $("#hdnAWBSNo").val("");
    currentawbsno = 0;
    var module = "Reservation";
    if (_CURR_PRO_ == "HOUSE") {
        module = "House";
    }
    $.ajax({
        url: "Services/Reservation/ReservationService.svc/GetPartialWebForm/Reservation/ReservationShipmentInfo/6/New", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divDetail").html(result);
            if (result != undefined || result != "") {
                b.PageInit("divDetail");
                InitializePage("RESERVATION", "divDetail");
                currentprocess = "RESERVATION";
                GetProcessSequence("Reservation");
                $("#tblShipmentInfo").show();
            }
        }
    });
}

function Reservation_Search() {
    _CURR_PRO_ = "RESERVATION";
    _CURR_OP_ = "Reservation";
    $("#licurrentop").html(_CURR_OP_);
    $("#divSearch").html("");
    $("#divShipmentDetails").html("");
    Reservation_CleanUI();

}

var _CURR_PRO_ = "RESERVATION";
function BindFlightChart(DailyFlightNo) {

    $("#divGraph").show();
    $.ajax({
        url: "Services/Shipment/AcceptanceService.svc/GetFlightChartDetails?DailyFlightSNo=" + DailyFlightNo + "", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            try {
                var FlightNoArr = result[0].split(',');
                var BookingWTArr = result[1].split(',');
                var AccptedWTArr = result[2].split(',');


                $("#period1").kendoChart({
                    transitions: false,

                    legend: {
                        visible: false
                    },
                    chartArea: {
                        margin: {
                            top: 1,
                            right: 5,
                            bottom: 0,
                            left: 5
                        },
                        width: 200,
                        height: 150,
                        background: "transparent"
                    },
                    seriesDefaults: {
                        type: "column",
                        style: "smooth",
                        stack: true,
                        width: 0,
                        markers: {
                            visible: false
                        }
                    },

                    axisDefaults: {
                        categories: FlightNoArr,

                        line: {
                            visible: false
                        }
                    },
                    series: [{
                        name: "Booked Weight",
                        data: BookingWTArr
                    },
                    {
                        name: "Accepted Weight",
                        data: AccptedWTArr
                    }],
                    valueAxis: {
                        labels: {
                            visible: false,
                            step: 2,

                            template: "$#= value #"
                        },
                        plotBands: [{
                            from: 0, to: 50, color: "#a7c9e6", opacity: .3
                        }]
                    },
                    categoryAxis: {
                        labels: {
                            visible: true,
                            rotation: -60
                        },
                        majorGridLines: {
                            visible: false
                        }
                    },
                    tooltip: {
                        visible: true,
                        template: "#= series.name # <br /> #= value #"
                    }
                });
            }
            catch (e) { $("#divGraph").hide(); }
        }
    });

}

function onDataBound(arg) {
    $("#divGraph").show();
    var grid = $("#" + arg.sender.element[0].id + "").data("kendoGrid");
    var gridData = grid.dataSource.view();
    var DailyFlightSNo = '';
    for (var i = 0; i < gridData.length; i++) {
        var currentUid = gridData[i].uid;
        var currenRow = grid.table.find("tr[data-uid='" + currentUid + "']");
        DailyFlightSNo = DailyFlightSNo + "," + gridData[i].DailyFlightSNo;

    }
    //
    //DailyFlightSNo.substr();
    //BindFlightChart(DailyFlightSNo.substr(1, DailyFlightSNo.length));
    //BindFlightChart('159594, 159595, 159596, 159597, 159598');

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
}

function Reservation_CleanUI() {

    $("#divXRAY").hide();
    $("#tblShipmentInfo").hide();
    $("#divDetail").html("");
    $("#divDetail").html("");
    $("#tblShipmentInfo").hide();
    $("#divNewBooking").html("");
    $("#btnSave").unbind("click");
    $("#divGraph div:first").hide();
    $("#divXRAY").hide();
    $("#imgprocessing").hide();
    $("#ulTab").hide();
    $("#divDetail_SPHC").html("");

    sfp = "";
    currentRoute = [];
    b.fp = [];

}

function Reservation_ShipmentSearch() {
    var OriginCity = $("#searchOriginCity").val() == "" ? "0" : $("#searchOriginCity").val();
    var DestinationCity = $("#searchDestinationCity").val() == "" ? "0" : $("#searchDestinationCity").val();
    var FlightNo = $("#searchFlightNo").val() == "" ? "A~A" : $("#searchFlightNo").val();
    var FlightDate = "0";

    var AWBPrefix = $("#searchAWBPrefix").val() == "" ? "A~A" : $("#searchAWBPrefix").val();
    var AWBNo = $("#searchAWBNo").val() == "" ? "A~A" : $("#searchAWBNo").val();
    var LoggedInCity = "DEL";

    if (_CURR_PRO_ == "RESERVATION") {
        cfi.ShowIndexView("divShipmentDetails", "Services/Reservation/ReservationService.svc/GetGridData/" + _CURR_PRO_ + "/Reservation/Booking/" + OriginCity + "/" + DestinationCity + "/" + FlightNo + "/" + $("#searchFlightDate").val() + "/" + AWBPrefix + "/" + AWBNo + "/" + LoggedInCity);

    }


}

function GetProcessSequence(processName) {    
    $.ajax({
        url: "Services/Reservation/ReservationService.svc/GetProcessSequence?ProcessName=" + processName, async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (data) {
            var processdata = jQuery.parseJSON(data);
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

function InitializePage(subprocess, cntrlid, isdblclick) {
    //$("#tblShipmentInfo").show();
    //InstantiateControl(cntrlid);

    if (subprocess.toUpperCase() == "CUSTOMER") {
        BindCustomerInfo();
    }
    else if (subprocess.toUpperCase() == "DIMENSION") {
        BindDimensionEvents();
    }
    else if (subprocess.toUpperCase() == "WEIGHINGMACHINE") {
        BindWeighingMachineEvents(isdblclick);
    }
    else if (subprocess.toUpperCase() == "XRAY") {
        BindXRayEvents(isdblclick);
    }
    else if (subprocess.toUpperCase() == "LOCATION") {

        BindLocationEvents(isdblclick);
    }
    else if (subprocess.toUpperCase() == "HANDLING") {

        BindHandlingInfoDetails();

    }
    else if (subprocess.toUpperCase() == "PAYMENT") {

        InitializePaymentData();
    }
    else if (subprocess.toUpperCase() == "RESERVATION") {
        BindReservationSection();
    }
    else if (subprocess.toUpperCase() == "CHECKLIST") {
        BindCheckList();
    }
    else if (subprocess.toUpperCase() == "EDOX") {
        $("#divXRAY").show();
        $("#spnShowSlacDetails").html("All Docs Received")
        BindEDox();
    }
    if (subprocess.toUpperCase() != "PAYMENT") {
        var sectionId = "";
        if (parseInt(currentawbsno) > 0) {
            sectionId = "divDetail";
        }
        else {
            sectionId = "divNewBooking";
        }
        cfi.ValidateSection(sectionId);
        //SAVE SECTION
        $("#btnSave").unbind("click").bind("click", function () {
            if (_IS_DEPEND) {
                ShowMessage('error', 'Error!', "AWB No. [" + $("#tdAWBNo").text() + "] -  Unable to process. Linked House data is in process.", "bottom-right");
                return false;
            }
            else if (cfi.IsValidSection(sectionId)) {
                if (true) {
                    if (SaveFormData(subprocess))

                        ShipmentSearch();
                }
            }
            else {
                return false
            }
        });

        $("#btnSaveToNext").unbind("click").bind("click", function () {
            var saveflag = false;

            if (_IS_DEPEND) {
                ShowMessage('error', 'Error!', "AWB No. [" + $("#tdAWBNo").text() + "] -  Unable to process. Linked House data is in process.", "bottom-right");
                return false;
            }
            else if (cfi.IsValidSection(sectionId)) {
                if (true) {
                    saveflag = SaveFormData(subprocess);
                }
            }
            else {
                saveflag = false
            }
            if (saveflag) {
                ShipmentSearch();
                for (var i = 0; i < processList.length; i++) {
                    if (processList[i].value.toUpperCase() == currentprocess.toUpperCase() && i < (processList.length - 1)) {
                        if (currentawbsno > 0) {
                            currentprocess = processList[i + 1].value;
                            ShowProcessDetails(currentprocess, processList[i + 1].isoneclick);
                        }
                        else {
                            CleanUI();
                            cfi.ShowIndexView("divShipmentDetails", "Services/FormService.svc/GetGridData/" + _CURR_PRO_ + "/Shipment/Booking");
                        }
                        return;
                    }
                }
            }
        });
    }
}

function BindCustomerInfo() {

    $("#Text_SHIPPER_AccountNo").prop('disabled', true);
    $("#Text_CONSIGNEE_AccountNo").prop('disabled', true);
    
    cfi.AutoComplete("SHIPPER_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], null, "contains");
    cfi.AutoComplete("SHIPPER_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");

    cfi.AutoComplete("CONSIGNEE_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], null, "contains");
    cfi.AutoComplete("CONSIGNEE_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");
    $.ajax({
        url: "Services/Reservation/ReservationService.svc/GetShipperAndConsigneeInfo?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
        data: JSON.stringify({ AWBSNO: currentawbsno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var customerData = jQuery.parseJSON(result);
            var shipperData = customerData.Table0;
            var consigneeData = customerData.Table1;
            var agentData = customerData.Table2;
            $("#tblShipmentInfo").show();
            if (shipperData != undefined && shipperData.length == 1) {
                var shipper = {
                    SNo: shipperData[0].SNo,
                    AccountNo : shipperData[0].AccountNo,
                    Name : shipperData[0].CustomerName,
                    Street : shipperData[0].Street,
                    Location : shipperData[0].Location,
                    State : shipperData[0].State,
                    PostalCode : shipperData[0].PostalCode,
                    CityCode : shipperData[0].CitySNo,
                    CountryCode: shipperData[0].CountrySNo,
                    Mobile : shipperData[0].Mobile,
                    EMail : shipperData[0].EMail,
                    CountryName : shipperData[0].CountryName,
                    CityName : shipperData[0].CityName,
                    CustomerTypeSNo : shipperData[0].CustomerTypeSNo,
                    CustomerSNo : shipperData[0].CustomerSNo,
                    CustomerAccountNo : shipperData[0].CustomerAccountNo,
                }

                b.CustInfo.Shipper = shipper;
                
                $("#SHIPPER_AccountNo").val(b.CustInfo.Shipper.AccountNo);
                if (b.CustInfo.Shipper.AccountNo != "") {
                    $("#SHIPPER_AccountNo").prop('disabled', true);
                    $("#chkSHIPPER_AccountNo").closest('td').hide();
                }
                $("#SHIPPER_Name").val(b.CustInfo.Shipper.Name);
                $("#SHIPPER_Street").val(b.CustInfo.Shipper.Street);
                $("#SHIPPER_TownLocation").val(b.CustInfo.Shipper.Location);
                $("#SHIPPER_State").val(b.CustInfo.Shipper.State);
                $("#SHIPPER_PostalCode").val(b.CustInfo.Shipper.PostalCode);
                $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue(b.CustInfo.Shipper.CountryCode, b.CustInfo.Shipper.CountryName);
                $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue(b.CustInfo.Shipper.CityCode, b.CustInfo.Shipper.CityName);
                $("#SHIPPER_MobileNo").val(b.CustInfo.Shipper.Mobile);
                $("#SHIPPER_Email").val(b.CustInfo.Shipper.EMail);
                //$("#Text_SHIPPER_City").val(shipperData[0].ShipperCityName);
                //$("SHIPPER_City").val(shipperData[0].ShipperCity);
            }
            if (consigneeData != undefined && consigneeData.length == 1) {
                var consignee = {
                    SNo: consigneeData[0].SNo,
                    AccountNo: consigneeData[0].AccountNo,
                    Name: consigneeData[0].CustomerName,
                    Street: consigneeData[0].Street,
                    Location: consigneeData[0].Location,
                    State: consigneeData[0].State,
                    PostalCode: consigneeData[0].PostalCode,
                    CityCode: consigneeData[0].CitySNo,
                    CountryCode: consigneeData[0].CountrySNo,
                    Mobile: consigneeData[0].Mobile,
                    EMail: consigneeData[0].EMail,
                    CountryName: consigneeData[0].CountryName,
                    CityName: consigneeData[0].CityName,
                    CustomerTypeSNo: consigneeData[0].CustomerTypeSNo,
                    CustomerSNo: consigneeData[0].CustomerSNo,
                    CustomerAccountNo: consigneeData[0].CustomerAccountNo,
                }

                b.CustInfo.Consignee = consignee;

                $("#CONSIGNEE_AccountNo").val(b.CustInfo.Consignee.AccountNo);
                if (b.CustInfo.Consignee.AccountNo != "") {
                    $("#CONSIGNEE_AccountNo").prop('disabled', true);
                    $("#chkCONSIGNEE_AccountNo").closest('td').hide();
                }

                $("#CONSIGNEE_AccountNoName").val(b.CustInfo.Consignee.Name);
                $("#CONSIGNEE_Street").val(b.CustInfo.Consignee.Street);
                $("#CONSIGNEE_TownLocation").val(b.CustInfo.Consignee.Location);
                $("#CONSIGNEE_State").val(b.CustInfo.Consignee.State);
                $("#CONSIGNEE_PostalCode").val(b.CustInfo.Consignee.PostalCode);
                $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue(b.CustInfo.Consignee.CityCode, b.CustInfo.Consignee.CityName);
                $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue(b.CustInfo.Consignee.CountryCode, b.CustInfo.Consignee.CountryName);
                $("#CONSIGNEE_MobileNo").val(b.CustInfo.Consignee.Mobile);
                $("#CONSIGNEE_Email").val(b.CustInfo.Consignee.EMail);
            }
            if (agentData != undefined && agentData.length == 1) {
                $('#AGENT_AccountNo').val(agentData[0].AccountNo);
                $('span[id=AGENT_AccountNo]').text(agentData[0].AccountNo);
                $('#AGENT_Participant').val(agentData[0].Participant);
                $('span[id=AGENT_Participant]').text(agentData[0].Participant);
                $('#AGENT_IATACODE').val(agentData[0].IATANo);
                $('span[id=AGENT_IATACODE]').text(agentData[0].IATANo);
                $('#AGENT_Name').val(agentData[0].AgentName);
                $('span[id=AGENT_Name]').text(agentData[0].AgentName);
                $('#AGENT_IATACASSADDRESS').val(agentData[0].CASSAddress);
                $('span[id=AGENT_IATACASSADDRESS]').text(agentData[0].CASSAddress);
                $('#AGENT_PLACE').val(agentData[0].Location);
                $('span[id=AGENT_PLACE]').text(agentData[0].Location);
                b.AccountSNo = agentData[0].SNo;
            }

            cfi.AutoComplete("SHIPPER_AccountNo", "CustomerNo", "Customer", "SNo", "CustomerNo", ["CustomerNo"], GetShipperConsigneeDetails, "contains");
            //cfi.AutoComplete("SHIPPER_Name", "Name", "Customer", "SNo", "Name", ["Name"], GetShipperConsigneeDetails, "contains");

            cfi.AutoComplete("CONSIGNEE_AccountNo", "CustomerNo", "Customer", "SNo", "CustomerNo", ["CustomerNo"], GetShipperConsigneeDetails, "contains");
            //cfi.AutoComplete("CONSIGNEE_Name", "Name", "Customer", "SNo", "Name", ["Name"], GetShipperConsigneeDetails, "contains");
        },
        error: {

        }
    });

    $("input[id='SHIPPER_AccountNo']").unbind("blur").bind("blur", function () {
        GetShipperConsigneeDetails('S', currentawbsno);
    });
    $("input[id='CONSIGNEE_AccountNo']").unbind("blur").bind("blur", function () {
        GetShipperConsigneeDetails('C', currentawbsno);
    });

}

function GetShipperConsigneeDetails(e) {

    var UserTyp = (e == "Text_SHIPPER_AccountNo" || e == "Text_SHIPPER_Name") ? "S" : "C";
    //var FieldType = (e == "Text_SHIPPER_Name" || e == "Text_CONSIGNEE_AccountNoName") ? "NAME" : "AC";

    if ($("#" + e).data("kendoAutoComplete").key() != "") {

        $.ajax({
            url: "Services/Reservation/ReservationService.svc/GetCustomerInfo?CustomerSNo=" + $("#" + e).data("kendoAutoComplete").key(),
            async: false,
            type: "GET",
            dataType: "json",
            cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var shipperConsigneeData = Data.Table0;

                if (shipperConsigneeData.length == 1) {
                    if (UserTyp == "S") {
                        $("#SHIPPER_Name").val(shipperConsigneeData[0].CustomerName);
                        $("#SHIPPER_Street").val(shipperConsigneeData[0].Street);
                        $("#SHIPPER_TownLocation").val(shipperConsigneeData[0].Location);
                        $("#SHIPPER_State").val(shipperConsigneeData[0].State);
                        $("#SHIPPER_PostalCode").val(shipperConsigneeData[0].PostalCode);
                        $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].CountrySNo, shipperConsigneeData[0].CountryCode + '-' + shipperConsigneeData[0].CountryName);
                        $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].CitySNo, shipperConsigneeData[0].CityCode + '-' + shipperConsigneeData[0].CityName);
                        $("#SHIPPER_MobileNo").val(shipperConsigneeData[0].Phone);
                        $("#SHIPPER_Email").val(shipperConsigneeData[0].Email);
                    }
                    else if (UserTyp == "C") {
                        $("#CONSIGNEE_AccountNoName").val(shipperConsigneeData[0].CustomerName);
                        $("#CONSIGNEE_Street").val(shipperConsigneeData[0].Street);
                        $("#CONSIGNEE_TownLocation").val(shipperConsigneeData[0].Location);
                        $("#CONSIGNEE_State").val(shipperConsigneeData[0].State);
                        $("#CONSIGNEE_PostalCode").val(shipperConsigneeData[0].PostalCode);
                        $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].CitySNo, shipperConsigneeData[0].CityCode + '-' + shipperConsigneeData[0].CityName);
                        $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].CountrySNo, shipperConsigneeData[0].CountryCode + '-' + shipperConsigneeData[0].CountryName);
                        $("#CONSIGNEE_MobileNo").val(shipperConsigneeData[0].Phone);
                        $("#CONSIGNEE_Email").val(shipperConsigneeData[0].Email);
                    }

                }

            },
            error: {

            }
        });
    }

}

function ShowProcessDetails(subprocess, isdblclick) {
    $("#IdAWBPrint").css("display", "");
    $("#IdAcptNote").css("display", "");
    $("#IdEDINote").css("display", "");
    $("#ulTab").hide();
    if (subprocess.toUpperCase() == "HOUSEWAYBILL") {
        $("#tblShipmentInfo").show();
        cfi.ShowIndexView("divDetail", "Services/FormService.svc/GetTransGridData/" + _CURR_PRO_ + "/Shipment/HOUSEWAYBILL/" + currentawbsno);

        //SAVE SECTION
        $("#btnSave").unbind("click");

    }
    else if (subprocess.toUpperCase() == "SHIPPINGBILL") {
        $("#tblShipmentInfo").show();
        cfi.ShowIndexView("divDetail", "Services/FormService.svc/GetTransGridData/" + _CURR_PRO_ + "/Shipment/SHIPPINGBILL/" + currentawbsno);
        // bind
        //SAVE SECTION
        $("#btnSave").unbind("click");

    }
    else if (subprocess.toUpperCase() == "CHECKLIST") {
        $("#divXRAY").show();
        $("#tblShipmentInfo").show();
        cfi.ShowIndexView("divDetail", "Services/FormService.svc/GetTransGridData/" + _CURR_PRO_ + "/Shipment/CHECKLIST/" + currentawbsno);
        cfi.ShowIndexView("divDetailSHC", "Services/FormService.svc/GetTransGridData/" + _CURR_PRO_ + "/Shipment/CHECKLIST_SPHC/" + currentawbsno);
        $("#ulTab").show();
        //SAVE SECTION
        $("#btnSave").unbind("click");
        InitializePage(subprocess, "divAfterContent", isdblclick);

    }
    else {
        $.ajax({
            url: "Services/Reservation/ReservationService.svc/GetWebForm/" + _CURR_PRO_ + "/Reservation/" + subprocess + "/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#divDetail").html(result);
                if (result != undefined || result != "") {
                    InitializePage(subprocess, "divDetail", isdblclick);
                    //$("#Validate").addClass("btn-info");
                }
            }
        });
    }
}

function BindReservationSection() {
    $("#Text_Commodity").data("kendoAutoComplete").setDefaultValue("1", "GENERAL COMMODITY");
    $("#Text_BookingType").data("kendoAutoComplete").setDefaultValue("1", "Cargo");
    cfi.DateType("FlightDate");
    b.FlightDate.prop("readonly", true);

}

function RouteSearch() {
    cfi.ValidateForm();
    if (!cfi.IsValidForm()) {
        return false;
    }

    var PiecesAtOrigin = 0;
    $(b.fp).each(function (index, e) {
        if (e.OriginAirportSNo == b.ShipmentOrigin.data("kendoAutoComplete").key())
            PiecesAtOrigin += parseInt(e.Pieces);
    });

    if (PiecesAtOrigin + parseInt(b.PlanPieces.val()) > parseInt(b.Pieces.val())) {
        ShowMessage("warning", "Flight Search", "Plan Pieces should not be greater than shipment pieces.")
        return false;
    }

    if (!$('#divAvailableRoutes').length) {
        $('<div/>', {
            id: 'divAvailableRoutes',
            name: 'divAvailableRoutes',
            style: 'width:20%; float:left; display:inline;'
        }).appendTo('#divFlightSearchMain');
    }

    if (!$('#divFlightSearch').length) {
        $('<div/>', {
            id: 'divFlightSearch',
            name: 'divFlightSearch',
            style: 'width:80%; display:inline;'
        }).appendTo('#divFlightSearchMain');
    }

    if (!$('#divFlightPlan').length) {
        $('<div/>', {
            id: 'divFlightPlan',
            name: 'divFlightPlan',
            style: 'width:100%;'
        }).appendTo('#divFlightSearchMain');
    }

    $.ajax({
        url: "Services/Reservation/ReservationService.svc/GetRouteSearch",
        async: false,
        type: "GET",
        data: {
            OriginSNo: b.ShipmentOrigin.data("kendoAutoComplete").key(),
            DestSNo: b.ShipmentDestination.data("kendoAutoComplete").key()
        },
        dataType: "json",
        cache: false,
        contentType: "application/json",
        success: function (result) {
            $("#divAvailableRoutes").html("");
            $("#divFlightSearch").html("");
            $("#divAvailableRoutes").show();
            $("#divFlightSearch").show();

            //Clear Route array
            currentRoute = [];
            $(result.Route).each(function (index, e) {
                //push row in route array
                var r = {
                    RouteSNo: e.RouteSNo,
                    OriginAirportSNo: e.OriginAirportSNo,
                    DestAirportSNo: e.DestAirportSNo,
                    CurrentLeg: false
                };
                currentRoute.push(r);
            });

            $('<table/>', {
                id: "tblRoute",
                class: "innerTable",
                width: "99%"
            }).appendTo("#divAvailableRoutes");

            $('#tblRoute').append("<tr><th colspan='2'>Available Routes</th></tr>");
            $('#tblRoute').append("<tr><th>SNo</th><th>Routing</th></tr>");

            $(result.RouteSearch).each(function (item, i) {
                $('#tblRoute').append("<tr><td>" + i.RowNo + "</td><td><input type='radio' name='rbtFlightRoute' onclick='GetFlightSearch(this," + i.SNo + ");'  /> " + i.Routing + "</td></tr>");
            });

            if ($(result.RouteSearch).length <= 0) {
                $("#divAvailableRoutes").html("");
                ShowMessage("warning","Flight Search","No route found for selected origin and destination.");
                return;
            }
            else {
                $("#FlightSearch").attr("disabled", true);
                b.PlanPieces.attr("disabled", true);
            }

        }
    });
}

function GetFlightSearch(obj, routeSNo, originAirportSNo, flightDate, destAirportSNo) {

    if (obj != null && $(obj).attr("name") == "rbtFlightRoute") {
        $(obj).parent().parent().attr("bgcolor", "#A6F5C8");
        $('[name="rbtFlightRoute"]').each(function () {
            $(this).attr("disabled", "disabled");
        });
        b.fpLotNo += 1;
    }

    if ($(obj).attr("id") != "btnNextFlight" && $(obj).attr("id") != "btnPreFlight") {
        $(currentRoute).each(function (index, e) {
            if (e.RouteSNo == routeSNo && !e.CurrentLeg) {
                destAirportSNo = e.DestAirportSNo;
                e.CurrentLeg = true;
                return false;
            }
        });
    }

    if (originAirportSNo == undefined)
        originAirportSNo = b.ShipmentOrigin.data("kendoAutoComplete").key();

    if (flightDate == undefined)
        flightDate = b.FlightDate.data("kendoDatePicker").options.value;

    var f = {
        LoginSNo: 1,
        FlightDate: flightDate,
        OriginAirportSNo: originAirportSNo,
        DestinationAirportSNo: destAirportSNo,
        VolumeWeight: b.VolumeWeight.val(),
        GrossWeight: b.GrossWeight.val(),
        ProductSNo: b.ServiceType.data("kendoAutoComplete").key(),
        CommoditySNo: b.Commodity.data("kendoAutoComplete").key(),
        IsCAO: b.IsCAO.is(":checked"),
        IsULD:false
    }

    $.ajax({
        url: "Services/Reservation/ReservationService.svc/GetFlightSearch",
        async: false,
        type: "POST",
        data: JSON.stringify(f),
        dataType: "json",
        cache: false,
        contentType: "application/json",
        success: function (result) {
            sfp = result;
            $("#divFlightSearch").html("");
            $('<table/>', {
                id: "tblFlightSearch",
                class: "innerTable",
                width: "80%"
            }).appendTo("#divFlightSearch");

            $('#tblFlightSearch').append("<tr><th colspan='8'>Available Flights</th><th><input type='button' id='btnPreFlight' value='<<' onclick='GetFlightSearch(this, " + routeSNo + ", " + originAirportSNo + ", \"" + b.getPreDate(flightDate) + "\", " + destAirportSNo + ")' " + b.disabledPreFdate(flightDate) + " /> <input type='button' id='btnNextFlight' value='>>' onclick='GetFlightSearch(this, " + routeSNo + ", " + originAirportSNo + ", \"" + b.getNextDate(flightDate) + "\", " + destAirportSNo + ")' " + b.disabledNextFdate(flightDate) + " /></th></tr>");

            var row = "<tr>";

            row += "<th>Action</th>";
            row += "<th>Flight No</th>";
            row += "<th>From</th>";
            row += "<th>ETD</th>";
            row += "<th>To</th>";
            row += "<th>ETA</th>";
            row += "<th>Aircraft Type</th>";
            row += "<th>Avl. Gr.</th>";
            row += "<th>Avl. Vol.</th>";
            row += "</tr>";

            $('#tblFlightSearch').append(row);

            $(result).each(function (item, i) {

                row = "<tr>";
                row += "<td><input type='radio' name='rbtFlightSearch' onclick='SelectFlight(this," + i.SNo + "," + i.DestAirportSNo + "," + routeSNo + ");' /></td>";
                row += "<td>" + i.FlightNo + "</td>";
                row += "<td>" + i.From + "</td>";
                row += "<td>" + i.ETD + "</td>";
                row += "<td>" + i.To + "</td>";
                row += "<td>" + i.ETA + "</td>";
                row += "<td>" + i.AircraftType + "</td>";
                row += "<td>" + i.AvailableGross + "</td>";
                row += "<td>" + i.AvailableVolume + "</td>";
                row += "</tr>";

                $('#tblFlightSearch').append(row);
            });

            if ($(result).length <= 0) {
                //$("#divFlightSearch").html("");
                row = "<tr>";
                row += "<td colspan='9'>No flight schedule available for " + b.getDateFormat(flightDate) + " </td>";
                row += "</tr>";
                $('#tblFlightSearch').append(row);
                //$("#btnPreFlight").attr("disabled", true);
                return;
            }

        }
    });
}

function SelectFlight(obj, dailyFlightSNo, destAirportSNo, routeSNo) {
    var a = sfp[$(obj).closest("tr").index() - 2];
    var f = {
        DailyFlightSNo: a.DailyFlightSNo,
        FlightNo: a.FlightNo,
        From: a.From,
        ETD: a.ETD,
        To: a.To,
        ETA: a.ETA,
        AircraftType: a.AircraftType,
        AvailableGross: a.AvailableGross,
        AvailableVolume: a.AvailableVolume,
        Pieces: b.PlanPieces.val(),
        GrossWeight: (b.GrossWeight.val() / b.Pieces.val()) * b.PlanPieces.val(),
        VolumeWeight: (b.VolumeWeight.val() / b.Pieces.val()) * b.PlanPieces.val(),
        OriginAirportSNo: a.OriginAirportSNo,
        DestAirportSNo: a.DestAirportSNo,
        ActionCode: "",
        RouteSNo: routeSNo,
        LotNo: b.fpLotNo,
        Priority: b.Priority.data("kendoAutoComplete").key(),
        Commodity: b.Commodity.data("kendoAutoComplete").key()
    };
    b.fp.push(f);

    $(obj).closest("tr").attr("bgcolor", "#A6F5C8");
    $('[name="rbtFlightSearch"]').each(function () {
        $(this).attr("disabled", "disabled");
    });

    var PiecesAtFinalDest = 0, PiecesAtOrigin = 0;
    $(b.fp).each(function (index, e) {
        if (e.OriginAirportSNo == b.ShipmentOrigin.data("kendoAutoComplete").key())
            PiecesAtOrigin += parseInt(e.Pieces);

        if (e.DestAirportSNo == b.ShipmentDestination.data("kendoAutoComplete").key())
            PiecesAtFinalDest += parseInt(e.Pieces);
    });

    if (PiecesAtFinalDest >= PiecesAtOrigin) {
        $("#FlightSearch").attr("disabled", false);
        b.PlanPieces.attr("disabled", false);
        b.PlanPieces.val("");
        $("#divAvailableRoutes").hide();
        $("#divFlightSearch").hide();
    }

    if (PiecesAtFinalDest == b.Pieces.val()) {
        $("#FlightSearch").attr("disabled", true);
        b.PlanPieces.attr("disabled", true);
        $("#divAvailableRoutes").hide();
        $("#divFlightSearch").hide();
    }

    $("#divFlightPlan").html("");
    $('<table/>', {
        id: "tblFlightPlan",
        class: "innerTable",
        width: "100%"
    }).appendTo("#divFlightPlan");

    $('#tblFlightPlan').append("<tr><th colspan='11'>Flight Plan</th></tr>");

    var row = "<tr>";

    row += "<th>Pieces</th>";
    row += "<th>Flight No</th>";
    row += "<th>From</th>";
    row += "<th>ETD</th>";
    row += "<th>To</th>";
    row += "<th>ETA</th>";
    row += "<th>Aircraft Type</th>";
    row += "<th>Avl Gr.</th>";
    row += "<th>Avl Vol.</th>";
    row += "<th>Status</th>";
    row += "<th>Action Code</th>";
    row += "</tr>";

    $('#tblFlightPlan').append(row);

    $(b.fp).each(function (index, e) {
        row = "<tr>";
        row += "<td>" + e.Pieces + "</td>";
        row += "<td>" + e.FlightNo + "</td>";
        row += "<td>" + e.From + "</td>";
        row += "<td>" + e.ETD + "</td>";
        row += "<td>" + e.To + "</td>";
        row += "<td>" + e.ETA + "</td>";
        row += "<td>" + e.AircraftType + "</td>";
        row += "<td>" + e.AvailableGross + "</td>";
        row += "<td>" + e.AvailableVolume + "</td>";
        row += "<td>KK</td>";
        row += '<td> <span> <input type="text" class="k-input" name="Text_ActionCode' + index + '" id="Text_ActionCode' + index + '" tabindex="24" controltype="autocomplete" maxlength="3" style="text-transform: uppercase; font-size: 8.5px; height: 17px; width:30px;" value="" placeholder="" data-role="autocomplete" autocomplete="off" role="textbox" aria-haspopup="true" aria-multi="kendoAutoComplete" aria-disabled="false" aria-readonly="false" aria-owns="Text_ActionCode' + index + '_listbox" aria-autocomplete="list" /></span> </td>';
        //<input type="hidden" name="ActionCode' + index + '" id="ActionCode' + index + '" value="" data-role="kendoAutoComplete">
        row += "</tr>";

        $('#tblFlightPlan').append(row);
        //cfi.AutoComplete("ActionCode" + index, "SNo", "ActionCodes", "SNo", "ActionCode", ["ActionCode"], null, "contains");
    });

    //$(fp).each(function (index, e) {
    //    cfi.AutoComplete("ActionCode" + index, "ActionCode", "ActionCodes", "SNo", "ActionCode", ["ActionCode"], null, "contains");
    //});


    if (destAirportSNo != b.ShipmentDestination.data("kendoAutoComplete").key()) {
        var flightDate = $(obj).closest("tr").find("td:eq(5)").text();
        GetFlightSearch(null, routeSNo, destAirportSNo, flightDate);
    }
}

function checkProgrss(item, subprocess, displaycaption) {
    //dependentprocess
    //BindFlightChart(DailyFlightSNo.substr(1, DailyFlightSNo.length));

    if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_0_D" + ",") >= 0) {
        return "\"dependentprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_1_D" + ",") >= 0) {
        return "\"dependentprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_0_I" + ",") >= 0) {
        return "\"partialprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_1_I" + ",") >= 0) {
        return "\"completeprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_0" + ",") >= 0) {
        return "\"partialprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_1" + ",") >= 0) {
        return "\"completeprocess\"";
    }
    else if (item.toUpperCase().indexOf("," + subprocess.toUpperCase() + ",") >= 0) {
        return "\"completeprocess\"";
    }
    else {
        return "\"incompleteprocess\"";
    }
}

function BindEvents(obj, e, isdblclick) {
    $("#divGraph").show();

    $("#divXRAY").hide();
    if ($(obj).attr("class") == "dependentprocess")
        _IS_DEPEND = true;
    else
        _IS_DEPEND = false;
    //ResetDetails();
    //$("#btnCancel").unbind("click").bind("click", function () {
    //    ResetDetails();
    //});
    var subprocess = $(obj).attr("process").toUpperCase();
    currentprocess = subprocess;
    var closestTr = $(obj).closest("tr");
    var clickedRowIndex = $(obj).closest("tr").index();
    var closestLockedTr = $(obj).closest("div.k-grid").find("div.k-grid-content-locked").find("tr:eq(" + clickedRowIndex.toString() + ")");

    var awbNoIndex = 0;
    var awbSNoIndex = 0;
    var awbDateIndex = 0;
    var pcsIndex = 0;
    var chwtIndex = 0;
    var originIndex = 0;
    var destIndex = 0;
    var flightNoIndex = 0;
    var flightDateIndex = 0;
    var commodityIndex = 0;
    var accpcsindex = 0;
    var accgrwtindex = 0;
    var accvolwtindex = 0;

    var trLocked = $(".k-grid-header-wrap tr");
    var trRow = $(".k-grid-header-wrap tr");

    awbNoIndex = trLocked.find("th[data-field='AWBNo']").index();
    originIndex = trLocked.find("th[data-field='ShipmentOrigin']").index();
    destIndex = trLocked.find("th[data-field='ShipmentDestination']").index();
    awborigin = originIndex;
    awbSNoIndex = trRow.find("th[data-field='SNo']").index();
    awbDateIndex = trRow.find("th[data-field='AWBDate']").index();
    pcsIndex = trRow.find("th[data-field='TotalPieces']").index();
    chwtIndex = trRow.find("th[data-field='TotalChargeableWeight']").index();
    flightNoIndex = trRow.find("th[data-field='FlightNo']").index();
    flightDateIndex = trRow.find("th[data-field='FlightDate']").index();
    commodityIndex = trRow.find("th[data-field='CommodityCode']").index();
    accpcsindex = trRow.find("th[data-field='AccPcs']").index();
    accgrwtindex = trRow.find("th[data-field='AccGrWt']").index();
    accvolwtindex = trRow.find("th[data-field='AccVolWt']").index();

    currentawbsno = closestTr.find("td:eq(" + awbSNoIndex + ")").text();
    accgrwt = closestTr.find("td:eq(" + accgrwtindex + ")").text();
    accvolwt = closestTr.find("td:eq(" + accvolwtindex + ")").text();
    accpcs = closestTr.find("td:eq(" + accpcsindex + ")").text();
    // Added by RH 12-08-15 starts
    var FBLWtIndex = 0;
    var FWBWtIndex = 0;
    var RCSWtIndex = 0;
    FBLWtIndex = trRow.find("th[data-field='FBLWt']").index();
    FWBWtIndex = trRow.find("th[data-field='FWBWt']").index();
    RCSWtIndex = trRow.find("th[data-field='RCSWt']").index();
    $("#tdFBLwt").text(closestTr.find("td:eq(" + FBLWtIndex + ")").text() == "0.00" ? "" : closestTr.find("td:eq(" + FBLWtIndex + ")").text());
    $("#tdFWBwt").text(closestTr.find("td:eq(" + FWBWtIndex + ")").text() == "0.00" ? "" : closestTr.find("td:eq(" + FWBWtIndex + ")").text());
    $("#tdRCSwt").text(closestTr.find("td:eq(" + RCSWtIndex + ")").text() == "0.00" ? "" : closestTr.find("td:eq(" + RCSWtIndex + ")").text());
    
    $("#tdAWBNo").text(closestTr.find("td:eq(" + awbNoIndex + ")").text());
    $("#tdOD").text(closestTr.find("td:eq(" + originIndex + ")").text() + " - " + closestTr.find("td:eq(" + destIndex + ")").text());

    $("#hdnAWBSNo").val(currentawbsno);
    $("#hdnAccPcs").val(accpcs);
    $("#hdnAccGrWt").val(accgrwt);
    $("#hdnAccVolWt").val(accvolwt);

    $("#tdAWBDate").text(closestTr.find("td:eq(" + awbDateIndex + ")").text());
    $("#tdFlightNo").text(closestTr.find("td:eq(" + flightNoIndex + ")").text());
    $("#tdFlightDate").text(closestTr.find("td:eq(" + flightDateIndex + ")").text());
    $("#tdCommodity").text(closestTr.find("td:eq(" + commodityIndex + ")").text());
    $("#tdPcs").text(closestTr.find("td:eq(" + pcsIndex + ")").text());
    $("#tdChWt").text(closestTr.find("td:eq(" + chwtIndex + ")").text());

    awbNoIndex = trRow.find("th[data-field='AWBNo']").index();

    currentawbsno = closestTr.find("td:eq(1)").html();
    ShowProcessDetails(subprocess, isdblclick);
    GetProcessSequence("Reservation");
}

function BindHandlingInfoDetails() {
    cfi.AutoComplete("CountryCode", "CountryCode", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
    cfi.AutoComplete("InfoType", "InformationCode", "InformationTypeOCI", "SNo", "InformationCode", ["InformationCode","Description"], null, "contains");
    cfi.AutoComplete("CustomsCodeCtl", "CustomsCode", "CustomsOCI", "SNo", "CustomsCode", ["CustomsCode", "Description"], null, "contains");
    $.ajax({
        url: "Services/Reservation/ReservationService.svc/GetHandlingInfo?AWBSNo=" + currentawbsno,
        async: false,
        type: "GET",
        dataType: "json",
        cache: false,
        data: JSON.stringify({ AWBSNO: currentawbsno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#tblShipmentInfo").show();
            var osiData = jQuery.parseJSON(result);

            var handlingArray = osiData.Table0;
            var osiTransInfo = osiData.Table1;
            var ocitransInfo = osiData.Table2;

            cfi.makeTrans("reservation_shipmentositrans", null, null, null, null, null, osiTransInfo, 2);
            cfi.makeTrans("reservation_shipmentocitrans", null, null, BindOCIComplete, RebindOCIAutoComplete, null, ocitransInfo);
            cfi.makeTrans("reservation_shipmenthandlinginfo", null, null, BindHandlingAutoComplete, removeHandlingMessage, null, handlingArray);

            $("div[id$='__divhandling__']").find("[id='divareaTrans_reservation_shipmenthandlinginfo']").each(function () {
                $(this).find("input[id^='Type']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "MessageType", "HandlingMessageType", "SNo", "MessageType", ["MessageType"], null, "contains");
                });
            });
        },
        error: {

        }
    });
}

function BindOCIComplete(elem, mainElem) {
    $(elem).find("input[id^='CountryCode']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "CountryCode", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
    });
    $(elem).find("input[id^='InfoType']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "InformationCode", "InformationTypeOCI", "SNo", "InformationCode", ["InformationCode", "Description"], null, "contains");
    });
    $(elem).find("input[id^='CustomsCodeCtl']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "CustomsCode", "CustomsOCI", "SNo", "CustomsCode", ["CustomsCode", "Description"], null, "contains");
    });
}

function RebindOCIAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_shipment_shipmentocitrans']").find("[id^='areaTrans_shipment_shipmentocitrans']").each(function () {
        $(this).find("input[id^='CountryCode']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "Country", "CountryCode", "CountryCode", ["CountryCode", "CountryName"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
        $(this).find("input[id^='InfoType']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "InformationTypeOCI", "SNo", "InformationCode", ["InformationCode", "Description"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
        $(this).find("input[id^='CustomsCodeCtl']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "CustomsOCI", "SNo", "CustomsCode", ["CustomsCode", "Description"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
    });
}

function BindHandlingAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='Type']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "MessageType", "HandlingMessageType", "SNo", "MessageType", ["MessageType"], null, "contains");
    });
}

function removeHandlingMessage(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_shipment_shipmenthandlinginfo']").find("[id^='areaTrans_shipment_shipmenthandlinginfo']").each(function () {
        $(this).find("input[id^='Type']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "HandlingMessageType", "SNo", "MessageType", ["MessageType"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
    });
}

function BindDimensionEvents() {
    SetTotalPcs();
    $.ajax({
        url: "Services/Reservation/ReservationService.svc/GetDimemsionsAndULD?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
        data: JSON.stringify({ AWBSNO: currentawbsno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            debugger;
            $("#tblShipmentInfo").show();
            var dimuldData = jQuery.parseJSON(result);
            var dimArray = dimuldData.Table0;
            var uldArray = dimuldData.Table1;
            var totaldim = dimuldData.Table2;
            var awbInfo = dimuldData.Table3;

            var arr = dimuldData.Table4;
            var WeighingGrWt = arr[0].WeighingGrWt;
            var WeighingPcs = arr[0].WeighingPcs;
            $('#TotalPieces').val(WeighingPcs);
            $('span[id=TotalPieces]').text(WeighingPcs)
            $("#tdPcs").text(WeighingPcs);
            SetTotalPcs();

            cfi.makeTrans("reservation_shipmentuld", null, null, BindULDAutoComplete, null, null, uldArray);
            //cfi.makeTrans("shipment_shipmentuld", null, null, BindULDAutoComplete, null, beforeAddEventCallback, uldArray);



            cfi.makeTrans("reservation_shipmentdimension", null, null, AfterAddDim, checkonRemove, beforeAddEventCallback, dimArray);
            if (totaldim.length > 0) {
                $("#Unit[value='" + totaldim[0].Unit + "']").prop('checked', true);
                $("input[id='DimVolumeWt']").val(totaldim[0].DimVolumeWt);
                $("span[id='DimVolumeWt']").html(totaldim[0].DimVolumeWt);
            }
            else if (awbInfo.length > 0) {
                $("input[id='DimVolumeWt']").val(awbInfo[0].VOLUMEWEIGHT);
                $("span[id='DimVolumeWt']").html(awbInfo[0].VOLUMEWEIGHT);
            }
            $("[id='Unit']").unbind("click").bind("click", function (e) {
                var typevalue = $(this).attr("value");
                CalculateVolume();
            });

            //$("div[id$='areaTrans_shipment_shipmenthandlinginfo']").find("[id='areaTrans_shipment_shipmenthandlinginfo']").each(function () {
            //    $(this).find("input[id^='Type']").each(function () {
            //        cfi.AutoComplete($(this).attr("name"), "MessageType", "HandlingMessageType", "SNo", "MessageType", ["MessageType"], null, "contains");
            //    });
            //});

            $("div[id$='areaTrans_reservation_shipmentuld']").find("[id='areaTrans_reservation_shipmentuld']").each(function () {
                $(this).find("input[id^='ULDNo']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "ULDNo", "v_AvailableULD", "SNo", "ULDNo", ["ULDNo"], null, "contains");
                });
            });
        },
        error: {

        }
    });
}

function SetTotalPcs() {
    var totalPcs = parseInt($("#tdPcs").html());
    var addedPcs = 0;
    var remainingPcs = totalPcs - addedPcs;
    $("input[id='RemainingPieces']").val(remainingPcs);
    $("span[id='RemainingPieces']").html(remainingPcs);

    $("input[id='Added']").val(addedPcs);
    $("span[id='Added").html(addedPcs);

    $("input[id='TotalPieces']").val(totalPcs);
    $("span[id='TotalPieces']").html(totalPcs);

}

function BindULDAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='ULDNo']").each(function () {
        // cfi.AutoComplete($(this).attr("name"), "ULDName", "ULD", "SNo", "ULDName", ["ULDName"], null, "contains");
        cfi.AutoComplete($(this).attr("name"), "ULDNo", "v_AvailableULD", "SNo", "ULDNo", ["ULDNo"], null, "contains");
    });
}

function AfterAddDim() {
    var elem = $("#areaTrans_shipment_shipmentdimension");
    if (elem.closest("table").find("[id^='Pieces']").length >= 2)
        $('.disablechk').attr('disabled', 'disabled');
    var elem = $("#areaTrans_shipment_shipmentdimension");
    var Pcs = 0;
    elem.closest("table").find("[id^='Pieces']").each(function () {
        Pcs = Pcs + parseInt(this.value == "" ? "0" : this.value);
    });
    Pcs = parseInt($("#TotalPieces").val()) - parseInt(Pcs);
    var count = elem.closest("table").find("[id^='Pieces']").length - 2;
}

function checkonRemove(elem) {
    var closestTable = elem.closest("table");
    var currentIndexPos = $(closestTable).find("[id^='Length']").length - 1;
    if (elem.closest("table").find("[id^='Pieces']").length < 2)
        $('.disablechk').removeAttr('disabled');
    $(closestTable).find("[id^='Pieces']")[currentIndexPos].disabled = false;
    CalculateVolume(elem);
}

function beforeAddEventCallback(elem) {
    var Pcs = 0;
    elem.closest("table").find("[id^='Pieces']").each(function () {
        Pcs = Pcs + parseInt(this.value);
    });
    var closestTable = elem.closest("table");
    var currentIndexPos = $(closestTable).find("[id^='Length']").length - 1;
    if (Pcs > parseInt($("#TotalPieces").val())) {
        $(closestTable).find("[id^='Length']")[currentIndexPos].value = "";
        $(closestTable).find("[id^='Width']")[currentIndexPos].value = "";
        $(closestTable).find("[id^='Height']")[currentIndexPos].value = "";
        $(closestTable).find("[id^='Pieces']")[currentIndexPos].value = "";
        ShowMessage('warning', 'Information!', "Pieces can not be greater than the total Pcs", "bottom-right");

        CalculateVolume(elem);
        return false;
    }

    if (Pcs == parseInt($("#TotalPieces").val())) {
        ShowMessage('warning', 'Information!', "Pieces already added.", "bottom-right");
        return false;
    }

    $(closestTable).find("[id^='Pieces']")[currentIndexPos].disabled = true;



    return true;
}

function ValidatePieces(obj) {

    //if (obj != undefined) {
    //    cfi.ConvertCulture(obj, 1);
    //}
    var elem = $("#areaTrans_reservation_shipmentdimension");
    var Pcs = 0;
    var balancePc = 0;
    elem.closest("table").find("[id^='Pieces']").each(function () {
        balancePc = parseInt($("#TotalPieces").val()) - parseInt(Pcs);
        Pcs = Pcs + parseInt(this.value == "" ? "0" : this.value);
    });

    var closestTable = elem.closest("table");
    var currentIndexPos = $(closestTable).find($(obj).closest("tr")).index() - 1;

    if (Pcs > parseInt($("#TotalPieces").val())) {
        $(closestTable).find("[id^='Length']")[currentIndexPos].value = "";
        $(closestTable).find("[id^='Width']")[currentIndexPos].value = "";
        $(closestTable).find("[id^='Height']")[currentIndexPos].value = "";
        ShowMessage('warning', 'Information!', "Pieces can not be greater than the total Pcs", "bottom-right");
        CalculateVolume(elem);
        $(closestTable).find("[id^='Pieces']")[currentIndexPos].value = balancePc;
        return false;
    }
    CalculateVolume(elem);
    //CalculatePPVolumeWeight(elem, currentIndexPos);
    //CalculateGrossWeight();

    //if (obj != undefined) {
    //    cfi.ConvertCulture(obj, 0);
    //}
    return true;
}

function CalculateVolume(elem, obj) {
    elem = $("#areaTrans_reservation_shipmentdimension");
    var divisor = 1;
    if ($("#Unit")[0].checked == true)
        divisor = 6000;
    else
        divisor = 366;
    var VolumeCalculation = 0;

    elem.closest("div").find("input[id^='Pieces']").each(function () {
        var currentId = $(this).attr("id");
        var PieceID = currentId;
        var LengthID = currentId.replace("Pieces", "Length");
        var WidthID = currentId.replace("Pieces", "Width");
        var HeightID = currentId.replace("Pieces", "Height");
        var VolumeID = currentId.replace("Pieces", "VolumeWt");
        var currentVolume = 0;
        if ($("#" + PieceID).val() != "" && $("#" + PieceID).val() != undefined) {
            currentVolume = parseFloat($("#" + PieceID).val() == "" ? "0" : $("#" + PieceID).val()) * parseFloat($("#" + LengthID).val() == "" ? "0" : $("#" + LengthID).val()) * parseFloat($("#" + WidthID).val() == "" ? "0" : $("#" + WidthID).val()) * parseFloat($("#" + HeightID).val() == "" ? "0" : $("#" + HeightID).val());
            var volWeight = Math.ceil(currentVolume / divisor);
            volWeight = (volWeight < 1 ? 1 : volWeight);
            VolumeCalculation = VolumeCalculation + volWeight;
            $("span[id='" + VolumeID + "']").html(volWeight);
            $("input[id='" + VolumeID + "']").val(volWeight);
        }
    });

    if (VolumeCalculation != 0) {
        $("span[id='DimVolumeWt']").html(VolumeCalculation);
        $("input[id='DimVolumeWt']").val(VolumeCalculation);

    }
    else {
        $("span[id='DimVolumeWt']").html(0);
        $("input[id='DimVolumeWt']").val(0);
    }
}

function SaveFormData(subprocess) {
    var issave = false;
    $("#imgprocessing").show();
    if (subprocess.toUpperCase() == "CUSTOMER") {
        issave = b.SaveCustomerInfo();
    }
    else if (subprocess.toUpperCase() == "DIMENSION") {
        issave = b.SaveDimensionInfo();
    }
    else if (subprocess.toUpperCase() == "WEIGHINGMACHINE") {
        issave = SaveWeighingMachineInfo();
    }
    else if (subprocess.toUpperCase() == "XRAY") {
        issave = SaveXRayInfo();
    }
    else if (subprocess.toUpperCase() == "LOCATION") {
        issave = SaveLocationInfo();
    }
    else if (subprocess.toUpperCase() == "HANDLING") {
        issave = b.SaveHandlingInfo();
    }
    else if (subprocess.toUpperCase() == "RESERVATION") {
        issave = b.SaveReservationInfo();
    }
    else if (subprocess.toUpperCase() == "CHECKLIST") {
        issave = SaveCheckList();
    }
    else if (subprocess.toUpperCase() == "EDOX") {
        issave = SaveEDoxList();
    }
    $("#imgprocessing").hide();
    return issave;
}

function ExtraCondition(textId) {
    if (textId.indexOf("Text_AWBNo") >= 0) {
        var filterAgentName = cfi.getFilter("AND");
        //Where AccountNo = ?
        cfi.setFilter(filterAgentName, "AccountSNo", "eq", b.AgentName.data("kendoAutoComplete").key());
        cfi.setFilter(filterAgentName, "StockStatus", "eq", 3);
        cfi.setFilter(filterAgentName, "ExpiryDate", "gt", b.getCurrentDate());

        return cfi.autoCompleteFilter(filterAgentName);
    }
    else if (textId.indexOf("Text_AllocationCode") >= 0) {

        //Where AccountNo = ?
        var filterAllocationCode = cfi.getFilter("AND");
        cfi.setFilter(filterAllocationCode, "AccountSNo", "eq", b.AgentName.data("kendoAutoComplete").key());
        //And ProductSno = ?
        cfi.setFilter(filterAllocationCode, "ProductSNo", "eq", b.ServiceType.data("kendoAutoComplete").key());

        return cfi.autoCompleteFilter(filterAllocationCode);
    }
    else if (textId.indexOf("Text_DensityGroup") >= 0) {
        var filterCommoditySNo = cfi.getFilter("AND");
        cfi.setFilter(filterCommoditySNo, "CommoditySNo", "eq", b.Commodity.data("kendoAutoComplete").key());
        return cfi.autoCompleteFilter(filterCommoditySNo);
    }
    else if(textId.indexOf("Text_SHIPPER_AccountNo")>=0) {
        var filterShipperAccount = cfi.getFilter("AND");
        cfi.setFilter(filterShipperAccount, "AccountSNo", "eq", b.AccountSNo);
        cfi.setFilter(filterShipperAccount, "CustomerTypeSNo", "eq", b.shipperCustomerTypeSNo);
        return cfi.autoCompleteFilter(filterShipperAccount);
    }
    else if (textId.indexOf("Text_CONSIGNEE_AccountNo") >= 0) {
        var filterShipperAccount = cfi.getFilter("AND");
        cfi.setFilter(filterShipperAccount, "AccountSNo", "eq", b.AccountSNo);
        cfi.setFilter(filterShipperAccount, "CustomerTypeSNo", "eq", b.consigneeCustomerTypeSNo);
        return cfi.autoCompleteFilter(filterShipperAccount);
    }

}

var b = {
    BookingType: "",
    Commodity: "",
    ShipmentOrigin: "",
    ShipmentDestination: "",
    AgentName: "",
    ServiceType: "",
    AllocationCode: "",
    Priority: "",
    DensityGroup: "",
    SPHC: "",
    AWBNo: "",
    Pieces: 0,
    GrossWeight: 0.000,
    VolumeWeight: 0.000,
    ChargeableWeight: 0.000,
    PlanPieces: 0,
    FlightDate: "",
    CBM: "",
    IsCAO: "",
    fp : [],
    fpLotNo: 0,
    AccountSNo: 0,
    shipperCustomerTypeSNo:12,
    consigneeCustomerTypeSNo: 81,
    CustInfo: { Shipper: customerDetail, Consignee: customerDetail },
    PageInit: function (cntrlid) {
        $("#tblShipmentInfo").show();
        InstantiateControl(cntrlid);

        //Shipment Information
        cfi.AutoComplete("BookingType", "BookingType", "BookingType", "SNo", "BookingType", ["BookingType"], null, "contains");
        cfi.AutoComplete("Commodity", "CommodityDescription", "Commodity", "SNo", "CommodityDescription", ["CommodityCode", "CommodityDescription"], null, "contains");
        cfi.AutoComplete("ShipmentOrigin", "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
        cfi.AutoComplete("ShipmentDestination", "AirportCode", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
        cfi.AutoComplete("AgentName", "AgentName", "vwReservation_IssuingAgent", "SNo", "AgentName", ["AgentName"], null, "contains");
        cfi.AutoComplete("AWBNo", "AWBNo", "AWBStock", "SNo", "AWBNo", ["AWBNo"], null, "contains");
        cfi.AutoComplete("ServiceType", "ProductName", "Product", "SNo", "ProductName", ["ProductName"], null, "contains");
        cfi.AutoComplete("AllocationCode", "AccountAllocationCode", "AllocationTransAccount", "SNo", "AccountAllocationCode", ["AccountAllocationCode"], null, "contains");
        cfi.AutoComplete("Priority", "PriorityName", "Priority", "SNo", "PriorityName", ["PriorityName"], null, "contains");
        cfi.AutoComplete("DensityGroup", "GroupName", "vwDensityGroup", "AutocompleteSNo", "GroupName", ["GroupName"], null, "contains");
        cfi.AutoComplete("SHC", "CODE", "SPHC", "SNo", "CODE", ["CODE", "Description"], null, "contains");
        cfi.AutoComplete("DGRCode", "CODE", "SPHC", "SNo", "CODE", ["CODE", "Description"], null, "contains");
        //Shipment Planning
        cfi.AutoComplete("PlanOrigin", "CityCode", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
        cfi.AutoComplete("PlanDestination", "CityCode", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
        //Bind property with control
        b.BookingType = $("#Text_BookingType");
        b.Commodity = $("#Text_Commodity");
        b.ShipmentOrigin = $("#Text_ShipmentOrigin");
        b.ShipmentDestination = $("#Text_ShipmentDestination");
        b.AgentName = $("#Text_AgentName");
        b.AllocationCode = $("#Text_AllocationCode");
        b.Priority = $("#Text_Priority");
        b.DensityGroup = $("#Text_DensityGroup");
        b.SPHC = $("#Text_SHC");
        b.AWBNo = $("#Text_AWBNo");
        b.Pieces = $("#Pieces");
        b.GrossWeight = $("#GrossWt");
        b.VolumeWeight = $("#VolumeWt");
        b.ChargeableWeight = $("#chargeableWt");
        b.CBM = $("#CBM");
        b.ServiceType = $("#Text_ServiceType");
        b.IsCAO = $("#IsCAO");

        b.PlanPieces = $("#PlanPieces");
        b.FlightDate = $("#FlightDate");

        $("#FlightSearch").addClass("btn btn-success");

        b.DensityGroup.attr("onblur", "b.OnblurDensityGroup();");

        $("#tblReservation_ShipmentItinerary").append('<tr><td class="formthreeInputcolumn"><div id="divFlightSearchMain" style="text-align:center"></div></td></tr>')

        $("#FlightSearch").click(function () {
            RouteSearch();
        });
        
    },
    getNextDate: function (value) {
        var date = new Date(value);
        date.setDate(date.getDate() + 1);
        return date.getMonth() + 1 + "-" + date.getDate() + "-" + date.getUTCFullYear();
    },
    getPreDate: function (value) {
        var date = new Date(value);
        date.setDate(date.getDate() - 1);
        return date.getMonth() + 1 + "-" + date.getDate() + "-" + date.getUTCFullYear();
    },
    getCurrentDate:function(){
        var date = new Date();
        date.setDate(date.getDate() + 1);
        return date.getMonth() + 1 + "-" + date.getDate() + "-" + date.getUTCFullYear();
    },
    disabledNextFdate: function (value) {
        var date = new Date(value);
        date.setDate(date.getDate() + 1);

        var maxDate = new Date(b.FlightDate.data("kendoDatePicker")._sqlDate);
        maxDate.setDate(maxDate.getDate() + 7);


        if (maxDate <= date)
            return "disabled='disabled'";
        else {
            return "";
        }
    },
    disabledPreFdate: function (value) {
        var fDate = new Date(b.FlightDate.data("kendoDatePicker")._sqlDate);

        $(b.fp).each(function (index, e) {
            fDate = new Date(e.ETA);
        });

        var cDate = new Date(value);

        if (cDate <= fDate)
            return "disabled='disabled'";
        else {
            return "";
        }
    },
    getDateFormat: function (value) {
        var cDate = new Date(value);
        return cDate.toLocaleDateString();
    },
    OnblurVolume: function () {
        if (parseFloat(b.GrossWeight.val()) >= parseFloat(b.VolumeWeight.val()))
            b.ChargeableWeight.val(b.GrossWeight.val())
        else
            b.ChargeableWeight.val(b.VolumeWeight.val())
    },
    OnblurGross: function () {
        if (parseFloat(b.GrossWeight.val()) >= parseFloat(b.VolumeWeight.val()))
            b.ChargeableWeight.val(b.GrossWeight.val())
        else
            b.ChargeableWeight.val(b.VolumeWeight.val())
    },
    OnblurChargeable: function () {

        if (parseFloat(b.ChargeableWeight.val()) >= parseFloat(b.GrossWeight.val()) && b.ChargeableWeight.val() >= b.VolumeWeight.val())
            return;

        if (parseFloat(b.GrossWeight.val()) >= parseFloat(b.VolumeWeight.val()))
            b.ChargeableWeight.val(b.GrossWeight.val())
        else
            b.ChargeableWeight.val(b.VolumeWeight.val())
    },
    OnblurDensityGroup: function () {
        if (b.DensityGroup.data("kendoAutoComplete").key() != "") {
            var d = b.DensityGroup.data("kendoAutoComplete").key().split(",")[1];
            b.CBM.val(parseFloat(b.VolumeWeight.val()) * parseFloat(d));
        }
    },
    OnblurCBM: function () {
        var d = b.DensityGroup.data("kendoAutoComplete").key().split(",")[1];
        if (d != "" && d != undefined)
            b.VolumeWeight.val(parseFloat(b.CBM.val()) / parseFloat(d));
    },
    OnClickChkShipper: function(e) {
        if($(e).attr("checked")) {
            $("#Text_SHIPPER_AccountNo").prop("disabled", true);

            $("#SHIPPER_Name").prop("disabled", false);
            $("#SHIPPER_Street").prop("disabled", false);
            $("#SHIPPER_TownLocation").prop("disabled", false);
            $("#SHIPPER_State").prop("disabled", false);
            $("#SHIPPER_PostalCode").prop("disabled", false);
            $("#Text_SHIPPER_City").prop("disabled", false);
            $("#Text_SHIPPER_CountryCode").prop("disabled", false);
            $("#SHIPPER_MobileNo").prop("disabled", false);
            $("#SHIPPER_Email").prop("disabled", false);
        }
        else
        {
            $("#Text_SHIPPER_AccountNo").prop("disabled", false);

            $("#SHIPPER_Name").prop("disabled", true);
            $("#SHIPPER_Street").prop("disabled", true);
            $("#SHIPPER_TownLocation").prop("disabled", true);
            $("#SHIPPER_State").prop("disabled", true);
            $("#SHIPPER_PostalCode").prop("disabled", true);
            $("#Text_SHIPPER_City").prop("disabled", true);
            $("#Text_SHIPPER_CountryCode").prop("disabled", true);
            $("#SHIPPER_MobileNo").prop("disabled", true);
            $("#SHIPPER_Email").prop("disabled", true);
        }
    },
    OnClickChkConsignee: function(e) {
        if ($(e).attr("checked")) {
            $("#Text_CONSIGNEE_AccountNo").prop("disabled", true);

            $("#CONSIGNEE_AccountNoName").prop("disabled", false);
            $("#CONSIGNEE_Street").prop("disabled", false);
            $("#CONSIGNEE_TownLocation").prop("disabled", false);
            $("#CONSIGNEE_State").prop("disabled", false);
            $("#CONSIGNEE_PostalCode").prop("disabled", false);
            $("#Text_CONSIGNEE_City").prop("disabled", false);
            $("#Text_CONSIGNEE_CountryCode").prop("disabled", false);
            $("#CONSIGNEE_MobileNo").prop("disabled", false);
            $("#CONSIGNEE_Email").prop("disabled", false);
        }
        else {
            $("#Text_CONSIGNEE_AccountNo").prop("disabled", false);

            $("#CONSIGNEE_AccountNoName").prop("disabled", true);
            $("#CONSIGNEE_Street").prop("disabled", true);
            $("#CONSIGNEE_TownLocation").prop("disabled", true);
            $("#CONSIGNEE_State").prop("disabled", true);
            $("#CONSIGNEE_PostalCode").prop("disabled", true);
            $("#Text_CONSIGNEE_City").prop("disabled", true);
            $("#Text_CONSIGNEE_CountryCode").prop("disabled", true);
            $("#CONSIGNEE_MobileNo").prop("disabled", true);
            $("#CONSIGNEE_Email").prop("disabled", true);
        }
    },
    SaveReservationInfo: function () {
        $(b.fp).each(function (index, e) {
            e.ActionCode = $("#Text_ActionCode" + index).val();
        });

        var a = {
            BookingType: b.BookingType.data("kendoAutoComplete").key(),
            ShipmentOrigin: b.ShipmentOrigin.data("kendoAutoComplete").key(),
            ShipmentDest: b.ShipmentDestination.data("kendoAutoComplete").key(),
            AgentName: b.AgentName.data("kendoAutoComplete").key(),
            AWBStock: b.AWBNo.data("kendoAutoComplete").key(),
            ServiceType: b.ServiceType.data("kendoAutoComplete").key(),
            Pieces: b.Pieces.val(),
            GrossWeight: b.GrossWeight.val(),
            VolumeWeight: b.VolumeWeight.val(),
            CBM: b.CBM.val(),
            ChargeableWeight: b.ChargeableWeight.val(),
            Commodity: b.Commodity.data("kendoAutoComplete").key(),
            DensityGroup: b.DensityGroup.data("kendoAutoComplete").key() != "" ? b.DensityGroup.data("kendoAutoComplete").key().split(",")[0] : "0",
            AllocationCode: b.AllocationCode.data("kendoAutoComplete").key(),
            SHC: b.SPHC.data("kendoAutoComplete").key(),
            Priority: b.Priority.data("kendoAutoComplete").key(),
            flightPlan: b.fp
        };

        $.ajax({
            url: "Services/Reservation/ReservationService.svc/SaveReservationInfo",
            async: false,
            type: "POST",
            data: JSON.stringify(a),
            dataType: "json",
            cache: false,
            contentType: "application/json",
            success: function (result) {
                ShowMessage("error", "Create Reservation", result);
                if (result == "") {
                    ShowMessage("success", "Create Reservation", "Booking Created Successfully!");
                    ClearForm();
                }
            }
        });
    },
    SaveCustomerInfo: function () {
        var flag = false;
        var shipperSNo = 0, shipperCustSNo = $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").key(), shipperCustAccountNo = b.AccountSNo;
        shipperCustSNo = shipperCustSNo == "" ? 0 : shipperCustSNo;
        if (b.CustInfo.Shipper != undefined)
        {
            shipperSNo = b.CustInfo.Shipper.SNo;
            shipperCustSNo = b.CustInfo.Shipper.CustomerSNo;
            shipperCustAccountNo = b.AccountSNo;
        }
        var shipper = {
            SNo: shipperSNo,
            AccountNo: $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").key(),
            Name: $("#SHIPPER_Name").val(),
            Street: $("#SHIPPER_Street").val(),
            Location: $("#SHIPPER_TownLocation").val(),
            State: $("#SHIPPER_State").val(),
            PostalCode: $("#SHIPPER_PostalCode").val(),
            CityCode: $("#Text_SHIPPER_City").data("kendoAutoComplete").key(),
            CountryCode: $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").key(),
            Mobile: $("#SHIPPER_MobileNo").val(),
            EMail: $("#SHIPPER_Email").val(),
            CountryName: $("#Text_SHIPPER_City").data("kendoAutoComplete").value(),
            CityName: $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").value(),
            CustomerTypeSNo: 12,
            CustomerSNo: shipperCustSNo,
            CustomerAccountNo: shipperCustAccountNo
        }
        
        b.CustInfo.Shipper = shipper;

        var consigneeSNo = 0, consigneeCustSNo = $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").key(), consigneeCustAccountNo = b.AccountSNo;
        consigneeCustSNo = consigneeCustSNo == "" ? 0 : consigneeCustSNo;
        if (b.CustInfo.Consignee != undefined) {
            consigneeSNo = b.CustInfo.Consignee.SNo;
            consigneeCustSNo = b.CustInfo.Consignee.CustomerSNo;
            consigneeCustAccountNo = b.AccountSNo;
        }

        var consignee = {
            SNo: consigneeSNo,
            AccountNo: $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").key(),
            Name: $("#CONSIGNEE_AccountNoName").val(),
            Street: $("#CONSIGNEE_Street").val(),
            Location: $("#CONSIGNEE_TownLocation").val(),
            State: $("#CONSIGNEE_State").val(),
            PostalCode: $("#CONSIGNEE_PostalCode").val(),
            CityCode: $("#Text_CONSIGNEE_City").data("kendoAutoComplete").key(),
            CountryCode: $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").key(),
            Mobile: $("#CONSIGNEE_MobileNo").val(),
            EMail: $("#CONSIGNEE_Email").val(),
            CountryName: $("#Text_CONSIGNEE_City").data("kendoAutoComplete").value(),
            CityName: $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").value(),
            CustomerTypeSNo: 81,
            CustomerSNo: consigneeCustSNo,
            CustomerAccountNo: consigneeCustAccountNo
        }

        b.CustInfo.Consignee = consignee;

        $.ajax({
            url: "Services/Reservation/ReservationService.svc/SetCustomerInfo",
            async: false,
            type: "POST",
            dataType: "json",
            cache: false,
            data: JSON.stringify({ AWBSNo: currentawbsno, ShipperInfo: b.CustInfo.Shipper, ConsigneeInfo: b.CustInfo.Consignee, UpdatedBy: _USER_ }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "0") {
                    ShowMessage('success', 'Success - Customer', "AWB No. [" + $("#tdAWBNo").text() + "] -  Processed Successfully", "bottom-right");
                    flag = true;
                }
                else {
                    ShowMessage('warning', 'Warning - Customer', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
                    flag = false;
                }
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - Customer', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
                flag = false;
            }
        });
        return flag;
    },
    SaveHandlingInfo: function () {
        var flag = false;
        //
        var osi = '';
        var OSIInfoModel = new Array();
        var OCIInfoModel = new Array();


        $("#divareaTrans_reservation_shipmentositrans table tr[data-popup='false']").each(function (row, i) {
            if ($(i).find('td:nth-child(2) input[type=text]').val() != '') {
                OSIInfoModel.push({
                    AWBSNo: currentawbsno,
                    SCI: $(i).find('td:nth-child(2) input[type=text]').val(),
                    OSI: $(i).find('td:nth-child(3) input[type=text]').val()
                });
            }

        });
        // alert(JSON.stringify(OSIInfoModel));
        $("#divareaTrans_reservation_shipmentocitrans table tr[data-popup='false']").each(function (row, i) {
            if ($(i).find('td:nth-child(2) input[type=text]').val() != '') {
                OCIInfoModel.push({
                    AWBSNo: currentawbsno,
                    CountrySNo: $("#" + $(i).find('td:nth-child(2) input[type=text]').attr("name")).data("kendoAutoComplete").key(),
                    InfoTypeSNo: $("#" + $(i).find('td:nth-child(3) input[type=text]').attr("name")).data("kendoAutoComplete").key(),
                    CustomsSNo: $("#" + $(i).find('td:nth-child(4) input[type=text]').attr("name")).data("kendoAutoComplete").key(),
                    SupplementaryCustoms: $(i).find('td:nth-child(5) textarea').val()
                });
            }

        });

        var HandlingInfoArray = [];
        $("div[id$='areaTrans_reservation_shipmenthandlinginfo']").find("[id^='areaTrans_reservation_shipmenthandlinginfo']").each(function () {

            var type = $(this).find("[id^='Text_Type']").data("kendoAutoComplete").key();
            var message = $(this).find("[id^='Message']").val();
            var HandlingInfoViewModel = {
                AWBSNo: currentawbsno,
                HandlingMessageTypeSNo: type,
                Message: message
            };
            HandlingInfoArray.push(HandlingInfoViewModel);

        });

        $.ajax({
            url: "Services/Reservation/ReservationService.svc/SetHandlingInfo",
            async: false,
            type: "POST",
            dataType: "json",
            cache: false,
            data: JSON.stringify({
                AWBSNo: currentawbsno,
                AWBOciInfo: OCIInfoModel,
                AWBOsiInfo: OSIInfoModel,
                AWBHandling: HandlingInfoArray,
                UpdatedBy: _USER_
            }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "0") {
                    ShowMessage('success', 'Success - Handling Info', "AWB No. [" + $("#tdAWBNo").text() + "] -  Processed Successfully", "bottom-right");
                    $("#divDetail").html("");
                    $("#tblShipmentInfo").hide();

                    $("#btnSave").unbind("click");
                    flag = true;
                }
                else
                    ShowMessage('warning', 'Warning - Handling Info', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - Handling Info', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");

            }
        });
        return flag;
    },
    SaveDimensionInfo: function () {
        debugger;
        var flag = false;
        var ULDArray = [];
        $("div[id$='areaTrans_reservation_shipmentuld']").find("[id^='areaTrans_reservation_shipmentuld']").each(function () {
            var ULDViewModel = {
                AWBSNo: currentawbsno,
                //ULDSNo: $(this).find("td[id^='tdSNo_Col_']").html(),
                //SPHCCode: $(this).find("[id^='Text_SpecialHandlingCode']").data("kendoAutoComplete").key(),
                //Class: $(this).find("[id^='Text_Class']").data("kendoAutoComplete").key(),
                //UnNo: $(this).find("input[id^='UnNo']").val(),
                //SubRisk: $(this).find("input[id^='SubRisk']").val(),
                //RamCat: $(this).find("input[id^='RamCat']").val(),
                //UnPackingGroup: $(this).find("[id^='UnPackingGroup']").val(),
                //ImpCode: $(this).find("[id^='ImpCode']").val(),
                //Caox: $(this).find("[id^='Caox']").val()

                ULDSNo: $(this).find("[id^='Text_ULDNo']").data("kendoAutoComplete").key(),
                ULDNo: $(this).find("[id^='Text_ULDNo']").data("kendoAutoComplete").value(),
                UldPieces: $(this).find("input[id^='UldPieces']").val(),
                UldGrossWt: $(this).find("input[id^='UldGrossWt']").val(),
                UldTareWt: $(this).find("input[id^='UldTareWt']").val(),
                UldVolWt: $(this).find("input[id^='UldVolWt']").val(),
                CityCode: 0,
                MCBookingSNo: 0,
                DNNo: 0,
                MailDestination: 0,
                OriginRefNo: 0,
                ULDPivotWt: $(this).find("input[id^='ULDPivotWt']").val(),
            };
            ULDArray.push(ULDViewModel);

        });
        if (ULDArray.length == 0)
            ULDArray = {
                AWbSNo: 0,
                ULDSNo: 0,
                UldPieces: 0,
                UldGrossWt: 0,
                UldTareWt: 0,
                UldVolWt: 0,
                CityCode: 0,
                MCBookingSNo: 0,
                DNNo: 0,
                MailDestination: 0,
                OriginRefNo: 0,
                ULDPivotWt: 0,
            };

        var DimArray = [];
        $("div[id$='areaTrans_reservation_shipmentdimension']").find("[id^='areaTrans_reservation_shipmentdimension']").each(function () {
            var DimViewModel = {
                AWBSNo: currentawbsno,
                Height: $(this).find("[id^='Height']").val(),
                Length: $(this).find("[id^='Length']").val(),
                Width: $(this).find("input[id^='Width']").val(),
                Pieces: $(this).find("input[id^='Pieces']").val(),
                CBM: $(this).find("input[id^='VolumeWt']").val(),
                Unit: $("#Unit:checked").val()=="1"?true:false,
                
                VolumeWeight: $(this).find("input[id^='VolumeWt']").val()
            };
            DimArray.push(DimViewModel);

        });

        $.ajax({
            url: "Services/Reservation/ReservationService.svc/UpdateDimemsionsAndULD", async: false, type: "POST", dataType: "json", cache: false,
            //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
            data: JSON.stringify({ AWBSNo: currentawbsno, Dimensions: DimArray, AWBULDTrans: ULDArray, UpdatedBy: 2 }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.split('?')[0] == "0") {
                    if (result.split('?')[1] == "") {
                        ShowMessage('success', 'Success - Dimension', "AWB No. [" + $("#tdAWBNo").text() + "] -  Processed Successfully", "bottom-right");
                        //$("#divDetail").html("");
                        //$("#tblShipmentInfo").hide();

                        //$("#btnSave").unbind("click");
                        flag = true;
                    }
                    else {
                        ShowMessage('warning', 'Warning - Dimension', "Volume weight deviation occurs in AWB No. [" + $("#tdAWBNo").text() + "] .  Processed Successfully", "bottom-right");
                        accpcs = 0;//Manoj
                        accgrwt = 0;//Manoj
                        flag = true;

                    }
                }
                else
                    ShowMessage('warning', 'Warning - Dimension', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - Dimension', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");

            }
        });
        return flag;
    }
};

var sfp;
var currentRoute = [];
var customerDetail = {
    SNo: 0,
    AccountNo: "",
    Name: "",
    Street: "",
    Location: "",
    State: "",
    PostalCode: "",
    City: "",
    CountryCode: "",
    Mobile: "",
    EMail: "",
    CountryName: "",
    CityName: "",
    CustomerTypeSNo: 0,
    CustomerSNo: 0,
    CustomerAccountNo:0
}