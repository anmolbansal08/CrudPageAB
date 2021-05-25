
/// <reference path="../../Scripts/references.js" />

var pageType = "";
var gridAddedRowCount = 0;
var length = 0;
var table1 = "recipienttype";
var column1 = "Name";
$(document).ready(function () {

    cfi.ValidateForm();

    $("#MasterDuplicate").hide();


    $('#aspnetForm').attr("enctype", "multipart/form-data");
    var TransactionType = [{ Key: "0", Text: "Export" }, { Key: "1", Text: "Import" }, { Key: "2", Text: "Transit" }];
    cfi.AutoCompleteByDataSource("TransactionType", TransactionType, null, ",");

    cfi.AutoComplete("CitySNo", "CityCode,CityName", "vCity", "SNo", "CityCode", ["CityCode", "CityName"], null, "contains");
    cfi.AutoComplete("OfficeSNo", "SNo,Name", "VOffice", "SNo", "Name", ["Name"], null, "contains");
    cfi.AutoComplete("AirlineSNo", "AirlineCode,AirlineName", "Airline", "SNo", "AirlineCode", ["AirlineCode", "AirlineName"], null, "contains", ",");

    cfi.AutoComplete("SPHCSNo", "code", "vwsphc", "SNo", "code", null, null, "contains", ",");
    cfi.AutoComplete("AlertEventSNo", "EventType", "AlertEventType", "SNo", "EventType", null, ChangeRequired, "contains");
    cfi.BindMultiValue("SPHCSNo", $("#Text_SPHCSNo").val(), $("#SPHCSNo").val());
    cfi.BindMultiValue("AirlineSNo", $("#Text_AirlineSNo").val(), $("#AirlineSNo").val());
    cfi.BindMultiValue("TransactionType", $("#Text_TransactionType").val(), $("#TransactionType").val());


    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $("#CitySNo").val(userContext.CitySNo);
        $("#Text_CitySNo").val(userContext.CityCode + '-' + userContext.CityName);

    }

    $("input[name='operation']").unbind('click').click(function () {
        dirtyForm.isDirty = false;//to track the changes
        _callBack();
        var flag = false;
        var i = 0;
        if ($("#Message").val() == "" && $("#Email").val() == "") {
            ShowMessage('warning', 'Alert Event', "SMS/Email Template is mandatory");
            return false;
        }
        $("tr[id^='tblRecipient_Row_']").each(function () {
            if ($("#" + $(this).attr("id").replace("Row", "Name")).val() == '') {
                $("#" + $(this).attr("id").replace("Row", "HdnName")).val(-1);
            }
            if ($("#" + $(this).attr("id").replace("Row", "RecipientType")).val() == 0) {
                i = $(this).attr("id").split('_')[2];
                flag = true;
                return false;
            }
        });
        if (flag == true) {
            ShowMessage('warning', 'Warning-Alert Event', 'Select Recipient Type at Row No. ' + i);
        }
        if (cfi.IsValidSubmitSection() && flag == false) {
            SaveAlertEventsDetail();

            if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {            
                AuditLogSaveNewValue("tbl");
            }

            return true;
        }
        else {
            return false
        }
    });

    getGrid();
    if (getQueryStringValue("FormAction").toUpperCase() == 'NEW') {
        ChangeRequired();
        modifyMesage();
        modifyEmail();
    }
    else {
        if ($("#Text_AlertEventSNo").val() == 'HOLD SHIPMENT' || $("#AlertEventSNo").val() == 4)
            ChangeRequired();
        else {
            ChangeRequired();
            modifyMesage();
            modifyEmail();
        }
    }

});

pagetype = getQueryStringValue("FormAction").toUpperCase();
function SaveAlertEventsDetail() {

    var tblGrid = "tblRecipient";
    var rows = $("tr[id^='" + tblGrid + "']").map(function () { return $(this).attr("id").split('_')[2]; }).get();
    getUpdatedRowIndex(rows.join(","), tblGrid);
    addintext();
    $("#hdnFormData").val($('#tblRecipient').appendGrid('getStringJson'));

}

$("#Message").on('blur', function () {
    modifyMesage();
});

$("#Email").on('blur', function () {
    modifyEmail();
});

function modifyMesage() {
    if ($("#Message").val() == "" || $("#Message").val() == undefined)
        $("[id^='tblRecipient_MobileNo_']").removeAttr('required');
    else {
        $("tr[id^='tblRecipient_Row_']").each(function () {
            if ($("#" + $(this).attr("id").replace("Row", "RecipientType")).val() == '3') {
                $("#" + $(this).attr("id").replace("Row", "MobileNo")).attr('required', 'required');
            }
        });
    }
}

function modifyEmail() {
    if ($("#Email").val() == "" || $("#Email").val() == undefined)
        $("[id^='tblRecipient_EmailId_']").removeAttr('required');
    else {
        $("tr[id^='tblRecipient_Row_']").each(function () {
            if ($("#" + $(this).attr("id").replace("Row", "RecipientType")).val() == '3') {
                $("#" + $(this).attr("id").replace("Row", "EmailId")).attr('required', 'required');
            }
        });
    }
}

function ChangeRequired() {
    $("[id^='tblRecipient_']").removeAttr('required');
}

function ExtraCondition(textId) {
    var filterEmbargo = cfi.getFilter("AND");
    if (textId == "Text_OfficeSNo") {
        cfi.setFilter(filterEmbargo, "CityCode", "eq", $("#Text_CitySNo").data("kendoAutoComplete").value().split("-")[0])
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginCityAutoCompleteFilter2;
    }
    if (textId == "Text_AirlineSNo")
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#AirlineSNo").val()), cfi.autoCompleteFilter(textId);

    if (textId == "Text_TransactionType")
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, $("#TransactionType").val(), "notin", $("#TransactionType").val()), cfi.autoCompleteFilter(textId);

    if (textId == "Text_SPHCSNo")
        return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#SPHCSNo").val()), cfi.autoCompleteFilter(textId);

    //autocomplete on gid
    var y = textId.split('_')[2];
    if (textId == "tblRecipient_Name_" + y) {
        cfi.setFilter(filterEmbargo, "rtype", "eq", $("#tblRecipient_RecipientType_" + y).val());
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filterEmbargo);
        column1 = "Name";
        return RegionAutoCompleteFilter;
    }


}

pageType = $("#hdnPageType").val();

function getGrid() {

    var ind;
    $('#tblRecipient').appendGrid({

        tableID: "tblRecipient",
        contentEditable: true,
        masterTableSNo: $("#hdnAlertEventsSNo").val(),
        currentPage: 1,
        itemsPerPage: 5,
        whereCondition: null,
        sort: "",
        isGetRecord: true,
        servicePath: "./Services/Permissions/AlertEventsService.svc",
        getRecordServiceMethod: "GetAlertEventsSlabRecord",
        deleteServiceMethod: "DeleteAlertEventsSlabRecord",
        caption: 'Recipient Type',
        captionTooltip: 'Recipient Type',
        initRows: 1,
        columns: [{ name: 'SNo', type: 'hidden', value: 0 },

                  {
                      name: 'RecipientType', display: 'Recipient Type', type: (pageType == "NEW" || pageType == "EDIT") ? "select" : "select", controltype: 'autocomplete', ctrlOptions: { 0: 'Select', 1: 'Forwarder (Agent)', 2: 'Airline', 3: 'Self', }, ctrlCss: { width: '100px', height: '20px' }, onChange: function (evt, rowIndex) {
                          ind = evt.target.id.split('_')[2];
                          var indexName = evt.target.id.split('_')[1];
                          var replacedID = (evt.target.id).replace(indexName, 'Name');
                          var replacedID1 = (evt.target.id).replace(indexName, 'HdnName');
                          $("#" + replacedID).val('');
                          if ($("#" + evt.target.id).val() == 3) {
                              $("#" + replacedID).val('SELF');
                              $("#" + replacedID1).val(3);
                              if ($("#Message").val() == "") {
                                  $("#" + (evt.target.id).replace(indexName, 'MobileNo')).removeAttr('required');
                              }
                              else {
                                  $("#" + (evt.target.id).replace(indexName, 'MobileNo')).attr('required', 'required');
                              }
                              if ($("#Email").val() == "") {
                                  $("#" + (evt.target.id).replace(indexName, 'EmailId')).removeAttr('required');
                              }
                              else {
                                  $("#" + (evt.target.id).replace(indexName, 'EmailId')).attr('required', 'required');
                              }

                          }
                          else if ($("#Text_AlertEventSNo").val() == 'HOLD SHIPMENT' || $("#AlertEventSNo").val() == 4) {
                              $("#" + replacedID).val('');
                              $("#" + replacedID1).val(-1);
                              ChangeRequired();
                          } else {
                              $("#" + replacedID).val('');
                              $("#" + replacedID1).val(-1);
                              ChangeRequired();
                              //if ($("#Message").val() == "") {
                              //    $("#" + (evt.target.id).replace(indexName, 'MobileNo')).removeAttr('required');
                              //}
                              //else {
                              //    $("#" + (evt.target.id).replace(indexName, 'MobileNo')).attr('required', 'required');
                              //}
                              //if ($("#Email").val() == "") {
                              //    $("#" + (evt.target.id).replace(indexName, 'EmailId')).removeAttr('required');
                              //}
                              //else {
                              //    $("#" + (evt.target.id).replace(indexName, 'EmailId')).attr('required', 'required');
                              //}
                          }

                      }, ctrlAttr: { maxlength: 500, }, isRequired: (pageType == "NEW" || pageType == "EDIT" ? true : false)
                  },
                {
                    name: "Name", display: "Name", type: (pageType == "NEW" || pageType == "EDIT") ? "text" : "label", ctrlAttr: { controltype: pageType == "NEW" || pageType == "EDIT" ? 'autocomplete' : 'label', placeholder: "ALL" }, ctrlCss: { width: '100px', height: '20px' }, isRequired: (pageType == "NEW" || pageType == "EDIT" ? true : false), tableName: table1, textColumn: column1, keyColumn: 'SNo', filterCriteria: "contains", onChange: function (evt, rowIndex) {

                    }
                },
                { name: "EmailId", display: "Email Id(Max Allowed 3)  ", type: (pageType == "NEW" || pageType == "EDIT") ? "text" : "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 600, onfocus: "return adddivEmail(this);" }, isRequired: (pageType == "NEW" || pageType == "EDIT" ? true : false) },
                {
                    name: "MobileNo", display: "Mobile No.(Max Allowed 3)", type: (pageType == "NEW" || pageType == "EDIT") ? "text" : "label", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 25, onfocus: "return adddivMobile(this);", oninput: "this.value = this.value.replace(/[^0-9.]/g, '');" }, isRequired: (pageType == "NEW" || pageType == "EDIT" ? true : false)
                },
        ],
        afterRowRemoved: function (tbWhole, rowIndex) {
            //var s = rowIndex;
            //divmail = $("<div id='divmailAdd" + s + "' style='overflow:auto;'><ul id='addliste" + s + "' style='padding:3px 2px 2px 0px;margin-top:0px;'></ul></div>");
            //if ($("#divmailAdd" + s).length === 0)
            //$("#tblRecipient_EmailId_" + s).after(divmail);
            if (pageType == 'EDIT') {
                window.setTimeout(function () { location.reload() }, 380);
            }
            //  addindiv();

        },
        beforeRowAppend: function (tableID, uniqueIndex) {
            var flag = false;
            var i = 0;
            if (pageType == 'NEW' || pageType == 'EDIT') {
                $("tr[id^='tblRecipient_Row_']").each(function () {
                    if ($("#" + $(this).attr("id").replace("Row", "RecipientType")).val() == 0) {
                        i = $(this).attr("id").split('_')[2];
                        flag = true;
                        return false;
                    }
                });
                if (flag == true) {
                    ShowMessage('warning', 'Warning-Alert Event', 'Select Recipient Type at Row No. ' + i);
                    return false;
                }
                else
                    return true;
            }
        },
        //afterRowAppended:function(tbWhole, rowIndex){
        //    if($("#Message").val()==""||$("#Message").val()==undefined)
        //        $("[id^='tblRecipient_MobileNo_']").removeAttr('required');
        //    else
        //        $("[id^='tblRecipient_MobileNo_']").attr('required', 'required');
        //    if($("#Email").val()==""||$("#Email").val()==undefined)
        //        $("[id^='tblRecipient_EmailId_']").removeAttr('required');
        //    else
        //        $("[id^='tblRecipient_EmailId_']").attr('required', 'required');
        //},
        isPaging: false,
        hideButtons: {
            remove: (pageType == "NEW" || pageType == "EDIT" ? false : true),
            removeLast: true,
            insert: true,
            append: (pageType == "NEW" || pageType == "EDIT" ? false : true),
            updateAll: true
        }

    });
    //On Grid Load
    if (pageType == "NEW") {
        $("#tblRecipient thead tr:nth-child(2) td:nth-child(1)").css("width", "1px");
        $("#tblRecipient thead tr:nth-child(2) td:nth-child(2)").css("width", "25px");
        $("#tblRecipient thead tr:nth-child(2) td:nth-child(3)").css("width", "25px");
        // Adding blank a row in grid on load.
        $('#tblRecipient').appendGrid('insertRow', 1, 0);
        $("#tblRecipient tbody td").find("[id^='tblRecipient_Delete']").hide();
    }

    if (pageType == "EDIT") {
        $("#tblRecipient thead tr:nth-child(2) td:nth-child(1)").css("width", "1px");
        $("#tblRecipient thead tr:nth-child(2) td:nth-child(2)").css("width", "25px");
        $("#tblRecipient thead tr:nth-child(2) td:nth-child(3)").css("width", "25px");

        var totalrow = $("tr[id^='tblRecipient_Row']").length;
        for (var i = 1; i < totalrow + 1; i++) {
            if ($("#tblRecipient_EmailId_" + i).val() != '') {
                var textval = $("#tblRecipient_EmailId_" + i).val();
                divmail = $("<div id='divmailAdd" + i + "' style='overflow:auto;'><ul id='addliste" + i + "' style='padding:3px 2px 2px 0px;margin-top:0px;'></ul></div>");
                $("#tblRecipient_EmailId_" + i).after(divmail);
                var len = textval.split(",").length;
                for (var jk = 0; jk < len; jk++) {
                    $("ul#addliste" + i).append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + textval.split(',')[jk] + " </span><span id='" + jk + "' class='k-icon k-delete remove'></span></li>");
                }
                $("#tblRecipient_EmailId_" + i).val("");
                $("#tblRecipient_EmailId_" + i).removeAttr("required");
            }
        }

        for (var i = 1; i < totalrow + 1; i++) {
            if ($("#tblRecipient_MobileNo_" + i).val() != '') {
                var textval = $("#tblRecipient_MobileNo_" + i).val();
                divmobile = $("<div id='divmobile" + i + "' style='overflow:auto;'><ul id='addlistm" + i + "' style='padding:3px 2px 2px 0px;margin-top:0px;'></ul></div>");
                $("#tblRecipient_MobileNo_" + i).after(divmobile);
                var len = textval.split(",").length;
                for (var jk = 0; jk < len; jk++) {
                    $("ul#addlistm" + i).append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + textval.split(',')[jk] + " </span><span id='" + jk + "' class='k-icon k-delete remove'></span></li>");
                }
                $("#tblRecipient_MobileNo_" + i).val("");
                $("#tblRecipient_MobileNo_" + i).removeAttr("required");
            }
            $("body").on("click", ".remove", function () {
                $(this).closest("li").remove();
                $("#tblRecipient_MobileNo_" + i).val("");
                $("#tblRecipient_EmailId_" + i).val("");
            });
        }
    }

    if (pageType == "READ") {
        var totalrow = $("tr[id^='tblRecipient_Row']").length;
        for (var i = 1; i < totalrow + 1; i++) {
            $("#tblRecipient_RecipientType_" + i).attr("disabled", true);
        }
    }
}




function adddivEmail(obj) {
    if (pageType == "NEW" || pageType == "EDIT") {
        spnlbl = $("<br/><span class='k-label'>(Press space key to capture receiver E-mail Address and Add New E-mail ( If Required))</span>");
        $(obj).after(spnlbl);
        var i = $(obj).attr('id').split("_")[2];
        divmail = $("<div id='divmailAdd" + i + "' style='overflow:auto;'><ul id='addliste" + i + "' style='padding:3px 2px 2px 0px;margin-top:0px;'></ul></div>");
        if ($("#divmailAdd" + i).length === 0)
            $(obj).after(divmail);


        $(obj).keyup(function (e) {
            var addlen = $(obj).val();

            var iKeyCode = (e.which) ? e.which : e.keyCode
            if (iKeyCode == 32) {
                // $("input[name='operation']").unbind("click");
                //addlen = addlen.split(" ")[0];
                addlen = addlen.slice(0, -1);
                if (addlen != "") {
                    if (ValidateEMail(addlen)) {
                        if ($("ul#addliste" + i + " li").length < 3) {

                            var listlen = $("ul#addliste" + i + " li").length;
                            $("ul#addliste" + i).append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + addlen + " </span><span id='" + listlen + "' class='k-icon k-delete remove'></span></li>");
                        }

                        else {
                            ShowMessage('warning', 'Warning - Alert Event', "Maximum 3 E-mail Addresses allowed.");
                        }
                        $(obj).val('');
                    }
                    else {
                        $(obj).val('');
                        ShowMessage('warning', 'Warning - Alert Event', "Enter valid Email address");
                        return;
                    }
                }
            }
            else
                e.preventDefault();
        });
        $(obj).blur(function () {
            $(obj).val('');

            var k = '';
            for (var m = 0; m < $("ul#addliste" + i + " li span").text().split(' ').length - 1; m++)
            { k = k + $("ul#addliste" + i + " li span").text().split(' ')[m] + ','; }

            $(obj).val(k.substring(0, k.length - 1));        //remove last comma   
            if ($("#addliste" + i + " li").length > 0)
                $(obj).removeAttr("required");
            $(spnlbl).remove();
        });

        $("body").on("click", ".remove", function () {
            $(this).closest("li").remove();
            $(obj).val('');
        });
    }
    //else if (pageType == "EDIT") {

    //}

}

function ValidateEMail(email) {
    var regex = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    ///^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/
    return regex.test(email);
}

function adddivMobile(obj) {
    if (pageType == "NEW" || pageType == "EDIT") {
        spnlbl = $("<br/><span class='k-label'>(Press space key to capture receiver Mobile No. and Add Mobile No. ( If Required))</span>");
        $(obj).after(spnlbl);
        var i = $(obj).attr('id').split("_")[2];
        divmobile = $("<div id='divmobile" + i + "' style='overflow:auto;'><ul id='addlistm" + i + "' style='padding:3px 2px 2px 0px;margin-top:0px;'></ul></div>");
        if ($("#divmobile" + i).length === 0)
            $(obj).after(divmobile);


        $(obj).keyup(function (e) {
            var addlen = $(obj).val();
            var iKeyCode = (e.which) ? e.which : e.keyCode
            if (iKeyCode == 32) {


                var restdata = $("ul#addlistm" + i + " li").text().split(" ");

                if (restdata.length > 0)
                    for (var j = 0; j < restdata.length - 1; j++) {
                        if (addlen == restdata[j]) {
                            $(obj).val('');
                            ShowMessage('warning', 'Warning - Alert Event', "Mobile Number already entered");
                            return;
                        }
                    }
                if (addlen != "") {
                    if ($("ul#addlistm" + i + " li").length < 3) {

                        var listlen = $("ul#addlistm" + i + " li").length;
                        $("ul#addlistm" + i).append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + addlen + " </span><span id='" + listlen + "' class='k-icon k-delete remove'></span></li>");

                    }
                        //    $(obj).val('');

                    else {
                        //addlen = "";
                        $(obj).val('');
                        ShowMessage('warning', 'Warning - Alert Event', "Maximum 3 Mobile Number allowed.");
                        return;

                    }
                }

                $(obj).val('');

            }
            else if (addlen.length > 25) {
                $(obj).val('');
            }
            else
                e.preventDefault();
        });
        $(obj).blur(function () {
            $(obj).val('');
            var L = '';
            for (var m = 0; m < $("ul#addlistm" + i + " li").text().split(' ').length - 1; m++)
            { L = L + $("ul#addlistm" + i + " li span").text().split(' ')[m] + ','; }

            $(obj).val(L.substring(0, L.length - 1));      //remove last comma   
            if ($("#addlistm" + i + " li").length > 0)
                $(obj).removeAttr("required");
            $(spnlbl).remove();

        });
        $("body").on("click", ".remove", function () {
            $(this).closest("li").remove();
        });


        //var L = '';
        //for (var i = 0; i < $("ul#addlist1 li").text().split(' ').length - 1; i++)
        //{ L = L + $("ul#addlist1 li span").text().split(' ')[i] + ','; }

        //$(obj).val(L.substring(0, L.length - 1));      //remove last comma   
        //if ($("#addlist1 li").length > 0)
        //    $(obj).removeAttr("data-valid");
    }
}

function addintext() {
    if (pageType == "EDIT") {
        $("#tblRecipient thead tr:nth-child(2) td:nth-child(1)").css("width", "1px");
        $("#tblRecipient thead tr:nth-child(2) td:nth-child(2)").css("width", "25px");
        $("#tblRecipient thead tr:nth-child(2) td:nth-child(3)").css("width", "25px");


        var totalrow = $("tr[id^='tblRecipient_Row']").length;

        for (var i = 1; i < totalrow + 1; i++) {

            $("#tblRecipient_EmailId_" + i).val('');
            $("#tblRecipient_MobileNo_" + i).val('');

            var k = '';
            for (var m = 0; m < $("ul#addliste" + i + " li span").text().split(' ').length - 1; m++)
            { k = k + $("ul#addliste" + i + " li span").text().split(' ')[m] + ','; }

            $("#tblRecipient_EmailId_" + i).val(k.substring(0, k.length - 1));        //remove last comma   
            if ($("#addliste" + i + " li").length > 0)
                $("#tblRecipient_EmailId_" + i).removeAttr("required");

            var L = '';
            for (var m = 0; m < $("ul#addlistm" + i + " li").text().split(' ').length - 1; m++)
            { L = L + $("ul#addlistm" + i + " li span").text().split(' ')[m] + ','; }

            $("#tblRecipient_MobileNo_" + i).val(L.substring(0, L.length - 1));      //remove last comma   
            if ($("#addlistm" + i + " li").length > 0)
                $("#tblRecipient_MobileNo_" + i).removeAttr("required");
        }
    }
}

function addindiv() {
    var totalrow = $("tr[id^='tblRecipient_Row']").length;
    for (var i = 1; i < totalrow + 1; i++) {
        var textval = $("#tblRecipient_EmailId_" + i).val();
        divmail = $("<div id='divmailAdd" + i + "' style='overflow:auto;'><ul id='addliste" + i + "' style='padding:3px 2px 2px 0px;margin-top:0px;'></ul></div>");
        if ($("#divmailAdd" + i).length === 0)
            $("#tblRecipient_EmailId_" + i).after(divmail);
        var len = textval.split(",").length;
        for (var jk = 0; jk < len - 1; jk++) {
            $("ul#addliste" + i).append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + textval.split(',')[jk] + " </span><span id='" + jk + "' class='k-icon k-delete remove'></span></li>");
        }
        $("#tblRecipient_EmailId_" + i).val("");
        $("#tblRecipient_EmailId_" + i).removeAttr("required");
    }

    for (var i = 1; i < totalrow + 1; i++) {
        var textval = $("#tblRecipient_MobileNo_" + i).val();
        divmobile = $("<div id='divmobile" + i + "' style='overflow:auto;'><ul id='addlistm" + i + "' style='padding:3px 2px 2px 0px;margin-top:0px;'></ul></div>");
        if ($("#divmobile" + i).length === 0)
            $("#tblRecipient_MobileNo_" + i).after(divmobile);
        var len = textval.split(",").length;
        for (var jk = 0; jk < len - 1; jk++) {
            $("ul#addlistm" + i).append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + textval.split(',')[jk] + " </span><span id='" + jk + "' class='k-icon k-delete remove'></span></li>");
        }
        $("#tblRecipient_MobileNo_" + i).val("");
        $("#tblRecipient_MobileNo_" + i).removeAttr("required");
    }
    $("body").on("click", ".remove", function () {
        $(this).closest("li").remove();
    });

    //window.location.reload();
}

function clear(obj) {
    $(obj).val('');
}


