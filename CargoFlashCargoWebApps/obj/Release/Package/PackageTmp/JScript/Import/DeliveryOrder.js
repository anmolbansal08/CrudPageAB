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
var InvoiceNo;
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
//$('[title="Select Bill To"]').closest('td').text('');
//$('[title="Select Bill To"]').closest('td').append('<font color="red">*</font> Bill To');

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
    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/GetWebForm/" + _CURR_PRO_ + "/Import/DeliveryOrderSearch/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContent);
            $("#divFooter").html(fotter).show();
            cfi.AutoComplete("searchAirline", "CarrierCode,AirlineName", "Airline", "CarrierCode", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");
            cfi.AutoComplete("searchFlightNo", "FlightNo", "vFlight", "FlightNo", "FlightNo", ["FlightNo"], null, "contains");
            cfi.AutoComplete("searchAWBNo", "AWBNo", "ImportAwb", "AWBNo", "AWBNo", ["AWBNo"], null, "contains");
            cfi.AutoComplete("searchSPHC", "Code,Description", "SPHC", "Code", "Description", ["Code", "Description"], null, "contains");
            $('#searchFromDate').data("kendoDatePicker").value("");
            $('#searchToDate').data("kendoDatePicker").value("");

            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });

            $("#btnSearch").bind("click", function () {
                CleanUI();
                DeliveryOrderSearch();
            });

            $("#btnNew").unbind("click").bind("click", function () {
                CleanUI();
                $("#hdnAWBSNo").val("");
                currentawbsno = 0;
                var module = "Import";
                if (_CURR_PRO_ == "HOUSE") {
                    module = "House";
                }
                $.ajax({
                    url: "Services/Import/DeliveryOrderService.svc/GetWebForm/" + _CURR_PRO_ + "/" + module + "/RESERVATION/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
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
        }
    });
}

function CleanUI() {
    //$("#divXRAY").hide();
    ////$("#tblShipmentInfo").hide();
    $("#divDetail").html("");
    $("#divDetail1").html("");
    $("#divDetail2").html("");
    $("#divDetail3").html("");
    ////$("#tblShipmentInfo").hide();
    //$("#divNewBooking").html("");
    $("#btnSave").unbind("click");
    $("#btnPrint").unbind("click");
    //$("#divXRAY").hide();

    //$("#ulTab").hide();
    //$("#divDetail_SPHC").html("");
    //$("#divDetailSHC").html("");

    //$("#divTab3").html("");
    //$("#divTab4").html("");
    //$("#divTab5").html("");
    $("#tabstrip").hide();
    $("#btnSave").css("display", "block");
    $("#btnUpdate").css("display", "none");
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

    if (_CURR_PRO_ == "DELIVERYORDER") {
        cfi.ShowIndexView("divDeliveryOrderDetails", "Services/Import/DeliveryOrderService.svc/GetGridData/" + _CURR_PRO_ + "/Import/DeliveryOrder/" + searchAirline.trim() + "/" + searchFlightNo.trim() + "/" + searchAWBNo.trim() + "/" + searchFromDate.trim() + "/" + searchToDate.trim() + "/" + SearchIncludeTransitAWB.trim() + "/" + SearchExcludeDeliveredAWB.trim() + "/" + LoggedInCity.trim() + "/" + searchSPHC.trim() + "/" + SearchConsignee.trim());
    }
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
                    //else {
                    //    cfi.AlphabetTextBox(controlId, alphabetstyle);
                    //}
                }
            }
        }
    });
    $("input[name='SearchIncludeTransitAWB']").hide();
    //$("#SearchIncludeTransitAWB").after("Include Transit AWB");
    $("#SearchExcludeDeliveredAWB").after("Exclude Delivered AWB");
}

function checkProgrss(item, subprocess, displaycaption) {
    CleanUI();
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




    //if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_0_D" + ",") >= 0) {
    //    return "\"dependentprocess\"";
    //}
    //else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_1_D" + ",") >= 0) {
    //    return "\"dependentprocess\"";
    //}
    //else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_0_I" + ",") >= 0) {
    //    return "\"partialprocess\"";
    //}
    //else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_1_I" + ",") >= 0) {
    //    return "\"completeprocess\"";
    //}
    //else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_0" + ",") >= 0) {
    //    return "\"partialprocess\"";
    //}
    //else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_1" + ",") >= 0) {
    //    return "\"completeprocess\"";
    //}
    //else if (item.toUpperCase().indexOf("," + subprocess.toUpperCase() + ",") >= 0) {
    //    return "\"completeprocess\"";
    //}
    //else {
    //    return "\"incompleteprocess\"";
    //}
}

function ResetDetails(obj, e) {
    // $("#divDetail").html("");
    $("#divDetail1").html("");
    //   $("#divDetail2").html("");
    $("#divDetail3").html("");
    //$("#tblShipmentInfo").hide();
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

        //$("#divDetail").hide();
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

    currentawbsno = closestTr.find("td:eq(" + awbSNoIndex + ")").text();
    accgrwt = closestTr.find("td:eq(" + accgrwtindex + ")").text();
    accvolwt = closestTr.find("td:eq(" + accvolwtindex + ")").text();
    accpcs = closestTr.find("td:eq(" + accpcsindex + ")").text();
    currentdetination = closestTr.find("td:eq(" + destIndex + ")").text();
    CurrentAWBNo = closestTr.find("td:eq(" + awbNoIndex + ")").text();
    currentArrivedShipmentSNo = closestTr.find("td:eq(" + arrivedSNoIndex + ")").text();
    ArrivedShipmentATA = closestTr.find("td:eq(" + ArrivedShipmentATAIndex + ")").text();

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
    //$("#tblShipmentInfo").show();
    $("#RushHandling").after('Rush Handling');

    InstantiateControl(cntrlid);
    $('#divDetail3').html("");
    $('#divDetail').show();

    UserSubProcessRights("divDetail", subprocesssno);
    $("#tabstrip input,select").attr("disabled", false);
    $("#btnChargeNote").hide();
    $("#btnUpdate").hide();
    $("#btnSaveToNext").hide();
    $("#btnChargeNote").hide();
    $("#btnPrintDLV").hide();
    $("#btnPrint").hide();
    $("#btnSave").show();

    var IsFWBWaybill = "0";

    if (subprocess.toUpperCase() == "RESERVATION" || subprocess.toUpperCase() == "FWB" || subprocess.toUpperCase() == "RATE" || subprocess.toUpperCase() == "CUSTOMER" || subprocess.toUpperCase() == "HANDLING" || subprocess.toUpperCase() == "SUMMARY" || subprocess.toUpperCase() == "FHL") {
        $.ajax({
            url: "Services/Import/ImportFWBService.svc/GetFWBType", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AWBSNo: currentawbsno }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var resData = jQuery.parseJSON(result);
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

                //if (IsFWBWaybill == "1" && IsFWBRate == "1" && IsColorFWB == "2") {
                //    $(ButtonProcess).removeClass("partialprocess completeprocess").addClass("completeprocess ");
                //}
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

                if (Number(IsDOCreate) == 1) {
                    $("#tabstrip input,select").attr("disabled", true);
                    $("#btnSave").hide();
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
    }

    if (subprocess.toUpperCase() == "DO") {
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
        return false;
    }
    else if (subprocess.toUpperCase() == "CANCEL DO") {
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
        return false;
    }
    else if (subprocess.toUpperCase() == "RELEASE") {
        BindPhysicalDO();
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
        return false;
    }
    else if (subprocess.toUpperCase() == "DOCS") {
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
        return false;
    }
    else if (subprocess.toUpperCase() == "RESERVATION" || subprocess.toUpperCase() == "FWB") {
        $("#btnPrint").show();
        $("#btnSaveToNext").show();
        $("#btnSave").show();
        BindReservationSection();
        if (Number(IsDOCreated) == 1) {
            $("#btnSave").hide();
            $("#btnSaveToNext").hide();
            $("#divDetail input,select").attr("disabled", true);
            $("#divDetail input[controltype='autocomplete']").each(function (e) {
                $("#" + $(this).attr("id")).data("kendoAutoComplete").enable(false);
            })

        }
        else if (IsFWBWaybill != "0") {
            $('#chkDocReceived').attr("disabled", true);
            // $('#btnSave').hide();
        }
        else {
            $("#divDetail input,select").attr("disabled", false);
            $('#btnSave').show();
        }
        if (IsColorFHL != "0") {
            $("#NoofHouse").attr("disabled", "disabled");
        }
        else {
            $("#NoofHouse").attr("disabled", false);
        }

        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                isSaveAndNext = "0";
                if ($("#ulTab").find("table").is(":hidden") == false && $("#ulTab").find("table").find("input[id='chkFWBAmmendment']").is(":checked") == false && Number(IsFWBCheck) == 1) {
                   // alert("Please Check FWB amendment.", "bottom-right");
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
                        // $("#divDetail2").dialog('close');
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

        $("#btnPrint").unbind("click").bind("click", function () {
            PrintImportAWB();
        });

        $("#btnSaveToNext").unbind("click").bind("click", function () {
            var FlightDateSelected = $("div[id='divareaTrans_importfwb_fwbshipmentitinerary']").find("tr[id^='areaTrans_importfwb_fwbshipmentitinerary']:first").find("input[id^='FlightDate']").data("kendoDatePicker").value() || "";
            if (IsFlightExist == false && FlightDateSelected != "" > 0) {
                if (cfi.IsValidSection(cntrlid)) {
                    isSaveAndNext = "1";

                    if ($("#ulTab").find("table").is(":hidden") == false && $("#ulTab").find("table").find("input[id='chkFWBAmmendment']").is(":checked") == false && Number(IsFWBCheck) == 1) {
                       // alert("Please Check FWB amendment.", "bottom-right");
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
                            //alert("Please Check FWB amendment.", "bottom-right");
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
                                                                // ShowProcessDetailsNew("RATE", "divDetailSHC", 0, subprocesssno);
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
                                                   // ShowProcessDetailsNew("RATE", "divDetailSHC", 0, subprocesssno);
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
                                                   // ShowProcessDetailsNew("RATE", "divDetailSHC", 0, subprocesssno);
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
                                      //  ShowProcessDetailsNew("RATE", "divDetailSHC", 0, subprocesssno);
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
                                                //$(ButtonProcess).removeClass("incompleteprocess partialprocess").addClass("partialprocess");
                                                ShowProcessDetailsNew("CUSTOMER", "divTab3", 0, subprocesssno);
                                              //  ShowProcessDetailsNew("RATE", "divDetailSHC", 0, subprocesssno);
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
                                    //ShowProcessDetailsNew("RATE", "divDetailSHC", 0, subprocesssno);
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
        return false;
    }
    else if (subprocess.toUpperCase() == "RATE") {
        $("#btnSaveToNext").show();
        //$("#btnSave").hide();
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
                        //$(ButtonProcess).removeClass("incompleteprocess partialprocess").addClass("partialprocess");
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
        return false;
    }
    else if (subprocess.toUpperCase() == "CUSTOMER") {
        $("#btnSaveToNext").show();
        //$("#btnSave").hide();
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
                                // $(ButtonProcess).removeClass("partialprocess completeprocess").addClass("completeprocess ");
                                ShowProcessDetailsNew("HANDLING", "divTab4", isdblclick, subprocesssno);
                            }
                        });
                        //$("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(3);
                        //ShowProcessDetailsNew("HANDLING", "divTab4", isdblclick, subprocesssno);
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
        return false;
    }
    else if (subprocess.toUpperCase() == "HANDLING") {
        $("#btnSaveToNext").show();
        //$("#btnSave").hide();
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
        return false;
    }
    else if (subprocess.toUpperCase() == "FHL") {
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
        return false;
    }
    else if (subprocess.toUpperCase() == "FAD") {
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
        return false;
    }
    else if (subprocess.toUpperCase() == "LOCATION") {
        $('#divDetail').append("<table id='tblLOCATION'></table>");
        BindLocation();
        $("#btnSave").css("display", "none");
    }
    else if (subprocess.toUpperCase() == "FAA") {
        //$('#divDetail').append("<table id='tblFAAChargeDescription'></table><table id='tblFAA'></table><table id='tblFAAEmailHistory'></table></table><table id='tblFAASMSHistory'></table></br></br></br>");
        $('#divDetail').append("<table id='tblFAAChargeDescription'></table><table id='tblFAA'></table><table id='tblFAAEmailHistory'></table><table id='tblFAASMSHistory'></table></table></br></br></br>");
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
        return false;
    }
    else if (subprocess.toUpperCase() == "EDOX") {
        $("#divXRAY").show();
        $("#spnShowSlacDetails").html("All Docs Received")
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
        return false;
    }
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
                cfi.Numeric(controlId, decimalPosition, true);
            }
            else {
                var alphabetstyle = cfi.IsValidSpanAlphabet(controlId);
                if (alphabetstyle != "") {
                    if (alphabetstyle == "datetype") {
                        cfi.DateType(controlId, true);
                    }
                    //else {
                    //    cfi.AlphabetTextBox(controlId, alphabetstyle);
                    //}
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

        //var tabStrip = $("#tabstrip").data("kendoTabStrip");
        //tabStrip.enable(tabStrip.tabGroup.children().eq(1), false);
        //tabStrip.enable(tabStrip.tabGroup.children().eq(2), false);
        //tabStrip.enable(tabStrip.tabGroup.children().eq(3), false);
        //tabStrip.enable(tabStrip.tabGroup.children().eq(4), false);
        //tabStrip.enable(tabStrip.tabGroup.children().eq(5), false);

        //$('#tabstrip ul:first li:eq(1) a').unbind("click").bind("click", function () {
        //    ShowProcessDetailsNew("RATE", "divDetailSHC", isdblclick, subprocesssno);
        //});

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
        //$("#tblShipmentInfo").show();
        $("#btnSave").unbind("click");
        InitializePage(subprocess, "divDetail", isdblclick);
    }
    else if (subprocess.toUpperCase() == "FHL") {
        //$("#tblShipmentInfo").show();
        $("#btnSave").unbind("click");
        InitializePage(subprocess, "divDetail", isdblclick);
    }

    //else if (subprocess.toUpperCase() == "CUSTOMREFERENCENUMBER") {
    //    //$("#tblShipmentInfo").show();
    //    $("#btnSave").unbind("click");
    //    InitializePage(subprocess, "divDetail", isdblclick);
    //}


    else if (subprocess.toUpperCase() == "FWB" || subprocess.toUpperCase() == "RESERVATION") {
        $.ajax({
            url: "Services/Import/ImportFWBService.svc/GetWebForm/ImportFWB/ImportFWB/RESERVATION/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#divDetail").html(result);
                if (result != undefined || result != "") {
                    //GetProcessSequence("ACCEPTANCE");
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
        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/GetWebForm/" + _CURR_PRO_ + "/Import/" + subprocess + "/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#divDetail").html(result);
                if (result != undefined || result != "") {
                    GetProcessSequence("DELIVERYORDER");
                    InitializePage(subprocess, "divDetail", isdblclick);
                    $('span#InitialPaymentType').hide();
                }

                if(!checkcanceldo)
                {
                    if (subprocess=="C")
                        ShowMessage('warning', 'Warning - Delivery Order', 'Delivery Order should be created before Cancel DO', " ", "bottom-right");
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

function SearchData(obj) {
    var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    var rows = $("tr[id^='tblAWBRateDesription']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
    getUpdatedRowIndex(rows.join(","), "tblAWBRateDesription");
    var testData = $('#tblAWBRateDesription').appendGrid('getStringJson');

    if (testData == "[]" || testData == false) {
        //alert('Invalid Data');
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
           // alert('Error occure');
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
                 { name: 'AWBSNo', type: 'hidden', value: $('#hdnAWBSNo').val() },
                 {
                     name: "MeasurementUnitCode", display: "Mes. Unit", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete", onSelect: "return CalculateVol(this);" }, ctrlCss: { width: "100px" }, isRequired: true, tableName: "MeasurementUnitCode", textColumn: "UnitCode", templateColumn: "", keyColumn: "UnitCode", templateColumn: ["UnitCode", "UnitName"]
                 },
                 {
                     name: 'Length', display: 'Length', type: 'text', value: '', ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, onblur: "return CalculateVol(this);", }, isRequired: true, onChange: function (evt, rowIndex) { }
                 },
                 {
                     name: 'Width', display: 'Width', type: 'text', value: '', ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, onblur: "return CalculateVol(this);", }, isRequired: true, onChange: function (evt, rowIndex) { }
                 },
                 {
                     name: 'Height', display: 'Height', type: 'text', value: 0, ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, onblur: "return CalculateVol(this);", }, onChange: function (evt, rowIndex) { }
                 },
                 {
                     name: 'Pieces', display: 'Pieces', type: 'text', value: 0, ctrlCss: { width: '120px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 10, onblur: "return CalculateVol(this);", }, onChange: function (evt, rowIndex) { }
                 },
                 {
                     name: 'VolumeWeight', display: 'Volume Weight', type: 'text', ctrlCss: { width: '120px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, }, isRequired: true, value: 0
                 },
                 {
                     name: "VolumeUnit", display: "Vol. Unit", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "100px" }, isRequired: true, tableName: "VolumeCode", textColumn: "VolumeCode", templateColumn: ["VolumeCode", "Description"], keyColumn: "VolumeCode"
                 },
                 { name: 'AWBRateDescriptionSNo', type: 'hidden', value: 0 },
        ],
        isPaging: true,
        hideButtons: { updateAll: true, insert: true, removeLast: true }
    });
}

function BindCountryCodeAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='CountryCode']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "CountryCode,CountryName", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
    });

    $(elem).find("input[id^='InfoType']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "InformationCode,Description", "InformationTypeOCI", "SNo", "InformationCode", ["InformationCode", "Description"], null, "contains");
    });

    $(elem).find("input[id^='CSControlInfoIdentifire']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "CustomsCode,Description", "CustomsOCI", "SNo", "CustomsCode", ["CustomsCode", "Description"], null, "contains");
    });

    $(elem).find("input[id^='FHL_OCI_CountryCode']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "CountryCode,CountryName", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains");
    });

    $(elem).find("input[id^='FHL_OCI_InfoType']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "InformationCode,Description", "InformationTypeOCI", "SNo", "InformationCode", ["InformationCode", "Description"], null, "contains");
    });

    $(elem).find("input[id^='FHL_OCI_CSControlInfoIdentifire']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "CustomsCode,Description", "CustomsOCI", "SNo", "CustomsCode", ["CustomsCode", "Description"], null, "contains");
    });
}

function ReBindCountryCodeAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_import_fwbshipmentocitrans']").find("[id^='areaTrans_import_fwbshipmentocitrans']").each(function () {
        $(this).find("input[id^='CountryCode']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });

        $(this).find("input[id^='InfoType']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "InformationTypeOCI", "SNo", "InformationCode", ["InformationCode", "Description"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });

        $(this).find("input[id^='CSControlInfoIdentifire']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "CustomsOCI", "SNo", "CustomsCode", ["CustomsCode", "Description"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
    });

    $(elem).closest("div[id$='areaTrans_import_fhlshipmentocitrans']").find("[id^='areaTrans_import_fhlshipmentocitrans']").each(function () {
        $(this).find("input[id^='FHL_OCI_CountryCode']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });

        $(this).find("input[id^='FHL_OCI_InfoType']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "InformationTypeOCI", "SNo", "InformationCode", ["InformationCode", "Description"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });

        $(this).find("input[id^='FHL_OCI_CSControlInfoIdentifire']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "CustomsOCI", "SNo", "CustomsCode", ["CustomsCode", "Description"]);
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
    });
}

function PrintImportAWB() {
    window.open("awbprint.html?sno=" + currentawbsno + "&pagename=DeliveryOrder");
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

function SaveFormData(subprocess) {
    var issave = false;
    if (subprocess.toUpperCase() == "RESERVATION" || subprocess.toUpperCase() == "FWB") {
        issave = SaveReservationInfo();
    }
    else if (subprocess.toUpperCase() == "RATE") {
        issave = SaveDimensionInfoNew();
        //issave = SaveDimensionInfo();
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
        if ($("input:radio[id='CustomerType']:checked").val() == "1")
            CheckAgentCreditLimit("", "", "", $('#BillTo').val());
        issave = SaveDOInfo();
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
        //else if (textId.indexOf("Text_IssuingAgent") >= 0) {
        //    cfi.setFilter(filterDo, "AirportSno", "eq", $("#Text_ShipmentOrigin").data("kendoAutoComplete").key());
        //    var filterAgent = cfi.autoCompleteFilter(filterDo);
        //    return filterAgent;
        //}
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
        //cfi.setFilter(filter, "IsDGR", "eq", "1");
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
        //else if (textId.indexOf("Text_SpecialHandlingCode") >= 0) {
        //    cfi.setFilter(filter, "IsDGR", "eq", "0");
        //    var SPHCDGRFilter = cfi.autoCompleteFilter(filter);
        //    return SPHCDGRFilter;
        //}
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
        //else if (textId == "Text_DocumentNo") {
        //    cfi.setFilter(filter, "CustomerSNo", "eq", $("#Text_Consignee").data("kendoAutoComplete").key())
        //    var filterAuthorizedPerson = cfi.autoCompleteFilter(filter);
        //    return filterAuthorizedPerson;
        //}
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
        cfi.setFilter(filter, "AWBSNo", "eq", currentawbsno)
        if (subprocesssno == 2137)
            cfi.setFilter(filter, "IsCompletePD", "eq", "0")
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
        cfi.setFilter(filter, "CitySNo", "eq", userContext.CitySNo)
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
    else if (textId.indexOf("Text_offPoint") >= 0) {
        cfi.setFilter(filter, "SNo", "Notin", $("#" + textId).closest('tr').find("input[id^='Text_BoardPoint']").data("kendoAutoComplete").key());
        var filterDestxt = cfi.autoCompleteFilter([filter]);
        return filterDestxt;
    }
    else if (textId.indexOf("Text_BoardPoint") >= 0) {
        cfi.setFilter(filter, "SNo", "Notin", $("#" + textId).closest('tr').find("input[id^='Text_offPoint']").data("kendoAutoComplete").key());
        var filterDestxt = cfi.autoCompleteFilter([filter]);
        return filterDestxt;
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
    flag = true;
    var pieces = 0;
    var grossWt = 0;
    var totalPieces = 0;
    var Mode = $("[id^='CustomerType']").is(':disabled') == true ? "CASH" : $('input:radio[id="CustomerType"]:checked').val() == 0 ? "CASH" : "CREDIT";
    var BillTo = $("#Text_BillTo").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_BillTo").data("kendoAutoComplete").key();
    var BillToText = $("#BillToText").val();
    var TotalCredit = $("span[id='TotalAmountDO']").text();
    var paymentType = $("#Text_PaymentType").data("kendoAutoComplete").value();
    //var frtAmount = $("span[id='TotalFreight']").text();
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

    if (Number(hawb) > 0 && $("span[id='HAWBConsigneeName']").text() == "") {
        ShowMessage('warning', 'Warning - Delivery Order [' + CurrentAWBNo + ']', "House Consignee Name Not Updated.", "bottom-right");
        flag = false;
        return false
    }

    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/CheckWaybillDetail?AWBNo=" + currentawbsno + "&ArrivedShipmentSNo=" + currentArrivedShipmentSNo, async: false, type: "get", dataType: "json", cache: false,
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

                if (Number(IsHouseDo) > 0 && Number(hawb) == 0) {
                    ShowMessage('warning', 'Warning - Delivery Order [' + CurrentAWBNo + ']', "For Delivery Order, Kindly select the house no for House DO.", "bottom-right");
                    flag = false;
                    return false
                }

                if (Number(IsHouseDo) == 0 && IsPartDo.toUpperCase() == "TRUE" && Number(hawb) != 0) {
                    ShowMessage('warning', 'Warning - Delivery Order [' + CurrentAWBNo + ']', "For Delivery Order, Kindly deselect the house no for DO.", "bottom-right");
                    flag = false;
                    return false
                }
            }
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - DO', "AWB No. [" + CurrentAWBNo + "] -  unable to process.", "bottom-right");
        }
    });

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
                    flag = false;
                    //$('input:radio[id="CustomerType"]').filter('[value="0"]').attr('checked', true);
                    //return false
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
            PartSNo: $(this).find("span[id^='DailyFlightSNo']").text(),
            Pieces: Number($(this).find("span[id^='BupPcs']").text()) + Number($(this).find("input[id^='_tempBulkPcs']").val()),
            GrossWeight: Number($(this).find("span[id^='BupGrWt']").text()) + Number($(this).find("input[id^='_tempBulkGrWt']").val()),
            VolumeWeight: 0,
            IsBUP: Number($(this).find("span[id^='BupPcs']").text()) > 0 ? 1 : 0,
            SPHCSNo: 0,
            SPHCTransSNo: $("#Text_SPHCType").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_SPHCType").data("kendoAutoComplete").key(),
            ULDSNo: $(this).find("input[id^='Multi_ULDNo']").val() == "" ? "0" : $(this).find("input[id^='Multi_ULDNo']").val()
        };
        ShipmentDetailArray.push(ShipmentDetailViewModel);
    });

    if (Number(pieces) != Number(totalDOPieces)) {
        //alert("Part charges will be applicable on part DO Creation");
       // alert("Part DO charges will be applicable for part shipment delivery order.");
        ShowMessage('warning', 'Warning - Delivery Order', 'Part DO charges will be applicable for part shipment delivery order.', " ", "bottom-right");
    }

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
        //PaymentType: $("#Text_PaymentType").data("kendoAutoComplete").key() == 0 ? false : true,
        PaymentType: $("#PaymentType").val() == 0 ? false : true,
        RctNo: $("#RctNo").val(),
        RctDate: cfi.CfiDate("RctDate"),
        HAWBSNo: hawb,
        Remarks: $("#DO_Remarks").val(),
        ParticipantSNo: $("#Text_ParticipantName").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_ParticipantName").data("kendoAutoComplete").key(),
        ArrivedShipmentSNo: currentArrivedShipmentSNo,
        IsPartDo: DOType == "PART" ? true : false,
        BillTo: BillTo,
        Pieces: pieces,
        GrossWt: grossWt.toFixed(3),
        AuthorizedPersoneId: $("#AuthorizedPersonId").val(),
        AuthorizedPersoneName: $("#AuthorizedPersonName").val(),
        AuthorizedPersonCompany: $("#AuthorizedPersonCompany").val(),
        BillToText: BillToText
    };

    var HandlingChargeArray = [];
    if ($("div[id$='divareaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").length > 0) {
        $("div[id$='divareaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function () {
            if ($(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key() != "") {
                var HandlingChargeViewModel = {
                    SNo: $(this).find("td[id^='tdSNoCol']").html(),
                    AWBSNo: currentawbsno,
                    WaveOff: $(this).find("[id^='hdnremark']").val() == undefined || $(this).find("[id^='hdnremark']").val() == "" ? 0 : ($(this).find("[id^='WaveOff']").prop('checked') == true || Number(FOCConsigneeSNo) > 0 ? 1 : 0),//$(this).find("[id^='WaveOff']").prop('checked') == true || Number(FOCConsigneeSNo) > 0 ? 1 : 0,
                    TariffCodeSNo: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key(),
                    TariffHeadName: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").value(),
                    pValue: parseFloat($(this).find("[id^='PValue']").val() == "" ? 0 : $(this).find("[id^='PValue']").val()),
                    sValue: parseFloat($(this).find("[id^='SValue']").val() == "" ? 0 : $(this).find("[id^='SValue']").val()),
                    Amount: parseFloat($(this).find("[id^='Amount']").text() == "" ? 0 : $(this).find("[id^='Amount']").text()),
                    TotalTaxAmount: $(this).find("[id^='TotalTaxAmount']").text() == "" ? 0 : $(this).find("[id^='TotalTaxAmount']").text(),
                    TotalAmount: $(this).find("[id^='TotalAmount']").text() == "" ? 0 : $(this).find("[id^='TotalAmount']").text(),
                    Rate: $(this).find("[id^='Amount']").text(),
                    Min: 1,
                    Mode: Mode,
                    ChargeTo: 0,//$("#Text_BillTo").data("kendoAutoComplete").key(),
                    pBasis: $(this).find("[id^='PBasis']").text(),
                    sBasis: $(this).find("[id^='SBasis']").text(),
                    Remarks: $(this).find("[id^='Remarks']").val() + '|' + $(this).find("[id^='PartSNo']").val(),
                    WaveoffRemarks: $(this).find("[id^='hdnremark']").val() == undefined ? "" : $(this).find("[id^='hdnremark']").val()
                };
                HandlingChargeArray.push(HandlingChargeViewModel);
            }
        });
    }
    else {
       // alert("Please get charge first.");
        ShowMessage('warning', 'Warning - Delivery Order', 'Please get charge first.', " ", "bottom-right");
        return false;
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

    if (flag == true) {
        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/SaveDO", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AWBSNo: currentawbsno, DeliveryOrderInfo: DeliveryOrderInfo, lstHandlingCharges: HandlingChargeArray, lstShipmentDetailDetail: ShipmentDetailArray }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "2000") {
                    ShowMessage('success', 'Success - Delivery Order', "AWB No. [" + CurrentAWBNo + "] -  Processed Successfully", "bottom-right");
                    $("#btnSave").unbind("click");
                    flag = true;
                }
                else {
                    ShowMessage('warning', 'Warning - Delivery Order [' + CurrentAWBNo + ']', "Please correct value(s) for :- " + result + ".", "bottom-right");
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
    return flag;
}

function SaveDLVInfo() {
    var flag = true;
    var PhysicalDeliveryInfo = {
        DOSNo: $("#Text_DONo").data("kendoAutoComplete").key(),
        //IsBondedWarehouseTransfer: $('input:checkbox[id*="BondedWarehouseTransfer"]')[0].checked == true ? 1 : 0,
        IsConsolidatorDOReceived: $('input:checkbox[id*="ConsolidatorDOReceived"]')[0].checked == true ? 1 : 0,
        DeliveredToSNo: $("#Text_DeliverdTo").data("kendoAutoComplete").key() == "" ? 0 : $("#Text_DeliverdTo").data("kendoAutoComplete").key(),
        Date: cfi.CfiDate("Date"),
        PDSRemarks: $("#PDSRemarks").val(),
        CustomerRelease: $("input[name='CustomRelease']:checked").val(),
        CustomerType: $("#Text_CustomerType").data("kendoAutoComplete").key(),
        AuthorizedPersoneId: $("#AuthorizedPersonId").val(),
        AuthorizedPersoneName: $("#AuthorizedPersonName").val(),
        AuthorizedPersonCompany: $("#AuthorizedPersonCompany").val(),
        //PDPieces: $("#Pieces").val(),
        //PDGrossWeight: $("#Weight").val()
        PDPieces: Number($("span[id^='BupPcs']").text()) + Number($("input[id^='_tempBulkPcs']").val()),
        PDGrossWeight: Number($("span[id^='BupGrWt']").text()) + Number($("input[id^='_tempBulkGrWt']").val()),
        ULDSNo: $("input[id^='Multi_PDULDNo']").val() == "" ? "0" : $("input[id^='Multi_PDULDNo']").val()
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
                    //sendSMS('test');
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

function CheckDOType() {
    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/CheckWaybillDetail?AWBNo=" + currentawbsno+ "&ArrivedShipmentSNo=" + currentArrivedShipmentSNo, async: false, type: "get", dataType: "json", cache: false,
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
                var IsLocation = checkData[0].IsLocation;
                var IsHouseDetail = checkData[0].IsHAWBDetail;
                var IsFWBDone = checkData[0].IsFWBDone;
                var IsArrived = checkData[0].IsArrived;
                $("#divDetail").show();
                if (IsArrived == 0 && IsLocation == 0) {
                   // alert("Location not Assigned for Delivery Order.");
                    ShowMessage('warning', 'Warning - Delivery Order', 'Location not Assigned for Delivery Order.', " ", "bottom-right");
                    $("#divDetail").hide();
                    if (checkData[0].IsCreateDO == 1) {
                        if (doDataDetail.length > 0) {
                            var strVar = "";
                            strVar += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr style=\"background-color: #C0C0C0\"><tbody class=\"ui-widget-content\"><td class=\"ui-state-active caption formSection\" align=\"left\" colspan=\"12\">Delivery Order Details<\/td><\/tr>";
                            strVar += "<tr style=\"font-weight: bold\">";
                            strVar += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Customer Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO Date<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Waybill Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">HAWB No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Pieces<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Gross Weight<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Total Charges<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Charges Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Participant Name<\/td><td style=\"padding-left: 5px; width: 250px\" class=\"ui-widget-header\">Action<\/td><\/tr>";

                            for (var i = 0; i < doDataDetail.length; i++) {
                                strVar += "<td class=\"ui-widget-content\">" + doDataDetail[i].CustomerType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DeliveryOrderNo + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DeliveryOrderDate + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DOType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].WaybillType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].HouseNo + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DOPieces + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DOGrossWeight + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].TotalCharges + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].ChargesType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].ParticipantName + "<\/td><td class=\"ui-widget-content\">";
                                if (doDataDetail[i].IsCancel == 0) {
                                    strVar += "<input id=\"btnPrint\" type=\"button\" value=\"DO Print A4\" onclick=\"PrintSlip('DO'," + doDataDetail[i].DOSNo + ");\">";
                                    strVar += "&nbsp;<input id=\"btnPrint\" type=\"button\" value=\"Pre-Printed DO\" onclick=\"PrintSlip('DOPrint'," + doDataDetail[i].DOSNo + ");\">";
                                    strVar += "&nbsp;<input id=\"btnLocation\" type=\"button\" value=\"DO Location\" onclick=\"OpenPopUp('Warehouse Location'," + doDataDetail[i].DOSNo + ");\">";
                                }
                                else {
                                    strVar += "<input id=\"btnPrint\" type=\"button\" style=\"background-color:red;color:white;\" value=\"DO Print A4\" onclick=\"PrintSlip('DO'," + doDataDetail[i].DOSNo + ");\">";
                                    strVar += "&nbsp;<input id=\"btnPrint\" type=\"button\" style=\"background-color:red;color:white;\" value=\"Pre-Printed DO\" onclick=\"PrintSlip('DOPrint'," + doDataDetail[i].DOSNo + ");\">";
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
                else if (IsLocation == 0 && IsArrived == 1) {
                    //alert("Location not Assigned for Delivery Order.");
                    ShowMessage('warning', 'Warning - Delivery Order', 'Location not Assigned for Delivery Order.', " ", "bottom-right");
                    $("#divDetail").hide();
                    if (checkData[0].IsCreateDO == 1) {
                        if (doDataDetail.length > 0) {
                            var strVar = "";
                            strVar += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr style=\"background-color: #C0C0C0\"><tbody class=\"ui-widget-content\"><td class=\"ui-state-active caption formSection\" align=\"left\" colspan=\"12\">Delivery Order Details<\/td><\/tr>";
                            strVar += "<tr style=\"font-weight: bold\">";
                            strVar += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Customer Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO Date<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Waybill Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">HAWB No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Pieces<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Gross Weight<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Total Charges<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Charges Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Participant Name<\/td><td style=\"padding-left: 5px; width: 250px\" class=\"ui-widget-header\">Action<\/td><\/tr>";

                            for (var i = 0; i < doDataDetail.length; i++) {
                                strVar += "<td class=\"ui-widget-content\">" + doDataDetail[i].CustomerType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DeliveryOrderNo + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DeliveryOrderDate + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DOType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].WaybillType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].HouseNo + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DOPieces + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DOGrossWeight + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].TotalCharges + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].ChargesType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].ParticipantName + "<\/td><td class=\"ui-widget-content\">";
                                if (doDataDetail[i].IsCancel == 0) {
                                    strVar += "<input id=\"btnPrint\" type=\"button\" value=\"DO Print A4\" onclick=\"PrintSlip('DO'," + doDataDetail[i].DOSNo + ");\">";
                                    strVar += "&nbsp;<input id=\"btnPrint\" type=\"button\" value=\"Pre-Printed DO\" onclick=\"PrintSlip('DOPrint'," + doDataDetail[i].DOSNo + ");\">";
                                    strVar += "&nbsp;<input id=\"btnLocation\" type=\"button\" value=\"DO Location\" onclick=\"OpenPopUp('Warehouse Location'," + doDataDetail[i].DOSNo + ");\">";
                                }
                                else {
                                    strVar += "<input id=\"btnPrint\" type=\"button\" style=\"background-color:red;color:white;\" value=\"DO Print A4\" onclick=\"PrintSlip('DO'," + doDataDetail[i].DOSNo + ");\">";
                                    strVar += "&nbsp;<input id=\"btnPrint\" type=\"button\" style=\"background-color:red;color:white;\" value=\"Pre-Printed DO\" onclick=\"PrintSlip('DOPrint'," + doDataDetail[i].DOSNo + ");\">";
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
                            strVar += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Customer Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO Date<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Waybill Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">HAWB No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Pieces<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Gross Weight<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Total Charges<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Charges Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Participant Name<\/td><td style=\"padding-left: 5px; width: 250px\" class=\"ui-widget-header\">Action<\/td><\/tr>";

                            for (var i = 0; i < doDataDetail.length; i++) {
                                strVar += "<td class=\"ui-widget-content\">" + doDataDetail[i].CustomerType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DeliveryOrderNo + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DeliveryOrderDate + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DOType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].WaybillType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].HouseNo + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DOPieces + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DOGrossWeight + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].TotalCharges + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].ChargesType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].ParticipantName + "<\/td><td class=\"ui-widget-content\">";
                                if (doDataDetail[i].IsCancel == 0) {
                                    strVar += "<input id=\"btnPrint\" type=\"button\" value=\"DO Print A4\" onclick=\"PrintSlip('DO'," + doDataDetail[i].DOSNo + ");\">";
                                    strVar += "&nbsp;<input id=\"btnPrint\" type=\"button\" value=\"Pre-Printed DO\" onclick=\"PrintSlip('DOPrint'," + doDataDetail[i].DOSNo + ");\">";
                                    strVar += "&nbsp;<input id=\"btnLocation\" type=\"button\" value=\"DO Location\" onclick=\"OpenPopUp('Warehouse Location'," + doDataDetail[i].DOSNo + ");\">";
                                }
                                else {
                                    strVar += "<input id=\"btnPrint\" type=\"button\" style=\"background-color:red;color:white;\" value=\"DO Print A4\" onclick=\"PrintSlip('DO'," + doDataDetail[i].DOSNo + ");\">";
                                    strVar += "&nbsp;<input id=\"btnPrint\" type=\"button\" style=\"background-color:red;color:white;\" value=\"Pre-Printed DO\" onclick=\"PrintSlip('DOPrint'," + doDataDetail[i].DOSNo + ");\">";
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
                   // alert("House Entry mandatory for Delivery Order.");
                    ShowMessage('warning', 'Warning - Delivery Order', 'House Entry mandatory for Delivery Order.', " ", "bottom-right");
                    $("#divDetail").hide();
                }
                else if (IsFWBDone == 0) {
                    //alert("FWB Details are required to proceed with Delivery Order.");
                    ShowMessage('warning', 'Warning - Delivery Order', 'FWB Details are required to proceed with Delivery Order.', " ", "bottom-right");
                    $("#divDetail").hide();
                }
                else {
                    $("#Text_HAWB").removeAttr("data-valid").removeAttr("data-valid-msg");
                    //if (checkData[0].DOCreated == 1 && checkData[0].ArrivedShipmentSNo == currentArrivedShipmentSNo) {
                    if (checkData[0].DOCreated == 1) {
                        if (doDataDetail.length > 0) {
                            var strVar = "";
                            strVar += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr style=\"background-color: #C0C0C0\"><tbody class=\"ui-widget-content\"><td class=\"ui-state-active caption formSection\" align=\"left\" colspan=\"12\">Delivery Order Details<\/td><\/tr>";
                            strVar += "<tr style=\"font-weight: bold\">";
                            strVar += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Customer Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO Date<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Waybill Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">HAWB No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Pieces<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Gross Weight<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Total Charges<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Charges Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Participant Name<\/td><td style=\"padding-left: 5px; width: 250px\" class=\"ui-widget-header\">Action<\/td><\/tr>";

                            for (var i = 0; i < doDataDetail.length; i++) {
                                strVar += "<td class=\"ui-widget-content\">" + doDataDetail[i].CustomerType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DeliveryOrderNo + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DeliveryOrderDate + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DOType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].WaybillType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].HouseNo + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DOPieces + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DOGrossWeight + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].TotalCharges + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].ChargesType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].ParticipantName + "<\/td><td class=\"ui-widget-content\">";
                                if (doDataDetail[i].IsCancel == 0) {
                                    strVar += "<input id=\"btnPrint\" type=\"button\" value=\"DO Print A4\" onclick=\"PrintSlip('DO'," + doDataDetail[i].DOSNo + ");\">";
                                    strVar += "&nbsp;<input id=\"btnPrint\" type=\"button\" value=\"Pre-Printed DO\" onclick=\"PrintSlip('DOPrint'," + doDataDetail[i].DOSNo + ");\">";
                                    strVar += "&nbsp;<input id=\"btnLocation\" type=\"button\" value=\"DO Location\" onclick=\"OpenPopUp('Warehouse Location'," + doDataDetail[i].DOSNo + ");\">";
                                }
                                else {
                                    strVar += "<input id=\"btnPrint\" type=\"button\" style=\"background-color:red;color:white;\" value=\"DO Print A4\" onclick=\"PrintSlip('DO'," + doDataDetail[i].DOSNo + ");\">";
                                    strVar += "&nbsp;<input id=\"btnPrint\" type=\"button\" style=\"background-color:red;color:white;\" value=\"Pre-Printed DO\" onclick=\"PrintSlip('DOPrint'," + doDataDetail[i].DOSNo + ");\">";
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
                    else
                        BindDeliveryOrder("MAWB", shipmentType, "PART");
                }
            }
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - DO', "AWB No. [" + CurrentAWBNo + "] -  unable to process.", "bottom-right");
        }
    });
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
                    strVar += "No Recorde Found";
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

                            //if (Number(FOCConsigneeSNo) > 0)
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
            // data: JSON.stringify({ TariffSNo: parseInt(0), AWBSNo: currentawbsno, CityCode: currentdetination, HAWBSNo: hawb, ProcessSNo: parseInt(22), SubProcessSNo: parseInt(subprocesssno), GrWT: parseFloat(grossWt), ChWt: parseFloat(grossWt), pValue: parseFloat(0), sValue: parseFloat(0), Pieces: parseInt(pieces), DOSNo: parseInt(0), PDSNo: parseInt(0), lstShipmentInfo: ShipmentDetailArray }),
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
                            //if (i.isMandatory == 1 && i.ChargeType == "Storage") {
                            //    FocHoursDetail.push({ "FocHours": i.ATAGMT });
                            //}
                            //   if (i.ChargeType == "Storage") {
                            FocHoursDetail.push({ "FocHours": i.FOCTime });
                            DailyFlightDetail.push({ "Flight": i.FlightNo });
                            //   }
                        });
                    }

                    var strVar = "";
                    var count = 0;
                    //strVar += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody>";
                    //strVar += "<tr style=\"font-weight: bold\">";
                    //strVar += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">SNo<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Part No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Free Hour<\/td><\/tr>";
                    if (FocHoursDetail.length > 0) {
                        for (var i = 0; i < FocHoursDetail.length; i++) {
                            count = Number(i) + 1;
                            //strVar += "<tr style=\"font-weight: bold\">";
                            //strVar += "<td class=\"ui-widget-content\" colspan=\"3\">Free Storage Till " + FocHoursDetail[i].FocHours + " (GMT)/<\/td><\/tr>"
                            //strVar += "<td class=\"ui-widget-content\">" + count + "<\/td><td class=\"ui-widget-content\">Part:" + count + "<\/td><td class=\"ui-widget-content\">" + FocHoursDetail[i].FocHours + "<\/td><\/tr>"
                            // strVar += "Free Storage Till " + FocHoursDetail[i].FocHours + " (GMT)/";
                            strVar += "Free Storage Till " + FocHoursDetail[i].FocHours + " " + DailyFlightDetail[i].Flight + " / ";
                        }
                    }
                    else {
                        //strVar += "<tr style=\"font-weight: bold\">";
                        //strVar += "<td class=\"ui-widget-content\" colspan=\"3\">No Recorde Found<\/td><\/tr>"
                        strVar += "No Recorde Found"
                    }
                    //strVar += "<\/tbody><\/table>";
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
            ShowMessage('warning', 'Information!', "Please get charges first", "bottom-right");
            return false;
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
                    strVar += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">SNo<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">ULD No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">HAWB No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Start Piece<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">End Piece<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Assigned Location<\/td><\/tr>";
                    if (locData.length > 0) {
                        for (var i = 0; i < locData.length; i++) {
                            strVar += "<tr><td class=\"ui-widget-content\">" + (parseInt(i) + 1) + "<\/td><td class=\"ui-widget-content\">" + (locData[i].StartPieces != "0" ? "" : (locData[i].ULDNo != "BULK" ? locData[i].ULDNo : "")) + "<\/td><td class=\"ui-widget-content\">" + (locData[i].HAWBNo != "0" ? locData[i].HAWBNo : "") + "<\/td><td class=\"ui-widget-content\">" + (locData[i].StartPieces != "0" ? locData[i].StartPieces : "") + "<\/td><td class=\"ui-widget-content\">" + (locData[i].EndPieces != "0" ? locData[i].EndPieces : "") + "<\/td><td class=\"ui-widget-content\">" + (locData[i].AssignLocation != "" ? locData[i].AssignLocation : locData[i].MovableLocation) + "<\/td><\/tr>"
                        }
                    }
                    else {
                        strVar += "<tr><td class=\"ui-widget-content\" colspan\"2\">No Recorde Found<\/td><\/tr>"
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
                data: { DOSNo: type, Type: "DO" },
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
                    strVar += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">SNo<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">ULD No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">HAWB No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Start Piece<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">End Piece<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Assigned Location<\/td><\/tr>";
                    if (locData.length > 0) {
                        if (HAWBNo != "") {
                            locData = $.grep(locData, function (value, i) {
                                return (value.HAWBNo == HAWBNo);
                            });

                            for (var i = 0; i < locData.length; i++) {
                                //if (HAWBNo == locData[i].HAWBNo) {
                                //if (Number(Pieces) <= Number(locData[i].EndPieces)) {
                                strVar += "<tr><td class=\"ui-widget-content\">" + (parseInt(i) + 1) + "<\/td><td class=\"ui-widget-content\">" + (locData[i].StartPieces != "0" ? "" : (locData[i].ULDNo != "BULK" ? locData[i].ULDNo : "")) + "<\/td><td class=\"ui-widget-content\">" + (locData[i].HAWBNo != "0" ? locData[i].HAWBNo : "") + "<\/td><td class=\"ui-widget-content\">" + (locData[i].StartPieces != "0" ? locData[i].StartPieces : "") + "<\/td><td class=\"ui-widget-content\">" + (locData[i].EndPieces != "0" ? locData[i].EndPieces : "") + "<\/td><td class=\"ui-widget-content\">" + (locData[i].AssignLocation != "" ? locData[i].AssignLocation : locData[i].MovableLocation) + "<\/td><\/tr>"
                                //}
                                //else {
                                //    strVar += "<tr><td class=\"ui-widget-content\">" + (parseInt(i) + 1) + "<\/td><td class=\"ui-widget-content\">" + (locData[i].StartPieces != "0" ? "" : (locData[i].ULDNo != "BULK" ? locData[i].ULDNo : "")) + "<\/td><td class=\"ui-widget-content\">" + (locData[i].HAWBNo != "0" ? locData[i].HAWBNo : "") + "<\/td><td class=\"ui-widget-content\">" + (locData[i].StartPieces != "0" ? locData[i].StartPieces : "") + "<\/td><td class=\"ui-widget-content\">" + (locData[i].EndPieces != "0" ? locData[i].EndPieces : "") + "<\/td><td class=\"ui-widget-content\">" + (locData[i].AssignLocation != "" ? locData[i].AssignLocation : locData[i].MovableLocation) + "<\/td><\/tr>"
                                //}
                                //}
                            }
                        }
                        else {
                            for (var i = 0; i < locData.length; i++) {
                                //if (Number(Pieces) <= Number(locData[i].EndPieces)) {
                                strVar += "<tr><td class=\"ui-widget-content\">" + (parseInt(i) + 1) + "<\/td><td class=\"ui-widget-content\">" + (locData[i].StartPieces != "0" ? "" : (locData[i].ULDNo != "BULK" ? locData[i].ULDNo : "")) + "<\/td><td class=\"ui-widget-content\">" + (locData[i].HAWBNo != "0" ? locData[i].HAWBNo : "") + "<\/td><td class=\"ui-widget-content\">" + (locData[i].StartPieces != "0" ? locData[i].StartPieces : "") + "<\/td><td class=\"ui-widget-content\">" + (locData[i].EndPieces != "0" ? locData[i].EndPieces : "") + "<\/td><td class=\"ui-widget-content\">" + (locData[i].AssignLocation != "" ? locData[i].AssignLocation : locData[i].MovableLocation) + "<\/td><\/tr>"
                                //}
                                //else {
                                //    strVar += "<tr><td class=\"ui-widget-content\">" + (parseInt(i) + 1) + "<\/td><td class=\"ui-widget-content\">" + (locData[i].StartPieces != "0" ? "" : (locData[i].ULDNo != "BULK" ? locData[i].ULDNo : "")) + "<\/td><td class=\"ui-widget-content\">" + (locData[i].HAWBNo != "0" ? locData[i].HAWBNo : "") + "<\/td><td class=\"ui-widget-content\">" + (locData[i].StartPieces != "0" ? locData[i].StartPieces : "") + "<\/td><td class=\"ui-widget-content\">" + (locData[i].EndPieces != "0" ? locData[i].EndPieces : "") + "<\/td><td class=\"ui-widget-content\">" + (locData[i].AssignLocation != "" ? locData[i].AssignLocation : locData[i].MovableLocation) + "<\/td><\/tr>"
                                //}
                            }
                        }
                    }
                    else {
                        strVar += "<tr><td class=\"ui-widget-content\" colspan\"2\">No Recorde Found<\/td><\/tr>"
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
        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/GetWebForm/" + _CURR_PRO_ + "/Import/ChargeNote/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#divDetail2").html(result);
                $.ajax({
                    url: "Services/Import/DeliveryOrderService.svc/GetDeliveryOrderPaymentType?AWBSNo=" + parseInt(currentawbsno) + "&ArrivedShipmentSNo=" + parseInt(currentArrivedShipmentSNo) + "&DestinationCity=" + currentdetination + "&PDSNo=" + parseInt(msg) + "&ProcessSNo=" + parseInt(22) + "&SubProcessSNo=" + parseInt(2325), async: false, type: "get", dataType: "json", cache: false,
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
                            $("#divDetail2").append("</br></br><b>Cash/Credit : </b><input type='radio' tabindex='18' data-radioval='CASH' class='' name='CustomerType' checked='True' id='CustomerType' value='0'>CASH <input type='radio' tabindex='18' data-radioval='CREDIT' class='' name='CustomerType' id='CustomerType' value='1'>CREDIT");
                            $('input:radio[name=CustomerType]').change(function () { AuthenticateBillTo(this); });
                        }
                        $("#divDetail2").append("<input type=\"hidden\" name=\"hdnPieces\" id=\"hdnPieces\" value=\"\" /><input type=\"hidden\" name=\"hdnGrWt\" id=\"hdnGrWt\" value=\"\" />");

                        $("#divDetail2").append("</br></br><div id='divbillto'><b>Bill To : </b><input type=\"hidden\" name=\"BillTo\" id=\"BillTo\" value=\"\" /><input type=\"text\" class=\"\" name=\"Text_BillTo\"  id=\"Text_BillTo\" controltype=\"autocomplete\" maxlength=\"\" data-width=\"50px\" value=\"\" placeholder=\"\" />&nbsp;<input type='text' class='k-input' name='BillToText' id='BillToText' style='width: 200px; text-transform: uppercase;' controltype='alphanumericupper' maxlength='100' value='' placeholder='' data-role='alphabettextbox' autocomplete='off'></div>");
                        cfi.AutoComplete("BillTo", "Name", "vBillTo", "SNo", "Name", ["Name"], CheckAgentCreditLimit, "contains");

                        $('input:radio[name=CustomerType]').change(function () { AuthenticateBillTo(this); });

                        //if (resData.Table0[0].DOPaymentType == "CASH") {
                        var Mode = resData.Table0[0].DOPaymentType;//$('input:radio[id="CustomerType"]:checked').val() == 0 ? "CASH" : "CREDIT";
                        if (Mode == "CASH") {
                            $("#Text_BillTo").data("kendoAutoComplete").setDefaultValue("", "");
                            $("#Text_BillTo").data("kendoAutoComplete").enable(false);
                            //$("#Text_BillTo").attr("data-valid", "required").attr("data-valid-msg", "Select Bill To.");
                            $("#Text_BillTo").removeAttr("data-valid").removeAttr("data-valid-msg");
                            $("#BillToText").show();
                            $("#BillToText").attr("data-valid", "required").attr("data-valid-msg", "Enter Bill To.");
                            $("#BillToText").text(resData.Table0[0].DoBillTo);
                        }
                        else {
                            if ($("#Text_BillTo").data("kendoAutoComplete") != undefined) {
                                $("#Text_BillTo").data("kendoAutoComplete").setDefaultValue(resData.Table0[0].DoBillToSNo, resData.Table0[0].DoBillTo);
                                $("#Text_BillTo").data("kendoAutoComplete").enable(true);
                                $("#Text_BillTo").attr("data-valid", "required").attr("data-valid-msg", "Select Bill To.");
                                $('input:radio[name="CustomerType"][value="1"]').attr('checked', true);
                            }
                            $("#BillToText").hide();
                            $("#BillToText").removeAttr("data-valid").removeAttr("data-valid-msg");
                        }

                        $("#hdnPieces").val(pdPieces);
                        $("#hdnGrWt").val(pdGrossWt);
                        chwt = type;

                        /****************Handling Charge Information*************************************/
                        MendatoryHandlingCharges = [];
                        if (hcData != []) {
                            $(hcData).each(function (row, i) {
                                if (i.isMandatory == 1) {
                                    MendatoryHandlingCharges.push({ "type": "M", "chargename": i.TariffSNo, "text_chargename": i.TariffCode, "pbasis": i.PrimaryBasis, "pvalue": i.pValue, "sbasis": i.SecondaryBasis, "svalue": i.sValue, "amount": i.ChargeAmount, "totaltaxamount": i.TotalTaxAmount, "totalamount": i.TotalAmount, "remarks": i.ChargeRemarks.toUpperCase().replace(/<BR>/g, ""), "list": 1, "PartSNo": i.PartSNo });
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
                            });

                            $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                                $(this).find("[id^='PValue']").after("<input type='hidden' id='PartSNo' name='PartSNo' value=''>");
                            });

                            $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                                $(this).find("[id^='PValue']").closest('td').find("[id^='PartSNo']").val(MendatoryHandlingCharges[i].PartSNo);
                            });

                            $("div[id$='divareaTrans_import_dohandlingcharge']").find("[id='areaTrans_import_dohandlingcharge']").each(function () {
                                $(this).find("input[id^='ChargeName']").each(function () {
                                    //AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], null, null, null, null, null, "getHandlingChargesIE", "", currentawbsno, 0, currentdetination, 1, "", "2", "999999999", "No");
                                    AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], null, null, null, null, null, "getHandlingChargesIEInbound", "", currentawbsno, 0, currentdetination, 1, "", "2", "999999999", "No");
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
                                    //AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIE", "", currentawbsno, 0, currentdetination, 1, "", "2", "999999999", "No");
                                    AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIEInbound", "", currentawbsno, 0, currentdetination, 1, "", "2", "999999999", "No");
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
            //$("#divDetail2").html("Storage charges pending, please raise Charge note for pending storage charges.");
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
                        //BindDeliveryOrder(awbType, shipmentType, DOType);
                        OpenPopUp("Complete DO will be generated for HAWB", 2, 1, IsPart, "", "", "", "", "");
                        //$(this).dialog('close');
                    }
                    else if (type == 1) {
                        //DOType = IsPart == false ? "Full" : "Part";
                        DOType = "Part";
                        OpenPopUp("Part DO will be generated for MAWB, Charges will be applicable for part DO.", 2, "", IsPart, "", "", "", "", "", "");
                        //OpenPopUp("Part DO will be generated for MAWB", 2, "", IsPart, "", "", "", "", "", "");
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
    //$("#divDetail2").append("<input type='button' value='asdasd'/>");
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

    //var currAmount = 0;
    if ($("#" + obj.id).is(":checked") == true) {
        focCheckValue = $("#hdnFOC_" + obj.id.split("_")[1]).val();
        //currAmount = parseFloat(totalAmountDO) - parseFloat(totalHandlingCharges);
        //$("span[id='TotalAmountDO']").text(currAmount.toFixed(3));
    }
    else {
        focCheckValue = 0;
        //currAmount = parseFloat(totalAmountDO) + parseFloat(totalHandlingCharges);
        //$("span[id='TotalAmountDO']").text(currAmount.toFixed(3));
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
                AWBSNo: currentawbsno,
                WaveOff: $(this).find("[id^='WaveOff']").prop('checked') == true ? 1 : 0,
                TariffCodeSNo: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key(),
                TariffHeadName: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").value(),
                pValue: parseFloat($(this).find("[id^='PValue']").val() == "" ? 0 : $(this).find("[id^='PValue']").val()),
                sValue: parseFloat($(this).find("[id^='SValue']").val() == "" ? 0 : $(this).find("[id^='SValue']").val()),
                Amount: parseFloat($(this).find("[id^='Amount']").text() == "" ? 0 : $(this).find("[id^='Amount']").text()),
                TotalTaxAmount: $(this).find("[id^='TotalTaxAmount']").text(),
                TotalAmount: $(this).find("[id^='TotalAmount']").text(),
                Rate: $(this).find("[id^='Amount']").text(),
                Min: 1,
                Mode: Mode,
                ChargeTo: 0,
                pBasis: $(this).find("[id^='PBasis']").text(),
                sBasis: $(this).find("[id^='SBasis']").text(),
                Remarks: $(this).find("[id^='Remarks']").val(),
                WaveoffRemarks: $(this).find("[id^='hdnremark']").val() == undefined ? "" : $(this).find("[id^='hdnremark']").val()
            };
            HandlingChargeArray.push(HandlingChargeViewModel);
        }
    });

    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/CancelDO", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ DOSNo: parseInt($("#Text_DONo").data("kendoAutoComplete").key()), lstHandlingCharges: HandlingChargeArray, BillTo: ChargeTo, BillToText: BillToText }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result != "") {
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

function PrintSlip(Type, obj, pdsno) {
    if (Type == "DO")
        window.open("HtmlFiles/DeliveryOrder/DOPrint.html?DOSNo=" + (obj == "" ? 0 : obj) + "&Type=" + Type + "&LogoURL=" + userContext.SysSetting.LogoURL);
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
            $.ajax({
                url: "Services/Import/DeliveryOrderService.svc/CheckPayment",
                data: JSON.stringify({ DOSNo: parseInt(0), PDSNo: parseInt(obj == "" ? 0 : obj) }),
                async: false, type: "POST", dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var resData = jQuery.parseJSON(result);
                    var payment = resData.Table0;
                    if (payment[0].IsPayment == "1") {
                       // alert("Storage charges pending, please raise Charge note for pending storage charges.");
                        ShowMessage('warning', 'Warning - Delivery Order', 'Storage charges pending, please raise Charge note for pending storage charges.', " ", "bottom-right");
                        return false;
                    }
                    else {
                        var IsRushHandling = "";
                        var ShipmentDetailArray = [];
                        $.ajax({
                            url: "Services/Import/DeliveryOrderService.svc/GetCharges", async: false, type: "POST", dataType: "json", cache: false,
                            data: JSON.stringify({ TariffSNo: parseInt(0), AWBSNo: currentawbsno, CityCode: currentdetination, HAWBSNo: 0, ProcessSNo: parseInt(22), SubProcessSNo: parseInt(2325), GrWT: parseFloat(grossWt), ChWt: parseFloat(grossWt), pValue: parseFloat(0), sValue: parseFloat(0), Pieces: parseInt(pieces), DOSNo: parseInt(0), PDSNo: parseInt(obj == "" ? 0 : obj), lstShipmentInfo: ShipmentDetailArray, Remarks: IsRushHandling }),
                            contentType: "application/json; charset=utf-8",
                            success: function (result) {
                                MendatoryHandlingCharges = [];
                                var resData = jQuery.parseJSON(result);
                                var pendingCharges = resData.Table0;
                                if (pendingCharges.length > 0) {

                                    if (pendingCharges != []) {
                                        $(pendingCharges).each(function (row, i) {
                                            if (i.isMandatory == 1) {
                                                MendatoryHandlingCharges.push({ "type": "M", "chargename": i.TariffSNo, "text_chargename": i.TariffCode, "pbasis": i.PrimaryBasis, "pvalue": i.pValue, "sbasis": i.SecondaryBasis, "svalue": i.sValue, "amount": i.ChargeAmount, "totaltaxamount": i.TotalTaxAmount, "totalamount": i.TotalAmount, "remarks": i.ChargeRemarks.toUpperCase().replace(/<BR>/g, ""), "list": 1 });
                                                totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat(i.TotalAmount)
                                            }
                                        });
                                    }
                                }
                                if (MendatoryHandlingCharges.length > 0) {
                                    //alert("Payment not received for DO number can't process PDS");
                                   // alert("Storage charges pending, please raise Charge note for pending storage charges.");
                                    ShowMessage('warning', 'Warning - Delivery Order', 'Storage charges pending, please raise Charge note for pending storage charges.', " ", "bottom-right");
                                }
                                else {
                                    $("#" + pdsno.id).closest("tr").find("input[id^='chkOFW']").attr("disabled", true);
                                    //window.open("HtmlFiles/Import/physicaldeliveryslip.html?PDSNo=" + (obj == "" ? 0 : obj) + "&OFW=" + chk);
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
            window.open("HtmlFiles/Import/physicaldeliveryslip.html?PDSNo=" + (obj == "" ? 0 : obj) + "&OFW=" + chk + "&Disable=" + chk + "&LogoURL=" + userContext.SysSetting.LogoURL);
        }
    }
   
    if (Type == "CN")
        //window.open("HtmlFiles/Shipment/Payment/ChargeNotePrint.html?InvoiceSNo=" + (obj == "" ? 0 : obj) + "&PDSNo=" + pdsno);
        window.open("HtmlFiles/DeliveryOrder/ReleaseNote/ReleaseNote.html?InvoiceSNo=" + (obj == "" ? 0 : obj) + "&PDSNo=" + pdsno + "&LogoURL=" + userContext.SysSetting.LogoURL);
}

function GetHouseWiseData(valueId, value, keyId, key) {
    $("#divareaTrans_import_dohandlingcharge").html(temp);
    $("div[id$='divareaTrans_import_dohandlingcharge']").hide();
    $("table[id^='__tbldo__']")[4].hidden = true;
    $("span[id='HAWBConsigneeName']").text("");
    $("span[id='HAWBSHC']").text("");
    $("span[id='HAWBDescriptionOfGoods']").text("");
    $('#divMultiSPHCType li').remove();
    $('#SPHCType').val("");
    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/BindHAWBSectionData",
        async: false, type: "get", dataType: "json", cache: false,
        data: { HAWBSNo: (key == "" ? 0 : key), AWBSNo: currentawbsno, ArrivedShipmentSNo: currentArrivedShipmentSNo, DestCity: currentdetination },
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var fdData = Data.Table5;
            var cData = Data.Table3;
            var hcData = Data.Table4;
            var doDate = Data.Table6;
            var checkHouse = 1;

            if (doDate.length > 0) {
                checkHouse = Number(doDate[0].HouseSNo) > 0 ? 1 : 0;
            }

            if (checkHouse == 1) {
                if (cData.length > 0) {
                    $("span[id='HAWBConsigneeName']").text(cData[0].ConsigneeName);
                    $("span[id='HAWBSHC']").text(cData[0].SPHC);
                    $("span[id='HAWBDescriptionOfGoods']").text(cData[0].NatureOfGoods);
                }
                else {
                    $("span[id='HAWBConsigneeName']").text("");
                    $("span[id='HAWBSHC']").text("");
                    $("span[id='HAWBDescriptionOfGoods']").text("");
                    $("#Text_ParticipantName").data("kendoAutoComplete").setDefaultValue("", "");
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
                            cfi.AutoComplete($(this).attr("name"), "ULDNo", "vDOULD", "ULDStockSNo", "ULDNo", ["ULDNo"], GetBupDetails, "contains", ",");
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
                        //if ($("#Text_PaymentType").data("kendoAutoComplete").key() == 0) {
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
                }
                else {
                    $("#Text_HAWB").data("kendoAutoComplete").setDefaultValue("", "");
                    $.ajax({
                        url: "Services/Import/DeliveryOrderService.svc/GetDeliveryOrderRecord?AWBSNo=" + currentawbsno + "&ArrivedShipmentSNo=" + currentArrivedShipmentSNo + "&DOType=" + DOType + "&DestCity=" + currentdetination, async: false, type: "get", dataType: "json", cache: false,
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
                                    cfi.AutoComplete($(this).attr("name"), "ULDNo", "vDOULD", "ULDStockSNo", "ULDNo", ["ULDNo"], GetBupDetails, "contains", ",");
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
                                //if ($("#Text_PaymentType").data("kendoAutoComplete").key() == 0) {
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

                    if (key != "") {
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

function SaveChargeNote() {
    var flag = true;
    //$("#divDetail2").attr("validation",true);
    //if (!cfi.IsValidTransSection("divDetail2"))
    //    return false;
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
                Amount: parseFloat($(this).find("span[id^='TotalTaxAmount']").text()),
                TotalTaxAmount: $(this).find("span[id^='TotalAmount']").text(),
                TotalAmount: $(this).find("span[id^='Amount']").text(),
                Rate: $(this).find("span[id^='Amount']").text(),
                Min: 1,
                Mode: Mode,
                ChargeTo: 0,//ChargeTo,
                pBasis: $(this).find("[id^='PBasis']").text(),
                sBasis: $(this).find("[id^='SBasis']").text(),
                Remarks: $(this).find("[id^='Remarks']").val() + '|' + $(this).find("[id^='PartSNo']").val()
            };
            HandlingChargeArray.push(HandlingChargeViewModel);
        }
    });

    if (BillTo == "") {
        ShowMessage('warning', 'Warning - Charge Note', "Bill to not selected .", "bottom-right");
        flag = false;
        //if (Mode == "CASH") {
        //    $("#BillToText").attr("data-valid", "required").attr("data-valid-msg", "Enter Bill To.");
        //    flag = false;
        //}
        //else {
        //    $("#Text_BillTo").attr("data-valid", "required").attr("data-valid-msg", "Select Bill To.");
        //    flag = false;
        //}
    }

    if (HandlingChargeArray.length > 0) {
        if (flag == true) {
            $.ajax({
                url: "Services/Import/DeliveryOrderService.svc/SaveChargeNote", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ PDSNo: DLVSNo, BillToSNo: BillToSNo, BillTo: BillTo, lstHandlingCharges: HandlingChargeArray }),
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
                },
                error: function (xhr) {
                    ShowMessage('warning', 'Warning - Charge Note', "DO No. [" + curDO + "] -  unable to process.", "bottom-right");
                }
            });
        }
    }
    else {
      //  alert("Select Charges First");
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
                // agentData[0].RemainingCreditLimit;
                if (agentData.length > 0 && agentData[0] != 'undefined') {
                    if (parseInt($('span#TotalAmountDO').text()) > parseInt(agentData[0].RemainingCreditLimit)) {
                        ShowMessage('warning', 'Information!', "Available credit limit is below minimum credit limit", "bottom-right");
                        $("#Text_BillTo").data("kendoAutoComplete").setDefaultValue("", "");
                        return false;
                    }

                }
                else {
                    ShowMessage('warning', 'Information!', "Available credit limit is below minimum credit limit", "bottom-right");
                    $("#Text_BillTo").data("kendoAutoComplete").setDefaultValue("", "");
                }
                //        $("#spnCredit").text(agentData[0].RemainingCreditLimit);
                //    else
                //        $($('input:radio[id="CustomerType"]')[1]).after("<span id='spnCredit'>" + agentData[0].RemainingCreditLimit + "</span>");
                //}
            },
            error: {
            }
        });
    }
    else {
        ShowMessage('warning', 'Information!', "Please get charges first", "bottom-right");
        $("#Text_BillTo").data("kendoAutoComplete").setDefaultValue("", "");
        return false;
    }
    //$('input:radio[id="CustomerType"]').attr("disabled", "disabled");
}

function BindDeliveryOrder(awbType, shipmentType, DOType) {
    totalHandlingCharges = 0;
    totalAmountDO = 0;
    $('.k-datepicker').css('width', '150px');
    cfi.AutoCompleteByDataSource("PaymentType", SearchChargeDataSource, HideCCCharges);
    cfi.AutoComplete("HAWB", "HAWBNo,TotalPieces", "vImportHAWB", "SNo", "HAWBNo", ["HAWBNo", "TotalPieces"], GetHouseWiseData, "contains", null, null, null, null, null, null, null, true);
    cfi.AutoComplete("BillTo", "Name", "vBillTo", "SNo", "Name", ["Name"], CheckAgentCreditLimit, "contains");
    cfi.AutoComplete("ParticipantName", "Name,IdCardNo", "vAuthorizedCondtion", "SNo", "Name", ["Name", "IdCardNo"], null, "contains");
    cfi.AutoCompleteByDataSource("CustomerType", CustomerDataSource, HideCCCharges);
    cfi.AutoComplete("SPHCType", "SPHCCode", "vImportSPHCTrans", "SNo", "SPHCCode", ["SPHCCode"], ClearCharges, "contains", ",");
    $("#Text_PaymentType").closest("span").css('background-color', 'green');

    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/GetDeliveryOrderRecord?AWBSNo=" + currentawbsno + "&ArrivedShipmentSNo=" + currentArrivedShipmentSNo + "&DOType=" + DOType + "&DestCity=" + currentdetination, async: false, type: "get", dataType: "json", cache: false,
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
                $("#Text_PaymentType").data("kendoAutoComplete").setDefaultValue(0, "CC");
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
            }

            /****************Flight Detail*************************************/
            FlightDetail = [];
            if (fdData != []) {
                $(fdData).each(function (row, i) {
                    FlightDetail.push({ "pieces": i.pieces, "_tempPieces": i.pieces, "uldpieces": i.uldpieces, "totalpieces": i.totalpieces, "grossweight": i.grossweight, "uldgrossweight": i.uldgrossweight, "_tempGrossWeight": i.grossweight, "totalgrossweight": i.totalgrossweight, "sphc": i.sphc, "description": i.description, "flightdetails": i.flightdetails, "dailyflightsno": i.dailyflightsno, "list": 1 });
                });
            }

            cfi.makeTrans("import_doflightdetail", null, null, null, null, null, fdData);
            $("div[id$='areaTrans_import_doflightdetail']").find("[id^='areaTrans_import_doflightdetail']").each(function (i, row) {
                $(this).find("span[id^='TotalPieces']").first().text(FlightDetail[i].pieces + '/' + FlightDetail[i].uldpieces + '/' + FlightDetail[i].totalpieces);
                $(this).find("span[id^='TotalGrossWeight']").first().text(FlightDetail[i].grossweight + '/' + FlightDetail[i].uldgrossweight + '/' + FlightDetail[i].totalgrossweight);
                $(this).find("div[id^='transActionDiv']").hide();
            });

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
                        cfi.AutoComplete($(this).attr("name"), "ULDNo", "vDOULD", "ULDStockSNo", "ULDNo", ["ULDNo"], GetBupDetails, "contains", ",");
                        //var textId = $(this).attr("id");
                        //var divId = $("#" + $(this).attr("id")).closest("td").find("div");
                        //$("span.k-delete").live("click", function (e) { AutoCompleteDeleteCallBack(this, divId, textId); });
                    });

                    totalPieces = Number(totalPieces) + Number(ShipmentDetail[i]._tempPieces);
                    $("#" + $(this).find("span").find("input[id*='BulkPcs']")[0].id).val(ShipmentDetail[i]._tempPieces);
                    $("#" + $(this).find("span").find("input[id*='BulkPcs']")[1].id).val(ShipmentDetail[i].pieces);
                    $(this).find("span[id^='Slas']").text("/");
                    //$(this).find("span[id^='BupPcs']").text(ShipmentDetail[i].uldpieces);
                    $(this).find("span[id^='BupPcs']").text("0");
                    $(this).find("span[id^='TotalPieces']").text(ShipmentDetail[i].totalpieces);
                    $(this).find("span[id^='TotalBulkPieces']").text(ShipmentDetail[i].pieces);
                    $("#" + $(this).find("span").find("input[id*='BulkGrWt']")[0].id).val(ShipmentDetail[i]._tempGrossWeight);
                    $("#" + $(this).find("span").find("input[id*='BulkGrWt']")[1].id).val(ShipmentDetail[i].grossweight);
                    $(this).find("span[id^='TotalBulkGrWt']").text(ShipmentDetail[i].grossweight);
                    //$(this).find("span[id^='BupGrWt']").text(ShipmentDetail[i].uldgrossweight);
                    $(this).find("span[id^='BupGrWt']").text("0");
                    $(this).find("span[id^='TotalGrossWeight']").text(ShipmentDetail[i].totalgrossweight);
                    $(this).find("td:eq(5)").hide();
                    $(this).find("span[id^='TotalBulkPieces']").hide();
                    $(this).find("span[id^='TotalBulkGrWt']").hide();
                    $(this).find("div[id^='transActionDiv']").hide();
                    if ($("#Text_PaymentType").data("kendoAutoComplete").key() == 0) {
                        //$("#" + $(this).find("span").find("input[id*='BulkPcs']").data("kendoNumericTextBox").enable(false);
                        ////$("#" + $(this).find("span").find("input[id*='BulkPcs']").data("kendoNumericTextBox").enable(false)
                        //$("#" + $(this).find("span").find("input[id*='BulkGrWt']").data("kendoNumericTextBox").enable(false);
                        //  $("#" + $(this).find("span").find("input[id*='BulkGrWt']")[1].id).data("kendoNumericTextBox").enable(false)

                        $(this).find("input[id^='BulkPcs']").data("kendoNumericTextBox").enable(false);
                        $(this).find("input[id^='BulkGrWt']").data("kendoNumericTextBox").enable(false);

                    }
                    else {
                        //  $("#" + $(this).find("span").find("input[id*='BulkPcs']").data("kendoNumericTextBox").enable(true)
                        ////  $("#" + $(this).find("span").find("input[id*='BulkPcs']")[1].id).data("kendoNumericTextBox").enable(true)
                        //  $("#" + $(this).find("span").find("input[id*='BulkGrWt']").data("kendoNumericTextBox").enable(true)
                        //  //$("#" + $(this).find("span").find("input[id*='BulkGrWt']")[1].id).data("kendoNumericTextBox").enable(true)
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

            //$("span.k-delete").live("click", function (e) { UldRemove(this); });
            chwt = fdData[0].grossweight;

            /****************Remarks*************************************/
            if (rDate.length > 0) {
                $("span[id='Remarks']").text(rDate[0].Remarks);
            }

            if (dorData.length > 0) {
                $("span[id='DORTotalPieces']").text(dorData[0].TotalPieces);
                $("span[id='DORDOPieces']").text(dorData[0].DOPieces);
                $("span[id='DORRemainingPieces']").text(dorData[0].RemainingPieces);
            }

            temp = $("#divareaTrans_import_dohandlingcharge").html();
            cfi.makeTrans("import_dohandlingcharge", null, null, BindChargeAutoComplete, ReBindChargeAutoComplete, null, null);
            $("div[id$='divareaTrans_import_dohandlingcharge']").hide();
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
                $("span[id='TotalAmountOrigCurrency']").text(totalAmountDO.toFixed(3) + '   ' + freightItem.OrigCurrency);
                $("span[id='TotalAmountDestCurrency']").text((Number(totalAmountDO) * Number(currencyConversionRate)).toFixed(3) + '   ' + freightItem.DestCurrency + '               ');
                $("span[id='TotalAmountDestCurrency']").after("<a href=\"#\" style=\"text-decoration: none;\" onclick=\"OpenPopUp(" + freightItem.OrigCurrencySNo + "," + freightItem.DestCurrencySNo + ", 0, 0, 'ER',0,0,0,0);\"><b>Exchange Rate</b></a>");
            }

            $("span[id='TotalAmountDO']").text((Number(totalAmountDO) * Number(currencyConversionRate)).toFixed(3));
            if ($("#PaymentType").val() == "True") {
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
                strVar += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">CustomerType<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO Date<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Waybill Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Pieces<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Gross Weight<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Total Charges<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Charges Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Participant Name<\/td><td style=\"padding-left: 5px; width: 250px\" class=\"ui-widget-header\">Action<\/td><\/tr>";

                for (var i = 0; i < doDataDetail.length; i++) {
                    strVar += "<td class=\"ui-widget-content\">" + doDataDetail[i].CustomerType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DeliveryOrderNo + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DeliveryOrderDate + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DOType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].WaybillType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DOPieces + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DOGrossWeight + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].TotalCharges + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].ChargesType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].ParticipantName + "<\/td><td class=\"ui-widget-content\">";
                    if (doDataDetail[i].IsCancel == 0) {
                        strVar += "<input id=\"btnPrint\" type=\"button\" value=\"DO Print A4\" onclick=\"PrintSlip('DO'," + doDataDetail[i].DOSNo + ");\">";
                        strVar += "&nbsp;<input id=\"btnPrint\" type=\"button\" value=\"Pre-Printed DO\" onclick=\"PrintSlip('DOPrint'," + doDataDetail[i].DOSNo + ");\">";
                        strVar += "&nbsp;<input id=\"btnLocation\" type=\"button\" value=\"DO Location\" onclick=\"OpenPopUp('Warehouse Location');\">";
                    }
                    else {
                        strVar += "<input id=\"btnPrint\" type=\"button\" style=\"background-color:red;color:white;\" value=\"DO Print A4\" onclick=\"PrintSlip('DO'," + doDataDetail[i].DOSNo + ");\">";
                        strVar += "&nbsp;<input id=\"btnPrint\" type=\"button\" style=\"background-color:red;color:white;\" value=\"Pre-Printed DO\" onclick=\"PrintSlip('DOPrint'," + doDataDetail[i].DOSNo + ");\">";
                        strVar += "&nbsp;<input id=\"btnLocation\" type=\"button\" value=\"DO Location\" onclick=\"OpenPopUp('Warehouse Location');\">";
                    }
                    strVar += "<\/td><\/tr>";
                }
                strVar += "<\/tbody><\/table>";
                strVar += "<\/br>";
                $('#divDetail3').html(strVar);
            }
            else {
                $("#Text_CustomerType").data("kendoAutoComplete").setDefaultValue("1", "REGULAR");
            }

            if ($("[id^='CustomerType']").is(':disabled') == true ? "CASH" : $('input:radio[id="CustomerType"]:checked').val() == 0 ? "CASH" : "CREDIT" == "CASH") {
                $("#Text_BillTo").data("kendoAutoComplete").enable(false);
                $("#Text_BillTo").removeAttr("data-valid").removeAttr("data-valid-msg");
                $("#BillToText").show();
                $("#BillToText").attr("data-valid", "required").attr("data-valid-msg", "Enter Bill To.");
            }
            else {
                if ($("#Text_BillTo").data("kendoAutoComplete") != undefined) {
                    $("#Text_BillTo").data("kendoAutoComplete").enable(true);
                    $("#Text_BillTo").attr("data-valid", "required").attr("data-valid-msg", "Select Bill To.");
                }
                $("#BillToText").hide();
                $("#BillToText").removeAttr("data-valid").removeAttr("data-valid-msg");
            }

            if ($("#Text_CustomerType").data("kendoAutoComplete").key() == 1) {
                if ($("#Text_ParticipantName").data("kendoAutoComplete") != undefined) {
                    $("#Text_ParticipantName").data("kendoAutoComplete").enable(true);
                    $("#Text_ParticipantName").attr("data-valid", "required").attr("data-valid-msg", "Select Authorized Person.");
                }
                $("#AuthorizedPersonId").closest("tr").hide();
                $("#AuthorizedPersonCompany").closest("tr").hide();
            }
            else {
                $("#Text_ParticipantName").data("kendoAutoComplete").enable(false);
                $("#AuthorizedPersonId").closest("tr").show();
                $("#AuthorizedPersonCompany").closest("tr").show();
                $("#AuthorizedPersonId").attr("data-valid", "required").attr("data-valid-msg", "Enter Authorized Person Id.");
                $("#AuthorizedPersonName").attr("data-valid", "required").attr("data-valid-msg", "Enter Authorized Person Name.");
                $("#AuthorizedPersonCompany").attr("data-valid", "required").attr("data-valid-msg", "Enter Authorized Person Company.");
            }
        },
        error: function (ex) {
            var ex = ex;
        }
    });
}

function AuthenticateShipmenrDetail(obj) {
    var id = obj.id;
    $("#divareaTrans_import_dohandlingcharge").html(temp);
    $("div[id$='divareaTrans_import_dohandlingcharge']").hide();
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
                        cfi.AutoComplete($(this).attr("name"), "ULDNo", "vDOULD", "ULDStockSNo", "ULDNo", ["ULDNo"], GetBupDetails, "contains", ",");
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
                    //if ($("#Text_PaymentType").data("kendoAutoComplete").key() == 0) {
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
}

function ClearCharges() {
    if ($("div[id$='divareaTrans_import_dohandlingcharge']").is(':visible')) {
        var currAmount = Number(totalAmountDO) > 0 ? parseFloat(totalAmountDO) - parseFloat(totalHandlingCharges) : parseFloat(totalAmountDO);
        $("span[id='TotalAmountDO']").text(currAmount.toFixed(3));
        totalHandlingCharges = 0;
        $("#divareaTrans_import_dohandlingcharge").html(temp);
        $("div[id$='divareaTrans_import_dohandlingcharge']").hide();
        $("table[id^='__tbldo__']")[4].hidden = true;
    }
}

function AuthenticateBillTo(obj) {
    var id = obj.id;
    if ($("[id^='" + id + "']").is(':disabled') == true ? "CASH" : $("input:radio[id='" + id + "']:checked").val() == 0 ? "CASH" : "CREDIT" == "CASH") {
        $("#Text_BillTo").data("kendoAutoComplete").setDefaultValue("", "");
        $("#Text_BillTo").data("kendoAutoComplete").enable(false);
        $("#Text_BillTo").removeAttr("data-valid").removeAttr("data-valid-msg");
        $("#BillToText").show();
        $("#BillToText").attr("data-valid", "required").attr("data-valid-msg", "Enter Bill To.");
    }
    else {
        if ($("#Text_BillTo").data("kendoAutoComplete") != undefined) {
            $("#Text_BillTo").data("kendoAutoComplete").enable(true);
            $("#Text_BillTo").attr("data-valid", "required").attr("data-valid-msg", "Select Bill To.");
        }
        $("#BillToText").hide();
        $("#BillToText").removeAttr("data-valid").removeAttr("data-valid-msg");
    }
}

function GetBupDetails(valueId, value, keyId, key) {
    var id = valueId;
    var index = keyId.split("_")[1];
    var keyValue = key;
    //$(tr).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").key() == keyValue
    //$("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (row, tr) {
    //    if ($(tr).find("input[id^='Text_ChargeName']").attr("id") != textId) {
    //        if ($(tr).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").key() == keyValue) {
    //            ShowMessage('warning', 'Information!', "" + textValue + " Already Added.", "bottom-right");
    //            $("#" + textId).data("kendoAutoComplete").setDefaultValue("", "");

    //            $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val("");
    //            $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val("");
    //            $("span[id^='PBasis_" + rowId + "']").text("");
    //            $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val("");
    //            $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val("");
    //            $("span[id^='SBasis_" + rowId + "']").text("");
    //            $("span[id^='Amount_" + rowId + "']").text("");
    //            $("span[id^='TotalTaxAmount" + rowId + "']").text("");
    //            $("span[id^='TotalAmount_" + rowId + "']").text("");
    //            $("span[id^='Remarks" + rowId + "']").text("");
    //            Flag = false;
    //        }
    //    }
    //});
    //if ($("#" + id).closest("td").find("div").find("li").length > 1) {
    //    //if (index == undefined) {
    //    //    $("span[id='BupGrWt']").text("0");
    //    //    $("span[id='BupPcs']").text("0");
    //    //}
    //    //else {
    //    //    $("span[id='BupGrWt_" + index + "']").text("0");
    //    //    $("span[id^='BupPcs_" + index + "']").text("0");
    //    //}

    //    $("#" + id).closest("td").find("div").find("li").each(function () {
    //        if ($(this).find("span").text() != keyValue) {
    //            $.ajax({
    //                //url: "Services/Import/DeliveryOrderService.svc/GetBupWt?AWBSNo=" + parseInt(currentawbsno) + "&ArrivedShipmentSNo=" + parseInt(currentArrivedShipmentSNo) + "&ULDSNo=" + value,
    //                url: "Services/Import/DeliveryOrderService.svc/GetBupDetails?AWBSNo=" + parseInt(currentawbsno) + "&ULDStockSNo=" + parseInt(key),
    //                async: false, type: "GET", dataType: "json",
    //                contentType: "application/json; charset=utf-8",
    //                success: function (result) {
    //                    var resData = jQuery.parseJSON(result);
    //                    if (index == undefined) {
    //                        BupGrWt = Number($("span[id='BupGrWt']").text()) + Number(resData[0].GrossWeight);
    //                        BupPcs = Number($("span[id='BupPcs']").text()) + Number(1);
    //                        $("span[id='BupGrWt']").text(BupGrWt);
    //                        $("span[id='BupPcs']").text(BupPcs);
    //                    }
    //                    else {
    //                        BupGrWt = Number($("span[id='BupGrWt_" + index + "']").text()) + Number(resData[0].GrossWeight);
    //                        BupPcs = Number($("span[id^='BupPcs_" + index + "']").text()) + Number(1);
    //                        $("span[id='BupGrWt_" + index + "']").text(BupGrWt);
    //                        $("span[id^='BupPcs_" + index + "']").text(BupPcs);
    //                    }
    //                },
    //                error: function (ex) {
    //                    var ex = ex;
    //                }
    //            });
    //        }
    //        else {
    //            $("#" + id).data("kendoAutoComplete").setDefaultValue("", "");
    //        }
    //    });
    //}
    //else {
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
    //}
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
    IsRushHandling ="";
   
    //RushHandling = $('#RushHanding :checked').val();
    IsRushHandling ="RSH="+ ($("#RushHandling").is(':checked') ? 1 : 0);

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
            //var ArrivedPieces = 0,
            //	ULDPieces = 0,
            //	TotalPieces = 0,
            //	GrossWeight = 0,
            //	ULDGrossWeight = 0,
            //	TotalGrossWeight = 0,
            //	ShipmentType = "";

            if (resData.length > 0) {
                ArrivedPieces = resData[0].ArrivedPieces;
                ULDPieces = resData[0].ULDPieces;
                TotalPieces = resData[0].TotalPieces;
                GrossWeight = resData[0].GrossWeight;
                ULDGrossWeight = resData[0].ULDGrossWeight;
                TotalGrossWeight = resData[0].TotalGrossWeight;
                ShipmentType = resData[0].ShipmentType;

                if ((ShipmentType == "T" || ShipmentType == "S") && Number(TotalPieces) != Number(ArrivedPieces)) {
                    ShowMessage('warning', 'Warning', "FWB pieces must be same as arrived pieces.", "bottom-right");
                    //flag = false;
                    flag = true;
                }
                else if ((ShipmentType == "T" || ShipmentType == "S") && Number(TotalPieces) == Number(ArrivedPieces) && Number(TotalGrossWeight) != Number(GrossWeight)) {
                    ShowMessage('warning', 'Warning', "FWB gross weight should be equal to Arrival gross weight for delivery order .", "bottom-right");
                    //flag = false;
                    flag = true;
                }
                else if ((ShipmentType == "P" || ShipmentType == "D") && Number(TotalPieces) < Number(ArrivedPieces)) {
                    ShowMessage('warning', 'Warning', "FWB pieces must be same as arrived pieces.", "bottom-right");
                    //flag = false;
                    flag = true;
                }
                else if ((ShipmentType == "P" || ShipmentType == "D") && Number(TotalPieces) == Number(ArrivedPieces) && Number(TotalGrossWeight) != Number(GrossWeight)) {
                    ShowMessage('warning', 'Warning', "FWB gross weight should be equal to Arrival gross weight for delivery order .", "bottom-right");
                    //flag = false;
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

    if ((ShipmentType == "P" || ShipmentType == "D") && Number(pieces) != Number(TotalPieces)) {
        //alert("Part charges will be applicable on part DO Creation");
        //alert("Part DO charges will be applicable for part shipment delivery order.");
        ShowMessage('warning', 'Warning - Delivery Order', 'Part DO charges will be applicable for part shipment delivery order.', " ", "bottom-right");
    }

    if (flag == true) {
        if (Number(pieces) > 0 && Number(grossWt) > 0) {
            $.ajax({
                url: "Services/Import/DeliveryOrderService.svc/GetCharges", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ TariffSNo: parseInt(0), AWBSNo: currentawbsno, CityCode: currentdetination, HAWBSNo: hawb, ProcessSNo: parseInt(22), SubProcessSNo: parseInt(subprocesssno), GrWT: parseFloat(grossWt), ChWt: parseFloat(grossWt), pValue: parseFloat(0), sValue: parseFloat(0), Pieces: parseInt(pieces), DOSNo: parseInt(0), PDSNo: parseInt(0), lstShipmentInfo: ShipmentDetailArray, Remarks: IsRushHandling }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var resData = jQuery.parseJSON(result);
                    var hcData = resData.Table0;

                    MendatoryHandlingCharges = [];
                    if (hcData != []) {
                        $(hcData).each(function (row, i) {
                            if (i.isMandatory == 1) {
                                MendatoryHandlingCharges.push({ "type": "M", "chargename": i.TariffSNo, "text_chargename": i.TariffCode, "pbasis": i.PrimaryBasis, "pvalue": i.pValue, "sbasis": i.SecondaryBasis, "svalue": i.sValue, "amount": i.ChargeAmount, "totaltaxamount": i.TotalTaxAmount, "totalamount": i.TotalAmount, "remarks": i.ChargeRemarks.toUpperCase().replace(/<BR>/g, ""), IsEditableUnit: i.IsEditableUnit, "list": 1, "PartSNo": i.PartSNo });
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
                        });

                        $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                            $(this).find("[id^='WaveOff']").after("<a href='#' id='waveofRemark' style='text-decoration:none;display:none;color:red' maxlength='200' onclick='BindwaveRemarks(this,event);return false;'>Remarks</a><input type='hidden' id='hdnremark' name='hdnremark' value=''>");
                            //<input type='hidden' id='PartSNo' name='PartSNo' value=''>");
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
                            //AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIE", "", currentawbsno, 0, currentdetination, 1, "", "2", "999999999", "No");
                            AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIEInbound", "", currentawbsno, 0, currentdetination, 1, "", "2", "999999999", "No");
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
                    });

                    totalHandlingCharges = 0;
                    $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                        if ($(this).find("[id^='WaveOff']").is(":checked") == false) {
                            totalHandlingCharges = Number(totalHandlingCharges) + Number($(this).find("td:eq(8)")[0].innerText);
                        }
                    });

                    if (MendatoryHandlingCharges.length > 1) {
                        $("div[id$='divareaTrans_import_dohandlingcharge']").show();
                        $("table[id^='__tbldo__']")[4].hidden = false;
                        var currAmount = 0;
                        if ($("#Text_PaymentType").kendoAutoComplete().val() == "CC") {
                            currAmount = parseFloat(totalAmountDO);
                            $("span[id='HandlingCharges']").text(totalHandlingCharges);
                            $("span[id='TotalAmountDO']").text(currAmount.toFixed(3));
                            totalAmountDO = $("span[id='TotalAmountDO']").text();
                            //totalAmountDO = parseFloat(totalAmountDO) + parseFloat(totalHandlingCharges);
                            totalAmountDO = parseFloat(totalAmountDO);
                        }
                        else {
                            //currAmount = parseFloat(totalHandlingCharges); //Number(totalAmountDO) > 0 ? parseFloat(totalAmountDO) - parseFloat(totalHandlingCharges) : parseFloat(totalAmountDO);
                            $("span[id='TotalAmountDO']").text(currAmount.toFixed(3));
                            totalAmountDO = $("span[id='TotalAmountDO']").text();
                            //totalAmountDO = parseFloat(totalHandlingCharges);
                        }
                    }

                    //totalAmountDO = $("span[id='TotalAmountDO']").text();
                    //totalAmountDO = parseFloat(totalAmountDO) + parseFloat(totalHandlingCharges);
                    //$("span[id='TotalAmountDestCurrency']").text((Number(totalAmountDO) * Number(currencyConversionRate)).toFixed(3));
                    $("span[id='TotalAmountDO']").text(((Number(totalAmountDO) * Number(currencyConversionRate)) + parseFloat(totalHandlingCharges)).toFixed(3));
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

function ExchangeRate() {
   // alert("hi");
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
               // alert("Pieces should not be greater than Total Pieces");
                ShowMessage('warning', 'Warning - Delivery Order', 'Pieces should not be greater than Total Pieces', " ", "bottom-right");
                $("#BulkPcs").val(totalPcs);
            }
            else if (Number(pcs) == 0) {
                //alert("Pieces should not be zero");
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
                //alert("Gross Weight should not be greater than Total Gross Weight");
                ShowMessage('warning', 'Warning - Delivery Order', 'Gross Weight should not be greater than Total Gross Weight', " ", "bottom-right");
                $("#BulkGrWt").val(totalWt);
            }
            else if (Number(wt) == 0) {
                //alert("Gross Weight should not be zero");
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
                //alert("Pieces should not be greater than Total Pieces");
                ShowMessage('warning', 'Warning - Delivery Order', 'Pieces should not be greater than Total Pieces', " ", "bottom-right");
                $("#" + obj.id).val(totalPieces);
            }
            else if (Number(doPieces) == 0) {
               // alert("Pieces should not be zero");
                ShowMessage('warning', 'Warning - Delivery Order', 'Pieces should not be zero', " ", "bottom-right");
                $("#" + obj.id).val(totalPieces);
            }
            else if (hawb > 0 && Number(piecs) > Number(hawbPieces)) {
               // alert("Pieces should not be greater than HAWB Pieces");
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
               // alert("Gross Weight should not be greater than Total Gross Weight");
                ShowMessage('warning', 'Warning - Delivery Order', 'Gross Weight should not be greater than Total Gross Weight', " ", "bottom-right");
                $("#" + obj.id).val($("#_temp" + obj.id).val());
            }
            else if (Number(doGrwt) == 0) {
               // alert("Gross Weight should not be zero");
                ShowMessage('warning', 'Warning - Delivery Order', 'Gross Weight should not be zero', " ", "bottom-right");
                $("#" + obj.id).val(totalgrossWeight);
            }
            else {
                var totalPieces = $("#" + obj.id).closest("tr").find("span[id^='TotalBulkPieces']").text();
                var pieces = $("#" + obj.id).closest("tr").find("input[id^='BulkPcs']").val();

                if (Number(pieces) == Number(totalPieces) && Number(grossWeight) != Number(totalgrossWeight)) {
                    //alert("Gross weight can’t be changed for total pieces");
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
                //alert("Part DO charges will be applicable for part shipment delivery order.");
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
        if (key == 1) {
            if (subprocesssno == 2135) {
                if ($("#Text_ParticipantName").data("kendoAutoComplete") != undefined) {
                    $("#Text_ParticipantName").data("kendoAutoComplete").enable(true);
                    $("#Text_ParticipantName").attr("data-valid", "required").attr("data-valid-msg", "Select Authorized Person.");
                }
            }
            else if (subprocesssno == 2134) {
                if ($("#Text_AuthorizedPerson").data("kendoAutoComplete") != undefined) {
                    $("#Text_AuthorizedPerson").data("kendoAutoComplete").enable(true);
                    $("#Text_AuthorizedPerson").attr("data-valid", "required").attr("data-valid-msg", "Select Authorized Person.");
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
                $("#Text_ParticipantName").removeAttr("data-valid").removeAttr("data-valid-msg");
                $("#Text_ParticipantName").data("kendoAutoComplete").enable(false);
            }
            else if (subprocesssno == 2134) {
                $("#Text_AuthorizedPerson").removeAttr("data-valid").removeAttr("data-valid-msg");
                $("#Text_AuthorizedPerson").data("kendoAutoComplete").enable(false);
                $("#Text_Consignee").removeAttr("data-valid").removeAttr("data-valid-msg");
                $("#Text_Consignee").data("kendoAutoComplete").enable(false);
            }
            else if (subprocesssno == 2137) {
                $("#Text_DeliverdTo").removeAttr("data-valid").removeAttr("data-valid-msg");
                $("#Text_DeliverdTo").data("kendoAutoComplete").enable(false);
            }
            $("#AuthorizedPersonId").closest("tr").show();
            $("#AuthorizedPersonCompany").closest("tr").show();
            $("#AuthorizedPersonId").attr("data-valid", "required").attr("data-valid-msg", "Enter Authorized Person Id.");
            $("#AuthorizedPersonName").attr("data-valid", "required").attr("data-valid-msg", "Enter Authorized Person Name.");
            $("#AuthorizedPersonCompany").attr("data-valid", "required").attr("data-valid-msg", "Enter Authorized Person Company.");
        }
    }
}

function AutoCompleteForDOHandlingCharge(textId, basedOn, tableName, keyColumn, textColumn, templateColumn, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag) {
    var keyId = textId;
    textId = "Text_" + textId;
    if (!$("#" + textId).data("kendoAutoComplete")) {
        if (IsValid(textId, autoCompleteType)) {
            if (keyColumn == null || keyColumn == undefined)
                keyColumn = basedOn;
            if (textColumn == null || textColumn == undefined)
                textColumn = basedOn;
            var dataSource = GetDataSourceForDOHandlingCharge(textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag);
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

var dourl = 'Services/AutoCompleteService.svc/WMSFBLAutoCompleteDataSource';
function GetDataSourceForDOHandlingCharge(textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag) {
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
                    chWt: chWt,
                    cityChangeFlag: cityChangeFlag,
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
    if ($(elem)[0].id.indexOf("dohandlingcharge") > -1) {
        $(elem).find("input[id^='ChargeName']").each(function () {
            //AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIE", "", currentawbsno, 0, currentdetination, 1, "", "2", "999999999", "No");
            AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIEInbound", "", currentawbsno, 0, currentdetination, 1, "", "2", "999999999", "No");
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

    if ($(elem)[0].id.indexOf("awddocs") > -1) {
        $(elem).find("input[id^='DocType']").each(function () {
            cfi.AutoCompleteByDataSource($(this).attr("name"), SearchDocsDataSource);
        });
    }

    if ($(elem)[0].id.indexOf("payment") > -1) {
        $(elem).find("input[id^='Process']").each(function () {
            cfi.AutoCompleteByDataSource($(this).attr("name"), SearchTypeDataSource);
        });
        $(elem).find("input[id^='DocumentNo']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "AWBNo", "AWB", "SNo", "AWBNo", ["SNo", "AWBNo"], null, "contains");
        });
        $(elem).find("input[id^='Currency']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "CurrencyCode", "Currency", "SNo", "CurrencyCode", ["CurrencyCode"], null, "contains");
        });
    }
}

function ReBindChargeAutoComplete(elem, mainElem) {
    totalHandlingCharges = 0;
    totalAmountDO = 0;
    if ($(elem)[0].id.indexOf("dohandlingcharge") > -1) {
        $(elem).closest("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function () {
            $(this).find("input[id^='ChargeName']").each(function () {
                //AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], GatValueOfAutocomplete, null, null, null, null, "getHandlingCharges", "", currentawbsno, 0, currentdetination, 1, "", "2", "999999999", "No");
                AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIEInbound", "", currentawbsno, 0, currentdetination, 1, "", "2", "999999999", "No");
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

    //if ($(elem)[0].id.indexOf("doshipmenttypedetail") > -1) {
    //    $(elem).closest("div[id$='areaTrans_import_doshipmenttypedetail']").find("[id^='areaTrans_import_doshipmenttypedetail']").each(function () {
    //        $(this).find("input[id^='ULDNo']").each(function () {
    //            cfi.AutoComplete($(this).attr("name"), "ULDNo", "vDOULD", "ULDStockSNo", "ULDNo", ["ULDNo"], GetBupDetails, "contains", ",");
    //        });
    //    });
    //}

    if ($(elem)[0].id.indexOf("awddocs") > -1) {
        $(elem).closest("div[id$='areaTrans_import_awddocs']").find("[id^='areaTrans_import_awddocs']").each(function () {
            $(this).find("input[id^='ServiceName']").each(function () {
                cfi.ChangeAutoCompleteDataSource($(this).attr("name"), SearchDocsDataSource, false);
            });
        });
    }

    if ($(elem)[0].id.indexOf("payment") > -1) {
        $(elem).closest("div[id$='areaTrans_import_payment']").find("[id^='areaTrans_import_payment']").each(function () {
            $(this).find("input[id^='Process']").each(function () {
                cfi.AutoCompleteByDataSource($(this).attr("name"), SearchTypeDataSource);
            });

            $(this).find("input[id^='DocumentNo']").each(function () {
                cfi.AutoComplete($(this).attr("name"), "AWBNo", "AWB", "SNo", "AWBNo", ["SNo", "AWBNo"], null, "contains");
            });

            $(this).find("input[id^='Currency']").each(function () {
                cfi.AutoComplete($(this).attr("name"), "CurrencyCode", "Currency", "SNo", "CurrencyCode", ["CurrencyCode"], null, "contains");
            });
        });
    }
}

function GetChargeValue(obj) {
    rowId = obj.id.split("_")[1];
    var tariffSNo = rowId == undefined ? $("#ChargeName").val() : $("#ChargeName_" + obj.id.split("_")[1]).val();
    if (obj.id.indexOf("PValue") > -1) {
        pValue = $("#" + obj.id).val() == "" ? 0 : $("#" + obj.id).val();
        sValue = $("#" + obj.id.replace("PValue", "SValue")).val() != "" ? $("#" + obj.id.replace("PValue", "SValue")).val() : 0;
    }
    else {
        sValue = $("#" + obj.id).val() == "" ? 0 : $("#" + obj.id).val();
        pValue = $("#" + obj.id.replace("PValue", "SValue")).val() != "" ? $("#" + obj.id.replace("SValue", "PValue")).val() : 0;
    }

    if (tariffSNo == "" || tariffSNo == undefined) {
        //alert("Please select Charges.");
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
        var IsRushHandling = "";
        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/GetCharges", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ TariffSNo: parseInt(tariffSNo), AWBSNo: currentawbsno, CityCode: currentdetination, HAWBSNo: hawb, ProcessSNo: parseInt(22), SubProcessSNo: parseInt(subprocesssno === "2137" ? 2146 : subprocesssno), GrWT: parseFloat(grossWt), ChWt: parseFloat(grossWt), pValue: parseFloat(pValue), sValue: parseFloat(sValue), Pieces: parseInt(pieces), DOSNo: parseInt(0), PDSNo: parseInt(0), lstShipmentInfo: ShipmentDetailArray, Remarks: IsRushHandling }),
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
            var IsRushHandling = "";
            $.ajax({
                url: "Services/Import/DeliveryOrderService.svc/GetCharges", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ TariffSNo: parseInt(key), AWBSNo: currentawbsno, CityCode: currentdetination, HAWBSNo: hawb, ProcessSNo: parseInt(22), SubProcessSNo: parseInt(subprocesssno === "2137" ? 2146 : subprocesssno), GrWT: parseFloat(grossWt), ChWt: parseFloat(grossWt), pValue: parseFloat(0), sValue: parseFloat(0), Pieces: parseInt(pieces), DOSNo: parseInt(0), PDSNo: parseInt(0), lstShipmentInfo: ShipmentDetailArray, Remarks: IsRushHandling }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var resData = jQuery.parseJSON(result);
                    var doCharges = resData.Table0;
                    if (doCharges.length > 0) {
                        var doItem = doCharges[0];
                        if (rowId == undefined) {
                            $("span[id^='PBasis']").closest("td").find("input[id^='_tempPValue']").val(doItem.PrimaryBasis != 'KG' ? doItem.pValue : (Number(grossWt) > Number(doItem.pValue) ? doItem.pValue : grossWt));
                            $("span[id^='PBasis']").closest("td").find("input[id^='PValue']").val(doItem.PrimaryBasis != 'KG' ? doItem.pValue : (Number(grossWt) > Number(doItem.pValue) ? doItem.pValue : grossWt));
                            $("span[id^='PBasis']").text(doItem.PrimaryBasis);
                            $("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").val(doItem.SecondaryBasis != 'KG' ? doItem.sValue : (Number(grossWt) > Number(doItem.sValue) ? doItem.sValue : grossWt));
                            $("span[id^='SBasis']").closest("td").find("input[id^='SValue']").val(doItem.SecondaryBasis != 'KG' ? doItem.sValue : (Number(grossWt) > Number(doItem.sValue) ? doItem.sValue : grossWt));
                            $("span[id^='SBasis']").text(doItem.SecondaryBasis);
                            $("span[id^='Amount']").text(doItem.ChargeAmount);
                            $("span[id^='TotalTaxAmount']").text(doItem.TotalTaxAmount);
                            $("span[id^='TotalAmount']").text(doItem.TotalAmount);
                            $("span[id^='Remarks']").text(doItem.ChargeRemarks);

                            if ($("span[id^='SBasis']").text() == undefined || $("span[id^='SBasis']").text() == "") {
                                $("span[id^='SBasis']").closest("td").find("input").css("display", "none");
                                $("span[id^='SBasis']").closest("td").find("span").css("display", "none");
                            }
                            else {
                                $("span[id^='SBasis']").closest("td").find("span").show();
                                $("span[id^='SBasis']").closest("td").find("input[id^='SValue']").show();
                                $("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").hide();
                            }
                        }
                        else {
                            $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val(doItem.PrimaryBasis != 'KG' ? doItem.pValue : (Number(grossWt) > Number(doItem.pValue) ? doItem.pValue : grossWt));
                            $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val(doItem.PrimaryBasis != 'KG' ? doItem.pValue : (Number(grossWt) > Number(doItem.pValue) ? doItem.pValue : grossWt));
                            $("span[id^='PBasis_" + rowId + "']").text(doItem.PrimaryBasis);
                            $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='_tempSValue']").val(doItem.SecondaryBasis != 'KG' ? doItem.sValue : (Number(grossWt) > Number(doItem.sValue) ? doItem.sValue : grossWt));
                            $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='SValue']").val(doItem.SecondaryBasis != 'KG' ? doItem.sValue : (Number(grossWt) > Number(doItem.sValue) ? doItem.sValue : grossWt));
                            $("span[id^='SBasis_" + rowId + "']").text(doItem.SecondaryBasis);
                            $("span[id^='Amount_" + rowId + "']").text(doItem.ChargeAmount);
                            $("span[id^='TotalTaxAmount_" + rowId + "']").text(doItem.TotalTaxAmount);
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

                        $(this).find("span[id^='Remarks']").text($(this).find("span[id^='Remarks']").text().substring(0, 50));
                        $(this).find("span[id^='Remarks']").closest('td').hover(function () {
                            $(this).prop('title', $(this).find("input[id^='Remarks']").val());
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
                 { name: 'AWBSNo', type: 'hidden', value: $('#hdnAWBSNo').val() },
                 {
                     name: pageType == 'EDIT' ? 'Type' : 'Type', display: 'Type', type: 'select', ctrlOptions: { 'PP': 'PREPAID', 'CC': 'COLLECT' }, isRequired: true, onChange: function (evt, rowIndex) { }, ctrlCss: { width: '80px' }
                 },
                 {
                     name: "OtherCharge", display: "Charge Code", type: "text", ctrlAttr: { maxlength: 80, controltype: "autocomplete" }, ctrlCss: { width: "90px" }, isRequired: true, tableName: "AWBOtherChargeCode", textColumn: "OtherChargeCode", keyColumn: "OtherChargeCode", templateColumn: ["OtherChargeCode", "Description"],
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
        url: "Services/Import/DeliveryOrderService.svc/GetPaymentRecord?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result != "") {
                var resData = jQuery.parseJSON(result);
                var paymentDetail = resData.Table0;
                $("#divDetail").show();

                var strVar = "";
                strVar += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr style=\"background-color: #C0C0C0\"><tbody class=\"ui-widget-content\"><td class=\"ui-state-active caption formSection\" align=\"left\" colspan=\"8\">Payment Details<\/td><\/tr>";
                strVar += "<tr style=\"font-weight: bold\">";
                strVar += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">SNo<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Process<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">PD No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Invoice No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Amount<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Payment Mode<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Action<\/td><\/tr>";

                if (paymentDetail.length > 0) {
                    for (var i = 0; i < paymentDetail.length; i++) {
                        var Type = paymentDetail[i].Process == "Delivery Order" ? "DO" : "CN";
                        var PrintSNo = Type == "DO" ? paymentDetail[i].DOSNo : paymentDetail[i].DLVSNo;
                        strVar += "<td class=\"ui-widget-content\">" + (i + 1) + "<\/td><td class=\"ui-widget-content\">" + paymentDetail[i].Process + "<\/td><td class=\"ui-widget-content\">" + paymentDetail[i].DONo + "<\/td><td class=\"ui-widget-content\">" + paymentDetail[i].PDNo + "<\/td><td class=\"ui-widget-content\">" + paymentDetail[i].InvoiceNo + "<\/td><td class=\"ui-widget-content\">" + paymentDetail[i].Amount + "<\/td><td class=\"ui-widget-content\">" + paymentDetail[i].PaymentMode + "<\/td><td class=\"ui-widget-content\">";
                        if (paymentDetail[i].Process == "Delivery Order")
                            strVar += "<input id=\"btnPrint\" type=\"button\" value=\"Print\" onclick=\"PrintSlip('DO','" + paymentDetail[i].DOSNo + "','');\"><\/td><\/tr>"
                        else
                            strVar += "<input id=\"btnPrint\" type=\"button\" value=\"Print\" onclick=\"PrintSlip('CN','" + paymentDetail[i].InvoiceSNo + "','" + paymentDetail[i].DLVSNo + "');\"><\/td><\/tr>"
                    }
                }
                else
                    strVar += "<tr><td class=\"ui-state-active caption formSection\" align=\"left\" colspan=\"8\">No Record Found<\/td><\/tr>";
                strVar += "<\/tbody><\/table>";
                strVar += "<\/br>";
                $('#divDetail3').html(strVar);

            }
            //else
            //    ShowMessage('warning', 'Warning - Reservation [' + CurrentAWBNo + ']', "Please correct value(s) for :- " + result + ".", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - DO', "AWB No. [" + CurrentAWBNo + "] -  unable to process.", "bottom-right");
        }
    });
}

function BindCancelDO() {
    $('#divDetail').append("<table id='tblDOCancel'></table>");
    if ($("#" + "Text_DONo").data("kendoAutoComplete") == undefined) {
        cfi.AutoComplete("DONo", "DeliveryOrderNo", "vDeliveryOrder", "SNo", "DeliveryOrderNo", ["DeliveryOrderNo"], BindPhysicalDODetail, "contains");
    }

    $("#divareaTrans_import_doflightdetail").css("display", "none");
    $("#divareaTrans_import_dohandlingcharge").css("display", "none");
    $("table[id^='__tblcancel do__']")[1].hidden = true;
    var CheckPhysicalDDO = 0;
    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/GetCancelDODetail?AWBSNo=" + currentawbsno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var resData = jQuery.parseJSON(result);
            CheckPhysicalDDO = resData.Table0[0].RestDeliveryOrder;
            var doDataDetail = resData.Table1;
            $('#divDetail').show();
            if (CheckPhysicalDDO == 1) {
                checkcanceldo = false;
               
                $('#divDetail').hide();
            }
            else
            {
                checkcanceldo = true;
            }

            if (doDataDetail.length > 0) {
                var strVar = "";
                strVar += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr style=\"background-color: #C0C0C0\"><tbody class=\"ui-widget-content\"><td class=\"ui-state-active caption formSection\" align=\"left\" colspan=\"11\">Delivery Order Details<\/td><\/tr>";
                strVar += "<tr style=\"font-weight: bold\">";
                strVar += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO Date<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Waybill Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">HAWB No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Pieces<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Gross Weight<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Total Charges<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Charges Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Participant Name<\/td><td style=\"padding-left: 5px; width: 250px\" class=\"ui-widget-header\">Action<\/td><\/tr>";

                for (var i = 0; i < doDataDetail.length; i++) {
                    strVar += "<td class=\"ui-widget-content\">" + doDataDetail[i].DeliveryOrderNo + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DeliveryOrderDate + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DOType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].WaybillType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].HouseNo + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DOPieces + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].DOGrossWeight + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].TotalCharges + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].ChargesType + "<\/td><td class=\"ui-widget-content\">" + doDataDetail[i].ParticipantName + "<\/td><td class=\"ui-widget-content\"><input id=\"btnPrint\" type=\"button\" value=\"DO Print\" onclick=\"PrintSlip('DOCancel'," + doDataDetail[i].DOSNo + ");\">";
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

function BindPhysicalDO() {
    if ($("#" + "Text_DONo").data("kendoAutoComplete") == undefined) {
        cfi.AutoComplete("DONo", "DeliveryOrderNo", "vDeliveryOrder", "SNo", "DeliveryOrderNo", ["DeliveryOrderNo"], BindPhysicalDODetail, "contains");
    }

    cfi.AutoComplete("DeliverdTo", "Name,IdCardNo", "CustomerAuthorizedPersonal", "SNo", "Name", ["Name", "IdCardNo"], null, "contains");
    cfi.AutoComplete("PDULDNo", "ULDNo", "vDOULDList", "ULDSNo", "ULDNo", ["ULDNo"], GetBupDetails, "contains", ",");
    cfi.AutoCompleteByDataSource("CustomerType", CustomerDataSource, HideCCCharges);
    var CheckPhysicalDDO = 0;
    var IsPayment = 0;
    $.ajax({
        url: "Services/Import/DeliveryOrderService.svc/GetPhysicalDODetail?AWBSNo=" + currentawbsno + "&ArrivedShipmentSNo=" + currentArrivedShipmentSNo, async: false, type: "get", dataType: "json", cache: false,
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
                $("#AuthorizedPersonId").attr("data-valid", "required").attr("data-valid-msg", "Enter Authorized Person Id.");
                $("#AuthorizedPersonName").attr("data-valid", "required").attr("data-valid-msg", "Enter Authorized Person Name.");
                $("#AuthorizedPersonCompany").attr("data-valid", "required").attr("data-valid-msg", "Enter Authorized Person Company.");
            }

            $("span.k-datepicker").css("width", "30%");

            if (CheckPhysicalDDO == 1) {
                $('#divDetail').hide();
            }

            //if (IsPayment != 0)
            //    alert("Payment not received for DO number can't process PDS");

            if (dlvData.length > 0) {
                var strVar = "";
                strVar += "<table class=\"tdPadding\" id=\"tblDLV\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr style=\"background-color: #C0C0C0\"><tbody class=\"ui-widget-content\"><td class=\"ui-state-active caption formSection\" align=\"left\" colspan=\"9\">Physical Delivery Details<\/td><\/tr>";
                strVar += "<tr style=\"font-weight: bold\">";
                strVar += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Customer Type<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO No<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">DO Date<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Pieces<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Gross Weight<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Total Pieces<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Total Gross Weight<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Out Of Warehouse<\/td><td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">Action<\/td><\/tr>";

                for (var i = 0; i < dlvData.length; i++) {
                    strVar += "<td class=\"ui-widget-content\">" + dlvData[i].CustomerType + "<\/td><td class=\"ui-widget-content\">" + dlvData[i].DeliveryOrderNo + "<\/td><td class=\"ui-widget-content\">" + dlvData[i].DeliveryOrderDate + "<\/td><td class=\"ui-widget-content\">" + dlvData[i].DOPieces + "<\/td><td class=\"ui-widget-content\">" + dlvData[i].DOGrossWeight + "<\/td><td class=\"ui-widget-content\">" + dlvData[i].TotalPieces + "<\/td><td class=\"ui-widget-content\">" + dlvData[i].TotalGrossWeight + "<\/td><td class=\"ui-widget-content\"><input id=\"chkOFW_" + i + "\" type=\"checkbox\" value=\"" + dlvData[i].IsOFW + "\" onclick=\"Disable(this)\"\"><\/td><td class=\"ui-widget-content\"><input id=\"btnChargeNote_" + i + "\" type=\"button\" value=\"Charge Note\" onclick=\"OpenPopUp(" + dlvData[i].DLVSNo + "," + dlvData[i].DOGrossWeight + ", 0, 0, 'DLV',0,0,0,0);\">";
                    //if (parseInt(IsPayment) == 0)
                    strVar += "&nbsp;<input id=\"btnPrint_" + i + "\" type=\"button\" value=\"PDS Print\" onclick=\"OpenPopUp(" + dlvData[i].DLVSNo + ", this, 0, 0,'DLVPrint', 0, 0, 0, 0);\"><\/td><\/tr>"
                    //strVar += "&nbsp;<input id=\"btnPrint_" + i + "\" type=\"button\" value=\"PDS Print\" onclick=\"PrintSlip('DLV'," + dlvData[i].DLVSNo + ",this);\"><\/td><\/tr>"
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
                    // $("#BOENo").prop('disabled', true);
                    //$("#BOEDate").data("kendoDatePicker").enable(false);
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
    // $("#BOEDate").


}







function BindPhysicalDODetail(valueId, value, keyId, key) {
    if (key != "" && key != undefined) {
        var id = valueId;
        $.ajax({
            url: "Services/Import/DeliveryOrderService.svc/GetPhysicalDeliveryOrderRecord?DOSNo=" + key, async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var resData = jQuery.parseJSON(result);
                var dlvData = resData.Table0;
                var fdData = resData.Table1;
                var hcData = resData.Table2;
                var payment = resData.Table3[0].IsPayment;
                var IsPhysicalDelivery = resData.Table3[0].IsPhysicalDelivery;

                if (payment == "1") {
                    //alert("Payment not received for DO number can't process PDS");
                    ShowMessage('warning', 'Warning - Delivery Order', 'Payment not received for DO number can not process PDS', " ", "bottom-right");
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
                else if (subprocesssno == 2305 && IsPhysicalDelivery == 1) {
                    //alert("Physical delivery already created for DO number can't process Cancel");
                    ShowMessage('warning', 'Warning - Delivery Order', 'Physical delivery already created for DO number can not process Cancel', " ", "bottom-right");
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
                                $("#divareaTrans_import_dohandlingcharge").find('th').append('<span id="DivCancel"style="padding-left:550px;"><input type="radio" tabindex="19" data-radioval="CASH" class="" name="CustomerType" checked="True" id="CustomerType" value="0" onclick="AuthenticateBillTo(this)">CASH <input type="radio" tabindex="19" data-radioval="CREDIT" class="" name="CustomerType" id="CustomerType" value="1" onclick="AuthenticateBillTo(this)">CREDIT &nbsp;&nbsp;  Bill To  <input type="hidden" name="BillTo" id="BillTo" value=""><span class="k-widget k-combobox k-header"><span class="k-dropdown-wrap k-state-disabled" unselectable="on"><input type="text" class="k-input" name="Text_BillTo" id="Text_BillTo" tabindex="10" controltype="autocomplete" maxlength="" value="" placeholder="" data-role="autocomplete" autocomplete="off"  style="width: 150px; text-transform: uppercase;"><span class="k-select" unselectable="on"><span class="k-icon k-i-arrow-s" unselectable="on" style="cursor:pointer;">select</span></span></span></span>&nbsp;<span><input type="text" class="" name="BillToText" id="BillToText" style="width: 150px; text-transform: uppercase;" controltype="alphanumericupper" tabindex="21" maxlength="100" value="" placeholder="" data-role="alphabettextbox" autocomplete="off" ></span>&nbsp;</span>');

                                cfi.AutoComplete("BillTo", "Name", "vBillTo", "SNo", "Name", ["Name"], CheckAgentCreditLimit, "contains");



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
                            // $("#divareaTrans_import_dohandlingcharge").html("");
                            //$("#divareaTrans_import_dohandlingcharge").html(temp);
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
                                    //AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIE", "", currentawbsno, 0, currentdetination, 1, "", "2", "999999999", "No");
                                    AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "TariffSNo", "TariffCode", ["TariffSNo", "TariffCode"], GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIEInbound", "", currentawbsno, 0, currentdetination, 1, "", "2", "999999999", "No");
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
                                    //$(this).find("[id^='WaveOff']").unbind("click").bind("click", function () {
                                    //    EnableRemarks(this);
                                    //});
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
                            $("span[id='BupPcs']").text(0);
                            $("span[id='TotalPieces']").text(dlvItem.TotalPieces);
                            $("span[id='TotalBulkPieces']").text(dlvItem.TotalBulkPieces);
                            $("span[id='TotalBulkPieces']").hide();

                            /*Weight Detail*/
                            $("input[id='BulkGrWt']").val(dlvItem.BulkGrWt);
                            $("input[id='_tempBulkGrWt']").val(dlvItem.BulkGrWt);
                            $("span[id='BupGrWt']").text(0);
                            $("span[id='TotalGrossWeight']").text(dlvItem.TotalGrossWeight);
                            $("span[id='TotalBulkGrWt']").text(dlvItem.BulkGrWt);
                            $("span[id='TotalBulkGrWt']").hide();

                            $("span[id='Staff']").text(dlvItem.Staff);
                            $("span[id='Time']").text(dlvItem.Time);
                            $("span[id='WHLocation']").text(dlvItem.WHLocation);
                            $("span[id='NatureofGoods']").text(dlvItem.NatureOfGoods);
                            $("span[id='CargoType']").text(dlvItem.CargoType);
                            $("span[id='Temperature']").text(dlvItem.Temperature);
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
        //var valu = $("#HoldPieces").val();
        //alert(valu)

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
                //if (Length > 19) {
                //    jAlert('Length can not be greater than 18', 'Alert Dialog');
                //    $('#' + ID).val("");
                //    $('#_temp' + ID).val("");
                //}
            }
        }
    });
}

var pageType = $('#hdnPageType').val();
var fotter = "<div><table style='margin-left:20px;'>" +
                        "<tbody><tr><td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-primary btn-sm' style='width:125px;display:none' id='btnNew'>New Delivery Order</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-success btn-sm'  id='btnSave'>Save</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-success btn-sm' style='display:none'  id='btnUpdate'>Update</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-success btn-sm' id='btnSaveToNext'>Save &amp; Next</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-danger btn-sm'  id='btnCancel'>Cancel</button></td>" +
                            "<td><button class='btn btn-block btn-success btn-sm' style='display:none'  id='btnChargeNote'>Charge Note</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                             "<td><button class='btn btn-block btn-success btn-sm' style='display:none'  id='btnPrintDLV'>Print DLV Slip</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                             "<td><button class='btn btn-block btn-success btn-sm' style='display:none'  id='btnPrint'>Print</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                        "</tr></tbody></table> </div>";
var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divDeliveryOrderDetails' style='width:100%'></div></td></tr><tr><td valign='top'><div id='divNewDeliveryOrder' style='width:100%'></div></td></tr><tr> <td valign='top'> <table style='width:100%'> <tr> <td style='width:100%;' valign='top' class='tdInnerPadding'> <div id='tabstrip'> <ul id='ulTab' style='display:none;'> <li class='k-state-active'> Genral </li><li> SPHC Wise </li><li>Tab 3</li><li>Tab 4</li><li>Tab 5</li></ul> <div> <div id='divDetail'></div><div id='divDetail1'></div><div id='divDetail2'></div><div id='divDetail3'></div></div><div> <div id='divDetailSHC'> </div></div><div><div id='divTab3'></div></div><div><div id='divTab4'></div></div><div><div id='divTab5'></div></div></div></div></td></tr></table> </td></tr></table></div>";
