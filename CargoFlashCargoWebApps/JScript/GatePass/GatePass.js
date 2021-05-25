
/// <reference path="../../HtmlFiles/Export/AirMailPrint.html" />
/// <reference path="../../HtmlFiles/Export/Notoc/Notoc.html" />
/// <reference path="../../HtmlFiles/Export/Notoc/Notoc.html" />

var billto = [{ Key: "0", Text: "Agent" }, { Key: "1", Text: "Airline" }];
$(document).ready(function () {
    cfi.AutoCompleteByDataSource("BillType", billto, onBillToSelect, null);
    UserPageRights("GatePass")
    
});

function onBillToSelect(e) {
    cfi.ResetAutoComplete("BillToSNo");
    $("#Text_BillToSNo").closest('.k-widget').show();
    if ($('#BillType').val() == '0') {
        $('#spnBillToSNo').text('Agent Name');
        var data = GetDataSourceV2("BillToSNo", "GatePass_Name", null);
        cfi.ChangeAutoCompleteDataSource("BillToSNo", data, true, CheckCreditBillToSNo, "Name", "contains");
        $('#Text_BillToSNo').attr('data-valid', 'required');
        $('#Text_BillToSNo').attr('data-valid-msg', 'Enter Agent.');
        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
            $(this).find("input:radio[id^='PaymentMode']").eq(0).removeAttr("disabled", "disabled");
            $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("checked", 'checked');
        });
    }
    else if ($('#BillType').val() == '1') {
        $('#spnBillToSNo').text('Airline Name');
        var data = GetDataSourceV2("BillToSNo", "GatePass_AirlineName", null);
        cfi.ChangeAutoCompleteDataSource("BillToSNo", data, true, CheckCreditBillToSNo, "AirlineName", "contains");
        $('#Text_BillToSNo').attr('data-valid', 'required');
        $('#Text_BillToSNo').attr('data-valid-msg', 'Enter Airline.');

        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
            $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("disabled", "disabled");
            $(this).find("input:radio[id^='PaymentMode']").eq(1).attr("checked", 'checked');
        });
    }
}

////////////////////////////////////////////////////////////////////////////////////////// Parvez Khan
var hdnGatePassSNo = 0;
$(function () {
    LoadGatePassControl();
});
function GetGatePassSearchData() {
    $("#divDetail").html('');
    $.ajax({
        url: "Services/GatePass/GatePassService.svc/GetWebForm/" + "GATEPASS" + "/" + "GatePass" + "/GatePassSearchNew/NEW/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            //CleanUI();
            //$("#divDetail").html(result);
            if (result != undefined || result != "") {
                $("#divContentDetail").show();
                $("#divGatePassSearch").html(result);
                $("td[title='Enter Origin']").hide();
                $("input[id='Origin']").hide();
                $("td[title='Enter Destination']").hide();
                $("input[id='Destination']").hide();

                cfi.AutoCompleteV2("searchFlightNoNew", "FlightNo", "GatePass_FlightNo", null, "contains");
                cfi.AutoCompleteV2("SearchAirlineCarrierCode1", "CarrierCode,AirlineName", "GatePass_AirlineName", null, "contains");


                $('#FromFlightDate').data("kendoDatePicker").value();
            }
        }
    });
}
function fn_SearchManifst(GPSNo) {
    var isView;
    hdnGatePassSNo = 0;
    var OriginCity = "0"; //$("#Origin").val() == "" ? "0" : $("#Origin").val();
    var DestinationCity = "0"; //$("#Destination").val() == "" ? "0" : $("#Destination").val();
    var FlightSNo = $("#searchFlightNoNew").val().trim() == "" ? "A~A" : $("#searchFlightNoNew").val().trim();
    var FlightDate = cfi.CfiDate("FlightDate") == "" ? "" : cfi.CfiDate("FlightDate");
    var GatePassSNo = GPSNo;
    //var Flag = false;
    //if (FlightSNo == "A~A") {
    //    ShowMessage('warning', 'Kindly enter Flight No', " ", "bottom-right");
    //    flag = true;
    //}
    if (FlightDate == "" && Flag == false) {
        ShowMessage('warning', 'Kindly select Flight Date', " ", "bottom-right");
        flag = true;
    }
    if (cfi.IsValidSection("divGatePassSearch")) {
        // $("#btnSaveGatePass").show();
        // Add By Sushnat Kumar Nayak ON 04-08-2018
        $(userContext.ProcessRights).each(function (i, e) {
            if (e.SubProcessSNo == '2501') {
                isView = e.IsView;
                return;
            }
        });
        if (isView) {
            $("#btnSaveGatePass").hide();

        }
        else {
            $("#btnSaveGatePass").show();

        }
        ShowIndexView("divDetail", "Services/GatePass/GatePassService.svc/GetFlightTransGridData/GATEPASS/GatePass/MANIFESTULD/" + FlightSNo + "/" + "GATEPASSULD" + "/" + OriginCity + "/" + DestinationCity + "/" + FlightDate + "/" + GatePassSNo);
        $('#divDetail table tbody tr[class~="k-master-row"]').each(function (row, tr) {
            var Rowtr = $(tr).closest("div.k-grid").find("div.k-grid-header:first");
            var SelectIndex = Rowtr.find("th[data-field='isSelect']").index();
            var isSelect = $(tr).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked');
            alert(isSelect);
        });
    }
   
}
function SaveGatePass(mode) {
    var flag = false;
    var chkcount = 0;
    if ($("#chkBulk:checked").length > 0) {
        chkcount = 1;
    }
    if ($("#chkbtnSelect:checked").length > 0) {
        chkcount = chkcount + 1;
    }

    if (chkcount == 0) {
        ShowMessage('warning', 'Warning ', "Warning -GatePass could not be created", "bottom-right");
    }

    else {
        if (chkcount > 0) {
            var chkSelect = false;
            var IntectShipArray = new Array();
            var BulkShipArray = new Array();
            var LyingIntectShipArray = new Array();
            var LyingBulkShipArray = new Array();
            var OSCLyingIntectShipArray = new Array();
            var OSCLyingBulkShipArray = new Array();
            var hdnDailyFLightSNo = "";
            //added for pax and freighter radio button
            var FlightType = $("input[type=radio][name=Pax]:checked").val();

            $('#divDetail table tbody tr[class~="k-master-row"]').each(function (row, tr) {
                var Rowtr = $(tr).closest("div.k-grid").find("div.k-grid-header:first");
                var ULDStockSNoIndex = Rowtr.find("th[data-field='ULDStockSNo']").index();
                var ULDNoIndex = Rowtr.find("th[data-field='ULDNo']").index();
                var SelectIndex = Rowtr.find("th[data-field='isSelect']").index();
                //var RFSRemarksInx = Rowtr.find("th[data-field='RFSRemarks']").index();
                var LastPointInx = Rowtr.find("th[data-field='LastPoint']").index();
                var FlightType = $("input[type=radio][name=Pax]:checked").val();
                var DailyFlightSNoIndex = Rowtr.find("th[data-field='DailyFlightSNo']").index();
                hdnDailyFLightSNo = $(tr).find('td:eq(' + DailyFlightSNoIndex + ')').text();

                //var isSelect = $(tr).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked');
                var isSelect = $(tr).find("input[type=checkbox]").is(":checked");
                if ($(tr).find('td:eq(' + ULDNoIndex + ')').text() == "BULK") {
                    var nestedGridHeader = $(tr).next().find("div.k-grid-header");
                    var nestedGridContent = $(tr).next().find("div.k-grid-content > table tr");
                    var AWBSNoIndex = nestedGridHeader.find("th[data-field='AWBSNo']").index();
                    var McBookingSNoIndex = nestedGridHeader.find("th[data-field='McBookingSNo']").index();
                    var IsBulkIndex = nestedGridHeader.find("th[data-field='Bulk']").index();
                    var IsFlightSNOIndex = nestedGridHeader.find("th[data-field='DailyFlightSNo']").index();
                    //var PiecesIndex = nestedGridHeader.find("th[data-field='TotalPPcs']").index();
                    var DailyFlightSNo = nestedGridHeader.find("th[data-field='DailyFlightSNo']").index();
                    var PGWIndex = nestedGridHeader.find("th[data-field='PGW']").index();
                    var PVWIndex = nestedGridHeader.find("th[data-field='PVW']").index();
                    var PCBMWIndex = nestedGridHeader.find("th[data-field='PCCBM']").index();

                    var PlannedPiecesIndex = nestedGridHeader.find("th[data-field='PlannedPieces']").index();
                    var ActG_V_CBMIndex = nestedGridHeader.find("th[data-field='ActG_V_CBM']").index();
                    var PlanG_V_CBMIndex = nestedGridHeader.find("th[data-field='PlanG_V_CBM']").index();
                    var SHCIndex = nestedGridHeader.find("th[data-field='SHC']").index();
                    //var AgentIndex = nestedGridHeader.find("th[data-field='Agent']").index();
                    //var RFSRemarksIndex = nestedGridHeader.find("th[data-field='RFSRemarks']").index();
                    var AWBOffPointIndex = nestedGridHeader.find("th[data-field='AWBOffPoint']").index();

                    $(nestedGridContent).each(function (row1, tr1) {
                        if ($(tr1).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]').prop('checked')) {
                            chkSelect = true;
                        }
                        //else {
                        //    fn_CheckOffloadPCS($(tr1).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]'));
                        //}
                        var AG = $(tr1).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[0];
                        var AV = $(tr1).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[1];
                        var ACBM = $(tr1).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[2];
                        //var PG = $(tr1).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val();
                        //var PV = $(tr1).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val();
                        //var PCBM = $(tr1).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val();
                        BulkShipArray.push({
                            isBulk: $(tr1).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]').prop('checked'),
                            AWBSNo: $(tr1).find('td:eq(' + AWBSNoIndex + ')').text(),
                            DailyFlightSNo: $(tr1).find('td:eq(' + IsFlightSNOIndex + ')').text(),
                            TotalPieces: '0',
                            PlannedPieces: $(tr1).find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val(),
                            //ActualVolumeWt: AV,
                            //ActualGrossWt: AG,
                            //ActualCBM: ACBM,
                            ActualVolumeWt: $(tr1).find('td:eq(' + PVWIndex + ')').text(),
                            ActualGrossWt: $(tr1).find('td:eq(' + PGWIndex + ')').text(),
                            ActualCBM: $(tr1).find('td:eq(' + PCBMWIndex + ')').text(),
                            //PlannedGrossWt: PG,
                            //PlannedVolumeWt: PV,
                            //PlannedCBM: PCBM,
                            PlannedGrossWt: 0,
                            PlannedVolumeWt: 0,
                            PlannedCBM: 0,
                            ULDStockSNo: $(tr).find('td:eq(' + ULDStockSNoIndex + ')').text(),
                            MovementType: 2,
                            //RFSRemarks: $(tr1).find('td:eq(' + RFSRemarksIndex + ') input[type=hidden]').val(),
                            RFSRemarks: '',
                            //AWBOffPoint: $(tr1).find('td:eq(' + AWBOffPointIndex + ') input[type="Text"]').val().toUpperCase(),
                            AWBOffPoint: '',
                            //McBookingSNo: 0,
                            McBookingSNo: $(tr1).find('td:eq(' + McBookingSNoIndex + ')').text(),
                            IsChanged: 0,
                            // SHC: $(tr1).find('td:eq(' + SHCIndex + ')').text(),
                            // Agent: $(tr1).find('td:eq(' + AgentIndex + ')').text(),
                            UpdatedBy: 2
                        });
                    });

                }
                else {
                    if (isSelect) {
                        chkSelect = true;
                    } 
                    //var length = $('[id^="chkbtnSelect"]:checked').length;
                   // isSelect = $('[id^="chkbtnSelect"]').is(':checked'),
                    IntectShipArray.push({
                        isSelect: isSelect,
                       
                        DailyFlightSNo: DailyFlightSNo,
                        ULDStockSNo: $(tr).find('td:eq(' + ULDStockSNoIndex + ')').text(),
                        MovementType: 2,
                        RFSRemarks: '',
                        LastPoint: $(tr).find('td:eq(' + LastPointInx + ') input[type=Text]').val().toUpperCase(),
                        UpdatedBy: 2
                    });
                }

            });

            var FunctionName = "";
            FunctionName = "SaveGatePass";
            var SaveProcessStatus = "GP";
            //}

            var postData = SaveProcessStatus == "GP" ? JSON.stringify({ BulkShipmentInfo: BulkShipArray, IntectShipmentInfo: IntectShipArray, FlightSNo: hdnDailyFLightSNo, GatePassSNo: hdnGatePassSNo }) : JSON.stringify({ BulkShipmentInfo: BulkShipArray, IntectShipmentInfo: IntectShipArray, FlightSNo: hdnDailyFLightSNo });

            if (SaveProcessStatus == "GP") {
                $.ajax({
                    url: "Services/GatePass/GatePassService.svc/" + FunctionName, async: false, type: "POST", dataType: "json", cache: false,
                    data: postData,
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        var ResultStatus = result.split('?')[0];
                        var ResultValue = result.split('?')[1];
                        if (ResultStatus == '0')//for Part Shipment
                        {
                            ShowMessage('success', 'Success', 'GatePass Created Successfully', "bottom-right");
                            GatepassSearch();
                        }
                        else {
                            ShowMessage('warning', 'Flight has already departed', ResultValue, "bottom-right");
                        }
                    },
                    error: function (xhr) {
                        ShowMessage('warning', 'Warning -GatePass could not be created ', " ", "bottom-right");
                        flag = false;
                    }
                });
            }
            else {
                ShowMessage('warning', 'Warning -Selected flight has already departed', " ", "bottom-right");
                flag = false;
            }
            checkProgrss('MAN', 'GatePass', SaveProcessStatus);
        }
        else {
            ShowMessage('warning', 'Warning ', "GatePass could not be created", "bottom-right");
        }
    }
    return flag;
}
//Change by Pankaj kumar ishwar//
function LoadGatePassControl() {
    _CURR_PRO_ = "GATEPASS";
    $.ajax({
        url: "Services/GatePass/GatePassService.svc/GetWebForm/" + _CURR_PRO_ + "/GatePass/GatePassSearch/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContent);
            $("#divFooter").html(fotter).show();

            if (isCreate == false) {
                $("#btnNewGatePass").hide();
            } else {
                $("#btnNewGatePass").show();
            }

            //$("#divAction").hide();

            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });
            ///
            //var FlightStatusType = [{ Key: "OPEN", Text: "OPEN" }, { Key: "LI", Text: "LI" }, { Key: "BUILD UP", Text: "BUILD UP" }, { Key: "PRE", Text: "PRE" }, { Key: "MAN", Text: "MAN" }, { Key: "DEP", Text: "DEP" }, { Key: "CLSD", Text: "CLOSED" }, { Key: "NIL-MAN", Text: "NIL-MAN" }, { Key: "NIL-DEP", Text: "NIL-DEP" }, { Key: "NIL-CLSD", Text: "NIL-CLSD" }];
            //cfi.AutoCompleteByDataSource("searchFlightStatus", FlightStatusType);
            //adding for airline

            cfi.AutoCompleteV2("searchFlightNo", "FlightNo", "GatePass_FlightNo", null, "contains");
            cfi.AutoCompleteV2("searchBoardingPoint", "AirportCode", "GatePass_AirportNameGatePass", null, "contains");
            cfi.AutoCompleteV2("searchEndPoint", "AirportCode", "GatePass_AirportNameGatePass", null, "contains");
            $('#ToFlightDate').data("kendoDatePicker").value();
            $('#FromFlightDate').data("kendoDatePicker").value("");
            //end
            GatepassSearch();
            ////////for search with enter Key
            //$("#btnSearch").bind("click", function ()
            //{
            //    GatepassSearch();
            //    $("#dv_FlightManifestPrint").hide()
            //    CleanUI();
            //});
            $("#__tblflightsearch__").keydown(function (e) {
                if (e.which == 13) {
                    CleanUI();
                    GatepassSearch();
                }
            });
            ///for remove NIL border
            $("#divDetailPrint").removeAttr("style");
            ////
        }
    }
    );
}
//Change by Pankaj kumar ishwar//
function GatepassSearch() {
    var BoardingPoint = $("#Text_searchBoardingPoint").val() == "" ? "0" : $("#Text_searchBoardingPoint").val();
    var EndPoint = $("#Text_searchEndPoint").val() == "" ? "0" : $("#Text_searchEndPoint").val();
    var FlightNo = $("#Text_searchFlightNo").val().trim() == "" ? "A~A" : $("#Text_searchFlightNo").val().trim();
    var SearchAirlineCarrierCode1 = "GA";
    var FromFlightDate = $("#FromFlightDate").val() == "" ? "A~A" : $("#FromFlightDate").val();
    var ToFlightDate = $("#ToFlightDate").val() == "" ? "A~A" : $("#ToFlightDate").val();
    var FlightStatus = "MAN";
    if (ToFlightDate != "To Date") {
        ShowIndexView("divFlightDetails", "Services/GatePass/GatePassService.svc/GetFlightGridData/GATEPASS/GatePass/GATEPASS/" + BoardingPoint + "/" + EndPoint + "/" + FlightNo + "/" + SearchAirlineCarrierCode1 + "/" + FromFlightDate + "/" + ToFlightDate + "/" + userContext.AirportCode + "/" + FlightStatus, "Scripts/maketrans.js?" + Math.random());
    }
    else {
        ShowMessage('warning', 'Warning -Please select To flight date', " ", "bottom-right");
    }
    $("#divContentDetail").hide();
}
function DisableFlight() {
    $("#divDetail .WebFormTable2 tbody tr:nth-child(3) td:first div:first div.k-grid-content").css({ "max-height": "300px", "overflow": "auto" });

    if (FlightCloseFlag == "DEP") {
        $('#divDetail input').attr('disabled', 'disabled');
        $('#btnPrint').removeAttr('disabled');
    }
    var BULKIndex = -1;
    var Rth = $("#divDetail  div.k-grid-header:first  div  table  thead  tr  th[data-field!='isSelect']:nth-child(1)");
    Rth.html("<input type='checkbox' id='chkAllBox' onchange='return CheckAll(this);' >");
    $('#divDetail table tbody tr[class~="k-master-row"]').each(function (rowmain, trMain) {
        var Rowtr = $(trMain).closest("div.k-grid").find("div.k-grid-header:first");
        var ULDNoIndex = Rowtr.find("th[data-field='ULDNo']").index();
        var IsDisabledULDIndex = Rowtr.find("th[data-field='IsDisabledULD']").index();
        var LastPointIndex = Rowtr.find("th[data-field='LastPoint']").index();
        var isSelected = Rowtr.find("th[data-field='isSelect']").index();
        if ($(trMain).find('td:eq(' + ULDNoIndex + ')').text() == "BULK") {
            BULKIndex = $(trMain).index();
            var nestedGridHeader = $(trMain).next().find("div.k-grid-header");
            $(trMain).find('td[class="k-hierarchy-cell"]').find('a[class="k-icon k-plus"]').trigger("click");
            var nestedGridContent = $(trMain).next().find("div.k-grid-content > table > tbody  tr");
            var IsPreManifestIndex = nestedGridHeader.find("th[data-field='IsPreManifested']").index();
            $(nestedGridContent).each(function (rowChild, trChild) {
                if ($(trChild).find('td:eq(' + IsPreManifestIndex + ')').text() == "true") {
                    $(trChild).find('input[type=text],input[type=checkbox]').attr('disabled', 1);
                    // $(trChild).find('a[class="removed label label-danger"').removeAttr('onclick');
                   
                }
                
            });
        }
        else {
            $('#divDetail table tbody tr[class~="k-master-row"]').each(function (rowmain, trMain) {
                var Rowtr = $(trMain).closest("div.k-grid").find("div.k-grid-header:first");
                var ULDNoIndex = Rowtr.find("th[data-field='ULDNo']").index();
                var IsDisabledULDIndex = Rowtr.find("th[data-field='IsDisabledULD']").index();
                // $(trMain).find('td[class="k-hierarchy-cell"]').find('a[class="k-icon k-minus"]').trigger("click");
                if ($(trMain).find('td:eq(' + ULDNoIndex + ')').text() != "BULK") {
                    var nestedGridHeader = $(trMain).next().find("div.k-grid-header");
                    $(nestedGridHeader).find("th:eq(1)").hide();

                    var nestedGridContent = $(trMain).next().find("div.k-grid-content > table > tbody  tr");
                    $(nestedGridContent).each(function (rowChild, trChild) {
                        $(trChild).find('td:eq(1)').hide();
                    });
                }
            });

            if ($(trMain).find('td:eq(' + IsDisabledULDIndex + ')').text() == "true") {
                $(trMain).find('input[type=text],input[type=checkbox]').attr('disabled', 1);
                // $(trChild).find('a[class="removed label label-danger"').removeAttr('onclick');
               
            }
            if ($(trMain).find('td:eq(' + isSelected + ')').text() == "true") {
                $("#btnSaveGatePass").hide();

            }
            //else
            //{
            //    $("#btnSaveGatePass").show();
            //}
            // IsDisabledULDIndex
        }
        ////var RFSRemarksIndex = Rowtr.find("th[data-field='RFSRemarks']").index();
        //var controlId = $(trMain).find("input[type='text'][controltype='autocomplete']").attr("id"); // by parvez khan
        //cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), GetFlightRouteArray());
        //$("#" + controlId).data("kendoAutoComplete").setDefaultValue($("#" + controlId.replace("Text_", "")).val() == "" ? GetFlightRouteArray()[0].Key : $("#" + controlId.replace("Text_", "")).val(), $("#" + controlId.replace("Text_", "")).val() == "" ? GetFlightRouteArray()[0].Text : $("#" + controlId.replace("Text_", "")).val());
        //if (GetFlightRouteArray().length == 1)
        //    $("#" + controlId).data("kendoAutoComplete").enable(false);
        //fn_CheckOffpointMendetory(controlId);

    });
    ////for RFS Remarks
    var grid = $("#divDetail").find(".k-grid:eq(0)").data("kendoGrid");
    grid.hideColumn("RFSRemarks");
    $("th[data-field='RFSRemarks'],td[data-column='RFSRemarks']").hide();

    //  Rowtr.find("th[data-field='RFSRemarks']").hide();
    // $(trMain).find('td:eq(' + RFSRemarksIndex + ')').hide();
    if (ManageCTMStatus == "PREUPDATE" || ManageCTMStatus == "BUP") {
        if (IsRFS) {
            grid.showColumn("RFSRemarks");
            $("th[data-field='RFSRemarks'],td[data-column='RFSRemarks']").show();
            // Rowtr.find("th[data-field='RFSRemarks']").show();
            // $(trMain).find('td:eq(' + RFSRemarksIndex + ')').show();
        }
    }
    /////end

    //    $("#chkAllBox").prop('disabled', 'disabled');
    checkBoxSelected();
}


function fn_HideBulkChild(asd, asdf) {
    var vgrid = cfi.GetCFGrid("divDetail");
    var expanededUldStockSno = vgrid.options.parentValue;
    var CurrentDivID = "div__" + expanededUldStockSno;
    $("#divDetail").find('input:checkbox:eq(1)').hide();
    $('#divDetail table tbody tr[class~="k-master-row"]').each(function (rowmain, trMain) {
        var Rowtr = $(trMain).closest("div.k-grid").find("div.k-grid-header:first");
        var ULDNoIndex = Rowtr.find("th[data-field='ULDNo']").index();
        //var IsDisabledULDIndex = Rowtr.find("th[data-field='IsDisabledULD']").index();
        var nestedGridHeader = $(trMain).next().find("div.k-grid-header");
        //var IsCTMIndex = nestedGridHeader.find("th[data-field='IsCTM']").index();
        //var IsBULKIndex = nestedGridHeader.find("th[data-field='Bulk']").index();
        //var ChildRFSRemarksIndex = nestedGridHeader.find("th[data-field='RFSRemarks']").index();//for RFS Remarks
        //var ParrentRFSRemarksIdx = Rowtr.find("th[data-field='RFSRemarks']").index();//for RFS Remarks
        //var AWBOffPointIndex = nestedGridHeader.find("th[data-field='AWBOffPoint']").index();

        if ($(nestedGridHeader).parent().attr('id') == CurrentDivID) {
            ////////////Default Hide For Other Flight////////////////
            // $(nestedGridHeader).find("th:eq(" + ChildRFSRemarksIndex + ")").hide();

            //////////////////////////////////////////411
            //if (ManageCTMStatus == "PREUPDATE" || ManageCTMStatus == "BUP") {
            //    $(nestedGridHeader).find("th:eq(" + IsCTMIndex + ")").hide();
            //    if (IsRFS) {
            //        $(nestedGridHeader).find("th:eq(" + ChildRFSRemarksIndex + ")").show();//for rfs
            //    }
            //}
            if ($(trMain).find('td:eq(' + ULDNoIndex + ')').text() != "BULK") {
                //$(nestedGridHeader).find("th:eq(" + IsCTMIndex + ")").closest('table').find('colgroup').remove();
                $(nestedGridHeader).find("th:eq(0)").hide();
                //$(nestedGridHeader).find("th:eq(" + IsBULKIndex + ")").hide();
                //$(nestedGridHeader).find("th:eq(" + AWBOffPointIndex + ")").hide();
                //$(nestedGridHeader).find("th:eq(" + ChildRFSRemarksIndex + ")").hide();//for RFS Remarks
                var nestedGridContent = $(trMain).next().find("div.k-grid-content > table > tbody  tr");
                $(nestedGridContent).each(function (rowChild, trChild) {
                    //$(trChild).find('td:eq(' + ChildRFSRemarksIndex + ')').hide()//for RFS Remarks
                    //$(trChild).find('td:eq(' + IsCTMIndex + ')').closest('table').find('colgroup').remove()
                    //$(trChild).find('td:eq(' + IsBULKIndex + ')').hide();
                    //$(trChild).find('td:eq(' + AWBOffPointIndex + ')').hide();
                    $(trChild).find('td:eq(0)').hide();
                    //   $(trChild).find('td:eq(' + ChildRFSRemarksIndex + ')').hide()//for RFS Remarks
                    //if (ManageCTMStatus == "PREUPDATE" || ManageCTMStatus == "BUP") {
                    //    $(trChild).find('td:eq(' + IsCTMIndex + ')').hide();
                    //}
                    //else
                    //  $(trChild).find('td:eq(' + ChildRFSRemarksIndex + ')').hide();// for RFS Remarks
                });
            }
            else {
                var nestedGridHeader = $(trMain).next().find("div.k-grid-header");

                $(trMain).find('td[class="k-hierarchy-cell"]').find('a[class="k-icon k-plus"]').trigger("click");
                var nestedGridContent = $(trMain).next().find("div.k-grid-content > table > tbody  tr");
                //var IsPreManifestIndex = nestedGridHeader.find("th[data-field='IsPreManifested']").index();
            }
        }
    });
    //checkBoxSelected();
}

function fn_HideBulkChildCopy(asd, asdf) {
    var vgrid = cfi.GetCFGrid("divDetail");
    var expanededUldStockSno = vgrid.options.parentValue;
    var CurrentDivID = "div__" + expanededUldStockSno;
    $("#divDetail").find('input:checkbox:eq(1)').hide();
    $('#divDetail table tbody tr[class~="k-master-row"]').each(function (rowmain, trMain) {
        var Rowtr = $(trMain).closest("div.k-grid").find("div.k-grid-header:first");
        var ULDNoIndex = Rowtr.find("th[data-field='ULDNo']").index();
        var IsDisabledULDIndex = Rowtr.find("th[data-field='IsDisabledULD']").index();
        var nestedGridHeader = $(trMain).next().find("div.k-grid-header");
        var IsCTMIndex = nestedGridHeader.find("th[data-field='IsCTM']").index();
        var IsBULKIndex = nestedGridHeader.find("th[data-field='Bulk']").index();
        var ChildRFSRemarksIndex = nestedGridHeader.find("th[data-field='RFSRemarks']").index();//for RFS Remarks
        var ParrentRFSRemarksIdx = Rowtr.find("th[data-field='RFSRemarks']").index();//for RFS Remarks
        var AWBOffPointIndex = nestedGridHeader.find("th[data-field='AWBOffPoint']").index();

        if ($(nestedGridHeader).parent().attr('id') == CurrentDivID) {
            ////////////Default Hide For Other Flight////////////////
            $(nestedGridHeader).find("th:eq(" + ChildRFSRemarksIndex + ")").hide();

            //////////////////////////////////////////
            if (ManageCTMStatus == "PREUPDATE" || ManageCTMStatus == "BUP") {
                $(nestedGridHeader).find("th:eq(" + IsCTMIndex + ")").hide();
                if (IsRFS) {
                    $(nestedGridHeader).find("th:eq(" + ChildRFSRemarksIndex + ")").show();//for rfs
                }
            }
            if ($(trMain).find('td:eq(' + ULDNoIndex + ')').text() != "BULK") {
                $(nestedGridHeader).find("th:eq(" + IsCTMIndex + ")").closest('table').find('colgroup').remove();
                $(nestedGridHeader).find("th:eq(0)").hide();
                $(nestedGridHeader).find("th:eq(" + IsBULKIndex + ")").hide();
                $(nestedGridHeader).find("th:eq(" + AWBOffPointIndex + ")").hide();
                $(nestedGridHeader).find("th:eq(" + ChildRFSRemarksIndex + ")").hide();//for RFS Remarks
                var nestedGridContent = $(trMain).next().find("div.k-grid-content > table > tbody  tr");
                $(nestedGridContent).each(function (rowChild, trChild) {
                    $(trChild).find('td:eq(' + ChildRFSRemarksIndex + ')').hide()//for RFS Remarks
                    $(trChild).find('td:eq(' + IsCTMIndex + ')').closest('table').find('colgroup').remove()
                    $(trChild).find('td:eq(' + IsBULKIndex + ')').hide();
                    $(trChild).find('td:eq(' + AWBOffPointIndex + ')').hide();
                    $(trChild).find('td:eq(0)').hide();
                    //   $(trChild).find('td:eq(' + ChildRFSRemarksIndex + ')').hide()//for RFS Remarks
                    if (ManageCTMStatus == "PREUPDATE" || ManageCTMStatus == "BUP") {
                        $(trChild).find('td:eq(' + IsCTMIndex + ')').hide();
                    }
                    //else
                    //  $(trChild).find('td:eq(' + ChildRFSRemarksIndex + ')').hide();// for RFS Remarks
                });
            }
            else {
                var nestedGridHeader = $(trMain).next().find("div.k-grid-header");

                $(trMain).find('td[class="k-hierarchy-cell"]').find('a[class="k-icon k-plus"]').trigger("click");
                var nestedGridContent = $(trMain).next().find("div.k-grid-content > table > tbody  tr");
                var IsPreManifestIndex = nestedGridHeader.find("th[data-field='IsPreManifested']").index();
                $(nestedGridContent).each(function (rowChild, trChild) {
                    $(trChild).find('td:eq(' + ChildRFSRemarksIndex + ')').hide()//for RFS Remarks
                    if (ManageCTMStatus == "PREUPDATE" || ManageCTMStatus == "BUP") {
                        $(trChild).find('td:eq(' + IsCTMIndex + ')').hide();
                        if (IsRFS) {
                            $(trChild).find('td:eq(' + ChildRFSRemarksIndex + ')').show();//for RFS Remarks
                        }
                    }

                    if ($(trChild).find('td:eq(' + IsPreManifestIndex + ')').text() == "true") {
                        $(trChild).find('input[type=text],input[type=checkbox]').attr('disabled', 1);
                    }

                    //var controlId = $(trChild).find("input[type='text'][controltype='autocomplete']").attr("id");
                    //cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), GetFlightRouteArray());
                    //$("#" + controlId).data("kendoAutoComplete").setDefaultValue($("#" + controlId.replace("Text_", "")).val() == "" ? GetFlightRouteArray()[0].Key : $("#" + controlId.replace("Text_", "")).val(), $("#" + controlId.replace("Text_", "")).val() == "" ? GetFlightRouteArray()[0].Text : $("#" + controlId.replace("Text_", "")).val());
                    //if (GetFlightRouteArray().length == 1)
                    //    $("#" + controlId).data("kendoAutoComplete").enable(false);

                    //fn_CheckOffpointMendetory(controlId);

                });
            }
        }
    });

    //});
    checkBoxSelected();
}
function BindEvents(input, e) {
    subprocess = $(input).attr("process").toUpperCase();
    subprocesssno = $(input).attr("subprocesssno").toUpperCase();

    var trRow = $(input).closest("div.k-grid").find("div.k-grid-header");
    var GatePassSNo = trRow.find("th[data-field='GatePassSNo']").index();
    var FlightNoIndex = trRow.find("th[data-field='FlightNo']").index();
    var FlightDateIndex = trRow.find("th[data-field='FlightDate']").index();
    var BoardingPointIndex = trRow.find("th[data-field='BoardingPoint']").index();
    var EndPointIndex = trRow.find("th[data-field='EndPoint']").index();
    var DailyFlightSNoIndex = trRow.find("th[data-field='DailyFlightSNo']").index();

    GatePassSNo = $(input).closest('tr').find("td:eq(" + GatePassSNo + ")").text();
    hdnGatePassSNo = GatePassSNo;
    var FlightNo = $(input).closest('tr').find("td:eq(" + FlightNoIndex + ")").text();
    var FlightDate = $(input).closest('tr').find("td:eq(" + FlightDateIndex + ")").text();
    var BoardingPoint = $(input).closest('tr').find("td:eq(" + BoardingPointIndex + ")").text();
    var EndPoint = $(input).closest('tr').find("td:eq(" + EndPointIndex + ")").text();
    var DailyFlightSNo = $(input).closest('tr').find("td:eq(" + DailyFlightSNoIndex + ")").text();

    if (subprocess == 'GATEPASS') {
        $("#__divgatepasssearchnew__").hide();
        $('#btn_Print').show();
        $("#divContentDetail").show();
        ShowIndexView("divDetail", "Services/GatePass/GatePassService.svc/GetFlightTransGridData/GATEPASS/GatePass/MANIFESTULD/" + FlightNo.trim() + "/" + "GATEPASSULD" + "/" + "0" + "/" + "0" + "/" + FlightDate.trim() + "/" + GatePassSNo);
        
        // Add By Sushnat Kumar Nayak ON 04-08-2018 Desc Permission 
        if (isCreate == false) {
            $("#btnNewGatePass").hide();
        } else {
            $("#btnNewGatePass").show();
        }

        $(userContext.ProcessRights).each(function (i, e) {
            if (e.SubProcessSNo == subprocesssno) {
                isView = e.IsView;
                return;
            }
        });
        if (isView) {
            $("#btnSaveGatePass").hide();

        }
        else {
            $("#btnSaveGatePass").show();

        }


        //$("#divDetail").find('input:checkbox:eq(1)').hide();
    }
    else {
        fun_PrintByProcess(DailyFlightSNo, GatePassSNo);
    }
}
function fn_OnFlightSuccessGrid(e) {
    //var trHeaderMainRow = $("#divFlightDetails").find("div.k-grid-header");
    //var IsNILManifestIndex = trHeaderMainRow.find("th[data-field='IsNILManifested']").index();
    //var IsFlightStatusIndex = trHeaderMainRow.find("th[data-field='FlightStatus']").index();
    //var IsCargoTransferedInx = trHeaderMainRow.find("th[data-field='IsCargoTransfered']").index();
    //$('#divFlightDetails table tbody tr').each(function (row, tr) {
    //    $(tr).removeAttr("style");
    //    if ($(tr).find(' td:eq(' + IsNILManifestIndex + ')').text() == "true")
    //        $(tr).css('background-color', 'rgba(204, 39, 39, 0.22)');//.css('color', 'white');
    //    if ($(tr).find(' td:eq(' + IsCargoTransferedInx + ')').text() == "true" && $(tr).find(' td:eq(' + IsNILManifestIndex + ')').text() == "false")
    //        $(tr).css('background-color', 'rgba(159, 123, 246, 0.31)');//.css('color', 'white');
    //    //$(tr).css('background-color', '#9f7bf6');//.css('color', 'white');
    //    if ($(tr).find(' td:eq(' + IsFlightStatusIndex + ')').text() == "CLSD") {
    //        $(tr).find('input[type="button"][subprocesssno="2336"]').attr('title', 'Flight Closed');
    //        $(tr).find('input[type="button"][subprocesssno="2336"]').val('CLSD');
    //    }


    //});
    //$("#divFlightDetails").unbind('mousedown').bind('mousedown', function (obj) {
    //    if (obj.target.type == 'button')
    //        IsButtonClick = true;
    //    else
    //        IsButtonClick = false;
    //});
}
function MarkSelected(input) {
    debugger;
    IsBulkSelected = false;
    var td = $(input).parent();
    if (IsRFS) {
        var ULDCount = 0;
        if (!IsBulkSelected)
            fn_CheckRFSValidation(input);
    }
    //if (IsPAX)
    //{
    //    var trGridHeader = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    //    var SHCIndex = trGridHeader.find("th[data-field='SHC']").index();
    //    var AWBNoIndex = trGridHeader.find("th[data-field='AWBNo']").index();
    //    var tr = $(input).closest('tr');
    //   // if ($(tr).find('td:eq(' + SHCIndex + ')').text() == "CAO")
    //    var SHC=','+$(tr).find('td:eq(' + SHCIndex + ')').text().toLowerCase()+',';    
    //    if (SHC.indexOf(",cao,") >= 0)
    //    {
    //        ShowMessage('warning', "Warning ","AWB '" + $(tr).find('td:eq(' + AWBNoIndex + ')').text() + "' with SHC-CAO ( Cargo Aircraft only ) not allowed on Passenger Flight '"+$("#tdFlightNo").text()+"'/"+$("#tdFlightDate").text()+"", "bottom-right");
    //        $(input).prop('checked', false);
    //    }
    //    //IsPAX
    //}
    var trHeader = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    if ($(td).find('input[type="hidden"]').val() == "true") {
        // alert('Shipment onhold');
        var HoldRemarksIndex = trHeader.find("th[data-field='HOLDRemarks']").index();
        var AWBSNoIndex = trHeader.find("th[data-field='AWBSNo']").index();
        var AWBNoIndex = trHeader.find("th[data-field='AWBNo']").index();
        var TotalPPcsIndex = trHeader.find("th[data-field='TotalPPcs']").index() == -1 ? trHeader.find("th[data-field='OLCPieces']").index() : trHeader.find("th[data-field='TotalPPcs']").index();

        var PlannedPiecesIndex = trHeader.find("th[data-field='PlannedPieces']").index();

        if ((SaveProcessStatus == "PRE" && $("#btnSave").text().toUpperCase() == "SAVE MANIFEST") || SaveProcessStatus == "MAN") {
            var ProcessedPCs;
            if (trHeader.find("th[data-field='OLCPieces']").index() > -1)
                ProcessedPCs = 0;
            else
                ProcessedPCs = SaveProcessStatus == "MAN" ? parseInt($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text()) : 0;
            var AvailableProcssPcs = fn_CheckOnHoldPcs($(input).closest('tr').find('td:eq(' + AWBSNoIndex + ')').text(), ProcessedPCs, "A");

            if (AvailableProcssPcs <= 0) {
                $(input).prop('checked', false);
                // ShowMessage('warning', "Warning -Shipment ", $(input).closest('tr').find('td:eq(' + HoldRemarksIndex + ')').text() + ". cannot process", "bottom-right");
                ShowMessage('warning', "Warning -Shipment ", "Few pieces of shipment '" + $(input).closest('tr').find('td:eq(' + AWBNoIndex + ')').text() + "' are '" + $(input).closest('tr').find('td:eq(' + HoldRemarksIndex + ')').text() + "'.Kindly cross check and plan the remaining pieces accordingly", "bottom-right");
            }
            else if (parseInt($(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type="text"] ').val()) > AvailableProcssPcs) {
                $(input).prop('checked', false);
                //  ShowMessage('warning', "Warning -Shipment ", $(input).closest('tr').find('td:eq(' + HoldRemarksIndex + ')').text() + ". cannot process more than " + AvailableProcssPcs + " piece", "bottom-right");
                ShowMessage('warning', "Warning -Shipment ", "Few pieces of shipment '" + $(input).closest('tr').find('td:eq(' + AWBNoIndex + ')').text() + "' are '" + $(input).closest('tr').find('td:eq(' + HoldRemarksIndex + ')').text() + "'.Kindly cross check and plan the remaining pieces accordingly", "bottom-right");
            }
        }
        else {
            ShowMessage('warning', "Warning -Shipment ", "Few pieces of shipment '" + $(input).closest('tr').find('td:eq(' + AWBNoIndex + ')').text() + "' are '" + $(input).closest('tr').find('td:eq(' + HoldRemarksIndex + ')').text() + "'.Kindly cross check and plan the remaining pieces accordingly", "bottom-right");
        }
    }
}
function fun_PrintByProcess(DailyFlightSNo, GatePassSNo) {
    //$('#divAction').hide();
    $("#tdNILManifest,#tdATDTime,#tdATDDate,#tdManRemarks,#tdManifestRemarks,#tdregnNo,#tdregnNoTxt").hide();
    $('#rbNormal').prop('checked', true);
    GetManifestReportData(DailyFlightSNo, 'N', GatePassSNo);
    $("#dv_FlightManifestPrint").hide();
}
function currentDate() {
    var currentDate = new Date;
    var Day = currentDate.getDate();
    if (Day < 10) {
        Day = '0' + Day;
    } //end if
    var Month = currentDate.getMonth() + 1;
    if (Month < 10) {
        Month = '0' + Month;
    } //end if
    var Year = currentDate.getFullYear();
    var fullDate = Day + '/' + Month + '/' + Year;
    return fullDate;
} //end current date function
function GetManifestReportData(FlightSNo, Type, GatePassSNo) {
    var time_t = "";
    var d = new Date();
    var cur_hour = d.getHours();

    (cur_hour < 12) ? time_t = "AM" : time_t = "PM";
    (cur_hour == 0) ? cur_hour = 12 : cur_hour = cur_hour;
    (cur_hour > 12) ? cur_hour = cur_hour - 12 : cur_hour = cur_hour;
    var curr_min = d.getMinutes().toString();
    var curr_sec = d.getSeconds().toString();
    if (curr_min.length == 1) { curr_min = "0" + curr_min; }
    if (curr_sec.length == 1) { curr_sec = "0" + curr_sec; }
    var CurrTime = cur_hour + ":" + curr_min + ":" + curr_sec + " " + time_t;


    var trno = 0;

    $("#divDetail,#divStopOverDetail").html("");
    var FlightSNoArray = FlightSNo.split(',');
    var Tabl = "";
    $("#divDetail").empty();
    $(FlightSNoArray).each(function (r, i) {
        $.ajax({
            url: "Services/GatePass/GatePassService.svc/GetManifestReport",
            async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ DailyFlightSNo: i, Type: Type, GatePassSNo: GatePassSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var es = JSON.parse(result);
                var msgCheck = es.Table3[0].msg.split('?');
                //var msg = es.Table0[0].msg.split('?')[1];
                //if (msgCheck == "1") {
                //    ShowMessage('warning', 'Warning -Shipment ', msg, "bottom-right");
                //}
                //else {
                if (es.Table1.length > 0) {
                    $("#btnPrint").closest('tr').hide();
                    $('#SecondTab').hide();
                    $('#OSCTab').hide();
                    $('#FlightStopOverDetailTab').hide();
                    $("#btnNewGatePass").hide();
                    $("#btnSaveGatePass").hide();
                    //alert(msgCheck[0] + "" + msgCheck[1])
                    if (msgCheck[0] == 1) {
                        ShowMessage('warning', 'Warning -Shipment ', msgCheck[1], "bottom-right");
                    }
                    else {
                        Tabl += '<table id="tblReport" align="center" style="border: 1px solid black;width:50%" cellpadding="0" cellspacing="0">';
                        Tabl += '<tbody>';
                        Tabl += '<tr align="center"><td style="font: bold;" colspan="1"></td><td colspan="8" style="font: bold;"><h2>DELIVERY CARGO/BAGGAGE</h2> </td>';
                        Tabl += '<td style="font: bold;" colspan="1"><h2>' + es.Table0[0].GatePassNo + '</h2> </td></tr>';
                        Tabl += '<tr align="right" style="height: 10px;"><td colspan="10">&nbsp;</td></tr>';
                        Tabl += '<tr align="center">';
                        Tabl += '<td colspan="10" style="font: bold;">';
                        //table 2
                        Tabl += '<table style="width: 100%;">';
                        Tabl += '<tbody>';
                        Tabl += '<tr><td align="left" style="font: bold;padding-left: 5px;width: 25%;">FROM: ' + es.Table1[0].FlightOrigin + '</td>'
                        // Changes By Vipin Kumar
                        //Tabl += '<td align="left" style="font: bold;padding-left: 5px;width: 25%;">TIME: ' + CurrTime + '</td>';
                        Tabl += '<td align="left" style="font: bold;padding-left: 5px;width: 25%;">TIME: ' + es.Table0[0].LoginTime + '</td>';
                        //ends
                        Tabl += '<td align="left" style="font: bold;padding-left: 5px;width: 25%;">TO: ' + es.Table1[0].FlightDestination + '</td>';
                        Tabl += '<td align="left" style="font: bold;padding-left: 5px;width: 25%;">ETA: ' + es.Table0[0].ATA + '</td></tr>';
                        Tabl += '<tr><td align="left" style="font: bold;padding-left: 5px;width: 25%;">Aircraft No.:' + es.Table0[0].AircraftRegistrationNo + '</td>';
                        Tabl += '<td align="left" style="font: bold;padding-left: 5px;width: 25%;">AIRLINE: ' + es.Table0[0].airlinename + '</td>';
                        Tabl += '<td align="left" style="font: bold;padding-left: 5px;width: 25%;">ETD: ' + es.Table0[0].ETD + '</td>';
                        Tabl += '<td align="left" style="font: bold;padding-left: 5px;width: 25%;">DATE: ' + es.Table0[0].SystemDate + '</td></tr>';
                        Tabl += '</tbody>';
                        //table 3
                        Tabl += '</table></td>';
                        Tabl += '</tr><tr align="center"><td colspan="2" style="text-align: center;" class="grdTableHeader">No</td>';
                        Tabl += '<td colspan="2" style="text-align: center;" class="grdTableHeader"> ULD Serial No/AWB No</td><td colspan="2" style="text-align: center;" class="grdTableHeader">Category</td>';
                        Tabl += '<td colspan="2" style="text-align: center;" class="grdTableHeader">Destination</td><td colspan="2" style="text-align: center;" class="grdTableHeader">Pcs/Weight</td></tr>';

                        if (es.Table1.length > 0) {
                            for (var i = 0; i < es.Table1.length; i++) {
                                var Sno = i + 1;
                                if (es.Table1[i].ULDNOSORT == "U") {
                                    Tabl += '<tr align="center" class="grdTableRow"><td colspan="2" style="width:20px;">' + Sno + '</td>'
                                    Tabl += '<td colspan="2">' + es.Table1[i].ULDNo + '</td><td colspan="2">' + es.Table1[i].SPHC + '</td>'
                                    Tabl += '<td colspan="2">' + es.Table1[i].FlightDestination + '</td>';
                                    Tabl += '<td colspan="2">' + es.Table1[i].PlannedGrossWeight + '</td></tr>'
                                }
                                else if (es.Table1[i].ULDNOSORT == "B") {
                                    if (trno == 0) {
                                        Tabl += '<tr align="left" class="grdTableRow"><td colspan="10">BULK</td></tr>'
                                        trno += 1;
                                    }
                                    Tabl += '<tr align="center" class="grdTableRow"><td colspan="2" style="width:20px;">' + Sno + '</td>'
                                    Tabl += '<td colspan="2">' + es.Table1[i].AWBNo + '</td><td colspan="2">' + es.Table1[i].SPHC + '</td>'
                                    Tabl += '<td colspan="2">' + es.Table1[i].FlightDestination + '</td>';
                                    Tabl += '<td colspan="2">' + es.Table1[i].PlannedGrossWeight + '</td></tr>'
                                }
                                else {
                                    Tabl += '<tr align="center" class="grdTableRow"><td colspan="2" style="width:20px;">' + Sno + '</td>'
                                    Tabl += '<td colspan="2">' + es.Table1[i].AWBNo + '</td><td colspan="2">' + es.Table1[i].SPHC + '</td>'
                                    Tabl += '<td colspan="2">' + es.Table1[i].FlightDestination + '</td>';
                                    Tabl += '<td colspan="2">' + es.Table1[i].PlannedGrossWeight + '</td></tr>'
                                }
                            }
                        }

                        Tabl += '<tr style="height: 50px;" align="center">';
                        Tabl += '<td colspan="3">WAREHOUSE TERMINAL</td><td colspan="3">OPERATOR</td>';
                        Tabl += '<td colspan="4">LOAD MASTER</td></tr>';
                        Tabl += '<tr style="height: 50px;" align="center">'
                        Tabl += '<td colspan="3"> ------------</td><td colspan="3">------------</td><td colspan="4">------------</td></tr>'
                        Tabl += '<tr align="right" style="height: 50px;"><td colspan="11">&nbsp;</td></tr>';
                        Tabl += '<tr style="font-weight: bold;"><td valign="top" style="padding-left: 20px;">Note:</td>';
                        Tabl += '<td colspan="8" align="left">DOLUES PLT ON AIR SIDE TIME:</td></tr>';
                        Tabl += '<tr style="font-weight: bold;"><td valign="top" style="padding-left: 20px;"></td>';
                        Tabl += '<td colspan="8" align="left">LD3 ON AIR SIDE TIME:</td></tr>';
                        Tabl += '<tr align="right" style="height: 20px;"><td colspan="11">&nbsp;</td></tr>'
                        Tabl += '<tr style="font-weight: bold;"><td valign="top" style="padding-left: 20px;"></td>'
                        Tabl += '<td colspan="8" align="left">CARTS      ON AIR SIDE TIME:</td></tr>';
                        Tabl += '<tr align="right" style="height: 20px;"><td colspan="11">&nbsp;</td></tr>'
                        Tabl += '<tr align="right" class="grdTableRow" id="PrintTr"><td colspan="12"><input id="btnPrint" type="button" value="Print" class="no-print"></td></tr>';
                        Tabl += '</tbody>';
                        Tabl += '</table>'
                        $("#divContentDetail").show();
                        $("#divDetail").append(Tabl);
                        $("#divDetail").append('</br><div class="page-break"></div>');
                    }
                    //}
                }
            }
        });

    });

    $("#divDetail #btnPrint:last").unbind("click").bind("click", function () {
        $("#divDetailPrint #divDetail").printArea();
    });
    $("#divDetail #btnPrint:last").closest('tr').show();

}

//function GetManifestReportDataOld(FlightSNo, Type, GatePassSNo) {
//    $("#divDetail,#divStopOverDetail").html("");
//    var FlightSNoArray = FlightSNo.split(',');
//    $(FlightSNoArray).each(function (r, i) {
//        // if (r < (FlightSNoArray.length - 1)) {

//        $.ajax({
//            url: "Services/GatePass/GatePassService.svc/GetManifestReport?DailyFlightSNo=" + i + "&Type=" + Type + "&GatePassSNo=" + GatePassSNo,
//            async: false, type: "POST", dataType: "json", cache: false,
//            contentType: "application/json; charset=utf-8",
//            success: function (result) {
//                alert(JSON.parse(result))
//                $("#btnPrint").closest('tr').hide();
//                $('#SecondTab').hide();
//                $('#OSCTab').hide();
//                $('#FlightStopOverDetailTab').hide();
//                $("#divContentDetail").show();
//                $("#divDetail").append('</br><div class="page-break"></div>');
//                if (result.split('?')[0] == '1') {
//                    ShowMessage('warning', 'Warning -Shipment ', result.split('?')[1], "bottom-right");
//                }
//                else {
//                    $("#divContentDetail").show();
//                    $("#divDetail").append(result);
//                    $("#divDetail").append('</br><div class="page-break"></div>');
//                }
//            },
//            error: {

//            }
//        });
//        // }
//    });
//    $("#divDetail #btnPrint:last").unbind("click").bind("click", function () {
//        $("#divDetailPrint #divDetail").printArea();
//    });
//    $("#divDetail #btnPrint:last").closest('tr').show();

//}
function checkBoxSelected() {
    var chkFlag = 0, chkDisabled = 0;
    var inputCheckBoxLength = $("#divDetail input:checkbox").length - 1;
    var chkFlag = 0;
    $("#divDetail input:checkbox").each(function (row, tr) {
        if ($(tr).attr('id') != "chkAllBox") {
            if ($(tr).prop('checked')) {
                chkFlag++;
            }
            //if ($(tr).attr('disabled') == 'disabled') {
            //    chkDisabled = 1;
            //}
        }
    })
    // alert(chkFlag)
    if (inputCheckBoxLength == chkFlag) {
        $("#chkAllBox").prop('checked', 1);
        $("#chkAllBox").prop("disabled", true);
        $("#btnSaveGatePass").hide();
    }
    else {
        $("#chkAllBox").prop('checked', 0);
        $("#chkAllBox").prop("disabled", false);
        $("#btnSaveGatePass").show();
    }
    //if (chkDisabled == 1)
    //    $("#chkAllBox").prop('disabled', 'disabled');
    //else
    //    $("#chkAllBox").prop('disabled', '');
}
function checkOnHold(input) {
    //var td = $(input).parent();

    //if ($(td).find('input[type="hidden"]').val().split('@')[0] != "0") {
    //    $(input).prop('checked', false);
    //    var msgString = '';
    //    var AWBArray = $(td).find('input[type="hidden"]').val().split('@')[0];
    //    var HOLDRemarksArray = $(td).find('input[type="hidden"]').val().split('@')[1];
    //    $(AWBArray.split('^')).each(function (r, i) {
    //        msgString = msgString + '<tr><td>' + i + ',' + HOLDRemarksArray.split('^')[r] + '</td></tr>';
    //    });
    //    msgString = '<table>' + msgString + '</table>';

    //    ShowMessage('warning', 'Warning -Shipment ', msgString, "bottom-right");
    //}
    //fn_CheckRFSValidation(input);
    return true;

    //$("#btnSaveGatePass").prop("disabled", true);
    //$("#chkbtnSelect").change(function ()
    //{
    //    if (this.checked)
    //    {
    //        $("#btnSaveGatePass").show();
    //       //$("#btnSaveGatePass").prop('disabled', false);
    //    }
    //});

    // $("#divDetail input[type='checkbox'][disabled!='disabled']").prop('checked', $(input).prop("checked"));
    //$("#divDetail input[type='checkbox'][disabled!='disabled'][id!='chkAllBox']").each(function (){
    //    if ($(this).prop("checked"))
    //        $("#divDetail input[type='checkbox']").each(function () {
    //            $(this).find("[id='chkBulk']").prop('checked', $(input).prop("checked"));
    //        });
    //    else
    //        $("#divDetail input[type='checkbox']").each(function () {
    //            $(this).find("[id='chkBulk']").prop('checked', 0);
    //        });


    //});
    //MarkSelected(input);
    // $().each(function (row,tr) {

    //  });

}
////////////////////////////////////////////////////////////////////////////////////////
var IsNILLManifestMsgFlag;
var subprocess, subprocesssno;
var SaveProcessStatus;
var FlightRoute = "";
var IsFlightClosed = false;
var TotalAWBGrossWT = 0, TotalAWBVolumeWT = 0, TotalAWBCBMWT = 0;
function GetFlightRoute(Route) {
    var Arr = Route.split('-');
    var FRoute = "";
    $(Arr).each(function (row, tr) {
        FRoute += "'" + tr + "',";
    });
    return FRoute.substr(0, FRoute.length - 1);
}

///////////// for Partner Carrier Code ////////////////////
function GetPartnerCarrierCode(PartnerCarrierCode) {
    var Arr = PartnerCarrierCode.split(',');
    var FPartnerCarrierCode = "";
    $(Arr).each(function (row, tr) {
        FPartnerCarrierCode += "'" + tr + "',";
    });
    return FPartnerCarrierCode.substr(0, FPartnerCarrierCode.length - 1);
}

function GetFlightSortRoute(Route) {
    var Arr = Route.split('-');
    var FRoute = "";
    var LoginCityIndex = Arr.indexOf(userContext.AirportCode);
    $(Arr).each(function (row, tr) {
        if (row > LoginCityIndex)
            FRoute += "'" + tr + "',";
    });
    return FRoute.substr(0, FRoute.length - 1);
}

function GetFlightFilterRoute(Route) {
    var Arr = Route.split('-');
    var FRoute = "";
    $(Arr).each(function (row, tr) {
        FRoute += tr + ",";
    });
    return FRoute.substr(0, FRoute.length - 1);
}
function GetFlightSSFilterRoute(Route) {
    var Arr = Route.split('-');
    var FRoute = "";
    $(Arr).each(function (row, tr) {
        if (tr != userContext.AirportCode)
            FRoute += tr + ",";
    });
    return FRoute.substr(0, FRoute.length - 1);
}
//adding for from date and end Date
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
//end

//adding func for validating from date and to date

function ValidateDate() {
    var FromDate = $("#FromFlightdate").attr("sqldatevalue");
    var ToDate = $("#ToFlightdate").attr("sqldatevalue");
    if (FromFlightDate != '' && ToFlightDate != '') {
        if (Date.parse(FromDate) > Date.parse(ToDate)) {
            $('#FromFlightdate').data("kendoDatePicker").value();
            $('#ToFlightDate').data("kendoDatePicker").value();
            $("#FromFlightdate").val();
            $("#ToFlightdate").val();
            ShowMessage('warning', 'Warning - Flight Control', "From date should not be greater than To date.");
        }
    }
}
//end
function InstantiateControl(containerId) {
    $("#" + containerId).find("input[type='text']").each(function () {
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
                //            $(this).css("text-align", "right");
                cfi.Numeric(controlId, decimalPosition, true);
            }

            else {
                var alphabetstyle = cfi.IsValidSpanAlphabet(controlId);
                if (alphabetstyle != "") {
                    if (alphabetstyle == "datetype") {
                        cfi.DateType(controlId, true);
                    }
                    //                                else {
                    //                                    cfi.AlphabetTextBox(controlId, alphabetstyle);
                    //                                }
                }
            }
        }
    });
    SetDateRangeValue();

    //$("#" + containerId).find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
    //    if ($(this).attr("recname") == undefined) {
    //        var controlId = $(this).attr("id");
    //        cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), _DefaultAutoComplete_);
    //    }
    //});
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
    //$("div[id^='divareaTrans_'][cfi-aria-trans='trans']").each(function () {
    //    var transid = this.id.replace("divareaTrans_", "");
    //    cfi.makeTrans(transid, null, null, null, null, null, null);
    //});
    //    $("td.formtwoInputcolumn").html("TEST<STRONG>ASDFA<EM>SASDFASDF</EM></STRONG>");
    //    ChangeAllControlToLable("aspnetForm");
}
function ResetAutoComplete(obj) {
    cfi.ResetAutoComplete("txtDestinationCity");
}
function AddOnChange(that) {
    if (that.sender.options.addOnChange !== null) {
        if (typeof window[that.sender.options.addOnChange] === "function")
            window[that.sender.options.addOnChange](that.sender.element.attr("id"));
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
function ExtraCondition(textId) {
    //Text_txtDestinationCity
    var filterDestinationCity = cfi.getFilter("AND");
    var filterOSCDestinationCity = cfi.getFilter("AND");
    var FlightOSCLyingFilter = cfi.getFilter("AND");
    var FlightLyingFilter = cfi.getFilter("AND");
    var FlightNoFilter = cfi.getFilter("AND");
    if (textId.indexOf("txtDestinationCity") >= 0) {
        if ("txtDestinationCity" != '') {
            //var filterDstCity = cfi.getFilter("AND");
            //cfi.setFilter(filterDstCity, "CityCode", "neq", userContext.AirportCode);
            //cfi.setFilter(filterDstCity, "SNo", "neq", userContext.CitySNo);
            //filterDestinationCity = cfi.autoCompleteFilter(filterDstCity);
            var filterDest = cfi.getFilter("AND");
            cfi.setFilter(filterDest, "CityCode", "in", GetFlightSSFilterRoute(FlightDestination));
            filterDestinationCity = cfi.autoCompleteFilter(filterDest);
            return filterDestinationCity;
        }
    }
    else if (textId.indexOf("txtOSCDestinationCity") >= 0) {
        if ("txtOSCDestinationCity" != '') {
            var filterOSCDest = cfi.getFilter("AND");
            //cfi.setFilter(filterSPHC2, "IsDGR", "eq", "0");

            cfi.setFilter(filterOSCDest, "CityCode", "notin", GetFlightFilterRoute(FlightDestination));
            filterOSCDestinationCity = cfi.autoCompleteFilter(filterOSCDest);

            return filterOSCDestinationCity;
        }
    }
    else if (textId.indexOf("txtOSCULDNo") >= 0) {
        if ("txtOSCULDNo" != '') {
            var FlightULDFilter = cfi.getFilter("AND");
            cfi.setFilter(FlightULDFilter, "OriginCity", "eq", userContext.AirportCode);
            cfi.setFilter(FlightULDFilter, "DestinationCity", "notin", GetFlightFilterRoute(FlightDestination));
            //cfi.setFilter(FlightULDFilter, "CarrierCode", "eq", $("#tdFlightNo").text().split('-')[0]);
            cfi.setFilter(FlightULDFilter, "CarrierCode", "in", PartnerGroupCarrierCode);
            FlightOSCLyingFilter = cfi.autoCompleteFilter(FlightULDFilter);
            return FlightOSCLyingFilter;
        }
    }
    else if (textId.indexOf("txtULDNo") >= 0) {
        if ("txtULDNo" != '') {
            var FlightULDFilter = cfi.getFilter("AND");
            cfi.setFilter(FlightULDFilter, "OriginCity", "eq", userContext.AirportCode);
            cfi.setFilter(FlightULDFilter, "DestinationCity", "in", GetFlightFilterRoute(FlightDestination) + ",A~A");
            //cfi.setFilter(FlightULDFilter, "CarrierCode", "eq", $("#tdFlightNo").text().split('-')[0]);
            cfi.setFilter(FlightULDFilter, "CarrierCode", "in", PartnerGroupCarrierCode);
            FlightLyingFilter = cfi.autoCompleteFilter(FlightULDFilter);
            return FlightLyingFilter;
        }
    }
    else if (textId.indexOf("Text_searchFlightNo") >= 0) {
        if ("Text_searchFlightNo" != '') {
            var FlightFilter = cfi.getFilter("AND");
            var FlightORFilter = cfi.getFilter("OR");
            cfi.setFilter(FlightFilter, "OriginAirport", "eq", userContext.AirportCode);
            //cfi.setFilter(FlightFilter, "DestinationAirport", "in", GetFlightFilterRoute(FlightDestination));

            //cfi.setFilter(FlightFilter, "CarrierCode", "eq", $("#tdFlightNo").text().split('-')[0]);
            //cfi.setFilter(FlightFilter, "CarrierCode", "in", PartnerGroupCarrierCode);
            cfi.setFilter(FlightFilter, "FlightDate", "eq", cfi.CfiDate("FlightDate"));
            //cfi.setFilter(FlightFilter, "SNo", "neq", $("#hdnFlightSNo").val());
            FlightNoFilter = cfi.autoCompleteFilter(FlightFilter);
            return FlightNoFilter;
        }
        //else if (textId.indexOf("FlightNo") >= 0) {
        //    var FlightFilter = cfi.getFilter("AND");
        //    var FlightORFilter = cfi.getFilter("OR");
        //    cfi.setFilter(FlightFilter, "OriginAirport", "eq", userContext.AirportCode);
        //    cfi.setFilter(FlightFilter, "DestinationAirport", "in", GetFlightFilterRoute(FlightDestination));

        //    //cfi.setFilter(FlightFilter, "CarrierCode", "eq", $("#tdFlightNo").text().split('-')[0]);
        //    cfi.setFilter(FlightFilter, "CarrierCode", "in", PartnerGroupCarrierCode);
        //    cfi.setFilter(FlightFilter, "FlightDate", "eq", cfi.CfiDate("FlightDate"));
        //    cfi.setFilter(FlightFilter, "SNo", "neq", $("#hdnFlightSNo").val());
        //    FlightNoFilter = cfi.autoCompleteFilter(FlightFilter);
        //    return FlightNoFilter;
    }
    //////////////////for Charges /////////////////
    var filter = cfi.getFilter("AND");
    var x = textId.split('_')[2];
    if (x != undefined) {
        if (textId == 'Text_ChargeName_' + x) {
            $("div[id$='divareaTrans_tariff_tariffdohandlingcharge']").find("[id^='Text_ChargeName']").each(function (i, row) {

                if (x != i - 1) {
                    cfi.setFilter(filter, "TariffSNo", 'notin', $('#' + $(this).attr('id').replace('Text_ChargeName', 'ChargeName')).val());
                }
            });
            var ChargeAutoCompleteFilter = cfi.autoCompleteFilter(filter);
            return ChargeAutoCompleteFilter;
        }
    }
    else {
        if (textId == 'Text_ChargeName') {
            $("div[id$='divareaTrans_tariff_tariffdohandlingcharge']").find("[id^='Text_ChargeName']").each(function (i, row) {
                if (i != 0) {
                    cfi.setFilter(filter, "TariffSNo", 'notin', $('#' + $(this).attr('id').replace('Text_ChargeName', 'ChargeName')).val());
                }
            });
            var ChargeAutoCompleteFilter = cfi.autoCompleteFilter(filter);
            return ChargeAutoCompleteFilter;
        }
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
            // ...
            var controlId = $(this).attr("id");

            var decimalPosition = cfi.IsValidSpanNumeric(controlId);
            if (decimalPosition >= -1) {
                //            $(this).css("text-align", "right");
                cfi.Numeric(controlId, decimalPosition, true);
            }

            else {
                var alphabetstyle = cfi.IsValidSpanAlphabet(controlId);
                if (alphabetstyle != "") {
                    if (alphabetstyle == "datetype") {
                        cfi.DateType(controlId, true);
                    }
                    //                                else {
                    //                                    cfi.AlphabetTextBox(controlId, alphabetstyle);
                    //                                }
                }
            }
        }
    });

    //$("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
    //    var controlId = $(this).attr("id");
    //    cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), _DefaultAutoComplete_);
    //});
}

var currentprocess = "";
var currentawbsno = 0;
var CurrentFlightSno = 0;

function CleanUI() {
    $("#divDetail").html("");
    // $("#tblShipmentInfo").hide();
    // $("#divNewBooking").html("");
    //  $("#btnSave").unbind("click");
    // $("#divGraph").hide();
    //  $("#divXRAY").hide();
    $("#imgprocessing").hide();
}

function fun_GetOSCSearchPanel(SUBProcess, repDivID, SearchFunction) {
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetWebForm/FLIGHTCONTROL/FlightControl/" + SUBProcess + "/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#" + repDivID).html('').html("<div id='divSearchpnl'>" + result + "</div");
            $("div[id*=" + SUBProcess.toLowerCase() + "]").find("#btnSearch").bind("click", function () {
                SearchFunction();// SearchLyingLst();
            });
            cfi.AutoCompleteV2("txtOSCDestinationCity", "CityCode", "GatePass_CityCode", null, "contains");
            cfi.AutoCompleteV2("txtOSCULDNo", "ULDNo", "GatePass_ULDNo", null, "contains");

            var OffLoadType = [{ Key: "A~A", Text: "ALL" }, { Key: "OFLD", Text: "OFFLOAD" }, { Key: "TRANSIT", Text: "TRANSIT" }, { Key: "TRANSFER", Text: "TRANSFERRED" }];
            cfi.AutoCompleteByDataSource("txtOSCOffloadType", OffLoadType);
        }
    }
   );
}
function fun_GetSearchPanel(SUBProcess, repDivID, SearchFunction) {
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetWebForm/FLIGHTCONTROL/FlightControl/" + SUBProcess + "/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#" + repDivID).html('').html("<div id='divSearchpnl'>" + result + "</div");
            $("div[id*=" + SUBProcess.toLowerCase() + "]").find("#btnSearch").bind("click", function () {
                SearchFunction();// SearchLyingLst();
            });
            cfi.AutoCompleteV2("txtDestinationCity", "CityCode", "GatePass_CityCode", null, "contains");

            cfi.AutoCompleteV2("txtULDNo", "ULDNo", "GatePass_ULDNo", null, "contains");
            var OffLoadType = [{ Key: "A~A", Text: "ALL" }, { Key: "OFLD", Text: "OFFLOAD" }, { Key: "TRANSIT", Text: "TRANSIT" }, { Key: "TRANSFER", Text: "TRANSFERRED" }];
            cfi.AutoCompleteByDataSource("txtOffloadType", OffLoadType);
        }
    }
 );
}
function fun_GetLIOSCSearchPanel(SUBProcess, repDivID, SearchFunction) {
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetWebForm/FLIGHTCONTROL/FlightControl/" + SUBProcess + "/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#" + repDivID).html('').html("<div id='divSearchpnl'>" + result + "</div");
            $("div[id*=" + SUBProcess.toLowerCase() + "]").find("#btnSearch").bind("click", function () {
                SearchFunction();// SearchLyingLst();
            });

            var OffLoadType = [{ Key: "A~A", Text: "ALL" }, { Key: "OFLD", Text: "OFFLOAD" }, { Key: "TRANSIT", Text: "TRANSIT" }, { Key: "RCS", Text: "RCS" }, { Key: "TRANSFER", Text: "TRANSFERRED" }];
            cfi.AutoCompleteByDataSource("txtOSCOffloadType", OffLoadType);
        }
    }
           );
}
function fun_GetLISearchPanel(SUBProcess, repDivID, SearchFunction) {
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetWebForm/FLIGHTCONTROL/FlightControl/" + SUBProcess + "/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#" + repDivID).html('').html("<div id='divSearchpnl'>" + result + "</div");
            $("div[id*=" + SUBProcess.toLowerCase() + "]").find("#btnSearch").bind("click", function () {
                SearchFunction();// SearchLyingLst();
            });

            var OffLoadType = [{ Key: "A~A", Text: "ALL" }, { Key: "OFLD", Text: "OFFLOAD" }, { Key: "TRANSIT", Text: "TRANSIT" }, { Key: "RCS", Text: "RCS" }, { Key: "TRANSFER", Text: "TRANSFERRED" }];
            cfi.AutoCompleteByDataSource("txtOffloadType", OffLoadType);
        }
    }
           );
}

function setshowmsg(ss) {
    var lenCss = 4;
    if (ss.length <= 500)
        lenCss = 4;
    else if (ss.length >= 500 && ss.length <= 750)
        lenCss = 12;
    else if (ss.length >= 750 && ss.length <= 1000)
        lenCss = 16;
    return lenCss;
}

function FlightSearch() {
    var BoardingPoint = $("#Text_searchBoardingPoint").val() == "" ? "0" : $("#Text_searchBoardingPoint").val();
    var EndPoint = $("#searchEndPoint").val() == "" ? "0" : $("#searchEndPoint").val();
    var FlightNo = $("#Text_searchFlightNo").val() == "" ? "A~A" : $("#Text_searchFlightNo").val();
    var SearchAirlineCarrierCode1 = "GA";// $("#SearchAirlineCarrierCode1").val() == "" ? "A~A" : $("#SearchAirlineCarrierCode1").val();
    var FromFlightDate = $("#FromFlightDate").val();//cfi.CfiDate("FromFlightDate") == "" ? cfi.CfiDate("ToFlightDate") : cfi.CfiDate("FromFlightDate");
    var ToFlightDate = $("#ToFlightDate").val();//cfi.CfiDate("ToFlightDate") == "" ? "0" : cfi.CfiDate("ToFlightDate");
    var FlightStatus = "MAN";// $("#searchFlightStatus").val() == "" ? "" : $("#searchFlightStatus").val();
    if (FromFlightDate == "0" && ToFlightDate == "0") {
        ShowMessage('warning', 'Warning -Please select To flight date', " ", "bottom-right");
    }
    else {
        cfi.ShowIndexView("divFlightDetails", "Services/GatePass/GatePassService.svc/GetFlightGridData/GATEPASS/FlightSearch/FlightControl/" + BoardingPoint + "/" + EndPoint + "/" + FlightNo + "/" + SearchAirlineCarrierCode1 + "/" + FromFlightDate + "/" + ToFlightDate + "/" + userContext.AirportCode + "/" + FlightStatus, "Scripts/maketrans.js?" + Math.random());
    }
    // $("#divAction").hide();
    $("#divContentDetail").hide();
}
var currentprocess = "";
var currentawbsno = 0;
//
function fn_AddNewRow_Backup(input) {
    var TotalPlanPcs = 0;
    var trHeaderRow = $(input).closest("div.k-grid").find("div.k-grid-header");
    var TotalPcsIndex = trHeaderRow.find("th[data-field='TotalPieces']").index();
    var TotalPlanpcsIndex = trHeaderRow.find("th[data-field='PlannedPieces']").index();
    var hdnTotalPiecesIndex = trHeaderRow.find("th[data-field='hdnTotalPieces']").index();
    var ULDStockSNoIndex = trHeaderRow.find("th[data-field='ULDStockSNo']").index();
    var ActG_V_CBMIndex = trHeaderRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trHeaderRow.find("th[data-field='PlanG_V_CBM']").index();
    var ULDTypeIndex = trHeaderRow.find("th[data-field='ULDType']").index();
    var AWBNOIndex = trHeaderRow.find("th[data-field='AWBNo']").index();
    var CurrentAWBNo = $(input).parent().parent().find('td:eq(' + AWBNOIndex + ')').text();
    var ULDValue = $(input).parent().parent().find('td:eq(' + ULDTypeIndex + ') select').val();
    var CurrentTotalPcs = $(input).parent().parent().find('td:eq(' + hdnTotalPiecesIndex + ')').text();

    if ($(input).val() > 0) {
        $(input).parent().parent().parent().find('tr').each(function (row, tr) {
            if ($(tr).find('td:eq(' + AWBNOIndex + ')').text() == CurrentAWBNo) {
                if ($(tr).find('td:eq(' + ULDStockSNoIndex + ')').text() == 0)
                    TotalPlanPcs = TotalPlanPcs + parseInt($(tr).find('td:eq(' + TotalPlanpcsIndex + ') input[type=text]').val());
            }
        });
        if (parseInt(CurrentTotalPcs) > TotalPlanPcs) {
            var trClone = $(input).parent().parent().clone();
            trClone.find('td:eq(' + TotalPlanpcsIndex + ') input[type=text]').val(parseInt(CurrentTotalPcs) - TotalPlanPcs);
            ///
            if (trClone.find('td:last a').length == 0) {
                trClone.find('td:last').not('a').append('&nbsp;&nbsp;<a class="removed label label-danger" title="Remove" onclick="fn_RemoveRow(this);" ><i class="fa fa-trash-o"></i></a>');
            }

            var ActualG_V_CBM = $(input).parent().parent().find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
            var PG = trClone.find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
            var PV = trClone.find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
            var PCBM = trClone.find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');
            trClone.find('td:eq(' + ULDTypeIndex + ') select').val(ULDValue);
            PG.val(parseFloat((ActualG_V_CBM[0] / CurrentTotalPcs) * (parseInt(CurrentTotalPcs) - TotalPlanPcs)).toFixed(3));
            PV.val(parseFloat((ActualG_V_CBM[1] / CurrentTotalPcs) * (parseInt(CurrentTotalPcs) - TotalPlanPcs)).toFixed(3));
            PCBM.val(parseFloat((ActualG_V_CBM[2] / CurrentTotalPcs) * (parseInt(CurrentTotalPcs) - TotalPlanPcs)).toFixed(3));
            $(input).parent().parent().after(trClone);
            // fn_CalculateSplitTotalPcs(input);
            // var idinput = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');

            // fn_CalGVCBMForLI(this);
        }
        //console.log(JSON.stringify())
        fn_Cal_GVCBM1($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]'));
    }
    else {

        ////  var CurrentAWBNo = $(input).closest('tr').find('td:eq(' + AWBNOIndex + ')').text();
        //  var row_index = $(input).closest('tr').index();
        //  // alert(row_index);
        //  var PlannedActualPcs = 0;
        //  $(input).closest('tbody').find("tr").each(function (row, tr) {
        //      if ($(tr).find('td:eq(' + AWBNOIndex + ')').text() == CurrentAWBNo) {
        //          if (row != row_index) {
        //              PlannedActualPcs = PlannedActualPcs + parseInt($(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val());
        //          }
        //          // PlannedPcs = PlannedPcs + parseInt($(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val());
        //      }
        //  });
        //  $(input).val(CurrentTotalPcs - PlannedActualPcs);
    }
}

function fn_AddNewRow(input) {
    var TotalPlanPcs = 0;
    var trHeaderRow = $(input).closest("div.k-grid").find("div.k-grid-header");
    var TotalPcsIndex = trHeaderRow.find("th[data-field='TotalPieces']").index();
    var TotalPlanpcsIndex = trHeaderRow.find("th[data-field='PlannedPieces']").index();
    var hdnTotalPiecesIndex = trHeaderRow.find("th[data-field='hdnTotalPieces']").index();
    var ULDStockSNoIndex = trHeaderRow.find("th[data-field='ULDStockSNo']").index();
    var ActG_V_CBMIndex = trHeaderRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trHeaderRow.find("th[data-field='PlanG_V_CBM']").index();
    var ULDTypeIndex = trHeaderRow.find("th[data-field='ULDType']").index();
    var AWBNOIndex = trHeaderRow.find("th[data-field='AWBNo']").index();
    var CurrentAWBNo = $(input).parent().parent().find('td:eq(' + AWBNOIndex + ')').text();
    var ULDValue = $(input).parent().parent().find('td:eq(' + ULDTypeIndex + ') select').val();
    var CurrentTotalPcs = $(input).parent().parent().find('td:eq(' + hdnTotalPiecesIndex + ')').text();

    if ($(input).val() > 0) {
        $(input).parent().parent().parent().find('tr').each(function (row, tr) {
            if ($(tr).find('td:eq(' + AWBNOIndex + ')').text() == CurrentAWBNo) {
                if ($(tr).find('td:eq(' + ULDStockSNoIndex + ')').text() == 0)
                    TotalPlanPcs = TotalPlanPcs + parseInt($(tr).find('td:eq(' + TotalPlanpcsIndex + ') input[type=text]').val());
            }
        });
        if (parseInt(CurrentTotalPcs) > TotalPlanPcs) {
            var trClone = $(input).parent().parent().clone();
            trClone.find('td:eq(' + TotalPlanpcsIndex + ') input[type=text]').val(parseInt(CurrentTotalPcs) - TotalPlanPcs);
            ///
            if (trClone.find('td:last a').length == 0) {
                trClone.find('td:last').not('a').append('&nbsp;&nbsp;<a class="removed label label-danger" title="Remove" onclick="fn_RemoveRow(this);" ><i class="fa fa-trash-o"></i></a>');
            }

            var ActualG_V_CBM = $(input).parent().parent().find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
            var PG = trClone.find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
            var PV = trClone.find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
            var PCBM = trClone.find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');
            ///////change on 13-07-2016 for manage RCS Without Calculation/////////

            var PGWIndex = trHeaderRow.find("th[data-field='PGW']").index();
            var PVWIndex = trHeaderRow.find("th[data-field='PVW']").index();
            var PCBMWIndex = trHeaderRow.find("th[data-field='PCBMW']").index();
            var PGW = parseFloat(trClone.find('td:eq(' + PGWIndex + ')').text());
            var PVW = parseFloat(trClone.find('td:eq(' + PVWIndex + ')').text());
            var PCBMW = parseFloat(trClone.find('td:eq(' + PCBMWIndex + ')').text());

            //////////////////////////////

            trClone.find('td:eq(' + ULDTypeIndex + ') select').val(ULDValue);
            PG.val(parseFloat((PGW / CurrentTotalPcs) * (parseInt(CurrentTotalPcs) - TotalPlanPcs)).toFixed(3));
            PV.val(parseFloat((PVW / CurrentTotalPcs) * (parseInt(CurrentTotalPcs) - TotalPlanPcs)).toFixed(3));
            PCBM.val(parseFloat((PCBMW / CurrentTotalPcs) * (parseInt(CurrentTotalPcs) - TotalPlanPcs)).toFixed(3));
            $(input).parent().parent().after(trClone);
            // fn_CalculateSplitTotalPcs(input);
            // var idinput = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');

            // fn_CalGVCBMForLI(this);
        }
        //console.log(JSON.stringify())
        fn_Cal_GVCBM1($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]'));
    }
    else {

        ////  var CurrentAWBNo = $(input).closest('tr').find('td:eq(' + AWBNOIndex + ')').text();
        //  var row_index = $(input).closest('tr').index();
        //  // alert(row_index);
        //  var PlannedActualPcs = 0;
        //  $(input).closest('tbody').find("tr").each(function (row, tr) {
        //      if ($(tr).find('td:eq(' + AWBNOIndex + ')').text() == CurrentAWBNo) {
        //          if (row != row_index) {
        //              PlannedActualPcs = PlannedActualPcs + parseInt($(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val());
        //          }
        //          // PlannedPcs = PlannedPcs + parseInt($(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val());
        //      }
        //  });
        //  $(input).val(CurrentTotalPcs - PlannedActualPcs);
    }
}
function fn_RemoveRow(input) {
    var tr = $(input).closest('tr');
    var trHeaderRow = tr.closest("div.k-grid").find("div.k-grid-header");
    var TotalPlanpcsIndex = trHeaderRow.find("th[data-field='PlannedPieces']").index();
    var PlanG_V_CBMIndex = trHeaderRow.find("th[data-field='PlanG_V_CBM']").index();
    $(input).closest('tr').prev().find('td:eq(' + TotalPlanpcsIndex + ') input[type=text]').val(parseInt($(input).closest('tr').prev().find('td:eq(' + TotalPlanpcsIndex + ') input[type=text]').val()) + parseInt($(input).closest('tr').find('td:eq(' + TotalPlanpcsIndex + ') input[type=text]').val()));
    $(input).closest('tr').prev().find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val(parseFloat(parseFloat($(input).closest('tr').prev().find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val()) + parseFloat($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val())).toFixed(3));
    $(input).closest('tr').prev().find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val(parseFloat(parseFloat($(input).closest('tr').prev().find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val()) + parseFloat($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val())).toFixed(3));
    $(input).closest('tr').prev().find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val(parseFloat(parseFloat($(input).closest('tr').prev().find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val()) + parseFloat($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val())).toFixed(3));
    $(input).closest('tr').remove();

    //alert('Row Deleted')
}

function ParentSuccessGrid()
{ }
function fun_FinalizedPreMan() {
    SaveProcessStatus = 'PRE_FINAL';
    if (IsNILManifested == "true") {
        ShowMessage('warning', 'Warning -NIL Manifest already created for this flight', " ", "bottom-right");
    }
    else {
        if (SaveManifestInfo('PRE_FINAL')) {
            FlightSearch();
        }
    }
    ////$.ajax({
    ////    url: "Services/FlightControl/FlightControlService.svc/SetFinalizedPreManifest?DailyFlightSNo=" + CurrentFlightSno, async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
    ////    success: function (result) {
    ////        ShowMessage('success', 'Success -Pre Manifest Created Successfully', "Processed Successfully", "bottom-right");
    ////        FlightSearch();
    ////    }
    ////});
}

function GetLIReportData(FlightSNo) {

    $("#divDetail").html("");
    var FlightSNoArray = FlightSNo.split(',');
    $(FlightSNoArray).each(function (r, i) {
        // if (r < (FlightSNoArray.length - 1)) {
        $.ajax({
            url: "Services/FlightControl/FlightControlService.svc/GetLIReport?DailyFlightSNo=" + i,
            async: false,
            type: "get",
            dataType: "html",
            cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#btnPrint").closest('tr').hide();
                $('#SecondTab').hide();
                $('#OSCTab').hide();
                $('#FlightStopOverDetailTab').hide();
                $("#divDetail").append(result);
                // console.log(result);

                if (r == FlightSNoArray.length - 1) {
                    $("#btnPrint").unbind("click").bind("click", function () {
                        $("#divDetailPrint #divDetail").printArea();
                    });
                }
                else {

                    $("#divDetail").append('</br><div class="page-break"></div>');
                }
            },
            error: function (rex) {
                //   alert(rex);
            }
        });
        // }
    })
    $("#divDetail #btnPrint:last").closest('tr').show();
}

//
function CleanUI() {
    $("#divDetail").html("");
    $("#divFlightDetails").html("");
    // $("#tblShipmentInfo").hide();
    // $("#divNewBooking").html("");
    //  $("#btnSave").unbind("click");
    // $("#divGraph").hide();
    //  $("#divXRAY").hide();
    $("#imgprocessing").hide();
}

var FlightCloseFlag;
var FlightStatusFlag;
//$('#divDetail').bind("click", function () {
//    if (FlightCloseFlag == "DEP")
//    {
//        alert('Test');
//        $('#divDetail input').attr('disabled', 'disabled');
//    }
//})
function CheckAll(e) {
    $("#divDetail input[type='checkbox'][disabled!='disabled']").prop('checked', $(e).prop("checked"));

    if ($('#chkAllBox').is(":checked")) {
        $("#divDetail input[type='checkbox'][disabled!='disabled'][id!='chkAllBox']").each(function () {
            $(this).prop('checked', $(e).prop("checked"));
        });
    }
    else {
        $("#divDetail input[type='checkbox'][disabled!='disabled'][id!='chkAllBox']").each(function () {
            $(this).prop('checked', $(e).prop("checked"));
        });
    }
    //$("#divDetail input[type='checkbox'][disabled!='disabled'][id!='chkAllBox']").each(function () {
    //    //if ($(this).closest('td').find('input[type="hidden"]').val() != "0@0") {
    //        if ($(this).closest('td').find('input[type="hidden"]').val() == "false")
    //            $(this).prop('checked', $(e).prop("checked"));
    //        else
    //            $(this).prop('checked', 0);
    //    //}
    //});
}
function fn_GetCTMChargeDetails(AWBSNo, CTMSNo, input, FromType) {
    // alert('AWBSNO=' + AWBSNo + '  Type=' + FromType);
    $("#divCTM").remove();
    var trHRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var AWBNoIndex = trHRow.find("th[data-field='AWBNo']").index();
    var AWBNo = $(input).closest('tr').find('td:eq(' + AWBNoIndex + ')').text();
    $("#dv_FlightManifestPrint").html('<div id="divCTM" style="overflow:auto; display:none;"><table id="tblResult" class="WebFormTable"></table></div>');

    $("#tblResult").before('<B>Applied Charges<B><br/><table id="tblResult1" class="WebFormTable"></table>')

    $("#tblResult").append('<tr><td class="formlabel" style="width:10%; ">AWB No.</td><td class="formInputcolumn" style="width:20%;text-align:center;"><span id="spnAWBNo">' + AWBNo + '</span></td><td class="formlabel" >Flight No.</td><td class="formInputcolumn" style="width:20%;text-align:center;"><span id="spnFlightNo">' + $("#tdFlightNo").text() + '</span></td></tr>');

    $("#tblResult").append("<tr><td class='formlabel' title='Select Bill Type' ><font id=\"ftbillto\" color=\"red\">*</font><span id='spnBillType'> Bill Type</span></td><td class='formInputcolumn' style='text-align:center;'><input type='hidden' name='BillType' id='BillType' value=''><span class='k-widget k-combobox k-header'><span class='k-dropdown-wrap k-state-default' unselectable='on' style='width: 175px;'><input type='text' class='k-input' name='Text_BillType' id='Text_BillType' style='width: 100%; text-transform: uppercase;' tabindex='5' controltype='autocomplete' maxlength='' value='' data-valid='required' data-valid-msg='Bill Type can not be blank'  data-role='autocomplete' autocomplete='off'><span class='k-select' unselectable='on'><span class='k-icon k-i-arrow-s' unselectable='on' style='cursor:pointer;'>select</span></span></span></span></td><td class='formlabel' title='Select '><font id=\"ftbillto\" color=\"red\">*</font><span id='spnBillToSNo'>Bill To</span></td><td class='formInputcolumn' style='text-align:center;'><input type='hidden' name='BillToSNo' id='BillToSNo' value=''><span class='k-widget k-combobox k-header' style='display: inline-block;'><span class='k-dropdown-wrap k-state-default' unselectable='on' style='width: 175px;'><input type='text' class='k-input' name='Text_BillToSNo' id='Text_BillToSNo' style='width: 100%; text-transform: uppercase;' tabindex='6' controltype='autocomplete' maxlength='' value=''  data-valid='required' data-valid-msg='Bill To can not be blank'  data-role='autocomplete' autocomplete='off' data-valid='required' data-valid-msg='Bill To.'><span class='k-select' unselectable='on'><span class='k-icon k-i-arrow-s' unselectable='on' style='cursor:pointer;'>select</span></span></span></span></td></tr>");

    $("#tblResult").after('<br/><B>CTM Charges<B><br/><table id="tblCTMCharges" class="WebFormTable"></table>')
    cfi.PopUp("divCTM", "CTM", 1200, null, null, null);
    $("#divCTM").closest(".k-window").css({
        position: 'fixed',
        top: '5%'
    });
    $('.k-window').closest("div:hidden").remove();
    $("#spnAWBNo").after("<input type='hidden' id='AWBNo' name='AWBNo' value=" + AWBSNo + " >");
    $("#spnFlightNo").after("<input type='hidden' id='FlightNo' name='FlightNo' value=" + $("#hdnFlightSNo").val() + " >");
    $("#spnFlightNo").after("<input type='hidden' id='CTMSNo' name='CTMSNo' value=" + CTMSNo + " >");
    GetAWBWeight();
    BindCTMCharges()
    if (IsCTMCharges == "False")
        $("#tblCTMCharges").after("<br/><input type='button' id='SaveCTM' value='Save' class='btn btn-success' onclick='SaveCTMCharges()'>");
}

/////////////////////////// for CTM Charge/////////////////////////////
//CTMCHARGES
var flags = 0;
var weight = 0;
var IsCTMCharges = "False";
function popup() {
    $("#divCTM").remove();
    $("#SendMessage").after('<div id="divCTM" style="overflow:auto; display:none;"><table id="tblResult" class="WebFormTable"></table></div>');
    $("#tblResult").append('<tr><td class="formlabel" style="width:10%; text-align:center;">AWB No.</td><td class="formInputcolumn" style="width:20%;text-align:center;"><span id="spnAWBNo"></span></td><td class="formlabel" style="text-align:center;">Flight No.</td><td class="formInputcolumn" style="width:20%;text-align:center;"><span id="spnFlightNo"></span></td><td class="formlabel" style="text-align:center;">CTM</td><td class="formInputcolumn" style="width:20%;text-align:center;"><span id="spnCTMSNo"></span></td></tr>');

    $("#tblResult").after('<br/><B>CTM Charges<B><br/><table id="tblCTMCharges" class="WebFormTable"></table>')
    cfi.PopUp("divCTM", "CTM", 1200, null, null, null);
    $("#divCTM").closest(".k-window").css({
        position: 'fixed',
        top: '5%'
    });
    $('.k-window').closest("div:hidden").remove();
    $("#spnAWBNo").after("<input type='hidden' id='AWBNo' name='AWBNo' value >");
    $("#spnFlightNo").after("<input type='hidden' id='FlightNo' name='FlightNo' value >");
    $("#spnCTMSNo").after("<input type='hidden' id='CTMSNo' name='CTMSNo' value >");
    GetAWBWeight();
    BindCTMCharges()
    $("#tblCTMCharges").after("<br/><input type='button' id='SaveCTM' value='Save' class='btn btn-success' onclick='SaveCTMCharges()'>");
}
function GetAWBWeight() {
    var Sno = $("#AWBNo").val();
    if ($("#AWBNo").val() != '') {
        $.ajax({
            url: "Services/Tariff/ESSChargesService.svc/GetAWBWeight",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ Sno: Sno }),
            async: false,
            type: 'post',
            cache: false,
            success: function (result) {
                var dataTableobj = JSON.parse(result);
                FinalData = dataTableobj.Table0;
                weight = FinalData[0].Column1;
                IsCTMCharges = FinalData[0].IsCTMCharge;

            }
        });
    }

}
function BindCTMCharges() {
    _CURR_PRO_ = "ESS";
    $.ajax({
        url: "Services/Tariff/ESSChargesService.svc/GetWebForm/" + _CURR_PRO_ + "/Tariff/ESSCharges/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#tblCTMCharges").html(result);

            $("#tblCTMCharges").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            var AWBSNo = $("#AWBNo").val();
            var FlightSNo = $("#FlightNo").val();
            var CTMSNo = $("#CTMSNo").val();
            var CityCode = userContext.CityCode;

            $.ajax({
                url: "Services/Tariff/ESSChargesService.svc/GetCTMSMendatoryCharges?AWBSNo=" + AWBSNo + "&FlightSNo=" + FlightSNo + "&CTMSNo=" + CTMSNo + "&CityCode='" + CityCode + "'&ProcessSNo=" + parseInt(6) + "&SubProcessSNo=" + parseInt(34) + "&ArrivedShipmentSNo=0&RateType=0&GrWt=" + parseFloat(0) + "&ChWt=" + parseFloat(0) + "&Pieces=" + parseInt(0),
                async: false, type: "GET", dataType: "json", cache: false,
                //   data: JSON.stringify({ AWBSNo: AWBSNo, FlightSNo: FlightSNo, CTMSNo: CTMSNo, CityCode: CityCode, ProcessSNo: 6, SubProcessSNo: 34, ArrivedShipmentSNo: '0', RateType: '0', GrWt: '0', ChWt: '0', Pieces: '0' }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var Data = jQuery.parseJSON(result);
                    var resData = Data.Table0;

                    /****************Handling Charge Information*************************************/
                    MendatoryHandlingCharges = [];
                    if (resData != []) {
                        $(resData).each(function (row, i) {
                            if (i.isMandatory == 1) {
                                MendatoryHandlingCharges.push({ "chargename": i.TariffSNo, "text_chargename": i.TariffCode, "pbasis": i.pbasis == undefined ? '' : i.pbasis, "pvalue": i.pValue == undefined ? 0 : i.pValue, "sbasis": i.sbasis == undefined ? '' : i.sbasis, "svalue": i.sValue == undefined ? 0 : i.sValue, "amount": i.ChargeAmount, "totaltaxamount": i.TotalTaxAmount, "totalamount": i.TotalAmount, "remarks": i.ChargeRemarks.toUpperCase().replace(/<BR>/g, "") });
                                //totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat(i.TotalAmount);
                            }
                        });
                    }

                    cfi.makeTrans("tariff_tariffdohandlingcharge", null, null, BindCTMChargesItemAutoComplete, ReBindCTMChargesItemAutoComplete, null, MendatoryHandlingCharges);

                    if (MendatoryHandlingCharges.length > 0) {
                        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
                            $(this).find("span[id^='PBasis']").closest("td").find("input[id^='_tempPValue']").val(MendatoryHandlingCharges[i].pvalue);
                            $(this).find("span[id^='PBasis']").closest("td").find("input[id^='PValue']").val(MendatoryHandlingCharges[i].pvalue);
                            $(this).find("span[id^='PBasis']").text(MendatoryHandlingCharges[i].pbasis);
                            if ((MendatoryHandlingCharges[i].sbasis == undefined || MendatoryHandlingCharges[i].sbasis == "") && (MendatoryHandlingCharges[i].svalue == "" || MendatoryHandlingCharges[i].svalue == undefined || MendatoryHandlingCharges[i].svalue == "0.00")) {
                                $(this).find("span[id^='SBasis']").closest("td").find("input[id^='SValue']").css("display", "none");
                                $(this).find("span[id^='SBasis']").closest("td").find("span[id^='SBasis']").css("display", "none");
                                $(this).find("input[id^='PValue']").focus();
                                $(this).find("input[id^='PValue']").blur();
                            }
                            else {
                                $(this).find("span[id^='SBasis']").closest("td").find("input[id^='SValue']").css("display", "inline-block");
                                $(this).find("span[id^='SBasis']").closest("td").find("span[id^='SBasis']").css("display", "inline-block");
                                $(this).find("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").val(MendatoryHandlingCharges[i].svalue);
                                $(this).find("span[id^='SBasis']").closest("td").find("input[id^='SValue']").val(MendatoryHandlingCharges[i].svalue);
                                $(this).find("span[id^='SBasis']").text(MendatoryHandlingCharges[i].sbasis);
                                $(this).find("input[id^='SValue']").focus();
                                $(this).find("input[id^='SValue']").blur();
                            }
                            $("input[id='Rate']").closest("table").find('tr').find('td').find("span[id='spnRate']").hide();
                            $("input[id^='Rate']").closest("td").find("input").css("display", "none");
                            $(this).find("input[id^='Text_ChargeName']").attr('disabled', 'disabled');

                            $(this).find("div[id^=transActionDiv").hide();
                            $(this).find("input[id^='SValue']").focus();
                            $(this).find("input[id^='SValue']").blur();

                        });
                    }
                    else {
                        $("#tblCTMCharges").parent().parent().hide();
                        $("#tblResult").hide();
                    }
                    $("input[id='Rate']").closest("table").find('tr').find('td').find("span[id='spnRate']").hide();
                    $("input[id^='Rate']").closest("td").find("input").css("display", "none");
                    $("input[id^='PValue']").closest("td").find("input").attr('disabled', 'disabled');
                    $("input[id^='SValue']").closest("td").find("input").attr('disabled', 'disabled');

                    $("div[id$='divareaTrans_tariff_tariffdohandlingcharge']").find("[id='areaTrans_tariff_tariffdohandlingcharge']").each(function () {
                        $(this).find("input[id^='ChargeName']").each(function () {
                            AutoCompleteForCTMCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, GatCTMValueOfAutocomplete, null, null, null, null, "getHandlingChargesIE", "", $("#AWBNo").val(), 0, userContext.CityCode, 2, "", "2", "999999999", "No", $("#FlightNo").val(), $("#CTMSNo").val(), 6, 34);
                        });


                        $(this).find("input[id^='PValue']").each(function () {
                            var currentID = $(this)[0].id;
                            $('#' + currentID).on("keypress", function (event) {
                                var charCode = (event.which) ? event.which : event.keyCode;
                                if ((charCode != 45 || $(this).val().indexOf('-') != -1) && (charCode != 46 || $(this).val().indexOf('.') != -1) && (charCode < 48 || charCode > 57))
                                    return false;

                                if (($(this).val().indexOf('.') != -1) && ($(this).val().substring($(this).val().indexOf('.')).length > 2) && (event.which != 0 && event.which != 8) && ($(this)[0].selectionStart >= $(this).val().length - 2)) {
                                    event.preventDefault();
                                }
                                return true;
                            });
                        });

                        $(this).find("input[id^='SValue']").each(function () {
                            var currentID = $(this)[0].id;
                            $('#' + currentID).on("keypress", function (event) {
                                var charCode = (event.which) ? event.which : event.keyCode;
                                if ((charCode != 45 || $(this).val().indexOf('-') != -1) && (charCode != 46 || $(this).val().indexOf('.') != -1) && (charCode < 48 || charCode > 57))
                                    return false;

                                if (($(this).val().indexOf('.') != -1) && ($(this).val().substring($(this).val().indexOf('.')).length > 2) && (event.which != 0 && event.which != 8) && ($(this)[0].selectionStart >= $(this).val().length - 2)) {
                                    event.preventDefault();
                                }
                                return true;
                            });
                        });

                        $('#spnWaveOff').hide();
                        $("#spnRemarks").closest('td').next().next().hide()
                        $(this).find("input[id^='WaveOff']").hide();

                        //$(this).find("input[id^='Text_ChargeName']").attr('disabled', 'disabled')

                    });

                    cfi.AutoCompleteByDataSource("BillType", billto, onBillToSelect, null);
                    cfi.AutoCompleteV2("BillToSNo", "Name", "GatePass_Name", null, "contains");
                },
                error: function (xhr) {
                    var a = "";
                }
            });

            $.ajax({
                url: "Services/Tariff/ESSChargesService.svc/GetCTMSMendatoryChargesForFC?AWBSNo=" + AWBSNo + "&FlightSNo=" + FlightSNo + "&CTMSNo=" + CTMSNo + "&CityCode='" + CityCode + "'&ProcessSNo=" + parseInt(6) + "&SubProcessSNo=" + parseInt(34) + "&ArrivedShipmentSNo=0&RateType=0&GrWt=" + parseFloat(0) + "&ChWt=" + parseFloat(0) + "&Pieces=" + parseInt(0),
                async: false, type: "GET", dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var Data = jQuery.parseJSON(result);
                    var resData = Data.Table0;
                    if (resData.length > 0) {
                        $('#tblResult1').append('<tr><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">SNO</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">INVOICE NO</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">INVOICE DATE</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">AIRLINE/AGENT</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">AMOUNT</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">PAYMENT MODE</td><td style="padding: 5px; font-weight: bold; font-family: sans-serif; font-size: 12px; color: #333340;border-bottom:1px solid #5a7570">PRINT</td></tr>');

                        for (var i = 0; i < resData.length; i++) {
                            $('#tblResult1').append('<tr><td style="padding:3px;font-family:sans-serif;font-size:12px;font-weight:bold;">' + parseInt(i + 1) + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;font-weight:bold;"><span class="actionView" style="cursor:pointer;color:Blue;">' +
                                resData[i].InvoiceNo + '</span></td><td style="padding:3px;font-family:sans-serif;font-size:12px;">' + resData[i].InvoiceDate + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;">' + resData[i].Airline + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;word-wrap: break-word;">' + resData[i].Amount + " AED" + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;font-weight:bold;">' + resData[i].PaymentMode + '</td><td style="padding:3px;font-family:sans-serif;font-size:12px;font-weight:bold;"><a onclick="PrintRFSHandlingDetails(' + resData[i].SNo + ',' + resData[i].InvoiceType + ');" style="cursor:pointer;" ><i class="fa fa-print fa-2x"></i></a></td></tr>');
                        }
                        // $("#tblResult").append
                    }
                },
                error: function (xhr) {
                    var a = "";
                }
            });
        },
        beforeSend: function (jqXHR, settings) {
        },
        complete: function (jqXHR, textStatus) {
        },
        error: function (xhr) {
            var a = "";
        }
    });
}

function PrintRFSHandlingDetails(SNo, InvoiceType) {
    if (InvoiceType == 0)
        window.open("HtmlFiles/Shipment/Payment/ChargeNotePrintPayment.html?InvoiceSNo=" + SNo + "&InvoiceType=" + InvoiceType);
    else
        window.open("HtmlFiles/Tariff/WorkOrderPrint.html?InvoiceSNo=" + SNo);
}
function AutoCompleteForCTMCharge(textId, basedOn, tableName, keyColumn, textColumn, templateColumn, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag, FlightSNo, CTMSNo, ProcessSNo, SubProcessSNo) {
    var keyId = textId;
    textId = "Text_" + textId;
    if (!$("#" + textId).data("kendoAutoComplete")) {
        if (IsValid(textId, autoCompleteType)) {
            if (keyColumn == null || keyColumn == undefined)
                keyColumn = basedOn;
            if (textColumn == null || textColumn == undefined)
                textColumn = basedOn;
            var dataSource = GetDataSourceForCTMCharge(textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag, FlightSNo, CTMSNo, ProcessSNo, SubProcessSNo);
            $("input[type='text'][name='" + textId + "']").kendoAutoComplete({
                filter: (templateColumn == undefined || templateColumn == null ? ((filterCriteria == undefined || filterCriteria == null || filterCriteria == "" ? "startswith" : filterCriteria)) : "contains"),
                dataSource: dataSource,
                filterField: basedOn,
                separator: (separator == undefined ? null : separator),
                dataTextField: autoCompleteText,
                dataValueField: autoCompleteKey,
                valueControlID: $("input[type='hidden'][name='" + keyId + "']"),
                template: '<span>#: TemplateColumn #</span>',
                addOnFunction: (addOnFunction == undefined ? null : addOnFunction),
                newAllowed: newAllowed,
                confirmOnAdd: confirmOnAdd
            });
        }
    }
}

var dourl = 'Services/AutoCompleteService.svc/CTMAutoCompleteDataSource';
function GetDataSourceForCTMCharge(textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag, FlightSNo, CTMSNo, ProcessSNo, SubProcessSNo) {
    var dataSource = new kendo.data.DataSource({
        type: "json",
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        allowUnsort: true,
        pageSize: 10,
        transport: {
            read: {
                url: (newUrl == undefined || newUrl == "" ? dourl : serviceurl + newUrl),
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: {
                    tableName: tableName,
                    keyColumn: keyColumn,
                    textColumn: textColumn,
                    templateColumn: templateColumn,
                    procedureName: procName,
                    awbSNo: awbSNo,
                    chargeTo: chargeTo,
                    cityCode: cityCode,
                    movementType: movementType,
                    hawbSNo: hawbSNo,
                    loginSNo: loginSNo,
                    chWt: chWt,
                    cityChangeFlag: cityChangeFlag,
                    FlightSNo: FlightSNo,
                    CTMSNo: CTMSNo,
                    ProcessSNo: ProcessSNo,
                    SubProcessSNo: SubProcessSNo
                }
            },
            parameterMap: function (options) {
                if (options.filter != undefined) {
                    var filter = _ExtraCondition(textId);
                    if (filter == undefined) {
                        filter = { logic: "AND", filters: [] };
                    }
                    filter.filters.push(options.filter);
                    options.filter = filter;
                }
                if (options.sort == undefined)
                    options.sort = null;
                return JSON.stringify(options);
            }
        },
        schema: { data: "Data" }
    });
    return dataSource;
}

function BindCTMChargesItemAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='ChargeName']").each(function () {
        AutoCompleteForCTMCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, GatCTMValueOfAutocomplete, null, null, null, null, "getHandlingChargesIE", "", $("#AWBNo").val(), 0, userContext.CityCode, 2, "", "2", "999999999", "No", $("#FlightNo").val(), $("#CTMSNo").val(), 6, 34);
    });

    if (flags == 1) {
        $(elem).find("input[id^='PaymentMode']").each(function () {
            $(elem).find("input[id^='PaymentMode']").eq(0).attr("checked", 'checked')
            $(elem).find("input[id^='PaymentMode']").eq(1).attr("disabled", "disabled");
        });
    }
    else {
        $(elem).find("input[id^='PaymentMode']").each(function (i, row) {
            $(elem).find("input[id^='PaymentMode']").eq(0).attr("checked", 'checked');
            $(elem).find("input[id^='PaymentMode']").eq(1).removeAttr("disabled");
            flags = 0;
        });
    }
    $('#spnWaveOff').hide();
    $("#spnRemarks").closest('td').next().next().hide()
    $(elem).find("input[id^='Rate']").hide();
    $(elem).find("input[id^='WaveOff']").hide();
}

function ReBindCTMChargesItemAutoComplete(elem, mainElem) {
    //$(elem).find("input[id^='ChargeName']").each(function () {
    //    AutoCompleteForCTMCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, GatCTMValueOfAutocomplete, null, null, null, null, "getHandlingChargesIE", "", $("#AWBNo").val(), 0, userContext.CityCode, 2, "", "2", "999999999", "No", $("#FlightNo").val(), $("#CTMSNo").val(), 6, 34);
    //});


    //if (flags == 1) {
    //    $(elem).find("input[id^='PaymentMode']").each(function () {
    //        $(elem).find("input[id^='PaymentMode']").eq(0).attr("checked", 'checked')
    //        $(elem).find("input[id^='PaymentMode']").eq(1).attr("disabled", "disabled");
    //    });
    //}
    //else {
    //    $(elem).find("input[id^='PaymentMode']").each(function (i, row) {
    //        $(elem).find("input[id^='PaymentMode']").eq(0).attr("checked", 'checked');
    //        $(elem).find("input[id^='PaymentMode']").eq(1).removeAttr("disabled");
    //        flags = 0;
    //    });
    //}


    $(elem).find("input[id^='SBasis']").each(function (i, row) {
        if ($(elem).find("span[id^='SBasis']").text() == '') {
            $(elem).find("span[id^='SBasis']").closest("tr").find("td:eq(4)").find("input").css("display", "none");
            $(elem).find("span[id^='SBasis']").closest("tr").find("td:eq(4)").find("span").css("display", "none");
        }
        else {
            $(elem).find("span[id^='SBasis']").closest("tr").find("td:eq(4)").find("input").css("display", "inline-block");
            $(elem).find("span[id^='SBasis']").closest("tr").find("td:eq(4)").find("span").css("display", "inline-block");
        }
        $(elem).find("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").focus();
    });
    $('#spnWaveOff').hide();
    $("#spnRemarks").closest('td').next().next().hide()
    $(elem).find("input[id^='Rate']").hide();
    $(elem).find("input[id^='WaveOff']").hide();
}

var pValue = 0;
var sValue = 0;
var type = 'AWB';
function GatCTMValueOfAutocomplete(valueId, value, keyId, key) {
    pValue = 0;
    sValue = 0;
    rowId = valueId.split("_")[2];
    totalHandlingCharges = 0;
    totalAmountDO = 0;
    if (ValidateExistingCharges(valueId, value, keyId, key)) {
        if (value != "") {
            if ($("input[id^='Text_HAWB']").length > 0) {
                var hawbSNo = $("input[id^='Text_HAWB']").data("kendoAutoComplete").key() != "" ? $("input[id^='Text_HAWB']").data("kendoAutoComplete").key() : 0;
            }
            else
                var hawbSNo = 0;
            $.ajax({
                url: "Services/Tariff/ESSChargesService.svc/CTMGetChargeValue?TariffSNo=" + parseInt(key) + "&AWBSNo=" + parseInt(($("#AWBNo").val() == '' ? 0 : $("#AWBNo").val())) + "&ArrivedShipmentSNo=" + parseInt(0) + "&DestinationCity=" + userContext.CityCode + "&PValue=" + parseInt(0) + "&SValue=" + parseInt(0) + "&HAWBSNo=" + hawbSNo + "&MovementType=" + 2 + "&RateType=" + parseInt(0) + "&Remarks=" + type + "&FlightSNo=" + parseInt($("#FlightNo").val() == '' ? 0 : $("#FlightNo").val()) + "&CTMSNo=" + parseInt($("#CTMSNo").val() == '' ? 0 : $("#CTMSNo").val()) + "&ProcessSNo=" + parseInt(6) + "&SubProcessSNo=" + parseInt(34),
                async: false, type: "GET", dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var resData = jQuery.parseJSON(result);
                    var doCharges = resData.Table0;
                    if (doCharges.length > 0) {
                        var doItem = doCharges[0];
                        if (rowId == undefined) {
                            $("span[id='PBasis']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                            $("span[id='PBasis']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                            $("span[id='PBasis']").text(doItem.PrimaryBasis);
                            if (doItem.SecondaryBasis == undefined || doItem.SecondaryBasis == "") {
                                $("span[id='SBasis']").closest("tr").find("td:eq(4)").find("input").css("display", "none");
                                $("span[id='SBasis']").closest("tr").find("td:eq(4)").find("span").css("display", "none");
                            }
                            else {
                                $("span[id='SBasis']").closest("tr").find("td:eq(4)").find("input").css("display", "inline-block");
                                $("span[id='SBasis']").closest("tr").find("td:eq(4)").find("span").css("display", "inline-block");
                                $("span[id='SBasis']").closest("td").find("input[id^='_tempSValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                                $("span[id='SBasis']").closest("td").find("input[id^='SValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                                $("span[id='SBasis']").text(doItem.SecondaryBasis);
                            }
                            $("input[id='Rate']").closest("td").find("input").css("display", "none");

                            $("span[id='Amount']").text(doItem.ChargeAmount);
                            $("span[id='TotalTaxAmount']").text(doItem.TotalTaxAmount);
                            $("span[id='TotalAmount']").text(doItem.TotalAmount);
                            $("span[id='Remarks']").text(doItem.ChargeRemarks);
                            $("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").focus();
                            if (doItem.PrimaryBasis == 'KG' && doItem.pValue == '') {
                                $("span[id='PBasis']").closest("td").find("input[id^='_tempPValue']").val(weight);
                                $("span[id='PBasis']").closest("td").find("input[id^='PValue']").val(weight);
                            }
                        }
                        else {
                            $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                            $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                            $("span[id^='PBasis_" + rowId + "']").text(doItem.PrimaryBasis);
                            if (doItem.SecondaryBasis == undefined || doItem.SecondaryBasis == "") {
                                $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(4)").find("input").css("display", "none");
                                $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(4)").find("span").css("display", "none");
                            }
                            else {
                                $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(4)").find("input").css("display", "inline-block");
                                $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(4)").find("span").css("display", "inline-block");
                                $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='_tempSValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                                $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='SValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                                $("span[id^='SBasis_" + rowId + "']").text(doItem.SecondaryBasis);
                            }
                            $("input[id='Rate_" + rowId + "']").closest("td").find("input").css("display", "none");
                            $("span[id^='Amount_" + rowId + "']").text(doItem.ChargeAmount);
                            $("span[id^='TotalTaxAmount_" + rowId + "']").text(doItem.TotalTaxAmount);
                            $("span[id^='TotalAmount_" + rowId + "']").text(doItem.TotalAmount);
                            $("span[id^='Remarks_" + rowId + "']").text(doItem.ChargeRemarks);
                            $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='_tempSValue']").focus();
                            if (doItem.PrimaryBasis == 'KG' && doItem.pValue == '') {
                                $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val(weight);
                                $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val(weight);
                            }
                        }
                    }

                    $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                        totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat($(this).find("span[id^='Amount']").text());
                        if ($(this).find("span[id^='SBasis']").text() == undefined || $(this).find("span[id^='SBasis']").text() == "") {
                            $(this).find("span[id^='SBasis']").closest("td").find("input").css("display", "none");
                            $(this).find("span[id^='SBasis']").closest("td").find("span").css("display", "none");
                        }
                    });
                    totalAmountDO = parseFloat(totalAmountDO) + parseFloat(totalHandlingCharges);
                    $("span[id='TotalAmountDO']").text(totalAmountDO.toFixed(3));
                },
                error: function (ex) {
                    var ex = ex;
                }
            });
        }
    }
}

function ValidateExistingCharges(textId, textValue, keyId, keyValue) {
    var Flag = true;
    $("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (row, tr) {
        if ($(tr).find("input[id^='Text_ChargeName']").attr("id") != textId) {
            if ($(tr).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").key() == keyValue) {
                ShowMessage('warning', 'Information!', "" + textValue + " Already Added.", "bottom-right");
                $("#" + textId).data("kendoAutoComplete").setDefaultValue("", "");

                $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val("");
                $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val("");
                $("span[id^='PBasis_" + rowId + "']").text("");
                $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val("");
                $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val("");
                $("span[id^='SBasis_" + rowId + "']").text("");
                $("span[id^='Amount_" + rowId + "']").text("");
                $("span[id^='TotalTaxAmount" + rowId + "']").text("");
                $("span[id^='TotalAmount_" + rowId + "']").text("");
                $("span[id^='Remarks" + rowId + "']").text("");
                Flag = false;
            }
        }
    });
    return Flag;
}

function GetChargeValue(obj) {
    rowId = obj.id.split("_")[1];
    totalAmountDO = 0;
    var tariffSNo = rowId == undefined ? $("#ChargeName").val() : $("#ChargeName_" + obj.id.split("_")[1]).val();
    if (obj.id.indexOf("PValue") > -1) {
        pValue = $("#" + obj.id).val() == "" ? 0 : $("#" + obj.id).val();
        sValue = $("#" + obj.id.replace("PValue", "SValue")).val() != "" ? ($("#" + obj.id.replace("PValue", "SValue")).val() == "0.00" ? 0 : $("#" + obj.id.replace("PValue", "SValue")).val()) : 0;
    }
    else {
        sValue = $("#" + obj.id).val() == "" ? 0 : $("#" + obj.id).val();
        pValue = $("#" + obj.id.replace("SValue", "PValue")).val() != "" ? ($("#" + obj.id.replace("SValue", "PValue")).val() == "0.00" ? 0 : $("#" + obj.id.replace("SValue", "PValue")).val()) : 0;
    }

    if (tariffSNo == "" || tariffSNo == undefined) {
        alert("Please select Charges.");
    }
    else {
        totalHandlingCharges = 0;
        totalAmountDO = 0;
        //var hawbSNo = $("input[id^='Text_HAWB']").data("kendoAutoComplete").key() != "" ? $("input[id^='Text_HAWB']").data("kendoAutoComplete").key() : 0;
        var hawbSNo = 0;
        $.ajax({
            url: "Services/Tariff/ESSChargesService.svc/CTMGetChargeValue?TariffSNo=" + parseInt(tariffSNo) + "&AWBSNo=" + parseInt(($("#AWBNo").val() == '' ? 0 : $("#AWBNo").val())) + "&ArrivedShipmentSNo=" + parseInt(0) + "&DestinationCity=" + userContext.CityCode + "&PValue=" + parseInt(pValue) + "&SValue=" + parseInt(sValue) + "&HAWBSNo=" + hawbSNo + "&MovementType=" + parseInt(2) + "&RateType=" + parseInt(0) + "&Remarks=" + 'AWB' + "&DOSNo=" + parseInt($("#FlightNo").val() == '' ? 0 : $("#FlightNo").val()) + "&PDSNo=" + parseInt($("#CTMSNo").val() == '' ? 0 : $("#CTMSNo").val()) + "&ProcessSNo=" + 6 + "&SubProcessSNo=" + 34,
            async: false, type: "GET", dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var resData = jQuery.parseJSON(result);
                var doCharges = resData.Table0;
                if (doCharges.length > 0) {
                    var doItem = doCharges[0];
                    if (rowId == undefined) {
                        $("span[id='PBasis']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                        $("span[id='PBasis']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                        $("span[id='PBasis']").text(doItem.PrimaryBasis);
                        $("span[id='SBasis']").closest("td").find("input[id^='_tempSValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                        $("span[id='SBasis']").closest("td").find("input[id^='SValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                        $("span[id='SBasis']").text(doItem.SecondryBasis);
                        $("span[id='Amount']").text(doItem.ChargeAmount);
                        $("span[id='TotalTaxAmount']").text(doItem.TotalTaxAmount);
                        $("span[id='TotalAmount']").text(doItem.TotalAmount);
                        $("span[id='Remarks']").text(doItem.ChargeRemarks);
                    }
                    else {
                        $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                        $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                        $("span[id^='PBasis_" + rowId + "']").text(doItem.PrimaryBasis);
                        $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='_tempSValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                        $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='SValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                        $("span[id^='SBasis_" + rowId + "']").text(doItem.SecondryBasis);
                        $("span[id^='Amount_" + rowId + "']").text(doItem.ChargeAmount);
                        $("span[id^='TotalTaxAmount" + rowId + "']").text(doItem.TotalTaxAmount);
                        $("span[id^='TotalAmount_" + rowId + "']").text(doItem.TotalAmount);
                        $("span[id^='Remarks_" + rowId + "']").text(doItem.ChargeRemarks);
                    }
                }
                $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
                    totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat($(this).find("span[id^='Amount']").text());
                });
                totalAmountDO = parseFloat(totalAmountDO) + parseFloat(totalHandlingCharges);
                $("span[id='TotalAmountDO']").text(totalAmountDO.toFixed(3));
            }
        });
    }
    // CheckCreditLimitMode(obj)
}

//function ExtraCondition(textId) {
//    var filter = cfi.getFilter("AND");
//    var x = textId.split('_')[2];
//    if (x != undefined) {
//        if (textId == 'Text_ChargeName_' + x) {
//            $("div[id$='divareaTrans_tariff_tariffdohandlingcharge']").find("[id^='Text_ChargeName']").each(function (i, row) {

//                if (x != i - 1) {
//                    cfi.setFilter(filter, "TariffSNo", 'notin', $('#' + $(this).attr('id').replace('Text_ChargeName', 'ChargeName')).val());
//                }
//            });
//            var ChargeAutoCompleteFilter = cfi.autoCompleteFilter(filter);
//            return ChargeAutoCompleteFilter;
//        }
//    }
//    else {
//        if (textId == 'Text_ChargeName') {
//            $("div[id$='divareaTrans_tariff_tariffdohandlingcharge']").find("[id^='Text_ChargeName']").each(function (i, row) {
//                if (i != 0) {
//                    cfi.setFilter(filter, "TariffSNo", 'notin', $('#' + $(this).attr('id').replace('Text_ChargeName', 'ChargeName')).val());
//                }
//            });
//            var ChargeAutoCompleteFilter = cfi.autoCompleteFilter(filter);
//            return ChargeAutoCompleteFilter;
//        }
//    }

//}

function CheckCreditLimit(obj) {
    if ($("#Text_BillType").val() != 'Airline') {
        var total = 0;
        var value = ($("#" + obj.id + ":checked").attr('data-radioval') == 'CREDIT' ? 1 : 0);
        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
            if ($(this).find("[id^='PaymentMode']:checked").attr('data-radioval') == 'CREDIT')
                total = parseFloat(total) + parseFloat($(this).find("span[id^='Amount']").text());
        });
        //var total = $("#" + obj.id).closest('td').prev().prev().text();
        var BillToSNo = $("#BillToSNo").val();
        if (value == 1) {
            $.ajax({
                url: "Services/Tariff/ESSChargesService.svc/CheckCreditLimit",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ BillToSNo: BillToSNo, total: total }),
                async: false,
                type: 'post',
                cache: false,
                success: function (result) {
                    var dataTableobj = JSON.parse(result);
                    FinalData = dataTableobj.Table0;
                    if (FinalData[0].Column1 != 0 && FinalData[0].Column1 != '') {
                        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
                            if ($(this).find("[id^='PaymentMode']:checked").attr('data-radioval') == 'CREDIT') {
                                $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("checked", 'checked');
                                $(this).find("input:radio[id^='PaymentMode']").eq(1).attr("disabled", "disabled");
                            }
                            flags = 1;
                        });
                        if (FinalData[0].Column2 != '')
                            ShowMessage('warning', '', FinalData[0].Column2);
                    }
                    else {
                        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
                            if ($(obj).closest('tr').index() == (i + 1)) {
                                $(this).find("input:radio[id^='PaymentMode']").eq(1).removeAttr("disabled");
                                $(this).find("input:radio[id^='PaymentMode']").eq(1).attr("checked", 'checked');
                                flags = 0;
                            }
                        });
                    }
                }
            });
        }
    }
}

function CheckCreditLimitMode(obj) {
    //$("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
    //    $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("checked", 'checked');
    //    $(this).find("input:radio[id^='PaymentMode']").eq(1).removeAttr("disabled");
    //});
    $("#" + obj.id).closest('tr').find('[id^=PaymentMode]').eq(0).attr("checked", 'checked');
    $("#" + obj.id).closest('tr').find('[id^=PaymentMode]').eq(1).removeAttr("disabled");
}

function CheckCreditBillToSNo(a, b, c, d) {
    var total = 0;
    var BillToSNo = $("#BillToSNo").val();
    if ($("#BillType").val() != 1) {
        $.ajax({
            url: "Services/Tariff/ESSChargesService.svc/CheckCreditLimit",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ BillToSNo: BillToSNo, total: total }),
            async: false,
            type: 'post',
            cache: false,
            success: function (result) {
                var dataTableobj = JSON.parse(result);
                FinalData = dataTableobj.Table0;
                if (FinalData[0].Column1 != 0 && FinalData[0].Column1 != '') {
                    $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
                        $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("checked", 'checked')
                        $(this).find("input:radio[id^='PaymentMode']").eq(0).removeAttr("disabled");
                        $(this).find("input:radio[id^='PaymentMode']").eq(1).attr("disabled", "disabled");
                        flags = 1;
                    });
                    ShowMessage('warning', '', FinalData[0].Column2);
                }
                else {
                    $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
                        $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("checked", 'checked');
                        $(this).find("input:radio[id^='PaymentMode']").eq(1).removeAttr("disabled");
                        flags = 0;
                    });
                }
            }
        });
    }
    else {
        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function (i, row) {
            $(this).find("input:radio[id^='PaymentMode']").eq(1).attr("checked", 'checked');
            $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("disabled", "disabled");
            $(this).find("input:radio[id^='PaymentMode']").eq(1).removeAttr("disabled");
            flags = 2;
        });
    }
    //CheckWalkIn();
}

function SaveCTMCharges() {
    cfi.ValidateSection("divCTM");
    if (!cfi.IsValidSection($("#divCTM"))) {
        return false;
    }
    if ($("#Text_BillType").val() == "") {
        ShowMessage('warning', 'CTM Charges', 'Select Bill Type');
        return false;
    }
    if ($("#Text_BillToSNo").val() == "") {
        ShowMessage('warning', 'CTM Charges', 'Select Bill To');
        return false;
    }
    var CTMChargeArray = [];
    $("div[id$='divareaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function () {
        if ($(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key() != "") {
            var CTMChargeViewModel = {
                SNo: $(this).find("td[id^='tdSNoCol']").html(),
                AWBSNo: $('#AWBNo').val(),
                WaveOff: 0,
                TariffCodeSNo: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key(),
                TariffHeadName: $(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").value(),
                pValue: parseFloat($(this).find("[id^='PValue']").val() == "" ? 0 : $(this).find("[id^='PValue']").val()),
                sValue: parseFloat($(this).find("[id^='SValue']").val() == "" ? 0 : $(this).find("[id^='SValue']").val()),
                Amount: parseFloat($(this).find("[id^='Amount']").text() == "" ? 0 : $(this).find("[id^='Amount']").text()),
                TotalTaxAmount: $(this).find("[id^='TotalTaxAmount']").text() == "" ? 0 : $(this).find("[id^='TotalTaxAmount']").text(),
                TotalAmount: $(this).find("[id^='TotalAmount']").text() == "" ? 0 : $(this).find("[id^='TotalAmount']").text(),
                Rate: $(this).find("[id^='Amount']").text(),
                Min: 1,
                Mode: $(this).find('input:radio[id="PaymentMode"]:checked').attr("data-radioval"),
                ChargeTo: $('#BillType').val(),
                pBasis: $(this).find("[id^='PBasis']").text(),
                sBasis: $(this).find("[id^='SBasis']").text(),
                Remarks: $(this).find("[id^='Remarks']")[1].innerText == undefined ? "" : $(this).find("[id^='Remarks']")[1].innerText.toUpperCase(),
                WaveoffRemarks: ''
            };
            CTMChargeArray.push(CTMChargeViewModel);

        }

    });

    var obj = {
        MomvementType: 2,
        Type: 'AWB',
        TypeValue: $('#AWBNo').val(),
        BillTo: $('#BillToSNo').val(),
        FlightNo: $('#FlightNo').val(),
        CTMSNo: $('#CTMSNo').val(),
        Process: 6,
        SubProcessSNo: 34,
        LstCTMCharges: CTMChargeArray
    }

    $.ajax({
        url: "Services/Tariff/ESSChargesService.svc/CreateCTMCharges",
        async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data != '' || data != '1') {
                ShowMessage('success', 'Success - CTM Charges', 'CTM Charge Applied Successfully for Invoice ' + data);
                //$("input[name='operation']").prop('type', 'button');
                //navigateUrl('Default.cshtml?Module=Shipment&Apps=Payment&FormAction=INDEXVIEW');
                $("#divCTM").data("kendoWindow").close();
            } else {
                ShowMessage('warning', 'Warning - CTM Charges', "Record Not Saved Please Try Again ", "bottom-right");
            }

        }
    });
}

////////////////////////////end/////////////////////////////////////////

var ManageCTMStatus;
function fnHideBulk() {
    var vgrid = cfi.GetCFGrid("divLyingDetail");
    var expanededUldStockSno = vgrid.options.parentValue;
    var CurrentDivID = "div__" + expanededUldStockSno;
    $('#divLyingDetail table tbody tr[class~="k-master-row"]').each(function (rowmain, trMain) {
        var Rowtr = $(trMain).closest("div.k-grid").find("div.k-grid-header:first");
        var ULDNoIndex = Rowtr.find("th[data-field='ULDNo']").index();

        var nestedGridHeader = $(trMain).next().find("div.k-grid-header");
        var IsCTMIndex = nestedGridHeader.find("th[data-field='IsCTM']").index();
        var ChildRFSRemarksIndex = nestedGridHeader.find("th[data-field='RFSRemarks']").index();
        var ParrentRFSRemarksIdx = Rowtr.find("th[data-field='RFSRemarks']").index();
        var IsBULKIndex = nestedGridHeader.find("th[data-field='Bulk']").index();
        var AWBOffPointIndex = nestedGridHeader.find("th[data-field='AWBOffPoint']").index();

        if ($(nestedGridHeader).parent().attr('id') == CurrentDivID) {

            ////////////Default Hide For Other Flight////////////////
            $(nestedGridHeader).find("th:eq(" + ChildRFSRemarksIndex + ")").hide();

            //////////////////////////////////////////
            if (ManageCTMStatus == "PREUPDATE" || ManageCTMStatus == "BUP") {
                $(nestedGridHeader).find("th:eq(" + IsCTMIndex + ")").hide();
                if (IsRFS) {
                    $(nestedGridHeader).find("th:eq(" + ChildRFSRemarksIndex + ")").show();//for RFS Remarks
                }
            }
            if ($(trMain).find('td:eq(' + ULDNoIndex + ')').text() != "BULK") {
                $(nestedGridHeader).find("th:eq(" + IsCTMIndex + ")").closest('table').find('colgroup').remove();
                $(nestedGridHeader).find("th:eq(0)").hide();
                $(nestedGridHeader).find("th:eq(" + IsBULKIndex + ")").hide();
                $(nestedGridHeader).find("th:eq(" + AWBOffPointIndex + ")").hide();
                $(nestedGridHeader).find("th:eq(" + ChildRFSRemarksIndex + ")").hide();//for RFS Remarks
                var nestedGridContent = $(trMain).next().find("div.k-grid-content > table > tbody  tr");
                $(nestedGridContent).each(function (rowChild, trChild) {
                    $(trChild).find('td:eq(' + IsCTMIndex + ')').closest('table').find('colgroup').remove()
                    $(trChild).find('td:eq(' + IsBULKIndex + ')').hide();
                    $(trChild).find('td:eq(' + AWBOffPointIndex + ')').hide();
                    $(trChild).find('td:eq(0)').hide();
                    $(trChild).find('td:eq(' + ChildRFSRemarksIndex + ')').hide();//for RFS Remarks
                    if (ManageCTMStatus == "PREUPDATE" || ManageCTMStatus == "BUP")
                        $(trChild).find('td:eq(' + IsCTMIndex + ')').hide();

                });
            }
            else {
                if (ManageCTMStatus == "PREUPDATE" || ManageCTMStatus == "BUP") {
                    $(nestedGridHeader).find("th:eq(" + IsCTMIndex + ")").closest('table').find('colgroup').remove();
                    $(nestedGridHeader).find("th:eq(0)").hide();
                }

                var nestedGridContent = $(trMain).next().find("div.k-grid-content > table > tbody  tr");
                $(nestedGridContent).each(function (rowChild, trChild) {
                    $(trChild).find('td:eq(' + ChildRFSRemarksIndex + ')').hide()//for RFS Remarks
                    if (ManageCTMStatus == "PREUPDATE" || ManageCTMStatus == "BUP") {
                        $(trChild).find('td:eq(' + IsCTMIndex + ')').closest('table').find('colgroup').remove()
                        $(trChild).find('td:eq(0)').hide();
                        $(trChild).find('td:eq(' + IsCTMIndex + ')').hide();
                        if (IsRFS) {
                            $(trChild).find('td:eq(' + ChildRFSRemarksIndex + ')').show()//for RFS Remarks
                        }
                    }
                    //var controlId = $(trChild).find("input[type='text'][controltype='autocomplete']").attr("id"); // by parvez khan
                    //cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), GetFlightRouteArray());
                    //$("#" + controlId).data("kendoAutoComplete").setDefaultValue(GetFlightRouteArray()[0].Key, GetFlightRouteArray()[0].Text);
                    //if (GetFlightRouteArray().length == 1)
                    //    $("#" + controlId).data("kendoAutoComplete").enable(false);

                    //fn_CheckOffpointMendetory(controlId);

                });
            }
        }
    });

}
function fnOSCHideBulk() {
    var vgrid = cfi.GetCFGrid("divOSCDetail");
    var expanededUldStockSno = vgrid.options.parentValue;
    var CurrentDivID = "div__" + expanededUldStockSno;
    $('#divOSCDetail table tbody tr[class~="k-master-row"]').each(function (rowmain, trMain) {
        var Rowtr = $(trMain).closest("div.k-grid").find("div.k-grid-header:first");
        var ULDNoIndex = Rowtr.find("th[data-field='ULDNo']").index();
        var ParrentRFSRemarksIdx = Rowtr.find("th[data-field='RFSRemarks']").index();
        var nestedGridHeader = $(trMain).next().find("div.k-grid-header");
        var IsCTMIndex = nestedGridHeader.find("th[data-field='IsCTM']").index();
        var IsBULKIndex = nestedGridHeader.find("th[data-field='Bulk']").index();
        var ChildRFSRemarksIndex = nestedGridHeader.find("th[data-field='RFSRemarks']").index();
        var AWBOffPointIndex = nestedGridHeader.find("th[data-field='AWBOffPoint']").index();


        if ($(nestedGridHeader).parent().attr('id') == CurrentDivID) {
            ////////////Default Hide For Other Flight////////////////
            $(nestedGridHeader).find("th:eq(" + ChildRFSRemarksIndex + ")").hide();


            // var grid = $(nestedGridHeader).closest('div[data-role="grid"]').find(".k-grid:eq(0)").data("kendoGrid");
            // grid.hideColumn("RFSRemarks");
            // $("th[data-field='RFSRemarks'],td[data-column='RFSRemarks']").hide();

            //////////////////////////////////////////
            if (ManageCTMStatus == "PREUPDATE" || ManageCTMStatus == "BUP") {
                $(nestedGridHeader).find("th:eq(" + IsCTMIndex + ")").hide();
                if (IsRFS) {
                    $(nestedGridHeader).find("th:eq(" + ChildRFSRemarksIndex + ")").show();//for RFS Remarks
                }
            }

            if ($(trMain).find('td:eq(' + ULDNoIndex + ')').text() != "BULK") {
                $(nestedGridHeader).find("th:eq(" + IsCTMIndex + ")").closest('table').find('colgroup').remove();
                $(nestedGridHeader).find("th:eq(0)").hide();
                $(nestedGridHeader).find("th:eq(" + IsBULKIndex + ")").hide();
                $(nestedGridHeader).find("th:eq(" + AWBOffPointIndex + ")").hide();
                $(nestedGridHeader).find("th:eq(" + ChildRFSRemarksIndex + ")").hide();//for RFS Remarks
                var nestedGridContent = $(trMain).next().find("div.k-grid-content > table > tbody  tr");
                $(nestedGridContent).each(function (rowChild, trChild) {
                    $(trChild).find('td:eq(' + IsCTMIndex + ')').closest('table').find('colgroup').remove()
                    $(trChild).find('td:eq(' + IsBULKIndex + ')').hide();
                    $(trChild).find('td:eq(' + AWBOffPointIndex + ')').hide();
                    $(trChild).find('td:eq(0)').hide();
                    $(trChild).find('td:eq(' + ChildRFSRemarksIndex + ')').hide();//for RFS Remarks
                    if (ManageCTMStatus == "PREUPDATE" || ManageCTMStatus == "BUP")
                        $(trChild).find('td:eq(' + IsCTMIndex + ')').hide();


                });
            }
            else {
                if (ManageCTMStatus == "PREUPDATE" || ManageCTMStatus == "BUP") {
                    $(nestedGridHeader).find("th:eq(" + IsCTMIndex + ")").closest('table').find('colgroup').remove();
                    $(nestedGridHeader).find("th:eq(0)").hide();
                }
                var nestedGridContent = $(trMain).next().find("div.k-grid-content > table > tbody  tr");
                $(nestedGridContent).each(function (rowChild, trChild) {
                    $(trChild).find('td:eq(' + ChildRFSRemarksIndex + ')').hide()//for RFS Remarks
                    if (ManageCTMStatus == "PREUPDATE" || ManageCTMStatus == "BUP") {
                        $(trChild).find('td:eq(' + IsCTMIndex + ')').closest('table').find('colgroup').remove()
                        $(trChild).find('td:eq(0)').hide();
                        $(trChild).find('td:eq(' + IsCTMIndex + ')').hide();
                        if (IsRFS) {
                            $(trChild).find('td:eq(' + ChildRFSRemarksIndex + ')').show();//for RFS Remarks
                        }
                    }
                    //var controlId = $(trChild).find("input[type='text'][controltype='autocomplete']").attr("id");  // by parvez khan
                    //cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), GetFlightRouteArray());
                    //$("#" + controlId).data("kendoAutoComplete").setDefaultValue(GetFlightRouteArray()[0].Key, GetFlightRouteArray()[0].Text);
                    //if (GetFlightRouteArray().length == 1)
                    //    $("#" + controlId).data("kendoAutoComplete").enable(false);

                    //fn_CheckOffpointMendetory(controlId);


                });
            }
        }
    });


}

function GetFlightRouteArray() {
    //var Arr = FlightDestination.split('-');
    //var FRoute = new Array();
    //var LoginCityIndex = Arr.indexOf(userContext.AirportCode);
    //$(Arr).each(function (row, tr) {
    //    if (row > LoginCityIndex)
    //        FRoute.push({ Key: tr, Text: tr })
    //});
    //return FRoute;
}
/////////////////////////////////for check OffPointMendetory////////////////// Commented by parvez khan
function fn_CheckOffpointMendetory(controlId) {
    //$("#" + controlId).unbind().bind("blur", function () {
    //    var selectedOffPoint = $(this).val();
    //    var result = GetFlightRouteArray().find(function (item, i) {
    //        return item.Key === selectedOffPoint.toUpperCase() ? true : false;
    //    });

    //    if (!result) {
    //        ShowMessage('warning', 'Warning ', "Entered Off-Point must be part of Flight Route", "bottom-right");
    //        $("#" + controlId).data("kendoAutoComplete").setDefaultValue($("#" + controlId.replace("Text_", "")).val() == "" ? GetFlightRouteArray()[0].Key : $("#" + controlId.replace("Text_", "")).val(), $("#" + controlId.replace("Text_", "")).val() == "" ? GetFlightRouteArray()[0].Text : $("#" + controlId.replace("Text_", "")).val());
    //    }

    //});
}
////////////////////end////////////////////////
function AddScroll() {
    $("#divLyingDetail .WebFormTable2 tbody tr:nth-child(3) td:first div:first div.k-grid-content").css({ "max-height": "300px", "overflow": "auto" });
    $('#divLyingDetail table tbody tr[class~="k-master-row"]').each(function (rowmain, trMain) {
        var Rowtr = $(trMain).closest("div.k-grid").find("div.k-grid-header:first");
        var ULDNoIndex = Rowtr.find("th[data-field='ULDNo']").index();
        var RFSRemarksIndex = Rowtr.find("th[data-field='RFSRemarks']").index();

        //if ($(trMain).find('td:eq(' + ULDNoIndex + ')').text() == "BULK") {
        //    var nestedGridHeader = $(trMain).next().find("div.k-grid-header");
        //    $(trMain).find('td[class="k-hierarchy-cell"]').find('a[class="k-icon k-plus"]').trigger("click");
        //}

        //var controlId = $(trMain).find("input[type='text'][controltype='autocomplete']").attr("id");  // by parvez khan
        //cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), GetFlightRouteArray());
        //$("#" + controlId).data("kendoAutoComplete").setDefaultValue(GetFlightRouteArray()[0].Key, GetFlightRouteArray()[0].Text);
        //if (GetFlightRouteArray().length == 1)
        //    $("#" + controlId).data("kendoAutoComplete").enable(false);

        //fn_CheckOffpointMendetory(controlId);

    });
    ////for RFS Remarks
    var grid = $("#divLyingDetail").find(".k-grid:eq(0)").data("kendoGrid");
    grid.hideColumn("RFSRemarks");
    $("th[data-field='RFSRemarks'],td[data-column='RFSRemarks']").hide();

    // Rowtr.find("th[data-field='RFSRemarks']").hide();
    // $(trMain).find('td:eq(' + RFSRemarksIndex + ')').hide();
    if (ManageCTMStatus == "PREUPDATE" || ManageCTMStatus == "BUP") {
        if (IsRFS) {
            grid.showColumn("RFSRemarks");
            $("th[data-field='RFSRemarks'],td[data-column='RFSRemarks']").show();
            // Rowtr.find("th[data-field='RFSRemarks']").show();
            // $(trMain).find('td:eq(' + RFSRemarksIndex + ')').show();
        }
    }
    /////end
}
function OSCSuccessGrid() {
    $('#divOSCDetail table tbody tr[class~="k-master-row"]').each(function (rowmain, trMain) {
        var Rowtr = $(trMain).closest("div.k-grid").find("div.k-grid-header:first");
        var ULDNoIndex = Rowtr.find("th[data-field='ULDNo']").index();
        var RFSRemarksIndex = Rowtr.find("th[data-field='RFSRemarks']").index();

        //if ($(trMain).find('td:eq(' + ULDNoIndex + ')').text() == "BULK") {
        //    var nestedGridHeader = $(trMain).next().find("div.k-grid-header");
        //    $(trMain).find('td[class="k-hierarchy-cell"]').find('a[class="k-icon k-plus"]').trigger("click");
        //}

        ////for RFS Remarks
        // Rowtr.find("th[data-field='RFSRemarks']").hide();
        // $(trMain).find('td:eq(' + RFSRemarksIndex + ')').hide();

        /////end
        //var controlId = $(trMain).find("input[type='text'][controltype='autocomplete']").attr("id"); // by parvez khan
        //cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), GetFlightRouteArray());
        //$("#" + controlId).data("kendoAutoComplete").setDefaultValue(GetFlightRouteArray()[0].Key, GetFlightRouteArray()[0].Text);
        //if (GetFlightRouteArray().length == 1)
        //    $("#" + controlId).data("kendoAutoComplete").enable(false);

        //fn_CheckOffpointMendetory(controlId);
    });
    var grid = $("#divOSCDetail").find(".k-grid:eq(0)").data("kendoGrid");
    grid.hideColumn("RFSRemarks");
    $("th[data-field='RFSRemarks'],td[data-column='RFSRemarks']").hide();

    if (ManageCTMStatus == "PREUPDATE" || ManageCTMStatus == "BUP") {
        if (IsRFS) {
            grid.showColumn("RFSRemarks");
            $("th[data-field='RFSRemarks'],td[data-column='RFSRemarks']").show();
            // Rowtr.find("th[data-field='RFSRemarks']").show();
            // $(trMain).find('td:eq(' + RFSRemarksIndex + ')').show();
        }
    }

}

ShowIndexView = function (divId, serviceUrl, jscriptUrl) {
    $.ajax({
        url: serviceUrl, async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            //if (jscriptUrl != undefined && jscriptUrl != "") {
            //    ngen.loadjscssfile(jscriptUrl, "js");
            //}
            $("#" + divId).html(result);
        },
        error: function (jqXHR, textStatus) {
        }
    });
}
var ATDTime;
var FlightOrigin, FlightDestination, FlightStatus, IsNILManifested, IsRFS, IsBuildup, IsPreManifested, IsRFSFlightsEdit, IsPAX, PartnerCarrierCode, PartnerGroupCarrierCode, IsCargoTransfered;
var IsButtonClick = false;
function onRowChange(input) {
    var trHeaderRow;
    var trContentRow;
    $('#dv_FlightManifestPrint').hide();
    $("#tdCancelLI").hide();
    //trHeaderRow = this.select().closest("div.k-grid").find("div.k-grid-header");
    //trContentRow = this.select();
    trHeaderRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header")
    trContentRow = $(input).closest('tr').select();
    var FlightSNoIndex = 0;

    var FlightGroupSNoIndex = trHeaderRow.find("th[data-field='GroupFlightSNo']").index();
    var FlightNoIndex = trHeaderRow.find("th[data-field='FlightNo']").index();
    var FlightDateIndex = trHeaderRow.find("th[data-field='FlightDate']").index();
    var FlightRouteIndex = trHeaderRow.find("th[data-field='FlightRoute']").index();
    var BoardingPointIndex = trHeaderRow.find("th[data-field='BoardingPoint']").index();
    var ETDIndex = trHeaderRow.find("th[data-field='ETD']").index();
    var ATDIndex = trHeaderRow.find("th[data-field='ATD']").index();
    var ATDGMTIndex = trHeaderRow.find("th[data-field='ATDGMT']").index();
    var EndPointIndex = trHeaderRow.find("th[data-field='EndPoint']").index();
    var ACTypeIndex = trHeaderRow.find("th[data-field='ACType']").index();
    var FlightStatusIndex = trHeaderRow.find("th[data-field='FlightStatus']").index();
    var ProcessStatusInx = trHeaderRow.find("th[data-field='ProcessStatus']").index();
    var IsStackInx = trHeaderRow.find("th[data-field='IsStack']").index();
    var IsNILManifestedInx = trHeaderRow.find("th[data-field='IsNILManifested']").index();
    var IsCargoTransferedInx = trHeaderRow.find("th[data-field='IsCargoTransfered']").index();
    var IsRFSInx = trHeaderRow.find("th[data-field='IsRFS']").index();
    var IsRFSFlightsEditIndex = trHeaderRow.find("th[data-field='IsRFSFlightsEdit']").index();
    var IsBuildupInx = trHeaderRow.find("th[data-field='IsBuildup']").index();
    var IsPreManifestedInx = trHeaderRow.find("th[data-field='IsPreManifested']").index();
    var IsFlightClosedInx = trHeaderRow.find("th[data-field='IsFlightClosed']").index();
    var IsStopOverInx = trHeaderRow.find("th[data-field='IsStopOver']").index();
    var IsPAXInx = trHeaderRow.find("th[data-field='IsPAX']").index();
    var IsUWSInx = trHeaderRow.find("th[data-field='IsUWS']").index();
    var RegistrationNoInx = trHeaderRow.find("th[data-field='RegistrationNo']").index();
    var PartnerCarrierCodeInx = trHeaderRow.find("th[data-field='PartnerAirline']").index();

    ATDTime = trContentRow.find("td:eq(" + ETDIndex + ")").text();
    IsFlightClosed = trContentRow.find("td:eq(" + IsFlightClosedInx + ")").text() == "true" ? true : false;
    $("#RegistrationNo").val(trContentRow.find("td:eq(" + RegistrationNoInx + ")").text());
    $("#hdnFlightSNo").val(trContentRow.find("td:eq(" + FlightSNoIndex + ")").text());
    $("#tdFlightNo").text(trContentRow.find("td:eq(" + FlightNoIndex + ")").text());
    $("#tdFlightDate").text(trContentRow.find("td:eq(" + FlightDateIndex + ")").text());
    $("#tdBoardingPoint").text(trContentRow.find("td:eq(" + BoardingPointIndex + ")").text());
    $("#tdEndPoint").text(trContentRow.find("td:eq(" + EndPointIndex + ")").text());
    $("#tdFlightRoute").text(trContentRow.find("td:eq(" + FlightRouteIndex + ")").text());
    $("#tdAircraftType").text(trContentRow.find("td:eq(" + ACTypeIndex + ")").text());
    $("#tdFlightStatus").text(trContentRow.find("td:eq(" + FlightStatusIndex + ")").text());
    IsNILManifested = trContentRow.find("td:eq(" + IsNILManifestedInx + ")").text();

    IsCargoTransfered = trContentRow.find("td:eq(" + IsCargoTransferedInx + ")").text() == "true" ? true : false;
    IsRFS = trContentRow.find("td:eq(" + IsRFSInx + ")").text() == "true" ? true : false;
    IsBuildup = trContentRow.find("td:eq(" + IsBuildupInx + ")").text() == "true" ? true : false;
    IsPreManifested = trContentRow.find("td:eq(" + IsPreManifestedInx + ")").text() == "true" ? true : false;
    IsRFSFlightsEdit = trContentRow.find("td:eq(" + IsRFSFlightsEditIndex + ")").text() == "true" ? true : false;
    IsPAX = trContentRow.find("td:eq(" + IsPAXInx + ")").text() == "true" ? true : false;
    IsUWS = trContentRow.find("td:eq(" + IsUWSInx + ")").text() == "true" ? true : false;
    FlightStatus = trContentRow.find("td:eq(" + FlightStatusIndex + ")").text();
    FlightOrigin = trContentRow.find("td:eq(" + BoardingPointIndex + ")").text();
    FlightDestination = trContentRow.find("td:eq(" + FlightRouteIndex + ")").text();
    FlightCloseFlag = trContentRow.find("td:eq(" + FlightStatusIndex + ")").text() == "BUILD UP" ? "BUP" : trContentRow.find("td:eq(" + FlightStatusIndex + ")").text();
    FlightStatusFlag = trContentRow.find("td:eq(" + ProcessStatusInx + ")").text();
    var FlightSNo = trContentRow.find("td:eq(" + FlightGroupSNoIndex + ")").text(); //$(this.select()).find('td:first').text();
    CurrentFlightSno = trContentRow.find("td:eq(" + FlightGroupSNoIndex + ")").text();
    ///////////////////////
    PartnerCarrierCode = GetPartnerCarrierCode(trContentRow.find("td:eq(" + PartnerCarrierCodeInx + ")").text());
    PartnerGroupCarrierCode = trContentRow.find("td:eq(" + PartnerCarrierCodeInx + ")").text();
    subprocesssno = FlightCloseFlag == "Open" ? 35 : FlightCloseFlag == "LI" ? 35 : FlightCloseFlag == "BUP" ? 33 : FlightCloseFlag == "PRE" ? 34 : FlightCloseFlag == "MAN" ? 34 : 2112;
    UserSubProcessRights("divContentDetail", subprocesssno);
    $('#StackDetailTab').hide();
    $('#FlightStopOverDetailTab').hide();
    //added for pax and freighter radio button
    $('#tdFlightType').hide();
    $("#tdNILManifest,#tdATDTime,#tdATDDate,#tdManRemarks,#tdManifestRemarks,#tdregnNo,#tdregnNoTxt").show();
    $('#btnSaveAndClose').hide();
    //$('#spnRegistrationNo,#RegistrationNo').show();
    $('#divDetail,#divLyingDetail').html("");
    $("#divContentDetail").show();
    $('#SecondTab').show();
    $('#btnMoveToLying').hide();
    $('#OSCTab').show();
    $("#divAction").show();
    $('#btnFlightClose').hide();
    $('#tblFlightAWBInfo').show();
    $('#btnFinalizedPreMan').hide();
    $("#tblFlightAWBInfo").show();
    $('#btnSaveAndClose').hide();
    $('#tblAWBButtonInfo').show();
    $('#tdNILManifest').show();
    $('#btn_OSI').hide();
    $('#tdManRemarks,#tdATDDate,#tdManifestRemarks,#tdATDTime').hide();
    $('#btn_SendNtm').css('visibility', 'hidden');
    $('#td_sendNtm').hide();
    $('#btn_Print').hide();
    $('#btnUWS').hide();
    $('#btnCBV').hide();
    $('#btnEDIMsgSend').hide();
    $('#btnEDIMSG').hide();
    $('#tdIsExcludeFromFFM').hide();

    //// for Flight Details
    FlightRoute = GetFlightRoute(trContentRow.find("td:eq(" + FlightRouteIndex + ")").text());
    ////
    ManageCTMStatus = FlightCloseFlag;//use for Hide and Show CTM Charge Button
    var IsView, IsBlocked;
    $(userContext.ProcessRights).each(function (i, e) {
        if (e.SubProcessSNo == subprocesssno) {
            IsView = e.IsView;
            IsBlocked = e.IsBlocked;
        }
    });
    if (!IsButtonClick) {
        if (!IsBlocked) {
            var LyingListGridType;
            $('#divContentDetail,#btnSave,#btnCancel').show();
            if ((FlightCloseFlag == "PRE") || (FlightCloseFlag == "BUP") || (FlightCloseFlag == "MAN") || (FlightCloseFlag == "DEP") || (FlightCloseFlag == "CLSD")) {
                ShowIndexView("divDetail", "Services/FlightControl/FlightControlService.svc/GetFlightTransGridData/FLIGHTCONTROL/FlightControl/MANIFESTULD/" + FlightSNo + "/" + FlightCloseFlag);
                LyingListGridType = 'MULTI';
            }
            else {
                $('#btnSaveAndClose').hide();
                ShowIndexView("divDetail", "Services/FlightControl/FlightControlService.svc/GetFlightTransGridData/FLIGHTCONTROL/FlightControl/FLIGHTAWB/" + FlightSNo + "/" + FlightCloseFlag);
                LyingListGridType = 'SINGLE';
            }

            $("#SecondTab").unbind("click").bind("click", function () {
                if ($("#divLyingDetail table").length === 0) {
                    fn_GetLyingList('-1', GetFlightSortRoute(trContentRow.find("td:eq(" + FlightRouteIndex + ")").text()), LyingListGridType);
                }
            });
            $("#OSCTab").unbind("click").bind("click", function () {
                if ($("#divOSCDetail table").length === 0) {
                    fn_GetOSCLyingList('-1', FlightRoute, LyingListGridType);
                }
            });
        }
        else {
            //$('#StackDetailTab,#FlightStopOverDetailTab,#SecondTab,#OSCTab,#FirstTab').hide();
            $('#divContentDetail,#btnSave,#btnCancel,#btnFinalizedPreMan,#btnSaveAndClose,#btnFlightClose').hide();
        }
    }
    $("#divLyingDetail").html("");
    $("#divOSCDetail").html("");
    if (FlightCloseFlag == 'BUP') {
        FunctionName = "SavePMenifestInformation";
    }
    else {
        FunctionName = FlightCloseFlag == "PRE" ? "SaveMenifestInformation" : "SavePMenifestInformation";
    }

    if (FlightCloseFlag == 'Open') {
        // $('#spnRegistrationNo,#RegistrationNo').hide();
        $('#btnPrint').hide();
        $('#btn_Print').hide();
        $('#divDetail > table > tbody > tr:nth-child(1) > td').text('Loading Instruction Details');
        $('#FirstTab').text('Loading Instruction');
        $('#btnSave').text("Save Loading Instruction");
        SaveProcessStatus = "LI";//for save loading instruction
    }
    else if (FlightCloseFlag == 'LI') {
        $('#btn_Print').show();
        $('#btnMoveToLying').show();
        $("#tdCancelLI").show();
        // $('#spnRegistrationNo,#RegistrationNo').hide();
        $('#divDetail > table > tbody > tr:nth-child(1) > td').text('Edit Loading Instruction Details');
        $('#btnSave').text("Update Loading Instruction");
        $('#FirstTab').text('Loading Instruction');
        SaveProcessStatus = "LI";//for save loading instruction
    }
    else if (FlightCloseFlag == 'BUP') {
        if (!IsView)
            if (!IsBlocked)
                $('#btnFinalizedPreMan').show();
        $('#btn_Print').hide();
        $('#divDetail > table > tbody > tr:nth-child(1) > td').text('Pre Manifest Details');
        $('#btnSave').text("Save Pre Manifest");
        $('#FirstTab').text('Pre Manifest');
        SaveProcessStatus = "PRE";
    }
    else if (FlightCloseFlag == 'PRE') {
        $('#btn_Print').show();
        $('#tdFlightType').show();
        $('#divDetail > table > tbody > tr:nth-child(1) > td').text('Manifest Details');

        if (!IsView) {
            if (!IsBlocked)
                $('#btnSaveAndClose').show();
            //  if (FlightStatusFlag == '1_0_2_0_0_0' || FlightStatusFlag == '1_1_2_0_0_0' || FlightStatusFlag == '1_0_2_0_0_1' || FlightStatusFlag == '1_1_2_0_0_1')
            //  if (!IsBlocked)
            //    $('#btnFinalizedPreMan').show();
        }
        $('#btnSave').text("Save Manifest");
        $('#FirstTab').text('Manifest');
        $('#btn_OSI').show();
        //$('#tdManRemarks,#tdATDDate,#tdManifestRemarks,#tdATDTime').show();
        $('#tdManRemarks,#tdATDDate,#tdManifestRemarks,#tdATDTime,#tdNILManifest').show();
        SaveProcessStatus = "MAN";
        //UserSubProcessRights("divContentDetail", subprocesssno);
    }
    else if (FlightCloseFlag == 'MAN') {
        $('#btn_Print').show();
        //added for pax and freighter radio button
        $('#tdFlightType').show();
        if ($("#tdFlightNo").text().split('-')[0].trim().toUpperCase() == "QR")
            $('#btnCBV').show();
        $('#divDetail > table > tbody > tr:nth-child(1) > td').text('Edit Manifest Details');
        if (!IsView)
            if (!IsBlocked)
                $('#btnSaveAndClose').show();

        $('#btnSave').text("Update Manifest");
        $('#FirstTab').text('Manifest');
        $('#btn_OSI').show();
        $('#tdManRemarks,#tdATDDate,#tdManifestRemarks,#tdATDTime,#tdNILManifest').show();
        SaveProcessStatus = "MAN";
        //  UserSubProcessRights("divContentDetail", subprocesssno);
    }
    else if (FlightCloseFlag == "DEP" || FlightCloseFlag == "CLSD") {
        $('#btn_Print').show();
        //added for pax and freighter radio button
        $('#tdFlightType').show();
        if ($("#tdFlightNo").text().split('-')[0].trim().toUpperCase() == "QR")
            $('#btnCBV').show();

        $("#tdNILManifest").hide();

        $('#tdManRemarks,#tdATDDate,#tdManifestRemarks,#tdATDTime').show();
        //  UserSubProcessRights("divContentDetail", 2112);
        $('#divDetail > table > tbody > tr:nth-child(1) > td').text('Flight Depart Details');
        $("#divAction button").hide();
        $('#btnFlightClose').show();
        $('#btn_OSI').show();
        //  $('#tdManRemarks,#tdATDDate,#tdManifestRemarks,#tdATDTime,#tdNILManifest').hide();
        $('#FirstTab').text('Flight Depart');
        if (FlightCloseFlag == "CLSD")
            $('#btnFlightClose').hide();
        $('#btnSave').hide();
        SaveProcessStatus = "DEP";
        if (FlightCloseFlag == "DEP")
            $('#btnEDIMSG').show();
    }
    // else
    //  $('#spnRegistrationNo,#RegistrationNo').hide();


    BindSaveSection();
    $("#ulTab").show();
    $("#tabstrip").kendoTabStrip();
    $("#tabstrip").kendoTabStrip().data("kendoTabStrip").select($("#tabstrip").kendoTabStrip().data("kendoTabStrip").tabGroup.children("li").eq(0));


    if (trContentRow.find("td:eq(" + IsStackInx + ")").text() == "true") {
        $('#StackDetailTab').css("display", "inline-block");
        //$("#tabstrip").kendoTabStrip(2).show();
    }
    if (trContentRow.find("td:eq(" + IsStopOverInx + ")").text() == "true") {
        $('#FlightStopOverDetailTab').css("display", "inline-block");
        if (FlightCloseFlag == "PRE" || FlightCloseFlag == "MAN") {
            $('#tdIsExcludeFromFFM').show();
            $('#IsExcludeFromFFM').prop('checked', 0);
        }
        else {
            $('#tdIsExcludeFromFFM').hide();
        }
        //$("#tabstrip").kendoTabStrip(2).show();
    }
    // var TotalAWBGrossWT = 0, TotalAWBVolumeWT = 0, TotalAWBCBMWT = 0;

    $('#RegistrationNo').keypress(function (e) {
        var allowedChars = new RegExp("^[a-zA-Z0-9\-]+$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (allowedChars.test(str)) {
            return true;
        }
        e.preventDefault();
        return false;
    }).keyup(function () {
        // the addition, which whill check the value after a keyup (triggered by Ctrl+V)
        // We take the same regex as for allowedChars, but we add ^ after the first bracket : it means "all character BUT these"
        var forbiddenChars = new RegExp("[^a-zA-Z0-9\-]", 'g');
        if (forbiddenChars.test($(this).val())) {
            $(this).val($(this).val().replace(forbiddenChars, ''));
        }
    });

    $("#txtATDTime").kendoTimePicker({
        format: "HH:mm", interval: 1
        , min: new Date(trContentRow.find("td:eq(" + ETDIndex + ")").text().split(':')[0], trContentRow.find("td:eq(" + ETDIndex + ")").text().split(':')[1])
    });
    var TxtDate = new Date();
    if (trContentRow.find("td:eq(" + ATDIndex + ")").text() != "")
        $("#txtATDTime").data("kendoTimePicker").value(trContentRow.find("td:eq(" + ATDIndex + ")").text());
    else
        $("#txtATDTime").val(GetUserLocalTime("L").split(' ')[1].substr(0, 5));
    //$("#txtATDTime").data("kendoTimePicker").value(TxtDate.getHours() + ':' + TxtDate.getMinutes());

    var start = new Date(trContentRow.find("td:eq(" + FlightDateIndex + ")").text());

    $("#txtATDDate").kendoDatePicker({
        value: new Date(),
        min: new Date(start.getFullYear(), start.getMonth(), start.getDate())
    });
    var DateValue;
    if (trContentRow.find("td:eq(" + ATDGMTIndex + ")").text().replace("01-Jan-1900", "") != "")
        //$("#txtATDDate").data("kendoDatePicker").value(new Date());
        $("#txtATDDate").data("kendoDatePicker").value(new Date(trContentRow.find("td:eq(" + ATDGMTIndex + ")").text()));
    else
        $("#txtATDDate").data("kendoDatePicker").value(new Date());

    $("#txtATDTime").data("kendoTimePicker").bind("change", function (e) {
        // if(this.value()<trContentRow.find("td:eq(" + ETDIndex + ")").text())
        //  e.preventDefault()
        // if(this.value()>(trContentRow.find("td:eq(" + ETDIndex + ")").text()+00:10);
        // console.log(value); //value is the selected date in the timepicker
    });

    /* for Flight Row reset */
    $('#divFlightDetails table tbody tr').each(function (row, tr) {
        if ($(tr).find("td:eq(" + IsNILManifestedInx + ")").text() == "true")
            $(tr).css('background-color', 'rgba(204, 39, 39, 0.22)');//.css('color', 'white');
        if ($(tr).find("td:eq(" + IsCargoTransferedInx + ")").text() == "true" && $(tr).find("td:eq(" + IsNILManifestedInx + ")").text() == "flase")
            $(tr).css('background-color', 'rgba(159, 123, 246, 0.31)');//.css('color', 'white');
    });
    if (IsNILManifested == "true") {

        $('#btnSave').hide();
        $('#btnNILManifest').text('Print NIL Manifest');
        //$("#divDetailPrint").css("border", "3px solid #e5aeae").css("box-shadow", "inset 0px 0px 10px 0px #e5aeae").css("padding", "2px");
        $(trContentRow).css("background-color", "rgba(204, 39, 39, 0.70)");
        $('#SecondTab,#OSCTab').css("display", "none");
    }
    else if (IsCargoTransfered && IsNILManifested == "false") {
        $(trContentRow).css('background-color', 'rgba(159, 123, 246, 0.82)');//.css('color', 'white');
    }
    else {
        $('#btnNILManifest').text('Create NIL Manifest');
        //$("#divDetailPrint").removeAttr("style");
    }
    //Validation For IsRFS FLight

    //end
    //  if(FlightCloseFlag == "DEP")
    //    $('#btnSave').hide();
    //  IsButtonClick = false;
    if (IsUWS)
        $('#btnUWS').show();
    //Added for Pax and Freighter radio button
    var FlightType = trContentRow.find('td[data-column="FlightType"]').html();
    $("input[name=Pax][value=" + FlightType + "]").attr("checked", 1);
}

/******************************* Get Lying List Function ****************************************/
//var ULDSNO = "-1";
function fn_GetLyingList(ULDSNO, tdRoute, LyingListGridType) {
    if (LyingListGridType == 'MULTI') {
        fun_GetSearchPanel("ManifestLyingSearch", "divLyingSearch", SearchManifestLyingLst);
        //Use -1 For Bind All Origin City From Session
        cfi.ShowIndexView("divLyingDetail", "Services/FlightControl/FlightControlService.svc/GetFlightManifestTransGridData/FLIGHTCONTROL/FlightControl/MANIFESTFLIGHTLYING/" + userContext.AirportCode + "/A~A/" + ULDSNO + "/" + PartnerCarrierCode + "/" + tdRoute + "/A~A/A~A");

    }
    else {
        fun_GetLISearchPanel("LILyingSearch", "divLyingSearch", SearchLyingLst);
        SearchlyingList("A~A", "A~A", 'A~A', "0", "0", "0", userContext.AirportCode, PartnerCarrierCode, tdRoute, "A~A");
    }
}
function fn_GetOSCLyingList(ULDSNO, FlightRoute, LyingListGridType) {
    if (LyingListGridType == 'MULTI') {
        fun_GetOSCSearchPanel("OSCLyingSearch", "divOSCSearch", SearchOSCLyingLst);
        cfi.ShowIndexView("divOSCDetail", "Services/FlightControl/FlightControlService.svc/GetFlightManifestTransGridData/FLIGHTCONTROL/FlightControl/OSCFLIGHTLYING/" + userContext.AirportCode + "/A~A/" + ULDSNO + "/" + PartnerCarrierCode + "/" + FlightRoute + "/A~A/A~A");
    }
    else {
        fun_GetLIOSCSearchPanel("OSCLILyingSearch", "divOSCSearch", SearchLIOSCLyingLst);
        SearchOSCList("A~A", 'A~A', 'A~A', "0", "0", "0", userContext.AirportCode, PartnerCarrierCode, FlightRoute, "A~A");
    }
}
/******************************************END***************************************************/

function fn_ValidateULDCount(e) {
    $(e).val($(e).val().replace(/[^0-9]/g, ''));
}

function fun_SetTotalGR_V_CBM(input) {
    //var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    //var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    //var ActualG_V_CBM = $(input).closest('tr').find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
    //TotalAWBGrossWT=parseFloat(ActualG_V_CBM[0]);
    //TotalAWBVolumeWT=parseFloat(ActualG_V_CBM[1]);
    //TotalAWBCBMWT = parseFloat(ActualG_V_CBM[2]);
}
function fun_CheckGR_V_CBM() {
    var flag = true;
    var trRow = $('#divDetail tbody tr').closest("div.k-grid").find("div.k-grid-header")
    //var trRow = $(tr).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trRow.find("th[data-field='PlanG_V_CBM']").index();
    var AWBNOIndex = trRow.find("th[data-field='AWBNo']").index();
    var MessageArray = new Array();
    var ct = 0;
    var ACTWayBill = "";
    var PGrossWt = 0, PVolumeWt = 0, PCBMWt = 0, TGrossWt = 0, TVolumeWt = 0, TCBM = 0, RGrossWt = 0, RVolumeWt = 0, RCBM = 0;
    $('#divDetail div.k-grid-content tbody tr').each(function (row, tr) {

        PGrossWt = 0, PVolumeWt = 0, PCBMWt = 0;
        var CurrentAWBNo = $(tr).find('td:eq(' + AWBNOIndex + ')').text();
        var ActualG_V_CBM = $(tr).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');

        $('#divDetail div.k-grid-content tbody tr').each(function (row1, tr1) {
            if ($(tr1).find('td:eq(' + AWBNOIndex + ')').text() == CurrentAWBNo) {
                PGrossWt += parseFloat($(tr1).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val());
                PVolumeWt += parseFloat($(tr1).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val());
                PCBMWt += parseFloat($(tr1).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val());
            }
        });
        ACTWayBill = $(tr).find('td:eq(' + AWBNOIndex + ')').text();
        if (parseFloat(ActualG_V_CBM[0]).toFixed(3) != parseFloat(PGrossWt).toFixed(3)) {
            ct = 1;
            TGrossWt = parseFloat(ActualG_V_CBM[0]).toFixed(3);
            RGrossWt = TGrossWt - PGrossWt;
        }
        else if (parseFloat(ActualG_V_CBM[1]).toFixed(3) != parseFloat(PVolumeWt).toFixed(3)) {
            ct = 2;
            TVolumeWt = parseFloat(ActualG_V_CBM[1]).toFixed(3);
            RVolumeWt = TVolumeWt - PVolumeWt;
        }
        else if (parseFloat(ActualG_V_CBM[2]).toFixed(3) != parseFloat(PCBMWt).toFixed(3)) {
            ct = 3;
            TCBM = parseFloat(ActualG_V_CBM[2]).toFixed(3);
            RCBM = TCBM - PCBMWt;
        }
    });
    switch (ct) {
        case 1:
            {
                ShowMessage('warning', 'Warning -Planned Gross Weight shuld be equal to Actual Gross Weight', "Actual Gross Weight =" + TGrossWt + " and Remainning Gross Weight =" + parseFloat(RGrossWt).toFixed(3) + " ", "bottom-right");
                break;
            }
        case 2:
            {
                ShowMessage('warning', 'Warning -Planned Volume Weight shuld be equal to Actual Volume Weight', "Actual Volume Weight =" + TVolumeWt + " and Remainning Volume Weight =" + parseFloat(RVolumeWt).toFixed(3) + " ", "bottom-right");
                break;
            }
        case 3:
            {
                ShowMessage('warning', 'Warning -Planned CBM shuld be equal to Actual CBM', "Actual CBM =" + TCBM + " and Remainning CBM =" + parseFloat(RCBM).toFixed(3) + " ", "bottom-right");
                break;
            }
    }

}
//For Save All Process
function SaveFormData(subprocess) {
    var issave = false;
    if (subprocess.toUpperCase() == "LI") {
        issave = SavePreManifestInfo();
    }
    else if (subprocess.toUpperCase() == "PRE") {
        issave = SaveManifestInfo();
    }
    else if (subprocess.toUpperCase() == "PRE_FINAL") {
        issave = SaveManifestInfo();
    }
    else if (subprocess.toUpperCase() == "MAN") {
        issave = SaveManifestInfo();
    }
    else if (subprocess.toUpperCase() == "GP") {   // Add by parvez khan
        issave = SaveGatePass(subprocess.toUpperCase());
    }
    return issave;
}

//End Save All Process

function GetFlightULDSTACKDetails() {
    ShowIndexView("divStackDetail", "Services/FlightControl/FlightControlService.svc/GetFlightTransGridData/FLIGHTCONTROL/FlightControl/ULDSTACK/" + CurrentFlightSno + "/STACK");
}

function checkProgrss(item, subprocess, displaycaption) {
    if ((displaycaption == "GP")) {
        var a = $("input[type='checkbox']#chkBulk");
        if (a.length >0) {
                return "\"completeprocess\"";
            }
            else {
                return "\"partialprocess\"";
            }
        //if (a.length == a.filter(":checked").length) {
        //    return "\"completeprocess\"";
        //}
        //else {
        //    return "\"partialprocess\"";
        //}
    }
    // var ProgressStatus = item.split(',');
    //if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_1_C" + ",") >= 0) {
    //    //if ((displaycaption == "L I") && (ProgressStatus[0] == 1)) {
    //    return "\"completeprocess\"";
    //}
    //if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_2_P" + ",") >= 0) {
    //    //if ((displaycaption == "L I") && (ProgressStatus[0] == 1)) {
    //    return "\"partialprocess\"";
    //}
    //if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_2_I" + ",") >= 0) {
    //    //if ((displaycaption == "L I") && (ProgressStatus[0] == 1)) {
    //    return "\"incompleteprocess\"";
    //}
}

function BindSaveSection() {
    //SAVE SECTION
    $("#btnCancel").unbind("click").bind("click", function () {
        $('#divDetail').html("");
        $('#divContentDetail').hide();
    });
    $("#btnSave").unbind("click").bind("click", function () {
        if (IsNILManifested == "true") {
            ShowMessage('warning', 'Warning -NIL Manifest already created for this flight', " ", "bottom-right");
        }
        else {
            if (SaveFormData(SaveProcessStatus)) {
                FlightSearch();
            }
        }
    });
    $("#btnSaveAndClose").unbind("click").bind("click", function () {

        // if (IsNILManifested == "true") {
        //   ShowMessage('warning', 'Warning -NIL Manifest already created for this flight', " ", "bottom-right");
        // }
        // else {

        if (($("#RegistrationNo").val() || "") == "") {
            ShowMessage('warning', 'Warning', 'Please Enter Aircraft Registration No.', "bottom-right");
        }
        else if ((cfi.CfiDate("txtATDDate") || "") == "" || ($("#txtATDTime").val() || "") == "") {
            ShowMessage('warning', 'Warning ', "Please Enter ATD Date/Time", "bottom-right");
        }
        else {
            var r = jConfirm("Are you sure,you want to Depart Flight ?", "", function (r) {
                if (r == true) {
                    SaveProcessStatus = "DEP";
                    if (SaveManifestInfo("DEP")) {
                        cfi.ShowIndexView("divDetail", "Services/FlightControl/FlightControlService.svc/GetFlightTransGridData/FLIGHTCONTROL/FlightControl/MANIFESTULD/" + $('#hdnFlightSNo').val() + "/MAN");
                        FlightSearch();
                        $('#tblFlightAWBInfo').show();

                    }
                    SaveProcessStatus = "MAN";
                }
            });
        }
        /*
        if ($("#RegistrationNo").val() != "") {
            var r = jConfirm("Are you sure,you want to Depart Flight ?", "", function (r) {
                if (r == true) {
                    SaveProcessStatus = "DEP";
                    if (SaveManifestInfo("DEP")) {
                        cfi.ShowIndexView("divDetail", "Services/FlightControl/FlightControlService.svc/GetFlightTransGridData/FLIGHTCONTROL/FlightControl/MANIFESTULD/" + $('#hdnFlightSNo').val() + "/MAN");
                        FlightSearch();
                        $('#tblFlightAWBInfo').show();

                    }
                    SaveProcessStatus = "MAN";
                }
            });
        }

        else {
            ShowMessage('warning', 'Warning', 'Please Enter Aircraft Registration No.', "bottom-right");
        }
        */
        SaveProcessStatus = "MAN";
        //}
    });
}
function SearchLIOSCLyingLst() {
    var AWBNo = $("#divOSCSearch #txtAWBNo").val() == "" ? "0" : $("#divOSCSearch #txtAWBNo").val();
    var AWBPrefix = '"A~A';
    var OriginCity = $("#divOSCSearch #searchOSCLIOriginCity").val() == "" ? "A~A" : $("#divOSCSearch #searchOSCLIOriginCity").val();
    var DestinationCity = $("#divOSCSearch #txtDestinationCity").val() == "" ? "A~A" : $("#divOSCSearch #txtDestinationCity").val();
    var FlightNo = "A~A"; //$("#divOSCSearch #txtFlightNo").val().trim() == "" ? "A~A" : $("#divOSCSearch #txtFlightNo").val().trim();
    var OffloadType = $("#Text_txtOSCOffloadType").data("kendoAutoComplete").key() == "" ? "A~A" : $("#Text_txtOSCOffloadType").data("kendoAutoComplete").key();
    var FlightDate = "0";
    //var LoggedInCity = 'DEL';
    SearchLIOSClyingList(OriginCity, DestinationCity, FlightNo, FlightDate, AWBPrefix, AWBNo, userContext.AirportCode, PartnerCarrierCode, FlightRoute, OffloadType);
    // $("#btnLyingListSearch").unbind("click");
}
function SearchLyingLst() {
    var AWBNo = $("#divLyingSearch #txtAWBNo").val() == "" ? "0" : $("#divLyingSearch #txtAWBNo").val();
    var AWBPrefix = '"A~A';
    var OriginCity = $("#divLyingSearch #searchLIOriginCity").val() == "" ? "A~A" : $("#divLyingSearch #searchLIOriginCity").val();
    var DestinationCity = $("#divLyingSearch #txtDestinationCity").val() == "" ? "A~A" : $("#divLyingSearch #txtDestinationCity").val();
    var FlightNo = "A~A"; //$("#divLyingSearch #txtFlightNo").val().trim() == "" ? "A~A" : $("#divLyingSearch #txtFlightNo").val().trim();
    var OffloadType = $("#Text_txtOffloadType").data("kendoAutoComplete").key() == "" ? "A~A" : $("#Text_txtOffloadType").data("kendoAutoComplete").key();
    var FlightDate = "0";
    //var LoggedInCity = 'DEL';
    SearchlyingList(OriginCity, DestinationCity, FlightNo, FlightDate, AWBPrefix, AWBNo, userContext.AirportCode, PartnerCarrierCode, GetFlightSortRoute(FlightDestination), OffloadType);
    // $("#btnLyingListSearch").unbind("click");
}

function SearchOSCLyingLst() {
    $('#hdnSubProcessType').val("2");
    var ULDSNO = $("#Text_txtOSCULDNo").data("kendoAutoComplete").key() == "" ? "-1" : $("#Text_txtOSCULDNo").data("kendoAutoComplete").key();
    var DestinationCity = $("#Text_txtOSCDestinationCity").val() == "" ? "A~A" : $("#Text_txtOSCDestinationCity").val();
    var OriginCity = userContext.AirportCode;
    var OffloadType = $("#Text_txtOSCOffloadType").data("kendoAutoComplete").key() == "" ? "A~A" : $("#Text_txtOSCOffloadType").data("kendoAutoComplete").key();
    var AWBNo = $("#txtOSCAWBNo").val() == "" ? "A~A" : $("#txtOSCAWBNo").val();
    //var FlightSNo = $("#txtFlightNo").val() == "" ? "A~A" : $("#txtFlightNo").val();
    cfi.ShowIndexView("divOSCDetail", "Services/FlightControl/FlightControlService.svc/GetFlightManifestTransGridData/FLIGHTCONTROL/FlightControl/OSCFLIGHTLYING/" + OriginCity + "/" + DestinationCity + "/" + ULDSNO + "/" + PartnerCarrierCode + "/" + FlightRoute + "/" + OffloadType + "/" + AWBNo);
}
function SearchManifestLyingLst() {
    $('#hdnSubProcessType').val("2");
    var ULDSNO = $("#Text_txtULDNo").data("kendoAutoComplete").key() == "" ? "-1" : $("#Text_txtULDNo").data("kendoAutoComplete").key();
    var DestinationCity = $("#Text_txtDestinationCity").val() == "" ? $("#tdEndPoint").text().trim() : $("#Text_txtDestinationCity").val();
    var OriginCity = userContext.AirportCode;
    var OffloadType = $("#Text_txtOffloadType").data("kendoAutoComplete").key() == "" ? "A~A" : $("#Text_txtOffloadType").data("kendoAutoComplete").key();
    var AWBNo = $("#txtMLAWBNo").val() == "" ? "A~A" : $("#txtMLAWBNo").val();
    //var FlightSNo = $("#txtFlightNo").val() == "" ? "A~A" : $("#txtFlightNo").val();
    cfi.ShowIndexView("divLyingDetail", "Services/FlightControl/FlightControlService.svc/GetFlightManifestTransGridData/FLIGHTCONTROL/FlightControl/MANIFESTFLIGHTLYING/" + OriginCity + "/" + DestinationCity + "/" + ULDSNO + "/" + PartnerCarrierCode + "/" + GetFlightSortRoute(FlightDestination) + "/" + OffloadType + "/" + AWBNo);
}
function SearchLIOSClyingList(OriginCity, DestinationCity, FlightNo, FlightDate, AWBPrefix, AWBNo, LoggedInCity, CarrierCode, FlightRoute, OffloadType) {
    $('#hdnSubProcessType').val("2");
    // $("#imgprocessing1").show();
    // cfi.ShowIndexView("divDetail", "Services/FlightControl/FlightControlService.svc/CreateFlightLyingGrid/Shipment/FLIGHTLYING/" + OriginCity + "/" + DestinationCity + "/" + FlightNo + "/" + AWBNo + "/" + OffLoadStatus, "Scripts/maketrans.js?" + Math.random());
    cfi.ShowIndexView("divOSCDetail", "Services/FlightControl/FlightControlService.svc/GetGridData/FLIGHTCONTROL/FlightControl/OSCLYING/" + OriginCity + "/" + DestinationCity + "/" + FlightNo + "/" + FlightDate + "/" + AWBPrefix + "/" + AWBNo + "/" + CarrierCode + "/" + FlightRoute + "/" + OffloadType + "/" + LoggedInCity, "Scripts/maketrans.js?" + Math.random());
    //$("#imgprocessing1").hide();
}
function SearchlyingList(OriginCity, DestinationCity, FlightNo, FlightDate, AWBPrefix, AWBNo, LoggedInCity, CarrierCode, FlightRoute, OffloadType) {
    $('#hdnSubProcessType').val("2");
    // $("#imgprocessing1").show();
    // cfi.ShowIndexView("divDetail", "Services/FlightControl/FlightControlService.svc/CreateFlightLyingGrid/Shipment/FLIGHTLYING/" + OriginCity + "/" + DestinationCity + "/" + FlightNo + "/" + AWBNo + "/" + OffLoadStatus, "Scripts/maketrans.js?" + Math.random());
    cfi.ShowIndexView("divLyingDetail", "Services/FlightControl/FlightControlService.svc/GetGridData/FLIGHTCONTROL/FlightControl/FLIGHTLYING/" + OriginCity + "/" + DestinationCity + "/" + FlightNo + "/" + FlightDate + "/" + AWBPrefix + "/" + AWBNo + "/" + CarrierCode + "/" + FlightRoute + "/" + OffloadType + "/" + LoggedInCity + "/" + CurrentFlightSno, "Scripts/maketrans.js?" + Math.random());
    //$("#imgprocessing1").hide();
}
function SearchOSCList(OriginCity, DestinationCity, FlightNo, FlightDate, AWBPrefix, AWBNo, LoggedInCity, CarrierCode, FlightRoute, OffloadType) {
    $('#hdnSubProcessType').val("2");
    // $("#imgprocessing1").show();
    // cfi.ShowIndexView("divDetail", "Services/FlightControl/FlightControlService.svc/CreateFlightLyingGrid/Shipment/FLIGHTLYING/" + OriginCity + "/" + DestinationCity + "/" + FlightNo + "/" + AWBNo + "/" + OffLoadStatus, "Scripts/maketrans.js?" + Math.random());
    cfi.ShowIndexView("divOSCDetail", "Services/FlightControl/FlightControlService.svc/GetGridData/FLIGHTCONTROL/FlightControl/OSCLYING/" + OriginCity + "/" + DestinationCity + "/" + FlightNo + "/" + FlightDate + "/" + AWBPrefix + "/" + AWBNo + "/" + CarrierCode + "/" + FlightRoute + "/" + OffloadType + "/" + LoggedInCity + "/" + CurrentFlightSno, "Scripts/maketrans.js?" + Math.random());
    //$("#imgprocessing1").hide();
}
//Bind ULD Type
function BindULDType() {
    // $("#divDetail .WebFormTable tbody:first tr:nth-child(2) td:first div.k-grid-content").css({ "max-height": "350px", "overflow": "auto" });
    // var chkFlag = 0, chkDisabled = 0;
    var strULDType = '';
    var trHeaderMainRow = $("#divDetail").find("div.k-grid-header");
    var IsManifestIndex = trHeaderMainRow.find("th[data-field='IsManifested']").index();
    var IsBUPIndex = trHeaderMainRow.find("th[data-field='IsBUP']").index();
    var PriorityIndex = trHeaderMainRow.find("th[data-field='Priority']").index();
    var ULDTypeIndex = trHeaderMainRow.find("th[data-field='ULDType']").index();
    var Rth = $("#divDetail  div.k-grid-header:first  div  table  thead  tr  th[data-field='isSelect']:nth-child(1)");
    Rth.html("<input type='checkbox' id='chkAllBox' onchange='return CheckAll(this);' >");
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetULDType?DailyFlightSNo=" + CurrentFlightSno, async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            //strULDType = '<option value="0" >BULK</option>';
            $(result.Data).each(function (row, tr) {
                strULDType += '<option value=' + tr.ULDName + ' >' + tr.ULDName + '</option>';
            });
        },
        error: function (jqXHR, textStatus) {
        }
    });
    $('#divDetail table tbody tr').each(function (row, tr) {
        $(tr).find(' td:eq(' + ULDTypeIndex + ') #SULDType').html(strULDType);
        var selectedText = $(tr).find('td:eq(' + ULDTypeIndex + ') input[type=hidden]').val();
        //  if (selectedText != "0")
        $(tr).find(' td:eq(' + ULDTypeIndex + ') #SULDType').val(selectedText);
        if (selectedText == "BULK")
            $(tr).find(' td:eq(' + ULDTypeIndex + ')').next().find('input[id="txt_ULDCount"]').val('').attr('disabled', 1);//.val(selectedText);
    });
    var strPriorityType = '';
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetPriorityType", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            strPriorityType = '<option value="-1" >Select</option>';
            $(result.Data).each(function (row, tr) {
                strPriorityType += '<option value=' + tr.SNo + ' >' + tr.PriorityCode + '</option>';
            });
        },
        error: function (jqXHR, textStatus) {
        }
    });

    $('#divDetail table tbody tr').each(function (row, tr) {
        $(tr).find('td:eq(' + PriorityIndex + ') #txtPriority').html(strPriorityType);
        var selectedVal = $(tr).find('td:eq(' + PriorityIndex + ') input[type=hidden]').val();
        if (selectedVal != "-1")
            $(tr).find(' td:eq(' + PriorityIndex + ') #txtPriority').val(selectedVal);
    });

    $("#divDetail").find(".k-grid-content").find('table tbody tr').each(function (row, tr) {
        //$('#divDetail table tbody tr').each(function (row, tr) {
        if (row > 0) {
            var trHeaderRow = $("#divDetail").find(".k-grid-content").find('table tbody').find('tr:eq(' + (row - 1) + ')').closest("div.k-grid").find("div.k-grid-header");
            var AWBNOIndex = trHeaderRow.find("th[data-field='AWBNo']").index();
            var PrevAWBNo = $("#divDetail").find(".k-grid-content").find('table tbody').find('tr:eq(' + (row - 1) + ')').find('td:eq(' + AWBNOIndex + ')').text();
            if ($(tr).find('td:eq(' + AWBNOIndex + ')').text() == PrevAWBNo) {
                $(tr).find('td:last').append('&nbsp;&nbsp;<a class="removed label label-danger" title="Remove" onclick="fn_RemoveRow(this);" ><i class="fa fa-trash-o"></i></a>');
            }
        }
    });


    $("#divDetail").find(".k-grid-content").find('table tbody tr').each(function (row, tr) {
        if ($(tr).find('td:eq(' + IsBUPIndex + ')').text() == "true") {
            $(tr).find('input[type=text],select').attr('disabled', 1);
            $(tr).find('a[class="removed label label-danger"').remove();
        }
        if ($(tr).find('td:eq(' + IsManifestIndex + ')').text() == 1 && $(tr).find('td:eq(' + IsBUPIndex + ')').text() == "false") {
            $(tr).find('input[type=text],input[type=checkbox],select').attr('disabled', 1);
            $(tr).find('a[class="removed label label-danger"').removeAttr('onclick');
        }
    });
    checkBoxSelected();
}
function BindLyingULDType() {
    // $("#divDetail .WebFormTable tbody:first tr:nth-child(2) td:first div.k-grid-content").css({ "max-height": "350px", "overflow": "auto" });

    var strULDType = '';
    var trHeaderMainRow = $("#divLyingDetail").find("div.k-grid-header");
    var IsManifestIndex = trHeaderMainRow.find("th[data-field='IsManifested']").index();
    var PriorityIndex = trHeaderMainRow.find("th[data-field='Priority']").index();
    var ULDTypeIndex = trHeaderMainRow.find("th[data-field='ULDType']").index();

    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetULDType?DailyFlightSNo=" + CurrentFlightSno, async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            //strULDType = '<option value="0" >BULK</option>';
            $(result.Data).each(function (row, tr) {
                strULDType += '<option value=' + tr.ULDName + ' >' + tr.ULDName + '</option>';
            });
        },
        error: function (jqXHR, textStatus) {
        }
    });
    $('#divLyingDetail table tbody tr').each(function (row, tr) {
        $(tr).find(' td:eq(' + ULDTypeIndex + ') #SULDType').html(strULDType);
        var selectedText = $(tr).find('td:eq(' + ULDTypeIndex + ') input[type=hidden]').val();
        //  if (selectedText != "0")
        $(tr).find(' td:eq(' + ULDTypeIndex + ') #SULDType').val(selectedText);
    });
    var strPriorityType = '';
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetPriorityType", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            strPriorityType = '<option value="-1" >Select</option>';
            $(result.Data).each(function (row, tr) {
                strPriorityType += '<option value=' + tr.SNo + ' >' + tr.PriorityCode + '</option>';
            });
        },
        error: function (jqXHR, textStatus) {
        }
    });

    $('#divLyingDetail table tbody tr').each(function (row, tr) {
        $(tr).find('td:eq(' + PriorityIndex + ') #txtPriority').html(strPriorityType);
        var selectedVal = $(tr).find('td:eq(' + PriorityIndex + ') input[type=hidden]').val();
        if (selectedVal != "-1")
            $(tr).find(' td:eq(' + PriorityIndex + ') #txtPriority').val(selectedVal);
    });

    //$("#divLyingDetail").find(".k-grid-content").find('table tbody tr').each(function (row, tr) {
    //    //$('#divDetail table tbody tr').each(function (row, tr) {
    //    if (row > 0) {
    //        var trHeaderRow = $("#divLyingDetail").find(".k-grid-content").find('table tbody').find('tr:eq(' + (row - 1) + ')').closest("div.k-grid").find("div.k-grid-header");
    //        var AWBNOIndex = trHeaderRow.find("th[data-field='AWBNo']").index();
    //        var PrevAWBNo = $("#divLyingDetail").find(".k-grid-content").find('table tbody').find('tr:eq(' + (row - 1) + ')').find('td:eq(' + AWBNOIndex + ')').text();
    //        if ($(tr).find('td:eq(' + AWBNOIndex + ')').text() == PrevAWBNo) {
    //            $(tr).find('td:last').append('&nbsp;&nbsp;<a class="removed label label-danger" title="Remove" onclick="fn_RemoveRow(this);" ><i class="fa fa-trash-o"></i></a>');
    //        }
    //    }
    //});

    $("#divLyingDetail").find(".k-grid-content").find('table tbody tr').each(function (row, tr) {
        if ($(tr).find('td:eq(' + IsManifestIndex + ')').text() == 1) {
            $(tr).find('input[type=text],input[type=checkbox],select').attr('disabled', 1);
            $(tr).find('a[class="removed label label-danger"').removeAttr('onclick');
        }
    });
}
function BindOSCLyingULDType() {
    var strULDType = '';
    var trHeaderMainRow = $("#divOSCDetail").find("div.k-grid-header");
    var IsManifestIndex = trHeaderMainRow.find("th[data-field='IsManifested']").index();
    var PriorityIndex = trHeaderMainRow.find("th[data-field='Priority']").index();
    var ULDTypeIndex = trHeaderMainRow.find("th[data-field='ULDType']").index();
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetULDType?DailyFlightSNo=" + CurrentFlightSno, async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            //strULDType = '<option value="0" >BULK</option>';
            $(result.Data).each(function (row, tr) {
                strULDType += '<option value=' + tr.ULDName + ' >' + tr.ULDName + '</option>';
            });
        },
        error: function (jqXHR, textStatus) {
        }
    });
    $('#divOSCDetail table tbody tr').each(function (row, tr) {
        $(tr).find(' td:eq(' + ULDTypeIndex + ') #SULDType').html(strULDType);
        var selectedText = $(tr).find('td:eq(' + ULDTypeIndex + ') input[type=hidden]').val();
        //  if (selectedText != "0")
        $(tr).find(' td:eq(' + ULDTypeIndex + ') #SULDType').val(selectedText);
    });
    var strPriorityType = '';
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetPriorityType", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            strPriorityType = '<option value="-1" >Select</option>';
            $(result.Data).each(function (row, tr) {
                strPriorityType += '<option value=' + tr.SNo + ' >' + tr.PriorityCode + '</option>';
            });
        },
        error: function (jqXHR, textStatus) {
        }
    });

    $('#divOSCDetail table tbody tr').each(function (row, tr) {
        $(tr).find('td:eq(' + PriorityIndex + ') #txtPriority').html(strPriorityType);
        var selectedVal = $(tr).find('td:eq(' + PriorityIndex + ') input[type=hidden]').val();
        if (selectedVal != "-1")
            $(tr).find(' td:eq(' + PriorityIndex + ') #txtPriority').val(selectedVal);
    });
    $("#divOSCDetail").find(".k-grid-content").find('table tbody tr').each(function (row, tr) {
        if ($(tr).find('td:eq(' + IsManifestIndex + ')').text() == 1) {
            $(tr).find('input[type=text],input[type=checkbox],select').attr('disabled', 1);
            $(tr).find('a[class="removed label label-danger"').removeAttr('onclick');
        }
    });

}
//For Save Loading Instruction
function SavePreManifestInfo() {
    var flag = false;
    // // alert(FlightCloseFlag)
    var chkSelect = false;
    var LIArray = new Array();
    // // fun_CheckGR_V_CBM();

    $('#divDetail .k-grid-content tbody tr').each(function (row, tr) {
        var Rowtr = $(tr).closest("div.k-grid").find("div.k-grid-header");
        var SelectIndex = Rowtr.find("th[data-field='isSelect']").index();
        var AWBSNoIndex = Rowtr.find("th[data-field='SNo']").index();
        var DailyFlightSNoIndex = Rowtr.find("th[data-field='DailyFlightSNo']").index();
        // var DailyFlightSNo = $('#hdnFlightSNo').val();
        var PiecesIndex = Rowtr.find("th[data-field='TotalPieces']").index();
        var PlannedPiecesIndex = Rowtr.find("th[data-field='PlannedPieces']").index();
        var ActG_V_CBMIndex = Rowtr.find("th[data-field='ActG_V_CBM']").index();
        var PlanG_V_CBMIndex = Rowtr.find("th[data-field='PlanG_V_CBM']").index();
        var ULDGroupNoIndex = Rowtr.find("th[data-field='ULDGroupNo']").index();
        var SHCIndex = Rowtr.find("th[data-field='SHC']").index();
        var AgentIndex = Rowtr.find("th[data-field='Agent']").index();
        var ULDTypeIndex = Rowtr.find("th[data-field='ULDType']").index();
        var PriorityIndex = Rowtr.find("th[data-field='Priority']").index();
        var RemarksIndex = Rowtr.find("th[data-field='Remarks']").index();
        var ULDCountIndex = Rowtr.find("th[data-field='ULDCount']").index();
        var ULDStockSNoIndex = Rowtr.find("th[data-field='ULDStockSNo']").index();
        var FBLAWBSNoIndex = Rowtr.find("th[data-field='FBLAWBSNo']").index();
        var IsManifestedIndex = Rowtr.find("th[data-field='IsManifested']").index();
        if ($(tr).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked')) {
            chkSelect = true;
        }
        var AG = $(tr).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[0];
        var AV = $(tr).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[1];
        var ACBM = $(tr).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[2];
        var PG = $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val();
        var PV = $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val();
        var PCBM = $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val();
        // if ($(tr).find('td:eq(' + IsManifestedIndex + ')').text() == 0) {
        LIArray.push({
            isSelect: $(tr).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked'),
            AWBSNo: $(tr).find('td:eq(' + AWBSNoIndex + ')').text(),
            DailyFlightSNo: $(tr).find('td:eq(' + DailyFlightSNoIndex + ')').text(),
            TotalPieces: $(tr).find('td:eq(' + PiecesIndex + ')').text(),
            PlannedPieces: $(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val(),
            ActualVolumeWt: AV,
            ActualGrossWt: AG,
            ActualCBM: ACBM,
            PlannedGrossWt: PG,
            PlannedVolumeWt: PV,
            PlannedCBM: PCBM,
            MovementType: 2,
            ULDGroupNo: $(tr).find('td:eq(' + ULDGroupNoIndex + ') input[type=text]').val(),
            SHC: $(tr).find('td:eq(' + SHCIndex + ')').text(),
            Agent: $(tr).find('td:eq(' + AgentIndex + ')').text(),
            ULDType: $(tr).find('td:eq(' + ULDTypeIndex + ') select option:selected').text(),
            Priority: $(tr).find('td:eq(' + PriorityIndex + ') select').val(),
            UpdatedBy: 2,
            Remarks: $(tr).find('td:eq(' + (RemarksIndex - 1) + ') input[type=hidden]').val() == "" ? null : $(tr).find('td:eq(' + (RemarksIndex - 1) + ') input[type=hidden]').val(),
            ULDStockSNo: $(tr).find('td:eq(' + ULDStockSNoIndex + ')').text(),
            ULDCount: $(tr).find('td:eq(' + ULDCountIndex + ') input[type="text"]').val(),
            FBLAWBSNo: $(tr).find('td:eq(' + FBLAWBSNoIndex + ')').text()
        });
        // }
    });
    var LyingArray = new Array();
    var OSCLyingArray = new Array();
    $('#divLyingDetail .k-grid-content table tbody tr').each(function (row, tr) {
        var Rowtr = $(tr).closest("div.k-grid").find("div.k-grid-header");
        var SelectIndex = Rowtr.find("th[data-field='isSelect']").index();
        var AWBSNoIndex = Rowtr.find("th[data-field='SNo']").index();
        var DailyFlightSNo = $('#hdnFlightSNo').val();
        // var PiecesIndex = Rowtr.find("th[data-field='TotalPieces']").index();
        var PiecesIndex = Rowtr.find("th[data-field='OLCPieces']").index();
        var PlannedPiecesIndex = Rowtr.find("th[data-field='PlannedPieces']").index();
        var ActG_V_CBMIndex = Rowtr.find("th[data-field='ActG_V_CBM']").index();
        var PlanG_V_CBMIndex = Rowtr.find("th[data-field='PlanG_V_CBM']").index();
        var ULDGroupNoIndex = Rowtr.find("th[data-field='ULDGroupNo']").index();
        if ($(tr).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked')) {
            chkSelect = true;
        }
        var SHCIndex = Rowtr.find("th[data-field='SHC']").index();
        var AgentIndex = Rowtr.find("th[data-field='Agent']").index();
        var ULDTypeIndex = Rowtr.find("th[data-field='ULDType']").index();
        var PriorityIndex = Rowtr.find("th[data-field='Priority']").index();
        var AG = $(tr).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[0];
        var AV = $(tr).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[1];
        var ACBM = $(tr).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[2];
        var PG = $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val();
        var PV = $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val();
        var PCBM = $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val();
        if ($(tr).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked')) {
            LyingArray.push({
                isSelect: $(tr).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked'),
                AWBSNo: $(tr).find('td:eq(' + AWBSNoIndex + ')').text(),
                DailyFlightSNo: DailyFlightSNo,
                TotalPieces: $(tr).find('td:eq(' + PiecesIndex + ')').text(),
                PlannedPieces: $(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val(),
                ActualVolumeWt: AV,
                ActualGrossWt: AG,
                ActualCBM: ACBM,
                PlannedGrossWt: PG,
                PlannedVolumeWt: PV,
                PlannedCBM: PCBM,
                MovementType: 2,
                ULDGroupNo: $(tr).find('td:eq(' + ULDGroupNoIndex + ') input[type=text]').val(),
                SHC: $(tr).find('td:eq(' + SHCIndex + ')').text(),
                Agent: $(tr).find('td:eq(' + AgentIndex + ')').text(),
                ULDType: $(tr).find('td:eq(' + ULDTypeIndex + ') select option:selected').text(),
                Priority: $(tr).find('td:eq(' + PriorityIndex + ') select').val(),
                UpdatedBy: 2

            });
        }
        // }
        //if($($(tr).).prop('checked'))
        //  alert(tr);

    });
    $('#divOSCDetail .k-grid-content table tbody tr').each(function (row, tr) {
        var Rowtr = $(tr).closest("div.k-grid").find("div.k-grid-header");
        var SelectIndex = Rowtr.find("th[data-field='isSelect']").index();
        var AWBSNoIndex = Rowtr.find("th[data-field='SNo']").index();
        var DailyFlightSNo = $('#hdnFlightSNo').val();
        // var PiecesIndex = Rowtr.find("th[data-field='TotalPieces']").index();
        var PiecesIndex = Rowtr.find("th[data-field='OLCPieces']").index();
        var PlannedPiecesIndex = Rowtr.find("th[data-field='PlannedPieces']").index();
        var ActG_V_CBMIndex = Rowtr.find("th[data-field='ActG_V_CBM']").index();
        var PlanG_V_CBMIndex = Rowtr.find("th[data-field='PlanG_V_CBM']").index();
        var ULDGroupNoIndex = Rowtr.find("th[data-field='ULDGroupNo']").index();
        if ($(tr).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked')) {
            chkSelect = true;
        }
        var SHCIndex = Rowtr.find("th[data-field='SHC']").index();
        var AgentIndex = Rowtr.find("th[data-field='Agent']").index();
        var ULDTypeIndex = Rowtr.find("th[data-field='ULDType']").index();
        var PriorityIndex = Rowtr.find("th[data-field='Priority']").index();
        var AG = $(tr).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[0];
        var AV = $(tr).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[1];
        var ACBM = $(tr).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[2];
        var PG = $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val();
        var PV = $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val();
        var PCBM = $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val();
        if ($(tr).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked')) {
            OSCLyingArray.push({
                isSelect: $(tr).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked'),
                AWBSNo: $(tr).find('td:eq(' + AWBSNoIndex + ')').text(),
                DailyFlightSNo: DailyFlightSNo,
                TotalPieces: $(tr).find('td:eq(' + PiecesIndex + ')').text(),
                PlannedPieces: $(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val(),
                ActualVolumeWt: AV,
                ActualGrossWt: AG,
                ActualCBM: ACBM,
                PlannedGrossWt: PG,
                PlannedVolumeWt: PV,
                PlannedCBM: PCBM,
                MovementType: 2,
                ULDGroupNo: $(tr).find('td:eq(' + ULDGroupNoIndex + ') input[type=text]').val(),
                SHC: $(tr).find('td:eq(' + SHCIndex + ')').text(),
                Agent: $(tr).find('td:eq(' + AgentIndex + ')').text(),
                ULDType: $(tr).find('td:eq(' + ULDTypeIndex + ') select option:selected').text(),
                Priority: $(tr).find('td:eq(' + PriorityIndex + ') select').val(),
                UpdatedBy: 2

            });
        }
        // }
        //if($($(tr).).prop('checked'))
        //  alert(tr);

    });
    if (chkSelect) {
        if (FlightCloseFlag == "PRE") {
            ShowMessage('warning', 'Warning -Pre-Manifest already created for flight.', " No more changes allowed ", "bottom-right");
            flag = false;
        }
        else
            if (FlightCloseFlag == "MAN") {
                ShowMessage('warning', 'Warning -Manifest already created for flight.', " No more changes allowed ", "bottom-right");
                flag = false;
            }
                //else if (FlightCloseFlag == "DEP")
                //{
                //    ShowMessage('warning', 'Warning -Pre-Manifest already created for flight.', " No more changes allowed ", "bottom-right");
                //    flag = false;
                //}
            else {
                if (fn_CheckWeightValidation()) {
                    $.ajax({
                        url: "Services/FlightControl/FlightControlService.svc/SavePreMenifestInformation", async: false, type: "POST", dataType: "json", cache: false,
                        data: JSON.stringify({ LIInfo: LIArray, LyingInfo: LyingArray, OSCLyingInfo: OSCLyingArray, FlightSNo: $('#hdnFlightSNo').val(), RegistrationNo: $("#RegistrationNo").val() }),
                        contentType: "application/json; charset=utf-8",
                        success: function (result) {
                            var ResultStatus = result.split('?')[0];
                            var ResultValue = result.split('?')[1];
                            if (ResultStatus == "0") {
                                ShowMessage('success', 'Success -Loading Instruction created successfully', "Processed Successfully", "bottom-right");
                                flag = true;
                            }
                            else if (ResultStatus == "1")//for Capacity Check
                            {
                                var msgString = '';
                                var AWBArray = ResultValue.split('@')[0];
                                var AircraftType = ResultValue.split('@')[1].split('^')[0];
                                var SHC = ResultValue.split('@')[1].split('^')[1];
                                ShowMessage('warning', 'Warning', "SHC '" + SHC + "' can not be loaded in this Aircraft", "bottom-right");
                                flag = false;
                            }
                            else if (ResultStatus == "2")//for Capacity Check
                            {
                                var AWBArray = ResultValue.split('@')[0];
                                var AircraftType = ResultValue.split('@')[1].split('^')[0];
                                var SHC = ResultValue.split('@')[1].split('^')[1];

                                ShowMessage('warning', 'Warning', "AWB '" + AWBArray + "' with SHC '" + SHC + "' exceeds the permissible weight in the Aircraft '" + AircraftType + "'", "bottom-right");

                            }
                            else if (ResultStatus == "3")//for CargoClassification 'PAX' Check with 'CAO'
                            {
                                ShowMessage('warning', "Warning ", "AWB '" + ResultValue + "' with SHC-CAO ( Cargo Aircraft only ) not allowed on Passenger Flight '" + $("#tdFlightNo").text() + "'/" + $("#tdFlightDate").text() + "", "bottom-right");

                            }
                            else if (ResultStatus == "4")//for comman Message
                            {
                                ShowMessage('warning', "Warning ", ResultValue, "bottom-right");

                            }
                            else {
                                ShowMessage('warning', 'Warning - Loading Instruction could not be created', " ", "bottom-right");
                                flag = false;
                            }
                        },
                        error: function (xhr) {
                            ShowMessage('warning', 'Warning -Loading Instruction could not be created', " ", "bottom-right");
                            flag = false;
                        }
                    });
                }
            }
    }
    else {
        ShowMessage('warning', 'Warning -Select a shipment to prepare Loading Instruction', " ", "bottom-right");
        flag = false;
    }
    return flag;
}

function fn_DisableCount(input) {
    var trHeader = $(input).closest("div.k-grid").find("div.k-grid-header");
    var ULDCountIndex = trHeader.find("th[data-field='ULDCount']").index();
    var Rowtr = $(input).closest('tr');
    if ($(input).val() == "BULK")
        $(Rowtr).find('td:eq(' + ULDCountIndex + ') input[id="txt_ULDCount"]').val('').attr('disabled', 1);
    else
        $(Rowtr).find('td:eq(' + ULDCountIndex + ') input[id="txt_ULDCount"]').removeAttr('disabled');
}

function UploadLyingInfo() {
    var flag = false;
    var LyingArray = new Array();
    $('#divDetail .k-grid-content table tbody tr').each(function (row, tr) {
        var Rowtr = $(tr).closest("div.k-grid").find("div.k-grid-header");
        var SelectIndex = Rowtr.find("th[data-field='isSelect']").index();
        var AWBSNoIndex = Rowtr.find("th[data-field='SNo']").index();
        var DailyFlightSNo = $('#hdnFlightSNo').val();
        var PiecesIndex = Rowtr.find("th[data-field='TotalPieces']").index();
        var PlannedPiecesIndex = Rowtr.find("th[data-field='PlannedPieces']").index();
        var ActG_V_CBMIndex = Rowtr.find("th[data-field='ActG_V_CBM']").index();
        var PlanG_V_CBMIndex = Rowtr.find("th[data-field='PlanG_V_CBM']").index();
        var ULDGroupNoIndex = Rowtr.find("th[data-field='ULDGroupNo']").index();
        var SHCIndex = Rowtr.find("th[data-field='SHC']").index();
        var AgentIndex = Rowtr.find("th[data-field='Agent']").index();
        var ULDTypeIndex = Rowtr.find("th[data-field='ULDType']").index();
        var PriorityIndex = Rowtr.find("th[data-field='Priority']").index();
        var AG = $(tr).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[0];
        var AV = $(tr).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[1];
        var ACBM = $(tr).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[2];
        var PG = $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val();
        var PV = $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val();
        var PCBM = $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val();
        if ($(tr).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked')) {
            LyingArray.push({
                isSelect: $(tr).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked'),
                AWBSNo: $(tr).find('td:eq(' + AWBSNoIndex + ')').text(),
                DailyFlightSNo: DailyFlightSNo,
                TotalPieces: $(tr).find('td:eq(' + PiecesIndex + ')').text(),
                PlannedPieces: $(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val(),
                ActualVolumeWt: AV,
                ActualGrossWt: AG,
                ActualCBM: ACBM,
                PlannedGrossWt: PG,
                PlannedVolumeWt: PV,
                PlannedCBM: PCBM,
                MovementType: 2,
                ULDGroupNo: $(tr).find('td:eq(' + ULDGroupNoIndex + ') input[type=text]').val(),
                SHC: $(tr).find('td:eq(' + SHCIndex + ')').text(),
                Agent: $(tr).find('td:eq(' + AgentIndex + ')').text(),
                ULDType: $(tr).find('td:eq(' + ULDTypeIndex + ') select option:selected').text(),
                Priority: $(tr).find('td:eq(' + PriorityIndex + ') select').val(),
                UpdatedBy: 2
            });
        }
        // }
        //if($($(tr).).prop('checked'))
        //  alert(tr);

    });

    //  console.log(JSON.stringify(ManifestArray));
    //alert(JSON.stringify(LyingArray));

    if (LyingArray.length > 0) {
        $.ajax({
            url: "Services/FlightControl/FlightControlService.svc/SaveLyingInformation", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ LyingListInfo: LyingArray }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "0") {
                    ShowMessage('success', 'Success -Lying list created successfully', "Processed Successfully", "bottom-right");
                    flag = true;
                }
                else {
                    ShowMessage('warning', 'Warning - Lying list could not be created ', " ", "bottom-right");
                    flag = false;
                }
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - Lying list could not be created ', " ", "bottom-right");
                flag = false;
            }
        });
    }
    else {
        ShowMessage('warning', 'Warning -Select a shipment to prepare Lying List ', " ", "bottom-right");
        flag = false;
    }
    return flag;
}

function fn_CheckNum(input) {
    var flag = true;
    if ($(input).val() != "") {
        if (!$.isNumeric($(input).val())) {
            $(input).val(0);
            //alert("Enter Valid Number");
            ShowMessage('warning', 'Warning - Enter Valid Number ', " ", "bottom-right");
            flag = false;
        }
    }
    return flag;
}

function fn_CalGVCBMForLI(input) {
    var flag = false;
    var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var TotalPcsIndex = trRow.find("th[data-field='TotalPieces']").index();
    var hdnTotalPiecesIndex = trRow.find("th[data-field='hdnTotalPieces']").index();
    var AWBNOIndex = trRow.find("th[data-field='AWBNo']").index();
    var PlannedPiecesIndex = trRow.find("th[data-field='PlannedPieces']").index();
    var ULDStockIndex = trRow.find("th[data-field='ULDStockSNo']").index();
    var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trRow.find("th[data-field='PlanG_V_CBM']").index();
    ///////change on 13-07-2016 for manage RCS Without Calculation/////////

    var PGWIndex = trRow.find("th[data-field='PGW']").index();
    var PVWIndex = trRow.find("th[data-field='PVW']").index();
    var PCBMWIndex = trRow.find("th[data-field='PCBMW']").index();
    var PGW = parseFloat($(input).closest('tr').find('td:eq(' + PGWIndex + ')').text());
    var PVW = parseFloat($(input).closest('tr').find('td:eq(' + PVWIndex + ')').text());
    var PCBMW = parseFloat($(input).closest('tr').find('td:eq(' + PCBMWIndex + ')').text());

    //////////////////////////////
    var ActualG_V_CBM = $(input).closest('tr').find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
    var PG = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    var PV = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    var PCBM = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');
    var CurrentAWBNo = $(input).closest('tr').find('td:eq(' + AWBNOIndex + ')').text();
    var row_index = $(input).closest('tr').index();
    // alert(row_index);
    var PlannedActualPcs = 0, TotalPG = 0, TotalPV = 0, TotalPCBM = 0;
    $(input).closest('tbody').find("tr").each(function (row, tr) {

        if ($(tr).find('td:eq(' + AWBNOIndex + ')').text() == CurrentAWBNo) {
            if (row != row_index) {
                if ($(tr).find('td:eq(' + ULDStockIndex + ')').text() == 0) {
                    PlannedActualPcs = PlannedActualPcs + parseInt($(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val());
                    TotalPG = TotalPG + parseFloat($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val());
                    TotalPV = TotalPV + parseFloat($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val());
                    TotalPCBM = TotalPCBM + parseFloat($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val());
                }
            }

            // PlannedPcs = PlannedPcs + parseInt($(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val());
        }
    });
    if ($(input).val() != "") {
        var totalPcs = $(input).closest('tr').find('td:eq(' + hdnTotalPiecesIndex + ')').text();
        var PlannedPcs = $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val();
        if ($.isNumeric($(input).val())) {
            // if ($(input).val() > parseInt($(input).closest('tr').find('td:eq(' + hdnTotalPiecesIndex + ')').text())  ) {
            if ($(input).val() > (totalPcs - PlannedActualPcs)) {
                ShowMessage('warning', 'Warning -Planned pieces should be less than Total Pieces', " ", "bottom-right");
                $(input).val(totalPcs - PlannedActualPcs);
                fn_CalGVCBMForLI(input);
                // fn_ResetPiece(input);
                flag = false;
            }

            else {
                if ($(input).val() <= 0) {
                    ShowMessage('warning', 'Warning -Planned pieces should be greater than 0 ', " ", "bottom-right");
                    $(input).val(totalPcs - PlannedActualPcs);
                    fn_ResetPiece(input);
                    flag = false;
                }
                else if (PG.val() <= 0) {
                    ShowMessage('warning', 'Warning -Planned Gross Weight should be greater than 0 ', " ", "bottom-right");
                    $(input).val(totalPcs - PlannedActualPcs);
                    fn_ResetPiece(input);
                    flag = false;
                }
                else if (PV.val() <= 0) {
                    ShowMessage('warning', 'Warning -Planned Volume Weight should be greater than 0 ', " ", "bottom-right");
                    $(input).val(totalPcs - PlannedActualPcs);
                    fn_ResetPiece(input);
                    flag = false;
                }
                else if (PCBM.val() <= 0) {
                    ShowMessage('warning', 'Warning -Planned CBM should be greater than 0 ', " ", "bottom-right");
                    $(input).val(totalPcs - PlannedActualPcs);
                    fn_ResetPiece(input);
                    flag = false;
                }
                else {

                    //PG.val(parseFloat(((parseFloat(ActualG_V_CBM[0])-parseFloat(TotalPG)) / (totalPcs-PlannedActualPcs)) * PlannedPcs).toFixed(3));
                    //PV.val(parseFloat(((parseFloat(ActualG_V_CBM[1]) -parseFloat(TotalPV)) / (totalPcs - PlannedActualPcs)) * PlannedPcs).toFixed(3));
                    //PCBM.val(parseFloat(((parseFloat(ActualG_V_CBM[2]) - parseFloat(TotalPCBM)) / (totalPcs - PlannedActualPcs)) * PlannedPcs).toFixed(3));

                    ////// change on 13-7-2016 for RCS without Flight///////
                    PG.val(parseFloat(((PGW - parseFloat(TotalPG)) / (totalPcs - PlannedActualPcs)) * PlannedPcs).toFixed(3));
                    PV.val(parseFloat(((PVW - parseFloat(TotalPV)) / (totalPcs - PlannedActualPcs)) * PlannedPcs).toFixed(3));
                    PCBM.val(parseFloat(((PCBMW - parseFloat(TotalPCBM)) / (totalPcs - PlannedActualPcs)) * PlannedPcs).toFixed(3));
                    //////////////
                    flag = true;
                }
            }
        }
        else {
            ShowMessage('warning', 'Warning - Enter Valid Number ', " ", "bottom-right");
            $(input).val(totalPcs);
            fn_CalGVCBMForLI(input);
            flag = false;
        }
    }
    // fn_CalculateSplitTotalPcs(input);
    // fn_Cal_GVCBM1($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]'));
    return flag;
}

function fn_ResetPiece_Backup(input) {
    var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var TotalPcsIndex = trRow.find("th[data-field='TotalPieces']").index();
    var AWBNOIndex = trRow.find("th[data-field='AWBNo']").index();
    var PlannedPiecesIndex = trRow.find("th[data-field='PlannedPieces']").index();
    var ULDStockIndex = trRow.find("th[data-field='ULDStockSNo']").index();
    var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trRow.find("th[data-field='PlanG_V_CBM']").index();
    var ActualG_V_CBM = $(input).closest('tr').find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
    var PG = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    var PV = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    var PCBM = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');
    var CurrentAWBNo = $(input).closest('tr').find('td:eq(' + AWBNOIndex + ')').text();
    var TotalPcs = $(input).closest('tr').find('td:eq(' + TotalPcsIndex + ')').text();
    var row_index = $(input).closest('tr').index();
    // alert(row_index);
    var PlannedActualPcs = 0, TotalPG = 0, TotalPV = 0, TotalPCBM = 0;
    $(input).closest('tbody').find("tr").each(function (row, tr) {
        if ($(tr).find('td:eq(' + AWBNOIndex + ')').text() == CurrentAWBNo) {
            if (row != row_index) {
                if ($(tr).find('td:eq(' + ULDStockIndex + ')').text() == 0) {
                    PlannedActualPcs = PlannedActualPcs + parseInt($(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val());
                    TotalPG = TotalPG + parseInt($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val());
                    TotalPV = TotalPV + parseInt($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val());
                    TotalPCBM = TotalPCBM + parseInt($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val());
                }
            }

            // PlannedPcs = PlannedPcs + parseInt($(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val());
        }
    });

    if ($(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val() == "") {
        $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val(TotalPcs - PlannedActualPcs).focus();
        chkFlag = false;
    }
    else if ($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val() == "") {
        $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val(parseFloat(parseFloat(ActualG_V_CBM[0]) - parseFloat(TotalPG)).toFixed(3)).focus();
        chkFlag = false;
    }
    else if ($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val() == "") {
        $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val(parseFloat(parseFloat(ActualG_V_CBM[1]) - parseFloat(TotalPV)).toFixed(3)).focus();
        chkFlag = false;
    }
    else if ($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val() == "") {
        $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val(parseFloat(parseFloat(ActualG_V_CBM[2]) - parseFloat(TotalPCBM)).toFixed(3)).focus();
        chkFlag = false;
    }

}

function fn_ResetPiece(input) {
    var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var TotalPcsIndex = trRow.find("th[data-field='hdnTotalPieces']").index();
    var AWBNOIndex = trRow.find("th[data-field='AWBNo']").index();
    var PlannedPiecesIndex = trRow.find("th[data-field='PlannedPieces']").index();
    var ULDStockIndex = trRow.find("th[data-field='ULDStockSNo']").index();
    var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trRow.find("th[data-field='PlanG_V_CBM']").index();
    var ActualG_V_CBM = $(input).closest('tr').find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
    var PG = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    var PV = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    var PCBM = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');
    ///////change on 13-07-2016 for manage RCS Without Calculation/////////

    var PGWIndex = trRow.find("th[data-field='PGW']").index();
    var PVWIndex = trRow.find("th[data-field='PVW']").index();
    var PCBMWIndex = trRow.find("th[data-field='PCBMW']").index();
    var PGW = parseFloat($(input).closest('tr').find('td:eq(' + PGWIndex + ')').text());
    var PVW = parseFloat($(input).closest('tr').find('td:eq(' + PVWIndex + ')').text());
    var PCBMW = parseFloat($(input).closest('tr').find('td:eq(' + PCBMWIndex + ')').text());

    //////////////////////////////
    var CurrentAWBNo = $(input).closest('tr').find('td:eq(' + AWBNOIndex + ')').text();
    var TotalPcs = $(input).closest('tr').find('td:eq(' + TotalPcsIndex + ')').text();
    var row_index = $(input).closest('tr').index();
    // alert(row_index);
    var PlannedActualPcs = 0, TotalPG = 0, TotalPV = 0, TotalPCBM = 0;
    $(input).closest('tbody').find("tr").each(function (row, tr) {
        if ($(tr).find('td:eq(' + AWBNOIndex + ')').text() == CurrentAWBNo) {
            if (row != row_index) {
                if ($(tr).find('td:eq(' + ULDStockIndex + ')').text() == 0) {
                    PlannedActualPcs = PlannedActualPcs + parseInt($(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val());
                    TotalPG = TotalPG + parseInt($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val());
                    TotalPV = TotalPV + parseInt($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val());
                    TotalPCBM = TotalPCBM + parseInt($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val());
                }
            }

            // PlannedPcs = PlannedPcs + parseInt($(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val());
        }
    });

    if ($(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val() == "" && $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val() < 0) {
        $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val(TotalPcs - PlannedActualPcs).focus();
        chkFlag = false;
    }
    else if ($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val() == "") {
        $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val(parseFloat(PGW - parseFloat(TotalPG)).toFixed(3)).focus();
        chkFlag = false;
    }
    else if ($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val() == "") {
        $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val(parseFloat(PVW - parseFloat(TotalPV)).toFixed(3)).focus();
        chkFlag = false;
    }
    else if ($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val() == "") {
        $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val(parseFloat(PCBMW - parseFloat(TotalPCBM)).toFixed(3)).focus();
        chkFlag = false;
    }

}

function fn_ResetPre_Man(input) {
    var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var TotalPcsIndex = trRow.find("th[data-field='TotalPPcs']").index();
    var AWBNOIndex = trRow.find("th[data-field='AWBNo']").index();
    var PlannedPiecesIndex = trRow.find("th[data-field='PlannedPieces']").index();
    var ULDStockIndex = trRow.find("th[data-field='ULDStockSNo']").index();
    var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trRow.find("th[data-field='PlanG_V_CBM']").index();
    var PGWIndex = trRow.find("th[data-field='PGW']").index();
    var PVWIndex = trRow.find("th[data-field='PVW']").index();
    var PCCBMIndex = trRow.find("th[data-field='PCCBM']").index();
    var ActualG_V_CBM = $(input).closest('tr').find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
    var PG = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    var PV = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    var PCBM = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');
    var PGW = $(input).closest('tr').find('td:eq(' + PGWIndex + ')').text();
    var PVW = $(input).closest('tr').find('td:eq(' + PVWIndex + ')').text();
    var PCCBM = $(input).closest('tr').find('td:eq(' + PCCBMIndex + ')').text();
    var CurrentAWBNo = $(input).closest('tr').find('td:eq(' + AWBNOIndex + ')').text();
    var TotalPcs = $(input).closest('tr').find('td:eq(' + TotalPcsIndex + ')').text();
    if ($(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val() == "" && $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val() < 0) {
        $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val(TotalPcs);
        fn_Cal_GVCBMOnPRE_MAN(input);
        chkFlag = false;
    }
    else if ($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val() == "") {
        $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val(parseFloat(PGW).toFixed(2));
        fn_Cal_GVCBMOnPRE_MAN(input);
        chkFlag = false;
    }
    else if ($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val() == "") {
        $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val(parseFloat(PVW).toFixed(2));
        fn_Cal_GVCBMOnPRE_MAN(input);
        chkFlag = false;
    }
    else if ($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val() == "") {
        $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val(parseFloat(PCCBM).toFixed(2));
        fn_Cal_GVCBMOnPRE_MAN(input);
        chkFlag = false;
    }

}

//
function fn_CalculateOLCGVCBM(input) {
    var flag = false;

    var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var TotalPcsIndex = trRow.find("th[data-field='OLCPieces']").index();
    var PlannedPiecesIndex = trRow.find("th[data-field='PlannedPieces']").index();
    var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trRow.find("th[data-field='PlanG_V_CBM']").index();
    var ActualG_V_CBM = $(input).closest('tr').find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
    var PG = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    var PV = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    var PCBM = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');

    if ($(input).val() != "") {
        var totalPcs = $(input).closest('tr').find('td:eq(' + TotalPcsIndex + ')').text();
        var PlannedPcs = $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val();
        if ($(input).val() != 0 && $(input).val() > 0) {
            if ($.isNumeric($(input).val())) {
                //alert($(input).attr('id'))

                if ($(input).val() > parseInt($(input).closest('tr').find('td:eq(' + TotalPcsIndex + ')').text())) {
                    // alert("Planned pieces should be less than Total Pieces ");
                    ShowMessage('warning', 'Warning -Planned pieces should be less than Total Pieces', " ", "bottom-right");
                    $(input).val(totalPcs);
                    fn_CalculateOLCGVCBM(input);
                    //PG.val(0);
                    //PV.val(0);
                    //PCBM.val(0);
                    flag = false;
                }

                else {

                    PG.val(parseFloat((ActualG_V_CBM[0] / totalPcs) * PlannedPcs).toFixed(3));
                    PV.val(parseFloat((ActualG_V_CBM[1] / totalPcs) * PlannedPcs).toFixed(3));
                    PCBM.val(parseFloat((ActualG_V_CBM[2] / totalPcs) * PlannedPcs).toFixed(3));
                    flag = true;
                }
            }
            else {
                // alert("Enter Valid Number");
                ShowMessage('warning', 'Warning - Enter Valid Number ', " ", "bottom-right");
                $(input).val(totalPcs);
                fn_CalculateOLCGVCBM(input);
                //PG.val(0);
                //PV.val(0);
                //PCBM.val(0);
                flag = false;

            }
        }
        else {
            $(input).val(totalPcs);
            fn_CalculateOLCGVCBM(input);
        }
    }
    // fn_CalculateSplitTotalPcs(input);
    return flag;

}

//Calculation for OLC

function fn_Cal_GVCBMOnOLC(input) {
    var flag = false;
    var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trRow.find("th[data-field='PlanG_V_CBM']").index();
    var ULDStockSNoIndex = trRow.find("th[data-field='ULDStockSNo']").index();
    var TotalPPcsIndex = trRow.find("th[data-field='OLCPieces']").index();
    var PlannedPiecesIndex = trRow.find("th[data-field='PlannedPieces']").index();
    var AWBNOIndex = trRow.find("th[data-field='AWBNo']").index();
    var ActualG_V_CBM = $(input).closest('tr').find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
    var PGW = ActualG_V_CBM[0];
    var PVW = ActualG_V_CBM[1];
    var PCCBM = ActualG_V_CBM[2];
    var PG = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    var PV = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    var PCBM = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');

    if ($(input).val() != "") {
        if ($.isNumeric($(input).val())) {
            if ($(input).val() != 0 && $(input).val() > 0) {
                if (($(input).attr('id') == "txtPG") && (parseInt($(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val()) < parseInt($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text()))) {
                    if ($(input).val() > parseFloat(PGW)) {
                        ShowMessage('warning', 'Warning -Planned Gross Weight should be less than Total Gross Weight', " ", "bottom-right");
                        $(input).val(parseFloat(PGW).toFixed(2));
                        $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text());
                        PV.val(parseFloat(PVW).toFixed(2));
                        PCBM.val(parseFloat(PCCBM).toFixed(2));
                    }
                    else
                        if ($(input).val() == parseFloat(PGW)) {
                            $(input).val(parseFloat(PGW).toFixed(2));
                            $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text());
                            PV.val(parseFloat(PVW).toFixed(2));
                            PCBM.val(parseFloat(PCCBM).toFixed(2));
                        }
                    // EFlag = 1;
                    flag = false;
                }
                else if (($(input).attr('id') == "txtPV") && (parseInt($(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val()) < parseInt($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text()))) {
                    if ($(input).val() > parseFloat(PVW)) {
                        ShowMessage('warning', 'Warning -Planned Volume Weight should be less than Total Volume Weight', " ", "bottom-right");
                        $(input).val((parseFloat(PVW)).toFixed(2));
                        $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text());
                        PG.val(parseFloat(PGW).toFixed(2));
                        PCBM.val(parseFloat(PCCBM).toFixed(2));
                    }
                    else
                        if ($(input).val() == parseFloat(PVW)) {
                            $(input).val((parseFloat(PVW)).toFixed(2));
                            $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text());
                            PG.val(parseFloat(PGW).toFixed(2));
                            PCBM.val(parseFloat(PCCBM).toFixed(2));
                        }
                    // EFlag = 1;
                    flag = false;
                }
                else if (($(input).attr('id') == "txtPCBM") && (parseInt($(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val()) < parseInt($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text()))) {
                    if ($(input).val() > parseFloat(PCCBM)) {
                        ShowMessage('warning', 'Warning -Planned CBM should be less than Total CBM', " ", "bottom-right");
                        $(input).val((parseFloat(PCCBM)).toFixed(2));
                        $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text());
                        PG.val(parseFloat(PGW).toFixed(2));
                        PV.val(parseFloat(PVW).toFixed(2));
                    }
                    else
                        if ($(input).val() == parseFloat(PCCBM)) {
                            $(input).val((parseFloat(PCCBM)).toFixed(2));
                            $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text());
                            PG.val(parseFloat(PGW).toFixed(2));
                            PV.val(parseFloat(PVW).toFixed(2));
                        }
                    // EFlag = 1;
                    flag = false;
                }
                else {

                    PG.val(parseFloat(PGW).toFixed(2));
                    PV.val(parseFloat(PVW).toFixed(2));
                    PCBM.val(parseFloat(PCCBM).toFixed(2));

                    return true;
                }
            }
            else {
                $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text());
                PG.val(parseFloat(PGW).toFixed(2));
                PV.val(parseFloat(PVW).toFixed(2));
                PCBM.val(parseFloat(PCCBM).toFixed(2));
                flag = false;
            }
        }
        else {
            ShowMessage('warning', 'Warning - Enter Valid Number ', " ", "bottom-right");
            //  PG.val(parseFloat(PGW).toFixed(2));
            // PV.val(parseFloat(PVW).toFixed(2));
            // PCBM.val(parseFloat(PCCBM).toFixed(2));
            // fn_Cal_GVCBMOnPRE_MAN(input);
            flag = false;
            // flag = false;

        }

    }
    return flag;
}

function fn_ResetOLCPcs(input) {
    var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var TotalPcsIndex = trRow.find("th[data-field='OLCPieces']").index();
    var AWBNOIndex = trRow.find("th[data-field='AWBNo']").index();
    var PlannedPiecesIndex = trRow.find("th[data-field='PlannedPieces']").index();
    var ULDStockIndex = trRow.find("th[data-field='ULDStockSNo']").index();
    var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trRow.find("th[data-field='PlanG_V_CBM']").index();
    var ActualG_V_CBM = $(input).closest('tr').find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
    var PG = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    var PV = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    var PCBM = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');
    var PGW = ActualG_V_CBM[0];
    var PVW = ActualG_V_CBM[1];
    var PCCBM = ActualG_V_CBM[2];
    var CurrentAWBNo = $(input).closest('tr').find('td:eq(' + AWBNOIndex + ')').text();
    var TotalPcs = $(input).closest('tr').find('td:eq(' + TotalPcsIndex + ')').text();
    if ($(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val() == "" && $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val() < 0) {
        $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val(TotalPcs);
        fn_Cal_GVCBMOnOLC(input);
        chkFlag = false;
    }
    else if ($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val() == "") {
        $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val(parseFloat(PGW).toFixed(2));
        fn_Cal_GVCBMOnOLC(input);
        chkFlag = false;
    }
    else if ($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val() == "") {
        $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val(parseFloat(PVW).toFixed(2));
        fn_Cal_GVCBMOnOLC(input);
        chkFlag = false;
    }
    else if ($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val() == "") {
        $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val(parseFloat(PCCBM).toFixed(2));
        fn_Cal_GVCBMOnOLC(input);
        chkFlag = false;
    }

}

//

function fn_CalculatePREGVCBM(input) {

    var flag = false;

    var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var TotalPcsIndex = trRow.find("th[data-field='TotalPieces']").index();
    var PlannedPiecesIndex = trRow.find("th[data-field='PlannedPieces']").index();
    var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trRow.find("th[data-field='PlanG_V_CBM']").index();
    var ActualG_V_CBM = $(input).closest('tr').find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
    var PG = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    var PV = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    var PCBM = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');

    if ($(input).val() != "") {
        var totalPcs = $(input).closest('tr').find('td:eq(' + TotalPcsIndex + ')').text();
        var PlannedPcs = $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val();
        if ($.isNumeric($(input).val())) {
            //alert($(input).attr('id'))

            if ($(input).val() > parseInt($(input).closest('tr').find('td:eq(' + TotalPcsIndex + ')').text())) {
                // alert("Planned pieces should be less than Total Pieces ");
                ShowMessage('warning', 'Warning -Planned pieces should be less than Total Pieces', " ", "bottom-right");
                $(input).val(totalPcs);
                fn_CalculatePREGVCBM(input);
                //PG.val(0);
                //PV.val(0);
                //PCBM.val(0);
                flag = false;
            }

            else {

                PG.val(parseFloat((ActualG_V_CBM[0] / totalPcs) * PlannedPcs).toFixed(2));
                PV.val(parseFloat((ActualG_V_CBM[1] / totalPcs) * PlannedPcs).toFixed(2));
                PCBM.val(parseFloat((ActualG_V_CBM[2] / totalPcs) * PlannedPcs).toFixed(2));
                flag = true;
            }
        }
        else {
            // alert("Enter Valid Number");
            ShowMessage('warning', 'Warning - Enter Valid Number ', " ", "bottom-right");
            $(input).val(totalPcs);
            fn_CalculatePREGVCBM(input);
            //PG.val(0);
            //PV.val(0);
            //PCBM.val(0);
            flag = false;

        }
    }
    // fn_CalculateSplitTotalPcs(input);
    return flag;

}
//Calculate GVCBM for Mainfest and Premanifest
function fn_CalPRE_Man_GVCBM(input) {

    var flag = false;
    var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var TotalPcsIndex = trRow.find("th[data-field='TotalPieces']").index();
    var PlannedPiecesIndex = trRow.find("th[data-field='PlannedPieces']").index();
    var TotalPPcsIndex = trRow.find("th[data-field='TotalPPcs']").index();
    var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trRow.find("th[data-field='PlanG_V_CBM']").index();
    var PGWIndex = trRow.find("th[data-field='PGW']").index();
    var PVWIndex = trRow.find("th[data-field='PVW']").index();
    var PCCBMIndex = trRow.find("th[data-field='PCCBM']").index();
    var ActualG_V_CBM = $(input).closest('tr').find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
    var PG = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    var PV = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    var PCBM = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');
    var PGW = $(input).closest('tr').find('td:eq(' + PGWIndex + ')').text();
    var PVW = $(input).closest('tr').find('td:eq(' + PVWIndex + ')').text();
    var PCCBM = $(input).closest('tr').find('td:eq(' + PCCBMIndex + ')').text();
    var totalPcs = $(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text();
    var PlannedPcs = $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val();
    if ($(input).val() != "") {
        if ($(input).val() != 0 && $(input).val() > 0) {
            if ($.isNumeric($(input).val())) {
                //alert($(input).attr('id'))

                if ($(input).val() > parseInt($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text())) {
                    // alert("Pieces cannot be Planned pieces");
                    ShowMessage('warning', 'Warning -Planned Pieces should be less than Total Pieces', " ", "bottom-right");
                    $(input).val(totalPcs);
                    //fn_CalculatePREGVCBM(input);
                    fn_CalPRE_Man_GVCBM(input);
                    flag = false;
                }
                else {

                    PG.val(parseFloat((PGW) / ($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text()) * PlannedPcs).toFixed(2));
                    PV.val(parseFloat(PVW / ($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text()) * PlannedPcs).toFixed(2));
                    PCBM.val(parseFloat(PCCBM / ($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text()) * PlannedPcs).toFixed(2));
                    flag = true;
                }
            }
            else {
                // alert("Enter Valid Number");
                ShowMessage('warning', 'Warning - Enter Valid Number ', " ", "bottom-right");
                $(input).val(totalPcs);
                fn_CalPRE_Man_GVCBM(input);
                //fn_CalculatePREGVCBM(input);
                flag = false;

            }
        }
        else {
            $(input).val(totalPcs);
            fn_CalPRE_Man_GVCBM(input);
        }
    }

    // fn_CalculateSplitTotalPcs(input);
    return flag;

}


///Created on 3-2-2016
function fn_Cal_GVCBM(input) {
    var flag = false;

    var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var TotalPcsIndex = trRow.find("th[data-field='TotalPieces']").index();
    var PlannedPiecesIndex = trRow.find("th[data-field='PlannedPieces']").index();
    var hdnTotalPiecesIndex = trRow.find("th[data-field='hdnTotalPieces']").index();
    var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trRow.find("th[data-field='PlanG_V_CBM']").index();
    var ActualG_V_CBM = $(input).closest('tr').find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
    var PG = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    var PV = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    var PCBM = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');

    if ($(input).val() != "") {
        var totalPcs = $(input).closest('tr').find('td:eq(' + hdnTotalPiecesIndex + ')').text();
        var PlannedPcs = $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val();
        if ($.isNumeric($(input).val())) {



            var Plann_PG = (parseFloat((ActualG_V_CBM[0] / totalPcs) * PlannedPcs).toFixed(2));
            var Plann_PV = (parseFloat((ActualG_V_CBM[1] / totalPcs) * PlannedPcs).toFixed(2));
            var Plann_PCBM = (parseFloat((ActualG_V_CBM[2] / totalPcs) * PlannedPcs).toFixed(2));


            if (($(input).attr('id') == "txtPG") && ($(input).val() > parseFloat(Plann_PG))) {
                // alert("Planned Gross Weight should be less than Total Gross Weight ");
                ShowMessage('warning', 'Warning -Planned Gross Weight should be less than Total Gross Weight', " ", "bottom-right");
                $(input).val(Plann_PG);
                // fn_Cal_GVCBM(input);
                flag = false;
            }
            else if (($(input).attr('id') == "txtPV") && ($(input).val() > parseFloat(Plann_PV))) {
                // alert("Planned Volume Weight should be less than Total Volume Weight");
                ShowMessage('warning', 'Warning -Planned Volume Weight should be less than Total Volume Weight', " ", "bottom-right");
                $(input).val(Plann_PV);
                // fn_Cal_GVCBM(input);
                flag = false;
            }
            else if (($(input).attr('id') == "txtPCBM") && ($(input).val() > parseFloat(Plann_PCBM))) {
                // alert("Planned CBM should be less than Total CBM ");
                ShowMessage('warning', 'Warning -Planned CBM should be less than Total CBM', " ", "bottom-right");
                $(input).val(Plann_PCBM);
                // fn_Cal_GVCBM(input);
                flag = false;
            }
            else {

                //  PG.val(parseFloat((ActualG_V_CBM[0] / totalPcs) * PlannedPcs).toFixed(3));
                //   PV.val(parseFloat((ActualG_V_CBM[1] / totalPcs) * PlannedPcs).toFixed(3));
                //   PCBM.val(parseFloat((ActualG_V_CBM[2] / totalPcs) * PlannedPcs).toFixed(3));
                flag = true;
            }
        }
        else {
            // alert("Enter Valid Number");
            ShowMessage('warning', 'Warning - Enter Valid Number ', " ", "bottom-right");
            $(input).val(totalPcs);
            //fn_CalculateGVCBM(input);
            fn_CalGVCBMForLI(input);
            //PG.val(0);
            //PV.val(0);
            //PCBM.val(0);
            flag = false;

        }
    }
    // fn_CalculateSplitTotalPcs(input);
    return flag;

}
////

function fn_CalculateGVCBM(input) {

    var flag = false;

    var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var TotalPcsIndex = trRow.find("th[data-field='OLCPieces']").index();
    var PlannedPiecesIndex = trRow.find("th[data-field='PlannedPieces']").index();
    var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trRow.find("th[data-field='PlanG_V_CBM']").index();
    var ActualG_V_CBM = $(input).closest('tr').find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
    var PG = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    var PV = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    var PCBM = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');

    if ($(input).val() != "") {
        var totalPcs = $(input).closest('tr').find('td:eq(' + TotalPcsIndex + ')').text();
        var PlannedPcs = $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val();
        if ($.isNumeric($(input).val())) {
            //alert($(input).attr('id'))

            if ($(input).val() > parseInt($(input).closest('tr').find('td:eq(' + TotalPcsIndex + ')').text())) {
                // alert("Planned pieces should be less than Total Pieces ");
                ShowMessage('warning', 'Warning -Planned pieces should be less than Total Pieces', " ", "bottom-right");
                $(input).val(totalPcs);
                fn_CalculateGVCBM(input);
                //PG.val(0);
                //PV.val(0);
                //PCBM.val(0);
                flag = false;
            }

            else {

                PG.val(parseFloat((ActualG_V_CBM[0] / totalPcs) * PlannedPcs).toFixed(3));
                PV.val(parseFloat((ActualG_V_CBM[1] / totalPcs) * PlannedPcs).toFixed(3));
                PCBM.val(parseFloat((ActualG_V_CBM[2] / totalPcs) * PlannedPcs).toFixed(3));
                flag = true;
            }
        }
        else {
            // alert("Enter Valid Number");
            ShowMessage('warning', 'Warning - Enter Valid Number ', " ", "bottom-right");
            $(input).val(totalPcs);
            fn_CalculateGVCBM(input);
            //PG.val(0);
            //PV.val(0);
            //PCBM.val(0);
            flag = false;

        }
    }
    // fn_CalculateSplitTotalPcs(input);
    return flag;

}
function fn_Cal_GVCBM1_Backup(input) {

    var flag = false;
    var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trRow.find("th[data-field='PlanG_V_CBM']").index();
    var ULDStockSNoIndex = trRow.find("th[data-field='ULDStockSNo']").index();
    var AWBNOIndex = trRow.find("th[data-field='AWBNo']").index();
    var ActualG_V_CBM = $(input).closest('tr').find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
    var PG = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    var PV = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    var PCBM = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');
    var PGN = $(input).closest('tr').next().find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    var PVN = $(input).closest('tr').next().find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    var PCBMN = $(input).closest('tr').next().find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');
    $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').css('border-color', '');
    $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').css('border-color', '');
    $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').css('border-color', '');

    var NextRow = $(input).closest('tr').next().index();
    var last_index = 0;
    var EFlag = 0;
    var PlanGrossWT = 0, PlanVolWT = 0, PlanCBMWT = 0, TotalGWT = 0;
    var RemPlanGWT = 0, RemPlanVWT = 0, RemPlanCBMWT = 0;
    var CurrentAWBNo = $(input).closest('tr').find('td:eq(' + AWBNOIndex + ')').text();
    $(input).closest('tbody').find("tr").each(function (row, tr) {
        if ($(tr).find('td:eq(' + AWBNOIndex + ')').text() == CurrentAWBNo) {
            if ($(tr).find('td:eq(' + ULDStockSNoIndex + ')').text() == 0) {
                if (row != NextRow) {
                    PlanGrossWT = PlanGrossWT + parseFloat($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val());
                    PlanVolWT = PlanVolWT + parseFloat($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val());
                    PlanCBMWT = PlanCBMWT + parseFloat($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val());
                }
                if (row != $(input).closest('tr').index()) {
                    RemPlanGWT = RemPlanGWT + parseFloat($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val());
                    RemPlanVWT = RemPlanVWT + parseFloat($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val());
                    RemPlanCBMWT = RemPlanCBMWT + parseFloat($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val());
                }

                last_index = $(tr).index();
            }
        }
    });
    var RemainningGWT = parseFloat(ActualG_V_CBM[0]) - PlanGrossWT;
    var RemainningVWT = parseFloat(ActualG_V_CBM[1]) - PlanVolWT;
    var RemainningCBMWT = parseFloat(ActualG_V_CBM[2]) - PlanCBMWT;
    if ($(input).val() != "") {
        if ($.isNumeric($(input).val())) {
            var Plann_PG = parseFloat(RemainningGWT).toFixed(3);
            var Plann_PV = parseFloat(RemainningVWT).toFixed(3);
            var Plann_PCBM = parseFloat(RemainningCBMWT).toFixed(3);
            if (($(input).attr('id') == "txtPG") && (RemainningGWT < 0)) {
                ShowMessage('warning', 'Warning -Planned Gross Weight should be less than Total Gross Weight', " ", "bottom-right");
                $(input).val((parseFloat(ActualG_V_CBM[0]) - RemPlanGWT).toFixed(3));
                EFlag = 1;
                flag = false;
            }
            else if (($(input).attr('id') == "txtPV") && (RemainningVWT < 0)) {
                ShowMessage('warning', 'Warning -Planned Volume Weight should be less than Total Volume Weight', " ", "bottom-right");
                $(input).val((parseFloat(ActualG_V_CBM[1]) - RemPlanVWT).toFixed(3));
                EFlag = 1;
                flag = false;
            }
            else if (($(input).attr('id') == "txtPCBM") && (RemainningCBMWT < 0)) {
                ShowMessage('warning', 'Warning -Planned CBM should be less than Total CBM', " ", "bottom-right");
                $(input).val((parseFloat(ActualG_V_CBM[2]) - RemPlanCBMWT).toFixed(3));
                EFlag = 1;
                flag = false;
            }
            else {
                if (EFlag != 1) {
                    if ($(input).closest('tr').index() == last_index) {

                        PG.val(parseFloat(ActualG_V_CBM[0] - parseFloat(RemPlanGWT)).toFixed(3));
                        PV.val(parseFloat(ActualG_V_CBM[1] - parseFloat(RemPlanVWT)).toFixed(3));
                        PCBM.val(parseFloat(ActualG_V_CBM[2] - parseFloat(RemPlanCBMWT)).toFixed(3));

                    }
                    else {
                        //if (Plann_PG == 0) {
                        //    ShowMessage('warning', 'Warning -Planned Gross Weight should be grater than 0', " ", "bottom-right");
                        //}
                        //if (Plann_PV == 0) {
                        //    ShowMessage('warning', 'Warning -Planned Volume Weight should be grater than 0', " ", "bottom-right");
                        //}
                        //if (Plann_PCBM == 0) {
                        //    ShowMessage('warning', 'Warning -Planned CBM should be grater than 0', " ", "bottom-right");
                        //}
                        // PGN.val(parseFloat(Plann_PG + incVal).toFixed(3));
                        PGN.val(Plann_PG);
                        PVN.val(Plann_PV);
                        PCBMN.val(Plann_PCBM);
                    }
                }
                return true;
            }
        }
        else {
            ShowMessage('warning', 'Warning - Enter Valid Number ', " ", "bottom-right");
            //  $(input).val(totalPcs);
            fn_CalGVCBMForLI(input);
            flag = false;

        }
    }
    return flag;
}

function fn_Cal_GVCBM1(input) {

    var flag = false;
    var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trRow.find("th[data-field='PlanG_V_CBM']").index();
    var ULDStockSNoIndex = trRow.find("th[data-field='ULDStockSNo']").index();
    var AWBNOIndex = trRow.find("th[data-field='AWBNo']").index();
    var ActualG_V_CBM = $(input).closest('tr').find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
    var PG = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    var PV = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    var PCBM = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');
    var PGN = $(input).closest('tr').next().find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    var PVN = $(input).closest('tr').next().find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    var PCBMN = $(input).closest('tr').next().find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');
    //for ristrict update BUP Shipment
    var NewULDStockSNo = $(input).closest('tr').next().find('td:eq(' + ULDStockSNoIndex + ')').text();
    ///////change on 13-07-2016 for manage RCS Without Calculation/////////

    var PGWIndex = trRow.find("th[data-field='PGW']").index();
    var PVWIndex = trRow.find("th[data-field='PVW']").index();
    var PCBMWIndex = trRow.find("th[data-field='PCBMW']").index();
    var PGW = parseFloat($(input).closest('tr').find('td:eq(' + PGWIndex + ')').text());
    var PVW = parseFloat($(input).closest('tr').find('td:eq(' + PVWIndex + ')').text());
    var PCBMW = parseFloat($(input).closest('tr').find('td:eq(' + PCBMWIndex + ')').text());

    //////////////////////////////
    $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').css('border-color', '');
    $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').css('border-color', '');
    $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').css('border-color', '');

    var NextRow = $(input).closest('tr').next().index();
    var last_index = 0;
    var EFlag = 0;
    var PlanGrossWT = 0, PlanVolWT = 0, PlanCBMWT = 0, TotalGWT = 0;
    var RemPlanGWT = 0, RemPlanVWT = 0, RemPlanCBMWT = 0;
    var CurrentAWBNo = $(input).closest('tr').find('td:eq(' + AWBNOIndex + ')').text();
    $(input).closest('tbody').find("tr").each(function (row, tr) {
        if ($(tr).find('td:eq(' + AWBNOIndex + ')').text() == CurrentAWBNo) {
            if ($(tr).find('td:eq(' + ULDStockSNoIndex + ')').text() == 0) {
                if (row != NextRow) {
                    PlanGrossWT = PlanGrossWT + parseFloat($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val());
                    PlanVolWT = PlanVolWT + parseFloat($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val());
                    PlanCBMWT = PlanCBMWT + parseFloat($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val());
                }
                if (row != $(input).closest('tr').index()) {
                    RemPlanGWT = RemPlanGWT + parseFloat($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val());
                    RemPlanVWT = RemPlanVWT + parseFloat($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val());
                    RemPlanCBMWT = RemPlanCBMWT + parseFloat($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val());
                }

                last_index = $(tr).index();
            }
        }
    });
    var RemainningGWT = PGW - PlanGrossWT;
    var RemainningVWT = PVW - PlanVolWT;
    var RemainningCBMWT = PCBMW - PlanCBMWT;
    if ($(input).val() != "") {
        if ($.isNumeric($(input).val())) {
            var Plann_PG = parseFloat(RemainningGWT).toFixed(3);
            var Plann_PV = parseFloat(RemainningVWT).toFixed(3);
            var Plann_PCBM = parseFloat(RemainningCBMWT).toFixed(3);
            if (($(input).attr('id') == "txtPG") && (RemainningGWT < 0)) {
                ShowMessage('warning', 'Warning -Planned Gross Weight should be less than Total Gross Weight', " ", "bottom-right");
                $(input).val((PGW - RemPlanGWT).toFixed(3));
                EFlag = 1;
                flag = false;
            }
            else if (($(input).attr('id') == "txtPV") && (RemainningVWT < 0)) {
                ShowMessage('warning', 'Warning -Planned Volume Weight should be less than Total Volume Weight', " ", "bottom-right");
                $(input).val((PVW - RemPlanVWT).toFixed(3));
                EFlag = 1;
                flag = false;
            }
            else if (($(input).attr('id') == "txtPCBM") && (RemainningCBMWT < 0)) {
                ShowMessage('warning', 'Warning -Planned CBM should be less than Total CBM', " ", "bottom-right");
                $(input).val((PCBMW - RemPlanCBMWT).toFixed(3));
                EFlag = 1;
                flag = false;
            }
            else {
                if (EFlag != 1) {
                    if ($(input).closest('tr').index() == last_index) {

                        PG.val((PGW - parseFloat(RemPlanGWT)).toFixed(3));
                        PV.val((PVW - parseFloat(RemPlanVWT)).toFixed(3));
                        PCBM.val((PCBMW - parseFloat(RemPlanCBMWT)).toFixed(3));

                    }
                    else {
                        //if (Plann_PG == 0) {
                        //    ShowMessage('warning', 'Warning -Planned Gross Weight should be grater than 0', " ", "bottom-right");
                        //}
                        //if (Plann_PV == 0) {
                        //    ShowMessage('warning', 'Warning -Planned Volume Weight should be grater than 0', " ", "bottom-right");
                        //}
                        //if (Plann_PCBM == 0) {
                        //    ShowMessage('warning', 'Warning -Planned CBM should be grater than 0', " ", "bottom-right");
                        //}
                        // PGN.val(parseFloat(Plann_PG + incVal).toFixed(3));

                        if (NewULDStockSNo == 0) { //for ristrict update BUP Shipment

                            PGN.val(Plann_PG);
                            PVN.val(Plann_PV);
                            PCBMN.val(Plann_PCBM);
                        }
                    }
                }
                return true;
            }
        }
        else {
            ShowMessage('warning', 'Warning - Enter Valid Number ', " ", "bottom-right");
            //  $(input).val(totalPcs);
            fn_CalGVCBMForLI(input);
            flag = false;

        }
    }
    return flag;
}

function fn_CheckWeightValidation() {
    var chkFlag = true;
    var CheckArray = new Array();
    $('#divDetail .k-grid-content tbody tr').each(function (row, tr) {
        var Rowtr = $(tr).closest("div.k-grid").find("div.k-grid-header");
        var PlanG_V_CBMIndex = Rowtr.find("th[data-field='PlanG_V_CBM']").index();
        var ULDGroupNoIndex = Rowtr.find("th[data-field='ULDGroupNo']").index();
        var PlanPcsIndex = Rowtr.find("th[data-field='PlannedPieces']").index();
        $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').css('border-color', '');
        $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').css('border-color', '');
        $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').css('border-color', '');

        // if ($(tr).find('td:eq(' + PlanPcsIndex + ') input[type=text]').val() =="") {
        //     ShowMessage('warning', 'Warning -Planned Pieces should not be blank', " ", "bottom-right");
        //     $(tr).find('td:eq(' + PlanPcsIndex + ') input[type=text]').focus().css('border-color', 'red');
        //     chkFlag = false;
        // }
        // else if ($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val() == "") {
        //     ShowMessage('warning', 'Warning -Planned Gross Weight should not be blank', " ", "bottom-right");
        //     $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').focus().css('border-color', 'red');
        //     chkFlag = false;
        // }
        // else if ($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val() == "") {
        //     ShowMessage('warning', 'Warning -Planned Volume Weight should not be blank', " ", "bottom-right");
        //     $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').focus().css('border-color', 'red');
        //     chkFlag = false;
        // }
        // else if ($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val() == "") {
        //     ShowMessage('warning', 'Warning -Planned CBM should not be blank', " ", "bottom-right");
        //     $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').focus().css('border-color', 'red');
        //     chkFlag = false;
        // }
        //else 
        if ($(tr).find('td:eq(' + PlanPcsIndex + ') input[type=text]').val() == 0) {
            ShowMessage('warning', 'Warning -Planned Pieces should be greater than 0', " ", "bottom-right");
            $(tr).find('td:eq(' + PlanPcsIndex + ') input[type=text]').focus().css('border-color', 'red');
            chkFlag = false;
        }
        else if ($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val() == 0) {
            ShowMessage('warning', 'Warning -Planned Gross Weight should be greater than 0', " ", "bottom-right");
            $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').focus().css('border-color', 'red');
            chkFlag = false;
        }
        else if ($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val() == 0) {
            ShowMessage('warning', 'Warning -Planned Volume Weight should be greater than 0', " ", "bottom-right");
            $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').focus().css('border-color', 'red');
            chkFlag = false;
        }
        else if ($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val() == 0) {
            ShowMessage('warning', 'Warning -Planned CBM should be greater than 0', " ", "bottom-right");
            $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').focus().css('border-color', 'red');
            chkFlag = false;
        }

    });
    return chkFlag;
}


function fn_CalculateSplitTotalPcs(input) {
    var flag = false;
    var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var TotalPcsIndex = trRow.find("th[data-field='TotalPieces']").index();
    var PlannedPiecesIndex = trRow.find("th[data-field='PlannedPieces']").index();
    var hdnTotalPiecesIndex = trRow.find("th[data-field='hdnTotalPieces']").index();
    var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trRow.find("th[data-field='PlanG_V_CBM']").index();
    var ActualG_V_CBM = $(input).closest('tr').find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
    var PG = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    var PV = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    var PCBM = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');
    var AWBNOIndex = trRow.find("th[data-field='AWBNo']").index();
    var CurrentAWBNo = $(input).closest('tr').find('td:eq(' + AWBNOIndex + ')').text();
    if ($(input).val() != "") {
        var totalPcs = $(input).closest('tr').find('td:eq(' + TotalPcsIndex + ')').text();
        var PlannedPcs = 0, PlannedActualPcs = 0;
        var row_index = $(input).closest('tr').index();
        // alert(row_index);
        $(input).closest('tbody').find("tr").each(function (row, tr) {
            if ($(tr).find('td:eq(' + AWBNOIndex + ')').text() == CurrentAWBNo) {
                if (row != row_index) {

                    PlannedActualPcs = PlannedActualPcs + parseInt($(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val());
                }
                PlannedPcs = PlannedPcs + parseInt($(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val());
            }
        });
        //alert(PlannedPcs);
        if ($.isNumeric($(input).val())) {
            if ((PlannedPcs > totalPcs) || (parseInt($(input).val()) == 0)) {
                //    alert("Planned pieces should be less than Total Pieces ");
                ShowMessage('warning', 'Warning -Planned pieces should be less than Total Pieces', " ", "bottom-right");
                $(input).val(totalPcs - PlannedActualPcs);
                fn_CalGVCBMForLI(input);
                flag = false;
            }
        }
        else {
            // alert("Enter Valid Number");
            ShowMessage('warning', 'Warning - Enter Valid Number ', " ", "bottom-right");
            $(input).val(totalPcs);
            // fn_CalculateGVCBM(input);
            //PG.val(0);
            //PV.val(0);
            //PCBM.val(0);
            flag = false;

        }
    }
    // fn_Cal_GVCBM1($(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]'));
    return flag;
}
function fn_CheckOffloadPCS(input) {
    var tr = $(input).closest('tr');
    var trHeader = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var TPcsIndex = trHeader.find("th[data-field='TotalPPcs']").index();
    var PlannedPiecesIndex = trHeader.find("th[data-field='PlannedPieces']").index();
    var BulkIndex = trHeader.find("th[data-field='Bulk']").index();
    var chk = $(tr).find('td:eq(' + BulkIndex + ') input[type="checkbox"]');
    if ($(chk).prop("checked") == false) {
        $(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val($(tr).find('td:eq(' + TPcsIndex + ')').text());
        fn_CalPRE_Man_GVCBM($(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]'));
    }
}



function fn_CheckOnHoldPcs(AWBSNo, ProcessedPcs, ChkType) {
    var ProcessedPcsVal = 0;
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/fn_CheckOnHoldPcs",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ AWBSNo: AWBSNo, ProcessedPcs: ProcessedPcs, ChkType: ChkType }),
        async: false,
        type: 'post',
        cache: false,
        success: function (result) {
            var Data = jQuery.parseJSON(result)
            var FinalData = Data.Table0
            ProcessedPcsVal = FinalData[0].AvailableProcssPcs;
        }
    });
    return parseInt(ProcessedPcsVal);
}

function fn_AirmailDetails() {
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetAirMailPrintData",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ DailyFlightSNo: CurrentFlightSno }),
        async: false,
        type: 'post',
        cache: false,
        success: function (result) {
            var Data = jQuery.parseJSON(result)
            var FinalData = Data.Table0

            if (FinalData.length > 0) {
                $('#spnflightno').text(FinalData[0].FlightNo)
                $('#spnflightdate').html(FinalData[0].FlightDate)
                $('#spnupliftstation').html(FinalData[0].ShipmentOrigin)
                $('#spnTotalPices').text(FinalData[0].TotalPieces)
                $('#spnTotalWeight').text(FinalData[0].TotalWeight)
                $('#spnTotalBegs').text(FinalData.length)
                $('#spnCompletedBy').text(FinalData[0].UserName)
                var i = 0
                $(FinalData).each(function (row, tr) {
                    i = parseInt(i) + 1;
                    $('#tr1').after('<tr>' +
                            '<td style="border:1px solid black;text-align:center">' + tr.MailBegSrNo + '</td>' +
                            '<td style="border:1px solid black;text-align:center">' + tr.CNNo + '</td>' +
                            '<td style="border:1px solid black;text-align:center">' + tr.NoOfBages + '</td>' +
                            '<td style="border:1px solid black;text-align:center">' + tr.ShipmentOrigin + '</td>' +
                            '<td style="border:1px solid black;text-align:center">' + tr.ShipmentDest + '</td>' +

                            '<td style="border:1px solid black;text-align:center">' + tr.AO + '</td>' +
                            '<td style="border:1px solid black;text-align:center">' + tr.CP + '</td>' +
                            '<td style="border:1px solid black;text-align:center">' + tr.SC + '</td>' +
                        '</tr>')
                    if (i < 20) {
                        $('#trlast').prev('tr').remove();
                    }
                })
            }

        }

    })
}
var IsBulkSelected = false;
//var IsOSCBulkSelected = false;
//var IsLYBulkSelected = false;

function fn_CheckRFSValidation(input) {
    if (IsRFS) {
        var ULDCount = 0;
        $('#divDetail  div.k-grid-content   tr.k-detail-row table > tbody > tr > td:nth-child(2) input[type=checkbox]:checked').each(function (row, tr) {
            IsBulkSelected = true;
        });
        $('#divLyingDetail  div.k-grid-content   tr.k-detail-row table > tbody > tr > td:nth-child(2) input[type=checkbox]:checked').each(function (rowmain, trMain) {
            IsBulkSelected = true;

        });
        $('#divOSCDetail  div.k-grid-content   tr.k-detail-row table > tbody > tr > td:nth-child(2) input[type=checkbox]:checked').each(function (rowmain, trMain) {
            IsBulkSelected = true;
        });
        $('#divDetail  div.k-grid-content > table > tbody > tr[class~="k-master-row"] input[type=checkbox]:checked').each(function (row, tr) {
            ULDCount++;
            // alert('Plan='+row)
        });
        $('#divLyingDetail  div.k-grid-content > table > tbody > tr[class~="k-master-row"] input[type=checkbox]:checked').each(function (rowmain, trMain) {
            ULDCount++;
            //alert('Lying='+rowmain)

        });
        $('#divOSCDetail  div.k-grid-content > table > tbody > tr[class~="k-master-row"] input[type=checkbox]:checked').each(function (rowmain, trMain) {
            ULDCount++;
            //alert('OSC='+ rowmain)
        });

        // ULDCount = ULDCount + (IsBulkSelected == true ? 1 : 0) + (IsOSCBulkSelected == true ? 1 : 0) + (IsLYBulkSelected == true ? 1 : 0);
        ULDCount = ULDCount + (IsBulkSelected == true ? 1 : 0);//+ (IsOSCBulkSelected == true ? 1 : 0) + (IsLYBulkSelected == true ? 1 : 0);
        // alert(ULDCount);
        if (ULDCount > 11) {
            ShowMessage('warning', "Warning", "Maximum 11 ULD's allowed for RFS/Truck", "bottom-right");
            $(input).prop('checked', false);
        }
    }
}

function onDataBound(arg) {
    //  alert('test');
    var grid = $("#" + arg.sender.element[0].id + "").data("kendoGrid");
    var gridData = grid.dataSource.view();

    //var DailyFlightSNo = '';
    //
    //DailyFlightSNo.substr();
    // BindFlightChart(DailyFlightSNo.substr(1, DailyFlightSNo.length));
    //BindFlightChart('159594, 159595, 159596, 159597, 159598');
}

function ISNumeric(obj) {
    if ((event.which < 48 || event.which > 57) && (event.which < 96 || event.which > 105) && (event.which != 0 && event.which != 8)) {
        event.preventDefault();
    }
}

function GetReportData(FlightSNo) {
    $("#divDetail").html("");
    var FlightSNoArray = FlightSNo.split(',');
    $(FlightSNoArray).each(function (r, i) {
        //  if (r < (FlightSNoArray.length - 1)) {
        $.ajax({
            url: "Services/FlightControl/FlightControlService.svc/GetPreReport?DailyFlightSNo=" + i, async: false, type: "get", dataType: "html", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#btnPrint").closest('tr').hide();
                $('#SecondTab').hide();
                $('#OSCTab').hide();
                $('#FlightStopOverDetailTab').hide();
                $("#divDetail").append(result);
                // console.log(result);

                if (r == FlightSNoArray.length - 1) {
                    $("#btnPrint").unbind("click").bind("click", function () {
                        $("#divDetailPrint #divDetail").printArea();
                    });
                }
                else {

                    $("#divDetail").append('</br><div class="page-break"></div>');
                }
            },
            error: function (rex) {
                //   alert(rex);
            }
        });
        // }
    })
    $("#divDetail #btnPrint:last").closest('tr').show();
}

function GetDate(str) {
    var arr = str.split(" ");
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var month = ('0' + (months.indexOf(arr[1]) + 1)).slice(-2);
    var final = arr[2] + '-' + month + '-' + arr[0];
    return final;
}

function SaveManifestInfo(mode) {
    var flag = false;
    var chkSelect = false;
    var IntectShipArray = new Array();
    var BulkShipArray = new Array();
    var LyingIntectShipArray = new Array();
    var LyingBulkShipArray = new Array();
    var OSCLyingIntectShipArray = new Array();
    var OSCLyingBulkShipArray = new Array();
    //added for pax and freighter radio button
    var FlightType = $("input[type=radio][name=Pax]:checked").val();

    //if ((SaveProcessStatus == "PRE" || SaveProcessStatus == "PRE_FINAL") && IsRFS == false && IsBuildup == false) {
    //    ShowMessage('warning', 'Warning -Load Plan/Flight Build Up not done.', "Cannot proceed with Pre-Manifest process", "bottom-right");
    //    flag = false;
    //}
    //else
    if ((SaveProcessStatus == "MAN" || SaveProcessStatus == "DEP") && IsRFS == false && IsPreManifested == false && IsNILManifested == "false") {
        ShowMessage('warning', 'Warning -Load Plan/Flight Build Up not done.', "Cannot proceed with Manifest process", "bottom-right");
        flag = false;
    }
    else
        //if ((SaveProcessStatus == "MAN" || SaveProcessStatus == "DEP") && IsRFS == true && IsPreManifested == true) {
        if ((SaveProcessStatus == "MAN" || SaveProcessStatus == "DEP") && IsRFS == true) {
            ShowMessage('warning', 'Warning -This is a RFS/Truck Movement.', " Kindly use RFS module to process Truck Manifest", "bottom-right");
            flag = false;
        }
        else if ((SaveProcessStatus == "PRE" || SaveProcessStatus == "PRE_FINAL") && IsRFS == true && IsRFSFlightsEdit == false) {
            ShowMessage('warning', 'Warning -Flight assignment done for RFS/Truck Movement', "Cannot proceed with Pre-Manifest process", "bottom-right");
            flag = false;
        }


        else {

            if (FlightCloseFlag != "DEP") {
                $('#divDetail table tbody tr[class~="k-master-row"]').each(function (row, tr) {


                    var Rowtr = $(tr).closest("div.k-grid").find("div.k-grid-header:first");
                    var ULDStockSNoIndex = Rowtr.find("th[data-field='ULDStockSNo']").index();
                    var ULDNoIndex = Rowtr.find("th[data-field='ULDNo']").index();
                    var SelectIndex = Rowtr.find("th[data-field='isSelect']").index();
                    var RFSRemarksInx = Rowtr.find("th[data-field='RFSRemarks']").index();
                    var LastPointInx = Rowtr.find("th[data-field='LastPoint']").index();
                    var FlightType = $("input[type=radio][name=Pax]:checked").val();

                    var DailyFlightSNo = $('#hdnFlightSNo').val();
                    var isSelect = $(tr).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked');
                    if ($(tr).find('td:eq(' + ULDNoIndex + ')').text() == "BULK") {
                        var nestedGridHeader = $(tr).next().find("div.k-grid-header");
                        var nestedGridContent = $(tr).next().find("div.k-grid-content > table > tbody  tr");
                        var AWBSNoIndex = nestedGridHeader.find("th[data-field='AWBSNo']").index();
                        var IsBulkIndex = nestedGridHeader.find("th[data-field='Bulk']").index();
                        var IsFlightSNOIndex = nestedGridHeader.find("th[data-field='DailyFlightSNo']").index();
                        var PiecesIndex = nestedGridHeader.find("th[data-field='TotalPPcs']").index();

                        var PGWIndex = nestedGridHeader.find("th[data-field='PGW']").index();
                        var PVWIndex = nestedGridHeader.find("th[data-field='PVW']").index();
                        var PCBMWIndex = nestedGridHeader.find("th[data-field='PCCBM']").index();

                        var PlannedPiecesIndex = nestedGridHeader.find("th[data-field='PlannedPieces']").index();
                        var ActG_V_CBMIndex = nestedGridHeader.find("th[data-field='ActG_V_CBM']").index();
                        var PlanG_V_CBMIndex = nestedGridHeader.find("th[data-field='PlanG_V_CBM']").index();
                        var SHCIndex = nestedGridHeader.find("th[data-field='SHC']").index();
                        var AgentIndex = nestedGridHeader.find("th[data-field='Agent']").index();
                        var RFSRemarksIndex = nestedGridHeader.find("th[data-field='RFSRemarks']").index();
                        var AWBOffPointIndex = nestedGridHeader.find("th[data-field='AWBOffPoint']").index();

                        $(nestedGridContent).each(function (row1, tr1) {
                            if ($(tr1).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]').prop('checked')) {
                                chkSelect = true;
                            }
                            else {
                                fn_CheckOffloadPCS($(tr1).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]'));
                            }
                            var AG = $(tr1).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[0];
                            var AV = $(tr1).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[1];
                            var ACBM = $(tr1).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[2];
                            var PG = $(tr1).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val();
                            var PV = $(tr1).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val();
                            var PCBM = $(tr1).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val();
                            BulkShipArray.push({
                                isBulk: $(tr1).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]').prop('checked'),
                                AWBSNo: $(tr1).find('td:eq(' + AWBSNoIndex + ')').text(),
                                DailyFlightSNo: $(tr1).find('td:eq(' + IsFlightSNOIndex + ')').text(),
                                TotalPieces: $(tr1).find('td:eq(' + PiecesIndex + ')').text(),
                                PlannedPieces: $(tr1).find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val(),
                                //ActualVolumeWt: AV,
                                //ActualGrossWt: AG,
                                //ActualCBM: ACBM,
                                ActualVolumeWt: $(tr1).find('td:eq(' + PVWIndex + ')').text(),
                                ActualGrossWt: $(tr1).find('td:eq(' + PGWIndex + ')').text(),
                                ActualCBM: $(tr1).find('td:eq(' + PCBMWIndex + ')').text(),
                                PlannedGrossWt: PG,
                                PlannedVolumeWt: PV,
                                PlannedCBM: PCBM,

                                ULDStockSNo: $(tr).find('td:eq(' + ULDStockSNoIndex + ')').text(),
                                MovementType: 2,
                                RFSRemarks: $(tr1).find('td:eq(' + RFSRemarksIndex + ') input[type=hidden]').val(),
                                AWBOffPoint: $(tr1).find('td:eq(' + AWBOffPointIndex + ') input[type="Text"]').val().toUpperCase(),
                                // SHC: $(tr1).find('td:eq(' + SHCIndex + ')').text(),
                                // Agent: $(tr1).find('td:eq(' + AgentIndex + ')').text(),
                                UpdatedBy: 2
                            });
                        });

                    }
                    else {
                        if (isSelect) {
                            chkSelect = true;
                        }
                        IntectShipArray.push({
                            isSelect: isSelect,
                            DailyFlightSNo: DailyFlightSNo,
                            ULDStockSNo: $(tr).find('td:eq(' + ULDStockSNoIndex + ')').text(),
                            MovementType: 2,
                            RFSRemarks: $(tr).find('td:eq(' + RFSRemarksInx + ') input[type=hidden]').val(),
                            LastPoint: $(tr).find('td:eq(' + LastPointInx + ') input[type=Text]').val().toUpperCase(),
                            UpdatedBy: 2
                        });
                    }

                });
                $('#divLyingDetail table tbody tr[class~="k-master-row"]').each(function (rowmain, trMain) {
                    var Rowtr = $(trMain).closest("div.k-grid").find("div.k-grid-header:first");
                    var ULDStockSNoIndex = Rowtr.find("th[data-field='ULDStockSNo']").index();
                    var ULDNoIndex = Rowtr.find("th[data-field='ULDNo']").index();
                    var SelectIndex = Rowtr.find("th[data-field='isSelect']").index();
                    var RFSRemarksInx = Rowtr.find("th[data-field='RFSRemarks']").index();
                    var LastPointInx = Rowtr.find("th[data-field='LastPoint']").index();
                    var DailyFlightSNo = $('#hdnFlightSNo').val();
                    var isSelect = $(trMain).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked');
                    if ($(trMain).find('td:eq(' + ULDNoIndex + ')').text() == "BULK") {
                        var nestedGridHeader = $(trMain).next().find("div.k-grid-header");
                        var nestedGridContent = $(trMain).next().find("div.k-grid-content > table > tbody  tr");
                        var AWBSNoIndex = nestedGridHeader.find("th[data-field='AWBSNo']").index();
                        var IsBulkIndex = nestedGridHeader.find("th[data-field='Bulk']").index();

                        var PiecesIndex = nestedGridHeader.find("th[data-field='OLCPieces']").index();
                        var PlannedPiecesIndex = nestedGridHeader.find("th[data-field='PlannedPieces']").index();
                        var ActG_V_CBMIndex = nestedGridHeader.find("th[data-field='ActG_V_CBM']").index();
                        var PlanG_V_CBMIndex = nestedGridHeader.find("th[data-field='PlanG_V_CBM']").index();
                        var SHCIndex = nestedGridHeader.find("th[data-field='SHC']").index();
                        var AgentIndex = nestedGridHeader.find("th[data-field='Agent']").index();
                        var RFSRemarksIndex = nestedGridHeader.find("th[data-field='RFSRemarks']").index();
                        var AWBOffPointIndex = nestedGridHeader.find("th[data-field='AWBOffPoint']").index();
                        $(nestedGridContent).each(function (rowChild, trChild) {
                            if ($(trChild).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]').prop('checked')) {
                                chkSelect = true;
                            }
                            var AG = $(trChild).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[0];
                            var AV = $(trChild).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[1];
                            var ACBM = $(trChild).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[2];
                            var PG = $(trChild).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val();
                            var PV = $(trChild).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val();
                            var PCBM = $(trChild).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val();
                            if ($(trChild).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]').prop('checked')) {
                                LyingBulkShipArray.push({
                                    isBulk: $(trChild).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]').prop('checked'),
                                    AWBSNo: $(trChild).find('td:eq(' + AWBSNoIndex + ')').text(),
                                    DailyFlightSNo: DailyFlightSNo,
                                    TotalPieces: $(trChild).find('td:eq(' + PiecesIndex + ')').text(),
                                    PlannedPieces: $(trChild).find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val(),
                                    ActualVolumeWt: AV,
                                    ActualGrossWt: AG,
                                    ActualCBM: ACBM,
                                    PlannedGrossWt: PG,
                                    PlannedVolumeWt: PV,
                                    PlannedCBM: PCBM,

                                    ULDStockSNo: $(trMain).find('td:eq(' + ULDStockSNoIndex + ')').text(),
                                    MovementType: 2,
                                    RFSRemarks: $(trChild).find('td:eq(' + RFSRemarksIndex + ') input[type=hidden]').val(),
                                    AWBOffPoint: $(trChild).find('td:eq(' + AWBOffPointIndex + ') input[type=Text]').val().toUpperCase(),
                                    // SHC: $(tr1).find('td:eq(' + SHCIndex + ')').text(),
                                    // Agent: $(tr1).find('td:eq(' + AgentIndex + ')').text(),
                                    UpdatedBy: 2
                                });
                            }
                        });

                    }
                    else {
                        if (isSelect) {
                            chkSelect = true;

                            LyingIntectShipArray.push({
                                isSelect: isSelect,
                                DailyFlightSNo: DailyFlightSNo,
                                ULDStockSNo: $(trMain).find('td:eq(' + ULDStockSNoIndex + ')').text(),
                                MovementType: 2,
                                RFSRemarks: $(trMain).find('td:eq(' + RFSRemarksInx + ') input[type=hidden]').val(),
                                LastPoint: $(trMain).find('td:eq(' + LastPointInx + ') input[type=Text]').val().toUpperCase(),
                                UpdatedBy: 2
                            });
                        }
                    }

                });
                $('#divOSCDetail table tbody tr[class~="k-master-row"]').each(function (rowmain, trMain) {
                    var Rowtr = $(trMain).closest("div.k-grid").find("div.k-grid-header:first");
                    var ULDStockSNoIndex = Rowtr.find("th[data-field='ULDStockSNo']").index();
                    var ULDNoIndex = Rowtr.find("th[data-field='ULDNo']").index();
                    var SelectIndex = Rowtr.find("th[data-field='isSelect']").index();
                    var RFSRemarksInx = Rowtr.find("th[data-field='RFSRemarks']").index();
                    var LastPointInx = Rowtr.find("th[data-field='LastPoint']").index();
                    var DailyFlightSNo = $('#hdnFlightSNo').val();
                    var isSelect = $(trMain).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked');
                    if ($(trMain).find('td:eq(' + ULDNoIndex + ')').text() == "BULK") {
                        var nestedGridHeader = $(trMain).next().find("div.k-grid-header");
                        var nestedGridContent = $(trMain).next().find("div.k-grid-content > table > tbody  tr");
                        var AWBSNoIndex = nestedGridHeader.find("th[data-field='AWBSNo']").index();
                        var IsBulkIndex = nestedGridHeader.find("th[data-field='Bulk']").index();

                        var PiecesIndex = nestedGridHeader.find("th[data-field='OLCPieces']").index();
                        var PlannedPiecesIndex = nestedGridHeader.find("th[data-field='PlannedPieces']").index();
                        var ActG_V_CBMIndex = nestedGridHeader.find("th[data-field='ActG_V_CBM']").index();
                        var PlanG_V_CBMIndex = nestedGridHeader.find("th[data-field='PlanG_V_CBM']").index();
                        var SHCIndex = nestedGridHeader.find("th[data-field='SHC']").index();
                        var AgentIndex = nestedGridHeader.find("th[data-field='Agent']").index();
                        var RFSRemarksIndex = nestedGridHeader.find("th[data-field='RFSRemarks']").index();
                        var AWBOffPointIndex = nestedGridHeader.find("th[data-field='AWBOffPoint']").index();

                        $(nestedGridContent).each(function (rowChild, trChild) {
                            if ($(trChild).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]').prop('checked')) {
                                chkSelect = true;
                            }
                            var AG = $(trChild).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[0];
                            var AV = $(trChild).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[1];
                            var ACBM = $(trChild).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[2];
                            var PG = $(trChild).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val();
                            var PV = $(trChild).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val();
                            var PCBM = $(trChild).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val();
                            if ($(trChild).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]').prop('checked')) {
                                OSCLyingBulkShipArray.push({
                                    isBulk: $(trChild).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]').prop('checked'),
                                    AWBSNo: $(trChild).find('td:eq(' + AWBSNoIndex + ')').text(),
                                    DailyFlightSNo: DailyFlightSNo,
                                    TotalPieces: $(trChild).find('td:eq(' + PiecesIndex + ')').text(),
                                    PlannedPieces: $(trChild).find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val(),
                                    ActualVolumeWt: AV,
                                    ActualGrossWt: AG,
                                    ActualCBM: ACBM,
                                    PlannedGrossWt: PG,
                                    PlannedVolumeWt: PV,
                                    PlannedCBM: PCBM,

                                    ULDStockSNo: $(trMain).find('td:eq(' + ULDStockSNoIndex + ')').text(),
                                    MovementType: 2,
                                    RFSRemarks: $(trChild).find('td:eq(' + RFSRemarksIndex + ') input[type=hidden]').val(),
                                    AWBOffPoint: $(trChild).find('td:eq(' + AWBOffPointIndex + ') input[type=Text]').val().toUpperCase(),
                                    // SHC: $(tr1).find('td:eq(' + SHCIndex + ')').text(),
                                    // Agent: $(tr1).find('td:eq(' + AgentIndex + ')').text(),
                                    UpdatedBy: 2
                                });
                            }
                        });

                    }
                    else {
                        if (isSelect) {
                            chkSelect = true;

                            OSCLyingIntectShipArray.push({
                                isSelect: isSelect,
                                DailyFlightSNo: DailyFlightSNo,
                                ULDStockSNo: $(trMain).find('td:eq(' + ULDStockSNoIndex + ')').text(),
                                MovementType: 2,
                                RFSRemarks: $(trMain).find('td:eq(' + RFSRemarksInx + ') input[type=hidden]').val(),
                                LastPoint: $(trMain).find('td:eq(' + LastPointInx + ') input[type=Text]').val().toUpperCase(),
                                UpdatedBy: 2
                            });
                        }
                    }

                });
                var FunctionName = "";
                if (SaveProcessStatus == "PRE" || SaveProcessStatus == "PRE_FINAL") {
                    FunctionName = "SavePMenifestInformation";
                    mode = FlightCloseFlag == "PRE" ? "PRE_FINAL" : SaveProcessStatus
                }
                else //if(SaveProcessStatus== "MAN")
                {
                    FunctionName = "SaveMenifestInformation";
                    mode = SaveProcessStatus
                }

                var postData = SaveProcessStatus == "DEP" ? JSON.stringify({ BulkShipmentInfo: BulkShipArray, IntectShipmentInfo: IntectShipArray, LyingBulkShipmentInfo: LyingBulkShipArray, LyingIntectShipmentInfo: LyingIntectShipArray, OSCLyingBulkShipmentInfo: OSCLyingBulkShipArray, OSCLyingIntectShipmentInfo: OSCLyingIntectShipArray, FlightType: FlightType, FlightSNo: $('#hdnFlightSNo').val(), RegistrationNo: $("#RegistrationNo").val(), mode: mode, ATDDate: cfi.CfiDate("txtATDDate"), ATDTime: $("#txtATDTime").val(), IsExcludeFromFFM: $("#IsExcludeFromFFM").prop("checked") }) : JSON.stringify({ BulkShipmentInfo: BulkShipArray, IntectShipmentInfo: IntectShipArray, LyingBulkShipmentInfo: LyingBulkShipArray, LyingIntectShipmentInfo: LyingIntectShipArray, OSCLyingBulkShipmentInfo: OSCLyingBulkShipArray, OSCLyingIntectShipmentInfo: OSCLyingIntectShipArray, FlightType: FlightType, FlightSNo: $('#hdnFlightSNo').val(), RegistrationNo: $("#RegistrationNo").val(), mode: mode });

                if (chkSelect || (!chkSelect && IsNILManifested == "true")) {
                    if (FlightCloseFlag == "MAN" && (SaveProcessStatus != "DEP" && SaveProcessStatus != "MAN")) {
                        ShowMessage('warning', 'Warning -Manifest already created for flight.', " No more changes allowed ", "bottom-right");
                        flag = false;
                    }
                    else {
                        // SaveProcessStatus == "MAN" ||
                        if (SaveProcessStatus == "DEP") {
                            ///////////

                            //var ftDate = $("#tdFlightDate").text().replace('-', ' ').replace('-', ' ');
                            //var arr1 = ftDate.split(" ");
                            //var final1 = arr1[0] + ' ' + arr1[1] + ' ' + arr1[2];
                            //var Min = parseInt(ATDTime.split(":")[1]) + 10;
                            //var Hr = Min / 60;
                            //Min = Min % 60;
                            //var HRs = parseInt(ATDTime.split(":")[0]) + parseInt(Hr);
                            //var HHsMM = HRs + ":" + Min;
                            //var ATDData = (HHsMM == '') ? '00:00' : HHsMM;
                            //var flightDateAndATD = GetDate(final1).replace('-', ' ').replace('-', ' ') + ' ' + ATDData + ':00';

                            //var breakdownStartDateTime1 = $("#txtATDDate").val()
                            //var bdStartTime = ($("#txtATDTime").val() == '') ? '00:00' : $("#txtATDTime").val();
                            //breakdownStartDateTime1 = $("#txtATDDate").attr("sqldatevalue").replace('-', ' ').replace('-', ' ') + ' ' + bdStartTime + ':00';

                            //if ((Date.parse(breakdownStartDateTime1) > Date.parse(flightDateAndATD)) && ($("#ManifestRemarks").val() == '' || $("#ManifestRemarks").val() == undefined)) 
                            //    if ((Date.parse(breakdownStartDateTime1) > Date.parse(flightDateAndATD)) && ($("#ManifestRemarks").val() == '' || $("#ManifestRemarks").val() == undefined)) {
                            //    fn_AddManifestRemarks(this);
                            //}
                            //else {
                            $.ajax({
                                url: "Services/FlightControl/FlightControlService.svc/" + FunctionName, async: false, type: "POST", dataType: "json", cache: false,
                                data: postData,
                                contentType: "application/json; charset=utf-8",
                                success: function (result) {
                                    var ResultStatus = result.split('?')[0];
                                    var ResultValue = result.split('?')[1];
                                    if (ResultStatus == "0" || ResultStatus == "2") {
                                        if (ResultStatus == '2')//For Hold Shipment
                                        {
                                            var msgString = '';
                                            var AWBArray = ResultValue.split('@')[0];
                                            var HOLDRemarksArray = ResultValue.split('@')[1];
                                            $(AWBArray.split('^')).each(function (r, i) {
                                                msgString = msgString + '<tr><td>' + i + ',' + HOLDRemarksArray.split('^')[r] + '</td></tr>';
                                            });
                                            msgString = '<table>' + msgString + '</table>';

                                            ShowMessage('warning', 'Warning -Shipment ', msgString, "bottom-right");
                                            //ShowMessage('warning', 'Warning -Shipment on Hold', " ", "bottom-right");
                                            flag = false;
                                        }
                                        if (SaveProcessStatus == "PRE_FINAL")
                                            ShowMessage('success', 'Success -Pre Manifest Created Successfully', "Processed Successfully", "bottom-right");
                                        else if (SaveProcessStatus == "PRE")
                                            ShowMessage('success', 'Success -Pre Manifest created Successfully', "Processed Successfully", "bottom-right");
                                        else if (SaveProcessStatus == "DEP")
                                            ShowMessage('success', 'Success -Flight Departed Successfully', "Processed Successfully", "bottom-right");
                                        else if (SaveProcessStatus == "MAN" && $('#btnSave').text().toUpperCase() == "UPDATE MANIFEST")
                                            ShowMessage('success', 'Success -Manifest Updated Successfully', "Processed Successfully", "bottom-right");
                                        else
                                            ShowMessage('success', 'Success -Manifest created Successfully', "Processed Successfully", "bottom-right");
                                        flag = true;
                                    }
                                    else if (ResultStatus == '1')//for Part Shipment
                                    {
                                        var AWBData = ResultValue.split('@')[0];
                                        if (SaveProcessStatus == "PRE_FINAL") {
                                            if (AWBData.length > 2) {
                                                ShowMessage('warning', 'Warning -AWB ' + ResultValue.split('@')[0] + ' is partly planned for Destination City ' + ResultValue.split('@')[1].split(',')[0] + '', 'Part acceptance of Shipments is not allowed at ' + ResultValue.split('@')[1].split(',')[0], "bottom-right");
                                            }
                                        }
                                        else if (SaveProcessStatus == "PRE") {
                                            if (AWBData.length > 2) {
                                                ShowMessage('warning', 'Warning -AWB ' + ResultValue.split('@')[0] + ' is partly planned for Destination City ' + ResultValue.split('@')[1].split(',')[0] + '', 'Part acceptance of Shipments is not allowed at ' + ResultValue.split('@')[1].split(',')[0], "bottom-right");
                                            }
                                        }
                                        else if (SaveProcessStatus == "DEP") {
                                            if (AWBData.length > 2) {
                                                ShowMessage('warning', 'Warning -AWB ' + ResultValue.split('@')[0] + ' is partly planned for Destination City ' + ResultValue.split('@')[1].split(',')[0] + '', 'Part acceptance of Shipments is not allowed at ' + ResultValue.split('@')[1].split(',')[0], "bottom-right");
                                            }
                                        }
                                        else if (SaveProcessStatus == "MAN") {
                                            if (AWBData.length > 2) {
                                                ShowMessage('warning', 'Warning -AWB ' + ResultValue.split('@')[0] + ' is partly planned for Destination City ' + ResultValue.split('@')[1].split(',')[0] + '', 'Part acceptance of Shipments is not allowed at ' + ResultValue.split('@')[1].split(',')[0], "bottom-right");
                                            }
                                        }
                                        else
                                            ShowMessage('warning', 'Warning -Process could not be completed ', " ", "bottom-right");
                                        flag = false;
                                    }
                                    else if (ResultStatus == '8')//For Hold Manifest Shipment
                                    {
                                        var msgString = '';
                                        var AWBArray = ResultValue.split('@')[0];
                                        var HOLDRemarksArray = ResultValue.split('@')[1];
                                        $(AWBArray.split('^')).each(function (r, i) {
                                            msgString = msgString + '<tr><td>' + i + ',' + HOLDRemarksArray.split('^')[r] + '</td></tr>';
                                        });
                                        msgString = '<table>' + msgString + '</table>';

                                        ShowMessage('warning', 'Warning -Shipment ', 'Few pieces of shipments ' + msgString + '.Kindly cross check and plan the remaining pieces accordingly', "bottom-right");
                                        //ShowMessage('warning', 'Warning -Shipment on Hold', " ", "bottom-right");
                                        flag = false;
                                    }
                                    else if (ResultStatus == '9')//For CTM Charge
                                    {
                                        var msgString = '';
                                        var AWBArray = ResultValue.split('@')[1];
                                        var ChargeRemarksArray = ResultValue.split('@')[0];
                                        //$(AWBArray.split('^')).each(function (r, i) {
                                        //    msgString = msgString + '<tr><td>' + i + ',' + ChargeRemarksArray.split('^')[r] + '</td></tr>';
                                        //});
                                        msgString = ChargeRemarksArray + '' + AWBArray;

                                        ShowMessage('warning', 'Warning -Shipment ', msgString, "bottom-right");
                                        //ShowMessage('warning', 'Warning -Shipment on Hold', " ", "bottom-right");
                                        flag = false;
                                    }
                                    else if (ResultStatus == '3')//For Gross Weight Exceed
                                    {
                                        if (SaveProcessStatus == "DEP") {
                                            ShowMessage('warning', 'Warning -Flight could not be departed', "Gross Weight Exceed ! ", "bottom-right");
                                        }
                                        else if (SaveProcessStatus == "MAN") {
                                            ShowMessage('warning', 'Warning -Manifest could not be created ', "Gross Weight Exceed ! ", "bottom-right");
                                        }
                                        flag = false;
                                    }
                                    else if (ResultStatus == '4')//For Volumn Weight Exceed
                                    {
                                        if (SaveProcessStatus == "DEP") {
                                            ShowMessage('warning', 'Warning -Flight could not be departed', "Volume Weight Exceed ! ", "bottom-right");
                                        }
                                        else if (SaveProcessStatus == "MAN") {
                                            ShowMessage('warning', 'Warning -Manifest could not be created ', "Volume Weight Exceed ! ", "bottom-right");
                                        }
                                        flag = false;
                                    }
                                    else if (ResultStatus == '5')//For RFS Truck ULD Exceed
                                    {
                                        if (SaveProcessStatus == "PRE" || SaveProcessStatus == "PRE_FINAL") {
                                            ShowMessage('warning', "Warning", "Maximum 11 ULD's allowed for RFS/Truck", "bottom-right");
                                        }
                                        flag = false;
                                    }
                                    else if (ResultStatus == '6')//For UWS Not Created
                                    {
                                        if (SaveProcessStatus == "DEP") {
                                            // ShowMessage('warning', "Warning", "UWS Incomplete for " + ResultValue + "</br>Kindly check again", "bottom-right");
                                            ShowMessage('warning', "Warning", ResultValue, "bottom-right");
                                            $("#cfMessage-container").css("margin-top", setshowmsg(ResultValue) + "%");
                                        }
                                        flag = false;
                                    }
                                    else if (ResultStatus == "7")//for CargoClassification 'PAX' Check with 'CAO'
                                    {
                                        ShowMessage('warning', "Warning ", "AWB '" + ResultValue + "' with SHC-CAO ( Cargo Aircraft only ) not allowed on Passenger Flight '" + $("#tdFlightNo").text() + "'/" + $("#tdFlightDate").text() + "", "bottom-right");

                                    }
                                    else if (ResultStatus == "10")//for comman Message
                                    {
                                        ShowMessage('warning', "Warning ", ResultValue, "bottom-right");
                                        flag = false;
                                    }
                                    else {
                                        ShowMessage('warning', 'Warning -Process could not be completed ', " ", "bottom-right");
                                        flag = false;
                                    }
                                },
                                error: function (xhr) {
                                    if (SaveProcessStatus == "PRE_FINAL")
                                        ShowMessage('warning', 'Warning -Pre Manifest could not be created ', " ", "bottom-right");
                                    else if (SaveProcessStatus == "PRE")
                                        ShowMessage('warning', 'Warning -Pre Manifest could not be created ', " ", "bottom-right");
                                    else if (SaveProcessStatus == "DEP")
                                        ShowMessage('warning', 'Warning -Flight could not be departed', " ", "bottom-right");
                                    else
                                        ShowMessage('warning', 'Warning -Manifest could not be created ', " ", "bottom-right");
                                    flag = false;
                                }
                            });
                            // }
                        }
                        else {
                            $.ajax({
                                url: "Services/FlightControl/FlightControlService.svc/" + FunctionName, async: false, type: "POST", dataType: "json", cache: false,
                                data: postData,
                                contentType: "application/json; charset=utf-8",
                                success: function (result) {
                                    var ResultStatus = result.split('?')[0];
                                    var ResultValue = result.split('?')[1];
                                    if (ResultStatus == "0" || ResultStatus == "2") {
                                        if (ResultStatus == '2')//For Hold Shipment
                                        {
                                            var msgString = '';
                                            var AWBArray = ResultValue.split('@')[0];
                                            var HOLDRemarksArray = ResultValue.split('@')[1];
                                            $(AWBArray.split('^')).each(function (r, i) {
                                                msgString = msgString + '<tr><td>' + i + ',' + HOLDRemarksArray.split('^')[r] + '</td></tr>';
                                            });
                                            msgString = '<table>' + msgString + '</table>';

                                            ShowMessage('warning', 'Warning -Shipment ', msgString, "bottom-right");
                                            //ShowMessage('warning', 'Warning -Shipment on Hold', " ", "bottom-right");
                                            flag = false;
                                        }
                                        if (SaveProcessStatus == "PRE_FINAL")
                                            ShowMessage('success', 'Success -Pre Manifest Created Successfully', "Processed Successfully", "bottom-right");
                                        else if (SaveProcessStatus == "PRE")
                                            ShowMessage('success', 'Success -Pre Manifest created Successfully', "Processed Successfully", "bottom-right");
                                        else if (SaveProcessStatus == "DEP")
                                            ShowMessage('success', 'Success -Flight Departed Successfully', "Processed Successfully", "bottom-right");
                                        else if (SaveProcessStatus == "MAN" && $('#btnSave').text().toUpperCase() == "UPDATE MANIFEST")
                                            ShowMessage('success', 'Success -Manifest Updated Successfully', "Processed Successfully", "bottom-right");
                                        else
                                            ShowMessage('success', 'Success -Manifest created Successfully', "Processed Successfully", "bottom-right");
                                        flag = true;
                                    }
                                    else if (ResultStatus == '1')//for Part Shipment
                                    {
                                        var AWBData = ResultValue.split('@')[0];
                                        if (SaveProcessStatus == "PRE_FINAL") {
                                            if (AWBData.length > 2) {
                                                ShowMessage('warning', 'Warning -AWB ' + ResultValue.split('@')[0] + ' is partly planned for Destination City ' + ResultValue.split('@')[1].split(',')[0] + '', 'Part acceptance of Shipments is not allowed at ' + ResultValue.split('@')[1].split(',')[0], "bottom-right");
                                            }
                                        }
                                        else if (SaveProcessStatus == "PRE") {
                                            if (AWBData.length > 2) {
                                                ShowMessage('warning', 'Warning -AWB ' + ResultValue.split('@')[0] + ' is partly planned for Destination City ' + ResultValue.split('@')[1].split(',')[0] + '', 'Part acceptance of Shipments is not allowed at ' + ResultValue.split('@')[1].split(',')[0], "bottom-right");
                                            }
                                        }
                                        else if (SaveProcessStatus == "DEP") {
                                            if (AWBData.length > 2) {
                                                ShowMessage('warning', 'Warning -AWB ' + ResultValue.split('@')[0] + ' is partly planned for Destination City ' + ResultValue.split('@')[1].split(',')[0] + '', 'Part acceptance of Shipments is not allowed at ' + ResultValue.split('@')[1].split(',')[0], "bottom-right");
                                            }
                                        }
                                        else if (SaveProcessStatus == "MAN") {
                                            if (AWBData.length > 2) {
                                                ShowMessage('warning', 'Warning -AWB ' + ResultValue.split('@')[0] + ' is partly planned for Destination City ' + ResultValue.split('@')[1].split(',')[0] + '', 'Part acceptance of Shipments is not allowed at ' + ResultValue.split('@')[1].split(',')[0], "bottom-right");
                                            }
                                        }
                                        else
                                            ShowMessage('warning', 'Warning -Process could not be completed ', " ", "bottom-right");
                                        flag = false;
                                    }
                                    else if (ResultStatus == '8')//For Hold Manifest Shipment
                                    {
                                        var msgString = '';
                                        var AWBArray = ResultValue.split('@')[0];
                                        var HOLDRemarksArray = ResultValue.split('@')[1];
                                        $(AWBArray.split('^')).each(function (r, i) {
                                            msgString = msgString + '<tr><td> ' + i + '' + HOLDRemarksArray.split('^')[r] + '</td></tr>';
                                        });
                                        msgString = '<table>' + msgString + '</table>';

                                        // ShowMessage('warning', 'Warning -Shipment ', msgString, "bottom-right");
                                        ShowMessage('warning', 'Warning -Shipment ', 'Few pieces of shipments ' + msgString + ' Kindly cross check and plan the remaining pieces accordingly', "bottom-right");
                                        flag = false;
                                    }
                                    else if (ResultStatus == '9')//For CTM Charge
                                    {
                                        var msgString = '';
                                        var AWBArray = ResultValue.split('@')[0];
                                        var ChargeRemarksArray = ResultValue.split('@')[1];
                                        $(AWBArray.split('^')).each(function (r, i) {
                                            msgString = msgString + '<tr><td>' + i + ',' + ChargeRemarksArray.split('^')[r] + '</td></tr>';
                                        });
                                        msgString = '<table>' + msgString + '</table>';

                                        ShowMessage('warning', 'Warning -Shipment ', msgString, "bottom-right");
                                        //ShowMessage('warning', 'Warning -Shipment on Hold', " ", "bottom-right");
                                        flag = false;
                                    }
                                    else if (ResultStatus == '3')//For Gross Weight Exceed
                                    {
                                        if (SaveProcessStatus == "DEP") {
                                            ShowMessage('warning', 'Warning -Flight could not be departed', "Gross Weight Exceed ! ", "bottom-right");
                                        }
                                        else if (SaveProcessStatus == "MAN") {
                                            ShowMessage('warning', 'Warning -Manifest could not be created ', "Gross Weight Exceed ! ", "bottom-right");
                                        }
                                        flag = false;
                                    }
                                    else if (ResultStatus == '4')//For Volumn Weight Exceed
                                    {
                                        if (SaveProcessStatus == "DEP") {
                                            ShowMessage('warning', 'Warning -Flight could not be departed', "Volume Weight Exceed ! ", "bottom-right");
                                        }
                                        else if (SaveProcessStatus == "MAN") {
                                            ShowMessage('warning', 'Warning -Manifest could not be created ', "Volume Weight Exceed ! ", "bottom-right");
                                        }
                                        flag = false;
                                    }
                                    else if (ResultStatus == '5')//For RFS Truck ULD Exceed
                                    {
                                        if (SaveProcessStatus == "PRE" || SaveProcessStatus == "PRE_FINAL") {
                                            ShowMessage('warning', "Warning", "Maximum 11 ULD's allowed for RFS/Truck", "bottom-right");
                                        }
                                        flag = false;
                                    }
                                    else if (ResultStatus == '6')//For UWS Not Created
                                    {
                                        if (SaveProcessStatus == "MAN") {
                                            ShowMessage('warning', "Warning", ResultValue);
                                            $("#cfMessage-container").css("margin-top", setshowmsg(ResultValue) + "%");
                                            // ShowMessage('warning', "Warning", "UWS Incomplete for this flight .  Kindly check again.", "bottom-right");
                                        }
                                        flag = false;
                                    }
                                    else if (ResultStatus == "7")//for CargoClassification 'PAX' Check with 'CAO'
                                    {
                                        ShowMessage('warning', "Warning ", "AWB '" + ResultValue + "' with SHC-CAO ( Cargo Aircraft only ) not allowed on Passenger Flight '" + $("#tdFlightNo").text() + "'/" + $("#tdFlightDate").text() + "", "bottom-right");

                                    }
                                    else if (ResultStatus == "10")//for comman Message
                                    {
                                        ShowMessage('warning', "Warning ", ResultValue, "bottom-right");
                                        flag = false;
                                    }
                                    else {
                                        ShowMessage('warning', 'Warning -Process could not be completed ', " ", "bottom-right");
                                        flag = false;
                                    }


                                },
                                error: function (xhr) {
                                    if (SaveProcessStatus == "PRE_FINAL")
                                        ShowMessage('warning', 'Warning -Pre Manifest could not be created ', " ", "bottom-right");
                                    else if (SaveProcessStatus == "PRE")
                                        ShowMessage('warning', 'Warning -Pre Manifest could not be created ', " ", "bottom-right");
                                    else if (SaveProcessStatus == "DEP")
                                        ShowMessage('warning', 'Warning -Flight could not be departed', " ", "bottom-right");
                                    else
                                        ShowMessage('warning', 'Warning -Manifest could not be created ', " ", "bottom-right");
                                    flag = false;
                                }
                            });
                        }

                    }
                }
                else {
                    if (SaveProcessStatus == "PRE_FINAL")
                        ShowMessage('warning', 'Warning -Select a shipment to prepare Pre Manifest', " ", "bottom-right");
                    else if (SaveProcessStatus == "PRE")
                        ShowMessage('warning', 'Warning -Select a shipment to prepare Pre Manifest', " ", "bottom-right");
                    else if (SaveProcessStatus == "DEP")
                        ShowMessage('warning', 'Warning - Select a shipment to prepare Flight depart', " ", "bottom-right");
                    else {
                        if (FlightStatus != 'MAN' && ManageCTMStatus == "MAN")
                            ShowMessage('warning', 'Warning ', "Manifest has not been prepared. Cannot proceed with Update of Manifest ", "bottom-right");
                        else
                            ShowMessage('warning', 'Warning -Select a shipment to prepare Manifest', " ", "bottom-right");

                    }
                    flag = false;
                }
            }
            else {
                ShowMessage('warning', 'Warning -Selected flight has already departed', " ", "bottom-right");
                flag = false;
            }
        }
    return flag;

}

function SaveManifestLyingInfo(mode) {

    var flag = false;
    var chkSelect = false;
    var IntectShipArray = new Array();
    var BulkShipArray = new Array();
    if (FlightCloseFlag != "DEP") {

        $('#divDetail table tbody tr[class~="k-master-row"]').each(function (row, tr) {
            var Rowtr = $(tr).closest("div.k-grid").find("div.k-grid-header");
            var ULDStockSNoIndex = Rowtr.find("th[data-field='ULDStockSNo']").index();
            var ULDNoIndex = Rowtr.find("th[data-field='ULDNo']").index();
            var SelectIndex = Rowtr.find("th[data-field='isSelect']").index();
            var DailyFlightSNo = $('#hdnFlightSNo').val();
            var isSelect = $(tr).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked');

            if ($(tr).find('td:eq(' + ULDNoIndex + ')').text() == "BULK") {

                var nestedGridHeader = $(tr).next().find("div.k-grid-header");
                var nestedGridContent = $(tr).next().find("div.k-grid-content");
                var AWBSNoIndex = nestedGridHeader.find("th[data-field='AWBSNo']").index();
                var IsBulkIndex = nestedGridHeader.find("th[data-field='Bulk']").index();

                var PiecesIndex = nestedGridHeader.find("th[data-field='TotalPieces']").index();
                var PlannedPiecesIndex = nestedGridHeader.find("th[data-field='PlannedPieces']").index();
                var ActG_V_CBMIndex = nestedGridHeader.find("th[data-field='ActG_V_CBM']").index();
                var PlanG_V_CBMIndex = nestedGridHeader.find("th[data-field='PlanG_V_CBM']").index();
                var SHCIndex = nestedGridHeader.find("th[data-field='SHC']").index();
                var AgentIndex = nestedGridHeader.find("th[data-field='Agent']").index();

                $(nestedGridContent).each(function (row1, tr1) {
                    if ($(tr1).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]').prop('checked')) {
                        chkSelect = true;

                        var AG = $(tr1).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[0];
                        var AV = $(tr1).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[1];
                        var ACBM = $(tr1).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[2];
                        var PG = $(tr1).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val();
                        var PV = $(tr1).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val();
                        var PCBM = $(tr1).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val();
                        BulkShipArray.push({
                            isBulk: $(tr1).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]').prop('checked'),
                            AWBSNo: $(tr1).find('td:eq(' + AWBSNoIndex + ')').text(),
                            DailyFlightSNo: DailyFlightSNo,
                            TotalPieces: $(tr1).find('td:eq(' + PiecesIndex + ')').text(),
                            PlannedPieces: $(tr1).find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val(),
                            ActualVolumeWt: AV,
                            ActualGrossWt: AG,
                            ActualCBM: ACBM,
                            PlannedGrossWt: PG,
                            PlannedVolumeWt: PV,
                            PlannedCBM: PCBM,

                            ULDStockSNo: $(tr).find('td:eq(' + ULDStockSNoIndex + ')').text(),
                            MovementType: 2,
                            // SHC: $(tr1).find('td:eq(' + SHCIndex + ')').text(),
                            // Agent: $(tr1).find('td:eq(' + AgentIndex + ')').text(),
                            UpdatedBy: 2
                        });
                    }
                });

            }
            else {
                if (isSelect) {
                    chkSelect = true;

                    IntectShipArray.push({
                        isSelect: isSelect,
                        DailyFlightSNo: DailyFlightSNo,
                        ULDStockSNo: $(tr).find('td:eq(' + ULDStockSNoIndex + ')').text(),
                        UpdatedBy: 2
                    });
                }
            }

        });
        //  console.log(JSON.stringify(ManifestArray))if (FlightCloseFlag == 'BUP') {;
        // alert(JSON.stringify(BulkShipArray));
        // alert(JSON.stringify(IntectShipArray));
        var FunctionName = '';// FlightStatusFlag == "1_2_0_0" ? "SavePMenifestInformation" : "SaveMenifestInformation";
        if (FlightCloseFlag == 'BUP') {
            FunctionName = "SavePMenifestInformation";
        }
        else if (FlightCloseFlag == "PRE" && mode == "LYINGLIST") {
            FunctionName = "SavePMenifestInformation";
        }
        else {
            FunctionName = "SaveMenifestInformation";
        }

        if (chkSelect) {
            $.ajax({
                url: "Services/FlightControl/FlightControlService.svc/" + FunctionName, async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ BulkShipmentInfo: BulkShipArray, IntectShipmentInfo: IntectShipArray, mode: mode }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result == "0") {
                        ShowMessage('success', 'Success -Lying List created successfully', "Processed Successfully", "bottom-right");
                        flag = true;
                    }
                    else {
                        ShowMessage('warning', 'Warning -Lying List could not be created ', " ", "bottom-right");
                        flag = false;
                    }
                },
                error: function (xhr) {
                    ShowMessage('warning', 'Warning -Lying List could not be created ', " ", "bottom-right");
                    flag = false;
                }
            });
        }
        else {
            ShowMessage('warning', 'Warning - Select a shipment to prepare Lying List', " ", "bottom-right");
            flag = false;
        }
    }
    else {
        ShowMessage('warning', 'Warning -selected flight has departed', " ", "bottom-right");
        flag = false;
    }
    return flag;
}
var CurrentRowHidden;
function fun_Remarks(e) {
    CurrentRowHidden = e;
    //  alert($(e).parent().html());

    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetWebForm/FlightControl/FlightControl/AWBRemarks/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divDetailPop").html(result);

            $('#Remarks').val($(e).parent().find('input[type=hidden]').val() == "Add" ? "" : $(e).parent().find('input[type=hidden]').val());
            cfi.PopUp("__divawbremarks__", "AWB Remarks");
            $('.k-window').closest("div:hidden").remove();

        },
        beforeSend: function (jqXHR, settings) {
        },
        complete: function (jqXHR, textStatus) {
        },
        error: function (xhr) {
            var a = "";
        }
    });


}


function fn_AddManifestRemarks(e) {
    GetManifestRemarks();
    //$.ajax({
    //    url: "Services/FlightControl/FlightControlService.svc/GetWebForm/FlightControl/FlightControl/ManifestRemarks/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
    //    success: function (result) {
    //        $("#divManifestRemarksPop").html(result);
    //        GetManifestRemarks();
    //        cfi.PopUp("__divmanifestremarks__", "Manifest Remarks");
    //        $('.k-window').closest("div:hidden").remove();
    //    },
    //    beforeSend: function (jqXHR, settings) {
    //    },
    //    complete: function (jqXHR, textStatus) {
    //    },
    //    error: function (xhr) {
    //        var a = "";
    //    }
    //});


}

function fn_AddOSI(e) {
    // alert("Test");
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetWebForm/FlightControl/FlightControl/ManifestOSI/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {

            $("#divDetailPop").html(result);
            GetManifestOSIDetails();
            cfi.PopUp("__divmanifestosi__", "OSI Details");
            $('.k-window').closest("div:hidden").remove();
        },
        beforeSend: function (jqXHR, settings) {
        },
        complete: function (jqXHR, textStatus) {
        },
        error: function (xhr) {
            var a = "";
        }
    });


}


function GetManifestOSIDetails() {
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetManifestOSIDetails?DFGroupSNo=" + CurrentFlightSno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            // alert(result);
            var ResultData = jQuery.parseJSON(result);
            var Data = ResultData.Table0;
            // alert(Data.OSI1);
            if (Data.length > 0) {
                //alert(ResultData.OSI1);
                $('#txtManifestOSI_1').val(Data[0].OSI1);
                $('#txtManifestOSI_2').val(Data[0].OSI2);

            }

            if (FlightCloseFlag == "DEP") {
                $("#__divmanifestosi__").find("input[type='button']").remove();
                $("#txtManifestOSI_1").replaceWith('<label name="txtManifestOSI_1" id="txtManifestOSI_1">' + $("#txtManifestOSI_1").val().toUpperCase() + '</label>');
                $("#txtManifestOSI_2").replaceWith('<label name="txtManifestOSI_2" id="txtManifestOSI_2">' + $("#txtManifestOSI_2").val().toUpperCase() + '</label>');

            }

        }
    });
}

function GetManifestRemarks() {
    var DelayRemarks = '<table id="recordTbl" style="width:100%; margin:0; padding:0; border-collapse:collapse;text-align:center;">  <tbody><tr style="background-color:#b3b3b3; font-weight:bold; border:1px solid black;">                                            <td style="width:7%;">Delay Code</td>                                            <td style="width:7%;">Delay Sub Code</td>                                            <td style="width:12%;">Delay Code Description</td>                                            <td style="width:15%;">Estimated Time of Departure(hrs)</td>                                            <td style="width:12%;  ">Estimated Take Off(hrs)</td>                                                           <td style="width:15%;">Estimated Time of Arrival(hrs)</td>                                            <td style="width:10%;">Actual Departure-Chokes Off(hrs)</td><td style="width:10%;">Actual Departure- Airborne(hrs)</td><td style="width:10%;">Supplementary Information</td></tr>';

    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetManifestRemarks?DFGroupSNo=" + CurrentFlightSno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            var FinalData = ResultData.Table0;
            if (FinalData.length > 0) {
                $(FinalData).each(function (row, tr) {
                    DelayRemarks = DelayRemarks + '<tr style="border:1px solid black;"><td style="width:8%;">' + tr.DelayCode + '</td><td style="width:5%;">' + tr.DelaySubCode + '</td><td style="width:3%;">' + tr.DelayCodeDescription + '</td><td style="width:3%;">' + tr.EstimatedTimeofDeparture + '</td><td style="width:3%;">' + tr.EstimatedTakeOff + '</td><td style="width:3%;" >' + tr.EstimatedTimeofArrival + '</td><td style="width:3%;" >' + tr.ActualDepartureChokesOff + '</td><td style="width:3%;" >' + tr.ActualDepartureAirborne + '</td><td style="width:3%;" >' + tr.SupplementaryInformation + '</td></tr>';
                });
            }
            DelayRemarks = DelayRemarks + '</tbody></table>';

            $('#divFltDetails').html(DelayRemarks);
            // $('#ManifestRemarks').val(FinalData[0].ManifestRemarks);
            cfi.PopUp("divFltDetails", "Delay Remarks");
            $('.k-window').closest("div").css("width", "1000px");




        }
    });
}

function SaveManifestOSI(e) {
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/saveOSIDetails", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ DFGroupSNo: CurrentFlightSno, OSI1: $('#txtManifestOSI_1').val(), OSI2: $('#txtManifestOSI_2').val() }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#__divmanifestosi__").data("kendoWindow").close();
        },
    });



}
function SaveManifestRemarks(e) {
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/saveManifestRemarksDetails", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ DFGroupSNo: CurrentFlightSno, Remarks: $('#ManifestRemarks').val() }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#__divmanifestremarks__").data("kendoWindow").close();
        },
    });



}

function GetStopOverFlightULDDetails() {
    ShowIndexView("divStopOverDetail", "Services/FlightControl/FlightControlService.svc/GetFlightTransGridData/FLIGHTCONTROL/FlightControl/STOPOVERFLIGHT/" + CurrentFlightSno + "/SOFLIGHT");
}
var OffloadDest;
var IsOffloadPopup = false;
function fn_ResetDestVal(e) {
    OffloadDest = $('#' + e).val();
}
function fn_OnCancel() {
    $("#divFlightTransfer").data("kendoWindow").close();
}
function fn_CreateAndvalidateNIL() {
    // fn_OnCancel();
    /*
    var FlightDest = FlightDestination.split('-');
    var CurrentCityIndex = FlightDest.indexOf(userContext.AirportCode);
    if (FlightDest.length > 2) {
        $("#__divflighttransfer__").data("kendoWindow").close();
        $.ajax({
            url: "Services/FlightControl/FlightControlService.svc/GetWebForm/FlightControl/FlightControl/NILManifestSector/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#divDetailPop").html(result);
                IsOffloadPopup = true;
                var OffloadCity = new Array();
                $(FlightDest).each(function (row, i) {
                    if (row == 0)
                        OffloadCity.push({ Key: "ALL", Text: "ALL" });
                    if (row > CurrentCityIndex)
                        OffloadCity.push({ Key: userContext.AirportCode + "-" + i, Text: userContext.AirportCode + "-" + i })
                })
                cfi.AutoCompleteByDataSource("txtNILDestinationCity", OffloadCity, fn_ResetDestVal);
                cfi.PopUp("__divnilmanifestsector__", "Select NIL Manifest Sector");
                $('.k-window').closest("div:hidden").remove();
            },
            beforeSend: function (jqXHR, settings) {
            },
            complete: function (jqXHR, textStatus) {
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }
    else {
    OffloadDest = FlightDestination;
    */
    OffloadDest = "ALL"; //FlightDestination;
    fn_SaveNILManifest();
    // }
}
function fn_SaveNILManifest() {

    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/SaveNILMenifest", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ GroupFlightSNo: CurrentFlightSno, FlightOrigin: FlightOrigin, FlightDestination: OffloadDest, FlightStatus: FlightStatus, RegistrationNo: $("#RegistrationNo").val() }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "0") {
                if (IsOffloadPopup)
                    $("#__divnilmanifestsector__").data("kendoWindow").close();

                ShowMessage('success', 'Success -NIL Manifest created successfully', "Processed Successfully", "bottom-right");
                FlightSearch();
                flag = true;
                $("#__divflighttransfer__").data("kendoWindow").close();
            }
            else {
                ShowMessage('warning', 'Warning - NIL Manifest could not be created', " ", "bottom-right");
                flag = false;
            }
        }

    });


}
function fn_SaveTransitNILManifest() {
    if ($('#Text_txtNILDestinationCity').val() != "")
        fn_SaveNILManifest();
    else
        ShowMessage('warning', 'Warning -Please Select Destination City', " ", "bottom-right");
}
function fn_PrintNILManifest() {
    $.ajax({
        url: "HtmlFiles/Export/NilManifest.html", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divDetail").html(result);
            $('#FirstTab').text('NILManifest');
            $('#SecondTab').hide();
            $('#OSCTab').hide();
            $('#divAction').hide();
            $("#tabstrip").kendoTabStrip();
            $.ajax({
                url: "Services/FlightControl/FlightControlService.svc/GetFlightData?DailyFlightSno=" + CurrentFlightSno, async: false, type: "get", dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var ResultData = jQuery.parseJSON(result);
                    var FinalData = ResultData.Table0;
                    if (FinalData.length > 0) {
                        $('#spnOwner').text(FinalData[0].airlinename)
                        $('#spnFlifgtNo').text(FinalData[0].FlightNo)
                        $('#spnFlightDate').text(FinalData[0].FlightDate)
                        $('#spnPointOfLoading').text(FinalData[0].OriginCity)
                        $('#spnPointOfUnloading').text(FinalData[0].DestinationCity)
                        $('#spnRes').text(FinalData[0].RegistrationNo)

                        $("#btnPrint").unbind("click").bind("click", function () {
                            //  alert($("#divDetailPrint").html());
                            $("#divDetailPrint #divDetail").printArea();
                        });
                    }
                }
            })

        },
        beforeSend: function (jqXHR, settings) {
        },
        complete: function (jqXHR, textStatus) {
        },
        error: function (xhr) {
            // var a = "";
        }
    });

}
function ResetSelectedFlight() {
    $("#Text_FlightNo").data("kendoAutoComplete").value("");
    $("#Text_FlightNo").data("kendoAutoComplete").key("");
}
function fn_TransferFlightXML() {
    // fn_OnCancel();
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetWebForm/FlightControl/FlightControl/FlightTransfer/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divDetailPop").html(result);
            $('#btnTransfer').closest('td').attr('colspan', 2);
            $('#CreateNILManifest').closest('td').attr('colspan', 2);
            $('#FlightTransfer').closest('td').attr('colspan', 2);
            $('#FlightTransfer').closest('tr').find('td[class="formthreelabel"]').remove();

            cfi.PopUp("__divflighttransfer__", "Flight Transfer Details");
            $("#FlightDate").kendoDatePicker();
            $("span[id=FlightOrigin]").text(userContext.AirportCode);
            $("#FlightDate").data("kendoDatePicker").value($("#tdFlightDate").text());
            cfi.AutoCompleteV2("FlightNo", "FlightNo", "GatePass_FlightNoRCS", null, "contains");
            $('#FlightDate').unbind("change").bind('change', function () { ResetSelectedFlight(); });
            $('.k-window').closest("div:hidden").remove();
        },
        beforeSend: function (jqXHR, settings) {
        },
        complete: function (jqXHR, textStatus) {
        },
        error: function (xhr) {
            var a = "";
        }
    });
}
function fn_ValidateNILManifest(e) {

    if (IsNILManifested == "true") {

        fn_PrintNILManifest();
    }
    else {
        if ($("#RegistrationNo").val() != "") {

            $('#btnTransfer').hide();
            $('#FlightTransfer').hide();
            if (FlightStatus == "PRE" || FlightStatus == "MAN" || FlightStatus == "BUILD UP") {
                fn_TransferFlightXML();
                $('#btnTransfer').show();
                $('#FlightTransfer').show();
            }
            else if (FlightStatus.toLowerCase() == "open" || FlightStatus.toLowerCase() == "li") {
                var r = jConfirm("Are you sure you want to create NIL Manifest ?", "", function (r) {
                    if (r == true) {
                        fn_CreateAndvalidateNIL();
                        FlightSearch();
                    }
                });

            }
            $("#spntdFlightNo").text($("#tdFlightNo").text());
        }
        else {
            ShowMessage('warning', 'Warning -Please Enter Aircraft Registration No.', " ", "bottom-right");
        }
    }
}
function fn_UpdateFlightTransfer(input, ProcessType) {
    var OFLD_AWBSNo = "-1", TR_AWBSNo = "-1", TR_UldStockSNo = "-1", OFLD_UldStockSNo = "-1";

    if ($("#Text_FlightNo").data("kendoAutoComplete").key() != "") {
        /////////////////////////////
        $('#divDetail table tbody tr[class~="k-master-row"]').each(function (row, tr) {
            var Rowtr = $(tr).closest("div.k-grid").find("div.k-grid-header:first");
            var ULDStockSNoIndex = Rowtr.find("th[data-field='ULDStockSNo']").index();
            var ULDNoIndex = Rowtr.find("th[data-field='ULDNo']").index();
            var SelectIndex = Rowtr.find("th[data-field='isSelect']").index();
            var isSelect = $(tr).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked');
            if ($(tr).find('td:eq(' + ULDNoIndex + ')').text() == "BULK") {
                var nestedGridHeader = $(tr).next().find("div.k-grid-header");
                var nestedGridContent = $(tr).next().find("div.k-grid-content > table > tbody  tr");
                var AWBSNoIndex = nestedGridHeader.find("th[data-field='AWBSNo']").index();
                var IsBulkIndex = nestedGridHeader.find("th[data-field='Bulk']").index();
                $(nestedGridContent).each(function (row1, tr1) {
                    if ($(tr1).find('td:eq(' + IsBulkIndex + ') input[type=checkbox]').prop('checked')) {
                        TR_AWBSNo = TR_AWBSNo + "," + $(tr1).find('td:eq(' + AWBSNoIndex + ')').text();
                    }
                    else {
                        OFLD_AWBSNo = OFLD_AWBSNo + "," + $(tr1).find('td:eq(' + AWBSNoIndex + ')').text();
                    }
                });
            }
            else {
                if (isSelect)
                    TR_UldStockSNo = TR_UldStockSNo + "," + $(tr).find('td:eq(' + ULDStockSNoIndex + ')').text();
                else
                    OFLD_UldStockSNo = OFLD_UldStockSNo + "," + $(tr).find('td:eq(' + ULDStockSNoIndex + ')').text();
            }
        });
        //////////////////////////////

        $.ajax({
            url: "Services/FlightControl/FlightControlService.svc/UpdateTransferFlight", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ OLDGroupFlightSNo: CurrentFlightSno, NewDailyFlightSno: $("#Text_FlightNo").data("kendoAutoComplete").key(), OFLD_AWBSNo: OFLD_AWBSNo, TR_AWBSNo: TR_AWBSNo, TR_UldStockSNo: TR_UldStockSNo, OFLD_UldStockSNo: OFLD_UldStockSNo, ProcessType: ProcessType }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "0") {
                    ShowMessage('success', 'Success - All selected shipments have been transferred from ' + $("#tdFlightNo").text() + "/" + $("#tdFlightDate").text() + " to " + $("#Text_FlightNo").val() + "/" + $("#tdFlightDate").text() + ' successfully', "Processed Successfully", "bottom-right");
                    var FlightDest = FlightDestination.split('-');
                    if (FlightDest.length > 2)
                        OffloadDest = "ALL"
                    else
                        OffloadDest = FlightDestination;

                    if ((OFLD_AWBSNo == "-1" && OFLD_UldStockSNo == "-1") || ProcessType == 1)
                        fn_SaveNILManifest();
                    $("#__divflighttransfer__").data("kendoWindow").close();
                    FlightSearch();
                    flag = true;
                }
                else {
                    ShowMessage('warning', 'Warning - Flight transfer Process could not be completed', " ", "bottom-right");
                    flag = false;
                }
            }

        });

    }
    else {
        ShowMessage('warning', 'Warning -Please Select FlightNo ', " ", "bottom-right");
    }
}

function SaveAWBRemarks(e) {

    $(CurrentRowHidden).parent().find('input[type=hidden]').val($('#Remarks').val());
    $(CurrentRowHidden).parent().find('a').text($('#Remarks').val());
    $("#__divawbremarks__").data("kendoWindow").close();


}

//For Manage LI GrossWT
//For manage Li Calculation
function Get_ManageLICal(input) {
    fn_Cal_GVCBM1(input);
    ////var RemainingGWT = 0, RemainingVWT = 0, RemainingCBMWT = 0;
    //var flag = false;
    //var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    //var TotalPcsIndex = trRow.find("th[data-field='TotalPieces']").index();
    //var PlannedPiecesIndex = trRow.find("th[data-field='PlannedPieces']").index();
    //var hdnTotalPiecesIndex = trRow.find("th[data-field='hdnTotalPieces']").index();
    //var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    //var PlanG_V_CBMIndex = trRow.find("th[data-field='PlanG_V_CBM']").index();
    //var ActualG_V_CBM = $(input).closest('tr').find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
    //var PG = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    //var PV = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    //var PCBM = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');
    //var AWBNOIndex = trRow.find("th[data-field='AWBNo']").index();
    //var CurrentAWBNo = $(input).closest('tr').find('td:eq(' + AWBNOIndex + ')').text();
    //if ($(input).val() != "") {
    //    var RemainingGWT = 0, RemainingVWT = 0, RemainingCBMWT = 0, PlannedActualVWT = 0, PlannedActualGWT = 0, PlannedActualCBMWT = 0,PlanPCs=0;
    //    var row_index = $(input).closest('tr').index();
    //    $(input).closest('tbody').find("tr").each(function (row, tr) {
    //        if ($(tr).find('td:eq(' + AWBNOIndex + ')').text() == CurrentAWBNo) {
    //            if (row != row_index) {
    //                PlannedActualGWT = PlannedActualGWT + parseInt($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val());
    //                PlannedActualVWT = PlannedActualVWT + parseInt($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val());
    //                PlannedActualCBMWT = PlannedActualCBMWT + parseInt($(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val());
    //                PlanPCs = PlanPCs + parseInt($(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val());
    //            }
    //            //PlannedPcs = PlannedPcs + parseInt($(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val());
    //        }
    //    });
    //    RemainingGWT = parseFloat(ActualG_V_CBM[0]) - parseFloat(PlannedActualGWT);
    //    //RemainingVWT=parseFloat(ActualG_V_CBM[1])-parseFloat(PlannedActualVWT);
    //    //RemainingCBMWT=parseFloat(ActualG_V_CBM[2])-parseFloat(PlannedActualCBMWT);

    //    if ($.isNumeric($(input).val())) {
    //        if (RemainingGWT < 0) {
    //            ShowMessage('warning', 'Warning -Planned Gross Weight should be less than Total Gross Weight', " ", "bottom-right");
    //            //$(input).val(totalPcs - PlannedActualPcs);
    //            //fn_CalGVCBMForLI(input);
    //            flag = false;
    //        }
    //        else {
    //            $(input).closest('tbody').find("tr").each(function (row, tr) {
    //                if ($(tr).find('td:eq(' + AWBNOIndex + ')').text() == CurrentAWBNo) {
    //                    if (row != row_index) {
    //                        //   $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val(0);
    //                        var trval = parseFloat($(input).val()) + (RemainingGWT /PlanPCs) *(parseFloat($(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val()));
    //                        alert($(input).val() + " " + RemainingGWT + " " + PlanPCs + " " + $(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type="text"]').val());
    //                        $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val(trval);
    //                    }
    //                }
    //            });
    //        }
    //    }
    //    else {
    //        ShowMessage('warning', 'Warning - Enter Valid Number ', " ", "bottom-right");
    //        //$(input).val(totalPcs);
    //        flag = false;

    //    }
    //    //Row wt+((rem/Tptal Other)*Each Row Pieces)

    //}

    ////
}
//

//for NOTOC PRINT
function fun_SendNTM() {
    var Sno = CurrentFlightSno;
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/SendNTM?Sno=" + Sno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            ShowMessage('success', "Success -NTM initiation successfully done", null, "bottom-right");
            FlightSearch();
        }
    })
    //$('#divDetail textarea').each(function () {
    //    $(this).replaceWith("<span id=" + $(this).attr("id") + ">" + $(this).val() + "</span>");
    //    // $(this).attr("style","font-size: 10px; font-family: 'Arial Tahoma'; border-bottom: none; font-weight: bold; color: gray;");
    //})
}

function fun_FlightClose() {
    if (IsFlightClosed) {
        ShowMessage('warning', 'Warning', "Flight already Closed", "bottom-right");
        return false;
    }
    else {
        var r = jConfirm("Are you sure,you want to Close Flight ?", "", function (r) {
            if (r == true) {
                $.ajax({
                    url: "Services/FlightControl/FlightControlService.svc/UpdateFlightStatus", async: false, type: "POST", dataType: "json", cache: false,
                    data: JSON.stringify({ DailyFlightSNo: $('#hdnFlightSNo').val() }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        var ResultStatus = result.split('?')[0];
                        var ResultValue = result.split('?')[1];

                        if (ResultStatus == "0") {
                            ShowMessage('success', "Success -Flight Closed Successfully", " ", "bottom-right");
                            FlightSearch();
                        }
                        else if (ResultStatus == "1") {
                            ShowMessage('warning', 'Warning ', ResultValue, "bottom-right");
                        }
                        else {
                            ShowMessage('warning', 'Warning -Flight  could not be closed ', " ", "bottom-right");
                        }
                    },
                });
            }
        });
    }
}


function GetNotocData(sno) {
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetNotocRecord?Sno=" + sno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            var FinalData = ResultData.Table0;
            var FinalData1 = ResultData.Table1;
            var FinalData2 = ResultData.Table2;
            var FinalData3 = ResultData.Table3;
            var FinalData4 = ResultData.Table4;
            if (FinalData2.length > 0) {
                //$('#spnPreparedBy').text(FinalData2[0].PreparedBy);
                $('#spnPreparedBy').text(FinalData2[0].PreparedBy);
                $('#spnOtherInfo').text(FinalData2[0].OtherInfo);
                $('#SpnStationOfLoading').text(FinalData2[0].OriginAirportCode)
                $('#spnFlightNo').text(FinalData2[0].FlightNo)
                $('#spnDate').text(FinalData2[0].FlightDate)
                $('#spnAircraftRegistration').text(FinalData2[0].RegistrationNo.toUpperCase())
            }
            var DGRNotoc = FinalData.length;
            var DgrCount = parseInt(DGRNotoc / 14);
            var DgrCountNext = parseInt(DGRNotoc % 14);
            // DgrCount=2
            var SPCNotoc = FinalData1.length;
            var SpcCount = parseInt(SPCNotoc / 6);
            var SpcCountNext = parseInt(SPCNotoc % 6);
            //if (SpcCount > 1 || DgrCount > 1) {
            if (SpcCount > DgrCount) {
                var div = $('#dinMain0').html();
                $('#dinMain0').after('<br/><div class="page-break" ></div>')
                for (var k = 1; k < SpcCount; k++) {
                    $('#divBreak').before('<div id="dinMain' + k + '">' + div + '</div><br/>')
                    $('#divBreak').before('<div id="divBreak' + k + '" class="page-break" ></div>')
                }
            }
            else if (DgrCount > 1) {
                var div = $('#dinMain0').html();
                $('#dinMain0').after('<br/><div class="page-break" ></div>')
                for (var k = 1; k < DgrCount; k++) {
                    $('#divBreak').before('<div id="dinMain' + k + '">' + div + '</div><br/>')
                    $('#divBreak').before('<div id="divBreak' + k + '" class="page-break" ></div>')

                    //$('#dinMain' + k).html(div);
                    //$('#dinMain' + k).after('<div id="divBreak"'+k +' class="page-break" ></div>')

                }
            }
            else {

            }
            //}
            if (DgrCount >= 1 || SpcCount >= 1) {
                var div = $('#dinMain0').html();
                if (DgrCountNext > 0 || SpcCountNext > 0) {
                    $('#divBreak').before('<div id="dinMain' + k + '">' + div + '</div><br/>')
                    $('#divBreak').before('<div id="divBreak' + k + '" class="page-break" ></div>')
                }
            }



            if (FinalData.length > 0) {
                $('#btn_SendNtm').css('visibility', 'visible')
                $('#td_sendNtm').show();
                var i = 0;
                var j = 0;
                var div1 = 0;
                var wayBill = FinalData[0].AWBNo
                $(FinalData).each(function (row, tr) {

                    if (tr.AWBNo != wayBill) {
                        j = parseInt(j) + 1;
                        wayBill = tr.AWBNo
                    }


                    i = parseInt(i) + 1;


                    if (i < 15) {
                        $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnStationOfUnloading' + i + '"]').text(tr.DestinationCity)
                        $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnAwbNo' + i + '"]').text(tr.AWBNo)
                        // $('#spnAwbNo' + i).text(tr.AWBNo)
                        $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnShipperName' + i + '"]').html(tr.ProperShippingName.toUpperCase())
                        // $('#spnShipperName' + i).html(tr.ProperShippingName.toUpperCase())
                        $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnClass' + i + '"]').text(tr.ClassDivSub)
                        // $('#spnClass' + i).text(tr.ClassDivSub)
                        $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnUNNo' + i + '"]').text(tr.UNNo)
                        // $('#spnUNNo' + i).text(tr.UNNo)
                        $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnSubRisk' + i + '"]').text(tr.SubRisk)
                        // $('#spnSubRisk' + i).text(tr.SubRisk)
                        $('#dinMain' + div1 + ' table:eq(1)').find('span[id="SpnNoOfPkj' + i + '"]').text(tr.NoOfPackg)
                        //$('#SpnNoOfPkj' + i).text(tr.NoOfPackg)
                        $('#dinMain' + div1 + ' table:eq(1)').find('span[id="SpnNetQtyTiPerKg' + i + '"]').text(tr.NetQuantity)
                        // $('#SpnNetQtyTiPerKg' + i).text(tr.NetQuantity)
                        $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnRamCat' + i + '"]').text(tr.RAMCategory)
                        // $('#spnRamCat' + i).text(tr.RAMCategory)
                        $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnUnPackingGroup' + i + '"]').text(tr.PackingGroup)
                        // $('#spnUnPackingGroup' + i).text(tr.PackingGroup)
                        if (tr.ImpCode != "") {
                            //$('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnImpCode' + i + '"]').closest('td').css('border', '1px solid black')
                            // $('#spnULDNbr' + i).closest('td').css('border', '1px solid black')
                            $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnImpCode' + i + '"]').closest('td').attr('rowspan', FinalData3[j].AWBCount)
                            for (var a = i + 1; a <= FinalData3[j].AWBCount; a++) {
                                $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnImpCode' + a + '"]').closest('td').remove();
                            }

                            $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnImpCode' + i + '"]').html(tr.ImpCode.replace(/@/g, '<br/><br/>'));
                            //$('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnImpCode' + i + '"]').html(tr.ImpCode.replace(/;/g, ' '));
                        }
                        //$('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnImpCode' + i + '"]').text(tr.ImpCode)
                        // $('#spnImpCode' + i).text(tr.ImpCode)
                        $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnErgCode' + i + '"]').text(tr.ERGN)
                        // $('#spnErgCode' + i).text(tr.ERGN)
                        $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnCaox' + i + '"]').text(tr.CaoX)
                        //$('#spnCaox' + i).text(tr.CaoX)
                        if (tr.CaoX != "") {
                            //$('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnCaox' + i + '"]').closest('td').css('border', '1px solid black')
                            // $('#spnULDNbr' + i).closest('td').css('border', '1px solid black')
                            $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnCaox' + i + '"]').closest('td').attr('rowspan', FinalData3[j].AWBCount)
                            for (var a = i + 1; a <= FinalData3[j].AWBCount; a++) {
                                $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnCaox' + a + '"]').closest('td').remove();
                            }
                            $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnCaox' + i + '"]').html(tr.CaoX.replace(/@/g, '<br/><br/>'));
                            //$('#spnULDNbr' + i).html(tr.ULDNo.replace(/,/g, '<br/><br/>'));
                        }

                        if (tr.ULDNo != "") {
                            $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnULDNbr' + i + '"]').closest('td').css('border', '1px solid black')
                            // $('#spnULDNbr' + i).closest('td').css('border', '1px solid black')
                            $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnULDNbr' + i + '"]').closest('td').attr('rowspan', FinalData3[j].AWBCount)
                            for (var a = i + 1; a <= FinalData3[j].AWBCount; a++) {
                                $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnULDNbr' + a + '"]').closest('td').remove();
                            }
                            $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnULDNbr' + i + '"]').html(tr.ULDNo.replace(/,/g, '<br/><br/>'));
                            //$('#spnULDNbr' + i).html(tr.ULDNo.replace(/,/g, '<br/><br/>'));
                        }
                        //$('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnPosition' + i + '"]').closest('td').remove();


                        // $('#spnPosition' + i).text("")

                    }
                    if (i == 14) {
                        i = 0;
                        div1 = parseInt(div1) + 1;
                    }


                })
                if (i < 13) {
                    $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnShipperName' + (i + 2) + '"]').html("/// END OF NOTOC ///");
                    //$('#spnShipperName' + (i + 2)).text("/// END OF NOTOC ///");
                }
                else {
                    $('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnShipperName15"]').html("/// END OF NOTOC ///");
                    //$('#spnShipperName15').text("/// END OF NOTOC ///");
                }


            }


            else {
                $('#btn_SendNtm').css('visibility', 'visible')
                $('#td_sendNtm').show();
                $('#spnAircraftRegistration').text(FinalData2[0].RegistrationNo.toUpperCase())
            }

            if (FinalData1.length > 0) {
                var i = 0;
                var j = 0;
                var div2 = 0;
                var wayBill = FinalData1[0].AWBNo
                $('#dinMain' + div2 + ' table:eq(1)').find('textarea[id^="spnO_SuppInfo_"]').hide();
                //$('textarea[id="spnO_SuppInfo_' + i + '"]').show();
                $(FinalData1).each(function (row, tr) {
                    if (tr.AWBNo != wayBill) {
                        j = parseInt(j) + 1;
                        wayBill = tr.AWBNo
                    }
                    i = parseInt(i) + 1
                    if (i < 7) {
                        $('#dinMain' + div2 + ' table:eq(1)').find('span[id="spnO_StationOfUnLoading' + i + '"]').text(tr.DestinationCity)
                        // $('#spnO_StationOfUnLoading' + i).text(tr.DestinationCity)
                        $('#dinMain' + div2 + ' table:eq(1)').find('span[id="spnO_AWBNo' + i + '"]').text(tr.AWBNo)
                        //$('#spnO_AWBNo' + i).text(tr.AWBNo)
                        $('#dinMain' + div2 + ' table:eq(1)').find('span[id="spnO_Contents' + i + '"]').text(tr.NatureOfGoods)
                        // $('#spnO_Contents' + i).text(tr.NatureOfGoods)

                        $('#dinMain' + div2 + ' table:eq(1)').find('span[id="spnO_NoOfPkgs' + i + '"]').text(tr.NoOfPackg)
                        // $('#spnO_NoOfPkgs' + i).text(tr.NoOfPackg)
                        $('#dinMain' + div2 + ' table:eq(1)').find('span[id="spnO_Quantity' + i + '"]').text(tr.Quantity)
                        // $('#spnO_Quantity' + i).text(tr.Quantity)
                        if (tr.AWBNo != "")
                            $('#dinMain' + div2 + ' table:eq(1)').find('textarea[id="spnO_SuppInfo_' + i + '"]').show();
                        //$('textarea[id="spnO_SuppInfo_' + i + '"]').show();
                        $('#dinMain' + div2 + ' table:eq(1)').find('hidden[id="hdn_SuppInfo_' + i + '"]').val(tr.Man_SNo)
                        // $('#hdn_SuppInfo_' + i).val(tr.Man_SNo)
                        $('#dinMain' + div2 + ' table:eq(1)').find('span[id="spnO_SuppInfo_' + i + '"]').text(tr.SupplementaryInfo.toUpperCase())

                        // $('#spnO_SuppInfo_' + i).text(tr.SupplementaryInfo.toUpperCase())


                        if (tr.ImpCode != "") {
                            //$('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnImpCode' + i + '"]').closest('td').css('border', '1px solid black')
                            // $('#spnULDNbr' + i).closest('td').css('border', '1px solid black')
                            $('#dinMain' + div2 + ' table:eq(1)').find('span[id="spnO_ImpCode' + i + '"]').closest('td').attr('rowspan', FinalData4[j].AWBCount)
                            // $('#spnULDNbr' + i).closest('td')
                            for (var a = i + 1; a <= FinalData4[j].AWBCount; a++) {
                                $('#dinMain' + div2 + ' table:eq(1)').find('span[id="spnO_ImpCode' + a + '"]').closest('td').remove();
                            }
                            // $('#dinMain' + div2 + ' table:eq(1)').find('span[id="SpnO_UldNbr' + i + '"]').text(tr.ImpCode.replace(/,/g, '<br/><br/>'));
                            //$('#dinMain' + div1 + ' table:eq(1)').find('span[id="spnImpCode' + i + '"]').html(tr.ImpCode.replace(/;/g, ' '));
                            $('#dinMain' + div2 + ' table:eq(1)').find('span[id="spnO_ImpCode' + i + '"]').html(tr.ImpCode.replace(/@/g, '<br/><br/>'))
                        }


                        //if (tr.ImpCode != "")
                        //{
                        //   // $('#dinMain' + div2 + ' table:eq(1)').find('span[id="spnO_ImpCode' + i + '"]').closest('td').css('border', '1px solid black')
                        //    // $('#SpnO_UldNbr' + i).closest('td').css('border', '1px solid black')
                        //    $('#dinMain' + div2 + ' table:eq(1)').find('span[id="spnO_ImpCode' + i + '"]').closest('td').attr('rowspan', FinalData4[j].AWBCount)
                        //    // $('#SpnO_UldNbr' + i).closest('td').attr('rowspan', FinalData4[j].AWBCount)
                        //    // $('#spnULDNbr' + i).text(tr.ULDNo)
                        //    $('#dinMain' + div2 + ' table:eq(1)').find('span[id="SpnO_UldNbr' + i + '"]').html(tr.ImpCode.replace(/,/g, '<br/><br/>'))
                        //}
                        // $('#dinMain' + div2 + ' table:eq(1)').find('span[id="spnO_ImpCode' + i + '"]').text(tr.ImpCode)
                        // $('#spnO_ImpCode' + i).text(tr.ImpCode)

                        if (tr.ULDNo != "") {
                            $('#dinMain' + div2 + ' table:eq(1)').find('span[id="SpnO_UldNbr' + i + '"]').closest('td').css('border', '1px solid black')
                            // $('#SpnO_UldNbr' + i).closest('td').css('border', '1px solid black')
                            $('#dinMain' + div2 + ' table:eq(1)').find('span[id="SpnO_UldNbr' + i + '"]').closest('td').attr('rowspan', FinalData4[j].AWBCount)
                            // $('#SpnO_UldNbr' + i).closest('td').attr('rowspan', FinalData4[j].AWBCount)
                            // $('#spnULDNbr' + i).text(tr.ULDNo)
                            for (var a = i + 1; a <= FinalData4[j].AWBCount; a++) {
                                $('#dinMain' + div2 + ' table:eq(1)').find('span[id="SpnO_UldNbr' + a + '"]').closest('td').remove();
                            }
                            $('#dinMain' + div2 + ' table:eq(1)').find('span[id="SpnO_UldNbr' + i + '"]').html(tr.ULDNo.replace(/,/g, '<br/><br/>'))
                            //$('#SpnO_UldNbr' + i).html(tr.ULDNo.replace(/,/g, '<br/><br/>'));
                        }
                        //$('#SpnO_UldNbr' + i).text(tr.ULDNo)
                        //$('#dinMain' + div2 + ' table:eq(1)').find('span[id="spnO_Position' + i + '"]').closest('td').remove();
                        $('#spnO_Position' + i).text("")
                        // $('#spnO_Contents' + (i + 1)).text("/// END OF NOTOC ///");
                        $('#dinMain' + div2 + ' table:eq(1)').find('input:hidden[id="hdn_SuppInfo_' + i + '"]').val(tr.Man_SNo);
                        if (tr.DRYICEasRefrigerant == 'True') {
                            var a = tr.SupplementaryInfo.replace('DRY ICE AS REFRIGERANT ', '');
                            $('#dinMain' + div2 + ' table:eq(1)').find('textarea[id="spnO_SuppInfo_' + i + '"]').text('DRY ICE AS REFRIGERANT ' + a);
                        }
                        else {
                            var a = tr.SupplementaryInfo.replace('DRY ICE AS REFRIGERANT ', '');
                            $('#dinMain' + div2 + ' table:eq(1)').find('textarea[id="spnO_SuppInfo_' + i + '"]').text(a);
                        }

                    }
                    if (i == 6) {
                        i = 0;
                        div2 = parseInt(div2) + 1;
                    }
                })
                if (i < 5) {
                    $('#dinMain' + div2 + ' table:eq(1)').find('span[id="spnO_Contents' + (i + 2) + '"]').text("/// END OF NOTOC ///")
                    // $('#spnO_Contents' + (i + 2)).text("/// END OF NOTOC ///");
                }
                else {
                    $('#dinMain' + div2 + ' table:eq(1)').find('span[id="spnO_Contents7"]').text("/// END OF NOTOC ///")
                    //$('#spnO_Contents7' ).text("/// END OF NOTOC ///");
                }


            }

            //if (IsNILManifested.toLowerCase()=="true")
            //{
            //    $('#spnShipperName1').text("/// NIL ///");
            //    $('#spnShipperName2').text("/// END OF NOTOC ///");
            //    $('#spnO_Contents1').text("/// NIL ///");
            //    $('#spnO_Contents2').text("/// END OF NOTOC ///");
            //}
            if (FinalData.length == 0) {
                $('#spnShipperName1').text("/// NIL ///");
                $('#spnShipperName2').text("/// END OF NOTOC ///");
            }
            if (FinalData1.length == 0) {
                $('#spnO_Contents1').text("/// NIL ///");
                $('#spnO_Contents2').text("/// END OF NOTOC ///");
            }

        }

    });
}

function fn_Cal_GVCBMOnPRE_MAN(input) {

    var flag = false;
    var trRow = $(input).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var ActG_V_CBMIndex = trRow.find("th[data-field='ActG_V_CBM']").index();
    var PlanG_V_CBMIndex = trRow.find("th[data-field='PlanG_V_CBM']").index();
    var ULDStockSNoIndex = trRow.find("th[data-field='ULDStockSNo']").index();
    var TotalPPcsIndex = trRow.find("th[data-field='TotalPPcs']").index();
    var PGWIndex = trRow.find("th[data-field='PGW']").index();
    var PVWIndex = trRow.find("th[data-field='PVW']").index();
    var PCCBMIndex = trRow.find("th[data-field='PCCBM']").index();
    var PlannedPiecesIndex = trRow.find("th[data-field='PlannedPieces']").index();
    var AWBNOIndex = trRow.find("th[data-field='AWBNo']").index();
    var ActualG_V_CBM = $(input).closest('tr').find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/');
    var PGW = $(input).closest('tr').find('td:eq(' + PGWIndex + ')').text();
    var PVW = $(input).closest('tr').find('td:eq(' + PVWIndex + ')').text();
    var PCCBM = $(input).closest('tr').find('td:eq(' + PCCBMIndex + ')').text();
    var PG = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]');
    var PV = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]');
    var PCBM = $(input).closest('tr').find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]');

    if ($(input).val() != "") {
        if ($.isNumeric($(input).val())) {
            if ($(input).val() != 0) {
                if (($(input).attr('id') == "txtPG") && ($(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val() < $(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text())) {
                    if ($(input).val() > parseFloat(PGW)) {
                        ShowMessage('warning', 'Warning -Planned Gross Weight should be less than Total Gross Weight', " ", "bottom-right");
                        $(input).val(parseFloat(PGW).toFixed(2));
                        $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text());
                        PV.val(parseFloat(PVW).toFixed(2));
                        PCBM.val(parseFloat(PCCBM).toFixed(2));
                    }
                    else
                        if ($(input).val() == parseFloat(PGW)) {
                            $(input).val(parseFloat(PGW).toFixed(2));
                            $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text());
                            PV.val(parseFloat(PVW).toFixed(2));
                            PCBM.val(parseFloat(PCCBM).toFixed(2));
                        }
                    // EFlag = 1;
                    flag = false;
                }
                else if (($(input).attr('id') == "txtPV") && ($(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val() < $(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text())) {
                    if ($(input).val() > parseFloat(PVW)) {
                        ShowMessage('warning', 'Warning -Planned Volume Weight should be less than Total Volume Weight', " ", "bottom-right");
                        $(input).val((parseFloat(PVW)).toFixed(2));
                        $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text());
                        PG.val(parseFloat(PGW).toFixed(2));
                        PCBM.val(parseFloat(PCCBM).toFixed(2));
                    }
                    else
                        if ($(input).val() == parseFloat(PVW)) {
                            $(input).val((parseFloat(PVW)).toFixed(2));
                            $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text());
                            PG.val(parseFloat(PGW).toFixed(2));
                            PCBM.val(parseFloat(PCCBM).toFixed(2));
                        }
                    // EFlag = 1;
                    flag = false;
                }
                else if (($(input).attr('id') == "txtPCBM") && ($(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val() < $(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text())) {
                    if ($(input).val() > parseFloat(PCCBM)) {
                        ShowMessage('warning', 'Warning -Planned CBM should be less than Total CBM', " ", "bottom-right");
                        $(input).val((parseFloat(PCCBM)).toFixed(2));
                        $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text());
                        PG.val(parseFloat(PGW).toFixed(2));
                        PV.val(parseFloat(PVW).toFixed(2));
                    }
                    else
                        if ($(input).val() == parseFloat(PCCBM)) {
                            $(input).val((parseFloat(PCCBM)).toFixed(2));
                            $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text());
                            PG.val(parseFloat(PGW).toFixed(2));
                            PV.val(parseFloat(PVW).toFixed(2));
                        }
                    // EFlag = 1;
                    flag = false;
                }
                else {

                    PG.val(parseFloat(PGW).toFixed(2));
                    PV.val(parseFloat(PVW).toFixed(2));
                    PCBM.val(parseFloat(PCCBM).toFixed(2));

                    return true;
                }
            }
            else {
                $(input).closest('tr').find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val($(input).closest('tr').find('td:eq(' + TotalPPcsIndex + ')').text());
                PG.val(parseFloat(PGW).toFixed(2));
                PV.val(parseFloat(PVW).toFixed(2));
                PCBM.val(parseFloat(PCCBM).toFixed(2));
                flag = false;
            }
        }
        else {
            ShowMessage('warning', 'Warning - Enter Valid Number ', " ", "bottom-right");
            //  PG.val(parseFloat(PGW).toFixed(2));
            // PV.val(parseFloat(PVW).toFixed(2));
            // PCBM.val(parseFloat(PCCBM).toFixed(2));
            // fn_Cal_GVCBMOnPRE_MAN(input);
            flag = false;
            // flag = false;

        }

    }
    return flag;
}

////////////////////////for Move to Lying List from Plan/////////////////////////////
function fn_MoveToLying(input) {
    var chkFlag = false;
    $("#divDetail input[type='checkbox'][disabled!='disabled'][id!='chkAllBox']").each(function () {
        if ($(this).prop('checked'))
            chkFlag = true;
    })
    if (chkFlag) {
        var LIArray = new Array();
        $('#divDetail .k-grid-content tbody tr').each(function (row, tr) {
            var Rowtr = $(tr).closest("div.k-grid").find("div.k-grid-header");
            var SelectIndex = Rowtr.find("th[data-field='isSelect']").index();
            var AWBSNoIndex = Rowtr.find("th[data-field='SNo']").index();
            var DailyFlightSNoIndex = Rowtr.find("th[data-field='DailyFlightSNo']").index();
            var PiecesIndex = Rowtr.find("th[data-field='TotalPieces']").index();
            var PlannedPiecesIndex = Rowtr.find("th[data-field='PlannedPieces']").index();
            var ActG_V_CBMIndex = Rowtr.find("th[data-field='ActG_V_CBM']").index();
            var PlanG_V_CBMIndex = Rowtr.find("th[data-field='PlanG_V_CBM']").index();
            var ULDGroupNoIndex = Rowtr.find("th[data-field='ULDGroupNo']").index();
            var SHCIndex = Rowtr.find("th[data-field='SHC']").index();
            var AgentIndex = Rowtr.find("th[data-field='Agent']").index();
            var ULDTypeIndex = Rowtr.find("th[data-field='ULDType']").index();
            var PriorityIndex = Rowtr.find("th[data-field='Priority']").index();
            var RemarksIndex = Rowtr.find("th[data-field='Remarks']").index();
            var ULDCountIndex = Rowtr.find("th[data-field='ULDCount']").index();
            var ULDStockSNoIndex = Rowtr.find("th[data-field='ULDStockSNo']").index();
            var FBLAWBSNoIndex = Rowtr.find("th[data-field='FBLAWBSNo']").index();
            var IsManifestedIndex = Rowtr.find("th[data-field='IsManifested']").index();
            var RowNumIndex = Rowtr.find("th[data-field='RowNum']").index();
            var BlockIndex = Rowtr.find("th[data-field='Block']").index();
            if ($(tr).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked')) {
                var AG = $(tr).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[0];
                var AV = $(tr).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[1];
                var ACBM = $(tr).find('td:eq(' + ActG_V_CBMIndex + ')').text().split('/')[2];
                var PG = $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPG"]').val();
                var PV = $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPV"]').val();
                var PCBM = $(tr).find('td:eq(' + PlanG_V_CBMIndex + ') input[id="txtPCBM"]').val();
                LIArray.push({
                    isSelect: $(tr).find('td:eq(' + SelectIndex + ') input[type=checkbox]').prop('checked'),
                    AWBSNo: $(tr).find('td:eq(' + AWBSNoIndex + ')').text(),
                    DailyFlightSNo: $(tr).find('td:eq(' + DailyFlightSNoIndex + ')').text(),
                    TotalPieces: $(tr).find('td:eq(' + PiecesIndex + ')').text(),
                    PlannedPieces: $(tr).find('td:eq(' + PlannedPiecesIndex + ') input[type=text]').val(),
                    ActualVolumeWt: AV,
                    ActualGrossWt: AG,
                    ActualCBM: ACBM,
                    PlannedGrossWt: PG,
                    PlannedVolumeWt: PV,
                    PlannedCBM: PCBM,
                    MovementType: 2,
                    ULDGroupNo: $(tr).find('td:eq(' + ULDGroupNoIndex + ') input[type=text]').val(),
                    SHC: $(tr).find('td:eq(' + SHCIndex + ')').text(),
                    Agent: $(tr).find('td:eq(' + AgentIndex + ')').text(),
                    ULDType: $(tr).find('td:eq(' + ULDTypeIndex + ') select option:selected').text(),
                    Priority: $(tr).find('td:eq(' + PriorityIndex + ') select').val(),
                    UpdatedBy: 2,
                    Remarks: $(tr).find('td:eq(' + (RemarksIndex - 1) + ') input[type=hidden]').val() == "" ? null : $(tr).find('td:eq(' + (RemarksIndex - 1) + ') input[type=hidden]').val(),
                    ULDStockSNo: $(tr).find('td:eq(' + ULDStockSNoIndex + ')').text(),
                    ULDCount: $(tr).find('td:eq(' + ULDCountIndex + ') input[type="text"]').val(),
                    FBLAWBSNo: $(tr).find('td:eq(' + FBLAWBSNoIndex + ')').text(),
                    RowNum: $(tr).find('td:eq(' + RowNumIndex + ')').text(),
                    Block: $(tr).find('td:eq(' + BlockIndex + ')').text()
                });
            }
        });

        $.ajax({
            url: "Services/FlightControl/FlightControlService.svc/MoveToLyingList", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ LIInfo: LIArray, FlightSNo: $('#hdnFlightSNo').val() }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var ResultStatus = result.split('?')[0];
                var ResultValue = result.split('?')[1];
                if (ResultStatus == "0") {
                    ShowMessage('success', 'Success -Selected AWB pushed in Lying List successfully', "Processed Successfully", "bottom-right");
                    FlightSearch();
                }
                else if (ResultStatus == "1") {
                    ShowMessage('warning', 'Warning', "AWB '" + ResultValue + "' accepted with Flight '" + $("#tdFlightNo").text() + "'.Cannot be pushed in Lying List", "bottom-right");
                }
                else {
                    ShowMessage('warning', 'Warning - Selected AWB can not be pushed in Lying List ', " ", "bottom-right");
                }
            }
        });


    }
    else
        ShowMessage('warning', 'Warning -Select Shipment for Move to Lying List', " ", "bottom-right");

}
function fn_CancelLI(input) {
    var r = jConfirm("Are you sure,you want to Cancel Loading Instruction ?", "", function (r) {
        if (r == true) {
            $.ajax({
                url: "Services/FlightControl/FlightControlService.svc/CancelLI", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ FlightSNo: $('#hdnFlightSNo').val() }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var ResultStatus = result.split('?')[0];
                    var ResultValue = result.split('?')[1];
                    if (ResultStatus == "0") {
                        ShowMessage('success', 'Success -Loading Instruction has been cancelled', "Processed Successfully", "bottom-right");
                        FlightSearch();
                    }
                    else if (ResultStatus == "1") {
                        ShowMessage('warning', 'Warning', ResultValue, "bottom-right");
                    }
                    else {
                        ShowMessage('warning', 'Warning', "Loading Instruction can not be cancelled", "bottom-right");
                    }
                }
            });
        }
    });
}

var UWSHTML;
function fn_ViewUWSDetails() {
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetUWSDetails?GroupFlightSno=" + CurrentFlightSno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            var FinalData = ResultData.Table0;
            var UWSTotalPCS = 0, UWSTotalWeight = 0, UWSTotalNetWeight = 0;
            UWSHTML = '<table id="recordTbl" style="width:100%; margin:0; padding:0; border-collapse:collapse;text-align:center;">                                        <tbody><tr style="background-color:#b3b3b3; font-weight:bold; border:1px solid black;">                                            <td style="width:8%;">Equipment</td>                                            <td style="width:5%;">ULD No / BULK</td>                                            <td style="width:5%;">Pieces/ULD</td>                                            <td style="width:5%;">Gross Wt</td>                                            <td style="width:3%;  ">Net Wt</td>                                                           <td style="width:10%;" >SHC Code</td>                                            <td style="width:5%;">Variance</td><td style="width:5%;">ULD Contour Code</td></tr>';
            //<tr id="spDes" style="border:1px solid black;"> <td colspan="7" style="padding: 7px; font-size: 12px; font-weight: bold; text-align: center">[ Destination :  <span id="spnDes">DEL - NEW DELHI</span> ]</td></tr>';
            $(FinalData).each(function (row, tr) {
                UWSTotalPCS = UWSTotalPCS + parseInt(tr.Pieces);
                UWSTotalWeight = UWSTotalWeight + parseFloat(tr.GrossWt);
                UWSTotalNetWeight = UWSTotalNetWeight + parseFloat(tr.NetWeight);
                UWSHTML = UWSHTML + '<tr style="border:1px solid black;"><td style="width:8%;">' + tr.EquipmentNumber + '</td><td style="width:5%;">' + tr.ULDNo + '</td><td style="width:3%;">' + tr.Pieces + '</td><td style="width:3%;">' + tr.GrossWt + '</td><td style="width:3%;">' + tr.NetWeight + '</td><td style="width:3%;" >' + tr.SHC + '</td><td style="width:3%;" >' + (parseFloat(tr.Variance).toFixed(2) == "-0.00" ? "0.00" : parseFloat(tr.Variance).toFixed(2)) + '</td> <td style="width:15%;" >' + tr.ULDContourCode + '</td></tr>';
            });
            UWSHTML = UWSHTML + '<tr style="background-color: #cccccc; border: 1px solid black;">                                            <td style="padding: 5%; padding: 7px; font-weight: bold;" colspan="2" >Total</td>                                            <td style="width:5%; padding:7px; font-weight:bold;"><span id="spnTpcs">' + UWSTotalPCS + '</span></td>                                            <td style="width:5%; padding:7px;  font-weight:bold;"><span id="spnTGwt">' + UWSTotalWeight + '</span></td>                                            <td style="width:5%; padding:7px; font-weight:bold;"><span id="spnTNwt">' + UWSTotalNetWeight + '</span></td>                                            <td style="width:5%; padding:7px;" >&nbsp;</td>                                            <td style="width:5%; padding:7px;">&nbsp;</td><td style="width:15%; padding:7px;">&nbsp;</td></tr></tbody></table>';
            $('#divFltDetails').html('');
            $('#divFltDetails').html(UWSHTML);
            $("#recordTbl").before('<div id="divWindow" style="overflow:auto; float:right;"><input type="button" class="button" id="btnUwsPrint" value="Print UWS" style="visibility:hidden" onclick="PrintUWS();"><input type="button" class="button" id="Excel" value="Download Excel" onclick="DownloadExcel();"><br/></div>');
            if (FinalData.length > 0)
                $('#btnUwsPrint').css('visibility', 'visible');
            else
                $('#btnUwsPrint').css('visibility', 'hidden');

            cfi.PopUp("divFltDetails", "UWS Details", 1300, null, null, 100);
        }
    });
}

function DownloadExcel() {
    var data_type = 'data:application/vnd.ms-excel';
    //var postfix = $("lblWarehouseName").text();
    var a = document.createElement('a');
    a.href = data_type + ', ' + encodeURIComponent('<table style="width:100%; margin:0; padding:0; border-collapse:collapse;text-align:center;" ><tbody><tr><td>' + UWSHTML + '</td></tr></tbody></table>');
    a.download = 'UWSDetails.xls';
    a.click();
}
function PrintUWS() {
    $.ajax({
        url: "HtmlFiles/Export/ManifestUWSPrint.html", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $('#divFltDetails').html('');
            $('#divFltDetails').css('width', '100%');
            $('#divFltDetails').html(result);

            getUWSData();

            cfi.PopUp("divFltDetails", "UWS Details", 1300, null, null, 100);
            $('#Save_Print').click(function () {
                $('#divhead').printArea();

            })

        }
    })
}
function getUWSData() {
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetUWSDetails?GroupFlightSno=" + CurrentFlightSno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            var FinalData = ResultData.Table0;
            var FinalData1 = ResultData.Table1;

            if (FinalData1.length > 0) {
                $("span#spnDateTime").text(FinalData1[0].FlightDateTime);
                $("span#spnAirline").text(FinalData1[0].AirlineName);
                $("span#spnFlight").text(FinalData1[0].FlightNo);
                $("span#spnFlightSNo").text(FinalData1[0].DailyFlightSNo);
                $("span#spnLBD").text(FinalData1[0].LBDSNo);

                $("span#spnSector").text(FinalData1[0].Sector);
                if (FinalData[0].LBDSNo == 1)
                    $("#UWSMessage").css("display", "none");
                else
                    $("#UWSMessage").css("display", "block");

                // $("span#spnExp").text("<a href='#' onClick='showOverhangData(\"" + FinalData[0].DailyFlightSNo + "\"); return false;'><b>UWS Message</b></a>");
                // $("#UWSMessage").text("<a href='#' onClick='showOverhangData(\"" + FinalData[0].DailyFlightSNo + "\"); return false;'><b>UWS Message</b></a>");
                $("span#spnDes").text(FinalData1[0].Destination);
                $("span#spnACFT").text(FinalData1[0].RegNo);
                $("span#spnAgent").text(FinalData1[0].AirlineName);
                $("span#spnEmpData").text(FinalData1[0].UserName);
                $("span#spnType").text(FinalData1[0].AircraftType);
                $("#SI1").text(FinalData1[0].OtherInfo1);
                $("#SI2").text(FinalData1[0].OtherInfo2);
            }
            if (FinalData.length > 0) {
                var UWSTotalPCS = 0, UWSTotalWeight = 0, UWSTotalNetWeight = 0;

                for (var i = 0; i < FinalData.length; i++) {
                    UWSTotalPCS = UWSTotalPCS + parseInt(FinalData[i].Pieces);
                    UWSTotalWeight = UWSTotalWeight + parseFloat(FinalData[i].GrossWt);
                    UWSTotalNetWeight = UWSTotalNetWeight + parseFloat(FinalData[i].NetWeight);
                    $('#trlast').before("<tr id='trInside' style='border:1px solid black;'><td style='width:12%; padding:7px;'>" + FinalData[i].EquipmentNumber + "</td><td style='width:14%; padding:7px;'>" + FinalData[i].ULDNo + "</td><td style='width:7%; padding:7px; text-align:center;'>" + FinalData[i].Pieces + "</td><td style='width:12%; padding:7px; text-align:center;' >" + FinalData[i].GrossWt + "</td><td style='width:12%; padding:7px; text-align:center;'>" + FinalData[i].NetWeight + "</td><td style='width:12%; padding:7px; text-align:center;'>" + FinalData[i].SHC + "</td><td style='width:12%; padding:7px; text-align:center;'>" + (parseFloat(FinalData[i].Variance).toFixed(2) == "-0.00" ? "0.00" : parseFloat(FinalData[i].Variance).toFixed(2)) + "</td><td style='width:12%; padding:7px; text-align:center;'>" + FinalData[i].ULDContourCode + "</td></tr>")
                    //SNo = SNo + FinalData[i].SNo + ',';
                    //Tpcs = parseFloat(Tpcs) + parseFloat(FinalData[i].Pieces);
                    //Tgwt = parseFloat(Tgwt) + parseFloat(FinalData[i].GrossWt.split(' ')[0]);
                    //Tnwt = parseFloat(Tnwt) + parseFloat(FinalData[i].NetWeight);
                }
                //$('#recordTbl tbody tr:last').after(
                //                       '<tr style="background-color: #cccccc; border: 1px solid black;">'+
                //                            '<td style="padding: 5%; padding: 7px; font-weight: bold;" colspan="2">Total</td>'+
                //                            '<td style="width:5%; padding:7px; font-weight:bold;"><span id="spnTpcs"></span></td>'+
                //                            '<td style="width:5%; padding:7px;  font-weight:bold;"><span id="spnTGwt"></span></td>'+
                //                            '<td style="width:5%; padding:7px; font-weight:bold;"><span id="spnTNwt"></span></td>' +
                //                            '<td style="width:5%; padding:7px; font-weight:bold;text-align:center" colspan="3"></span></td>'+

                //                        '</tr>')
                $('#spnTpcs').text(UWSTotalPCS)
                $('#spnTGwt').text(UWSTotalWeight)
                $('#spnTNwt').text(UWSTotalNetWeight)

                // SNo = SNo.slice(0, SNo.length - 1);
                //$('#hdnSNoList').val(SNo);
                //$("span#spnTpcs").text(Tpcs);
                //$("span#spnTGwt").text(Tgwt.toFixed(2));
                //$("span#spnTNwt").text(Tnwt.toFixed(2));
                //$("span#spnMainTGwt").text(Tgwt.toFixed(3));
                //$("span#spnMainTNwt").text(Tnwt.toFixed(3));


                //$(FinalData).each(function (row, tr) {
                //    //$('#spDes').after('<tr style="background-color:#b3b3b3; font-weight:bold; border:1px solid black;">'+
                //    //                        '<td>Equipment</td>'+
                //    //                        '<td>ULD No/BULK</td>'+
                //    //                        '<td>Pieces/ULD</td>'+
                //    //                        '<td>Gross Wt</td>'+
                //    //                        '<td>Net Wt</td>'+
                //    //                        '<td>SHC Code</td>'+
                //    //                        '<td>Variance</td>'+
                //    //                        '<td>ULD Contour Code</td>'+
                //    //                        '</tr>')
                //});
            }
        }
    });
}
function printManifestUws(div) {
    //var div1 = '';
    //    div1 = ('<div></div>')
    ////$('#div1').html('')
    //$('#div1').html($('#'+div).html())
    //$('#' + div).printArea();
    //$('#div').printArea();
}

///////////////////////////////////////////////////////////////////////////////////

function fnGetCBV() {
    $.ajax({
        url: "HtmlFiles/Export/CBVPrint.html", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            //  alert('Test')
            $("#divDetail").html(result);
            fn_GetCBVData();
            // $('#FirstTab').text('CBV Shipment Details');
            $('#SecondTab').hide();
            $('#OSCTab').hide();
            $('#divAction').hide();
            $("#btnPrint").unbind("click").bind("click", function () {
                $("#divDetailPrint #divDetail").printArea();
            });
        },
        beforeSend: function (jqXHR, settings) {
        },
        complete: function (jqXHR, textStatus) {
        },
        error: function (xhr) {
            // var a = "";
        }
    });

}

function fn_GetCBVData() {
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetCBVPrintRecord?DFGroupSNo=" + CurrentFlightSno,
        contentType: "application/json; charset=utf-8",
        //data: JSON.stringify({ AWBSNo: AWBSNo }),
        async: false,
        type: 'GET',
        cache: false,
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            FinalData = ResultData.Table0;
            FinalData1 = ResultData.Table1;
            if (FinalData.length > 0) {
                $('#spnOwner').text(FinalData[0].AirlineName)
                $('#spnRes').text(FinalData[0].RegistrationNo)
                $('#spnFlifgtNo').text(FinalData[0].FlightNo)
                $('#spnFlightDate').text(FinalData[0].FlightDate)
                $('#spnPointOfLoading').text(FinalData[0].OriginCity)
                $('#spnPointOfUnloading').text(FinalData[0].DestinationCity)
            }
            if (FinalData1.length > 0) {
                $(FinalData1).each(function (row, tr) {
                    $('#trData').after("<tr align='center' >" +
        "<td colspan='2' class='grdTableRow'>" + tr.AWBNo + "</td>" +
        "<td colspan='1' class='grdTableRow'>" + tr.Pieces + "</td>" +
        "<td colspan='1' class='grdTableRow'>" + tr.NatureOfGoods + "</td>" +
        "<td colspan='1' class='grdTableRow'>" + tr.GrossWeight + "</td>" +
        "<td colspan='1' class='grdTableRow'>" + tr.ULDNo + "</td>" +
        "<td colspan='1' class='grdTableRow'>" + tr.OriginDestin + "</td>" +
        "<td colspan='1' class='grdTableRow'>" + tr.code + "</td>" +
        "<td colspan='1' class='grdTableRow'>" + '' + "</td>" +
        "<td colspan='1' class='grdTableRow'>" + '' + "</td>" +
    "</tr>")
                })

            }
        }
    });
}

////////for ULD Remarks
var TDForRFSRemarks;
function fn_GetSetULDAWBRemarks(ProcessType, ProcessSNo, input) {
    $.ajax({
        url: "Services/FlightControl/FlightControlService.svc/GetWebForm/FlightControl/FlightControl/PreManifestRFSRemarks/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            TDForRFSRemarks = $(input).closest('td');
            $("#divDetailPop").html(result);
            $('#PreManifestRemarks').val($(input).closest('td').find('input[type=hidden]').val())
            cfi.PopUp("__divpremanifestrfsremarks__", "Remarks");
            $('.k-window').closest("div:hidden").remove();
        },
        beforeSend: function (jqXHR, settings) {
        },
        complete: function (jqXHR, textStatus) {
        },
        error: function (xhr) {
            var a = "";
        }
    });

}


function SavePreManifestRemarks(e) {
    $(TDForRFSRemarks).find('input[type=hidden]').val($('#PreManifestRemarks').val());
    $("#__divpremanifestrfsremarks__").data("kendoWindow").close();

}
///////////////for send EDI Message Manual


///////////////for send EDI Message/////////////////
function GetFlightMSGGrid() {
    $("#tdNILManifest,#tdATDTime,#tdATDDate,#tdManRemarks,#tdManifestRemarks,#tdregnNo,#tdregnNoTxt,#btnUWS,#btn_Print").hide();
    $('#SecondTab,#OSCTab,#StackDetailTab,#FlightStopOverDetailTab').hide();
    $('#FirstTab').text('EDI Message');
    $("#divAction button").hide();
    $('#btnEDIMsgSend').show();
    $("#tabstrip").kendoTabStrip();
    ShowIndexView("divDetail", "Services/FlightControl/FlightControlService.svc/GetFlightTransGridData/FLIGHTCONTROL/FlightControl/EDIMSG/" + CurrentFlightSno + "/" + FlightCloseFlag);
}

function fun_SendEDIMessage() {
    var EDIMSGArray = new Array();
    $('#divDetail .k-grid-content tbody tr').each(function (row, tr) {
        var Rowtr = $(tr).closest("div.k-grid").find("div.k-grid-header");
        var IsFWBIndex = Rowtr.find("th[data-field='IsFWB']").index();
        var IsFHLIndex = Rowtr.find("th[data-field='IsFHL']").index();
        var IsDEPIndex = Rowtr.find("th[data-field='IsDEP']").index();
        var AWBSNoIndex = Rowtr.find("th[data-field='SNo']").index();
        var DailyFlightSNoIndex = Rowtr.find("th[data-field='DailyFlightSNo']").index();

        var SHCCodeIndex = Rowtr.find("th[data-field='SHCCode']").index();

        $(tr).find('td').each(function (t, i) {
            if (t > SHCCodeIndex) {
                if ($(i).find('input[type="checkbox"][disabled!="disabled"]').prop('checked')) {
                    EDIMSGArray.push({
                        AWBSNo: $(tr).find('td:eq(' + AWBSNoIndex + ')').text(),
                        DailyFlightSNo: $(tr).find('td:eq(' + DailyFlightSNoIndex + ')').text(),
                        MessageType: $(i).find('input[type="checkbox"]').val(),
                        IsSend: $(i).find('input[type="checkbox"]').prop('checked')
                    });
                }
            }
        })


        //if ($(tr).find('td:eq(' + IsFWBIndex + ') input[type=checkbox]').prop('checked') || $(tr).find('td:eq(' + IsFHLIndex + ') input[type=checkbox]').prop('checked') || $(tr).find('td:eq(' + IsDEPIndex + ') input[type=checkbox]').prop('checked') || $('#chkIsFFM').prop('checked')) {
        //    EDIMSGArray.push({
        //        AWBSNo: $(tr).find('td:eq(' + AWBSNoIndex + ')').text(),
        //        DailyFlightSNo: $(tr).find('td:eq(' + DailyFlightSNoIndex + ')').text(),
        //        IsFWB: $(tr).find('td:eq(' + IsFWBIndex + ') input[type=checkbox]').prop('checked'),
        //        IsFHL: $(tr).find('td:eq(' + IsFHLIndex + ') input[type=checkbox]').prop('checked'),
        //        IsDEP: $(tr).find('td:eq(' + IsDEPIndex + ') input[type=checkbox]').prop('checked')
        //    });
        //}
    });
    if ($('#chkIsFFM[disabled!="disabled"]').prop('checked')) {
        EDIMSGArray.push({
            AWBSNo: 0,
            DailyFlightSNo: $('#hdnFlightSNo').val(),
            MessageType: $('#chkIsFFM').val(),
            IsSend: $('#chkIsFFM').prop('checked')
        });
    }
    if (EDIMSGArray.length > 0) {
        $.ajax({
            url: "Services/FlightControl/FlightControlService.svc/SaveFlightEDIMessageInformation", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ EDIMessageInfo: EDIMSGArray, FlightSNo: $('#hdnFlightSNo').val(), IsFFM: $('#chkIsFFM').prop('checked') }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "0") {
                    ShowMessage('success', 'Success -EDI Message sent successfully', "Processed Successfully", "bottom-right");
                    FlightSearch();
                    flag = true;
                }
                else {
                    ShowMessage('warning', 'Warning - EDI Message could not be send', " ", "bottom-right");
                    flag = false;
                }
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - EDI Message could not be send', " ", "bottom-right");
                flag = false;
            }
        });
    }
    //alert(JSON.stringify(EDIMSGArray));
}
function onMSGSuccess(e) {
    var MSGGridHeader = $("#divDetail  div.k-grid-header");
    var IsFWBIndex = MSGGridHeader.find("th[data-field='IsFWB']").index();
    var IsFHLIndex = MSGGridHeader.find("th[data-field='IsFHL']").index();
    var IsDEPIndex = MSGGridHeader.find("th[data-field='IsDEP']").index();
    var IsFFMIndex = MSGGridHeader.find("th[data-field='IsFFM']").index();
    $("#divDetail  div.k-grid-header:first  div  table  thead  tr th:nth-child(" + (IsFWBIndex + 1) + ")").html("<input type='checkbox' id='chkAllFWBBox' onchange='return CheckAllFWB(this);' >FWB");
    $("#divDetail  div.k-grid-header:first  div  table  thead  tr th:nth-child(" + (IsFHLIndex + 1) + ")").html("<input type='checkbox' id='chkAllFHLBox' onchange='return CheckAllFHL(this);' >FHL");
    $("#divDetail  div.k-grid-header:first  div  table  thead  tr th:nth-child(" + (IsDEPIndex + 1) + ")").html("<input type='checkbox' id='chkAllDEPBox' onchange='return CheckAllDEP(this);' > DEP");
    if ($("#divDetail div.k-grid-content table  tbody  tr:first td:nth-child(" + (IsFFMIndex + 1) + ")").text() == 'true') {
        $('#chkIsFFM').prop('checked', 1).prop('disabled', 1);
    }
    else {
        $('#chkIsFFM').prop('checked', 0).prop('disabled', 0);
    }

    if ($("#divDetail div.k-grid-content table  tbody  tr td:nth-child(" + (IsFWBIndex + 1) + ")").length == $("#divDetail div.k-grid-content table  tbody  tr td:nth-child(" + (IsFWBIndex + 1) + ")").find('input[type="checkbox"]:checked').length) {
        $('#chkAllFWBBox').prop('checked', 1);
    }
    if ($("#divDetail div.k-grid-content table  tbody  tr td:nth-child(" + (IsFHLIndex + 1) + ")").length == $("#divDetail div.k-grid-content table  tbody  tr td:nth-child(" + (IsFHLIndex + 1) + ")").find('input[type="checkbox"]:checked').length) {
        $('#chkAllFHLBox').prop('checked', 1);
    }

    if ($("#divDetail div.k-grid-content table  tbody  tr td:nth-child(" + (IsDEPIndex + 1) + ")").length == $("#divDetail div.k-grid-content table  tbody  tr td:nth-child(" + (IsDEPIndex + 1) + ")").find('input[type="checkbox"]:checked').length) {
        $('#chkAllDEPBox').prop('checked', 1);
    }
}

function fn_CheckEDIMsg(e) {
    var MSGGridHeader = $("#divDetail  div.k-grid-header");
    var IsFWBIndex = MSGGridHeader.find("th[data-field='IsFWB']").index();
    var IsFHLIndex = MSGGridHeader.find("th[data-field='IsFHL']").index();
    var IsDEPIndex = MSGGridHeader.find("th[data-field='IsDEP']").index();
    var IsFFMIndex = MSGGridHeader.find("th[data-field='IsFFM']").index();
    if ($(e).attr('id').toLowerCase() == 'chkisfwb') {
        if ($("#divDetail div.k-grid-content table  tbody  tr td:nth-child(" + (IsFWBIndex + 1) + ")").length == $("#divDetail div.k-grid-content table  tbody  tr td:nth-child(" + (IsFWBIndex + 1) + ")").find('input[type="checkbox"]:checked').length) {
            $('#chkAllFWBBox').prop('checked', 1);
        }
        else
            $('#chkAllFWBBox').prop('checked', 0);
    }
    if ($(e).attr('id').toLowerCase() == 'chkisfhl') {
        if ($("#divDetail div.k-grid-content table  tbody  tr td:nth-child(" + (IsFHLIndex + 1) + ")").length == $("#divDetail div.k-grid-content table  tbody  tr td:nth-child(" + (IsFHLIndex + 1) + ")").find('input[type="checkbox"]:checked').length) {
            $('#chkAllFHLBox').prop('checked', 1);
        }
        else
            $('#chkAllFHLBox').prop('checked', 0);
    }
    if ($(e).attr('id').toLowerCase() == 'chkisdep') {
        if ($("#divDetail div.k-grid-content table  tbody  tr td:nth-child(" + (IsDEPIndex + 1) + ")").length == $("#divDetail div.k-grid-content table  tbody  tr td:nth-child(" + (IsDEPIndex + 1) + ")").find('input[type="checkbox"]:checked').length) {
            $('#chkAllDEPBox').prop('checked', 1);
        }
        else
            $('#chkAllDEPBox').prop('checked', 0);
    }
}

function CheckAllFWB(e) {
    var MSGGridHeader = $("#divDetail  div.k-grid-header");
    var IsFWBIndex = MSGGridHeader.find("th[data-field='IsFWB']").index();
    $("#divDetail div.k-grid-content table  tbody  tr td:nth-child(" + (IsFWBIndex + 1) + ") input[type='checkbox'][disabled!='disabled']").prop('checked', $(e).prop("checked"));
}
function CheckAllFHL(e) {
    var MSGGridHeader = $("#divDetail  div.k-grid-header");
    var IsFHLIndex = MSGGridHeader.find("th[data-field='IsFHL']").index();
    $("#divDetail div.k-grid-content table  tbody  tr td:nth-child(" + (IsFHLIndex + 1) + ") input[type='checkbox'][disabled!='disabled']").prop('checked', $(e).prop("checked"));
}
function CheckAllDEP(e) {
    var MSGGridHeader = $("#divDetail  div.k-grid-header");
    var IsDEPIndex = MSGGridHeader.find("th[data-field='IsDEP']").index();
    $("#divDetail div.k-grid-content table  tbody  tr td:nth-child(" + (IsDEPIndex + 1) + ") input[type='checkbox'][disabled!='disabled']").prop('checked', $(e).prop("checked"));
}
var msgHtml = '<div id="divFlightTransfer"><table class="WebFormTable" id="tblFlightTransfer"><tbody><tr><td class="formtwoInputcolumn" colspan="3" >Do you want to Offload/Transfer all shipments from <span id="spntdFlightNo"></span></td></tr><tr><td><input type="button" class="btn btn-info btn-sm" name="btnTransfer" id="btnTransfer" style="width:180px;" value="Transfer + Create NIL Manifest" onclick="fn_TransferFlight();"></td><td ><input type="button" class="btn btn-info btn-sm" name="CreateNILManifest" id="CreateNILManifest" style="width:180px;" value="Offload + Create NIL Manifest" onclick="fn_CreateAndvalidateNIL();"></td><td ><input type="button" class="btn btn-block btn-danger btn-sm" name="btnPopCancel" id="btnPopCancel" style="width:75px;" value="Cancel" onclick="fn_OnCancel();" ></td></tr></tbody></table></div>';
//
var fotter = '<div class="footertoolbar page-footertoolbar modify_top hidden-xs visible-stb" id="divAction">' +
            '<div class="row">' +
             '   <div class="">' +
              '      <table style="margin-left: 20px;">' +
               '         <tr>' +
               //'       <td style="display:none;"><button class="btn btn-block btn-success btn-sm" style="width: 110px;" id="btnFlightClose" onclick="fun_FlightClose();">Flight Close</button></td>' +
               // '           <td>&nbsp; &nbsp;</td>' +
               //  '       <td><button class="btn btn-block btn-success btn-sm"  style="width: 110px;display:none;" id="btnEDIMsgSend" onclick="fun_SendEDIMessage();">Send Message</button></td>' +
               // '           <td>&nbsp; &nbsp;</td>' +
               //  '           <td><button class="btn btn-block btn-success btn-sm" id="btnSave">Save</button></td>' +
               //   '          <td>&nbsp; &nbsp;</td>' +
               //    '         <td><button class="btn btn-block btn-success btn-sm" id="btnSaveAndClose" style="display: none;">Save & Depart</button></td> ' +
               //     '        <td>&nbsp; &nbsp;</td>' +
                     '       <td><button class="btn btn-info btn-sm" style="width: 110px;" id="btnNewGatePass" onclick="GetGatePassSearchData();">New Gate Pass</button></td>' +
                    '      <td>&nbsp; &nbsp;</td>' +
                       '     <td><button class="btn btn-block btn-success btn-sm" id="btnSaveGatePass" onclick="SaveGatePass();" style="display: none;">Save</button></td>' +
                      '      <td>&nbsp; &nbsp;</td>' +
                       '     <td><button class="btn btn-block btn-danger btn-sm" id="btnCancel"  style="display: none;">Cancel</button></td>' +

                       '        <td>&nbsp; &nbsp;</td>' +

                       ' </tr>' +
                   ' </table>' +
'                </div>' +
 '           </div>' +
  '      </div>';

var divContent = '<div ><input type="hidden" id="hdnProcessType" value="1"><input type="hidden" id="hdnSubProcessType" value="1"><div id="content">' +
      '<div class="rows"> <table style="width: 100%"><tr><td valign="top" class="td100Padding"><div id="divFlightDetails" style="width: 100%"></div></td></tr><tr>' +
      '<td valign="top"><div id="divFltDetails" style="width: 100%"></div></td></tr><tr><td valign="top"><table style="width: 100%"><tr><td style="width: 20%;display:none;"' +
'valign="top" class="tdInnerPadding"><table class="TTFtable" style="width: 100%; margin: 0px; padding: 0px; display: none;" id="tblFlightAWBInfo"><tr>' +
'<td class="formSection" colspan="3" style="color: maroon; font-size: 11px; font-weight: bold; border-bottom: #cccccc 1px solid;">Flight Information</td></tr><tr>' +
'<td>Flight No<input type="hidden" id="hdnFlightSNo" /></td><td>:</td><td id="tdFlightNo"></td></tr><tr><td>Flight Date</td><td>:</td><td id="tdFlightDate"></td>' +
'</tr><tr><td>Boarding Point</td><td>:</td><td id="tdBoardingPoint"></td></tr><tr><td>End Point</td><td>:</td><td id="tdEndPoint"></td></tr><tr><td>Flight Route</td>' +
'<td>:</td><td id="tdFlightRoute"></td></tr><tr><td>Booked Gross</td><td>:</td><td id="tdBookedGross"></td></tr><tr><td>Booked Volume</td><td>:</td>' +
'<td id="tdBookedVolume"></td></tr><tr><td>Booked CBM</td><td>:</td><td id="tdBookedCBM"></td></tr><tr><td>Available Gross</td><td>:</td><td id="tdAvailableGross"></td>' +
'</tr><tr><td>Available Volume</td><td>:</td><td id="tdAvailableVolume"></td></tr><tr><td>Available CBM</td><td>:</td><td id="tdAvailableCBM"></td></tr><tr>' +
'<td>Aircraft Type</td><td>:</td><td id="tdAircraftType"></td></tr><!--<tr><td>A/C Regn No</td><td>:</td><td id="tdACRegnNo"></td></tr>--><tr><td>Flight Status</td>' +
'<td>:</td><td id="tdFlightStatus"></td></tr> </table><!--<table class="TTFtable" style="width: 100%; margin: 0px; padding: 0px; display:none; " id="tblAWBButtonInfo">' +
'<tr><td class="formSection" colspan="3" style="color: maroon; font-size: 11px; font-weight: bold; border-bottom: #cccccc 1px solid;">Flight Action Information</td>' +
'</tr><tr><td colspan="2"><br /></td></tr><tr><td><button class="btn btn-info btn-sm" style="width:110px;" id="btnLyingList">Lying List</button></td><td>' +
'<button class="btn btn-info btn-sm" style="width: 110px;" id="btnViewManifest">View Manifest</button></td><!--<td><button class="btn btn-info btn-sm"' +
  'style="width: 110px;" id="btnOffLoadedCargo">Off-Loaded Cargo</button></td></tr><!--<tr><td colspan="2"><br /></td></tr><tr><td><button ' +
'class="btn btn-info btn-sm" style="width: 110px;" id="btnBuildupDetails">Build up Details</button></td><td><button class="btn btn-info btn-sm"' +
'style="width: 110px;" id="btnCreateManifest">Create Manifest</button></td></tr><tr><td colspan="2"><br /></td></tr><tr><td><button class="btn btn-info btn-sm"' +
'style="width: 110px;" id="btnViewManifest">View Manifest</button></td><td><button class="btn btn-info btn-sm" style="width: 110px;" ' +
'id="btnCloseFlightFFM">Close Flight/FFM</button></td></tr><tr><td colspan="2"><br /></td></tr></table>--></td><td style="width: 80%;" valign="top"' +
'class="tdInnerPadding"><div id="dv_FlightManifestPrint" style="display:none"><div class="mfs_rel_wrapper make_relative append_bottom5 clearfix">' +
'<div class="modify_search noneAll"><div class="modify_top col-md-12 col-sm-12 hidden-xs visible-stb ng-scope"><div class="row"><div class="col-xs-12 col-sm-12">' +
'<!-- city and country --><a class="col-xs-12 col-sm-12 has_fade" style="padding-left: 2px; padding-right: 2px;"><table id="tblSearch"><tr><td>' +
'<input type="radio" name="R" id="rbNormal" value="All" onchange=GetManifestReportData($("#hdnFlightSNo").val(),"N") />All &nbsp; &nbsp;</td>' +
'<td>&nbsp;</td><td><input type="radio" name="R" id="rbBulk" value="BULK" onchange=GetManifestReportData($("#hdnFlightSNo").val(),"B") />BULK &nbsp; &nbsp;</td>' +
'<td>&nbsp;</td><td><input type="radio" name="R" id="rbULD" value="ULD" onchange=GetManifestReportData($("#hdnFlightSNo").val(),"U") />ULD &nbsp; &nbsp;</td>' +
'<td>&nbsp;</td><td><input type="radio" name="R" id="rbHSC" value="HSC" onchange=GetManifestReportData($("#hdnFlightSNo").val(),"S") />SHC &nbsp; &nbsp;</td>' +
'<td>&nbsp;</td><td><input type="radio" name="R" id="rbGP" value="GP" onchange=GetManifestReportData($("#hdnFlightSNo").val(),"G") />Gate Pass &nbsp; &nbsp;</td>' +
'<td>&nbsp;</td></tr></table></a></div></div></div></div></div></div><div id="divDetailPrint"><div id="divContentDetail"> <div id="tabstrip"> <ul id="ulTab" style="display:none;"> <li class="k-state-active" id="FirstTab">Loading Instruction Details</li><li id="SecondTab">Lying List</li><li id="OSCTab">Other Station Cargo</li><li id="StackDetailTab" onclick="GetFlightULDSTACKDetails();" >Stack Details</li><li id="FlightStopOverDetailTab" onclick="GetStopOverFlightULDDetails();" >Stop Over Cargo</li><div style="float:right;margin-top:-5px;"><table><tr><td id="tdFlightType" style="display:none;"><input type="radio" data-radioval="Pax" class="" name="Pax" checked="Checked" id="Pax" value="0">PAX <input type="radio" data-radioval="Freighter" class="" name="Pax" id="Pax" value="1">FREIGHTER</td><td id="tdEDIMSG"  ><button style="display:none;" class="btn btn-info btn-sm" id="btnEDIMSG" onclick="GetFlightMSGGrid(this);">Send EDI Message</button></td><td id="tdUWS"><button class="btn btn-info btn-sm" id="btnUWS" onclick="fn_ViewUWSDetails(this);">UWS</button></td><td id="tdCancelLI" style="display:none;"><button class="btn btn-info btn-sm" id="btnCancelLI" onclick="fn_CancelLI(this);">Cancel LI</button></td><td id="tdMoveToLying"><button class="btn btn-info btn-sm" id="btnMoveToLying" onclick="fn_MoveToLying(this);">Move To Lying List</button></td><td id="tdNILManifest"><button class="btn btn-info btn-sm" id="btnNILManifest" onclick="fn_ValidateNILManifest(this);">Transfer/Create NIL Manifest</button></td><td id="tdManRemarks"><Label id="lblManRemarks">ATD Date/Time</Label></td><td id="tdATDDate"><input type="text" class="k-input k-state-default" name="txtATDDate" id="txtATDDate"  controltype="datetype" placeholder="ATD Date"></td><td id="tdATDTime"><input type="text" class="k-input k-state-default" name="txtATDTime" id="txtATDTime"  placeholder="ATD Time"></td><td id="tdManifestRemarks"><a id="btnManifestRemarks" onclick="fn_AddManifestRemarks()" href="#" >Remarks</a> </td><td id="tdregnNo" ><span id="spnRegistrationNo"> Aircraft Regn No.</span></td><td id="tdregnNoTxt"><input type="text" class="k-input" name="RegistrationNo" id="RegistrationNo" style="width: 80px;  text-transform: uppercase;" controltype="alphanumericupper" tabindex="8" maxlength="10" value="" placeholder="" data-role="alphabettextbox" autocomplete="off"></td><td><button class="btn btn-info btn-sm" id="btn_Print" onclick="fun_PrintByProcess();">Print</button></td><td><button class="btn btn-info btn-sm" id="btnCBV" onclick="fnGetCBV(this);">CBV</button></td><td id="td_sendNtm"><button class="btn btn-info btn-sm" id="btn_SendNtm"  onclick="fun_SendNTM();">Send NTM</button></td><td id="tdIsExcludeFromFFM" style="display:none;" ><input type="checkbox" id="IsExcludeFromFFM"> Exclude Stop Over from FFM</td></tr></table> </div></ul> <div> <div id="divGatePassSearch"></div><div> <div id="divDetail"></div></div><div><div id="divLyingSearch"></div> <div id="divLyingDetail"> </div></div><div><div id="divOSCSearch"></div><div id="divOSCDetail"> </div></div> <div><div id="divStackDetail"></div></div><div><div id="divStopOverDetail"></div></div></div></div> </div> <div id="divDetailPop"></div> <div id="divManifestRemarksPop"></div></div>' +
'<div id="divLyingListDetail"></div></td></tr></table></td></tr></table></div></div></div>';

//<td id="tdTransferFlight"><button class="btn btn-info btn-sm" id="btnTransferFlight" onclick="fn_TransferFlight(this);">Flight Transfer</button></td>
//<td id="tdOSI"><button class="btn btn-info btn-sm" id="btn_OSI" onclick="fn_AddOSI(this);">OSI</button></td>

//<td><button class="btn btn-info btn-sm" id="btn_OSI" onclick="fn_AddOSI(this);">OSI</button></td>

////
var isCreate = false, IsEdit = false, IsDelete = false, IsRead = false;

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
