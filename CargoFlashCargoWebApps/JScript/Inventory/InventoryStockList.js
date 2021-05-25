var ExcelResult = '';
var Rights = '';
$(document).ready(function () {
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        var ContentType = $("#ContentType").val();
        if (ContentType == 2)
        {
            $("#Text_SHCSNo").attr("disabled", true);
        }
        //$("#Text_ContentCategory").val('');
        //$("#ContentCategory").attr("disabled", true);
        //$("#Text_ContentCategory").attr("disabled", true);
        //$("#ContentCategory").attr('data-valid', '');
        //$("#Text_ContentCategory").attr('data-valid', '');
        //cfi.AutoComplete("ContentCategory", "", "", "", "", ["BaggageType"], null, "contains")
        if ($("#OwnershipSNo").val() == 'AIRLINE') {
            $('#PurchaseDate').closest('tr').find('td:first-child').text('Purchased Date')
            $('#PurchaseAt').closest('tr').find('td:first-child').text('Purchased At')
            $('#PurchaseFrom').closest('tr').find('td:eq(2)').text('Purchased from')
        }
        else {
            $('#PurchaseDate').closest('tr').find('td:first-child').text('Hired Date')
            $('#PurchaseAt').closest('tr').find('td:first-child').text('Hired At')
            $('#PurchaseFrom').closest('tr').find('td:eq(2)').text('Hired from')
        }
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        if ($("#OwnershipSNo").val() == 'AIRLINE') {
            $('#PurchaseDate').closest('tr').find('td:first-child').text('Purchased Date')
            $('#PurchaseAt').closest('tr').find('td:first-child').text('Purchased At')
            $('#PurchaseFrom').closest('tr').find('td:eq(2)').text('Purchased from')
        }
        else {
            $('#PurchaseDate').closest('tr').find('td:first-child').text('Hired Date')
            $('#PurchaseAt').closest('tr').find('td:first-child').text('Hired At')
            $('#PurchaseFrom').closest('tr').find('td:eq(2)').text('Hired from')
        }
    }



    $("#ULDSerialNo").css('text-align', 'right');
    $("#OwnerCode").blur(function () {
        if ($("#OwnerCode").val().length < 2) {
            ShowMessage('warning', 'Need your Kind Attention!', "Owner Code must have minimum 2 characters.");
            $("#OwnerCode").val('');
        }
    });
    $('#ULDSerialNo').focusout(function () {
        if ($('#ULDSerialNo').val().length >= 5 || $('#ULDSerialNo').val() == '') {
            return true;
        }
        else if ($('#ULDSerialNo').val().length <= 4) {
            ShowMessage('warning', 'Need your Kind Attention!', "CART Serial No must have minimum 5 characters.");
            $('#ULDSerialNo').val('');
        }
    });
    $(document).on("contextmenu", function (e) {
        return false;
    });
    $(document).on('drop', function () {
        return false;
    });
    /// Disabled by Sushant
    //  $('#ULDSerialNo').on('drop', function (event) {
    //   event.preventDefault();
    // });
    // $('#TotalNoOfULD').on('drop', function (event) {
    //    event.preventDefault();
    //  });
    //  $('#ULDSerialNo').bind('paste', function (e) {
    //   e.preventDefault(); //disable cut,copy,paste
    //  });
    // $('#TotalNoOfULD').bind('paste', function (e) {
    //   e.preventDefault(); //disable cut,copy,paste
    // });

    // Add By : Sushant Kumar Nayak ON 09-10-2017

    //$("#ULDSerialNo").change(function (e) {
    //    //if the letter is not digit then display error and don't type anything

    //    var BlkAccountIdV = $('#ULDSerialNo').val();
    //    alert(BlkAccountIdV)
    //    var re = /[a-zA-Z]/;
    //    if (re.test(BlkAccountIdV)) {
    //        errorflag = 1;
    //    } else {
    //        ShowMessage('warning', 'Need your Kind Attention!', "ULD Serial No must have numeric!");
    //        return false;
    //    }

    //});

    //$('#ULDSerialNo').on('change', function (e) {
    //    var BlkAccountIdV = $('#ULDSerialNo').val();
    //    var re = /[^0-9]/g;    
    //    if (re.test(BlkAccountIdV) ){  
    //        errorflag=1;
    //    }else {
    //        ShowMessage('warning', 'Need your Kind Attention!', "ULD Serial No must have numeric!");
    //        return false;
    //    }

    //});



    $("input[name='operation']").click(function () {
        var operation = $("input[name='operation']").val();
        if (operation.trim() == "Update".trim()) {
            var UDlSno = $("#ULDNo").val();
            var ret = getavailableData(UDlSno)
            if (ret == "NO") {
                ShowMessage('warning', 'Need your Kind Attention!', "CART Stock not available !!!");
                return false;
            }
        }
        var v = $('#ULDSerialNo').val();
        var T = $('#TotalNoOfULD').val();
        if (v == '0' || v == '00' || v == '000' || v == '0000' || v == '00000') {
            ShowMessage('warning', 'Need your Kind Attention!', "CART Serial No should be greater than 0 !!!");
            return false;
        }
        else if (T == '0') {
            //ShowMessage('warning', 'Need your Kind Attention!', "Total No. Of ULD should be greater than 0 !!!");
        }
        else
            return true;
    });

    $('#TotalNoOfULD').blur(function () {
        if ($('#TotalNoOfULD').val() > 1000) {
            ShowMessage('info', 'Need your Kind Attention!', " Total No. Of CART should not be greater than 1000.");
            $('#TotalNoOfULD').val('');
            $('#_tempTotalNoOfULD').val('');
        }
    });
    $('#TotalNoOfULD').after('<label>&nbsp;&nbsp;&nbsp;(Max 1000)</lable>');
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        $("#_tempEmptyWeight").before("<span id='lblKG'  style='display: inline-block;overflow: auto;'>(kg)&nbsp;&nbsp;</span>");
    }
    else {
        $("#EmptyWeight").before("<span id='lblKG'  style='display: inline-block;overflow: auto;'>(kg)&nbsp;&nbsp;</span>");
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
    }

    cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,AirlineName", "ULD_ULDSTOCK_AirlineName", onselect, "contains");
    cfi.AutoCompleteV2("ULDTypeSNo", "SNo,Text_ULD", "ULDSTOCK_ULDTYPE", onselectULD, "contains");
    cfi.AutoCompleteV2("PurchaseAt", "CityCode,CityName", "ULDSTOCK_CityCode", null, "contains");
    cfi.AutoCompleteV2("CityCode", "CityCode,CityName", "ULDSTOCK_CityCode_D", CityCodeChange, "contains");
    cfi.AutoCompleteV2("AirportSNo", "AirportCode,AirportName", "ULDSTOCK_Airport", null, "contains");
    cfi.AutoCompleteV2("SHCSNo", "SNo,Code", "ULDSTOCK_SHC", onULDSHCselect, "contains", ",")
    cfi.BindMultiValue("SHCSNo", $("#Text_SHCSNo").val(), $("#SHCSNo").val());
    cfi.AutoCompleteV2("SHCGroupSNo", "SNo,Name", "ULDSTOCK_SPHCGROUP", onUldSHCGroupselect, "contains")
    var caontettype = [{ Key: "1", Text: "Cargo" }, { Key: "2", Text: "Baggage" }];
    cfi.AutoCompleteByDataSource("ContentType", caontettype, onselectBaggage);
    cfi.AutoCompleteV2("ContentCategory", "SNo,BaggageType", "ULDSTOCK_BAGGAGETYPE", null, "contains")
    var Ownership = "";
    var GAULD = "";
    var ULDALL = "";
    var ULDOWN = "";
    GAULD = userContext.SpecialRights.GAULD;
    ULDOWN = userContext.SpecialRights.ULDOWN;
    Rights = userContext.SpecialRights.ULDAVL;


    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        var Text_PurchaseAt = userContext.CityCode.toUpperCase() + '-' + userContext.CityName.toUpperCase()
        $('#PurchaseAt').val(userContext.CitySNo);
        $('#Text_PurchaseAt').val(Text_PurchaseAt);

    }
    if (ULDOWN == true) {
        Ownership = [{ Key: "0", Text: "AIRLINE" }, { Key: "1", Text: "HIRED" }];

    } else {
        Ownership = [{ Key: "1", Text: "HIRED" }];

    }


    if (GAULD == true) {
        $("#AirlineSNo").val(userContext.AirlineSNo);
        $("#Text_AirlineSNo").val(userContext.AirlineCarrierCode);
        var AirlineCarrierCode = userContext.AirlineCarrierCode
        var AiCarrierCode = AirlineCarrierCode.split("-")[0]
        $("#OwnerCode").val(AiCarrierCode)

        $("#Fileupload").attr("disabled", false)
        $("#Preview").attr("disabled", false)
    } else {
        $("#Fileupload").attr("disabled", true)
        $("#Preview").attr("disabled", true)

    }

    cfi.AutoCompleteByDataSource("OwnershipSNo", Ownership, onchange);
    if ($('#ULDSerialNo').val() == "") {
        $('#PurchaseDate').val('');
        $('#Text_CityCode').val(userContext.CityCode);
        $('#CityCode').val(userContext.CityCode);
        $('#AirportSNo').val(userContext.AirportSNo);
        $('#Text_AirportSNo').val(userContext.AirportCode + '-' + userContext.AirportName);
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $('[name="IsDamaged"][value="0"]').removeAttr('checked')
        $('[name="IsDamaged"][value="1"]').attr('checked', true)
        $('[name="Scrape"][value="0"]').removeAttr('checked')
        $('[name="Scrape"][value="1"]').attr('checked', true)

        $("input[id^='IsServiceable'][data-radioval='Yes']").attr('checked', true)
        $("input[id^='IsActive'][data-radioval='Yes']").attr('checked', true)
        $("input[id^='IsDamaged'][data-radioval='No']").attr('checked', true)
        $("input[id^='Scrape'][data-radioval='No']").attr('checked', true)

        $("input:radio[name='IsServiceable']").attr("disabled", "disabled");
        $("input:radio[name='IsDamaged']").attr("disabled", "disabled");
        $("input:radio[name='Scrape']").attr("disabled", "disabled");
        $("input:radio[name='IsAvailable']").attr("disabled", "disabled");



    }


    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" && $('#IsAvailable').val() == "NO") {
        $('[name="IsServiceable"][value="1"]').prop("disabled", true);
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        //$('#ContentType').val('1')
        //$('#Text_ContentType').val('Cargo')
        $("#Text_ContentCategory").data("kendoAutoComplete").enable(false);
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        var SHCGroupSNo = $("#SHCGroupSNo").val();
        var SHCSNo = $("#SHCSNo").val();

        if (SHCSNo != "") {
            $("#Text_SHCGroupSNo").data("kendoAutoComplete").enable(false);
        }
        else {
            $("#Text_SHCGroupSNo").data("kendoAutoComplete").enable(true);
        }
        if (SHCGroupSNo != "") {
            $("#Text_SHCSNo").data("kendoAutoComplete").enable(false);
        }
        else {
            $("#Text_SHCSNo").data("kendoAutoComplete").enable(true);
        }
        if (ContentType == "2") {
            //Added By Shivali Thakur
            $("#Text_SHCGroupSNo").data("kendoAutoComplete").enable(false);
            $("#Text_SHCSNo").data("kendoAutoComplete").enable(false);
            $("#Text_ContentCategory").data("kendoAutoComplete").enable(true);
        }
        else {
            $("#Text_SHCGroupSNo").data("kendoAutoComplete").enable(true);
            $("#Text_ContentCategory").data("kendoAutoComplete").enable(false);
            $("#Text_SHCSNo").data("kendoAutoComplete").enable(true);
        }
    }
    function onselectBaggage() {
        if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
            var ContentType = $("#ContentType").val();
            if (ContentType == "2") {
                $("#Text_ContentCategory").data("kendoAutoComplete").enable(true);
                $("#Text_SHCSNo").data("kendoAutoComplete").enable(false);
                cfi.AutoCompleteV2("ContentCategory", "SNo,BaggageType", "ULDSTOCK_CONTENTCATEGORY", null, "contains")
            }
            else {
                $("#Text_ContentCategory").data("kendoAutoComplete").enable(false);
                $("#Text_SHCSNo").data("kendoAutoComplete").enable(true);
                $("#Text_ContentCategory").val('');
            }
        }
    }
    $("#ULDSerialNo").keypress(function (e) {
        var iKeyCode = (e.which) ? e.which : e.keyCode
        //if (iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
        //    return false;

        if (((iKeyCode <= 96 && iKeyCode >= 105) || (iKeyCode >= 48 && iKeyCode <= 57)))
            return true;
        else if (iKeyCode == 16 || iKeyCode == 17 || iKeyCode == 18) {
            return false;
        }
        else
            return false;
    });
    $("input[name='Preview']").click(function (e) {
        $("input[name='Preview']").attr("disabled", true);
        var fileSelect = document.getElementById("Fileupload");
        var files = fileSelect.files;
        var validExts = new Array("xlsx", "xls");
        var ext = '';
        var fileName = '';
        var UserSNo = userContext.UserSNo;
        var data = new FormData();
        for (var i = 0; i < files.length; i++) {
            fileName = files[i].name;
            ext = fileName.split('.').pop();
            if ($.inArray(ext, validExts) == -1) { // || fileName.substring(0, (fileName.length - (('.') + fileName.split('.').pop()).length)) != "ULD Stock") 
                ShowMessage('warning', 'Upload File!', 'Invalid File Selection');
                $("input[name='Preview']").removeAttr("disabled");
                return false;
            }
            else {
                data.append(files[i].name, files[i]);
            }
        }
        if (fileName == '' || fileName == undefined) {
            ShowMessage('warning', 'Upload File!', 'Choose File To Upload.');
            $("input[name='Preview']").removeAttr("disabled");
            return false;
        }
        var tableString;
        var flag = true;
        $.ajax({
            url: "Handler/SSIMUpload.ashx?ULD=ULD&UserSNo=" + UserSNo,
            type: "POST",
            data: data,
            contentType: false,
            processData: false,
            success: function (result) {
                ExcelResult = result;
                if (result.items[0].Error == undefined) {
                    if (result.items.length > 0) {
                        $("#divWindow").remove();
                        $("#tbl").after('<div id="divWindow" style="overflow:auto;"><input type="button" class="button" id="Excel" value="Download Excel" onclick="DownloadExcel(ExcelResult);"><br/><br/><table id="tblResult" class="WebFormTable"></table></div>');
                        $("#tblResult").append('<tr><th class="formlabel" style="width:1.5%; text-align:center;">Row No.</th><th class="formlabel" style="text-align:center;">Message</th></tr>');
                        for (var i = 0; i < result.items.length; i++) {
                            if (result.items[i].ValidationMessage == 'CART STOCK ADDED SUCCESSFULLY.' || result.items[i].ValidationMessage == 'VALID') {
                                $("#tblResult").append('<tr><td class="formInputcolumn" style="width:1.5%;text-align:center;">' + result.items[i].SNo + '</td><td class="formInputcolumn" style="text-align:left; color:green;">' + result.items[i].ValidationMessage + '</td></tr>');
                            }
                            else {
                                $("#tblResult").append('<tr><td class="formInputcolumn" style="width:1.5%;text-align:center;">' + result.items[i].SNo + '</td><td class="formInputcolumn" style="text-align:left;color:red;">' + result.items[i].ValidationMessage + '</td></tr>');
                            }
                        }
                        cfi.PopUp(("divWindow"), "Result", 900, null, null, null);
                        $("#divWindow").closest(".k-window").css({
                            position: 'fixed',
                            top: '5%'
                        });
                        $("input[name='Preview']").removeAttr("disabled");
                    }
                }
                else if (result.items[0].Error != undefined && result.items[0].Error == '') {
                    ShowMessage('info', 'CART Stock-Excel Upload', "File is not valid.");
                    $("input[name='Preview']").removeAttr("disabled");
                }
                else {
                    ShowMessage('warning', 'CART Stock-Excel Upload', '' + result.items[0].Error);
                    $("input[name='Preview']").removeAttr("disabled");
                }
            },
            error: function (err) {
                ShowMessage('warning', 'File Upload!', "Unable to upload selected file. Please try again.", "bottom-right");
                $("input[name='Preview']").removeAttr("disabled");
            }
        });
    });
    var dirtyForm = { isDirty: false };
    dirtyForm.checkDirtyForm = function () {
    };
    $("#ULDExcelDownload").unbind("click").bind("click", function () {
        DownloadExcelSample();
    });
    $("#Fileupload").after('<a href="UploadDoc/ULDStock/ULDStock.xls">Download Format Sample</a>')

    function onselect() {

        var AirlineCarrierCode = $("#Text_AirlineSNo").val()
        if (AirlineCarrierCode.trim().toUpperCase() == "GA-GARUDA AIRLINE".trim().toUpperCase()) {
            var AiCarrierCode = AirlineCarrierCode.split("-")[0]
            $("#OwnerCode").val(AiCarrierCode)
        }

    }
});


$(document).on('click', '#IsServiceable', function () {
    //ShowMessage('warning', 'Warning - CART Stock', "Don't have permission to update ", "bottom-right");
    return false;

    //RadioButtonSelectShow();
});
$(document).on('click', '#IsAvailable', function () {
    if (Rights == true) {

        if ($("input[name='IsAvailable']:checked").val() == 0) {
            $("input[id^='IsServiceable'][data-radioval='Yes']").prop('checked', true)
            $("input[id^='IsActive'][data-radioval='Yes']").prop('checked', true)
            $("input[id^='IsDamaged'][data-radioval='No']").prop('checked', true)
            $("input[id^='Scrape'][data-radioval='No']").prop('checked', true)

        } else if ($("input[name='IsAvailable']:checked").val() == 1) {
            $("input[id^='IsServiceable'][data-radioval='Yes']").prop('checked', true)
            $("input[id^='IsActive'][data-radioval='Yes']").prop('checked', true)
            //$("input[id^='IsDamaged'][data-radioval='Yes']").prop('checked', true)
        }

    } else {
        ShowMessage('warning', 'Warning - CART Stock', "Don't have permission to update ", "bottom-right");
        return false;

    }

});

$(document).on('change', '#PurchasedPrice', function () {
    if (parseFloat($("#PurchasedPrice").val()).toFixed(2) == "0.00") {
        $("#PurchasedPrice").val("")
    }
});

function RadioButtonSelectShow() {
    if ($("input[name='IsServiceable']:checked").val() == 0) {
        /*---------------------Changes By Pankaj Kumar Ishwar-------------------*/
        //$("input[id^='IsAvailable'][data-radioval='Yes']").prop('checked', true)
        $("input[id^='Scrape'][data-radioval='No']").prop('checked', true)
        $("input[id^='IsDamaged'][data-radioval='No']").prop('checked', true)
    }
    else if ($("input[name='IsServiceable']:checked").val() == 1) {
        $("input[id^='IsAvailable'][data-radioval='No']").prop('checked', true)
        $("input[id^='IsActive'][data-radioval='No']").prop('checked', true)
        $("input[id^='IsDamaged'][data-radioval='Yes']").prop('checked', true)
    }
}
$(document).on('click', '#IsDamaged', function () {
    ShowMessage('warning', 'Warning - CART Stock', "Please use CART inventory page to mark CART as damage.", "bottom-right");
    return false;

    //if (($("input[name='IsDamaged']:checked").val() == 0)) {
    //    $("input[id^='IsAvailable'][data-radioval='No']").prop('checked', true)
    //    $("input[id^='IsServiceable'][data-radioval='No']").prop('checked', true)
    //    $("input[id^='IsActive'][data-radioval='Yes']").prop('checked', true)
    //}
    //else if (($("input[name='IsDamaged']:checked").val() == 1) && ($("input[name='Scrape']:checked").val() == 1)) {
    //    $("input[id^='IsAvailable'][data-radioval='Yes']").prop('checked', true)
    //    $("input[id^='IsServiceable'][data-radioval='Yes']").prop('checked', true)
    //    $("input[id^='IsActive'][data-radioval='No']").prop('checked', true)
    //}
});
$(document).on('click', '#Scrape', function () {
    if (Rights == true) {
        RadioButtonShow();
    } else {
        ShowMessage('warning', 'Warning - CART Stock', "Don't have permission to update ", "bottom-right");
        return false;
    }

});
function RadioButtonShow() {


    if (($("input[name='Scrape']:checked").val() == 0)) {
        $("input[id^='IsAvailable'][data-radioval='No']").prop('checked', true)
        $("input[id^='IsServiceable'][data-radioval='No']").prop('checked', true)
        $("input[id^='IsActive'][data-radioval='No']").prop('checked', true)
        $("input[id^='IsDamaged'][data-radioval='Yes']").prop('checked', true)
        // $('[name="IsActive"]').prop("disabled", false);
    }
    else if ($("input[name='Scrape']:checked").val() == 1) {
        $("input[id^='IsAvailable'][data-radioval='Yes']").prop('checked', true)
        $("input[id^='IsServiceable'][data-radioval='Yes']").prop('checked', true)
        $("input[id^='IsActive'][data-radioval='Yes']").prop('checked', true)
        $("input[id^='IsDamaged'][data-radioval='No']").prop('checked', true)
        //$('[name="IsServiceable"]').prop("disabled", true);
        // $('[name="IsActive"]').prop("disabled", true);
    }
}
function DownloadExcel(result) {

    var fileSelect = document.getElementById("Fileupload");
    var files = fileSelect.files;
    var fileName = "";
    var data = new FormData();
    for (var i = 0; i < files.length; i++) {
        fileName = files[i].name;
        data.append(files[i].name, files[i]);
    }
    var tableStr = "";
    tableStr += "<html><body><table border='1px'><thead><tr style='background-color:cyan'><th>Airline Code</th><th>City Code</th><th>Airport Code</th><th>CART Code</th><th>CART SerialNo</th><th>Ownership</th><th>Owner Code</th><th>Purchase Date</th><th>Purchase From</th><th>Purchase At</th><th>TareWeight</th><th>SHC</th><th>SHCGroup</th><th>Purchased Price</th><th style='width:1000px'>Validation Message</th></tr></thead><tbody>";
    $(result.items).each(function (index, value) {
        tableStr += "<tr align='center' id='" + "tr" + value.SNo + "'><td>" + value.AirlineCode + "</td><td>" + value.CityCode + "</td><td>" + value.AirportCode + "</td><td>" + value.ULDCode + "</td><td>" + value.ULDSerialNo + "</td><td>" + value.Ownership + "</td><td>" + value.OwnerCode + "</td><td>" + value.PurchaseDate + "</td><td>" + value.PurchaseFrom + "</td><td>" + value.PurchaseAt + "</td><td>" + (value.TareWeight || '') + "</td><td>" + value.SHC + "</td><td>" + value.SHCGroup + "</td><td>" + value.PurchasedPrice + "</td><td style='text-align:left;'>" + value.ValidationMessage + "</td></tr>";
    });
    tableStr += "</tbody></table></body></html>";
    var data_type = 'data:application/vnd.ms-excel';
    //var postfix = $("lblWarehouseName").text();
    var a = document.createElement('a');
    a.href = data_type + ', ' + encodeURIComponent(tableStr);
    a.download = fileName.substring(0, (fileName.length - (('.') + fileName.split('.').pop()).length)) + '.xls';
    a.click();
}
function ExtraCondition(textId) {
    var filter = cfi.getFilter("AND");
    if (textId == "Text_ULDTypeSNo") {
        cfi.setFilter(filter, "AirlineSNo", "neq", 0);
        cfi.setFilter(filter, "AirlineSNo", "eq", $("#Text_AirlineSNo").data("kendoAutoComplete").key())
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filter);
        return RegionAutoCompleteFilter;
    }

    if (textId == "Text_AirportSNo") {
        cfi.setFilter(filter, "CityCode", "neq", 0);
        cfi.setFilter(filter, "CityCode", "eq", $("#Text_CityCode").data("kendoAutoComplete").key())
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filter);
        return RegionAutoCompleteFilter;
    }

    if (textId == "Text_AirlineSNo") {
        if (userContext.SpecialRights.GAULD != true) {
            cfi.setFilter(filter, "CarrierCode", "neq", "GA");
            var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filter);
            return RegionAutoCompleteFilter;
        }


    }
}
function onselect(e) {
    $('#Text_ULDTypeSNo').val('');
}
function onULDSHCselect(e) {
    $("#Text_SHCGroupSNo").data("kendoAutoComplete").enable(false);
}
function onUldSHCGroupselect(e) {
    $("#Text_SHCSNo").data("kendoAutoComplete").enable(false);
    if ($("#Text_SHCGroupSNo").val() == '') {
        $("#Text_SHCSNo").data("kendoAutoComplete").enable(true);
    }
}
function AutoCompleteDeleteCallBack(e, div, textboxid) {
    var target = e.target; // get current Span.
    var DivId = div; // get div id.
    var textboxid = textboxid; // get textbox id.
    var mid = textboxid.replace('Text', 'Multi');
    var arr = $("#" + mid).val().split(',');
    var idx = arr.indexOf($(this)[0].id);
    arr.splice(idx, $(e.target).attr("id"));
    $("#" + mid).val(arr);
    $("#" + textboxid.replace('Text_', '')).val(arr);
    if (textboxid == "Text_SHCSNo") {
        if (arr.length == 0) {
            $("#Text_SHCGroupSNo").data("kendoAutoComplete").enable(true);
        }
    }
}
function onchange() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        if ($("#OwnershipSNo").val() == "0") {
            $("td[title='Select Purchased At'] font").html("");
            $("td[title='Select Purchased Date'] font").html("");
            $("td[title='Enter Purchased From'] font").html("");
            $('#PurchaseDate').closest('span').css('border-color', '');
            $("#PurchaseDate").attr('data-valid', '');
            $('#Text_PurchaseAt').closest('span').css('border-color', '');
            $("#Text_PurchaseAt").attr('data-valid', '');
            $('#PurchaseFrom').css('border-color', '#94c0d2');
            $("#PurchaseFrom").attr('data-valid', '');
            $("td[title='Select Purchased At'] font").html("*");
            $("td[title='Select Purchased Date'] font").html("*");
            $("td[title='Enter Purchased From'] font").html("*");
            $("#PurchaseDate").attr('data-valid', 'required');
            $("#Text_PurchaseAt").attr('data-valid', 'required');
            $("#PurchaseFrom").attr('data-valid', 'required');
            $('#PurchaseFrom').css('border-color', '');
            $("#spnPurchaseDate").html('Purchased Date')
            $("#spnPurchaseAt").html('Purchased At')
            $("#spnPurchaseFrom").html(' Purchased from')
        } else if ($("#OwnershipSNo").val() == "1") {
            $("td[title='Select Purchased At'] font").html("*");
            $("td[title='Select Purchased Date'] font").html("*");
            $("td[title='Enter Purchased From'] font").html("*");
            $("#PurchaseDate").attr('data-valid', 'required');
            $("#Text_PurchaseAt").attr('data-valid', 'required');
            $("#PurchaseFrom").attr('data-valid', 'required');
            $('#PurchaseFrom').css('border-color', '');
            $("#spnPurchaseDate").html('Hired Date')
            $("#spnPurchaseAt").html('Hired At')
            $("#spnPurchaseFrom").html('Hired from')
        }
    }
}
function onselectULD() {
    var ULDSNo = $("#ULDTypeSNo").val();
    if (ULDSNo.length > 0) {
        $.ajax({
            url: "./Services/ULD/ULDStockService.svc/GetTareWeight", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ ULDSNo: ULDSNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result != "") {
                    $("#_tempEmptyWeight").val(result);
                    $("#EmptyWeight").val(result);
                }
            }
        });
    }
}
function SetULDSerialNo(e) {
    var Data = "";
    var intRegex = /^\d+$/;
    var ULDTypeSNo;
    var AirlineCode;
    var type = $(e.sender.element).attr("id")
    if (type == "Text_ULDTypeSNo") {
        ULDTypeSNo = (this.dataItem(e.item.index())).Key;
        AirlineCode = $("#AirlineSNo").val();
    }
    else {
        AirlineCode = (this.dataItem(e.item.index())).Key;
        ULDTypeSNo = $("#ULDTypeSNo").val();
    }
    if (ULDTypeSNo != "0" && ULDTypeSNo != "" && AirlineCode != "0" && AirlineCode != "") {
        $.ajax({
            type: "POST",
            url: "./Services/ULD/ULDStockService.svc/GetMaxULDSerial?ULDTypeSNo=" + ULDTypeSNo + "&AirlineCode=" + AirlineCode,
            data: { id: 1 },
            dataType: "json",
            success: function (response) {
                var SNo = response.Data[0];
                $("#ULDSerialNo").val(SNo);
                //$("#_tempStartRange").val(SNo);
                //$("#_tempAWBNumber").val(SNo);
                //$("#EndRange").val("");
                //$("#_tempEndRange").val("");
                //$("#NOOFAWB").val("");
                //$("#_tempNOOFAWB").val("");

            }
        });
    }
}
function CityCodeChange() {
    try {
        $.ajax({
            type: "GET",
            url: "./Services/ULD/ULDStockService.svc/GetAirportuldInformation",
            async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ Code: $("#CityCode").val() }),
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                var ResultData = jQuery.parseJSON(response);
                var FinalData = ResultData.Table0;
                if (FinalData.length > 0) {
                    $('#AirportSNo').val(FinalData[0].SNo);
                    $('#Text_AirportSNo').val(FinalData[0].AirportName);
                }
            }
        });
    }
    catch (exp) {
    }
}
function GetULDStockSpecialRights() {
    try {
        $.ajax({
            url: "./Services/ULD/ULDStockService.svc/GetULDStockSpecialRights", async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                if (resData[0].Column1 == "1") {
                    // $('[name="IsAvailable"]').prop("disabled", false);
                }
                else {
                    // $('[name="IsAvailable"]').prop("disabled", true);
                }
            }
        });
    }
    catch (exp) {
    }
}
// Shivali 
function getavailableData(UDlSno) {
    var myData = "";
    $.ajax({
        url: "/Services/ULD/ULDStockService.svc/getavailableData?UDlSno=" + UDlSno, async: false, type: "get", dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            myData = jQuery.parseJSON(result).Table0[0].Available;
        }
    });
    return myData
}
