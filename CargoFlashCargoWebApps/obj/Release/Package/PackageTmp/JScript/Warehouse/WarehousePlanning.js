/// <reference path="../../Scripts/common.js" />
/// <reference path="../../Scripts/Kendo/kendo.web.js" />
var seletedTd = [];
var CurrentArea = "Area";
var isArea = null;
var isSubArea = null;
var AreaSno = null;
var selectedColor = "#0000FF";
var pageType = "New";
var warehouseSNo;
var isLocationSaved = false;
var SubLocationSelect;
var isAreaSave = false;
var SlectedSubAreaSNo = null;
var AreaArray = [];
var dist = [];
var EditSelectedColor;
var PageHints = 0;
var TerminalSNo, TerminalName;

$(function () {
    warehouseSNo = getQueryStringValue("RecID");
    TerminalSNo = getQueryStringValue("TerminalSNo");
    TerminalName = getQueryStringValue("TerminalName");
    TerminalName = $(TerminalName).text();
    //added by purushottam kumar for search windows with double tills
    if (warehouseSNo.toString().indexOf('~~') > 0) {
        PageHints = 1;
        warehouseSNo = warehouseSNo.replace('~~', '').trim();
    }


    $.ajax({
        url: 'HtmlFiles/Warehouse/WarehousePlanning.html',
        success: function (result) {
            $("body").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'></form");
            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });
            //added end pagehints 
            if (PageHints == 0) {
                $('#aspnetForm').append(result);
                PageLoaded();
            } // else parts added by purushottam and only for search and table matrix
            else {
                $('#aspnetForm').append("<div id='divSearchWindow'></div><table id='tblMatrix' ><tr><td><table id='hideShowLable' align='center'></table></td></tr><tr><td><table id='tblMatrixBind' style='cursor:pointer;border-collapse: collapse;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;'></table></td></tr></table>");
                SearchLocation();
            }
        }
    });




});
function ClearVaribleValues() {
    isSubArea = null;
    isArea = null;
    seletedTd = [];
    SlectedSubAreaSNo = null;
    AreaSno = null;
    SelectedSubareaStyle = null;
    dist = [];
    EditSelectedColor = "";
}


function PageLoaded(WHSetupSNo) {
    warehouseSNo = WHSetupSNo || warehouseSNo;
    $.ajax({
        url: "Services/Warehouse/WarehousePlanningService.svc/GetPanningMatrix?recid=" + warehouseSNo + "&sltSNo=" + ($("#WarehouseSubLocation").val() || "0"),
        type: "get",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (result) {
            if (result != undefined) {
                CreateMatrix(result);
            }
        }
    });
}

function WarehouseChange(a, b, c, d) {
    window.location.href = "Default.cshtml?Module=Warehouse&Apps=WarehousePlanning&FormAction=Planning&UserID=0&RecID=" + $("#Text_WarehouseName").data("kendoAutoComplete").key();
}

function SubLocationChange(a, b, c, d) {
    $.ajax({
        url: "Services/Warehouse/WarehousePlanningService.svc/GetPanningMatrix?recid=" + warehouseSNo + "&sltSNo=" + d || "0",
        type: "get",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (result) {
            if (result != undefined) {
                CreateMatrix(result);
            }
        }
    });
}

function TerminalNameChange(a, b, c, d) {
    if (d != "")
        window.location.href = "Default.cshtml?Module=Warehouse&Apps=WarehousePlanning&FormAction=Planning&UserID=0&RecID=" + d;
}

function CreateMatrix(result) {
    var data = result.WarehousePlanningMatrix;
    var obj = result;
    $("#WarehouseSNo").val(obj.SNo);
    $("#lblAirportName").text(obj.AirPortName);
    $("#hdnAirportSNo").val(obj.AirportSNo);
    //$("#lblWarehouseName").text(obj.WarehouseName);
    cfi.AutoComplete("WarehouseName", "WarehouseName", "vWHSetup", "SNo", "WarehouseName", ["WarehouseName"], WarehouseChange, "contains", null, null, null, null);
    $("#Text_WarehouseName").attr("placeholder", "ALL");
    if ($("#Text_WarehouseName").length) {
        $("#Text_WarehouseName").data("kendoAutoComplete").setDefaultValue(warehouseSNo, obj.WarehouseName);
    }
    cfi.AutoComplete("WarehouseSubLocation", "SubLocationType", "WHSubLocationType", "SNo", "SubLocationType", ["SubLocationType"], SubLocationChange, "contains");
    cfi.AutoComplete("WHTerminal", "TerminalName", "vWHSetup", "SNo", "TerminalName", ["TerminalName"], TerminalNameChange, "contains");

    $("#lblWarehouseCode").text(obj.WarehouseCode);
    $("#lblTotalArea").text(obj.TotalArea + " Sq m.");
    $("#lblCellArea").text(obj.CellArea + " Sq m.");
    $("#lblCityName").text(obj.CityName.toUpperCase());
    var tbl = '';
    var trId = "";
    var ar = -1;
    var sr = -1;
    for (var i = 0; i < obj.WHRowCount; i++) {
        var rowNo = "R" + (i + 1);
        tbl += "<tr>";
        for (var k = 0; k < obj.WHColumnCount; k++) {
            var colNo = "C" + (k + 1);
            var SNo = 0;
            var ColorCode = 0;
            var WHAreaSNo = 0;
            var AreaName = "";
            var SubAreaSNo = 0;
            var SubColorCode = "";
            var SubAreaName = "";
            var IsStorable = 1;
            $(data).each(function (index, item) {
                if (item.WHRowNo.trim() == rowNo && item.WHColumnNo.trim() == colNo) {
                    SNo = item.SNo;
                    ColorCode = item.ColorCode
                    AreaName = item.AreaName;
                    WHAreaSNo = item.WHAreaSNo;
                    SubAreaSNo = item.SubAreaSNo;
                    SubColorCode = item.SubColorCode;
                    SubAreaName = item.SubAreaName;
                    IsStorable = item.IsStorable;
                }
            });

            if (WHAreaSNo > 0) {
                if (SubAreaSNo > 0) {
                    if (sr != SubAreaSNo) {
                        dist.push(SubAreaSNo);
                        sr = SubAreaSNo;
                    }
                    if (IsStorable == 0) {
                        tbl += "<td id=" + SNo + " width='20px'  class='notStorable' height='20px' data-rel='SubArea' rel='" + SubAreaSNo + "' data-subareasno='" + SubAreaSNo + "' data-tip='" + SubAreaName + "' style='background-color:" + SubColorCode + ";border:2px dotted;cursor: not-allowed;" + ColorCode + "'>&nbsp</td>";
                    } else {
                        tbl += "<td id=" + SNo + " width='20px' height='20px' data-rel='SubArea' rel='" + SubAreaSNo + "' data-subareasno='" + SubAreaSNo + "' data-tip='" + SubAreaName + "' style='background-color:" + SubColorCode + ";border:2px dotted " + ColorCode + "'>&nbsp</td>";
                    }
                } else {
                    if (ar != WHAreaSNo) {
                        dist.push(WHAreaSNo);
                        AreaArray.push(WHAreaSNo);
                        ar = WHAreaSNo;
                    }
                    if (IsStorable == 0) {
                        tbl += "<td id=" + SNo + " width='20px' class='notStorable' height='20px' data-rel='Area' rel='" + WHAreaSNo + "' data-areasno='" + WHAreaSNo + "' data-tip='" + AreaName + " - Area Not Storable' style='border:2px dotted;cursor: not-allowed;" + ColorCode + "'>&nbsp</td>";
                    } else {
                        tbl += "<td id=" + SNo + "  width='20px' class='Storable' height='20px' data-rel='Area' rel='" + WHAreaSNo + "' data-areasno='" + WHAreaSNo + "' data-tip='" + AreaName + "' style='border:2px dotted " + ColorCode + "'>&nbsp</td>";
                    }
                }
            }
            else {
                tbl += "<td id=" + SNo + " rel='Empty' width='20px' height='20px' style='border:1px solid #CCCCCC'>&nbsp</td>";
            }
        }
        tbl += "</tr>";
    }


    //Added by purushottam Kumar with page hints 
    if (PageHints == 1) {
        var str = "<td><input type='button' style='font-size: 10px;' id='btn' value='Hide Labels' class='ui-button ui-widget ui-state-default ui-corner-all ui-state-hover' data-view='Hide' onclick='HideLabels(this)' /></td>"
                + "<td><input type='button' style='font-size: 10px;' id='btn' value='Show Labels' class='ui-button ui-widget ui-state-default ui-corner-all ui-state-hover' data-view='Hide' onclick='ShowLabels(this)' /></td>";
        $("#hideShowLable").html('').append(str);
        $("#tblMatrixBind").html('').append(tbl);
        $("tdMatrixBind td").addClass("notStorable");

        if (!$("#tblMatrix").data("kendoWindow"))
            cfiPopUp("tblMatrix", "Location Details", "900", null, null, 80);
        else
            $("#tblMatrix").data("kendoWindow").open();
    }
    else
        $("#tblMatrix").html('').append(tbl);


    AreaArray = AreaArray.filter(function (itm, i, a) { return i == a.indexOf(itm) });

    var so = dist.filter(function (itm, i, a) { return i == a.indexOf(itm) });
    $.each(so, function (indexInArray, valueOfElement) {
        var td = $("td[rel='" + valueOfElement + "']")[0];
        var clss = ""; var cl = ""; var em = "";
        if ($(td).attr("data-areasno")) {
            clss = "valid_errmsg_area"; cl = "style='color:white'"; em = "style='border-color: blue transparent transparent;'";
        }
        var isshow = IshowLabel == true ? "" : "display:none;";
        var isEditShow = $(td).attr("data-areasno") != undefined ? "display:none;'" : "";
        $(td).append("<div rel='diveroor' error-rel='" + valueOfElement + "' style='position: absolute;margin-top: -40px;" + isshow + "'><div class='valid_errmsg " + clss + "' style='display: block;'><em " + em + "></em><div style='display:table'><div style='display:table-cell'><div><button class='remove ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only'  style='width: 20px;height: 15px;' type='button' onclick='DeleteArea(this)' title='Delete' ><span class='ui-button-icon-primary ui-icon ui-icon-trash'></span></button>&nbsp;&nbsp;<button class='remove ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only'  style='width: 20px;height: 15px;" + isEditShow + "' type='button' onclick='EditAreaFromIcon(" + valueOfElement + ")' title='Edit Location' ><span class='ui-button-icon-primary ui-icon ui-icon-document'></span></button>&nbsp;&nbsp;" + $(td).attr("data-tip") + "</div></div><div onclick='LableClick(this)' " + cl + " class='valid_close_icon '>x</div></div></div></div></div>");

    });
    CreateSelectable();
}
function LableClick(obj) {
    $(obj).closest("div[rel='diveroor']").hide('slow');
}
function DeleteArea(obj) {
    if ($(obj).closest("td").attr("data-subareasno")) {
        if (confirm("Are yo sure you want to delete ?")) {
            var sno = $(obj).closest("td").attr("data-subareasno");
            var id = $("td[rel='" + sno + "']").map(function () { return $(this).attr("id") }).get().join(',');
            var obj = {
                WHMatrixSNo: id
            }
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "Services/Warehouse/WarehousePlanningService.svc/DeleteSubArea",
                data: JSON.stringify(obj),
                success: function (response) {
                    if (response != "") {
                        ShowMessage("info", "", response);
                        return;
                    }
                    ShowMessage("success", "", "Sub Area Deleted Successfully...");
                    ClearVaribleValues();
                    PageLoaded();
                }
            });

        }
    }
    else {
        if (confirm("Are yo sure you want to delete ?")) {
            var sno = $(obj).closest("td").attr("data-areasno");
            var id = $("td[rel='" + sno + "']").map(function () { return $(this).attr("id") }).get().join(',');
            var obj = {
                WHMatrixSNo: id
            }
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "Services/Warehouse/WarehousePlanningService.svc/DeleteArea",
                data: JSON.stringify(obj),
                success: function (response) {
                    if (response != "") {
                        ShowMessage("info", "", response);
                        return;
                    }
                    AreaArray.pop(sno);
                    ShowMessage("success", "", "Area Deleted Successfully...");
                    ClearVaribleValues();
                    PageLoaded();
                }
            });

        }
    }

}
var SelectedSubareaStyle;
function CreateSelectable() {
    ClearVaribleValues();
    $("#tblMatrix").selectable({
        filter: 'td',
        distance: 5,
        cancel: ".notStorable",
        selecting: function (event, ui) {

            if (isArea == null) {
                isArea = $(ui.selecting).attr("data-areasno") == undefined ? true : false;
                isSubArea = $(ui.selecting).attr("data-subareasno") != undefined ? true : false;
            }
            if (isSubArea) {
                if (!SlectedSubAreaSNo)
                    SlectedSubAreaSNo = $(ui.selecting).attr("data-subareasno");

                if ($(ui.selecting).attr("data-subareasno") && SlectedSubAreaSNo == $(ui.selecting).attr("data-subareasno")) {
                    if (!SelectedSubareaStyle)
                        SelectedSubareaStyle = $(ui.selecting).attr("style");
                    $(ui.selecting).css("border", "2px dotted white");
                    //   seletedTd.push($(ui.selecting).attr("id"));

                    $(ui.selecting).attr("data-selected", "true");
                }
            }
            else if (isArea) {
                if ($(ui.selecting).attr("data-areasno") == undefined && $(ui.selecting).attr("data-subareasno") == undefined) {
                    $(ui.selecting).css("border", "2px dotted blue");
                    // seletedTd.push($(ui.selecting).attr("id"));
                    $(ui.selecting).attr("data-selected", "true");
                }
            }
            else {
                //if ($(ui.selecting).attr("data-areasno") && $(ui.selecting).attr("data-rel") != "SubArea" && ($(ui.selecting).attr("data-rel") == "Area" || $(ui.selecting).attr("data-rel") == undefined)) {
                if (!AreaSno)
                    AreaSno = $(ui.selecting).attr("data-areasno");
                if ($(ui.selecting).attr("data-areasno") == AreaSno) {
                    $(ui.selecting).css("background-color", "red");
                    //seletedTd.push($(ui.selecting).attr("id"));
                    $(ui.selecting).attr("data-selected", "true");
                }
                //  }
            }
        },
        unselecting: function (event, ui) {
            //var index = $.inArray($(ui.unselecting).attr("id"), seletedTd);
            //seletedTd.splice(index, 1);
            $(ui.unselecting).removeAttr("data-selected");
            if ($(ui.unselecting).attr("data-areasno") == undefined && $(ui.unselecting).attr("data-subareasno") == undefined) {
                $(ui.unselecting).css("border", "1px solid #CCCCCC");

            }
            if ($(ui.unselecting).attr("data-areasno") == AreaSno && $(ui.unselecting).attr("data-areasno")) {
                $(ui.unselecting).css("background-color", "transparent");

            }
            if ($(ui.unselecting).attr("data-subareasno") && SlectedSubAreaSNo == $(ui.unselecting).attr("data-subareasno")) {
                $(ui.unselecting).removeAttr("style").attr("style", SelectedSubareaStyle);
            }
        },
        stop: function (event, ui) {
            seletedTd = $("td[data-selected='true']").map(function () { return $(this).attr("id") }).get();
            $("td[data-selected='true']").removeAttr("data-selected");
            if (isSubArea == true) {
                jQuery.ajax({
                    url: "HtmlFiles/Warehouse/WarehousePlanningWindow.html",
                    success: function (result) {
                        EditSubArea(result);
                    },
                    async: true
                });
            }
            else if (isArea == true) {
                OpenSaveAreaWindow();
            } else {
                jQuery.ajax({
                    url: "HtmlFiles/Warehouse/WarehousePlanningWindow.html",
                    success: function (result) {
                        PopupOepn(result);
                    },
                    async: true
                });
            }
        }
    });
}

function EditAreaFromIcon(sno) {

    seletedTd = $("td[data-subareasno='" + sno + "']").map(function () { return $(this).attr("id") }).get();
    isSubArea = true;
    SlectedSubAreaSNo = sno;


    jQuery.ajax({
        url: "HtmlFiles/Warehouse/WarehousePlanningWindow.html",
        success: function (result) {
            EditSubArea(result);
        },
        async: true
    });
}

function EditSubArea(htm) {
    if (seletedTd.length == 0) {
        ClearVaribleValues();
        PageLoaded();
        return false;
    }
    var obj = { WHColumnNo: seletedTd.join(",") }
    $.ajax({
        url: "Services/Warehouse/WarehousePlanningService.svc/GetSubAreaData",
        type: "POST",
        dataType: 'json',
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        success: function (result) {

            _ExtraCondition = function (textId) {
                if ($.isFunction(window.ExtraCondition)) {
                    return ExtraCondition(textId);
                }
            }
            $("#divWindow").html(htm);
            BindSubLocationControls();

            $("#Terminal").val(result.Terminal);
            $("#Text_Terminal").val(result.Text_Terminal);
            cfi.BindMultiValue("Terminal", result.Text_Terminal, result.Terminal);
            $("#divMultiTerminal span.k-delete").remove();
            $("#Text_Terminal").css("cursor", "not-allowed");
            $("#Text_Terminal").data("kendoAutoComplete").enable(false);

            $("input[name=IsStorable][value=" + (result.Storable.toUpperCase() == "TRUE" ? "1" : "0") + "]").prop("checked", "checked");
            rdStorableClick();

            $("#Airline").val(result.Airline);
            $("#Text_Airline").val(result.Text_Airline);


            $("#SHC").val(result.SHC);
            $("#Text_SHC").val(result.Text_SHC);
            cfi.BindMultiValue("SHC", result.Text_SHC, result.SHC);

            $("#DestCountry").val(result.DestCountry);
            $("#Text_DestCountry").val(result.Text_DestCountry);
            cfi.BindMultiValue("DestCountry", result.Text_DestCountry, result.DestCountry);

            $("#DestCity").val(result.DestCity);
            $("#Text_DestCity").val(result.Text_DestCity);
            cfi.BindMultiValue("DestCity", result.Text_DestCity, result.DestCity);

            $("#AgentForwarder").val(result.DestCity);
            $("#Text_AgentForwarder").val(result.Text_AgentForwarder);
            cfi.BindMultiValue("AgentForwarder", result.Text_AgentForwarder, result.AgentForwarder);

            $("#Location").val(result.Location);
            $("#Text_Location").val(result.Text_Location);

            cfi.BindMultiValue("Location", result.Text_Location, result.Location);
            $("#divMultiLocation span.k-delete").remove();
            //$("#Text_Location").css("cursor", "not-allowed");
            //$("#Text_Location").data("kendoAutoComplete").enable(false);


            $("#LocationColorCode").val(result.ColorSNo);
            $("#Text_LocationColorCode").val("BEETLE-" + result.ColorCode);
            $("#divColor").css("background-color", result.ColorCode);
            if (isSubArea) {
                $("#btnDeleteSubArea").show();
                EditSelectedColor = result.ColorCode;
            }

            $("#SubLocation").val(result.SubLocation);
            $("#Text_SubLocation").val(result.Text_SubLocation);
            $("#txtSubAreaName").val(result.SubAreaName);

            if (result.FixedMovable == "True") {
                $("#Movable").attr("checked", 1);
            } else {
                $("#Fixed").attr("checked", 1);
            }

            $('div[rel="appendGrid"]').hide();
            SubLocationSelect = result.Text_SubLocation.toUpperCase();

            var SNo = result.SNo
            if (SubLocationSelect == "RACK") {
                MakeRackGrid(true, SNo);
                $("#divRack").show();
            }
            if (SubLocationSelect == "FLOOR") {
                MakeFloorGrid(true, SNo);
                $("#divFloor").show();
            }
            if (SubLocationSelect == "CAGES") {
                MakeCagesGrid(true, SNo);
                $("#divCages").show();
            }
            if (SubLocationSelect == "DOLLY") {
                MakeDollyGrid(true, SNo);
                $("#divDolly").show();
            }
            if (SubLocationSelect == "ROOM") {
                MakeRoomGrid(true, SNo);
                $("#divRoom").show();
            }

            if (!$("#divWindow").data("kendoWindow"))
                cfi.PopUp("divWindow", "Edit Location", "1100", null, CancelDialog, 50);
            else
                $("#divWindow").data("kendoWindow").open();

            $("input[rel=buttton]").button();

        }
    });
}

function OpenSaveAreaWindow() {

    if (!$("#divSaveArea").data("kendoWindow")) {
        cfi.PopUp("divSaveArea", "Save Area", "400", null, CancelAreaDialog, null);
    } else {
        $("#divSaveArea").data("kendoWindow").open();
    }
    $("input[rel=buttton]").button();
    $("#divAreaColor").css("background-color", "");
    $("#Text_Area").val('');
    $("Area").val('');
    cfi.AutoComplete("Area", "AreaName", "WHArea", "SNo", "AreaName", ["AreaName", "ColorCode"], null, "contains", null, null, null, null, AreaSelected);
}

function CancelAreaDialog() {
    if (!isAreaSave) {
        ClearVaribleValues();
        PageLoaded()
    }
    isAreaSave = false;
    $(".k-list-container").hide();
}

function SaveAreaDialog() {
    cfi.ValidateSubmitSection("divSaveArea");
    if (!cfi.IsValidSection($("#divSaveArea"))) {
        return false;
    }
    var obj = { SNo: $("#Area").val(), WHColumnNo: seletedTd.join(",") }
    $.ajax({
        url: "Services/Warehouse/WarehousePlanningService.svc/SaveArea",
        async: true,
        type: "POST",
        dataType: 'json',
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divSaveArea").data("kendoWindow").close();
            ClearVaribleValues();
            PageLoaded();
        }
    });



}
function AreaSelected(ss, dd) {
    $("#divAreaColor").css("background-color", ss.item.text().split('-')[1]);
    selectedColor = ss.item.text().split('-')[1];
}
function BindSubLocationControls() {
    cfi.AutoComplete("Terminal", "TerminalName", "Terminal", "SNo", "TerminalName", ["TerminalName"], null, "contains", ",");
    $("#Text_Terminal").data("kendoAutoComplete").setDefaultValue(TerminalSNo, TerminalName);
    $("#Text_Terminal").css("cursor", "not-allowed");
    $("#Text_Terminal").data("kendoAutoComplete").enable(false);

    cfi.AutoComplete("Airline", "AirlineName", "Airline", "SNo", "AirlineName", ["AirlineCode", "AirlineName"], null, "contains");
    cfi.AutoComplete("SHC", "Code", "SPHC", "SNo", "Code", ["Code"], null, "contains", ",");
    cfi.AutoComplete("DestCountry", "CountryName", "Country", "SNo", "CountryName", ["CountryName"], null, "contains", ",");
    cfi.AutoComplete("DestCity", "CityName", "City", "SNo", "CityName", ["CityName"], null, "contains", ",");
    cfi.AutoComplete("AgentForwarder", "Name", "vAccount", "SNo", "Name", ["Name"], null, "contains", ",");
    cfi.AutoComplete("Location", "LocationType", "WHLocationType", "SNo", "LocationType", ["LocationType"], null, "contains", ",", null, null, null);
    cfi.AutoComplete("SubLocation", "SubLocationType", "WHSubLocationType", "SNo", "SubLocationType", ["SubLocationType"], null, "contains", null, null, null, null, onSubLocationSelect);

    var template = '<span>#: TemplateColumn #</span><div style="height:10px;padding:5px;background-color:#: GetAutoColor(TemplateColumn) #"/></div>';
    cfi.AutoComplete("LocationColorCode", "ColorName,ColorCode", "Color", "SNo", "ColorCode", ["ColorName", "ColorCode"], null, "contains", null, null, null, null, onColorSelect, null, template);
}
function PopupOepn(result) {
    $("#divWindow").html(result);
    $("#lblCityName").text($("#hdnCity").val());

    if (!$("#divWindow").data("kendoWindow"))
        cfi.PopUp("divWindow", "Save Location", "1000", null, CancelDialog, 50);
    else
        $("#divWindow").data("kendoWindow").open();
    $("input[rel=buttton]").button();
    BindSubLocationControls();

}

function GetAutoColor(obj) {
    return obj.split('-')[1];
}

function onSubLocationSelect(obj, val) {
    $('div[rel="appendGrid"]').hide();
    SubLocationSelect = obj.item.text();
    if (SubLocationSelect == "RACK") {
        MakeRackGrid(false, 1);
        $("#divRack").show();
    }
    if (SubLocationSelect == "FLOOR") {
        MakeFloorGrid(false, 1);
        $("#divFloor").show();
    }
    if (SubLocationSelect == "CAGES") {
        MakeCagesGrid(false, 1);
        $("#divCages").show();
    }
    if (SubLocationSelect == "DOLLY") {
        MakeDollyGrid(false, 1);
        $("#divDolly").show();
    }
    if (SubLocationSelect == "ROOM") {
        MakeRoomGrid(false, 1);
        $("#divRoom").show();
    }


}

function SaveDialog() {
    var action = isSubArea == true ? "UpdateLocation" : "SaveLocation";
    cfi.ValidateSubmitSection("divWindow");
    if (!cfi.IsValidSection($("#divWindow"))) {
        return false;
    }
    //if ($("td[rel='" + SlectedSubAreaSNo + "']").length != seletedTd.length && isSubArea == true) {
    //    if (EditSelectedColor == $("#Text_LocationColorCode").val().split('-')[1]) {
    //        ShowMessage("error", "", "Please select different color.");
    //        return false;
    //    }
    //}
    var locationlist;
    var tblGrid;
    if ($("input[name='IsStorable']:checked").val() == 1) {
        if (SubLocationSelect == "RACK") {
            tblGrid = "tblRack"
        }
        if (SubLocationSelect == "FLOOR") {
            tblGrid = "tblFloor"
        }
        if (SubLocationSelect == "CAGES") {
            tblGrid = "tblCages"
        }
        if (SubLocationSelect == "DOLLY") {
            tblGrid = "tblDolly"
        }
        if (SubLocationSelect == "ROOM") {
            tblGrid = "tblRoom"
        }
        var rows = $("tr[id^='" + tblGrid + "']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
        getUpdatedRowIndex(rows.join(","), tblGrid);
        locationlist = JSON.parse($('#' + tblGrid).appendGrid('getStringJson'));
        if (!validateTableData(tblGrid, rows)) {
            return false;
        }
        if (locationlist.length == 0) {
            ShowMessage("error", "", "Please add atleast one " + SubLocationSelect + " grid Details");
            return false;
        }
    }
    var isStorable = $("input[name='IsStorable']:checked").val();
    var obj = {
        WHMatrixSNo: seletedTd.join(','),
        WarehouseCity: $("#WarehouseCity").val(),
        Terminal: $("#Terminal").val(),
        Airline: $("#Airline").val(),
        SHC: $("#SHC").val(),
        DestCountry: $("#DestCountry").val(),
        DestCity: $("#DestCity").val(),
        AgentForwarder: $("#AgentForwarder").val(),
        Location: $("#Location").val(),
        FixedMovable: $("input[name='fixed']:checked").val(),
        SubLocation: $("#SubLocation").val(),
        ColorCode: $("#Text_LocationColorCode").val(),
        ColorSNo: $("#LocationColorCode").val(),
        SubAreaName: $("#txtSubAreaName").val(),
        Storable: $("input[name='IsStorable']:checked").val(),
        SubLocationName: SubLocationSelect,
        LocationList: locationlist
    }
    var color = $("#Text_LocationColorCode").val();
    var title = $("#txtSubAreaName").val();
    $.ajax({
        url: "Services/Warehouse/WarehousePlanningService.svc/" + action,
        async: true,
        type: "POST",
        dataType: 'html',
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            ShowMessage("success", title.toUpperCase(), (isSubArea == true ? " Updated Successfully..." : " Created Successfully..."));
            ClearVaribleValues();
            isLocationSaved = true;
            $("#divWindow").data("kendoWindow").close();
            PageLoaded();
        }
    });
}
function DeleteSubArea() {
    if (confirm("Are you sure to want to delete.?")) {
        var obj = {
            WHMatrixSNo: seletedTd.join(',')
        }
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: "Services/Warehouse/WarehousePlanningService.svc/DeleteSubArea",
            data: JSON.stringify(obj),
            success: function (response) {
                if (response != "") {
                    ShowMessage("info", "", response);
                    return;
                }
                ShowMessage("success", "", "Sub Area Deleted Successfully...");;
                ClearVaribleValues();
                isLocationSaved = true;
                $("#divWindow").data("kendoWindow").close();
                PageLoaded();
            }
        });
    }
}
function CancelDialog() {
    if (!isLocationSaved) {
        //var removecss = seletedTd.join(",#");
        //if (isArea == false) {
        //    $("#" + removecss).css("background-color", "transparent");
        //} else {
        //    $("#" + removecss).css("border-color", "transparent").css("border", "1px solid #CCCCCC");
        //}
        ClearVaribleValues();
        PageLoaded();

    }
    $(".k-list-container").hide();
    isLocationSaved = false;
}
function MakeDollyGrid(getrecord, SNo) {
    var dbtableName = "tblDolly";
    $("#" + dbtableName).appendGrid({
        tableID: dbtableName,
        contentEditable: pageType,
        currentPage: 1, itemsPerPage: 10, whereCondition: null, sort: "",
        servicePath: 'Services/Warehouse/WarehousePlanningService.svc',
        getRecordServiceMethod: "GetDollyRecord",
        masterTableSNo: SNo,
        deleteServiceMethod: "DeleteDollyRecord",
        isGetRecord: getrecord,
        hideButtons: { updateAll: true, insert: true },
        caption: "DOLLY",
        initRows: 1,
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },

            {
                name: 'Name', display: 'Name', type: 'text', ctrlAttr: { controltype: 'text', maxlength: 100, style: 'text-transform: uppercase;width:100px;height:20px;' }, isRequired: true
            },
            {
                name: 'GrossWt', display: 'Gross Wt', type: 'text', value: 9999999, ctrlCss: { width: '50px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 7 }, isRequired: true
            },
            {
                name: 'VolWt', display: 'CBM', type: 'text', value: 0, ctrlCss: { width: '50px', height: '20px' }, ctrlAttr: { controltype: 'decimal3', maxlength: 3 }, isRequired: true
            },
            {
                name: 'ULDCount', display: 'ULD Count', type: 'text', value: 0, ctrlCss: { width: '50px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 7 }, isRequired: false
            },
            {
                name: 'SkidCount', display: 'Skids Count', type: 'text', value: 0, ctrlCss: { width: '50px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 7 }, isRequired: false
            }
        ]
    });

}
function MakeCagesGrid(getrecord, SNo) {
    var dbtableName = "tblCages";
    $("#" + dbtableName).appendGrid({
        tableID: dbtableName,
        contentEditable: pageType,
        currentPage: 1, itemsPerPage: 10, whereCondition: null, sort: "",
        servicePath: 'Services/Warehouse/WarehousePlanningService.svc',
        getRecordServiceMethod: "GetCagesRecord",
        masterTableSNo: SNo,
        isGetRecord: getrecord,
        deleteServiceMethod: "DeleteCagesRecord",
        hideButtons: { updateAll: true, insert: true },
        caption: "CAGES",
        initRows: 1,
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
              {
                  name: 'Number', display: 'Number', type: 'text', ctrlAttr: { controltype: 'text', maxlength: 50, style: 'text-transform: uppercase;width:100px;height:20px;' }, isRequired: true
              },
            {
                name: 'Name', display: 'Name', type: 'text', ctrlAttr: { controltype: 'text', maxlength: 100, style: 'text-transform: uppercase;width:100px;height:20px;' }, isRequired: true
            },
            {
                name: 'GrossWt', display: 'Gross Wt', type: 'text', value: 9999999, ctrlCss: { width: '50px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 7, onBlur: "BindLocationTypeCtrl(this)" }, isRequired: false
            },
            {
                name: 'VolWt', display: 'CBM', type: 'text', value: 0, ctrlCss: { width: '50px', height: '20px' }, ctrlAttr: { controltype: 'decimal3', maxlength: 3, onBlur: "BindLocationTypeCtrl(this)" }, isRequired: false
            },
            {
                name: 'ULDCount', display: 'ULD Count', type: 'text', value: 0, ctrlCss: { width: '50px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 7, onBlur: "BindLocationTypeCtrl(this)" }, isRequired: false
            },
            {
                name: 'SkidCount', display: 'Skids Count', type: 'text', value: 0, ctrlCss: { width: '50px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 7, onBlur: "BindLocationTypeCtrl(this)" }, isRequired: false
            }
        ],
        dataLoaded: function () {
            $("input[id*=tblCages_GrossWt]").each(function () {
                if ($(this).val() == "0")
                    $(this).val("");
                BindLocationTypeCtrl(this);
            });
            $("input[id*=tblCages_VolWt]").each(function () {
                if ($(this).val() == "0.000")
                    $(this).val("");
                BindLocationTypeCtrl(this);
            });
            $("input[id*=tblCages_ULDCount]").each(function () {
                if ($(this).val() == "0")
                    $(this).val("");
                BindLocationTypeCtrl(this);
            });
            $("input[id*=tblCages_SkidCount]").each(function () {
                if ($(this).val() == "0")
                    $(this).val("");
                BindLocationTypeCtrl(this);
            });
        }
    });
}
function MakeFloorGrid(getrecord, SNo) {
    var dbtableName = "tblFloor";
    $("#" + dbtableName).appendGrid({
        tableID: dbtableName,
        contentEditable: pageType,
        currentPage: 1, itemsPerPage: 10, whereCondition: null, sort: "",
        servicePath: 'Services/Warehouse/WarehousePlanningService.svc',
        getRecordServiceMethod: "GetFloorRecord",
        deleteServiceMethod: "DeleteFloorRecord",
        masterTableSNo: SNo,
        isGetRecord: getrecord,
        hideButtons: { updateAll: true, insert: true },
        caption: "FLOOR",
        initRows: 1,
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
            {
                name: 'Name', display: 'Name', type: 'text', ctrlAttr: { controltype: 'text', maxlength: 100, style: 'text-transform: uppercase;width:100px;height:20px;' }, isRequired: true
            },
            {
                name: 'GrossWt', display: 'Gross Wt', type: 'text', value: 9999999, ctrlCss: { width: '50px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 7, onBlur: "BindLocationTypeCtrl(this)" }, isRequired: false
            },
            {
                name: 'VolWt', display: 'CBM', type: 'text', value: 0, ctrlCss: { width: '50px', height: '20px' }, ctrlAttr: { controltype: 'decimal3', maxlength: 3, onBlur: "BindLocationTypeCtrl(this)" }, isRequired: false
            },
            {
                name: 'ULDCount', display: 'ULD Count', type: 'text', value: 0, ctrlCss: { width: '50px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 7, onBlur: "BindLocationTypeCtrl(this)" }, isRequired: false
            },
            {
                name: 'SkidCount', display: 'Skids Count', type: 'text', value: 0, ctrlCss: { width: '50px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 7, onBlur: "BindLocationTypeCtrl(this)" }, isRequired: false
            }
        ],
        afterRowAppended: function () {
            $("input[id*=tblFloor_GrossWt]").each(function () {
                if ($(this).val() == "0")
                    $(this).val("");
                BindLocationTypeCtrl(this);
            });
            $("input[id*=tblFloor_VolWt]").each(function () {
                if ($(this).val() == "0.000")
                    $(this).val("");
                BindLocationTypeCtrl(this);
            });
            $("input[id*=tblFloor_ULDCount]").each(function () {
                if ($(this).val() == "0")
                    $(this).val("");
                BindLocationTypeCtrl(this);
            });
            $("input[id*=tblFloor_SkidCount]").each(function () {
                if ($(this).val() == "0")
                    $(this).val("");
                BindLocationTypeCtrl(this);
            });
        }
    });

}
function MakeRackGrid(getrecord, SNo) {
    var dbtableName = "tblRack";
    $("#" + dbtableName).appendGrid({
        tableID: dbtableName,
        contentEditable: pageType,
        currentPage: 1, itemsPerPage: 10, whereCondition: null, sort: "",
        servicePath: 'Services/Warehouse/WarehousePlanningService.svc',
        getRecordServiceMethod: "GetRackRecord",
        deleteServiceMethod: "DeleteRackRecord",
        masterTableSNo: SNo,
        isGetRecord: getrecord,
        hideButtons: { updateAll: true, insert: true },
        caption: "RACK",
        initRows: 1,
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
            {
                name: 'RackNbr', display: 'Rack Nbr', type: 'text', ctrlAttr: { controltype: 'text', maxlength: 100, style: 'text-transform: uppercase;width:100px;height:20px;' }, isRequired: true
            },
            {
                name: 'SlabNbr', display: 'Slab Nbr', type: 'text', ctrlAttr: { controltype: 'text', maxlength: 100, style: 'text-transform: uppercase;width:100px;height:20px;' }, isRequired: true
            },
            {
                name: 'Name', display: 'Name', type: 'text', ctrlAttr: { controltype: 'text', maxlength: 100, style: 'text-transform: uppercase;width:100px;height:20px;' }, isRequired: true
            },
            {
                name: 'GrossWt', display: 'Gross Wt', type: 'text', value: 9999999, ctrlCss: { width: '50px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 7, onBlur: "BindLocationTypeCtrl(this)" }, isRequired: false
            },
            {
                name: 'VolWt', display: 'CBM', type: 'text', value: 0, ctrlCss: { width: '50px', height: '20px' }, ctrlAttr: { controltype: 'decimal3', maxlength: 3, onBlur: "BindLocationTypeCtrl(this)" }, isRequired: false
            },
            {
                name: 'ULDCount', display: 'ULD Count', type: 'text', value: 0, ctrlCss: { width: '50px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 7, onBlur: "BindLocationTypeCtrl(this)" }, isRequired: false
            },
            {
                name: 'SkidCount', display: 'Skids Count', type: 'text', value: 0, ctrlCss: { width: '50px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 7, onBlur: "BindLocationTypeCtrl(this)" }, isRequired: false
            }
        ],
        afterRowAppended: function () {
            $("input[id*=tblRack_GrossWt]").each(function () {
                if ($(this).val() == "0")
                    $(this).val("");
                BindLocationTypeCtrl(this);
            });
            $("input[id*=tblRack_VolWt]").each(function () {
                if ($(this).val() == "0.000")
                    $(this).val("");
                BindLocationTypeCtrl(this);
            });
            $("input[id*=tblRack_ULDCount]").each(function () {
                if ($(this).val() == "0")
                    $(this).val("");
                BindLocationTypeCtrl(this);
            });
            $("input[id*=tblRack_SkidCount]").each(function () {
                if ($(this).val() == "0")
                    $(this).val("");
                BindLocationTypeCtrl(this);
            });
        }
    });

}
function MakeRoomGrid(getrecord, SNo) {
    var dbtableName = "tblRoom";
    $("#" + dbtableName).appendGrid({
        tableID: dbtableName,
        contentEditable: pageType,
        currentPage: 1, itemsPerPage: 10, whereCondition: null, sort: "",
        servicePath: 'Services/Warehouse/WarehousePlanningService.svc',
        getRecordServiceMethod: "GetRoomRecord",
        deleteServiceMethod: "DeleteRoomRecord",
        masterTableSNo: SNo,
        isGetRecord: getrecord,
        hideButtons: { updateAll: true, insert: true },
        caption: "ROOM",
        initRows: 1,
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
            {
                name: 'TempControlled', display: 'Temp Controlled', type: 'text', value: "1", type: 'select', onChange: function (evt, rowIndex) {
                    var ind = evt.target.id.split('_')[2];
                    if ($("#" + evt.target.id + " option:checked").val() == 0) {

                        $("input[id*='tblRoom_StartTemperature_" + ind + "']").removeAttr("required").css("cursor", "not-allowed");
                        $("input[id*='tblRoom_EndTemperature_" + ind + "']").removeAttr("required").css("cursor", "not-allowed");
                        $("#tblRoom_StartTemperature_" + ind).data("kendoNumericTextBox").enable(false);
                        $("#tblRoom_EndTemperature_" + ind).data("kendoNumericTextBox").enable(false);
                        $("#tblRoom_StartTemperature_" + ind).data("kendoNumericTextBox").value(0);
                        $("#tblRoom_EndTemperature_" + ind).data("kendoNumericTextBox").value(0);
                    } else {
                        $("input[id*='tblRoom_StartTemperature_" + ind + "']").attr("disabled", false).attr("required", "required").css("cursor", "auto");;
                        $("input[id*='tblRoom_EndTemperature_" + ind + "']").attr("disabled", false).attr("required", "required").css("cursor", "auto");
                        $("#tblRoom_StartTemperature_" + ind).data("kendoNumericTextBox").enable(true);
                        $("#tblRoom_EndTemperature_" + ind).data("kendoNumericTextBox").enable(true);
                        $("#tblRoom_StartTemperature_" + ind).data("kendoNumericTextBox").value('');
                        $("#tblRoom_EndTemperature_" + ind).data("kendoNumericTextBox").value('');
                    }


                }, ctrlOptions: { '1': 'Yes', '0': 'No' }, ctrlCss: { width: '50px', height: '20px' }
            },
            { name: 'SensorName', display: 'Sensor', type: 'text', ctrlAttr: { controltype: 'autocomplete', maxlength: 100 }, tableName: 'vwTempratureSensor', textColumn: 'TempratureSensorName', keyColumn: 'TempratureSensorSNo', filterCriteria: 'contains', separator: ',' },

            {
                name: 'RoomNumber', display: 'Room Number', type: 'text', ctrlAttr: { controltype: 'text', maxlength: 50, style: 'text-transform: uppercase;width:100px;height:20px;' }, isRequired: true
            },
              {
                  name: 'Name', display: 'Room Name', type: 'text', value: "", ctrlAttr: { controltype: 'text', maxlength: 50, style: 'text-transform: uppercase;width:100px;height:20px;' }, isRequired: true
              },
           {
               name: 'Range', display: 'Range  of  Temp (degree celsius)', type: 'div', isRequired: true, ctrlCss: { width: '100px' },
               divElements:
           [
           {

               divRowNo: 1, name: 'StartTemperature', type: 'text', value: '', ctrlAttr: { controltype: 'range', maxlength: 4, allowchar: '-100!100', onBlur: "checkTempratureStart(this)" }, ctrlCss: { width: '35px', height: '20px' }, isRequired: true
           },
           {

               divRowNo: 1, name: 'EndTemperature', type: 'text', value: '', ctrlAttr: { controltype: 'range', maxlength: 4, allowchar: '-100!100', onBlur: "checkTempratureStart(this)" }, ctrlCss: { width: '35px', height: '20px' }, isRequired: true
           }
           ]
           },
            {
                name: 'GrossWt', display: 'Gross Wt', type: 'text', value: 9999999, ctrlCss: { width: '50px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 7, onBlur: "BindLocationTypeCtrl(this)" }, isRequired: false
            },
            {
                name: 'VolWt', display: 'CBM', type: 'text', value: 0, ctrlCss: { width: '50px', height: '20px' }, ctrlAttr: { controltype: 'decimal3', maxlength: 3, onBlur: "BindLocationTypeCtrl(this)" }, isRequired: false
            },
            {
                name: 'ULDCount', display: 'ULD Count', type: 'text', value: 0, ctrlCss: { width: '50px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 7, onBlur: "BindLocationTypeCtrl(this)" }, isRequired: false
            },
            {
                name: 'SkidCount', display: 'Skids Count', type: 'text', value: 0, ctrlCss: { width: '50px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 7, onBlur: "BindLocationTypeCtrl(this)" }, isRequired: false
            }

        ]
        , rowUpdateExtraFunction: function (id) {

            $("select[id^='tblRoom_TempControlled']").each(function (i, el) {
                var ind = $(this).attr('id').split('_')[2];
                $("#tblRoom_StartTemperature_" + ind).closest("table").find("td").removeClass("ui-widget-content");
                if ($("#tblRoom_TempControlled_" + ind + " option:checked").val() == 0) {
                    $("input[id*='tblRoom_StartTemperature_" + ind + "']").removeAttr("required").css("cursor", "not-allowed");
                    $("input[id*='tblRoom_EndTemperature_" + ind + "']").removeAttr("required").css("cursor", "not-allowed");
                    $("#tblRoom_StartTemperature_" + ind).data("kendoNumericTextBox").enable(false);
                    $("#tblRoom_EndTemperature_" + ind).data("kendoNumericTextBox").enable(false);
                    $("#tblRoom_StartTemperature_" + ind).data("kendoNumericTextBox").value(0);
                    $("#tblRoom_EndTemperature_" + ind).data("kendoNumericTextBox").value(0);
                } else {
                    $("input[id*='tblRoom_StartTemperature_" + ind + "']").attr("required", "required").css("cursor", "auto");;
                    $("input[id*='tblRoom_EndTemperature_" + ind + "']").attr("required", "required").css("cursor", "auto");
                    $("#tblRoom_StartTemperature_" + ind).data("kendoNumericTextBox").enable(true);
                    $("#tblRoom_EndTemperature_" + ind).data("kendoNumericTextBox").enable(true);
                    $("#tblRoom_StartTemperature_" + ind).data("kendoNumericTextBox").value($("#tblRoom_StartTemperature_" + ind).val());
                    $("#tblRoom_EndTemperature_" + ind).data("kendoNumericTextBox").value($("#tblRoom_EndTemperature_" + ind).val());
                }
            });
        },
        afterRowAppended: function (tbWhole, parentIndex, addedRows) {
            $("input[id^=tblRoom_StartTemperature]").each(function () {
                $(this).closest("table").find("td").removeClass("ui-widget-content");
            });
            $("input[id*=tblRoom_GrossWt]").each(function () {
                if ($(this).val() == "0") {
                    $(this).val("");
                }
                BindLocationTypeCtrl(this);
            });
            $("input[id*=tblRoom_VolWt]").each(function () {
                if ($(this).val() == "0.000") {
                    $(this).val("");
                }
                BindLocationTypeCtrl(this);
            });
            $("input[id*=tblRoom_ULDCount]").each(function () {
                if ($(this).val() == "0") {
                    $(this).val("");
                }
                BindLocationTypeCtrl(this);
            });
            $("input[id*=tblRoom_SkidCount]").each(function () {
                if ($(this).val() == "0") {
                    $(this).val("");
                }
                BindLocationTypeCtrl(this);
            });
        },
        dataLoaded: function () {
            $("input[id*=tblRoom_GrossWt]").each(function () {
                if ($(this).val() == "0")
                    $(this).val("");
            });
            $("input[id*=tblRoom_VolWt]").each(function () {
                if ($(this).val() == "0.000")
                    $(this).val("");
            });
            $("input[id*=tblRoom_ULDCount]").each(function () {
                if ($(this).val() == "0")
                    $(this).val("");
            });
            $("input[id*=tblRoom_SkidCount]").each(function () {
                if ($(this).val() == "0")
                    $(this).val("");
            });
        }
    });
}

function checkTempratureStart(obj) {
    var startVal = parseInt($(obj).closest("table").find("input[id^='tblRoom_StartTemperature']").val());
    var endVal = parseInt($(obj).closest("table").find("input[id^='tblRoom_EndTemperature']").val());
    if (startVal > endVal) {
        $(obj).val('');
        ShowMessage("warning", "", "End temperature should be greater than start temperature.");
    }
}

function ExtraCondition(a) {
    if ("Text_Area" == a)
        return a = cfi.getFilter("AND"), cfi.setFilter(a, "SNo", "notin", AreaArray.join(',')), filter = cfi.autoCompleteFilter(a);
    if ("Text_AgentForwarder" == a)
        return a = cfi.getFilter("AND"), cfi.setFilter(a, "AccountTypeSNo", "eq", 1), cfi.setFilter(a, "SNo", "notin", $("#AgentForwarder").val()), filter = cfi.autoCompleteFilter(a);
    if ("Text_Location" == a)
        return a = cfi.getFilter("AND"), cfi.setFilter(a, "SNo", "notin", $("#Location").val()), filter = cfi.autoCompleteFilter(a);
    if ("Text_Terminal" == a)
        return a = cfi.getFilter("AND"), cfi.setFilter(a, "SNo", "notin", $("#Terminal").val()), filter = cfi.autoCompleteFilter(a);
    if ("Text_DestCountry" == a)
        return a = cfi.getFilter("AND"), cfi.setFilter(a, "SNo", "notin", $("#DestCountry").val()), filter = cfi.autoCompleteFilter(a);
    if ("Text_DestCity" == a)
        return a = cfi.getFilter("AND"), cfi.setFilter(a, "SNo", "notin", $("#DestCity").val()), filter = cfi.autoCompleteFilter(a);
    if ("Text_SHC" == a)
        return a = cfi.getFilter("AND"), cfi.setFilter(a, "SNo", "notin", $("#SHC").val()), filter = cfi.autoCompleteFilter(a);
    if ("Text_MPieceNo" == a)
        return a = cfi.getFilter("AND"), cfi.setFilter(a, "AWBNo", "eq", $('#hdnAwbnoupdate').val()), cfi.setFilter(a, "IsImport", "eq", $('#hdnIsImport').val()), filter = cfi.autoCompleteFilter(a);
    if ("Text_SubLocation" == a)
        return a = cfi.getFilter("AND"), cfi.setFilter(a, "IsActive", "eq", "1"), filter = cfi.autoCompleteFilter(a);
    if ("Text_WarehouseName" == a)
        return a = cfi.getFilter("AND"), cfi.setFilter(a, "AirportSNo", "eq", $("#hdnAirportSNo").val()), filter = cfi.autoCompleteFilter(a);
    if ("Text_LSearch" == a)//Amit
        return a = cfi.getFilter("AND"), cfi.setFilter(a, "AirportSNo", "eq", userContext.AirportSNo), filter = cfi.autoCompleteFilter(a);
    if ("Text_WarehouseDetails_Search" == a)
        return a = cfi.getFilter("AND"), cfi.setFilter(a, "AirportSNo", "eq", userContext.AirportSNo), filter = cfi.autoCompleteFilter(a);
    if ("Text_WHTerminal" == a)
        return a = cfi.getFilter("AND"), cfi.setFilter(a, "AirportSNo", "eq", $("#hdnAirportSNo").val()), filter = cfi.autoCompleteFilter(a);

};

function onColorSelect(e) {
    selectedColor = e.item.text();
    $("#divColor").css("background-color", selectedColor);
}
var IshowLabel = true;
function ShowLabels(a) {
    $("div[rel='diveroor']").show("slow");
    IshowLabel = true;
};

function HideLabels(a) {
    $("div[rel='diveroor']").hide("slow");
    IshowLabel = false;
};

function SearchLocation() {
    $.ajax({
        url: 'HtmlFiles/Warehouse/WarehousePlanningSearch.html',
        success: function (result) {
            $("#divSearchWindow").html(result);
            $("#divSearchWindow").find("[id='Text_SearchBy']").css("text-transform", "uppercase");          //FOR UPPERCASE
            if (PageHints == 0) {
                if (!$("#divSearchWindow").data("kendoWindow"))
                    cfi.PopUp("divSearchWindow", "Search Location", "1200", null, SearchClose, 50);
                else
                    $("#divSearchWindow").data("kendoWindow").open();
            }
            BindSearchControls();
        }
    });
}
function SearchClose() {
    //location.reload();

}

function ClearAutoComplete() {
    cfi.ResetAutoComplete("Terminal_Search");
    cfi.ResetAutoComplete("Airline_Search");
    cfi.ResetAutoComplete("SHC_Search");
    cfi.ResetAutoComplete("DestCountry_Search");
    cfi.ResetAutoComplete("DestCity_Search");
    cfi.ResetAutoComplete("AgentForwarder_Search");
    cfi.ResetAutoComplete("Location_Search");
    cfi.ResetAutoComplete("Search");
    cfi.ResetAutoComplete("SearchAction");
    $("#Text_SearchAction").data("kendoAutoComplete").setDefaultValue("1", "SEARCH");
    if (PageHints == 1) {
        cfi.ResetAutoComplete("WarehouseDetails_Search");
        $("#Text_WarehouseDetails_Search").attr("placeholder", "ALL");
    }

    $('#Text_SearchBy').val('');
    $('#tblLocationSearch').html('');

}

function BindSearchControls() {
    cfi.AutoComplete("Terminal_Search", "TerminalName", "Terminal", "SNo", "TerminalName", ["TerminalName"], null, "contains");
    cfi.AutoComplete("Airline_Search", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");
    cfi.AutoComplete("SHC_Search", "Code", "SPHC", "SNo", "Code", ["Code"], null, "contains");
    cfi.AutoComplete("DestCountry_Search", "CountryName", "Country", "SNo", "CountryName", ["CountryName"], null, "contains");
    cfi.AutoComplete("DestCity_Search", "CityName", "City", "SNo", "CityName", ["CityName"], null, "contains");
    cfi.AutoComplete("AgentForwarder_Search", "Name", "vAccount", "SNo", "Name", ["Name"], null, "contains");
    cfi.AutoComplete("Location_Search", "LocationType", "WHLocationType", "SNo", "LocationType", ["LocationType"], null, "contains");

    var SearchAction = [{ Key: "1", Text: "SEARCH" }, { Key: "2", Text: "PENDING FOR LOCATION" }, { Key: "3", Text: "DOWNLOAD EXCEL" }];//, { Key: "4", Text: "CLEAR DATA" }, { Key: "4", Text: "DOLLY Number" }
    cfi.AutoCompleteByDataSource("SearchAction", SearchAction);
    $("#Text_SearchAction").data("kendoAutoComplete").setDefaultValue(1, "SEARCH");

    //Show warehouse rows on search warehouse and set up page hide tr windows
    if (PageHints == 1) {
        cfi.AutoComplete("WarehouseDetails_Search", "WarehouseName", "vWarehouseSetupGetList", "SNo", "WarehouseName", ["WarehouseName"], null, "contains");
        //$("#Text_WarehouseDetails_Search").data("kendoAutoComplete").setDefaultValue(userContext.WarehouseSNo, userContext.WarehouseName);
        $("#Text_WarehouseDetails_Search").attr("placeholder", "ALL");
    }
    else
        $('#trWarehouseSNo').css("display", "none");
    var SearchDataSource = [{ Key: "1", Text: "AWB NUMBER" }, { Key: "2", Text: "ULD NUMBER" }, { Key: "3", Text: "MOVABLE" }, { Key: "4", Text: "LOCATION NAME" }, { Key: "5", Text: "SLI NUMBER" }];
    cfi.AutoCompleteByDataSource("Search", SearchDataSource);
}

function SearchData() {
    // Warehouse cannot blank 
    //if (PageHints == 1) {
    //    if ($('#WarehouseDetails_Search').val() == '') {
    //        ShowMessage('info', 'Need your Kind Attention!', "Warehouse can not be blank");
    //        return false;
    //    }
    //    else
    //        warehouseSNo = PageHints == 1 ? $("#WarehouseDetails_Search").val() : warehouseSNo;
    //}
    cfi.ValidateSubmitSection("divSearchWindow");
    if (!cfi.IsValidSection($("#divSearchWindow"))) {
        return false;
    }

    var type = $("#SearchAction").val();//1-SEARCH, 2-PENDING FOR LOCATION, 3-DOWNLOAD EXCEL, 4-CLEAR DATA

    if (type == "4") {
        ClearAutoComplete();
        return false;
    }

    var WhSearchSNo = $("#WarehouseDetails_Search").val() || "0";

    if (type == "1" || type == "2")
    {
        BindLoactionSearchGrid();
        return false;
    }
        

    var obj = {
        Terminal: $("#Terminal_Search").val(),
        Airline: $("#Airline_Search").val(),
        SHC: $("#SHC_Search").val(),
        DestCountry: $("#DestCountry_Search").val(),
        DestCity: $("#DestCity_Search").val(),
        AgentForwarder: $("#AgentForwarder_Search").val(),
        Location: $("#Location_Search").val(),
        SubLocation: $("#Search").val() || 0,//Search By          
        SubAreaName: $("#Text_SearchBy").val(),//@SearchText
        WarehouseSNo: PageHints == 1 ? WhSearchSNo : warehouseSNo, // added by purushottam
        AirportSNo: userContext.AirportSNo
    }
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: type != "2" ? "Services/Warehouse/WarehousePlanningService.svc/SearchData" : "Services/Warehouse/WarehousePlanningService.svc/PendingLocationSearchData",
        data: JSON.stringify(obj),
        success: function (response) {
            if (response.length > 0) {
                if (type == "1" || type == "2")
                    BindLoactionSearchGrid(response, type);
                if (type == "3") {
                    var str = "<table>";
                    str += "<tr><td>Location Name</td><td>SPHC</td><td>AWBNo</td><td>Country Name</td><td>City Name</td><td>Terminal Name</td><td>Agent Name</td><td>Airline Name</td></tr>"
                    for (var i = 0; i < response.length; i++) {
                        str += "<tr><td>" + response[i].LocationName + "</td><td>" + response[i].SPHC + "</td><td>" + response[i].AWBNo + "</td><td>" + response[i].CountryName + "</td><td>" + response[i].CityName + "</td><td>" + response[i].TerminalName + "</td><td>" + response[i].AgentName + "</td><td>" + response[i].AirlineName + "</td></tr>"
                    }
                    str += "</table>";
                    var data_type = 'data:application/vnd.ms-excel';
                    var postfix = $("lblWarehouseName").text();
                    var a = document.createElement('a');
                    a.href = data_type + ', ' + str;
                    a.download = 'Warehouse' + postfix + '_.xls';
                    a.click();

                }
            }
            else {
                ShowMessage("info", "", "No Data Found...");
            }
        }
    });
}

// only for awbno click on lable 
function findAWBLocation(evtval, WHSetSNo) {
    if (WHSetSNo == '') {
        ShowMessage('info', 'Need your Kind Attention!', "No Location has been assign for this item.");
        return false;
    }
    PageLoaded(WHSetSNo);
    //var obj = {
    //    Terminal: $("#Terminal_Search").val(),
    //    Airline: $("#Airline_Search").val(),
    //    SHC: $("#SHC_Search").val(),
    //    DestCountry: $("#DestCountry_Search").val(),
    //    DestCity: $("#DestCity_Search").val(),
    //    AgentForwarder: $("#AgentForwarder_Search").val(),
    //    Location: $("#Location_Search").val(),
    //    SubLocation: "1",//Search By    
    //    SubAreaName: evtval,//@SearchText
    //    WarehouseSNo: WHSetSNo || warehouseSNo // added by purushottam PageHints == 1 ? $("#WarehouseDetails_Search").val()
    //}

    //$.ajax({
    //    type: "POST",
    //    contentType: "application/json; charset=utf-8",
    //    dataType: "json",
    //    url: "Services/Warehouse/WarehousePlanningService.svc/FindLocation",
    //    data: JSON.stringify(obj),
    //    success: function (response) {
    var response = evtval;
            $("#tblMatrix").parent().css("overflow", "auto").css("height", "580");
            var str = "";
            var err = "";
            if (response != "") {
                $("div[rel='diveroor']").hide();
                var ar = response.split(",");
                var stl = [];
                for (var i = 0; i < ar.length; i++) {
                    var td = $("td[rel='" + ar[i] + "']")[0];
                    err += "div[error-rel='" + ar[i] + "'],"
                    stl.push($(td).attr("style"));
                    str += "td[rel='" + ar[i] + "'],";
                }
                var cls = 0;
                var interval = setInterval(function () {
                    if (cls == 0) {
                        $(str).css("background-color", "yellow");
                        cls = 1;
                    } else {
                        $(str).css("background-color", "red");
                        cls = 0;
                    }

                }, 200);

                setTimeout(function () {
                    clearInterval(interval);
                    for (var i = 0; i < ar.length; i++) {
                        $("td[rel='" + ar[i] + "']").attr("style", stl[i]);
                        stl.push($(td).attr("style"));
                    }
                    $(err).show('slow');
                }, 2500);
                if ($("#divSearchWindow").data("kendoWindow"))
                    $("#divSearchWindow").data("kendoWindow").close();
            } else {
                ShowMessage("info", "", "No Data Found...");
                $('#tblLocationSearch').html('');
            }
    //    }
    //});
}

function FindLocation() {
    if (PageHints == 1) {
        if ($('#WarehouseDetails_Search').val() == '') {
            ShowMessage('info', 'Need your Kind Attention!', "Warehouse can not be blank");
            return false;
        }
        else
            warehouseSNo = PageHints == 1 ? $("#WarehouseDetails_Search").val() : warehouseSNo
        PageLoaded();
    }
    var obj = {
        Terminal: $("#Terminal_Search").val(),
        Airline: $("#Airline_Search").val(),
        SHC: $("#SHC_Search").val(),
        DestCountry: $("#DestCountry_Search").val(),
        DestCity: $("#DestCity_Search").val(),
        AgentForwarder: $("#AgentForwarder_Search").val(),
        Location: $("#Location_Search").val(),
        SubLocation: $("#Search").val() || 0,//Search By    
        SubAreaName: $("#Text_SearchBy").val(),//@SearchText
        WarehouseSNo: PageHints == 1 ? $("#WarehouseDetails_Search").val() : warehouseSNo // added by purushottam
    }

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "Services/Warehouse/WarehousePlanningService.svc/FindLocation",
        data: JSON.stringify(obj),
        success: function (response) {
            $("#tblMatrix").parent().css("overflow", "auto").css("height", "480");          //add scroll bar
            var str = "";
            var err = "";
            if (response != "") {
                $("div[rel='diveroor']").hide();
                var ar = response.split(",");
                var stl = [];
                for (var i = 0; i < ar.length; i++) {
                    var td = $("td[rel='" + ar[i] + "']")[0];
                    err += "div[error-rel='" + ar[i] + "'],"
                    stl.push($(td).attr("style"));
                    str += "td[rel='" + ar[i] + "'],";
                }
                var cls = 0;
                var interval = setInterval(function () {
                    if (cls == 0) {
                        $(str).css("background-color", "yellow");
                        cls = 1;
                    } else {
                        $(str).css("background-color", "red");
                        cls = 0;
                    }

                }, 200);

                setTimeout(function () {
                    clearInterval(interval);
                    for (var i = 0; i < ar.length; i++) {
                        $("td[rel='" + ar[i] + "']").attr("style", stl[i]);
                        stl.push($(td).attr("style"));
                    }
                    $(err).show('slow');
                }, 2500);

                if ($("#divSearchWindow").data("kendoWindow"))
                    $("#divSearchWindow").data("kendoWindow").close();

            } else {
                ShowMessage("info", "", "No Data Found...");
            }
        }
    });
}

function BindWhereCondition() {
    var WhereCondition = "1=1";
    WhereCondition += $("#Text_WarehouseDetails_Search").data("kendoAutoComplete").key() != "" ? " AND WHSetupSNo= " + $("#Text_WarehouseDetails_Search").data("kendoAutoComplete").key() : "";
    WhereCondition += $("#Text_Terminal_Search").data("kendoAutoComplete").key() != "" ? "AND TerminalSNo=" + $("#Text_Terminal_Search").data("kendoAutoComplete").key() : "";
    WhereCondition += $("#Text_Airline_Search").data("kendoAutoComplete").key() != "" ? "AND AirlineSNo=" + $("#Text_Airline_Search").data("kendoAutoComplete").key() : "";
    WhereCondition += $("#Text_SHC_Search").data("kendoAutoComplete").key() != "" ? "AND SHCSNo='" + $("#Text_SHC_Search").data("kendoAutoComplete").key() + "'" : "";
    WhereCondition += $("#Text_DestCountry_Search").data("kendoAutoComplete").key() != "" ? "AND DestinationCountrySNo='" + $("#Text_DestCountry_Search").data("kendoAutoComplete").key() + "'" : "";
    WhereCondition += $("#Text_DestCity_Search").data("kendoAutoComplete").key() != "" ? "AND DestinationCitySNo=" + $("#Text_DestCity_Search").data("kendoAutoComplete").key() : "";
    WhereCondition += $("#Text_AgentForwarder_Search").data("kendoAutoComplete").key() != "" ? "AND AccountSno=" + $("#Text_AgentForwarder_Search").data("kendoAutoComplete").key() : "";
    WhereCondition += $("#Text_Location_Search").data("kendoAutoComplete").key() != "" ? "AND WHTypeSNo=" + $("#Text_Location_Search").data("kendoAutoComplete").key() : "";
    
    if ($("#Text_Search").data("kendoAutoComplete").key() == "1" && $.trim($("#Text_SearchBy").val()) != "") {
        WhereCondition += " AND AWBNo='" + $.trim($("#Text_SearchBy").val()) + "'";
    }
    
    if ($("#Text_Search").data("kendoAutoComplete").key() == "2" && $.trim($("#Text_SearchBy").val()) != "") {
        WhereCondition += " AND ULDNo='" + $.trim($("#Text_SearchBy").val()) + "'";
    }

    if ($("#Text_Search").data("kendoAutoComplete").key() == "3" && $.trim($("#Text_SearchBy").val()) != "") {
        WhereCondition += " AND ConsumablesName='" + $.trim($("#Text_SearchBy").val()) + "'";
    }

    if ($("#Text_Search").data("kendoAutoComplete").key() == "4" && $.trim($("#Text_SearchBy").val()) != "") {
        WhereCondition += " AND LocationName='" + $.trim($("#Text_SearchBy").val()) + "'";
    }
    return WhereCondition;
}

var wCondition = "";
function BindLoactionSearchGrid() {
    wCondition = BindWhereCondition();
    var dbtableName = "tblLocationSearch";
    $("#" + dbtableName).appendGrid({
        tableID: dbtableName,
        currentPage: 1, itemsPerPage: 10, whereCondition: wCondition, sort: "",
        isPaging: true,
        isExtraPaging: true,
        isGetRecord: true,
        //hideRowNumColumn:true,
        contentEditable: pageType != 'READ',
        createUpdateServiceMethod: 'createUpdateLocationSearch',
        servicePath: './Services/Warehouse/WarehousePlanningService.svc',
        getRecordServiceMethod: 'SearchData',
        hideButtons: { updateAll: false, insert: false, append: true, remove: true, removeLast: true },
        caption: "Search Result",
        initRows: 1,
        masterTableSNo: 1,
        hideButtons: {
            remove: true,
            removeLast: true,
            insert: true,
            append: true,
            updateAll: true

        },
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
                    { name: 'AWBSNo', type: 'hidden', value: 0 },
                    { name: 'WHSetupSNo', type: 'hidden', value: 0 },
                    { name: 'IsImport', type: 'hidden', value: 0 },
                    { name: 'ConsumableSNo', type: 'hidden', value: 0 },
                    { name: 'SLISNo', type: 'hidden', value: 0 },
                    { name: 'WHSubAreaSNo', type: 'hidden', value: 0 },
            {
                name: 'LocationName', display: 'Location Name', type: 'label', ctrlAttr: { style: "text-transform:uppercase;" }
            },
            {
                name: 'WhLevel', display: 'Level', type: 'label'
            },
            {
                name: 'ConsumablesName', display: 'Movable', type: 'label', ctrlAttr: { style: "color:blue;cursor: pointer;cursor: hand" }, onClick: function (evt, rowIndex) {
                    bindhtmlMoveable(evt, rowIndex);
                }
            },
            {
                name: 'ULDNo', display: 'ULD No', type: 'label', ctrlAttr: { style: "color:blue;cursor: pointer;cursor: hand" }, onClick: function (evt, rowIndex) {
                    bindhtmlULDNo(evt, rowIndex);
                }
            },
             {
                 name: 'AWBNo', display: 'AWB No', type: 'label', ctrlAttr: { style: "color:blue;cursor: pointer;cursor: hand" }, onClick: function (evt, rowIndex) {
                     bindhtml(evt, rowIndex);//findAWBLocation($('#' + evt.currentTarget.id).html());
                 }
             },
             {
                 name: 'pieceno', display: 'Count of Pcs', value: 'L', type: 'button', onClick: function (evt, rowIndex) {
                     bindhtmlShowPiece(evt, rowIndex);
                 }
             },
            {
                name: 'Show', display: 'Show', value: 'L', type: 'button', onClick: function (evt, rowIndex) {
                    findAWBLocation($('#tblLocationSearch_WHSubAreaSNo_' + (rowIndex + 1)).val(), $('#tblLocationSearch_WHSetupSNo_' + (rowIndex + 1)).val());//bindhtml(evt, rowIndex);
                }, ctrlClass: 'incompleteprocess', ctrlAttr: { Title: 'Find Location' }
            },
           {
               name: 'SPHCCode', display: 'SHC', type: 'label'
           },
           {
               name: 'CountryName', display: 'Country Name', type: 'label'
           },
            {
                name: 'CityName', display: 'City Name', type: 'label'
            },
            {
                name: 'TerminalName', display: 'Terminal Name', type: 'label'
            }
            ,
            {
                name: 'AgentName', display: 'Agent Name', type: 'label'
            }
             ,
            {
                name: 'AirlineName', display: 'Airline Name', type: 'label'
            },             

        ]
    });
    //$("#" + dbtableName).appendGrid('load', data);

}

function rdStorableClick() {
    0 == $("input[name='IsStorable']:checked").val() ? ($("#Text_Location").removeAttr("data-valid"), $("#Text_SubLocation").removeAttr("data-valid"), $("tr[rel='trStorable']").hide(), $("div[rel='appendGrid']").hide()) : ($("tr[rel='trStorable']").show(), $("div[rel='appendGrid']").show(), $("#Text_Location").attr("data-valid", "required"), $("#Text_SubLocation").attr("data-valid", "required"));
};
function HideEmptyGridCells(obj) {
    if ($(obj).attr("value") == "Hide Grid") {
        $("td[rel='Empty']").css("border-color", "#FFFFFF");
        $(obj).attr("value", "Show Grid");
    } else {
        $("td[rel='Empty']").css("border-color", "#CCCCCC");
        $(obj).attr("value", "Hide Grid");
    }
}

function bindhtmlShowPiece(evt, rowIndex) {
    var res = "<table width='100%' class='WebFormTable'>" +
                "<tr>" +
                    "<td class='formlabel'>AWB No</td>" +
                    "<td class='formInputcolumn'><span id='spnAWBNO'></span></td>" +
                "</tr>" +
                "<tr>" +
                    "<td class='formlabel'>Location</td>" +
                    "<td class='formInputcolumn'><span id='spnLoc'></span></td>" +
                "</tr>" +
                "<tr>" +
                    "<td class='formlabel'>Piece No</td>" +
                    "<td class='formInputcolumn'><input type='hidden' id='hdnAwbnoupdate' /><input type='hidden' id='hdnLSearch' /><input type='hidden' id='hdnIsImport' /><input type='hidden' id='hdnSLISNo' /><input type='hidden' id='hdnAWBSNo' /><input type='hidden' id='hdnConsumableSNo' /><span id='spnPieceNo'></span></td>" +
                   "</tr>" +
            "</table>";
    $("#divSearchLocationUpdate").html('');
    $("#divSearchLocationUpdate").html(res);

    $('#hdnAwbnoupdate').val($('#' + evt.currentTarget.id.replace('tblLocationSearch_pieceno_', 'tblLocationSearch_AWBSNo_')).val());
    $('#hdnLSearch').val($('#' + evt.currentTarget.id.replace('tblLocationSearch_pieceno_', 'tblLocationSearch_SNo_')).val());
    $('#spnAWBNO').html($('#' + evt.currentTarget.id.replace('tblLocationSearch_pieceno_', 'tblLocationSearch_AWBNo_')).html());
    $('#spnLoc').html($('#' + evt.currentTarget.id.replace('tblLocationSearch_pieceno_', 'tblLocationSearch_LocationName_')).html().toUpperCase());
    $('#hdnIsImport').val($('#tblLocationSearch_IsImport_' + evt.data.uIndex).val());
    $('#hdnSLISNo').val($('#tblLocationSearch_SLISNo_' + evt.data.uIndex).val());
    $('#hdnAWBSNo').val($('#tblLocationSearch_AWBSNo_' + evt.data.uIndex).val());
    $("#hdnConsumableSNo").val($("#tblLocationSearch_ConsumableSNo_" + evt.data.uIndex).val());

    $.ajax({
        url: "./Services/Warehouse/LocationSearchService.svc/GetAWBNOLOCATionDetails",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            AWBNo: $('#hdnAwbnoupdate').val(),
            Location: $('#hdnLSearch').val(),
            IsImport: $('#tblLocationSearch_IsImport_' + evt.data.uIndex).val(),
            ConsumableSNo: $("#hdnConsumableSNo").val(),
            SLISNo: $("#hdnSLISNo").val()
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.length > 0) {
                var v = $.parseJSON(result);
                $('#spnPieceNo').html(v[0].pieceno);
            }
        },
        error: function (xhr) {
            var a = "";
        }
    });

    if (!$("#divSearchLocationUpdate").data("kendoWindow"))
        cfiPopUp("divSearchLocationUpdate", "Show Location", "900", null, null, 80);
    else
        $("#divSearchLocationUpdate").data("kendoWindow").open();

    //$(".k-overlay").remove();
}

function showPiceceValue() {
    if ($('#spnpicnomatch').html().length > 0) {
        $('#trPieceDetails').hide();
        $('#spnpicnomatch').html('');
    }
    else {
        $('#trPieceDetails').show();
        $('#spnpicnomatch').html($('#hdnspnpicnomatch').val());
    }
}

function DropDownBindLocation() {
    var evt = $('#hdnevt').val();
    $.ajax({
        url: "./Services/Warehouse/LocationSearchService.svc/GetAWBNOLOCATionDetails",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            AWBNo: $('#hdnAWBSNo').val(),
            Location: $('#LSearch').val().split(',')[0],
            IsImport: $('#hdnIsImport').val(),
            ConsumableSNo: $("#hdnConsumableSNo").val(),
            SLISNo: $("#hdnSLISNo").val()
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.length > 0) {
                var v = $.parseJSON(result);
                $('#hdnspnpicnomatch').val(v[0].pieceno);
                $('#spnPieceCount').html(v[0].pieceno == '' ? 0 : v[0].pieceno.split(',').length);
                $('#spnpicnomatch').html('');
                LiColorChange();
            }
        },
        error: function (xhr) {
            var a = "";
        }
    });
}

function DropDownBind() {
    var evt = $('#hdnevt').val();
    $.ajax({
        url: "./Services/Warehouse/LocationSearchService.svc/GetAWBNOLOCATionDetails",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            AWBNo: $('#' + evt.replace('tblLocationSearch_AWBNo_', 'tblLocationSearch_AWBSNo_')).val(),
            Location: $('#' + evt.replace('tblLocationSearch_AWBNo_', 'tblLocationSearch_SNo_')).val(),
            IsImport: $('#' + evt.replace('tblLocationSearch_AWBNo_', 'tblLocationSearch_IsImport_')).val(),
            ConsumableSNo: $('#' + evt.replace('tblLocationSearch_AWBNo_', 'tblLocationSearch_ConsumableSNo_')).val(),
            SLISNo: $('#' + evt.replace('tblLocationSearch_AWBNo_', 'tblLocationSearch_SLISNo_')).val()
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.length > 0) {
                var v = $.parseJSON(result);
                $('#hdnspnpicnomatch').val(v[0].pieceno);
                $('#spnPieceCount').html(v[0].pieceno == '' ? 0 : v[0].pieceno.split(',').length);
                $('#spnpicnomatch').html('');
                LiColorChange();
            }
        },
        error: function (xhr) {
            var a = "";
        }
    });
}

function BindLiColorChange() {
    setTimeout(function () { LiColorChange(); }, 800);
}

function LiColorChange() {
    var arr = $("div[id='divMultiMPieceNo']").find('li span.k-icon').map(function () { return $(this).attr("id") }).get();
    var saveVAlue = $('#hdnspnpicnomatch').val().split(',');
    for (var v = 0; arr.length > v; v++) {
        var match = 0;
        for (var svalue = 0; saveVAlue.length > svalue; svalue++) {
            if (arr[v].trim() == saveVAlue[svalue].trim()) {
                match = 1
                break;
            }

        }
        if (match == 1)
            $("span[id='" + arr[v] + "']").closest('li').css("background-color", "red");
        else
            $("span[id='" + arr[v] + "']").closest('li').css("background-color", "green");
    }
}

function bindhtml(evt, rowIndex) {
    var res = "<table width='100%' class='WebFormTable'><tr>" +
                            "<td class='formlabel'>AWB No</td><td class='formInputcolumn'><span id='spnAWBNO'></span><input type='hidden' id='hdnevt' value='" + evt.currentTarget.id + "' /></td>" +
                            "<td class='formlabel'><font color='red'>*</font>Location</td><td class='formInputcolumn'><input type='hidden' id='hdnAwbnoupdate' /><input type='hidden' id='LSearch' name='LSearch'><input type='hidden' id='hdnIsImport' /><input type='hidden' id='hdnSLISNo' /><input type='hidden' id='hdnConsumableSNo' /><input type='hidden' id='hdnAWBSNo' /><input type='text'  name='Text_LSearch' id='Text_LSearch' data-role='autocomplete' controltype='autocomplete' data-valid='' data-valid-msg=''> </td>" +
                        "</tr><tr>" +
                            "<td class='formlabel'>Pieces at Location</td><td class='formInputcolumn'><a onclick='showPiceceValue()'>" +
                                "<span id='spnPieceCount' style='color:blue;cursor: pointer;cursor: hand'></span></a></td>" +
                            "<td class='formlabel'><font color='red'>*</font>Piece No</td><td class='formInputcolumn'><input type='hidden' id='MPieceNo' name='MPieceNo'><input type='text' name='Text_MPieceNo' id='Text_MPieceNo' data-role='autocomplete' controltype='autocomplete' data-valid='required' data-valid-msg='select M Piece'><input type='checkbox' id='chkAllPieces'>ALL <input type='hidden' id='hdnspnpicnomatch' /></td>" +
                        "</tr><tr id='trPieceDetails'>" +
                              "<td class='formlabel'>Piece Details</td><td class='formInputcolumn' style='word-wrap: break-word;'><span id='spnpicnomatch'></span></td>" +
                              "<td class='formlabel'></td><td class='formInputcolumn'></td>" +
                        "</tr><tr>" +
                        "<td class='formlabel'></td><td class='formInputcolumn'></td>" +
                       "<td class='formlabel'></td><td class='formInputcolumn'><input id='updateRecord' type='button' value='Update' onclick='UpdateRecord()' /> </td>" +
                       "</tr></table>";
    $("#divSearchLocationUpdate").html('');
    $("#divSearchLocationUpdate").html(res);
    $('#trPieceDetails').hide();
    DropDownBind();
    $("#PieceSelect").css("vertical-align", "middle");
    $('#hdnAwbnoupdate').val($('#' + evt.currentTarget.id.replace('tblLocationSearch_Show_', 'tblLocationSearch_AWBNo_')).html());
    $('#hdnIsImport').val($('#tblLocationSearch_IsImport_' + evt.data.uIndex).val());
    $('#hdnSLISNo').val($('#tblLocationSearch_SLISNo_' + evt.data.uIndex).val());
    $('#hdnAWBSNo').val($('#tblLocationSearch_AWBSNo_' + evt.data.uIndex).val());
    $('#spnAWBNO').html($('#hdnAwbnoupdate').val());
    $("#hdnConsumableSNo").val($("#tblLocationSearch_ConsumableSNo_" + evt.data.uIndex).val());
    cfi.AutoComplete("LSearch", "LocationName", "vWHLocationSearch", "SNoWithPrefix", "LocationName", ["LocationName"], DropDownBindLocation, "contains");
    cfi.AutoComplete("MPieceNo", "PieceNo", "v_AWBSubProcessTrans", "PieceNo", "PieceNo", ["PieceNo"], BindLiColorChange, "contains", ",");//, true, null, null, null, true, null
    cfi.ResetAutoComplete("MPieceNo");

    $("#Text_LSearch").data("kendoAutoComplete").setDefaultValue($('#' + evt.currentTarget.id.replace('tblLocationSearch_AWBNo_', 'tblLocationSearch_SNo_')).val() + ",L", $('#' + evt.currentTarget.id.replace('tblLocationSearch_AWBNo_', 'tblLocationSearch_LocationName_')).html());

    var SkillDataField = ($('#MPieceNo').val());
    var SkillDataText = ($('#Text_MPieceNo').val());
    $('#Text_MPieceNo')[0].defaultValue = '';
    $('#Text_MPieceNo')[0].Value = '';
    $('#Text_MPieceNo').val('');
    $('#Multi_MPieceNo').val(SkillDataField);
    $('#FieldKeyValuesMPieceNo')[0].innerHTML = SkillDataField;
    var i = 0;
    if (SkillDataField.split(',').length > 0) {
        while (i < SkillDataField.split(',').length) {
            if (SkillDataField.split(',')[i] != '')
                $('#divMultiMPieceNo').find('ul').append("<li class='k-button' style='margin-right: 3px; margin-bottom: 3px;'><span>" + SkillDataText.split(',')[i] + "</span><span class='k-icon k-delete' id='" + SkillDataField.split(',')[i] + "'></span></li>");
            i++;
        }
        $("#divMultiMPieceNo").css("display", "block");
    }

    if (!$("#divSearchLocationUpdate").data("kendoWindow"))
        cfiPopUp("divSearchLocationUpdate", "Location Update", "900", null, null, 80);
    else
        $("#divSearchLocationUpdate").data("kendoWindow").open();

}

function UpdateRecord() {
    if ($('#LSearch').val() == 0) {
        ShowMessage('info', 'Need your Kind Attention!', "Please select Location");
        return false;
    }
    if ($('#Multi_MPieceNo').val() == 0 && !$('#chkAllPieces').is(":Checked")) {
        ShowMessage('info', 'Need your Kind Attention!', "Please select Piece");
        return false;
    }
    $.ajax({
        url: "./Services/Warehouse/LocationSearchService.svc/UpdateLocationDetails",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            AWBNo: $('#hdnAwbnoupdate').val(),
            MPIECE: $('#Multi_MPieceNo').val(),
            Location: $('#LSearch').val(),
            IsImport: $("#hdnIsImport").val(),
            SLISNo: $("#hdnSLISNo").val(),
            UserSNo: userContext.UserSNo,
            AllPcs: $('#chkAllPieces').is(":Checked")
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.length > 0) {
                var v = $.parseJSON(result);
                if (v[0].Message == 0) {
                    ShowMessage('success', 'Success!', "Location Updated Successfully.");
                    SearchData('Search');
                    $("#divSearchLocationUpdate").data("kendoWindow").close();
                }
                else
                    ShowMessage('info', 'Need your Kind Attention!', "Location Not Updated.");
            }
        },
        error: function (xhr) {
            var a = "";
        }
    });
}

var cfiPopUp = function (cntrlId, title, width, OnOpen, OnClose, topPosition) {

    var Kwindow = $("#" + cntrlId);

    if (!Kwindow.data("kendoWindow")) {
        Kwindow.kendoWindow({
            appendTo: "form#aspnetForm",
            width: ((width == null || width == undefined || width == "") ? "800px" : width + "px"),
            actions: ["Minimize", "Close"],
            draggable: false,
            title: title,
            modal: true,
            maxHeight: 500,
            close: (OnClose == undefined ? null : OnClose),
            open: (OnOpen == undefined ? null : OnOpen)
        });
        Kwindow.data("kendoWindow").open();
    }
    else {
        Kwindow.data("kendoWindow").open();
    }
    $(document).bind("keydown", function (e) {
        if (e.keyCode == kendo.keys.ESC) {
            var visibleWindow = $(".k-window:visible:last");
            if (visibleWindow.length)
                visibleWindow.data("kendoWindow").close();
        }
    });

    Kwindow.data("kendoWindow").center();

    $("#" + cntrlId).closest(".k-window").css({
        position: 'fixed',
        top: '5%'
    });
    return false;
}

function bindhtmlMoveable(evt, rowIndex) {
    var res = "<table width='100%' class='WebFormTable'><tr>" +
                            "<td class='formlabel'>Movable Name</td><td class='formInputcolumn'><span id='spnMoveable'></span><input type='hidden' id='hdnevt' value='" + evt.currentTarget.id + "' /></td>" +
                            "<td class='formlabel'><font color='red'>*</font>Location</td><td class='formInputcolumn'><input type='hidden' id='hdnMoveableupdate' /><input type='hidden' id='LSearch' name='LSearch'><input type='text'  name='Text_LSearch' id='Text_LSearch' data-role='autocomplete' controltype='autocomplete' data-valid='' data-valid-msg=''> </td>" +
                        "</tr><tr>" +
                        "<td class='formlabel'></td><td class='formInputcolumn'></td>" +
                       "<td class='formlabel'></td><td class='formInputcolumn'><input id='updateMoveableRecord' type='button' value='Update' onclick='UpdateMoveableRecord()' /> </td>" +
                       "</tr></table>";
    $("#divSearchLocationUpdate").html('');
    $("#divSearchLocationUpdate").html(res);
    $('#hdnMoveableupdate').val($('#' + evt.currentTarget.id).html());
    $('#spnMoveable').html($('#hdnMoveableupdate').val());
    cfi.AutoComplete("LSearch", "LocationName", "vwarelocation", "SNo", "LocationName", ["LocationName"], null, "contains");

    $("#Text_LSearch").data("kendoAutoComplete").setDefaultValue($('#' + evt.currentTarget.id.replace('tblLocationSearch_ConsumablesName_', 'tblLocationSearch_SNo_')).val(), $('#' + evt.currentTarget.id.replace('tblLocationSearch_ConsumablesName_', 'tblLocationSearch_LocationName_')).html());

    if (!$("#divSearchLocationUpdate").data("kendoWindow"))
        cfiPopUp("divSearchLocationUpdate", "Location Update", "900", null, null, 80);
    else
        $("#divSearchLocationUpdate").data("kendoWindow").open();




}

function UpdateMoveableRecord() {
    if ($('#LSearch').val() == 0) {
        ShowMessage('info', 'Need your Kind Attention!', "Please select Location");
        return false;
    }

    $.ajax({
        url: "./Services/Warehouse/LocationSearchService.svc/UpdateMoveableLocationDetails",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            ConsumablesName: $('#hdnMoveableupdate').val(),
            Location: $('#LSearch').val()
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.length > 0) {
                var v = $.parseJSON(result);
                if (v[0].Message == 0) {
                    ShowMessage('success', 'Success!', "Location Updated Successfully.");
                    SearchData('Search');
                    $("#divSearchLocationUpdate").data("kendoWindow").close();
                }
                else
                    ShowMessage('info', 'Need your Kind Attention!', "Location Not Updated.");
            }
        },
        error: function (xhr) {
            var a = "";
        }
    });
}

function bindhtmlULDNo(evt, rowIndex) {
    var res = "<table width='100%' class='WebFormTable'><tr>" +
                            "<td class='formlabel'>ULD No.</td><td class='formInputcolumn'><span id='spnULDNo'></span><input type='hidden' id='hdnevt' value='" + evt.currentTarget.id + "' /></td>" +
                            "<td class='formlabel'><font color='red'>*</font>Location</td><td class='formInputcolumn'><input type='hidden' id='hdnULDNoupdate' /><input type='hidden' id='LSearch' name='LSearch'><input type='text'  name='Text_LSearch' id='Text_LSearch' data-role='autocomplete' controltype='autocomplete' data-valid='' data-valid-msg=''> </td>" +
                        "</tr><tr>" +
                        "<td class='formlabel'></td><td class='formInputcolumn'></td>" +
                       "<td class='formlabel'></td><td class='formInputcolumn'><input id='updateULDNoRecord' type='button' value='Update' onclick='UpdateULDNoRecord()' /> </td>" +
                       "</tr></table>";
    $("#divSearchLocationUpdate").html('');
    $("#divSearchLocationUpdate").html(res);
    $('#hdnULDNoupdate').val($('#' + evt.currentTarget.id).html());
    $('#spnULDNo').html($('#hdnULDNoupdate').val());
    cfi.AutoComplete("LSearch", "LocationName", "vwarelocation", "SNo", "LocationName", ["LocationName"], null, "contains");

    $("#Text_LSearch").data("kendoAutoComplete").setDefaultValue($('#' + evt.currentTarget.id.replace('tblLocationSearch_ULDNo_', 'tblLocationSearch_SNo_')).val(), $('#' + evt.currentTarget.id.replace('tblLocationSearch_ULDNo_', 'tblLocationSearch_LocationName_')).html());

    if (!$("#divSearchLocationUpdate").data("kendoWindow"))
        cfiPopUp("divSearchLocationUpdate", "Location Update", "900", null, null, 20);
    else
        $("#divSearchLocationUpdate").data("kendoWindow").open();




}

function UpdateULDNoRecord() {
    if ($('#LSearch').val() == 0) {
        ShowMessage('info', 'Need your Kind Attention!', "Please select Location");
        return false;
    }

    $.ajax({
        url: "./Services/Warehouse/LocationSearchService.svc/UpdateULDLocationDetails",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            ULDNo: $('#hdnULDNoupdate').val(),
            Location: $('#LSearch').val()
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.length > 0) {
                var v = $.parseJSON(result);
                if (v[0].Message == 0) {
                    ShowMessage('success', 'Success!', "Location Updated Successfully.");
                    SearchData('Search');
                    $("#divSearchLocationUpdate").data("kendoWindow").close();
                }
                else
                    ShowMessage('info', 'Need your Kind Attention!', "Location Not Updated.");
            }
        },
        error: function (xhr) {
            var a = "";
        }
    });
}

function CreateLocation() {
    $.ajax({
        url: 'HtmlFiles/Warehouse/WarehousePlanningSearch.html',
        success: function (result) {
            $("#divSearchWindow").html(result);
            $("#Text_SearchAction").hide();
            $("#btnSearch").hide();
            $("#Text_DestCity_Search").closest("tr").css("border-bottom", "ridge");
            $("#Text_Search").closest("tr").find("td:gt(1)").hide();
            $("#btnSearch").before("<input type='button' style='font-size:10px; id='btnLocation' value='Fetch Location' class='ui-button ui-widget ui-state-default ui-corner-all ui-state-hover' onclick='CreateLocationSearchData(" + '"Location"' + ")'> &nbsp;&nbsp;");
            $("#btnSearch").after("<input type='button' style='font-size:10px; id='btnLocation' value='Download Locations' class='ui-button ui-widget ui-state-default ui-corner-all ui-state-hover' onclick='CreateLocationSearchDataExcel(" + '"Location"' + ")'> &nbsp;&nbsp;");

            $("#divSearchWindow").find("[id='Text_SearchBy']").css("text-transform", "uppercase");          //FOR UPPERCASE
            if (PageHints == 0) {
                if (!$("#divSearchWindow").data("kendoWindow"))
                    cfi.PopUp("divSearchWindow", "Search Location", "1000", null, SearchClose, 50);
                else
                    $("#divSearchWindow").data("kendoWindow").open();
            }
            BindSearchControls();
        }
    });

}


function CreateLocationSearchData(type) {

    var WhSearchSNo = $("#WarehouseDetails_Search").val() || "0";
    var obj = {
        Terminal: $("#Terminal_Search").val(),
        Airline: $("#Airline_Search").val(),
        SHC: $("#SHC_Search").val(),
        DestCountry: $("#DestCountry_Search").val(),
        DestCity: $("#DestCity_Search").val(),
        AgentForwarder: $("#AgentForwarder_Search").val(),
        Location: $("#Location_Search").val(),
        SubLocation: $("#Search").val() || 0,//Search By          
        SubAreaName: $("#Text_SearchBy").val(),//@SearchText
        WarehouseSNo: PageHints == 1 ? WhSearchSNo : warehouseSNo,
        AirportSNo: userContext.AirportSNo
    }
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "Services/Warehouse/WarehousePlanningService.svc/CreateLocationSearchData",
        data: JSON.stringify(obj),
        success: function (response) {
            if (response.length > 0) {
                BindCreateLocationSearchData(response, type);
                if (type == "Excel") {
                    var str = "<table>";
                    str += "<tr><td>Location Name</td><td>SPHC</td><td>AWBNo</td><td>Country Name</td><td>City Name</td><td>Terminal Name</td><td>Agent Name</td><td>Airline Name</td></tr>"
                    for (var i = 0; i < response.length; i++) {
                        str += "<tr><td>" + response[i].LocationName + "</td><td>" + response[i].SPHC + "</td><td>" + response[i].AWBNo + "</td><td>" + response[i].CountryName + "</td><td>" + response[i].CityName + "</td><td>" + response[i].TerminalName + "</td><td>" + response[i].AgentName + "</td><td>" + response[i].AirlineName + "</td></tr>"
                    }
                    str += "</table>";
                    var data_type = 'data:application/vnd.ms-excel';
                    var postfix = $("lblWarehouseName").text();
                    var a = document.createElement('a');
                    a.href = data_type + ', ' + str;
                    a.download = 'Warehouse' + postfix + '_.xls';
                    a.click();

                }
            }
            else {
                ShowMessage("info", "", "No Data Found...");
            }
        }
    });
}


function CreateLocationSearchDataExcel(type) {

    var WhSearchSNo = $("#WarehouseDetails_Search").val() || "0";
    var obj = {
        Terminal: $("#Terminal_Search").val(),
        Airline: $("#Airline_Search").val(),
        SHC: $("#SHC_Search").val(),
        DestCountry: $("#DestCountry_Search").val(),
        DestCity: $("#DestCity_Search").val(),
        AgentForwarder: $("#AgentForwarder_Search").val(),
        Location: $("#Location_Search").val(),
        SubLocation: $("#Search").val() || 0,//Search By          
        SubAreaName: $("#Text_SearchBy").val(),//@SearchText
        WarehouseSNo: PageHints == 1 ? WhSearchSNo : warehouseSNo,
        AirportSNo: userContext.AirportSNo
    }
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "Services/Warehouse/WarehousePlanningService.svc/CreateLocationSearchData",
        data: JSON.stringify(obj),
        success: function (response) {
            if (response.length > 0) {


                var str = "<html><table  style='width:90%;'><tr font-size:12pt;font-family:Arial'><td align=\"left\" colspan='9'><b>SHARJAH AVIATION SERVICES</b></td></tr><tr font-size:12pt;font-family:Arial'><td align=\"center\"  colspan='9'><b>Warehouse Location</b></td></tr></table> "


                str += "<br/><table style='width:90%;'  border=\"1px\">";

                str += "<tr font-size:10pt;font-family:Arial'><td align=\"center\" ><b>Location Name</b></td><td align=\"center\" ><b>Level</b></td><td align=\"center\" ><b>SHC</b></td><td align=\"center\" ><b>Dest Country</b></td><td align=\"center\" ><b>Dest City</b></td><td align=\"center\" ><b>Terminal Name</b></td><td align=\"center\" ><b>Agent Name</b></td><td align=\"center\" ><b>Airline Name</b></td><td align=\"center\" ><b>Location Type</b></td></tr>"
                for (var i = 0; i < response.length; i++) {
                    str += "<tr><td>" + response[i].LocationName + "&nbsp;</td><td>" + response[i].WhLevel + "</td><td>" + response[i].SPHC + "&nbsp;</td><td>" + response[i].CountryName + "&nbsp;</td><td>" + response[i].CityName + "&nbsp;</td><td>" + response[i].TerminalName + "&nbsp;</td><td>" + response[i].AgentName + "&nbsp;</td><td>" + response[i].AirlineName + "&nbsp;</td><td>" + response[i].LocationType + "&nbsp;</td></tr>"
                }
                str += "</table></html>";
                var data_type = 'data:application/vnd.ms-excel';
                var postfix = $("lblWarehouseName").text();
                var a = document.createElement('a');
                a.href = data_type + ' , ' + encodeURIComponent(str);
                a.download = 'Warehouse' + postfix + '_.xls';
                a.click();


            }
            else {
                ShowMessage("info", "", "No Data Found...");
            }
        }
    });
}


function BindCreateLocationSearchData(data, type) {
    var dbtableName = "tblLocationSearch";

    $("#" + dbtableName).appendGrid({
        tableID: dbtableName,
        currentPage: 1, itemsPerPage: 10, whereCondition: null, sort: "",
        //isPaging:true,
        isGetRecord: false,
        //hideRowNumColumn:true,

        hideButtons: { updateAll: true, insert: true, append: true, remove: true, removeLast: true },
        caption: "Search Result",
        initRows: 1,
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
            { name: 'WHSetupSNo', type: 'hidden', value: 0 },
            {
                name: 'LocationName', display: 'Location Name', type: 'label', onClick: function (evt, rowIndex) {
                    findNameLocation($('#tblLocationSearch_LocationName_' + (rowIndex + 1)).html(), $('#tblLocationSearch_WHSetupSNo_' + (rowIndex + 1)).val(), type);//bindhtml(evt, rowIndex);
                }, ctrlAttr: { style: "text-transform:uppercase; color:blue;cursor: pointer;cursor: hand" }
            },
            {
                name: 'WhLevel', display: 'Level', type: 'label'
            },
            {
                name: 'SPHC', display: 'SHC', type: 'label'
            },
            {
                name: 'CountryName', display: 'Dest Country', type: 'label'
            },
            {
                name: 'CityName', display: 'Dest City', type: 'label'
            },
            {
                name: 'TerminalName', display: 'Terminal Name', type: 'label'
            }
            ,
            {
                name: 'AgentName', display: 'Agent Name', type: 'label', ctrlAttr: { style: "text-transform:uppercase;" }
            }
             ,
            {
                name: 'AirlineName', display: 'Airline Name', type: 'label'
            },
            {
                name: 'LocationType', display: 'Location Type', type: 'label'
            }

        ]
    });
    $("#" + dbtableName).appendGrid('load', data);
}

function findNameLocation(evtval, WHSetSNo, type) {
    if (WHSetSNo == '') {
        ShowMessage('info', 'Need your Kind Attention!', "No Location has been assign for this item.");
        return false;
    }
    PageLoaded(WHSetSNo);
    var obj = {
        Terminal: $("#Terminal_Search").val(),
        Airline: $("#Airline_Search").val(),
        SHC: $("#SHC_Search").val(),
        DestCountry: $("#DestCountry_Search").val(),
        DestCity: $("#DestCity_Search").val(),
        AgentForwarder: $("#AgentForwarder_Search").val(),
        Location: $("#Location_Search").val(),
        SubLocation: type == "Location" ? "9" : "1",//Search By    
        SubAreaName: evtval,//@SearchText
        WarehouseSNo: PageHints == 1 ? $("#WarehouseDetails_Search").val() : warehouseSNo // added by purushottam
    }

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "Services/Warehouse/WarehousePlanningService.svc/FindNameLocation",
        data: JSON.stringify(obj),
        success: function (response) {
            var str = "";
            var err = "";
            if (response != "") {
                $("div[rel='diveroor']").hide();
                var ar = response.split(",");
                var stl = [];
                for (var i = 0; i < ar.length; i++) {
                    var td = $("td[rel='" + ar[i] + "']")[0];
                    err += "div[error-rel='" + ar[i] + "'],"
                    stl.push($(td).attr("style"));
                    str += "td[rel='" + ar[i] + "'],";
                }
                var cls = 0;
                var interval = setInterval(function () {
                    if (cls == 0) {
                        $(str).css("background-color", "yellow");
                        cls = 1;
                    } else {
                        $(str).css("background-color", "red");
                        cls = 0;
                    }

                }, 200);

                setTimeout(function () {
                    clearInterval(interval);
                    for (var i = 0; i < ar.length; i++) {
                        $("td[rel='" + ar[i] + "']").attr("style", stl[i]);
                        stl.push($(td).attr("style"));
                    }
                    $(err).show('slow');
                }, 2500);
                if ($("#divSearchWindow").data("kendoWindow"))
                    $("#divSearchWindow").data("kendoWindow").close();
            } else {
                ShowMessage("info", "", "No Data Found...");
                $('#tblLocationSearch').html('');
            }
        }
    });
}

function BindLocationTypeCtrl(that) {
    var objId = $(that).attr("id");
    var objName = objId.split("_")[1].toLowerCase();

    var objGrossWt, objVolWt, objULDCount, objSkidCount;

    if (objName == "grosswt") {
        objGrossWt = objId;
        objVolWt = objId.replace("GrossWt", "VolWt");
        objULDCount = objId.replace("GrossWt", "ULDCount");
        objSkidCount = objId.replace("GrossWt", "SkidCount");
    }
    else if (objName == "volwt") {
        objGrossWt = objId.replace("VolWt", "GrossWt");
        objVolWt = objId;
        objULDCount = objId.replace("VolWt", "ULDCount");
        objSkidCount = objId.replace("VolWt", "SkidCount");
    }
    else if (objName == "uldcount") {
        objGrossWt = objId.replace("ULDCount", "GrossWt");
        objVolWt = objId.replace("ULDCount", "VolWt");
        objULDCount = objId;
        objSkidCount = objId.replace("ULDCount", "SkidCount");
    }
    else if (objName == "skidcount") {
        objGrossWt = objId.replace("SkidCount", "GrossWt");
        objVolWt = objId.replace("SkidCount", "VolWt");
        objULDCount = objId.replace("SkidCount", "ULDCount");
        objSkidCount = objId;
    }



    if (objName == "grosswt" && $(that).val() != "") {
        // $("#" + objVolWt).data("kendoNumericTextBox").value("");
        $("#" + objULDCount).data("kendoNumericTextBox").value("");
        $("#" + objSkidCount).data("kendoNumericTextBox").value("");

        $("#" + objVolWt).attr("required", "required");
        $("#" + objULDCount).removeAttr("required");
        $("#" + objSkidCount).removeAttr("required");
        $("#_temp" + objULDCount).removeAttr("required");
        $("#_temp" + objSkidCount).removeAttr("required");
    }
    else if (objName == "volwt" && $(that).val() != "") {
        //$("#" + objGrossWt).data("kendoNumericTextBox").value("");
        $("#" + objULDCount).data("kendoNumericTextBox").value("");
        $("#" + objSkidCount).data("kendoNumericTextBox").value("");

        $("#" + objGrossWt).attr("required", "required");
        $("#" + objULDCount).removeAttr("required");
        $("#" + objSkidCount).removeAttr("required");
        $("#_temp" + objULDCount).removeAttr("required");
        $("#_temp" + objSkidCount).removeAttr("required");
    }
    else if (objName == "uldcount" && $(that).val() != "") {
        $("#" + objGrossWt).data("kendoNumericTextBox").value("");
        $("#" + objVolWt).data("kendoNumericTextBox").value("");
        $("#" + objSkidCount).data("kendoNumericTextBox").value("");

        $("#" + objGrossWt).removeAttr("required");
        $("#" + objVolWt).removeAttr("required");
        $("#" + objSkidCount).removeAttr("required");
        $("#_temp" + objGrossWt).removeAttr("required");
        $("#_temp" + objVolWt).removeAttr("required");
        $("#_temp" + objSkidCount).removeAttr("required");
    }
    else if (objName == "skidcount" && $(that).val() != "") {
        $("#" + objGrossWt).data("kendoNumericTextBox").value("");
        $("#" + objVolWt).data("kendoNumericTextBox").value("");
        $("#" + objULDCount).data("kendoNumericTextBox").value("");

        $("#" + objGrossWt).removeAttr("required");
        $("#" + objVolWt).removeAttr("required");
        $("#" + objULDCount).removeAttr("required");
        $("#_temp" + objGrossWt).removeAttr("required");
        $("#_temp" + objVolWt).removeAttr("required");
        $("#_temp" + objULDCount).removeAttr("required");
    }

    if (($("#" + objGrossWt).val() == "" || $("#" + objVolWt).val() == "") && $("#" + objULDCount).val() == "" && $("#" + objSkidCount).val() == "") {
        $("#" + objGrossWt).attr("required", "required");
        $("#" + objVolWt).attr("required", "required");
        $("#" + objULDCount).attr("required", "required");
        $("#" + objSkidCount).attr("required", "required");
        return;
    }

    if (($("#" + objGrossWt).val() == "0" || $("#" + objVolWt).val() == "0") && $("#" + objULDCount).val() == "0" && $("#" + objSkidCount).val() == "0") {
        $("#" + objGrossWt).data("kendoNumericTextBox").value("");
        $("#" + objVolWt).data("kendoNumericTextBox").value("");
        $("#" + objULDCount).data("kendoNumericTextBox").value("");
        $("#" + objSkidCount).data("kendoNumericTextBox").value("");

        $("#" + objGrossWt).attr("required", "required");
        $("#" + objVolWt).attr("required", "required");
        $("#" + objULDCount).attr("required", "required");
        $("#" + objSkidCount).attr("required", "required");
        return;
    }
}