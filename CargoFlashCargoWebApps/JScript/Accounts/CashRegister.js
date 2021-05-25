//Created By shivali thakur to club cash register data
var Amount = 0;
var CurrentSNo = 0;
var inv = 0;
var Lastlogin = 0;
var LastLoggedTime = 0;
var OpeningAmount = 0;
var ClosingAmount = 0;
var AmountDeposit = 0;
var TotalReceiveAmount = 0;
var isAccountClosed = false;

window.setInterval(function () {
    if ($("#FromDate").val() == $("#ToDate").val()) {
        GetSNo();
        $("#DepositAmount").val("Cash Transfer(" + inv + " " + userContext.CurrencyCode + ")");
        if ($("#tblCashRegister tbody tr.empty").length != 1)
         GetCashRegister();
   
        isAccountClosed = IsShiftClosed();
       if (isAccountClosed) {           
            $("#Close").attr("disabled", true);
            $("#DepositAmount").attr("disabled", true);
            $("#ReceiveAmount").attr("disabled", true);
            $("#btnshiftstart").attr("disabled", false);
            $("#divCashRegister").hide();
        }
       else {          
            $("#Close").attr("enabled", true);
            $("#DepositAmount").attr("enabled", true);
            $("#ReceiveAmount").attr("enabled", true);
            $("#btnshiftstart").attr("enabled", false);
            $("#divCashRegister").show();
        }
        $("#Close").unbind('click');
        //$("#StartTime").data("kendoTimePicker").enable(true);
        //$("#EndTime").data("kendoTimePicker").enable(true);
    }
    else {
        //$("#StartTime").data("kendoTimePicker").enable(false);
        //$("#EndTime").data("kendoTimePicker").enable(false);
        return false;
    }
}, 2000);

var dirtyForm = { isDirty: false };
dirtyForm.checkDirtyForm = function () {

};

$(document).ready(function () {
    var virtualAc_Success = true;
    cfi.ValidateForm();
    isAccountClosed = IsShiftClosed();
    debugger
    if (isAccountClosed) {
        $("#Close").attr("disabled", true);
      
    }
    else {
        $("#Close").attr("enabled", true);
       
    }
    //  $("#MasterDuplicate").hide();
    var pageType = getQueryStringValue("FormAction").toUpperCase();
    if (pageType == "NEW") {
        $("#CashierID").css("width", "10%")
        $("#FromDate").parent('span').before("<span style='font-weight:bold;font-size:10px;color:#000000;font-family:Verdana;'>From Date : </span>");
        $("#ToDate").parent('span').before("<span style='font-weight:bold;font-size:10px;color:#000000;font-family:Verdana;'>To Date : </span>");
        $("span#spnSearch").parent("td").css("width", "3%");
        $("#btnSearch").css("width", "8%");
        $("input[name='operation']").parent("td").hide();
    }
   
    $("#CashierID").val(userContext.FirstName.toUpperCase());
    $("#CashierID").attr('readonly', true);

    $("#tbl .formSection").append('<span id="spnShiftTime" style="padding-left:400px;">Shift Start Date Time <input name="StartDate" readonly="true" id="StartDate" type="text" /> Shift End Date Time <input name="EndDate" id="EndDate" readonly="true" type="text" /></span>');

    $("#StartDate").css("width", "205px");
    $("#StartDate").parent().parent().css("width", "250px");
    $("#EndDate").css("width", "205px")
    $("#EndDate").parent().parent().css("width", "250px")
   
  
    GetLastLoggedOn();

    $('#StartDate').val(LastLoggedTime);
    $('#StartDate').kendoDateTimePicker({
        format: "dd-MMM-yyyy HH:mm",
        timeFormat: "HH:mm",
        interval: 1,
        //value: new Date(),
        //dateInput: true,
     
    });
    $('#EndDate').kendoDateTimePicker({
        format: "dd-MMM-yyyy HH:mm",
        timeFormat: "HH:mm",
        interval: 1,
      //value: EndDate+EndTime,
    // value: new Date(),
       // dateInput: true
    });
    var StartDateEnable = $('#StartDate').data("kendoDateTimePicker");
    var EnddateEnable = $('#EndDate').data("kendoDateTimePicker");
    StartDateEnable.enable(false);
    EnddateEnable.enable(false);
    //****************************************************Time****************************************************

    //$("#FromDate,#ToDate").change(function () {
    //    if ($("#FromDate").val() == $("#ToDate").val()) {
    //        $("#StartTime").data("kendoTimePicker").enable(true);
    //        $("#EndTime").data("kendoTimePicker").enable(true);
    //    }
    //    else {
    //        $("#StartTime").val('');
    //        $("#EndTime").val('');
    //        $("#StartTime").data("kendoTimePicker").enable(false);
    //        $("#EndTime").data("kendoTimePicker").enable(false);
    //    }
    //});

    $("#StartTime").css('width', '100px').attr("placeholder", "Start Time");
    $("#EndTime").css('width', '100px').attr("placeholder", "End Time");
    var start = $("#StartTime").kendoTimePicker({
        format: "HH:mm"
    }).data("kendoTimePicker");

    var end = $("#EndTime").kendoTimePicker({
        format: "HH:mm"
    }).data("kendoTimePicker");

    $("#StartTime,#EndTime").live("keypress", function (evt) {
        var theEvent = evt || window.event;
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
        var Charactors = ":";
        var regex = /^[0-9]*$/;
        if (Charactors.indexOf(key) < 0 && !regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }
    });

   // GetLocalTime();

    //****************************************************End Time****************************************************

    $('#tbl').after("<br/><div id='Container'><div id='divCashRegister' style='height:100px overflow:auto'><table id='tblCashRegisterOpeningAmount'></table><table id='tblCashRegister'></table></div><br/><div id='divReceiveAmount' style='height:100px overflow:auto'><table id='tblReceiveAmount'></table></div></div><br/><div id='divDepositedAmount' style='height:100px overflow:auto'><table id='tblDepositedAmount'></table></div></div>")

   $("#Container").hide();
    var CashierID = userContext.UserSNo;

   // CheckSession();

    //$("#FromDate").data("kendoDatePicker").max(new Date());
    //$("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
    //$("#FromDate").kendoDatePicker({
    //    change: function () {
    //        $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
    //    }
    //});
    //$("#FromDate").before('&nbsp;')
    //$("#FromDate").css("width", "100px")
    //$("#FromDate").parent().css("width", "126px")

    $.ajax({
        url: "./Services/Accounts/CashRegisterService.svc/GetTotalAmount",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ CashierID: CashierID }),
        async: false,
        type: 'post',
        cache: false,
        success: function (result) {
            var dataTableobj = JSON.parse(result);
            FinalData = dataTableobj.Table0;
            FinalData1 = dataTableobj.Table1;
            if (FinalData != '')
                Amount = FinalData[0].Amount;
            if (FinalData1 != '') {
                CurrentSNo = FinalData1[0].SNo;
                inv = FinalData1[0].TotalAmount;
            }
        },
        error: function (err) {
            alert("Generated Error");
        }
    });
    getCashierShiftTime();
 
});

//Added by Shivali Thakur
function getCashierShiftTime()
{
    var CashierID = userContext.UserSNo;
    var GroupSNo = userContext.GroupSNo;
    $.ajax({
        url: "./Services/Accounts/CashRegisterService.svc/GetCashierShiftTime",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ CashierID: CashierID, GroupSNo: GroupSNo}),
        async: false,
        type: 'post',
        cache: false,
        success: function (result)
        {        
            var dataTableobj = JSON.parse(result);
            FinalData = dataTableobj.Table0;        
            if (FinalData.length > 0) {
                //if (FinalData != '' && FinalData != 'undefined') {
                if (FinalData[0].StartShift != 'undefined' && FinalData[0].StartShift != '' && FinalData[0].IsActive == "True") {
                    $("#btnshiftstart").attr("disabled", true);
                        $("#StartDate").val(FinalData[0].StartShift + " " + FinalData[0].StartTime);                     
                    }
                    else if (FinalData[0].StartShift != 'undefined' && FinalData[0].StartShift != '' && FinalData[0].IsActive == "False") {                       
                        $("#StartDate").val(LastLoggedTime);                       
                    }
                
                //}
            }
            //alert(result.start)
        },
        error: function (err) {
            alert("Generated Error");
        }
    });
}
//function CheckSession() {
//    var CashierID = userContext.UserSNo;
//    var GroupSNo = userContext.GroupSNo;
//    $.ajax({
//        url: "./Services/Accounts/CashRegisterService.svc/CheckSession",
//        contentType: "application/json; charset=utf-8",
//        data: JSON.stringify({ CashierID: CashierID, GroupSNo: GroupSNo }),
//        async: false,
//        type: 'post',
//        cache: false,
//        success: function (result) {
//            if (result[0] == 1001) {
//                $("#Container").after('<div id="divWindow"><table validateonsubmit="true" class="WebFormTable"><tr><td class="formlabel"><b>Continue with Old Session(Yes/No).</b></td></tr></table></div>');
//                $("#divWindow").dialog({
//                    autoResize: true,
//                    maxWidth: 250,
//                    maxHeight: 150,
//                    width: 250,
//                    height: 150,
//                    modal: true,
//                    title: 'Confirmation',
//                    draggable: false,
//                    resizable: false,
//                    buttons:
//                      {
//                          'Yes': function () {
//                              $(this).dialog('close');
//                              $.ajax({

//                              });
//                              $(this).find("#yes").click();
//                          },
//                          'No': function () {
//                              $.ajax({
//                                  url: "./Services/Accounts/CashRegisterService.svc/NewCashRegister",
//                                  contentType: "application/json; charset=utf-8",
//                                  data: JSON.stringify({ CashierID: CashierID, GroupSNo: GroupSNo }),
//                                  async: false,
//                                  type: 'post',
//                                  cache: false,
//                                  success: function (result) {

//                                  }
//                              });
//                              $(this).dialog('close');
//                              $(this).find("#no").click();
//                          }
//                      }
//                });
//            }
//            else if (result[0] == 1002) {

//            }

//        }
//    });
//}

function ShiftStart()
{
    var arrVal = [];
    var CashierID = userContext.UserSNo;
    var GroupSNo = userContext.GroupSNo;
    var StartDate = $("#StartDate").val().trim();

    if (!IsShiftClosed()) {
        ShowMessage('warning', '', "Your shift already been started.");
        return
    }
        


    $.ajax({
        url: "./Services/Accounts/CashRegisterService.svc/UpdateShiftRecord",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ CashierID: CashierID, GroupSNo:GroupSNo,CurrentSNo:CurrentSNo, StartDate: StartDate }),
        async: false,
        type: 'post',
        cache: false,
        success: function (result) {
            //if (isAccountClosed) {
            
            //    $("#btnshiftstart").attr("disabled", true);
            //    ShowMessage('warning', '', "Your account has been closed now,Please Login again and start your shift");
            //    return false;
            //}
            //else {
                if (result == 0) {
                    $("#btnshiftstart").attr("disabled", true);
                    GetCashRegister();
                    var a = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "CashRegister", ColumnName: 'Shift Status', OldValue: "", NewValue: "Start" };
                    arrVal.push(a);
                    //   AuditLogSaveNewValue("tbltariffinvoice", "true", "GENERATEINVOICE", "Invoice No", InvoiceNo, "", "Edit", userContext.TerminalSNo, userContext.NewTerminalName);
                    SaveAppendGridAuditLog("Cashier Name", userContext.FirstName, "0", JSON.stringify(arrVal), "Edit", userContext.TerminalSNo, userContext.NewTerminalName);

                    ShowMessage('success', '', "Your shift has been started now.");
                }
                else if (result == 1001) {
                    ShowMessage('warning', '', "Your account is not opened yet,Please open the account first");
                    return false;
                }
            //}
        },
        error: function (err) {
            alert("Generated Error");
        }
    });

}
function getCashRegisterOpeningAmount() {
    $("#tblCashRegisterOpeningAmount").appendGrid({
        caption: 'Opening Amount Details',
        captionTooltip: 'Cash Register',
        columns: [
                  { name: 'SNo', type: 'hidden', value: 0 },

                  { name: 'CashRegisterSno', type: 'hidden', value: CurrentSNo },

                  { name: 'Remarks', type: 'hidden', value: 0 },

                  { name: 'ServerUTC', type: 'hidden', value: 0 },

                  { name: 'ServerLocal', type: 'hidden', value: 0 },

                  { name: 'ServerTimeZone', type: 'hidden', value: 0 },

                  { name: 'CashierName', display: 'Cashier Name', type: 'label', ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },

                   { name: 'OpeningAmount', display: 'Opening Amount', type: 'label', ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },

                  { name: 'Date', display: 'Date', type: 'label', ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },

                  {
                      name: 'TransferTime', display: 'Time', type: 'label', ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 600 }, isRequired: false, onClick: function (evt, rowIndex) {
                          var i = rowIndex + 1;
                          if ($("#divWindow1" + i).length === 0) {
                              $("#" + evt.currentTarget.id).after('<div id="divWindow1' + i + '"><table validateonsubmit="true" class="WebFormTable"><tr><td class="formlabel"><b>UTC Time</b></td><td class="formInputcolumn">' + $("#" + evt.currentTarget.id.replace('TransferTime', 'ServerUTC')).val() + '</td></tr><tr><td class="formlabel"><b>Local Time</b></td><td class="formInputcolumn">' + $("#" + evt.currentTarget.id.replace('TransferTime', 'ServerLocal')).val() + '</td></tr><tr><td class="formlabel"><b>Time Zone</b></td><td class="formInputcolumn">' + $("#" + evt.currentTarget.id.replace('TransferTime', 'ServerTimeZone')).val() + '</td></tr></table></div>');
                              cfi.PopUp(("divWindow1" + i), "UTC Detail", 400, null, null, null);
                              $("#divWindow1" + i).closest(".k-window").css({
                                  position: 'fixed',
                                  top: '5%'
                              });
                          }
                          else
                              $("#divWindow1" + i).data("kendoWindow").open();
                      }
                  },

                  //{ name: 'Currency', display: 'Currency', type: 'label', ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },

                 
        ],
        isPaging: true,
        hideButtons: {
            remove: true,
            removeLast: true,
            insert: true,
            append: true,
            updateAll: true
        }
    });
    //$("body").on("click", ".remove", function () {
    //    $(this).closest("div").remove();
    //});
}
function GetCashRegister() {
    var where = "";
    var CashierID = userContext.UserSNo;
    var GroupSNo = userContext.GroupSNo;
    var FromDate = $("#StartDate").val().trim();
    var ToDate = $("#EndDate").val().trim();
    
    //var d = new Date(); var curr_day = d.getDate(); var curr_month = d.getMonth(); var curr_year = d.getFullYear();
    //var curr_hour = d.getHours(); var curr_min = d.getMinutes(); var curr_sec = d.getSeconds(); 
    var SD = new Date(FromDate);
    var ED = new Date(ToDate);
    var StartDate =""// SD.toISOString().replace("T", " ").replace("Z","");
    var EndDate = ""// ED.toISOString().replace("T", " ").replace("Z","");
    isAccountClosed = IsShiftClosed();


    if (CashierID != "" && !isAccountClosed) {
            GetSNo();
            getCashRegisterOpeningAmount();
            $.ajax({
                url: "./Services/Accounts/CashRegisterService.svc/GetCashRegisterRec",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ CashierID: CashierID, GroupSNo: GroupSNo, FromDate: FromDate, ToDate: EndDate, StartTime: '', EndTime: '' }),
                async: false,
                type: 'post',
                cache: false,
                success: function (result) {
                    $("#Container").show();
                    if ($("#ReceiveAmount").length === 0) {//(" + Amount + ")
                        $("#Container").before("<input type='button' id='ReceiveAmount' value='Receive Amount' class='btn btn-success' onclick='GetReceiveAmountDetail()'>&emsp;<input type='button' id='DepositAmount' value='Cash Transfer(" + inv + " " + userContext.CurrencyCode + ")' class='btn btn-success' onclick='AmountDeposited()'>&emsp;<input type='button' id='Close' value='Shift End' class='btn btn-success' onclick='ClosedAccount()'>");
                    }
                    else
                        $("#DepositAmount").val("Cash Transfer(" + inv + " " + userContext.CurrencyCode + ")");

                    var dataTableobj = JSON.parse(result);
                    //if (dataTableobj.Table0.length > 0) {
                    //    $('#tblCashRegister').appendGrid('load', dataTableobj.Table0);                   
                    //}
                    if (dataTableobj.Table1.length > 0) {
                        $('#tblCashRegisterOpeningAmount').appendGrid('load', dataTableobj.Table1);
                        OpeningAmount = dataTableobj.Table1[0].OpeningAmount;
                        ClosingAmount = dataTableobj.Table1[0].ClosingAmount;
                        AmountDeposit = dataTableobj.Table1[0].AmountDeposit;
                        TotalReceiveAmount = dataTableobj.Table1[0].TotalReceiveAmount;
                    }
                    else {

                        return;
                    }
                },
                error: function (err) {
                    alert("Generated Error");
                }
            });



            where = CashierID + '/' + GroupSNo + '/' + FromDate + '/' + ToDate;
            $("#tblCashRegister").appendGrid({

                //V2: true,
                tableID: "tblCashRegister",
                contentEditable: true,
                masterTableSNo: 1,
                isExtraPaging: true,
                currentPage: 1, itemsPerPage: 50, whereCondition: where, model: '', sort: "",
                //currentPage: 1, itemsPerPage: 50, whereCondition: null, sort: "",
                isGetRecord: true,
                servicePath: "./Services/Accounts/CashRegisterService.svc",
                getRecordServiceMethod: "GetCashRegisterRecord",
                caption: 'Transfer/Deposit Details',
                captionTooltip: 'Cash Register',
                columns: [
                       { name: 'SNo', type: 'hidden', value: 0 },

                       { name: 'CashRegisterSno', type: 'hidden', value: CurrentSNo },

                       { name: 'Remarks', type: 'hidden', value: 0 },

                       { name: 'ServerUTC', type: 'hidden', value: 0 },

                       { name: 'ServerLocal', type: 'hidden', value: 0 },

                       { name: 'ServerTimeZone', type: 'hidden', value: 0 },

                       { name: 'CashierName', display: 'Cashier Name', type: 'label', ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },

                        //{ name: 'TotalAmount', display: 'Total Amount', type: 'label', ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },

                       { name: 'Date', display: 'Date', type: 'label', ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },

                       {
                           name: 'TransferTime', display: 'Time', type: 'label', ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 600 }, isRequired: false, onClick: function (evt, rowIndex) {
                               var i = rowIndex + 1;
                               if ($("#divWindow1" + i).length === 0) {
                                   $("#" + evt.currentTarget.id).after('<div id="divWindow1' + i + '"><table validateonsubmit="true" class="WebFormTable"><tr><td class="formlabel"><b>UTC Time</b></td><td class="formInputcolumn">' + $("#" + evt.currentTarget.id.replace('TransferTime', 'ServerUTC')).val() + '</td></tr><tr><td class="formlabel"><b>Local Time</b></td><td class="formInputcolumn">' + $("#" + evt.currentTarget.id.replace('TransferTime', 'ServerLocal')).val() + '</td></tr><tr><td class="formlabel"><b>Time Zone</b></td><td class="formInputcolumn">' + $("#" + evt.currentTarget.id.replace('TransferTime', 'ServerTimeZone')).val() + '</td></tr></table></div>');
                                   cfi.PopUp(("divWindow1" + i), "UTC Detail", 400, null, null, null);
                                   $("#divWindow1" + i).closest(".k-window").css({
                                       position: 'fixed',
                                       top: '5%'
                                   });
                               }
                               else
                                   $("#divWindow1" + i).data("kendoWindow").open();
                           }
                       },

                       { name: 'Currency', display: 'Currency', type: 'label', ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },

                       {
                           name: 'AmountDeposited', display: 'Amount Transfer', type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 600, style: "text-transform:uppercase; color:blue;" }, isRequired: false
                       },

                       {
                           name: 'TotalCashReceivedAmount', display: 'Amount From Invoice', type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 600, style: "text-transform:uppercase; color:blue;" }, isRequired: false
                       },

                       {
                           name: 'TotalReceiveAmount', display: 'Amount Receive', type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 600, style: "text-transform:uppercase; color:blue;" }, isRequired: false
                       },
                        {
                            name: 'CashRefund', display: 'Cash Refund', type: "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 600, style: "text-transform:uppercase; color:blue;" }, isRequired: false
                        },
                       {
                           name: 'Status', display: 'Status', type: 'label', ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 600 }, isRequired: false, onClick: function (evt, rowIndex) {
                               var i = rowIndex + 1;
                               if ($("#divWindow" + i).length === 0) {
                                   $("#" + evt.currentTarget.id).after('<div id="divWindow' + i + '"><table validateonsubmit="true" class="WebFormTable"><tr><td class="formlabel"><b>Remark</b></td><td class="formInputcolumn">' + $("#" + evt.currentTarget.id.replace('Status', 'Remarks')).val() + '</td></tr></table></div>');
                                   cfi.PopUp(("divWindow" + i), "Status Reason", 400, null, null, null);
                                   $("#divWindow" + i).closest(".k-window").css({
                                       position: 'fixed',
                                       top: '5%'
                                   });
                               }
                               else
                                   $("#divWindow" + i).data("kendoWindow").open();
                           }
                       },
                       { name: 'AWBNo', display: 'AWB No', type: 'label', ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                       { name: 'InvoiceNo', display: 'Invoice No', type: 'label', ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                        { name: 'TYPE', display: 'Type', type: 'label', ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 600 }, isRequired: false }
                ],
                isPaging: true,
                hideButtons: {
                    remove: true,
                    removeLast: true,
                    insert: true,
                    append: true,
                    updateAll: true
                }
            });


       // getCashRegisterGrid();
        //$.ajax({
        //    url: "./Services/Accounts/CashRegisterService.svc/GetCashRegisterRec",
        //    contentType: "application/json; charset=utf-8",
        //    data: JSON.stringify({ CashierID: CashierID, GroupSNo: GroupSNo, FromDate: FromDate, ToDate: EndDate, StartTime: '', EndTime: '' }),
        //    async: false,
        //    type: 'post',
        //    cache: false,
        //    success: function (result) {
        //        $("#Container").show();
        //        if ($("#ReceiveAmount").length === 0) {//(" + Amount + ")
        //            $("#Container").before("<input type='button' id='ReceiveAmount' value='Receive Amount' class='btn btn-success' onclick='GetReceiveAmountDetail()'>&emsp;<input type='button' id='DepositAmount' value='Cash Transfer(" + inv + " " + userContext.CurrencyCode + ")' class='btn btn-success' onclick='AmountDeposited()'>&emsp;<input type='button' id='Close' value='Shift End' class='btn btn-success' onclick='ClosedAccount()'>");
        //        }
        //        else
        //            $("#DepositAmount").val("Cash Transfer(" + inv + " " + userContext.CurrencyCode + ")");
            
        //        var dataTableobj = JSON.parse(result);
        //        if (dataTableobj.Table0.length > 0) {
        //            $('#tblCashRegister').appendGrid('load', dataTableobj.Table0);                   
        //        }
        //        if(dataTableobj.Table1.length > 0)
        //        {
        //            $('#tblCashRegisterOpeningAmount').appendGrid('load', dataTableobj.Table1);
        //            OpeningAmount = dataTableobj.Table1[0].OpeningAmount;
        //            ClosingAmount = dataTableobj.Table1[0].ClosingAmount;
        //            AmountDeposit = dataTableobj.Table1[0].AmountDeposit;
        //            TotalReceiveAmount = dataTableobj.Table1[0].TotalReceiveAmount;
        //        }
        //        else {
                   
        //            return;
        //        }
        //    },
        //    error: function (err) {
        //        alert("Generated Error");
        //    }
        //});
    }

}

function getCashRegisterGrid() {
   
    //$("body").on("click", ".remove", function () {
    //    $(this).closest("div").remove();
    //});
}

function GetReceiveAmountDetail() {
    var CashierID = userContext.UserSNo;
    var GroupSNo = userContext.GroupSNo;
    var btnshift = $("#btnshiftstart").is(":disabled");
    //   var StartDate = $("#FromDate").val();
    if (btnshift == false) {
        ShowMessage('warning', 'Cash Register', "Please Start Your Shift");
        return false;
    }
    else {

        if (CashierID != "") {
            $.ajax({
                url: "./Services/Accounts/CashRegisterService.svc/GetReceiveAmountRecord",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ CashierID: CashierID, GroupSNo: GroupSNo }),
                async: false,
                type: 'post',
                cache: false,
                success: function (result) {




                    $("#divReceiveAmount").show();
                    var dataTableobj = JSON.parse(result);
                    if (dataTableobj.Table0.length > 0) {
                        cfi.PopUp("tblReceiveAmount", "Receive Amount", 900, null, null, null);
                        $("#tblReceiveAmount").closest(".k-window").css({
                            position: 'fixed',
                            top: '5%'
                        });
                        getReceiveAmountGrid();
                        $('#tblReceiveAmount').appendGrid('load', dataTableobj.Table0);

                    }
                    else {
                        ShowMessage('warning', '', "Nothing To Receive!");
                    }
                },
                error: function (err) {
                    alert("Generated Error");
                }
            });
        }
    }
}

function getReceiveAmountGrid() {
    $("#tblReceiveAmount").appendGrid({
        tableID: "tblReceiveAmount",
        contentEditable: true,
        masterTableSNo: CurrentSNo,
        currentPage: 1,
        itemsPerPage: 5,
        whereCondition: null,
        sort: "",
        caption: "",
        columns: [
                  { name: 'SNo', type: 'hidden', value: 0 },

                  { name: 'CashRegisterSNo', type: 'hidden' },

                  { name: 'CashierNameBy', display: 'Cashier Name', type: 'label', ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },

                  { name: 'Amount', display: 'Amount(' + userContext.CurrencyCode + ')', type: 'label', ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },

                  { name: 'Amount', display: 'hdnAmount', type: 'hidden' },
                  { name: 'ReferenceNo', display: 'Reference No.', type: 'label', ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                  { name: 'Time', display: 'Time', type: 'label', ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },

                  { name: 'Status', display: 'Option', type: 'select', controltype: 'autocomplete', ctrlOptions: { 1: 'ACCEPT', 0: 'REJECT' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: true, },

                 { name: 'Remarks', display: 'Remarks', type: 'text', ctrlCss: { width: '100px', 'text-transform': 'uppercase' }, ctrlAttr: { maxlength: 25 }, isRequired: true },
                  

        ],
        isPaging: false,
        hideButtons: {
            remove: true,
            removeLast: true,
            insert: true,
            append: true,
            updateAll: true
        }
    });

    $("#tblReceiveAmount tfoot").after('<div id="Button"><input type="button" value="Update" class="btn btn-success" id="btnGenerate" onclick="SaveReceiveStatus()"></div>')
}

function AmountDeposited() {

    var btnshift = $("#btnshiftstart").is(":disabled");    
    if (btnshift == false) {
        ShowMessage('warning', 'Cash Register', "Please Start Your Shift");
        return false;
    }
    else {
        if (CashierID != "") {
            getAmountDepositedGrid();
            cfi.PopUp("tblDepositedAmount", "Amount Transfer/Deposit", 900, null, null, null);
            $("#tblDepositedAmount").closest(".k-window").css({
                position: 'fixed',
                top: '5%'
            });
        }
    }
}

function getAmountDepositedGrid() {
    $("#tblDepositedAmount").appendGrid({
        tableID: "tblDepositedAmount",
        contentEditable: true,
        masterTableSNo: CurrentSNo,
        currentPage: 1,
        itemsPerPage: 5,
        whereCondition: null,
        sort: "",
        isGetRecord: false,
        servicePath: "./Services/Accounts/CashRegisterService.svc",
        deleteServiceMethod: "",
        caption: '',
        captionTooltip: 'Amount Transfer/Deposit',
        initRows: 1,
        caption: '',
        captionTooltip: 'Amount Deposited',
        columns: [
                  { name: 'SNo', type: 'hidden', value: 0 },

                  { name: 'CashRegisterSno', type: 'hidden', value: CurrentSNo },

                  {
                      name: 'DepositedToUserId', display: 'Deposit/Transfer To', type: 'text', ctrlAttr: { controltype: 'autocomplete', onSelect: "return CheckPending(this)" }, ctrlCss: { width: '100px', height: '20px' }, AutoCompleteName: 'CashRegister_User', filterField: "UserName,FirstName", filterCriteria: "contains", isRequired: true
                  },

                  {
                      name: 'DepositedAmount', display: 'Amount( ' + userContext.CurrencyCode + ')', type: 'Text', ctrlCss: { width: '150px' }, ctrlAttr: {
                          maxlength: 14, controltype: "decimal2"
                      }, isRequired: true
                  },

                  { name: 'AccountNo', display: 'Virtual Account No.', type: 'Text', ctrlCss: { width: '150px' }, ctrlAttr: { maxlength: 25, controltype: 'alphanumericupper' }, isRequired: false },

                  { name: 'RefNo', display: 'Reference No.', type: 'Text', ctrlCss: { width: '150px' }, ctrlAttr: { maxlength: 15, controltype: 'alphanumericupper' }, isRequired: false },

                  { name: 'DRemark', display: 'Remarks', type: 'Text', ctrlCss: { width: '150px' }, ctrlAttr: { maxlength: 25, controltype: 'alphanumericupper' }, isRequired: true },

                  { name: 'DepositType', display: 'Type', type: 'select', controltype: 'autocomplete', ctrlOptions: { 0: 'TRANSFER', 1: 'DEPOSIT' }, ctrlCss: { width: '100px', height: '20px' }, isRequired: true, },
        ],
        isPaging: false,
        hideButtons: {
            remove: true,
            removeLast: false,
            insert: true,
            append: false,
            updateAll: true
        }
    });
    $("#tblDepositedAmount_btnAppendRow").after('<input type="button" value="Update" class="btn btn-success" id="btnGenerate" onclick="SaveAmountdeposite()">');

}

function CheckPending(obj) {
    var indexName = $(obj).attr("id").split('_')[1];
    var replacedID = $(obj).attr("id").replace(indexName, 'HdnDepositedToUserId');
    var key = $("#" + replacedID).val();
    var CashierID = (key == "" ? -1 : key);

    if (key == 0) {
        var indexAccountname = userContext.VAccountNo;
        if (indexAccountname == null || indexAccountname == undefined || indexAccountname == "") {
            ShowMessage('warning', '', "Please assign Virtual account No. to the Terminal before process.");
            virtualAc_Success = false;
            return virtualAc_Success;
        }
        else {
            var id = obj.attr('id').split('_')[2]
            $("#tblDepositedAmount_AccountNo_" + id).val(indexAccountname);
            $("#tblDepositedAmount_AccountNo_" + id).attr('disabled', true);
            virtualAc_Success = true;
        }
        $("#tblDepositedAmount_RefNo_" + id).val(UniqeReferenceNumber());
        $("#tblDepositedAmount_RefNo_" + id).attr('disabled', true);
    }
    else if (key != 0 && key != -1) {
        var id = obj.attr('id').split('_')[2]
        $("#tblDepositedAmount_AccountNo_" + id).val('');
        $("#tblDepositedAmount_AccountNo_" + id).attr('disabled', true);

        $("#tblDepositedAmount_RefNo_" + id).val(UniqeReferenceNumber());
        $("#tblDepositedAmount_RefNo_" + id).attr('disabled', true);
        virtualAc_Success = true;

    }
    else {
        var indexAccountname = userContext.VAccountNo;
        var id = obj.attr('id').split('_')[2]
        $("#tblDepositedAmount_AccountNo_" + id).val('');
        $("#tblDepositedAmount_AccountNo_" + id).attr('disabled', false);
        $("#tblDepositedAmount_RefNo_" + id).val(UniqeReferenceNumber());
        $("#tblDepositedAmount_RefNo_" + id).attr('disabled', true);
    }

    if (key != 0) {
        var type = $(obj).attr("id").replace(indexName, 'DepositType');
        var type1 = $(obj).attr("id").replace(indexName, 'AccountNo');
        $("#" + type).val(0);
        $("#" + type1).removeAttr('required');
        $("#" + type).attr('required', 'required');
        $("#" + type).prop('disabled', true);
        $.ajax({
            url: "./Services/Accounts/CashRegisterService.svc/CheckPending", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ CashierID: CashierID, CurrentSNo: CurrentSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == 1002) {

                    ShowMessage('warning', '', "Selected User Already Have Pending Request");
                }
                else
                    return;
            }
        });
        var nid = $(obj).attr("id").replace(indexName, 'DepositedAmount');
        $("#" + nid).focus();
    }
    else {
        var type = $(obj).attr("id").replace(indexName, 'DepositType');
        var type1 = $(obj).attr("id").replace(indexName, 'AccountNo');
        $("#" + type).val(1);
        $("#" + type1).attr('required', 'required');
        $("#" + type).prop('disabled', true)
    }
}
function UniqeReferenceNumber() {
    var date = new Date();
    var components = [
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
    ];

    return (components.join(""));

}
//function CheckAmount()
//{
//    $("#tblDepositedAmount tbody tr").each(function (i, val) {
//        $("#tblDepositedAmount_DepositedAmount_" + parseInt(i + 1)).on("keypress keyup", function (event) {
//            if (code !== 37 && code !== 39)
//                $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
//            if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
//                event.preventDefault();
//            }            
//        });

//        $("#tblDepositedAmount_DepositedAmount_" + parseInt(i + 1)).on("blur", function (event){
//            var data = $("#tblDepositedAmount_DepositedAmount_" + parseInt(i + 1)).val();
//            var j = data.split('.')
//            if (j[1] != undefined)
//                j = j[0] + '.' + j[1].substring(0,2);
//            $("#tblDepositedAmount_DepositedAmount_" + parseInt(i + 1)).val(j);
//        });
//    });
//}

function SaveAmountdeposite() {
    debugger
    var arrVal = [];
    var CashierID = userContext.UserSNo;
    var GroupSNo = userContext.GroupSNo;
    var CurrentSno = CurrentSNo;
    var btnshift = $("#btnshiftstart").is(":disabled");
    //   var StartDate = $("#FromDate").val();
    var StartDate = $("#StartDate").val();
    if ($("#StartDate").val() == "") {
        ShowMessage('warning', 'Cash Register', "Please Fill Start Date");
        return false;
    }
    else if (btnshift == false)
    {
        ShowMessage('warning', 'Cash Register', "Please Start Your Shift");
        return false;
    }
    else {
        
        var res = $("#tblDepositedAmount tr[id^='tblDepositedAmount']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
        getUpdatedRowIndex(res, 'tblDepositedAmount');
        var dataDetails = JSON.parse(($('#tblDepositedAmount').appendGrid('getStringJson')));
        if (virtualAc_Success == false) {
            ShowMessage('warning', '', "Please assign Virtual account No. to the Terminal before process.");

            return false;
        }


        if (dataDetails != false && virtualAc_Success != false) {
            $.ajax({
                url: "./Services/Accounts/CashRegisterService.svc/SaveAmountDepositDetail", async: false, type: "POST", dataType: "json", cache: false,

                data: JSON.stringify({ CashierID: CashierID, GroupSNo: GroupSNo, CurrentSno: CurrentSno, StartDate: StartDate, dataDetails: dataDetails }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result == 0) {
                        ShowMessage('success', 'Success!', "Amount Transferred Successfully");
                        GetSNo();
                        GetCashRegister();
                        var rowcount = $('#tblDepositedAmount tbody tr').length;
                        for (var i = 1; i <= rowcount; i++) {
                            $("#tblDepositedAmount_DepositedToUserId_" + i).attr("newvalue", $("#tblDepositedAmount_DepositedToUserId_" + i).val())
                            $("#tblDepositedAmount_DepositedAmount_" + i).attr("newvalue", $("#tblDepositedAmount_DepositedAmount_" + i).val())
                            $("#tblDepositedAmount_DRemark_" + i).attr("newvalue", $("#tblDepositedAmount_DRemark_" + i).val())



                            var oldval = userContext.FirstName + "/Total Amount(" + inv + ")";
                            var newval = $("#tblDepositedAmount_DepositedToUserId_" + i).attr("newvalue") + "/" + $("#tblDepositedAmount_DepositedAmount_" + i).attr("newvalue") + "/" + $("#tblDepositedAmount_DRemark_" + i).attr("newvalue") + "/" + "TRANSFER";
                            var a = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "CashRegister", ColumnName: 'Cash Transfer', OldValue: oldval, NewValue: newval };
                            arrVal.push(a);
                        }
                       
                        //   AuditLogSaveNewValue("tbltariffinvoice", "true", "GENERATEINVOICE", "Invoice No", InvoiceNo, "", "Edit", userContext.TerminalSNo, userContext.NewTerminalName);
                        SaveAppendGridAuditLog("Cashier Name", userContext.FirstName, "0", JSON.stringify(arrVal), "Edit", userContext.TerminalSNo, userContext.NewTerminalName);

                        $("#tblDepositedAmount").data("kendoWindow").close();

                    }
                    else if (result[0] == 123) {
                        ShowMessage('warning', '', "Contact Admin!");
                        $("#tblDepositedAmount").data("kendoWindow").close();
                    }
                    else if (result[0] == 1001) {
                        ShowMessage('warning', '', "Insufficient Amount");
                        $("#tblDepositedAmount").data("kendoWindow").close();
                    }
                    else if (result[0] == 1002) {
                        ShowMessage('warning', '', "Selected User Already Have Pending Request");
                        $("#tblDepositedAmount").data("kendoWindow").close();
                    }
                    else
                        return;
                }
            });
        }
    }
}

function SaveReceiveStatus() {
    var CashierID = userContext.UserSNo;
    var GroupSNo = userContext.GroupSNo;
    var CurrentSno = CurrentSNo;
    var arrVal = [];

    var res = $("#tblReceiveAmount tr[id^='tblReceiveAmount']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
    getUpdatedRowIndex(res, 'tblReceiveAmount');
    var dataDetails = JSON.parse(($('#tblReceiveAmount').appendGrid('getStringJson')));

    if (dataDetails != false) {
        $.ajax({
            url: "./Services/Accounts/CashRegisterService.svc/SaveReceiveStatus", async: false, type: "POST", dataType: "json", cache: false,

            data: JSON.stringify({ CashierID: CashierID, GroupSNo: GroupSNo, CurrentSno: CurrentSno, dataDetails: dataDetails }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == 0) {
                    var rowcount = $('#tblReceiveAmount tbody tr').length;
                    for (var i = 1; i <= rowcount; i++) {
                        $("#tblReceiveAmount_CashierNameBy_" + i).attr("newvalue", $("#tblReceiveAmount_CashierNameBy_"+i).text())
                        $("#tblReceiveAmount_Amount_" + i).attr("newvalue", $("#tblReceiveAmount_Amount_" + i).val())
                        $("#tblReceiveAmount_Status_" + i).attr("newvalue", $("#tblReceiveAmount_Status_" + i +" "+ "option:selected").text())
                        $("#tblReceiveAmount_Remarks_" + i).attr("newvalue", $("#tblReceiveAmount_Remarks_" + i).val())
                        

                        var oldval = userContext.FirstName + "/Total Amount(" + inv + ")";
                        var newval = $("#tblReceiveAmount_CashierNameBy_" + i).attr("newvalue") + "/" + $("#tblReceiveAmount_Amount_" + i).attr("newvalue") + "/" + $("#tblReceiveAmount_Status_" + i).attr("newvalue") + "/" + $("#tblReceiveAmount_Remarks_" + i).attr("newvalue");
                        var a = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "CashRegister", ColumnName: 'Receive Amount', OldValue: oldval, NewValue: newval };
                        arrVal.push(a);
                    }

                    //   AuditLogSaveNewValue("tbltariffinvoice", "true", "GENERATEINVOICE", "Invoice No", InvoiceNo, "", "Edit", userContext.TerminalSNo, userContext.NewTerminalName);
                    SaveAppendGridAuditLog("Cashier Name", userContext.FirstName, "0", JSON.stringify(arrVal), "Edit", userContext.TerminalSNo, userContext.NewTerminalName);

                    ShowMessage('success', '', "Process Done Successfully");
                    GetSNo();
                    GetCashRegister();
                    $("#tblReceiveAmount").data("kendoWindow").close();
                }
                else {
                    return;
                }
            }
        });
    }
}

function GetSNo() {
    var CashierID = userContext.UserSNo;
    $.ajax({
        url: "./Services/Accounts/CashRegisterService.svc/GetTotalAmount",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ CashierID: CashierID }),
        async: false,
        type: 'post',
        cache: false,
        success: function (result) {
            var dataTableobj = JSON.parse(result);
            FinalData = dataTableobj.Table0;
            FinalData1 = dataTableobj.Table1;
            if (FinalData != '')
                Amount = FinalData[0].Amount;
            if (FinalData1 != '') {
                CurrentSNo = FinalData1[0].SNo;
                inv = FinalData1[0].TotalAmount;
            }
        },
        error: function (err) {
            alert("Generated Error");
        }
    });
}

function ClosedAccount() {
    var arrVal = [];
    var CashierID = userContext.UserSNo;
    var GroupSNo = userContext.GroupSNo;
    var CurrentSno = CurrentSNo;
    var Date = $("#FromDate").val();
    //var StartDate = $("#FromDate").val();
    //var EndDate = $("#ToDate").val();
    var StartDate = $("#StartDate").val();
   // var EndDate = $("#EndDate").val();

    //if ($("#EndDate").val() == "") {
    //    ShowMessage('warning', 'Cash Register', "Please Fill End Date");
    //    return false;
    //}

//else 
//{
        $.ajax({
            url: "./Services/Accounts/CashRegisterService.svc/ClosingAccount", async: false, type: "POST", dataType: "json", cache: false,

            data: JSON.stringify({ CashierID: CashierID, GroupSNo: GroupSNo, CurrentSNo: CurrentSNo, StartDate: StartDate }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == 0 && CurrentSNo != 0) {
                  
                    //GetCashRegister();
               
                    var a = { ProcessName: getQueryStringValue("Apps").toUpperCase(), SubprocessName: "CashRegister", ColumnName: 'Shift Status', OldValue: "Start", NewValue: "End" };
                    arrVal.push(a);
                    //   AuditLogSaveNewValue("tbltariffinvoice", "true", "GENERATEINVOICE", "Invoice No", InvoiceNo, "", "Edit", userContext.TerminalSNo, userContext.NewTerminalName);
                    SaveAppendGridAuditLog("Cashier Name", userContext.FirstName, "0", JSON.stringify(arrVal), "Edit", userContext.TerminalSNo, userContext.NewTerminalName);

                    window.open("HtmlFiles\\CashRegister\\CashierClosingReceipt.html?CurrentSno=" + CurrentSNo + "&CashierID=" + CashierID + "&GroupSNo=" + GroupSNo + "&StartDate=" + StartDate + "&EndDate=" + EndDate + "&OpeningAmount=" + OpeningAmount + "&ClosingAmount=" + ClosingAmount + "&AmountDeposit=" + AmountDeposit + "&TotalReceiveAmount=" + TotalReceiveAmount);
                    window.setTimeout(function () {
                     
                        window.location.href = 'Default.cshtml?Module=Accounts&Apps=CashRegister&FormAction=New';
                      
                    }, 100);
                }
                else if (result == 1001) {
                    ShowMessage('warning', '', "You Have Some Pending Request(Either Accept or Reject)");
                    $("#Close").attr("disabled", true);
                    $("#DepositAmount").attr("disabled", true);
                    $("#ReceiveAmount").attr("disabled", true);
                }
                else if (CurrentSNo == 0) {
                    ShowMessage('warning', 'Closing Account!', "Your Shift Is Not Active, Please Start Your Shift First");
                    $("#Close").attr("disabled", true);
                    $("#DepositAmount").attr("disabled", true);
                    $("#ReceiveAmount").attr("disabled", true);
                }
                else {
                    return;
                }
            }
        });
    }
//}

function ExtraCondition(textId) {
    var filterEmbargo = cfi.getFilter("AND");
    var x = textId.split('_')[2];
    if (textId == 'tblDepositedAmount_DepositedToUserId_' + x) {
        $("#tblDepositedAmount").find("[id^='tblDepositedAmount_DepositedToUserId']").each(function (i, row) {
            if (x != i + 1) {

                cfi.setFilter(filterEmbargo, "SNo", 'notin', $("#tblDepositedAmount_HdnDepositedToUserId_" + (i + 1)).val());
            }

        });
        cfi.setFilter(filterEmbargo, "SNo", 'notin', userContext.UserSNo);
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filterEmbargo);
        return RegionAutoCompleteFilter;
    }
}

function GetLocalTime() {
    var CashierID = userContext.UserSNo;
    $.ajax({
        url: "./Services/Accounts/CashRegisterService.svc/GetLocalTime",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ CashierID: CashierID }),
        async: false,
        type: 'post',
        cache: false,
        success: function (result) {
            var dataTableobj = JSON.parse(result);
            FinalData = dataTableobj.Table0;
            if (FinalData != '')
                $("#EndTime").val(FinalData[0].LocalTime);

        },
        error: function (err) {
            alert("Generated Error");
        }
    });
}

function GetLastLoggedOn()
{
   
    var CashierID = userContext.UserSNo;
    $.ajax({
        url: "./Services/Accounts/CashRegisterService.svc/GetLastLoggedOn",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ CashierID: CashierID }),
        async: false,
        type: 'post',
        cache: false,
        success: function (result) {
            var dataTableobj = JSON.parse(result);
            FinalData = dataTableobj.Table0;
            if (FinalData != '')
                //$("#EndTime").val(FinalData[0].LocalTime);
               // Lastlogin = FinalData[0].LastLoggedOn;
            LastLoggedTime = FinalData[0].LastLoggedTime;
            //EndDate = FinalData[0].EndDate;
            //EndTime = FinalData[0].EndTime;
        },
        error: function (err) {
            alert("Generated Error");
        }
    });
}

function IsShiftClosed() {
    var isShiftStarted = false;
   
    $.ajax({
        url: "./Services/Accounts/CashRegisterService.svc/IsShiftClosed/" + userContext.UserSNo,
        contentType: "application/json; charset=utf-8",
        type: 'GET',
        cache: false,
        async: false,
        success: function (result) {
            isShiftStarted = result.IsShiftClosedResult;
          
        },
        error: function (err) {
        }
    });
    return isShiftStarted;
}