//var divContent = "<div class='rows'><div id='divAirMailDetails' style='width:100%'></div><br><div id='divManifestForm' style='width:100%'></div><div id='divDetail' style='width:100%'></div></div>";

//<li onclick='GetLyingList();'> Lying List </li>

var lylistSearch = "<table><tr><td>CN38 No</td><td><input type='text' id='txtSearchCN38'/></td><td><button class='btn btn-block btn-primary' style='margin-top:0px;' id='btnSearchCN38'>Search</button></td></tr></table>";

var divContent = "<div class='rows'><div id='divAirMailDetails' style='width:100%'></div><br><div id='divManifestForm' style='width:100%'></div><div id='tabstrip'><div id='ApplicationTabs'> <ul id='ulTab'> <li class='k-state-active'> Pre-Manifest </li><li onclick='SearchLyingList();'> Lying List </li></ul> <div> <div id='divDetail'></div></div><div><div id='divLyingListSearchSection' style='width:98%;vertical-align:top;'><table><tr><td>CN38 No</td><td><input type='text' id='txtSearchCN38'/></td><td><button class='btn btn-block btn-primary' style='margin-top:0px;' onclick='GetLyingList();' id='btnSearchCN38'>Search</button></td></tr></table></div><div id='divLyingList'></div></div></div></div></div>";


var fotter = "<div><table style='margin-left:20px;'>" +
                        "<tbody><tr><td> &nbsp; &nbsp;</td>" +                           
                            "<td><button class='btn btn-block btn-success btn-sm'  id='btnSave'>Save</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +                           
                            "<td><button class='btn btn-block btn-danger btn-sm' id='btnCancel'>Cancel</button></td>" +
                        "</tr></tbody></table> </div>";
var subprocess, subprocesssno;
var CurrentFlightSno = 0;
var PoMailPreManifest = [];
var PoMailPreManifestTrans = [];
var GroupFlightSNo = "";
var CurrentFlightSNo = "";

$(function () {
    AirMailList();
});

function AirMailList() {
    _CURR_PRO_ = "AIRMAILMANIFEST";
    _CURR_OP_ = "AIR MAIL";
    var module = "Mail";
    $("#licurrentop").html(_CURR_OP_);
    $("#divSearch").html("");
    $("#divAirMailDetails").html("");
       
    CleanUI();
    $.ajax({
        url: "Services/Mail/AirMailManifestService.svc/GetWebForm/" + _CURR_PRO_ + "/" + module + "/AirMailManifestSearch/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContent);
            $("#divFooter").html(fotter).hide();
            $('#divFooter').css('padding-bottom', '20px');
            $("#ApplicationTabs").hide();
            $("#ulTab").hide();
            $("#divManifestForm").hide();
            $('#divLyingListSearchSection').hide();
            //cfi.AutoComplete("searchOrigin", "SNo,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
            cfi.AutoComplete("searchOrigin", "CityCode,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
            cfi.AutoComplete("searchDestination", "CityCode,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
            cfi.AutoComplete("searchFlightNo", "FlightNo", "vPoMailFlightSearch", "FlightNo", "FlightNo", null, null, "contains");
            //cfi.AutoComplete("searchOffPoint", "MailCategoryCode,MailCategoryName", "MailCategory", "SNo", "MailCategoryName", ["MailCategoryCode", "MailCategoryName"], null, "contains");

            $('#searchFlightDate').data("kendoDatePicker").value("");
            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });
            $("#btnSearch").bind("click", function () {
                CleanUI();
                AirMailSearch();
            });
            $("#btnCancel").unbind("click").bind("click", function () {
                $('#divDetail').html("");
                $("#divManifestForm").html("");
                $("#divFooter").hide();
                $('#tabstrip').hide();
            });
            $("#btnSave").unbind("click").bind("click", function () {
                SaveManifest();
            });
        }, error: function (r) {
            alert(r);
        }
    });
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
}

function InstantiateControl(cntrlId)
{

}

function AirMailSearch() {

    $("#ApplicationTabs").hide();
    $("#ulTab").hide();
    $("#divManifestForm").hide();
    $('#divLyingListSearchSection').hide();

    var FlightNo = $("#Text_searchFlightNo").data("kendoAutoComplete").key() == "" ? "A~A" : $("#Text_searchFlightNo").data("kendoAutoComplete").key();
    var FlightDate = $("#searchFlightDate").val() == "Flight Date" ? "2099-01-01" : $("#searchFlightDate").val();
    var Origin = $("#Text_searchOrigin").data("kendoAutoComplete").key() == "" ? "A~A" : $("#Text_searchOrigin").data("kendoAutoComplete").value().split('-')[0];
    var Destination = $("#Text_searchDestination").data("kendoAutoComplete").key() == "" ? "A~A" : $("#Text_searchDestination").data("kendoAutoComplete").value().split('-')[0];
    var OffPoint = "A~A";// $("#Text_searchMailCategory").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_searchMailCategory").data("kendoAutoComplete").key();
    var FlightStatus = "A~A";// $("#Text_searchMailHCCode").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_searchMailHCCode").data("kendoAutoComplete").key();
    var GroupFlightSNo = "A~A";
    $("#imgprocessing").show();
    if (_CURR_PRO_ == "AIRMAILMANIFEST") {
       
        cfi.ShowIndexView("divAirMailDetails", "Services/Mail/AirMailManifestService.svc/GetAirMailGridData/" + _CURR_PRO_ + "/Mail/SearchMail/" + FlightNo.trim() + "/" + FlightDate + "/" + Origin + "/" + Destination + "/" + OffPoint + "/" + FlightStatus + "/" + GroupFlightSNo, "Scripts/maketrans.js?" + Math.random());
    }
    $("#imgprocessing").hide();
}

function CleanUI() {

    $("#divXRAY").hide();
    $("#tblairmailpayment").hide();
    $("#divDetail").html("");
    $("#divDetail").html("");
    $("#tblairmailpayment").hide();
    $("#divNewAirMail").html("");
    $("#ulTab").hide();
}

function BindEvents(input, e) {
    subprocess = $(input).attr("process").toUpperCase();
    subprocesssno = $(input).attr("subprocesssno").toUpperCase();
    var CurrentValue = $(input).val();
    var trRow = $(input).closest("div.k-grid").find("div.k-grid-header");
    GroupFlightSNo = $(input).closest('tr').find("td:eq(" + 0 + ")").text();
    CurrentFlightSNo = GroupFlightSNo;
    if (CurrentValue == 'PRE') {
        var FlightNo = "A~A";
        var FlightDate = "A~A";
        var Origin = "A~A";
        var Destination = "A~A";
        var OffPoint = "A~A";
        var FlightStatus = "A~A";
        $("#ApplicationTabs").kendoTabStrip();
        $("#ApplicationTabs").show();
        $("#ulTab").show();
        $('#tabstrip').show();
        $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").select($("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").tabGroup.children("li").eq(0));
        GetManifestForm(GroupFlightSNo);
        MyIndexView("divDetail", "Services/Mail/AirMailManifestService.svc/GetAirMailGridData/" + _CURR_PRO_ + "/Mail/SearchRecord/" + FlightNo.trim() + "/" + FlightDate + "/" + Origin + "/" + Destination + "/" + OffPoint + "/" + FlightStatus + "/" + GroupFlightSNo, "Scripts/maketrans.js?" + Math.random());
        $('#divDetail').css("margin-bottom", "50px");
        $('#divLyingList').html('');
    }
    
}

function SearchLyingList()
{
    $('#divLyingListSearchSection').show();
    //$('#divLyingList').html('');
    
}

function GetLyingList()
{
    
    var FlightNo = "A~A";
        var FlightDate = "A~A";
        var Origin = "A~A";
        var Destination = "A~A";
        var OffPoint = "A~A";
        var FlightStatus = "A~A";

        MyIndexView("divLyingList", "Services/Mail/AirMailManifestService.svc/GetAirMailGridData/" + _CURR_PRO_ + "/Mail/SearchLyingList/" + FlightNo.trim() + "/" + FlightDate + "/" + Origin + "/" + Destination + "/" + OffPoint + "/" + FlightStatus + "/" + GroupFlightSNo, "Scripts/maketrans.js?" + Math.random());

        $('.formActiontitle.Background').closest('tr').hide();

        $('#divLyingList').css("margin-bottom","50px");
   
}

function MyIndexView(divId, serviceUrl, jscriptUrl)
{
    $.ajax({
        url: serviceUrl, async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#" + divId).html(result);
            $("#divFooter").show();
        },
        error: function (jqXHR, textStatus) {
        }
    });
}

function GetManifestForm(GroupFlightSNo) {
    $.ajax({
        url: "Services/Mail/AirMailManifestService.svc/GetWebForm/AIRMAILMANIFEST/Mail/AirMailManifestForm/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divManifestForm").show();
            $("#divManifestForm").html('');
            $("#divManifestForm").html(result);

            $.ajax({
                url: "Services/Mail/AirMailManifestService.svc/GetManifestDetails?GroupFlightSNo=" + GroupFlightSNo, async: false, type: "get", dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var data = jQuery.parseJSON(result);
                    var flightdata = data.Table0;                    
                    if (flightdata.length > 0) {
                        $('#DutyOfficer').val(flightdata[0].DutyOfficer);
                        $('#PlannedBy').val(flightdata[0].PlannedBy);
                    }
                }
            });

        }
    }
     );
}

function ParentSuccessGrid()
{
    $('Table.WebFormTable2 tr:first').hide();

    $("#divDetail").find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
        var controlId = $(this).attr("id");
        cfi.AutoComplete(controlId.replace("Text_", ""), "UldStockSNo", "v_PoMailULD", "UldStockSNo", "ULDNo", null, null, "contains");
    });

    $("#divDetail").find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
        var controlId = $(this).attr("id");
        var value = $("#" + controlId.replace("Text_", "")).val();
        var TextField= $("#" + controlId).val();

        $("#" + controlId).data("kendoAutoComplete").setDefaultValue(value, TextField);

    });
}

function ChildSuccessGrid() {
    
    var vgrid = cfi.GetCFGrid("divDetail");
    var childID = "div__" + vgrid.options.parentValue.toString();

    $("#" + childID).find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
        var controlId = $(this).attr("id");
        cfi.AutoComplete(controlId.replace("Text_", ""), "UldStockSNo", "v_PoMailULD", "UldStockSNo", "ULDNo", null, null, "contains");
    });

    $("#" + childID).find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
        var controlId = $(this).attr("id");
        var value = $("#" + controlId.replace("Text_", "")).val();
        var TextField = $("#" + controlId).val();

        $("#" + controlId).data("kendoAutoComplete").setDefaultValue(value, TextField);
    });
}

function SaveManifest()
{
    PoMailPreManifest = [];
    PoMailPreManifestTrans = [];

    /*******************Pre-Manifest**************************************/
    var AllCN35TR = $("#divDetail").find("tr.k-master-row");//$('div .k-master-row').closest("tr");

    $(AllCN35TR).each(function (index, item) {
        var _IsChecked = $(this).find('input[type="checkbox"]').is(':checked');
        var _ULDStockSNo = $(this).find('input[type="hidden"][id^="ULDNo_"]').val();
        var _PoMailSNo = $(this).find("td[data-column='SNo']").text();
        PoMailPreManifest.push({
            IsChecked: _IsChecked,
            ULDStockSNo: _ULDStockSNo == "" ? -1 : _ULDStockSNo,
            PoMailSNo: _PoMailSNo,
            IsOffloaded:"No"
        });
    });

    var AllDNTR = $('div[id="divDetail"]').find('div[id^="div__"]').find(".k-grid-content").find("tr"); //$('div[id^="div__"]').find(".k-grid-content").find("tr");
    $(AllDNTR).each(function (index, item) {
        var _IsChecked = $(this).find('input[type="checkbox"]').is(':checked');
        var _ULDStockSNo = $(this).find('input[type="hidden"][id^="DNULDNo_"]').val();
        var _DNSNo = $(this).find("td[data-column='TransSNo']").text();
        var _PoMailSNo = $(this).find("td[data-column='SNo']").text();
        PoMailPreManifestTrans.push({
            IsChecked: _IsChecked,
            ULDStockSNo: _ULDStockSNo == "" ? -1 : _ULDStockSNo,
            DNSNo: _DNSNo,
            PoMailSNo: _PoMailSNo,
            IsOffloaded: "No"
        });
    });

    /*******************Lying List****************************/
    
    var AllCN35TR_LyingList = $("#divLyingList").find("tr.k-master-row");

    $(AllCN35TR_LyingList).each(function (index, item) {
        var _IsChecked = $(this).find('input[type="checkbox"]').is(':checked');
        var _ULDStockSNo = $(this).find('input[type="hidden"][id^="ULDNo_"]').val();
        var _PoMailSNo = $(this).find("td[data-column='SNo']").text();
        PoMailPreManifest.push({
            IsChecked: _IsChecked,
            ULDStockSNo: _ULDStockSNo == "" ? -1 : _ULDStockSNo,
            PoMailSNo: _PoMailSNo,
            IsOffloaded: "Yes"
        });
    });

    var AllDNTR_LyingList = $('div[id="divLyingList"]').find('div[id^="div__"]').find(".k-grid-content").find("tr"); //$('div[id^="div__"]').find(".k-grid-content").find("tr");
    $(AllDNTR_LyingList).each(function (index, item) {
        var _IsChecked = $(this).find('input[type="checkbox"]').is(':checked');
        var _ULDStockSNo = $(this).find('input[type="hidden"][id^="DNULDNo_"]').val();
        var _DNSNo = $(this).find("td[data-column='TransSNo']").text();
        var _PoMailSNo = $(this).find("td[data-column='SNo']").text();
        PoMailPreManifestTrans.push({
            IsChecked: _IsChecked,
            ULDStockSNo: _ULDStockSNo == "" ? -1 : _ULDStockSNo,
            DNSNo: _DNSNo,
            PoMailSNo: _PoMailSNo,
            IsOffloaded: "Yes"
        });
    });

    /*********************************************************/
    var _DutyOfficer = $('#DutyOfficer').val();
    var _PlannedBy = $('#PlannedBy').val();
    var _UpdatedBy = userContext.UserSNo;
    var _GroupFlightSNo = GroupFlightSNo;
    
    $.ajax({
        url: "Services/Mail/AirMailManifestService.svc/SavePreManifest", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ PoMailPreManifest: PoMailPreManifest, PoMailPreManifestTrans: PoMailPreManifestTrans, DutyOfficer: _DutyOfficer, PlannedBy: _PlannedBy, UpdatedBy: 1, GroupFlightSNo: _GroupFlightSNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "Success") {
                ShowMessage('success', 'Success - Air Mail', "Pre Manifest - Processed Successfully");
                $('#divDetail').html("");
                $("#divManifestForm").html("");
                $("#divFooter").hide();
                $('#tabstrip').hide();
                $('#divLyingList').html('');
            }
            else
                ShowMessage('warning', 'Warning - Air Mail', "");
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Air Mail', "Unable to process.");

        }
    });
}

function ParentSuccessGridLyingList() {
    $('Table.WebFormTable2 tr:first').hide();

    $("#divLyingList").find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
        var controlId = $(this).attr("id");
        cfi.AutoComplete(controlId.replace("Text_", ""), "UldStockSNo", "v_PoMailULD", "UldStockSNo", "ULDNo", null, null, "contains");
    });

    $("#divDetail").find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
        var controlId = $(this).attr("id");
        var value = $("#" + controlId.replace("Text_", "")).val();
        var TextField = $("#" + controlId).val();

        $("#" + controlId).data("kendoAutoComplete").setDefaultValue(value, TextField);

    });
}

function ChildSuccessGridLyingList() {

    var vgrid = cfi.GetCFGrid("divLyingList");
    var childID = "div__" + vgrid.options.parentValue.toString();

    $("#" + childID).find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
        var controlId = $(this).attr("id");
        cfi.AutoComplete(controlId.replace("Text_", ""), "UldStockSNo", "v_PoMailULD", "UldStockSNo", "ULDNo", null, null, "contains");
    });

    $("#" + childID).find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
        var controlId = $(this).attr("id");
        var value = $("#" + controlId.replace("Text_", "")).val();
        var TextField = $("#" + controlId).val();

        $("#" + controlId).data("kendoAutoComplete").setDefaultValue(value, TextField);
    });
}

function CheckParent(obj)
{
    var parentindex = obj.id.split('_')[1];
    var AllChildID = "chkChild_"+parentindex+"_";
    if (obj.checked)
    {
        $('#divDetail input[type="checkbox"][id^="' + AllChildID + '"]').attr("checked", "checked");
    }
    else {
        $('#divDetail input[type="checkbox"][id^="' + AllChildID + '"]').removeAttr("checked");
    }
}

function CheckParentLyingList(obj) {
    var parentindex = obj.id.split('_')[1];
    var AllChildID = "chkChildLyingList_" + parentindex + "_";
    if (obj.checked) {
        $('#divLyingList input[type="checkbox"][id^="' + AllChildID + '"]').attr("checked", "checked");
    }
    else {
        $('#divLyingList input[type="checkbox"][id^="' + AllChildID + '"]').removeAttr("checked");
    }
}
