$(document).ready(function ()
{
    WindowsServiceDetails();
    WindowsProcessStatus();
});
function WindowsServiceDetails()
{
    var pageType = getQueryStringValue("FormAction").toUpperCase();
    var dbtableName = 'WindowsServiceStatus';
    $('#tbl' + dbtableName).appendGrid({
        tableID: 'tbl' + dbtableName,
        contentEditable: true,
        masterTableSNo: $('#hdWindowServicesReportSNo').val() || 1,
        currentPage: 1, itemsPerPage: 50, whereCondition: null, sort: "",
        isGetRecord: true,
        servicePath: './Services/Permissions/WindowServicesReportService.svc',
        getRecordServiceMethod: "GetWindowsServiceDetails",
        caption: 'Windows Service Information',
        initRows: 1,
        columns: [
            { name: 'SNo', type: 'hidden' },
            { name: 'ScheduleName', display: 'Schedule Name', type: 'label', ctrlAttr: { maxlength: 7, controltype: 'label', onblur: '' }, ctrlCss: { width: '150px' }, isRequired: pageType == 'NEW' || pageType == 'DUPLICATE' || pageType == 'EDIT' ? false : false },
            { name: 'StartAt', display: 'Start Time', type: 'label', ctrlAttr: { controltype: 'label' }, ctrlCss: { width: '100px', height: '20px' } },
            { name: 'EndAt', display: 'End Time', type: 'label', ctrlAttr: { controltype: 'label' }, ctrlCss: { width: '100px', height: '20px' } },
            { name: 'Duration', display: 'Duration(min.)', type: 'label', ctrlAttr: { controltype: 'label' }, ctrlCss: { width: '100px', height: '20px' } },
            { name: 'IsRunning', display: 'Running', type: 'button', ctrlAttr: { controltype: 'button' }, ctrlCss: { width: '80px', height: '20px' } },
            { name: 'Exception', display: 'Message', type: 'button', ctrlAttr: { controltype: 'button', onclick: "return ShowMessagess(this.id);" }, ctrlCss: { width: '50px', height: '15px' } },
            { name: 'StopExecution', display: 'Stop Execution', type: 'button', ctrlAttr: { controltype: 'button', onclick: "return StopService(this.id);" }, ctrlCss: { width: '40px', height: '20px' } },
            { name: 'TimeDiff', type: 'hidden' },
        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
           
        },
        isPaging: true,
        dataLoaded: function (caller, parentRowIndex, addedRowIndex) {
            $("tr[id^='tblWindowsServiceStatus_Row_']").each(function () {
                var a = this.id.split('_')[2];
                if (parseInt($("#tblWindowsServiceStatus_TimeDiff_" + a).val()) >= 10) {
                    $("#tblWindowsServiceStatus_TimeDiff_" + a).closest('tr').children('td,th').css('color', 'red')
                }

            });
        },
        hideButtons: { updateAll: true, insert: true, remove: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? false : true, append: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? false : true, removeLast: true }
    });
    $("tr[id^='tblWindowsServiceStatus_Row']").each(function (row, tr)
    {
        //$(tr).find("input[id^='tblWindowsServiceStatus_ScheduleName']").css('text-align','Left');

        var Value = $(tr).find("input[id^='tblWindowsServiceStatus_IsRunning']").val();
        var value1 = $(tr).find("input[id^='tblWindowsServiceStatus_Exception']").val();
        var value2=  $(tr).find("input[id^='tblWindowsServiceStatus_SNo']").val();
        $(tr).find("input[id^='tblWindowsServiceStatus_SNO']").attr("SNo", value2);
        $(tr).find("input[id^='tblWindowsServiceStatus_Exception']").attr("FailMessage", value1);
    
        if (Value == 0 && value1 == '') {         
            $(tr).find("input[id^='tblWindowsServiceStatus_IsRunning']").replaceWith('<img src="/Images/Windowservices/WindowService_Completed_2.png"/>');        
            $(tr).find("input[id^='tblWindowsServiceStatus_StopExecution']").replaceWith('');
            $(tr).find("input[id^='tblWindowsServiceStatus_Exception']").replaceWith('');
        }
        else
            if (Value == 0 && value1 != '') {              
                $(tr).find("input[id^='tblWindowsServiceStatus_IsRunning']").replaceWith('<img src="/Images/Windowservices/WindowService_Warning_2.png"/>');             
                $(tr).find("input[id^='tblWindowsServiceStatus_Exception']").replaceWith('<a href="#" id=Abc_"' + row + '" FailMessage="' + value1 + '"  onclick="return ShowMessagess(this)" ><img src="/Images/Windowservices/WindowService_Message_4.png"/></a>');
                $(tr).find("input[id^='tblWindowsServiceStatus_StopExecution']").replaceWith('');
            }
        //else if (Value == 1 && value1 =='') {       
            else if (Value == 1)
            {
                if (value1 != "")
                {
                    $(tr).find("input[id^='tblWindowsServiceStatus_Exception']").replaceWith('<a href="#" id=Abc_"' + row + '" FailMessage="' + value1 + '"  onclick="return ShowMessagess(this)" ><img src="/Images/Windowservices/WindowService_Message_4.png"/></a>');

                }
                else
                {
                    $(tr).find("input[id^='tblWindowsServiceStatus_Exception']").replaceWith('');
                }
                $(tr).find("input[id^='tblWindowsServiceStatus_IsRunning']").replaceWith('<img src="/Images/Windowservices/WindowService_Running_2.png"/>');               
                //$(tr).find("input[id^='tblWindowsServiceStatus_Exception']").replaceWith('');
                //$(tr).find("input[id^='tblWindowsServiceStatus_StopExecution']").replaceWith('');
                   $(tr).find("input[id^='tblWindowsServiceStatus_IsRunning']").replaceWith('<img src="/Images/Windowservices/WindowService_Execption_2.png"/>');
                $(tr).find("input[id^='tblWindowsServiceStatus_StopExecution']").replaceWith('<a href="#" id=AbcSNo_"' + row + '" SNo="' + value2 + '"  onclick="return StopService(this)" ><img src="/Images/Windowservices/WindowService_btnStop_4.png"/></a>');

            }
            //else if (Value == 1 && value1 != '')
            //{
            //    $(tr).find("input[id^='tblWindowsServiceStatus_Exception']").replaceWith('<a href="#" id=Abc_"' + row + '" FailMessage="' + value1 + '"  onclick="return ShowMessages(this)" ><img src="/Images/Windowservices/WindowService_Message_4.png"/></a>');
            //    $(tr).find("input[id^='tblWindowsServiceStatus_IsRunning']").replaceWith('<img src="/Images/Windowservices/WindowService_Execption_2.png"/>');             
            //    $(tr).find("input[id^='tblWindowsServiceStatus_StopExecution']").replaceWith('<a href="#" id=AbcSNo_"' + row + '" SNo="' + value2 + '"  onclick="return StopService(this)" ><img src="/Images/Windowservices/WindowService_btnStop_4.png"/></a>');
            //}
            



    });
}
function ShowMessagess(input)
{
    //   var ClosestTr = $("#" + input).closest("tr")
    var FailMessage = $(input).attr("FailMessage");// ClosestTr.find("a[id^='Abc'").attr("FailMessage");
   // confirm(FailMessage);
    alertMX(FailMessage);
  
}
function StopService(input)
{
    //var ClosestTr = $("#" + input).closest("tr")
    //var ServiceSNo = ClosestTr.find("input[id^='tblWindowsServiceStatus_SNo'").val();
    var ServiceSNo = $(input).attr("SNo");
    //alert(ServiceSNo)
    Stop(ServiceSNo);
    WindowsServiceDetails();
}
function Stop(ServiceSNo)
{
    if (confirm("Are you sure you want to Stop this?")) {
        if (ServiceSNo != "") {
            $.ajax({
                url: "Services/Permissions/WindowServicesReportService.svc/StopWindowService?SNo=" + ServiceSNo, async: true, type: "get", cache: false, contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result != "" && result != null) {
                        //alert(result)
                        //confirm(result)
                        if (result == 'Success')
                        {
                            ShowMessage('success', 'Success - Window Service', "Service has been Stopped Successfully", "bottom-right")
                        }
                        else
                        {
                            ShowMessage('warning', 'Window Service', "Stop Execution has been Failed. ", "bottom-right");
                        }
                    }
                }
            });
        }
    }
    else
    {
        return false;
    }
}

$("<style type='text/css'>#boxMX{display:none;background: #ADD8DE;padding: 10px;border: 2px solid #ddd;float: left;font-size: 1.2em;position: fixed;top: 50%; left: 50%;z-index: 99999;box-shadow: 0px 0px 20px #999; -moz-box-shadow: 0px 0px 20px #999; -webkit-box-shadow: 0px 0px 20px #999; border-radius:6px 6px 6px 6px; -moz-border-radius: 6px; -webkit-border-radius: 6px; font:13px Arial, Helvetica, sans-serif; padding:6px 6px 4px;width:600px; color: Black;}</style>").appendTo("head");

function alertMX(t)
{
    $("body").append($("<div id='boxMX'> <p ><b><u>Message:</u></b></p><p class='msgMX'></p> <p ><b>Close</b></p></div>"));
    $('.msgMX').text(t); var popMargTop = ($('#boxMX').height() + 24) / 2, popMargLeft = ($('#boxMX').width() + 24) / 2;
    $('#boxMX').css({ 'margin-top': -popMargTop, 'margin-left': -popMargLeft }).fadeIn(600);
    $("#boxMX").click(function () { $(this).remove(); });
};
            //Added By DEVENDRA SINGH ON 09 August 2017 for another append grid
function WindowsProcessStatus() {
    var pageType = getQueryStringValue("FormAction").toUpperCase();
    var dbtableName = 'WindowsProcessStatus';
    $('#tbl' + dbtableName).appendGrid({
        tableID: 'tbl' + dbtableName,
        contentEditable: true,
        masterTableSNo: $('#hdWindowsProcessStatusSNo').val() || 1,
        currentPage: 1, itemsPerPage: 20, whereCondition: null, sort: "",
        isGetRecord: true,
        servicePath: './Services/Permissions/WindowServicesReportService.svc',
        getRecordServiceMethod: "GetWindowsServiceStatus",
        caption: 'Windows Process Status',
       
        initRows: 1,
        columns: [
            { name: 'SNo', type: 'hidden' },
            { name: 'ProcessName', display: 'Process Name', type: 'label', ctrlAttr: { maxlength: 7, controltype: 'label', onblur: '' }, ctrlCss: { width: '100px' }, isRequired: pageType == 'NEW' || pageType == 'DUPLICATE' || pageType == 'EDIT' ? false : false },
            { name: 'Remarks', display: 'Remarks', type: 'label', ctrlAttr: { controltype: 'label' }, ctrlCss: { width: '100px', height: '20px' } },
            { name: 'Process', display: 'Process', type: 'label', ctrlAttr: { controltype: 'label' }, ctrlCss: { width: '100px', height: '20px' } },
            { name: 'status', display: 'Status', type: 'label', ctrlAttr: { controltype: 'label' }, ctrlCss: { width: '100px', height: '20px' } },
            { name: 'LastExecutionTime', display: 'Last Execution Time', type: 'label', ctrlAttr: { controltype: 'label' }, ctrlCss: { width: '100px', height: '20px' } },
           
        ],
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
           
        },
        dataLoaded: function (caller, parentRowIndex, addedRowIndex) {
            $("tr[id^='tblWindowsProcessStatus_Row']").each(function (row, tr) {
                var Value = $(tr).find("label[id^='tblWindowsProcessStatus_Process_']").text();

                if (Value == 'LOW') {
                    $(tr).find("label[id^='tblWindowsProcessStatus_status_']").replaceWith('<img src="/Images/Windowservices/WindowService_Completed_2.png" title="LOW"/>');

                }
                else
                    if (Value == 'CRITICAL') {
                        $(tr).find("label[id^='tblWindowsProcessStatus_status_']").replaceWith('<img src="/Images/Windowservices/WindowService_Warning_2.png" title="CRITICAL"/>');

                    }
                    else
                        if (Value != 'CRITICAL' || Value != 'LOW') {
                            $(tr).find("label[id^='tblWindowsProcessStatus_status_']").replaceWith('');

                        }

            })
        },
        isPaging: true,
        isExtraPaging: true,
        hideButtons: { updateAll: true, insert: true, remove: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? false : true, append: pageType == "DUPLICATE" || pageType == "NEW" || pageType == "EDIT" ? false : true, removeLast: true }
    });

  };
    
    





