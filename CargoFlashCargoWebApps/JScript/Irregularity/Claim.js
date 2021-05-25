/// <reference path="../../Scripts/KendoSchedular/Content/JS/Common.js" />

var ClaimDataSource = [{ Key: "1", Text: "YES" }, { Key: "0", Text: "NO" }];
var SDRRateDataSource = [{ Key: "USD 19", Text: "USD 19" }, { Key: "USD 20", Text: "USD 20" }];
var UserOfficeRecord = {};
var Claimno = "";
var IsDomestic;
$(function () {
    $("#btnSave").hide();
    $(document).ready(function () {
        var url = window.location.href;
        //alert(url);
        //alert(url.split("CurrentComplaintSNo=")[1]);
        if (url.split("CurrentComplaintSNo=")[1] == undefined) {
            MasterDeliveryOrder(0);
        }
        else {
            MasterDeliveryOrder(url.split("CurrentComplaintSNo=")[1]);
        }
      
        UserSubProcessRightsSpecialrights();
    });
   
});

function MasterDeliveryOrder(CurrentComplaintNo) {
    _CURR_PRO_ = "CLAIM";
    _CURR_OP_ = "CLAIM";
    $("#licurrentop").html(_CURR_OP_);
    $("#divSearch").html("");
    $("#divClaim").html("");
    GetRecordoffice();
    CleanUI();
    $.ajax({
        url: "Services/Irregularity/ClaimService.svc/GetWebForm/" + _CURR_PRO_ + "/Irregularity/Claim/Search/1/0", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContent);
            $("#divFooter").html(fotter).show();
            cfi.AutoCompleteByDataSource("SearchClaim", ClaimDataSource);
            cfi.AutoCompleteV2("searchClaimStatus", "Name", "Claim_searchClaimStatus", null, "contains");
            cfi.AutoCompleteV2("searchAWBNo", "AWBNo", "Claim_AWBNo", null, "contains");
            cfi.AutoCompleteV2("searchClaimNo", "ClaimNumber", "Claim_ClaimNumber", null, "contains");
            $('#searchFromDate').data("kendoDatePicker").value("");
            $('#searchToDate').data("kendoDatePicker").value("");

            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });

            $("#btnSearch").bind("click", function () {
                CleanUI();
                ClearAll();
                ClaimGridSearch();
                // ----Added By Preeti for paermission check------
                var isCreate = false;
                $(userContext.PageRights).each(function (e, i) {
                    if (i.PageName == "Claim" && i.PageRight == "New") {
                        isCreate = true;
                    }
                });

                if (!isCreate) {
                    //$(".btn-success").attr("style", "display:none;");
                    //$(".btn-danger").attr("style", "display:none;");
                    //$(".btn-primary").attr("style", "display:none;");
                    $('#btnNew').css("display", "none");
                    //$('#btnCancel').css("display", "none");


                }
            });
            ClaimGridSearch();
            $("#btnNew").unbind("click").bind("click", function () {
                CleanUI();
                var module = "Irregularity";
                if (_CURR_PRO_ == "Claim") {
                    var _CURR_PRO_1 = "ClaimNEW"
                    module = "Irregularity";
                }
                $.ajax({
                    url: "Services/Irregularity/ClaimService.svc/GetWebForm/" + _CURR_PRO_ + "/" + module + "/ClaimNew/New/1/0", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        $("#divNewClaim").html(result);
                        if (result != undefined || result != "") {
                            InitializePage("ClaimNew", "divNewClaim");

                        }
                    }
                });
            });

            if (CurrentComplaintNo != 0) {
                CleanUI();
                var module = "Irregularity";
                if (_CURR_PRO_ == "Claim") {
                    var _CURR_PRO_1 = "ClaimNEW"
                    module = "Irregularity";
                }
                $.ajax({
                    url: "Services/Irregularity/ClaimService.svc/GetWebForm/" + _CURR_PRO_ + "/" + module + "/ClaimNew/New/1/" + CurrentComplaintNo, async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        $("#divNewClaim").html(result);

                        if (result != undefined || result != "") {
                            InitializePage("ClaimNew", "divNewClaim", 0, 0, CurrentComplaintNo);
                        }
                    }
                });
            }


            // ----Added By Preeti for paermission check------
            var isCreate = false;
            $(userContext.PageRights).each(function (e, i) {
                if (i.PageName == "Claim" && i.PageRight == "New") {
                    isCreate = true;
                }
            });

            if (!isCreate) {
                //$(".btn-success").attr("style", "display:none;");
                //$(".btn-danger").attr("style", "display:none;");
                //$(".btn-primary").attr("style", "display:none;");
                $('#btnNew').css("display", "none");
                //$('#btnCancel').css("display", "none");


            }
        }
    });

}

function OnSuccessGrid() {
    var TrHeader = $("div[id$='divClaimDetails']").find("div[class^='k-grid-header'] thead tr");
    var IsClosedIndex = TrHeader.find("th[data-field='IsClosed']").index();
    var IsAssignIndex = TrHeader.find("th[data-field='IsAssign']").index();
    var IsEditIndex = TrHeader.find("th[data-field='IsEdit']").index();
    var IsActionIndex = TrHeader.find("th[data-field='IsAction']").index();
    var IsEdoxIndex = TrHeader.find("th[data-field='IsEdox']").index();
    var IsAirlineEdoxIndex = TrHeader.find("th[data-field='IsAirlineEdox']").index();
    var currentComplaintSNoIndex = TrHeader.find("th[data-field='ClaimSNo']").index();
    $("div[id$='divClaimDetails']").find("div[class^='k-grid-content'] tbody tr").each(function (row, tr) {
        $(tr).closest('td').find("input[process='CLAIMEDIT']:eq(" + row + ")").attr("class", "incompleteprocess");
        $(tr).closest('td').find("input[process='CLAIMACTION']:eq(" + row + ")").attr("class", "incompleteprocess");
        $(tr).closest('td').find("input[process='CLAIMASSIGN']:eq(" + row + ")").attr("class", "incompleteprocess");
        $(tr).closest('td').find("input[process='CLAIMEDOX']:eq(" + row + ")").attr("class", "incompleteprocess");
        $(tr).closest('td').find("input[process='CLAIMVIEW']:eq(" + row + ")").attr("class", "incompleteprocess");
        $(tr).closest('td').find("input[process='AIRLINEEDOX']:eq(" + row + ")").attr("class", "incompleteprocess");
        if ($(tr).find("td:eq(" + IsClosedIndex + ")").text() == "true") {
            $(tr).closest('td').find("input[process='CLAIMEDIT']:eq(" + row + ")").prop("disabled", true);
            $(tr).closest('td').find("input[process='CLAIMACTION']:eq(" + row + ")").prop("disabled", true);
            $(tr).closest('td').find("input[process='CLAIMASSIGN']:eq(" + row + ")").prop("disabled", true);

            $(tr).closest('td').find("input[process='CLAIMEDIT']:eq(" + row + ")").attr("class", "completeprocess");
            $(tr).closest('td').find("input[process='CLAIMACTION']:eq(" + row + ")").attr("class", "completeprocess");
            $(tr).closest('td').find("input[process='CLAIMASSIGN']:eq(" + row + ")").attr("class", "completeprocess");
            $(tr).closest('td').find("input[process='CLAIMEDOX']:eq(" + row + ")").attr("class", "completeprocess");
            $(tr).closest('td').find("input[process='CLAIMVIEW']:eq(" + row + ")").attr("class", "completeprocess");
            $(tr).closest('td').find("input[process='AIRLINEEDOX']:eq(" + row + ")").attr("class", "completeprocess");
        }
        else {
            if (($(tr).find("td:eq(" + IsEditIndex + ")").text() == "true")) {
                $(tr).closest('td').find("input[process='CLAIMEDIT']:eq(" + row + ")").attr("class", "partialprocess");
                $(tr).closest('td').find("input[process='CLAIMVIEW']:eq(" + row + ")").attr("class", "partialprocess");

            }
            if (($(tr).find("td:eq(" + IsAssignIndex + ")").text() == "true")) {
                // $(tr).closest('td').find("input[process='CLAIMEDIT']:eq(" + row + ")").prop("disabled", true);
                $(tr).closest('td').find("input[process='CLAIMEDIT']:eq(" + row + ")").attr("class", "completeprocess");
                $(tr).closest('td').find("input[process='CLAIMVIEW']:eq(" + row + ")").attr("class", "partialprocess");
                $(tr).closest('td').find("input[process='CLAIMASSIGN']:eq(" + row + ")").attr("class", "partialprocess");
            }
            if (($(tr).find("td:eq(" + IsActionIndex + ")").text() == "true")) {
                // $(tr).closest('td').find("input[process='CLAIMEDIT']:eq(" + row + ")").prop("disabled", true);
                $(tr).closest('td').find("input[process='CLAIMEDIT']:eq(" + row + ")").attr("class", "completeprocess");
                $(tr).closest('td').find("input[process='CLAIMACTION']:eq(" + row + ")").attr("class", "partialprocess");
                $(tr).closest('td').find("input[process='CLAIMVIEW']:eq(" + row + ")").attr("class", "partialprocess");

            }
            if (($(tr).find("td:eq(" + IsEdoxIndex + ")").text() == "true")) {
                $(tr).closest('td').find("input[process='CLAIMEDOX']:eq(" + row + ")").attr("class", "partialprocess");
                $(tr).closest('td').find("input[process='CLAIMVIEW']:eq(" + row + ")").attr("class", "partialprocess");

            }
            if (($(tr).find("td:eq(" + IsAirlineEdoxIndex + ")").text() == "true")) {
                $(tr).closest('td').find("input[process='AIRLINEEDOX']:eq(" + row + ")").attr("class", "partialprocess");
                $(tr).closest('td').find("input[process='CLAIMVIEW']:eq(" + row + ")").attr("class", "partialprocess");

            }
        }
    });
}

function GetRecordoffice() {
    $.ajax({
        url: "Services/Irregularity/ClaimService.svc/GetOffice", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ CitySNo: userContext.CitySNo, UserSNo: userContext.UserSNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    UserOfficeRecord = {};
                    UserOfficeRecord.SNo = myData.Table0[0].SNo;
                    UserOfficeRecord.Name = myData.Table0[0].Name;
                    UserOfficeRecord.IsHeadOffice = myData.Table0[0].IsHeadOffice == "True" ? 1 : 0;
                    UserOfficeRecord.OfficeType = myData.Table0[0].OfficeType;
                    UserOfficeRecord.ParentID = myData.Table0[0].ParentID;

                }
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

function CleanUI() {

    $("#divDetail").html("");
    $("#divDetail1").html("");
    $("#divDetail2").html("");
    $("#divDetail3").html("");
    $("#divCalculateClaim").html("");
    $("#btnSave").unbind("click");
    $("#divCalculateClaim").hide();
    $('#btnclaimamt').hide();
    $("#tabstrip").hide();
    $('#divNewClaim').html('');
    $("#btnSave").css("display", "none");
    $("#btnUpdate").css("display", "none");
    $("#btnCancel").css("display", "none");
    $("#btnNew").css("display", "block");

}

function ClaimGridSearch() {
    var searchClaimNo = $("#searchClaimNo").val() == "" ? "0" : $("#searchClaimNo").val();
    var searchClaimStatus = $("#searchClaimStatus").val() == "" ? "0" : $("#searchClaimStatus").val();
    var searchAWBNo = $("#searchAWBNo").val() == "" ? "0" : $("#searchAWBNo").val();
    var LoggedInCity = userContext.CitySNo;
    var searchFromDate = "0";
    var searchToDate = "0";
    if ($("#searchFromDate").val() != "") {
        searchFromDate = cfi.CfiDate("searchFromDate") == "" ? "0" : cfi.CfiDate("searchFromDate");// "";//month + "-" + day + "-" + year;
    }

    if ($("#searchToDate").val() != "") {
        searchToDate = cfi.CfiDate("searchToDate") == "" ? "0" : cfi.CfiDate("searchToDate");// "";//month + "-" + day + "-" + year;
    }

    if (_CURR_PRO_ == "CLAIM") {
        //cfi.ShowIndexView("divClaimDetails", "Services/Irregularity/ClaimService.svc/GetGridData/" + _CURR_PRO_ + "/Irregularity/Claim/" + searchClaimNo.trim() + "/" + searchClaimStatus.trim() + "/" + searchAWBNo.trim() + "/" + searchFromDate.trim() + "/" + searchToDate.trim() + "/" + LoggedInCity + "/0");
        MyIndexView("divClaimDetails", "/Services/Irregularity/ClaimService.svc/GetGridData");
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
        processName: 'CLAIM',
        moduleName: 'Irregularity',
        appName: 'Claim',
        searchClaimNo: $("#searchClaimNo").val() == "" ? "0" : $("#searchClaimNo").val(),
        searchClaimStatus: $("#searchClaimStatus").val() == "" ? "0" : $("#searchClaimStatus").val(),
        searchAWBNo: $("#searchAWBNo").val() == "" ? "0" : $("#searchAWBNo").val(),
        LoggedInCity: userContext.CitySNo,
        searchFromDate: cfi.CfiDate("searchFromDate") == "" ? "0" : cfi.CfiDate("searchFromDate"),
        searchToDate: cfi.CfiDate("searchToDate") == "" ? "0" : cfi.CfiDate("searchToDate"),
        RecID: "0",
    })
}
function checkProgrss(item, subprocess, displaycaption) {
    debugger;
    alert(JSON.stringify(item));
    alert(JSON.stringify(subprocess));
    alert(JSON.stringify(displaycaption));
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
}

function ClearAll() {
    //$("#btnCancel").hide();
    //$("#btnSave").hide();
    //$("#btnNew").show();
    //$("#divNewClaim").html("");
    //$("#btnUpdate").hide();
    //$("#divClaimEdit").html("");

    $("#divCalculateClaim").html("");
    //$("#divCalculateClaim").hide();
    $("#btnCancel").hide();
    $("#btnSave").hide();
    $("#btnNew").show();
    $("#divNewClaim").html("");
    $("#btnUpdate").hide();
    $("#divClaimEdit").html("");
    //$("#divClaimEdit").hide();
    $("#divDetail").html("");
    $("#divDetail").hide();
    $("#divDetail1").html("");
    $("#divDetail2").html("");
    $("#divDetail3").html("");
    $("#divTab3").html('');
    $("#divTab4").html('');
    $("#divTab5").html('');
    $("#divTab6").html('');
}

function ReloadSameGridPage() {
    var gridPage = $(".k-pager-input").find("input").val();
    var grid = $(".k-grid").data("kendoGrid");
    grid.dataSource.page(gridPage);
}

var claimAmount;
var glb_international;
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
        ClearAll()
    });

    var subprocess = $(obj).attr("process").toUpperCase();
    currentprocess = subprocess;
    var closestTr = $(obj).closest("tr");
    var ClaimSNoIndex = 0;
    var awbNoIndex = 0;

    var trLocked = $(".k-grid-header-wrap tr");
    var trRow = $(".k-grid-header-wrap tr");
    ClaimSNoIndex = trLocked.find("th[data-field='ClaimSNo']").index();
    var ClaimAmountindex = trLocked.find("th[data-field='claimamount']").index();
    var globalisinternationalindex = trLocked.find("th[data-field='IsInternational']").index();

    IsClosedIndex = trLocked.find("th[data-field='IsClosed']").index();
    IsAssignIndex = trLocked.find("th[data-field='IsAssign']").index();

    IsClosed = closestTr.find("td:eq(" + IsClosedIndex + ")").text();
    IsAssign = closestTr.find("td:eq(" + IsAssignIndex + ")").text();
    if (IsClosed == "true") {
        $("#btnSave").hide();
    }
    else {
        $("#btnSave").show();
    }

    CurrentAWBNo = closestTr.find("td:eq(" + awbNoIndex + ")").text();
    CurrentClaimSNo = closestTr.find("td:eq(" + ClaimSNoIndex + ")").text();
    claimAmount = closestTr.find("td:eq(" + ClaimAmountindex + ")").text();
    glb_international = closestTr.find("td:eq(" + globalisinternationalindex + ")").text();



  $("#tdAWBNo").text(closestTr.find("td:eq(" + ClaimAmountindex + ")").text());
    ShowProcessDetails(subprocess, isdblclick, CurrentClaimSNo);

    ClaimNo = closestTr.find("td:eq(1)").text();

}

function ShowProcessDetails(subprocess, isdblclick, CurrentClaimSNo) {
    $("#ulTab").hide();

    if (subprocess.toUpperCase() == "CLAIMEDIT") {
        ShowProcessDetailsNew("CLAIMEDIT", "divClaimEdit", isdblclick, subprocesssno, CurrentClaimSNo);
    }
    if (subprocess.toUpperCase() == "CLAIMACTION") {
        ShowProcessDetailsNew("CLAIMACTION", "divClaimEdit", isdblclick, subprocesssno, CurrentClaimSNo);
    }
    if (subprocess.toUpperCase() == "CLAIMASSIGN") {
        ShowProcessDetailsNew("CLAIMASSIGN", "divClaimEdit", isdblclick, subprocesssno, CurrentClaimSNo);
    }
    if (subprocess.toUpperCase() == "CLAIMEDOX") {
        ShowProcessDetailsNew("CLAIMEDOX", "divClaimEdit", isdblclick, subprocesssno, CurrentClaimSNo);
    }
    if (subprocess.toUpperCase() == "AIRLINEEDOX") {
        ShowProcessDetailsNew("AIRLINEEDOX", "divClaimEdit", isdblclick, subprocesssno, CurrentClaimSNo);
    }
    if (subprocess.toUpperCase() == "CLAIMVIEW") {
        $("#tabstrip").show();
        $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select(0);
        $("body").append("<style>ul.k-tabstrip-items li.k-state-active{border-bottom:3px solid red;}</style>");
        $("#ulTab").show();
        $('#tabstrip ul:first li:eq(0) a').text("Claim");
        $('#tabstrip ul:first li:eq(1) a').text("Action");
        $('#tabstrip ul:first li:eq(2) a').text("Assign");
        $('#tabstrip ul:first li:eq(3) a').text("Irregularity");
        $('#tabstrip ul:first li:eq(4) a').text("AWB Details");
        $('#tabstrip ul:first li:eq(5) a').text("Print Forms");
        $('#tabstrip ul:first li:eq(0)').css("background-color", "green");
        $('#tabstrip ul:first li:eq(1)').css("background-color", "");
        $('#tabstrip ul:first li:eq(2)').css("background-color", "");
        $('#tabstrip ul:first li:eq(3)').css("background-color", "");
        $('#tabstrip ul:first li:eq(4)').css("background-color", "");
        $('#tabstrip ul:first li:eq(5)').css("background-color", "");
        $('#tabstrip ul:first li:eq(0) a').show();
        $('#tabstrip ul:first li:eq(1) a').show();
        $('#tabstrip ul:first li:eq(2) a').show();
        $('#tabstrip ul:first li:eq(3) a').show();
        $('#tabstrip ul:first li:eq(4) a').show();
        $('#tabstrip ul:first li:eq(5) a').show();
        ShowProcessDetailsNew("CLAIMVIEW", "divDetail", isdblclick, subprocesssno, CurrentClaimSNo);
        $('#tabstrip ul:first li:eq(0) a').unbind("click").bind("click", function () {
            $('#tabstrip ul:first li:eq(0)').css("background-color", "green");
            $('#tabstrip ul:first li:eq(1)').css("background-color", "");
            $('#tabstrip ul:first li:eq(2)').css("background-color", "");
            $('#tabstrip ul:first li:eq(3)').css("background-color", "");
            $('#tabstrip ul:first li:eq(4)').css("background-color", "");
            $('#tabstrip ul:first li:eq(5)').css("background-color", "");
            $("#ulTab").show();
            ShowProcessDetailsNew("CLAIMVIEW", "divDetail", isdblclick, subprocesssno, CurrentClaimSNo);
        });
        $('#tabstrip ul:first li:eq(1) a').unbind("click").bind("click", function () {
            $('#tabstrip ul:first li:eq(0)').css("background-color", "");
            $('#tabstrip ul:first li:eq(1)').css("background-color", "green");
            $('#tabstrip ul:first li:eq(2)').css("background-color", "");
            $('#tabstrip ul:first li:eq(3)').css("background-color", "");
            $('#tabstrip ul:first li:eq(4)').css("background-color", "");
            $('#tabstrip ul:first li:eq(5)').css("background-color", "");
            //ClearAll();
            $("#ulTab").show();
            ShowProcessDetailsNew("ACTIONHISTORY", "divDetail", isdblclick, subprocesssno, CurrentClaimSNo);
        });
        $('#tabstrip ul:first li:eq(2) a').unbind("click").bind("click", function () {
            $('#tabstrip ul:first li:eq(0)').css("background-color", "");
            $('#tabstrip ul:first li:eq(1)').css("background-color", "");
            $('#tabstrip ul:first li:eq(2)').css("background-color", "green");
            $('#tabstrip ul:first li:eq(3)').css("background-color", "");
            $('#tabstrip ul:first li:eq(4)').css("background-color", "");
            $('#tabstrip ul:first li:eq(5)').css("background-color", "");
            //ClearAll();
            $("#ulTab").show();
            ShowProcessDetailsNew("ASSIGNHISTORY", "divDetail", isdblclick, subprocesssno, CurrentClaimSNo);
        });
        $('#tabstrip ul:first li:eq(3) a').unbind("click").bind("click", function () {
            $('#tabstrip ul:first li:eq(0)').css("background-color", "");
            $('#tabstrip ul:first li:eq(1)').css("background-color", "");
            $('#tabstrip ul:first li:eq(2)').css("background-color", "");
            $('#tabstrip ul:first li:eq(3)').css("background-color", "green");
            $('#tabstrip ul:first li:eq(4)').css("background-color", "");
            $('#tabstrip ul:first li:eq(5)').css("background-color", "");
            //ClearAll();
            $("#ulTab").show();
            ShowProcessDetailsNew("IRREGULARITY", "divDetail", isdblclick, subprocesssno, CurrentClaimSNo);
        });
        $('#tabstrip ul:first li:eq(4) a').unbind("click").bind("click", function () {
            $('#tabstrip ul:first li:eq(0)').css("background-color", "");
            $('#tabstrip ul:first li:eq(1)').css("background-color", "");
            $('#tabstrip ul:first li:eq(2)').css("background-color", "");
            $('#tabstrip ul:first li:eq(3)').css("background-color", "");
            $('#tabstrip ul:first li:eq(4)').css("background-color", "green");
            $('#tabstrip ul:first li:eq(5)').css("background-color", "");
            //ClearAll();
            $("#ulTab").show();
            ShowProcessDetailsNew("AWBDETAILS", "divDetail", isdblclick, subprocesssno, CurrentClaimSNo);
        });

        $('#tabstrip ul:first li:eq(5) a').unbind("click").bind("click", function () {
            $('#tabstrip ul:first li:eq(0)').css("background-color", "");
            $('#tabstrip ul:first li:eq(1)').css("background-color", "");
            $('#tabstrip ul:first li:eq(2)').css("background-color", "");
            $('#tabstrip ul:first li:eq(3)').css("background-color", "");
            $('#tabstrip ul:first li:eq(4)').css("background-color", "");
            $('#tabstrip ul:first li:eq(5)').css("background-color", "green");
            //ClearAll();
            $("#ulTab").show();
            ShowProcessDetailsNew("PRINTFORMS", "divDetail", isdblclick, subprocesssno, CurrentClaimSNo);
        });
    }
}

function ShowProcessDetailsNew(subprocess, divID, isdblclick, subprocesssno, CurrentClaimSNo) {
    if (subprocess == "CLAIMEDIT") {          
        $.ajax({
            url: "Services/Irregularity/ClaimService.svc/GetWebForm/Claim/Irregularity/" + subprocess + "/Edit/1/" + CurrentClaimSNo + "", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {

                if (result != undefined || result != "") {
                    //GetProcessSequence("Irregularity");
                    $("#divClaimEdit").html(result);
                    InitializePage(subprocess, divID, isdblclick, subprocesssno, CurrentClaimSNo);
                    AuditLogBindOldValue("divClaimEdit");
                    UserSubProcessRights("divClaimEdit", subprocesssno);
                    $('#btnSave').css("display", "none");
                    $('#btnclaimamt').css("display", "none");
                    $('#btnNew').css("display", "none");
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
    if (subprocess == "CLAIMACTION") {
        debugger;
        $.ajax({
            url: "Services/Irregularity/ClaimService.svc/GetWebForm/Claim/Irregularity/" + subprocess + "/New/1/" + CurrentClaimSNo + "", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {

                if (result != undefined || result != "") {
                    $("#divClaimEdit").html(result);
                    InitializePage(subprocess, divID, isdblclick, subprocesssno, CurrentClaimSNo);
                    AuditLogBindOldValue("divClaimEdit");
                    UserSubProcessRights("divClaimEdit", subprocesssno);
                    $('#btnUpdate').css("display", "none");
                    //$("btnclaimamt").css("display", "none");
                    $('#btnNew').css("display", "none");
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
    if (subprocess == "CLAIMASSIGN") {
        $.ajax({
            url: "Services/Irregularity/ClaimService.svc/GetWebForm/Claim/Irregularity/" + subprocess + "/New/1/" + CurrentClaimSNo + "", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result != undefined || result != "") {
                    $("#divClaimEdit").html(result);
                    InitializePage(subprocess, divID, isdblclick, subprocesssno, CurrentClaimSNo);
                    AuditLogBindOldValue("divClaimEdit");
                    UserSubProcessRights("divClaimEdit", subprocesssno);
                    $('#btnUpdate').css("display", "none");
                    $('#btnclaimamt').css("display", "none");
                    $('#btnNew').css("display", "none");
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
    if (subprocess == "CLAIMEDOX") {
        $.ajax({
            url: "Services/Irregularity/ClaimService.svc/GetWebForm/Claim/Irregularity/" + subprocess + "/New/1/" + CurrentClaimSNo + "", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result != undefined || result != "") {
                    $("#divClaimEdit").html(result);
                    //$("#divEdoxCustomer").html(result);

                    InitializePage(subprocess, divID, isdblclick, subprocesssno, CurrentClaimSNo);
                    AuditLogBindOldValue("divClaimEdit");
                    UserSubProcessRights("divClaimEdit", subprocesssno);
                    $('#btnUpdate').css("display", "none");
                    $('#btnclaimamt').css("display", "none");
                    $('#btnNew').css("display", "none");

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
    if (subprocess.toUpperCase() == "AIRLINEEDOX") {
        $.ajax({
            url: "Services/Irregularity/ClaimService.svc/GetWebForm/Claim/Irregularity/AIRLINEEDOX/New/1/" + CurrentClaimSNo + "", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result != undefined || result != "") {
                    $("#divClaimEdit").html(result);
                    //$("#divEdoxAirline").html(result);
                    InitializePage('AIRLINEEDOX', 'divEdoxAirline', 0, 2554, CurrentClaimSNo);
                    AuditLogBindOldValue("divClaimEdit");
                    UserSubProcessRights("divClaimEdit", subprocesssno);
                    $('#btnUpdate').css("display", "none");
                    $('#btnclaimamt').css("display", "none");
                    $('#btnNew').css("display", "none");
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

    if (subprocess == "CLAIMVIEW") {
        $.ajax({
            url: "Services/Irregularity/ClaimService.svc/GetWebForm/Claim/Irregularity/" + subprocess + "/New/1/" + CurrentClaimSNo + "", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {

                if (result != undefined || result != "") {
                    $("#divDetail").html(result);
                    InitializePage(subprocess, divID, isdblclick, subprocesssno, CurrentClaimSNo);
                    AuditLogBindOldValue("divClaimEdit");
                    UserSubProcessRights("divClaimEdit", subprocesssno);
                    $('#btnUpdate').css("display", "none");
                    $('#btnclaimamt').css("display", "none");
                    $('#btnNew').css("display", "none");
                    $('#btnSave').css("display", "none");
                    $('span#Remarks').css("text-transform", "uppercase");
                    $('span#ClaimantName').css("text-transform", "uppercase");
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
        $.ajax({
            url: "Services/Irregularity/ClaimService.svc/GetActionHistory", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ CurrentClaimSNo: CurrentClaimSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var theDiv = document.getElementById("divTab2");
                theDiv.innerHTML = "";
                var table;

                if (parseInt(userContext.CitySNo) == 3992) {
                    table = "<table class='appendGrid ui-widget' id='tblIrregularityHistory'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Claim Action</td><td class='ui-widget-header'>Action Date</td><td class='ui-widget-header'>Description</td><td class='ui-widget-header'>EmailID</td><td class='ui-widget-header'> Status</td><td class='ui-widget-header'>ClaimAmount</td><td class='ui-widget-header'>MaximumLiability</td><td class='ui-widget-header'>ApprovedAmount</td><td class='ui-widget-header'>Raised By</td></tr></thead><tbody class='ui-widget-content'>";
                }
                else {
                    table = "<table class='appendGrid ui-widget' id='tblIrregularityHistory'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Claim Action</td><td class='ui-widget-header'>Action Date</td><td class='ui-widget-header'>Description</td><td class='ui-widget-header'>EmailID</td><td class='ui-widget-header'> Status</td><td class='ui-widget-header'>ClaimAmount</td><td class='ui-widget-header'>ApprovedAmount</td><td class='ui-widget-header'>Raised By</td></tr></thead><tbody class='ui-widget-content'>";
                }

                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        for (var i = 0; i < myData.Table0.length; i++) {
                            if (parseInt(userContext.CitySNo) == 3992) {
                                table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].ClaimActionName + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ActionDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ActionDescription + "</td><td class='ui-widget-content first'>" + myData.Table0[i].EmailID + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ClaimStatus + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ClaimAmount + "</td><td class='ui-widget-content first'>" + myData.Table0[i].MaxLiability + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ApprovedAmount + "</td><td class='ui-widget-content first'>" + myData.Table0[i].RaisedBy + "</td></tr>";
                            }
                            else {
                                table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].ClaimActionName + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ActionDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ActionDescription + "</td><td class='ui-widget-content first'>" + myData.Table0[i].EmailID + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ClaimStatus + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ClaimAmount + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ApprovedAmount + "</td><td class='ui-widget-content first'>" + myData.Table0[i].RaisedBy + "</td></tr>";
                            }
                        }
                        table += "</tbody></table>";
                        theDiv.innerHTML += table;
                    }
                    else {
                        var table = "<table class='appendGrid ui-widget' id='tblActionHistory'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>No Record Found</td></tr></thead></table";
                        theDiv.innerHTML += table;
                    }
                    InitializePage(subprocess, divID, isdblclick, subprocesssno, CurrentClaimSNo);
                    AuditLogBindOldValue("divClaimEdit");
                    UserSubProcessRights("divClaimEdit", subprocesssno);
                    $('#btnUpdate').css("display", "none");
                    $('#btnclaimamt').css("display", "none");
                    $('#btnNew').css("display", "none");
                    $('#btnSave').css("display", "none");
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
        $.ajax({
            url: "Services/Irregularity/ClaimService.svc/GetAssignHistory", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ CurrentClaimSNo: CurrentClaimSNo }),
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
                    InitializePage(subprocess, divID, isdblclick, subprocesssno, CurrentClaimSNo);
                    AuditLogBindOldValue("divClaimEdit");
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
        $.ajax({
            url: "Services/Irregularity/ClaimService.svc/GetIrregularityHistory", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ "CurrentClaimSNo": CurrentClaimSNo }),
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
                    InitializePage(subprocess, divID, isdblclick, subprocesssno, CurrentClaimSNo);
                    AuditLogBindOldValue("divClaimEdit");
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

    if (subprocess == "AWBDETAILS") {
        $.ajax({
            url: "Services/Irregularity/ClaimService.svc/GetWebForm/Claim/Irregularity/" + subprocess + "/New/1/" + CurrentClaimSNo + "", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result != undefined || result != "") {
                    $("#divTab5").html(result);
                    InitializePage(subprocess, divID, isdblclick, subprocesssno, CurrentClaimSNo);
                    AuditLogBindOldValue("divClaimEdit");
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

    if (subprocess == "PRINTFORMS") {
        var theDiv = document.getElementById("divTab6");
        theDiv.innerHTML = "";
        var tablehead = "<table class='appendGrid ui-widget' id='tblPrintForms'>" +
            "<thead class='ui-widget-header' style='text-align:center'>" +
            "<tr>" +
            "<td class='ui-widget-header'>CCF [Cargo Claim Form]</td>" +
            "<td class='ui-widget-header'>ACCF [Analysis of Claim Cargo Form]</td>" +
            "<td class='ui-widget-header'>SCC [Form of Settlement Cargo Claim]</td>" +
            "<td class='ui-widget-header'>Final Release</td>" 
        var table1= "<td class='ui-widget-header'>Surat Pernyataan Pembebasan</td>" 
            //"<td class='ui-widget-header'>Carrier Survey Report Form</td>" +
         var tr1=   "</tr>" +
            "</thead>" +
            "<tbody class='ui-widget-content'>";

       var tablerow = "<tr>" +
            "<td class='ui-widget-content first'><a href='javascript:void(0);' onclick='OpenCCfForm(" + CurrentClaimSNo + ")' ' id='ahref_CCF' title='CCF Form' ><span class='' id='CCFDocName' >CCF Form</span></a></td> " +
            "<td class='ui-widget-content first'><a href='javascript:void(0);' onclick='OpenACCFForm(" + CurrentClaimSNo + ")' id='ahref_ACCF' title='ACCF Form' ><span class='' id='ACCFDoc' >ACCF Form</span></a></td> " +
            "<td class='ui-widget-content first'><a href='javascript:void(0);' onclick='OpenSCCForm(" + CurrentClaimSNo + ")' id='ahref_SCC' title='SCC Form' ><span class='' id='SCCDoc' >SCC Form</span></a></td> " +
            "<td class='ui-widget-content first'><a href='javascript:void(0);' onclick='OpenFinalReleaseForm(" + CurrentClaimSNo + ")' id='ahref_FR' title='Final Release Form' ><span class='' id='FRDoc' >Final Release</span></a></td> "
      var  table2 = 
            "<td class='ui-widget-content first'><a href='javascript:void(0);' onclick='OpenSPPForm(" + CurrentClaimSNo + ")' id='ahref_SPP' title='Surat Pernyataan Pembebasan' ><span class='' id='SPPDoc' >Surat Pernyataan Pembebasan</span></a></td>"

            //"<td class='ui-widget-content first'><a href='javascript:void(0);' onclick='OpenCSRForm(" + CurrentClaimSNo + ")' ' id='ahref_CSR' title='CSR Form' ><span class='' id='CSRDocName' >CSR Form</span></a></td> " +
            //"<td class='ui-widget-content first'><a href='javascript:void(0);'  onclick='OpenFinalReleaseForm(" + CurrentClaimSNo + ")' id='ahref_CLR_CDR' title='Final Release Form' ><span class='' id='CLR_CDRDoc' >CLR-CDR Form</span></a></td> " +
        var tr2 =   "</tr>";
        if (userContext.SysSetting.ClientEnvironment == 'UK' || userContext.SysSetting.ClientEnvironment=='G8') {
            tablehead += tr1 + tablerow + tr2;
            tablehead += "</tbody></table>";
        }
        else
        {
            tablehead += table1 + tr1 +tablerow+ table2 + tr2;
            tablehead += "</tbody></table>";
        }
        theDiv.innerHTML += tablehead;

        //var table = "<table class='appendGrid ui-widget' id='tblIrregularityHistory'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>No Record Found</td></tr></thead></table";
        //theDiv.innerHTML += table;

        InitializePage(subprocess, divID, isdblclick, subprocesssno, CurrentClaimSNo);
        AuditLogBindOldValue("divClaimEdit");
    }
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

            if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {

                // AuditLogBindOldValue("divClaimEdit");
                //AuditLogSaveNewValue("divbody");
                // AuditLogSaveNewValue("divClaimEdit", true, "");
            }


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
//cp start

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
                            ShowMessage('warning', 'Warning - Claim', "Email Already Entered");
                            $("#EmailId").val('');
                        }
                        //---------------end
                        else {
                            var listlen = $("ul#addlist2 li").length;
                            $("ul#addlist2").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + addlen + " </span><span id='" + listlen + "' class='k-icon k-delete remove'></span></li>");
                        }
                    }
                    //else {
                    //    ShowMessage('warning', 'Warning - Claim', "Maximum 3 E-mail Addresses allowed.");
                    //}
                    $("#EmailId").val('');
                    $("#EmailId").removeAttr('data-valid');
                }
                else {
                    ShowMessage('warning', 'Warning - Claim', "Please enter valid Email Address.");
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
    // var arm = $("#Email").val().toUpperCase()
    $("#EmailId").keyup(function (e) {
        var addlen = $("#EmailId").val().toUpperCase();
        var iKeyCode = (e.which) ? e.which : e.keyCode
        if (iKeyCode == 32) {
            addlen = addlen.slice(0, -1);
            if (addlen != "") {
                if (ValidateEMail(addlen)) {
                    if ($("ul#addlist2 li").length >= 0) {
                        //------- For Duplicate Email --------------
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
                    //else {
                    //    ShowMessage('warning', 'Warning - Action', "Maximum 3 E-mail Addresses allowed.");
                    //}
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
//cp end
var glb_subprocess = "";
var glb_currentclaimsno;

function InitializePage(subprocess, cntrlid, isdblclick, subprocesssno, CurrentClaimSNo) {
    glb_subprocess = subprocess;
    glb_currentclaimsno = CurrentClaimSNo;
    InstantiateControl(cntrlid);
    $('#divDetail3').html("");
    $('#divDetail').show();

    $("#btnChargeNote").hide();
    $("#btnUpdate").hide();
    //$("#btnSave").show();
    $("#btnNew").hide();

    var UOM = [{ Key: "0", Text: "Kg" }, { Key: "1", Text: "Lbs" }];
    $('.formfourlabel').css('border-top', '1px solid rgb(190, 189, 190)');
    $('.formfourInputcolumn').css('border-top', '1px solid rgb(190, 189, 190)');
    if (subprocess.toUpperCase() == "CLAIMNEW") {

        //cp start

        var spnlbl2 = $("<span class='k-label'id='EmailLabel'>(Press space key to capture receiver E-mail Address </br> and Add New E-mail ( If Required))</span>");
        $("#EmailId").after(spnlbl2);
        // $("#EmailLabel").hide();

        divemail = $("<div id='divemailAdd' style='height:45px;width:300px;border: 1px solid rgb(204, 204, 204);overflow-y: scroll;'><ul id='addlist2' style='padding:3px 2px 2px 0px;margin-top:0px;'></ul></div>");
        if ($("#divemailAdd").length == 0)
            $("#EmailId").after(divemail);
        SetEMailNew();
        $("#EmailId").css("text-transform", "uppercase");

        //cp end

        cfi.AutoCompleteV2("CitySNo", "CityCode,CityName", "Claim_City");
        cfi.AutoCompleteV2("ClaimSourceSNo", "Name", "Claim_ClaimSource", ClaimSourceChange, "contains");
        cfi.AutoCompleteV2("ClaimStatusSNo", "Name", "Claim_ClaimSource");
        cfi.AutoCompleteV2("ClaimTypeSNo", "Name", "Claim_ClaimSource");
        cfi.AutoCompleteV2("Currency", "CurrencyCode,CurrencyName", "Claim_Currency", null, "contains");
        cfi.AutoCompleteV2("AWBNo", "AWBNo", "Claim_ComplaintAWBNo", AWBChange, "contains");
        cfi.AutoCompleteV2("HAWBNo", "HAWBNo", "Claim_HAWBNo", HouseAWBChange, "contains");
        cfi.AutoCompleteByDataSource("ComplaintIrregularityList", ComplaintIrregularityList, null);
        cfi.AutoCompleteByDataSource("WeightType", UOM, null, null);
        $('#WeightType').next('.k-widget').css('width', '60');
        $("input[id='RaisedDate']").parent('span').after('<span class="" id="RaisedDate" controltype="datetype"></span>');
        $("input[id='RaisedDate']").parent('span').hide();
        $("span[id='RaisedDate']").html(($("input[id='RaisedDate']").attr("formattedvalue")));
        $("#Text_ComplaintIrregularityList").hide();
        $("#Text_ComplaintIrregularityList").show()
        $("#Text_ComplaintIrregularityList").parent("span").hide();
        $("#btnCancel").show();
        $("#btnSave").show();
        $("#ClaimStatusSNo").val(27);
        $("#Text_ClaimStatusSNo").val("INITIATED");
        if (CurrentClaimSNo != undefined && CurrentClaimSNo != 0 && CurrentClaimSNo != null) {
            RaiseClaimAgainstComplaint(CurrentClaimSNo);
        }
        $("#btnSave").unbind("click").bind("click", function () {

            RequiredEmail();

            if (cfi.IsValidSection(cntrlid)) {







                if (SaveFormData(subprocess, CurrentClaimSNo)) {
                    ClaimGridSearch();
                    ClearAll();
                    CleanUI();



                }
            }
            else {
                return false;
            }
        });
        $('#btnclaimamt').hide();

        if (userContext.GroupName.toUpperCase() == 'GSA') {
            if (userContext.SpecialRights.EOCA != undefined && userContext.SpecialRights.EOCA == true) {
                $("#CitySNo").val(userContext.CitySNo);
                $("#Text_CitySNo").val(userContext.CityCode + '-' + userContext.CityName);

                $('#Text_CitySNo').data("kendoAutoComplete").enable(false);

            }
        }
    }
    if (subprocess.toUpperCase() == "CLAIMEDIT") {

        //cp start

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
            $("#EmailId").removeAttr('data-valid');
        }
        $('#__tblclaimedit__ tr:first').html("<span><b>Edit Claim No. :-" + ClaimNo + "</b></span>");
        cfi.AutoCompleteV2("CitySNo", "CityCode,CityName", "Claim_City");
        cfi.AutoCompleteV2("ClaimSourceSNo", "Name", "Claim_ClaimSource", ClaimSourceChange, "contains");
        cfi.AutoCompleteV2("ClaimStatusSNo", "Name", "Claim_ClaimSource");
        cfi.AutoCompleteV2("ClaimTypeSNo", "Name", "Claim_ClaimSource");
        cfi.AutoCompleteV2("Currency", "CurrencyCode,CurrencyName", "Claim_Currency", null, "contains");
        cfi.AutoCompleteV2("AWBNo", "AWBNo", "Claim_ComplaintAWBNo", AWBChange, "contains");
        cfi.AutoCompleteV2("HAWBNo", "HAWBNo", "Claim_HAWBNo", HouseAWBChange, "contains");
        cfi.AutoCompleteByDataSource("WeightType", UOM, null, null);
        $('#WeightType').next('.k-widget').css('width', '60');
        $("input[id='RaisedDate']").parent('span').after('<span class="" id="RaisedDate" controltype="datetype"></span>');
        $("input[id='RaisedDate']").parent('span').hide();
        $("span[id='RaisedDate']").html(($("input[id='RaisedDate']").attr("formattedvalue")));
        cfi.AutoCompleteByDataSource("ComplaintIrregularityList", ComplaintIrregularityList, null);
        if ($("#Text_ComplaintIrregularityList").val() != "" && $("#Text_ComplaintIrregularityList").val() != null) {
            $("#Text_ComplaintIrregularityList").show()
            $("#Text_ComplaintIrregularityList").parent("span").show();
        }
        else {
            $("#Text_ComplaintIrregularityList").hide();
            $("#Text_ComplaintIrregularityList").parent("span").hide();
        }
        $("#btnCancel").show();
        $("#btnSave").hide();
        $("#btnUpdate").show();
        //AWBDetails();
        //HouseAWBChange();
        $("#btnUpdate").unbind("click").bind("click", function () {
            RequiredEmail();
            if (cfi.IsValidSection(cntrlid)) {



                if (SaveFormData(subprocess, CurrentClaimSNo)) {
                    ClearAll();
                    ClaimGridSearch();

                }
            }
            else {
                return false;
            }
        });
        $('#btnclaimamt').hide();
    }
    if (subprocess.toUpperCase() == "CLAIMACTION") {

        var spnlbl2 = $("<span class='k-label'id='EmailLabel'>(Press space key to capture receiver E-mail Address and Add New E-mail ( If Required))</span>");
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

        //if (parseInt(userContext.CitySNo) == 3992) {
        //    $('#btnclaimamt').show();
        //}
        //else {
        //    $('#btnclaimamt').hide();
        //}
        $('#btnclaimamt').show();

        cfi.AutoCompleteV2("ClaimActionStatusSNo", "Name", "Claim_ClaimSource", ClaimActionStatusChange, "contains");
        cfi.AutoCompleteV2("ClaimActionSNo", "Name", "Claim_ClaimSource");

        //hide by default approved amount   updated by indra pratap singh
          $("td[title='Enter Approved Amount']").hide();
            $("#_tempApprovedAmount").hide();

        $("#Text_RejectedReason").hide();
        $("#Text_RejectedReason").parent("span").hide();
        $('#__tblclaimaction__ tr:nth-last-child(2) td').eq(4).html("");
        var td = $('#__tblclaimaction__ tr:nth-last-child(2) td').eq(4);
        td.attr('title', '');
        cfi.AutoCompleteByDataSource("RejectedReason", ComplaintIrregularityList, null);
        $('#Text_RejectedReason').attr('data-valid', '');
        $('#Text_RejectedReason').attr('data-valid-msg', '');
        $("input[id='ActionDate']").parent('span').hide();
        $("span[id='ActionDate']").html(($("input[id='ActionDate']").attr("formattedvalue")));
        $("input[id='EmailId']").hide();
        $("input[id='EmailId']").closest('tr').find('td:eq(4)').html("");
        //$('#btnclaimamt').show();
        $("#btnCancel").show();
        $("#btnSave").show();
        $("#btnUpdate").hide();
        $("#_tempCalcClaimAmount").val(claimAmount);
        $("#CalcClaimAmount").val(claimAmount);
        //cp singh
        $("#CalcClaimAmount").prop("readonly", true);

        //
        $("#IssuanceDate").css("width", "146px");
        $("#IssuanceDate").parent("span").css("width", "166px");
        var myDate = new Date();
        myDate.setDate(myDate.getDate() + 1);
        $("#IssuanceDate").data("kendoDatePicker").min(myDate);
        $("#__tblclaimaction__ tr:last").hide();
        $("#btnSave").unbind("click").bind("click", function () {
            RequiredEmail();
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess, CurrentClaimSNo)) {
                    ClaimGridSearch();
                    ClearAll();
                    CleanUI();
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

                //end
                $("input[id='EmailId']").show();
                $("input[id='EmailId']").closest('tr').find('td:eq(4)').html("<font color='red'>*</font><span id='spnEmailId'> EmailId</span>");
                //$("input[id='EmailId']").closest('tr').find('td:eq(5)').show();
                $('#EmailId').attr('data-valid', "required");
            }
            else {
                //cp start

                $("#EmailLabel").hide();
                $("#divemailAdd").hide();

                //end
                $("input[id='EmailId']").hide();
                $("input[id='EmailId']").closest('tr').find('td:eq(4)').html("");
                $('#EmailId').attr('data-valid', "");
                //$("input[id='EmailId']").closest('tr').find('td:eq(5)').hide();
            }
        });
        $("#btnclaimamt").unbind("click").bind("click", function () {

            var module = "Irregularity";
            if (_CURR_PRO_ == "Claim") {
                var _CURR_PRO_2 = "CalculateClaim"
                module = "Irregularity";
            }
            $.ajax({
                url: "Services/Irregularity/ClaimService.svc/GetWebForm/" + _CURR_PRO_ + "/" + module + "/CalculateClaim/New/1/" + CurrentClaimSNo + "", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                success: function (result) {
                    $("#divCalculateClaim").html(result);
                    $("#divCalculateClaim").show();
                    if (result != undefined || result != "") {
                        InitializePage("CalculateClaim", "divCalculateClaim", isdblclick, subprocesssno, CurrentClaimSNo);

                    }
                }
            });
        });
    }
    if (subprocess.toUpperCase() == "CLAIMASSIGN") {
        cfi.AutoCompleteV2("UserID", "Name", "Claim_ComplaintUser", null, "contains", ",");
        cfi.AutoCompleteV2("AssignCitySNo", "CityCode", "Claim_AssignCity", null, "contains", ",");
        $("input[id='AssignDate']").parent('span').hide();
        $("span[id='AssignDate']").html(($("input[id='AssignDate']").attr("formattedvalue")));
        $("#btnCancel").show();
        $("#btnSave").show();
        $("#btnUpdate").hide();
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess, CurrentClaimSNo)) {
                    ClaimGridSearch();
                    ClearAll();
                    CleanUI();
                }
            }
            else {
                return false;
            }
        });
        $('#btnclaimamt').hide();
    }
    if (subprocess.toUpperCase() == "CLAIMEDOX") {
        $("#btnCancel").show();
        //$("#btnSave").show();
        $("#btnUpdate").hide();
        BindEDox(CurrentClaimSNo);
        //AirlineBindEDox(CurrentClaimSNo);
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess, CurrentClaimSNo)) {
                    ClaimGridSearch();
                    ClearAll();
                    CleanUI();
                }
            }
            else {
                return false;
            }
        });
    }

    if (subprocess.toUpperCase() == "AIRLINEEDOX") {
        $("#btnCancel").show();
        //$("#btnSave").show();
        $("#btnUpdate").hide();
        // BindEDox(CurrentClaimSNo);
        AirlineBindEDox(CurrentClaimSNo);
        $("#btnSave").unbind("click").bind("click", function () {
            if (cfi.IsValidSection(cntrlid)) {
                if (SaveFormData(subprocess, CurrentClaimSNo)) {
                    ClaimGridSearch();
                    ClearAll();
                    CleanUI();
                }
            }
            else {
                return false;
            }
        });
    }

    if (subprocess.toUpperCase() == "CLAIMVIEW") {
        divemail = $("<div id='divemailAdd' style='height:45px;width:300px;border: 1px solid rgb(204, 204, 204);overflow-y: scroll;'><ul id='addlist2' style='padding:3px 2px 2px 0px;margin-top:0px;'></ul></div>");
        if ($("#divemailAdd").length == 0)
            $("span[id='EmailId']").after(divemail);
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
        $("#divTab6").html(" ");
        $("#divTab2").hide();
        $("#divTab3").hide();
        $("#divTab4").hide();
        $("#divTab5").hide();
        $("#divTab6").hide();
        $("#btnCancel").show();
        $("#btnSave").hide();
        $("#btnUpdate").hide();
        $("input:radio[name='Type']").attr("disabled", true);
        $("#Pcs").attr("readonly", true);
        $("#ClaimAmount").attr("readonly", true);
        $("input[id='RaisedDate']").parent('span').after('<span class="" id="RaisedDate" controltype="datetype"></span>');
        $("input[id='RaisedDate']").parent('span').hide();
        $("span[id='RaisedDate']").html(($("input[id='RaisedDate']").attr("formattedvalue")));
        $("input[id='ClosedDate']").parent('span').hide();
        $("span[id='ClosedDate']").html(($("input[id='ClosedDate']").attr("formattedvalue")));

        if ($("input[id='ClosedDate']").val() == "") {
            //$("span[id='ClosedDate']").html("");
            //$('#__tblclaimview__ tr:last td').eq(1).html("");
            //var td = $('#__tblclaimview__ tr:last td').eq(1);
            //td.attr('title', '');
            $('#__tblclaimview__ tr:last').hide();
        }
    }
    if (subprocess.toUpperCase() == "ACTIONHISTORY") {

        $("#divDetail").hide();
        $("#divDetail").html(" ");
        $("#divTab3").html(" ");
        $("#divTab4").html(" ");
        $("#divTab5").html(" ");
        $("#divTab6").html(" ");
        $("#divTab2").show();
        $("#divTab3").hide();
        $("#divTab4").hide();
        $("#divTab5").hide();
        $("#divTab6").hide();
        $("#btnCancel").show();
        $("#btnSave").hide();
        $("#btnUpdate").hide();
    }
    if (subprocess.toUpperCase() == "ASSIGNHISTORY") {
        $("#divDetail").hide();
        $("#divDetail").html(" ");
        $("#divTab2").html(" ");
        $("#divTab4").html(" ");
        $("#divTab5").html(" ");
        $("#divTab6").html(" ");
        $("#divTab2").hide();
        $("#divTab3").show();
        $("#divTab4").hide();
        $("#divTab5").hide();
        $("#divTab6").hide();
        $("#btnCancel").show();
        $("#btnSave").hide();
        $("#btnUpdate").hide();
    }

    if (subprocess.toUpperCase() == "IRREGULARITY") {
        $("#divDetail").hide();
        $("#divDetail").html(" ");
        $("#divTab2").html(" ");
        $("#divTab3").html(" ");
        $("#divTab5").html(" ");
        $("#divTab6").html(" ");
        $("#divTab2").hide();
        $("#divTab3").hide();
        $("#divTab4").show();
        $("#divTab5").hide();
        $("#divTab6").hide();
        $("#btnCancel").show();
        $("#btnSave").hide();
        $("#btnUpdate").hide();
    }
    if (subprocess.toUpperCase() == "AWBDETAILS") {
        $("#divDetail").hide();
        $("#divDetail").html(" ");
        $("#divTab2").html(" ");
        $("#divTab3").html(" ");
        $("#divTab4").html(" ");
        $("#divTab6").html(" ");
        $("#divTab2").hide();
        $("#divTab3").hide();
        $("#divTab4").hide();
        $("#divTab5").show();
        $("#divTab6").hide();
        $("#btnCancel").show();
        $("#btnSave").hide();
        $("#btnUpdate").hide();
        $('#__tblawbdetails__ tr:last').hide();
    }

    if (subprocess.toUpperCase() == "PRINTFORMS") {
        $("#divDetail").hide();
        $("#divDetail").html(" ");
        $("#divTab2").html(" ");
        $("#divTab3").html(" ");
        $("#divTab4").html(" ");
        $("#divTab5").html(" ");
        //$("#divTab6").html(" ");
        $("#divTab2").hide();
        $("#divTab3").hide();
        $("#divTab4").hide();
        $("#divTab5").hide();
        $("#divTab6").show();
        $("#btnCancel").show();
        $("#btnSave").hide();
        $("#btnUpdate").hide();
        //$('#__tblawbdetails__ tr:last').hide();
    }

    if (subprocess.toUpperCase() == "CALCULATECLAIM") {
        $('#btnclaimamt').hide();
        $('#btnclaimamt').unbind();
        $("#divCalculateClaim").show();
        $('#__tblcalculateclaim__ tr:last').after("<tr><td></td><td><input type='button' id='btnCalcClaimAmt' value='CalcClaimAmount'></td><td></td><td></td></tr>");
        $("#Maxliability").prop('readonly', true);
        if ($("span[id=IsVal]").html() == "False") {
            $("span[id=IsVal]").html("No");
        }
        else {
            $("span[id=IsVal]").html("Yes");
        }
        if ($("span[id=IsPaid]").html() == "False") {
            $("span[id=IsPaid]").html("No");
        }
        else {
            $("span[id=IsPaid]").html("Yes");
        }
        if ($("span[id=IsInsurance]").html() == "False") {
            $("span[id=IsInsurance]").html("No");
        }
        else {
            $("span[id=IsInsurance]").html("Yes");
        }
        //cfi.AutoCompleteByDataSource("Rate", SDRRateDataSource);


        if (userContext.SysSetting.ClientEnvironment == 'UK' || userContext.SysSetting.ClientEnvironment == 'G8') {
            if ($("#AirlineParameterSDRrate").val().toUpperCase() != 'YES') {
                $("#Rate").attr('disabled', 'true')
                $("#_tempRate").attr('disabled', 'true')
            }
            else {
                $("#Rate").removeAttr('disabled')
                $("#_tempRate").removeAttr('disabled')
            }
        }

        if ($("span[id=IsInternational]").html() == "False") {
            if (userContext.SysSetting.ClientEnvironment != 'UK' && userContext.SysSetting.ClientEnvironment!= 'G8') {
                $("span[id=IsInternational]").html("No");
                $("#Rate").hide();
                $("#Rate").parent("span").hide();
                $('#__tblcalculateclaim__ tr:nth-last-child(2) td').eq(2).html("");
                var td = $('#__tblcalculateclaim__ tr:nth-last-child(2) td').eq(2);
                td.attr('title', '');
            }
            else {
                $("#Rate").show();
                $("#Rate").parent("span").show();
                $("#_tempRate").before("<span>INR </span>");
                $("#_tempRate").val('350')
                $("#Rate").val('350')
            }
             
        }
        else {
            $("#Rate").show();
            $("#Rate").parent("span").show();
            $("span[id=IsInternational]").html("Yes");
            $("#_tempRate").before("<span>USD </span>");
            if (userContext.SysSetting.ClientEnvironment == 'UK' || userContext.SysSetting.ClientEnvironment == 'G8') {
                $("#_tempRate").val('25')
                $("#Rate").val('25')
            }
        }
        $("#Maxliability").after("&nbsp;&nbsp;<span id='spanRate'></span>");

        $("#_tempRate").hide();

        $("#btnCalcClaimAmt").unbind("click").bind("click", function () {
            CalculateClaim();
        });
    }
}

var claimPieces;
var claimWT;
var TotalPieces;
var TotalWt;
var IsInternational;
var IrregularityType;

function CalculateClaim() {
    //if ($("input[id=IsInsurance]").val() == "False") {


    if ($("#InsauranceCompany").val() != "" || parseInt($("#InsauranceAmount").val()) != 0) {
        if ($("#InsauranceCompany").val() == "") {
            ShowMessage('warning', 'Warning - Calculate Claim', "Please enter Insurance Company Name", "bottom-right");
            return false;
        }
        else if (parseInt($("#InsauranceAmount").val()) == 0) {
            ShowMessage('warning', 'Warning - Calculate Claim', "Please enter Insurance Amount", "bottom-right");
            return false;
        }
        else if (parseInt($("#SubrogationValue").val()) == 0) {
            ShowMessage('warning', 'Warning - Calculate Claim', "Please enter subrogation value", "bottom-right");
            return false;
        }
        else if (parseFloat(parseFloat($("#SubrogationValue").val()).toFixed(2)) > parseFloat(parseFloat($("#InsauranceAmount").val()).toFixed(2))) {
            ShowMessage('warning', 'Warning - Calculate Claim', "subrogation value should not be greater than Insurance Amount", "bottom-right");
            return false;
        }
        else {
            $("#Maxliability").val($("#SubrogationValue").val());
            $("#_tempApprovedAmount").val($("#Maxliability").val());
            //$("#spanRate").html("IDR");

            if (glb_international == "YES") {
                $("#spanRate").html("USD");
            
            }
            else {
                $("#spanRate").html("IDR");
            }

            $("#ApprovedAmount").val($("#Maxliability").val());
        }
    }
    else {
        if ($('input[id^=DeclaredCarriagevalue]').val() == "0.00") {
            $.ajax({
                url: "Services/Irregularity/ClaimService.svc/GetAWBPieces", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ "CurrentClaimSNo": glb_currentclaimsno }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var data = jQuery.parseJSON(result);
                    if (data.Table0.length > 0) {
                        TotalPieces = parseInt(data.Table0[0].TotalPieces);
                        TotalWt = parseFloat(data.Table0[0].TotalGrossWeight)
                        claimPieces = parseInt(data.Table0[0].ClaimPieces);
                        claimWT = parseFloat(data.Table0[0].ClaimWeight);
                        IsInternational = data.Table0[0].IsInternational;
                        IrregularityType = data.Table0[0].IrregularityType;
                        if (IsInternational == "1" || userContext.SysSetting.ClientEnvironment == 'UK' || userContext.SysSetting.ClientEnvironment == 'G8') {

                            if (parseFloat($("#Rate").val()) > 0) {

                                var max_liability = parseFloat(parseFloat($("#Rate").val()) * parseFloat(claimWT)).toFixed(2);
                                $("#Maxliability").val(max_liability);
                           //     $("#spanRate").html("USD"); $("#spanRate").html("USD");
                                $("#_tempApprovedAmount").val($("#Maxliability").val());
                                $("#ApprovedAmount").val($("#Maxliability").val());

                            }
                            else {
                                ShowMessage('warning', 'Warning - Calculate Claim', "Please Enter Rate", "bottom-right");
                                return false;
                                //if ($("#Rate").val() == "USD 20") {
                                //    var max_liability = parseFloat(20 * parseFloat(claimWT)).toFixed(2);
                                //    $("#Maxliability").val(max_liability);
                                //    $("#spanRate").html("USD");
                                //    $("#_tempApprovedAmount").val($("#Maxliability").val());
                                //    $("#ApprovedAmount").val($("#Maxliability").val());
                                //}
                            }
                        }
                        else {
                            if (IrregularityType.toUpperCase() == "LOST" || IrregularityType.toUpperCase() == "DESTROY") {
                                var max_liability = parseFloat(parseFloat(claimWT).toFixed(2) * 100000).toFixed(2);
                                $("#Maxliability").val(max_liability);
                                if (glb_international == "YES") {
                                    $("#spanRate").html("USD");

                                }
                                else {
                                    $("#spanRate").html("IDR");
                                }
                                //$("#spanRate").html("IDR");
                                $("#_tempApprovedAmount").val($("#Maxliability").val());
                                $("#ApprovedAmount").val($("#Maxliability").val());
                            }
                            else {
                                var max_liability = parseFloat(parseFloat(claimWT).toFixed(2) * 50000).toFixed(2);
                                $("#Maxliability").val(max_liability);
                                if (glb_international == "YES") {
                                    $("#spanRate").html("USD");

                                }
                                else {
                                    $("#spanRate").html("IDR");
                                }
                                //$("#spanRate").html("IDR");
                                $("#_tempApprovedAmount").val($("#Maxliability").val());
                                $("#ApprovedAmount").val($("#Maxliability").val());
                            }
                        }
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
        else {
            $("#Maxliability").val($("#DeclaredCarriagevalue").val());
            if (glb_international == "YES") {
                $("#spanRate").html("USD");

            }
            else {
                $("#spanRate").html("IDR");
            }

            $("#_tempApprovedAmount").val($("#Maxliability").val());
            $("#ApprovedAmount").val($("#Maxliability").val());
        }
    }
}

function RaiseClaimAgainstComplaint(CurrentClaimSNo) {
    $("#ClaimSourceSNo").val(51);
    $("#Text_ClaimSourceSNo").val("Complaint");
    //$("#ClaimStatusSNo").val(33);
    //$("#Text_ClaimStatusSNo").val("Open");
    $("#ClaimStatusSNo").val(27);
    $("#Text_ClaimStatusSNo").val("INITIATED");
    AWBChange();
}

var AWBTotalpieces;
var AWBTotalGrosswt;
var AWBGrossUnit;

var HAWBTotalpieces;
var HAWBTotalGrosswt;
var HAWBGrossUnit;


$(document).on('change', '#Type', function () {
    $("#AWBNo").val("");
    $("#Text_AWBNo").val("");
    //("#Pcs").val(");
    $("#_tempPcs").val("");
    $("#_tempWeight").val("");
    $("#Weight").val("");
    $("#WeightType").val("");
    $("#Text_sWeightType").val("");
});

function AWBDetails() {
    $.ajax({
        url: "Services/Irregularity/ClaimService.svc/GetAWBRecords", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ "AWBSNo": $("#AWBNo").val(), "MovementTypeSNo": $("input[name='Type']:checked").val() }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var data = jQuery.parseJSON(result);
            AWBTotalpieces = 0;
            AWBTotalGrosswt = 0;
            AWBGrossUnit = 0;
            if (data.Table0.length != 0) {
                AWBTotalpieces = data.Table0[0].TotalPieces;
                AWBTotalGrosswt = data.Table0[0].TotalGrossWeight;
                AWBGrossUnit = data.Table0[0].GrossUnit;

                //if (glb_subprocess.toUpperCase() != "CLAIMEDIT") {
                $("#Pcs").val(AWBTotalpieces);
                $("#_tempPcs").val(AWBTotalpieces);
                $("#_tempWeight").val(AWBTotalGrosswt);
                $("#Weight").val(AWBTotalGrosswt);
                $("#WeightType").val(AWBGrossUnit);
                if (AWBGrossUnit == 0) {
                    $("#Text_WeightType").val('Kg');
                }
                else {
                    $("#Text_WeightType").val('Lbs');
                }
                //}
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

function AWBChange() {

    AWBDetails();

    if ($("#Text_ClaimSourceSNo").val() != "" && $("#Text_ClaimSourceSNo").val() != null) {
        if ($("#Text_ClaimSourceSNo").val().toUpperCase() == "COMPLAINT") {
            if ($("#Text_AWBNo").val() != "") {
                $.ajax({
                    url: "Services/Irregularity/ClaimService.svc/GetAWBComplaintIrregularityList", async: false, type: "POST", dataType: "json", cache: false,
                    data: JSON.stringify({ "AWBNo": $("#Text_AWBNo").val(), "Status": 0 }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        $('#Text_ComplaintIrregularityList').val("");
                        $('#ComplaintIrregularityList').val("");
                        var data = jQuery.parseJSON(result);
                        if (data.Table0.length != 0) {
                            var out = '[';
                            $.each(data.Table0, function (i, item) {
                                if (item) {
                                    if (parseInt(i) > 0) {
                                        out = out + ',{ Key: "' + $.trim(data.Table0[i].SNo) + '", Text: "' + $.trim(data.Table0[i].ComplaintNo) + '"}'
                                    }
                                    else {
                                        out = out + '{ Key: "' + $.trim(data.Table0[i].SNo) + '", Text: "' + $.trim(data.Table0[i].ComplaintNo) + '"}'
                                    }
                                }
                            });
                            out = out + ']';
                            var lCollection = eval(out);
                            cfi.ChangeAutoCompleteDataSource("ComplaintIrregularityList", lCollection);
                            $('#Text_ComplaintIrregularityList').attr('data-valid', 'required');
                            $('#Text_ComplaintIrregularityList').attr('data-valid-msg', 'Select  Complaint No.');
                            $("#Text_ComplaintIrregularityList").parent("span").show()
                            $("#Text_ComplaintIrregularityList").show();
                        }
                        else {
                            ShowMessage('warning', 'Warning - New Claim', "There is no Complaint generated for this <br/> AWBNo.-" + $("#Text_AWBNo").val(), "bottom-right");
                            cfi.AutoCompleteByDataSource("ComplaintIrregularityList", ComplaintIrregularityList, null);
                            $("#Text_ComplaintIrregularityList").hide();
                            $("#Text_ComplaintIrregularityList").parent("span").hide();
                            $('#Text_ComplaintIrregularityList').attr('data-valid', '');
                            $('#Text_ComplaintIrregularityList').attr('data-valid-msg', '');
                            $("#Text_AWBNo").val("");
                            $("#AWBNo").val("");
                            $("#Pcs").val("");
                            $("#_tempPcs").val("");
                            $("#_tempWeight").val("");
                            $("#Weight").val("");
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

        if ($("#Text_ClaimSourceSNo").val().toUpperCase() == "IRREGULARITY") {
            if ($("#Text_AWBNo").val() != "") {
                $.ajax({
                    url: "Services/Irregularity/ClaimService.svc/GetAWBComplaintIrregularityList", async: false, type: "POST", dataType: "json", cache: false,
                    data: JSON.stringify({ "AWBNo": $("#Text_AWBNo").val(), "Status": 1 }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        $('#Text_ComplaintIrregularityList').val("");
                        $('#ComplaintIrregularityList').val("");
                        var data = jQuery.parseJSON(result);
                        if (data.Table0.length != 0) {
                            var out = '[';
                            $.each(data.Table0, function (i, item) {
                                if (item) {
                                    if (parseInt(i) > 0) {
                                        out = out + ',{ Key: "' + $.trim(data.Table0[i].IncidentCategorySNo) + '", Text: "' + $.trim(data.Table0[i].IncidentCategory) + '"}'
                                    }
                                    else {
                                        out = out + '{ Key: "' + $.trim(data.Table0[i].IncidentCategorySNo) + '", Text: "' + $.trim(data.Table0[i].IncidentCategory) + '"}'
                                    }
                                }
                            });
                            out = out + ']';
                            var lCollection = eval(out);
                            cfi.ChangeAutoCompleteDataSource("ComplaintIrregularityList", lCollection);

                            $('#Text_ComplaintIrregularityList').attr('data-valid', 'required');
                            $('#Text_ComplaintIrregularityList').attr('data-valid-msg', 'Select Irregualrity Incident Type');

                            $("#Text_ComplaintIrregularityList").parent("span").show();
                            $("#Text_ComplaintIrregularityList").show();
                        }
                        else {
                            ShowMessage('warning', 'Warning - New Claim', "There is no Irregularity generated for this <br/> AWBNo.-" + $("#Text_AWBNo").val(), "bottom-right");
                            cfi.AutoCompleteByDataSource("ComplaintIrregularityList", ComplaintIrregularityList, null);
                            $("#Text_ComplaintIrregularityList").hide();
                            $("#Text_ComplaintIrregularityList").parent("span").hide();
                            $('#Text_ComplaintIrregularityList').attr('data-valid', '');
                            $('#Text_ComplaintIrregularityList').attr('data-valid-msg', '');
                            $("#Text_AWBNo").val("");
                            $("#AWBNo").val("");
                            $("#Pcs").val("");
                            $("#_tempPcs").val("");
                            $("#_tempWeight").val("");
                            $("#Weight").val("");

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
    }
    else {
        ShowMessage('warning', 'Warning - New Claim', "Please Select Claim Source First", "bottom-right");
        $("#Text_ComplaintIrregularityList").hide();
        $("#Text_ComplaintIrregularityList").parent("span").hide();
        $('#Text_ComplaintIrregularityList').attr('data-valid', '');
        $('#Text_ComplaintIrregularityList').attr('data-valid-msg', '');
        $("#Text_AWBNo").val("");
        $("#AWBNo").val("");
        $("#Pcs").val("");
        $("#_tempPcs").val("");
        $("#_tempWeight").val("");
        $("#Weight").val("");
        $("#Text_WeightType").val('');
        $("#WeightType").val('');
    }
}

function HouseAWBChange() {
    if ($("#Text_HAWBNo").val() != "" && $("#Text_HAWBNo").val() != null) {
        $.ajax({
            url: "Services/Irregularity/ClaimService.svc/GetHouseAWBRecords", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ "HAWBSNo": $("#HAWBNo").val(), "MovementTypeSNo": $("input[name='Type']:checked").val() }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var data = jQuery.parseJSON(result);
                HAWBTotalpieces = 0;
                HAWBTotalGrosswt = 0;
                HAWBGrossUnit = 0;
                if (data.Table0.length != 0) {
                    HAWBTotalpieces = data.Table0[0].TotalPieces;
                    HAWBTotalGrosswt = data.Table0[0].TotalGrossWeight;
                    HAWBGrossUnit = data.Table0[0].GrossUnit;
                    if (glb_subprocess.toUpperCase() != "CLAIMEDIT") {
                        $("#Pcs").val(HAWBTotalpieces);
                        $("#_tempPcs").val(HAWBTotalpieces);
                        $("#_tempWeight").val(HAWBTotalGrosswt);
                        $("#Weight").val(HAWBTotalGrosswt);
                        $("#WeightType").val(HAWBGrossUnit);
                        if (HAWBGrossUnit == 0) {
                            $("#Text_WeightType").val('Kg');
                        }
                        else {
                            $("#Text_WeightType").val('Lbs');
                        }
                    }
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
    else {
        $("#Pcs").val(AWBTotalpieces);
        $("#_tempPcs").val(AWBTotalpieces);
        $("#_tempWeight").val(AWBTotalGrosswt);
        $("#Weight").val(AWBTotalGrosswt);
        $("#WeightType").val(AWBGrossUnit);
        if (AWBGrossUnit == 0) {
            $("#Text_WeightType").val('Kg');
        }
        else {
            $("#Text_WeightType").val('Lbs');
        }
    }
}

var ComplaintIrregularityList = [{ Key: "", Text: "" }];

function ClaimSourceChange() {
    if (glb_subprocess.toUpperCase() == "CLAIMEDIT") {
        if ($("#Text_ClaimSourceSNo").val().toUpperCase() == "COMPLAINT" || $("#Text_ClaimSourceSNo").val().toUpperCase() == "IRREGULARITY") {
            $("#Text_ComplaintIrregularityList").show();
            $("#Text_ComplaintIrregularityList").parent("span").hide();
        }
        else {
            $("#Text_ComplaintIrregularityList").hide();
            $("#Text_ComplaintIrregularityList").parent("span").hide();
        }
    }
    else {
        $("#Text_ComplaintIrregularityList").hide();
        $("#Text_ComplaintIrregularityList").parent("span").hide();
        $("#AWBNo").val("");
        $("#Text_AWBNo").val("");
        cfi.AutoCompleteByDataSource("ComplaintIrregularityList", ComplaintIrregularityList, null);
    }
}

function ReasonChange() {
    $("#__tblclaimaction__ tr:last").show();
}
function ClaimActionStatusChange()

{

    //if ($("#Text_ClaimActionStatusSNo").val().toUpperCase() == "APPROVED" || $("#Text_ClaimActionStatusSNo").val().toUpperCase() == "CLOSED") {
    //    $('#_tempApprovedAmount').hide();
    //}


    if ($("#Text_ClaimActionStatusSNo").val().toUpperCase() == "SETTLED") {
        //cfi.ResetAutoComplete("RejectedReason");
        cfi.AutoCompleteV2("RejectedReason", "Name", "Claim_RejectedReason", ReasonChange, "contains");
        $('#__tblclaimaction__ tr:nth-last-child(2) td').eq(4).html("<font color='red'>*</font>&nbsp;Remitance Mode");
        $('#Text_RejectedReason').show();
        $('#Text_RejectedReason').parent("span").show();
        var td = $('#__tblclaimaction__ tr:nth-last-child(2) td').eq(4);
        td.attr('title', 'Select RemitanceMode');
        $('#Text_RejectedReason').attr('data-valid', 'required');
        $('#Text_RejectedReason').attr('data-valid-msg', 'Select  Remitance Mode.');
        $('#Text_RejectedReason').val("");
        $('#RejectedReason').val("");
        $('#IssuanceDate').attr('data-valid', 'required');
        $('#RemitanceDetails').attr('data-valid', 'required');
        $('#_tempApprovedAmount').hide();

        $("td[title='Enter Approved Amount']").hide();

    }
    else if ($("#Text_ClaimActionStatusSNo").val().toUpperCase() == "REJECTED") {
        //cfi.ResetAutoComplete("RejectedReason");
        cfi.AutoCompleteV2("RejectedReason", "Name", "Claim_RejectedReason1");
        $('#Text_RejectedReason').show();
        $('#Text_RejectedReason').parent("span").show();
        //$('#__tblclaimaction__ tr:nth-last-child(2) td').eq(4).html("<font>&nbsp;&nbsp;&nbsp;</font>Rejected Reason");
        $('#__tblclaimaction__ tr:nth-last-child(2) td').eq(4).html("<font color='red'>*</font>&nbsp;Rejected Reason");
        var td = $('#__tblclaimaction__ tr:nth-last-child(2) td').eq(4);
        td.attr('title', 'Select Rejected Reason');
        $('#Text_RejectedReason').val("");
        $('#RejectedReason').val("");
        $('#Text_RejectedReason').attr('data-valid', 'required');
        $('#Text_RejectedReason').attr('data-valid-msg', 'Select Rejected Reason.');
        $("#__tblclaimaction__ tr:last").hide();
        $('#IssuanceDate').attr('data-valid', '');
        $('#RemitanceDetails').attr('data-valid', '');
        $('#_tempApprovedAmount').hide();

        $("td[title='Enter Approved Amount']").hide();

    }
    else if ($("#Text_ClaimActionStatusSNo").val().toUpperCase() == "INITIATED") {

         $('#Text_RejectedReason').hide();
         $('#Text_RejectedReason').parent("span").hide();
         $('#__tblclaimaction__ tr:nth-last-child(2) td').eq(4).html("");
         var td = $('#__tblclaimaction__ tr:nth-last-child(2) td').eq(4);
         td.attr('title', '');
        $('#_tempApprovedAmount').hide();
        $("td[title='Enter Approved Amount']").hide();
        $("#__tblclaimaction__ tr:last").hide();
        $('#__tblclaimaction__ tr:nth-last-child(2) td').eq(4).html("");

        //var td = $('#__tblclaimaction__ tr:nth-last-child(4) td').eq(4);
        // $("#__tblclaimaction__ tr:last").hide();
        //$('#__tblclaimaction__ tr:nth-last-child(4) td').hide();
    }

    else if ($("#Text_ClaimActionStatusSNo").val().toUpperCase() == "INSURED") {
        $('#Text_RejectedReason').hide();
        $('#Text_RejectedReason').parent("span").hide();
         $('#__tblclaimaction__ tr:nth-last-child(2) td').eq(4).html("");
        var td = $('#__tblclaimaction__ tr:nth-last-child(2) td').eq(4);
        td.attr('title', '');
        $('#_tempApprovedAmount').hide();
        $("#__tblclaimaction__ tr:last").hide();
        $("td[title='Enter Approved Amount']").hide();
       $('#__tblclaimaction__ tr:nth-last-child(2) td').eq(4).html("");




    }
    else if ($("#Text_ClaimActionStatusSNo").val().toUpperCase() == "OPEN") {
        $('#Text_RejectedReason').hide();
        $('#Text_RejectedReason').parent("span").hide();
        $('#__tblclaimaction__ tr:nth-last-child(2) td').eq(4).html("");
        var td = $('#__tblclaimaction__ tr:nth-last-child(2) td').eq(4);
        td.attr('title', '');
        $("#__tblclaimaction__ tr:last").hide();
        $('#_tempApprovedAmount').hide();

        $("td[title='Enter Approved Amount']").hide();
       


}
    else {
        $('#Text_RejectedReason').val("");
        $('#RejectedReason').val("");
        $("#Text_RejectedReason").hide();
        $("#Text_RejectedReason").parent("span").hide();
        $('#__tblclaimaction__ tr:nth-last-child(2) td').eq(4).html("");
        var td = $('#__tblclaimaction__ tr:nth-last-child(2) td').eq(4);
        td.attr('title', '');
        cfi.ResetAutoComplete("RejectedReason");
        cfi.AutoCompleteByDataSource("RejectedReason", ComplaintIrregularityList, null);
        $('#Text_RejectedReason').attr('data-valid', '');
        $('#Text_RejectedReason').attr('data-valid-msg', '');
        $("#__tblclaimaction__ tr:last").hide();
        $('#IssuanceDate').attr('data-valid', '');
        $('#RemitanceDetails').attr('data-valid', '');
        $('#_tempApprovedAmount').show();
        $("td[title='Enter Approved Amount']").show();
    }


}

function ExtraCondition(textId) {
    var filterName = cfi.getFilter("AND");
    var filterdiscounting = cfi.getFilter("AND");
    var filterClaim = cfi.getFilter("AND");
    if (textId == "Text_ClaimSourceSNo") {
        cfi.ResetAutoComplete("AWBNo");
    }
    if (textId.indexOf("Text_searchClaimStatus") >= 0) {
        cfi.setFilter(filterName, "ApplicationSNo", "eq", 6);
        cfi.setFilter(filterName, "IsActive", "eq", 1);
        var ClaimAutoCompleteFilter = cfi.autoCompleteFilter(filterName);
        return ClaimAutoCompleteFilter;
    }
    //if (textId.indexOf("Text_UserID") >= 0) {
    //    if ($("#AssignCitySNo").val() == "" || $("#AssignCitySNo").val() == null) {
    //        ShowMessage('warning', 'Warning -  Claim Assign', "Please Select City First", "bottom-right");
    //        cfi.setFilter(filterClaim, "CitySNo", "eq", 0);
    //        var ComplainAutoCompleteFilter = cfi.autoCompleteFilter(filterClaim);
    //        return ComplainAutoCompleteFilter;
    //    }
    //    else {
    //        cfi.setFilter(filterClaim, "CitySNo", "in", $("#AssignCitySNo").val());
    //        var ComplainAutoCompleteFilter = cfi.autoCompleteFilter(filterClaim);
    //        return ComplainAutoCompleteFilter;
    //    }
    //}

    if (textId.indexOf("Text_ClaimStatusSNo") >= 0) {
        cfi.setFilter(filterClaim, "ApplicationSNo", "eq", 6);
        cfi.setFilter(filterClaim, "IsActive", "eq", 1);
		cfi.setFilter(filterClaim, "Name", "notin", "CLOSED");
		if (userContext.CityCode != 'DEL' && userContext.SysSetting.ClientEnvironment == 'UK' || userContext.SysSetting.ClientEnvironment == 'G8') {
			cfi.setFilter(filterClaim, "SNo", "neq", 41);
		}
		else if (userContext.CityCode != 'JKT' && userContext.SysSetting.ClientEnvironment != 'UK' &&  userContext.SysSetting.ClientEnvironment != 'G8') {
			cfi.setFilter(filterClaim, "SNo", "neq", 41);
		}		 
        //if (userContext.CitySNo != 3992) {
        //    cfi.setFilter(filterClaim, "SNo", "neq", 41);
        //}
        var ComplainAutoCompleteFilter = cfi.autoCompleteFilter(filterClaim);
        return ComplainAutoCompleteFilter;
    }
    if (textId.indexOf("Text_ClaimActionStatusSNo") >= 0) {
        cfi.setFilter(filterClaim, "ApplicationSNo", "eq", 6);
        cfi.setFilter(filterClaim, "Name", "in", GetSubProcessName);
        cfi.setFilter(filterClaim, "IsActive", "eq", 1);
        if (userContext.SysSetting.ClientEnvironment != 'TH') {
            if (userContext.CityCode != 'DEL' && userContext.SysSetting.ClientEnvironment == 'UK' || userContext.SysSetting.ClientEnvironment == 'G8') {
                cfi.setFilter(filterClaim, "SNo", "neq", 41);
            }
            else if (userContext.CityCode != 'JKT' && userContext.SysSetting.ClientEnvironment != 'UK' && userContext.SysSetting.ClientEnvironment != 'G8') {
                cfi.setFilter(filterClaim, "SNo", "neq", 41);
            }
        }

        //if (userContext.CitySNo != 3992) {
        //    cfi.setFilter(filterClaim, "SNo", "neq", 41);
        //}
        var ComplainAutoCompleteFilter = cfi.autoCompleteFilter(filterClaim);
        return ComplainAutoCompleteFilter;
    }
    if (textId.indexOf("Text_ClaimActionSNo") >= 0) {
        cfi.setFilter(filterClaim, "ApplicationSNo", "eq", 7);
        cfi.setFilter(filterClaim, "IsActive", "eq", 1);
        var ComplainAutoCompleteFilter = cfi.autoCompleteFilter(filterClaim);
        return ComplainAutoCompleteFilter;
    }

    if (textId.indexOf("Text_DocType") >= 0) {
        cfi.setFilter(filterName, "ApplicationSNo", "eq", 11);
        cfi.setFilter(filterName, "IsActive", "eq", 1);
        var ClaimAutoCompleteFilter = cfi.autoCompleteFilter(filterName);
        return ClaimAutoCompleteFilter;
    }
    if (textId.indexOf("Text_AirlineDocType") >= 0) {
        cfi.setFilter(filterName, "ApplicationSNo", "eq", 12);
        cfi.setFilter(filterName, "IsActive", "eq", 1);
        var ClaimAutoCompleteFilter = cfi.autoCompleteFilter(filterName);
        return ClaimAutoCompleteFilter;
    }
    if (textId.indexOf("Text_ClaimSourceSNo") >= 0) {
        cfi.setFilter(filterClaim, "ApplicationSNo", "eq", 5);
        cfi.setFilter(filterClaim, "IsActive", "eq", 1);
        var ComplainAutoCompleteFilter = cfi.autoCompleteFilter(filterClaim);
        return ComplainAutoCompleteFilter;
    }
    if (textId.indexOf("Text_ClaimStatusSNo") >= 0) {
        cfi.setFilter(filterClaim, "ApplicationSNo", "eq", 6);
        cfi.setFilter(filterClaim, "IsActive", "eq", 1);
        var ComplainAutoCompleteFilter = cfi.autoCompleteFilter(filterClaim);
        return ComplainAutoCompleteFilter;
    }
    if (textId.indexOf("Text_ClaimTypeSNo") >= 0) {
        cfi.setFilter(filterClaim, "ApplicationSNo", "eq", 8);
        cfi.setFilter(filterClaim, "IsActive", "eq", 1);
        var ComplainAutoCompleteFilter = cfi.autoCompleteFilter(filterClaim);
        return ComplainAutoCompleteFilter;
    }

    if (textId.indexOf("Text_AWBNo") >= 0) {
        if (parseInt(($("input[name='Type']:checked").val())) == 0) {
            cfi.setFilter(filterClaim, "MovementTypeSNo", "eq", 1);
            if ($("#Text_ClaimSourceSNo").val().toUpperCase() == "COMPLAINT") {

                cfi.setFilter(filterClaim, "Complaint", "eq", "1");
            }
            if ($("#Text_ClaimSourceSNo").val().toUpperCase() == "IRREGULARITY") {
                cfi.setFilter(filterClaim, "Irregularity", "eq", "1");
            }
        }
        else {
            cfi.setFilter(filterClaim, "MovementTypeSNo", "eq", 2);
            if ($("#Text_ClaimSourceSNo").val().toUpperCase() == "COMPLAINT") {

                cfi.setFilter(filterClaim, "Complaint", "eq", "1");
            }
            if ($("#Text_ClaimSourceSNo").val().toUpperCase() == "IRREGULARITY") {
                cfi.setFilter(filterClaim, "Irregularity", "eq", "1");
            }
        }
        var ComplainAutoCompleteFilter = cfi.autoCompleteFilter(filterClaim);
        return ComplainAutoCompleteFilter;
    }

    if (textId.indexOf("Text_HAWBNo") >= 0) {
        if (parseInt(($("input[name='Type']:checked").val())) == 0) {
            cfi.setFilter(filterClaim, "MovementTypeSNo", "eq", 1);
            if ($("#Text_AWBNo").val().toUpperCase() != "") {
                cfi.setFilter(filterClaim, "AWBSNo", "eq", $("#AWBNo").val());
            }
            else {
                ShowMessage('warning', 'Warning -   Claim ', "Please Select AWB First", "bottom-right");
                cfi.setFilter(filterClaim, "AWBSNo", "eq", 0);
            }
        }
        else {
            cfi.setFilter(filterClaim, "MovementTypeSNo", "eq", 2);
            if ($("#Text_AWBNo").val().toUpperCase() != "" && $("#Text_AWBNo").val().toUpperCase() != null) {
                cfi.setFilter(filterClaim, "AWBSNo", "eq", $("#AWBNo").val());
            }
            else {
                ShowMessage('warning', 'Warning -   Claim ', "Please Select AWB First", "bottom-right");
                cfi.setFilter(filterClaim, "AWBSNo", "eq", 0);
            }
        }
        var ComplainAutoCompleteFilter = cfi.autoCompleteFilter(filterClaim);
        return ComplainAutoCompleteFilter;
    }

}

function SaveFormData(subprocess, CurrentClaimSNo) {
    var issave = false;
    if (subprocess.toUpperCase() == "CLAIMNEW") {
        issave = SaveNewClaim();
    }
    if (subprocess.toUpperCase() == "CLAIMEDIT") {
        issave = UpdateNewClaim(CurrentClaimSNo);
    }
    if (subprocess.toUpperCase() == "CLAIMACTION") {
        // alert(CurrentClaimSNo)
        issave = SaveAction(CurrentClaimSNo);
    }
    if (subprocess.toUpperCase() == "CLAIMASSIGN") {
        issave = SaveAssign(CurrentClaimSNo);
    }
    if (subprocess.toUpperCase() == "CLAIMEDOX") {
        issave = SaveEDoxList(CurrentClaimSNo);
    }
    if (subprocess.toUpperCase() == "AIRLINEEDOX") {
        issave = AirlineSaveEDoxList(CurrentClaimSNo);
    }
    return issave;
}

function SaveNewClaim() {
    var obj = {};
    obj.ClaimSourceSNo = $("#ClaimSourceSNo").val();
    obj.RaisedDate = $("#RaisedDate").attr("sqldatevalue");
    obj.AWBNo = $("#AWBNo").val();
    obj.Text_AWBNo = $("#Text_AWBNo").val();
    if (parseInt(($("input[name='Type']:checked").val())) == 0) {
        obj.Type = 1;
    }
    else {
        obj.Type = 2;
    }

    obj.AWBNo = $("#AWBNo").val();
    obj.Text_HAWBNo = $("#Text_HAWBNo").val();
    obj.HAWBNo = $("#HAWBNo").val();
    obj.ClaimTypeSNo = $("#ClaimTypeSNo").val();
    obj.ContactNo = $("#ContactNo").val();
    obj.Remarks = btoa($("#Remarks").val());  //------ arman

    if ($("#EmailId").val() != '') {
        ShowMessage('warning', 'Warning - New Claim', "Please Select  Email-Id.", "bottom-right");
        $("#EmailId").focus();
        return false;
    }
    //cp start
    var M = '';
    for (var i = 0; i < $("ul#addlist2 li").text().split(' ').length - 1; i++) { M = M + $("ul#addlist2 li span").text().split(' ')[i] + ','; }
    $("#EmailId").val(M == '' ? '' : M.substring(0, M.length - 1));


    //cp end


    obj.EmailId = $("#EmailId").val();
    $("#EmailId").val('');
    obj.CitySNo = $("#CitySNo").val();
    obj.ClaimStatusSNo = $("#ClaimStatusSNo").val();
    obj.Pcs = $("#Pcs").val();
    obj.Weight = $("#Weight").val();
    obj.ClaimAmount = $("#ClaimAmount").val();
    obj.WeightType = $("#WeightType").val();
    obj.Currency = $("#Currency").val();
    obj.Text_ClaimSourceSNo = $("#Text_ClaimSourceSNo").val();
    obj.Text_ClaimTypeSNo = $("#Text_ClaimTypeSNo").val();
    obj.Text_ClaimStatusSNo = $("#Text_ClaimStatusSNo").val();
    obj.ClaimantName = $("#ClaimantName").val();
    obj.LoginCitySno = userContext.CitySNo;
    if ($("#Text_HAWBNo").val() == "" || $("#Text_HAWBNo").val() == null) {
        if (parseInt(obj.Pcs) > parseInt(AWBTotalpieces)) {
            ShowMessage('warning', 'Warning - Claim', "Pieces  should not be greater than " + AWBTotalpieces, "bottom-right");
            $("#Pcs").focus();
            return false;
        }
        if (parseFloat(obj.Weight) > parseFloat(AWBTotalGrosswt)) {
            ShowMessage('warning', 'Warning - Claim', "Weight  should not be greater than " + AWBTotalGrosswt, "bottom-right");
            $("#Weight").focus();
            return false;
        }
        obj.Text_HAWBNo = "";
        obj.HAWBNo = 0;
    }
    else {
        if (parseInt(obj.Pcs) > parseInt(HAWBTotalpieces)) {
            ShowMessage('warning', 'Warning - Claim', "Pieces  should not be greater than " + HAWBTotalpieces, "bottom-right");
            $("#Pcs").focus();
            return false;
        }
        if (parseFloat(obj.Weight) > parseFloat(HAWBTotalGrosswt)) {
            ShowMessage('warning', 'Warning - Claim', "Weight  should not be greater than " + HAWBTotalGrosswt, "bottom-right");
            $("#Weight").focus();
            return false;
        }
    }
    obj.Text_Currency = $("#Text_Currency").val();
    if ($("#Text_ClaimSourceSNo").val().toUpperCase() == "COMPLAINT" || $("#Text_ClaimSourceSNo").val().toUpperCase() == "IRREGULARITY") {
        obj.ComplaintIrregularityList = $("#ComplaintIrregularityList").val();
        obj.Text_ComplaintIrregularityList = $("#Text_ComplaintIrregularityList").val();
    }
    else {
        obj.ComplaintIrregularityList = 0;
        obj.Text_ComplaintIrregularityList = "";
    }
    if (obj.Pcs == "0" || obj.Weight == "0") {
        if (obj.Pcs == "0" && obj.Weight == "0") {
            ShowMessage('warning', 'Warning - New Claim', "Pieces & Weight should not be 0", "bottom-right");
            $("#Pcs").focus();
            return false;
        }
        if (obj.Pcs == "0") {
            ShowMessage('warning', 'Warning - New Claim', "Pieces  should not be 0", "bottom-right");
            $("#Pcs").focus();
            return false;
        }
        if (obj.Weight == "0") {
            ShowMessage('warning', 'Warning - New Claim', "Weight  should not be 0", "bottom-right");
            $("#Weight").focus();
            return false;
        }
    }
    var flag = false;
    $.ajax({
        url: "Services/Irregularity/ClaimService.svc/SaveNewClaim", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ obj: obj }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var myData = $.parseJSON(result);
            if (myData.Table1[0].ErrorNumber == "0") {
                AuditLogSaveNewValue("divClaimEdit", true, '', "Claim No.", myData.Table1[0].ClaimNo, '', 'New', userContext.TerminalSNo, userContext.NewTerminalName);
                //Added By Shivali Thakur
                if (sessionStorage.getItem("auditlog") != null) {
                    var auditLog = JSON.parse(sessionStorage.getItem("auditlog"));
                    SaveAppendGridAuditLog(auditLog.KeyColumn, auditLog.KeyValue, auditLog.keySNo, auditLog.arrVal, auditLog.FormAction, auditLog.TerminalSNo, auditLog.TerminalName)
                }
                ShowMessage('success', 'Success - New Claim', "Claim No. :-" + myData.Table1[0].ClaimNo + " generated Successfully ", "bottom-right");
                $("#btnSave").unbind("click");
                ReloadSameGridPage();
                flag = true;

            }
            else if (myData.Table1[0].ErrorNumber == "0")
                ShowMessage('warning', 'Warning - New Claim', "Please correct value(s) for :- " + result + ".", "bottom-right");
            else 
                ShowMessage('warning', 'Warning - New Claim', "Please correct value(s) for :- " + result + ".", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - DO', " unable to process.", "bottom-right");
        }
    });



    return flag;


}

function UpdateNewClaim(CurrentClaimSNo) {
    var obj = {};
    obj.ClaimSourceSNo = $("#ClaimSourceSNo").val();
    obj.AWBNo = $("#AWBNo").val();
    obj.Text_AWBNo = $("#Text_AWBNo").val();
    if (parseInt(($("input[name='Type']:checked").val())) == 0) {
        obj.Type = 1;
    }
    else {
        obj.Type = 2;
    }
    obj.Text_HAWBNo = $("#Text_HAWBNo").val();
    obj.HAWBNo = $("#HAWBNo").val();
    obj.ClaimTypeSNo = $("#ClaimTypeSNo").val();
    obj.ContactNo = $("#ContactNo").val();
    obj.Remarks = btoa($("#Remarks").val());  //----arman 
    if ($("#EmailId").val() != '') {
        ShowMessage('warning', 'Warning - Update Claim', "Please Select  Email-Id.", "bottom-right");
        $("#EmailId").focus();
        return false;
    }
    //cp start

    var M = '';
    for (var i = 0; i < $("ul#addlist2 li").text().split(' ').length - 1; i++) { M = M + $("ul#addlist2 li span").text().split(' ')[i] + ','; }
    $("#EmailId").val(M == '' ? '' : M.substring(0, M.length - 1));

    //cp end
    obj.EmailId = $("#EmailId").val();
    $("#EmailId").val('');
    obj.CitySNo = $("#CitySNo").val();
    obj.ClaimStatusSNo = $("#ClaimStatusSNo").val();
    obj.Pcs = $("#Pcs").val();
    obj.Weight = $("#Weight").val();
    obj.ClaimAmount = $("#ClaimAmount").val();
    obj.WeightType = $("#WeightType").val();
    obj.ClaimSNo = CurrentClaimSNo;
    obj.Currency = $("#Currency").val();
    obj.Text_Currency = $("#Text_Currency").val();
    obj.ClaimantName = $("#ClaimantName").val();
    if ($("#Text_ClaimSourceSNo").val().toUpperCase() == "COMPLAINT" || $("#Text_ClaimSourceSNo").val().toUpperCase() == "IRREGULARITY") {
        obj.ComplaintIrregularityList = $("#ComplaintIrregularityList").val();
        obj.Text_ComplaintIrregularityList = $("#Text_ComplaintIrregularityList").val();
    }
    else {
        obj.ComplaintIrregularityList = 0;
        obj.Text_ComplaintIrregularityList = "";
    }
    if ($("#Text_HAWBNo").val() == "" || $("#Text_HAWBNo").val() == null) {
        if (parseInt(obj.Pcs) > parseInt(AWBTotalpieces)) {
            ShowMessage('warning', 'Warning - Claim', "Pieces  should not be greater than " + AWBTotalpieces, "bottom-right");
            $("#Pcs").focus();
            return false;
        }
        if (parseFloat(obj.Weight) > parseFloat(AWBTotalGrosswt)) {
            ShowMessage('warning', 'Warning - Claim', "Weight  should not be greater than " + AWBTotalGrosswt, "bottom-right");
            $("#Weight").focus();
            return false;
        }
        obj.Text_HAWBNo = "";
        obj.HAWBNo = 0;
    }
    else {
        if (parseInt(obj.Pcs) > parseInt(HAWBTotalpieces)) {
            ShowMessage('warning', 'Warning - Claim', "Pieces  should not be greater than " + HAWBTotalpieces, "bottom-right");
            $("#Pcs").focus();
            return false;
        }
        if (parseFloat(obj.Weight) > parseFloat(HAWBTotalGrosswt)) {
            ShowMessage('warning', 'Warning - Claim', "Weight  should not be greater than " + HAWBTotalGrosswt, "bottom-right");
            $("#Weight").focus();
            return false;
        }
    }
    if (obj.Pcs == "0" || obj.Weight == "0") {
        if (obj.Pcs == "0" && obj.Weight == "0") {
            ShowMessage('warning', 'Warning - Edit Claim', "Pieces & Weight should not be 0", "bottom-right");
            $("#Pcs").focus();
            return false;
        }
        if (obj.Pcs == "0") {
            ShowMessage('warning', 'Warning - Edit Claim', "Pieces  should not be 0", "bottom-right");
            $("#Pcs").focus();
            return false;
        }
        if (obj.Weight == "0") {
            ShowMessage('warning', 'Warning - Edit Claim', "Weight  should not be 0", "bottom-right");
            $("#Weight").focus();
            return false;
        }
    }

    obj.Text_ClaimSourceSNo = $("#Text_ClaimSourceSNo").val();
    obj.Text_ClaimTypeSNo = $("#Text_ClaimTypeSNo").val();
    obj.Text_ClaimStatusSNo = $("#Text_ClaimStatusSNo").val();

    var flag = false;
    $.ajax({
        url: "Services/Irregularity/ClaimService.svc/UpdateClaim", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ obj: obj }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            //Added By Shivali Thakur ClaimNo for audit log
            var Data = jQuery.parseJSON(result);
            var Array = Data.Table0;

            if (Array.length > 0) {

                ShowMessage('success', 'Success - Update Claim', "Claim Updated Successfully ", "bottom-right");
                AuditLogSaveNewValue("divClaimEdit", true, 'CLAIMEDIT', "Claim No", Array[0].ClaimNo, CurrentClaimSNo, 'Edit', userContext.TerminalSNo, userContext.NewTerminalName);

                if (sessionStorage.getItem("auditlog") != null) {
                    var auditLog = JSON.parse(sessionStorage.getItem("auditlog"));
                    SaveAppendGridAuditLog(auditLog.KeyColumn, auditLog.KeyValue, auditLog.keySNo, auditLog.arrVal, auditLog.FormAction, auditLog.TerminalSNo, auditLog.TerminalName)
                }
                //Closed By Shivali Thakur ClaimNo for audit log
                $("#btnUpdate").unbind("click");
                ReloadSameGridPage();
                flag = true;
            }
            else
                ShowMessage('warning', 'Warning -  Update Claim', "Please correct value(s) for :- " + result + ".", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Update Claim', " unable to process.", "bottom-right");
        }
    });

    return flag;
}

function SaveAssign(CurrentClaimSNo) {

    var obj = {};
    obj.ClaimSNo = CurrentClaimSNo
    obj.UserID = $("#UserID").val();
    obj.AssignCitySNo = $("#AssignCitySNo").val();
    obj.AssignDate = $("#AssignDate").attr("sqldatevalue");
    obj.AssignMessage = $("#AssignMessage").val();

    var flag = false;
    $.ajax({
        url: "Services/Irregularity/ClaimService.svc/SaveAssign", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ obj: obj }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var Array = Data.Table0;

            if (Array.length > 0) {
                ShowMessage('success', 'Success - Claim Assign', "Claim Assign  Successfully ", "bottom-right");
                $("#btnSave").unbind("click");
                ReloadSameGridPage();
                flag = true;
                AuditLogSaveNewValue("divClaimEdit", true, glb_subprocess, "Claim", Array[0].ClaimNo, CurrentClaimSNo, 'Edit', userContext.TerminalSNo, userContext.NewTerminalName);
                //Added By Shivali Thakur
                if (sessionStorage.getItem("auditlog") != null) {
                    var auditLog = JSON.parse(sessionStorage.getItem("auditlog"));
                    SaveAppendGridAuditLog(auditLog.KeyColumn, auditLog.KeyValue, auditLog.keySNo, auditLog.arrVal, auditLog.FormAction, auditLog.TerminalSNo, auditLog.TerminalName)
                }
            }
            else {
                ShowMessage('warning', 'Warning -  Claim Assign', "Please correct value(s) for :- " + result + ".", "bottom-right");
            }
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning -Claim Assign', " unable to process.", "bottom-right");
        }
    });

    return flag;
}

function SaveAction(CurrentClaimSNo) {
    var obj = {};
    obj.ClaimSNo = CurrentClaimSNo
    obj.ClaimActionSNo = $("#ClaimActionSNo").val();
    obj.ActionDate = $("#ActionDate").attr("sqldatevalue");
    obj.ActionDescription = $("#ActionDescription").val();
    obj.ClaimActionStatusSNo = $("#ClaimActionStatusSNo").val();
    if ($("#Notify").prop("checked") == true) {
        obj.IsNotify = 1;
    }
    else {
        obj.IsNotify = 0;
    }
    if ($("#EmailId").val() != '') {
        ShowMessage('warning', 'Warning - Claim Action', "Please Select  Email-Id.", "bottom-right");
        $("#EmailId").focus();
        return false;
    }
    //cp start
    var M = '';
    for (var i = 0; i < $("ul#addlist2 li").text().split(' ').length - 1; i++) { M = M + $("ul#addlist2 li span").text().split(' ')[i] + ','; }
    $("#EmailId").val(M == '' ? '' : M.substring(0, M.length - 1));

//cp end


    obj.EmailId = $("#EmailId").val();
    $("#EmailId").val('');
    obj.ClaimAmount = $("#CalcClaimAmount").val();
    if ($("#InsauranceAmount").val() == undefined || $("#InsauranceAmount").val() == "") {
        obj.InsuranceAmount = "0.00";
    }
    else {
        obj.InsuranceAmount = $("#InsauranceAmount").val();
    }
    if ($("#InsauranceCompany").val() == undefined || $("#InsauranceCompany").val() == "") {
        obj.InsuranceCompany = "";
    }
    else {
        obj.InsuranceCompany = $("#InsauranceCompany").val();
    }

    if ($("#SubrogationValue").val() == undefined || $("#SubrogationValue").val() == "") {
        obj.Subrogationvalue = "0.00";
    }
    else {
        obj.Subrogationvalue = $("#SubrogationValue").val();
    }
    if ($("#ApprovedAmount").val() == undefined || $("#ApprovedAmount").val() == "") {
        obj.ApprovedAmount = "0.00";
    }
    else {
        obj.ApprovedAmount = $("#ApprovedAmount").val();
    }
    if ($("#Maxliability").val() == undefined || $("#Maxliability").val() == "") {
        obj.Maxliability = "0.00";
    }
    else {
        obj.Maxliability = $("#Maxliability").val();
    }

    obj.RejectedReason = $("#RejectedReason").val();
    obj.Text_RejectedReason = $("#Text_RejectedReason").val();

    if ($("#Text_ClaimActionStatusSNo").val().toUpperCase() == "SETTLED") {
        obj.IssuanceDate = $("#IssuanceDate").attr("sqldatevalue");
        obj.RemitanceDetails = $("#RemitanceDetails").val();
    }
    else {
        obj.IssuanceDate = null;
        obj.RemitanceDetails = "";
    }

    if ($("input[id='IsInternational']").val() == 'True') {
        obj.Rate = $("input[id='Text_Rate']").val();
    }
    else {
        obj.Rate = "";
    }

    if (parseFloat(parseFloat(obj.ApprovedAmount).toFixed(2)) > parseFloat(parseFloat(obj.ClaimAmount).toFixed(2))) {
        ShowMessage('warning', 'Warning -  Claim Action', "Approved Amount can not be greater than Claim Amount.", "bottom-right");
        return false;
    }

    if (glb_international == "YES") {

        if (parseFloat(parseFloat(obj.ApprovedAmount).toFixed(2)) > 0) {
            //if (parseFloat(parseFloat(obj.ApprovedAmount).toFixed(2)) >= 1000 && parseFloat(parseFloat(obj.ApprovedAmount).toFixed(2)) <= 2500) {
            //    if (UserOfficeRecord.IsHeadOffice == 0) {
            //        ShowMessage('warning', 'Warning -  Claim Action', "Amount greater than USD 1,000 can not be approved in Branch office.", "bottom-right");
            //        return false;
            //    }
            //}
            //if (parseFloat(parseFloat(obj.ApprovedAmount).toFixed(2)) > 2500) {
            //    if (UserOfficeRecord.IsHeadOffice == 0 || UserOfficeRecord.IsHeadOffice == 1) {
            //        ShowMessage('warning', 'Warning -  Claim Action', "Amount greater than USD 2,500 can not be approved in Head office.", "bottom-right");
            //        return false;
            //    }
            //}

            if (parseFloat(parseFloat(obj.ApprovedAmount).toFixed(2)) > 2500) {
                if (parseInt(userContext.CitySNo) == 3992) {
                    ShowMessage('warning', 'Warning -  Claim Action', "Amount greater than USD 2500 can not be approved in Head office.", "bottom-right");
                    return false;
                }
            }
            if (parseFloat(parseFloat(obj.ApprovedAmount).toFixed(2)) > 750) {
                if (parseInt(userContext.CitySNo) != 3992) {
                    ShowMessage('warning', 'Warning -  Claim Action', "Amount greater than USD 750 can not be approved in Branch office.", "bottom-right");
                    return false;
                }
            }
        }
    }
    var flag = false;
    $.ajax({
        url: "Services/Irregularity/ClaimService.svc/SaveAction", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ obj: obj }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {

            var Data = jQuery.parseJSON(result);
            var Array = Data.Table0;
            if (Array.length > 0) {
                AuditLogSaveNewValue("divClaimEdit", true, 'CLAIMACTION', "Claim No", Array[0].ClaimNo, CurrentClaimSNo, 'Edit', userContext.TerminalSNo, userContext.NewTerminalName);

               
                if (sessionStorage.getItem("auditlog") != null) {
                    var auditLog = JSON.parse(sessionStorage.getItem("auditlog"));
                    SaveAppendGridAuditLog(auditLog.KeyColumn, auditLog.KeyValue, auditLog.keySNo, auditLog.arrVal, auditLog.FormAction, auditLog.TerminalSNo, auditLog.TerminalName)
                }
                ShowMessage('success', 'Success - Claim Action', "Claim Action Saved Successfully ", "bottom-right");
                $("#btnSave").unbind("click");
                ReloadSameGridPage();
                flag = true;
            }

            else {
                ShowMessage('warning', 'Warning -  Claim Action', "Please correct value(s) for :- " + result + ".", "bottom-right");
            }
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning -Complaint Action', " unable to process.", "bottom-right");
        }
    });
    return flag;
}

function ValidateControl(valueId, value, keyId, key) {
    if (keyId == "DocType") {
        $("#Text_DocType").attr("data-valid", "required").attr("data-valid-msg", "Select Doc Type.");
    }

    if (keyId.indexOf("EdoxProcessType") > -1) {
        $("#" + valueId).attr("data-valid", "required").attr("data-valid-msg", "Select Edox Process Type.");
        $("#" + valueId.replace("EdoxProcessType", "EdoxDocType")).attr("data-valid", "required").attr("data-valid-msg", "Select Edox Doc Type.");
    }

    if (keyId.indexOf("EdoxDocType") > -1) {
        $("#" + valueId).attr("data-valid", "required").attr("data-valid-msg", "Select Edox Process Type.");
        $("#" + valueId.replace("EdoxDocType", "EdoxProcessType")).attr("data-valid", "required").attr("data-valid-msg", "Select Edox Doc Type.");
    }
}

$(document).on("click", "#btnCancel", function () {
    ClearAll();
    CleanUI();
    ReloadSameGridPage();
});

$(document).on("keypress", "CalcClaimAmount", function (evt) {
    var self = $(this);
    self.val(self.val().replace(/[^0-9\.]/g, ''));
    if ((evt.which != 46 || self.val().indexOf('.') != -1) && (evt.which < 48 || evt.which > 57)) {
        evt.preventDefault();
    }
});

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

function BindEDox(CurrentClaimSNo) {

    $.ajax({
        //url: "Services/Irregularity/ClaimService.svc/GetEdoxAtClaimSNo?CurrentClaimSNo=" + CurrentClaimSNo, async: false, type: "get", dataType: "json", cache: false,
        url: "Services/Irregularity/ClaimService.svc/GetEdoxAtClaimSNo", async: false, type: "post", dataType: "json", cache: false,
        data: JSON.stringify({ CurrentClaimSNo: CurrentClaimSNo, UserType: 0 }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var edoxData = jQuery.parseJSON(result);
            var edoxArray = edoxData.Table0;
            $("#divareaTrans_irregularity_claimedox tr:first").find("font").remove();

            if (edoxArray.length > 0) {
                $("#DocsName").attr("data-valid", " ");
                cfi.makeTrans("irregularity_claimedox", null, null, BindEDoxDocTypeAutoComplete, ReBindEDoxDocTypeAutoComplete, null, edoxArray, null, true);
                //cfi.makeTrans("irregularity_airlineedox", null, null, BindAirlineEDoxDocTypeAutoComplete, ReBindAirlineEDoxDocTypeAutoComplete, null, EdoxArrayList1, null, true);
                $("#DocsName").attr("data-valid", " ");
            }
            else {
                cfi.makeTrans("irregularity_claimedox", null, null, BindEDoxDocTypeAutoComplete, ReBindEDoxDocTypeAutoComplete, null, edoxArray, null, true);
            }
            $("div[id$='areaTrans_irregularity_claimedox']").find("[id='areaTrans_irregularity_claimedox']").each(function () {
                $(this).find("input[id^='DocType']").each(function () {
                    //cfi.AutoComplete($(this).attr("name"), "DocumentName", "EDoxdocumenttype", "SNo", "DocumentName", null, MakeFileMandatory, "contains");
                    cfi.AutoCompleteV2($(this).attr("name"), "Name", "Claim_EDox", MakeFileMandatory, "contains");
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
        //cfi.AutoComplete($(this).attr("name"), "DocumentName", "EDoxdocumenttype", "SNo", "DocumentName", null, MakeFileMandatory, "contains");
        cfi.AutoCompleteV2($(this).attr("name"), "Name", "Claim_EDox", MakeFileMandatory, "contains");
    });

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
    $(elem).closest("div[id$='areaTrans_irregularity_claimedox']").find("[id^='areaTrans_irregularity_claimedox']").each(function () {
        $(this).find("input[id^='DocType']").each(function () {
            //var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "EDoxdocumenttype", "SNo", "DocumentName");
            var newDataSource = GetDataSourceV2("Text_" + $(this).attr("id"), "ClaimBindEDoxDoc");
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

function SaveEDoxList(CurrentClaimSNo) {
    if (cfi.IsValidTransSection('divareaTrans_irregularity_claimedox')) {
        var EDoxArray = [];
        var SPHCDoxArray = [];
        var EDoxCheckListArray = [];
        //var AllEDoxReceived = ($("[id='XRay']:checked").val() == 'on');
        var Remarks =  $("#Remarks").val();
        var edoxFlag = true;
        //var edoxChecklistFlag = true;
        var flag = true;
        $("div[id$='areaTrans_irregularity_claimedox']").find("[id^='areaTrans_irregularity_claimedox']").each(function () {
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
            $("div[id$='areaTrans_irregularity_claimedox']").find("[id^='areaTrans_irregularity_claimedox']").each(function (i, row) {
                if ($(this).find("input[id^='DocType']").val() != "" && $(this).find("a[id^='ahref_DocName']").attr("linkdata") == "") {
                    ShowMessage('warning', 'Warning - Document Info', "AWB No. [] -  Doc Type Attachment not found.", "bottom-right");
                    flag = false;
                    return false;
                }
            });
        }

        //alert(JSON.stringify(EDoxArray))
        //return false;
        if (flag == true) {
            $.ajax({
                url: "Services/Irregularity/ClaimService.svc/SaveClaimEDoxDetail", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ CurrentClaimSNo: parseInt(CurrentClaimSNo), ClaimEDoxDetail: EDoxArray, UserType: 0 }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {

                    var Data = jQuery.parseJSON(result);
                    var Array = Data.Table0;

                    if (Array.length > 0) {


                        ShowMessage('success', 'Success - e-Dox Information', "Claim EDox  -  Saved Successfully", "bottom-right");
                        AuditLogSaveNewValue("divClaimEdit", true, 'CLAIMEDOX', "Claim No", Array[0].ClaimNo, CurrentClaimSNo, 'Edit', userContext.TerminalSNo, userContext.NewTerminalName);

                        if (sessionStorage.getItem("auditlog") != null) {
                            var auditLog = JSON.parse(sessionStorage.getItem("auditlog"));
                            SaveAppendGridAuditLog(auditLog.KeyColumn, auditLog.KeyValue, auditLog.keySNo, auditLog.arrVal, auditLog.FormAction, auditLog.TerminalSNo, auditLog.TerminalName)
                        }
                        flag = true;
                    }
                    else {
                        ShowMessage('warning', 'Warning - e-Dox Information', "Claim EDox  -  unable to process.", "bottom-right");
                    }
                },
                error: function (xhr) {
                    ShowMessage('warning', 'Warning - e-Dox Information', "Claim No. [" + CurrentClaimSNo + "] -  unable to process.", "bottom-right");
                },
                complete: function (xhr) {
                    $("div[id$='areaTrans_irregularity_claimedox']").find("[id^='areaTrans_irregularity_claimedox']").each(function () {
                        $(this).find("a[id^='ahref_docname']").attr("linkdata", '');
                    });
                }
            });
        }
        return flag;
    }
}

function WrapSelectedFileName() {
    $("div[id$='areaTrans_irregularity_claimedox']").find("[id^='areaTrans_irregularity_claimedox']").each(function () {
        $(this).find("span[id^='DocName']").closest('td').css("white-space", "inherit");
        $(this).find("input[type='file'][id^='DocsName']").css('width', '');
        $(this).find("input[id^='Text_DocType']").parent('span').css('width', '120px');
    });

}

/************* EDOX END ************/


/*************Airline EDOX ************/
function MakeAirlineFileMandatory(e) {
    if ($("#" + e).data("kendoAutoComplete").key() != "") {
        $("#" + e).closest('tr').find("[id ^= 'AirlineDocsName']").attr("data-valid", "required");
    } else {
        $("#" + e).closest('tr').find("[id ^= 'AirlineDocsName']").removeAttr("data-valid");
    }
}

function RemoveAirlineFileMandatory(e) {
    if ($("#" + e).val() == "") {
        $("#" + e).closest('tr').find("[id^='AirlineDocsName']").removeAttr("data-valid");
    }
}

function AirlineBindEDox(CurrentClaimSNo) {

    $.ajax({
        //url: "Services/Irregularity/ClaimService.svc/GetEdoxAtClaimSNo?CurrentClaimSNo=" + CurrentClaimSNo, async: false, type: "get", dataType: "json", cache: false,
        url: "Services/Irregularity/ClaimService.svc/GetEdoxAtClaimSNo", async: false, type: "post", dataType: "json", cache: false,
        data: JSON.stringify({ CurrentClaimSNo: CurrentClaimSNo, UserType: 1 }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var edoxData = jQuery.parseJSON(result);
            var edoxArray = edoxData.Table0;
            $("#divareaTrans_irregularity_airlineedox tr:first").find("font").remove();
            var EdoxArrayList1 = [];
            $(edoxArray).each(function (index, obj) {
                var appObj = {};
                appObj.altairlinedocname = obj.altdocname;
                appObj.airlinedocname = obj.docname;
                appObj.airlinedoctype = obj.doctype;
                appObj.list = obj.list;
                appObj.airlinereferenceno = obj.referenceno;
                appObj.airlineremarks = obj.remarks;
                appObj.text_airlinedoctype = obj.text_doctype;
                EdoxArrayList1.push(appObj);

            })
            if (edoxArray.length > 0) {
                $("#AirlineDocsName").attr("data-valid", " ");
                cfi.makeTrans("irregularity_airlineedox", null, null, BindAirlineEDoxDocTypeAutoComplete, ReBindAirlineEDoxDocTypeAutoComplete, null, EdoxArrayList1, null, true);
                $("#AirlineDocsName").attr("data-valid", " ");
            }
            else {
                cfi.makeTrans("irregularity_airlineedox", null, null, BindAirlineEDoxDocTypeAutoComplete, ReBindAirlineEDoxDocTypeAutoComplete, null, EdoxArrayList1, null, true);
            }
            $("div[id$='areaTrans_irregularity_airlineedox']").find("[id='areaTrans_irregularity_airlineedox']").each(function () {
                $(this).find("input[id^='AirlineDocType']").each(function () {
                    cfi.AutoCompleteV2($(this).attr("name"), "Name", "Claim_EDox", MakeAirlineFileMandatory, "contains");
                });

                $(this).find("input[id^='Text_AirlineDocType']").attr('required', 'required');
                $(this).find("input[id^='Text_AirlineDocType']").attr('data-valid', 'required');
                $(this).find("input[id^='Text_AirlineDocType']").unbind("blur").bind("blur", function () {
                    RemoveAirlineFileMandatory($(this).closest('td').find("input[id^='Text_AirlineDocType']").attr("id"));
                });

                $(this).find("input[id^='AirlineDocsName']").each(function () {
                    $(this).unbind("change").bind("change", function () {
                        AirlineUploadEDoxDocument($(this).attr("id"), "AirlineDocName");
                        AirlineWrapSelectedFileName();
                    })
                });
                $(this).find("a[id^='ahref_AirlineDocName']").each(function () {
                    $(this).unbind("click").bind("click", function () {
                        AirlineDownloadEDoxDocument($(this).attr("id"), "AirlineDocName");
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

function BindAirlineEDoxDocTypeAutoComplete(elem, mainElem) {

    $(elem).find("input[id^='AirlineDocType']").each(function () {
        cfi.AutoCompleteV2($(this).attr("name"), "Name", "Claim_EDox", MakeAirlineFileMandatory, "contains");
    });
    //$(elem).find("span[type='DocName']").attr("data-valid-msg", "Attach Document");
    $(elem).find("input[id^='AirlineDocsName']").each(function () {
        $(this).unbind("change").bind("change", function () {
            AirlineUploadEDoxDocument($(this).attr("id"), "AirlineDocName");
            AirlineWrapSelectedFileName();
        })
    });
    $(elem).find("a[id^='ahref_AirlineDocName']").each(function () {
        $(this).unbind("click").bind("click", function () {
            AirlineDownloadEDoxDocument($(this).attr("id"), "AirlineDocName");
        })
    });

    AirlineWrapSelectedFileName();

}

function ReBindAirlineEDoxDocTypeAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_irregularity_airlineedox']").find("[id^='areaTrans_irregularity_airlineedox']").each(function () {
        $(this).find("input[id^='AirlineDocType']").each(function () {
            var newDataSource = GetDataSourceV2("Text_" + $(this).attr("id"), "ClaimAirlineEDoxDoc");
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false, RemoveFileMandatory);
        });
        $(this).find("input[id^='AirlineDocsName']").unbind("change").bind("change", function () {
            AirlineUploadEDoxDocument($(this).attr("id"), "AirlineDocName");
            AirlineWrapSelectedFileName();
        })
        $(this).find("a[id^='ahref_AirlineDocName']").unbind("click").bind("click", function () {
            AirlineDownloadEDoxDocument($(this).attr("id"), "AirlineDocName");
        })
    });
}

function AirlineUploadEDoxDocument(objId, nexctrlid) {
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
                $("#" + objId).closest("tr").find("span[id^='" + nexctrlid + "']").text(files[0].name);
            },
            error: function (err) {
                ShowMessage('info', 'File Upload!', "Unable to upload selected file. Please try again.", "bottom-right");
            }
        });
    }
}

function AirlineDownloadEDoxDocument(objId, nexctrlid) {
    if ($("#" + objId).attr("linkdata") != undefined && $("#" + objId).attr("linkdata") != "") {
        window.location.href = "../BLOBUploadAndDownload/DownloadFromBlob/?filenameOrUrl=" + $("#" + objId).attr("linkdata");
    }
    else {
        ShowMessage('info', 'Download!', "Invalid attempt.", "bottom-right");
    }
}

function AirlineDownloadEDoxFromDB(DocSNo, DocFlag) {
    if (parseInt(DocSNo) > 0) {
        window.location.href = "Handler/FileUploadHandler.ashx?ImportDocSNo=" + DocSNo + "&ImportDocFlag=" + DocFlag;
    }
    else {
        ShowMessage('info', 'Download!', "Invalid attempt.", "bottom-right");
    }
}

function AirlineSaveEDoxList(CurrentClaimSNo) {
    if (cfi.IsValidTransSection('divareaTrans_irregularity_airlineedox')) {
        var EDoxArray = [];
        var SPHCDoxArray = [];
        var EDoxCheckListArray = [];
        //var AllEDoxReceived = ($("[id='XRay']:checked").val() == 'on');
        var Remarks = $("#Remarks").val();
        var edoxFlag = true;
        //var edoxChecklistFlag = true;
        var flag = true;
        $("div[id$='areaTrans_irregularity_airlineedox']").find("[id^='areaTrans_irregularity_airlineedox']").each(function () {
            var eDoxViewModel = {
                EDoxdocumenttypeSNo: $(this).find("input[id^='Text_AirlineDocType']").data("kendoAutoComplete").key(),
                DocName: $(this).find("span[id^='AirlineDocName']").text(),
                AltDocName: $(this).find("a[id^='ahref_AirlineDocName']").attr("linkdata") == undefined ? "" : $(this).find("a[id^='ahref_AirlineDocName']").attr("linkdata"),
                ReferenceNo: $(this).find("input[id^='AirlineReferenceNo']").val(),
                Remarks: $(this).find("textarea[id^='AirlineDoc_Remarks']").val()
            };
            EDoxArray.push(eDoxViewModel);
        });

        for (var i = 0; i < EDoxArray.length; i++) {
            if (EDoxArray[i].EDoxdocumenttypeSNo == "")
                edoxFlag = false;
        }

        if (edoxFlag == false) {
            ShowMessage('warning', 'Warning - Document Info', " Select checklist Doc Type or Process Type.", "bottom-right");
            flag = false;
            return false;
        }

        if (edoxFlag == true) {
            $("div[id$='areaTrans_irregularity_airlineedox']").find("[id^='areaTrans_irregularity_airlineedox']").each(function (i, row) {
                if ($(this).find("input[id^='AirlineDocType']").val() != "" && $(this).find("a[id^='ahref_AirlineDocName']").attr("linkdata") == "") {
                    ShowMessage('warning', 'Warning - Document Info', "  Doc Type Attachment not found.", "bottom-right");
                    flag = false;
                    return false;
                }
            });
        }

        //alert(JSON.stringify(EDoxArray))
        //return false;
        if (flag == true) {
            $.ajax({
                url: "Services/Irregularity/ClaimService.svc/SaveClaimEDoxDetail", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ CurrentClaimSNo: parseInt(CurrentClaimSNo), ClaimEDoxDetail: EDoxArray, UserType: 1 }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {


                    var Data = jQuery.parseJSON(result);
                    var Array = Data.Table0;

                    if (Array.length > 0) {


                        ShowMessage('success', 'Success - e-Dox Information', "Claim EDox  -  Saved Successfully", "bottom-right");
                        AuditLogSaveNewValue("divClaimEdit", true, 'AIRLINEEDOX', "Claim No", Array[0].ClaimNo, CurrentClaimSNo, 'Edit', userContext.TerminalSNo, userContext.NewTerminalName);

                        if (sessionStorage.getItem("auditlog") != null) {
                            var auditLog = JSON.parse(sessionStorage.getItem("auditlog"));
                            SaveAppendGridAuditLog(auditLog.KeyColumn, auditLog.KeyValue, auditLog.keySNo, auditLog.arrVal, auditLog.FormAction, auditLog.TerminalSNo, auditLog.TerminalName)
                        }


                        flag = true;
                    }
                    else {
                        ShowMessage('warning', 'Warning - e-Dox Information', "Claim EDox  -  unable to process.", "bottom-right");
                    }
                },
                error: function (xhr) {
                    ShowMessage('warning', 'Warning - e-Dox Information', "Claim No. [" + CurrentClaimSNo + "] -  unable to process.", "bottom-right");
                },
                complete: function (xhr) {
                    $("div[id$='areaTrans_irregularity_airlineedox']").find("[id^='areaTrans_irregularity_airlineedox']").each(function () {
                        $(this).find("a[id^='ahref_AirlineDocName']").attr("linkdata", '');
                    });
                }
            });
        }
        return flag;
    }
}

function AirlineWrapSelectedFileName() {
    $("div[id$='areaTrans_irregularity_airlineedox']").find("[id^='areaTrans_irregularity_airlineedox']").each(function () {
        $(this).find("span[id^='AirlineDocName']").closest('td').css("white-space", "inherit");
        $(this).find("input[type='file'][id^='ahref_AirlineDocName']").css('width', '');
        $(this).find("input[id^='Text_AirlineDocType']").parent('span').css('width', '120px');
    });

}

/************* EDOX END ************/

/************* Print Start ************/


function OpenCCfForm(currClaimSNo) {
    
    if (userContext.SysSetting.ClientEnvironment == 'UK' || userContext.SysSetting.ClientEnvironment == 'G8')
        window.open("../Client/" + userContext.SysSetting.ClientEnvironment + "/Claim/ClaimForm.html?sno=" + currClaimSNo + "&pagename=Irregularity");
    else
        window.open("CargoClaimFormPrint.html?sno=" + currClaimSNo + "&pagename=Irregularity");
}

function OpenFinalReleaseForm(currClaimSNo) {
   
    if (userContext.SysSetting.ClientEnvironment == 'UK' || userContext.SysSetting.ClientEnvironment == 'G8')
        window.open("../Client/" + userContext.SysSetting.ClientEnvironment + "/Claim/FinalReleaseForm.html?sno=" + currClaimSNo + "&pagename=Irregularity");
    else
        window.open("FinalReleasePrint.html?sno=" + currClaimSNo + "&pagename=Irregularity");
}

//function OpenCLR_CDRForm(currClaimSNo)
//{
//    window.open("CargoClaimFormPrint.html?sno=" + currClaimSNo + "&pagename=Irregularity");
//}

function OpenSPPForm(currClaimSNo) {
    window.open("SuratFinalRelease.html?sno=" + currClaimSNo + "&pagename=Irregularity");
}

function OpenSCCForm(currClaimSNo) {

    if (userContext.SysSetting.ClientEnvironment == 'UK' || userContext.SysSetting.ClientEnvironment == 'G8')
        window.open("../Client/" + userContext.SysSetting.ClientEnvironment + "/Claim/SCCForm.html?sno=" + currClaimSNo + "&pagename=Irregularity");
    else
        window.open("SettelmentclaimPrint.html?sno=" + currClaimSNo + "&pagename=Irregularity");
}

function OpenACCFForm(currClaimSNo) {
   
    if (userContext.SysSetting.ClientEnvironment == 'UK' || userContext.SysSetting.ClientEnvironment == 'G8')
        window.open("../Client/" + userContext.SysSetting.ClientEnvironment + "/Claim/ACCFForm.html?sno=" + currClaimSNo + "&pagename=Irregularity");
    else
        window.open("AnalysisClaimCargoForm.html?sno=" + currClaimSNo + "&pagename=Irregularity");
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
//function OpenCSRForm(currClaimSNo) {
//    window.open("CarrierSurveyReportForm.html?sno=" + currClaimSNo + "&pagename=Irregularity");
//}

/************* Print END ************/
var pageType = $('#hdnPageType').val();
var fotter = "<div><table style='margin-left:20px;'>" +
    "<tbody><tr><td> &nbsp; &nbsp;</td>" +
    "<td><button class='btn btn-primary btn-sm' style='width:125px;' id='btnNew'>New Claim</button></td>" +
    "<td> &nbsp; &nbsp;</td>" +
    "<td><button class='btn btn-block btn-success btn-sm' style='display:none'  id='btnSave'>Save</button></td>" +
    "<td> &nbsp; &nbsp;</td>" +
    "<td><button class='btn btn-block btn-success btn-sm' style='display:none'  id='btnUpdate'>Update</button></td>" +
    "<td> &nbsp; &nbsp;</td>" +
    "<td><button class='btn btn-block btn-success btn-sm' style='display:none' id='btnclaimamt'>Calculate Claim Amt.</button></td>" +
    "<td> &nbsp; &nbsp;</td>" +
    "<td><button class='btn btn-block btn-danger btn-sm' style='display:none' id='btnCancel'>Cancel</button></td>" +
    "</tr></tbody></table> </div>";


//var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divClaimDetails' style='width:100%'></div></td></tr><tr><td valign='top'><div id='divNewClaim' style='width:100%;'></div></td></tr><tr><td valign='top'><div id='divClaimEdit' style='width:100%'></div></td></tr><tr><td valign='top'><table style='width:100%'><tr><td style='width:15%;' valign='top' class='tdInnerPadding'><div id='divEdoxCustomer' style='width:100%'></div></td><td style='width:15%;' valign='top' class='tdInnerPadding'><div id='divEdoxAirline' style='width:100%'></div></td></tr></table></td></tr><tr><td valign='top'><div id='divCalculateClaim' style='width:100%;'></div></td></tr><tr><td valign='top'></td></tr><tr> <td valign='top'> <table style='width:100%'> <tr> <td style='width:100%;' valign='top' class='tdInnerPadding'> <div id='tabstrip'> <ul id='ulTab' style='display:none;'> <li class='k-state-active'> Genral </li><li> SPHC Wise </li><li>Tab 3</li><li>Tab 4</li><li>Tab 5</li></ul> <div> <div id='divDetail'></div><div id='divDetail1'></div><div id='divDetail2'></div><div id='divDetail3'></div></div><div> <div id='divTab2'> </div></div><div><div id='divTab3'></div></div><div><div id='divTab4'></div></div><div><div id='divTab5'></div></div></div></div></td></tr></table> </td></tr></table></div>";

var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divClaimDetails' style='width:100%'></div></td></tr><tr><td valign='top'><div id='divNewClaim' style='width:100%;'></div></td></tr><tr><td valign='top'><div id='divClaimEdit' style='width:100%'></div></td></tr><tr><td valign='top'><table style='width:100%'><tr><td style='width:15%;' valign='top' class='tdInnerPadding'><div id='divEdoxCustomer' style='width:100%'></div></td><td style='width:15%;' valign='top' class='tdInnerPadding'><div id='divEdoxAirline' style='width:100%'></div></td></tr></table></td></tr><tr><td valign='top'><div id='divCalculateClaim' style='width:100%;'></div></td></tr><tr><td valign='top'></td></tr><tr> <td valign='top'> <table style='width:100%'> <tr> <td style='width:100%;' valign='top' class='tdInnerPadding'> <div id='tabstrip'> <ul id='ulTab' style='display:none;'> <li class='k-state-active'> Genral </li><li> SPHC Wise </li><li>Tab 3</li><li>Tab 4</li><li>Tab 5</li><li>Tab 6</li></ul> <div> <div id='divDetail'></div><div id='divDetail1'></div><div id='divDetail2'></div><div id='divDetail3'></div></div><div> <div id='divTab2'> </div></div> <div><div id='divTab3'></div></div> <div><div id='divTab4'></div></div> <div><div id='divTab5'></div></div> <div><div id='divTab6'></div></div></div></td></tr></table> </td></tr></table></div>";


// Add By Sushant 
var GetSubProcessName = '';
function UserSubProcessRightsSpecialrights() {
    var IsEdit = false;
    //get the subprocess view permission
    
    $(userContext.ProcessRights).each(function (i, e) {
        if (e.SubProcessSNo == 6000) {
            IsEdit = e.IsEdit;
            if (IsEdit) {
                GetSubProcessName += e.SubProcessName + ','
            }
            else {
                GetSubProcessName += '';
            }
            return;
        }
        if (e.SubProcessSNo == 6001) {
            IsEdit = e.IsEdit;
            if (IsEdit) {
                GetSubProcessName += e.SubProcessName + ','
            }
            else {
                GetSubProcessName += '';
            }

            return;
        }
        if (e.SubProcessSNo == 6002) {
            IsEdit = e.IsEdit;
            if (IsEdit) {
                GetSubProcessName += e.SubProcessName + ','
            }
            else {
                GetSubProcessName += '';
            }
            return;
        }
        if (e.SubProcessSNo == 6003) {
            IsEdit = e.IsEdit;
            if (IsEdit) {
                GetSubProcessName += e.SubProcessName + ','
            }
            else {
                GetSubProcessName += '';
            }
            return;
        }
        if (e.SubProcessSNo == 6004) {
            IsEdit = e.IsEdit;
            if (IsEdit) {
                GetSubProcessName += e.SubProcessName + ','
            }
            else {
                GetSubProcessName += '';
            }
            return;
        }
        if (e.SubProcessSNo == 6005) {
            IsEdit = e.IsEdit;
            if (IsEdit) {
                GetSubProcessName += e.SubProcessName + ','
            }
            else {
                GetSubProcessName += '';
            }
            return;
        }
        if (e.SubProcessSNo == 6006) {
            IsEdit = e.IsEdit;
            if (IsEdit) {
                GetSubProcessName += e.SubProcessName + ','
            }
            else {
                GetSubProcessName += '';
            }
            return;
        }

    });
    //if view permission is true
}


