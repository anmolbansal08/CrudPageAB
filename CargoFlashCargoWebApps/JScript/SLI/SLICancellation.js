$(document).ready(function () {
    SLInfoList();
});
var paymentList = null;
var currentprocess = "";
var currentslisno = 0;
var printInvoiceSno = 0;
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
var IsProcessed = false;
var IsFinalSLI = false;
var TempSLINo = 0;
var currentawbsno = 0;
var _IS_DEPEND = false;
var TotPcs = 0;
var AWBNo = "";

function GetProcessSequence(processName) {

    $.ajax({
        url: "Services/Shipment/SLInfoService.svc/GetProcessSequence?ProcessName=" + processName, async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
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
function CleanUI() {

    $("#tblShipmentInfo").hide();
    $("#divDetail").html("");
    $("#divDetail").html("");
    $("#tblShipmentInfo").hide();
    $("#divNewBooking").html("");
    $("#btnSave").unbind("click");
    $("#btnSaveToNext").unbind("click");
}

function SLInfoList() {
    debugger;
    _CURR_PRO_ = "SLICancellation";
    _CURR_OP_ = "SLI";
    $("#licurrentop").html(_CURR_OP_);
    $("#divSearch").html("");
    $("#divShipmentDetails").html("");
    //$("#btnSave").unbind("click");
    CleanUI();
     debugger;
    // cfi.ShowIndexView("divShipmentDetails", "Services/FormService.svc/GetGridData/" + _CURR_PRO_ + "/Shipment/Booking");
    $.ajax({
        url: "Services/Shipment/SLICancellationService.svc/GetWebForm/" + _CURR_PRO_ + "/Shipment/SLICancellation/INDEXVIEW/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            debugger;
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form>");
            $("#divContent").html(divContent);
            $("#divFooter").html(fotter).show();
            //Check Page New rights
            var rights = GetPageRightsByAppName("Shipment", "SLICancellation");
            if (!rights.IsNew) {
                $("#btnNew").remove();
            }
            cfi.AutoComplete("searchSLINo", "SLINO", "vGetSLINOSearch", "SLINO", "SLINO", ["SLINO"], null, "contains");

            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });
            SLISearch();
            $("#btnSearch").bind("click", function () {
                CleanUI();
                $('#divShipmentDetails').unbind("click").bind("click", function () {
                    $(".k-loading-mask").attr("style", "display:none");
                })
                SLISearch();
            });
            //$("#btnNew").unbind("click").bind("click", function () {

            //    CleanUI();
            //    $("#hdnAWBSNo").val("");
            //    currentslisno = 0;
            //    IsFinalSLI = false;
            //    IsProcessed = false;
            //    var module = "SLI";
            //    $.ajax({
            //        url: "Services/Shipment/SLICancellation.svc/GetWebForm/" + _CURR_PRO_ + "/" + module + "/SLIAWB/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            //        success: function (result) {
            //            $('#btnSave').show();
            //            $('#btnSaveToNext').hide();
            //            $("#divDetail").html(result);
            //        }
            //    });

            //});
            //$("#btnCancel").unbind("click").bind("click", function () {
            //    ResetDetails();
            //});

        }
    });

    //SLISearch();
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
function SLISearch() {


    var searchSLINo = $("#Text_searchSLINo").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_searchSLINo").data("kendoAutoComplete").key(); //searchSLINo    //
    var LoggedInCity = userContext.CityCode;
    $("#imgprocessing").show();
    if (_CURR_PRO_ == "SLICancellation") {
        cfi.ShowIndexView("divShipmentDetails", "Services/Shipment/SLICancellationService.svc/GetSLIGridData/" + _CURR_PRO_ + "/SLI/SLICancellationSearch/" + searchSLINo, "Scripts/maketrans.js?" + Math.random());

    }
    $('td[class="form2buttonrow"]').hide();
    $("#imgprocessing").hide();
  //  OnSuccessGrid();
}
function GetSLICanAction(e) {
    //$(".tool-items").hide();
    var RecID = $(e).attr('href').split('=')[1];
    $(e).attr('href', '#RecID=' + RecID);
    var _CurrentSLISNo = RecID;
    currentslisno = RecID;
    var module = "SLICancellation";

    // alert('sdhjkfg');
    $.ajax({
        url: "Services/Shipment/SLICancellationService.svc/GetWebForm/" + _CURR_PRO_ + "/" + module + "/SLIAWB/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divDetail").html(result);
        }
        , error: function (rex) {
            alert(rex);
        }
    });

}
function OnSuccessGrid() {
    $('td[class="form2buttonrow"]').hide();

    var TrHeader = $("div[id$='divShipmentDetails']").find("div[class^='k-grid-header'] thead tr");
    var IsFinalSLIIndex = TrHeader.find("th[data-field='IsFinalSLI']").index();
    var SLIFlagIndex = TrHeader.find("th[data-field='SLIFlag']").index();

    $("div[id$='divShipmentDetails']").find("div[class^='k-grid-content'] tbody tr").each(function (row, tr) {
        $(this).unbind("click").bind("click", function () {
            var recId = $(tr).find("input[type='radio']").val();
            if (!(recId == undefined || recId == "")) {
                $(tr).find("input[type='radio']").attr("checked", true);

                if ($(tr).find("td:eq(" + SLIFlagIndex + ")").text() == "false") {

                    $(".tool-items").find(".actionSpan").each(function () {

                        if ($(this).text().toUpperCase() == "CANCEL") {
                            $(this).closest("a").css("display", "block");
                           // $(this).closest("a").css("display", "none");
                        }
                        if ($(this).text().toUpperCase() == "RETURN") {
                            $(this).closest("a").css("display", "block");
                           // $(this).closest("a").css("display", "none");
                        }
                    });

                } else {

                    $(".tool-items").find(".actionSpan").each(function () {

                        if ($(this).text().toUpperCase() == "CANCEL") {
                            $(this).closest("a").css("display", "block");
                        }

                        if ($(this).text().toUpperCase() == "RETURN") {
                            $(this).closest("a").css("display", "block");
                        }
                    });

                }

            }
        });
    });


  
}
var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divShipmentDetails' style='width:100%'></div><div id='pWindow'></div><div id='divULDInfoforSLI'><div id=div1></div><div id=div2></div><div id=div3></div></div><div id=UldRemarks></div><div id=divTempDetails></div></td></tr><tr><td valign='top'><div id='divNewBooking' style='width:100%'></div></td></tr><tr> <td valign='top'> <table style='width:100%'> <tr> <td style='width:70%;' valign='top' class='tdInnerPadding'> <div id='tabstrip'> <ul id='ulTab' style='display:none;'> <li class='k-state-active'> Genral </li><li> SPHC Wise </li></ul> <div> <div id='divDetail'></div></div><div> <div id='divDetailSHC'> </div></div></div></td></tr></table> </td></tr></table></div>";

var fotter = "<div><table style='margin-left:20px;'>" +
                        "<tbody><tr><td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-success btn-sm'  id='btnSave'>Save</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-danger btn-sm' id='btnCancel'>Cancel</button></td>" +
                        "</tr></tbody></table> </div>";