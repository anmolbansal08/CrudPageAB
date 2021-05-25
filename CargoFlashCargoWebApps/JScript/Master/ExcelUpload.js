//$(function () {
$(document).ready(function (e) {
    //alert('1');
    $('#ExcelFile').val('');
    
    $('#Text_PageSNo').val('');
    $('input[type=radio][name^=RateType][value=PublishRate]').prop("checked", false);
    $('input[type=radio][name^=RateType][value=AgentSpecificRate]').prop("checked",false)
    $('input[type=radio][name^=RateType][value=AllotmentRate]').prop("checked",false)
    $('input[type=radio][name^=RateType][value=MailRating]').prop("checked", false)
    $('input[type=radio][name^=UploadActive][value=UpdateRate]').prop("checked", false)
    $('input[type=radio][name^=UploadActive][value=InactiveRate]').prop("checked", false)

    $("#tdrateType").hide();
    $("#tdRateFormat").hide();
    $("#tdUserFormat").hide();
    $("#tdAccountFormat").hide();
    $("#tdExchangeRateFormat").hide();
    $("#tduploadActive").hide();
    $("#tdInactiveRateFormat").hide();
    $("#tdManageOtherCharges").hide();
    $("#tblOthercharge").hide();

    //setTimeout(2500);
    //  $('input[name=operation]').remove();
    //$('input[type=button][value=Back]').before('<input type="button" tabindex="4" class="btn btn-success" name="Upload" id="Upload" style="width:80px;" value="Upload">');
    //cfi.AutoComplete("PageSNo", "PageName", "vwExcelPages", "SNo", "PageName", ["PageName"], GetSampleFile, "contains");
    cfi.AutoCompleteV2("PageSNo", "PageName", "Master_PageName");
   // cfi.AutoComplete("PageSNo", "PageName", "vwExcelPages", "SNo", "PageName");
    //$('#Upload').click(function () {
    //});

});

function UploadFile() {

    var filename = $('#ExcelFile').val();
    if (filename != '')
    {
        var PageName = $('#Text_PageSNo').val();
        if(PageName != "")
        {
            if(PageName == 'RATE')
            {
                //var RateType = $('#RateType').val();
                //alert(RateType);
                if ($('input[type=radio][name^=UploadActive][value=UpdateRate]').prop("checked") == true) {
                    
                    if ($('input[type=radio][name^=RateType][value=PublishRate]').prop("checked") == true || $('input[type=radio][name^=RateType][value=AgentSpecificRate]').prop("checked") == true || $('input[type=radio][name^=RateType][value=AllotmentRate]').prop("checked") == true || $('input[type=radio][name^=RateType][value=MailRating]').prop("checked")) {

                    }
                    else {
                        alert("Please Select Rate Type");
                        return false;
                    }
                }

            }
        }
        else {
            alert("Please Select Page Name");
            return false;
        }
    }
    else {
        alert("Please Select Excel File");
        return false;
    }
    
}

function GetSampleFile() {
    $('#SampleFileLink').remove();
    var PageSNo = $("#PageSNo").val();
    alert(PageSNo.length);
    //if (PageSNo.length > 0) {
    $.ajax({
        url: "GetSampleFile", async: false, type: "POST", dataType: "json", cache: false,
        data: JSON.stringify({ SNo: PageSNo }),
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var FinalData = result.Table0;
            FinalData[0].PageExcelSampleName
            alert(FinalData[0].PageExcelSampleName);
            if (FinalData[0].PageExcelSampleName != "") {
                $("#ExcelFile").after('<a id="SampleFileLink" href="UploadDoc/ExcelDocs/' + FinalData[0].PageExcelSampleName + '">Download Format Sample</a>')
            }
            
        }
    });
    //}


}

function ValidateData() {
    $("#ValidationDialog").html('');
    $("#ValidationDialog").append('<table  id="ValidateDataTbl" style="margin: 0px auto; border: 1px solid black; border-collapse: collapse;"></table>');

    var Str = '<tr><th class="ui-widget-header" style="width:5%; border: 1px solid black; "><span>S.No.</span></th><th class="ui-widget-header" style="width:15%;text-align:center; border: 1px solid black; "><span>Flight No</span></th><th class="ui-widget-header" style="width:15%;text-align:center; border: 1px solid black; "><span>Flight Date </span></th><th class="ui-widget-header" style="width:65%; text-align:center; border: 1px solid black; "><span>Message</span></th></tr>';

    if (es.Table1 != "") {

        for (var i = 0; i < es.Table1.length; i++) {
            Str += '<tr> <td  style="width:5%; border: 1px solid black;text-align:center; ">' + es.Table1[i].RSNo + '</td> <td style="width:15%; border: 1px solid black; text-align:center; ">' + es.Table1[i].FlightNo + '</td> <td style="width:15%; border: 1px solid black; text-align:center; color:red; ">' + es.Table1[i].AllotmentDate + '</td> <td style="width:65%; border: 1px solid black; text-align:left; color:red; ">' + es.Table1[i].ErrorMessage + '</td> </tr>';
        }
        $('#ValidateDataTbl').append(Str);
    }
}


function ValidationDialog() {

    $("#ValidationDialog").dialog(
    {
        autoResize: true,
        maxWidth: 650,
        maxHeight: 550,
        width: 650,
        height: 350,
        modal: true,
        title: 'In-Valid Records',
        draggable: true,
        resizable: false,
        buttons: {
            Cancel: function () {
                //$(this).dialog("close");
                DataIsValid = false;
                return false;
            }
        },
        close: function () {
            //  DataIsValid = false;
            $(this).dialog("close");
            return false;
        }
    });
}

$(document).change("#Text_PageSNo", function () {
//$("#Text_PageSNo").select(function () {
    if ($("#Text_PageSNo").val() == "RATE" || $("#Text_PageSNo").val() == "CARGO RATES") {
        $("#tduploadActive").show();
        $("#tdrateType").hide();

        if ($('input[type=radio][name^=UploadActive][value=UpdateRate]').prop("checked"))
        {
            $("#tdrateType").show();
            $("#tdRateFormat").show();
            $("#tdInactiveRateFormat").hide();
        }
        else if ($('input[type=radio][name^=UploadActive][value=InactiveRate]').prop("checked"))
        {
            $("#tdrateType").hide();
            $("#tdRateFormat").hide();
            $("#tdInactiveRateFormat").show();
        }  
        $("#tdAccountFormat").hide();
        $("#tdUserFormat").hide();
        $("#tdExchangeRateFormat").hide(); 
        $("#tdManageOtherCharges").hide();
        $("#tblOthercharge").hide();
    }
    
    else if ($("#Text_PageSNo").val() == "USER") {
        $("#tdUserFormat").show();
        $("#tdrateType").hide();
        $("#tdRateFormat").hide();
        $("#tdAccountFormat").hide();
        $("#tdExchangeRateFormat").hide();
        $("#tduploadActive").hide();
        $("#tdInactiveRateFormat").hide();   
        $("#tdManageOtherCharges").hide();
        $("#tblOthercharge").hide();
    }
    else if ($("#Text_PageSNo").val() == "ACCOUNT") {
        $("#tdAccountFormat").show();
        $("#tdrateType").hide();
        $("#tdRateFormat").hide();
        $("#tdUserFormat").hide();
        $("#tdExchangeRateFormat").hide();
        $("#tduploadActive").hide();
        $("#tdInactiveRateFormat").hide();
        $("#tdManageOtherCharges").hide();
        $("#tblOthercharge").hide();
    }
    else if ($("#Text_PageSNo").val() == "EXCHANGE RATE") {
        $("#tdExchangeRateFormat").show();
        $("#tdAccountFormat").hide();
        $("#tdrateType").hide();
        $("#tdRateFormat").hide();
        $("#tdUserFormat").hide();
        $("#tduploadActive").hide();
        $("#tdInactiveRateFormat").hide();
        $("#tdManageOtherCharges").hide();
        $("#tblOthercharge").hide();
    }
    else if ($("#Text_PageSNo").val() == "MANAGE OTHER CHARGES") {
       
        $("#tblOthercharge").show();
        $("#tdExchangeRateFormat").hide();
        $("#tdAccountFormat").hide();
        $("#tdrateType").hide();
        $("#tdRateFormat").hide();
        $("#tdUserFormat").hide();
        $("#tduploadActive").hide();
        $("#tdInactiveRateFormat").hide();
        $("#tdManageOtherCharges").show();
    }
    else {
        $("#tdrateType").hide();
        $("#tdRateFormat").hide();
        $("#tdAccountFormat").hide();
        $("#tdUserFormat").hide();
        $("#tdExchangeRateFormat").hide();
        $("#tduploadActive").hide();
        $("#tdInactiveRateFormat").hide();
        $("#tdManageOtherCharges").hide();
        $("#tblOthercharge").hide();
    }
});


