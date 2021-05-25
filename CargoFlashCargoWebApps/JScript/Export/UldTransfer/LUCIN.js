var UCRReceiptNo = 0;
var ULDTransferSNo = 0;
var GetUldNo = "";
var Gtime = "";
var CheckIsFalse = 0;
$(function () {
    $.ajax({
        url: 'HtmlFiles/Export/UldTransfer/LUCIN.html',
        success: function (result) {
            $("body").html(result).append(footer);
            PageLoaded();
            var URL = getQueryStringValue("returnurl")
            var ULDNumber = getQueryStringValue("ULDNumber")
            GetUldNo = ULDNumber;
            var ULDNumberSNo = getQueryStringValue("ULDNumberSNo")
            if (URL == "ULDOut") {
                NewClick();
                $("#ULD").val(ULDNumberSNo);
                cfi.BindMultiValue("ULD", ULDNumber, ULDNumberSNo);
            }

        }
    });

    //$("#Text_LUCInNumber").on("keypress keyup blur", function (event) {
    //    alert("")
    //    $(this).val($(this).val().replace(/[^\d].+/, ""));
    //    if ((event.which < 48 || event.which > 57)) {
    //        event.preventDefault();
    //    }
    //});
});
function ChangeEvent() {

    if (!$.isNumeric($('#Text_LUCInNumber').val()) || $('#Text_LUCInNumber').val() == '') {
        $('#Text_LUCInNumber').val('');
        $('#Text_LUCInNumber').focus();
        alert('Enter only numbers.');
        $("#Text_LUCInNumber").val('')
        return
    }

    var LUCINNumber = $("#Text_LUCInNumber").val()
    CheckLUCINNumber(LUCINNumber)
}
function getQueryStringValue(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}
function PageLoaded() {
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "html",
        async: true,
        url: "Services/Export/UldTransfer/LucInService.svc/GetPageGrid",
        success: function (response) {
            $("#divMainGrid").html(response);
            //$(".k-grid").closest("table").find("tr:eq(1)").hide();
            //$("input[type='button'][value='S']").css("disabled", "disabled");
            PageRightsCheckLucIn()
        }
    });

}

function SaveDetails() {

    checkfuturedate();
    var arrVal = [];
    var AddSno = 0;
    cfi.ValidateSubmitSection("divLUCInformation");
    if (!cfi.IsValidSection($("#divLUCInformation"))) {
        return false;
    }

    if ($("#ODLNCode").val() == "") {
        $("#ODLNCode").val("0")
    }



    var res = $("#tblAdd").serializeToJSON();
    var action = AddSno == "0" ? "SaveDetails" : "UpdateDetails/" + AddSno;
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "Services/Export/UldTransfer/LucInService.svc/" + action,
        data: JSON.stringify(res),
        success: function (response) {
            if (response == "1") {
                //$("#Text_LUCInNumber").attr("newvalue", $("#Text_LUCInNumber").val())
                //$("#Text_Receiveddate").attr("newvalue", $("#Text_Receiveddate").val())
                //$("#Text_ReceivedTime").attr("newvalue", $("#Text_ReceivedTime").val())
                //$("#Text_ODLNCode").attr("newvalue", ODLNCode);
                if ($("#ISDamge").prop('checked') == true) {
                    $("#ISDamge").attr("newvalue", "true");
                    $("#ISDamge").attr("value", "1");
                } else if ($("#ISDamge").prop('checked') == false) {
                    $("#ISDamge").attr("newvalue", "false");
                    $("#ISDamge").attr("value", "0");
                }
                //$("#Text_Remarks").attr("newvalue", $("#Text_Remarks").val());
                if ($("#Text_LUCInNumber").attr("oldvalue") != $("#Text_LUCInNumber").val()) {
                    var oldval = $("#Text_LUCInNumber").attr("oldvalue");
                    var newval = $("#Text_LUCInNumber").val();
                    var a = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "ULDReturn", ColumnName: 'UCR Number', OldValue: oldval, NewValue: newval };
                    arrVal.push(a);
                }
                if ($("#Text_Receiveddate").attr("oldvalue") != $("#Text_Receiveddate").val()) {
                    var oldval = $("#Text_Receiveddate").attr("oldvalue");
                    var newval = $("#Text_Receiveddate").val();
                    var b = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "ULDReturn", ColumnName: 'Received Date', OldValue: oldval, NewValue: newval };
                    arrVal.push(b);
                }
                if ($("#Text_ReceivedTime").attr("oldvalue") != $("#Text_ReceivedTime").val()) {
                    var oldval = $("#Text_ReceivedTime").attr("oldvalue");
                    var newval = $("#Text_ReceivedTime").val();
                    var c = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "ULDReturn", ColumnName: 'Received Time', OldValue: oldval, NewValue: newval };
                    arrVal.push(c);
                }
                if ($("#Text_ODLNCode").attr("oldvalue") != $("#Text_ODLNCode").val()) {
                    var oldval = $("#Text_ODLNCode").attr("oldvalue");
                    var newval = $("#Text_ODLNCode").val();
                    var d = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "ULDReturn", ColumnName: 'ODLN Code', OldValue: oldval, NewValue: newval };
                    arrVal.push(d);
                }
                if ($("#Text_Remarks").attr("oldvalue") != $("#Text_Remarks").val()) {
                    var oldval = $("#Text_Remarks").attr("oldvalue");
                    var newval = $("#Text_Remarks").val();
                    var e = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "ULDReturn", ColumnName: 'Remarks', OldValue: oldval, NewValue: newval };
                    arrVal.push(e);
                }
                if ($("#ISDamge").prop('checked') == true) {
                    if ($("#DamagedRemarks").attr("oldvalue") != $("#DamagedRemarks").val()) {
                        var oldval = $("#DamagedRemarks").attr("oldvalue");
                        var newval = $("#DamagedRemarks").val();
                        var f = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "ULDReturn", ColumnName: 'Damaged Remarks', OldValue: oldval, NewValue: newval };
                        arrVal.push(f);
                    }
                }
                if ($("#ISDamge").attr("oldvalue") != $("#ISDamge").attr("newvalue")) {
                    var oldval = $("#ISDamge").attr("oldvalue");
                    var newval = $("#ISDamge").attr("newvalue");
                    var g = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "ULDReturn", ColumnName: 'Rental Days', OldValue: "", NewValue: "" };
                    arrVal.push(g);
                }
                //if ($("#ISDamge").attr("oldvalue") != $("#ISDamge").attr("newvalue")) {
                //    var oldval = $("#ISDamge").attr("oldvalue");
                //    var newval = $("#ISDamge").attr("newvalue");
                //    var g = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "ULDReturn", ColumnName: 'Rental Days', OldValue: oldval, NewValue: newval };
                //    arrVal.push(g);
                //}
                SaveAppendGridAuditLog("ULD Number", $("#Text_ULD").text(), "0", JSON.stringify(arrVal), "Edit", userContext.TerminalSNo, userContext.NewTerminalName);


                ShowMessage("success", "", "Saved successfully...");
                setTimeout(function () {
                    window.location.href = "//" + location.host + "/" + window.location.pathname + "?Module=Shipment&Apps=LUCIN&FormAction=INDEXVIEW";
                }, 100);
            } else if (response == "3") {
                ShowMessage('warning', 'Information!', "Already returned : " + $("#Text_ULD").text() + " ", "bottom-right");
                $("#btnSave").hide()
                return

            }
        }
    });
}
var EditSNo = 0;
var IsESS = 0;
var IsESS1 = 0;
var ITime = "";
function checkProgrss(item, subprocess, displaycaption) {
    debugger;
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
function checkNumeric(id) {
    if (!$.isNumeric($('#' + id).val()) || $('#' + id).val() == '') {
        $('#' + id).val('');
        $('#' + id).focus();
        alert('Enter only numbers.');
        $('#' + id).css({
            "border": "1px solid red",
            "background": "#FFCECE"
        });
        //return false;
    }
}
function UldInfomationIN(ULDNumber, obj) {
    //////$("#divLUCInformation").html('');

    $.ajax({
        url: 'HtmlFiles/Export/UldTransfer/UldInformationIn.html',
        async: false,
        cache: false,
        success: function (result) {


            $("#divLUCInformation").html(result);

            $("#Text_Receiveddate").kendoDatePicker();





            // Changes by Vipin Kumar
            //cfi.AutoComplete("DemurrageCode", "Code", "DamurrageCodes", "SNo", "Code", ["Code"], null, "contains");
            cfi.AutoCompleteV2("DemurrageCode", "Code", "ULD_Transfer_DemurrageCode", null, "contains");
            //cfi.AutoComplete("ODLNCode", "Code,ODLNDesc", "ODLNCodes", "SNo", "Code", ["Code", "ODLNDesc"], null, "contains");
            cfi.AutoCompleteV2("ODLNCode", "Code,ODLNDesc", "ULD_Transfer_ODLNCodes", null, "contains");
            ///// Ends 

            //cfi.AutoComplete("DemurrageCode", "Code,ODLNDesc", "DamurrageCodes", "SNo", "Code", ["Code", "ODLNDesc"], null, "contains", ",");
            //cfi.AutoComplete("ODLNCode", "AirportCode,AirportName", "ODLNCodes", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains", ",")

        }
    });
    var trHRow = $(obj).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var IsInboundIndex = trHRow.find("th[data-field='IsInbound']").index();
    var IsInbound = $(obj).closest('tr').find('td:eq(' + IsInboundIndex + ')').text();

    $("#LUCINNumber").text("");
    $("#ReceivedDate").text("")
    $("#ReceivedTime").text("")
    if (IsInbound.trim() == "Received") {
        $("#LUCINNumber").text("UCR Number");
        $("#ReceivedDate").text("Receive  Date")
        $("#ReceivedTime").text("Receive  Time")
        $("#ULDInformation").html("ULD TRANSFER FROM OTHER ")
    } else if (IsInbound.trim() == "Transfer") {
        $("#LUCINNumber").text("LUC IN Number");
        $("#ReceivedDate").text("Return  Date")
        $("#ReceivedTime").text("Return  Time")
        $("#ULDInformation").html("ULD TRANSFER TO OTHER ")
    }

    BindUldInfomationIN(ULDNumber, IsInbound)
}




function BindUldInfomationIN(ULDNumber, IsInbound) {

    $("#AirportSNo").val(userContext.AirportSNo)
    $("#Text_CityCode").html(userContext.AirportCode)
    $("#INPOUTProcessStatus").val(IsInbound)
    $.ajax({
        type: "POST",
        //contentType: "application/json; charset=utf-8",
        //dataType: "json",
        url: "Services/Export/UldTransfer/LucInService.svc/UldInfomationIN/" + ULDNumber,
        success: function (r) {
            //alert(r.Text_IssuedTime)
            $('#ULD').val(r.SNo);
            $('#Text_ULD').html(r.Text_ULD);
            $('#Text_IssuedBy').html(r.Text_IssuedBy);
            $('#Text_IssuedFrom').html(r.Text_IssuedFrom);
            $('#IssuedFrom').val(r.Text_IssuedFrom);
            $('#Text_Issuedate').html(r.Text_Issuedate);
            $('#Text_Issuetime').text(r.Text_Issuetime);

            ITime = r.Text_Issuetime;
            if (r.UHFReceiptNo != "") {
                $("#LUCINNumber").text("UHF Number")
            } else {
                $("#LUCINNumber").text("UCR Number")
            }

            if (IsInbound.trim() == "Received") {
                $("#Text_LUCInNumber").val(r.UCRReceiptNo)
                if (r.UCRReceiptNo == "") {
                    $('#Text_LUCInNumber').attr('readonly', false);
                }
                else {
                    $("#Text_LUCInNumber").attr("readonly", "readonly")
                }
            }
            else if (IsInbound.trim() == "Transfer") {
                $('#Text_LUCInNumber').val(r.LUCInNumber);
                if (r.LUCInNumber != "") {
                    $('#Text_LUCInNumber').attr('readonly', true);
                }
            }

            if (r.Text_ReceivedBy != "") {
                $('#Text_ReceivedBy').html(r.Text_ReceivedBy);
            }
            else {

                $('#Text_ReceivedBy').html(r.currentuserName);
            }
            $('#Text_ReceivedFrom').html(r.Text_ReceivedFrom);

            $('#Text_Remarks').val(r.Text_Remarks);
            $('#lblRentaldays').html(r.RentalDays);


            if (r.Text_Receiveddate != "" && r.Text_Receiveddate.length > 0) {
                $('#Text_Receiveddate').val(r.Text_Receiveddate);
                $('#Text_ReceivedTime').val(r.Text_ReceivedTime);
            }


            $('#ODLNCode').val(r.ODLNCode);
            $('#Text_ODLNCode').val(r.Text_ODLNCode);
            $("#DamagedRemarks").val(r.isrdamageremarks);
            if (r.isrDamage == "1") {
                $("#ISDamge").attr("checked", true)
                $("#ISDamge").attr("value", "1")
            } else if (r.isrDamage == "0") {
                $("#ISDamge").attr("checked", false)
                $("#ISDamge").attr("value", "0")
            }
            //$('#Text_IssuedTime').html(r.Text_IssuedTime);
            //$('#Text_ReceivedFrom').html(r.Text_ReceivedFrom);

            if (!YesReady) {
                if (r.Text_Receiveddate != "" && r.Text_Receiveddate.length > 0) { $("#btnSave").hide(); } else {
                    $("#btnSave").show();
                }
            }

            if (r.Text_Issuedate != "") {
                var eIssuedate = new Date($("#Text_Issuedate").text());
                var validTodate = $("#Text_Receiveddate").data("kendoDatePicker");
                validTodate.min(eIssuedate);
                // $("#Text_Receiveddate").val("")
            }


            AuditLogBindOldValue(r.Text_ODLNCode, r.Text_Remarks, r.isrDamage, r.isrdamageremarks);

            var ReceivedDate = $("#Text_Receiveddate").val();
            var ReceivedTime = $("#Text_ReceivedTime").val();
            var ReceivedTime1 = ReceivedTime.split(":");

            var month = '';
            var today = new Date();

            var dd = today.getDate();


            var mm = today.getMonth() + 1;


            var yyyy = today.getFullYear();


            if (dd < 10) {
                dd = '0' + dd;
            }


            if (mm < 10) {
                mm = '0' + mm;
            }


            switch (mm) {

                case '01':
                    month = month + '' + "Jan";
                    break;

                case '02':
                    month = month + '' + "Feb";

                    break;

                case '03':
                    month = month + '' + "Mar";

                    break;

                case '04':
                    month = month + '' + "Apr";

                    break;

                case '05':
                    month = month + '' + "May";

                    break;
                case '06':
                    month = month + '' + "Jun";

                    break;

                case '07':
                    month = month + '' + "Jul";
                    break;

                case '08':
                    month = month + '' + "Aug";
                    break;

                case '09':
                    month = month + '' + "Sep";

                    break;

                case 10:
                    month = month + '' + "Oct";

                    break;

                case 11:
                    month = month + '' + "Nov";

                    break;

                case 12:
                    month = month + '' + "Dec";
            }

            today = dd + '-' + month + '-' + yyyy;
            if (ReceivedDate > today) {

                $("#Text_ReceivedDate").val('');
                ShowMessage('warning', 'Information!', "Received date cannot be greater than current date.", "bottom-right");
                return;

            }



        }
    });


}
function AuditLogBindOldValue(ODLNCode, Remarks, isrDamage, damageremarks) {
    $("#Text_LUCInNumber").attr("oldvalue", $("#Text_LUCInNumber").val())
    $("#Text_Receiveddate").attr("oldvalue", $("#Text_Receiveddate").val())
    $("#Text_ReceivedTime").attr("oldvalue", $("#Text_ReceivedTime").val())
    $("#Text_ODLNCode").attr("oldvalue", ODLNCode);
    if (isrDamage == "1") {
        $("#ISDamge").attr("oldvalue", "true");
        $("#ISDamge").attr("value", "1");
    } else if (isrDamage == "0" || isrDamage == "") {
        $("#ISDamge").attr("oldvalue", "false");
        $("#ISDamge").attr("value", "0");
    }
    $("#Text_Remarks").attr("oldvalue", Remarks);
}


function OnSuccessGrid() {
    var TrHeader = $("div[id$='divMainGrid']").find("div[class^='k-grid-header'] thead tr");
    var SentLUCIndex = TrHeader.find("th[data-field='SentLUC']").index();
    var IsESSIndex = TrHeader.find("th[data-field='IsESS']").index();
    var IsALIndex = TrHeader.find("th[data-field='IsAL']").index();
    var IsUCRIndex = TrHeader.find("th[data-field='IsUCR']").index();
    var IsCreditIndex = TrHeader.find("th[data-field='Credit']").index();
    var IsPaymentIndex = TrHeader.find("th[data-field='IsPayment']").index();
    var ProcessStatus = TrHeader.find("th[data-field='ProcessStatus']").index();
    $("#btnSaveCharges").hide()

    $("div[id$='divMainGrid']").find("div[class^='k-grid-content'] tbody tr").each(function (row, tr) {

        if ($(tr).find("td:eq(" + IsESSIndex + ")").text() == "true" && $(tr).find("td:eq(" + IsPaymentIndex + ")").text() == "true") {
            $(tr).find('input[type="button"][value="C"]').prop('class', 'completeprocess');
            $(tr).find('input[type="button"][value="C"]').attr("title", "CASH")
        }
        else if ($(tr).find("td:eq(" + IsPaymentIndex + ")").text() == "true" && $(tr).find("td:eq(" + IsESSIndex + ")").text() == "false") {
            $(tr).find('input[type="button"][value="C"]').prop('class', 'partialprocess');
            $(tr).find('input[type="button"][value="C"]').attr("title", "CASH")

        } else if ($(tr).find("td:eq(" + IsCreditIndex + ")").text() == "true") {
            $(tr).find('input[type="button"][value="C"]').prop('class', 'completeprocess');
            $(tr).find('input[type="button"][value="C"]').attr("title", "CREDIT")

        }


        if ($(tr).find("td:eq(" + ProcessStatus + ")").text() == "1") {
            $(tr).find('input[type="button"][value="R"]').prop('class', 'completeprocess');;
        }
        var UHFReceiptNo = TrHeader.find("th[data-field='UHFReceiptNo']").index();
        var UCRReceiptNo = TrHeader.find("th[data-field='UCRReceiptNo']").index();

        $(this).unbind("click").bind("click", function () {
            var recId = $(tr).find("input[type='radio']").val();
            if (!(recId == undefined || recId == "")) {
                $(tr).find("input[type='radio']").attr("checked", true);
                if ($(tr).find("td:eq(" + UHFReceiptNo + ")").text() == "") {
                    $(".tool-items").find(".actionSpan").each(function () {
                        if ($(this).text().toUpperCase() == "PRINT UHF") {
                            $(this).closest("a").css("display", "none");
                        }
                    });
                } else if ($(tr).find("td:eq(" + UHFReceiptNo + ")").text() != "") {
                    $(".tool-items").find(".actionSpan").each(function () {
                        if ($(this).text().toUpperCase() == "PRINT UHF") {
                            $(this).closest("a").css("display", "block");
                        }

                    });
                }
                if ($(tr).find("td:eq(" + UCRReceiptNo + ")").text() == "") {
                    $(".tool-items").find(".actionSpan").each(function () {
                        if ($(this).text().toUpperCase() == "PRINT UCR") {
                            $(this).closest("a").css("display", "none");
                        }

                    });
                } else if ($(tr).find("td:eq(" + UCRReceiptNo + ")").text() != "") {
                    $(".tool-items").find(".actionSpan").each(function () {
                        if ($(this).text().toUpperCase() == "PRINT UCR") {
                            $(this).closest("a").css("display", "block");
                        }

                    });
                }

            }
        });
    });


}
function BindGridData(SNo, obj) {
    var trHRow = $(obj).closest('tr').closest("div.k-grid").find("div.k-grid-header");
    var IsInboundIndexc = trHRow.find("th[data-field='IsInbound']").index();
    var IsInboundc = $(obj).closest('tr').find('td:eq(' + IsInboundIndexc + ')').text();
    if ($(obj).attr("value") == "C") {
        if (IsInboundc.trim() == "Transfer") {
            ShowMessage('warning', 'Information!', "From Other No Charges! ", "bottom-right");
            $("#tblLUCESS").html("");
            return;
        }
        else {
            var UCRReceiptIndex = trHRow.find("th[data-field='UCRReceiptNo']").index();
            UCRReceiptNo = $(obj).closest('tr').find('td:eq(' + UCRReceiptIndex + ')').text();

            var IsESSIndex = trHRow.find("th[data-field='IsESS']").index();
            var IsESSChk = $(obj).closest('tr').find('td:eq(' + IsESSIndex + ')').text();


            var IsPayment = trHRow.find("th[data-field='IsPayment']").index();
            var IsPaymentChk = $(obj).closest('tr').find('td:eq(' + IsPayment + ')').text();

            var IsCredit = trHRow.find("th[data-field='Credit']").index();
            var IsCreditChk = $(obj).closest('tr').find('td:eq(' + IsCredit + ')').text();


            var UHFReceiptNondex = trHRow.find("th[data-field='UHFReceiptNo']").index();
            var UHFReceiptNo = $(obj).closest('tr').find('td:eq(' + UHFReceiptNondex + ')').text();

            if (UHFReceiptNo != "" && IsInboundc.trim() == "Received") {
                BindESS(SNo, obj, IsESSChk, IsPaymentChk, IsCreditChk);
                $("#UldTransferPrintContent").html('')
                $("#divLUCESS").css("display", "block");
                $("#divLUCInformation").css("display", "none");
                //$("#btnSaveCharges").show();
                $("#divUCRPrint").html('')
                if (IsESSChk == "true") {
                    $("#btnSaveCharges").hide()
                } else {
                    $("#btnSaveCharges").show()
                }
            }
            else {
                ShowMessage('warning', 'Information!', "Charges are not applicable for Airline to Airline!!", "bottom-right");
                $("#tblLUCESS").html("");
                return;
            }
        }
        PageRightsCheckLucIn()
    }
    else if ($(obj).attr("value") == "R") {
        var trHRow = $(obj).closest('tr').closest("div.k-grid").find("div.k-grid-header");
        var UCRReceiptIndex = trHRow.find("th[data-field='ULDNumber']").index();
        var ULDNumber = $(obj).closest('tr').find('td:eq(' + UCRReceiptIndex + ')').text();
        UldInfomationIN(SNo, obj);
        $("#UldTransferPrintContent").html('')
        $("#divLUCInformation").css("display", "block");
        $("#divLUCESS").css("display", "none");
        $("#btnSaveCharges").hide();
        $("#divUCRPrint").html('')
        PageRightsCheckLucIn()
    }
}
function BindESS(SNo, HeadName, IsESSChk, IsPaymentChk, IsCreditChk) {
    $("#divLUCUpload").hide();
    $("#divLUCInformation").hide();
    $("#tblLUCESS").show();
    if ($(HeadName).closest('tr').find('td:eq(' + $(HeadName).closest('tr').closest("div.k-grid").find("div.k-grid-header").find('th[data-field="IsPayment"]').index() + ')').text() == "false") {
        //  var button = '';
        $("#btnSave").hide();
        ///  $("#tblLUCESS").after(button);
    }
    else {
        $("#btnSave").hide();
    }
    ULDTransferSNo = SNo;
    BindCharges(IsESSChk, IsPaymentChk, IsCreditChk);
    //BindCTMCharges(HeadName);
}
function BindControls() {
    $("#Text_IssuedDate").kendoDatePicker();
    $("#Text_Receiveddate").kendoDatePicker();
    //$("#Text_IssuedTime").kendoTimePicker();

    // Changes by Vipin Kumar
    //cfi.AutoComplete("ULD", "ULDNumber", "vwLUCULD", "SNo", "ULDNumber", ["ULDNumber"], null, "contains", ",");
    cfi.AutoCompleteV2("ULD", "ULDNumber", "ULD_Transfer_ULD", null, "contains", ",");
    // Ends
    var dbtableName = "tblLUC";

}
function PutHyphenINTime() {


    var x = $("#Text_ReceivedTime").val();
    if (x.length == 2) {
        $("#Text_ReceivedTime").val($("#Text_ReceivedTime").val() + ":");
    }

}
function CheckTimeFormat() {

    var GEtTime = GetGlobalTime(userContext.AirportCode)
    var ITimef = Gtime[1].split(":");
    if ($("#Text_ReceivedTime").val() != '') {
        var x = $("#Text_ReceivedTime").val();
        var value = 0;
        for (var i = 0; i < x.length - 1; i++) {
            var firstno = x.charAt(i);
            if (i == 0)
                if (firstno >= 3)
                    value = 1;
            if (i == 1)
                if (x.charAt(0) == 0) {

                }
                else if (firstno >= 4 && x.charAt(0) != 1)
                    value = 1;
            if (i == 2)
                if (firstno >= 6)
                    value = 1;
        }

        var IssuedTime = $("#Text_ReceivedTime").val();
        var Time = IssuedTime.split(":")[1]
        if (parseInt(Time) > 60) {
            $("#Text_ReceivedTime").val("");
            ShowMessage('info', '', "Please enter time in correct format");
            return;
        }
        //ADDED BY SHIVALI THAKUR
        var IssuedDate = $("span[id='Text_Issuedate']").text();
        var ReceivedDate = $("#Text_Receiveddate").val();
        var ReceivedTime = $("#Text_ReceivedTime").val();
        var ReceivedTime1 = ReceivedTime.split(":");
        checkfuturedate();
        var v = ITime.split(":");
        if (IssuedDate == ReceivedDate) {
            if (ReceivedTime1[0] <= v[0] && ReceivedTime1[1] <= v[1]) {
                $("#Text_ReceivedTime").val('');
                ShowMessage('warning', 'Information!', "Received time must be greater than Issued time and less than the Current time.", "bottom-right");
                return;
            }
            if (ReceivedTime1[0] >= ITimef[0] && ReceivedTime1[1] > ITimef[1]) {
                $("#Text_ReceivedTime").val('');
                ShowMessage('warning', 'Information!', "Received time must be greater than Issued time and less than the Current time.", "bottom-right");
                return;
            }
        }
        if (value == 1 || x.length != 5 || $("#Text_ReceivedTime").val().search(':') == -1) {
            $("#Text_ReceivedTime").val('');
            ShowMessage('warning', 'Information!', "Please enter correct format Time!", "bottom-right");
            return;
        }
        if (ReceivedDate == checkfuturedateDDMMYY()) {

            var ReceivedTime = $("#Text_ReceivedTime").val();
            var ReceivedTime1 = ReceivedTime.split(":");
            var GEtTime = GetGlobalTime(userContext.AirportCode)
            var ITimef = Gtime[1].split(":");
            if (ReceivedTime1[0] >= ITimef[0] && ReceivedTime1[1] > ITimef[1]) {
                $("#Text_ReceivedTime").val('');
                ShowMessage('warning', 'Information!', "Received time must be greater than Issued time and less than the Current time.", "bottom-right");
                return;
            }

        }

    }
}
function Hours24Formate() {
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
    var CurrTime = cur_hour + ":" + curr_min + ":" + curr_sec + ":" + time_t;
    var Final = CurrTime.split(":")
    if (Final[3].trim() == "AM") {
        $("#Text_ReceivedTime").val(cur_hour + ":" + curr_min)
    } else if (Final[3].trim() == "PM") {
        if (cur_hour == "1") {
            $("#Text_ReceivedTime").val("13" + ":" + curr_min)
        }
        if (cur_hour == "2") {
            $("#Text_ReceivedTime").val("14" + ":" + curr_min)
        }
        if (cur_hour == "3") {
            $("#Text_ReceivedTime").val("15" + ":" + curr_min)
        }
        if (cur_hour == "4") {
            $("#Text_ReceivedTime").val("16" + ":" + curr_min)
        }
        if (cur_hour == "5") {
            $("#Text_ReceivedTime").val("17" + ":" + curr_min)
        }
        if (cur_hour == "6") {
            $("#Text_ReceivedTime").val("18" + ":" + curr_min)
        }
        if (cur_hour == "7") {
            $("#Text_ReceivedTime").val("19" + ":" + curr_min)
        }
        if (cur_hour == "8") {
            $("#Text_ReceivedTime").val("20" + ":" + curr_min)
        }
        if (cur_hour == "9") {
            $("#Text_ReceivedTime").val("21" + ":" + curr_min)
        }
        if (cur_hour == "10") {
            $("#Text_ReceivedTime").val("22" + ":" + curr_min)
        }

        if (cur_hour == "11") {
            $("#Text_ReceivedTime").val("23" + ":" + curr_min)
        }
        if (cur_hour == "12") {
            $("#Text_ReceivedTime").val("24" + ":" + curr_min)
        }
    }

}
function GetGlobalTime(AirportCode) {
    var Ret = "";
    $.ajax({
        url: "Services/Export/UldTransfer/LucInService.svc/GetGlobalTime",
        async: false, type: "GET"
        , dataType: "json",
        data: { AirportCode: AirportCode }
        , contentType: "application/json;charset=utf-8", cache: false, success: function (response) {
            if (response.length > 0) {
                var v = $.parseJSON(response);

                var FV = v.Table0[0].GetGlobalTime
                var FFV = FV.split(" ")
                var FFFV = FFV[1].split(":")
                Gtime = FFV;
                //  $('#Text_ReceivedTime').val(FFFV[0] + ":" + FFFV[1]);
                Ret = FFFV[0]
            }


        },
        error: function (xhr) {

        }
    });
    return Ret
}
function CancelDetails() {
    $("#divLUCInformation").html('');
    $("#tblLUC").html('');
    $('#tblLUCUpload').html('');
    $("#btnSave").hide();
    $("#divUCRPrint").hide();
    $("#tblLUCESS").hide();
    $("#divLUCInformation").hide();
}
function CancelDetailsWithHREF() {
    CancelDetails();
    window.location.href = "http://" + location.host + "/" + window.location.pathname + "?Module=Shipment&Apps=LUCIN&FormAction=INDEXVIEW";
}
function GETReceipt() {
    $("#divLUCInformation").show();
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "Services/Export/UldTransfer/LucInService.svc/GetReceipt",
        success: function (response) {
            if (response.length > 0) {
                var v = $.parseJSON(response);
                //if (v[0].UCRReceiptNo != '' && v[0].UHFReceiptNo != '')
                //{
                //  $('#span_ControlReceiptNo').html(v[0].ReceiptNo);
                $('#Span_Originator').html(v[0].UserName);
                $('#span_SendLocLHR').html(v[0].AirportCode);
                //    $('#hdnControlReceiptNo').val(v[0].ReceiptNo);
                $('#hdnOriginator').val(v[0].UserName);
                $('#hdnSendLocLHR').val(v[0].AirportCode);
                $('#Text_IssuedTime').val(v[0].STime);
                //$('#Text_UCRNumber').val(v[0].UCRReceiptNo);
                //$('#Text_UHFNumber').val(v[0].UHFReceiptNo);
                //}
            }
        }
    });
}
function GridReadAction(obj) {
    EditSNo = $(obj).attr("href").split('=')[1];

    //$.ajax({
    //    type: "POST",
    //    contentType: "application/json; charset=utf-8",
    //    dataType: "json",
    //    url: "Services/Export/UldTransfer/LucInService.svc/EditData/" + EditSNo,
    //    success: function (r) {
    //        NewClick(EditSNo);
    //        debugger;
    //        $('#Bucr').attr("checked", r.Bucr);
    //        $('#Buhf').attr("checked", r.Buhf);
    //        $('#hdnOriginator').val(r.hdnOriginator);
    //        $('#Span_Originator').html(r.hdnOriginator);
    //        $('#Text_Name').val(r.Text_Name);
    //        $('#Text_IDNumber').val(r.Text_IDNumber);
    //        $('#Text_MobileNo').val(r.Text_MobileNo);
    //        $(".tool-items").fadeOut();
    //    }
    //});
    $.ajax({
        url: "HtmlFiles/Export/UldTransfer/UldTransfer.html", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            //  alert('Test')
            $('#divLUCInformation').html('');
            $("#tblLUC").html('');
            $('#tblLUCUpload').html('');
            $("#divUCRPrint").show();
            $('#btnSave').hide();
            $("#divUCRPrint").html(result);
            $("#divLUCESS").css("display", "none");

            GetUldTransferUcrData(EditSNo);
            //cfi.PopUp(result, "Details", 1000, null, null, 100);


            //$("#divUCRPrint").css("overflow", "auto");
            //$("#divUCRPrint").css("border", "1px solid black;");
            //$("#divUCRPrint").css("width", "95%");
            //$("#divUCRPrint").css("height", "400PX");
            //cfi.PopUp("divUCRPrint", "Details", 1000, null, null);

        }
    });

}
function GridReadActionNew(obj) {
    EditSNo = $(obj).attr("href").split('=')[1];
    //$.ajax({
    //    type: "POST",
    //    contentType: "application/json; charset=utf-8",
    //    dataType: "json",
    //    url: "Services/Export/UldTransfer/LucInService.svc/EditData/" + EditSNo,
    //    success: function (r) {
    //        NewClick(EditSNo);
    //        debugger;
    //        $('#Bucr').attr("checked", r.Bucr);
    //        $('#Buhf').attr("checked", r.Buhf);
    //        $('#hdnOriginator').val(r.hdnOriginator);
    //        $('#Span_Originator').html(r.hdnOriginator);
    //        $('#Text_Name').val(r.Text_Name);
    //        $('#Text_IDNumber').val(r.Text_IDNumber);
    //        $('#Text_MobileNo').val(r.Text_MobileNo);
    //        $(".tool-items").fadeOut();
    //    }
    //});   
    $.ajax({
        url: "HtmlFiles/Export/UldTransfer/ULDHandOver.html", async: false, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            //  alert('Test')
            //$("#tblAdd").hide();
            //$("#divFooter").hide();
            //$("#divLUCUpload").hide();
            $('#divLUCInformation').html('');
            $("#tblLUC").html('');
            $('#tblLUCUpload').html('');
            $("#divUCRPrint").show();
            $('#btnSave').hide();
            $("#divLUCESS").css("display", "none");
            // cfi.PopUp("UldTransferPrintContent", "Details");
            $("#divUCRPrint").html(result);
            GetUldHandOverRecordData(EditSNo);
            // $('#divUCRPrint')[0].scrollIntoView(true);
            // $(document).scrollTo('#divUCRPrint');        
            //$("#divUCRPrint").css("overflow", "auto");
            //$("#divUCRPrint").css("border", "1px solid black;");
            //$("#divUCRPrint").css("width", "100%");
            //$("#divUCRPrint").css("height", "400PX");
        }
    });
}
function GetUldTransferUcrData(EditSNo) {
    $.ajax({
        url: "./Services/Export/UldTransfer/LucInService.svc/GetUldTransferData?Sno=" + EditSNo, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            var FinalData = ResultData.Table0;
            var FinalData1 = ResultData.Table1;
            var FinalData2 = ResultData.Table2;
            var AirlineLogo = "";
            $("#AirlineLogo").attr('src', '');
            if (FinalData.length > 0) {
                if (FinalData[0].AirlineLogo == "") {
                    $("#AirlineLogo").attr('src', '');
                } else {
                    AirlineLogo = "../BLOBUploadAndDownload/DownloadFromBlob/?filenameOrUrl=" + FinalData[0].AirlineLogo;
                    $("#AirlineLogo").attr('src', AirlineLogo);
                }
                //$('#spnOriginator').text(FinalData[0].Originator)
                $('#spnOriginator').text(FinalData[0].LoginName)
                //$('#spnControlReceiptNo').text(FinalData[0].UCRReceiptNo)
                //$('#spnUCRReceiptNo').text(FinalData[0].UCRReceiptNo)
                $('#spnControlReceiptNo').text(FinalData[0].UCRReceiptNo)
                if (FinalData[0].UCRReceiptNo != "") {
                    var CRNSplit = FinalData[0].UCRReceiptNo.split('-');
                    $("#spnCRNCarrierCode1").text(CRNSplit[0].charAt(0));
                    $("#spnCRNCarrierCode2").text(CRNSplit[0].charAt(1));
                    $("#spnCRNCarrierCode3").text(CRNSplit[0].charAt(2));

                    for (var i = CRNSplit[1].length; i >= 0; i--) {
                        $("#spnCRNumber" + i).text(CRNSplit[1].charAt(i - 1));
                    }
                }
                if (FinalData[0].IssuedDateTime != "") {
                    var CRNSplit1 = FinalData[0].IssuedDateTime.split('/');
                    $('#spnTranferDateDay1').text(CRNSplit1[0].charAt(0))
                    $('#spnTranferDateDay2').text(CRNSplit1[0].charAt(1))
                    $('#spnTranferDateMonth1').text(CRNSplit1[1].charAt(0))
                    $('#spnTranferDateMonth2').text(CRNSplit1[1].charAt(1))
                    $('#spnTranferDateYear1').text(CRNSplit1[2].charAt(0))
                    $('#spnTranferDateYear2').text(CRNSplit1[2].charAt(1))
                    $('#spnTranferDateYear3').text(CRNSplit1[2].charAt(2))
                    $('#spnTranferDateYear4').text(CRNSplit1[2].charAt(3))

                }

                if (FinalData[0].TransferPoint != "") {
                    var CRNSplit1 = FinalData[0].TransferPoint;
                    $('#spnTransferPoint1').text(CRNSplit1[0].charAt(0))
                    $('#spnTransferPoint2').text(CRNSplit1[1].charAt(0))
                    $('#spnTransferPoint3').text(CRNSplit1[2].charAt(0))
                }

                if (FinalData[0].time != "") {
                    var CRNSplit1 = FinalData[0].time;
                    $('#spnTransferTime1').text(CRNSplit1[0].charAt(0))
                    $('#spnTransferTime2').text(CRNSplit1[1].charAt(0))
                    $('#spnTransferTime3').text(CRNSplit1[3].charAt(0))
                    $('#spnTransferTime4').text(CRNSplit1[4].charAt(0))
                }





                $('#spnLoginName').text(FinalData[0].LoginName)
                $('#spnTransferredAgentName').text(FinalData[0].TransfredBy)
                $('#spnTransferPartyName').text(FinalData[0].TransfredBy)
                $('#spnULDReleaseTransferringpartyName').text(FinalData[0].TransfredBy)
                $('#spnULDReturnTransferringpartyName').text(FinalData[0].TransfredBy)
                $('#spnTransferPartyContact').text(FinalData[0].TransferPartyContact)
                $('#spnTransferPartyEmailAddress').text(FinalData[0].TransferPartyEmailAddress)

                $('#spnLoginBranchAddress').text(FinalData[0].logineAddress)
                $('#spnTransferredAgentAddress').text(FinalData[0].TrasferAgentAddress)
                $('#spnTransferedBy').text(FinalData[0].TransfredBy)
                $('#spnRecivedBy').text(FinalData[0].RecivedBy)
                $('#spnReceivePartyName').text(FinalData[0].RecivedBy)
                $('#spnULDReleaseReceivingPartyName').text(FinalData[0].RecivedBy)
                $('#spnULDReturnReceivingPartyName').text(FinalData[0].RecivedBy)
                $('#spnReceivePartyContact').text(FinalData[0].ReceivePartyContact)
                $('#spnReceivePartyEmailAddress').text(FinalData[0].ReceivePartyEmailAddress)


                $('#spnTranferDate').text(FinalData[0].IssuedDateTime)
                $('#spnTransferTime').text(FinalData[0].time)
                $('#spnTransferPoint').text(FinalData[0].TransferPoint)
                $('#spnRemarks').text(FinalData[0].Remarks)
            }
            if (FinalData1.length > 0) {
                var str = "";
                $(FinalData2).each(function (row, tr) {
                    str = str + (tr.ConsumableName + '(' + tr.Quantity + ')') + ','

                })
                str = str.substring(0, str.length - 1);
                var i = 0
                var j = 0;
                var rec = FinalData1.length;
                var divcount = parseInt(rec / 10);
                var remain = parseInt(rec % 10);
                //$('#UldTransferPrintContent').after('<br/> <div id="pagebreak" style="display: block; page-break-before: always;"></div>')
                //$('#pagebreak').after('<div>aaaaaaaaaaa</div>').after(' <div id="pagebreak" style="display: block; page-break-before: always;"></div>').after('<div>aaaaaaaaaaa</div>')


                for (var a = 1; a < divcount; a++) {

                    var div = $('#UldTransferPrintContent').html();
                    $('#UldTransferPrintContent').after('<div style="display: block; page-break-before: always;"></div><br/>' + div)
                }
                if (rec > 10 && remain > 0) {
                    var div = $('#UldTransferPrintContent').html();
                    $('#UldTransferPrintContent').after('<div style="display: block; page-break-before: always;"></div><br/>' + div)
                }


                var noOfDiv = $('#divUCRPrint div').length - 1;
                //alert(noOfDiv)

                //for (n = 2; n <= noOfDiv; n++) {
                var n = 2;
                $(FinalData1).each(function (row, tr) {
                    i = parseInt(i) + 1
                    j = parseInt(j) + 1
                    if (j <= 10) {
                        //$('#trFirst').before
                        $('#divUCRPrint div:eq(' + n + ')').find('tr[id="trFirst"]').before('<tr>' +
                            '<td class=" " align="center" style="border: 1px solid gray;border-collapse: collapse;background-color:aliceblue; font-size:10pt;">' +
                            i + '</td>' +
                            '<td class=" " align="center" style="border: 1px solid gray;border-collapse: collapse; font-size:10pt;">' + tr.ULDCode.charAt(0) + '</td>' +
                            '<td class=" " align="center" style="border: 1px solid gray;border-collapse: collapse; font-size:10pt;">' + tr.ULDCode.charAt(1) + '</td>' +
                            '<td class=" " align="center" style="border: 1px solid gray;border-collapse: collapse; font-size:10pt;">' + tr.ULDCode.charAt(2) + '</td>' +
                            '<td class=" " align="center" style="border: 1px solid gray;border-collapse: collapse; font-size:10pt;">' + tr.ULDNumber.charAt(0) + '</td>' +
                            '<td class=" " align="center" style="border: 1px solid gray;border-collapse: collapse; font-size:10pt;">' + tr.ULDNumber.charAt(1) + '</td>' +
                            '<td class=" " align="center" style="border: 1px solid gray;border-collapse: collapse;font-size:10pt;">' + tr.ULDNumber.charAt(2) + '</td>' +
                            '<td class=" " align="center" style="border: 1px solid gray;border-collapse: collapse;font-size:10pt;">' + tr.ULDNumber.charAt(3) +
                            '</td>' +
                            '<td class=" " align="center" style="border: 1px solid gray;border-collapse: collapse;font-size:10pt;">' + tr.ULDNumber.charAt(4) +
                            '</td>' +
                            '<td class=" " align="center" style="border: 1px solid gray;border-collapse: collapse;font-size:10pt;">' + tr.OwnerCode.charAt(0) +
                            '</td>' +
                            '<td class=" " align="center" style="border: 1px solid gray;border-collapse: collapse;font-size:10pt;">' + tr.OwnerCode.charAt(1) +
                            '</td>' +
                            '<td class=" " align="center" style="border: 1px solid gray;border-collapse: collapse;font-size:10pt;">' + tr.OwnerCode.charAt(2) +
                            '</td>' +
                            '<td>&nbsp;</td>' +
                            '<td class=" " align="center" style="border: 1px solid gray; border-collapse: collapse;font-size:10pt;">' + '' +
                            '</td>' +
                            '<td class=" " align="center" style="border: 1px solid gray; border-collapse: collapse;font-size:10pt;">' + '' +
                            '</td>' +
                            '<td class=" " align="center" style="border: 1px solid gray; border-collapse: collapse;font-size:10pt;">' + '' +
                            '</td>' +
                            '<td class=" " align="center" style="border: 1px solid gray; border-collapse: collapse;font-size:10pt;">' + '' +
                            '</td>' +
                            '<td>&nbsp;</td>' +
                            '<td class=" " align="center" style="border: 1px solid gray; border-collapse: collapse;font-size:10pt;">' + tr.FinalDestination.charAt(0) +
                            '</td>' +
                            '<td class=" " align="center" style="border: 1px solid gray; border-collapse: collapse;font-size:10pt;">' + tr.FinalDestination.charAt(1) +
                            '</td>' +
                            '<td class=" " align="center" style="border: 1px solid gray; border-collapse: collapse;font-size:10pt;">' + tr.FinalDestination.charAt(2) +
                            '</td>' +
                            '<td>&nbsp;</td>' +
                            '<td class=" " align="center" style="border: 1px solid gray; border-collapse: collapse;font-size:10pt;">' + tr.DamurrageCode.charAt(0) +

                            '</td>' +
                            '<td class=" " align="center" style="border: 1px solid gray; border-collapse: collapse;font-size:10pt;">' + tr.DamurrageCode.charAt(1) +
                            '</td>' +
                            '<td class=" " align="center" style="border: 1px solid gray; border-collapse: collapse;font-size:10pt;">' + tr.DamurrageCode.charAt(2) +

                            '</td>' +
                            '<td>&nbsp;</td>' +
                            '<td class=" " align="center" style="border: 1px solid gray; border-collapse: collapse;font-size:10pt;">' + '' +
                            '</td>' +
                            '<td>&nbsp;</td>' +
                            '<td class=" " align="center" style="border: 1px solid gray; border-collapse: collapse;font-size:10pt;">' + tr.OdnlCode.charAt(0) +
                            '</td>' +
                            '<td class=" " align="center" style="border: 1px solid gray; border-collapse: collapse;font-size:10pt;">' + tr.OdnlCode.charAt(1) +
                            '</td>' +
                            '<td>&nbsp;</td>' +
                            '<td class=" " align="center" style="border: 1px solid gray;border-collapse: collapse;font-size:10pt;">' + tr.DamurrageDesc +
                            '</td>' +
                            '</tr>')

                    }
                    if (j <= 8) {
                        $('#divUCRPrint div:eq(' + n + ')').find('tr[id="trLast"]').prev('tr').remove()
                        // $('#trLast').prev('tr').remove();
                    }
                    if (j == 10) {
                        $('#divUCRPrint div:eq(' + n + ')').find('tr[id="trLast"]').remove()
                        $('#divUCRPrint div:eq(' + n + ')').find('tr[id="trFirst"]').remove()
                        n = parseInt(n) + 2;
                        j = 0;


                    }

                    //if (i == 10) {

                    //        var div = $('#UldTransferPrintContent').html();
                    //        $('#UldTransferPrintContent').after(div)
                    //        j = 0;


                    //    }


                    //    //$('#spnUldType' + i).text(tr.ULDCode)
                    //    //$('#spnUldNbr' + i).text(tr.ULDNumber)
                    //    //$('#spnOwnerCode' + i).text(tr.OwnerCode)
                    //    //$('#spnUldEqp' + i).text(str)
                    //    //$('#spnFinalDest' + i).text(tr.FinalDestination)
                    //    //$('#spnDemurrageCode' + i).text(tr.DamurrageCode)
                    //    //$('#spnDam' + i).text('')
                    //    //$('#spnOdnlCode' + i).text(tr.OdnlCode)
                    //    //$('#spnDamageDesc' + i).text('')

                    //  //  $('#trLast').prev('tr').remove();



                })

                //}
            }
        },
        error: {

        }
    });

}
function GetUldHandOverRecordData(EditSNo) {
    /*----------Change by pankaj kumar ishwar on 22-7-2017 for uld handover form print----------*/
    var str22 = "";
    $.ajax({
        url: "./Services/Tariff/HandlingChargesService.svc/GetUldHandOverTransfer?Sno=" + EditSNo, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            var finaltabl0 = ResultData.Table0;
            var finaltabl1 = ResultData.Table1;
            var AirlineLog = "";
            $("#ImgLogo").attr('src', '');
            if (finaltabl0.length > 0) {
                if (finaltabl0[0].AirlineLogo == "") {
                    $("#ImgLogo").attr('src', '');
                } else {
                    AirlineLogo = "../BLOBUploadAndDownload/DownloadFromBlob/?filenameOrUrl=" + finaltabl0[0].AirlineLogo;
                    $("#ImgLogo").attr('src', AirlineLogo);
                }
                $("span#spntrf1").text(finaltabl0[0].AirportCode).text();
                $("span#UFH1").text(finaltabl0[0].UHFReceiptNo).text();
                $("span#nameid").text(finaltabl0[0].Receivedname).text();
                $("span#addressid").text(finaltabl0[0].ReceivedAddress).text();
                $("span#Transfernameid").text(finaltabl0[0].UserName).text();
                // $("span#Transferaddressid").text(finaltabl0[0].TransferAddress).text();
                $("span#Usernameid").text(finaltabl0[0].UserName).text();
                $("span#UserAddressid").text(finaltabl0[0].EMailID).text();
                $("span#LoadedBy").text(finaltabl0[0].LoadedBy).text();
                $("#Date").text((finaltabl0[0].IssuedDate) + '       ' + (finaltabl0[0].Time));
                $("#Remarks").text(finaltabl0[0].Remarks).text();
                $("#Dates").text((finaltabl0[0].ReturnDate) + '       ' + (finaltabl0[0].Times));
                $("#Remarkss").text(finaltabl0[0].ReturnRemarks).text();
                day = finaltabl0[0].Day
                month = finaltabl0[0].Month
                year = finaltabl0[0].Year
                var myTable = "<table style='width: 60%; border:1px solid black;' align='center'><tr><td colspan='4' align='right'><span><b>ULD Numbers</b></span></td>"
                myTable += "<td colspan='4' align='right'><span><b>Condition Code</b></span></td></tr>"

                //for (var i = 1; i = finaltabl0.length; i++) {
                myTable += "<tr><td colspan='2' style='border:double;' align='center'>" + (finaltabl0[0].ULDCode) + "</td><td colspan='2' style='border:double;' align='center'>" + (finaltabl0[0].ULDNumber) + "</td><td colspan='2' style='border:double;' align='center'>" + (finaltabl0[0].OwnerCode) + "</td><td colspan='2' style='border:double;' align='center'>" + (finaltabl0[0].IsDamageds) + "</td></tr>";
                $("#spnDateoftransfer").text((finaltabl0[0].IssuedDate) + '       ' + (finaltabl0[0].Time));
                $("#totalunits").text(finaltabl0.length);
                $("#totalunit").text(finaltabl0.length);
                //}

                myTable += "</table>";

                $('#ulddetail').append(myTable);
            }
            if (finaltabl1.length > 0) {
                $(finaltabl1).each(function (row, tr) {
                    if (tr.ConsumableNameQty != undefined) {
                        str22 = str22 + (tr.ConsumableNameQty) + ','
                    }
                })
                $('tr#Consumid').after("<tr style='border:1px solid black;'><td class='tdstyle' style='width:12%;padding:7px;'>" + str22 + "</td></tr>")
            }
        },
        error:
            {
            }
    });
}
function funPrintUCRData(divID) {

    window.open("HtmlFiles/Export/UldTransfer/UldTransfer-Print.html?EditSNo=" + btoa(EditSNo) + "&pagename=" + btoa("A") + "&tnc=" + btoa('Print'));
    //// var EditSNo = $('#divMainGrid .k-grid-content tbody tr td:eq(0)').find('input[type="radio"]:checked').val()

    //$.ajax({
    //    url: "./Services/Export/UldTransfer/LucInService.svc/GetUCRPrintCount?Sno=" + EditSNo, async: false, type: "get", dataType: "json", cache: false,
    //    contentType: "application/json; charset=utf-8",
    //    success: function (result) {
    //    }
    //})
    //$("#" + divID + " #btnUCRPrint").css("display", "none");
    //var divContents = $("#" + divID).html();
    //var printWindow = window.open('', '', '');
    //printWindow.document.write(divContents);
    //printWindow.document.close();
    //printWindow.print();
    ////$("#" + divID + " #btnUCRPrint").css("display", "block").css("text-align", "right");
    //$("#" + divID + " #btnUCRPrint").removeAttr('style');
}
function FunPrintDataNew(divId) {
    window.open("HtmlFiles/Export/UldTransfer/ULDHandOver-Print.html?EditSNo=" + btoa(EditSNo) + "&pagename=" + btoa("A") + "&tnc=" + btoa('Print'));
    // var EditSNo = $('#divMainGrid .k-grid-content tbody tr td:eq(0)').find('input[type="radio"]:checked').val()

    //$.ajax({
    //    url: "./Services/Tariff/HandlingChargesService.svc/GetAndUpdateUHFPrint?Sno=" + EditSNo,
    //    async: false,
    //    type: "get",
    //    dataType: "json",
    //    cache: false,
    //    contentType: "application/json; charset=utf-8",
    //    success: function (result) {
    //    }
    //})
    //var divContents = $("#" + divId).html();
    //var printWindow = window.open('', '', '');
    //printWindow.document.write(divContents);
    //printWindow.document.close();
    //printWindow.print();
}
function ExtraCondition(textId) {
    var f = cfi.getFilter("AND");
    if (textId.indexOf("Text_ULD") >= 0) {
        cfi.setFilter(f, "SNo", "notin", $("#Text_ULD").data("kendoAutoComplete").key());
        cfi.setFilter(f, "CurrentCityCode", "eq", userContext.CityCode);
    }
    return cfi.autoCompleteFilter([f]);
}
var footer = '<div id="divFooter" class="divFooter" style="height: 0px; padding-bottom: 30px; display: block;"><div><table style="margin-left:20px;"><tbody><tr><td> &nbsp; &nbsp;</td><td> &nbsp; &nbsp;</td><td><input type="button" style="float:right;display:none;" onclick="SaveDetails(0)" id="btnSave"  value="Save" class="btn btn-success"></td><td><input type="button" value="Save" class="btn btn-success" onClick="SaveLUCCharges()" id="btnSaveCharges"></td><td><button class="btn btn-block btn-danger btn-sm" id="btnCancel" onclick="CancelDetailsWithHREF()">Cancel</button></td></tr></tbody></table> </div></div>';
//ESSCHARGES
var flags = 0;
var weight = 0;
var MendatoryHandlingCharges = new Array();

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
var dourl = 'Services/AutoCompleteService.svc/LUCAutoCompleteDataSource';
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
    $("span#ChargeName_0").text('Damage Charge');
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
    $('#spnRate').hide();
    $('#spnPValue').hide();
    $(elem).find("input[id^='WaveOff']").hide();
    $(elem).find("input[id^='Rate']").hide();
    $(elem).find("input[id^='_tempPValue']").hide();
    $(elem).find("input[id^='_tempSValue_0']").hide();
}
function ReBindCTMChargesItemAutoComplete(elem, mainElem) {
    $("span#ChargeName_0").text('Damage Charge');
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
    $('#spnRate').hide();
    $('#spnPValue').hide();
    $(elem).find("input[id^='WaveOff']").hide();
    $(elem).find("input[id^='Rate']").hide();
    $(elem).find("input[id^='_tempPValue']").hide();
    $(elem).find("input[id^='_tempSValue_0']").hide();
}
var pValue = 0;
var sValue = 0;
var type = 'ULD';

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

var Checkadd = 0;
function Delete() {


    $("#DamageRow").hide()
    $("input#ChargeName-2").val("");
    $('input#Amount-2').val("");
    $('input#TotalTaxAmount-2').val("");
    $('input#TotalAmount-2').val("");
    $('label#Remarks').text("");
    $("#Del").hide()
    $("label#ChargeName-2").text("");
    $("#DamageRow").remove()
    $("#Add").show()

}
var newRowContent = '<tr id="DamageRow" style="display:none" ><td align="center" style="border: solid 1px #DDEEEE;"><label id="ChargeName-2"></label></td>'
    + '<td align="center" style="border: solid 1px #DDEEEE;"><input type="hidden" id="pBasis-2" /><input type="text" class="txtDisabled1" maxlength="8"   id="Amount-2" style="width:100px" /></td>'
    + '<td align="center" style="border: solid 1px #DDEEEE;"><input type="hidden" id="sBasis-2"/><input type="text" class="txtDisabled1" maxlength="4"  id="TotalTaxAmount-2" style="width:100px" /></td>'
    + '<td align="center" style="border: solid 1px #DDEEEE;"><input type="text" disabled="disabled" style="border:solid 0px #DDEEEE" id="TotalAmount-2" style="width:100px" /></td>'
    + '<td align="center" style="border: solid 1px #DDEEEE;"><label id="Remarks-2"></label></td>'
    + '<td align="center" style="border: solid 1px #DDEEEE; Width:150px"></td></tr>'
function AddRow() {
    if ($("#ChargeName-1").text().trim() == "Damage Charge".trim()) {
        ShowMessage('warning', 'Warning - ULD Charges', "Damage Charges already Added", "bottom-right");
        return
    }

    jQuery("#tblLUCESS>tbody:last").append(newRowContent);

    $("#DamageRow").show()
    $("#Del").show()
    $("#Add").hide()
    $("label#ChargeName-2").text('Damage Charge');



}
var Damage = 0;
var CTotalAmount = 0;
var IsCreditAccount = "";
var IsDamaged = ""
var RemainingCreditLimit = "";
var Check = "0";
function BindCharges(IsESSChk, IsPaymentChk, IsCreditChk) {
    $("#tblLUCESS").html('');
    $("#tblLUCESS").html('<table id="tblAppendChargesService" style="border-spacing: 0;border-collapse: collapse;width:650px;border: solid 1px #DDEEEE;font: normal 13px Arial, sans-serif;">'
        + '<thead><tr><td colspan="6" style="font-weight: bold;">ULD CHARGES</td></tr>'
        + '<tr style="background-color: #DDEFEF;height: 35px;text-shadow: 1px 1px 1px #fff;"><td style="text-align:center">Charge Names</td><td style="text-align:center">Amount</td><td style="text-align:center">Tax</td><td style="text-align:center">Total</td><td style="text-align:center">Remarks</td><td style="text-align:center">Mode</td></tr></thead>'

        + '<tbody><tr><td align="center" style="border: solid 1px #DDEEEE;"><label id="ChargeName-1"></label></td>'
        + '<td align="center" style="border: solid 1px #DDEEEE;"><input type="hidden" id="pBasis-1" /><input type="text" class="txtDisabled" maxlength="8" id="Amount-1" style="width:100px" /></td>'
        + '<td align="center" style="border: solid 1px #DDEEEE;"><input type="hidden" id="sBasis-1"/><input type="text" class="txtDisabled" maxlength="8" id="TotalTaxAmount-1" style="width:100px" /></td>'
        + '<td align="center" style="border: solid 1px #DDEEEE;"><input type="text" disabled="disabled" style="border:solid 0px #DDEEEE" id="TotalAmount-1" style="width:100px" /></td>'
        + '<td align="center" style="border: solid 1px #DDEEEE;"><label id="Remarks-1"></label><input type="hidden" id="TariffCodeSNo-1" /></td>'
        + '<td align="center" style="border: solid 1px #DDEEEE; Width:150px">CASH:<input type="radio" checked="checked" value="0"  id="PaymentMode-1" name="PaymentMode" />CREDIT:<input type="radio"value="1" id="PaymentMode-1" name="PaymentMode"/></td></tr></tbody>'

        + '<tfoot><tr><td colspan="6" style="font-weight: bold;"><input class="btn btn-success" type="button" id="Add" value="Add Row" onclick="AddRow()" style="float:left"/>'
        + '<input type="button" id="Del" value="Delete" onclick="Delete()" style="float:left" class="btn btn-block btn-danger btn-sm" /></td></tr></tfoot></table>');



    $.ajax({
        type: "get",
        url: "./Services/Tariff/ESSChargesService.svc/GetULDCharges/" + ULDTransferSNo.toString(),
        success: function (r) {
            var table = JSON.parse(r);

            var ErrorMessage = table.Table1[0].ErrorMessage;
            if (ErrorMessage != "") {
                ShowMessage('warning', 'Warning - ULD Charges', ErrorMessage, "bottom-right");
                $("#DamageRow").hide()
                $("#Add").hide()
                $("#Del").hide()
                $(".txtDisabled").attr("disabled", true)
                $(".txtDisabled").css("border", "solid 0px #DDEEEE")
                $("#btnSaveCharges").hide()
            } else {

                if (table.Table0.length != "0") {

                    IsDamaged = table.Table0[0].IsDamaged;
                    IsCreditAccount = table.Table0[0].IsCreditAccount;
                    RemainingCreditLimit = table.Table0[0].RemainingCreditLimit;

                    if (IsDamaged == 'True') {
                        Damage = 1;
                        if (table.Table0[0].Amount != "") {
                            $(".txtDisabled").attr("disabled", true)
                            $(".txtDisabled").css("border", "solid 0px #DDEEEE")

                        } else {
                            $(".txtDisabled").attr("disabled", false)
                            $(".txtDisabled").css("border", "solid 1px black")
                            $("#Del").hide()
                        }

                        for (var j = 0; j < table.Table0.length; j++) {
                            var idj = j + 1;

                            if (idj == "2") {
                                Check = "1";
                                jQuery("#tblLUCESS>tbody:last").append(newRowContent);
                                $("#DamageRow").show()
                                $("#Add").hide()
                                $("#Del").hide()
                                if (idj != "2") {
                                    $('input#Amount-' + idj).attr("disabled", true)
                                    $('input#TotalTaxAmount-' + idj).attr("disabled", true)
                                }
                            }


                            $("label#ChargeName-" + idj).text(table.Table0[j].TariffHeadName);
                            $('input#Amount-' + idj).val(table.Table0[j].Amount);
                            $('input#TotalTaxAmount-' + idj).val(table.Table0[j].TotalTaxAmount);
                            $('input#TotalAmount-' + idj).val(table.Table0[j].TotalAmount);
                            $('label#Remarks-' + idj).text(table.Table0[j].Remarks);
                            $('input#TariffCodeSNo-' + idj).val(table.Table0[j].TariffCodeSNo);
                            $('#pBasis-' + idj).val(table.Table0[j].pBasis);
                            $('#sBasis-' + idj).val(table.Table0[j].sBasis);

                            CTotalAmount += parseFloat(table.Table0[j].TotalAmount == "" ? 0 : table.Table0[j].TotalAmount)


                            if (table.Table0[j].Amount != "") {
                                $(".txtDisabled1").attr("disabled", true)
                                $(".txtDisabled1").css("border", "solid 0px #DDEEEE")
                                $("#Add").hide()
                                $("#Del").hide()
                            }
                        }



                    } else
                        if (IsDamaged == 'False') {

                            $(".txtDisabled").attr("disabled", true)
                            $(".txtDisabled").css("border", "solid 0px #DDEEEE")
                            for (var j = 0; j < table.Table0.length; j++) {
                                var idj = j + 1;
                                $("label#ChargeName-" + idj).text(table.Table0[j].TariffHeadName);
                                $('input#Amount-' + idj).val(table.Table0[j].Amount);
                                $('input#TotalTaxAmount-' + idj).val(table.Table0[j].TotalTaxAmount);
                                $('input#TotalAmount-' + idj).val(table.Table0[j].TotalAmount);
                                $('label#Remarks-' + idj).text(table.Table0[j].Remarks);
                                $('input#TariffCodeSNo-' + idj).val(table.Table0[j].TariffCodeSNo);
                                $('#pBasis-' + idj).val(table.Table0[j].pBasis);
                                $('#sBasis-' + idj).val(table.Table0[j].sBasis);
                                CTotalAmount += parseFloat(table.Table0[j].TotalAmount == "" ? 0 : table.Table0[j].TotalAmount)
                            }
                            if (Check == "0") {
                                $("#DamageRow").hide()
                                $("#Add").hide()
                                $("#Del").hide()
                            }
                        }

                    if (IsCreditAccount == 'False') {
                        $('#PaymentMode-1[value="1"]').attr('disabled', true);
                        $('#PaymentMode-1[value="0"]').attr('checked', true);
                    } else {
                        $('#PaymentMode-1[value="1"]').attr('disabled', false);
                        $('#PaymentMode-1[value="1"]').attr('checked', true);
                        //if (RemainingCreditLimit <= CTotalAmount.toFixed(2)) {
                        //    ShowMessage('warning', 'Warning - ULD Charges', "Credit limit expired!", "bottom-right");
                        //    $('#PaymentMode-1[value="1"]').attr('disabled', true);
                        //    $('#PaymentMode-1[value="0"]').attr('checked', true);
                        //} else {
                        //    $('#PaymentMode-1[value="1"]').attr('disabled', false);
                        //    $('#PaymentMode-1[value="1"]').attr('checked', true);
                        //}


                    }

                }
                else {
                    if (Check == "0") {
                        $("#DamageRow").hide()
                        $("#Add").hide()
                        $("#Del").hide()
                    }
                    $(".txtDisabled").attr("disabled", true)
                    $(".txtDisabled").css("border", "solid 0px #DDEEEE")
                    $("#btnSaveCharges").hide()
                }


            }


            if (IsPaymentChk == "true") {
                $("#btnSaveCharges").hide()
                if (Check == "0") {
                    $("#DamageRow").hide()
                    $("#Add").hide()
                    $("#Del").hide()
                }
                $(".txtDisabled").attr("disabled", true)
                $(".txtDisabled").css("border", "solid 0px #DDEEEE")
                $("#btnSaveCharges").hide()
            }
            if (IsESSChk == "true") {
                $("#btnSaveCharges").hide()
                if (Check == "0") {
                    $("#DamageRow").hide()
                    $("#Add").hide()
                    $("#Del").hide()
                }
                $(".txtDisabled").attr("disabled", true)
                $(".txtDisabled").css("border", "solid 0px #DDEEEE")
                $("#btnSaveCharges").hide()
            }

            if (IsCreditChk == "true") {
                $('#PaymentMode[value="0"]').attr('checked', false);
                $('#PaymentMode[value="1"]').attr('checked', true);
            }
            if (IsCreditChk == "true" && IsPaymentChk == "false") {
                $("#btnSaveCharges").hide()
                if (Check == "0") {
                    $("#DamageRow").hide()
                    $("#Add").hide()
                    $("#Del").hide()
                }
                $(".txtDisabled").attr("disabled", true)
                $(".txtDisabled").css("border", "solid 0px #DDEEEE")
                $("#btnSaveCharges").hide()
            }



        },
        error: function (xhr) {
            var a = "";
        }
    });


}
$(document).on('keypress keyup blur', '.txtDisabled', function (event) {
    $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
    if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }
});
$(document).on('keypress keyup blur', '.txtDisabled1', function (event) {
    $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
    if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }
});
function ExtraCondition(textId) {
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
var STotalAmount = 0;
function SaveLUCCharges() {

    var LUCChargeArray = [];

    var ChargesService = $("#tblLUCESS > tbody > tr").length;

    if (ChargesService == "0") {
        ShowMessage('warning', 'Warning - ULD Charges', "PLEASE ENTER ULD CHARGES DETAILS !", "bottom-right");
        return
    }
    var TariffCodeSNo = $('#TariffCodeSNo-1').val()
    var PaymentMode = 0;
    for (var i = 0; i < ChargesService; i++) {
        var id = i + 1;

        var ChargeName = $('#ChargeName-' + id).text()
        var Amount = $('#Amount-' + id).val()
        var pbasis = $('#pBasis-' + id).val()
        var sbasis = $('#sBasis-' + id).val()

        var TotalTaxAmount = $('#TotalTaxAmount-' + id).val()

        var TotalAmount = $('#TotalAmount-' + id).val()
        STotalAmount += parseFloat(TotalAmount)
        if (Amount == "" || Amount == "0") {
            ShowMessage('warning', 'Warning - ULD Charges', "Please Enter Amount!", "bottom-right");
            return
            $('#Amount-' + id).focus();
        }

        if (TotalTaxAmount == "" || TotalTaxAmount == "0") {
            ShowMessage('warning', 'Warning - ULD Charges', "Please Enter Total Tax Amount", "bottom-right");
            return
            $('#TotalTaxAmount-' + id).focus();
        }



        var Remarks = $('#Remarks-' + id).text()
        PaymentMode = $('input[name="PaymentMode"]:checked').val()

        var LUCChargeViewModel =
            {
                SNo: 1,
                AWBSNo: ULDTransferSNo,
                WaveOff: 0,
                TariffCodeSNo: TariffCodeSNo,
                TariffHeadName: ChargeName,
                pValue: 0,
                sValue: 0,
                Amount: parseFloat(Amount == "" ? 0 : Amount),
                TotalTaxAmount: TotalTaxAmount == "" ? 0 : TotalTaxAmount,
                TotalAmount: TotalAmount == "" ? 0 : TotalAmount,
                Rate: Amount,
                Min: 1,
                Mode: PaymentMode,
                ChargeTo: 0,
                pBasis: pbasis,
                sBasis: sbasis,
                Remarks: Remarks == undefined ? "" : Remarks,
                WaveoffRemarks: ''
            };
        LUCChargeArray.push(LUCChargeViewModel);
    }

    if (IsCreditAccount == 'True') {
        if (PaymentMode == "1") {
            if (RemainingCreditLimit < STotalAmount.toFixed(2)) {
                ShowMessage('warning', 'Warning - ULD Charges', "Credit limit expired!", "bottom-right");
                return;
            }
        }
    }

    var obj = {
        MomvementType: 2,
        Type: 'ULD',
        TypeValue: parseInt(ULDTransferSNo),
        BillTo: 'Agent',
        Process: 1005,
        SubProcessSNo: 2309,
        LstLUCCharges: LUCChargeArray
    }

    $.ajax({
        url: "Services/Tariff/ESSChargesService.svc/CreateLUCESSCharges",
        async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data != '' && data != '1') {
                if (data.split('?')[0] == "2") {
                    ShowMessage("success", 'Success - ULD Charges', "ULD Charge Applied Successfully for Invoice" + data.split('?')[1], "bottom-right");
                }
                else if (data.split('?')[0] == "1") {
                    ShowMessage("warning", 'Warning - ULD Charges', "" + data.split('?')[1], "bottom-right");
                }

                $("#Add").hide()
                $("#Del").hide()
                ReloadSameGridPage(2309);
                if (ButtonProcess)
                    $(ButtonProcess).removeClass("incompleteprocess").addClass("completeprocess");
                $("#btnSave").hide();
            }
            else {
                ShowMessage('warning', 'Warning - ULD Charges', "Record Not Saved Please Try Again ", "bottom-right");
            }
        }
    });
}
function ReloadSameGridPage(subprocess) {
    var gridPage = $(".k-pager-input").find("input").val();
    var grid = $(".k-grid").data("kendoGrid");
    grid.dataSource.page(gridPage);
}
function CheckLUCINNumber(LUCINNumber) {
    var Ret = "";
    $.ajax({
        url: "Services/Export/UldTransfer/LucInService.svc/CheckLUCINNumber",
        async: false, type: "GET"
        , dataType: "json",
        data: { LUCINNumber: LUCINNumber }
        , contentType: "application/json;charset=utf-8", cache: false, success: function (response) {
            var v = $.parseJSON(response);
            var FV = v.Table0[0].LUCINNUMBEr
            if (FV == "1") {
                ShowMessage('warning', 'Information!', "Please select another  LUC IN Number ", "bottom-right");
                $("#Text_LUCInNumber").val('')
            }
        },
        error: function (xhr) {
        }
    });
}
function LucDamaged(ths) {

    if ($("#ISDamge").is(':checked')) {
        $("#ISDamge").attr("value", "1")
        $("#DamagedRemarks").attr("disabled", false)
    }
    else {
        $("#ISDamge").attr("value", "0")
        $("#DamagedRemarks").attr("disabled", true)
    }
    // $('.Process:checked').val()
    // ISDamge

}
function DamagedRemarks(ths) {
    // DamagedRemarks
    if ($("#DamagedRemarks").val() != "") {
        $("#ISDamge").attr("checked", true)
        $("#ISDamge").attr("value", "1")
    } else {
        $("#ISDamge").attr("checked", false)
        $("#ISDamge").attr("value", "0")
    }
}

$(document).on('keypress keyup blur', '#Amount-2', function (event) {
    var Amount = $("#Amount-2").val() == "" ? "0" : $("#Amount-2").val()
    var TotalTaxAmount = $("#TotalTaxAmount-2").val() == "" ? "0" : $("#TotalTaxAmount-2").val()

    var FinaVal = parseFloat(Amount) + parseFloat(TotalTaxAmount)

    $("#TotalAmount-2").val(FinaVal.toFixed(2))

});
$(document).on('keypress keyup blur', '#TotalTaxAmount-2', function (event) {
    var Amount = $("#Amount-2").val() == "" ? "0" : $("#Amount-2").val()
    var TotalTaxAmount = $("#TotalTaxAmount-2").val() == "" ? "0" : $("#TotalTaxAmount-2").val()

    var FinaVal = parseFloat(Amount) + parseFloat(TotalTaxAmount)

    $("#TotalAmount-2").val(FinaVal.toFixed(2))

});
$(document).on('keypress keyup blur', '#Amount-1', function (event) {
    var Amount = $("#Amount-1").val() == "" ? "0" : $("#Amount-1").val()
    var TotalTaxAmount = $("#TotalTaxAmount-1").val() == "" ? "0" : $("#TotalTaxAmount-1").val()

    var FinaVal = parseFloat(Amount) + parseFloat(TotalTaxAmount)

    $("#TotalAmount-1").val(FinaVal.toFixed(2))

});
$(document).on('keypress keyup blur', '#TotalTaxAmount-1', function (event) {
    var Amount = $("#Amount-1").val() == "" ? "0" : $("#Amount-1").val()
    var TotalTaxAmount = $("#TotalTaxAmount-1").val() == "" ? "0" : $("#TotalTaxAmount-1").val()

    var FinaVal = parseFloat(Amount) + parseFloat(TotalTaxAmount)

    $("#TotalAmount-1").val(FinaVal.toFixed(2))

});
//ADDED BY SHIVALI THAKUR
function checkfuturedate() {
    var ReceivedDate = $("#Text_Receiveddate").val();
    var month = '';
    var today = new Date();

    var dd = today.getDate();


    var mm = today.getMonth() + 1;


    var yyyy = today.getFullYear();


    if (dd < 10) {
        dd = '0' + dd;
    }


    if (mm < 10) {
        mm = '0' + mm;
    }


    switch (mm) {
        case '01':
            month = month + '' + "Jan";
            break;
        case '02':
            month = month + '' + "Feb";
            break;
        case '03':
            month = month + '' + "Mar";
            break;
        case '04':
            month = month + '' + "Apr";
            break;
        case '05':
            month = month + '' + "May";
            break;
        case '06':
            month = month + '' + "Jun";
            break;
        case '07':
            month = month + '' + "Jul";
            break;
        case '08':
            month = month + '' + "Aug";
            break;
        case '09':
            month = month + '' + "Sep";
            break;
        case 10:
            month = month + '' + "Oct";
            break;
        case 11:
            month = month + '' + "Nov";
            break;
        case 12:
            month = month + '' + "Dec";
    }
    today = dd + '-' + month + '-' + yyyy;
    if (ReceivedDate > today) {
        $("#Text_Receiveddate").val("");
        ShowMessage('warning', 'Information!', "Received date cannot be greater than current date.", "bottom-right");
        return;

    }



}
function checkfuturedateDDMMYY() {

    var month = '';
    var today = new Date();

    var dd = today.getDate();


    var mm = today.getMonth() + 1;


    var yyyy = today.getFullYear();


    if (dd < 10) {
        dd = '0' + dd;
    }


    if (mm < 10) {
        mm = '0' + mm;
    }


    switch (mm) {
        case '01':
            month = month + '' + "Jan";
            break;
        case '02':
            month = month + '' + "Feb";
            break;
        case '03':
            month = month + '' + "Mar";
            break;
        case '04':
            month = month + '' + "Apr";
            break;
        case '05':
            month = month + '' + "May";
            break;
        case '06':
            month = month + '' + "Jun";
            break;
        case '07':
            month = month + '' + "Jul";
            break;
        case '08':
            month = month + '' + "Aug";
            break;
        case '09':
            month = month + '' + "Sep";
            break;
        case 10:
            month = month + '' + "Oct";
            break;
        case 11:
            month = month + '' + "Nov";
            break;
        case 12:
            month = month + '' + "Dec";
    }
    return today = dd + '-' + month + '-' + yyyy;

}
//
var YesReady = false;
function PageRightsCheckLucIn() {
    var CheckIsFalse = 0;
    $(userContext.PageRights).each(function (e, i) {
        if (i.Apps.toString().toUpperCase() == "LUCIN") {
                if (i.Apps.toString().toUpperCase() == "LUCIN" && i.PageRight == "New") {
                    YesReady = false;
                    CheckIsFalse = 1;
                    return
                } if (i.Apps.toString().toUpperCase() == "LUCIN" && i.PageRight == "Edit") {
                    YesReady = false;
                    CheckIsFalse = 1;
                    return
                } if (i.Apps.toString().toUpperCase() == "LUCIN" && i.PageRight == "Delete") {
                    YesReady = false;
                    CheckIsFalse = 1;
                    return
                } else if (CheckIsFalse == 0 && i.PageRight == "Read"){
                    YesReady = true;
                    return
                }
            
        }
    });

    if (YesReady) {
        $("#btnSave").hide();
        $("#btnCancel").hide();
        $("#Del").hide();
        $("#Add").hide();
    } 
}

