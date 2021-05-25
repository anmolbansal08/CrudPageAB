var lstItem = [];
var AWBDetailsArray = [];
var AirlineAccess = "";
var IsAllAirline = 0;
$(document).ready(function () {
    SearchCTM();
    $.ajax({
        url: "../schedule/GetAirports", async: false, type: "POST", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result[0] != undefined && result[0] != null) {
                
                AirlineAccess = result[0].Airlines.TrimRight();
                IsAllAirline = parseInt(result[0].IsAllAirlines);
            }
        }
    });

    //$("#divDetail  table tbody tr table").find("input:text[id^='NatureofGoods_']").keypress(function (e) {
    //$('#NatureofGoods_0').keypress(function (e) {
    //    var allowedChars = new RegExp("^[a-zA-Z0-9\ ]+$");
    //    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    //    if (allowedChars.test(str)) {
    //        return true;
    //    }
    //    e.preventDefault();
    //    return false;
    //}).keyup(function () {
    //    // the addition, which whill check the value after a keyup (triggered by Ctrl+V)
    //    // We take the same regex as for allowedChars, but we add ^ after the first bracket : it means "all character BUT these"
    //    var forbiddenChars = new RegExp("[^a-zA-Z0-9\ ]", 'g');
    //    if (forbiddenChars.test($(this).val())) {
    //        $(this).val($(this).val().replace(forbiddenChars, ''));
    //    }
    //});

    $('#btnSave').click(function () {

        if (lstItem.length <= 0) {
            ShowMessage('warning', 'Warning - CTM', 'Add Details In List first', " ", "bottom-right");
            return;
        }
        var SaveFlag = true;



        if (confirm('Are you sure, do you want to Save?')) {

            //if ($("input[id=AWBTYPE_0]:checked").val() == '1') {
            //    $('#divDetail table tbody tr table').each(function (row, tr) {

            //        if ($(tr).find("input:text[id^='Pcs_0']").val() == "") {
            //            ShowMessage('warning', 'Warning - CTM', 'Enter Pieces', " ", "bottom-right");
            //            $(tr).find("input:text[id^='Pcs_0']").focus();
            //            SaveFlag = false;
            //        } else
            //            if ($(tr).find("input:text[id^='Pcs_0']").val() == "0") {
            //                ShowMessage('warning', 'Warning - CTM', 'Total pieces should be greater than 0', " ", "bottom-right");

            //                cfi.PopUp("divDetailAWB", "AWB Details", 800, null, PopUpOnClose);

            //                $("#CTMPieces").focus();
            //                SaveFlag = false;
            //            } else if ($(tr).find("input:text[id^='Text_AWBNo_0']").val() == "" && $("input[id=AWBTYPE_0]:checked").val() == "1") {
            //                ShowMessage('warning', 'Warning - CTM', 'Enter AWB No', " ", "bottom-right");
            //                $(tr).find("input:text[id^='Text_AWBNo_0']").focus();
            //                SaveFlag = false;
            //            }
            //            else if ($(tr).find("input:text[id^='Text_TransferTo_']").val() == "") {
            //                ShowMessage('warning', 'Warning - CTM', 'Enter Transfer Type', " ", "bottom-right");
            //                $(tr).find("input:text[id^='Text_TransferTo_']").focus();
            //                SaveFlag = false;
            //            }
            //            else if ($(tr).find("input:text[id^='Text_TransferType_']").val() == "") {
            //                if ($("input[id=AWBTYPE_0]:checked").val() != "1") {
            //                    ShowMessage('warning', 'Warning - CTM', 'Enter TransferTo ', " ", "bottom-right");
            //                    $(tr).find("input:text[id^='Text_TransferType_']").focus();
            //                    SaveFlag = false;
            //                }
            //            }
            //            else if ($('#BillTo_0').val() == "") {
            //                if ($("input[id=AWBTYPE_0]:checked").val() == "1" && $('#TransferTo_0').val() == '4') {
            //                    ShowMessage('warning', 'Warning - CTM', 'Enter Bill To', " ", "bottom-right");
            //                    $(tr).find("input:text[id^='Text_BillTo_']").focus();
            //                    SaveFlag = false;
            //                }

            //            }                    // $("#hdnPieces").val() == '' ? 0 : $("#hdnPieces").val()
            //        if ($("#Pcs_0").val() != "") {

            //            if (parseInt($("#Pcs_0").val()) > parseInt($("#hdnPieces").val() == '' ? 0 : $("#hdnPieces").val())) {

            //                ShowMessage('warning', 'Warning - CTM', 'Pieces should be less than total pieces', " ", "bottom-right");
            //                $("#Pcs_0").val("");
            //                //  $(tr).find("input:text[id^='Pcs_0']").focus();
            //                SaveFlag = false;
            //            }
            //        }

            //    });
            //}


            if (SaveFlag) {
                var CTMInfo = new Array();
                var AwbInfo = new Array();

                if ($("input[id=AWBTYPE_0]:checked").val() == '1') {
                    //$('#divDetail table tbody tr table').each(function (row, tr) {
                    //    CTMInfo.push({
                    //        AWBSNo: $(tr).find("input:hidden[id^='AWBNo_']").val() == "" ? "0" : $(tr).find("input:hidden[id^='AWBNo_']").val(),
                    //        AWBTYPE: $("input[id=AWBTYPE_0]:checked").val(),
                    //        Pieces: $('#Pcs_0').val(),
                    //        GrWt: $('#Grwt_0').val(),
                    //        DOSNO: 0,
                    //        PDSNo: 0,
                    //        TransferAirportSNo: userContext.AirportSNo,
                    //        TransferCitySNo: userContext.CitySNo,
                    //        DateOfTransfer: $(tr).find("input:text[id^='TransferDate_']").val(),
                    //        //TransferTO: $(tr).find("input:text[id^='Text_TransferTo_']").val(),
                    //        TransferTo: $(tr).find("input:hidden[id^='TransferTo_']").val() == "" ? "0" : $(tr).find("input:hidden[id^='TransferTo_']").val(),
                    //        TransferToSNo: $(tr).find("input:hidden[id^='TransferType_']").val() == "" ? "0" : $(tr).find("input:hidden[id^='TransferType_']").val(),
                    //        DeliverdTo: $(tr).find("input:text[id^='DeliverdTo_']").val() == "" ? "0" : $(tr).find("input:text[id^='DeliverdTo_']").val(),
                    //        IdCardNo: '',
                    //        TransferType: $(tr).find("input:hidden[id^='TransferType_']").val() == "" ? "0" : $(tr).find("input:hidden[id^='TransferType_']").val(),
                    //        NatureofGoods: $(tr).find("input:text[id^='NatureofGoods_']").val(),
                    //        Remarks: $(tr).find("input:text[id^='Remarks_']").val()

                    //    });


                    //});
                    for (var i = 0; lstItem.length - 1 >= i; i++) {

                        CTMInfo.push({
                            AWBSNo: lstItem[i].AWBSNO,
                            AWBTYPE: $("input[id=AWBTYPE_0]:checked").val(),
                            Pieces: lstItem[i].Pcs,
                            GrWt: lstItem[i].GrossWt,
                            DOSNO: 0,
                            PDSNo: 0,
                            TransferAirportSNo: userContext.AirportSNo,
                            TransferCitySNo: userContext.CitySNo,
                            DateOfTransfer: $('#TransferDate_0').val(),
                            TransferTo: lstItem[i].TransferToValue == "" ? "0" : lstItem[i].TransferToValue,
                            TransferToSNo: lstItem[i].TransferTypeValue == "" ? "0" : lstItem[i].TransferTypeValue,
                            DeliverdTo: $('#DeliverdTo_0').val() == "" ? "0" : $('#DeliverdTo_0').val(),
                            IdCardNo: '',
                            TransferType: lstItem[i].TransferTypeValue,
                            NatureofGoods: lstItem[i].NatureofGoods,
                            Remarks: lstItem[i].Remarks,
                            DailyFlightSno: lstItem[i].DailyFlightSno,

                        });
                    }
                } else {


                    for (var i = 0; lstItem.length - 1 >= i; i++) {

                        CTMInfo.push({
                            AWBSNo: lstItem[i].AWBSNO,
                            AWBTYPE: $("input[id=AWBTYPE_0]:checked").val(),
                            Pieces: lstItem[i].Pcs,
                            GrWt: lstItem[i].GrossWt,
                            DOSNO: 0,
                            PDSNo: 0,
                            TransferAirportSNo: userContext.AirportSNo,
                            TransferCitySNo: userContext.CitySNo,
                            DateOfTransfer: $('#TransferDate_0').val(),
                            TransferTo: lstItem[i].TransferToValue,
                            TransferToSNo: lstItem[i].TransferTypeValue,
                            DeliverdTo: $('#DeliverdTo_0').val() == "" ? "0" : $('#DeliverdTo_0').val(),
                            IdCardNo: '',
                            TransferType: lstItem[i].TransferTypeValue,
                            NatureofGoods: lstItem[i].NatureofGoods,
                            Remarks: lstItem[i].Remarks,
                            DailyFlightSno: lstItem[i].DailyFlightSno,

                        });
                    }
                }
                var HandlingChargeArray = [];
                if ($("input[id=AWBTYPE_0]:checked").val() == "1") {
                    $("div[id$='divareaTrans_import_ctmcharge']").find("[id^='areaTrans_import_ctmcharge']").each(function () {
                        if ($(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key() != "") {
                            var HandlingChargeViewModel = {
                                SNo: $(this).find("td[id^='tdSNoCol']").html(),
                                AWBSNo: $('#HdnAWBNo_0').val(),
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
                                Mode: $("[id^='PaymentMode']").prop('checked') == true ? "CASH" : "CREDIT",
                                ChargeTo: $('#BillTo_0').val(),
                                pBasis: $(this).find("[id^='PBasis']").text(),
                                sBasis: $(this).find("[id^='SBasis']").text(),
                                Remarks: $(this).find("[id^='Remarks']")[1].innerText == undefined ? "" : $(this).find("[id^='Remarks']")[1].innerText.toUpperCase(),
                                WaveoffRemarks: '',
                                DescriptionRemarks:''
                            };
                            HandlingChargeArray.push(HandlingChargeViewModel);

                        }

                    });
                }
                //else {
                //    var HandlingChargeViewModel = {
                //        SNo: $(this).find("td[id^='tdSNoCol']").html(),
                //        AWBSNo: 0,
                //        WaveOff: 0,
                //        TariffCodeSNo: 0,
                //        TariffHeadName:0,
                //        pValue: 0,
                //        sValue: 0,
                //        Amount: 0,
                //        TotalTaxAmount: 0,
                //        TotalAmount: 0,
                //        Rate: 0,
                //        Min: 1,
                //        Mode: 0,
                //        ChargeTo: 0,
                //        pBasis: 0,
                //        sBasis: 0,
                //        Remarks: '',
                //        WaveoffRemarks: ''
                //    };
                //    HandlingChargeArray.push(HandlingChargeViewModel);
                //}

                //  AwbInfo.push(AWBDetailsArray);


                var DFSno = $("#hdnDFSno").val();

                //var filteredArray = AWBDetailsArray.filter(function (AWBDetailsArray_el) {
                //    return CTMInfo.filter(function (CTMInfo_el) {
                //        return CTMInfo_el.AWBSNo == AWBDetailsArray_el.AWBSNO;
                //    }).length != 0
                //});


                $.ajax({
                    url: "Services/Import/CTMService.svc/SaveCTM", async: false, type: "POST", dataType: "json", cache: false,
                    data: JSON.stringify({ CTMInfo: CTMInfo, dOHandlingCharges: HandlingChargeArray, AwbInfo: AWBDetailsArray, DFSno: DFSno }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        //  var sucesstype = result.split(',')[1];
                        if (result == '0') {
                            ShowMessage('success', 'Success', "CTM Processed Successfully ", "bottom-right");
                            $('#divCTMDetails').show();
                            CTMSearch();

                            $('#divDetail').html('');
                            $('#divDetailAWBWise').html('');
                            $('#tblMultiCTMDetail').html('');
                        }
                        else
                            ShowMessage('warning', 'Warning - CTM', 'CTM Insertion Failed', " ", "bottom-right");

                    },


                });
            }

        }
    })
    $('#btnCancel').click(function () {
        $('#divDetail').html('');
        $('#tblMultiCTMDetail').html('');
        $('#btnSave').css('display', 'none')
        $('#btnCancel').css('display', 'none')

    })


    $(document).on("change", "input[name='AWBTYPE_0']", function () {
        cfi.ResetAutoComplete("AWBNo_0");
        $('#Pcs_0').val('');
        $('#hdnPieces').val('');
        $('#Grwt_0').val('');
        $('#hdnGrWt').val('');
        $('#spnCbm_0').text('');
        $('#spnAWBOrigin_0').text('');
        $('#spnAWBDestination_0').text('');
        $('#spnFlightNO_0').text('');
        $('#spnFlightDate_0').text('');
        $('#spnAWBOrigin_0').text('');
        $('#spnFlightOrigin_0').text('');
        $('#spnFlightDestination_0').text('');
        $('#spnTransferCity_0').text('');
        // $('#TransferDate_0').val('');
        $("#TransferDate_0").datepicker("option", "dateFormat", "dd-M-yy");
        $('#TransferDate_0').datepicker('setDate', new Date())
        $('#spnFreightType_0').text('');
        $('#NatureofGoods_0').val('');
        cfi.ResetAutoComplete("TransferTo_0");
        cfi.ResetAutoComplete("TransferType_0");
        $("#Text_TransferType_0").data("kendoAutoComplete").enable(true);
        $("#Text_TransferTo_0").data("kendoAutoComplete").enable(true);
        $("#tblIssueDetail").html("");

        $("#tblMultiCTMDetail").html('');
        lstItem = [];
        AWBDetailsArray = [];


    });
    $(document).on("change", "input[name='AWBNo_0']", function () {
        cfi.ResetAutoComplete("TransferTo_0");
    });


    //$("#CTMPieces").keydown(function (e) {
    //    alert(e);
    //    // Allow: backspace, delete, tab, escape, enter and .
    //    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
    //        // Allow: Ctrl+A, Command+A
    //        (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
    //        // Allow: home, end, left, right, down, up
    //        (e.keyCode >= 35 && e.keyCode <= 40)) {
    //        // let it happen, don't do anything
    //        return;
    //    }
    //    // Ensure that it is a number and stop the keypress
    //    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
    //        e.preventDefault();
    //    }
    //});

    $(document).on("keypress", "input[id='CTMPieces']", function (e) {
        //var verified = (e.which == 8 || e.which == undefined || e.which == 0 ) ? null : String.fromCharCode(e.which).match(/[^0-9]/);
        //if (verified) { e.preventDefault(); }

        var iKeyCode = (e.which) ? e.which : e.keyCode;
        var verified = (iKeyCode == 8 || iKeyCode == undefined || iKeyCode == 0) ? null : String.fromCharCode(iKeyCode).match(/[^0-9]/);
        if (verified) { e.preventDefault(); }
        //  IsValidateNumber(e);

    })

    $(document).on("blur", "input[id='CTMPieces']", function () {
        calculateGrossOrVol();
    })

    $("#Text_AWBNo_0").keydown(function (e) {
        if (e.keyCode == 13) {
            if ($("#AWBNo_0").val() == '') {
                return true;
            }
        }
    });


});

function calculateGrossOrVol() {

    var totaldetail = $("span[id='PcsGrossVol']").text();

    if ($('#CTMPieces').val() != '') {


        var totalPieces = totaldetail.split('/')[0];
        var Pieces = $('#CTMPieces').val() == '' ? 0 : $('#CTMPieces').val();
        if (parseInt(Pieces) <= parseInt(totalPieces) && parseInt(Pieces) > 0) {
            var TotalGrWt = totaldetail.split('/')[1];
            var Grwt = ((parseFloat(TotalGrWt) / parseFloat(totalPieces)) * parseFloat(Pieces));
            var TotalVol = totaldetail.split('/')[2];
            var vol = ((parseFloat(TotalVol) / parseFloat(totalPieces)) * parseFloat(Pieces));
            $("span[id='CTMGrossWt']").text(Grwt.toFixed(2) == 0.00 ? 0.001 : Grwt.toFixed(2));
            $("span[id='CTMVolWt']").text(vol.toFixed(2) == 0.00 ? 0.001 : vol.toFixed(2));
        } else {

            ShowMessage('warning', 'Warning - CTM', 'Pieces should be less than or equal to total pieces', " ", "bottom-right");
            $('#CTMPieces').val(totalPieces);
        }
    } else {
        $('#CTMPieces').val(totaldetail.split('/')[0]);
    }
}

function IsValidateNumber(e) {
    try {
        if (window.event) {
            var charCode = window.event.keyCode;
        }
        else if (e) {
            var charCode = e.which;
        }
        else { return true; }
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
    catch (err) {

    }
}

function SearchCTM() {
    _CURR_PRO_ = "CTM";
    _CURR_OP_ = "CTM";
    $("#licurrentop").html(_CURR_OP_);
    $("#tblMultiCTMDetail").html("");
    $("#divCTMDetails").html("");

    $("#divFooter").html(fotter).show();
    CleanUI();
    $.ajax({
        url: "Services/Import/CTMService.svc/GetWebForm/" + _CURR_PRO_ + "/Import/CTM/Search/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divbody").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");
            $("#divContent").html(divContent);
            $('#FlightDate').data("kendoDatePicker").value("");

            $('#aspnetForm').on('submit', function (e) {
                e.preventDefault();
            });

            $("#FlightDate").change(function () {
                ValidateDate();
            });

            //  $("#IsBondedWareHouse").after("Bonded Warehouse");
            //$("#btnSearch").closest("td").after("<td><button class=\"btn btn-block btn-primary\" id=\"btnNew\" style=\"margin-top: 0px;\">New</button><\/td>");




            //$('<tr><td style=\"width:20px\"></td><td ><span class=\"k-picker-wrap k-state-default k-widget k-datepicker k-header\" style=\"width: 100px;\"><input type=\"text\" class=\"k-input k-state-default\" name=\"PrintDate\" id=\"PrintDate\" style=\"width: 100%; color: rgb(0, 0, 0);\" data-valid=\"required\" data-valid-msg=\"Select Date\" tabindex=\"3\" controltype=\"datetype\" maxlength=\"\" value=\"\" placeholder=\"Date\" data-role=\"datepicker\" sqldatevalue=\"\" formattedvalue=\"\"><span unselectable=\"on\" class=\"k-select\"><span unselectable=\"on\" class=\"k-icon k-i-calendar\">select</span></span></span></td><td colspan=\"5\" ><input type=\"hidden\" name=\"Airline\" id=\"Airline\" value=\"\" /><input type=\"text\" class=\"\" name=\"Text_Airline\"  id=\"Text_Airline\" controltype=\"autocomplete\" data-valid=\"required\"  maxlength=\"\" data-width=\"50px\" value=\"\" placeholder=\"Airline\" /></td></tr>').insertAfter($('#__tblctm__').find('tbody  tr').closest('tr'));

            // $('<tr><td style=\"width:20px\"></td><td class=\"formSearchInputcolumn\"><span class=\"k-picker-wrap k-state-default k-widget k-datepicker k-header\" style=\"width: 100px;\"><input type=\"text\" class=\"k-input k-state-default\" name=\"FlightDate\" id=\"FlightDate\" style=\"width: 100%; color: rgb(0, 0, 0);\" data-valid=\"required\" data-valid-msg=\"Select Flight Date\" tabindex=\"3\" controltype=\"datetype\" maxlength=\"\" value=\"\" placeholder=\"Flight Date\" data-role=\"datepicker\" sqldatevalue=\"2016-07-27\" formattedvalue=\"27-Jul-2016\"><span unselectable=\"on\" class=\"k-select\"><span unselectable=\"on\" class=\"k-icon k-i-calendar\">select</span></span></span></td><td colspan=\"5\" ><input type=\"hidden\" name=\"Airline\" id=\"Airline\" value=\"\" /><input type=\"text\" class=\"\" name=\"Text_Airline\"  id=\"Text_Airline\" controltype=\"autocomplete\" data-valid=\"required\"  maxlength=\"\" data-width=\"50px\" value=\"\" placeholder=\"Airline\" /></td></tr>').insertAfter($('#__tblctm__').find('tbody  tr').closest('tr'));

            $("#btnSearch").after("&nbsp;<button class=\"btn btn-info\"  style=\"margin-top: 0px\" id=\"btnNew\" onclick=\"CTMNew();\">New</button>");
            //  $("#btnNew").after('&nbsp;<span class=\"k-picker-wrap k-state-default k-widget k-datepicker k-header\" style=\"width: 100px;\"><input type=\"text\" class=\"k-input k-state-default\" name=\"PrintDate\" id=\"PrintDate\" style=\"width: 100%; color: rgb(0, 0, 0);\" data-valid=\"required\" data-valid-msg=\"Select Date\" tabindex=\"3\" controltype=\"datetype\" maxlength=\"\" value=\"\" placeholder=\"Date\" data-role=\"datepicker\" sqldatevalue=\"\" formattedvalue=\"\"><span unselectable=\"on\" class=\"k-select\"><span unselectable=\"on\" class=\"k-icon k-i-calendar\">select</span></span></span><input type=\"hidden\" name=\"Airline\" id=\"Airline\" value=\"\" /><input type=\"text\" class=\"\" name=\"Text_Airline\"  id=\"Text_Airline\" controltype=\"autocomplete\" data-valid=\"required\"  maxlength=\"\" data-width=\"50px\" value=\"\" placeholder=\"Airline\" />');


            $("#Text_Airline").after("&nbsp;<button class=\"btn btn-info btn-sm\"  style=\"margin-top: 0px;\" id=\"btnNew\" onclick=\"PrintCTM('divCtmPrint');\">Print</button>");
            cfi.AutoCompleteV2("Airline", "AirlineName", "CTM_Airline", Fn_CTmPrint, "contains");

            $("#PrintDate").kendoDatePicker();

            //---------------------- CTM search ---------------------------//
            $("#btnSearch").bind("click", function () {
                $("#divDetail").html('');
                $('#divCTMDetails').show();

                $("#tblMultiCTMDetail").html('');
                lstItem = [];
                AWBDetailsArray = [];
                CTMSearch();
            });

            PagerightsCheckCTM();
        },
        error: function (ex) {
            var e = ex;
        }
    });
}


function PrintAWBWise(SNo) {
    Fn_CTmPrintAWBWise(SNo);
}


function Fn_CTmPrintAWBWise(SNo) {
    var PrintDate = "0";
    PrintDate = $("#PrintDate").attr("sqldatevalue") != "" ? $("#PrintDate").attr("sqldatevalue") : "0";


    $("#divPrint").html('');
    $.ajax({
        url: "HtmlFiles/Import/CTMPrint.html", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            //  alert('Test')
            $("#divPrint").html(result);

            var AirlineSNo = $('#Airline').val();

            GetCTMDataAWBWise(SNo);
        }
    });

   
    cfi.PopUp("divPrint", "Print", 1000, null, null, 10);

    var contents = document.getElementById("divPrint").innerHTML;
    var frame2 = document.createElement('iframe');
    frame2.name = "frame2";
    frame2.id = "frame2";

    window.parent.$("#iMasterFrame").after(frame2);
    var frameDoc = (frame2.contentWindow) ? frame2.contentWindow : (frame2.contentDocument.document) ? frame2.contentDocument.document : frame2.contentDocument;
    frameDoc.document.open();
    frameDoc.document.write('<html><head><title>DIV Contents</title>');
    frameDoc.document.write('</head><body>');
    frameDoc.document.write(contents);
    frameDoc.document.write('</body></html>');
    frameDoc.document.close();
    
   
    setTimeout(function () {
        window.parent.frames[1].print();
        window.parent.$('[id*="frame2"]').remove()
    }, 1000);
    //$("#divCtmPrint").printArea();


}

function Fn_CTmPrint() {
    var PrintDate = "0";
    PrintDate = $("#PrintDate").attr("sqldatevalue") != "" ? $("#PrintDate").attr("sqldatevalue") : "0";


    $("#divDetail").html('');
    $.ajax({
        url: "HtmlFiles/Import/CTMPrint.html", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            //  alert('Test')
            $("#divDetail").html(result);

            var AirlineSNo = $('#Airline').val();

            GetCTMData(AirlineSNo, PrintDate);
        }
    });
}
function GetCTMDataAWBWise(SNo) {
    $.ajax({
        url: "Services/Import/CTMService.svc/GetCTMDataAWBWise?SNo=" + SNo, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var resData = jQuery.parseJSON(result);
            var finalData = resData.Table0;
            if (finalData.length > 0) {
                $('#spnCTMNo').text(finalData[0].SNo);
                $('#spnAirport').text(finalData[0].TransferAirport);
                $('#spnCTMDate').text(finalData[0].CtmDate);
                $('#spnCTMTransferto').text(finalData[0].TransferTo);
                $('#ImgLogo').attr('src', '/BLOBUploadAndDownload/DownloadFromBlob/?filenameOrUrl=' + finalData[0].AirlineLogo);
                var count = 0;
                $(finalData).each(function (row, tr) {
                    count = parseInt(count) + 1
                    $('#trFirst').after('<tr>' +
                            '<td style="border:1px solid black;text-align:center">' + tr.AWBNo + '</td>' +
                            '<td style="border:1px solid black;text-align:center">' + tr.AWBOrigin +' - '+ tr.AWBDestination + '</td>' +
                            '<td style="border:1px solid black;text-align:center">' + tr.NumberOfPackgs + '</td>' +
                            '<td style="border:1px solid black;text-align:center">' + tr.WeightKgs + '</td>' +
                            '<td style="border:1px solid black;text-align:center">' + tr.Remarks + '</td>' +
                        '</tr>')
                    if (count < 24) {
                        $('#trLast').prev('tr').remove();
                    }

                })

            }
        }
    });

}

function GetCTMData(AirlineSNo, PrintDate) {
    $.ajax({
        url: "Services/Import/CTMService.svc/GetCTMData?AirlineSNo=" + AirlineSNo + "&PrintDate=" + PrintDate, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var resData = jQuery.parseJSON(result);
            var finalData = resData.Table0;
            //var AirlineLogoData = resData.Table1;
            //if (AirlineLogo.length > 0) {
            //    $('#ImgLogo').attr('src', '/BLOBUploadAndDownload/DownloadFromBlob/?filenameOrUrl=' + AirlineLogoData[0].AirlineLogo);
            //    $('#ImgLogo').attr('onError', 'this.onerror=null;this.src="../Logo/aaa.jpg";');
            //}
            if (finalData.length > 0) {
                $('#spnCTMNo').text(finalData[0].SNo);
                $('#spnCTMDate').text(finalData[0].CtmDate);
                var count = 0;
                $(finalData).each(function (row, tr) {
                    count = parseInt(count) + 1
                    $('#trFirst').after('<tr>' +
                            '<td style="border:1px solid black;text-align:center">' + tr.AWBOrigin + '</td>' +
                            '<td style="border:1px solid black;text-align:center">' + tr.AWBNo + '</td>' +
                            '<td style="border:1px solid black;text-align:center">' + tr.AWBDestination + '</td>' +
                            '<td style="border:1px solid black;text-align:center">' + tr.NumberOfPackgs + '</td>' +
                            '<td style="border:1px solid black;text-align:center">' + tr.WeightKgs + '</td>' +
                            '<td style="border:1px solid black;text-align:center">' + tr.Remarks + '</td>' +
                        '</tr>')
                    if (count < 24) {
                        $('#trLast').prev('tr').remove();
                    }

                })
              

            }
        }
    });

}
function PrintCTMAwbWise(divID) {

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
function PrintCTM(divID) {
    if ($('#Airline').val() != '') {
        var divContents = $("#" + divID).html();
        // $(divContents).find('input:button[id=' + printButtonID + ']').remove();
        var printWindow = window.open('', '', '');
        // printWindow.document.write('<html><head><title>SLI Information</title>');
        // printWindow.document.write('</head><body >');
        printWindow.document.write(divContents);
        //printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    } else {
        ShowMessage('warning', 'Warning - Print CTM', "Please select airline");
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

    //$("table[id='" + cntrlId + "'][cfi-aria-search='search']").find("input[type='text'][" + attrType + "='" + autoCompleteType + "']").each(function () {
    //    var controlId = $(this).attr("id");
    //    cfi.AutoCompleteByDataSource(controlId.replace("Text_", ""), _DefaultAutoComplete_);
    //});

  
    cfi.AutoCompleteV2("FlightNo", "FlightNo", "CTM_FlightNo", null, "contains");
    cfi.AutoCompleteV2("City", "AirportCode,AirportName", "CTM_City", null, "contains");

}

function InstantiateControl(containerId) {
}

function CleanUI() {
    $("#divCTMDetails").hide();
    $("#divDetail2").hide();
}

function BindEvents(obj, e) {
    var subprocess = $(obj).attr("process").toUpperCase();
    currentprocess = subprocess;
    _CURR_PRO_ = $(obj).attr("currentprocess");
    if (currentprocess == "D" && _CURR_PRO_ == "CTM") {
        var AWBSNO = $(obj).closest("tr").find("td:eq(0)").text();
        var CTMSno = $(obj).closest("tr").find("td:eq(12)").text();
        DeleteCTM(CTMSno, AWBSNO, obj);
    }
}


var DataSource = [{ Key: "0", Text: " " },
    { Key: "1", Text: "AIRLINE" },
    //{ Key: "2", Text: "CTO" },
    //{ Key: "3", Text: "AGENT" },
    { Key: "4", Text: "BONDED WAREHOUSE" }
    //{ Key: "5", Text: "FREE ZONE" }
];


var DataList = [{ Key: "0", Text: "Driver Pickup" }, { Key: "1", Text: "Delivered By SAS" }];

function CTMNew() {
    //  $("#divCTMInformation").html("");
    // $('#divCTMDetails').hide();

    $("#tblMultiCTMDetail").html('');
    lstItem = [];


    var CitySNo = $("#City").val() == "" ? "0" : $("#City").val();
    var FlightNo = $("#FlightNo").val() == "" ? "" : $("#FlightNo").val();
    var FlightDate = $("#FlightDate").attr("sqldatevalue") != "" ? $("#FlightDate").attr("sqldatevalue") : "";
    var IsBondedWareHouse = 0;

    //var strVar = "";
    //strVar += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody>";
    //strVar += "<tr id=\"tr_0\">";
    //strVar += "<td>";
    //strVar += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody>"


    //strVar += "<tr><td class=\"ui-widget-content\"><b>AWB TYPE</b><\/td><td class=\"ui-widget-content\"> <input type='radio' tabindex='1' data-radioval='EXPORT' class='' name='AWBTYPE_0' checked='True' id='AWBTYPE_0' value='0'>EXPORT<input type='radio' tabindex='1' data-radioval='IMPORT' class='' name='AWBTYPE_0' id='AWBTYPE_0' value='1'>IMPORT <input type='radio' tabindex='4' data-radioval='TRANSIT' class='' name='AWBTYPE_0' id='AWBTYPE_0' value='2' data-valid='required' data-valid-msg='AWB TYPE can not be blank'>TRANSIT<\/td>";
    //strVar += "<td class=\"ui-widget-content\"><b>AWB No</b><\/td><td class=\"ui-widget-content\"><input type=\"hidden\" name=\"AWBNo_0\" id=\"AWBNo_0\" value=\"\" /><input type=\"text\" class=\"\" name=\"Text_AWBNo_0\"  id=\"Text_AWBNo_0\" controltype=\"autocomplete\" maxlength=\"\" data-width=\"50px\" value=\"\" placeholder=\"\" /><\/td>";

    //strVar += "<td class=\"ui-widget-content\"><b>Pcs</b><\/td><td id=\"spnPcs_0\"  class=\"ui-widget-content\"><input type=\"text\" class=\"k-input\" name=\"Pcs_0\" id=\"Pcs_0\" onkeypress='' style=\"width: 150px; font-family: Verdana; font-size: 12px; position: relative; vertical-align: top; text-transform: uppercase; background-color: transparent;\" controltype=\"decimal2\" maxlength=\"15\" value=\"\" placeholder=\"\" data-role=\"numerictextbox\" autocomplete=\"off\"/><\/td><td class=\"ui-widget-content\"><b>Gr Wt</b><\/td><td id=\"spnGrWt_0\"  class=\"ui-widget-content\"><input type=\"text\" class=\"k-input\" name=\"Grwt_0\" id=\"Grwt_0\" onkeypress='' style=\"width: 150px; font-family: Verdana; font-size: 12px; position: relative; vertical-align: top; text-transform: uppercase; background-color: transparent;\" controltype=\"decimal2\" maxlength=\"15\" value=\"\" placeholder=\"\" data-role=\"numerictextbox\" autocomplete=\"off\"/><\/td><\/tr>";


    //strVar += "<tr><td class=\"ui-widget-content\"><b>Cbm</b><\/td><td id=\"spnCbm_0\"  class=\"ui-widget-content\"><\/td>";
    //strVar += "<td class=\"ui-widget-content\"><b>AWB Origin</b><\/td><td id=\"spnAWBOrigin_0\"  class=\"ui-widget-content\"><\/td><td class=\"ui-widget-content\"><b>AWB Destination</b><\/td><td id=\"spnAWBDestination_0\" class=\"ui-widget-content\"><\/td><td class=\"ui-widget-content\"><\/td><td   class=\"ui-widget-content\"><\/td><\/tr>";

    //strVar += "<tr><td class=\"ui-widget-content\"><b>Flight No</b><\/td><td id=\"spnFlightNO_0\" class=\"ui-widget-content\"><\/td><td class=\"ui-widget-content\"><b>Flight Date</b><\/td><td id=\"spnFlightDate_0\" class=\"ui-widget-content\"><\/td><td class=\"ui-widget-content\"><b>Flight Origin</b><\/td><td id=\"spnFlightOrigin_0\" class=\"ui-widget-content\"><\/td><td class=\"ui-widget-content\"><b>Flight Destination</b><\/td><td id=\"spnFlightDestination_0\" class=\"ui-widget-content\"><\/td><\/tr>";

    //strVar += "<tr><td class=\"ui-widget-content\"><b>Freight Type</b><\/td><td id=\"spnFreightType_0\" class=\"ui-widget-content\"><\/td><td class=\"ui-widget-content\"><b>Transfer City</b><\/td><td id=\"spnTransferCity_0\" class=\"ui-widget-content\"><\/td>";
    //strVar += "<td class=\"ui-widget-content\"><b>Date Of Transfer</b><\/td><td class=\"ui-widget-content\"><span class=\"k-picker-wrap k-state-default k-widget k-datepicker k-header\"><input type=\"text\" class=\"k-input k-state-default\" name=\"TransferDate_0\" id=\"TransferDate_0\" style=\"width: 60%; color: rgb(0, 0, 0);\" data-valid=\"required\" data-valid-msg=\"Select From Date\" controltype=\"datetype\" maxlength=\"\" value=\"\" placeholder=\"\" data-role=\"datepicker\" sqldatevalue=\"\" formattedvalue=\"\"><span unselectable=\"on\" class=\"k-select\"><span unselectable=\"on\" class=\"k-icon k-i-calendar\">select</span></span></span><\/td>";
    //strVar += "<td class=\"ui-widget-content\"><font color=\"red\">*</font><b>Transfer To</b><\/td><td class=\"ui-widget-content\"><input type=\"hidden\" name=\"TransferTo_0\" id=\"TransferTo_0\" value=\"\" /><input type=\"text\" class=\"\" data-valid=\"required\" data-valid-msg=\"Enter Transfer To\" name=\"Text_TransferTo_0\"  id=\"Text_TransferTo_0\" controltype=\"autocomplete\" maxlength=\"\" data-width=\"50px\" value=\"\" placeholder=\"\" /><\/td><\/tr>";

    //strVar += "<tr><td class=\"ui-widget-content\"><font color=\"red\">*</font><b>Airline/CTO/Forwarder(Agent)</b><\/td><td class=\"ui-widget-content\"><input type=\"hidden\" name=\"TransferType_0\" id=\"TransferType_0\" value=\"\" /><input type=\"text\" class=\"\" name=\"Text_TransferType_0\"  id=\"Text_TransferType_0\" controltype=\"autocomplete\" data-valid=\"required\" data-valid-msg=\"Enter Airline/CTO/Forwarder(Agent)\" maxlength=\"\" data-width=\"50px\" value=\"\" placeholder=\"\" /><\/td>";
    //strVar += "<td class=\"ui-widget-content\"><b>Delivered To</b><\/td><td class=\"ui-widget-content\"><input type=\"hidden\" name=\"DeliverdTo_0\" id=\"DeliverdTo_0\" value=\"\" /><input type=\"text\" class=\"\" name=\"Text_DeliverdTo_0\"  id=\"Text_DeliverdTo_0\" controltype=\"autocomplete\" maxlength=\"\" data-width=\"50px\" value=\"\" placeholder=\"\" /><\/td>";
    //strVar += "<td class=\"ui-widget-content\"><b>Nature of Goods</b><\/td><td class=\"ui-widget-content\"><input type=\"text\" class=\"k-input\" name=\"NatureofGoods_0\" id=\"NatureofGoods_0\" onkeypress='ManageText(this)' style=\"width: 150px; font-family: Verdana; font-size: 12px; position: relative; vertical-align: top; text-transform: uppercase; background-color: transparent;\" controltype=\"alphanumericupper\" maxlength=\"15\" value=\"\" placeholder=\"\" data-role=\"alphabettextbox\" autocomplete=\"off\"/><\/td>";
    //strVar += "<td class=\"ui-widget-content\"><b>Remarks</b><\/td><td class=\"ui-widget-content\"><input type=\"text\" class=\"k-input\" name=\"Remarks_0\" id=\"Remarks_0\"  onkeypress='ManageText(this)'style=\"width: 150px; font-family: Verdana; font-size: 12px; position: relative; vertical-align: top; text-transform: uppercase; background-color: transparent;\" controltype=\"alphanumericupper\" maxlength=\"250\" value=\"\" placeholder=\"\" data-role=\"alphabettextbox\" autocomplete=\"off\"/><\/td><\/tr>";
    //strVar += "<\/tbody><\/table><\/td>";
    //strVar += "<td class=\"ui-widget-content\"><img id=\"btnremove_0\" src=\"Images/delete.png\" onclick='CTMDelRow(this);' style=\"display:block;\"><img id=\"btnAdd_0\" src=\"Images/AddIcon.png\" onclick='AddRow(this);'><\/td><\/tr>";
    //strVar += "<\/tbody><\/table>";
    //strVar += "<\/br>";

    var strVar = "";
    strVar += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody>";
    strVar += "<tr id=\"tr_0\">";
    strVar += "<td>";
    strVar += "<table class=\"WebFormTable\" validateonsubmit=\"true\" id=\"__tblslicustomer__\"><tbody><tr><td class=\"formSection\" colspan=\"6\">CTM Information</td></tr>"
    strVar += "<tr><td class=\"formthreelabel\" title=\"AWB TYPE\"><span id=\"spnAWBTYPE\"> AWB TYPE</span></td><td class=\"formthreeInputcolumn\">";
    strVar +="<input type=\"hidden\" name=\"HdnAWBNo_0\" id=\"HdnAWBNo_0\" value=\"\" /><input type='radio' tabindex='1' data-radioval='EXPORT/IMPORT(To Other)' class='' name='AWBTYPE_0' id='AWBTYPE_0' value='1' checked='True'>To Other<input type='radio' tabindex='4' data-radioval='TRANSIT(From Other)' class='' name='AWBTYPE_0' id='AWBTYPE_0' value='2' data-valid='required' data-valid-msg='AWB TYPE can not be blank'>From Other<\/td>";

    //strVar += "<td class=\"formthreelabel\" title=\"Enter AWB No\"><font color=\"red\">*</font><span id=\"spnAWBNo\"> AWB No</span></td><td class=\"formthreeInputcolumn\"><input type=\"hidden\" name=\"AWBNo_0\" id=\"AWBNo_0\" value=\"\" /><input type=\"text\" class=\"\" name=\"Text_AWBNo_0\"  id=\"Text_AWBNo_0\" controltype=\"autocomplete\" maxlength=\"\" data-width=\"50px\" value=\"\" placeholder=\"\" /> <\/td>";

    strVar += "<td class=\"formthreelabel\" title=\"Enter AWB No\"><font color=\"red\">*</font><span id=\"spnAWBNo\"> AWB No</span></td><td class=\"formthreeInputcolumn\"><input type=\"hidden\" name=\"AWBNo_0\" id=\"AWBNo_0\" value=\"\" /><input type=\"text\" class=\"\" name=\"Text_AWBNo_0\"  id=\"Text_AWBNo_0\"  onblur=\"BindAWB(this)\" maxlength=\"\" data-width=\"50px\" value=\"\" /> <\/td>";

    strVar += "<td class=\"formthreelabel\" title=\"Pcs\"><span id=\"spnPcs\">Pcs</span></td><td class=\"formthreeInputcolumn\"><input type=\"hidden\" name=\"hdnPieces\" id=\"hdnPieces\" value=\"\" /><input type=\"text\" class=\"k-input\" name=\"Pcs_0\" id=\"Pcs_0\" onkeypress=\"ISNumeric(this)\" disabled=\"disabled\" onblur=\"CalculateGrossWt(this)\"  style=\"width: 150px; font-family: Verdana; font-size: 12px; position: relative; vertical-align: top; text-transform: uppercase; background-color: transparent;\" controltype=\"number\" maxlength=\"15\" value=\"\" placeholder=\"\" data-role=\"numerictextbox\" autocomplete=\"off\"/></td></tr>";
    strVar += "<tr><td class=\"formthreelabel\" title=\"Gr Wt.\"><span id=\"spnGrWt\"> Gr Wt.</span></td><td class=\"formthreeInputcolumn\"><input type=\"hidden\" name=\"hdnGrWt\" id=\"hdnGrWt\" value=\"\" /><input type=\"text\" class=\"k-input\" name=\"Grwt_0\" id=\"Grwt_0\" disabled=\"disabled\" onkeypress=\"ISNumeric(this)\" style=\"width: 150px; font-family: Verdana; font-size: 12px; position: relative; vertical-align: top; text-transform: uppercase; background-color: transparent;\" controltype=\"decimal2\" maxlength=\"15\" value=\"\" placeholder=\"\" data-role=\"numerictextbox\" autocomplete=\"off\"/></td>";
    strVar += "<td class=\"formthreelabel\" title=\"Enter CBM\"><span id=\"spnCbm\"> CBM </span></td><td class=\"formthreeInputcolumn\" id=\"spnCbm_0\"></td><td class=\"formthreelabel\" title=\"AWB Origin\"><span id=\"spnAWBOrigin\"> AWB Origin</span></td><td class=\"formthreeInputcolumn\" id=\"spnAWBOrigin_0\"></td></tr>";
    strVar += "<tr><td class=\"formthreelabel\" title=\"AWBDestination\"><span id=\"spnAWBDestination\"> AWB Destination</span></td><td class=\"formthreeInputcolumn\" id=\"spnAWBDestination_0\"></td><td class=\"formthreelabel\" title=\"Flight No\"><span id=\"spnCbm\"> Flight No </span></td>";
    strVar += "<td class=\"formthreeInputcolumn\" id=\"spnFlightNO_0\" ></td><td class=\"formthreelabel\" title=\"Flight Date\"><span id=\"spnFlightDate\">Flight Date</span></td><td class=\"formthreeInputcolumn\" id=\"spnFlightDate_0\"></td></tr>";
    strVar += "<tr><td class=\"formthreelabel\" title=\"Flight Origin\"><span id=\"spnFlightOrigin\">Flight Origin</span></td><td class=\"formthreeInputcolumn\" id=\"spnFlightOrigin_0\"></td><td class=\"formthreelabel\" title=\"Flight Destination\"><span id=\"spnFlightDestination\">Flight Destination </span></td>";
    strVar += "<td class=\"formthreeInputcolumn\" id=\"spnFlightDestination_0\" ></td><td class=\"formthreelabel\" title=\"Freight Type\"><span id=\"spnFreightType\">Freight Type</span></td><td class=\"formthreeInputcolumn\" id=\"spnFreightType_0\" ></td></tr>";
    strVar += "<tr><td class=\"formthreelabel\" title=\"Transfer City\"><span id=\"spnTransferCity\">Transfer City</span></td><td class=\"formthreeInputcolumn\" id=\"spnTransferCity_0\"></td><td class=\"formthreelabel\" title=\"Date Of Transfer\"><span id=\"spnDateOfTransfer\">Date Of Transfer </span></td>";
    strVar += "<td class=\"formthreeInputcolumn\"  ><span class=\"k-picker-wrap k-state-default k-widget k-datepicker k-header\" style=\"width: 50px; \"><input type=\"text\" class=\"k-input k-state-default\" name=\"TransferDate_0\" id=\"TransferDate_0\" style=\"width: 50px; color: rgb(0, 0, 0);\" data-valid=\"required\" data-valid-msg=\"Select From Date\" controltype=\"datetype\" maxlength=\"\" value=\"\" placeholder=\"\" data-role=\"datepicker\" sqldatevalue=\"\" formattedvalue=\"\"><span unselectable=\"on\" class=\"k-select\"><span unselectable=\"on\" class=\"k-icon k-i-calendar\">select</span></span></span></td><td class=\"formthreelabel\" title=\"Transfer Type\"><font color=\"red\">*</font><span id=\"spnTransferTo\"> Transfer Type</span></td><td class=\"formthreeInputcolumn\" ><input type=\"hidden\" name=\"TransferTo_0\" id=\"TransferTo_0\" value=\"\" /><input type=\"text\" class=\"\" data-valid=\"required\" data-valid-msg=\"Enter Transfer Type\" name=\"Text_TransferTo_0\"  id=\"Text_TransferTo_0\" controltype=\"autocomplete\" maxlength=\"\" data-width=\"50px\" value=\"\" placeholder=\"\" /></td></tr>";
    strVar += "<tr><td class=\"formthreelabel\" title=\"Transfer To\"><font id=\"fntTransferTo1\" color=\"red\">*</font><span id=\"spnAirline\"> Transfer To</span></td><td class=\"formthreeInputcolumn\" ><input type=\"hidden\" name=\"TransferType_0\" id=\"TransferType_0\" value=\"\" /><input type=\"text\" class=\"\" name=\"Text_TransferType_0\"  id=\"Text_TransferType_0\" controltype=\"autocomplete\" data-valid=\"required\" data-valid-msg=\"Enter Transfer To\" maxlength=\"\" data-width=\"50px\" value=\"\" placeholder=\"\" /></td>";
    strVar += "<td class=\"formthreelabel\" title=\"Delivered To\"><span id=\"spnDeliveredTo\">Delivered To</span></td><td class=\"formthreeInputcolumn\"  ><input type=\"text\" class=\"k-input\" name=\"DeliverdTo_0\" id=\"DeliverdTo_0\"  style=\"width: 150px; font-family: Verdana; font-size: 12px; position: relative; vertical-align: top; text-transform: uppercase; background-color: transparent;\" controltype=\"alphanumericupper\" maxlength=\"30\" value=\"\" placeholder=\"\" data-role=\"alphabettextbox\" autocomplete=\"off\"/></td><td class=\"formthreelabel\" title=\"Nature of Goods\"><span id=\"spnTransferTo\">Nature of Goods</span></td><td class=\"formthreeInputcolumn\" ><input type=\"text\" class=\"k-input\" name=\"NatureofGoods_0\" id=\"NatureofGoods_0\" onkeypress='ManageText(this)' style=\"width: 150px; font-family: Verdana; font-size: 12px; position: relative; vertical-align: top; text-transform: uppercase; background-color: transparent;\" controltype=\"alphanumericupper\" maxlength=\"15\" value=\"\" placeholder=\"\" data-role=\"alphabettextbox\" autocomplete=\"off\"/></td></tr>";

    strVar += "<tr><td class=\"formthreelabel\" title=\"Remarks\"><span id=\"spnRemarks\">Remarks</span></td><td class=\"formthreeInputcolumn\" ><input type=\"text\" class=\"k-input\" name=\"Remarks_0\" id=\"Remarks_0\"  onkeypress='ManageText(this)'style=\"width: 150px; font-family: Verdana; font-size: 12px; position: relative; vertical-align: top; text-transform: uppercase; background-color: transparent;\" controltype=\"alphanumericupper\" maxlength=\"250\" value=\"\" placeholder=\"\" data-role=\"alphabettextbox\" autocomplete=\"off\"/></td>";
    strVar += "<td class=\"formthreelabel\" title=\"Bill To\"><font id=\"ftbillto\" color=\"red\">*</font><span id=\"spnBillTo\"> Bill To</span></td><td class=\"formthreeInputcolumn\" ><input type=\"hidden\" name=\"BillTo_0\" id=\"BillTo_0\" value=\"\" /><input type=\"hidden\" name=\"hdnDFSno\" id=\"hdnDFSno\" value=\"\" /><input type=\"hidden\" name=\"hdnExecutedOn\" id=\"hdnExecutedOn\" value=\"\" /><input type=\"hidden\" name=\"hdnAirlineSno\" id=\"hdnAirlineSno\" value=\"\" /><input type=\"text\" class=\"\" data-valid=\"required\" data-valid-msg=\"Enter Bill To\" name=\"Text_BillTo_0\"  id=\"Text_BillTo_0\" controltype=\"autocomplete\" maxlength=\"\" data-width=\"50px\" value=\"\" placeholder=\"\" /></td><td class=\"formthreelabel\" title=\"\"><span id=\"\"></span></td><td class=\"formthreeInputcolumn\" ><button type=\"submit\" class=\"btn btn-block btn-success btn-sm\" id=\"btnAddWaybill\" style=\"display: block;\"  onclick='BindCTMDetails(this);'>Add</button></td>";
    strVar += "</tr></tbody></table><\/td>";
    //    strVar += "<\/td><td class=\"ui-widget-content\"><img id=\"btnremove_0\" src=\"Images/delete.png\" onclick='CTMDelRow(this);' style=\"display:block;\"><img id=\"btnAdd_0\" src=\"Images/AddIcon.png\" onclick='AddRow(this);'><\/td><\/tr>";

    strVar += "<\/tbody><\/table><div id='tblIssueDetail'></div>";
    strVar += "<\/br>";
    $('#divDetail').html('');
    $('#divDetail').html(strVar);
    $('#btnSave').css('display', 'block')
    $('#btnCancel').css('display', 'block')

   
  //  cfi.AutoCompleteV2("AWBNo_0", "AWBNo", "CTM_AWBNo", GetAWBDetail, "contains");

    $('#divDetail').find("tr").each(function () {

        //$(this).find("input[id^='AWBNo']").each(function () {
        //        cfi.AutoComplete($(this).attr("name"), "AWBNo", "vCTMAWBdistinct", "AWBSNo", "AWBNo", ["AWBNo"], GetAWBDetail, "contains");
        //    var a = $("#Text_AWBNo_0").data("kendoAutoComplete")
        //    a.options.minLength = 4;
        //});

        $(this).find("input[id^='TransferTo']").each(function () {
            // cfi.AutoCompleteByDataSource($(this).attr("name"), DataSource, null, null);

            cfi.AutoCompleteV2($(this).attr("name"), "Text", "CTM_TransferType", showCharges, "contains");
        });

        $(this).find("input[id^='BillTo']").each(function () {
            //cfi.AutoCompleteV2($(this).attr("name"), "Name", "vBillTo", "SNo", "Name", ["Name"], CheckCreditBillToSNo, "contains");
            cfi.AutoCompleteV2($(this).attr("name"), "Name", "CTM_BillTo", CheckCreditBillToSNo, "contains");
        });


        $(this).find("input[id^='TransferType']").each(function () {
            //cfi.AutoCompleteV2($(this).attr("name"), "Name", "vCTMAirline", "SNo", "Name", ["Name"], null, "contains");
            cfi.AutoCompleteV2($(this).attr("name"), "Name", "CTM_Airline", null, "contains");
        });

        $(this).find("input[id^='DeliverdTo']").each(function () {
            cfi.AutoCompleteV2($(this).attr("name"), "Name,IdCardNo", "CTM_DeliveredTo", null, "contains");
        });

        $(this).find("input[id^='TransferDate']").each(function () {
            $("#" + $(this).attr("name")).kendoDatePicker();
        });
    });

    // BindCharges();

    $('.k-datepicker').css('width', '70%');
    PagerightsCheckCTM()
}

function BindAWB(obj)
{
    GetAWBDetail($('#Text_AWBNo_0').val());
}
function AWbAlldetail() {

    if ($('#Text_AWBNo_0').val() != "")
        cfi.PopUp("divDetailAWB", "AWB Details", 800, null, PopUpOnClose);
}

function CheckCreditLimit(obj) {

    var total = 0;

    var value = $("[id^=" + obj.id + "]").prop('checked') == true ? "CASH" : "CREDIT";
    $("div[id$='areaTrans_import_ctmcharge']").find("[id^='areaTrans_import_ctmcharge']").each(function (i, row) {
        if ($(this).find("[id^=" + obj.id + "]").prop('checked') != true)
            total = parseFloat(total) + parseFloat($(this).find("span[id^='Amount']").text());
    });
    //var total = $("#" + obj.id).closest('td').prev().prev().text();
    var BillToSNo = $("#BillTo_0").val();
    if (value == "CREDIT") {
        $.ajax({
            url: "Services/Import/CTMService.svc/CheckCreditLimit",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ BillToSNo: BillToSNo, total: total }),
            async: false,
            type: 'post',
            cache: false,
            success: function (result) {
                var dataTableobj = JSON.parse(result);
                FinalData = dataTableobj.Table0;
                if (FinalData[0].Column1 != 0 && FinalData[0].Column1 != '') {


                    $("div[id$='areaTrans_import_ctmcharge']").find("[id^='areaTrans_import_ctmcharge']").each(function (i, row) {
                        $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("checked", 'checked')
                        $(this).find("input:radio[id^='PaymentMode']").eq(0).removeAttr("disabled");
                        $(this).find("input:radio[id^='PaymentMode']").eq(1).attr("disabled", "disabled");
                        flags = 1;
                    });
                    if (FinalData[0].Column2 != '') {
                        ShowMessage('warning', '', FinalData[0].Column2);
                        $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("checked", 'checked');
                        $(this).find("input:radio[id^='PaymentMode']").eq(1).attr("disabled", "disabled");

                    }
                }
                else {
                    $("div[id$='areaTrans_import_ctmcharge']").find("[id^='areaTrans_import_ctmcharge']").each(function (i, row) {
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
function CheckCreditBillToSNo(a, b, c, d) {
    var total = 0;
    var BillToSNo = $('#BillTo_0').val();
    if ($("#BillTo_0").val() != 'Airline') {
        $.ajax({
            url: "Services/Import/CTMService.svc/CheckCreditLimit",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ BillToSNo: BillToSNo, total: total }),
            async: false,
            type: 'post',
            cache: false,
            success: function (result) {
                var dataTableobj = JSON.parse(result);
                FinalData = dataTableobj.Table0;
                if (FinalData[0].Column1 != 0 && FinalData[0].Column1 != '') {
                    $("div[id$='areaTrans_import_ctmcharge']").find("[id^='areaTrans_import_ctmcharge']").each(function (i, row) {
                        $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("checked", 'checked')
                        $(this).find("input:radio[id^='PaymentMode']").eq(0).removeAttr("disabled");
                        $(this).find("input:radio[id^='PaymentMode']").eq(1).attr("disabled", "disabled");
                        flags = 1;
                    });
                    ShowMessage('warning', '', FinalData[0].Column2);
                }
                else {
                    $("div[id$='areaTrans_import_ctmcharge']").find("[id^='areaTrans_import_ctmcharge']").each(function (i, row) {
                        $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("checked", 'checked');
                        $(this).find("input:radio[id^='PaymentMode']").eq(1).removeAttr("disabled");
                        flags = 0;
                    });
                }

            }
        });
    }
    else {
        $("div[id$='areaTrans_import_ctmcharge']").find("[id^='areaTrans_import_ctmcharge']").each(function (i, row) {
            $(this).find("input:radio[id^='PaymentMode']").eq(1).attr("checked", 'checked');
            $(this).find("input:radio[id^='PaymentMode']").eq(0).attr("disabled", "disabled");
            $(this).find("input:radio[id^='PaymentMode']").eq(1).removeAttr("disabled");
            flags = 0;
        });
    }
    //   CheckWalkIn();
}
function CalculateGrossWt(obj) {
    if ($('#Pcs_0').val() != '') {
        var totalPieces = $("#hdnPieces").val() == '' ? 0 : $("#hdnPieces").val();
        var Pieces = $('#Pcs_0').val() == '' ? 0 : $('#Pcs_0').val();
        var TotalGrWt = $('#hdnGrWt').val() == '' ? 0 : $('#hdnGrWt').val();
        var Grwt = ((parseFloat(TotalGrWt) / parseFloat(totalPieces)) * parseFloat(Pieces));
        $('#Grwt_0').val(Grwt);
    }
}
function ISNumeric(obj) {
    if ((event.which != 46 || $(obj).val().indexOf('.') != -1) &&
      ((event.which < 48 || event.which > 57) &&
        (event.which != 0 && event.which != 8))) {
        event.preventDefault();
    }

    var text = $(obj).val();
    if ((text.indexOf('.') != -1) && (text.substring(text.indexOf('.')).length > 3)) {
        event.preventDefault();
    }
}

function showCharges() {
    //if (lstItem.length <= 0) {
    //    cfi.ResetAutoComplete("Text_TransferType_0");
    //}
    //s cfi.ResetAutoComplete("Text_BillTo_0");

    if ($('#AWBNo_0').val() != '') {
        if ($("input[id=AWBTYPE_0]:checked").val() == "1" && $('#TransferTo_0').val() == "4") {
            $('#ftbillto').show();
            $('#fntTransferTo').show();
            BindCharges();
            $("#Text_BillTo_0").data("kendoAutoComplete").enable(true);
            cfi.ResetAutoComplete("Text_TransferType_0");
            $("#Text_TransferType_0").data("kendoAutoComplete").enable(false);


        } else if ($("input[id=AWBTYPE_0]:checked").val() == "1" && $('#TransferTo_0').val() == "5") {
            $('#fntTransferTo').hide();
            cfi.ResetAutoComplete("Text_TransferType_0");
            $("#Text_TransferType_0").data("kendoAutoComplete").enable(true);
            cfi.AutoCompleteByDataSource("TransferType_0", DataList, BindFreeZoneCharge);

            //cfi.ChangeAutoCompleteDataSource("IssuedTo", data, true, null, "Name", "contains");


        }
        else {
            $("#tblIssueDetail").html('');
            $('#ftbillto').hide();
            $('#fntTransferTo').hide();
            $("#Text_BillTo_0").data("kendoAutoComplete").enable(false);
            $("#Text_TransferType_0").data("kendoAutoComplete").enable(true);
        }

        //if ($("input[id=AWBTYPE_0]:checked").val() == "1") {

        //    if ($('#TransferTo_0').val() == "5") {
        //        $('#fntTransferTo').hide();
        //        $("#Text_TransferType_0").data("kendoAutoComplete").enable(true);
        //        $("#tblIssueDetail").html('');
        //    } else {
        //        $('#fntTransferTo').show();
        //        $("#Text_TransferType_0").data("kendoAutoComplete").enable(true);
        //    }

        //}
        //else {
        //    $('#fntTransferTo').show();

        //    if (lstItem.length <= 0)
        //        $("#Text_TransferType_0").data("kendoAutoComplete").enable(true);
        //}
    }
}

function BindFreeZoneCharge() {
    if ($('#TransferType_0').val() == '1') {
        $('#ftbillto').show();
        $('#fntTransferTo').show();
        BindCharges();
        $("#Text_BillTo_0").data("kendoAutoComplete").enable(true);

    } else {
        $("#tblIssueDetail").html('');
        $('#ftbillto').hide();
        $('#fntTransferTo').hide();

        cfi.ResetAutoComplete("Text_BillTo_0");
        $("#Text_BillTo_0").data("kendoAutoComplete").enable(false);

    }
}

function AutoCompleteForDOHandlingCharge(textId, basedOn, tableName, keyColumn, textColumn, templateColumn, addOnFunction, filterCriteria, separator, newAllowed, confirmOnAdd, procName, newUrl, awbSNo, chargeTo, cityCode, movementType, hawbSNo, loginSNo, chWt, cityChangeFlag) {
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

var dourl = 'Services/AutoCompleteService.svc/WMSFBLAutoCompleteDataSource';
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

function BindCharges() {
    _CURR_PRO_ = "CTM";
    $.ajax({
        url: "Services/Import/CTMService.svc/GetWebForm/" + _CURR_PRO_ + "/Import/CTMCharge/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#tblIssueDetail").html(result);

            $.ajax({
                url: "Services/Import/DeliveryOrderService.svc/GetDeliveryOrderPaymentType?AWBSNo=" + parseInt($('#HdnAWBNo_0').val() == '' ? 0 : $('#HdnAWBNo_0').val()) + "&ArrivedShipmentSNo=" + parseInt(0) + "&DestinationCity='del'&PDSNo=" + parseInt(0) + "&ProcessSNo=" + parseInt(1007) + "&SubProcessSNo=" + parseInt(2316), async: false, type: "get", dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var resData = jQuery.parseJSON(result);
                    //DLVSNo = msg;
                    var hcData = resData.Table1;


                    /****************Handling Charge Information*************************************/
                    MendatoryHandlingCharges = [];
                    if (hcData != []) {
                        $(hcData).each(function (row, i) {
                            // if (i.isMandatory == 1) {
                            MendatoryHandlingCharges.push({ "type": "M", "chargename": i.TariffSNo, "text_chargename": i.TariffCode, "pbasis": i.PrimaryBasis, "pvalue": i.pValue, "sbasis": i.SecondryBasis, "svalue": i.sValue, "amount": i.ChargeAmount, "totaltaxamount": i.TotalTaxAmount, "totalamount": i.TotalAmount, "remarks": i.ChargeRemarks.toUpperCase().replace(/<BR>/g, ""), "list": 1 });
                            //  totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat(i.TotalAmount)
                            // }
                        });
                    }

                    cfi.makeTrans("import_ctmcharge", null, null, BindChargeAutoComplete, ReBindChargeAutoComplete, null, MendatoryHandlingCharges);
                    if (MendatoryHandlingCharges.length > 0) {
                        $("div[id$='areaTrans_import_ctmcharge']").find("[id^='areaTrans_import_ctmcharge']").each(function (i, row) {
                            $(this).find("span[id^='PBasis']").closest("td").find("input[id^='_tempPValue']").val(MendatoryHandlingCharges[i].pvalue);
                            $(this).find("span[id^='PBasis']").closest("td").find("input[id^='PValue']").val(MendatoryHandlingCharges[i].pvalue);
                            $(this).find("span[id^='PBasis']").text(MendatoryHandlingCharges[i].pbasis);
                            $(this).find("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").val(MendatoryHandlingCharges[i].svalue);
                            $(this).find("span[id^='SBasis']").closest("td").find("input[id^='SValue']").val(MendatoryHandlingCharges[i].svalue);
                            $(this).find("span[id^='SBasis']").text(MendatoryHandlingCharges[i].sbasis);
                        });
                    }

                    $("div[id$='divareaTrans_import_ctmcharge']").find("[id='areaTrans_import_ctmcharge']").each(function () {
                        $(this).find("input[id^='ChargeName']").each(function () {
                            AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIE", "", parseInt($('#AWBNo_0').val() == "" ? 0 : $('#AWBNo_0').val()), parseInt($('#BillTo_0').val() == "" ? 0 : $('#BillTo_0').val()), userContext.CityCode, 1, "", "2", "999999999", "No");
                        });
                    });


                    $("div[id$='areaTrans_import_ctmcharge']").find("[id^='areaTrans_import_ctmcharge']").each(function (i, row) {
                        if (MendatoryHandlingCharges.length > 0) {
                            $(this).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").enable(false);
                            $(this).find("input[id^='Text_ChargeName']").closest('td').hover(function () {
                                $(this).prop('title', $(this).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").value());
                            });

                            $(this).find("span[id^='PBasis']").closest("td").find("input").attr("disabled", "disabled");
                            $(this).find("span[id^='SBasis']").closest("td").find("input").attr("disabled", "disabled");
                            //if (MendatoryHandlingCharges.length - 1 == i) {
                            //    $(this).find("div[id^='transActionDiv']").show();
                            //    if (MendatoryHandlingCharges.length > 1)
                            //        $(this).find("div[id^='transActionDiv']").find('i:eq(0)').hide();
                            //}

                        }

                    });


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
var pValue = 0;
var sValue = 0;
function GatValueOfAutocomplete(valueId, value, keyId, key) {
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
                url: "Services/Import/DeliveryOrderService.svc/GetChargeValue?TariffSNo=" + parseInt(key) + "&AWBSNo=" + parseInt(0) + "&ArrivedShipmentSNo=" + parseInt(0) + "&DestinationCity=" + userContext.CityCode + "&PValue=" + parseInt(0) + "&SValue=" + parseInt(0) + "&HAWBSNo=" + hawbSNo,
                async: false, type: "GET", dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var resData = jQuery.parseJSON(result);
                    var doCharges = resData.Table0;
                    if (doCharges.length > 0) {
                        var doItem = doCharges[0];
                        if (rowId == undefined) {
                            $("span[id^='PBasis']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                            $("span[id^='PBasis']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                            $("span[id^='PBasis']").text(doItem.PrimaryBasis);
                            //if (doItem.SecondaryBasis == undefined || doItem.SecondaryBasis == "") {
                            //    $("span[id^='SBasis']").closest("tr").find("td:eq(5)").find("input").css("display", "none");
                            //    $("span[id^='SBasis']").closest("tr").find("td:eq(5)").find("span").css("display", "none");
                            //}
                            //else {
                            $("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                            $("span[id^='SBasis']").closest("td").find("input[id^='SValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                            $("span[id^='SBasis']").text(doItem.SecondaryBasis);
                            //}
                            $("span[id^='Amount']").text(doItem.ChargeAmount);
                            $("span[id^='TotalTaxAmount']").text(doItem.TotalTaxAmount);
                            $("span[id^='TotalAmount']").text(doItem.TotalAmount);
                            $("span[id^='Remarks']").text(doItem.ChargeRemarks);
                        }
                        else {
                            $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='_tempPValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                            $("span[id^='PBasis_" + rowId + "']").closest("td").find("input[id^='PValue']").val(Number(pValue) > 0 ? pValue : doItem.pValue);
                            $("span[id^='PBasis_" + rowId + "']").text(doItem.PrimaryBasis);
                            //if (doItem.SecondaryBasis == undefined || doItem.SecondaryBasis == "") {
                            //    $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(5)").find("input").css("display", "none");
                            //    $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(5)").find("span").css("display", "none");
                            //}
                            //else {
                            //    $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(5)").find("input").css("display", "");
                            //    $("span[id^='SBasis_" + rowId + "']").closest("tr").find("td:eq(5)").find("span").css("display", "");
                            $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='_tempSValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                            $("span[id^='SBasis_" + rowId + "']").closest("td").find("input[id^='SValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                            $("span[id^='SBasis_" + rowId + "']").text(doItem.SecondaryBasis);
                            //}
                            $("span[id^='Amount_" + rowId + "']").text(doItem.ChargeAmount);
                            $("span[id^='TotalTaxAmount_" + rowId + "']").text(doItem.TotalTaxAmount);
                            $("span[id^='TotalAmount_" + rowId + "']").text(doItem.TotalAmount);
                            $("span[id^='Remarks_" + rowId + "']").text(doItem.ChargeRemarks);
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
function BindChargesItemAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='ChargeName']").each(function () {
        AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIE", "", parseInt($('#AWBNo_0').val() == "" ? 0 : $('#AWBNo_0').val()), parseInt($('#BillTo_0').val() == "" ? 0 : $('#BillTo_0').val()), userContext.CityCode, 1, "", "2", "999999999", "No");
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
    $(elem).find("input[id^='WaveOff']").hide();
}

function ReBindChargesItemAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='ChargeName']").each(function () {
        AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIE", "", parseInt($('#AWBNo_0').val() == "" ? 0 : $('#AWBNo_0').val()), parseInt($('#BillTo_0').val() == "" ? 0 : $('#BillTo_0').val()), userContext.CityCode, 1, "", "2", "999999999", "No");
    });
    if (flags == 1) {
        $(elem).find("input[id^='PaymentMode']").each(function () {
            $(elem).find("input[id^='PaymentMode']").eq(0).attr("checked", 'checked');
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
    $(elem).find("input[id^='WaveOff']").hide();
}


function CTMDelRow(indx) {
    var indexval = indx.id.split('_')[1]
    if (indexval > 0) {
        $('#tr_' + indexval).remove();
    }
}

var isClosedFrom = false;

function GetAWBDetail(AWBNO) {
    var isawbExist = 0;
    isClosedFrom = false;
  //  $("#HdnAWBNo_0").val($('#AWBNo_0').val());

    if ($('#Text_AWBNo_0').val() == '' )
    { return true; }

    if (lstItem.length <= 0) {
        cfi.ResetAutoComplete("Text_TransferTo_0");
        cfi.ResetAutoComplete("Text_TransferType_0");
        $("#Text_TransferTo_0").data("kendoAutoComplete").enable(true);
        $("#Text_TransferType_0").data("kendoAutoComplete").enable(true);
    }

    if ($("input[id=AWBTYPE_0]:checked").val() == "1" && $('#TransferTo_0').val() == "5") {
        $('#fntTransferTo').hide();
        cfi.ResetAutoComplete("Text_TransferType_0");
        $("#Text_TransferType_0").data("kendoAutoComplete").enable(true);
        cfi.AutoCompleteByDataSource("TransferType_0", DataList, BindFreeZoneCharge);


    }


    cfi.ResetAutoComplete("Text_BillTo_0");


    //var rowNo = valueId.split("_")[2];
    var rowNo =0;
    var awbType = $("input[id=AWBTYPE_" + rowNo + "]:checked").val()
    if (AWBNO != "" && AWBNO != undefined) {

        $("#Pcs_" + (rowNo)).val('');
        $("#Grwt_" + (rowNo)).val('');

        $("#spnCbm_" + (rowNo)).text('');
        $("#spnAWBOrigin_" + (rowNo)).text('');
        $("#spnAWBDestination_" + (rowNo)).text('');
        $("#spnFlightNO_" + (rowNo)).text('');
        $("#spnFlightDate_" + (rowNo)).text('');
        $("#spnFlightOrigin_" + (rowNo)).text('');
        $("#spnFlightDestination_" + (rowNo)).text('');
        $("#spnFreightType_" + (rowNo)).text('');
        $("#spnTransferCity_" + (rowNo)).text('');
        $("#NatureofGoods_" + (rowNo)).text('');
        $("#Remarks_" + (rowNo)).text('');
        $("#hdnPieces").val('');
        $("#hdnGrWt").val('');
        $("#hdnDFSno").val('');
        $("#hdnAirlineSno").val('');
        $("#hdnExecutedOn").val('');

        $.ajax({
            url: "Services/Import/CTMService.svc/GetAWBDetail?AWBNo=" + AWBNO + "&AWBType=" + awbType, async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var resData = jQuery.parseJSON(result);
                var awbData = resData.Table0;
                if (awbData.length > 0) {
                    // var awbItem = dlvData[0];
                    // $("#tblULDAllocationTrans_CurrentULDStock_" + (rowNo)).text(res[0].NoOfUld);

                    $("#spnCbm_" + (rowNo)).text(awbData[0].CBM);
                    $("#Pcs_" + (rowNo)).val(awbData[0].Pieces);

                    $("#Grwt_" + (rowNo)).val(awbData[0].GrWT);
                    $("#spnAWBOrigin_" + (rowNo)).text(awbData[0].Origin);
                    $("#spnAWBDestination_" + (rowNo)).text(awbData[0].Destination);
                    $("#spnFlightNO_" + (rowNo)).text(awbData[0].FlightNo);
                    $("#spnFlightDate_" + (rowNo)).text(awbData[0].FlightDate);
                    $("#spnFlightOrigin_" + (rowNo)).text(awbData[0].FlightOrigin);
                    $("#spnFlightDestination_" + (rowNo)).text(awbData[0].FlightDestination);
                    $("#spnFreightType_" + (rowNo)).text(awbData[0].FreightType);
                    $("#spnTransferCity_" + (rowNo)).text(awbData[0].FlightDateSearch);
                    $("#spnTransferCity_" + (rowNo)).text(userContext.CityCode);
                    $('#NatureofGoods_0').val(awbData[0].NatureOfGoods);
                    $("#Remarks_" + (rowNo)).text(awbData[0].Remarks)
                    //$("#spnPcs_" + (rowNo)).text(awbData[0].Pieces);
                    //$("span[id='AWBNo']").text(awbItem.AWBNo);
                    //$("span[id='Consignee']").text(awbItem.Consignee);
                    //$("span[id='PiecesTotal']").text(awbItem.TotalPieces);
                    //$("span[id='WeightTotal']").text(awbItem.TotalGrossWeight);
                    //$("span[id='HAWBNo']").text(awbItem.HAWBNo);
                    //$("span[id='DOPaymentType']").text(awbItem.DOPaymentType);
                    //$("span[id='DOBill']").text(awbItem.BillTo);
                    $("#hdnPieces").val(awbData[0].Pieces);
                    $("#hdnGrWt").val(awbData[0].GrWT);
                    $("#hdnDFSno").val(awbData[0].DailyFlightSno);
                    $("#hdnAirlineSno").val(awbData[0].AirlineSNo);

                    $('#TransferTo_0').val('1');
                    $('#Text_TransferTo_0').val('AIRLINE');

                    $('#TransferType_0').val(awbData[0].FPAirlineSNo);
                    $('#Text_TransferType_0').val(awbData[0].AirlineName);
                    $('#hdnExecutedOn').val(awbData[0].ExecutedOn);

                    $("#TransferDate_0").data("kendoDatePicker").min($("#hdnExecutedOn").val());
                    $("#HdnAWBNo_0").val(awbData[0].AWBSNo);
                    //$("#TransferDate_0").data("kendoDatePicker").value('');
                    isawbExist = 1;
                } else {
                    ShowMessage('warning', '', "AWB details not found!");
                    return true;
                }
            },
            error: function (ex) {
                var ex = ex;
            }
        });


    }

    if (isawbExist == 1) {
        showCharges();

        if ($("input[id=AWBTYPE_0]:checked").val() == "1" || $("input[id=AWBTYPE_0]:checked").val() == "2") {
            BindCTMAwbDetail(AWBNO);
        }
        $("#btnAddWaybill").prop("disabled", false);
        //$("#Text_AWBNo_0").data("kendoAutoComplete").enable(true);

        //if ($("input[id=AWBTYPE_0]:checked").val() == "1" && lstItem.length >= 1) {
        //    $("#btnAddWaybill").prop("disabled", true);
        //    ShowMessage('warning', 'Warning - CTM', "Multiple Air Waybill CTM not allowed for Import Shipments.");
        //}

        if ($("input[id=AWBTYPE_0]:checked").val() == "2") {

            //$('#TransferType_0').val('1');
            //$('#Text_TransferType_0').val('GARUDA AIRLINE');

            $("#Text_TransferType_0").data("kendoAutoComplete").enable(false);
            $("#Text_TransferTo_0").data("kendoAutoComplete").enable(false);
        }
    }
}
function ManageText(obj) {
    $(this).keypress(function (e) {
        var allowedChars = new RegExp("^[a-zA-Z0-9\ ]+$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (allowedChars.test(str)) {
            return true;
        }
        e.preventDefault();
        return false;
    }).keyup(function () {
        // the addition, which whill check the value after a keyup (triggered by Ctrl+V)
        // We take the same regex as for allowedChars, but we add ^ after the first bracket : it means "all character BUT these"
        var forbiddenChars = new RegExp("[^a-zA-Z0-9\ ]", 'g');
        if (forbiddenChars.test($(this).val())) {
            $(this).val($(this).val().replace(forbiddenChars, ''));
        }
    });
}
//}.keyup(function () {
//    // the addition, which whill check the value after a keyup (triggered by Ctrl+V)
//    // We take the same regex as for allowedChars, but we add ^ after the first bracket : it means "all character BUT these"
//    var forbiddenChars = new RegExp("[^a-zA-Z0-9\ ]", 'g');
//    if (forbiddenChars.test($(this).val())) {
//        $(this).val($(this).val().replace(forbiddenChars, ''));
//    }

function Printalert() {
    ShowMessage('warning', 'Warning - Invoice Print', "Payment Pending for CTM, Print not available.");
}

function AddRow(obj) {



    //$('#divDetail table').each(function () { $(this).css('width', '100%', 'callpadding', '0', 'cellspacing', '0') })
    var rowIndex = obj.id.split("_")[1];
    var rowindex1 = rowIndex + 1


    var nrowIndex = (parseInt(rowIndex) + 1).toString();
    //rowindex = "_" + rowIndex;
    //nrowIndex = "_" + nrowIndex;
    var currRow = $("#" + obj.id).closest("tr").html();
    //var reg = new RegExp(/rowIndex/);
    //var newRow = currRow.replace(str+'g', nrowIndex);//.replace("_" + rowIndex, "_" + nrowIndex);
    //var newRow = ReplaceAll(currRow, rowIndex, nrowIndex);

    var re = new RegExp("_" + rowIndex, 'g');
    var newRow = currRow.replace(re, "_" + nrowIndex);

    $("#" + obj.id).closest("tr").after("<tr id=tr_" + nrowIndex + ">" + newRow + "<\/tr>");

    $("#spnPcs_" + (nrowIndex)).text('');
    $("#spnAWBOrigin_" + (nrowIndex)).text('');
    $("#spnAWBDestination_" + (nrowIndex)).text('');
    $("#spnFlightNO_" + (nrowIndex)).text('');
    $("#spnFlightDate_" + (nrowIndex)).text('');
    $("#spnFlightOrigin_" + (nrowIndex)).text('');
    $("#spnFlightDestination_" + (nrowIndex)).text('');
    $("#spnFreightType_" + (nrowIndex)).text('');
    $("#spnTransferCity_" + (nrowIndex)).text('');
    $("#NatureofGoods_" + (nrowIndex)).text('');
    $("#Remarks_" + (nrowIndex)).text('')

   
  //  cfi.AutoCompleteV2("AWBNo_0", "AWBNo", "CTM_AWBNo", GetAWBDetail, "contains");

    $('#divDetail').find("tr").each(function () {

        /*$(this).find("input[id^='AWBNo']").each(function () {

            //cfi.AutoComplete($(this).attr("name"), "AWBNo", "vCTMAWBdistinct", "AWBSNo", "AWBNo", ["AWBNo"], GetAWBDetail, "contains");

            var a = $("#Text_AWBNo_0").data("kendoAutoComplete")
            a.options.minLength = 4;
        });*/



        $(this).find("input[id^='TransferTo']").each(function () {
            //  cfi.AutoCompleteByDataSource($(this).attr("name"), DataSource, null, null);
            cfi.AutoCompleteV2($(this).attr("name"), "Text", "CTM_TransferType", showCharges, "contains");
        });

        $(this).find("input[id^='TransferType']").each(function () {
            cfi.AutoCompleteV2($(this).attr("name"), "Name", "CTM_Airline", null, "contains");
        });

        $(this).find("input[id^='DeliverdTo']").each(function () {
            cfi.AutoCompleteV2($(this).attr("name"), "Name,IdCardNo", "CTM_DeliveredTo", null, "contains");
        });

        $(this).find("input[id^='TransferDate']").each(function () {
            $("#" + $(this).attr("name")).kendoDatePicker();
        });

        //$(this).find("input[id^='TransferTo']").each(function () {
        //    cfi.AutoCompleteByDataSource($(this).attr("name"), DataSource, null);
        //});

        //$(this).find("input[id^='TransferType']").each(function () {
        //    cfi.AutoComplete($(this).attr("name"), "Name", "vCTMAirline", "SNo", "Name", ["Name"], null, "contains");
        //});

        //$(this).find("input[id^='DeliverdTo']").each(function () {
        //    cfi.AutoComplete($(this).attr("name"), "Name,IdCardNo", "CustomerAuthorizedpersonal", "SNo", "Name", ["Name", "IdCardNo"], null, "contains");
        //});

        //$(this).find("input[id^='TransferDate']").each(function () {
        //    $("#" + $(this).attr("name")).kendoDatePicker();
        //});
        $(this).find("input[id^='btnremove']").each(function () {
            $(this).css("display", "none");
        });


    });
}

$('#TransferDate').unbind("focusin").bind("focusin", function () {
    $(this).kendoDatePicker();
})



function CTMSearch() {
    $("#divCTMInformation").html("");
    var CitySNo = $("#City").val() == "" ? "A~A" : $("#City").val();
    var FlightNo = $("#FlightNo").val() == "" ? "A~A" : $("#FlightNo").val();
    var FlightDate = "A~A";

    FlightDate = $("#FlightDate").attr("sqldatevalue") != "" ? $("#FlightDate").attr("sqldatevalue") : "A~A";
    var searchToDate = "0";
    var IsBondedWareHouse = "0";

    _CURR_PRO_ = "CTM";
    //MyIndexView("divCTMDetails", "Services/Import/CTMService.svc/GetGridData/" + _CURR_PRO_ + "/Import/CTM/" + CitySNo.trim() + "/" + FlightNo.trim() + "/" + FlightDate.trim() + "/" + IsBondedWareHouse);

    MyIndexView("divCTMDetails", "/Services/Import/CTMService.svc/GetGridData");
    $('.formActiontitle.Background').closest('tr').hide();
}

function MyIndexView(divId, serviceUrl, jscriptUrl) {
    $.ajax({
        url: serviceUrl,
        data:BindWhereCondition(),
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
        processName: 'CTM',
        moduleName: 'Import',
        appName: 'CTM',
        CitySNo: $("#City").val() == "" ? "0" : $("#City").val(),
        FlightNo: $("#FlightNo").val(),
        FlightDate: $("#FlightDate").attr("sqldatevalue"),
        IsBondedWareHouse:"0",
    })
}

function BindChargeAutoComplete(elem, mainElem) {
    if ($(elem)[0].id.indexOf("ctmcharge") > -1) {
        $(elem).find("input[id^='ChargeName']").each(function () {
            AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffCode", null, "TariffSNo", "TariffCode", null, GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIE", "", parseInt($('#AWBNo_0').val() == "" ? 0 : $('#AWBNo_0').val()), parseInt($('#BillTo_0').val() == "" ? 0 : $('#BillTo_0').val()), userContext.CityCode, 1, "", "2", "999999999", "No");
        });

        $("div[id$='areaTrans_import_ctmcharge']").find("[id^='areaTrans_import_ctmcharge']").each(function (i, row) {
            if (i < MendatoryHandlingCharges.length) {
                $(this).find("div[id^='transActionDiv']").hide();
            }
            if (i >= MendatoryHandlingCharges.length) {
                $(this).find("span[id^='Type']").text("E");
                $(this).find("input[id^='WaveOff']").hide();
            }
        });

        $("div[id$='areaTrans_import_ctmcharge']").find("[id^='areaTrans_import_ctmcharge']").each(function (i, row) {
            if (i == $("div[id$='areaTrans_import_ctmcharge']").find("[id^='areaTrans_import_ctmcharge']").length - 2) {
                $(this).find("span[id^='PBasis']").closest("td").find("input[id^='_tempPValue']").val(MendatoryHandlingCharges[i].pvalue);
                $(this).find("span[id^='PBasis']").closest("td").find("input[id^='PValue']").val(MendatoryHandlingCharges[i].pvalue);
                $(this).find("span[id^='PBasis']").text(MendatoryHandlingCharges[i].pbasis);
                $(this).find("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").val(MendatoryHandlingCharges[i].svalue);
                $(this).find("span[id^='SBasis']").closest("td").find("input[id^='SValue']").val(MendatoryHandlingCharges[i].svalue);
                $(this).find("span[id^='SBasis']").text(MendatoryHandlingCharges[i].sbasis);
            }
        });


    }

    if ($(elem)[0].id.indexOf("awddocs") > -1) {
        $(elem).find("input[id^='DocType']").each(function () {
            cfi.AutoCompleteByDataSource($(this).attr("name"), SearchDocsDataSource);
        });
    }

    if ($(elem)[0].id.indexOf("payment") > -1) {
        $(elem).find("input[id^='Process']").each(function () {
            cfi.AutoCompleteByDataSource($(this).attr("name"), SearchTypeDataSource);
        });
        $(elem).find("input[id^='DocumentNo']").each(function () {
            cfi.AutoCompleteV2($(this).attr("name"), "AWBNo", "CTM_AWBNoProcess", null, "contains");
        });
        $(elem).find("input[id^='Currency']").each(function () {
            cfi.AutoCompleteV2($(this).attr("name"), "CurrencyCode", "CTM_CurrencyCode", null, "contains");
        });
    }
}

function ReBindChargeAutoComplete(elem, mainElem) {
    totalHandlingCharges = 0;
    totalAmountDO = 0;
    if ($(elem)[0].id.indexOf("ctmcharge") > -1) {
        $(elem).closest("div[id$='areaTrans_import_ctmcharge']").find("[id^='areaTrans_import_ctmcharge']").each(function () {
            $(this).find("input[id^='ChargeName']").each(function () {
                AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffCode", null, "TariffSNo", "TariffCode", null, GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIE", "", parseInt($('#AWBNo_0').val() == "" ? 0 : $('#AWBNo_0').val()), parseInt($('#BillTo_0').val() == "" ? 0 : $('#BillTo_0').val()), userContext.CityCode, 1, "", "2", "999999999", "No");
            });
        });

        var totalRow = $("div[id$='areaTrans_import_ctmcharge']").find("[id^='areaTrans_import_ctmcharge']").length;
        $("div[id$='areaTrans_import_ctmcharge']").find("[id^='areaTrans_import_ctmcharge']").each(function (i, row) {
            if (i + 1 == totalRow) {
                $(this).find("div[id^='transActionDiv']").show();
            }

            if (i >= MendatoryHandlingCharges.length) {
                $(this).find("span[id^='Type']").text("E");
                $(this).find("input[id^='WaveOff']").hide();
            }
            totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat($(this).find("span[id^='Amount']").text());
        });

        $("div[id$='areaTrans_import_ctmcharge']").find("[id^='areaTrans_import_ctmcharge']").each(function (i, row) {
            if ($(this).find("span[id^='SBasis']").text() == undefined || $(this).find("span[id^='SBasis']").text() == "") {
                $(this).find("span[id^='SBasis']").closest("td").find("input").css("display", "none");
                $(this).find("span[id^='SBasis']").closest("td").find("span").css("display", "none");
            }
        });

        totalAmountDO = parseFloat(totalAmountDO) + parseFloat(totalHandlingCharges);
        $("span[id='TotalAmountDO']").text(totalAmountDO.toFixed(3));
    }

    if ($(elem)[0].id.indexOf("awddocs") > -1) {
        $(elem).closest("div[id$='areaTrans_import_awddocs']").find("[id^='areaTrans_import_awddocs']").each(function () {
            $(this).find("input[id^='ServiceName']").each(function () {
                cfi.ChangeAutoCompleteDataSource($(this).attr("name"), SearchDocsDataSource, false);
            });
        });
    }

    if ($(elem)[0].id.indexOf("payment") > -1) {
        $(elem).closest("div[id$='areaTrans_import_payment']").find("[id^='areaTrans_import_payment']").each(function () {
            $(this).find("input[id^='Process']").each(function () {
                cfi.AutoCompleteByDataSource($(this).attr("name"), SearchTypeDataSource);
            });

            $(this).find("input[id^='DocumentNo']").each(function () {
                cfi.AutoCompleteV2($(this).attr("name"), "AWBNo", "CTM_AWBNoProcess", null, "contains");
            });

            $(this).find("input[id^='Currency']").each(function () {
                cfi.AutoCompleteV2($(this).attr("name"), "CurrencyCode", "CTM_CurrencyCode", null, "contains");
            });
        });
    }
}

function ExtraCondition(textId) {
    var rowNo = textId.split("_")[2];
    var AWBfilter = cfi.getFilter("AND");
    if (textId.indexOf("AWBNo") >= 0) {
        var filterAND = cfi.getFilter("AND");
        var filterOR = cfi.getFilter("OR");
        // cfi.setFilter(CTMAWBFilter, "OriginAirport", "neq", userContext.AirportCode);
        //     cfi.setFilter(CTMAWBFilter, "DestinationAirport", "neq", userContext.AirportCode);

        cfi.setFilter(filterAND, "AWBTYPE", "eq", $("input[id=AWBTYPE_" + rowNo + "]:checked").val());

        if ($("input[id=AWBTYPE_" + rowNo + "]:checked").val() == '1') {
            cfi.setFilter(filterOR, "OriginAirportSNo", "eq", userContext.AirportSNo);
            //--Commented by karan---------------------------------------------------------------
           // cfi.setFilter(filterOR, "DestinationAirportSNo", "eq", userContext.AirportSNo);
        }
        //else if ($("input[id=AWBTYPE_" + rowNo + "]:checked").val() == '1') {

        //    cfi.setFilter(CTMAWBFilter, "DestinationAirport", "eq", userContext.AirportCode);
        //    cfi.setFilter(CTMAWBNewFilter, "OriginAirport", "eq", userContext.AirportCode);
        //}

        else if ($("input[id=AWBTYPE_" + rowNo + "]:checked").val() == '2') {

            cfi.setFilter(filterAND, "OriginAirportSNo", "eq", userContext.AirportSNo);
        }

        if (lstItem.length > 0) {

            for (var i = 0; i <= lstItem.length - 1; i++) {
                cfi.setFilter(filterAND, "AWBSNO", "neq", lstItem[i].AWBSNO);
            }

        }

        AWBfilter = cfi.autoCompleteFilter([filterOR, filterAND], "AND");
        return AWBfilter;
    }

    if (textId == "Text_TransferType_" + rowNo) {

        if ($("input[id=AWBTYPE_" + rowNo + "]:checked").val() == '2') {
            cfi.getFilter("AND"),
            cfi.setFilter(AWBfilter, "Type", "eq", $("#TransferTo_" + rowNo).val()),
             cfi.setFilter(AWBfilter, "SNo", "neq", $("#hdnAirlineSno").val()),
            cfi.autoCompleteFilter(AWBfilter);


            //return cfi.getFilter("AND"),
            //    cfi.setFilter(AWBfilter, "SNo", "neq", $("#hdnAirlineSno").val()),
            //    cfi.autoCompleteFilter(AWBfilter);
            return AWBfilter;
        } else {
            cfi.getFilter("AND"),
            cfi.setFilter(AWBfilter, "Type", "eq", $("#TransferTo_" + rowNo).val()),
            cfi.setFilter(AWBfilter, "SNo", "eq", $("#hdnAirlineSno").val()),
            cfi.autoCompleteFilter(AWBfilter);


            //return cfi.getFilter("AND"),
            //    cfi.setFilter(AWBfilter, "SNo", "eq", $("#hdnAirlineSno").val()),
            //    cfi.autoCompleteFilter(AWBfilter);
            return AWBfilter;
        }

    };

    

    if (textId == "Text_TransferTo_" + rowNo) {

        if ( $("input[id=AWBTYPE_" + rowNo + "]:checked").val() == '2') {

            return cfi.getFilter("AND"), cfi.setFilter(AWBfilter, "Sno", "eq", '1'), cfi.autoCompleteFilter(AWBfilter);
        }
        //Commented by karan for garuda Dev work//
        //else {
        //    return cfi.getFilter("AND"), cfi.setFilter(AWBfilter, "Sno", "in", '4,5'), cfi.autoCompleteFilter(AWBfilter);
        //    // return cfi.getFilter("AND"), cfi.setFilter(AWBfilter, "Sno", "eq", '5'), cfi.autoCompleteFilter(AWBfilter);
        //}
        //Commented by karan end for garuda Dev work//
    };
   
    if (textId="Text_FlightNo" && IsAllAirline == 0)
    {
        var filter1 = cfi.getFilter("AND");
        cfi.setFilter(filter1, "CarrierCode", "in", AirlineAccess);
        filterAirlineSNo = cfi.autoCompleteFilter(filter1);
        return filterAirlineSNo;
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



function BindSTMWB(obj) {

    var ffmShipmentTransSNo = $(obj).closest("tr").find("td[data-column='FFMShipmentTransSNo']").text();
    var RULDNo = $(obj).closest("tr").find("td[data-column='ULDNo']").text();
    var FFMFlightMasterSNo = $(obj).closest("tr").find("td[data-column='FFMFlightMasterSNo']").text();

    $.ajax({
        url: "Services/Import/TransitMonitoringService.svc/GetWebForm/TransitMonitoring/Import/ChargeNote/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {

            $("#tblTerminate").html('');
            $("#divDetail2").html("<table class='WebFormTable' id='tbl' validateonsubmit='true'><tbody><tr><td class='formlabel' title='Select Bill Type'><font id=\"ftbillto\" color=\"red\">*</font><span id='spnBillType'> Bill Type</span></td><td class='formInputcolumn'><input type='hidden' name='BillType' id='BillType' value=''><span class='k-widget k-combobox k-header'><span class='k-dropdown-wrap k-state-default' unselectable='on' style='width: 175px;'><input type='text' class='k-input' name='Text_BillType' id='Text_BillType' style='width: 100%; text-transform: uppercase;' tabindex='5' controltype='autocomplete' maxlength='' value='' data-role='autocomplete' autocomplete='off'><span class='k-select' unselectable='on'><span class='k-icon k-i-arrow-s' unselectable='on' style='cursor:pointer;'>select</span></span></span></span></td><td class='formlabel' title='Select '><font id=\"ftbillto\" color=\"red\">*</font><span id='spnBillToSNo'>Bill To</span></td><td class='formInputcolumn'><input type='hidden' name='BillToSNo' id='BillToSNo' value=''><span class='k-widget k-combobox k-header' style='display: inline-block;'><span class='k-dropdown-wrap k-state-default' unselectable='on' style='width: 175px;'><input type='text' class='k-input' name='Text_BillToSNo' id='Text_BillToSNo' style='width: 100%; text-transform: uppercase;' tabindex='6' controltype='autocomplete' maxlength='' value='' data-role='autocomplete' autocomplete='off' data-valid='required' data-valid-msg='Bill To.'><span class='k-select' unselectable='on'><span class='k-icon k-i-arrow-s' unselectable='on' style='cursor:pointer;'>select</span></span></span></span></td></tr></tbody></table>");



            $("#divDetail2").append(result);

            cfi.PopUp("divDetail2", "Rebuild Charges", 1000);
            $.ajax({
                url: "Services/Import/TransitMonitoringService.svc/GetRebuildCharges?ffmShipmentTransSNo=" + ffmShipmentTransSNo, async: false, type: "get", dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var resData = jQuery.parseJSON(result);
                    var sDetail = resData.Table0;
                    var hcData = resData.Table1;
                    currentawbsno = sDetail[0].AWBSNo;
                    currentdetination = sDetail[0].DestinationCity;
                    currArrivedShipmentSNo = sDetail[0].ArrivedShipmentSNo;
                    $("#divDetail2").append("</br><input id='btnPrint' type='button' value='Save' onclick=\"SaveRebuildCharges(" + FFMFlightMasterSNo + ",'" + RULDNo + "');\"> &nbsp; <input id='btnPrint' type='button' value='Cancel' onclick='ClosePopUp();'>");


                    /****************Handling Charge Information*************************************/
                    MendatoryHandlingCharges = [];
                    if (hcData != []) {
                        $(hcData).each(function (row, i) {
                            // if (i.isMandatory == 1) {
                            MendatoryHandlingCharges.push({ "type": "M", "chargename": i.TariffSNo, "text_chargename": i.TariffCode, "pbasis": i.PrimaryBasis, "pvalue": i.pValue, "sbasis": i.SecondryBasis, "svalue": i.sValue, "amount": i.ChargeAmount, "totaltaxamount": i.TotalTaxAmount, "totalamount": i.TotalAmount, "remarks": i.ChargeRemarks.toUpperCase().replace(/<BR>/g, ""), "list": 1 });
                            //  totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat(i.TotalAmount)
                            // }
                        });
                    }
                    cfi.makeTrans("import_rebuildhandlingcharge", null, null, BindChargeAutoComplete, ReBindChargeAutoComplete, null, MendatoryHandlingCharges);
                    if (MendatoryHandlingCharges.length > 0) {
                        $("div[id$='areaTrans_import_rebuildhandlingcharge']").find("[id^='areaTrans_import_rebuildhandlingcharge']").each(function (i, row) {
                            $(this).find("span[id^='PBasis']").closest("td").find("input[id^='_tempPValue']").val(MendatoryHandlingCharges[i].pvalue);
                            $(this).find("span[id^='PBasis']").closest("td").find("input[id^='PValue']").val(MendatoryHandlingCharges[i].pvalue);
                            $(this).find("span[id^='PBasis']").text(MendatoryHandlingCharges[i].pbasis);
                            $(this).find("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").val(MendatoryHandlingCharges[i].svalue);
                            $(this).find("span[id^='SBasis']").closest("td").find("input[id^='SValue']").val(MendatoryHandlingCharges[i].svalue);
                            $(this).find("span[id^='SBasis']").text(MendatoryHandlingCharges[i].sbasis);
                        });

                        $("div[id$='divareaTrans_import_rebuildhandlingcharge']").find("[id='areaTrans_import_rebuildhandlingcharge']").each(function () {
                            $(this).find("input[id^='ChargeName']").each(function () {
                                AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIE", "", currentawbsno, 0, currentdetination, 1, "", "2", "999999999", "No");
                            });

                            cfi.AutoCompleteByDataSource("BillType", billto, onBillToSelect, null);
                            $('#spnWaveOff').hide();
                            $(this).find("input[id^='WaveOff']").hide();
                            $('#spnBillTo').hide();

                            $('#Text_BillTo').hide();



                        });
                        $("div[id$='areaTrans_import_rebuildhandlingcharge']").find("[id^='areaTrans_import_rebuildhandlingcharge']").each(function (i, row) {
                            if (MendatoryHandlingCharges.length > 0) {
                                $(this).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").enable(false);
                                $(this).find("input[id^='Text_ChargeName']").closest('td').hover(function () {
                                    $(this).prop('title', $(this).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").value());
                                });

                                $(this).find("span[id^='PBasis']").closest("td").find("input").attr("disabled", "disabled");
                                $(this).find("span[id^='SBasis']").closest("td").find("input").attr("disabled", "disabled");
                                //if (MendatoryHandlingCharges.length - 1 == i) {
                                //    $(this).find("div[id^='transActionDiv']").show();
                                //    if (MendatoryHandlingCharges.length > 1)
                                //        $(this).find("div[id^='transActionDiv']").find('i:eq(0)').hide();
                                //}

                            }

                        });

                        //$("div[id$='areaTrans_import_dohandlingcharge']").find("[id^='areaTrans_import_dohandlingcharge']").each(function (i, row) {
                        //    $(this).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").enable(false);
                        //    $(this).find("span[id^='PBasis']").closest("td").find("input").attr("disabled", "disabled");
                        //    $(this).find("span[id^='SBasis']").closest("td").find("input").attr("disabled", "disabled");
                        //    if (MendatoryHandlingCharges.length - 1 == i) {
                        //        $(this).find("div[id^='transActionDiv']").show();
                        //        if (MendatoryHandlingCharges.length > 1)
                        //            $(this).find("div[id^='transActionDiv']").find('i:eq(0)').hide();
                        //    }
                        //});
                    }
                    else {

                        $("div[id$='divareaTrans_import_rebuildhandlingcharge']").find("[id='areaTrans_import_rebuildhandlingcharge']").each(function () {
                            $(this).find("input[id^='ChargeName']").each(function () {
                                AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffHeadName", null, GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIE", "", currentawbsno, 0, currentdetination, 1, "", "2", "999999999", "No");
                            });
                        });

                        $("div[id$='areaTrans_import_rebuildhandlingcharge']").find("[id^='areaTrans_import_rebuildhandlingcharge']").each(function (i, row) {
                            $(this).find("span[id^='Type']").text("E");
                            $(this).find("input[id^='WaveOff']").hide();
                            $(this).find("input[id^='BillTo']").hide();
                        });
                    }
                    cfi.AutoCompleteV2("BillToSNo", "Name", "CTM_BillToSNo", null, "contains");

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
function BindCTMAwbDetail(awb) {

    if (awb == '' ) {
        return true;
    }

    _CURR_PRO_ = "CTM";
    $.ajax({
        url: "Services/Import/CTMService.svc/GetWebForm/" + _CURR_PRO_ + "/Import/CTMAWBDetail/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divDetailAWB").html('');
            $("#divDetailAWB").append(result);
            $("#divDetailAWB").append("<div style='text-align: right;'><input type='button' text='Ok' value='OK' style='padding-left: 0px;' onclick='PopUpOnCloseFromButton()'></div>");



            $.ajax({
                url: "Services/Import/CTMService.svc/GetAWBCTMDetail?AWBNo=" + $('#Text_AWBNo_0').val(), async: false, type: "get", dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var resData = jQuery.parseJSON(result);
                    //DLVSNo = msg;
                    var hcData = resData.Table0;
                    if (resData.Table1 != undefined) {
                    if (resData.Table1.length > 1) {

                        var focData = resData.Table1;
                        var strVar = "";
                        strVar += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody>";
                        strVar += "<tr style=\"font-weight: bold\">";
                        strVar += "<td style=\"padding-left: 5px; width: 25%\" class=\"ui-widget-header\">ULD NO<\/td><td style=\"padding-left: 5px; width: 25%\" class=\"ui-widget-header\">AWB NO<\/td><td style=\"padding-left: 5px; width: 25%\" class=\"ui-widget-header\">Pieces<\/td><td style=\"padding-left: 5px; width: 25%\" class=\"ui-widget-header\">Gross Wt.<\/td><\/tr>";
                        if (focData.length > 0) {
                            for (var i = 0; i < focData.length; i++) {
                                strVar += "<td class=\"ui-widget-content\">" + focData[i].ULDNO + "<\/td><td class=\"ui-widget-content\">" + focData[i].AWBNO + "<\/td><td class=\"ui-widget-content\">" + focData[i].Pieces + "<\/td><td class=\"ui-widget-content\">" + focData[i].GrossWeight + "<\/td><\/tr>"
                            }

                            strVar += "<td class=\"ui-widget-content\" colspan=\"4\">Selected AWB for CTM creation is built with multiple AWB/s in same ULD. CTM will be created for all shipments in ULD. In case, you wish to create CTM for only one AWB, kindly breakdown the ULD. <\/td><\/tr>"
                            $("#btnAddWaybill").prop("disabled", true);
                            //$("#Text_AWBNo_0").data("kendoAutoComplete").enable(false);
                        }
                        else {
                            strVar += "<td class=\"ui-widget-content\" colspan=\"3\">No Record Found<\/td><\/tr>"
                            $("#btnAddWaybill").prop("disabled", false);
                            //$("#Text_AWBNo_0").data("kendoAutoComplete").enable(true);
                           
                        }
                        strVar += "<\/tbody><\/table>";
                        strVar += "<\/br>";

                        $('#divAWB').html(strVar);

                        $("#divAWB").dialog({
                            resizable: false,
                            modal: true,
                            title: "AWB Details",
                            width: 600,
                            buttons: {
                                "OK": function () {

                                    $("#divDetailAWB").html('');

                                    $(this).dialog('close');
                                    $('#CTMPieces').focus();
                                },
                                "CANCEL": function () {

                                    cfi.ResetAutoComplete("AWBNo_0");
                                    $('#Pcs_0').val('');
                                    $('#hdnPieces').val('');
                                    $('#Grwt_0').val('');
                                    $('#hdnGrWt').val('');
                                    $('#spnCbm_0').text('');
                                    $('#spnAWBOrigin_0').text('');
                                    $('#spnAWBDestination_0').text('');
                                    $('#spnFlightNO_0').text('');
                                    $('#spnFlightDate_0').text('');
                                    $('#spnAWBOrigin_0').text('');
                                    $('#spnFlightOrigin_0').text('');
                                    $('#spnFlightDestination_0').text('');
                                    $('#spnTransferCity_0').text('');
                                    $('#TransferDate_0').val('');
                                    $('#spnFreightType_0').text('');
                                    $('#NatureofGoods_0').val('');
                                    cfi.ResetAutoComplete("TransferTo_0");
                                    if (lstItem.length <= 0) {
                                        cfi.ResetAutoComplete("Text_TransferType_0");
                                    }
                                    // cfi.ResetAutoComplete("TransferType_0");
                                    $("#tblIssueDetail").html("");
                                    $("#divDetailAWB").html('');
                                    $(this).dialog('close');
                                }
                            }
                        });

                    }
                    else {
                        $('#divAWB').html('');
                        cfi.PopUp("divDetailAWB", "AWB Details", 800, null, PopUpOnClose);

                        /****************Handling Charge Information*************************************/
                        MendatoryHandlingCharges = [];
                        if (hcData != []) {
                            $(hcData).each(function (row, i) {
                                // if (i.isMandatory == 1) {
                                MendatoryHandlingCharges.push({ "SelectForCTM": "0", "BULKULD": i.ULDNo, "PcsGrossVol": i.Pieces + "/" + i.GrossWeight + "/" + i.VolumeWeight, "CTMPieces": i.Pieces, "CTMGrossWt": i.GrossWeight, "CTMVolWt": i.VolumeWeight, "ULDStockSno": i.ULDStockSno, "list": 1 });
                                //  totalHandlingCharges = parseFloat(totalHandlingCharges) + parseFloat(i.TotalAmount)
                                // }
                            });
                        }


                        cfi.makeTrans("import_ctmawbdetail", null, null, null, null, null, MendatoryHandlingCharges);
                        if (MendatoryHandlingCharges.length > 0) {
                            $("div[id$='areaTrans_import_ctmawbdetail']").find("[id^='areaTrans_import_ctmawbdetail']").each(function (i, row) {
                                $(this).find("span[id^='BULKULD']").text(MendatoryHandlingCharges[i].BULKULD);
                                $(this).find("span[id^='PcsGrossVol']").text(MendatoryHandlingCharges[i].PcsGrossVol);
                                $(this).find("input[id^='CTMPieces']").val(MendatoryHandlingCharges[i].CTMPieces);
                                $(this).find("span[id^='CTMGrossWt']").text(MendatoryHandlingCharges[i].CTMGrossWt);
                                $(this).find("span[id^='CTMVolWt']").text(MendatoryHandlingCharges[i].CTMVolWt);
                                $(this).find("input[id^='hdnUldStockSno']").val(MendatoryHandlingCharges[i].ULDStockSno);

                            });
                        }
                        //$('#SelectForCTM').attr("disabled", "disabled");
                        //$('#SelectForCTM').prop('checked', true);
                        //$("div[id$='divareaTrans_import_ctmcharge']").find("[id='areaTrans_import_ctmcharge']").each(function () {
                        //    $(this).find("input[id^='ChargeName']").each(function () {
                        //        AutoCompleteForDOHandlingCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, GatValueOfAutocomplete, null, null, null, null, "getHandlingChargesIE", "", parseInt($('#AWBNo_0').val() == "" ? 0 : $('#AWBNo_0').val()), parseInt($('#BillTo_0').val() == "" ? 0 : $('#BillTo_0').val()), userContext.CityCode, 1, "", "2", "999999999", "No");
                        //    });
                        //});

                        $('#CTMPieces').focus();
                        $("div[id$='divareaTrans_import_ctmawbdetail']").find("[id^='areaTrans_import_ctmawbdetail']").each(function (i, row) {
                            $(this).find("div[id^='transActionDiv']").hide();
                            if (MendatoryHandlingCharges.length > 0) {

                                if ($(this).find("span[id^='BULKULD']").text() != 'BULK') {
                                    $(this).find("input[id^='CTMPieces']").closest("td").find("input").attr("disabled", "disabled");



                                    //   $(this).find("checkbox[id^='SelectForCTM']").prop('checked', true);
                                } else { $(this).find("input[id^='SelectForCTM']").attr("disabled", "disabled"); }
                                $(this).find("input[id^='SelectForCTM']").prop('checked', true);
                                //$(this).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").enable(false);
                                //$(this).find("input[id^='Text_ChargeName']").closest('td').hover(function () {
                                //    $(this).prop('title', $(this).find("input[id^='Text_ChargeName']").data("kendoAutoComplete").value());
                                //});

                                //$(this).find("span[id^='PBasis']").closest("td").find("input").attr("disabled", "disabled");
                                //$(this).find("span[id^='SBasis']").closest("td").find("input").attr("disabled", "disabled");
                                //if (MendatoryHandlingCharges.length - 1 == i) {
                                //    $(this).find("div[id^='transActionDiv_0']").hide();
                                //    //if (MendatoryHandlingCharges.length > 1)
                                //    //    $(this).find("div[id^='transActionDiv']").find('i:eq(0)').hide();
                                //}

                            }

                        });
                    }
                }


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

function DeleteCTM(sno, awbsno, obj) {

    if (confirm('Are you sure, do you want to delete?')) {
        var CTMSno = sno;
        var AWBType = $(obj).closest("tr").find("td[data-column='AWBTYPE']").text();
        var AWBTYPEVal = 0
        if (AWBType == 'EXPORT') { AWBTYPEVal = 0; } else if (AWBType == 'IMPORT') { AWBTYPEVal = 1; } else { AWBTYPEVal = 2; }


        $.ajax({
            url: "Services/Import/CTMService.svc/DeleteCTM?CTMSno=" + CTMSno + "&AWBSNo=" + (awbsno == '' ? 0 : awbsno) + "&Type=" + AWBTYPEVal, async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var resData = jQuery.parseJSON(result);
                //DLVSNo = msg;
                var hcData = resData.Table0;
                if (hcData[0].Column1 == 1) {
                    ShowMessage('warning', 'CTM ', "Airwaybill already processed, CTM can not be deleted.");
                    $("#divDetail").html('');
                    $('#divCTMDetails').show();
                    CTMSearch();
                } else {
                    ShowMessage('warning', 'CTM ', "CTM Deleted Successfully"); $("#divDetail").html('');
                    $('#divCTMDetails').show();
                    CTMSearch();
                }



            },
            complete: function (jqXHR, textStatus) {
            },
            error: function (xhr) {
                var a = "";
            }
        });
    }

}

function PopUpOnClose() {
    if (isClosedFrom == false) {
        calculateGrossOrVol();
        /// AWBDetailsArray = [];
        var awbsno = $('#AWBNo_0').val() == "" ? "0" : $('#AWBNo_0').val();

        if (AWBDetailsArray.length > 0) {
            for (var i = 0; i <= AWBDetailsArray.length - 1; i++) {

                if (AWBDetailsArray[i].AWBSNO == awbsno) {

                    AWBDetailsArray.splice((i), 1);
                }
            }


        }
        //$("#divDetailAWB").data("kendoWindow").close();
        var totalPieces = 0, totalGrossWt = 0, TotalVolWt = 0
        $("div[id$='divareaTrans_import_ctmawbdetail']").find("[id^='areaTrans_import_ctmawbdetail']").each(function (i, row) {
            if ($(this).find("[id^='SelectForCTM']").prop('checked')) {
                totalPieces = parseFloat(totalPieces) + parseFloat($(this).find("input[id^='CTMPieces']").val() == "" ? "0" : $(this).find("input[id^='CTMPieces']").val());
                totalGrossWt = parseFloat(totalGrossWt) + parseFloat($(this).find("span[id^='CTMGrossWt']").text() == "" ? "0" : $(this).find("span[id^='CTMGrossWt']").text());
                TotalVolWt = parseFloat(TotalVolWt) + parseFloat($(this).find("span[id^='CTMVolWt']").text() == "" ? "0" : $(this).find("span[id^='CTMVolWt']").text());


                if (parseFloat($(this).find("input[id^='CTMPieces']").val() == "" ? "0" : $(this).find("input[id^='CTMPieces']").val()) > 0) {
                    var AWBArray = {
                        AWBSNO: $('#HdnAWBNo_0').val(),
                        //  BULKULD: $(this).find("span[id^='BULKULD']").text(),
                        CTMPieces: $(this).find("input[id^='CTMPieces']").val(),
                        CTMGrWt: $(this).find("span[id^='CTMGrossWt']").text(),
                        CTMVolWt: $(this).find("span[id^='CTMVolWt']").text(),
                        ULDStockSno: $(this).find("input[id^='hdnUldStockSno']").val(),
                        BULKULD: $(this).find("span[id^='BULKULD']").text()

                    };
                    AWBDetailsArray.push(AWBArray);
                }
            }

        });
        $('#Pcs_0').val(totalPieces);
        $('#Grwt_0').val(totalGrossWt.toFixed(3));
        $("#spnCbm_0").text((parseFloat(TotalVolWt) / 166.66).toFixed(3));
        $("#hdnPieces").val(totalPieces);
        //   $('#Text_TransferTo_0').focus();

        // $('#Text_AWBNo_0').unbind("focus");    
    }
}
function PopUpOnCloseFromButton() {
    isClosedFrom = true;
    calculateGrossOrVol();
    /// AWBDetailsArray = [];
    var awbsno = $('#HdnAWBNo_0').val() == "" ? "0" : $('#HdnAWBNo_0').val();

    if (AWBDetailsArray.length > 0) {
        for (var i = 0; i <= AWBDetailsArray.length - 1; i++) {

            if (AWBDetailsArray[i].AWBSNO == awbsno) {

                AWBDetailsArray.splice((i), 1);
            }
        }


    }
    //$("#divDetailAWB").data("kendoWindow").close();
    var totalPieces = 0, totalGrossWt = 0, TotalVolWt = 0
    $("div[id$='divareaTrans_import_ctmawbdetail']").find("[id^='areaTrans_import_ctmawbdetail']").each(function (i, row) {
        if ($(this).find("[id^='SelectForCTM']").prop('checked')) {
            totalPieces = parseFloat(totalPieces) + parseFloat($(this).find("input[id^='CTMPieces']").val() == "" ? "0" : $(this).find("input[id^='CTMPieces']").val());
            totalGrossWt = parseFloat(totalGrossWt) + parseFloat($(this).find("span[id^='CTMGrossWt']").text() == "" ? "0" : $(this).find("span[id^='CTMGrossWt']").text());
            TotalVolWt = parseFloat(TotalVolWt) + parseFloat($(this).find("span[id^='CTMVolWt']").text() == "" ? "0" : $(this).find("span[id^='CTMVolWt']").text());


            if (parseFloat($(this).find("input[id^='CTMPieces']").val() == "" ? "0" : $(this).find("input[id^='CTMPieces']").val()) > 0) {
                var AWBArray = {
                    AWBSNO: $('#HdnAWBNo_0').val(),
                    //  BULKULD: $(this).find("span[id^='BULKULD']").text(),
                    CTMPieces: $(this).find("input[id^='CTMPieces']").val(),
                    CTMGrWt: $(this).find("span[id^='CTMGrossWt']").text(),
                    CTMVolWt: $(this).find("span[id^='CTMVolWt']").text(),
                    ULDStockSno: $(this).find("input[id^='hdnUldStockSno']").val(),
                    BULKULD: $(this).find("span[id^='BULKULD']").text()

                };
                AWBDetailsArray.push(AWBArray);
            }
        }

    });
    $('#Pcs_0').val(totalPieces);
    $('#Grwt_0').val(totalGrossWt.toFixed(3));
    $("#spnCbm_0").text((parseFloat(TotalVolWt) / 166.66).toFixed(3));
    $("#hdnPieces").val(totalPieces);
    //   $('#Text_TransferTo_0').focus();

    // $('#Text_AWBNo_0').unbind("focus");

    $("#divDetailAWB").data("kendoWindow").close();
}

function ValidateDate() {
    var fromDate = $("#searchFromDate").attr("sqldatevalue");
    var toDate = $("#searchToDate").attr("sqldatevalue");
    if (fromDate != '' && toDate != '') {
        if (Date.parse(fromDate) > Date.parse(toDate)) {
            $('#searchFromDate').data("kendoDatePicker").value("");
            $('#searchToDate').data("kendoDatePicker").value("");
            $("#searchFromDate").val("");
            $("#searchToDate").val("");
            ShowMessage('warning', 'Warning - Inbound Flight', "From date should not be greater than To date.");
        }
    }
}



function checkCTMProgress() {
    $("#divCTMDetails").find("table tr").find("input[process='D']").attr("class", "incompleteprocess");

}

function BindCTMDetails(obj) {

    if ($('#Text_AWBNo_0').val() == "") {
        ShowMessage('warning', 'Warning - CTM', 'Enter AWB NO', " ", "bottom-right");

        return false;
    } else if (lstItem.length > 10) {
        ShowMessage('warning', 'Warning - CTM'," You can create CTM for 10 waybill's only at one time", " ", "bottom-right");

    }


    else {

        if ($("input[id=AWBTYPE_0]:checked").val() == "1" && $('#TransferTo_0').val() != "4") {
            if ($('#Text_TransferTo_0').val() == "")
            { ShowMessage('warning', 'Warning - CTM', 'Enter Transfer Type', " ", "bottom-right"); return; }
            else if ($('#Text_TransferType_0').val() == "")
            { ShowMessage('warning', 'Warning - CTM', 'Enter Transfer To', " ", "bottom-right"); return; }

        }
        else if ($("input[id=AWBTYPE_0]:checked").val() == "1" && $('#TransferTo_0').val() == "4") {
            if ($('#Text_BillTo_0').val() == "") {
                ShowMessage('warning', 'Warning - CTM', 'Enter Bill To', " ", "bottom-right"); return;
            }
        }
        //else if ($("input[id=AWBTYPE_0]:checked").val() == "1" && $('#TransferTo_0').val() == "5" && $('#TransferType_0').val() == "1") {
        //    if ($('#Text_BillTo_0').val() == "") {
        //        ShowMessage('warning', 'Warning - CTM', 'Enter Bill To', " ", "bottom-right"); return;
        //    }
        //  }

        var dbTableName = 'MultiCTMDetail';
        $('#tbl' + dbTableName).appendGrid({
            tableID: 'tbl' + dbTableName,
            isGetRecord: false,
            currentPage: 1, itemsPerPage: 10, whereCondition: '', sort: '',
            caption: "CTM Detail",
            initRows: 1,
            rowNumColumnName: 'SNo',

            columns: [
             //   { name: 'HdnName', type: 'hidden' },
                { name: 'SNo', type: 'hidden', value: 0 },

                { name: 'AWBSNO', type: 'hidden', value: 0 },
              { name: 'TransferTypeValue', type: 'hidden', value: 0 },
               { name: 'TransferToValue', type: 'hidden', value: 0 },

                      { name: 'AWBNO', display: 'AWB No', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                       { name: 'Pcs', display: 'Pieces', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                        { name: 'GrossWt', display: 'Gross Wt.', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                         //{ name: 'VolWt', display: 'Vol Wt', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                         { name: 'CBM', display: 'CBM', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                         { name: 'AWBOrigin', display: 'AWB Org', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                         { name: 'AWBDest', display: 'AWB Dest', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                         { name: 'FlightNo', display: 'Flight No', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },

                         { name: 'FlightDate', display: 'Flight Date', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                         { name: 'FlightOrigin', display: 'Flight Origin', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                         { name: 'FlighDest', display: 'Flight Dest', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                         { name: 'TransferCity', display: 'Transfer City', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                         { name: 'DateOfTransfer', display: 'Date Of Transfer', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                          { name: 'TransferType', display: 'Transfer Type', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                           { name: 'TransferToSno', display: 'Transfer To', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                            { name: 'NatureofGoods', display: 'Nature of Goods', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
                            { name: 'Remarks', display: 'Remarks', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
            //{ name: 'AWB Detail', display: 'AWB Detail', type: 'button', ctrlCss: { width: '50px' }, value: 'View', onClick: function (evt, rowIndex) { ShowAWBDetails(this); }, isRequired: false },
            //{
            //    name: 'AWBDetail', display: 'AWB Detail', type: 'custom',
            //    customBuilder: function (parent, idPrefix, name, uniqueIndex) {
            //        var ctrlId = idPrefix + '_' + name + '_' + uniqueIndex;
            //        var ctrl = document.createElement('span');
            //        $(ctrl).attr({ id: ctrlId, name: ctrlId }).appendTo(parent);
            //        $('<input>', { type: 'button', maxLength: 1, id: ctrlId, name: ctrlId + '_AWBDetail', value: 'AWBDetail', onclick: ' ShowAWBDetails(this)' }).css('width', '75px').appendTo(ctrl).button();
            //        return ctrl;
            //    }
            //}

            ],

            //isPaging: false,
            hideButtons: {
                removeLast: true,
                insert: true,
                updateAll: true,
                append: true,

            },


        });
        // load data
        bindCTMDetail();
        $("#tblMultiCTMDetail").closest('tr').find('button').unbind('click').click(function (e) { deleteRecordFromCTMList(e); e.preventDefault(); })

    }

    $("#btnAddWaybill").prop("disabled", true);
   // $("#Text_AWBNo_0").data("kendoAutoComplete").enable(false);
   
}
function deleteRecordFromCTMList(obj) {
    var indx = obj.currentTarget.id.split('_')[2];
    //lstItem[0].remove();

    // var y = lstItem;
    //y.splice($.inArray(lstItem, y), indx);
    lstItem.splice((indx - 1), 1);

    $("#tblMultiCTMDetail").appendGrid('load', JSON.parse(JSON.stringify(lstItem)));

    $("#tblMultiCTMDetail").closest('tr').find('button').unbind('click').click(function (e) { deleteRecordFromCTMList(e); e.preventDefault(); })
    $("#Text_AWBNo_0").data("kendoAutoComplete").enable(true);
}
function bindCTMDetail() {

    //  for (var i = 0; i < myData.Table0.length; i++) {
    var isExists = 0;
    var awbsno = $('#HdnAWBNo_0').val() == "" ? "0" : $('#HdnAWBNo_0').val();

    if (lstItem.length > 0) {
        for (var i = 0; i <= lstItem.length - 1; i++) {

            if (lstItem[i].AWBSNO == awbsno) {
                isExists = 1;
            }
        }
        if (isExists == 0) {
            var r = {
                SNo: $('#HdnAWBNo_0').val(),
                AWBSNO: $('#HdnAWBNo_0').val() == "" ? "0" : $('#HdnAWBNo_0').val(),
                TransferTypeValue: $('#TransferType_0').val(),
                TransferToValue: $('#TransferTo_0').val(),
                AWBNO: $('#Text_AWBNo_0').val(),
                Pcs: $('#Pcs_0').val() == "" ? "0" : $('#Pcs_0').val(),
                GrossWt: $('#Grwt_0').val() == "" ? "0" : $('#Grwt_0').val(),
                CBM: $('#spnCbm_0').text() == "" ? "0" : $('#spnCbm_0').text(),
                AWBOrigin: $('#spnAWBOrigin_0').text(),
                AWBDest: $('#spnAWBDestination_0').text(),
                FlightNo: $('#spnFlightNO_0').text(),
                FlightDate: $('#spnFlightDate_0').text(),
                FlightOrigin: $('#spnFlightOrigin_0').text(),
                FlighDest: $('#spnFlightDestination_0').text(),
                TransferCity: $('#spnTransferCity_0').text(),
                DateOfTransfer: $("#TransferDate_0").attr("sqldatevalue"),
                TransferType: $('#Text_TransferTo_0').val(),
                TransferToSno: $('#Text_TransferType_0').val(),
                NatureofGoods: $('#NatureofGoods_0').val().toUpperCase(),
                Remarks: $('#Remarks_0').val().toUpperCase(),
                DailyFlightSno: $('#hdnDFSno').val() == '' ? 0 : $('#hdnDFSno').val(),
            }
            lstItem.push(r);
        }
    } else {
        var r = {
            SNo: $('#HdnAWBNo_0').val(),
            AWBSNO: $('#HdnAWBNo_0').val() == "" ? "0" : $('#HdnAWBNo_0').val(),
            TransferTypeValue: $('#TransferType_0').val(),
            TransferToValue: $('#TransferTo_0').val(),
            AWBNO: $('#Text_AWBNo_0').val(),
            Pcs: $('#Pcs_0').val() == "" ? "0" : $('#Pcs_0').val(),
            GrossWt: $('#Grwt_0').val() == "" ? "0" : $('#Grwt_0').val(),
            CBM: $('#spnCbm_0').text() == "" ? "0" : $('#spnCbm_0').text(),
            AWBOrigin: $('#spnAWBOrigin_0').text(),
            AWBDest: $('#spnAWBDestination_0').text(),
            FlightNo: $('#spnFlightNO_0').text(),
            FlightDate: $('#spnFlightDate_0').text(),
            FlightOrigin: $('#spnFlightOrigin_0').text(),
            FlighDest: $('#spnFlightDestination_0').text(),
            TransferCity: $('#spnTransferCity_0').text(),
            DateOfTransfer: $("#TransferDate_0").attr("sqldatevalue"),
            TransferType: $('#Text_TransferTo_0').val(),
            TransferToSno: $('#Text_TransferType_0').val(),
            NatureofGoods: $('#NatureofGoods_0').val().toUpperCase(),
            Remarks: $('#Remarks_0').val().toUpperCase(),
            DailyFlightSno: $('#hdnDFSno').val() == '' ? 0 : $('#hdnDFSno').val(),

        }
        lstItem.push(r);

        $('#Text_TransferType_0').data('kendoAutoComplete').enable(false);
        $('#Text_TransferTo_0').data('kendoAutoComplete').enable(false);

    }

    //  }

    if ($('#Text_AWBNo_0').val() != "")
        $("#tblMultiCTMDetail").appendGrid('load', JSON.parse(JSON.stringify(lstItem)));

    $('#Text_AWBNo_0').val('');
    $('#AWBNo_0').val('');
}


var RightsCheck = false;
function PagerightsCheckCTM() {
    var CheckIsFalse = 0;

    $(userContext.PageRights).each(function (e, i) {

        if (i.Apps.toString().toUpperCase() == "CTM") {
          
                if (i.Apps.toString().toUpperCase() == "CTM" && i.PageRight == "New") {
                    RightsCheck = false;
                    CheckIsFalse = 1;
                    return
                } if (i.Apps.toString().toUpperCase() == "CTM" && i.PageRight == "Edit") {
                    RightsCheck = false;
                    CheckIsFalse = 1;
                    return
                } if (i.Apps.toString().toUpperCase() == "CTM" && i.PageRight == "Delete") {
                    RightsCheck = false;
                    CheckIsFalse = 1;
                    return
                } else if (CheckIsFalse == 0 && i.PageRight == "Read"){
                    RightsCheck = true;
                    return
                }
            
        }
    });
    if (RightsCheck) {

        //$('#tblAgentOtherChargeTab').find('button').hide();
        $("#divFooter").hide()
        $("#btnNew").hide()
        $("#btnAddWaybill").hide()


    }

}
if (typeof String.prototype.TrimRight !== 'function') {
    String.prototype.TrimRight = function (char) {
        if (this.lastIndexOf(char))
            return this.slice(0, this.length - 1);
        else
            return this;

    }
}


function ShowAWBDetails(obj) {
    if ($("input[id=AWBTYPE_0]:checked").val() != "1") {
        var indx = obj.id.split('_')[2];
        var Awbsno = $("#tblMultiCTMDetail_AWBSNO_" + indx).val();

        $('#divDetailAWBWise').html('');

        var htmltext = "<div data-role='window' class='k-window-content k-content' style='min-width: 90px; min-height: 50px; max-height: 500px;'><table width='100%' style='border-spacing: 0;' id='tblctmawbdetails'><tbody><tr><td><div id='__divctmawbdetails__'><div id='divareaTrans_import_ctmawbdetails' cfi-aria-trans='trans'><table class='WebFormTable'><tbody><tr><td class='formHeaderLabel snowidth' id='transSNo' name='transSNo'>SNo</td><td class='formHeaderLabel' title='BULK/ULD'>BULK/ULD</td><td class='formHeaderLabel' title='Enter Pieces'>CTM Pieces</td><td class='formHeaderLabel' title='CTM Gross Wt'>CTM Gross Wt.</td><td class='formHeaderLabel' title='CTM Vol Wt'>CTM Vol Wt.</td><td class='formHeaderLabel' title=''><span id='spnhdnUldStockSno'> </span></td></tr>";
        for (var i = 0; AWBDetailsArray.length >= (i + 1) ; i++) {
            if (AWBDetailsArray[i].AWBSNO == Awbsno)
                htmltext = htmltext + "<tr data-popup='false' totalfieldsadded='0' maxcountreached='false' fieldcount='0' ><td id='tdSNoCol' class='formSNo snowidth'>" + (i + 1) + "</td><td class='formfourInputcolumn'><span class='' id='BULKULD' recname='BULKULD'>" + (AWBDetailsArray[i].BULKULD) + "</span></td><td class='formfourInputcolumn'><span class='' id='CTMGrossWt' recname='PcsGrossVol'>" + AWBDetailsArray[i].CTMPieces + "</span></td><td class='formfourInputcolumn'><span class='' id='CTMGrossWt' recname='PcsGrossVol'>" + AWBDetailsArray[i].CTMGrWt + "</span></td><td class='formfourInputcolumn'><span class='' id='CTMVolWt' recname='CTMVolWt'>" + AWBDetailsArray[i].CTMVolWt + "</span></td><td class='formfourInputcolumn'></td></div></td></tr>";
        }

        htmltext = htmltext + "</tbody></table></div></div></td></tr></tbody></table><table width='100%'><tbody><tr><td><div id='divContent'></div></td></tr><tr><td><div id='divAfterContent'></div></td></tr></tbody></table><div style='width:100%;'></div><div class='black_overlay' id='divPopUpBackground'></div></div>"

        $('#divDetailAWBWise').append(htmltext);

        cfi.PopUp("divDetailAWBWise", "AWB Details", 800, null, null);
    }
}

var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divCTMDetails' style='width:100%'></div><div id='divDetail'></div><table style='width:100%' id='tblMultiCTMDetail'></table><div id='divPrint'></div><div id='divCTMList'></div><div id='divDetailAWB'></td></tr></table></div><div id='divAWB'></div><div id='divDetailAWBWise'></td></tr></table></div>";

var fotter = "<div><table style='margin-left:20px;'>" +
                        "<tbody><tr><td> &nbsp; &nbsp;</td>" +
                            "<td><button type='submit' class='btn btn-block btn-success btn-sm' id='btnSave' style='display:none'>Save</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-danger btn-sm' id='btnCancel' style='display:none'>Cancel</button></td>" +
                        "</tr></tbody></table> </div>";
