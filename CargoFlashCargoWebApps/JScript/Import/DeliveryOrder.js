/*********** Declare variables ********************/
var SearchDocsDataSource = [{ Key: "1", Text: "Invoice" }, { Key: "2", Text: "Consignee AWB Copy" }, { Key: "3", Text: "Packing List" }, { Key: "4", Text: "Doc Type" }, { Key: "5", Text: "Bank" }];
var CustomerDataSource = [{ Key: "1", Text: "REGULAR" }, { Key: "2", Text: "WALK IN" }];
var SearchTypeDataSource = [{ Key: "1", Text: "Delivery Order" }, { Key: "2", Text: "Physical Delivery" }];
var SearchBillToDataSource = [{ Key: "0", Text: "Agent" }];
var SearchChargeDataSource = [{ Key: "0", Text: "CC" }, { Key: "1", Text: "PP" }];
var EdoxProcessDataSource = [{ Key: "0", Text: "" }, { Key: "1", Text: "Flight segregation" }, { Key: "2", Text: "Physical Delivery" }];
var IsPopUp = true;
var IsHouseAwb = false;
var IsPart = false;
var DLVSNo;
var InvoiceNo = 0;
var awbType;
var DOType = "Full";
var shipmentType = "";
var totalHandlingCharges = 0;
var totalAmountDO = 0;
var totalServiceCharges = 0;
var MendatoryHandlingCharges = new Array();
var rowId;
var pValue = 0;
var sValue = 0;
var IsPartDo = 0;
var IsHouseDo = 0;
var FOCConsigneeSNo = 0;
var subprocesssno;
var temp = "";
var PaymentRow = '';
var BupGrWt = 0;
var BupPcs = 0;
var pdPieces = 0;
var pdGrossWt = 0;
var IsFWBCheck = 0;
var fhlType = "";
var IsDOCreated = 0;
var currencyConversionRate = 1;
var focCheckValue = 0;
var chwt = "0";
var IsColorFHL = "0";
var IsFHLSaveStatus = "0";
var checkcanceldo = true;
var currentPomailSno = 0;
var InvoiceSNo = 0;
var IsLocationOnGetCharges = 0;
var IsColorDLV = 0;//Added By rahul To Cheack Location on Get Charges on DO
var IsDoChargeApplicable = 0;
var checkTransaction;
var SubprocessCancelDo = ""
var SubprocessReleaseDo = "";
var SubprocessDo = "";
var ChargesDosno = "";
var CheckChargesid = "";
var YesReady = false;
var Finaldestination = "";
var AwbNumber = "";

$(function () {
    MasterDeliveryOrder();
});

function MasterDeliveryOrder() {
    _CURR_PRO_ = "DELIVERYORDER";
    _CURR_OP_ = "Master Delivery Order";
    $("#licurrentop").html(_CURR_OP_);
    $("#divSearch").html("");
    $("#divDeliveryOrderDetails").html("");

    CleanUI();
    PageRightsCheckDeliveryOrder()
    var DeliveryOrderGetWebForm = {
        processName: _CURR_PRO_,
        moduleName: 'Import',
        appName: 'DeliveryOrderSearch',
        Action: 'Search',
        IsSubModule: '1'
    }

    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/GetWebForm",
        async: true, type: "post", cache: false, contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ model: DeliveryOrderGetWebForm }),
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContent);
            $("#divFooter").html(fotter).show();
            cfi.AutoCompleteV2("searchAirline", "CarrierCode,AirlineName", "DeliveryOrder_CarrierCode", null, "contains");
            cfi.AutoCompleteV2("searchFlightNo", "FlightNo", "DeliveryOrder_FlightNo", null, "contains");
            cfi.AutoCompleteV2("searchAWBNo", "AWBNo", "DeliveryOrder_GridAWBNo", null, "contains");
            cfi.AutoCompleteV2("searchSPHC", "Code,Description", "DeliveryOrder_searchSPHC", null, "contains");
            $('#searchFromDate').data("kendoDatePicker").value("");
            $('#searchToDate').data("kendoDatePicker").value("");

            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });
            $("#searchFromDate").change(function () {
                ValidateDate();
            });

            $("#searchToDate").change(function () {
                ValidateDate();
            });

            $("#btnSearch").bind("click", function () {
                $('#divdetailFAD').hide();
                CleanUI();
                PageRightsCheckDeliveryOrder()
                DeliveryOrderSearch();
                //----- added by rahul on 15 nov 2017 for tool tip text on DO Grid-------
                setTimeout(function () {
                    $("[data-title='POMailSNo']").closest('tr').find('th').each(function () {
                        var title = $(this).attr('data-title')
                        $(this).attr('title', title)
                    });
                }, 2000);
            });

            $("#btnNew").unbind("click").bind("click", function () {
                CleanUI();

                $("#hdnAWBSNo").val("");
                currentawbsno = 0;
                var module = "Import";
                if (_CURR_PRO_ == "HOUSE") {
                    module = "House";
                }
                var DeliveryOrderGetWebForm1 = {
                    processName: _CURR_PRO_,
                    moduleName: module,
                    appName: 'RESERVATION',
                    Action: 'New',
                    IsSubModule: '1'
                }

                $.ajax({
                    url: "Services/Import/DeliveryOrderService.svc/GetWebForm",
                    async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({ model: DeliveryOrderGetWebForm1 }),
                    success: function (result) {
                        $("#divNewBooking").html(result);
                        if (result != undefined || result != "") {
                            InitializePage("FWB", "divNewBooking");
                            currentprocess = "FWB";
                            GetProcessSequence("ACCEPTANCE");
                        }
                    }
                });
            });
            $("#btnSaveToNext").hide();
            if (userContext.SysSetting.ClientEnvironment == 'GA') {
                $("<td> </td ><td><button class='btn btn-block btn-success btn-sm' id='addNewShipment' onclick='addShipment()'>Add Shipment</button></td><td>&nbsp; &nbsp; </td>").insertBefore($("#btnSave").parent());
            }
            PageRightsCheckDeliveryOrder()
        }
    });
}

function CleanUI() {
    $("#divDetail").html("");
    $("#divDetail1").html("");
    $("#divDetail2").html("");
    $("#divDetail3").html("");
    $("#divDetail4").html("");

    $("#divDetail5").html("");
    $("#btnSave").unbind("click");
    $("#btnPrint").unbind("click");
    $("#btnNew").hide();
    $("#tabstrip").hide();
    $("#btnSave").css("display", "block");
    $("#btnUpdate").css("display", "none");
}

function ValidateDate() {
    var fromDate = $("#searchFromDate").attr("sqldatevalue");
    var toDate = $("#searchToDate").attr("sqldatevalue");
    if (fromDate != '' && toDate != '') {
        if (Date.parse(fromDate) > Date.parse(toDate)) {
            $('#searchFromDate').data("kendoDatePicker").value("");
            $('#searchToDate').data("kendoDatePicker").value("");
            $("#searchFromDate").val("");
            $("#searchToDate").val("");
            ShowMessage('warning', 'Warning - Delivery process', "From date should not be greater than To date.");
        }
    }
}

function DeliveryOrderSearch() {
    var searchAirline = $("#searchAirline").val() == "" ? "0" : $("#searchAirline").val();
    var searchFlightNo = $("#searchFlightNo").val() == "" ? "0" : $("#searchFlightNo").val();
    var searchAWBNo = $("#searchAWBNo").val() == "" ? "0" : $("#searchAWBNo").val();
    var searchSPHC = $("#searchSPHC").val() == "" ? "0" : $("#searchSPHC").val();
    var SearchConsignee = $("#SearchConsignee").val() == "" ? "0" : $("#SearchConsignee").val();
    var SearchIncludeTransitAWB = $("input[name='SearchIncludeTransitAWB']:checked").val() == undefined ? userContext.CityCode : "1";
    var SearchExcludeDeliveredAWB = $("input[name='SearchExcludeDeliveredAWB']:checked").val() == undefined ? "0" : "1";
    var LoggedInCity = userContext.CityCode;
    var searchFromDate = "0";
    var searchToDate = "0";
    if ($("#searchFromDate").val() != "") {
        searchFromDate = cfi.CfiDate("searchFromDate") == "" ? "0" : cfi.CfiDate("searchFromDate");// "";//month + "-" + day + "-" + year;
    }

    if ($("#searchToDate").val() != "") {
        searchToDate = cfi.CfiDate("searchToDate") == "" ? "0" : cfi.CfiDate("searchToDate");// "";//month + "-" + day + "-" + year;
    }

    var DeliveryOrderSearch = {
        processName: _CURR_PRO_,
        moduleName: 'Import',
        appName: 'DeliveryOrder',
        Action: 'IndexView',
        searchAirline: searchAirline.trim(),
        searchFlightNo: searchFlightNo.trim(),
        searchAWBNo: searchAWBNo.trim(),
        searchSPHC: searchSPHC.trim(),
        searchConsignee: SearchConsignee.trim(),
        SearchIncludeTransitAWB: SearchIncludeTransitAWB.trim(),
        SearchExcludeDeliveredAWB: SearchExcludeDeliveredAWB.trim(),
        LoggedInCity: LoggedInCity.trim(),
        searchFromDate: searchFromDate.trim(),
        searchToDate: searchToDate.trim(),
    }

    if (_CURR_PRO_ == "DELIVERYORDER") {
        cfi.ShowIndexViewV2("divDeliveryOrderDetails", "Services/Import/DeliveryOrderService.svc/GetGridData", DeliveryOrderSearch);
    }
    $("#btnCancel").unbind("click", resetAddShipmentHtml);
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
            var controlId = $(this).attr("id");
            var decimalPosition = cfi.IsValidSpanNumeric(controlId);
            if (decimalPosition >= -1) {
                cfi.Numeric(controlId, decimalPosition, true);
            }
            else {
                var alphabetstyle = cfi.IsValidSpanAlphabet(controlId);
                if (alphabetstyle != "") {
                    if (alphabetstyle == "datetype") {
                        cfi.DateType(controlId, true);
                    }
                }
            }
        }
    });
    $("input[name='SearchIncludeTransitAWB']").hide();
    $("#SearchExcludeDeliveredAWB").after("Exclude Delivered AWB");
}

function checkProgrss(item, subprocess, displaycaption) {
    CleanUI();
    PageRightsCheckDeliveryOrder()
    if (subprocess.toString() == "FWB") {
        if (item == "") {
            return "\"incompleteprocess\"";
        }
        else if (item.indexOf("FWB") > -1) {
            if (item.indexOf("FWB-1") > -1)
                return "\"partialprocess\"";
            else if (item.indexOf("FWB-2") > -1)
                return "\"completeprocess\"";
            else if (item.indexOf("FWB-3") > -1)
                return "\"incompleteprocess\"";
            else return "\"incompleteprocess\"";
        }
        else
            return "\"incompleteprocess\"";
    }
    else if (subprocess.toString() == "FHL") {
        if (item == "") {
            return "\"incompleteprocess\"";
        }
        else if (item.indexOf("FHL") > -1) {
            if (item.indexOf("FHL-1") > -1)
                return "\"partialprocess\"";
            else if (item.indexOf("FHL-2") > -1)
                return "\"completeprocess\"";
            else if (item.indexOf("FHL-3") > -1)
                return "\"incompleteprocess\"";
            else return "\"incompleteprocess\"";
        }
        else
            return "\"incompleteprocess\"";
    }
    else if (subprocess.toString() == "FAD") {
        if (item == "") {
            return "\"incompleteprocess\"";
        }
        else if (item.indexOf("FAD") > -1) {
            if (item.indexOf("FAD-1") > -1)
                return "\"partialprocess\"";
            else if (item.indexOf("FAD-2") > -1)
                return "\"completeprocess\"";
            else if (item.indexOf("FAD-3") > -1)
                return "\"incompleteprocess\"";
            else return "\"incompleteprocess\"";
        }
        else
            return "\"incompleteprocess\"";
    }
    else if (subprocess.toString() == "LOCATION") {
        if (item == "") {
            return "\"incompleteprocess\"";
        }
        else if (item.indexOf("LOCATION") > -1) {
            if (item.indexOf("LOCATION-1") > -1)
                return "\"partialprocess\"";
            else if (item.indexOf("LOCATION-2") > -1)
                return "\"completeprocess\"";
            else if (item.indexOf("LOCATION-3") > -1)
                return "\"incompleteprocess\"";
            else return "\"incompleteprocess\"";
        }
        else
            return "\"incompleteprocess\"";
    }
    else if (subprocess.toString() == "FAA") {
        if (item == "") {
            return "\"incompleteprocess\"";
        }
        else if (item.indexOf("FAA") > -1) {
            if (item.indexOf("FAA-1") > -1)
                return "\"partialprocess\"";
            else if (item.indexOf("FAA-2") > -1)
                return "\"completeprocess\"";
            else if (item.indexOf("FAA-3") > -1)
                return "\"incompleteprocess\"";
            else return "\"incompleteprocess\"";
        }
        else
            return "\"incompleteprocess\"";
    }
    else if (subprocess.toString() == "DOCS") {
        if (item == "") {
            return "\"incompleteprocess\"";
        }
        else if (item.indexOf("DOCS") > -1) {
            if (item.indexOf("DOCS-1") > -1)
                return "\"partialprocess\"";
            else if (item.indexOf("DOCS-2") > -1)
                return "\"completeprocess\"";
            else if (item.indexOf("DOCS-3") > -1)
                return "\"incompleteprocess\"";
            else return "\"incompleteprocess\"";
        }
        else
            return "\"incompleteprocess\"";
    }
    else if (subprocess.toString() == "DO") {
        if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "GA") {
            $("#btnGetCharges").closest('table').css('display', 'none')
            $("#BillToText").removeAttr("data-valid").removeAttr("data-valid-msg");
        }
        else {
            $("#btnGetCharges").closest('table').css('display', 'block')
        }
        if (item == "") {
            return "\"incompleteprocess\"";
        }
        else if (item.indexOf("DO") > -1) {
            if (item.indexOf("DO-1") > -1)
                return "\"partialprocess\"";
            else if (item.indexOf("DO-2") > -1)
                return "\"completeprocess\"";
            else if (item.indexOf("DO-3") > -1)
                return "\"incompleteprocess\"";
            else return "\"incompleteprocess\"";
        }
        else
            return "\"incompleteprocess\"";
    }
    else if (subprocess.toString() == "PAYMENT") {
        if (item == "") {
            return "\"incompleteprocess\"";
        }
        else if (item.indexOf("PAYMENT") > -1) {
            if (item.indexOf("PAYMENT-1") > -1)
                return "\"partialprocess\"";
            else if (item.indexOf("PAYMENT-2") > -1)
                return "\"completeprocess\"";
            else if (item.indexOf("PAYMENT-3") > -1)
                return "\"incompleteprocess\"";
            else return "\"incompleteprocess\"";
        }
        else
            return "\"incompleteprocess\"";
    }
    else if (subprocess.toString() == "RELEASE") {
        if (item == "") {
            return "\"incompleteprocess\"";
        }
        else if (item.indexOf("RELEASE") > -1) {
            if (item.indexOf("RELEASE-1") > -1)
                return "\"partialprocess\"";
            else if (item.indexOf("RELEASE-2") > -1)
                return "\"completeprocess\"";
            else if (item.indexOf("RELEASE-3") > -1)
                return "\"incompleteprocess\"";
            else return "\"incompleteprocess\"";
        }
        else
            return "\"incompleteprocess\"";
    }
    else if (subprocess.toString() == "EDOX") {
        if (item == "") {
            return "\"incompleteprocess\"";
        }
        else if (item.indexOf("EDOX") > -1) {
            if (item.indexOf("EDOX-1") > -1)
                return "\"partialprocess\"";
            else if (item.indexOf("EDOX-2") > -1)
                return "\"completeprocess\"";
            else if (item.indexOf("EDOX-3") > -1)
                return "\"incompleteprocess\"";
            else return "\"incompleteprocess\"";
        }
        else
            return "\"incompleteprocess\"";
    }
    else if (subprocess.toString() == "CANCEL DO") {
        if (item == "") {
            return "\"incompleteprocess\"";
        }
        else if (item.indexOf("CANCEL DO") > -1) {
            if (item.indexOf("CANCEL DO-1") > -1)
                return "\"partialprocess\"";
            else if (item.indexOf("CANCEL DO-2") > -1)
                return "\"completeprocess\"";
            else if (item.indexOf("CANCEL DO-3") > -1)
                return "\"incompleteprocess\"";
            else return "\"incompleteprocess\"";
        }
        else
            return "\"incompleteprocess\"";
    }
    else if (subprocess.toString() == "CUSTOMREFERENCENUMBER") {
        if (item == "") {
            return "\"incompleteprocess\"";
        }
        else if (item.indexOf("CUSTOMREFERENCENUMBER") > -1) {
            if (item.indexOf("CUSTOMREFERENCENUMBER-1") > -1)

                return "\"completeprocess\"";
            else if (item.indexOf("CUSTOMREFERENCENUMBER-0") > -1)
                return "\"incompleteprocess\"";
        }
        else
            return "\"incompleteprocess\"";
    }
    else if (subprocess.toString() == "CUSTOM") {

        if (item == "") {
            return "\"incompleteprocess\"";
        }
        else if (item.indexOf("CUSTOM") > -1) {
            if (item.indexOf("CUSTOM-2") > -1)
                return "\"completeprocess\"";
            else if (item.indexOf("CUSTOM-1") > -1)
                return "\"partialprocess\"";
            else if (item.indexOf("CUSTOM-0") > -1)
                return "\"incompleteprocess\"";
        }
        else
            return "\"incompleteprocess\"";
    }
}

function ResetDetails(obj, e) {
    $("#divDetail1").html("");
    $("#divDetail3").html("");
    $("#divNewDeliveryOrder").html("");
    $("#btnSave").css("display", "block");
    $("#btnUpdate").css("display", "none");
    $("#btnPrint").css("display", "none");

    $("#divDetail").html("");
    $("#divDetail2").html("");
    $("#tblShipmentInfo").hide();
    $("#divNewBooking").html("");
    $("#divDetailSHC").html("");
    $("#divTab3").html("");
    $("#divTab4").html("");
    $("#divTab5").html("");
    $('#tabstrip ul:first li:eq(0) a').hide();
    $('#tabstrip ul:first li:eq(1) a').hide();
    $('#tabstrip ul:first li:eq(2) a').hide();
    $('#tabstrip ul:first li:eq(3) a').hide();
    $('#tabstrip ul:first li:eq(4) a').hide();
}

function BindEvents(obj, e, isdblclick) {
    subprocesssno = $(obj).attr("subprocesssno").toUpperCase();
    $('#divdetailFAD').hide();
    $("#divDetail").html('');
    $("#divDetail1").html("");
    $("#divDetail2").html("");
    $("#divDetail3").html("");
    $("#divDetailSHC").html('');
    $("#divTab3").html('');
    $("#divTab4").html('');
    $("#divTab5").html('');
    $("#divXRAY").hide();
    $("#tabstrip").show();

    if ($(obj).attr("class") == "dependentprocess")
        _IS_DEPEND = true;
    else
        _IS_DEPEND = false;
    ResetDetails();

    $("#btnCancel").unbind("click").bind("click", function () {
        $("#divTab3").html("");
        $("#divTab4").html("");
        $("#divTab5").html("");
        $("#tabstrip").hide();

        if ($('#divDetail2').is(':visible'))
            $('#divDetail2').dialog('close');
        $("input[subprocesssno]").removeAttr("style");
        ResetDetails();
        var ISFHLSectionActive = $("#tblFHLSection").text();
        if (ISFHLSectionActive != "") {
            $("#btnSave").hide();
        }
    });

    var subprocess = $(obj).attr("process").toUpperCase();
    currentprocess = subprocess;
    if (subprocess.toUpperCase() == "FAD") {
        $("#btnSavefad").show();
    }
    else {
        $("#btnSavefad").hide();
    }

    if (subprocess.toUpperCase() == 'CUSTOM') {
        $.ajax({
            url: 'HtmlFiles/Import/CustomPermission.html',
            async: true,
            success: function (result) {
                $('#divDetail4').html('');
                $("#divDetail5").html("");
                $("#divDetail3").after(result);
                if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "TH") {
                    $("#spnCustomRef").text("Custom Reference Number");
                    $("#areatransCustomInfo_1").hide();
                    //$("#spnCustomRef").text("Custom Reference Number");
                }
            },
            complete: function (result) {
            }
        });
    }
    if (subprocess.toUpperCase() == "AWB PRINT") {
        if ((userContext.SysSetting.ICMSEnvironment == 'GA' || userContext.UserTypeName.toUpperCase() == "AGENT")) {
            AWBPrint();
        }

        else {
            ShowMessage('warning', 'Information!', "AWB Print is Not Found ");
            return;
        }
    }

    var closestTr = $(obj).closest("tr");
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
    var ArrivedShipmentSNoIndexs = 0;
    var ArrivedShipmentATAIndex = 0;
    var trLocked = $(".k-grid-header-wrap tr");
    var trRow = $(".k-grid-header-wrap tr");
    arrivedSNoIndex = trLocked.find("th[data-field='ArrivedShipmentSNo']").index();
    ArrivedShipmentATAIndex = trLocked.find("th[data-field='ATA']").index();
    awbNoIndex = trLocked.find("th[data-field='AWBNo']").index();
    originIndex = trLocked.find("th[data-field='Origin']").index();
    destIndex = trLocked.find("th[data-field='Destination']").index();
    awborigin = originIndex;
    awbSNoIndex = 0;
    awbDateIndex = trRow.find("th[data-field='AWBDate']").index();
    pcsIndex = trRow.find("th[data-field='Pcs']").index();
    chwtIndex = trRow.find("th[data-field='ChWt']").index();
    flightNoIndex = trRow.find("th[data-field='FlightNo']").index();
    flightDateIndex = trRow.find("th[data-field='FlightDate']").index();
    commodityIndex = trRow.find("th[data-field='CommodityCode']").index();
    accpcsindex = trRow.find("th[data-field='AccPcs']").index();
    accgrwtindex = trRow.find("th[data-field='AccGrWt']").index();
    accvolwtindex = trRow.find("th[data-field='AccVolWt']").index();

    AwbNumber = closestTr.find("td:eq(" + awbNoIndex + ")").text().substring(4, 12);
    currentawbsno = closestTr.find("td:eq(" + awbSNoIndex + ")").text();
    accgrwt = closestTr.find("td:eq(" + accgrwtindex + ")").text();
    accvolwt = closestTr.find("td:eq(" + accvolwtindex + ")").text();
    accpcs = closestTr.find("td:eq(" + accpcsindex + ")").text();
    currentdetination = closestTr.find("td:eq(" + destIndex + ")").text();
    Finaldestination = closestTr.find("td:eq(" + destIndex + ")").text();
    CurrentAWBNo = closestTr.find("td:eq(" + awbNoIndex + ")").text();
    currentArrivedShipmentSNo = closestTr.find("td:eq(" + arrivedSNoIndex + ")").text();
    ArrivedShipmentATA = closestTr.find("td:eq(" + ArrivedShipmentATAIndex + ")").text();
    currentPomailindex = trLocked.find("th[data-field='POMailSNo']").index();
    currentPomailSno = closestTr.find("td:eq(" + currentPomailindex + ")").text();
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
    $("#tdFlightDate").text(closestTr.find("td:eq(" + flightDateIndex + ")").text() == "null" ? "" : closestTr.find("td:eq(" + flightDateIndex + ")").text());
    $("#tdCommodity").text(closestTr.find("td:eq(" + commodityIndex + ")").text());
    $("#tdPcs").text(closestTr.find("td:eq(" + pcsIndex + ")").text());
    $("#tdChWt").text(closestTr.find("td:eq(" + chwtIndex + ")").text());

    awbNoIndex = trRow.find("th[data-field='AWBNo']").index();
    ShowProcessDetails(subprocess, isdblclick);
    $("#tabstrip").kendoTabStrip();
    //Added By Rahul Singh To Put Mendatory Field On Bill To 
    $('[title="Select Bill To"]').closest('td').text('');
    $('[title="Select Bill To"]').closest('td').append('<font color="red">*</font> Bill To');
}

function GetProcessSequence(processName) {
    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/GetProcessSequence?ProcessName=" + processName, async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
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

function InitializePage(subprocess, cntrlid, isdblclick) {
    $("#RushHandling").after('Rush Handling');
    InstantiateControl(cntrlid);
    $('#divDetail3').html("");
    $('#divDetail').show();
    $("#tabstrip input,select").attr("disabled", false);
    $("#btnChargeNote").hide();
    $("#btnUpdate").hide();
    $("#btnSaveToNext").hide();
    $("#btnChargeNote").hide();
    $("#btnPrintDLV").hide();
    $("#btnPrint").hide();
    $("#btnSave").show();
    var IsFWBWaybill = "0";


    if (subprocess.toUpperCase() == "RESERVATION" || subprocess.toUpperCase() == "FWB" || subprocess.toUpperCase() == "RATE" || subprocess.toUpperCase() == "CUSTOMER" || subprocess.toUpperCase() == "HANDLING" || subprocess.toUpperCase() == "SUMMARY" || subprocess.toUpperCase() == "FHL" || subprocess.toUpperCase() == "CANCEL DO") {
        $.ajax({
            url: "Services/Import/ImportFWBService.svc/GetFWBType", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AWBSNo: currentawbsno, POMailSNo: currentPomailSno }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var resData = jQuery.parseJSON(result);
                if (resData.Table0.length == 0) {
                    DeliveryOrderSearch();
                    return false;
                }

                IsFWBCheck = resData.Table0[0].IsFWB;
                var IsDOCreate = resData.Table0[0].IsDOCreate;
                IsDOCreated = resData.Table0[0].IsDOCreated;
                var IsFWBColor = resData.Table0[0].IsColorFWB;
                var IsFWBRate = resData.Table0[0].IsFWBRate;
                IsFWBWaybill = resData.Table0[0].IsFWBWaybill;
                var IsFWBRateColor = resData.Table0[0].ISFWBRateColor;
                var ISFWBCustomer = resData.Table0[0].ISFWBCustomer;
                var IsFWBCustoms = resData.Table0[0].IsFWBCustoms;
                var IsFWBSummary = resData.Table0[0].IsFWBSummary;
                IsColorFHL = resData.Table0[0].IsColorFHL;
                IsFHLSaveStatus = resData.Table0[0].IsFHLSave;
                IsColorDLV = resData.Table0[0].IsColorDLV;

                if (IsFWBWaybill == "1" && IsFWBRateColor == "1" && IsFWBColor == "2") {
                    $(ButtonProcess).removeClass("partialprocess completeprocess").addClass("completeprocess ");
                }
                else if (IsFWBWaybill == "1" && IsFWBRateColor == "1") {
                    $(ButtonProcess).removeClass("incompleteprocess partialprocess").addClass("partialprocess");
                }
                else if (ISFWBCustomer == "1" || IsFWBWaybill == "1") {
                    $(ButtonProcess).removeClass("incompleteprocess partialprocess").addClass("partialprocess");
                }

                if ($(ButtonProcess).val() == "FHL" && IsColorFHL == "2") {
                    $(ButtonProcess).removeClass("partialprocess completeprocess").addClass("completeprocess ");

                }
                else if ($(ButtonProcess).val() == "FHL" && IsColorFHL == "1") {
                    $(ButtonProcess).removeClass("incompleteprocess completeprocess").addClass("partialprocess ");
                }
                else if ($(ButtonProcess).val() == "FHL" && IsColorFHL == "0") {
                    $(ButtonProcess).removeClass("partialprocess completeprocess").addClass("incompleteprocess");
                }

                if (Number(IsFWBCheck) == 1) {
                    $("#ulTab").find("table").find("input[id='chkFWBAmmendment']").show();
                    $("#ulTab").find("table").find("span[id='Amendment']").show();
                }
                else {
                    $("#ulTab").find("table").find("input[id='chkFWBAmmendment']").hide();
                    $("#ulTab").find("table").find("span[id='Amendment']").hide();
                }

                if (IsFHLSaveStatus == "True" && userContext.SpecialRights.DOFHL == true) {
                    $("#tblfhl tr:eq(1) td").find("input[id='chkAmendment']").show();
                    $("#tblfhl tr:eq(1) td").find("span[id='Amendment']").show();
                }
                else {
                    $("#tblfhl tr:eq(1) td").find("input[id='chkAmendment']").hide();
                    $("#tblfhl tr:eq(1) td").find("span[id='Amendment']").hide();
                }

                if (IsFHLSaveStatus == "True" && userContext.SpecialRights.DOFHLC == true) {
                    $("#tblfhl tr:eq(1) td").find("input[id='chkAmendmentCharges']").show();
                    $("#tblfhl tr:eq(1) td").find("span[id='AmendmentCharges']").show();
                }
                else {
                    $("#tblfhl tr:eq(1) td").find("input[id='chkAmendmentCharges']").hide();
                    $("#tblfhl tr:eq(1) td").find("span[id='AmendmentCharges']").hide();
                }

                if (Number(IsFWBCheck) == 1 && userContext.SpecialRights.DOFWB == true) {
                    $("#ulTab").find("table").find("input[id='chkAmendmentCharges']").show();
                    $("#ulTab").find("table").find("span[id='AmendmentCharges']").show();
                }
                else {
                    $("#ulTab").find("table").find("input[id='chkAmendmentCharges']").hide();
                    $("#ulTab").find("table").find("span[id='AmendmentCharges']").hide();
                }

                if (Number(IsFWBCheck) == 1 && userContext.SpecialRights.DOFWB == true) {
                    $("#ulTab").find("table").find("input[id='chkFWBAmmendment']").show();
                    $("#ulTab").find("table").find("span[id='Amendment']").show();
                }
                else {
                    $("#ulTab").find("table").find("input[id='chkFWBAmmendment']").hide();
                    $("#ulTab").find("table").find("span[id='Amendment']").hide();
                }

                //Made Diabled true to false & Savebtnhide commented for Cancel DO DO No dropdownhandle by rahul on 20 Dec 2017
                if (Number(IsDOCreate) == 1) {
                    $("#tabstrip input,select").attr("disabled", false);
                    $("#btnSaveToNext").hide();
                }
                else {
                    $("#tabstrip input,select").attr("disabled", false);
                    $("#btnSave").show();
                }

                if (IsFWBWaybill != "0") {
                    $("#ulTab li").eq(0).css("background-color", "rgb(175, 243, 153)");
                }
                if (IsFWBRateColor != "0") {
                    $("#ulTab li").eq(1).css("background-color", "rgb(175, 243, 153)");
                }
                if (ISFWBCustomer != "0") {
                    $("#ulTab li").eq(2).css("background-color", "rgb(175, 243, 153)");
                }
                if (IsFWBCustoms != "0") {
                    $("#ulTab li").eq(3).css("background-color", "rgb(175, 243, 153)");
                }
                if (IsFWBSummary != "0") {
                    $("#ulTab li").eq(4).css("background-color", "rgb(175, 243, 153)");
                }
                if (IsColorFHL == "1") {
                    $('#NoofHouse').attr("disabled", false);
                }
            },
            error: function (xhr) {
                var ex = xhr;
            }
        });

        //Added By Rahul SIngh on 05-8-2017
        $("#NoofHouse").blur(function () {
            if (parseInt($("#NoofHouse").val()) > parseInt($("#Pieces").val())) {
                ShowMessage('warning', 'Warning - Delivery Order', 'No Of House Cant be Greater than No Of Pieces.', " ", "bottom-right");
                $("#NoofHouse").val("0")
                $("#_tempNoofHouse").val("0")
            };
        });
    }
    if (subprocess.toUpperCase() == "DO") {
        if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "GA") {
            $("#btnGetCharges").closest('table').css('display', 'none')
            $("#BillToText").removeAttr("data-valid").removeAttr("data-valid-msg");
        }
        else {
            $("#btnGetCharges").closest('table').css('display', 'block')
        }

        SubprocessDo = "";
        $('#divDetail4').html('');
        $("#divDetail5").html("");
        $('#divDetail').append("<table id='tblDORating'></table><table id='tblDOULD'></table><table id='tblDOOtherCharge'></table>");

        IsPopUp = true;
        CheckDOType();
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    DeliveryOrderSearch();
                }
            }
            else {
                return false;
            }
        });



        $('#RushHandling').unbind("click").bind("click", function () {
            $('#divareaTrans_import_dohandlingcharge').hide();
        });

        UserSubProcessRights("divDetail", subprocesssno);
        PageRightsCheckDeliveryOrder()
        return false;
    }
    else if (subprocess.toUpperCase() == "CANCEL DO") {
        $('#divDetail4').html('');
        $("#divDetail5").html("");
        BindCancelDO();
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    CancelDO("Cancel");
                    DeliveryOrderSearch();
                }
            }
            else {
                return false;
            }
        });
        UserSubProcessRights("divDetail", subprocesssno);
        PageRightsCheckDeliveryOrder()
        return false;
    }
    else if (subprocess.toUpperCase() == "CUSTOMREFERENCENUMBER") {
        BindCUSTOMREFERENCENUMBER();
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    DeliveryOrderSearch();
                }
            }
            else {
                return false;
            }
        });
        UserSubProcessRights("divDetail", subprocesssno);
        PageRightsCheckDeliveryOrder()
        return false;
    }
    else if (subprocess.toUpperCase() == "PAYMENT") {
        BindPayment();
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    DeliveryOrderSearch();
                }
            }
            else {
                return false;
            }
        });
        UserSubProcessRights("divDetail", subprocesssno);
        PageRightsCheckDeliveryOrder()
        return false;
    }
    else if (subprocess.toUpperCase() == "RELEASE") {
        $('#divDetail4').html('');
        $("#divDetail5").html("");
        BindPhysicalDO();
        UserSubProcessRights("divDetail", subprocesssno);

        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    DeliveryOrderSearch();
                }
            }
            else {
                return false;
            }
        });
        PageRightsCheckDeliveryOrder()
        $("#Date").data("kendoDatePicker").enable(false);
        return false;
    }
    else if (subprocess.toUpperCase() == "DOCS") {
        $('#divDetail4').html('');
        $("#divDetail5").html("");
        BindAWDDocs();
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSubmitSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    DeliveryOrderSearch();
                }
            }
            else {
                return false;
            }
        });
        UserSubProcessRights("divDetail", subprocesssno);
        PageRightsCheckDeliveryOrder()
        return false;
    }
    else if (subprocess.toUpperCase() == "CUSTOM") {
        BindCustomInfo();
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSubmitSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                }
            }
            else {
                return false;
            }
        });
        UserSubProcessRights("divDetail", subprocesssno);
        PageRightsCheckDeliveryOrder()
        return false;
    }
    else if (subprocess.toUpperCase() == "RESERVATION" || subprocess.toUpperCase() == "FWB") {
        $("#btnPrint").hide();
        $("#btnSaveToNext").show();
        $("#btnSave").show();
        $('#divDetail4').html('');
        $("#divDetail5").html("");
        BindReservationSection();

        $("#btnPrint").unbind("click").bind("click", function () {
            PrintImportAWB();
        });

        if (Number(IsDOCreated) == 1) {
            if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "G9")
                $("#btnSave").hide();
            $("#btnSaveToNext").hide();
            $("#divDetail input,select").attr("disabled", true);
            $("#divDetail input[controltype='autocomplete']").each(function (e) {
                var vaal = $("#" + $(this).attr("id")).data("kendoAutoComplete");
                if (typeof vaal != 'undefined') {
                    $("#" + $(this).attr("id")).data("kendoAutoComplete").enable(false);
                }
            })
        }
        else if (IsFWBWaybill != "0") {
            $('#chkDocReceived').attr("disabled", true);
        }
        else {
            $("#divDetail input,select").attr("disabled", false);
            $('#btnSave').show();
        }

        if (IsColorFHL != "0") {
            $("#NoofHouse").attr("disabled", false);
        }
        else {
            $("#NoofHouse").attr("disabled", false);
        }

        //if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "GA") {
        //    $('#btnNew').show();
        //}
        //else {
        //    $('#btnNew').hide();
        //}

        $('#chkDocReceived').attr("disabled", false);

        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                isSaveAndNext = "0";
                if ($("#ulTab").find("table").is(":hidden") == false && $("#ulTab").find("table").find("input[id='chkFWBAmmendment']").is(":checked") == false && Number(IsFWBCheck) == 1) {
                    ShowMessage('warning', 'Warning - Delivery Order', 'Please Check FWB amendment.', " ", "bottom-right");
                    return false;
                }

                var IsDocReceived = $("#chkDocReceived").prop('checked') == false ? 0 : 1;
                if (IsDocReceived == 0) {
                    if ($("#chkDocReceived").prop('disabled') == false) {
                        $("#divDetail2").html("Document not selected irregularity will be raised for same as MSAW.");
                        $("#divDetail2").dialog({
                            resizable: false,
                            modal: true,
                            title: "SHC Information",
                            height: 250,
                            width: 400,
                            buttons: {
                                "Yes": function () {
                                    $("#divDetail2").dialog('close');
                                    if ($('#SpecialHandlingCode').val() == "" && $('#divMultiSpecialHandlingCode').text() == "") {
                                        $("#divDetail2").html("No SHC selected are you sure to save FWB without any SHC.");
                                        $("#divDetail2").dialog({
                                            resizable: false,
                                            modal: true,
                                            title: "SHC Information",
                                            height: 250,
                                            width: 400,
                                            buttons: {
                                                "Yes": function () {
                                                    if (SaveFormData(subprocess)) {
                                                        DeliveryOrderSearch();
                                                    }
                                                    $("#divDetail2").dialog('close');
                                                },
                                                "No": function () {
                                                    $("#divDetail2").dialog('close');
                                                    return false;
                                                }
                                            }
                                        });
                                    }
                                    else {
                                        if (SaveFormData(subprocess)) {
                                            DeliveryOrderSearch();
                                        }
                                    }
                                },
                                "No": function () {
                                    $("#divDetail2").dialog('close');
                                    return false;
                                }
                            }
                        });
                    }
                    else {
                        if ($('#SpecialHandlingCode').val() == "" && $('#divMultiSpecialHandlingCode').text() == "") {
                            $("#divDetail2").html("No SHC selected are you sure to save FWB without any SHC.");
                            $("#divDetail2").dialog({
                                resizable: false,
                                modal: true,
                                title: "SHC Information",
                                height: 250,
                                width: 400,
                                buttons: {
                                    "Yes": function () {
                                        if (SaveFormData(subprocess)) {
                                            DeliveryOrderSearch();
                                        }
                                        $("#divDetail2").dialog('close');
                                    },
                                    "No": function () {
                                        $("#divDetail2").dialog('close');
                                        return false;
                                    }
                                }
                            });
                        }
                        else {
                            if (SaveFormData(subprocess)) {
                                DeliveryOrderSearch();
                            }
                        }
                    }
                }
                else {
                    if ($('#SpecialHandlingCode').val() == "" && $('#divMultiSpecialHandlingCode').text() == "") {
                        $("#divDetail2").html("No SHC selected are you sure to save FWB without any SHC.");
                        $("#divDetail2").dialog({
                            resizable: false,
                            modal: true,
                            title: "SHC Information",
                            height: 250,
                            width: 400,
                            buttons: {
                                "Yes": function () {
                                    if (SaveFormData(subprocess)) {
                                        DeliveryOrderSearch();
                                    }
                                    $("#divDetail2").dialog('close');
                                },
                                "No": function () {
                                    $("#divDetail2").dialog('close');
                                    return false;
                                }
                            }
                        });
                    }
                    else {
                        if (SaveFormData(subprocess)) {
                            DeliveryOrderSearch();
                        }
                    }
                }
            }
            else {
                return false;
            }
        });

        $("#btnSaveToNext").unbind("click").bind("click", function () {
            var FlightDateSelected = $("div[id='divareaTrans_importfwb_fwbshipmentitinerary']").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='FlightDate']").data("kendoDatePicker").value() || "";
            if (IsFlightExist == false && FlightDateSelected != "" > 0) {
                if (cfi.IsValidSection(cntrlid)) {
                    isSaveAndNext = "1";
                    if ($("#ulTab").find("table").is(":hidden") == false && $("#ulTab").find("table").find("input[id='chkFWBAmmendment']").is(":checked") == false && Number(IsFWBCheck) == 1) {
                        ShowMessage('warning', 'Warning - Delivery Order', 'Please Check FWB amendment.', " ", "bottom-right");
                        return false;
                    }

                    var IsDocReceived = $("#chkDocReceived").prop('checked') == false ? 0 : 1;
                    if (IsDocReceived == 0) {
                        if ($("#chkDocReceived").prop('disabled') == false) {
                            $("#divDetail2").html("Document not selected irregularity will be raised for same as MSAW.");
                            $("#divDetail2").dialog({
                                resizable: false,
                                modal: true,
                                title: "SHC Information",
                                height: 250,
                                width: 400,
                                buttons: {
                                    "Yes": function () {
                                        $("#divDetail2").dialog('close');
                                        if ($('#SPHC').val() == "" && $('#divMultiSpecialHandlingCode').text() == "") {
                                            $("#divDetail2").html("No SHC selected are you sure to save FWB without any SHC.");
                                            $("#divDetail2").dialog({
                                                resizable: false,
                                                modal: true,
                                                title: "SHC Information",
                                                height: 250,
                                                width: 400,
                                                buttons: {
                                                    "Yes": function () {
                                                        if (SaveFormData(subprocess)) {
                                                            $('#tabstrip ul:first li:eq(1) a').click();
                                                        }
                                                        $("#divDetail2").dialog('close');
                                                    },
                                                    "No": function () {
                                                        $("#divDetail2").dialog('close');
                                                        return false;
                                                    }
                                                }
                                            });
                                        }
                                        else {
                                            if (SaveFormData(subprocess)) {
                                                $('#tabstrip ul:first li:eq(1) a').click();
                                            }
                                        }
                                    },
                                    "No": function () {
                                        $("#divDetail2").dialog('close');
                                        return false;
                                    }
                                }
                            });
                        }
                        else {
                            if ($('#SPHC').val() == "" && ('#divMultiSpecialHandlingCode').text() == "") {
                                $("#divDetail2").html("No SHC selected are you sure to save FWB without any SHC.");
                                $("#divDetail2").dialog({
                                    resizable: false,
                                    modal: true,
                                    title: "SHC Information",
                                    height: 250,
                                    width: 400,
                                    buttons: {
                                        "Yes": function () {
                                            if (SaveFormData(subprocess)) {
                                                $('#tabstrip ul:first li:eq(1) a').click();
                                            }
                                            $("#divDetail2").dialog('close');
                                        },
                                        "No": function () {
                                            $("#divDetail2").dialog('close');
                                            return false;
                                        }
                                    }
                                });
                            }
                            else {
                                if (SaveFormData(subprocess)) {
                                    $('#tabstrip ul:first li:eq(1) a').click();
                                }
                            }
                        }
                    }
                    else {
                        if ($('#SpecialHandlingCode').val() == "" && ($("#chkDocReceived").prop('disabled') == false)) {
                            $("#divDetail2").html("No SHC selected are you sure to save FWB without any SHC.");
                            $("#divDetail2").dialog({
                                resizable: false,
                                modal: true,
                                title: "SHC Information",
                                height: 250,
                                width: 400,
                                buttons: {
                                    "Yes": function () {
                                        if (SaveFormData(subprocess)) {
                                            $('#tabstrip ul:first li:eq(1) a').click();
                                        }
                                        $("#divDetail2").dialog('close');
                                    },
                                    "No": function () {
                                        $("#divDetail2").dialog('close');
                                        return false;
                                    }
                                }
                            });
                        }
                        else {
                            if (SaveFormData(subprocess)) {
                                $('#tabstrip ul:first li:eq(1) a').click();
                            }
                        }
                    }
                } else {
                    return false;
                }
            }
            else {
                if ((IsFWbComplete && $("#chkFWBAmmendMent").prop("checked")) || (!IsFWbComplete && !$("#chkFWBAmmendMent").prop("checked"))) {
                    if (cfi.IsValidSection(cntrlid)) {
                        isSaveAndNext = "1";
                        /***************************************/
                        if ($("#ulTab").find("table").is(":hidden") == false && $("#ulTab").find("table").find("input[id='chkFWBAmmendment']").is(":checked") == false && Number(IsFWBCheck) == 1) {
                            ShowMessage('warning', 'Warning - Delivery Order', 'Please Check FWB amendment.', " ", "bottom-right");
                            return false;
                        }

                        var IsDocReceived = $("#chkDocReceived").prop('checked') == false ? 0 : 1;
                        if (IsDocReceived == 0) {
                            if ($("#chkDocReceived").prop('disabled') == false) {
                                $("#divDetail2").html("Document not selected irregularity will be raised for same as MSAW.");
                                $("#divDetail2").dialog({
                                    resizable: false,
                                    modal: true,
                                    title: "SHC Information",
                                    height: 250,
                                    width: 400,
                                    buttons: {
                                        "Yes": function () {
                                            $("#divDetail2").dialog('close');
                                            if ($('#SPHC').val() == "" && $('#divMultiSpecialHandlingCode').text() == "") {
                                                $("#divDetail2").html("No SHC selected are you sure to save FWB without any SHC.");
                                                $("#divDetail2").dialog({
                                                    resizable: false,
                                                    modal: true,
                                                    title: "SHC Information",
                                                    height: 250,
                                                    width: 400,
                                                    buttons: {
                                                        "Yes": function () {
                                                            if (SaveFormData(subprocess)) {
                                                                FlightDateForGetRate = $("#divareaTrans_importfwb_fwbshipmentitinerary").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='FlightDate']").val();// set flight date value after save and next
                                                                FlightNoForGetRate = $("#divareaTrans_importfwb_fwbshipmentitinerary").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='Text_FlightNo']").val();// set flight date value after save and next
                                                                $("#divDetailSHC").html("");
                                                                $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(2);
                                                                ShowProcessDetailsNew("CUSTOMER", "divTab3", 0, subprocesssno);
                                                            }
                                                            $("#divDetail2").dialog('close');
                                                        },
                                                        "No": function () {
                                                            $("#divDetail2").dialog('close');
                                                            return false;
                                                        }
                                                    }
                                                });
                                            }
                                            else {
                                                if (SaveFormData(subprocess)) {
                                                    FlightDateForGetRate = $("#divareaTrans_importfwb_fwbshipmentitinerary").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='FlightDate']").val();// set flight date value after save and next
                                                    FlightNoForGetRate = $("#divareaTrans_importfwb_fwbshipmentitinerary").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='Text_FlightNo']").val();// set flight date value after save and next
                                                    $("#divDetailSHC").html("");
                                                    $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(2);
                                                    ShowProcessDetailsNew("CUSTOMER", "divTab3", 0, subprocesssno);
                                                }
                                            }
                                        },
                                        "No": function () {
                                            $("#divDetail2").dialog('close');
                                            return false;
                                        }
                                    }
                                });
                            }
                            else {
                                if ($('#SPHC').val() == "" && $('#divMultiSpecialHandlingCode').text() == "") {
                                    $("#divDetail2").html("No SHC selected are you sure to save FWB without any SHC.");
                                    $("#divDetail2").dialog({
                                        resizable: false,
                                        modal: true,
                                        title: "SHC Information",
                                        height: 250,
                                        width: 400,
                                        buttons: {
                                            "Yes": function () {
                                                if (SaveFormData(subprocess)) {
                                                    FlightDateForGetRate = $("#divareaTrans_importfwb_fwbshipmentitinerary").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='FlightDate']").val();// set flight date value after save and next
                                                    FlightNoForGetRate = $("#divareaTrans_importfwb_fwbshipmentitinerary").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='Text_FlightNo']").val();// set flight date value after save and next
                                                    $("#divDetailSHC").html("");
                                                    $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(2);
                                                    ShowProcessDetailsNew("CUSTOMER", "divTab3", 0, subprocesssno);
                                                }
                                                $("#divDetail2").dialog('close');
                                            },
                                            "No": function () {
                                                $("#divDetail2").dialog('close');
                                                return false;
                                            }
                                        }
                                    });
                                }
                                else {
                                    if (SaveFormData(subprocess)) {
                                        FlightDateForGetRate = $("#divareaTrans_importfwb_fwbshipmentitinerary").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='FlightDate']").val();// set flight date value after save and next
                                        FlightNoForGetRate = $("#divareaTrans_importfwb_fwbshipmentitinerary").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='Text_FlightNo']").val();// set flight date value after save and next
                                        $("#divDetailSHC").html("");
                                        $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(2);
                                        ShowProcessDetailsNew("CUSTOMER", "divTab3", 0, subprocesssno);
                                    }
                                }
                            }
                        }
                        else {
                            if ($('#SpecialHandlingCode').val() == "" && $('#divMultiSpecialHandlingCode').text() == "") {
                                $("#divDetail2").html("No SHC selected are you sure to save FWB without any SHC.");
                                $("#divDetail2").dialog({
                                    resizable: false,
                                    modal: true,
                                    title: "SHC Information",
                                    height: 250,
                                    width: 400,
                                    buttons: {
                                        "Yes": function () {
                                            if (SaveFormData(subprocess)) {
                                                FlightDateForGetRate = $("#divareaTrans_importfwb_fwbshipmentitinerary").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='FlightDate']").val();// set flight date value after save and next
                                                FlightNoForGetRate = $("#divareaTrans_importfwb_fwbshipmentitinerary").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='Text_FlightNo']").val();// set flight date value after save and next
                                                $("#divDetailSHC").html("");
                                                $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(2);
                                                ShowProcessDetailsNew("CUSTOMER", "divTab3", 0, subprocesssno);
                                            }
                                            $("#divDetail2").dialog('close');
                                        },
                                        "No": function () {
                                            $("#divDetail2").dialog('close');
                                            return false;
                                        }
                                    }
                                });
                            }
                            else {
                                if (SaveFormData(subprocess)) {
                                    FlightDateForGetRate = $("#divareaTrans_importfwb_fwbshipmentitinerary").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='FlightDate']").val();// set flight date value after save and next
                                    FlightNoForGetRate = $("#divareaTrans_importfwb_fwbshipmentitinerary").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='Text_FlightNo']").val();// set flight date value after save and next
                                    $("#divDetailSHC").html("");
                                    $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(2);
                                    ShowProcessDetailsNew("CUSTOMER", "divTab3", 0, subprocesssno);
                                }
                            }
                        }
                    } else {
                        return false;
                    }
                } else {
                    if (IsFWBAmmendment && !$("#chkFWBAmmendMent").prop("checked"))
                        ShowMessage('warning', 'Information!', "Select FWB Amendment Checkbox for Amendment.", "bottom-right");
                    else
                        ShowMessage('warning', 'Information!', "FWB Amendment restricted. Kindly contact your Supervisor", "bottom-right");
                }
            }
        });

        if ($('#AWBNo').val().split('-')[0] == '126' || userContext.SysSetting.ClientEnvironment.toUpperCase() == "UK" || userContext.SysSetting.ClientEnvironment.toUpperCase() == "G8") {
            $('#AWBNo').attr('disabled', true);
            $("#Text_SubGroupCommodity").data("kendoAutoComplete").enable(false);
            $("#Text_ShipmentOrigin").data("kendoAutoComplete").enable(false);
            $("#Text_ShipmentDestination").data("kendoAutoComplete").enable(false);
            $("#Text_Product").data("kendoAutoComplete").enable(false);
            $("#AWBDate").data("kendoDatePicker").enable(false);
            $('#IssuingAgent').attr('disabled', true);
            $('#Pieces').attr('disabled', true);
            $('#GrossWt,#_tempGrossWt').attr('disabled', true);
            $('#_tempCBM').attr('disabled', true);
            $('#_tempChargeableWt').attr('disabled', true);
            $('#_tempVolumeWt').attr('disabled', true);
            $('#_tempVolumeWt').attr('disabled', true);
            $('#chkisBup').attr('disabled', true);
            $("#Text_buptype").data("kendoAutoComplete").enable(false);
            $("#Text_densitygroup").data("kendoAutoComplete").enable(false);
            $('[id^="ShipmentType"]').attr('disabled', true);
            $('[id^="FreightType"]').attr('disabled', true);
        }

        $("#BoardPoint").closest('table').find('input').each(function () {
            var id = $(this).attr('id')
            if (id.includes("Text_")) {
                $("#" + id).data('kendoAutoComplete').enable(false);
            }
            if (id.includes("FlightDate")) {
                $("#" + id).data('kendoDatePicker').enable(false);
            }
        })
        $(".icon-trans-plus-sign").unbind('click')
        $(".icon-trans-trash").unbind('click')

        UserSubProcessRights("divDetail", subprocesssno);
        PageRightsCheckDeliveryOrder()
        return false;
    }
    else if (subprocess.toUpperCase() == "RATE") {
        $("#btnSaveToNext").show();
        BindDimensionEventsNew();
        BindDimensionEventsNewULD();
        BindAWBOtherCharge();
        BindAWBRate();
        if ($("#tblAWBRateDesription").find("tr[id^='tblAWBRateDesription_Row_']").length <= 0) {
            SetAWBDefaultValues();
        }

        CalculateRateTotal();

        if (Number(IsDOCreated) == 1) {
            $("#divDetailSHC input,select").attr("disabled", true);
            $("#btnSave").hide();
            $("#btnSaveToNext").hide();
        }
        else
            $("#divDetailSHC input,select").attr("disabled", false);

        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                isSaveAndNext = "0";
                if (SaveFormData(subprocess)) {
                    DeliveryOrderSearch();
                }
            }
            else {
                return false;
            }
        });

        $("#btnSaveToNext").unbind("click").bind("click", function () {
            if ((IsFWbComplete && $("#chkFWBAmmendMent").prop("checked")) || (!IsFWbComplete && !$("#chkFWBAmmendMent").prop("checked"))) {
                if (cfi.IsValidSection(cntrlid)) {
                    if (SaveFormData(subprocess)) {
                        $("#divDetailSHC").html("");
                        $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(2);
                        ShowProcessDetailsNew("CUSTOMER", "divTab3", isdblclick, subprocesssno);
                    }

                } else {
                    return false;
                }
            } else {
                if (IsFWBAmmendment && !$("#chkFWBAmmendMent").prop("checked"))
                    ShowMessage('warning', 'Information!', "Select FWB Amendment Checkbox for Amendment.", "bottom-right");
                else
                    ShowMessage('warning', 'Information!', "FWB Amendment restricted. Kindly contact your Supervisor", "bottom-right");
            }

        });
        UserSubProcessRights("divDetail", subprocesssno);
        PageRightsCheckDeliveryOrder()
        return false;
    }
    else if (subprocess.toUpperCase() == "CUSTOMER") {
        $("#btnSaveToNext").show();
        BindCustomerInfo();
        if (Number(IsDOCreated) == 1) {
            $("#divTab3 input,select").attr("disabled", true);
            $("#btnSave").hide();
            $("#btnSaveToNext").hide();
        }
        else
            $("#divTab3 input,select").attr("disabled", false);
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                isSaveAndNext = "0";
                if (SaveFormData(subprocess)) {
                    DeliveryOrderSearch();
                }
            }
            else {
                return false;
            }
        });

        $("#btnSaveToNext").unbind("click").bind("click", function () {
            if ((IsFWbComplete && $("#chkFWBAmmendMent").prop("checked")) || (!IsFWbComplete && !$("#chkFWBAmmendMent").prop("checked"))) {
                if (cfi.IsValidSection(cntrlid)) {
                    if (SaveFormData(subprocess)) {
                        $("#divDetailSHC").html("");
                        $(".k-grid-content  tbody tr").find("td:eq(0)").each(function (i, e) {
                            if ($(e).text() == currentawbsno) {
                                $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(3);
                                ShowProcessDetailsNew("HANDLING", "divTab4", isdblclick, subprocesssno);
                            }
                        });
                    }
                } else {
                    return false;
                }
            } else {
                if (IsFWBAmmendment && !$("#chkFWBAmmendMent").prop("checked"))
                    ShowMessage('warning', 'Information!', "Select FWB Amendment Checkbox for Amendment.", "bottom-right");
                else
                    ShowMessage('warning', 'Information!', "FWB Amendment restricted. Kindly contact your Supervisor", "bottom-right");
            }

        });
        UserSubProcessRights("divTab3", 2129);
        PageRightsCheckDeliveryOrder()
        return false;
    }
    else if (subprocess.toUpperCase() == "HANDLING") {
        $("#btnSaveToNext").show();
        BindHandlingInfoDetails();
        if (Number(IsDOCreated) == 1) {
            $("#divTab4 input,select").attr("disabled", true);
            $("#btnSave").hide();
            $("#btnSaveToNext").hide();
        }
        else
            $("#divTab4 input,select").attr("disabled", false);

        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                isSaveAndNext = "0";
                if (SaveFormData(subprocess)) {
                    DeliveryOrderSearch();
                }
            }
            else {
                return false;
            }
        });

        $("#btnSaveToNext").unbind("click").bind("click", function () {
            if ((IsFWbComplete && $("#chkFWBAmmendMent").prop("checked")) || (!IsFWbComplete && !$("#chkFWBAmmendMent").prop("checked"))) {
                if (cfi.IsValidSection(cntrlid)) {
                    if (SaveFormData(subprocess)) {
                        $("#divDetailSHC").html("");
                        $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(4);
                        ShowProcessDetailsNew("SUMMARY", "divTab5", isdblclick);
                    }

                } else {
                    return false;
                }
            } else {
                if (IsFWBAmmendment && !$("#chkFWBAmmendMent").prop("checked"))
                    ShowMessage('warning', 'Information!', "Select FWB Amendment Checkbox for Amendment.", "bottom-right");
                else
                    ShowMessage('warning', 'Information!', "FWB Amendment restricted. Kindly contact your Supervisor", "bottom-right");
            }
        });
        UserSubProcessRights("divTab4", 2129);
        PageRightsCheckDeliveryOrder()
        return false;
    }
    else if (subprocess.toUpperCase() == "SUMMARY") {
        BindAWBSummary(isdblclick);
        if (Number(IsDOCreated) == 1) {
            $("#divTab5 input,select").attr("disabled", true);
            $("#btnSave").hide();
            $("#btnSaveToNext").hide();
        }
        else
            $("#divTab5 input,select").attr("disabled", false);
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    DeliveryOrderSearch();
                }
            }
            else {
                return false;
            }
        });
        UserSubProcessRights("divTab5", 2129);
        PageRightsCheckDeliveryOrder()
        return false;
    }
    else if (subprocess.toUpperCase() == "FHL") {
        $('#divDetail4').html('');
        $("#divDetail5").html("");
        BindFHLSection();
        $("#btnSave").hide();
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if ($('#FHL_HAWB_SPHC').val() == "" || $('#FHL_HAWB_SPHC').val() == undefined) {
                    $("#divDetail2").html("No SHC selected are you sure to save FHL without any SHC.");
                    $("#divDetail2").dialog({
                        resizable: false,
                        modal: true,
                        title: "SHC Information",
                        height: 250,
                        width: 400,
                        buttons: {
                            "Yes": function () {
                                if (SaveFormData(subprocess)) {
                                    DeliveryOrderSearch();
                                }
                                $("#divDetail2").dialog('close');
                            },
                            "No": function () {
                                $("#divDetail2").dialog('close');
                                return false;
                            }
                        }
                    });
                }
                else {
                    if (SaveFormData(subprocess)) {
                        DeliveryOrderSearch();
                    }
                }
            }
            else {
                return false;
            }
        });
        UserSubProcessRights("divDetail", subprocesssno);
        PageRightsCheckDeliveryOrder()
        return false;
    }
    else if (subprocess.toUpperCase() == "FAD") {
        $('#divDetail4').html('');
        $("#divDetail5").html("");
        BindFADSection();
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    DeliveryOrderSearch();
                }
            }
            else {
                return false;
            }
        });
        UserSubProcessRights("divDetail", subprocesssno);
        PageRightsCheckDeliveryOrder()
        return false;
    }
    else if (subprocess.toUpperCase() == "LOCATION") {
        $('#divDetail').append("<table id='tblLOCATION'></table>");
        $('#divDetail4').html('');
        $("#divDetail5").html("");
        BindLocation();
        $("#btnSave").css("display", "none");
        UserSubProcessRights("divDetail", subprocesssno);
        PageRightsCheckDeliveryOrder()
    }
    else if (subprocess.toUpperCase() == "FAA") {
        $('#divDetail').append("<table id='tblFAAChargeDescription'></table><table id='tblFAA'></table><table id='tblFAAEmailHistory'></table><table id='tblFAASMSHistory'></table></table></br></br></br>");
        $('#divDetail4').html('');
        $("#divDetail5").html("");
        BindFAASectionChargeDescription();
        BindFAASection();
        BindFAASectionAWBInformation();
        BindFAASectionEmailHistory();
        BindFAASectionSMSHistory();
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    DeliveryOrderSearch();
                }
            }
            else {
                return false;
            }
        });
        $("#btnPrint").unbind("click").bind("click", function () {
            PrintFAA();
        });
        $("#btnPrint").css("display", "block");
        UserSubProcessRights("divDetail", subprocesssno);
        PageRightsCheckDeliveryOrder()
        return false;
    }
    else if (subprocess.toUpperCase() == "EDOX") {
        $("#divXRAY").show();
        $("#spnShowSlacDetails").html("All Docs Received")
        $('#divDetail4').html('');
        $("#divDetail5").html("");
        BindEDox();
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    DeliveryOrderSearch();
                }
            }
            else {
                return false;
            }
        });
        UserSubProcessRights("divDetail", subprocesssno);
        PageRightsCheckDeliveryOrder()
        return false;
    }
}

function BindCustomInfo() {
    var oldcurrentawbsno = currentawbsno == "" ? currentPomailSno : currentawbsno
    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/GetRecordCustomInfo?AWBSNo=" + oldcurrentawbsno,
        async: false, type: "GET", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var eCustomeData = jQuery.parseJSON(result);
            if (eCustomeData.Table0.length > 0) {
                $("div[id$='areatransCustomInfo']").find("[id^='areatransCustomInfo_']").each(function (i) {
                    if (eCustomeData.Table0[i].CustomRef != "") {
                        $(this).find("[id^='CustomRef_']").val(eCustomeData.Table0[i].CustomRef);
                        $(this).find("input[id^='CustomRef_']").attr("disabled", true);
                        $(this).find("input[id^='CustomDate_']").data('kendoDatePicker').enable(false);

                        if (eCustomeData.Table0[i].CustomDate != "") {
                            $(this).find("[id^='CustomDate_']").val(eCustomeData.Table0[i].CustomDate);
                        }
                    }
                    else {
                        $(this).find("input[id^='CustomRef_']").attr("disabled", false);
                        $(this).find("input[id^='CustomDate_']").data('kendoDatePicker').enable(true);
                    }
                });
            }
        }
    });
}

function ReloadSameGridPage(subprocess) {
    var gridPage = $(".k-pager-input").find("input").val();
    var grid = $(".k-grid").data("kendoGrid");
    grid.dataSource.page(gridPage);
}

function InstantiateControl(containerId) {
    $("#" + containerId).find("input[type='text']").each(function () {
        var controlId = $(this).attr("id");
        var decimalPosition = cfi.IsValidNumeric(controlId);
        if (decimalPosition >= - 1) {
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
            var controlId = $(this).attr("id");
            var decimalPosition = cfi.IsValidSpanNumeric(controlId);
            if (decimalPosition >= - 1) {
                cfi.Numeric(controlId, decimalPosition, true);
            }
            else {
                var alphabetstyle = cfi.IsValidSpanAlphabet(controlId);
                if (alphabetstyle != "") {
                    if (alphabetstyle == "datetype") {
                        cfi.DateType(controlId, true);
                    }
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

function ShowProcessDetails(subprocess, isdblclick) {
    $("#IdAWBPrint").css("display", "");
    $("#IdAcptNote").css("display", "");
    $("#IdEDINote").css("display", "");
    $("#ulTab").hide();
    $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(0);

    $("body").append("<style>ul.k-tabstrip-items li.k-state-active{border-bottom:3px solid red;}</style>");

    if (subprocess.toUpperCase() == "FWB") {
        $("#ulTab").show();
        $('#tabstrip ul:first li:eq(0) a').text("AIR WAYBILL");
        $('#tabstrip ul:first li:eq(1) a').text("RATE");
        $('#tabstrip ul:first li:eq(2) a').text("CUSTOMER INFORMATION");
        $('#tabstrip ul:first li:eq(3) a').text("CUSTOMS");
        $('#tabstrip ul:first li:eq(4) a').text("OTHER INFO");
        $('#tabstrip ul:first li:eq(0)').css("background-color", "");
        $('#tabstrip ul:first li:eq(1)').css("background-color", "");
        $('#tabstrip ul:first li:eq(2)').css("background-color", "");
        $('#tabstrip ul:first li:eq(3)').css("background-color", "");
        $('#tabstrip ul:first li:eq(4)').css("background-color", "");
        $('#tabstrip ul:first li:eq(0) a').show();
        $('#tabstrip ul:first li:eq(1) a').hide();
        $('#tabstrip ul:first li:eq(2) a').show();
        $('#tabstrip ul:first li:eq(3) a').show();
        $('#tabstrip ul:first li:eq(4) a').show();

        $('#tabstrip ul:first li:eq(0) a').unbind("click").bind("click", function () {
            ShowProcessDetailsNew("Reservation", "divDetail", isdblclick, subprocesssno);
        });

        $('#tabstrip ul:first li:eq(2) a').unbind("click").bind("click", function () {
            ShowProcessDetailsNew("CUSTOMER", "divTab3", isdblclick, subprocesssno);
        });

        $('#tabstrip ul:first li:eq(3) a').unbind("click").bind("click", function () {
            ShowProcessDetailsNew("HANDLING", "divTab4", isdblclick, subprocesssno);
        });

        $('#tabstrip ul:first li:eq(4) a').unbind("click").bind("click", function () {
            ShowProcessDetailsNew("SUMMARY", "divTab5", isdblclick, subprocesssno);
        });

        if ($("#ulTab").find("table").find("input[id='chkFWBAmmendment']").length == 0)
            $("#ulTab").append("<table align=\"right\"><tr><td><span id=\"Amendment\"><b>Amendment</b></span>&nbsp;<input id=\"chkFWBAmmendment\" type=\"checkbox\"\">&nbsp;<span id=\"AmendmentCharges\"><b>Waive off Amendment Charges</b></span>&nbsp;<input id=\"chkAmendmentCharges\" type=\"checkbox\"\"></td></tr></table>");
        $("#ulTab").find("table").find("input[id='chkFWBAmmendment']").prop("checked", false);
        $("#ulTab").find("table").find("input[id='chkAmendmentCharges']").prop("checked", false);
    }

    if (subprocess.toUpperCase() == "LOCATION") {
        $("#btnSave").unbind("click");
        InitializePage(subprocess, "divDetail", isdblclick);
    }
    else if (subprocess.toUpperCase() == "FHL") {
        $("#btnSave").unbind("click");
        InitializePage(subprocess, "divDetail", isdblclick);
    }
    else if (subprocess.toUpperCase() == "FWB" || subprocess.toUpperCase() == "RESERVATION") {
        $.ajax({
            url: "Services/Import/ImportFWBService.svc/GetWebForm/ImportFWB/ImportFWB/RESERVATION/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#divDetail").html(result);
                if (result != undefined || result != "") {
                    InitializePage(subprocess, "divDetail", isdblclick, subprocesssno);
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
    else {
        var DeliveryOrderGetWebForm2 = {
            processName: _CURR_PRO_,
            moduleName: 'Import',
            appName: subprocess,
            Action: 'New',
            IsSubModule: '1'
        }
        if (subprocess.toUpperCase() == "FAD") {
            $("#btnSavefad").show();
            $("#btnSavefad").unbind("click").bind("click", function () {
                $('#divdetailFAD').hide();
                $.ajax({
                    url: "Services/Import/DeliveryOrderService.svc/GetWebForm",
                    async: true, type: "post", cache: false, contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({ model: DeliveryOrderGetWebForm2 }),
                    success: function (result) {



                        $("#divDetail").html(result);
                        if (result != undefined || result != "") {
                            GetProcessSequence("DELIVERYORDER");
                            InitializePage(subprocess, "divDetail", isdblclick);
                        }

                        if (!checkcanceldo) {
                            if (subprocess == "C")
                                ShowMessage('warning', 'Warning - Delivery Order', 'Delivery Order should be created before Cancel DO', " ", "bottom-right");
                        }
                    },
                    beforeSend: function (jqXHR, settings) {
                    },
                    complete: function (jqXHR, textStatus) {
                        if ($('#InitialPaymentType').length != 0) {
                            $($('#InitialPaymentType')[0].parentNode).show();
                            $($('#InitialPaymentType')[0].parentNode).prev().show();
                        }
                        if ($('#Text_PaymentType').length != 0)
                            $($('#Text_PaymentType')[0].parentNode).hide();
                    },
                    error: function (xhr) {
                        var a = "";
                    }
                });
            });
            //  $('#dvfad').html('');
            gethtmlFADgrid();
            $.ajax({
                url: "Services/Import/DeliveryOrderService.svc/GetFADIrregurality", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ AWBSNo: CurrentAWBNo }),
                //  url: "Services/Import/DeliveryOrderService.svc/GetFADIrregurality?AWBSNo=" + CurrentAWBNo, async: false, type: "get", dataType: "json", cache: false,
                //data: JSON.stringify({ AWBSNO: CurrentAWBNo }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {


                    $('#divdetailFAD').show();
                    $('#tblgrid').show();
                    $('#gridbodys_shipment').html('');

                    var Result_ = jQuery.parseJSON(result);
                    var Result = Result_.Table0;
                    var thead_body = "";
                    var thead_row = "";

                    if (Result.length > 0) {

                        var container = $("#gridbodys_shipment");
                        var tr = '';
                        for (var i = 0; i < Result.length; i++) {
                            tr += '<tr class="datarow">';
                            var td = '';
                            td += "<td class='ui-widget-content'  id='IncidentCategory'> <label  maxlength='100' style='width:100px;'>" + Result[i].IncidentCategory + "</label></td>";
                            td += "<td class='ui-widget-content'  id='ReferenceCode'> <label  maxlength='100' style='width:100px;'>" + Result[i].ReferenceCode + "</label></td>";
                            td += "<td class='ui-widget-content'  id='ReportingStation'> <label  maxlength='100' style='width:100px;'>" + Result[i].ReportingStation + "</label></td>";
                            td += "<td class='ui-widget-content'  id='AWBNo'> <label  maxlength='100' style='width:100px;'>" + Result[i].AWBNo + "</label></td>";
                            td += "<td class='ui-widget-content'  id='IrregularityStatus'> <label  maxlength='100' style='width:100px;'>" + (Result[i].IrregularityStatus) + "</label></td>";
                            td += "<td class='ui-widget-content'  id='UpdatedUser'> <label  maxlength='100' style='width:100px;'>" + (Result[i].UpdatedUser) + "</label></td>";
                            td += "<td class='ui-widget-content'  id='FlightNo'> <label  maxlength='100' style='width:100px;'>" + (Result[i].FlightNo) + "</label></td>";
                            td += "<td class='ui-widget-content'  id='FlightDate'> <label  maxlength='100' style='width:100px;'>" + (Result[i].FlightDate) + "</label></td>";

                            td += "<td class='ui-widget-content'  id='UpdatedOn'> <label  maxlength='100' style='width:100px;'>" + (Result[i].UpdatedOn) + "</label></td>";
                            td += "<td class='ui-widget-content'  id='SearchUpdatedOn'> <label  maxlength='100' style='width:100px;'>" + (Result[i].SearchUpdatedOn) + "</label></td>";
                            td += "<td class='ui-widget-content'  id='AssignTo'> <label  maxlength='100' style='width:100px;'>" + (Result[i].AssignTo) + "</label></td>";

                            tr += td + "</tr>";
                        }
                        container.append(tr);

                        $("#tblgrid tbody tr").on('click', function () {
                            $("#tblgrid tbody tr td").removeClass('highlightMBL');
                            $(this).find('td').addClass('highlightMBL');
                        });

                    }
                    else {
                        $("#gridbodys_shipment").append('<tr><td colspan="16" align="center">NO RECORD FOUND</td></tr>')
                    }

                }
            });
        }
        else {

            $.ajax({
                url: "Services/Import/DeliveryOrderService.svc/GetWebForm",
                async: true, type: "post", cache: false, contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ model: DeliveryOrderGetWebForm2 }),
                success: function (result) {
                    if (subprocess.toUpperCase() == "PAYMENT") {
                        if (userContext.SysSetting.ICMSEnvironment.toUpperCase() == "GA") {
                            $("#divDetail4").html(result);
                        }
                        else {
                            $("#divDetail").html(result);
                        }
                    }
                    else {
                        $("#divDetail").html(result);
                    }

                    // $("#divDetail").html(result);
                    if (result != undefined || result != "") {
                        GetProcessSequence("DELIVERYORDER");
                        InitializePage(subprocess, "divDetail", isdblclick);
                    }

                    if (!checkcanceldo) {
                        if (subprocess == "C")
                            ShowMessage('warning', 'Warning - Delivery Order', 'Delivery Order should be created before Cancel DO', " ", "bottom-right");
                    }
                },
                beforeSend: function (jqXHR, settings) {
                },
                complete: function (jqXHR, textStatus) {
                    if ($('#InitialPaymentType').length != 0) {
                        $($('#InitialPaymentType')[0].parentNode).show();
                        $($('#InitialPaymentType')[0].parentNode).prev().show();
                    }
                    if ($('#Text_PaymentType').length != 0)
                        $($('#Text_PaymentType')[0].parentNode).hide();
                },
                error: function (xhr) {
                    var a = "";
                }
            });
        }



    }
}

function gethtmlFADgrid() {

    //cfi.AutoComplete("ItineraryCarrierCode", "AgentSno,Ajentname", "vPOmailAgent", "AgentSno", "Ajentname", null, null, "contains");
    //cfi.AutoComplete("ItineraryFlightNo", "AgentSno,Ajentname", "vPOmailAgent", "AgentSno", "Ajentname", null, null, "contains");
    //$('#__divairmaildetails__').html('');
    //abc

    $('#divdetailFAD').append(
        '<div class="k-grid-header-wrap" id="tblgrid" style="display: none; overflow-x: scroll; overflow-y: scroll; margin-left: 10px;"><table id="tbldetailFAD" style="color:black; border: 1px black;" class="appendGrid ui-widget"> ' +
        ' <thead>' +
        '<tr><td colspan="12" align="center"><span style="font-weight:bold">Irregularity Information</span></td></tr>' +
        ' <tr>' +
        '  <th>IncidentCategory</th>' +
        ' <th>ReferenceCode</th>' +
        '   <th>ReportingStation</th>' +
        '   <th>AWBNo</th>' +
        '   <th>IrregularityStatus</th>' +
        '  <th>UpdatedUser</th>' +
        '  <th>FlightNo</th>' +
        ' <th>FlightDate</th>' +
        '  <th>UpdatedOn</th>' +
        '   <th>SearchUpdatedOn</th>' +
        '  <th>AssignTo</th>' +
        ' </tr>' +
        ' </thead>' +

        '<tbody id="gridbodys_shipment" class="ui-widget-content"></tbody>' +
        '</table></div>'

    );


}

function ClearAutoComplete(e) {
    if (e == "Text_FHL_HAWB_SHI_CountryCode")
        cfi.ResetAutoComplete("FHL_HAWB_SHI_City");
    else if (e == "Text_FHL_HAWB_CON_CountryCode")
        cfi.ResetAutoComplete("FHL_HAWB_CON_City");
    else if (e == "Text_SHIPPER_CountryCode")
        cfi.ResetAutoComplete("SHIPPER_City");
    else if (e == "Text_CONSIGNEE_CountryCode")
        cfi.ResetAutoComplete("CONSIGNEE_City");
    else if (e == "Text_Notify_CountryCode")
        cfi.ResetAutoComplete("Notify_City");
}

function ISNumeric(obj) {
    if ((event.which != 46 || $(obj).val().indexOf('.') != - 1) &&
        ((event.which < 48 || event.which > 57) &&
            (event.which != 0 && event.which != 8))) {
        event.preventDefault();
    }

    var text = $(obj).val();
    if ((text.indexOf('.') != - 1) && (text.substring(text.indexOf('.')).length > 3)) {
        event.preventDefault();
    }
}

function SearchData(obj) {
    var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    var rows = $("tr[id^='tblAWBRateDesription']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
    getUpdatedRowIndex(rows.join(","), "tblAWBRateDesription");
    var testData = $('#tblAWBRateDesription').appendGrid('getStringJson');

    if (testData == "[]" || testData == false) {
        ShowMessage('warning', 'Warning - Delivery Order', 'Invalid Data', " ", "bottom-right");
        return false;
    }

    var PostArray = [];
    PostArray = JSON.parse(testData);

    PushArray = [];
    if (PostArray.length > 0) {
        for (i = 0; i < PostArray.length; i++) {
            var m = "0" + months.indexOf($('#tdFlightDate').text().split('-')[1].toLowerCase());
            var d = "0" + $('#tdFlightDate').text().split('-')[0];
            var dd = {
                "lNOP": PostArray[i]["NoOfPieces"],
                "lWeight": PostArray[i]["GrossWeight"],
                "lWeightCode": PostArray[i]["WeightCode"],
                "lNOG": PostArray[i]["CommodityItemNumber"],
                "lOrigin": $("#tdOD").text().split('-')[0].trim(),
                "lDestination": $("#tdOD").text().split('-')[1].trim(),
                "lAirlinePrefix": $('#tdFlightNo').text().split('-')[0].trim(),
                "lCarrierCode": "",
                "lFlightNumber": $('#tdFlightNo').text().split('-')[1].trim(),
                "lFlightdate": d.substring(d.length - 2, d.length) + '/' + m.substring(m.length - 2, m.length) + '/' + $('#tdFlightDate').text().split('-')[2],
                "lFlightCarrierCode": $('#Text_FlightNo').val().split('-')[0],
                "lCurrencyCode": "INR",
                "lRateType": "PUBLISHED",
                "lSHCCode": ""
            };
            PushArray.push(dd);
        }
    }

    var req = { "lText": JSON.stringify(dd) }
    $.ajax({
        type: "POST",
        cache: false,
        url: userContext.SysSetting.CRAServiceURL + 'WebServiceGetRates.asmx/GetMultipleRTDRates',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(req),
        success: function (data) {
            alert(JSON.stringify(data));
        },
        error: function (a, b) {
            ShowMessage('warning', 'Warning - Delivery Order', 'Error occure', " ", "bottom-right");
        }
    });
}

function PopupDiv(obj) {
    CurrentRow = obj;
    var HidDataVal = $(obj).parent().parent().parent().find("input[type=hidden][id*='hdnChildData']").val();
    BindDimensionChildGrid("tblAWBRateDesriptionChild");
    if (HidDataVal != 0) {
        $("#tblAWBRateDesriptionChild").appendGrid('load', JSON.parse(HidDataVal));
    }
    cfi.PopUp("ChildGrid", "", null, null, ShowAlert);
}

function ShowAlert(e) {
    var strData;
    strData = $('#tblAWBRateDesriptionChild').appendGrid('getStringJson');
    $(CurrentRow).parent().parent().parent().find("input[type=hidden][id*='hdnChildData']").val(strData);
}

function BindDimensionChildGrid(tableid) {
    var dbtableName = tableid;
    $("#" + dbtableName).appendGrid({
        tableID: dbtableName,
        contentEditable: pageType,
        currentPage: 1, itemsPerPage: 30, whereCondition: null, sort: "",
        servicePath: './Services/Shipment/AcceptanceService.svc',
        getRecordServiceMethod: "GetDimemsionsAndULDChild",
        isGetRecord: false,
        masterTableSNo: 10,
        caption: "Dimension Information",
        initRows: 1,
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
        {
            name: 'AWBSNo', type: 'hidden', value: $('#hdnAWBSNo').val()
        },
        {
            name: "MeasurementUnitCode", display: "Mes. Unit", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete", onSelect: "return CalculateVol(this);" }, ctrlCss: { width: "100px" }, isRequired: true, AutoCompleteName: 'DeliveryOrder_MeasurementUnitCode', filterField: 'UnitCode'
        },
        {
            name: 'Length', display: 'Length', type: 'text', value: '', ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, onblur: "return CalculateVol(this);", }, isRequired: true, onChange: function (evt, rowIndex) {
            }
        },
        {
            name: 'Width', display: 'Width', type: 'text', value: '', ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, onblur: "return CalculateVol(this);", }, isRequired: true, onChange: function (evt, rowIndex) {
            }
        },
        {
            name: 'Height', display: 'Height', type: 'text', value: 0, ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, onblur: "return CalculateVol(this);", }, onChange: function (evt, rowIndex) {
            }
        },
        {
            name: 'Pieces', display: 'Pieces', type: 'text', value: 0, ctrlCss: { width: '120px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 10, onblur: "return CalculateVol(this);", }, onChange: function (evt, rowIndex) {
            }
        },
        {
            name: 'VolumeWeight', display: 'Volume Weight', type: 'text', ctrlCss: { width: '120px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, }, isRequired: true, value: ''
        },
        {
            name: "VolumeUnit", display: "Vol. Unit", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "100px" }, isRequired: true, AutoCompleteName: 'DeliveryOrder_VolumeCode', filterField: 'VolumeCode'
        },
        {
            name: 'AWBRateDescriptionSNo', type: 'hidden', value: 0
        },
        ],
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, removeLast: true }
    });
}

function BindCountryCodeAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='CountryCode']").each(function () {
        cfi.AutoCompleteV2($(this).attr("name"), "CountryCode,CountryName", "DeliveryOrder_Country", null, "contains");
    });

    $(elem).find("input[id^='InfoType']").each(function () {
        cfi.AutoCompleteV2($(this).attr("name"), "InformationCode,Description", "DeliveryOrder_InformationTypeOCI", null, "contains");
    });

    $(elem).find("input[id^='CSControlInfoIdentifire']").each(function () {
        cfi.AutoCompleteV2($(this).attr("name"), "CustomsCode,Description", "DeliveryOrder_CustomsOCI", null, "contains");
    });

    $(elem).find("input[id^='FHL_OCI_CountryCode']").each(function () {
        cfi.AutoCompleteV2($(this).attr("name"), "CountryCode,CountryName", "DeliveryOrder_CountryCode", null, "contains");
    });

    $(elem).find("input[id^='FHL_OCI_InfoType']").each(function () {
        cfi.AutoCompleteV2($(this).attr("name"), "InformationCode,Description", "DeliveryOrder_InformationCode", null, "contains");
    });

    $(elem).find("input[id^='FHL_OCI_CSControlInfoIdentifire']").each(function () {
        cfi.AutoCompleteV2($(this).attr("name"), "CustomsCode,Description", "DeliveryOrder_CustomsCode", null, "contains");
    });
}

function ReBindCountryCodeAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_import_fwbshipmentocitrans']").find("[id^='areaTrans_import_fwbshipmentocitrans']").each(function () {
        $(this).find("input[id^='CountryCode']").each(function () {
            var newDataSource = GetDataSourceV2("Text_" + $(this).attr("id"), "DeliveryOrder_fwbshipmen_CountryCode");
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });

        $(this).find("input[id^='InfoType']").each(function () {
            var newDataSource = GetDataSourceV2("Text_" + $(this).attr("id"), "DeliveryOrder_fwbshipmen_InfoType");
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });

        $(this).find("input[id^='CSControlInfoIdentifire']").each(function () {
            var newDataSource = GetDataSourceV2("Text_" + $(this).attr("id"), "DeliveryOrder_fwbshipmen_CSControlInfoIdentifire");
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
    });

    $(elem).closest("div[id$='areaTrans_import_fhlshipmentocitrans']").find("[id^='areaTrans_import_fhlshipmentocitrans']").each(function () {
        $(this).find("input[id^='FHL_OCI_CountryCode']").each(function () {
            var newDataSource = GetDataSourceV2("Text_" + $(this).attr("id"), "DeliveryOrder_fwbshipmen_FHL_CountryCode");
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });

        $(this).find("input[id^='FHL_OCI_InfoType']").each(function () {
            var newDataSource = GetDataSourceV2("Text_" + $(this).attr("id"), "DeliveryOrder_fwbshipmen_FHL_InfoType");
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });

        $(this).find("input[id^='FHL_OCI_CSControlInfoIdentifire']").each(function () {
            var newDataSource = GetDataSourceV2("Text_" + $(this).attr("id"), "DeliveryOrder_FHL_OCI_CSControlInfoIdentifire");
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
    });
}

function PrintImportAWB() {
    window.open("awbprintA4.html?sno=" + btoa(currentawbsno) + "&pagename=" + btoa('DeliveryOrder'))
}

function UploadSPHCDocument(objId, nexctrlid) {
    var fileSelect = document.getElementById(objId);
    var files = fileSelect.files;
    var fileName = "";
    var data = new FormData();

    for (var i = 0; i < files.length; i++) {
        fileName = files[i].name;
        data.append(files[i].name, files[i]);
    }

    $.ajax({
        url: "Handler/UploadImage.ashx",
        type: "POST",
        data: data,
        contentType: false,
        processData: false,
        success: function (result) {
            $("#" + objId).closest("tr").find("a[id^='ahref_" + nexctrlid + "']").attr("linkdata", result.split('#UploadImage#')[0]);
            $("#" + objId).closest("tr").find("span[id^='" + nexctrlid + "']").text(result.split('#UploadImage#')[1]);
        },
        error: function (err) {
            ShowMessage('info', 'File Upload!', "Unable to upload selected file. Please try again.", "bottom-right");
        }
    });
}

function DownloadSPHCDocument(objId, nexctrlid) {
    if (parseInt($("#" + objId).closest('tr').find("span[id^='uploaddocsno']").text() || "0") > 0) {
        DownloadEDoxFromDB(parseInt($("#" + objId).closest('tr').find("span[id^='uploaddocsno']").text() || "0"), "O")
    }
    else {
        if ($("#" + objId).attr("linkdata") != undefined && $("#" + objId).attr("linkdata") != "") {
            window.location.href = "Handler/FileUploadHandler.ashx?l=UploadImage&f=" + $("#" + objId).attr("linkdata");
        }
        else {
            ShowMessage('info', 'Download!', "Invalid attempt.", "bottom-right");
        }
    }
}

function SaveCustomInfo() {
    var CustomFlag = false;
    var IsCustomRef = $("#CustomRef_0").val() != "" ? true : false;
    var IsCustomDate = $("#CustomDate_0").val();
    var IsCustomRefD = $("#CustomRef_1").val() != "" ? true : false;
    var IsCustomDateD = $("#CustomDate_1").val();

    if (!IsCustomRef && userContext.SysSetting.ClientEnvironment.toUpperCase() == "TH") {
        ShowMessage('warning', 'Information!', "Kindly Enter Custom Reference No", "bottom-right");
        $("#CustomRef_0").focus();
        CustomFlag = true;
    }

    if (IsCustomDate == "" && CustomFlag == false) {
        ShowMessage('warning', 'Information!', "Kindly Select Custom Reference Date", "bottom-right");
        $("#CustomDate_1").focus();
        CustomFlag = true;
    }

    if (IsCustomDateD == "" && CustomFlag == false) {
        ShowMessage('warning', 'Information!', "Kindly Select Custom Reference Date", "bottom-right");
        $("#CustomDate_1").focus();
        CustomFlag = true;
    }

    var CustomReferenceArray = [];
    $("div[id$='areatransCustomInfo']").find("[id^='areatransCustomInfo_']").each(function () {
        var CustomReference = {
            AWBSNo: currentawbsno == "" ? currentPomailSno : currentawbsno,
            IsCustomVerification: 1,
            CustomReferenceNo: $(this).find("[id^='CustomRef_']").val(),
            CutomReferenceDate: $(this).find("[id^='CustomDate_']").val(),
            Ispomail: currentawbsno == "" ? 1 : 0
        }
        CustomReferenceArray.push(CustomReference);
    })

    if (CustomFlag == false) {
        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/SaveCustomInfo", async: false, type: "POST", dataType: "json", cache: false,
            data:
                JSON.stringify({
                    strData: btoa(JSON.stringify({
                        AWBSNo: currentawbsno,
                        lstCustomReference: CustomReferenceArray
                    }))
                }),

            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    if (myData.Table0[0].SuccessMsg == "0") {
                        ShowMessage('success', 'Success -Custom Reference Information', "Processed Successfully", "bottom-right");
                        DeliveryOrderSearch();
                    }
                    else if (result.split('?')[0] == "1") {
                        ShowMessage('warning', 'Information!', result.split('?')[1], "bottom-right");
                        DeliveryOrderSearch();
                    }
                    else
                        ShowMessage('warning', 'Warning - Custom Reference Information', "Unable to process.", "bottom-right");
                }
            }
        });
    }
}

function SaveFormData(subprocess) {
    var issave = false;

    if (subprocess.toUpperCase() == "RESERVATION" || subprocess.toUpperCase() == "FWB") {
        issave = SaveReservationInfo();
    }
    else if (subprocess.toUpperCase() == "CUSTOM") {
        SaveCustomInfo();
    }
    else if (subprocess.toUpperCase() == "RATE") {
        issave = SaveDimensionInfoNew();
    }
    else if (subprocess.toUpperCase() == "CUSTOMER") {
        issave = SaveCustomerInfo();
    }
    else if (subprocess.toUpperCase() == "HANDLING") {
        issave = SaveHandlingInfo();
    }
    else if (subprocess.toUpperCase() == "SUMMARY") {
        issave = SaveAWBSummary();
    }
    else if (subprocess.toUpperCase() == "FHL") {
        issave = SaveFHLinfo();
    }
    else if (subprocess.toUpperCase() == "FAA") {
        issave = SaveFAAinfo();
    }
    else if (subprocess.toUpperCase() == "FAD") {
        issave = SaveFADinfo();
    }
    else if (subprocess.toUpperCase() == "DIMENSION") {
        issave = SaveDimensionInfo();
    }
    else if (subprocess.toUpperCase() == "ULDDIMENSIONINFO") {
        issave = SaveDimensionULDInfo();
    }
    else if (subprocess.toUpperCase() == "ULDDIMENSIONDETAILS") {
        issave = SaveDimensionULDDetails();
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
    else if (subprocess.toUpperCase() == "CHECKLIST") {
        issave = SaveCheckList();
    }
    else if (subprocess.toUpperCase() == "EDOX") {
        issave = SaveEDoxList();
    }
    else if (subprocess.toUpperCase() == "DOCS") {
        issave = SaveEDoxListAWD();
    }
    else if (subprocess.toUpperCase() == "DO") {
        if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "GA") {
            $("#btnGetCharges").closest('table').css('display', 'none')
            $("#BillToText").removeAttr("data-valid").removeAttr("data-valid-msg");
        }
        else {
            $("#btnGetCharges").closest('table').css('display', 'block')
        }
        if ($("input:radio[id='CustomerType']:checked").val() == "1") {
            CheckAgentCreditLimit("", "", "", $('#BillTo').val());
            if (flag == true)
                issave = SaveDOInfo();
        }
        else {
            issave = SaveDOInfo();
        }
    }
    else if (subprocess.toUpperCase() == "PAYMENT") {
        issave = SaveDOPayment();
    }
    else if (subprocess.toUpperCase() == "RELEASE") {
        issave = SaveDLVInfo();
    }
    else if (subprocess.toUpperCase() == "CANCEL DO") {
        issave = CancelDO("Cancel");
    }

    else if (subprocess.toUpperCase() == "CUSTOMREFERENCENUMBER") {
        issave = SaveCustomReference();
    }
    return issave;
}

function ExtraCondition(textId) {
    var filter = cfi.getFilter("AND");
    if (textId == "Text_UNKAWBNo") {
        $("#Text_ShipmentOrigin").data("kendoAutoComplete").setDefaultValue('', '');
        $("#Text_ShipmentDestination").data("kendoAutoComplete").setDefaultValue('', '');
    }

    if (textId.indexOf("Text_FHL_HAWB_SHI_City") >= 0) {
        cfi.setFilter(filter, "CountrySNo", "eq", $("#Text_FHL_HAWB_SHI_CountryCode").data("kendoAutoComplete").key());
        var filterShipperCityFHL = cfi.autoCompleteFilter(filter);
        return filterShipperCityFHL;
    }
    else if (textId.indexOf("Text_FHL_HAWB_CON_City") >= 0) {
        cfi.setFilter(filter, "CountrySNo", "eq", $("#Text_FHL_HAWB_CON_CountryCode").data("kendoAutoComplete").key());
        var filterConsigneeCityFHL = cfi.autoCompleteFilter(filter);
        return filterConsigneeCityFHL;
    }
    else if ((textId.indexOf("Text_FHL_HAWB_SHI_AccountNo") >= 0) || (textId.indexOf("Text_FHL_HAWB_SHI_Name") >= 0)) {
        cfi.setFilter(filter, "CustomerTypeName", "eq", "SHIPPER");
        var ShipperAccountFilterFHL = cfi.autoCompleteFilter(filter);
        return ShipperAccountFilterFHL;
    }
    else if ((textId.indexOf("Text_FHL_HAWB_CON_AccountNo") >= 0) || (textId.indexOf("Text_FHL_HAWB_CON_AccountNoName") >= 0)) {
        cfi.setFilter(filter, "CustomerTypeName", "eq", "CONSIGNEE");
        var ConsigneeFilterFHL = cfi.autoCompleteFilter(filter);
        return ConsigneeFilterFHL;
    }
    else if (textId.indexOf("Text_SHIPPER_City") >= 0) {
        cfi.setFilter(filter, "CountrySNo", "eq", $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").key());
        var filterShipperCity = cfi.autoCompleteFilter(filter);
        return filterShipperCity;
    }
    else if (textId.indexOf("Text_Commodity") >= 0) {
        if (parseInt($("#Text_SubGroupCommodity").data("kendoAutoComplete").key() || "0") > 0) {
            cfi.setFilter(filter, "SubGroupSNo", "eq", $("#Text_SubGroupCommodity").data("kendoAutoComplete").key());
            var CommodityFilter = cfi.autoCompleteFilter(filter);
            return CommodityFilter;
        }
    }
    else if (textId.indexOf("Text_SubGroupCommodity") >= 0) {
        if (parseInt($("#Text_Commodity").data("kendoAutoComplete").key() || "0") > 0) {
            cfi.setFilter(filter, "CommoditySNo", "eq", $("#Text_Commodity").data("kendoAutoComplete").key());
            CommoditySubGroupFilter = cfi.autoCompleteFilter(filter);
            return CommoditySubGroupFilter;
        }
    }
    else if (textId.indexOf("Text_Notify_City") >= 0) {
        cfi.setFilter(filter, "CountrySNo", "eq", $("#Text_Notify_CountryCode").data("kendoAutoComplete").key());
        var filterNotifyCity = cfi.autoCompleteFilter(filter);
        return filterNotifyCity;
    }
    else if (textId.indexOf("Text_CONSIGNEE_City") >= 0) {
        cfi.setFilter(filter, "CountrySNo", "eq", $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").key());
        var filterConsigneeCity = cfi.autoCompleteFilter(filter);
        return filterConsigneeCity;
    }
    else if (textId.indexOf("Text_FlightNo") >= 0) {
        cfi.setFilter(filter, "OriginAirportSno", "eq", $("#" + textId).closest('tr').find("input[id^='Text_BoardPoint']").data("kendoAutoComplete").key());
        cfi.setFilter(filter, "DestinationAirportSno", "eq", $("#" + textId).closest('tr').find("input[id^='Text_offPoint']").data("kendoAutoComplete").key());
        cfi.setFilter(filter, "FlightDate", "eq", cfi.CfiDate($("#" + textId).closest('tr').find("[id^='FlightDate']").attr('id')));
        var FlightOriginFilter = cfi.autoCompleteFilter(filter);
        return FlightOriginFilter;
    }
    else if (textId.indexOf("Text_Location") >= 0) {
        //var Origin = $('#tblShipmentInfo tr:nth-child(4)>td:eq(2)').text().split('-')[0];
        //cfi.setFilter(filter, "WarehouseCity", "eq", Origin);
        //var LocaFilter = cfi.autoCompleteFilter(filter);
        //return LocaFilter;
    }
    else if (textId == "Text_SPHCType") {
        if ($("#HAWB").val() != "") {
            cfi.setFilter(filter, "HAWBSNo", "eq", $("#HAWB").val())
            var SPHCFilter = cfi.autoCompleteFilter(filter);
            return SPHCFilter;
        }
        else {
            cfi.setFilter(filter, "AWBSNo", "eq", currentawbsno);
            var SPHCFilter = cfi.autoCompleteFilter(filter);
            return SPHCFilter;
        }
    }
    else if (textId == "Text_SPHC") {
        cfi.setFilter(filter, "IsDGR", "eq", "1");
        var SPHCFilter = cfi.autoCompleteFilter(filter);
        return SPHCFilter;
    }
    else if ((textId.indexOf("SHIPPER_AccountNo") >= 0) || (textId.indexOf("SHIPPER_Name") >= 0)) {
        cfi.setFilter(filter, "CustomerTypeName", "eq", "SHIPPER");
        cfi.setFilter(filter, "CitySNo", "neq", userContext.CitySNo);
        var ShipperAccountFilter = cfi.autoCompleteFilter(filter);
        return ShipperAccountFilter;
    }
    else if ((textId.indexOf("CONSIGNEE_AccountNo") >= 0) || (textId.indexOf("CONSIGNEE_AccountNoName") >= 0)) {
        cfi.setFilter(filter, "CustomerTypeName", "eq", "CONSIGNEE");
        cfi.setFilter(filter, "CitySNo", "eq", userContext.CitySNo);
        var ConsigneeFilter = cfi.autoCompleteFilter(filter);
        return ConsigneeFilter;
    }
    else if (textId.indexOf("Text_SLINo") >= 0) {
        cfi.setFilter(filter, "AWBSNo", "eq", currentawbsno);
        var filterSLINo = cfi.autoCompleteFilter(filter);
        return filterSLINo;
    }
    else if (textId == "Text_AuthorizedPerson") {
        cfi.setFilter(filter, "CustomerSNo", "eq", $("#Text_Consignee").data("kendoAutoComplete").key())
        var filterAuthorizedPerson = cfi.autoCompleteFilter(filter);
        return filterAuthorizedPerson;
    }
    else if (textId == "Text_HAWB") {
        cfi.setFilter(filter, "AWBSNo", "eq", currentawbsno)
        var filterAuthorizedPerson = cfi.autoCompleteFilter([filter]);
        return filterAuthorizedPerson;
    }
    else if (textId == "Text_EdoxHAWBNo") {
        cfi.setFilter(filter, "AWBSNo", "eq", currentawbsno)
        var filterAuthorizedPerson = cfi.autoCompleteFilter([filter]);
        return filterAuthorizedPerson;
    }
    else if (textId == "Text_DONo") {
        //  cfi.setFilter(filter, "AWBSNo", "eq", currentawbsno)
        //if (subprocesssno == 2137)
        //    cfi.setFilter(filter, "IsCompletePD", "eq", "0")
        if (currentawbsno != "0")
            cfi.setFilter(filter, "AWBSNo", "eq", currentawbsno)
        else
            cfi.setFilter(filter, "POMailSNo", "eq", currentPomailSno)
        //if (subprocesssno == 2305)
        //    cfi.setFilter(filter, "IsPhysicalDelivery", "eq", "0")
        //cfi.setFilter(filter, "IsPayment", "eq", "0")
        var filterAuthorizedPerson = cfi.autoCompleteFilter(filter);
        return filterAuthorizedPerson;
    }
    else if (textId == "Text_FAD_ReportingStation") {
        cfi.setFilter(filter, "CitySNo", "eq", userContext.CitySNo)
        var filterReportingStation = cfi.autoCompleteFilter([filter]);
        return filterReportingStation;
    }
    else if (textId == "Text_BillTo") {
        cfi.setFilter(filter, "CityCode", "eq", Finaldestination)
        var filterBillTo = cfi.autoCompleteFilter([filter]);
        return filterBillTo;
    }
    else if (textId == "Text_ParticipantName") {
        if ($("#HAWB").val() != "") {
            cfi.setFilter(filter, "HAWBSNo", "eq", $("#HAWB").val())
            var filterAuthorizedPerson = cfi.autoCompleteFilter(filter);
            return filterAuthorizedPerson;
        }
        else {
            cfi.setFilter(filter, "AWBSNo", "eq", currentawbsno)
            var filterAuthorizedPerson = cfi.autoCompleteFilter(filter);
            return filterAuthorizedPerson;
        }
    }
    else if (textId == "Text_DeliverdTo") {
        if ($("#HAWB").val() != "" && typeof ($("#HAWB").val()) !== "undefined") {
            cfi.setFilter(filter, "HAWBSNo", "eq", $("#HAWB").val())
            var filterAuthorizedPerson = cfi.autoCompleteFilter(filter);
            return filterAuthorizedPerson;
        }
        else {
            cfi.setFilter(filter, "AWBSNo", "eq", currentawbsno)
            var filterAuthorizedPerson = cfi.autoCompleteFilter(filter);
            return filterAuthorizedPerson;
        }
    }
    else if (textId == "Text_FHL_HAWB_Origin") {
        cfi.setFilter(filter, "SNo", "neq", $("#Text_FHL_HAWB_Destination").data("kendoAutoComplete").key())
        var filterOrigintxt = cfi.autoCompleteFilter([filter]);
        return filterOrigintxt;
    }
    else if (textId == "Text_FHL_HAWB_Destination") {
        cfi.setFilter(filter, "SNo", "neq", $("#Text_FHL_HAWB_Origin").data("kendoAutoComplete").key())
        var filterOrigintxt = cfi.autoCompleteFilter([filter]);
        return filterOrigintxt;
    }
    else if (textId.indexOf("Text_ULDNo") >= 0) {
        cfi.setFilter(filter, "AWBSNo", "eq", currentawbsno);
        cfi.setFilter(filter, "DailyFlightSNo", "eq", $("#" + textId).closest("tr").find("span[id^='DailyFlightSNo']").text());
        cfi.setFilter(filter, "ULDStockSNo", "Notin", $("#ULDNo").val());
        var filterULDtxt = cfi.autoCompleteFilter([filter]);
        return filterULDtxt;
    }
    else if (textId == "Text_PDULDNo") {
        cfi.setFilter(filter, "DOSNo", "eq", $("#Text_DONo").data("kendoAutoComplete").key());
        var filterULDtxt = cfi.autoCompleteFilter([filter]);
        return filterULDtxt;
    }
    else if (textId == "Text_ShipmentDestination") {
        cfi.setFilter(filter, "SNo", "Notin", $("#Text_ShipmentOrigin").data("kendoAutoComplete").key());
        var filterDestxt = cfi.autoCompleteFilter([filter]);
        return filterDestxt;
    }
    else if (textId == "Text_ShipmentOrigin") {
        cfi.setFilter(filter, "SNo", "Notin", $("#Text_ShipmentDestination").data("kendoAutoComplete").key());
        var filterDestxt = cfi.autoCompleteFilter([filter]);
        return filterDestxt;
    }
    //else if (textId.indexOf("Text_offPoint") >= 0) {
    //    cfi.setFilter(filter, "SNo", "Notin", $("#" + textId).closest('tr').find("input[id^='Text_BoardPoint']").data("kendoAutoComplete").key());
    //    var filterDestxt = cfi.autoCompleteFilter([filter]);
    //    return filterDestxt;
    //}
    //else if (textId.indexOf("Text_BoardPoint") >= 0) {
    //    cfi.setFilter(filter, "SNo", "Notin", $("#" + textId).closest('tr').find("input[id^='Text_offPoint']").data("kendoAutoComplete").key());
    //    var filterDestxt = cfi.autoCompleteFilter([filter]);
    //    return filterDestxt;
    //}
    else if (textId == "Text_offPoint" >= 0) {
        cfi.setFilter(filter, "SNo", "Notin", $("#" + textId).closest('tr').find("input[id^='Text_BoardPoint']").data("kendoAutoComplete").key());
        var filterDestxt = cfi.autoCompleteFilter([filter]);
        return filterDestxt;
    }
    else if (textId == "Text_BoardPoint" >= 0) {
        cfi.setFilter(filter, "SNo", "Notin", $("#" + textId).closest('tr').find("input[id^='Text_offPoint']").data("kendoAutoComplete").key());
        var filterDestxt = cfi.autoCompleteFilter([filter]);
        return filterDestxt;
    }

    if (textId == "tblAwbULDLocation_SPHC_" + textId.split('_')[2]) {
        var id = textId;
        if (textId.split('_')[0] == "tblAwbULDLocation")
            return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#tblAwbULDLocation_HdnSPHC_" + id.split('_')[2]).val()), filter = cfi.autoCompleteFilter(textId);
    }

    if (textId == "tblAwbULDLocation_HAWB_" + textId.split('_')[2]) {
        arrHAWB = [];
        var arrGroup = [];
        var arrList = [];
        $("#tblAwbULDLocation_HAWB_" + textId.split('_')[2]).closest("table").find("tr[id^='tblAwbULDLocation_Row_']").each(function () {
            if ($(this).find("input[id^='tblAwbULDLocation_HAWB_']").val() != "" && $(this).find("input[id^='tblAwbULDLocation_StartPieces_']").val() != "" && $(this).find("input[id^='tblAwbULDLocation_EndPieces_']").val() != "") {
                var _HAWBNo = $(this).find("input[id^='tblAwbULDLocation_HAWB_']").val();
                var _HousePieces = parseInt(parseInt($(this).find("input[id^='tblAwbULDLocation_EndPieces_']").val()) - parseInt($(this).find("input[id^='tblAwbULDLocation_StartPieces_']").val() == undefined ? 0 : $(this).find("input[id^='tblAwbULDLocation_StartPieces_']").val()) + parseInt(1));
                arrHAWB.push(
                    {
                        HAWBNo: _HAWBNo,
                        HousePieces: _HousePieces
                    });
                if ((arrList.length > 0 && $.inArray(_HAWBNo, arrList) == - 1) || arrList.length == 0)
                    arrList.push(

                        _HAWBNo
                    );
            }
        });

        var TotalPcs = 0;
        var str = "";
        var FinalHAWBNo = "";

        if (arrHAWB != null && arrHAWB.length > 0) {
            for (var k = 0; k < arrList.length; k++) {
                {
                    TotalPcs = 0;
                    housePieces1 = 0;
                    for (var i = 0; i < arrHAWB.length; i++) {
                        if (arrList[k] == arrHAWB[i]["HAWBNo"]) {
                            TotalPcs = TotalPcs + parseInt(arrHAWB[i]["HousePieces"]);
                        }
                        var housePieces1 = arrList[k].substring(arrList[k].lastIndexOf('-') + 1, arrList[k].length);
                    }
                    if (TotalPcs == parseInt(housePieces1)) {
                        str = arrList[k] + "," + str;
                    }
                }
            }
        }

        FinalHAWBNo = str.substring(0, str.lastIndexOf(','));
        try {
            cfi.setFilter(filter, "AWBSNo", "eq", currentawbsno);
            cfi.setFilter(filter, "HAWBNo", "notin", FinalHAWBNo);
            var HAWBAutoCompleteFilter = cfi.autoCompleteFilter([filter]);
            return HAWBAutoCompleteFilter;
        }
        catch (exp) {
        }
    }

    if (textId == "tblAwbULDLocation_AssignLocation_" + textId.split('_')[2]) {
        try {
            cfi.setFilter(filter, "CityCode", "eq", userContext.CityCode);
            if ($("#tblAwbULDLocation_HdnSPHC_" + textId.split('_')[2]).val() != "" && $("#tblAwbULDLocation_TempControlled_" + textId.split('_')[2] + " option:checked").val() == "0" && $("#tblAwbULDLocation_StartTemperature_" + textId.split('_')[2]).val() != "" && $("#tblAwbULDLocation_EndTemperature_" + textId.split('_')[2]).val() != "") {
                cfi.setFilter(filter, "StartTemperature", "lte", $("#tblAwbULDLocation_StartTemperature_" + textId.split('_')[2]).val());
                cfi.setFilter(filter, "EndTemperature", "gte", $("#tblAwbULDLocation_StartTemperature_" + textId.split('_')[2]).val());
                cfi.setFilter(filter, "StartTemperature", "lte", $("#tblAwbULDLocation_EndTemperature_" + textId.split('_')[2]).val());
                cfi.setFilter(filter, "EndTemperature", "gte", $("#tblAwbULDLocation_EndTemperature_" + textId.split('_')[2]).val());
                cfi.setFilter(filter, "SHCSNo", "in", $("#tblAwbULDLocation_HdnSPHC_" + textId.split('_')[2]).val());
            }
            else if ($("#tblAwbULDLocation_HdnSPHC_" + textId.split('_')[2]).val() != "" && $("#tblAwbULDLocation_TempControlled_" + textId.split('_')[2] + " option:checked").val() == "1") {
                cfi.setFilter(filter, "SHCSNo", "in", $("#tblAwbULDLocation_HdnSPHC_" + textId.split('_')[2]).val());
            }
            else if ($("#tblAwbULDLocation_HdnSPHC_" + textId.split('_')[2]).val() == "") {
                if ($("#tblAwbULDLocation_TempControlled_" + textId.split('_')[2] + " option:checked").val() == "0" && $("#tblAwbULDLocation_StartTemperature_" + textId.split('_')[2]).val() != "" && $("#tblAwbULDLocation_EndTemperature_" + textId.split('_')[2]).val() != "") {
                    cfi.setFilter(filter, "StartTemperature", "lte", $("#tblAwbULDLocation_StartTemperature_" + textId.split('_')[2]).val());
                    cfi.setFilter(filter, "EndTemperature", "gte", $("#tblAwbULDLocation_StartTemperature_" + textId.split('_')[2]).val());
                    cfi.setFilter(filter, "StartTemperature", "lte", $("#tblAwbULDLocation_EndTemperature_" + textId.split('_')[2]).val());
                    cfi.setFilter(filter, "EndTemperature", "gte", $("#tblAwbULDLocation_EndTemperature_" + textId.split('_')[2]).val());
                    cfi.setFilter(filter, "SHCSNo", "in", $("#tblAwbULDLocation_HdnSPHC_" + textId.split('_')[2]).val());
                }
                if ($("#tblAwbULDLocation_TempControlled_" + textId.split('_')[2] + " option:checked").val() == "0" && $("#tblAwbULDLocation_StartTemperature_" + textId.split('_')[2]).val() == "" && $("#tblAwbULDLocation_EndTemperature_" + textId.split('_')[2]).val() == "") {
                    cfi.setFilter(filter, "SHCSNo", "eq", -1);
                }
                if ($("#tblAwbULDLocation_TempControlled_" + textId.split('_')[2] + " option:checked").val() == "1") {
                    cfi.setFilter(filter, "SHCSNo", "eq", "0");
                }
            }
            else {
                cfi.setFilter(filter, "SHCSNo", "eq", -1);
            }

            var SPHCAutoCompleteFilter = cfi.autoCompleteFilter([filter]);
            return SPHCAutoCompleteFilter;
        }
        catch (exp) {
        }
    }

    if (textId == "tblAwbULDLocation_MovableLocation_" + textId.split('_')[2]) {
        try {
            cfi.setFilter(filter, "AirportSNo", "eq", userContext.AirportSNo);
            var MovableAutoCompleteFilter = cfi.autoCompleteFilter([filter]);
            return MovableAutoCompleteFilter;
        }
        catch (exp) {
        }
    }

    if (textId == "Text_SearchFlightNoPopUp") {
        debugger
        var filter = cfi.getFilter("AND");
        var id = textId;

        cfi.setFilter(filter, "OriginAirportSNo", "eq", $('#Text_BoardPointPopUp').data("kendoAutoComplete").key());
        cfi.setFilter(filter, "DestinationAirportSNo", "eq", $('#Text_offPointPopUp').data("kendoAutoComplete").key());
        cfi.setFilter(filter, "FlightDate", "eq", $("#FlightDatePopUp").val());
        return cfi.autoCompleteFilter(filter);
    }
}

function CheckCreditLimit(BillTo, TotalCredit) {
    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/CheckCreditLimit", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ BillTo: BillTo, TotalCredit: TotalCredit }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result != "") {
                return false;
            }
            else
                return true;
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - DO', "AWB No. [" + CurrentAWBNo + "] -  unable to process.", "bottom-right");
        }
    });
}

function SaveDOInfo() {
    if (userContext.SysSetting.ICMSEnvironment == "GA") {
        $('input[id="ParticipantName"]').closest('td').find('span[class="k-dropdown-wrap k-state-default"]').css("border-color", "white")
        $('input[id="ParticipantName"]').closest('td').find('span[class="k-dropdown-wrap k-state-disabled"]').css("color", "white");
        $("#AuthorizedPersonId").removeAttr('data-valid');
    }

    /*-------------------------------Commented for TFS-15706----------------------------------------
    //if (userContext.SysSetting.ClientEnvironment.toUpperCase() == 'UK') {
    //    $.ajax({
    //        url: "../Services/Import/DeliveryOrderService.svc/GetInvoiceType",
    //        async: false,
    //        type: "POST",
    //        dataType: "json",
    //        data: JSON.stringify({ AWBSNo: currentawbsno }),
    //        contentType: "application/json; charset=utf-8", cache: false,
    //        success: function (result) {
    //            var Data = jQuery.parseJSON(result);
    //            var resData = Data.Table0;
    //            if (resData.length > 0) {
    //                if (Number(resData[0].IsInterNational) == 0) {
    //                    if ($("#StateCode").val() == "" && $("#GSTNo").val() == "") {
    //                        ShowMessage('warning', 'Warning - Delivery Order [' + CurrentAWBNo + ']', "GST No can not be blank.", "bottom-right");
    //                        flag = false;
    //                        return false
    //                    }
    //                }
    //            }
    //        }
    //    });
    //}
    */

    flag = true;
    var pieces = 0;
    var grossWt = 0;
    var totalPieces = 0;
    var Mode = $("[id^='CustomerType']").is(':disabled') == true ? "CASH" : $('input:radio[id="CustomerType"]:checked').val() == 0 ? "CASH" : "CREDIT";
    var BillTo = $("#Text_BillTo").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_BillTo").data("kendoAutoComplete").key();
    var BillToText = $("#BillToText").val();
    var TotalCredit = $("span[id='TotalAmountDO']").text();
    var paymentType = $("#Text_PaymentType").data("kendoAutoComplete").value();
    var frtAmount = $("span[id='TotalAmountDestCurrency']").text();
    var hawb = $("#Text_HAWB").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_HAWB").data("kendoAutoComplete").key();
    var housePieces = 0;
    if (Number(hawb) > 0)
        housePieces = $("#Text_HAWB").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_HAWB").data("kendoAutoComplete").value().split("-")[1];

    if ($("span[id='ConsigneeName']").text() == "") {
        ShowMessage('warning', 'Warning - Delivery Order [' + CurrentAWBNo + ']', "Consignee Name Not Updated.", "bottom-right");
        flag = false;
        return false
    }

    if ($('#divareaTrans_import_dohandlingcharge').css('display') == 'none') {
        if ($("span[id='DORRemainingPieces']").text() != "0") {
            if (userContext.SysSetting.ICMSEnvironment.toUpperCase() != "GA") {
                if (userContext.SysSetting.ICMSEnvironment.toUpperCase() == "JT" && IsDoChargeApplicable == 1) {
                    ShowMessage('warning', 'Warning - Delivery Order [' + CurrentAWBNo + ']', "Please Get Charges First.", "bottom-right");
                    flag = false;
                    return false;
                }
                else if (userContext.SysSetting.ICMSEnvironment.toUpperCase() != "JT") {
                    ShowMessage('warning', 'Warning - Delivery Order [' + CurrentAWBNo + ']', "Please Get Charges First.", "bottom-right");
                    flag = false;
                    return false;
                }
            }
        }
    }

    //Add check for IsLocationMandatoryOnImport
    if (userContext.SysSetting.ClientEnvironment == "GA") {
        if (IsLocationOnGetCharges == "0" && $("#chkRushHandling").is(':checked') == false && parseInt(userContext.SysSetting.IsLocationMandatoryOnImport) == 1) {
            ShowMessage('warning', 'Warning - Delivery Order', 'Location is mandatory for Delivery Order.', " ", "bottom-right");
            flag = false;
            return false;
        }
    }
    else {
        if (userContext.SysSetting.ClientEnvironment != 'UK' && userContext.SysSetting.ClientEnvironment != 'G8') {
            if (IsLocationOnGetCharges == "0" && $("#RushHandling").is(':checked') == false && parseInt(userContext.SysSetting.IsLocationMandatoryOnImport) == 1) {
                ShowMessage('warning', 'Warning - delivery order', 'Location is mandatory for delivery order.', " ", "bottom-right");
                flag = false;
                return false;
            }
        }
    }
    if (Number(hawb) > 0 && $("span[id='HAWBConsigneeName']").text() == "") {
        ShowMessage('warning', 'Warning - Delivery Order [' + CurrentAWBNo + ']', "House Consignee Name Not Updated.", "bottom-right");
        flag = false;
        return false
    }

    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/CheckWaybillDetail?AWBNo=" + currentawbsno + "&ArrivedShipmentSNo=" + currentArrivedShipmentSNo + "&ICNNo=" + currentPomailSno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result != "") {
                var resData = jQuery.parseJSON(result);
                var checkData = resData.Table0;
                var doDataDetail = resData.Table1;

                IsHouseAwb = checkData[0].IsHouseAWB == 0 ? false : true;
                IsPart = checkData[0].IsPart == 0 ? false : true;
                IsPartArrived = checkData[0].IsPartArrived == 0 ? false : true;
                IsPartDo = checkData[0].IsPartDo;
                IsHouseDo = checkData[0].IsHouseDo;
                DoHouseCount = checkData[0].DoHouseCount;
                IHouseCount = checkData[0].IHouseCount;

                if (Number(IsHouseDo) > 0 && Number(hawb) == 0) {
                    ShowMessage('warning', 'Warning - Delivery Order [' + CurrentAWBNo + ']', "For Delivery Order, Kindly select the house no for House DO.", "bottom-right");
                    flag = false;
                    return false
                }

                var hawbtext = $("input[id^='Text_HAWB']").val();
                if (Number(IHouseCount) > 0 && Number(DoHouseCount) > 0 && hawbtext == "") {
                    if ($("span[id='DORRemainingPieces']").text() != "0") {
                        ShowMessage('warning', 'Warning - Delivery Order', "Select HAWB.", "bottom-right");
                        $("input[id^='Text_HAWB']").focus();
                        flag = false;
                        return false
                    }
                }
            }
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - DO', "AWB No. [" + CurrentAWBNo + "] -  unable to process.", "bottom-right");
        }
    });

    var RushHandling = false;
    if (userContext.SysSetting.ICMSEnvironment == "GA") {
        RushHandling = $('#chkRushHandling').is(":checked")
    }
    else {
        RushHandling = $('#RushHandling').prop('checked');
    }

    if (paymentType == "CC" && Number(frtAmount) == 0) {
        ShowMessage('warning', 'Warning - Delivery Order [' + CurrentAWBNo + ']', "Collect freight charges not added.", "bottom-right");
        flag = false;
        return false
    }

    if (Mode == "CREDIT") {
        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/CheckCreditLimit", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ BillTo: BillTo, TotalCredit: TotalCredit }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result != "") {
                    ShowMessage('warning', 'Warning - Delivery Order [' + CurrentAWBNo + ']', "Available credit limit is below minimum credit limit", "top-right");

                    $("#Text_BillTo").data("kendoAutoComplete").setDefaultValue("", "");
                    $('input:radio[id="CustomerType"]').filter('[value="0"]').attr('checked', true, 'enabled', true);
                    $("#Text_BillTo").data("kendoAutoComplete").setDefaultValue("", "");
                    $("#BillToText").val('');
                    $("#BillToText").show();
                    if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "GA") {
                        $("#btnGetCharges").closest('table').css('display', 'none')
                        $("#BillToText").removeAttr("data-valid").removeAttr("data-valid-msg");
                    }
                    else {
                        $("#btnGetCharges").closest('table').css('display', 'block')
                    }
                    // Edited by rahul on 09-01-2017   Credit to cash Redirect if credit limit is less in DO 
                    flag = false;
                }
                else
                    return true;
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - DO', "AWB No. [" + CurrentAWBNo + "] -  unable to process.", "bottom-right");
            }
        });
    }

    var partNumber = 0;
    var ShipmentDetailArray = [];
    var totalGrWt = 0;
    var doPieces = 0;
    var totalDOPieces = 0;
    var totalDOGrWt = 0;
    $("div[id$='areaTrans_import_doshipmenttypedetail']").find("[id^='areaTrans_import_doshipmenttypedetail']").each(function (i, row) {
        pieces = Number(pieces) + Number($(this).find("span[id^='BupPcs']").text()) + Number($(this).find("input[id^='_tempBulkPcs']").val());
        grossWt = Number(grossWt) + Number($(this).find("span[id^='BupGrWt']").text()) + Number($(this).find("input[id^='_tempBulkGrWt']").val());
        totalPieces = Number(totalPieces) + Number($(this).find("span[id^='TotalBulkPieces']").text());
        totalGrWt = Number(totalGrWt) + Number($(this).find("span[id^='TotalBulkGrWt']").text());
        totalDOPieces = Number(totalDOPieces) + Number($(this).find("span[id^='TotalPieces']").text());
        totalDOGrWt = Number(totalDOGrWt) + Number($(this).find("span[id^='TotalGrossWeight']").text());
        var ShipmentDetailViewModel = {
            PartNumber: Number(partNumber) + 1,
            AWBSNo: currentawbsno,
            HAWBSNo: $("#Text_HAWB").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_HAWB").data("kendoAutoComplete").key(),
            PartSNo: $("span[id='DORRemainingPieces']").text() != "0" ? $(this).find("span[id^='DailyFlightSNo']").text() : 0,
            Pieces: Number($(this).find("span[id^='BupPcs']").text()) + Number($(this).find("input[id^='_tempBulkPcs']").val()),
            GrossWeight: Number($(this).find("span[id^='BupGrWt']").text()) + Number($(this).find("input[id^='_tempBulkGrWt']").val()),
            VolumeWeight: 0,
            IsBUP: Number($(this).find("span[id^='BupPcs']").text()) > 0 ? 1 : 0,
            SPHCSNo: 0,
            SPHCTransSNo: $("#Text_SPHCType").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_SPHCType").data("kendoAutoComplete").key(),
            ULDSNo: $(this).find("input[id^='Multi_ULDNo']").val() == "" || $("span[id='DORRemainingPieces']").text() == "0" ? "0" : $(this).find("input[id^='Multi_ULDNo']").val()
        };
        ShipmentDetailArray.push(ShipmentDetailViewModel);
    });
    $("#_tempBulkPcs").prop('disabled', true);
    $("#_tempBulkGrWt").prop('disabled', true);

    $("#_tempBulkPcs").prop('disabled', true);
    $("#_tempBulkGrWt").prop('disabled', true);

    if (Number(hawb) > 0 && Number(housePieces) < Number(pieces)) {
        ShowMessage('warning', 'Warning - Delivery Order [' + CurrentAWBNo + ']', "For House Delivery Order, Kindly change the pieces for House DO.", "bottom-right");
        flag = false;
        return false
    }

    if (Number(pieces) != Number(totalPieces) && Number(grossWt) >= Number(totalGrWt)) {
        ShowMessage('warning', 'Warning - Delivery Order [' + CurrentAWBNo + ']', "For Part Delivery Order, Kindly change the pieces and Gross Weight for Part DO.", "bottom-right");
        flag = false;
        return false
    }

    if (Number(pieces) == Number(totalPieces))
        DOType = "FULL";
    else
        DOType = "PART";

    var DeliveryOrderInfo = {
        CustomerType: $("#Text_CustomerType").data("kendoAutoComplete").key(),
        AWBSNo: currentawbsno,
        PaymentType: $("#PaymentType").val() == 0 ? false : true,
        RctNo: $("#RctNo").val(),
        RctDate: cfi.CfiDate("RctDate"),
        HAWBSNo: hawb,
        Remarks: userContext.SysSetting.IsChargeTypeAtDoPayment.toUpperCase() == "TRUE" ? Mode : ($("#DO_Remarks").val() + Mode == 'CASH' ? 'CASH' : ''),
        ParticipantSNo: $("#Text_ParticipantName").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_ParticipantName").data("kendoAutoComplete").key(),
        ArrivedShipmentSNo: currentArrivedShipmentSNo,
        IsPartDo: DOType == "PART" ? true : false,
        BillTo: BillTo,
        Pieces: pieces,
        GrossWt: grossWt.toFixed(3),
        AuthorizedPersoneId: $("#AuthorizedPersonId").val(),
        AuthorizedPersoneName: $("#AuthorizedPersonName").val(),
        AuthorizedPersonCompany: $("#AuthorizedPersonCompany").val(),
        BillToText: BillToText,
        ConsigneeName: $("span[id='ConsigneeName']").text()
    };

    var HandlingChargeArray = [];
    if ($("div[id$='divareaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").length > 0 && $('#divareaTrans_import_dohandlingcharge').css('display') !== 'none') {
        $("div[id$='divareaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function () {
            if ($(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key() != "") {
                var HandlingChargeViewModel = {
                    SNo: $(this).find("td[id^='tdSNoCol']").html(),
                    AWBSNo: (currentPomailSno) == 0 ? currentawbsno : (currentPomailSno),
                    WaveOff: $(this).find("[id^='hdnremark']").val() == undefined || $(this).find("[id^='hdnremark']").val() == "" ? 0 : ($(this).find("[id^='WaveOff']").prop('checked') == true || Number(FOCConsigneeSNo) > 0 ? 1 : 0),
                    TariffCodeSNo: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key(),
                    TariffHeadName: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").value(),
                    pValue: parseFloat($(this).find("[id^='PValue']").val() == "" ? 0 : $(this).find("[id^='PValue']").val()),
                    sValue: parseFloat($(this).find("[id^='SValue']").val() == "" ? 0 : $(this).find("[id^='SValue']").val()),
                    Amount: parseFloat($(this).find("[id^='Amount']").text() == "" ? 0 : $(this).find("[id^='Amount']").text()),
                    TotalTaxAmount: $(this).find("[id^='TotalTaxAmount']").text() == "" ? 0 : $(this).find("[id^='TotalTaxAmount']").text(),
                    TotalAmount: $(this).find("[id^='TotalAmount']").text() == "" ? 0 : $(this).find("[id^='TotalAmount']").text(),
                    Rate: $(this).find("[id^='Rate']").text(),
                    Min: 1,
                    Mode: Mode,
                    ChargeTo: 0,
                    pBasis: $(this).find("[id^='PBasis']").text(),
                    sBasis: $(this).find("[id^='SBasis']").text(),
                    Remarks: $(this).find("[id^='Remarks']").val() + '|' + $(this).find("[id^='PartSNo']").val(),
                    WaveoffRemarks: $(this).find("[id^='hdnremark']").val() == undefined ? "" : $(this).find("[id^='hdnremark']").val(),
                    DescriptionRemarks: $(this).find("span[id^='_DescriptionRemarks_']").text() || "",
                    TaxPercent: $(this).find("span[id^='_TaxPercent_']").text() || 0,
                };
                HandlingChargeArray.push(HandlingChargeViewModel);
            }
        });
    }
    else {
        if (userContext.SysSetting.ICMSEnvironment.toUpperCase() == "JT" && IsDoChargeApplicable == 1) {
            if ($("span[id='DORRemainingPieces']").text() != "0") {
                ShowMessage('warning', 'Warning - Delivery Order', 'Please get charge first.', " ", "bottom-right");
                return false;
            }
        }
        else if (userContext.SysSetting.ICMSEnvironment.toUpperCase() == "G9") {
            if ($("span[id='DORRemainingPieces']").text() != "0") {
                ShowMessage('warning', 'Warning - Delivery Order', 'Please get charge first.', " ", "bottom-right");
                return false;
            }
        }
        else if (userContext.SysSetting.ICMSEnvironment.toUpperCase() == "GA") {
            //    if ($("span[id='DORRemainingPieces']").text() != "0") {
            //        ShowMessage('warning', 'Warning - Delivery Order', 'Please get charge first.', " ", "bottom-right");
            //        return false;
            //}
        }
    }

    if (HandlingChargeArray.length > 0) {
        for (var i = 0; i < HandlingChargeArray.length; i++) {
            if (HandlingChargeArray[i].WaveOff == 1 && HandlingChargeArray[i].WaveoffRemarks == "") {
                // alert("Waive off Remarks are mandatory for waive off charges.");
                ShowMessage('warning', 'Warning - Delivery Order', 'Waive off Remarks are mandatory for waive off charges.', " ", "bottom-right");
                return false;
            }
        }
    }

    if (Number(hawb) > 0 && Number(pieces) > Number(housePieces)) {
        ShowMessage('warning', 'Warning - Delivery Order [' + CurrentAWBNo + ']', "Selected House pieces can not be greater then Total Pieces.", "top-right");
        flag = false;
        $("#_tempBulkPcs").focus();
        $("#BulkPcs").focus();
    }

    var GSTNo = $("#StateCode").val() + $("#GSTNo").val();

    if (flag == true) {
        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/SaveDO", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({
                strData: btoa(JSON.stringify({ AWBSNo: currentawbsno, DeliveryOrderInfo: DeliveryOrderInfo, lstHandlingCharges: HandlingChargeArray, lstShipmentDetailDetail: ShipmentDetailArray, RushHandling: RushHandling })), POMailSNo: parseInt(currentPomailSno), GSTNo: GSTNo, loginAirportSno: userContext.AirportSNo
            }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "2000") {
                    ShowMessage('success', 'Success - Delivery Order', "AWB No. [" + CurrentAWBNo + "] -  Processed Successfully", "bottom-right");
                    $("#btnSave").unbind("click");
                    flag = true;
                }
                else {
                    ShowMessage('warning', 'Warning - Delivery Order [' + CurrentAWBNo + ']', result, "bottom-right");
                    flag = false;
                }
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - DO', "AWB No. [" + CurrentAWBNo + "] -  unable to process.", "bottom-right");
            }
        });
    }
    return flag;
}

function SaveDOPayment() {
    var flag = false;
    var PaymentArray = [];
    if (userContext.SysSetting.ICMSEnvironment.toUpperCase() == "GA") {
        var HandlingChargeArray = [];
        if ($("div[id$='divareaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").length > 0 && $('#divareaTrans_import_dohandlingcharge').css('display') !== 'none') {
            $("div[id$='divareaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function () {
                if ($(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key() != "") {
                    var HandlingChargeViewModel = {
                        SNo: $(this).find("td[id^='tdSNoCol']").html(),
                        AWBSNo: (currentPomailSno) == 0 ? currentawbsno : (currentPomailSno),
                        WaveOff: $(this).find("[id^='hdnremark']").val() == undefined || $(this).find("[id^='hdnremark']").val() == "" ? 0 : ($(this).find("[id^='WaveOff']").prop('checked') == true || Number(FOCConsigneeSNo) > 0 ? 1 : 0),
                        TariffCodeSNo: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key(),
                        TariffHeadName: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").value(),
                        pValue: parseFloat($(this).find("[id^='PValue']").val() == "" ? 0 : $(this).find("[id^='PValue']").val()),
                        sValue: parseFloat($(this).find("[id^='SValue']").val() == "" ? 0 : $(this).find("[id^='SValue']").val()),
                        Amount: parseFloat($(this).find("[id^='Amount']").text() == "" ? 0 : $(this).find("[id^='Amount']").text()),
                        Discount: $(this).find("input[id^='Discount']").val() || 0,
                        DiscountPercent: $(this).find("input[id^='DiscountPercent']").val() || 0,
                        TotalTaxAmount: $(this).find("[id^='TotalTaxAmount']").text() == "" ? 0 : $(this).find("[id^='TotalTaxAmount']").text(),
                        TaxDiscount: $(this).find("input[id^='DisTa']").val() || 0,
                        TaxDiscountPercent: $(this).find("input[id^='DisTaPer']").val() || 0,
                        TotalAmount: $(this).find("[id^='TotalAmount']").text() == "" ? 0 : $(this).find("[id^='TotalAmount']").text(),
                        Rate: $(this).find("[id^='Rate']").text() == "" ? 0 : $(this).find("[id^='Rate']").text(),
                        Min: 1,
                        Mode: $("input[name='CustomerType']:checked").val() == 1 ? 'CREDIT' : 'CASH',
                        ChargeTo: 0,
                        pBasis: $(this).find("[id^='PBasis']").text(),
                        sBasis: $(this).find("[id^='SBasis']").text(),
                        Remarks: $(this).find("[id^='Remarks']").val() + '|' + $(this).find("[id^='PartSNo']").val(),
                        WaveoffRemarks: $(this).find("[id^='hdnremark']").val() == undefined ? "" : $(this).find("[id^='hdnremark']").val(),
                        DescriptionRemarks: $(this).find("span[id^='_DescriptionRemarks_']").text() || "",
                        TaxPercent: $(this).find("span[id^='_TaxPercent_']").text() || 0
                    };
                    HandlingChargeArray.push(HandlingChargeViewModel);
                }
            });

            $.ajax({
                url: "Services/Import/DeliveryOrderService.svc/SaveAtPayment", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ strData: btoa(JSON.stringify({ AWBSNo: currentawbsno, lstHandlingCharges: HandlingChargeArray, BilltoAccount: 0, Shippername: $('#BillToText').val() == "" ? $("#Text_BillTo").data("kendoAutoComplete").key() : $('#BillToText').val(), DONumber: ChargesDosno, HAWBSNo: 0 })) }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result == "") {
                        ShowMessage('success', 'Success - Delivery Order', "AWB No. [" + CurrentAWBNo + "] -  Processed Successfully", "bottom-right");
                        $("#btnSave").unbind("click");
                        //$("#divDetail4").hide();
                        //$("#divDetail5").hide();

                        //$.ajax({
                        //    url: "Services/Import/DeliveryOrderService.svc/GetPaymentDetail", async: false, type: "POST", dataType: "json", cache: false,
                        //    data: JSON.stringify({ strData: btoa(JSON.stringify({ AWBSNo: currentawbsno, DONumber: ChargesDosno, PomailSno: currentPomailSno })) }),
                        //    contentType: "application/json; charset=utf-8",
                        //    success: function (result) {
                        //        if (result == "CHARGESDONE") {
                        //            $("#btnPrints_" + CheckChargesid).attr("disabled", "disabled");
                        //            $("#RushHandling_" + CheckChargesid).attr("disabled", "disabled");
                        //        }
                        //        else if (result == "NOTCHARGESDONE") {
                        //        }
                        //    }
                        //});
                        flag = true;
                    }
                    else {
                        ShowMessage('warning', 'Warning - Delivery Order [' + CurrentAWBNo + ']', result, "bottom-right");
                        flag = false;
                    }
                }
            });
        }
    }
    else {
        $("div[id$='divareaTrans_import_payment']").find("[id^='areaTrans_import_payment']").each(function () {
            var PaymentViewModel = {
                SNo: $(this).find("td[id^='tdSNoCol']").html(),
                AWBSNo: currentawbsno,
                Process: $(this).find("[id^='Text_Process']").data("kendoAutoComplete").key(),
                DocumentType: $(this).find("[id^='DocumentType']").prop('checked'),
                DocumentNo: $(this).find("[id^='Text_DocumentNo']").data("kendoAutoComplete").key(),
                CurrencySNo: $(this).find("[id^='Text_Currency']").data("kendoAutoComplete").key(),
                Amount: $(this).find("[id^='Amount']").val(),
                Remarks: $(this).find("[id^='Remarks']").val()
            };
            PaymentArray.push(PaymentViewModel);
        });

        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/SaveDOPayment", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ lstDOPayment: PaymentArray }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "2000") {
                    ShowMessage('success', 'Success - DOPayment', "AWB No. [" + currentawbsno + "] -  Processed Successfully", "bottom-right");
                    $("#btnSave").unbind("click");
                    flag = true;
                }
                else
                    ShowMessage('warning', 'Warning - Reservation [' + currentawbsno + ']', "Please correct value(s) for :- " + result + ".", "bottom-right");
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - DOPayment', "AWB No. [" + currentawbsno + "] -  unable to process.", "bottom-right");
            }
        });
    }
    return flag;
}

function SaveDLVInfo() {
    var flag = true;

    if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "GA") {
        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/CheckPaymentCharges",
            data: JSON.stringify({ DOSNo: parseInt($("#Text_DONo").data("kendoAutoComplete").key()), PDSNo: 0 }),
            async: true, type: "POST", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var resData = jQuery.parseJSON(result);
                var payment = resData.Table0;
                if (payment[0].IsPayment == "0") {
                    ShowMessage('warning', 'Warning - Delivery Order', 'Charges pending, Please raise P button Storage Charges.', " ", "bottom-right");
                    return false;
                }
            }
        });
    }
    var DeliverdToWalkin = $('#DeliverdToWalkin').length > 0 ? $('#DeliverdToWalkin').val().split('-') : "";
    var PhysicalDeliveryInfo
        = {
        DOSNo: $("#Text_DONo").data("kendoAutoComplete").key(),
        IsConsolidatorDOReceived: $('input:checkbox[id*="ConsolidatorDOReceived"]')[0].checked == true ? 1 : 0,
        DeliveredToSNo: $("#Text_DeliverdTo").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_DeliverdTo").data("kendoAutoComplete").key(),
        Date: cfi.CfiDate("Date"),
        PDSRemarks: $("#PDSRemarks").val(),
        CustomerRelease: $("input[name='CustomRelease']:checked").val(),
        CustomerType: $("#Text_CustomerType").data("kendoAutoComplete").key(),
        AuthorizedPersoneId: $('#DeliverdToWalkin').length > 0 ? DeliverdToWalkin[0] : '',
        AuthorizedPersoneName: $('#DeliverdToWalkin').length > 0 ? DeliverdToWalkin[1] : '',
        AuthorizedPersonCompany: $('#DeliverdToWalkin').length > 0 ? DeliverdToWalkin[2] : '',
        PDPieces: Number($("span[id^='BupPcs']").text()) + Number($("input[id^='_tempBulkPcs']").val()),
        PDGrossWeight: Number($("span[id^='BupGrWt']").text()) + Number($("input[id^='_tempBulkGrWt']").val()),
        ULDSNo: $("input[id^='Multi_PDULDNo']").val() == "" ? "0" : $("input[id^='Multi_PDULDNo']").val(),
        POMailSNo: currentPomailSno
    };

    var dlvPieces = 0;
    var dlvGrWt = 0;
    var dlvTotalPieces = 0;
    var dlvTotalGrWt = 0;

    dlvPieces = Number($("input[id^='_tempBulkPcs']").val());
    dlvGrWt = Number($("input[id^='_tempBulkGrWt']").val());
    dlvTotalPieces = Number($("span[id^='TotalBulkPieces']").text());
    dlvTotalGrWt = Number($("span[id^='TotalBulkGrWt']").text());

    if (Number(dlvPieces) != Number(dlvTotalPieces) && Number(dlvGrWt) >= Number(dlvTotalGrWt)) {
        ShowMessage('warning', 'Warning - Physical Delivery [' + CurrentAWBNo + ']', "For Part Physical Delivery, Kindly change the pieces and Gross Weight for Part Physical Delivery.", "bottom-right");
        flag = false;
        return false
    }

    if (flag == true) {
        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/SaveDLVInfo", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ PhysicalDeliveryInfo: PhysicalDeliveryInfo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "2000") {
                    ShowMessage('success', 'Success - DLV ', "DO No. [" + $("#Text_DONo").data("kendoAutoComplete").value() + "] -  Delivered Successfully ", "bottom-right");
                    $("#btnSave").unbind("click");
                    flag = true;
                }
                else
                    ShowMessage('warning', 'Warning - DLV [' + $("#Text_DONo").data("kendoAutoComplete").value() + ']', "Please correct value(s) for :- " + result + ".", "bottom-right");
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - DO', "AWB No. [" + CurrentAWBNo + "] -  unable to process.", "bottom-right");
            }
        });
    }
    return flag;
}

function sendSMS(message) {
    $.ajax({
        url: "http://203.212.70.200/smpp/sendsms?username=democargohttp&password=cargo123&to=971501160101&from=VFirst&udh=&text=test&dlr-mask=19&dlr-url", async: false, type: "POST", cache: false,
        contentType: "text/plain; charset=utf-8",
        success: function (result) {
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - SMS', "unable to process SMS.", "bottom-right");
        }
    });
}

function CheckCustomType() {
    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/CheckWaybillDetail?AWBNo=" + currentawbsno + "&ArrivedShipmentSNo=" + currentArrivedShipmentSNo + "&ICNNo=" + currentPomailSno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result != "") {
                var resData = jQuery.parseJSON(result);
                var checkData = resData.Table0;
                var doDataDetail = resData.Table1;
                var CustomDetails = resData.Table2;
                IsDoChargeApplicable = resData.Table3[0].IsDoChargeApplicable;

                $("#btnNew").hide();
                var IsCustomClearData = CustomDetails[0].IsCustomClear;
                var isShipmentOnHold = checkData[0].isShipmentOnHold;
                if (IsCustomClearData == 0) {
                    ShowMessage('warning', 'Warning - Delivery Order', 'Custom Information is mandatory to proceed with DLV.', " ", "bottom-right");
                    $("#divDetail").hide();
                    flag = false;
                    return false
                }
            }
        }
    })
}

function CheckDOType() {
    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/CheckWaybillDetail?AWBNo=" + currentawbsno + "&ArrivedShipmentSNo=" + currentArrivedShipmentSNo + "&ICNNo=" + currentPomailSno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result != "") {
                var resData = jQuery.parseJSON(result);
                var checkData = resData.Table0;
                var doDataDetail = resData.Table1;
                var CustomDetails = resData.Table2;
                IsDoChargeApplicable = resData.Table3[0].IsDoChargeApplicable;

                $("#btnNew").hide();
                var IsCustomClearData = CustomDetails[0].IsCustomClear;
                var isShipmentOnHold = checkData[0].isShipmentOnHold;

                if (isShipmentOnHold == 1) {
                    ShowMessage('warning', 'Warning - Delivery Order', "Shipment can't be process for delivery order due to HOLD.", "bottom-right");
                    $("#divDetail").hide();
                    flag = false;
                    return false
                }

                if (checkData.length == 0) {
                    if (CurrentAWBNo.search("UNK") >= 0)
                        ShowMessage('warning', 'Warning - Delivery Order [' + CurrentAWBNo + ']', "UNK shipment can't be process for delivery order.", "bottom-right");
                    else
                        ShowMessage('warning', 'Warning - Delivery Order [' + CurrentAWBNo + ']', "shipment can't be process for delivery order.", "bottom-right");

                    $("#divDetail").hide();
                    flag = false;
                    return false
                }

                IsHouseAwb = checkData[0].IsHouseAWB == 0 ? false : true;
                IsPart = checkData[0].IsPart == 0 ? false : true;
                IsPartArrived = checkData[0].IsPartArrived == 0 ? false : true;
                IsPartDo = checkData[0].IsPartDo;
                IsHouseDo = checkData[0].IsHouseDo;
                var IsLocation = checkData[0].IsLocation;
                var IsHouseDetail = checkData[0].IsHAWBDetail;
                var IsFWBDone = checkData[0].IsFWBDone;
                var IsArrived = checkData[0].IsArrived;
                var IsDOProcess = checkData[0].IsDOProcess;
                var IsDoPieceCountStatus = checkData[0].DOPieceCount;
                var IsDelivered = checkData[0].IsDelivered;
                var IsDOCancelled = checkData[0].IsCancel
                IsLocationOnGetCharges = checkData[0].IsLocationOnGetCharges;

                //Added By rahul for Location Check on Get Charges
                $("#divDetail").show();
                if (IsArrived == 0 && IsLocation == 0) {
                    ShowMessage('warning', 'Warning - Delivery Order', 'Location is mandatory for Delivery Order.', " ", "bottom-right");
                    $("#divDetail").hide();
                    if (checkData[0].IsCreateDO == 1) {
                        if (doDataDetail.length > 0) {
                            var strVar = "";
                            strVar += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr style=\"background-color: #C0C0C0\"><tbody class=\"ui-widget-content\"><td class=\"ui-state-active caption formSection\" align=\"left\" colspan=\"12\">Delivery Order Details<\/td><\/tr>";
                            strVar += "<tr style=\"font-weight: bold\">";
                            strVar += (userContext.SysSetting.ICMSEnvironment.toUpperCase() == "JT" ? "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Delivered<\/td>" : "") + "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Customer Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO Date<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Air Waybill Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">HAWB No / Pieces<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO Pieces<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Gross Weight<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Total Charges<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Charges Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Participant Name<\/td><td style=\"padding-left: 5px; width: 250px\" class=\"ui-widget-header\">Action<\/td><\/tr>";

                            for (var i = 0; i < doDataDetail.length; i++) {
                                strVar += (userContext.SysSetting.ICMSEnvironment.toUpperCase() == "JT" ? "<td class=\"ui-widget-content\"><input dfsno=" + doDataDetail[i].DOSNo + " id=\"chkOFW_" + i + "\" type=\"checkbox\" value=\"" + doDataDetail[i].IsDelivered + "\"  " + (doDataDetail[i].IsDelivered == '1' ? 'disabled' : '') + "  onclick=\"Disable(this)\"\"><\/td>" : "") + "<td class=\"ui-widget-content\">" + doDataDetail[i].CustomerType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DeliveryOrderNo + "<input id=\"hnDOSno\" type=\"hidden\" value=" + doDataDetail[i].DOSNo + " \"><\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DeliveryOrderDate + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].WaybillType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].HouseNo + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DOPieces + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DOGrossWeight + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].TotalCharges + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].ChargesType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].ParticipantName + "<\/td><td class=\"ui-widget-content\">";
                                if (doDataDetail[i].IsCancel == 0) {
                                    strVar += "<input id=\"btnPrint\" type=\"button\" value=\"DO Print\" onclick=\"PrintSlip('DO'," + doDataDetail[i].DOSNo + ");\">";
                                    strVar += "&nbsp;<input id=\"btnPrint\" style=\"Display:none;\" type=\"button\" value=\"Pre-Printed DO\" onclick=\"PrintSlip('DOPrint'," + doDataDetail[i].DOSNo + ");\">";
                                    if (userContext.SysSetting.ClientEnvironment.toUpperCase() != "TH")
                                        strVar += "&nbsp;<input id=\"btnLocation\" type=\"button\" value=\"DO Location\" onclick=\"OpenPopUp('Warehouse Location'," + doDataDetail[i].DOSNo + ");\">";
                                }
                                else {
                                    strVar += "<input id=\"btnPrint\" type=\"button\" style=\"background-color:red;color:white;\" value=\"DO Print\" onclick=\"PrintSlip('DO'," + doDataDetail[i].DOSNo + ");\">";
                                    strVar += "&nbsp;<input id=\"btnPrint\" type=\"button\" style=\"background-color:red;color:white;Display:none;\" value=\"Pre-Printed DO\" onclick=\"PrintSlip('DOPrint'," + doDataDetail[i].DOSNo + ");\">";
                                    if (userContext.SysSetting.ClientEnvironment.toUpperCase() != "TH")
                                        strVar += "&nbsp;<input id=\"btnLocation\" type=\"button\" value=\"DO Location\" onclick=\"OpenPopUp('Warehouse Location'," + doDataDetail[i].DOSNo + ");\">";
                                }
                                strVar += "<\/td><\/tr>";
                                strVar += "<\/td><\/tr>"
                            }
                            strVar += "<\/tbody><\/table>";
                            strVar += "<\/br>";
                            $('#divDetail3').html(strVar);
                        }
                        $("#divDetail").hide();
                    }
                }
                // Added by Rahul on 11-09-2017 to Validate DO Tab 
                else if (IsDoPieceCountStatus == 0) {
                    ShowMessage('warning', 'Warning - Delivery Order', "Please arrive complete shipment to proceed with DO", "bottom-right");
                    $("#divDetail").hide();
                    flag = false;
                    return false
                }
                else if (IsLocation == 0 && IsArrived == 1) {
                    ShowMessage('warning', 'Warning - Delivery Order', 'Location is mandatory for Delivery Order.', " ", "bottom-right");
                    $("#divDetail").hide();
                    if (checkData[0].IsCreateDO == 1) {
                        if (doDataDetail.length > 0) {
                            var strVar = "";
                            strVar += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr style=\"background-color: #C0C0C0\"><tbody class=\"ui-widget-content\"><td class=\"ui-state-active caption formSection\" align=\"left\" colspan=\"12\">Delivery Order Details<\/td><\/tr>";
                            strVar += "<tr style=\"font-weight: bold\">";
                            strVar += (userContext.SysSetting.ICMSEnvironment.toUpperCase() == "JT" ? "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Delivered<\/td>" : "") + "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Customer Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO Date<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Air Waybill Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">HAWB No / Pieces<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO Pieces<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Gross Weight<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Total Charges<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Charges Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Participant Name<\/td><td style=\"padding-left: 5px; width: 250px\" class=\"ui-widget-header\">Action<\/td><\/tr>";

                            for (var i = 0; i < doDataDetail.length; i++) {
                                strVar += (userContext.SysSetting.ICMSEnvironment.toUpperCase() == "JT" ? "<td class=\"ui-widget-content\"><input dfsno=" + doDataDetail[i].DOSNo + " id=\"chkOFW_" + i + "\" type=\"checkbox\" value=\"" + doDataDetail[i].IsDelivered + "\" " + (doDataDetail[i].IsDelivered == '1' ? 'disabled checked' : '') + " onclick=\"Disable(this)\"\"><\/td>" : "") + "<td class=\"ui-widget-content\">" + doDataDetail[i].CustomerType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DeliveryOrderNo + "<input id=\"hnDOSno\" type=\"hidden\" value=" + doDataDetail[i].DOSNo + " \"><\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DeliveryOrderDate + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].WaybillType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].HouseNo + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DOPieces + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DOGrossWeight + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].TotalCharges + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].ChargesType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].ParticipantName + "<\/td><td class=\"ui-widget-content\">";
                                if (doDataDetail[i].IsCancel == 0) {
                                    strVar += "<input id=\"btnPrint\" type=\"button\" value=\"DO Print\" onclick=\"PrintSlip('DO'," + doDataDetail[i].DOSNo + ");\">";
                                    strVar += "&nbsp;<input id=\"btnPrint\" type=\"button\" style=\"Display:none;\" value=\"Pre-Printed DO\" onclick=\"PrintSlip('DOPrint'," + doDataDetail[i].DOSNo + ");\">";
                                    if (userContext.SysSetting.ClientEnvironment.toUpperCase() != "TH")
                                        strVar += "&nbsp;<input id=\"btnLocation\" type=\"button\" value=\"DO Location\" onclick=\"OpenPopUp('Warehouse Location'," + doDataDetail[i].DOSNo + ");\">";
                                }
                                else {
                                    strVar += "<input id=\"btnPrint\" type=\"button\" style=\"background-color:red;color:white;\" value=\"DO Print\" onclick=\"PrintSlip('DO'," + doDataDetail[i].DOSNo + ");\">";
                                    strVar += "&nbsp;<input id=\"btnPrint\" type=\"button\" style=\"background-color:red;color:white;Display:none;\" value=\"Pre-Printed DO\" onclick=\"PrintSlip('DOPrint'," + doDataDetail[i].DOSNo + ");\">";
                                    if (userContext.SysSetting.ClientEnvironment.toUpperCase() != "TH")
                                        strVar += "&nbsp;<input id=\"btnLocation\" type=\"button\" value=\"DO Location\" onclick=\"OpenPopUp('Warehouse Location'," + doDataDetail[i].DOSNo + ");\">";
                                }
                                strVar += "<\/td><\/tr>";
                                strVar += "<\/td><\/tr>"
                            }
                            strVar += "<\/tbody><\/table>";
                            strVar += "<\/br>";
                            $('#divDetail3').html(strVar);
                        }
                        $("#divDetail").hide();
                    }
                }
                else if (IsArrived == 0) {
                    $("#divDetail").hide();
                    if (checkData[0].IsCreateDO == 1) {
                        if (doDataDetail.length > 0) {
                            var strVar = "";
                            strVar += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr style=\"background-color: #C0C0C0\"><tbody class=\"ui-widget-content\"><td class=\"ui-state-active caption formSection\" align=\"left\" colspan=\"12\">Delivery Order Details<\/td><\/tr>";
                            strVar += "<tr style=\"font-weight: bold\">";
                            strVar += (userContext.SysSetting.ICMSEnvironment.toUpperCase() == "JT" ? "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Delivered<\/td>" : "") + "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Customer Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO Date<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Air Waybill Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">HAWB No / Pieces<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO Pieces<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Gross Weight<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Total Charges<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Charges Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Participant Name<\/td><td style=\"padding-left: 5px; width: 250px\" class=\"ui-widget-header\">Action<\/td><\/tr>";

                            for (var i = 0; i < doDataDetail.length; i++) {
                                strVar += (userContext.SysSetting.ICMSEnvironment.toUpperCase() == "JT" ? "<td class=\"ui-widget-content\"><input dfsno=" + doDataDetail[i].DOSNo + " id=\"chkOFW_" + i + "\" type=\"checkbox\" value=\"" + doDataDetail[i].IsDelivered + "\"" + (doDataDetail[i].IsDelivered == '1' ? 'disabled checked' : '') + " onclick=\"Disable(this)\"\"><\/td>" : "") + "<td class=\"ui-widget-content\">" + doDataDetail[i].CustomerType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DeliveryOrderNo + "<input id=\"hnDOSno\" type=\"hidden\" value=" + doDataDetail[i].DOSNo + " \"><\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DeliveryOrderDate + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].WaybillType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].HouseNo + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DOPieces + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DOGrossWeight + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].TotalCharges + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].ChargesType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].ParticipantName + "<\/td><td class=\"ui-widget-content\">";
                                if (doDataDetail[i].IsCancel == 0) {
                                    strVar += "<input id=\"btnPrint\" type=\"button\" value=\"DO Print\" onclick=\"PrintSlip('DO'," + doDataDetail[i].DOSNo + ");\">";
                                    strVar += "&nbsp;<input id=\"btnPrint\" type=\"button\" style=\"Display:none;\" value=\"Pre-Printed DO\" onclick=\"PrintSlip('DOPrint'," + doDataDetail[i].DOSNo + ");\">";
                                    if (userContext.SysSetting.ClientEnvironment.toUpperCase() != "TH")
                                        strVar += "&nbsp;<input id=\"btnLocation\" type=\"button\" value=\"DO Location\" onclick=\"OpenPopUp('Warehouse Location'," + doDataDetail[i].DOSNo + ");\">";
                                }
                                else {
                                    strVar += "<input id=\"btnPrint\" type=\"button\" style=\"background-color:red;color:white;\" value=\"DO Print\" onclick=\"PrintSlip('DO'," + doDataDetail[i].DOSNo + ");\">";
                                    strVar += "&nbsp;<input id=\"btnPrint\" type=\"button\" style=\"background-color:red;color:white;Display:none;\" value=\"Pre-Printed DO\" onclick=\"PrintSlip('DOPrint'," + doDataDetail[i].DOSNo + ");\">";
                                    if (userContext.SysSetting.ClientEnvironment.toUpperCase() != "TH")
                                        strVar += "&nbsp;<input id=\"btnLocation\" type=\"button\" value=\"DO Location\" onclick=\"OpenPopUp('Warehouse Location'," + doDataDetail[i].DOSNo + ");\">";
                                }
                                strVar += "<\/td><\/tr>";
                                strVar += "<\/td><\/tr>"
                            }
                            strVar += "<\/tbody><\/table>";
                            strVar += "<\/br>";
                            $('#divDetail3').html(strVar);
                        }
                        $("#divDetail").hide();
                    }
                }
                else if (IsHouseDetail == 0) {
                    //Changed by rahul on 07/11/2017 in case fwb ammended discussed by neha 
                    ShowMessage('warning', 'Warning - Delivery Order', 'FHL details mandatory for DO.', " ", "bottom-right");
                    $("#divDetail").hide();

                }
                else if (IsFWBDone == 0) {
                    ShowMessage('warning', 'Warning - Delivery Order', (userContext.SysSetting.ClientEnvironment.toUpperCase() == "TH" ? 'AWB' : 'FWB') + ' Details are required to proceed with Delivery Order.', " ", "bottom-right");
                    $("#divDetail").hide();

                }
                else if (IsDOProcess == "0") {
                    ShowMessage('warning', 'Warning - Delivery Order', ' Please close the Flight to proceed with Delivery Order.', " ", "bottom-right");
                    $("#divDetail").hide();

                }
                else {
                    $("#Text_HAWB").removeAttr("data-valid").removeAttr("data-valid-msg");
                    if (checkData[0].DOCreated == 1) {
                        if (doDataDetail.length > 0) {
                            var strVar = "";
                            strVar += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr style=\"background-color: #C0C0C0\"><tbody class=\"ui-widget-content\"><td class=\"ui-state-active caption formSection\" align=\"left\" colspan=\"12\">Delivery Order Details<\/td><\/tr>";
                            strVar += "<tr style=\"font-weight: bold\">";
                            strVar += (userContext.SysSetting.ICMSEnvironment.toUpperCase() == "JT" ? "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Delivered<\/td>" : "") + "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Customer Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO Date<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Air Waybill Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">HAWB No / Pieces<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO Pieces<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Gross Weight<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Total Charges<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Charges Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Participant Name<\/td><td style=\"padding-left: 5px; width: 250px\" class=\"ui-widget-header\">Action<\/td><\/tr>";

                            for (var i = 0; i < doDataDetail.length; i++) {
                                strVar += (userContext.SysSetting.ICMSEnvironment.toUpperCase() == "JT" ? "<td class=\"ui-widget-content\"><input dfsno=" + doDataDetail[i].DOSNo + " id=\"chkOFW_" + i + "\" type=\"checkbox\" value=\"" + doDataDetail[i].IsDelivered + "\" " + (doDataDetail[i].IsDelivered == '1' ? 'disabled  checked ' : '') + " onclick=\"Disable(this)\"\"><\/td>" : "") + "<td class=\"ui-widget-content\">" + doDataDetail[i].CustomerType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DeliveryOrderNo + "<input id=\"hnDOSno\" type=\"hidden\" value=" + doDataDetail[i].DOSNo + " \"><\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DeliveryOrderDate + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].WaybillType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].HouseNo + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DOPieces + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DOGrossWeight + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].TotalCharges + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].ChargesType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].ParticipantName + "<\/td><td class=\"ui-widget-content\">";
                                if (doDataDetail[i].IsCancel == 0) {
                                    strVar += "<input id=\"btnPrint\" type=\"button\" value=\"DO Print\" onclick=\"PrintSlip('DO'," + doDataDetail[i].DOSNo + ");\">";
                                    strVar += "&nbsp;<input id=\"btnPrint\" type=\"button\" style=\"Display:none;\" value=\"Pre-Printed DO\" onclick=\"PrintSlip('DOPrint'," + doDataDetail[i].DOSNo + ");\">";
                                    if (userContext.SysSetting.ClientEnvironment.toUpperCase() != "TH")
                                        strVar += "&nbsp;<input id=\"btnLocation\" type=\"button\" value=\"DO Location\" onclick=\"OpenPopUp('Warehouse Location'," + doDataDetail[i].DOSNo + ");\">";
                                }
                                else {
                                    strVar += "<input id=\"btnPrint\" type=\"button\" style=\"background-color:red;color:white;\" value=\"DO Print\" onclick=\"PrintSlip('DO'," + doDataDetail[i].DOSNo + ");\">";
                                    strVar += "&nbsp;<input id=\"btnPrint\" type=\"button\" style=\"background-color:red;color:white;Display:none;\" value=\"Pre-Printed DO\" onclick=\"PrintSlip('DOPrint'," + doDataDetail[i].DOSNo + ");\">";
                                    if (userContext.SysSetting.ClientEnvironment.toUpperCase() != "TH")
                                        strVar += "&nbsp;<input id=\"btnLocation\" type=\"button\" value=\"DO Location\" onclick=\"OpenPopUp('Warehouse Location'," + doDataDetail[i].DOSNo + ");\">";
                                }
                                strVar += "<\/td><\/tr>";
                                strVar += "<\/td><\/tr>"
                            }
                            strVar += "<\/tbody><\/table>";
                            strVar += "<\/br>";
                            $('#divDetail3').html(strVar);
                        }
                        $("#divDetail").hide();
                        $("#btnNew").hide();
                    }
                    else {
                        BindDeliveryOrder("MAWB", shipmentType, "PART");
                    }

                    $("#btnNew").hide();
                }

                if (checkData[0].DOCreated == 1) {
                    $('#btnSave').hide();
                }
                else {
                    $('#btnSave').show();
                }
            }
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - DO', "AWB No. [" + CurrentAWBNo + "] -  unable to process.", "bottom-right");
        }
    });

    //Added start by rahul  04 May 2018
    //---------------------------------------disable checkbox for cancel Do-------------
    $('[type="button"][id^="btnPrint"][value="DO Print"]').each(function () {
        if ($(this).css('background-color') == "rgb(255, 0, 0)")
            $(this).closest('tr').find('[type="checkbox"]').prop('disabled', true)
    })
    //-----------------------end-------------------------------------------------

    $("[type='checkbox'][id^='chkOFW_']").click(function () {
        var chkID = $(this).attr('id');
        var DOsnoval = $(this).attr('dfsno');
        var msg = 'Are you sure, you want to mark shipment as delivered ?';
        var div = $("<div id='popIsdelivered'>" + msg + "</div>");
        $("#popIsdelivered").remove();
        div.dialog({
            title: "Warning",
            buttons: [
                {
                    text: "Yes",
                    click: function () {
                        //add ur stuffs here
                        div.dialog("close");
                        var isDelivered = 1;
                        var flag = GetDelivered(isDelivered, DOsnoval);
                        if (flag == true) {
                            $("#" + chkID).prop("disabled", true);
                        }
                        else {
                            $("#" + chkID).prop('checked', false);
                        }
                    }
                },
                {
                    text: "No",
                    click: function () {
                        div.dialog("close");
                        $("#" + chkID).prop('checked', false);
                    }
                }
            ]
        });
    });
    //End start by rahul  
}

function GetDelivered(isDelivered, DOsnoval) {
    var flag = false;
    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/GetDelivered", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: parseInt(currentawbsno), isDelivered: isDelivered, DOsnoval: DOsnoval }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.Table0;
            if (resData && resData.length > 0) {
                if (resData[0].Column1 == "6001") {
                    ShowMessage('warning', 'Warning - DO', "AWB No. [" + CurrentAWBNo + "] -  Payment Pending Can't Proceed with Delivery.", "bottom-right");
                }
                else if (resData[0].Column1 == "6002") {
                    ShowMessage('success', 'Success - Delivery Order', "Successfully Delivered", "bottom-right");
                    flag = true;
                }
                else {
                    ShowMessage('warning', 'Warning - DO', "AWB No. [" + CurrentAWBNo + "] -  unable to process.", "bottom-right");
                }
            }
        },

    });
    return flag;
}

function OpenPopUp(msg, type, IsHouse, IsPart, ActionType, IsPartArrived, IsPartDo, IsHouseDo, chkComplete) {
    if (ActionType == "DOCancel") {
        $("#divDetail2").html(msg);
        $("#divDetail2").dialog({
            resizable: false,
            modal: true,
            title: "Delivery Order Cancel",
            height: 250,
            width: 400,
            buttons: {
                "Yes": function () {
                    CancelDO(type);
                    $(this).dialog('close');
                },
                "No": function () {
                    $("#divDetail").hide();
                    $(this).dialog('close');
                }
            }
        });
    }
    else if (ActionType == "ER") {
        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/GetExchangeRate?OrigCurr=" + parseInt(msg) + "&DestCurr=" + parseInt(type) + "&AWBSNo=" + parseInt(currentawbsno), async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var resData = jQuery.parseJSON(result);
                var erData = resData.Table0;
                var strVar = "";
                if (erData.length > 0) {
                    strVar += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody>";
                    strVar += "<tr style=\"font-weight: bold\">";
                    strVar += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">SNo<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Origin Currency<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Destination Currency<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Exchange Rate<\/td><\/tr>";
                    for (var i = 0; i < erData.length; i++) {
                        strVar += "<td class=\"ui-widget-content\">" + erData[i].SNo + "<\/td><td class=\"ui-widget-content\">" + erData[i].FromCurrencyCode + "<\/td><td class=\"ui-widget-content\">" + erData[i].ToCurrencyCode + "<\/td><td class=\"ui-widget-content\">" + erData[i].Rate + "<\/td><\/tr>"
                    }
                    strVar += "<\/tbody><\/table>";
                    strVar += "<\/br>";
                }
                else {
                    strVar += "No Record Found";
                }

                $('#divDetail2').html(strVar);
                $("#divDetail2").dialog({
                    resizable: false,
                    modal: true,
                    title: "Exchange Rate",
                    height: 250,
                    width: 400,
                    buttons: {
                        "OK": function () {
                            $(this).dialog('close');
                        }
                    }
                });
            }
        });
    }
    else if (msg.defaultValue == "FOC Consignee") {
        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/GetFOCConsignee?AWBSNo=" + parseInt(currentawbsno), async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var resData = jQuery.parseJSON(result);
                var focData = resData.Table0;
                var strVar = "";
                strVar += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody>";
                strVar += "<tr style=\"font-weight: bold\">";
                strVar += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">SNo<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">FOC Check<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">FOC Consignee<\/td><\/tr>";
                if (focData.length > 0) {
                    for (var i = 0; i < focData.length; i++) {
                        strVar += "<td class=\"ui-widget-content\">" + focData[i].SNo + "<\/td><td class=\"ui-widget-content\"><input id=\"chkFOC_" + i + "\" onclick='CheckUnCheck(this);' type=\"checkbox\"\"><\/td><td class=\"ui-widget-content\">" + focData[i].FOCConsignee + "<input id=\"hdnFOC_" + i + "\" type=\"hidden\" value=" + focData[i].FOCConsigneeSNo + " \"><\/td><\/tr>"
                    }
                }
                else {
                    strVar += "<td class=\"ui-widget-content\" colspan=\"3\">No Record Found<\/td><\/tr>"
                }
                strVar += "<\/tbody><\/table>";
                strVar += "<\/br>";

                $('#divDetail2').html(strVar);
                $('#divDetail2').find("tr").each(function () {
                    if ($(this).find("input[id^='chkFOC_']").length > 0) {
                        var hdnId = $(this).find("input[id^='hdnFOC_']").val();
                        if (focCheckValue == hdnId)
                            $(this).find("input[id^='chkFOC_']").attr('checked', true);
                    }
                });

                $("#divDetail2").dialog({
                    resizable: false,
                    modal: true,
                    title: "FOC Consignee Details",
                    width: 600,
                    buttons: {
                        "OK": function () {
                            var chkFlag = false;
                            $('#divDetail2').find("tr:gt(0)").each(function () {
                                chkFlag = $("#" + $(this).find("input[id^='chkFOC']").attr("id")).is(":checked");
                                if (chkFlag == true) {
                                    FOCConsigneeSNo = $("#" + $(this).find("input[id^='hdnFOC']").attr("id")).val();
                                    return;
                                }
                                else {
                                    FOCConsigneeSNo = 0;
                                    return;
                                }
                            });

                            NillFOCCHarges(FOCConsigneeSNo);
                            $(this).dialog('close');
                        },
                        "CANCEL": function () {
                            FOCConsigneeSNo = 0;
                            return;
                            NillFOCCHarges(FOCConsigneeSNo);
                            $(this).dialog('close');
                        }
                    }
                });
            }
        });
    }
    else if (msg.defaultValue == "Storage Details") {
        if ($("div[id$='divareaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").length > 1) {
            var pieces = 0;
            var grossWt = 0;
            var partNumber = 0;
            totalHandlingCharges = 0;
            var hawb = $("#Text_HAWB").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_HAWB").data("kendoAutoComplete").key();
            var SPHCTransSNo = $("#Text_SPHCType").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_SPHCType").data("kendoAutoComplete").key();
            var ShipmentDetailArray = [];
            $("div[id$='areaTrans_import_doshipmenttypedetail']").find("[id^='areaTrans_import_doshipmenttypedetail']").each(function (i, row) {
                pieces = Number(pieces) + Number($(this).find("span[id^='BupPcs']").text()) + Number($(this).find("input[id^='_tempBulkPcs']").val());
                grossWt = Number(grossWt) + Number($(this).find("span[id^='BupGrWt']").text()) + Number($(this).find("input[id^='_tempBulkGrWt']").val());

                var ShipmentDetailViewModel = {
                    PartNumber: Number(partNumber) + 1,
                    AWBSNo: currentawbsno,
                    HAWBSNo: hawb,
                    PartSNo: $(this).find("span[id^='DailyFlightSNo']").text(),
                    Pieces: Number($(this).find("span[id^='BupPcs']").text()) + Number($(this).find("input[id^='_tempBulkPcs']").val()),
                    GrossWeight: Number($(this).find("span[id^='BupGrWt']").text()) + Number($(this).find("input[id^='_tempBulkGrWt']").val()),
                    VolumeWeight: 0,
                    IsBUP: Number($(this).find("span[id^='BupPcs']").text()) > 0 ? 1 : 0,
                    SPHCSNo: 0,
                    SPHCTransSNo: SPHCTransSNo
                };
                ShipmentDetailArray.push(ShipmentDetailViewModel);
            });

            $.ajax({
                url: "Services/Import/DeliveryOrderService.svc/GetStorageCharge", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ AWBSNo: parseInt(currentawbsno) }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var resData = jQuery.parseJSON(result);
                    var hcData = resData.Table0;

                    var FocHoursDetail = [];
                    var DailyFlightDetail = [];
                    if (hcData != []) {
                        $(hcData).each(function (row, i) {
                            FocHoursDetail.push({ "FocHours": i.FOCTime });
                            DailyFlightDetail.push({ "Flight": i.FlightNo });
                        });
                    }

                    var strVar = "";
                    var count = 0;
                    if (FocHoursDetail.length > 0) {
                        for (var i = 0; i < FocHoursDetail.length; i++) {
                            count = Number(i) + 1;
                            strVar += "Free Storage Till " + FocHoursDetail[i].FocHours + " " + DailyFlightDetail[i].Flight + " / ";
                        }
                    }
                    else {
                        strVar += "No Record Found"
                    }
                    strVar += "<\/br>";

                    $('#divDetail2').html(strVar);
                    $("#divDetail2").dialog({
                        resizable: false,
                        modal: true,
                        title: "Shipment Free Hour Details",
                        width: 600,
                        buttons: {
                            "OK": function () {
                                $(this).dialog('close');
                            }
                        }
                    });
                },
                error: function (xhr) {
                    var ex = xhr;
                }
            });
        }
        else {
            if (userContext.SysSetting.ICMSEnvironment.toUpperCase() == "JT" && IsDoChargeApplicable == 1) {
                if ($("span[id='DORRemainingPieces']").text() != "0") {
                    ShowMessage('warning', 'Information!', "Please get charges first", "bottom-right");
                    return false;
                }
            }
            else if (userContext.SysSetting.ICMSEnvironment.toUpperCase() != "JT") {
                if ($("span[id='DORRemainingPieces']").text() != "0") {
                    ShowMessage('warning', 'Information!', "Please get charges first", "bottom-right");
                    return false;
                }
            }
        }
    }
    else if (msg.defaultValue == "Warehouse Location" || msg == "Warehouse Location") {
        if (type == undefined) {
            $.ajax({
                url: "Services/Import/DeliveryOrderService.svc/GetLocationData?AWBSNo=" + parseInt(currentawbsno) + "&ArrivedShipmentSNo=" + parseInt(currentArrivedShipmentSNo), async: false, type: "get", dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var resData = jQuery.parseJSON(result);
                    var locData = resData.Table0;
                    var strVar = "";
                    strVar += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody>";
                    strVar += "<tr style=\"font-weight: bold\">";
                    strVar += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">SNo<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">ULD No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">HAWB No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Total Piece<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Assigned Location<\/td><\/tr>";
                    if (locData.length > 0) {
                        for (var i = 0; i < locData.length; i++) {
                            strVar += "<tr><td class=\"ui-widget-content\">" + (parseInt(i) + 1) + "<\/td><td class=\"ui-widget-content\">" + (locData[i].StartPieces != "0" ? "" : (locData[i].ULDNo != "BULK" ? locData[i].ULDNo : "")) + "<\/td><td class=\"ui-widget-content\">" + (locData[i].HAWBNo != "0" ? locData[i].HAWBNo : "") + "<\/td><td class=\"ui-widget-content\">" + (locData[i].EndPieces != "0" ? locData[i].EndPieces : "") + "<\/td><td class=\"ui-widget-content\">" + (locData[i].AssignLocation != "" ? locData[i].AssignLocation : locData[i].MovableLocation) + "<\/td><\/tr>"
                        }
                    }
                    else {
                        strVar += "<tr><td class=\"ui-widget-content\" colspan\"2\">No Record Found<\/td><\/tr>"
                    }
                    strVar += "<\/tbody><\/table>";
                    strVar += "<\/br>";

                    $('#divDetail2').html(strVar);
                    $("#divDetail2").dialog({
                        resizable: false,
                        modal: true,
                        title: "Assigned Location Details",
                        width: 600,
                        buttons: {
                            "OK": function () {
                                $(this).dialog('close');
                            }
                        }
                    });
                }
            });
        }
        else {
            $.ajax({
                url: "Services/Import/DeliveryOrderService.svc/GetDeliveryOrderPrint",
                async: false,
                type: "GET",
                dataType: "json",
                data: { DOSNo: type, Type: "DO", InvoiceSNo: InvoiceSNo },
                contentType: "application/json; charset=utf-8", cache: false,
                success: function (result) {
                    var resData = jQuery.parseJSON(result);
                    var FinalData = resData.Table0;
                    var locData = resData.Table3;
                    var Pieces = 0;
                    var HAWBNo = "";
                    if (FinalData.length > 0) {
                        Pieces = FinalData[0].Pieces;
                        HAWBNo = FinalData[0].HouseNo;
                    }

                    var strVar = "";
                    strVar += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody>";
                    strVar += "<tr style=\"font-weight: bold\">";
                    strVar += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">SNo<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">ULD No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">HAWB No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Total Piece<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Assigned Location<\/td><\/tr>";
                    if (locData.length > 0) {
                        if (HAWBNo != "") {
                            locData = $.grep(locData, function (value, i) {
                                return (value.HAWBNo == HAWBNo);
                            });

                            for (var i = 0; i < locData.length; i++) {
                                strVar += "<tr><td class=\"ui-widget-content\">" + (parseInt(i) + 1) + "<\/td><td class=\"ui-widget-content\">" + (locData[i].StartPieces != "0" ? "" : (locData[i].ULDNo != "BULK" ? locData[i].ULDNo : "")) + "<\/td><td class=\"ui-widget-content\">" + (locData[i].HAWBNo != "0" ? locData[i].HAWBNo : "") + "<\/td><td class=\"ui-widget-content\">" + (locData[i].EndPieces != "0" ? locData[i].EndPieces : "") + "<\/td><td class=\"ui-widget-content\">" + (locData[i].AssignLocation != "" ? locData[i].AssignLocation : locData[i].MovableLocation) + "<\/td><\/tr>"
                            }
                        }
                        else {
                            for (var i = 0; i < locData.length; i++) {
                                strVar += "<tr><td class=\"ui-widget-content\">" + (parseInt(i) + 1) + "<\/td><td class=\"ui-widget-content\">" + (locData[i].StartPieces != "0" ? "" : (locData[i].ULDNo != "BULK" ? locData[i].ULDNo : "")) + "<\/td><td class=\"ui-widget-content\">" + (locData[i].HAWBNo != "0" ? locData[i].HAWBNo : "") + "<\/td><td class=\"ui-widget-content\">" + (locData[i].EndPieces != "0" ? locData[i].EndPieces : "") + "<\/td><td class=\"ui-widget-content\">" + (locData[i].AssignLocation != "" ? locData[i].AssignLocation : locData[i].MovableLocation) + "<\/td><\/tr>"
                            }
                        }
                    }
                    else {
                        strVar += "<tr><td class=\"ui-widget-content\" colspan\"2\">No Record Found<\/td><\/tr>"
                    }
                    strVar += "<\/tbody><\/table>";
                    strVar += "<\/br>";

                    $('#divDetail2').html(strVar);
                    $("#divDetail2").dialog({
                        resizable: false,
                        modal: true,
                        title: "Assigned Location Details",
                        width: 600,
                        buttons: {
                            "OK": function () {
                                $(this).dialog('close');
                            }
                        }
                    });
                }
            });
        }
    }
    else if (ActionType == "DLV") {
        var DeliveryOrderGetWebForm3 = {
            processName: _CURR_PRO_,
            moduleName: 'Import',
            appName: 'ChargeNote',
            Action: 'New',
            IsSubModule: '1'
        }
        var hawb = 0;
        var SPHCTransSNo = 0;
        var ShipmentDetailArray = [];
        pieces = 0;
        grossWt = 0;
        partNumber = 0;
        if ($("#Text_HAWB").data("kendoAutoComplete") != undefined)
            hawb = $("#Text_HAWB").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_HAWB").data("kendoAutoComplete").key();
        if (subprocesssno == "2137" || subprocesssno == "2146") {
            pieces = $("#hdnPieces").val();
            grossWt = $("#hdnGrWt").val();
            pieces = 0;
            grossWt = 0;
            subprocesssno = 2146
            if (currentPomailSno > 0) {
                subprocesssno = 3533;
                ProcessSNo = 17;
            }

            if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length == 0 && $('#tblDLV').length != 0) {
                $("tr[id*=trtblDLV]").each(function () {
                    var CustomerType = $(this).find("td:eq(" + $(this).find('td[data-column="CustomerType"]').index() + ")").text();
                    var DeliveryOrderNo = $(this).find("td:eq(" + $(this).find('td[data-column="DeliveryOrderNo"]').index() + ")").text();
                    var DeliveryOrderDate = $(this).find("td:eq(" + $(this).find('td[data-column="DeliveryOrderDate"]').index() + ")").text();
                    var DOPieces = $(this).find("td:eq(" + $(this).find('td[data-column="DOPieces"]').index() + ")").text();
                    var DOGrossWeight = $(this).find("td:eq(" + $(this).find('td[data-column="DOGrossWeight"]').index() + ")").text();
                    var TotalPieces = $(this).find("td:eq(" + $(this).find('td[data-column="TotalPieces"]').index() + ")").text();
                    var TotalGrossWeight = $(this).find("td:eq(" + $(this).find('td[data-column="TotalGrossWeight"]').index() + ")").text();

                    var ShipmentDetailViewModel = {
                        PartNumber: Number(partNumber) + 1,
                        AWBSNo: currentawbsno == 0 ? currentPomailSno : currentawbsno,
                        HAWBSNo: hawb,
                        PartSNo: $('#hdnDailyflightsno').val() == "" ? 0 : $('#hdnDailyflightsno').val(),
                        Pieces: Number(DOPieces),
                        GrossWeight: Number(DOGrossWeight),
                        VolumeWeight: 0,
                        IsBUP: 0,
                        SPHCSNo: 0,
                        SPHCTransSNo: SPHCTransSNo
                    };
                    ShipmentDetailArray.push(ShipmentDetailViewModel);
                });
            }
            else if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length == 0 && $("div[id$='areaTrans_import_doflightdetail']").length != 0) {
                $("tr[id*=areaTrans_import_doflightdetail]").each(function () {
                    console.log($(this).find("span#TotalPieces").html());
                    pieces = Number(pieces) + Number(($(this).find("span[id^='TotalPieces']").html().split('/')[0]));
                    grossWt = Number(grossWt) + Number($(this).find("span[id^='TotalGrossWeight']").html().split('/')[0]);
                    var ShipmentDetailViewModel = {
                        PartNumber: Number(partNumber) + 1,
                        AWBSNo: currentawbsno == 0 ? currentPomailSno : currentawbsno,
                        HAWBSNo: hawb,
                        PartSNo: 0,
                        Pieces: Number(pieces),
                        GrossWeight: Number(grossWt),
                        VolumeWeight: 0,
                        IsBUP: 0,
                        SPHCSNo: 0,
                        SPHCTransSNo: SPHCTransSNo
                    };
                    ShipmentDetailArray.push(ShipmentDetailViewModel);
                });
            }
            else {
                $("div[id$='areaTrans_import_doshipmenttypedetail']").find("[id^='areaTrans_import_doshipmenttypedetail']").each(function (i, row) {
                    pieces = Number(pieces) + Number($(this).find("span[id^='BupPcs']").text()) + Number($(this).find("input[id^='_tempBulkPcs']").val());
                    grossWt = Number(grossWt) + Number($(this).find("span[id^='BupGrWt']").text()) + Number($(this).find("input[id^='_tempBulkGrWt']").val());

                    var ShipmentDetailViewModel = {
                        PartNumber: Number(partNumber) + 1,
                        AWBSNo: currentawbsno == 0 ? currentPomailSno : currentawbsno,
                        HAWBSNo: hawb,
                        PartSNo: $(this).find("span[id^='DailyFlightSNo']").text(),
                        Pieces: Number($(this).find("span[id^='BupPcs']").text()) + Number($(this).find("input[id^='_tempBulkPcs']").val()),
                        GrossWeight: Number($(this).find("span[id^='BupGrWt']").text()) + Number($(this).find("input[id^='_tempBulkGrWt']").val()),
                        VolumeWeight: 0,
                        IsBUP: Number($(this).find("span[id^='BupPcs']").text()) > 0 ? 1 : 0,
                        SPHCSNo: 0,
                        SPHCTransSNo: SPHCTransSNo
                    };
                    ShipmentDetailArray.push(ShipmentDetailViewModel);
                });
            }
        }
        if (currentawbsno == 0) {
            currentawbsno = currentPomailSno
        }
        else {
            currentawbsno = currentawbsno
        }

        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/GetWebForm",
            async: true, type: "post", cache: false, contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ model: DeliveryOrderGetWebForm3 }),
            success: function (result) {
                $("#divDetail2").html(result);
                $.ajax({
                    url: "Services/Import/DeliveryOrderService.svc/GetDeliveryOrderPaymentType", async: false, type: "POST", dataType: "json", cache: false,
                    data: JSON.stringify({ AWBSNo: parseInt(currentawbsno), ArrivedShipmentSNo: parseInt(currentArrivedShipmentSNo), DestinationCity: currentdetination, PDSNo: parseInt(msg), ProcessSNo: parseInt(22), SubProcessSNo: parseInt(subprocesssno), ShipmentDetailArray: ShipmentDetailArray }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        var resData = jQuery.parseJSON(result);
                        DLVSNo = msg;
                        var hcData = resData.Table1;
                        pdPieces = resData.Table0[0].PDPieces;
                        pdGrossWt = resData.Table0[0].PDGrWt;
                        if (resData.Table0[0].DOPaymentType == "CASH") {
                            $("#divDetail2").append("<span id='spnType'><b>Payment Type : </b></span><span id='spnPaymentType'>" + resData.Table0[0].DOPaymentType + "</span>");
                        }
                        else {
                            $("#divDetail2").append("</br></br><b>Cash/Credit : </b><input type='radio'  data-radioval='CASH' class='' name='CustomerType' checked='True' id='CustomerType' value='0'>CASH <input type='radio'  data-radioval='CREDIT' class='' name='CustomerType' id='CustomerType' value='1'>CREDIT");
                            $('input:radio[name=CustomerType]').change(function () { AuthenticateBillTo(this); });
                        }

                        $("#divDetail2").append("<input type=\"hidden\" name=\"hdnPieces\" id=\"hdnPieces\" value=\"\" /><input type=\"hidden\" name=\"hdnGrWt\" id=\"hdnGrWt\" value=\"\" /><input type=\"hidden\" name=\"hdnChargeDOSNo\" id=\"hdnChargeDOSNo\" value=\"\" />");

                        $("#divDetail2").append("</br></br><div id='divbillto'><b>Bill To : </b><input type=\"hidden\" name=\"BillTo\" id=\"BillTo\" value=\"\" /><input type=\"text\" class=\"\" name=\"Text_BillTo\"  id=\"Text_BillTo\" controltype=\"autocomplete\" maxlength=\"\" data-width=\"50px\" value=\"\" placeholder=\"\" />&nbsp;<span style='color:red' id='spanbillto'>*</span>&nbsp;<input type='text' class='k-input' name='BillToText' id='BillToText' style='width: 200px; text-transform: uppercase;' controltype='alphanumericupper' maxlength='100' value='' placeholder='walkin customer name' data-role='alphabettextbox' autocomplete='off'></div>");
                        cfi.AutoCompleteV2("BillTo", "Name", "DeliveryOrderDLV_vBillTo", CheckAgentCreditLimit, "contains");

                        $('input:radio[name=CustomerType]').change(function () { AuthenticateBillTo(this); });

                        var Mode = resData.Table0[0].DOPaymentType;
                        if (Mode == "CASH") {
                            $("#Text_BillTo").data("kendoAutoComplete").setDefaultValue("", "");
                            $("#Text_BillTo").data("kendoAutoComplete").enable(false);
                            $("#Text_BillTo").removeAttr("data-valid").removeAttr("data-valid-msg");
                            $("#BillToText").show();
                            $("#BillToText").attr("data-valid", "required").attr("data-valid-msg", "Enter Bill To.");
                            $("#BillToText").text(resData.Table0[0].DoBillTo);
                            if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "GA") {
                                $("#btnGetCharges").closest('table').css('display', 'none')
                                $("#BillToText").removeAttr("data-valid").removeAttr("data-valid-msg");
                            }
                            else {
                                $("#btnGetCharges").closest('table').css('display', 'block')
                            }
                        }
                        else {
                            if ($("#Text_BillTo").data("kendoAutoComplete") != undefined) {
                                $("#Text_BillTo").data("kendoAutoComplete").setDefaultValue(resData.Table0[0].DoBillToSNo, resData.Table0[0].DoBillTo);
                                $("#Text_BillTo").data("kendoAutoComplete").enable(true);
                                $("#Text_BillTo").attr("data-valid", "required").attr("data-valid-msg", "Select Bill To.");
                                $('input:radio[name="CustomerType"][value="1"]').attr('checked', true);

                                //*******************Start Charge Note Bill TO for credit *****************
                                //added by rahul to add participants id with bill to in credit on charge Note on 15 Jan 2018 
                                $.ajax({
                                    url: "Services/Import/DeliveryOrderService.svc/GetBillToForworderName",
                                    async: false, type: "get", dataType: "json", cache: false,
                                    data: { AWBSNo: currentawbsno },
                                    contentType: "application/json; charset=utf-8",
                                    success: function (result) {
                                        var Data = jQuery.parseJSON(result);
                                        var billData = Data.Table0;
                                        if (billData.length > 0 && billData[0] != 'undefined') {
                                            $("#Text_BillTo").data("kendoAutoComplete").setDefaultValue(billData[0].AccountSNo, billData[0].accountname)
                                            $("#BillToText").val(billData[0].AccountSNo);
                                            $("#Text_BillTo").data("kendoAutoComplete").enable(false);
                                            $("#Text_BillTo").attr("title", $("#Text_BillTo").val());
                                        }
                                    },
                                    error: {
                                    }
                                });
                                //*******************End Charge Note Bill TO for credit *****************
                            }
                            $("#BillToText").hide();
                            $("#BillToText").removeAttr("data-valid").removeAttr("data-valid-msg");
                        }

                        $("#hdnPieces").val(pdPieces);
                        $("#hdnGrWt").val(pdGrossWt);
                        $("#hdnChargeDOSNo").val(chkComplete);
                        chwt = type;

                        /****************Handling Charge Information*************************************/
                        MendatoryHandlingCharges = [];
                        if (hcData != []) {
                            $(hcData).each(function (row, i) {
                                if (i.isMandatory == 1) {
                                    MendatoryHandlingCharges.push({ "type": "M", "chargename": i.TariffSNo, "text_chargename": i.TariffCode, "pbasis": i.PrimaryBasis, "pvalue": i.pValue, "sbasis": i.SecondaryBasis, "svalue": i.sValue, "amount": i.ChargeAmount, "totaltaxamount": i.TotalTaxAmount, "totalamount": i.TotalAmount, "remarks": i.ChargeRemarks.toUpperCase().replace(/<BR>/g, ""), "list": 1, "PartSNo": i.PartSNo, "DescriptionRemarks": i.DescriptionRemarks });
                                    totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat(i.TotalAmount)
                                }
                            });
                        }

                        cfi.makeTrans("import_dohandlingcharge", null, null, BindChargeAutoComplete, ReBindChargeAutoComplete, null, MendatoryHandlingCharges);
                        if (MendatoryHandlingCharges.length > 0) {
                            $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                                $(this).find("span[id^='PBasis']").closest("td").find("input[id^='_tempPValue']").val(MendatoryHandlingCharges[i].pvalue);
                                $(this).find("span[id^='PBasis']").closest("td").find("input[id^='PValue']").val(MendatoryHandlingCharges[i].pvalue);
                                $(this).find("span[id^='PBasis']").text(MendatoryHandlingCharges[i].pbasis);
                                $(this).find("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").val(MendatoryHandlingCharges[i].svalue);
                                $(this).find("span[id^='SBasis']").closest("td").find("input[id^='SValue']").val(MendatoryHandlingCharges[i].svalue);
                                $(this).find("span[id^='SBasis']").text(MendatoryHandlingCharges[i].sbasis);
                                $(this).find("input[id^='DescriptionRemarks']").closest('td').append("&nbsp;&nbsp;<span id=_DescriptionRemarks_" + i + ">" + MendatoryHandlingCharges[i].DescriptionRemarks + "</span>");
                                $(this).find("input[id^='DescriptionRemarks']").closest("td").css("display", "none");
                                $(this).find("input[id^='TaxPercent']").closest('td').append("&nbsp;&nbsp;<span id=_TaxPercent_" + i + ">" + MendatoryHandlingCharges[i].TaxPercent + "</span>");
                                $(this).find("input[id^='TaxPercent']").closest("td").css("display", "none");

                            });

                            $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                                $(this).find("[id^='PValue']").after("<input type='hidden' id='PartSNo' name='PartSNo' value=''>");
                            });

                            $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                                $(this).find("[id^='PValue']").closest('td').find("[id^='PartSNo']").val(MendatoryHandlingCharges[i].PartSNo);
                            });

                            $("div[id$='divareaTrans_import_dohandlingcharge']").find("[id='areaTrans_import_dohandlingcharge']").each(function () {
                                $(this).find("input[id^='ChargeName']").each(function () {
                                    if (currentPomailSno > 0) {
                                        subprocesssno = 3533;
                                        ProcessSNo = 17;
                                    }
                                    else if (subprocesssno == 2146) {
                                        subprocesssno = 2146;
                                        ProcessSNo = 22;
                                    }
                                    else {
                                        subprocesssno = 2135;
                                        ProcessSNo = 22;
                                    }
                                    AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIEInbound", "", currentawbsno == 0 ? currentPomailSno : currentawbsno, 0, currentdetination, 1, hawb, "2", ShipmentDetailArray, ProcessSNo, subprocesssno, "No");
                                });

                                $(this).find("span[id^='Remarks']").text($(this).find("span[id^='Remarks']").text().substring(0, 50));
                                $(this).find("span[id^='Remarks']").closest('td').hover(function () {
                                    $(this).prop('title', $(this).find("input[id^='Remarks']").val());
                                });
                            });

                            $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                                $(this).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").enable(false);
                                $(this).find("span[id^='PBasis']").closest("td").find("input").attr("disabled", "disabled");
                                $(this).find("span[id^='SBasis']").closest("td").find("input").attr("disabled", "disabled");
                                if ($(this).find("span[id^='Remarks']").text().length > 50) {
                                    $(this).find("span[id^='Remarks']").css("text-overflow", "ellipsis");
                                    $(this).find("span[id^='Remarks']").closest("td").attr("word-wrap", true);
                                }
                                if (MendatoryHandlingCharges.length - 1 == i) {
                                    $(this).find("div[id^='transActionDiv']").show();
                                    if (MendatoryHandlingCharges.length > 1)
                                        $(this).find("div[id^='transActionDiv']").find('i:eq(0)').hide();
                                }
                            });
                        }
                        else {
                            $("div[id$='divareaTrans_import_dohandlingcharge']").find("[id='areaTrans_import_dohandlingcharge']").each(function () {
                                $(this).find("input[id^='ChargeName']").each(function () {
                                    if (currentPomailSno > 0) {
                                        subprocesssno = 3533;
                                        ProcessSNo = 17;
                                    }
                                    else if (subprocesssno == 2146) {
                                        subprocesssno = 2146;
                                        ProcessSNo = 22;
                                    }
                                    else {
                                        subprocesssno = 2135;
                                        ProcessSNo = 22;
                                    }
                                    AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIEInbound", "", currentawbsno == 0 ? currentPomailSno : currentawbsno, 0, currentdetination, 1, hawb, "2", ShipmentDetailArray, ProcessSNo, subprocesssno, "No");
                                });
                            });

                            $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                                $(this).find("span[id^='Type']").text("E");
                                $(this).find("input[id^='WaveOff']").hide();

                            });
                        }
                    }
                });

                $("#divDetail2").dialog({
                    resizable: true,
                    modal: true,
                    title: "Charge Note",
                    height: 500,
                    width: 1200,
                    buttons: {
                        "Save": function () {
                            SaveChargeNote();
                            $(".ui-dialog-buttonset").find("button")[1].disabled = false;
                        },
                        "Print": function () {
                            if (InvoiceNo == undefined || InvoiceNo == '') {
                                $(".ui-dialog-buttonset").find("button")[1].disabled = false;
                            }
                            else {
                                PrintSlip("CN", InvoiceNo, DLVSNo);
                                $(this).dialog('close');
                            }
                        }
                    }
                });
                $(".ui-dialog-buttonset").find("button")[1].disabled = true;
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
    else if (IsPartDo == 1 || IsHouseDo == 1) {
        if ($("#Text_HAWB").data("kendoAutoComplete") != undefined)
            $("#Text_HAWB").data("kendoAutoComplete").enable(true);
        if (IsHouseDo == 1)
            $("#Text_HAWB").attr("data-valid", "required").attr("data-valid-msg", "Select House AWB.");
        if (IsPartDo == 1)
            DOType = "Part"
        $("#divDetail2").html(msg);
        $("#divDetail2").dialog({
            resizable: false,
            modal: true,
            title: "Delivery Order",
            height: 250,
            width: 400,
            buttons: {
                "Close": function () {
                    $(this).dialog('close');
                    if (IsPopUp) {
                        IsPopUp = false;
                        BindDeliveryOrder(awbType, shipmentType, "Part");
                    }
                }
            }
        });
    }
    else if (ActionType == "DLVPrint") {
        var isdisabled = $("#" + type.id).closest("tr").find("input[id^='chkOFW']").is(':disabled') == true ? 1 : 0;
        var chk = $("#" + type.id).closest("tr").find("input[id^='chkOFW']").is(":checked") == true ? 1 : 0;
        if (isdisabled == 0 && chk == 1) {
            $("#divDetail2").html("Shipment will be marked as out of warehouse, Are you sure want to print PDS.");
            $("#divDetail2").dialog({
                resizable: false,
                modal: true,
                title: "Print Physical DO Slip",
                height: 250,
                width: 400,
                buttons: {
                    "Yes": function () {
                        PrintSlip("DLV", msg, type);
                        $(this).dialog('close');
                    },
                    "No": function () {
                        $(this).dialog('close');
                    }
                }
            });
        }
        else {
            PrintSlip("DLV", msg, type);
        }
    }
    else if (ActionType == 'addShipment') {
        //$.ajax({
        //    url: "Services/Import/DeliveryOrderService.svc/GetFOCConsignee?AWBSNo=" + parseInt(currentawbsno), async: false, type: "get", dataType: "json", cache: false,
        //    contentType: "application/json; charset=utf-8",
        //    success: function (result) {
        //        var resData = jQuery.parseJSON(result);
        //        var focData = resData.Table0;
        //        var strVar = "";
        //        strVar += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody>";
        //        strVar += "<tr style=\"font-weight: bold\">";
        //        strVar += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">SNo<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">FOC Check<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">FOC Consignee<\/td><\/tr>";
        //        if (focData.length > 0) {
        //            for (var i = 0; i < focData.length; i++) {
        //                strVar += "<td class=\"ui-widget-content\">" + focData[i].SNo + "<\/td><td class=\"ui-widget-content\"><input id=\"chkFOC_" + i + "\" onclick='CheckUnCheck(this);' type=\"checkbox\"\"><\/td><td class=\"ui-widget-content\">" + focData[i].FOCConsignee + "<input id=\"hdnFOC_" + i + "\" type=\"hidden\" value=" + focData[i].FOCConsigneeSNo + " \"><\/td><\/tr>"
        //            }
        //        }
        //        else {
        //            strVar += "<td class=\"ui-widget-content\" colspan=\"3\">No Record Found<\/td><\/tr>"
        //        }
        //        strVar += "<\/tbody><\/table>";
        //        strVar += "<\/br>";

        //        $('#divDetail2').html(strVar);
        //        $('#divDetail2').find("tr").each(function () {
        //            if ($(this).find("input[id^='chkFOC_']").length > 0) {
        //                var hdnId = $(this).find("input[id^='hdnFOC_']").val();
        //                if (focCheckValue == hdnId)
        //                    $(this).find("input[id^='chkFOC_']").attr('checked', true);
        //            }
        //        });

        //        $("#divDetail2").dialog({
        //            resizable: false,
        //            modal: true,
        //            title: "FOC Consignee Details",
        //            width: 600,
        //            buttons: {
        //                "OK": function () {
        //                    var chkFlag = false;
        //                    $('#divDetail2').find("tr:gt(0)").each(function () {
        //                        chkFlag = $("#" + $(this).find("input[id^='chkFOC']").attr("id")).is(":checked");
        //                        if (chkFlag == true) {
        //                            FOCConsigneeSNo = $("#" + $(this).find("input[id^='hdnFOC']").attr("id")).val();
        //                            return;
        //                        }
        //                        else {
        //                            FOCConsigneeSNo = 0;
        //                            return;
        //                        }
        //                    });

        //                    NillFOCCHarges(FOCConsigneeSNo);
        //                    $(this).dialog('close');
        //                },
        //                "CANCEL": function () {
        //                    FOCConsigneeSNo = 0;
        //                    return;
        //                    NillFOCCHarges(FOCConsigneeSNo);
        //                    $(this).dialog('close');
        //                }
        //            }
        //        });
        //    }
        //});
        var strVar = "";
        strVar += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody>";
        strVar += "<tr style=\"font-weight: bold\">";
        strVar += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">origin<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">destination<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">flightdate<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">flightno<\/td><\/tr>";
        //if (focData.length > 0) {
        //    for (var i = 0; i < focData.length; i++) {
        //        strVar += "<td class=\"ui-widget-content\">" + focData[i].SNo + "<\/td><td class=\"ui-widget-content\"><input id=\"chkFOC_" + i + "\" onclick='CheckUnCheck(this);' type=\"checkbox\"\"><\/td><td class=\"ui-widget-content\">" + focData[i].FOCConsignee + "<input id=\"hdnFOC_" + i + "\" type=\"hidden\" value=" + focData[i].FOCConsigneeSNo + " \"><\/td><\/tr>"
        //    }
        //}
        //else {
        //    strVar += "<td class=\"ui-widget-content\" colspan=\"3\">No Record Found<\/td><\/tr>"
        //}
        strVar += "<\/tbody><\/table>";
        strVar += "<\/br>";

        $('#divDetail2').html(strVar);
    }
    else {
        $("#Text_HAWB").removeAttr("data-valid").removeAttr("data-valid-msg");
        if ($('#divDetail2').find('input[type=hidden]').length == 0)
            $("#divDetail2").append("<input type='hidden' id='hdnCheck' value='" + type + "'><input type='hidden' id='hdnCheck' value='" + IsHouse + "'>");
        if ($("#Text_HAWB").data("kendoAutoComplete") != undefined)
            $("#Text_HAWB").data("kendoAutoComplete").enable(true);
        $("#divDetail2").html(msg);
        $("#divDetail2").dialog({
            resizable: false,
            modal: true,
            title: "Delivery Order",
            height: 250,
            width: 400,
            buttons: {
                "Yes": function () {
                    if (type == 2 && IsHouse == false) {
                        if (IsPart = false) {
                            $(this).dialog('close');
                            awbType = "MAWB"
                        }
                        else {
                            awbType = "MAWB";
                            OpenPopUp("Complete DO will be generated for MAWB", 2, "", IsPart, "", "", "", "", "");
                            if ($("#Text_HAWB").data("kendoAutoComplete") != undefined)
                                $("#Text_HAWB").data("kendoAutoComplete").enable(false);
                            $(this).dialog('close');
                        }
                    }
                    else if (type == 1 && IsHouse == true) {
                        if (IsPart = false) {
                            awbType = "MAWB"
                            OpenPopUp("Complete DO will be generated for MAWB", 2, "", IsPart, "", "", "", "", "");
                        }
                        else {
                            awbType = "HAWB"
                            OpenPopUp("Complete DO will be generated for MAWB", 2, "", IsPart, "", "", "", "", "");
                        }
                    }
                    else {
                        if (type == 1 && chkComplete == true)
                            DOType = "Full";
                        if (type == 1 && IsPart == true)
                            DOType = "Full";
                        $(this).dialog('close');
                    }
                    if (IsPopUp) {
                        IsPopUp = false;
                        BindDeliveryOrder(awbType, shipmentType, DOType);
                    }
                },
                "No": function () {
                    if (type == 1 && IsPartArrived == 1) {
                        $("#divDetail").hide();
                        $(this).dialog('close');
                    }
                    else if (type == 1 && IsHouse == 1) {
                        awbType = "HAWB";
                        OpenPopUp("Complete DO will be generated for HAWB", 2, 1, IsPart, "", "", "", "", "");
                    }
                    else if (type == 1) {
                        DOType = "Part";
                        OpenPopUp("Part DO will be generated for MAWB, Charges will be applicable for part DO.", 2, "", IsPart, "", "", "", "", "", "");
                    }
                    else if (type == 2) {
                        $("#divDetail").hide();
                        $(this).dialog('close');
                    }
                }
            }
        });
        if (IsHouse == 1)
            $("#Text_HAWB").attr("data-valid", "required").attr("data-valid-msg", "Select House AWB.");
        else
            $("#Text_HAWB").removeAttr("data-valid").removeAttr("data-valid-msg");
    }
}

function CheckUnCheck(obj) {
    if ($("#" + obj.id).is(":checked") == true) {
        $('#divDetail2').find("tr:gt(0)").each(function () {
            if ($(this).find("input[id^='chkFOC']").attr("id") != obj.id)
                chkFlag = $("#" + $(this).find("input[id^='chkFOC']").attr("id")).attr("disabled", true);
        });
    }
    else {
        $('#divDetail2').find("tr:gt(0)").each(function () {
            chkFlag = $("#" + $(this).find("input[id^='chkFOC']").attr("id")).attr("disabled", false);
        });
    }

    if ($("#" + obj.id).is(":checked") == true) {
        focCheckValue = $("#hdnFOC_" + obj.id.split("_")[1]).val();
    }
    else {
        focCheckValue = 0;
    }
}

function NillFOCCHarges(obj) {
    var currAmount = Number(totalAmountDO) > 0 ? parseFloat(totalAmountDO) - parseFloat(totalHandlingCharges) : parseFloat(totalAmountDO);
    $("span[id='TotalAmountDO']").text(currAmount.toFixed(3));
    totalHandlingCharges = 0;
    $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
        if (obj != undefined && Number(obj) != 0) {
            $(this).find("[id^='WaveOff']").prop("checked", true);
            $(this).find("input[type=hidden][id^='hdnremark']").val("FOC Consignee");
            $(this).find("a[id^='waveofRemark']").css('display', 'block');
            $(this).find("a[id^='waveofRemark']").css('color', 'green');
        }
        else {
            $(this).find("[id^='WaveOff']").prop("checked", false);
            $(this).find("input[type=hidden][id^='hdnremark']").val("");
            $(this).find("a[id^='waveofRemark']").css('display', 'none');
            $(this).find("a[id^='waveofRemark']").css('color', 'red');
        }
        totalHandlingCharges = Number(totalHandlingCharges) + Number($(this).find("td:eq(8)")[0].innerText);
    });

    var currAmount = 0;
    totalAmountDO = $("span[id='TotalAmountDO']").text();
    if (obj != undefined && Number(obj) != 0) {
        currAmount = Number(totalAmountDO) > 0 ? parseFloat(totalAmountDO) - parseFloat(totalHandlingCharges) : parseFloat(totalAmountDO);
        $("span[id='TotalAmountDO']").text(currAmount.toFixed(3));
    }
    else {
        currAmount = parseFloat(totalAmountDO) + parseFloat(totalHandlingCharges);
        $("span[id='TotalAmountDO']").text(currAmount.toFixed(3));
    }
}

function CancelDO(obj) {
    var flag = false;
    var HandlingChargeArray = [];
    var Mode = $("#divareaTrans_import_dohandlingcharge").find('th').closest('tr').find('input:radio[id="CustomerType"]:checked').attr("data-radioval");//$("span[id='DOPaymentType']").text();
    var ChargeTo = $("#Text_BillTo").data("kendoAutoComplete").key();//$("input[id='hdnBillTo']").val();
    var BillToText = $("#BillToText").val();
    $("div[id$='divareaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function () {
        if ($(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key() != "") {
            var HandlingChargeViewModel = {
                SNo: $(this).find("td[id^='tdSNoCol']").html(),
                AWBSNo: currentPomailSno == 0 ? currentawbsno : currentPomailSno,
                WaveOff: $(this).find("[id^='WaveOff']").prop('checked') == true ? 1 : 0,
                TariffCodeSNo: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key(),
                TariffHeadName: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").value(),
                pValue: parseFloat($(this).find("[id^='PValue']").val() == "" ? 0 : $(this).find("[id^='PValue']").val()),
                sValue: parseFloat($(this).find("[id^='SValue']").val() == "" ? 0 : $(this).find("[id^='SValue']").val()),
                Amount: parseFloat($(this).find("[id^='Amount']").text() == "" ? 0 : $(this).find("[id^='Amount']").text()),
                TotalTaxAmount: $(this).find("[id^='TotalTaxAmount']").text(),
                TotalAmount: $(this).find("[id^='TotalAmount']").text(),
                Rate: $(this).find("[id^='Rate']").text() == "" ? 0 : $(this).find("[id^='Rate']").text() == "undefined" ? 0 : $(this).find("[id^='Rate']").text(),
                Min: 1,
                Mode: Mode,
                ChargeTo: 0,
                pBasis: $(this).find("[id^='PBasis']").text(),
                sBasis: $(this).find("[id^='SBasis']").text(),
                Remarks: $(this).find("[id^='Remarks']").val(),
                WaveoffRemarks: $(this).find("[id^='hdnremark']").val() == undefined ? "" : $(this).find("[id^='hdnremark']").val(),
                DescriptionRemarks: $(this).find("span[id^='_DescriptionRemarks_']").text() || "",
                TaxPercent: $(this).find("span[id^='_TaxPercent_']").text() || 0,
            };
            HandlingChargeArray.push(HandlingChargeViewModel);
        }
    });

    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/CancelDO", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ DOSNo: parseInt($("#Text_DONo").data("kendoAutoComplete").key()), lstHandlingCharges: HandlingChargeArray, BillTo: ChargeTo, BillToText: BillToText, POMailSNo: currentPomailSno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "Minimum Credit Limit Reached.") {
                ShowMessage('warning', 'warning - Delivery Order', result, "bottom-right");
            }
            else if (result != "") {
                ShowMessage('success', 'Success - Delivery Order', "Canceled Successfully", "bottom-right");
                ReloadSameGridPage("Cancel DO");
            }
            else
                ShowMessage('warning', 'Warning', "Please correct value(s) for :- " + result + ".", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Delivery Order', "DO No. [" + curDO + "] -  unable to process.", "bottom-right");
        }
    });
}

function PrintSlip(Type, obj, pdsno, index, DOSNo, DLVSNo) {
    if (Type == "DO") {
        if (userContext.SysSetting.ClientEnvironment.toUpperCase() == 'UK' || userContext.SysSetting.ClientEnvironment.toUpperCase() == 'G8') {
            $.ajax({
                url: "../Services/Import/DeliveryOrderService.svc/GetInvoiceType",
                async: false,
                type: "POST",
                dataType: "json",
                data: JSON.stringify({ AWBSNo: currentawbsno }),
                contentType: "application/json; charset=utf-8", cache: false,
                success: function (result) {
                    var Data = jQuery.parseJSON(result);
                    var resData = Data.Table0;
                    if (resData.length > 0) {

                        if (Number(resData[0].IsInterNational) == 1) {
                            var InvoiceType = 1;
                            window.open("Client/" + userContext.SysSetting.ClientEnvironment.toUpperCase() + "/Invoice/GenrateAndViewInvoice.html?InvoiceSNo=" + obj + "&InvoiceType=" + InvoiceType + "&UserSNo=" + userContext.UserSNo + "&LogoURL=" + userContext.SysSetting.LogoURL);
                        }
                        else {
                            window.open("HtmlFiles/DeliveryOrder/DOPrinti5.html?DOSNo=" + (obj == "" ? 0 : obj) + "&Type=" + Type + "&POMailSNo=" + currentPomailSno + "&LogoURL=" + userContext.SysSetting.LogoURL);
                        }
                    }
                }
            });
        }
        else if (userContext.SysSetting.ClientEnvironment.toUpperCase() == 'TH') {
            window.open("Client/TH/DOPrintRaya.html?DOSNo=" + (obj == "" ? 0 : obj) + "&Type=" + Type + "&POMailSNo=" + currentPomailSno + "&LogoURL=" + userContext.SysSetting.LogoURL);
        }
        else if (userContext.SysSetting.ClientEnvironment.toUpperCase() == 'GA') {
            window.open("HtmlFiles/DeliveryOrder/DOPrintGA.html?DOSNo=" + (obj == "" ? 0 : obj) + "&Type=" + Type + "&POMailSNo=" + currentPomailSno + "&LogoURL=" + userContext.SysSetting.LogoURL);
        }
        else if (userContext.SysSetting.ClientEnvironment.toUpperCase() == 'I5') {
            window.open("HtmlFiles/DeliveryOrder/DOPrinti5.html?DOSNo=" + (obj == "" ? 0 : obj) + "&Type=" + Type + "&POMailSNo=" + currentPomailSno + "&LogoURL=" + userContext.SysSetting.LogoURL);
        }
        else if (userContext.SysSetting.ClientEnvironment.toUpperCase() == 'JT') {
            window.open("HtmlFiles/DeliveryOrder/DOPrint.html?DOSNo=" + (obj == "" ? 0 : obj) + "&Type=" + Type + "&POMailSNo=" + currentPomailSno + "&LogoURL=" + userContext.SysSetting.LogoURL);
        }
        else {
            window.open("HtmlFiles/DeliveryOrder/DOPrintGA.html?DOSNo=" + (obj == "" ? 0 : obj) + "&Type=" + Type + "&POMailSNo=" + currentPomailSno + "&LogoURL=" + userContext.SysSetting.LogoURL);
        }
    }

    if (Type == "DOPrint")
        window.open("HtmlFiles/DeliveryOrder/DeliveryOrderNew.html?DOSNo=" + (obj == "" ? 0 : obj) + "&Type=" + Type);

    if (Type == "DOCancel")
        window.open("HtmlFiles/DeliveryOrder/DOPrint.html?DOSNo=" + (obj == "" ? 0 : obj) + "&Type=" + Type + "&LogoURL=" + userContext.SysSetting.LogoURL);

    if (Type == "DLV") {
        var chk = $("#" + pdsno.id).closest("tr").find("input[id^='chkOFW']").is(":checked") == true ? 1 : 0;
        var isdisabled = $("#" + pdsno.id).closest("tr").find("input[id^='chkOFW']").is(':disabled') == true ? 1 : 0;
        var pieces = $("#" + pdsno.id).closest("tr").find("td:eq(5)").text();
        var grossWt = $("#" + pdsno.id).closest("tr").find("td:eq(6)").text();
        if (chk == 1 && isdisabled == 0) {
            if (currentPomailSno > 0) {
                if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length != 0) {
                    subprocesssno = 3521;
                    ProcessSNo = 17;
                }

                if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length == 0 && $("div[id$='areaTrans_import_doflightdetail']").length != 0) {
                    subprocesssno = 3521;
                    ProcessSNo = 17;
                }

                if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length == 0 && $("div[id$='areaTrans_import_doflightdetail']").length == 0) {
                    subprocesssno = 3533;
                    ProcessSNo = 17;
                }
            }
            else if (subprocesssno == 2146) {
                subprocesssno = 2146;
                ProcessSNo = 22;
            }
            else if (subprocesssno == 2137) {
                subprocesssno = 2146;
                ProcessSNo = 22;
            }
            else {
                subprocesssno = parseInt(subprocesssno);
                ProcessSNo = 22;
            }

            $.ajax({
                url: "Services/Import/DeliveryOrderService.svc/CheckPayment",
                data: JSON.stringify({ DOSNo: parseInt(0), PDSNo: parseInt(obj == "" ? 0 : obj) }),
                async: false, type: "POST", dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var resData = jQuery.parseJSON(result);
                    var payment = resData.Table0;
                    if (payment[0].IsPayment == "1") {
                        ShowMessage('warning', 'Warning - Delivery Order', 'Storage Charges pending, Please raise Charge Note for pending Storage Charges.', " ", "bottom-right");
                        return false;
                    }
                    else {
                        var IsRushHandling = "RSH=" + ($("#RushHandling").is(':checked') ? 1 : 0);
                        var ShipmentDetailArray = [];
                        $.ajax({
                            url: "Services/Import/DeliveryOrderService.svc/GetCharges", async: false, type: "POST", dataType: "json", cache: false,
                            data: JSON.stringify({ TariffSNo: parseInt(0), AWBSNo: currentawbsno == 0 ? currentPomailSno : currentawbsno, CityCode: currentdetination, HAWBSNo: 0, ProcessSNo: parseInt(22), SubProcessSNo: subprocesssno, GrWT: parseFloat(grossWt), ChWt: parseFloat(grossWt), pValue: parseFloat(0), sValue: parseFloat(0), Pieces: parseInt(pieces), DOSNo: parseInt(0), PDSNo: parseInt(obj == "" ? 0 : obj), lstShipmentInfo: ShipmentDetailArray, Remarks: IsRushHandling, POMailSNo: parseInt(currentPomailSno) }),
                            contentType: "application/json; charset=utf-8",
                            success: function (result) {
                                MendatoryHandlingCharges = [];
                                var resData = jQuery.parseJSON(result);
                                var pendingCharges = resData.Table0;
                                if (pendingCharges.length > 0) {
                                    if (pendingCharges != []) {
                                        $(pendingCharges).each(function (row, i) {
                                            if (i.isMandatory == 1) {
                                                MendatoryHandlingCharges.push({ "type": "M", "chargename": i.TariffSNo, "text_chargename": i.TariffCode, "pbasis": i.PrimaryBasis, "pvalue": i.pValue, "sbasis": i.SecondaryBasis, "svalue": i.sValue, "amount": i.ChargeAmount, "totaltaxamount": i.TotalTaxAmount, "totalamount": i.TotalAmount, "remarks": i.ChargeRemarks.toUpperCase().replace(/<BR>/g, ""), "rate": i.Rate, "list": 1, "DescriptionRemarks": i.DescriptionRemarks, "TaxPercent": i.TaxPercent });
                                                totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat(i.TotalAmount)
                                            }
                                        });
                                    }
                                }

                                if (MendatoryHandlingCharges.length > 0) {
                                    ShowMessage('warning', 'Warning - Delivery Order', 'Storage Charges pending, Please raise Charge Note for pending Storage Charges.', " ", "bottom-right");
                                }
                                else {
                                    $("#" + pdsno.id).closest("tr").find("input[id^='chkOFW']").attr("disabled", true);
                                    window.open("HtmlFiles/Import/physicaldeliveryslip.html?PDSNo=" + (obj == "" ? 0 : obj) + "&OFW=" + chk + "&Disable=0" + "&LogoURL=" + userContext.SysSetting.LogoURL);
                                }
                            },
                            error: function (ex) {
                                var ex = ex;
                            }
                        });
                    }
                },
                error: function (ex) {
                    var ex = ex;
                }
            });
        }
        else {
            if (chk == 1)
                $("#" + pdsno.id).closest("tr").find("input[id^='chkOFW']").attr("disabled", true);
            //  window.open("HtmlFiles/Import/physicaldeliveryslip.html?PDSNo=" + (obj == "" ? 0 : obj) + "&OFW=" + chk + "&Disable=" + chk + "&LogoURL=" + userContext.SysSetting.LogoURL);
            window.open("HtmlFiles/DeliveryOrder/ReleaseNote/ReleaseNote.html?InvoiceSNo=" + (obj == "" ? 0 : obj) + "&PDSNo=" + pdsno + "&LogoURL=" + userContext.SysSetting.LogoURL);

        }
    }
    if (Type == "CNDLV") {
        var IsCustomClearData = 0;

        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/CheckWaybillDetail?AWBNo=" + currentawbsno + "&ArrivedShipmentSNo=" + currentArrivedShipmentSNo + "&ICNNo=" + currentPomailSno,
            async: false,
            type: "get",
            dataType: "json",
            cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result != "") {
                    var resData = jQuery.parseJSON(result);
                    var CustomDetails = resData.Table2;
                    IsCustomClearData = userContext.SysSetting.ClientEnvironment.toUpperCase() != "GA" ? 2 : CustomDetails[0].IsCustomClear;
                    if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "GA" && Number(IsCustomClearData) != 2) {
                        ShowMessage('warning', 'Warning - Delivery Order', 'Custom Information is mandatory to proceed with DLV.', " ", "bottom-right");
                        $("#divDetail").hide();
                        flag = false;
                        return false
                    }
                }
            }
        })

        if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "GA" && $($('input[type="checkbox"]').closest("tr").find("input[id^='chkOFW_']")[index]).is(':disabled') == false) {
            $.ajax({
                url: "Services/Import/DeliveryOrderService.svc/GetPendingInvoice?AWBSno=" + currentawbsno.toString() + "&DOSNo=" + DOSNo.toString() + "&DLVSno=" + DLVSNo.toString(),
                async: false,
                type: "get",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    debugger;
                    var resultParse = JSON.parse(result);

                    if (resultParse.Table0.length > 0 && (resultParse.Table0[0].InvoicePaid == 0 && resultParse.Table0[0].IsOFW == "False") && $($('input[type="checkbox"]').closest("tr").find("input[id^='chkOFW_']")[index]).is(':checked') == true) {
                        ShowMessage('warning', 'Warning - Delivery Order', 'Need to clear pending charges first.', " ", "bottom-right");
                        return false;
                    }

                    if (Number(IsCustomClearData) == 2) {
                        var invoiceSno = "";
                        var isdisabled = $($('input[type="checkbox"]').closest("tr").find("input[id^='chkOFW_']")[index]).is(':disabled') == true ? 1 : 0;
                        var chk = $($('input[type="checkbox"]').closest("tr").find("input[id^='chkOFW_']")[index]).is(":checked") == true ? 1 : 0;
                        if (isdisabled == 0 && chk == 1) {
                            //$('input[type="checkbox"]').closest("tr").find("input[id^='chkOFW']").attr("disabled", true);
                            $("#divDetail2").html("Shipment will be marked as out of warehouse, Are you sure want to print PDS.");
                            $("#divDetail2").dialog({
                                resizable: false,
                                modal: true,
                                title: "Print Physical DO Slip",
                                height: 250,
                                width: 400,
                                buttons: {
                                    "Yes": function () {
                                        $($('input[type="checkbox"]').closest("tr").find("input[id^='chkOFW_']")[index]).attr("disabled", true);
                                        $($('input[type="checkbox"]').closest("tr").find("input[id^='btnChargeNote_']")[index]).attr("disabled", true);
                                        $.ajax({
                                            url: "Services/Import/DeliveryOrderService.svc/CheckWarehousePDS",
                                            data: JSON.stringify({ DOSNo: parseInt(obj), awbSNo: parseInt(currentawbsno), OFW: parseInt(chk) }),
                                            async: false, type: "POST", dataType: "json", cache: false,
                                            contentType: "application/json; charset=utf-8",
                                            success: function (result) {
                                                var resData = jQuery.parseJSON(result);
                                                if (resData.Table0.length > 0) {
                                                    invoiceSno = resData.Table0[0].InvoiceSNo;
                                                }
                                            }
                                        });
                                        window.open("HtmlFiles/DeliveryOrder/ReleaseNote/ReleaseNote.html?InvoiceSNo=" + (invoiceSno == "" ? 0 : invoiceSno) + "&PDSNo=" + pdsno + "&LogoURL=" + userContext.SysSetting.LogoURL);

                                        $(this).dialog('close');
                                    },
                                    "No": function () {
                                        $(this).dialog('close');
                                    }
                                }
                            });
                        }
                        else {
                            $.ajax({
                                url: "Services/Import/DeliveryOrderService.svc/CheckWarehousePDS",
                                data: JSON.stringify({ DOSNo: parseInt(obj), awbSNo: parseInt(currentawbsno) }),
                                async: false, type: "POST", dataType: "json", cache: false,
                                contentType: "application/json; charset=utf-8",
                                success: function (result) {
                                    var resData = jQuery.parseJSON(result);
                                    if (resData.Table0.length > 0) {
                                        invoiceSno = resData.Table0[0].InvoiceSNo;
                                    }
                                }
                            });
                            window.open("HtmlFiles/DeliveryOrder/ReleaseNote/ReleaseNote.html?InvoiceSNo=" + (invoiceSno == "" ? 0 : invoiceSno) + "&PDSNo=" + pdsno + "&LogoURL=" + userContext.SysSetting.LogoURL);
                            //window.open("HtmlFiles/DeliveryOrder/ReleaseNote/ReleaseNote.html?InvoiceSNo=" + (invoiceSno == "" ? 0 : invoiceSno) + "&PDSNo=" + pdsno + "&LogoURL=" + userContext.SysSetting.LogoURL);
                        }
                    }
                }
            })
        }
        else {
            if (Number(IsCustomClearData) == 2) {
                var invoiceSno = "";
                var isdisabled = $($('input[type="checkbox"]').closest("tr").find("input[id^='chkOFW_']")[index]).is(':disabled') == true ? 1 : 0;
                var chk = $($('input[type="checkbox"]').closest("tr").find("input[id^='chkOFW_']")[index]).is(":checked") == true ? 1 : 0;
                if (isdisabled == 0 && chk == 1) {
                    $('input[type="checkbox"]').closest("tr").find("input[id^='chkOFW']").attr("disabled", true);
                    $("#divDetail2").html("Shipment will be marked as out of warehouse, Are you sure want to print PDS.");
                    $("#divDetail2").dialog({
                        resizable: false,
                        modal: true,
                        title: "Print Physical DO Slip",
                        height: 250,
                        width: 400,
                        buttons: {
                            "Yes": function () {
                                //$($('input[type="checkbox"]').closest("tr").find("input[id^='chkOFW']")[index]).attr("disabled", true);
                                $.ajax({
                                    url: "Services/Import/DeliveryOrderService.svc/CheckWarehousePDS",
                                    data: JSON.stringify({ DOSNo: parseInt(obj), awbSNo: parseInt(currentawbsno), OFW: parseInt(chk) }),
                                    async: false, type: "POST", dataType: "json", cache: false,
                                    contentType: "application/json; charset=utf-8",
                                    success: function (result) {
                                        var resData = jQuery.parseJSON(result);
                                        if (resData.Table0.length > 0) {
                                            invoiceSno = resData.Table0[0].InvoiceSNo;
                                        }
                                    }
                                });
                                window.open("HtmlFiles/DeliveryOrder/ReleaseNote/ReleaseNote.html?InvoiceSNo=" + (invoiceSno == "" ? 0 : invoiceSno) + "&PDSNo=" + pdsno + "&LogoURL=" + userContext.SysSetting.LogoURL);

                                $(this).dialog('close');
                            },
                            "No": function () {
                                $(this).dialog('close');
                            }
                        }
                    });
                }
                else {
                    $.ajax({
                        url: "Services/Import/DeliveryOrderService.svc/CheckWarehousePDS",
                        data: JSON.stringify({ DOSNo: parseInt(obj), awbSNo: parseInt(currentawbsno) }),
                        async: false, type: "POST", dataType: "json", cache: false,
                        contentType: "application/json; charset=utf-8",
                        success: function (result) {
                            var resData = jQuery.parseJSON(result);
                            if (resData.Table0.length > 0) {
                                invoiceSno = resData.Table0[0].InvoiceSNo;
                            }
                        }
                    });
                    window.open("HtmlFiles/DeliveryOrder/ReleaseNote/ReleaseNote.html?InvoiceSNo=" + (invoiceSno == "" ? 0 : invoiceSno) + "&PDSNo=" + pdsno + "&LogoURL=" + userContext.SysSetting.LogoURL);
                    //window.open("HtmlFiles/DeliveryOrder/ReleaseNote/ReleaseNote.html?InvoiceSNo=" + (invoiceSno == "" ? 0 : invoiceSno) + "&PDSNo=" + pdsno + "&LogoURL=" + userContext.SysSetting.LogoURL);
                }
            }
        }
    }

    if (Type == "CN") {
        window.open("HtmlFiles/DeliveryOrder/ReleaseNote/ReleaseNote.html?InvoiceSNo=" + (obj == "" ? 0 : obj) + "&PDSNo=" + pdsno + "&LogoURL=" + userContext.SysSetting.LogoURL);

    }
}

function GetHouseWiseData(valueId, value, keyId, key) {
    $("#divareaTrans_import_dohandlingcharge").html(temp);
    $("div[id$='divareaTrans_import_dohandlingcharge']").hide();
    if ($("table[id^='__tbldo__']").length > 4)
        $("table[id^='__tbldo__']")[4].hidden = true;
    $("span[id='HAWBConsigneeName']").text("");
    $("span[id='HAWBSHC']").text("");
    $("span[id='HAWBDescriptionOfGoods']").text("");
    $('#divMultiSPHCType li').remove();
    $('#SPHCType').val("");
    if (key != "") {
        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/BindHAWBSectionData",
            async: false, type: "GET", dataType: "json", cache: false,
            data: { HAWBSNo: (key == "" ? 0 : key), AWBSNo: currentawbsno, ArrivedShipmentSNo: currentArrivedShipmentSNo, DestCity: currentdetination },
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var fdData = Data.Table5;
                var cData = Data.Table3;
                var hcData = Data.Table4;
                var doDate = Data.Table6;
                var ihcdata = Data.Table7;
                var htdcdata = Data.Table8;
                var lHAWB = Data.Table10;
                var checkHouse = 1;

                if (doDate.length > 0) {
                    checkHouse = Number(doDate[0].HouseSNo) > 0 ? 1 : 0;
                }

                if (checkHouse == 1) {
                    if (userContext.SysSetting.ICMSEnvironment.toUpperCase() == 'GA' && lHAWB.length == 0) {
                        if ($("input[id='HAWBLocation']").length == 0) {
                            $("#Text_HAWB").closest("td").append("<input type='button' class='buttontolink' name='HAWBLocation' id='HAWBLocation' style='width:150px;' value='HAWB Location'>");
                            $("#HAWBLocation").unbind("click").bind("click", function () {
                                HAWBLocation(currentawbsno, currentArrivedShipmentSNo);
                            })
                        }

                        if ($("#chkRushHandling").is(':checked') == false && userContext.SysSetting.ClientEnvironment.toUpperCase() != 'UK' && userContext.SysSetting.ClientEnvironment != 'G8') {
                            $("span[id='HAWBConsigneeName']").text("");
                            $("span[id='HAWBSHC']").text("");
                            $("span[id='HAWBDescriptionOfGoods']").text("");
                            $("#Text_ParticipantName").data("kendoAutoComplete").setDefaultValue("", "");
                            $('#HarmonizedCommodity').val("");
                            $("span[id='spnHAWBDescription']").text("");
                            ShipmentDetail = [];
                            $("#divareaTrans_import_doshipmenttypedetail").html(tempShipment);
                        }
                        else {
                            $("span[id='HAWBConsigneeName']").text(cData[0].ConsigneeName);
                            $("span[id='HAWBSHC']").text(cData[0].SPHC);
                            $("span[id='HAWBDescriptionOfGoods']").text(cData[0].NatureOfGoods);
                        }
                    }
                    else {
                        if (cData.length > 0) {
                            if (userContext.SysSetting.ICMSEnvironment.toUpperCase() == 'GA' && lHAWB.length > 0) {
                                IsLocationOnGetCharges = lHAWB[0].LocationOnImport;
                                if ($("input[id='HAWBLocation']").length == 0) {
                                    $("#Text_HAWB").closest("td").append("<input type='button' class='buttontolink' name='HAWBLocation' id='HAWBLocation' style='width:150px;' value='HAWB Location'>");
                                    $("#HAWBLocation").unbind("click").bind("click", function () {
                                        HAWBLocation(currentawbsno, currentArrivedShipmentSNo);
                                    })
                                }

                                if ($("#chkRushHandling").is(':checked') == false) {
                                    if (IsLocationOnGetCharges == 0) {
                                        $("span[id='HAWBConsigneeName']").text("");
                                        $("span[id='HAWBSHC']").text("");
                                        $("span[id='HAWBDescriptionOfGoods']").text("");
                                        $("#Text_ParticipantName").data("kendoAutoComplete").setDefaultValue("", "");
                                        $('#HarmonizedCommodity').val("");
                                        $("span[id='spnHAWBDescription']").text("");
                                        ShipmentDetail = [];
                                        $("#divareaTrans_import_doshipmenttypedetail").html(tempShipment);
                                    }
                                    else {
                                        $("span[id='HAWBConsigneeName']").text(cData[0].ConsigneeName);
                                        $("span[id='HAWBSHC']").text(cData[0].SPHC);
                                        $("span[id='HAWBDescriptionOfGoods']").text(cData[0].NatureOfGoods);
                                    }
                                }
                                else {
                                    $("span[id='HAWBConsigneeName']").text(cData[0].ConsigneeName);
                                    $("span[id='HAWBSHC']").text(cData[0].SPHC);
                                    $("span[id='HAWBDescriptionOfGoods']").text(cData[0].NatureOfGoods);
                                }
                            }
                            else {
                                $("span[id='HAWBConsigneeName']").text(cData[0].ConsigneeName);
                                $("span[id='HAWBSHC']").text(cData[0].SPHC);
                                $("span[id='HAWBDescriptionOfGoods']").text(cData[0].NatureOfGoods);
                            }
                        }
                        else {
                            $("span[id='HAWBConsigneeName']").text("");
                            $("span[id='HAWBSHC']").text("");
                            $("span[id='HAWBDescriptionOfGoods']").text("");
                            $("#Text_ParticipantName").data("kendoAutoComplete").setDefaultValue("", "");
                        }
                    }

                    if (ihcdata.length > 0) {
                        $('#HarmonizedCommodity').val(ihcdata[0].HarmonizedCommodity);
                    }
                    else {
                        $('#HarmonizedCommodity').val("");
                    }

                    if (htdcdata.length > 0) {
                        $("span[id='spnHAWBDescription']").text(htdcdata[0].HAWBDescription);
                    }
                    else {
                        $("span[id='spnHAWBDescription']").text("");
                    }

                    ShipmentDetail = [];
                    if (fdData != []) {
                        $(fdData).each(function (row, i) {
                            ShipmentDetail.push({ "pieces": i.pieces, "_tempPieces": i.pieces, "uldpieces": i.uldpieces, "totalpieces": i.totalpieces, "grossweight": i.grossweight, "uldgrossweight": i.uldgrossweight, "_tempGrossWeight": i.grossweight, "totalgrossweight": i.totalgrossweight, "sphc": i.sphc, "description": i.description, "flightdetails": i.flightdetails, "dailyflightsno": i.dailyflightsno, "list": 1 });
                        });
                    }

                    if (fdData.length > 0) {
                        var totalPieces = 0;
                        $("#divareaTrans_import_doshipmenttypedetail").html(tempShipment);
                        cfi.makeTrans("import_doshipmenttypedetail", null, null, null, null, null, fdData);

                        $("div[id$='areaTrans_import_doshipmenttypedetail']").find("[id^='areaTrans_import_doshipmenttypedetail']").each(function (i, row) {
                            $(this).find("input[id^='ULDNo']").each(function () {
                                cfi.AutoCompleteV2($(this).attr("name"), "ULDNo", "DeliveryOrderDLV_ULDNo", GetBupDetails, "contains", ",");
                            });

                            totalPieces = Number(totalPieces) + Number(ShipmentDetail[i]._tempPieces);
                            $("#" + $(this).find("span").find("input[id*='BulkPcs']")[0].id).val(ShipmentDetail[i]._tempPieces);
                            $("#" + $(this).find("span").find("input[id*='BulkPcs']")[1].id).val(ShipmentDetail[i].pieces);
                            $(this).find("span[id^='Slas']").text("/");
                            $(this).find("span[id^='BupPcs']").text("0");
                            $(this).find("span[id^='TotalPieces']").text(ShipmentDetail[i].totalpieces);
                            $(this).find("span[id^='TotalBulkPieces']").text(ShipmentDetail[i].pieces);
                            $("#" + $(this).find("span").find("input[id*='BulkGrWt']")[0].id).val(ShipmentDetail[i]._tempGrossWeight);
                            $("#" + $(this).find("span").find("input[id*='BulkGrWt']")[1].id).val(ShipmentDetail[i].grossweight);
                            $(this).find("span[id^='TotalBulkGrWt']").text(ShipmentDetail[i].grossweight);
                            $(this).find("span[id^='BupGrWt']").text("0");
                            $(this).find("span[id^='TotalGrossWeight']").text(ShipmentDetail[i].totalgrossweight);
                            $(this).find("td:eq(5)").hide();
                            $(this).find("span[id^='TotalBulkPieces']").hide();
                            $(this).find("span[id^='TotalBulkGrWt']").hide();
                            $(this).find("div[id^='transActionDiv']").hide();
                            if ($("#PaymentType").val() == 0) {
                                $(this).find("input[id^='BulkPcs']").prop("disabled", true);
                                $(this).find("input[id^='BulkGrWt']").prop("disabled", true);
                                $(this).find("input[id^='_tempBulkPcs']").prop("disabled", true);
                                $(this).find("input[id^='_tempBulkGrWt']").prop("disabled", true);
                            }
                            else {
                                //Made Disabled true on 02-12-2017 for HAWB by rahul as said by gulsan sir 
                                $(this).find("input[id^='BulkPcs']").prop("disabled", true);
                                $(this).find("input[id^='BulkGrWt']").prop("disabled", true);
                                $(this).find("input[id^='_tempBulkPcs']").prop("disabled", true);
                                $(this).find("input[id^='_tempBulkGrWt']").prop("disabled", true);
                            }
                            $(this).find("input[id^='BulkPcs']").show();
                            $(this).find("input[id^='BulkGrWt']").show();
                            $(this).find("input[id^='_tempBulkPcs']").hide();
                            $(this).find("input[id^='_tempBulkGrWt']").hide();
                        });
                    }
                    else {
                        $("#Text_HAWB").data("kendoAutoComplete").setDefaultValue("", "");
                        $.ajax({
                            url: "Services/Import/DeliveryOrderService.svc/GetDeliveryOrderRecord?AWBSNo=" + currentawbsno + "&ArrivedShipmentSNo=" + currentArrivedShipmentSNo + "&DOType=" + DOType + "&DestCity=" + currentdetination + "&POMailSNo=" + currentPomailSno, async: false, type: "get", dataType: "json", cache: false,
                            contentType: "application/json; charset=utf-8",
                            success: function (result) {
                                var resData = jQuery.parseJSON(result);
                                var fdData = resData.Table1;

                                /****************Flight Detail*************************************/
                                ShipmentDetail = [];
                                if (fdData != []) {
                                    $(fdData).each(function (row, i) {
                                        ShipmentDetail.push({ "pieces": i.pieces, "_tempPieces": i.pieces, "uldpieces": i.uldpieces, "totalpieces": i.totalpieces, "grossweight": i.grossweight, "uldgrossweight": i.uldgrossweight, "_tempGrossWeight": i.grossweight, "totalgrossweight": i.totalgrossweight, "sphc": i.sphc, "description": i.description, "flightdetails": i.flightdetails, "dailyflightsno": i.dailyflightsno, "list": 1 });
                                    });
                                }

                                var totalPieces = 0;
                                /****************Shipment Type Detail*************************************/
                                $("#divareaTrans_import_doshipmenttypedetail").html(tempShipment);
                                cfi.makeTrans("import_doshipmenttypedetail", null, null, null, null, null, fdData);

                                $("div[id$='areaTrans_import_doshipmenttypedetail']").find("[id^='areaTrans_import_doshipmenttypedetail']").each(function (i, row) {
                                    $(this).find("input[id^='ULDNo']").each(function () {
                                        cfi.AutoCompleteV2($(this).attr("name"), "ULDNo", "DeliveryOrder_ShipmentType", GetBupDetails, "contains", ",");
                                    });

                                    totalPieces = Number(totalPieces) + Number(ShipmentDetail[i]._tempPieces);
                                    $("#" + $(this).find("span").find("input[id*='BulkPcs']")[0].id).val(ShipmentDetail[i]._tempPieces);
                                    $("#" + $(this).find("span").find("input[id*='BulkPcs']")[1].id).val(ShipmentDetail[i].pieces);
                                    $(this).find("span[id^='Slas']").text("/");
                                    $(this).find("span[id^='BupPcs']").text("0");
                                    $(this).find("span[id^='TotalPieces']").text(ShipmentDetail[i].totalpieces);
                                    $(this).find("span[id^='TotalBulkPieces']").text(ShipmentDetail[i].pieces);
                                    $("#" + $(this).find("span").find("input[id*='BulkGrWt']")[0].id).val(ShipmentDetail[i]._tempGrossWeight);
                                    $("#" + $(this).find("span").find("input[id*='BulkGrWt']")[1].id).val(ShipmentDetail[i].grossweight);
                                    $(this).find("span[id^='TotalBulkGrWt']").text(ShipmentDetail[i].grossweight);
                                    $(this).find("span[id^='BupGrWt']").text("0");
                                    $(this).find("span[id^='TotalGrossWeight']").text(ShipmentDetail[i].totalgrossweight);
                                    $(this).find("td:eq(5)").hide();
                                    $(this).find("span[id^='TotalBulkPieces']").hide();
                                    $(this).find("span[id^='TotalBulkGrWt']").hide();
                                    $(this).find("div[id^='transActionDiv']").hide();
                                    if ($("#PaymentType").val() == 0) {
                                        $(this).find("input[id^='BulkPcs']").prop("disabled", true);
                                        $(this).find("input[id^='BulkGrWt']").prop("disabled", true);
                                        $(this).find("input[id^='_tempBulkPcs']").prop("disabled", true);
                                        $(this).find("input[id^='_tempBulkGrWt']").prop("disabled", true);
                                    }
                                    else {
                                        $(this).find("input[id^='BulkPcs']").prop("disabled", false);
                                        $(this).find("input[id^='BulkGrWt']").prop("disabled", false);
                                        $(this).find("input[id^='_tempBulkPcs']").prop("disabled", false);
                                        $(this).find("input[id^='_tempBulkGrWt']").prop("disabled", false);
                                    }
                                    $(this).find("input[id^='BulkPcs']").show();
                                    $(this).find("input[id^='BulkGrWt']").show();
                                    $(this).find("input[id^='_tempBulkPcs']").hide();
                                    $(this).find("input[id^='_tempBulkGrWt']").hide();
                                });
                            },
                            error: function (ex) {
                                var ex = ex;
                            }
                        });

                        if (key != "" && parseInt(userContext.SysSetting.IsLocationMandatoryOnImport) == 1) {
                            ShowMessage('warning', 'Warning - Delivery Order [' + CurrentAWBNo + ']', "For HAWB Delivery Order, Kindly assign location of HAWB for House DO.", "bottom-right");
                        }
                        flag = false;
                        return false
                    }
                }
                else {
                    $("#Text_HAWB").data("kendoAutoComplete").setDefaultValue("", "");
                }
            }
        });
    }
}

function HAWBLocation(awbSNo, arrivedShipmentSNo) {
    dbAwbTableName = 'AwbULDLocation';
    dbAWBCaption = 'HAWB Location';
    if ($("#tbl" + dbAwbTableName).length === 0) {
        $("#divDetail2").html("<table id='tbl" + dbAwbTableName + "'></table>");
    } else {
        $("#tbl" + dbAwbTableName).html('');
    }

    cfi.PopUp("tbl" + dbAwbTableName, dbAWBCaption, 1330, null, null, 10);
    $("#tbl" + dbAwbTableName).parent("div").css("position", "fixed");

    $('#tbl' + dbAwbTableName).appendGrid({
        tableID: 'tbl' + dbAwbTableName,
        contentEditable: true,
        tableColumns: 'SNo,AWBNo,RcvdPieces,RcvdGrossWeight,HAWB,SPHC,EndPieces,AssignLocation,TempControlled,StartTemperature,EndTemperature',
        masterTableSNo: (arrivedShipmentSNo + '.' + awbSNo),
        currentPage: 1, itemsPerPage: 5, whereCondition: "Delivery", sort: '',
        servicePath: './Services/Import/InboundFlightService.svc',
        getRecordServiceMethod: 'Get' + dbAwbTableName + 'Record',
        isGetRecord: true,
        caption: dbAWBCaption,
        initRows: 1,
        hideButtons: { updateAll: true, append: false, insert: true, remove: true, removeLast: false },
        columns: [
            { name: 'SNo', type: 'hidden', value: 0 },
            {
                name: 'AWBSNo', type: 'hidden'
            },
            {
                name: 'ArrivedShipmentSNo', type: 'hidden'
            },
            {
                name: 'SPHC', type: 'hidden'
            },
            {
                name: 'HdnAWBNo', type: 'hidden'
            },
            {
                name: 'HdnHAWB', type: 'hidden'
            },
            {
                name: 'HdnRcvdPieces', type: 'hidden'
            },
            {
                name: 'HdnRcvdGrossWeight', type: 'hidden'
            },
            {
                name: 'AWBNo', display: 'AWB No', type: 'label'
            },
            {
                name: 'RcvdPieces', display: 'Rcvd Pieces', type: 'label'
            },
            {
                name: 'RcvdGrossWeight', display: 'Rcvd Gr.WT', type: 'label'
            },
            {
                name: 'HdnLocSNo', type: 'hidden'
            },
            {
                name: 'HdnEndPieces', type: 'hidden'
            },
            {
                name: 'HAWB', display: 'HAWB No', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return CheckHAWB(this);" }, ctrlCss: { width: '100px', height: '20px' }, AutoCompleteName: 'ImportInbound_HAWB', filterField: 'HAWBNo'
            },
            {
                name: 'SPHC', display: 'SHC', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return CheckSPHC(this);" }, ctrlCss: { width: '80px', height: '20px' }, AutoCompleteName: 'ImportInbound_LocationSPHC', filterField: 'Code', filterCriteria: "contains", separator: ","
            },
            {
                name: 'EndPieces', display: 'Pieces', type: 'text', ctrlAttr: { maxlength: 8, controltype: "number", onBlur: "CheckFAStartEndPieces(this)" }, ctrlCss: { width: '55px' }, isRequired: true
            },
            {
                name: 'TempControlled', display: 'Temp Controlled', type: 'text', value: "1", type: 'select', onChange: function (evt, rowIndex) {
                    var ind = evt.target.id.split('_')[2];
                    if ($("#" + evt.target.id + " option:checked").val() == 1) {
                        $("input[id*='tblAwbULDLocation_StartTemperature_" + ind + "']").removeAttr("required").css("cursor", "not-allowed");
                        $("input[id*='tblAwbULDLocation_EndTemperature_" + ind + "']").removeAttr("required").css("cursor", "not-allowed");
                        $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").enable(false);
                        $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").enable(false);
                        $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").value(0);
                        $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").value(0);
                    } else {
                        $("input[id*='tblAwbULDLocation_StartTemperature_" + ind + "']").attr("disabled", false).attr("required", "required").css("cursor", "auto");;
                        $("input[id*='tblAwbULDLocation_EndTemperature_" + ind + "']").attr("disabled", false).attr("required", "required").css("cursor", "auto");
                        $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").enable(true);
                        $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").enable(true);
                        $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").value('');
                        $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").value('');
                    }

                    $("#tblAwbULDLocation_HdnAssignLocation_" + ind).val("");
                    $("#tblAwbULDLocation_AssignLocation_" + ind).val("");

                }, ctrlOptions: { '0': 'Yes', '1': 'No' }, ctrlCss: { width: '50px', height: '20px' }
            },

            {
                divRowNo: 1, name: 'StartTemperature', display: 'Start Temp.', type: 'text', ctrlAttr: { controltype: 'range', maxlength: 4, allowchar: '-100!100', onBlur: "CheckFATempratureStartEnd(this)" }, ctrlCss: { width: '35px', height: '20px' }, isRequired: true
            },
            {
                divRowNo: 1, name: 'EndTemperature', display: 'End Temp.', type: 'text', ctrlAttr: {
                    controltype: 'range', maxlength: 4, allowchar: '-100!100', onBlur: "CheckFATempratureStartEnd(this)"
                }, ctrlCss: { width: '35px', height: '20px' }, isRequired: true
            },
            {
                name: 'MovableLocation', display: 'Movable Location', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return CheckMovableLocation(this);" }, ctrlCss: { width: '120px', height: '20px' }, AutoCompleteName: 'ImportInbound_MovableLocation', filterField: 'ConsumablesName', onChange: function (evt, rowIndex) {
                }
            },
            {
                name: 'AssignLocation', display: 'Assign Location', type: 'text', ctrlAttr: { maxlength: 100, controltype: 'autocomplete', onSelect: "return CheckMovableLocation(this);" }, ctrlCss: { width: '120px', height: '20px' }, AutoCompleteName: 'ImportInbound_AssignLocation', filterField: 'LocationName', filterCriteria: "contains", isRequired: true, onChange: function (evt, rowIndex) {
                }
            }
        ],
        rowUpdateExtraFunction: function (id) {
            var rowAWBULDCount = $("#tblAwbULDLocation").find("input[id^=tblAwbULDLocation_StartPieces_]").length;
            $("select[id^='tblAwbULDLocation_TempControlled']").each(function (i, el) {
                var ind = $(this).attr('id').split('_')[2];
                $("#tblAwbULDLocation_StartTemperature_" + ind).closest("table").find("td").removeClass("ui-widget-content");
                if ($("#tblAwbULDLocation_TempControlled_" + ind + " option:checked").val() == 1) {
                    $("input[id*='tblAwbULDLocation_StartTemperature_" + ind + "']").removeAttr("required").css("cursor", "not-allowed");
                    $("input[id*='tblAwbULDLocation_EndTemperature_" + ind + "']").removeAttr("required").css("cursor", "not-allowed");
                    $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").enable(false);
                    $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").enable(false);
                    $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").value(0);
                    $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").value(0);
                } else {
                    $("input[id*='tblAwbULDLocation_StartTemperature_" + ind + "']").attr("required", "required").css("cursor", "auto");
                    $("input[id*='tblAwbULDLocation_EndTemperature_" + ind + "']").attr("required", "required").css("cursor", "auto");
                    $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").enable(true);
                    $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").enable(true);
                    $("#tblAwbULDLocation_StartTemperature_" + ind).data("kendoNumericTextBox").value($("#tblAwbULDLocation_StartTemperature_" + ind).val());
                    $("#tblAwbULDLocation_EndTemperature_" + ind).data("kendoNumericTextBox").value($("#tblAwbULDLocation_EndTemperature_" + ind).val());
                }

                $("#divMultitblAwbULDLocation_SPHC_" + ind).find("ul").css("width", "163px");
                $("#tblAwbULDLocation_SPHC_" + ind).val("");
                ExtraCondition("#tblAwbULDLocation_AssignLocation_" + ind);
                if (rowAWBULDCount == 1) {
                    if (ind > 0) {
                        $("#tblAwbULDLocation_StartPieces_" + (ind - 1)).removeAttr("disabled").css("cursor", "auto");
                        $("#tblAwbULDLocation_EndPieces_" + (ind - 1)).removeAttr("disabled").css("cursor", "auto");
                    }
                }
                else {
                    if (ind > 0) {
                        $("#tblAwbULDLocation_StartPieces_" + (ind - 1)).attr("disabled", true).css("cursor", "not-allowed");
                        $("#tblAwbULDLocation_EndPieces_" + (ind - 1)).attr("disabled", true).css("cursor", "not-allowed");
                    }
                }

                $("input[id^=tblAwbULDLocation_StartTemperature]").each(function () {
                    $(this).closest("table").find("td").removeClass("ui-widget-content");
                    $(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").focus();
                    if ($(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").val() == "" && $(this).closest("tr").find("input[id^='tblAwbULDLocation_MovableLocation']").val() == "") {
                        $(this).closest("tr").find("input[id^='tblAwbULDLocation_HdnAssignLocation']").attr("required", "required").css("cursor", "auto");
                        $(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").attr("required", "required").css("cursor", "auto");
                        $(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").focus();
                    }

                    if ($(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").val() == "" && $(this).closest("tr").find("input[id^='tblAwbULDLocation_MovableLocation']").val() != "") {
                        $(this).closest("tr").find("input[id^='tblAwbULDLocation_HdnAssignLocation']").removeAttr("required").css("cursor", "auto");
                        $(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").removeAttr("required").css("cursor", "auto");
                    }
                });
            });
        },
        afterRowAppended: function (tbWhole, parentIndex, addedRows) {
            $("table[id$='tblAwbULDLocation']").find("[id^='tblAwbULDLocation_Row_']").each(function (row, tr) {
                if (Number($(tr).attr("id").split("_")[2]) > addedRows) {
                    $(tr).find("label[id^=tblAwbULDLocation_AWBNo_]").text(CurrentAWBNo);
                    $(tr).find("input[id^=tblAwbULDLocation_HdnAWBNo_]").val(CurrentAWBNo);
                    $(tr).find("input[id^=tblAwbULDLocation_AWBSNo_]").val(currentawbsno);
                    $(tr).find("input[id^=tblAwbULDLocation_ArrivedShipmentSNo_]").val(currentArrivedShipmentSNo);
                    $(tr).find("label[id^=tblAwbULDLocation_RcvdPieces_]").text($("#tblAwbULDLocation_RcvdPieces_" + addedRows).text());
                    $(tr).find("label[id^=tblAwbULDLocation_RcvdGrossWeight_]").text($("#tblAwbULDLocation_RcvdGrossWeight_" + addedRows).text());
                    $(tr).find("input[id^=tblAwbULDLocation_HdnRcvdPieces_]").val($("#tblAwbULDLocation_RcvdPieces_" + addedRows).text());
                    $(tr).find("input[id^=tblAwbULDLocation_HdnRcvdGrossWeight_]").val($("#tblAwbULDLocation_RcvdGrossWeight_" + addedRows).text());
                }
            });

            if (userContext.SpecialRights.MOVIMPORT == false) {
                $("table[id$='tblAwbULDLocation']").find("[id^='tblAwbULDLocation_Row_']").each(function (row, tr) {
                    $(tr).find("input[id^=tblAwbULDLocation_MovableLocation_]").hide();
                    $(tr).find("input[id^=tblAwbULDLocation_HdnMovableLocation_]").hide();
                    $(tr).find("input[id^=tblAwbULDLocation_MovableLocation_]").closest("td").hide();
                    $("td[title='Movable Location']").hide();
                    $("table[id$='tblAwbULDLocation']").find('tr').find('td:nth-child(11)').hide()
                });
            }

            if (typeof (userContext.SpecialRights.MOVIMPORT) === "undefined") {
                $("table[id$='tblAwbULDLocation']").find("[id^='tblAwbULDLocation_Row_']").each(function (row, tr) {
                    $(tr).find("input[id^=tblAwbULDLocation_MovableLocation_]").hide();
                    $(tr).find("input[id^=tblAwbULDLocation_HdnMovableLocation_]").hide();
                    $(tr).find("input[id^=tblAwbULDLocation_MovableLocation_]").closest("td").hide();
                    $("td[title='Movable Location']").hide();
                    $("table[id$='tblAwbULDLocation']").find('tr').find('td:nth-child(11)').hide()
                });
            }
        }, afterRowRemoved: function (caller, rowIndex) {
            var countindex = 0;
            $("select[id^='tblAwbULDLocation_TempControlled']").each(function (i, el) {
                var ind = $(this).attr('id').split('_')[2];
                var rowAWBULDCount = $("#tblAwbULDLocation").find("input[id^=tblAwbULDLocation_StartPieces_]").length;
                countindex = countindex + 1;

                if (countindex == rowAWBULDCount) {
                    $("#tblAwbULDLocation_StartPieces_" + ind).removeAttr("disabled", true).css("cursor", "not-allowed");
                    $("#tblAwbULDLocation_EndPieces_" + ind).removeAttr("disabled", true).css("cursor", "not-allowed");
                    $("#tblAwbULDLocation_HAWB_" + ind).data("kendoAutoComplete").enable(true);
                }
            });
        }
    });

    $("#tblAwbULDLocation_rowOrder").closest("td").append("<input type='button' id='btnsaveLocation' value='Save' class='incompleteprocess' onclick='SaveAWBULDLocation();' />");
    $("#tblAwbULDLocation_rowOrder").closest("tr").css("display", "block");
    $('#tblAwbULDLocation tr:nth-child(2) td:first').text('SNo');
}

function CheckHAWB(obj) {
    var houseNo = $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HAWB']").val();
    var houseLastIndex = $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HAWB']").val().lastIndexOf('-');
    var housePieces = houseNo.substring(houseLastIndex + 1, houseNo.length);
    $(obj).closest("tr").find("input[id^='tblAwbULDLocation_StartPieces']").val("");
    $(obj).closest("tr").find("input[id^='_temptblAwbULDLocation_StartPieces']").val("");
    $(obj).closest("tr").find("input[id^='tblAwbULDLocation_EndPieces']").val(housePieces);
    $(obj).closest("tr").find("input[id^='_temptblAwbULDLocation_EndPieces']").val(housePieces);
}

function CheckSPHC(obj) {
    $(obj).closest("td").find("div > ul").css("width", "163px");
}

function CheckFAStartEndPieces(obj) {
    var cValue = $(obj).val();
    var startPieces = parseInt($(obj).closest("tr").find("input[id^='tblAwbULDLocation_StartPieces']").val());
    var endPieces = parseInt($(obj).closest("tr").find("input[id^='tblAwbULDLocation_EndPieces']").val());
    var rcvdPieces = $("#tblAwbULDLocation_RcvdPieces_1").text();
    var houseNo = $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HAWB']").val();
    var houseLastIndex = $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HAWB']").val().lastIndexOf('-');
    var housePieces = houseNo.substring(houseLastIndex + 1, houseNo.length);
    var housesno = $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HdnHAWB']").val();
    var awbno = $("#tblAwbULDLocation_AWBNo_1").text();
    var hawbpieces = 0;
    var Dailyflightsno = 0;
    var CurDailyflightsno = 0;

    if (startPieces == 0) {
        ShowMessage("warning", "", "Pieces can not be zero");
        $(obj).closest("tr").find("input[id^='tblAwbULDLocation_StartPieces']").val('');
    }

    if (endPieces == 0) {
        ShowMessage("warning", "", "Pieces can not be zero");
        $(obj).closest("tr").find("input[id^='tblAwbULDLocation_EndPieces']").val('');
    }

    if (startPieces > endPieces) {
        $(obj).val('');
        ShowMessage("warning", "", "Start Pieces can not be greater than End Pieces");
    }

    if (houseNo != "") {
        var TotalPcs = 0;
        arrHAWB = [];
        arrList = [];
        $(obj).closest("table").find("tr[id^='tblAwbULDLocation_Row_']").each(function () {
            if ($(this).find("input[id^='tblAwbULDLocation_HAWB_']").val() != "" && $(this).find("input[id^='tblAwbULDLocation_EndPieces_']").val() != "") {
                var _HAWBNo = $(this).find("input[id^='tblAwbULDLocation_HAWB_']").val();
                var _HousePieces = parseInt($(this).find("input[id^='tblAwbULDLocation_EndPieces_']").val());
                var _HouseSNo = parseInt($(this).find("input[id^='tblAwbULDLocation_HdnHAWB_']").val());
                arrHAWB.push(
                    {
                        HAWBNo: _HAWBNo,
                        HousePieces: _HousePieces,
                        HouseSNo: _HouseSNo

                    });
                if ((arrList.length > 0 && $.inArray(_HAWBNo, arrList) == - 1) || arrList.length == 0)
                    arrList.push(
                        _HAWBNo
                    );
            }
        });

        if (arrHAWB != null && arrHAWB.length > 0) {
            for (var k = 0; k <= arrList.length - 1; k++) {
                {
                    housePieces1 = 0;
                    for (var i = 0; i < arrHAWB.length; i++) {
                        if (arrList[k] == arrHAWB[(arrHAWB.length - 1)]["HAWBNo"]) {
                            if (arrHAWB[(i)]["HAWBNo"] == arrHAWB[(arrHAWB.length - 1)]["HAWBNo"]) {
                                TotalPcs = TotalPcs + parseInt(arrHAWB[i]["HousePieces"]);
                            }
                        }
                    }
                }
            }
        }

        var arrivedshipmentsno = $(obj).closest("tr").find("input[id^='tblAwbULDLocation_ArrivedShipmentSNo']").val();
        $.ajax({
            url: "Services/Import/InboundFlightService.svc/GetHousePieces", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AWBNo: awbno, Hawbno: housesno, ArrivedShipmentSno: currentArrivedShipmentSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                var resData1 = Data.Table1;

                if (resData && resData.length > 0) {
                    hawbpieces = resData[0].Pieces;
                    Dailyflightsno = resData[0].DailyFlightSNo;
                }

                if (resData1 && resData1.length > 0) {
                    CurDailyflightsno = resData1[0].DailyFlightSNo;
                }
            },
        });

        var totalrecpices = parseInt(housePieces) - parseInt(hawbpieces)
        if (parseInt(TotalPcs) > parseInt(totalrecpices)) {
            $(obj).val('');
            ShowMessage("warning", "", "Entered Pieces can not be greater than House Pieces");
            return;
        }

        var TotalPcs = 0;
    }
    else {

        if (parseInt(cValue) > parseInt(rcvdPieces)) {
            $(obj).val('');
            ShowMessage("warning", "", "Entered Pieces can not be greater than Received Pieces");
            return;
        }

        var count = 0;
        if ($("#tblAwbULDLocation > tbody").children.length > 1) {
            var totalpcs = 0;
            $("#tblAwbULDLocation").find("input[id^='tblAwbULDLocation_AssignLocation']").each(function () {
                count = count + 1;
                var aEnd = $(this).parents("tr").find("input[type='text'][id^='tblAwbULDLocation_EndPieces']").val();
                if (aEnd != "" && aEnd != "0") {
                    totalpcs = parseInt(totalpcs) + parseInt(aEnd);
                }

                if (rcvdPieces < totalpcs) {
                    $(this).parents("tr").find("input[type='text'][id^='tblAwbULDLocation_EndPieces']").val('');
                    $(this).parents("tr").find("input[type='text'][id^='_temptblAwbULDLocation_EndPieces']").val('');
                    ShowMessage("warning", "", "Entered Pieces can not be greater than Received Pieces");
                    return false;
                }
            });
        }
    }
}

function CheckFATempratureStartEnd(obj) {
    $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HdnAssignLocation']").val("");
    $(obj).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").val("");
    var startVal = parseInt($(obj).closest("tr").find("input[id^='tblAwbULDLocation_StartTemperature']").val());
    var endVal = parseInt($(obj).closest("tr").find("input[id^='tblAwbULDLocation_EndTemperature']").val());
    if (startVal > endVal) {
        $(obj).val('');
        ShowMessage("warning", "", "End temperature should be greater than start temperature.");
    }
}

function CheckMovableLocation(obj) {
    var hdnMovableLocation = $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HdnMovableLocation']").val();
    var movableLocation = $(obj).closest("tr").find("input[id^='tblAwbULDLocation_MovableLocation']").val();
    var hdnAssignLocation = $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HdnAssignLocation']").val();
    var assignLocation = $(obj).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").val();
    if ((hdnMovableLocation != "0" && movableLocation != "") && (hdnAssignLocation == "" && assignLocation == "")) {
        $(obj).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation_']").data("kendoAutoComplete").enable(false);
        $(obj).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation_']").val("");
        $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HdnAssignLocation_']").val('0');
    }
    else if ((hdnMovableLocation == "0" && movableLocation == "") && (hdnAssignLocation != "" && assignLocation != "")) {
        $(obj).closest("tr").find("input[id^='tblAwbULDLocation_MovableLocation']").data("kendoAutoComplete").enable(false);
        $(obj).closest("tr").find("input[id^='tblAwbULDLocation_MovableLocation']").val("");
        $(obj).closest("tr").find("input[id^='tblAwbULDLocation_HdnMovableLocation']").val('0');
    }
}

function SaveAWBULDLocation() {
    var res = $("#tblAwbULDLocation tr[id^='tblAwbULDLocation']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
    getUpdatedRowIndex(res, 'tblAwbULDLocation');
    var data = JSON.parse(($('#tblAwbULDLocation').appendGrid('getStringJson')));
    var AssignLocationBool = true;
    var totalpices = parseInt(data[0].HdnRcvdPieces)

    $("input[id^=tblAwbULDLocation_StartTemperature]").each(function () {
        if ($(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").val() == "" && $(this).closest("tr").find("input[id^='tblAwbULDLocation_MovableLocation']").val() == "") {
            $(this).closest("tr").find("input[id^='tblAwbULDLocation_HdnAssignLocation']").attr("required", "required").css("cursor", "auto");
            $(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").attr("required", "required").css("cursor", "auto");
            $(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").focus();
            AssignLocationBool = false;
        }

        if ($(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").val() == "" && $(this).closest("tr").find("input[id^='tblAwbULDLocation_MovableLocation']").val() != "") {
            $(this).closest("tr").find("input[id^='tblAwbULDLocation_HdnAssignLocation']").removeAttr("required").css("cursor", "auto");
            $(this).closest("tr").find("input[id^='tblAwbULDLocation_AssignLocation']").removeAttr("required").css("cursor", "auto");
        }
        return AssignLocationBool;
    });

    if (AssignLocationBool == false)
        return;

    for (var i = 0; i < data.length; i++) {
        if (data[i].AssignLocation != "" && data[i].MovableLocation == "") {
            data[i].HdnMovableLocation = 0;
        }

        if (data[i].AssignLocation == "" && data[i].MovableLocation != "") {
            data[i].HdnAssignLocation = 0;
        }

        if (data[i].HdnLocSNo == "") {
            data[i].HdnLocSNo = 0;
        }

        if (data[i].HdnEndPieces == "") {
            data[i].HdnEndPieces = 0;
        }
    }

    // required field validation
    if ($("[id = 'tblAwbULDLocation'] tr [id^='tblAwbULDLocation_HAWB_']").val() != "")
        $("[id = 'tblAwbULDLocation'] tr [id^='tblAwbULDLocation_HAWB_']").attr('required', 'required');
    else
        $("[id = 'tblAwbULDLocation'] tr [id^='tblAwbULDLocation_HAWB_']").removeAttr('required');

    if (!validateTableData('tblAwbULDLocation', res)) {
        return false;
    }

    var awbsno = data[0].AWBSNo;
    var hawbcounter = 0;
    $.ajax({
        url: "Services/Import/InboundFlightService.svc/CheckHAwb", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNo: parseInt(awbsno) }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.Table0;
            var totalassignpieces = 0;
            if (resData && resData.length > 0) {
                if (resData[0].ErrorNumber == "9000") {
                    for (var j = 0; j < data.length; j++) {
                        totalassignpieces = parseInt(totalassignpieces) + parseInt(data[j].EndPieces);
                        if (data[j].HdnHAWB == "" || data[j].HdnHAWB == "0") {
                            ShowMessage('warning', 'Location ', "HAWB is mandatory.", "bottom-right");
                            hawbcounter = 1;
                        }
                    }

                    if (parseInt(totalassignpieces) > parseInt(totalpices)) {
                        ShowMessage('warning', 'Location ', "Location Pieces can't be more than Receive Pieces.", "bottom-right");
                        hawbcounter = 1;
                    }
                }
            }
        }
    });

    if (hawbcounter == 1) {
        return;
    }

    if (data != false) {
        $.ajax({
            url: "./Services/Import/InboundFlightService.svc/createUpdateAwbULDLocation", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            beforeSend: function () {
                $("input[id^='btnsaveLocation']").attr('disabled', true)
            },
            success: function (result) {
                if (result == "<value>AWB Location Added Successfully.</value>") {
                    $("#tblAwbULDLocation").data("kendoWindow").close();
                    //GetFlightArrivalGrid();
                    GetHouseWiseData("Text_HAWB", $("#Text_HAWB").val(), "HAWB", $("#HAWB").val());
                    DTRIndex = "";
                    DTRIndex = $(DTR).parent().parent().parent().parent().parent().parent().closest('tr').prev().index();
                    ShowMessage('success', 'Success', "Location assigned successfully.");
                }
                else {
                    return;
                }
            },
            complete: function () {
                $("input[id^='btnsaveLocation']").attr('disabled', true)
            }
        });
    }
}

function SaveChargeNote() {
    var flag = true;
    var HandlingChargeArray = [];
    var Mode = $('input:radio[id="CustomerType"]:checked').val() == undefined ? $("#divDetail2").find("span[id*='spnPaymentType']").text() : $('input:radio[id="CustomerType"]:checked').val() == 0 ? "CASH" : "CREDIT";
    var BillToSNo = (Mode == "CASH" ? 0 : $("#divDetail2").find("input[id*='BillTo']").val());
    var BillTo = (Mode == "CASH" ? $("#divDetail2").find("input[id^='BillToText']").val() : $("#divDetail2").find("input[id*='Text_BillTo']").val());
    $("div[id$='divareaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function () {
        if ($(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key() != "") {
            var HandlingChargeViewModel = {
                SNo: $(this).find("td[id^='tdSNoCol']").html(),
                AWBSNo: currentawbsno,
                WaveOff: 0,
                TariffCodeSNo: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key(),
                TariffHeadName: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").value(),
                pValue: parseFloat($(this).find("[id^='PValue']").val()),
                sValue: parseFloat($(this).find("[id^='SValue']").val()),
                Amount: parseFloat($(this).find("span[id^='Amount']").text()),
                TotalTaxAmount: $(this).find("span[id^='TotalTaxAmount']").text(),
                TotalAmount: $(this).find("span[id^='TotalAmount']").text(),
                Rate: $(this).find("span[id^='Rate']").text() ? $(this).find("span[id^='Rate']").text() : 0,
                Min: 1,
                Mode: Mode,
                ChargeTo: 0,
                pBasis: $(this).find("[id^='PBasis']").text(),
                sBasis: $(this).find("[id^='SBasis']").text(),
                Remarks: $(this).find("[id^='Remarks']").val() + '|' + $(this).find("[id^='PartSNo']").val(),
                DescriptionRemarks: $(this).find("span[id^='_DescriptionRemarks_']").text() || "",
                TaxPercent: $(this).find("span[id^='_TaxPercent_']").text() || "",
            };
            HandlingChargeArray.push(HandlingChargeViewModel);
        }
    });

    if (BillTo == "") {
        ShowMessage('warning', 'Warning - Charge Note', "Bill To is mandatory.", "bottom-right");
        flag = false;
    }

    if (HandlingChargeArray.length > 0) {
        if (flag == true) {
            $.ajax({
                url: "Services/Import/DeliveryOrderService.svc/SaveChargeNote", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ strData: btoa(JSON.stringify({ PDSNo: DLVSNo, BillToSNo: BillToSNo, BillTo: BillTo, lstHandlingCharges: HandlingChargeArray })) }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result != "") {
                        InvoiceNo = result;
                        ShowMessage('success', 'Success - Charge Note', "Processed Successfully", "bottom-right");
                        $("#btnSave").unbind("click");
                        $(".ui-dialog-buttonset").find("button")[0].disabled = true;
                        $(".ui-dialog-buttonset").find("button")[1].disabled = false;
                        flag = true;
                    }
                    else {
                        ShowMessage('warning', 'Warning', "Please correct value(s) for :- " + result + ".", "bottom-right");
                        flag = false;
                    }
                    BindPhysicalDO();
                    $('#divDetail2').dialog('close');
                },
                error: function (xhr) {
                    ShowMessage('warning', 'Warning - Charge Note', "DO No. [" + curDO + "] -  unable to process.", "bottom-right");
                }
            });
        }
    }
    else {
        ShowMessage('warning', 'Warning - Delivery Order', 'Select Charges First.', " ", "bottom-right");
    }
    return flag;
}

function CheckAgentCreditLimit(valueId, value, keyId, key) {
    if ($('span#TotalAmountDO').text() != "0") {
        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/CheckAgentCreditLimit",
            async: false, type: "get", dataType: "json", cache: false,
            data: { AgentSNo: key },
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var agentData = Data.Table0;
                if (agentData.length > 0 && agentData[0] != 'undefined') {
                    if (parseInt($('span#TotalAmountDO').text()) > parseInt(agentData[0].RemainingCreditLimit)) {
                        ShowMessage('warning', 'Information!', "Available credit limit is below minimum credit limit", "bottom-right");
                        $("#Text_BillTo").data("kendoAutoComplete").setDefaultValue("", "");
                        $('input:radio[id="CustomerType"]').filter('[value="0"]').attr('checked', true, 'enabled', true);
                        $("#Text_BillTo").data("kendoAutoComplete").setDefaultValue("", "");
                        $("#BillToText").val('');
                        $("#BillToText").show();
                        flag = false;
                        return false;
                        // Added By rahul on 03-01-2017 for DO - Bill To Dropdown - checks & conditions for Bill To dropdown incase of Credit if credit limit is less the radio button will move to checked cash
                    }
                    else {
                        flag = true;

                        $("#Text_BillTo").data("kendoAutoComplete").setDefaultValue(agentData[0].AccountSNo, agentData[0].accountname)
                        $("#BillToText").val(agentData[0].AccountSNo);
                        // $("#Text_BillTo").data("kendoAutoComplete").enable(false);
                        $("#Text_BillTo").attr("title", $("#Text_BillTo").val());
                    }
                }
                else {
                    ShowMessage('warning', 'Information!', "Available credit limit is below minimum credit limit", "bottom-right");
                    $("#Text_BillTo").data("kendoAutoComplete").setDefaultValue("", "");
                    $('input:radio[id="CustomerType"]').filter('[value="0"]').attr('checked', true, 'enabled', true);
                    $("#Text_BillTo").data("kendoAutoComplete").setDefaultValue("", "");
                    $("#BillToText").val('');
                    $("#BillToText").show();
                    flag = false;
                    return false;
                }
            },
            error: {
            }
        });
        if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "GA") {
            $("#btnGetCharges").closest('table').css('display', 'none')
            $("#BillToText").removeAttr("data-valid").removeAttr("data-valid-msg");
        }
        else {
            $("#btnGetCharges").closest('table').css('display', 'block')
        }
    }
    else {
        if (userContext.SysSetting.ICMSEnvironment.toUpperCase() == "JT" && IsDoChargeApplicable == 1) {
            if ($("span[id='DORRemainingPieces']").text() != "0") {
                ShowMessage('warning', 'Information!', "Please get charges first", "bottom-right");
                $("#Text_BillTo").data("kendoAutoComplete").setDefaultValue("", "");
                return false;
            }
        }
        else if (userContext.SysSetting.ICMSEnvironment.toUpperCase() != "JT") {
            if ($("span[id='DORRemainingPieces']").text() != "0") {
                ShowMessage('warning', 'Information!', "Please get charges first", "bottom-right");
                $("#Text_BillTo").data("kendoAutoComplete").setDefaultValue("", "");
                return false;
            }
        }
    }
}

function BindDeliveryOrder(awbType, shipmentType, DOType) {
    totalHandlingCharges = 0;
    totalAmountDO = 0;
    $('.k-datepicker').css('width', '150px');
    cfi.AutoCompleteByDataSource("PaymentType", SearchChargeDataSource, HideCCCharges);
    cfi.AutoCompleteV2("HAWB", "HAWBNo,TotalPieces", "DeliveryOrder_HAWB", GetHouseWiseData, "contains", null, null, null, null, null, null, null, true);
    cfi.AutoCompleteV2("BillTo", "Name", "DeliveryOrder_BillTo", CheckAgentCreditLimit, "contains");
    cfi.AutoCompleteV2("ParticipantName", "Name,IdCardNo", "DeliveryOrder_ParticipantName", null, "contains");
    cfi.AutoCompleteByDataSource("CustomerType", CustomerDataSource, HideCCCharges);
    cfi.AutoCompleteV2("SPHCType", "SPHCCode", "DeliveryOrder_SPHCTrans", ClearCharges, "contains", ",");
    $("#Text_PaymentType").closest("span").css('background-color', 'green');

    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/GetDeliveryOrderRecord?AWBSNo=" + currentawbsno + "&ArrivedShipmentSNo=" + currentArrivedShipmentSNo + "&DOType=" + DOType + "&DestCity=" + currentdetination + "&POMailSNo=" + currentPomailSno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var resData = jQuery.parseJSON(result);
            var doData = resData.Table0;
            var sdData = resData.Table1;
            var rDate = resData.Table2;
            var freightData = resData.Table3;
            var doDataDetail = resData.Table4;
            var fdData = resData.Table5;
            var dorData = resData.Table6;
            var bupData = resData.Table7;
            var gstData = resData.Table8;
            var IsCompleteShipment = 0;
            if (doData.length > 0) {
                var doItem = doData[0];
                $("span[id='ConsigneeName']").text(doItem.ConsigneeName);
                $("span[id='DONo']").text(doItem.DONo);
                $("span[id='Notify']").text(doItem.Notify);
                $("span[id='Date']").text(doItem.Date);
                $("span[id='AWBNo']").text(doItem.AWBNo);
                $("span[id='WareHouseLocation']").text(doItem.WarehouseLocation);
                $("span[id='InitialPaymentType']").text(doItem.InitialPaymentType);

                if (doItem.InitialPaymentType == "CC") {
                    $("#Text_PaymentType").data("kendoAutoComplete").setDefaultValue(0, "CC");
                    $("table[id^='__tbldo__']")[2].hidden = false;

                    $('input:radio[id="CustomerType"]').removeAttr('disabled');
                }
                else {
                    $("table[id^='__tbldo__']")[2].hidden = true;
                    $("#Text_PaymentType").data("kendoAutoComplete").setDefaultValue(1, "PP");
                }

                $("#Text_PaymentType").attr("disabled", "disabled");
                $("#RctNo").val(doItem.RctNo);
                $("#RctDate").data("kendoDatePicker").value(doItem.RctDate);
                IsCompleteShipment = doItem.IsCompleteShipment;
                $("input[id^='DOType']").eq(doItem.IsCompleteShipment).attr('checked', true)

                if (userContext.SpecialRights.DOFOC == true)
                    $("#IsFOC").show();
                else
                    $("#IsFOC").hide();

                if (doItem.IsCompleteShipment == 1) {
                    $('input:radio[id="DOType"]').attr("disabled", "disabled");
                }
                else {
                    $('input:radio[id="DOType"]').removeAttr('disabled');
                }

                $("input[id^='DOType']").closest("td").html("");

                if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "UK") {
                    $("#StateCode").closest("td").prev("td").show();
                    $("#StateCode").closest("td").show();
                    $("#StateCode").show();
                    $("#GSTNo").show();
                    cfi.AutoCompleteV2("StateCode", "StateCode,StateName", "GSTState", null, "contains");
                    $("#Text_StateCode").css("width", "100px");
                    if (gstData != undefined)
                        $("#Text_StateCode").data("kendoAutoComplete").setDefaultValue(gstData[0].GSTCode, gstData[0].GSTCode);
                    $("#GSTNo").val(doItem.GSTNo);
                }
                else {
                    $("#StateCode").hide();
                    $("#GSTNo").hide();
                    $("#StateCode").closest("td").prev("td").hide();
                    $("#StateCode").closest("td").hide();
                }
            }

            /****************Flight Detail*************************************/
            FlightDetail = [];
            if (fdData != []) {
                $(fdData).each(function (row, i) {
                    FlightDetail.push({ "pieces": i.pieces, "_tempPieces": i.pieces, "uldpieces": i.uldpieces, "totalpieces": i.totalpieces, "grossweight": i.grossweight, "uldgrossweight": i.uldgrossweight, "_tempGrossWeight": i.grossweight, "totalgrossweight": i.totalgrossweight, "sphc": i.sphc, "description": i.description, "flightdetails": i.flightdetails, "dailyflightsno": i.dailyflightsno, "list": 1 });
                });
            }

            cfi.makeTrans("import_doflightdetail", null, null, null, null, null, fdData);
            if (parseInt(FlightDetail.length) != 0) {
                $("div[id$='areaTrans_import_doflightdetail']").find("[id^='areaTrans_import_doflightdetail']").each(function (i, row) {
                    $(this).find("span[id^='TotalPieces']").first().text(FlightDetail[i].pieces + '/' + FlightDetail[i].uldpieces + '/' + FlightDetail[i].totalpieces);
                    $(this).find("span[id^='TotalGrossWeight']").first().text(FlightDetail[i].grossweight + '/' + FlightDetail[i].uldgrossweight + '/' + FlightDetail[i].totalgrossweight);
                    $(this).find("div[id^='transActionDiv']").hide();
                });
            }

            var totalPieces = 0;

            /****************Shipment Type Detail*************************************/
            ShipmentDetail = [];
            if (sdData != []) {
                $(sdData).each(function (row, i) {
                    ShipmentDetail.push({ "pieces": i.pieces, "_tempPieces": i.pieces, "uldpieces": i.uldpieces, "totalpieces": i.totalpieces, "grossweight": i.grossweight, "uldgrossweight": i.uldgrossweight, "_tempGrossWeight": i.grossweight, "totalgrossweight": i.totalgrossweight, "sphc": i.sphc, "description": i.description, "flightdetails": i.flightdetails, "dailyflightsno": i.dailyflightsno, "list": 1 });
                });
            }

            tempShipment = $("#divareaTrans_import_doshipmenttypedetail").html();
            cfi.makeTrans("import_doshipmenttypedetail", null, null, null, null, null, sdData);
            if (ShipmentDetail.length > 0) {
                $("div[id$='areaTrans_import_doshipmenttypedetail']").find("[id^='areaTrans_import_doshipmenttypedetail']").each(function (i, row) {
                    $(this).find("input[id^='ULDNo']").each(function () {
                        cfi.AutoCompleteV2($(this).attr("name"), "ULDNo", "DeliveryOrder_vDOULD", GetBupDetails, "contains", ",");
                    });
                    //Added By rahul to handle shipment details for 
                    if (bupData[0].IsBup == '1') {
                        $('#Text_ULDNo').data("kendoAutoComplete").enable(false);
                    }
                    totalPieces = Number(totalPieces) + Number(ShipmentDetail[i]._tempPieces);
                    $("#" + $(this).find("span").find("input[id*='BulkPcs']")[0].id).val(ShipmentDetail[i]._tempPieces);
                    $("#" + $(this).find("span").find("input[id*='BulkPcs']")[1].id).val(ShipmentDetail[i].pieces);
                    $(this).find("span[id^='Slas']").text("/");
                    $(this).find("span[id^='BupPcs']").text("0");
                    $(this).find("span[id^='TotalPieces']").text(ShipmentDetail[i].totalpieces);
                    $(this).find("span[id^='TotalBulkPieces']").text(ShipmentDetail[i].pieces);
                    $("#" + $(this).find("span").find("input[id*='BulkGrWt']")[0].id).val(ShipmentDetail[i]._tempGrossWeight);
                    $("#" + $(this).find("span").find("input[id*='BulkGrWt']")[1].id).val(ShipmentDetail[i].grossweight);
                    $(this).find("span[id^='TotalBulkGrWt']").text(ShipmentDetail[i].grossweight);
                    $(this).find("span[id^='BupGrWt']").text("0");
                    $(this).find("span[id^='TotalGrossWeight']").text(ShipmentDetail[i].totalgrossweight);
                    $(this).find("td:eq(5)").hide();
                    $(this).find("span[id^='TotalBulkPieces']").hide();
                    $(this).find("span[id^='TotalBulkGrWt']").hide();
                    $(this).find("div[id^='transActionDiv']").hide();

                    if ($("#Text_PaymentType").data("kendoAutoComplete").key() == 0) {
                        $(this).find("input[id^='BulkPcs']").data("kendoNumericTextBox").enable(false);
                        $(this).find("input[id^='BulkGrWt']").data("kendoNumericTextBox").enable(false);
                    }
                    else {
                        $(this).find("input[id^='BulkPcs']").data("kendoNumericTextBox").enable(true);
                        $(this).find("input[id^='BulkGrWt']").data("kendoNumericTextBox").enable(true);
                    }

                    if ($("input:radio[id='DOType']:checked").val() == 1) {
                        $(this).find("input[id^='BulkPcs']").data("kendoNumericTextBox").enable(true);
                        $(this).find("input[id^='BulkGrWt']").data("kendoNumericTextBox").enable(true);
                    }
                    else {
                        $(this).find("input[id^='BulkPcs']").data("kendoNumericTextBox").enable(false);
                        $(this).find("input[id^='BulkGrWt']").data("kendoNumericTextBox").enable(false);
                    }
                });
            }

            if ($("#Text_PaymentType").val() == "CC") {
                $('input:radio[id="DOType"]').attr("disabled", "disabled");
            }
            else if ($("#Text_PaymentType").val() == "PP" && Number(IsCompleteShipment) == 1) {
                $('input:radio[id="DOType"]').attr("disabled", "disabled");
            }
            else {
                $('input:radio[id="DOType"]').removeAttr('disabled');
            }

            if (parseInt(fdData.length) != 0) {
                chwt = fdData[0].grossweight;
            }

            /****************Remarks*************************************/
            if (rDate.length > 0) {
                $("span[id='Remarks']").text(rDate[0].Remarks);
                var RushHandling = rDate[0].RushHandling;
                if (RushHandling == "True") {
                    $("input[id^='RushHandling']").attr('checked', true);
                    $('#RushHandling').prop('disabled', 'disabled');
                }
                else {
                    $("input[id^='RushHandling']").attr('checked', false);
                    $('#RushHandling').prop('enable', 'enable'); //rushhandling radio button enabled in case of non rush arrive replaced by rahul as per Gulsan sir new Mail Condition 22-09-2017
                }
            }

            if (dorData.length > 0) {
                $("span[id='DORTotalPieces']").text(dorData[0].TotalPieces);
                $("span[id='DORDOPieces']").text(dorData[0].DOPieces);
                $("span[id='DORRemainingPieces']").text(dorData[0].RemainingPieces);
            }

            temp = $("#divareaTrans_import_dohandlingcharge").html();
            cfi.makeTrans("import_dohandlingcharge", null, null, BindChargeAutoComplete, ReBindChargeAutoComplete, null, null);
            $("div[id$='divareaTrans_import_dohandlingcharge']").hide();
            if ($("table[id^='__tbldo__']").length > 4)
                $("table[id^='__tbldo__']")[4].hidden = true;
            totalAmountDO = parseFloat(totalAmountDO) + parseFloat(totalHandlingCharges);

            if (freightData.length > 0) {
                var freightItem = freightData[0];
                $("span[id='TotalFreight']").text(freightItem.TotalFreight);
                $("span[id='TotalDueCarrier']").text(freightItem.TotalDueCarrier);
                $("span[id='TotalDueAgent']").text(freightItem.TotalDueAgent);
                $("span[id='CCCFeeAtDestination']").text(freightItem.CCCFeeAtDestination);
                $("span[id='ValuationCharge']").text(freightItem.ValuationCharge);
                $("span[id='Tax']").text(freightItem.Tax);
                $("span[id='Insurance']").text(freightItem.Insurance);
                $("span[id='HandlingCharges']").text(totalHandlingCharges);
                totalAmountDO = Number(freightItem.TotalAmount) > 0 ? Number(freightItem.TotalAmount) : (parseFloat(totalAmountDO) + parseFloat(freightItem.TotalFreight) + parseFloat(freightItem.TotalDueCarrier) + parseFloat(freightItem.TotalDueAgent) + parseFloat(freightItem.CCCFeeAtDestination) + parseFloat(freightItem.ValuationCharge) + parseFloat(freightItem.Tax) + parseFloat(freightItem.Insurance));
                currencyConversionRate = Number(freightItem.ExchangeRate);
                $("span[id='TotalAmountOrigCurrency']").text(freightItem.CCCFeeAtDestination + '   ' + freightItem.OrigCurrency);

                if ($('span[id="InitialPaymentType"]').text().toUpperCase() == "PP") {
                    $("span[id='TotalAmountDestCurrency']").text((Number(totalAmountDO) * Number(currencyConversionRate)).toFixed(3) + '   ' + freightItem.DestCurrency + '               ');
                }
                else {
                    $("span[id='TotalAmountDestCurrency']").text((freightItem.CCCFeeAtDestination * Number(currencyConversionRate)).toFixed(3) + '   ' + freightItem.DestCurrency + '               ');
                }
                $("span[id='TotalAmountDestCurrency']").after("<a href=\"#\" style=\"text-decoration: none;\" onclick=\"OpenPopUp(" + freightItem.OrigCurrencySNo + "," + freightItem.DestCurrencySNo + ", 0, 0, 'ER',0,0,0,0);\"><b>Exchange Rate</b></a>");
            }

            $("span[id='TotalAmountDO']").text((Number(totalAmountDO) * Number(currencyConversionRate)).toFixed(3));

            if (Boolean(parseInt($("#PaymentType").val())) == true) {
                $("table[id^='__tbldo__']")[2].hidden = true;
                $('input:radio[id="CustomerType"]').removeAttr('disabled');
            }
            else {
                $("table[id^='__tbldo__']")[2].hidden = false;
                $('input:radio[id="CustomerType"]').attr("disabled", "disabled");
            }

            if (doDataDetail.length > 0) {
                $("#Text_CustomerType").data("kendoAutoComplete").setDefaultValue(doDataDetail[0].CustomerTypeSNo, doDataDetail[0].CustomerType);
                var strVar = "";
                strVar += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr style=\"background-color: #C0C0C0\"><tbody class=\"ui-widget-content\"><td class=\"ui-state-active caption formSection\" align=\"left\" colspan=\"11\">Delivery Order Details<\/td><\/tr>";
                strVar += "<tr style=\"font-weight: bold\">";
                strVar += (userContext.SysSetting.ICMSEnvironment.toUpperCase() == "JT" ? "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Delivered<\/td>" : "") + "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">CustomerType<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO Date<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Air Waybill Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Pieces<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Gross Weight<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Total Charges<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Charges Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Participant Name<\/td><td style=\"padding-left: 5px; width: 250px\" class=\"ui-widget-header\">Action<\/td><\/tr>";

                for (var i = 0; i < doDataDetail.length; i++) {
                    strVar += (userContext.SysSetting.ICMSEnvironment.toUpperCase() == "JT" ? "<td class=\"ui-widget-content\"><input dfsno=" + doDataDetail[i].DOSNo + " id=\"chkOFW_" + i + "\" type=\"checkbox\" value=\"" + doDataDetail[i].IsDelivered + "\"  " + (doDataDetail[i].IsDelivered == '1' ? 'disabled' : '') + "  onclick=\"Disable(this)\"\"><\/td>" : "") + "<td class=\"ui-widget-content\">" + doDataDetail[i].CustomerType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DeliveryOrderNo + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DeliveryOrderDate + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].WaybillType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DOPieces + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DOGrossWeight + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].TotalCharges + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].ChargesType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].ParticipantName + "<\/td><td class=\"ui-widget-content\">";
                    if (doDataDetail[i].IsCancel == 0) {
                        strVar += "<input id=\"btnPrint\" type=\"button\" value=\"DO Print \" onclick=\"PrintSlip('DO'," + doDataDetail[i].DOSNo + ");\">";
                        strVar += "&nbsp;<input id=\"btnPrint\" type=\"button\" style=\"Display:none;\" value=\"Pre-Printed DO\" onclick=\"PrintSlip('DOPrint'," + doDataDetail[i].DOSNo + ");\">";
                        if (userContext.SysSetting.ClientEnvironment.toUpperCase() != "TH")
                            strVar += "&nbsp;<input id=\"btnLocation\" type=\"button\" value=\"DO Location\" onclick=\"OpenPopUp('Warehouse Location');\">";
                    }
                    else {
                        strVar += "<input id=\"btnPrint\" type=\"button\" style=\"background-color:red;color:white;\" value=\"DO Print\" onclick=\"PrintSlip('DO'," + doDataDetail[i].DOSNo + ");\">";
                        strVar += "&nbsp;<input id=\"btnPrint\" type=\"button\" style=\"background-color:red;color:white;Display:none;\" value=\"Pre-Printed DO\" onclick=\"PrintSlip('DOPrint'," + doDataDetail[i].DOSNo + ");\">";
                        if (userContext.SysSetting.ClientEnvironment.toUpperCase() != "TH")
                            strVar += "&nbsp;<input id=\"btnLocation\" type=\"button\" value=\"DO Location\" onclick=\"OpenPopUp('Warehouse Location');\">";
                    }
                    strVar += "<\/td><\/tr>";
                }
                strVar += "<\/tbody><\/table>";
                strVar += "<\/br>";
                $('#divDetail3').html(strVar);

                if (doDataDetail[0].CustomerType.toUpperCase() == "WALKIN") {
                    $("[type='radio'][id='CustomerType'][value='1']").attr('disabled', true);
                    $("[type='radio'][id='CustomerType'][value='1']").attr('checked', false);
                    $('[type="radio"][id="CustomerType"][value="0"]').attr('checked', true);
                    $('[type="radio"][id="CustomerType"][value="0"]').click()
                }
                else
                    $("[type='radio'][id='CustomerType'][value='1']").attr('disabled', false);
            }
            else {
                if (userContext.SysSetting.ICMSEnvironment.toUpperCase() == 'JT') {
                    $("#Text_CustomerType").data("kendoAutoComplete").setDefaultValue("2", "WALKIN");
                }
                else
                    $("#Text_CustomerType").data("kendoAutoComplete").setDefaultValue("1", "REGULAR");
            }

            if ($("[id^='CustomerType']").is(':disabled') == true ? "CASH" : $('input:radio[id="CustomerType"]:checked').val() == 0 ? "CASH" : "CREDIT" == "CASH") {
                $("#Text_BillTo").data("kendoAutoComplete").enable(false);
                $("#Text_BillTo").removeAttr("data-valid").removeAttr("data-valid-msg");
                $("#BillToText").show();
                $("#BillToText").attr("data-valid", "required").attr("data-valid-msg", "Enter Bill To.");
                if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "GA") {
                    $("#btnGetCharges").closest('table').css('display', 'none')
                    $("#BillToText").removeAttr("data-valid").removeAttr("data-valid-msg");
                }
                else {
                    $("#btnGetCharges").closest('table').css('display', 'block')
                }

                if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "TH") {
                    $("#BillToText").removeAttr("data-valid").removeAttr("data-valid-msg");
                }
            }
            else {
                if ($("#Text_BillTo").data("kendoAutoComplete") != undefined) {
                    $("#Text_BillTo").data("kendoAutoComplete").enable(true);
                    $("#Text_BillTo").attr("data-valid", "required").attr("data-valid-msg", "Select Bill To.");
                }
                $("#BillToText").hide();
                $("#BillToText").removeAttr("data-valid").removeAttr("data-valid-msg");

                if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "TH") {
                    $("#BillToText").removeAttr("data-valid").removeAttr("data-valid-msg");
                }
            }

            if ($("#Text_CustomerType").data("kendoAutoComplete").key() == 1) {
                if ($("#Text_ParticipantName").data("kendoAutoComplete") != undefined) {
                    $("#Text_ParticipantName").data("kendoAutoComplete").enable(true);
                }
                $("#AuthorizedPersonId").closest("tr").hide();
                $("#AuthorizedPersonCompany").closest("tr").hide();
            }
            else {
                $("#Text_ParticipantName").data("kendoAutoComplete").enable(false);
                $("#AuthorizedPersonId").closest("tr").show();
                $("#AuthorizedPersonCompany").closest("tr").show();
                if (userContext.SysSetting.ICMSEnvironment == "JT") {
                    $("#AuthorizedPersonId").attr("data-valid", "required").attr("data-valid-msg", "Enter Authorized Person Id.");
                    $("#AuthorizedPersonName").attr("data-valid", "required").attr("data-valid-msg", "Enter Authorized Person Name.");
                    $("#AuthorizedPersonCompany").attr("data-valid", "required").attr("data-valid-msg", "Enter Authorized Person Company.");
                }
            }

            if (userContext.SysSetting.ICMSEnvironment.toUpperCase() == 'GA') {
                $("#__divdo__").find("table:eq(0)").find("tbody").find("tr:eq(0)").find("td").append("<table align=\"right\"><tr><td><span id=\"RushHandling\"><b>Rush Handling</b></span>&nbsp;<input id=\"chkRushHandling\" type=\"checkbox\"\"></td></tr></table>");
                if (rDate.length > 0) {
                    var RushHandling = rDate[0].RushHandling;
                    if (RushHandling == "True") {
                        $("input[id^='chkRushHandling']").attr('checked', true);
                        $('#chkRushHandling').prop('disabled', 'disabled');
                    }
                    else {
                        $("input[id^='chkRushHandling']").attr('checked', false);
                        $('#chkRushHandling').prop('enable', 'enable');
                    }
                }
            }
        },
        error: function (ex) {
            var ex = ex;
        }
    });

    //Added By Rahul **********
    $('#btnSearch').attr('tabindex', '10');
    $('#Text_CustomerType').attr('tabindex', '11');
    $('#RctNo').attr('tabindex', '12');
    $('#RctDate').attr('tabindex', '13');
    $('#WareHouseLocation').attr('tabindex', '14');
    $('#Text_HAWB').attr('tabindex', '15');
    $('#Text_SPHCType').attr('tabindex', '16');
    $('#IsFOC').attr('tabindex', '17');
    $('#IsStorage').attr('tabindex', '18');
    $('#ULDNo').attr('tabindex', '19');
    $('#btnGetCharges').attr('tabindex', '20');
    $('#RushHandling').attr('tabindex', '21');
    $('#DO_Remarks').attr('tabindex', '22');
    $('#CustomerType').attr('tabindex', '23');
    $('#Text_BillTo').attr('tabindex', '24');
    $('#BillToText').attr('tabindex', '25');
    $('#Text_ParticipantName').attr('tabindex', '26');
    $('#btnSave').attr('tabindex', '27');
    $('#btnCancel').attr('tabindex', '28');
}

function AuthenticateShipmenrDetail(obj) {
    var id = obj.id;
    $("#divareaTrans_import_dohandlingcharge").html(temp);
    $("div[id$='divareaTrans_import_dohandlingcharge']").hide();
    if ($("table[id^='__tbldo__']").length > 4)
        $("table[id^='__tbldo__']")[4].hidden = true;
    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/BindShipmentDetail",
        async: false, type: "get", dataType: "json", cache: false,
        data: { AWBSNo: currentawbsno, ArrivedShipmentSNo: currentArrivedShipmentSNo, DOType: $("#" + id).is(":checked") == false ? 0 : 1 },
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var fdData = Data.Table0;
            ShipmentDetail = [];
            if (fdData != []) {
                $(fdData).each(function (row, i) {
                    ShipmentDetail.push({ "pieces": i.pieces, "_tempPieces": i.pieces, "uldpieces": i.uldpieces, "totalpieces": i.totalpieces, "grossweight": i.grossweight, "uldgrossweight": i.uldgrossweight, "_tempGrossWeight": i.grossweight, "totalgrossweight": i.totalgrossweight, "sphc": i.sphc, "description": i.description, "flightdetails": i.flightdetails, "dailyflightsno": i.dailyflightsno, "list": 1 });
                });
            }

            if (fdData.length > 0) {
                var totalPieces = 0;
                $("#divareaTrans_import_doshipmenttypedetail").html(tempShipment);
                cfi.makeTrans("import_doshipmenttypedetail", null, null, null, null, null, fdData);

                $("div[id$='areaTrans_import_doshipmenttypedetail']").find("[id^='areaTrans_import_doshipmenttypedetail']").each(function (i, row) {
                    $(this).find("input[id^='ULDNo']").each(function () {
                        cfi.AutoCompleteV2($(this).attr("name"), "ULDNo", "DeliveryOrder_AuthenticateShipDetail", GetBupDetails, "contains", ",");
                    });

                    totalPieces = Number(totalPieces) + Number(ShipmentDetail[i]._tempPieces);
                    $("#" + $(this).find("span").find("input[id*='BulkPcs']")[0].id).val(ShipmentDetail[i]._tempPieces);
                    $("#" + $(this).find("span").find("input[id*='BulkPcs']")[1].id).val(ShipmentDetail[i].pieces);
                    $(this).find("span[id^='Slas']").text("/");
                    $(this).find("span[id^='BupPcs']").text("0");
                    $(this).find("span[id^='TotalPieces']").text(ShipmentDetail[i].totalpieces);
                    $(this).find("span[id^='TotalBulkPieces']").text(ShipmentDetail[i].pieces);
                    $("#" + $(this).find("span").find("input[id*='BulkGrWt']")[0].id).val(ShipmentDetail[i]._tempGrossWeight);
                    $("#" + $(this).find("span").find("input[id*='BulkGrWt']")[1].id).val(ShipmentDetail[i].grossweight);
                    $(this).find("span[id^='TotalBulkGrWt']").text(ShipmentDetail[i].grossweight);
                    $(this).find("span[id^='BupGrWt']").text("0");
                    $(this).find("span[id^='TotalGrossWeight']").text(ShipmentDetail[i].totalgrossweight);
                    $(this).find("td:eq(5)").hide();
                    $(this).find("span[id^='TotalBulkPieces']").hide();
                    $(this).find("span[id^='TotalBulkGrWt']").hide();
                    $(this).find("div[id^='transActionDiv']").hide();

                    if ($("#PaymentType").val() == 0) {
                        $(this).find("input[id^='BulkPcs']").prop("disabled", true);
                        $(this).find("input[id^='BulkGrWt']").prop("disabled", true);
                        $(this).find("input[id^='_tempBulkPcs']").prop("disabled", true);
                        $(this).find("input[id^='_tempBulkGrWt']").prop("disabled", true);
                    }
                    else {
                        $(this).find("input[id^='BulkPcs']").prop("disabled", false);
                        $(this).find("input[id^='BulkGrWt']").prop("disabled", false);
                        $(this).find("input[id^='_tempBulkPcs']").prop("disabled", false);
                        $(this).find("input[id^='_tempBulkGrWt']").prop("disabled", false);
                    }
                    $(this).find("input[id^='BulkPcs']").show();
                    $(this).find("input[id^='BulkGrWt']").show();
                    $(this).find("input[id^='_tempBulkPcs']").hide();
                    $(this).find("input[id^='_tempBulkGrWt']").hide();
                });

                $("div[id$='areaTrans_import_doshipmenttypedetail']").find("[id^='areaTrans_import_doshipmenttypedetail']").each(function (i, row) {
                    if ($("input:radio[id='DOType']:checked").val() == 1) {
                        $(this).find("input[id^='BulkPcs']").prop("disabled", false);
                        $(this).find("input[id^='BulkGrWt']").prop("disabled", false);
                        $(this).find("input[id^='_tempBulkPcs']").prop("disabled", false);
                        $(this).find("input[id^='_tempBulkGrWt']").prop("disabled", false);
                    }
                    else {
                        $(this).find("input[id^='BulkPcs']").prop("disabled", true);
                        $(this).find("input[id^='BulkGrWt']").prop("disabled", true);
                        $(this).find("input[id^='_tempBulkPcs']").prop("disabled", true);
                        $(this).find("input[id^='_tempBulkGrWt']").prop("disabled", true);
                    }
                });
            }
        }
    });
    $('#Text_ULDNo').attr('tabindex', '19');
    $('#BulkPcs').attr('tabindex', '20');
    $('#BulkGrWt').attr('tabindex', '21');
}

function ClearCharges() {
    if ($("div[id$='divareaTrans_import_dohandlingcharge']").is(':visible')) {
        var currAmount = Number(totalAmountDO) > 0 ? parseFloat(totalAmountDO) - parseFloat(totalHandlingCharges) : parseFloat(totalAmountDO);
        $("span[id='TotalAmountDO']").text(currAmount.toFixed(3));
        totalHandlingCharges = 0;
        $("#divareaTrans_import_dohandlingcharge").html(temp);
        $("div[id$='divareaTrans_import_dohandlingcharge']").hide();
        if ($("table[id^='__tbldo__']").length > 4)
            $("table[id^='__tbldo__']")[4].hidden = true;
    }
}

function AuthenticateBillTo(obj) {
    var id = obj.id;
    if ($("[id^='" + id + "']").is(':disabled') == true ? "CASH" : $("input:radio[id='" + id + "']:checked").val() == 0 ? "CASH" : "CREDIT" == "CASH") {
        $("#Text_BillTo").data("kendoAutoComplete").setDefaultValue("", "");
        $("#Text_BillTo").data("kendoAutoComplete").enable(false);
        $("#Text_BillTo").removeAttr("data-valid").removeAttr("data-valid-msg");
        $('#spanbillto').show();
        $("#BillToText").val('');
        $("#BillToText").show();
        $("#BillToText").attr("data-valid", "required").attr("data-valid-msg", "Enter Bill To.");
        if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "GA") {
            $("#btnGetCharges").closest('table').css('display', 'none')
            $("#BillToText").removeAttr("data-valid").removeAttr("data-valid-msg");
        }
        else {
            $("#btnGetCharges").closest('table').css('display', 'block')
        }
    }
    else {
        $('#spanbillto').hide();
        if ($("#Text_BillTo").data("kendoAutoComplete") != undefined) {
            $("#Text_BillTo").data("kendoAutoComplete").enable(true);
            $("#Text_BillTo").attr("data-valid", "required").attr("data-valid-msg", "Select Bill To.");
        }
        $("#BillToText").hide();
        $("#BillToText").removeAttr("data-valid").removeAttr("data-valid-msg");

        //*************start BY Rahul on 10-01-2018  **************************
        // //added by rahul to add participants id with bill to in credit DO
        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/GetBillToForworderName",
            async: false, type: "get", dataType: "json", cache: false,
            data: { AWBSNo: currentawbsno },
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var billData = Data.Table0;
                if (billData.length > 0 && billData[0] != 'undefined') {
                    $("#Text_BillTo").data("kendoAutoComplete").setDefaultValue(billData[0].AccountSNo, billData[0].accountname)
                    $("#BillToText").val(billData[0].AccountSNo);
                    // $("#Text_BillTo").data("kendoAutoComplete").enable(false);
                    $("#Text_BillTo").attr("title", $("#Text_BillTo").val());
                    checkTransaction = billData[0].TransactionType;
                    //Added By rahul on 30-1-2018 from Bill TO Condition Check if agent is credit agent or not 
                    if (checkTransaction != 1) {
                        ShowMessage('warning', 'Warning !', "" + billData[0].accountname + " is not a Credit Customer .", "bottom-right");
                        $('[type="radio"][id="CustomerType"][value="0"]').attr('checked', true);

                        if ($("#Text_BillTo").data("kendoAutoComplete") != undefined) {
                            $("#Text_BillTo").data("kendoAutoComplete").setDefaultValue('', '')
                            $("#Text_BillTo").data("kendoAutoComplete").enable(false);
                            $("#Text_BillTo").attr("title", '');
                        }
                        $("#BillToText").show();
                        $("#BillToText").val('');
                        $("#BillToText").attr("data-valid", "required");
                        $("#BillToText").attr("data-valid-msg", "Enter Bill To.");
                        if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "GA") {
                            $("#btnGetCharges").closest('table').css('display', 'none')
                            $("#BillToText").removeAttr("data-valid").removeAttr("data-valid-msg");
                        }
                        else {
                            $("#btnGetCharges").closest('table').css('display', 'block')
                        }
                    }
                }
                else {
                    $('[type="radio"][id="CustomerType"][value="0"]').attr('checked', true);
                    if ($("#Text_BillTo").data("kendoAutoComplete") != undefined) {
                        $("#Text_BillTo").data("kendoAutoComplete").setDefaultValue('', '')
                        $("#Text_BillTo").data("kendoAutoComplete").enable(false);
                        $("#Text_BillTo").attr("title", '');
                    }
                    $("#BillToText").show();
                    $("#BillToText").val('');
                    $("#BillToText").attr("data-valid", "required");
                    $("#BillToText").attr("data-valid-msg", "Enter Bill To.");
                    if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "GA") {
                        $("#btnGetCharges").closest('table').css('display', 'none')
                        $("#BillToText").removeAttr("data-valid").removeAttr("data-valid-msg");
                    }
                    else {
                        $("#btnGetCharges").closest('table').css('display', 'block')
                    }
                }
            },
            error: {
            }
        });
        //*************start BY Rahul on 10-01-2018  **************************
        //end
    }
}

function GetBupDetails(valueId, value, keyId, key) {
    var id = valueId;
    var index = keyId.split("_")[1];
    var keyValue = key;
    var uldFlag = true;
    $("#" + id).closest("td").find("div").find("li").each(function () {
        if ($(this).find("span").text() == keyValue) {
            $("#" + id).data("kendoAutoComplete").setDefaultValue("", "");
            uldFlag = false;
            return false;
        }
    });

    if (uldFlag == true) {
        if (id.indexOf("Text_ULDNo") >= 0) {
            $.ajax({
                url: "Services/Import/DeliveryOrderService.svc/GetBupDetails?AWBSNo=" + parseInt(currentawbsno) + "&ULDStockSNo=" + parseInt(key),
                async: false, type: "GET", dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var resData = jQuery.parseJSON(result);
                    if (index == undefined) {
                        BupGrWt = Number($("span[id='BupGrWt']").text()) + Number(resData[0].GrossWeight);
                        BupPcs = Number($("span[id='BupPcs']").text()) + Number(1);
                        $("span[id='BupGrWt']").text(BupGrWt);
                        $("span[id='BupPcs']").text(BupPcs);
                    }
                    else {
                        BupGrWt = Number($("span[id='BupGrWt_" + index + "']").text()) + Number(resData[0].GrossWeight);
                        BupPcs = Number($("span[id^='BupPcs_" + index + "']").text()) + Number(1);
                        $("span[id='BupGrWt_" + index + "']").text(BupGrWt);
                        $("span[id^='BupPcs_" + index + "']").text(BupPcs);
                    }
                },
                error: function (ex) {
                    var ex = ex;
                }
            });
        }

        if (id.indexOf("Text_PDULDNo") >= 0) {
            $.ajax({
                url: "Services/Import/DeliveryOrderService.svc/GetBupDetails?AWBSNo=" + parseInt(currentawbsno) + "&ULDStockSNo=" + parseInt(key),
                async: false, type: "GET", dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var resData = jQuery.parseJSON(result);
                    BupGrWt = Number($("span[id='BupGrWt']").text()) + Number(resData[0].GrossWeight);
                    BupPcs = Number($("span[id='BupPcs']").text()) + Number(1);
                    $("span[id='BupGrWt']").text(BupGrWt);
                    $("span[id='BupPcs']").text(BupPcs);
                },
                error: function (ex) {
                    var ex = ex;
                }
            });
        }
    }
}

function AutoCompleteDeleteCallBack(e, div, textboxid) {
    if (textboxid.indexOf("Text_SPHCType") >= 0) {
        ClearCharges();
    }

    if (textboxid.indexOf("Text_ULDNo") >= 0) {
        var id = $(e.target).attr("id");// get current Span.
        var DivId = div; // get div id.
        var textboxid = textboxid; // get textbox id.
        var index = textboxid.split("_")[2];
        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/GetBupDetails?AWBSNo=" + parseInt(currentawbsno) + "&ULDStockSNo=" + parseInt(id),
            async: false, type: "GET", dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var resData = jQuery.parseJSON(result);
                var GrossWt = resData[0].GrossWeight;
                if (index == undefined) {
                    BupGrWt = Number($("span[id='BupGrWt']").text()) - Number(resData[0].GrossWeight);
                    BupPcs = Number($("span[id='BupPcs']").text()) - Number(1);
                    $("span[id='BupGrWt']").text(BupGrWt);
                    $("span[id='BupPcs']").text(BupPcs);
                }
                else {
                    BupGrWt = Number($("span[id='BupGrWt_" + index + "']").text()) - Number(resData[0].GrossWeight);
                    BupPcs = Number($("span[id^='BupPcs_" + index + "']").text()) - Number(1);
                    $("span[id='BupGrWt_" + index + "']").text(BupGrWt);
                    $("span[id^='BupPcs_" + index + "']").text(BupPcs);
                }
            },
            error: function (ex) {
                var ex = ex;
            }
        });
    }

    if (textboxid.indexOf("Text_PDULDNo") >= 0) {
        var id = $(e.target).attr("id");// get current Span.
        var DivId = div; // get div id.
        var textboxid = textboxid; // get textbox id.
        var index = textboxid.split("_")[2];
        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/GetBupDetails?AWBSNo=" + parseInt(currentawbsno) + "&ULDStockSNo=" + parseInt(id),
            async: false, type: "GET", dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var resData = jQuery.parseJSON(result);
                var GrossWt = resData[0].GrossWeight;
                BupGrWt = Number($("span[id='BupGrWt']").text()) - Number(resData[0].GrossWeight);
                BupPcs = Number($("span[id='BupPcs']").text()) - Number(1);
                $("span[id='BupGrWt']").text(BupGrWt);
                $("span[id='BupPcs']").text(BupPcs);
            },
            error: function (ex) {
                var ex = ex;
            }
        });
    }
}

function GetChargesGA(obj, id) {

    $("div[id$='divareaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (row, tr) {
        $(tr).find("input[id^='Discount']").each(function () {
            $(this).each(function () {
                //enable percent
                $(this).parent().next('td').children('input').attr('disabled', false)
            });
        });

        $(tr).find("input[id^='DisTa']").each(function () {
            $(this).each(function () {

                //enable percent
                $(this).parent().next('td').children('input').attr('disabled', false);

            });
        });

        $(tr).find("input[id^='DiscountPercent']").each(function () {
            $(this).each(function () {
                //enable amount
                $(this).parent().prev('td').children('input').attr('disabled', false);
            });
        });

        $(tr).find("input[id^='DisTaPer']").each(function () {
            $(this).each(function () {
                //enable amount
                $(this).parent().prev('td').children('input').attr('disabled', false)
            });
        });
    });


    $('#divareaTrans_import_dohandlingcharge').show()



    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/CheckWaybillDetail?AWBNo=" + currentawbsno + "&ArrivedShipmentSNo=" + currentArrivedShipmentSNo + "&ICNNo=" + currentPomailSno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result != "") {
                var resData = jQuery.parseJSON(result);
                var checkData = resData.Table0;
                var IsLocation = checkData[0].IsLocation;
                var IsArrived = checkData[0].IsArrived;

                if (IsArrived == 0 && IsLocation == 0) {
                    ShowMessage('warning', 'Warning - Delivery Order', 'Location is mandatory for Delivery Order.', " ", "bottom-right");
                    return false;
                }

            }
        }
    });

    ChargesDosno = obj;
    CheckChargesid = id.id.split('_')[1];
    var pieces = 0,
        grossWt = 0,
        partNumber = 0,
        flag = true,
        ArrivedPieces = 0,
        ULDPieces = 0,
        TotalPieces = 0,
        GrossWeight = 0,
        ULDGrossWeight = 0,
        TotalGrossWeight = 0,
        ShipmentType = "";
    TotalAmountDO = 0;
    IsRushHandling = "";

    IsRushHandling = "RSH=" + ($("#RushHandling_" + id.id.split('_')[1]).is(':checked') ? 1 : 0);

    var currAmount = Number(totalAmountDO) > 0 ? parseFloat(totalAmountDO) - parseFloat(totalHandlingCharges) : parseFloat(totalAmountDO);
    $("span[id='TotalAmountDO']").text(currAmount.toFixed(3));
    totalHandlingCharges = 0;

    var hawb = 0//$("#Text_HAWB").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_HAWB").data("kendoAutoComplete").key();
    var SPHCTransSNo = 0//$("#Text_SPHCType").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_SPHCType").data("kendoAutoComplete").key();
    var ShipmentDetailArray = [];
    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/GetDoSaveInfo",
        async: false, type: "get", dataType: "json", cache: false,
        data: { AWBSNo: currentawbsno, DOSNo: obj },
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.Table0;
            hawb = resData[0].hawb;
            SPHCTransSNo = resData[0].SPHCTransSNo;


            pieces = Number(pieces) + Number(resData[0].Pieces);
            grossWt = Number(grossWt) + Number(resData[0].GrossWeight);
            var ShipmentDetailViewModel = {
                PartNumber: Number(partNumber) + 1,
                AWBSNo: currentawbsno == 0 ? currentPomailSno : currentawbsno,
                HAWBSNo: hawb,
                PartSNo: resData[0].PartSNo,
                Pieces: Number(resData[0].Pieces),
                GrossWeight: Number(resData[0].GrossWeight),
                VolumeWeight: 0,
                IsBUP: 0,
                SPHCSNo: 0,
                SPHCTransSNo: SPHCTransSNo
            };
            ShipmentDetailArray.push(ShipmentDetailViewModel);

        }
    });

    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/GetAndCheckCompleteShipment",
        async: false, type: "get", dataType: "json", cache: false,
        data: { AWBSNo: currentawbsno, HAWBSNo: hawb },
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.Table0;
            var sphcData = Data.Table1;
            if (resData.length > 0) {
                ArrivedPieces = resData[0].ArrivedPieces;
                ULDPieces = resData[0].ULDPieces;
                TotalPieces = resData[0].TotalPieces;
                GrossWeight = resData[0].GrossWeight;
                ULDGrossWeight = resData[0].ULDGrossWeight;
                TotalGrossWeight = resData[0].TotalGrossWeight;
                ShipmentType = resData[0].ShipmentType;

                if ((ShipmentType == "T" || ShipmentType == "S") && Number(TotalPieces) == Number(ArrivedPieces) && Number(TotalGrossWeight) != Number(GrossWeight)) {
                    ShowMessage('warning', 'Warning', "Please arrive complete shipment to proceed with DO ", "bottom-right");
                    flag = true;
                }
                else if ((ShipmentType == "P" || ShipmentType == "D") && Number(TotalPieces) == Number(ArrivedPieces) && Number(TotalGrossWeight) != Number(GrossWeight)) {
                    ShowMessage('warning', 'Warning', "FWB gross weight should be equal to Arrival gross weight for delivery order .", "bottom-right");
                    flag = true;
                }
            }

            if (sphcData.length > 0 && Number(SPHCTransSNo) == 0) {
                ShowMessage('warning', 'Warning', "Please select SHC Sub Group.", "bottom-right");
                flag = false;
            }
        }
    });

    if ((ShipmentType == "P" || ShipmentType == "D") && Number(pieces) != Number(TotalPieces)) {
        ShowMessage('warning', 'Warning - Delivery Order', 'Part DO charges will be applicable for part shipment delivery order.', " ", "bottom-right");
    }

    if (currentPomailSno > 0) {
        if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length != 0) {
            subprocesssno = 3521;
            ProcessSNo = 17;
        }

        if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length == 0 && $("div[id$='areaTrans_import_doflightdetail']").length != 0) {
            subprocesssno = 3521;
            ProcessSNo = 17;
        }

        if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length == 0 && $("div[id$='areaTrans_import_doflightdetail']").length == 0) {
            subprocesssno = 3533;
            ProcessSNo = 17;
        }
    }
    else if (subprocesssno == 2146) {
        subprocesssno = 2146;
        ProcessSNo = 22;
    }
    else {
        if (userContext.SysSetting.ICMSEnvironment == "GA")
            subprocesssno = 2135;
        else
            subprocesssno = parseInt(subprocesssno);
        ProcessSNo = 22;
    }

    if (flag == true) {
        if (Number(pieces) > 0 && Number(grossWt) > 0) {
            $.ajax({
                url: "Services/Import/DeliveryOrderService.svc/GetCharges", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ TariffSNo: parseInt(0), AWBSNo: currentawbsno == 0 ? currentPomailSno : currentawbsno, CityCode: currentdetination, HAWBSNo: hawb, ProcessSNo: ProcessSNo, SubProcessSNo: subprocesssno, GrWT: parseFloat(grossWt), ChWt: parseFloat(grossWt), pValue: parseFloat(0), sValue: parseFloat(0), Pieces: parseInt(pieces), DOSNo: parseInt(0), PDSNo: parseInt(0), lstShipmentInfo: ShipmentDetailArray, Remarks: IsRushHandling, POMailSNo: parseInt(currentPomailSno) }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var resData = jQuery.parseJSON(result);
                    var hcData = resData.Table0;

                    MendatoryHandlingCharges = [];
                    if (hcData != []) {
                        $(hcData).each(function (row, i) {
                            if (i.isMandatory == 1) {
                                MendatoryHandlingCharges.push({ "type": "M", "chargename": i.TariffSNo, "text_chargename": i.TariffCode, "pbasis": i.PrimaryBasis, "pvalue": i.pValue, "sbasis": i.SecondaryBasis, "svalue": i.sValue, "amount": i.ChargeAmount, "totaltaxamount": i.TotalTaxAmount, "totalamount": i.TotalAmount, "remarks": i.ChargeRemarks.toUpperCase().replace(/<BR>/g, ""), "rate": i.Rate, IsEditableUnit: i.IsEditableUnit, "list": 1, "PartSNo": i.PartSNo, "DescriptionRemarks": i.DescriptionRemarks, "TaxPercent": i.TaxPercent });
                                totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat(i.TotalAmount)
                            }
                        });
                    }

                    $("div[id$='divareaTrans_import_dohandlingcharge']").show();

                    var PopupTable = $("[id^='__divpayment__']").last();

                    if ($("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").length > 1)
                        $("#divareaTrans_import_dohandlingcharge").html(temp);
                    else
                        temp = $("#divareaTrans_import_dohandlingcharge").html();

                    cfi.makeTrans("import_dohandlingcharge", null, null, BindChargeAutoComplete, ReBindChargeAutoComplete, null, MendatoryHandlingCharges);

                    if (MendatoryHandlingCharges.length > 0) {
                        $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                            $(this).find("span[id^='PBasis']").closest("td").find("input[id^='_tempPValue']").val(MendatoryHandlingCharges[i].pvalue);
                            $(this).find("span[id^='PBasis']").closest("td").find("input[id^='PValue']").val(MendatoryHandlingCharges[i].pvalue);
                            $(this).find("span[id^='PBasis']").text(MendatoryHandlingCharges[i].pbasis);
                            $(this).find("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").val(MendatoryHandlingCharges[i].svalue);
                            $(this).find("span[id^='SBasis']").closest("td").find("input[id^='SValue']").val(MendatoryHandlingCharges[i].svalue);
                            $(this).find("span[id^='SBasis']").text(MendatoryHandlingCharges[i].sbasis);
                            $(this).find("input[id^='DescriptionRemarks']").closest('td').append("&nbsp;&nbsp;<span id=_DescriptionRemarks_" + i + ">" + MendatoryHandlingCharges[i].DescriptionRemarks + "</span>");
                            $(this).find("input[id^='TaxPercent']").closest('td').append("&nbsp;&nbsp;<span id=_TaxPercent_" + i + ">" + MendatoryHandlingCharges[i].TaxPercent + "</span>");
                        });

                        $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                            $(this).find("[id^='WaveOff']").after("<a href='#' id='waveofRemark' style='text-decoration:none;display:none;color:red' maxlength='200' onclick='BindwaveRemarks(this,event);return false;'>Remarks</a><input type='hidden' id='hdnremark' name='hdnremark' value=''>");
                            $(this).find("[id^='PValue']").after("<input type='hidden' id='PartSNo' name='PartSNo' value=''>");

                            $(this).find("span[id^='Remarks']").text($(this).find("span[id^='Remarks']").text().substring(0, 50));
                            $(this).find("span[id^='Remarks']").closest('td').hover(function () {
                                $(this).prop('title', $(this).find("input[id^='Remarks']").val());
                            });
                        });

                        $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                            $(this).find("[id^='PValue']").closest('td').find("[id^='PartSNo']").val(MendatoryHandlingCharges[i].PartSNo);
                        });
                    }

                    $("div[id$='divareaTrans_import_dohandlingcharge']").find("[id='areaTrans_import_dohandlingcharge']").each(function () {
                        $(this).find("input[id^='ChargeName']").each(function () {
                            if (currentPomailSno > 0) {
                                if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length != 0) {
                                    subprocesssno = 3521;
                                    ProcessSNo = 17;
                                }
                                if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length == 0 && $("div[id$='areaTrans_import_doflightdetail']").length != 0) {
                                    subprocesssno = 3521;
                                    ProcessSNo = 17;
                                }
                                if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length == 0 && $("div[id$='areaTrans_import_doflightdetail']").length == 0) {
                                    subprocesssno = 3533;
                                    ProcessSNo = 17;
                                }
                            }
                            else if (subprocesssno == 2146) {
                                subprocesssno = 2146;
                                ProcessSNo = 22;
                            }
                            else if (subprocesssno == 2136) {
                                subprocesssno = 2136;
                                ProcessSNo = 22;
                            }
                            else {
                                subprocesssno = 2135;
                                ProcessSNo = 22;
                            }
                            AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIEInbound", "", currentawbsno == 0 ? currentPomailSno : currentawbsno, 0, currentdetination, 1, hawb, "2", ShipmentDetailArray, ProcessSNo, subprocesssno, "No");
                        });
                    });

                    $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                        if (MendatoryHandlingCharges.length > 0) {
                            $(this).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").enable(false);
                            $(this).find("input[id^='Text_ChargeName']").closest('td').hover(function () {
                                $(this).prop('title', $(this).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").value());
                            });

                            if (MendatoryHandlingCharges[i].IsEditableUnit == "1") {
                                $(this).find("span[id^='PBasis']").closest("td").find("input").prop("disabled", false);
                                $(this).find("span[id^='SBasis']").closest("td").find("input").prop("disabled", false);
                            }
                            else {
                                $(this).find("span[id^='PBasis']").closest("td").find("input").attr("disabled", "disabled");
                                $(this).find("span[id^='SBasis']").closest("td").find("input").attr("disabled", "disabled");
                            }

                            if (MendatoryHandlingCharges.length - 1 == i) {
                                $(this).find("div[id^='transActionDiv']").show();
                                if (MendatoryHandlingCharges.length > 1)
                                    $(this).find("div[id^='transActionDiv']").find('i:eq(0)').hide();
                            }
                            $(this).find("[id^='WaveOff']").unbind("click").bind("click", function () {
                                EnableRemarks(this);
                            });
                        }
                        else {
                            $(this).find("span[id^='Type']").text("E");
                            $(this).find("input[id^='WaveOff']").hide();
                        }

                        if (MendatoryHandlingCharges.length > 0) {
                            if (MendatoryHandlingCharges[i].sbasis == undefined || MendatoryHandlingCharges[i].sbasis == "") {
                                $(this).find("span[id^='SBasis']").closest("td").find("input").css("display", "none");
                                $(this).find("span[id^='SBasis']").closest("td").find("span").css("display", "none");
                            }
                            else {
                                $(this).find("span[id^='SBasis']").closest("td").find("span").show();
                                $(this).find("span[id^='SBasis']").closest("td").find("input[id*='_tempSValue']").show();
                            }
                        }

                        if (MendatoryHandlingCharges.length > 0) {
                            if (MendatoryHandlingCharges[i].rate != "") {
                                $(this).find("span[id^='Rate']").closest("td").find("span").css("display", "none");
                            }
                            else {
                                $(this).find("span[id^='Rate']").closest("td").find("span").css("display", "none");
                            }
                            $(this).find("input[id^='DescriptionRemarks']").closest("td").css("display", "none");
                        }
                    });

                    totalHandlingCharges = 0;
                    $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                        if ($(this).find("[id^='WaveOff']").is(":checked") == false) {
                            totalHandlingCharges = Number(totalHandlingCharges) + Number($(this).find("td:eq(8)")[0].innerText);
                        }

                        if (subprocesssno != 2135)
                            $(this).find("span[id^='SBasis']").closest("td").find("span").css("display", "none");
                    });

                    if (MendatoryHandlingCharges.length > 1) {
                        $("div[id$='divareaTrans_import_dohandlingcharge']").show();
                        var currAmount = 0;
                        if ($("#Text_PaymentType").val() == "CC") {
                            currAmount = parseFloat(totalAmountDO);
                            $("span[id='HandlingCharges']").text(totalHandlingCharges);
                            $("span[id='TotalAmountDO']").text(currAmount.toFixed(3));
                            totalAmountDO = $("span[id='TotalAmountDO']").text();
                            totalAmountDO = parseFloat(totalAmountDO);
                        }
                        else {
                            $("span[id='TotalAmountDO']").text(currAmount.toFixed(3));
                            totalAmountDO = $("span[id='TotalAmountDO']").text();
                        }
                    }

                    if ($('span[id="InitialPaymentType"]').text().toUpperCase() == 'PP') {
                        $("span[id='TotalAmountDO']").text(((Number(totalAmountDO) * Number(currencyConversionRate)) + parseFloat(totalHandlingCharges)).toFixed(3));
                    }
                    else {
                        var total = parseFloat($("span[id='CCCFeeAtDestination']").text()) + parseFloat($("span[id='HandlingCharges']").text())
                        $("span[id='TotalAmountDO']").text(total);
                    }

                    if (Number(focCheckValue) > 0)
                        NillFOCCHarges(focCheckValue)

                    if (subprocesssno == 2135) {
                        if (userContext.SpecialRights.DOWaiveOff == false) {
                            $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                                $(row).find("input[id^='WaveOff']").hide();
                            });
                        }
                        else {
                            $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                                $(row).find("input[id^='WaveOff']").show();
                            });
                        }
                    }

                    $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                        if (userContext.SysSetting.ICMSEnvironment == "JT") {
                            $("#spnTaxPercent").hide();
                            $("#_TaxPercent_" + i).closest("td").css("display", "none");;
                        }
                        else {
                            $("#spnTaxPercent").show();
                            $("#_TaxPercent_" + i).closest("td").css("display", "block");;
                        }
                    });

                    if (userContext.SysSetting.ICMSEnvironment.toUpperCase() == "GA") {
                        $("#divDetail4").show();
                        $("#divDetail5").show();
                    }
                    registerDiscount(MendatoryHandlingCharges)
                },
                error: function (xhr) {
                    var ex = xhr;
                }
            });
        }
        else {
            ShowMessage('warning', 'Warning', "Please correct value(s) pieces, Any one of BULK and BUP must be greater than 0.", "bottom-right");
            return false;
        }
    }
}

function GetCharges(obj) {
    var pieces = 0,
        grossWt = 0,
        partNumber = 0,
        flag = true,
        ArrivedPieces = 0,
        ULDPieces = 0,
        TotalPieces = 0,
        GrossWeight = 0,
        ULDGrossWeight = 0,
        TotalGrossWeight = 0,
        ShipmentType = "";
    TotalAmountDO = 0;
    IsRushHandling = "";

    //RushHandling = $('#RushHanding :checked').val();
    //Added By Rahul on 13 Nov 2017 as discussed with Gulasan sir as Bug Refrence 4735
    //Add Check for IsLocationMandatoryOnImport from system setting when IsLocationMandatoryOnImport is 1 then location is mandatory
    if (IsLocationOnGetCharges == "0" && $("#RushHandling").is(':checked') == false && parseInt(userContext.SysSetting.IsLocationMandatoryOnImport) == 1) {
        if (userContext.SysSetting.ClientEnvironment != 'UK' && userContext.SysSetting.ClientEnvironment != 'G8') {
            ShowMessage('warning', 'Warning - Delivery Order', 'Location is mandatory for Delivery Order.', " ", "bottom-right");
            return false;
        }
    }

    IsRushHandling = "RSH=" + ($("input[id=RushHandling]").is(':checked') || $("#chkRushHandling").is(':checked') ? 1 : 0); //($("#RushHandling").is(':checked') ? 1 : 0);

    var currAmount = Number(totalAmountDO) > 0 ? parseFloat(totalAmountDO) - parseFloat(totalHandlingCharges) : parseFloat(totalAmountDO);
    $("span[id='TotalAmountDO']").text(currAmount.toFixed(3));
    totalHandlingCharges = 0;

    var hawb = $("#Text_HAWB").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_HAWB").data("kendoAutoComplete").key();
    var SPHCTransSNo = $("#Text_SPHCType").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_SPHCType").data("kendoAutoComplete").key();

    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/GetAndCheckCompleteShipment",
        async: false, type: "get", dataType: "json", cache: false,
        data: { AWBSNo: currentawbsno, HAWBSNo: hawb },
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.Table0;
            var sphcData = Data.Table1;
            if (resData.length > 0) {
                ArrivedPieces = resData[0].ArrivedPieces;
                ULDPieces = resData[0].ULDPieces;
                TotalPieces = resData[0].TotalPieces;
                GrossWeight = resData[0].GrossWeight;
                ULDGrossWeight = resData[0].ULDGrossWeight;
                TotalGrossWeight = resData[0].TotalGrossWeight;
                ShipmentType = resData[0].ShipmentType;

                if ((ShipmentType == "T" || ShipmentType == "S") && Number(TotalPieces) == Number(ArrivedPieces) && Number(TotalGrossWeight) != Number(GrossWeight)) {
                    ShowMessage('warning', 'Warning', "Please arrive complete shipment to proceed with DO ", "bottom-right");
                    flag = true;
                }
                else if ((ShipmentType == "P" || ShipmentType == "D") && Number(TotalPieces) == Number(ArrivedPieces) && Number(TotalGrossWeight) != Number(GrossWeight)) {
                    ShowMessage('warning', 'Warning', "FWB gross weight should be equal to Arrival gross weight for delivery order .", "bottom-right");
                    flag = true;
                }
            }

            if (sphcData.length > 0 && Number(SPHCTransSNo) == 0) {
                ShowMessage('warning', 'Warning', "Please select SHC Sub Group.", "bottom-right");
                flag = false;
            }
        }
    });

    var ShipmentDetailArray = [];
    $("div[id$='areaTrans_import_doshipmenttypedetail']").find("[id^='areaTrans_import_doshipmenttypedetail']").each(function (i, row) {
        pieces = Number(pieces) + Number($(this).find("span[id^='BupPcs']").text()) + Number($(this).find("input[id^='_tempBulkPcs']").val());
        grossWt = Number(grossWt) + Number($(this).find("span[id^='BupGrWt']").text()) + Number($(this).find("input[id^='_tempBulkGrWt']").val());
        var ShipmentDetailViewModel = {
            PartNumber: Number(partNumber) + 1,
            AWBSNo: currentawbsno == 0 ? currentPomailSno : currentawbsno,
            HAWBSNo: hawb,
            PartSNo: $(this).find("span[id^='DailyFlightSNo']").text(),
            Pieces: Number($(this).find("span[id^='BupPcs']").text()) + Number($(this).find("input[id^='_tempBulkPcs']").val()),
            GrossWeight: Number($(this).find("span[id^='BupGrWt']").text()) + Number($(this).find("input[id^='_tempBulkGrWt']").val()),
            VolumeWeight: 0,
            IsBUP: Number($(this).find("span[id^='BupPcs']").text()) > 0 ? 1 : 0,
            SPHCSNo: 0,
            SPHCTransSNo: SPHCTransSNo
        };
        ShipmentDetailArray.push(ShipmentDetailViewModel);
    });

    if ((ShipmentType == "P" || ShipmentType == "D") && Number(pieces) != Number(TotalPieces)) {
        ShowMessage('warning', 'Warning - Delivery Order', 'Part DO charges will be applicable for part shipment delivery order.', " ", "bottom-right");
    }

    if (currentPomailSno > 0) {
        if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length != 0) {
            subprocesssno = 3521;
            ProcessSNo = 17;
        }
        if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length == 0 && $("div[id$='areaTrans_import_doflightdetail']").length != 0) {
            subprocesssno = 3521;
            ProcessSNo = 17;
        }
        if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length == 0 && $("div[id$='areaTrans_import_doflightdetail']").length == 0) {
            subprocesssno = 3533;
            ProcessSNo = 17;
        }
    }
    else if (subprocesssno == 2146) {
        subprocesssno = 2146;
        ProcessSNo = 22;
    }
    else {
        subprocesssno = parseInt(subprocesssno);
        ProcessSNo = 22;
    }
    if (flag == true) {
        if (Number(pieces) > 0 && Number(grossWt) > 0) {
            $.ajax({
                url: "Services/Import/DeliveryOrderService.svc/GetCharges", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ TariffSNo: parseInt(0), AWBSNo: currentawbsno == 0 ? currentPomailSno : currentawbsno, CityCode: currentdetination, HAWBSNo: hawb, ProcessSNo: ProcessSNo, SubProcessSNo: subprocesssno, GrWT: parseFloat(grossWt), ChWt: parseFloat(grossWt), pValue: parseFloat(0), sValue: parseFloat(0), Pieces: parseInt(pieces), DOSNo: parseInt(0), PDSNo: parseInt(0), lstShipmentInfo: ShipmentDetailArray, Remarks: IsRushHandling, POMailSNo: parseInt(currentPomailSno) }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var resData = jQuery.parseJSON(result);
                    var hcData = resData.Table0;

                    MendatoryHandlingCharges = [];
                    if (hcData != []) {
                        $(hcData).each(function (row, i) {
                            if (i.isMandatory == 1) {
                                MendatoryHandlingCharges.push({ "type": "M", "chargename": i.TariffSNo, "text_chargename": i.TariffCode, "pbasis": i.PrimaryBasis, "pvalue": i.pValue, "sbasis": i.SecondaryBasis, "svalue": i.sValue, "amount": i.ChargeAmount, "totaltaxamount": i.TotalTaxAmount, "totalamount": i.TotalAmount, "remarks": i.ChargeRemarks.toUpperCase().replace(/<BR>/g, ""), "rate": i.Rate, IsEditableUnit: i.IsEditableUnit, "list": 1, "PartSNo": i.PartSNo, "DescriptionRemarks": i.DescriptionRemarks, "TaxPercent": i.TaxPercent });
                                totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat(i.TotalAmount)
                            }
                        });
                    }

                    $("div[id$='divareaTrans_import_dohandlingcharge']").show();
                    $("table[id^='__tbldo__']")[4].hidden = false;

                    var PopupTable = $("[id^='__tbldo__']").last();
                    $("textarea[id^='WaveOfRemarks']").closest('table').remove();
                    $("#divDetail").append('<div id="divareaTrans_import_dowaveofremark" style="display:none" cfi-aria-trans="trans"></div>');
                    $(PopupTable).appendTo($("#divareaTrans_import_dowaveofremark"));

                    if ($("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").length > 1)
                        $("#divareaTrans_import_dohandlingcharge").html(temp);
                    else
                        temp = $("#divareaTrans_import_dohandlingcharge").html();
                    cfi.makeTrans("import_dohandlingcharge", null, null, BindChargeAutoComplete, ReBindChargeAutoComplete, null, MendatoryHandlingCharges);

                    if (MendatoryHandlingCharges.length > 0) {
                        $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                            $(this).find("span[id^='PBasis']").closest("td").find("input[id^='_tempPValue']").val(MendatoryHandlingCharges[i].pvalue);
                            $(this).find("span[id^='PBasis']").closest("td").find("input[id^='PValue']").val(MendatoryHandlingCharges[i].pvalue);
                            $(this).find("span[id^='PBasis']").text(MendatoryHandlingCharges[i].pbasis);
                            $(this).find("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").val(MendatoryHandlingCharges[i].svalue);
                            $(this).find("span[id^='SBasis']").closest("td").find("input[id^='SValue']").val(MendatoryHandlingCharges[i].svalue);
                            $(this).find("span[id^='SBasis']").text(MendatoryHandlingCharges[i].sbasis);
                            $(this).find("input[id^='DescriptionRemarks']").closest('td').append("&nbsp;&nbsp;<span id=_DescriptionRemarks_" + i + ">" + MendatoryHandlingCharges[i].DescriptionRemarks + "</span>");

                            //if ($(this).find("input[id^='TaxPercent']").closest('td').find("span[id='_TaxPercent_" + i + "']").length == 0) {
                            //    $(this).find("input[id^='TaxPercent']").closest('td').append("&nbsp;&nbsp;<span id=_TaxPercent_" + i + ">" + MendatoryHandlingCharges[i].TaxPercent + "</span>");
                            //}
                        });

                        $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                            $(this).find("[id^='WaveOff']").after("<a href='#' id='waveofRemark' style='text-decoration:none;display:none;color:red' maxlength='200' onclick='BindwaveRemarks(this,event);return false;'>Remarks</a><input type='hidden' id='hdnremark' name='hdnremark' value=''>");
                            $(this).find("[id^='PValue']").after("<input type='hidden' id='PartSNo' name='PartSNo' value=''>");

                            $(this).find("span[id^='Remarks']").text($(this).find("span[id^='Remarks']").text().substring(0, 50));
                            $(this).find("span[id^='Remarks']").closest('td').hover(function () {
                                $(this).prop('title', $(this).find("input[id^='Remarks']").val());
                            });
                        });

                        $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                            $(this).find("[id^='PValue']").closest('td').find("[id^='PartSNo']").val(MendatoryHandlingCharges[i].PartSNo);
                        });
                    }

                    $("div[id$='divareaTrans_import_dohandlingcharge']").find("[id='areaTrans_import_dohandlingcharge']").each(function () {
                        $(this).find("input[id^='ChargeName']").each(function () {
                            if (currentPomailSno > 0) {
                                if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length != 0) {
                                    subprocesssno = 3521;
                                    ProcessSNo = 17;
                                }

                                if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length == 0 && $("div[id$='areaTrans_import_doflightdetail']").length != 0) {
                                    subprocesssno = 3521;
                                    ProcessSNo = 17;
                                }

                                if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length == 0 && $("div[id$='areaTrans_import_doflightdetail']").length == 0) {
                                    subprocesssno = 3533;
                                    ProcessSNo = 17;
                                }
                            }
                            else if (subprocesssno == 2146) {
                                subprocesssno = 2146;
                                ProcessSNo = 22;
                            }
                            else {
                                subprocesssno = 2135;
                                ProcessSNo = 22;
                            }
                            AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIEInbound", "", currentawbsno == 0 ? currentPomailSno : currentawbsno, 0, currentdetination, 1, hawb, "2", ShipmentDetailArray, ProcessSNo, subprocesssno, "No");
                        });
                    });

                    $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                        if (MendatoryHandlingCharges.length > 0) {
                            $(this).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").enable(false);
                            $(this).find("input[id^='Text_ChargeName']").closest('td').hover(function () {
                                $(this).prop('title', $(this).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").value());
                            });

                            if (MendatoryHandlingCharges[i].IsEditableUnit == "1") {
                                $(this).find("span[id^='PBasis']").closest("td").find("input").prop("disabled", false);
                                $(this).find("span[id^='SBasis']").closest("td").find("input").prop("disabled", false);
                            }
                            else {
                                $(this).find("span[id^='PBasis']").closest("td").find("input").attr("disabled", "disabled");
                                $(this).find("span[id^='SBasis']").closest("td").find("input").attr("disabled", "disabled");
                            }

                            if (MendatoryHandlingCharges.length - 1 == i) {
                                $(this).find("div[id^='transActionDiv']").show();
                                if (MendatoryHandlingCharges.length > 1)
                                    $(this).find("div[id^='transActionDiv']").find('i:eq(0)').hide();
                            }
                            $(this).find("[id^='WaveOff']").unbind("click").bind("click", function () {
                                EnableRemarks(this);
                            });
                        }
                        else {
                            $(this).find("span[id^='Type']").text("E");
                            $(this).find("input[id^='WaveOff']").hide();
                        }

                        if (MendatoryHandlingCharges.length > 0) {
                            if (MendatoryHandlingCharges[i].sbasis == undefined || MendatoryHandlingCharges[i].sbasis == "") {
                                $(this).find("span[id^='SBasis']").closest("td").find("input").css("display", "none");
                                $(this).find("span[id^='SBasis']").closest("td").find("span").css("display", "none");
                            }
                            else {
                                $(this).find("span[id^='SBasis']").closest("td").find("span").show();
                                $(this).find("span[id^='SBasis']").closest("td").find("input[id*='_tempSValue']").show();
                            }
                        }

                        if (MendatoryHandlingCharges.length > 0) {
                            if (MendatoryHandlingCharges[i].rate != "") {
                                $(this).find("span[id^='Rate']").closest("td").find("span").css("display", "none");
                            }
                            else {
                                $(this).find("span[id^='Rate']").closest("td").find("span").css("display", "none");
                            }
                            $(this).find("input[id^='DescriptionRemarks']").closest("td").css("display", "none");
                        }
                    });

                    totalHandlingCharges = 0;
                    $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                        if ($(this).find("[id^='WaveOff']").is(":checked") == false) {
                            totalHandlingCharges = Number(totalHandlingCharges) + Number($(this).find("td:eq(8)")[0].innerText);
                        }
                        $(this).find("span[id^='SBasis']").closest("td").find("span").css("display", "none");
                    });

                    if (MendatoryHandlingCharges.length > 1) {
                        $("div[id$='divareaTrans_import_dohandlingcharge']").show();
                        $("table[id^='__tbldo__']")[4].hidden = false;
                        var currAmount = 0;
                        if ($("#Text_PaymentType").val() == "CC") {
                            currAmount = parseFloat(totalAmountDO);
                            $("span[id='HandlingCharges']").text(totalHandlingCharges);
                            $("span[id='TotalAmountDO']").text(currAmount.toFixed(3));
                            totalAmountDO = $("span[id='TotalAmountDO']").text();
                            totalAmountDO = parseFloat(totalAmountDO);
                        }
                        else {
                            $("span[id='TotalAmountDO']").text(currAmount.toFixed(3));
                            totalAmountDO = $("span[id='TotalAmountDO']").text();
                        }
                    }

                    if ($('span[id="InitialPaymentType"]').text().toUpperCase() == 'PP') {
                        $("span[id='TotalAmountDO']").text(((Number(totalAmountDO) * Number(currencyConversionRate)) + parseFloat(totalHandlingCharges)).toFixed(3));
                    }
                    else {
                        var total = parseFloat($("span[id='CCCFeeAtDestination']").text()) + parseFloat($("span[id='HandlingCharges']").text())
                        $("span[id='TotalAmountDO']").text(total);  // by rahul date : 2017-12-20
                    }

                    if (Number(focCheckValue) > 0)
                        NillFOCCHarges(focCheckValue)
                    if (subprocesssno == 2135) {
                        if (userContext.SpecialRights.DOWaiveOff == false) {
                            $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                                $(row).find("input[id^='WaveOff']").hide();
                            });
                        }
                        else {
                            $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                                $(row).find("input[id^='WaveOff']").show();
                            });
                        }
                    }

                    $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                        if (userContext.SysSetting.ICMSEnvironment == "JT") {
                            $("#spnTaxPercent").hide();
                            $("#_TaxPercent_" + i).closest("td").css("display", "none");;
                        }
                        else {
                            $("#spnTaxPercent").show();
                            $("#_TaxPercent_" + i).closest("td").css("display", "block");;
                        }
                    });

                    registerDiscount(MendatoryHandlingCharges)
                },
                error: function (xhr) {
                    var ex = xhr;
                }
            });
        }
        else {
            ShowMessage('warning', 'Warning', "Please correct value(s) pieces, Any one of BULK and BUP must be greater than 0.", "bottom-right");
            return false;
        }
    }
}

function registerDiscount(MendatoryHandlingCharges) {
    $("div[id$='divareaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (row, tr) {
        $(tr).find("input[id^='Discount']").each(function () {
            $(this).unbind("blur").bind("blur", function () {
                debugger
                if ($(tr).find("input[id^='Discount']").val() == "0") {
                    $(tr).find("[id^='Discount']").val("0")
                    $(tr).find("[id^='_tempDiscount']").val("0")
                }
                if (MendatoryHandlingCharges[row] != undefined && MendatoryHandlingCharges.length != 0) {
                    var taxamount_discount = MendatoryHandlingCharges[row].totaltaxamount;
                    var totalamount = MendatoryHandlingCharges[row].totalamount;
                    GetDiscount($(tr), this, taxamount_discount, totalamount);

                    //disable percent
                    $(this).parent().next('td').children('input').attr('disabled', true)
                }
            });
        });

        $(tr).find("input[id^='DisTa']").each(function () {
            $(this).unbind("blur").bind("blur", function () {
                debugger
                if ($(tr).find("input[id^='DisTa']").val() == "0") {
                    $(tr).find("[id^='DisTa']").val("0")
                    $(tr).find("[id^='_tempDisTa']").val("0")
                }
                if (MendatoryHandlingCharges[row] != undefined && MendatoryHandlingCharges.length != 0) {
                    var taxamount_discount = MendatoryHandlingCharges[row].totaltaxamount;
                    var totalamount = MendatoryHandlingCharges[row].totalamount;
                    GetTaxDiscount($(tr), this, taxamount_discount, totalamount);

                    //disable percent
                    $(this).parent().next('td').children('input').attr('disabled', true);
                }
            });
        });
    });
    $("div[id$='divareaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (row, tr) {

        $(tr).find("input[id^='DiscountPercent']").each(function () {
            $(this).unbind("blur").bind("blur", function () {
                debugger
                if ($(tr).find("input[id^='DiscountPercent']").val() == "0") {
                    $(tr).find("[id^='DiscountPercent']").val("0")
                    $(tr).find("[id^='_tempDiscountPercent']").val("0")
                }
                if (MendatoryHandlingCharges[row] != undefined && MendatoryHandlingCharges.length != 0) {
                    var taxamount_discount = MendatoryHandlingCharges[row].totaltaxamount;
                    var totalamount = MendatoryHandlingCharges[row].totalamount;
                    GetDiscountPercent($(tr), this, taxamount_discount, totalamount);

                    //disable amount
                    $(this).parent().prev('td').children('input').attr('disabled', true);
                }

            });
        });

        $(tr).find("input[id^='DisTaPer']").each(function () {
            $(this).unbind("blur").bind("blur", function () {
                debugger
                if ($(tr).find("input[id^='DisTaPer']").val() == "0") {
                    $(tr).find("[id^='DisTaPer']").val("0")
                    $(tr).find("[id^='_tempDisTaPer']").val("0")
                }

                if (MendatoryHandlingCharges[row] != undefined && MendatoryHandlingCharges.length != 0) {
                    var taxamount_discount = MendatoryHandlingCharges[row].totaltaxamount;
                    var totalamount = MendatoryHandlingCharges[row].totalamount;
                    GetTaxDiscountPercent($(tr), this, taxamount_discount, totalamount);

                    //disable amount
                    $(this).parent().prev('td').children('input').attr('disabled', true)
                }
            });
        });
    });
}

function ExchangeRate() {
}

function EnableRemarks(obj) {
    var amount = 0;
    var totalAmount = 0;
    if ($(obj).prop('checked') == 1) {
        $(obj).closest('td').find("a[id^='waveofRemark']").css('display', '');
        amount = ($(obj).closest('tr').find("span[id^='TotalAmount']").text() * Number(currencyConversionRate)).toFixed(3);
        totalAmount = $("span[id='TotalAmountDO']").text();
        $("span[id='TotalAmountDO']").text(Number(totalAmount) - Number(amount));
    } else {
        $(obj).closest('td').find("a[id^='waveofRemark']").css('display', 'none');
        $(obj).closest('td').find("input[type=hidden][id^='hdnremark']").val('');
        $(obj).closest('td').find("a[id^='waveofRemark']").css('color', 'red');
        amount = ($(obj).closest('tr').find("span[id^='TotalAmount']").text() * Number(currencyConversionRate)).toFixed(3);
        totalAmount = $("span[id='TotalAmountDO']").text();
        $("span[id='TotalAmountDO']").text(Number(totalAmount) + Number(amount));
    }
}

function BindwaveRemarks(obj, e) {
    PaymentRow = $(obj).closest('tr');
    if ($("table[id^='__tblcancel do__']").length > 0)
        $("table[id^='__tblcancel do__']")[1].hidden = false;
    var HidDataVal = PaymentRow.find("input[type=hidden][id^='hdnremark']").val();
    if (HidDataVal != 0) {
        $("#divareaTrans_import_dowaveofremark").find("textarea[id^='WaveOfRemarks']").val(HidDataVal);
    }

    $("div[id=divareaTrans_import_dowaveofremark]").not(':first').remove();
    if (!$("#divareaTrans_import_dowaveofremark").data("kendoWindow"))
        cfi.PopUp("divareaTrans_import_dowaveofremark", "Waive off Remarks", 600, null, ResetRemarks);
    else
        $("#divareaTrans_import_dowaveofremark").data("kendoWindow").open();
}

function SaveRemarksToHidden(obj) {
    PaymentRow.find("input[type=hidden][id^='hdnremark']").val($(obj).closest('div').find("textarea[id^='WaveOfRemarks']").val());
    $(obj).closest('div').find("textarea[id^='WaveOfRemarks']").val('');
    if (PaymentRow.find("input[type=hidden][id^='hdnremark']").val() != 0) {
        PaymentRow.find("a[id^='waveofRemark']").css('color', 'green');
    } else {
        PaymentRow.find("a[id^='waveofRemark']").css('color', 'red');
    }

    $("#divareaTrans_import_dowaveofremark").data("kendoWindow").close();
}

function ResetRemarks(e) {
    $("#divareaTrans_import_dowaveofremark").find("textarea[id^='WaveOfRemarks']").val('');
}

function ShowRemarks(remark) {
    if (remark != "") {
        $("#divareaTrans_import_dowaveofremark").find("textarea[id^='WaveOfRemarks']").val(remark);
    }

    $("div[id=divareaTrans_import_dowaveofremark]").find("[id^='Save']").hide();
    $("div[id=divareaTrans_import_dowaveofremark]").not(':first').remove();
    if (!$("#divareaTrans_import_dowaveofremark").data("kendoWindow"))
        cfi.PopUp("divareaTrans_import_dowaveofremark", "Wave off Remarks", 600, null, ResetRemarks);
    else
        $("#divareaTrans_import_dowaveofremark").data("kendoWindow").open();
}

function CheckValidation(obj) {
    if (subprocesssno == "2137") {
        if (obj.id == "BulkPcs") {
            var pcs = $("#BulkPcs").val() == "" ? "0" : $("#BulkPcs").val();
            var totalPcs = $("span[id='TotalBulkPieces']").text();
            var wt = $("#BulkGrWt").val() == "" ? "0" : $("#BulkGrWt").val();
            var totalWt = $("span[id='TotalBulkGrWt']").text();
            if (Number(pcs) > Number(totalPcs)) {
                ShowMessage('warning', 'Warning - Delivery Order', 'Pieces should not be greater than Total Pieces', " ", "bottom-right");
                $("#BulkPcs").val(totalPcs);
            }
            else if (Number(pcs) == 0) {
                ShowMessage('warning', 'Warning - Delivery Order', 'Pieces should not be zero', " ", "bottom-right");
                $("#BulkPcs").val(totalPcs);
            }
            else {
                var actualWt = (Number(totalWt) / Number(totalPcs)) * Number(pcs);
                $("#" + obj.id).closest("table").find("input[id='_tempBulkGrWt']").val(actualWt.toFixed(3));
                $("#" + obj.id).closest("table").find("input[id='BulkGrWt']").val(actualWt.toFixed(3));
            }
        }

        if (obj.id == "BulkGrWt") {
            var pcs = $("#BulkPcs").val() == "" ? "0" : $("#BulkPcs").val();
            var totalPcs = $("span[id='TotalBulkPieces']").text();
            var wt = $("#BulkGrWt").val() == "" ? "0" : $("#BulkGrWt").val();
            var totalWt = $("span[id='TotalBulkGrWt']").text();
            var bulkWt = Number($("input[id='BulkGrWt']").val()) == 0 ? $("span[id='TotalWeight']").text() : $("input[id='BulkGrWt']").val();
            if (Number(wt) > Number(totalWt)) {
                ShowMessage('warning', 'Warning - Delivery Order', 'Gross Weight should not be greater than Total Gross Weight', " ", "bottom-right");
                $("#BulkGrWt").val(totalWt);
            }
            else if (Number(wt) == 0) {
                ShowMessage('warning', 'Warning - Delivery Order', 'Gross Weight should not be zero', " ", "bottom-right");
                $("#BulkGrWt").val(totalWt);
            }
            else {
                var actualWt = (Number(totalWt) / Number(totalPcs)) * Number(pcs);
                $("#" + obj.id).closest("table").find("input[id='_tempWeight']").val(actualWt.toFixed(3));
                $("#" + obj.id).closest("table").find("input[id='Weight']").val(actualWt.toFixed(3));
            }
        }
    }
    else {
        if ($("div[id$='divareaTrans_import_dohandlingcharge']").is(':visible')) {
            var currAmount = Number(totalAmountDO) > 0 ? parseFloat(totalAmountDO) - parseFloat(totalHandlingCharges) : parseFloat(totalAmountDO);
            $("span[id='TotalAmountDO']").text(currAmount.toFixed(3));
            totalHandlingCharges = 0;
            $("#divareaTrans_import_dohandlingcharge").html(temp);
            $("div[id$='divareaTrans_import_dohandlingcharge']").hide();
            if ($("table[id^='__tbldo__']").length > 4)
                $("table[id^='__tbldo__']")[4].hidden = true;
        }

        var doPieces = 0;
        var doGrwt = 0;
        var totalDOPieces = 0;
        var totalDOGrWt = 0;
        $("div[id$='areaTrans_import_doshipmenttypedetail']").find("[id^='areaTrans_import_doshipmenttypedetail']").each(function (i, row) {
            $(this).find("input[id^='_tempBulkPcs']").val($(this).find("input[id^='BulkPcs']").val());
            doPieces = Number(doPieces) + Number($(this).find("span[id^='BupPcs']").text()) + Number($(this).find("input[id^='_tempBulkPcs']").val());
            doGrwt = Number(doGrwt) + Number($(this).find("span[id^='BupGrWt']").text()) + Number($(this).find("input[id^='_tempBulkGrWt']").val());
            totalDOPieces = Number(totalDOPieces) + Number($(this).find("span[id^='TotalPieces']").text());
            totalDOGrWt = Number(totalDOGrWt) + Number($(this).find("span[id^='TotalGrossWeight']").text())
        });

        if (obj.id.indexOf("BulkPcs") == 0) {
            var piecs = $("#" + obj.id).val() == "" ? "0" : $("#" + obj.id).val();
            var totalPieces = $("#" + obj.id).closest("td").find("span[id^='TotalBulkPieces']").text();

            var totalgrossWeight = $("#" + obj.id).closest("tr").find("span[id^='TotalBulkGrWt']").text();
            var hawb = $("#Text_HAWB").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_HAWB").data("kendoAutoComplete").key();
            var hawbPieces = $("#Text_HAWB").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_HAWB").data("kendoAutoComplete").value().split("-")[1];
            if (Number(piecs) > Number(totalPieces)) {
                ShowMessage('warning', 'Warning - Delivery Order', 'Pieces should not be greater than Total Pieces', " ", "bottom-right");
                $("#" + obj.id).val(totalPieces);
            }
            else if (Number(doPieces) == 0) {
                ShowMessage('warning', 'Warning - Delivery Order', 'Pieces should not be zero', " ", "bottom-right");
                $("#" + obj.id).val(totalPieces);
            }
            else if (hawb > 0 && Number(piecs) > Number(hawbPieces)) {
                ShowMessage('warning', 'Warning - Delivery Order', 'Pieces should not be greater than HAWB Pieces', " ", "bottom-right");
                $("#" + obj.id).val(hawbPieces);
            }
            else {
                if (piecs != "" && Number(piecs) != 0) {
                    var totalWt = $("#" + obj.id).closest("tr").find("input[id^='BulkGrWt']").val() == "NaN" ? 0 : $("#" + obj.id).closest("tr").find("input[id^='BulkGrWt']").val();
                    var actualWt = (Number(totalgrossWeight) / Number(totalPieces)) * Number(piecs).toFixed(3);
                    chwt = actualWt;
                    $("#" + obj.id).closest("tr").find("input[id^='_tempBulkGrWt']").val(actualWt.toFixed(3));
                    $("#" + obj.id).closest("tr").find("input[id^='BulkGrWt']").val(actualWt.toFixed(3));
                }
                else {
                    $("#" + obj.id).val($("#_temp" + obj.id).val());
                    $("#" + obj.id).closest("tr").find("input[id^='_tempBulkGrWt']").val("0");
                    $("#" + obj.id).closest("tr").find("input[id^='BulkGrWt']").val("0");
                }
            }
        }

        if (obj.id.indexOf("BulkGrWt") == 0) {
            var grossWeight = $("#" + obj.id).val();
            var totalgrossWeight = $("#" + obj.id).closest("td").find("span[id^='TotalBulkGrWt']").text();
            if (Number(grossWeight) > Number(totalgrossWeight)) {
                ShowMessage('warning', 'Warning - Delivery Order', 'Gross Weight should not be greater than Total Gross Weight', " ", "bottom-right");
                $("#" + obj.id).val($("#_temp" + obj.id).val());
            }
            else if (Number(doGrwt) == 0) {
                ShowMessage('warning', 'Warning - Delivery Order', 'Gross Weight should not be zero', " ", "bottom-right");
                $("#" + obj.id).val(totalgrossWeight);
            }
            else {
                var totalPieces = $("#" + obj.id).closest("tr").find("span[id^='TotalBulkPieces']").text();
                var pieces = $("#" + obj.id).closest("tr").find("input[id^='BulkPcs']").val();

                if (Number(pieces) == Number(totalPieces) && Number(grossWeight) != Number(totalgrossWeight)) {
                    ShowMessage('warning', 'Warning - Delivery Order', 'Gross weight can’t be changed for total pieces', " ", "bottom-right");
                    $("#" + obj.id).val($("#_temp" + obj.id).val());
                }
                else {
                    var wt = (Number(totalgrossWeight) / Number(totalPieces)) * Number(pieces).toFixed(3);
                    chwt = wt;
                    var startWt = Number(wt) - (Number(wt) * .1);
                    var endWt = Number(wt) + (Number(wt) * .1);
                }
            }
        }
        if (obj.id.indexOf("BulkPcs") == 0) {
            if (Number(doPieces) != Number(totalDOPieces)) {
                ShowMessage('warning', 'Warning - Delivery Order', 'Part DO charges will be applicable for part shipment delivery order.', " ", "bottom-right");
            }
        }
    }
}

function HideCCCharges(valueId, value, keyId, key) {
    if (keyId == "PaymentType") {
        if (key == 1) {
            $("table[id^='__tbldo__']")[2].hidden = true;
            $('input:radio[id="CustomerType"]').removeAttr('disabled');
            $('input:radio[id="DOType"]').removeAttr('disabled');
            $("div[id$='areaTrans_import_doshipmenttypedetail']").find("[id^='areaTrans_import_doshipmenttypedetail']").each(function (i, row) {
                if ($("input:radio[id='DOType']:checked").val() == 1) {
                    $(this).find("input[id^='BulkPcs']").prop("disabled", false);
                    $(this).find("input[id^='BulkGrWt']").prop("disabled", false);
                    $(this).find("input[id^='BulkPcs']").data("kendoNumericTextBox").enable(true);
                    $(this).find("input[id^='BulkGrWt']").data("kendoNumericTextBox").enable(true);
                    $("input:radio[id='DOType']").eq(0).attr("disabled", "disabled");
                }
                else {
                    $(this).find("input[id^='BulkPcs']").prop("disabled", true);
                    $(this).find("input[id^='BulkGrWt']").prop("disabled", true);
                    $(this).find("input[id^='BulkPcs']").data("kendoNumericTextBox").enable(false);
                    $(this).find("input[id^='BulkGrWt']").data("kendoNumericTextBox").enable(false);
                    $("input:radio[id='DOType']").eq(0).removeAttr("disabled");
                }
            });
            $(this).find("input[id^='BulkPcs']").show();
            $(this).find("input[id^='BulkGrWt']").show();
            $(this).find("input[id^='_tempBulkPcs']").hide();
            $(this).find("input[id^='_tempBulkGrWt']").hide();
            $("span[id='TotalAmountDO']").text("0");
        }
        else {
            $("table[id^='__tbldo__']")[2].hidden = false;
            $('input:radio[id="CustomerType"]').attr("disabled", "disabled");
            $('input:radio[id="DOType"]').attr("disabled", "disabled");
            $("div[id$='areaTrans_import_doshipmenttypedetail']").find("[id^='areaTrans_import_doshipmenttypedetail']").each(function (i, row) {
                $(this).find("input[id^='BulkPcs']").prop("disabled", true);
                $(this).find("input[id^='BulkGrWt']").prop("disabled", true);
                $(this).find("input[id^='BulkPcs']").data("kendoNumericTextBox").enable(false);
                $(this).find("input[id^='BulkGrWt']").data("kendoNumericTextBox").enable(false);
            });
            $(this).find("input[id^='BulkPcs']").show();
            $(this).find("input[id^='BulkGrWt']").show();
            $(this).find("input[id^='_tempBulkPcs']").hide();
            $(this).find("input[id^='_tempBulkGrWt']").hide();
            $("span[id='TotalAmountDO']").text($("span[id='TotalAmountDestCurrency']").text());
        }
    }

    if (keyId == "CustomerType") {
        $("[id='spnParticipantName']").find('span').remove();
        if (key == 1) {
            if (subprocesssno == 2135) {
                if ($("#Text_ParticipantName").data("kendoAutoComplete") != undefined) {
                    $("#Text_ParticipantName").data("kendoAutoComplete").enable(true);
                    $("[id='spnParticipantName']").find('span').remove();
                    $("[type='radio'][id='CustomerType'][value='1']").attr('disabled', false);
                }
            }

            if (subprocesssno == 3521) {
                if ($("#Text_ParticipantName").data("kendoAutoComplete") != undefined) {
                    $("#Text_ParticipantName").data("kendoAutoComplete").enable(true);
                    $("#Text_ParticipantName").attr("data-valid", "required").attr("data-valid-msg", "Select Authorized Person.");
                    $("[id='spnParticipantName']").find('span').remove();
                    $("#spnParticipantName").prepend('<span id="astrikid" style="color:red"><b>*</b></sapn>');
                }
            }
            else if (subprocesssno == 2134) {
                if ($("#Text_AuthorizedPerson").data("kendoAutoComplete") != undefined) {
                    $("#Text_AuthorizedPerson").data("kendoAutoComplete").enable(true);
                }
                if ($("#Text_Consignee").data("kendoAutoComplete") != undefined) {
                    $("#Text_Consignee").data("kendoAutoComplete").enable(true);
                    $("#Text_Consignee").attr("data-valid", "required").attr("data-valid-msg", "Select Consignee.");
                }
            }
            else if (subprocesssno == 2137) {
                if ($("#Text_DeliverdTo").data("kendoAutoComplete") != undefined) {
                    $("#Text_DeliverdTo").data("kendoAutoComplete").enable(true);
                    $("#Text_DeliverdTo").attr("data-valid", "required").attr("data-valid-msg", "Select Authorized Person.");
                }
            }

            $("#AuthorizedPersonId").removeAttr("data-valid").removeAttr("data-valid-msg");
            $("#AuthorizedPersonName").removeAttr("data-valid").removeAttr("data-valid-msg");
            $("#AuthorizedPersonCompany").removeAttr("data-valid").removeAttr("data-valid-msg");
            $("#AuthorizedPersonId").closest("tr").hide();
            $("#AuthorizedPersonCompany").closest("tr").hide();
        }
        else {
            if (subprocesssno == 2135) {
                $("#Text_ParticipantName").data("kendoAutoComplete").setDefaultValue("", "");
                $("#Text_ParticipantName").data("kendoAutoComplete").enable(false);
                $("[type='radio'][id='CustomerType'][value='1']").attr('disabled', true);
                $("[type='radio'][id='CustomerType'][value='1']").attr('checked', false);
                $('[type="radio"][id="CustomerType"][value="0"]').attr('checked', true);
                $('[type="radio"][id="CustomerType"][value="0"]').click();

                if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "TH") {
                    $("#BillToText").removeAttr("data-valid").removeAttr("data-valid-msg");
                }
            }
            else if (subprocesssno == 3521) {
                $("#Text_ParticipantName").data("kendoAutoComplete").setDefaultValue("", "");
                $("#Text_ParticipantName").removeAttr("data-valid").removeAttr("data-valid-msg");
                $("#Text_ParticipantName").data("kendoAutoComplete").enable(false);
            }
            else if (subprocesssno == 2134) {
                $("#Text_AuthorizedPerson").data("kendoAutoComplete").enable(false);
                $("#Text_Consignee").removeAttr("data-valid").removeAttr("data-valid-msg");
                $("#Text_Consignee").data("kendoAutoComplete").enable(false);

            }
            else if (subprocesssno == 2137) {
                $("#Text_DeliverdTo").removeAttr("data-valid").removeAttr("data-valid-msg");
                $("#Text_DeliverdTo").data("kendoAutoComplete").enable(false);
                $("[title='Enter Authorized Person Id']").closest("td").prev("td").remove();
            }

            $('#astrikid').html('');
            $("#AuthorizedPersonId").closest("tr").show();
            $("#AuthorizedPersonCompany").closest("tr").show();

            if (userContext.SysSetting.ICMSEnvironment == "JT") {
                $("#AuthorizedPersonId").attr("data-valid", "required").attr("data-valid-msg", "Enter Authorized Person Id.");
                $("#AuthorizedPersonName").attr("data-valid", "required").attr("data-valid-msg", "Enter Authorized Person Name.");
                $("#AuthorizedPersonCompany").attr("data-valid", "required").attr("data-valid-msg", "Enter Authorized Person Company.");
            }
            else {
                //$("#AuthorizedPersonId").attr("data-valid", "required").attr("data-valid-msg", "Enter Authorized Person Id.");
                //$("#AuthorizedPersonName").attr("data-valid", "required").attr("data-valid-msg", "Enter Authorized Person Name.");
                //$("#AuthorizedPersonCompany").attr("data-valid", "required").attr("data-valid-msg", "Enter Authorized Person Company.");
            }
        }
    }
}

function AutoCompleteForDOHandlingCharge(textId, basedOn, tableName, keyColumn, textColumn, templateColumn, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, ShipmentDetailArray, ProcessSNo, subprocesssno, cityChangeFlag) {
    var keyId = textId;
    textId = "Text_" + textId;
    if (!$("#" + textId).data("kendoAutoComplete")) {
        if (IsValid(textId, autoCompleteType)) {
            if (keyColumn == null || keyColumn == undefined)
                keyColumn = basedOn;
            if (textColumn == null || textColumn == undefined)
                textColumn = basedOn;
            var dataSource = GetDataSourceForDOHandlingCharge(textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, ShipmentDetailArray, ProcessSNo, subprocesssno, cityChangeFlag);
            $("input[type='text'][name='" + textId + "']").kendoAutoComplete({
                filter: (templateColumn == undefined || templateColumn == null ? ((filterCriteria == undefined || filterCriteria == null || filterCriteria == "" ? "startswith" : filterCriteria)) : "contains"),
                dataSource: dataSource,
                filterField: basedOn,
                separator: (separator == undefined ? null : separator),
                dataTextField: autoCompleteText,
                dataValueField: autoCompleteKey,
                valueControlID: $("input[type='hidden'][name='" + keyId + "']"),
                template: '<span>#: TemplateColumn #</span>',
                addOnFunction: (addOnFunction == undefined ? null : addOnFunction),
                newAllowed: newAllowed,
                confirmOnAdd: confirmOnAdd
            });
        }
    }
}

var dourl = 'Services/AutoCompleteService.svc/ImportFBLAutoCompleteDataSource';
function GetDataSourceForDOHandlingCharge(textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, ShipmentDetailArray, ProcessSNo, subprocesssno, cityChangeFlag) {
    if (subprocesssno == 2146)
        procName = "getHandlingChargesIEInboundAutoComplete";

    var dataSource = new kendo.data.DataSource({
        type: "json",
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        allowUnsort: true,
        pageSize: 10,
        transport: {
            read: {
                url: (newUrl == undefined || newUrl == "" ? dourl : serviceurl + newUrl),
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: {
                    tableName: tableName,
                    keyColumn: keyColumn,
                    textColumn: textColumn,
                    templateColumn: templateColumn,
                    procedureName: procName,
                    awbSNo: awbSNo,
                    chargeTo: chargeTo,
                    cityCode: cityCode,
                    movementType: movementType,
                    hawbSNo: hawbSNo,
                    loginSNo: loginSNo,
                    ShipmentDetailArray: ShipmentDetailArray,
                    ProcessSNo: ProcessSNo, subprocesssno: subprocesssno,
                    cityChangeFlag: cityChangeFlag,
                    Remarks: "RSH=" + ($("#RushHandling").is(':checked') ? 1 : 0),
                }
            },
            parameterMap: function (options) {
                if (options.filter != undefined) {
                    var filter = _ExtraCondition(textId);
                    if (filter == undefined) {
                        filter = { logic: "AND", filters: [] };
                    }
                    filter.filters.push(options.filter);
                    options.filter = filter;
                }
                if (options.sort == undefined)
                    options.sort = null;
                return JSON.stringify(options);
            }
        },
        schema: { data: "Data" }
    });
    return dataSource;
}

function BindChargeAutoComplete(elem, mainElem) {
    if ($(elem)[0].id.indexOf("dohandlingcharge") > - 1) {
        var hawb = 0;
        var SPHCTransSNo = 0;
        var ShipmentDetailArray = [];
        pieces = 0;
        grossWt = 0;
        partNumber = 0;
        if ($("#Text_HAWB").data("kendoAutoComplete") != undefined)
            hawb = $("#Text_HAWB").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_HAWB").data("kendoAutoComplete").key();
        if (subprocesssno == "2137") {
            pieces = $("#hdnPieces").val();
            grossWt = $("#hdnGrWt").val();
        }
        else {
            $("div[id$='areaTrans_import_doshipmenttypedetail']").find("[id^='areaTrans_import_doshipmenttypedetail']").each(function (i, row) {
                pieces = Number(pieces) + Number($(this).find("span[id^='BupPcs']").text()) + Number($(this).find("input[id^='_tempBulkPcs']").val());
                grossWt = Number(grossWt) + Number($(this).find("span[id^='BupGrWt']").text()) + Number($(this).find("input[id^='_tempBulkGrWt']").val());

                var ShipmentDetailViewModel = {
                    PartNumber: Number(partNumber) + 1,
                    AWBSNo: currentawbsno,
                    HAWBSNo: hawb,
                    PartSNo: $(this).find("span[id^='DailyFlightSNo']").text(),
                    Pieces: Number($(this).find("span[id^='BupPcs']").text()) + Number($(this).find("input[id^='_tempBulkPcs']").val()),
                    GrossWeight: Number($(this).find("span[id^='BupGrWt']").text()) + Number($(this).find("input[id^='_tempBulkGrWt']").val()),
                    VolumeWeight: 0,
                    IsBUP: Number($(this).find("span[id^='BupPcs']").text()) > 0 ? 1 : 0,
                    SPHCSNo: 0,
                    SPHCTransSNo: SPHCTransSNo
                };
                ShipmentDetailArray.push(ShipmentDetailViewModel);
            });
        }

        $(elem).find("input[id^='ChargeName']").each(function () {
            if (currentPomailSno > 0) {
                if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length != 0) {
                    subprocesssno = 3521;
                    ProcessSNo = 17;
                }
                if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length == 0 && $("div[id$='areaTrans_import_doflightdetail']").length != 0) {
                    subprocesssno = 3521;
                    ProcessSNo = 17;
                }
                if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length == 0 && $("div[id$='areaTrans_import_doflightdetail']").length == 0) {
                    subprocesssno = 3533;
                    ProcessSNo = 17;
                }
            }
            else if (subprocesssno == 2146) {
                subprocesssno = 2146;
                ProcessSNo = 22;
            }
            else {
                subprocesssno = 2135;
                ProcessSNo = 22;
            }

            AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIEInbound", "", currentawbsno == 0 ? currentPomailSno : currentawbsno, 0, currentdetination, 1, hawb, "2", ShipmentDetailArray, ProcessSNo, subprocesssno, "No");
        });

        $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
            if (i < MendatoryHandlingCharges.length) {
                $(this).find("div[id^='transActionDiv']").hide();
            }
            if (i >= MendatoryHandlingCharges.length) {
                $(this).find("span[id^='Type']").text("E");
                $(this).find("input[id^='WaveOff']").hide();
            }
        });

        $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
            if (i == $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").length - 2) {
                $(this).find("span[id^='PBasis']").closest("td").find("input[id^='_tempPValue']").val(MendatoryHandlingCharges[i].pvalue);
                $(this).find("span[id^='PBasis']").closest("td").find("input[id^='PValue']").val(MendatoryHandlingCharges[i].pvalue);
                $(this).find("span[id^='PBasis']").text(MendatoryHandlingCharges[i].pbasis);
                $(this).find("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").val(MendatoryHandlingCharges[i].svalue);
                $(this).find("span[id^='SBasis']").closest("td").find("input[id^='SValue']").val(MendatoryHandlingCharges[i].svalue);
                $(this).find("span[id^='SBasis']").text(MendatoryHandlingCharges[i].sbasis);
            }
        });

        if (subprocesssno == "2137") {
            var lengthcharge = $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").length;
            $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                if (i < (lengthcharge - 1)) {
                    if (i != 0)
                        $(this).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").enable(false);
                    $(this).find("input[id^='Text_ChargeName']").closest('td').hover(function () {
                        $(this).prop('title', $(this).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").value());
                    });
                    $(this).find("span[id^='PBasis']").closest("td").find("input").attr("disabled", "disabled");
                    $(this).find("span[id^='SBasis']").closest("td").find("input").attr("disabled", "disabled");
                }
            });
        }
    }

    if ($(elem)[0].id.indexOf("awddocs") > - 1) {
        $(elem).find("input[id^='DocType']").each(function () {
            cfi.AutoCompleteByDataSource($(this).attr("name"), SearchDocsDataSource);
        });
    }

    if ($(elem)[0].id.indexOf("payment") > - 1) {
        $(elem).find("input[id^='Process']").each(function () {
            cfi.AutoCompleteByDataSource($(this).attr("name"), SearchTypeDataSource);
        });
        $(elem).find("input[id^='DocumentNo']").each(function () {
            cfi.AutoCompleteV2($(this).attr("name"), "AWBNo", "DO_BindChargeAutoCompleteAWBNo", null, "contains");
        });
        $(elem).find("input[id^='Currency']").each(function () {
            cfi.AutoCompleteV2($(this).attr("name"), "CurrencyCode", "DO_BindChargeAWBNo", null, "contains");
        });
    }
}

function ReBindChargeAutoComplete(elem, mainElem) {
    totalHandlingCharges = 0;
    totalAmountDO = 0;
    if ($(elem)[0].id.indexOf("dohandlingcharge") > - 1) {
        var hawb = 0;
        var SPHCTransSNo = 0;
        var ShipmentDetailArray = [];
        pieces = 0;
        grossWt = 0;
        partNumber = 0;
        if ($("#Text_HAWB").data("kendoAutoComplete") != undefined)
            hawb = $("#Text_HAWB").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_HAWB").data("kendoAutoComplete").key();
        if (subprocesssno == "2137") {
            pieces = $("#hdnPieces").val();
            grossWt = $("#hdnGrWt").val();
        }
        else {
            $("div[id$='areaTrans_import_doshipmenttypedetail']").find("[id^='areaTrans_import_doshipmenttypedetail']").each(function (i, row) {
                pieces = Number(pieces) + Number($(this).find("span[id^='BupPcs']").text()) + Number($(this).find("input[id^='_tempBulkPcs']").val());
                grossWt = Number(grossWt) + Number($(this).find("span[id^='BupGrWt']").text()) + Number($(this).find("input[id^='_tempBulkGrWt']").val());

                var ShipmentDetailViewModel = {
                    PartNumber: Number(partNumber) + 1,
                    AWBSNo: currentawbsno,
                    HAWBSNo: hawb,
                    PartSNo: $(this).find("span[id^='DailyFlightSNo']").text(),
                    Pieces: Number($(this).find("span[id^='BupPcs']").text()) + Number($(this).find("input[id^='_tempBulkPcs']").val()),
                    GrossWeight: Number($(this).find("span[id^='BupGrWt']").text()) + Number($(this).find("input[id^='_tempBulkGrWt']").val()),
                    VolumeWeight: 0,
                    IsBUP: Number($(this).find("span[id^='BupPcs']").text()) > 0 ? 1 : 0,
                    SPHCSNo: 0,
                    SPHCTransSNo: SPHCTransSNo
                };
                ShipmentDetailArray.push(ShipmentDetailViewModel);
            });
        }

        $(elem).closest("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function () {
            $(this).find("input[id^='ChargeName']").each(function () {
                if (currentPomailSno > 0) {
                    if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length != 0) {
                        subprocesssno = 3521;
                        ProcessSNo = 17;
                    }
                    if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length == 0 && $("div[id$='areaTrans_import_doflightdetail']").length != 0) {
                        subprocesssno = 3521;
                        ProcessSNo = 17;
                    }
                    if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length == 0 && $("div[id$='areaTrans_import_doflightdetail']").length == 0) {
                        subprocesssno = 3533;
                        ProcessSNo = 17;
                    }
                }
                else if (subprocesssno == 2146) {
                    subprocesssno = 2146;
                    ProcessSNo = 22;
                }
                else {
                    subprocesssno = 2135;
                    ProcessSNo = 22;
                }
                AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIEInbound", "", currentawbsno == 0 ? currentPomailSno : currentawbsno, 0, currentdetination, 1, hawb, "2", ShipmentDetailArray, ProcessSNo, subprocesssno, "No");

            });
        });

        var totalRow = $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").length;
        $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
            if (i + 1 == totalRow) {
                $(this).find("div[id^='transActionDiv']").show();
            }

            if (i >= MendatoryHandlingCharges.length) {
                $(this).find("span[id^='Type']").text("E");
                $(this).find("input[id^='WaveOff']").hide();
            }
            totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat($(this).find("span[id^='Amount']").text());
        });

        $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
            if ($(this).find("span[id^='SBasis']").text() == undefined || $(this).find("span[id^='SBasis']").text() == "") {
                $(this).find("span[id^='SBasis']").closest("td").find("input").css("display", "none");
                $(this).find("span[id^='SBasis']").closest("td").find("span").css("display", "none");
            }
        });

        if (subprocesssno == "2137") {
            var lengthcharge = $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").length;
            $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                if (i == (lengthcharge - 1)) {
                    if (i > MendatoryHandlingCharges.length) {
                        $(this).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").enable(true);
                        $(this).find("span[id^='PBasis']").closest("td").find("input").attr("disabled", false);
                        $(this).find("span[id^='SBasis']").closest("td").find("input").attr("disabled", false);
                    }
                }
            });
        }

        totalAmountDO = parseFloat(totalAmountDO) + parseFloat(totalHandlingCharges);
        $("span[id='TotalAmountDO']").text(totalAmountDO.toFixed(3));
    }

    if ($(elem)[0].id.indexOf("awddocs") > - 1) {
        $(elem).closest("div[id$='areaTrans_import_awddocs']").find("[id^='areaTrans_import_awddocs']").each(function () {
            $(this).find("input[id^='ServiceName']").each(function () {
                cfi.ChangeAutoCompleteDataSource($(this).attr("name"), SearchDocsDataSource, false);
            });
        });
    }

    if ($(elem)[0].id.indexOf("payment") > - 1) {
        $(elem).closest("div[id$='areaTrans_import_payment']").find("[id^='areaTrans_import_payment']").each(function () {
            $(this).find("input[id^='Process']").each(function () {
                cfi.AutoCompleteByDataSource($(this).attr("name"), SearchTypeDataSource);
            });

            $(this).find("input[id^='DocumentNo']").each(function () {
                cfi.AutoCompleteV2($(this).attr("name"), "AWBNo", "DeliveryOrder_AWBNo", null, "contains");
            });

            $(this).find("input[id^='Currency']").each(function () {
                cfi.AutoCompleteV2($(this).attr("name"), "CurrencyCode", "DeliveryOrder_CurrencyCode", null, "contains");
            });
        });
    }
}

function GetChargeValue(obj) {
    rowId = obj.id.split("_")[1];
    var tariffSNo = rowId == undefined ? $("#ChargeName").val() : $("#ChargeName_" + obj.id.split("_")[1]).val();
    if (obj.id.indexOf("PValue") > - 1) {
        pValue = $("#" + obj.id).val() == "" ? 0 : $("#" + obj.id).val();
        sValue = $("#" + obj.id.replace("PValue", "SValue")).val() != "" ? $("#" + obj.id.replace("PValue", "SValue")).val() : 0;
    }
    else {
        sValue = $("#" + obj.id).val() == "" ? 0 : $("#" + obj.id).val();
        pValue = $("#" + obj.id.replace("PValue", "SValue")).val() != "" ? $("#" + obj.id.replace("SValue", "PValue")).val() : 0;
    }

    if (tariffSNo == "" || tariffSNo == undefined) {
        ShowMessage('warning', 'Warning - Delivery Order', 'Please select Charges.', " ", "bottom-right");
    }
    else {
        totalHandlingCharges = 0;
        totalAmountDO = 0;
        var hawb = 0;
        var SPHCTransSNo = 0;
        if ($("#Text_HAWB").data("kendoAutoComplete") != undefined)
            hawb = $("#Text_HAWB").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_HAWB").data("kendoAutoComplete").key();
        if ($("#Text_SPHCType").data("kendoAutoComplete") != undefined)
            SPHCTransSNo = $("#Text_SPHCType").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_SPHCType").data("kendoAutoComplete").key();
        var ShipmentDetailArray = [];
        pieces = 0;
        grossWt = 0;
        partNumber = 0;
        if (subprocesssno == "2137") {
            pieces = $("#hdnPieces").val();
            grossWt = $("#hdnGrWt").val();
        }
        else {
            $("div[id$='areaTrans_import_doshipmenttypedetail']").find("[id^='areaTrans_import_doshipmenttypedetail']").each(function (i, row) {
                pieces = Number(pieces) + Number($(this).find("span[id^='BupPcs']").text()) + Number($(this).find("input[id^='_tempBulkPcs']").val());
                grossWt = Number(grossWt) + Number($(this).find("span[id^='BupGrWt']").text()) + Number($(this).find("input[id^='_tempBulkGrWt']").val());

                var ShipmentDetailViewModel = {
                    PartNumber: Number(partNumber) + 1,
                    AWBSNo: currentawbsno,
                    HAWBSNo: hawb,
                    PartSNo: $(this).find("span[id^='DailyFlightSNo']").text(),
                    Pieces: Number($(this).find("span[id^='BupPcs']").text()) + Number($(this).find("input[id^='_tempBulkPcs']").val()),
                    GrossWeight: Number($(this).find("span[id^='BupGrWt']").text()) + Number($(this).find("input[id^='_tempBulkGrWt']").val()),
                    VolumeWeight: 0,
                    IsBUP: Number($(this).find("span[id^='BupPcs']").text()) > 0 ? 1 : 0,
                    SPHCSNo: 0,
                    SPHCTransSNo: SPHCTransSNo
                };
                ShipmentDetailArray.push(ShipmentDetailViewModel);
            });
        }

        var IsRushHandling = "RSH=" + ($("#RushHandling").is(':checked') ? 1 : 0);
        if (currentPomailSno > 0) {
            if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length != 0) {
                subprocesssno = 3521;
                ProcessSNo = 17;
            }
            if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length == 0 && $("div[id$='areaTrans_import_doflightdetail']").length != 0) {
                subprocesssno = 3521;
                ProcessSNo = 17;
            }
            if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length == 0 && $("div[id$='areaTrans_import_doflightdetail']").length == 0) {
                subprocesssno = 3533;
                ProcessSNo = 17;
            }
        }
        else if (subprocesssno == 2146) {
            subprocesssno = 2146;
            ProcessSNo = 22;
        }
        else {
            subprocesssno = parseInt(subprocesssno);
            ProcessSNo = 22;
        }
        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/GetCharges", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ TariffSNo: parseInt(tariffSNo), AWBSNo: currentawbsno, CityCode: currentdetination, HAWBSNo: hawb, ProcessSNo: ProcessSNo, SubProcessSNo: parseInt(subprocesssno === "2137" ? 2146 : subprocesssno), GrWT: parseFloat(grossWt), ChWt: parseFloat(grossWt), pValue: parseFloat(pValue), sValue: parseFloat(sValue), Pieces: parseInt(pieces), DOSNo: parseInt(0), PDSNo: parseInt(0), lstShipmentInfo: ShipmentDetailArray, Remarks: IsRushHandling, POMailSNo: parseInt(currentPomailSno) }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var resData = jQuery.parseJSON(result);
                var doCharges = resData.Table0;
                if (doCharges.length > 0) {
                    var doItem = doCharges[0];
                    if (rowId == undefined) {
                        $("span[id='PBasis']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                        $("span[id='PBasis']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                        $("span[id='PBasis']").text(doItem.PrimaryBasis);
                        $("span[id='SBasis']").closest("td").find("input[id^='_tempPValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                        $("span[id='SBasis']").closest("td").find("input[id^='PValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                        $("span[id='SBasis']").text(doItem.SecondryBasis);
                        $("span[id='Amount']").text(doItem.ChargeAmount);
                        $("span[id='TotalTaxAmount']").text(doItem.TotalTaxAmount);
                        $("span[id='TotalAmount']").text(doItem.TotalAmount);
                        $("span[id='Remarks']").text(doItem.ChargeRemarks);
                    }
                    else {
                        $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                        $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                        $("span[id^='PBasis_" + rowId + "']").text(doItem.PrimaryBasis);
                        $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='_tempSValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                        $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='SValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                        $("span[id^='SBasis_" + rowId + "']").text(doItem.SecondryBasis);
                        $("span[id^='Amount_" + rowId + "']").text(doItem.ChargeAmount);
                        $("span[id^='TotalTaxAmount" + rowId + "']").text(doItem.TotalTaxAmount);
                        $("span[id^='TotalAmount_" + rowId + "']").text(doItem.TotalAmount);
                        $("span[id^='Remarks_" + rowId + "']").text(doItem.ChargeRemarks);
                        if ($("span[id^='SBasis_" + rowId + "']").text() == undefined || $("span[id^='SBasis_" + rowId + "']").text() == "") {
                            $("span[id^='SBasis_" + rowId + "']").closest("td").find("input").css("display", "none");
                            $("span[id^='SBasis_" + rowId + "']").closest("td").find("span").css("display", "none");
                        }
                        else {
                            $("span[id^='SBasis_" + rowId + "']").closest("td").find("span").show();
                            $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id*='_tempSValue']").show();
                        }
                    }
                }
                $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                    totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat($(this).find("span[id^='Amount']").text());
                });
                totalAmountDO = parseFloat(totalAmountDO) + parseFloat(totalHandlingCharges);
                $("span[id='TotalAmountDO']").text(totalAmountDO.toFixed(3));
            }
        });
    }
}

function GatValueOfAutocomplete(valueId, value, keyId, key) {
    rowId = valueId.split("_")[2];
    var pieces = 0;
    var grossWt = 0;
    var partNumber = 0;
    totalHandlingCharges = 0;
    totalAmountDO = 0;
    if (ValidateExistingCharges(valueId, value, keyId, key)) {
        if (value != "") {
            var hawb = 0;
            var SPHCTransSNo = 0;
            if ($("#Text_HAWB").data("kendoAutoComplete") != undefined)
                hawb = $("#Text_HAWB").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_HAWB").data("kendoAutoComplete").key();
            if ($("#Text_SPHCType").data("kendoAutoComplete") != undefined)
                SPHCTransSNo = $("#Text_SPHCType").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_SPHCType").data("kendoAutoComplete").key();

            var ShipmentDetailArray = [];
            if (subprocesssno == "2137" || subprocesssno == "2146") {
                pieces = $("#hdnPieces").val();
                grossWt = $("#hdnGrWt").val();
                if (currentPomailSno > 0) {
                    if (SubprocessCancelDo == "CANCEL DO PO") {
                        subprocesssno = 3534
                        ProcessSNo = 17;
                        pieces = 0;
                        grossWt = 0;
                    }
                    else if (SubprocessReleaseDo == "RELEASE DO PO") {
                        subprocesssno = 3533
                        ProcessSNo = 17;
                        pieces = 0;
                        grossWt = 0;
                    }
                    else {
                        if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length != 0) {
                            subprocesssno = 3521;
                            ProcessSNo = 17;
                            pieces = 0;
                            grossWt = 0;
                        }
                        if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length == 0 && $("div[id$='areaTrans_import_doflightdetail']").length != 0) {
                            subprocesssno = 3521;
                            ProcessSNo = 17;
                            pieces = 0;
                            grossWt = 0;
                        }
                        if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length == 0 && $("div[id$='areaTrans_import_doflightdetail']").length == 0) {
                            subprocesssno = 3533;
                            ProcessSNo = 17;
                            pieces = 0;
                            grossWt = 0;
                        }
                    }
                }
                else {
                    if (SubprocessCancelDo == "CANCEL DO CARGO") {
                        subprocesssno = 2305;
                        ProcessSNo = 22;
                        pieces = 0;
                        grossWt = 0;
                    }
                    else if (SubprocessReleaseDo == "RELEASE DO CARGO") {
                        subprocesssno = 2146;
                        ProcessSNo = 22;
                        pieces = 0;
                        grossWt = 0;
                    }
                    else {
                        if (subprocesssno == 2146) {
                            subprocesssno = 2146;
                            ProcessSNo = 22;
                            pieces = 0;
                            grossWt = 0;
                        }
                        else {
                            subprocesssno = 2135;
                            ProcessSNo = 22;
                            pieces = 0;
                            grossWt = 0;
                        }
                    }
                }

                if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length == 0 && $('#tblDLV').length != 0) {
                    $("tr[id*=trtblDLV]").each(function () {
                        var CustomerType = $(this).find("td:eq(" + $(this).find('td[data-column="CustomerType"]').index() + ")").text();
                        var DeliveryOrderNo = $(this).find("td:eq(" + $(this).find('td[data-column="DeliveryOrderNo"]').index() + ")").text();
                        var DeliveryOrderDate = $(this).find("td:eq(" + $(this).find('td[data-column="DeliveryOrderDate"]').index() + ")").text();
                        var DOPieces = $(this).find("td:eq(" + $(this).find('td[data-column="DOPieces"]').index() + ")").text();
                        grossWt = $(this).find("td:eq(" + $(this).find('td[data-column="DOGrossWeight"]').index() + ")").text();
                        var TotalPieces = $(this).find("td:eq(" + $(this).find('td[data-column="TotalPieces"]').index() + ")").text();
                        var TotalGrossWeight = $(this).find("td:eq(" + $(this).find('td[data-column="TotalGrossWeight"]').index() + ")").text();

                        var ShipmentDetailViewModel = {
                            PartNumber: Number(partNumber) + 1,
                            AWBSNo: currentawbsno == 0 ? currentPomailSno : currentawbsno,
                            HAWBSNo: hawb,
                            PartSNo: $('#hdnDailyflightsno').val() == "" ? 0 : $('#hdnDailyflightsno').val(),
                            Pieces: Number(DOPieces),
                            GrossWeight: Number(grossWt),
                            VolumeWeight: 0,
                            IsBUP: 0,
                            SPHCSNo: 0,
                            SPHCTransSNo: SPHCTransSNo
                        };
                        ShipmentDetailArray.push(ShipmentDetailViewModel);
                    });

                }
                else if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length == 0 && $("div[id$='areaTrans_import_doflightdetail']").length != 0) {
                    $("tr[id*=areaTrans_import_doflightdetail]").each(function () {
                        console.log($(this).find("span#TotalPieces").html());
                        pieces = Number(pieces) + Number($(this).find("span[id^='TotalPieces']").html().split('/')[0]);
                        grossWt = Number(grossWt) + Number($(this).find("span[id^='TotalGrossWeight']").html().split('/')[0]);
                        var ShipmentDetailViewModel = {
                            PartNumber: Number(partNumber) + 1,
                            AWBSNo: currentawbsno == 0 ? currentPomailSno : currentawbsno,
                            HAWBSNo: hawb,
                            PartSNo: 0,
                            Pieces: Number(pieces),
                            GrossWeight: Number(grossWt),
                            VolumeWeight: 0,
                            IsBUP: 0,
                            SPHCSNo: 0,
                            SPHCTransSNo: SPHCTransSNo
                        };
                        ShipmentDetailArray.push(ShipmentDetailViewModel);
                    });
                }
                else {
                    $("div[id$='areaTrans_import_doshipmenttypedetail']").find("[id^='areaTrans_import_doshipmenttypedetail']").each(function (i, row) {
                        pieces = Number(pieces) + Number($(this).find("span[id^='BupPcs']").text()) + Number($(this).find("input[id^='_tempBulkPcs']").val());
                        grossWt = Number(grossWt) + Number($(this).find("span[id^='BupGrWt']").text()) + Number($(this).find("input[id^='_tempBulkGrWt']").val());

                        var ShipmentDetailViewModel = {
                            PartNumber: Number(partNumber) + 1,
                            AWBSNo: currentawbsno == 0 ? currentPomailSno : currentawbsno,
                            HAWBSNo: hawb,
                            PartSNo: $(this).find("span[id^='DailyFlightSNo']").text(),
                            Pieces: Number($(this).find("span[id^='BupPcs']").text()) + Number($(this).find("input[id^='_tempBulkPcs']").val()),
                            GrossWeight: Number($(this).find("span[id^='BupGrWt']").text()) + Number($(this).find("input[id^='_tempBulkGrWt']").val()),
                            VolumeWeight: 0,
                            IsBUP: Number($(this).find("span[id^='BupPcs']").text()) > 0 ? 1 : 0,
                            SPHCSNo: 0,
                            SPHCTransSNo: SPHCTransSNo
                        };
                        ShipmentDetailArray.push(ShipmentDetailViewModel);
                    });
                }
            }
            else if (subprocesssno == 2135) {
                if ($("#hdnChargePcs").length > 0) {
                    pieces = $("#hdnChargePcs").val();
                    grossWt = $("#hdnChargeGrWt").val();
                }
                else {
                    $("div[id$='areaTrans_import_doshipmenttypedetail']").find("[id^='areaTrans_import_doshipmenttypedetail']").each(function (i, row) {
                        pieces = Number(pieces) + Number($(this).find("span[id^='BupPcs']").text()) + Number($(this).find("input[id^='_tempBulkPcs']").val());
                        grossWt = Number(grossWt) + Number($(this).find("span[id^='BupGrWt']").text()) + Number($(this).find("input[id^='_tempBulkGrWt']").val());

                        var ShipmentDetailViewModel = {
                            PartNumber: Number(partNumber) + 1,
                            AWBSNo: currentawbsno == 0 ? currentPomailSno : currentawbsno,
                            HAWBSNo: hawb,
                            PartSNo: $(this).find("span[id^='DailyFlightSNo']").text(),
                            Pieces: Number($(this).find("span[id^='BupPcs']").text()) + Number($(this).find("input[id^='_tempBulkPcs']").val()),
                            GrossWeight: Number($(this).find("span[id^='BupGrWt']").text()) + Number($(this).find("input[id^='_tempBulkGrWt']").val()),
                            VolumeWeight: 0,
                            IsBUP: Number($(this).find("span[id^='BupPcs']").text()) > 0 ? 1 : 0,
                            SPHCSNo: 0,
                            SPHCTransSNo: SPHCTransSNo
                        };
                        ShipmentDetailArray.push(ShipmentDetailViewModel);
                    });
                }
            }
            var IsRushHandling = "RSH=" + ($("#RushHandling").is(':checked') ? 1 : 0);

            if (subprocesssno != 2146)
                var deliveryorderSNo = 0;

            deliveryorderSNo = userContext.SysSetting.ICMSEnvironment.toUpperCase() == "GA" && subprocesssno == 2146 ? $("#hdnChargeDOSNo").val() : deliveryorderSNo;

            $.ajax({
                url: "Services/Import/DeliveryOrderService.svc/GetCharges", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ TariffSNo: parseInt(key), AWBSNo: currentawbsno == 0 ? currentPomailSno : currentawbsno, CityCode: currentdetination, HAWBSNo: hawb, ProcessSNo: ProcessSNo, SubProcessSNo: parseInt(subprocesssno), GrWT: parseFloat(grossWt), ChWt: parseFloat(grossWt), pValue: parseFloat(0), sValue: parseFloat(0), Pieces: parseInt(pieces), DOSNo: parseInt(deliveryorderSNo), PDSNo: parseInt(0), lstShipmentInfo: ShipmentDetailArray, Remarks: IsRushHandling, POMailSNo: parseInt(currentPomailSno) }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var resData = jQuery.parseJSON(result);
                    var doCharges = resData.Table0;
                    if (doCharges.length > 0) {
                        var doItem = doCharges[0];
                        if (rowId == undefined) {
                            $("span[id^='PBasis']").closest("td").find("input[id^='_tempPValue']").val(doItem.PrimaryBasis != 'KG' ? doItem.pValue : (parseFloat(grossWt) > parseFloat(doItem.pValue) ? grossWt : doItem.pValue));
                            $("span[id^='PBasis']").closest("td").find("input[id^='PValue']").val(doItem.PrimaryBasis != 'KG' ? doItem.pValue : (parseFloat(grossWt) > parseFloat(doItem.pValue) ? grossWt : doItem.pValue));
                            $("span[id^='PBasis']").text(doItem.PrimaryBasis);
                            $("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").val(doItem.SecondaryBasis != 'KG' ? doItem.sValue : (parseFloat(grossWt) > parseFloat(doItem.sValue) ? grossWt : doItem.sValue));
                            $("span[id^='SBasis']").closest("td").find("input[id^='SValue']").val(doItem.SecondaryBasis != 'KG' ? doItem.sValue : (parseFloat(grossWt) > parseFloat(doItem.sValue) ? grossWt : doItem.sValue));
                            $("span[id^='SBasis']").text(doItem.SecondaryBasis);
                            $("span[id^='Amount']").text(doItem.ChargeAmount);
                            $("span[id^='TotalTaxAmount']").text(doItem.TotalTaxAmount);
                            $("span[id^='TotalAmount']").text(doItem.TotalAmount);

                            $("span[id^='TotalAmount']").attr('title', doItem.ChargeRemarks);
                            //$("span[id^='Remarks']").text(doItem.ChargeRemarks);
                            $("span[id^='Rate']").text(doItem.Rate);
                            if ($("span[id^='SBasis']").text() == undefined || $("span[id^='SBasis']").text() == "") {
                                $("span[id^='SBasis']").closest("td").find("input").css("display", "none");
                                $("span[id^='SBasis']").closest("td").find("span").css("display", "none");
                            }
                            else {
                                $("span[id^='SBasis']").closest("td").find("span").show();
                                $("span[id^='SBasis']").closest("td").find("input[id^='SValue']").show();
                                $("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").hide();
                            }
                            $("input[id^='DescriptionRemarks']").closest("td").css("display", "none");
                            $("input[id^='DescriptionRemarks']").closest('td').append("&nbsp;&nbsp;<span id=_DescriptionRemarks_>" + doItem.DescriptionRemarks + "</span>");
                            $("input[id^='TaxPercent']").closest('td').append("&nbsp;&nbsp;<span id=_TaxPercent_>" + doItem.TaxPercent + "</span>");


                        }
                        else {
                            $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val(doItem.PrimaryBasis != 'KG' ? doItem.pValue : (parseFloat(grossWt) > parseFloat(doItem.pValue) ? grossWt : doItem.pValue));
                            $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val(doItem.PrimaryBasis != 'KG' ? doItem.pValue : (parseFloat(grossWt) > parseFloat(doItem.pValue) ? grossWt : doItem.pValue));
                            $("span[id^='PBasis_" + rowId + "']").text(doItem.PrimaryBasis);
                            $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='_tempSValue']").val(doItem.SecondaryBasis != 'KG' ? doItem.sValue : (parseFloat(grossWt) > parseFloat(doItem.sValue) ? grossWt : doItem.sValue));
                            $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='SValue']").val(doItem.SecondaryBasis != 'KG' ? doItem.sValue : (parseFloat(grossWt) > parseFloat(doItem.sValue) ? grossWt : doItem.sValue));
                            $("span[id^='SBasis_" + rowId + "']").text(doItem.SecondaryBasis);
                            $("span[id^='Amount_" + rowId + "']").text(doItem.ChargeAmount);
                            $("span[id^='TotalTaxAmount_" + rowId + "']").text(doItem.TotalTaxAmount);
                            $("span[id^='TotalAmount_" + rowId + "']").text(doItem.TotalAmount);
                            $("span[id^='Remarks_" + rowId + "']").text(doItem.ChargeRemarks);
                            $("input[id^='Remarks_" + rowId + "']").val(doItem.ChargeRemarks);
                            $("input[id^='DescriptionRemarks_" + rowId + "']").closest('td').append("&nbsp;&nbsp;<span id=_DescriptionRemarks_" + rowId + ">" + doItem.DescriptionRemarks + "</span>");
                            $("input[id^='TaxPercent_" + rowId + "']").closest('td').append("&nbsp;&nbsp;<span id=_TaxPercent_" + rowId + ">" + doItem.TaxPercent + "</span>");


                            $("span[id^='Rate_" + rowId + "']").text(doItem.Rate);//added by jitendra kumar 14 November
                            $("input[id^='DescriptionRemarks_" + rowId + "']").closest("td").css("display", "none");
                            if ($("span[id^='SBasis_" + rowId + "']").text() == undefined || $("span[id^='SBasis_" + rowId + "']").text() == "") {
                                $("span[id^='SBasis_" + rowId + "']").closest("td").find("input").css("display", "none");
                                $("span[id^='SBasis_" + rowId + "']").closest("td").find("span").css("display", "none");
                            }
                            else {
                                $("span[id^='SBasis_" + rowId + "']").closest("td").find("span").show();
                                $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id*='_tempSValue']").show();
                            }
                        }
                    }

                    $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                        totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat($(this).find("span[id^='TotalAmount']").text());

                        $(this).find("span[id^='Remarks_" + rowId + "']").text($(this).find("span[id^='Remarks_" + rowId + "']").text().substring(0, 50));
                        $(this).find("span[id^='Remarks_" + rowId + "']").closest('td').hover(function () {
                            $(this).prop('title', $(this).find("input[id^='Remarks_" + rowId + "']").val());
                        });
                    });

                    totalAmountDO = parseFloat(totalAmountDO) + parseFloat(totalHandlingCharges);
                    $("span[id='TotalAmountDO']").text(totalAmountDO.toFixed(3));
                },
                error: function (ex) {
                    var ex = ex;
                }
            });
        }
    }
}

function ValidateExistingCharges(textId, textValue, keyId, keyValue) {
    var Flag = true;
    $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (row, tr) {
        if ($(tr).find("input[id^='Text_ChargeName']").attr("id") != textId) {
            if ($(tr).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").key() == keyValue) {
                ShowMessage('warning', 'Information!', "" + textValue + " Already Added.", "bottom-right");
                $("#" + textId).data("kendoAutoComplete").setDefaultValue("", "");

                $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val("");
                $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val("");
                $("span[id^='PBasis_" + rowId + "']").text("");
                $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val("");
                $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val("");
                $("span[id^='SBasis_" + rowId + "']").text("");
                $("span[id^='Amount_" + rowId + "']").text("");
                $("span[id^='TotalTaxAmount" + rowId + "']").text("");
                $("span[id^='TotalAmount_" + rowId + "']").text("");
                $("span[id^='Remarks" + rowId + "']").text("");
                Flag = false;
            }
        }
    });
    return Flag;
}

function BindDOOtherCharge() {
    var dbtableName = "DOOtherCharge";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: pageType,
        isGetRecord: true,
        currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: "",
        servicePath: './Services/Shipment/AcceptanceService.svc',
        getRecordServiceMethod: "GetAWBOtherChargeData",
        masterTableSNo: currentawbsno,
        caption: "Other Charges",
        initRows: 1,
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
        {
            name: 'AWBSNo', type: 'hidden', value: $('#hdnAWBSNo').val()
        },
        {
            name: pageType == 'EDIT' ? 'Type' : 'Type', display: 'Type', type: 'select', ctrlOptions: { 'PP': 'PREPAID', 'CC': 'COLLECT' }, isRequired: true, onChange: function (evt, rowIndex) { }, ctrlCss: { width: '80px' }
        },
        {
            name: "OtherCharge", display: "Charge Code", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "90px" }, isRequired: true, AutoCompleteName: 'DeliveryOrder_AWBOtherChargeCode', filterField: 'OtherChargeCode'
        },
        {
            name: pageType == 'EDIT' ? 'DueType' : 'DueType', display: 'Due Carrier/Agent', type: 'select', ctrlOptions: { 'Agent': 'Agent', 'Carrier': 'Carrier' }, isRequired: true, onChange: function (evt, rowIndex) { }, ctrlCss: { width: '80px' }
        },
        {
            name: 'Amount', display: 'Amount', type: 'text', ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { Controltype: 'decimal2', maxlength: 10 }, isRequired: true, value: 0
        }
        ],
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, removeLast: true }
    });
}

function BindPayment() {
    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/GetPaymentRecord?AWBSNo=" + currentawbsno + "&POMailSNo=" + parseInt(currentPomailSno), async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var resData = jQuery.parseJSON(result);
            var paymentDetail = resData.Table0;
            if (result != "" && paymentDetail.length != 0) {
                $('#divareaTrans_import_dohandlingcharge').hide()
                //var resData = jQuery.parseJSON(result);
                //var paymentDetail = resData.Table0;
                $("#divDetail").show();
                $("#divDetail5").html('');
                var strVar = "";
                strVar += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr style=\"background-color: #C0C0C0\"><tbody class=\"ui-widget-content\"><td class=\"ui-state-active caption formSection\" align=\"left\" colspan=\"8\">Payment Details<\/td><\/tr>";
                strVar += "<tr style=\"font-weight: bold\">";
                strVar += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">SNo<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Process<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">PD No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Invoice No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Amount<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Payment Mode<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Action<\/td><\/tr>";

                if (paymentDetail.length > 0) {
                    if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "GA") {
                        $("#divDetail5").append("<table class='WebFormTable' validateonsubmit='true'  id=''><tbody><tr><b>Cash/Credit : </b><input type='radio'  data-radioval='CASH' class='' name='CustomerType' checked='True' id='CustomerType' value='0'>CASH <input type='radio'  data-radioval='CREDIT' class='' name='CustomerType' id='CustomerType' value='1'>CREDIT");
                        $('input:radio[name=CustomerType]').change(function () { AuthenticateBillTo(this); });


                        $("#divDetail5").append("<b>Bill To : </b><input type=\"hidden\" name=\"BillTo\" id=\"BillTo\" value=\"\" /><input type=\"text\" class=\"\" name=\"Text_BillTo\"  id=\"Text_BillTo\" controltype=\"autocomplete\" maxlength=\"\" data-width=\"50px\" value=\"\" placeholder=\"\" />&nbsp;<span style='color:red' id='spanbillto'>*</span>&nbsp;<input type='text' class='k-input' name='BillToText' id='BillToText' style='width: 200px; text-transform: uppercase;' controltype='alphanumericupper' maxlength='100' value='' placeholder='walkin customer name' data-role='alphabettextbox' autocomplete='off'></tr></tbody></table>");
                        cfi.AutoCompleteV2("BillTo", "Name", "DeliveryOrderDLV_vBillTo", CheckAgentCreditLimit, "contains");

                        for (var i = 0; i < paymentDetail.length; i++) {
                            var Type = paymentDetail[i].Process == "Delivery Order" ? "DO" : "CN";
                            var PrintSNo = Type == "DO" ? paymentDetail[i].DOSNo : paymentDetail[i].DLVSNo;
                            if (paymentDetail[i].InvoiceSNo == "" || paymentDetail[i].InvoiceSNo == "0") {
                                strVar += "<tr style=\"font-weight: bold\">";
                                strVar += "<td class=\"ui-widget-content\">" + (0 + 1) + "<\/td><td class=\"ui-widget-content\">" + paymentDetail[i].Process + "<\/td><td class=\"ui-widget-content\">" + paymentDetail[i].DONo + "<\/td><td class=\"ui-widget-content\">" + paymentDetail[i].PDNo + "<\/td><td class=\"ui-widget-content\">" + paymentDetail[i].InvoiceNo + "<\/td><td class=\"ui-widget-content\">" + paymentDetail[i].Amount + "<\/td><td class=\"ui-widget-content\"><\/td><td class=\"ui-widget-content\">";
                                strVar += "<input id=\"btnPrints_" + i + "\" type=\"button\" value=\"Getcharges\" onclick=\"return GetChargesGA('" + paymentDetail[i].DOSNo + "',this);\"><input type=\"hidden\" name=\"hdnChargeDOSNo\" id=\"hdnChargeDOSNo\" value=" + paymentDetail[i].DOSNo + " /><input type=\"hidden\" name=\"hdnChargeGrWt\" id=\"hdnChargeGrWt\" value=" + paymentDetail[i].GrossWeight + " /><input type=\"hidden\" name=\"hdnChargePcs\" id=\"hdnChargePcs\" value=" + paymentDetail[i].Pieces + " />";

                                if (Number(paymentDetail[i].IsRushHandling) == 1)
                                    strVar += "<input type=\"checkbox\" disabled=\"disabled\" checked  name=\"RushHandling\" id=\"RushHandling_" + i + "\" colname=\"rush handling\" validatename=\"RushHandling[]\">Rush Handling<\/td><\/tr>"
                                else
                                    strVar += "<input type=\"checkbox\" disabled=\"disabled\"  name=\"RushHandling\" id=\"RushHandling_" + i + "\" colname=\"rush handling\" validatename=\"RushHandling[]\">Rush Handling<\/td><\/tr>"
                            }
                            else {
                                strVar += "<tr style=\"font-weight: bold\">";
                                strVar += "<td class=\"ui-widget-content\">" + (i + 1) + "<\/td><td class=\"ui-widget-content\">" + paymentDetail[i].Process + "<\/td><td class=\"ui-widget-content\">" + paymentDetail[i].DONo + "<\/td><td class=\"ui-widget-content\">" + paymentDetail[i].PDNo + "<\/td><td class=\"ui-widget-content\">" + paymentDetail[i].InvoiceNo + "<\/td><td class=\"ui-widget-content\">" + paymentDetail[i].Amount + "<\/td><td class=\"ui-widget-content\">" + paymentDetail[i].PaymentMode + "<\/td><td class=\"ui-widget-content\">";

                                if (paymentDetail[i].Process == "Delivery Order") {
                                    strVar += "<input id=\"btnPrints_" + i + "\" type=\"button\" disabled=\"disabled\" value=\"Getcharges\" onclick=\"return GetChargesGA('" + paymentDetail[i].DOSNo + "',this);\"><input type=\"checkbox\" disabled=\"disabled\" name=\"RushHandling\" id=\"RushHandling_" + i + "\" colname=\"rush handling\" validatename=\"RushHandling[]\">Rush Handling<input id=\"btnPrints\" type=\"button\" value=\"Print\" onclick=\"PrintSlip('DO','" + PrintSNo + "','');\"><\/td><\/tr>"
                                }
                                else {
                                    strVar += "<input id=\"btnPrints_" + i + "\" type=\"button\" value=\"Getcharges\" disabled=\"disabled\" onclick=\"return GetChargesGA('" + paymentDetail[i].DOSNo + "',this);\"><input type=\"checkbox\" disabled=\"disabled\"  name=\"RushHandling\" id=\"RushHandling_" + i + "\" colname=\"rush handling\" validatename=\"RushHandling[]\">Rush Handling<input id=\"btnPrints\" type=\"button\" value=\"Print\" onclick=\"PrintSlip('CN','" + paymentDetail[i].InvoiceSNo + "','" + paymentDetail[i].DLVSNo + "');\"><\/td><\/tr>"
                                }
                            }
                        }
                        strVar += "<\/tbody><\/table>";
                        strVar += "<\/br>";
                        $('#divDetail3').html(strVar);
                    }
                    else {
                        for (var i = 0; i < paymentDetail.length; i++) {
                            var Type = paymentDetail[i].Process == "Delivery Order" ? "DO" : "CN";
                            var PrintSNo = Type == "DO" ? paymentDetail[i].DOSNo : paymentDetail[i].DLVSNo;
                            strVar += "<td class=\"ui-widget-content\">" + (i + 1) + "<\/td><td class=\"ui-widget-content\">" + paymentDetail[i].Process + "<\/td><td class=\"ui-widget-content\">" + paymentDetail[i].DONo + "<\/td><td class=\"ui-widget-content\">" + paymentDetail[i].PDNo + "<\/td><td class=\"ui-widget-content\">" + paymentDetail[i].InvoiceNo + "<\/td><td class=\"ui-widget-content\">" + paymentDetail[i].Amount + "<\/td><td class=\"ui-widget-content\">" + paymentDetail[i].PaymentMode + "<\/td><td class=\"ui-widget-content\">";

                            if (paymentDetail[i].Process == "Delivery Order")
                                strVar += "<input id=\"btnPrint\" type=\"button\" value=\"Print\" onclick=\"PrintSlip('DO','" + paymentDetail[i].InvoiceSNo + "','');\"><\/td><\/tr>"
                            else
                                strVar += "<input id=\"btnPrint\" type=\"button\" value=\"Print\" onclick=\"PrintSlip('CN','" + paymentDetail[i].InvoiceSNo + "','" + paymentDetail[i].DLVSNo + "');\"><\/td><\/tr>"
                        }
                        $('#divDetail3').html(strVar);
                    }
                }
                else {
                    strVar += "<tr><td class=\"ui-state-active caption formSection\" align=\"left\" colspan=\"8\">No Record Found<\/td><\/tr>";
                    strVar += "<\/tbody><\/table>";
                    strVar += "<\/br>";
                    $('#divDetail3').html(strVar);
                }
            }
            else {
                CleanUI();
                ShowMessage('warning', 'Warning - DO', "Need to create Do first", "bottom-right");
            }
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - DO', "AWB No. [" + CurrentAWBNo + "] -  unable to process.", "bottom-right");
        },
        complete: function () {
            if ($("#Text_BillTo").length != 0)
                $("#Text_BillTo").data("kendoAutoComplete").enable(false);

            if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "G9")
                $("#btnSave").hide();
        }
    });
}

function BindCancelDO() {
    if (currentPomailSno > 0) {
        subprocesssno = 3534
        SubprocessCancelDo = "CANCEL DO PO"
        //reset releaseDO
        SubprocessReleaseDo = ""
    }
    else {
        subprocesssno = 2305
        SubprocessCancelDo = "CANCEL DO CARGO"
        //reset releaseDO
        SubprocessReleaseDo = ""
    }
    $('#divDetail').append("<table id='tblDOCancel'></table>");
    if ($("#" + "Text_DONo").data("kendoAutoComplete") == undefined) {
        cfi.AutoCompleteV2("DONo", "DeliveryOrderNo", "DeliveryOrder_DONo", BindPhysicalDODetail, "contains");
    }

    $("#divareaTrans_import_doflightdetail").css("display", "none");
    $("#divareaTrans_import_dohandlingcharge").css("display", "none");
    $("table[id^='__tblcancel do__']")[1].hidden = true;
    var CheckPhysicalDDO = 0;
    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/GetCancelDODetail?AWBSNo=" + currentawbsno + "&POMailSNo=" + currentPomailSno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var resData = jQuery.parseJSON(result);
            CheckPhysicalDDO = resData.Table0[0].RestDeliveryOrder;
            var doDataDetail = resData.Table1;
            $('#divDetail').show();
            if (currentPomailSno > 0) {
                if (subprocesssno == 3534 && IsColorDLV == 2) {
                    ShowMessage('warning', 'Warning - Delivery Order', "Physical Delivery already processed,Can't proceed with DO Cancellation process", " ", "bottom-right");
                }
            }
            else {
                if (subprocesssno == 2305 && IsColorDLV == 2) {
                    ShowMessage('warning', 'Warning - Delivery Order', "Physical Delivery already processed,Can't proceed with DO Cancellation process", " ", "bottom-right");
                }
            }

            if (CheckPhysicalDDO == 1) {
                checkcanceldo = false;
                $('#divDetail').hide();
            }
            else {
                checkcanceldo = true;
            }

            if (doDataDetail.length > 0) {
                var strVar = "";
                strVar += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr style=\"background-color: #C0C0C0\"><tbody class=\"ui-widget-content\"><td class=\"ui-state-active caption formSection\" align=\"left\" colspan=\"11\">Delivery Order Details<\/td><\/tr>";
                strVar += "<tr style=\"font-weight: bold\">";
                strVar += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO Date<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Air Waybill Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">HAWB No / Pieces<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO Pieces<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Gross Weight<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Total Charges<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Charges Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Participant Name<\/td><td style=\"padding-left: 5px; width: 250px\" class=\"ui-widget-header\">Action<\/td><\/tr>";

                for (var i = 0; i < doDataDetail.length; i++) {
                    strVar += "<td class=\"ui-widget-content\">" + doDataDetail[i].DeliveryOrderNo + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DeliveryOrderDate + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].WaybillType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].HouseNo + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DOPieces + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DOGrossWeight + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].TotalCharges + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].ChargesType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].ParticipantName + "<\/td><td class=\"ui-widget-content\"><input id=\"btnPrint\" type=\"button\" value=\"DO Print\" onclick=\"PrintSlip('DOCancel'," + doDataDetail[i].DOSNo + ");\">";
                    strVar += "<\/td><\/tr>"
                }
                strVar += "<\/tbody><\/table>";
                strVar += "<\/br>";
                $('#divDetail3').html(strVar);
            }
        },
        error: function (ex) {
            var ex = ex;
        }
    });
}

function chargeNoteDisabled(dlvData, cnData) {
    debugger
    var isOFW = dlvData.IsOFW;
    var invoiceDate = dlvData.DeliveryOrderDate;
    var DoNumber = dlvData.DeliveryOrderNo;

    var filteredcnData = cnData.filter(item => item.DeliveryOrderNo == DoNumber);
    filteredcnData = filteredcnData.sort(function (a, b) {
        var dateA = new Date(a.InvoiceDate), dateB = new Date(b.InvoiceDate)
        return dateB - dateA //sort by date ascending
    })

    if (isOFW === 'True') {
        return "disabled=disabled"
    }
    else {
        var getDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        var prevInvoiceDate = new Date(new Date(invoiceDate).getFullYear(), new Date(invoiceDate).getMonth(), new Date(invoiceDate).getDate());
        if (getDate.getTime() == prevInvoiceDate.getTime()) {
            return "disabled=disabled";
        }
        else if (filteredcnData != undefined && filteredcnData.length != 0 && dlvData.IsOFW === 'False') {
            var newDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
            var InvoiceDate = new Date(new Date(filteredcnData[0].InvoiceDate).getFullYear(), new Date(filteredcnData[0].InvoiceDate).getMonth(), new Date(filteredcnData[0].InvoiceDate).getDate());
            if (newDate.getTime() == InvoiceDate.getTime()) {
                return "disabled=disabled"
            }
            else {
                return ""
            }
        }
        else {
            return "";
        }
    }



    if (filteredcnData != undefined && filteredcnData.length != 0 && dlvData.IsOFW === 'False') {
        var newDate = new Date().getDate() + '/' + new Date().getDate() + '/' + new Date().getDate();
        var InvoiceDate = new Date(filteredcnData[0].InvoiceDate).getDate() + '/' + new Date(filteredcnData[0].InvoiceDate).getDate() + '/' + new Date(filteredcnData[0].InvoiceDate).getDate();
        if (newDate == InvoiceDate) {
            return "disabled=disabled"
        }
        else {
            return ""
        }
    }
    else if (dlvData.IsOFW === 'True') {
        return "disabled=disabled"
    }
    else {
        return ""
    }
}

function BindPhysicalDO() {
    if (currentPomailSno > 0) {
        subprocesssno = 3533
        SubprocessReleaseDo = "RELEASE DO PO"
        //reset cancelDO
        SubprocessCancelDo = "";
    }
    else {
        subprocesssno = 2137
        SubprocessReleaseDo = "RELEASE DO CARGO"
        //reset cancelDO
        SubprocessCancelDo = "";
    }

    var IsCustomClearData = 0;

    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/CheckWaybillDetail?AWBNo=" + currentawbsno + "&ArrivedShipmentSNo=" + currentArrivedShipmentSNo + "&ICNNo=" + currentPomailSno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result != "") {
                var resData = jQuery.parseJSON(result);
                var CustomDetails = resData.Table2;
                IsDoChargeApplicable = resData.Table3[0].IsDoChargeApplicable;

                $("#btnNew").hide();

                IsCustomClearData = CustomDetails[0].IsCustomClear;
                if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "GA" && IsCustomClearData == 0) {
                    ShowMessage('warning', 'Warning - Delivery Order', 'Custom Information is mandatory to proceed with DLV.', " ", "bottom-right");
                    $("#divDetail").hide();
                    flag = false;
                    return false
                }
            }
        }
    })

    if (Number(IsCustomClearData) > 0) {
        if ($("#" + "Text_DONo").data("kendoAutoComplete") == undefined) {
            cfi.AutoCompleteV2("DONo", "DeliveryOrderNo", "DeliveryOrder_DeliveryOrderNo", BindPhysicalDODetail, "contains");
        }

        cfi.AutoCompleteV2("DeliverdTo", "Name,IdCardNo", "DeliveryOrder_ParticipantName", null, "contains");
        cfi.AutoCompleteV2("PDULDNo", "ULDNo", "DeliveryOrder_PDULDNo", GetBupDetails, "contains", ",");
        cfi.AutoCompleteByDataSource("CustomerType", CustomerDataSource, HideCCCharges);
        var CheckPhysicalDDO = 0;
        var IsPayment = 0;
        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/GetPhysicalDODetail?AWBSNo=" + currentawbsno + "&ArrivedShipmentSNo=" + currentArrivedShipmentSNo + "&POMailSNo=" + parseInt(currentPomailSno), async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var resData = jQuery.parseJSON(result);
                var dlvData = resData.Table0;
                CheckPhysicalDDO = resData.Table1[0].RestDeliveryOrder;
                IsPayment = resData.Table1[0].IsPayment;
                var cnData = resData.Table2;

                $('#divDetail').show();
                $("#Text_CustomerType").data("kendoAutoComplete").setDefaultValue("1", "REGULAR");

                if ($("#Text_CustomerType").data("kendoAutoComplete").key() == 1) {
                    if ($("#Text_DeliverdTo").data("kendoAutoComplete") != undefined) {
                        $("#Text_DeliverdTo").data("kendoAutoComplete").enable(true);
                        $("#Text_DeliverdTo").attr("data-valid", "required").attr("data-valid-msg", "Select Authorized Person.");
                    }
                    $("#AuthorizedPersonId").closest("tr").hide();
                    $("#AuthorizedPersonCompany").closest("tr").hide();
                }
                else {
                    $("#Text_DeliverdTo").data("kendoAutoComplete").enable(false);
                    $("#AuthorizedPersonId").closest("tr").show();
                    $("#AuthorizedPersonCompany").closest("tr").show();
                    if (userContext.SysSetting.ICMSEnvironment == "JT") {
                        $("#AuthorizedPersonId").attr("data-valid", "required").attr("data-valid-msg", "Enter Authorized Person Id.");
                        $("#AuthorizedPersonName").attr("data-valid", "required").attr("data-valid-msg", "Enter Authorized Person Name.");
                        $("#AuthorizedPersonCompany").attr("data-valid", "required").attr("data-valid-msg", "Enter Authorized Person Company.");
                    }
                    else {
                    }
                }

                $("#CustomerType,#Text_CustomerType").val('');
                $('#Text_CustomerType').data("kendoAutoComplete").enable(false);
                $("span.k-datepicker").css("width", "30%");

                if (CheckPhysicalDDO == 1) {
                    $('#divDetail').hide();
                    $('#btnSave').hide();
                }
                else {
                    $('#btnSave').show();
                }

                if (dlvData.length > 0) {
                    var strVar = "";
                    strVar += "<table class=\"tdPadding\" id=\"tblDLV\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr style=\"background-color: #C0C0C0\"><tbody class=\"ui-widget-content\"><td class=\"ui-state-active caption formSection\" align=\"left\" colspan=\"11\">Physical Delivery Details<\/td><\/tr>";
                    strVar += "<tr   style=\"font-weight: bold\">";
                    strVar += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Customer Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO Date<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO Pieces<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Gross Weight<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Total Pieces<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Total Gross Weight<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DLV Date<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Physical Delivery Date<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Out Of Warehouse<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Action<\/td><\/tr>";

                    for (var i = 0; i < dlvData.length; i++) {
                        strVar += "<tr id='trtblDLV'><td  data-column= CustomerType class=\"ui-widget-content\">" + dlvData[i].CustomerType + "<\/td><td  data-column= DeliveryOrderNo class=\"ui-widget-content\">" + dlvData[i].DeliveryOrderNo + "<input type=\"hidden\" id=\"hdnDailyflightsno\" name=\"hdnDailyflightsno\" value=" + dlvData[i].DailyFlightSNo + "><\/td><td data-column= DeliveryOrderDate class=\"ui-widget-content\">" + dlvData[i].DeliveryOrderDate + "<\/td><td data-column= DOPieces class=\"ui-widget-content\">" + dlvData[i].DOPieces + "<\/td><td data-column= DOGrossWeight class=\"ui-widget-content\">" + dlvData[i].DOGrossWeight + "<\/td><td data-column= TotalPieces class=\"ui-widget-content\">" + dlvData[i].TotalPieces + "<\/td><td data-column= TotalGrossWeight class=\"ui-widget-content\">" + dlvData[i].TotalGrossWeight + "<\/td><td data-column= TotalGrossWeight class=\"ui-widget-content\">" + dlvData[i].PDDateTime + "<\/td><td data-column= TotalGrossWeight class=\"ui-widget-content\">" + ((dlvData[i].PDSDateTime != undefined) ? dlvData[i].PDSDateTime : '') + "<\/td><td class=\"ui-widget-content\"><input id=\"chkOFW_" + i + "\" type=\"checkbox\" value=\"" + dlvData[i].IsOFW + "\" onclick=\"Disable(this)\"\"><\/td><td class=\"ui-widget-content\"><input " + chargeNoteDisabled(dlvData[i], cnData) + " id=\"btnChargeNote_" + i + "\" type=\"button\" value=\"Charge Note\" onclick=\"OpenPopUp(" + dlvData[i].DLVSNo + "," + dlvData[i].DOGrossWeight + ", 0, 0, 'DLV',0,0,0," + dlvData[i].deliveryorderSNo + ");\">";

                        strVar += "&nbsp;<input id=\"btnPrint_" + i + "\" type=\"button\" value=\"PDS Print\" onclick=\"PrintSlip('CNDLV','" + dlvData[i].deliveryorderSNo + "','" + dlvData[i].DLVSNo + "'," + i + "," + dlvData[i].deliveryorderSNo + "," + dlvData[i].DLVSNo + ");\"><\/td><\/tr>"
                    }
                    strVar += "<\/tbody><\/table>";
                    strVar += "<\/br>";


                    if (cnData.length > 0) {
                        strVar += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr style=\"background-color: #C0C0C0\"><tbody class=\"ui-widget-content\"><td class=\"ui-state-active caption formSection\" align=\"left\" colspan=\"6\">Charge Note Details<\/td><\/tr>";
                        strVar += "<tr style=\"font-weight: bold\">";
                        strVar += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Invoice No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Invoice Date<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Total Amount<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">PD No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Action<\/td><\/tr>";

                        for (var i = 0; i < cnData.length; i++) {
                            strVar += "<td class=\"ui-widget-content\">" + cnData[i].InvoiceNo + "<\/td><td class=\"ui-widget-content\">" + cnData[i].InvoiceDate + "<\/td><td class=\"ui-widget-content\">" + cnData[i].GrandTotal + "<\/td><td class=\"ui-widget-content\">" + cnData[i].DeliveryOrderNo + "<\/td><td class=\"ui-widget-content\">" + cnData[i].PDNo + "<\/td><td class=\"ui-widget-content\"><input id=\"btnPrint" + i + "\" type=\"button\" value=\"Print\" onclick=\"PrintSlip('CN'," + cnData[i].InvoiceSNo + "," + cnData[i].DLVSNo + ");\"><\/td><\/tr>"
                        }
                        strVar += "<\/tbody><\/table>";
                        strVar += "<\/br>";
                    }
                    $('#divDetail3').html(strVar);
                    $('#divDetail3').find("table[id='tblDLV']").find("input[id^='chkOFW']").each(function () {
                        $(this).prop('checked', true);
                        if ($(this).val().toUpperCase() == "TRUE") {
                            $(this).prop('disabled', true);
                        }
                    })
                    $('#divDetail3').show();
                }
            },
            error: function (ex) {
                var ex = ex;
            }
        });
    }
}

function SaveCustomReference() {
    var BOEFlag = false;
    var IsBOEVerification = $("#chkBoeVerifi").prop('checked') == true ? 1 : 0;
    var BOENo = $("#BOENo").val();
    var BOEDate = $("#BOEDate").val();
    if (BOENo == "0") {
        $("#BOENo").val("");
    }
    if (BOENo == "") {
        ShowMessage('warning', 'Information!', "Kindly Enter Custom Reference Number", "bottom-right");
        BOEFlag = true;

    }
    if (BOEDate == "" && BOEFlag == false) {
        ShowMessage('warning', 'Information!', "Kindly Select Custom Reference Date", "bottom-right");
        BOEFlag = true;
    }
    if (BOEFlag == false) {
        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/SaveCustomReference", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AWBSNo: currentawbsno, BOEVerification: IsBOEVerification, UpdatedBy: userContext.UserSNo, BOENo: BOENo, BOEDate: BOEDate }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "0") {
                    ShowMessage('success', 'Success -Custom Reference Information', "Processed Successfully", "bottom-right");
                    ReloadSameGridPage("CUSTOMREFERENCENUMBER");
                    flag = true;
                }
                else if (result.split('?')[0] == "1") {
                    ShowMessage('warning', 'Information!', result.split('?')[1], "bottom-right");
                    flag = false;
                }
                else
                    ShowMessage('warning', 'Warning - Custom Reference Information', "Unable to process.", "bottom-right");
            }
        });
    }
}

function BindCUSTOMREFERENCENUMBER() {
    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/GetRecordAtAWBCustRef?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        data: JSON.stringify({ AWBSNO: currentawbsno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var getDOCustRef = jQuery.parseJSON(result);
            var getDOCustRefvalue = getDOCustRef.Table0;
            $("span[class='k-picker-wrap k-state-default k-widget k-datepicker k-header k-input']").css("width", "100px");
            $("#BOEDate").css("width", "100px");
            $("#BOEDate").data("kendoDatePicker").value("");
            if (getDOCustRefvalue.length > 0) {
                if (getDOCustRefvalue[0].IsBOEVerification == "True") {
                    $("#BOENo").val(getDOCustRefvalue[0].BOENo);
                    $("#BOEDate").data("kendoDatePicker").value(getDOCustRefvalue[0].BOEDate);
                    $("#chkBoeVerifi").prop('checked', true);
                }
                else {
                    $("#chkBoeVerifi").prop('checked', false);
                    $("#BOENo").val(getDOCustRefvalue[0].BOENo);
                    if (getDOCustRefvalue[0].BOEDate != "") {
                        $("#BOEDate").data("kendoDatePicker").value(getDOCustRefvalue[0].BOEDate);
                        $("#BOEDate").data("kendoDatePicker").enable(false);
                    }
                }
            }
        }
    });
}

function BindPhysicalDODetail(valueId, value, keyId, key) {
    if (SubprocessCancelDo == "CANCEL DO PO") {
        subprocesssno = 3534
    }
    else if (SubprocessCancelDo == "CANCEL DO CARGO") {
        subprocesssno = 2305
    }
    if (SubprocessReleaseDo == "RELEASE DO PO") {
        subprocesssno = 3533
    }
    else if (SubprocessReleaseDo == "RELEASE DO CARGO") {
        subprocesssno = 2137
    }

    if (key != "" && key != undefined) {
        var hawb = 0;
        var SPHCTransSNo = 0;
        var ShipmentDetailArray = [];
        pieces = 0;
        grossWt = 0;
        partNumber = 0;
        if ($("#Text_HAWB").data("kendoAutoComplete") != undefined)
            hawb = $("#Text_HAWB").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_HAWB").data("kendoAutoComplete").key();
        if (subprocesssno == "2137") {
            pieces = $("#hdnPieces").val();
            grossWt = $("#hdnGrWt").val();
        }
        else {
            $("div[id$='areaTrans_import_doshipmenttypedetail']").find("[id^='areaTrans_import_doshipmenttypedetail']").each(function (i, row) {
                pieces = Number(pieces) + Number($(this).find("span[id^='BupPcs']").text()) + Number($(this).find("input[id^='_tempBulkPcs']").val());
                grossWt = Number(grossWt) + Number($(this).find("span[id^='BupGrWt']").text()) + Number($(this).find("input[id^='_tempBulkGrWt']").val());

                var ShipmentDetailViewModel = {
                    PartNumber: Number(partNumber) + 1,
                    AWBSNo: currentawbsno,
                    HAWBSNo: hawb,
                    PartSNo: $(this).find("span[id^='DailyFlightSNo']").text(),
                    Pieces: Number($(this).find("span[id^='BupPcs']").text()) + Number($(this).find("input[id^='_tempBulkPcs']").val()),
                    GrossWeight: Number($(this).find("span[id^='BupGrWt']").text()) + Number($(this).find("input[id^='_tempBulkGrWt']").val()),
                    VolumeWeight: 0,
                    IsBUP: Number($(this).find("span[id^='BupPcs']").text()) > 0 ? 1 : 0,
                    SPHCSNo: 0,
                    SPHCTransSNo: SPHCTransSNo
                };
                ShipmentDetailArray.push(ShipmentDetailViewModel);
            });
        }

        var id = valueId;
        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/GetPhysicalDeliveryOrderRecord?DOSNo=" + key + "&POMailSNo=" + currentPomailSno, async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var resData = jQuery.parseJSON(result);
                var dlvData = resData.Table0;
                var fdData = resData.Table1;
                var hcData = resData.Table2;
                var payment = resData.Table3[0].IsPayment;
                var IsPhysicalDelivery = resData.Table3[0].IsPhysicalDelivery;
                $('#_tempBulkPcs').attr('disabled', true);

                //Added by Rahul on 06-12-2017 for disable bulk grswt for DLV record 
                $("#_tempBulkGrWt").attr('disabled', true);
                $("#BulkGrWt").attr('disabled', true);


                //if (userContext.SysSetting.ClientEnvironment == "UK" && payment == true) {
                //    $("#Text_DONo").data("kendoAutoComplete").setDefaultValue('', '');
                //    ShowMessage('warning', 'Warning - Physical Delivery', "Payment is pending, can't proceed with DLV process.", " ", "bottom-right");
                //}
                if (userContext.SysSetting.ClientEnvironment == "GA" && dlvData[0].IsPaymentCharges.toUpperCase() == false) {
                    $("#Text_DONo").data("kendoAutoComplete").setDefaultValue('', '');
                    ShowMessage('warning', 'Warning - Physical Delivery', "Payment is pending, can't proceed with DLV process.", " ", "bottom-right");
                }
                else if (payment == "1" && IsPhysicalDelivery != 1) {
                    if (currentPomailSno > 0) {
                        if (payment == "1" && IsPhysicalDelivery != 1 && subprocesssno == 3534) {
                            ShowMessage('warning', 'Warning - Delivery Order', "Payment is pending, can't proceed with DO Cancellation process.", " ", "bottom-right");
                        }
                    }
                    else {
                        if (payment == "1" && IsPhysicalDelivery != 1 && subprocesssno == 2305) {
                            ShowMessage('warning', 'Warning - Delivery Order', "Payment is pending, can't proceed with DO Cancellation process.", " ", "bottom-right");
                        }
                    }
                    if (currentPomailSno > 0) {
                        if (payment == "1" && IsPhysicalDelivery != 1) {
                            ShowMessage('warning', 'Warning - Delivery Order', "Payment is pending, can't proceed with Delivery.", " ", "bottom-right");
                        }
                    }
                    else {
                        if (payment == "1" && IsPhysicalDelivery != 1 && subprocesssno == 2137) {
                            ShowMessage('warning', 'Warning - Delivery Order', "Payment is pending, can't proceed with Delivery.", " ", "bottom-right");
                        }
                    }

                    $("#" + id).data("kendoAutoComplete").setDefaultValue("", "");
                    $("span[id='DODateTime']").text("");
                    $("span[id='AWBNo']").text("");
                    $("span[id='Consignee']").text("");
                    if (subprocesssno == 2305) {
                        $("span[id='DOType']").text("");
                        $("span[id='ChargeType']").text("");
                        $("span[id='PiecesTotal']").text("");
                        $("span[id='WeightTotal']").text("");

                    }
                    else if (subprocesssno == 3534) {
                        $("span[id='DOType']").text("");
                        $("span[id='ChargeType']").text("");
                        $("span[id='PiecesTotal']").text("");
                        $("span[id='WeightTotal']").text("");

                    }
                    else {
                        $("span[id='Slas']").text("");
                        $("input[id='BulkPcs']").val("");
                        $("input[id='_tempBulkPcs']").val("");
                        $("span[id='BupPcs']").text("");
                        $("span[id='TotalPieces']").text("");
                        $("input[id='TotalBulkPieces']").val("");
                        $("input[id='BulkGrWt']").val("");
                        $("input[id='_tempBulkGrWt']").val("");
                        $("span[id='BupGrWt']").text("");
                        $("span[id='TotalGrossWeight']").text("");
                    }
                    $("span[id='HAWBNo']").text("");
                    $("span[id='DOPaymentType']").text("");
                    $("span[id='DOBill']").text("");
                    $("span[id='Staff']").text("");
                    $("span[id='Time']").text("");
                    $("span[id='WHLocation']").text("");
                    $("span[id='NatureofGoods']").text("");
                    $("span[id='CargoType']").text("");
                    $("span[id='Temperature']").text("");
                    $("#divareaTrans_import_doflightdetail").css("display", "none");
                    $("#divareaTrans_import_dohandlingcharge").css("display", "none");
                    return false;
                }
                else if (subprocesssno == 2305 && IsPhysicalDelivery == 1) {
                    ShowMessage('warning', 'Warning - Delivery Order', "Physical Delivery already processed,Can't proceed with Do Cancellation process", " ", "bottom-right");
                    $("#" + id).data("kendoAutoComplete").setDefaultValue("", "");
                    $("span[id='DODateTime']").text("");
                    $("span[id='AWBNo']").text("");
                    $("span[id='Consignee']").text("");

                    if (subprocesssno == 2305) {
                        $("span[id='DOType']").text("");
                        $("span[id='ChargeType']").text("");
                        $("span[id='PiecesTotal']").text("");
                        $("span[id='WeightTotal']").text("");
                    }
                    else {
                        $("span[id='Slas']").text("");
                        $("input[id='BulkPcs']").val("");
                        $("input[id='_tempBulkPcs']").val("");
                        $("span[id='BupPcs']").text("");
                        $("span[id='TotalPieces']").text("");
                        $("input[id='TotalBulkPieces']").val("");
                        $("input[id='BulkGrWt']").val("");
                        $("input[id='_tempBulkGrWt']").val("");
                        $("span[id='BupGrWt']").text("");
                        $("span[id='TotalGrossWeight']").text("");
                    }
                    $("span[id='HAWBNo']").text("");
                    $("span[id='DOPaymentType']").text("");
                    $("span[id='DOBill']").text("");
                    $("span[id='Staff']").text("");
                    $("span[id='Time']").text("");
                    $("span[id='WHLocation']").text("");
                    $("span[id='NatureofGoods']").text("");
                    $("span[id='CargoType']").text("");
                    $("span[id='Temperature']").text("");

                    return false;
                }
                else if (subprocesssno == 3534 && IsPhysicalDelivery == 1) {
                    ShowMessage('warning', 'Warning - Delivery Order', "Physical Delivery already processed,Can't proceed with Do Cancellation process", " ", "bottom-right");
                    $("#" + id).data("kendoAutoComplete").setDefaultValue("", "");
                    $("span[id='DODateTime']").text("");
                    $("span[id='AWBNo']").text("");
                    $("span[id='Consignee']").text("");
                    if (subprocesssno == 3534) {
                        $("span[id='DOType']").text("");
                        $("span[id='ChargeType']").text("");
                        $("span[id='PiecesTotal']").text("");
                        $("span[id='WeightTotal']").text("");
                    }
                    else {
                        $("span[id='Slas']").text("");
                        $("input[id='BulkPcs']").val("");
                        $("input[id='_tempBulkPcs']").val("");
                        $("span[id='BupPcs']").text("");
                        $("span[id='TotalPieces']").text("");
                        $("input[id='TotalBulkPieces']").val("");
                        $("input[id='BulkGrWt']").val("");
                        $("input[id='_tempBulkGrWt']").val("");
                        $("span[id='BupGrWt']").text("");
                        $("span[id='TotalGrossWeight']").text("");
                    }
                    $("span[id='HAWBNo']").text("");
                    $("span[id='DOPaymentType']").text("");
                    $("span[id='DOBill']").text("");
                    $("span[id='Staff']").text("");
                    $("span[id='Time']").text("");
                    $("span[id='WHLocation']").text("");
                    $("span[id='NatureofGoods']").text("");
                    $("span[id='CargoType']").text("");
                    $("span[id='Temperature']").text("");
                    return false;
                }
                else {
                    if (dlvData.length > 0) {
                        var dlvItem = dlvData[0];
                        $("span[id='DODateTime']").text(dlvItem.DODate);
                        $("span[id='AWBNo']").text(dlvItem.AWBNo);
                        $("span[id='Consignee']").text(dlvItem.Consignee);
                        $("span[id='HAWBNo']").text(dlvItem.HAWBNo);
                        $("span[id='DOPaymentType']").text(dlvItem.DOPaymentType);
                        $("span[id='DOBill']").text(dlvItem.BillTo);
                        $("span[id='DOBill']").after("<input type='hidden' id='hdnBillTo' value= '" + resData.Table0[0].DOBillTo + "'/>");
                        if (subprocesssno == 2305) {
                            $("span[id='DOType']").text(dlvItem.AWBNo);
                            $("span[id='ChargeType']").text(dlvItem.CargoType);
                            $("span[id='PiecesTotal']").text(dlvItem.DOPieces);
                            $("span[id='WeightTotal']").text(dlvItem.DOGrossWeight);

                            ShipmentDetail = [];
                            if (fdData != []) {
                                $(fdData).each(function (row, i) {
                                    ShipmentDetail.push({ "pieces": i.pieces, "_tempPieces": i.pieces, "totalpieces": i.totalpieces, "grossweight": i.grossweight, "_tempGrossWeight": i.grossweight, "totalgrossweight": i.totalgrossweight, "sphc": i.sphc, "description": i.description, "flightdetails": i.flightdetails, "list": 1 });
                                });
                            }

                            if (fdData.length > 0) {
                                $("#divareaTrans_import_doflightdetail").css("display", "block");
                                $("#DivCancel").remove();
                                $("#divareaTrans_import_dohandlingcharge").find('th').append('<span id="DivCancel"style="padding-left:550px;"><input type="radio"  data-radioval="CASH" class="" name="CustomerType" checked="True" id="CustomerType" value="0" onclick="AuthenticateBillTo(this)">CASH <input type="radio"  data-radioval="CREDIT" class="" name="CustomerType" id="CustomerType" value="1" onclick="AuthenticateBillTo(this)">CREDIT &nbsp;&nbsp;  Bill To  <input type="hidden" name="BillTo" id="BillTo" value=""><span class="k-widget k-combobox k-header"><span class="k-dropdown-wrap k-state-disabled" unselectable="on"><input type="text" class="k-input" name="Text_BillTo" id="Text_BillTo"  controltype="autocomplete" maxlength="" value="" placeholder="" data-role="autocomplete" autocomplete="off"  style="width: 150px; text-transform: uppercase;"><span class="k-select" unselectable="on"><span class="k-icon k-i-arrow-s" unselectable="on" style="cursor:pointer;">select</span></span></span></span>&nbsp;<span><input type="text" class="" name="BillToText" id="BillToText" style="width: 150px; text-transform: uppercase;" controltype="alphanumericupper"  maxlength="100" value="" placeholder="walkin customer name" data-role="alphabettextbox" autocomplete="off" ></span>&nbsp;</span>');

                                cfi.AutoCompleteV2("BillTo", "Name", "DeliveryOrder_vBillTo", CheckAgentCreditLimit, "contains");
                                cfi.makeTrans("import_doflightdetail", null, null, null, null, null, fdData);
                                $("div[id$='areaTrans_import_doflightdetail']").find("[id^='areaTrans_import_doflightdetail']").each(function (i, row) {
                                    $(this).find("span[id^='TotalPieces']").first().text(ShipmentDetail[i].pieces + '/' + ShipmentDetail[i].pieces);
                                    $(this).find("span[id^='TotalGrossWeight']").first().text(ShipmentDetail[i].grossweight + '/' + ShipmentDetail[i].grossweight);
                                    $(this).find("div[id^='transActionDiv']").hide();
                                });

                                if ($("span[id='DOPaymentType']").text() == 'CASH') {
                                    $("#divareaTrans_import_dohandlingcharge").find('th').closest('tr').find('input:radio[id="CustomerType"]').eq(1).attr("disabled", "disabled");
                                    $("#divareaTrans_import_dohandlingcharge").find('th').closest('tr').find('input:radio[id="CustomerType"]').eq(0).attr("checked", 'checked');
                                    $("#Text_BillTo").data("kendoAutoComplete").setDefaultValue("", "");
                                    $("#Text_BillTo").data("kendoAutoComplete").enable(false);
                                    $("#Text_BillTo").removeAttr("data-valid").removeAttr("data-valid-msg");
                                    $("#BillToText").show();
                                    $("#BillToText").attr("data-valid", "required").attr("data-valid-msg", "Enter Bill To.");
                                    if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "GA") {
                                        $("#btnGetCharges").closest('table').css('display', 'none')
                                        $("#BillToText").removeAttr("data-valid").removeAttr("data-valid-msg");
                                    }
                                    else {
                                        $("#btnGetCharges").closest('table').css('display', 'block')
                                    }
                                }
                                else {
                                    $("#divareaTrans_import_dohandlingcharge").find('th').closest('tr').find('input:radio[id="CustomerType"]').eq(1).removeAttr("disabled");
                                    $("#divareaTrans_import_dohandlingcharge").find('th').closest('tr').find('input:radio[id="CustomerType"]').eq(1).attr("checked", 'checked');
                                    if ($("#Text_BillTo").data("kendoAutoComplete") != undefined) {
                                        $("#Text_BillTo").data("kendoAutoComplete").enable(true);
                                        $("#Text_BillTo").attr("data-valid", "required").attr("data-valid-msg", "Select Bill To.");
                                    }
                                    $("#Text_BillTo").data("kendoAutoComplete").key($("#hdnBillTo").val());
                                    $("#Text_BillTo").data("kendoAutoComplete").value($("#DOBill").val());
                                    $("#BillToText").hide();
                                    $("#BillToText").removeAttr("data-valid").removeAttr("data-valid-msg");
                                }
                            }

                            var PopupTable = $("[id^='__tblcancel do__']").last();
                            $("textarea[id^='WaveOfRemarks']").closest('table').remove();
                            $("#divDetail").append('<div id="divareaTrans_import_dowaveofremark" style="display:none" cfi-aria-trans="trans"></div>');
                            $(PopupTable).appendTo($("#divareaTrans_import_dowaveofremark"));
                            $("table[id^='__tblcancel do__']")[1].hidden = true;

                            /****************Handling Charge Information*************************************/
                            MendatoryHandlingCharges = [];
                            if (hcData != []) {
                                $(hcData).each(function (row, i) {
                                    if (i.isMandatory == 1) {
                                        MendatoryHandlingCharges.push({ "type": "M", "chargename": i.TariffSNo, "text_chargename": i.TariffCode, "pbasis": i.PrimaryBasis, "pvalue": i.pValue, "sbasis": i.SecondaryBasis, "svalue": i.sValue, "amount": i.ChargeAmount, "totaltaxamount": i.TotalTaxAmount, "totalamount": i.TotalAmount, "remarks": i.ChargeRemarks.toUpperCase().replace(/<BR>/g, ""), "list": 1 });
                                        totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat(i.totalamount)
                                    }
                                });
                            }

                            $("#divareaTrans_import_dohandlingcharge").css("display", "block");
                            cfi.makeTrans("import_dohandlingcharge", null, null, BindChargeAutoComplete, ReBindChargeAutoComplete, null, MendatoryHandlingCharges);
                            if (MendatoryHandlingCharges.length > 0) {
                                $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                                    $(this).find("span[id^='PBasis']").closest("td").find("input[id^='_tempPValue']").val(MendatoryHandlingCharges[i].pvalue);
                                    $(this).find("span[id^='PBasis']").closest("td").find("input[id^='PValue']").val(MendatoryHandlingCharges[i].pvalue);
                                    $(this).find("span[id^='PBasis']").text(MendatoryHandlingCharges[i].pbasis);
                                    $(this).find("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").val(MendatoryHandlingCharges[i].svalue);
                                    $(this).find("span[id^='SBasis']").closest("td").find("input[id^='SValue']").val(MendatoryHandlingCharges[i].svalue);
                                    $(this).find("span[id^='SBasis']").text(MendatoryHandlingCharges[i].sbasis);
                                });

                                $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                                    $(this).find("[id^='WaveOff']").after("<a href='#' id='waveofRemark' style='text-decoration:none;display:none;color:red' maxlength='200' onclick='BindwaveRemarks(this,event);return false;'>Remarks</a><input type='hidden' id='hdnremark' name='hdnremark' value=''>");
                                });
                            }

                            $("div[id$='divareaTrans_import_dohandlingcharge']").find("[id='areaTrans_import_dohandlingcharge']").each(function () {
                                $(this).find("input[id^='ChargeName']").each(function () {
                                    if (currentPomailSno > 0) {
                                        if (SubprocessCancelDo == "CANCEL DO PO") {
                                            subprocesssno = 3534
                                            ProcessSNo = 17;
                                        }
                                        else if (SubprocessReleaseDo == "RELEASE DO PO") {
                                            subprocesssno = 3533
                                            ProcessSNo = 17;
                                        }
                                        else {
                                            if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length != 0) {
                                                subprocesssno = 3521;
                                                ProcessSNo = 17;
                                            }
                                            if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length == 0 && $("div[id$='areaTrans_import_doflightdetail']").length != 0) {
                                                subprocesssno = 3521;
                                                ProcessSNo = 17;
                                            }
                                            if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length == 0 && $("div[id$='areaTrans_import_doflightdetail']").length == 0) {
                                                subprocesssno = 3533;
                                                ProcessSNo = 17;
                                            }
                                        }

                                    }
                                    else {
                                        if (SubprocessCancelDo == "CANCEL DO CARGO") {
                                            subprocesssno = 2305;
                                            ProcessSNo = 22;
                                        }
                                        else if (SubprocessReleaseDo == "RELEASE DO CARGO") {
                                            subprocesssno = 2146;
                                            ProcessSNo = 22;
                                        }
                                        else {
                                            if (subprocesssno == 2146) {
                                                subprocesssno = 2146;
                                                ProcessSNo = 22;
                                            }
                                            else {
                                                subprocesssno = 2135;
                                                ProcessSNo = 22;
                                            }
                                        }
                                    }
                                    AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIEInbound", "", currentawbsno == 0 ? currentPomailSno : currentawbsno, 0, currentdetination, 1, hawb, "2", ShipmentDetailArray, ProcessSNo, subprocesssno, "No");
                                });
                            });

                            $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                                if (MendatoryHandlingCharges.length > 0) {
                                    $(this).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").enable(false);
                                    $(this).find("span[id^='PBasis']").closest("td").find("input").attr("disabled", "disabled");
                                    $(this).find("span[id^='SBasis']").closest("td").find("input").attr("disabled", "disabled");
                                    if (MendatoryHandlingCharges.length - 1 == i) {
                                        $(this).find("div[id^='transActionDiv']").show();
                                        if (MendatoryHandlingCharges.length > 1)
                                            $(this).find("div[id^='transActionDiv']").find('i:eq(0)').hide();
                                    }
                                    $(this).find("input[id^='WaveOff']").hide();
                                }
                                else {
                                    $(this).find("span[id^='Type']").text("E");
                                    $(this).find("input[id^='WaveOff']").hide();
                                }
                            });

                            totalAmountDO = parseFloat(totalAmountDO) + parseFloat(totalHandlingCharges);
                        }
                        else if (subprocesssno == 3534) {
                            $("span[id='DOType']").text(dlvItem.AWBNo);
                            $("span[id='ChargeType']").text(dlvItem.CargoType);
                            $("span[id='PiecesTotal']").text(dlvItem.DOPieces);
                            $("span[id='WeightTotal']").text(dlvItem.DOGrossWeight);

                            ShipmentDetail = [];
                            if (fdData != []) {
                                $(fdData).each(function (row, i) {
                                    ShipmentDetail.push({ "pieces": i.pieces, "_tempPieces": i.pieces, "totalpieces": i.totalpieces, "grossweight": i.grossweight, "_tempGrossWeight": i.grossweight, "totalgrossweight": i.totalgrossweight, "sphc": i.sphc, "description": i.description, "flightdetails": i.flightdetails, "list": 1 });
                                });
                            }

                            if (fdData.length > 0) {
                                $("#divareaTrans_import_doflightdetail").css("display", "block");
                                $("#DivCancel").remove();
                                $("#divareaTrans_import_dohandlingcharge").find('th').append('<span id="DivCancel"style="padding-left:550px;"><input type="radio"  data-radioval="CASH" class="" name="CustomerType" checked="True" id="CustomerType" value="0" onclick="AuthenticateBillTo(this)">CASH <input type="radio"  data-radioval="CREDIT" class="" name="CustomerType" id="CustomerType" value="1" onclick="AuthenticateBillTo(this)">CREDIT &nbsp;&nbsp;  Bill To  <input type="hidden" name="BillTo" id="BillTo" value=""><span class="k-widget k-combobox k-header"><span class="k-dropdown-wrap k-state-disabled" unselectable="on"><input type="text" class="k-input" name="Text_BillTo" id="Text_BillTo"  controltype="autocomplete" maxlength="" value="" placeholder="" data-role="autocomplete" autocomplete="off"  style="width: 150px; text-transform: uppercase;"><span class="k-select" unselectable="on"><span class="k-icon k-i-arrow-s" unselectable="on" style="cursor:pointer;">select</span></span></span></span>&nbsp;<span><input type="text" class="" name="BillToText" id="BillToText" style="width: 150px; text-transform: uppercase;" controltype="alphanumericupper"  maxlength="100" value="" placeholder="walkin customer name" data-role="alphabettextbox" autocomplete="off" ></span>&nbsp;</span>');

                                cfi.AutoCompleteV2("BillTo", "Name", "DeliveryOrder_vBillTo", CheckAgentCreditLimit, "contains");
                                cfi.makeTrans("import_doflightdetail", null, null, null, null, null, fdData);
                                $("div[id$='areaTrans_import_doflightdetail']").find("[id^='areaTrans_import_doflightdetail']").each(function (i, row) {
                                    $(this).find("span[id^='TotalPieces']").first().text(ShipmentDetail[i].pieces + '/' + ShipmentDetail[i].pieces);
                                    $(this).find("span[id^='TotalGrossWeight']").first().text(ShipmentDetail[i].grossweight + '/' + ShipmentDetail[i].grossweight);
                                    $(this).find("div[id^='transActionDiv']").hide();
                                });

                                if ($("span[id='DOPaymentType']").text() == 'CASH') {
                                    $("#divareaTrans_import_dohandlingcharge").find('th').closest('tr').find('input:radio[id="CustomerType"]').eq(1).attr("disabled", "disabled");
                                    $("#divareaTrans_import_dohandlingcharge").find('th').closest('tr').find('input:radio[id="CustomerType"]').eq(0).attr("checked", 'checked');
                                    $("#Text_BillTo").data("kendoAutoComplete").setDefaultValue("", "");
                                    $("#Text_BillTo").data("kendoAutoComplete").enable(false);
                                    $("#Text_BillTo").removeAttr("data-valid").removeAttr("data-valid-msg");
                                    $("#BillToText").show();
                                    $("#BillToText").attr("data-valid", "required").attr("data-valid-msg", "Enter Bill To.");
                                    if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "GA") {
                                        $("#btnGetCharges").closest('table').css('display', 'none')
                                        $("#BillToText").removeAttr("data-valid").removeAttr("data-valid-msg");
                                    }
                                    else {
                                        $("#btnGetCharges").closest('table').css('display', 'block')
                                    }
                                }
                                else {
                                    $("#divareaTrans_import_dohandlingcharge").find('th').closest('tr').find('input:radio[id="CustomerType"]').eq(1).removeAttr("disabled");
                                    $("#divareaTrans_import_dohandlingcharge").find('th').closest('tr').find('input:radio[id="CustomerType"]').eq(1).attr("checked", 'checked');
                                    if ($("#Text_BillTo").data("kendoAutoComplete") != undefined) {
                                        $("#Text_BillTo").data("kendoAutoComplete").enable(true);
                                        $("#Text_BillTo").attr("data-valid", "required").attr("data-valid-msg", "Select Bill To.");
                                    }
                                    $("#Text_BillTo").data("kendoAutoComplete").key($("#hdnBillTo").val());
                                    $("#Text_BillTo").data("kendoAutoComplete").value($("#DOBill").val());
                                    $("#BillToText").hide();
                                    $("#BillToText").removeAttr("data-valid").removeAttr("data-valid-msg");
                                }
                            }

                            var PopupTable = $("[id^='__tblcancel do__']").last();
                            $("textarea[id^='WaveOfRemarks']").closest('table').remove();
                            $("#divDetail").append('<div id="divareaTrans_import_dowaveofremark" style="display:none" cfi-aria-trans="trans"></div>');
                            $(PopupTable).appendTo($("#divareaTrans_import_dowaveofremark"));
                            $("table[id^='__tblcancel do__']")[1].hidden = true;

                            /****************Handling Charge Information*************************************/
                            MendatoryHandlingCharges = [];
                            if (hcData != []) {
                                $(hcData).each(function (row, i) {
                                    if (i.isMandatory == 1) {
                                        MendatoryHandlingCharges.push({ "type": "M", "chargename": i.TariffSNo, "text_chargename": i.TariffCode, "pbasis": i.PrimaryBasis, "pvalue": i.pValue, "sbasis": i.SecondaryBasis, "svalue": i.sValue, "amount": i.ChargeAmount, "totaltaxamount": i.TotalTaxAmount, "totalamount": i.TotalAmount, "remarks": i.ChargeRemarks.toUpperCase().replace(/<BR>/g, ""), "list": 1 });
                                        totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat(i.totalamount)
                                    }
                                });
                            }

                            $("#divareaTrans_import_dohandlingcharge").css("display", "block");
                            cfi.makeTrans("import_dohandlingcharge", null, null, BindChargeAutoComplete, ReBindChargeAutoComplete, null, MendatoryHandlingCharges);
                            if (MendatoryHandlingCharges.length > 0) {
                                $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                                    $(this).find("span[id^='PBasis']").closest("td").find("input[id^='_tempPValue']").val(MendatoryHandlingCharges[i].pvalue);
                                    $(this).find("span[id^='PBasis']").closest("td").find("input[id^='PValue']").val(MendatoryHandlingCharges[i].pvalue);
                                    $(this).find("span[id^='PBasis']").text(MendatoryHandlingCharges[i].pbasis);
                                    $(this).find("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").val(MendatoryHandlingCharges[i].svalue);
                                    $(this).find("span[id^='SBasis']").closest("td").find("input[id^='SValue']").val(MendatoryHandlingCharges[i].svalue);
                                    $(this).find("span[id^='SBasis']").text(MendatoryHandlingCharges[i].sbasis);
                                });

                                $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                                    $(this).find("[id^='WaveOff']").after("<a href='#' id='waveofRemark' style='text-decoration:none;display:none;color:red' maxlength='200' onclick='BindwaveRemarks(this,event);return false;'>Remarks</a><input type='hidden' id='hdnremark' name='hdnremark' value=''>");
                                });
                            }

                            $("div[id$='divareaTrans_import_dohandlingcharge']").find("[id='areaTrans_import_dohandlingcharge']").each(function () {
                                $(this).find("input[id^='ChargeName']").each(function () {
                                    if (currentPomailSno > 0) {
                                        if (SubprocessCancelDo == "CANCEL DO PO") {
                                            subprocesssno = 3534
                                            ProcessSNo = 17;
                                        }
                                        else if (SubprocessReleaseDo == "RELEASE DO PO") {
                                            subprocesssno = 3533
                                            ProcessSNo = 17;
                                        }
                                        else {
                                            if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length != 0) {
                                                subprocesssno = 3521;
                                                ProcessSNo = 17;
                                            }
                                            if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length == 0 && $("div[id$='areaTrans_import_doflightdetail']").length != 0) {
                                                subprocesssno = 3521;
                                                ProcessSNo = 17;
                                            }
                                            if ($("div[id$='areaTrans_import_doshipmenttypedetail']").length == 0 && $("div[id$='areaTrans_import_doflightdetail']").length == 0) {
                                                subprocesssno = 3533;
                                                ProcessSNo = 17;
                                            }
                                        }
                                    }
                                    else {
                                        if (SubprocessCancelDo == "CANCEL DO CARGO") {
                                            subprocesssno = 2305;
                                            ProcessSNo = 22;
                                        }
                                        else if (SubprocessReleaseDo == "RELEASE DO CARGO") {
                                            subprocesssno = 2146;
                                            ProcessSNo = 22;
                                        }
                                        else {
                                            if (subprocesssno == 2146) {
                                                subprocesssno = 2146;
                                                ProcessSNo = 22;
                                            }
                                            else {
                                                subprocesssno = 2135;
                                                ProcessSNo = 22;
                                            }
                                        }
                                    }
                                    AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIEInbound", "", currentawbsno == 0 ? currentPomailSno : currentawbsno, 0, currentdetination, 1, hawb, "2", ShipmentDetailArray, ProcessSNo, subprocesssno, "No");
                                });
                            });

                            $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                                if (MendatoryHandlingCharges.length > 0) {
                                    $(this).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").enable(false);
                                    $(this).find("span[id^='PBasis']").closest("td").find("input").attr("disabled", "disabled");
                                    $(this).find("span[id^='SBasis']").closest("td").find("input").attr("disabled", "disabled");
                                    if (MendatoryHandlingCharges.length - 1 == i) {
                                        $(this).find("div[id^='transActionDiv']").show();
                                        if (MendatoryHandlingCharges.length > 1)
                                            $(this).find("div[id^='transActionDiv']").find('i:eq(0)').hide();
                                    }
                                    $(this).find("input[id^='WaveOff']").hide();
                                }
                                else {
                                    $(this).find("span[id^='Type']").text("E");
                                    $(this).find("input[id^='WaveOff']").hide();
                                }
                            });

                            totalAmountDO = parseFloat(totalAmountDO) + parseFloat(totalHandlingCharges);
                        }
                        else {
                            $("span[id='Slas']").text("/");
                            /*Pieces Detail*/
                            $("input[id='BulkPcs']").val(dlvItem.BulkPcs);
                            $("input[id='_tempBulkPcs']").val(dlvItem.BulkPcs);
                            $("span[id='BupPcs']").text(dlvItem.BupPcs);
                            $("span[id='TotalPieces']").text(dlvItem.TotalPieces);
                            $("span[id='TotalBulkPieces']").text(dlvItem.TotalBulkPieces);
                            $("span[id='TotalBulkPieces']").hide();

                            /*Weight Detail*/
                            $("input[id='BulkGrWt']").val(dlvItem.BulkGrWt);
                            $("input[id='_tempBulkGrWt']").val(dlvItem.BulkGrWt);
                            $("span[id='BupGrWt']").text(dlvItem.BupGrWt);
                            $("span[id='TotalGrossWeight']").text(dlvItem.TotalGrossWeight);
                            $("span[id='TotalBulkGrWt']").text(dlvItem.BulkGrWt);
                            $("span[id='TotalBulkGrWt']").hide();

                            $("span[id='Staff']").text(dlvItem.Staff);
                            $("span[id='Time']").text(dlvItem.Time);
                            $("span[id='WHLocation']").text(dlvItem.WHLocation);
                            $("span[id='NatureofGoods']").text(dlvItem.NatureOfGoods);
                            $("span[id='CargoType']").text(dlvItem.CargoType);
                            $("span[id='Temperature']").text(dlvItem.Temperature);
                            //Added By Rahul SIngh on 16-09-2017 TO handle customer type
                            $("#Text_CustomerType").val(dlvData[0].CustomerType == 1 ? "REGULAR" : "WALK IN");
                            $("#CustomerType").val(dlvData[0].CustomerType);
                            $('#Text_CustomerType').data("kendoAutoComplete").enable(false);

                            if (dlvData[0].CustomerType != 1) {
                                $('#DeliverdToWalkin').remove();
                                $("#DeliverdTo").next('span').after('&nbsp;&nbsp; <input type="Text" id="DeliverdToWalkin" >');
                                $('#DeliverdToWalkin').val(dlvData[0].DeliverdToWalkin);
                                $("#Text_DeliverdTo").data("kendoAutoComplete").enable(false);
                            }
                            else {
                                $("#Text_DeliverdTo").data("kendoAutoComplete").enable(true);
                                $('#DeliverdToWalkin').remove();
                            }
                        }
                    }
                }
            },
            error: function (ex) {
                var ex = ex;
            }
        });
    }
}

function Disable(obj) {
    var id = obj.id;
    if ($("#" + obj.id).is(':checked') == true)
        $("#" + obj.id).closest("tr").find("td:eq(7)").find("input[id*='btnPrint']").prop('disabled', false);
    else
        $("#" + obj.id).closest("tr").find("td:eq(7)").find("input[id*='btnPrint']").prop('disabled', true);
}

function BindHarmonizedCommodity() {
    CheckCommodityCode();
}

function REBindHarmonizedCommodity() {
    CheckCommodityCode();
}

function CheckCommodityCode() {
    $('#divareaTrans_import_hawbharmonisedcommoditytrans table tbody tr[id^="areaTrans_import_hawbharmonisedcommoditytrans"]').find('input:text[id^="HarmonizedCommodity"]').keypress(function (event) {
        var key = event.which;
        if (!(key >= 48 && key <= 57))
            event.preventDefault();
    });

    $('#divareaTrans_import_hawbharmonisedcommoditytrans table tbody tr[id^="areaTrans_import_hawbharmonisedcommoditytrans"]').find('input:text[id^="HarmonizedCommodity"]').blur(function () {
        var value = $(this).val();
        var ID = $(this).attr('id')
        var Length = $(this).val().length;
        if (Length != 0) {
            if (Length < 6 || Length > 18) {
                if (Length < 6) {
                    jAlert('Length can not be less than 6', 'Alert Dialog');
                    $('#' + ID).val("");
                    $('#_temp' + ID).val("");
                }
            }
        }
    });
}

var pageType = $('#hdnPageType').val();
var fotter = "<div><table style='margin-left:20px;'>" +
    "<tbody><tr><td> &nbsp; &nbsp;</td>" +
    "<td></td>" +
    //"<td> &nbsp; &nbsp;</td>" +
    //"<td><button class='btn btn-block btn-success btn-sm' id='addNewShipment' onclick='addShipment()'>Add Shipment</button></td>" +
    //"<td> &nbsp; &nbsp;</td>" +
    "<td><button class='btn btn-block btn-success btn-sm' style='display:none' id='btnNew'>New</button></td>" +
    "<td> &nbsp; &nbsp;</td>" +
    "<td><button class='btn btn-block btn-success btn-sm' id='btnSave'>Save</button></td>" +
    "<td> &nbsp; &nbsp;</td>" +
    "<td><button class='btn btn-block btn-success btn-sm' style='display:none' id='btnUpdate'>Update</button></td>" +
    "<td> &nbsp; &nbsp;</td>" +
    "<td><button class='btn btn-block btn-success btn-sm' id='btnSaveToNext'>Save &amp; Next</button></td>" +
    "<td> &nbsp; &nbsp;</td>" +
    "<td><button class='btn btn-block btn-danger btn-sm' id='btnCancel'>Cancel</button></td>" +
    "<td><button class='btn btn-block btn-success btn-sm' style='display:none' id='btnChargeNote'>Charge Note</button></td>" +
    "<td> &nbsp; &nbsp;</td>" +
    "<td><button class='btn btn-block btn-success btn-sm' style='display:none' id='btnPrintDLV'>Print DLV Slip</button></td>" +
    "<td> &nbsp; &nbsp;</td>" +
    "<td><button class='btn btn-block btn-success btn-sm' style='display:none' id='btnPrint'>Print</button></td>" +
    "<td> &nbsp; &nbsp;</td>" +
    "</tr></tbody></table> </div>";
var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divDeliveryOrderDetails' style='width:100%'></div></td></tr><tr><td><div id='dvfad'><table id='btnfad'><tr><td><button class='btn btn-block btn-success btn-sm' id='btnSavefad' style='display: none;'>New</button></td></tr></table></div></td></tr><tr><td valign='topfad'><div id='divdetailFAD'></div></td></tr><br/><br/><tr><td valign='top'><div id='divNewDeliveryOrder' style='width:100%'></div></td></tr><tr> <td valign='top'> <table style='width:100%'> <tr> <td style='width:100%;' valign='top' class='tdInnerPadding'> <div id='tabstrip'> <ul id='ulTab' style='display:none;'> <li class='k-state-active'> Genral </li><li> SPHC Wise </li><li>Tab 3</li><li>Tab 4</li><li>Tab 5</li></ul> <div> <div id='divDetail'></div><div id='divDetail1'></div><div id='divDetail2'></div><div id='divDetail3'></div><div id='divDetail5'></div><div id='divDetail4'></div></div><div> <div id='divDetailSHC'> </div></div><div><div id='divTab3'></div></div><div><div id='divTab4'></div></div><div><div id='divTab5'></div></div></div></div></td></tr></table> </td></tr></table></div>";

/*************************Added by devendra 10 JAN 2018************************************/
$('body').on('keydown', function (e) {
    var jqTarget = $(e.target); if (e.keyCode == 9) {
        var jqVisibleInputs = $(':input:visible'); var jqFirst = jqVisibleInputs.first();
        var jqLast = jqVisibleInputs.last(); if (!e.shiftKey && jqTarget.is(jqLast)) {
            e.preventDefault(); jqFirst.focus();
        }
        else if (e.shiftKey && jqTarget.is(jqFirst)) {
            e.preventDefault(); jqLast.focus();
        }
    }
});

// Add By Sushant Kumar Nayak
function UserSubProcessRights(container, subProcessSNo) {
    var isView = false, IsBlocked = false;
    //get the subprocess view permission
    $(userContext.ProcessRights).each(function (i, e) {
        if (e.SubProcessSNo == subProcessSNo) {
            isView = e.IsView;
            return;
        }
    });

    $(userContext.ProcessRights).each(function (i, e) {
        if (e.SubProcessSNo == subProcessSNo) {
            IsBlocked = e.IsBlocked;
            return;
        }
    });

    if (IsBlocked) {
        $('#' + container).html("")
        $(".btn-success").attr("style", "display:none;");
        $(".btn-danger").attr("style", "display:none;");
        $(".ui-button").closest("td").attr("style", "display:none;");
        $(".btnTrans").closest("td").attr("style", "display:none;");
        $(".btn-primary").attr("style", "display:none;");
        $(".btn-block").attr("style", "display:none;");
    }
    else {
        //if view permission is true
        if (isView) {
            $(".btn-success").attr("style", "display:none;");
            $(".btn-danger").attr("style", "display:none;");
            $(".ui-button").closest("td").attr("style", "display:none;");
            $(".btnTrans").closest("td").attr("style", "display:none;");
            $(".btn-primary").attr("style", "display:none;");
            $(".btn-block").attr("style", "display:none;");

            $("#btnSearch").show()
            $("#btnCancel").show()

            $('#' + container).find('input').each(function () {
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

            $('#' + container).find('select').each(function () {
                $(this).replaceWith("<span>" + $("#" + $(this).attr("id") + " :selected").text() + "</span>");
            });

            $('#' + container).find('ul li span').each(function (i, e) {
                $(e).removeClass();
            });
        }
        else {
            if (subProcessSNo == 2513 || subProcessSNo == 2500 || subProcessSNo == 2391) {
            }
            else {
                $("#btnUpdate").hide()
                $("#btnChargeNote").hide()
                $("#btnPrintDLV").hide()
                $("#btnPrint").hide()
                $("#btnSaveToNext").hide()
                if (subProcessSNo == 3537) {
                    if ($("#CustomRef_0").val() != "" && $("#CustomRef_1").val() != "") {
                        $("#btnSave").hide();
                    }
                    else {
                        $("#btnSave").show();
                    }
                }
                $("#btnCancel").show();
                if (subProcessSNo == 2135) {
                    $("#btnPrint").show()
                    $("#btnLocation").show()
                }
                if (subProcessSNo == 2129) {
                    $("#btnSaveToNext").show()
                }
                if (container == "divTab5") {
                    $("#btnSaveToNext").hide()
                }
                if (subProcessSNo == 2130) {
                    $("#btnSave").hide();
                }
                if (subProcessSNo == 2132) {
                    $("#btnSave").hide();
                }
                if (subProcessSNo == 2131) {
                    $("#btnPrint").show();
                }

                if (subProcessSNo == 2133 && userContext.SysSetting.ICMSEnvironment == "GA") {
                    $("#btnPrint").show();
                }
            }
        }
    }
}

function PageRightsCheckDeliveryOrder() {
    var CheckIsFalse = 0;
    $(userContext.PageRights).each(function (e, i) {

        if (i.Apps.toString().toUpperCase() == "DELIVERYORDER") {

            if (i.Apps.toString().toUpperCase() == "DELIVERYORDER" && i.PageRight == "New") {
                YesReady = false;
                CheckIsFalse = 1;
                return
            } if (i.Apps.toString().toUpperCase() == "DELIVERYORDER" && i.PageRight == "Edit") {
                YesReady = false;
                CheckIsFalse = 1;
                return
            } if (i.Apps.toString().toUpperCase() == "DELIVERYORDER" && i.PageRight == "Delete") {
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
        $("#btnSave").hide();
        $("#btnSavefad").hide();
        $("#btnNew").hide();
        $("#btnCancel").hide();
        $("#btnSaveToNext").hide();
        $('#divDetail').find('button').hide();
    }

}

function GetDiscount(row, cntrl, taxPercent, taxamount_discount, totalamount) {
    //var abc = $("tr").index(this);

    var amount = (row.find("[id^='Amount']").val() || "0") == 0 ? (row.find("[id^='_tempAmount']").val() || "0") : (row.find("[id^='Amount']").val() || "0");
    var discount = (row.find("[id^='Discount']").val() || "0") == 0 ? (row.find("[id^='_tempDiscount']").val() || "0") : (row.find("[id^='Discount']").val() || "0");

    var tax = (row.find("[id^='TotalTaxAmount']").val() || "0") == 0 ? (row.find("[id^='TotalTaxAmount']").val() || "0") : (row.find("[id^='TotalTaxAmount']").val() || "0");
    var taxDiscount = (row.find("[id^='DisTa']").val() || "0") == 0 ? (row.find("[id^='_tempDisTa']").val() || "0") : (row.find("[id^='DisTa']").val() || "0");


    if (parseFloat(discount) > parseFloat(amount)) {
        //ShowMessage('warning', 'Acceptance!', " Can not be discount greater than Amount.", "bottom-right");
        //row.find("input[id*='DiscountPercent']").val(0);
        //row.find("input[id*='Discount']").val(0);

        //row.find("input[id*='Tax']").val(parseFloat(taxamount_discount));
        //row.find("input[id*='TotalAmount']").val(totalamount);
        //row.find("span[id^='TotalAmount']").html(totalamount);
        //CalculateTotalFBLAmount();


        var totalAmt = (amount - 0) + (tax - taxDiscount);

        ShowMessage('warning', 'Acceptance!', " Discount can not be greater than Amount.", "bottom-right");
        row.find("input[id*='DiscountPercent']").val(0);
        row.find("input[id*='Discount']").val(0);

        row.find("input[id*='TotalAmount']").val(totalAmt.toFixed(2));
        row.find("span[id^='TotalAmount']").html(totalAmt.toFixed(2));
        // CalculateTotalFBLAmount();
    }
    else if (parseFloat(discount) == 0) {
        //row.find("input[id*='DiscountPercent']").val(0);
        //row.find("input[id*='Discount']").val(0);

        //row.find("input[id*='Tax']").val(parseFloat(taxamount_discount));
        //row.find("input[id*='TotalAmount']").val(totalamount);
        //row.find("span[id^='TotalAmount']").html(totalamount);
        //CalculateTotalFBLAmount();


        var totalAmt = (amount - discount) + (tax - taxDiscount);

        row.find("input[id*='DiscountPercent']").val(0);
        row.find("input[id*='Discount']").val(0);

        row.find("input[id*='TotalAmount']").val(totalAmt.toFixed(2));
        row.find("span[id^='TotalAmount']").html(totalAmt.toFixed(2));
        // CalculateTotalFBLAmount();
    }
    else {
        var calculateDiscount_Percent = (parseFloat(discount) / parseFloat(amount)) * 100
        row.find("input[id*='Discount']").val(discount);
        row.find("input[id*='DiscountPercent']").val(calculateDiscount_Percent.toFixed(3));
        if (discount > 0) {
            ////if (row.find("input[id*='Tax']").val() > 0) {
            //var systemTaxAmount = parseFloat(taxPercent)
            ////var taxcalculate = (parseFloat(systemTaxAmount) / parseFloat(amount)) * 100
            //var tax = parseFloat(amount) - parseFloat(discount);
            //var localtax = (tax * systemTaxAmount) / 100
            //row.find("input[id*='Tax']").val(localtax.toFixed(2));
            //var Totalamountafterdiscount = parseFloat(tax + localtax);
            //row.find("input[id*='TotalAmount']").val(Totalamountafterdiscount.toFixed(2));
            //row.find("span[id^='TotalAmount']").html(Totalamountafterdiscount.toFixed(2));
            //CalculateTotalFBLAmount();
            //// }

            var totalAmt = (amount - discount) + (tax - taxDiscount);

            row.find("input[id*='TotalAmount']").val(totalAmt.toFixed(2));
            row.find("span[id^='TotalAmount']").html(totalAmt.toFixed(2));
            //  CalculateTotalFBLAmount();
        }
        else {
            //row.find("input[id*='Tax']").val(parseFloat(taxamount_discount));
            //row.find("input[id*='TotalAmount']").val(totalamount);
            //row.find("span[id^='TotalAmount']").html(totalamount);
            //CalculateTotalFBLAmount();

            var totalAmt = (amount - 0) + (tax - taxDiscount);

            row.find("input[id*='DiscountPercent']").val(0);
            row.find("input[id*='Discount']").val(0);

            row.find("input[id*='TotalAmount']").val(totalAmt.toFixed(2));
            row.find("span[id^='TotalAmount']").html(totalAmt.toFixed(2));
            // CalculateTotalFBLAmount();
        }
    }
}

function GetTaxDiscount(row, cntrl, taxPercent, taxamount_discount, totalamount) {
    //var abc = $("tr").index(this);
    var tax = (row.find("[id^='TotalTaxAmount']").val() || "0") == 0 ? (row.find("[id^='TotalTaxAmount']").val() || "0") : (row.find("[id^='TotalTaxAmount']").val() || "0");
    var taxDiscount = (row.find("[id^='DisTa']").val() || "0") == 0 ? (row.find("[id^='_tempDisTa']").val() || "0") : (row.find("[id^='DisTa']").val() || "0");

    var amount = (row.find("[id^='Amount']").val() || "0") == 0 ? (row.find("[id^='_tempAmount']").val() || "0") : (row.find("[id^='Amount']").val() || "0");
    var discount = (row.find("[id^='Discount']").val() || "0") == 0 ? (row.find("[id^='_tempDiscount']").val() || "0") : (row.find("[id^='Discount']").val() || "0");

    if (parseFloat(taxDiscount) > parseFloat(tax)) {
        //ShowMessage('warning', 'Acceptance!', " Can not be discount greater than tax.", "bottom-right");
        //row.find("input[id*='DisTaPer']").val(0);
        //row.find("input[id*='DisTa']").val(0);

        //row.find("input[id*='Tax']").val(parseFloat(taxamount_discount));
        //row.find("input[id*='TotalAmount']").val(totalamount);
        //row.find("span[id^='TotalAmount']").html(totalamount);
        //CalculateTotalFBLAmount();

        var totalAmt = (tax - 0) + (amount - discount);

        ShowMessage('warning', 'Acceptance!', " Discount can not be greater than Tax.", "bottom-right");
        row.find("input[id*='DisTaPer']").val(0);
        row.find("input[id*='DisTa']").val(0);

        row.find("input[id*='TotalAmount']").val(totalAmt.toFixed(2));
        row.find("span[id^='TotalAmount']").html(totalAmt.toFixed(2));
        // CalculateTotalFBLAmount();
    }
    else if (parseFloat(taxDiscount) == 0) {
        //row.find("input[id*='DisTaPer']").val(0);
        //row.find("input[id*='DisTa']").val(0);

        //row.find("input[id*='Tax']").val(parseFloat(taxamount_discount));
        //row.find("input[id*='TotalAmount']").val(totalamount);
        //row.find("span[id^='TotalAmount']").html(totalamount);
        //CalculateTotalFBLAmount();

        var totalAmt = (tax - taxDiscount) + (amount - discount);

        row.find("input[id*='DisTaPer']").val(0);
        row.find("input[id*='DisTa']").val(0);

        row.find("input[id*='TotalAmount']").val(totalAmt.toFixed(2));
        row.find("span[id^='TotalAmount']").html(totalAmt.toFixed(2));
        // CalculateTotalFBLAmount();
    }
    else {
        var calculateTaxDiscount_Percent = (parseFloat(taxDiscount) / parseFloat(tax)) * 100
        row.find("input[id*='DisTa']").val(taxDiscount)
        row.find("input[id*='DisTaPer']").val(calculateTaxDiscount_Percent.toFixed(3));
        if (taxDiscount > 0) {
            ////if (row.find("input[id*='Tax']").val() > 0) {
            //var systemTaxAmount = parseFloat(discount)
            //var taxcalculate = (parseFloat(systemTaxAmount) / parseFloat(tax)) * 100
            //var tax = parseFloat(tax) - parseFloat(discount);
            ////var localtax = (tax * systemTaxAmount) / 100
            //row.find("input[id*='Tax']").val(tax.toFixed(2));
            //var Totalamountafterdiscount = parseFloat((totalamount - taxamount_discount) + tax);
            //row.find("input[id*='TotalAmount']").val(Totalamountafterdiscount.toFixed(2));
            //row.find("span[id^='TotalAmount']").html(Totalamountafterdiscount.toFixed(2));
            //CalculateTotalFBLAmount();
            //// }

            var totalAmt = (tax - taxDiscount) + (amount - discount);

            row.find("input[id*='TotalAmount']").val(totalAmt.toFixed(2));
            row.find("span[id^='TotalAmount']").html(totalAmt.toFixed(2));
            //CalculateTotalFBLAmount();
            // }
        }
        else {
            var totalAmt = (amount - 0) + (tax - taxDiscount);

            row.find("input[id*='DiscountPercent']").val(0);
            row.find("input[id*='Discount']").val(0);

            row.find("input[id*='TotalAmount']").val(totalAmt.toFixed(2));
            row.find("span[id^='TotalAmount']").html(totalAmt.toFixed(2));
            //CalculateTotalFBLAmount();
        }
    }
}

var discount = 0;
function GetDiscountPercent(row, cntrl, taxPercent, taxamount_discount, totalamount) {
    var amount = (row.find("[id^='Amount']").val() || "0") == 0 ? (row.find("[id^='_tempAmount']").val() || "0") : (row.find("[id^='Amount']").val() || "0");
    discount = (row.find("[id^='DiscountPercent']").val() || "0") == 0 ? (row.find("[id^='_tempDiscountPercent']").val() || "0") : (row.find("[id^='DiscountPercent']").val() || "0");

    var tax = (row.find("[id^='TotalTaxAmount']").val() || "0") == 0 ? (row.find("[id^='TotalTaxAmount']").val() || "0") : (row.find("[id^='TotalTaxAmount']").val() || "0");
    var taxDiscount = (row.find("[id^='DisTa']").val() || "0") == 0 ? (row.find("[id^='_tempDisTa']").val() || "0") : (row.find("[id^='DisTa']").val() || "0");


    var calculateDiscount_Percent = (parseFloat(discount) * parseFloat(amount)) / 100

    if (parseFloat(calculateDiscount_Percent) > parseFloat(amount)) {
        //ShowMessage('warning', 'Acceptance!', " Can not be discount greater than Amount.", "bottom-right");
        //row.find("input[id*='Discount']").val(0);
        //row.find("input[id*='DiscountPercent']").val(0);
        //row.find("input[id*='Tax']").val(parseFloat(taxamount_discount));
        //row.find("input[id*='TotalAmount']").val(totalamount);
        //row.find("span[id^='TotalAmount']").html(totalamount);
        //CalculateTotalFBLAmount();

        ShowMessage('warning', 'Acceptance!', " Discount can not be greater than Amount.", "bottom-right");
        row.find("input[id*='Discount']").val(0);
        row.find("input[id*='DiscountPercent']").val(0);

        var totalAmt = (amount - 0) + (tax - taxDiscount);

        row.find("input[id*='TotalAmount']").val(totalAmt.toFixed(2));
        row.find("span[id^='TotalAmount']").html(totalAmt.toFixed(2));
        // CalculateTotalFBLAmount();
    }
    else if (parseFloat(calculateDiscount_Percent) == 0) {
        //row.find("input[id*='Discount']").val(0);
        //row.find("input[id*='DiscountPercent']").val(0);
        //CalculateTotalFBLAmount();

        var totalAmt = (amount - calculateDiscount_Percent) + (tax - taxDiscount);

        row.find("input[id*='Discount']").val(0);
        row.find("input[id*='DiscountPercent']").val(0);

        row.find("input[id*='TotalAmount']").val(totalAmt.toFixed(2));
        row.find("span[id^='TotalAmount']").html(totalAmt.toFixed(2));
        //CalculateTotalFBLAmount();
    }
    else {
        //row.find("input[id*='Discount']").val(calculateDiscount_Percent.toFixed(3));
        //row.find("input[id*='DiscountPercent']").val(discount);
        //// var checkdiscout = row.find("input[id*='Discount']").val(calculateDiscount_Percent.toFixed(3));
        //var rowTax = row.find("input[id*='Tax']").val();
        //if (row.find("input[id*='Discount']").val() > 0) {
        //    // if (rowTax > 0) {
        //    var systemTaxAmount = parseFloat(taxPercent)
        //    // var taxcalculate = (parseFloat(systemTaxAmount) / parseFloat(amount)) * 100
        //    var tax = parseFloat(amount) - parseFloat(row.find("input[id*='Discount']").val());
        //    var localtax = (tax * systemTaxAmount) / 100

        //    row.find("input[id*='Tax']").val(localtax.toFixed(2));
        //    var Totalamountafterdiscount = parseFloat(tax + localtax);
        //    row.find("input[id*='TotalAmount']").val(Totalamountafterdiscount.toFixed(2));
        //    row.find("span[id^='TotalAmount']").html(Totalamountafterdiscount.toFixed(2));
        //    CalculateTotalFBLAmount();
        //    //}

        row.find("input[id*='Discount']").val(calculateDiscount_Percent.toFixed(3));
        row.find("input[id*='DiscountPercent']").val(discount);

        if (calculateDiscount_Percent > 0) {

            var totalAmt = (amount - calculateDiscount_Percent) + (tax - taxDiscount);

            row.find("input[id*='TotalAmount']").val(totalAmt.toFixed(2));
            row.find("span[id^='TotalAmount']").html(totalAmt.toFixed(2));
            //CalculateTotalFBLAmount();
            //}
        }
        else {
            //row.find("input[id*='Tax']").val(parseFloat(taxamount_discount));
            //row.find("input[id*='TotalAmount']").val(totalamount);
            //row.find("span[id^='TotalAmount']").html(totalamount);
            //CalculateTotalFBLAmount();
            var totalAmt = (amount - 0) + (tax - taxDiscount);

            row.find("input[id*='Discount']").val(0);
            row.find("input[id*='DiscountPercent']").val(0);

            row.find("input[id*='TotalAmount']").val(totalAmt);
            row.find("span[id^='TotalAmount']").html(totalAmt);
            //CalculateTotalFBLAmount();
        }
    }
}

function GetTaxDiscountPercent(row, cntrl, taxamount_discount, totalamount) {
    var taxAmount = (row.find("[id^='TotalTaxAmount']").val() || "0") == 0 ? (row.find("[id^='TotalTaxAmount']").val() || "0") : (row.find("[id^='TotalTaxAmount']").val() || "0");
    taxDiscount = (row.find("[id^='DisTaPer']").val() || "0") == 0 ? (row.find("[id^='_tempDisTaPer']").val() || "0") : (row.find("[id^='DisTaPer']").val() || "0");

    var amount = (row.find("[id^='Amount']").val() || "0") == 0 ? (row.find("[id^='_tempAmount']").val() || "0") : (row.find("[id^='Amount']").val() || "0");
    var discount = (row.find("[id^='Discount']").val() || "0") == 0 ? (row.find("[id^='_tempDiscount']").val() || "0") : (row.find("[id^='Discount']").val() || "0");

    var calculateDiscount_Percent = (parseFloat(taxDiscount) * parseFloat(taxAmount)) / 100

    if (parseFloat(calculateDiscount_Percent) > parseFloat(taxAmount)) {
        ShowMessage('warning', 'Acceptance!', " Discount can not be greater than Tax.", "bottom-right");
        row.find("input[id*='DisTa']").val(0);
        row.find("input[id*='DisTaPer']").val(0);

        var totalAmt = (taxAmount - 0) + (amount - discount);

        row.find("input[id*='TotalAmount']").val(totalAmt.toFixed(2));
        row.find("span[id^='TotalAmount']").html(totalAmt.toFixed(2));
        //CalculateTotalFBLAmount();
    }
    else if (parseFloat(calculateDiscount_Percent) == 0) {
        row.find("input[id*='DisTa']").val(0);
        row.find("input[id*='DisTaPer']").val(0);

        var totalAmt = (taxAmount - calculateDiscount_Percent) + (amount - discount);

        row.find("input[id*='TotalAmount']").val(totalAmt.toFixed(2));
        row.find("span[id^='TotalAmount']").html(totalAmt.toFixed(2));
        //CalculateTotalFBLAmount();
    }
    else {
        row.find("input[id*='DisTa']").val(calculateDiscount_Percent.toFixed(3));
        row.find("input[id*='DisTaPer']").val(taxDiscount);

        if (calculateDiscount_Percent > 0) {
            var totalAmt = (taxAmount - calculateDiscount_Percent) + (amount - discount);

            row.find("input[id*='TotalAmount']").val(totalAmt.toFixed(2));
            row.find("span[id^='TotalAmount']").html(totalAmt.toFixed(2));
            //CalculateTotalFBLAmount();

        }
        else {
            var totalAmt = (taxAmount - 0) + (amount - discount);

            row.find("input[id*='DisTa']").val(0);
            row.find("input[id*='DisTaPer']").val(0);

            row.find("input[id*='TotalAmount']").val(totalAmt.toFixed(2));
            row.find("span[id^='TotalAmount']").html(totalAmt.toFixed(2));
            // CalculateTotalFBLAmount();
        }
    }
}

//New DO Page Process Changes

var DetailsForSaveShipment = {};

function addShipment() {
    $.ajax({
        url: "/DeliveryOrderAddShipment/addShipment",
        async: true, type: "post",
        success: function (result) {
            $('#divDeliveryOrderDetails').html(result);
            $('#tabstrip').hide();

            //bind function to save btn
            $("#btnSave").bind("click", saveAddShipment);

            $("#btnCancel").bind("click", resetAddShipmentHtml);

            kendoRegisterElements();
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function kendoRegisterElements() {
    cfi.AutoCompleteV2("ShipmentOriginDO", "AirportCode", "doAirportSearch", null, "contains");
    cfi.AutoCompleteV2("ShipmentDestinationDO", "AirportCode", "doAirportSearch", null, "contains");

    cfi.AutoCompleteV2("Product", "ProductName", "DeliveryOrderNew_ProductName", null, "contains");

    cfi.AutoCompleteV2("NatureofGoods", "CommodityCode", "DeliveryOrderNew_NatureofGoods", null, "contains");
    cfi.AutoCompleteV2("Commodity", "CommodityDescription", "DeliveryOrderNew_Commodity", null, "contains");
    cfi.AutoCompleteV2("SpecialHandlingCode", "CODE", "DeliveryOrderNew_SPHC", null, "contains", ",", null, null, null, null, true);
    cfi.AutoCompleteV2("buptype", "Description", "DeliveryOrderNew_buptype", "", null, "contains");
    cfi.AutoCompleteV2("densitygroup", "GroupName", "DeliveryOrderNew_densitygroup", "", null, "contains");
    cfi.AutoCompleteV2("SubGroupCommodity", "SubGroupName", "DeliveryOrderNew_SubGroupCommodity", "", null, "contains");

    cfi.AutoCompleteV2("BoardPoint", "AirportCode", "DeliveryOrderNew_Airport", null, "contains");
    cfi.AutoCompleteV2("offPoint", "AirportCode", "DeliveryOrderNew_ShipmentDest", null, "contains");
    cfi.AutoCompleteV2("SearchFlightNo", "FlightNo", "DeliveryOrder_FlightNo", null, "contains");

    $("#AWBDateDO").kendoDatePicker({
        value: new Date(),
        dateInput: true
    });

    cfi.DateType("FlightDate");

    cfi.AutoCompleteV2("CONSIGNEEDOAccountNO", "CustomerNo", "doShipperConsigneeSearch", getConsigneeDetails, "contains");

    cfi.AutoCompleteV2("CONSIGNEE_CountryCode", "CountryCode,CountryName", "DeliveryOrderNew_CONSIGNEE_CountryCode", null, "contains");
    cfi.AutoCompleteV2("CONSIGNEE_City", "CityCode,CityName", "Reservation_Origin", null, "contains");

    cfi.AutoCompleteV2("SHIPPERDOAccountNo", "CustomerNo", "doShipperConsigneeSearch", getShipperDetails, "contains");

    cfi.AutoCompleteV2("SHIPPER_CountryCode", "CountryCode,CountryName", "DeliveryOrderNew_SHIPPER_CountryCode", null, "contains");
    cfi.AutoCompleteV2("SHIPPER_City", "CityCode,CityName", "Reservation_Origin", null, "contains");

    cfi.AutoCompleteV2("awbno", "AWBNo", "doAWBSearch", null, "contains", null, null, null, null, getDetails);

    cfi.AutoCompleteV2("IssuingAgentnudd", "Name", "Reservation_Agent", null, "contains");

    $("#Text_ShipmentDestinationDO").data("kendoAutoComplete").enable(false);
    $('#Text_ShipmentDestinationDO').data("kendoAutoComplete").setDefaultValue(userContext.AirportSNo, userContext.AirportCode);
}

function selectType() {
    var typeSelected = document.querySelector('input[name="ShipmentType"]:checked').value;
    if (typeSelected == 1) {
        $('#spnexceptawbno').hide();
        $('#spnawbno').show();

        $('#IssuingAgentnutextsp').hide();
        $('#IssuingAgentnusp').show();

        $('#itinery').show();
    } else if (typeSelected == 2) {
        $('#spnexceptawbno').show();
        $("#exceptawbno").val("");
        $("#exceptawbno").attr("maxlength", "12");

        $('#spnawbno').hide();

        $('#IssuingAgentnutextsp').show();
        $('#IssuingAgentnusp').hide();

        $('#itinery').hide();
    }
    else {
        $('#spnexceptawbno').show();
        $("#exceptawbno").val("");
        $("#exceptawbno").removeAttr("maxlength");
        $('#spnawbno').hide();

        $('#IssuingAgentnutextsp').show();
        $('#IssuingAgentnusp').hide();

        $('#itinery').hide();
    }
    resetAddShipmentFields();
}

function resetAddShipmentHtml() {
    $('#divDeliveryOrderDetails').html('');
}

function resetAddShipmentFields() {

    $('#itinery').html('<tr> <th class="formSection" colspan="6">Itinerary Information</th></tr>\
        <tr>\
            <td class="formHeaderLabel snowidth" id="transSNo" name="transSNo">SNo</td>\
            <td class="formHeaderLabel" title="Select Board Point"><font color="red">*</font><span id="spnBoardPoint"> Board Point</span></td>\
            <td class="formHeaderLabel" title="Select Off Point"><font color="red">*</font><span id="spnoffPoint"> Off Point</span></td>\
            <td class="formHeaderLabel" title="Select Flight Date">Flight Date</td>\
            <td class="formHeaderLabel" title="Enter Flight No">Flight No.</td>\
            <td class="formHeaderLabel"></td>\
        </tr>\
        <tr>\
        <td id="tdSNoCol" class="formSNo snowidth"> 1</td>\
        <td class="formthreeInputcolumn">\
            <input id="BoardPoint" name="BoardPoint" type="hidden" value="">\
            <input controltype="autocomplete" data-role="autocomplete" data-valid="required" data-valid-msg="Airline Name can not be blank" id="Text_BoardPoint" name="Text_BoardPoint" type="text" value="">\
        </td>\
        <td class="formthreeInputcolumn">\
            <input id="offPoint" name="offPoint" type="hidden" value="">\
            <input controltype="autocomplete" data-role="autocomplete" data-valid="required" data-valid-msg="Airline Name can not be blank" id="Text_offPoint" name="Text_offPoint" type="text" value="">\
        </td>\
        <td class="formthreeInputcolumn">\
            <span>\
                <input tabindex="5" id="FlightDate" name="FlightDate" type = "hidden" value = "" >\
            </span>\
        </td>\
        <td class="formthreeInputcolumn">\
            <input id="SearchFlightNo" name="SearchFlightNo" type="hidden" value="">\
            <input controltype="autocomplete" data-role="autocomplete" data-valid="required" data-valid-msg="Airline Name can not be blank" id="Text_SearchFlightNo" name="Text_SearchFlightNo" type="text" value="">\
        </td>\
        </tr>')

    cfi.AutoCompleteV2("BoardPoint", "AirportCode", "doAirportSearch", null, "contains");
    cfi.AutoCompleteV2("offPoint", "AirportCode", "doAirportSearch", null, "contains");
    cfi.AutoCompleteV2("SearchFlightNo", "FlightNo", "DeliveryOrder_FlightNo", null, "contains");
    cfi.DateType("FlightDate");
    //kendoRegisterElements();

    $("#Text_ShipmentOriginDO").data("kendoAutoComplete").enable(true);
    $("#Text_ShipmentOriginDO").data("kendoAutoComplete").setDefaultValue('', '');

    $("#Text_ShipmentDestinationDO").data("kendoAutoComplete").enable(false);
    $('#Text_ShipmentDestinationDO').data("kendoAutoComplete").setDefaultValue(userContext.AirportSNo, userContext.AirportCode);

    $("#Text_Product").data("kendoAutoComplete").enable(true);
    $('#Text_Product').data("kendoAutoComplete").key('');
    $('#Text_Product').data("kendoAutoComplete").value('');

    $('#Text_awbno').data("kendoAutoComplete").value('');
    $("#exceptawbno").val("");

    $("#AWBDateDO").data("kendoDatePicker").value(new Date());

    $("#_tempPieces").attr('disabled', false);
    $('#_tempPieces').val('');

    $("#_tempGrossWt").attr('disabled', false);
    $('#_tempGrossWt').val('');

    $("#_tempChargeableWt").attr('disabled', false);
    $('#_tempChargeableWt').val('');

    $('#_tempCBM').val('');

    $("#_tempVolumeWt").attr('disabled', false);
    $('#_tempVolumeWt').val('');

    $('#Text_SpecialHandlingCode').val('');

    $('#Text_NatureofGoods').data("kendoAutoComplete").enable(true);
    $('#Text_NatureofGoods').data("kendoAutoComplete").key('');
    $('#Text_NatureofGoods').data("kendoAutoComplete").value('');

    $("#Text_SHIPPERDOAccountNo").data("kendoAutoComplete").enable(true);
    $('#Text_SHIPPERDOAccountNo').data("kendoAutoComplete").setDefaultValue('', '');

    $('#SHIPPER_Name').attr('disabled', false);
    $('#SHIPPER_Name').val('');

    $('#SHIPPER_Name2').attr('disabled', false);
    $('#SHIPPER_Name2').val('');

    $('#SHIPPER_Street').attr('disabled', false);
    $('#SHIPPER_Street').val('');

    $('#SHIPPER_Street2').attr('disabled', false);
    $('#SHIPPER_Street2').val('');

    $('#SHIPPER_TownLocation').attr('disabled', false);
    $('#SHIPPER_TownLocation').val('');

    $('#SHIPPER_State').attr('disabled', false);
    $('#SHIPPER_State').val('');

    $('#SHIPPER_PostalCode').attr('disabled', false);
    $('#SHIPPER_PostalCode').val('');

    $('#SHIPPER_MobileNo').attr('disabled', false);
    $('#SHIPPER_MobileNo').val('');

    $('#SHIPPER_MobileNo2').attr('disabled', false);
    $('#SHIPPER_MobileNo2').val('');

    $('#SHIPPER_Email').attr('disabled', false);
    $('#SHIPPER_Email').val('');

    $('#SHipper_Fax').attr('disabled', false);
    $('#SHipper_Fax').val('');

    $('#Text_SHIPPER_CountryCode').data("kendoAutoComplete").enable(true);
    $('#Text_SHIPPER_CountryCode').data("kendoAutoComplete").key('');
    $('#Text_SHIPPER_CountryCode').data("kendoAutoComplete").value('');

    $('#Text_SHIPPER_City').data("kendoAutoComplete").enable(true);
    $('#Text_SHIPPER_City').data("kendoAutoComplete").key('');
    $('#Text_SHIPPER_City').data("kendoAutoComplete").value('');

    $("#Text_CONSIGNEEDOAccountNO").data("kendoAutoComplete").enable(true);
    $('#Text_CONSIGNEEDOAccountNO').data("kendoAutoComplete").setDefaultValue('', '');

    $('#CONSIGNEE_AccountNoName').attr('disabled', false);
    $('#CONSIGNEE_AccountNoName').val('');

    $('#CONSIGNEE_AccountNoName2').attr('disabled', false);
    $('#CONSIGNEE_AccountNoName2').val('');

    $('#CONSIGNEE_Street').attr('disabled', false);
    $('#CONSIGNEE_Street').val('');

    $('#CONSIGNEE_Street2').attr('disabled', false);
    $('#CONSIGNEE_Street2').val('');

    $('#CONSIGNEE_TownLocation').attr('disabled', false);
    $('#CONSIGNEE_TownLocation').val('');

    $('#CONSIGNEE_State').attr('disabled', false);
    $('#CONSIGNEE_State').val('');

    $('#CONSIGNEE_PostalCode').attr('disabled', false);
    $('#CONSIGNEE_PostalCode').val('');

    $('#CONSIGNEE_MobileNo').attr('disabled', false);
    $('#CONSIGNEE_MobileNo').val('');

    $('#CONSIGNEE_MobileNo2').attr('disabled', false);
    $('#CONSIGNEE_MobileNo2').val('');

    $('#CONSIGNEE_Email').attr('disabled', false);
    $('#CONSIGNEE_Email').val('');

    $('#CONSIGNEE_Fax').attr('disabled', false);
    $('#CONSIGNEE_Fax').val('');

    $('#Text_CONSIGNEE_CountryCode').data("kendoAutoComplete").enable(true);
    $('#Text_CONSIGNEE_CountryCode').data("kendoAutoComplete").key('');
    $('#Text_CONSIGNEE_CountryCode').data("kendoAutoComplete").value('');

    $('#Text_CONSIGNEE_City').data("kendoAutoComplete").enable(true);
    $('#Text_CONSIGNEE_City').data("kendoAutoComplete").key('');
    $('#Text_CONSIGNEE_City').data("kendoAutoComplete").value('');


    $('#Text_IssuingAgentnudd').data("kendoAutoComplete").enable(true);
    $('#Text_IssuingAgentnudd').data("kendoAutoComplete").key('');
    $('#Text_IssuingAgentnudd').data("kendoAutoComplete").value('');

    $('#IssuingAgentnutext').attr('disabled', false);
    $('#IssuingAgentnutext').val('')

}

function getDetails() {
    debugger;
    var awbNo = event.target.innerText;
    var type = document.querySelector('input[name="ShipmentType"]:checked').value;

    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/GetDetailsByAirlineAWB", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ AWB: awbNo, Type: type }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.Table0;
            var resData2 = Data.Table1;

            if (resData[0].destinationAirportCode != userContext.AirportCode) {
                ShowMessage('warning', 'Warning', "destinatin and logged in city should be same.");
                return;
            }


            var itinearyHtml = '';

            $('#itinery').html('<tr> <th class="formSection" colspan="6">Itinerary Information</th></tr>\
        <tr>\
            <td class="formHeaderLabel snowidth" id="transSNo" name="transSNo">SNo</td>\
            <td class="formHeaderLabel" title="Select Board Point"><font color="red">*</font><span id="spnBoardPoint"> Board Point</span></td>\
            <td class="formHeaderLabel" title="Select Off Point"><font color="red">*</font><span id="spnoffPoint"> Off Point</span></td>\
            <td class="formHeaderLabel" title="Select Flight Date">Flight Date</td>\
            <td class="formHeaderLabel" title="Enter Flight No">Flight No.</td>\
            <td class="formHeaderLabel"></td>\
        </tr>')

            if (resData.length > 0) {

                $("#Text_ShipmentOriginDO").data("kendoAutoComplete").enable(false);
                $("#Text_ShipmentOriginDO").data("kendoAutoComplete").setDefaultValue(resData[0].originAirportSno, resData[0].originAirportCode);

                $("#Text_ShipmentDestinationDO").data("kendoAutoComplete").enable(false);
                $("#Text_ShipmentDestinationDO").data("kendoAutoComplete").setDefaultValue(resData[0].destinationAirportSno, resData[0].destinationAirportCode);

                $("#Text_Product").data("kendoAutoComplete").enable(false);
                $('#Text_Product').data("kendoAutoComplete").key(resData[0].productSno);
                $('#Text_Product').data("kendoAutoComplete").value(resData[0].ProductName);

                $('#AWBDateDO').attr('readonly', true);
                $("#AWBDateDO").data("kendoDatePicker").value(resData[0].AWBDate);

                $("#_tempPieces").attr('disabled', true);
                $('#_tempPieces').val(resData[0].TotalPieces);

                $("#_tempGrossWt").attr('disabled', true);
                $('#_tempGrossWt').val(parseFloat(resData[0].TotalGrossWeight).toFixed(2));

                $("#_tempChargeableWt").attr('disabled', true);
                $('#_tempChargeableWt').val(parseFloat(resData[0].TotalChargeableWeight).toFixed(2));

                $('#_tempCBM').val(parseFloat(resData[0].TotalVolumeWeight / 166.66).toFixed(3));

                $("#_tempVolumeWt").attr('disabled', true);
                $('#_tempVolumeWt').val(parseFloat(resData[0].TotalVolumeWeight).toFixed(2));

                $('#Text_SpecialHandlingCode').val(resData[0].SHC);

                $('#Text_NatureofGoods').data("kendoAutoComplete").enable(false);
                $('#Text_NatureofGoods').data("kendoAutoComplete").key(resData[0].CommodityCode);
                $('#Text_NatureofGoods').data("kendoAutoComplete").value(resData[0].CommodityDescription);

                $("#Text_SHIPPERDOAccountNo").data("kendoAutoComplete").enable(false);
                $('#Text_SHIPPERDOAccountNo').data("kendoAutoComplete").key(resData[0].shipperSno);
                $('#Text_SHIPPERDOAccountNo').data("kendoAutoComplete").value(resData[0].shipperName);

                $('#SHIPPER_Name').attr('disabled', resData[0].shipperName.trim() != '' ? true : false);
                $('#SHIPPER_Name').val(resData[0].shipperName);

                $('#SHIPPER_Name2').attr('disabled', resData[0].shipperName2.trim() != '' ? true : false);
                $('#SHIPPER_Name2').val(resData[0].shipperName2);

                $('#SHIPPER_Street').attr('disabled', resData[0].address.trim() != '' ? true : false);
                $('#SHIPPER_Street').val(resData[0].address);

                $('#SHIPPER_Street2').attr('disabled', resData[0].address2.trim() != '' ? true : false);
                $('#SHIPPER_Street2').val(resData[0].address2);

                $('#SHIPPER_TownLocation').attr('disabled', resData[0].town.trim() != '' ? true : false);
                $('#SHIPPER_TownLocation').val(resData[0].town);

                $('#SHIPPER_State').attr('disabled', resData[0].state.trim() != '' ? true : false);
                $('#SHIPPER_State').val(resData[0].state);

                $('#SHIPPER_PostalCode').attr('disabled', resData[0].PostalCode.trim() != '' ? true : false);
                $('#SHIPPER_PostalCode').val(resData[0].PostalCode);

                $('#SHIPPER_MobileNo').attr('disabled', resData[0].Phone.trim() != '' ? true : false);
                $('#SHIPPER_MobileNo').val(resData[0].Phone);

                $('#SHIPPER_MobileNo2').attr('disabled', resData[0].Phone.trim() != '' ? true : false);
                $('#SHIPPER_MobileNo2').val(resData[0].Phone);

                $('#SHIPPER_Email').attr('disabled', resData[0].Email.trim() != '' ? true : false);
                $('#SHIPPER_Email').val(resData[0].Email);

                $('#SHipper_Fax').attr('disabled', resData[0].shipperFax.trim() != '' ? true : false);
                $('#SHipper_Fax').val(resData[0].shipperFax);

                $('#Text_SHIPPER_CountryCode').data("kendoAutoComplete").enable(false);
                $('#Text_SHIPPER_CountryCode').data("kendoAutoComplete").key(resData[0].shipperCountrySno);
                $('#Text_SHIPPER_CountryCode').data("kendoAutoComplete").value(resData[0].shipperCountryName);

                $('#Text_SHIPPER_City').data("kendoAutoComplete").enable(false);
                $('#Text_SHIPPER_City').data("kendoAutoComplete").key(resData[0].shipperCitySno);
                $('#Text_SHIPPER_City').data("kendoAutoComplete").value(resData[0].shipperCityCode);

                $("#Text_CONSIGNEEDOAccountNO").data("kendoAutoComplete").enable(false);
                $('#Text_CONSIGNEEDOAccountNO').data("kendoAutoComplete").key(resData[0].consigneeSno);
                $('#Text_CONSIGNEEDOAccountNO').data("kendoAutoComplete").value(resData[0].consigneeName);

                $('#CONSIGNEE_AccountNoName').attr('disabled', resData[0].consigneeName.trim() != '' ? true : false);
                $('#CONSIGNEE_AccountNoName').val(resData[0].consigneeName);

                $('#CONSIGNEE_AccountNoName2').attr('disabled', resData[0].consigneeName2.trim() != '' ? true : false);
                $('#CONSIGNEE_AccountNoName2').val(resData[0].consigneeName2);

                $('#CONSIGNEE_Street').attr('disabled', resData[0].address.trim() != '' ? true : false);
                $('#CONSIGNEE_Street').val(resData[0].address);

                $('#CONSIGNEE_Street2').attr('disabled', resData[0].address2.trim() != '' ? true : false);
                $('#CONSIGNEE_Street2').val(resData[0].address2);

                $('#CONSIGNEE_TownLocation').attr('disabled', resData[0].town.trim() != '' ? true : false);
                $('#CONSIGNEE_TownLocation').val(resData[0].town);

                $('#CONSIGNEE_State').attr('disabled', resData[0].state.trim() != '' ? true : false);
                $('#CONSIGNEE_State').val(resData[0].state);

                $('#CONSIGNEE_PostalCode').attr('disabled', resData[0].PostalCode.trim() != '' ? true : false);
                $('#CONSIGNEE_PostalCode').val(resData[0].PostalCode);

                $('#CONSIGNEE_MobileNo').attr('disabled', resData[0].Phone.trim() != '' ? true : false);
                $('#CONSIGNEE_MobileNo').val(resData[0].Phone);

                $('#CONSIGNEE_MobileNo2').attr('disabled', resData[0].Phone.trim() != '' ? true : false);
                $('#CONSIGNEE_MobileNo2').val(resData[0].Phone);

                $('#CONSIGNEE_Email').attr('disabled', resData[0].Email.trim() != '' ? true : false);
                $('#CONSIGNEE_Email').val(resData[0].Email);

                $('#CONSIGNEE_Fax').attr('disabled', resData[0].consigneeFax.trim() != '' ? true : false);
                $('#CONSIGNEE_Fax').val(resData[0].consigneeFax);

                $('#Text_CONSIGNEE_CountryCode').data("kendoAutoComplete").enable(false);
                $('#Text_CONSIGNEE_CountryCode').data("kendoAutoComplete").key(resData[0].consigneeCountrySno);
                $('#Text_CONSIGNEE_CountryCode').data("kendoAutoComplete").value(resData[0].consigneeCountryName);

                $('#Text_CONSIGNEE_City').data("kendoAutoComplete").enable(false);
                $('#Text_CONSIGNEE_City').data("kendoAutoComplete").key(resData[0].consigneeCitySno);
                $('#Text_CONSIGNEE_City').data("kendoAutoComplete").value(resData[0].consigneeCityCode);

                $('#Text_IssuingAgentnudd').data("kendoAutoComplete").enable(false);
                $('#Text_IssuingAgentnudd').data("kendoAutoComplete").key(resData[0].AccSNo);
                $('#Text_IssuingAgentnudd').data("kendoAutoComplete").value(resData[0].AccName);
            }
            if (resData2.length > 0) {
                itinearyHtml = '';
                for (var i = 0; i < resData2.length; i++) {
                    if (itinearyHtml == '') {
                        itinearyHtml =
                            '<tr>\
                    <td id = "tdSNoCol" class="formSNo snowidth" > '+ (i + 1) + '</td >\
                    <td class="formthreeInputcolumn">\
                        <input id="BoardPoint_'+ i + '" name="BoardPoint_' + i + '" type="hidden" value="" disabled="disabled">\
                        <input controltype="autocomplete" data-role="autocomplete" data-valid="required" data-valid-msg="Airline Name can not be blank" id="Text_BoardPoint_'+ i + '" name="Text_BoardPoint_' + i + '" type="text" value="" disabled="disabled">\
                    </td>\
                    <td class="formthreeInputcolumn">\
                        <input id="offPoint_' + i + '" name="offPoint_' + i + '" type="hidden" value="" disabled="disabled">\
                        <input controltype="autocomplete" data-role="autocomplete" data-valid="required" data-valid-msg="Airline Name can not be blank" id="Text_offPoint_' + i + '" name="Text_offPoint_' + i + '" type="text" value="" disabled="disabled">\
                    </td>\
                    <td class="formthreeInputcolumn">\
                        <input id="FlightDate_' + i + '" name="FlightDate_' + i + '" type="hidden" value="" disabled="disabled">\
                    </td>\
                    <td class="formthreeInputcolumn">\
                        <input id="SearchFlightNo_' + i + ' name="SearchFlightNo_' + i + '" type="hidden" value="" disabled="disabled">\
                        <input controltype="autocomplete" data-role="autocomplete" data-valid="required" data-valid-msg="Airline Name can not be blank" id="Text_SearchFlightNo_' + i + '" name="Text_SearchFlightNo_' + i + '" type="text" value="" disabled="disabled">  \
                    </td>\
                </tr>'
                    }
                    else {
                        itinearyHtml = itinearyHtml +
                            '<tr>\
                    <td id = "tdSNoCol" class="formSNo snowidth" > '+ (i + 1) + '</td >\
                    <td class="formthreeInputcolumn">\
                        <input id="BoardPoint_'+ i + '" name="BoardPoint_' + i + '" type="hidden" value="" disabled="disabled">\
                        <input controltype="autocomplete" data-role="autocomplete" data-valid="required" data-valid-msg="Airline Name can not be blank" id="Text_BoardPoint_'+ i + '" name="Text_BoardPoint_' + i + '" type="text" value="" disabled="disabled">\
                    </td>\
                    <td class="formthreeInputcolumn">\
                        <input id="offPoint_' + i + '" name="offPoint_' + i + '" type="hidden" value="" disabled="disabled">\
                        <input controltype="autocomplete" data-role="autocomplete" data-valid="required" data-valid-msg="Airline Name can not be blank" id="Text_offPoint_' + i + '" name="Text_offPoint_' + i + '" type="text" value="" disabled="disabled">\
                    </td>\
                    <td class="formthreeInputcolumn">\
                        <input id="FlightDate_' + i + '" name="FlightDate_' + i + '" type="hidden" value="" disabled="disabled">\
                    </td>\
                    <td class="formthreeInputcolumn">\
                        <input id="SearchFlightNo_' + i + ' name="SearchFlightNo_' + i + '" type="hidden" value="" disabled="disabled">\
                        <input controltype="autocomplete" data-role="autocomplete" data-valid="required" data-valid-msg="Airline Name can not be blank" id="Text_SearchFlightNo_' + i + '" name="Text_SearchFlightNo_' + i + '" type="text" value="" disabled="disabled">  \
                    </td>\
                </tr>'
                    }
                }

                $('#itinery tr:last').after(itinearyHtml);

                for (var i = 0; i < resData2.length; i++) {
                    cfi.AutoCompleteV2("BoardPoint_" + i + "", "AirportCode", "DeliveryOrderNew_Airport", null, "contains");
                    cfi.AutoCompleteV2("offPoint_" + i + "", "AirportCode", "DeliveryOrderNew_ShipmentDest", null, "contains");
                    cfi.AutoCompleteV2("SearchFlightNo_" + i + "", "FlightNo", "DeliveryOrder_FlightNo", null, "contains");
                    cfi.DateType("FlightDate_" + i + "");


                    $("#Text_BoardPoint_" + i + "").data("kendoAutoComplete").enable(false);
                    $("#Text_BoardPoint_" + i + "").data("kendoAutoComplete").key(resData2[i].OriginAirportSNo)
                    $("#Text_BoardPoint_" + i + "").data("kendoAutoComplete").value(resData2[i].OriginAirportCode);

                    $("#Text_offPoint_" + i + "").data("kendoAutoComplete").enable(false);
                    $("#Text_offPoint_" + i + "").data("kendoAutoComplete").key(resData2[i].DestinationAirportSNo)
                    $("#Text_offPoint_" + i + "").data("kendoAutoComplete").value(resData2[i].DestinationAirportCode);

                    $("#Text_SearchFlightNo_" + i + "").data("kendoAutoComplete").enable(false);
                    // $("#Text_SearchFlightNo_" + i + "").data("kendoAutoComplete").key(resData2[i].FlightNo)
                    $("#Text_SearchFlightNo_" + i + "").data("kendoAutoComplete").value(resData2[i].FlightNo);

                    $('#FlightDate_' + i + '').attr('readonly', true);
                    $('#FlightDate_' + i + '').val(resData2[i].FlightDate);
                }
            }
        }
    });
}

function updateDetailOnChange() {
    debugger
    var typeSelected = document.querySelector('input[name="ShipmentType"]:checked').value;
    //if (typeSelected != 1) {
    if ($('#_tempVolumeWt').val() != '') {
        $('#_tempCBM').val(parseFloat($('#_tempVolumeWt').val() / 166.66).toFixed(3));
    }
    if ($('#_tempGrossWt').val() != '') {
        if ($('#_tempVolumeWt').val() != '' && $('#_tempGrossWt').val() != '') {
            $('#_tempChargeableWt').val(Number($('#_tempVolumeWt').val()) >= Number($('#_tempGrossWt').val()) ? Number($('#_tempVolumeWt').val()) : Number($('#_tempGrossWt').val()));
        }
    }
    //}
}
var editMode = 0;
function openShipmentPopup(arrivedShipment) {
    var type = document.querySelector('input[name="ShipmentType"]:checked').value;
    if (!validateFields()) {
        ShowMessage('warning', 'Warning', "Please enter all mandatory fields.");
        return
    }
    var strVar = "";
    strVar += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody>";
    strVar += "<tr style=\"font-weight: bold\">";
    strVar += "<td style=\"padding-left: 5px;\" class=\"ui-widget-header\">Origin<\/td><td style=\"padding-left: 5px; \" class=\"ui-widget-header\">Destination<\/td><td style=\"padding-left: 5px; \" class=\"ui-widget-header\">Flight Date<\/td><td style=\"padding-left: 5px; \" class=\"ui-widget-header\">Flight No<\/td><td style=\"padding-left: 5px; \" class=\"ui-widget-header\">Pieces<\/td><td style=\"padding-left: 5px; \" class=\"ui-widget-header\">Gr. Weight<\/td><td style=\"padding-left: 5px;\" class=\"ui-widget-header\">Ch. Weight<\/td><td style=\"padding-left: 5px; \" class=\"ui-widget-header\">Vol. Weight<\/td><td style=\"padding-left: 5px; \" class=\"ui-widget-header\">ATA Date<\/td><td style=\"padding-left: 5px; \" class=\"ui-widget-header\">ATA Time<\/td><\/tr>";
    strVar += '<tr>\
        <td class="formthreeInputcolumn">\
            <input id="BoardPointPopUp" name="BoardPointPopUp" type="hidden" value="">\
            <input controltype="autocomplete" data-role="autocomplete" data-valid="required" data-valid-msg="Airline Name can not be blank" id="Text_BoardPointPopUp" name="Text_BoardPointPopUp" type="text" value="">\
        </td>\
        <td class="formthreeInputcolumn">\
            <input id="offPointPopUp" name="offPointPopUp" type="hidden" value="">\
            <input controltype="autocomplete" data-role="autocomplete" data-valid="required" data-valid-msg="Airline Name can not be blank" id="Text_offPointPopUp" name="Text_offPointPopUp" type="text" value="">\
        </td>\
        <td class="formthreeInputcolumn">\
            <span>\
                <input type="text" name="FlightDatePopUp" id="FlightDatePopUp" >\
            </span>\
        </td>\
        <td class="formthreeInputcolumn">\
            <input id="SearchFlightNoPopUp" name="SearchFlightNoPopUp" type="hidden" value="">\
            <input controltype="autocomplete" data-role="autocomplete" data-valid="required" data-valid-msg="Airline Name can not be blank" id="Text_SearchFlightNoPopUp" name="Text_SearchFlightNoPopUp" type="text" value="">\
        </td>\
        <td class="formthreeInputcolumn">\
            <input id="PiecesPopUp" name="PiecesPopUp" tabindex="23" autocomplete="off" class="k-formatted-value k-input k-state-default" type="number" placeholder="" style="width: 95%; display: inline-block;">\
        </td\>\
        <td class="formthreeInputcolumn">\
            <input id="GrossWtPopUp" name="GrossWtPopUp" tabindex="25" autocomplete="off" class="k-formatted-value k-input k-state-default" type="number" placeholder="" style="width: 95%; display: inline-block;" >\
        </td>\
        <td class="formthreeInputcolumn">\
            <input id="ChargeableWtPopUp" name="ChargeableWtPopUp" tabindex="27" autocomplete="off" class="k-formatted-value k-input k-state-default" type="number" placeholder="" style="width: 95%; display: inline-block;" >\
        </td>\
        <td class="formthreeInputcolumn">\
            <input id="VolumeWtPopUp" name="VolumeWtPopUp" tabindex="28" autocomplete="off" class="k-formatted-value k-input k-state-default" type="number" placeholder="" style="width: 95%; display: inline-block;" >\
        </td>\
        <td class="formthreeInputcolumn">\
            <span>\
                <input type="text" name="ATADatePopUp" id="ATADatePopUp" >\
            </span>\
        </td>\
        <td class="formthreeInputcolumn">\
            <input type="text" name="ATATimePopUp" id="ATATimePopUp" placeholder="ATA Time" maxlength="5">\
        </td>\
         </tr>'
    strVar += "<\/tbody><\/table>";
    strVar += "<\/br>";

    $('#divDetail2').html(strVar);

    cfi.AutoCompleteV2("BoardPointPopUp", "AirportCode", "doAirportSearch", null, "contains");
    cfi.AutoCompleteV2("offPointPopUp", "AirportCode", "doAirportSearch", null, "contains");

    cfi.DateType("FlightDatePopUp");
    $("#FlightDatePopUp").bind('change', function () {
        $("#Text_SearchFlightNoPopUp").data("kendoAutoComplete").setDefaultValue('', '');
        try {
            if (new Date($('#FlightDatePopUp').val()) < new Date($('#AWBDateDO').val())) {
                ShowMessage('warning', 'Warning', "flight date cannot be less than awb date.");
                $('#FlightDatePopUp').val('');
                return;
            }
        }
        catch (error) {
            ShowMessage('warning', 'Warning', "please enter valid date.");
            return;
        }
    })

    if (type == 1) {
        $('#FlightDatePopUp').attr('readonly', true);
        $("#FlightDatePopUp").val($($($('#itinery tr:last')[0]).find('input[id^="FlightDate_"]')[0]).val());
    }
    cfi.DateType("ATADatePopUp");
    $("#ATADatePopUp").bind('blur', function () {
        try {
            if (new Date($('#ATADatePopUp').val()) < new Date($('#FlightDatePopUp').val())) {
                ShowMessage('warning', 'Warning', "flight date cannot be less than flight date.");
                $('#ATADatePopUp').val('');
                return;
            }
        }
        catch (error) {
            ShowMessage('warning', 'Warning', "please enter valid date.");
            return;
        }

    })

    $("#PiecesPopUp").bind('change', function () {
        var totalPieces = $('#_tempPieces').val();
        var totalGrossWt = $('#_tempGrossWt').val();
        var totalVolWt = $('#_tempVolumeWt').val();
        var piecesSelected = $('#PiecesPopUp').val();

        var averageGrWt = 0;
        var averageVolWt = 0;

        if (!isNaN(piecesSelected)) {
            averageGrWt = parseFloat(totalGrossWt / totalPieces);
            averageVolWt = parseFloat(totalVolWt / totalPieces);

            $('#GrossWtPopUp').val(parseFloat(averageGrWt * piecesSelected).toFixed(2));
            $('#VolumeWtPopUp').val(parseFloat(averageVolWt * piecesSelected).toFixed(2));
            $('#ChargeableWtPopUp').val(parseFloat(averageGrWt * piecesSelected).toFixed(2) > parseFloat(averageVolWt * piecesSelected).toFixed(2) ? parseFloat(averageGrWt * piecesSelected).toFixed(2) : parseFloat(averageVolWt * piecesSelected).toFixed(2));

        }
    })

    $("#ATATimePopUp").kendoTimePicker({
        format: "HH:mm", interval: 1
    });

    $("#txtATDDate").kendoDatePicker();

    //cfi.AutoCompleteV2("SearchFlightNoPopUp", "FlightNo", "doFlightSearch", null, "contains", null, null, null, null, getDailyFlightSnoByFilter);
    cfi.AutoCompleteV2("SearchFlightNoPopUp", "FlightNo", "doFlightSearch", getDailyFlightSnoByFilter, "contains");

    if (arrivedShipment != null) {
        editMode = 1;
        if (arrivedShipment.Table0[0].Pieces == parseInt($('#_tempPieces').val())) {
            ShowMessage('warning', 'Warning', "all pieces already arrived.");
            return
        }
        $("#Text_BoardPointPopUp").data("kendoAutoComplete").enable(false);
        $("#Text_BoardPointPopUp").data("kendoAutoComplete").setDefaultValue($('#Text_ShipmentOriginDO').data("kendoAutoComplete").key(), $('#Text_ShipmentOriginDO').data("kendoAutoComplete").value())


        $("#Text_offPointPopUp").data("kendoAutoComplete").enable(false);
        $("#Text_offPointPopUp").data("kendoAutoComplete").setDefaultValue($('#Text_ShipmentDestinationDO').data("kendoAutoComplete").key(), $('#Text_ShipmentDestinationDO').data("kendoAutoComplete").value())

        $('#FlightDatePopUp').val(arrivedShipment.Table0[0].FlightDate);
        $('#Text_SearchFlightNoPopUp').val(arrivedShipment.Table0[0].FlightNo);
        $('#PiecesPopUp').val(arrivedShipment.Table0[0].Pieces);
        $('#GrossWtPopUp').val(parseFloat(arrivedShipment.Table0[0].GrossWeight).toFixed(2));
        $('#ChargeableWtPopUp').val(parseFloat(arrivedShipment.Table0[0].GrossWeight).toFixed(2) >= parseFloat(arrivedShipment.Table0[0].VolumeWeight).toFixed(2) ? parseFloat(arrivedShipment.Table0[0].GrossWeight).toFixed(2) : parseFloat(arrivedShipment.Table0[0].VolumeWeight).toFixed(2));
        $('#VolumeWtPopUp').val(parseFloat(arrivedShipment.Table0[0].VolumeWeight).toFixed(2));
        $('#ATADatePopUp').val(arrivedShipment.Table0[0].UpdatedOn);
        //$('#ATATimePopUp').val(arrivedShipment.Table0[0].FlightDate);
    }
    else {
        editMode = 0;
        $("#Text_BoardPointPopUp").data("kendoAutoComplete").enable(false);
        $("#Text_BoardPointPopUp").data("kendoAutoComplete").setDefaultValue($('#Text_ShipmentOriginDO').data("kendoAutoComplete").key(), $('#Text_ShipmentOriginDO').data("kendoAutoComplete").value())


        $("#Text_offPointPopUp").data("kendoAutoComplete").enable(false);
        $("#Text_offPointPopUp").data("kendoAutoComplete").setDefaultValue($('#Text_ShipmentDestinationDO').data("kendoAutoComplete").key(), $('#Text_ShipmentDestinationDO').data("kendoAutoComplete").value())
    }

    $("#divDetail2").dialog({
        resizable: false,
        modal: true,
        title: "Add Shipment",
        height: 250,
        width: '60%',
        left: '20%',
        buttons: {
            "Save": function () {
                saveShipmentPopup()
            }
        }
    });
}

function validateFields() {

    var type = document.querySelector('input[name="ShipmentType"]:checked').value;

    if (type == 1) {
        if ($('#Text_awbno').val() == '') {
            return false;
        } else if ($("#Text_ShipmentOriginDO").data("kendoAutoComplete").value == '') {
            return false;
        } else if ($("#Text_ShipmentDestinationDO").val() == '') {
            return false;
        } else if ($("#Text_Product").val() == '') {
            return false;
        } else if ($("#AWBDateDO").val() == '') {
            return false;
        } else if ($("#_tempPieces").val() == '') {
            return false;
        } else if ($("#_tempGrossWt").val() == '') {
            return false;
        } else if ($("#_tempChargeableWt").val() == '') {
            return false;
        } else if ($("#_tempCBM").val() == '') {
            return false;
        } else if ($("#_tempVolumeWt").val() == '') {
            return false;
        } else if ($("#Text_NatureofGoods").val() == '') {
            return false;
        } else if ($("#Text_SHIPPERDOAccountNo").val() == '') {
            return false;
        } else if ($("#SHIPPER_Name").val() == '') {
            return false;
        } else if ($("#SHIPPER_Street").val() == '') {
            return false;
        } else if ($("#SHIPPER_TownLocation").val() == '') {
            return false;
        } else if ($("#SHIPPER_State").val() == '') {
            return false;
        } else if ($("#SHIPPER_PostalCode").val() == '') {
            return false;
        } else if ($("#SHIPPER_MobileNo").val() == '') {
            return false;
        } else if ($("#SHIPPER_Email").val() == '') {
            return false;
        } else if ($("#Text_SHIPPER_CountryCode").val() == '') {
            return false;
        } else if ($("#Text_SHIPPER_City").val() == '') {
            return false;
        }


        else if ($("#Text_CONSIGNEEDOAccountNO").val() == '') {
            return false;
        } else if ($("#CONSIGNEE_AccountNoName").val() == '') {
            return false;
        } else if ($("#CONSIGNEE_Street").val() == '') {
            return false;
        } else if ($("#CONSIGNEE_State").val() == '') {
            return false;
        } else if ($("#CONSIGNEE_PostalCode").val() == '') {
            return false;
        } else if ($("#CONSIGNEE_MobileNo").val() == '') {
            return false;
        } else if ($("#CONSIGNEE_Email").val() == '') {
            return false;
        } else if ($("#Text_CONSIGNEE_CountryCode").val() == '') {
            return false;
        } else if ($("#Text_CONSIGNEE_City").val() == '') {
            return false;
        } else if ($("#CONSIGNEE_TownLocation").val() == '') {
            return false;
        } else if ($("#Text_IssuingAgentnudd").val() == '') {
            return false;
        } else {
            return true;
        }
    }
    else {
        if ($('#exceptawbno').val() == '') {
            return false;
        } else if ($("#Text_ShipmentOriginDO").data("kendoAutoComplete").value == '') {
            return false;
        } else if ($("#Text_ShipmentDestinationDO").val() == '') {
            return false;
        } else if ($("#Text_Product").val() == '') {
            return false;
        } else if ($("#AWBDateDO").val() == '') {
            return false;
        } else if ($("#_tempPieces").val() == '') {
            return false;
        } else if ($("#_tempGrossWt").val() == '') {
            return false;
        } else if ($("#_tempChargeableWt").val() == '') {
            return false;
        } else if ($("#_tempCBM").val() == '') {
            return false;
        } else if ($("#_tempVolumeWt").val() == '') {
            return false;
        } else if ($("#Text_NatureofGoods").val() == '') {
            return false;
        } else if ($("#Text_SHIPPERDOAccountNo").val() == '') {
            return false;
        } else if ($("#SHIPPER_Name").val() == '') {
            return false;
        } else if ($("#SHIPPER_Street").val() == '') {
            return false;
        } else if ($("#SHIPPER_TownLocation").val() == '') {
            return false;
        } else if ($("#SHIPPER_State").val() == '') {
            return false;
        } else if ($("#SHIPPER_PostalCode").val() == '') {
            return false;
        } else if ($("#SHIPPER_MobileNo").val() == '') {
            return false;
        } else if ($("#SHIPPER_Email").val() == '') {
            return false;
        } else if ($("#Text_SHIPPER_CountryCode").val() == '') {
            return false;
        } else if ($("#Text_SHIPPER_City").val() == '') {
            return false;
        }


        else if ($("#Text_CONSIGNEEDOAccountNO").val() == '') {
            return false;
        } else if ($("#CONSIGNEE_AccountNoName").val() == '') {
            return false;
        } else if ($("#CONSIGNEE_Street").val() == '') {
            return false;
        } else if ($("#CONSIGNEE_State").val() == '') {
            return false;
        } else if ($("#CONSIGNEE_PostalCode").val() == '') {
            return false;
        } else if ($("#CONSIGNEE_MobileNo").val() == '') {
            return false;
        } else if ($("#CONSIGNEE_Email").val() == '') {
            return false;
        } else if ($("#Text_CONSIGNEE_CountryCode").val() == '') {
            return false;
        } else if ($("#Text_CONSIGNEE_City").val() == '') {
            return false;
        } else if ($("#CONSIGNEE_TownLocation").val() == '') {
            return false;
        } else if ($("#IssuingAgentnutext").val() == '') {
            return false;
        } else {
            return true;
        }
    }
}

function saveAddShipment() {
    var type = document.querySelector('input[name="ShipmentType"]:checked').value;
    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/getArrivedShipmentDetail",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({ wayBillNo: type == 1 ? $('#Text_awbno').val() : $('#exceptawbno').val() }),
        success: function (result) {
            debugger
            var arrivedShipment = JSON.parse(result).Table0.length > 0 ? JSON.parse(result) : null;
            openShipmentPopup(arrivedShipment);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getDailyFlightSnoByFilter() {
    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/getDailyFlightSnoByFilter",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({ origin: $('#Text_BoardPointPopUp').data("kendoAutoComplete").key(), destination: $('#Text_offPointPopUp').data("kendoAutoComplete").key(), flightDate: $('#FlightDatePopUp').val(), flightNo: $('#Text_SearchFlightNoPopUp').data("kendoAutoComplete").key() }),
        success: function (result) {
            debugger
            if (JSON.parse(result).Table0.length > 0) {
                var dailyFlightSno = JSON.parse(result).Table0[0].SNo;
                getDetailsForSaveShipmentPopup(dailyFlightSno);
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getDetailsForSaveShipmentPopup(dailyFlightSno) {
    if (!isNaN(dailyFlightSno)) {
        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/GetFlightArrivalFlightInformation?DailyFlightSno=" + dailyFlightSno,
            type: "GET",
            dataType: "json",
            contentType: "application/json",
            success: function (result) {
                debugger
                if (JSON.parse(result).Table0.length > 0) {
                    var temp = JSON.parse(result).Table0[0];

                    DetailsForSaveShipment = {
                        ATA: temp.ATA,
                        ArrivalDate: temp.ArrivalDate,
                        AircraftRegistration: temp.RegistrationNo,
                        GrossWT: temp.GrossWeight,
                        VolumeWT: temp.VolumeWeight,
                        AircraftTypeSNo: temp.AirCraftSNo == "" ? 0 : temp.AirCraftSNo,
                        AccountSNo: temp.VendorAccountSNo == "" ? 0 : temp.VendorAccountSNo,
                        AgendOrVendorName: temp.Vendor,
                        IsNil: temp.IsNil == 'False' ? 0 : 1,
                        TruckScheduleNo: temp.TruckScheduleNo,
                        TruckDate: temp.TruckDate,
                        IsRFSAircraftType: 0,
                        FlightType: temp.AircraftType,
                        CustomRefNo: temp.CustomRefNo,
                        dailyFlightSno: dailyFlightSno
                    }
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    }
}

function saveShipmentPopup() {
    var FlightCheckInDetails = new Array();
    var ConsignmentDetails = new Array();

    if (!Boolean($("#PiecesPopUp").val()) || !Boolean($("#_tempPieces").val()) || Number(parseInt($("#PiecesPopUp").val())) > Number(parseInt($("#_tempPieces").val()))) {
        ShowMessage('warning', 'Warning', "pieces cannot be more than the actual piece entered.");
        return;
    }
    else if (!Boolean($("#GrossWtPopUp").val()) || !Boolean($("#_tempGrossWt").val()) || Number(parseFloat($("#GrossWtPopUp").val()).toFixed(2)) > Number(parseFloat($("#_tempGrossWt").val()).toFixed(2))) {
        ShowMessage('warning', 'Warning', " gr weight cannot be more than the actual weight.");
        return;
    }
    else if (!Boolean($("#ChargeableWtPopUp").val()) || !Boolean($("#_tempChargeableWt").val()) || Number(parseFloat($("#ChargeableWtPopUp").val()).toFixed(2)) > Number(parseFloat($("#_tempChargeableWt").val()).toFixed(2))) {
        ShowMessage('warning', 'Warning', "ch weight cannot be more than the actual weight.");
        return;
    }
    else if (!Boolean($("#VolumeWtPopUp").val()) || !Boolean($("#_tempVolumeWt").val()) || Number(parseFloat($("#VolumeWtPopUp").val()).toFixed(2)) > Number(parseFloat($("#_tempVolumeWt").val()).toFixed(2))) {
        ShowMessage('warning', 'Warning', "vol weight cannot be more than the actual weight.");
        return;
    }
    else if ($("#ATATimePopUp").val() == '') {
        ShowMessage('warning', 'Warning', "please enter valid time.");
        return;
    }
    else if ($("#ATADatePopUp").val()) {
        try {
            new Date($("#ATADatePopUp").val())
        }
        catch (error) {
            ShowMessage('warning', 'Warning', "please enter valid date.");
            return;
        }

    }

    var flightCheckInData =
    {
        ATA: $('#ATATimePopUp').val(),
        ArrivalDate: $('#ATADatePopUp').val(),
        AircraftRegistration: DetailsForSaveShipment.AircraftRegistration,
        GrossWT: $('#GrossWtPopUp').val(),
        VolumeWT: $('#VolumeWtPopUp').val(),
        AircraftTypeSNo: DetailsForSaveShipment.AircraftTypeSNo,
        AccountSNo: DetailsForSaveShipment.AccountSNo,
        AgendOrVendorName: DetailsForSaveShipment.AgendOrVendorName,
        IsNil: DetailsForSaveShipment.IsNil,
        TruckScheduleNo: DetailsForSaveShipment.TruckScheduleNo,
        TruckDate: DetailsForSaveShipment.TruckDate,
        IsRFSAircraftType: DetailsForSaveShipment.IsRFSAircraftType,
        FlightType: DetailsForSaveShipment.FlightType,
        ArrivedPieces: $('#PiecesPopUp').val()
    }

    var ConsignmentDetailData = {
        Type: parseInt(document.querySelector('input[name="ShipmentType"]:checked').value),
        WayBillNo: document.querySelector('input[name="ShipmentType"]:checked').value == 1 ? $('#Text_awbno').data("kendoAutoComplete").value() : $('#exceptawbno').val(),
        OriginCity: $('#Text_ShipmentOriginDO').data("kendoAutoComplete").value(),
        DestinationCity: $('#Text_ShipmentDestinationDO').data("kendoAutoComplete").value(),
        Product: $('#Text_Product').data("kendoAutoComplete").value(),
        WayBillDate: $('#AWBDateDO').val(),
        Agent: $('#IssuingAgent').val(),
        NoOfHouses: $('#_tempNoofHouse').val() == "" ? 0 : $('#_tempNoofHouse').val(),
        WayBillPieces: parseInt($('#_tempPieces').val()),
        GrossWeight: parseFloat($('#_tempGrossWt').val()),
        CBM: $('#_tempCBM').val(),
        ChargeableWeight: parseFloat($('#_tempChargeableWt').val()),
        VolumeWeight: parseFloat($('#_tempVolumeWt').val()),
        SHC: $('#Text_SpecialHandlingCode').data("kendoAutoComplete").value(),
        Commodity: $('#Text_NatureofGoods').data("kendoAutoComplete").value(),
        BUP: $('#chkisBup').is(":checked") == false ? 0 : 1,
        BUPType: $('#Text_buptype').data("kendoAutoComplete").value(),
        DensityGroup: $('#Text_densitygroup').data("kendoAutoComplete").value(),
        //shipper information
        IsShipper: $('#FWBShipper').is(":checked") == false ? 0 : 1,
        ShipperAccNo: $('#Text_SHIPPERDOAccountNo').data("kendoAutoComplete").value(),
        ShipperTaxID: $('#SHP_TaxId').val(),
        ShipperName: $('#SHIPPER_Name').val(),
        ShipperName_2: $('#SHIPPER_Name2').val(),
        ShipperAddress: $('#SHIPPER_Street').val(),
        ShipperAddress_2: $('#SHIPPER_Street2').val(),
        ShipperTown: $('#SHIPPER_TownLocation').val(),
        ShipperState: $('#SHIPPER_State').val(),
        ShipperPostalCode: $('#SHIPPER_PostalCode').val(),
        ShipperContactNo: $('#SHIPPER_MobileNo').val(),
        ShipperContactNo_2: $('#SHIPPER_MobileNo2').val(),
        ShipperEmail: $('#SHIPPER_Email').val(),
        ShipperCountry: $('#Text_SHIPPER_CountryCode').data("kendoAutoComplete").value(),
        ShipperCity: $('#Text_SHIPPER_City').data("kendoAutoComplete").value(),
        ShipperFax: $('#SHipper_Fax').val(),
        //consignee information
        IsConsignee: $('#FWB_Consignee').is(":checked") == false ? 0 : 1,
        ConsigneeAccNo: $('#Text_CONSIGNEEDOAccountNO').data("kendoAutoComplete").value(),
        ConsigneeTaxID: $('#CON_TaxId').val(),
        ConsigneeName: $('#CONSIGNEE_AccountNoName').val(),
        ConsigneeName_2: $('#CONSIGNEE_AccountNoName2').val(),
        ConsigneeAddress: $('#CONSIGNEE_Street').val(),
        ConsigneeAddress_2: $('#CONSIGNEE_Street2').val(),
        ConsigneeTown: $('#CONSIGNEE_TownLocation').val(),
        ConsigneeState: $('#CONSIGNEE_State').val(),
        ConsigneePostalCode: $('#CONSIGNEE_PostalCode').val(),
        ConsigneeContactNo: $('#CONSIGNEE_MobileNo').val(),
        ConsigneeContactNo_2: $('#CONSIGNEE_MobileNo2').val(),
        ConsigneeEmail: $('#CONSIGNEE_Email').val(),
        ConsigneeCountry: $('#Text_CONSIGNEE_CountryCode').data("kendoAutoComplete").value(),
        ConsigneeCity: $('#Text_CONSIGNEE_City').data("kendoAutoComplete").value(),
        ConsigneeFax: $('#CONSIGNEE_Fax').val()
    }

    ConsignmentDetailData.OriginCity = ConsignmentDetailData.OriginCity.split('-')[0];
    ConsignmentDetailData.DestinationCity = ConsignmentDetailData.DestinationCity.split('-')[0];

    ConsignmentDetailData.ShipperCountry = ConsignmentDetailData.ShipperCountry.split('-')[0];
    ConsignmentDetailData.ShipperCity = ConsignmentDetailData.ShipperCity.split('-')[0];


    ConsignmentDetailData.ConsigneeCountry = ConsignmentDetailData.ConsigneeCountry.split('-')[0];
    ConsignmentDetailData.ConsigneeCity = ConsignmentDetailData.ConsigneeCity.split('-')[0];


    ConsignmentDetails.push(ConsignmentDetailData);
    FlightCheckInDetails.push(flightCheckInData);


    var type = document.querySelector('input[name="ShipmentType"]:checked').value;

    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/saveDOShipment", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ ConsignmentDetails: ConsignmentDetails, FlightCheckInDetails: FlightCheckInDetails, DailyFlightSNo: DetailsForSaveShipment.dailyFlightSno, CustomRefNo: DetailsForSaveShipment.CustomRefNo, waybilltype: type, wayBillNo: ConsignmentDetailData.WayBillNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            debugger
            ShowMessage('success', 'Success', "Details Saved successfully", "bottom-right");
            $("#divDetail2").dialog('close');

            $('#divDeliveryOrderDetails').html("");

            $('#Text_searchAWBNo').val(ConsignmentDetailData.WayBillNo);
            $('#searchAWBNo').val(ConsignmentDetailData.WayBillNo);


            $('#btnSearch').click();


        },
        error: function (error) {
            debugger
            ShowMessage('warning', 'Warning', "Unable to save data.");
        }
    });
}
function getShipperDetails() {
    var CustomerNo = $('#Text_SHIPPERDOAccountNo').data("kendoAutoComplete").key();
    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/getCustomerDetails", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ customerNo: CustomerNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            debugger
            var resData = JSON.parse(result);

            $('#SHIPPER_Name').attr('disabled', resData.Table0[0].Name.trim() != '' ? true : false);
            $('#SHIPPER_Name').val(resData.Table0[0].Name);

            $('#SHIPPER_Name2').attr('disabled', resData.Table0[0].Name2.trim() != '' ? true : false);
            $('#SHIPPER_Name2').val(resData.Table0[0].Name2);

            $('#SHIPPER_Street').attr('disabled', resData.Table0[0].Address.trim() != '' ? true : false);
            $('#SHIPPER_Street').val(resData.Table0[0].Address);

            $('#SHIPPER_Street2').attr('disabled', resData.Table0[0].Address2.trim() != '' ? true : false);
            $('#SHIPPER_Street2').val(resData.Table0[0].Address2);

            $('#SHIPPER_TownLocation').attr('disabled', resData.Table0[0].Town.trim() != '' ? true : false);
            $('#SHIPPER_TownLocation').val(resData.Table0[0].Town);

            $('#SHIPPER_State').attr('disabled', resData.Table0[0].State.trim() != '' ? true : false);
            $('#SHIPPER_State').val(resData.Table0[0].State);

            $('#SHIPPER_PostalCode').attr('disabled', resData.Table0[0].PostalCode.trim() != '' ? true : false);
            $('#SHIPPER_PostalCode').val(resData.Table0[0].PostalCode);

            $('#SHIPPER_MobileNo').attr('disabled', resData.Table0[0].Phone.trim() != '' ? true : false);
            $('#SHIPPER_MobileNo').val(resData.Table0[0].Phone);

            $('#SHIPPER_MobileNo2').attr('disabled', resData.Table0[0].Phone.trim() != '' ? true : false);
            $('#SHIPPER_MobileNo2').val(resData.Table0[0].Phone);

            $('#SHIPPER_Email').attr('disabled', resData.Table0[0].Email.trim() != '' ? true : false);
            $('#SHIPPER_Email').val(resData.Table0[0].Email);

            $('#SHipper_Fax').attr('disabled', resData.Table0[0].Fax.trim() != '' ? true : false);
            $('#SHipper_Fax').val(resData.Table0[0].Fax);

            $('#Text_SHIPPER_CountryCode').data("kendoAutoComplete").enable(false);
            $('#Text_SHIPPER_CountryCode').data("kendoAutoComplete").key(resData.Table0[0].CountrySNo);
            $('#Text_SHIPPER_CountryCode').data("kendoAutoComplete").value(resData.Table0[0].CountryCode);

            $('#Text_SHIPPER_City').data("kendoAutoComplete").enable(false);
            $('#Text_SHIPPER_City').data("kendoAutoComplete").key(resData.Table0[0].CitySNo);
            $('#Text_SHIPPER_City').data("kendoAutoComplete").value(resData.Table0[0].CityCode);

        },
        error: function (error) {
            debugger
            ShowMessage('warning', 'Warning', "Unable to save data.");
        }
    });
}
function getConsigneeDetails() {
    var CustomerNo = $('#Text_CONSIGNEEDOAccountNO').data("kendoAutoComplete").key();
    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/getCustomerDetails", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ customerNo: CustomerNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            debugger
            var resData = JSON.parse(result);

            $('#CONSIGNEE_AccountNoName').attr('disabled', resData.Table0[0].Name.trim() != '' ? true : false);
            $('#CONSIGNEE_AccountNoName').val(resData.Table0[0].Name);

            $('#CONSIGNEE_AccountNoName2').attr('disabled', resData.Table0[0].Name2.trim() != '' ? true : false);
            $('#CONSIGNEE_AccountNoName2').val(resData.Table0[0].Name2);

            $('#CONSIGNEE_Street').attr('disabled', resData.Table0[0].Address.trim() != '' ? true : false);
            $('#CONSIGNEE_Street').val(resData.Table0[0].Address);

            $('#CONSIGNEE_Street2').attr('disabled', resData.Table0[0].Address2.trim() != '' ? true : false);
            $('#CONSIGNEE_Street2').val(resData.Table0[0].Address2);

            $('#CONSIGNEE_TownLocation').attr('disabled', resData.Table0[0].Town.trim() != '' ? true : false);
            $('#CONSIGNEE_TownLocation').val(resData.Table0[0].Town);

            $('#CONSIGNEE_State').attr('disabled', resData.Table0[0].State.trim() != '' ? true : false);
            $('#CONSIGNEE_State').val(resData.Table0[0].State);

            $('#CONSIGNEE_PostalCode').attr('disabled', resData.Table0[0].PostalCode.trim() != '' ? true : false);
            $('#CONSIGNEE_PostalCode').val(resData.Table0[0].PostalCode);

            $('#CONSIGNEE_MobileNo').attr('disabled', resData.Table0[0].Phone.trim() != '' ? true : false);
            $('#CONSIGNEE_MobileNo').val(resData.Table0[0].Phone);

            $('#CONSIGNEE_MobileNo2').attr('disabled', resData.Table0[0].Phone.trim() != '' ? true : false);
            $('#CONSIGNEE_MobileNo2').val(resData.Table0[0].Phone);

            $('#CONSIGNEE_Email').attr('disabled', resData.Table0[0].Email.trim() != '' ? true : false);
            $('#CONSIGNEE_Email').val(resData.Table0[0].Email);

            $('#CONSIGNEE_Fax').attr('disabled', resData.Table0[0].Fax.trim() != '' ? true : false);
            $('#CONSIGNEE_Fax').val(resData.Table0[0].Fax);

            $('#Text_CONSIGNEE_CountryCode').data("kendoAutoComplete").enable(false);
            $('#Text_CONSIGNEE_CountryCode').data("kendoAutoComplete").key(resData.Table0[0].CountrySno);
            $('#Text_CONSIGNEE_CountryCode').data("kendoAutoComplete").value(resData.Table0[0].CountryCode);

            $('#Text_CONSIGNEE_City').data("kendoAutoComplete").enable(false);
            $('#Text_CONSIGNEE_City').data("kendoAutoComplete").key(resData.Table0[0].CitySno);
            $('#Text_CONSIGNEE_City').data("kendoAutoComplete").value(resData.Table0[0].CityCode);
        },
        error: function (error) {
            debugger
            ShowMessage('warning', 'Warning', "Unable to save data.");
        }
    });
}

function AWBPrint() {
    var tnc = userContext.SysSetting.AWBPRINTTERMSCONDITIONS;


    //$("#PrintTypeAWbDialog").remove();
    $('#divbody').append('<div id="PrintTypeAWbDialog" style="font-family: Arial; font-size:13px;"></div>');
    $("#PrintTypeAWbDialog").append('<table id="tblpassword" style="margin: 0px auto; width:80%;"><tr><td>Select Print Type :</td></tr><tr><td><input type="hidden" name="AWbNo" id="AWbNo"  value=""><p><input type="radio" id="AWBPrint" value="AWBPrint" name="PrintType" checked="checked" /><label for="AWBPrint" > AWB Print</label>&nbsp;&nbsp;&nbsp;&nbsp; <input type="radio" id="AWBPrePrint" value="AWBPrePrint" name="PrintType" /> <label for="AWBPrePrint">AWB Pre Print</label></p></td></tr></table>');
    $("#PrintTypeAWbDialog").dialog(
        {
            autoResize: true,
            maxWidth: 400,
            width: 400,
            modal: true,
            title: 'Print Type AWB',
            draggable: false,
            resizable: false,
            buttons: {
                Print: function () {
                    var rbtnValue = $('input[name=PrintType]:checked').val();


                    if (currentawbsno > 0) {
                        if (userContext.SysSetting.AWBPrintofIATAFormat == 'True' && userContext.SysSetting.ClientEnvironment == 'UK') {
                            if (rbtnValue != undefined && rbtnValue == 'AWBPrint') {
                                window.open("ImportAwbPrintA4.html?sno=" + btoa(AwbNumber) + "&pagename=" + btoa('DeliveryOrder') + "&tnc=" + btoa(tnc) + "&AWBPrintofIATAFormat=" + btoa(userContext.SysSetting.AWBPrintofIATAFormat));
                            }
                            else if (rbtnValue != undefined && rbtnValue == 'AWBPrePrint') {
                                window.open("ImportAwbPrintA4.html?sno=" + btoa(AwbNumber) + "&pagename=" + btoa('DeliveryOrder') + "&tnc=" + btoa(tnc) + "&printType=" + btoa('pre') + "&AWBPrintofIATAFormat=" + btoa(userContext.SysSetting.AWBPrintofIATAFormat));
                            }
                            else {
                                jAlert("Print not generated");
                            }
                        } else {
                            if (rbtnValue != undefined && rbtnValue == 'AWBPrint') {
                                window.open("ImportAwbPrintA4.html?sno=" + btoa(AwbNumber) + "&pagename=" + btoa('DeliveryOrder') + "&tnc=" + btoa(tnc));
                            }
                            else if (rbtnValue != undefined && rbtnValue == 'AWBPrePrint') {
                                window.open("ImportAwbPrintA4.html?sno=" + btoa(AwbNumber) + "&pagename=" + btoa('DeliveryOrder') + "&tnc=" + btoa(tnc) + "&printType=" + btoa('pre'));
                            }
                            else {
                                jAlert("Print not generated");
                            }
                        }
                    }
                    else {
                        jAlert("Print not generated");
                    }
                    $(this).dialog("close");
                },
                Cancel: function () {
                    $(this).dialog("close");
                }
            },
            close: function () {
                $(this).dialog("close");
            }

        });

}


