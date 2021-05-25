
var Amount = 0;
var CurrentSNo = 0;
var inv = 0;

window.setInterval(function () {
    if ($("#FromDate").val() == $("#ToDate").val()) {
        GetSNo();
        $("#DepositAmount").val("Cash Transfer(" + inv + " " + userContext.CurrencyCode + ")");
        if ($("#tblCashRegister tbody tr.empty").length != 1)
            GetCashRegister();
        $("#Close").unbind('click');
        $("#StartTime").data("kendoTimePicker").enable(true);
        $("#EndTime").data("kendoTimePicker").enable(true);
    }
    else {
        $("#StartTime").data("kendoTimePicker").enable(false);
        $("#EndTime").data("kendoTimePicker").enable(false);
        return false;
    }
}, 5000);

var dirtyForm = { isDirty: false };
dirtyForm.checkDirtyForm = function () {

};

$(document).ready(function () {
    cfi.ValidateForm();
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

    $("#tbl .formSection").append('<span id="spnShiftTime" style="padding-left:400px;">Shift Start Date Time <input name="StartDate" id="StartDate" type="text" /> Shift End Date Time <input name="EndDate" id="EndDate" type="text" /></span>');

    $("#StartDate").css("width", "205px");
    $("#StartDate").parent().parent().css("width", "250px");
    $("#EndDate").css("width", "205px")
    $("#EndDate").parent().parent().css("width", "250px")

    $('#StartDate').kendoDateTimePicker({
        format: "dd-MMM-yyyy HH:mm",
        timeFormat: "HH:mm",
        interval: 1
    });

    $('#EndDate').kendoDateTimePicker({
        format: "dd-MMM-yyyy HH:mm",
        timeFormat: "HH:mm",
        interval: 1
    });

    //****************************************************Time****************************************************

    $("#FromDate,#ToDate").change(function () {
        if ($("#FromDate").val() == $("#ToDate").val()) {
            $("#StartTime").data("kendoTimePicker").enable(true);
            $("#EndTime").data("kendoTimePicker").enable(true);
        }
        else {
            $("#StartTime").val('');
            $("#EndTime").val('');
            $("#StartTime").data("kendoTimePicker").enable(false);
            $("#EndTime").data("kendoTimePicker").enable(false);
        }
    });

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

    GetLocalTime();

    //****************************************************End Time****************************************************

    $('#tbl').after("<br/><div id='Container'><div id='divCashRegister' style='height:100px overflow:auto'><table id='tblCashRegister'></table></div><br/><div id='divReceiveAmount' style='height:100px overflow:auto'><table id='tblReceiveAmount'></table></div></div><br/><div id='divDepositedAmount' style='height:100px overflow:auto'><table id='tblDepositedAmount'></table></div></div>")

    $("#Container").hide();
    var CashierID = userContext.UserSNo;

    CheckSession();

    $("#FromDate").data("kendoDatePicker").max(new Date());
    $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
    $("#FromDate").kendoDatePicker({
        change: function () {
            $("#ToDate").data("kendoDatePicker").min($("#FromDate").val());
        }
    });
    $("#FromDate").before('&nbsp;')
    $("#FromDate").css("width", "100px")
    $("#FromDate").parent().css("width", "126px")

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
});

function CheckSession() {
    var CashierID = userContext.UserSNo;
    var GroupSNo = userContext.GroupSNo;
    $.ajax({
        url: "./Services/Accounts/CashRegisterService.svc/CheckSession",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ CashierID: CashierID, GroupSNo: GroupSNo }),
        async: false,
        type: 'post',
        cache: false,
        success: function (result) {
            if (result[0] == 1001) {
                $("#Container").after('<div id="divWindow"><table validateonsubmit="true" class="WebFormTable"><tr><td class="formlabel"><b>Continue with Old Session(Yes/No).</b></td></tr></table></div>');
                $("#divWindow").dialog({
                    autoResize: true,
                    maxWidth: 250,
                    maxHeight: 150,
                    width: 250,
                    height: 150,
                    modal: true,
                    title: 'Confirmation',
                    draggable: false,
                    resizable: false,
                    buttons:
                      {
                          'Yes': function () {
                              $(this).dialog('close');
                              $.ajax({

                              });
                              $(this).find("#yes").click();
                          },
                          'No': function () {
                              $.ajax({
                                  url: "./Services/Accounts/CashRegisterService.svc/NewCashRegister",
                                  contentType: "application/json; charset=utf-8",
                                  data: JSON.stringify({ CashierID: CashierID, GroupSNo: GroupSNo }),
                                  async: false,
                                  type: 'post',
                                  cache: false,
                                  success: function (result) {

                                  }
                              });
                              $(this).dialog('close');
                              $(this).find("#no").click();
                          }
                      }
                });
            }
            else if (result[0] == 1002) {

            }

        }
    });
}

function GetCashRegister() {
    var CashierID = userContext.UserSNo;
    var GroupSNo = userContext.GroupSNo;
    var FromDate = $("#FromDate").val();
    var ToDate = $("#ToDate").val();

    var StartTime = $("#StartTime").val();
    var EndTime = $("#EndTime").val();

    $("#Close").removeAttr("disabled");
    if (CashierID != "") {
        GetSNo();
        getCashRegisterGrid();
        $.ajax({
            url: "./Services/Accounts/CashRegisterService.svc/GetCashRegisterRecord",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ CashierID: CashierID, GroupSNo: GroupSNo, FromDate: FromDate, ToDate: ToDate, StartTime: StartTime, EndTime: EndTime }),
            async: false,
            type: 'post',
            cache: false,
            success: function (result) {
                $("#Container").show();
                if ($("#ReceiveAmount").length === 0) {//(" + Amount + ")
                    $("#Container").before("<input type='button' id='ReceiveAmount' value='Receive Amount' class='btn btn-success' onclick='GetReceiveAmountDetail()'>&emsp;<input type='button' id='DepositAmount' value='Cash Transfer(" + inv + " " + userContext.CurrencyCode + ")' class='btn btn-success' onclick='AmountDeposited()'>&emsp;<input type='button' id='Close' value='Close Account' class='btn btn-success' onclick='ClosedAccount()'>");
                }
                else
                    $("#DepositAmount").val("Cash Transfer(" + inv + " " + userContext.CurrencyCode + ")");

                var dataTableobj = JSON.parse(result);
                if (dataTableobj.Table0.length > 0) {
                    $('#tblCashRegister').appendGrid('load', dataTableobj.Table0);
                }
                else {
                    return;
                }
            },
            error: function (err) {
                alert("Generated Error");
            }
        });
    }

}

function getCashRegisterGrid() {
    $("#tblCashRegister").appendGrid({
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

                  { name: 'InvoiceNo', display: 'Invoice No', type: 'label', ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 600 }, isRequired: false },
                   { name: 'TYPE', display: 'Type', type: 'label', ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 600 }, isRequired: false }
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
    //$("body").on("click", ".remove", function () {
    //    $(this).closest("div").remove();
    //});
}

function GetReceiveAmountDetail() {
    var CashierID = userContext.UserSNo;
    var GroupSNo = userContext.GroupSNo;
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
    if (CashierID != "") {
        getAmountDepositedGrid();
        cfi.PopUp("tblDepositedAmount", "Amount Transfer/Deposit", 900, null, null, null);
        $("#tblDepositedAmount").closest(".k-window").css({
            position: 'fixed',
            top: '5%'
        });
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
                      name: 'DepositedToUserId', display: 'Deposit/Transfer To', type: 'text', ctrlAttr: { controltype: 'autocomplete', onSelect: "return CheckPending(this)" }, ctrlCss: { width: '100px', height: '20px' }, tableName: 'VCashRegisterusers', textColumn: 'FirstName', keyColumn: 'SNo', templateColumn: ["UserName", "FirstName"], basedOn: "UserName,FirstName", filterCriteria: "contains", isRequired: true
                  },

                  {
                      name: 'DepositedAmount', display: 'Amount( ' + userContext.CurrencyCode + ')', type: 'Text', ctrlCss: { width: '150px' }, ctrlAttr: {
                          maxlength: 14, controltype: "decimal2"
                      }, isRequired: true
                  },

                  { name: 'AccountNo', display: 'Account No.', type: 'Text', ctrlCss: { width: '150px' }, ctrlAttr: { maxlength: 25, controltype: 'alphanumericupper' }, isRequired: false },

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
    var CashierID = userContext.UserSNo;
    var GroupSNo = userContext.GroupSNo;
    var CurrentSno = CurrentSNo;

    var res = $("#tblDepositedAmount tr[id^='tblDepositedAmount']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
    getUpdatedRowIndex(res, 'tblDepositedAmount');
    var dataDetails = JSON.parse(($('#tblDepositedAmount').appendGrid('getStringJson')));

    if (dataDetails != false) {
        $.ajax({
            url: "./Services/Accounts/CashRegisterService.svc/SaveAmountDepositDetail", async: false, type: "POST", dataType: "json", cache: false,

            data: JSON.stringify({ CashierID: CashierID, GroupSNo: GroupSNo, CurrentSno: CurrentSno, dataDetails: dataDetails }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == 0) {
                    ShowMessage('success', 'Success!', "Amount Transferred Successfully");
                    GetSNo();
                    GetCashRegister();
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

function SaveReceiveStatus() {
    var CashierID = userContext.UserSNo;
    var GroupSNo = userContext.GroupSNo;
    var CurrentSno = CurrentSNo;

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
    var CashierID = userContext.UserSNo;
    var GroupSNo = userContext.GroupSNo;
    var CurrentSno = CurrentSNo;
    var Date = $("#FromDate").val();
    var StartDate = $("#StartDate").val();
    var EndDate = $("#EndDate").val();
    if ($("#StartDate").val() == "" && $("#EndDate").val() == "") {
        ShowMessage('warning', 'Cash Register', "Please Fill Start Date And End Date");
        return false;
    }
    else {
        $.ajax({
            url: "./Services/Accounts/CashRegisterService.svc/ClosingAccount", async: false, type: "POST", dataType: "json", cache: false,

            data: JSON.stringify({ CashierID: CashierID, GroupSNo: GroupSNo, CurrentSNo: CurrentSNo, StartDate: StartDate, EndDate: EndDate }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == 0 && CurrentSNo != 0) {
                    window.open("HtmlFiles\\CashRegister\\CashierClosingReceipt.html?CurrentSno=" + CurrentSNo + "&CashierID=" + CashierID + "&GroupSNo=" + GroupSNo);
                    window.setTimeout(function () {
                        window.location.href = 'Default.cshtml?Module=Accounts&Apps=""&FormAction=""';
                    }, 500);
                }
                else if (result == 1001) {
                    ShowMessage('warning', '', "You Have Some Pending Request(Either Accept or Reject)");
                    $("#Close").attr("disabled", true);
                }
                else if (CurrentSNo == 0) {
                    ShowMessage('warning', 'Closing Account!', "Your Session Is Not Active");
                    $("#Close").attr("disabled", true);
                }
                else {
                    return;
                }
            }
        });
    }
}

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