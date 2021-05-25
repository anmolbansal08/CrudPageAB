var ClaimDataSource = [{ Key: "1", Text: "YES" }, { Key: "0", Text: "NO" }];

$(function () {
    $("#btnSave").hide();
    $(document).ready(function () {
        var url = window.location.href;
        //alert(url);
        //alert(url.split("CurrentComplaintSNo=")[1]);
        if(url.split("CurrentComplaintSNo=")[1]==undefined)
        {
            MasterDeliveryOrder(0);
        }
        else {
            MasterDeliveryOrder(url.split("CurrentComplaintSNo=")[1]);
        }
    });
});

function MasterDeliveryOrder(CurrentComplaintNo) {
    _CURR_PRO_ = "CLAIM";
    _CURR_OP_ = "CLAIM";
    $("#licurrentop").html(_CURR_OP_);
    $("#divSearch").html("");
    $("#divClaim").html("");

    CleanUI();
    $.ajax({
        url: "Services/Irregularity/ClaimService.svc/GetWebForm/" + _CURR_PRO_ + "/Irregularity/Claim/Search/1/0", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContent);
            $("#divFooter").html(fotter).show();
            cfi.AutoCompleteByDataSource("SearchClaim", ClaimDataSource);
            cfi.AutoComplete("searchClaimStatus", "Name", "v_ClaimStatus", "SNo", "Name", ["Name"], null, "contains");
            cfi.AutoComplete("searchAWBNo", "AWBNo", "v_ComplaintAirwaybillNo", "AWBNo", "AWBNo", ["AWBNo"], null, "contains");
            cfi.AutoComplete("searchClaimNo", "ClaimNumber", "Claim", "ClaimNumber", "ClaimNumber", ["ClaimNumber"], null, "contains");
            $('#searchFromDate').data("kendoDatePicker").value("");
            $('#searchToDate').data("kendoDatePicker").value("");

            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });

            $("#btnSearch").bind("click", function () {
                CleanUI();
                ClearAll();
                ClaimGridSearch();
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

            if (CurrentComplaintNo != 0)
            {
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
                            InitializePage("ClaimNew", "divNewClaim");
                        }
                    }
                });
            }
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
    var LoggedInCity = userContext.CityCode;
    var searchFromDate = "0";
    var searchToDate = "0";
    if ($("#searchFromDate").val() != "") {
        searchFromDate = cfi.CfiDate("searchFromDate") == "" ? "0" : cfi.CfiDate("searchFromDate");// "";//month + "-" + day + "-" + year;
    }

    if ($("#searchToDate").val() != "") {
        searchToDate = cfi.CfiDate("searchToDate") == "" ? "0" : cfi.CfiDate("searchToDate");// "";//month + "-" + day + "-" + year;
    }

    if (_CURR_PRO_ == "CLAIM") {
        cfi.ShowIndexView("divClaimDetails", "Services/Irregularity/ClaimService.svc/GetGridData/" + _CURR_PRO_ + "/Irregularity/Claim/" + searchClaimNo.trim() + "/" + searchClaimStatus.trim() + "/" + searchAWBNo.trim() + "/" + searchFromDate.trim() + "/" + searchToDate.trim() + "/" + LoggedInCity.trim() + "/0");
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
}

function ReloadSameGridPage() {
    var gridPage = $(".k-pager-input").find("input").val();
    var grid = $(".k-grid").data("kendoGrid");
    grid.dataSource.page(gridPage);
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
    awbNoIndex = trLocked.find("th[data-field='MAWBNo']").index();

    CurrentAWBNo = closestTr.find("td:eq(" + awbNoIndex + ")").text();
    CurrentClaimSNo = closestTr.find("td:eq(" + ClaimSNoIndex + ")").text();

    $("#tdAWBNo").text(closestTr.find("td:eq(" + awbNoIndex + ")").text());
    ShowProcessDetails(subprocess, isdblclick, CurrentClaimSNo);

}

function ShowProcessDetails(subprocess, isdblclick, CurrentClaimSNo) {
    $("#ulTab").hide();
    CleanUI();
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
        $('#tabstrip ul:first li:eq(0)').css("background-color", "green");
        $('#tabstrip ul:first li:eq(1)').css("background-color", "");
        $('#tabstrip ul:first li:eq(2)').css("background-color", "");
        $('#tabstrip ul:first li:eq(3)').css("background-color", "");
        $('#tabstrip ul:first li:eq(4)').css("background-color", "");
        $('#tabstrip ul:first li:eq(0) a').show();
        $('#tabstrip ul:first li:eq(1) a').show();
        $('#tabstrip ul:first li:eq(2) a').show();
        $('#tabstrip ul:first li:eq(3) a').show();
        $('#tabstrip ul:first li:eq(4) a').show();
        ShowProcessDetailsNew("CLAIMVIEW", "divDetail", isdblclick, subprocesssno, CurrentClaimSNo);
        $('#tabstrip ul:first li:eq(0) a').unbind("click").bind("click", function () {
            $('#tabstrip ul:first li:eq(0)').css("background-color", "green");
            $('#tabstrip ul:first li:eq(1)').css("background-color", "");
            $('#tabstrip ul:first li:eq(2)').css("background-color", "");
            $('#tabstrip ul:first li:eq(3)').css("background-color", "");
            $('#tabstrip ul:first li:eq(4)').css("background-color", "");
            $("#ulTab").show();
            ShowProcessDetailsNew("CLAIMVIEW", "divDetail", isdblclick, subprocesssno, CurrentClaimSNo);
        });
        $('#tabstrip ul:first li:eq(1) a').unbind("click").bind("click", function () {
            $('#tabstrip ul:first li:eq(0)').css("background-color", "");
            $('#tabstrip ul:first li:eq(1)').css("background-color", "green");
            $('#tabstrip ul:first li:eq(2)').css("background-color", "");
            $('#tabstrip ul:first li:eq(3)').css("background-color", "");
            $('#tabstrip ul:first li:eq(4)').css("background-color", "");
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
            //ClearAll();
            $("#ulTab").show();
            ShowProcessDetailsNew("IRREGULARITY", "divDetail", isdblclick, subprocesssno, CurrentClaimSNo);
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
        $.ajax({
            url: "Services/Irregularity/ClaimService.svc/GetWebForm/Claim/Irregularity/" + subprocess + "/New/1/" + CurrentClaimSNo + "", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {

                if (result != undefined || result != "") {
                    $("#divClaimEdit").html(result);
                    InitializePage(subprocess, divID, isdblclick, subprocesssno, CurrentClaimSNo);
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
                    //GetProcessSequence("Irregularity");
                    $("#divClaimEdit").html(result);
                    InitializePage(subprocess, divID, isdblclick, subprocesssno, CurrentClaimSNo);
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
                debugger;
                var theDiv = document.getElementById("divTab2");
                theDiv.innerHTML = "";
                var table = "<table class='appendGrid ui-widget' id='tblIrregularityHistory'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>Claim Action</td><td class='ui-widget-header'>Action Date</td><td class='ui-widget-header'>Description</td><td class='ui-widget-header'>EmailID</td><td class='ui-widget-header'> Status</td><td class='ui-widget-header'>ClaimAmount</td></tr></thead><tbody class='ui-widget-content'>";
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0.length > 0) {
                        for (var i = 0; i < myData.Table0.length; i++) {
                            table += "<tr><td class='ui-widget-content first'>" + myData.Table0[i].ClaimActionName + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ActionDate + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ActionDescription + "</td><td class='ui-widget-content first'>" + myData.Table0[i].EmailID + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ClaimStatus + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ClaimAmount + "</td></tr>";
                        }
                        table += "</tbody></table>";
                        theDiv.innerHTML += table;
                    }
                    else {
                        var table = "<table class='appendGrid ui-widget' id='tblActionHistory'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>No Record Found</td></tr></thead></table";
                        theDiv.innerHTML += table;
                    }
                    InitializePage(subprocess, divID, isdblclick, subprocesssno, CurrentClaimSNo);
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
                    InitializePage(subprocess, divID, isdblclick, subprocesssno, CurrentClaimSNo);
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
                    InitializePage(subprocess, divID, isdblclick, subprocesssno, CurrentClaimSNo);
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

                AuditLogSaveNewValue("divbody");
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

function InitializePage(subprocess, cntrlid, isdblclick, subprocesssno, CurrentClaimSNo) {

    InstantiateControl(cntrlid);
    $('#divDetail3').html("");
    $('#divDetail').show();
    $("#btnChargeNote").hide();
    $("#btnUpdate").hide();
    $("#btnSave").show();
    $("#btnNew").hide();

    var UOM = [{ Key: "0", Text: "Kg" }, { Key: "1", Text: "Lbs" }];
    $('.formfourlabel').css('border-top', '1px solid rgb(190, 189, 190)');
    $('.formfourInputcolumn').css('border-top', '1px solid rgb(190, 189, 190)');
    if (subprocess.toUpperCase() == "CLAIMNEW") {
        cfi.AutoComplete("CitySNo", "CityCode,CityName", "vCity", "SNo", "CityCode", ["CityCode", "CityName"]);
        cfi.AutoComplete("ClaimSourceSNo", "Name", "v_ClaimSource", "SNo", "Code", ["Name"]);
        cfi.AutoComplete("ClaimStatusSNo", "Name", "v_ClaimStatus", "SNo", "Code", ["Name"]);
        cfi.AutoComplete("ClaimTypeSNo", "Name", "v_ClaimType", "SNo", "Code", [ "Name"]);
        cfi.AutoComplete("Currency", "CurrencyCode,CurrencyName", "vwCurrency", "SNo", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
        cfi.AutoComplete("AWBNo", "AWBNo", "v_ComplaintAirwaybillNo", "AWBNo", "AWBNo", ["AWBNo"]);
        cfi.AutoCompleteByDataSource("WeightType", UOM, null, null);
        $('#WeightType').next('.k-widget').css('width', '60');
        $("input[id='RaisedDate']").parent('span').after('<span class="" id="RaisedDate" controltype="datetype"></span>');
        $("input[id='RaisedDate']").parent('span').hide();
        $("span[id='RaisedDate']").html(($("input[id='RaisedDate']").attr("formattedvalue")));
        $("#Text_ComplaintIrregularityList").hide();
        $("#btnCancel").show();
        $("#btnSave").show();
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
    if (subprocess.toUpperCase() == "CLAIMEDIT") {
        cfi.AutoComplete("CitySNo", "CityCode,CityName", "vCity", "SNo", "CityCode", ["CityCode", "CityName"]);
        cfi.AutoComplete("ClaimSourceSNo", "Name", "v_ClaimSource", "SNo", "Code", ["Name"]);
        cfi.AutoComplete("ClaimStatusSNo", "Name", "v_ClaimStatus", "SNo", "Code", ["Name"]);
        cfi.AutoComplete("ClaimTypeSNo", "Name", "v_ClaimType", "SNo", "Code", ["Name"]);
        cfi.AutoComplete("Currency", "CurrencyCode,CurrencyName", "vwCurrency", "SNo", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
        cfi.AutoComplete("AWBNo", "AWBNo", "v_ComplaintAirwaybillNo", "AWBNo", "AWBNo", ["AWBNo"]);
        cfi.AutoCompleteByDataSource("WeightType", UOM, null, null);
        //$('.formfourInputcolumn').css('border', 'none');
        $('#WeightType').next('.k-widget').css('width', '60');
        $("input[id='RaisedDate']").parent('span').after('<span class="" id="RaisedDate" controltype="datetype"></span>');
        $("input[id='RaisedDate']").parent('span').hide();
        $("span[id='RaisedDate']").html(($("input[id='RaisedDate']").attr("formattedvalue")));
      
        //$('#__tblclaimedit__ tr:last').hide();
        //$('#__tblclaimedit__ tr:first td:first').html("Edit Claim No. :-<span>" + $("#ClaimNo").val() + "</span>");
        $("#btnCancel").show();
        $("#btnSave").hide();
        $("#btnUpdate").show();
        $("#btnUpdate").unbind("click").bind("click", function () {
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
        cfi.AutoComplete("ClaimActionStatusSNo", "Name", "v_ClaimStatus", "SNo", "Code", ["Name"]);
        cfi.AutoComplete("ClaimActionSNo", "Name", "v_ClaimAction", "SNo", "Code", ["Name"]);
        $("input[id='ActionDate']").parent('span').hide();
        $("span[id='ActionDate']").html(($("input[id='ActionDate']").attr("formattedvalue")));
        $("input[id='EmailId']").hide();
        $("input[id='EmailId']").closest('tr').find('td:eq(4)').html("");
        $('#btnclaimamt').show();
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
        cfi.AutoComplete("UserID", "Name", "v_ClaimUser", "SNo", "Name", ["Name"]);
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
        $("#btnSave").show();
        $("#btnUpdate").hide();
        BindEDox(CurrentClaimSNo);
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
        $("#Pcs").attr("readonly", true);
        $("#ClaimAmount").attr("readonly", true);
        $("input[id='RaisedDate']").parent('span').after('<span class="" id="RaisedDate" controltype="datetype"></span>');
        $("input[id='RaisedDate']").parent('span').hide();
        $("span[id='RaisedDate']").html(($("input[id='RaisedDate']").attr("formattedvalue")));

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
    }
    if (subprocess.toUpperCase() == "CALCULATECLAIM") {
        $('#btnclaimamt').hide();
        $('#btnclaimamt').unbind();
        $("#divCalculateClaim").show();
        //alert(CurrentClaimSNo)
        
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
    return issave;
}

function SaveNewClaim() {
    debugger;
    var obj = {};
    obj.ClaimSourceSNo = $("#ClaimSourceSNo").val();
    obj.RaisedDate = $("#RaisedDate").attr("sqldatevalue");
    obj.AWBNo = $("#AWBNo").val();
    obj.HAWB = $("#HAWB").val();
    obj.ClaimTypeSNo = $("#ClaimTypeSNo").val();
    obj.ContactNo = $("#ContactNo").val();
    obj.Remarks = $("#Remarks").val();
    obj.EmailId = $("#EmailId").val();
    obj.CitySNo = $("#CitySNo").val();
    obj.ClaimStatusSNo = $("#ClaimStatusSNo").val();
    obj.Pcs = $("#Pcs").val();
    obj.Weight = $("#Weight").val();
    obj.ClaimAmount = $("#ClaimAmount").val();
    obj.WeightType = $("#WeightType").val();
    obj.Currency = $("#Currency").val();
    obj.Text_Currency = $("#Text_Currency").val();
    if (obj.Pcs == "0"||obj.Weight=="0")
    {
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
            //var myData = jQuery.parseJSON(result);
            //if (myData.Table0[0].ErrorNumber == "0") {
            if(result=="0"){
                ShowMessage('success', 'Success - New Claim', "Claim No. generated Successfully ", "bottom-right");
                $("#btnSave").unbind("click");
                ReloadSameGridPage();
                flag = true;
            }
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
    obj.HAWB = $("#HAWB").val();
    obj.ClaimTypeSNo = $("#ClaimTypeSNo").val();
    obj.ContactNo = $("#ContactNo").val();
    obj.Remarks = $("#Remarks").val();
    obj.EmailId = $("#EmailId").val();
    obj.CitySNo = $("#CitySNo").val();
    obj.ClaimStatusSNo = $("#ClaimStatusSNo").val();
    obj.Pcs = $("#Pcs").val();
    obj.Weight = $("#Weight").val();
    obj.ClaimAmount = $("#ClaimAmount").val();
    obj.WeightType = $("#WeightType").val();
    obj.ClaimSNo = CurrentClaimSNo;
    obj.Currency = $("#Currency").val();
    obj.Text_Currency = $("#Text_Currency").val();
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


    var flag = false;
    $.ajax({
        url: "Services/Irregularity/ClaimService.svc/UpdateClaim", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ obj: obj }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "0") {
                ShowMessage('success', 'Success - Update Claim', "Claim Updated Successfully ", "bottom-right");
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
    obj.AssignDate = $("#AssignDate").attr("sqldatevalue");
    obj.AssignMessage = $("#AssignMessage").val();

    var flag = false;
    $.ajax({
        url: "Services/Irregularity/ClaimService.svc/SaveAssign", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ obj: obj }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "0") {
                ShowMessage('success', 'Success - Claim Assign', "Claim Assign  Successfully ", "bottom-right");
                $("#btnSave").unbind("click");
                ReloadSameGridPage();
                flag = true;
            }
            else
                ShowMessage('warning', 'Warning -  Claim Assign', "Please correct value(s) for :- " + result + ".", "bottom-right");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning -Claim Assign', " unable to process.", "bottom-right");
        }
    });
    return flag;
}

function SaveAction(CurrentClaimSNo)
{
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
    obj.EmailId = $("#EmailId").val();
    obj.ClaimAmount = $("#CalcClaimAmount").val();
    var flag = false;
    $.ajax({
        url: "Services/Irregularity/ClaimService.svc/SaveAction", async: false, type: "POST", dataType: "json", cache: false,
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

$(document).on("keypress", "#AWBNo", function (e) {
    var a = [];
    var k = e.which;

    for (i = 48; i < 58; i++)
        a.push(i);

    a.push(45);
    if (!(a.indexOf(k) >= 0))
        e.preventDefault();

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
        url: "Services/Irregularity/ClaimService.svc/GetEdoxAtClaimSNo?CurrentClaimSNo=" + CurrentClaimSNo, async: false, type: "get", dataType: "json", cache: false,
        data: JSON.stringify({ CurrentClaimSNo: CurrentClaimSNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var edoxData = jQuery.parseJSON(result);
            var edoxArray = edoxData.Table0;
            $("#divareaTrans_irregularity_claimedox tr:first").find("font").remove();

            if (edoxArray.length > 0) {
                $("#DocsName").attr("data-valid", " ");
                cfi.makeTrans("irregularity_claimedox", null, null, BindEDoxDocTypeAutoComplete, ReBindEDoxDocTypeAutoComplete, null, edoxArray, null, true);
                $("#DocsName").attr("data-valid", " ");
            }
            else {
                cfi.makeTrans("irregularity_claimedox", null, null, BindEDoxDocTypeAutoComplete, ReBindEDoxDocTypeAutoComplete, null, edoxArray, null, false);
            }
            $("div[id$='areaTrans_irregularity_claimedox']").find("[id='areaTrans_irregularity_claimedox']").each(function () {
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
    $(elem).closest("div[id$='areaTrans_irregularity_claimedox']").find("[id^='areaTrans_irregularity_claimedox']").each(function () {
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

function SaveEDoxList(CurrentClaimSNo) {
    if (cfi.IsValidTransSection('divareaTrans_irregularity_claimedox')) {
        var EDoxArray = [];
        var SPHCDoxArray = [];
        var EDoxCheckListArray = [];
        //var AllEDoxReceived = ($("[id='XRay']:checked").val() == 'on');
        var Remarks = $("#Remarks").val();
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
                data: JSON.stringify({ CurrentClaimSNo: parseInt(CurrentClaimSNo), ClaimEDoxDetail: EDoxArray }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result == "0") {
                        ShowMessage('success', 'Success - e-Dox Information', "Claim EDox  -  Saved Successfully", "bottom-right");
                        flag = true;
                    }
                    else
                        ShowMessage('warning', 'Warning - e-Dox Information', "Claim EDox  -  unable to process.", "bottom-right");
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
                            //"<td><button class='btn btn-block btn-success btn-sm' style='display:none'  id='btnChargeNote'>Charge Note</button></td>" +
                            //"<td> &nbsp; &nbsp;</td>" +
                            // "<td><button class='btn btn-block btn-success btn-sm' style='display:none'  id='btnPrintDLV'>Print DLV Slip</button></td>" +
                            //"<td> &nbsp; &nbsp;</td>" +
                            // "<td><button class='btn btn-block btn-success btn-sm' style='display:none'  id='btnPrint'>Print</button></td>" +
                            //"<td> &nbsp; &nbsp;</td>" +
                        "</tr></tbody></table> </div>";


var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divClaimDetails' style='width:100%'></div></td></tr><tr><td valign='top'><div id='divNewClaim' style='width:100%;'></div></td></tr><tr><td valign='top'><div id='divClaimEdit' style='width:100%'></div></td></tr><tr><td valign='top'><div id='divCalculateClaim' style='width:100%;'></div></td></tr><tr> <td valign='top'> <table style='width:100%'> <tr> <td style='width:100%;' valign='top' class='tdInnerPadding'> <div id='tabstrip'> <ul id='ulTab' style='display:none;'> <li class='k-state-active'> Genral </li><li> SPHC Wise </li><li>Tab 3</li><li>Tab 4</li><li>Tab 5</li></ul> <div> <div id='divDetail'></div><div id='divDetail1'></div><div id='divDetail2'></div><div id='divDetail3'></div></div><div> <div id='divTab2'> </div></div><div><div id='divTab3'></div></div><div><div id='divTab4'></div></div><div><div id='divTab5'></div></div></div></div></td></tr></table> </td></tr></table></div>";






