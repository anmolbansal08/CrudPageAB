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
            $('#btnReturnUpdate').hide();
            $("#__divULDRepairsearch__ table:first").find("tr>td:first").text("ULD Repair");
            cfi.AutoComplete("searchULDNo", "uldno", "vUldRepairGetRecord", "uldno", "uldno", ["uldno"], null, "contains");
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
                $('#btnReturnUpdate').hide();
            });
            CleanUI();
            ULDRepairSearch();
            $("#btnNew").unbind("click").bind("click", function () {
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
                            $('#btnReturnUpdate').hide();
                            currentprocess = "ULDRepair";
                            cfi.AutoComplete("ULDNo", "uldno,SNo", "V_ULDRepair_view", "SNo", "uldno", ["uldno"], CheckContainer, "contains");
                            cfi.AutoComplete("ULDVendor", "Name,SNo", "Customer", "SNo", "Name", ["Name"], null, "contains");
                            cfi.AutoComplete("AuthorizedPerson", "Name,SNo", "CustomerAuthorizedPersonal", "SNo", "Name", ["Name"], null, "contains");
                            var MnType = [{ Key: "1", Text: "LIGHT" }, { Key: "2", Text: "HEAVY" }, { Key: "3", Text: "MEDIUM" }];
                            cfi.AutoCompleteByDataSource("MaintenanceType", MnType);
                            $("input[name^=Repair]").on("click", function () {
                                if ($("input[name^=Repair]:checked").val() == 1) {
                                    if ($("div[id^='divUldRepairRecordAppendGrid']").attr('id')) {
                                        $('#divUldRepairRecordAppendGrid').remove();
                                    }
                                }
                                else {
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
        }
    });
}

function ULDRepairSearch() {

    var ULDNo = $("#searchULDNo").val() == "" ? "A~A" : $("#searchULDNo").val().trim();
    var CreatedOn = $('#searchCreatedOn').attr('sqldatevalue') ? $('#searchCreatedOn').attr('sqldatevalue') : "A~A";
    //var FlightDate = "0";
    //if ($("#searchFlightDate").val() != "") {
    //    FlightDate = cfi.CfiDate("searchFlightDate") == "" ? "0" : cfi.CfiDate("searchFlightDate");// "";//month + "-" + day + "-" + year;
    //}
    cfi.ShowIndexView("divULDRepairDetails", "Services/ULD/ULDRepairService.svc/GetGridData/" + _CURR_PRO_ + "/ULD/ULDRepair/" + ULDNo + "/" + CreatedOn);

    //+ "/" + DestinationCity + "/" + FlightNo + "/" + FlightDate + "/" + AWBPrefix + "/" + AWBNo + "/" + LoggedInCity);
}

function checkRepairOrScrap() {
    $("#divULDRepairDetails table[class^='k-focusable k-selectable'] tr").each(function () {
        var RepairOrScrap = $(this).find("td[data-column='RepairOrScrap']").text()
        if (RepairOrScrap == "True") {
            $(this).find("input[process='EDITULDREPAIR']").attr('disabled', 'true');
            $(this).find("input[process='QUOTEULDREPAIR']").attr('disabled', 'true');
            $(this).find("input[process='RETURNULDREPAIR']").attr('disabled', 'true');
            $(this).find("input[process='VIEWULDREPAIR']").attr("class", "incompleteprocess");
            $(this).find("input[process='EDITULDREPAIR']").attr("class", "incompleteprocess");
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
            $(this).find("input[process='VIEWULDREPAIR']").attr("class", "incompleteprocess");
            $(this).find("input[process='EDITULDREPAIR']").attr("class", "incompleteprocess");

            if (IsQuoted == 'Y') {
                //$(this).find("input[process='EDITULDREPAIR']").attr('disabled', 'true');
                $(this).find("input[process='QUOTEULDREPAIR']").attr("class", "completeprocess");
            }
            else {
                $(this).find("input[process='QUOTEULDREPAIR']").attr("class", "incompleteprocess");
            }
            if (IsApproved.trim() == 'Y') {
                //$(this).find("input[process='QUOTEULDREPAIR']").attr('disabled', 'true');
                $(this).find("input[process='APPROVEDULDREPAIR']").attr("class", "completeprocess");
            }
            else {
                $(this).find("input[process='APPROVEDULDREPAIR']").attr("class", "incompleteprocess");
            }
            if (IsRepaired == 'Y') {
                //$(this).find("input[process='EDITULDREPAIR']").attr('disabled', 'true');
                //$(this).find("input[process='QUOTEULDREPAIR']").attr('disabled', 'true');
                //$(this).find("input[process='RETURNULDREPAIR']").attr('disabled', 'true');
                //$(this).find("input[process='APPROVEDULDREPAIR']").attr('disabled', 'true');
                $(this).find("input[process='APPROVEDULDREPAIR']").attr("class", "completeprocess");
                $(this).find("input[process='QUOTEULDREPAIR']").attr("class", "completeprocess");
                $(this).find("input[process='RETURNULDREPAIR']").attr("class", "completeprocess");
            }
            else {
                $(this).find("input[process='RETURNULDREPAIR']").attr("class", "incompleteprocess");
            }
            $(this).find("input[process='PRINTULDREPAIR']").attr("class", "incompleteprocess");
        }
    })
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
    var filterEmbargo = cfi.getFilter("AND");
    var filterSubcategory = cfi.getFilter("AND");
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

    if (!cfi.IsValidSection('divUldRepairRecord')) {
        return;
    }
    else {
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
        var ULDVendor = $('#ULDVendor').val();
        var AuthorizedPerson = $('#AuthorizedPerson').val();
        var AirportSNo = userContext.AirportSNo;
        var strData = [];

        if (Repair == "1") {
            var Data = {
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
            data: JSON.stringify({ ULDSNo: ULDSNo, Repair: Repair, MaintenanceType: MaintenanceType, ULDVendor: ULDVendor, AuthorizedPerson: AuthorizedPerson, AirportSNo: AirportSNo, strData: strData }), //added IncidentCategorySNo
            success: function (response) {
                var abc = response[0];
                ShowMessage('success', 'Success!', "Saved Successfully");
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

function UpdateULDRepair(ULDRepairSNo) {
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
            var ULDVendor = $('#ULDVendor').val();
            var AuthorizedPerson = $('#AuthorizedPerson').val();
            var AirportSNo = userContext.AirportSNo;

            $.ajax({
                url: "Services/ULD/ULDRepairService.svc/UpdateULDRepair", async: true, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ ULDSNo: ULDSNo, Repair: Repair, MaintenanceType: MaintenanceType, ULDVendor: ULDVendor, AuthorizedPerson: AuthorizedPerson, AirportSNo: AirportSNo, ULDRepairSNo: ULDRepairSNo, strData: strData }), //added IncidentCategorySNo
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
    if (ULDRepairSNo) {

        if (!cfi.IsValidSection('divUldRepairRecord')) {
            return;
        }
        else {
            var MaterialCost = $('#MaterialCost').val();
            var ManhoursCost = $('#ManhoursCost').val();
            var AirportSNo = userContext.AirportSNo;

            $.ajax({
                url: "Services/ULD/ULDRepairService.svc/UpdateQuoteULDRepair", async: true, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ MaterialCost: MaterialCost, ManhoursCost: ManhoursCost, AirportSNo: AirportSNo, ULDRepairSNo: ULDRepairSNo }), //added IncidentCategorySNo
                success: function (response) {
                    var result = response[0];
                    if (result == "0") {
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
}

function UpdateApprovedULDRepair(ULDRepairSNo) {
    if (ULDRepairSNo) {

        if (!cfi.IsValidSection('divUldRepairRecord')) {
            return;
        }
        else {
            var Approved = $("input[name^=IsApproved]:checked").val();
            var Remarks = $('#Remarks').val();
            var AirportSNo = userContext.AirportSNo;

            $.ajax({
                url: "Services/ULD/ULDRepairService.svc/UpdateApprovedULDRepair", async: true, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ Approved: Approved, Remarks: Remarks, AirportSNo: AirportSNo, ULDRepairSNo: ULDRepairSNo }), //added IncidentCategorySNo
                success: function (response) {
                    var Table = jQuery.parseJSON(response).Table0[0];
                    var abc = response[0];
                    if (jQuery.parseJSON(response).Table0[0].Message) {
                        ShowMessage('info', 'ULD Repair!', jQuery.parseJSON(response).Table0[0].Message, "bottom-right");
                    }
                    else {
                        ShowMessage('success', 'Success!', "ULD approved successfully");
                    }
                    CleanUI();
                    MasterULDRepair()
                },
                error: function (er) {
                    debugger
                }
            });
        }
    }
}

function UpdateReturnULDRepair(ULDRepairSNo) {
    if (ULDRepairSNo) {

        if (!cfi.IsValidSection('divUldRepairRecord')) {
            return;
        }
        else {
            
            var Repaired = $("input[name^=Repaired]:checked").val() == 0 ? 1 : 0;
          
     


            var ReturnRemarks = $('#ReturnRemarks').val();
            var Serviceable = $("input[name^=Serviceable]:checked").val()==0?1:0;
            var AirportSNo = userContext.AirportSNo;
            var ULDRepairReturnImage = "ULDRepairReturnImage";
            var ULDRepairReturnInvoice = 'ULDRepairReturnInvoice';

            $.ajax({
                url: "Services/ULD/ULDRepairService.svc/UpdateReturnULDRepair", async: true, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ Repaired: Repaired, ReturnRemarks: ReturnRemarks, Serviceable: Serviceable, AirportSNo: AirportSNo, ULDRepairSNo: ULDRepairSNo, ULDRepairReturnImage: ULDRepairReturnImage, ULDRepairReturnInvoice: ULDRepairReturnInvoice }), //added IncidentCategorySNo
                success: function (response) {
                    var result = response[0];
                    if (result == "0") {
                        ShowMessage('success', 'Success!', "Updated Successfully");
                        CleanUI();
                        MasterULDRepair()
                    }
                    if (result == "1") {
                        ShowMessage('info', 'ULD Repair Quote!', 'ULD is already returned now can not be Return again ', "bottom-right");
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
                ShowMessage('info', 'Invoice Not Generated.', "Invoice Not Generated.!", "bottom-right");
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
                        currentprocess = "EDITULDREPAIR";
                    }
                }
                if (ULDRepairtbl.RepairOrScrap == "F") {
                    RepairOrScrap = "False";
                }
                else {
                    RepairOrScrap = "True";
                    currentprocess = "VIEWULDREPAIR";
                }
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
                    BindULDRepair(ULDRepairSNo, "V", RepairOrScrap)
                }
            }
        });
    }
    else if (currentprocess == "EDITULDREPAIR") {
        CleanUI();
        $('#btnUpdate').show();
        $('#btnQuoteUpdate').hide();
        $('#btnApprovedUpdate').hide();
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
                    cfi.AutoComplete("ULDNo", "uldno,SNo", "V_ULDRepair_view", "SNo", "uldno", ["uldno"], CheckContainer, "contains");
                    cfi.AutoComplete("ULDVendor", "Name,SNo", "Customer", "SNo", "Name", ["Name"], null, "contains");
                    cfi.AutoComplete("AuthorizedPerson", "Name,SNo", "CustomerAuthorizedPersonal", "SNo", "Name", ["Name"], null, "contains");
                    var MnType = [{ Key: "1", Text: "LIGHT" }, { Key: "2", Text: "HEAVY" }, { Key: "3", Text: "MEDIUM" }];
                    cfi.AutoCompleteByDataSource("MaintenanceType", MnType);
                    BindULDRepair(ULDRepairSNo, "E", RepairOrScrap)
                    $("#Text_ULDNo").data("kendoAutoComplete").enable(false);
                    $("#Text_ULDNo").removeAttr('required');
                    $("#Text_ULDVendor").data("kendoAutoComplete").enable(false);
                    $("#Text_ULDVendor").removeAttr('required');
                }
            }
        });
    }
    else if (currentprocess == "QUOTEULDREPAIR") {
        $('#btnUpdate').hide();
        $('#btnQuoteUpdate').show();
        $('#btnApprovedUpdate').hide();
        $('#btnReturnUpdate').hide();
        CleanUI();
        var module = "ULD";
        $.ajax({
            url: "Services/ULD/ULDRepairService.svc/GetWebForm/" + _CURR_PRO_ + "/" + module + "/QuoteULDRepair/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $('#divUldRepairRecord').remove();
                $("#divULDRepairDetails").append("<div id='divUldRepairRecord' style='width:100%'><table id='tblUldRepairRecord' style='width:100%'></table></div>");
                $("#tblUldRepairRecord").html(result);
                cfi.Numeric($(this).find("input[id^='MaterialCost']").attr("id"), 3);
                cfi.Numeric($(this).find("input[id^='ManhoursCost']").attr("id"), 3);
                if (result !== undefined || result != "") {
                    BindULDRepair(ULDRepairSNo, "Q", RepairOrScrap)
                    BindQuoteHistory(ULDRepairSNo);
                }

                if (IsApproved.trim() == "Y") {
                    $('#MaterialCost').attr('disabled', true);
                    $('#_tempMaterialCost').attr('disabled', true);
                    $('#ManhoursCost').attr('disabled', true);
                    $('#_tempManhoursCost').attr('disabled', true);
                    $("#btnQuoteUpdate").hide()
                }
            }
        });
    }
    else if (currentprocess == "APPROVEDULDREPAIR") {
        $('#btnUpdate').hide();
        $('#btnQuoteUpdate').hide();
        $('#btnApprovedUpdate').show();
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
                    BindULDRepair(ULDRepairSNo, "A", RepairOrScrap)
                }
                // $('input[data-radioval="No"]').attr('checked', '');
                // $('input[data-radioval="Yes"]').attr('checked', 'true');
            }
        });
    }
    else if (currentprocess == "RETURNULDREPAIR") {
        $('#btnUpdate').hide();
        $('#btnQuoteUpdate').hide();
        $('#btnApprovedUpdate').hide();
        $('#btnReturnUpdate').show();
        CleanUI();
        var module = "ULD";
        $.ajax({
            url: "Services/ULD/ULDRepairService.svc/GetWebForm/" + _CURR_PRO_ + "/" + module + "/ReturnULDRepair/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $('#divUldRepairRecord').remove();
                $("#divULDRepairDetails").append("<div id='divUldRepairRecord' style='width:100%'><table id='tblUldRepairRecord' style='width:100%'></table></div>");
                $("#tblUldRepairRecord").html(result);
                //$("input[name^=Repaired]").on("click", function () {
                //    if ($("input[name^=Repaired]:checked").val() == 1) {
                //        $('#Serviceable[value="1"]').attr('Checked', 'True');
                //    }
                //    else {
                //        $('#Serviceable[value="0"]').attr('Checked', 'True');
                //    }
                //});
                $("input[id^='UploadImage']").unbind("change").bind("change", function () {
                    UploadImage($(this).attr("id"), ULDRepairSNo, "ULDRepairReturnImage", "DownloadImage");
                });
                $("input[id^='UploadInvoice']").unbind("change").bind("change", function () {
                    UploadImage($(this).attr("id"), ULDRepairSNo, "ULDRepairReturnInvoice", "DownloadInvoice");
                });

                $("#RepairedBy").closest("tr").find("td").hide();
                if (result != undefined || result != "") {
                    BindULDRepair(ULDRepairSNo, "R", RepairOrScrap);
                    $("span[id^='DownloadImage']").unbind("click").bind("click", function () {
                        DownloadImage($(this).attr("id"), attchmntImageSNo, "ULDRepairReturn", "DownloadImage");
                    });
                    $("span[id^='DownloadInvoice']").unbind("click").bind("click", function () {
                        DownloadImage($(this).attr("id"), attchmntInvoiceSNo, "ULDRepairReturn", "DownloadInvoice");
                    });
                }
            }
        });
    }
    else if (currentprocess == "PRINTULDREPAIR") {
        $('#btnUpdate').hide();
        $('#btnQuoteUpdate').hide();
        $('#btnApprovedUpdate').hide();
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
                PrintElem('#Printdiv');

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

function BindULDRepair(ULDRepairSNo, PageType, RepairOrScrap) {



    $.ajax({
        url: "Services/ULD/ULDRepairService.svc/GetULDRepairInformation?ULDRepairSNo=" + ULDRepairSNo + "&PageType=" + PageType, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var ULDRepairtbl = jQuery.parseJSON(result).Table0[0]
            if (PageType == "V") {
                $('span[id="ULDNo"]').text(ULDRepairtbl.Text_ULDNo.toUpperCase());
                $('span[id="ULDType"]').text(ULDRepairtbl.Text_ULDType.toUpperCase());
                $('span[id="Repair"]').text(ULDRepairtbl.Text_Repair.toUpperCase());
                $('span[id="MaintenanceType"]').text(ULDRepairtbl.Text_MaintenanceType.toUpperCase());
                $('span[id="ULDVendor"]').text(ULDRepairtbl.Text_ULDVendor.toUpperCase());
                $('span[id="AuthorizedPerson"]').text(ULDRepairtbl.Text_AuthorizedPerson.toUpperCase());
                if (RepairOrScrap == "False") {
                    CreateAppenGrid(ULDRepairSNo, "GetFetchUldRepairableItem", PageType);
                }
            }
            else if (PageType == "E") {
                $('#ULDNo').val(ULDRepairtbl.ULDNo);
                $('#Text_ULDNo').val(ULDRepairtbl.Text_ULDNo);
                $('span[id="ULDType"]').text(ULDRepairtbl.Text_ULDType);
                ULDRepairtbl.Repair == "False" ? $('#Repair[value="0"]').attr('Checked', 'True') : $('#Repair[value="1"]').attr('Checked', 'True');
                $('#Text_MaintenanceType').val(ULDRepairtbl.Text_MaintenanceType);
                $('#MaintenanceType').val(ULDRepairtbl.MaintenanceType);
                $('#Text_ULDVendor').val(ULDRepairtbl.Text_ULDVendor);
                $('#ULDVendor').val(ULDRepairtbl.ULDVendor);
                $('#Text_AuthorizedPerson').val(ULDRepairtbl.Text_AuthorizedPerson);
                $('#AuthorizedPerson').val(ULDRepairtbl.AuthorizedPerson);
                //$('input[id="Repair"]').attr('disabled', 'true')
                $("input[id='Repair']").attr('disabled', true);
                CreateAppenGrid(ULDRepairSNo, "GetFetchUldRepairableItem", PageType);
            }
            else if (PageType == "Q") {
                if (ULDRepairtbl) {
                    $('#MaterialCost').val(ULDRepairtbl.MaterialCost);
                    $('#_tempMaterialCost').val(ULDRepairtbl.MaterialCost);
                    $('#ManhoursCost').val(ULDRepairtbl.ManHoursCost);
                    $('#_tempManhoursCost').val(ULDRepairtbl.ManHoursCost);
                    $('span[id="QuotedBy"]').text(ULDRepairtbl.FirstName);
                    $('span[id="QuotedOn"]').text(ULDRepairtbl.QuotedOn);
                    $("#QuotedBy").closest("tr").find("td").show();
                }
                else {
                    $("#QuotedBy").closest("tr").find("td").hide();
                }
            }
            else if (PageType == "A") {



                // Uncheck
                //  document.getElementById("checkbox").checked = false;
                if (ULDRepairtbl) {
                    if (ULDRepairtbl.IsApproved == "False") {
                        $('input[data-radioval="No"]').attr('checked', true)
                    } else {
                        $('input[data-radioval="Yes"]').attr('checked', true)
                    }

                    //ULDRepairtbl.IsApproved == "False" ? $('[name="IsApproved"][value="1"]').attr('checked', 'checked') : $('[name="IsApproved"][value="0"]').attr('checked', 'checked');
                    if (ULDRepairtbl.IsApproved == "True") {
                        $('input[data-radioval="No"]').attr('disabled', 'true')
                    };
                    $('#Remarks').val(ULDRepairtbl.ApprovedRemarks);
                    $('span[id="ApprovedBy"]').text(ULDRepairtbl.FirstName);
                    $('span[id="ApprovedOn"]').text(ULDRepairtbl.ApprovedOn);
                    $("#ApprovedBy").closest("tr").find("td").show();
                }
                else {
                    $("#ApprovedBy").closest("tr").find("td").hide();
                }
            }
            else if (PageType == "R") {
               
                if (ULDRepairtbl) {
                  
                    if (ULDRepairtbl.IsRepaired == "False") {
                        $('input[data-radioval="No"]').attr('checked', true)
                    } else {
                       
                        $('input[data-radioval="Yes"]').attr('checked', true)
                    }

                  //  ULDRepairtbl.IsRepaired == "False" ? $('#Repaired[value="0"]').attr('Checked', 'True') : $('#Repaired[value="1"]').attr('Checked', 'True');
                    ULDRepairtbl.IsServiceable == "False" ? $('#Serviceable[value="0"]').attr('Checked', 'True') : $('#Serviceable[value="1"]').attr('Checked', 'True');
                    $('#ReturnRemarks').val(ULDRepairtbl.RepairedRemarks);
                    $('span[id="RepairedOn"]').text(ULDRepairtbl.RepairedDate);
                    $('span[id="RepairedBy"]').text(ULDRepairtbl.FirstName);
                    $("#RepairedBy").closest("tr").find("td").show();
                }
                attchmntImageSNo = 0;
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
        //contentEditable: pageType,
        isGetRecord: true,
        tableColume: "SNo,Description,Condition,Remarks",
        masterTableSNo: masterTblSNo,
        currentPage: 1, itemsPerPage: 5, whereCondition: PageType, sort: "",
        servicePath: "./Services/ULD/UldRepairService.svc",
        getRecordServiceMethod: GetProcedureName,
        caption: "Inspection Check List",
        initRows: 1,
        columns: [{ name: "SNo", type: "hidden", value: 0 },
                 { name: "Description", display: "Description", type: "label", ctrlCss: { width: "60px" }, value: 0 },
                 PageType == "V" ? { name: "Condition", display: "Condition", type: "label", ctrlCss: { width: "100px" }, isRequired: false } :
                 { name: "Condition", display: "Condition", type: "select", ctrlAttr: { maxlength: 100 }, ctrlOptions: { 0: "Good", 1: "Damage", 2: "N/A" }, ctrlCss: { width: "100px" }, isRequired: true },
                 { name: "Remarks", display: "Remarks", type: PageType == "V" ? "label" : "text", ctrlAttr: { maxlength: 200, controltype: PageType == "V" ? "" : "alphanumericupper" }, ctrlCss: { width: "242px" }, isRequired: PageType == "V" ? false : true }],
        isPaging: true,
        hideButtons: { updateAll: true, append: true, insert: true, remove: true, removeLast: true }
    });
}

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
                    strVar += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr style=\"background-color: #C0C0C0\"><tbody class=\"ui-widget-content\"><td class=\"ui-state-active caption\" height=20px; align=\"left\" colspan=\"" + columnNo + "\">Quote History<\/td><\/tr>";
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
                    $('#tblUldQuoteHistory').html(strVar);
                }
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

                if (FinalData.length > 0) {
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
                            "<td><button class='btn btn-block btn-success btn-sm'  id='btnApprovedUpdate' onclick='UpdateApprovedULDRepair(ULDRepairSNo)'>Update</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-success btn-sm'  id='btnReturnUpdate' onclick='UpdateReturnULDRepair(ULDRepairSNo)'>Update</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-danger btn-sm' id='btnCancel' onclick='CleanUI()'>Cancel</button></td>" +
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