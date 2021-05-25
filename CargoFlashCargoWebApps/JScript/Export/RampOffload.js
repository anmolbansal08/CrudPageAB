
var billto = [{ Key: "0", Text: "Agent" }, { Key: "1", Text: "Airline" }];
$(document).ready(function () {
    SearchRampOffload();  
    $('.icon-trans-plus-sign').hide();   
   
});

function ResetSearch(obj) {
    cfi.ResetAutoComplete("searchFlightNo");
    $('#divRampOffloadDetails').html("");
}

function CheckData(obj)
{
    var currentID = obj.id;

        var currentUldStockSNo = obj.id.split('_')[1];
        var vgrid = cfi.GetCFGrid("divRampOffloadDetails");
        if (vgrid != undefined) {
            var datasource_uld = vgrid.dataSource;
            var data_uld = datasource_uld.data();
            $.each(data_uld, function (i, item) {
                if (item.ULDStockSNo == currentUldStockSNo) {
                    if ($('#' + currentID + ':checked').length > 0) {
                        item.isSelect = 1;
                    }
                    else{
                        item.isSelect = 0;
                    }
                }
            });
        }
    

}

function CheckDataChild(obj)
{
    var currentID = obj.id;

        var AWBSNo = obj.id.split('_')[1];
        var vgrid = cfi.GetNestedCFGrid("div__0");
        if (vgrid != undefined) {
            var datasource_uld = vgrid.dataSource;
            var data_uld = datasource_uld.data();
            $.each(data_uld, function (i, item) {
                if (item.AWBSNo == AWBSNo) {
                    if ($('#' + currentID + ':checked').length > 0) {
                        item.IsBulk = 4;
                        //item.PlannedPieces = $("#" + currentID).closest("tr").find("input[type='text']").val();
                        //item.Plan_G = $("#" + currentID).closest("tr").find("td[data-column='Plan_G_V']").html().split('/')[0];
                        //item.Plan_V = $("#" + currentID).closest("tr").find("td[data-column='Plan_G_V']").html().split('/')[1]
                    }
                    else{
                        item.IsBulk = 1;
                    }
                }
            });
        }
    

}
function SaveOffloadData() {

    var LIArray = new Array();
    var LIDetailsArray = new Array();
    var chkSelect;
    var chkbulkSelect;
    var vgrid = cfi.GetCFGrid("divRampOffloadDetails");
    if (vgrid != undefined) {
        var datasource_uld = vgrid.dataSource;
        var data_uld = datasource_uld.data();
        $.each(data_uld, function (i, item) {
            if (item.isSelect == 1) {
                LIArray.push({
                    //  isSelect: $(tr).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked'),
                    AWBSNo: item.AWBSNo == undefined ? 0 : item.AWBSNo,
                    DailyFlightSNo: item.DailyFlightSNo,
                    ULDStockSNo: item.ULDStockSNo,
                    Location: item.Location == "undefined" ? 0 : item.Location,
                });
            }
        });
    }

    var vgrChildid = cfi.GetNestedCFGrid("div__0");
    if (vgrChildid != undefined) {
        var datasource_uld = vgrChildid.dataSource;
        var data_uld = datasource_uld.data();


        $.each(data_uld, function (i, item) {
            if (item.IsBulk == 4) {
                LIDetailsArray.push({                  
                    AWBSNo: item.AWBSNo,
                    DailyFlightSNo: item.DailyFlightSNo,
                    ULDStockSNo: item.ULDStockSNo,
                    AWBSector: item.AWBSector,
                    TotalPieces: item.TotalPieces,
                    PlannedPieces: item.PlannedPieces,
                    Act_G: item.Act_G_V.split('/')[0],
                    Act_V: item.Act_G_V.split('/')[1],
                    Plan_G: item.PGW,
                    Plan_V: item.PVW,
                    Status: item.Status,
                    Location: item.Location,

                });
            }
        });
    }

    for (var i = 0, length = LIDetailsArray.length; i < length; i++)
    {
        if (LIDetailsArray[i].PlannedPieces == "" || parseInt(LIDetailsArray[i].PlannedPieces) == 0)
        {
            ShowMessage('warning', 'Warning - Ramp Offload', "Enter Planned Pieces.");
            return false;
        }
    }
    if (LIDetailsArray.length > 0 || LIArray.length > 0)
    {
        PopReason(LIArray, LIDetailsArray);
    }
    else {
        ShowMessage('warning', 'Warning - Ramp Offload', "Please Select Atleast One Checkbox.");
        return false;
    }
}
function PopReason(LIArray, LIDetailsArray) {
    $("#popReasonDialog").remove();
    $('#tblUCMInOutAlert').append('<div id="popReasonDialog" style="font-family: Arial; font-size:13px;"></div>');
    $("#popReasonDialog").append('<table id="tblpassword" style="margin: 0px auto; width:100%;"><tr><td</td></tr><tr><td><textarea id="Reason" rows="4" cols="43" style="margin-bottom: 2%;padding: 6px 10px; box-sizing: border-box;border: 1px solid #4CAF50;border-radius: 4px;" id="Reason" maxlength="100"> </textarea></td></tr><tr><td><label id="mValidateMessage" style="color:red;"></label></td></tr></table>');
    $("#popReasonDialog").dialog(
    {
        autoResize: true,
        maxWidth: 400,
        maxHeight: 325,

        width: 400,
        height: 220,
        modal: true,
        title: 'Reason',
        draggable: false,
        resizable: false,
        buttons: {
            "Save": function () {
                var Reason = $('#Reason').val();
                
                SaveRampOffloadData(Reason, LIArray, LIDetailsArray);
                //$(this).dialog("close");
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
function SaveRampOffloadData(Reason, LIArray, LIDetailsArray)
{
    if (Reason == "") {
        $('#Reason').css("border", "1px solid red");

        $('#mValidateMessage').text("Reason are mandatory !!!");
        return false;
    }
    if (LIDetailsArray.length > 0 || LIArray.length >0 ){
    $.ajax({
        url: "Services/Export/RampOffloadService.svc/SaveOffloadData", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ RampOffloadData: LIArray, RampOffloadDataDetail: LIDetailsArray, Reason: Reason }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {

            if (result == "0") {
                ShowMessage('success', 'Success -Shipment offloaded successfully', "Processed Successfully", "bottom-right");
                $("#popReasonDialog").remove();
                flag = true;
                SearchRampOffload();
            }

        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning -Shipment could not be offloaded', " ", "bottom-right");
            flag = false;
        }
    });
    }
    else
    {
        ShowMessage('warning', 'Warning - Ramp Offload', "Please Select Atleast One Checkbox.");
        return false;
    }
}
function fn_CalVolGrWt(obj) {

    //CheckDataChild(obj);
    var checkPlannedPieces = 0;
    var id = obj.id;

    var Plannedpieces = ($('#' + id).val() == '' ? 0 : $('#' + id).val());

    var trRow = $(obj).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var TotalPiecesIndex = trRow.find("th[data-field='TotalPieces']").index();
    var Act_G_VIndex = trRow.find("th[data-field='Act_G_V']").index();
    var PlanG_V_CBMIndex = trRow.find("th[data-field='Plan_G_V']").index();
    var Act_G = $(obj).closest('tr').find('td:eq(' + Act_G_VIndex + ')').text().split('/')[0] == '' ? 0 : $(obj).closest('tr').find('td:eq(' + Act_G_VIndex + ')').text().split('/')[0];
    var Act_V = $(obj).closest('tr').find('td:eq(' + Act_G_VIndex + ')').text().split('/')[1] == '' ? 0 : $(obj).closest('tr').find('td:eq(' + Act_G_VIndex + ')').text().split('/')[1];
    var TotalPieces = $(obj).closest('tr').find('td:eq(' + TotalPiecesIndex + ')').text() == '' ? 0 : $(obj).closest('tr').find('td:eq(' + TotalPiecesIndex + ')').text();


    var PG = parseFloat((Act_G / TotalPieces) * Plannedpieces).toFixed(2);
    var PV = parseFloat((Act_V / TotalPieces) * Plannedpieces).toFixed(2);


    $(obj).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ')').text(PG + '/' + PV);



    var AWBSNo = obj.id.split('_')[2];
    var vgrid = cfi.GetNestedCFGrid("div__0");
    var datasource_uld = vgrid.dataSource;
    var data_uld = datasource_uld.data();

    $.each(data_uld, function (i, item) {
        var TPP = $("#" + obj.id).closest("tr").find("#hdnPlannedPieces").val();
        if (item.AWBSNo == AWBSNo) {
            if (parseInt($('#' + id).val()) == 0) {
                ShowMessage('warning', 'Warning - Ramp Offload', "Planned Pieces can not be 0");
                $('#' + id).val("");
               return false;
            }
            if (parseInt($('#' + id).val()) > parseInt(TPP)) {
                ShowMessage('warning', 'Warning - Ramp Offload', "Planned Pieces can not be grater then actual Planned Pieces");
                $('#' + id).val("");
                return false;
            }

        }
    });

    $.each(data_uld, function (i, item) {
        if (item.AWBSNo == AWBSNo) {
            //if ($('#' + id).val() > 0) {
                item.PlannedPieces = $("#" + obj.id).closest("tr").find("input[type='text']").val();
                item.PGW = $("#" + obj.id).closest("tr").find("td[data-column='Plan_G_V']").html().split('/')[0];
                item.PVW = $("#" + obj.id).closest("tr").find("td[data-column='Plan_G_V']").html().split('/')[1]
            //}

        }
    });
}
function GatLocationValue(obj, awbsno)
{
    var id = obj.id;
    var ULDStockSNo = $(obj).attr('HideULDStockSNo');
    var AWBSNo = $(obj).attr('HideAWBSNo');
    var vgrid = cfi.GetNestedCFGrid("div__0");
    if (vgrid != undefined) {
        var datasource_uld = vgrid.dataSource;
        var data_uld = datasource_uld.data();
        $.each(data_uld, function (i, item) {
            if (item.AWBSNo == AWBSNo && ULDStockSNo == 0) {
                item.Location = $("#txt_PlannedPieces_" + awbsno).closest("tr").find("select option:selected").val();

            }
        });
    }

    var vgrid1 = cfi.GetCFGrid("divRampOffloadDetails");
    if (vgrid1 != undefined) {
        var datasource_uld1 = vgrid1.dataSource;
        var data_uld1 = datasource_uld1.data();
        $.each(data_uld1, function (i, item) {
            if (item.ULDStockSNo == ULDStockSNo && item.ULDStockSNo > 0) {
                item.Location = $("[hideuldstocksno='" + ULDStockSNo + "']").closest("tr").find("select option:selected").val();
            }
        });
    }
}
function SearchRampOffload() {
    _CURR_PRO_ = "RampOffload";
    _CURR_OP_ = "Ramp Offload";
    $("#licurrentop").html(_CURR_OP_);
    $("#divSearch").html("");
    $("#divRampOffloadDetails").html("");

    $("#tblAwbULDLocation_btnAppendRow").live("click", function () {
        $("#tblAwbULDLocation_btnRemoveLast").show();
        GetTempreatureControlled();
    });

    $.ajax({
        url: "Services/Export/RampOffloadService.svc/GetWebForm/" + _CURR_PRO_ + "/Export/RampOffload/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContent);

            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });

            $("#searchFromDate").change(function () {
                ValidateDate();
            });

            $("#searchToDate").change(function () {
                ValidateDate();
            });
            
            //---------------------- Transit Monitoring search ---------------------------//
            $("#btnSearch").bind("click", function () {
                if ($('#Text_searchFlightNo').val() == '') { ShowMessage('warning', 'Warning - Ramp Offload', "Enter Flight No."); } else {
                    RampOffloadSearch();
                    $("#divFooter").html(fotter).show();
                }
            });

            $('#searchFromDate').attr('onchange', 'ResetSearch()');  


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

    //$("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
    //    var controlId = $(this).attr("id");
    //    cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), _DefaultAutoComplete_);
    //});

    //cfi.AutoComplete("SearchAirlineCarrierCode", "CarrierCode,AirlineName", "VGetInventoryAirline", "CarrierCode", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");
    //cfi.AutoComplete("SearchBoardingPoint", "AirportCode,AirportName", "Airport", "AirportCode", "AirportName", ["AirportCode", "AirportName"], null, "contains");
   

    cfi.AutoCompleteV2("searchFlightNo", "FlightNo", "RampOffload_FlightNo", null, "contains");

    $("#Text_SearchAirlineCarrierCode").attr("placeholder", "Airline");
    $("#Text_SearchBoardingPoint").attr("placeholder", "Boarding Point");
    $("#Text_searchFlightNo").attr("placeholder", "Flight No.");
}

//--------------------- Inbound flight search -----------------------//
function RampOffloadSearch() {
    $("#divTransitMonitoringInformation").html("");
    $("#divTransitMonitoringULDInformation").html("");

    var SearchAirlineCarrierCode = $("#SearchAirlineCarrierCode").val() == "" ? "A~A" : $("#SearchAirlineCarrierCode").val();
    var SearchBoardingPoint = $("#SearchBoardingPoint").val() == "" ? "A~A" : $("#SearchBoardingPoint").val();
    var SearchFlightNo = $("#searchFlightNo").val() == "" ? "A~A" : $("#searchFlightNo").val().trim();
    var searchFromDate = "0";

    searchFromDate = $("#searchFromDate").attr("sqldatevalue") != "" ? $("#searchFromDate").attr("sqldatevalue") : "0";
    var searchToDate = "0";

    searchToDate = $("#searchToDate").attr("sqldatevalue") != "" ? $("#searchToDate").attr("sqldatevalue") : "0";
    var currentFFMFlightMasterSNo = "77533";

    _CURR_PRO_ = "RampOffloadFlightArrival";
    if (_CURR_PRO_ == "RampOffloadFlightArrival") {
        cfi.ShowIndexView("divRampOffloadDetails", "Services/Export/RampOffloadService.svc/GetFlightArrivalShipmentGrid/" + _CURR_PRO_ + "/Export/RampOffloadFlightArrivalShipment/" + SearchFlightNo + "/" + searchFromDate);
    }
    //$("#divRampOffloadDetails").Append("<table id='tblUCMInOutAlert'><div style=height:10px' /></table><table id='tblMessageType'></table>");
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
            ShowMessage('warning', 'Warning - Inbound Flight', "From date can not be greater than To date.");
        }
    }
}
function IsValidateNumber(e, t) {
    try {
        if (window.event) {
            var charCode = window.event.keyCode;
        }
        else if (e) {
            var charCode = e.which;
        }
        else { return true; }
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
    catch (err) {

    }
}
function PrintRebuildHandlingDetails(SNo, InvoiceType) {
    if (InvoiceType < 2)
        window.open("HtmlFiles/Shipment/Payment/ChargeNotePrintPayment.html?InvoiceSNo=" + SNo + "&InvoiceType=" + InvoiceType);
    else
        window.open("HtmlFiles/Tariff/WorkOrderPrint.html?InvoiceSNo=" + SNo);
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
function ExtraCondition(textId) {
    var filterEmbargo = cfi.getFilter("AND");

    if (textId == "Text_searchFlightNo") {
        try {           
            cfi.setFilter(filterEmbargo, "FlightDate", "eq", cfi.CfiDate("searchFromDate"))
            cfi.setFilter(filterEmbargo, "OriginAirportCode", "eq", userContext.AirportCode)
            //cfi.setFilter(filterFlt, "OriginCity", "eq", User_CityCode);
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            $('#divRampOffloadDetails').html("");

            return OriginCityAutoCompleteFilter2;


        }
        catch (exp) { }
    }



}
var strWHLocation = '';
function AddLocationDrp()
{
    $.ajax({
        url: "Services/Export/RampOffloadService.svc/GetOffloadedWHName", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            strWHLocation = '<option value="0" >Select</option>';
            $(result.Data).each(function (row, tr) {
                strWHLocation += '<option value=' + tr.SNo + ' >' + tr.LocationName + '</option>';
            });
        },
        error: function (jqXHR, textStatus) {
        }
    });

    $("#divRampOffloadDetails div.k-grid-content table tbody  tr").each(function (rowmain, trMain) {
     
        if ($(trMain).find('td[data-column="Location"] #txtLocation').html() == "") {
            $(trMain).find('td[data-column="Location"] #txtLocation').html(strWHLocation);

            $(trMain).find('td[data-column="Location"] #txtLocation').css("width", "135px")
        }
    });
}
function fn_HideBulkChild(asd, asdf) {

    
    //$.ajax({
    //    url: "Services/Export/RampOffloadService.svc/GetOffloadedWHName", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
    //    success: function (result) {
    //        strWHLocation = '<option value="0" >Select</option>';
    //        $(result.Data).each(function (row, tr) {
    //            strWHLocation += '<option value=' + tr.SNo + ' >' + tr.LocationName + '</option>';
    //        });
    //    },
    //    error: function (jqXHR, textStatus) {
    //    }
    //});
    //$('#div__0 > div.k-grid-content > table > tbody  tr  td[data-column="Location"]').html()

    $("div[id^='div__'] div.k-grid-content table tbody  tr").each(function (rowmain, trMain) {
       
        if ($(trMain).find('td[data-column="Location"] #txtLocation').html() == "")
        {
            $(trMain).find('td[data-column="Location"] #txtLocation').html(strWHLocation);
        }
       

        $(trMain).find('td[data-column="Location"] #txtLocation').css("width", "135px")
    });
    $('#divRampOffloadDetails  table tbody tr[class~="k-master-row"]').each(function (rowmain, trMain) {
        var Rowtr = $(trMain).closest("div.k-grid").find("div.k-grid-header:first");
        var ULDNoIndex = Rowtr.find("th[data-field='ULDNo']").index();
        var LocationIndex = Rowtr.find("th[data-field='Location']").index();

        var nestedGridHeader = $(trMain).next().find("div.k-grid-header");

        if ($(trMain).find('td:eq(' + ULDNoIndex + ')').text() != "BULK") {
            var nestedGridContent = $(trMain).next().find("div table tr");

            
            $(nestedGridContent).each(function (ww, mm) {
                $(mm).find('th:eq(' + 1 + ')').remove();
                $(mm).find('td:eq(' + 1 + ')').remove();
               
                $(mm).find('th:eq(' + 9 + ')').remove();
                $(mm).find('td:eq(' + 9 + ')').remove();
                $(mm).find('td[data-column="Status"]').attr('colspan', '2');
            });

        }
           

    });

    //});

}

//-------------- Div content for Transit Monitoring --------------------------//
var divContent = "<div class='rows'> <table style='width:100%' id='tblUCMInOutAlert'> <tr> <td valign='top' class='td100Padding'><div id='divRampOffloadDetails' style='width:100%'></div><div id='divDetail2'></div></td></tr></table></div>";

var fotter = "<div><table style='margin-left:20px;'>" +
                        "<tbody><tr><td> &nbsp; &nbsp;</td>" +
                            "<td><button type='submit' class='btn btn-block btn-success btn-sm' id='btnSave' style='display:block' onclick='SaveOffloadData();'>Save</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-danger btn-sm' id='btnCancel' style='display:none'>Cancel</button></td>" +
                        "</tr></tbody></table> </div>";
