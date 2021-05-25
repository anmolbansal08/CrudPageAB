var SLICaption;
$(document).ready(function () {

    SLInfoList();
    $("#isReserved").hide();
    var ReservedFor = '';
    //$(document).keydown(function (event) {
    //    if (event.ctrlKey == true && (event.which == '118' || event.which == '86')) {
    //        event.preventDefault();
    //    }
    //}); 
    //$(document).on("contextmenu", function (e) {
    //    alert('Right click disabled');
    //    return false;
    //});

    //$(document).on('drop', function () {
    //    return false;
    //});
    SLICaption = userContext.SysSetting.SLICaption;
    $("input[id^='ULDNo']").keydown(function (e) { // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 || (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) || (e.keyCode >= 35 && e.keyCode <= 40)) {
            // let it happen, don't do anything return; 
        }
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) { e.preventDefault(); }
    });
});



var paymentList = null;
var currentprocess = "";
var currentslisno = 0;
var printInvoiceSno = 0;
var printorigin = "";
var accpcs = 0;
var accgrwt = 0;
var accvolwt = 0;
var bkdpcs = 0;
var bkdgrwt = 0;
var bkdvolwt = 0;
var awborigin = "";
var slino = "";
var isBUP = false;
var IsProcessed = false;
var IsFinalSLI = false;
var TempSLINo = 0;
var currentawbsno = 0;
var _IS_DEPEND = false;
var TotPcs = 0;
var AWBNo = "";

//Get SLI Process Sequence
function GetProcessSequence(processName) {

    $.ajax({
        url: "Services/Shipment/SLInfoService.svc/GetProcessSequence?ProcessName=" + processName, async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (data) {
            var processdata = jQuery.parseJSON(data);
            // alert(processdata.Table0)
            if (processdata.Table0 != undefined && processdata.Table0.length > 0) {
                var processlist = processdata.Table0;
                var out = '[';
                $.each(processlist, function (i, item) {
                    if (item) {
                        if (parseInt(i) > 0) {
                            out = out + ',{ key: "' + item.rownum + '", value: "' + item.subprocessname + '", isoneclick: "' + item.isoneclick.toLowerCase() + '"}'
                        }
                        else {
                            out = out + '{ key: "' + item.rownum + '", value: "' + item.subprocessname + '", isoneclick: "' + item.isoneclick.toLowerCase() + '"}'
                        }
                    }
                });
            }
            out = out + ']';
            processList = eval(out);
        }
    });
}

function ISDecCustomNumber(obj) {

    if ($.inArray(event.keyCode, [48, 49, 50, 51, 52, 53, 54, 55, 56, 57]) !== -1 || (event.keyCode == 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {
    }
    else if ($(obj).val() == "N" || $(obj).val() == "NC" || $(obj).val() == "NCV") {
    }
    else {
        event.preventDefault();
    }
}
function ISDecCarriageNumber(obj) {
    // var theEvent = obj || window.event;
    //var keycode = (event.keyCode ? event.keyCode : event.which);
    if ($.inArray(event.keyCode, [48, 49, 50, 51, 52, 53, 54, 55, 56, 57]) !== -1 || (event.keyCode == 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {
    }
    else if (($(obj).val() == "N" || $(obj).val() == "NV" || $(obj).val() == "NVD")) {
        //$(obj).val('');
    }
    else {

        //  var key = theEvent.keyCode || theEvent.which;
        //  key = String.fromCharCode(key);
        // event.returnValue = false;
        //theEvent.preventDefault();
        // }

        //  $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
        //    $(obj).val(
        //function (index, value) {
        //    return value.substr(0, value.length - 1);
        //})
        $(obj).val('');
        event.preventDefault();
    }
}
//Bind SLi Grid
function SLInfoList() {
    //debugger;
    _CURR_PRO_ = "SLIBOOKING";
    _CURR_OP_ = "SLI";
    $("#licurrentop").html(_CURR_OP_);
    $("#divSearch").html("");
    $("#divShipmentDetails").html("");
    //$("#btnSave").unbind("click");
    CleanUI();
    // cfi.ShowIndexView("divShipmentDetails", "Services/FormService.svc/GetGridData/" + _CURR_PRO_ + "/Shipment/Booking");
    $.ajax({
        url: "Services/Shipment/SLInfoService.svc/GetWebForm/" + _CURR_PRO_ + "/SLI/SLISearch/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form>");
            $("#divContent").html(divContent);
            $("#divFooter").html(fotter).show();
            //Check Page New rights
            var rights = GetPageRightsByAppName("Shipment", "SLInfo");
            if (!rights.IsNew) {
                $("#btnNew").remove();
            }

            cfi.AutoComplete("searchAPTDestCity", "AirportCode,AirportName", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
            cfi.AutoComplete("searchRouting", "AirportCode,AirportName", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
            cfi.AutoComplete("searchAirline", "CarrierCode,AirlineName", "v_ActiveAirline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");
            cfi.AutoComplete("searchAccountSNo", "AgentName", "v_WMSAgent", "SNo", "AgentName", ["AgentName"], null, "contains");
            cfi.AutoComplete("searchSLINo", "SLINO", "vGetSLINOSearch", "SLINO", "SLINO", ["SLINO"], null, "contains");

            $("#isReserved").hide();
            $("#SLIDate").val("");
            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });
            SLISearch();
            $("#btnSearch").bind("click", function () {
                CleanUI();
                $('#divShipmentDetails').unbind("click").bind("click", function () {
                    $(".k-loading-mask").attr("style", "display:none");
                })
                SLISearch();
                currentslisno = 0;
                subprocess = "";
            });
            $("#btnNew").unbind("click").bind("click", function () {
                CheckCancel = 0;
                CleanUI();
                $("#hdnAWBSNo").val("");
                currentslisno = 0;
                IsFinalSLI = false;
                IsProcessed = false;
                var module = "SLI";
                $.ajax({
                    url: "Services/Shipment/SLInfoService.svc/GetWebForm/" + _CURR_PRO_ + "/" + module + "/SLIAWB/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        $('#btnSave').show();
                        $('#btnSaveToNext').hide();
                        $("#divDetail").html(result);
                        BindSLICode();

                        if (result != undefined || result != "") {
                            InitializePage("SLIAWB", "divDetail");
                            currentprocess = "SLIAWB";
                            subprocess = currentprocess;
                            //  font
                            $('#SLINo').attr('disabled', 1);
                            OnTypeSelection("Text_BookingType");
                            $("#tblShipmentInfo").hide();
                            GetProcessSequence("SLIBOOKING");
                            CheckSLIType();
                            $('#DeclaredCustomValue').val('NCV');
                            $('#_tempDeclaredCustomValue').val('NCV');

                            $('#DeclaredCarriagevalue').val('NVD');
                            $('#_tempDeclaredCarriagevalue').val('NVD');
                            $("#DeclaredCarriagevalue").unbind("f").bind("keypress", function () {
                                ISNumeric(this);
                            });
                            $("#DeclaredCustomValue").unbind("keypress").bind("keypress", function () {
                                ISNumeric(this);
                            });
                            $("input[type=checkbox]").keydown(function (e) {
                                if (e.keyCode === 13) {
                                    e.preventDefault();
                                }
                            });
                            $("input[type=radio]").keydown(function (e) {
                                if (e.keyCode === 13) {
                                    e.preventDefault();
                                }
                            });
                            //$("#SHCStatement").hide();
                            //$("#spnSHCStatement").hide();
                            //spnSHCStatement
                            $("#Text_CurrencySNo").data("kendoAutoComplete").setDefaultValue(userContext.CurrencySNo, userContext.CurrencyCode);
                            $("#CurrencySNo").val(11);
                            //
                            $('#IDNumber').attr("data-valid", "required");
                            $('#IDNumber').attr("data-valid-msg", "Enter ID Number");
                            $('#btnSave').change(function (e) {
                                $('input[id=btnSave]').focus();
                            });
                            funValidateDeclare();
                            funRuleForHAWB();
                            $('input:radio[name=SLIType][value=1]').attr("disabled", true);
                            $('#btnSaveToNext').hide();
                            OldDestination = "";
                            OLDDestinationSNo = "";
                            $("span[class='k-picker-wrap k-state-default k-widget k-datepicker k-header k-input']").css("width", "100px");
                            $("#BOEDate").css("width", "100px");
                            $("#BOEDate").data("kendoDatePicker").value("");
                            $("#isManunal").attr("enabled", false);
                            $("#isManunal").attr("disabled", true);
                            DisabledAWBNo();

                        }
                    }
                });

            });
            $("#btnCancel").unbind("click").bind("click", function () {
                ResetDetails();
            });

        }
    });
    //DisabledAWBNo();
    //SLISearch();
}

//Check Rule For HAWB No
function funRuleForHAWB() {
    $('#HAWBNo').unbind("blur").bind("blur", function () {
        if ($(this).val() != "") {
            $('#spn').parent().find('font').text('*');
            $('#AWBNo').attr("data-valid", "minlength[8],required");
            SetAWBPrefixCode('Text_AirlineSNo');

        }
        else {
            $('#spn').parent().find('font').text('   ');
            $('#AWBNo').removeAttr("data-valid");
        }
    })
}

//On Grid Radio Button click Event For SHow/Hide Part,Edit & Final Button
function CheckSLIType() {
    $('#spn').parent().find('font').text('   ');
    $('#AWBPrefix').removeAttr("data-valid");
    $('#AWBNo').removeAttr("data-valid");
    // $('#AWBNo').attr("disabled", 1);
    // $('#AWBPrefix').attr("disabled", 1);
    $('input:radio[name=SLIType]').click(function () {
        $('#AWBPrefix').removeAttr("data-valid");
        if ($(this).val() == 1) {


            if ($("#AWBPrefix").val() == "" && $("#AWBNo").val() == "") {
                if ($("#Text_AWBNos").val() != undefined) {
                    var AWB = $("#Text_AWBNos").val();
                    $("#AWBPrefix").val(AWB.substring(0, 2));
                    $("#AWBNo").val(AWB.substring(4, 13));
                }
            }

            //  $('#AWBNo').removeAttr("disabled");
            //   $('#AWBPrefix').removeAttr("disabled");
            // debugger
            // alert(TempSLINo);
            if (TempSLINo != '')
                if (TempSLINo != $('#SLINo').val().split('-')[1]) {
                    $('input:radio[name=SLIType]:eq(0)').attr("checked", 1);
                    ShowMessage('warning', 'Warning - ' + SLICaption + '', "Only Last " + SLICaption + " Part can be marked as Final", "bottom-right");
                    // $('input:radio[name=SLIType] eq(0)').prop('checked', true);
                }

            $('#spn').parent().find('font').text('*');
            $('#spn').css("padding", "3px");
            $('#AWBNo').attr("data-valid", "minlength[8],required");
            SetAWBPrefixCode('Text_AirlineSNo');
        }
        else {
            //$('#spn').css("padding-left", "10px");
            //  $('#AWBNo').attr("disabled", 1);
            //$('#AWBPrefix').attr("disabled", 1);

            //$("#CustomerType").attr("disabled", true);
            //$("#Text_CustomerType").data("kendoAutoComplete").enable(false);
            //$("#AirlineSNo").attr("disabled", true);
            //$("#Text_AirlineSNo").data("kendoAutoComplete").enable(false);
            //$("#AccountSNo").attr("enabled", false);
            //$("#Text_AccountSNo").data("kendoAutoComplete").enable(false);
            //$("#DestinationAirportSNo").attr("enabled", false);
            //$("#Text_DestinationAirportSNo").data("kendoAutoComplete").enable(false);
            //$("#CurrencySNo").attr("enabled", false);
            //$("#Text_CurrencySNo").data("kendoAutoComplete").enable(false);

            $('#spn').parent().find('font').text('   ');
            $('#spn').css("padding", "11px");
            $('#AWBNo').removeAttr("data-valid");
        }
        //  ShowMessage('warning', 'Warning - SLI', "Not Change Final To Part ", "bottom-right");
        //$('input:radio[name=SLIType]:eq(' + resItem.SLIType + ')').attr("checked", 1);
        // alert($(this).val());
    });
}

//Get New SLI 
var GLAWBNo;
function BindSLICode() {
    $.ajax({
        url: "Services/Shipment/SLInfoService.svc/GetSLICode", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            $('#SLINo').val(Data.Table0[0].SLINo + '-1')
            $('span[id="SLINobks"]').text("/");
            $('span[id="NewSLINo"]').text(Data.Table0[0].SLINo + '-1');
            $('#Text_CustomerType').focus();
            $('#AWBPrefix').val('SLI');
            $('span[id="Hypn"]').text('-');
            $('#AWBNo').val('00' + Data.Table0[0].SLINo.substr(2, 6));
            GLAWBNo = '00' + Data.Table0[0].SLINo.substr(2, 6);
            $("#isReserved").hide();
            $("#isReserved").attr("title", "Select to fetch Reserved AWB List");
            $("#isReserved").livetooltip();
        }
    });
}
//Bind All Process
var subprocess = "";
function BindEvents(obj, e, isdblclick) {

    $("#divGraph").show();
    // debugger


    $("#divXRAY").hide();
    if ($(obj).attr("class") == "dependentprocess")
        _IS_DEPEND = true;
    else
        _IS_DEPEND = false;
    ResetDetails();
    $("#btnCancel").unbind("click").bind("click", function () {
        ResetDetails();
    });

    subprocess = $(obj).attr("process").toUpperCase();
    currentprocess = subprocess;
    var closestTr = $(obj).closest("tr");

    var sliSNoIndex = 0;
    var sliNoIndex = 0;
    var trLocked = $(".k-grid-header-wrap tr");
    var trRow = $(".k-grid-header-wrap tr");
    //console.log($(trLocked).html())
    //  sliSNoIndex =trRow  0;
    //var trRow = $(obj).closest("div.k-grid").find("div.k-grid-header").find("tr[role='row']");
    sliSNoIndex = 1;
    var isBUPIndex = trLocked.find("th[data-field='isBup']").index();
    var IsProcessedIndex = trLocked.find("th[data-field='IsProcessed']").index();
    var IsFinalSLIIndex = trLocked.find("th[data-field='IsFinalSLI']").index();
    sliNoIndex = trLocked.find("th[data-field='SLINo']").index();
    currentslisno = closestTr.find("td:eq(" + sliSNoIndex + ")").text();
    slino = closestTr.find("td:eq(" + sliNoIndex + ")").text();
    isBUP = closestTr.find("td:eq(" + isBUPIndex + ")").text() == "true" ? true : false;
    IsProcessed = closestTr.find("td:eq(" + IsProcessedIndex + ")").text() == "true" ? true : false;
    IsFinalSLI = closestTr.find("td:eq(" + IsFinalSLIIndex + ")").text() == "true" ? true : false;
    // alert(closestTr.find("td:eq(" + sliSNoIndex + ")").text());
    //alert(slino)
    // alert(currentslisno)
    $('#btnSave').show();
    $('#btnSaveToNext').show();
    ShowProcessDetails(subprocess, isdblclick);

    if (IsFinalSLI) {

        //$("#StartTemperature").val(resItem.StartTemperature);
        //$("#EndTemperature").val(resItem.EndTemperature);
        //$("#_tempStartTemperature").val(resItem.StartTemperature);
        //$("#_tempEndTemperature").val(resItem.EndTemperature);
        var IsEnabled = false;
        if (subprocess == "SLIDIMENSION") {
            $(userContext.ProcessRights).each(function (i, e) {
                if (e.SubProcessSNo == 1053) {
                    if (e.IsEdit == true) {
                        IsEnabled = true;
                    }
                }
            });
        }
        if (subprocess == "LOCATION") {
            $(userContext.ProcessRights).each(function (i, e) {
                if (e.SubProcessSNo == 2147) {
                    if (e.IsEdit == true) {
                        IsEnabled = true;
                    }
                }
            });
        }

        if (IsEnabled == false) {

            //if (IsFinalSLI == true)
            //{
            //    $('#divDetail input,#divDetail select').attr('disabled', 1);
            //    $('#btnSave').hide();
            //    $('#divDetail input[controltype="autocomplete"]').each(function () {
            //        $("#" + $(this).attr("name")).data("kendoAutoComplete").enable(false);
            //    });
            //}

            if (SLIPartAfterFinal == 0) {
                $('#divDetail input,#divDetail select').attr('disabled', 1);
                $('#btnSave').hide();
                $('#divDetail input[controltype="autocomplete"]').each(function () {
                    $("#" + $(this).attr("name")).data("kendoAutoComplete").enable(false);
                });
            }
            if (AfterFinalCountSinglePart == 1 && subprocess.toUpperCase() == "SLICHARGES") {
                $('#divDetail input,#divDetail select').attr('enabled', true);
                $('#divDetail input,#divDetail select').attr('disabled', false);
                $('#btnSave').show();
                $('#divDetail input[controltype="autocomplete"]').each(function () {
                    $("#" + $(this).attr("name")).data("kendoAutoComplete").enable(true);
                });

            }
            if (subprocess.toUpperCase() == "SLICUSTOMER" && MultipleSLIcountafterFinal > 1) {
                $('#divDetail input,#divDetail select').attr('enabled', true);
                $('#divDetail input,#divDetail select').attr('disabled', false);
                $('#btnSave').show();
                $('#divDetail input[controltype="autocomplete"]').each(function () {
                    $("#" + $(this).attr("name")).data("kendoAutoComplete").enable(true);
                });
            }
            if (subprocess.toUpperCase() == "SLICUSTOMER" && MultipleSLIcountafterFinal == 0) {
                $('#divDetail input,#divDetail select').attr('enabled', false);
                $('#divDetail input,#divDetail select').attr('disabled', true);
                $('#btnSave').hide();
                $('#divDetail input[controltype="autocomplete"]').each(function () {
                    $("#" + $(this).attr("name")).data("kendoAutoComplete").enable(false);
                });
            }
            if (subprocess.toUpperCase() == "SLIUNLOADING" && IsFinalSLI == true) {
                $('#divDetail input,#divDetail select').attr('enabled', false);
                $('#divDetail input,#divDetail select').attr('disabled', true);
                $('#btnSave').hide();
                $('#divDetail input[controltype="autocomplete"]').each(function () {
                    $("#" + $(this).attr("name")).data("kendoAutoComplete").enable(false);
                });
            }
            if (subprocess.toUpperCase() == "SLICANCELLATIONSEARCH") {
                $('#divDetail input,#divDetail select').attr('enabled', true);
                $('#divDetail input,#divDetail select').attr('disabled', false);
                $('#divDetail input[controltype="autocomplete"]').each(function () {
                    $("#" + $(this).attr("name")).data("kendoAutoComplete").enable(true);
                });
                $('#btnSave').show();

                $("div[id$='divareaTrans_sli_slicancellation']").find("[id^='areaTrans_sli_slicancellation']").each(function () {
                    var chk = $(this).find("input[type='checkbox']");
                    chk.attr("checked", (chk.val() == 1))
                    if ($(this).find("input[type='checkbox']").prop("checked") == true) {
                        $(this).find("input[type='checkbox']").attr("disabled", "disabled");
                    }
                });

            }
            $('#btnSaveToNext').hide();

            //$('#divareaTrans_sli_slidimension table tr[id^="areaTrans_sli_slidimension"]').each(function (row,tr) {
            $('#divareaTrans_sli_slidimension table tr[id^="areaTrans_sli_slidimension"]').each(function (row, tr) {
                $(tr).find('td:last div').remove();
            })

            $('#divareaTrans_sli_sliulddimension table tr[id^="areaTrans_sli_sliulddimension"]').each(function (row, tr) {
                $(tr).find('td:last div').remove();
            })
            if (AfterFinalCountSinglePart == 0) {
                $('#divareaTrans_sli_slicharges table tr[id^="areaTrans_sli_slicharges"]').each(function (row, tr) {
                    $(tr).find('td:last div').remove();
                })
            }

            $('#divareaTrans_sli_slidimension table tr:first td:last').text("");
            $('#divareaTrans_sli_sliulddimension table tr:eq(2) td:last').text("");
            if (AfterFinalCountSinglePart == 0) {
                $('#divareaTrans_sli_slicharges table tr:eq(2) td:last').text("");
            }
            $('#btnSLIPrint').removeAttr('disabled');

        }
        IsEnabledDim = false;
        //$('#divareaTrans_sli_sliulddimension')
    }

    //$('#divareaTrans_sli_sliunloading table tr:eq(2) td:last').text("");
    //$('#divareaTrans_sli_sliunloading table tr[id^="areaTrans_sli_sliunloading"]').each(function (row, tr) {
    //    $(tr).find('td:last div').remove();
    //})

    // $('#BOENumber').parent().prev().css('display', 'none');
    //  $('#BOENumber').parent().css('display', 'none');
    //  $('#spnBOENo').css('display', 'none');
    // $('#BOENo').css('display', 'none');

    //debugger
    GetProcessSequence("SLIBOOKING");



    $("#btnSave").unbind("click").bind("click", function () {
        //alert('Test');
        if (cfi.IsValidSection('divDetail')) {
            if (true) {
                if (SaveFormData(subprocess))
                    SLISearch();
            }
        }
        else {
            return false
        }
    });
}


function ResetDetails(obj, e) {
    $("#divDetail").html("");
    $("#tblShipmentInfo").hide();
    $("#divNewBooking").html("");

}

function ShowProcessDetails(subprocess, isdblclick) {
    //if (subprocess.toUpperCase() == "SLICHARGES") {

    //    var ChargeDiv = '';
    //    var ChargeVal = '';
    //    var ParentChargeDiv = '';

    //    $.ajax({
    //        url: "Services/Shipment/SLInfoService.svc/GetSLIChargeHeader", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
    //        success: function (result) {
    //            var Data = jQuery.parseJSON(result);

    //            $(Data.Table0).each(function (row, tr) {
    //                if (tr.IsESS == "True") {
    //                    ChargeDiv = ChargeDiv + '<td><label>' + tr.ChargeCode + '</label></td>';
    //                    ChargeVal = ChargeVal + '<td><input type="checkbox" value="' + tr.SNo + '"></td>';
    //                }
    //                else {
    //                    ParentChargeDiv = ParentChargeDiv + '</tr><tr><td><input type="checkbox"  value="' + tr.SNo + '"></td><td><label>' + tr.ChargeCode + '</label></td><td>ESS#</td></tr>';
    //                }

    //            });
    //        },
    //        beforeSend: function (jqXHR, settings) {
    //        },
    //        complete: function (jqXHR, textStatus) {
    //        },
    //        error: function (xhr) {
    //            var a = "";
    //        }
    //    });
    //    $("#divDetail").empty();
    //    $("#divDetail").append('<div id="divDetail"><table width="100%" style="border-spacing: 0;" id="tblslidimension"><tbody><tr><td><div id="__divslidimension__"><table class="WebFormTable" id="__tblslidimension__"><tbody><tr><td class="formSection" colspan="6">Charges Information</td></tr><tr><td  colspan="6"><div id="dv_Charges"></div></td></tr></tbody></table></div></td></tr></tbody></table></div>');
    //    $('#dv_Charges').append('<table class="WebFormTable"><tbody> <tr>' +
    //        '<td rowspan="3" colspan="5"><table><tr><td colspan="3">ACCOUNTING INFORMATION</td></tr>' + ParentChargeDiv + '</table></td> </tr> <tr><td colspan="5" >Statistics-All changes are verified against the SOP</td></tr> <tr> <td colspan="5"><input type="radio" value="1"> Yes<input type="radio" value="0">No</td></tr>' +
    //'<tr>' +
    // ' <td colspan="10"> ESS Check-list</td>' +
    //'</tr><tr><td>Charges</td>' + ChargeDiv + '</tr><tr><td></td>' + ChargeVal + '</tr></tbody></table>');

    //    InitializePage(subprocess, "divDetail", isdblclick);   
    //}
    //else {
    var IsPrint = false;
    $(userContext.ProcessRights).each(function (i, e) {
        if (e.SubProcessSNo == 2074) {
            IsPrint = true;
        }
    });

    if (subprocess.toUpperCase() == "SLIPRINT" && IsPrint == true) {

        // if (IsPrint == true) {
        $('#btnSave').hide();
        $('#btnSaveToNext').hide();

        $.ajax({
            url: "SLI.html", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#divDetail").html(result);
                if (result != undefined || result != "") {

                    InitializePage(subprocess, "divDetail", isdblclick);
                    $("#Validate").addClass("btn-info");

                }
            },
            beforeSend: function (jqXHR, settings) {
            },
            complete: function (jqXHR, textStatus) {
            },
            error: function (xhr) {
                // var a = "";
            }
        });
        //}     
    }
    else {
        //if (IsPrint == false && subprocess.toUpperCase() == "SLIDIMENSION")
        //{
        //    subprocess = "LOCATION";
        //}


        $.ajax({
            url: "Services/Shipment/SLInfoService.svc/GetWebForm/" + _CURR_PRO_ + "/SLI/" + subprocess + "/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#divDetail").html(result);
                if (result != undefined || result != "") {

                    InitializePage(subprocess, "divDetail", isdblclick);
                    $("#Validate").addClass("btn-info");
                }
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
    // }

}

// Search in Grid 
function SLISearch() {

    var DestinationAirportSNo = $("#Text_searchAPTDestCity").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_searchAPTDestCity").data("kendoAutoComplete").key();
    var AirlineSNo = $("#Text_searchAirline").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_searchAirline").data("kendoAutoComplete").key();
    var RoutingCitySNo = $("#Text_searchRouting").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_searchRouting").data("kendoAutoComplete").key();
    var searchAccountSNo = $("#Text_searchAccountSNo").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_searchAccountSNo").data("kendoAutoComplete").key();
    var searchSLINo = $("#Text_searchSLINo").data("kendoAutoComplete").key() == "" ? "0" : $("#Text_searchSLINo").data("kendoAutoComplete").key(); //searchSLINo    //$("#searchSLINo").val() == "" ? "A~A" : $("#searchSLINo").val();
    var AWBPrefix = $("#searchAWBPrefix").val() == "" ? "A~A" : $("#searchAWBPrefix").val();
    var AWBNo = $("#searchAWBNo").val() == "" ? "A~A" : $("#searchAWBNo").val();
    var LoggedInCity = userContext.CityCode;
    var SLIDate = $("#SLIDate").val() == "" ? null : $("#SLIDate").val();
    // var searchSLIDate = new Date(SLIDate);
    $("#imgprocessing").show();
    if (_CURR_PRO_ == "SLIBOOKING") {
        cfi.ShowIndexView("divShipmentDetails", "Services/Shipment/SLInfoService.svc/GetSLIGridData/" + _CURR_PRO_ + "/SLI/SLInfo/" + DestinationAirportSNo + "/" + AirlineSNo + "/" + RoutingCitySNo + "/" + AWBPrefix + "/" + AWBNo + "/" + LoggedInCity + "/" + searchAccountSNo + "/" + searchSLINo + "/" + SLIDate, "Scripts/maketrans.js?" + Math.random());

    }
    $('td[class="form2buttonrow"]').hide();
    $("#imgprocessing").hide();

}
//function onGridDataBound(e)
//{
//    console.log ('test');
//}

// Load Part & Final and check Hide & Show
function OnSuccessGrid() {
    $('td[class="form2buttonrow"]').hide();

    var TrHeader = $("div[id$='divShipmentDetails']").find("div[class^='k-grid-header'] thead tr");
    var IsFinalSLIIndex = TrHeader.find("th[data-field='IsFinalSLI']").index();
    var SLIFlagIndex = TrHeader.find("th[data-field='SLIFlag']").index();

    $("div[id$='divShipmentDetails']").find("div[class^='k-grid-content'] tbody tr").each(function (row, tr) {
        $(this).unbind("click").bind("click", function () {
            var recId = $(tr).find("input[type='radio']").val();
            if (!(recId == undefined || recId == "")) {
                $(tr).find("input[type='radio']").attr("checked", true);

                if ($(tr).find("td:eq(" + SLIFlagIndex + ")").text() == "false") {

                    $(".tool-items").find(".actionSpan").each(function () {

                        if ($(this).text().toUpperCase() == "PART") {
                            $(this).closest("a").css("display", "none");
                        }
                        if ($(this).text().toUpperCase() == "FINAL") {
                            $(this).closest("a").css("display", "none");
                        }

                    });

                } else {

                    $(".tool-items").find(".actionSpan").each(function () {

                        if ($(this).text().toUpperCase() == "PART") {
                            $(this).closest("a").css("display", "block");
                        }

                        if ($(this).text().toUpperCase() == "FINAL") {
                            if ($(tr).closest('tr').find("input[process='SLIUNLOADING']").attr("class") == "completeprocess") {
                                $(this).closest("a").css("display", "block");
                                // $(this).closest("a").attr("disabled", false);
                            }
                            else if (userContext.GroupName.toUpperCase() == "AGENT") {
                                if ($(tr).closest('tr').find("input[process='SLICUSTOMER']").attr("class") == "completeprocess") {
                                    $(this).closest("a").css("display", "block");
                                }
                                else {
                                    $(this).closest("a").css("display", "none");
                                }
                            }
                            else {
                                $(this).closest("a").css("display", "none");
                            }

                        }
                    });

                }

            }
        });
    });

    HighLightGridButton($("input[value='" + currentslisno + "']").closest("tr").find("input[process='" + currentprocess.toUpperCase() + "']"));

    //$("div[id$='divShipmentDetails']").find("div[class^='k-grid-content'] tbody tr").each(function (row, tr) {
    //    //$(tr).find('td:first input[name^="faction"]').each(function () {
    //    //    $(this).prop('checked', false);
    //    //});
    //    if ($(tr).find("td:eq(" + SLIFlagIndex + ")").text() == "false") {
    //        // $(tr).find('div[id$="user-options"]').remove();

    //        $(tr).find("input[name^='faction']").parent().unbind("click").bind("click", function () {
    //           return false;
    //        });
    //}
    //})
}

//For Set all process color 
function checkProgrss(item, subprocess, displaycaption) {
    //$('div[id$="user-options"]').remove();
    //$("input[name^='faction']").unbind("click").bind("click", function () { alert('nbwejkrfber huif'); return false; });
    //dependentprocess
    //BindFlightChart(DailyFlightSNo.substr(1, DailyFlightSNo.length));

    //if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_0_D" + ",") >= 0) {
    //    return "\"dependentprocess\"";
    //}
    //else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_1_D" + ",") >= 0) {
    //    return "\"dependentprocess\"";
    //}
    //else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_0_I" + ",") >= 0) {
    //    return "\"partialprocess\"";
    //}
    //else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_1_I" + ",") >= 0) {
    //    return "\"completeprocess\"";
    //}
    //else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_0" + ",") >= 0) {
    //    return "\"partialprocess\"";
    //}
    // ,SLICUSTOMER_1_F,SLIAWB_1_F,SLIDIMENSION_1_F,SLICHARGES_1_F,SLIUNLOADING_0_F,SLIPRINT_-1
    if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_1_P") >= 0) {
        return "\"completeprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_1_F") >= 0) {
        return "\"completeprocess\"";
    }
    else if ((item).toUpperCase().indexOf("," + subprocess.toUpperCase() + "_2_F") >= 0) {
        return "\"partialprocess\"";
    }
    else {
        return "\"incompleteprocess\"";
    }
}
//////1.1.2015




/////////
function CleanUI() {
    $("#divXRAY").hide();
    $("#tblShipmentInfo").hide();
    $("#divDetail").html("");
    $("#divDetail").html("");
    $("#tblShipmentInfo").hide();
    $("#divNewBooking").html("");
    $("#btnSave").unbind("click");
    $("#btnSaveToNext").unbind("click");
    $("#divXRAY").hide();

    $("#ulTab").hide();
    $("#divDetail_SPHC").html("");
}


function InitializePage(subprocess, cntrlid, isdblclick) {
    $("#tblShipmentInfo").show();
    InstantiateControl(cntrlid);
    $('#btnSave').text('Save')
    $('#btnSaveToNext').text('Save & Next')
    // alert(subprocess.toUpperCase());
    if (subprocess.toUpperCase() == "SLICUSTOMER") {
        BindSLICustomerInfo();
        subprocess = "SLICUSTOMER";
        UserSubProcessRights("__divslicustomer__", 1051);
    }
    else if (subprocess.toUpperCase() == "SLIDIMENSION") {
        BindSLIDimensionEvents();
        subprocess = "SLIDIMENSION";
        $("#__divslidimension__").keydown(function (event) {
            if (event.keyCode == 13) {
                return false;
            }
        });
        UserSubProcessRights("__divslidimension__", 1053);
        if (IsFinalSLI == true && CountPart > 2) {
            $('#divareaTrans_sli_slidimension table tr[id^="areaTrans_sli_slidimension"]').each(function (row, tr) {
                $(tr).find('td:last div').remove();
            })

            $('#divareaTrans_sli_sliulddimension table tr[id^="areaTrans_sli_sliulddimension"]').each(function (row, tr) {
                $(tr).find('td:last div').remove();
            })
            if (NoDim == 0) {
                $('#btnSaveToNext').hide();
                $('#btnSave').hide();
            }
        }
        if (CustomerTypeCount == 1) {
            $("div[id$='divareaTrans_sli_slidimension']").find("td[title='Enter Length']").find("font[color='red']").css("color", "white");
            $("div[id$='divareaTrans_sli_slidimension']").find("td[title='Enter Width']").find("font[color='red']").css("color", "white");
            $("div[id$='divareaTrans_sli_slidimension']").find("td[title='Enter Height']").find("font[color='red']").css("color", "white");
        }
        //if (CustomerTypeCount == 2) {
        //    $("div[id$='divareaTrans_sli_slidimension']").find("td[title='Enter Length']").find("font[color='red']").css("color", "red");
        //    $("div[id$='divareaTrans_sli_slidimension']").find("td[title='Enter Width']").find("font[color='red']").css("color", "red");
        //    $("div[id$='divareaTrans_sli_slidimension']").find("td[title='Enter Height']").find("font[color='red']").css("color", "red");
        //}
        if (CustomerTypeCount == 2) {
            $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").each(function () {
                $(this).find('input[id^="_tempVolumeWt"]').attr("enabled", false);
                $(this).find('input[id^="VolumeWt"]').attr("enabled", false);
                $(this).find('input[id^="_tempVolumeWt"]').attr("disabled", true);
                $(this).find('input[id^="VolumeWt"]').attr("disabled", true);
                $(this).find('input[id^="_tempSLICBM"]').attr("enabled", false);
                $(this).find('input[id^="SLICBM"]').attr("enabled", false);
                $(this).find('input[id^="_tempSLICBM"]').attr("disabled", true);
                $(this).find('input[id^="SLICBM"]').attr("disabled", true);
            });
        }

    }
    else if (subprocess.toUpperCase() == "SLIAWB") {
        subprocess = "SLIAWB";
        BindSLIAWB();
        DisabledAWBNo();
        $("div[id='divMultiSPHCCode']").css("overflow", "auto");
        $("div[id='divMultiSPHCCode']").css("width", "15em");
        $("#agentBup").attr("disabled", "disabled");
        UserSubProcessRights("__divsliawb__", 1052);
        if (BOEDate != "") {
            $("#BOEDate").data("kendoDatePicker").value(BOEDate);
        }
        else {
            $("#BOEDate").data("kendoDatePicker").value("");
            $("#BOEDate").val("");
        }
        if (userContext.GroupName.toUpperCase() == "AGENT") {
            $("#Text_CustomerType").data("kendoAutoComplete").setDefaultValue(1, "REGULAR");
            $("#CustomerType").val(1);
            $("#Text_CustomerType").data("kendoAutoComplete").enable(false);
            $("#ChargeCode").val(1);
            $("#Text_ChargeCode").data("kendoAutoComplete").setDefaultValue(1, "PP-PREPAID");
            $("#AccountSNo").val(userContext.AgentSNo);
            $("#Text_AccountSNo").data("kendoAutoComplete").setDefaultValue(userContext.AgentSNo, userContext.AgentName);
            $("#Text_AccountSNo").data("kendoAutoComplete").enable(false);
            $("input:checkbox[name=isBup]").attr("enabled", false);
            $("input:checkbox[name=isBup]").attr("disabled", true);
            $("#Shipper_Agent").val(userContext.AgentName);
        }
        //$("#Text_Type").unbind("blur").bind("blur", function () { 
        //    test();
        //});
    }
    else if (subprocess.toUpperCase() == "SLICHARGES") {
        subprocess = "SLICHARGES";
        BindSLICharges();
        UserSubProcessRights("__divslicharges__", 1055);
        // return
    }
    else if (subprocess.toUpperCase() == "SLIUNLOADING") {
        subprocess = "SLIUNLOADING";
        //$('#divareaTrans_sli_sliunloading table tr:eq(2) td:last').text("");
        //$('#divareaTrans_sli_sliunloading table tr[id^="areaTrans_sli_sliunloading"]').each(function (row, tr) {
        //    $(tr).find('td:last div').remove();
        //})
        BindSLIUnloading();
        UserSubProcessRights("__divsliunloading__", 2072);
    }
    else if (subprocess.toUpperCase() == "SLIPRINT") {
        subprocess = "SLIPRINT";
        $("#btnSave").hide();
        GetSLIPrintData();
    }
    else if (subprocess.toUpperCase() == "LOCATION") {
        subprocess = "LOCATION";
        BindLocationEvents(isdblclick);
        $("#__divlocation__").keydown(function (event) {
            if (event.keyCode == 13) {
                return false;
            }
        });
        UserSubProcessRights("__divlocation__", 2147);
        $('#btnSaveToNext').hide();
    }
    else if (subprocess.toUpperCase() == "SLICANCELLATIONSEARCH") {
        InitializePaymentData();
        UserSubProcessRights("__divslicancellationsearch__", 2328);
        $("#btnSaveToNext").hide();
    }
    //$("#EndTempreature").keypress(function (e) {
    //    debugger;
    //    var StartTemperature = parseInt($("#StartTemperature").val());
    //    var EndTempreature = parseInt($("#EndTempreature").val());
    //    if (EndTempreature > StartTemperature) {
    //        ShowMessage('warning', 'Warning - Temperature', "End Tempreature should be less than Start Temperature.", "bottom-right");
    //    }
    //});
    //$("#EndTempreature").after("°C");

    // alert(cntrlid);
    $('#btnSave').change(function (e) {
        $('input[id=btnSave]').focus();
    });
    if (subprocess.toUpperCase() != "SLICHARGES")
        InstantiateControl(cntrlid);
    $("#btnSave").unbind("click").bind("click", function () {
        // alert('Test');
        if (cfi.IsValidSection('divDetail')) {
            if (true) {
                if (SaveFormData(subprocess))
                    SLISearch();
            }
        }
        else {
            return false
        }
    });
    $("#btnSaveToNext").unbind("click").bind("click", function () {
        // debugger
        var saveflag = false;
        if (cfi.IsValidSection('divDetail')) {
            if (true) {
                saveflag = SaveFormData(subprocess);
            }
        }
        else {
            saveflag = false
        }
        if (saveflag) {
            SLISearch();
            for (var i = 0; i < processList.length; i++) {
                if (processList[i].value.toUpperCase() == currentprocess.toUpperCase() && i < (processList.length - 1)) {
                    if (currentslisno > 0) {
                        currentprocess = processList[i + 1].value;
                        subprocess = processList[i + 1].value;
                        ShowProcessDetails(currentprocess, processList[i + 1].isoneclick);

                    }
                    else {
                        CleanUI();
                        SLISearch();
                        //cfi.ShowIndexView("divShipmentDetails", "Services/Shipment/AcceptanceService.svc/GetGridData/" + _CURR_PRO_ + "/Shipment/Booking");
                    }
                    return;
                }
            }
        }
    });

}
function ResetPieces() {
    $("#Piecestobeweighed").val("");
    $("#_tempPiecestobeweighed").val("");
    $("#toPiecestobeweighed").val("")
    $("#_temptoPiecestobeweighed").val("")
}
function SwitchScanType(val, obj) {
    var closesttable = $(obj).closest("table");
    var closesttrindex = $(obj).closest("tr").index();
    closesttable.find("tr:eq(" + (closesttrindex + 1).toString() + ")").hide();
    closesttable.find("tr:eq(" + (closesttrindex + 2).toString() + ")").hide();
    closesttable.find("tr:eq(" + (closesttrindex + 3).toString() + ")").hide();
    closesttable.find("tr:eq(" + (closesttrindex + 4).toString() + ")").hide();
    if (val == "0") {
        closesttable.find("tr:eq(" + (closesttrindex + 1).toString() + ")").show();
        closesttable.find("tr:eq(" + (closesttrindex + 2).toString() + ")").show();
        closesttable.find("tr:eq(" + (closesttrindex + 3).toString() + ")").hide();
        closesttable.find("tr:eq(" + (closesttrindex + 4).toString() + ")").show();
    }
    else if (val == "1") {
        closesttable.find("tr:eq(" + (closesttrindex + 1).toString() + ")").hide();
        closesttable.find("tr:eq(" + (closesttrindex + 2).toString() + ")").hide();
        closesttable.find("tr:eq(" + (closesttrindex + 3).toString() + ")").show();
        closesttable.find("tr:eq(" + (closesttrindex + 4).toString() + ")").show();
    }
    SetTotalPcs();
}
function ValidateLocationProcess(obj) {
    if ($("#Text_SLINo").data("kendoAutoComplete").key() == "") {
        ShowMessage('warning', 'Information!', "Select " + SLICaption + " for processing.", "bottom-right");
        return;
    }
    if (parseInt($("#Piecestobeweighed").val() == "" ? "0" : $("#Piecestobeweighed").val()) <= 0) {
        ShowMessage('warning', 'Information!', "Enter Pieces.", "bottom-right");
        $("#Piecestobeweighed").focus();
        return;
    }
    if (parseInt($("#toPiecestobeweighed").val() == "" ? "0" : $("#toPiecestobeweighed").val()) <= 0) {
        ShowMessage('warning', 'Information!', "Enter Pieces.", "bottom-right");
        $("#toPiecestobeweighed").focus();
        return;
    }

    var selectedtype = $(obj).closest("table").find("[id='Type']:checked").val();
    var pieceSequence = "";
    var processedpcs = "";
    var processedpcscount = 0;
    $("div[id='divareaTrans_sli_slilocationdetail']").find("span[id^='ScanPieces']").wrap("<div class='new' style='word-wrap:break-word; display:block; width:330px;'></div>");
    $("div[id='divareaTrans_sli_slilocationdetail']").find("table:first").find("tr[id^='areaTrans_sli_slilocationdetail']").each(function () {
        if ($(this).find("input[id^='ScanPieces']").length > 0) {
            if ($(this).find("input[id^='ScanPieces']").val() != "") {
                if ($(this).find("span[id^='SLINo_']").text() == $("#Text_SLINo").val().split("-")[0]) {
                    processedpcscount = processedpcscount + $(this).find("input[id^='ScanPieces']").val().split(",").length;
                    processedpcs = (processedpcs == "" ? "" : (processedpcs + ",")) + $(this).find("input[id^='ScanPieces']").val();
                }

            }
        }
    });
    //--
    var ULDLocationPcs = 0;
    $("div[id='divareaTrans_sli_sliuldlocation']").find("table:first").find("tr[id^='areaTrans_sli_sliuldlocation']").each(function () {
        ULDLocationPcs += 1;
    });
    //--
    //if (processedpcscount + ULDLocationPcs == parseInt($("#TotalPieces").val())) {
    if (processedpcscount == parseInt($("#Text_SLINo").val().split("-")[1])) {
        ShowMessage('warning', 'Information!', "No piece for processing.", "bottom-right");
        $("#Piecestobeweighed").val("");
        $("#toPiecestobeweighed").val("")
        return;
    }
    //var totalPcs = parseInt($("#TotalPieces").val());if (processedpcscount == parseInt($("#Text_SLINo").val().split("-")[1])) {
    var totalPcs = parseInt($("#Text_SLINo").val().split("-")[1]);
    var processedpcsarray = processedpcs.split(",");
    var alreadyprocessed = "";
    var isProcessed = false;
    if (selectedtype == "0") {
        pieceSequence = "";
        var startPicesno = parseInt($("#Piecestobeweighed").val() == "" ? "0" : $("#Piecestobeweighed").val());
        var endPicesno = parseInt($("#toPiecestobeweighed").val() == "" ? "0" : $("#toPiecestobeweighed").val());
        if (startPicesno > endPicesno || isNaN(startPicesno) || isNaN(endPicesno) || startPicesno <= 0 || endPicesno <= 0) {
            ShowMessage('warning', 'Information!', "Invalid piece sequence.", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
        //if (startPicesno > totalPcs || (endPicesno + ULDLocationPcs) > totalPcs) {
        if (startPicesno > totalPcs || endPicesno > totalPcs) {
            ShowMessage('warning', 'Information!', "Invalid piece sequence.", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
        processedpcsarray = processedpcs.split(",");
        alreadyprocessed = "";
        isProcessed = false;
        if ($.inArray(startPicesno.toString(), processedpcsarray) >= 0) {
            alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + startPicesno.toString();
            isProcessed = true;
        }
        pieceSequence = startPicesno.toString();
        for (var i = startPicesno + 1; i < endPicesno; i++) {
            if ($.inArray(i.toString(), processedpcsarray) >= 0) {
                alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + i.toString();
                isProcessed = true;
            }
            if (!isProcessed)
                pieceSequence = pieceSequence + "," + i.toString();
        }
        if (startPicesno != endPicesno) {
            if ($.inArray(endPicesno.toString(), processedpcsarray) >= 0) {
                alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + endPicesno.toString();
                isProcessed = true;
            }
            pieceSequence = pieceSequence + "," + endPicesno.toString();
        }
        if (isProcessed) {
            ShowMessage('warning', 'Information!', "Already processed piece: [" + alreadyprocessed + "]", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
    }
    else if (selectedtype == "1") {
        pieceSequence = "";
        var b_process = $("#AWBNo").val().split(',');
        var isInvalidPcs = false;
        var invalidPcs = "";

        processedpcsarray = processedpcs.split(",");
        alreadyprocessed = "";
        isProcessed = false;
        var currpcs = 0;
        for (var i = 0; i < b_process.length; i++) {
            if (isNaN(b_process[i].replace("-", ""))) {
                invalidPcs = (invalidPcs == "" ? "" : (invalidPcs + ",")) + b_process[i];
                isInvalidPcs = true;
            }
            if (isNaN(parseInt(b_process[i].replace(AWBNo, "")))) {
                invalidPcs = (invalidPcs == "" ? "" : (invalidPcs + ",")) + b_process[i];
                isInvalidPcs = true;
            }
            if (parseInt(b_process[i].replace(AWBNo, "")) > totalPcs) {
                invalidPcs = (invalidPcs == "" ? "" : (invalidPcs + ",")) + b_process[i];
                isInvalidPcs = true;
            }
            if (!isInvalidPcs) {
                currpcs = parseInt(b_process[i].replace(AWBNo.html(), ""));
                if ($.inArray(currpcs.toString(), processedpcsarray) >= 0) {
                    alreadyprocessed = (alreadyprocessed == "" ? "" : (alreadyprocessed + ",")) + currpcs.toString();
                    isProcessed = true;
                }
                if (!isProcessed)
                    pieceSequence = (pieceSequence == "" ? "" : (pieceSequence + ", ")) + currpcs.toString();
            }
        }
        if (isProcessed) {
            ShowMessage('warning', 'Information!', "Already processed piece: [" + alreadyprocessed + "]", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
        if (isInvalidPcs) {
            ShowMessage('warning', 'Information!', "Invalid piece: [" + invalidPcs + "]", "bottom-right");
            $("#Piecestobeweighed").val("");
            $("#toPiecestobeweighed").val("")
            return;
        }
        //alert(pieceSequence);
    }

    var TxtSliSNo = $("#Text_SLINo").data("kendoAutoComplete").key();
    var SLISNO = TxtSliSNo.split('!')[0];
    var StartTemp = TxtSliSNo.split('!')[1];
    var EndTemp = TxtSliSNo.split('!')[2];

    var SLINO = $("#Text_SLINo").val().split("-")[0];
    var HAWBNO = $("#Text_SLINo").val().split("-")[2];

    handleAdd($("div[id='divareaTrans_sli_slilocationdetail']").find("table:first").find("tr[id^='areaTrans_sli_slilocationdetail']:last").find("td:last"), "areaTrans_sli_slilocationdetail", pieceSequence, "ScanPieces", "RemainingPieces", BindLocationAutoComplete, null, ReBindLocationAutoComplete);

    $("div[id='divareaTrans_sli_slilocationdetail']").find("table:first").find("tr[id^='areaTrans_sli_slilocationdetail']:last").find("input[type=hidden][id^='SLISNo']").val(SLISNO);
    $("div[id='divareaTrans_sli_slilocationdetail']").find("table:first").find("tr[id^='areaTrans_sli_slilocationdetail']:last").find("span[id^='SLISNo']").html(SLISNO);

    $("div[id='divareaTrans_sli_slilocationdetail']").find("table:first").find("tr[id^='areaTrans_sli_slilocationdetail']:last").find("input[type=hidden][id^='SLINo']").val(SLINO);
    $("div[id='divareaTrans_sli_slilocationdetail']").find("table:first").find("tr[id^='areaTrans_sli_slilocationdetail']:last").find("span[id^='SLINo']").html(SLINO);

    $("div[id='divareaTrans_sli_slilocationdetail']").find("table:first").find("tr[id^='areaTrans_sli_slilocationdetail']:last").find("input[type=hidden][id^='HAWBNo']").val(HAWBNO);
    $("div[id='divareaTrans_sli_slilocationdetail']").find("table:first").find("tr[id^='areaTrans_sli_slilocationdetail']:last").find("span[id^='HAWBNo']").html(HAWBNO);

    $("div[id='divareaTrans_sli_slilocationdetail']").find("table:first").find("tr[id^='areaTrans_sli_slilocationdetail']:last").find("input[type=hidden][id^='StartTemp']").val(StartTemp);
    $("div[id='divareaTrans_sli_slilocationdetail']").find("table:first").find("tr[id^='areaTrans_sli_slilocationdetail']:last").find("span[id^='StartTemp']").html(StartTemp);

    $("div[id='divareaTrans_sli_slilocationdetail']").find("table:first").find("tr[id^='areaTrans_sli_slilocationdetail']:last").find("input[type=hidden][id^='EndTemp']").val(EndTemp);
    $("div[id='divareaTrans_sli_slilocationdetail']").find("table:first").find("tr[id^='areaTrans_sli_slilocationdetail']:last").find("span[id^='EndTemp']").html(EndTemp);

    $("div[id='divareaTrans_sli_slilocationdetail']").find("tr[id^='areaTrans_sli_slilocationdetail']").find("input[id^='Text_Location'").closest('span').css('width', '');


    $('#divareaTrans_sli_sliuldlocation table tr').each(function (row, tr) {
        $(tr).find("[id^='Text_ULDLocation']").css("width", "150px");
        $(tr).find("[id^='Text_ULDConsumablesSno']").css("width", "150px");
    });


}
function SetTotalPcs() {

    var totalPcs = TotPcs;
    //var totalPcs = parseInt($("#tdPcs").html());
    var addedPcs = 0;
    var remainingPcs = totalPcs - addedPcs;
    $("input[id='RemainingPieces']").val(remainingPcs);
    $("span[id='RemainingPieces']").html(remainingPcs);

    $("input[id='Added']").val(addedPcs);
    $("span[id='Added").html(addedPcs);

    $("input[id='TotalPieces']").val(totalPcs);
    $("span[id='TotalPieces']").html(totalPcs);
}
function BindLocationEvents(isdblclick) {
    cfi.AutoComplete("SLINo", "Text_SLINo", "v_AWBSLI_New", "TextSNo", "Text_SLINo", ["Text_SLINo"], ResetPieces, "contains");
    var selectedtype = $("[id='Type']:checked").val();
    SwitchScanType(selectedtype, $("[id='Type']:checked"));
    $("[id='Type']").unbind("click").bind("click", function (e) {
        var typevalue = $(this).attr("value");
        SwitchScanType(typevalue, this);
    });
    $.ajax({
        url: "Services/Shipment/SLInfoService.svc/GetRecordAtLocation?SLISNo=" + currentslisno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var locationData = jQuery.parseJSON(result);
            var locationArray = locationData.Table0;
            var uldArray = locationData.Table1;
            currentawbsno = locationData.Table2[0].currentawbsno;
            TotPcs = locationData.Table3[0].TotPcs;
            AWBNo = locationData.Table4[0].AWBNo;
            var Text_SLINonew = locationData.Table5[0].Text_SLINo;
            SetTotalPcs();
            if (uldArray.length > 0) {
                id = "areaTrans_sli_sliuldlocation"
                cfi.makeTrans("sli_sliuldlocation", null, null, BindLocationAutoCompleteForULD, ReBindLocationAutoCompleteForULD, null, uldArray)
                $('#divareaTrans_sli_sliuldlocation table tr td:last').remove();
                $('#divareaTrans_sli_sliuldlocation table tr[id!="areaTrans_sli_sliuldlocation"] td:eq(10)').remove();
                $('#divareaTrans_sli_sliuldlocation table tr[id!="areaTrans_sli_sliuldlocation"] td:eq(10)').remove();
                $('#divareaTrans_sli_sliuldlocation table tr[id!="areaTrans_sli_sliuldlocation"] td:eq(10)').remove();
            }


            cfi.makeTrans("sli_slilocationdetail", null, null, BindLocationAutoComplete, ReBindLocationAutoComplete, null, null);

            $("#SLINo").val(currentslisno);
            $("#Text_SLINo").val(Text_SLINonew);

            $("div[id='divareaTrans_sli_slilocationdetail']").find("table:first").find("tr[id='areaTrans_sli_slilocationdetail']:first").hide();
            $("div[id='divareaTrans_sli_slilocationdetail']").find("table:first").find("tr[id='areaTrans_sli_slilocationdetail']:first").find("input[id^='Text_Location']").removeAttr("data-valid");
            if (uldArray.length > 0) {
                $("div[id$='divareaTrans_sli_sliuldlocation']").find("[id^='areaTrans_sli_sliuldlocation']").each(function () {
                    var CurrRow = $(this);
                    $(this).find("input[id^='ULDLocation']").each(function () {
                        if (!$("#Text_" + $(this).attr("name")).data("kendoAutoComplete")) {
                            //cfi.AutoComplete($(this).attr("name"), "Location", "ViewTempLoation", "SNo", "Location", ["Location"], null, "contains");
                            LocationAutoComplete(currentawbsno, $(this).attr("name"), "LocationName", "", "SNo", "LocationName", ["LocationName"], onSelectULDInventory, "contains", null, null, null, "spReservation_GetLocation", null, CurrRow.find("span[id^='StartTemp']").text() || "0", CurrRow.find("span[id^='EndTemp']").text() || "0");
                        }
                    });
                    $(this).find("input[id^='ULDConsumablesSno']").each(function () {
                        if (!$("#Text_" + $(this).attr("name")).data("kendoAutoComplete")) {
                            cfi.AutoComplete($(this).attr("name"), "ConsumablesName", "vConsumablesLocation", "SNo", "ConsumablesName", ["ConsumablesName"], onSelectULDInventory, "contains", null, null, null, null, null);
                        }
                    });
                    // onSelectULDInventory($(this).find("[id^='Text_ULDConsumablesSno']").attr("name"));
                });
            }
            if (locationArray.length > 0) {
                for (var i = 0; i < locationArray.length; i++) {
                    handleAdd($("div[id='divareaTrans_sli_slilocationdetail']").find("table:first").find("tr[id^='areaTrans_sli_slilocationdetail']:last").find("td:last"), "areaTrans_sli_slilocationdetail", locationArray[i].ScannedPieces, "ScanPieces", "RemainingPieces", BindLocationAutoComplete, null, ReBindLocationAutoComplete);
                    var row = $("div[id='divareaTrans_sli_slilocationdetail']").find("table:first").find("tr[id^='areaTrans_sli_slilocationdetail']:last");

                    row.find("[id^='Text_Location_']").data("kendoAutoComplete").setDefaultValue(locationArray[i].LocationSNo, locationArray[i].LocationName);
                    row.find("[id^='Text_ConsumablesSno_']").data("kendoAutoComplete").setDefaultValue(locationArray[i].ConsumablesSno, locationArray[i].ConsumablesName);

                    row.find("input[type=hidden][id^='SLISNo']").val(locationArray[i].SLISNo);
                    row.find("span[id^='SLISNo']").html(locationArray[i].SLISNo);
                    row.find("input[type=hidden][id^='SLINo']").val(locationArray[i].SLINo);
                    row.find("span[id^='SLINo']").html(locationArray[i].SLINo);
                    row.find("input[type=hidden][id^='HAWBNo']").val(locationArray[i].HAWBNo);
                    row.find("span[id^='HAWBNo']").html(locationArray[i].HAWBNo);
                    row.find("input[type=hidden][id^='StartTemp']").val(locationArray[i].StartTemp);
                    row.find("span[id^='StartTemp']").html(locationArray[i].StartTemp);
                    row.find("input[type=hidden][id^='EndTemp']").val(locationArray[i].EndTemp);
                    row.find("span[id^='EndTemp']").html(locationArray[i].EndTemp);
                    //onSelectInventory(row.find("[id^='Text_ConsumablesSno']").attr("name"));
                }
                $("div[id$='areaTrans_sli_slilocationdetail']").find("[id^='areaTrans_sli_slilocationdetail']").each(function () {
                    if (!$("#Text_" + $(this).find("[id^='Text_Location']").attr("name").replace('Text_', '')).data("kendoAutoComplete")) {
                        LocationAutoComplete(currentawbsno, $(this).find("[id^='Text_Location']").attr("name").replace('Text_', ''), "LocationName", "", "SNo", "LocationName", ["LocationName"], null, "contains", null, null, null, "spReservation_GetLocation", null, $(this).find("span[id^='StartTemp']").text() || "0", $(this).find("span[id^='EndTemp']").text() || "0");

                        //onSelectInventory($(this).find("[id^='Text_ConsumablesSno']").attr("name"));
                    }
                });

                //$("div[id$='areaTrans_sli_slilocationdetail']").find("[id^='areaTrans_sli_slilocationdetail']").each(function () {
                //    LocationAutoComplete(currentawbsno, $(this).find("[id^='Text_ConsumablesSno']").attr("name").replace('Text_', ''), "ConsumablesName", "", "SNo", "ConsumablesName", ["ConsumablesName"], null, "contains", null, null, null, "spReservation_GetInventory", null, 0, 0);

                //});

            }
            if (uldArray.length > 0) {
                //$("div[id='divareaTrans_sli_sliuldlocation']").find("table:first").find("tr[id^='areaTrans_sli_sliuldlocation']").each(function (row, tr) {
                //$(tr).find("[id^='Text_ULDLocation']").data("kendoAutoComplete").setDefaultValue(uldArray[row].warehouselocationsno, uldArray[row].location);
                //});
                var RemainingPieces;
                RemainingPieces = $("input[id='RemainingPieces']").val();
                $("input[id='RemainingPieces']").val(RemainingPieces - uldArray.length);
                $("span[id='RemainingPieces']").html(RemainingPieces - uldArray.length);
            }
                //else if (isdblclick) {
            else if ((isdblclick == undefined ? "FALSE" : isdblclick.toUpperCase()) == "TRUE") {
                var totalPcs = parseInt($("#TotalPieces").val());
                var dblscan = "";
                //for (var i = 1; i <= totalPcs; i++) {
                //    dblscan = (dblscan == "" ? "" : (dblscan + ",")) + i.toString();
                //}
                if (dblscan != "")
                    handleAdd($("div[id='divareaTrans_sli_slilocationdetail']").find("table:first").find("tr[id^='areaTrans_sli_slilocationdetail']:last").find("td:last"), "areaTrans_sli_slilocationdetail", dblscan, "ScanPieces", "RemainingPieces", BindLocationAutoComplete, null, ReBindLocationAutoComplete);
            }
            $("div[id='divareaTrans_sli_slilocationdetail']").find("span[id^='ScanPieces']").wrap("<div class='new' style='word-wrap:break-word; display:block; width:330px;'></div>");

            $('#divareaTrans_sli_sliuldlocation table tr').each(function (row, tr) {
                $(tr).find('td:eq(1)').css("display", "none");
                $(tr).find('td:eq(10)').css("display", "none");
                $(tr).find('td:eq(11)').css("display", "none");
                $(tr).find("td[id^=transAction]").hide();
                $(tr).find("input[id^='Text_ULDLocation']").closest('span').css('width', '');
                $(tr).find("input[id^='Text_ULDConsumablesSno']").closest('span').css('width', '');
                $(tr).find("[id^='Text_ULDLocation']").css("width", "150px");
                $(tr).find("[id^='Text_ULDConsumablesSno']").css("width", "150px");
            });
            if (uldArray.length == 0) {
                $('#divareaTrans_sli_sliuldlocation table tr[id^="areaTrans_sli_sliuldlocation"]').remove();
                $('#divareaTrans_sli_sliuldlocation table tr[id!="areaTrans_sli_sliuldlocation"] td:eq(10)').remove();
                $('#divareaTrans_sli_sliuldlocation table tr[id!="areaTrans_sli_sliuldlocation"] td:eq(10)').remove();
                $('#divareaTrans_sli_sliuldlocation table tr[id!="areaTrans_sli_sliuldlocation"] td:eq(10)').remove();
            }


            $('#divareaTrans_sli_slilocationdetail table tr').each(function (row, tr) {
                $(tr).find('td:eq(1)').css("display", "none");
                $(tr).find("input[id^='Text_Location']").parent('span').css('width', '');
                $(tr).find("input[id^='Text_ConsumablesSno']").parent('span').css('width', '');
                $(tr).find("[id^='Text_Location']").css("width", "150px");
                $(tr).find("[id^='Text_ConsumablesSno']").css("width", "150px");
            });
            $('#Text_SLINo').parent().parent().css('width', '250px');
            $("#Piecestobeweighed").unbind("keydown").bind("keydown", function () {
                IsNumericNewCheck(this);
            });
            $("#toPiecestobeweighed").unbind("keydown").bind("keydown", function () {
                IsNumericNewCheck(this);
            });

        },
        error: {

        }
    });
    $('#Piecestobeweighed').focus();//Append by Maneesh on dated= 10-2-17 purpose= SLI-Auto Fill Focus

}




var Locationurl = 'Services/AutoCompleteService.svc/AutoCompleteDataSourcebyAWB';
function LocationAutoComplete(currentawbsno, textId, basedOn, tableName, keyColumn, textColumn, templateColumn, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, newUrl, StartTemp, EndTemp) {
    var keyId = textId;
    textId = "Text_" + textId;

    $("div[id^='" + textId + "-list']").remove();
    if (IsValid(textId, autoCompleteType)) {
        if (keyColumn == null || keyColumn == undefined)
            keyColumn = basedOn;
        if (textColumn == null || textColumn == undefined)
            textColumn = basedOn;
        var dataSource = GetLocationAutoCompleteDataSource(currentawbsno, textId, tableName, keyColumn, textColumn, templateColumn, procName, Locationurl, StartTemp, EndTemp);
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
function GetLocationAutoCompleteDataSource(currentawbsno, textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, StartTemp, EndTemp) {
    var dataSource = new kendo.data.DataSource({
        type: "json",
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        allowUnsort: true,
        pageSize: 10,
        transport: {
            read: {
                url: (newUrl == undefined || newUrl == "" ? url : newUrl),
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: {
                    tableName: tableName,
                    keyColumn: keyColumn,
                    textColumn: textColumn,
                    templateColumn: templateColumn,
                    procedureName: procName,
                    currentawbsno: currentawbsno,
                    StartTemp: StartTemp,
                    EndTemp: EndTemp
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

function onSelectInventory(input) {

    if ($("#" + input).attr("recname") == "Text_Location") {
        $("#" + input).closest("tr").find("input[id^='Text_ConsumablesSno']").val("");
        $("#" + input).closest("tr").find("input[id^='ConsumablesSno']").val("");
        $("#" + input).closest("tr").find("input[id^='Text_Location']").attr('required', 'required');
        $("#" + input).closest("tr").find("input[id^='Text_Location']").attr('data-valid', 'required');

        $("#" + input).closest("tr").find("span[class='k-icon k-i-arrow-s']").html('');
    }
    else {
        if ($("#" + input).attr("recname") == "Text_ConsumablesSno") {
            $("#" + input).closest("tr").find("input[id^='Text_Location']").removeAttr("required");
            $("#" + input).closest("tr").find("input[id^='Text_Location']").removeAttr("data-valid");
            //$("#" + input).closest("tr").find("[id^='Text_Location']").data("kendoAutoComplete").enable(false);
            $("#" + input).closest("tr").find("input[id^='Text_Location']").val("");
            $("#" + input).closest("tr").find("input[id^='Location']").val("");
        }
    }

}
function onSelectULDInventory(input) {
    if ($("#" + input).attr("recname") == "Text_ULDConsumablesSno") {
        $("#" + input).closest("tr").find("input[id^='Text_ULDLocation']").removeAttr("required");
        //$("#" + input).closest("tr").find("[id^='Text_ULDLocation']").data("kendoAutoComplete").enable(false);
        $("#" + input).closest("tr").find("input[id^='Text_ULDLocation']").val("");
        $("#" + input).closest("tr").find("input[id^='ULDLocation']").val("");
    }
    else {
        if ($("#" + input).attr("recname") == "Text_ULDLocation") {
            $("#" + input).closest("tr").find("input[id^='Text_ULDConsumablesSno']").val("");
            $("#" + input).closest("tr").find("input[id^='ULDConsumablesSno']").val("");
            // $("#" + input).closest("tr").find("[id^='Text_ULDLocation']").data("kendoAutoComplete").enable(true);
            $("#" + input).closest("tr").find("input[id^='Text_ULDLocation']").attr('required', 'required');
            $("#" + input).closest("tr").find("span[class='k-icon k-i-arrow-s']").html('');
        }
    }
}




function BindLocationAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='Location']").each(function () {
        //cfi.AutoComplete($(this).attr("name"), "Location", "ViewTempLoation", "SNo", "Location", ["Location"], null, "contains");
        LocationAutoComplete(currentawbsno, $(this).attr("name"), "LocationName", "", "SNo", "LocationName", ["LocationName"], onSelectInventory, "contains", null, null, null, "spReservation_GetLocation", null, $(elem).find("span[id^='StartTemp']").text() || "0", $(elem).find("span[id^='EndTemp']").text() || "0");
    });
    $(elem).find("input[id^='Text_Location']").each(function () {
        //cfi.AutoComplete($(this).attr("name"), "Location", "ViewTempLoation", "SNo", "Location", ["Location"], null, "contains");
        LocationAutoComplete(currentawbsno, $(this).attr("name"), "LocationName", "", "SNo", "LocationName", ["LocationName"], onSelectInventory, "contains", null, null, null, "spReservation_GetLocation", null, $(elem).find("span[id^='StartTemp']").text() || "0", $(elem).find("span[id^='EndTemp']").text() || "0");
        $(this).attr("data-valid", "required");
    });
    $(elem).find("input[id^='ConsumablesSno']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "ConsumablesName", "vConsumablesLocation", "SNo", "ConsumablesName", ["ConsumablesName"], onSelectInventory, "contains", null, null, null, null, null);
    });
    $(elem).find("input[id^='Text_ConsumablesSno']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "ConsumablesName", "vConsumablesLocation", "SNo", "ConsumablesName", ["ConsumablesName"], onSelectInventory, "contains", null, null, null, null, null);
    });

    $('#divareaTrans_sli_slilocationdetail table tr').each(function (row, tr) {
        $(tr).find("[id^='Text_Location']").css("width", "150px");
        $(tr).find("[id^='Text_ConsumablesSno']").css("width", "150px");
    });


}

function ReBindLocationAutoComplete(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_sli_slilocationdetail']").find("[id^='areaTrans_sli_slilocationdetail']").each(function () {
        $(this).find("input[id^='ULDLocation']").each(function () {
            //var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "ViewTempLoation", "SNo", "Location", ["Location"]); 
            var newDataSource = GetLocationAutoCompleteDataSource(currentawbsno, "Text_" + $(this).attr("id"), "", "SNo", "LocationName", ["LocationName"], onSelectInventory, "contains", null, null, null, "spReservation_GetLocation", null, $(this).find("input[id^='StartTemp']").val() || "0", $(this).find("input[id^='EndTemp']").val() || "0");
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
    });
    $(elem).find("input[id^='ConsumablesSno']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "ConsumablesName", "vConsumablesLocation", "SNo", "ConsumablesName", ["ConsumablesName"], onSelectInventory, "contains", null, null, null, null, null);
    });

    $('#divareaTrans_sli_slilocationdetail table tr').each(function (row, tr) {
        $(tr).find("[id^='Text_Location']").css("width", "150px");
        $(tr).find("[id^='Text_ConsumablesSno']").css("width", "150px");
    });

}

function BindLocationAutoCompleteForULD(elem, mainElem) {
    $(elem).find("input[id^='ULDLocation']").each(function () {
        //cfi.AutoComplete($(this).attr("name"), "Location", "ViewTempLoation", "SNo", "Location", ["Location"], null, "contains");
        LocationAutoComplete(currentawbsno, $(this).attr("name"), "LocationName", "", "SNo", "LocationName", ["LocationName"], onSelectULDInventory, "contains", null, null, null, "spReservation_GetLocation", null, $(elem).find("input[id^='StartTemp']").val() || "0", $(elem).find("input[id^='EndTemp']").val() || "0");
    });

    $(mainElem).find("input[id^='ULDLocation']").each(function () {
        //cfi.AutoComplete($(this).attr("name"), "Location", "ViewTempLoation", "SNo", "Location", ["Location"], null, "contains");
        LocationAutoComplete(currentawbsno, $(this).attr("name"), "LocationName", "", "SNo", "LocationName", ["LocationName"], onSelectULDInventory, "contains", null, null, null, "spReservation_GetLocation", null, $(mainElem).find("input[id^='StartTemp']").val() || "0", $(mainElem).find("input[id^='EndTemp']").val() || "0");
    });
    $(elem).find("input[id^='Text_ULDLocation']").each(function () {
        //cfi.AutoComplete($(this).attr("name"), "Location", "ViewTempLoation", "SNo", "Location", ["Location"], null, "contains");
        LocationAutoComplete(currentawbsno, $(this).attr("name"), "LocationName", "", "SNo", "LocationName", ["LocationName"], onSelectULDInventory, "contains", null, null, null, "spReservation_GetLocation", null, $(elem).find("input[id^='StartTemp']").val() || "0", $(elem).find("input[id^='EndTemp']").val() || "0");
        //$(this).attr("data-valid", "required");
    });
    $(mainElem).find("input[id^='ULDConsumablesSno']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "ConsumablesName", "vConsumablesLocation", "SNo", "ConsumablesName", ["ConsumablesName"], onSelectULDInventory, "contains", null, null, null, null, null);
    });
    $(elem).find("input[id^='Text_ULDConsumablesSno']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "ConsumablesName", "vConsumablesLocation", "SNo", "ConsumablesName", ["ConsumablesName"], onSelectULDInventory, "contains", null, null, null, null, null);
    });
    $('#divareaTrans_sli_sliuldlocation table tr').each(function (row, tr) {
        $(tr).find("[id^='Text_ULDLocation']").css("width", "150px");
        $(tr).find("[id^='Text_ULDConsumablesSno']").css("width", "150px");
    });
}

function ReBindLocationAutoCompleteForULD(elem, mainElem) {
    $(elem).closest("div[id$='areaTrans_sli_sliuldlocation']").find("[id^='areaTrans_sli_sliuldlocation']").each(function () {
        $(this).find("input[id^='ULDLocation']").each(function () {
            //var newDataSource = GetDataSource("Text_" + $(this).attr("id"), "ViewTempLoation", "SNo", "Location", ["Location"]);
            var newDataSource = GetLocationAutoCompleteDataSource(currentawbsno, "Text_" + $(this).attr("id"), "", "SNo", "LocationName", ["LocationName"], onSelectULDInventory, "contains", null, null, null, "spReservation_GetLocation", null, $(this).find("input[id^='StartTemp']").val() || "0", $(this).find("input[id^='EndTemp']").val() || "0");
            cfi.ChangeAutoCompleteDataSource($(this).attr("name"), newDataSource, false);
        });
    });
    $(elem).find("input[id^='ULDConsumablesSno']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "ConsumablesName", "vConsumablesLocation", "SNo", "ConsumablesName", ["ConsumablesName"], onSelectULDInventory, "contains", null, null, null, null, null);
    });
    $('#divareaTrans_sli_sliuldlocation table tr').each(function (row, tr) {
        $(tr).find("[id^='Text_ULDLocation']").css("width", "150px");
        $(tr).find("[id^='Text_ULDConsumablesSno']").css("width", "150px");
    });
}

function handleAdd(elem, strid, pcsseq, pcscontrolid, remailpcsctrlid, addEventCallback, beforeAddEventCallback, removeEventCallback) {
    var self = $("#" + strid + "");
    var selfId = $("#" + strid + "").attr("id");

    var closestDiv = $(self).closest("div");

    addEventCallback = (addEventCallback == undefined ? null : addEventCallback);
    beforeAddEventCallback = (beforeAddEventCallback == undefined ? null : beforeAddEventCallback);
    removeEventCallback = (removeEventCallback == undefined ? null : removeEventCallback);

    var idCount = 0;
    var lastTable = $(closestDiv).find("[id^='areaTrans']:last");
    var lastAction = $(lastTable).find("[id^='transAction']");
    var myClone = $(self).clone(false);
    var linkText = 'Add more',
    linkClass = 'icon-trans-plus-sign',
    resetLinkText = 'Reset',
    resetLinkClass = 'icon-trans-refresh',
    enableRemove = true,
    removeLinkText = 'Delete',
    removeLinkClass = 'icon-trans-trash',
    confirmOnRemove = true,
    confirmationMsgOnRemove = 'Are you sure you wish to remove selected row?',
    convertToControl = ConvertToControl,
    maxItemsAllowedToAdd = null,
    maxItemReachedCallback = null,
    searchType = false,
    isReset = false,
    data = [],
    isAdd = false,
    afterConvertMultiField = null;
    if (beforeAddEventCallback !== null) {
        var retVal = beforeAddEventCallback(elem.closest("[id^='areaTrans_']"));
        if (!retVal) {
            return false;
        }
    }

    var totalCount = parseInt($(self).attr("TotalFieldsAdded"), 10);
    var fieldCount = parseInt($(self).attr("FieldCount"), 10);
    if (maxItemsAllowedToAdd === null || totalCount < maxItemsAllowedToAdd) {
        var newElem = myClone.clone(true);
        $(newElem).attr("id", $(newElem).attr("id") + "_" + totalCount).show();

        var remainPcs = (parseInt($("input[id='" + remailpcsctrlid + "']").val()) - pcsseq.split(',').length).toString();
        $("input[id='" + remailpcsctrlid + "']").val(remainPcs);
        $("span[id='" + remailpcsctrlid + "']").html(remainPcs);


        $(newElem).find("*[id!=''][name!='']").each(function () {
            if ($(this).attr("id")) {
                var strid = $(this).attr("id");
                var strname = "";
                var type = $(this).attr("type");

                $(this).closest("tr").find("td[id^='tdSNoCol']").text((totalCount + 1).toString());

                if ($(this).attr("name")) {
                    strname = $(this).attr("name");
                }
                if ($(this).attr("controltype") == "datetype") {
                    if ($(this).attr("endcontrol") != undefined) {
                        $(this).attr("endcontrol", $(this).attr("endcontrol") + "_" + totalCount)
                    }
                    if ($(this).attr("startcontrol") != undefined) {
                        $(this).attr("startcontrol", $(this).attr("startcontrol") + "_" + totalCount)
                    }
                }

                $(this).attr("id", strid + "_" + totalCount);
                if (strname != undefined)
                    $(this).attr("name", strname + "_" + totalCount);
                if (type != "radio" && type != "checkbox")
                    $(this).val("");
                if (type == "checkbox")
                    $(this).attr("validatename", strid + "_" + totalCount + "[]");
            }
        });

        $(newElem).closest("tr").find("span[id^='" + pcscontrolid + "']").text(pcsseq);
        $(newElem).closest("tr").find("input[id^='" + pcscontrolid + "']").val(pcsseq);

        $(newElem).closest("tr").find("span[id^='" + pcscontrolid + "']").after("<input type='button' value='" + pcsseq.split(',').length + "' onclick=piecesdetails(this) />");
        $(newElem).closest("tr").find("span[id^='" + pcscontrolid + "']").css("display", "none");
        totalCount++;
        fieldCount++;

        $(self).attr("TotalFieldsAdded", totalCount);
        $(self).attr("FieldCount", fieldCount);

        $(newElem).removeAttr("uniqueId");

        if (enableRemove && $(self).attr("uniqueId") != $(elem).closest("[id^='areaTrans']").attr("uniqueId")) {
            if ($(elem).closest("[id^='areaTrans']").find("." + removeLinkClass).length === 0) {
                $(elem).closest("[id^='areaTrans']").find("#transAction").append(" <input type='button' class='" + removeLinkClass + "'value='" + removeLinkText + "'/>");
            }
            $(elem).closest("[id^='areaTrans']").find("." + removeLinkClass).unbind("click").click(function () {
                return handleRemove($(this), strid, pcscontrolid, remailpcsctrlid, addEventCallback, beforeAddEventCallback, removeEventCallback);
            });
        }

        $(newElem).attr("uniqueId", linkClass + Math.random());
        //$(elem).parent().after(newElem);
        $(elem).closest("[id^='areaTrans']").after(newElem);

        $(elem).closest("[id^='areaTrans']").find("." + linkClass).remove();

        $(newElem).find("." + resetLinkClass).remove();
        $(newElem).find("." + linkClass).remove();
        $(newElem).find("." + removeLinkClass).remove();

        if (enableRemove) {
            if ($(newElem).find("." + removeLinkClass).length === 0) {
                $(newElem).find("#transAction_" + (totalCount - 1).toString()).find("div[id^='transActionDiv']").append(" <i class='btnTrans btnTrans-default " + removeLinkClass + "' title='" + removeLinkText + "'></i>");
            }
            $(newElem).find("." + removeLinkClass).unbind("click").click(function () {
                return handleRemove($(this), strid, pcscontrolid, remailpcsctrlid, addEventCallback, beforeAddEventCallback, removeEventCallback);
            });
        }

        $(self).attr("maxCountReached", "false");
        if (isAdd) {
            if (linkClass != "scheduletransradiocss") {
                $(newElem).find("#transAction_" + (totalCount - 1).toString()).find("div[id^='transActionDiv']").append(" <i class='btnTrans btnTrans-default " + linkClass + "' title='" + linkText + "'></i>");
                newElem.find("." + linkClass).unbind("click").click(function () {
                    if (cfi.IsValidSection($(newElem).closest("div").attr("id"))) {
                        return handleAdd($(this));
                    }
                });
            }
            else {
                $(newElem).find("." + linkClass.replace("css", "")).unbind("click").click(function () {
                    if ($(this).val() == "1") {
                        if (cfi.IsValidSection($(newElem).closest("div").attr("id"))) {
                            return handleAdd($(this));
                        }
                        else {
                            $(newElem).find("input[type='radio']." + linkClass.replace("css", "")).each(function () {
                                $(this).removeAttr("checked");
                                if ($(this).val() == "0") {
                                    $(this).attr("checked", true);
                                }
                            });
                        }
                    }
                });
            }
        }
        if (convertToControl !== null) {
            convertToControl($(newElem), self);
        }
        if (addEventCallback !== null) {
            addEventCallback($(newElem), self);
        }
    }

    if (maxItemsAllowedToAdd !== null && totalCount >= maxItemsAllowedToAdd) {
        newElem.find("." + linkClass).hide();

        if (maxItemReachedCallback !== null) {
            maxItemReachedCallback($(newElem), self);
        }
    }
    return true;
}

function handleRemove(elem, strid, pcscontrolid, remailpcsctrlid, addEventCallback, beforeAddEventCallback, removeEventCallback) {
    var cnt = true;

    var self = $("#" + strid + "");
    var selfId = $("#" + strid + "").attr("id");
    var linkText = 'Add more',
    linkClass = 'icon-trans-plus-sign',
    resetLinkText = 'Reset',
    resetLinkClass = 'icon-trans-refresh',
    enableRemove = true,
    removeLinkText = 'Delete',
    removeLinkClass = 'icon-trans-trash',
    confirmOnRemove = true,
    confirmationMsgOnRemove = 'Are you sure you wish to remove selected row?',
    convertToControl = ConvertToControl,
    maxItemsAllowedToAdd = null,
    maxItemReachedCallback = null,
    searchType = false,
    isReset = false,
    data = [],
    isAdd = false,
    afterConvertMultiField = null;
    if (confirmOnRemove) {
        cnt = confirm(confirmationMsgOnRemove);
    }
    if (cnt) {
        var prevParent = $(elem).closest("[id^='areaTrans']").prev();

        var totalCount = parseInt($(self).attr("TotalFieldsAdded"), 10);
        totalCount--;

        $(self).attr("TotalFieldsAdded", totalCount);

        if ($(elem).closest("[id^='areaTrans']").find("." + linkClass).length >= 0) {
            if (enableRemove && $(self).attr("uniqueId") != $(prevParent).attr("uniqueId")) {
                if ($(prevParent).find("." + removeLinkClass).length === 0) {
                    $(prevParent).find("#transAction_" + (totalCount - 1).toString()).find("div[id^='transActionDiv']").append(" <i class='btnTrans btnTrans-default " + removeLinkClass + "' title='" + removeLinkText + "'></i>");
                }

                $(prevParent).find("." + removeLinkClass).unbind("click").click(function () {
                    return handleRemove($(this), strid, pcscontrolid, remailpcsctrlid);
                });
            }
            var pieceSequence = $(elem).closest("tr").find("input[id^='" + pcscontrolid + "']").val();
            if (pieceSequence != undefined && pieceSequence != "") {
                var remainPcs = (parseInt($("input[id='" + remailpcsctrlid + "']").val()) + pieceSequence.split(',').length).toString();
                $("input[id='" + remailpcsctrlid + "']").val(remainPcs);
                $("span[id='" + remailpcsctrlid + "']").html(remainPcs);
            }
            $(elem).closest("[id^='areaTrans']").remove();
            $(prevParent).closest("div").find("." + linkClass).remove();
            if (isAdd) {
                if (linkClass != "scheduletransradiocss") {
                    $(prevParent).closest("div").find("td[id^='transAction']:last").find("div[id^='transActionDiv']").append(" <i class='btnTrans btnTrans-default " + linkClass + "' title='" + linkText + "'></i>");
                }
            }
            var idCount = 0;
            var parentID = $(prevParent).closest("div").find("[id^='areaTrans']:eq(0)").attr("id");
            $(prevParent).closest("div").find("[id^='areaTrans']:gt(0)").each(function () {
                $(this).attr("id", parentID + "_" + idCount);
                $(this).find("*[id!=''][name!='']").each(function () {
                    if ($(this).attr("id")) {
                        var strid = $(this).attr("id");
                        var strname = "";
                        $(this).closest("tr").find("td[id^='tdSNoCol']").text((idCount + 1).toString());
                        if ($(this).attr("name")) {
                            strname = $(this).attr("name");
                        }

                        if ($(this).attr("controltype") == "datetype") {
                            var EndControl = $(this).attr("endcontrol");

                            var StartControl = $(this).attr("startcontrol");
                            if (EndControl != undefined) {
                                $(this).attr("endcontrol", EndControl.substr(0, EndControl.lastIndexOf('_')) + "_" + idCount)
                            }
                            if (StartControl != undefined) {
                                $(this).attr("startcontrol", StartControl.substr(0, StartControl.lastIndexOf('_')) + "_" + idCount)
                            }
                        }
                        $(this).attr("id", strid.substr(0, strid.lastIndexOf('_')) + "_" + idCount);
                        if (strname != undefined)
                            $(this).attr("name", strid.substr(0, strid.lastIndexOf('_')) + "_" + idCount);
                    }
                });
                idCount++;
            });
            if (isAdd) {
                if (linkClass != "scheduletransradiocss") {
                    $(prevParent).closest("div").find("td[id^='transAction']:last").find("." + linkClass).unbind("click").click(function () {
                        if (cfi.IsValidSection($(prevParent).closest("div").attr("id"))) {
                            return handleAdd($(this));
                        }
                    });
                }
                else {
                    $(prevParent).closest("div").find("." + linkClass.replace("css", "")).unbind("click").click(function () {
                        if ($(this).val() == "1") {
                            if (cfi.IsValidSection($(prevParent).closest("div").attr("id"))) {
                                return handleAdd($(this));
                            }
                            else {
                                $(prevParent).closest("div").find("input[type='radio']." + linkClass.replace("css", "")).each(function () {
                                    $(this).removeAttr("checked");
                                    if ($(this).val() == "0") {
                                        $(this).attr("checked", true);
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }

        if (maxItemsAllowedToAdd !== null && totalCount < maxItemsAllowedToAdd) {
            $(self).siblings().find("." + linkClass).show();
        }

        if (convertToControl !== null) {
            convertToControl($(prevParent), self);
        }
        if (removeEventCallback !== null) {
            removeEventCallback($(prevParent), self);
        }

    }
    return true;
}

//var PrintCount = 0
function GetSLIPrintData() {
    var TotalNoOfPices = 0;
    //PrintCount = parseInt(PrintCount) + 1;
    // $('#spnPrintCount').text("No of Print-" + PrintCount)
    $.ajax({
        url: "Services/Shipment/SLInfoService.svc/GetSliRecord?SLISNo=" + currentslisno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            // alert(JSON.stringify(ResultData));
            //  var ResultData = jQuery.parseJSON(data);
            FinalData = ResultData.Table0;
            FinalData1 = ResultData.Table1;


            var FinalData = ResultData.Table0;
            var FinalData1 = ResultData.Table1;
            var FinalData2 = ResultData.Table2;
            var FinalData3 = ResultData.Table3;



            var FinalData4 = ResultData.Table4;
            var FinalData5 = ResultData.Table5;
            var FinalData6 = ResultData.Table6;


            $('#SpnSLNo').text(FinalData[0].SLINo);
            //$('#spnConsigneeAC').text(FinalData[0].AccountNo);
            $('#spnChargeCode').text(FinalData[0].ChargeCode.toUpperCase());
            $('#spnDestination').text(FinalData[0].DestinationAirport.toUpperCase());
            $('#spnAirLine').text(FinalData[0].AirlineName.toUpperCase());
            $('#spnRouting').text(FinalData[0].RoutingCity.toUpperCase());
            $('#spnForCarriage').text(userContext.CurrencyCode + ":" + FinalData[0].DeclaredCarriageValue.toUpperCase())
            $('#spnForCustom').text(userContext.CurrencyCode + ":" + FinalData[0].DeclaredCustomValue.toUpperCase())
            $('#spnPrintCount').text("No Of Print-" + FinalData[0].SLIPrintCount)
            $('#spnSLiUnloading').text(FinalData6[0].SLIDOC);

            // alert(FinalData[0].BookingType)

            //$('#chkIsDOCNo').attr("checked", true)
            //if (FinalData6[0].SLIDOC == "YES") {
            //    $('#chkIsDOCYes').attr("checked", true)
            //    $('#chkIsDOCNo').attr("checked", false) 
            //}

            if (FinalData[0].BookingType == "SEA-AIR") {
                //$('#spnBookingType').text(FinalData[0].BookingType);
                $("#spnExitForNo").text(FinalData[0].ExitFormNo.toUpperCase())
                $("#spnBKtype1").append("<input type=checkbox id=chkBookingType checked=checked>");
            }
            if (FinalData[0].BookingType == "RE-EXPORT") {
                $('#spnBookingType').text(FinalData[0].BookingType);
                $("#spnBoeNo").text(FinalData[0].BOENo.toUpperCase())
                $('#chkBookingType').attr("checked", true);
                $("#spnBKtype2").append("<input type=checkbox id=chkBookingType checked=checked>");
            }
            if (FinalData[0].BookingType == "LOCAL") {
                $('#spnBookingType').text(FinalData[0].BookingType);
                $("#spnBoeNo").text(FinalData[0].BOENo.toUpperCase())
                $('#chkBookingType').attr("checked", true);
                $("#spnBKtype3").append("<input type=checkbox id=chkBookingType checked=checked>");
            }
            if (FinalData[0].BookingType == "FREE-ZONE") {
                $('#spnBookingType').text(FinalData[0].BookingType);
                $("#spnBoeNo").text(FinalData[0].BOENo.toUpperCase())
                $('#chkBookingType').attr("checked", true);
                $("#spnBKtype4").append("<input type=checkbox id=chkBookingType checked=checked>");
            }
            if (FinalData1.length > 0) {
                $('#spnShipperCode').text(FinalData1[0].CustomerNo);
                $('#spnShippeName').text(FinalData1[0].ShipperName.toUpperCase());
                $('#spnShippeAddr').text('STREET-' + FinalData1[0].ShipperStreet.toUpperCase() + "  ,     " + "LOCATION-" + FinalData1[0].ShipperLocation.toUpperCase());
                $('#spnShippeAddr2').text("CITY-" + FinalData1[0].ShipperCity.toUpperCase() + "  ,         " + "STATE-" + FinalData1[0].ShipperState.toUpperCase());
                $('#spnShippeAddr3').text("COUNTRY-" + FinalData1[0].ShipperCountryName.toUpperCase() + "  ,        " + "POSTAL CODE-" + FinalData1[0].ShipperPostalCode.toUpperCase());
                $('#spnShippeEmail').text(FinalData1[0].ShipperEMail);
                $('#spnShipperTel').text(FinalData1[0].ShipperMobile);
                $('#spnShipperFex').text(FinalData1[0].Fax);
            }
            if (FinalData2.length > 0) {
                $('#spnConsigneeAC').text(FinalData2[0].CustomerNo);
                $('#spnConsigneeName').text(FinalData2[0].ConsigneeName.toUpperCase());
                $('#spnConsigneeAddr').text('STREET-' + FinalData2[0].ConsigneeStreet.toUpperCase() + "    ,    " + "LOCATION-" + FinalData2[0].ConsigneeLocation.toUpperCase());
                $('#spnConsigneeAddr2').text("CITY-" + FinalData2[0].ConsigneeCity.toUpperCase() + "     ,      " + "STATE-" + FinalData2[0].ConsigneeState.toUpperCase());
                $('#spnConsigneeAddr3').text("COUNTRY-" + FinalData2[0].ConsigneeCountryName.toUpperCase() + "     ,     " + "POSTAL CODE-" + FinalData2[0].ConsigneePostalCode.toUpperCase());
                $('#spnConsigneeEmail').text(FinalData2[0].ConsigneeEMail);
                $('#spnConsigneeTel').text(FinalData2[0].ConsigneeMobile);
                $('#spnConsigneeFex').text(FinalData2[0].Fax);
            }
            $('#spnIdNumber').text(FinalData[0].IDNumber.toUpperCase());
            //var idret = FinalData[0].IDNumber
            $('#chkIsRetaindNo').attr("checked", true)
            if (FinalData[0].IDNumber != '') {
                $('#chkIsRetaindYes').attr("checked", true)
                $('#chkIsRetaindNo').attr("checked", false)
            }

            var Dimcount = 0;
            if (FinalData3.length > 0) {
                $(FinalData3).each(function (row, tr) {
                    // TotalNoOfPices = parseInt(TotalNoOfPices) + parseInt(tr.pieces)
                    TotalNoOfPices = parseInt(TotalNoOfPices) + parseInt(tr.pieces);
                    Dimcount = Dimcount + 1;
                    $('#trDimension').after(
                        '<tr >' +
                                                '<td style="border:1px solid black;border-collapse:collapse" colspan="1">' + tr.slino.toUpperCase() + '</td>' +
                                                 '<td style="border:1px solid black;border-collapse:collapse" colspan="1">' + '</td>' +
                                                '<td style="border:1px solid black;border-collapse:collapse" class="auto-style295" colspan="5">' + tr.pieces.toUpperCase() + '</td>' +
                                                 '<td style="border:1px solid black;border-collapse:collapse" class="auto-style295" colspan="2">' + tr.text_packingtypesno.toUpperCase() + '</td>' +

                                                '<td style="border:1px solid black;border-collapse:collapse" colspan="8">' + tr.description.toUpperCase() + '</td>' +
                                                '<td style="border:1px solid black;border-collapse:collapse" class="auto-style320" colspan="3">' + tr.grossweight + '</td>' +
                                                '<td style="border:1px solid black;border-collapse:collapse" class="auto-style297">' + tr.length + '</td>' +
                                                '<td style="border:1px solid black;border-collapse:collapse" class="auto-style305">' + tr.width + '</td>' +

                                           '<td style="border:1px solid black;border-collapse:collapse" class="auto-style312">' + tr.height + '</td>' +
                                            '</tr>');
                    $("#spnUnit").text(FinalData3[0].unitcode);
                    ////' <tr id="trMain">' +
                    ////'<td align="center" style="border:1px solid black;border-collapse:collapse" colspan="2"><span id="spnSliNo1">' + tr.slino + '</span></td>' +
                    ////                                    '<td align="center" style="border:1px solid black;border-collapse:collapse" class="auto-style295" colspan="6"><span id="spnNumberOfpices1">' + tr.pieces + '</span></td>' +
                    ////                                    '<td align="center" style="border:1px solid black;border-collapse:collapse" colspan="8">&nbsp;<span id="spnDescription1">' + tr.description + '</span></td>' +
                    ////                                    '<td align="center" style="border:1px solid black;border-collapse:collapse" class="auto-style320" colspan="3">&nbsp;<span id="spnActiualHeight1">' + tr.height + '</span></td>' +
                    ////                                    '<td align="center" style="border:1px solid black;border-collapse:collapse" class="auto-style297">&nbsp;<span id="spnLength1">' + tr.length + '</span></td>' +
                    ////                                    '<td align="center" style="border:1px solid black;border-collapse:collapse" class="auto-style305">&nbsp;<span id="spnWidth1">' + tr.width + '</span></td>' +
                    ////                                    '<td align="center" style="border:1px solid black;border-collapse:collapse" class="auto-style312">&nbsp;<span id="spnHeight1">' + tr.height + '</span></td>' +
                    //// ' </tr>');
                })
                ;
                if (FinalData5.length == 0) {
                    $('#trServiceName').before('<tr >' +
                                                    '<td style="border:1px solid black;border-collapse:collapse" colspan="2">' + "Total No Of Pieces" + '</td>' +

                                                    '<td style="border:1px solid black;border-collapse:collapse" class="auto-style295" colspan="7">' + TotalNoOfPices + '</td>' +


                                                    '<td style="border:1px solid black;border-collapse:collapse" colspan="8">' + '</td>' +
                                                    '<td style="border:1px solid black;border-collapse:collapse" class="auto-style320" colspan="3">' + '</td>' +
                                                    '<td style="border:1px solid black;border-collapse:collapse" class="auto-style297">' + '</td>' +
                                                    '<td style="border:1px solid black;border-collapse:collapse" class="auto-style305">' + '</td>' +

                                               '<td style="border:1px solid black;border-collapse:collapse" class="auto-style312">' + '</td>' +
                                                '</tr>')
                }
            }
            else {


                $('#trDimension').after(
                     '<tr >' +
                                             '<td align="center" style="border:1px solid black;border-collapse:collapse" colspan="20">' + "Record Not Found" + '</td>' +
                                             // '<td style="border:1px solid black;border-collapse:collapse" colspan="1">' + '</td>' +
                                             //'<td style="border:1px solid black;border-collapse:collapse" class="auto-style295" colspan="5">'  + '</td>' +
                                             // '<td style="border:1px solid black;border-collapse:collapse" class="auto-style295" colspan="2">' +   '</td>' +

                                             //'<td style="border:1px solid black;border-collapse:collapse" colspan="8">'  + '</td>' +
                                             //'<td style="border:1px solid black;border-collapse:collapse" class="auto-style320" colspan="3">' + '</td>' +
                                             '<td style="border:1px solid black;border-collapse:collapse" class="auto-style297">' + '</td>' +
                                             '<td style="border:1px solid black;border-collapse:collapse" class="auto-style305">' + '</td>' +

                                        '<td style="border:1px solid black;border-collapse:collapse" class="auto-style312">' + '</td>' +
                                         '</tr>');

            }


            var NoOfUld = 0;
            var ULDNo = "";
            if (FinalData5.length > 0) {
                $(FinalData5).each(function (row, tr) {
                    if (tr.finaluldno != ULDNo) {
                        NoOfUld = parseInt(NoOfUld) + 1;
                    }
                    if (tr.finaluldno == ULDNo) {
                        tr.grossweight = "";
                    }
                    ULDNo = tr.finaluldno;

                    Dimcount = Dimcount + 1;



                    $('#trServiceName').before(
                        '<tr >' +
                                                '<td style="border:1px solid black;border-collapse:collapse" colspan="1">' + tr.slino + '</td>' +
                                                 '<td style="border:1px solid black;border-collapse:collapse" colspan="1">' + tr.text_uldtypesno.toUpperCase() + tr.uldno + tr.ownercode + '</td>' +
                                                '<td style="border:1px solid black;border-collapse:collapse" class="auto-style295" colspan="5">' + tr.uldpieces + '</td>' +
                                                 '<td style="border:1px solid black;border-collapse:collapse" class="auto-style295" colspan="2">' + tr.text_uldpackingtypesno + '</td>' +

                                                '<td style="border:1px solid black;border-collapse:collapse" colspan="8">' + tr.description + '</td>' +
                                                '<td style="border:1px solid black;border-collapse:collapse" class="auto-style320" colspan="3">' + tr.grossweight + '</td>' +
                                                '<td style="border:1px solid black;border-collapse:collapse" class="auto-style297">' + tr.uldlength + '</td>' +
                                                '<td style="border:1px solid black;border-collapse:collapse" class="auto-style305">' + tr.uldwidth + '</td>' +

                                           '<td style="border:1px solid black;border-collapse:collapse" class="auto-style312">' + tr.uldheight + '</td>' +
                                            '</tr>');

                });
                var totalNoOfPices = parseInt(TotalNoOfPices) + parseInt(NoOfUld)
                $('#trServiceName').before('<tr >' +
                                                '<td style="border:1px solid black;border-collapse:collapse" colspan="2">' + "Total No Of Pieces" + '</td>' +

                                                '<td style="border:1px solid black;border-collapse:collapse" class="auto-style295" colspan="7">' + totalNoOfPices + '</td>' +


                                                '<td style="border:1px solid black;border-collapse:collapse" colspan="8">' + '</td>' +
                                                '<td style="border:1px solid black;border-collapse:collapse" class="auto-style320" colspan="3">' + '</td>' +
                                                '<td style="border:1px solid black;border-collapse:collapse" class="auto-style297">' + '</td>' +
                                                '<td style="border:1px solid black;border-collapse:collapse" class="auto-style305">' + '</td>' +

                                           '<td style="border:1px solid black;border-collapse:collapse" class="auto-style312">' + '</td>' +
                                            '</tr>')
            }
            var ESSCount = FinalData4.length;
            if (FinalData4.length > 0) {
                var i = 0;
                $(FinalData4).each(function (row, tr) {
                    i = parseInt(i) + 1;
                    if (i <= 3) {
                        $('#spnASliNo' + i).text(tr.SLINo.toUpperCase());
                        $('#spnAChargeName' + i).text(tr.ChargeName.toUpperCase());
                        $('#spnESS' + i).text('ESS#');
                    }
                    else {
                        $('#trLastAccount').after('<tr>' +
                                           ' <td style="border:1px solid black;border-collapse:collapse" colspan="2">' + tr.SLINo.toUpperCase() + '</td>' +
                                            '<td style="border:1px solid black;border-collapse:collapse" class="auto-style295" colspan="6">' + tr.ChargeName.toUpperCase() + '</td>' +
                                            '<td style="border:1px solid black;border-collapse:collapse" colspan="5">' + "ESS#" + '</td>' +
                                            '<td align="center" style="border:1px solid black;border-collapse:collapse" colspan="7" rowspan="2">' + '</td>' +
                                            '<td style="border:1px solid black;border-collapse:collapse" class="auto-style297">' + '</td>' +
                                            '<td style="border:1px solid black;border-collapse:collapse" class="auto-style305">' + '</td>' +
                                            '<td style="border:1px solid black;border-collapse:collapse" class="auto-style312">' + '</td>' +
                                        '</tr>')
                    }

                    //alert(FinalData4.length);
                    //var colspan = row == ESSCount - 1 ? '' : row == ESSCount - 3 ? '<td align="center" style="border:1px solid black;border-collapse:collapse" colspan="7" rowspan="2">Yes/No</td>' : row == ESSCount - 3 ? '' : '<td style="border:1px solid black;border-collapse:collapse" colspan="7">&nbsp;</td>';
                    //$('#trServiceName').after(
                    //    '<tr>' +
                    //     '                       <td style="border:1px solid black;border-collapse:collapse" colspan="2">' + tr.SLINo.toUpperCase() + '</td>' +
                    //      '                      <td style="border:1px solid black;border-collapse:collapse" class="auto-style295" colspan="7">' + tr.ChargeName.toUpperCase() + '</td>' +
                    //       '                     <td style="border:1px solid black;border-collapse:collapse" colspan="4">ESS#</td>' +

                    //        colspan +
                    //         '                   <td style="border:1px solid black;border-collapse:collapse" class="auto-style305">&nbsp;</td>' +
                    //          '                   <td style="border:1px solid black;border-collapse:collapse" class="auto-style305">&nbsp;</td>' +
                    //          '                  <td style="border:1px solid black;border-collapse:collapse" class="auto-style312">&nbsp;</td>' +
                    //           '             </tr>');


                });
            }
            //else {
            //    //$('#trServiceName').after('<tr><td align="center" style="border:1px solid black;border-collapse:collapse" colspan="2"></td><td style="border:1px solid black;border-collapse:collapse" class="auto-style295" colspan="7"> </td><td style="border:1px solid black;border-collapse:collapse" colspan="4">ESS#</td></tr>')
            //    $('#trServiceName').after(
            //          '<tr>' +
            //           '                       <td style="border:1px solid black;border-collapse:collapse" colspan="2">' + '</td>' +
            //            '                      <td style="border:1px solid black;border-collapse:collapse" class="auto-style295" colspan="7">' + '</td>' +
            //             '                     <td style="border:1px solid black;border-collapse:collapse" colspan="4">ESS#</td>' +

            //               '                   <td style="border:1px solid black;border-collapse:collapse" class="auto-style305">&nbsp;</td>' +
            //                '                   <td style="border:1px solid black;border-collapse:collapse" class="auto-style305">&nbsp;</td>' +
            //                '                  <td style="border:1px solid black;border-collapse:collapse" class="auto-style312">&nbsp;</td>' +
            //                 '             </tr>');




            //}
            var d = FinalData[0].AWBNo;
            var len = d.length;
            var n2 = 0;
            for (var i = 0; i < len; i++) {
                n2 = n2 + 1;
                $('#spnAwb' + n2).text(d[i]);
            }
        },
        error: {

        }
    });
    // alert(PrintCount); 
}
function funPrintSLIData(divID) {
    var Flag = 0;
    if (userContext.GroupName.toUpperCase() == "AGENT") {
        // $("div[id$='divShipmentDetails']").find("div[class^='k-grid-content'] tbody tr").each(function (row, tr) {
        $(".k-grid  tbody tr").find("td:eq(1)").each(function (i, e) {
            if ($(e).text() == currentslisno) {
                if (($(e).closest('tr').find("input[process='SLICUSTOMER']").attr("class") == "completeprocess") && ($(e).closest('tr').find("input[process='SLIDIMENSION']").attr("class") == "completeprocess")) {
                    Flag = 0;
                }
                else {
                    Flag = 1;
                }
            }
        });
        //});
    }
    if (Flag == 0) {
        $.ajax({
            url: "Services/Shipment/SLInfoService.svc/UpdatePrintCount", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ SLISNo: currentslisno }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                //$('#spnPrintCount').text("No Of Print-" + result)

            }
        });

        $(".k-grid  tbody tr").find("td:eq(1)").each(function (i, e) {
            if ($(e).text() == currentslisno) {
                //debugger;
                a = true;

                //$('#spnPrintCount').text("No Of Print-" + result)


                SLISearch();
                BindEvents($(e).parent().find("[process=SLIPRINT]"), event); return false;
                //$("#divDetail").html(""); 
                //GetSLIPrintData();
            }
        });

        var divContents = $("#" + divID).html();
        // $(divContents).find('input:button[id=' + printButtonID + ']').remove();
        var printWindow = window.open('', '', '');
        // printWindow.document.write('<html><head><title>SLI Information</title>');
        // printWindow.document.write('</head><body >');
        printWindow.document.write(divContents);
        //printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();

    }
    else {
        //Kindly enter AWB info, Customer Info, Dimension details to proceed with SLI Print
        ShowMessage('warning', 'Warning - ' + SLICaption + '', "Kindly enter AWB info, Customer Info, Dimension details to proceed with " + SLICaption + " Print.", "bottom-right");

        //SLI-cannot take SLI print when S, C & D are not completed 
    }

}


function SaveFormData(subprocess) {
    var issave = false;
    var MSGHeader = subprocess.toUpperCase() == "SLICUSTOMER" ? "CUSTOMER" : subprocess.toUpperCase() == "ULDINFO" ? "ULDINFO" : subprocess.toUpperCase() == "SLIDIMENSION" ? "DIMENSION" : subprocess.toUpperCase() == "SLIAWB" ? "AWB Information" : subprocess.toUpperCase() == "SLICHARGES" ? "CHARGES" : "";


    var IsEnabled = false;
    if (subprocess.toUpperCase() == "SLIDIMENSION") {
        $(userContext.ProcessRights).each(function (i, e) {
            if (e.SubProcessSNo == 1053) {
                if (e.IsEdit == true) {
                    IsEnabled = true;
                }
            }
        });
    }
    if (subprocess.toUpperCase() == "LOCATION") {
        $(userContext.ProcessRights).each(function (i, e) {
            if (e.SubProcessSNo == 2147) {
                if (e.IsEdit == true) {
                    IsEnabled = true;
                }
            }
        });
    }


    if (!IsProcessed) {
        if (subprocess.toUpperCase() == "SLIDIMENSION") {
            issave = SaveDimensionInfo();
        } else if (subprocess.toUpperCase() == "LOCATION") {
            issave = SaveLocationInfo();
        }
        else if (subprocess.toUpperCase() == "SLICANCELLATIONSEARCH") {
            issave = saveSLICANCELLATION();
        }
        if (!IsFinalSLI) {
            if (subprocess.toUpperCase() == "SLICUSTOMER") {
                issave = SaveCustomerInfo();
            }
            else if (subprocess.toUpperCase() == "SLIAWB") {
                issave = SaveSLIAWBInfo();
            }
            else if (subprocess.toUpperCase() == "SLICHARGES") {
                issave = SaveSLIChargeHeader();
            }
            else if (subprocess.toUpperCase() == "SLIUNLOADING") {
                issave = SaveSLIUnloading();
            } else if (subprocess.toUpperCase() == "ULDINFO") {
                issave = SaveSLIULDINFO();
            }
            else if (subprocess.toUpperCase() == "TEMPDETAILS") {
                issave = saveSLITempDetails();
            }
            else if (subprocess.toUpperCase() == "SLIEQUIPMENTS") {
                issave = saveSLIEQUIPMENTS();
            }
        }

        else {
            if (IsEnabled == false && subprocess.toUpperCase() != "SLIAWB" && subprocess.toUpperCase() != "SLIEQUIPMENTS" && subprocess.toUpperCase() != "ULDINFO" && SLIPartAfterFinal == 0 && subprocess.toUpperCase() !== "SLICHARGES" && subprocess.toUpperCase() != "SLICUSTOMER" && subprocess.toUpperCase() != "SLICANCELLATIONSEARCH") {
                ShowMessage('warning', 'Warning - ' + MSGHeader.replace("SLI", SLICaption) + '', "" + SLICaption + " already Finalized, cannot be Amended", "bottom-right");
                issave = false;
            }
            else {
                if (subprocess.toUpperCase() == "ULDINFO") {
                    ShowMessage('warning', 'Warning - ' + MSGHeader.replace("SLI", SLICaption) + '', "" + SLICaption + " already finalised, cannot amend ULD details", "bottom-right");
                    issave = false;
                }
            }
            if (subprocess.toUpperCase() == "TEMPDETAILS" && SLIPartAfterFinal > 1 && userContext.SpecialRights.SLIA == false) {
                ShowMessage('warning', 'Warning - Temp Details', "" + SLICaption + " already finalised, cannot amend temp details", "bottom-right");
                issave = false;
            }
            else {
                if (subprocess.toUpperCase() == "TEMPDETAILS" && SLIPartAfterFinal > 1 && userContext.SpecialRights.SLIA == true) {
                    issave = saveSLITempDetails();
                }

            }
            if (subprocess.toUpperCase() == "SLIAWB" && SLIPartAfterFinal > 1 && userContext.SpecialRights.SLIA == true) {
                issave = SaveSLIAWBInfo();
            }
            if (subprocess.toUpperCase() == "SLIAWB" && SLIPartAfterFinal > 1 && userContext.GroupName.toUpperCase() == "AGENT") {
                issave = SaveSLIAWBInfo();
            }
            if (subprocess.toUpperCase() == "SLICHARGES" && AfterFinalCountSinglePart == 1) {
                issave = SaveSLIChargeHeader();
            }
            if (subprocess.toUpperCase() == "SLICUSTOMER" && MultipleSLIcountafterFinal > 1) {
                issave = SaveCustomerInfo();
            }
            if (subprocess.toUpperCase() == "SLIEQUIPMENTS") {
                issave = saveSLIEQUIPMENTS();
            }
        }
    }
    else {

        ShowMessage('warning', 'Warning - ' + MSGHeader.replace("SLI", SLICaption) + '', "" + SLICaption + " already Processed.", "bottom-right");
        issave = false;

    }
    //$("#btnSave").unbind("click").bind("click", function () {
    //    //  alert('Test');
    //    if (cfi.IsValidSection('divDetail')) {
    //        if (true) {
    //            if (SaveFormData(subprocess))
    //                SLISearch();
    //        }
    //    }
    //    else {
    //        return false
    //    }
    //});
    return issave;
}
function SaveLocationInfo() {
    // debugger;
    var flag = false;
    var ScanType = $("[id='Type']:checked").val();
    var LocationArray = [];
    var ValidFlag = false;

    $("div[id$='areaTrans_sli_slilocationdetail']").find("[id^='areaTrans_sli_slilocationdetail_']").each(function () {
        var LocationViewModel = {
            SNo: $(this).find("td[id^='tdSNoCol_']").html(),
            AWBSNo: currentawbsno,
            ScannedPieces: $(this).find("input[id^='ScanPieces_']").val(),
            ConsumablesSno: $(this).find("[id^='Text_ConsumablesSno']").data("kendoAutoComplete").key(),
            LocationSNo: $(this).find("[id^='Text_Location']").data("kendoAutoComplete").key(),
            SLISNo: $(this).find("span[id^='SLISNo_']").text(), //$(this).find("input[type=hidden][id^='SLISNo_']").val(),
            SLINo: $(this).find("span[id^='SLINo_']").text(), //$(this).find("input[type=hidden][id^='SLINo_']").val(),
            HAWBNo: $(this).find("span[id^='HAWBNo_']").text(), //$(this).find("input[type=hidden][id^='HAWBNo_']").val(),
            StartTemp: $(this).find("span[id^='StartTemp_']").text() || "0", //$(this).find("input[type=hidden][id^='StartTemp_']").val(),
            EndTemp: $(this).find("span[id^='EndTemp_']").text() || "0",    //$(this).find("input[type=hidden][id^='EndTemp_']").val(),
        };
        LocationArray.push(LocationViewModel);

    });

    var ULDLocationArray = [];
    var i = 1;
    $("div[id$='areaTrans_sli_sliuldlocation']").find("[id^='areaTrans_sli_sliuldlocation']").each(function () {
        //if (parseInt($(this).find("[id^='Text_ULDLocation']").data("kendoAutoComplete").key()) > 0) {
        var ULDLocationModel = {
            RowNo: i,
            //SNo: $(this).find('input[type="hidden"][id^="sno"]').val(),
            //LocationSno: $(this).find("[id^='Text_ULDLocation']").data("kendoAutoComplete").key(),
            //SLINo: $(this).find("input[type=hidden][id^='SLINo_']").val(),
            //HAWBNo: $(this).find("input[type=hidden][id^='HAWBNo_']").val()
            ULDSNo: $(this).find("span[id^='ULDSNo']").text(),
            LocationSno: $(this).find("[id^='Text_ULDLocation']").data("kendoAutoComplete").key(),
            ConsumablesSno: $(this).find("[id^='Text_ULDConsumablesSno']").data("kendoAutoComplete").key(),
        };
        ULDLocationArray.push(ULDLocationModel);
        i += 1;
        //}

    });

    if ($("div[id$='areaTrans_sli_slilocationdetail']").find("[id^='areaTrans_sli_slilocationdetail_']").length > 0) {
        ValidFlag = true;
    } else {
        if (parseInt($("#tdPcs").text() == "" ? "0" : $("#tdPcs").text()) == parseInt($("div[id$='areaTrans_sli_sliuldlocation']").find("[id^='areaTrans_sli_sliuldlocation']").length)) {
            ValidFlag = true;
        }
        else {
            if ($("#Text_SLINo").data("kendoAutoComplete").key() == "") {
                ShowMessage('warning', 'Warning - Location', "Kindly select " + SLICaption + " to proceed.", "bottom-right");
                ValidFlag = false;
            } else {
                if (LocationArray.length == 0 && ULDLocationArray.length == 0) {
                    ShowMessage('warning', 'Warning - Location', "Kindly Validate Pieces for Location.", "bottom-right");
                    ValidFlag = false;
                }
                else {
                    ValidFlag = true;
                }
            }
        }
    }
    for (var i = 0; i < LocationArray.length; i++) {
        if (LocationArray[i].ConsumablesSno == "" && LocationArray[i].LocationSNo == "") {
            ShowMessage('warning', 'Warning - Location', "Kindly Select Inventory or Location.", "bottom-right");
            ValidFlag = false;
        }
    }



    if (ValidFlag == false) { return }


    if (LocationArray.length > 0 || ULDLocationArray.length > 0) {
        $.ajax({
            url: "Services/Shipment/SLInfoService.svc/SaveAtLocation", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ AWBSNo: currentawbsno, lsAWBLocation: LocationArray, lsULDLocation: ULDLocationArray, ScanType: ScanType, UpdatedBy: userContext.UserSNo, SLISNo: currentslisno }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "") {
                    ShowMessage('success', 'Success - Location', "AWB No. [" + AWBNo.toUpperCase() + "] -  Processed Successfully", "bottom-right");
                    flag = true;
                }
                else
                    ShowMessage('warning', 'Warning - Location', "AWB No. [" + AWBNo.toUpperCase() + "] -  unable to process.", "bottom-right");
                //('warning', 'Warning - Location', "AWB No. [" + AWBNo.toUpperCase() + "] - weighing machine process missing.", "bottom-right");
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - Location', "AWB No. [" + AWBNo.toUpperCase() + "] -  unable to process.", "bottom-right");

            }
        });
    }
    else {
        ShowMessage('warning', 'Warning - Location', "AWB No. [" + AWBNo.toUpperCase() + "] -  Enter location detail.", "bottom-right");
    }
    return flag;
}


function SaveSLIUnloading() {
    //debugger;
    var flag = false;
    var validFlag = true;
    var UnloadingArray = [];
    $("div[id$='divareaTrans_sli_sliunloading']").find("[id^='areaTrans_sli_sliunloading']").each(function () {
        //  alert($(this).find("[id^='Details']").val());
        var UnloadingArrayViewModel = {
            SLISNo: currentslisno,
            VerifiedType: $(this).find("[id^='Details']").val() == 'FWB/AWB' ? 1 : $(this).find("input[id^='Details']").val() == 'SLI' ? 2 : $(this).find("input[id^='Details']").val() == 'DOCS' ? 3 : $(this).find("input[id^='Details']").val() == 'CHANGES VERIFIED' ? 4 : 0,
            Pieces: $(this).find("[id^='Pieces']").val() == "" ? 0 : $(this).find("[id^='Pieces']").val(),
            Verified: $(this).find("input[type='checkbox'][id^='Verified']").attr('checked') == 'checked' ? 1 : 0
        };
        UnloadingArray.push(UnloadingArrayViewModel);

    });
    if (UnloadingArray.length > 0) {
        if (UnloadingArray[0].Verified == 0 && UnloadingArray[1].Verified == 0)
            validFlag = false;
    }
    if (UnloadingArray.length == 0)
        UnloadingArray = {
            SLISNo: 0,
            VerifiedType: 0,
            Pieces: 0,
            Verified: 0
        };

    var IsFinalize = $('input[name=Final]:checked', '#divareaTrans_sli_sliunloading').val();
    //var IsVerified = $("input[type='checkbox']:checked").length;
    //if (IsVerified == 0) {
    //alert(JSON.stringify(UnloadingArray));
    if (validFlag) {
        $.ajax({
            url: "Services/Shipment/SLInfoService.svc/UpdateSLIUnloading", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ SLISNo: currentslisno, UnloadingArray: UnloadingArray, IsFinalize: IsFinalize }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "0") {
                    ShowMessage('success', 'Success -' + SLICaption + ' Unloading', "Processed Successfully", "bottom-right");
                    flag = true;
                    if (IsFinalize == 1) {
                        $("#btnSave").hide();
                        $("#btnSaveToNext").hide();
                        // $('#divDetail').html('');
                    }

                }
                else if (result == "2") {
                    ShowMessage('warning', 'Warning - ' + SLICaption + ' Unloading', "Please enter Customer Information.", "bottom-right");
                    flag = false;
                }
                else if (result == "1001?") {
                    ShowMessage('warning', 'Warning - Amendment', "RCS for this " + SLICaption + " Part is already done, " + SLICaption + " details can't be amended", "bottom-right");
                    return;
                }
                else if (result == "3") {
                    ShowMessage('warning', 'Warning - ' + SLICaption + ' Unloading', "" + SLICaption + " cannot be finalized. Invalid AWB No", "bottom-right");
                    flag = false;
                }
                else if (result == "10") {
                    ShowMessage('warning', 'Warning - ' + SLICaption + '', "" + SLICaption + " cannot be finalized. Enter HAWB number for all associated " + SLICaption + " parts", "bottom-right");
                    flag = false;
                }
                else if (result == "4") {
                    ShowMessage('warning', 'Warning - ' + SLICaption + ' Unloading', "Invalid AWB No", "bottom-right");
                    flag = false;
                }
                else {
                    ShowMessage('warning', 'Warning - ' + SLICaption + ' Unloading', "unable to process.", "bottom-right");
                    flag = false;
                }


            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - ' + SLICaption + ' Unloading', "unable to process.", "bottom-right");
                flag = false;

            }
        });
    }
    else {
        ShowMessage('warning', 'Warning - ' + SLICaption + ' Unloading', "Please Select AWB/FWB or " + SLICaption + "", "bottom-right");
        flag = false;
    }

    //else
    //{
    //    ShowMessage('warning', 'Warning - SLI Unloading', "Please verified any details", "bottom-right");
    //    flag = false;
    //}
    return flag;
}
function SaveSLIChargeHeader() {
    var flag = false;
    var ChargeHeaderArray = [];
    $("div[id$='divareaTrans_sli_slicharges']").find("[id^='areaTrans_sli_slicharges']").each(function () {
        if ($(this).find("[id^='ServiceName']").val() != "") {
            var ChargeHeaderViewModel = {
                SLISNo: currentslisno,
                HandlingChargeMasterSNo: $(this).find("[id^='ServiceName']").val(),
                PrimaryValue: $(this).find("[id^='PrimaryValue']").val() == "" ? 0 : $(this).find("[id^='PrimaryValue']").val(),
                SecondaryValue: $(this).find("[id^='SecondaryValue']").val() == "" ? 0 : $(this).find("[id^='SecondaryValue']").val()
            };
            ChargeHeaderArray.push(ChargeHeaderViewModel);
        }
    });
    if (ChargeHeaderArray.length == 0)
        ChargeHeaderArray = {
            SLISNo: 0,
            HandlingChargeMasterSNo: 0,
            PrimaryValue: 0,
            SecondaryValue: 0
        };
    $.ajax({
        url: "Services/Shipment/SLInfoService.svc/UpdateSLIChargesHeader", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ SLISNo: currentslisno, ChargesHeader: ChargeHeaderArray }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "0") {
                ShowMessage('success', 'Success - ' + SLICaption + ' Charge', "Processed Successfully", "bottom-right");
                flag = true;
            }
            else if (result == "1001?") {
                ShowMessage('warning', 'Warning - Amendment', "RCS for this " + SLICaption + " Part is already done, " + SLICaption + " details can't be amended", "bottom-right");
                return;
            }
            else if (result == "1002?") {
                ShowMessage('warning', 'Warning - Amendment', "" + SLICaption + " Cancelled, " + SLICaption + " details can't be amended", "bottom-right");
                return;
            }
            else if (result == "1003?") {
                ShowMessage('warning', 'Warning - Amendment', "FWB for this " + SLICaption + " is already done, " + SLICaption + " details can't be amended", "bottom-right");
                return;
            }
            else {
                ShowMessage('warning', 'Warning - ' + SLICaption + ' Charge', "unable to process.", "bottom-right");
                flag = false;
            }
        },
        error: function (xhr) {
            ShowMessage('warning', 'Warning - ' + SLICaption + ' Charge', "unable to process.", "bottom-right");
            flag = false;

        }
    });
    return flag;
}


function SaveCustomerInfo() {
    var flag = false;
    var ShipperViewModel = {
        ShipperAccountNo: $("#SHIPPER_AccountNo").val() == '' ? 0 : $("#SHIPPER_AccountNo").val(),
        //ShipperName: $("#Text_SHIPPER_Name").data("kendoAutoComplete").key(),
        ShipperName: $("#SHIPPER_Name").val(),
        ShipperName1: $("#SHIPPER_Name1").val(),
        ShipperStreet: $("#SHIPPER_Street").val(),
        ShipperStreet1: $("#SHIPPER_Street1").val(),
        ShipperLocation: $("#SHIPPER_TownLocation").val(),
        ShipperState: $("#SHIPPER_State").val(),
        ShipperPostalCode: $("#SHIPPER_PostalCode").val(),
        ShipperCity: $("#SHIPPER_City").val(),
        ShipperCountryCode: $("#SHIPPER_CountryCode").val(),
        ShipperMobile: $("#SHIPPER_MobileNo").val(),
        Telex: $("#Telex").val(),
        ShipperEMail: $("#SHIPPER_Email").val(),
    };
    var ConsigneeViewMode = {
        ConsigneeAccountNo: $("#CONSIGNEE_AccountNo").val() == '' ? 0 : $("#CONSIGNEE_AccountNo").val(),
        //ConsigneeName: $("#Text_CONSIGNEE_AccountNoName").data("kendoAutoComplete").key(),
        ConsigneeName: $("#CONSIGNEE_AccountNoName").val(),
        ConsigneeName1: $("#CONSIGNEE_AccountNoName1").val(),
        ConsigneeStreet: $("#CONSIGNEE_Street").val(),
        ConsigneeStreet1: $("#CONSIGNEE_Street1").val(),
        ConsigneeLocation: $("#CONSIGNEE_TownLocation").val(),
        ConsigneeState: $("#CONSIGNEE_State").val(),
        ConsigneePostalCode: $("#CONSIGNEE_PostalCode").val(),
        ConsigneeCity: $("#CONSIGNEE_City").val(),
        ConsigneeCountryCode: $("#CONSIGNEE_CountryCode").val(),
        ConsigneeMobile: $("#CONSIGNEE_MobileNo").val(),
        ConsigneeTelex: $("#Consignee_Telex").val(),
        ConsigneeEMail: $("#CONSIGNEE_Email").val(),

    };

    //alert(JSON.stringify(ConsigneeViewMode));
    if ($("#SHIPPER_Name").val() != "") {
        $.ajax({
            url: "Services/Shipment/SLInfoService.svc/UpdateShipperAndConsigneeInformation", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ SLISNo: currentslisno, ShipperInformation: ShipperViewModel, ConsigneeInformation: ConsigneeViewMode, ShipperSno: $("#SHIPPER_AccountNo").val() == '' ? 0 : $("#SHIPPER_AccountNo").val(), ConsigneeSno: $("#CONSIGNEE_AccountNo").val() == '' ? 0 : $("#CONSIGNEE_AccountNo").val() }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "0") {
                    //ShowMessage('success', 'Success - Customer', "AWB No. [" + $("#tdAWBNo").text() + "] -  Processed Successfully", "bottom-right");
                    ShowMessage('success', 'Success - Customer', "Processed Successfully", "bottom-right");
                    flag = true;
                }
                else if (result == "1001?") {
                    ShowMessage('warning', 'Warning - Amendment', "RCS for this " + SLICaption + " Part is already done, " + SLICaption + " details can't be amended", "bottom-right");
                    return;
                }
                else if (result == "1002?") {
                    ShowMessage('warning', 'Warning - Amendment', "" + SLICaption + " Cancelled, " + SLICaption + " details can't be amended", "bottom-right");
                    return;
                }
                else if (result == "1003?") {
                    ShowMessage('warning', 'Warning - Amendment', "FWB for this " + SLICaption + " is already done, " + SLICaption + " details can't be amended", "bottom-right");
                    return;
                }
                else if (result == "1111?") {
                    ShowMessage('warning', 'Warning - Amendment', "Print for this " + SLICaption + " is already done, " + SLICaption + " details can't be amended", "bottom-right");
                    return;
                }
                else {
                    //ShowMessage('warning', 'Warning - Customer', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
                    ShowMessage('warning', 'Warning - Customer', "unable to process.", "bottom-right");
                    flag = false;
                }
            },
            error: function (xhr) {

                //ShowMessage('warning', 'Warning - Customer', "AWB No. [" + $("#tdAWBNo").text() + "] -  unable to process.", "bottom-right");
                ShowMessage('warning', 'Warning - Customer', "unable to process.", "bottom-right");
                flag = false;
            }
        });
    }
    else {
        ShowMessage('warning', 'Warning - Customer', "unable to process.", "bottom-right");
        flag = false;
    }
    return flag;
}


function ValidateULDNo(e) {
    // alert($(e).val().toUpperCase().substr(0, 3));
    if ($(e).parents('tr').find('input[id^="Text_ULDTypeSNo"]').val() == $(e).val().toUpperCase().substr(0, 3) || $(e).val() == '') {

    }
    else {
        ShowMessage('warning', 'Warning - ' + SLICaption + '', "Enter Valid ULD No", "bottom-right");
        $(e).val('');
    }
    //alert();
}
function AutoShipmentSearch(SubProcess) {

    //var gridPage = $(".k-pager-input").find("input").val();
    //var grid = $(".k-grid").data("kendoGrid");
    //grid.dataSource.page(gridPage);
    var a = false;
    $(".k-grid  tbody tr").find("td:eq(0)").each(function (i, e) {
        if ($(e).text() == currentawbsno) {
            //var SubProcess = "WEIGHINGMACHINE";
            //$(e).parent().find("[process=" + SubProcess + "]").click(); return false;
            a = true;
            BindEvents($(e).parent().find("[process=" + subprocess + "]"), event); return false;
        }
    });
    if (a == false) {
        CleanUI();
    }
}

function ReloadSameGridPage(subprocess) {
    var gridPage = $(".k-pager-input").find("input").val();
    var grid = $(".k-grid").data("kendoGrid");
    grid.dataSource.page(gridPage);
}
function BindSubProcess() {
    AutoShipmentSearch(subprocess);
    $("#divDetail").find("div[class='k-grid k-widget'] > div.k-grid-header > div > table > thead > tr > th:nth-child(2) > a.k-grid-filter > span").remove();
}
function SaveDimensionInfo() {
    //  debugger;
    var flag = false;
    // alert("Dim");
    //var res = $("#divDetail").serializeToJSON();
    //debugger
    //return
    // var origin = $('#tblShipmentInfo tr:nth-child(4)>td:eq(2)').text().split('-')[0];

    //$("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").each(function () {
    //    if ($(this).find("input[id^='StartTemperature']").val() == "0") {
    //        $(this).find("input[id^='StartTemperature']").val(null);
    //    }
    //    if ($(this).find("input[id^='EndTemperature']").val() == "0") {
    //        $(this).find("input[id^='EndTemperature']").val(null);
    //    } if ($(this).find("input[id^='Capturedtemp']").val() == "0") {
    //        $(this).find("input[id^='Capturedtemp']").val(null);
    //    }
    //    SetRequired($(this).find("[id^='SLISPHCCode']").attr("id"));

    //});
    //$("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").each(function () {
    //    if ($(this).find("input[id^='ULDStartTemperature']").val() == "0") {
    //        $(this).find("input[id^='ULDStartTemperature']").val(null);
    //    }
    //    if ($(this).find("input[id^='ULDEndTemperature']").val() == "0") {
    //        $(this).find("input[id^='ULDEndTemperature']").val(null);
    //    } if ($(this).find("input[id^='ULDCapturedtemp']").val() == "0") {
    //        $(this).find("input[id^='ULDCapturedtemp']").val(null);
    //    }
    //    SetRequired($(this).find("[id^='ULDSPHCCode']").attr("id"));
    //});

    var DimArray = [];
    var DimULDArray = [];
    $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").each(function () {

        //fn_CheckRange("#" + $(this).find("[id^='StartTemperature']").attr("id"));
        //fn_CheckRangeEnd("#" + $(this).find("[id^='EndTemperature']").attr("id"));
        //fn_CheckRangeCaptured("#" + $(this).find("[id^='Capturedtemp']").attr("id"));
        var DimViewModel = {

            SLISPHCCode: $(this).find("[id^='SLISPHCCode']").val() == '' ? null : $(this).find("[id^='SLISPHCCode']").val(),
            StartTemperature: $(this).find("[id^='StartTemperature']").val() == '' ? null : $(this).find("[id^='StartTemperature']").val(),
            EndTemperature: $(this).find("[id^='EndTemperature']").val() == '' ? null : $(this).find("[id^='EndTemperature']").val(),
            Capturedtemp: $(this).find("[id^='Capturedtemp']").val() == '' ? null : $(this).find("[id^='Capturedtemp']").val(),
            SLISNo: currentslisno,
            GrossWeight: $(this).find("[id^='GrossWeight']").val() == "" ? null : $(this).find("[id^='GrossWeight']").val(),
            PackingTypeSNo: $(this).find("[id^='PackingTypeSNo']").val() == '' ? 0 : $(this).find("[id^='PackingTypeSNo']").val(),
            Description: $(this).find("[id^='Description']").val(),
            Height: $(this).find("[id^='Height']").val() == '' ? null : $(this).find("[id^='Height']").val(),
            Length: $(this).find("[id^='Length']").val() == '' ? null : $(this).find("[id^='Length']").val(),
            Width: $(this).find("input[id^='Width']").val() == '' ? null : $(this).find("input[id^='Width']").val(),
            Pieces: $(this).find("input[id^='Pieces']").val(),
            CBM: $(this).find("input[id^='SLICBM']").val() == '' ? null : $(this).find("[id^='SLICBM']").val(),
            VolumeWeight: $(this).find("input[id^='VolumeWt']").val() == '' ? null : $(this).find("[id^='VolumeWt']").val(),
            Unit: $("#Unit:checked").text(),
            IsCMS: $("#Unit:checked").val() == "1" ? 1 : 0,
            SLINo: $(this).find("input[id^='SLINo']").val(),
            CapturedWeight: $(this).find("input[id^='CapturedWeight']").val() == '' ? null : $(this).find("[id^='CapturedWeight']").val(),
            TareWeight: $(this).find("input[id^='TareWeight']").val() == 0 ? null : $(this).find("[id^='TareWeight']").val(),
            RowNo: $(this).find("input[id^='SNo']").val() == 0 ? $(this).find("td[id^='tdSNoCol']").text() : $(this).find("input[id^='SNo']").val(),

        };
        if ($(this).find("input[id^='Pieces']").val() != '')
            DimArray.push(DimViewModel);

    });
    if (isBUP == true) {
        $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").each(function () {
            var UldVolWt = 0.0;
            if ($(this).find("input[id^='CBM']").val() != "" && $(this).find("input[id^='CBM']").val() != undefined) {
                UldVolWt = $(this).find("input[id^='CBM']").val();
            }
            var arrULD = [];
            if ($(this).attr("rel") == undefined) {
                arrULD.push($(this).find("input[id^='Text_ULDTypeSNo']").val() + "_" + $(this).find("input[id^='ULDNo']").val() + "_" + $(this).find("input[id^='OwnerCode']").val().toUpperCase());
            }
            var CurrentULD = $(this).find("input[id^='Text_ULDTypeSNo']").val() + "_" + $(this).find("input[id^='ULDNo']").val() + "_" + $(this).find("input[id^='OwnerCode']").val().toUpperCase()
            var k = 0;
            for (var i = 0; i < arrULD.length; i++) {
                if (CurrentULD == arrULD[i]) {
                    k = k + 1;
                }
            }
            if (k > 1) {
                $(this).find("input[id^='OwnerCode']").val("");
                ShowMessage('warning', 'Warning - ULD Details', "ULD details already exists.", "bottom-right");
                flag = false;
                arrULD = [];
            }
            //fn_CheckRange("#" + $(this).find("[id^='ULDStartTemperature']").attr("id"));
            //fn_CheckRangeEnd("#" + $(this).find("[id^='ULDEndTemperature']").attr("id"));
            //fn_CheckRangeCaptured("#" + $(this).find("[id^='ULDCapturedtemp']").attr("id"));

            var DimULDViewModel = {
                ULDSPHCCode: $(this).find("[id^='ULDSPHCCode']").val() == '' ? null : $(this).find("[id^='ULDSPHCCode']").val(),
                ULDStartTemperature: $(this).find("[id^='ULDStartTemperature']").val() == '' ? null : $(this).find("[id^='ULDStartTemperature']").val(),
                ULDEndTemperature: $(this).find("[id^='ULDEndTemperature']").val() == '' ? null : $(this).find("[id^='ULDEndTemperature']").val(),
                ULDCapturedtemp: $(this).find("[id^='ULDCapturedtemp']").val() == '' ? null : $(this).find("[id^='ULDCapturedtemp']").val(),
                SLISNo: currentslisno,
                GrossWeight: $(this).find("[id^='UGrossWeight']").val(),
                PackingTypeSNo: 0,//$(this).find("[id^='ULDPackingTypeSNo']").val() == '' ? 0 : $(this).find("[id^='ULDPackingTypeSNo']").val(),
                ULDTypeSNo: $(this).find("[id^='Text_ULDTypeSNo']").val() == '' ? 0 : $(this).find("[id^='Text_ULDTypeSNo']").val(),
                //ULDNoSNo: $(this).find("[id^='ULDNoSNo']").val() == '' ? -1 : $(this).find("[id^='ULDNoSNo']").val(),
                ULDNo: $(this).find("[id^='ULDNo']").val(),
                OwnerCode: $(this).find("[id^='OwnerCode']").val(),
                CountofBUP: 0,//$(this).find("[id^='CountofBUP']").val(),
                SLACPieces: $(this).find("[id^='SLACPieces']").val(),
                UldPieces: $(this).find("input[id^='UldPieces']").val(),
                IsCMS: $(this).find("[id^='Text_Unit']").data("kendoAutoComplete").key(),
                ULDLength: $(this).find("input[id^='ULDLength']").val() == "" ? null : $(this).find("input[id^='ULDLength']").val(),
                ULDWidth: $(this).find("input[id^='ULDWidth']").val() == "" ? null : $(this).find("input[id^='ULDWidth']").val(),
                ULDHeight: $(this).find("input[id^='ULDHeight']").val() == "" ? null : $(this).find("input[id^='ULDHeight']").val(),
                ULDVolWt: $(this).find("input[id^='UldVolWt']").val() || 0.0,
                ULDCBM: UldVolWt,
                ULDNoSNo: $(this).find("input[id^='ULDNoSNo']").val() || 0,
                UldoldPieces: $(this).find("input[id^='UldoldPieces']").val(),
                SLINo: $(this).find("input[id^='SLINo']").val(),
                isOverhang: $(this).find("input[id^='isOverhang']").prop("checked"),
                UCapturedWeight: $(this).find("[id^='UCapturedWeight']").val(),
                UTareWeight: $(this).find("[id^='UTareWeight']").val(),
                CountourCode: $(this).find("[id^='ContourCode']").val()
            };
            DimULDArray.push(DimULDViewModel);

        });
        //  alert(JSON.stringify(DimULDArray));
    }
    if (DimULDArray.length == 0)
        DimULDArray = {
            SLISNo: currentslisno,
            GrossWeight: 0,
            PackingTypeSNo: 0,
            ULDTypeSNo: 0,
            // ULDNoSNo: 0,
            ULDNo: 0,
            OwnerCode: "",
            CountofBUP: 0,
            SLACPieces: 0,
            UldPieces: 0,
            IsCMS: 0,
            ULDLength: 0,
            ULDWidth: 0,
            ULDHeight: 0,
            ULDVolWt: 0,
            ULDCBM: 0,
            isOverhang: 0,
            UCapturedWeight: 0,
            UTareWeight: 0,
            ContourCode: 0
        };


    if (DimArray.length == 0)
        DimArray = {
            SLISNo: 0,
            GrossWeight: 0,
            PackingTypeSNo: 0,
            Description: "",
            Height: 0,
            Length: 0,
            Width: 0,
            Pieces: 0,
            CBM: 0,
            Unit: 0,
            IsCMS: 0,
            CapturedWeight: 0,
            TareWeight: 0,
            RowNo: 0

        };

    if (funDimValidate() == 1) {
        ShowMessage('warning', 'Warning - ' + SLICaption + '', "Enter Piece", "bottom-right");
        flag = false;
    }
    else if (funDimValidate() == 2) {
        ShowMessage('warning', 'Warning - ' + SLICaption + '', "Enter Captured Weight", "bottom-right");
        flag = false;
    }
    else if (funDimValidate() == 4) {
        ShowMessage('warning', 'Warning - ' + SLICaption + '', "Equipment Tare Wt should always be less than shipment Captured  Wt.", "bottom-right");
        flag = false;
    }
    else if (funDimensionValidate() == 1) {
        ShowMessage('warning', 'Warning - ' + SLICaption + '', "Enter Length", "bottom-right");
        flag = false;
    }
    else if (funDimensionValidate() == 2) {
        ShowMessage('warning', 'Warning - ' + SLICaption + '', "Enter Width", "bottom-right");
        flag = false;
    }
    else if (funDimensionValidate() == 3) {
        ShowMessage('warning', 'Warning - ' + SLICaption + '', "Enter Height", "bottom-right");
        flag = false;
    }
    else if (funDimValidate() == 5) {
        ShowMessage('warning', 'Warning - ' + SLICaption + '', "Enter Volume Weight", "bottom-right");
        flag = false;
    }
    else if (funULDDimensionValidate() == 1) {
        ShowMessage('warning', 'Warning - ' + SLICaption + '', "Enter ULD Length", "bottom-right");
        flag = false;
    }
    else if (funULDDimensionValidate() == 2) {
        ShowMessage('warning', 'Warning - ' + SLICaption + '', "Enter ULD Width", "bottom-right");
        flag = false;
    }
    else if (funULDDimensionValidate() == 3) {
        ShowMessage('warning', 'Warning - ' + SLICaption + '', "Enter ULD Height", "bottom-right");
        flag = false;
    }
    else {
        //  if (cfi.IsValidTransSection("divareaTrans_sli_slidimension")) {
        $.ajax({
            url: "Services/Shipment/SLInfoService.svc/UpdateSLIDimemsionsAndULD", async: false, type: "POST", dataType: "json", cache: false,
            //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
            data: JSON.stringify({ SLISNo: currentslisno, Dimensions: DimArray, ULDDimensions: DimULDArray }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.split('?')[0] == "0") {
                    if (result.split('?')[1] == "") {
                        ShowMessage('success', 'Success - Dimension', "Processed Successfully", "bottom-right");

                        //SLISearch();
                        //$('#divDetail').html('');
                        //ShowProcessDetails("SLIDIMENSION", undefined);
                        //BindSLIDimensionEvents();
                        //$("#divDetail").html("");
                        //$("#tblShipmentInfo").hide();

                        //$("#btnSave").unbind("click");
                        // ReloadSameGridPage(subprocess);
                        $(".k-grid  tbody tr").find("td:eq(1)").each(function (i, e) {
                            if ($(e).text() == currentslisno) {
                                a = true;
                                BindEvents($(e).parent().find("[process=SLIDIMENSION]"), event); return false;
                            }
                        });
                        //subprocess = "SLIDIMENSION";
                        // BindEvents(button, null, null);

                        flag = true;
                    }

                    else {
                        // ShowMessage('warning', 'Warning - Dimension', "Volume weight deviation occurs in AWB No. [" + $("#tdAWBNo").text() + "] .  Processed Successfully", "bottom-right");
                        accpcs = 0;//Manoj
                        accgrwt = 0;//Manoj
                        flag = true;

                    }
                }
                else if (result == "548?")
                { ShowMessage('warning', 'Warning - ' + SLICaption + '', "Enter valid ULD No.", "bottom-right"); }
                else if (result == "549?")
                { ShowMessage('warning', 'Warning - ' + SLICaption + '', "Enter valid Owner Code.", "bottom-right"); }
                else if (result == "10?") {
                    ShowMessage('warning', 'Warning - SHC', "Kindly provide Special Handling Code against the ULD.", "bottom-right");
                    return;
                }
                else if (result == "11?") {
                    ShowMessage('warning', 'Warning - SHC', "Kindly provide Special Handling Code against the LOOSE PIECES.", "bottom-right");
                    return;
                }
                else if (result == "1012?") {
                    ShowMessage('warning', 'Warning - ' + SLICaption + ' SHC', "Maximum 09 Distinct Special Handling Codes can be selected in a " + SLICaption + ".", "bottom-right");
                    return;
                }
                else if (result == "1001?") {
                    ShowMessage('warning', 'Warning - Amendment', "RCS for this " + SLICaption + " Part is already done, " + SLICaption + " details can't be amended", "bottom-right");
                    return;
                }
                else if (result == "1002?") {
                    ShowMessage('warning', 'Warning - Amendment', "" + SLICaption + " Cancelled, " + SLICaption + " details can't be amended", "bottom-right");
                    return;
                }
                else if (result == "1003?") {
                    ShowMessage('warning', 'Warning - Amendment', "FWB for this " + SLICaption + " is already done, " + SLICaption + " details can't be amended", "bottom-right");
                    return;
                }
                else if (result == "1111?") {
                    ShowMessage('warning', 'Warning - Amendment', "Print for this " + SLICaption + " is already done, " + SLICaption + " details can't be amended", "bottom-right");
                    return;
                }
                else
                    ShowMessage('warning', 'Warning - Dimension', "unable to process.", "bottom-right");
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - Dimension', "unable to process.", "bottom-right");

            }
        });
        // }
        //else
        //{
        //    ShowMessage('warning', 'Warning - SLI', "Enter valid ULD No.", "bottom-right");
        //}
    }
    return flag;
}

function SaveSLIAWBInfo() {
    var flag = false;
    var sliSNo = (currentslisno == "" ? 0 : currentslisno);
    var awbNo = $("#AWBNo").val();

    CheckBOENoexist("#" + $('#BOENo').attr("id"));
    $("#CustomerType").attr("disabled", false);
    $("#Text_CustomerType").data("kendoAutoComplete").enable(true);
    $("#AirlineSNo").attr("disabled", false);
    $("#Text_AirlineSNo").data("kendoAutoComplete").enable(true);
    $("#AccountSNo").attr("enabled", true);
    $("#Text_AccountSNo").data("kendoAutoComplete").enable(true);
    $("#DestinationAirportSNo").attr("enabled", true);
    $("#Text_DestinationAirportSNo").data("kendoAutoComplete").enable(true);
    $("#CurrencySNo").attr("enabled", true);
    $("#Text_CurrencySNo").data("kendoAutoComplete").enable(true);
    $("input[type=checkbox]").removeAttr("disabled")
    $("input[type=checkbox]").attr("enabled", true);
    $('#divDetail input,#divDetail select').attr('enabled', 1);
    $('#divDetail input[type="hidden"]').removeAttr('disabled');
    $('#divDetail input[type="hidden"]').attr('enabled', 1);
    $('#divDetail input[controltype="autocomplete"]').each(function () {
        $("#" + $(this).attr("name")).removeAttr("disabled");
        $("#" + $(this).attr("name")).data("kendoAutoComplete").enable(true);
    })
    $('#divDetail input[type="text"]').removeAttr('disabled');
    $('#divDetail input[type="text"]').attr('enabled', 1);

    if ($("#Text_CustomerType").val() == "WALK IN") {
        if ($("#Text_AWBNos").val() != undefined && $("#Text_AWBNos").val() != "") {
            awbNo = $("#Text_AWBNos").val().substring(4, 12);
            $("#AWBNo").val(awbNo);
            $("#AWBPrefix").val($("#Text_AWBNos").val().substring(0, 3));
        }
        else {
            if (TempSLIAwbNo != "" && $("#Text_AccountSNo").val() == "SAS") {
                awbNo = TempSLIAwbNo.substring(4, 12) || awbNo;

                if ($("#AWBNo").val() == "" && $("#AWBPrefix").val() == "") {
                    $("#AWBNo").val(awbNo);
                    $("#AWBPrefix").val(TempSLIAwbNo.substring(0, 3) || "SLI");
                }
            }
        }
    }
    $("input:checkbox[name=isCSD]").attr("disabled", false);
    var ShipmentInfo = $("#divDetail").serializeToJSON();




    // debugger

    //alert($('input:radio[name=SLIType]:checked').val());
    //var ShipmentInfo = {
    //    AWBNo: $("#AWBNo").val(),
    //    DeclaredCarriagevalue: $("#ForCarriage").val(),
    //    DeclaredCustomValue: $('#ForCustoms').val(),
    //    ChargeCode: $('#ChargeCode').val(),
    //    DestinationCitySNo: $('#Text_AptDestn').data("kendoAutoComplete").key(),
    //    AirlineSNo: $("#Text_Airline").data("kendoAutoComplete").key(),
    //    RoutingCity: $("#Text_Routing").data("kendoAutoComplete").key(),
    //    BookingType: $("#Text_Type").data("kendoAutoComplete").key(),
    //    SPHCCode: $('#Text_SpecialHandlingCode').data("kendoAutoComplete").key(),
    //    MovementTypeSNo: 2,
    //    BOENo: $("#BOENumber").val(),
    //    IDNumber: $('#IDNumber').val(),
    //    IDRetained: $("[id='IDRetained']:checked").val() == 1 ? 0 : 1,
    //    AccountSNo: $("#Text_IssuingAgent").data("kendoAutoComplete").key(),
    //    CreatedBy: 2
    //};

    // alert($('#SLIType:checked').val());
    //  alert(JSON.stringify(ShipmentInfo));

    //  alert(JSON.stringify({ AWBNo: $("#AWBNo").val(), SLISNo: sliSNo, ShipmentInformation: ShipmentInfo, UpdatedBy: 2 }));
    var ValidSLIPart = true;
    if ($('input:radio[name=SLIType]:checked').val() == 1) {
        if (($("#AWBPrefix").val().toUpperCase() == 'SLI') || ($("#AWBPrefix").val() == '') || ($("#AWBNo").val() == ''))
            ValidSLIPart = false;


        // ShowMessage('warning', 'Warning - SLI', "Lot No =" + resultVal + "  Already exists", "bottom-right");
    }
    else {
        if ((($("#AWBPrefix").val().toUpperCase() == 'SLI') && ($('#HAWBNo').val() != '')) || ($("#AWBPrefix").val() == '') || ($("#AWBNo").val() == ''))
            ValidSLIPart = false;
        if ((($("#AWBPrefix").val().toUpperCase() == 'SLI') && ($('#HAWBCount').val() != '')) || ($("#AWBPrefix").val() == '') || ($("#AWBNo").val() == ''))
            ValidSLIPart = false;
    }


    if (ValidSLIPart == true && $("#AWBPrefix").val().length == 3 && $("#AWBNo").val().length == 8) {
        if (SHCTempDetails.length > 0) {
            $.ajax({
                url: "Services/Shipment/SLInfoService.svc/saveSLITempDetails", async: false, type: "POST", dataType: "json", cache: false,
                data: JSON.stringify({ SHCTempDetails: SHCTempDetails }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result == "1") {
                        SHCTempDetails = [];
                        // ShowMessage('success', 'Success - Temp Details', "Temp Details  processed successfully", "bottom-right");
                        //ResetTempDetailsforPOPUp();
                    }
                }
            });
        }

        if (!GetSLIAWBExist()) {
            $.ajax({
                url: "Services/Shipment/SLInfoService.svc/SaveSLInfo", async: false, type: "POST", dataType: "json", cache: false,
                //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
                data: JSON.stringify({ AWBNo: $("#AWBPrefix").val() + '-' + $("#AWBNo").val(), SLISNo: sliSNo, SLINo: $('#SLINo').val(), SLIType: $('#SLIType:checked').val(), ShipmentInformation: ShipmentInfo }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var resultStatus = result.split('?')[0];
                    var resultVal = result.split('?')[1];
                    var resultembstatus = result.split('?')[2];
                    if (resultembstatus == "a") {
                        if (resultStatus == "0") {
                            CheckCancel = 0;
                            //CleanUI();
                            //  cfi.ShowIndexView("divShipmentDetails", "Services/Shipment/AcceptanceService.svc/GetGridData/" + _CURR_PRO_ + "/SLI/Booking");
                            //  cfi.ShowIndexView("divShipmentDetails", "Services/Shipment/SLInfoService.svc/GetSLIGridData/" + _CURR_PRO_ + "/SLI/Booking/" + AWBPrefix + "/" + AWBNo + "/" + LoggedInCity, "Scripts/maketrans.js?" + Math.random());
                            ShowMessage('success', 'Success -' + SLICaption + '', "" + SLICaption + " No=" + resultVal + " Processed Successfully", "bottom-right");
                            $("#btnSave").unbind("click");
                            //if(currentslisno==0)
                            //    funGetNewForm();
                            $('#divDetail').html('');
                            TempSHCCode = "";
                            flag = true;
                        }
                        else if (resultStatus == "1") {
                            ShowMessage('warning', 'Warning - ' + SLICaption + '', "" + SLICaption + " No =" + resultVal + "  Already exists", "bottom-right");
                            BindSLICode();
                            if (userContext.GroupName.toUpperCase() == "AGENT") {
                                fixDisabled();
                            }
                        }
                        else if (resultStatus == "2") {
                            ShowMessage('warning', 'Warning - ' + SLICaption + '', "" + SLICaption + " No =" + resultVal + "  Already Finalized", "bottom-right");
                            //  BindSLICode();
                            fixDisabled();
                        }
                        else if (resultStatus == "3") {
                            ShowMessage('warning', 'Warning - ' + SLICaption + '', "" + SLICaption + " cannot be finalized. Enter HAWB number for all associated " + SLICaption + " parts", "bottom-right");
                            //  BindSLICode();
                            fixDisabled();
                        }
                        else if (result == "Subquery returned more than 1 value. This is not permitted when the subquery follows =, !=, <, <= , ") {
                            ShowMessage('warning', 'Warning - ' + SLICaption + '', "AWB No is already utilized", "bottom-right");
                            //  BindSLICode();
                            fixDisabled();
                        }
                        else {
                            ShowMessage('warning', 'Warning - ' + SLICaption + '', "unable to process.", "bottom-right");
                            if (userContext.GroupName.toUpperCase() == "AGENT") {
                                fixDisabled();
                            }
                        }
                    }
                    else if (resultembstatus == "STOP") {
                        btnNew
                        //if (userContext.SpecialRights.SLIB == true) {
                        //   // alert("can be ament only HAWB details");
                        //}
                        //else {
                        ShowMessage('warning', 'Warning - Amendment', "RCS for this " + SLICaption + " Part is already done, " + SLICaption + " details can't be amended", "bottom-right");
                        fixDisabled();
                        // }
                    }
                    else if (resultembstatus == "STOP1") {
                        ShowMessage('warning', 'Warning - Amendment', "" + SLICaption + " Cancelled, " + SLICaption + " details can't be amended", "bottom-right");
                        fixDisabled();
                    }
                    else if (resultembstatus == "STOP5") {
                        ShowMessage('warning', 'Warning - Amendment', "" + SLICaption + " Cancelled,New " + SLICaption + " part cannot be created", "bottom-right");
                        fixDisabled();
                    }
                    else if (resultembstatus == "SHC") {
                        ShowMessage('warning', 'Warning - ' + SLICaption + ' SHC', "Maximum 09 Distinct Special Handling Codes can be selected in a " + SLICaption + ".", "bottom-right");
                    }
                    else if (resultembstatus == "AGENTSTOP") {
                        ShowMessage('warning', 'Warning - Amendment', "Print for this " + SLICaption + " is already done, " + SLICaption + " details can't be amended", "bottom-right");
                        fixDisabled();
                    }
                    else if (resultembstatus == "NODIMS") {
                        ShowMessage('warning', 'Warning - ' + SLICaption + '', "Kindly enter Dimensions for Walk In shipment.", "bottom-right");
                        if (userContext.GroupName.toUpperCase() == "AGENT") {
                            fixDisabled();
                        }
                    }
                    else {
                        if (resultembstatus == "Temp") {
                            ShowMessage('warning', 'Warning - ' + SLICaption + '', "Temp Details are required.", "bottom-right");
                            //fixDisabled();
                        }
                        else {
                            var Embargo = resultembstatus.split('@')[0];
                            var EmbargoName = resultembstatus.split('@')[1];
                            ShowMessage('warning', 'Warning-Embargo-' + EmbargoName.toUpperCase() + '', Embargo.toUpperCase(), "bottom-right");
                            // fixDisabled();
                        }
                    }
                },
                error: function (xhr) {
                    ShowMessage('warning', 'Warning - ' + SLICaption + '', "unable to process.", "bottom-right");
                    //fixDisabled();

                }
            });

        }
    }
    else {
        if ($("#AWBPrefix").val().length == 3 && $("#AWBNo").val().length == 8) {
            ShowMessage('warning', 'Warning - ' + SLICaption + '', "Valid AWB No. required in case of HAWB", "bottom-right");

        }
        else {
            ShowMessage('warning', 'Warning - ' + SLICaption + '', "Enter Valid AWB No.", "bottom-right");

        }
        flag = false;
    }

    return flag;
}



function funDimValidate() {
    var Pccount = 0, Gcount = 0;
    var Dimflag = 0;
    if ($("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").length == 1) {
        $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").each(function () {

            if (($(this).find("input[id^='Pieces']").val() == '') && ($(this).find("input[id^='GrossWeight']").val() != '')) {
                Dimflag = 1;
            }
            if (($(this).find("input[id^='Pieces']").val() != '') && ($(this).find("input[id^='GrossWeight']").val() == '')) {
                Dimflag = 2;
            }
            if ($(this).find("input[id^='SLISPHCCode']").val() != "" && $(this).find("input[id^='Pieces']").val() == '') {
                Dimflag = 1;
            }
            if (($(this).find("input[id^='Pieces']").val() != '') && ($(this).find("input[id^='GrossWeight']").val() == '') && $(this).find("input[id^='CapturedWeight']").val() != "") {
                if (parseFloat($(this).find("input[id^='CapturedWeight']").val()) <= parseFloat($(this).find("input[id^='TareWeight']").val())) {
                    Dimflag = 4;
                }
            }
            if (($(this).find("input[id^='Pieces']").val() != '') && ($(this).find("input[id^='GrossWeight']").val() != '') && $(this).find("input[id^='VolumeWt']").val() == "") {
                Dimflag = 5;
            }
        });
    }
    else {
        $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").each(function () {
            if ($(this).find("input[id^='Pieces']").val() == '') {
                Dimflag = 1;
            }
        });
        $("div[id$='divareaTrans_sli_slidimension']").find("[id='areaTrans_sli_slidimension']").each(function () {
            if ($(this).find("input[id^='Pieces']").val() == '') {
                Dimflag = 1;
            }
            else if ($(this).find("input[id^='GrossWeight']").val() == '')
            { Dimflag = 2; }

        });




    }
    return Dimflag;
}
function funDimensionValidate() {
    var Dimflag = 0;
    var isrequired = 1;
    var sphcCodeSNonew = "";
    var CheckULDLen = $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").find("input[id^='UGrossWeight']").val();

    if ($("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").find("input[id^='UGrossWeight']").val() == "") {
        $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").each(function () {
            if (($(this).find("input[id^='Pieces']").val() != '') && ($(this).find("input[id^='GrossWeight']").val() != '' && Dimflag == 0)) {
                isrequired = 1;
                var sphcCodeSNo = $(this).find("input[id^='Multi_SLISPHCCode']").val();
                if (sphcCodeSNo == undefined) {
                    sphcCodeSNo = "";
                }
                if (sphcCodeSNo != "") {
                    sphcCodeSNo = sphcCodeSNo + "," + $(this).find("input[id^='SLISPHCCode']").val();
                }
                if (sphcCodeSNo == "")
                    sphcCodeSNo = $(this).find("input[id^='SLISPHCCode']").val() || $(this).find("input[id^='SLISPHCCode']").val();
                $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").each(function (row, tr) {
                    if ($(tr).find("input[id^='SLISPHCCode']").val() != "") {
                        sphcCodeSNonew = sphcCodeSNo + "," + $(tr).find("input[id^='SLISPHCCode']").val() || $(tr).find("input[id^='Multi_SLISPHCCode']").val();
                    }
                });
                var sphcarr = sphcCodeSNonew.split(",");
                for (var i = 0; i < sphcarr.length; i++) {
                    if (sphcarr[i] == "13") {
                        isrequired = 0;
                    }
                }
                if (sphcCodeSNonew == "") {
                    isrequired = 1;

                }
                if (isrequired == 0) {
                    Dimflag = 0;
                }

                else {
                    if ($(this).find("input[id^='Length']").val() == '' && CustomerTypeCount == 2) {
                        Dimflag = 1;
                        return;
                    }
                    else if ($(this).find("input[id^='Width']").val() == '' && CustomerTypeCount == 2) {
                        Dimflag = 2;
                        return;
                    }
                    else if ($(this).find("input[id^='Height']").val() == '' && CustomerTypeCount == 2) {
                        Dimflag = 3;
                        return;
                    }
                    else {
                        Dimflag = 0;
                        return;
                    }
                }
            }

        });
    }

    if ($("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").find("input[id^='UGrossWeight']").val() != "" && CustomerTypeCount == 2) {
        $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").each(function () {
            if ($(this).find("input[id^='Pieces']").val() != '' && Dimflag == 0) {
                isrequired = 1;
                var sphcCodeSNo = $(this).find("input[id^='Multi_SLISPHCCode']").val();
                if (sphcCodeSNo == undefined) {
                    sphcCodeSNo = "";
                }
                if (sphcCodeSNo != "") {
                    sphcCodeSNo = sphcCodeSNo + "," + $(this).find("input[id^='SLISPHCCode']").val();
                }
                if (sphcCodeSNo == "")
                    sphcCodeSNo = $(this).find("input[id^='SLISPHCCode']").val() || $(this).find("input[id^='SLISPHCCode']").val();
                $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").each(function (row, tr) {
                    if ($(tr).find("input[id^='SLISPHCCode']").val() != "") {
                        sphcCodeSNonew = sphcCodeSNo + "," + $(tr).find("input[id^='SLISPHCCode']").val() || $(tr).find("input[id^='Multi_SLISPHCCode']").val();
                    }
                });
                var sphcarr = sphcCodeSNonew.split(",");
                for (var i = 0; i < sphcarr.length; i++) {
                    if (sphcarr[i] == "13") {
                        isrequired = 0;
                    }
                }
                if (sphcCodeSNonew == "") {
                    isrequired = 1;

                }
                if (isrequired == 0) {
                    Dimflag = 0;
                }

                else {
                    if ($(this).find("input[id^='Length']").val() == '' && CustomerTypeCount == 2) {
                        Dimflag = 1;
                        return;
                    }
                    else if ($(this).find("input[id^='Width']").val() == '' && CustomerTypeCount == 2) {
                        Dimflag = 2;
                        return;
                    }
                    else if ($(this).find("input[id^='Height']").val() == '' && CustomerTypeCount == 2) {
                        Dimflag = 3;
                        return;
                    }
                    else {
                        Dimflag = 0;
                        return;
                    }
                }
            }

        });
    }


    if ($("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").find("input[id^='UGrossWeight']").val() == "") {
        if ($("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").find("input[id^='Pieces']").val() != "" && Dimflag == 0) {
            $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").each(function () {
                sphcCodeSNonew = "";
                if ($(this).find("input[id^='Pieces']").val() != '' && Dimflag == 0) {
                    if ($(this).find("input[id^='Length']").val() == '' && $(this).find("input[id^='Width']").val() != '' && $(this).find("input[id^='Height']").val() != '') {
                        Dimflag = 1;
                    }
                    else if ($(this).find("input[id^='Length']").val() != '' && $(this).find("input[id^='Width']").val() == '' && $(this).find("input[id^='Height']").val() != '') {

                        Dimflag = 2;
                    }
                    else if ($(this).find("input[id^='Length']").val() != '' && $(this).find("input[id^='Width']").val() != '' && $(this).find("input[id^='Height']").val() == '') {
                        Dimflag = 3;
                    }
                    else if ($(this).find("input[id^='Length']").val() != '' && $(this).find("input[id^='Width']").val() == '' && $(this).find("input[id^='Height']").val() == '') {
                        Dimflag = 2;
                    }
                    else if ($(this).find("input[id^='Length']").val() == '' && $(this).find("input[id^='Width']").val() != '' && $(this).find("input[id^='Height']").val() == '') {
                        Dimflag = 1;
                    }
                    else if ($(this).find("input[id^='Length']").val() == '' && $(this).find("input[id^='Width']").val() == '' && $(this).find("input[id^='Height']").val() != '') {
                        Dimflag = 1;
                    }
                    else if ($(this).find("input[id^='Length']").val() == '' && $(this).find("input[id^='Width']").val() == '' && $(this).find("input[id^='Height']").val() == '') {
                        isrequired = 1;
                        var sphcCodeSNo = $(this).find("input[id^='Multi_SLISPHCCode']").val();
                        if (sphcCodeSNo == undefined) {
                            sphcCodeSNo = "";
                        }
                        if (sphcCodeSNo != "") {
                            sphcCodeSNo = sphcCodeSNo + "," + $(this).find("input[id^='SLISPHCCode']").val();
                        }
                        if (sphcCodeSNo == "")
                            sphcCodeSNo = $(this).find("input[id^='SLISPHCCode']").val() || $(this).find("input[id^='SLISPHCCode']").val();


                        if (sphcCodeSNo == undefined) {
                            sphcCodeSNo == "";
                        }
                        $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").each(function (row, tr) {

                            if ($(tr).find("input[id^='SLISPHCCode']").val() != "") {
                                sphcCodeSNonew = sphcCodeSNo + "," + $(tr).find("input[id^='SLISPHCCode']").val() || $(tr).find("input[id^='Multi_SLISPHCCode']").val();
                            }
                        });
                        var sphcarr = sphcCodeSNonew.split(",");
                        for (var i = 0; i < sphcarr.length; i++) {
                            if (sphcarr[i] == "13") {
                                isrequired = 0;
                            }
                        }
                        if (sphcCodeSNonew == "" && sphcCodeSNo == "") {
                            isrequired = 1;

                        }
                        if (isrequired == 0) {
                            Dimflag = 0;
                        }
                        else {
                            if (CustomerTypeCount == 2) {
                                Dimflag = 1;
                                return;
                            }
                        }
                    }
                    else {
                        Dimflag = 0;
                    }
                }
            });
        }
    }

    if ($("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").find("input[id^='Pieces']").val() != "" && Dimflag == 0) {
        $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").each(function () {
            if ($(this).find("input[id^='Pieces']").val() != '' && Dimflag == 0) {
                if ($(this).find("input[id^='Length']").val() == '' && $(this).find("input[id^='Width']").val() != '' && $(this).find("input[id^='Height']").val() != '') {
                    Dimflag = 1;
                }
                else if ($(this).find("input[id^='Length']").val() != '' && $(this).find("input[id^='Width']").val() == '' && $(this).find("input[id^='Height']").val() != '') {

                    Dimflag = 2;
                }
                else if ($(this).find("input[id^='Length']").val() != '' && $(this).find("input[id^='Width']").val() != '' && $(this).find("input[id^='Height']").val() == '') {
                    Dimflag = 3;
                }
                else if ($(this).find("input[id^='Length']").val() != '' && $(this).find("input[id^='Width']").val() == '' && $(this).find("input[id^='Height']").val() == '') {
                    Dimflag = 2;
                }
                else if ($(this).find("input[id^='Length']").val() == '' && $(this).find("input[id^='Width']").val() != '' && $(this).find("input[id^='Height']").val() == '') {
                    Dimflag = 1;
                }
                else if ($(this).find("input[id^='Length']").val() == '' && $(this).find("input[id^='Width']").val() == '' && $(this).find("input[id^='Height']").val() != '') {
                    Dimflag = 1;
                }
            }

        });
    }


    return Dimflag;

}
function funULDDimensionValidate() {
    var Dimflag = 0;
    var isrequired = 1;
    // var sphcCodeSNonew = "";
    $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").each(function () {
        // sphcCodeSNonew = "";
        isrequired = 1;
        // Dimflag = 0;
        var sphcCodeSNo = $(this).find("input[id^='Multi_ULDSPHCCode']").val();
        if (sphcCodeSNo == undefined) {
            sphcCodeSNo = "";
        }
        if (sphcCodeSNo != "") {
            sphcCodeSNo = sphcCodeSNo + "," + $(this).find("input[id^='ULDSPHCCode']").val();
        }
        if (sphcCodeSNo == "") {
            sphcCodeSNo = $(this).find("input[id^='ULDSPHCCode']").val() || $(this).find("input[id^='ULDSPHCCode']").val();
        }

        var rel = $(this).attr("rel");
        if (rel != undefined) {
            $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").each(function (row, tr) {
                if ($(tr).attr("linkuld") == rel) {
                    if ($(tr).attr("rel") == undefined) {
                        sphcCodeSNo = $(tr).find("input[id^='ULDSPHCCode']").val() || $(tr).find("input[id^='Multi_ULDSPHCCode']").val();
                    }
                }
            });
        }
        if (sphcCodeSNo == undefined) {
            sphcCodeSNo == "";
        }
        var sphcarr = sphcCodeSNo.split(",");
        for (var i = 0; i < sphcarr.length; i++) {
            if (sphcarr[i] == "13") {
                isrequired = 0;
            }
        }
        if (sphcCodeSNo == "") {
            isrequired = 1;

        }
        if (isrequired == 1 && CustomerTypeCount == 2) {
            if (Dimflag == 0) {
                if (($(this).find("input[id^='UldPieces']").val() != '')) {
                    if ($(this).find("input[id^='ULDLength']").val() == '') {
                        Dimflag = 1;
                        return Dimflag;
                        // return Dimflag;
                    }
                    else if ($(this).find("input[id^='ULDWidth']").val() == '') {
                        Dimflag = 2;
                        return Dimflag;
                        //return Dimflag;
                    }
                    else if ($(this).find("input[id^='ULDHeight']").val() == '') {
                        Dimflag = 3;
                        return Dimflag;
                        //return Dimflag;
                    }
                    else {
                        Dimflag = 0;
                    }
                }
            }
        }


        if ($(this).find("input[id^='UldPieces']").val() != "" && Dimflag == 0 && isrequired == 0) {

            if ($(this).find("input[id^='ULDLength']").val() == '' && $(this).find("input[id^='ULDWidth']").val() != '' && $(this).find("input[id^='ULDHeight']").val() != '') {
                Dimflag = 1;
                return Dimflag;
            }
            else if ($(this).find("input[id^='ULDLength']").val() != '' && $(this).find("input[id^='ULDWidth']").val() == '' && $(this).find("input[id^='ULDHeight']").val() != '') {

                Dimflag = 2;
                return Dimflag;
            }
            else if ($(this).find("input[id^='ULDLength']").val() != '' && $(this).find("input[id^='ULDWidth']").val() != '' && $(this).find("input[id^='ULDHeight']").val() == '') {
                Dimflag = 3;
                return Dimflag;
            }
            else if ($(this).find("input[id^='ULDLength']").val() != '' && $(this).find("input[id^='ULDWidth']").val() == '' && $(this).find("input[id^='ULDHeight']").val() == '') {
                Dimflag = 2;
                return Dimflag;
            }
            else if ($(this).find("input[id^='ULDLength']").val() == '' && $(this).find("input[id^='ULDWidth']").val() != '' && $(this).find("input[id^='ULDHeight']").val() == '') {
                Dimflag = 1;
                return Dimflag;
            }
            else if ($(this).find("input[id^='ULDLength']").val() == '' && $(this).find("input[id^='ULDWidth']").val() == '' && $(this).find("input[id^='ULDHeight']").val() != '') {
                Dimflag = 1;
                return Dimflag;
            }
            else if ($(this).find("input[id^='ULDLength']").val() == '' && $(this).find("input[id^='ULDWidth']").val() == '' && $(this).find("input[id^='ULDHeight']").val() == '') {
                if (isrequired == 1 && CustomerTypeCount == 2) {
                    Dimflag = 1;
                    return Dimflag;
                }
            }
            else {
                Dimflag = 0;
            }
        }
        if ($(this).find("input[id^='UldPieces']").val() != "" && Dimflag == 0) {

            if ($(this).find("input[id^='ULDLength']").val() == '' && $(this).find("input[id^='ULDWidth']").val() != '' && $(this).find("input[id^='ULDHeight']").val() != '') {
                Dimflag = 1;
                return Dimflag;
            }
            else if ($(this).find("input[id^='ULDLength']").val() != '' && $(this).find("input[id^='ULDWidth']").val() == '' && $(this).find("input[id^='ULDHeight']").val() != '') {

                Dimflag = 2;
                return Dimflag;
            }
            else if ($(this).find("input[id^='ULDLength']").val() != '' && $(this).find("input[id^='ULDWidth']").val() != '' && $(this).find("input[id^='ULDHeight']").val() == '') {
                Dimflag = 3;
                return Dimflag;
            }
            else if ($(this).find("input[id^='ULDLength']").val() != '' && $(this).find("input[id^='ULDWidth']").val() == '' && $(this).find("input[id^='ULDHeight']").val() == '') {
                Dimflag = 2;
                return Dimflag;
            }
            else if ($(this).find("input[id^='ULDLength']").val() == '' && $(this).find("input[id^='ULDWidth']").val() != '' && $(this).find("input[id^='ULDHeight']").val() == '') {
                Dimflag = 1;
                return Dimflag;
            }
            else if ($(this).find("input[id^='ULDLength']").val() == '' && $(this).find("input[id^='ULDWidth']").val() == '' && $(this).find("input[id^='ULDHeight']").val() != '') {
                Dimflag = 1;
                return Dimflag;
            }
            else if ($(this).find("input[id^='ULDLength']").val() == '' && $(this).find("input[id^='ULDWidth']").val() == '' && $(this).find("input[id^='ULDHeight']").val() == '') {
                if (isrequired == 1 && CustomerTypeCount == 2) {
                    Dimflag = 1;
                    return Dimflag;
                }
            }
            else {
                Dimflag = 0;
            }
        }

    });
    return Dimflag;

}



function GetSLIAction(e) {
    $(".tool-items").hide();
    var RecID = $(e).attr('href').split('=')[1];
    $(e).attr('href', '#RecID=' + RecID);
    var _CurrentSLISNo = RecID;
    currentslisno = RecID;
    var module = "SLI";

    // alert('sdhjkfg');
    $.ajax({
        url: "Services/Shipment/SLInfoService.svc/GetWebForm/" + _CURR_PRO_ + "/" + module + "/SLIAWB/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divDetail").html(result);
            // BindSLICode();
            $('#SLINo').attr('disabled', 1);
            if (result != undefined || result != "") {
                //   InstantiateControl('divDetail');
                currentprocess = "SLIAWB";
                subprocess = currentprocess;
                $("#btnSave").unbind("click").bind("click", function () {
                    //alert('Test');
                    if (cfi.IsValidSection('divDetail')) {
                        if (true) {
                            if (SaveFormData("SLIAWB"))
                                SLISearch();
                        }
                    }
                    else {
                        return false
                    }
                });
                //BindEvents($(e).attr('href', '#RecID=' + RecID));
                //var Button = "<input type=button currentprocess=SLIBooking process=SLIAWB subprocesssno=1052 onclick=BindEvents(this,event);return false; title=AWB Info value=S class=completeprocess ondblclick=BindEvents(this,event,true);>";

                //BindEvents(Button);

                if ($(e).find('span').html().toUpperCase() == "FINAL") {
                    currentslisno = 0;
                    InitializePage("SLIAWB", "divDetail");
                    GetSLIAWBDetails(_CurrentSLISNo);
                    $('input:radio[name=SLIType]:eq(1)').attr("checked", 1);
                    currentslisno = _CurrentSLISNo;
                    SetAWBPrefixCode('Text_AirlineSNo');
                    var Part = $('#SLINo').val().split('-')[1];
                    var MainSLINO = $('#SLINo').val().split('-')[0];
                    $('#SLINo').val(MainSLINO + '-' + (parseInt(Part) - 1));
                    $('#NewSLINo').val(MainSLINO + '-' + (parseInt(Part) - 1));
                    $('span[id="NewSLINo"]').text(MainSLINO + '-' + (parseInt(Part) - 1));
                    $('#btnSave').show();
                    if ($("#HAWBNo").val() != "") {
                        $('#spn').parent().find('font').text('*');
                        $('#AWBNo').attr("data-valid", "minlength[8],required");
                        // SetAWBPrefixCode('Text_AirlineSNo');

                    }
                    else {
                        $('#spn').parent().find('font').text('   ');
                        $('#AWBNo').removeAttr("data-valid");
                    }
                    funRuleForHAWB();
                    GetTempreatureHideAndShow();
                }
                else if ($(e).find('span').html().toUpperCase() == "READ") {
                    currentslisno = _CurrentSLISNo;
                    InitializePage("SLIAWB", "divDetail");
                    $('#divDetail input,#divDetail select').attr('disabled', 1);
                    $('#btnSave').hide();
                    $('#btnSaveToNext').hide();
                    $('#divDetail input[controltype="autocomplete"]').each(function () {
                        $("#" + $(this).attr("name")).data("kendoAutoComplete").enable(false);
                    })
                    $('div[id$="divMultiSPHCCode"]').find('li span[class="k-icon k-delete"]').hide();

                }
                else {
                    currentslisno = 0;
                    InitializePage("SLIAWB", "divDetail");
                    GetSLIAWBDetails(_CurrentSLISNo);
                    $('#btnSave').show();
                    if ($("#HAWBNo").val() != "") {
                        $('#spn').parent().find('font').text('*');
                        $('#AWBNo').attr("data-valid", "minlength[8],required");
                        // SetAWBPrefixCode('Text_AirlineSNo');

                    }
                    else {
                        $('#spn').parent().find('font').text('   ');
                        $('#AWBNo').removeAttr("data-valid");
                    }
                    funRuleForHAWB();
                }
                $('input:radio[name=SLIType]').attr('disabled', 1);
                $('#SLINo').attr('disabled', 1);
                // SetAWBPrefixCode1('Text_AirlineSNo');
                // alert($('input:radio[name=IDRetained]:checked').val());

                if ($('input:radio[name=IDRetained]:checked').val() == 0) {
                    $('#spnIDNumber').show();
                    $('#IDNumber').show();
                    $('#IDNumber').attr("data-valid", "required");
                    $('#IDNumber').attr("data-valid-msg", "Enter ID Number");
                    $('#spnIDNumber').parent().find('font').show();
                }
                else {
                    $('#spnIDNumber').hide();
                    $('#IDNumber').hide();
                    $('#IDNumber').val("");
                    $('#IDNumber').removeAttr("data-valid");
                    $('#IDNumber').removeAttr("data-valid-msg");
                    $('#spnIDNumber').parent().find('font').hide();
                }
                AllowedSpecialChar("IDNumber");

                $('input[name=IDRetained]').click(function () {
                    OnIDRetainedSelection(this);
                });
                //$('span[id="NewSLINo"]').text($('#SLINo').val().split('-')[0] + '-' + (parseInt($('#SLINo').val().split('-')[1]) + 1));
                //$('#SLINo').val($('#SLINo').val().split('-')[0] + '-' + (parseInt($('#SLINo').val().split('-')[1]) + 1));
                //$('span[id="SLINobks"]').text("/");

                //$('#Text_CustomerType').focus();
                //$('#AWBPrefix').val($('#AWBPrefix').val());
                //$('span[id="Hypn"]').text('-');
                //$('#AWBNo').val('00' + $('#SLINo').val().split('-')[0].substr(2, 6));
                $("#tblShipmentInfo").hide();
                GetProcessSequence("SLIBOOKING");
            }
            $('#btnSaveToNext').hide();
            fun_BindAWBPrefix();
            // return true;
        }
        , error: function (rex) {
            alert(rex);
        }
    });

}
function funGetNewForm() {
    $('#btnSaveToNext').hide();
    CleanUI();
    $("#hdnAWBSNo").val("");
    currentslisno = 0;
    IsFinalSLI = false;
    IsProcessed = false;
    var module = "SLI";
    $.ajax({
        url: "Services/Shipment/SLInfoService.svc/GetWebForm/" + _CURR_PRO_ + "/" + module + "/SLIAWB/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divDetail").html(result);
            BindSLICode();
            if (result != undefined || result != "") {
                InitializePage("SLIAWB", "divDetail");
                currentprocess = "SLIAWB";
                subprocess = currentprocess;
                //  font
                $('#SLINo').attr('disabled', 1);
                $("#tblShipmentInfo").hide();
                GetProcessSequence("SLIBOOKING");
                CheckSLIType();
            }
        }
    });


}

function OnTypeSelection(e) {
    if ($('#' + e).val() == "RE-EXPORT" || $('#' + e).val() == "2") {
        $('#spnBOENo').text('BOE No/BOE Verified');
        $('#spnBOENo').show();

        $('#BOENo').show();

        // _tempBOENo
        $('#spnBOENo').parent().find('font').show();
        //$('#spnBOENo').css('display', 'block');
        // $('#BOENo').val('');
        $('#spnBOENo').css("padding-left", "3px");
    }
    else if ($('#' + e).val() == "SEA-AIR" || $('#' + e).val() == "1") {
        //$('#spnBOENo').css('display', 'block');
        //$('#BOENo').css('display', 'block');
        $('#spnBOENo').text('Exit Form No/BOE Verified');
        $('#spnBOENo').show();

        $('#BOENo').show();
        $('#spnBOENo').parent().find('font').show();
        //  $('#BOENo').val('');
        $('#spnBOENo').css("padding-left", "3px");
        //$('#spnBOENo').removeAttr("data-valid");
        //$('#spnBOENo').removeAttr("data-valid-msg");

    }
    else {
        $('#spnBOENo').text('BOE No/BOE Verified');
        //$('#spnBOENo').css('display', 'none');
        //$('#BOENo').css('display', 'none');
        $('#spnBOENo').show();

        $('#BOENo').show();
        // $('td[title="Enter BOE Number"]').hide();
        //$('#BOENo').val("");
        $('#spnBOENo').parent().find('font').hide();
        $('#spnBOENo').css("padding-left", "11px");


    }


}

function OnIDRetainedSelection(e) {
    if ($(e).val() == 0) {
        $('#spnIDNumber').show();
        $('#IDNumber').show();
        $('#IDNumber').attr("data-valid", "required");
        $('#IDNumber').attr("data-valid-msg", "Enter ID Number");
        $('#spnIDNumber').parent().find('font').show();
    }
    else {
        $('#spnIDNumber').hide();
        $('#IDNumber').hide();
        $('#IDNumber').val("");
        $('#IDNumber').removeAttr("data-valid");
        $('#IDNumber').removeAttr("data-valid-msg");
        $('#spnIDNumber').parent().find('font').hide();
    }
    //alert(e.value);
    //if ($('input:radio[name=IDRetained]:checked').val() == 1) { }
}


function OnCustomerTypeSelection(e) {
    if ($('#' + e).val() == "REGULAR" || $('#' + e).val() == "2") {
        $('#Shipper_Agent').attr('ReadOnly', 'ReadOnly');
        $('#Shipper_Agent').val('');
    }
    else {
        $('#Shipper_Agent').removeAttr('ReadOnly');
    }

}
function onAgentSelection(e) {
    $('#Shipper_Agent').val($('#' + e).val().toUpperCase());
    if ($("#Text_AccountSNo").val().toUpperCase() != "SAS") {
        if ($("#AWBPrefix").val() == "" && $("#AWBNo").val() == "") {
            TempSLIAwbNo = $("#Text_AWBNos").val();
        }
        //$("#spn").show();
        $("#AWBPrefix").show();
        // $("#AWBPrefix").val("");
        $("span[id=Hypn]").show();
        $("#AWBNo").show();
        // $("#AWBNo").val("");
        $("#AWBNos").remove();
        $("#Text_AWBNos").remove();
        $("#AWBPrefix").parent().parent().find("span[class='k-widget k-combobox k-header']").remove();
        $("#spn").text("AWB No (XXX-00000000)");
        $("#spn").css("padding-left", "4px");
        if ($("#Text_AccountSNo").val() == "SAS") {
            $("#AccountSNo").val("");
            $("#Text_AccountSNo").val("");
        }
        //$("#SHCStatement").hide();
        //$("#spnSHCStatement").hide();
    }
    else {
        if ($("#Text_CustomerType").val().toUpperCase() == "WALK IN") {
            $("#AccountSNo").val("2049");
            $("#Text_AccountSNo").val("SAS");
            $("#Shipper_Agent").val("SAS");
            //$("#SHCStatement").show();
            //$("#spnSHCStatement").show();
            //$("#spn").hide();
            $("#AWBPrefix").hide();
            $("span[id=Hypn]").hide();
            $("#AWBNo").hide();
            // $("#AWBPrefix").val("");
            // $("#AWBNo").val("");
            if ($("#AWBNos").val() == undefined) {
                //$("#spn").text("Select AWBNo");
                $("#Hypn").after("<input type='hidden' id='AWBNos' name='AWBNos' tabindex='0'  /> <input type=text id='Text_AWBNos' name='Text_AWBNos' tabindex='0'  controltype='autocomplete'/>");
                cfi.AutoComplete("AWBNos", "AWBNo", "vwAWBSLIStock", "SNo", "AWBNo", ["AWBNo"], SetAWBOLd, "contains");
                $("#AWBNos").val("");
                //$("#AWBNos").removeAttr("data - valid");
                $("#Text_AWBNos").val("");
            }
        }
    }
    GetSLIAWBExist();
}
function SetAWBOLd() {
    if ($('#isReserved').is(":checked")) {
        if ($("#Text_AWBNos").val()) {
            Reserved($("#Text_AWBNos").val())
            var r = jConfirm("This AWB is reserved for '" + ReservedFor + "' . Do you wish to continue", "", function (r) {
                if (r) {

                }
                else {
                    $("#AWBNo").val('');
                    $("#Text_AWBNos").val('');
                    return
                }
            })
        }
    }
    var awbNo = $("#AWBNo").val();
    if ($("#Text_CustomerType").val() == "WALK IN") {
        if ($("#Text_AWBNos").val() != undefined && $("#Text_AWBNos").val() != "") {
            awbNo = $("#Text_AWBNos").val().substring(4, 12);
            $("#AWBNo").val(awbNo);
            $("#AWBPrefix").val($("#Text_AWBNos").val().substring(0, 3));
        }
        else {
            if (TempSLIAwbNo != "" && $("#Text_AccountSNo").val() == "SAS") {
                var awbNo = TempSLIAwbNo.substring(4, 12) || awbNo;

                if ($("#AWBNo").val() == "" && $("#AWBPrefix").val() == "") {
                    $("#AWBNo").val(awbNo);
                    $("#AWBPrefix").val(TempSLIAwbNo.substring(0, 3) || "SLI");
                }
            }
        }
    }

}

function Reserved(AWBNo) {
    $.ajax({
        url: "Services/Shipment/SLInfoService.svc/Reserved?AWBNo=" + AWBNo, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result != null) {
                var Data = jQuery.parseJSON(result);
                ReservedFor = Data.Table0[0].ReservedFor;
            }
        }
    });
}

var IsCheckModulus7 = false;
var AirlineCode = "";
function SetAWBPrefixCode(e) {
    if ($("#" + e).data("kendoAutoComplete").key() != "") {
        //if ($('input[name="SLIType"]:checked').val() == 1) {
        $.ajax({
            url: "Services/Shipment/SLInfoService.svc/GetSLIAirlineCode?AirlineSNo=" + $("#" + e).data("kendoAutoComplete").key(), async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var AirlineData = Data.Table0;
                // if (AirlineData[0].IsCheckModulus7=="True")
                if ($("#AWBPrefix").val().toUpperCase() == "SLI") {
                    $('#AWBPrefix').val(AirlineData[0].AirlineCode);
                    $('#AWBNo').val("");
                    $("#AWBPrefix").removeAttr("disabled");
                    $('#AWBNo').removeAttr("disabled");
                }

                IsCheckModulus7 = AirlineData[0].IsCheckModulus7 == "True" ? true : false;
                AirlineCode = AirlineData[0].AirlineCode;
            },
            error: {

            }
        });
        //}
    }

}
function SetAWBPrefixCode1(e) {
    if ($("#" + e).data("kendoAutoComplete").key() != "") {
        if ($('input[name="SLIType"]:checked').val() == 1) {
            $.ajax({
                url: "Services/Shipment/SLInfoService.svc/GetSLIAirlineCode?AirlineSNo=" + $("#" + e).data("kendoAutoComplete").key(), async: false, type: "get", dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var Data = jQuery.parseJSON(result);
                    var AirlineData = Data.Table0;
                    // if (AirlineData[0].IsCheckModulus7=="True")
                    if ($("#AWBPrefix").val().toUpperCase() == "SLI") {
                        $('#AWBPrefix').val(AirlineData[0].AirlineCode);
                        $('#AWBNo').val("");
                        $("#AWBPrefix").removeAttr("disabled");
                        $('#AWBNo').removeAttr("disabled");
                    }

                    IsCheckModulus7 = AirlineData[0].IsCheckModulus7 == "True" ? true : false;
                    AirlineCode = AirlineData[0].AirlineCode;
                },
                error: {

                }
            });

        }
    }
}
function ISNumeric(obj) {

    //var e = event;
    //if (e.shiftKey || e.ctrlKey || e.altKey)  // if shift, ctrl or alt keys held down
    //{
    //    e.preventDefault();             // Prevent character input
    //}
    //else {
    //    var n = e.keyCode;
    //    if (!((n == 8)              // backspace
    //            || (n == 46)                // delete
    //            || (n >= 35 && n <= 40)     // arrow keys/home/end
    //            || (n >= 48 && n <= 57)     // numbers on keyboard
    //            || (n >= 96 && n <= 105)    // number on keypad
    //            || (n == 9))                // Tab on keypad
    //            ) {
    //        e.preventDefault();             // Prevent character input
    //    }
    //}
    if ((event.which != 46 || $(obj).val().indexOf('.') != -1) &&
       ((event.which < 48 || event.which > 57) && (event.which < 96 || event.which > 105) &&
         (event.which != 0 && event.which != 8))) {
        event.preventDefault();
    }

    var text = $(obj).val();
    if ((text.indexOf('.') != -1) && (text.substring(text.indexOf('.')).length > 3)) {
        event.preventDefault();
    }
}

var TempSLIAwbNo;

function OnSelectedWalkin(input) {
    //  debugger;
    DisabledAWBNo();
    var CustomerType = $("#Text_CustomerType").val().toUpperCase();
    if (CustomerType == "WALK IN") {
        if (userContext.SpecialRights.ReservedStock) {
            $("#isReserved").show();
        }
        //$("#SHCStatement").show();
        //$("#spnSHCStatement").show();
        //103 cargo db//95 sasDb
        $("#AccountSNo").val("2049");
        $("#Text_AccountSNo").val("SAS");
        $("#Shipper_Agent").val("SAS");
        //$("#spn").hide();
        TempSLIAwbNo = $("#AWBPrefix").val() + "-" + $("#AWBNo").val() || $("#Text_AWBNos").val();

        //if ($("#AWBPrefix").val() == "" && $("#AWBNo").val() == "") {
        //    TempSLIAwbNo = $("#Text_AWBNos").val();
        //}
        $("#AWBPrefix").hide();
        $("span[id=Hypn]").hide();
        $("#AWBNo").hide();
        // $("#AWBPrefix").val("");
        // $("#AWBNo").val("");
        if ($("#AWBNos").val() == undefined) {
            // $("#spn").text("AWB No (XXX-00000000)");
            $("#Hypn").after("<input type='hidden' id='AWBNos' name='AWBNos' tabindex='0'  /> <input type=text id='Text_AWBNos' tabindex='0'   name='Text_AWBNos' controltype='autocomplete'/>");
            cfi.AutoComplete("AWBNos", "AWBNo", "vwAWBSLIStock", "SNo", "AWBNo", ["AWBNo"], SetAWBOLd, "contains");
            $("#AWBNos").val("");
            $("#Text_AWBNos").val("");
        }
    }
    else {
        // $("#spn").show();
        if (CustomerType != "") {
            //$("#SHCStatement").hide();
            //$("#spnSHCStatement").hide();
            $("#AWBPrefix").show();
            // $("#AWBPrefix").val("");
            $("span[id=Hypn]").show();
            $("#AWBNo").show();
            // $("#AWBNo").val("");
            $("#AWBNos").remove();
            $("#Text_AWBNos").remove();
            $("#isReserved").hide();
            $("#AWBPrefix").parent().parent().find("span[class='k-widget k-combobox k-header']").remove();
            // $("#spn").text("AWB No (XXX-00000000)");
            if ($("#Text_AccountSNo").val() == "SAS") {
                $("#AccountSNo").val("");
                $("#Text_AccountSNo").val("");
            }
        }
    }

}
function DisabledAWBNo() {
    if ($("#AWBPrefix").val().toUpperCase() == "SLI") {
        //$("#AWBNo").attr("disabled", true);
        //  $("#AWBNo").attr("enabled", false);
        $("#AWBNo").val($("#SLINo").val().split("-")[0].replace("AA", "00"));
        $("#isManual").attr("checked", "checked");
        //$("#AWBNo").focus();
    }
    //else if ($("#AWBPrefix").val() == "") {
    //    $("#AWBNo").attr("disabled", true);
    //    $("#AWBNo").attr("enabled", false);
    //    //$("#AWBNo").focus();
    //    // $("#isManual").removeAttr("checked");

    //}
    //else {
    //    $("#AWBNo").attr("enabled", true);
    //    $("#AWBNo").attr("disabled", false);

    //    //$("#AWBNo").focus();
    //    //$("#isManual").removeAttr("checked");
    //}
}
function GetBupDetails(SLISNo) {

    //$("#isBup").prop('checked', true)
    if ($("#isBup").prop("checked") == false) {
        $.ajax({
            url: "Services/Shipment/SLInfoService.svc/GetBupDetails?SLISNo=" + SLISNo, async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result != null) {
                    var Data = jQuery.parseJSON(result);
                    var r = jConfirm("Entered details for ULD's under Dimensions would be deleted. DO you wish to continue ?", "", function (r) {
                        //Do you want to remove these Uld's " + Data.Table0[0].ALLULDs + " from this SLINo  " + Data.Table0[0].SLINo
                        if (r == true) {
                            $("#isBup").prop('checked', false)
                        }
                        else {
                            $("#isBup").prop('checked', true)
                        }
                    });
                }
            }
        });
    }
}
function fn_CheckHawb(input) {
    //debugger;
    var Id = $(input).attr("Id");
    var SLINo = $("#SLINo").val();
    $.ajax({
        url: "Services/Shipment/SLInfoService.svc/GETHAWBInfo?SLINo=" + SLINo, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            if (Data.Table0[0].HAWBNo != "" || Data.Table0[0].HAWBCount != "") {
                if (Data.Table0[0].HAWBNo != "") {
                    if (Id == "HAWBNo") {
                        $("#HAWBCount").attr("enabled", false);
                        $("#_tempHAWBCount").attr("enabled", false);
                        $("#HAWBCount").attr("disabled", true);
                        $("#_tempHAWBCount").attr("disabled", true);
                        $("#HAWBNo").attr("enabled", true);
                        $("#HAWBCount").val("");
                        $("#_tempHAWBCount").val("");
                        //if ($(input).val() == "") {
                        //    $("#HAWBNo").val(Data.Table0[0].HAWBNo);
                        //    ShowMessage('warning', 'Warning - HAWB', "HAWB No can not be remove.", "bottom-right");
                        //}
                    }
                    else {
                        $("#HAWBCount").attr("enabled", false);
                        $("#_tempHAWBCount").attr("enabled", false);
                        $("#HAWBCount").attr("disabled", true);
                        $("#_tempHAWBCount").attr("disabled", true);
                        $("#HAWBCount").val("");
                        $("#_tempHAWBCount").val("");

                    }

                }
                if (Data.Table0[0].HAWBCount != "") {
                    if (Id == "HAWBCount") {
                        $("#HAWBNo").attr("enabled", false);
                        $("#HAWBCount").attr("enabled", true);
                        $("#HAWBNo").attr("disabled", true);
                        $("#HAWBNo").val("");
                        //if ($(input).val() == "") {
                        //    $("#HAWBCount").val(Data.Table0[0].HAWBCount);

                        //    ShowMessage('warning', 'Warning - HAWB', "HAWB Count can not be remove.", "bottom-right");
                        //}
                    }
                    else {
                        $("#HAWBNo").attr("enabled", false);
                        $("#HAWBNo").attr("disabled", true);
                        $("#HAWBNo").val("");
                    }
                }


            }
            else {
                if (Id == "HAWBNo" && $(input).val() != "") {
                    $("#HAWBCount").attr("enabled", false);
                    $("#_tempHAWBCount").attr("enabled", false);
                    $("#HAWBCount").attr("disabled", true);
                    $("#_tempHAWBCount").attr("disabled", true);
                    $("#HAWBNo").attr("enabled", true);
                    $("#HAWBCount").val("");
                    $("#_tempHAWBCount").val("");
                }
                else {
                    $("#HAWBCount").attr("enabled", true);
                    $("#_tempHAWBCount").attr("enabled", true);
                    $("#HAWBCount").attr("disabled", false);
                    $("#_tempHAWBCount").attr("disabled", false);
                }

                if (Id == "HAWBCount" && $(input).val() != "") {
                    $("#HAWBNo").attr("enabled", false);
                    $("#HAWBCount").attr("enabled", true);
                    $("#HAWBNo").attr("disabled", true);
                    $("#HAWBNo").val("");
                }
                else {
                    $("#HAWBNo").attr("enabled", true);
                    $("#HAWBNo").attr("disabled", false);
                }
            }
            //Append by Maneesh on dated= 10-2-17 purpose= OnBlur AWB HAWB NO
            if (Data.Table0[0].HawbValuCount > $('#HAWBCount').val() && Data.Table0[0].HawbValuCount != 0) {
                ShowMessage('warning', 'Warning - HAWB', "HAWB Count can not be less than no of house ", "bottom-right");
                $('#HAWBCount').val(Data.Table0[0].HawbValuCount.toString());
            }
            //****************
        }
    });




}
var SLIPartAfterFinal = 0, GSLISinglePart = 0, BOEDate = "", RCSCount = 0;
function BindSLIAWB() {

    $("#btnSave").unbind("click").bind("click", function () {
        //alert('Test');
        if (cfi.IsValidSection('divDetail')) {
            if (true) {
                if (SaveFormData("SLIAWB"))
                    SLISearch();
            }
        }
        else {
            return false
        }
    });


    AfterFinalCountSinglePart = 0;
    TempSHCCode = "";
    SHCTempDetails = [];
    SLIPartAfterFinal = 0;
    cfi.AutoComplete("DestinationAirportSNo", "AirportCode,AirportName", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains", null, null, null, null, checkCCAirline, true);
    cfi.AutoComplete("RoutingCity", "AirportCode,AirportName", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoComplete("AirlineSNo", "CarrierCode,AirlineName", "v_ActiveAirline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], SetAWBPrefixCode1, "contains", null, null, null, null, null, true);
    cfi.AutoComplete("CurrencySNo", "CurrencyCode,CurrencyName", "Currency", "SNo", "CurrencyName", ["CurrencyCode", "CurrencyName"], null, "contains");
    cfi.AutoCompleteByDataSource("BookingType", SLITYPE, OnTypeSelection);
    //cfi.AutoCompleteByDataSource("CustomerType", SLICustomerTYPE, OnCustomerTypeSelection);
    cfi.AutoCompleteByDataSource("CustomerType", SLICustomerTYPE, OnSelectedWalkin);
    AutoCompleteByDataSource("ChargeCode", SLIChargeCode, null, null, checkCCAirline);

    cfi.AutoComplete("SPHCCode", "CODE", "SPHC", "SNO", "CODE", ["CODE"], onselectSphcCode, "contains", ",", null, null, null, null, true);
    cfi.AutoComplete("AccountSNo", "AgentName", "v_WMSAgent", "SNo", "AgentName", ["AgentName"], onAgentSelection, "contains");
    // $("#AWBDate").data("kendoDatePicker").value(new Date());
    // $('#AWBDate').prop('readonly', true);
    var SLISNo = (currentslisno == "" ? 0 : currentslisno);
    $.ajax({
        url: "Services/Shipment/SLInfoService.svc/GetSLIAWBInformation?SLISNo=" + SLISNo, async: false, type: "get", dataType: "json", cache: false,
        //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.Table0;
            var sphcArray = Data.Table1;
            var MaxTempArray = Data.Table2;
            TempSLINo = MaxTempArray[0].TempSLINo;
            var SLIUnloadingFlag = Data.Table3;
            var SLIPartCount = Data.Table4;
            var SLIpart = Data.Table5;
            var SLISinglePart = Data.Table6;
            var BOEVerification = Data.Table7;
            var RCSCountArr = Data.Table8;
            RCSCount = RCSCountArr[0].RCSCount;
            // alert(JSON.stringify(sphcArray));
            if (resData.length > 0) {
                //$("#SHCStatement").hide();
                //$("#spnSHCStatement").hide();
                var resItem = resData[0];

                if (resItem.isBup == "True") {
                    $('input:checkbox[name=isBup]').click(function () {
                        GetBupDetails(SLISNo);
                    });
                }

                $('span[id="NewSLINo"]').text(resItem.SLINo);
                $('span[id="SLINobks"]').text("/");

                $('#AWBPrefix').val(resItem.AWBPrefix);
                $('span[id="Hypn"]').text("-");
                // Hypn
                if (userContext.GroupName.toUpperCase() == "AGENT") {
                    $("#Text_CustomerType").data("kendoAutoComplete").setDefaultValue(1, "REGULAR");
                    $("#CustomerType").val(1);
                    $("#Text_CustomerType").data("kendoAutoComplete").enable(false);
                    $("#AccountSNo").val(userContext.AgentSNo);
                    $("#Text_AccountSNo").data("kendoAutoComplete").setDefaultValue(userContext.AgentSNo, userContext.AgentName);
                    $("#Text_AccountSNo").data("kendoAutoComplete").enable(false);
                    $("input:checkbox[name=isBup]").attr("enabled", false);
                    $("input:checkbox[name=isBup]").attr("disabled", true);
                }
                else {
                    $("#Text_CustomerType").data("kendoAutoComplete").setDefaultValue(resItem.CustomerTypeSNo, resItem.CustomerType);
                    $("#CustomerType").val(resItem.CustomerTypeSNo);
                }
                //$("#Text_CustomerType").data("kendoAutoComplete").setDefaultValue(resItem.CustomerTypeSNo, resItem.CustomerType);
                //$("#CustomerType").val(resItem.CustomerTypeSNo);
                $("#Text_CurrencySNo").data("kendoAutoComplete").setDefaultValue(resItem.CurrencySNo, resItem.CurrencyCode + '-' + resItem.CurrencyName);
                $("#CurrencySNo").val(resItem.CurrencySNo);
                $("#Text_BookingType").data("kendoAutoComplete").setDefaultValue(resItem.BookingTypeSNo, resItem.BookingType);
                $("#BookingType").val(resItem.BookingTypeSNo);
                // $("#SHCStatement").val(resItem.SHCStatement);
                if ($("#Text_CustomerType").val() == "WALK IN" && resItem.AgentName.toUpperCase() == "SAS") {
                    //   $("#SHCStatement").show();
                    //   $("#spnSHCStatement").show();
                    TempSLIAwbNo = $("#AWBPrefix").val() + "-" + $("#AWBNo").val() || $("#Text_AWBNos").val();
                    $("#AWBPrefix").hide();
                    $("span[id=Hypn]").hide();
                    $("#AWBNo").hide();
                    $("#AWBPrefix").val("");
                    $("#AWBNo").val("");
                    $("#Hypn").after("<input type='hidden' id='AWBNos' name='AWBNos' tabindex='0'  /> <input type=text id='Text_AWBNos' tabindex='0'   name='Text_AWBNos' controltype='autocomplete'/>");
                    cfi.AutoComplete("AWBNos", "AWBNo", "vwAWBSLIStock", "SNo", "AWBNo", ["AWBNo"], SetAWBOLd, "contains");
                    $("#Text_AWBNos").val(resItem.AWBPrefix + "-" + resItem.AWBNo);

                }
                else {
                    $("#AWBNo").val(resItem.AWBNo);
                }
                //if (BOEVerification[0].SysValue == "1") {
                //    $("#isBOEVerified").attr("enabled", true);
                //    $("#isBOEVerified").attr("disabled", false);
                //}
                //else {
                $("#agentBup").attr("disabled", "disabled");
                $("#isBOEVerified").attr("enabled", false);
                $("#isBOEVerified").attr("disabled", true);
                //}
                $("#isReserved").hide();
                $("#isManual").attr("enabled", false);
                $("#isManual").attr("disabled", true);


                if (parseInt(resItem.SLINo.substring(9, 11)) > 1 || RCSCount > 0) {
                    $("#CustomerType").attr("disabled", true);
                    $("#Text_CustomerType").data("kendoAutoComplete").enable(false);
                    $("#AirlineSNo").attr("disabled", true);
                    $("#Text_AirlineSNo").data("kendoAutoComplete").enable(false);
                    $("#AccountSNo").attr("enabled", false);
                    $("#Text_AccountSNo").data("kendoAutoComplete").enable(false);
                    $("#DestinationAirportSNo").attr("enabled", false);
                    $("#Text_DestinationAirportSNo").data("kendoAutoComplete").enable(false);
                    $("#CurrencySNo").attr("enabled", false);
                    $("#Text_CurrencySNo").data("kendoAutoComplete").enable(false);
                    $("input:checkbox[name=isCSD]").attr("enabled", false);
                    $("input:checkbox[name=isCSD]").attr("disabled", true);
                }
                if (SLIPartCount[0].SLIPartCount > 1 || RCSCount > 0) {
                    $("#CustomerType").attr("disabled", true);
                    $("#Text_CustomerType").data("kendoAutoComplete").enable(false);
                    $("#AirlineSNo").attr("disabled", true);
                    $("#Text_AirlineSNo").data("kendoAutoComplete").enable(false);
                    $("#AccountSNo").attr("enabled", false);
                    $("#Text_AccountSNo").data("kendoAutoComplete").enable(false);
                    $("#DestinationAirportSNo").attr("enabled", false);
                    $("#Text_DestinationAirportSNo").data("kendoAutoComplete").enable(false);
                    $("#CurrencySNo").attr("enabled", false);
                    $("#Text_CurrencySNo").data("kendoAutoComplete").enable(false);
                    $("input:checkbox[name=isCSD]").attr("enabled", false);
                    $("input:checkbox[name=isCSD]").attr("disabled", true);
                }

                GSLISinglePart = SLISinglePart[0].SLISinglePart;
                if (userContext.SpecialRights.SLIA == true && SLISinglePart[0].SLISinglePart != 1) {
                    //if (SLIpart[0].SLIPart == 2) {
                    SLIPartAfterFinal = SLIpart[0].SLIPart;
                    if (SLIPartAfterFinal > 0) {
                        $('#divDetail input,#divDetail select').attr('disabled', 1);
                        $('#divDetail input[controltype="autocomplete"]').each(function () {
                            $("#" + $(this).attr("name")).data("kendoAutoComplete").enable(false);
                        });
                        $("#BOEDate").attr("enabled", false);
                        $("input:checkbox[name=isBup]").attr("enabled", true);
                        $("input:checkbox[name=isBup]").attr("disabled", false);
                        //$(".k-button").attr("disabled", true);
                        //$("#Text_SPHCCode").data("kendoAutoComplete").enable(true);
                    }
                    $('#btnSave').show();
                    if (RCSCount == 0) {
                        $("#CustomerType").attr("disabled", false);
                        $("#Text_CustomerType").data("kendoAutoComplete").enable(true);
                        $("#AirlineSNo").attr("disabled", false);
                        $("#Text_AirlineSNo").data("kendoAutoComplete").enable(true);
                        $("#AccountSNo").attr("enabled", true);
                        $("#Text_AccountSNo").data("kendoAutoComplete").enable(true);
                        $("#DestinationAirportSNo").attr("enabled", true);
                        $("#Text_DestinationAirportSNo").data("kendoAutoComplete").enable(true);
                        $("#CurrencySNo").attr("enabled", true);
                        $("#Text_CurrencySNo").data("kendoAutoComplete").enable(true);
                        $("input:checkbox[name=isCSD]").attr("enabled", false);
                        $("input:checkbox[name=isCSD]").attr("disabled", true);
                    }
                    if (IsFinalSLI == false) {
                        $("#Text_SPHCCode").data("kendoAutoComplete").enable(true);
                    }
                    if (SLIPartAfterFinal == 2) {
                        $("#Text_SPHCCode").data("kendoAutoComplete").enable(true);
                        $("input:checkbox[name=isBup]").attr("enabled", true);
                        $("input:checkbox[name=isBup]").attr("disabled", false);
                    }
                    if (SLIPartAfterFinal > 2 && resItem.SLINo.length == 8) {
                        $("input:checkbox[name=isBup]").attr("enabled", false);
                        $("input:checkbox[name=isBup]").attr("disabled", true);
                    }
                    //}
                }
                if (SLIPartAfterFinal > 2 && resItem.SLINo.length == 8) {
                    $("input:checkbox[name=isBup]").attr("enabled", false);
                    $("input:checkbox[name=isBup]").attr("disabled", true);
                }
                if (RCSCount > 0) {
                    $('#AWBPrefix').attr("disabled", true);
                    $("#AWBNo").attr("Disabled", true);
                    $('#AWBPrefix').attr("enabled", false);
                    $("#AWBNo").attr("enabled", false);

                }
                if (parseInt(resItem.SLINo.substring(9, 11)) == 1) {
                    $("input:checkbox[name=isCSD]").attr("enabled", true);
                    $("input:checkbox[name=isCSD]").attr("disabled", false);
                }
                $("#SPHCCode").val(resItem.SPHCCode); $("#Text_SPHCCode").val(resItem.Text_SPHCCode);
                $("#SLINo").val(resItem.SLINo);
                $("#Text_AirlineSNo").data("kendoAutoComplete").setDefaultValue(resItem.AirlineSNo, resItem.CarrierCode + '-' + resItem.Airline);
                $("#Text_DestinationAirportSNo").data("kendoAutoComplete").setDefaultValue(resItem.DestinationAirportSNo, resItem.DestinationAirportCode + '-' + resItem.DestinationAirportName);
                $("#Text_RoutingCity").data("kendoAutoComplete").setDefaultValue(resItem.RoutingCitySNo, resItem.RoutingAirportCode + '-' + resItem.RoutingAirportName);
                $("#Text_AccountSNo").data("kendoAutoComplete").setDefaultValue(resItem.AccountSNo, resItem.AgentName);
                $("#DeclaredCarriagevalue").val(resItem.DeclaredCarriagevalue);
                $("#DeclaredCustomValue").val(resItem.DeclaredCustomValue);
                $("#RefSLINo").val(resItem.REFSLINo);
                //$("#StartTemperature").val(resItem.StartTemperature);
                //$("#EndTemperature").val(resItem.EndTemperature);
                //$("#_tempStartTemperature").val(resItem.StartTemperature);
                //$("#_tempEndTemperature").val(resItem.EndTemperature);
                //
                //$("#DeclaredCarriagevalue").data("kendoNumericTextBox").value(parseFloat(resItem.DeclaredCarriagevalue).toFixed(2));
                //$("#DeclaredCustomValue").data("kendoNumericTextBox").value(parseFloat(resItem.DeclaredCustomValue).toFixed(2));
                //$("#_tempDeclaredCustomValue").val(parseFloat(resItem.DeclaredCustomValue).toFixed(2));
                //$("#_tempDeclaredCarriagevalue").val(parseFloat(resItem.DeclaredCarriagevalue).toFixed(2));
                //
                $("#ChargeCode").val(resItem.ChargeCodeSNo);
                $("#Text_ChargeCode").data("kendoAutoComplete").setDefaultValue(resItem.ChargeCodeSNo, resItem.ChargeCode);
                $("#BOENo").val(resItem.BookingTypeSNo == 1 ? resItem.ExitFormNo : resItem.BOENo);
                $("#GRNNo").val(resItem.GRNNo);
                $("#HAWBNo").val(resItem.HAWBNo);
                if (resItem.HAWBCount == 0) {
                    resItem.HAWBCount = "";
                }
                $("#HAWBCount").val(resItem.HAWBCount);
                $("#_tempHAWBCount").val(resItem.HAWBCount);
                if (resItem.HAWBNo != "") {
                    fn_CheckHawb("#HAWBNo");
                }
                else {
                    fn_CheckHawb("#HAWBCount");

                }
                if (resItem.isCSD == "0") {
                    $("input:checkbox[name=isCSD]").removeAttr("checked");
                }
                else {
                    $("input:checkbox[name=isCSD]").attr("checked", 1);
                }

                if (resItem.isManual == "False") {
                    $("input:checkbox[name=isManual]").removeAttr("checked");
                }
                else {
                    if (parseInt(resItem.SLINo.substring(9, 11)) == 1) {
                        $("input:checkbox[name=isManual]").attr("checked", 1);
                    }
                    else {
                        $("input:checkbox[name=isManual]").hide();
                        $("input:checkbox[name=isManual]").removeAttr("checked");
                    }
                }


                // $("#BOEDate").data("kendoDatePicker").value("");
                resItem.isBOEVerified == "True" ? $("#isBOEVerified").prop('checked', true) : $("#isBOEVerified").prop('checked', false);
                $("#isBOEVerified").attr("enabled", false);
                $("#isBOEVerified").attr("disabled", true);
                if (resItem.isBOEVerified == "True") {
                    $("#isBOEVerified").attr("enabled", false);
                    $("#isBOEVerified").attr("disabled", true);
                }
                if ($("#BOENo").val() != "") {
                    $("#BOENo").attr("enabled", false);
                    $("#BOENo").attr("disabled", true);
                    $("#isBOEVerified").attr("enabled", false);
                    $("#isBOEVerified").attr("disabled", true);
                }
                $("span[class='k-picker-wrap k-state-default k-widget k-datepicker k-header k-input']").css("width", "100px");
                $("#BOEDate").css("width", "100px");
                BOEDate = resItem.BOEDate;
                if (resItem.BOEDate != "") {
                    $("#BOEDate").data("kendoDatePicker").value(resItem.BOEDate);
                }
                else {
                    $("#BOEDate").data("kendoDatePicker").value("");
                    $("#BOEDate").val("");
                }
                var BuildUpType = parseInt(resItem.BuildUpType) || 0;
                if (BuildUpType == 2) {
                    $("input:checkbox[name=isBup]").attr("enabled", false);
                    $("input:checkbox[name=isBup]").attr("disabled", true);
                    $("input:checkbox[name=agentBup]").attr("checked", "checked");
                }
                $("input[type=checkbox]").keydown(function (e) {
                    if (e.keyCode === 13) {
                        e.preventDefault();
                    }
                });
                $("input[type=radio]").keydown(function (e) {
                    if (e.keyCode === 13) {
                        e.preventDefault();
                    }
                });

                $("div[id='divMultiSPHCCode']").css("overflow", "auto");
                $("div[id='divMultiSPHCCode']").css("width", "15em");
                ///
                //if (resItem.DeclaredCarriagevalue == "") {
                //    $("#_tempDeclaredCarriagevalue").val("NVD");
                //    $("#DeclaredCarriagevalue").val("NVD");
                //}
                //if (resItem.DeclaredCustomValue == "") {
                //    $("#_tempDeclaredCustomValue").val("NCV");
                //    $("#DeclaredCustomValue").val("NCV");
                //}
                ///
                //   alert(JSON.stringify(resItem));
                $("#IDNumber").val(resItem.IDNumber);
                $("#Shipper_Agent").val(resItem.ShipperAgent.toUpperCase());

                if (resItem.IDRetained == "True") {
                    $('input:radio[name=IDRetained]:eq(0)').attr("checked", 1);

                    $('#spnIDNumber').show();
                    $('#IDNumber').show();
                    $('#IDNumber').attr("data-valid", "required");
                    $('#IDNumber').attr("data-valid-msg", "Enter ID Number");
                    $('#spnIDNumber').parent().find('font').show();
                }
                else {
                    $('input:radio[name=IDRetained]:eq(1)').attr("checked", 1);
                    $('#spnIDNumber').hide();
                    $('#IDNumber').hide();
                    $('#IDNumber').val("");
                    $('#IDNumber').removeAttr("data-valid");
                    $('#IDNumber').removeAttr("data-valid-msg");
                    $('#spnIDNumber').parent().find('font').hide();

                }
                if (parseInt(SLIUnloadingFlag[0].SLIUnloadingFlag) > 0) {
                    $('input:radio[name=SLIType][value=1]').attr("disabled", false);
                }
                else {
                    $('input:radio[name=SLIType][value=1]').attr("disabled", true);
                }
                $('input:radio[name=SLIType]:eq(' + resItem.SLIType + ')').attr("checked", 1);

                resItem.isBup == "True" ? $("#isBup").prop('checked', true) : $("#isBup").prop('checked', false);
                // alert(resItem.IDRetained);
                OnTypeSelection('BookingType');
                if (resItem.SLIType == 1) {
                    $('#spn').parent().find('font').text('*');
                    $('#AWBNo').attr("data-valid", "minlength[8],required");
                    $('input:radio[name=SLIType]').click(function () {
                        ShowMessage('warning', 'Warning - ' + SLICaption + '', "Finalized " + SLICaption + " cannot be Amended", "bottom-right");
                        $('input:radio[name=SLIType]:eq(' + resItem.SLIType + ')').attr("checked", 1);
                        //alert($(this).val());
                    });
                }
                else {
                    CheckSLIType();

                }
                $('#SLINo').attr('disabled', 1);

            }

            var id = $("#Text_SPHCCode").attr("id").replace('Text_', '');
            var txt = $("#Text_SPHCCode").val();
            var val = $("#SPHCCode").val();
            cfi.BindMultiValue(id, txt, val);
            // $("span.k-delete").live("click", function () { fn_RemoveTemprature(this) })


            //if (sphcArray.length > 0) {
            //    if (sphcArray[0].SPHCCodeSNo != "") {
            //        $("#SPHCCode").val(sphcArray[0].SPHCCodeSNo);
            //        cfi.BindMultiValue("SPHCCode", sphcArray[0].SPHCCode, sphcArray[0].SPHCCodeSNo);
            //        
            //    }
            //}
            GetTempreatureHideAndShow();
            //$("#AWBNo").unbind("keyup").bind("keyup", function () {
            //    if ($(this).val().length == 3) {
            //        $(this).val($(this).val() + "-");
            //    }
            //});

            $('input[name=IDRetained]').click(function () {
                OnIDRetainedSelection(this);
            });


            //$('input[name=AWBNo]').unbind("keypress").bind("keypress", function () {
            //    return isNaN($('#AWBNo').val()) ? false : true;
            //});

            $("input[name=AWBNo]").keypress(function (evt) {

                var theEvent = evt || window.event;
                var key = theEvent.keyCode || theEvent.which;
                key = String.fromCharCode(key);
                var regex = /^[0-9]{0,9}$/;    // allow only numbers [0-9] 
                if (!regex.test(key)) {
                    theEvent.returnValue = false;
                    if (theEvent.preventDefault) theEvent.preventDefault();
                }

            });
            $("input[name=BOENo]").keypress(function (evt) {

                var theEvent = evt || window.event;
                var key = theEvent.keyCode || theEvent.which;
                key = String.fromCharCode(key);
                var regex = /^[0-9]{0,9}$/;    // allow only numbers [0-9] 
                if (!regex.test(key)) {
                    theEvent.returnValue = false;
                    if (theEvent.preventDefault) theEvent.preventDefault();
                }

            });

            if (userContext.GroupName.toUpperCase() == "AGENT") {
                $("#Text_CustomerType").data("kendoAutoComplete").setDefaultValue(1, "REGULAR");
                $("#CustomerType").val(1);
                $("#Text_CustomerType").data("kendoAutoComplete").enable(false);
                $("#AccountSNo").val(userContext.AgentSNo);
                $("#Text_AccountSNo").data("kendoAutoComplete").setDefaultValue(userContext.AgentSNo, userContext.AgentName);
                $("#Text_AccountSNo").data("kendoAutoComplete").enable(false);
                $("input:checkbox[name=isBup]").attr("enabled", false);
                $("input:checkbox[name=isBup]").attr("disabled", true);
                $("#Shipper_Agent").val(userContext.AgentName);
            }
            $("#DeclaredCarriagevalue").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });
            $("#DeclaredCustomValue").unbind("keypress").bind("keypress", function () {
                ISNumeric(this);
            });
            //$("#IDRetained").unbind("click").bind("click", function () {
            //    OnIDRetainedSelection(this);
            //});
            funValidateDeclare();

            if ($("#HAWBNo").val() != "") {
                $('#spn').parent().find('font').text('*');
                $('#AWBNo').attr("data-valid", "minlength[8],required");
                SetAWBPrefixCode('Text_AirlineSNo');

            }
            else {
                $('#spn').parent().find('font').text('   ');
                $('#AWBNo').removeAttr("data-valid");
                $('#spn').css("padding-left", "10px");
            }
            $('#spnBOENo').css("padding-left", "11px");

            funRuleForHAWB();
            fun_BindAWBPrefix();
            // RH 051015 ends 

            $("a[id^='ahref_ClassDetails']").unbind("click").bind("click", function () {
                GetTempDetails(this);
            });


            $("input[name=Shipper_Agent]").keypress(function (evt) {
                var theEvent = evt || window.event;
                var key = theEvent.keyCode || theEvent.which;
                key = String.fromCharCode(key);
                var regex = /^[a-zA-Z0-9_]*$/;    // allow only alfa & numbers
                if (!regex.test(key)) {
                    theEvent.returnValue = false;
                    if (theEvent.preventDefault) theEvent.preventDefault();
                }

            });


            $("#__divsliawb__").keydown(function (event) {
                if (event.ctrlKey == true && (event.which == '118' || event.which == '86')) {
                    event.preventDefault();
                }
            });

            $("#__divsliawb__").keydown(function (event) {
                if (event.keyCode == 13) {
                    return false;
                }
            });
            $('#AWBNo').on("contextmenu", function (e) {
                //alert('Right click disabled');
                return false;
            });
            $('#AWBPrefix').on("contextmenu", function (e) {
                //alert('Right click disabled');
                return false;
            });
            $("#__divsliawb__").on('drop', function () {
                return false;
            });

            if ($("#SPHCCode").val() == "") {
                $("#ahref_ClassDetails").css("display", "none");
            }
            DisabledAWBNo();
            //Append by Maneesh on dated= 10-2-17 purpose= OnBlur AWB HAWB NO
            if (Data.Table8[0].Status == "RCS") {
                if (Data.Table8[0].IsEnabled == 1) {
                    if (resItem.HAWBNo != "") {
                        $('#HAWBNo').removeAttr("disabled");
                    } else {
                        $('#HAWBCount').removeAttr("disabled");
                    }

                }
                else {
                    $('#HAWBNo').attr("disabled", true);
                    $('#HAWBCount').attr("disabled", true);
                }
            }
            else {
                $('#HAWBNo').removeAttr("disabled");
                $('#HAWBCount').removeAttr("disabled");
            }
            //********
        },
        error: {

        }
    });
    if (BOEDate != "") {
        $("#BOEDate").data("kendoDatePicker").value(BOEDate);
    }
    else {
        $("#BOEDate").data("kendoDatePicker").value("");
        $("#BOEDate").val("");
    }
}
function fixDisabled() {
    if (userContext.SpecialRights.SLIA == true && GSLISinglePart != 1) {
        if (SLIPartAfterFinal > 0) {
            $('#divDetail input,#divDetail select').attr('disabled', 1);
            $('#divDetail input[controltype="autocomplete"]').each(function () {
                $("#" + $(this).attr("name")).data("kendoAutoComplete").enable(false);
            });

            $("input:checkbox[name=isBup]").attr("enabled", true);
            $("input:checkbox[name=isBup]").attr("disabled", false);

            $(".k-button").attr("disabled", true);

            //$("#Text_SPHCCode").data("kendoAutoComplete").enable(true);
        }
        $('#btnSave').show();
        if (RCSCount == 0) {
            $("#CustomerType").attr("disabled", false);
            $("#Text_CustomerType").data("kendoAutoComplete").enable(true);
            $("#AirlineSNo").attr("disabled", false);
            $("#Text_AirlineSNo").data("kendoAutoComplete").enable(true);
            $("#AccountSNo").attr("enabled", true);
            $("#Text_AccountSNo").data("kendoAutoComplete").enable(true);
            $("#DestinationAirportSNo").attr("enabled", true);
            $("#Text_DestinationAirportSNo").data("kendoAutoComplete").enable(true);
            $("#CurrencySNo").attr("enabled", true);
            $("#Text_CurrencySNo").data("kendoAutoComplete").enable(true);
            $("input:checkbox[name=isCSD]").attr("enabled", false);
            $("input:checkbox[name=isCSD]").attr("disabled", true);
            $("input:checkbox[name=agentBup]").attr("enabled", false);
            $("input:checkbox[name=agentBup]").attr("disabled", true);
        }
        if (SLIPartAfterFinal == 2) {
            $("#Text_SPHCCode").data("kendoAutoComplete").enable(true);
            $("input:checkbox[name=isBup]").attr("enabled", true);
            $("input:checkbox[name=isBup]").attr("disabled", false);
        }
        if (SLIPartAfterFinal > 2 && $("#SLINo").val().length == 8) {
            $("input:checkbox[name=isBup]").attr("enabled", false);
            $("input:checkbox[name=isBup]").attr("disabled", true);
        }
        if (RCSCount > 0) {
            $('#AWBPrefix').attr("disabled", true);
            $("#AWBNo").attr("Disabled", true);
            $('#AWBPrefix').attr("enabled", false);
            $("#AWBNo").attr("enabled", false);

        }
        $("input:checkbox[name=agentBup]").attr("enabled", false);
        $("input:checkbox[name=agentBup]").attr("disabled", true);
    }
    if (userContext.GroupName.toUpperCase() == "AGENT") {
        if (GSLISinglePart != 1) {
            if (SLIPartAfterFinal > 0) {
                $('#divDetail input,#divDetail select').attr('disabled', 1);
                $('#divDetail input[controltype="autocomplete"]').each(function () {
                    $("#" + $(this).attr("name")).data("kendoAutoComplete").enable(false);
                });

                $("input:checkbox[name=isBup]").attr("enabled", true);
                $("input:checkbox[name=isBup]").attr("disabled", false);
                $(".k-button").attr("disabled", true);

                //$("#Text_SPHCCode").data("kendoAutoComplete").enable(true);
            }
            $('#btnSave').show();
            if (RCSCount == 0) {
                $("#CustomerType").attr("disabled", false);
                $("#Text_CustomerType").data("kendoAutoComplete").enable(true);
                $("#AirlineSNo").attr("disabled", false);
                $("#Text_AirlineSNo").data("kendoAutoComplete").enable(true);
                $("#AccountSNo").attr("enabled", true);
                $("#Text_AccountSNo").data("kendoAutoComplete").enable(true);
                $("#DestinationAirportSNo").attr("enabled", true);
                $("#Text_DestinationAirportSNo").data("kendoAutoComplete").enable(true);
                $("#CurrencySNo").attr("enabled", true);
                $("#Text_CurrencySNo").data("kendoAutoComplete").enable(true);
                $("input:checkbox[name=isCSD]").attr("enabled", false);
                $("input:checkbox[name=isCSD]").attr("disabled", true);
                $("input:checkbox[name=agentBup]").attr("enabled", false);
                $("input:checkbox[name=agentBup]").attr("disabled", true);
            }
            if (SLIPartAfterFinal == 2) {
                $("#Text_SPHCCode").data("kendoAutoComplete").enable(true);
                $("input:checkbox[name=isBup]").attr("enabled", true);
                $("input:checkbox[name=isBup]").attr("disabled", false);
            }
            if (SLIPartAfterFinal > 2 && $("#SLINo").val().length == 8) {
                $("input:checkbox[name=isBup]").attr("enabled", false);
                $("input:checkbox[name=isBup]").attr("disabled", true);
            }
            if (RCSCount > 0) {
                $('#AWBPrefix').attr("disabled", true);
                $("#AWBNo").attr("Disabled", true);
                $('#AWBPrefix').attr("enabled", false);
                $("#AWBNo").attr("enabled", false);

            }

        }
        $("input:checkbox[name=agentBup]").attr("enabled", false);
        $("input:checkbox[name=agentBup]").attr("disabled", true);
        $("#Text_CustomerType").data("kendoAutoComplete").setDefaultValue(1, "REGULAR");
        $("#CustomerType").val(1);
        $("#Text_CustomerType").data("kendoAutoComplete").enable(false);
        $("#AccountSNo").val(userContext.AgentSNo);
        $("#Text_AccountSNo").data("kendoAutoComplete").setDefaultValue(userContext.AgentSNo, userContext.AgentName);
        $("#Text_AccountSNo").data("kendoAutoComplete").enable(false);
        $("input:checkbox[name=isBup]").attr("enabled", false);
        $("input:checkbox[name=isBup]").attr("disabled", true);
        $("#Shipper_Agent").val(userContext.AgentName);
    }
}

//function fixDisabled() {
//    if (userContext.SpecialRights.SLIA == true && GSLISinglePart != 1) {
//        if (SLIPartAfterFinal > 0) {
//            $('#divDetail input,#divDetail select').attr('disabled', 1);
//            $('#divDetail input[controltype="autocomplete"]').each(function () {
//                $("#" + $(this).attr("name")).data("kendoAutoComplete").enable(false);
//            });

//            $("input:checkbox[name=isBup]").attr("enabled", true);
//            $("input:checkbox[name=isBup]").attr("disabled", false);
//            $(".k-button").attr("disabled", true);

//            //$("#Text_SPHCCode").data("kendoAutoComplete").enable(true);
//        }
//        $('#btnSave').show();
//        if (RCSCount == 0) {
//            $("#CustomerType").attr("disabled", false);
//            $("#Text_CustomerType").data("kendoAutoComplete").enable(true);
//            $("#AirlineSNo").attr("disabled", false);
//            $("#Text_AirlineSNo").data("kendoAutoComplete").enable(true);
//            $("#AccountSNo").attr("enabled", true);
//            $("#Text_AccountSNo").data("kendoAutoComplete").enable(true);
//            $("#DestinationAirportSNo").attr("enabled", true);
//            $("#Text_DestinationAirportSNo").data("kendoAutoComplete").enable(true);
//            $("#CurrencySNo").attr("enabled", true);
//            $("#Text_CurrencySNo").data("kendoAutoComplete").enable(true);
//            $("input:checkbox[name=isCSD]").attr("enabled", false);
//            $("input:checkbox[name=isCSD]").attr("disabled", true);
//        }
//        if (SLIPartAfterFinal == 2) {
//            $("#Text_SPHCCode").data("kendoAutoComplete").enable(true);
//            $("input:checkbox[name=isBup]").attr("enabled", true);
//            $("input:checkbox[name=isBup]").attr("disabled", false);
//        }
//        if (SLIPartAfterFinal > 2 && $("#SLINo").val().length == 8) {
//            $("input:checkbox[name=isBup]").attr("enabled", false);
//            $("input:checkbox[name=isBup]").attr("disabled", true);
//        }
//        if (RCSCount > 0) {
//            $('#AWBPrefix').attr("disabled", true);
//            $("#AWBNo").attr("Disabled", true);
//            $('#AWBPrefix').attr("enabled", false);
//            $("#AWBNo").attr("enabled", false);

//        }
//        //}
//    }
//    if (RCSCount > 0) {
//        $('#AWBPrefix').attr("disabled", true);
//        $("#AWBNo").attr("Disabled", true);
//        $('#AWBPrefix').attr("enabled", false);
//        $("#AWBNo").attr("enabled", false);
//    }
//    //if (userContext.SpecialRights.SLIA == true) {
//    //    $('#divDetail input,#divDetail select').attr('disabled', 1);
//    //    $('#divDetail input[controltype="autocomplete"]').each(function () {
//    //        $("#" + $(this).attr("name")).data("kendoAutoComplete").enable(false);
//    //        $("input:checkbox[name=isBup]").attr("enabled", true);
//    //        $("input:checkbox[name=isBup]").attr("disabled", false);
//    //        $("#Text_SPHCCode").data("kendoAutoComplete").enable(true);

//    //    })
//    //    $('#btnSave').show();
//    //    $("#CustomerType").attr("disabled", false);
//    //    $("#Text_CustomerType").data("kendoAutoComplete").enable(true);
//    //    $("#AirlineSNo").attr("disabled", false);
//    //    $("#Text_AirlineSNo").data("kendoAutoComplete").enable(true);
//    //    $("#AccountSNo").attr("enabled", true);
//    //    $("#Text_AccountSNo").data("kendoAutoComplete").enable(true);
//    //    $("#DestinationAirportSNo").attr("enabled", true);
//    //    $("#Text_DestinationAirportSNo").data("kendoAutoComplete").enable(true);
//    //    $("#CurrencySNo").attr("enabled", true);
//    //    $("#Text_CurrencySNo").data("kendoAutoComplete").enable(true);
//    //    $("input[type=checkbox]").attr("enabled", false);
//    //    $("input:checkbox[name=isCSD]").attr("enabled", false);
//    //    $("input:checkbox[name=isCSD]").attr("disabled", true);
//    //    //}
//    //}
//}

function CheckBOENoexist(input) {
    //debugger;
    var BOENo = $(input).val();
    if (BOENo != "") {
        if ($("#BookingType").val() != "") {
            if ($("#BookingType").val() != "1") {
                $.ajax({
                    url: "Services/Shipment/SLInfoService.svc/CheckBOENoExist", async: false, type: "get", dataType: "json", cache: false,
                    data: { BOENo: BOENo.toString(), SLISNo: currentslisno, SLINo: $("#SLINo").val() },
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        var Newres = JSON.parse(result);
                        var IsBoe = Newres.Table0;
                        if (parseInt(IsBoe[0].isExistsBOE) > 0) {
                            ShowMessage('warning', 'Warning - BOE', "BOE Number already utilized.", "bottom-right");
                            $("#BOENo").val("");
                            $("#isBOEVerified").prop('checked', false);
                            $("#isBOEVerified").prop('disabled', false);

                            $("#BOEDate").data("kendoDatePicker").enable(true);
                        }
                        else {

                            $.ajax({
                                url: "Services/Shipment/AcceptanceService.svc/BOEVerification", async: false, type: "get", dataType: "json", cache: false,
                                data: { q: BOENo.toString(), u: userContext.UserSNo.toString() },
                                contentType: "application/json; charset=utf-8",
                                success: function (result) {
                                    //var DEC_Date = jQuery.parseJSON(result);
                                    // alert(result);
                                    if (result != null) {
                                        //ShowMessage('warning', 'Warning - BOE', "BOE Number verified.", "bottom-right");
                                        $("#isBOEVerified").prop('checked', true);
                                        $("#isBOEVerified").prop('disabled', true);
                                        $("#BOEDate").data("kendoDatePicker").enable(false);
                                        $("#BOEDate").data("kendoDatePicker").value(new Date(result));
                                    }
                                    else {
                                        //  if (parseInt(IsBoe[0].isExistsBOE) == 0) {                                     

                                        if ($("#BOENo").attr("enabled") == "0" || $("#BOENo").attr("enabled") == undefined) {
                                            ShowMessage('warning', 'Warning - BOE', "BOE Number not verified.", "bottom-right");
                                            $("#isBOEVerified").prop('checked', false);
                                            $("#isBOEVerified").prop('disabled', true);
                                            $("#BOEDate").data("kendoDatePicker").enable(true);
                                            if ($("#BOENo").val() != "" && $("#BOEDate").val() != "") {
                                                $("#BOEDate").data("kendoDatePicker").enable(false);
                                            }
                                        }
                                        //}
                                        // $("#BOENo").val(""); 
                                    }


                                }
                            });

                        }
                    }

                });
            }
        }
        else {
            if ($("#BookingType").val() == "") {
                ShowMessage('warning', 'Warning - BOE', "Kindly select Booking Type.", "bottom-right");
            }
        }
    }
    else {
        if (BOENo == "") {
            $("#isBOEVerified").prop('checked', false);
            $("#isBOEVerified").prop('disabled', true);
            $("#isBOEVerified").prop('enabled', false);
            $("#BOEDate").data("kendoDatePicker").enable(true);
        }

    }


}
function fn_RemovePharma(e, input) {
    var sphcCodeSNo = "";
    var Currenttr = $(input).closest("tr");
    Currenttr.find("input[id^='StartTemperature']").val("");
    Currenttr.find("input[id^='EndTemperature']").val("");
    Currenttr.find("input[id^='Pieces']").val("");
    Currenttr.find("input[id^='_tempStartTemperature']").val("");
    Currenttr.find("input[id^='_tempEndTemperature']").val("");
    Currenttr.find("input[id^='_tempPieces']").val("");
    if (Currenttr.find("input[recname=TDSPHCCode]").attr("recname") == "TDSPHCCode") {
        isrequired = 1;
        sphcCodeSNo = Currenttr.find("input[id^='Multi_TDSPHCCode']").val();
        if (sphcCodeSNo == undefined) {
            sphcCodeSNo = "";
        }
        if (sphcCodeSNo != "") {
            sphcCodeSNo = sphcCodeSNo + "," + Currenttr.find("input[id^='TDSPHCCode']").val();
        }
        if (sphcCodeSNo == "")
            sphcCodeSNo = Currenttr.find("input[id^='TDSPHCCode']").val();
    }
    $.ajax({
        url: "Services/Shipment/SLInfoService.svc/GetSLITemperature?sphcCodeSNo=" + sphcCodeSNo, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.Table0;
            var TDPharmaCounttbl = Data.Table1;
            var validate = "False";
            for (var i = 0; i < resData.length;) {
                if (resData[i].IsTemperatureControlled == "True") {
                    validate = "True";
                    TDPharmaCount = TDPharmaCounttbl[0].SPHCPharmaCount;
                }
                i++;
            }
            if (validate == "True") {
                Currenttr.attr("Pharma", TDPharmaCount);
            }
            else {
                Currenttr.attr("Pharma", TDPharmaCount);
            }
        }
    });





    //fn_CheckRange("#" + Currenttr.find("input[id^='StartTemperature']").attr("id"));
    //fn_CheckRangeEnd("#" + Currenttr.find("input[id^='EndTemperature']").attr("id"));

}


var TDPharmaCount = 0;
function SETPharma(input) {
    var id = $("#" + input);
    var sphcCodeSNo = "";
    //for (var i = 0; i < ArrCheckITc.length; i++) {
    //}
    var Currenttr = $("#" + input).closest("tr");
    //Currenttr.find("span.k-delete").live("click", function (e) { fn_RemovePharma(e, id) });
    Currenttr.find("input[id^='StartTemperature']").val("");
    Currenttr.find("input[id^='EndTemperature']").val("");
    Currenttr.find("input[id^='Pieces']").val("");
    Currenttr.find("input[id^='_tempStartTemperature']").val("");
    Currenttr.find("input[id^='_tempEndTemperature']").val("");
    Currenttr.find("input[id^='_tempPieces']").val("");

    if (Currenttr.find("input[recname=TDSPHCCode]").attr("recname") == "TDSPHCCode") {
        isrequired = 1;
        sphcCodeSNo = Currenttr.find("input[id^='Multi_TDSPHCCode']").val();
        if (sphcCodeSNo == undefined) {
            sphcCodeSNo = "";
        }
        if (sphcCodeSNo != "") {
            sphcCodeSNo = sphcCodeSNo + "," + Currenttr.find("input[id^='TDSPHCCode']").val();
        }
        if (sphcCodeSNo == "")
            sphcCodeSNo = Currenttr.find("input[id^='TDSPHCCode']").val();
    }
    $.ajax({
        url: "Services/Shipment/SLInfoService.svc/GetSLITemperature?sphcCodeSNo=" + sphcCodeSNo, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.Table0;
            var TDPharmaCounttbl = Data.Table1;
            var validate = "False";
            for (var i = 0; i < resData.length;) {
                if (resData[i].IsTemperatureControlled == "True") {
                    validate = "True";
                    TDPharmaCount = TDPharmaCounttbl[0].SPHCPharmaCount;
                }
                i++;
            }
            if (validate == "True") {
                Currenttr.attr("Pharma", TDPharmaCount);

            }
            else {
                Currenttr.attr("Pharma", TDPharmaCount);

            }

        }
    });

}


function GetTareWt(input) {
    var CurrentTr; var Count = 0;
    if ($(input).attr("recname") == "Count") {
        CurrentTr = $(input).closest("tr");
        Count = $(input).val();
    }
    else {
        CurrentTr = $("#" + input).closest("tr");
        Count = 1;
    }

    var EqType = CurrentTr.find("input[id^=Text_EqType]").val();
    var Eq = CurrentTr.find("input[id^= Text_Equipment]").val();

    if (EqType != "" && Eq != "") {
        $.ajax({
            url: "Services/Shipment/SLInfoService.svc/GetSLICosumableTareWeight?EqType=" + EqType + "&Eq=" + Eq + "&Count=" + Count, async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var tareWeight = jQuery.parseJSON(result);
                CurrentTr.find("input[id^='TareWt']").val(tareWeight.Table0[0].TareWeight);
                CurrentTr.find("span[id^='TareWt']").text(tareWeight.Table0[0].TareWeight);
                CurrentTr.find("input[id^=Text_EqNo]").val("");
                CurrentTr.find("input[id^=EqNo]").val("");
            }
        });

    }
    // }


    // alert(CurrentTr);


}
function onselectConsumable(input) {
    CurrentTr = $("#" + input).closest("tr");
    var EqType = CurrentTr.find("input[id^=Text_EqType]").val();
    if (EqType == "CONSUMABLE") {

        CurrentTr.find("input[id^=Equipment]").val("");
        CurrentTr.find("input[id^=Text_Equipment]").val("");
        CurrentTr.find("input[id^=Text_EqNo]").data("kendoAutoComplete").enable(false);
        CurrentTr.find("input[id^=Text_EqNo]").val("");
        CurrentTr.find("input[id^=EqNo]").val("");
        CurrentTr.find("input[id^='Count']").val("1");
        // CurrentTr.find("input[id^=Text_EqNo]").removeAttr("data-valid", "required");
        CurrentTr.find("input[id^='Count']").attr("disabled", false);
        CurrentTr.find("input[id^='Count']").attr("data-valid", "min[1],required");
        CurrentTr.find("input[id^=TareWt]").val("");
        CurrentTr.find("span[id^=TareWt]").text("");

    }
    else {
        if (EqType == "EQUIPMENT") {
            CurrentTr.find("input[id^=Equipment]").val("");
            CurrentTr.find("input[id^=Text_Equipment]").val("");
            CurrentTr.find("input[id^=Text_EqNo]").data("kendoAutoComplete").enable(true);
            // CurrentTr.find("input[id^=Text_EqNo]").attr("data-valid", "required");
            CurrentTr.find("input[id^=Text_EqNo]").val("");
            CurrentTr.find("input[id^=EqNo]").val("");
            CurrentTr.find("input[id^='Count']").val("1");
            CurrentTr.find("input[id^='Count']").attr("disabled", true);
            CurrentTr.find("input[id^='Count']").removeAttr("data-valid");
            CurrentTr.find("input[id^=TareWt]").val("");
            CurrentTr.find("span[id^=TareWt]").text("");
        }
    }
    //if(CurrentTr.find)
    // alert(CurrentTr);


}
function SetEqTareWt(valueId, value, keyId, key) {
    //debugger;
    CurrentTr = $("#" + valueId).closest("tr");

    CurrentTr.find("input[id^='Count']").val("1");
    CurrentTr.find("input[id^='Count']").attr("disabled", true);

    var ConsumableName = CurrentTr.find("input[id^='Text_EqNo']").val();
    $.ajax({

        url: "Services/Shipment/SLInfoService.svc/GetSLIEquipmentTareWt?ConsumableName=" + ConsumableName, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {

            var tareWeight = jQuery.parseJSON(result);
            if (tareWeight.Table0 != "") {
                CurrentTr.find("input[id^='TareWt']").val(tareWeight.Table0[0].TareWeight);
                CurrentTr.find("span[id^='TareWt']").text(tareWeight.Table0[0].TareWeight);
            }
        }
    });
    $("div[id$='divareaTrans_sli_sliinventory']").find("[id^='areaTrans_sli_sliinventory']").each(function () {
        if ($(this).find("input[id^='Text_EqNo']").attr("id") != valueId) {
            if ($(this).find("input[id^='Text_EqNo']").data("kendoAutoComplete").key() == key) {
                ShowMessage('warning', 'Information!', "" + value + " Already Added.", "bottom-right");
                $("#" + valueId).data("kendoAutoComplete").setDefaultValue("", "");
            }
        }
    });
    // alert($(input));
}

function BindequipmentAutoComplete(elem, mainElem) {
    var type = [{ Key: "1", Text: "CONSUMABLE" }, { Key: "0", Text: "EQUIPMENT" }];
    cfi.AutoCompleteByDataSource($(elem).find("input[id^='EqType']").attr("id"), type, onselectConsumable, null);
    $(elem).find("input[id^='Equipment']").each(function () {
        if (!$("#Text_" + $(this).attr("name")).data("kendoAutoComplete")) {
            cfi.AutoComplete($(this).attr("name"), "SNo,ItemName", "vwSLIGetEquipment", "SNo", "ItemName", ["ItemName"], GetTareWt, "contains", null, null, null, null, null, true);
        }
    });
    $(elem).find("input[id^='EqNo']").each(function () {
        if (!$("#Text_" + $(this).attr("name")).data("kendoAutoComplete")) {
            cfi.AutoComplete($(this).attr("name"), "ConsumablesName", "vwSLIequpmentsnos", "SNo", "ConsumablesName", ["ConsumablesName"], SetEqTareWt, "contains", null, null, null, null, null, true);
        }
    });
    $(elem).find("input[id^='ESLINo']").val($(elem).prev().find("input[id^=ESLINo]").val());
    $(elem).find("input[id^='LooseSNo']").val($(elem).prev().find("input[id^=LooseSNo]").val());
    if (ULDNo != "") {
        $(elem).find("input[id^='EULDNo']").val($(elem).prev().find("input[id^=EULDNo]").val());
    }
    CheckNumeric($(elem).find("input[id^='Count']").attr("id"));
}
function ReBindequipmentAutoComplete(elem, mainElem) {
    $("div[id$='divareaTrans_sli_sliinventory']").find("[id^='areaTrans_sli_sliinventory']").each(function () {
        $(this).find("input[id^='Equipment']").each(function () {
            //  if (!$("#Text_" + $(this).attr("name")).data("kendoAutoComplete")) {
            cfi.AutoComplete($(this).attr("name"), "SNo,ItemName", "vwSLIGetEquipment", "SNo", "ItemName", ["ItemName"], GetTareWt, "contains", null, null, null, null, null, true);
            // }          
        });
        $(this).find("span[class^='k-dropdown-wrap']").removeAttr("style");
        $(this).find("input[id^='EqNo']").each(function () {
            //   if (!$("#Text_" + $(this).attr("name")).data("kendoAutoComplete")) {
            cfi.AutoComplete($(this).attr("name"), "ConsumablesName", "vwSLIequpmentsnos", "SNo", "ConsumablesName", ["ConsumablesName"], SetEqTareWt, "contains", null, null, null, null, null, true);
            // }
        });
        $(this).find("span[class^='k-dropdown-wrap']").removeAttr("style");
        $(this).find("input[id^='ESLINo']").val($(elem).prev().find("input[id^=ESLINo]").val());
        $(this).find("input[id^='LooseSNo']").val($(elem).prev().find("input[id^=LooseSNo]").val());
        if (ULDNo != "") {
            $(this).find("input[id^='EULDNo']").val($(elem).prev().find("input[id^=EULDNo]").val());
        }
        CheckNumeric($(this).find("input[id^='Count']").attr("id"));
    });
}



var AirlineSNo = 0;
function Getequipment(input) {
    _CURR_PRO_ = "SLIBOOKING";
    _CURR_OP_ = "SLI";
    var TareWT = 0.0;
    CurrentTr = $(input).closest("tr");
    var SLINo = CurrentTr.find("input[id^='SLINo']").val();
    var ULDNo = CurrentTr.find("input[id^='Text_ULDTypeSNo']").val() + "" + CurrentTr.find("input[id^='ULDNo']").val() + "" + CurrentTr.find("input[id^='OwnerCode']").val() ||
        "";
    var LooseSNo = CurrentTr.find("input[id^='SNo']").val() == 0 ? CurrentTr.find("td[id^='tdSNoCol']").text() : CurrentTr.find("input[id^='SNo']").val();
    //tdSNoCol
    var CapturedWeight = CurrentTr.find("input[id^='CapturedWeight']").val() || CurrentTr.find("input[id^='UCapturedWeight']").val();
    if (CapturedWeight == undefined) {
        CapturedWeight = "";
    }
    if (ULDNo == "undefinedundefinedundefined") {
        ULDNo = "";
    }
    if (CapturedWeight != "") {
        $.ajax({
            url: "Services/Shipment/SLInfoService.svc/GetWebForm/" + _CURR_PRO_ + "/SLI/SLIEquipments/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#divEqDetails").html('').html(result);
                $("#divEqDetails").append("<div id=divfootereq align=center></div>");
                $("#divfootereq").html(popupfotter).show();
                $("#btnCancel").unbind("click").bind("click", function () {
                    ResetEquipmentDetailsforPOPUp();
                });
                $("#btnSave").unbind("click").bind("click", function () {
                    //alert('Test');
                    SaveFormData("SLIEquipments");
                });
                $.ajax({

                    url: "Services/Shipment/SLInfoService.svc/GetequipmentDetails?SLISNo=" + currentslisno + "&SLINo=" + SLINo + "&ULDNo=" + ULDNo + "&LooseSNo=" + LooseSNo, async: false, type: "get", dataType: "json", cache: false,
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        var slieqdata = jQuery.parseJSON(result);
                        var List_slieqdata = slieqdata.Table0;
                        var Airline = slieqdata.Table1;
                        AirlineSNo = Airline[0].AirlineSNo;
                        $("#divEqDetails").find("div[id$=divareaTrans_sli_sliinventory]").removeAttr("style");

                        var slieqdataarr = [];
                        if (List_slieqdata != []) {
                            $(List_slieqdata).each(function (row, i) {
                                slieqdataarr.push({ "eqtype": i.eqtype, "text_eqtype": i.text_eqtype, "equipment": i.equipment, "text_equipment": i.text_equipment, "eqno": i.eqno, "text_eqno": i.text_eqno, "count": i.count, "tarewt": i.tarewt, "eslino": i.eslino, "euldno": i.euldno, "loosesno": i.loosesno });
                            });
                        }
                        cfi.makeTrans("sli_sliinventory", null, null, BindequipmentAutoComplete, ReBindequipmentAutoComplete, null, slieqdataarr, null, false);

                        //if (ULDNo == "") {
                        //    CurrentTr.find("input[id^='_tempTareWeight']").val(TareWT);
                        //    CurrentTr.find("input[id^='TareWeight']").val(TareWT);
                        //    CalculateVolume();
                        //}
                        //else {
                        //    var ULDTareWT = 0.0;
                        //    if (uldLWH.length > 0) {
                        //        for (var i = 0; i < uldLWH.length; i++) {
                        //            if (uldLWH[i].ULDNo == ULDNo) {

                        //                ULDTareWT = parseFloat(uldLWH[i].TareWeight);
                        //            }
                        //        }
                        //    }
                        //    if (!isNaN(TareWT)) {
                        //        CurrentTr.find("input[id^='_tempUTareWeight']").val(ULDTareWT + TareWT);
                        //        CurrentTr.find("input[id^='UTareWeight']").val(ULDTareWT + TareWT);
                        //        CalculateULDVolume();
                        //    }
                        //}
                        $("#divEqDetails").find("div[id=divareaTrans_sli_sliinventory]").each(function (e) {
                            //if ($(this).find("input[id^='EqNo']").val() != "") {
                            //    $(this).find("input[id^='Count']").attr("disabled", true);
                            //}class="transSection k-input"

                            $(this).find("input[id^='Count']").removeAttr("class");
                            $(this).find("input[id^='Count']").attr("class", "transSection k-input");
                            CheckNumeric($(this).find("input[id^='Count']").attr("id"));
                            $(this).find("input[id^='ESLINo']").val(SLINo);
                            $(this).find("input[id^='LooseSNo']").val(LooseSNo);
                            if (ULDNo != "undefinedundefinedundefined") {
                                $(this).find("input[id^='EULDNo']").val(ULDNo);
                            }
                            var type = [{ Key: "1", Text: "CONSUMABLE" }, { Key: "0", Text: "EQUIPMENT" }];
                            cfi.AutoCompleteByDataSource($(this).find("input[id^='EqType']").attr("id"), type, onselectConsumable, null);
                            $(this).find("input[id^='Equipment']").each(function () {
                                if (!$("#Text_" + $(this).attr("name")).data("kendoAutoComplete")) {
                                    cfi.AutoComplete($(this).attr("name"), "SNo,ItemName", "vwSLIGetEquipment", "SNo", "ItemName", ["ItemName"], GetTareWt, "contains", null, null, null, null, null, true);
                                }
                            });
                            $(this).find("input[id^='EqNo']").each(function () {
                                if (!$("#Text_" + $(this).attr("name")).data("kendoAutoComplete")) {
                                    cfi.AutoComplete($(this).attr("name"), "ConsumablesName", "vwSLIequpmentsnos", "SNo", "ConsumablesName", ["ConsumablesName"], SetEqTareWt, "contains", null, null, null, null, null, true);
                                }
                            });


                        });


                        cfi.PopUp("divEqDetails", "SLI Equipments", 700, PopUpOnOpen, null, 60);
                        $("#divEqDetails").find("div[id=divareaTrans_sli_sliinventory]").find("tr[id^=areaTrans_sli_sliinventory]").each(function (e) {
                            //onselectConsumable($(this).attr("id"));

                            var EqType = $(this).find("input[id^=Text_EqType]").val();
                            if (EqType == "CONSUMABLE") {
                                $(this).find("input[id^=Text_EqNo]").data("kendoAutoComplete").enable(false);
                            }
                            else {
                                if (EqType == "EQUIPMENT") {
                                    $(this).find("input[id^=Text_EqNo]").data("kendoAutoComplete").enable(true);
                                    $(this).find("input[id^='Count']").attr("disabled", true);
                                }
                            }


                            TareWT = TareWT + parseFloat($(this).find("input[id^=TareWt]").val());
                        });
                    }
                });



            }
        });
    }
    else {
        if (CapturedWeight == "") {
            ShowMessage('warning', 'Warning - EQUIPMENT', "Kindly provide Captured Gross Weight details to proceed with addition of Equipment.", "bottom-right");
        }

    }
}
function CheckNumericforSHC(ctrlID) {
    $("input[id=" + ctrlID + "]").keypress(function (evt) {
        var theEvent = evt || window.event;
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
        var regex = /^[0-9-]+$/;///^[0-9]{0,9}$/;    // allow only numbers [0-9]
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }

    });
}
function CheckNumeric(ctrlID) {
    $("input[id=" + ctrlID + "]").keypress(function (evt) {
        var theEvent = evt || window.event;
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
        var regex = /^[0-9]{0,9}$/;    // allow only numbers [0-9] 
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }

    });
}

function GetTempDetails(input) {
    _CURR_PRO_ = "SLIBOOKING";
    _CURR_OP_ = "SLI";

    // GetTempreatureHideAndShow();
    if ($("#ahref_ClassDetails").attr("style") != "display: none;") {
        if (SHCTempDetails.length == 0) {
            $.ajax({
                url: "Services/Shipment/SLInfoService.svc/GetWebForm/" + _CURR_PRO_ + "/SLI/TempDetails/New/1", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                success: function (result) {
                    $("#divTempDetails").html('').html(result);
                    $("#divTempDetails").append("<div id=divfooter align=center></div>");
                    $("#divfooter").html(PopupFooterForTemp).show();
                    // BindTempDetailsAutoComplete("#areaTrans_sli_slishctemp");

                    $("#divTempDetails").css("display", "block");
                    $("#btnCancel").unbind("click").bind("click", function () {
                        ResetTempDetailsforPOPUp();
                    });

                    $("#btnAdd").unbind("click").bind("click", function () {
                        //alert('Test');
                        SaveFormData("TempDetails");
                    });

                    $.ajax({

                        url: "Services/Shipment/SLInfoService.svc/GetSLISHCTempDetails?SLISNo=" + currentslisno + "&SLINo=" +
    ($("#SLINo").val() || $("#SLINo").html()), async: false, type: "get", dataType: "json", cache: false,
                        contentType: "application/json; charset=utf-8",
                        success: function (result) {
                            var TempData = jQuery.parseJSON(result);
                            var listArraysli_slishctemp = TempData.Table0;
                            var slitemp = [];
                            if (listArraysli_slishctemp != []) {
                                $(listArraysli_slishctemp).each(function (row, i) {
                                    slitemp.push({ "tdsphccode": i.tdsphccode, "text_tdsphccode": i.text_tdsphccode, "starttemperature": i.starttemp, "_tempstarttemperature": i.starttemp, "endtemperature": i.endtemp, "_tempendtemperature": i.endtemp, "pieces": i.piece });
                                });
                            }
                            GetTempreatureHideAndShow();
                            cfi.makeTrans("sli_slishctemp", null, null, BindTempDetailsAutoComplete, ReBindTempDetailsAutoComplete, null, slitemp);

                            cfi.PopUp("divTempDetails", "Temp Details", 600, PopUpOnOpen, null, 60);

                            //$("#StartTemperature").attr("data-role", "numerictextbox");
                            //$("#EndTemperature").attr("data-role", "numerictextbox");
                            //$("#Pieces").attr("data-role", "numerictextbox");

                            $("div[id$='divareaTrans_sli_slishctemp']").find("[id='areaTrans_sli_slishctemp']").each(function () {
                                $(this).find("input[id^='TDSPHCCode']").each(function () {
                                    if (!$("#Text_" + $(this).attr("name")).data("kendoAutoComplete")) {
                                        cfi.AutoComplete($(this).attr("name"), "CODE", "SPHC", "SNO", "CODE", ["CODE"], SETPharma, "contains", ",", null, null, null, null, true);
                                    }
                                });
                                //debugger;
                                // transSection k-input k-state-default
                                if ($('input[type="text"][id="_tempStartTemperature"]').val() == undefined) {
                                    $('input[type="text"][id="StartTemperature"]').after("<input id='_tempStartTemperature' name='_tempStartTemperature' tabindex='0' recname='StartTemperature' autocomplete='off' class='k-formatted-value transSection k-input' type='text' placeholder='' style='width: 60px; display: none;'>");
                                }

                                //$('input[type="text"][id="StartTemperature"]').keydown(function (e) {
                                //    IsNumericNewCheck(event);
                                //    //$(this).attr("class", "k-formatted-value transSection k-input");
                                //});
                                CheckNumericforSHC("StartTemperature");

                                //$('input[type="text"][id="StartTemperature"]').on("keypress keyup blur", function (event) {
                                //    if (event.which != 45 && event.which != 0) {
                                //        $(this).val($(this).val().replace(/^(-)\d{2}(\.d\{1})$/, ""));
                                //        if ((event.which < 48 || event.which > 57)) {
                                //            event.preventDefault();
                                //        }
                                //    }
                                //    $(this).attr("class", "k-formatted-value transSection k-input");
                                //});
                                if ($('input[type="text"][id="_tempEndTemperature"]').val() == undefined) {
                                    $('input[type="text"][id="EndTemperature"]').after("<input id='_tempEndTemperature' name='_tempEndTemperature' tabindex='0' recname='EndTemperature' autocomplete='off' class='k-formatted-value transSection k-input' type='text' placeholder='' style='width: 60px; display: none;'>");
                                }
                                $('input[type="text"][id="StartTemperature"]').attr("class", "k-formatted-value transSection k-input");
                                //$('input[type="text"][id="EndTemperature"]').on("keypress keyup blur", function (event) {
                                //    if (event.which != 45 && event.which != 0) {
                                //        $(this).val($(this).val().replace(/^(-)\d{2}(\.d\{1})$/, ""));
                                //        if ((event.which < 48 || event.which > 57)) {
                                //            event.preventDefault();
                                //        }
                                //    }
                                //    $(this).attr("class", "k-formatted-value transSection k-input");
                                //});
                                CheckNumericforSHC("EndTemperature");
                                $('input[type="text"][id="EndTemperature"]').attr("class", "k-formatted-value transSection k-input");
                                if ($('input[type="text"][id="_tempPieces"]').val() == undefined) {
                                    $('input[type="text"][id="Pieces"]').after("<input id='_tempPieces' name='_tempPieces' tabindex='0' recname='Pieces' autocomplete='off' class='k-formatted-value transSection k-input' type='text' placeholder=''  style='width: 40px; display: none;'>");
                                }
                                CheckNumericforSHC("Pieces");
                                //$('input[type="text"][id="Pieces"]').on("keypress keyup blur", function (event) {

                                //    $(this).val($(this).val().replace(/[^\d].+/, ""));
                                //    if ((event.which < 48 || event.which > 57) && event.which != 189 && event.which != 190) {
                                //        event.preventDefault();
                                //    }
                                //    $(this).attr("class", "k-formatted-value transSection k-input");
                                //});

                            });
                            $('input[type="text"][id="Pieces"]').attr("class", "k-formatted-value transSection k-input");
                            var i = 0;
                            $("div[id$='divareaTrans_sli_slishctemp']").find("[id^='areaTrans_sli_slishctemp']").each(function () {
                                var id = $(this).find("input[id^='Text_TDSPHCCode']").attr("id").replace('Text_', '');
                                var txt = $(this).find("input[id^='Text_TDSPHCCode']").val();
                                var val = $(this).find("input[id^='TDSPHCCode']").val();
                                cfi.BindMultiValue(id, txt, val);
                                //debugger;
                                $(this).attr("Pharma", listArraysli_slishctemp[i].pharmacount);
                                //$("div[id$='divareaTrans_sli_slishctemp']").find("[id^='areaTrans_sli_slishctemp']").find("span.k-delete").live("click", function (e) { fn_RemovePharma(e, $(this).find("input[id^='Text_TDSPHCCode']").attr("id")) })

                                i++;

                            });
                            UserSubProcessRights("__divtempdetails__", 1052);
                        }
                    });


                }
            });

        }
        else {
            // debugger
            cfi.PopUp("divTempDetails", "Temp Details", 600, PopUpOnOpen, null, 60);
            //$("#divTempDetails").show();
            //$(".k-window").show();
            //$(".k-overlay").show();
            //$("#divPopUpBackground").show();

        }
    }

    if (currentslisno == 0) {
        $("#btnSaveToNext").hide();
    }


}
function ResetEquipmentDetailsforPOPUp() {
    $("#divEqDetails").data("kendoWindow").close();
}

function ResetTempDetailsforPOPUp() {
    //debugger
    $("#divTempDetails").data("kendoWindow").close();
    //if (SHCTempDetails.length == 0) {
    //    $("#divTempDetails").html("");
    //    $(".k-window").hide();
    //    $(".k-overlay").remove();
    //    $("#divPopUpBackground").remove();
    //}
    //else {
    //    $("#divTempDetails").hide();
    //    $(".k-window").hide();
    //    $(".k-overlay").hide();
    //    $("#divPopUpBackground").hide();
    //}
}

function BindTempDetailsAutoComplete(elem, mainElem) {

    $(elem).find("input[id^='TDSPHCCode']").each(function () {
        if (!$("#Text_" + $(this).attr("name")).data("kendoAutoComplete")) {
            cfi.AutoComplete($(this).attr("name"), "CODE", "SPHC", "SNO", "CODE", ["CODE"], SETPharma, "contains", ",", null, null, null, null, true);
        }
    });

    $("div[id$='divareaTrans_sli_slishctemp']").find("[id^='areaTrans_sli_slishctemp']").each(function () {
        if (!$("#Text_" + $(this).attr("name")).data("kendoAutoComplete")) {
            cfi.AutoComplete($(this).attr("name"), "CODE", "SPHC", "SNO", "CODE", ["CODE"], SETPharma, "contains", ",", null, null, null, null, true);
        }
        //$(this).find("input[id='StartTemperature']").show();
        //$(this).find("input[id='EndTemperature']").show();
        //$(this).find("input[id='Pieces']").show();

        $(this).find("input[id^='StartTemperature']").removeAttr("readonly");
        $(this).find("input[id^='EndTemperature']").removeAttr("readonly");
        $(this).find("input[id^='Pieces']").removeAttr("readonly");
        //$(this).find("input[id='StartTemperature']").css("display", "inline-block");
        //$(this).find("input[id='EndTemperature']").css("display", "inline-block");
        //$(this).find("input[id='Pieces']").css("display", "inline-block");

        $(this).find("input[id^='_tempStartTemperature']").removeAttr("readonly");
        $(this).find("input[id^='_tempEndTemperature']").removeAttr("readonly");
        $(this).find("input[id^='_tempPieces']").removeAttr("readonly");
    });

    //$(elem).find("input[id^='StartTemperature']").each(function () {
    //    $(this).show();
    //});

    //$(elem).find("input[id^='EndTemperature']").each(function () {
    //    $(this).show();
    //});
    //$(elem).find("input[id^='Pieces']").each(function () {
    //    $(this).show();
    //});
    // cfi.AutoComplete("TDSPHCCode", "CODE", "SPHC", "SNO", "CODE", ["CODE"], null, "contains", ",", null, null, null, null, true);
}
function ReBindTempDetailsAutoComplete(elem, mainElem) {

    $(elem).find("input[id^='TDSPHCCode']").each(function () {
        if (!$("#Text_" + $(this).attr("name")).data("kendoAutoComplete")) {
            cfi.AutoComplete($(this).attr("name"), "CODE", "SPHC", "SNO", "CODE", ["CODE"], SETPharma, "contains", ",", null, null, null, null, true);
        }
    });

    //if ($("div[id$=divareaTrans_sli_slishctemp]").find("tr[id^=areaTrans_sli_slishctemp]").length == 1) {
    //    $(elem).find("input[id^='StartTemperature']").each(function () {
    //        $(this).show();
    //    });

    //    $(elem).find("input[id^='EndTemperature']").each(function () {
    //        $(this).show();
    //    });
    //    $(elem).find("input[id^='Pieces']").each(function () {
    //        $(this).show();
    //    });
    //}
    $("div[id$='divareaTrans_sli_slishctemp']").find("[id^='areaTrans_sli_slishctemp']").each(function () {
        if (!$("#Text_" + $(this).attr("name")).data("kendoAutoComplete")) {
            cfi.AutoComplete($(this).attr("name"), "CODE", "SPHC", "SNO", "CODE", ["CODE"], SETPharma, "contains", ",", null, null, null, null, true);
        }
        //$(this).find("input[id='StartTemperature']").show();
        //$(this).find("input[id='EndTemperature']").show();
        //$(this).find("input[id='Pieces']").show();

        $(this).find("input[id^='StartTemperature']").removeAttr("readonly");
        $(this).find("input[id^='EndTemperature']").removeAttr("readonly");
        $(this).find("input[id^='Pieces']").removeAttr("readonly");
        //$(this).find("input[id='StartTemperature']").css("display", "inline-block");
        //$(this).find("input[id='EndTemperature']").css("display", "inline-block");
        //$(this).find("input[id='Pieces']").css("display", "inline-block");

        $(this).find("input[id^='_tempStartTemperature']").removeAttr("readonly");
        $(this).find("input[id^='_tempEndTemperature']").removeAttr("readonly");
        $(this).find("input[id^='_tempPieces']").removeAttr("readonly");
    });


    // cfi.AutoComplete("TDSPHCCode", "CODE", "SPHC", "SNO", "CODE", ["CODE"], null, "contains", ",", null, null, null, null, true);
}
function alpha(e) {
    // debugger;
    var k;
    // document.all ?
    k = e.keyCode; k = e.which;
    if ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)) {
        e.preventDefault();
    }
}
var TempSHCCode = "";
function CheckPriorApprovalonDestinationAirport(DestinationAirportSNo) {
    //debugger;
    //var dataItem = this.dataItem(input.item.index());
    //var DestinationAirportSNo = dataItem.Key || $("#DestinationAirportSNo").val();

    TempSHCCode = "";
    $("span[id='to']").text("to");
    var sphcCodeSNo = $("#Multi_SPHCCode").val().replace('undefined', '');
    if (sphcCodeSNo != "") {
        sphcCodeSNo = sphcCodeSNo + "," + $("input[id='SPHCCode'").val();
    }
    if (sphcCodeSNo == "")
        sphcCodeSNo = $("#SPHCCode").val() || $("input[id='SPHCCode'").val();

    if (sphcCodeSNo != "") {

        //var DestinationAirportSNo = $("#DestinationAirportSNo").val();
        var CurrentSHCSNo = $("#SPHCCode").val();
        $.ajax({
            url: "Services/Shipment/SLInfoService.svc/CheckSLIPriorApprovalForSHC", async: false, type: "get", dataType: "json", cache: false,
            data: { SHCSNo: sphcCodeSNo, SLISNo: currentslisno, DestinationAirportSNo: DestinationAirportSNo },
            contentType: "application/json; charset=utf-8",
            success: function (resultnew) {
                if (resultnew != null) {
                    var Message = jQuery.parseJSON(resultnew);
                    if (Message.Table0.length > 0) {
                        if (Message.Table0[0].ErrorNo == "3") {
                            ValidFlag = true;
                            ShowMessage('warning', 'Warning - ' + SLICaption + '', Message.Table0[0].Message, 'bottom-right');
                        }
                    }
                }
            }
        });
    }

    //  $("span.k-delete").live("click", function () { fn_RemoveTemprature(this) });
}



var TempSHCCode = "";
function GetTempreatureHideAndShow() {
    //debugger;
    if (currentprocess.toUpperCase() == "SLIDIMENSION") {
        //    fn_RemoveRequired();
    }
        //if (currentprocess.toUpperCase() == "SLIAWB") {
        //    fn_RemovePharma();
        //}

    else {
        TempSHCCode = "";
        $("span[id='to']").text("to");
        var sphcCodeSNo = $("#Multi_SPHCCode").val().replace('undefined', '');
        if (sphcCodeSNo != "") {
            sphcCodeSNo = sphcCodeSNo + "," + $("input[id='SPHCCode'").val();
        }
        if (sphcCodeSNo == "")
            sphcCodeSNo = $("#SPHCCode").val() || $("input[id='SPHCCode'").val();

        if (sphcCodeSNo != "") {
            $.ajax({
                url: "Services/Shipment/SLInfoService.svc/GetSLITemperature?sphcCodeSNo=" + sphcCodeSNo, async: false, type: "get", dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var Data = jQuery.parseJSON(result);
                    var resData = Data.Table0;
                    var test = "False";
                    var SPHCPharmaCounttbl = Data.Table1;
                    for (var i = 0; i < resData.length;) {
                        if (resData[i].IsTemperatureControlled == "True") {
                            test = "True";
                            TempSHCCode = TempSHCCode + ',' + resData[i].SNo;
                            // SPHCPharmaCount = SPHCPharmaCounttbl[0].SPHCPharmaCount; 
                        }
                        i++;
                    }
                    if (test == "True") {
                        $("#ahref_ClassDetails").show();

                    }
                    else {
                        $("#ahref_ClassDetails").css("display", "none");

                    }
                    //var input = "#DestinationAirportSNo";


                    var DestinationAirportSNo = $("#DestinationAirportSNo").val();
                    var CurrentSHCSNo = $("#SPHCCode").val();
                    $.ajax({
                        url: "Services/Shipment/SLInfoService.svc/CheckSLIPriorApprovalForSHC", async: false, type: "get", dataType: "json", cache: false,
                        data: { SHCSNo: sphcCodeSNo, SLISNo: currentslisno, DestinationAirportSNo: DestinationAirportSNo },
                        contentType: "application/json; charset=utf-8",
                        success: function (resultnew) {
                            if (resultnew != null) {
                                var Message = jQuery.parseJSON(resultnew);
                                if (Message.Table0.length > 0) {
                                    if (Message.Table0[0].ErrorNo == "3") {
                                        ValidFlag = true;
                                        ShowMessage('warning', 'Warning - ' + SLICaption + '', Message.Table0[0].Message, 'bottom-right');
                                    }
                                }
                            }
                        }
                    });
                },
                error: {}
            });
        }
        else {

            $("#ahref_ClassDetails").css("display", "none");
        }
    }


    //  $("span.k-delete").live("click", function () { fn_RemoveTemprature(this) });
}
function fn_CheckRangeCaptured(input) {
    var currentTr = $(input).closest('tr');
    var StartTemperature = parseInt(currentTr.find("input[id^=StartTemperature]").val() || $(input).parent().parent().find("input[id^='ULDStartTemperature']").val());
    var EndTempreature = parseInt(currentTr.find("input[id^=EndTemperature]").val() || $(input).parent().parent().find("input[id^='ULDEndTemperature']").val());
    var Capturedwt = parseInt($(input).val() || 0);

    if (Capturedwt >= StartTemperature) {
        if (Capturedwt > EndTempreature) {
            ShowMessage('warning', 'Warning - Temperature', "Captured temperature is out of range.", "bottom-right");
        }
    }
    if (Capturedwt < StartTemperature) {
        ShowMessage('warning', 'Warning - Temperature', "Captured temperature is out of range.", "bottom-right");
    }
    if (isNaN(StartTemperature)) {
        $(input).val("");
    }
    if (isNaN(EndTempreature)) {
        $(input).val("");
    }
    fn_RemoveRequired();

}

function fn_CheckPharmaSHC(input) {
    var currentTr = $(input).closest('tr');

    var StartTemp = currentTr.find("input[id^=StartTemperature]").val() || $(input).parent().parent().find("input[id^='ULDStartTemperature']").val();
    var EndTemp = currentTr.find("input[id^=EndTemperature]").val() || $(input).parent().parent().find("input[id^='ULDEndTemperature']").val();

    var GetPharmaCount = parseInt(currentTr.attr("Pharma"));
    if (isNaN(GetPharmaCount)) {
        GetPharmaCount = 0;
    }
    if (GetPharmaCount == 1) {
        if (StartTemp != 0) {
            if ((parseInt(StartTemp) != parseInt(-18)) && (parseInt(StartTemp) != parseInt(2)) && (parseInt(StartTemp) != parseInt(15))) {
                currentTr.find("input[id^=StartTemperature]").val("");
                currentTr.find("input[id^=_tempStartTemperature]").val("");
                currentTr.find("input[id^=EndTemperature]").val("");
                currentTr.find("input[id^=_tempEndTemperature]").val("");
                currentTr.find("input[id^=Capturedtemp]").val("");
                currentTr.find("input[id^=_tempCapturedtemp]").val("");
                $(input).parent().parent().find("input[id^='ULDStartTemperature']").val("");
                $(input).parent().parent().find("input[id^='_tempULDStartTemperature']").val("");
                $(input).parent().parent().find("input[id^='ULDEndTemperature']").val("");
                $(input).parent().parent().find("input[id^='_tempULDEndTemperature']").val("");
                $(input).parent().parent().find("input[id^='ULDCapturedtemp']").val("");
                $(input).parent().parent().find("input[id^='_tempULDCapturedtemp']").val("");

            }
        }
    }
}

function fn_CheckRange(input) {
    //debugger;
    var StartTemperature = $(input).val() || 0;

    var currentTr = $(input).closest('tr');
    var GetPharmaCount = parseInt(currentTr.attr("Pharma"));

    if (isNaN(GetPharmaCount)) {
        GetPharmaCount = 0;
    }
    var SPHCCode = currentTr.find("input[id^=TDSPHCCode]").val() || currentTr.find("input[id^=SLISPHCCode]").val() || currentTr.find("input[id^=ULDSPHCCode]").val() || "";
    var EndTempreature = currentTr.find("input[id^=EndTemperature]").val() || $(input).parent().parent().find("input[id^='ULDEndTemperature']").val();
    if (EndTempreature == undefined) {
        EndTempreature = 0;
    }

    if (SPHCCode == "") {
        $(input).val("");
    }


    if (GetPharmaCount == 0) {
        if (EndTempreature != 0) {
            if (parseInt(EndTempreature) < parseInt(StartTemperature)) {
                ShowMessage('warning', 'Warning - Temperature', "End temperature should be greater than Start Temperature.", "bottom-right");
                currentTr.find("input[id=EndTemperature]").val("");
            }
        }
    }
    else {
        if (StartTemperature != 0) {
            if ((parseInt(StartTemperature) != parseInt(-18)) && (parseInt(StartTemperature) != parseInt(2)) && (parseInt(StartTemperature) != parseInt(15))) {
                ShowMessage('warning', 'Warning - Temperature', "Required Temperature details entered, fall outside the Acceptable Temperature Range for Pharmaceutical Shipments. Kindly provide correct details ", "bottom-right");
                $(input).val("");
                currentTr.find("input[id^=EndTemperature]").val("");
                currentTr.find("input[id^=Capturedtemp]").val("");
                currentTr.find("input[id^=_tempEndTemperature]").val("");
                currentTr.find("input[id^=_tempCapturedtemp]").val("");
                $(input).parent().parent().find("input[id^='_tempULDEndTemperature']").val("");
                $(input).parent().parent().find("input[id^='ULDEndTemperature']").val("");
                $(input).parent().parent().find("input[id^='_tempULDCapturedtemp']").val("");
                $(input).parent().parent().find("input[id^='ULDCapturedtemp']").val("");
            }
            else {
                if (EndTempreature != 0) {
                    if (StartTemperature == parseInt(-18) && parseInt(EndTempreature) != parseInt(-18)) {
                        ShowMessage('warning', 'Warning - Temperature', "End Temperature range should be -18", "bottom-right");
                        $(input).val("");
                        currentTr.find("input[id^=EndTemperature]").val("");
                        currentTr.find("input[id^=Capturedtemp]").val("");
                        currentTr.find("input[id^=_tempEndTemperature]").val("");
                        currentTr.find("input[id^=_tempCapturedtemp]").val("");
                        $(input).parent().parent().find("input[id^='_tempULDEndTemperature']").val("");
                        $(input).parent().parent().find("input[id^='ULDEndTemperature']").val("");
                        $(input).parent().parent().find("input[id^='_tempULDCapturedtemp']").val("");
                        $(input).parent().parent().find("input[id^='ULDCapturedtemp']").val("");
                    }
                    if (StartTemperature == parseInt(2) && parseInt(EndTempreature) != parseInt(8)) {
                        ShowMessage('warning', 'Warning - Temperature', "End Temperature range should be 8", "bottom-right");
                        $(input).val("");
                        currentTr.find("input[id^=EndTemperature]").val("");
                        currentTr.find("input[id^=Capturedtemp]").val("");
                        currentTr.find("input[id^=_tempEndTemperature]").val("");
                        currentTr.find("input[id^=_tempCapturedtemp]").val("");
                        $(input).parent().parent().find("input[id^='_tempULDEndTemperature']").val("");
                        $(input).parent().parent().find("input[id^='ULDEndTemperature']").val("");
                        $(input).parent().parent().find("input[id^='_tempULDCapturedtemp']").val("");
                        $(input).parent().parent().find("input[id^='ULDCapturedtemp']").val("");
                    }
                    if (StartTemperature == parseInt(15) && parseInt(EndTempreature) != parseInt(25)) {
                        ShowMessage('warning', 'Warning - Temperature', "End Temperature range should be 25", "bottom-right");
                        $(input).val("");
                        currentTr.find("input[id^=EndTemperature]").val("");
                        currentTr.find("input[id^=Capturedtemp]").val("");
                        currentTr.find("input[id^=_tempEndTemperature]").val("");
                        currentTr.find("input[id^=_tempCapturedtemp]").val("");
                        $(input).parent().parent().find("input[id^='_tempULDEndTemperature']").val("");
                        $(input).parent().parent().find("input[id^='ULDEndTemperature']").val("");
                        $(input).parent().parent().find("input[id^='_tempULDCapturedtemp']").val("");
                        $(input).parent().parent().find("input[id^='ULDCapturedtemp']").val("");
                    }
                    if ((parseInt(EndTempreature) != parseInt(-18)) && (parseInt(EndTempreature) != parseInt(8)) && (parseInt(EndTempreature) != parseInt(25))) {
                        ShowMessage('warning', 'Warning - Temperature', "Required Temperature details entered, fall outside the Acceptable Temperature Range for Pharmaceutical Shipments. Kindly provide correct details ", "bottom-right");
                        $(input).val("");
                        currentTr.find("input[id^=EndTemperature]").val("");
                        currentTr.find("input[id^=Capturedtemp]").val("");
                        currentTr.find("input[id^=_tempEndTemperature]").val("");
                        currentTr.find("input[id^=_tempCapturedtemp]").val("");
                        $(input).parent().parent().find("input[id^='_tempULDEndTemperature']").val("");
                        $(input).parent().parent().find("input[id^='ULDEndTemperature']").val("");
                        $(input).parent().parent().find("input[id^='_tempULDCapturedtemp']").val("");
                        $(input).parent().parent().find("input[id^='ULDCapturedtemp']").val("");
                    }
                }

            }
        }
        if (StartTemperature == 0) {
            ShowMessage('warning', 'Warning - Temperature', "Required Temperature details entered, fall outside the Acceptable Temperature Range for Pharmaceutical Shipments. Kindly provide correct details ", "bottom-right");
            $(input).val("");
            currentTr.find("input[id^=EndTemperature]").val("");
            currentTr.find("input[id^=Capturedtemp]").val("");
            currentTr.find("input[id^=_tempEndTemperature]").val("");
            currentTr.find("input[id^=_tempCapturedtemp]").val("");
            $(input).parent().parent().find("input[id^='_tempULDEndTemperature']").val("");
            $(input).parent().parent().find("input[id^='ULDEndTemperature']").val("");
            $(input).parent().parent().find("input[id^='_tempULDCapturedtemp']").val("");
            $(input).parent().parent().find("input[id^='ULDCapturedtemp']").val("");
        }

    }

}
function fn_CheckRangeEnd(input) {
    //debugger;
    var EndTempreature = $(input).val() || 0;

    var StartTemperature = $(input).parent().parent().find("input[id^='StartTemperature']").val() || $(input).parent().parent().find("input[id^='ULDStartTemperature']").val();
    var currentTr = $(input).closest('tr');
    var SPHCCode = currentTr.find("input[id^=TDSPHCCode]").val() || currentTr.find("input[id^=SLISPHCCode]").val() || currentTr.find("input[id^=ULDSPHCCode]").val() || "";

    if (StartTemperature == undefined) {
        StartTemperature = 0;
    }
    if (SPHCCode == "") {

        $(input).val("");
    }

    var GetPharmaCount = parseInt($(input).parent().parent().attr("Pharma"));
    if (isNaN(GetPharmaCount)) {
        GetPharmaCount = 0;
    }

    if (GetPharmaCount == 0) {
        if (parseInt(EndTempreature) < parseInt(StartTemperature)) {
            ShowMessage('warning', 'Warning - Temperature', "End Temperature should be greater than Start Temperature.", "bottom-right");
            $(input).val("");
            $(input).parent().find("input[id='EndTempreature']").val("");
        }
    }
    else {
        if (EndTempreature != 0) {
            if (StartTemperature == parseInt(-18) && parseInt(EndTempreature) != parseInt(-18)) {
                ShowMessage('warning', 'Warning - Temperature', "End Temperature range should be -18", "bottom-right");
                $(input).val("");
            }
            if (StartTemperature == parseInt(2) && parseInt(EndTempreature) != parseInt(8)) {
                ShowMessage('warning', 'Warning - Temperature', "End Temperature range should be 8", "bottom-right");
                $(input).val("");
            }
            if (StartTemperature == parseInt(15) && parseInt(EndTempreature) != parseInt(25)) {
                ShowMessage('warning', 'Warning - Temperature', "End Temperature range should be 25", "bottom-right");
                $(input).val("");
            }
            if ((parseInt(EndTempreature) != parseInt(-18)) && (parseInt(EndTempreature) != parseInt(8)) && (parseInt(EndTempreature) != parseInt(25))) {
                ShowMessage('warning', 'Warning - Temperature', "Required Temperature details entered, fall outside the Acceptable Temperature Range for Pharmaceutical Shipments. Kindly provide correct details ", "bottom-right");
                $(input).val("");
            }
        }
        if (EndTempreature == 0) {
            ShowMessage('warning', 'Warning - Temperature', "Required Temperature details entered, fall outside the Acceptable Temperature Range for Pharmaceutical Shipments. Kindly provide correct details ", "bottom-right");
            $(input).val("");
        }

    }
}
//function fn_CheckRange(input) {
//    //debugger;
//    var StartTemperature = $(input).val() || 0;

//    var currentTr = $(input).closest('tr');
//    var GetPharmaCount = parseInt(currentTr.attr("Pharma"));
//    if (isNaN(StartTemperature)) {
//        StartTemperature = 0;
//    }
//    if (isNaN(GetPharmaCount)) {
//        GetPharmaCount = 0;
//    }
//    var SPHCCode = currentTr.find("input[id^=TDSPHCCode]").val() || currentTr.find("input[id^=SLISPHCCode]").val() || currentTr.find("input[id^=ULDSPHCCode]").val() || "";
//    var EndTempreature = currentTr.find("input[id^=EndTemperature]").val() || $(input).parent().parent().find("input[id^='ULDEndTemperature']").val();
//    if (EndTempreature == undefined) {
//        EndTempreature = 0;
//    }

//    if (SPHCCode == "") {
//        StartTemperature = 0;
//        EndTempreature = 0;
//        $(input).val("");
//    }
//    if (GetPharmaCount == 1) {
//        if (StartTemperature == 0) {
//            ShowMessage('warning', 'Warning - Temperature', "Required Temperature details entered, fall outside the Acceptable Temperature Range for Pharmaceutical Shipments. Kindly provide correct details ", "bottom-right");
//            $(input).val("");
//            currentTr.find("input[id=EndTemperature]").val("");
//        }
//        //if(parseInt(EndTempreature) == 0)
//        //{
//        //    ShowMessage('warning', 'Warning - Temperature', "Required Temperature details entered, fall outside the Acceptable Temperature Range for Pharmaceutical Shipments. Kindly provide correct details ", "bottom-right");
//        //    currentTr.find("input[id=EndTemperature]").val("");

//        //}
//    }

//    if (GetPharmaCount == 0) {
//        if (parseInt(EndTempreature) != 0) {
//            if (parseInt(EndTempreature) < parseInt(StartTemperature)) {
//                ShowMessage('warning', 'Warning - Temperature', "End temperature should be greater than Start Temperature.", "bottom-right");
//                currentTr.find("input[id=EndTemperature]").val("");
//            }
//        }
//    }
//    else {
//        if (StartTemperature != 0 && StartTemperature != "") {
//            if ((parseInt(StartTemperature) != parseInt(-18)) && (parseInt(StartTemperature) != parseInt(2)) && (parseInt(StartTemperature) != parseInt(15))) {
//                ShowMessage('warning', 'Warning - Temperature', "Required Temperature details entered, fall outside the Acceptable Temperature Range for Pharmaceutical Shipments. Kindly provide correct details ", "bottom-right");
//                $(input).val("");
//                currentTr.find("input[id^=EndTemperature]").val("");
//                currentTr.find("input[id^=Capturedtemp]").val("");
//                currentTr.find("input[id^=_tempEndTemperature]").val("");
//                currentTr.find("input[id^=_tempCapturedtemp]").val("");
//                $(input).parent().parent().find("input[id^='_tempULDEndTemperature']").val("");
//                $(input).parent().parent().find("input[id^='ULDEndTemperature']").val("");
//                $(input).parent().parent().find("input[id^='_tempULDCapturedtemp']").val("");
//                $(input).parent().parent().find("input[id^='ULDCapturedtemp']").val("");
//            }
//            else {
//                if (EndTempreature != 0 && EndTempreature != "") {
//                    if (StartTemperature == parseInt(-18) && parseInt(EndTempreature) != parseInt(-18)) {
//                        ShowMessage('warning', 'Warning - Temperature', "End Temperature range should be -18", "bottom-right");
//                        $(input).val("");
//                        currentTr.find("input[id^=EndTemperature]").val("");
//                        currentTr.find("input[id^=Capturedtemp]").val("");
//                        currentTr.find("input[id^=_tempEndTemperature]").val("");
//                        currentTr.find("input[id^=_tempCapturedtemp]").val("");
//                        $(input).parent().parent().find("input[id^='_tempULDEndTemperature']").val("");
//                        $(input).parent().parent().find("input[id^='ULDEndTemperature']").val("");
//                        $(input).parent().parent().find("input[id^='_tempULDCapturedtemp']").val("");
//                        $(input).parent().parent().find("input[id^='ULDCapturedtemp']").val("");
//                    }
//                    if (StartTemperature == parseInt(2) && parseInt(EndTempreature) != parseInt(8)) {
//                        ShowMessage('warning', 'Warning - Temperature', "End Temperature range should be 8", "bottom-right");
//                        $(input).val("");
//                        currentTr.find("input[id^=EndTemperature]").val("");
//                        currentTr.find("input[id^=Capturedtemp]").val("");
//                        currentTr.find("input[id^=_tempEndTemperature]").val("");
//                        currentTr.find("input[id^=_tempCapturedtemp]").val("");
//                        $(input).parent().parent().find("input[id^='_tempULDEndTemperature']").val("");
//                        $(input).parent().parent().find("input[id^='ULDEndTemperature']").val("");
//                        $(input).parent().parent().find("input[id^='_tempULDCapturedtemp']").val("");
//                        $(input).parent().parent().find("input[id^='ULDCapturedtemp']").val("");
//                    }
//                    if (StartTemperature == parseInt(15) && parseInt(EndTempreature) != parseInt(25)) {
//                        ShowMessage('warning', 'Warning - Temperature', "End Temperature range should be 25", "bottom-right");
//                        $(input).val("");
//                        currentTr.find("input[id^=EndTemperature]").val("");
//                        currentTr.find("input[id^=Capturedtemp]").val("");
//                        currentTr.find("input[id^=_tempEndTemperature]").val("");
//                        currentTr.find("input[id^=_tempCapturedtemp]").val("");
//                        $(input).parent().parent().find("input[id^='_tempULDEndTemperature']").val("");
//                        $(input).parent().parent().find("input[id^='ULDEndTemperature']").val("");
//                        $(input).parent().parent().find("input[id^='_tempULDCapturedtemp']").val("");
//                        $(input).parent().parent().find("input[id^='ULDCapturedtemp']").val("");
//                    }
//                    if ((parseInt(EndTempreature) != parseInt(-18)) && (parseInt(EndTempreature) != parseInt(8)) && (parseInt(EndTempreature) != parseInt(25))) {
//                        ShowMessage('warning', 'Warning - Temperature', "Required Temperature details entered, fall outside the Acceptable Temperature Range for Pharmaceutical Shipments. Kindly provide correct details ", "bottom-right");
//                        $(input).val("");
//                        currentTr.find("input[id^=EndTemperature]").val("");
//                        currentTr.find("input[id^=Capturedtemp]").val("");
//                        currentTr.find("input[id^=_tempEndTemperature]").val("");
//                        currentTr.find("input[id^=_tempCapturedtemp]").val("");
//                        $(input).parent().parent().find("input[id^='_tempULDEndTemperature']").val("");
//                        $(input).parent().parent().find("input[id^='ULDEndTemperature']").val("");
//                        $(input).parent().parent().find("input[id^='_tempULDCapturedtemp']").val("");
//                        $(input).parent().parent().find("input[id^='ULDCapturedtemp']").val("");
//                    }
//                }

//            }
//        }
//        if (StartTemperature == 0) {
//            ShowMessage('warning', 'Warning - Temperature', "Required Temperature details entered, fall outside the Acceptable Temperature Range for Pharmaceutical Shipments. Kindly provide correct details ", "bottom-right");
//            $(input).val("");
//            currentTr.find("input[id^=EndTemperature]").val("");
//            currentTr.find("input[id^=Capturedtemp]").val("");
//            currentTr.find("input[id^=_tempEndTemperature]").val("");
//            currentTr.find("input[id^=_tempCapturedtemp]").val("");
//            $(input).parent().parent().find("input[id^='_tempULDEndTemperature']").val("");
//            $(input).parent().parent().find("input[id^='ULDEndTemperature']").val("");
//            $(input).parent().parent().find("input[id^='_tempULDCapturedtemp']").val("");
//            $(input).parent().parent().find("input[id^='ULDCapturedtemp']").val("");
//        }

//    }
//    fn_RemoveRequired();
//}
//function fn_CheckRangeEnd(input) {
//    //debugger;
//    var EndTempreature = $(input).val() || 0;

//    var StartTemperature = $(input).parent().parent().find("input[id^='StartTemperature']").val() || $(input).parent().parent().find("input[id^='ULDStartTemperature']").val();
//    var currentTr = $(input).closest('tr');
//    var SPHCCode = currentTr.find("input[id^=TDSPHCCode]").val() || currentTr.find("input[id^=SLISPHCCode]").val() || currentTr.find("input[id^=ULDSPHCCode]").val() || "";

//    if (StartTemperature == undefined) {
//        StartTemperature = 0;
//    }
//    if (SPHCCode == "") {
//        StartTemperature = 0;
//        EndTempreature = 0;
//        $(input).val("");
//    }

//    var GetPharmaCount = parseInt($(input).parent().parent().attr("Pharma"));
//    if (isNaN(GetPharmaCount)) {
//        GetPharmaCount = 0;
//    }

//    if (GetPharmaCount == 0) {
//        if (parseInt(EndTempreature) < parseInt(StartTemperature)) {
//            ShowMessage('warning', 'Warning - Temperature', "End Temperature should be greater than Start Temperature.", "bottom-right");
//            $(input).val("");
//            $(input).parent().find("input[id='EndTempreature']").val("");
//        }
//    }
//    else {
//        if (EndTempreature != 0) {
//            if (StartTemperature == parseInt(-18) && parseInt(EndTempreature) != parseInt(-18)) {
//                ShowMessage('warning', 'Warning - Temperature', "End Temperature range should be -18", "bottom-right");
//                $(input).val("");
//            }
//            if (StartTemperature == parseInt(2) && parseInt(EndTempreature) != parseInt(8)) {
//                ShowMessage('warning', 'Warning - Temperature', "End Temperature range should be 8", "bottom-right");
//                $(input).val("");
//            }
//            if (StartTemperature == parseInt(15) && parseInt(EndTempreature) != parseInt(25)) {
//                ShowMessage('warning', 'Warning - Temperature', "End Temperature range should be 25", "bottom-right");
//                $(input).val("");
//            }
//            if ((parseInt(EndTempreature) != parseInt(-18)) && (parseInt(EndTempreature) != parseInt(8)) && (parseInt(EndTempreature) != parseInt(25))) {
//                ShowMessage('warning', 'Warning - Temperature', "Required Temperature details entered, fall outside the Acceptable Temperature Range for Pharmaceutical Shipments. Kindly provide correct details ", "bottom-right");
//                $(input).val("");
//            }
//        }

//    }
//    fn_RemoveRequired();
//}


function onselectSphcCode() {
    //debugger;
    GetTempreatureHideAndShow();

    //$("span.k-delete").live("click", function () { fn_RemoveTemprature(this) })

}

function AutoCompleteDeleteCallBack(e, div, textboxid) {
    //debugger;
    var target = e.target; // get current Span.
    var DivId = div; // get div id.
    var textboxid = textboxid; // get textbox id.
    var mid = textboxid.replace('Text', 'Multi');

    var arr = $("#" + mid).val().split(',');
    var idx = arr.indexOf($(this)[0].id);
    arr.splice(idx, $(e.target).attr("id"));
    $("#" + mid).val(arr);
    $("#" + textboxid.replace('Text_', '')).val(arr);


    if (textboxid == "Text_SPHCCode") {
        $(target).closest("li").remove();
        var id = $("#Multi_SPHCCode").val();
        GetTempreatureHideAndShow();
    }
    else if (textboxid == "Text_TDSPHCCode") {
        $(target).closest("li").remove();
        fn_RemovePharma(e, "#" + textboxid);
    }
    else if ($("#" + textboxid).attr("recname") == "Text_SLISPHCCode") {
        //$(target).closest("li").remove();
        fn_RemoveRequired();
        //SetRequired(textboxid);
    }
    else if ($("#" + textboxid).attr("recname") == "Text_ULDSPHCCode") {
        // $(target).closest("li").remove();
        fn_RemoveRequired();
        //SetRequired(textboxid);
    }

    //$(target).closest("li").remove();
    //SetRequired(textboxid);
}






//function fn_RemoveTemprature(input) {
//    // debugger;
//    //$("#__tblsliawb__ tbody tr:eq(8)").hide();
//    //$("#__tblsliawb__ tbody td:eq(45)").hide();
//    //$("#__tblsliawb__ tbody td:eq(46)").hide();
//    //$('#StartTempreature').removeAttr('data-valid');
//    //$('#EndTempreature').removeAttr('data-valid');
//    //$('#_tempStartTemperature').removeAttr('data-valid');
//    //$('#_tempEndTemperature').removeAttr('data-valid');
//    //$('#StartTempreature').val("");
//    //$('#EndTempreature').val("");
//    //$('#_tempStartTemperature').val("");
//    //$('#_tempEndTemperature').val("");

//    //TempSHCCode = TempSHCCode.replace($(input).attr("id"), "");

//    GetTempreatureHideAndShow();
//}
function fun_BindAWBPrefix() {

    $('#AWBPrefix').unbind("blur").bind("blur", function () {
        if ($(this).val().length < 3) {
            ShowMessage('warning', 'Warning - ' + SLICaption + '', "Enter Valid AWB No.", "bottom-right");
            return false
        }
        else
            return true;
    });
    $('#AWBNo').unbind("blur").bind("blur", function () {
        if ($(this).val().length < 8) {
            ShowMessage('warning', 'Warning - ' + SLICaption + '', "Enter Valid AWB No.", "bottom-right");
            return false
        }
        else
            return true;
    });

}
////function rbtCheck(input)
////{
////    alert($(input).val());
////}
//$('input:radio[name=Category]:checked').val() == 1

function funValidateDeclare() {
    $("input[name=DeclaredCarriagevalue]").bind("blur", function () {
        if ($("#DeclaredCarriagevalue").val() == "") {
            $("#DeclaredCarriagevalue").val("NVD");
            $("#_tempDeclaredCarriagevalue").val("NVD");
        }
    });
    $("input[name=DeclaredCustomValue]").bind("blur", function () {
        if ($("#DeclaredCustomValue").val() == "") {
            $("#DeclaredCustomValue").val("NCV");
            $("#_tempDeclaredCustomValue").val("NCV");
        }
    });

    //$("input[name=DeclaredCarriagevalue]").keyup(function (evt) {
    //    var theEvent = evt || window.event;
    //    var key = theEvent.keyCode || theEvent.which;
    //    key = String.fromCharCode(key);
    //    var regex = /^[0-9]{0,9}$/;    // allow only numbers [0-9] 
    //    if (!regex.test(key)) {
    //        theEvent.returnValue = false;
    //        if (theEvent.preventDefault) theEvent.preventDefault();
    //    }

    //  //  ISDecCarriageNumber(this);
    //});
    //$("input[name=DeclaredCustomValue]").keypress(function (evt) {
    //    ISDecCustomNumber(this);
    //});
}

function BindSLIData(resItem, sphcArray) {
    // debugger;
    $("#Text_CustomerType").data("kendoAutoComplete").setDefaultValue(resItem.CustomerTypeSNo, resItem.CustomerType);
    $("#CustomerType").val(resItem.CustomerTypeSNo);
    $("#Text_CurrencySNo").data("kendoAutoComplete").setDefaultValue(resItem.CurrencySNo, resItem.CurrencyCode + '-' + resItem.CurrencyName);
    $("#CurrencySNo").val(resItem.CurrencySNo);
    $("#Text_BookingType").data("kendoAutoComplete").setDefaultValue(resItem.BookingTypeSNo, resItem.BookingType);
    $("#BookingType").val(resItem.BookingTypeSNo);
    $('#AWBPrefix').val(resItem.AWBPrefix != '' ? resItem.AWBPrefix : 'SLI');
    if ($("#Text_CustomerType").val() == "WALK IN" && resItem.AgentName.toUpperCase() == "SAS") {
        TempSLIAwbNo = $("#AWBPrefix").val() + "-" + $("#AWBNo").val() || $("#Text_AWBNos").val();
        $("#AWBPrefix").hide();
        $("span[id=Hypn]").hide();
        $("#AWBNo").hide();
        $("#AWBPrefix").val("");
        $("#AWBNo").val("");
        $("#Hypn").after("<input type='hidden' id='AWBNos' name='AWBNos' tabindex='0'  /> <input type=text id='Text_AWBNos' name='Text_AWBNos' tabindex='0'   controltype='autocomplete'/>");
        cfi.AutoComplete("AWBNos", "AWBNo", "vwAWBSLIStock", "SNo", "AWBNo", ["AWBNo"], SetAWBOLd, "contains");
        $("#Text_AWBNos").val(resItem.AWBPrefix + "-" + resItem.AWBNo);
        //if ($("#AWBPrefix").val() == "" && $("#AWBNo").val() == "") {
        //    TempSLIAwbNo = $("#Text_AWBNos").val();
        //}
    }
    else {
        $("#AWBNo").val(resItem.AWBNo);
    }
    // $("#AWBNo").val(resItem.AWBNo);
    $("#SLINo").val(resItem.SLINo);
    $('span[id="SLINobks"]').text("/");
    $('span[id="NewSLINo"]').text(resItem.SLINo);
    //$('#Text_CustomerType').focus();

    $('span[id="Hypn"]').text('-');
    //$("#StartTemperature").val(resItem.StartTemperature);
    //$("#EndTemperature").val(resItem.EndTemperature);
    //$("#_tempStartTemperature").val(resItem.StartTemperature);
    //$("#_tempEndTemperature").val(resItem.EndTemperature);
    $("#Text_AirlineSNo").data("kendoAutoComplete").setDefaultValue(resItem.AirlineSNo, resItem.CarrierCode + '-' + resItem.Airline);
    $("#Text_DestinationAirportSNo").data("kendoAutoComplete").setDefaultValue(resItem.DestinationAirportSNo, resItem.DestinationAirportCode + '-' + resItem.DestinationAirportName);
    $("#Text_RoutingCity").data("kendoAutoComplete").setDefaultValue(resItem.RoutingCitySNo, resItem.RoutingAirportCode + '-' + resItem.RoutingAirportName);
    //  $("#Text_SPHCCode").data("kendoAutoComplete").setDefaultValue(resItem.SPHCCodeSNo, resItem.SPHCCode + '-' + resItem.SPHCName);
    $("#Text_AccountSNo").data("kendoAutoComplete").setDefaultValue(resItem.AccountSNo, resItem.AgentName);
    $("#RefSLINo").val(resItem.REFSLINo);
    //$("#DeclaredCarriagevalue").val(resItem.DeclaredCarriagevalue);
    //$("#DeclaredCustomValue").val(resItem.DeclaredCustomValue);

    $("#DeclaredCarriagevalue").val(resItem.DeclaredCarriagevalue);
    $("#DeclaredCustomValue").val(resItem.DeclaredCustomValue);
    //$("#_tempDeclaredCustomValue").val(parseFloat(resItem.DeclaredCustomValue).toFixed(2));
    //$("#_tempDeclaredCarriagevalue").val(parseFloat(resItem.DeclaredCarriagevalue).toFixed(2));

    //$("#DeclaredCarriagevalue").data("kendoNumericTextBox").value(parseFloat(resItem.DeclaredCarriagevalue).toFixed(2));
    //$("#DeclaredCustomValue").data("kendoNumericTextBox").value(parseFloat(resItem.DeclaredCustomValue).toFixed(2));
    //$("#_tempDeclaredCustomValue").val(parseFloat(resItem.DeclaredCustomValue).toFixed(2));
    //$("#_tempDeclaredCarriagevalue").val(parseFloat(resItem.DeclaredCarriagevalue).toFixed(2));
    $("#isBOEVerified").prop('disabled', true);
    $("#isBOEVerified").prop('enabled', false);

    $("#ChargeCode").val(resItem.ChargeCodeSNo);
    $("#Text_ChargeCode").data("kendoAutoComplete").setDefaultValue(resItem.ChargeCodeSNo, resItem.ChargeCode);
    $("#HAWBNo").val(resItem.HAWBNo);
    $("#HAWBCount").val(resItem.HAWBCount);
    $("#_tempHAWBCount").val(resItem.HAWBCount);
    $("#Shipper_Agent").val(resItem.ShipperAgent);
    $("#BOENo").val(resItem.BookingTypeSNo == 1 ? resItem.ExitFormNo : resItem.BOENo);
    $("#GRNNo").val(resItem.GRNNo);
    $("#IDNumber").val(resItem.IDNumber);

    if (resItem.HAWBNo != "") {
        fn_CheckHawb("#HAWBNo");
    }
    else {
        fn_CheckHawb("#HAWBCount");
    }

    if (resItem.IDRetained == "True") {
        $('input:radio[name=IDRetained]:eq(0)').attr("checked", 1);
        $('#spnIDNumber').show();
        $('#IDNumber').show();
        $('#spnIDNumber').parent().find('font').show();
    }
    else {
        $('input:radio[name=IDRetained]:eq(1)').attr("checked", 1);
        $('#spnIDNumber').hide();
        $('#IDNumber').hide();
        $('#IDNumber').val("");
        $('#spnIDNumber').parent().find('font').hide();

    }
    if (sphcArray.length > 0) {
        //alert(sphcArray[0].SPHCCodeSNo)
        if (sphcArray[0].SPHCCodeSNo != "") {
            // $("#SPHCCode").val(0);
            //  cfi.BindMultiValue("SPHCCode", "", 0);
            // $('#divMultiSPHCCode ul').html("");
            $("#SPHCCode").val(sphcArray[0].SPHCCodeSNo);
            cfi.BindMultiValue("SPHCCode", sphcArray[0].SPHCCode, sphcArray[0].SPHCCodeSNo)
        }
    }
    $('input:radio[name=SLIType]:eq(' + resItem.SLIType + ')').attr("checked", 1);
    resItem.isBup == "True" ? $("#isBup").prop('checked', true) : $("#isBup").prop('checked', false);
    OnTypeSelection('BookingType');
    GetTempreatureHideAndShow();
    if (userContext.GroupName.toUpperCase() == "AGENT") {
        $("#Text_CustomerType").data("kendoAutoComplete").setDefaultValue(1, "REGULAR");
        $("#CustomerType").val(1);
        $("#Text_CustomerType").data("kendoAutoComplete").enable(false);
        $("#AccountSNo").val(userContext.AgentSNo);
        $("#Text_AccountSNo").data("kendoAutoComplete").setDefaultValue(userContext.AgentSNo, userContext.AgentName);
        $("#Text_AccountSNo").data("kendoAutoComplete").enable(false);
        $("input:checkbox[name=isBup]").attr("enabled", false);
        $("input:checkbox[name=isBup]").attr("disabled", true);
        $("#Shipper_Agent").val(userContext.AgentName);
    }

}
function GetSLIAWBDetails(SLISNo) {
    //debugger;
    // var No = $('#' + ByType).val();
    //  alert(No)
    IsFinalSLI = false;
    var BuildUpType = "";
    $.ajax({
        url: "Services/Shipment/SLInfoService.svc/GetSLIAWBDetails?SLISNo=" + SLISNo, async: false, type: "get", dataType: "json", cache: false,
        //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }), 
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var resData = Data.Table0;
            var sphcArray = Data.Table1;
            var BOEVerification = Data.Table2;
            var RCSCountArr = Data.Table3;
            RCSCount = RCSCountArr[0].RCSCount;
            //   alert(resData.length);
            BuildUpType = resData[0].BuildUpType;
            if (resData.length > 0 && BuildUpType != "2") {
                var resItem = resData[0];

                if (resItem.SLIType != 1) {
                    //  alert(JSON.stringify(resItem));
                    BindSLIData(resItem, sphcArray);
                    $('#Text_AirlineSNo').first().focus();
                    $('#AirlineSNo').first().focus();

                }
                else {
                    var r = confirm('This ' + SLICaption + ' is already finalized, only data would be populated');
                    if (r == true) {
                        // debugger;
                        BindSLIData(resItem, sphcArray);
                        $('#AWBNo').val("");
                        BindSLICode();
                        $('input:radio[name=SLIType]:eq(0)').attr("checked", 1);
                        $('#Text_AirlineSNo').first().focus();
                        $('#AirlineSNo').first().focus();
                        currentslisno = 0;

                    } else {
                        var module = "SLI";
                        // IsFinalSLI = false;
                        //IsProcessed = false;
                        if (BuildUpType != "2") {
                            $.ajax({
                                url: "Services/Shipment/SLInfoService.svc/GetWebForm/" + _CURR_PRO_ + "/" + module + "/SLIAWB/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                                success: function (result) {
                                    $("#divDetail").html(result);
                                    BindSLICode();
                                    if (result != undefined || result != "") {
                                        InitializePage("SLIAWB", "divDetail");
                                        currentprocess = "SLIAWB";
                                        subprocess = currentprocess;
                                        $('#SLINo').attr('disabled', 1);
                                        $("#tblShipmentInfo").hide();
                                        GetProcessSequence("SLIBOOKING");
                                    }
                                    $('#Text_AirlineSNo').first().focus();
                                    $('#AirlineSNo').first().focus();

                                }
                            });
                        }
                    }

                }
            }
            else {
                if (BuildUpType != "2") {
                    $.ajax({
                        url: "Services/Shipment/SLInfoService.svc/GetSLICode", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                        success: function (result) {
                            var Data = jQuery.parseJSON(result);
                            $('#SLINo').val(Data.Table0[0].SLINo + '-1')
                            $('span[id="SLINobks"]').text("/");
                            $('span[id="NewSLINo"]').text(Data.Table0[0].SLINo + '-1');
                            //$('#Text_CustomerType').focus();
                            $('#AWBPrefix').val('SLI');
                            $('span[id="Hypn"]').text('-');
                            $('#AWBNo').val('00' + Data.Table0[0].SLINo.substr(2, 6));
                        }
                    });
                }
            }

            if (BuildUpType != "2") {
                $("#btnCancel").unbind("click").bind("click", function () {
                    ResetDetails();
                });
                $("#DeclaredCarriagevalue").unbind("keypress").bind("keypress", function () {
                    ISNumeric(this);
                });
                $("#DeclaredCustomValue").unbind("keypress").bind("keypress", function () {
                    ISNumeric(this);
                });

                //if (BOEVerification[0].SysValue == "1") {
                //    $("#isBOEVerified").attr("enabled", true);
                //    $("#isBOEVerified").attr("disabled", false);
                //}
                //else {
                //    $("#isBOEVerified").attr("enabled", false);
                //    $("#isBOEVerified").attr("disabled", true);
                //}
                $("#isBOEVerified").attr("enabled", false);
                $("#isBOEVerified").attr("disabled", true);
                $("#CustomerType").attr("disabled", true);
                $("#Text_CustomerType").data("kendoAutoComplete").enable(false);
                $("#AirlineSNo").attr("disabled", true);
                $("#Text_AirlineSNo").data("kendoAutoComplete").enable(false);
                $("#AccountSNo").attr("enabled", false);
                $("#Text_AccountSNo").data("kendoAutoComplete").enable(false);
                $("#DestinationAirportSNo").attr("enabled", false);
                $("#Text_DestinationAirportSNo").data("kendoAutoComplete").enable(false);
                $("#CurrencySNo").attr("enabled", false);
                $("#Text_CurrencySNo").data("kendoAutoComplete").enable(false);
                if (RCSCount > 0) {
                    $('#AWBPrefix').attr("disabled", true);
                    $("#AWBNo").attr("Disabled", true);
                    $('#AWBPrefix').attr("enabled", false);
                    $("#AWBNo").attr("enabled", false);

                }
                //$("#SHCStatement").hide();
                //$("#spnSHCStatement").hide();

                // $("#SHCStatement").val(resData[0].SHCStatement);
                if ($("#Text_CustomerType").val() == "WALK IN" && resData[0].ShipperAgent.toUpperCase() == "SAS") {
                    //$("#SHCStatement").show();
                    //$("#spnSHCStatement").show();
                }

                if (resItem.HAWBCount == 0) {
                    resItem.HAWBCount = "";
                }
                $("#HAWBCount").val(resItem.HAWBCount);
                $("#_tempHAWBCount").val(resItem.HAWBCount);
                if (resItem.isCSD == "0") {
                    $("input:checkbox[name=isCSD]").removeAttr("checked");
                }
                else {
                    $("input:checkbox[name=isCSD]").attr("checked", 1);
                }
                $("input:checkbox[name=isCSD]").attr("enabled", false);
                $("input:checkbox[name=isCSD]").attr("disabled", true);
                $("span[class='k-picker-wrap k-state-default k-widget k-datepicker k-header k-input']").css("width", "100px");
                $("#BOEDate").css("width", "100px");
                if (resItem.BOEDate != "") {
                    $("#BOEDate").data("kendoDatePicker").value(resItem.BOEDate);
                }
                else {
                    $("#BOEDate").data("kendoDatePicker").value("");
                }

                resItem.isBOEVerified == "True" ? $("#isBOEVerified").prop('checked', true) : $("#isBOEVerified").prop('checked', false);
                if (resItem.isBOEVerified == "True") {

                    $("#BOENo").attr("enabled", false);

                    $("#BOENo").attr("disabled", true);
                    $("#isBOEVerified").attr("enabled", false);
                    $("#isBOEVerified").attr("disabled", true);
                }
                else {

                    $("#BOENo").attr("enabled", true);
                    $("#isBOEVerified").attr("enabled", false);
                    $("#isBOEVerified").attr("disabled", true);
                }

                $("#btnSave").unbind("click").bind("click", function () {
                    //alert('Test');
                    if (cfi.IsValidSection('divDetail')) {
                        if (true) {
                            if (SaveFormData("SLIAWB"))
                                SLISearch();
                        }
                    }
                    else {
                        return false
                    }
                });
                if (userContext.GroupName.toUpperCase() == "AGENT") {
                    $("#Text_CustomerType").data("kendoAutoComplete").setDefaultValue(1, "REGULAR");
                    $("#CustomerType").val(1);
                    $("#Text_CustomerType").data("kendoAutoComplete").enable(false);
                    $("#AccountSNo").val(userContext.AgentSNo);
                    $("#Text_AccountSNo").data("kendoAutoComplete").setDefaultValue(userContext.AgentSNo, userContext.AgentName);
                    $("#Text_AccountSNo").data("kendoAutoComplete").enable(false);
                    $("input:checkbox[name=isBup]").attr("enabled", false);
                    $("input:checkbox[name=isBup]").attr("disabled", true);
                    $("#Shipper_Agent").val(userContext.AgentName);
                }
                //$("#isBOEVerified").attr("enabled", false);
                //$("#isBOEVerified").attr("disabled", true);
                funValidateDeclare();
                fun_BindAWBPrefix();
                DisabledAWBNo();
                SetAWBOLd();
            }
            else {
                ShowMessage('warning', 'Warning - ' + SLICaption + '', "" + SLICaption + " part can be created for Agent BUP from Agent Buildup process only.", 'bottom-right');
                ResetDetails();
            }
        },
        error: {

        }
    });


}

function AutoCompleteByDataSource(textId, dataSourceName, addOnFunction, separator, onSelect) {
    var keyId = textId;
    textId = "Text_" + textId;
    $("div[id^='" + textId + "-list']").remove();
    if (IsValid(textId, autoCompleteType)) {
        basedOn = autoCompleteText;
        var dataSource = dataSourceName;
        $("input[type='text'][name='" + textId + "']").kendoAutoComplete({
            filter: "startswith",
            dataSource: dataSource,
            filterField: basedOn,
            separator: (separator == undefined ? null : separator),
            dataTextField: autoCompleteText,
            dataValueField: autoCompleteKey,
            valueControlID: $("input[type='hidden'][name='" + keyId + "']"),
            addOnFunction: (addOnFunction == undefined ? null : addOnFunction),
            select: (onSelect == undefined ? null : onSelect)
        });
    }
}


var OLDDestinationSNo = "", OldDestination = "";
function checkCCAirline(input) {
    //debugger;
    var ALreadyMessage = false;
    var ValidFlag = false;
    var AirlineSNo = $("#AirlineSNo").val();
    var dataItem = this.dataItem(input.item.index());
    var DestinationAirportSNo = dataItem.Key || $("#DestinationAirportSNo").val();
    //var DestinationAirportSNo = $("#DestinationAirportSNo").val();
    if (DestinationAirportSNo != "") {
        OLDDestinationSNo = $("#DestinationAirportSNo").val();
        OldDestination = $("#Text_DestinationAirportSNo").val();
    }
    var ChargeCode = $("#Text_ChargeCode").val();
    if ($("#Text_DestinationAirportSNo").val() != "") {
        if (AirlineSNo != "" && DestinationAirportSNo != "") {
            $.ajax({
                url: "Services/Shipment/SLInfoService.svc/checkCCAirline", async: false, type: "get", dataType: "json", cache: false,
                data: { AirlineSNo: AirlineSNo, DestinationAirportSNo: DestinationAirportSNo, ChargeCode: ChargeCode },
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var newres = jQuery.parseJSON(result);
                    var Data = newres.Table0;
                    if (Data[0].ErrorNo == 1 && ALreadyMessage == false) {
                        ValidFlag = true;
                        ShowMessage('warning', 'Warning - ' + SLICaption + '',
   "Charges Collect Shipments are not accepted by Airline '" + $("#Text_AirlineSNo").val() + "' for City '" + $("#Text_DestinationAirportSNo").val() + "-" + Data[0].CityName + "'", 'bottom-right');
                        $("#Text_DestinationAirportSNo").val("");
                        $("#DestinationAirportSNo").val("");
                        ALreadyMessage = true;

                    }
                    else if (Data[0].ErrorNo == 2 && ALreadyMessage == false) {
                        ValidFlag = true;
                        ShowMessage('warning', 'Warning - ' + SLICaption + '',
 "Charges Collect Shipments are not accepted by Airline '" + $("#Text_AirlineSNo").val() + "' for City '" + $("#Text_DestinationAirportSNo").val() + "-" + Data[0].CityName + "'", 'bottom-right');
                        $("#Text_DestinationAirportSNo").val("");
                        $("#DestinationAirportSNo").val("");
                        ALreadyMessage = true;
                    }
                    else if (Data[0].ErrorNo == 3 && ALreadyMessage == false) {
                        ValidFlag = true;
                        ShowMessage('warning', 'Warning - ' + SLICaption + '', Data[0].Message, 'bottom-right');
                        ALreadyMessage = true;
                        //"Prior Approval from Destination City '" + Data[0].CityName + "' would be required to forward this Shipment"
                        //Prior Approval from Destination City '" + Data[0].CityName + "' would be required to forward this Shipment for SHC - AVI,RFI or DG Class - Class 1, Class 2
                    }
                    CheckPriorApprovalonDestinationAirport(DestinationAirportSNo);

                },
                error: {
                }
            });
        }
    }
    if ($("#Text_ChargeCode").val() == "PP-PREPAID" || $("#Text_ChargeCode").val() == "PP-Prepaid") {
        $("#DestinationAirportSNo").val(OLDDestinationSNo);
        $("#Text_DestinationAirportSNo").val(OldDestination);
    }

    return ValidFlag;





}

var CheckCancel = 0;
function GetSLIAWBExist() {
    //  alert($('#SLINo').val().split('-')[0]); 
    var awbNo = $("#AWBNo").val();
    var IsCheck = 0;
    if ($("#AWBPrefix").val().toUpperCase() == "SLI") {
        $("#AWBNo").val($("#SLINo").val().split("-")[0].replace("AA", "00"));
        $("#isManual").attr("checked", "checked");
    }

    var AcoountSNo = $("#AccountSNo").val();

    if ($("#Text_CustomerType").val() == "WALK IN") {
        if ($("#Text_AWBNos").val() != undefined && $("#Text_AWBNos").val() != "") {
            awbNo = $("#Text_AWBNos").val().substring(4, 12);
            $("#AWBNo").val(awbNo);
            $("#AWBPrefix").val($("#Text_AWBNos").val().substring(0, 3));
        }
        else {
            if (TempSLIAwbNo != "" && $("#Text_AccountSNo").val() == "SAS") {
                awbNo = TempSLIAwbNo.substring(4, 12) || awbNo;

                if ($("#AWBNo").val() == "" && $("#AWBPrefix").val() == "") {
                    $("#AWBNo").val(awbNo);
                    $("#AWBPrefix").val(TempSLIAwbNo.substring(0, 3) || "SLI");
                }
            }
        }
    }
    if ($('#AWBPrefix').val().toUpperCase() != 'SLI') {
        SetAWBPrefixCode('Text_AirlineSNo');
    }
    var ValidFlag = false;
    if (IsCheckModulus7) {
        //if (($('#AWBPrefix').val().toUpperCase() != 'SLI') && ($('input:radio[name=SLIType]:checked').val() == 1))// For Final Part
        if ($('#AWBPrefix').val().toUpperCase() != 'SLI' && $('#AWBPrefix').val().toUpperCase() == AirlineCode.toUpperCase()) {
            var First7 = $('#AWBNo').val().substring(0, 7);
            var LastDigit = $('#AWBNo').val().substring(7, 8);
            var mod = First7 % 7;
            if (mod != LastDigit) {
                ShowMessage('warning', 'Warning - ' + SLICaption + '', "Invalid AWB No", "bottom-right");
                ValidFlag = true;
            }

        }
    }
    if (($('#AWBPrefix').val().toUpperCase() != 'SLI') && AcoountSNo == "") {
        // $("#Text_AccountSNo").focus();
        ValidFlag = true;
    }
    else {

    }

    if ($('#AWBNo').val() != "") {
        $.ajax({
            url: "Services/Shipment/SLInfoService.svc/GetSLIAWBExist?AWBNo=" + ($('#AWBPrefix').val() + '-' + $('#AWBNo').val()) + "&SLINo=" + $('#SLINo').val().split('-')[0] + "&AccountSNo=" + AcoountSNo + "&AirlineSNo=" + $("#AirlineSNo").val(), async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                // debugger;
                if (result == 1) {
                    //ValidFlag = true;
                    //ShowMessage('warning', 'Warning - SLI', "AWB No=" + ($('#AWBPrefix').val().toUpperCase() + '-' + $('#AWBNo').val()) + " is Invalid/Already Utilized,Please use another AWB No", "bottom-right");

                    if (confirm("Air Waybill Number " + ($('#AWBPrefix').val().toUpperCase() + '-' + $('#AWBNo').val()) + " has already been used . Do you wish to execute another shipment with same Air Waybill Number ?")) {
                        IsCheck = 1;
                    }
                    else {
                        ValidFlag = true;
                        $("#AWBNo").val("");
                        IsCheck = 1;
                    }


                }
                else if (result == 2) {
                    ValidFlag = true;
                    ShowMessage('warning', 'Warning - ' + SLICaption + '', "AWB No=" + ($('#AWBPrefix').val().toUpperCase() + '-' + $('#AWBNo').val()) + " is Already Utilized,Please use another AWB No", "bottom-right");
                    IsCheck = 1;
                }
                else if (result == 3) {
                    if ($("#AccountSNo").val() != "") {
                        ValidFlag = true;
                        ShowMessage('warning', 'Warning - ' + SLICaption + '', "AWB No=" + ($('#AWBPrefix').val().toUpperCase() + '-' + $('#AWBNo').val()) + " does not belong to this Agent", "bottom-right");
                    }
                }
                else if (result == 4) {
                    //ValidFlag = true;
                    //ShowMessage('warning', 'Warning - SLI', "AWB No=" + ($('#AWBPrefix').val().toUpperCase() + '-' + $('#AWBNo').val()) + " is Already Utilized,Please use another AWB No", "bottom-right");
                    if (confirm("Air Waybill Number " + ($('#AWBPrefix').val().toUpperCase() + '-' + $('#AWBNo').val()) + " has already been used . Do you wish to execute another shipment with same Air Waybill Number ?")) {
                        IsCheck = 1;
                    }
                    else {
                        IsCheck = 1;
                        ValidFlag = true;
                        $("#AWBNo").val("");
                    }
                }
                else if (result == 5) {
                    ValidFlag = true;
                    ShowMessage('warning', 'Warning - ' + SLICaption + '', "AWB No=" + ($('#AWBPrefix').val().toUpperCase() + '-' + $('#AWBNo').val()) + " is Blacklisted.", "bottom-right");
                    IsCheck = 1;
                }
                else if (result == 6) {
                    ValidFlag = true;
                    ShowMessage('warning', 'Warning - ' + SLICaption + '', "AWB No=" + ($('#AWBPrefix').val().toUpperCase() + '-' + $('#AWBNo').val()) + " is Void.", "bottom-right");
                    IsCheck = 1;
                }
                else if (result == 7) {
                    ValidFlag = true;
                    ShowMessage('warning', 'Warning - ' + SLICaption + '', "AWB No=" + ($('#AWBPrefix').val().toUpperCase() + '-' + $('#AWBNo').val()) + " is Lost.", "bottom-right");
                    IsCheck = 1;
                }

                else if (result.split('?')[0] == "1010") {
                    ValidFlag = true;

                    var Message = 'Air Waybill Number "' + result.split('?')[1].split('@')[0] + '" has already been used on Flight Date "' + result.split('?')[1].split('@')[1] + '" & Flight Nbr "' + result.split('?')[1].split('@')[2] + '" on "' + result.split('?')[1].split('@')[3] + "-" + result.split('?')[1].split('@')[4] + '"  sector. This AWB can be used after "' + result.split('?')[1].split('@')[5] + '" ';

                    ShowMessage('warning', 'Warning - ' + SLICaption + '', Message, "bottom-right");
                    IsCheck = 1;
                }
                else if (result.split('?')[0] == "1011") {
                    ValidFlag = true;

                    var Message2 = 'Air Waybill Number "' + result.split('?')[1].split('@')[0] + '" has already been used for ' + SLICaption + ' Number "' + result.split('?')[1].split('@')[1] + '" on Date "' + result.split('?')[1].split('@')[2] + '"  on "' + result.split('?')[1].split('@')[3] + '" sector';
                    ShowMessage('warning', 'Warning - ' + SLICaption + '', Message2, "bottom-right");
                    IsCheck = 1;
                }
                else if (result.split('?')[0] == "1001") {

                    //var result = result.split('?')[0];

                    if (confirm('Air Waybill Number "' + result.split('?')[1].split('@')[0] + '" has already been used on Flight Date "' + result.split('?')[1].split('@')[1] + '" & Flight Nbr "' + result.split('?')[1].split('@')[2] + '" on "' + result.split('?')[1].split('@')[3] + "-" + result.split('?')[1].split('@')[4] + '" sector. Do you wish to execute another shipment with same Air Waybill Number ?')) {
                        IsCheck = 1;
                    }
                    else {
                        IsCheck = 1;
                        $("#AWBNo").val("");
                        ValidFlag = true;
                    }

                }
                var Valid = false;
                if ($('#SLIType:checked').val() == "0" && $("#AWBNos").val() == undefined && CheckCancel == 0) {
                    $.ajax({
                        url: "Services/Shipment/SLInfoService.svc/CheckFWBSHipmentonSLI?SLINo=" + $('#SLINo').val() + "&SLISNo=" + currentslisno + "&AWBNo=" + ($('#AWBPrefix').val() + '-' + $('#AWBNo').val()), async: false, type: "get", dataType: "json", cache: false,
                        contentType: "application/json; charset=utf-8",
                        success: function (resultFWB) {
                            if (IsCheck == 0) {
                                if (resultFWB == 1) {
                                    $("#isManual").removeAttr("checked");
                                    Valid = true;
                                    CheckCancel = 0;
                                    var r = jConfirm("FWB details available in system, would you like to fetch & update data for  " + $('#AWBPrefix').val().toUpperCase() + '-' + $('#AWBNo').val(), "", function (r) {
                                        if (r == true) {
                                            $("#isManual").removeAttr("checked");
                                            Valid = true;
                                            //if (confirm("FWB details available in system, would you like to fetch & update data for  " + $('#AWBPrefix').val().toUpperCase() + '-' + $('#AWBNo').val())) {
                                            $.ajax({
                                                url: "Services/Shipment/SLInfoService.svc/saveSLIFWBDetails", async: false, type: "POST", dataType: "json", cache: false,
                                                data: JSON.stringify({ SLINo: $('#SLINo').val(), SLISNo: currentslisno, AWBNo: ($('#AWBPrefix').val() + '-' + $('#AWBNo').val()) }),
                                                contentType: "application/json; charset=utf-8",
                                                success: function (result) {
                                                    var slisno = result.split("-")[0];
                                                    if (result.split("-")[1] == "1") {
                                                        ShowMessage('success', 'Success -' + SLICaption + '', "" + SLICaption + " No=" + $('#SLINo').val() + " Processed Successfully", "bottom-right");
                                                        currentslisno = slisno;
                                                        SLISearch();
                                                        BindSLIAWB();
                                                    }
                                                    else if (result.split("-")[1] == "2") {
                                                        ShowMessage('warning', 'warning -' + SLICaption + '', "FWB details available in system do not match with " + SLICaption + " details. Cannot fetch data", "bottom-right");
                                                        //$("#AWBNo").val("");   
                                                    }
                                                    else if (result.split("-")[1] == "11111") {

                                                        var AgentDD = "<input type='hidden' id='AAccountSNo' name='AAccountSNo' tabindex='0'  /> <input type=text id='Text_AAccountSNo' tabindex='0'   name='Text_AAccountSNo' controltype='autocomplete'/>";
                                                        if ($("#AAccountSNo").val() == undefined) {
                                                            $("#divFWBPopUp").append("Captured FWB details do not have Agent/Forwarder details. Kindly select Agent/Forwarder to proceed - " + AgentDD);
                                                            $("#divFWBPopUp").append(PopupfwbFooter);
                                                        }
                                                        cfi.PopUp("divFWBPopUp", "FWB", 680, PopUpOnOpen, PopUpOnClose, 100);
                                                        cfi.AutoComplete("AAccountSNo", "AgentName", "v_WMSAgent", "SNo", "AgentName", ["AgentName"], null, "contains");

                                                        $("#btnCancel").unbind("click").bind("click", function () {
                                                            $("#divFWBPopUp").data("kendoWindow").close();
                                                        });

                                                        $("#btnFetch").unbind("click").bind("click", function () {
                                                            //alert('Test');
                                                            SaveAGENTSave();
                                                        });

                                                        //ShowMessage('warning', 'warning -' + SLICaption + '', "Forwarder(Agent) entry not found for " + $('#AWBPrefix').val() + '-' + $('#AWBNo').val() + " .Please amend the FWB to proceed.", "bottom-right");
                                                        //$("#AWBNo").val("");   
                                                    }
                                                }
                                            });
                                        }
                                        else {
                                            CheckCancel = 1;
                                        }
                                    });

                                }
                            }
                            else {
                                if (IsCheck == 1 && resultFWB == 1) {
                                    ShowMessage('warning', 'warning -' + SLICaption + '', "Multiple FWB entries for same AWB are available in system. Cannot fetch data", "bottom-right");
                                    //$("#AWBNo").val("");
                                }

                            }

                        }
                    });

                }
                if (ValidFlag == false && Valid == false) {
                    if ($("#AWBPrefix").val() != "SLI") {
                        if ($("#SLINo").val().length == 10) {
                            if ($("#SLINo").val().split("-")[1] == "1" && result.split("?")[1] == "0") {
                                $("#isManual").attr("checked", "checked");
                            }
                        }
                    }
                }
            },
            error: {

            }
        });

    }
    return ValidFlag;
}
function SaveAGENTSave() {
    if ($("#AAccountSNo").val() == "") {
        ShowMessage('warning', 'warning -' + SLICaption + '', "Kindly select Agent.Agent is required.", "bottom-right");
    }
    else {
        $.ajax({
            url: "Services/Shipment/SLInfoService.svc/saveSLIFWBDetailsWithAgent", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ SLINo: $('#SLINo').val(), SLISNo: currentslisno, AWBNo: ($('#AWBPrefix').val() + '-' + $('#AWBNo').val()), AgentSNo: $("#AAccountSNo").val() }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var slisno = result.split("-")[0];
                if (result.split("-")[1] == "1") {
                    ShowMessage('success', 'Success -' + SLICaption + '', "" + SLICaption + " No=" + $('#SLINo').val() + " Processed Successfully", "bottom-right");
                    currentslisno = slisno;
                    SLISearch();
                    BindSLIAWB();
                    $("#divFWBPopUp").data("kendoWindow").close();
                }
                else if (result.split("-")[1] == "2") {
                    ShowMessage('warning', 'warning -' + SLICaption + '', "FWB details available in system do not match with " + SLICaption + " details. Cannot fetch data", "bottom-right");
                    $("#divFWBPopUp").data("kendoWindow").close();
                    //$("#AWBNo").val("");   
                }
            }
        });
    }
}
function ValidatePieces(obj) {

    if (obj != undefined) {
        cfi.ConvertCulture(obj, 1);
    }
    if ($(obj).attr("name") == "GrossWeight") {
        if (isNaN($(obj).val())) {

            $(obj).parent().parent().find("input[id^='CapturedWeight']").val("");
            $(obj).parent().parent().find("input[id^='GrossWeight']").val("");
            $(obj).parent().parent().find("input[id^='Length']").val("");
            $(obj).parent().parent().find("input[id^='Width']").val("");
            $(obj).parent().parent().find("input[id^='Height']").val("");

            $(obj).parent().parent().find("input[id^='_tempGrossWeight']").val("");
            $(obj).parent().parent().find("input[id^='_tempLength']").val("");
            $(obj).parent().parent().find("input[id^='_tempWidth']").val("");
            $(obj).parent().parent().find("input[id^='_tempHeight']").val("");
            $(obj).parent().parent().find("input[id^='VolumeWt']").val("");
            $(obj).parent().parent().find("input[id^='_tempVolumeWt']").val("");

        }
        if ($(obj).val() == "") {
            $(obj).parent().parent().find("input[id^='CapturedWeight']").val("");
            $(obj).parent().parent().find("input[id^='GrossWeight']").val("");
            $(obj).parent().parent().find("input[id^='Length']").val("");
            $(obj).parent().parent().find("input[id^='Width']").val("");
            $(obj).parent().parent().find("input[id^='Height']").val("");
            $(obj).parent().parent().find("input[id^='_tempGrossWeight']").val("");
            $(obj).parent().parent().find("input[id^='_tempLength']").val("");
            $(obj).parent().parent().find("input[id^='_tempWidth']").val("");
            $(obj).parent().parent().find("input[id^='_tempHeight']").val("");
            $(obj).parent().parent().find("input[id^='VolumeWt']").val("");
            $(obj).parent().parent().find("input[id^='_tempVolumeWt']").val("");
        }
    }

    var elem = $("#divareaTrans_sli_sliulddimension");
    //var Pcs = 0;
    //var balancePc = 0;
    //elem.closest("table").find("[id^='Pieces']").each(function () {
    //    balancePc = parseInt($("#TotalPieces").val()) - parseInt(Pcs);
    //    Pcs = Pcs + parseInt(this.value == "" ? "0" : this.value);
    //});

    var closestTable = elem.closest("table");
    var currentIndexPos = $(closestTable).find($(obj).closest("tr")).index() - 1;

    //if (Pcs > parseInt($("#TotalPieces").val())) {
    //    $(closestTable).find("[id^='Length']")[currentIndexPos].value = "";
    //    $(closestTable).find("[id^='Width']")[currentIndexPos].value = "";
    //    $(closestTable).find("[id^='Height']")[currentIndexPos].value = "";
    //    ShowMessage('warning', 'Information!', "Pieces can not be greater than the total Pcs", "bottom-right");
    //    CalculateVolume(elem);
    //    $(closestTable).find("[id^='Pieces']")[currentIndexPos].value = balancePc;
    //    return false;
    //}

    //fn_RemoveRequired();
    CalculateVolume(elem);
    // CalculateULDVolume();
    //CalculatePPVolumeWeight(elem, currentIndexPos);
    //CalculateGrossWeight();

    //if (obj != undefined) {
    //    cfi.ConvertCulture(obj, 0);
    //}
    return true;
}




function CheckSpaceInString(ctrlID) {
    $("input[id=" + ctrlID + "]").keypress(function (evt) {
        var theEvent = evt || window.event;
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
        var regex = /^[a-zA-Z0-9]+$/;    // allow only numbers [0-9] 
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }

    });
}

function ClearShipperCity() {
    $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue(0, '');
}
function ClearCONSIGNEECity() {
    $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue(0, '');
}
var MultipleSLIcountafterFinal = 0;
function BindSLICustomerInfo() {
    MultipleSLIcountafterFinal = 0;
    AfterFinalCountSinglePart = 0;
    cfi.AutoComplete("SHIPPER_AccountNo", "CustomerNo", "vSLIShipperDetails", "SNo", "CustomerNo", ["CustomerNo"], GetShipperConsigneeDetails, "contains");
    //cfi.AutoComplete("SHIPPER_Name", "Name", "vShipperDetails", "SNo", "Name", ["Name"], GetShipperConsigneeDetails, "contains");
    cfi.AutoComplete("SHIPPER_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], ClearShipperCity, "contains");
    cfi.AutoComplete("SHIPPER_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");
    cfi.AutoComplete("CONSIGNEE_AccountNo", "CustomerNo", "vSLIConsigneeDetails", "SNo", "CustomerNo", ["CustomerNo"], GetShipperConsigneeDetails, "contains");
    // cfi.AutoComplete("CONSIGNEE_AccountNoName", "Name", "vConsigneeDetails", "SNo", "Name", ["Name"], GetShipperConsigneeDetails, "contains");
    cfi.AutoComplete("CONSIGNEE_CountryCode", "CountryCode,CountryName", "Country", "SNo", "CountryName", ["CountryCode", "CountryName"], ClearCONSIGNEECity, "contains");
    cfi.AutoComplete("CONSIGNEE_City", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains");


    $.ajax({
        url: "Services/Shipment/SLInfoService.svc/GetShipperAndConsigneeInformation?SLISNo=" + currentslisno, async: false, type: "get", dataType: "json", cache: false,
        //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
        data: JSON.stringify({ SLISNO: currentslisno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var customerData = jQuery.parseJSON(result);
            var shipperData = customerData.Table0;
            var consigneeData = customerData.Table1;
            var MultipleSLIcountafter = customerData.Table2;
            MultipleSLIcountafterFinal = parseInt(MultipleSLIcountafter[0].MultipleSLIcountafterFinal);
            var CountryandCity = customerData.Table3;
            // var agentData = customerData.Table2;
            // alert(JSON.stringify(shipperData));
            if (shipperData.length == 1) {
                $("#SHIPPER_AccountNo").val(shipperData[0].SNo);
                $("#Text_SHIPPER_AccountNo").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperAccountNo, shipperData[0].CustomerNo);
                // $("#Text_SHIPPER_Name").data("kendoAutoComplete").setDefaultValue(shipperData[0].CustomerSNo, shipperData[0].ShipperName);
                $("#SHIPPER_Name").val(shipperData[0].ShipperName);
                $("#SHIPPER_Name1").val(shipperData[0].ShipperName1);
                $("#SHIPPER_Street").val(shipperData[0].ShipperStreet);
                $("#SHIPPER_Street1").val(shipperData[0].ShipperStreet1);
                $("#SHIPPER_TownLocation").val(shipperData[0].ShipperLocation);
                $("#SHIPPER_State").val(shipperData[0].ShipperState);
                $("#SHIPPER_PostalCode").val(shipperData[0].ShipperPostalCode);
                $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCountryCode, shipperData[0].ShipperCountryName);
                $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue(shipperData[0].ShipperCity, shipperData[0].ShipperCityName);
                $("#SHIPPER_MobileNo").val(shipperData[0].ShipperMobile);
                $("#Telex").val(shipperData[0].Telex);
                //$("#_tempSHIPPER_MobileNo").val(shipperData[0].ShipperMobile);
                $("#SHIPPER_Email").val(shipperData[0].ShipperEMail);

                //$("#SHIPPER_MobileNo").data("kendoNumericTextBox").value(parseFloat(resItem.DeclaredCarriagevalue).toFixed(2));
                //$("#DeclaredCustomValue").data("kendoNumericTextBox").value(parseFloat(resItem.DeclaredCustomValue).toFixed(2));
                //$("#_tempDeclaredCustomValue").val(parseFloat(resItem.DeclaredCustomValue).toFixed(2));
                //$("#_tempDeclaredCarriagevalue").val(parseFloat(resItem.DeclaredCarriagevalue).toFixed(2));
            }
            if (consigneeData.length == 1) {

                //  alert(JSON.stringify(consigneeData[0]));
                $("#CONSIGNEE_AccountNo").val(consigneeData[0].SNo);
                $("#Text_CONSIGNEE_AccountNo").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeAccountNo, consigneeData[0].CustomerNo);
                // $("#Text_CONSIGNEE_AccountNoName").data("kendoAutoComplete").setDefaultValue(consigneeData[0].CustomerSNo, consigneeData[0].ConsigneeName);
                $("#CONSIGNEE_AccountNoName").val(consigneeData[0].ConsigneeName);
                $("#CONSIGNEE_AccountNoName1").val(consigneeData[0].ConsigneeName1);
                $("#CONSIGNEE_Street").val(consigneeData[0].ConsigneeStreet);
                $("#CONSIGNEE_Street1").val(consigneeData[0].ConsigneeStreet1);
                $("#CONSIGNEE_TownLocation").val(consigneeData[0].ConsigneeLocation);
                $("#CONSIGNEE_State").val(consigneeData[0].ConsigneeState);
                // $("#CONSIGNEE_PostalCode").data("kendoNumericTextBox").value(parseFloat(shipperData[0].ShipperPostalCode).toFixed(2));
                $("#CONSIGNEE_PostalCode").val(consigneeData[0].ConsigneePostalCode);
                $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCity, consigneeData[0].ConsigneeCityName);
                $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue(consigneeData[0].ConsigneeCountryCode, consigneeData[0].ConsigneeCountryName);
                $("#CONSIGNEE_MobileNo").val(consigneeData[0].ConsigneeMobile);
                $("#Consignee_Telex").val(consigneeData[0].ConsigneeTelex);
                // $("#_tempCONSIGNEE_MobileNo").val(consigneeData[0].ConsigneeMobile);
                $("#CONSIGNEE_Email").val(consigneeData[0].ConsigneeEMail);

            }
            if (shipperData.length == 0) {
                $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue(CountryandCity[0].ShipperCountryCode, CountryandCity[0].ShipperCountryName);
                $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue(CountryandCity[0].ShipperCity, CountryandCity[0].ShipperCityName);
            }
            CheckSpaceInString("Telex");
            CheckSpaceInString("Consignee_Telex");
            AllowedSpecialChar("SHIPPER_Name");
            AllowedSpecialChar("SHIPPER_Name1");
            AllowedSpecialChar("SHIPPER_Street");
            AllowedSpecialChar("SHIPPER_Street1");
            AllowedSpecialChar("SHIPPER_TownLocation");
            AllowedSpecialChar("SHIPPER_State");

            AllowedSpecialChar("CONSIGNEE_AccountNoName");
            AllowedSpecialChar("CONSIGNEE_AccountNoName1");
            AllowedSpecialChar("CONSIGNEE_Street");
            AllowedSpecialChar("CONSIGNEE_Street1");
            AllowedSpecialChar("CONSIGNEE_TownLocation");
            AllowedSpecialChar("CONSIGNEE_State");
            $("#Consignee_Telex").attr("class", "k-input");
            $("#Telex").attr("class", "k-input");

            //AllowedSpecialChar("CONSIGNEE_Email");
            //AllowedSpecialChar("SHIPPER_Email");

            $("div[id='__divslicustomer__']").find(":input").css("text-transform", "uppercase");
            $("input[name=CONSIGNEE_MobileNo]").keypress(function (evt) {

                var theEvent = evt || window.event;
                var key = theEvent.keyCode || theEvent.which;
                key = String.fromCharCode(key);
                var regex = /^[0-9]{0,9}$/;    // allow only numbers [0-9] 
                if (!regex.test(key)) {
                    theEvent.returnValue = false;
                    if (theEvent.preventDefault) theEvent.preventDefault();
                }

            });
            //$("input[name=Consignee_Telex]").keypress(function (evt) {

            //    var theEvent = evt || window.event;
            //    var key = theEvent.keyCode || theEvent.which;
            //    key = String.fromCharCode(key);
            //    var regex = /^[0-9]{0,9}$/;    // allow only numbers [0-9] 
            //    if (!regex.test(key)) {
            //        theEvent.returnValue = false;
            //        if (theEvent.preventDefault) theEvent.preventDefault();
            //    }

            //});
            $("input[name=SHIPPER_MobileNo]").keypress(function (evt) {

                var theEvent = evt || window.event;
                var key = theEvent.keyCode || theEvent.which;
                key = String.fromCharCode(key);
                var regex = /^[0-9]{0,9}$/;    // allow only numbers [0-9] 
                if (!regex.test(key)) {
                    theEvent.returnValue = false;
                    if (theEvent.preventDefault) theEvent.preventDefault();
                }

            });
            //$("input[name=Telex]").keypress(function (evt) {

            //    var theEvent = evt || window.event;
            //    var key = theEvent.keyCode || theEvent.which;
            //    key = String.fromCharCode(key);
            //    var regex = /^[0-9]{0,9}$/;    // allow only numbers [0-9] 
            //    if (!regex.test(key)) {
            //        theEvent.returnValue = false;
            //        if (theEvent.preventDefault) theEvent.preventDefault();
            //    }

            //});
            $("#__divslicustomer__").keydown(function (event) {
                if (event.ctrlKey == true && (event.which == '118' || event.which == '86')) {
                    event.preventDefault();
                }
            });
            $('#SHIPPER_MobileNo').on("contextmenu", function (e) {
                //alert('Right click disabled');
                return false;
            });
            $('#CONSIGNEE_MobileNo').on("contextmenu", function (e) {
                //alert('Right click disabled');
                return false;
            });
            $("#__divslicustomer__").on('drop', function () {
                return false;
            });
            $("#__divslicustomer__").keydown(function (event) {
                if (event.keyCode == 13) {
                    return false;
                }
            });
            //if (agentData.length == 1) {
            //    $('#AGENT_AccountNo').val(agentData[0].AccountNo);
            //    $('span[id=AGENT_AccountNo]').text(agentData[0].AccountNo);
            //    $('#AGENT_Participant').val(agentData[0].Participant);
            //    $('span[id=AGENT_Participant]').text(agentData[0].Participant);
            //    $('#AGENT_IATACODE').val(agentData[0].IATANo);
            //    $('span[id=AGENT_IATACODE]').text(agentData[0].IATANo);
            //    $('#AGENT_Name').val(agentData[0].AgentName);
            //    $('span[id=AGENT_Name]').text(agentData[0].AgentName);
            //    $('#AGENT_IATACASSADDRESS').val(agentData[0].CASSAddress);
            //    $('span[id=AGENT_IATACASSADDRESS]').text(agentData[0].CASSAddress);
            //    $('#AGENT_PLACE').val(agentData[0].Location);
            //    $('span[id=AGENT_PLACE]').text(agentData[0].Location);
            //}
        },
        error: {

        }
    });
    $('#SHIPPER_Name').focus();//Append by Maneesh on dated= 10-2-17 purpose= SLI-Auto Fill Focus

    //$("input[id='SHIPPER_AccountNo']").unbind("blur").bind("blur", function () {
    //    GetShipperConsigneeDetails('S', currentawbsno);
    //});
    //$("input[id='CONSIGNEE_AccountNo']").unbind("blur").bind("blur", function () {
    //    GetShipperConsigneeDetails('C', currentawbsno);
    //});    

}

//function test(e) { 

//    alert($("#" + e).data("kendoAutoComplete").key());
//}

function ClearShipperConsigneeUI(Utype) {
    if (Utype == "S") {

        //  $("#Text_SHIPPER_Name").data("kendoAutoComplete").key("");
        $("#Text_SHIPPER_Name").val("");
        $("#SHIPPER_Name").val("");
        $("#SHIPPER_Street").val("");
        $("#SHIPPER_TownLocation").val("");
        $("#SHIPPER_State").val("");
        $("#SHIPPER_PostalCode").val("");
        $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").key("");
        $("#Text_SHIPPER_City").data("kendoAutoComplete").key("");
        $("#Text_SHIPPER_CountryCode").val("");
        $("#Text_SHIPPER_City").val("");
        $("#SHIPPER_MobileNo").val("");
        $("#SHIPPER_Email").val("");
    }
    else if (Utype == "C") {
        //   $("#Text_CONSIGNEE_AccountNoName").data("kendoAutoComplete").key("");
        $("#Text_CONSIGNEE_AccountNoName").val("");
        $("#CONSIGNEE_AccountNoName").val("");
        $("#CONSIGNEE_Street").val("");
        $("#CONSIGNEE_TownLocation").val("");
        $("#CONSIGNEE_State").val("");
        $("#CONSIGNEE_PostalCode").val("");
        $("#Text_CONSIGNEE_City").data("kendoAutoComplete").key("");
        $("#Text_CONSIGNEE_City").val("");
        $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").key("");
        $("#Text_CONSIGNEE_CountryCode").val("");
        $("#CONSIGNEE_MobileNo").val("");
        $("#CONSIGNEE_Email").val("");
    }
}

function GetShipperConsigneeDetails(e) {

    var UserTyp = (e == "Text_SHIPPER_AccountNo") ? "S" : "C";
    var FieldType = "AC";

    if ($("#" + e).data("kendoAutoComplete").key() != "") {

        $.ajax({
            url: "Services/Shipment/SLInfoService.svc/GetShipperConsigneeDetails?UserType=" + UserTyp + "&FieldType=" + FieldType + "&SNO=" + $("#" + e).data("kendoAutoComplete").key(), async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var shipperConsigneeData = Data.Table0;
                ClearShipperConsigneeUI(UserTyp);
                if (shipperConsigneeData.length == 1) {
                    if (UserTyp == "S") {
                        // alert(JSON.stringify(shipperConsigneeData));
                        // $("#Text_SHIPPER_Name").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ShipperName, shipperConsigneeData[0].ShipperName);
                        $("#SHIPPER_Name").val(shipperConsigneeData[0].ShipperName);
                        $("#SHIPPER_Name1").val(shipperConsigneeData[0].Name2);
                        $("#SHIPPER_Street").val(shipperConsigneeData[0].ShipperStreet);
                        $("#SHIPPER_Street1").val(shipperConsigneeData[0].Address2);
                        $("#SHIPPER_TownLocation").val(shipperConsigneeData[0].ShipperLocation);
                        $("#SHIPPER_State").val(shipperConsigneeData[0].ShipperState);
                        $("#SHIPPER_PostalCode").val(shipperConsigneeData[0].ShipperPostalCode);
                        $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ShipperCountryCode, shipperConsigneeData[0].CountryCode + '-' + shipperConsigneeData[0].ShipperCountryName);
                        $("#Text_SHIPPER_City").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ShipperCity, shipperConsigneeData[0].CityCode + '-' + shipperConsigneeData[0].ShipperCityName);
                        $("#SHIPPER_MobileNo").val(shipperConsigneeData[0].ShipperMobile);
                        $("#Telex").val(shipperConsigneeData[0].Telex);
                        $("#_tempSHIPPER_MobileNo").val(shipperConsigneeData[0].ShipperMobile);
                        // $("#_tempSHIPPER_MobileNo").val(shipperData[0].ShipperMobile);
                        $("#SHIPPER_Email").val(shipperConsigneeData[0].ShipperEMail);
                    }
                    else if (UserTyp == "C") {
                        //  $("#Text_CONSIGNEE_AccountNoName").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ConsigneeName, shipperConsigneeData[0].ConsigneeName);
                        $("#CONSIGNEE_AccountNoName").val(shipperConsigneeData[0].ConsigneeName);
                        $("#CONSIGNEE_AccountNoName1").val(shipperConsigneeData[0].Name2);
                        $("#CONSIGNEE_Street").val(shipperConsigneeData[0].ConsigneeStreet);
                        $("#CONSIGNEE_Street1").val(shipperConsigneeData[0].Address2);
                        $("#CONSIGNEE_TownLocation").val(shipperConsigneeData[0].ConsigneeLocation);
                        $("#CONSIGNEE_State").val(shipperConsigneeData[0].ConsigneeState);
                        $("#CONSIGNEE_PostalCode").val(shipperConsigneeData[0].ConsigneePostalCode);
                        $("#Text_CONSIGNEE_City").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ConsigneeCity, shipperConsigneeData[0].CityCode + '-' + shipperConsigneeData[0].ConsigneeCityName);
                        $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").setDefaultValue(shipperConsigneeData[0].ConsigneeCountryCode, shipperConsigneeData[0].CountryCode + '-' + shipperConsigneeData[0].ConsigneeCountryName);
                        $("#CONSIGNEE_MobileNo").val(shipperConsigneeData[0].ConsigneeMobile);
                        $("#_tempCONSIGNEE_MobileNo").val(shipperConsigneeData[0].ConsigneeMobile);
                        $("#Consignee_Telex").val(shipperConsigneeData[0].Telex);
                        $("#CONSIGNEE_Email").val(shipperConsigneeData[0].ConsigneeEMail);
                    }

                }

            },
            error: {

            }
        });
    }

}
//function SetTotalPcs() {Text_AirlineSNo
//    var totalPcs = parseInt($("#tdPcs").html());
//    var addedPcs = 0;
//    var remainingPcs = totalPcs - addedPcs;
//    $("input[id='RemainingPieces']").val(remainingPcs);
//    $("span[id='RemainingPieces']").html(remainingPcs);

//    $("input[id='Added']").val(addedPcs);
//    $("span[id='Added").html(addedPcs);

//    $("input[id='TotalPieces']").val(totalPcs);
//    $("span[id='TotalPieces']").html(totalPcs);

//}

function fn_SLIDetails(e) {
    GetSLIAWBDetails($(e).attr('id'));
    // $('#Text_AirlineSNo').first().focus();
    //$('#AirlineSNo').first().focus();
}

function fn_CheckNum1() {
}

function fn_CheckNum(input) {
    var flag = true;
    var str = $(input).val();
    // alert(str);
    $.each(str, function (e) {
        var n = str.charCodeAt(e);
        if ((n < 48) || (n > 57))
            flag = false
    });
    return flag;
}
function BindSLIUnloading() {
    //SetTotalPcs();
    $.ajax({
        url: "Services/Shipment/SLInfoService.svc/GetSLIUnloadingDetails?SLISNo=" + currentslisno, async: false, type: "get", dataType: "json", cache: false,
        //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
        data: JSON.stringify({ SLISNO: currentslisno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            // alert('Test');
            var Data = jQuery.parseJSON(result);
            var UnloadingArray = Data.Table0;
            var FinalDisabled = Data.Table1;
            //  alert(JSON.stringify(UnloadingArray));
            cfi.makeTrans("sli_sliunloading", null, null, null, null, null, UnloadingArray);
            $('#btnSave').text('Approve');
            $('#btnSaveToNext').text('Approve and Next');
            $("div[id$='divareaTrans_sli_sliunloading']").find("[id^='areaTrans_sli_sliunloading']").each(function () {
                var chk = $(this).find("input[type='checkbox']");
                chk.attr("checked", (chk.val() == 1))

                $(this).find("input[id='StartTime']").val(UnloadingArray[0].starttime);
                $(this).find("input[id='EndTime']").val(UnloadingArray[0].endtime);
                $(this).find("span[id='StartTime']").text(UnloadingArray[0].starttime);
                $(this).find("span[id='EndTime']").text(UnloadingArray[0].endtime);

            });
            $('#divareaTrans_sli_sliunloading table tr:eq(2) td:last').text("");
            //  $('#divareaTrans_sli_sliunloading table tr:eq(2) td:last').after("<td class=IsFinal> ABC</td>");
            if (IsFinalSLI == false) {
                $('#divareaTrans_sli_sliunloading table tr:eq(1) th:last').append("<span class=IsFinal style='padding-left:500px;padding-top:10px;'>" + SLICaption + " Type  <input type='radio' name='Final' value='0'  checked='checked'> Part  <input type='radio' name='Final' value='1'> Final</span>");
            }
            if (parseInt(FinalDisabled[0].IsFinalDisabled) > 0) {
                $('input:radio[name=Final][value=1]').attr("disabled", false)
            }
            else {
                $('input:radio[name=Final][value=1]').attr("disabled", true)
            }

            //$('#divareaTrans_sli_sliunloading table tr:eq(1) th:last').find("input[name='Final']").attr("checked", "checked");

            $('#divareaTrans_sli_sliunloading table tr[id^="areaTrans_sli_sliunloading"]').each(function (row, tr) {
                $(tr).find('td:last div').remove();
            });
            $("#__divslicharges__").keydown(function (event) {
                if (event.keyCode == 13) {
                    return false;
                }
            });
        },
        error: {

        }
    });
}



//function GetBaseUnit()
function CheckServiceValidate(e) {
    var vflag = false;
    // alert(e)
    //  alert($("#" + e).data("kendoAutoComplete").key());
    $("div[id$='divareaTrans_sli_slicharges']").find("[id^='areaTrans_sli_slicharges']").each(function () {
        $(this).find("input[id^='ServiceName']").each(function () {
            //   alert(('Text_' + $(this).attr('name')));
            if (e != ('Text_' + $(this).attr('name'))) {
                if ($(this).val() == $("#" + e).data("kendoAutoComplete").key())
                    vflag = true;
            }
        });
        // CheckServiceValidate(this);
        //$(this).find("td[id^=transAction]").find("i[title='Delete']").unbind("click").bind("click", function (e) {
        //    fn_CheckServiceValidate(this);
        //});
    });
    if (vflag) {
        $('#' + e).data("kendoAutoComplete").setDefaultValue(0, '');
        ShowMessage('warning', 'Warning - ' + SLICaption + '', "Already Selected", "bottom-right");
    }
    fun_CheckChargeBassis(e);
    //$('#Text_ServiceName').val().split('[')[1].replace(']', '').split('-').length
}
function checkonRemoveCharges(input) {
    //debugger
    // input.find("input[id*=Text_ServiceName]")
    if (input.find("input[id*=Text_ServiceName]").val() != "") {
        if (input.find("input[id*=Text_ServiceName]").val().split('[')[1].replace(']', '').split('-').length > 1) {

            var arr = $(input).val().split("[")[1].replace("]", "").split("-");

            $(input).closest('tr').find("input[id^='SecondaryValue']").show();
            $(input).closest('tr').find("input[id^='_tempSecondaryValue']").hide();
            // $(input).closest('tr').find("input[id^='SecondaryValue']").show();
            $(input).closest('tr').find("span[id='service1']").text("");
            $(input).closest('tr').find("span[id='service2']").text("");
            //$("#service1").text("");
            //$("#service2").text("");
            $(input).closest('tr').find("input[id^='SecondaryValue']").after("<span id='service1'> (" + arr[1].toUpperCase() + ")</span>");
            $(input).closest('tr').find("input[id^='PrimaryValue']").after("<span id='service2'> (" + arr[0].toUpperCase() + ")</span>");
            if ($(input).closest('tr').find("input[id^='ServiceName']").val() != "") {
                $(input).closest('tr').find("input[id^='PrimaryValue']").attr("data-valid", "min[1],required");
                $(input).closest('tr').find("input[id^='SecondaryValue']").attr("data-valid", "min[1],required");
            }


        }
        else {
            if ($(input).closest('tr').find("input[id^='ServiceName']").val() != "") {
                $(input).closest('tr').find("input[id^='PrimaryValue']").attr("data-valid", "min[1],required");
            }
            $(input).closest('tr').find("input[id^='SecondaryValue']").removeAttr("data-valid");
            $(input).closest('tr').find("input[id^='_tempSecondaryValue']").hide();
            $(input).closest('tr').find("input[id^='SecondaryValue']").hide();
            if ($(input).val().split('[')[1].replace(']', '').split('-').length == 1) {
                var arr = $(input).val().split("[")[1].replace("]", "");
                $(input).closest('tr').find("span[id='service2']").text("");
                $(input).closest('tr').find("span[id='service1']").text("");
                $(input).closest('tr').find("input[id^='PrimaryValue']").after("<span id='service2'> (" + arr.toUpperCase() + ")</span>");
            }
        }
    }
    else {
        if ($(input).closest('tr').find("input[id^='ServiceName']").val() != "") {
            $(input).closest('tr').find("input[id^='PrimaryValue']").attr("data-valid", "min[1],required");
        }
        $(input).closest('tr').find("input[id^='SecondaryValue']").removeAttr("data-valid");
        $(input).closest('tr').find("input[id^='SecondaryValue'],input[id^='_tempSecondaryValue']").val('').hide();
        $(input).closest('tr').find("input[id^='_tempSecondaryValue']").hide();
        $(input).closest('tr').find("input[id^='SecondaryValue']").hide();
        $(input).closest('tr').find("input[id^='SecondaryValue']").removeAttr("data-valid");
    }
}


function fun_CheckChargeBassis(input) {
    // debugger
    input = '#' + input;
    if ($(input).val() != "") {
        if ($(input).val().split('[')[1].replace(']', '').split('-').length > 1) {

            var arr = $(input).val().split("[")[1].replace("]", "").split("-");

            $(input).closest('tr').find("input[id^='SecondaryValue']").show();
            $(input).closest('tr').find("input[id^='_tempSecondaryValue']").hide();
            // $(input).closest('tr').find("input[id^='_tempSecondaryValue']").hide();
            //$(input).closest('tr').find("input[id^='SecondaryValue']").show();
            $(input).closest('tr').find("span[id='service1']").text("");
            $(input).closest('tr').find("span[id='service2']").text("");
            //$("#service1").text("");
            //$("#service2").text("");
            $(input).closest('tr').find("input[id^='SecondaryValue']").after("<span id='service1'> (" + arr[1].toUpperCase() + ")</span>");
            $(input).closest('tr').find("input[id^='PrimaryValue']").after("<span id='service2'> (" + arr[0].toUpperCase() + ")</span>");


            if ($(input).closest('tr').find("input[id^='ServiceName']").val() != "") {
                $(input).closest('tr').find("input[id^='PrimaryValue']").attr("data-valid", "min[1],required");
                $(input).closest('tr').find("input[id^='SecondaryValue']").attr("data-valid", "min[1],required");
            }

        }
        else {
            if ($(input).closest('tr').find("input[id^='ServiceName']").val() != "") {
                $(input).closest('tr').find("input[id^='PrimaryValue']").attr("data-valid", "min[1],required");
            }
            $(input).closest('tr').find("input[id^='SecondaryValue']").removeAttr("data-valid");
            $(input).closest('tr').find("input[id^='_tempSecondaryValue']").hide();
            $(input).closest('tr').find("input[id^='SecondaryValue']").hide();
            if ($(input).val().split('[')[1].replace(']', '').split('-').length == 1) {
                var arr = $(input).val().split("[")[1].replace("]", "");
                $(input).closest('tr').find("span[id='service2']").text("");
                $(input).closest('tr').find("span[id='service1']").text("");
                $(input).closest('tr').find("input[id^='PrimaryValue']").after("<span id='service2'> (" + arr.toUpperCase() + ")</span>");
            }
        }
    }
    else {
        if ($(input).closest('tr').find("input[id^='ServiceName']").val() != "") {
            $(input).closest('tr').find("input[id^='PrimaryValue']").attr("data-valid", "min[1],required");
        }
        $(input).closest('tr').find("input[id^='SecondaryValue']").removeAttr("data-valid");
        $(input).closest('tr').find("input[id^='SecondaryValue'],input[id^='_tempSecondaryValue']").val('').hide();
        $(input).closest('tr').find("input[id^='_tempSecondaryValue']").hide();
        $(input).closest('tr').find("input[id^='SecondaryValue']").hide();
    }
}
//Bind SLi Charges
var AfterFinalCountSinglePart = 0;

function BindSLICharges() {
    //SetTotalPcs();
    $.ajax({
        url: "Services/Shipment/SLInfoService.svc/GetSLIChargesHeader?SLISNo=" + currentslisno, async: false, type: "get", dataType: "json", cache: false,
        //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
        data: JSON.stringify({ SLISNO: currentslisno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Data = jQuery.parseJSON(result);
            var ChargesArray = Data.Table0;
            var CountSinglePart = Data.Table1;
            AfterFinalCountSinglePart = CountSinglePart[0].CountSinglePart;
            //  cfi.AutoComplete("ServiceName", "Code", "vServicesHeader", "ChildSNo", "Code", ["Code", "ChargeName"], CheckServiceValidate, "contains");
            cfi.makeTrans("sli_slicharges", null, null, BindServiceNameAutoComplete, checkonRemoveCharges, null, ChargesArray, null, true);

            $("div[id$='divareaTrans_sli_slicharges']").find("[id^='areaTrans_sli_slicharges']").each(function () {


                if (ChargesArray.length == 0) {
                    $(this).find("input[id^='SLINo']").each(function () {
                        $(this).val(slino);
                    });
                    $(this).find("span[id^='SLINo']").each(function () {
                        $(this).text(slino);
                    });
                }
                $(this).find("input[id^='ServiceName']").each(function () {
                    AutoCompleteForESCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "ChildSNo", "TariffCode", ["TariffSNo", "TariffCode"], CheckServiceValidate, null, null, null, null, "getHandlingChargesIE", "", currentslisno, 0, userContext.CityCode, 0, "", "1", "999999999", "No");
                    //cfi.AutoComplete($(this).attr('name'), "Code,ChargeName", "vServicesHeader", "ChildSNo", "Code", ["Code", "ChargeName"], CheckServiceValidate, "contains");
                    //CheckServiceValidate(this);
                    //$(this).find("td[id^=transAction]").find("i[title='Delete']").unbind("click").bind("click", function (e) {
                    //    return RemoveService($(this));
                    //});

                });
                $(this).find("span[class='k-widget k-combobox k-header']").each(function () {

                    $(this).css('width', '60%');
                });
                fun_CheckChargeBassis($(this).find("input[id^='Text_ServiceName']").attr("id"));
            });
            // fun_CheckChargeBassis("Text_ServiceName");
        }
    });

    $('#Text_ServiceName').focus();//Append by Maneesh on dated= 10-2-17 purpose= SLI-Auto Fill Focus

    $("#__divslicharges__").keydown(function (event) {
        if (event.keyCode == 13) {
            return false;
        }
    });
}


//Remove SHC on Dimension and Check AVI Case
function fn_RemoveRequired(e, input) {
    //debugger;
    var isrequired = 1;
    var sphcCodeSNonew = "";
    try {
        SPHCPharmaCount = 0;
        var sphcCodeSNo = "";
        $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").each(function () {
            sphcCodeSNonew = "";
            if ($(this).find("input[recname=SLISPHCCode]").attr("recname") == "SLISPHCCode") {
                isrequired = 1;
                sphcCodeSNo = $(this).find("input[id^='Multi_SLISPHCCode']").val();
                if (sphcCodeSNo == undefined) {
                    sphcCodeSNo = "";
                }
                if (sphcCodeSNo != "") {
                    sphcCodeSNo = sphcCodeSNo + "," + $(this).find("input[id^='SLISPHCCode']").val();
                }
                if (sphcCodeSNo == "")
                    sphcCodeSNo = $(this).find("input[id^='SLISPHCCode']").val() || $(this).find("input[id^='SLISPHCCode']").val();
                $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").each(function (row, tr) {
                    if ($(tr).find("input[id^='SLISPHCCode']").val() != "") {
                        sphcCodeSNonew = sphcCodeSNo + "," + $(tr).find("input[id^='SLISPHCCode']").val() || $(tr).find("input[id^='Multi_SLISPHCCode']").val();
                    }
                });
                var sphcarr = sphcCodeSNonew.split(",");
                for (var i = 0; i < sphcarr.length; i++) {
                    if (sphcarr[i] == "13") {
                        isrequired = 0;
                    }
                }

                if (sphcCodeSNonew == "") {
                    isrequired = 1;

                }
                if (isrequired == 0) {
                    $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").each(function (row, tr) {
                        $(tr).find("input[id^='Length']").removeAttr("data-valid");
                        // $(this).attr("data-valid", "min[0.01]");
                        $(tr).find("input[id^='_tempLength']").removeAttr("class");
                        $(tr).find("input[id^='_tempLength']").attr("class", "k-formatted-value k-input transSection k-state-default");
                        // Currenttr.find("input[id^='Width']").each(function () {
                        $(tr).find("input[id^='Width']").removeAttr("data-valid");
                        $(tr).find("input[id^='_tempWidth']").removeAttr("class");
                        $(tr).find("input[id^='_tempWidth']").attr("class", "k-formatted-value k-input transSection k-state-default");
                        // $(tr).find("input[id^='Width']").css("border-color", "#dcedf5");
                        // $(this).attr("data-valid", "min[0.01]");
                        //});
                        // Currenttr.find("input[id^='Height']").each(function () {
                        $(tr).find("input[id^='Height']").removeAttr("data-valid");
                        $(tr).find("input[id^='_tempHeight']").removeAttr("class");
                        $(tr).find("input[id^='_tempHeight']").attr("class", "k-formatted-value k-input transSection k-state-default");
                        // $(tr).find("input[id^='Height']").css("border-color", "#dcedf5");
                        //$(this).attr("data-valid", "min[0.01]");   

                        $("div[id$='divareaTrans_sli_slidimension']").find("td[title='Enter Length']").find("font[color='red']").css("color", "white");
                        $("div[id$='divareaTrans_sli_slidimension']").find("td[title='Enter Width']").find("font[color='red']").css("color", "white");
                        $("div[id$='divareaTrans_sli_slidimension']").find("td[title='Enter Height']").find("font[color='red']").css("color", "white");

                    });
                }
                else {
                    if (($("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").find("input[id^='UGrossWeight']").val() == "") || ($("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").find("input[id^='ULDTypeSNo']").val() == "")) {
                        if (($(this).find("input[id^='Pieces']").val() != '') && ($(this).find("input[id^='GrossWeight']").val() != '') && (isBUP == false) && (CustomerTypeCount == 2)) {
                            //debugger;
                            // $(this).find("input[id^='Length']").each(function () {
                            $(this).find("input[id^='Length']").attr("data-valid", "min[0.01],required");
                            // $(this).find("input[id^='Length']").attr("rel", "1");
                            // $(this).attr("data-valid", "min[0.01]");

                            //});
                            //$(this).find("input[id^='Width']").each(function () {
                            $(this).find("input[id^='Width']").attr("data-valid", "min[0.01],required");
                            // $(this).attr("data-valid", "min[0.01]");
                            //});
                            //$(this).find("input[id^='Height']").each(function () {
                            $(this).find("input[id^='Height']").attr("data-valid", "min[0.01],required");
                            // $(this).attr("data-valid", "min[0.01]");
                            //});
                            $("div[id$='divareaTrans_sli_slidimension']").find("td[title='Enter Length']").find("font[color='red']").css("color", "red");
                            $("div[id$='divareaTrans_sli_slidimension']").find("td[title='Enter Width']").find("font[color='red']").css("color", "red");
                            $("div[id$='divareaTrans_sli_slidimension']").find("td[title='Enter Height']").find("font[color='red']").css("color", "red");
                        }
                        if (CustomerTypeCount == 2 && isrequired == 1) {
                            $("div[id$='divareaTrans_sli_slidimension']").find("td[title='Enter Length']").find("font[color='red']").css("color", "red");
                            $("div[id$='divareaTrans_sli_slidimension']").find("td[title='Enter Width']").find("font[color='red']").css("color", "red");
                            $("div[id$='divareaTrans_sli_slidimension']").find("td[title='Enter Height']").find("font[color='red']").css("color", "red");
                        }
                    }
                }


            }
            if (sphcCodeSNo != "") {
                var CompleteRow = $(this);

                $.ajax({
                    url: "Services/Shipment/SLInfoService.svc/GetSLITemperature?sphcCodeSNo=" + sphcCodeSNo, async: false, type: "get", dataType: "json", cache: false,
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        var Data = jQuery.parseJSON(result);
                        var resData = Data.Table0;
                        var SPHCPharmaCounttbl = Data.Table1;
                        var validate = "False";
                        // $(this) = CompleteRow;
                        for (var i = 0; i < resData.length;) {
                            if (resData[i].IsTemperatureControlled == "True") {
                                validate = "True";
                                SPHCPharmaCount = SPHCPharmaCounttbl[0].SPHCPharmaCount;
                            }
                            i++;
                        }
                        if (validate == "True" && CompleteRow.find("input[id^='SLISPHCCode']").val() != "") {
                            if (CompleteRow.find("input[recname=SLISPHCCode]").attr("recname") == "SLISPHCCode") {
                                CompleteRow.attr("Pharma", SPHCPharmaCount);
                                CompleteRow.find("input[id^='StartTemperature']").focus();
                                CompleteRow.find("input[id^='StartTemperature']").attr('required', 'required');
                                CompleteRow.find("input[id^='StartTemperature']").attr('data-valid', 'required');
                                CompleteRow.find("input[id^='EndTemperature']").attr('required', 'required');
                                CompleteRow.find("input[id^='EndTemperature']").attr('data-valid', 'required');
                                CompleteRow.find("input[id^='Capturedtemp']").attr('required', 'required');
                                CompleteRow.find("input[id^='Capturedtemp']").attr('data-valid', 'required');
                                CompleteRow.find("input[id^='StartTemperature']").data("kendoNumericTextBox").enable(true);
                                CompleteRow.find("input[id^='EndTemperature']").data("kendoNumericTextBox").enable(true);
                                CompleteRow.find("input[id^='Capturedtemp']").data("kendoNumericTextBox").enable(true);
                            }

                        }
                        else {
                            if (CompleteRow.find("input[recname=SLISPHCCode]").attr("recname") == "SLISPHCCode") {
                                CompleteRow.attr("Pharma", SPHCPharmaCount);
                                CompleteRow.find("input[id^='StartTemperature']").removeAttr('required', 'required');
                                CompleteRow.find("input[id^='StartTemperature']").removeAttr('data-valid', 'required');
                                CompleteRow.find("input[id^='EndTemperature']").removeAttr('required', 'required');
                                CompleteRow.find("input[id^='EndTemperature']").removeAttr('data-valid', 'required');
                                CompleteRow.find("input[id^='Capturedtemp']").removeAttr('required', 'required');
                                CompleteRow.find("input[id^='Capturedtemp']").removeAttr('data-valid', 'required');

                                CompleteRow.find("input[id^='StartTemperature']").data("kendoNumericTextBox").enable(false);
                                CompleteRow.find("input[id^='EndTemperature']").data("kendoNumericTextBox").enable(false);
                                CompleteRow.find("input[id^='Capturedtemp']").data("kendoNumericTextBox").enable(false);

                                CompleteRow.find("input[id^='_tempStartTemperature']").val("");
                                CompleteRow.find("input[id^='_tempEndTemperature']").val("");
                                CompleteRow.find("input[id^='_tempCapturedtemp']").val("");
                                CompleteRow.find("input[id^='StartTemperature']").val("");
                                CompleteRow.find("input[id^='EndTemperature']").val("");
                                CompleteRow.find("input[id^='Capturedtemp']").val("");

                            }

                        }

                    }
                });

            }
            else {
                if ($(this).find("input[recname=SLISPHCCode]").attr("recname") == "SLISPHCCode") {
                    if ($(this).find("input[id^='Text_SLISPHCCode']").val() == "") {
                        $(this).attr("Pharma", SPHCPharmaCount);
                        $(this).find("input[id^='StartTemperature']").data("kendoNumericTextBox").enable(false);
                        $(this).find("input[id^='EndTemperature']").data("kendoNumericTextBox").enable(false);
                        $(this).find("input[id^='Capturedtemp']").data("kendoNumericTextBox").enable(false);
                        $(this).find("input[id^='_tempStartTemperature']").val("");
                        $(this).find("input[id^='_tempEndTemperature']").val("");
                        $(this).find("input[id^='_tempCapturedtemp']").val("");
                        $(this).find("input[id^='StartTemperature']").val("");
                        $(this).find("input[id^='EndTemperature']").val("");
                        $(this).find("input[id^='Capturedtemp']").val("");

                    }
                }

            }
            //if (sphcCodeSNo == "") {
            //    Currenttr.find("input[id^='StartTemperature']").val("");
            //    Currenttr.find("input[id^='EndTemperature']").val("");
            //    Currenttr.find("input[id^='Capturedtemp']").val("");
            //    Currenttr.find("input[id^='_tempStartTemperature']").val("");
            //    Currenttr.find("input[id^='_tempEndTemperature']").val("");
            //    Currenttr.find("input[id^='_tempCapturedtemp']").val("");

            //}
            //fn_CheckRange("#" + $(this).find("[id^='StartTemperature']").attr("id"));
            //fn_CheckRangeEnd("#" + $(this).find("[id^='EndTemperature']").attr("id"));
            //fn_CheckRangeCaptured("#" + $(this).find("[id^='Capturedtemp']").attr("id"));
        });
        $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").each(function () {
            sphcCodeSNonew = "";
            if ($(this).find("input[recname=ULDSPHCCode]").attr("recname") == "ULDSPHCCode") {

                if ($(this).attr("rel") == $(this).prev().attr("linkuld")) {
                    if ($(this).attr("rel") != undefined) {
                        var ClosestTr = $(this);

                        ClosestTr.find("input[id^='Multi_ULDSPHCCode']").val("");
                        ClosestTr.find("input[id^='ULDSPHCCode']").val("");
                        ClosestTr.find("input[id^='divMultiULDSPHCCode']").remove();
                    }
                }

                //if ($(this).find("input[id^='Multi_ULDSPHCCode']").val() != $(this).find("input[id^='ULDSPHCCode']").val()) {
                if ($(this).attr("rel") == undefined) {
                    isrequired = 1;
                    sphcCodeSNo = $(this).find("input[id^='Multi_ULDSPHCCode']").val();
                    if (sphcCodeSNo == undefined) {
                        sphcCodeSNo = "";
                    }
                    if (sphcCodeSNo != "") {
                        sphcCodeSNo = sphcCodeSNo + "," + $(this).find("input[id^='ULDSPHCCode']").val();
                    }
                    if (sphcCodeSNo == "") {
                        sphcCodeSNo = $(this).find("input[id^='ULDSPHCCode']").val() || $(this).find("input[id^='ULDSPHCCode']").val();
                    }
                    else {
                        sphcCodeSNo = $(this).find("input[id^='Multi_ULDSPHCCode']").val() || $(this).find("input[id^='ULDSPHCCode']").val();
                    }
                    if (sphcCodeSNo == "") {
                        isrequired = 1;

                    }
                    var rel = $(this).attr("rel");
                    if (rel != undefined) {
                        $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").each(function (row, tr) {
                            if ($(tr).attr("linkuld") == rel) {
                                if ($(tr).attr("rel") == undefined) {
                                    sphcCodeSNonew = $(tr).find("input[id^='ULDSPHCCode']").val() || $(tr).find("input[id^='Multi_ULDSPHCCode']").val();
                                }
                            }
                        });
                    }
                    var sphcarr = sphcCodeSNonew.split(",");
                    for (var i = 0; i < sphcarr.length; i++) {
                        if (sphcarr[i] == "13") {
                            isrequired = 0;
                        }
                    }

                    if (isrequired == 0) {
                        // $(this).find("input[id^='ULDLength']").each(function () {
                        $(this).find("input[id^='ULDLength']").removeAttr("data-valid");
                        // $(this).attr("data-valid", "min[0.01]");
                        // });
                        //$(this).find("input[id^='ULDWidth']").each(function () {
                        $(this).find("input[id^='ULDWidth']").removeAttr("data-valid");
                        // $(this).attr("data-valid", "min[0.01]");
                        // });
                        //  $(this).find("input[id^='ULDHeight']").each(function () {
                        $(this).find("input[id^='ULDHeight']").removeAttr("data-valid");
                        // $(this).attr("data-valid", "min[0.01]");
                        // });
                    }
                    else {
                        if (($(this).find("input[id^='SLACPieces']").val() != '') && ($(this).find("input[id^='UldPieces']").val() != '')) {
                            // $(this).find("input[id^='ULDLength']").each(function () {
                            $(this).find("input[id^='ULDLength']").attr("data-valid", "min[0.01]");
                            // $(this).attr("data-valid", "min[0.01]");
                            //});
                            // $(this).find("input[id^='ULDWidth']").each(function () {
                            $(this).find("input[id^='ULDWidth']").attr("data-valid", "min[0.01]");
                            // $(this).attr("data-valid", "min[0.01]");
                            // });
                            //$(this).find("input[id^='ULDHeight']").each(function () {
                            $(this).find("input[id^='ULDHeight']").attr("data-valid", "min[0.01]");
                            // $(this).attr("data-valid", "min[0.01]");
                            //});
                        }
                    }


                }

            }

            // }
            if (sphcCodeSNo != "") {
                var CompleteRow = $(this);
                $.ajax({
                    url: "Services/Shipment/SLInfoService.svc/GetSLITemperature?sphcCodeSNo=" + sphcCodeSNo, async: false, type: "get", dataType: "json", cache: false,
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        var Data = jQuery.parseJSON(result);
                        var resData = Data.Table0;
                        var SPHCPharmaCounttbl = Data.Table1;
                        var validate = "False";
                        for (var i = 0; i < resData.length;) {
                            if (resData[i].IsTemperatureControlled == "True") {
                                validate = "True";

                                SPHCPharmaCount = SPHCPharmaCounttbl[0].SPHCPharmaCount;

                            }
                            i++;
                        }
                        // $(this) = CompleteRow;
                        if (validate == "True") {

                            if (CompleteRow.find("input[recname=ULDSPHCCode]").attr("recname") == "ULDSPHCCode" && CompleteRow.find("input[id^='ULDSPHCCode']").val() != "") {
                                if (CompleteRow.attr("rel") == undefined) {
                                    CompleteRow.attr("Pharma", SPHCPharmaCount);
                                    CompleteRow.find("input[id^='ULDStartTemperature']").focus();
                                    CompleteRow.find("input[id^='ULDStartTemperature']").attr('required', 'required');
                                    CompleteRow.find("input[id^='ULDStartTemperature']").attr('data-valid', 'required');
                                    CompleteRow.find("input[id^='ULDEndTemperature']").attr('required', 'required');
                                    CompleteRow.find("input[id^='ULDEndTemperature']").attr('data-valid', 'required');
                                    CompleteRow.find("input[id^='ULDCapturedtemp']").attr('required', 'required');
                                    CompleteRow.find("input[id^='ULDCapturedtemp']").attr('data-valid', 'required');
                                    CompleteRow.find("input[id^='ULDStartTemperature']").data("kendoNumericTextBox").enable(true);
                                    CompleteRow.find("input[id^='ULDEndTemperature']").data("kendoNumericTextBox").enable(true);
                                    CompleteRow.find("input[id^='ULDCapturedtemp']").data("kendoNumericTextBox").enable(true);
                                }
                                if (CompleteRow.attr("rel") != undefined) {
                                    CompleteRow.attr("Pharma", SPHCPharmaCount);
                                    CompleteRow.find("input[id^='ULDStartTemperature']").removeAttr('required', 'required');
                                    CompleteRow.find("input[id^='ULDStartTemperature']").removeAttr('data-valid', 'required');
                                    CompleteRow.find("input[id^='ULDEndTemperature']").removeAttr('required', 'required');
                                    CompleteRow.find("input[id^='ULDEndTemperature']").removeAttr('data-valid', 'required');
                                    CompleteRow.find("input[id^='ULDCapturedtemp']").removeAttr('required', 'required');
                                    CompleteRow.find("input[id^='ULDCapturedtemp']").removeAttr('data-valid', 'required');

                                    //CompleteRow.find("input[id^='ULDStartTemperature']").data("kendoNumericTextBox").enable(false);
                                    //CompleteRow.find("input[id^='ULDEndTemperature']").data("kendoNumericTextBox").enable(false);
                                    //CompleteRow.find("input[id^='ULDCapturedtemp']").data("kendoNumericTextBox").enable(false);
                                    CompleteRow.find("input[id^='_tempULDStartTemperature']").val("");
                                    CompleteRow.find("input[id^='_tempULDEndTemperature']").val("");
                                    CompleteRow.find("input[id^='_tempULDCapturedtemp']").val("");
                                    CompleteRow.find("input[id^='ULDStartTemperature']").val("");
                                    CompleteRow.find("input[id^='ULDEndTemperature']").val("");
                                    CompleteRow.find("input[id^='ULDCapturedtemp']").val("");
                                }
                            }
                        }
                        else {

                            if (CompleteRow.find("input[recname=ULDSPHCCode]").attr("recname") == "ULDSPHCCode") {
                                CompleteRow.attr("Pharma", SPHCPharmaCount);
                                CompleteRow.find("input[id^='ULDStartTemperature']").removeAttr('required', 'required');
                                CompleteRow.find("input[id^='ULDStartTemperature']").removeAttr('data-valid', 'required');
                                CompleteRow.find("input[id^='ULDEndTemperature']").removeAttr('required', 'required');
                                CompleteRow.find("input[id^='ULDEndTemperature']").removeAttr('data-valid', 'required');
                                CompleteRow.find("input[id^='ULDCapturedtemp']").removeAttr('required', 'required');
                                CompleteRow.find("input[id^='ULDCapturedtemp']").removeAttr('data-valid', 'required');
                                if (CompleteRow.attr("rel") == undefined) {
                                    CompleteRow.find("input[id^='ULDStartTemperature']").data("kendoNumericTextBox").enable(false);
                                    CompleteRow.find("input[id^='ULDEndTemperature']").data("kendoNumericTextBox").enable(false);
                                    CompleteRow.find("input[id^='ULDCapturedtemp']").data("kendoNumericTextBox").enable(false);
                                }
                                CompleteRow.find("input[id^='_tempULDStartTemperature']").val("");
                                CompleteRow.find("input[id^='_tempULDEndTemperature']").val("");
                                CompleteRow.find("input[id^='_tempULDCapturedtemp']").val("");
                                CompleteRow.find("input[id^='ULDStartTemperature']").val("");
                                CompleteRow.find("input[id^='ULDEndTemperature']").val("");
                                CompleteRow.find("input[id^='ULDCapturedtemp']").val("");
                            }
                        }

                    }
                });

            }
            else {

                if ($(this).find("input[recname=ULDSPHCCode]").attr("recname") == "ULDSPHCCode") {
                    if ($(this).find("input[id^='Text_ULDSPHCCode']").val() == "") {
                        if ($(this).attr("rel") == undefined) {
                            $(this).find("input[id^='ULDStartTemperature']").data("kendoNumericTextBox").enable(false);
                            $(this).find("input[id^='ULDEndTemperature']").data("kendoNumericTextBox").enable(false);
                            $(this).find("input[id^='ULDCapturedtemp']").data("kendoNumericTextBox").enable(false);
                        }
                        $(this).attr("Pharma", SPHCPharmaCount);
                        $(this).find("input[id^='_tempULDStartTemperature']").val("");
                        $(this).find("input[id^='_tempULDEndTemperature']").val("");
                        $(this).find("input[id^='_tempULDCapturedtemp']").val("");
                        $(this).find("input[id^='ULDStartTemperature']").val("");
                        $(this).find("input[id^='ULDEndTemperature']").val("");
                        $(this).find("input[id^='ULDCapturedtemp']").val("");
                    }
                }
            }
            //if (sphcCodeSNo == "") {
            //    $(this).find("input[id^='ULDStartTemperature']").val("");
            //    $(this).find("input[id^='ULDEndTemperature']").val("");
            //    $(this).find("input[id^='ULDCapturedtemp']").val("");
            //    $(this).find("input[id^='_tempULDStartTemperature']").val("");
            //    $(this).find("input[id^='_tempULDEndTemperature']").val("");
            //    $(this).find("input[id^='_tempULDCapturedtemp']").val("");

            //}
            //fn_CheckRange("#" + $(this).find("[id^='ULDStartTemperature']").attr("id"));
            //fn_CheckRangeEnd("#" + $(this).find("[id^='ULDEndTemperature']").attr("id"));
            //fn_CheckRangeCaptured("#" + $(this).find("[id^='ULDCapturedtemp']").attr("id"));
        });
        //if ($("#" + input).closest("tr").find("input[recname=SLISPHCCode]").attr("recname") == "SLISPHCCode") {
        //    var Currenttr = $("#" + input).closest("tr");
        //    if (Currenttr.find("input[id^='SLISPHCCode']").val() != "") {
        //        Currenttr.find("input[id^='StartTemperature']").attr('required', 'required');
        //        Currenttr.find("input[id^='StartTemperature']").attr('data-valid', 'required');

        //        Currenttr.find("input[id^='EndTemperature']").attr('required', 'required');
        //        Currenttr.find("input[id^='EndTemperature']").attr('data-valid', 'required');
        //        Currenttr.find("input[id^='Capturedtemp']").attr('required', 'required');
        //        Currenttr.find("input[id^='Capturedtemp']").attr('data-valid', 'required');
        //    }
        //    else {
        //        Currenttr.find("input[id^='StartTemperature']").removeAttr('required', 'required');
        //        Currenttr.find("input[id^='StartTemperature']").removeAttr('data-valid', 'required');
        //        Currenttr.find("input[id^='StartTemperature']").css('border-color', 'blue');
        //        Currenttr.find("input[id^='EndTemperature']").removeAttr('required', 'required');
        //        Currenttr.find("input[id^='EndTemperature']").removeAttr('data-valid', 'required');
        //        Currenttr.find("input[id^='Capturedtemp']").removeAttr('required', 'required');
        //        Currenttr.find("input[id^='Capturedtemp']").removeAttr('data-valid', 'required');

        //    }
        //}
        //else {
        //    if ($("#" + input).closest("tr").find("input[recname=ULDSPHCCode]").attr("recname") == "ULDSPHCCode") {
        //        var Currenttr = $("#" + input).closest("tr");
        //        if (Currenttr.find("input[id^='ULDSPHCCode']").val() != "") {
        //            Currenttr.find("input[id^='ULDStartTemperature']").attr('required', 'required');
        //            Currenttr.find("input[id^='ULDStartTemperature']").attr('data-valid', 'required');
        //            Currenttr.find("input[id^='ULDEndTemperature']").attr('required', 'required');
        //            Currenttr.find("input[id^='ULDEndTemperature']").attr('data-valid', 'required');
        //            Currenttr.find("input[id^='ULDCapturedtemp']").attr('required', 'required');
        //            Currenttr.find("input[id^='ULDCapturedtemp']").attr('data-valid', 'required');
        //        }
        //        else {
        //            Currenttr.find("input[id^='ULDStartTemperature']").removeAttr('required', 'required');
        //            Currenttr.find("input[id^='ULDStartTemperature']").removeAttr('data-valid', 'required');
        //            Currenttr.find("input[id^='ULDEndTemperature']").removeAttr('required', 'required');
        //            Currenttr.find("input[id^='ULDEndTemperature']").removeAttr('data-valid', 'required');
        //            Currenttr.find("input[id^='ULDCapturedtemp']").removeAttr('required', 'required');
        //            Currenttr.find("input[id^='ULDCapturedtemp']").removeAttr('data-valid', 'required');

        //        }
        //    }

        //}
        return;
    }

    catch (ex) {
        //debugger;
        return;
    }
    $("#ahref_ClassDetails").removeAttr("style");
}



//function AutoCompleteDeleteCallBack(e, div, textboxid) {
//    debugger
//    var target = e.target; // get current Span.
//    var DivId = div; // get div id.
//    var textboxid = textboxid; // get textbox id.

//    $(target).closest("li").remove();
//    SetRequired(textboxid);
//}

//On select SHC's on DIM then Check all Checkes Range textboxex should be disbaled or enabled.And AVI check also.
var SPHCPharmaCount = 0;
function SetRequired(input) {
    SPHCPharmaCount = 0;
    var sphcCodeSNonew = "";
    var isrequired = 1;
    // debugger;
    try {
        var id = $("#" + input);
        var sphcCodeSNo = "";
        //$("span.k-delete").live("click", function (e) { fn_RemoveRequired(e, id) });
        //for (var i = 0; i < ArrCheckITc.length; i++) {
        //}
        var Currenttr = $("#" + input).closest("tr");
        //fn_CheckRange("#" + Currenttr.find("[id^='StartTemperature']").attr("id"));
        //fn_CheckRangeEnd("#" + Currenttr.find("[id^='EndTemperature']").attr("id"));
        //fn_CheckRangeCaptured("#" + Currenttr.find("[id^='Capturedtemp']").attr("id"));


        if (Currenttr.find("input[recname=SLISPHCCode]").attr("recname") == "SLISPHCCode") {
            isrequired = 1;
            sphcCodeSNo = Currenttr.find("input[id^='Multi_SLISPHCCode']").val();
            if (sphcCodeSNo == undefined) {
                sphcCodeSNo = "";
            }
            if (sphcCodeSNo != "") {
                sphcCodeSNo = sphcCodeSNo + "," + Currenttr.find("input[id^='SLISPHCCode']").val();
            }
            if (sphcCodeSNo == "")
                sphcCodeSNo = Currenttr.find("input[id^='SLISPHCCode']").val() || Currenttr.find("input[id^='SLISPHCCode']").val();

            $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").each(function (row, tr) {
                if ($(tr).find("input[id^='SLISPHCCode']").val() != "") {
                    sphcCodeSNonew = sphcCodeSNo + "," + $(tr).find("input[id^='SLISPHCCode']").val() || $(tr).find("input[id^='Multi_SLISPHCCode']").val();
                }
            });

            var sphcarr = sphcCodeSNonew.split(",");
            for (var i = 0; i < sphcarr.length; i++) {
                if (sphcarr[i] == "13") {
                    isrequired = 0;
                }
            }
            if (sphcCodeSNonew == "") {
                isrequired = 1;

            }
            if (isrequired == 0) {
                $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").each(function (row, tr) {
                    $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").each(function (row, tr) {
                        $(tr).find("input[id^='Length']").removeAttr("data-valid");
                        // $(this).attr("data-valid", "min[0.01]");
                        $(tr).find("input[id^='_tempLength']").removeAttr("class");
                        $(tr).find("input[id^='_tempLength']").attr("class", "k-formatted-value k-input transSection k-state-default");

                        // Currenttr.find("input[id^='Width']").each(function () {
                        $(tr).find("input[id^='Width']").removeAttr("data-valid");
                        $(tr).find("input[id^='_tempWidth']").removeAttr("class");
                        $(tr).find("input[id^='_tempWidth']").attr("class", "k-formatted-value k-input transSection k-state-default");
                        // $(tr).find("input[id^='Width']").css("border-color", "#dcedf5");
                        // $(this).attr("data-valid", "min[0.01]");
                        //});
                        // Currenttr.find("input[id^='Height']").each(function () {
                        $(tr).find("input[id^='Height']").removeAttr("data-valid");
                        $(tr).find("input[id^='_tempHeight']").removeAttr("class");
                        $(tr).find("input[id^='_tempHeight']").attr("class", "k-formatted-value k-input transSection k-state-default");

                        $("div[id$='divareaTrans_sli_slidimension']").find("td[title='Enter Length']").find("font[color='red']").css("color", "white");
                        $("div[id$='divareaTrans_sli_slidimension']").find("td[title='Enter Width']").find("font[color='red']").css("color", "white");
                        $("div[id$='divareaTrans_sli_slidimension']").find("td[title='Enter Height']").find("font[color='red']").css("color", "white");
                    });
                });
            }
            else {
                if (($("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").find("input[id^='UGrossWeight']").val() == "") || ($("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").find("input[id^='ULDTypeSNo']").val() == "")) {
                    if (($(this).find("input[id^='Pieces']").val() != '') && ($(this).find("input[id^='GrossWeight']").val() != '') && (isBUP == false) && (CustomerTypeCount == 2)) {
                        //Currenttr.find("input[id^='Length']").each(function () {
                        Currenttr.find("input[id^='Length']").attr("data-valid", "min[0.01],required");
                        // $(this).attr("data-valid", "min[0.01]");
                        //});
                        // Currenttr.find("input[id^='Width']").each(function () {
                        Currenttr.find("input[id^='Width']").attr("data-valid", "min[0.01],required");
                        // $(this).attr("data-valid", "min[0.01]");
                        // });
                        // Currenttr.find("input[id^='Height']").each(function () {
                        Currenttr.find("input[id^='Height']").attr("data-valid", "min[0.01],required");
                        $("div[id$='divareaTrans_sli_slidimension']").find("td[title='Enter Length']").find("font[color='red']").css("color", "red");
                        $("div[id$='divareaTrans_sli_slidimension']").find("td[title='Enter Width']").find("font[color='red']").css("color", "red");
                        $("div[id$='divareaTrans_sli_slidimension']").find("td[title='Enter Height']").find("font[color='red']").css("color", "red");
                        // $(this).attr("data-valid", "min[0.01]");
                        // });
                    }
                }
            }

        }
        else {
            if (Currenttr.find("input[recname=ULDSPHCCode]").attr("recname") == "ULDSPHCCode") {
                sphcCodeSNonew = "";
                if (Currenttr.attr("rel") == undefined) {
                    isrequired = 1;
                    sphcCodeSNo = Currenttr.find("input[id^='Multi_ULDSPHCCode']").val();
                    if (sphcCodeSNo == undefined) {
                        sphcCodeSNo = "";
                    }
                    if (sphcCodeSNo != "") {
                        sphcCodeSNo = sphcCodeSNo + "," + Currenttr.find("input[id^='ULDSPHCCode']").val();
                    }
                    if (sphcCodeSNo == "") {
                        sphcCodeSNo = Currenttr.find("input[id^='ULDSPHCCode']").val() || Currenttr.find("input[id^='ULDSPHCCode']").val();
                    }
                    var rel = Currenttr.attr("rel");
                    if (rel != undefined) {
                        $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").each(function (row, tr) {
                            if ($(tr).attr("linkuld") == rel) {
                                if ($(tr).attr("rel") == undefined) {
                                    sphcCodeSNonew = $(tr).find("input[id^='ULDSPHCCode']").val() || $(tr).find("input[id^='Multi_ULDSPHCCode']").val();
                                }
                            }
                        });
                    }


                    var sphcarr = sphcCodeSNonew.split(",");
                    for (var i = 0; i < sphcarr.length; i++) {
                        if (sphcarr[i] == "13") {
                            isrequired = 0;
                        }
                    }
                    if (sphcCodeSNonew == "") {
                        isrequired = 1;

                    }
                    if (isrequired == 0) {
                        // Currenttr.find("input[id^='ULDLength']").each(function () {
                        Currenttr.find("input[id^='ULDLength']").removeAttr("data-valid");
                        //$(this).attr("data-valid", "min[0.01]");

                        // });
                        // Currenttr.find("input[id^='ULDWidth']").each(function () {
                        Currenttr.find("input[id^='ULDWidth']").removeAttr("data-valid");
                        //$(this).attr("data-valid", "min[0.01]");
                        //});
                        // Currenttr.find("input[id^='ULDHeight']").each(function () {
                        Currenttr.find("input[id^='ULDHeight']").removeAttr("data-valid");
                        //$(this).attr("data-valid", "min[0.01]");
                        // });
                    }
                    else {
                        if (($(Currenttr).find("input[id^='SLACPieces']").val() != '') && ($(this).find("input[id^='UldPieces']").val() != '')) {
                            //Currenttr.find("input[id^='ULDLength']").each(function () {
                            Currenttr.find("input[id^='ULDLength']").attr("data-valid", "min[0.01]");
                            // $(this).attr("data-valid", "min[0.01]");
                            //});
                            // Currenttr.find("input[id^='ULDWidth']").each(function () {
                            Currenttr.find("input[id^='ULDWidth']").attr("data-valid", "min[0.01]");
                            // $(this).attr("data-valid", "min[0.01]");
                            //});
                            //  Currenttr.find("input[id^='ULDHeight']").each(function () {
                            Currenttr.find("input[id^='ULDHeight']").attr("data-valid", "min[0.01]");
                            // $(this).attr("data-valid", "min[0.01]");
                            //});
                        }
                    }



                }
                //CheckDuplicateULd(id);

            }
        }
        // if (sphcCodeSNo != "") {
        $.ajax({
            url: "Services/Shipment/SLInfoService.svc/GetSLITemperature?sphcCodeSNo=" + sphcCodeSNo, async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                var SPHCPharmaCounttbl = Data.Table1;
                var validate = "False";
                for (var i = 0; i < resData.length;) {
                    if (resData[i].IsTemperatureControlled == "True") {
                        validate = "True";
                        SPHCPharmaCount = SPHCPharmaCounttbl[0].SPHCPharmaCount;
                    }
                    i++;
                }
                var CurrentSHCSNo = Currenttr.find("input[id^='SLISPHCCode']").val() || Currenttr.find("input[id^='ULDSPHCCode']").val();
                $.ajax({
                    url: "Services/Shipment/SLInfoService.svc/CheckSLIPriorApprovalForSHC", async: false, type: "get", dataType: "json", cache: false,
                    data: { SHCSNo: sphcCodeSNo, SLISNo: currentslisno, DestinationAirportSNo: 0 },
                    contentType: "application/json; charset=utf-8",
                    success: function (resultnew) {
                        if (resultnew != null) {
                            var Message = jQuery.parseJSON(resultnew);
                            if (Message.Table0.length > 0) {
                                if (Message.Table0[0].ErrorNo == "3") {
                                    ValidFlag = true;
                                    ShowMessage('warning', 'Warning - ' + SLICaption + '', Message.Table0[0].Message, 'bottom-right');
                                }
                            }
                        }
                    }
                });

                if (validate == "True") {
                    if (Currenttr.find("input[recname=SLISPHCCode]").attr("recname") == "SLISPHCCode" && Currenttr.find("input[id^='SLISPHCCode']").val() != "") {
                        Currenttr.attr("Pharma", SPHCPharmaCount);
                        fn_CheckPharmaSHC("#" + Currenttr.find("input[id^=SLISPHCCode]").attr("id"));
                        Currenttr.find("input[id^='StartTemperature']").focus();
                        Currenttr.find("input[id^='StartTemperature']").attr('required', 'required');
                        Currenttr.find("input[id^='StartTemperature']").attr('data-valid', 'required');
                        Currenttr.find("input[id^='EndTemperature']").attr('required', 'required');
                        Currenttr.find("input[id^='EndTemperature']").attr('data-valid', 'required');
                        Currenttr.find("input[id^='Capturedtemp']").attr('required', 'required');
                        Currenttr.find("input[id^='Capturedtemp']").attr('data-valid', 'required');
                        Currenttr.find("input[id^='StartTemperature']").data("kendoNumericTextBox").enable(true);
                        Currenttr.find("input[id^='EndTemperature']").data("kendoNumericTextBox").enable(true);
                        Currenttr.find("input[id^='Capturedtemp']").data("kendoNumericTextBox").enable(true);
                        //Currenttr.find("input[id^='_tempStartTemperature']").removeAttr("disabled");
                        //Currenttr.find("input[id^='_tempEndTemperature']").removeAttr("disabled");
                        //Currenttr.find("input[id^='_tempCapturedtemp']").removeAttr("disabled");
                        Currenttr.find("input[id^='StartTemperature']").removeAttr("class");
                        Currenttr.find("input[id^='EndTemperature']").removeAttr("class");
                        Currenttr.find("input[id^='Capturedtemp']").removeAttr("class");
                        Currenttr.find("input[id^='StartTemperature']").attr("class", "k-input transSection k-state");
                        Currenttr.find("input[id^='EndTemperature']").attr("class", "k-input transSection k-state");
                        Currenttr.find("input[id^='Capturedtemp']").attr("class", "k-input transSection k-state");
                    }
                    if (Currenttr.find("input[recname=ULDSPHCCode]").attr("recname") == "ULDSPHCCode" && Currenttr.find("input[id^='ULDSPHCCode']").val() != "") {
                        if (Currenttr.attr("rel") == undefined) {
                            Currenttr.attr("Pharma", SPHCPharmaCount);
                            fn_CheckPharmaSHC("#" + Currenttr.find("input[id^=ULDSPHCCode]").attr("id"));
                            Currenttr.find("input[id^='ULDStartTemperature']").focus();
                            Currenttr.find("input[id^='ULDStartTemperature']").attr('required', 'required');
                            Currenttr.find("input[id^='ULDStartTemperature']").attr('data-valid', 'required');
                            Currenttr.find("input[id^='ULDEndTemperature']").attr('required', 'required');
                            Currenttr.find("input[id^='ULDEndTemperature']").attr('data-valid', 'required');
                            Currenttr.find("input[id^='ULDCapturedtemp']").attr('required', 'required');
                            Currenttr.find("input[id^='ULDCapturedtemp']").attr('data-valid', 'required');
                            Currenttr.find("input[id^='ULDStartTemperature']").data("kendoNumericTextBox").enable(true);
                            Currenttr.find("input[id^='ULDEndTemperature']").data("kendoNumericTextBox").enable(true);
                            Currenttr.find("input[id^='ULDCapturedtemp']").data("kendoNumericTextBox").enable(true);
                            Currenttr.find("input[id^='ULDStartTemperature']").removeAttr("class");
                            Currenttr.find("input[id^='ULDEndTemperature']").removeAttr("class");
                            Currenttr.find("input[id^='ULDCapturedtemp']").removeAttr("class");
                            Currenttr.find("input[id^='ULDStartTemperature']").attr("class", "k-input transSection k-state");
                            Currenttr.find("input[id^='ULDEndTemperature']").attr("class", "k-input transSection k-state");
                            Currenttr.find("input[id^='ULDStartTemperature']").attr("class", "k-input transSection k-state");
                        }
                        if (Currenttr.attr("rel") != undefined) {
                            Currenttr.attr("Pharma", SPHCPharmaCount);
                            Currenttr.find("input[id^='StartTemperature']").removeAttr('required', 'required');
                            Currenttr.find("input[id^='StartTemperature']").removeAttr('data-valid', 'required');
                            Currenttr.find("input[id^='EndTemperature']").removeAttr('required', 'required');
                            Currenttr.find("input[id^='EndTemperature']").removeAttr('data-valid', 'required');
                            Currenttr.find("input[id^='Capturedtemp']").removeAttr('required', 'required');
                            Currenttr.find("input[id^='Capturedtemp']").removeAttr('data-valid', 'required');

                            //Currenttr.find("input[id^='StartTemperature']").data("kendoNumericTextBox").enable(false);
                            //Currenttr.find("input[id^='EndTemperature']").data("kendoNumericTextBox").enable(false);
                            //Currenttr.find("input[id^='Capturedtemp']").data("kendoNumericTextBox").enable(false);
                        }

                    }

                }
                else {
                    if (Currenttr.find("input[recname=SLISPHCCode]").attr("recname") == "SLISPHCCode") {
                        Currenttr.attr("Pharma", SPHCPharmaCount);
                        Currenttr.find("input[id^='StartTemperature']").removeAttr('required', 'required');
                        Currenttr.find("input[id^='StartTemperature']").removeAttr('data-valid', 'required');
                        Currenttr.find("input[id^='EndTemperature']").removeAttr('required', 'required');
                        Currenttr.find("input[id^='EndTemperature']").removeAttr('data-valid', 'required');
                        Currenttr.find("input[id^='Capturedtemp']").removeAttr('required', 'required');
                        Currenttr.find("input[id^='Capturedtemp']").removeAttr('data-valid', 'required');
                        if (Currenttr.attr("rel") == undefined) {
                            Currenttr.find("input[id^='StartTemperature']").data("kendoNumericTextBox").enable(false);
                            Currenttr.find("input[id^='EndTemperature']").data("kendoNumericTextBox").enable(false);
                            Currenttr.find("input[id^='Capturedtemp']").data("kendoNumericTextBox").enable(false);
                        }
                    }
                    if (Currenttr.find("input[recname=ULDSPHCCode]").attr("recname") == "ULDSPHCCode") {
                        Currenttr.attr("Pharma", SPHCPharmaCount);
                        Currenttr.find("input[id^='ULDStartTemperature']").removeAttr('required', 'required');
                        Currenttr.find("input[id^='ULDStartTemperature']").removeAttr('data-valid', 'required');
                        Currenttr.find("input[id^='ULDEndTemperature']").removeAttr('required', 'required');
                        Currenttr.find("input[id^='ULDEndTemperature']").removeAttr('data-valid', 'required');
                        Currenttr.find("input[id^='ULDCapturedtemp']").removeAttr('required', 'required');
                        Currenttr.find("input[id^='ULDCapturedtemp']").removeAttr('data-valid', 'required');
                        if (Currenttr.attr("rel") == undefined) {
                            Currenttr.find("input[id^='ULDStartTemperature']").data("kendoNumericTextBox").enable(false);
                            Currenttr.find("input[id^='ULDEndTemperature']").data("kendoNumericTextBox").enable(false);
                            Currenttr.find("input[id^='ULDCapturedtemp']").data("kendoNumericTextBox").enable(false);
                        }
                    }
                }

            }
        });
    }
    catch (ex) {
        //debugger;
    }

    $("#ahref_ClassDetails").removeAttr("style");
}

function BindPackingAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='SLISPHCCode']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "CODE", "SPHC", "SNO", "CODE", ["CODE"], SetRequired, "contains", ",", null, null, null, null, true);
        $(this).css("width", "120px");
    });
    $(elem).find("input[id^='Text_SLISPHCCode']").each(function () {
        $(this).css("width", "120px");
    });
    $(elem).find("input[id^='PackingTypeSNo']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "PackingName", "IrregularityPacking", "SNo", "PackingName", ["PackingName"], null, "contains");
    });

    $(elem).find("input[id^='SLINo']").each(function () {
        $(this).val(slino);
    });
    $(elem).find("span[id^='SLINo']").each(function () {
        $(this).text(slino);
    });
    $(elem).find("a[id^='ahref_SLIEquipment']").unbind("click").bind("click", function () {
        Getequipment(this);
    });
    // if ($(elem))
    //$(elem).find("input[id^='Length']").removeAttr("data-valid");
    //$(elem).find("input[id^='Width']").removeAttr("data-valid");
    //$(elem).find("input[id^='Height']").removeAttr("data-valid");


    //if ($("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").length > 1) {
    //    $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").find("a[id^='ahref_SLIGetWeight']").each(function () {
    //        $(this).css("display", "none");
    //    });
    //}
    //else {
    //    $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").last().find("a[id^='ahref_SLIGetWeight']").css("display", "");
    //}

    //$(elem).find("a[id^='ahref_SLIGetWeight']").css("display", "");
    $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").find("a[id^='ahref_SLIGetWeight']").css("display", "none");
    $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").last().find("a[id^='ahref_SLIGetWeight']").css("display", "");
    //$("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").find("a[id^='ahref_SLIEquipment']").css("display", "none");
    //$("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").last().find("a[id^='ahref_SLIEquipment']").css("display", "");

    $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").last().find("a[id^='ahref_SLIGetWeight']").unbind("click").bind("click", function () {
        GetWeigingWeight(this);
    });
    $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension_']").each(function (row, tr) {
        $(tr).find("input[id^='GrossWeight']").each(function () {
            $(this).removeAttr("data-valid");
            // $(tr).removeAttr("data-valid", "min[0.01]");

        });
        $(tr).find("input[id^='CapturedWeight']").each(function () {
            $(this).removeAttr("data-valid");
            // $(tr).removeAttr("data-valid", "min[0.01]");

        });
    });

    if ($("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension_']").length == 1) {
        $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").each(function () {
            if ($(this).find("input[id^='Pieces']").val() == "" && $(this).find("input[id^='GrossWeight']").val() == "") {
            }


        });
    }
    if (CustomerTypeCount == 2) {
        $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").each(function (row, tr) {
            $(tr).find('input[id^="_tempVolumeWt"]').attr("enabled", false);
            $(tr).find('input[id^="VolumeWt"]').attr("enabled", false);
            $(tr).find('input[id^="_tempVolumeWt"]').attr("disabled", true);
            $(tr).find('input[id^="VolumeWt"]').attr("disabled", true);
        });
    }

    // if ($(elem).find("input[id^='SLISPHCCode']").val() != "") {
    //fn_RemoveRequired();
    //}
    //$(elem).find("input[id^='SLINo']").each(function () {
    //    $('#'+$(this).attr("name")).val(slino);
    //    $("span[id^='SLINo']").text(slino);
    //});
}
function RemoveService(input) {
    //debugger
    var tr = input.closest('tr');
    if (confirm('Are you sure, you wish to remove selected row?')) {
        tr.prev().find("td:last div").append("<i class='btnTrans btnTrans-default icon-trans-plus-sign' title='Add More'></i>");
        $(input).closest('tr').remove();
    }
    $("div[id$='divareaTrans_sli_slicharges']").find("[id^='valueareaTrans_sli_slicharges']").each(function (row, tr) {
        $(tr).find('td:eq(0)').text(row + 1);;
    });
}

/******Add Forget Charges data from Procedure.Start**********/
var dourl = 'Services/AutoCompleteService.svc/SLIESAutoCompleteDataSource';
function GetDataSourceForDOHandlingCharge(textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag) {
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
                    cityChangeFlag: cityChangeFlag
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
function AutoCompleteForESCharge(textId, basedOn, tableName, keyColumn, textColumn, templateColumn, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag) {
    var keyId = textId;
    textId = "Text_" + textId;
    if (!$("#" + textId).data("kendoAutoComplete")) {
        if (IsValid(textId, autoCompleteType)) {
            if (keyColumn == null || keyColumn == undefined)
                keyColumn = basedOn;
            if (textColumn == null || textColumn == undefined)
                textColumn = basedOn;
            var dataSource = GetDataSourceForDOHandlingCharge(textId, tableName, keyColumn, textColumn, templateColumn, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag);
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

function BindServiceNameAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='ServiceName']").each(function () {
        //cfi.AutoComplete($(this).attr("name"), "Code,ChargeName", "vServicesHeader", "ChildSNo", "Code", ["Code", "ChargeName"], CheckServiceValidate, "contains");

        AutoCompleteForESCharge($(this).attr("name"), "TariffSNo,TariffCode,TariffHeadName", null, "ChildSNo", "TariffCode", ["TariffSNo", "TariffCode"], CheckServiceValidate, null, null, null, null, "getHandlingChargesIE", "", currentslisno, 0, userContext.CityCode, 0, "", "1", "999999999", "No");


        if ($(elem).find("input[id^='SecondaryValue'],input[id^='_tempSecondaryValue']").val('').hide() == true) {
            $(elem).find("input[id^='SecondaryValue'],input[id^='_tempSecondaryValue']").val('').hide();
        }
        // CheckServiceValidate(elem);
        //$(elem).find("td[id^=transAction]").find("i[title='Delete']").unbind("click").bind("click", function (e) {
        //    return RemoveService($(this));
        //    //CheckServiceValidate($(this));
        //});

    });

    $(elem).find("span[class='k-widget k-combobox k-header']").each(function () {

        $(this).css('width', '60%');
    });
    $(elem).find("input[id^='SLINo']").each(function () {
        $(this).val(slino);
    });
    $(elem).find("span[id^='SLINo']").each(function () {
        $(this).text(slino);
    });
    if ($("div[id$='divareaTrans_sli_slicharges']").find("[id^='areaTrans_sli_slicharges']").length == 1) {

    }


}
/******Add Forget Charges data from Procedure.End**********/
////

/////

//Check Duplicate Uld's in DIM  
function CheckBULKULDType(e) {
    if ($('#' + e).val().toUpperCase() == "BULK") {
        $('#' + e).closest('tr').find('input[id^="ULDNo"]').val('');
        $('#' + e).closest('tr').find('input[id^="ULDNo"]').attr('disabled', 1);
    }
    else {
        $('#' + e).closest('tr').find('input[id^="ULDNo"]').removeAttr('disabled');
    }
    //Check Duplicate Uld's in DIM 
    CheckDuplicateULd($('#' + e));
}
//var MUnit = "";
//Reset Legth,Width & Height in ULD DIM
function ResetLWH(input) {
    //debugger;
    // MUnit = $("#" + input).val();   
    var currenttr = $("#" + input).closest("tr");
    // if ($("#" + input).val() != "") {
    //if ($("#" + input).data("kendoAutoComplete") != undefined && $("#" + input).data("kendoAutoComplete").key() != "") {
    //    currenttr.find("input[id^='ULDLength']").val("");
    //    currenttr.find("input[id^='_tempULDLength']").val("");
    //    currenttr.find("input[id^='ULDWidth']").val("");
    //    currenttr.find("input[id^='_tempULDWidth']").val("");
    //    currenttr.find("input[id^='ULDHeight']").val("");
    //    currenttr.find("input[id^='_tempULDHeight']").val("");
    //    $("#" + input).data("kendoAutoComplete").key();
    //}
    CalculateULDVolume();
}


function BindULDAutoComplete(elem, mainElem) {
    // debugger;
    var NewULDSPHCId = $(elem).find("div[id^='divMultiULDSPHCCode']").attr("id");
    $(elem).find("input[id^='ULDSPHCCode']").each(function () {
        if (!$("#Text_" + $(this).attr("name")).data("kendoAutoComplete")) {
            cfi.AutoComplete($(this).attr("name"), "CODE", "SPHC", "SNO", "CODE", ["CODE"], SetRequired, "contains", ",", null, null, null, null, true, null
                , true);
        }
        $(this).css("width", "120px");

    });
    $(elem).find("input[id^='ContourCode']").each(function () {
        if (!$("#Text_" + $(this).attr("name")).data("kendoAutoComplete")) {
            cfi.AutoComplete($(this).attr("name"), "ContourCode", "vw_GetSLIContourCodes", "SNO", "ContourCode", ["ContourCode"], GetContour, "contains", null, null, null, null, null, true, null
                , true);
        }
        //$(this).css("width", "100px");

    });


    var getName = $(elem).find("div[id^='divMultiULDSPHCCode']").attr("name");

    //$("#" + NewULDSPHCId + " li").remove();
    $("div[name=" + getName + "][id=" + NewULDSPHCId + "]").remove();


    //$(elem).find("input[id^='ULDPackingTypeSNo']").each(function () {
    //    cfi.AutoComplete($(this).attr("name"), "PackingName", "IrregularityPacking", "SNo", "PackingName", ["PackingName"], null, "contains");
    //});

    $(elem).find("input[id^='Unit']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "UnitCode", "MeasurementUnitCode", "SNo", "UnitCode", ["UnitCode"], ResetLWH, "contains");
        $(elem).find("input[id^='Text_ULDSPHCCode']").each(function () {
            $(this).css("width", "120px");
        });

        $(elem).find("input[id^='Text_Unit']").each(function () {
            $(this).val("CMT");
            $(this).css("width", "50px");
        });
        $(elem).find("input[id^='Unit']").each(function () {
            $(this).val("2");
        });
    });
    $(elem).find("td[id^=transAction]").find("i[title='Delete']").unbind("click").bind("click", function (e) {
        fn_RemoveULDRow(this);
    });
    //$(elem).find("input[id^='ULDNoSNo']").each(function () {
    //    cfi.AutoComplete($(this).attr("name"), "ULDNo", "v_AvailableULD", "SNo", "ULDNo", ["ULDNo"], null, "contains");
    //});
    $(elem).find("input[id^='ULDTypeSNo']").each(function () {
        cfi.AutoComplete($(this).attr("name"), "ULDName", "vwULDTYpeSLI", "SNo", "ULDName", ["ULDName"], CheckBULKULDType, "contains");
        $(this).css("width", "60px");

    });
    $(elem).find("input[id^='SLINo']").each(function () {
        $(this).val(slino);
    });
    $(elem).find("span[id^='SLINo']").each(function () {
        $(this).text(slino);
    });

    //$(elem).find("input[id^=ULDNo]").unbind("keypress").bind("keypress", function () {
    //    ISNumeric(this); 
    //});

    $(elem).find("input[id^='ULDNo']").keydown(function (e) {
        IsNumericNewCheck(e);
    });

    $(elem).find("input[id^='SLACPieces']").keydown(function (e) {
        IsNumericNewCheck(e);
    });
    $(elem).find("input[id^='UldPieces']").keydown(function (e) {
        IsNumericNewCheck(e);
    });
    $(elem).find("input[id^=ULDLength]").keydown(function (e) {
        IsNumericNewCheck(e);
    });
    $(elem).find("input[id^=ULDWidth]").keydown(function (e) {
        IsNumericNewCheck(e);
    });
    $(elem).find("input[id^=ULDHeight]").keydown(function (e) {
        IsNumericNewCheck(e);
    });
    $(elem).prev().find("td:last div").append($(elem).prev().prev().find(".icon-trans-plus-sign").clone(true));
    $(elem).find("td[id^='tdSNoCol']").text(parseInt($(elem).prev().find("td[id^='tdSNoCol']").text()) + 1);
    $(elem).find("a[id^='ahref_ClassDetails']").unbind("click").bind("click", function () {
        GetULDDetails(this);
    });
    $(elem).find("a[id^='ahref_ULDGetWeight']").unbind("click").bind("click", function () {
        GetWeigingWeight(this);
    });
    $(elem).find("a[id^='ahref_Equipment']").unbind("click").bind("click", function () {
        Getequipment(this);
    });
    //if ($(elem).find("a[id^=hUldInfo]").val() == undefined) {
    //    var ULDNo = $(elem).find("input[id^='Text_ULDTypeSNo']").val() + $(elem).find("input[id^='ULDNo']").val() + $(elem).find("input[id^='OwnerCode']").val();
    //    $(elem).find("input[id^='UGrossWeight']").after("<a href='#' style='padding-left:5px;' id='hUldInfo' onclick=GetULDDetails('" + ULDNo + "')>ULD Info</a> ");
    //    }
    //if ($("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").length == 1) {
    //    $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").find("a[id^='ahref_ULDGetWeight']").each(function () {
    //        $(this).css("display", "none");
    //    });
    //}
    //else {
    //    $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").find("a[id^='ahref_ULDGetWeight']").css("display", "none");
    //    $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").last().find("a[id^='ahref_ULDGetWeight']").css("display", "");
    //    //$(this)
    //}
    //$(elem).find("a[id^='ahref_ULDGetWeight']").css("display", "");
    //$("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").find("a[id^='ahref_ULDGetWeight']").css("display", "none");
    //$("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").last().find("a[id^='ahref_ULDGetWeight']").css("display", "");

    CalculateULDVolume();
    //fn_RemoveRequired();
}

//Numeric Check TextBox
function IsNumericNewCheck(e) {
    if (e.ctrlKey || e.altKey)  // if shift, ctrl or alt keys held down
    {
        e.preventDefault();             // Prevent character input
    }
    else {
        var n = e.keyCode;
        if (!((n == 8)              // backspace
          || (n == 46)                // delete
          || (n >= 35 && n <= 40)     // arrow keys/home/end
          || (n >= 48 && n <= 57)     // numbers on keyboard
          || (n >= 96 && n <= 105)    // number on keypad
          || (n == 9)
          || (n !== undefined) || (n == 16)
            )              // Tab on keypad
          ) {
            e.preventDefault();          // Prevent character input
        }
    }
}

function checkonRemove(elem) {
    var closestTable = elem.closest("table");
    var currentIndexPos = $(closestTable).find("[id^='Length']").length - 1;
    if (elem.closest("table").find("[id^='Pieces']").length < 2)
        $('.disablechk').removeAttr('disabled');
    $(closestTable).find("[id^='Pieces']")[currentIndexPos].disabled = false;
    CalculateVolume(elem);
    $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").find("a[id^='ahref_SLIGetWeight']").css("display", "none");
    $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").last().find("a[id^='ahref_SLIGetWeight']").css("display", "");
    //$("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").find("a[id^='ahref_SLIEquipment']").css("display", "none");
    //$("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").last().find("a[id^='ahref_SLIEquipment']").css("display", "");
    //if ($("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").length > 1) {
    //    $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").find("a[id^='ahref_SLIGetWeight']").each(function () {
    //        $(this).css("display", "none");
    //    });
    //}
    //else {
    //    $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").last().find("a[id^='ahref_SLIGetWeight']").css("display", "");
    //}
    //$(elem).find("a[id^='ahref_SLIGetWeight']").css("display", "");
}

function PopUpOnOpen(cntrlId) {
    savetype = "ULDDETAILS";
    return false;
}

function PopUpOnClose(cntrlId) {
    savetype = "";
    __uldstocksno = -1;
    __uldno = "";
    return false;
}

function ReadPopUpOnOpen(cntrlId) {
    savetype = "CLOSEDULDDETAILS";
    return false;
}

function ReadPopUpOnClose(cntrlId) {
    savetype = "";
    __uldstocksno = -1;
    __uldno = "";
    return false;
}


//Center Overhang, Overlap, Innerlap( Cut Pallet)
var quantity = [{ Key: "1", Text: "1" }, { Key: "2", Text: "2" }, { Key: "3", Text: "3" }, { Key: "4", Text: "4" }, { Key: "5", Text: "5" }, { Key: "6", Text: "6" }, { Key: "7", Text: "7" }, { Key: "8", Text: "8" }, { Key: "9", Text: "9" }, { Key: "10", Text: "10" }];
var uldbuild = [{ Key: "1", Text: "CLEAN LOAD" }, { Key: "2", Text: "THROUGH LOAD" }, { Key: "3", Text: "MIXED LOAD" }];//Clean Load, Mixed Load, Through Load
var OverhangDirection = [{ Key: "1", Text: "AFT" }, { Key: "2", Text: "FWD" }];
var OverhangType = [{ Key: "1", Text: "Aisle O/H" }, { Key: "2", Text: "Lateral O/H" }, { Key: "3", Text: "Lateral Loading" }, { Key: "4", Text: "Center O/H" }, { Key: "5", Text: "Overlap" }, { Key: "6", Text: "Innerlap(Cut Pallet)" }];
var OverhangMesUnit = [{ Key: "1", Text: "Inch" }, { Key: "2", Text: "Cms" }, { Key: "3", Text: "Feet" }, { Key: "4", Text: "Meter" }];
var __uldstocksno = -1;

function fnBindLyingUld() {
    alert("Hi");
}

function BindULDinfoAutoComplete(elem, mainElem) {

    cfi.AutoComplete("ULDBuildUpLocation", "LocationNo", "Warehouselocation", "SNo", "LocationNo", ["LocationNo"], null, "contains");
    cfi.AutoComplete("ULDLocation", "LocationNo", "Warehouselocation", "SNo", "LocationNo", ["LocationNo"], null, "contains");
    cfi.AutoComplete("LoadCode", "ULDLoadingCode,Description", "ULDLoadingCodes", "SNo", "ULDLoadingCode", ["ULDLoadingCode", "Description"], null, "contains");
    cfi.AutoComplete("LoadIndicator", "ULDLoadingIndicator,Description", "ULDLoadingIndicator", "SNo", "ULDLoadingIndicator", ["ULDLoadingIndicator", "Description"], null, "contains");
    cfi.AutoComplete("AbbrCode", "AbbrCode,Description", "ULDContour", "SNo", "AbbrCode", ["AbbrCode", "Description"], null, "contains");
    //cfi.AutoCompleteByDataSource("ULDBuild", uldbuild, null, null);
    cfi.AutoCompleteByDataSource("MeasurementUnit", OverhangMesUnit, null, null);
    cfi.AutoCompleteByDataSource("OverhangDirection", OverhangDirection, null, null);
    cfi.AutoCompleteByDataSource("OverhangType", OverhangType, null, null);
    cfi.AutoComplete("UldBupType", "Description", "buptype", "SNo", "Description", ["Description"], null, "contains");
    cfi.AutoCompleteByDataSource("Ovng_MasterMesUnit", OverhangMesUnit, null, null);
    cfi.AutoCompleteByDataSource("ULD_MesUnit", OverhangMesUnit, null, null);
    cfi.AutoCompleteByDataSource("OverhangMesUnit", OverhangMesUnit, null, null);
    cfi.AutoCompleteByDataSource("UldBasePallet", null, null, null);
    //var DSBaseULD = [{ Key: __uldstocksno, Text: __uldno }];
    cfi.AutoComplete("ULDOtherPallets", "ULDNo", "vBuidupOtherPallet", "ULDNo", "ULDNo", ["ULDNo"], null, "contains", ",");
    $('#Height').css("width", "50px");
    $('#Height').css("maxlength", 5);
    $('#_tempHeight').attr('maxlength', 5);
    $('#_tempHeight').css("width", "50px");

    $('#Text_LoadCode').width(200);
    $('#Text_LoadIndicator').width(200);
    $('#Text_AbbrCode').width(200);



    // cfi.makeTrans("divareaTrans_sli_slioverhangpallet", null, null, BindOverhangAutoComplete, null, null, null);
}
function ResetDetailsforPOPUp() {
    $("#divULDInfoforSLI").html("");
    $(".k-window").hide();
    $(".k-overlay").remove();
    $("#divPopUpBackground").remove();
}

//Insert Dim Equipment
var SLIEqDetails = [];
var SLIData = [];
function saveSLIEQUIPMENTS() {
    SLIData = [];
    var flag = true;
    SLIEqDetails = [];
    $("div[id$='divareaTrans_sli_sliinventory']").find("[id^='areaTrans_sli_sliinventory']").each(function () {
        var Model_SLIEqDetailsTrans = {

            EqType: $(this).find("[id^='EqType']").val() == '' ? 0 : $(this).find("[id^='EqType']").val(),
            Equipment: $(this).find("[id^='Equipment']").val() == '' ? 0 : $(this).find("[id^='Equipment']").val(),
            EqNo: $(this).find("[id^='EqNo']").val() == '' ? 0 : $(this).find("[id^='EqNo']").val(),
            Count: $(this).find("[id^='Count']").val() == '' ? 0 : $(this).find("[id^='Count']").val(),
            TareWt: $(this).find("[id^='TareWt']").val() == '' ? 0 : $(this).find("[id^='TareWt']").val(),
            UpdatedBy: userContext.UserSNo,
            ESLINo: $(this).find("[id^='ESLINo']").val() == '' ? null : $(this).find("[id^='ESLINo']").val(),
            ESLISNo: currentslisno,
            EULDNo: $(this).find("[id^='EULDNo']").val() == '' ? null : $(this).find("[id^='EULDNo']").val(),
            LooseSNo: $(this).find("[id^='LooseSNo']").val() == '' ? 0 : $(this).find("[id^='LooseSNo']").val(),
        };
        SLIEqDetails.push(Model_SLIEqDetailsTrans);
    });
    $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").each(function () {
        var tdSno = 0;
        var TareWt = 0.0;
        for (var k = 0; k < SLIEqDetails.length; k++) {
            if (SLIEqDetails[k].LooseSNo != "") {
                tdSno = SLIEqDetails[k].LooseSNo;
                TareWt = SLIEqDetails[k].TareWt;
                if (parseInt($(this).find("[id^='SNo']").val() == 0 ? $(this).find("td[id^='tdSNoCol']").text() : $(this).find("[id^='SNo']").val()) == parseInt(tdSno)) {
                    if (parseFloat($(this).find("input[id^='CapturedWeight']").val()) <= parseFloat(TareWt)) {
                        flag = false;
                    }
                }
            }
        }

    });
    $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").each(function () {
        var tdSno = 0;
        var TareWt = 0.0;
        for (var k = 0; k < SLIEqDetails.length; k++) {
            if (SLIEqDetails[k].EULDNo != null) {
                ULDNo = SLIEqDetails[k].EULDNo.toUpperCase();
                TareWt = SLIEqDetails[k].TareWt;
                var ULD = $(this).find("input[id^=Text_ULDTypeSNo]").val().toUpperCase() + $(this).find("input[id^=ULDNo]").val().toUpperCase() + $(this).find("input[id^=OwnerCode]").val().toUpperCase();
                if (ULD == ULDNo) {
                    if (parseFloat($(this).find("input[id^='UCapturedWeight']").val()) <= parseFloat(TareWt)) {
                        flag = false;
                    }
                }
            }
        }

    });

    if (cfi.IsValidSection('divEqDetails')) {
        if (true) {
            if (flag == true) {
                $.ajax({
                    url: "Services/Shipment/SLInfoService.svc/saveSLIEquipment", async: false, type: "POST", dataType: "json", cache: false,
                    data: JSON.stringify({ SLIEqDetailsTrans: SLIEqDetails }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        var SLITarearr = jQuery.parseJSON(result);
                        var OutputRes = SLITarearr.Table1;
                        SLIDataarr = SLITarearr.Table0;

                        for (var i = 0; i < SLIDataarr.length; i++) {
                            SLIData.push(SLIDataarr[i]);
                        }
                        if (OutputRes[0].Column1 == "1") {
                            ShowMessage('success', 'Success - ' + SLICaption + ' Equipment', "" + SLICaption + " Equipment processed successfully", "bottom-right");


                            $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").each(function () {
                                var tdSno = 0;
                                var TareWt = 0.0;
                                for (var i = 0; i < SLIDataarr.length; i++) {
                                    if (SLIDataarr[i].LooseSNo != "") {
                                        tdSno = SLIDataarr[i].LooseSNo;
                                        TareWt = SLIDataarr[i].TareWt;
                                        if (parseInt($(this).find("[id^='SNo']").val() == 0 ? $(this).find("td[id^='tdSNoCol']").text() : $(this).find("[id^='SNo']").val()) == parseInt(tdSno)) {
                                            $(this).find("input[id^='TareWeight']").val(TareWt);
                                            TareWt = 0.0;
                                        }
                                    }
                                }

                            });
                            CalculateVolume();


                            CalculateULDVolume();



                            ResetEquipmentDetailsforPOPUp();
                            flag = true;
                        }
                        else {
                            if (OutputRes[0].Column1 == "101") {
                                ShowMessage('warning', 'Warning - ' + SLICaption + ' Equipment', "Equipment Tare Wt should always be less than shipment Captured  Wt.", "bottom-right");
                                flag = false;
                            }
                            else if (OutputRes[0].Column1 == "0") {
                                ShowMessage('warning', 'Warning - ' + SLICaption + ' Equipment', "Unable to process.", "bottom-right");
                                flag = false;
                            }
                        }


                    },
                    error: function (xhr) {
                        // ShowMessage('warning', 'Warning - ULD Details', "unable to process.", "bottom-right");
                        flag = false;

                    }
                });
            }
            else {
                ShowMessage('warning', 'Warning - ' + SLICaption + ' Equipment', "Equipment Tare Wt should always be less than shipment Captured  Wt.", "bottom-right");
                flag = false;
            }

        }
    }


    return flag;


}


//Insert  Temp Details
var SHCTempDetails = [];
function saveSLITempDetails() {

    SHCTempDetails = [];
    var Flag = false;
    $("div[id$='divareaTrans_sli_slishctemp']").find("[id^='areaTrans_sli_slishctemp']").each(function () {
        if ($(this).find("[id^='TDSPHCCode']").val() == "") {
            ShowMessage('warning', 'Warning - Temp Details', "SHC Code is required", "bottom-right");
            Flag = true;
        }
        if (Flag == false) {
            if ($(this).find("[id^='StartTemperature']").val() == "") {
                ShowMessage('warning', 'Warning - Temp Details', "Start Temperature is required", "bottom-right");
                Flag = true;
            }
        } if (Flag == false) {
            if ($(this).find("[id^='EndTemperature']").val() == "") {
                ShowMessage('warning', 'Warning - Temp Details', "End Temperature is required", "bottom-right");
                Flag = true;
            }
        }
        if (Flag == false) {
            if ($(this).find("[id^='Pieces']").val() == "0" || $(this).find("[id^='Pieces']").val() == "") {
                ShowMessage('warning', 'Warning - Temp Details', "Piece is required", "bottom-right");
                Flag = true;
            }
        }

    });
    if (Flag == false) {

        $("div[id$='divareaTrans_sli_slishctemp']").find("[id^='areaTrans_sli_slishctemp']").each(function () {
            var Model_SHCTempDetailsTrans = {
                SLISNo: currentslisno,
                TDSHCCode: $(this).find("[id^='TDSPHCCode']").val() == '' ? 0 : $(this).find("[id^='TDSPHCCode']").val(),
                StartTemp: $(this).find("[id^='StartTemperature']").val() == '' ? 0 : $(this).find("[id^='StartTemperature']").val(),
                EndTemp: $(this).find("[id^='EndTemperature']").val() == '' ? 0 : $(this).find("[id^='EndTemperature']").val(),
                Piece: $(this).find("[id^='Pieces']").val() == '' ? 0 : $(this).find("[id^='Pieces']").val(),
                UpdatedBy: userContext.UserSNo,
                SLINo: $("#SLINo").val(),
            };
            SHCTempDetails.push(Model_SHCTempDetailsTrans);
        });
        $("#divTempDetails").data("kendoWindow").close();

    }
    if (currentslisno == 0) {
        $("#btnSaveToNext").hide();
    }

}

//Insert ULD Details By Pop Up in ULD DIms
function SaveSLIULDINFO() {
    //debugger;
    var flag = false;
    var ULDINFO = $("#__divuldinfo__").serializeToJSON();
    //var SLIOverhangTrans = $("#div2").serializeToJSON();
    //var SLIOverhangPallet = $("#div3").serializeToJSON();

    var ULDBuildUpOverhangTrans = [];
    $("div[id$='divareaTrans_sli_slioverhangpallet']").find("[id^='areaTrans_sli_slioverhangpallet']").each(function () {
        var Model_ULDBuildUpOverhangTrans = {
            SNo: 0,
            OverhangPalletSNo: 0,
            OverhangDirection: $(this).find("[id^='Text_OverhangDirection']").data("kendoAutoComplete").key() == '' ? null : $(this).find("[id^='Text_OverhangDirection']").data("kendoAutoComplete").key(),
            Width: $(this).find("[id^='OverhangWidth']").val() == '' ? null : $(this).find("[id^='OverhangWidth']").val(),
            WidthMesUnit: $(this).find("[id^='Text_OverhangMesUnit']").data("kendoAutoComplete").key() == '' ? null : $(this).find("[id^='Text_OverhangMesUnit']").data("kendoAutoComplete").key(),
            OverhangType: $(this).find("[id^='Text_OverhangType']").data("kendoAutoComplete").key() == '' ? null : $(this).find("[id^='Text_OverhangType']").data("kendoAutoComplete").key(),
            OtherInfo: $(this).find("[id^='OverhangOtherInfo']").val(),
        };
        ULDBuildUpOverhangTrans.push(Model_ULDBuildUpOverhangTrans);

    });
    var Model_ULDBuildUpOverhangPallet = {
        SNo: 0,
        ULDStockDetailsSNo: 0,
        IsOverhangPallet: $("#Ovng_IsOverhangPallet").is(":checked"),
        CutOffHeight: $("#Ovng_MasterCutOffHeight").val() == '' ? null : $("#Ovng_MasterCutOffHeight").val(),
        CutOffMesUnit: $("#Text_Ovng_MasterMesUnit").data("kendoAutoComplete").key() == '' ? null : $("#Text_Ovng_MasterMesUnit").data("kendoAutoComplete").key(),
        Remarks: $("#Ovng_MasterRemarks").val()
    };
    if (ULDINFO.ULDInfoHeight != "") {
        $.ajax({
            url: "Services/Shipment/SLInfoService.svc/saveULDInfo", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ ULDNo: SelectULDNo, SLISNo: parseInt(currentslisno), ULDINFO: ULDINFO, SLIOverhangTrans: ULDBuildUpOverhangTrans, SLIOverhangPallet: Model_ULDBuildUpOverhangPallet }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == "") {
                    ShowMessage('success', 'Success - ULD Details', "ULD Details  processed successfully", "bottom-right");
                    //cfi.ClosePopUp("divULDInfoforSLI");
                    ResetDetailsforPOPUp();
                    savetype = "";
                    __uldno = "";
                    __uldstocksno = -1;
                    flag = true;
                }
                else
                    ShowMessage('warning', 'Warning - ULD Details', "unable to process", "bottom-right");
                flag = false;
            },
            error: function (xhr) {
                ShowMessage('warning', 'Warning - ULD Details', "unable to process.", "bottom-right");
                flag = false;

            }
        });
    }
    else {
        ShowMessage('warning', 'Warning - ULD Details', "Height is required", "bottom-right");
        flag = false;
    }
    return flag;
}

function GetOtherPalletValue() {
    var _item = "";
    $('span.k-icon.k-delete').each(function (index, item) { // Allready Added in Db
        if (item.id != "")
            _item = item.id + "," + _item;
    });

    if (_item != "" && _item.length > 2) {
        var iscomma = _item.substring(_item.length - 1, _item.length);
        if (iscomma == ",") {
            var _item = _item.substring(0, _item.length - 1);
        }
    }

    var tempAdded = $('#_OtherPallets').val(); // Temp Added
    if (tempAdded != "") {
        var arr = tempAdded.split('=#=');
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] != "") {
                _item = arr[i] + "," + _item;
            }
        }
    }

    if (_item != "" && _item.length > 2) {
        var iscomma = _item.substring(_item.length - 1, _item.length);
        if (iscomma == ",") {
            var _item = _item.substring(0, _item.length - 1);
        }
    }

    return _item;
}

/*************************************************************Open ULD Details Pop Up in ULD DIM -Start*********************************************************************************/
var SelectULDNo = ""; var savetype = "";
function GetULDDetails(input) {
    _CURR_PRO_ = "SLIBOOKING";
    _CURR_OP_ = "SLI";
    $("#div1").html("");
    $("#div2").html("");
    $("#div3").html("");
    var tr = $(input).closest("tr");
    var ULDNo = $(tr).find("input[id^='Text_ULDTypeSNo']").val().toUpperCase() + $(tr).find("input[id^='ULDNo']").val() + $(tr).find("input[id^='OwnerCode']").val().toUpperCase();
    //$("#divareaTrans_sli_slioverhangpallet").removeAttr("style");
    SelectULDNo = ULDNo;

    $.ajax({
        url: "Services/Shipment/SLInfoService.svc/GetWebForm/" + _CURR_PRO_ + "/SLI/ULDInfo/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divULDInfoforSLI").html('').html(result);
            $("#divULDInfoforSLI").append("<div id=divfooter align=center></div>");
            $("#divfooter").html(popupfotter).show();
            BindULDinfoAutoComplete();


            var DSBaseULD = [{ Key: __uldstocksno, Text: ULDNo }];
            // debugger;
            cfi.AutoCompleteByDataSource("UldBasePallet", DSBaseULD, null, null);

            $("#btnCancel").unbind("click").bind("click", function () {
                ResetDetailsforPOPUp();
            });

            $("#btnSave").unbind("click").bind("click", function () {
                //alert('Test');
                if (cfi.IsValidSection('divDetail')) {
                    if (true) {
                        if (SaveFormData("ULDInfo"))
                            SLISearch();
                    }
                }
                else {
                    return false
                }
            });

            $.ajax({

                url: "Services/Shipment/SLInfoService.svc/GetSLIULDDetails?ULDNo=" + ULDNo, async: false, type: "get", dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var uldData = jQuery.parseJSON(result);
                    var listArraySLIuldstockdetails = uldData.Table0;
                    var listArrayOverhangTrans = uldData.Table1;
                    var listArrayOverhangPallet = uldData.Table2;
                    var UWS = uldData.Table3;

                    if (parseInt(UWS[0].IsUWS) > 0) {
                        $("#divfooter").html(popupfotter).hide();
                    }

                    //debugger;
                    if (listArraySLIuldstockdetails.length > 0) {
                        var uldDetailItem = uldData.Table0[0];


                        $("#Text_LoadIndicator").data("kendoAutoComplete").setDefaultValue(uldDetailItem.LoadIndicator, uldDetailItem.Text_LoadIndicator);
                        $("#Text_AbbrCode").data("kendoAutoComplete").setDefaultValue(uldDetailItem.AbbrCode, uldDetailItem.Text_AbbrCode);

                        $("#Text_LoadCode").data("kendoAutoComplete").setDefaultValue(uldDetailItem.LoadCodeSNo, uldDetailItem.Text_LoadCode);
                        $("textarea#Remarks").val(uldDetailItem.Remarks);
                        if (uldDetailItem.IsTeamPersonnel.toString().toLowerCase() == "true") {
                            $('input[name=IsTeamPersonal][value=1]').attr('checked', true);
                        }
                        else {
                            $('input[name=IsTeamPersonal][value=0]').attr('checked', true);
                        }

                        $("#ULDInfoHeight").val(parseFloat(uldDetailItem.ULDInfoHeight));
                        $("#_tempULDInfoHeight").val(parseFloat(uldDetailItem.ULDInfoHeight));
                        $("#Text_MeasurementUnit").data("kendoAutoComplete").setDefaultValue(uldDetailItem.MeasurementUnit, uldDetailItem.text_MeasurementUnit);
                        $("#Text_UldBupType").data("kendoAutoComplete").setDefaultValue(uldDetailItem.BUPTypeSNo, uldDetailItem.Text_UldBupType);
                        // $('#ULDOtherPallets').val(uldDetailItem.OtherPallets);

                        if (uldDetailItem.OtherPallets != "")
                            cfi.BindMultiValue("ULDOtherPallets", uldDetailItem.OtherPallets, uldDetailItem.OtherPallets);
                        $('#ULDOtherPallets').val(uldDetailItem.OtherPallets);

                        if (uldDetailItem.ULDSTockSNo != "" && uldDetailItem.ULDSTockSNo != "0")
                            $("#Text_UldBasePallet").data("kendoAutoComplete").setDefaultValue(uldData.ULDSTockSNo, ULDNo);
                    }
                    if (listArrayOverhangPallet.length > 0) {
                        var ArrayOverhangMaster = uldData.Table2[0];
                        $('#Ovng_MasterCutOffHeight').val(ArrayOverhangMaster.CutOffHeight);
                        $("#_tempOvng_MasterCutOffHeight").val(ArrayOverhangMaster.CutOffHeight);
                        $('#Ovng_MasterRemarks').val(ArrayOverhangMaster.Remarks);
                        $("#Text_Ovng_MasterMesUnit").data("kendoAutoComplete").setDefaultValue(ArrayOverhangMaster.CutOffMesUnit, ArrayOverhangMaster.text_CutOffMesUnit);
                        $("#Ovng_IsOverhangPallet").attr("checked", (ArrayOverhangMaster.IsOverhangPallet.toString().toLowerCase() == "true"));


                    }

                    //var listArray = uldData.Table1;                     



                    $("div[id='divULDInfoforSLI']").find("div[id$='divareaTrans_sli_slioverhangpallet']").find("[id^='areaTrans_sli_slioverhangpallet']").each(function () {

                        $(this).find("input[id^='OverhangDirection']").each(function () {
                            cfi.AutoCompleteByDataSource($(this).attr("name").replace("Text_", ""), OverhangDirection, null, null);
                        });
                        $(this).find("input[id^='OverhangType']").each(function () {
                            cfi.AutoCompleteByDataSource($(this).attr("name").replace("Text_", ""), OverhangType, null, null);
                        });
                        $(this).find("input[id^='OverhangMesUnit']").each(function () {
                            cfi.AutoCompleteByDataSource($(this).attr("name").replace("Text_", ""), OverhangMesUnit, null, null);
                        });
                        $('input[type="text"][id^="OverhangWidth"]').on("keypress keyup blur", function (event) {

                            $(this).val($(this).val().replace(/[^\d].+/, ""));
                            if ((event.which < 48 || event.which > 57)) {
                                event.preventDefault();
                            }
                        });
                        $("#Ovng_MasterCutOffHeight").on("keypress keyup blur", function (event) { // Cut off Height

                            $(this).val($(this).val().replace(/[^\d].+/, ""));
                            if ((event.which < 48 || event.which > 57)) {
                                event.preventDefault();
                            }
                        });
                    });
                    cfi.makeTrans("sli_slioverhangpallet", null, null, BindOverhangAutoComplete, BindOverhangAutoComplete, null, listArrayOverhangTrans);
                }
            });
            $('input[type="text"][id^="OverhangWidth"]').on("keypress keyup blur", function (event) {

                $(this).val($(this).val().replace(/[^\d].+/, ""));
                if ((event.which < 48 || event.which > 57)) {
                    event.preventDefault();
                }
            });
            $("#Ovng_MasterCutOffHeight").on("keypress keyup blur", function (event) { // Cut off Height

                $(this).val($(this).val().replace(/[^\d].+/, ""));
                if ((event.which < 48 || event.which > 57)) {
                    event.preventDefault();
                }
            });



            cfi.PopUp("divULDInfoforSLI", "ULD Details", 1200, PopUpOnOpen, PopUpOnClose, 60);

            $("div[id=divULDInfoforSLI]").find("div[id$=divareaTrans_sli_slioverhangpallet]").find("tr[id^=areaTrans_sli_slioverhangpallet]").find("input[id^='OverhangOtherInfo_']").hide();
            savetype = "ULDDETAILS";
        }

    });



    //$(tr).find("a[id='hUldInfo']").css("display", "");
    //$(tr).find("span[id^='SLINo']").css("display", "");
    //$(tr).find("span[id^='HAWBNo']").css("display", "");
    //$(tr).find("input[id^='ULDNo']").closest('td').find('span').css("display", "");
    //$(tr).find("input[id*='_tempSLACPieces']").show();
    //$(tr).find("input[id*='SLACPieces']").css("display", "");
    //$(tr).find("input[id*='ULDTypeSNo']").closest('td').find('span').css("display", "");
    //$(tr).find("input[id*='OwnerCode']").css("display", "none");
    //$(tr).find("input[id*='ULDPackingTypeSNo']").closest('td').find('span').css("display", "");
    //$(tr).find("input[id*='ULDNo']").css("display", "");
    //$(tr).find("input[id*='_tempUGrossWeight']").css("display", "");
    //$(tr).find("input[id*='UGrossWeight']").css("display", "");



    //$("div[id='divareaTrans_sli_slioverhangpallet']").removeAttr("style");
    //var div2 = $("div[id='divareaTrans_sli_slioverhangpallet']").clone(true);
    //if ($("div[id='divULDInfoforSLI']").find("span[id=spnLoadCode]").length == 0) {
    //    $("div[id='divULDInfoforSLI']").find("div[id='div1']").append($("div[id='__divslidimension__']").find("span[id=spnLoadCode]").closest('table').html());
    //    $("div[id='divULDInfoforSLI']").find("div[id='div2']").append(div2);
    //    $("div[id='divULDInfoforSLI']").find("div[id='div3']").append($("div[id='__divslidimension__']").find("span[id=spnOvng_MasterCutOffHeight]").closest('table').html()).append("<div id=divfooter align=center></div>");
    //    $("#divfooter").html(popupfotter).show();
    //}
    //$("div[id$='div1']").find("input[id='_tempHeight']").removeAttr("readonly");
    //$("div[id$='div1']").find("input[id='Height']").removeAttr("readonly");
    //$("div[id$='div3']").find("input[id='_tempOvng_MasterCutOffHeight']").removeAttr("readonly");
    //$("div[id$='div3']").find("input[id='Ovng_MasterCutOffHeight']").removeAttr("readonly");






    // $("#divULDInfoforSLI").show();
}

/*************************************************************Open ULD Details Pop Up in ULD DIM -ENd*********************************************************************************/

//Get SLi Dim Data
var ArrCheckITc = [];
var CountPart = 0; var NoDim = 0; var CustomerTypeCount = 0;
function BindSLIDimensionEvents() {
    //SetTotalPcs();
    SLIData = [];
    uldLWH = [];
    NoDim = 0;
    TempSHCCode = "";
    ArrCheckITc = [];
    $.ajax({
        url: "Services/Shipment/SLInfoService.svc/GetSLIDimemsionsAndULD?SLISNo=" + currentslisno, async: false, type: "get", dataType: "json", cache: false,
        //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
        data: JSON.stringify({ SLISNO: currentslisno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {

            var dimuldData = jQuery.parseJSON(result);
            var dimArray = dimuldData.Table0;
            var DimUnit = dimuldData.Table1;
            var uldArray = dimuldData.Table2;
            var ULDDimension = dimuldData.Table4;
            var SHCs = dimuldData.Table5;
            var UnloadingCount = dimuldData.Table6;
            var slipart = dimuldData.Table7;
            var dimsCount = dimuldData.Table8;
            var CType = dimuldData.Table9;
            var SLIequipmentdata = dimuldData.Table10;
            var SLICancelled = dimuldData.Table11;
            var SLICancelledFlag = SLICancelled[0].SLICancelled;
            CountPart = slipart[0].SLIPart;
            NoDim = dimsCount[0].NoDim;
            CustomerTypeCount = parseInt(CType[0].CustomerType);
            var UCount = UnloadingCount[0].UnloadingCount || 0;
            if (userContext.GroupName.toUpperCase() == "AGENT") {
                UCount = 1;
            }
            if (UCount > 0) {
                //  var uldLWHarr = jQuery.parseJSON(ULDDimension);
                for (var i = 0; i < SHCs.length; i++) {
                    TempSHCCode = TempSHCCode + ',' + SHCs[i].SNo;
                    if (SHCs[i].IsTC == "True") {
                        ArrCheckITc.push(SHCs[i].SNo, 1)
                    }
                }
                for (var i = 0; i < ULDDimension.length; i++) {
                    uldLWH.push(ULDDimension[i]);
                }
                for (var i = 0; i < SLIequipmentdata.length; i++) {
                    SLIData.push(SLIequipmentdata[i]);
                }

                var isrequired = 1;
                for (var i = 0; i < dimArray.length; i++) {
                    for (var i = 0; i < dimArray.length; i++) {
                        if (dimArray[i].slisphccode == "13") {
                            isrequired = 0;
                        }
                    }
                    $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").each(function () {
                        if (isrequired == 0) {
                            $(this).find("input[id^='Length']").removeAttr("data-valid");
                            $(this).find("input[id^='Width']").removeAttr("data-valid");
                            $(this).find("input[id^='Height']").removeAttr("data-valid");
                        }
                    });
                }

                $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").each(function () {
                    $(this).find("input[id^='Text_SLISPHCCode']").each(function () {
                        $(this).css("width", "120px");
                    });
                    $(this).find("input[id^='TareWeight']").attr("disabled", true);
                    $(this).find("input[id^='GrossWeight']").attr("disabled", true);
                    $(this).find("input[id^='_tempTareWeight']").attr("disabled", true);
                    $(this).find("input[id^='_tempGrossWeight']").attr("disabled", true);

                    if (dimArray.length == 0) {
                        $(this).find("input[id^='SLINo']").each(function () {
                            $(this).val(slino);
                        });
                        $(this).find("span[id^='SLINo']").each(function () {
                            $(this).text(slino);
                        });
                        $(this).find("div[id^='divMultiSLISPHCCode']").css("overflow", "auto");
                        $(this).find("div[id^='divMultiSLISPHCCode']").css("width", "15em");

                        if (CustomerTypeCount == 1) {
                            $(this).find("input[id^='Length']").each(function () {
                                $(this).removeAttr("data-valid");
                                $(this).attr("data-valid", "min[0.01]");

                            });
                            $(this).find("input[id^='Width']").each(function () {
                                $(this).removeAttr("data-valid");
                                $(this).attr("data-valid", "min[0.01]");
                            });
                            $(this).find("input[id^='Height']").each(function () {
                                $(this).removeAttr("data-valid");
                                $(this).attr("data-valid", "min[0.01]");
                            });
                        }

                    }
                    //for Conditional Mendatory
                    if (isBUP) {
                        $('#spnPieces').parent().find('font').html(' ');
                        $('#spnGrossWeight').parent().find('font').html(' ');
                        $('#spnLength').parent().find('font').html(' ');
                        $('#spnWidth').parent().find('font').html(' ');
                        $('#spnHeight').parent().find('font').html(' ');
                        $('#spnPackingTypeSNo').parent().find('font').html(' ');
                        //if (CustomerTypeCount == 1) {
                        $(this).find("input[id^='Pieces']").each(function () {
                            $(this).removeAttr("data-valid");
                            $(this).attr("data-valid", "min[1]");
                        });

                        $(this).find("input[id^='GrossWeight']").each(function () {
                            $(this).removeAttr("data-valid");
                            $(this).attr("data-valid", "min[0.01]");
                        });
                        $(this).find("input[id^='CapturedWeight']").each(function () {
                            $(this).removeAttr("data-valid");
                            $(this).attr("data-valid", "min[0.01]");
                        });
                        $(this).find("input[id^='Length']").each(function () {
                            $(this).removeAttr("data-valid");
                            $(this).attr("data-valid", "min[0.01]");

                        });
                        $(this).find("input[id^='Width']").each(function () {
                            $(this).removeAttr("data-valid");
                            $(this).attr("data-valid", "min[0.01]");
                        });
                        $(this).find("input[id^='Height']").each(function () {
                            $(this).removeAttr("data-valid");
                            $(this).attr("data-valid", "min[0.01]");
                        });
                        $(this).find("input[id^='VolumeWt']").each(function () {
                            $(this).removeAttr("data-valid");
                            $(this).attr("data-valid", "min[0.01]");
                        });
                        $("div[id$='divareaTrans_sli_slidimension']").find("td[title='Enter Captured Weight']").find("font[color='red']").remove();
                        $("div[id$='divareaTrans_sli_slidimension']").find("td[title='Enter Volume Weight']").find("font[color='red']").remove();
                        // debugger
                        $(this).find("input[id^='Text_PackingTypeSNo']").each(function () {
                            // $(this).data("kendoAutoComplete").setDefaultValue(0, "");
                            $(this).removeAttr("data-valid");
                            // $(this).removeAttr("data-valid-msg");

                        });
                        //}
                        // if (CustomerTypeCount == 2) {
                        $(this).find("input[id^='Text_PackingTypeSNo']").each(function () {
                            // $(this).data("kendoAutoComplete").setDefaultValue(0, "");
                            $(this).removeAttr("data-valid");
                            // $(this).removeAttr("data-valid-msg");
                        });
                        //}
                        $("input[id^='SLACPieces']").keydown(function (e) {
                            IsNumericNewCheck(e);
                        });
                        $("input[id^='UldPieces']").keydown(function (e) {
                            IsNumericNewCheck(e);
                        });
                        $("input[id^=ULDLength]").keydown(function (e) {
                            IsNumericNewCheck(e);
                        });
                        $("input[id^=ULDWidth]").keydown(function (e) {
                            IsNumericNewCheck(e);
                        });
                        $("input[id^=ULDHeight]").keydown(function (e) {
                            IsNumericNewCheck(e);
                        });
                        //$("input[id^='ULDNo']").keydown(function (e) { // Allow: backspace, delete, tab, escape, enter and .
                        //    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 || (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) || (e.keyCode >= 35 && e.keyCode <= 40)) {
                        //        // let it happen, don't do anything return; 
                        //    }
                        //    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) { e.preventDefault(); }
                        //});

                        $("input[id^='ULDNo']").keydown(function (e) {
                            //debugger;
                            if (e.ctrlKey || e.altKey)  // if shift, ctrl or alt keys held down
                            {
                                e.preventDefault();             // Prevent character input
                            }
                            else {
                                var n = e.keyCode;
                                //if (!((n == 8)              // backspace
                                //        || (n == 46)                // delete
                                //        || (n >= 35 && n <= 40)     // arrow keys/home/end
                                //        || (n >= 48 && n <= 57)     // numbers on keyboard
                                //        || (n >= 96 && n <= 105)    // number on keypad
                                //        || (n == 9))                // Tab on keypad
                                //        ) {
                                //    e.preventDefault();             // Prevent character input
                                //}
                                if (!((n == 8) || (n == 46) || (n >= 35 && n <= 40) || (n >= 48 && n <= 57) || (n >= 96 && n <= 105) || (n == 9) || (n == 16))) {
                                    e.preventDefault();
                                }
                            }
                        });

                    }
                });

                cfi.makeTrans("sli_slidimension", null, null, BindPackingAutoComplete, checkonRemove, null, dimArray, null, false);
                $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").find("a[id^='ahref_SLIGetWeight']").css("display", "none");
                $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").last().find("a[id^='ahref_SLIGetWeight']").css("display", "");
                $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").last().find("a[id^='ahref_SLIGetWeight']").unbind("click").bind("click", function () {
                    GetWeigingWeight(this);
                });

                if (isBUP) {
                    // cfi.AutoComplete("ULDPackingTypeSNo", "PackingName", "IrregularityPacking", "SNo", "PackingName", ["PackingName"], null, "contains");
                    // cfi.AutoComplete("ULDNoSNo", "ULDNo", "v_AvailableULD", "SNo", "ULDNo", ["ULDNo"], null, "contains");
                    // cfi.AutoComplete("ULDTypeSNo", "ULDName", "ULD", "SNo", "ULDName", ["ULDName"], null, "contains");
                    var i = 0;
                    $("div[id$='divareaTrans_sli_sliulddimension']").find("[id='areaTrans_sli_sliulddimension']").each(function (row, tr) {

                        if (uldArray.length > 0) {
                            uldArray[i].isoverhang == "True" ? $(tr).find("input[id^='isOverhang']").prop('checked', true) : $(tr).find("input[id^='isOverhang']").prop('checked', false);
                        }
                    });

                    cfi.makeTrans("sli_sliulddimension", null, null, BindULDAutoComplete, CalculateVolume, null, uldArray, null, false);
                    //$("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").find("a[id^='ahref_ULDGetWeight']").css("display", "none");
                    //$("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").last().find("a[id^='ahref_ULDGetWeight']").css("display", "");

                    $("div[id$='divareaTrans_sli_sliulddimension']").find("[id='areaTrans_sli_sliulddimension']").each(function () {
                        $(this).find("input[id^='ULDSPHCCode']").each(function () {
                            if (!$("#Text_" + $(this).attr("name")).data("kendoAutoComplete")) {
                                cfi.AutoComplete($(this).attr("name"), "CODE", "SPHC", "SNO", "CODE", ["CODE"], SetRequired, "contains", ",", null, null, null, null, true, null
                , true);
                                $(this).css("width", "120px");
                            }
                        });
                        $(this).find("input[id^='ContourCode']").each(function () {
                            if (!$("#Text_" + $(this).attr("name")).data("kendoAutoComplete")) {
                                cfi.AutoComplete($(this).attr("name"), "ContourCode", "vw_GetSLIContourCodes", "SNO", "ContourCode", ["ContourCode"], GetContour, "contains", null, null, null, null, null, true, null
                , true);
                            }
                            //$("#Text_" + $(this).attr("name")).data("kendoAutoComplete").width = "100px";
                            //$(this).css("width", "100px");

                        });


                        $(this).find("input[id^='Text_ULDSPHCCode']").each(function () {
                            $(this).css("width", "120px");
                        });
                        //$(this).find("input[id^='ULDPackingTypeSNo']").each(function () {
                        //    cfi.AutoComplete($(this).attr("name"), "PackingName", "IrregularityPacking", "SNo", "PackingName", ["PackingName"], null, "contains");
                        //});
                        //$(this).find("input[id^='ULDNoSNo']").each(function () {
                        //    cfi.AutoComplete($(this).attr("name"), "ULDNo", "v_AvailableULD", "SNo", "ULDNo", ["ULDNo"], null, "contains");
                        //});
                        $(this).find("input[id^='ULDTypeSNo']").each(function () {
                            cfi.AutoComplete($(this).attr("name"), "ULDName", "vwULDTYpeSLI", "SNo", "ULDName", ["ULDName"], CheckBULKULDType, "contains");
                        });

                        if (uldArray.length == 0) {
                            $(this).find("input[id^='SLINo']").each(function () {
                                $(this).val(slino);
                            });
                            $(this).find("span[id^='SLINo']").each(function () {
                                $(this).text(slino);
                            });
                            $(this).find("input[id^='Text_Unit']").each(function () {
                                $(this).val("CMT");
                                $(this).css("width", "50px");
                            });
                            $(this).find("input[id^='Unit']").each(function () {
                                $(this).val("2");
                            });
                        }

                    });
                }
                else {
                    $("div[id$='divareaTrans_sli_sliulddimension']").removeAttr('validateonsubmit');

                }
                $("[id='Unit']").unbind("click").bind("click", function (e) {
                    var typevalue = $(this).attr("value");
                    CalculateVolume();
                });

                $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").each(function (row, tr) {
                    $(tr).find("input[id*='Text_Unit']").css("width", "50px");
                    $(tr).find("input[id*='Text_ULDTypeSNo']").css("width", "60px");
                    $(tr).find("div[id^='divMultiSLISPHCCode']").css("overflow", "auto");
                    $(tr).find("div[id^='divMultiSLISPHCCode']").css("width", "15em");
                });

                $("div[id$='divareaTrans_sli_slidimension']").find("[id='areaTrans_sli_slidimension']").each(function () {
                    //UniqueId
                    var Id = 1;
                    $(this).find("input[id^='UniqueId']").val($(this).find("input[id^='SLINo']").val() + "-" + Id);

                    $(this).find("a[id^='ahref_SLIEquipment']").unbind("click").bind("click", function () {
                        Getequipment(this);
                    });
                    // $(this).find("input[id^=_tempLength]").css("display", "none");
                    $(this).find("div[id^='divMultiSLISPHCCode']").css("overflow", "auto");
                    $(this).find("div[id^='divMultiSLISPHCCode']").css("width", "15em");
                    $(this).find("input[id^='PackingTypeSNo']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "PackingName", "IrregularityPacking", "SNo", "PackingName", ["PackingName"], null, "contains");
                    });
                    $(this).find("input[id^='SLISPHCCode']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "CODE", "SPHC", "SNO", "CODE", ["CODE"], SetRequired, "contains", ",", null, null, null, null, true);
                        $(this).css("width", "120px");
                    });

                    //$(this).find("input[id^='VolumeWt']").each(function () {
                    //    cfi.AutoComplete($(this).attr("name"), "PackingName", "IrregularityPacking", "SNo", "PackingName", ["PackingName"], null, "contains");
                    //});
                });

                $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").each(function () {
                    //$(this).find("input[id^=_tempLength]").css("display", "none");
                    var id = $(this).find("input[id^='Text_SLISPHCCode']").attr("id").replace('Text_', '');
                    var txt = $(this).find("input[id^='Text_SLISPHCCode']").val();
                    var val = $(this).find("input[id^='SLISPHCCode']").val();
                    cfi.BindMultiValue(id, txt, val);
                    // $("span.k-delete").live("click", function (e) { fn_RemoveRequired(e, $(this).find("input[id^='Text_SLISPHCCode']").attr("id")) })
                    //SetRequired($(this).find("input[id^='Text_SLISPHCCode']").attr("id"));
                });
                $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").each(function () {
                    var id = $(this).find("input[id^='Text_ULDSPHCCode']").attr("id").replace('Text_', '');
                    var txt = $(this).find("input[id^='Text_ULDSPHCCode']").val();
                    var val = $(this).find("input[id^='ULDSPHCCode']").val();
                    cfi.BindMultiValue(id, txt, val);
                    // $("span.k-delete").live("click", function (e) { fn_RemoveRequired(e, $(this).find("input[id^='Text_ULDSPHCCode']").attr("id")) })
                    //SetRequired($(this).find("input[id^='Text_ULDSPHCCode']").attr("id"));

                });
                // alert(JSON.stringify(DimUnit));
                if (DimUnit.length > 0) {
                    if (DimUnit[0].IsCMS == "True")
                        $('input:radio[name=Unit]:eq(0)').attr("checked", 1)
                    else
                        $('input:radio[name=Unit]:eq(1)').attr("checked", 1)
                    if (DimUnit[0].isBup == "False") {
                        $('#divareaTrans_sli_sliulddimension').hide();
                        // alert(DimUnit[0].isBup)
                    }
                }
                CalculateVolume();
                CalculateULDVolume();
                // if (dimuldData.Table3[0].TotGrossWeight != 0 && dimuldData.Table3[0].TotGrossWeight != "") {
                var GW = (dimuldData.Table3[0].TotGrossWeight || "0") + "/" + dimuldData.Table3[0].TotVolumeWeight || "0";
                //var VW = isNaN(dimuldData.Table3[0].TotGrossWeight) ? 0 : dimuldData.Table3[0].TotGrossWeight + "/" + isNaN(dimuldData.Table3[0].TotVolumeWeight) ? 0 : dimuldData.Table3[0].TotVolumeWeight;

                $("span[id='DimGrossWt']").html(GW);
                $("input[id='DimGrossWt']").val(GW);
                //} else {
                //    $("span[id='DimGrossWt']").html(0);
                //    $("input[id='DimGrossWt']").val(0);
                // }
                //if (dimuldData.Table3[0].TotVolumeWeight != 0 && dimuldData.Table3[0].TotVolumeWeight != "") {
                //    $("span[id='DimVolumeWt']").html(isNaN(dimuldData.Table3[0].TotVolumeWeight) ? 0 : dimuldData.Table3[0].TotVolumeWeight);
                //    $("input[id='DimVolumeWt']").val(isNaN(dimuldData.Table3[0].TotVolumeWeight) ? 0 : dimuldData.Table3[0].TotVolumeWeight);
                //} else {
                //    $("span[id='DimVolumeWt']").html(0);
                //    $("input[id='DimVolumeWt']").val(0);
                //}

                $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").each(function (row, tr) {
                    $(tr).find("input[id^='Unit']").each(function () {
                        cfi.AutoComplete($(this).attr("name"), "UnitCode", "MeasurementUnitCode", "SNo", "UnitCode", ["UnitCode"], ResetLWH, "contains");
                        $(this).removeAttr("style");
                        $(this).attr("width", "50px");
                    });
                });


                $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").each(function (row, tr) {
                    //debugger;
                    $(tr).find("input[id*='Text_Unit']").css("width", "50px");
                    $(tr).find("input[id*='Text_ULDTypeSNo']").css("width", "60px");
                    //if ($(tr).find("a[id^=hUldInfo]").val() == undefined) {
                    //    var ULDNo = $(tr).find("input[id^='Text_ULDTypeSNo']").val() + $(tr).find("input[id^='ULDNo']").val() + $(tr).find("input[id^='OwnerCode']").val();
                    //    $(tr).find("input[id^='UGrossWeight']").after("<a href='#' style='padding-left:5px;' id='hUldInfo' rel='" + ULDNo + "' onclick=GetULDDetails('" + ULDNo + "')>ULD Info</a> ");
                    //}
                    $(tr).find("input[id^='UTareWeight']").attr("disabled", true);
                    $(tr).find("input[id^='UGrossWeight']").attr("disabled", true);
                    $(tr).find("input[id^='_tempUTareWeight']").attr("disabled", true);
                    $(tr).find("input[id^='_tempUGrossWeight']").attr("disabled", true);

                    $(tr).find("td[id^=transAction]").find("i[title='Delete']").unbind("click").bind("click", function (e) {
                        fn_RemoveULDRow(this);
                    });
                    $(tr).find("a[id^='ahref_ClassDetails']").unbind("click").bind("click", function () {
                        GetULDDetails(this);
                    });
                    $(tr).find("a[id^='ahref_ULDGetWeight']").unbind("click").bind("click", function () {
                        GetWeigingWeight(this);
                    });
                    $(tr).find("a[id^='ahref_Equipment']").unbind("click").bind("click", function () {
                        Getequipment(this);
                    });
                    if (row > 0) {
                        //debugger;
                        if ($(tr).find("input[id^='ULDNoSNo']").val() == $(tr).prev().find("input[id^='ULDNoSNo']").val()) {
                            //$(tr).find("span[id^='SLINo']").css("display", "none");
                            //$(tr).find("input[id^='ULDNo']").closest('td').find('span').css("display", "none");
                            //$(tr).find("input[id*='SLACPieces']").css("display", "none");
                            //$(tr).find("input[id*='ULDTypeSNo']").closest('td').find('span').css("display", "none");
                            //$(tr).find("input[id*='OwnerCode']").css("display", "none");
                            //$(tr).find("input[id*='ULDPackingTypeSNo']").closest('td').find('span').css("display", "none");
                            //$(tr).find("input[id*='ULDNo']").css("display", "none");
                            //$(tr).find("input[id*='UGrossWeight']").css("display", "none");
                            //$(tr).find("input[id*='Text_Unit']").css("width", "147px");
                            //$(tr).find("input[id^='ULDLength']").attr('readonly', false);
                            //$(tr).find("input[id^='ULDWidth']").attr('readonly', false);
                            //$(tr).find("input[id^='ULDHeight']").attr('readonly', false);

                            //$(tr).find("input[id*='ULDInfo']").css("display", "none");
                            $(tr).find("a[id='hUldInfo']").css("display", "none");
                            $(tr).find("span[id^='SLINo']").css("display", "none");
                            $(tr).find("span[id^='HAWBNo']").css("display", "none");
                            $(tr).find("input[id^='ULDNo']").closest('td').find('span').css("display", "none");
                            $(tr).find("input[id*='_tempSLACPieces']").hide();
                            $(tr).find("input[id*='SLACPieces']").css("display", "none");
                            $(tr).find("input[id*='ULDTypeSNo']").closest('td').find('span').css("display", "none");
                            $(tr).find("input[id*='OwnerCode']").css("display", "none");
                            // $(tr).find("input[id*='ULDPackingTypeSNo']").closest('td').find('span').css("display", "none");
                            $(tr).find("input[id*='ULDNo']").css("display", "none");
                            $(tr).find("input[id*='_tempUGrossWeight']").css("display", "none");
                            $(tr).find("input[id*='UGrossWeight']").css("display", "none");
                            $(tr).find("input[id^='ULDLength']").attr('readonly', false);
                            $(tr).find("input[id^='ULDWidth']").attr('readonly', false);
                            $(tr).find("input[id^='ULDHeight']").attr('readonly', false);
                            $(tr).find("input[id^='UldVolWt']").attr('readonly', false);
                            $(tr).find("input[id^='CBM']").attr('readonly', false);
                            $(tr).find("span[id*='ClassDetails']").css("display", "none");
                            $(tr).find("a[id^='ahref_ULDGetWeight']").css("display", "none");
                            $(tr).find("a[id^='ahref_Equipment']").css("display", "none");
                            $(tr).find("input[id*='ContourCode']").closest('td').find('span').css("display", "none");
                            $(tr).find("input[id*='ULDSPHCCode']").closest('td').find('span').css("display", "none");
                            $(tr).find("input[id*='_tempULDStartTemperature']").hide();
                            $(tr).find("input[id*='ULDStartTemperature']").css("display", "none");
                            $(tr).find("input[id*='_tempULDEndTemperature']").hide();
                            $(tr).find("input[id*='ULDEndTemperature']").css("display", "none");
                            $(tr).find("input[id*='_tempULDCapturedtemp']").hide();
                            $(tr).find("input[id*='ULDCapturedtemp']").css("display", "none");
                            $(tr).find("div[id^=divMultiULDSPHCCode]").hide();
                            $(tr).find(".k-button").hide();
                            $(tr).find("input[id^=isOverhang]").hide();
                            $(tr).find("input[id*='UCapturedWeight']").css("display", "none");
                            $(tr).find("input[id*='_tempUCapturedWeight']").css("display", "none");
                            $(tr).find("input[id*='UTareWeight']").css("display", "none");
                            $(tr).find("input[id*='_tempUTareWeight']").css("display", "none");

                        }
                    }

                });

                $("#__divslidimension__").keydown(function (event) {
                    if (event.keyCode == 13) {
                        return false;
                    }
                });
                //$("div[id='__divslidimension__']").find("span[id=spnLoadCode]").closest('table').hide();
                ////$("div[id='divareaTrans_sli_sliuldbuildupinfo']").hide();
                //$("div[id='divareaTrans_sli_slioverhangpallet']").hide();
                //$("div[id='__divslidimension__']").find("span[id=spnOvng_MasterCutOffHeight]").closest('table').hide();
                //// $("#divareaTrans_sli_slioverhangpallet").show();


                // BindULDinfoAutoComplete();

                // $("span.k-delete").live("click", function (e) { fn_RemoveRequired(e, "") });

                //saveSLIEQUIPMENTS();
                fn_RemoveRequired();
                if (parseInt(SLICancelledFlag) == 1) {
                    UserSubProcessRightswithoutsubprocess("__divslidimension__", true);
                }
            }
            else {
                ShowMessage('warning', 'Warning - ' + SLICaption + ' Dimension', "Approval for Unloading is pending. Dimension Capture process can not be initiated.", "bottom-right");
                $("#__divslidimension__").html('');
                return;
            }
        },
        error: {

        }

    });

    $('#__divslidimension__ table tr[id="areaTrans_sli_slidimension"]').find("input[id='_tempPieces']").focus();//Append by Maneesh on dated= 10-2-17 purpose= SLI-Auto Fill Focus

}
//Disabled any div by Div ID (Use after Cancel and disabled dim)
function UserSubProcessRightswithoutsubprocess(container, isView) {
    //if view permission is true
    if (isView) {
        $(".btn-success").attr("style", "display:none;");
        $(".btn-danger").attr("style", "display:none;");
        $(".ui-button").closest("td").attr("style", "display:none;");
        $(".btnTrans").closest("td").attr("style", "display:none;");
        //$(".k-icon,.k-delete").replaceWith("");

        $('#' + container).find('input').each(function () {
            var ctrltype = $(this).attr("type");
            var dataRole = $(this).attr("data-role");
            if (ctrltype != "hidden") {
                if (dataRole == "autocomplete") {
                    $(this).parent().parent().replaceWith("<span>" + this.value + "</span>");
                }
                else if (dataRole == "datepicker") {
                    $(this).parent().replaceWith("<span>" + this.value + "</span>");
                }
                else if (ctrltype == "radio") {
                    var name = $(this).attr("name");
                    if ($(this).attr("data-radioval"))
                        $(this).closest("td").html("<span>" + $("input[name='" + name + "']:checked").attr("data-radioval") + "</span>");
                    else
                        $(this).attr("disabled", true);
                }
                else if (ctrltype == "checkbox" || ctrltype == "radio") {// && (this.value == "0" || this.value == "1")
                    $(this).attr("disabled", true);
                }
                else if ($(this).attr("id").indexOf("_temp") >= 0) {
                    $(this).replaceWith("<input type='hidden' id='" + $(this).attr("id") + "' value='" + this.value + "' />");
                }
                else {
                    $(this).replaceWith("<span id='" + $(this).attr("id") + "'>" + this.value + "</span>");
                }
            }

        });

        $('#' + container).find('select').each(function () {
            $(this).replaceWith("<span>" + $("#" + $(this).attr("id") + " :selected").text() + "</span>");
        });

        $('#' + container).find('ul li span').each(function (i, e) {
            $(e).removeClass();
        });

    }
    else {
        $(".btn-success").attr("style", "display:block;");
        $(".btn-danger").attr("style", "display:block;");
        $(".btnTrans").closest("td").attr("style", "display:table-cell;");
        $(".ui-button").closest("td").attr("style", "display:table-cell;");
    }
}

//Check Duplicate ULD in ULD DIMS
var uldLWH = [];
function CheckDuplicateULd(input) {
    // debugger;
    var arrULD = [];
    var flag = false;
    var Currenttr = $(input).closest('tr');
    var CurrentULD = $(Currenttr).find("input[id^='Text_ULDTypeSNo']").val() + "_" + $(Currenttr).find("input[id^='ULDNo']").val() + "_" + $(Currenttr).find("input[id^='OwnerCode']").val().toUpperCase();
    //var ULDNonew = $(Currenttr).find("input[id^='Text_ULDTypeSNo']").val() + $(Currenttr).find("input[id^='ULDNo']").val() + $(Currenttr).find("input[id^='OwnerCode']").val();
    //$(Currenttr).find("a[id^='hUldInfo']").removeAttr("onclick");
    //$(Currenttr).find("a[id^='hUldInfo']").attr("onclick", "GetULDDetails('" + ULDNonew.toUpperCase() + "')");


    if ($(Currenttr).find("input[id^='ULDTypeSNo']").val() != "" && $(Currenttr).find("input[id^='ULDNo']").val() != "" && $(Currenttr).find("input[id^='OwnerCode']").val() != "") {
        $("div[id$='divareaTrans_sli_sliulddimension']").find("tr[id^='areaTrans_sli_sliulddimension']").each(function (row, tr) {
            //  debugger;
            var PreULd;
            if ($(Currenttr).attr("linkuld") != undefined) {
                if ($(tr).attr("rel") != CurrentULD) {
                    if ($(tr).attr("rel") == $(Currenttr).attr("linkuld")) {// && $(Currenttr).attr("linkuld") == CurrentULD
                        $("tr[rel='" + $(tr).attr("rel") + "']").remove();
                        $(Currenttr).find("input[id^='SLACPieces']").val("");
                        $(Currenttr).find("input[id^='_tempSLACPieces']").val("");
                        $(Currenttr).find("input[id^='_tempUGrossWeight']").val("");
                        $(Currenttr).find("input[id^='UGrossWeight']").val("");
                        fn_ValidateSLACPCS('#' + $(Currenttr).find("input[id^='SLACPieces']").attr("id"));
                        $(Currenttr).attr("linkuld", CurrentULD);
                        //$(tr).attr("rel", CurrentULD); 
                        //$(tr).find("input[id^='ULDTypeSNo']").val($(Currenttr).find("input[id^='ULDTypeSNo']").val());
                        //$(tr).find("input[id^='ULDNo']").val($(Currenttr).find("input[id^='ULDNo']").val());
                        //$(tr).find("input[id^='OwnerCode']").val($(Currenttr).find("input[id^='OwnerCode']").val().toUpperCase());
                    }
                }
            }
            if ($(tr).attr("rel") == undefined) {
                arrULD.push($(tr).find("input[id^='Text_ULDTypeSNo']").val() + "_" + $(tr).find("input[id^='ULDNo']").val() + "_" + $(tr).find("input[id^='OwnerCode']").val().toUpperCase());
            }
            //if ($(tr).prev().attr("id") != $(Currenttr).attr("id") && $(tr).prev().attr("rel") == CurrentULD) {
            //    PreULd = $(tr).prev().find("input[id^='ULDTypeSNo']").val() + "_" + $(tr).prev().find("input[id^='ULDNo']").val() + "_" + $(tr).prev().find("input[id^='OwnerCode']").val().toUpperCase();
            //    if (PreULd == CurrentULD && $(Currenttr).find("input[id^='OwnerCode']").val() != "") {
            //        $(Currenttr).find("input[id^='OwnerCode']").val("");
            //        ShowMessage('warning', 'Warning - ULD Details', "ULD details already exists.", "bottom-right");
            //        flag = true;
            //    }
            //}
            //else {
            var k = 0;
            for (var i = 0; i < arrULD.length; i++) {
                if (CurrentULD == arrULD[i]) {
                    k = k + 1;
                }
            }
            if (k > 1) {
                $(Currenttr).find("input[id^='OwnerCode']").val("");
                ShowMessage('warning', 'Warning - ULD Details', "ULD details already exists.", "bottom-right");
                flag = false;
                arrULD = [];
            }
            //}

        });
    }
    if (flag == false) {
        var ULDType = $(Currenttr).find("input[id^='Text_ULDTypeSNo']").val();
        var ULDNo = $(Currenttr).find("input[id^='ULDNo']").val();
        var OwnerCode = $(Currenttr).find("input[id^='OwnerCode']").val();
        var ULDSHCCode = Currenttr.find("input[id^='Multi_ULDSPHCCode']").val() || "" + "," + Currenttr.find("input[id^='ULDSPHCCode']").val() || "";

        if (ULDType != "" && ULDNo != "" && OwnerCode != "") {
            $.ajax({
                url: "Services/Shipment/SLInfoService.svc/ValidateULD", async: false, type: "get", dataType: "json", cache: false,
                data: { ULDType: ULDType, ULDNo: ULDNo, OwnerCode: OwnerCode, SLISNo: currentslisno, ULDSHCCode: ULDSHCCode, CitySNo: userContext.CitySNo },
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var Res = JSON.parse(result);
                    if (Res.Table0[0].Column1 == "0") {
                        $(Currenttr).find("input[id^='OwnerCode']").val("");
                        $(Currenttr).find("input[id^='ULDNo']").val("");
                        ShowMessage('warning', 'Warning - ULD Details', "ULD No does not exist/Not Available.", "bottom-right");
                    }
                    else if (Res.Table0[0].Column1 == "2") {
                        $(Currenttr).find("input[id^='OwnerCode']").val("");
                        $(Currenttr).find("input[id^='ULDNo']").val("");
                        ShowMessage('warning', 'Warning - ULD Details', "ULD No is Non-Serviceable", "bottom-right");
                    }
                    else if (Res.Table0[0].Column1 == "3") {
                        if (confirm("ULD '" + $(Currenttr).find("input[id^='Text_ULDTypeSNo']").val().toUpperCase() + ULDNo + OwnerCode.toUpperCase() + "' is issued to forwarder  '" + Res.Table0[0].AgentName.toUpperCase() + "' on '" + Res.Table0[0].IssuedDate.toUpperCase() + "'. Do you wish to continue?")) {
                        }
                        else {
                            $(Currenttr).find("input[id^='OwnerCode']").val("");
                            $(Currenttr).find("input[id^='ULDNo']").val("");
                        }
                    }
                    else if (Res.Table0[0].Column1 == "4") {
                        // var ComULDNo = ULDType.toUpperCase() + ULDNo + OwnerCode.toUpperCase();
                        if (confirm("ULD '" + $(Currenttr).find("input[id^='Text_ULDTypeSNo']").val().toUpperCase() + ULDNo + OwnerCode.toUpperCase() + "' does not belong to '" + Res.Table0[0].AirlineName.toUpperCase() + "'. Is Prior Approval received from respective carrier.")) {
                            if ($("#txtUldremark").val() == undefined) {
                                $("#UldRemarks").append("<input type=textarea id=txtUldremark class=k-input k-state-default transSection  autofocus/> &nbsp;<center><input type=button id=btnuldremarks name=Submit value=Submit class=btn btn-block btn-success btn-sm onclick=saveULDRemarks('" + $(Currenttr).find("input[id^='Text_ULDTypeSNo']").val().toUpperCase() + ULDNo + OwnerCode.toUpperCase() + "') /></center>");
                            }
                            cfi.PopUp("UldRemarks", "ULD Remark", 200, PopUpOnOpen, PopUpOnClose, 60);
                        }
                        else {
                            $(Currenttr).find("input[id^='OwnerCode']").val("");
                            $(Currenttr).find("input[id^='ULDNo']").val("");
                        }
                    }
                    else if (Res.Table0[0].Column1 == "5") {

                        var SHC1 = Res.Table1[0].SHC1.toUpperCase();
                        var SHC2 = Res.Table1[0].SHC2.toUpperCase();
                        var ULDType = Res.Table1[0].ULDType.toUpperCase();
                        $(Currenttr).find("input[id^='Text_ULDTypeSNo']").val("");
                        $(Currenttr).find("input[id^='ULDTypeSNo']").val("");
                        ShowMessage('warning', 'Warning - ULD SHC Incompatibility', 'SHC "' + SHC1 + '" and "' + SHC2 + '" are not compatible with ULD "' + ULDType + '".', "bottom-right");
                    }
                    else {
                        // ShowMessage('success', 'success - ULD Details', "ULD No exists.", "bottom-right");
                    }
                }
            });

            var ULDTypeSNo = $(Currenttr).find("input[id^=Text_ULDTypeSNo]").val() + $(Currenttr).find("input[id^=ULDNo]").val() + $(Currenttr).find("input[id^=OwnerCode]").val() || "0";
            if (ULDTypeSNo != "0") {
                $.ajax({

                    url: "Services/Shipment/SLInfoService.svc/CheckULDLWH?ULDTypeSNo=" + ULDTypeSNo, async: false, type: "get", dataType: "json", cache: false,
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        var uldLWHarr = jQuery.parseJSON(result);
                        uldLWH.push(uldLWHarr.Table0[0]);

                        //uldLWH.push(uldLWHarr.Table0[0]);
                    }
                });
            }


        }
    }



}

//If ULD is Another Airline and we insert then Uld Remraks is mandatory in SLI ULD DIms for this ULD
function saveULDRemarks(ULDNo) {
    //debugger;
    $.ajax({
        url: "Services/Shipment/SLInfoService.svc/saveULDRemarks", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ SLISNo: currentslisno, ULDNo: ULDNo, Remark: $("#txtUldremark").val() }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result == "1") {
                ShowMessage('success', 'Success - ULD Remarks', "Processed Successfully", "bottom-right");
                $("#UldRemarks").text('');
                $(".k-window").hide();
                $(".k-overlay").remove();
                $("#divPopUpBackground").remove();
            }
        }
    });


}

//ULD DIM SPlit Calculations
function fn_CalculateSplitTotalULDPcs(input) {
    //debugger;
    var flag = false;
    var CurrentSLISNo = 0;
    var trRow = $(input).closest('tr');

    CurrentSLISNo = $(input).parent().parent().find("input[id^='ULDTypeSNo']").val() + "_" + $(input).parent().parent().find("input[id^='ULDNo']").val() + "_" + $(input).parent().parent().find("input[id^='OwnerCode']").val() || $(input).find("td[id^='tdSNoCol']").text();

    if ($(input).val() != "") {
        var totalPcs = parseInt($(input).parent().parent().find("input[id^='UldoldPieces']").val()) || $(input).parent().parent().find("input[id*='SLACPieces']").val();//.find("label").text().replace("/", ""));
        var PlannedPcs = 0, PlannedActualPcs = 0;
        var row_index = $(input).closest('tr').index();
        ///18
        SLACPcs = $(input).parent().parent().find("input[id*='SLACPieces']").val() == "" ? 0 : $(input).parent().parent().find("input[id*='SLACPieces']").val();
        totalPcs = parseInt(SLACPcs) > parseInt(totalPcs) ? SLACPcs : totalPcs;
        ////18
        $(input).closest('tbody').find("tr").each(function (row, tr) {
            if ($(tr).find("input[id^='ULDTypeSNo']").val() + "_" + $(tr).find("input[id^='ULDNo']").val() + "_" + $(tr).find("input[id^='OwnerCode']").val() == CurrentSLISNo) {
                if (row != row_index) {
                    PlannedActualPcs = PlannedActualPcs + parseInt($(tr).find("input[id^='UldPieces']").val());
                }
                else if ($(input).find("td[id^='tdSNoCol']").text() == CurrentSLISNo) {
                    if (row != row_index) {
                        PlannedActualPcs = PlannedActualPcs + parseInt($(tr).find("input[id^='UldPieces']").val());
                    }
                }
                PlannedPcs = PlannedPcs + parseInt($(tr).find("input[id^='UldPieces']").val());
            }
        });

        if (isNaN(PlannedPcs) == false && PlannedPcs > 0) {
            $(input).closest('tr').find("input[id*='ULDLength']").css("border-color", "red");
            $(input).closest('tr').find("input[id*='ULDWidth']").css("border-color", "red");
            $(input).closest('tr').find("input[id*='ULDHeight']").css("border-color", "red");


            //$(input).closest('tr').find("input[id*='ULDLength']").attr("data-valid", "required");
            //$(input).closest('tr').find("input[id*='ULDLength']").attr("data-valid-msg", "Enter Length");
            // $(input).closest('tr').find("input[id*='ULDWidth']").attr("data-valid", "required");
            //$(input).closest('tr').find("input[id*='ULDWidth']").attr("data-valid-msg", "Enter Width");
            //$(input).closest('tr').find("input[id*='ULDHeight']").attr("data-valid", "required");
            // $(input).closest('tr').find("input[id*='ULDHeight']").attr("data-valid-msg", "Enter Height");
            $(input).closest('tr').find("tr").focus();
        }

        if ($.isNumeric($(input).val())) {
            if ((PlannedPcs > totalPcs) || (parseInt($(input).val()) == 0)) {
                alert("Total Pieces cannot be greater than SLAC");
                ShowMessage('warning', 'Warning -Total Pieces cannot be greater than SLAC', "", "bottom-right");
                $(input).val(totalPcs - PlannedActualPcs);
                flag = false;
                if (parseInt($(input).val()) == 0) {
                    $(input).val("");
                }
            }

        }
        else {
            ShowMessage('warning', 'Warning - Enter Valid Number ', "", "bottom-right");
            $(input).val(totalPcs);
            flag = false;


        }


    }

    return flag;
}

//Validate SLAC PCS
function fn_ValidateSLACPCS(input) {
    var tr = $(input).closest('tr');
    var SLACPcs, PCS;
    var PlannedPcs = 0, PlannedActualPcs = 0;
    SLACPcs = $(input).val() == "" ? 0 : $(input).val();
    PCS = $(input).parent().parent().find("input[id^='UldoldPieces']").val() || 0;

    if (PCS == 0) {
        PCS = $(input).parent().parent().find("input[id*='UldPieces']").val() || 0;
    }
    var row_index = $(input).closest('tr').index();
    var CurrentSLISNo = $(input).parent().parent().find("input[id^='ULDTypeSNo']").val() + "_" + $(input).parent().parent().find("input[id^='ULDNo']").val() + "_" + $(input).parent().parent().find("input[id^='OwnerCode']").val() || $(input).find("td[id^='tdSNoCol']").text();
    $(input).closest('tbody').find("tr").each(function (row, tr) {
        if ($(tr).find("input[id^='ULDTypeSNo']").val() + "_" + $(tr).find("input[id^='ULDNo']").val() + "_" + $(tr).find("input[id^='OwnerCode']").val() == CurrentSLISNo) {
            if (row != row_index) {
                PlannedActualPcs = PlannedActualPcs + parseInt($(tr).find("input[id^='UldPieces']").val());
            }
            else if ($(input).find("td[id^='tdSNoCol']").text() == CurrentSLISNo) {
                if (row != row_index) {
                    PlannedActualPcs = PlannedActualPcs + parseInt($(tr).find("input[id^='UldPieces']").val());
                }
            }
            PlannedPcs = PlannedPcs + parseInt($(tr).find("input[id^='UldPieces']").val());
        }
    });
    if (parseInt(SLACPcs) < parseInt(PCS)) {
        var i = 0;
        if (SLACPcs == 0) {
            //debugger
            var tr = $(input).closest('tr').next('tr');
            $(input).parent().parent().find("input[id*='UldPieces']").val("");
            $(input).parent().parent().find("input[id*='ULDLength']").val("");
            $(input).parent().parent().find("input[id*='ULDWidth']").val("");
            $(input).parent().parent().find("input[id*='ULDHeight']").val("");
            $(input).parent().parent().find("input[id*='UldoldPieces']").val("");

            //$(input).parent().parent().find(".icon-trans-plus-sign").show();               
            // $(input).parent().parent().find(".icon-trans-plus-sign").removeAttr("style");

            $("tr[rel='" + $(tr).attr("rel") + "']").remove();
            $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").each(function (row, tr) {
                $(tr).find('td:eq(0)').text(row + 1);;
            });

            $(input).parent().parent().find("input[id*='ULDLength']").css("border-color", "");
            $(input).parent().parent().find("input[id*='ULDWidth']").css("border-color", "");
            $(input).parent().parent().find("input[id*='ULDHeight']").css("border-color", "");

            // $(input).parent().parent().find("input[id*='ULDLength']").removeAttr("data-valid", "required");
            //// $(input).parent().parent().find("input[id*='ULDLength']").removeAttr("data-valid-msg", "Enter Length");
            // $(input).parent().parent().find("input[id*='ULDWidth']").removeAttr("data-valid", "required");
            // //$(input).parent().parent().find("input[id*='ULDWidth']").removeAttr("data-valid-msg", "Enter Width");
            // $(input).parent().parent().find("input[id*='ULDHeight']").removeAttr("data-valid", "required");
            // $(input).parent().parent().find("input[id*='ULDHeight']").removeAttr("data-valid-msg", "Enter Height");
            $(input).parent().parent().find("input[id*='ULDLength']").focus();
            $(".bVErrMsgContainer").text('');
            CalculateULDVolume(input);
            CalculateVolume(input);
        }
        if (SLACPcs > 0) {
            alert("SLAC Pieces should not be less than ULD Pieces");
            $(input).val(PCS);
        }
    }
    if (PCS > 0) {
        if (parseInt(SLACPcs) > parseInt(PlannedPcs)) {
            var tr = $(input).closest('tr').next('tr');
            $(input).parent().parent().find("input[id*='UldPieces']").val("");
            $(input).parent().parent().find("input[id*='ULDLength']").val("");
            $(input).parent().parent().find("input[id*='ULDWidth']").val("");
            $(input).parent().parent().find("input[id*='ULDHeight']").val("");
            $(input).parent().parent().find("input[id*='UldoldPieces']").val("");
            // $(input).parent().parent().find(".icon-trans-plus-sign").show();
            //// if ($(input).closest('tr').find(".icon-trans-plus-sign").length == 0) {

            //      $(input).parent().parent().find(".icon-trans-plus-sign").removeAttr("style");
            // }
            $("tr[rel='" + $(tr).attr("rel") + "']").remove();
            $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").each(function (row, tr) {
                $(tr).find('td:eq(0)').text(row + 1);;
            });
            $(input).parent().parent().find("input[id*='ULDLength']").css("border-color", "");
            $(input).parent().parent().find("input[id*='ULDWidth']").css("border-color", "");
            $(input).parent().parent().find("input[id*='ULDHeight']").css("border-color", "");
            // $(input).parent().parent().find("input[id*='ULDLength']").removeAttr("data-valid", "required");
            //// $(input).parent().parent().find("input[id*='ULDLength']").removeAttr("data-valid-msg", "Enter Length");
            // $(input).parent().parent().find("input[id*='ULDWidth']").removeAttr("data-valid", "required");
            //// $(input).parent().parent().find("input[id*='ULDWidth']").removeAttr("data-valid-msg", "Enter Width");
            // $(input).parent().parent().find("input[id*='ULDHeight']").removeAttr("data-valid", "required");
            // $(input).parent().parent().find("input[id*='ULDHeight']").removeAttr("data-valid-msg", "Enter Height");
            $(input).parent().parent().find("input[id*='ULDLength']").focus();
            $(".bVErrMsgContainer").text('');
            CalculateULDVolume(input);
            CalculateVolume(input);
        }

    }
    if (PCS > 0) {
        if (parseInt(SLACPcs) < parseInt(PlannedPcs)) {
            var tr = $(input).closest('tr').next('tr');
            $(input).parent().parent().find("input[id*='UldPieces']").val("");
            $(input).parent().parent().find("input[id*='ULDLength']").val("");
            $(input).parent().parent().find("input[id*='ULDWidth']").val("");
            $(input).parent().parent().find("input[id*='ULDHeight']").val("");
            $(input).parent().parent().find("input[id*='UldoldPieces']").val("");
            // $(input).parent().parent().find(".icon-trans-plus-sign").show();
            //// if ($(input).closest('tr').find(".icon-trans-plus-sign").length == 0) {               
            //      $(input).parent().parent().find(".icon-trans-plus-sign").removeAttr("style");
            //}
            $("tr[rel='" + $(tr).attr("rel") + "']").remove();
            $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").each(function (row, tr) {
                $(tr).find('td:eq(0)').text(row + 1);;
            });
            $(input).parent().parent().find("input[id*='ULDLength']").css("border-color", "");
            $(input).parent().parent().find("input[id*='ULDWidth']").css("border-color", "");
            $(input).parent().parent().find("input[id*='ULDHeight']").css("border-color", "");
            // $(input).parent().parent().find("input[id*='ULDLength']").removeAttr("data-valid", "required");
            //// $(input).parent().parent().find("input[id*='ULDLength']").removeAttr("data-valid-msg", "Enter Length");
            // $(input).parent().parent().find("input[id*='ULDWidth']").removeAttr("data-valid", "required");
            // //$(input).parent().parent().find("input[id*='ULDWidth']").removeAttr("data-valid-msg", "Enter Width");
            // $(input).parent().parent().find("input[id*='ULDHeight']").removeAttr("data-valid", "required");
            //$(input).parent().parent().find("input[id*='ULDHeight']").removeAttr("data-valid-msg", "Enter Height");
            $(input).parent().parent().find("input[id*='ULDLength']").focus();
            $(".bVErrMsgContainer").text('');
            CalculateULDVolume(input);
            CalculateVolume(input);
        }
    }
    $("div[id$='divareaTrans_sli_sliulddimension']").find("tr[id^='areaTrans_sli_sliulddimension']").each(function (row, tr) {
        $(tr).find(".icon-trans-plus-sign").hide();
        var MaxtrLength = parseInt($("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").closest('tr').length);
        if ((MaxtrLength - 1) == row) {
            $(tr).find(".icon-trans-plus-sign").show();
            //$(tr).find("td:last div").append("<i class='btnTrans btnTrans-default icon-trans-plus-sign' title='Add More'></i>");
            $(tr).find(".icon-trans-plus-sign").removeAttr("style");
        }
    });



    if (parseInt(SLACPcs) == 0) {
        $(input).val("");
    }
}

//Split Pices in  ULD ROW For same ULD
function fn_AddNewULDRow(input) {

    //$(input).closest('tbody').find("tr").find("input[id*=UldPieces]").unbind("keydown").bind("keydown", function () {
    //    ISNumeric(this);
    //});
    $(input).closest('tbody').find("tr").find("input[id*=UldPieces]").keydown(function (e) {
        IsNumericNewCheck(e);
    });

    fn_CalculateSplitTotalULDPcs(input);
    // debugger
    var TotalPlanPcs = 0;
    var CurrentTotalPcs = 0;
    var CurrentSLISNo = 0;
    var SLACPcs = 0;
    if ((parseInt($(input).parent().parent().find("input[id^='UldoldPieces']").val()) || $(input).parent().parent().find("input[id*='SLACPieces']").val()) != undefined && ($(input).parent().parent().find("span[id^='UldoldPieces']").val() || $(input).parent().parent().find("input[id*='SLACPieces']").val()) != "") {
        CurrentTotalPcs = parseInt($(input).parent().parent().find("input[id^='UldoldPieces']").val()) || $(input).parent().parent().find("input[id*='SLACPieces']").val();
    }

    SLACPcs = $(input).parent().parent().find("input[id*='SLACPieces']").val() || 0;
    CurrentTotalPcs = parseInt(SLACPcs) > parseInt(CurrentTotalPcs) ? SLACPcs : CurrentTotalPcs;

    CurrentSLISNo = $(input).parent().parent().find("input[id^='ULDTypeSNo']").val() + "_" + $(input).parent().parent().find("input[id^='ULDNo']").val() + "_" + $(input).parent().parent().find("input[id^='OwnerCode']").val() || $(input).find("td[id^='tdSNoCol']").text();

    $(input).closest('tbody').find("tr").each(function (row, tr) {
        if ($(tr).find("input[id^='ULDTypeSNo']").val() + "_" + $(tr).find("input[id^='ULDNo']").val() + "_" + $(tr).find("input[id^='OwnerCode']").val() == CurrentSLISNo) {
            TotalPlanPcs = TotalPlanPcs + parseInt($(tr).find("input[id^='UldPieces']").val());
        }
    });

    if (TotalPlanPcs > CurrentTotalPcs) {
        $(input).val('');
        return false;
    }
    if (isNaN(TotalPlanPcs) == true) {
        var tr = $(input).closest('tr');

        var masterrow = $("tr[rel='" + $(tr).attr("rel") + "']").length;
        if (masterrow != undefined && masterrow > 0) {

            $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").each(function (row, tr) {
                var Uldval = $(tr).find("[id^='UldPieces']").val();
                if (Uldval == "") {
                    Uldval = $(tr).find("[id^='UldoldPieces']").val();
                }
                $(tr).find("[id^='UldoldPieces']").val(Uldval);
            });

            if (tr.find("input[id^='ULDTypeSNo']").val() + "_" + tr.find("input[id^='ULDNo']").val() + "_" + tr.find("input[id^='OwnerCode']").val() || tr.find("input[id^='tdSNoCol']").text() == tr.prev().find("input[id^='ULDTypeSNo']").val() + "_" + tr.prev().find("span[id^='ULDNo']").val() + "_" + tr.prev().find("input[id^='OwnerCode']").val() || tr.prev().find("input[id^='tdSNoCol']").text()) {
                tr.prev().find("input[id*='UldPieces']").val(parseInt(tr.prev().find("input[id^='UldoldPieces']").val() || 0) + parseInt(tr.find("input[id^='UldoldPieces']").val() || 0) || 0);
                tr.prev().find("input[id*='UldoldPieces']").val(parseInt(tr.prev().find("input[id^='UldoldPieces']").val() || 0) + parseInt(tr.find("input[id^='UldoldPieces']").val() || 0) || 0);

                // tr.prev().find("td:last div").append("<i class='btnTrans btnTrans-default icon-trans-plus-sign' title='Add More'></i>");
                $(input).closest('tr').remove();
            }
            $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").each(function (row, tr) {
                $(tr).find(".icon-trans-plus-sign").hide();
                $(tr).find('td:eq(0)').text(row + 1);
                var MaxtrLength = parseInt($("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").closest('tr').length);
                if ((MaxtrLength - 1) == row) {
                    $(tr).find(".icon-trans-plus-sign").show();
                    //$(tr).find("td:last div").append("<i class='btnTrans btnTrans-default icon-trans-plus-sign' title='Add More'></i>");
                    $(tr).find(".icon-trans-plus-sign").removeAttr("style");
                }
            });
            CalculateULDVolume(input);
            CalculateVolume(input);

        }
        else {
            $("tr[rel='" + $(input).parent().parent().find("input[id^='ULDTypeSNo']").val() + "_" + $(input).parent().parent().find("input[id^='ULDNo']").val() + "_" + $(input).parent().parent().find("input[id^='OwnerCode']").val() + "']").remove();
            tr.find("input[id*='UldPieces']").val("");
            tr.find("input[id*='ULDLength']").val("");
            tr.find("input[id*='ULDWidth']").val("");
            tr.find("input[id*='ULDHeight']").val("");
            tr.find("input[id*='UldoldPieces']").val("");
            $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").each(function (row, tr) {
                $(tr).find(".icon-trans-plus-sign").hide();
                $(tr).find('td:eq(0)').text(row + 1);
                var MaxtrLength = parseInt($("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").closest('tr').length);
                if ((MaxtrLength - 1) == row) {
                    $(tr).find(".icon-trans-plus-sign").show();
                    //$(tr).find("td:last div").append("<i class='btnTrans btnTrans-default icon-trans-plus-sign' title='Add More'></i>");
                    $(tr).find(".icon-trans-plus-sign").removeAttr("style");
                }
            });
            CalculateULDVolume(input);
            CalculateVolume(input);
        }
        if ($("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").length == 1) {
            cfi.makeTrans("sli_sliulddimension", null, null, BindULDAutoComplete, CalculateVolume, null, null);
        }

    }

    // $(input).closest("tr").find(".icon-trans-plus-sign").hide();
    if (parseInt(CurrentTotalPcs) > TotalPlanPcs) {
        var tr = $(input).closest('tr');
        $(input).closest("tr").find(".icon-trans-plus-sign").hide();
        $(input).closest("tr").find("input[id^='UldoldPieces']").val($(input).closest("tr").find("input[id^='UldPieces']").val());
        var val = $(input).parent().parent().find("input[id^='Text_ULDTypeSNo']").val() + "_" + $(input).parent().parent().find("input[id^='ULDNo']").val() + "_" + $(input).parent().parent().find("input[id^='OwnerCode']").val().toUpperCase();
        $(input).closest("tr").attr("LinkULd", val);
        var trClone = $(input).parent().parent().clone(true);

        if ($(trClone).find("i[title='Delete']").length <= 0) {
            $(trClone).find("td:last div").append("<i class='btnTrans btnTrans-default icon-trans-trash' title='Delete'></i>");
        }

        trClone.attr("rel", val);
        trClone.attr("LinkULd", val);
        trClone.find("input[id^='UldPieces']").val(parseInt(CurrentTotalPcs) - TotalPlanPcs);
        //if ($(input).closest('tr').find(".icon-trans-plus-sign").length == 0) {

        // }
        // cfi.makeTrans("areaTrans_sli_sliulddimension", null, null, null, null, null, null);
        //$(input).parent().parent().find("input[id*='SLACPieces']").attr('disabled', true);

        trClone.find("span[id^='SLINo']").css("display", "none");
        trClone.find("span[id^='HAWBNo']").css("display", "none");
        trClone.find("a[id^='hUldInfo']").css("display", "none");

        trClone.find("input[id^='ULDNo']").closest('td').find('span').css("display", "none");
        trClone.find("input[id*='SLACPieces']").css("display", "none");
        trClone.find("input[id*='ULDTypeSNo']").closest('td').find('span').css("display", "none");
        trClone.find("input[id*='OwnerCode']").css("display", "none");
        //trClone.find("input[id*='ULDPackingTypeSNo']").closest('td').find('span').css("display", "none");
        trClone.find("input[id*='ULDNo']").css("display", "none");
        trClone.find("input[id*='UGrossWeight']").css("display", "none");
        //tr.find("input[id^='UldoldPieces']").val(parseInt(CurrentTotalPcs) - TotalPlanPcs);
        trClone.find("input[id^='UldoldPieces']").val(parseInt(CurrentTotalPcs) - TotalPlanPcs);
        trClone.find("input[id^='ULDLength']").show().attr('readonly', false);
        trClone.find("input[id^='ULDWidth']").show().attr('readonly', false);
        trClone.find("input[id^='ULDHeight']").show().attr('readonly', false);
        trClone.find("input[id^='UldVolWt']").show().attr('readonly', false);
        trClone.find("input[id^='CBM']").show().attr('readonly', false);
        trClone.find("input[id^='ULDLength']").focus();
        trClone.find("input[id^='ULDWidth']").focus();
        trClone.find("input[id^='ULDHeight']").focus();

        trClone.find("input[id^='_tempULDLength']").hide();
        trClone.find("input[id^='_tempULDWidth']").hide();
        trClone.find("input[id^='_tempULDHeight']").hide();
        trClone.find("input[id^='_tempUldVolWt']").hide();
        trClone.find("input[id^='_tempCBM']").hide();
        trClone.find("span[id*='ClassDetails']").css("display", "none");
        trClone.find("a[id^='ahref_ULDGetWeight']").css("display", "none");
        //trClone.find("input[id*='ULDSPHCCode']").data("kendoAutoComplete").enable(false);
        trClone.find("input[id*='ULDSPHCCode']").closest('td').find('span').css("display", "none");
        //trClone.find("input[id*='ULDSPHCCode']").val("");        
        trClone.find("input[id*='_tempULDStartTemperature']").hide();
        trClone.find("input[id*='ULDStartTemperature']").css("display", "none");
        trClone.find("input[id*='_tempULDEndTemperature']").hide();
        trClone.find("input[id*='ULDEndTemperature']").css("display", "none");
        trClone.find("input[id*='_tempULDCapturedtemp']").hide();
        trClone.find("input[id*='ULDCapturedtemp']").css("display", "none");
        trClone.find(".k-button").remove();
        trClone.find("div[id^=divMultiULDSPHCCode]").remove();
        trClone.find("input[id*='ULDSPHCCode']").val("");
        trClone.find("input[id*='Multi_ULDSPHCCode']").val("");
        trClone.find("input[id*='UCapturedWeight']").css("display", "none");
        trClone.find("input[id*='_tempUCapturedWeight']").css("display", "none");
        trClone.find("input[id*='UTareWeight']").css("display", "none");
        trClone.find("input[id*='_tempUTareWeight']").css("display", "none");
        trClone.find("a[id^='ahref_Equipment']").css("display", "none");
        trClone.find("input[id*='ContourCode']").closest('td').find('span').css("display", "none");

        //trClone.find("td[id^=transAction]").find("i[title='Add More']").show();
        trClone.find("input[id*='StartTemperature']").removeAttr('required', 'required');
        trClone.find("input[id*='StartTemperature']").removeAttr('data-valid', 'required');
        trClone.find("input[id*='EndTemperature']").removeAttr('required', 'required');
        trClone.find("input[id*='EndTemperature']").removeAttr('data-valid', 'required');
        trClone.find("input[id*='Capturedtemp']").removeAttr('required', 'required');
        trClone.find("input[id*='Capturedtemp']").removeAttr('data-valid', 'required');


        trClone = trClone.removeAttr("id");
        trClone = trClone.attr("id", "areaTrans_sli_sliulddimension" + "_" + $("td[id^='tdSNoCol']").last().text());


        $(input).parent().parent().after(trClone);
        trClone.find("input[id^=isOverhang]").hide();
        $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").each(function (row, tr) {
            $(tr).find("[id^='Unit']").attr('id', 'Unit' + row)
            $(tr).find("[id^='Unit']").attr('name', 'Unit' + row)
            $(tr).find("[id^='Text_Unit']").attr('id', 'Text_Unit' + row)
            $(tr).find("[id^='Text_Unit']").attr('name', 'Text_Unit' + row)

            $(tr).find("[id^='_tempUldPieces']").attr('id', '_tempUldPieces' + row)
            $(tr).find("[id^='_tempUldPieces']").attr('name', '_tempUldPieces' + row)
            $(tr).find("[id^='UldPieces']").attr('id', 'UldPieces' + row)
            $(tr).find("[id^='UldPieces']").attr('name', 'UldPieces' + row)

            $(tr).find("[id^='_tempULDLength']").attr('id', '_tempULDLength' + row)
            $(tr).find("[id^='_tempULDLength']").attr('name', '_tempULDLength' + row)
            $(tr).find("[id^='ULDLength']").attr('id', 'ULDLength' + row)
            $(tr).find("[id^='ULDLength']").attr('name', 'ULDLength' + row)


            $(tr).find("[id^='_tempULDWidth']").attr('id', '_tempULDWidth' + row)
            $(tr).find("[id^='_tempULDWidth']").attr('name', '_tempULDWidth' + row)
            $(tr).find("[id^='ULDWidth']").attr('id', 'ULDWidth' + row)
            $(tr).find("[id^='ULDWidth']").attr('name', 'ULDWidth' + row)

            $(tr).find("[id^='_tempULDHeight']").attr('id', '_tempULDHeight' + row)
            $(tr).find("[id^='_tempULDHeight']").attr('name', '_tempULDHeight' + row)
            $(tr).find("[id^='ULDHeight']").attr('id', 'ULDHeight' + row)
            $(tr).find("[id^='ULDHeight']").attr('name', 'ULDHeight' + row)


            $(tr).find("[id^='_tempUldVolWt']").attr('id', '_tempUldVolWt' + row)
            $(tr).find("[id^='_tempUldVolWt']").attr('name', '_tempUldVolWt' + row)
            $(tr).find("[id^='UldVolWt']").attr('id', 'UldVolWt' + row)
            $(tr).find("[id^='UldVolWt']").attr('name', 'UldVolWt' + row)

            $(tr).find("[id^='_tempCBM']").attr('id', '_tempCBM' + row)
            $(tr).find("[id^='_tempCBM']").attr('name', '_tempCBM' + row)
            $(tr).find("[id^='CBM']").attr('id', 'CBM' + row)
            $(tr).find("[id^='CBM']").attr('name', 'CBM' + row)


            $(tr).find('td:eq(0)').text(row + 1);
            $(tr).find("td[id^=transAction]").find("i[title='Add More']").hide();
            $(tr).find("td[id^=transAction]").find("i[title='Delete']").unbind("click").bind("click", function (e) {
                fn_RemoveULDRow(this);
            });


            var MaxtrLength = parseInt($("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").closest('tr').length);
            if ((MaxtrLength - 1) == row) {
                $(tr).find(".icon-trans-plus-sign").show();
                //trClone.find("td:last div").append("<i class='btnTrans btnTrans-default icon-trans-plus-sign' title='Add More'></i>");
                $(tr).find(".icon-trans-plus-sign").removeAttr("style");
            }



            //$(tr).find("td[id^=transAction]").find("i[title='Add More']").unbind("click").bind("click", function (e) {
            //    fn_AddRow(this);
            //});
            //$(tr).find("input[id^='ULDNo']").each(function () {
            //    cfi.AutoComplete($(this).attr("name"), "ULDNo", "v_AvailableULD", "SNo", "ULDNo", ["ULDNo"], null, "contains");
            //});
            //$(tr).find("td:last div").append("<i class='btnTrans btnTrans-default icon-trans-plus-sign' title='Add More'></i>");
            $(tr).find("input[id^='Unit']").each(function () {
                cfi.AutoComplete($(this).attr("name"), "UnitCode", "MeasurementUnitCode", "SNo", "UnitCode", ["UnitCode"], ResetLWH, "contains");
                $("input[id^='Unit']").css("width", "50px");
            });

            $(tr).find("input[id^=UldPieces]").keydown(function (e) {
                IsNumericNewCheck(e);
            });
            $(tr).find("input[id^=ULDLength]").keydown(function (e) {
                IsNumericNewCheck(e);
            });
            $(tr).find("input[id^=ULDWidth]").keydown(function (e) {
                IsNumericNewCheck(e);
            });
            $(tr).find("input[id^=ULDHeight]").keydown(function (e) {
                IsNumericNewCheck(e);
            });

            // cfi.makeTrans("sli_sliulddimension", null, null, BindULDAutoComplete, CalculateVolume, null, null);
            $(tr).find("input[id^='ULDLength']").each(function () {
                $(this).unbind("blur").bind("blur", function () {
                    CalculateULDVolume(this);
                });
            });
            $(tr).find("input[id^='ULDWidth']").each(function () {
                $(this).unbind("blur").bind("blur", function () {
                    CalculateULDVolume(this);
                });
            });
            $(tr).find("input[id^='ULDHeight']").each(function () {
                $(this).unbind("blur").bind("blur", function () {
                    CalculateULDVolume(this);
                });
            });

        });
        //$("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").each(function (row, tr) {
        //    //  $(tr).last().find("td[id^=transAction]").find("i[title='Add More']").show();
        //    $(tr).find("td:last div").append("<i class='btnTrans btnTrans-default icon-trans-plus-sign' title='Add More'></i>");
        //});

        // cfi.makeTrans("sli_sliulddimension", null, null, BindULDAutoComplete, CalculateVolume, null, null);

        $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").find("input[id*='Text_Unit']").closest('span').css('width', '');
        $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").find("input[id*='Text_ULDTypeSNo']").closest('span').css('width', '')


    }

    if (isNaN(TotalPlanPcs) == false) {
        CalculateULDVolume();
    }
}

function BindOverhangAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='OverhangDirection']").each(function () {
        cfi.AutoCompleteByDataSource($(this).attr("name").replace("Text_", ""), OverhangDirection, null, null);
    });

    $(elem).find("input[id^='OverhangMesUnit']").each(function () {
        cfi.AutoCompleteByDataSource($(this).attr("name").replace("Text_", ""), OverhangMesUnit, null, null);
    });

    $(elem).find("input[id^='OverhangType']").each(function () {
        cfi.AutoCompleteByDataSource($(this).attr("name").replace("Text_", ""), OverhangType, null, null);
    });

    $('span.k-widget.k-numerictextbox.transSection').width(55);

    $("#divULDInfoforSLI").find("#divareaTrans_sli_slioverhangpallet").find("table").find("tr").find("input[id^=OverhangWidth").keydown(function (e) {
        IsNumericNewCheck(e);
    });
    //$("div[id$='divareaTrans_sli_slioverhangpallet']").find("[id^='areaTrans_sli_slioverhangpallet']").each(function () {
    //    $(this).find("input[id^='Text_OverhangDirection']").width(120);
    //    $(this).find("input[id^='Text_OverhangMesUnit']").width(120);
    //    $(this).find("input[id^='Text_OverhangType']").width(120);

    //});
    $("div[id=divULDInfoforSLI]").find("div[id$=divareaTrans_sli_slioverhangpallet]").find("tr[id^=areaTrans_sli_slioverhangpallet]").find("input[id^='OverhangOtherInfo_']").hide();

}

function BindOverhangAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='OverhangDirection']").each(function () {
        cfi.AutoCompleteByDataSource($(this).attr("name").replace("Text_", ""), OverhangDirection, null, null);
    });

    $(elem).find("input[id^='OverhangMesUnit']").each(function () {
        cfi.AutoCompleteByDataSource($(this).attr("name").replace("Text_", ""), OverhangMesUnit, null, null);
    });

    $(elem).find("input[id^='OverhangType']").each(function () {
        cfi.AutoCompleteByDataSource($(this).attr("name").replace("Text_", ""), OverhangType, null, null);
    });

    $('span.k-widget.k-numerictextbox.transSection').width(55);

    $('input[type="text"][id^="OverhangWidth"]').on("keypress keyup blur", function (event) {

        $(this).val($(this).val().replace(/[^\d].+/, ""));
        if ((event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    });
    $("#Ovng_MasterCutOffHeight").on("keypress keyup blur", function (event) { // Cut off Height

        $(this).val($(this).val().replace(/[^\d].+/, ""));
        if ((event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    });
    //$("div[id$='divareaTrans_sli_slioverhangpallet']").find("[id^='areaTrans_sli_slioverhangpallet']").each(function () {
    //    $(this).find("input[id^='Text_OverhangDirection']").width(120);
    //    $(this).find("input[id^='Text_OverhangMesUnit']").width(120);
    //    $(this).find("input[id^='Text_OverhangType']").width(120);

    //});
    //$('input[type="text"][id^="OverhangOtherInfo"]:not(:first)').hide();

    $("div[id=divULDInfoforSLI]").find("div[id$=divareaTrans_sli_slioverhangpallet]").find("tr[id^=areaTrans_sli_slioverhangpallet]").find("input[id^='OverhangOtherInfo_']").hide();
}

//Remove ULD Row on DIm
function fn_RemoveULDRow(input) {
    //debugger;
    $(input).find("a[id^='ahref_ClassDetails']").unbind("click").bind("click", function () {
        GetULDDetails(this);
    });
    var OLDAction;
    var tr = $(input).closest('tr');
    if ((tr.find("input[id^='ULDTypeSNo']").val() + "_" + tr.find("input[id^='ULDNo']").val() + "_" + tr.find("input[id^='OwnerCode']").val() == tr.prev().find("input[id^='ULDTypeSNo']").val() + "_" + tr.prev().find("input[id^='ULDNo']").val() + "_" + tr.prev().find("input[id^='OwnerCode']").val()) || (tr.find("td[id^='tdSNoCol']").text() == tr.prev().find("td[id^='tdSNoCol']").text())) {
        if (confirm('Are you sure, you wish to remove selected row?')) {
            if (isNaN(tr.find("input[id^='UldPieces']").val()) == true) {
                tr.find("input[id^='UldPieces']").val(0);
            }
            if (tr.find("input[id^='UldPieces']").val() == "") {
                tr.find("input[id^='UldPieces']").val(0);
            }
            tr.prev().find("input[id*='UldPieces']").val(parseInt(tr.prev().find("input[id^='UldPieces']").val()) + parseInt(tr.find("input[id^='UldPieces']").val()) || "");

            //tr.prev().find(".icon-trans-plus-sign").show();
            //tr.prev().find(".icon-trans-plus-sign").removeAttr("style");            
            //tr.prev().find("td:last div").append("<i class='btnTrans btnTrans-default icon-trans-plus-sign' title='Add More'></i>");
            $(input).closest('tr').remove();
        }
    }
    else {

        if (confirm('Are you sure, you wish to remove selected row?')) {            //tr.prev().find(".icon-trans-plus-sign").show();
            //tr.prev().find(".icon-trans-plus-sign").removeAttr("style");
            OLDAction = $(tr).clone(true);// tr.find("td:last div").clone(true);
            $(input).closest('tr').remove();
            $("tr[rel='" + OLDAction.find("input[id^='ULDTypeSNo']").val() + "_" + OLDAction.find("input[id^='ULDNo']").val() + "_" + OLDAction.find("input[id^='OwnerCode']").val() + "']").remove();


        }

    }
    $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").each(function (row, tr) {

        $(tr).find(".icon-trans-plus-sign").hide();
        var MaxtrLength = parseInt($("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").closest('tr').length);
        if ((MaxtrLength - 1) == row) {
            $(tr).find(".icon-trans-plus-sign").show();
            //$(tr).find("td:last div").append("<i class='btnTrans btnTrans-default icon-trans-plus-sign' title='Add More'></i>");
            $(tr).find(".icon-trans-plus-sign").removeAttr("style");
            $(tr).find("td[id^=transAction]").find("i[title='Delete']").unbind("click").bind("click", function (e) {
                fn_RemoveULDRow(this);
            });
            if ($(tr).find(".icon-trans-plus-sign").val() == undefined) {
                var trClone = $(tr).prev().clone(true);
                $(tr).find("td:last div").append(trClone.find(".icon-trans-plus-sign"));
                $(tr).find(".icon-trans-plus-sign").removeAttr("style");

                $(tr).find("td[id^=transAction]").find("i[title='Delete']").unbind("click").bind("click", function (e) {
                    fn_RemoveULDRow(this);
                });
                if (trClone.find(".icon-trans-plus-sign").val() == undefined) {
                    if ($(tr).find(".icon-trans-plus-sign").val() == undefined) {
                        var NewClone = $(input).closest('tr').find(".icon-trans-plus-sign").clone(true);

                        $(tr).find("td:last div").append(NewClone[0]);
                        $(tr).find(".icon-trans-plus-sign").removeAttr("style");
                        $(tr).find("td:last div").find(".icon-trans-plus-sign").unbind("click").click(function () {
                            handleAddA(NewClone[0]);
                            //if (cfi.IsValidTransSection($(self).closest("div").attr("id"))) {
                            //  return handleAdd($(this));
                            //}
                        });
                        //$(tr).find("td:last div").append("<i class='btnTrans btnTrans-default icon-trans-plus-sign' title='Add More'></i>");
                        //$(tr).find(".icon-trans-plus-sign").removeAttr("style");
                        //$(tr).find("td[id^=transAction]").find("i[title='Add More']").unbind("click").bind("click", function (e) {
                        //    handleAddnew($("div[id$='divareaTrans_sli_sliulddimension']").find("[id='areaTrans_sli_sliulddimension']"));
                        //});

                    }
                }

                //$(tr).find("td:last div").append("<i class='btnTrans btnTrans-default icon-trans-plus-sign' title='Add More'></i>");
                //$(tr).find(".icon-trans-plus-sign").removeAttr("style");

                //$(tr).find("#transAction:last").find("div[id^='transActionDiv']").append(" <i class='btnTrans btnTrans-default icon-trans-plus-sign' title='Add More'></i>");
                //$(tr).find(".icon-trans-plus-sign").unbind("click").click(function () {
                //    debugger;
                //    cfi.IsValidTransSection($(tr).closest("div").attr("id"));
                //});


            }

        }
        $(tr).find('td:eq(0)').text(row + 1);
        $(tr).find("td[id^=transAction]").find("i[title='Delete']").unbind("click").bind("click", function (e) {
            fn_RemoveULDRow(this);
        });
    });
    if ($("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").length == 1) {

        //if ($("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").find("td:last div").find(".icon-trans-plus-sign") != undefined)
        //{
        //    $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").find("td:last div").find(".icon-trans-plus-sign").show();
        //}
        //else
        //{
        //    $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").find("div[id=transActionDiv]").html("");
        //    $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").find("div[id=transActionDiv]").append("<i class='btnTrans btnTrans-default icon-trans-plus-sign' title='Add More'></i>");
        //    var NewClone1 = $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").find(".icon-trans-plus-sign").clone(true);
        //    $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").find("td:last div").find(".icon-trans-plus-sign").unbind("click").click(function () {
        //        handleAddA(NewClone1[0]);
        //    });
        //}

        //if()

        cfi.makeTrans("sli_sliulddimension", null, null, BindULDAutoComplete, CalculateVolume, null, null);
    }

    CalculateULDVolume(input);
    //fn_RemoveRequired();
}

//Get Contour Code
function GetContour(input) {
    var CurrentTr = $("#" + input).closest("tr");
    var ULD = CurrentTr.attr("linkuld");
    $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").each(function (row, tr) {
        if ($(tr).attr("rel") != undefined) {
            if ($(tr).attr("rel") == ULD) {
                if (CurrentTr.find("input[id^=ContourCode]").val() != "") {
                    $(tr).find("input[id^=ContourCode]").val(CurrentTr.find("input[id^=ContourCode]").val());
                    $(tr).find("input[id^=Text_ContourCode]").val(CurrentTr.find("input[id^=Text_ContourCode]").val());
                }
                else {
                    $(tr).find("input[id^=ContourCode]").val("");
                    $(tr).find("input[id^=Text_ContourCode]").val("");
                    CalculateULDVolume();
                }
            }
        }
        if ($(tr).find("input[id^=ContourCode]").val() == "") {
            CalculateULDVolume();
        }
    });
    CalculateULDVolume();
}


function FillCheckBox(input) {
    var CurrentTr = $(input).closest("tr");
    var ULD = CurrentTr.attr("linkuld");
    $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").each(function (row, tr) {
        if ($(tr).attr("rel") != undefined) {
            if ($(tr).attr("rel") == ULD) {
                if (CurrentTr.find("input[id^=isOverhang]").prop("checked") == true) {
                    $(tr).find("input[id^=isOverhang]").prop("checked", true);
                }
                else {
                    $(tr).find("input[id^=isOverhang]").prop("checked", false);
                    CalculateULDVolume();
                }
            }
        }
        if ($(tr).find("input[id^=isOverhang]").prop("checked") == false) {
            CalculateULDVolume();
        }
    });


    //alert("hi");
}
function CalculateULDCBM(elem) {
    var Currentr = $(elem).closest("tr");
    Currentr.find("input[id^='_tempUldVolWt']").val("");
    Currentr.find("input[id^='UldVolWt']").val("");
    CalculateULDVolume();
}
function CalculateSLICBM(elem) {
    var Currentr = $(elem).closest("tr");
    Currentr.find("input[id^='_tempVolumeWt']").val("");
    Currentr.find("input[id^='VolumeWt']").val("");
    CalculateVolume();
}

//ULD Dim Calculations
function CalculateULDVolume(elem, obj) {

    //debugger;
    var isrequired = 1;

    elem = $("#areaTrans_sli_sliulddimension");
    var VolumeCalculation = 0;

    //$("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").find("a[id^='ahref_ULDGetWeight']").css("display", "none");
    //$("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").last().find("a[id^='ahref_ULDGetWeight']").css("display", "");
    elem.closest("div").find("table > tbody").find("[id^='areaTrans_sli_sliulddimension']").each(function () {
        var ULDTypeSNo = $(this).find("input[id^=Text_ULDTypeSNo]").val().toUpperCase() + $(this).find("input[id^=ULDNo]").val().toUpperCase() + $(this).find("input[id^=OwnerCode]").val().toUpperCase() || "0";
        var Width = $(this).find("input[id^='ULDWidth']").val() || "0";
        var Length = $(this).find("input[id^='ULDLength']").val() || "0";
        var Height = $(this).find("input[id^='ULDHeight']").val() || "0";
        var Pieces = $(this).find("input[id^='UldPieces']").val() || "0";
        //var Pieces = $(this).find("input[id^='UldPieces']").val() || "0";
        var UTareWeight = $(this).find("input[id^='UTareWeight']").val() || 0.0;
        var TareWt = 0.0;
        if (uldLWH.length > 0) {
            for (var i = 0; i < uldLWH.length; i++) {
                if (uldLWH[i].ULDNo == ULDTypeSNo) {
                    TareWt = parseFloat(uldLWH[i].TareWeight) || 0.0;
                }
            }
        }
        if (SLIData.length > 0) {
            for (var i = 0; i < SLIData.length; i++) {
                if (SLIData[i].ULDNo == ULDTypeSNo) {
                    TareWt = TareWt + parseFloat(SLIData[i].TareWt) || 0.0;
                }
            }
        }
        $(this).find("input[id^='UTareWeight']").val(TareWt);
        $(this).find("input[id^='_tempUTareWeight']").val(TareWt);

        //$(this).find("input[id^='UTareWeight']").removeAttr("class");
        //$(this).find("input[id^='_tempUTareWeight']").removeAttr("class");
        //$(this).find("input[id^='UTareWeight']").removeAttr("data-valid");
        //$(this).find("input[id^='UTareWeight']").removeAttr("data-valid-msg");

        var CaptureWeight = $(this).find("input[id^='UCapturedWeight']").val() || "0";
        var GrossWeight = CaptureWeight - TareWt || "";
        if (GrossWeight < 0) {
            GrossWeight = "";
        }
        $(this).find("input[id^='UGrossWeight']").val(GrossWeight);
        $(this).find("input[id^='_tempUGrossWeight']").val(GrossWeight);


        var divisor = 1;
        divisor = $(this).find("input[id^='Text_Unit']").val().split('-')[0] == "CMT" ? 6000 : 366;
        if ($(this).find("input[id^='Text_Unit']").val() == "") {
            divisor = 6000;
        }

        //if ($(this).find("input[id^=ULDSPHCCode]").val() == "") {
        //    if ($(this).find("input[id^=ULDSPHCCode]").val() == "") {
        //        $(this).find("div[id^='divMultiULDSPHCCode']").html("");
        //    }
        //}

        //SetRequired($(this).find("input[id^='ULDWidth']").attr("Id"));


        var CalLen = 0.0, calWid = 0.0, calHei = 0.0;

        if (GrossWeight !== "0") {
            if (uldLWH.length > 0) {
                for (var i = 0; i < uldLWH.length; i++) {
                    if (uldLWH[i].ULDNo == ULDTypeSNo && parseFloat(CaptureWeight) <= parseFloat(uldLWH[i].TareWeight)) {
                        $(this).find("input[id^='UCapturedWeight']").val("");
                        $(this).find("input[id*='UCapturedWeight']").val("");
                        ShowMessage('warning', 'Warning -  ULD Captured Weight', "Enter valid ULD Captured Weight.Captured Weight must be greater than  Tare Wt '" + uldLWH[i].TareWeight + "'", "bottom-right");
                        $(this).find("input[id*='UCapturedWeight']").css("border-color", "red");
                        $(this).focus();
                        return false;
                    }
                }
            }
        }
        var isOverHang = $(this).find("input[id^=isOverhang]").prop("checked");
        var ContourCodeSelected = $(this).find("input[id^=Text_ContourCode]").val();

        if (isOverHang == false && ContourCodeSelected != "F" && ContourCodeSelected != "U") {
            if (Length !== "0") {
                if (uldLWH.length > 0) {
                    for (var i = 0; i < uldLWH.length; i++) {

                        if (uldLWH[i].ULDNo == ULDTypeSNo && parseFloat(Length) <= parseFloat(uldLWH[i].Length) && divisor == 6000) {

                        }
                        else if (uldLWH[i].ULDNo == ULDTypeSNo && parseFloat(Length) <= parseFloat(uldLWH[i].INLength) && divisor == 366) {

                        }
                        else {
                            if (uldLWH[i].ULDNo == ULDTypeSNo) {
                                if (divisor == 6000) {
                                    CalLen = uldLWH[i].Length;
                                }
                                else {
                                    CalLen = uldLWH[i].INLength;
                                }
                                $(this).find("input[id^='ULDLength']").val("");
                                $(this).find("input[id*='ULDLength']").val("");
                                ShowMessage('warning', 'Warning -  ULD Length', "Enter valid ULD length.ULD length should be less than or equal to '" + CalLen + "'", "bottom-right");
                                $(this).find("input[id*='ULDLength']").css("border-color", "red");
                                $(this).focus();
                                return false;
                            }
                        }
                    }
                }
            }
            if (Width !== "0") {
                if (uldLWH.length > 0) {
                    for (var i = 0; i < uldLWH.length; i++) {
                        if (uldLWH[i].ULDNo == ULDTypeSNo && parseFloat(Width) <= parseFloat(uldLWH[i].Width) && divisor == 6000) {

                        } else if (uldLWH[i].ULDNo == ULDTypeSNo && parseFloat(Width) <= parseFloat(uldLWH[i].INWidth) && divisor == 366) {

                        } else {
                            if (uldLWH[i].ULDNo == ULDTypeSNo) {
                                if (divisor == 6000) {
                                    calWid = uldLWH[i].Width;
                                }
                                else {
                                    calWid = uldLWH[i].INWidth;
                                }

                                $(this).find("input[id^='ULDWidth']").val("");
                                $(this).find("input[id*='ULDWidth']").val("");
                                ShowMessage('warning', 'Warning - ULD Width', "Enter valid ULD width.ULD width should be less than or equal to '" + calWid + "'", "bottom-right");
                                $(this).find("input[id*='ULDWidth']").css("border-color", "red");
                                $(this).focus();
                                return false;
                            }
                        }
                    }
                }
            }
            if (Height !== "0") {

                if (uldLWH.length > 0) {

                    for (var i = 0; i < uldLWH.length; i++) {
                        if (uldLWH[i].Height != "0.00") {
                            if (uldLWH[i].ULDNo == ULDTypeSNo && parseFloat(Height) <= parseFloat(uldLWH[i].Height) && divisor == 6000) {

                            } else if (uldLWH[i].ULDNo == ULDTypeSNo && parseFloat(Height) <= parseFloat(uldLWH[i].INHeight) && divisor == 366) {

                            } else {
                                if (uldLWH[i].ULDNo == ULDTypeSNo) {
                                    if (divisor == 6000) {
                                        calHei = uldLWH[i].Height;
                                    }
                                    else {
                                        calHei = uldLWH[i].INHeight;
                                    }
                                    $(this).find("input[id^='ULDHeight']").val("");
                                    $(this).find("input[id*='ULDHeight']").val("");
                                    ShowMessage('warning', 'Warning - ULD Height ', "Enter valid ULD height.ULD height should be less than or equal to '" + calHei + "'", "bottom-right");
                                    $(this).find("input[id*='ULDHeight']").css("border-color", "red");
                                    $(this).focus();
                                    return false;
                                }
                            }
                        }
                    }
                }
            }

        }


        var sphcCodeSNo = $(this).find("input[id^='Multi_ULDSPHCCode']").val();
        if (sphcCodeSNo == undefined) {
            sphcCodeSNo = "";
        }
        if (sphcCodeSNo != "") {
            sphcCodeSNo = sphcCodeSNo + "," + $(this).find("input[id^='ULDSPHCCode']").val();
        }
        if (sphcCodeSNo == "") {
            sphcCodeSNo = $(this).find("input[id^='ULDSPHCCode']").val() || $(this).find("input[id^='ULDSPHCCode']").val();
        }
        var currentVolume = 0.00;
        var volWeight = 0.00;
        if (CustomerTypeCount == 2) {
            $(this).find("input[id^='_tempUldVolWt']").attr("enabled", false);
            $(this).find("input[id^='UldVolWt']").attr("enabled", false);
            $(this).find("input[id^='_tempUldVolWt']").attr("disabled", true);
            $(this).find("input[id^='UldVolWt']").attr("disabled", true);
            $(this).find("input[id^='CBM']").attr("disabled", true);
            $(this).find("input[id^='CBM']").attr("enabled", false);
            $(this).find("input[id^='_tempCBM']").attr("disabled", true);
            $(this).find("input[id^='_tempCBM']").attr("enabled", false);
        }
        if (Pieces != "" && Pieces != undefined) {

            //volWeight = (volWeight < 1 ? 0 : volWeight);
            //if (CustomerTypeCount == 2) {
            if (Length != "0" || Width != "0" || Height != "0") {
                currentVolume = parseFloat(Pieces) * parseFloat(Length) * parseFloat(Width) * parseFloat(Height);
                volWeight = (currentVolume / divisor);
                $(this).find("input[id^='_tempUldVolWt']").attr("enabled", false);
                $(this).find("input[id^='UldVolWt']").attr("enabled", false);
                $(this).find("input[id^='_tempUldVolWt']").attr("disabled", true);
                $(this).find("input[id^='UldVolWt']").attr("disabled", true);
                $(this).find("input[id^='CBM']").attr("disabled", true);
                $(this).find("input[id^='CBM']").attr("enabled", false);
                $(this).find("input[id^='_tempCBM']").attr("disabled", true);
                $(this).find("input[id^='_tempCBM']").attr("enabled", false);
            }
            else {
                if (CustomerTypeCount == 1) {
                    volWeight = parseFloat($(this).find("input[id^='UldVolWt']").val());
                    $(this).find("input[id^='_tempUldVolWt']").attr("enabled", true);
                    $(this).find("input[id^='UldVolWt']").attr("enabled", true);
                    $(this).find("input[id^='_tempUldVolWt']").attr("disabled", false);
                    $(this).find("input[id^='UldVolWt']").attr("disabled", false);
                    $(this).find("input[id^='CBM']").attr("disabled", false);
                    $(this).find("input[id^='CBM']").attr("enabled", true);
                    $(this).find("input[id^='_tempCBM']").attr("disabled", false);
                    $(this).find("input[id^='_tempCBM']").attr("enabled", true);
                    $(this).find("input[id^='_tempUldVolWt']").removeAttr("class");
                    $(this).find("input[id^='_tempUldVolWt']").attr("class", "k-formatted-value k-input transSection");
                    $(this).find("input[id^='_tempCBM']").removeAttr("class");
                    $(this).find("input[id^='_tempCBM']").attr("class", "k-formatted-value k-input transSection");
                }
            }
            if (volWeight > 0) {
                $(this).find("input[id^='_tempUldVolWt']").val(volWeight.toFixed(3));
                $(this).find("input[id^='UldVolWt']").val(volWeight.toFixed(3));
            }
            else {
                $(this).find("input[id^='_tempUldVolWt']").val("");
                $(this).find("input[id^='UldVolWt']").val("");
            }
            //+ "(" + (volWeight.toFixed(3) / 166.6667).toFixed(3) + ")"

            // }
            //else {
            //    currentVolume = parseFloat($(this).find("input[id^='UldVolWt']").val());
            //    volWeight = currentVolume || 0.00;//(currentVolume / divisor);
            //}


            if (CustomerTypeCount == 2) {
                if (Length == "0" || Width == "0" || Height == "0") {
                    if (GrossWeight != "") {

                        $(this).find("input[id^='_tempUldVolWt']").val(GrossWeight);
                        $(this).find("input[id^='UldVolWt']").val(GrossWeight);

                        volWeight = parseFloat(GrossWeight) || 0.00;

                    }

                }
            }

            if (parseFloat($(this).find("input[id^='UldVolWt']").val()) <= 0.166) {
                $(this).find("input[id^='CBM']").val("0.001");
                $(this).find("input[id^='_tempCBM']").val("0.001");
                $(this).find("input[id^='_tempUldVolWt']").val((parseFloat($(this).find("input[id^='CBM']").val()) * 166.66).toFixed(3));
                $(this).find("input[id^='UldVolWt']").val((parseFloat($(this).find("input[id^='CBM']").val()) * 166.66).toFixed(3));
                volWeight = parseFloat($(this).find("input[id^='UldVolWt']").val());
                //$("input[id='_temp" + VolumeID + "']").val((parseFloat($("input[id='" + SLICBM + "']").val()) * 166.66).toFixed(3));
                //$("input[id='" + VolumeID + "']").val((parseFloat($("input[id='" + SLICBM + "']").val()) * 166.66).toFixed(3));
            }

        }
        if ($(this).find("input[id^='UldVolWt']").val() != "" && parseFloat($(this).find("input[id^='UldVolWt']").val()) > 0) {
            $(this).find("input[id^='CBM']").val((volWeight.toFixed(3) / 166.66).toFixed(3));
            $(this).find("input[id^='_tempCBM']").val((volWeight.toFixed(3) / 166.66).toFixed(3));
        }
        else {
            if ($(this).find("input[id^='UldVolWt']").val() == "" || parseFloat($(this).find("input[id^='UldVolWt']").val()) > 0) {
                var CBM = parseFloat($(this).find("input[id^='CBM']").val());
                if (CBM > 0) {
                    $(this).find("input[id^='_tempUldVolWt']").val((CBM * 166.66).toFixed(3));
                    $(this).find("input[id^='UldVolWt']").val((CBM * 166.66).toFixed(3));
                    volWeight = parseFloat($(this).find("input[id^='UldVolWt']").val());
                }
            }

        }

        var rel = $(this).attr("rel");
        if (rel != undefined) {
            $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").each(function (row, tr) {
                if ($(tr).attr("linkuld") == rel) {
                    if ($(tr).attr("rel") == undefined) {
                        sphcCodeSNo = $(tr).find("input[id^='ULDSPHCCode']").val() || $(tr).find("input[id^='Multi_ULDSPHCCode']").val();
                    }
                }
            });
        }
        var sphcarr = sphcCodeSNo.split(",");
        for (var i = 0; i < sphcarr.length; i++) {
            if (sphcarr[i] == "13") {
                isrequired = 0;
            }
        }
        if (sphcCodeSNo == "") {
            isrequired = 1;

        }

        if (isrequired == 1 && CustomerTypeCount == 2) {
            //debugger;
            if (parseInt(Width) == 0) {
                $(this).find("input[id^='ULDWidth']").val("");
                if (Pieces > 0) {
                    //$(this).find("input[id*='ULDWidth']").attr("data-valid", "required");
                    $(this).find("input[id*='ULDWidth']").css("border-color", "red");
                    // $(this).find("input[id*='ULDWidth']").attr("data-valid-msg", "Enter Width");
                    $(this).focus();
                }

            }
            else {
                // $(this).find("input[id^='ULDWidth']").removeAttr("data-valid", "required");
                $(this).find("input[id*='ULDWidth']").css("border-color", "");
                //$(this).find("input[id^='ULDWidth']").removeAttr("data-valid-msg", "Enter Width");
                // $(this).find("input[id^='_tempULDWidth']").removeAttr("data-valid", "required");
                $(this).find("input[id*='_tempULDWidth']").css("border-color", "");
                // $(this).find("input[id^='_tempULDWidth']").removeAttr("data-valid-msg", "Enter Width");

            }
            if (parseInt(Length) == 0) {
                $(this).find("input[id^='ULDLength']").val("");
                if (Pieces > 0) {
                    //  $(this).find("input[id*='ULDLength']").attr("data-valid", "required");
                    $(this).find("input[id*='ULDLength']").css("border-color", "red");
                    //$(this).find("input[id*='ULDLength']").attr("data-valid-msg", "Enter Length");
                    $(this).focus();
                }
            }
            else {
                //  $(this).find("input[id^='ULDLength']").removeAttr("data-valid", "required");
                $(this).find("input[id*='ULDLength']").css("border-color", "");
                // $(this).find("input[id^='ULDLength']").removeAttr("data-valid-msg", "Enter Width");
                // $(this).find("input[id^='_tempULDLength']").removeAttr("data-valid", "required");
                $(this).find("input[id*='_tempULDLength']").css("border-color", "");
                // $(this).find("input[id^='_tempULDLength']").removeAttr("data-valid-msg", "Enter Width");


            }
            if (parseInt(Height) == 0) {
                $(this).find("input[id^='ULDHeight']").val("");
                if (Pieces > 0) {
                    // $(this).find("input[id*='ULDHeight']").attr("data-valid", "required");
                    $(this).find("input[id*='ULDHeight']").css("border-color", "red");
                    // $(this).find("input[id*='ULDHeight']").attr("data-valid-msg", "Enter Height");
                    $(this).focus();
                }
            }
            else {
                // $(this).find("input[id^='ULDHeight']").removeAttr("data-valid", "required");
                $(this).find("input[id*='ULDHeight']").css("border-color", "");
                // $(this).find("input[id^='ULDHeight']").removeAttr("data-valid-msg", "Enter Width");
                //   $(this).find("input[id^='_tempULDHeight']").removeAttr("data-valid", "required");
                $(this).find("input[id*='_tempULDHeight']").css("border-color", "");
                // $(this).find("input[id^='_tempULDHeight']").removeAttr("data-valid-msg", "Enter Width");

            }
        }
        else {
            $(this).find("input[id*='ULDWidth']").css("border-color", "");
            $(this).find("input[id*='_tempULDWidth']").css("border-color", "");
            $(this).find("input[id*='ULDHeight']").css("border-color", "");
            $(this).find("input[id*='_tempULDHeight']").css("border-color", "");
            $(this).find("input[id*='ULDLength']").css("border-color", "");
            $(this).find("input[id*='_tempULDLength']").css("border-color", "");
        }
        var ULdPcs = $(this).find("input[id^='UldPieces']").val() || 0;
        if (ULdPcs == 0) {
            $(this).find("input[id^='ULDWidth']").val("");
            $(this).find("input[id^='ULDLength']").val("");
            $(this).find("input[id^='ULDHeight']").val("");

        }
        $(this).find("input[id^='UTareWeight']").attr("disabled", true);
        $(this).find("input[id^='UGrossWeight']").attr("disabled", true);
        $(this).find("input[id^='_tempUTareWeight']").attr("disabled", true);
        $(this).find("input[id^='_tempUGrossWeight']").attr("disabled", true);
    });

    //fn_RemoveRequired();

    CalculateVolume(elem);

}

//Loose Dim Calculation
function CalculateVolume(elem, obj) {
    var UldCount = 0;
    elem = $("#areaTrans_sli_slidimension");
    var divisor = 1;
    if ($("#Unit")[0].checked == true)
        divisor = 6000;
    else
        divisor = 366;
    var VolumeCalculation = 0;
    var volWeight = 0;
    var PicesCalculation = 0;
    var GrossCalculation = 0;
    elem.closest("div").find("input[id^='Pieces']").each(function () {

        volWeight = 0;
        var currentId = $(this).attr("id");
        var PieceID = currentId;
        var LengthID = currentId.replace("Pieces", "Length");
        var WidthID = currentId.replace("Pieces", "Width");
        var HeightID = currentId.replace("Pieces", "Height");
        var VolumeID = currentId.replace("Pieces", "VolumeWt");
        var GrossWt = currentId.replace("Pieces", "GrossWeight");
        var CapturedWt = currentId.replace("Pieces", "CapturedWeight");
        var TareWeight = currentId.replace("Pieces", "TareWeight") || 0.0;
        var LooseSNo = currentId.replace("Pieces", "LooseSNo");
        var SLICBM = currentId.replace("Pieces", "SLICBM");
        var currentVolume = 0.00;
        // var TotGrossWeight = 0.00;
        var TareWt = 0.0;
        TareWt = parseFloat($("#" + TareWeight).val()) || 0.0;
        //var LSNo = $("#" + LooseSNo).val()
        //for (var i = 0; i < SLIData.length; i++) {
        //    if (SLIData[i].ULDNo == "") {
        //        var LoSNo = SLIData[i].LooseSNo;
        //        if (LSNo == LoSNo) {
        //            TareWt = SLIData[i].TareWt;
        //        }

        //    }
        //}

        //$(this).find("input[id^='TareWeight']").val(TareWt);
        //$(this).find("input[id^='_tempTareWeight']").val(TareWt);

        // $("#_temp" + TareWt).val(TareWt);
        //         TareWt = uldLWH[i].TareWeight;
        if (TareWt < 0) {
            TareWt = 0.0;
        }
        var CaptureWeight = $("#" + CapturedWt).val();
        var GrossWeight = CaptureWeight - TareWt || "";
        if (GrossWeight < 0) {
            GrossWeight = "";
        }
        $("#" + TareWeight).val(TareWt);
        $("#_temp" + TareWeight).val(TareWt);
        $("#" + GrossWt).val(GrossWeight);
        $("#_temp" + GrossWt).val(GrossWeight);


        if ($("#" + PieceID).val() != "" && $("#" + PieceID).val() != undefined) {

            //var volWeight = cfi.ceil(currentVolume / divisor);
            //volWeight = (volWeight < 1 ? 0 : volWeight);

            //TotGrossWeight=
            //alert(isNaN(volWeight));
            // if (CustomerTypeCount == 2) {

            if (CustomerTypeCount == 2) {
                $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").each(function (row, tr) {
                    $(tr).find('input[id^="_tempVolumeWt"]').attr("enabled", false);
                    $(tr).find('input[id^="VolumeWt"]').attr("enabled", false);
                    $(tr).find('input[id^="_tempVolumeWt"]').attr("disabled", true);
                    $(tr).find('input[id^="VolumeWt"]').attr("disabled", true);
                    $(tr).find('input[id^="_tempSLICBM"]').attr("enabled", false);
                    $(tr).find('input[id^="SLICBM"]').attr("enabled", false);
                    $(tr).find('input[id^="_tempSLICBM"]').attr("disabled", true);
                    $(tr).find('input[id^="SLICBM"]').attr("disabled", true);
                });
            }

            PicesCalculation = PicesCalculation + parseFloat($("#" + PieceID).val() == "" ? "0" : $("#" + PieceID).val());
            if ($("#" + LengthID).val() != "" || $("#" + WidthID).val() != "" || $("#" + HeightID).val() != "") {
                currentVolume = parseFloat($("#" + PieceID).val() == "" ? "0" : $("#" + PieceID).val()) * parseFloat($("#" + LengthID).val() == "" ? "0" : $("#" + LengthID).val()) * parseFloat($("#" + WidthID).val() == "" ? "0" : $("#" + WidthID).val()) * parseFloat($("#" + HeightID).val() == "" ? "0" : $("#" + HeightID).val());

                volWeight = currentVolume / divisor;
                VolumeCalculation = VolumeCalculation + volWeight;
                $("input[id='_temp" + VolumeID + "']").attr("enabled", false);
                $("input[id='" + VolumeID + "']").attr("enabled", false);
                $("input[id='_temp" + VolumeID + "']").attr("disabled", true);
                $("input[id='" + VolumeID + "']").attr("disabled", true);

                $("input[id='_temp" + SLICBM + "']").attr("enabled", false);
                $("input[id='" + SLICBM + "']").attr("enabled", false);
                $("input[id='_temp" + SLICBM + "']").attr("disabled", true);
                $("input[id='" + SLICBM + "']").attr("disabled", true);

            }
            else {
                if (CustomerTypeCount == 1) {
                    volWeight = parseFloat($("input[id='" + VolumeID + "']").val());
                    VolumeCalculation = VolumeCalculation + volWeight;
                    $("input[id='_temp" + VolumeID + "']").attr("enabled", true);
                    $("input[id='" + VolumeID + "']").attr("enabled", true);
                    $("input[id='_temp" + VolumeID + "']").attr("disabled", false);
                    $("input[id='" + VolumeID + "']").attr("disabled", false);
                    $("input[id='_temp" + VolumeID + "']").removeAttr("class");
                    $("input[id='_temp" + VolumeID + "']").attr("class", "k-formatted-value k-input transSection");
                    $("input[id='_temp" + SLICBM + "']").attr("enabled", true);
                    $("input[id='" + SLICBM + "']").attr("enabled", true);
                    $("input[id='_temp" + SLICBM + "']").attr("disabled", false);
                    $("input[id='" + SLICBM + "']").attr("disabled", false);
                    $("input[id='_temp" + SLICBM + "']").removeAttr("class");
                    $("input[id='_temp" + SLICBM + "']").attr("class", "k-formatted-value k-input transSection");
                }
            }
            if (volWeight > 0) {
                $("input[id='_temp" + VolumeID + "']").val(isNaN(volWeight) ? 0 : volWeight.toFixed(3));
                $("input[id='" + VolumeID + "']").val(isNaN(volWeight) ? 0 : volWeight.toFixed(3));
                $("input[id='_temp" + SLICBM + "']").val((volWeight.toFixed(3) / 166.66).toFixed(3));
                $("input[id='" + SLICBM + "']").val((volWeight.toFixed(3) / 166.66).toFixed(3));
            }
            else {
                if (volWeight <= 0) {
                    $("input[id='_temp" + VolumeID + "']").val("");
                    $("input[id='" + VolumeID + "']").val("");
                }
            }
            if (isNaN(VolumeCalculation)) {
                VolumeCalculation = 0.000;
            }
            if (CustomerTypeCount == 2) {
                if ($("#" + LengthID).val() == "" || $("#" + WidthID).val() == "" || $("#" + HeightID).val() == "") {
                    if ($("#" + GrossWt).val() != "") {

                        $("input[id='_temp" + VolumeID + "']").val($("#" + GrossWt).val());
                        $("input[id='" + VolumeID + "']").val($("#" + GrossWt).val());
                        volWeight = parseFloat($("input[id='" + VolumeID + "']").val()) || 0.00;
                        VolumeCalculation = VolumeCalculation + volWeight;
                    }

                }
            }


            if ($("input[id='" + VolumeID + "']").val() != "" && parseInt($("input[id='" + VolumeID + "']").val()) > 0) {
                $("input[id='" + SLICBM + "']").val((volWeight.toFixed(3) / 166.66).toFixed(3));
                $("input[id='_temp" + SLICBM + "']").val((volWeight.toFixed(3) / 166.66).toFixed(3));
            }
            else {
                if ($("input[id='" + VolumeID + "']").val() == "" || parseFloat($("input[id='" + VolumeID + "']").val()) <= 0) {
                    var CBM = parseFloat($("input[id='" + SLICBM + "']").val());
                    if (CBM > 0) {
                        $("input[id='_temp" + VolumeID + "']").val((CBM * 166.66).toFixed(3));
                        $("input[id='" + VolumeID + "']").val((CBM * 166.66).toFixed(3));
                        volWeight = parseFloat($("input[id='" + VolumeID + "']").val());
                        VolumeCalculation = VolumeCalculation + volWeight;
                    }
                }

            }

            if (parseFloat($("input[id='" + VolumeID + "']").val()) <= 0.166) {
                $("input[id='" + SLICBM + "']").val("0.001");
                $("input[id='_temp" + SLICBM + "']").val("0.001");
                $("input[id='_temp" + VolumeID + "']").val((parseFloat($("input[id='" + SLICBM + "']").val()) * 166.66).toFixed(3));
                $("input[id='" + VolumeID + "']").val((parseFloat($("input[id='" + SLICBM + "']").val()) * 166.66).toFixed(3));
                volWeight = parseFloat($("input[id='" + VolumeID + "']").val());
                VolumeCalculation = VolumeCalculation + volWeight;
            }


            // }
            //else {
            //    currentVolume = parseFloat($("input[id='" + VolumeID + "']").val()) || 0.00;
            //    volWeight = currentVolume; /// divisor;
            //    VolumeCalculation = VolumeCalculation + volWeight;
            //}


        }

    });

    //elem.closest("div").find(".icon-trans-plus-sign").show();
    //elem.closest("div").find(".icon-trans-plus-sign").removeAttr("style");
    $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").each(function (row, tr) {
        $(tr).find("td[id^=transAction]").find("i[title='Delete']").unbind("click").bind("click", function (e) {
            fn_RemoveULDRow(this);
        });

        $(tr).find("input[id^='ULDNo']").keydown(function (e) {

            if (e.ctrlKey || e.altKey)  // if shift, ctrl or alt keys held down
            {
                e.preventDefault();             // Prevent character input
            }
            else {
                var n = e.keyCode;
                if (!((n == 8)              // backspace
                        || (n == 46)                // delete
                        || (n >= 35 && n <= 40)     // arrow keys/home/end
                        || (n >= 48 && n <= 57)     // numbers on keyboard
                        || (n >= 96 && n <= 105)    // number on keypad
                        || (n == 9) || (n == 16))                // Tab on keypad
                        ) {
                    e.preventDefault();             // Prevent character input
                }
            }
        });



        $(this).find('input[id^="ULDTypeSNo"]').each(function () {
            if ($(tr).find("input[id^='ULDNo']").val() != "") {
                if ($(tr).find("input[id^='ULDTypeSNo']").val() + "_" + $(tr).find("input[id^='ULDNo']").val() + "_" + $(tr).find("input[id^='OwnerCode']").val() != $(tr).prev().find("input[id^='ULDTypeSNo']").val() + "_" + $(tr).prev().find("input[id^='ULDNo']").val() + "_" + $(tr).prev().find("input[id^='OwnerCode']").val()) {
                    UldCount = UldCount + 1;
                }
            }
        })

    });
    PicesCalculation = PicesCalculation + UldCount;

    var G = 0; GW = 0; VW = 0;

    $("input[id^='GrossWeight']").each(function (i, e) {
        var v = parseFloat($(e).val());
        if (!isNaN(v))
            G += v;
    });
    $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").each(function (row, tr) {
        $(tr).find("input[id^='UGrossWeight']").each(function (i, e) {
            if ($(tr).find("input[id^='ULDTypeSNo']").val() + "_" + $(tr).find("input[id^='ULDNo']").val() + "_" + $(tr).find("input[id^='OwnerCode']").val() != $(tr).prev().find("input[id^='ULDTypeSNo']").val() + "_" + $(tr).prev().find("input[id^='ULDNo']").val() + "_" + $(tr).prev().find("input[id^='OwnerCode']").val()) {
                var v = parseFloat($(e).val());
                if (!isNaN(v))
                    GW += v;
            }

        })

    });
    $("input[id^='UldVolWt']").each(function (i, e) {
        var v = parseFloat($(e).val() || 0.000);
        if (!isNaN(v))
            VW += v;
    });
    TotGW = G + GW;
    VolumeCalculation = VolumeCalculation + VW;
    var GW = TotGW.toFixed(2) + "/" + VolumeCalculation.toFixed(3) || "0.000";
    $("span[id='DimGrossWt']").html(GW);
    $("input[id='DimGrossWt']").val(GW);


    //if (VolumeCalculation != 0) {
    //    $("span[id='DimVolumeWt']").html(isNaN(VolumeCalculation) ? 0 : VolumeCalculation.toFixed(2));
    //    $("input[id='DimVolumeWt']").val(isNaN(VolumeCalculation) ? 0 : VolumeCalculation.toFixed(2));

    //} else {
    //    $("span[id='DimVolumeWt']").html(0);
    //    $("input[id='DimVolumeWt']").val(0);
    //}


    if (PicesCalculation != 0) {
        $("span[id='TotalPieces']").html(isNaN(PicesCalculation) ? 0 : PicesCalculation);
        $("input[id='TotalPieces']").val(isNaN(PicesCalculation) ? 0 : PicesCalculation);

    }
    else {
        $("span[id='TotalPieces']").html(0);
        $("input[id='TotalPieces']").val(0);
    }

    //var masterrow = elem.closest("div").find("tr[rel='" + elem.closest("div").attr("rel") + "']").length;
    //if (masterrow != undefined && masterrow > 0) {
    //}
    $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").each(function (row, tr) {
        $(tr).find("input[id^='Text_Unit']").each(function () {
            $(this).css("width", "50px");
        });
        $(tr).find("input[id^='Text_ULDTypeSNo']").each(function () {
            $(this).css("width", "60px");
        });


    });
    $("div[id$='divareaTrans_sli_slidimension']").find("[id^='areaTrans_sli_slidimension']").each(function (row, tr) {
        $(tr).find("input[id^='TareWeight']").attr("disabled", true);
        $(tr).find("input[id^='GrossWeight']").attr("disabled", true);
        $(tr).find("input[id^='_tempTareWeight']").attr("disabled", true);
        $(tr).find("input[id^='_tempGrossWeight']").attr("disabled", true);
    });
    //$("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").find("a[id^='ahref_ULDGetWeight']").css("display", "none");
    //$("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").last().find("a[id^='ahref_ULDGetWeight']").css("display", "");
    //if ($("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").length == 1) {
    //    $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").find("a[id^='ahref_ULDGetWeight']").each(function () {
    //        $(this).css("display", "");
    //    });
    //}
    //else {
    //    $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").find("a[id^='ahref_ULDGetWeight']").css("display", "none");

    //    //$(this)
    //}
}

//Get Weiging Weight
function GetWeigingWeight(input) {
    if ($(input).attr("recname") == "AltULDGetWeight") {

        var currenttr = $(input).closest("tr");

        var ULDNo = currenttr.find("input[id^='Text_ULDTypeSNo']").val().toUpperCase() + currenttr.find("input[id^='ULDNo']").val() + currenttr.find("input[id^='OwnerCode']").val().toUpperCase();

        var url = "Services/Common/CommonService.svc/GetWeighingDataByTerminalID/" + userContext.TerminalSNo;
        $.ajax({
            url: url,
            contentType: "application/json; charset=utf-8",
            async: true,
            type: 'GET',
            success: function (result) {
                if (result.GetWeighingDataByTerminalIDResult != "0") {
                    currenttr.find("input[id^='UCapturedWeight']").val(result.GetWeighingDataByTerminalIDResult);
                    currenttr.find("input[id^='_tempUCapturedWeight']").val(result.GetWeighingDataByTerminalIDResult);
                    CalculateULDVolume();
                }
                else {
                    ShowMessage('warning', 'Warning - Weighing', "Can't connect to Weighing Scale. Please check with System administrator.", 'bottom-right');
                }

            }
        });

        //$.ajax({
        //    url: "Services/Shipment/SLInfoService.svc/GetWeighingScaleWeight", async: false, type: "get", dataType: "json", cache: false,
        //    data: { UserSNo: userContext.UserSNo, SLIAWBSNo: currentslisno, Pieces: 1, SubProcessSNo: 1053, UldNo: ULDNo },
        //    contentType: "application/json; charset=utf-8",
        //    success: function (result) {
        //        if (result != null) {
        //            currenttr.find("input[id^='UGrossWeight']").val(result);
        //            currenttr.find("input[id^='_tempUGrossWeight']").val(result);
        //            CalculateULDVolume();
        //        }
        //        else {
        //            ShowMessage('warning', 'Warning - Weighing', "Can't connect to Weighing Scale. Please check with System administrator.", 'bottom-right');
        //        }

        //    }
        //});

    }
    else {
        var currenttr = $(input).closest("tr");
        var TotalPcs = currenttr.find("input[id^='Pieces']").val();
        if (TotalPcs != "") {

            var url = "Services/Common/CommonService.svc/GetWeighingDataByTerminalID/" + userContext.TerminalSNo;
            $.ajax({
                url: url,
                contentType: "application/json; charset=utf-8",
                async: true,
                type: 'GET',
                success: function (result) {
                    if (result.GetWeighingDataByTerminalIDResult != "0") {
                        currenttr.find("input[id^='CapturedWeight']").val(result.GetWeighingDataByTerminalIDResult);
                        currenttr.find("input[id^='_tempCapturedWeight']").val(result.GetWeighingDataByTerminalIDResult);
                        CalculateVolume();
                    }
                    else {
                        ShowMessage('warning', 'Warning - Weighing', "Can't connect to Weighing Scale. Please check with System administrator.", 'bottom-right');
                    }

                }
            });
            //$.ajax({
            //    url: "Services/Shipment/SLInfoService.svc/GetWeighingScaleWeight", async: false, type: "get", dataType: "json", cache: false,
            //    data: { UserSNo: userContext.UserSNo, SLIAWBSNo: currentslisno, Pieces: TotalPcs, SubProcessSNo: 1053, UldNo: "" },
            //    contentType: "application/json; charset=utf-8",
            //    success: function (result) {
            //        if (result != null) {
            //            currenttr.find("input[id^='CapturedWeight']").val(result);
            //            currenttr.find("input[id^='_tempCapturedWeight']").val(result);
            //            CalculateVolume();
            //        }
            //        else {
            //            ShowMessage('warning', 'Warning - Weighing', "Can't connect to Weighing Scale. Please check with System administrator.", 'bottom-right');
            //        }

            //    }
            //});
        } else {
            ShowMessage('warning', 'Warning - Weighing', "Can't connect to Weighing Scale. Please check with System administrator.", 'bottom-right');
        }
    }

}
//function GetWeigingWeight(input) {
//    if ($(input).attr("recname") == "AltULDGetWeight") {

//        var currenttr = $(input).closest("tr");

//        var ULDNo = currenttr.find("input[id^='Text_ULDTypeSNo']").val().toUpperCase() + currenttr.find("input[id^='ULDNo']").val() + currenttr.find("input[id^='OwnerCode']").val().toUpperCase();

//        $.ajax({
//            url: "Services/Shipment/SLInfoService.svc/GetWeighingScaleWeight", async: false, type: "get", dataType: "json", cache: false,
//            data: { UserSNo: userContext.UserSNo, SLIAWBSNo: currentslisno, Pieces: 1, SubProcessSNo: 1053, UldNo: ULDNo },
//            contentType: "application/json; charset=utf-8",
//            success: function (result) {
//                if (result != null) {
//                    currenttr.find("input[id^='UGrossWeight']").val(result);
//                    currenttr.find("input[id^='_tempUGrossWeight']").val(result);
//                    CalculateULDVolume();
//                }
//                else {
//                    ShowMessage('warning', 'Warning - Weighing', "Can't connect to Weighing Scale. Please check with System administrator.", 'bottom-right');
//                }

//            }
//        });

//    }
//    else {
//        var currenttr = $(input).closest("tr");
//        var TotalPcs = currenttr.find("input[id^='Pieces']").val();
//        if (TotalPcs != "") {
//            $.ajax({
//                url: "Services/Shipment/SLInfoService.svc/GetWeighingScaleWeight", async: false, type: "get", dataType: "json", cache: false,
//                data: { UserSNo: userContext.UserSNo, SLIAWBSNo: currentslisno, Pieces: TotalPcs, SubProcessSNo: 1053, UldNo: "" },
//                contentType: "application/json; charset=utf-8",
//                success: function (result) {
//                    if (result != null) {
//                        currenttr.find("input[id^='CapturedWeight']").val(result);
//                        currenttr.find("input[id^='_tempCapturedWeight']").val(result);
//                        CalculateVolume();
//                    }
//                    else {
//                        ShowMessage('warning', 'Warning - Weighing', "Can't connect to Weighing Scale. Please check with System administrator.", 'bottom-right');
//                    }

//                }
//            });
//        } else {
//            ShowMessage('warning', 'Warning - Weighing', "Can't connect to Weighing Scale. Please check with System administrator.", 'bottom-right');
//        }
//    }

//}

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


    $("div[id$='divareaTrans_sli_sliulddimension']").find("[id^='areaTrans_sli_sliulddimension']").each(function (row, tr) {
        $(tr).find("input[id*='Text_Unit']").css("width", "50px");
        $(tr).find("input[id*='Text_ULDTypeSNo']").css("width", "60px");
        $(tr).attr("LinkULd", $(tr).find("input[id^='Text_ULDTypeSNo']").val() + "_" + $(tr).find("input[id^='ULDNo']").val() + "_" + $(tr).find("input[id^='OwnerCode']").val().toUpperCase());
        if (row > 0) {
            if ($(tr).find("input[id^='ULDNoSNo']").val() != "") {
                if ($(tr).find("input[id^='ULDNoSNo']").val() == $(tr).prev().find("input[id^='ULDNoSNo']").val()) {
                    $(tr).attr("rel", $(tr).find("input[id^='Text_ULDTypeSNo']").val() + "_" + $(tr).find("input[id^='ULDNo']").val() + "_" + $(tr).find("input[id^='OwnerCode']").val());
                    $(tr).find("input[id*='Text_Unit']").css("width", "50px");
                    $(tr).find("input[id*='Text_ULDTypeSNo']").css("width", "60px");
                    $(tr).find("span[id^='SLINo']").css("display", "none");
                    $(tr).find("span[id^='HAWBNo']").css("display", "none");
                    $(tr).find("input[id^='ULDNo']").closest('td').find('span').css("display", "none");
                    $(tr).find("input[id*='_tempSLACPieces']").hide();
                    $(tr).find("input[id*='SLACPieces']").css("display", "none");
                    $(tr).find("input[id*='ULDTypeSNo']").closest('td').find('span').css("display", "none");
                    $(tr).find("input[id*='OwnerCode']").css("display", "none");
                    //$(tr).find("input[id*='ULDPackingTypeSNo']").closest('td').find('span').css("display", "none");
                    $(tr).find("input[id*='ULDNo']").css("display", "none");
                    $(tr).find("input[id*='_tempUGrossWeight']").css("display", "none");
                    $(tr).find("input[id*='UGrossWeight']").css("display", "none");
                    $(tr).find("input[id^='ULDLength']").attr('readonly', false);
                    $(tr).find("input[id^='ULDWidth']").attr('readonly', false);
                    $(tr).find("input[id^='ULDHeight']").attr('readonly', false);
                    $(tr).find("input[id^='UldVolWt']").attr('readonly', false);
                    $(tr).find("input[id^='CBM']").attr('readonly', false);
                    $(tr).find("span[id*='ClassDetails']").css("display", "none");
                    $(tr).find("a[id^='ahref_ULDGetWeight']").css("display", "none");
                    $(tr).find("input[id*='ULDSPHCCode']").closest('td').find('span').css("display", "none");
                    $(tr).find("input[id*='_tempULDStartTemperature']").hide();
                    $(tr).find("input[id*='ULDStartTemperature']").css("display", "none");
                    $(tr).find("input[id*='_tempULDEndTemperature']").hide();
                    $(tr).find("input[id*='ULDEndTemperature']").css("display", "none");
                    $(tr).find("input[id*='_tempULDCapturedtemp']").hide();
                    $(tr).find("input[id*='ULDCapturedtemp']").css("display", "none");
                    $(tr).find(".k-button").hide();
                    $(tr).find("input[id^=isOverhang]").hide();
                    $(tr).find("div[id^=divMultiULDSPHCCode]").hide();
                    $(tr).find("input[id*='UCapturedWeight']").css("display", "none");
                    $(tr).find("input[id*='_tempUCapturedWeight']").css("display", "none");
                    $(tr).find("input[id*='UTareWeight']").css("display", "none");
                    $(tr).find("input[id*='_tempUTareWeight']").css("display", "none");
                    $(tr).find("a[id^='ahref_Equipment']").css("display", "none");
                    $(tr).find("input[id*='ContourCode']").closest('td').find('span').css("display", "none");
                    $(tr).find("td[id^=transAction]").find("i[title='Delete']").unbind("click").bind("click", function (e) {
                        fn_RemoveULDRow(this);
                    });
                }
            }
        }
    });
    if ($("#BOEDate").val() != undefined) {
        if (BOEDate != "") {
            $("#BOEDate").data("kendoDatePicker").value(BOEDate);
        }
        else {
            $("#BOEDate").data("kendoDatePicker").value("");
            $("#BOEDate").val("");
        }
    }
    $("#isBOEVerified").attr("enabled", false);
    $("#isBOEVerified").attr("disabled", true);
    $("#isManual").attr("enabled", false);
    $("#isManual").attr("disabled", true);
    if ($("#SLINo").val() != undefined && $("#SLINo").val() != "") {
        if (parseInt($("#SLINo").val().substring(9, 11)) == 1) {
            // $("input:checkbox[name=isManual]").attr("checked", 1);
        }
        else {
            $("input:checkbox[name=isManual]").hide();
            $("input:checkbox[name=isManual]").removeAttr("checked");
        }
    }
    //$("div[id^='divareaTrans_'][cfi-aria-trans='trans']").each(function () {
    //    var transid = this.id.replace("divareaTrans_", "");
    //    cfi.makeTrans(transid, null, null, null, null, null, null);
    //});
    //    $("td.formtwoInputcolumn").html("TEST<STRONG>ASDFA<EM>SASDFASDF</EM></STRONG>");
    //    ChangeAllControlToLable("aspnetForm");
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


}

//Bind SLi Cancellation 
function InitializePaymentData() {
    BindSLICancellation();
}
//Bind SLi Cancellation 
var DuePayment = 0;
function BindSLICancellation() {
    $.ajax({
        url: "Services/Shipment/SLInfoService.svc/GetSLICancellation?SLISNo=" + currentslisno, async: false, type: "get", dataType: "json", cache: false,
        //data: JSON.stringify({ SNo: SNo, Pieces: Pieces, UserSNo: lvalue(_SessionLoginSNo_) }),
        data: JSON.stringify({ SLISNo: currentslisno }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            // alert('Test');
            var Data = jQuery.parseJSON(result);
            var CancellationArray = Data.Table0;
            var DuePaymentaRR = Data.Table1;
            DuePayment = DuePaymentaRR[0].DuePayment;
            cfi.makeTrans("sli_slicancellation", null, null, null, null, null, CancellationArray);
            $('#divareaTrans_sli_slicancellation table tr:eq(2) td:last').text("");
            $('#divareaTrans_sli_slicancellation table tr[id^="areaTrans_sli_slicancellation"]').each(function (row, tr) {
                $(tr).find('td:last div').remove();
                $(tr).css("height", "40px");
            });
            $("div[id$='divareaTrans_sli_slicancellation']").find("[id^='areaTrans_sli_slicancellation']").each(function () {
                var chk = $(this).find("input[type='checkbox']");
                chk.attr("checked", (chk.val() == 1))
                if ($(this).find("input[type='checkbox']").prop("checked") == true) {
                    $(this).find("input[type='checkbox']").attr("disabled", "disabled");
                }
            });

            //BindPaymentDetails("#Verified");
            if ($("div[id$='divareaTrans_sli_slicancellation']").find("[id^='areaTrans_sli_slicancellation']").find("input[type='checkbox'][checked=checked]").length == 3) {
                $("#btnSave").hide();
            }
        }
    });
}

//Insert SLI cancellation
function saveSLICANCELLATION() {
    var flag = false;
    var validFlag = true;
    var CancellationArray = [];
    $("div[id$='divareaTrans_sli_slicancellation']").find("[id^='areaTrans_sli_slicancellation']").each(function () {
        //  alert($(this).find("[id^='Details']").val());
        var CancellationArrayViewModel = {
            SLISNo: currentslisno,
            VerifiedType: $(this).find("[id^='Details']").val() == 'CANCEL SLI' ? 1 : $(this).find("input[id^='Details']").val() == 'DOCS RETURNED' ? 2 : $(this).find("input[id^='Details']").val() == 'SHIPMENT RETURNED' ? 3 : 0,
            Verified: $(this).find("input[type='checkbox'][id^='Verified']").attr('checked') == 'checked' ? 1 : 0,
            UpdatedBy: userContext.UserSNo
        };
        CancellationArray.push(CancellationArrayViewModel);

    });
    if (CancellationArray.length > 0) {
        if (CancellationArray[0].Verified == 0)
            validFlag = false;
    }
    if (CancellationArray.length == 0)
        CancellationArray = {
            SLISNo: 0,
            VerifiedType: 0,
            Verified: 0,
            UpdatedBy: 0
        };
    if (validFlag) {
        $.ajax({
            url: "Services/Shipment/SLInfoService.svc/saveSLICANCELLATION", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ SLISNo: currentslisno, CancellationArray: CancellationArray }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var resultStatus = result.split('?')[0];
                var resultVal = result.split('?')[1];
                //  var SLITarearr = jQuery.parseJSON(result);
                if (resultStatus == "Success") {
                    var InvoiceMsg = "";

                    if (resultVal != "") {
                        InvoiceMsg = "Auto created Invoice No  is " + resultVal + ".Kindly complete payment";

                    }

                    ShowMessage('success', 'Success - ' + SLICaption + ' Cancellation', "" + SLICaption + " successfully cancelled." + InvoiceMsg + "", "bottom-right");
                    SLISearch();
                }
                else if (resultStatus == "1001") {
                    ShowMessage('warning', 'Warning - Amendment', "RCS for this " + SLICaption + " Part is already done, " + SLICaption + " details can't be amended", "bottom-right");
                    return;
                }
                else if (resultStatus == "1002") {
                    ShowMessage('warning', 'Warning - Amendment', "" + SLICaption + " already Cancelled, " + SLICaption + " details can't be amended", "bottom-right");
                    return;
                }
                else if (resultStatus == "1003") {
                    ShowMessage('warning', 'Warning - Amendment', "FWB for this " + SLICaption + " is already done, " + SLICaption + " details can't be amended", "bottom-right");
                    return;
                }
            }
        });
    }
    else {
        flag = false;
        ShowMessage('warning', 'Warning - ' + SLICaption + ' Cancellation', "Please Select CANCEL " + SLICaption + "", "bottom-right");
    }

    return flag;
}

//Cacellations All Checkes
var paymentData;
var MendatoryPaymentCharges = new Array();
var handlingChargeLen = 0;
function BindPaymentDetails(input) {
    var currenttrId = $(input).attr("id");

    //if ($("input[type=checkbox][id=Verified]").prop("checked") == true && currenttrId == "Verified") {

    $.ajax({
        url: "Services/Shipment/SLInfoService.svc/GetRecordAtSubprocessSLIPayment", async: false, type: "get", dataType: "json", cache: false,
        data: { CityCode: userContext.CityCode, AWBSNO: currentawbsno, SLISNo: currentslisno, SubprocessSNo: 2328 },
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            //debugger;
            var payementData = jQuery.parseJSON(result);
            var handlingChargeArray = payementData.Table0;
            handlingChargeLen = handlingChargeArray.length;
            //if (handlingChargeArray.length > 0) {
            //    // $("#divareaTrans_sli_slicancellation").find("#divareaTrans_sli_shipmenthandlingchargeinfo").html('');
            //    if ($("#divareaTrans_sli_shipmenthandlingchargeinfo").html() == null) {
            //        $("#divareaTrans_sli_slicancellation").after("<div id=divareaTrans_sli_shipmenthandlingchargeinfo style=height:200px;></div>");
            //    }
            //    var HeaderTr = "<tr><td class=formHeaderLabel snowidth id=transSNo name=transSNo>SNo</td><td class=formHeaderLabel title=>Waive off</td><td class=formHeaderLabel title=Select Charge Name><span id=spnChargeName> Charge Names</span></td><td class=formHeaderLabel title=Primary Basis><span id=spnPrimaryBasis> P Basis</span></td><td class=formHeaderLabel title=Secondary Basis><span id=spnSecondaryBasis> S Basis</span></td><td class=formHeaderLabel title=><span id=spnAmount> Amount</span></td><td class=formHeaderLabel title=><span id=spnTax> Tax</span></td><td class=formHeaderLabel title=Total Amount><span id=spnTotalAmount> Total Amount</span></td><td class=formHeaderLabel title=>Mode</td><td class=formHeaderLabel title=Enter Remarks>Remarks</td><td class=formHeaderLabel title=Bill To><span id=spnBillTo> Bill To</span></td></tr>";
            //    $("#divareaTrans_sli_shipmenthandlingchargeinfo").html('');

            //    $("#divareaTrans_sli_shipmenthandlingchargeinfo").append("<table width=100% id=tblhandlingCharge> </table>")
            //    $("#tblhandlingCharge").append(HeaderTr);
            //    var RowTr;

            //    for (var i = 0; i < handlingChargeArray.length; i++) {
            //        var j = 1;
            //        RowTr = RowTr + "<tr><td class=k-input snowidth id=transSNo name=transSNo>" + parseInt(i + j) + "</td><td class=k-input title=>" +
            //            handlingChargeArray[i].IsWaveOff.toString() + "</td><td class=k-input title=Select Charge Name><span id=spnChargeName> " + handlingChargeArray[i].Description + "</span></td><td class=k-input title=Primary Basis><span id=spnPrimaryBasis> " + handlingChargeArray[i].pBasis + "</span></td><td class=k-input title=Secondary Basis><span id=spnSecondaryBasis>" + handlingChargeArray[i].sBasis + "</span></td><td class=k-input title=><span id=spnAmount> " + handlingChargeArray[i].Amount + "</span></td><td class=k-input title=><span id=spnTax> " + handlingChargeArray[i].TotalChargeTaxAmount + "</span></td><td class=k-input title=Total Amount><span id=spnTotalAmount> " + handlingChargeArray[i].Amount + "</span></td><td class=k-input title=>" + handlingChargeArray[i].PaymentMode + "</td><td class=k-input title=Enter Remarks>" + handlingChargeArray[i].Remarks + "</td><td class=k-input title=Bill To><span id=spnBillTo> " + handlingChargeArray[i].ChargeTo + "</span></td></tr>";


            //    }
            //    $("#tblhandlingCharge").append(RowTr);

            //}
        }
    });

    // }
    if ($("input[type=checkbox][id=Verified]").prop("checked") == true && currenttrId == "Verified") {
        ShowMessage('warning', 'Warning - ' + SLICaption + ' Cancellation', "Charges not finalized. Please finalize charges and make payment to proceed. SLI Cancellation Charges will be applied", "bottom-right");
        // $("#divareaTrans_sli_shipmenthandlingchargeinfo").html('');
    }
    if ($("input[type=checkbox][id=Verified_0]").prop("checked") == true && currenttrId == "Verified_0") {
        if (handlingChargeLen == 0) {
            $("input[type=checkbox][id=Verified_0]").prop("checked", false);
            ShowMessage('warning', 'Warning - ' + SLICaption + ' Cancellation', "Charges not finalized. Please finalize charges and make payment to proceed.", "bottom-right");
        }
    }
    else if (DuePayment > 0 && $("input[type=checkbox][id=Verified_0]").prop("checked") == true && currenttrId == "Verified_0") {
        $("input[type=checkbox][id=Verified_0]").prop("checked", false);
        ShowMessage('warning', 'warning - ' + SLICaption + ' Cancellation', "Document can't be returned. Please make complete payment to proceed", "bottom-right");
    }
    if ($("input[type=checkbox][id=Verified_1]").prop("checked") == true && currenttrId == "Verified_1") {
        if (handlingChargeLen == 0) {
            $("input[type=checkbox][id=Verified_1]").prop("checked", false);
            ShowMessage('warning', 'Warning - ' + SLICaption + ' Cancellation', "Charges not finalized. Please finalize charges and make payment to proceed.", "bottom-right");
        }
        else if (DuePayment > 0 && $("input[type=checkbox][id=Verified_1]").prop("checked") == true && currenttrId == "Verified_1") {
            $("input[type=checkbox][id=Verified_1]").prop("checked", false);
            ShowMessage('warning', 'warning - ' + SLICaption + ' Cancellation', "Shipment can't be returned. Please make complete payment to proceed", "bottom-right");
        }
    }
}

function ExtraCondition(textId) {

    var filterFlight = cfi.getFilter("AND");
    var filterShipperCity = cfi.getFilter("AND");
    var filterConsigneeCity = cfi.getFilter("AND");
    var ShipperAccountFilter = cfi.getFilter("AND");
    var ConsigneeFilter = cfi.getFilter("AND");
    var AirlineFilter = cfi.getFilter("AND");
    var IssuingAgentFilter = cfi.getFilter("AND");
    var filterSPHCCode = cfi.getFilter("AND");
    var filterULDTypeSNo = cfi.getFilter("AND");

    if (textId.indexOf("Text_SHIPPER_City") >= 0) {
        var filterSCity = cfi.getFilter("AND");
        cfi.setFilter(filterSCity, "CountrySNo", "eq", $("#Text_SHIPPER_CountryCode").data("kendoAutoComplete").key());
        filterShipperCity = cfi.autoCompleteFilter(filterSCity);
        return filterShipperCity;
    }
    else if (textId.indexOf("Text_ULDTypeSNo") >= 0) {
        var filterULDSNo = cfi.getFilter("AND");
        cfi.setFilter(filterULDSNo, "ULDName", "neq", "BULK");
        filterULDTypeSNo = cfi.autoCompleteFilter(filterULDSNo);
        return filterULDTypeSNo;
    }
    else if (textId.indexOf("Text_SPHCCode") >= 0) {
        var filterSPHCC = cfi.getFilter("AND");
        cfi.setFilter(filterSPHCC, "SNO", "notin", $("#Text_SPHCCode").data("kendoAutoComplete").key());
        filterSPHCCode = cfi.autoCompleteFilter(filterSPHCC);
        return filterSPHCCode;
    }

    else if (textId.indexOf("Text_searchAccountSNo") >= 0) {
        var filterAccountSNo = cfi.getFilter("AND");
        if (userContext.GroupName.toUpperCase() == "AGENT") {
            cfi.setFilter(filterAccountSNo, "SNO", "eq", userContext.AgentSNo);
            filterAccountSNo = cfi.autoCompleteFilter(filterAccountSNo);
        }
        return filterAccountSNo;
    }
        //else if (textId.indexOf("Text_AirlineSNo") >= 0) {
        //    var filterAirline = cfi.getFilter("AND");
        //   // cfi.setFilter(filterAirline, "CountrySNo", "eq", $("#Text_AirlineSNo").data("kendoAutoComplete").key());

        //    AirlineFilter = cfi.autoCompleteFilter(filterAirline);
        //    return AirlineFilter;
        //}
    else if (textId.indexOf("Text_CONSIGNEE_City") >= 0) {
        var filterCCity = cfi.getFilter("AND");

        cfi.setFilter(filterCCity, "CountrySNo", "eq", $("#Text_CONSIGNEE_CountryCode").data("kendoAutoComplete").key());
        filterConsigneeCity = cfi.autoCompleteFilter(filterCCity);
        return filterConsigneeCity;
    }
    else if ((textId.indexOf("Text_AccountSNo") >= 0)) {
        var AgentFilter = cfi.getFilter("AND");
        cfi.setFilter(AgentFilter, "CITYCODE", "eq", userContext.CityCode);

        if ($("#Text_CustomerType").val().toUpperCase() == "REGULAR") {
            cfi.setFilter(AgentFilter, "SNo", "notin", 2049);
        }

        cfi.setFilter(AgentFilter, "CITYCODE", "eq", userContext.CityCode);
        IssuingAgentFilter = cfi.autoCompleteFilter(AgentFilter);
        return IssuingAgentFilter;
    }
    else if ((textId.indexOf("Text_AAccountSNo") >= 0)) {
        var AgentFilter = cfi.getFilter("AND");
        cfi.setFilter(AgentFilter, "CITYCODE", "eq", userContext.CityCode);

        if ($("#Text_CustomerType").val().toUpperCase() == "REGULAR") {
            cfi.setFilter(AgentFilter, "SNo", "notin", 2049);
        }

        cfi.setFilter(AgentFilter, "CITYCODE", "eq", userContext.CityCode);
        IssuingAgentFilter = cfi.autoCompleteFilter(AgentFilter);
        return IssuingAgentFilter;
    }
    else if (textId.indexOf("Text_SLINo") >= 0) {
        var filterSLINo2 = cfi.getFilter("AND");
        cfi.setFilter(filterSLINo2, "SNo", "eq", currentslisno);
        filterSLINo = cfi.autoCompleteFilter(filterSLINo2);
        return filterSLINo;
    }
    else if (textId.indexOf("Text_ConsumablesSno") >= 0) {
        // onSelectInventory(textId);
        var filterULDCons = cfi.getFilter("AND");
        cfi.setFilter(filterULDCons, "AirportSNo", "eq", userContext.AirportSNo);
        filterSLINo = cfi.autoCompleteFilter(filterULDCons);
        return filterSLINo;

    }
    else if (textId.indexOf("Text_ULDConsumablesSno") >= 0) {
        //onSelectULDInventory(textId);
        var filterULDCons = cfi.getFilter("AND");
        cfi.setFilter(filterULDCons, "AirportSNo", "eq", userContext.AirportSNo);
        filterSLINo = cfi.autoCompleteFilter(filterULDCons);
        return filterSLINo;
    }
    else if (textId.indexOf("Text_EqNo") >= 0) {
        var CurrentTr = $("#" + textId).closest("tr");
        var Item = CurrentTr.find("input[id^='Text_Equipment']").val();
        var EqNo = $("input[id=" + textId + "]").data("kendoAutoComplete").key();
        var filterEqNo = cfi.getFilter("AND");
        // if (CurrentTr.find("input[id^='Text_EqType']").val() != "CONSUMABLE") {
        cfi.setFilter(filterEqNo, "Item", "eq", Item);
        // cfi.setFilter(filterEqNo, "SNo", "notin", EqNo);
        filterAWBNos = cfi.autoCompleteFilter(filterEqNo);
        //}
        return filterAWBNos;
    }
    else if (textId.indexOf("Text_Equipment") >= 0) {
        var CurrentTr = $("#" + textId).closest("tr");
        var Item = CurrentTr.find("input[id^='Text_EqType']").val();
        var filterEqNo = cfi.getFilter("AND");
        cfi.setFilter(filterEqNo, "Text_Type", "eq", Item);
        cfi.setFilter(filterEqNo, "CitySno", "eq", userContext.CitySNo);
        //cfi.setFilter(filterEqNo, "AirlineSNo", "eq", AirlineSNo);
        filterAWBNos = cfi.autoCompleteFilter(filterEqNo);
        return filterAWBNos;
    }
    else if (textId.indexOf("Text_AWBNos") >= 0) {
        var filterAWBNos1 = cfi.getFilter("AND");
        cfi.setFilter(filterAWBNos1, "AccountSNo", "eq", $("#AccountSNo").val());
        cfi.setFilter(filterAWBNos1, "AirlineSNo", "eq", $("#AirlineSNo").val());
        if ($('#isReserved').is(":checked")) {
            cfi.setFilter(filterAWBNos1, "Reserved", "eq", 1);
        } else {
            cfi.setFilter(filterAWBNos1, "Reserved", "eq", 0);
        }
        filterAWBNos = cfi.autoCompleteFilter(filterAWBNos1);
        return filterAWBNos;
    }
    else if (textId.indexOf("Text_AirlineSNo") >= 0) {
        if ($("#Text_AWBNos").val() != undefined) {
            TempSLIAwbNo = $("#Text_AWBNos").val();
            $("#Text_AWBNos").val("");
            $("#AWBNos").val("");
        }
    }
    else if (textId.indexOf("Text_TDSPHCCode") >= 0) {
        var filterAWBNos1 = cfi.getFilter("AND");
        cfi.setFilter(filterAWBNos1, "SNo", "in", TempSHCCode);
        var Last = parseInt(textId.split("_")[2] - 1);
        var SPHCSNos = "";
        if ($("input[id=" + textId + "]").val() != undefined && $("input[id=" + textId + "]").data("kendoAutoComplete").key() != undefined) {
            SPHCSNos = $("input[id=" + textId + "]").data("kendoAutoComplete").key();
        }
        else {
            if ($("input[id=" + textId + "]").val() == undefined) {
                textId = textId.replace(Last + 1, Last);
            }
            if ($("input[id=" + textId + "]").val() == undefined) {
                SPHCSNos = $("input[id=" + textId + "]").data("kendoAutoComplete").key();
            }
            else {

                SPHCSNos = $("input[id=Multi_TDSPHCCode_" + Last + "]").val();
            }
        }

        cfi.setFilter(filterAWBNos1, "SNO", "notin", SPHCSNos);
        //cfi.setFilter(filterAWBNos1, "SNo", "notin", $("#Text_TDSPHCCode").data("kendoAutoComplete").key());
        filterAWBNos = cfi.autoCompleteFilter(filterAWBNos1);
        return filterAWBNos;
    }
    else if (textId.indexOf("Text_SLISPHCCode") >= 0) {
        var filterAWBNos1 = cfi.getFilter("AND");
        if (textId.split("_")[2] != undefined) {
            cfi.setFilter(filterAWBNos1, "SNO", "notin", $("input[id=Multi_SLISPHCCode_" + textId.split("_")[2] + "]").val());
        }
        else {
            cfi.setFilter(filterAWBNos1, "SNO", "notin", $("input[id=" + textId + "]").data("kendoAutoComplete").key());
        }
        // cfi.setFilter(filterAWBNos1, "SNO", "notin", $("input[id=" + textId + "]").data("kendoAutoComplete").key());
        //cfi.setFilter(filterAWBNos1, "SNo", "in", TempSHCCode);
        // cfi.setFilter(filterAWBNos1, "SNo", "notin", $("#Text_SLISPHCCode").data("kendoAutoComplete").key());
        filterAWBNos = cfi.autoCompleteFilter(filterAWBNos1);
        return filterAWBNos;
    }
    else if (textId.indexOf("Text_ULDSPHCCode") >= 0) {
        var filterAWBNos1 = cfi.getFilter("AND");
        if (textId.split("_")[2] != undefined) {
            cfi.setFilter(filterAWBNos1, "SNO", "notin", $("input[id=Multi_ULDSPHCCode_" + textId.split("_")[2] + "]").val());
        }
        else {
            cfi.setFilter(filterAWBNos1, "SNO", "notin", $("input[id=" + textId + "]").data("kendoAutoComplete").key());
        }
        //cfi.setFilter(filterAWBNos1, "SNo", "in", TempSHCCode);
        // cfi.setFilter(filterAWBNos1, "SNo", "notin", $("#Text_ULDSPHCCode").data("kendoAutoComplete").key());
        filterAWBNos = cfi.autoCompleteFilter(filterAWBNos1);
        return filterAWBNos;
    }

    else if (textId.indexOf("ULDOtherPallets") >= 0) { //Other Pallets 
        if ($('#Text_UldBasePallet').data("kendoAutoComplete").value() == "") {
            ShowMessage('warning', 'Warning - ULD Build Details', "Please Select Base Pallet");
            var filterCondition = cfi.getFilter("AND");
            cfi.setFilter(filterCondition, "ULDNo", "eq", "#");
            filterFlight = cfi.autoCompleteFilter(filterCondition);
            return filterFlight;
        }
        else {
            var filterCondition = cfi.getFilter("AND");
            cfi.setFilter(filterCondition, "ULDNo", "notin", $("#Text_UldBasePallet").data("kendoAutoComplete").value());
            $('span.k-icon.k-delete').each(function (index, item) { // Allready Added in Db
                cfi.setFilter(filterCondition, "ULDNo", "notin", item.id);
            });
            var tempAdded = $('#ULDOtherPallets').val(); // Temp Added
            if (tempAdded != "") {
                var arr = tempAdded.split('=#=');
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] != "") {
                        cfi.setFilter(filterCondition, "ULDNo", "notin", arr[i]);
                    }
                }
            }
            filterFlight = cfi.autoCompleteFilter(filterCondition);
            return filterFlight;
        }
    }


        //else if (textId.indexOf("Text_ServiceName") >= 0) {
        //    var filterServiceName = cfi.getFilter("AND");
        //    cfi.setFilter(filterServiceName, "AirportSNo", "eq", userContext.AirportSNo);
        //    filterSLINo = cfi.autoCompleteFilter(filterServiceName);
        //    return filterSLINo;
        //}

        //----
    else if ((textId.indexOf("Text_SHIPPER_AccountNo") >= 0) || (textId.indexOf("SHIPPER_Name") >= 0)) {
        if (parseInt(userContext.AgentSNo || 0) > 0) {
            var SHIPPER_AccountNo2 = cfi.getFilter("AND");
            cfi.setFilter(SHIPPER_AccountNo2, "AccountSNo", "eq", userContext.AgentSNo);
            ShipperAccountFilter = cfi.autoCompleteFilter(SHIPPER_AccountNo2);
            return ShipperAccountFilter;
        }
    }
    else if ((textId.indexOf("Text_CONSIGNEE_AccountNo") >= 0) || (textId.indexOf("CONSIGNEE_AccountNoName") >= 0)) {
        if (parseInt(userContext.AgentSNo || 0) > 0) {
            var ConsigneeFilter2 = cfi.getFilter("AND");
            cfi.setFilter(ConsigneeFilter2, "AccountSNo", "eq", userContext.AgentSNo);
            ConsigneeFilter = cfi.autoCompleteFilter(ConsigneeFilter2);
            return ConsigneeFilter;
        }
    }





}


function piecesdetails(pid) {
    var strPieces = "";

    $.each($(pid).closest('tr').find("span[id^='ScanPieces']").text().split(","), function (i, item) {
        strPieces += padDigits(item.trim(), 5) + " ,";
    })

    var res = "<table width='100%' class='WebFormTable'>" +
            "<tr>" +
                "<td class='formlabel'>AWB No</td>" +
                "<td class='formInputcolumn'>" + AWBNo.toUpperCase() + "</td>" +
            "</tr>" +
            "<tr>" +
                "<td class='formlabel'>" + SLICaption + " No</td>" +
                "<td class='formInputcolumn'>" + slino.substring(0, 8).toUpperCase() + "</td>" +// $(pid).closest('tr').find("span[id^='SLINo']").text()

            "</tr>" +
            "<tr>" +
                "<td class='formlabel'>Piece No</td>" +
                "<td class='formInputcolumn'><div class='new' style='word-wrap:break-word; display:block; width:700px;'>" + strPieces.substring(0, strPieces.length - 1) + "</div></td>" +
               "</tr>" +
        "</table>";
    $("#pWindow").html(res);

    if (!$("#pWindow").data("kendoWindow"))
        cfi.PopUp("pWindow", "Pieces", "900", null, null, 60);
    else
        $("#pWindow").data("kendoWindow").open();
}
function padDigits(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

var fotter = "<div><table style='margin-left:20px;'>" +
                        "<tbody><tr><td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-primary btn-sm' style='width:125px;' id='btnNew'>New</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-success btn-sm'  id='btnSave'>Save</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-success btn-sm'  id='btnSaveToNext'>Save &amp; Next</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-danger btn-sm' id='btnCancel'>Cancel</button></td>" +
                        "</tr></tbody></table> </div>";
var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divShipmentDetails' style='width:100%'></div><div id='pWindow'></div><div id='divULDInfoforSLI'><div id=div1></div><div id=div2></div><div id=div3></div></div><div id=UldRemarks></div><div id=divTempDetails></div><div id=divEqDetails></div><div id='divFWBPopUp'> </div></td></tr><tr><td valign='top'><div id='divNewBooking' style='width:100%'></div></td></tr><tr> <td valign='top'> <table style='width:100%'> <tr> <td style='width:70%;' valign='top' class='tdInnerPadding'> <div id='tabstrip'> <ul id='ulTab' style='display:none;'> <li class='k-state-active'> Genral </li><li> SPHC Wise </li></ul> <div> <div id='divDetail'></div></div><div> <div id='divDetailSHC'> </div></div></div></td></tr></table> </td></tr></table></div>";

var popupfotter = "<div><table style='margin-left:20px;'>" +
                        "<tbody><tr><td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-success btn-sm'  id='btnSave'>Save</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-danger btn-sm' id='btnCancel'>Cancel</button></td>" +
                        "</tr></tbody></table> </div>";
var PopupFooterForTemp = "<div><table style='margin-left:20px;'>" +
                        "<tbody><tr><td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-success btn-sm'  id='btnAdd'>Add</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-danger btn-sm' id='btnCancel'>Cancel</button></td>" +
                        "</tr></tbody></table> </div>";

var PopupfwbFooter = "<div><table style='margin-left:200px;'>" +
                        "<tbody><tr><td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-success btn-sm'  id='btnFetch'>Fetch Data</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-danger btn-sm' id='btnCancel'>Cancel</button></td>" +
                        "</tr></tbody></table> </div>";

////$('#btnSave').unbind("click").bind("click", function () {
////    alert("Save SLI");
////});

//Manually Add Row by Make Trans in SLI ULD DIms
function handleAddA(elem) {
    var self = $("#areaTrans_sli_sliulddimension").closest("tr");
    var selfId = $(self).attr("id");

    var myClone = $(self).clone(false);
    // alert(myClone);
    var transcss = "btnTrans btnTrans-default";
    var options = $.extend({
        linkText: 'Add more',
        linkClass: 'icon-trans-plus-sign',
        resetLinkText: 'Reset',
        resetLinkClass: 'icon-trans-refresh',
        enableRemove: true,
        removeLinkText: 'Delete',
        removeLinkClass: 'icon-trans-trash',
        confirmOnRemove: true,
        confirmationMsgOnRemove: 'Are you sure, you wish to remove selected row?',
        beforeAddEventCallback: null,
        addEventCallback: null,
        convertToControl: ConvertToControl,
        removeEventCallback: null,
        maxItemsAllowedToAdd: null,
        maxItemReachedCallback: null,
        searchType: false,
        isReset: false,
        data: [],
        isAdd: true,
        afterConvertMultiField: null,
        IsPopUp: false
    }, options);

    if (options.beforeAddEventCallback !== null) {
        var retVal = options.beforeAddEventCallback(elem.closest("[id^='areaTrans_']"));
        if (!retVal) {
            return false;
        }
    }

    var totalCount = parseInt($(self).attr("TotalFieldsAdded"), 10);
    if (totalCount < parseInt($("td[id^='tdSNoCol']").last().text())) {
        totalCount = parseInt($("td[id^='tdSNoCol']").last().text());
    }


    var fieldCount = parseInt($(self).attr("FieldCount"), 10);
    if (options.maxItemsAllowedToAdd === null || totalCount < options.maxItemsAllowedToAdd) {
        var newElem = myClone.clone(true);
        $(newElem).attr("id", $(newElem).attr("id") + "_" + totalCount);
        $(newElem).find("*[id!=''][name!='']").each(function () {
            if ($(this).attr("id")) {
                var strid = $(this).attr("id");
                var strname = "";
                var type = $(this).attr("type");
                $(this).closest("tr").find("td[id^='tdSNoCol']").text((totalCount + 2).toString());
                if ($(this).attr("name")) {
                    strname = $(this).attr("name");
                }
                if ($(this).attr("controltype") == "datetype") {
                    if ($(this).attr("endcontrol") != undefined) {
                        $(this).attr("endcontrol", $(this).attr("endcontrol") + "_" + totalCount)
                    }
                    if ($(this).attr("startcontrol") != undefined) {
                        $(this).attr("startcontrol", $(this).attr("startcontrol") + "_" + totalCount)
                    }

                }

                if (($(this).attr("controltype") == "autocomplete") || ($(this).attr("controltype") == "datetype")) {

                    if ($(this).attr("controltype") == "autocomplete") {
                        if ($("#" + $(this).attr("id")).closest("span").length != 0)
                            $(this).attr("style", $("#" + $(this).attr("id")).closest("span")[0].style.cssText);
                    } else {
                        //Amit
                        $(this).attr("style", $("#" + $(this).attr("id")).closest("span")[0].style.cssText).removeClass("k-input");

                    }
                }
                else {
                    $(this).attr("style", $(this)[0].style.cssText);
                }


                $(this).attr("id", strid + "_" + totalCount);
                if (strname != undefined)
                    $(this).attr("name", strname + "_" + totalCount);
                if (type != "radio" && type != "checkbox")
                    $(this).val("");
                if (type == "checkbox")
                    $(this).attr("validatename", strid + "_" + totalCount + "[]");
            }
        });
        totalCount++;
        fieldCount++;

        $(self).attr("TotalFieldsAdded", totalCount);
        $(self).attr("FieldCount", fieldCount);

        $(newElem).removeAttr("uniqueId");

        if (options.enableRemove && $(self).attr("uniqueId") != $(elem).closest("[id^='areaTrans']").attr("uniqueId")) {
            if ($(elem).closest("[id^='areaTrans']").find("." + options.removeLinkClass).length === 0) {
                $(elem).closest("[id^='areaTrans']").find("#transAction").append(" <input type='button' class='" + options.removeLinkClass + "'value='" + options.removeLinkText + "'/>");
            }
            $(elem).closest("[id^='areaTrans']").find("." + options.removeLinkClass).unbind("click").click(function () {
                fn_RemoveULDRow($(this));
            });
        }

        $(newElem).attr("uniqueId", options.linkClass + Math.random());
        //$(elem).parent().after(newElem);
        $(elem).closest("[id^='areaTrans']").after(newElem);

        $(elem).closest("[id^='areaTrans']").find("." + options.linkClass).remove();

        // $(newElem).find("." + options.resetLinkClass).remove();
        //$(newElem).find("." + options.linkClass).remove();
        //$(newElem).find("." + options.removeLinkClass).remove();

        if (options.enableRemove) {
            if ($(newElem).find("." + options.removeLinkClass).length === 0) {
                $(newElem).find("#transAction_" + (totalCount - 1).toString()).find("div[id^='transActionDiv']").append(" <i class='" + transcss + " " + options.removeLinkClass + "' title='" + options.removeLinkText + "'></i>");
            }
            $(newElem).find("." + options.removeLinkClass).unbind("click").click(function () {
                fn_RemoveULDRow($(this));
            });
        }

        $(self).attr("maxCountReached", "false");
        if (options.isAdd) {
            if (options.linkClass != "scheduletransradiocss") {
                $(newElem).find("#transAction_" + (totalCount - 1).toString()).find("div[id^='transActionDiv']").append(" <i class='" + transcss + " " + options.linkClass + "' title='" + options.linkText + "'></i>");
                newElem.find("." + options.linkClass).unbind("click").click(function () {
                    if (cfi.IsValidTransSection($(newElem).closest("div").attr("id"))) {
                        return handleAddA($(this));
                    }
                });
            }
            else {
                $(newElem).find("." + options.linkClass.replace("css", "")).unbind("click").click(function () {
                    if ($(this).val() == "1") {
                        if (cfi.IsValidTransSection($(newElem).closest("div").attr("id"))) {
                            return handleAddA($(this));
                        }
                        else {
                            $(newElem).find("input[type='radio']." + options.linkClass.replace("css", "")).each(function () {
                                $(this).removeAttr("checked");
                                if ($(this).val() == "0") {
                                    $(this).attr("checked", true);
                                }
                            });
                        }
                    }
                });
            }
        }
        if (options.convertToControl !== null) {
            options.convertToControl($(newElem), self);
        }
        if (options.addEventCallback !== null) {
            options.addEventCallback($(newElem), self);
        }

    }

    if (options.maxItemsAllowedToAdd !== null && totalCount >= options.maxItemsAllowedToAdd) {
        newElem.find("." + options.linkClass).hide();
        3157
        if (options.maxItemReachedCallback !== null) {
            options.maxItemReachedCallback($(newElem), self);
        }
    }
    $(newElem).find("td[id^='tdSNoCol']").text(parseInt($(newElem).prev().find("td[id^='tdSNoCol']").text()) + 1);
    BindULDAutoComplete(newElem);
    return true;
}

//Set Dims tab for SLI Dims
function fntab(obj) {
    if (!$(obj).closest('tr').next("tr").find("#OwnerCode").is(":visible")) {
        $(obj).closest('tr').next("tr").find("input[id^='ULDLength']").focus();
    }
}
