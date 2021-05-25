
var ClaimDataSource = [{ Key: "1", Text: "YES" }, { Key: "0", Text: "NO" }];

$(function () {
    $("#btnSave").hide();
    MasterDeliveryOrder();
});

function MasterDeliveryOrder() {
    _CURR_PRO_ = "COMPLAINT";
    _CURR_OP_ = "Complaint";
    $("#licurrentop").html(_CURR_OP_);
    $("#divSearch").html("");
    $("#divComplaint").html("");

    CleanUI();
    $.ajax({
        url: "Services/Irregularity/ComplaintService.svc/GetWebForm/" + _CURR_PRO_ + "/Irregularity/Complaint/Search/1/0", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContent);
            $("#divFooter").html(fotter).show();
            cfi.AutoCompleteByDataSource("SearchClaim", ClaimDataSource);
            cfi.AutoComplete("searchComplainStatus", "Name", "v_ComplaintStatus", "SNo", "Name", ["Name"], null, "contains");
            cfi.AutoComplete("searchAWBNo", "AWBNo", "v_ComplaintAirwaybillNo", "AWBNo", "AWBNo", ["AWBNo"], null, "contains");
            cfi.AutoComplete("searchComplainNo", "ComplaintNo", "Complaint", "ComplaintNo", "ComplaintNo", ["ComplaintNo"], null, "contains");
            $('#searchFromDate').data("kendoDatePicker").value("");
            $('#searchToDate').data("kendoDatePicker").value("");
            $("#btnSearch").attr("tabindex", 7);
            $("#btnNew").attr("tabindex", 8)
            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });

            $("#btnSearch").bind("click", function () {
                CleanUI();
                ComplaintGridSearch();
            });
            ComplaintGridSearch();
            $("#btnNew").unbind("click").bind("click", function () {
                CleanUI();
                var module = "Irregularity";
                if (_CURR_PRO_ == "COMPLAINT") {
                    var _CURR_PRO_1 = "COMPLAINTNEW"
                    module = "Irregularity";
                }
                $.ajax({
                    url: "Services/Irregularity/ComplaintService.svc/GetWebForm/" + _CURR_PRO_ + "/" + module + "/ComplaintNew/New/1/0", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        $("#divNewComplaint").html(result);
                        if (result != undefined || result != "") {
                            InitializePage("ComplaintNew", "divNewComplaint");

                        }
                    }
                });
            });
        }
    });
}

function CleanUI() {

    $("#divDetail").html("");
    $("#divDetail1").html("");
    $("#divDetail2").html("");
    $("#divDetail3").html("");

    $("#btnSave").unbind("click");

    $("#tabstrip").hide();
    $('#divNewComplaint').html('');
    $('#divComplaintEdit').html('');
    $("#btnSave").css("display", "none");
    $("#btnUpdate").css("display", "none");
    $("#btnCancel").css("display", "none");
    $("#btnNew").css("display", "block");
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
    // $("input[name='SearchIncludeTransitAWB']").hide();
    //$("#SearchIncludeTransitAWB").after("Include Transit AWB");
    //    $("#SearchExcludeDeliveredAWB").after("Exclude Delivered AWB");
}

function ComplaintGridSearch() {
    var searchComplainNo = $("#searchComplainNo").val() == "" ? "0" : $("#searchComplainNo").val();
    var searchComplainStatus = $("#searchComplainStatus").val() == "" ? "0" : $("#searchComplainStatus").val();
    var searchAWBNo = $("#searchAWBNo").val() == "" ? "0" : $("#searchAWBNo").val();
    var SearchClaim = $("#SearchClaim").val() == "" ? "2" : $("#SearchClaim").val();
    var LoggedInCity = userContext.CityCode;
    var searchFromDate = "0";
    var searchToDate = "0";
    if ($("#searchFromDate").val() != "") {
        searchFromDate = cfi.CfiDate("searchFromDate") == "" ? "0" : cfi.CfiDate("searchFromDate");// "";//month + "-" + day + "-" + year;
    }

    if ($("#searchToDate").val() != "") {
        searchToDate = cfi.CfiDate("searchToDate") == "" ? "0" : cfi.CfiDate("searchToDate");// "";//month + "-" + day + "-" + year;
    }

    if (_CURR_PRO_ == "COMPLAINT") {
        cfi.ShowIndexView("divComplaintDetails", "Services/Irregularity/ComplaintService.svc/GetGridData/" + _CURR_PRO_ + "/Irregularity/Complaint/" + searchComplainNo.trim() + "/" + searchComplainStatus.trim() + "/" + searchAWBNo.trim() + "/" + searchFromDate.trim() + "/" + searchToDate.trim() + "/" + SearchClaim.trim() + "/" + LoggedInCity.trim() + "/0");
    }
}

function OnSuccessGrid() {
    //$('td[class="form2buttonrow"]').hide();
    var TrHeader = $("div[id$='divComplaintDetails']").find("div[class^='k-grid-header'] thead tr");
    var IsPreClaimIndex = TrHeader.find("th[data-field='PreClaim']").index();
    var currentComplaintSNoIndex = TrHeader.find("th[data-field='ComplaintSNo']").index();

    $("div[id$='divComplaintDetails']").find("div[class^='k-grid-content'] tbody tr").each(function (row, tr) {
        if ($(tr).find("td:eq(" + IsPreClaimIndex + ")").text() == "false") {
            if ($(tr).closest('td').find("input[process='RAISECLAIM']").val() == "RClaim") {
                $(tr).closest('td').find("input[process='RAISECLAIM']").prop("disabled", true);
            }
        }
    });
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

function SaveFormData(subprocess, CurrentComplaintSNo) {
    var issave = false;
    if (subprocess.toUpperCase() == "COMPLAINTNEW") {
        issave = SaveNewComplaint();
    }
    if (subprocess.toUpperCase() == "COMPLAINTEDIT") {
        issave = UpdateNewComplaint();
    }
    if (subprocess.toUpperCase() == "ACTION") {
        // alert(CurrentComplaintSNo)
        issave = SaveAction(CurrentComplaintSNo);
    }
    if (subprocess.toUpperCase() == "ASSIGN") {
        issave = SaveAssign(CurrentComplaintSNo);
    }
    if (subprocess.toUpperCase() == "EDOXCOMPLAINT") {
        issave = SaveEDoxList(CurrentComplaintSNo);
    }
    return issave;
}

function SaveNewComplaint() {
    var obj = {};
    obj.ComplainSourceSNo = $("#ComplainSource").val();
    obj.RaisedDate = $("#RaisedDate").attr("sqldatevalue");
    obj.AWBNo = $("#AWBNo").val();
    obj.AccountNo = $("#AccountNo").val();
    obj.Name = $("#Name").val();
    obj.ContactNo = $("#ContactNo").val();
    obj.Address = $("#Address").val();
    obj.EmailId = $("#EmailId").val();
    obj.CitySNo = $("#City").val();
    if ($("#IsPreClaim").prop("checked") == true) {
        obj.PreliminaryClaim = 1;
    }
    else {
        obj.PreliminaryClaim = 0;
    }

    obj.Description = $("#Description").val();
    obj.Expectation = $("#Expectation").val();
    obj.ComplaintStatusSNo = $("#ComplaintStatusSNo").val();
    //alert(JSON.stringify(obj));
    var flag = false;
    $.ajax({
        url: "Services/Irregularity/ComplaintService.svc/SaveNewComplaint", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ obj: obj }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var myData = $.parseJSON(result);
            if (myData.Table0[0].ErrorNumber == "0") {
                ShowMessage('success', 'Success - New Complaint', "Complaint No.:-" + myData.Table0[0].ComplaintNo + "  generated Successfully ", "bottom-right");
                $("#btnSave").unbind("click");
                ReloadSameGridPage();
                flag = true;
            }
            else
                ShowMessage('warning', 'Warning - New Complaint', "Please correct value(s) for :- " + result + ".", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - DO', " unable to process.", "bottom-right");
        }
    });
    return flag;
}

$(document).on("click", "#btnCancel", function () {
    ClearAll();
    CleanUI();
    ReloadSameGridPage();
});

$(document).on("keypress", "#AWBNo", function (e) {
    var a = [];
    var k = e.which;

    for (i = 48; i < 58; i++)
        a.push(i);

    a.push(45);
    if (!(a.indexOf(k) >= 0))
        e.preventDefault();

});

function ClearAll() {
    $("#btnCancel").hide();
    $("#btnSave").hide();
    $("#btnNew").show();
    $("#divNewComplaint").html("");
    $("#btnUpdate").hide();
    $("#divComplaintEdit").html("");
    $("#divDetail").html("");
    $("#divDetail").hide();
    $("#divDetail1").html("");
    $("#divDetail2").html("");
    $("#divDetail3").html("");
    $("#divDetailSHC").html('');
    $("#divTab3").html('');
    $("#divTab4").html('');
    $("#divTab5").html('');
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
    ClearAll();

    $("#btnCancel").unbind("click").bind("click", function () {
        $("#divTab3").html("");
        $("#divTab4").html("");
        $("#divTab5").html("");
        $("#tabstrip").hide();
    });

    var subprocess = $(obj).attr("process").toUpperCase();
    currentprocess = subprocess;
    var closestTr = $(obj).closest("tr");
    var ComplaintSNoIndex = 0;
    var awbNoIndex = 0;

    var trLocked = $(".k-grid-header-wrap tr");
    var trRow = $(".k-grid-header-wrap tr");
    ComplaintSNoIndex = trLocked.find("th[data-field='ComplaintSNo']").index();
    awbNoIndex = trLocked.find("th[data-field='AWBNo']").index();

    CurrentAWBNo = closestTr.find("td:eq(" + awbNoIndex + ")").text();
    CurrentComplaintSNo = closestTr.find("td:eq(" + ComplaintSNoIndex + ")").text();

    // alert(CurrentComplaintSNo)
    //$("#tdAWBNo").text(closestTr.find("td:eq(" + awbNoIndex + ")").text());
    //  $("#tdOD").text(closestTr.find("td:eq(" + originIndex + ")").text() + " - " + closestTr.find("td:eq(" + destIndex + ")").text());
    ShowProcessDetails(subprocess, isdblclick, CurrentComplaintSNo);

}

function ShowProcessDetails(subprocess, isdblclick, CurrentComplaintSNo) {
    $("#ulTab").hide();
    CleanUI();
    if (subprocess.toUpperCase() == "COMPLAINTEDIT") {
        ShowProcessDetailsNew("COMPLAINTEDIT", "divComplaintEdit", isdblclick, subprocesssno, CurrentComplaintSNo);
    }
    if (subprocess.toUpperCase() == "ACTION") {
        ShowProcessDetailsNew("ACTION", "divComplaintEdit", isdblclick, subprocesssno, CurrentComplaintSNo);
    }
    if (subprocess.toUpperCase() == "ASSIGN") {
        ShowProcessDetailsNew("ASSIGN", "divComplaintEdit", isdblclick, subprocesssno, CurrentComplaintSNo);
    }
    if (subprocess.toUpperCase() == "EDOXCOMPLAINT") {
        ShowProcessDetailsNew("EDOXCOMPLAINT", "divComplaintEdit", isdblclick, subprocesssno, CurrentComplaintSNo);
    }
    if (subprocess.toUpperCase() == "COMPLAINTVIEW") {
        $("#tabstrip").show();
        $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(0);
        $("body").append("<style>ul.k-tabstrip-items li.k-state-active{border-bottom:3px solid red;}</style>");
        $("#ulTab").show();
        $('#tabstrip ul:first li:eq(0) a').text("Complaint");
        $('#tabstrip ul:first li:eq(1) a').text("Action");
        $('#tabstrip ul:first li:eq(2) a').text("Assign");
        $('#tabstrip ul:first li:eq(3) a').text("Irregularity");
        $('#tabstrip ul:first li:eq(4) a').text("OTHER INFO");
        $('#tabstrip ul:first li:eq(0)').css("background-color", "green");
        $('#tabstrip ul:first li:eq(1)').css("background-color", "");
        $('#tabstrip ul:first li:eq(2)').css("background-color", "");
        $('#tabstrip ul:first li:eq(3)').css("background-color", "");
        $('#tabstrip ul:first li:eq(4)').css("background-color", "");
        $('#tabstrip ul:first li:eq(0) a').show();
        $('#tabstrip ul:first li:eq(1) a').show();
        $('#tabstrip ul:first li:eq(2) a').show();
        $('#tabstrip ul:first li:eq(3) a').show();
        $('#tabstrip ul:first li:eq(4) a').hide();
        ShowProcessDetailsNew("COMPLAINTVIEW", "divDetail", isdblclick, subprocesssno, CurrentComplaintSNo);
        $('#tabstrip ul:first li:eq(0) a').unbind("click").bind("click", function () {
            $('#tabstrip ul:first li:eq(0)').css("background-color", "green");
            $('#tabstrip ul:first li:eq(1)').css("background-color", "");
            $('#tabstrip ul:first li:eq(2)').css("background-color", "");
            $('#tabstrip ul:first li:eq(3)').css("background-color", "");
            $('#tabstrip ul:first li:eq(4)').css("background-color", "");
            $("#ulTab").show();
            ShowProcessDetailsNew("COMPLAINTVIEW", "divDetail", isdblclick, subprocesssno, CurrentComplaintSNo);
        });
        $('#tabstrip ul:first li:eq(1) a').unbind("click").bind("click", function () {
            $('#tabstrip ul:first li:eq(0)').css("background-color", "");
            $('#tabstrip ul:first li:eq(1)').css("background-color", "green");
            $('#tabstrip ul:first li:eq(2)').css("background-color", "");
            $('#tabstrip ul:first li:eq(3)').css("background-color", "");
            $('#tabstrip ul:first li:eq(4)').css("background-color", "");
            //ClearAll();
            $("#ulTab").show();
            ShowProcessDetailsNew("ACTIONHISTORY", "divDetail", isdblclick, subprocesssno, CurrentComplaintSNo);
        });
        $('#tabstrip ul:first li:eq(2) a').unbind("click").bind("click", function () {
            $('#tabstrip ul:first li:eq(0)').css("background-color", "");
            $('#tabstrip ul:first li:eq(1)').css("background-color", "");
            $('#tabstrip ul:first li:eq(2)').css("background-color", "green");
            $('#tabstrip ul:first li:eq(3)').css("background-color", "");
            $('#tabstrip ul:first li:eq(4)').css("background-color", "");
            //ClearAll();
            $("#ulTab").show();
            ShowProcessDetailsNew("ASSIGNHISTORY", "divDetail", isdblclick, subprocesssno, CurrentComplaintSNo);
        });
        $('#tabstrip ul:first li:eq(3) a').unbind("click").bind("click", function () {
            $('#tabstrip ul:first li:eq(0)').css("background-color", "");
            $('#tabstrip ul:first li:eq(1)').css("background-color", "");
            $('#tabstrip ul:first li:eq(2)').css("background-color", "");
            $('#tabstrip ul:first li:eq(3)').css("background-color", "green");
            $('#tabstrip ul:first li:eq(4)').css("background-color", "");
            //ClearAll();
            $("#ulTab").show();
            ShowProcessDetailsNew("IRREGULARITY", "divDetail", isdblclick, subprocesssno, CurrentComplaintSNo);
        });

    }
    if (subprocess.toUpperCase() == "RAISECLAIM") {
        navigateUrl("Default.cshtml?Module=Irregularity&Apps=Claim&FormAction=INDEXVIEW&CurrentComplaintSNo=" + CurrentComplaintSNo);
    }
}

function ShowProcessDetailsNew(subprocess, divID, isdblclick, subprocesssno, CurrentComplaintSNo) {
    if (subprocess == "COMPLAINTEDIT") {
        $.ajax({
            url: "Services/Irregularity/ComplaintService.svc/GetWebForm/Complaint/Irregularity/" + subprocess + "/Edit/1/" + CurrentComplaintSNo + "", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {

                if (result != undefined || result != "") {
                    //GetProcessSequence("Irregularity");
                    $("#divComplaintEdit").html(result);
                    InitializePage(subprocess, divID, isdblclick, subprocesssno, CurrentComplaintSNo);
                }
            },
            beforeSend: function (jqXHR, settings) {
            },
            complete: function (jqXHR, textStatus) {
            },
            error: function (xhr) {

            }
        });
    }
    if (subprocess == "ACTION") {
        $.ajax({
            url: "Services/Irregularity/ComplaintService.svc/GetWebForm/Complaint/Irregularity/" + subprocess + "/New/1/" + CurrentComplaintSNo + "", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {

                if (result != undefined || result != "") {
                    //GetProcessSequence("Irregularity");
                    $("#divComplaintEdit").html(result);
                    InitializePage(subprocess, divID, isdblclick, subprocesssno, CurrentComplaintSNo);
                }
            },
            beforeSend: function (jqXHR, settings) {
            },
            complete: function (jqXHR, textStatus) {
            },
            error: function (xhr) {

            }
        });
    }
    if (subprocess == "ASSIGN") {
        $.ajax({
            url: "Services/Irregularity/ComplaintService.svc/GetWebForm/Complaint/Irregularity/" + subprocess + "/New/1/" + CurrentComplaintSNo + "", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {

                if (result != undefined || result != "") {
                    //GetProcessSequence("Irregularity");
                    $("#divComplaintEdit").html(result);
                    InitializePage(subprocess, divID, isdblclick, subprocesssno, CurrentComplaintSNo);
                }
            },
            beforeSend: function (jqXHR, settings) {
            },
            complete: function (jqXHR, textStatus) {
            },
            error: function (xhr) {

            }
        });
    }
    if (subprocess == "EDOXCOMPLAINT") {
        $.ajax({
            url: "Services/Irregularity/ComplaintService.svc/GetWebForm/Complaint/Irregularity/" + subprocess + "/New/1/" + CurrentComplaintSNo + "", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {

                if (result != undefined || result != "") {
                    //GetProcessSequence("Irregularity");
                    $("#divComplaintEdit").html(result);
                    InitializePage(subprocess, divID, isdblclick, subprocesssno, CurrentComplaintSNo);
                }
            },
            beforeSend: function (jqXHR, settings) {
            },
            complete: function (jqXHR, textStatus) {
            },
            error: function (xhr) {

            }
        });
    }
    if (subprocess == "COMPLAINTVIEW") {
        //$("#divDetail").parent('div').show();
        //$("#divDetail").html(" ");
        $.ajax({
            url: "Services/Irregularity/ComplaintService.svc/GetWebForm/Complaint/Irregularity/" + subprocess + "/New/1/" + CurrentComplaintSNo + "", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {

                if (result != undefined || result != "") {
                    //GetProcessSequence("Irregularity");
                    $("#divDetail").html(result);
                    InitializePage(subprocess, divID, isdblclick, subprocesssno, CurrentComplaintSNo);
                }
            },
            beforeSend: function (jqXHR, settings) {
            },
            complete: function (jqXHR, textStatus) {
            },
            error: function (xhr) {

            }
        });
    }
    if (subprocess == "ACTIONHISTORY") {

        //$("#divDetail").parent('div').show();
        //$("#divTab2").html(" ");
        $.ajax({
            url: "Services/Irregularity/ComplaintService.svc/GetActionHistory", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ CurrentComplaintSNo: CurrentComplaintSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var theDiv = document.getElementById("divTab2");
                theDiv.innerHTML = "";
                var table = "<table class='appendGrid ui-widget' id='tblActionHistory'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Action</td><td class='ui-widget-header'>Action Date</td><td class='ui-widget-header'>Description</td><td class='ui-widget-header'>ComplaintStatus</td><td class='ui-widget-header'>Notify Email</td></tr></thead><tbody class='ui-widget-content'>";
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        for (var i = 0; i < myData.Table0.length; i++) {
                            table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].ComplaintActionName + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ActionDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ActionDescription + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ComplaintStatus + "</td><td class='ui-widget-content first'>" + myData.Table0[i].EmailID + "</td></tr>";
                        }
                        table += "</tbody></table>";
                        theDiv.innerHTML += table;
                    }
                    else {
                        var table = "<table class='appendGrid ui-widget' id='tblActionHistory'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>No Record Found</td></tr></thead></table";
                        theDiv.innerHTML += table;
                    }
                    InitializePage(subprocess, divID, isdblclick, subprocesssno, CurrentComplaintSNo);
                }
                return false
            },
            beforeSend: function (jqXHR, settings) {
            },
            complete: function (jqXHR, textStatus) {
            },
            error: function (xhr) {

            }
        });
    }
    if (subprocess == "ASSIGNHISTORY") {
        //$("#divDetail").parent('div').show();
        //$("#divTab3").html(" ");
        $.ajax({
            url: "Services/Irregularity/ComplaintService.svc/GetAssignHistory", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ CurrentComplaintSNo: CurrentComplaintSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var theDiv = document.getElementById("divTab3");
                theDiv.innerHTML = "";
                var table = "<table class='appendGrid ui-widget' id='tblAssignHistory'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Assigned User</td><td class='ui-widget-header'>Assign Date</td><td class='ui-widget-header'>Assign Message</td></tr></thead><tbody class='ui-widget-content'>";
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        for (var i = 0; i < myData.Table0.length; i++) {
                            table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].UserName + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AssignDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AssignMessage + "</td></tr>";
                        }
                        table += "</tbody></table>";
                        theDiv.innerHTML += table;
                    }
                    else {
                        var table = "<table class='appendGrid ui-widget' id='tblAssignHistory'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>No Record Found</td></tr></thead></table";
                        theDiv.innerHTML += table;
                    }
                    InitializePage(subprocess, divID, isdblclick, subprocesssno, CurrentComplaintSNo);
                }
                return false
            },
            beforeSend: function (jqXHR, settings) {
            },
            complete: function (jqXHR, textStatus) {
            },
            error: function (xhr) {

            }
        });
    }

    if (subprocess == "IRREGULARITY") {
        //$("#divDetail").parent('div').show();
        //$("#divTab4").html(" ");
        $.ajax({
            url: "Services/Irregularity/ComplaintService.svc/GetIrregularityHistory", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ CurrentComplaintSNo: CurrentComplaintSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var theDiv = document.getElementById("divTab4");
                theDiv.innerHTML = "";
                var table = "<table class='appendGrid ui-widget' id='tblIrregularityHistory'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Incident Category</td><td class='ui-widget-header'>Reporting Station</td><td class='ui-widget-header'>AWBNo.</td><td class='ui-widget-header'>Irregularity Status</td><td class='ui-widget-header'>Flight Date</td><td class='ui-widget-header'>Flight Time</td></tr></thead><tbody class='ui-widget-content'>";
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        for (var i = 0; i < myData.Table0.length; i++) {
                            table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].IncidentCategory + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ReportingStation + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AWBNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].IrregularityStatus + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].FlightNo + "</td></tr>";
                        }
                        table += "</tbody></table>";
                        theDiv.innerHTML += table;
                    }
                    else {
                        var table = "<table class='appendGrid ui-widget' id='tblIrregularityHistory'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>No Record Found</td></tr></thead></table";
                        theDiv.innerHTML += table;
                    }
                    InitializePage(subprocess, divID, isdblclick, subprocesssno, CurrentComplaintSNo);
                }
                return false
            },
            beforeSend: function (jqXHR, settings) {
            },
            complete: function (jqXHR, textStatus) {
            },
            error: function (xhr) {

            }
        });
    }
}

function InitializePage(subprocess, cntrlid, isdblclick, subprocesssno, CurrentComplaintSNo) {

    InstantiateControl(cntrlid);
    $('#divDetail3').html("");
    $("#btnChargeNote").hide();
    $("#btnUpdate").hide();
    $("#btnSave").show();
    $("#btnNew").hide();

    if (subprocess.toUpperCase() == "COMPLAINTNEW") {
        cfi.AutoComplete("City", "CityCode,CityName", "vCity", "SNo", "CityCode", ["CityCode", "CityName"]);
        cfi.AutoComplete("ComplainSource", "Name", "v_ComplaintSource", "SNo", "Code", ["Name"]);
        cfi.AutoComplete("ComplaintStatusSNo", "Name", "v_ComplaintSource", "SNo", "Code", ["Name"]);
        cfi.AutoComplete("AWBNo", "AWBNo", "v_ComplaintAirwaybillNo", "AWBNo", "AWBNo", ["AWBNo"]);
        $("input[id='RaisedDate']").parent('span').hide();
        $("span[id='RaisedDate']").html(($("input[id='RaisedDate']").attr("formattedvalue")));
        $('#AWBNo').attr('data-valid', " ");
        $("#btnCancel").show();
        $("#btnSave").show();
        $("#btnSave").attr("tabindex", 21);
        $("#btnCancel").attr("tabindex", 22);
        $("#btnUpdate").attr("tabindex", '');
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess, CurrentComplaintSNo)) {
                    ComplaintGridSearch();
                    ClearAll();
                }
            }
            else {
                return false;
            }
        });
    }
    if (subprocess.toUpperCase() == "COMPLAINTEDIT") {
        cfi.AutoComplete("CitySNo", "CityCode,CityName", "vCity", "SNo", "CityCode", ["CityCode", "CityName"]);
        cfi.AutoComplete("ComplaintStatusSNo", "Name", "v_ComplaintSource", "SNo", "Code", ["Name"]);
        cfi.AutoComplete("AWBNo", "AWBNo", "v_ComplaintAirwaybillNo", "AWBNo", "AWBNo", ["AWBNo"]);
        $("input[id='RaisedDate']").parent('span').hide();
        if ($("#PreliminaryClaim").prop("checked") == true) {
            $('#AWBNo').attr('data-valid', "required");
        }
        else {
            $('#AWBNo').attr('data-valid', " ");
        }
        $('#__tblcomplaintedit__ tr:last').hide();
        $('#__tblcomplaintedit__ tr:first td:first').html("Edit Compliant No. :-<span>" + $("#ComplaintNo").val() + "</span>");
        $("#btnCancel").show();
        $("#btnSave").hide();
        $("#btnUpdate").show();
        $("#btnSave").attr("tabindex", '');
        $("#btnCancel").attr("tabindex", 22);
        $("#btnUpdate").attr("tabindex", 21);
        $("#btnUpdate").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess)) {
                    ComplaintGridSearch();
                    ClearAll();
                }
            }
            else {
                return false;
            }
        });
    }
    if (subprocess.toUpperCase() == "ACTION") {
        cfi.AutoComplete("ComplaintActionStatusSNo", "Name", "v_ComplaintSource", "SNo", "Code", ["Name"]);
        cfi.AutoComplete("ComplaintActionSNo", "Name", "v_ComplaintSource", "SNo", "Code", ["Name"]);
        $("input[id='ActionDate']").parent('span').hide();
        $("span[id='ActionDate']").html(($("input[id='ActionDate']").attr("formattedvalue")));
        $("input[id='EmailId']").hide();
        $("input[id='EmailId']").closest('tr').find('td:eq(4)').html("");
        $('.formfourInputcolumn').css('border', 'none');
        $("#btnCancel").show();
        $("#btnSave").show();
        $("#btnUpdate").hide();
        $("#btnSave").attr("tabindex", 13);
        $("#btnCancel").attr("tabindex", 14);
        $("#btnUpdate").attr("tabindex", '');
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess, CurrentComplaintSNo)) {
                    ComplaintGridSearch();
                    ClearAll();
                }
            }
            else {
                return false;
            }
        });
        $("#Notify").unbind("change").bind("change", function () {
            if ($("#Notify").prop("checked") == true) {
                $("input[id='EmailId']").show();
                $("input[id='EmailId']").closest('tr').find('td:eq(4)').html("<font color='red'>*</font><span id='spnEmailId'> EmailId</span>");
                //$("input[id='EmailId']").closest('tr').find('td:eq(5)').show();
                $('#EmailId').attr('data-valid', "required");
            }
            else {
                $("input[id='EmailId']").hide();
                $("input[id='EmailId']").closest('tr').find('td:eq(4)').html("");
                $('#EmailId').attr('data-valid', "");
                //$("input[id='EmailId']").closest('tr').find('td:eq(5)').hide();
            }
        });
    }
    if (subprocess.toUpperCase() == "ASSIGN") {
        cfi.AutoComplete("UserID", "Name", "v_ComplaintUser", "SNo", "Name", ["Name"]);
        $("input[id='AssignDate']").parent('span').hide();
        $("span[id='AssignDate']").html(($("input[id='AssignDate']").attr("formattedvalue")));
        $("#btnCancel").show();
        $("#btnSave").show();
        $("#btnUpdate").hide();
        $("#btnSave").attr("tabindex", 10);
        $("#btnCancel").attr("tabindex", 11);
        $("#btnUpdate").attr("tabindex", '');
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess, CurrentComplaintSNo)) {
                    ComplaintGridSearch();
                    ClearAll();
                }
            }
            else {
                return false;
            }
        });
    }
    if (subprocess.toUpperCase() == "EDOXCOMPLAINT") {
        $("#btnCancel").show();
        $("#btnSave").show();
        $("#btnUpdate").hide();
        $('.formthreeInputcolumn').css('border', 'none');
        $(".formthreelabel").css('border', 'none');
        BindEDox(CurrentComplaintSNo);
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess, CurrentComplaintSNo)) {
                    ComplaintGridSearch();
                    ClearAll();
                }
            }
            else {
                return false;
            }
        });
    }
    if (subprocess.toUpperCase() == "COMPLAINTVIEW") {
        $("#divDetail").show();
        $("#divTab2").html(" ");
        $("#divTab3").html(" ");
        $("#divTab4").html(" ");
        $("#divTab2").hide();
        $("#divTab3").hide();
        $("#divTab4").hide();
        $("#btnCancel").show();
        $("#btnSave").hide();
        $("#btnUpdate").hide();

        $("#btnSave").attr("tabindex", '');
        $("#btnCancel").attr("tabindex", 8);
        $("#btnUpdate").attr("tabindex", '');

        $("input[id='RaisedDate']").parent('span').hide();
        if ($("input[id='PreliminaryClaim']").val() == "True") {
            $("span[id='PreliminaryClaim']").html("Yes");
        }
        else {
            $("span[id='PreliminaryClaim']").html("No");
        }
    }
    if (subprocess.toUpperCase() == "ACTIONHISTORY") {

        $("#divDetail").hide();
        $("#divDetail").html(" ");
        $("#divTab3").html(" ");
        $("#divTab4").html(" ");
        $("#divTab2").show();
        $("#divTab3").hide();
        $("#divTab4").hide();
        $("#btnCancel").show();
        $("#btnSave").hide();
        $("#btnUpdate").hide();

        $("#btnSave").attr("tabindex", '');
        $("#btnCancel").attr("tabindex", 8);
        $("#btnUpdate").attr("tabindex", '');
    }
    if (subprocess.toUpperCase() == "ASSIGNHISTORY") {
        $("#divDetail").hide();
        $("#divDetail").html(" ");
        $("#divTab2").html(" ");
        $("#divTab4").html(" ");
        $("#divTab2").hide();
        $("#divTab3").show();
        $("#divTab4").hide();
        $("#btnCancel").show();
        $("#btnSave").hide();
        $("#btnUpdate").hide();

        $("#btnSave").attr("tabindex", '');
        $("#btnCancel").attr("tabindex", 8);
        $("#btnUpdate").attr("tabindex", '');
    }

    if (subprocess.toUpperCase() == "IRREGULARITY") {
        $("#divDetail").hide();
        $("#divDetail").html(" ");
        $("#divTab2").html(" ");
        $("#divTab3").html(" ");
        $("#divTab2").hide();
        $("#divTab3").hide();
        $("#divTab4").show();
        $("#btnCancel").show();
        $("#btnSave").hide();
        $("#btnUpdate").hide();

        $("#btnSave").attr("tabindex", '');
        $("#btnCancel").attr("tabindex", 8);
        $("#btnUpdate").attr("tabindex", '');
    }
}


function UpdateNewComplaint() {
    var obj = {};
    obj.ComplainSourceSNo = $("#ComplainSourceSNo").val();
    obj.RaisedDate = $("#RaisedDate").attr("sqldatevalue");
    obj.AWBNo = $("#AWBNo").val();
    obj.AccountNo = $("#AccountNo").val();
    obj.Name = $("#Name").val();
    obj.ContactNo = $("#ContactNo").val();
    obj.Address = $("#Address").val();
    obj.EmailId = $("#EmailId").val();
    obj.CitySNo = $("#CitySNo").val();
    if ($("#PreliminaryClaim").prop("checked") == true) {
        obj.PreliminaryClaim = 1;
    }
    else {
        obj.PreliminaryClaim = 0;
    }
    obj.ComplaintSNo = $("#ComplaintSNo").val();
    obj.Description = $("#Description").val();
    obj.Expectation = $("#Expectation").val();
    obj.ComplaintStatusSNo = $("#ComplaintStatusSNo").val();
    //alert(JSON.stringify(obj));
    var flag = false;
    $.ajax({
        url: "Services/Irregularity/ComplaintService.svc/UpdateComplaint", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ obj: obj }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "0") {
                ShowMessage('success', 'Success - Update Complaint', "Complaint No.:-" + $("#ComplaintNo").val() + " Updated Successfully ", "bottom-right");
                $("#btnUpdate").unbind("click");
                ReloadSameGridPage();
                flag = true;
            }
            else
                ShowMessage('warning', 'Warning -  Update Complaint', "Please correct value(s) for :- " + result + ".", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Update Complaint', " unable to process.", "bottom-right");
        }
    });
    return flag;
}

/******OnchangeAccountNo***********/
$(document).on('change', '#AccountNo', function () {
    if ($(this).val() != null && $(this).val() != "" && $(this).val() != undefined) {
        $.ajax({
            url: "Services/Irregularity/ComplaintService.svc/GetAccountRecords", async: false, type: "GET", dataType: "json", cache: false,
            data: { AccountNo: $(this).val() },
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if ($("#AccountNo").val() != "") {
                    if (result != null) {
                        var AccountData = jQuery.parseJSON(result);
                        var AccountArray = AccountData.Table0;
                        if (AccountArray.length > 0) {
                            for (var i = 0; i < AccountArray.length; i++) {
                                $("#Name").val(AccountArray[i].Name);
                                $("#ContactNo").val(AccountArray[i].Mobile);
                                $("#Address").val(AccountArray[i].Address);
                                $("#EmailId").val(AccountArray[i].Email);
                                $("#CitySNo").val(AccountArray[i].CitySNo);
                                $("#Text_CitySNo").val(AccountArray[i].City);
                            }
                        }
                        else {
                            ShowMessage('warning', 'Warning - Account No.', " Account No. is Invalid.", "bottom-right");
                            $("#AccountNo").val(" ");
                        }
                    }
                }
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - Warning - Account No.', " unable to process.", "bottom-right");
            }
        });
    }
});
$(document).on('change', '#IsPreClaim', function () {
    if ($("#IsPreClaim").prop("checked") == true) {
        $('#AWBNo').attr('data-valid', "required");
    }
    else {
        $('#AWBNo').attr('data-valid', "");
    }
});
$(document).on('change', '#PreliminaryClaim', function () {
    if ($("#PreliminaryClaim").prop("checked") == true) {
        $('#AWBNo').attr('data-valid', "required");
    }
    else {
        $('#AWBNo').attr('data-valid', "");
    }
});
/*****************END***********/

/************* EDOX ************/
function MakeFileMandatory(e) {
    if ($("#" + e).data("kendoAutoComplete").key() != "") {
        $("#" + e).closest('tr').find("[id ^= 'DocsName']").attr("data-valid", "required");
    } else {
        $("#" + e).closest('tr').find("[id ^= 'DocsName']").removeAttr("data-valid");
    }
}

function RemoveFileMandatory(e) {
    if ($("#" + e).val() == "") {
        $("#" + e).closest('tr').find("[id^='DocsName']").removeAttr("data-valid");
    }
}

function BindEDox(CurrentComplaintSNo) {

    $.ajax({
        url: "Services/Irregularity/ComplaintService.svc/GetEdoxAtComplaintSNo?CurrentComplaintSNo=" + CurrentComplaintSNo, async: false, type: "get", dataType: "json", cache: false,
        data: JSON.stringify({ CurrentComplaintSNo: CurrentComplaintSNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var edoxData = jQuery.parseJSON(result);
            var edoxArray = edoxData.Table0;
            $("#divareaTrans_irregularity_complaintedox tr:first").find("font").remove();

            if (edoxArray.length > 0) {
                $("#DocsName").attr("data-valid", " ");
                cfi.makeTrans("irregularity_complaintedox", null, null, BindEDoxDocTypeAutoComplete, ReBindEDoxDocTypeAutoComplete, null, edoxArray, null, true);
                $("#DocsName").attr("data-valid", " ");
            }
            else {
                cfi.makeTrans("irregularity_complaintedox", null, null, BindEDoxDocTypeAutoComplete, ReBindEDoxDocTypeAutoComplete, null, edoxArray, null, false);
                $(this).find("input[type='file']").css('width', '');
                $(this).find("input[type='file']").attr("data-valid-msg", "Attach Document");
            }
            $("div[id$='areaTrans_irregularity_complaintedox']").find("[id='areaTrans_irregularity_complaintedox']").each(function () {
                $(this).find("input[id^='DocType']").each(function () {
                    cfi.AutoComplete($(this).attr("name"), "DocumentName", "EDoxdocumenttype", "SNo", "DocumentName", null, MakeFileMandatory, "contains");
                });

                $(this).find("input[id^='Text_DocType']").attr('required', 'required');
                $(this).find("input[id^='Text_DocType']").attr('data-valid', 'required');
                $(this).find("input[id^='Text_DocType']").unbind("blur").bind("blur", function () {
                    RemoveFileMandatory($(this).closest('td').find("input[id^='Text_DocType']").attr("id"));
                });

                $(this).find("input[id^='DocsName']").each(function () {
                    $(this).unbind("change").bind("change", function () {
                        UploadEDoxDocument($(this).attr("id"), "DocName");
                        WrapSelectedFileName();
                    })
                });
                $(this).find("a[id^='ahref_DocName']").each(function () {
                    $(this).unbind("click").bind("click", function () {
                        DownloadEDoxDocument($(this).attr("id"), "DocName");
                    })
                });
                $(this).find("input[type='file']").css('width', '');
                $(this).find("input[type='file']").attr("data-valid-msg", "Attach Document");
            });

        },
        error: {
        }
    });
}

function BindEDoxDocTypeAutoComplete(elem, mainElem) {

    $(elem).find("input[id^='DocType']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "DocumentName", "EDoxdocumenttype", "SNo", "DocumentName", null, MakeFileMandatory, "contains");
    });

    //$(elem).find("span[type='DocName']").attr("data-valid-msg", "Attach Document");
    $(elem).find("input[id^='DocsName']").each(function () {
        $(this).unbind("change").bind("change", function () {
            UploadEDoxDocument($(this).attr("id"), "DocName");
            WrapSelectedFileName();
        })
    });
    $(elem).find("a[id^='ahref_DocName']").each(function () {
        $(this).unbind("click").bind("click", function () {
            DownloadEDoxDocument($(this).attr("id"), "DocName");
        })
    });

    WrapSelectedFileName();

}

function ReBindEDoxDocTypeAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_irregularity_complaintedox']").find("[id^='areaTrans_irregularity_complaintedox']").each(function () {
        $(this).find("input[id^='DocType']").each(function () {
            var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "EDoxdocumenttype", "SNo", "DocumentName");
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false, MakeFileMandatory);
        });
        $(this).find("input[id^='DocsName']").unbind("change").bind("change", function () {
            UploadEDoxDocument($(this).attr("id"), "DocName");
            WrapSelectedFileName();
        })
        $(this).find("a[id^='ahref_DocName']").unbind("click").bind("click", function () {
            DownloadEDoxDocument($(this).attr("id"), "DocName");
        })
    });
}

function UploadEDoxDocument(objId, nexctrlid) {
    var flag = true;
    var fileSelect = document.getElementById(objId);
    var files = fileSelect.files;
    var fileName = "";
    var data = new FormData();

    if (files['0'].size > 4096000) {
        $("input[type='file']").val(null);
        ShowMessage('info', 'File Upload!', "Document size has exceeded it max limit of 4MB.", "bottom-right");
        flag = false;
        return false
    }

    for (var i = 0; i < files.length; i++) {
        fileName = files[i].name;
        data.append(files[i].name, files[i]);
    }

    if (flag == true) {
        $.ajax({
            url: "Handler/FileUploadHandler.ashx",
            type: "POST",
            data: data,
            contentType: false,
            processData: false,
            success: function (result) {
                $("#" + objId).closest("tr").find("a[id^='ahref_" + nexctrlid + "']").attr("linkdata", result.split('#eDox#')[0]);
                $("#" + objId).closest("tr").find("span[id^='" + nexctrlid + "']").text(result.split('#eDox#')[1]);
            },
            error: function (err) {
                ShowMessage('info', 'File Upload!', "Unable to upload selected file. Please try again.", "bottom-right");
            }
        });
    }
}

function DownloadEDoxDocument(objId, nexctrlid) {
    if ($("#" + objId).attr("linkdata") != undefined && $("#" + objId).attr("linkdata") != "") {
        window.location.href = "Handler/FileUploadHandler.ashx?l=e-Dox&f=" + $("#" + objId).attr("linkdata");
    }
    else {
        ShowMessage('info', 'Download!', "Invalid attempt.", "bottom-right");
    }
}

function DownloadEDoxFromDB(DocSNo, DocFlag) {
    if (parseInt(DocSNo) > 0) {
        window.location.href = "Handler/FileUploadHandler.ashx?ImportDocSNo=" + DocSNo + "&ImportDocFlag=" + DocFlag;
    }
    else {
        ShowMessage('info', 'Download!', "Invalid attempt.", "bottom-right");
    }
}

function SaveEDoxList(CurrentComplaintSNo) {
    if (cfi.IsValidTransSection('divareaTrans_irregularity_complaintedox')) {
        var EDoxArray = [];
        var SPHCDoxArray = [];
        var EDoxCheckListArray = [];
        //var AllEDoxReceived = ($("[id='XRay']:checked").val() == 'on');
        var Remarks = $("#Remarks").val();
        var edoxFlag = true;
        //var edoxChecklistFlag = true;
        var flag = true;
        $("div[id$='areaTrans_irregularity_complaintedox']").find("[id^='areaTrans_irregularity_complaintedox']").each(function () {
            var eDoxViewModel = {
                EDoxdocumenttypeSNo: $(this).find("input[id^='Text_DocType']").data("kendoAutoComplete").key(),
                DocName: $(this).find("span[id^='DocName']").text(),
                AltDocName: $(this).find("a[id^='ahref_DocName']").attr("linkdata") == undefined ? "" : $(this).find("a[id^='ahref_DocName']").attr("linkdata"),
                ReferenceNo: $(this).find("input[id^='Reference']").val(),
                Remarks: $(this).find("textarea[id^='Doc_Remarks']").val()
            };
            EDoxArray.push(eDoxViewModel);
        });

        for (var i = 0; i < EDoxArray.length; i++) {
            if (EDoxArray[i].EDoxdocumenttypeSNo == "")
                edoxFlag = false;
        }

        if (edoxFlag == false) {
            ShowMessage('warning', 'Warning - Document Info', "AWB No. [hii] -  Select checklist Doc Type or Process Type.", "bottom-right");
            flag = false;
            return false;
        }

        if (edoxFlag == true) {
            $("div[id$='areaTrans_irregularity_complaintedox']").find("[id^='areaTrans_irregularity_complaintedox']").each(function (i, row) {
                if ($(this).find("input[id^='DocType']").val() != "" && $(this).find("a[id^='ahref_DocName']").attr("linkdata") == "") {
                    ShowMessage('warning', 'Warning - Document Info', "AWB No. [] -  Doc Type Attachment not found.", "bottom-right");
                    flag = false;
                    return false;
                }
            });
        }

        // alert(JSON.stringify(EDoxArray))
        //return false;
        if (flag == true) {
            $.ajax({
                url: "Services/Irregularity/ComplaintService.svc/SaveComplaintEDoxDetail", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ CurrentComplaintSNo: parseInt(CurrentComplaintSNo), ComplaintEDoxDetail: EDoxArray }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result == "0") {
                        ShowMessage('success', 'Success - e-Dox Information', "Complaint No. [" + CurrentComplaintSNo + "] -  Saved Successfully", "bottom-right");
                        flag = true;
                    }
                    else
                        ShowMessage('warning', 'Warning - e-Dox Information', "Complaint No. [" + CurrentComplaintSNo + "] -  unable to process.", "bottom-right");
                },
                error: function (xhr) {
                    ShowMessage('warning', 'Warning - e-Dox Information', "Complaint No. [" + CurrentComplaintSNo + "] -  unable to process.", "bottom-right");
                },
                complete: function (xhr) {
                    $("div[id$='areaTrans_irregularity_complaintedox']").find("[id^='areaTrans_irregularity_complaintedox']").each(function () {
                        $(this).find("a[id^='ahref_docname']").attr("linkdata", '');
                    });
                }
            });
        }
        return flag;
    }
}

function WrapSelectedFileName() {
    $("div[id$='areaTrans_irregularity_complaintedox']").find("[id^='areaTrans_irregularity_complaintedox']").each(function () {
        $(this).find("span[id^='DocName']").closest('td').css("white-space", "inherit");
        $(this).find("input[type='file'][id^='DocsName']").css('width', '');
        $(this).find("input[id^='Text_DocType']").parent('span').css('width', '120px');
    });

}

/************* EDOX END ************/

function ReloadSameGridPage() {
    var gridPage = $(".k-pager-input").find("input").val();
    var grid = $(".k-grid").data("kendoGrid");
    grid.dataSource.page(gridPage);
    var trLocked = $(".k-grid-header-wrap tr");
    var trRow = $(".k-grid-header-wrap tr");
    ComplaintSNoIndex = trLocked.find("th[data-field='ComplaintSNo']").index();
    awbNoIndex = trLocked.find("th[data-field='AWBNo']").index();

    //CurrentAWBNo = closestTr.find("td:eq(" + awbNoIndex + ")").text();
    CurrentComplaintSNo = trLocked.find("td:eq(" + ComplaintSNoIndex + ")").text();
}

function SaveAction(CurrentComplaintSNo) {
    var obj = {};
    obj.ComplaintSNo = CurrentComplaintSNo
    obj.ComplaintActionSNo = $("#ComplaintActionSNo").val();
    obj.ActionDate = $("#ActionDate").attr("sqldatevalue");
    obj.ActionDescription = $("#ActionDescription").val();
    obj.ComplaintActionStatusSNo = $("#ComplaintActionStatusSNo").val();
    if ($("#Notify").prop("checked") == true) {
        obj.IsNotify = 1;
    }
    else {
        obj.IsNotify = 0;
    }
    obj.EmailId = $("#EmailId").val();
    var flag = false;
    $.ajax({
        url: "Services/Irregularity/ComplaintService.svc/SaveAction", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ obj: obj }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "0") {
                ShowMessage('success', 'Success - Complaint Action', "Complaint Action Saved Successfully ", "bottom-right");
                $("#btnSave").unbind("click");
                ReloadSameGridPage();
                flag = true;
            }
            else
                ShowMessage('warning', 'Warning -  Complaint Action', "Please correct value(s) for :- " + result + ".", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning -Complaint Action', " unable to process.", "bottom-right");
        }
    });
    return flag;
}

function SaveAssign(CurrentComplaintSNo) {

    var obj = {};
    obj.ComplaintSNo = CurrentComplaintSNo
    obj.UserID = $("#UserID").val();
    obj.AssignDate = $("#AssignDate").attr("sqldatevalue");
    obj.AssignMessage = $("#AssignMessage").val();

    var flag = false;
    $.ajax({
        url: "Services/Irregularity/ComplaintService.svc/SaveAssign", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ obj: obj }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "0") {
                ShowMessage('success', 'Success - Complaint Assign', "Complaint Assign  Successfully ", "bottom-right");
                $("#btnSave").unbind("click");
                ReloadSameGridPage();
                flag = true;
            }
            else
                ShowMessage('warning', 'Warning -  Complaint Assign', "Please correct value(s) for :- " + result + ".", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning -Complaint Assign', " unable to process.", "bottom-right");
        }
    });
    return flag;
}

function ExtraCondition(textId) {

    var filterComplain = cfi.getFilter("AND");
    if (textId.indexOf("Text_ComplainSource") >= 0) {
        cfi.setFilter(filterComplain, "ApplicationSNo", "eq", 1);
        var ComplainAutoCompleteFilter = cfi.autoCompleteFilter(filterComplain);
        return ComplainAutoCompleteFilter;
    }
    if (textId.indexOf("Text_ComplaintStatusSNo") >= 0) {
        cfi.setFilter(filterComplain, "ApplicationSNo", "eq", 3);
        var ComplainAutoCompleteFilter = cfi.autoCompleteFilter(filterComplain);
        return ComplainAutoCompleteFilter;
    }
    if (textId.indexOf("Text_ComplaintActionSNo") >= 0) {
        cfi.setFilter(filterComplain, "ApplicationSNo", "eq", 4);
        var ComplainAutoCompleteFilter = cfi.autoCompleteFilter(filterComplain);
        return ComplainAutoCompleteFilter;
    }
    if (textId.indexOf("Text_ComplaintActionStatusSNo") >= 0) {
        cfi.setFilter(filterComplain, "ApplicationSNo", "eq", 3);
        var ComplainAutoCompleteFilter = cfi.autoCompleteFilter(filterComplain);
        return ComplainAutoCompleteFilter;
    }

}



var pageType = $('#hdnPageType').val();
var fotter = "<div><table style='margin-left:20px;'>" +
                        "<tbody><tr><td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-primary btn-sm' style='width:125px;' id='btnNew'>New Complaint</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-success btn-sm' style='display:none'  id='btnSave'>Save</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-success btn-sm' style='display:none'  id='btnUpdate'>Update</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            //"<td><button class='btn btn-block btn-success btn-sm' style='display:none' id='btnSaveToNext'>Save &amp; New</button></td>" +
                            //"<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-danger btn-sm' style='display:none' id='btnCancel'>Cancel</button></td>" +
                            //"<td><button class='btn btn-block btn-success btn-sm' style='display:none'  id='btnChargeNote'>Charge Note</button></td>" +
                            //"<td> &nbsp; &nbsp;</td>" +
                            // "<td><button class='btn btn-block btn-success btn-sm' style='display:none'  id='btnPrintDLV'>Print DLV Slip</button></td>" +
                            //"<td> &nbsp; &nbsp;</td>" +
                            // "<td><button class='btn btn-block btn-success btn-sm' style='display:none'  id='btnPrint'>Print</button></td>" +
                            //"<td> &nbsp; &nbsp;</td>" +
                        "</tr></tbody></table> </div>";


var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divComplaintDetails' style='width:100%'></div></td></tr><tr><td valign='top'><div id='divNewComplaint' style='width:100%'></div></td></tr><tr><td valign='top'><div id='divComplaintEdit' style='width:100%'></div></td></tr><tr> <td valign='top'> <table style='width:100%'> <tr> <td style='width:100%;' valign='top' class='tdInnerPadding'> <div id='tabstrip'> <ul id='ulTab' style='display:none;'> <li class='k-state-active'> Genral </li><li> SPHC Wise </li><li>Tab 3</li><li>Tab 4</li><li>Tab 5</li></ul> <div> <div id='divDetail'></div><div id='divDetail1'></div><div id='divDetail2'></div><div id='divDetail3'></div></div> <div> <div id='divTab2'> </div></div><div><div id='divTab3'></div></div><div><div id='divTab4'></div></div><div><div id='divTab5'></div></div></div></div></td></tr></table></td></tr></table></div>";
