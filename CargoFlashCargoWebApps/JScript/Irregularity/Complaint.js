

var ComplaintDataSource = [{ Key: "1", Text: "YES" }, { Key: "0", Text: "NO" }];

$(function () {
    $("#btnSave").hide();
    MasterDeliveryOrder();
    UserPageRights("COMPLAINT")
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
            cfi.AutoCompleteByDataSource("SearchClaim", ComplaintDataSource);
            cfi.AutoCompleteV2("searchComplainStatus", "Name", "Complaint_ComplainStatus", null, "contains");
            cfi.AutoCompleteV2("searchAWBNo", "AWBNo", "Complaint_AWBNo", null, "contains");
            cfi.AutoCompleteV2("searchComplainNo", "ComplaintNo", "Complaint_ComplaintNo", null, "contains");
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
            if (isCreate == false) {
                $("#btnNew").hide()
            } else {
                $("#btnNew").show()
            }
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

    if (isCreate == false) {
        $("#btnNew").hide()
    } else {
        $("#btnNew").show()
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
    // $("input[name='SearchIncludeTransitAWB']").hide();
    //$("#SearchIncludeTransitAWB").after("Include Transit AWB");
    //    $("#SearchExcludeDeliveredAWB").after("Exclude Delivered AWB");
}

function ComplaintGridSearch() {
    var searchComplainNo = $("#searchComplainNo").val() == "" ? "0" : $("#searchComplainNo").val();
    var searchComplainStatus = $("#searchComplainStatus").val() == "" ? "0" : $("#searchComplainStatus").val();
    var searchAWBNo = $("#searchAWBNo").val() == "" ? "0" : $("#searchAWBNo").val();
    var SearchClaim = $("#SearchClaim").val() == "" ? "2" : $("#SearchClaim").val();
    var LoggedInCity = userContext.CitySNo;
    var searchFromDate = "0";
    var searchToDate = "0";
    if ($("#searchFromDate").val() != "") {
        searchFromDate = cfi.CfiDate("searchFromDate") == "" ? "0" : cfi.CfiDate("searchFromDate");// "";//month + "-" + day + "-" + year;
    }

    if ($("#searchToDate").val() != "") {
        searchToDate = cfi.CfiDate("searchToDate") == "" ? "0" : cfi.CfiDate("searchToDate");// "";//month + "-" + day + "-" + year;
    }

    if (_CURR_PRO_ == "COMPLAINT") {
        MyIndexView("divComplaintDetails", "/Services/Irregularity/ComplaintService.svc/GetGridData");
    }
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
        processName: 'COMPLAINT',
        moduleName: 'Irregularity',
        appName: 'Complaint',
        searchComplainNo: $("#searchComplainNo").val() == "" ? "0" : $("#searchComplainNo").val(),
        searchComplainStatus: $("#searchComplainStatus").val() == "" ? "0" : $("#searchComplainStatus").val(),
        searchAWBNo: $("#searchAWBNo").val() == "" ? "0" : $("#searchAWBNo").val(),
        SearchClaim: $("#SearchClaim").val() == "" ? "2" : $("#SearchClaim").val(),
        LoggedInCity: userContext.CitySNo,
        searchFromDate: cfi.CfiDate("searchFromDate") == "" ? "0" : cfi.CfiDate("searchFromDate"),// "";//month + "-" + day + "-" + year;
        searchToDate: cfi.CfiDate("searchToDate") == "" ? "0" : cfi.CfiDate("searchToDate"),// "";//month + "-" + day + "-" + year;
        RecID: "0",
    })
}

function OnSuccessGrid() {
    var TrHeader = $("div[id$='divComplaintDetails']").find("div[class^='k-grid-header'] thead tr");
    var IsClosedIndex = TrHeader.find("th[data-field='IsClosed']").index();
    var IsAssignIndex = TrHeader.find("th[data-field='IsAssign']").index();
    var IsEditIndex = TrHeader.find("th[data-field='IsEdit']").index();
    var IsActionIndex = TrHeader.find("th[data-field='IsAction']").index();
    var IsEdoxIndex = TrHeader.find("th[data-field='IsEdox']").index();
    var IsPreClaimIndex = TrHeader.find("th[data-field='Claim']").index();
    var currentComplaintSNoIndex = TrHeader.find("th[data-field='ComplaintSNo']").index();
    $("div[id$='divComplaintDetails']").find("div[class^='k-grid-content'] tbody tr").each(function (row, tr) {
        $(tr).closest('td').find("input[process='COMPLAINTEDIT']:eq(" + row + ")").attr("class", "incompleteprocess");
        $(tr).closest('td').find("input[process='ACTION']:eq(" + row + ")").attr("class", "incompleteprocess");
        $(tr).closest('td').find("input[process='ASSIGN']:eq(" + row + ")").attr("class", "incompleteprocess");
        $(tr).closest('td').find("input[process='RAISECLAIM']:eq(" + row + ")").attr("class", "incompleteprocess");
        $(tr).closest('td').find("input[process='COMPLAINTVIEW']:eq(" + row + ")").attr("class", "incompleteprocess");
        $(tr).closest('td').find("input[process='EDOXCOMPLAINT']:eq(" + row + ")").attr("class", "incompleteprocess");
        if ($(tr).find("td:eq(" + IsPreClaimIndex + ")").text() == "No") {
            if ($(tr).closest('td').find("input[process='RAISECLAIM']").val() == "RClaim") {
                $(tr).closest('td').find("input[process='RAISECLAIM']:eq(" + row + ")").prop("disabled", true);
            }
        }

        if (($(tr).find("td:eq(" + IsClosedIndex + ")").text() == "true")) {
            $(tr).closest('td').find("input[process='COMPLAINTEDIT']:eq(" + row + ")").prop("disabled", true);
            $(tr).closest('td').find("input[process='ACTION']:eq(" + row + ")").prop("disabled", true);
            $(tr).closest('td').find("input[process='ASSIGN']:eq(" + row + ")").prop("disabled", true);
            $(tr).closest('td').find("input[process='RAISECLAIM']:eq(" + row + ")").prop("disabled", true);

            $(tr).closest('td').find("input[process='COMPLAINTEDIT']:eq(" + row + ")").attr("class", "completeprocess");
            $(tr).closest('td').find("input[process='ACTION']:eq(" + row + ")").attr("class", "completeprocess");
            $(tr).closest('td').find("input[process='ASSIGN']:eq(" + row + ")").attr("class", "completeprocess");
            $(tr).closest('td').find("input[process='RAISECLAIM']:eq(" + row + ")").attr("class", "completeprocess");
            $(tr).closest('td').find("input[process='COMPLAINTVIEW']:eq(" + row + ")").attr("class", "completeprocess");
            $(tr).closest('td').find("input[process='EDOXCOMPLAINT']:eq(" + row + ")").attr("class", "completeprocess");
        }
        else {
            if (($(tr).find("td:eq(" + IsEditIndex + ")").text() == "true")) {
                // $(tr).closest('td').find("input[process='COMPLAINTEDIT']:eq(" + row + ")").attr("class", "partialprocess");
                $(tr).closest('td').find("input[process='COMPLAINTVIEW']:eq(" + row + ")").attr("class", "partialprocess");

            }
            if (($(tr).find("td:eq(" + IsAssignIndex + ")").text() == "true")) {
                // $(tr).closest('td').find("input[process='COMPLAINTEDIT']:eq(" + row + ")").prop("disabled", true);
                $(tr).closest('td').find("input[process='COMPLAINTEDIT']:eq(" + row + ")").attr("class", "completeprocess");
                $(tr).closest('td').find("input[process='RAISECLAIM']:eq(" + row + ")").attr("class", "incompleteprocess");
                $(tr).closest('td').find("input[process='COMPLAINTVIEW']:eq(" + row + ")").attr("class", "partialprocess");
                $(tr).closest('td').find("input[process='ASSIGN']:eq(" + row + ")").attr("class", "partialprocess");
            }
            if (($(tr).find("td:eq(" + IsActionIndex + ")").text() == "true")) {
                //$(tr).closest('td').find("input[process='COMPLAINTEDIT']:eq(" + row + ")").prop("disabled", true);
                $(tr).closest('td').find("input[process='COMPLAINTEDIT']:eq(" + row + ")").attr("class", "completeprocess");
                $(tr).closest('td').find("input[process='ACTION']:eq(" + row + ")").attr("class", "partialprocess");
                $(tr).closest('td').find("input[process='COMPLAINTVIEW']:eq(" + row + ")").attr("class", "partialprocess");

            }
            if (($(tr).find("td:eq(" + IsEdoxIndex + ")").text() == "true")) {
                //$(tr).closest('td').find("input[process='COMPLAINTEDIT']:eq(" + row + ")").prop("disabled", true);
                //$(tr).closest('td').find("input[process='COMPLAINTEDIT']:eq(" + row + ")").attr("class", "completeprocess");
                $(tr).closest('td').find("input[process='EDOXCOMPLAINT']:eq(" + row + ")").attr("class", "partialprocess");
                $(tr).closest('td').find("input[process='RAISECLAIM']:eq(" + row + ")").attr("class", "incompleteprocess");
                $(tr).closest('td').find("input[process='COMPLAINTVIEW']:eq(" + row + ")").attr("class", "partialprocess");

            }
            // if (($(tr).find("td:eq(" + IsEdoxIndex + ")").text() == "false") && ($(tr).find("td:eq(" + IsEdoxIndex + ")").text() == "true")) {
            //    $(tr).closest('td').find("input[process='COMPLAINTEDIT']:eq(" + row + ")").attr("class", "incompleteprocess");
            //    $(tr).closest('td').find("input[process='ACTION']:eq(" + row + ")").attr("class", "incompleteprocess");
            //    $(tr).closest('td').find("input[process='ASSIGN']:eq(" + row + ")").attr("class", "incompleteprocess");
            //    $(tr).closest('td').find("input[process='RAISECLAIM']:eq(" + row + ")").attr("class", "incompleteprocess");
            //    $(tr).closest('td').find("input[process='COMPLAINTVIEW']:eq(" + row + ")").attr("class", "incompleteprocess");
            //    $(tr).closest('td').find("input[process='EDOXCOMPLAINT']:eq(" + row + ")").attr("class", "incompleteprocess");
            //}
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

$(document).on("click", "#btnCancel", function () {
    ClearAll();
    CleanUI();
    ReloadSameGridPage();
    $("#btnNew").css('display', 'block');
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

var AWBNo = "";

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
    CleanUI();
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
    var IsClosedIndex;
    var IsAssignIndex;
    var IsClosed;
    var IsAssign;
    var AWBNoIndex;

    var trLocked = $(".k-grid-header-wrap tr");
    var trRow = $(".k-grid-header-wrap tr");
    ComplaintSNoIndex = trLocked.find("th[data-field='ComplaintSNo']").index();
    IsClosedIndex = trLocked.find("th[data-field='IsClosed']").index();
    IsAssignIndex = trLocked.find("th[data-field='IsAssign']").index();
    AWBNoIndex = trLocked.find("th[data-field='AWBNo']").index();


    IsClosed = closestTr.find("td:eq(" + IsClosedIndex + ")").text();
    IsAssign = closestTr.find("td:eq(" + IsAssignIndex + ")").text();
    AWBNo = closestTr.find("td:eq(" + AWBNoIndex + ")").text();

    if (IsClosed == "true") {
        $("#btnSave").hide();
    }
    else {
        $("#btnSave").show();
    }
    CurrentComplaintSNo = closestTr.find("td:eq(" + ComplaintSNoIndex + ")").text();

    ShowProcessDetails(subprocess, isdblclick, CurrentComplaintSNo);

}

function ShowProcessDetails(subprocess, isdblclick, CurrentComplaintSNo) {
    $("#ulTab").hide();

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
        $('#tabstrip ul:first li:eq(4) a').text("AWB Details");
        $('#tabstrip ul:first li:eq(0)').css("background-color", "green");
        $('#tabstrip ul:first li:eq(1)').css("background-color", "");
        $('#tabstrip ul:first li:eq(2)').css("background-color", "");
        $('#tabstrip ul:first li:eq(3)').css("background-color", "");
        $('#tabstrip ul:first li:eq(4)').css("background-color", "");
        $('#tabstrip ul:first li:eq(0) a').show();
        $('#tabstrip ul:first li:eq(1) a').show();
        $('#tabstrip ul:first li:eq(2) a').show();
        $('#tabstrip ul:first li:eq(3) a').show();
        if (AWBNo != "") {
            $('#tabstrip ul:first li:eq(4) a').show();
        }
        else {
            $('#tabstrip ul:first li:eq(4) a').hide();
        }
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
            $("#ulTab").show();
            ShowProcessDetailsNew("ACTIONHISTORY", "divDetail", isdblclick, subprocesssno, CurrentComplaintSNo);
        });
        $('#tabstrip ul:first li:eq(2) a').unbind("click").bind("click", function () {
            $('#tabstrip ul:first li:eq(0)').css("background-color", "");
            $('#tabstrip ul:first li:eq(1)').css("background-color", "");
            $('#tabstrip ul:first li:eq(2)').css("background-color", "green");
            $('#tabstrip ul:first li:eq(3)').css("background-color", "");
            $('#tabstrip ul:first li:eq(4)').css("background-color", "");
            $("#ulTab").show();
            ShowProcessDetailsNew("ASSIGNHISTORY", "divDetail", isdblclick, subprocesssno, CurrentComplaintSNo);
        });
        $('#tabstrip ul:first li:eq(3) a').unbind("click").bind("click", function () {
            $('#tabstrip ul:first li:eq(0)').css("background-color", "");
            $('#tabstrip ul:first li:eq(1)').css("background-color", "");
            $('#tabstrip ul:first li:eq(2)').css("background-color", "");
            $('#tabstrip ul:first li:eq(3)').css("background-color", "green");
            $('#tabstrip ul:first li:eq(4)').css("background-color", "");
            $("#ulTab").show();
            ShowProcessDetailsNew("IRREGULARITY", "divDetail", isdblclick, subprocesssno, CurrentComplaintSNo);
        });
        $('#tabstrip ul:first li:eq(4) a').unbind("click").bind("click", function () {
            $('#tabstrip ul:first li:eq(0)').css("background-color", "");
            $('#tabstrip ul:first li:eq(1)').css("background-color", "");
            $('#tabstrip ul:first li:eq(2)').css("background-color", "");
            $('#tabstrip ul:first li:eq(3)').css("background-color", "");
            $('#tabstrip ul:first li:eq(4)').css("background-color", "green");
            $("#ulTab").show();
            ShowProcessDetailsNew("COMPLAINTAWBDETAILS", "divDetail", isdblclick, subprocesssno, CurrentComplaintSNo);
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
                    AuditLogBindOldValue("divComplaintEdit");
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
                var table = "<table class='appendGrid ui-widget' id='tblActionHistory'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Action</td><td class='ui-widget-header'>Action Date</td><td class='ui-widget-header'>Description</td><td class='ui-widget-header'>ComplaintStatus</td><td class='ui-widget-header'>Notify Email</td><td class='ui-widget-header'>Raised By</td></tr></thead><tbody class='ui-widget-content'>";
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        for (var i = 0; i < myData.Table0.length; i++) {
                            table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].ComplaintActionName + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ActionDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ActionDescription + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ComplaintStatus + "</td><td class='ui-widget-content first'>" + myData.Table0[i].EmailId + "</td><td class='ui-widget-content first'>" + myData.Table0[i].RaisedBy + "</td></tr>";
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
                var table = "<table class='appendGrid ui-widget' id='tblAssignHistory'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Assigned City</td><td class='ui-widget-header'>Assigned User</td><td class='ui-widget-header'>Assign Date</td><td class='ui-widget-header'>Assign Message</td><td class='ui-widget-header'>Assign By</td></tr></thead><tbody class='ui-widget-content'>";
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        for (var i = 0; i < myData.Table0.length; i++) {
                            table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].CityName + "</td><td class='ui-widget-content first'>" + myData.Table0[i].UserName + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AssignDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].AssignMessage + "</td><td class='ui-widget-content first'>" + myData.Table0[i].CreatedBy + "</td></tr>";
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
                var table = "<table class='appendGrid ui-widget' id='tblIrregularityHistory'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Incident Category</td><td class='ui-widget-header'>Reporting Station</td><td class='ui-widget-header'>AWBNo.</td><td class='ui-widget-header'>Irregularity Status</td><td class='ui-widget-header'>Flight Date</td><td class='ui-widget-header'>Flight No.</td></tr></thead><tbody class='ui-widget-content'>";
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
    if (subprocess == "COMPLAINTAWBDETAILS") {
        $.ajax({
            url: "Services/Irregularity/ComplaintService.svc/GetWebForm/Complaint/Irregularity/" + subprocess + "/New/1/" + CurrentComplaintSNo + "", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result != undefined || result != "") {
                    $("#divTab5").html(result);
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
}
/*************************Multiple Email***********/

function SetEMailNew() {
    // var arm = $("#Email").val().toUpperCase()
    $("#EmailId").keyup(function (e) {
        var addlen = $("#EmailId").val().toUpperCase();
        var iKeyCode = (e.which) ? e.which : e.keyCode
        if (iKeyCode == 32) {
            addlen = addlen.slice(0, -1);
            if (addlen != "") {
                if (ValidateEMail(addlen)) {
                    if ($("ul#addlist2 li").length >= 0) {
                        //-------added by arman For Duplicate Email --------------
                        var abc = $("#addlist2 li span").text().split(' ')
                        if (abc.includes(addlen)) {
                            ShowMessage('warning', 'Warning - Complaint', "Email Already Entered");
                            $("#EmailId").val('');
                        }
                            //---------------end
                        else {
                            var listlen = $("ul#addlist2 li").length;
                            $("ul#addlist2").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + addlen + " </span><span id='" + listlen + "' class='k-icon k-delete remove'></span></li>");
                        }
                    }
                    else {
                        ShowMessage('warning', 'Warning - Complaint', "Maximum 3 E-mail Addresses allowed.");
                    }
                    $("#EmailId").val('');
                    $("#EmailId").removeAttr('data-valid');
                }
                else {
                    ShowMessage('warning', 'Warning - Complaint', "Please enter valid Email Address.");
                    $("#EmailId").val('');
                }
            }
        }
        else
            e.preventDefault();
    });
    //$("#EmailId").blur(function () {
    //    $("#EmailAddress").val('');
    //});

    $("body").on("click", ".remove", function () {
        $(this).closest("li").remove();

        if ($("ul#addlist2 li").length == 0) {
            $("#EmailId").attr('data-valid', 'required');
        }
        else {
            $("#EmailId").removeAttr('data-valid');
        }
    });
}

function ValidateEMail(email) {
    var regex = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;;
    return regex.test(email);
}

function RequiredEmail() {
    $("#EmailId").attr('data-valid', 'required');
    $("#EmailId").attr('data-valid-msg', 'Email cannot be blank');
    if (parseInt($("#addlist2 li").length) > 0) {
        $("#EmailId").removeAttr('data-valid');
    }
    else {
        $("#EmailId").val('');
        $("#EmailId").attr('data-valid', 'required');
    }
}

function SetEMailNewAction() {
    $("#EmailId").keyup(function (e) {
        var addlen = $("#EmailId").val().toUpperCase();
        var iKeyCode = (e.which) ? e.which : e.keyCode
        if (iKeyCode == 32) {
            addlen = addlen.slice(0, -1);
            if (addlen != "") {
                if (ValidateEMail(addlen)) {
                    if ($("ul#addlist2 li").length >= 0) {
                        //-------added by arman For Duplicate Email --------------
                        var abc = $("#addlist2 li span").text().split(' ')
                        if (abc.includes(addlen)) {
                            ShowMessage('warning', 'Warning - Action', "Email Already Entered");
                            $("#EmailId").val('');
                        }
                            //---------------end
                        else {
                            var listlen = $("ul#addlist2 li").length;
                            $("ul#addlist2").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + addlen + " </span><span id='" + listlen + "' class='k-icon k-delete remove'></span></li>");
                        }
                    }
                    else {
                        ShowMessage('warning', 'Warning - Action', "Maximum 3 E-mail Addresses allowed.");
                    }
                    $("#EmailId").val('');
                    $("#EmailId").removeAttr('data-valid');
                }
                else {
                    ShowMessage('warning', 'Warning - Action', "Please enter valid Email Address.");
                    $("#EmailId").val('');
                }
            }
        }
        else
            e.preventDefault();
    });

    $("body").on("click", ".remove", function () {
        $(this).closest("li").remove();

        if ($("ul#addlist2 li").length == 0) {
            $("#EmailId").attr('data-valid', 'required');
        }
        else {
            $("#EmailId").removeAttr('data-valid');
        }
    });
}
/******************************END*************************/
function InitializePage(subprocess, cntrlid, isdblclick, subprocesssno, CurrentComplaintSNo) {

    InstantiateControl(cntrlid);
    $('#divDetail3').html("");
    $("#btnChargeNote").hide();
    $("#btnUpdate").hide();
    //$("#btnSave").show();
    $("#btnNew").hide();

    if (subprocess.toUpperCase() == "COMPLAINTNEW") {

        //cp start

        var spnlbl2 = $("<span class='k-label'id='EmailLabel'>(Press space key to capture receiver E-mail Address </br> and Add New E-mail ( If Required))</span>");
        $("#EmailId").after(spnlbl2);
        // $("#EmailLabel").hide();

        divemail = $("<div id='divemailAdd' style='height:45px;width:300px;border: 1px solid rgb(204, 204, 204);overflow-y: scroll;'><ul id='addlist2' style='padding:3px 2px 2px 0px;margin-top:0px;'></ul></div>");
        if ($("#divemailAdd").length == 0)
            $("#EmailId").after(divemail);
        SetEMailNew();
        $("#EmailId").css("text-transform", "uppercase");

        cfi.AutoCompleteV2("City", "CityCode,CityName", "Complaint_CityCode", null, "contains");
        cfi.AutoCompleteV2("ComplaintSource", "Name", "Complaint_ComplaintSource", null, "contains");
        cfi.AutoCompleteV2("ComplaintStatusSNo", "Name", "Complaint_ComplaintStatusSNo", null, "contains");
        cfi.AutoCompleteV2("AWBNo", "AWBNo", "Complaint_ComplaintAirwaybillNo");
        cfi.AutoCompleteV2("ComplaintImportancy", "Name", "Complaint_ComplaintImportancy", null, "contains");
        $("input[id='RaisedDate']").parent('span').hide();
        AccountSNo = $("#AccountSNo").val();
        $("span[id='RaisedDate']").html(($("input[id='RaisedDate']").attr("formattedvalue")));
        //$('#AWBNo').attr('data-valid', "");
        $("#btnCancel").show();
        $("#btnSave").show();
        $("#btnSave").attr("tabindex", 21);
        $("#btnCancel").attr("tabindex", 22);
        $("#btnUpdate").attr("tabindex", '');
        $("#Text_ComplaintStatusSNo").val("Open");
        $("#ComplaintStatusSNo").val(12);
        $("#btnSave").unbind("click").bind("click", function () {
            RequiredEmail();
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
        if (userContext.GroupName.toUpperCase() == 'GSA') {
            if (userContext.SpecialRights.EOCA != undefined && userContext.SpecialRights.EOCA == true) {
                $("#City").val(userContext.CityCode);
                $("#Text_City").val(userContext.CityCode + '-' + userContext.CityName);
                $('#Text_City').data("kendoAutoComplete").enable(false);
            }

        }
    }
    if (subprocess.toUpperCase() == "COMPLAINTEDIT") {

        var spnlbl2 = $("<span class='k-label'id='EmailLabel'>(Press space key to capture receiver E-mail Address </br> and Add New E-mail ( If Required))</span>");
        $("#EmailId").after(spnlbl2);

        divemail = $("<div id='divemailAdd' style='height:45px;width:300px;border: 1px solid rgb(204, 204, 204);overflow-y: scroll;'><ul id='addlist2' style='padding:3px 2px 2px 0px;margin-top:0px;'></ul></div>");
        if ($("#divemailAdd").length == 0)
            $("#EmailId").after(divemail);
        SetEMailNew();
        $("#EmailId").css("text-transform", "uppercase");

        $("#EmailLabel").show();
        var textemail = $("#EmailId").val();
        $("#EmailId").val('');
        var len = textemail.split(",").length;
        if (textemail != "") {
            for (var jk = 0; jk < len; jk++) {
                $("ul#addlist2").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + textemail.split(',')[jk] + " </span><span id='" + jk + "' class='k-icon k-delete remove'></span></li>");
            }
            //$("#Email").val("");
            $("#EmailId").removeAttr('data-valid');
        }


        //cp end

        cfi.AutoCompleteV2("CitySNo", "CityCode,CityName", "Complaint_CityCode");
        cfi.AutoCompleteV2("ComplaintStatusSNo", "Name", "Complaint_ComplaintStatusSNo", null, "contains");
        cfi.AutoCompleteV2("AWBNo", "AWBNo", "Complaint_ComplaintAirwaybillNo");
        cfi.AutoCompleteV2("ComplaintImportancy", "Name", "Complaint_ComplaintImportancy", null, "contains");
        $("input[id='RaisedDate']").parent('span').hide();
        if ($("#PreliminaryClaim").prop("checked") == true) {
            $('#Text_AWBNo').attr('data-valid', "required");
            $('#Text_AWBNo').attr('data-valid-msg', "Select AWB No.");
        }
        else {
            $('#Text_AWBNo').attr('data-valid', "");
            $('#Text_AWBNo').attr('data-valid-msg', "");
        }
        $('#__tblcomplaintedit__ tr:last').hide();
        $('#__tblcomplaintedit__ tr:first td:first').html("Edit Compliant No. :-<span>" + $("#ComplaintNo").val() + "</span>");
        $("#btnCancel").show();

        $("#btnUpdate").show();
        $("#btnSave").attr("tabindex", '');
        $("#btnCancel").attr("tabindex", 22);
        $("#btnUpdate").attr("tabindex", 21);

        $("#btnUpdate").unbind("click").bind("click", function () {
            RequiredEmail();
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
        UserSubProcessRights("divComplaintEdit", subprocesssno);
        $("#btnSave").hide();
        $("#btnSearch").show()
        if (isCreate == false) {
            $("#btnNew").hide()
        } else {
            $("#btnNew").show()
        }
    }
    if (subprocess.toUpperCase() == "ACTION") {

        var spnlbl2 = $("<span class='k-label'id='EmailLabel'>(Press space key to capture receiver E-mail Address </br> and Add New E-mail ( If Required))</span>");
        $("#EmailId").after(spnlbl2);

        divemail = $("<div id='divemailAdd' style='height:45px;width:300px;border: 1px solid rgb(204, 204, 204);overflow-y: scroll;'><ul id='addlist2' style='padding:3px 2px 2px 0px;margin-top:0px;'></ul></div>");
        if ($("#divemailAdd").length == 0)
            $("#EmailId").after(divemail);
        SetEMailNewAction();
        $("#EmailId").css("text-transform", "uppercase");
        $("#EmailLabel").hide();
        $("#divemailAdd").hide();
        var textemail = $("#EmailId").val();
        $("#EmailId").val('');
        var len = textemail.split(",").length;
        if (textemail != "") {
            for (var jk = 0; jk < len; jk++) {
                $("ul#addlist2").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + textemail.split(',')[jk] + " </span><span id='" + jk + "' class='k-icon k-delete remove'></span></li>");
            }
            $("#EmailId").removeAttr('data-valid');
        }
        cfi.AutoCompleteV2("ComplaintActionStatusSNo", "Name", "Complaint_ActionStatusSNo", null, "contains");
        cfi.AutoCompleteV2("ComplaintActionSNo", "Name", "Complaint_ActionSNo", null, "contains");
        $("input[id='ActionDate']").parent('span').hide();
        $("span[id='ActionDate']").html(($("input[id='ActionDate']").attr("formattedvalue")));
        $("input[id='EmailId']").hide();
        $("input[id='EmailId']").closest('tr').find('td:eq(4)').html("");
        $('.formfourInputcolumn').css('border', 'none');
        $("#btnCancel").show();
        $("#btnSave").show();
        $("#btnSave").attr("tabindex", 13);
        $("#btnCancel").attr("tabindex", 14);
        $("#btnUpdate").attr("tabindex", '');

        $("#btnSave").unbind("click").bind("click", function () {
            RequiredEmail();
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
                //cp start
                $("#EmailLabel").show();
                $("#divemailAdd").show();

                //cp end
                $("input[id='EmailId']").show();
                $("input[id='EmailId']").closest('tr').find('td:eq(4)').html("<font color='red'>*</font><span id='spnEmailId'> EmailId</span>");
                //$("input[id='EmailId']").closest('tr').find('td:eq(5)').show();
                $('#EmailId').attr('data-valid', "required");
            }
            else {

                //cp start
                $("#EmailLabel").hide();
                $("#divemailAdd").hide();

                //cp end

                $("input[id='EmailId']").hide();
                $("input[id='EmailId']").closest('tr').find('td:eq(4)').html("");
                $('#EmailId').attr('data-valid', "");
                //$("input[id='EmailId']").closest('tr').find('td:eq(5)').hide();
            }
        });
        UserSubProcessRights("divComplaintEdit", subprocesssno);
        $("#btnSearch").show()
        $("#btnUpdate").hide();
        if (isCreate == false) {
            $("#btnNew").hide()
        } else {
            $("#btnNew").show()
        }
    }
    if (subprocess.toUpperCase() == "ASSIGN") {
        cfi.AutoCompleteV2("UserID", "Name", "Complaint_UserID", null, "contains", ",");
        cfi.AutoCompleteV2("AssignCitySNo", "CityCode", "Complaint_AssignCitySNo", null, "contains", ",");
        $("input[id='AssignDate']").parent('span').hide();
        $("span[id='AssignDate']").html(($("input[id='AssignDate']").attr("formattedvalue")));
        $("#btnCancel").show();
        $("#btnSave").show();

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
        UserSubProcessRights("divComplaintEdit", subprocesssno);
        $("#btnUpdate").hide();
        $("#btnSearch").show()
        if (isCreate == false) {
            $("#btnNew").hide()
        } else {
            $("#btnNew").show()
        }
    }
    if (subprocess.toUpperCase() == "EDOXCOMPLAINT") {
        $("#btnCancel").show();
        //$("#btnSave").show();

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
        UserSubProcessRights("divComplaintEdit", subprocesssno);
        $("#btnSearch").show()
        $("#btnUpdate").hide();
        if (isCreate == false) {
            $("#btnNew").hide()
        } else {
            $("#btnNew").show()
        }
    }
    if (subprocess.toUpperCase() == "COMPLAINTVIEW") {
        divemail = $("<div id='divemailAdd' style='height:45px;width:300px;border: 1px solid rgb(204, 204, 204);overflow-y: scroll;'><ul id='addlist2' style='padding:3px 2px 2px 0px;margin-top:0px;'></ul></div>");
        if ($("#divemailAdd").length == 0)
            $("#EmailId").after(divemail);
        var textemail = $("span[id='EmailId']").html();
        $("span[id='EmailId']").html('');
        var len = textemail.split(",").length;
        if (textemail != "") {
            for (var jk = 0; jk < len; jk++) {
                $("ul#addlist2").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + textemail.split(',')[jk] + " </span></li>");
            }
        }
        $("#divDetail").show();
        $("#divTab2").html(" ");
        $("#divTab3").html(" ");
        $("#divTab4").html(" ");
        $("#divTab5").html(" ");
        $("#divTab2").hide();
        $("#divTab3").hide();
        $("#divTab4").hide();
        $("#divTab5").hide();
        $("#btnCancel").show();
        $("#btnSave").hide();
        $("#btnUpdate").hide();
        $("input:radio[name='Type']").attr("disabled", true);
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
        if ($("input[id='ClosedDate']").val() == "") {
            //$("span[id='ClosedDate']").html("");
            //$('#__tblcomplaintview__ tr:last td').eq(0).html("");
            //var td = $('#__tblcomplaintview__ tr:last td').eq(0);
            //td.attr('title', '');

            $('#__tblcomplaintview__ tr:last').hide();
        }
        if (isCreate == false) {
            $("#btnNew").hide()
        } else {
            $("#btnNew").show()
        }
    }
    if (subprocess.toUpperCase() == "ACTIONHISTORY") {

        $("#divDetail").hide();
        $("#divDetail").html(" ");
        $("#divTab3").html(" ");
        $("#divTab4").html(" ");
        $("#divTab5").html(" ");
        $("#divTab2").show();
        $("#divTab3").hide();
        $("#divTab4").hide();
        $("#divTab5").hide();
        $("#btnCancel").show();
        $("#btnSave").hide();
        $("#btnUpdate").hide();

        $("#btnSave").attr("tabindex", '');
        $("#btnCancel").attr("tabindex", 8);
        $("#btnUpdate").attr("tabindex", '');
        if (isCreate == false) {
            $("#btnNew").hide()
        } else {
            $("#btnNew").show()
        }
    }
    if (subprocess.toUpperCase() == "ASSIGNHISTORY") {
        $("#divDetail").hide();
        $("#divDetail").html(" ");
        $("#divTab2").html(" ");
        $("#divTab4").html(" ");
        $("#divTab5").html(" ");
        $("#divTab2").hide();
        $("#divTab3").show();
        $("#divTab4").hide();
        $("#divTab5").hide();
        $("#btnCancel").show();
        $("#btnSave").hide();
        $("#btnUpdate").hide();

        $("#btnSave").attr("tabindex", '');
        $("#btnCancel").attr("tabindex", 8);
        $("#btnUpdate").attr("tabindex", '');
        if (isCreate == false) {
            $("#btnNew").hide()
        } else {
            $("#btnNew").show()
        }
    }

    if (subprocess.toUpperCase() == "IRREGULARITY") {
        $("#divDetail").hide();
        $("#divDetail").html(" ");
        $("#divTab2").html(" ");
        $("#divTab3").html(" ");
        //$("#divTab4").html(" ");
        $("#divTab5").html(" ");
        $("#divTab2").hide();
        $("#divTab3").hide();
        $("#divTab4").show();
        $("#divTab5").hide();
        $("#btnCancel").show();
        $("#btnSave").hide();
        $("#btnUpdate").hide();

        $("#btnSave").attr("tabindex", '');
        $("#btnCancel").attr("tabindex", 8);
        $("#btnUpdate").attr("tabindex", '');
        if (isCreate == false) {
            $("#btnNew").hide()
        } else {
            $("#btnNew").show()
        }
    }
    if (subprocess.toUpperCase() == "COMPLAINTAWBDETAILS") {
        $("#divDetail").hide();
        $("#divDetail").html(" ");
        $("#divTab2").html(" ");
        $("#divTab3").html(" ");
        $("#divTab4").html(" ");
        //$("#divTab5").html(" ");
        $("#divTab2").hide();
        $("#divTab3").hide();
        $("#divTab4").hide();
        $("#divTab5").show();
        $("#btnCancel").show();
        $("#btnSave").hide();
        $("#btnUpdate").hide();
        $('#__tblcomplaintawbdetails__ tr:last').hide();
        if (isCreate == false) {
            $("#btnNew").hide()
        } else {
            $("#btnNew").show()
        }
    }
    $("#btnNew").css("display", "none");
}


/******OnchangeAccountNo***********/
var AccountSNo = 0;
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
                                AccountSNo = AccountArray[i].SNo;
                            }
                        }
                        else {
                            ShowMessage('warning', 'Warning - Account No.', " Account No. is Invalid.", "bottom-right");
                            $("#AccountNo").val(" ");
                            AccountSNo = 0;
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
        //$('#AWBNo').attr('data-valid', "required");
        $('#Text_AWBNo').attr('data-valid', "required");
        $('#Text_AWBNo').attr('data-valid-msg', "Select AWB No.");
    }
    else {
        //$('#AWBNo').attr('data-valid', "");
        $('#Text_AWBNo').attr('data-valid', "");
        $('#Text_AWBNo').attr('data-valid-msg', "");
    }
});
$(document).on('change', '#PreliminaryClaim', function () {
    if ($("#PreliminaryClaim").prop("checked") == true) {
        //$('#AWBNo').attr('data-valid', "required");
        $('#Text_AWBNo').attr('data-valid', "required");
        $('#Text_AWBNo').attr('data-valid-msg', "Select AWB No.");
    }
    else {
        //$('#AWBNo').attr('data-valid', "");
        $('#Text_AWBNo').attr('data-valid', "");
        $('#Text_AWBNo').attr('data-valid-msg', "");
    }
});
$(document).on('change', '#Type', function () {
    $("#AWBNo").val("");
    $("#Text_AWBNo").val("");
});
/*****************END***********/

function SaveNewComplaint() {
    var obj = {};
    obj.ComplaintSourceSNo = $("#ComplaintSource").val();
    obj.Text_ComplaintSourceSNo = $("#Text_ComplaintSource").val();
    obj.RaisedDate = $("#RaisedDate").attr("sqldatevalue");


    obj.AWBNo = $("#AWBNo").val();
    obj.Text_AWBNo = $("#Text_AWBNo").val();
    if (parseInt(($("input[name='Type']:checked").val())) == 0) {
        obj.Type = 1;
    }
    else {
        obj.Type = 2;
    }
    if (obj.Text_AWBNo == "") {
        obj.Type = 0;
        obj.AWBNo = 0;
    }
    obj.AccountNo = $("#AccountNo").val();
    obj.AccountSNo = AccountSNo;
    obj.Name = $("#Name").val();
    obj.ContactNo = $("#ContactNo").val();
    obj.Address = $("#Address").val();
    if ($("#EmailId").val() != '') {
        ShowMessage('warning', 'Warning - New Complaint', "Please Select  Email-Id.", "bottom-right");
        $("#EmailId").focus();
        return false;
    }
    //cp start
    var M = '';
    for (var i = 0; i < $("ul#addlist2 li").text().split(' ').length - 1; i++)
    { M = M + $("ul#addlist2 li span").text().split(' ')[i] + ','; }
    $("#EmailId").val(M == '' ? '' : M.substring(0, M.length - 1));


    //cp end
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
    obj.Text_ComplaintStatusSNo = $("#Text_ComplaintStatusSNo").val();
    obj.LoginCitySno = userContext.CitySNo;
    obj.ComplaintImportancy = $("#ComplaintImportancy").val();
    obj.Text_ComplaintImportancy = $("#Text_ComplaintImportancy").val();
    var flag = false;
    $.ajax({
        url: "Services/Irregularity/ComplaintService.svc/SaveNewComplaint", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ obj: obj }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var myData = $.parseJSON(result);
            if (myData.Table1[0].ErrorNumber == "0") {
                AuditLogSaveNewValue("divComplaintEdit", true, '', "Complaint No.", myData.Table1[0].ComplaintNo, '', 'New', userContext.TerminalSNo, userContext.NewTerminalName);
                //Added By Shivali Thakur
                if (sessionStorage.getItem("auditlog") != null) {
                    var auditLog = JSON.parse(sessionStorage.getItem("auditlog"));
                    SaveAppendGridAuditLog(auditLog.KeyColumn, auditLog.KeyValue, auditLog.keySNo, auditLog.arrVal, auditLog.FormAction, auditLog.TerminalSNo, auditLog.TerminalName)
                }
                ShowMessage('success', 'Success - New Complaint', "Complaint No. :- " + myData.Table1[0].ComplaintNo + "  generated Successfully ", "bottom-right");
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

function UpdateNewComplaint() {
    var obj = {};

    obj.AWBNo = $("#AWBNo").val();
    obj.Text_AWBNo = $("#Text_AWBNo").val();
    if (parseInt(($("input[name='Type']:checked").val())) == 0) {
        obj.Type = 1;
    }
    else {
        obj.Type = 2;
    }
    if (obj.Text_AWBNo == "") {
        obj.Type = 0;
        obj.AWBNo = 0;
    }
    obj.AccountSNo = AccountSNo;
    obj.AccountNo = $("#AccountNo").val();
    obj.Name = $("#Name").val();
    obj.ContactNo = $("#ContactNo").val();
    obj.Address = $("#Address").val();
    if ($("#EmailId").val() != '') {
        ShowMessage('warning', 'Warning - Update Complaint', "Please Select  Email-Id.", "bottom-right");
        $("#EmailId").focus();
        return false;
    }
    //cp start
    var M = '';
    for (var i = 0; i < $("ul#addlist2 li").text().split(' ').length - 1; i++)
    { M = M + $("ul#addlist2 li span").text().split(' ')[i] + ','; }
    $("#EmailId").val(M == '' ? '' : M.substring(0, M.length - 1));


    //cp end
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
    obj.Text_ComplaintStatusSNo = $("#Text_ComplaintStatusSNo").val();

    obj.ComplaintImportancy = $("#ComplaintImportancy").val();
    obj.Text_ComplaintImportancy = $("#Text_ComplaintImportancy").val();
    var flag = false;
    $.ajax({
        url: "Services/Irregularity/ComplaintService.svc/UpdateComplaint", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ obj: obj }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "0") {
                AuditLogSaveNewValue("divComplaintEdit", true, '', "Complaint No.", $("#ComplaintNo").val(), '', 'Edit', userContext.TerminalSNo, userContext.NewTerminalName);
                //Added By Shivali Thakur
                if (sessionStorage.getItem("auditlog") != null) {
                    var auditLog = JSON.parse(sessionStorage.getItem("auditlog"));
                    SaveAppendGridAuditLog(auditLog.KeyColumn, auditLog.KeyValue, $("#ComplaintSNo").val(), auditLog.arrVal, auditLog.FormAction, auditLog.TerminalSNo, auditLog.TerminalName)
                }
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
        //data: JSON.stringify({ CurrentComplaintSNo: CurrentComplaintSNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var edoxData = jQuery.parseJSON(result);
            var edoxArray = edoxData.Table0;
            $("#divareaTrans_irregularity_complaintedox tr:first").find("font").remove();



            if (edoxArray.length > 0) {
                $("#DocsName").attr("data-valid", " ");
                cfi.makeTrans("irregularity_complaintedox", null, null, BindEDoxDocTypeAutoComplete, ReBindEDoxDocTypeAutoComplete, null, edoxArray, null, true);
                $("#DocsName").attr("data-valid", " ");
                $("div[id$='areaTrans_irregularity_complaintedox']").find("[id='areaTrans_irregularity_complaintedox']").each(function () {
                    $(this).find("input[id^='DocType']").each(function () {
                        cfi.AutoCompleteV2($(this).attr("name"), "DocumentName", "Complaint_DocumentName", MakeFileMandatory, "contains", ",");
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
                    $(this).find("input[type='file']").attr("data-valid-msg", "");
                    $(this).find("input[type='file']").attr('required', '');
                    $(this).find("input[type='file']").attr('data-valid', '');
                });
            }
            else {
                cfi.makeTrans("irregularity_complaintedox", null, null, BindEDoxDocTypeAutoComplete, ReBindEDoxDocTypeAutoComplete, null, null, null, false);
                $(this).find("input[type='file']").css('width', '');
                $(this).find("input[type='file']").attr("data-valid-msg", "Attach Document");

                $("div[id$='areaTrans_irregularity_complaintedox']").find("[id='areaTrans_irregularity_complaintedox']").each(function () {
                    $(this).find("input[id^='DocType']").each(function () {
                        cfi.AutoCompleteV2($(this).attr("name"), "DocumentName", "Complaint_DocumentName", MakeFileMandatory, "contains", ",");
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
            }
        },
        error: {
        }
    });
}

function BindEDoxDocTypeAutoComplete(elem, mainElem) {

    $(elem).find("input[id^='DocType']").each(function () {
        cfi.AutoCompleteV2($(this).attr("name"), "DocumentName", "Complaint_DocumentName", MakeFileMandatory, "contains", ",");
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
            var newDataSource = GetDataSourceV2("Text_" + $(this).attr("id"), "Complaint_DocumentName");
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false, RemoveFileMandatory);
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
    var d = new Date();
    for (var i = 0; i < files.length; i++) {

        fileName = d.toGMTString().substr(6, 19).replace(/ /g, "_") + '_' + userContext.UserSNo + '__' + files[i].name;
        data.append(fileName, files[i]);
    }

    if (flag == true) {
        $.ajax({
            url: "/BLOBUploadAndDownload/UploadToBlob",
            type: "POST",
            data: data,
            contentType: false,
            processData: false,
            success: function (result) {

                $("#" + objId).closest("tr").find("a[id^='ahref_" + nexctrlid + "']").attr("linkdata", result);
                $("#" + objId).closest("tr").find("span[id^='" + nexctrlid + "']").text(files[0].name);//result.substring(result.lastIndexOf('__') + 2)
            },
            error: function (err) {
                ShowMessage('info', 'File Upload!', "Unable to upload selected file. Please try again.", "bottom-right");
            }
        });
    }
}

function DownloadEDoxDocument(objId, nexctrlid) {
    if ($("#" + objId).attr("linkdata") != undefined && $("#" + objId).attr("linkdata") != "") {
        window.location.href = "../BLOBUploadAndDownload/DownloadFromBlob/?filenameOrUrl=" + $("#" + objId).attr("linkdata");
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
                        ShowMessage('success', 'Success - e-Dox Information', "EDox for complaint -  Saved Successfully", "bottom-right");
                        flag = true;
                    }
                    else
                        ShowMessage('warning', 'Warning - e-Dox Information', "EDox for complaint -  unable to process.", "bottom-right");
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
    if ($("#EmailId").val() != '') {
        ShowMessage('warning', 'Warning - Complaint Action', "Please Select  Email-Id.", "bottom-right");
        $("#EmailId").focus();
        return false;
    }
    //cp start
    var M = '';
    for (var i = 0; i < $("ul#addlist2 li").text().split(' ').length - 1; i++)
    { M = M + $("ul#addlist2 li span").text().split(' ')[i] + ','; }
    $("#EmailId").val(M == '' ? '' : M.substring(0, M.length - 1));


    //cp end
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
    obj.AssignCitySNo = $("#AssignCitySNo").val();
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
    if (textId.indexOf("Text_ComplaintSource") >= 0) {
        cfi.setFilter(filterComplain, "IsActive", "eq", 1);
        cfi.setFilter(filterComplain, "ApplicationSNo", "eq", 1);
        var ComplainAutoCompleteFilter = cfi.autoCompleteFilter(filterComplain);
        return ComplainAutoCompleteFilter;
    }

    if (textId.indexOf("Text_searchComplainStatus") >= 0) {
        cfi.setFilter(filterComplain, "IsActive", "eq", 1);
        cfi.setFilter(filterComplain, "ApplicationSNo", "eq", 3);
        if (userContext.CityCode != 'DEL' && userContext.SysSetting.ClientEnvironment == 'UK') {
            cfi.setFilter(filterComplain, "SNo", "neq", 13);
        }
        else if (userContext.CityCode != 'JKT' && userContext.SysSetting.ClientEnvironment != 'UK') {
            cfi.setFilter(filterComplain, "SNo", "neq", 13);
        }
        //if (userContext.CitySNo != 3992) {
        //          cfi.setFilter(filterComplain, "SNo", "neq", 13);
        //      }
        var ComplainAutoCompleteFilter = cfi.autoCompleteFilter(filterComplain);
        return ComplainAutoCompleteFilter;
    }
    if (textId.indexOf("Text_ComplaintStatusSNo") >= 0) {
        cfi.setFilter(filterComplain, "IsActive", "eq", 1);
        cfi.setFilter(filterComplain, "ApplicationSNo", "eq", 3);
        cfi.setFilter(filterComplain, "Name", "notin", "CLOSED");
        if (userContext.CityCode != 'DEL' && userContext.SysSetting.ClientEnvironment == 'UK') {
            cfi.setFilter(filterComplain, "SNo", "neq", 13);
        }
        else if (userContext.CityCode != 'JKT' && userContext.SysSetting.ClientEnvironment != 'UK') {
            cfi.setFilter(filterComplain, "SNo", "neq", 13);
        }
        //if (userContext.CitySNo != 3992) {
        //          cfi.setFilter(filterComplain, "SNo", "neq", 13);
        //      }
        var ComplainAutoCompleteFilter = cfi.autoCompleteFilter(filterComplain);
        return ComplainAutoCompleteFilter;
    }
    if (textId.indexOf("Text_ComplaintActionSNo") >= 0) {
        cfi.setFilter(filterComplain, "IsActive", "eq", 1);
        cfi.setFilter(filterComplain, "ApplicationSNo", "eq", 4);
        var ComplainAutoCompleteFilter = cfi.autoCompleteFilter(filterComplain);
        return ComplainAutoCompleteFilter;
    }
    if (textId.indexOf("Text_ComplaintActionStatusSNo") >= 0) {
        cfi.setFilter(filterComplain, "IsActive", "eq", 1);
        cfi.setFilter(filterComplain, "ApplicationSNo", "eq", 3);
        if (userContext.SysSetting.ClientEnvironment != 'TH') {

            if (userContext.CityCode != 'DEL' && userContext.SysSetting.ClientEnvironment == 'UK') {
                cfi.setFilter(filterComplain, "SNo", "neq", 13);
            }
            else if (userContext.CityCode != 'JKT' && userContext.SysSetting.ClientEnvironment != 'UK') {
                cfi.setFilter(filterComplain, "SNo", "neq", 13);
            }
        }
        //if (userContext.CitySNo != 3992) {
        //          cfi.setFilter(filterComplain, "SNo", "neq", 13);
        //      }
        var ComplainAutoCompleteFilter = cfi.autoCompleteFilter(filterComplain);
        return ComplainAutoCompleteFilter;
    }
    if (textId.indexOf("Text_AssignCitySNo") >= 0) {
        cfi.setFilter(filterComplain, "IsActive", "eq", 1);
        var ComplainAutoCompleteFilter = cfi.autoCompleteFilter(filterComplain);
        return ComplainAutoCompleteFilter;
    }
    if (textId.indexOf("Text_UserID") >= 0) {
        if ($("#AssignCitySNo").val() == "" || $("#AssignCitySNo").val() == null) {
            ShowMessage('warning', 'Warning -  Complaint Assign', "Please Select City First", "bottom-right");
            cfi.setFilter(filterComplain, "CitySNo", "eq", 0);
            var ComplainAutoCompleteFilter = cfi.autoCompleteFilter(filterComplain);
            return ComplainAutoCompleteFilter;
        }
        else {
            cfi.setFilter(filterComplain, "CitySNo", "in", $("#AssignCitySNo").val());
            var ComplainAutoCompleteFilter = cfi.autoCompleteFilter(filterComplain);
            return ComplainAutoCompleteFilter;
        }
    }
    if (textId.indexOf("Text_ComplaintImportancy") >= 0) {
        cfi.setFilter(filterComplain, "IsActive", "eq", 1);
        cfi.setFilter(filterComplain, "ApplicationSNo", "eq", 13);
        var ComplainAutoCompleteFilter = cfi.autoCompleteFilter(filterComplain);
        return ComplainAutoCompleteFilter;
    }
    if (textId.indexOf("Text_AWBNo") >= 0) {
        if (parseInt(($("input[name='Type']:checked").val())) == 0) {
            cfi.setFilter(filterComplain, "MovementTypeSNo", "eq", 1);
        }
        else {
            cfi.setFilter(filterComplain, "MovementTypeSNo", "eq", 2);
        }
        var ComplainAutoCompleteFilter = cfi.autoCompleteFilter(filterComplain);
        return ComplainAutoCompleteFilter;
    }
    if (textId == "Text_DocType") {
        cfi.setFilter(filterComplain, "SNo", "notin", $("#Text_DocType").data("kendoAutoComplete").key())
        var ComplainAutoCompleteFilter = cfi.autoCompleteFilter(filterComplain);
        return ComplainAutoCompleteFilter;
    }
    //if (textId == "Text_ComplaintStatusSNo") {
    //    cfi.setFilter(filterComplain, "Name", "notin", "CLOSED")
    //    var ComplainAutoCompleteFilter = cfi.autoCompleteFilter(filterComplain);
    //    return ComplainAutoCompleteFilter;
    //}
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
                            "<td><button class='btn btn-block btn-danger btn-sm' style='display:none' id='btnCancel'>Cancel</button></td>" +
                        "</tr></tbody></table> </div>";


var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divComplaintDetails' style='width:100%'></div></td></tr><tr><td valign='top'><div id='divNewComplaint' style='width:100%'></div></td></tr><tr><td valign='top'><div id='divComplaintEdit' style='width:100%'></div></td></tr><tr> <td valign='top'> <table style='width:100%'> <tr> <td style='width:100%;' valign='top' class='tdInnerPadding'> <div id='tabstrip'> <ul id='ulTab' style='display:none;'> <li class='k-state-active'> Genral </li><li> SPHC Wise </li><li>Tab 3</li><li>Tab 4</li><li>Tab 5</li></ul> <div> <div id='divDetail'></div><div id='divDetail1'></div><div id='divDetail2'></div><div id='divDetail3'></div></div> <div> <div id='divTab2'> </div></div><div><div id='divTab3'></div></div><div><div id='divTab4'></div></div><div><div id='divTab5'></div></div></div></div></td></tr></table></td></tr></table></div>";
// add By Sushant Kumar Nayak On 05-08-2018
var isCreate = false, IsEdit = false, IsDelete = false, IsRead = false;
//var apps = "COMPLAINT";
function UserPageRights(apps) {

    $(userContext.PageRights).each(function (i, e) {
        if (e.Apps.toUpperCase() == apps.toUpperCase()) {
            if (e.PageRight.toUpperCase() == 'New'.toUpperCase()) {
                isCreate = true;
            }
            if (e.PageRight.toUpperCase() == 'Edit'.toUpperCase()) {
                IsEdit = true;
            }
            if (e.PageRight.toUpperCase() == 'Delete'.toUpperCase()) {
                IsDelete = true;
            }
            if (e.PageRight.toUpperCase() == 'Read'.toUpperCase()) {
                IsRead = true;
            }
        }
    });

}
function startChange(that) {
    var start = $("#" + that.sender.options.startControlId).data("kendoDatePicker");
    var end = $("#" + that.sender.options.endControlId).data("kendoDatePicker");
    var startDate = start.value();

    if (startDate) {
        startDate = new Date(startDate);
        startDate.setDate(startDate.getDate());
        end.min(startDate);
    }
}

function endChange(that) {
    var start = $("#" + that.sender.options.startControlId).data("kendoDatePicker");
    var end = $("#" + that.sender.options.endControlId).data("kendoDatePicker");
    var endDate = end.value();

    if (endDate) {
        endDate = new Date(endDate);
        endDate.setDate(endDate.getDate());
        start.max(endDate);
    }
}
function LyingDateType(cntrlId, isSpan) {
    var isDateExist = true;

    if (isSpan == undefined || isSpan == "" || isSpan == false) {
        if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
            isDateExist = $("#" + cntrlId).val() != "";
        }
    }
    var startControl = $("#" + cntrlId).attr("startControl");
    var endControl = $("#" + cntrlId).attr("endControl");

    var widthset = $("#" + cntrlId).css("width");
    var addonchange = $("#" + cntrlId).attr("addonchange");
    if (isSpan) {
        $("span[id='" + cntrlId + "']").kendoDatePicker({
            format: "dd-MMM-yyyy",
            width: widthset,
            wrap: false
        });
    }
    else {
        $("#" + cntrlId).kendoDatePicker({
            format: "dd-MMM-yyyy",
            startControlId: (startControl == undefined ? null : startControl),
            endControlId: (endControl == undefined ? null : endControl),
            change: ((startControl != undefined && startControl == cntrlId) ? startChange : (endControl != undefined && endControl == cntrlId) ? endChange : (addonchange != undefined ? AddOnChange : null)),
            width: widthset,
            wrap: true,
            addOnChange: (addonchange != undefined ? addonchange : null)
        });
        if (!isDateExist) {
            $("#" + cntrlId).val("");
        }
    }
}