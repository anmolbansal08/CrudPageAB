$(function () {
    MasterULDRepair();

});
var paymentList = null;
var currentprocess = "";
var currentawbsno = 0;
var printInvoiceSno = 0;
var printorigin = "";
var accpcs = 0;
var accgrwt = 0;
var accvolwt = 0;
var bkdpcs = 0;
var bkdgrwt = 0;
var bkdvolwt = 0;
var awborigin = "";
var DGRSPHC = [];
var ItenaryArray = [];
var FlightDateForGetRate = '';
var FlightNoForGetRate = '';
var isSaveAndNext = '';
var TactArray = [];
var IsFWbComplete = false;
var IsFWBAmmendment = false
var IsFlightExist = false;
var _IS_DEPEND = false;
var TabColor = '';
var IsAgentBUP = '';
var ULDRepairSNo = '';
var attchmntImageSNo = '0';
var attchmntInvoiceSNo = '0';
var IsQuoted = '';
var IsApproved = '';
var IsRepaired = '';
var RepairOrScrap = "False";
var uldno = "";

$("#divMainCostHistory").hide();
function MasterULDRepair() {
    _CURR_PRO_ = "ULDRepair";
    _CURR_OP_ = "ULD";
    $("#licurrentop").html(_CURR_OP_);
    $("#divSearch").html("");
    $("#divULDRepairDetails").html("");
    CleanUI();
    $.ajax({
        url: "Services/ULD/ULDRepairService.svc/GetWebForm/" + _CURR_PRO_ + "/ULD/ULDRepairSearch/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContent);
            $("#divFooter").html(fotter).show();
            $('#btnUpdate').hide();
            $('#btnQuoteUpdate').hide();
            $('#btnApprovedUpdate').hide();
            $('#btnApprovePrint').hide();
            $('#btnReturnUpdate').hide();
            $("#__divULDRepairsearch__ table:first").find("tr>td:first").text("ULD Repair");
            cfi.AutoCompleteV2("searchULDNo", "uldno", "ULD_RepairUldno", null, "contains");
            //$('#searchCreatedOn').data("kendoDatePicker").val("");
            $('#searchCreatedOn').val('');
            $('#searchCreatedOn').attr('sqldatevalue', '')
            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });
            $("#btnSearch").bind("click", function () {
                CleanUI();
                ULDRepairSearch();
                $('#btnUpdate').hide();
                $('#btnQuoteUpdate').hide();
                $('#btnApprovedUpdate').hide();
                $('#btnApprovePrint').hide();
                $('#btnReturnUpdate').hide();
            });
            CleanUI();
            ULDRepairSearch();
            $("#btnNew").unbind("click").bind("click", function () {
                $("#divMainCostHistory").hide();
                CleanUI();
                var module = "ULD";
                $.ajax({
                    url: "Services/ULD/ULDRepairService.svc/GetWebForm/" + _CURR_PRO_ + "/" + module + "/ULDRepair/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        $('#divUldRepairRecord').remove();
                        $("#divULDRepairDetails").append("<div id='divUldRepairRecord' style='width:100%'><table id='tblUldRepairRecord' style='width:100%'></table></div>");
                        $("#tblUldRepairRecord").html(result);
                        if (result != undefined || result != "") {
                            InitializePage("ULDRepair", "tblUldRepairRecord");
                            $('#btnUpdate').hide();
                            $('#btnQuoteUpdate').hide();
                            $('#btnApprovedUpdate').hide();
                            $('#btnApprovePrint').hide();
                            $('#btnReturnUpdate').hide();
                            currentprocess = "ULDRepair";
                            cfi.AutoCompleteV2("ULDNo", "uldno,SNo", "ULD_UldNumber", CheckContainer, "contains", null, null, null, null, OnSelectULDNo);
                            cfi.AutoCompleteV2("ULDVendor", "Name,SNo", "ULD_UldVendor", null, "contains");
                            cfi.AutoCompleteV2("AuthorizedPerson", "Name,SNo", "ULD_Authorizeperson", null, "contains");
                            cfi.AutoCompleteV2("MaintenanceType", "MaintenanceType,SNo", "ULD_RepairMaintenanceType", null, "contains");
                            cfi.AutoCompleteV2("AdditionalMaintenanceType", "MaintenanceType,SNo", "ULD_RepairAdditionalMaintenanceType", null, "contains", ",");
                            // var MnType = [{ Key: "1", Text: "LIGHT" }, { Key: "2", Text: "HEAVY" }, { Key: "3", Text: "MEDIUM" }];
                            //  cfi.AutoCompleteByDataSource("MaintenanceType", MnType);
                            $("input[name^=Repair]").on("click", function () {
                                if ($("input[name^=Repair]:checked").val() == 1) {
                                    $("#Text_MaintenanceType").removeAttr("data-valid")
                                    //$("#Text_AdditionalMaintenanceType").removeAttr("data-valid")
                                    $("#Text_ULDVendor").removeAttr("data-valid")
                                    $("#Text_AuthorizedPerson").removeAttr("data-valid")
                                    $("#Text_MaintenanceType").data("kendoAutoComplete").enable(false);
                                    $("#Text_AdditionalMaintenanceType").data("kendoAutoComplete").enable(false);
                                    $("#Text_ULDVendor").data("kendoAutoComplete").enable(false);
                                    $("#Text_AuthorizedPerson").data("kendoAutoComplete").enable(false);
                                    //  data-valid="required"
                                    if ($("div[id^='divUldRepairRecordAppendGrid']").attr('id')) {
                                        $('#divUldRepairRecordAppendGrid').remove();
                                    }
                                }
                                else {
                                    $("#Text_MaintenanceType").attr("data-valid", "required")
                                    //$("#Text_AdditionalMaintenanceType").attr("data-valid", "required")
                                    $("#Text_ULDVendor").attr("data-valid", "required")
                                    $("#Text_AuthorizedPerson").attr("data-valid", "required")
                                    $("#Text_MaintenanceType").data("kendoAutoComplete").enable(true);
                                    $("#Text_AdditionalMaintenanceType").data("kendoAutoComplete").enable(true);
                                    $("#Text_ULDVendor").data("kendoAutoComplete").enable(true);
                                    $("#Text_AuthorizedPerson").data("kendoAutoComplete").enable(true);

                                    if (!$("div[id^='divUldRepairRecordAppendGrid']").attr('id')) {
                                        if ($('#ULDNo').val()) {
                                            CheckContainer('', '', '', $('#ULDNo').val());
                                        }
                                        else {
                                            ShowMessage('info', 'ULD No.!', "Please Select ULD NO.", "bottom-right");
                                            $('#Repair[value="0"]').attr('Checked', '')
                                            $('#Repair[value="1"]').attr('Checked', 'True');
                                        }
                                    }
                                }
                            });
                        }
                    }
                });
            });
            PageRightsCheck()
        }
    });
}

$(document).on('change', '#Invoicedate', function () {
    var FromDate = document.getElementById('Invoicedate').value;
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    var date = new Date()
    var hours = date.getHours();
    var CurrntDate = date.getDate() + "-" + monthNames[date.getMonth()] + "-" + date.getFullYear();
    var eDate = new Date(FromDate);
    var sDate = new Date(CurrntDate);
    if (eDate > sDate) {
        $("#Invoicedate").val(CurrntDate)
        return false;
    }
});

function OnSelectULDNo(e) {
    var Data = this.dataItem(e.item.index());
    if ($("input[name^=Repair]:checked").val() == 1) {
        $("#Text_MaintenanceType").removeAttr("data-valid")
        $("#Text_ULDVendor").removeAttr("data-valid")
        $("#Text_AuthorizedPerson").removeAttr("data-valid")
        $("#Text_MaintenanceType").data("kendoAutoComplete").enable(false);
        $("#Text_AdditionalMaintenanceType").data("kendoAutoComplete").enable(false);
        $("#Text_ULDVendor").data("kendoAutoComplete").enable(false);
        $("#Text_AuthorizedPerson").data("kendoAutoComplete").enable(false)
    }
    else {
        $("#Text_MaintenanceType").attr("data-valid", "required")
        //$("#Text_AdditionalMaintenanceType").attr("data-valid", "required")
        $("#Text_ULDVendor").attr("data-valid", "required")
        $("#Text_AuthorizedPerson").attr("data-valid", "required")
        $("#Text_MaintenanceType").data("kendoAutoComplete").enable(true);
        $("#Text_AdditionalMaintenanceType").data("kendoAutoComplete").enable(true);
        $("#Text_ULDVendor").data("kendoAutoComplete").enable(true);
        $("#Text_AuthorizedPerson").data("kendoAutoComplete").enable(true);
    }
}
function ULDRepairSearch() {
    var ULDNo = $("#searchULDNo").val() == "" ? "A~A" : $("#searchULDNo").val().trim();
    var CreatedOn = $('#searchCreatedOn').attr('sqldatevalue') ? $('#searchCreatedOn').attr('sqldatevalue') : "A~A";
    //var FlightDate = "0";
    //if ($("#searchFlightDate").val() != "") {
    //    FlightDate = cfi.CfiDate("searchFlightDate") == "" ? "0" : cfi.CfiDate("searchFlightDate");// "";//month + "-" + day + "-" + year;
    //}
    MyIndexView("divULDRepairDetails", "/Services/ULD/ULDRepairService.svc/GetGridData");
    //+ "/" + DestinationCity + "/" + FlightNo + "/" + FlightDate + "/" + AWBPrefix + "/" + AWBNo + "/" + LoggedInCity);
}

function MyIndexView(divId, serviceUrl, jscriptUrl) {
    $.ajax({
        url: serviceUrl,
        data: BindWhereCondition(),
        async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#" + divId).html(result);
            $("#divFooter").show();
        },
        error: function (jqXHR, textStatus) {
            var ex = jqXHR;
        }
    });
}

function BindWhereCondition() {
    return JSON.stringify({
        processName: 'ULDRepair',
        moduleName: 'ULD',
        appName: 'ULDRepair',
        ULDNo: $("#searchULDNo").val() == "" ? "A~A" : $("#searchULDNo").val().trim(),
        CreatedOn: $('#searchCreatedOn').attr('sqldatevalue') ? $('#searchCreatedOn').attr('sqldatevalue') : "A~A",
    })
}
function checkRepairOrScrap() {
    $("#divULDRepairDetails table[class^='k-focusable k-selectable'] tr").each(function () {
        var RepairOrScrap = $(this).find("td[data-column='RepairOrScrap']").text()
        if (RepairOrScrap == "True") {
            $(this).find("input[process='ULDREPAIRUPDATE']").attr('disabled', 'true');
            $(this).find("input[process='QUOTEULDREPAIR']").attr('disabled', 'true');
            $(this).find("input[process='RETURNULDREPAIR']").attr('disabled', 'true');
            $(this).find("input[process='VIEWULDREPAIR']").attr("class", "incompleteprocess");
            $(this).find("input[process='ULDREPAIRUPDATE']").attr("class", "incompleteprocess");
            $(this).find("input[process='QUOTEULDREPAIR']").attr("class", "incompleteprocess");
            $(this).find("input[process='RETURNULDREPAIR']").attr("class", "incompleteprocess");
            $(this).find("input[process='PRINTULDREPAIR']").attr("class", "incompleteprocess");
            if ($(this).find("td[data-column='IsApproved']").text() == 'Y') {
                $(this).find("input[process='APPROVEDULDREPAIR']").attr("class", "completeprocess");
            }
            else {
                $(this).find("input[process='APPROVEDULDREPAIR']").attr("class", "incompleteprocess");
            }
        }
        else {
            IsQuoted = $(this).find("td[data-column='IsQuoted']").text();
            IsApproved = $(this).find("td[data-column='IsApproved']").text();
            IsRepaired = $(this).find("td[data-column='IsRepaired']").text();
            IsinvoiceRcvd = $(this).find("td[data-column='IsinvoiceRcvd']").text();
            $(this).find("input[process='VIEWULDREPAIR']").attr("class", "incompleteprocess");
            $(this).find("input[process='ULDREPAIRUPDATE']").attr("class", "incompleteprocess");

            if (IsQuoted == 'Y') {
                $(this).find("input[process='ULDREPAIRUPDATE']").attr('enabled', 'true');
                $(this).find("input[process='QUOTEULDREPAIR']").attr("class", "completeprocess");
            }
           
            if (IsApproved.trim() == 'Y') {
                //$(this).find("input[process='QUOTEULDREPAIR']").attr('disabled', 'true');
                $(this).find("input[process='APPROVEDULDREPAIR']").attr("class", "completeprocess");
            }
            else {
                $(this).find("input[process='APPROVEDULDREPAIR']").attr("class", "incompleteprocess");
            }
            if (IsRepaired == 'Y') {
                //$(this).find("input[process='ULDREPAIRUPDATE']").attr('disabled', 'true');
                //$(this).find("input[process='QUOTEULDREPAIR']").attr('disabled', 'true');
                //$(this).find("input[process='RETURNULDREPAIR']").attr('disabled', 'true');
                //$(this).find("input[process='APPROVEDULDREPAIR']").attr('disabled', 'true');

                $(this).find("input[process='APPROVEDULDREPAIR']").attr("class", "completeprocess");
                $(this).find("input[process='QUOTEULDREPAIR']").attr("class", "completeprocess");

                if (IsinvoiceRcvd == "True") {
                    $(this).find("input[process='RETURNULDREPAIR']").attr("class", "completeprocess");
                } else if (IsinvoiceRcvd == "False") {
                    $(this).find("input[process='RETURNULDREPAIR']").attr("class", "partialprocess");
                }
            } else if (IsRepaired == 'N') {
                $(this).find("input[process='RETURNULDREPAIR']").attr("class", "failureprocess");
                $(this).find("input[process='RETURNULDREPAIR']").attr("title", "Damage");
            }
            else {
                $(this).find("input[process='RETURNULDREPAIR']").attr("class", "incompleteprocess");
            }
            $(this).find("input[process='PRINTULDREPAIR']").attr("class", "incompleteprocess");
        }
    })
}

function printuldrepair() {
    window.open("HtmlFiles/ULDRepair/ULDRepair-Print.html?EditSNo=" + btoa(ULDRepairSNo) + "&pagename=" + btoa("A") + "&tnc=" + btoa('Print'));
}
function printULDApproval() {

    window.open("HtmlFiles/ULDRepair/ULDRepairApproved-Print.html?EditSNo=" + btoa(ULDRepairSNo) + "&pagename=" + btoa("A") + "&tnc=" + btoa('Print'));
}

//function checkProgrss(item, subprocess, displaycaption) {
//    if ((item).toUpperCase().indexOf(subprocess.toUpperCase() + "_1_C") >= 0) {
//        return "\"completeprocess\"";
//    }
//    if ((item).toUpperCase().indexOf(subprocess.toUpperCase() + "_0_I") >= 0) {
//        return "\"incompleteprocess\"";
//    }
//}

function CleanUI() {
    $('#divUldRepairRecord').remove();
    $('#divUldRepairRecordAppendGrid').remove();
    $('#divUldQuoteHistory').remove();
    $('#divUldRepairRecordPrint').remove();
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

function InitializePage(subprocess, cntrlid, isdblclick, subprocesssno) {
    InstantiateControl(cntrlid);
    if (subprocess == "ULDRepair") {
        UserSubProcessRights("divDetail", subprocesssno);
        return false;
    }
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
    $("#AlertEmail").attr("placeholder", "PRESS SPACE KEY FOR ADDING EMAIL");
    divmail = $("<div id='divmailAdd' style='overflow:auto;'><ul id='addlist1' style='padding:3px 2px 2px 0px;margin-top:0px;'></ul></div>");
    var spnlbl1 = $("<span class='k-label'><strong>(Press space key to  add New E-mail ( If Required))</strong></span>");
    $("#AlertEmail").after(spnlbl1);
    if ($("#divmailAdd").length === 0)
        $("#AlertEmail").after(divmail);
    SetnewEMail();
    /****************************Add by Pankaj Kumar Ishwar*****************************/
    $("#AlertMailCostApproval").attr("placeholder", "PRESS SPACE KEY FOR ADDING EMAIL");
    divmail = $("<div id='divmailAdds' style='overflow:auto;'><ul id='addlist2' style='padding:3px 2px 2px 0px;margin-top:0px;'></ul></div>");
    var spnlbl2 = $("<span class='k-label'><strong>(Press space key to  add New E-mail ( If Required))</strong></span>");
    $("#AlertMailCostApproval").after(spnlbl2);
    if ($("#divmailAdds").length === 0)
        $("#AlertMailCostApproval").after(divmail);
    SetnewEMailCostApproval();
}
function GetProcessSequence(processName) {
    $.ajax({
        url: "Services/Shipment/FWBService.svc/GetProcessSequence?ProcessName=" + processName, async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
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

function ExtraCondition(textId) {
    var filterReqTo = cfi.getFilter("AND");
    var filterEmbargo = cfi.getFilter("OR");
    var filterSubcategory = cfi.getFilter("AND");
    //Added By Shivali Thakur
    if (textId == "tblUldRepairRecordAppendGrid_ItemName_1") {
        try {
            cfi.setFilter(filterEmbargo, "ULDType", "eq", $("span[id='ULDType']").text());
            cfi.setFilter(filterEmbargo, "ULDType", "eq", "BOTH")
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp) {
        }
    }
    if (textId == "Text_ULDNo") {
        try {
            cfi.setFilter(filterEmbargo, "Scrape", "eq", 0)
            cfi.setFilter(filterEmbargo, "IsDamage", "eq", 1)
            cfi.setFilter(filterEmbargo, "CurrentCityCode", "eq", userContext.CityCode)
            cfi.setFilter(filterEmbargo, "IsServiceable", "eq", 0)
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp) {
        }
    }

    if (textId == "Text_ULDVendor") {
        try {
            cfi.setFilter(filterEmbargo, "CustomerTypeName", "eq", "ULD VENDOR")
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp) {
        }
    }
    if (textId == "Text_AuthorizedPerson") {
        try {
            cfi.setFilter(filterEmbargo, "CustomerSNo", "eq", $('#ULDVendor').val())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp) {
        }
    }

    if (textId.indexOf("tblUldRepairRecordAppendGrid_ItemName_") >= 0) {
        var PartName = 0;
        $("tr[id^='tblUldRepairRecordAppendGrid_Row_']").each(function (row, tr) {
            PartName = PartName + ',' + $(tr).find("input[id^='tblUldRepairRecordAppendGrid_HdnItemName_']").val();
        });
        var PartNameilter = cfi.getFilter("AND");
        cfi.setFilter(PartNameilter, "SNo", "notin", PartName);
        //  cfi.setFilter(UldTypeFilter, "AirlineSno", "eq", 1);
        filterReqTo = cfi.autoCompleteFilter(PartNameilter);
        return filterReqTo;
    }

    if (textId.indexOf("tblUldRepairRecordAppendGridCost_ItemName_") >= 0) {
        var CPartName = 0;
        $("tr[id^='tblUldRepairRecordAppendGridCost_Row_']").each(function (row, tr) {
            CPartName = CPartName + ',' + $(tr).find("input[id^='tblUldRepairRecordAppendGridCost_HdnItemName_']").val();
        });
        var CPartNameilter = cfi.getFilter("AND");
        cfi.setFilter(CPartNameilter, "SNo", "notin", CPartName);
        //  cfi.setFilter(UldTypeFilter, "AirlineSno", "eq", 1);
        filterReqTo = cfi.autoCompleteFilter(CPartNameilter);
        return filterReqTo;
    }
    if (textId.indexOf("tblUldRepairRecordAppendGridCost_ItemDescription_") >= 0) {
        var DCPartName = 0;
        $("tr[id^='tblUldRepairRecordAppendGridCost_Row_']").each(function (row, tr) {
            DCPartName = DCPartName + ',' + $(tr).find("input[id^='tblUldRepairRecordAppendGridCost_HdnItemDescription_']").val();
        });
        var CPartNameilter = cfi.getFilter("AND");
        cfi.setFilter(CPartNameilter, "SNo", "notin", DCPartName);
        //  cfi.setFilter(UldTypeFilter, "AirlineSno", "eq", 1);
        filterReqTo = cfi.autoCompleteFilter(CPartNameilter);
        return filterReqTo;
    }

    if ($('span[id="ULDType"]').text() != "") {
        if (textId == "Text_MaintenanceType") {
            try {
                cfi.setFilter(filterEmbargo, "UldType", "eq", $('span[id="ULDType"]').text())
                var OriginCityAutoCompleteFilter3 = cfi.autoCompleteFilter([filterEmbargo]);
                return OriginCityAutoCompleteFilter3;
            }
            catch (exp) {
            }
        }
        if (textId == "Text_AdditionalMaintenanceType") {
            try {
                cfi.setFilter(filterEmbargo, "UldType", "eq", $('span[id="ULDType"]').text())
                var OriginCityAutoCompleteFilter3 = cfi.autoCompleteFilter([filterEmbargo]);
                return OriginCityAutoCompleteFilter3;
            }
            catch (exp) {
            }
        }
    }
    else {
        if (textId == "Text_MaintenanceType") {
            try {
                cfi.setFilter(filterEmbargo, "UldType", "eq", "")
                var OriginCityAutoCompleteFilter3 = cfi.autoCompleteFilter([filterEmbargo]);
                return OriginCityAutoCompleteFilter3;
            }
            catch (exp) {
            }
        }
        if (textId == "Text_AdditionalMaintenanceType") {
            try {
                cfi.setFilter(filterEmbargo, "UldType", "eq", "")
                var OriginCityAutoCompleteFilter3 = cfi.autoCompleteFilter([filterEmbargo]);
                return OriginCityAutoCompleteFilter3;
            }
            catch (exp) {
            }
        }
    }

}

function CheckContainer(valueId, value, keyId, key) {
    if (key) {
        $.ajax({
            url: "Services/ULD/ULDRepairService.svc/CheckContainer?ULDSNo=" + key, async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                var ULDTypeTable = jQuery.parseJSON(result).Table0[0].ULDType;
                if (ULDTypeTable.trim() != "0" && ULDTypeTable.trim() != "1") {
                    ShowMessage('info', 'ULD Repair!', ULDTypeTable);
                    $('#Text_ULDNo').val('');
                    $('#ULDNo').val('');
                    return;
                }
                $('span[id="ULDType"]').text((ULDTypeTable == "0" ? 'CONTAINER' : (ULDTypeTable == "1" ? 'PALLET' : '')));
                $('input[id="ULDVendor"]').val(jQuery.parseJSON(result).Table0[0].Csno);
                $('input[id="Text_ULDVendor"]').val(jQuery.parseJSON(result).Table0[0].Cname);
                //$("#ULDType").closest('td').append('<label id="ULDTypeC">' + (ULDTypeTable == "0" ? 'Container' : (ULDTypeTable == "1" ? 'Pallet' : '')) + ' </label>');
                //$('#ULDType').remove();
                var masterTblSNo = parseInt(ULDTypeTable) == 0 ? 2 : parseInt(ULDTypeTable);
                if ($("input[name^=Repair]:checked").val() == 0) {
                    CreateAppenGrid(masterTblSNo, "GetULDRepairableItem");
                }
            },
            error: function (xhr) {
                var a = "";

            }
        })
    }
}

function Save() {
    var Keycolumn = 'Text_ULDNo';
    var Keycolumnsno = "";
    var Keycolumnval = $("#" + Keycolumn).val();
    AuditLogSaveNewValue("tbl", true, "", Keycolumn || '', Keycolumnval || '', '' || '', 'NEW', userContext.TerminalSNo, userContext.NewTerminalName);

    if (!cfi.IsValidSection('divUldRepairRecord')) {
        return;
    }
    else {
        if ($("input[name^=Repair]:checked").val() != 1) {
            if ($("tr[id^='tblUldRepairRecordAppendGrid_Row']").length == 0) {
                ShowMessage('warning', 'warning - Uld Repair', "Please Add Any One (Inspection Check List)", "bottom-right");
                return false;
            }
        }

        cfi.IsValidSubmitSection();
        if ($("input[name^=Repair]:checked").val() == "0") {
            var rows = $("tr[id^='tblUldRepairRecordAppendGrid']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
            for (var i = 0; i < rows.length; i++) {
                if (!validateTableData("tblUldRepairRecordAppendGrid", rows[i])) {
                    return false;
                }
            }
            getUpdatedRowIndex(rows.join(","), "tblUldRepairRecordAppendGrid");
        }

        var ULDSNo = $('#ULDNo').val();
        var Repair = $("input[name^=Repair]:checked").val();
        var MaintenanceType = $('#MaintenanceType').val();
        var TypeOfAdditionalMaintenance = $('#AdditionalMaintenanceType').val();
        var ULDVendor = $('#ULDVendor').val();
        var AuthorizedPerson = $('#AuthorizedPerson').val();
        var AirportSNo = userContext.AirportSNo;

        var strData = [];

        if (Repair == "1") {
            var Data =
                {
                    SNo: "0",
                    Condition: "0",
                    Remarks: "AAANODATAAA"
                }
            strData.push(Data)
            strData = JSON.stringify(strData);
        }
        else {
            strData = $('#tblUldRepairRecordAppendGrid').appendGrid('getStringJson');
        }

        $.ajax({
            url: "Services/ULD/ULDRepairService.svc/SaveULDRepair", async: true, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ ULDSNo: ULDSNo, Repair: Repair, MaintenanceType: MaintenanceType, ULDVendor: ULDVendor, AuthorizedPerson: AuthorizedPerson, AirportSNo: AirportSNo, strData: btoa(strData), TypeOfAdditionalMaintenance: TypeOfAdditionalMaintenance }), //added IncidentCategorySNo
            success: function (response) {
                var abc = response[0];
                if (response == "3") {
                    ShowMessage('warning', 'Warning - Uld Repair', "Already send to repair : " + $("#Text_ULDNo").val() + "", "bottom-right");
                    return;
                } else {
                    ShowMessage('success', 'Success!', "Saved Successfully");
                    CleanUI();
                    MasterULDRepair()
                }

                //navigateUrl('Default.cshtml?Module=ULD&Apps=ULD&FormAction=EDIT&RecID=' + abc);
            },
            error: function (er) {
                debugger
            }
        });
    }
}

function UpdateULDRepair(ULDRepairSNo) {
    var Keycolumn = 'Text_ULDNo';
    var Keycolumnval = $("#" + Keycolumn).val();
    AuditLogSaveNewValue("tbl", true, "", Keycolumn || '', Keycolumnval || '', ULDRepairSNo || '', 'EDIT', userContext.TerminalSNo, userContext.NewTerminalName);

    if (ULDRepairSNo) {

        if (!cfi.IsValidSection('divUldRepairRecord')) {
            return;
        }
        else {
            cfi.IsValidSubmitSection();
            var rows = $("tr[id^='tblUldRepairRecordAppendGrid']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
            for (var i = 0; i < rows.length; i++) {
                if (!validateTableData("tblUldRepairRecordAppendGrid", rows[i])) {
                    return false;
                }
            }
            getUpdatedRowIndex(rows.join(","), "tblUldRepairRecordAppendGrid");

            var strData = $('#tblUldRepairRecordAppendGrid').appendGrid('getStringJson');

            var ULDSNo = $('#ULDNo').val();
            var Repair = $("input[name^=Repair]:checked").val();
            var MaintenanceType = $('#MaintenanceType').val();
            var TypeOfAdditionalMaintenance = $('#AdditionalMaintenanceType').val();
            var ULDVendor = $('#ULDVendor').val();
            var AuthorizedPerson = $('#AuthorizedPerson').val();
            var AirportSNo = userContext.AirportSNo;

            $.ajax({
                url: "Services/ULD/ULDRepairService.svc/UpdateULDRepair", async: true, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ ULDSNo: ULDSNo, Repair: Repair, MaintenanceType: MaintenanceType, ULDVendor: ULDVendor, AuthorizedPerson: AuthorizedPerson, AirportSNo: AirportSNo, ULDRepairSNo: ULDRepairSNo, strData: btoa(strData), TypeOfAdditionalMaintenance: TypeOfAdditionalMaintenance }), //added IncidentCategorySNo
                success: function (response) {
                    var abc = response[0];
                    ShowMessage('success', 'Success!', "Updated Successfully");
                    CleanUI();
                    MasterULDRepair()
                    //navigateUrl('Default.cshtml?Module=ULD&Apps=ULD&FormAction=EDIT&RecID=' + abc);
                },
                error: function (er) {
                    debugger
                }
            });
        }
    }
}

function UpdateQuoteULDRepair(ULDRepairSNo) {
    var k = ''; var L = ''; var M = '';
    for (var i = 0; i < $("ul#addlist2 li").text().split(' ').length - 1; i++) { L = L + $("ul#addlist2 li span").text().split(' ')[i] + ','; }
    $("#AlertMailCostApproval").val(L.substring(0, L.length - 1));
    if ($('#AlertMailCostApproval').val().length == 0) {
        ShowMessage('warning', '', "Email Address is Mandatory", "bottom-right");
        return false;
    }

    if (ULDRepairSNo) {
        if ($("#ManhoursCost").val() == "" || $("#ManhoursCost").val() == "0") {
            ShowMessage('warning', 'warning - Uld Repair', "Please create man hours cost!", "bottom-right");
            return false;
        }
        if ($("input[name^=Repair]:checked").val() != 1) {
            if ($("tr[id^='tblUldRepairRecordAppendGridCost_Row']").length == 0) {
                ShowMessage('warning', 'warning - Uld Repair', "Please Add Any One (Cost Approval)", "bottom-right");
                return false;
            }
        }

        var AirportSNo = userContext.AirportSNo.toString().trim();
        var rows = $("tr[id^='tblUldRepairRecordAppendGridCost']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
        for (var i = 0; i < rows.length; i++) {
            if (!validateTableData("tblUldRepairRecordAppendGridCost", rows[i])) {
                return false;
            }
        }
        getUpdatedRowIndex(rows.join(","), "tblUldRepairRecordAppendGridCost");
        var CoststrData = ""//$('#tblUldRepairRecordAppendGridCost').appendGrid('getStringJson');

        var ULDTypesarray = [];
        var arrVal = [];
        $("tr[id^='tblUldRepairRecordAppendGridCost']").each(function (row, tr) {
            var ULDRepairMaterial = $(tr).find("input[id^='tblUldRepairRecordAppendGridCost_HdnItemName_']").val();
            if (ULDRepairMaterial == 'undefined' || ULDRepairMaterial == '') {
                ULDRepairMaterial = $(tr).find("input[id^='tblUldRepairRecordAppendGridCost_ULDRepairMaterialSNo_']").val();
            }
            var UldTypeViewModel =
                {
                    ULDRepairMaterialSNo: ULDRepairMaterial.trim(),
                    ULDRepairSNo: ULDRepairSNo.trim(),
                    Qty: $(tr).find("input[id^='tblUldRepairRecordAppendGridCost_Qty_']").val().trim(),
                    MaterialPrice: $(tr).find("label[id^='tblUldRepairRecordAppendGridCost_MaterialPrice_']").text().trim(),
                    TotalCost: $(tr).find("label[id^='tblUldRepairRecordAppendGridCost_TotalCost_']").text().trim(),
                }
            ULDTypesarray.push(UldTypeViewModel);
        });
        var ManhoursCost = $("#ManhoursCost").val().trim();
        var AlertMailCostApproval = $("#AlertMailCostApproval").val().trim();
        $.ajax({
            url: "Services/ULD/ULDRepairService.svc/UpdateQuoteULDRepair", async: true, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ MaterialCost: '', ManhoursCost: ManhoursCost, AirportSNo: AirportSNo, ULDRepairSNo: ULDRepairSNo, AlertMailCostApproval: AlertMailCostApproval, ULDRepairItem: ULDTypesarray, strData: btoa(CoststrData) }), //added IncidentCategorySNo
            success: function (response) {
                var result = response[0];
                if (result == "0") {
                    var rowcount = $('#tblUldRepairRecordAppendGridCost tbody tr').length;
                    var c = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "ULDRepair", ColumnName: 'Alert Email (Q)', OldValue: $("#divmailAdds li span").attr("oldvalue"), NewValue: $("#divmailAdds li span").text() };
                    arrVal.push(c);
                    for (var i = 1; i <= rowcount; i++) {
                        $("#tblUldRepairRecordAppendGridCost_ItemName_" + i).attr("newvalue", $("#tblUldRepairRecordAppendGridCost_ItemName_" + i).val())
                        $("#tblUldRepairRecordAppendGridCost_ItemDescription_" + i).attr("newvalue", $("#tblUldRepairRecordAppendGridCost_ItemDescription_" + i).val())
                        $("#tblUldRepairRecordAppendGridCost_Qty_" + i).attr("newvalue", $("#tblUldRepairRecordAppendGridCost_Qty_" + i).val())

                        var oldval = $("#tblUldRepairRecordAppendGridCost_ItemName_" + i).attr("oldvalue") + "/" + $("#tblUldRepairRecordAppendGridCost_ItemDescription_" + i).attr("oldvalue") + "/" + $("#tblUldRepairRecordAppendGridCost_Qty_" + i).attr("oldvalue") + "/";;
                        var newval = $("#tblUldRepairRecordAppendGridCost_ItemName_" + i).attr("newvalue") + "/" + $("#tblUldRepairRecordAppendGridCost_ItemDescription_" + i).attr("newvalue") + "/" + $("#tblUldRepairRecordAppendGridCost_Qty_" + i).attr("newvalue") + "/";

                        if (oldval != "" && newval != "") {

                            var a = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "ULDRepair", ColumnName: 'Cost Approval-' + i + '(Q)', OldValue: oldval, NewValue: newval };
                            arrVal.push(a);
                        }
                        else if (oldval == "" && newval != "") {

                            var a = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "ULDRepair", ColumnName: 'Cost Approval-' + i + '(Q)', OldValue: oldval, NewValue: newval };
                            arrVal.push(a);
                        }
                    }
                    SaveAppendGridAuditLog("ULD Number", uldno, ULDRepairSNo, JSON.stringify(arrVal), "Edit", userContext.TerminalSNo, userContext.NewTerminalName);

                    ShowMessage('success', 'Success!', "Updated Successfully");
                    CleanUI();
                    MasterULDRepair()
                }
                if (result == "1") {
                    ShowMessage('info', 'ULD Repair Quote!', 'ULD is Approved now Quote can not be Update ', "bottom-right");
                    CleanUI();
                    MasterULDRepair()
                }
                //navigateUrl('Default.cshtml?Module=ULD&Apps=ULD&FormAction=EDIT&RecID=' + abc);
            },
            error: function (er) {
                debugger
            }
        });

    }
}

function UpdateApprovedULDRepair(ULDRepairSNo) {
    var arrVal = [];
    var k = ''; var L = ''; var M = '';
    for (var i = 0; i < $("ul#addlist1 li").text().split(' ').length - 1; i++) { L = L + $("ul#addlist1 li span").text().split(' ')[i] + ','; }
    $("#AlertEmail").val(L.substring(0, L.length - 1));
    if ($('#AlertEmail').val().length == 0) {
        ShowMessage('warning', '', "Email Address is Mandatory", "bottom-right");

        return false;
    }

    if (ULDRepairSNo) {
        if (!cfi.IsValidSection('divUldRepairRecord')) {
            return;
        }
        var ULDTypesarray = [];
        $("tr[id^='tblUldRepairRecordAppendGridApproval']").each(function (row, tr) {
            var UldTypeViewModel =
                {
                    ULDRepairMaterialSNo: $(tr).find("input[id^='tblUldRepairRecordAppendGridApproval_SNo_']").val(),
                    ULDRepairSNo: ULDRepairSNo,
                    IsApproval: $(tr).find("input[id^='tblUldRepairRecordAppendGridApproval_IsApproval_']").is(':checked') ? 1 : 0,
                }
            ULDTypesarray.push(UldTypeViewModel);
        });

        var AdULDTypesarray = [];
        $("tr[id^='tblUldRepairRecordAppendGridApprovals']").each(function (row, tr) {

            var AUldTypeViewModel =
                {
                    AULDRepairMaterialSNo: $(tr).find("input[id^='tblUldRepairRecordAppendGridApprovals_SNo_']").val(),
                    //ULDRepairSNo: ULDRepairSNo,
                    AIsApproval: $(tr).find("input[id^='tblUldRepairRecordAppendGridApprovals_IsApproval_']").is(':checked') ? 1 : 0,
                }
            AdULDTypesarray.push(AUldTypeViewModel);
        });

        var Remarks = $('#Remarks').val();
        var AirportSNo = userContext.AirportSNo;
        var AlertEmail = $("#AlertEmail").val();
        $.ajax({
            url: "Services/ULD/ULDRepairService.svc/UpdateApprovedULDRepair", async: true, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ Approved: "", Remarks: Remarks, AlertEmail: AlertEmail, AirportSNo: AirportSNo, ULDRepairSNo: ULDRepairSNo, ULDRepairItem: ULDTypesarray, ULDRepairMainHourItem: AdULDTypesarray }),
            success: function (response) {
                var Table = jQuery.parseJSON(response).Table0[0];
                var abc = response[0];
                if (jQuery.parseJSON(response).Table0[0].Message) {
                    ShowMessage('info', 'ULD Repair!', jQuery.parseJSON(response).Table0[0].Message, "bottom-right");
                }
                else {

                    var c = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "ULDRepair", ColumnName: 'Alert Email(A)', OldValue: "", NewValue: $("#addlist1 li span").text() };
                    arrVal.push(c);
                    var a = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "ULDRepair", ColumnName: 'Remarks(A)', OldValue: "", NewValue: $("#Remarks").val() };
                    arrVal.push(a);
                    var rowcount = $('#tblUldRepairRecordAppendGridApprovals tbody tr').length;
                    for (var i = 1; i <= rowcount; i++) {

                        var v = $('#tblUldRepairRecordAppendGridApprovals_IsApproval_' + i).is(':checked');
                        if (v == true) {
                            var c = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "ULDRepair", ColumnName: 'Maintenance Cost Approval' + '-' + i + '(A)', OldValue: "", NewValue: 'Approved' };
                            arrVal.push(c);
                        }
                    }



                    var rowcount1 = $('#tblUldRepairRecordAppendGridApproval tbody tr').length;
                    for (var i = 1; i <= rowcount1; i++) {

                        var v = $('#tblUldRepairRecordAppendGridApproval_IsApproval_' + i).is(':checked');
                        if (v == true) {
                            var d = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "ULDRepair", ColumnName: 'Material Cost Approval' + '-' + i + '(A)', OldValue: "", NewValue: 'Approved' };
                            arrVal.push(d);
                        }
                    }

                    SaveAppendGridAuditLog("ULD Number", uldno, ULDRepairSNo, JSON.stringify(arrVal), "Edit", userContext.TerminalSNo, userContext.NewTerminalName);


                    ShowMessage('success', 'Success!', "ULD approved successfully");
                }
                CleanUI();
                MasterULDRepair()
            },
            error: function (er) {
            }
        });

    }
}
$(document).on('click', '#Invoice', function () {
    if ($("input[name='Invoice']:checked").val() == "0") {
        ShowMessage('info', 'Invoice!', 'Please Upload Invoice!', "bottom-right");
        $('#Invoice[value="1"]').attr('Checked', 'True');
    }
});
function UpdateReturnULDRepair(ULDRepairSNo) {
    if (ULDRepairSNo) {
        var repval = '';
        var Invval = '';
        var sval = '';
        if (!cfi.IsValidSection('divUldRepairRecord')) {
            return;
        }
        else {

            var Repaired = $("input[name^=Repaired]:checked").val();//== 0 ? 1 : 0;
            if (Repaired == 0) {
                repval = 'Yes';
            }
            else {
                repval = 'No';
            }

            //if ($("#DownloadInvoice").text() == "") {
            //    $('#Invoice[value="1"]').attr('Checked', 'True');
            //} else {
            //    $('#Invoice[value="0"]').attr('Checked', 'True');
            //}
            var arrVal = [];
            var Invoice = $("input[name^=Invoice]:checked").val() == "0" ? "1" : "0";
            if (Invoice == 1) {
                Invval = 'Yes';
            }
            else {
                Invval = 'No';
            }
            var Date = $("#Invoicedate").val();

            var ReturnRemarks = $('#ReturnRemarks').val();
            var Serviceable = $("input[name^=Serviceable]:checked").val() == 0 ? 1 : 0;
            if (Serviceable == 1) {
                sval = 'Yes';
            }
            else {
                sval = 'No';
            }
            var AirportSNo = userContext.AirportSNo;
            var ULDRepairReturnImage = "ULDRepairReturnImage";
            var ULDRepairReturnInvoice = 'ULDRepairReturnInvoice';

            $.ajax({
                url: "Services/ULD/ULDRepairService.svc/UpdateReturnULDRepair", async: true, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
                data: JSON.stringify({
                    Repaired: Repaired, ReturnRemarks: ReturnRemarks, Serviceable: Serviceable, AirportSNo: AirportSNo, ULDRepairSNo: ULDRepairSNo
                    , ULDRepairReturnImage: ULDRepairReturnImage, ULDRepairReturnInvoice: ULDRepairReturnInvoice, Invoice: Invoice, Date: Date
                }), //added IncidentCategorySNo
                success: function (response) {
                    var result = response[0];
                    if (result == "0") {
                        var d = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "ULDRepair", ColumnName: 'Repaired', OldValue: "", NewValue: repval };
                        arrVal.push(d);
                        var f = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "ULDRepair", ColumnName: 'Remarks', OldValue: "", NewValue: $('#ReturnRemarks').val() };
                        arrVal.push(f);
                        var g = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "ULDRepair", ColumnName: 'Serviceable', OldValue: "", NewValue: sval };
                        arrVal.push(g);
                        var h = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "ULDRepair", ColumnName: 'Invoice', OldValue: "", NewValue: Invval };
                        arrVal.push(h);
                        var n = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "ULDRepair", ColumnName: 'Invoice Date', OldValue: "", NewValue: Date };
                        arrVal.push(n);
                        SaveAppendGridAuditLog("ULD Number", uldno, ULDRepairSNo, JSON.stringify(arrVal), "Edit", userContext.TerminalSNo, userContext.NewTerminalName);

                        ShowMessage('success', 'Success!', "Updated Successfully");
                        CleanUI();
                        MasterULDRepair()
                    }
                    if (result == "1") {
                        ShowMessage('info', 'ULD Repair Quote!', 'ULD is already returned now can not be Return again ', "bottom-right");
                        CleanUI();
                        MasterULDRepair()
                    }
                    if (result == "3") {
                        ShowMessage('Success', 'Success!', 'Invoice Updated Successfully');
                        CleanUI();
                        MasterULDRepair()
                    }

                },
                error: function (er) {
                    debugger
                }
            });
        }
    }
}
var IsApprovedCheck = "";
function BindEvents(obj, e, isdblclick) {
    $('#btnSave').hide();
    if (e != undefined) {
        var SubProcessRepair = $(obj).attr("process").toUpperCase();

        if (SubProcessRepair.trim() == "RETURNULDREPAIR") {
            var ApproveCheck = GetApproveCheck(obj, e, isdblclick)
            if (ApproveCheck.trim() == "False") {
                ShowMessage('info', 'Approval is pending', "Approval is pending.!", "bottom-right");
                return;
            }
            var GetInvoice = GetInvoiceCheck(obj, e, isdblclick)
            if (GetInvoice.trim() == "False") {
                ShowMessage('info', 'Cost Approval invoice not generated.', "Cost Approval invoice not generated.!", "bottom-right");
                return;
            }
        }
    }

    if (!e) {
        ULDRepairSNo = $(obj).attr('href').split('=')[1];
        $.ajax({
            url: "Services/ULD/ULDRepairService.svc/GetULDRepairVE?ULDRepairSNo=" + ULDRepairSNo, async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var ULDRepairtbl = jQuery.parseJSON(result).Table0[0]
                if (obj.textContent == "Read") {
                    currentprocess = "VIEWULDREPAIR";
                }
                else {
                    if (ULDRepairtbl.IsQuoted == "Y") {
                        currentprocess = "VIEWULDREPAIR";
                    }
                    else {
                        currentprocess = "ULDREPAIRUPDATE";
                    }
                }
                if (ULDRepairtbl.RepairOrScrap == "F") {
                    RepairOrScrap = "False";
                }
                else {
                    RepairOrScrap = "True";
                    currentprocess = "VIEWULDREPAIR";
                }
                PageRightsCheck()
            }
        });

    }
    else {
        var subprocess = $(obj).attr("process").toUpperCase();
        var subprocesssno = $(obj).attr("subprocesssno").toUpperCase();
        currentprocess = subprocess;
        ULDRepairSNo = $(obj).closest('tr').find('td[data-column="ULDRepairSNo"]').text();
        RepairOrScrap = $(obj).closest('tr').find('td[data-column="RepairOrScrap"]').text();
        IsApproved = $(obj).closest('tr').find('td[data-column="IsApproved"]').text();
    }
    if (currentprocess == "VIEWULDREPAIR") {
        $('#btnUpdate').hide();
        $('#btnQuoteUpdate').hide();
        $('#btnApprovedUpdate').hide();
        $('#btnApprovePrint').hide();

        $('#btnReturnUpdate').hide();
        CleanUI();
        var module = "ULD";
        $.ajax({
            url: "Services/ULD/ULDRepairService.svc/GetWebForm/" + _CURR_PRO_ + "/" + module + "/ViewULDRepair/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $('#divUldRepairRecord').remove();
                $("#divULDRepairDetails").append("<div id='divUldRepairRecord' style='width:100%'><table id='tblUldRepairRecord' style='width:100%'></table></div>");
                $("#tblUldRepairRecord").html(result);
                if (result != undefined || result != "") {
                    BindULDRepair(ULDRepairSNo, "V", RepairOrScrap, obj)
                }
                PageRightsCheck()
            }
        });
    }
    else if (currentprocess == "ULDREPAIRUPDATE") {
        CleanUI();
       
        var qstatus = ULDQuoteCheck(obj);
        if (qstatus == 0) {
            $("#btnUpdate").show();
           
        }
        else {
            $("#btnUpdate").hide();
        }
        $('#btnQuoteUpdate').hide();
        $('#btnApprovedUpdate').hide();
        $('#btnApprovePrint').hide();

        $('#btnReturnUpdate').hide();
        var module = "ULD";
        $.ajax({
            url: "Services/ULD/ULDRepairService.svc/GetWebForm/" + _CURR_PRO_ + "/" + module + "/EditULDRepair/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $('#divUldRepairRecord').remove();
                $("#divULDRepairDetails").append("<div id='divUldRepairRecord' style='width:100%'><table id='tblUldRepairRecord' style='width:100%'></table></div>");
                $("#tblUldRepairRecord").html(result);
                if (result != undefined || result != "") {
                    currentprocess = "ULDRepair";
                    cfi.AutoCompleteV2("ULDNo", "uldno,SNo", "ULD_UldNumber", CheckContainer, "contains");
                    cfi.AutoCompleteV2("ULDVendor", "Name,SNo", "ULD_UldVendor", null, "contains");
                    cfi.AutoCompleteV2("AuthorizedPerson", "Name,SNo", "ULD_Authorizeperson", null, "contains");
                    cfi.AutoCompleteV2("MaintenanceType", "MaintenanceType,SNo", "ULD_RepairMaintenanceType", null, "contains");
                    cfi.AutoCompleteV2("AdditionalMaintenanceType", "MaintenanceType,SNo", "ULD_RepairAdditionalMaintenanceType", null, "contains", ",");

                    BindULDRepair(ULDRepairSNo, "E", RepairOrScrap, obj)
                    $("#Text_ULDNo").data("kendoAutoComplete").enable(false);
                    $("#Text_ULDNo").removeAttr('required');
                    $("#Text_ULDVendor").data("kendoAutoComplete").enable(false);
                    $("#Text_ULDVendor").removeAttr('required');
                }
                PageRightsCheck()
            }
        });
    }
    else if (currentprocess == "QUOTEULDREPAIR") {

        var Scrap = ULDReapirScrapCheck(obj);
        if (Scrap == "1") {
            ShowMessage('info', 'ULD Scrap', "ULD Is Mark as Scrap.!", "bottom-right");
            return;
        }

        $('#btnUpdate').hide();
        $('#btnQuoteUpdate').show();
        $('#btnApprovedUpdate').hide();
        $('#btnApprovePrint').hide();

        $('#btnReturnUpdate').hide();

        CleanUI();
        var module = "ULD";
        $.ajax({
            url: "Services/ULD/ULDRepairService.svc/GetWebForm/" + _CURR_PRO_ + "/" + module + "/QuoteULDRepair/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {

                $('#divUldRepairRecord').remove();
                $("#divULDRepairDetails").append("<div id='divUldRepairRecord' style='width:100%'><table id='tblUldRepairRecord' style='width:100%'></table></div>");
                $("#tblUldRepairRecord").html(result);
                cfi.Numeric($(this).find("input[id^='ManhoursCost']").attr("id"), 3);
                if (result !== undefined || result != "") {
                    BindULDRepair(ULDRepairSNo, "Q", RepairOrScrap, obj)
                    BindMainCostHistory(ULDRepairSNo);
                    BindQuoteHistory(ULDRepairSNo);
                    $('#ManhoursCost').attr("readonly", "readonly")
                }

                if (IsApproved.trim() == "Y") {
                    $("#btnQuoteUpdate").hide()
                } else {
                    CreateAppenGridCostApproval(ULDRepairSNo, "GetULDRepairableItem", "")
                    setTimeout(function () {
                        $("tr[id^='tblUldRepairRecordAppendGridCost_Row_']").each(function (row, tr) {
                            var Sno = $(tr).find("input[id^='tblUldRepairRecordAppendGridCost_ULDRepairMaterialSNo_']").val();
                            $(tr).find("input[id^='tblUldRepairRecordAppendGridCost_HdnItemName_']").attr("value", Sno)
                            $(tr).find("input[id^='tblUldRepairRecordAppendGridCost_HdnItemDescription_']").attr("value", Sno)
                        });
                        GetManHoursCost(obj);
                    }, 1000)
                }
                PageRightsCheck()
            }
        });
        //  $("[name='ManhoursCost']").attr("disabled", "disabled");
    }
    else if (currentprocess == "APPROVEDULDREPAIR") {
        var Scrap = ULDReapirScrapCheck(obj);
        if (Scrap == "1") {
            ShowMessage('info', 'ULD Scrap', "ULD Is Mark as Scrap.!", "bottom-right");
            return;
        }


        $('#btnUpdate').hide();
        $('#btnQuoteUpdate').hide();
        $('#btnApprovedUpdate').show();
        $('#btnApprovePrint').show();

        $('#btnReturnUpdate').hide();
        CleanUI();
        var module = "ULD";
        $.ajax({
            url: "Services/ULD/ULDRepairService.svc/GetWebForm/" + _CURR_PRO_ + "/" + module + "/ApprovedULDRepair/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $('#divUldRepairRecord').remove();
                $("#divULDRepairDetails").append("<div id='divUldRepairRecord' style='width:100%'><table id='tblUldRepairRecord' style='width:100%'></table></div>");
                $("#tblUldRepairRecord").html(result);
                $("#ApprovedBy").closest("tr").find("td").hide();
                if (result != undefined || result != "") {
                    BindULDRepair(ULDRepairSNo, "A", RepairOrScrap, obj)
                }
                if (IsApproved.trim() == "Y") {
                    $("#btnApprovedUpdate").hide()
                    DisabledCheckBoxApproval()
                    DisabledCheckBoxApprovalForMainCost()
                }
                PageRightsCheck()
                // $('input[data-radioval="No"]').attr('checked', '');
                // $('input[data-radioval="Yes"]').attr('checked', 'true');
            }
        });

    }
    else if (currentprocess == "RETURNULDREPAIR") {

        var Scrap = ULDReapirScrapCheck(obj);
        if (Scrap == "1") {
            ShowMessage('info', 'ULD Scrap', "ULD Is Mark as Scrap.!", "bottom-right");
            return;
        }

        $('#btnUpdate').hide();
        $('#btnQuoteUpdate').hide();
        $('#btnApprovedUpdate').hide();
        $('#btnApprovePrint').hide();

        $('#btnReturnUpdate').show();
        CleanUI();
        var module = "ULD";
        $.ajax({
            url: "Services/ULD/ULDRepairService.svc/GetWebForm/" + _CURR_PRO_ + "/" + module + "/ReturnULDRepair/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $('#divUldRepairRecord').remove();
                $("#divULDRepairDetails").append("<div id='divUldRepairRecord' style='width:100%'><table id='tblUldRepairRecord' style='width:100%'></table></div>");
                $("#tblUldRepairRecord").html(result);
                $("input[name^=Repaired]").on("click", function () {
                    if ($("input[name^=Repaired]:checked").val() == 1) {
                        $('#Serviceable[value="1"]').attr('Checked', 'True');
                    }
                    else {
                        $('#Serviceable[value="0"]').attr('Checked', 'True');
                    }
                });
                $('#Invoice[value="1"]').attr('Checked', 'True');
                $("input[id^='UploadImage']").unbind("change").bind("change", function () {
                    UploadImage($(this).attr("id"), ULDRepairSNo, "ULDRepairReturnImage", "DownloadImage");
                });
                $("input[id^='UploadInvoice']").unbind("change").bind("change", function () {

                    UploadImage($(this).attr("id"), ULDRepairSNo, "ULDRepairReturnInvoice", "DownloadInvoice");
                    if ($("#DownloadInvoice").text() == "") {
                        $('#Invoice[value="1"]').attr('Checked', 'True');
                    } else {
                        $('#Invoice[value="0"]').attr('Checked', 'True');
                        $('#Invoice[value="1"]').attr('disabled', 'disabled');
                    }
                    var GetDate = $("#Invoicedate").val()
                    InvoiceDateCheck(GetDate)
                });

                $("#RepairedBy").closest("tr").find("td").hide();
                if (result != undefined || result != "") {
                    BindULDRepair(ULDRepairSNo, "R", RepairOrScrap, obj);
                    $("span[id^='DownloadImage']").unbind("click").bind("click", function () {
                        DownloadImage($(this).attr("id"), attchmntImageSNo, "ULDRepairReturn", "DownloadImage");
                    });
                    $("span[id^='DownloadInvoice']").unbind("click").bind("click", function () {
                        DownloadImage($(this).attr("id"), attchmntInvoiceSNo, "ULDRepairReturn", "DownloadInvoice");
                    });
                }
                PageRightsCheck()
            }
        });
    }
    else if (currentprocess == "PRINTULDREPAIR") {
        var Scrap = ULDReapirScrapCheck(obj);
        if (Scrap == "1") {
            ShowMessage('info', 'ULD Scrap', "ULD Is Mark as Scrap.!", "bottom-right");
            return;
        }

        $('#btnUpdate').hide();
        $('#btnQuoteUpdate').hide();
        $('#btnApprovedUpdate').hide();
        $('#btnApprovePrint').hide();

        $('#btnReturnUpdate').hide();
        CleanUI();
        $.ajax({
            url: "HtmlFiles/ULDREPAIR/ULDRepair.html",
            async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $('#divUldRepairRecordPrint').remove();
                $("#divULDRepairDetails").append("<div id='divUldRepairRecordPrint' style='width:100%'><table id='tblUldRepairRecordPrint' style='width:100%'></table></div>");
                $("#tblUldRepairRecordPrint").html(result);
                GetULDRepairPrintRecord(ULDRepairSNo);
                //
                PageRightsCheck()
                //$("#tblIrregularityReport").html(result);
                //GetDeliveryOrderPrint(IrregularitySNo)
                //var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                //var inventoryDate = new Date();
                //var CurrentDate = inventoryDate.getUTCDate() + "-" + (monthNames[inventoryDate.getUTCMonth()]) + "-" + inventoryDate.getUTCFullYear();
                //$("#spnDate1").text(CurrentDate);
                //$("#spnDate2").text(CurrentDate);
            }
        });
    }
}

function BindULDRepair(ULDRepairSNo, PageType, RepairOrScrap, obj) {
    var arrVal = [];
    $.ajax({
        url: "Services/ULD/ULDRepairService.svc/GetULDRepairInformation?ULDRepairSNo=" + ULDRepairSNo + "&PageType=" + PageType, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var ULDRepairtbl = jQuery.parseJSON(result).Table0[0]
            if (PageType == "V") {
                $('#divMainCostHistory').hide();
                $('span[id="ULDNo"]').text(ULDRepairtbl.Text_ULDNo.toUpperCase());
                $('span[id="ULDType"]').text(ULDRepairtbl.Text_ULDType.toUpperCase());
                $('span[id="Repair"]').text(ULDRepairtbl.Text_Repair.toUpperCase());
                $('span[id="MaintenanceType"]').text(ULDRepairtbl.Text_MaintenanceType.toUpperCase());
                $('span[id="AdditionalMaintenanceType"]').text(ULDRepairtbl.Text_TypeOfAdditionalMaintenance.toUpperCase());
                $('span[id="ULDVendor"]').text(ULDRepairtbl.Text_ULDVendor.toUpperCase());
                $('span[id="AuthorizedPerson"]').text(ULDRepairtbl.Text_AuthorizedPerson.toUpperCase());
                if (RepairOrScrap == "False") {
                    CreateAppenGrid(ULDRepairSNo, "GetFetchUldRepairableItem", PageType);
                }
                $('#divMainCostHistory').hide();
            }
            else if (PageType == "E") {
                $('#divMainCostHistory').hide();
                $('#ULDNo').val(ULDRepairtbl.ULDNo);
                $('#Text_ULDNo').val(ULDRepairtbl.Text_ULDNo);
                $('span[id="ULDType"]').text(ULDRepairtbl.Text_ULDType);
                ULDRepairtbl.Repair == "False" ? $('#Repair[value="0"]').attr('Checked', 'True') : $('#Repair[value="1"]').attr('Checked', 'True');
                $('#Text_MaintenanceType').val(ULDRepairtbl.Text_MaintenanceType);
                $('#MaintenanceType').val(ULDRepairtbl.MaintenanceType);
                $('#AdditionalMaintenanceType').val(ULDRepairtbl.TypeOfAdditionalMaintenance);
                $('#Text_AdditionalMaintenanceType').val(ULDRepairtbl.Text_TypeOfAdditionalMaintenance);
                $('#Text_ULDVendor').val(ULDRepairtbl.Text_ULDVendor);
                $('#ULDVendor').val(ULDRepairtbl.ULDVendor);
                $('#Text_AuthorizedPerson').val(ULDRepairtbl.Text_AuthorizedPerson);
                $('#AuthorizedPerson').val(ULDRepairtbl.AuthorizedPerson);
                //$('input[id="Repair"]').attr('disabled', 'true')
                $("input[id='Repair']").attr('disabled', true);
                cfi.BindMultiValue("AdditionalMaintenanceType", $("#Text_AdditionalMaintenanceType").val(), $("#AdditionalMaintenanceType").val());
                CreateAppenGrid(ULDRepairSNo, "GetFetchUldRepairableItem", PageType);
                setTimeout(function () {
                    $("tr[id^='tblUldRepairRecordAppendGrid_Row_']").each(function (row, tr) {
                        var Sno = $(tr).find("input[id^='tblUldRepairRecordAppendGrid_SNo_']").val();
                        $(tr).find("input[id^='tblUldRepairRecordAppendGrid_HdnItemName_']").attr("value", Sno)
                    });
                }, 1000)
            }
            else if (PageType == "Q") {
                $("#MaterialCost").show();

                $("#MaterialCost").attr("readonly", "readonly")
                $('#ManhoursCost').attr("readonly", "readonly")
                uldno = ULDRepairtbl.Text_ULDNo.toUpperCase();
                if (ULDRepairtbl) {
                    $('#ManhoursCost').val(ULDRepairtbl.ManHoursCost);
                    $('#_tempManhoursCost').val(ULDRepairtbl.ManHoursCost);
                    $("#MaterialCost").val(ULDRepairtbl.MaterialCost);

                    $('span[id="QuotedBy"]').text(ULDRepairtbl.FirstName);
                    $('span[id="QuotedOn"]').text(ULDRepairtbl.QuotedOn);
                    var textval = ULDRepairtbl.AlertMailCostApproval;
                    var l = textval.split(",").length;
                    if (textval != "") {
                        for (var jk = 0; jk < l; jk++) {
                            $("ul#addlist2").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + textval.split(',')[jk] + " </span><span id='" + jk + "' class='k-icon k-delete remove'></span></li>");
                        }
                        $("#AlertMailCostApproval").val("");
                        $("#AlertMailCostApproval").removeAttr("required");
                    }
                    $("#QuotedBy").closest("tr").find("td").show();
                }
                else {
                    $("#QuotedBy").closest("tr").find("td").hide();
                }

                $("#divmailAdds li span").attr("oldvalue", $("#divmailAdds li span").text());
                var rowcount = $('#tblUldRepairRecordAppendGridCost tbody tr').length;
                for (var i = 1; i <= rowcount; i++) {
                    $("#tblUldRepairRecordAppendGridCost_ItemName_" + i).attr("oldvalue", $("#tblUldRepairRecordAppendGridCost_ItemName_" + i).val())
                    $("#tblUldRepairRecordAppendGridCost_ItemDescription_" + i).attr("oldvalue", $("#tblUldRepairRecordAppendGridCost_ItemDescription_" + i).val())
                    $("#tblUldRepairRecordAppendGridCost_Qty_" + i).attr("oldvalue", $("#tblUldRepairRecordAppendGridCost_Qty_" + i).val())
                }

            }
            else if (PageType == "A") {
                CreateAppenGridApprovalForMainCost(ULDRepairSNo, "GetProcedureName", "")
                $("#divMainCostHistory").hide();
                setTimeout(function () {
                    $("#tblUldRepairRecordAppendGridApprovals_btnAppendRow").hide()
                    $("#tblUldRepairRecordAppendGridApprovals_btnRemoveLast").hide()
                    GetManHoursCost(obj)
                }, 500)
                CreateAppenGridApproval(ULDRepairSNo, "GetProcedureName", "")
                setTimeout(function () {
                    $("#tblUldRepairRecordAppendGridApproval_btnAppendRow").hide()
                    $("#tblUldRepairRecordAppendGridApproval_btnRemoveLast").hide()
                    GetManHoursCost(obj)
                }, 500)

                if (ULDRepairtbl) {
                    var textval1 = "";
                    var len = "";
                    //$('#ManhoursCost').val(ULDRepairtbl.ManHoursCost);
                    //$('#_tempManhoursCost').val(ULDRepairtbl.ManHoursCost);
                    $('#Remarks').val(ULDRepairtbl.ApprovedRemarks);
                    $('span[id="ApprovedBy"]').text(ULDRepairtbl.FirstName);
                    $('span[id="ApprovedOn"]').text(ULDRepairtbl.ApprovedOn);
                    var textval1 = ULDRepairtbl.AlertMail;
                    var len = textval1.split(",").length;
                    if (textval1 != "") {
                        for (var jk = 0; jk < len; jk++) {
                            $("ul#addlist1").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + textval1.split(',')[jk] + " </span><span id='" + jk + "' class='k-icon k-delete remove'></span></li>");
                        }

                        $("#AlertEmail").val("");
                        $("#AlertEmail").removeAttr("required");
                    }
                    $("#ApprovedBy").closest("tr").find("td").show();
                }
                else {
                    $("#ApprovedBy").closest("tr").find("td").hide();
                    $('#btnApprovePrint').hide();

                }
            }
            else if (PageType == "R") {

                if (ULDRepairtbl) {

                    if (ULDRepairtbl.IsRepaired == "False") {
                        $('input[data-radioval="No"][name="Repaired"]').attr('checked', true)
                        $("#btnReturnUpdate").hide();
                    } else {

                        $('input[data-radioval="Yes"][name="Repaired"]').attr('checked', true)
                    }

                    if (ULDRepairtbl.IsServiceable == "False") {

                        $('input[data-radioval="No"][name="Serviceable"]').attr('checked', true)
                    } else {

                        $('input[data-radioval="Yes"][name="Serviceable"]').attr('checked', true)
                    }

                    if (ULDRepairtbl.IsinvoiceRcvd == "False") {
                        $('input[data-radioval="No"][name="Invoice"]').attr('checked', true)
                    } else {
                        $('input[data-radioval="Yes"][name="Invoice"]').attr('checked', true)
                        $('input[data-radioval="No"][name="Invoice"]').attr('disabled', 'disabled')
                    }
                    if (ULDRepairtbl.IsinvoiceRcvdDate != "") {
                        $("#Invoicedate").val(ULDRepairtbl.IsinvoiceRcvdDate)
                    }

                    //  ULDRepairtbl.IsRepaired == "False" ? $('#Repaired[value="0"]').attr('Checked', 'True') : $('#Repaired[value="1"]').attr('Checked', 'True');
                    // ULDRepairtbl.IsServiceable == "False" ? $('#Serviceable[value="0"]').attr('Checked', 'True') : $('#Serviceable[value="1"]').attr('Checked', 'True');
                    $('#ReturnRemarks').val(ULDRepairtbl.RepairedRemarks);
                    $('span[id="RepairedOn"]').text(ULDRepairtbl.RepairedDate);
                    $('span[id="RepairedBy"]').text(ULDRepairtbl.FirstName);
                    $("#RepairedBy").closest("tr").find("td").show();
                }
                attchmntImageSNo = 0;
                attchmntInvoiceSNo = 0;
                if (jQuery.parseJSON(result).Table1[0]) {
                    for (var i = 0; i < 2; i++) {
                        if (jQuery.parseJSON(result).Table1[i]) {
                            if (jQuery.parseJSON(result).Table1[i].ULDRepairTypeDownload == "ULDRepairReturnImage") {
                                $("span[id^='DownloadImage']").text(jQuery.parseJSON(result).Table1[i].ImageName);
                                attchmntImageSNo = jQuery.parseJSON(result).Table1[i].attchmntSNo
                            }
                            else if (jQuery.parseJSON(result).Table1[i].ULDRepairTypeDownload == "ULDRepairReturnInvoice") {
                                $("span[id^='DownloadInvoice']").text(jQuery.parseJSON(result).Table1[i].ImageName);
                                attchmntInvoiceSNo = jQuery.parseJSON(result).Table1[i].attchmntSNo
                            }
                        }
                    }
                }
                if (!ULDRepairtbl && !jQuery.parseJSON(result).Table1[0]) {
                    $("#RepairedBy").closest("tr").find("td").hide();
                }
            }


        },
        error: {
        }
    });
}
function CreateAppenGrid(masterTblSNo, GetProcedureName, PageType) {
    $('#divUldRepairRecordAppendGrid').remove();
    $("#divUldRepairRecord").append("<div id='divUldRepairRecordAppendGrid' style='width:100%'><table id='tblUldRepairRecordAppendGrid' style='width:100%'></table></div>");
    $("#tblUldRepairRecordAppendGrid").appendGrid({
        tableID: "tblUldRepairRecordAppendGrid",
        contentEditable: true,
        isGetRecord: true,
        tableColume: "SNo,Description,Condition,Remarks",
        masterTableSNo: masterTblSNo,
        currentPage: 1, itemsPerPage: 5, whereCondition: PageType, sort: "",
        servicePath: "./Services/ULD/UldRepairService.svc",
        getRecordServiceMethod: GetProcedureName,
        caption: "Inspection Check List",
        initRows: 1,
        columns: [
            { name: "SNo", type: "hidden", },
            PageType == "V" ? { name: "ItemName", display: "Item Name", type: "label", ctrlCss: { width: "60px" }, value: 0 } : {
                name: 'ItemName', display: 'Item Name', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }
                , onChange: function (evt, rowIndex) {
                }, isRequired: false, AutoCompleteName: 'ULD_RepairItemNo', filterField: 'ItemName', filterCriteria: "contains", isRequired: true
            },
            PageType == "V" ? { name: "Condition", display: "Condition", type: "label", ctrlCss: { width: "100px" }, isRequired: false } : {
                name: "Condition", display: "Condition", type: "select", ctrlAttr: { maxlength: 100 }, ctrlOptions: { 1: "Damage", 2: "Good" }, ctrlCss: { width: "100px" }, isRequired: true, onChange: function (evt, rowIndex) {
                }
            },
            { name: "Remarks", display: "Remarks", type: PageType == "V" ? "label" : "text", ctrlAttr: { controltype: 'alphanumericupper', maxlength: 200, }, ctrlCss: { width: "242px" }, isRequired: PageType == "V" ? false : true }],

        isPaging: false,
        hideButtons: { updateAll: true, insert: true, remove: true, append: false, removeLast: false },
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            if (PageType == "V") {

                $("#tblUldRepairRecordAppendGrid_btnAppendRow").hide()
                $("#tblUldRepairRecordAppendGrid_btnRemoveLast").hide()
            } else if (PageType == "E") {
                $("#tblUldRepairRecordAppendGrid_btnAppendRow").show()
                $("#tblUldRepairRecordAppendGrid_btnRemoveLast").show()
            }
        },
    });
}
// Pankaj Kumar Ishwar on 09-12-2017
function CreateAppenGridCostApproval(masterTblSNo, GetProcedureName, PageType) {
    $('#divUldRepairRecordAppendGrid').remove();
    $("#divUldRepairRecord").append("<div id='divUldRepairRecordAppendGrid' style='width:100%'><table id='tblUldRepairRecordAppendGridCost' style='width:100%'></table></div>");
    $("#tblUldRepairRecordAppendGridCost").appendGrid({
        tableID: "tblUldRepairRecordAppendGridCost",
        contentEditable: true,
        isGetRecord: true,
        tableColume: "SNo,Description,Condition,Remarks",
        masterTableSNo: masterTblSNo,
        currentPage: 1, itemsPerPage: 5, whereCondition: PageType, sort: "",
        servicePath: "./Services/ULD/UldRepairService.svc",
        getRecordServiceMethod: "GetULDRepairableItemQuotation",
        deleteServiceMethod: 'DeleteULDRepairableItemQuotation',
        caption: "Cost Approval",
        initRows: 1,
        columns: [{ name: "ULDRepairMaterialSNo", type: "hidden", },
        { name: "SNo", type: "hidden", },
        PageType == "V" ? { name: "ItemName", display: "Part Number", type: "label", ctrlCss: { width: "60px" }, value: 0 } : {
            name: 'ItemName', display: 'Part Number', type: 'text', ctrlAttr: { controltype: 'autocomplete', onSelect: "return CostItemDescription(this);" }, ctrlCss: { width: '150px', height: '20px' }, onClick: function (evt, rowIndex) {

            }, isRequired: false, AutoCompleteName: 'ULD_RepairPartNo', filterField: 'ItemName', filterCriteria: "contains", isRequired: true

        },
        PageType == "V" ? { name: "ItemName", display: "Part Number", type: "label", ctrlCss: { width: "60px" }, value: 0 } : {
            name: 'ItemDescription', display: 'Material Description', type: 'text', ctrlAttr: { controltype: 'autocomplete', onSelect: "return CostItemDescriptionFilter(this);" }, ctrlCss: { width: '150px', height: '20px' }, onClick: function (evt, rowIndex) {

            }, isRequired: false, AutoCompleteName: 'ULD_RepairPartAgnPartno', filterField: 'ItemDescriptionFilter', filterCriteria: "contains", isRequired: true
        },
        ///{ name: "ItemDescription", display: "Material Description", type: "label", ctrlAttr: { controltype: 'autocomplete', onSelect: "return CostItemDescriptionFilter(this);" }, ctrlCss: { width: "100px" }, tableName: 'vwULDRepairableItem', textColumn: 'ItemDescriptionFilter', keyColumn: 'SNo', filterCriteria: "contains", isRequired: false },
        {
            name: "Qty", display: "Quantity", type: PageType == "V" ? "label" : "text",  ctrlCss: { width: "150px" }, onChange: function (evt, rowIndex) {
                var ind = evt.target.id.split('_')[2];
                var Qty = $("#tblUldRepairRecordAppendGridCost_Qty_" + ind).val() == "" ? 0 : $("#tblUldRepairRecordAppendGridCost_Qty_" + ind).val()
                if (Qty == "") {
                    $("#tblUldRepairRecordAppendGridCost_Qty_" + ind).val('0');
                }
                var MtlPrice = $("#tblUldRepairRecordAppendGridCost_MaterialPrice_" + ind).text() == "" ? 0 : $("#tblUldRepairRecordAppendGridCost_MaterialPrice_" + ind).text();
                var TotalPrice = parseFloat(Qty) * parseFloat(MtlPrice);
                var ManhoursCost = $("#ManhoursCost").val() == "" ? 0 : $("#ManhoursCost").val()

                $("#tblUldRepairRecordAppendGridCost_TotalCost_" + ind).text(parseFloat(TotalPrice).toFixed(3));
                ToatlCostApproval()
            }, isRequired: true
        },
        { name: "MaterialPrice", display: "Material Charges", type: "label", ctrlAttr: {}, ctrlCss: { width: "100px" }, isRequired: false },
        { name: "TotalCost", display: "Total Charges", type: "label", ctrlAttr: {}, ctrlCss: { width: "100px" }, isRequired: false },
        ],
        isPaging: false,
        hideButtons: { updateAll: true, insert: true, remove: true, append: false, removeLast: false },
        //afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
        //    if (PageType == "V") {

        //        $("#tblUldRepairRecordAppendGrid_btnAppendRow").hide()
        //        $("#tblUldRepairRecordAppendGrid_btnRemoveLast").hide()
        //    } else if (PageType == "E") {
        //        $("#tblUldRepairRecordAppendGrid_btnAppendRow").show()
        //        $("#tblUldRepairRecordAppendGrid_btnRemoveLast").show()
        //    }
        //},
    });
}
function CreateAppenGridApproval(masterTblSNo, GetProcedureName, PageType) {
    $('#divUldRepairRecordAppendGrid').remove();
    $("#divUldRepairRecord").append("<div id='divUldRepairRecordAppendGrid' style='width:100%'><table id='tblUldRepairRecordAppendGridApproval' style='width:100%'></table></div>");
    $("#tblUldRepairRecordAppendGridApproval").appendGrid({
        tableID: "tblUldRepairRecordAppendGridApproval",
        contentEditable: true,
        isGetRecord: true,
        tableColume: "SNo,Description,Condition,Remarks",
        masterTableSNo: masterTblSNo,
        currentPage: 1, itemsPerPage: 5, whereCondition: PageType, sort: "",
        servicePath: "./Services/ULD/UldRepairService.svc",
        getRecordServiceMethod: "GetFetchUldRepairableItemApproval",
        caption: "Material Cost Approval",
        initRows: 1,
        columns: [{ name: "SNo", type: "hidden", },

        { name: "ItemName", display: "Part Number", type: "label", ctrlCss: { width: "60px" } },
        { name: "ItemDescription", display: "Material Description", type: "label", ctrlCss: { width: "60px" } },
        { name: "Qty", display: "Quantity", type: "label", ctrlCss: { width: "100px" }, isRequired: false },
        { name: "MaterialPrice", display: "Material Price", type: "label", ctrlAttr: {}, ctrlCss: { width: "100px" }, isRequired: false },
        { name: "TotalCost", display: "Total Cost", type: "label", ctrlAttr: {}, ctrlCss: { width: "100px" }, isRequired: false },
        { name: 'IsApproval', display: 'Approval', type: 'checkbox', ctrlAttr: { onclick: "return SelectApproveval(this.id);" }, ctrlCss: { width: '80px' }, },
        ],
        isPaging: false,
        hideButtons: { updateAll: true, insert: true, remove: true, append: false, removeLast: false },
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
        },
    });
}
// Pankaj Kumar Ishwar on 02-11-2017
function BindMainCostHistory(ULDRepairSNo) {
    var TotalCost = 0;
    $('#divMainCostHistory').remove();
    $("#divULDRepairDetails").append("<div id='divMainCostHistory' style='width:100%'><table id='tblMainCostHistory' style='width:100%'></table></div>");
    $.ajax({
        url: "Services/ULD/ULDRepairService.svc/GetMainCostHistory?ULDRepairSNo=" + ULDRepairSNo, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result) {
                if (jQuery.parseJSON(result).Table0[0]) {
                    var strVar = "<\/br>";
                    var AWBData = jQuery.parseJSON(result).Table0;
                    var columnNo = 0;
                    for (var j in AWBData[0]) {
                        columnNo = columnNo + 1;
                    }
                    strVar += "<table class=\"tdPadding\" style=\"width:70%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr style=\"background-color: #C0C0C0\"><tbody class=\"ui-widget-content\"><td class=\"ui-state-active caption\" height=20px; align=\"left\" colspan=\"" + columnNo + "\">Maintenance History<\/td><\/tr>";
                    for (var j in AWBData[0]) {
                        strVar += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">" + $(j).selector + "</td>";
                    }
                    strVar += "<\/tr>";
                    for (var i in AWBData) {
                        strVar += "<tr>";
                        for (var j in AWBData[i]) {
                            strVar += "<td class=\"ui-widget-content\">" + AWBData[i][j] + "<\/td>";
                        }
                        strVar += "<\/tr>";
                    }
                    strVar += "<\/tbody>";
                    strVar += "<\/table>";
                    strVar += "<\/br>";
                    $('#tblMainCostHistory').html(strVar);
                }
            }
        }
    });
}

function CreateAppenGridApprovalForMainCost(masterTblSNo, GetProcedureName, PageType) {

    $('#divUldRepairRecordAppendGrid').remove();
    $("#divUldRepairRecord").append("<div id='divUldRepairRecordAppendGrids' style='width:100%'><table id='tblUldRepairRecordAppendGridApprovals' style='width:100%'></table></div>");
    $("#tblUldRepairRecordAppendGridApprovals").appendGrid({
        tableID: "tblUldRepairRecordAppendGridApprovals",
        contentEditable: true,
        isGetRecord: true,
        tableColume: "Sno,MainCategory,MaintenanceType,ManhourCost",
        masterTableSNo: masterTblSNo,
        currentPage: 1, itemsPerPage: 5, whereCondition: PageType, sort: "",
        servicePath: "./Services/ULD/UldRepairService.svc",
        getRecordServiceMethod: "GetFetchUldRepairMainCostApproval",
        caption: "Maintenance Cost Approval",
        initRows: 1,
        columns: [{ name: "SNo", type: "hidden", },
        { name: "MainCategory", display: "Maintenance Category", type: "label", ctrlCss: { width: "60px" } },
        { name: "MaintenanceType", display: "Maintenance Type", type: "label", ctrlCss: { width: "60px" } },
        { name: "ManhourCost", display: "Maintenance Hour Cost", type: "label", ctrlCss: { width: "100px" }, isRequired: false },
        { name: "IsApproval", display: "Approval", type: "checkbox", ctrlAttr: { onclick: "return SelectApproveval(this.id);" }, ctrlCss: { width: "80px" }, isRequired: false },
        ],
        isPaging: false,
        hideButtons: { updateAll: true, insert: true, remove: true, append: false, removeLast: false },
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
        },
    });
}
function SelectApproveval(id) {
    var MrTotalCost = 0;
    var MaterialCost = 0;
    $("tr[id^='tblUldRepairRecordAppendGridApprovals']").each(function (row, tr) {

        var IsApproval = $(tr).find("input[id^='tblUldRepairRecordAppendGridApprovals_IsApproval_']").is(':checked') ? 1 : 0
        if (IsApproval == "1") {
            MrTotalCost += parseFloat($(tr).find("label[id^='tblUldRepairRecordAppendGridApprovals_ManhourCost_']").text() == "" ? 0 : $(tr).find("label[id^='tblUldRepairRecordAppendGridApprovals_ManhourCost_']").text());
        }
        $('span[id="AppManhoursCost"]').text(MrTotalCost.toFixed(3));
        $('input[id="AppManhoursCost"]').val(MrTotalCost.toFixed(3))
    });
    $("tr[id^='tblUldRepairRecordAppendGridApproval']").each(function (row, tr) {

        var IsApproval = $(tr).find("input[id^='tblUldRepairRecordAppendGridApproval_IsApproval_']").is(':checked') ? 1 : 0
        if (IsApproval == "1") {
            MaterialCost += parseFloat($(tr).find("label[id^='tblUldRepairRecordAppendGridApproval_TotalCost_']").text() == "" ? 0 : $(tr).find("label[id^='tblUldRepairRecordAppendGridApproval_TotalCost_']").text());
        }
    });
    var apptotal = parseFloat(MrTotalCost) + parseFloat(MaterialCost)
    $('span[id="TotalCost"]').text(apptotal.toFixed(3));
    $('input[id="TotalCost"]').val(apptotal.toFixed(3));
    $('span[id="MaterialCosts"]').text(MaterialCost.toFixed(3));
    $('input[id="MaterialCosts"]').val(MaterialCost.toFixed(3));
}

function DisabledCheckBoxApprovalForMainCost() {
    $("tr[id^='tblUldRepairRecordAppendGridApprovals']").each(function (row, tr) {
        var IsApprovals = $(tr).find("input[id^='tblUldRepairRecordAppendGridApprovals_IsApproval_']").val() == "0" ? 0 : $(tr).find("input[id^='tblUldRepairRecordAppendGridApprovals_IsApproval_']").val();
        $(tr).find("input[id^='tblUldRepairRecordAppendGridApprovals_IsApproval_']").attr("disabled", "disabled")
    });
}
/*------------------------------------------------------------------------*/
// Nayak 
function DisabledCheckBoxApproval() {
    $("tr[id^='tblUldRepairRecordAppendGridApproval']").each(function (row, tr) {
        var IsApproval = $(tr).find("input[id^='tblUldRepairRecordAppendGridApproval_IsApproval_']").val() == "" ? 0 : $(tr).find("input[id^='tblUldRepairRecordAppendGridApproval_IsApproval_']").val();

        $(tr).find("input[id^='tblUldRepairRecordAppendGridApproval_IsApproval_']").attr("disabled", "disabled")

    });
}


function CostItemDescription(obj) {


    var PartNumber = $(obj).closest("tr").find("input[id^='tblUldRepairRecordAppendGridCost_HdnItemName_']").val();

    GetPrice(PartNumber, obj)


}
function CostItemDescriptionFilter(obj) {

    var ItemDescription = $(obj).closest("tr").find("input[id^='tblUldRepairRecordAppendGridCost_ItemDescription_']").val();
    var ItemDescriptionSplit = ItemDescription.split("->")
    var ItemDescriptionSno = $(obj).closest("tr").find("input[id^='tblUldRepairRecordAppendGridCost_HdnItemDescription_']").val();
    $(obj).closest("tr").find("input[id^='tblUldRepairRecordAppendGridCost_ItemName_']").val(ItemDescriptionSplit[0]);
    $(obj).closest("tr").find("input[id^='tblUldRepairRecordAppendGridCost_HdnItemName_']").val(ItemDescriptionSno);
    GetPrice(ItemDescriptionSno, obj)

}
function GetDescription(PartNumber, ID) {

    $.ajax({
        url: "Services/ULD/ULDRepairService.svc/GetDescription?PartNumber=" + PartNumber, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            myData = jQuery.parseJSON(result).Table0[0].ItemDescription;
        }
    });


}
function GetPrice(PartNumber, obj) {
    var myData = "";

    $(obj).closest("tr").find("input[id^='tblUldRepairRecordAppendGridCost_MaterialPrice_']").text('');
    $(obj).closest("tr").find("input[id^='tblUldRepairRecordAppendGridCost_Qty_']").val('');
    $(obj).closest("tr").find("input[id^='_temptblUldRepairRecordAppendGridCost_Qty_']").val('');
    $(obj).closest("tr").find("input[id^='tblUldRepairRecordAppendGridCost_TotalCost_']").text('');
    $(obj).closest("tr").find("input[id^='tblUldRepairRecordAppendGridCost_ItemDescription_']").text('');



    $.ajax({
        url: "Services/ULD/ULDRepairService.svc/GetPrice?PartNumber=" + PartNumber, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (jQuery.parseJSON(result).Table0.length > 0) {
                $(obj).closest("tr").find("input[id^='tblUldRepairRecordAppendGridCost_ItemDescription_']").val(jQuery.parseJSON(result).Table0[0].ItemDescription);
                $(obj).closest("tr").find("input[id^='tblUldRepairRecordAppendGridCost_HdnItemDescription_']").val(jQuery.parseJSON(result).Table0[0].Sno);
                $(obj).closest("tr").find("label[id^='tblUldRepairRecordAppendGridCost_MaterialPrice_']").text(jQuery.parseJSON(result).Table0[0].Price);
                $(obj).closest("tr").find("input[id^='tblUldRepairRecordAppendGridCost_Qty_']").val(jQuery.parseJSON(result).Table0[0].Qty);
                $(obj).closest("tr").find("input[id^='_temptblUldRepairRecordAppendGridCost_Qty_']").val(jQuery.parseJSON(result).Table0[0].Qty);
                var Price = parseFloat(jQuery.parseJSON(result).Table0[0].Qty) * parseFloat(jQuery.parseJSON(result).Table0[0].Price);
                var ManhoursCost = $("#ManhoursCost").val() == "" ? 0 : $("#ManhoursCost").val()

                $(obj).closest("tr").find("label[id^='tblUldRepairRecordAppendGridCost_TotalCost_']").text(parseFloat(Price.toFixed(3)));
            }
        }
    });
    setTimeout(function () {
        ToatlCostApproval()
    }, 100)
}
function ToatlCostApproval() {
    debugger;
    TotalCost = 0;
    $('span[id="TotalCostApproval"]').text('');
    $('input[id="TotalCostApproval"]').val('');
    $('span[id="MaterialCosts"]').text('');
    $('input[id="MaterialCosts"]').text('');

    var AppManhoursCost = $('input[id="ManhoursCost"]').val() == "" ? 0 : $('input[id="ManhoursCost"]').val();

    $("tr[id^='tblUldRepairRecordAppendGridCost']").each(function (row, tr) {

        TotalCost += parseFloat($(tr).find("label[id^='tblUldRepairRecordAppendGridCost_TotalCost_']").text() == "" ? 0 : $(tr).find("label[id^='tblUldRepairRecordAppendGridCost_TotalCost_']").text());

    });

    var apptotal = parseFloat(TotalCost) + parseFloat(AppManhoursCost)
    $('span[id="TotalCostApproval"]').text(apptotal.toFixed(3));
    $('input[id="TotalCostApproval"]').val(apptotal.toFixed(3));
    $('span[id="MaterialCost"]').text((TotalCost).toFixed(3));
    $('input[id="MaterialCost"]').val((TotalCost).toFixed(3));
}
var TotalCost = 0;
var TotalManhrsCost = 0;
var MaterialCosts = 0;
function calculatorTotalChanrges() {
    TotalManhrsCost = 0;
    MaterialCosts = 0;
    $('span[id="AppManhoursCost"]').text('');
    $('span[id="MaterialCosts"]').text('');
    $("tr[id^='tblUldRepairRecordAppendGridApprovals']").each(function (row, tr) {

        var IsApprovals = $(tr).find("input[id^='tblUldRepairRecordAppendGridApprovals_IsApproval_']").val()

        if (IsApprovals == "1") {
            TotalManhrsCost += parseFloat($(tr).find("label[id^='tblUldRepairRecordAppendGridApprovals_ManhourCost_']").text() == "" ? 0 : $(tr).find("label[id^='tblUldRepairRecordAppendGridApprovals_ManhourCost_']").text());

        }
    });

    $('span[id="AppManhoursCost"]').text(TotalManhrsCost.toFixed(3));
    $('input[id="AppManhoursCost"]').val(TotalManhrsCost.toFixed(3));


    TotalCost = 0;
    $('span[id="TotalCost"]').text('');
    $('span[id="MaterialCost"]').text('');

    var AppManhoursCost = $('span[id="AppManhoursCost"]').text() == "" ? 0 : $('span[id="AppManhoursCost"]').text();

    $("tr[id^='tblUldRepairRecordAppendGridApproval']").each(function (row, tr) {

        var IsApproval = $(tr).find("input[id^='tblUldRepairRecordAppendGridApproval_IsApproval_']").is(':checked') ? 1 : 0
        if (IsApproval == "1") {
            TotalCost += parseFloat($(tr).find("label[id^='tblUldRepairRecordAppendGridApproval_TotalCost_']").text() == "" ? 0 : $(tr).find("label[id^='tblUldRepairRecordAppendGridApproval_TotalCost_']").text());
        }
    });
    var apptotal = parseFloat(TotalCost) + parseFloat(AppManhoursCost)
    $('span[id="TotalCost"]').text(apptotal.toFixed(3));
    $('input[id="TotalCost"]').val(apptotal.toFixed(3));
    $('span[id="MaterialCosts"]').text(TotalCost.toFixed(3));
    $('input[id="MaterialCosts"]').val(TotalCost.toFixed(3));
}
function GetManHoursCost(obj) {
    var MaintenanceType = $(obj).closest('tr').find('td[data-column="TypeOfMaintenanceId"]').text();
    var VendorId = $(obj).closest('tr').find('td[data-column="MUldType"]').text();
    $.ajax({
        url: "Services/ULD/ULDRepairService.svc/GetManHoursCost?ULDRepairSNo=" + ULDRepairSNo, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {

            var myData = jQuery.parseJSON(result)
            if (myData.Table0.length != "0") {
                $('#ManhoursCost').val(myData.Table0[0].ManHoursCost);
                $('#_tempManhoursCost').val(myData.Table0[0].ManHoursCost);
                $('span[id="MaterialCosts"]').text(myData.Table0[0].MaterialCost);
                $('#MaterialCosts').val(myData.Table0[0].MaterialCost);
                $('span[id="AppManhoursCost"]').text(myData.Table0[0].ManHoursCost);
                $('#AppManhoursCost').val(myData.Table0[0].ManHoursCost)
            }
            else {
                $('#ManhoursCost').val("0");
                $('#_tempManhoursCost').val("0");
                $('span[id="MaterialCosts"]').html("0");
                $('#MaterialCosts').val("0");
                $('#MaterialCosts').val("0");
                $('span[id="AppManhoursCost"]').html("0");
                $('#AppManhoursCost').val("0")
                $('#AppManhoursCost').val("0")
            }
        }
    });
    calculatorTotalChanrges();
}
function ApprovePrint(Uld) {
    CleanUI();
    $.ajax({

        url: "HtmlFiles/ULDREPAIR/ULDRepairApproved.html",
        async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $('#btnApprovePrint').hide();
            $('#divUldRepairRecordPrint').remove();
            $("#divULDRepairDetails").append("<div id='divUldRepairRecordPrint' style='width:100%'><table id='tblUldRepairRecordPrint' style='width:100%'></table></div>");
            $("#tblUldRepairRecordPrint").html(result);
            GetULDRepairPrintRecordApproval(ULDRepairSNo);


        }
    });
}

/////
function UploadImage(objId, ULDRepairSNo, ULD, DownloadLink) {
    var Position = objId.split('_')[1];
    var fileSelect = document.getElementById(objId);
    var files = fileSelect.files;
    var fileName = "";
    var data = new FormData();
    for (var i = 0; i < files.length; i++) {
        fileName = files[i].name;
        data.append(files[i].name, files[i]);
    }
    $.ajax({
        url: "Handler/UploadImage.ashx?ULDRepairSNo=" + ULDRepairSNo + "&ULD=" + ULD,
        type: "POST",
        data: data,
        contentType: false,
        processData: false,
        success: function (result) {

            var a = "";
            if (result == "") {
                $("#" + objId).val("");
                ShowMessage('info', 'File Upload!', "This Document is already exist.", "bottom-right");
            }
            ///$("#DownloadImage").html( + result.split('#UploadImage#')[1])
            $("#" + objId).closest("tr").find("a[id^='ahref_" + DownloadLink + "']").attr("linkdata", result.split('#UploadImage#')[0]);
            $("#" + objId).closest("tr").find("span[id^='" + DownloadLink + "']").text(result.split('#UploadImage#')[1]);
            //$("#" + objId).closest("tr").find("a[id^='ahref_" + nexctrlid + "']").attr("linkdata", result.split('#UploadImage#')[0]);
            //$("#" + objId).closest("tr").find("span[id^='" + nexctrlid + "']").text(result.split('#UploadImage#')[1]);
        },
        error: function (err) {
            ShowMessage('info', 'File Upload!', "Unable to upload selected file. Please try again.", "bottom-right");
        }
    });
    //SaveUploader();
}

function DownloadImage(objId, attchmntSNo, ULD, DownloadLink) {

    if (attchmntSNo != '0') {
        var Download = "Download";
        var url;
        if (location.hostname == "localhost") {
            url = "http://" + location.host;
        }
        else {
            url = "http://" + location.hostname + "/" + (window.location.pathname.replace(/^\/([^\/]*).*$/, '$1').split('.').pop() == "cshtml" ? '' : window.location.pathname.replace(/^\/([^\/]*).*$/, '$1'));
        }
        window.open(url + "/Handler/UploadImage.ashx?Download=" + DownloadLink + "&attchmntSNo=" + attchmntSNo);
    }
    else {
        //ShowMessage('info', 'Download!', "Invalid attempt.", "bottom-right");
    }
}

function BindQuoteHistory(ULDRepairSNo) {
    var TotalCost = 0;
    $('#divUldQuoteHistory').remove();
    $("#divULDRepairDetails").append("<div id='divUldQuoteHistory' style='width:100%'><table id='tblUldQuoteHistory' style='width:100%'></table></div>");
    $.ajax({
        url: "Services/ULD/ULDRepairService.svc/GetQuoteHistory?ULDRepairSNo=" + ULDRepairSNo, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {

            if (result) {
                if (jQuery.parseJSON(result).Table0[0]) {
                    var strVar = "<\/br>";
                    //var AWBDatas = jQuery.parseJSON(result);
                    var AWBData = jQuery.parseJSON(result).Table0;
                    var columnNo = 0;
                    for (var j in AWBData[0]) {
                        columnNo = columnNo + 1;
                    }
                    strVar += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr style=\"background-color: #C0C0C0\"><tbody class=\"ui-widget-content\"><td class=\"ui-state-active caption\" height=20px; align=\"left\" colspan=\"" + columnNo + "\">Quotation History<\/td><\/tr>";
                    for (var j in AWBData[0]) {
                        strVar += "<td style=\"padding-left: 5px; width: 150px\" class=\"ui-widget-header\">" + $(j).selector + "</td>";
                    }
                    strVar += "<\/tr>";
                    for (var i in AWBData) {
                        strVar += "<tr>";
                        for (var j in AWBData[i]) {
                            strVar += "<td class=\"ui-widget-content\">" + AWBData[i][j] + "<\/td>";
                            // alert(AWBData[i][j])
                        }
                        strVar += "<\/tr>";

                    }
                    strVar += "<\/tbody>";
                    strVar += "<\/table>";
                    strVar += "<\/br>";
                    $('#tblUldQuoteHistory').html(strVar);
                }
                var CostTotal = 0;
                var AppManhoursCost = $('input[id="ManhoursCost"]').val() == "" ? 0 : $('input[id="ManhoursCost"]').val();
                $('span[id="TotalCostApproval"]').text('');
                $('input[id="TotalCostApproval"]').val('');

                var Calclu = jQuery.parseJSON(result).Table1;
                for (var k = 0; k < Calclu.length; k++) {
                    CostTotal += parseFloat(Calclu[k].TotalCost)
                }
                var Cost = parseFloat(CostTotal) + parseFloat(AppManhoursCost)
                $('span[id="TotalCostApproval"]').text(Cost.toFixed(3));
                $('input[id="TotalCostApproval"]').val(Cost.toFixed(3));
                $('span[id="MaterialCost"]').text((CostTotal).toFixed(3));
                $('input[id="MaterialCost"]').val((CostTotal).toFixed(3));
            }
        }
    });
}

function PrintElem(elem) {
    //$('#table1 tr[id^=trPrint]').remove();
    Popup($(elem).html());
}

function Popup(data) {
    var mywindow = window.open('', '', 'height=400,width=600');
    mywindow.document.write('<html><head><title></title>');
    /*optional stylesheet*/ //mywindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');
    mywindow.document.write('</head><body >');
    mywindow.document.write(data);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10

    mywindow.print();
    mywindow.close();

    return true;
}

function GetULDRepairPrintRecord(ULDRepairSNo) {
    if (ULDRepairSNo) {
        $.ajax({
            url: "Services/ULD/ULDRepairService.svc/GetULDRepairPrintRecord",
            async: false,
            type: "GET",
            dataType: "json",
            data: { ULDRepairSNo: ULDRepairSNo },
            contentType: "application/json; charset=utf-8", cache: false,

            success: function (result) {
                var ResultData = jQuery.parseJSON(result);
                FinalData = ResultData.Table0;
                FinalData1 = ResultData.Table1;
                var AirlineLogo = "";
                $("#ImgLogo").attr('src', '');
                if (FinalData.length > 0) {
                    if (FinalData[0].AirlineLogo == "") {
                        $("#ImgLogo").attr('src', userContext.SysSetting.LogoURL);
                    } else {
                        AirlineLogo = "../BLOBUploadAndDownload/DownloadFromBlob/?filenameOrUrl=" + FinalData[0].AirlineLogo;

                        $("#ImgLogo").attr('src', AirlineLogo);
                    }
                    $("#spnSerialNo").text(FinalData[0].PrintSerialNo);
                    $("#spnType").text(FinalData[0].ULDType);
                    $("#spnULDNo").text(FinalData[0].ULDNo);
                    $("#spnMaintenance").text(FinalData[0].Maintenancetype);
                    $("#spnManufacturer").text(FinalData[0].OwnerCode);
                    $("#spnREPAIR").text(FinalData[0].RepairOrScrap);
                    $("#spnDateOfDelivery").text(FinalData[0].DLVDate);
                    $("#spnfullname1").text(FinalData[0].FirstName);
                    $("#spnId1").text(FinalData[0].ID1);
                    //$("#spnfullname2").text(FinalData[0].ULDNo);
                    //$("#spnId2").text(FinalData[0].ULDNo);
                }
                if (FinalData1[0]) {
                    if (FinalData1.length > 0) {
                        for (var i = 0; i < FinalData1.length; i++) {
                            $('table[id="Desctbl"]').append('<tr> <td style="border:1px solid black;text-align:center"><span>' + (i + 1) + '</span></td><td style="border:1px solid black;text-align:center"><span>' + FinalData1[i].ItemName + '</span></td><td style="border:1px solid black;text-align:center"><span>' + FinalData1[i].Good + '</span></td><td style="border:1px solid black;text-align:center"><span>' + FinalData1[i].Damage + '</span></td><td style="border:1px solid black;text-align:center"><span>' + FinalData1[i].NA + '</span></td><td style="border:1px solid black;text-align:center"><span>' + FinalData1[i].Remarks + '</span></td> </tr>');
                        }
                    }
                    $('table[id="Desctbl"]').append('<tr> <td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td> </tr>');
                }
                else {
                    $('table[id="Desctbl"]').append('<tr> <td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td> </tr>');
                }
            }
        });
    }
    else {
        alert("Value Null");
    }
}


//Added By shivali thakur to add title on grid header//
function onGridDataBound(e) {
    $(this.thead).find('th[data-title]').each(function (item) {
        $(this).attr("title", $(this).text());
    });
}


function GetULDRepairPrintRecordApproval(ULDRepairSNo) {
    if (ULDRepairSNo) {
        $.ajax({
            url: "Services/ULD/ULDRepairService.svc/GetULDRepairPrintRecordApproval",
            async: false,
            type: "GET",
            dataType: "json",
            data: { ULDRepairSNo: ULDRepairSNo },
            contentType: "application/json; charset=utf-8", cache: false,

            success: function (result) {
                var ResultData = jQuery.parseJSON(result);
                FinalData = ResultData.Table0;
                FinalData1 = ResultData.Table1;
                var TotalCostApp = 0;
                var ManOurCost = 0;
                $("#ImgLogo").attr('src', '');
                var AirlineLogo = "";
                if (FinalData.length > 0) {
                    if (FinalData[0].AirlineLogo == "") {
                        $("#ImgLogo").attr('src', userContext.SysSetting.LogoURL);
                    } else {
                        AirlineLogo = "../BLOBUploadAndDownload/DownloadFromBlob/?filenameOrUrl=" + FinalData[0].AirlineLogo;
                        $("#ImgLogo").attr('src', AirlineLogo);
                    }
                    $("#spnULDNo").text(FinalData[0].ULDNo);
                    $("#spnType").text(FinalData[0].ULDType);
                    $("#spnManufacturer").text(FinalData[0].OwnerCode);
                    $("#spnDateOfDelivery").text(FinalData[0].DLVDate);
                    $("#spnMaterialManHoursCost").text(FinalData[0].ManHoursCost);
                    ManOurCost = FinalData[0].ManHoursCost;
                    $("#spnMaintenance").text(FinalData[0].Maintenancetype);
                    $("#spnREPAIR").text(FinalData[0].RepairOrScrap);
                    $("#spnfullname1").text(FinalData[0].FirstName);
                    $("#spnId1").text(FinalData[0].ID1);
                }
                if (FinalData1[0]) {
                    if (FinalData1.length > 0) {
                        for (var i = 0; i < FinalData1.length; i++) {

                            if (FinalData1[i].Approval == "Yes") {
                                TotalCostApp += parseFloat(FinalData1[i].TotalCost)
                            }
                            $('table[id="Desctbl"]').append('<tr> <td style="border:1px solid black;text-align:center"><span>' + (i + 1) + '</span></td> <td style="border:1px solid black;text-align:center"><span>' + FinalData1[i].PartName + '</span></td> <td style="border:1px solid black;text-align:center"><span>' + FinalData1[i].MaterialDescription + '</span></td>  <td style="border:1px solid black;text-align:center"><span>' + FinalData1[i].Qty + '</span></td>  <td style="border:1px solid black;text-align:center"><span>' + FinalData1[i].MaterialPrice + '</span></td> <td style="border:1px solid black;text-align:center"><span>' + FinalData1[i].TotalCost + '</span></td><td style="border:1px solid black;text-align:center"><span>' + FinalData1[i].Approval + '</span></td></tr>');

                        }
                    }

                    $("#totalcostapp").html((parseFloat(TotalCostApp) + parseFloat(ManOurCost)).toFixed(3));
                    $("#TOTALCOST").html(parseFloat(TotalCostApp).toFixed(3));
                    $("#spnMaterialCost").html(parseFloat(TotalCostApp).toFixed(3));
                    $('table[id="Desctbl"]').append('<tr> <td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td> </tr>');
                }
                else {
                    $('table[id="Desctbl"]').append('<tr> <td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td><td style="border:1px solid black;text-align:center"><span></span></td> </tr>');
                }
            }
        });
    }
    else {
        alert("Value Null");
    }
}

var fotter = "<div><table style='margin-left:20px;'>" +
    "<tbody><tr><td> &nbsp; &nbsp;</td>" +
    "<td><button class='btn btn-primary btn-sm' style='width:125px;' id='btnNew'>New ULD Repair</button></td>" +
    "<td> &nbsp; &nbsp;</td>" +
    "<td><button class='btn btn-block btn-success btn-sm'  id='btnSave' onclick='Save()'>Save</button></td>" +
    "<td> &nbsp; &nbsp;</td>" +
    "<td><button class='btn btn-block btn-success btn-sm'  id='btnUpdate' onclick='UpdateULDRepair(ULDRepairSNo)'>Update</button></td>" +
    "<td> &nbsp; &nbsp;</td>" +
    "<td><button class='btn btn-block btn-success btn-sm'  id='btnQuoteUpdate' onclick='UpdateQuoteULDRepair(ULDRepairSNo)'>Update</button></td>" +
    "<td> &nbsp; &nbsp;</td>" +
    "<td><button class='btn btn-block btn-success btn-sm'  id='btnApprovedUpdate' onclick='UpdateApprovedULDRepair(ULDRepairSNo)'>Approve</button></td>" +
    "<td> &nbsp; &nbsp;</td>" +
    "<td><button class='btn btn-block btn-success btn-sm'  id='btnReturnUpdate' onclick='UpdateReturnULDRepair(ULDRepairSNo)'>Update</button></td>" +
    "<td> &nbsp; &nbsp;</td>" +
    "<td><button class='btn btn-block btn-danger btn-sm' id='btnCancel' onclick='CleanUI()'>Cancel</button></td>" +
    "<td> &nbsp; &nbsp;</td>" +
    "<td><button class='btn btn-block btn-success btn-sm'  id='btnApprovePrint' onclick='ApprovePrint(ULDRepairSNo)'>Print</button></td>" +
    "</tr></tbody></table> </div>";

var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divULDRepairDetails' style='width:100%'></div></td></tr></table></div>";

function GetInvoiceCheck(obj, e, isdblclick) {
    var myData = "";
    var ChekULDRepairSNo = $(obj).closest('tr').find('td[data-column="ULDRepairSNo"]').text();
    $.ajax({
        url: "Services/ULD/ULDRepairService.svc/GetInvoiceCheck?ULDRepairSNo=" + ChekULDRepairSNo, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            myData = jQuery.parseJSON(result).Table0[0].IsRepaired;
        }
    });
    return myData

}
function GetApproveCheck(obj, e, isdblclick) {
    var myData = "";
    var ChekULDRepairSNo = $(obj).closest('tr').find('td[data-column="ULDRepairSNo"]').text();
    $.ajax({
        url: "Services/ULD/ULDRepairService.svc/GetApproveCheck?ULDRepairSNo=" + ChekULDRepairSNo, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            myData = jQuery.parseJSON(result).Table0[0].IsApproved;
        }
    });
    return myData

}
function ULDQuoteCheck(obj) {

    var myData = "";
    var ChekULDRepairSNo = $(obj).closest('tr').find('td[data-column="ULDRepairSNo"]').text();
    $.ajax({
        url: "Services/ULD/ULDRepairService.svc/ULDQuoteCheck?ULDRepairSNo=" + ChekULDRepairSNo, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            myData = jQuery.parseJSON(result).Table0[0].QStatus;
        }
    });
    return myData

}
function ULDReapirScrapCheck(obj) {

    var myData = "";
    var ChekULDRepairSNo = $(obj).closest('tr').find('td[data-column="ULDRepairSNo"]').text();
    $.ajax({
        url: "Services/ULD/ULDRepairService.svc/ULDReapirScrapCheck?ULDRepairSNo=" + ChekULDRepairSNo, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            myData = jQuery.parseJSON(result).Table0[0].RepairOrScrap;
        }
    });
    return myData

}
$(document).on('change', '#Invoicedate', function () {
    InvoiceDateCheck($(this).val())
});
function InvoiceDateCheck(GetDate) {
    var CombDateSno = GetDate + '@' + ULDRepairSNo

    $.ajax({
        url: "Services/ULD/ULDRepairService.svc/InvoiceDateCheck?Date=" + CombDateSno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {

            if (jQuery.parseJSON(result).Table0 != "") {
                var myData = jQuery.parseJSON(result).Table0[0].ApprovedOn;
                if (myData == "0" || myData < 0) {

                    $("#Invoicedate").val(GetDate)
                    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
                    var date = new Date()
                    var hours = date.getHours();
                    var CurrntDate = date.getDate() + "-" + monthNames[date.getMonth()] + "-" + date.getFullYear();
                    $("#Invoicedate").val(CurrntDate)


                }
            }
        }
    });


}

//$(document).ready(function () {
//$(document).on('click', '#AlertEmail', function () {

//});
//});
function SetnewEMail() {
    $("#AlertEmail").keyup(function (e) {
        var addlen = $("#AlertEmail").val().toUpperCase();
        var iKeyCode = (e.which) ? e.which : e.keyCode
        if (iKeyCode == 32) {
            addlen = addlen.slice(0, -1);
            if (addlen != "") {
                if (ValidateEMail(addlen)) {
                    var listlen = $("ul#addlist1 li").length;
                    $("ul#addlist1").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + addlen + " </span><span id='" + listlen + "' class='k-icon k-delete remove'></span></li>");
                    $("#AlertEmail").val('');
                }
                else {
                    alert("Please enter valid Email Address");
                }
            }
        }
        else
            e.preventDefault();
    });
    $("#AlertEmail").blur(function () {
        $("#AlertEmail").val('');
    });

    $("body").on("click", ".remove", function () {
        $(this).closest("li").remove();
    });
}
function SetnewEMailCostApproval() {
    $("#AlertMailCostApproval").keyup(function (e) {
        var addlen = $("#AlertMailCostApproval").val().toUpperCase();
        var iKeyCode = (e.which) ? e.which : e.keyCode
        if (iKeyCode == 32) {
            addlen = addlen.slice(0, -1);
            if (addlen != "") {
                if (ValidateEMail(addlen)) {
                    var listlen = $("ul#addlist2 li").length;
                    $("ul#addlist2").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + addlen + " </span><span id='" + listlen + "' class='k-icon k-delete remove'></span></li>");
                    $("#AlertMailCostApproval").val('');
                }
                else {
                    alert("Please enter valid Email Address");
                }
            }
        }
        else
            e.preventDefault();
    });
    $("#AlertMailCostApproval").blur(function () {
        $("#AlertMailCostApproval").val('');
    });

    $("body").on("click", ".remove", function () {
        $(this).closest("li").remove();
    });
}
function ValidateEMail(email) {
    var regex = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;;
    return regex.test(email);
}
////
var YesReady = false;
function PageRightsCheck() {
    var CheckIsFalse = 0;
    $(userContext.PageRights).each(function (e, i) {
        if (i.Apps.toString().toUpperCase() == "ULDREPAIR") {

            if (i.Apps.toString().toUpperCase() == "ULDREPAIR" && i.PageRight == "New") {
                YesReady = false;
                CheckIsFalse = 1;
                return
            } if (i.Apps.toString().toUpperCase() == "ULDREPAIR" && i.PageRight == "Edit") {
                YesReady = false;
                CheckIsFalse = 1;
                return
            } if (i.Apps.toString().toUpperCase() == "ULDREPAIR" && i.PageRight == "Delete") {
                YesReady = false;
                CheckIsFalse = 1;
                return
            } else if (CheckIsFalse == 0 && i.PageRight == "Read"){
                YesReady = true;
                CheckIsFalse = 1;
                return
            }

        }
    });

    if (YesReady) {
        $('#btnSave').hide();
        $('#btnUpdate').hide();
        $('#btnQuoteUpdate').hide();
        $("#btnNew").hide();
        $("#btnApprovePrint").hide();
        $("#btnPrint").hide();
        $("#btnApprovedUpdate").hide();
        $("#btnCancel").hide();
        $("#btnReturnUpdate").hide();
    }
}