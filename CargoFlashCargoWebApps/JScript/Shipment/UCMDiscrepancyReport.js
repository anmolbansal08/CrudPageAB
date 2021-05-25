var CCLOSED = "0";
var dataremarks = "";
var CRejected = "0";
var UCMS = "", SettledChecked = 0, FinalSettledChecked = 0;
$(document).ready(function () {
    PageType = getQueryStringValue("FormAction").toUpperCase();
    $("#divUCMDiscrepancyReport").load("HtmlFiles/Shipment/UCMDiscrepancyReportDetail.html", onLoad);
    $("#divUCMDiscrepancyReport").append("<input type='hidden' id='UCmSno-1' value='0' />")


});
var GlobalMultipleUldno = "";
function onLoad() {


    $("#tblRequest tbody").html('');
    var tr = "", tr1 = "", tr2 = ""
    var IsUCMInOut = "";
    $.ajax({
        url: "Services/Shipment/UCMDiscrepancyReportService.svc/UCMDiscrepancyReportDetail?UCMDiscrepancyReportSNo=" + getQueryStringValue("RecID").toUpperCase(),
        async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);

            var FinalData = ResultData.Table0;

            if (FinalData.length > 0) {


                if (FinalData[0].UCMSno != "") {
                    $("#UCmSno-1").val(FinalData[0].UCMSno);
                }
                $("#UCMSTATUS").text(FinalData[0].UCMRemarks);
                if (FinalData[0].UCMRemarks == "CLOSED") {
                    $("#execute").attr("disabled", true);
                    $("#chkSetall").prop("disabled", true);
                }
                else {
                    $("#execute").attr("disabled", false);
                    $("#chkSetall").prop("disabled", true);
                }
                UCMS = FinalData[0].UCMRemarks;

                for (var i = 0; i < FinalData.length; i++) {
                    var ID2 = i + 1;
                    // " + FinalData[i].UCMSno + "
                    if (ID2 == "1") {
                        IsUCMInOut = FinalData[i].IsUCMInOut
                        if (IsUCMInOut == "True") {
                            $("#UCMOUT").html("UCM OUT");
                            $("#UCMIN").html("UCM IN");
                        } else {
                            $("#UCMOUT").html("ALL RECEIVED");
                            $("#UCMIN").html("PROCESSED");
                        }

                        $("#UCMType").text(FinalData[i].UCMType)
                        $("#FLIGHTDATE").text(FinalData[i].Flightdate)
                        $("#FLIGHTNUMBER").text(FinalData[i].Flightno)





                        if (FinalData[i].UCMRemarks.trim().toUpperCase() == "CLOSED") {
                            CCLOSED = "1";
                        }

                    }

                    if (FinalData[i].Rejected != "") {
                        CRejected = "1";
                    }
                    tr += "<tr><td style='background-color: grey;width:30px;color: white;text-align: center;border: 1px solid #CCC'>" + ID2 + "</td>"
                    tr += "<td style='background-color: #a7c9f5;width:130px;color: #080b0c;text-align: center;border: 1px solid #CCC'>" + FinalData[i].AllReceived + "</td>"
                    tr += "<td style='background-color: #FFA500;width:130px;text-align: center;border: 1px solid #CCC'>" + FinalData[i].Processed + "</td>"
                    tr += "<td style='background-color: #4acfee;width:130px;text-align: center;border: 1px solid #CCC'>" + FinalData[i].Rejected + "</td>"
                    tr += "<td style='background-color: white;width:150px;text-align: center;border: 1px solid #CCC'>" + FinalData[i].Content + "</td>"
                    tr += "<td style='background-color: white;width:100px;text-align: center;border: 1px solid #CCC'>" + FinalData[i].Destination + "</td>"
                    tr += "<td style='background-color: white;width:100px;text-align: center;border: 1px solid #CCC'>" + FinalData[i].PreStation + "</td>"
                    tr += "<td style='background-color: white;text-align: center;border: 1px solid #CCC;width:200px;color:red'>" + FinalData[i].Remarks + "<input type='hidden' id='UCmSno-" + ID2 + "' value='" + FinalData[i].UCMSno + "' /></td>"
                    tr += "</tr>"
                    
                    GlobalMultipleUldno += ',' + FinalData[i].AllReceived;
                    if (FinalData[i].Remarks != "" || UCMS == "CLOSED") {
                        SettledChecked = 1
                    }

                    if (SettledChecked == 1) {
                        FinalSettledChecked = 1;
                    }
                }
                $("#tblRequest").append(tr)
                if (FinalSettledChecked == 1) {
                    $("#chkSetall").attr("disabled", true);
                } else if (FinalSettledChecked == 0) {
                    $("#chkSetall").attr("disabled", false);
                    $("#UCMSTATUS").text(" ");
                }
                if (UCMS.toUpperCase().trim() == "CLOSED") {
                    $("#chkSetall").prop("checked", true)
                }
                if (UCMS.toUpperCase() == "RESTRICTION ON OLD DATED UCM	".trim()) {
                    $("#chkSetall").attr("disabled", false);
                    $("#UCMSTATUS").text(UCMS)
                }
                if (UCMS.toUpperCase().trim().indexOf("DOES NOT EXIST") != -1) {
                    $("#chkSetall").attr("disabled", true);
                    $("#chkSetall").prop("checked", false)
                    $("#UCMSTATUS").text(UCMS)
                }
            }

        }

    });

}

function Btnexecute() {
    var EdiUcmId = "11";

    EdiUcmId = $("#UCmSno-1").val();

    if (EdiUcmId != "" && EdiUcmId !== undefined) {
        $.ajax({
            url: "Services/Shipment/UCMDiscrepancyReportService.svc/UCMDiscrepancyExicute?Edi_UCMID=" + EdiUcmId,
            async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                $("#DivUcmDes").hide()
                var ResultData = jQuery.parseJSON(result);
                var FinalData = ResultData.Table0;
                if (FinalData.length > 0) {
                    $("#Messgae").text(FinalData[0].ActualMessage)
                    $("#DivUcmDes").dialog({
                        modal: true,
                        draggable: true,
                        resizable: true,
                        position: ['center', 'top'],
                        show: 'blind',
                        hide: 'blind',
                        width: 800,
                        title: "UCM Discrepancy Report",
                        dialogClass: 'ui-dialog-osx',
                        buttons: {
                            "Re Execute": function () {
                                $(this).dialog("close");
                                var Messgae = $("#Messgae").val();
                                if (Messgae != "") {
                                    AganExecute(Messgae)
                                }
                            }
                        }
                    });
                }
            }
        });

    }



}

function BtnUCMCiscrepancyt() {

    var divContents = $('#PrintDiv').html();
    var printWindow = window.open('', '', '');
    printWindow.document.write('<html><head><title></title>' + css + '');
    printWindow.document.write('</head><body >');
    printWindow.document.write(divContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}


var css = ' <style>table {border-collapse: collapse; border-spacing: 0;}.UCMCiscrepancythead td {background-color: #4f8098;color: black;text-align: center;font-weight: bold;border: 1px solid #CCC;font-weight: bold;height: 30px !important;font-family: "Times New Roman", Times, serif;}'
    + '.tdReceived td {background-color: #2762af;color: black;text-align: center;border: 1px solid #CCC;font-weight: bold;font-family: "Times New Roman", Times, serif;}'
    + '.tdProcessed td {background-color: #FFA500;color: black;text-align: center;border: 1px solid #CCC;font-weight: bold;font-family: "Times New Roman", Times, serif;}'
    + '.tdRejected td {background-color: #4acfee;color: black;text-align: center;border: 1px solid #CCC;font-weight: bold;font-family: "Times New Roman", Times, serif;}'
    + '.tdremark td {background-color: #4acfee;color: black;text-align: center;border: 1px solid #CCC;font-weight: bold;font-family: "Times New Roman", Times, serif;}'
    + ' .tdsno {width:30px}</style>'

var SiteUrl = "";
function AganExecute(Messgae) {
  
    $.ajax({
        url: SiteUrl + "Services/CommonService.svc/InsertCIMPMessage", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ MessageText: btoa(Messgae), ReceivedFrom: 'test', MessageRecAddress: 'test' }),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result.trim().toUpperCase() == "MESSAGE VALIDATION FAILED".trim()) {
                ShowMessage('warning', '', result, "bottom-right");
            } else
            {
                //Added By Shivali Thakur
                BindULDTracking(0);
                ShowMessage('success', '', "Message Inserted Successfully", "bottom-right");
                $("#btnReload").attr("disabled", false)
            }
        }
    });


}
function BindULDTracking(Updationtype)
{
    var UCMType = $("#UCMType").text();
    var Flightno = $("#FLIGHTNUMBER").text();
    var FlightDate = $("#FLIGHTDATE").text();
    var Usersno = userContext.UserSNo;
   
    $.ajax({
        url: "Services/Shipment/UCMDiscrepancyReportService.svc/UCMDiscrepency_saveULDTracking?UCMType=" + UCMType + "&Flightno=" + Flightno + "&FlightDate=" + FlightDate + "&Usersno=" + Usersno + "&Updationtype=" + Updationtype + "&ULDNo=" + GlobalMultipleUldno,
        async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
           
        }
    });

}
function BtnUCMCiscrepancytUpdate() {
    var EdiUcmId = $("#UCmSno-1").val();
    if ($("#chkSetall").prop('checked') == true) {
        if (EdiUcmId != "" && EdiUcmId !== undefined) {
            $.ajax({
                url: "Services/Shipment/UCMDiscrepancyReportService.svc/BtnUCMCiscrepancytUpdate?Edi_UCMID=" + EdiUcmId,
                async: false, type: "get", dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var ResultData = jQuery.parseJSON(result);
                    var FinalData = ResultData.Table0;
                    if (FinalData[0].ReturnErrorNo == "0") {
                        BindULDTracking(1);
                        ShowMessage('success', '', "Saved successfully...", "bottom-right");
                        return;
                    } else if (FinalData[0].ReturnErrorNo == "1") {
                        ShowMessage('warning', 'Information', "Already closed !", "bottom-right");
                        return;
                    }
                }
            });
        }
    }
    else {
        ShowMessage('warning', 'Information!', "Please check Settled checkbox.", "bottom-right");
    }
}
// Add By Sushant On 18-01-2018 

function BtnUCMCiscrepancytReload() {
    FinalSettledChecked = 0;
    SettledChecked = 0
    if (dataremarks > -1) {
        $("#chkSetall").prop("disabled", true);
        $("#execute").attr("disabled", true);
    }

    $("#tblRequest tbody").html('');
    var tr = "", tr1 = "", tr2 = ""
    var IsUCMInOut = "";
    $.ajax({
        url: "Services/Shipment/UCMDiscrepancyReportService.svc/UCMDiscrepancyReportDetail?UCMDiscrepancyReportSNo=" + getQueryStringValue("RecID").toUpperCase(),
        async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var ResultData = jQuery.parseJSON(result);

            var FinalData = ResultData.Table0;
            if (FinalData.length > 0) {

                if (FinalData[0].UCMSno != "") {
                    $("#UCmSno-1").val(FinalData[0].UCMSno);
                }

                $("#UCMSTATUS").text(FinalData[0].UCMRemarks);
                UCMS = FinalData[0].UCMRemarks;
                for (var i = 0; i < FinalData.length; i++) {
                    var ID2 = i + 1;
                    if (ID2 == "1") {
                        IsUCMInOut = FinalData[i].IsUCMInOut
                        if (IsUCMInOut == "True") {
                            $("#UCMOUT").html("UCM OUT");
                            $("#UCMIN").html("UCM IN");
                        } else {
                            $("#UCMOUT").html("ALL RECEIVED");
                            $("#UCMIN").html("PROCESSED");
                        }

                        $("#UCMType").text(FinalData[i].UCMType)
                        $("#FLIGHTDATE").text(FinalData[i].Flightdate)
                        $("#FLIGHTNUMBER").text(FinalData[i].Flightno)

                        if (FinalData[i].UCMRemarks.trim().toUpperCase() == "CLOSED") {
                            CCLOSED = "1";
                        }

                    }

                    if (FinalData[i].Rejected != "") {
                        CRejected = "1";
                    }
                    tr += "<tr><td style='background-color: grey;width:30px;color: white;text-align: center;border: 1px solid #CCC'>" + ID2 + "</td>"
                    tr += "<td style='background-color: #a7c9f5;width:130px;color: #080b0c;text-align: center;border: 1px solid #CCC'>" + FinalData[i].AllReceived + "</td>"
                    tr += "<td style='background-color: #FFA500;width:130px;text-align: center;border: 1px solid #CCC'>" + FinalData[i].Processed + "</td>"
                    tr += "<td style='background-color: #4acfee;width:130px;text-align: center;border: 1px solid #CCC'>" + FinalData[i].Rejected + "</td>"
                    tr += "<td style='background-color: white;width:150px;text-align: center;border: 1px solid #CCC'>" + FinalData[i].Content + "</td>"
                    tr += "<td style='background-color: white;width:100px;text-align: center;border: 1px solid #CCC'>" + FinalData[i].Destination + "</td>"
                    tr += "<td style='background-color: white;width:100px;text-align: center;border: 1px solid #CCC'>" + FinalData[i].PreStation + "</td>"
                    tr += "<td style='background-color: white;text-align: center;border: 1px solid #CCC;width:200px;color:red'>" + FinalData[i].Remarks + "<input type='hidden' id='UCmSno-" + ID2 + "' value='" + FinalData[i].UCMSno + "' /></td>"
                    tr += "</tr>"
                    GlobalMultipleUldno += ',' + FinalData[i].AllReceived;
                    if (FinalData[i].Remarks != "" || UCMS == "CLOSED") {
                        SettledChecked = 1

                    }
                    if (SettledChecked == 1) {
                        FinalSettledChecked = 1;
                    }
                }
                $("#tblRequest").append(tr)
                if (FinalSettledChecked == 1) {
                    $("#chkSetall").attr("disabled", true);
                } else if (FinalSettledChecked == 0) {
                    $("#chkSetall").attr("disabled", false);
                    $("#UCMSTATUS").text(" ");
                }
                if (UCMS.toUpperCase().trim() == "CLOSED") {
                    $("#chkSetall").prop("checked", true)
                }
                if (UCMS.toUpperCase() == "RESTRICTION ON OLD DATED UCM	".trim()) {
                    $("#chkSetall").attr("disabled", false);
                    $("#UCMSTATUS").text(UCMS)
                }
                if (UCMS.toUpperCase().trim().indexOf("DOES NOT EXIST") != -1) {
                    $("#chkSetall").attr("disabled", true);
                    $("#UCMSTATUS").text(UCMS)
                }




            }
        }

    });

}