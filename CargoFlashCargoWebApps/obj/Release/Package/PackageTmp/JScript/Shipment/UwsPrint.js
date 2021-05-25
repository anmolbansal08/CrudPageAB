/// <reference path="../../HtmlFiles/LoadBreakdown_UWS/LoadBreakdown_UWS.html" />
var divload = "";
var Tpcs = 0.000;
var Tgwt = 0.000;
var Tnwt = 0.000;
var len = 0;
$(document).ready(function () {
    cfi.ValidateForm();
    $('tr').find('td.formbuttonrow').remove();
    cfi.AutoComplete("FlightSNo", "FlightNo,FlightNo", "v_vUWSPrint", "FlightNo", "FlightNo", null, null, "contains");
    $('#tblFlightTransfer1').hide();
    $('#tblFilter').hide();
    $('#SearchFlight').click(function () {
        $('#divhtml').html('');
        AppendHtmlAll();
    });


})
function AppendHtmlAll() {
    var FlightNo = $('#FlightSNo').val();
    var FlightDate = $('#FlightDateSearch').val();
    var UserSNo = userContext.UserSNo;
    if (FlightNo != "" && FlightDate != "" && UserSNo != " ") {
        $('#divhtml').load('HtmlFiles/LoadBreakdown_UWS/LoadBreakdown_UWS.html', function () {
            GetUWSprintData(FlightNo, FlightDate, UserSNo); $('#Save_Print').unbind("click").bind("click", function () {
                SavePrintFun();
            });
        });
    }
    else {
        ShowMessage('warning', 'Need your Kind Attention!', 'Enter Flight Date and Flight No.');
    }
}
function BTranFlight(evt, rowIndex) {
    $('#tblFlightTransfer1').show();
    $('#tblFilter').show();
    $("#hdnDFSNo").val($('#tblFlightSearch_DFSNo_' + (rowIndex + 1)).val());
    FlightTransferGrid();
}
//valueId, value, keyId, key
function BindGridData1() {
    FlightTransferGrid();
    //hidegridbutton();
}
function ExtraCondition(textId) {
    if (textId.indexOf("Text_FlightSNo") >= 0) {
        var filterFAssign = cfi.getFilter("AND");
        cfi.setFilter(filterFAssign, "FlightDate", "eq", cfi.CfiDate("FlightDateSearch"));
        cfi.setFilter(filterFAssign, "OriginAirportSNo", "eq", userContext.AirportSNo);
        filterFlight = cfi.autoCompleteFilter(filterFAssign);
        return filterFlight;
    }
}
function ResetSearch() {
    // cfi.ResetAutoComplete("FlightSNo");
    debugger;
    alert("hjhjh");
}
function BindSameDropDownList() {

    if (!$("#sameflight").is(':checked')) {
        $('#hdnSameFlightSNo').val('');
    }
}

function findavlSpace(evt, RowIndex) {
    alert('Hi Value');
}

function handleChange(evt, rowIndex) {
    alert('Selected Value = ' + evt.target.value);
}
function ClosePopUpSCM() {
    $("#tblGeneratedUWSMsg").data("kendoWindow").close();
}
function ClosePopUpSCMHistory() {
    $("#divGeneratedUWSMsgHistory").data("kendoWindow").close();
}



function showUWSHistoryMessage() {
    var DailyFlightSNo = $("#spnFlightSNo").text();
    $.ajax({
        url: "Services/Export/UWS/UWSPrint/UWSPrintService.svc/getUWSHistoryMessage",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ DailyFlightSNo: DailyFlightSNo }),
        async: false,
        type: 'post',
        cache: false,
        success: function (result) {

            if (result.length > 0) {
                var tr = "";
                if ($("#divGeneratedUWSMsgHistory").length == 0) {
                    $("#divFooter").append("<div id='divGeneratedUWSMsgHistory'></div>")
                }
                $("#divGeneratedUWSMsgHistory").html('');
                tr += "<center><table id='tblGeneratedUWSMsgHistory' width='100%' style='width:95%;'><tbody><tr><td>LBDSNo</td><td>Sent At</td><td>UWS Message</td></tr>"
                for (var i = 0; i < result.length; i++) {
                    tr += "<tr><td>" + result[i].LBDSNo + "</td><td>" + result[i].SentAt + "</td><td><span id='spnUWSMessage_" + result[i].LBDSNo + "' style='display:none'>" + result[i].UWSMessage + "</span><a href='#' onclick=showUWSmessage(" + result[i].LBDSNo + ")><b>UWS Message</b></a></td></tr>"
                }
                tr += "<tr><td align='center' colspan='3'>&nbsp;&nbsp;<input type='button' class='btn btn-block btn-primary' value='Cancel' onclick='ClosePopUpSCMHistory();' /></td></tr></table><center>"
                $("#divGeneratedUWSMsgHistory").html(tr);

                cfi.PopUp("divGeneratedUWSMsgHistory", "UWS Message History", 500, null, null, 10);
            }
            else {
                ShowMessage('warning', 'Need your Kind Attention!', 'Data Not found!');
            }

        },
        error: function (err) {
            ShowMessage('error', 'Need your Kind Attention!', 'Generated Error!');
        }
    });
}
function showUWSmessage(obj) {
    var GenerateCIMPMessageResult = $("#spnUWSMessage_" + obj + "").text();
    if ($("#divGeneratedUWSMsg").length == 0) {
        $("#divFooter").append("<div id='divGeneratedUWSMsg'></div>")
        $("#divGeneratedUWSMsg").html('<center><table id="tblGeneratedUWSMsg" style="width:95%;"><tr><th align="left"></th><td><textarea readonly id="msgSCM" style="height:auto;min-width:94%; min-height:150px; width:auto; height:auto;"></textarea></td></tr><tr><th></th></tr><tr><td><input type="hidden" id="hdnmail" name="hdnmail" /></td></tr><tr><td colspan="2">&nbsp;</td></tr><tr><td align="center" colspan="2">&nbsp;&nbsp;<input type="button" class="btn btn-block btn-primary" value="Cancel" onclick="ClosePopUpSCM();" /></td></tr></table><center>');
    }
    $("#msgSCM").val(GenerateCIMPMessageResult == "" ? "" : GenerateCIMPMessageResult);
    cfi.PopUp("tblGeneratedUWSMsg", "UWS Message", 800, null, null, 10);
    //$("#tblGeneratedUWSMsg").parent("div").css("position", "fixed");
}
function showUWSPreviewmessage() {

    var FlightNo = $('#FlightSNo').val();
    var FlightDate = $('#FlightDateSearch').val();
    $.ajax({
        url: "Services/Common/CommonService.svc/GenerateCIMPMessage", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ MessageType: "UWS", SerialNo: "", SubType: "Pre", flightNumber: FlightNo, flightDate: FlightDate, OriginAirport: userContext.AirportCode, isDoubleSignature: false, version: "", nop: "", grossWeight: "", volumeWeight: "", eventTimeStamp: "", MsgSeqNo: "" }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {

            if ($("#divGeneratedUWSMsg").length == 0) {
                $("#divFooter").append("<div id='divGeneratedUWSMsg'></div>")
                $("#divGeneratedUWSMsg").html('<center><table id="tblGeneratedUWSMsg" style="width:95%;"><tr><th align="left"></th><td><textarea readonly id="msgSCM" style="height:auto;min-width:94%; min-height:300px; width:auto; height:auto;"></textarea></td></tr><tr><th></th></tr><tr><td><input type="hidden" id="hdnmail" name="hdnmail" /></td></tr><tr><td colspan="2">&nbsp;</td></tr><tr><td align="center" colspan="2">&nbsp;&nbsp;<input type="button" class="btn btn-block btn-primary" value="Cancel" onclick="ClosePopUpSCM();" /></td></tr></table><center>');
            }
            $("#msgSCM").val(result.GenerateCIMPMessageResult == "" ? "" : result.GenerateCIMPMessageResult);
            cfi.PopUp("tblGeneratedUWSMsg", "UWS Message", 830, null, null, 10);
            $("#tblGeneratedUWSMsg").parent("div").css("position", "fixed");
        }
    });
}
function RemoveDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
    return newArray;
}
function GetUWSprintData(FlightNo, FlightDate, UserSNo) {
    var ResultData = "";
    var FinalData = "";
    var TableData = "";
    var TableOHDData = "";
    //var FlightNo = 'sh - 1001';
    //var FlightDate = '2016-03-11 04:45:12.873';
    // var UserSNo = 1;
    //if (FlightNo == "" || FlightDate == "") {
    //    ShowMessage('warning', 'Need your Kind Attention!', 'Enter Flight No and Flight Date.');
    //    $('#divhtml').html('');
    //}
    //else {
    $.ajax({
        url: "Services/Export/UWS/UWSPrint/UWSPrintService.svc/GetUWSPrintData",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ FlightNo: FlightNo, FlightDate: FlightDate, UserSNo: UserSNo }),
        async: false,
        type: 'post',
        cache: false,
        success: function (result) {
            ResultData = jQuery.parseJSON(result);
            FinalData = ResultData.Table0;
            TableData = ResultData.Table1;
            TableOHDData = ResultData.Table2;
            if ((FinalData != undefined) && (TableData != undefined) && TableData.length > 0) {
                len = TableData.length;
                $("span#spnDateTime").text(FinalData[0].FlightDateTime);
                $("span#spnAirline").text(FinalData[0].AirlineName);
                $("span#spnFlight").text(FinalData[0].FlightNo);
                $("span#spnFlightSNo").text(FinalData[0].DailyFlightSNo);
                $("span#spnLBD").text(FinalData[0].LBDSNo);

                $("span#spnSector").text(FinalData[0].Sector);
                if (FinalData[0].LBDSNo == 1)
                    $("#UWSMessage").css("display", "none");
                else
                    $("#UWSMessage").css("display", "block");

                // $("span#spnExp").text("<a href='#' onClick='showOverhangData(\"" + FinalData[0].DailyFlightSNo + "\"); return false;'><b>UWS Message</b></a>");
                // $("#UWSMessage").text("<a href='#' onClick='showOverhangData(\"" + FinalData[0].DailyFlightSNo + "\"); return false;'><b>UWS Message</b></a>");
                $("span#spnDes").text(FinalData[0].Destination);
                $("span#spnACFT").text(FinalData[0].RegNo);
                $("span#spnAgent").text(FinalData[0].AirlineName);
                $("span#spnEmpData").text(FinalData[0].UserName);
                $("span#spnType").text(FinalData[0].AircraftType);
                $("#SI1").val(FinalData[0].OtherInfo1);
                $("#SI2").val(FinalData[0].OtherInfo2);
                //$("span#spnACFT").text(FinalData[0].RegNo);
                var SNo = '';
                GradTotalpcs = 0.000;
                GradTotalgwt = 0.000;
                GradTotalnwt = 0.000;

                ////////////////////////
                var AllNextRoute = FinalData[0].nextRoute.split('-').length;
                // var uniquetempAssignedEquipment = RemoveDuplicates(TableData, "OffPoint");
                var html = "";
                var totalrows = 0;
                for (var i = 0; i < AllNextRoute; i++) {

                    Tpcs = 0.000;
                    Tgwt = 0.000;
                    Tnwt = 0.000;
                    //var OffPoint = uniquetempAssignedEquipment[i]["OffPoint"];
                    var OffPoint = FinalData[0].nextRoute.split('-')[i];
                    var OffPointList = TableData.filter(function (obj) {
                        if (obj.OffPoint.match(OffPoint)) {
                            return obj;
                        }
                    });
                    if (OffPointList.length > 0) {
                        html = html + "<tr style='border:1px solid black;'><td colspan='15' style='padding: 7px; font-size: 12px; font-weight: bold; text-align: center'>[ DESTINATION : " + OffPoint + " ]</td></tr>";
                    }

                    for (var k = 0; k < OffPointList.length; k++) {
                        FinalOHD = TableOHDData.filter(function (ULDNo) {
                            if (ULDNo.ULDNo.match(OffPointList[k].ULDNo)) {
                                return ULDNo;
                            }
                        });
                        var tr = "";
                        //<td style='width:8%;'></td>
                        for (var j = 1; j < FinalOHD.length; j++) {
                            tr += ("<tr style='border:1px solid black;'><td style='width:8%;'></td><td style='width:5%;'></td><td style='width:3%;'></td><td style='width:3%;'></td><td style='width:3%;'></td><td style='width:10%;' colspan='2'></td><td style='width:5%;'>" + "</td><td style='width:5%; padding:7px;'></td><td style='width:15%; padding:7px;' colspan='2'></td><td style='width:15%; padding:7px;'></td><td style='width:5%;'>" + FinalOHD[j].text_OverhangDirection + "</td><td style='width:5%;'>" + FinalOHD[j].OverhangWidth + "</td><td style='width:5%;'>" + FinalOHD[j].text_OverhangMesUnit + "</td><td style='width:5%;'>" + FinalOHD[j].text_Overhangtype + "</td><td style='width:15%;'>" + FinalOHD[j].OverhangOtherInfo + "</td></tr>")
                        }
                        //<td style='width:8%;'>" + TableData[i].DollyNo + "</td>
                        var ULDContourCode = "", OverhangDirection = "", OverhangMesUnit = "", OverhangWidth = "", Overhangtype = "", OverhangOtherInfo = "";
                        if (FinalOHD.length > 0) {
                            ULDContourCode = FinalOHD[0].ULDContourCode;
                            OverhangDirection = FinalOHD[0].text_OverhangDirection;
                            OverhangMesUnit = FinalOHD[0].text_OverhangMesUnit;
                            OverhangOtherInfo = FinalOHD[0].OverhangOtherInfo;
                            Overhangtype = FinalOHD[0].text_Overhangtype;
                            OverhangWidth = FinalOHD[0].OverhangWidth;
                        }

                        html = html + "<tr style='border:1px solid black;'><td style='width:5%;'>" + OffPointList[k].ULDNo + "</td><td style='width:3%;'>" + OffPointList[k].NetWeight + "</td><td style='width:10%;' colspan='2'>" + OffPointList[k].SHC.substring(0, OffPointList[k].SHC.length - 1) + "</td><td style='width:5%;'>" + "</td><td style='width:5%; padding:7px;'> <input type='text' id='pry" + totalrows + "' value='" + OffPointList[k].Priority + "' name='" + OffPointList[k].Priority + "' required='required' controltype='number' maxlength='2' data-role='numerictextbox' class='k-formatted-value k-input' style='width:100%; font-size:10px;'>" + "</input></td><td style='width:15%; padding:7px;' colspan='2'>" + "<input type='text' id='remark" + totalrows + "' value='" + OffPointList[k].Remarks + "' maxlength='50' class='k-formatted-value k-input' style='width:100%; font-size:10px;'><input type='hidden' id='IsBulk" + totalrows + "' value='" + OffPointList[k].IsBulk + "' maxlength='50' style='width:100%; font-size:10px;'></td><td style='width:5%;'>" + ULDContourCode + "</td><td style='width:5%;'>" + OverhangDirection + "</td><td style='width:5%;'>" + OverhangWidth + "</td><td style='width:5%;'>" + OverhangMesUnit + "</td><td style='width:5%;'>" + Overhangtype + "</td><td style='width:15%;'>" + OverhangOtherInfo + "</td><td></td></tr>" + tr;
                        SNo = SNo + OffPointList[k].SNo + ',';
                        Tpcs = parseFloat(Tpcs) + parseFloat(OffPointList[k].Pieces);
                        Tgwt = parseFloat(Tgwt) + parseFloat(OffPointList[k].GrossWt.split(' ')[0]);
                        Tnwt = parseFloat(Tnwt) + parseFloat(OffPointList[k].NetWeight);
                        totalrows = parseInt(totalrows) + 1;
                    }
                    if (OffPointList.length > 0) {
                        html = html + "<tr style='background-color: #cccccc; border: 1px solid black;'><td style='padding: 5%; padding: 7px; font-weight: bold;' colspan='4'>Total</td><td style='width:5%; padding:7px;  font-weight:bold;'><span  id='spnTGwt'>" + Tgwt + "</span></td> <td style='width:5%; padding:7px; font-weight:bold;'><span id='spnTNwt'>" + Tnwt + "</span></td><td style='width:5%; padding:7px;' colspan='2'>&nbsp;</td> <td style='width:5%; padding:7px;'>&nbsp;</td> <td style='width:5%; padding:7px;'>&nbsp;</td> <td style='width:5%; padding:7px;' colspan='3'>&nbsp;</td> <td></td> <td></td></tr>"
                    }
                    GradTotalpcs = GradTotalpcs + Tpcs;
                    GradTotalgwt = GradTotalgwt + Tgwt;
                    GradTotalnwt = GradTotalnwt + Tnwt;

                }
                $('tr#spDes').after(html);
                $('#hdnSNoList').val(SNo);
                $("span#spnGrandTotalpcs").text(GradTotalpcs);
                $("span#spnGrandTotalGwt").text(GradTotalgwt.toFixed(2));
                $("span#spnGrandTotalNwt").text(GradTotalnwt.toFixed(2));

                //////////////////////////
                //for (var i = 0; i < TableData.length; i++) {

                //    FinalOHD = TableOHDData.filter(function (ULDNo) {
                //        if (ULDNo.ULDNo.match(TableData[i].ULDNo)) {
                //            return ULDNo;
                //        }
                //    });
                //    var tr = "";
                //    //<td style='width:8%;'></td>
                //    for (var j = 1; j < FinalOHD.length; j++) {
                //        tr += ("<tr style='border:1px solid black;'><td style='width:8%;'></td><td style='width:5%;'></td><td style='width:3%;'></td><td style='width:3%;'></td><td style='width:3%;'></td><td style='width:10%;' colspan='2'></td><td style='width:5%;'>" + "</td><td style='width:5%; padding:7px;'></td><td style='width:15%; padding:7px;' colspan='2'></td><td style='width:15%; padding:7px;'></td><td style='width:5%;'>" + FinalOHD[j].text_OverhangDirection + "</td><td style='width:5%;'>" + FinalOHD[j].OverhangWidth + "</td><td style='width:5%;'>" + FinalOHD[j].text_OverhangMesUnit + "</td><td style='width:5%;'>" + FinalOHD[j].text_Overhangtype + "</td><td style='width:15%;'>" + FinalOHD[j].OverhangOtherInfo + "</td></tr>")
                //    }
                //    //<td style='width:8%;'>" + TableData[i].DollyNo + "</td>
                //    var ULDContourCode="", OverhangDirection = "", OverhangMesUnit = "", OverhangWidth = "", Overhangtype = "", OverhangOtherInfo = "";
                //    if (FinalOHD.length > 0) {
                //        ULDContourCode = FinalOHD[0].ULDContourCode;
                //        OverhangDirection = FinalOHD[0].text_OverhangDirection;
                //        OverhangMesUnit = FinalOHD[0].text_OverhangMesUnit;
                //        OverhangOtherInfo = FinalOHD[0].OverhangOtherInfo;
                //        Overhangtype = FinalOHD[0].text_Overhangtype;
                //        OverhangWidth = FinalOHD[0].OverhangWidth;
                //    }

                //    $('tr#spDes').after("<tr style='border:1px solid black;'><td style='width:8%;'>" + TableData[i].EquipmentNumber + "</td><td style='width:5%;'>" + TableData[i].ULDNo + "</td><td style='width:3%;'>" + TableData[i].Pieces + "</td><td style='width:3%;'>" + TableData[i].GrossWt + "</td><td style='width:3%;'>" + TableData[i].NetWeight + "</td><td style='width:10%;' colspan='2'>" + TableData[i].SHC.substring(0, TableData[i].SHC.length - 1) + "</td><td style='width:5%;'>" + "</td><td style='width:5%; padding:7px;'> <input type='text' id='pry" + i + "' value='" + TableData[i].Priority + "' name='" + TableData[i].Priority + "' required='required' controltype='number' maxlength='2' data-role='numerictextbox' class='k-formatted-value k-input' style='width:100%; font-size:10px;'>" + "</input></td><td style='width:15%; padding:7px;' colspan='2'>" + "<input type='text' id='remark" + i + "' value='" + TableData[i].Remarks + "' maxlength='50' style='width:100%; font-size:10px;'><input type='hidden' id='IsBulk" + i + "' value='" + TableData[i].IsBulk + "' maxlength='50' style='width:100%; font-size:10px;'></td><td style='width:5%;'>" + ULDContourCode + "</td><td style='width:5%;'>" + OverhangDirection + "</td><td style='width:5%;'>" + OverhangWidth + "</td><td style='width:5%;'>" + OverhangMesUnit + "</td><td style='width:5%;'>" + Overhangtype + "</td><td style='width:15%;'>" + OverhangOtherInfo + "</td></tr>" + tr)

                //    SNo = SNo + TableData[i].SNo + ',';
                //    Tpcs = parseFloat(Tpcs) + parseFloat(TableData[i].Pieces);
                //    Tgwt = parseFloat(Tgwt) + parseFloat(TableData[i].GrossWt.split(' ')[0]);
                //    Tnwt = parseFloat(Tnwt) + parseFloat(TableData[i].NetWeight);
                //}
                //// SNo = SNo.slice(0, SNo.length - 1);
                //$('#hdnSNoList').val(SNo);
                //$("span#spnTpcs").text(Tpcs);
                //$("span#spnTGwt").text(Tgwt.toFixed(2));
                //$("span#spnTNwt").text(Tnwt.toFixed(2));
                //$("span#spnMainTGwt").text(Tgwt.toFixed(3));
                //$("span#spnMainTNwt").text(Tnwt.toFixed(3));
                $("input[id^='pry']").blur(function (event) {
                    //prevent using shift with numbers
                    if ($("#" + event.currentTarget.id).val() == 0) {
                        $("#" + event.currentTarget.id).val("");
                    }

                });
                $("input[id^='pry']").keydown(function (event) {
                    //prevent using shift with numbers
                    if (event.shiftKey == true) {
                        event.preventDefault();
                    }
                    if (!((event.keyCode >= 48 && event.keyCode <= 57)) && !((event.keyCode >= 96 && event.keyCode <= 105)) && !(event.keyCode == 8) && !(event.keyCode == 9) && !(event.keyCode == 37) && !(event.keyCode == 46)) {
                        //not a number key or period so prevent
                        event.preventDefault();
                    }
                });
            }
            else {
                $('#divhtml').html('');
                ShowMessage('warning', 'Need your Kind Attention!', 'No Record Found.');
            }
        },
        error: function (err) {
            ShowMessage('error', 'Need your Kind Attention!', 'Generated Error!');
        }
    });
    //}
}

function SaveUWSPrintDetail() {
    var tblGrid = "tblTaxSlab";
    var rows = $("tr[id^='" + tblGrid + "']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
    getUpdatedRowIndex(rows.join(","), tblGrid);
    $("#hdnFormData").val($('#tblTaxSlab').appendGrid('getStringJson'));
}

function SavePrintFun() {
    $('#tbl').hide();
    $('#Save_Print').hide();
    $('#Create_Message').hide();
    $('#plugin').hide();
    var UWSModel = [];

    for (var i = 0; i < len; i++) {
        $('#pry' + i).after('<span id="spnPry" ' + i + '>' + $('#pry' + i).val() + '</span>');
        $('#remark' + i).after('<span id="spnPry"' + i + '>' + $('#remark' + i).val() + '</span>');

        var Model_UWSModel = {
            SNo: $('#hdnSNoList').val().split(',')[i],
            Priority: parseInt($('#pry' + i).val()),
            Remarks: $('#remark' + i).val(),
            IsBulk: parseInt($('#IsBulk' + i).val())
        };
        UWSModel.push(Model_UWSModel);

        $('#pry' + i).hide();
        $('#remark' + i).hide();
    }
    var DailyFlightSNo = $("#spnFlightSNo").text();

    $("#SI1").attr("disabled", "disabled");
    $("#SI2").attr("disabled", "disabled");
    $.ajax({
        url: "Services/Export/UWS/UWSPrint/UWSPrintService.svc/SaveUWSPrintDetails",
        async: false,
        type: "POST",
        dataType: "json",
        cache: false,
        data: JSON.stringify({ UWSModel: UWSModel, OtherInfo1: $("#SI1").val(), OtherInfo2: $("#SI2").val(), UserSNo: userContext.UserSNo, DailyFlightSNo: DailyFlightSNo }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == 0) {
                $("#divLoading").hide();
                //ShowMessage('success', 'Success - UWS Print', "Saved Successfully.", "bottom-right");
                alert("Saved Successfully!! Press OK to Print...");
                //$('#plugin').hide();
                var Flight = $("#spnFlight").html().split('/')[1].replace(/\-/g, '');
                $('html head').find('title').text("UWS - " + Flight);
                var tt = window.parent.document.title
                window.parent.document.title = "UWS - " + Flight;
                window.print();

                window.parent.document.title = tt;
                //onClick="document.title = 'My new title';window.print();"
            }
            else
                alert("UWS data has not been saved!!");
        },
        error: function (xhr) {
            alert('warning', "Error!!!", "bottom-right");

        }
    });


}
 
 