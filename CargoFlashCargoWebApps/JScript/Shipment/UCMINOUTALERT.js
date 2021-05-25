$(document).ready(function () {
    cfi.ValidateForm();

    cfi.AutoCompleteV2("FlightNo", "FlightNo", "Shipment_UCMINOUT_FlightNo");
    
    cfi.AutoCompleteV2("OriginAirportCode", "AirportCode", "Shipment_UCMINOUT_AirportCode");
    cfi.AutoCompleteV2("DestinationAirportCode", "AirportCode", "Shipment_UCMINOUT_AirportCode");
   
    $('#SearchUCMINOutAlert').click(function (evt) {
        if (cfi.IsValidSubmitSection()) {
            BindGrid();
            //$("#tblMessageType").append("<div style='display: none'><form method='post' name='aspnetForm' id='aspnetForm' ><input type='hidden' id='hdnadd' name='hdnadd' value=''><input type='hidden' name='SitaAddress' id='SitaAddress' value=''><table class='WebFormTable' id='tbl' validateonsubmit='true'><tbody><tr> <td class='formSection' colspan='4'>UCMInOutAlert</td></tr> <tr><td class='formActiontitle' colspan='4'><div class='MandatoryTextCss'><font color='red'><br />*</font> Mandatory Fields </div></td></tr><tr><td class='formSection' colspan='4'>UCM In/Out Alert Message</td> </tr><tr> <td class='formlabel' title='Enter Free Text:' style='text-align: left;'><font color='red'>*</font><span id='spnTeleTextMessage'>Message:</span></td><td class='formInputcolumn><textarea class='k-input' name='UCMInOutAlertMessage' id='UCMInOutAlertMessage' style='width: 454px; height: 137px; text-transform: uppercase;' controltype='default' data-valid='required' data-valid-msg='Free Text can not be blank' tabindex='1' maxlength='1000' data-role='alphabettextbox' autocomplete='off'></textarea></td></tr> <tr> <td class='formlabel' title='' style='background-color: rgb(255, 255, 255); border-right: none;'></td> <td class='formInputcolumn'>&nbsp;</td> </tr><tr> <td class='formlabel' title='Select Email:' style='text-align: left;'><font color='red'>*</font><span id='spnEmailAddress'>Email:</span></td> <td class='formInputcolumn'> <input type='hidden' name='EmailAddress' id='EmailAddress' value=''><input type='text' class='' name='Text_EmailAddress' id='Text_EmailAddress' style='width: 300px;' data-valid='required' data-valid-msg='Email can not be blank' tabindex='5' controltype='autocomplete' maxlength='198' value=''><input type='hidden' id='hdnmail' name='hdnmail' value=''><span class='k-label'>(Press enter key to capture receiver E-mail Address and Add New E-mail ( If Required))</span><div id='divmailAdd' style='overflow: auto;'><ul id='addlist1' style='padding: 3px 2px 2px 0px; margin-top: 0px;'></ul></div></td><td class='formlabe' title='' style='background-color: rgb(255, 255, 255); border-right: none;'></td> <td class='formInputcolumn'>&nbsp;</td></tr></tbody></table><input type='button' id='SendMessage' value='Send Message'></form></div>");

        }
    });
   
});


function BindWhereCondition() {
    
    var d = new Date($("#ValidTo").attr("sqldatevalue"));
    var d1 = new Date($("#ValidFrom").attr("sqldatevalue"));
    var dd = ((parseInt(d.getDate()) < 10) ? ('0' + d.getDate()) : d.getDate());
    var mm = ((parseInt(d.getMonth() + 1) < 10) ? ('0' + (d.getMonth() + 1)) : (d.getMonth() + 1));
    var dd1 = ((parseInt(d1.getDate()) < 10) ? ('0' + d1.getDate()) : d1.getDate());
    var mm1 = ((parseInt(d1.getMonth() + 1) < 10) ? ('0' + (d1.getMonth() + 1)) : (d1.getMonth() + 1));
    var toDate = d.getFullYear() + "-" + mm + "-" + dd;
    var fromDate = d1.getFullYear() + "-" + mm1 + "-" + dd1;
    var WhereCondition = "Flightdate BETWEEN CAST('" + fromDate + "' AS DATE) AND CAST('" + toDate + "' AS DATE) ";
    WhereCondition += $("#Text_FlightNo").data("kendoAutoComplete").key() != "" ? "AND FlightNo='" + $("#Text_FlightNo").data("kendoAutoComplete").key() + "'" : "";
    WhereCondition += $("#Text_OriginAirportCode").data("kendoAutoComplete").key() != "" ? "AND OriginAirportSNo='" + $("#Text_OriginAirportCode").data("kendoAutoComplete").key() + "'" : "";
    WhereCondition += $("#Text_DestinationAirportCode").data("kendoAutoComplete").key() != "" ? "AND DestinationAirportSNo='" + $("#Text_DestinationAirportCode").data("kendoAutoComplete").key() + "'" : "";
    return WhereCondition;
}

var wCondition = "";
function BindGrid() {

    wCondition = BindWhereCondition();
    $('#tblUCMInOutAlert').appendGrid({
        tableID: 'tblUCMInOutAlert',
        contentEditable: true,
        isGetRecord: true,
        caption: 'UCM In Out Alert',
        captionTooltip: 'UCM In Out Alert',
        currentPage: 1, itemsPerPage: 50, whereCondition: wCondition, sort: "",
        servicePath: 'Services/Shipment/UCMInOutAlertService.svc',
        getRecordServiceMethod: 'getUCMINOutAlertDetails',
        masterTableSNo: 1,
        columns: [
        { name: 'DailyFlightSNo', type: 'hidden' },
        { name: 'DailyFlightNo', type: 'hidden' },
        { name: 'FlightNo', display: 'Flight No', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
        { name: 'FlightDate', display: 'Flight Date', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
        { name: 'OriginAirportSNo', display: 'Origin ', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
        { name: 'DestinationAirPortSNo', display: 'Destination ', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
        { name: 'ATD', display: 'ATD', type: 'label', isRequired: false },
        { name: 'ATA', display: 'ATA', type: 'label', isRequired: false },
        { name: 'UCMOutAlertCount', display: 'UCMOut Alert Count', type: 'label', ctrlAttr: { controltype: 'label' }, ctrlCss: { width: '25px' } },
        { name: 'UCMInAlertCount', display: 'UCMIn Alert Count', type: 'label', ctrlAttr: { controltype: 'label' }, ctrlCss: { width: '25px' } },
        //{ name: 'EmailCount', display: 'Email Count', type: 'label', ctrlAttr: { controltype: 'label' }, ctrlCss: { width: '80px', height: '20px' } },
        { name: 'AlertEmail', display: 'Alert Email', type: 'button', ctrlAttr: { controltype: 'button' ,onclick: "return SendMessage(this.id);" }, ctrlCss: { width: '50px', height: '15px' } }],
             
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            $("tr[id^='tblUCMInOutAlert_Row_']").each(function (row, tr) {
                $(tr).find("input[id^='tblUCMInOutAlert_AlertEmail_']").attr('value', 'Send');               
            });
        },

        isPaging: false,
        isExtraPaging: false,
        hideButtons: { remove: true, removeLast: true, insert: true, append: true, updateAll: true }

    });
    $("tr[id^='tblUCMInOutAlert_Row_']").each(function (row, tr) {
        $(tr).find("input[id^='tblUCMInOutAlert_AlertEmail_']").attr('value', 'Send');
    });
}
var count = 0;
var DailyFlightSNO;
function SendMessage(input)
{
    var ClosestTr = $("#" + input).closest("tr")
    DailyFlightSNO = ClosestTr.find("input[id^='tblUCMInOutAlert_DailyFlightSNo'").val();
    var DailyFlightNo = ClosestTr.find("input[id^='tblUCMInOutAlert_DailyFlightNo'").val();
    $.ajax({

        url: "Services/Shipment/UCMInOutAlertService.svc/getUCMINOutAlertULDDetails?DailyFlightSNO=" + DailyFlightSNO, async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (data) {
            //alert(data);
            var processdata = jQuery.parseJSON(data);
            var ULDData = processdata.Table0;
            var Emailid = processdata.Table1;


            if( processdata.Table1.length > 0)
            {
              var Item1 = Emailid[0];
            }
           
              var Item = ULDData[0];
           
            //alert(Item.UldDetails + '' + Item1.EmailAddress);
            $("#Text_EmailAddress").val("");
            cfi.PopUp("tblMessageType", "Message Type Details", "600");
            $("#txtMessageType").remove();
            $('#Re_execute').remove();
            if (count == 0) {
                $("#tblMessageType").append("<div><form method='post' name='aspnetForm' id='aspnetForm' ><input type='hidden' id='hdnadd' name='hdnadd' value=''><input type='hidden' name='SitaAddress' id='SitaAddress' value=''><table class='WebFormTable' id='tbl' validateonsubmit='true'><tbody><tr> <td class='formSection' colspan='4'>UCMInOutAlert</td></tr> <tr><td class='formActiontitle' colspan='4'><div class='MandatoryTextCss'><font color='red'><br />*</font> Mandatory Fields </div></td></tr><tr><td class='formSection' colspan='4'>UCM In/Out Alert Message</td> </tr><tr> <td class='formlabel' title='Enter Free Text:' style='text-align: left;'><font color='red'>*</font><span id='spnTeleTextMessage'>Message:</span></td><td class='formInputcolumn'><textarea class='k-input' name='UCMInOutAlertMessage' id='UCMInOutAlertMessage' style='width: 454px; height: 137px; text-transform: uppercase;' controltype='default' data-valid='required' data-valid-msg='Free Text can not be blank' tabindex='1' maxlength='1000' data-role='alphabettextbox' autocomplete='off'></textarea></td></tr> <tr> <td class='formlabel' title='' style='background-color: rgb(255, 255, 255); border-right: none;'></td> <td class='formInputcolumn'>&nbsp;</td> </tr><tr> <td class='formlabel' title='Select Email:' style='text-align: left;'><font color='red'>*</font><span id='spnEmailAddress'>Email:</span></td> <td class='formInputcolumn'> <input type='hidden' name='EmailAddress' id='EmailAddress' value=''><input type='text' class='' name='Text_EmailAddress' id='Text_EmailAddress' style='width: 454px;' data-valid='required' data-valid-msg='Email can not be blank' tabindex='5' controltype='autocomplete' maxlength='198' value=''><input type='hidden' id='hdnmail' name='hdnmail' value=''><span class='k-label'>(Press enter key to capture receiver E-mail Address and Add New E-mail ( If Required))</span><div id='divmailAdd' style='overflow: auto;'><ul id='addlist1' style='padding: 3px 2px 2px 0px; margin-top: 0px;'></ul></div></td><td class='formlabe' title='' style='background-color: rgb(255, 255, 255); border-right: none;'></td> <td class='formInputcolumn'>&nbsp;</td></tr></tbody></table><input type='button' id='SendAlertMessage'  value='Send Message' onclick='SendEmail();'></form></div>");
                count++
            }
                if(typeof Item1 != 'undefined'){
                $("#Text_EmailAddress").val(Item1.EmailAddress);
                }
                if (typeof Item != 'undefined') {
                    $("#UCMInOutAlertMessage").html('Flight No-: ' + DailyFlightNo + '.ULD No-:' + Item.UldDetails);

                }
          
           
        }

    });

    

}
function  SendEmail()
{
    //var MailSubject = 'UCM OUT ALERT'
    var MailTo = $("#Text_EmailAddress").val();
    var MailBody = $("#UCMInOutAlertMessage").val();

    $.ajax({

        url: "Services/Shipment/UCMInOutAlertService.svc/SendUCMINOutAlertULDDetails?MailTo=" + MailTo + "&MailBody=" + MailBody + "&DailyFlightSNO=" + DailyFlightSNO, async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result != null) {
                var MsgTable = jQuery.parseJSON(result);
                var MsgData = MsgTable.Table0;
                if (MsgData[0].ErrorMessage == "Success") {
                    ShowMessage('success', 'Success -Message Sent Successfully', "Update Successfully", "bottom-right");
                    $("#tblMessageType").data("kendoWindow").close();
                    BindGrid();
                    $("#Text_EmailAddress").val('');
                   // $("#UCMInOutAlertMessage").val('');
                    
                } else {
                    ShowMessage('warning', 'warning - UCM IN/OUT ALERT', "unable to process", "bottom-right");
                }
                $("#txtMessageType").remove();
            }
        }
    });
}


































//$(document).ready(function ()
//{
//    debugger;

//    //$("#btnRefresh").click(function (evt)
//    //{
//    BindEventMessageTrans();
//    //});
//});
//function BindEventMessageTrans()
//{
//    var CreateGrid = "CreateGrid";
//    var GetRecord = "GetProcessDependencyGridAppendGrid";
//    var controlType = getQueryStringValue("FormAction").toUpperCase() == 'READ' ? "Label" : "text";
//    $('#tbl' + ProcessDependencyTrans).appendGrid({
//        tableID: 'tbl' + ProcessDependencyTrans,
//        contentEditable: true,
//        masterTableSNo: $("#hdnEditSno").val(),
//        currentPage: 1, itemsPerPage: 10, whereCondition: null,
//        servicePath: 'Services/Permissions/ProcessDependencyService.svc',
//        getRecordServiceMethod: GetRecord,
//        createUpdateServiceMethod: '',
//        caption: "Process",
//        initRows: 1,
//        isGetRecord: true,
//        hideButtons: { updateAll: true, insert: true },
//        columns: [{ name: 'SNo', type: 'hidden' },
//                  { name: "SubProcessName", display: "Sub Process", ctrlClass: 'classSubProcessName', type: controlType, ctrlAttr: { maxlength: 100, controltype: "autocomplete", onSelect: "return AWBShow(this);" }, ctrlCss: { width: "250px" }, tableName: "vProcessSubprocess", textColumn: "SubProcessName", keyColumn: "SNo", filterCriteria: "contains", },
//                 { name: "AWBStatusType", display: "AWB Staus", type: controlType, ctrlAttr: { maxlength: 100, controltype: "autocomplete", onSelect: "return SubProcessShow(this);" }, ctrlCss: { width: "100px" }, tableName: "vwAWBStatusMessageType", textColumn: "AWBStatusType", keyColumn: "SNo", filterCriteria: "contains" },
//                   { name: "DependSubProcessName", display: "Dependent Sub Process", ctrlClass: 'classDependSubProcessName', type: controlType, ctrlAttr: { maxlength: 100, controltype: "autocomplete" }, ctrlCss: { width: "250px" }, tableName: "vProcessSubprocess", textColumn: "SubProcessName", keyColumn: "SNo", filterCriteria: "contains", separator: ",", isRequired: false },
//                   {
//                       name: "ReturnMessage", display: "Message", type: 'textarea', ctrlClass: 'classReturnMessage', type: controlType, ctrlAttr: { maxlength: 100, controltype: "textarea" }, ctrlCss: { width: "250px", height: "45px" }, isRequired: false
//                   },
//        ],
//        afterRowAppended: function (caller, parentRowIndex, addedRowIndex)
//        {
//            $("tr[id^='tblProcessDependencyTrans_Row']").each(function (row, tr)
//            {
//                $(tr).find("input[id^='tblProcessDependencyTrans_SubProcessName_']").attr("width", "100px");
//                $(tr).find("input[id^='tblProcessDependencyTrans_DependSubProcessName_']").attr("data-valid", "required");
//                $(tr).find("input[id^='tblProcessDependencyTrans_DependSubProcessName_']").attr("width", "100px");
//                $(tr).find("input[id^='tblProcessDependencyTrans_ReturnMessage_']").attr("data-valid", "required");
//                $(tr).find("input[id^='tblProcessDependencyTrans_ReturnMessage_']").attr("width", "100px");
//            });
//        },
//    });
//}

//function BindGrid()
//{
//    function BindEventMessageTrans() {
//        var ProcessDependencyTrans = "ProcessDependencyTrans";
//        var GetRecord = "GetProcessDependencyGridAppendGrid";
//        var controlType = getQueryStringValue("FormAction").toUpperCase() == 'READ' ? "Label" : "text";
//        $('#tbl' + ProcessDependencyTrans).appendGrid({
//            tableID: 'tbl' + ProcessDependencyTrans,
//            contentEditable: true,
//            masterTableSNo: $("#hdnEditSno").val(),
//            currentPage: 1, itemsPerPage: 10, whereCondition: null,
//            servicePath: 'Services/Permissions/ProcessDependencyService.svc',
//            getRecordServiceMethod: GetRecord,
//            createUpdateServiceMethod: '',
//            caption: "Process",
//            initRows: 1,
//            isGetRecord: true,
//            hideButtons: { updateAll: true, insert: true },
//            columns: [{ name: 'SNo', type: 'hidden' },
//                      { name: "SubProcessName", display: "Sub Process", ctrlClass: 'classSubProcessName', type: controlType, ctrlAttr: { maxlength: 100, controltype: "autocomplete", onSelect: "return AWBShow(this);" }, ctrlCss: { width: "250px" }, tableName: "vProcessSubprocess", textColumn: "SubProcessName", keyColumn: "SNo", filterCriteria: "contains", },
//                     { name: "AWBStatusType", display: "AWB Staus", type: controlType, ctrlAttr: { maxlength: 100, controltype: "autocomplete", onSelect: "return SubProcessShow(this);" }, ctrlCss: { width: "100px" }, tableName: "vwAWBStatusMessageType", textColumn: "AWBStatusType", keyColumn: "SNo", filterCriteria: "contains" },
//                       { name: "DependSubProcessName", display: "Dependent Sub Process", ctrlClass: 'classDependSubProcessName', type: controlType, ctrlAttr: { maxlength: 100, controltype: "autocomplete" }, ctrlCss: { width: "250px" }, tableName: "vProcessSubprocess", textColumn: "SubProcessName", keyColumn: "SNo", filterCriteria: "contains", separator: ",", isRequired: false },
//                       {
//                           name: "ReturnMessage", display: "Message", type: 'textarea', ctrlClass: 'classReturnMessage', type: controlType, ctrlAttr: { maxlength: 100, controltype: "textarea" }, ctrlCss: { width: "250px", height: "45px" }, isRequired: false
//                       },
//            ],
//            afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
//                $("tr[id^='tblProcessDependencyTrans_Row']").each(function (row, tr) {
//                    //$(tr).find("input[id^='tblProcessDependencyTrans_SubProcessName_']").attr("data-valid", "required");
//                    //$(tr).find("input[id^='tblProcessDependencyTrans_HdnSubProcessName_']").attr("data-valid", "required");
//                    $(tr).find("input[id^='tblProcessDependencyTrans_SubProcessName_']").attr("width", "100px");
//                    $(tr).find("input[id^='tblProcessDependencyTrans_DependSubProcessName_']").attr("data-valid", "required");
//                    $(tr).find("input[id^='tblProcessDependencyTrans_DependSubProcessName_']").attr("width", "100px");
//                    $(tr).find("input[id^='tblProcessDependencyTrans_ReturnMessage_']").attr("data-valid", "required");
//                    $(tr).find("input[id^='tblProcessDependencyTrans_ReturnMessage_']").attr("width", "100px");


//                });
//            },
//        });
//        // Remove requied for exist data
//        $("tr[id^=tblProcessDependencyTrans_Row]").each(function ()
//        {
//            if ($(this).find("input[id^='tblProcessDependencyTrans_SubProcessName']").data("kendoAutoComplete").key() != "")
//                $(this).find("input[id^='tblProcessDependencyTrans_SubProcessName']").removeAttr("required");

//            if ($(this).find("input[id^='tblProcessDependencyTrans_AWBStatusType']").data("kendoAutoComplete").key() != "")
//                $(this).find("input[id^='tblProcessDependencyTrans_AWBStatusType']").removeAttr("required");

//        });
//        if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
//            $("tr[id^=tblProcessDependencyTrans_Row_]").each(function () {

//                if ($(this).find("input[id^='tblProcessDependencyTrans_SubProcessName_']").val() == "") {
//                    $(this).find("input[id^='tblProcessDependencyTrans_SubProcessName_']").data("kendoAutoComplete").enable(false);
//                }
//                if ($(this).find("input[id^='tblProcessDependencyTrans_AWBStatusType_']").val() == "") {
//                    $(this).find("input[id^='tblProcessDependencyTrans_AWBStatusType_']").data("kendoAutoComplete").enable(false);
//                }
//                $(".k-i-arrow-s").attr("disabled", "disabled");
//            });
//        }
//    }
//    //alert("GOOD");
//    //wCondition = BindWhereCondition();
//    $('#tblUcmInOut').appendGrid({
//        //tableID: 'tblUcmInOut',
//        //contentEditable: true,
//        //isGetRecord: true,
//        //masterTableSNo: 1,
//        //caption: 'UCM In Out Details',
//        //captionTooltip: 'UCM In/Out Details',
//        //currentPage: 1, itemsPerPage: 30, whereCondition: "", sort: "",
//        //servicePath: 'Services/Shipment/UCMInOutAlertService.svc',
//        //getRecordServiceMethod: 'getUCMINOutAlertDetails',
      




//        tableID: 'tblUcmInOut',
//        contentEditable: true,
//        masterTableSNo: 1,
//        currentPage: 1, itemsPerPage: 10, whereCondition: null,
//        servicePath: 'Services/Shipment/UCMInOutAlertService.svc',
//        getRecordServiceMethod: 'getUCMINOutAlertDetails',
//        createUpdateServiceMethod: '',
//        caption: "Process",
//        initRows: 1,
//        isGetRecord: true,
//        columns: [
//        { name: 'FlightNo', display: 'Flight No', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
//        { name: 'FlightDate', display: 'Flight Date', type: 'label', ctrlCss: { width: '50px' }, isRequired: false },
//        { name: 'OriginAirportSNo', display: 'Origin AirPort', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
//        { name: 'DestinationAirPortSNo', display: 'Destination AirPort', type: 'label', ctrlCss: { width: '40px' }, isRequired: false },
//        { name: 'ATD', display: 'ATD', type: 'label', isRequired: false },
//        { name: 'ATA', display: 'ATA', type: 'label', isRequired: false },
//        { name: 'UCMOut', display: 'UCMOut', type: 'checkbox', ctrlAttr: { controltype: 'checkbox' }, ctrlCss: { width: '80px', height: '20px' } },
//        { name: 'UCMIn', display: 'UCMIn', type: 'checkbox', ctrlAttr: { controltype: 'checkbox' }, ctrlCss: { width: '80px', height: '20px' } },
//        { name: 'EmailCount', display: 'Message', type: 'button', ctrlAttr: { controltype: 'button', onclick: "return ShowMessage(this.id);" }, ctrlCss: { width: '50px', height: '15px' } }],
//        isPaging: true,
//        isExtraPaging: true,
//        hideButtons:
//        {
//            remove: true,
//            removeLast: true,
//            insert: true,
//            append: true,
//            updateAll: true
//        }
//    });
//}
//function BindWhereCondition()
//{
//    var d = new Date($("#FlightDate").attr("sqldatevalue"));
//    d.setDate(d.getDate() + 1);
//    var dd = ((parseInt(d.getDate()) < 10) ? ('0' + d.getDate()) : d.getDate());
//    var mm = ((parseInt(d.getMonth() + 1) < 10) ? ('0' + (d.getMonth() + 1)) : (d.getMonth() + 1));
//    var toDate = d.getFullYear() + "-" + mm + "-" + dd;
//    var fromDate = d;
//    var WhereCondition = "UpdatedAt BETWEEN '" + fromDate + "' AND '" + toDate + "' ";
//    //WhereCondition += $("#Text_FlightNo").data("kendoAutoComplete").key() != "" ? "AND FlightNo='" + $("#Text_FlightNo").data("kendoAutoComplete").key() + "'" : "";
//    //WhereCondition += $("#Text_OriginAirportSNo").data("kendoAutoComplete").key() != "" ? "AND OriginAirportSNo='" + $("#Text_OriginAirportSNo").data("kendoAutoComplete").key() + "'" : "";
//    //WhereCondition += $("#Text_DestinationAirPortSNo").data("kendoAutoComplete").key() != "" ? "AND DestinationAirPortSNo='" + $("#Text_DestinationAirPortSNo").data("kendoAutoComplete").key() + "'" : "";
//    return WhereCondition;
//}