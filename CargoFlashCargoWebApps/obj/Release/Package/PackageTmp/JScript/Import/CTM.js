var AWBDetailsArray = [];
$(document).ready(function () {
    SearchCTM();
    //var LogoURL = getParameterByName("LogoURL", "");
    ////var FooterHTML = getParameterByName("FooterHTML", "");

    //$('#ImgLogo').attr('src', LogoURL);
    ////$('#FooterHTML').html(FooterHTML);

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

        //if(("input:text[id^='Text_TransferTo_']").val()="")
        //{
        //    alert("Please Select Transfer To")
        //    return;
        //}
        var SaveFlag = true;
        $('#divDetail table tbody tr table').each(function (row, tr) {

            if ($(tr).find("input:text[id^='Pcs_0']").val() == "") {
                ShowMessage('warning','Warning - CTM', 'Enter Pieces', " ", "bottom-right");
                $(tr).find("input:text[id^='Pcs_0']").focus();
                SaveFlag = false;
            } else
                if ($(tr).find("input:text[id^='Pcs_0']").val() == "0") {
                    ShowMessage('warning', 'Warning - CTM', 'Total pieces should be greater than 0', " ", "bottom-right");
                   
                    cfi.PopUp("divDetailAWB", "AWB Details", 800, null, PopUpOnClose);
            
                  $("#CTMPieces").focus();
                    SaveFlag = false;
                } else if ($(tr).find("input:text[id^='Text_AWBNo_0']").val() == "") {
                ShowMessage('warning', 'Warning - CTM', 'Enter AWB No', " ", "bottom-right");
                $(tr).find("input:text[id^='Text_AWBNo_0']").focus();
                SaveFlag = false;
            }
            else if ($(tr).find("input:text[id^='Text_TransferTo_']").val() == "") {
                ShowMessage('warning', 'Warning - CTM', 'Enter Transfer Type', " ", "bottom-right");
                $(tr).find("input:text[id^='Text_TransferTo_']").focus();
                SaveFlag = false;
            }
            else if ($(tr).find("input:text[id^='Text_TransferType_']").val() == "") {
                if ($("input[id=AWBTYPE_0]:checked").val() != "1") {
                    ShowMessage('warning', 'Warning - CTM', 'Enter TransferTo ', " ", "bottom-right");
                    $(tr).find("input:text[id^='Text_TransferType_']").focus();
                    SaveFlag = false;
                }
            }
            else if ($('#BillTo_0').val() == "") {
                if ($("input[id=AWBTYPE_0]:checked").val() == "1" && $('#TransferTo_0').val() == '4') {
                    ShowMessage('warning', 'Warning - CTM', 'Enter Bill To', " ", "bottom-right");
                    $(tr).find("input:text[id^='Text_BillTo_']").focus();
                    SaveFlag = false;
                }

            }                    // $("#hdnPieces").val() == '' ? 0 : $("#hdnPieces").val()
            if ($("#Pcs_0").val() != "") {

                if (parseInt($("#Pcs_0").val()) > parseInt($("#hdnPieces").val() == '' ? 0 : $("#hdnPieces").val())) {

                    ShowMessage('warning', 'Warning - CTM', 'Pieces should be less than total pieces', " ", "bottom-right");
                    $("#Pcs_0").val("");
                    //  $(tr).find("input:text[id^='Pcs_0']").focus();
                    SaveFlag = false;
                }
            }

        });


        if (SaveFlag) {
            var CTMInfo = new Array();
            var AwbInfo = new Array();
            $('#divDetail table tbody tr table').each(function (row, tr) {
                CTMInfo.push({
                    AWBSNo: $(tr).find("input:hidden[id^='AWBNo_']").val() == "" ? "0" : $(tr).find("input:hidden[id^='AWBNo_']").val(),
                    AWBTYPE: $("input[id=AWBTYPE_0]:checked").val(),
                    Pieces: $('#Pcs_0').val(),
                    GrWt: $('#Grwt_0').val(),
                    DOSNO: 0,
                    PDSNo: 0,
                    TransferAirportSNo: userContext.AirportSNo,
                    TransferCitySNo: userContext.CitySNo,
                    DateOfTransfer: $(tr).find("input:text[id^='TransferDate_']").val(),
                    //TransferTO: $(tr).find("input:text[id^='Text_TransferTo_']").val(),
                    TransferTo: $(tr).find("input:hidden[id^='TransferTo_']").val() == "" ? "0" : $(tr).find("input:hidden[id^='TransferTo_']").val(),
                    TransferToSNo: $(tr).find("input:hidden[id^='TransferType_']").val() == "" ? "0" : $(tr).find("input:hidden[id^='TransferType_']").val(),
                    DeliverdTo: $(tr).find("input:text[id^='Text_DeliverdTo_']").val(),
                    IdCardNo: '',
                    TransferType: $(tr).find("input:hidden[id^='TransferType_']").val() == "" ? "0" : $(tr).find("input:hidden[id^='TransferType_']").val(),
                    NatureofGoods: $(tr).find("input:text[id^='NatureofGoods_']").val(),
                    Remarks: $(tr).find("input:text[id^='Remarks_']").val()

                });


            });
            var HandlingChargeArray = [];
            if ($("input[id=AWBTYPE_0]:checked").val() == "1") {
                $("div[id$='divareaTrans_import_ctmcharge']").find("[id^='areaTrans_import_ctmcharge']").each(function () {
                    if ($(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key() != "") {
                        var HandlingChargeViewModel = {
                            SNo: $(this).find("td[id^='tdSNoCol']").html(),
                            AWBSNo: $('#AWBNo_0').val(),
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
                            WaveoffRemarks: ''
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
                    }
                    else
                        ShowMessage('warning', 'Warning - CTM', 'CTM Insertion Failed', " ", "bottom-right");

                },


            });
        }


    })
    $('#btnCancel').click(function () {
        $('#divDetail').html('');
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
        $('#TransferDate_0').val('');
        $('#spnFreightType_0').text('');
        $('#NatureofGoods_0').val('');
        cfi.ResetAutoComplete("TransferTo_0");
        cfi.ResetAutoComplete("TransferType_0");
        $("#tblIssueDetail").html("");

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
function calculateGrossOrVol() {

    var totaldetail = $("span[id='PcsGrossVol']").text();

    if ($('#CTMPieces').val() != '') {


        var totalPieces = totaldetail.split('/')[0];
        var Pieces = $('#CTMPieces').val() == '' ? 0 : $('#CTMPieces').val();
        if (parseInt(Pieces) <= parseInt(totalPieces)) {
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
    //$("#divSearch").html("");
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


            //cfi.AutoComplete("Airline", "AWBNo", "vCTMAWB", "AWBSNo", "AWBNo", ["AWBNo"], GetAWBDetail, "contains");

            $("#Text_Airline").after("&nbsp;<button class=\"btn btn-info btn-sm\"  style=\"margin-top: 0px;\" id=\"btnNew\" onclick=\"PrintCTM('divCtmPrint');\">Print</button>");
            cfi.AutoComplete("Airline", "AirlineName", "vGetCTMAirline", "SNo", "AirlineName", ["AirlineName"], Fn_CTmPrint, "contains");

            $("#PrintDate").kendoDatePicker();

            //---------------------- CTM search ---------------------------//
            $("#btnSearch").bind("click", function () {
                $("#divDetail").html('');
                $('#divCTMDetails').show();
                CTMSearch();
            });
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
    debugger;

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
    $("#divCtmPrint").printArea();
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


            
            var str=userContext.SysSetting.LogoURL;
            str=str.split('/');
            $('#ImgLogo').attr('src', str[3] + "/" + str[4]);


            if (finalData.length > 0) {
                $('#spnCTMNo').text(finalData[0].SNo);
                $('#spnCTMDate').text(finalData[0].CtmDate);
                $('#spnCTMTransferto').text(finalData[0].TransferTo); 
                $('#spnAirport').text(finalData[0].AirportName);
                //$('#spnTerminal').text(finalData[0].TransferTo);
                var count = 0;
                $(finalData).each(function (row, tr) {
                    count = parseInt(count) + 1
                    $('#trFirst').after('<tr>' +
                            //'<td style="border:1px solid black;text-align:center"></td>' +
                            '<td style="border:1px solid black;text-align:center">' + tr.AWBNo + '</td>' +
                            '<td style="border:1px solid black;text-align:center">' + tr.AWBOrigin + "-" + tr.AWBDestination + '</td>' +
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

    cfi.AutoComplete("FlightNo", "FlightNo", "vDailyFlightFBL", "FlightNo", "FlightNo", ["FlightNo"], null, "contains");
    cfi.AutoComplete("City", "CityCode,CityName", "City", "CityCode", "CityName", ["CityCode", "CityName"], null, "contains");
    //cfi.AutoComplete("City", "CityCode,CityName", "vCity", "CityCode", "CityCode", ["CityCode", "CityName"], null, "contains");
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
    { Key: "4", Text: "BONDED WAREHOUSE" },
    { Key: "5", Text: "FREE ZONE" }
];


var DataList = [{ key: "0", Text: "Driver Pickup" }, { Key: "1", Text: "Delivered By SAS" }];

function CTMNew() {
    //  $("#divCTMInformation").html("");
    // $('#divCTMDetails').hide();
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
    strVar += "<tr><td class=\"formthreelabel\" title=\"AWB TYPE\"><span id=\"spnAWBTYPE\"> AWB TYPE</span></td><td class=\"formthreeInputcolumn\"><input type='radio' tabindex='1' data-radioval='EXPORT' class='' name='AWBTYPE_0' checked='True' id='AWBTYPE_0' value='0'>EXPORT<input type='radio' tabindex='1' data-radioval='IMPORT' class='' name='AWBTYPE_0' id='AWBTYPE_0' value='1'>IMPORT <input type='radio' tabindex='4' data-radioval='TRANSIT' class='' name='AWBTYPE_0' id='AWBTYPE_0' value='2' data-valid='required' data-valid-msg='AWB TYPE can not be blank'>TRANSIT<\/td>";
    strVar += "<td class=\"formthreelabel\" title=\"Enter AWB No\"><span id=\"spnAWBNo\"> AWB No</span></td><td class=\"formthreeInputcolumn\"><input type=\"hidden\" name=\"AWBNo_0\" id=\"AWBNo_0\" value=\"\" /><input type=\"text\" class=\"\" name=\"Text_AWBNo_0\"  id=\"Text_AWBNo_0\" controltype=\"autocomplete\" maxlength=\"\" data-width=\"50px\" value=\"\" placeholder=\"\" /> <a href='#' onclick='AWbAlldetail();' style=\"margin-left:25px\">Awb Detail</a> <\/td>";
    strVar += "<td class=\"formthreelabel\" title=\"Pcs\"><span id=\"spnPcs\">Pcs</span></td><td class=\"formthreeInputcolumn\"><input type=\"hidden\" name=\"hdnPieces\" id=\"hdnPieces\" value=\"\" /><input type=\"text\" class=\"k-input\" name=\"Pcs_0\" id=\"Pcs_0\" onkeypress=\"ISNumeric(this)\" disabled=\"disabled\" onblur=\"CalculateGrossWt(this)\"  style=\"width: 150px; font-family: Verdana; font-size: 12px; position: relative; vertical-align: top; text-transform: uppercase; background-color: transparent;\" controltype=\"number\" maxlength=\"15\" value=\"\" placeholder=\"\" data-role=\"numerictextbox\" autocomplete=\"off\"/></td></tr>";
    strVar += "<tr><td class=\"formthreelabel\" title=\"Gr Wt.\"><span id=\"spnGrWt\"> Gr Wt.</span></td><td class=\"formthreeInputcolumn\"><input type=\"hidden\" name=\"hdnGrWt\" id=\"hdnGrWt\" value=\"\" /><input type=\"text\" class=\"k-input\" name=\"Grwt_0\" id=\"Grwt_0\" disabled=\"disabled\" onkeypress=\"ISNumeric(this)\" style=\"width: 150px; font-family: Verdana; font-size: 12px; position: relative; vertical-align: top; text-transform: uppercase; background-color: transparent;\" controltype=\"decimal2\" maxlength=\"15\" value=\"\" placeholder=\"\" data-role=\"numerictextbox\" autocomplete=\"off\"/></td>";
    strVar += "<td class=\"formthreelabel\" title=\"Enter CBM\"><span id=\"spnCbm\"> CBM </span></td><td class=\"formthreeInputcolumn\" id=\"spnCbm_0\"></td><td class=\"formthreelabel\" title=\"AWB Origin\"><span id=\"spnAWBOrigin\"> AWB Origin</span></td><td class=\"formthreeInputcolumn\" id=\"spnAWBOrigin_0\"></td></tr>";
    strVar += "<tr><td class=\"formthreelabel\" title=\"AWBDestination\"><span id=\"spnAWBDestination\"> AWB Destination</span></td><td class=\"formthreeInputcolumn\" id=\"spnAWBDestination_0\"></td><td class=\"formthreelabel\" title=\"Flight No\"><span id=\"spnCbm\"> Flight No </span></td>";
    strVar += "<td class=\"formthreeInputcolumn\" id=\"spnFlightNO_0\" ></td><td class=\"formthreelabel\" title=\"Flight Date\"><span id=\"spnFlightDate\">Flight Date</span></td><td class=\"formthreeInputcolumn\" id=\"spnFlightDate_0\"></td></tr>";
    strVar += "<tr><td class=\"formthreelabel\" title=\"Flight Origin\"><span id=\"spnFlightOrigin\">Flight Origin</span></td><td class=\"formthreeInputcolumn\" id=\"spnFlightOrigin_0\"></td><td class=\"formthreelabel\" title=\"Flight Destination\"><span id=\"spnFlightDestination\">Flight Destination </span></td>";
    strVar += "<td class=\"formthreeInputcolumn\" id=\"spnFlightDestination_0\" ></td><td class=\"formthreelabel\" title=\"Freight Type\"><span id=\"spnFreightType\">Freight Type</span></td><td class=\"formthreeInputcolumn\" id=\"spnFreightType_0\" ></td></tr>";
    strVar += "<tr><td class=\"formthreelabel\" title=\"Transfer City\"><span id=\"spnTransferCity\">Transfer City</span></td><td class=\"formthreeInputcolumn\" id=\"spnTransferCity_0\"></td><td class=\"formthreelabel\" title=\"Date Of Transfer\"><span id=\"spnDateOfTransfer\">Date Of Transfer </span></td>";
    strVar += "<td class=\"formthreeInputcolumn\"  ><span class=\"k-picker-wrap k-state-default k-widget k-datepicker k-header\" style=\"width: 50px; \"><input type=\"text\" class=\"k-input k-state-default\" name=\"TransferDate_0\" id=\"TransferDate_0\" style=\"width: 50px; color: rgb(0, 0, 0);\" data-valid=\"required\" data-valid-msg=\"Select From Date\" controltype=\"datetype\" maxlength=\"\" value=\"\" placeholder=\"\" data-role=\"datepicker\" sqldatevalue=\"\" formattedvalue=\"\"><span unselectable=\"on\" class=\"k-select\"><span unselectable=\"on\" class=\"k-icon k-i-calendar\">select</span></span></span></td><td class=\"formthreelabel\" title=\"Transfer Type\"><font color=\"red\">*</font><span id=\"spnTransferTo\">Transfer Type</span></td><td class=\"formthreeInputcolumn\" ><input type=\"hidden\" name=\"TransferTo_0\" id=\"TransferTo_0\" value=\"\" /><input type=\"text\" class=\"\" data-valid=\"required\" data-valid-msg=\"Enter Transfer Type\" name=\"Text_TransferTo_0\"  id=\"Text_TransferTo_0\" controltype=\"autocomplete\" maxlength=\"\" data-width=\"50px\" value=\"\" placeholder=\"\" /></td></tr>";
    strVar += "<tr><td class=\"formthreelabel\" title=\"Transfer To\"><font id=\"fntTransferTo\" color=\"red\">*</font><span id=\"spnAirline\">Transfer To</span></td><td class=\"formthreeInputcolumn\" ><input type=\"hidden\" name=\"TransferType_0\" id=\"TransferType_0\" value=\"\" /><input type=\"text\" class=\"\" name=\"Text_TransferType_0\"  id=\"Text_TransferType_0\" controltype=\"autocomplete\" data-valid=\"required\" data-valid-msg=\"Enter Transfer To\" maxlength=\"\" data-width=\"50px\" value=\"\" placeholder=\"\" /></td>";
    strVar += "<td class=\"formthreelabel\" title=\"Delivered To\"><span id=\"spnDeliveredTo\">Delivered To</span></td><td class=\"formthreeInputcolumn\"  ><input type=\"text\" class=\"k-input\" name=\"DeliverdTo_0\" id=\"DeliverdTo_0\"  style=\"width: 150px; font-family: Verdana; font-size: 12px; position: relative; vertical-align: top; text-transform: uppercase; background-color: transparent;\" controltype=\"alphanumericupper\" maxlength=\"30\" value=\"\" placeholder=\"\" data-role=\"alphabettextbox\" autocomplete=\"off\"/></td><td class=\"formthreelabel\" title=\"Nature of Goods\"><span id=\"spnTransferTo\">Nature of Goods</span></td><td class=\"formthreeInputcolumn\" ><input type=\"text\" class=\"k-input\" name=\"NatureofGoods_0\" id=\"NatureofGoods_0\" onkeypress='ManageText(this)' style=\"width: 150px; font-family: Verdana; font-size: 12px; position: relative; vertical-align: top; text-transform: uppercase; background-color: transparent;\" controltype=\"alphanumericupper\" maxlength=\"15\" value=\"\" placeholder=\"\" data-role=\"alphabettextbox\" autocomplete=\"off\"/></td></tr>";

    strVar += "<tr><td class=\"formthreelabel\" title=\"Remarks\"><span id=\"spnRemarks\">Remarks</span></td><td class=\"formthreeInputcolumn\" ><input type=\"text\" class=\"k-input\" name=\"Remarks_0\" id=\"Remarks_0\"  onkeypress='ManageText(this)'style=\"width: 150px; font-family: Verdana; font-size: 12px; position: relative; vertical-align: top; text-transform: uppercase; background-color: transparent;\" controltype=\"alphanumericupper\" maxlength=\"250\" value=\"\" placeholder=\"\" data-role=\"alphabettextbox\" autocomplete=\"off\"/></td>";
    strVar += "<td class=\"formthreelabel\" title=\"Bill To\"><font id=\"ftbillto\" color=\"red\">*</font><span id=\"spnBillTo\">Bill To</span></td><td class=\"formthreeInputcolumn\" ><input type=\"hidden\" name=\"BillTo_0\" id=\"BillTo_0\" value=\"\" /><input type=\"hidden\" name=\"hdnDFSno\" id=\"hdnDFSno\" value=\"\" /><input type=\"hidden\" name=\"hdnAirlineSno\" id=\"hdnAirlineSno\" value=\"\" /><input type=\"text\" class=\"\" data-valid=\"required\" data-valid-msg=\"Enter Bill To\" name=\"Text_BillTo_0\"  id=\"Text_BillTo_0\" controltype=\"autocomplete\" maxlength=\"\" data-width=\"50px\" value=\"\" placeholder=\"\" /></td><td class=\"formthreelabel\" title=\"\"><span id=\"\"></span></td><td class=\"formthreeInputcolumn\" ></td>";
    strVar += "</tr></tbody></table><\/td>";
    // strVar += "<\/td><td class=\"ui-widget-content\"><img id=\"btnremove_0\" src=\"Images/delete.png\" onclick='CTMDelRow(this);' style=\"display:block;\"><img id=\"btnAdd_0\" src=\"Images/AddIcon.png\" onclick='AddRow(this);'><\/td><\/tr>";

    strVar += "<\/tbody><\/table><div id='tblIssueDetail'></div>";
    strVar += "<\/br>";
    $('#divDetail').html('');
    $('#divDetail').html(strVar);
    $('#btnSave').css('display', 'block')
    $('#btnCancel').css('display', 'block')



    $('#divDetail').find("tr").each(function () {
        $(this).find("input[id^='AWBNo']").each(function () {

            //cfi.AutoComplete($(this).attr("name"), "AWBNo", "vCTMAWB", "AWBSNo", "AWBNo", ["AWBNo"], GetAWBDetail, "contains");
            cfi.AutoComplete($(this).attr("name"), "AWBNo", "vCTMAWBdistinct", "AWBSNo", "AWBNo", ["AWBNo"], GetAWBDetail, "contains");
            

        });

        $(this).find("input[id^='TransferTo']").each(function () {
            // cfi.AutoCompleteByDataSource($(this).attr("name"), DataSource, null, null);

            cfi.AutoComplete($(this).attr("name"), "Text", "VTransferType", "Sno", "Text", ["Text"], showCharges, "contains");
        });

        $(this).find("input[id^='BillTo']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "Name", "vBillTo", "SNo", "Name", ["Name"], CheckCreditBillToSNo, "contains");
        });


        $(this).find("input[id^='TransferType']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "Name", "vCTMAirline", "SNo", "Name", ["Name"], null, "contains");
        });

        $(this).find("input[id^='DeliverdTo']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "Name,IdCardNo", "CustomerAuthorizedpersonal", "SNo", "Name", ["Name", "IdCardNo"], null, "contains");
        });

        $(this).find("input[id^='TransferDate']").each(function () {
            $("#" + $(this).attr("name")).kendoDatePicker();
        });
    });

    // BindCharges();

    $('.k-datepicker').css('width', '70%');
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
    cfi.ResetAutoComplete("Text_TransferType_0");
    //s cfi.ResetAutoComplete("Text_BillTo_0");

    if ($('#AWBNo_0').val() != '') {
        if ($("input[id=AWBTYPE_0]:checked").val() == "1" && $('#TransferTo_0').val() == "4") {
            $('#ftbillto').show();
            $('#fntTransferTo').show();
            BindCharges();
            $("#Text_BillTo_0").data("kendoAutoComplete").enable(true);
            $("#Text_TransferType_0").data("kendoAutoComplete").enable(true);

        } else if ($("input[id=AWBTYPE_0]:checked").val() == "2" && $('#TransferTo_0').val() == "1") {
            $('#ftbillto').show();
            $('#fntTransferTo').show();
            BindChargesForTransit();
            $("#Text_BillTo_0").data("kendoAutoComplete").enable(true);
            $("#Text_TransferType_0").data("kendoAutoComplete").enable(true);

        } else if ($("input[id=AWBTYPE_0]:checked").val() == "1" && $('#TransferTo_0').val() == "5") {
            $('#fntTransferTo').hide();
            $("#Text_TransferType_0").data("kendoAutoComplete").enable(true);
            cfi.AutoCompleteByDataSource("TransferType_0", DataList, BindFreeZoneCharge, null);

        }
        else {
            $("#tblIssueDetail").html('');
            $('#ftbillto').hide();
            $('#fntTransferTo').hide();
            $("#Text_BillTo_0").data("kendoAutoComplete").enable(false);
            $("#Text_TransferType_0").data("kendoAutoComplete").enable(false);
        }

        if ($("input[id=AWBTYPE_0]:checked").val() == "1") {

            if ($('#TransferTo_0').val() == "5") {
                $('#fntTransferTo').hide();
                $("#Text_TransferType_0").data("kendoAutoComplete").enable(true);
                $("#tblIssueDetail").html('');
            } else {
                $('#fntTransferTo').show();
                $("#Text_TransferType_0").data("kendoAutoComplete").enable(false);
            }

        }
        else {
            $('#fntTransferTo').show();
            $("#Text_TransferType_0").data("kendoAutoComplete").enable(true);
        }
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
                url: "Services/Import/DeliveryOrderService.svc/GetDeliveryOrderPaymentType?AWBSNo=" + parseInt($('#AWBNo_0').val() == '' ? 0 : $('#AWBNo_0').val()) + "&ArrivedShipmentSNo=" + parseInt(0) + "&DestinationCity='del'&PDSNo=" + parseInt(0) + "&ProcessSNo=" + parseInt(1007) + "&SubProcessSNo=" + parseInt(2316), async: false, type: "get", dataType: "json", cache: false,
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

function BindChargesForTransit() {
    _CURR_PRO_ = "CTM";
    $.ajax({
        url: "Services/Import/CTMService.svc/GetWebForm/" + _CURR_PRO_ + "/Import/CTMCharge/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#tblIssueDetail").html(result);

            $.ajax({
                url: "Services/Import/DeliveryOrderService.svc/GetDeliveryOrderPaymentType?AWBSNo=" + parseInt($('#AWBNo_0').val() == '' ? 0 : $('#AWBNo_0').val()) + "&ArrivedShipmentSNo=" + parseInt(0) + "&DestinationCity='del'&PDSNo=" + parseInt(0) + "&ProcessSNo=" + parseInt(1007) + "&SubProcessSNo=" + parseInt(2316), async: false, type: "get", dataType: "json", cache: false,
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


function CTMDelRow(indx) {
    var indexval = indx.id.split('_')[1]
    if (indexval > 0) {
        $('#tr_' + indexval).remove();
    }
}


function GetAWBDetail(valueId, value, keyId, key) {
    cfi.ResetAutoComplete("Text_TransferTo_0");
    cfi.ResetAutoComplete("Text_TransferType_0");
    cfi.ResetAutoComplete("Text_BillTo_0");


    var rowNo = valueId.split("_")[2];
    var awbType = $("input[id=AWBTYPE_" + rowNo + "]:checked").val()
    if (key != "" && key != undefined) {

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

        $.ajax({
            url: "Services/Import/CTMService.svc/GetAWBDetail?AWBSNo=" + key + "&AWBType=" + awbType, async: false, type: "get", dataType: "json", cache: false,
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
                }
            },
            error: function (ex) {
                var ex = ex;
            }
        });
    }
    showCharges();

    if ($("input[id=AWBTYPE_0]:checked").val() == "0" || $("input[id=AWBTYPE_0]:checked").val() == "2") {
        BindCTMAwbDetail(key);
    } else {
        $("input[id=Pcs_0]").removeAttr("disabled");
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



    $('#divDetail').find("tr").each(function () {

        $(this).find("input[id^='AWBNo']").each(function () {

            //cfi.AutoComplete($(this).attr("name"), "AWBNo", "vCTMAWB", "AWBSNo", "AWBNo", ["AWBNo"], GetAWBDetail, "contains");
            cfi.AutoComplete($(this).attr("name"), "AWBNo", "vCTMAWBdistinct", "AWBSNo", "AWBNo", ["AWBNo"], GetAWBDetail, "contains");
        });

        $(this).find("input[id^='TransferTo']").each(function () {
            //  cfi.AutoCompleteByDataSource($(this).attr("name"), DataSource, null, null);
            cfi.AutoComplete($(this).attr("name"), "Text", "VTransferType", "Sno", "Text", ["Text"], showCharges, "contains");
        });

        $(this).find("input[id^='TransferType']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "Name", "vCTMAirline", "SNo", "Name", ["Name"], null, "contains");
        });

        $(this).find("input[id^='DeliverdTo']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "Name,IdCardNo", "CustomerAuthorizedpersonal", "SNo", "Name", ["Name", "IdCardNo"], null, "contains");
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
    var FlightDate = "0";

    FlightDate = $("#FlightDate").attr("sqldatevalue") != "" ? $("#FlightDate").attr("sqldatevalue") : "0";
    var searchToDate = "0";
    var IsBondedWareHouse = "0";

    _CURR_PRO_ = "CTM";
    MyIndexView("divCTMDetails", "Services/Import/CTMService.svc/GetGridData/" + _CURR_PRO_ + "/Import/CTM/" + CitySNo.trim() + "/" + FlightNo.trim() + "/" + FlightDate.trim() + "/" + IsBondedWareHouse);
    $('.formActiontitle.Background').closest('tr').hide();
}

function MyIndexView(divId, serviceUrl, jscriptUrl) {
    $.ajax({
        url: serviceUrl, async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#" + divId).html(result);
            $("#divFooter").show();
        },
        error: function (jqXHR, textStatus) {
            var ex = jqXHR;
        }
    });
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
            cfi.AutoComplete($(this).attr("name"), "AWBNo", "AWB", "SNo", "AWBNo", ["SNo", "AWBNo"], null, "contains");
        });
        $(elem).find("input[id^='Currency']").each(function () {
            cfi.AutoComplete($(this).attr("name"), "CurrencyCode", "Currency", "SNo", "CurrencyCode", ["CurrencyCode"], null, "contains");
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
                cfi.AutoComplete($(this).attr("name"), "AWBNo", "AWB", "SNo", "AWBNo", ["SNo", "AWBNo"], null, "contains");
            });

            $(this).find("input[id^='Currency']").each(function () {
                cfi.AutoComplete($(this).attr("name"), "CurrencyCode", "Currency", "SNo", "CurrencyCode", ["CurrencyCode"], null, "contains");
            });
        });
    }
}

function ExtraCondition(textId) {
    var rowNo = textId.split("_")[2];
    var AWBfilter = cfi.getFilter("AND");
    if (textId.indexOf("AWBNo") >= 0) {
        var CTMAWBFilter = cfi.getFilter("AND");
        // cfi.setFilter(CTMAWBFilter, "OriginAirport", "neq", userContext.AirportCode);
        //     cfi.setFilter(CTMAWBFilter, "DestinationAirport", "neq", userContext.AirportCode);

        if ($("input[id=AWBTYPE_" + rowNo + "]:checked").val() == '0') {

            cfi.setFilter(CTMAWBFilter, "OriginAirport", "eq", userContext.AirportCode);

        } else if ($("input[id=AWBTYPE_" + rowNo + "]:checked").val() == '1') {

            cfi.setFilter(CTMAWBFilter, "DestinationAirport", "eq", userContext.AirportCode);
        }

        else if ($("input[id=AWBTYPE_" + rowNo + "]:checked").val() == '2') {

            cfi.setFilter(CTMAWBFilter, "DestinationAirport", "eq", userContext.AirportCode);
        }


        cfi.setFilter(CTMAWBFilter, "AWBTYPE", "eq", $("input[id=AWBTYPE_" + rowNo + "]:checked").val());
        AWBfilter = cfi.autoCompleteFilter(CTMAWBFilter);
        return AWBfilter;
    }

    if (textId == "Text_TransferType_" + rowNo) {

         cfi.getFilter("AND"), cfi.setFilter(AWBfilter, "Type", "eq", $("#TransferTo_" + rowNo).val()), cfi.autoCompleteFilter(AWBfilter);
         return cfi.getFilter("AND"), cfi.setFilter(AWBfilter, "SNo", "neq", $("#hdnAirlineSno").val()), cfi.autoCompleteFilter(AWBfilter);


    };

    if (textId == "Text_TransferTo_" + rowNo) {
        if ($("input[id=AWBTYPE_" + rowNo + "]:checked").val() == '0' ) {

            return cfi.getFilter("AND"), cfi.setFilter(AWBfilter, "Sno", "eq", '1'), cfi.autoCompleteFilter(AWBfilter);
        } else if ($("input[id=AWBTYPE_" + rowNo + "]:checked").val() == '2') {
            // Changed by deepak sharma as per discussion with karan cfi.setFilter(AWBfilter, "Sno", "in", '1')
            return cfi.getFilter("AND"), cfi.setFilter(AWBfilter, "Sno", "in", '1'), cfi.autoCompleteFilter(AWBfilter); 
            //return cfi.getFilter("AND"), cfi.setFilter(AWBfilter, "Sno", "in", '1,4'), cfi.autoCompleteFilter(AWBfilter);
        } else {
            return cfi.getFilter("AND"), cfi.setFilter(AWBfilter, "Sno", "in", '4,5'), cfi.autoCompleteFilter(AWBfilter);
            // return cfi.getFilter("AND"), cfi.setFilter(AWBfilter, "Sno", "eq", '5'), cfi.autoCompleteFilter(AWBfilter);
        }
    };

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
                    cfi.AutoComplete("BillToSNo", "Name", "Account", "SNo", "Name", ["Name"], null, "contains");

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

    _CURR_PRO_ = "CTM";
    $.ajax({
        url: "Services/Import/CTMService.svc/GetWebForm/" + _CURR_PRO_ + "/Import/CTMAWBDetail/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#divDetailAWB").html('');
            $("#divDetailAWB").append(result);
            // $("#divDetailAWB").append("<input id='btnsaveawb' type='button' value='Save'onclick='saveAWB();'>");


         
            $.ajax({
                url: "Services/Import/CTMService.svc/GetAWBCTMDetail?AWBSNo=" + parseInt($('#AWBNo_0').val() == '' ? 0 : $('#AWBNo_0').val()), async: false, type: "get", dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var resData = jQuery.parseJSON(result);
                    //DLVSNo = msg;
                    var hcData = resData.Table0;

                    if (resData.Table1.length > 1)
                    {
                       
                        var focData = resData.Table1;
                        var strVar = "";
                        strVar += "<table class=\"tdPadding\" style=\"width:100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody>";
                        strVar += "<tr style=\"font-weight: bold\">";
                        strVar += "<td style=\"padding-left: 5px; width: 25%\" class=\"ui-widget-header\">ULD NO<\/td><td style=\"padding-left: 5px; width: 25%\" class=\"ui-widget-header\">AWB NO<\/td><td style=\"padding-left: 5px; width: 25%\" class=\"ui-widget-header\">Pieces<\/td><td style=\"padding-left: 5px; width: 25%\" class=\"ui-widget-header\">Gross Wt.<\/td><\/tr>";
                        if (focData.length > 0) {
                            for (var i = 0; i < focData.length; i++) {
                                strVar += "<td class=\"ui-widget-content\">" + focData[i].ULDNO + "<\/td><td class=\"ui-widget-content\">" + focData[i].AWBNO + "<\/td><td class=\"ui-widget-content\">" + focData[i].Pieces + "<\/td><td class=\"ui-widget-content\">" + focData[i].GrossWeight + "<\/td><\/tr>"
                            }

                            strVar += "<td class=\"ui-widget-content\" colspan=\"4\">Selected airway bill is planned with multiple airway bills under same ULD, CTM will also be created for this planned airway bills. <\/td><\/tr>"
                        }
                        else {
                            strVar += "<td class=\"ui-widget-content\" colspan=\"3\">No Record Found<\/td><\/tr>"
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
                                    $("#Text_TransferTo_0").focus();
                                    $(this).dialog('close');
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
                                    cfi.ResetAutoComplete("TransferType_0");
                                    $("#tblIssueDetail").html("");
                                    $("#divDetailAWB").html('');
                                    $(this).dialog('close');
                                }
                            }
                        });

                    }
                    else
                    {
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
    calculateGrossOrVol();
    AWBDetailsArray = [];
    var totalPieces = 0, totalGrossWt = 0, TotalVolWt = 0
    $("div[id$='divareaTrans_import_ctmawbdetail']").find("[id^='areaTrans_import_ctmawbdetail']").each(function (i, row) {
        if ($(this).find("[id^='SelectForCTM']").prop('checked')) {
            totalPieces = parseFloat(totalPieces) + parseFloat($(this).find("input[id^='CTMPieces']").val() == "" ? "0" : $(this).find("input[id^='CTMPieces']").val());
            totalGrossWt = parseFloat(totalGrossWt) + parseFloat($(this).find("span[id^='CTMGrossWt']").text() == "" ? "0" : $(this).find("span[id^='CTMGrossWt']").text());
            TotalVolWt = parseFloat(TotalVolWt) + parseFloat($(this).find("span[id^='CTMVolWt']").text() == "" ? "0" : $(this).find("span[id^='CTMVolWt']").text());


            if (parseFloat($(this).find("input[id^='CTMPieces']").val() == "" ? "0" : $(this).find("input[id^='CTMPieces']").val()) > 0) {
                var AWBArray = {
                    AWBSNO: $('#AWBNo_0').val(),
                    //  BULKULD: $(this).find("span[id^='BULKULD']").text(),
                    CTMPieces: $(this).find("input[id^='CTMPieces']").val(),
                    CTMGrWt: $(this).find("span[id^='CTMGrossWt']").text(),
                    CTMVolWt: $(this).find("span[id^='CTMVolWt']").text(),
                    ULDStockSno: $(this).find("input[id^='hdnUldStockSno']").val()

                };
                AWBDetailsArray.push(AWBArray);
            }
        }
      
    });
    $('#Pcs_0').val(totalPieces);
    $('#Grwt_0').val(totalGrossWt);
    $("#spnCbm_0").text((parseFloat(TotalVolWt) / 166.66).toFixed(3));
    $("#hdnPieces").val(totalPieces);
  //   $('#Text_TransferTo_0').focus();

   // $('#Text_AWBNo_0').unbind("focus");


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

var divContent = "<div class='rows'> <table style='width:100%'> <tr> <td valign='top' class='td100Padding'><div id='divCTMDetails' style='width:100%'></div><div id='divDetail'></div><div id='divPrint'></div><div id='divCTMList'></div><div id='divDetailAWB'></td></tr></table></div><div id='divAWB'></div>";

var fotter = "<div><table style='margin-left:20px;'>" +
                        "<tbody><tr><td> &nbsp; &nbsp;</td>" +
                            "<td><button type='submit' class='btn btn-block btn-success btn-sm' id='btnSave' style='display:none'>Save</button></td>" +
                            "<td> &nbsp; &nbsp;</td>" +
                            "<td><button class='btn btn-block btn-danger btn-sm' id='btnCancel' style='display:none'>Cancel</button></td>" +
                        "</tr></tbody></table> </div>";
