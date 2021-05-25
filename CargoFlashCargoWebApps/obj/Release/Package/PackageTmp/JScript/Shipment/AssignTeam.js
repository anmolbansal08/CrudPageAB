/*
*****************************************************************************
Javascript Name:	AssignTeamJS     
Purpose:		    This JS used to get autocomplete for Assign Team.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Tarun Kumar
Created On:		    04 FEB 2016
Updated By:    
Updated On:	
Approved By:    
Approved On:	
*****************************************************************************
*/
var timeauto = "";
var timetxt = "";
var employeSno = "";
var employeTxt = "";
$(document).ready(function () {
    cfi.ValidateForm();
    AssignTeamGrid();
    AutoComplete();
    $('span#spnFlightNo').text($("#hdnFlightNo").val());
    $('span#spnFlightDate').text($("#hdnFlightDate").val());
});

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function AutoComplete() {
    var AssignTeam = "AssignTeam";
    var Time = "Time";
    var mySplitResult = timeauto.split(",");
    for (var i = 0; i < mySplitResult.length - 1; i++) {
        AssignTeam = "AssignTeam" + timeauto.split(",")[i] + "";
        Time = "Time" + timeauto.split(",")[i] + "";

        $('#' + Time).val(timetxt.split("*")[i]);
        $('#Text_' + Time).val(timetxt.split("*")[i]);
        $('#' + AssignTeam).val(employeSno.split("*")[i]);

        var alphabettypes = [{ Key: "1", Text: "1" }, { Key: "2", Text: "2" }, { Key: "3", Text: "3" }, { Key: "4", Text: "4" }, { Key: "5", Text: "5" }, { Key: "6", Text: "6" }, { Key: "7", Text: "7" }, { Key: "8", Text: "8" }, { Key: "9", Text: "9" }, { Key: "10", Text: "10" }, { Key: "11", Text: "11" }, { Key: "12", Text: "12" }, { Key: "13", Text: "13" }, { Key: "14", Text: "14" }, { Key: "15", Text: "15" }, { Key: "16", Text: "16" }, { Key: "17", Text: "17" }, { Key: "18", Text: "18" }, { Key: "19", Text: "19" }, { Key: "20", Text: "20" }, { Key: "21", Text: "21" }, { Key: "22", Text: "22" }, { Key: "23", Text: "23" }, { Key: "24", Text: "24" }];
        cfi.AutoCompleteByDataSource("" + Time + "", alphabettypes);
        cfi.AutoComplete("" + AssignTeam + "", "Name", "Employee", "SNo", "Name", null, null, "contains", ",");



        cfi.BindMultiValue("" + AssignTeam + "", employeTxt.split("*")[i], employeSno.split("*")[i]);
        fun_MakeRowDisable();
    }
}

function AssignTeamGrid() {
    var DailyFlightSNo = getParameterByName("DailyFlightSNo", "");
    var MovementTypeSNo = getParameterByName("MovementTypeSNo", "");
    $.ajax({
        url: "Services/Shipment/AssignTeamService.svc/AssignTeamTable",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            DailyFlightSNo: DailyFlightSNo,
            MovementTypeSNo: MovementTypeSNo
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            var GroupSNo = "*";
            var theDiv = document.getElementById("divAssignTeam");
            theDiv.innerHTML = "";
            var table = "<table class='appendGrid ui-widget' id='tblAssignTeamData'><thead class='ui-widget-header' style='text-align:center'>";
            table += "<tr><td colspan='6' class='ui-widget-header'>Flight No : <span id='spnFlightNo'></span></td><td colspan='7' class='ui-widget-header'>Flight Date  : <span id='spnFlightDate'></span></td><td style='height:25px;'><button aria-disabled='false' role='button' title='Back' type='button' id='btnBack' value='' tabindex='16' class='btn btn-inverse' style='width:100px;' onclick='Back();'><span class='ui-button-text'>Back</span></button></td></tr>";
            table += "<tr><td class='ui-widget-header'>AWB</td><td class='ui-widget-header'>Nature of Goods</td><td class='ui-widget-header'>No.Of Pcs</td><td class='ui-widget-header'>Gross Wt</td><td class='ui-widget-header'>Ori/Dest</td><td class='ui-widget-header'>Priority</td><td class='ui-widget-header'>Remarks</td><td class='ui-widget-header'>ULD Type/BULK</td><td class='ui-widget-header'>ULD Count</td><td class='ui-widget-header'>Group</td><td class='ui-widget-header'>Location</td><td class='ui-widget-header'>Assign Team/Personnel</td><td class='ui-widget-header'>Time(Hrs)</td>";
            //table += "<td class='ui-widget-header'>Assign Team/Personnel</td><td class='ui-widget-header'>Time(Hrs)</td>";
            table += "<td class='ui-widget-header'>Action</td>";
            table += "</tr></thead><tbody class='ui-widget-content'>";
            if (result.substring(1, 0) == "{") {
                var myData = jQuery.parseJSON(result);
                if (myData.Table0.length > 0) {
                    for (var i = 0; i < myData.Table0.length; i++) {
                        if (GroupSNo != myData.Table0[i].ULDGroupNo && GroupSNo != "*")
                            table += "<tr><td style='height: 15px;'  colspan='12'></td></tr>";
                        table += "<tr><td style='display:none;'><input name='SNo' id='SNo' value=" + myData.Table0[i].SNo + " type='hidden' /></td><td class='ui-widget-content first'>" + myData.Table0[i].AWBNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].NatureOfGoods + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Pieces + "</td><td class='ui-widget-content first'>" + myData.Table0[i].GrossWeight + "</td><td class='ui-widget-content first'>" + myData.Table0[i].OriginAirportCode + "/" + myData.Table0[i].DestinationAirportCode + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Priority + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Remarks + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ULDNoOrType + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ULDCount + "</td><td class='ui-widget-content first'>" + myData.Table0[i].ULDGroupNo + "</td><td class='ui-widget-content first'>" + myData.Table0[i].WHLocation + "</td>";
                        //table += "<td class='ui-widget-content first'>" + myData.Table0[i].AssignTeamTxt + "</td><td class='ui-widget-content first'>" + myData.Table0[i].Time + "</td>";
                        if (GroupSNo != myData.Table0[i].ULDGroupNo) {
                            table += "<td class='ui-widget-content first' ><input name='AssignTeam" + myData.Table0[i].ULDGroupNo + "' id='AssignTeam" + myData.Table0[i].ULDGroupNo + "' type='hidden' value=''/><input type='text' controltype='autocomplete' id='Text_AssignTeam" + myData.Table0[i].ULDGroupNo + "' name='Text_AssignTeam" + myData.Table0[i].ULDGroupNo + "'/></td><td class='ui-widget-content first'><input name='Time" + myData.Table0[i].ULDGroupNo + "' id='Time" + myData.Table0[i].ULDGroupNo + "' type='hidden' value=''/><input type='text' controltype='autocomplete' id='Text_Time" + myData.Table0[i].ULDGroupNo + "' name='Text_Time" + myData.Table0[i].ULDGroupNo + "'/></td><td class='ui-widget-content first'><input type='hidden' id='hdnIsRowDisable' value=" + myData.Table0[i].IsRowDisable + " ><button aria-disabled='false' role='button' title='Submit' type='button' id='btnSubmit' value='" + myData.Table0[i].ULDGroupNo + "' tabindex='16' class='btn btn-success' style='width:100px;' onclick='Submit(" + myData.Table0[i].ULDGroupNo + ");'><span class='ui-button-text'>Save</span></button><input name='HdnDailyFlightSNo" + myData.Table0[i].ULDGroupNo + "' id='HdnDailyFlightSNo" + myData.Table0[i].ULDGroupNo + "' type='hidden' value='" + myData.Table0[i].DailyFlightSNo + "'/></td></tr>";
                            timeauto += "" + myData.Table0[i].ULDGroupNo + ",";
                            employeSno += "" + myData.Table0[i].AssignTeam + "*";
                            employeTxt += "" + myData.Table0[i].AssignTeamTxt + "*";
                            timetxt += "" + myData.Table0[i].Time + "*";
                            //document.getElementById("hdnFlightNo").value = myData.Table0[i].FlightNo;
                            //document.getElementById("hdnFlightDate").value = myData.Table0[i].FlightDate;
                            $("#hdnFlightNo").val(myData.Table0[i].FlightNo);
                            $("#hdnFlightDate").val(myData.Table0[i].FlightDate);
                        }
                        else
                            table += "<td class='ui-widget-content first'></td><td class='ui-widget-content first'></td><td class='ui-widget-content first'></td></tr>";

                        GroupSNo = myData.Table0[i].ULDGroupNo;

                    }

                    table += "</tbody></table>";
                    theDiv.innerHTML += table;
                }
                else {
                    var table = "<table class='appendGrid ui-widget' id='tblAssignTeamData'><thead class='ui-widget-header' style='text-align:center'><tr><td class='ui-widget-header'>No Record Found</td></tr><tr><td class='ui-widget-header'><button aria-disabled='false' role='button' title='Back' type='button' id='btnBack' value='' tabindex='16' class='btn btn-inverse' style='width:100px;' onclick='Back();'><span class='ui-button-text'>Back</span></button></td></tr></thead></table";
                    theDiv.innerHTML += table;
                }
            }

            return false
        },
        error: function (xhr) {
            var a = "";
        }
    });
}
function Back() {
    var Page = getParameterByName("Page", "");
    if (Page == "0") {
        navigateUrl('Default.cshtml?Module=Import&Apps=InboundFlight&FormAction=INDEXVIEW');
    } else {
        navigateUrl('Default.cshtml?Module=Shipment&Apps=FlightControl&FormAction=INDEXVIEW');
    }
}


//Created By Manoj on 11.4.2016 for Row Disable
function fun_MakeRowDisable() {
    $('#tblAssignTeamData > tbody > tr').each(function (row, tr) {
        if ($(tr).find("td:nth-child(13) input[id='hdnIsRowDisable']").val() == 1) {
            $(tr).find("td:nth-child(11) input[controltype='autocomplete'][id^='Text_AssignTeam']").data("kendoAutoComplete").enable(false);
            $(tr).find("td:nth-child(12) input[controltype='autocomplete'][id^='Text_Time']").data("kendoAutoComplete").enable(false);
            $(tr).find("[id='btnSubmit']").removeAttr('onclick');

        }
    })
}
//#tblAssignTeamData > thead > tr:nth-child(2) > td:nth-child(11)
// End

function Submit(row) {
    if (row == undefined)
        row = "";
    var AssignTeamValue = $('#AssignTeam' + row).val();
    var TimeValue = $('#Time' + row).val();
    if (AssignTeamValue != "" && TimeValue != "") {
        $.ajax({
            url: "Services/Shipment/AssignTeamService.svc/UpdateAssignTeam",
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                GroupSNo: row,
                AssignTeam: $('#AssignTeam' + row).val(),
                Time: $('#Time' + row).val() == "" ? 0 : $('#Time' + row).val(),
                DailFlightSNo: $('#HdnDailyFlightSNo' + row).val(),
                SNo: $('#AssignTeam' + row).closest("tr").find("input[id='SNo']").val() == "" ? 0 : $('#AssignTeam' + row).closest("tr").find("input[id='SNo']").val(),
                MovementTypeSNo: getParameterByName("MovementTypeSNo", "")
            },
            contentType: "application/json; charset=utf-8", cache: false,
            success: function (result) {
                if (result.substring(1, 0) == "{") {
                    var myData = jQuery.parseJSON(result);
                    if (myData.Table0[0].Column1 == "2000") {
                        //AssignTeamGrid();
                        //AutoComplete();
                        ShowMessage('success', 'Success - Assign Team', "Team Assigned Successfully.", "bottom-right");
                        return false;
                    }
                    else {
                        ShowMessage('warning', 'Warning - Assign Team', "Need your kind attention.  Please contact the website administrator.", "bottom-right");
                    }
                }
                return false
            },
        });
    }
    else {
        ShowMessage('warning', 'Warning - Please select Assign Team/Personnel and Time(Hrs) both.', null);
        return false;
    }
}