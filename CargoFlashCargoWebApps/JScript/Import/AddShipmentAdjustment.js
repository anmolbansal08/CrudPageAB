var _CURR_PRO_ = "";
var _CURR_OP_ = "";
$(document).ready(function () {
    BindSearch();
});

function BindSearch() {
    _CURR_PRO_ = "ADDSHIPMENTADJUSTMENT";
    _CURR_OP_ = "Add Shipment Adjustment";
    $.ajax({
        url: "Services/Import/AddShipmentAdjustmentService.svc/GetWebForm/" + _CURR_PRO_ + "/Import/AddShipmentAdjustmentSearch/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContent);
            //$("#divFooter").html(fotter).show();            
            cfi.AutoCompleteV2("searchAWBNo", "AWBNo", "Irregularity", null, "contains");
            
            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });
            $("#btnSearch").bind("click", function () {
                //CleanUI();
                AddShipmentAdjustmentSearch();
            });            
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
                }
            }
        }
    }); 
}

function AddShipmentAdjustmentSearch() {
    var searchAWBSNo = $("#searchAWBNo").val();
    var AddShipmentAdjustmentSearch = {
        processName: _CURR_PRO_,
        moduleName: 'Import',
        appName: 'AddShipmentAdjustment',
        Action: 'IndexView',
        searchAWBSNo: searchAWBSNo
    }

    if (_CURR_PRO_ == "ADDSHIPMENTADJUSTMENT") {
        cfi.ShowIndexViewV2("divAddShipmentAdjustment", "Services/Import/AddShipmentAdjustmentService.svc/GetGridData", AddShipmentAdjustmentSearch);
    }
}

function checkProgrss(item, subprocess, displaycaption) {
    if (subprocess.toString() == "EDIT") {
        if (item == "") {
            return "\"incompleteprocess\"";
        }
        else if (item.indexOf("EDIT") > -1) {
            return "\"completeprocess\"";
        }
        else
            return "\"incompleteprocess\"";
    }    
}

var currentawbsno = "";
var currentAWBNo = "";
function BindEvents(obj, e, isdblclick) {
    var closestTr = $(obj).closest("tr");
    var trLocked = $(".k-grid-header-wrap tr");
    var trRow = $(".k-grid-header-wrap tr");
    var awbSNoIndex = 0;
    var awbNoIndex = 0;
    var subprocess = $(obj).attr("process").toUpperCase();
    awbNoIndex = trLocked.find("th[data-field='AWBNo']").index();
    currentawbsno = closestTr.find("td:eq(" + awbSNoIndex + ")").text();
    currentAWBNo = closestTr.find("td:eq(" + awbNoIndex + ")").text();
    if (subprocess.toUpperCase() == 'EDIT STATION') {
        OpenPopUpEDIT(currentawbsno, obj, currentAWBNo);
    }
    else if (subprocess.toUpperCase() == 'VIEW STATION') {
        OpenPopUpVIEW(currentawbsno, obj, currentAWBNo);
    }
}

function OpenPopUpEDIT(AWBSNo, obj, AWBNo) {
    var divhtml = "<table width=100% class=\"WebFormTable\"><tr><td class=\"formSection\">AWBNo</td><td class=\"formSection\" colspan=2>" + AWBNo + "</td><td class=\"formSection\">Station</td><td class=\"formSection\" colspan=2><input type=\"hidden\" name=\"waybillStation\" id=\"waybillStation\" value=\"\" /><input type=\"text\" class=\"\" name=\"Text_waybillStation\"  id=\"Text_waybillStation\" controltype=\"autocomplete\" maxlength=\"\" data-width=\"50px\" value=\"\" placeholder=\"\" /></td></tr><tr><tr><td colspan=6></td></tr><tr><td colspan=6><table id=\"tblEditAddShipment\" width=100%  class=\"WebFormTable\"></table></td></tr></table>";
    $("#divWaybillDetailsPopUp").html(divhtml);
    cfi.AutoCompleteV2("waybillStation", "AirportCode", "AddShipmentAdjustment_AllowStation", GetStationwiseDetails, "contains");
    $("#Text_waybillStation").data("kendoAutoComplete").setDefaultValue(userContext.AirportSNo, userContext.AirportCode);
    cfi.PopUp('divWaybillDetailsPopUp', 'WayBill Detail', 1000, null, null, 10);
    GetStationwiseDetails('Text_waybillStation', userContext.AirportCode, "waybillStation", userContext.AirportSNo);
}

function OpenPopUpVIEW(AWBSNo, obj, AWBNo) {
    $("#divWaybillStationDetailsPopUp").html(GetAllStationwaybillDetails(AWBSNo, obj, AWBNo));
    cfi.PopUp('divWaybillStationDetailsPopUp', 'Station WayBill Detail', 1000, null, null, 10);
}

function ExtraCondition(textId) {
    var filter = cfi.getFilter("AND");
    if (textId == "Text_waybillStation") {
        //cfi.setFilter(filter, "AWBSNo", "eq", currentawbsno);
        cfi.setFilter(filter, "UserSNo", "eq", userContext.UserSNo);
        var filterStation = cfi.autoCompleteFilter(filter);
        return filterStation;
    }
}

function GetStationwiseDetails(TextID, Textval, hiddenID, Hiddenval) {
    $("#tblEditAddShipment").html('');
    var StationSNo = Hiddenval;
    var Station = Textval;
    $.ajax({
        url: "Services/Import/AddShipmentAdjustmentService.svc/GetWaybillCompleteDetail?AWBSNo=" + currentawbsno + "&AWBNo=" + currentAWBNo + "&StationSNo=" + StationSNo + "&Station=" + Station, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result != "") {
                var resData = jQuery.parseJSON(result);
                var Import = resData.Table0;
                var Added = resData.Table1;
                var Arrived = resData.Table2;
                var index = 0;
                $("#tblEditAddShipment").append("<tr><th class=\"ui-widget-header\">Stage</th><th class=\"ui-widget-header\">Flight No</th><th class=\"ui-widget-header\">ULDNo</th><th class=\"ui-widget-header\">Current Pcs</th><th class=\"ui-widget-header\">Revised Pcs</th><th class=\"ui-widget-header\"></th></tr>");

                if (Added.length > 0 || Arrived.length > 0) {
                    $("#tblEditAddShipment").append("</hr><tr><td class=\"formSection\" colspan=6>" + Import[0].operation + "</td></tr>");
                }

                if (Added.length > 0) {
                    for (var key in Added) {
                        $("#tblEditAddShipment").append("<tr id='trtblEditAddShipment_" + index + "'><td style='width:15%; height:30px;' class='ui-widget-content'>" + Added[key].Stage + "</td><td style='width:15%; height:30px;' class='ui-widget-content'>" + Added[key].FlightNo + "</td><td style='width:15%; height:30px;' class='ui-widget-content'>" + Added[key].ULDNo + "</td><td style='width:15%; height:30px;' class='ui-widget-content'>" + Added[key].CurrentPcs + "</td><td style='width:15%; height:30px;' class='ui-widget-content'><input type=\"text\" name='txtReceivePcs_" + index + "' id='txtReceivePcs_" + index + "' value=\"\" onchange=\"ShowEditButton(this);\"/></td><td style='width:25%; height:30px;' class='ui-widget-content'><button class='btn btn-block btn-success btn-sm' style='display:none' id='btnEdit' onclick='EditRevisepcs(this," + Added[key].SNo + "," + Added[key].fromtable + "," + StationSNo + "," + '"' + Station + '"' + ")'>Edit</button></td></tr>");
                        cfi.Numeric("txtReceivePcs_" + index, 0);
                        index = index + 1;
                    }
                }
                if (Arrived.length > 0) {
                    for (var key in Arrived) {
                        $("#tblEditAddShipment").append("<tr id='trtblEditAddShipment_" + index + "'><td style='width:15%; height:30px;' class='ui-widget-content'>" + Arrived[key].Stage + "</td><td style='width:15%; height:30px;' class='ui-widget-content'>" + Arrived[key].FlightNo + "</td><td style='width:15%; height:30px;' class='ui-widget-content'>" + Arrived[key].ULDNo + "</td><td style='width:15%; height:30px;' class='ui-widget-content'>" + Arrived[key].CurrentPcs + "</td><td style='width:15%; height:30px;' class='ui-widget-content'><input type=\"text\" name='txtReceivePcs_" + index + "' id='txtReceivePcs_" + index + "' value=\"\" onchange=\"ShowEditButton(this);\"/></td><td style='width:25%; height:30px;' class='ui-widget-content'><button class='btn btn-block btn-success btn-sm' style='display:none' id='btnEdit' onclick='EditRevisepcs(this," + Arrived[key].SNo + "," + Arrived[key].fromtable + "," + StationSNo + "," + '"' + Station + '"' + ")'>Edit</button></td></tr>");
                        cfi.Numeric("txtReceivePcs_" + index, 0);
                        index = index + 1;
                    }
                }

                var Export = resData.Table3;
                var Offloaded = resData.Table4;
                var Loading = resData.Table5;
                var Premanifest = resData.Table6;
                var Manifest = resData.Table7;
                var Closed = resData.Table8;
                var Combined = resData.Table9

                if (Combined.length > 0) {
                    $("#tblEditAddShipment").append("</hr><tr class=\"formSection\"><td colspan=6>" + Export[0].operation + "</td></tr>");
                    for (var key in Combined) {
                        $("#tblEditAddShipment").append("<tr id='trtblEditAddShipment_" + index + "'><td style='width:15%; height:30px;' class='ui-widget-content'>" + Combined[key].Stage + "</td><td style='width:15%; height:30px;' class='ui-widget-content'>" + Combined[key].FlightNo + "</td><td style='width:15%; height:30px;' class='ui-widget-content'>" + Combined[key].ULDNo + "</td><td style='width:15%; height:30px;' class='ui-widget-content'>" + Combined[key].CurrentPcs + "</td><td style='width:15%; height:30px;' class='ui-widget-content'><input type=\"text\" name='txtReceivePcs_" + index + "' id='txtReceivePcs_" + index + "' value=\"\" onchange=\"ShowEditButton(this);\"/></td><td style='width:25%; height:30px;' class='ui-widget-content'><button class='btn btn-block btn-success btn-sm' style='display:none' id='btnEdit' onclick='EditRevisepcs(this," + Combined[key].SNo + "," + Combined[key].fromtable + "," + StationSNo + "," + '"' + Station + '"' + ")'>Edit</button></td></tr>");
                        cfi.Numeric("txtReceivePcs_" + index, 0);
                        index = index + 1;
                    }

                    //if (Offloaded.length > 0 || Loading.length > 0 || Premanifest.length > 0 || Manifest.length > 0 || Closed.length > 0) {
                    //    $("#tblEditAddShipment").append("</hr><tr class=\"formSection\"><td colspan=6>" + Export[0].operation + "</td></tr>");
                    //}

                    //if (Offloaded.length > 0) {
                    //    for (var key in Offloaded) {
                    //        $("#tblEditAddShipment").append("<tr id='trtblEditAddShipment_" + index + "'><td style='width:15%; height:30px;' class='ui-widget-content'>" + Offloaded[key].Stage + "</td><td style='width:15%; height:30px;' class='ui-widget-content'>" + Offloaded[key].FlightNo + "</td><td style='width:15%; height:30px;' class='ui-widget-content'>" + Offloaded[key].ULDNo + "</td><td style='width:15%; height:30px;' class='ui-widget-content'>" + Offloaded[key].CurrentPcs + "</td><td style='width:15%; height:30px;' class='ui-widget-content'><input type=\"text\" name='txtReceivePcs_" + index + "' id='txtReceivePcs_" + index + "' value=\"\" onchange=\"ShowEditButton(this);\"/></td><td style='width:25%; height:30px;' class='ui-widget-content'><button class='btn btn-block btn-success btn-sm' style='display:none' id='btnEdit' onclick='EditRevisepcs(this," + Offloaded[key].SNo + "," + Offloaded[key].fromtable + "," + StationSNo + "," + '"' + Station + '"' + ")'>Edit</button></td></tr>");
                    //        cfi.Numeric("txtReceivePcs_" + index, 0);
                    //        index = index + 1;
                    //    }
                    //}

                    //if (Loading.length > 0) {
                    //    for (var key in Loading) {
                    //        $("#tblEditAddShipment").append("<tr id='trtblEditAddShipment_" + index + "'><td style='width:15%; height:30px;' class='ui-widget-content'>" + Loading[key].Stage + "</td><td style='width:15%; height:30px;' class='ui-widget-content'>" + Loading[key].FlightNo + "</td><td style='width:15%; height:30px;' class='ui-widget-content'>" + Loading[key].ULDNo + "</td><td style='width:15%; height:30px;' class='ui-widget-content'>" + Loading[key].CurrentPcs + "</td><td style='width:15%; height:30px;' class='ui-widget-content'><input type=\"text\" name='txtReceivePcs_" + index + "' id='txtReceivePcs_" + index + "' value=\"\" onchange=\"ShowEditButton(this);\"/></td><td style='width:25%; height:30px;' class='ui-widget-content'><button class='btn btn-block btn-success btn-sm' style='display:none' id='btnEdit' onclick='EditRevisepcs(this," + Loading[key].SNo + "," + Loading[key].fromtable + "," + StationSNo + "," + '"' + Station + '"' + ")'>Edit</button></td></tr>");
                    //        cfi.Numeric("txtReceivePcs_" + index, 0);
                    //        index = index + 1;
                    //    }
                    //}

                    //if (Premanifest.length > 0) {
                    //    for (var key in Loading) {
                    //        $("#tblEditAddShipment").append("<tr id='trtblEditAddShipment_" + index + "'><td style='width:15%; height:30px;' class='ui-widget-content'>" + Premanifest[key].Stage + "</td><td style='width:15%; height:30px;' class='ui-widget-content'>" + Premanifest[key].FlightNo + "</td><td style='width:15%; height:30px;' class='ui-widget-content'>" + Premanifest[key].ULDNo + "</td><td style='width:15%; height:30px;' class='ui-widget-content'>" + Premanifest[key].CurrentPcs + "</td><td style='width:15%; height:30px;' class='ui-widget-content'><input type=\"text\" name='txtReceivePcs_" + index + "' id='txtReceivePcs_" + index + "' value=\"\" onchange=\"ShowEditButton(this);\"/></td><td style='width:25%; height:30px;' class='ui-widget-content'><button class='btn btn-block btn-success btn-sm' style='display:none' id='btnEdit' onclick='EditRevisepcs(this," + Premanifest[key].SNo + "," + Premanifest[key].fromtable + "," + StationSNo + "," + '"' + Station + '"' + ")'>Edit</button></td></tr>");
                    //        cfi.Numeric("txtReceivePcs_" + index, 0);
                    //        index = index + 1;
                    //    }
                    //}

                    //if (Manifest.length > 0) {
                    //    for (var key in Loading) {
                    //        $("#tblEditAddShipment").append("<tr id='trtblEditAddShipment_" + index + "'><td style='width:15%; height:30px;' class='ui-widget-content'>" + Manifest[key].Stage + "</td><td style='width:15%; height:30px;' class='ui-widget-content'>" + Manifest[key].FlightNo + "</td><td style='width:15%; height:30px;' class='ui-widget-content'>" + Manifest[key].ULDNo + "</td><td style='width:15%; height:30px;' class='ui-widget-content'>" + Manifest[key].CurrentPcs + "</td><td style='width:15%; height:30px;' class='ui-widget-content'><input type=\"text\" name='txtReceivePcs_" + index + "' id='txtReceivePcs_" + index + "' value=\"\" onchange=\"ShowEditButton(this);\"/></td><td style='width:25%; height:30px;' class='ui-widget-content'><button class='btn btn-block btn-success btn-sm' style='display:none' id='btnEdit' onclick='EditRevisepcs(this," + Manifest[key].SNo + "," + Manifest[key].fromtable + "," + StationSNo + "," + '"' + Station + '"' + ")'>Edit</button></td></tr>");
                    //        cfi.Numeric("txtReceivePcs_" + index, 0);
                    //        index = index + 1;
                    //    }
                    //}

                    //if (Closed.length > 0) {
                    //    for (var key in Loading) {
                    //        $("#tblEditAddShipment").append("<tr id='trtblEditAddShipment_" + index + "'><td style='width:15%; height:30px;' class='ui-widget-content'>" + Closed[key].Stage + "</td><td style='width:15%; height:30px;' class='ui-widget-content'>" + Closed[key].FlightNo + "</td><td style='width:15%; height:30px;' class='ui-widget-content'>" + Closed[key].ULDNo + "</td><td style='width:15%; height:30px;' class='ui-widget-content'>" + Closed[key].CurrentPcs + "</td><td style='width:15%; height:30px;' class='ui-widget-content'><input type=\"text\" name='txtReceivePcs_" + index + "' id='txtReceivePcs_" + index + "' value=\"\" onchange=\"ShowEditButton(this);\"/></td><td style='width:25%; height:30px;' class='ui-widget-content'><button class='btn btn-block btn-success btn-sm' style='display:none' id='btnEdit' onclick='EditRevisepcs(this," + Closed[key].SNo + "," + Closed[key].fromtable + "," + StationSNo + "," + '"' + Station + '"' + ")'>Edit</button></td></tr>");
                    //        cfi.Numeric("txtReceivePcs_" + index, 0);
                    //        index = index + 1;
                    //    }
                    //}
                }
            }
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Add Shipment Adjustment', "AWB No. [" + CurrentAWBNo + "] -  unable to process.", "bottom-right");
        }
    });    
}

function ShowEditButton(obj)
{
    var id = $(obj).attr('id');
    var currentPcs = $(obj).closest('td').prev('td').text();
    if ($("#" + id).val() == "") {
        $(obj).closest('tr').find('button').hide();
        $("#" + id).val('');
    }
    else if (parseInt($("#" + id).val()) > parseInt(currentPcs)) {
        $(obj).closest('tr').find('button').hide();
        ShowMessage('warning', 'Warning - Add Shipment Adjustment', "Revised Pcs can't greater than " + currentPcs, "bottom-right");
        $("#" + id).val('');
    }
    else if ($("#" + id).val() >= 0) {
        $(obj).closest('tr').find('button').show();
    }
    else {
        $(obj).closest('tr').find('button').hide();
        $("#" + id).val('');
    }
}

function EditRevisepcs(obj, currentSNo, fromtable, StationSNo, Station) {
    var RevisedPcs = $(obj).closest('tr').find("input[id^='txtReceivePcs']").val();
    if (RevisedPcs != "") {
        $.ajax({
            url: "Services/Import/AddShipmentAdjustmentService.svc/SaveRevisedData", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({
                strData: btoa(JSON.stringify({ AWBSNo: currentawbsno, SNo: currentSNo, fromtable: fromtable, Pieces: RevisedPcs, StationSNo: StationSNo, Station: Station }))
            }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "2000") {
                    ShowMessage('success', 'Success - Add Shipment Adjustment', "Processed Successfully", "bottom-right");
                    $("#btnSave").unbind("click");
                    flag = true;
                }
                else {
                    ShowMessage('warning', 'Warning - Add Shipment Adjustment ', result, "bottom-right");
                    flag = false;
                }
                $("#divWaybillDetailsPopUp").data("kendoWindow").close();
                AddShipmentAdjustmentSearch();
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - Add Shipment Adjustment', "unable to process.", "bottom-right");
            }
        });
    }
    else {
        ShowMessage('warning', 'Warning - Add Shipment Adjustment', "Kindly enter Revised pcs in order to Save changes.", "bottom-right");
    }
}

function GetAllStationwaybillDetails(AWBSNo, obj, AWBNo) {    
    var divView = "";
    $.ajax({
        url: "Services/Import/AddShipmentAdjustmentService.svc/GetAllStationwaybillDetails?AWBSNo=" + AWBSNo + "&AWBNo=" + AWBNo, async: false, type: "get", dataType: "html", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result != "") {
                divView = result; 
            }
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - Add Shipment Adjustment', "unable to process.", "bottom-right");
        }
    });
    return divView;
}

var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divAddShipmentAdjustment' style='width:100%'></div></td></tr></table></div><div id='divWaybillDetailsPopUp'></div><div id='divWaybillStationDetailsPopUp'></div>";
