var pageType = 'READ1';
$(document).ready(function () {
    BindSearchControls();
    
});
function SearchData_Excel()
{
    SearchData('Excel');
}

function SearchData_Data()
{
    //SearchData('Search');
    BindLoactionSearchGrid();
}
function BindSearchControls() {
    cfi.AutoComplete("Terminal_Search", "TerminalName", "Terminal", "SNo", "TerminalName", ["TerminalName"], null, "contains");
    cfi.AutoComplete("Airline_Search", "AirlineName", "Airline", "SNo", "AirlineName", ["AirlineCode", "AirlineName"], null, "contains");
    cfi.AutoComplete("SHC_Search", "Code", "SPHC", "SNo", "Code", ["Code"], null, "contains");
    cfi.AutoComplete("DestCountry_Search", "CountryName", "Country", "SNo", "CountryName", ["CountryName"], null, "contains");
    cfi.AutoComplete("DestCity_Search", "CityName", "City", "SNo", "CityName", ["CityName"], null, "contains");
    cfi.AutoComplete("AgentForwarder_Search", "Name", "vAccount", "SNo", "Name", ["Name"], null, "contains");
    cfi.AutoComplete("Location_Search", "LocationType", "WHLocationType", "SNo", "LocationType", ["LocationType"], null, "contains");
    var SearchDataSource = [{ Key: "1", Text: "AWB Number" }, { Key: "2", Text: "ULD Number" }, { Key: "3", Text: "CAGE Number" }, { Key: "4", Text: "DOLLY Number" }];
    cfi.AutoCompleteByDataSource("Search", SearchDataSource);
}
function SearchData(type) {
    var obj = {
        Terminal: $("#Terminal_Search").val(),
        Airline: $("#Airline_Search").val(),
        SHC: $("#SHC_Search").val(),
        DestCountry: $("#DestCountry_Search").val(),
        DestCity: $("#DestCity_Search").val(),
        AgentForwarder: $("#AgentForwarder_Search").val(),
        Location: $("#Location_Search").val(),
        SubLocation: $("#Search").val() || 0,//Search By          
        SubAreaName: $("#Text_SearchBy").val()//@SearchText
    }
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "./Services/Warehouse/LocationSearchService.svc/SearchData",
        data: JSON.stringify(obj),
        success: function (response) {
            if (response.length > 0) {
                //if (type == "Search")
                //    BindLoactionSearchGrid(response);
                if (type == "Excel") {
                    var str = "<table>";
                    str += "<tr><td>Location Name</td><td>PIECE NO</td><td>SPHC</td><td>AWBNo</td><td>Country Name</td><td>City Name</td><td>Terminal Name</td><td>Agent Name</td><td>Airline Name</td></tr>"
                    for (var i = 0; i < response.length; i++) {
                        str += "<tr><td>" + response[i].LocationName + "</td><td>" + response[i].PicNo + "</td><td>" + response[i].SPHC + "</td><td>" + response[i].AWBNo + "</td><td>" + response[i].CountryName + "</td><td>" + response[i].CityName + "</td><td>" + response[i].TerminalName + "</td><td>" + response[i].AgentName + "</td><td>" + response[i].AirlineName + "</td></tr>"
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
function FindLocation() {
    var obj = {
        Terminal: $("#Terminal_Search").val(),
        Airline: $("#Airline_Search").val(),
        SHC: $("#SHC_Search").val(),
        DestCountry: $("#DestCountry_Search").val(),
        DestCity: $("#DestCity_Search").val(),
        AgentForwarder: $("#AgentForwarder_Search").val(),
        Location: $("#Location_Search").val(),
        SubLocation: $("#Search").val() || 0,//Search By    
        SubAreaName: $("#Text_SearchBy").val()//@SearchText
    }
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "./Services/Warehouse/LocationSearchService.svc/FindLocation",
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

                $("#divSearchWindow").data("kendoWindow").close();
            } else {
                ShowMessage("info", "", "No Data Found...");
            }
        }
    });
}


function BindWhereCondition() {
    var WhereCondition = "1=1";
    WhereCondition += $("#WarehouseDetails_Search").data("kendoAutoComplete").key() != "" ? " AND WHSetupSNo= " + $("#WarehouseDetails_Search").data("kendoAutoComplete").key() : "";
    WhereCondition += $("#Terminal_Search").data("kendoAutoComplete").key() != "" ? "AND TerminalSNo=" + $("#Terminal_Search").data("kendoAutoComplete").key() : "";
    WhereCondition += $("#Airline_Search").data("kendoAutoComplete").key() != "" ? "AND AirlineSNo=" + $("#Airline_Search").data("kendoAutoComplete").key() : "";
    WhereCondition += $("#SHC_Search").data("kendoAutoComplete").key() != "" ? "AND SHCSNo='" + $("#SHC_Search").data("kendoAutoComplete").key() + "'" : "";
    WhereCondition += $("#DestCountry_Search").data("kendoAutoComplete").key() != "" ? "AND DestinationCountrySNo='" + $("#DestCountry_Search").data("kendoAutoComplete").key() + "'" : "";
    WhereCondition += $("#DestCity_Search").data("kendoAutoComplete").key() != "" ? "AND DestinationCitySNo=" + $("#DestCity_Search").data("kendoAutoComplete").key() : "";
    WhereCondition += $("#AgentForwarder_Search").data("kendoAutoComplete").key() != "" ? "AND AgentSno=" + $("#AgentForwarder_Search").data("kendoAutoComplete").key()  : "";
    WhereCondition += $("#Location_Search").data("kendoAutoComplete").key() != "" ? "AND WHTypeSNo=" + $("#Location_Search").data("kendoAutoComplete").key() : "";

    return WhereCondition;
}

var wCondition = "";
function BindLoactionSearchGrid() {
    wCondition = BindWhereCondition();
    var dbtableName = "tblLocationSearch";
    $("#" + dbtableName).appendGrid({
        tableID: dbtableName,
        currentPage: 1, itemsPerPage: 10, whereCondition: wCondition, sort: "",
        //isPaging:true,
        isGetRecord: false,
        //hideRowNumColumn:true,
        contentEditable: pageType != 'READ',
        createUpdateServiceMethod: 'createUpdateLocationSearch',
        servicePath: './Services/Warehouse/LocationSearchService.svc',
        getRecordServiceMethod: 'SearchData',
        hideButtons: { updateAll: false, insert: false, append: true, remove: true, removeLast: true },
        caption: "Search Result",
        initRows: 1,
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },
            //{
            //    name: 'LocationName', display: 'Location Name', type: 'text'
            //},
            {
                name: 'LocationName', display: 'Location Name', type: 'text', value: '', ctrlAttr: { maxlength: 3, controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, isRequired: true, tableName: 'vWHLocation', textColumn: 'LocationName', keyColumn: 'SNo', filterCriteria: "contains"

            },
                {
                    name: 'show', display: 'Show', type: 'button', onClick: function (evt, rowIndex) {
                        bindhtml(evt, rowIndex);
                    }
                },
            {
                name: 'PicNo', display: 'PIECE NO', type: 'label'
            },
           {
               name: 'SPHC', display: 'SHC', type: 'label'
           },
           {
               name: 'AWBNo', display: 'AWBNo', type: 'label'
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
            }
              ,
            {
                name: 'ULDNo', display: 'ULD No', type: 'label'
            }

        ],
        isPaging: true,
        isExtraPaging: true,
    });
    //$("#" + dbtableName).appendGrid('load', data);

}

function bindhtml(evt, rowIndex)
{
    var res = "<table><tr><td class='formlabel'>Location</td><td class='formInputcolumn'><input type='hidden' id='hdnAwbnoupdate' /><input type='hidden' id='LSearch' name='LSearch'><input type='text' name='Text_LSearch' id='Text_LSearch' data-role='autocomplete' controltype='autocomplete' data-valid='' data-valid-msg=''> </td>" +
                        "<td class='formlabel'>Piece No</td><td class='formInputcolumn'><input type='hidden' id='MPieceNo' name='MPieceNo'><input type='text' name='Text_MPieceNo' id='Text_MPieceNo' data-role='autocomplete' controltype='autocomplete' data-valid='' data-valid-msg=''> </td>" +

                       //"<td class='formInputcolumn'><input type='hidden' name='MPieceNo' id='MPieceNo' value=''><span class='k-widget k-combobox k-header'><span class='k-dropdown-wrap k-state-default' unselectable='on' style='width: 80px;'><input type='text' class='k-input' name='Text_MPieceNo' id='Text_MPieceNo' style='width: 100%; text-transform: uppercase;' tabindex='9' controltype='autocomplete' maxlength='' value='' data-role='autocomplete' autocomplete='off'><span class='k-select' unselectable='on'><span class='k-icon k-i-arrow-s' unselectable='on' style='cursor:pointer;'>select</span></span></span></span><div style='display: block; overflow: auto;' id='divMultiMPieceNo'><ul style='padding:3px 2px 2px 0px;margin-top:0px;'><li class='k-button' style='display:none;margin-bottom:10px !important;'><input type='hidden' id='Multi_MPieceNo' name='Multi_MPieceNo' value=''><span style='display:none;' id='FieldKeyValuesMPieceNo' name='FieldKeyValuesMPieceNo'></span></li></ul></div></td>" +
                       "<td><input id='updateRecord' type='button' value='Update' onclick='UpdateRecord()' /> </td>" +
                       "</tr></table>";
    $("#divSearchLocationUpdate").html('');
    $("#divSearchLocationUpdate").html(res);
 
    $('#hdnAwbnoupdate').val($('#' + evt.currentTarget.id.replace('tblLocationSearch_show_', 'tblLocationSearch_AWBNo_')).html());
    cfi.AutoComplete("LSearch", "LocationName", "vWHLocation", "SNo", "LocationName", ["LocationName"], null, "contains");
    cfi.AutoComplete("MPieceNo", "PieceNo", "v_AWBSubProcessTrans", "PieceNo", "PieceNo", ["PieceNo"], null, "contains", ",", null, null, null, null, true, null);

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
        cfi.PopUp("divSearchLocationUpdate", "Search Location", "1000", null, null, 50);
    else
        $("#divSearchLocationUpdate").data("kendoWindow").open();

           
}

function UpdateRecord()
{
    $.ajax({
        url: "./Services/Warehouse/LocationSearchService.svc/UpdateLocationDetails",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            AWBNo: $('#hdnAwbnoupdate').val(),
            MPIECE: $('#Multi_MPieceNo').val(),
            Location: $('#LSearch').val()
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            if (result.length > 0) {
                var v = $.parseJSON(result);
                if (v[0].Message == 0) {
                    ShowMessage('success', 'Success!', "Location Updated Successfully.");
                    SearchData_Data();
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

function ExtraCondition(textId) {
    var f = cfi.getFilter("AND");
    if (textId.indexOf("MPieceNo") >= 0) {
        cfi.setFilter(f, "AWBNo", "eq", $('#hdnAwbnoupdate').val());
    }
    return cfi.autoCompleteFilter([f]);
}

function bindhtml1(evt, rowIndex)
{
    
    var res = "<div rel='diveroor' style='position: absolute;margin-top: -40px;'>" +
                "<div class='valid_errmsg' style='display: block;color:white'>"+
                    "<em style='border-color: green transparent transparent;'></em>" +
                    "<div style='display:table'><div style='display:table-cell'>" +
                    "<div>" +
                        "<table><tr><td class='formInputcolumn'><input type='hidden' id='LSearch' name='LSearch'><input type='text' name='Text_LSearch' id='Text_LSearch' data-role='autocomplete' controltype='autocomplete' data-valid='' data-valid-msg=''> </td></tr><tr>"+
                        "<td class='formInputcolumn'><input type='hidden' name='MPieceNo' id='MPieceNo' value=''><span class='k-widget k-combobox k-header'><span class='k-dropdown-wrap k-state-default' unselectable='on' style='width: 80px;'><input type='text' class='k-input' name='Text_MPieceNo' id='Text_MPieceNo' style='width: 100%; text-transform: uppercase;' tabindex='9' controltype='autocomplete' maxlength='' value='' data-role='autocomplete' autocomplete='off'><span class='k-select' unselectable='on'><span class='k-icon k-i-arrow-s' unselectable='on' style='cursor:pointer;'>select</span></span></span></span><div style='display: block; overflow: auto;' id='divMultiMPieceNo'><ul style='padding:3px 2px 2px 0px;margin-top:0px;'><li class='k-button' style='display:none;margin-bottom:10px !important;'><input type='hidden' id='Multi_MPieceNo' name='Multi_MPieceNo' value=''><span style='display:none;' id='FieldKeyValuesMPieceNo' name='FieldKeyValuesMPieceNo'></span></li></ul></div></td>" +
                        
                        "</tr></table>" +
                    "</div>"+
                    "</div>"+
                    "<div onclick='LableClick(this)' class='valid_close_icon '>x</div>" +
                "</div></div></div></div>";
    $('#' + evt.currentTarget.id).closest("td").append(res);
    cfi.AutoComplete("LSearch", "LocationName", "vWHLocation", "SNo", "LocationName", ["LocationName"], null, "contains");
    cfi.AutoComplete("MPieceNo", "PieceNo", "AWBSubProcessTrans", "PieceNo", "PieceNo", ["PieceNo"], null, "contains", ",", null, null, null, null, true, null);
}

function LableClick(obj) {
    $(obj).closest("div[rel='diveroor']").hide('slow');
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