var UCRReceiptNo = 0;
var ULDTransferSNo = 0;
var GetUldNo = "";
$(function () {
    $.ajax({
        url: 'HtmlFiles/Export/UldTransfer/LUC.html',
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

});
function LucAutomanual(thisval) {
    var Auto = $(thisval).val();
    $("#Text_UCRCarrierCode").val('');
    $("#Text_UCRNumber").val('');
    $("#Text_UHFCarrierCode").val('');
    $("#Text_UHFNumber").val('');
    if (Auto == "1") {

        $("#Text_UCRCarrierCode").attr('readonly', true);
        $("#Text_UCRNumber").attr('readonly', true);
        $("#Text_UHFCarrierCode").attr('readonly', true);
        $("#Text_UHFNumber").attr('readonly', true);
        Get_LUCAutoGenerateUcrUHf();
    } else {

        $("#Text_UCRCarrierCode").attr('readonly', false);
        $("#Text_UCRNumber").attr('readonly', false);
        $("#Text_UHFCarrierCode").attr('readonly', false);
        $("#Text_UHFNumber").attr('readonly', false);
    }

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
        url: "Services/Export/UldTransfer/LucService.svc/GetPageGrid",
        success: function (response) {
            $("#divMainGrid").html(response);
            //$(".k-grid").closest("table").find("tr:eq(1)").hide();
            //$("input[type='button'][value='S']").css("disabled", "disabled");
        }
    });

}

function SaveDetails() {
    cfi.ValidateSubmitSection("divMainDiv");
    if (!cfi.IsValidSection($("#divMainDiv"))) {
        return false;
    }

    if (Text_Name.toString().length > 100) {
        $('#Text_Name').val('');
        ShowMessage('info', 'Need your Kind Attention!', "Name not allowed more than 100 character");
        return false;
    }
    if (Text_IDNumber.toString().length > 50) {
        $('#Text_IDNumber').val('');
        ShowMessage('info', 'Need your Kind Attention!', "ID Number not allowed more than 50 character");
        return false;
    }
    var res = $("#tblAdd").serializeToJSON();
    var action = EditSNo == "0" ? "SaveDetails" : "UpdateDetails/" + EditSNo;
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "Services/Export/UldTransfer/LucService.svc/" + action,
        data: JSON.stringify(res),
        success: function (response) {
            if (response == "2001") {
                ShowMessage("success", "", "Saved successfully...");
                setTimeout(function () { location.reload(); }, 500);
                window.location.href = "http://" + location.host + "/" + window.location.pathname + "?Module=Shipment&Apps=LUC&FormAction=INDEXVIEW";
            }
            else if (response == "3001") {
                ShowMessage('info', 'Need your Kind Attention!', "UHF Number already exist.");
                return false;
            }
            else if (response == "4001") {
                ShowMessage('info', 'Need your Kind Attention!', "UCR Number already exist.");
                return false;
            }
            else if (response == "1001") {
                ShowMessage('warning', 'Warning - LUC', "unable to process.");
                return false;
            }
        }
    });


}


var EditSNo = 0;
//var RSNo = 0;


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

//function UldInfomationIN(ULDNumber) {
//    $("#divLUCInformation").html('');
//    $.ajax({
//        url: 'HtmlFiles/Export/UldTransfer/UldInformationIn.html',
//        async: false,
//        cache: false,
//        success: function (result) {
//            $("#divLUCInformation").html(result);
//            $("#btnSave").show();
//            $("#Text_Receiveddate").kendoDatePicker();
//            cfi.AutoComplete("ULD", "ULDNumber", "ViewLucGrid", "SNo", "ULDNumber", ["ULDNumber"], null, "contains", ",");
//            cfi.AutoComplete("DemurrageCode", "Code", "DamurrageCodes", "SNo", "Code", ["Code"], null, "contains");
//            cfi.AutoComplete("ODLNCode", "Code,ODLNDesc", "ODLNCodes", "SNo", "Code", ["Code", "ODLNDesc"], null, "contains");

//            //cfi.AutoComplete("DemurrageCode", "Code,ODLNDesc", "DamurrageCodes", "SNo", "Code", ["Code", "ODLNDesc"], null, "contains", ",");
//            //cfi.AutoComplete("ODLNCode", "AirportCode,AirportName", "ODLNCodes", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains", ",")

//        }
//    });
//    BindUldInfomationIN(ULDNumber)
//}

//function BindUldInfomationIN(ULDNumber) {
    
//    $.ajax({
//        type: "POST",
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        url: "Services/Export/UldTransfer/LucService.svc/UldInfomationIN/" + ULDNumber,
//        success: function (r) {

//            $('#ULD').html(r.Text_ReceivedBy);
//            $('#Text_ULD').html(r.Text_ReceivedBy);
//            $('#Text_IssuedBy').html(r.Text_ReceivedBy);
//            $('#Text_IssuedFrom').html(r.Text_ReceivedBy);
//            $('#Text_ReceivedBy').html(r.Text_ReceivedBy);
//            $('#Text_Remarks').html(r.Text_ReceivedBy);
//            $('#Text_CityCode').html(r.Text_ReceivedBy);
//            $('#ULD').html(r.Text_ReceivedBy);
//            $('#Text_ULD').html(r.Text_ReceivedBy);
//            $('#Text_Issuedate').html(r.Text_ReceivedBy);
           
//        }
//    });


//}

function NewClick(EditSNo) {
    CancelDetails();
    EditSNo = EditSNo;
    $("#tblLUC").html('');

    $.ajax({
        url: 'HtmlFiles/Export/UldTransfer/LUCInformation.html',
        async: false,
        cache: false,
        success: function (result) {
            CancelDetails();
            $("#divLUCInformation").html(result);
            $("#btnSave").show();
            BindControls();
            GETReceipt();
            $('#Text_MobileNo').keypress(function (e) {
                var iKeyCode = (e.which) ? e.which : e.keyCode
                if (iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
                    return false;
            });
            $("div[id='divMultiULD']").css("width", "20em");
            $('#Text_UCRNumber').keypress(function (e) {
                var iKeyCode = (e.which) ? e.which : e.keyCode
                if (iKeyCode != 43 && iKeyCode != 45 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
                    return false;
                $('#Text_UCRNumber').attr('onchange', 'checkNumeric(\"Text_UCRNumber\");');
            });
            $('#Text_UHFNumber').keypress(function (e) {
                var iKeyCode = (e.which) ? e.which : e.keyCode
                if (iKeyCode != 43 && iKeyCode != 45 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
                    return false;
                $('#Text_UHFNumber').attr('onchange', 'checkNumeric(\"Text_UHFNumber\");');
            });
            $('#Text_UCRCarrierCode').keypress(function (e) {
                var iKeyCode = (e.which) ? e.which : e.keyCode
                if (iKeyCode != 43 && iKeyCode != 45 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
                    return false;
                $('#Text_UCRCarrierCode').attr('onchange', 'checkNumeric(\"Text_UCRCarrierCode\");');
            });
            $('#Text_UHFCarrierCode').keypress(function (e) {
                var iKeyCode = (e.which) ? e.which : e.keyCode
                if (iKeyCode != 43 && iKeyCode != 45 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
                    return false;
                $('#Text_UHFCarrierCode').attr('onchange', 'checkNumeric(\"Text_UHFCarrierCode\");');
            });
        }
    });
}
function OnSuccessGrid() {
    var TrHeader = $("div[id$='divMainGrid']").find("div[class^='k-grid-header'] thead tr");
    var SentLUCIndex = TrHeader.find("th[data-field='SentLUC']").index();
    var IsESSIndex = TrHeader.find("th[data-field='IsESS']").index();
    var IsALIndex = TrHeader.find("th[data-field='IsAL']").index();
    var IsUCRIndex = TrHeader.find("th[data-field='IsUCR']").index();
    var IsPaymentIndex = TrHeader.find("th[data-field='IsPayment']").index();


    $("div[id$='divMainGrid']").find("div[class^='k-grid-content'] tbody tr").each(function (row, tr) {
        if ($(tr).find("td:eq(" + SentLUCIndex + ")").text() == "YES") {
            $(tr).find('input[type="button"][value="S"]').prop('disabled', true).prop('class', 'completeprocess');;
        }
        else {
            $(tr).find('input[type="button"][value="S"]').prop('disabled', false);
        }
        //if ($(tr).find("td:eq(" + IsESSIndex + ")").text() == "true") {
        //    $(tr).find('input[type="button"][value="C"]').prop('class', 'completeprocess');;
        //}
        //else if ($(tr).find("td:eq(" + IsPaymentIndex + ")").text() == "true") {
        //    $(tr).find('input[type="button"][value="C"]').prop('class', 'partialprocess');;
        //}
        if ($(tr).find("td:eq(" + IsALIndex + ")").text() == "true") {
            $(tr).find('input[type="button"][value="E"]').prop('class', 'completeprocess');;
        }
        if ($(tr).find("td:eq(" + IsUCRIndex + ")").text() == "true") {
            $(tr).find('input[type="button"][value="U"]').prop('class', 'completeprocess');;
        }

    });
}
function BindGridData(SNo, obj) {
    if ($(obj).attr("value") == "E") {
        BindUploadControl(SNo, 'Authority Letter');
    }
    else if ($(obj).attr("value") == "U") {
        BindUploadControl(SNo, 'UCR/UHF');
    }
    else if ($(obj).attr("value") == "S") {
        BindSendLUC(SNo, 'Send');
    } else if ($(obj).attr("value") == "C") {
       // var trHRow = $(obj).closest('tr').closest("div.k-grid").find("div.k-grid-header");
      //  var UCRReceiptIndex = trHRow.find("th[data-field='UCRReceiptNo']").index();
      //  UCRReceiptNo = $(obj).closest('tr').find('td:eq(' + UCRReceiptIndex + ')').text();
      //  BindESS(SNo, obj);
    }
    else if ($(obj).attr("value") == "IN") {
      //  var trHRow = $(obj).closest('tr').closest("div.k-grid").find("div.k-grid-header");
      //  var UCRReceiptIndex = trHRow.find("th[data-field='ULDNumber']").index();
      //  var ULDNumber = $(obj).closest('tr').find('td:eq(' + UCRReceiptIndex + ')').text();
      //  UldInfomationIN(ULDNumber);


    }
}

function BindSendLUC(SNo, HeadName) {
    $("#divLUCUpload").show();
    $.ajax({
        url: "Services/Export/UldTransfer/LucService.svc/SendLUC"
        , async: false, type: "GET"
        , dataType: "json",
        data: { SNo: SNo }
        , contentType: "application/json;charset=utf-8", cache: false, success: function (result) {
            var data = $.parseJSON(result);
            if (data.Table0[0].Status == "1") {
                ShowMessage('success', 'Success - LUC ', "LUC Message initiated successfully", "bottom-right");
                setTimeout(function () { location.reload(); }, 1000);
            }
            else {
                ShowMessage('warning', 'Warning - LUC', "unable to process.", "bottom-right");
            }
        },
        error: function (xhr) {
            var a = xhr.statusText;
        }
    });
}

function BindUploadControl(SNo, HeadName) {
    $("#divLUCUpload").show();
    var urlpath = '';
    if (HeadName == 'Authority Letter')
        urlpath = "Services/Export/UldTransfer/LucService.svc/AuthorityLetter";
    else
        urlpath = "Services/Export/UldTransfer/LucService.svc/UCRUHF";

    CancelDetails();
    $('#tblLUCUpload').html('');
    $('#tblLUCUpload').addClass("appendGrid ui-widget");
    $('#tblLUCUpload').html("<form name='form1' method='post' ><table class='WebFormTable'><tr><td class='formSection' id='tdheadname' colspan='4'>" + HeadName.toString() + " Upload</td></tr><tr><td class='formlabel'>File upload</td><td class='formInputcolumn'> <div><input id='ImgFileUpload' name='ImgFileUpload' type='file' /></div><div><input type='hidden' id='hdnULDSNoImgupload' value='" + SNo + "'/></div></td><td class='formlabel'>Download File</td><td class='formInputcolumn' id='uldimageDownloadLink'></td></tr><tr><td class='formlabel'></td><td class='formInputcolumn'><input type='button'  value='Submit' onClick = 'UploadImage()' /></td><td class='formlabel'></td><td class='formInputcolumn'></td></tr></table></form>");

    $.ajax({
        url: urlpath,
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            ULDSNo: SNo
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {
            debugger;
            if (result.length > 2) {
                var v = $.parseJSON(result);
                debugger;
                if (HeadName == 'Authority Letter') {
                    if (v[0].AuthorityLetterFName != '') {

                        var str = "<a href='Handler/FileUploadHandler.ashx?ULDImage=DBAuthorityIMAGE&FlagSNo=" + SNo + "'>" + v[0].AuthorityLetterFName.toString() + "</a>"
                        $("#uldimageDownloadLink").html(str);
                    }
                }
                else {
                    if (v[0].UCRSignedDocFName != '') {

                        var str = "<a href='Handler/FileUploadHandler.ashx?ULDImage=DocumentIMAGE&FlagSNo=" + SNo + "'>" + v[0].UCRSignedDocFName.toString() + "</a>"
                        $("#uldimageDownloadLink").html(str);
                    }
                }

            }
        },
        error: function (xhr) {
            var a = "";
        }
    });
}

function BindESS(SNo, HeadName) {
    $("#divLUCUpload").hide();
    $("#divLUCInformation").hide();
    $("#tblLUCESS").show();
    if ($(HeadName).closest('tr').find('td:eq(' + $(HeadName).closest('tr').closest("div.k-grid").find("div.k-grid-header").find('th[data-field="IsPayment"]').index() + ')').text() == "false") {
        var button = "<input type='button' value='Save' class='btn btn-success' onClick='SaveLUCCharges()' id='btnSave'>";
        $("#btnSave").remove();
        $("#tblLUCESS").after(button);
    }
    else {
        $("#btnSave").remove();
    }
    ULDTransferSNo = SNo;
    BindCTMCharges();
}

function UploadImage() {
    var fileName = '';
    var upcontent = $('#tdheadname').html();
    var nextctrlID = ''
    var fileSelect = document.getElementById('ImgFileUpload');
    var files = fileSelect.files;
    if (files.length != 0) {
        var data = new FormData();
        for (var i = 0; i < files.length; i++) {
            fileName = files[i].name;
            var uldsno = $('#hdnULDSNoImgupload').val();
            data.append(files[i].name + '~' + uldsno + '~' + upcontent.toString(), files[i]);
        }
        $.ajax({
            url: "Handler/FileUploadHandler.ashx",
            type: "POST",
            data: data,
            contentType: false,
            processData: false,
            success: function (result) {
                if (result != 2001) {
                    if (upcontent == 'Authority Letter Upload') {
                        ShowMessage('success', '', "File Uploaded Successfully.", "bottom-right");
                        var str = "<a href='Handler/FileUploadHandler.ashx?ULDImage=DBAuthorityIMAGE&FlagSNo=" + result + "'>" + fileName.toString() + "</a>"
                        $("#uldimageDownloadLink").html(str);
                    }
                    else {
                        ShowMessage('success', '', "File Uploaded Successfully.", "bottom-right");
                        var str = "<a href='Handler/FileUploadHandler.ashx?ULDImage=DocumentIMAGE&FlagSNo=" + result + "'>" + fileName.toString() + "</a>"
                        $("#uldimageDownloadLink").html(str);
                    }
                    if (ButtonProcess)
                        $(ButtonProcess).removeClass("incompleteprocess").addClass("completeprocess");
                }
            },
            error: function (err) {
                ShowMessage('info', 'File Upload!', "Unable to upload selected file. Please try again.", "bottom-right");
            }
        });
    }
    else {
        ShowMessage('info', 'File Upload!', "Please select file.", "bottom-right");
    }


}


function BindControls() {
    $("#Text_IssuedDate").kendoDatePicker();
    $("#Text_Receiveddate").kendoDatePicker();
    //$("#Text_IssuedTime").kendoTimePicker();
    cfi.AutoComplete("ULD", "ULDNumber", "vwLUCULD", "SNo", "ULDNumber", ["ULDNumber"], null, "contains", ",");

    var dbtableName = "tblLUC";

}
function PutHyphenINTime() {
    var x = $("#Text_IssuedTime").val();
    if (x.length == 2) {
        $("#Text_IssuedTime").val($("#Text_IssuedTime").val() + ":");
    }

}
function CheckTimeFormat() {
    if ($("#Text_IssuedTime").val() != '') {
        var x = $("#Text_IssuedTime").val();
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

        if (value == 1 || x.length != 5 || $("#Text_IssuedTime").val().search(':') == -1) {
            $("#Text_IssuedTime").val('');
            alert('Please enter correct format Time');
            return false;
        }

    }
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
    window.location.href = "http://" + location.host + "/" + window.location.pathname + "?Module=Shipment&Apps=LUC&FormAction=INDEXVIEW";
}

function GETReceipt() {
    $("#divLUCInformation").show();
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "Services/Export/UldTransfer/LUCService.svc/GetReceipt",
        success: function (response) {
            if (response.length > 0) {
                debugger;
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
    //    url: "Services/Export/UldTransfer/LucService.svc/EditData/" + EditSNo,
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






            GetUldTransferUcrData(EditSNo);
            //cfi.PopUp(result, "Details", 1000, null, null, 100);


            $("#divUCRPrint").css("overflow", "auto");
            $("#divUCRPrint").css("border", "1px solid black;");
            $("#divUCRPrint").css("width", "95%");
            $("#divUCRPrint").css("height", "400PX");
            //cfi.PopUp("divUCRPrint", "Details", 1000, null, null);

        }
    });

}

function GridReadActionNew(obj) {
    debugger;
    EditSNo = $(obj).attr("href").split('=')[1];
    //$.ajax({
    //    type: "POST",
    //    contentType: "application/json; charset=utf-8",
    //    dataType: "json",
    //    url: "Services/Export/UldTransfer/LucService.svc/EditData/" + EditSNo,
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
            // cfi.PopUp("UldTransferPrintContent", "Details");
            $("#divUCRPrint").html(result);
            GetUldHandOverRecordData(EditSNo);
            // $('#divUCRPrint')[0].scrollIntoView(true);
            // $(document).scrollTo('#divUCRPrint');        
            $("#divUCRPrint").css("overflow", "auto");
            $("#divUCRPrint").css("border", "1px solid black;");
            $("#divUCRPrint").css("width", "100%");
            $("#divUCRPrint").css("height", "400PX");
        }
    });
}
function GetUldTransferUcrData(EditSNo) {
    $.ajax({
        url: "./Services/Export/UldTransfer/LucService.svc/GetUldTransferData?Sno=" + EditSNo, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            var FinalData = ResultData.Table0;
            var FinalData1 = ResultData.Table1;
            var FinalData2 = ResultData.Table2;
            var AirlineLogo = "";
            if (FinalData[0].AirlineLogo == "") {
                $("#AirlineLogo").attr('src', './Logo/SASNew-Logo.PNG');
            } else {
                AirlineLogo = "./Logo/" + FinalData[0].AirlineLogo;
                $("#AirlineLogo").attr('src', AirlineLogo);
            }

            if (FinalData.length > 0) {

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

                    for (var i = CRNSplit[1].length ; i >= 0; i--) {
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
    var str22 = "";
    var day = "";
    var month = "";
    var year = "";
    // var Sno = 1;
    $.ajax({
        url: "./Services/Tariff/HandlingChargesService.svc/GetUldHandOverRecord?Sno=" + EditSNo, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);
            var finaltabl0 = ResultData.Table0;
            var finaltabl1 = ResultData.Table1;
            if (finaltabl0.length > 0) {
                // len = FinalData.length;
                $("span#spntrf1").text(finaltabl0[0].AirportCode.substr(0, 1)).text();
                $("span#spntrf2").text(finaltabl0[0].AirportCode.substr(1, 1)).text();
                $("span#spntrf3").text(finaltabl0[0].AirportCode.substr(2, 1)).text();
                $("span#UFH1").text(finaltabl0[0].UHFReceiptNo).text();
                //$("span#UFH2").text(FinalData[0].UHFReceiptNo.substr(7, 1)).text();
                //$("span#UFH3").text(FinalData[0].UHFReceiptNo.substr(8, 1)).text();
                //$("span#UFH4").text(FinalData[0].UHFReceiptNo.substr(9, 1)).text();
                //$("span#UFH5").text(FinalData[0].UHFReceiptNo.substr(10, 1)).text();
                $("span#cons1").text(finaltabl0[0].IsDamageds.substr(0, 1)).text();
                $("span#cons2").text(finaltabl0[0].IsDamageds.substr(1, 1)).text();
                $("span#cons3").text(finaltabl0[0].IsDamageds.substr(2, 1)).text();
                $("span#nameid").text(finaltabl0[0].Receivedname).text();
                $("span#addressid").text(finaltabl0[0].ReceivedAddress).text();
                $("span#Transfernameid").text(finaltabl0[0].TransferName).text();
                $("span#Transferaddressid").text(finaltabl0[0].TransferAddress).text();
                $("span#Usernameid").text(finaltabl0[0].UserName).text();
                $("span#UserAddressid").text(finaltabl0[0].EMailID).text();
                $("span#LoadedBy").text(finaltabl0[0].LoadedBy).text();

                day = finaltabl0[0].Day
                month = finaltabl0[0].Month
                year = finaltabl0[0].Year
                // var SNo = '';
                for (var i = 0; i < finaltabl0.length; i++) {
                    $('tr#spDes').after("<tr style='border:1px solid black;'><td class='tdstyle' style='width:12%;padding:7px;'>" + finaltabl0[i].ULDCode + "</td><td class='tdstyle' style='width:14%; padding:7px;' colspan='2'>" + finaltabl0[i].ULDNumber + "</td><td class='tdstyle' style='width:7%; padding:7px; text-align:center;'>" + finaltabl0[i].OwnerCode + "</td></tr>")

                    //Add Apend Tr To Date
                    $('tr#trdt').after("<tr style='border:1px solid black;'><td class='tdstyle' style='width:12%;padding:7px;'>" + day + "</td><td class='tdstyle' style='width:14%; padding:7px;'>" + month + "</td><td class='tdstyle' style='width:7%; padding:7px; text-align:center;'>" + year + "</td><td class='tdstyle' style='width:7%; padding:7px; text-align:center;'>" + finaltabl0[i].UTCTime + "</td></tr>")

                    //Add Append Tr To Consumable
                    //$('tr#Consumid').after("<tr style='border:1px solid black;'><td class='tdstyle' style='width:12%;padding:7px;'>" + FinalData[i].ConsumableNameQty + "</td></tr>")

                }
            }
            if (finaltabl1.length > 0) {
                $(finaltabl1).each(function (row, tr) {
                    if (tr.ConsumableNameQty != undefined) {
                        str22 = str22 + (tr.ConsumableNameQty) + ','
                    }
                })
                $('tr#Consumid').after("<tr style='border:1px solid black;'><td class='tdstyle' style='width:12%;padding:7px;'>" + str22 + "</td></tr>")
            }
            //else {
            //    // $('#divhtml').html(' ');
            //    Alert('error', 'Need your Kind Attention!', 'Sorry Records Not Found !!');
            //}
        },
        error: {

        }
    });
}

function funPrintUCRData(divID) {

    // var EditSNo = $('#divMainGrid .k-grid-content tbody tr td:eq(0)').find('input[type="radio"]:checked').val()

    $.ajax({
        url: "./Services/Export/UldTransfer/LucService.svc/GetUCRPrintCount?Sno=" + EditSNo, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
        }
    })
    $("#" + divID + " #btnUCRPrint").css("display", "none");
    var divContents = $("#" + divID).html();
    var printWindow = window.open('', '', '');
    printWindow.document.write(divContents);
    printWindow.document.close();
    printWindow.print();
    //$("#" + divID + " #btnUCRPrint").css("display", "block").css("text-align", "right");
    $("#" + divID + " #btnUCRPrint").removeAttr('style');
}

function FunPrintDataNew(divId) {
    // var EditSNo = $('#divMainGrid .k-grid-content tbody tr td:eq(0)').find('input[type="radio"]:checked').val()

    $.ajax({
        url: "./Services/Tariff/HandlingChargesService.svc/GetAndUpdateUHFPrint?Sno=" + EditSNo,
        async: false,
        type: "get",
        dataType: "json",
        cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
        }
    })
    var divContents = $("#" + divId).html();
    var printWindow = window.open('', '', '');
    printWindow.document.write(divContents);
    printWindow.document.close();
    printWindow.print();
}

function ExtraCondition(textId) {
    var f = cfi.getFilter("AND");
    if (textId.indexOf("Text_ULD") >= 0) {
        cfi.setFilter(f, "SNo", "notin", $("#Text_ULD").data("kendoAutoComplete").key());
        cfi.setFilter(f, "CurrentCityCode", "eq", userContext.CityCode);
    }
    return cfi.autoCompleteFilter([f]);
}
var footer = '<div id="divFooter" class="divFooter" style="height: 0px; padding-bottom: 30px; display: block;"><div><table style="margin-left:20px;"><tbody><tr><td> &nbsp; &nbsp;</td><td><input type="button" value="New" onclick="NewClick()" class="btn btn-info"></td><td> &nbsp; &nbsp;</td><td><input type="button" style="float:right;display:none;" onclick="SaveDetails(0)" id="btnSave"  value="Save" class="btn btn-success"></td><td> &nbsp; &nbsp;</td><td><button class="btn btn-block btn-danger btn-sm" id="btnCancel" onclick="CancelDetailsWithHREF()">Cancel</button></td></tr></tbody></table> </div></div>';


//ESSCHARGES
var flags = 0;
var weight = 0;
var MendatoryHandlingCharges = new Array();
function BindCTMCharges() {
    _CURR_PRO_ = "ESS";
    $.ajax({
        url: "Services/Tariff/ESSChargesService.svc/GetWebForm/" + _CURR_PRO_ + "/Tariff/ESSCharges/New/1", async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#tblLUCESS").html(result);

            $("#tblLUCESS").html('').html("<form method='post' name='aspnetForm' id='aspnetForm'>" + result + "</form");

            var CityCode = userContext.CityCode
            $.ajax({
                url: "Services/Tariff/ESSChargesService.svc/GetLUCSMendatoryCharges?SNo=" + ULDTransferSNo + "&CityCode='" + CityCode + "'&ProcessSNo=" + parseInt(1005) + "&SubProcessSNo=" + parseInt(2309) + "&ArrivedShipmentSNo=0&RateType=0&GrWt=" + parseFloat(0) + "&ChWt=" + parseFloat(0) + "&Pieces=" + parseInt(0),
                async: false, type: "GET", dataType: "json", cache: false,
                //url: "Services/Tariff/ESSChargesService.svc/GetLUCSMendatoryCharges", async: false, type: "GET", dataType: "json", cache: false,
                //data: JSON.stringify({ SNo: ULDTransferSNo, CityCode: CityCode, ProcessSNo: '1005', SubProcessSNo: '2309', ArrivedShipmentSNo: '0', RateType: '0', GrWt: '0', ChWt: '0', Pieces: '0' }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var Data = jQuery.parseJSON(result);
                    var resData = Data.Table0;

                    /****************Handling Charge Information*************************************/
                    MendatoryHandlingCharges = [];
                    if (resData != []) {
                        $(resData).each(function (row, i) {
                            if (i.isMandatory == 1) {
                                MendatoryHandlingCharges.push({ "chargename": i.TariffSNo, "text_chargename": i.TariffCode, "pbasis": i.PrimaryBasis == undefined ? '' : i.PrimaryBasis, "pvalue": i.pValue == undefined ? 0 : i.pValue, "sbasis": i.SecondaryBasis == undefined ? '' : i.SecondaryBasis, "svalue": i.sValue == undefined ? 0 : i.sValue, "amount": i.ChargeAmount, "totaltaxamount": i.TotalTaxAmount, "totalamount": i.TotalAmount, "remarks": i.ChargeRemarks.toUpperCase().replace(/<BR>/g, "") });
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

                            if (MendatoryHandlingCharges.sbasis == undefined || MendatoryHandlingCharges.sbasis == "") {
                                $(this).find("span[id^='SBasis']").closest("td").find("input[id^='SValue']").css("display", "none");
                                $(this).find("span[id^='SBasis']").closest("td").find("span[id^='SBasis']").css("display", "none");
                                $(this).find("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").css("display", "none");
                                $(this).find("span[id^='SBasis']").closest("td").find("span[id^='_tempSBasis']").css("display", "none");
                            }
                            else {
                                $(this).find("span[id^='SBasis']").closest("td").find("input[id^='SValue']").css("display", "inline-block");
                                $(this).find("span[id^='SBasis']").closest("td").find("span[id^='SBasis']").css("display", "inline-block");
                                $(this).find("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").css("display", "inline-block");
                                $(this).find("span[id^='SBasis']").closest("td").find("span[id^='_tempSBasis']").css("display", "inline-block");
                                $(this).find("span[id^='SBasis']").closest("td").find("input[id^='_tempSValue']").val(MendatoryHandlingCharges[i].svalue);
                                $(this).find("span[id^='SBasis']").closest("td").find("input[id^='SValue']").val(MendatoryHandlingCharges[i].svalue);
                                $(this).find("span[id^='SBasis']").text(MendatoryHandlingCharges[i].sbasis);
                            }
                            $("input[id='Rate']").closest("table").find('tr').find('td').find("span[id='spnRate']").hide();
                            $("input[id^='Rate']").closest("td").find("input").css("display", "none");
                            $(this).find("div[id^=transActionDiv").hide();
                            $(this).find("[id^='PaymentMode']").eq(1).attr("checked", 'checked');
                            $(this).find("[id^='PaymentMode']").eq(0).attr("disabled", "disabled");
                        });
                    }
                    else {
                        $(this).find("input[id^='Text_ChargeName']").removeAttr('disabled');
                    }
                    $("input[id^='PValue']").closest("td").find("input").attr('disabled', 'disabled');
                    $("input[id^='SValue']").closest("td").find("input").attr('disabled', 'disabled');



                    $("div[id$='divareaTrans_tariff_tariffdohandlingcharge']").find("[id='areaTrans_tariff_tariffdohandlingcharge']").each(function () {
                        $(this).find("input[id^='ChargeName']").each(function () {
                            AutoCompleteForCTMCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, GatLUCValueOfAutocomplete, null, null, null, null, "getHandlingChargesIE", "", ULDTransferSNo, 0, userContext.CityCode, 2, "", "2", "999999999", "No", 0, 0, 1005, 2309);
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

                        $("div[id$='areaTrans_tariff_tariffdohandlingcharge']").find("[id^='ChargeName']").each(function (i, row) {
                            $("#Text_" + $(this).attr("name")).data('kendoAutoComplete').enable(false);
                        });

                        $('#spnWaveOff').hide();
                        $(this).find("input[id^='WaveOff']").hide();
                        $('#spnRate').hide();
                        $(this).find("input[id^='Rate']").hide();

                    });
                },
                error: function (xhr) {
                    var a = "";
                }
            });

        }
    });

}

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
    $(elem).find("input[id^='ChargeName']").each(function () {
        AutoCompleteForCTMCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, GatLUCValueOfAutocomplete, null, null, null, null, "getHandlingChargesIE", "", ULDTransferSNo, 0, userContext.CityCode, 2, "", "2", "999999999", "No", 0, 0, 1005, 2309);
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
    $('#spnRate').hide();
    $(elem).find("input[id^='WaveOff']").hide();
    $(elem).find("input[id^='Rate']").hide();
}

function ReBindCTMChargesItemAutoComplete(elem, mainElem) {
    $(elem).find("input[id^='ChargeName']").each(function () {
        AutoCompleteForCTMCharge($(this).attr("name"), "TariffHeadName", null, "TariffSNo", "TariffCode", null, GatLUCValueOfAutocomplete, null, null, null, null, "getHandlingChargesIE", "", ULDTransferSNo, 0, userContext.CityCode, 2, "", "2", "999999999", "No", 0, 0, 1005, 2309);
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
    $(elem).find("input[id^='WaveOff']").hide();
    $(elem).find("input[id^='Rate']").hide();
}

var pValue = 0;
var sValue = 0;
var type = 'ULD';
function GatLUCValueOfAutocomplete(valueId, value, keyId, key) {
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
                url: "Services/Tariff/ESSChargesService.svc/LUCGetChargeValue?TariffSNo=" + parseInt(key) + "&AWBSNo=" + parseInt(ULDTransferSNo) + "&ArrivedShipmentSNo=" + parseInt(0) + "&DestinationCity=" + userContext.CityCode + "&PValue=" + parseInt(0) + "&SValue=" + parseInt(0) + "&HAWBSNo=" + hawbSNo + "&MovementType=" + 2 + "&RateType=" + parseInt(0) + "&Remarks=" + type + "&FlightSNo=" + parseInt(0) + "&CTMSNo=" + parseInt(0) + "&ProcessSNo=" + parseInt(1005) + "&SubProcessSNo=" + parseInt(2309),
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
            url: "Services/Tariff/ESSChargesService.svc/LUCGetChargeValue?TariffSNo=" + parseInt(tariffSNo) + "&AWBSNo=" + parseInt(ULDTransferSNo) + "&ArrivedShipmentSNo=" + parseInt(0) + "&DestinationCity=" + userContext.CityCode + "&PValue=" + parseInt(pValue) + "&SValue=" + parseInt(sValue) + "&HAWBSNo=" + hawbSNo + "&MovementType=" + parseInt(2) + "&RateType=" + parseInt(0) + "&Remarks=" + 'ULD' + "&FlightSNo=" + parseInt(0) + "&CTMSNo=" + parseInt(0) + "&ProcessSNo=" + 1005 + "&SubProcessSNo=" + 2309,
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
                        $("span[id='SBasis']").closest("td").find("input[id^='_tempPValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
                        $("span[id='SBasis']").closest("td").find("input[id^='PValue']").val(Number(sValue) > 0 ? sValue : doItem.sValue);
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
}

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

function SaveLUCCharges() {
    cfi.ValidateSection("divLUCESS");
    if (!cfi.IsValidSection($("#divLUCESS"))) {
        return false;
    }
    var LUCChargeArray = [];
    $("div[id$='divareaTrans_tariff_tariffdohandlingcharge']").find("[id^='areaTrans_tariff_tariffdohandlingcharge']").each(function () {
        if ($(this).find("[id^='Text_ChargeName']").data("kendoAutoComplete").key() != "") {
            var LUCChargeViewModel = {
                SNo: $(this).find("td[id^='tdSNoCol']").html(),
                AWBSNo: ULDTransferSNo,
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
                //Mode: $(this).find("[id^='PaymentMode']:checked").val(),
                Mode: ($(this).find("[id^='PaymentMode']:checked").attr('data-radioval') == 'CREDIT' ? 1 : 0),
                ChargeTo: 0,
                pBasis: $(this).find("[id^='PBasis']").text(),
                sBasis: $(this).find("[id^='SBasis']").text(),
                Remarks: $(this).find("[id^='Remarks']")[1].innerText == undefined ? "" : $(this).find("[id^='Remarks']")[1].innerText.toUpperCase(),
                WaveoffRemarks: ''
            };
            LUCChargeArray.push(LUCChargeViewModel);

        }

    });

    var obj = {
        MomvementType: 2,
        Type: 'ULD',
        TypeValue: parseInt(ULDTransferSNo),
        BillTo: 'Airline',
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
            if (data != '' || data != '1') {
                alert('ESS Charge Applied Successfully for Invoice ' + data);
                ReloadSameGridPage(2309);
                if (ButtonProcess)
                    $(ButtonProcess).removeClass("incompleteprocess").addClass("completeprocess");
                $("#btnSave").remove();
            } else {
                ShowMessage('warning', 'Warning - ESS Charges', "Record Not Saved Please Try Again ", "bottom-right");
            }

        }
    });
}

function ReloadSameGridPage(subprocess) {
    var gridPage = $(".k-pager-input").find("input").val();
    var grid = $(".k-grid").data("kendoGrid");
    grid.dataSource.page(gridPage);
}


function Get_LUCAutoGenerateUcrUHf() {

    var ChklstUldStack = GetUldNo;
    $.ajax({
        url: "Services/Export/UldTransfer/LUCService.svc/Get_LUCAutoGenerateUcrUHf",
        async: false, type: "GET"
        , dataType: "json",
        data: { ChklstUldStack: ChklstUldStack }
        , contentType: "application/json;charset=utf-8", cache: false, success: function (response) {
            if (response.length > 0) {
                debugger;
                var v = $.parseJSON(response);
                $('#Text_UCRNumber').val(v.Table0[0].UCRReceiptNo);
                $('#Text_UCRCarrierCode').val(v.Table0[0].airlinecode);
                $('#Text_UHFNumber').val(v.Table0[0].UHFReceiptNo);
                $('#Text_UHFCarrierCode').val(v.Table0[0].airlinecode);
            }


        },
        error: function (xhr) {

        }
    });


}