var ExcelResult = '';
$(document).ready(function () {




    $("#ULDSerialNo").css('text-align', 'right');
    $("#OwnerCode").blur(function () {
        if ($("#OwnerCode").val().length < 2) {
            ShowMessage('warning', 'Need your Kind Attention!', "Owner Code must have minimum 2 characters.");
            $("#OwnerCode").val('');
        }
    });
    //$('#PurchaseDate').attr('readonly', 'true');
    $('#ULDSerialNo').focusout(function () {
        if ($('#ULDSerialNo').val().length >= 4 || $('#ULDSerialNo').val() == '')
            return true;
        else {
            ShowMessage('warning', 'Need your Kind Attention!', "ULD Serial No must have minimum 4 characters.");
            $('#ULDSerialNo').val('');
        }
    });
    $(document).on("contextmenu", function (e) {
        return false;
    });
    $(document).on('drop', function () {
        return false;
    });

    $('#ULDSerialNo').on('drop', function (event) {
        event.preventDefault();
    });
    $('#TotalNoOfULD').on('drop', function (event) {
        event.preventDefault();
    });

    $('#ULDSerialNo').bind('paste', function (e) {
        e.preventDefault(); //disable cut,copy,paste
    });
    $('#TotalNoOfULD').bind('paste', function (e) {
        e.preventDefault(); //disable cut,copy,paste
    });
    $("input[name='operation']").click(function () {
        var v = $('#ULDSerialNo').val();
        var T = $('#TotalNoOfULD').val();
        if (v == '0' || v == '00' || v == '000' || v == '0000' || v == '00000') {
            ShowMessage('warning', 'Need your Kind Attention!', "ULD Serial No should be greater than 0 !!!");
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
            ShowMessage('info', 'Need your Kind Attention!', " Total No. Of ULD should not be greater than 1000.");
            $('#TotalNoOfULD').val('');
            $('#_tempTotalNoOfULD').val('');
        }
    });
    $('#TotalNoOfULD').after('<label>&nbsp;&nbsp;&nbsp;(Max 1000)</lable>');
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        GetULDStockSpecialRights();
    }
    //if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
    //    GetULDStockSpecialRights();
    //}
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        $("#_tempEmptyWeight").before("<span id='lblKG'  style='display: inline-block;overflow: auto;'>(kg)&nbsp;&nbsp;</span>");
    }
    else {
        $("#EmptyWeight").before("<span id='lblKG'  style='display: inline-block;overflow: auto;'>(kg)&nbsp;&nbsp;</span>");
    }

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        //airline
        cfi.AutoComplete("AirlineSNo", "CarrierCode,AirlineName", "vwAirline", "SNo", "AirlineCode", ["CarrierCode", "AirlineName"], onselect, "contains");
        // cfi.AutoComplete("AirlineSNo", "AirlineCode,AirlineName", "Airline", "AirlineCode", "AirlineName", null, null, "contains", null, null, null, null, SetULDSerialNo);
        cfi.AutoComplete("ULDTypeSNo", "Text_ULD", "vwULD", "SNo", "Text_ULD", ["Text_ULD"], onselectULD, "contains");
        // cfi.AutoComplete("ULDTypeSNo", "ULDName", "vwULD", "SNo", "ULDName", null, null, "contains", null, null, null, null, SetULDSerialNo);
        cfi.AutoComplete("PurchaseAt", "CityCode,CityName", "vCity", "SNo", "CityCode", ["CityCode", "CityName"], null, "contains");
        cfi.AutoComplete("CityCode", "CityCode,CityName", "vCity", "CityCode", "CityCode", ["CityCode", "CityName"], CityCodeChange, "contains");
        cfi.AutoComplete("AirportSNo", "AirportCode,AirportName", "vAirport", "SNo", "AirportCode", ["AirportCode", "AirportName"], null, "contains");
        var Ownership = [{ Key: "0", Text: "AIRLINE" }, { Key: "1", Text: "HIRED" }];
        cfi.AutoCompleteByDataSource("OwnershipSNo", Ownership, onchange);
        if ($('#ULDSerialNo').val() == "") {
            $('#PurchaseDate').val('');
            $('#Text_CityCode').val(userContext.CityCode);
            $('#CityCode').val(userContext.CityCode);
            $('#AirportSNo').val(userContext.AirportSNo);
            $('#Text_AirportSNo').val(userContext.AirportCode + '-' + userContext.AirportName);
        }
        $('[name="IsDamaged"][value="0"]').removeAttr('checked')
        $('[name="IsDamaged"][value="1"]').attr('checked', true)
        $('[name="Scrape"][value="0"]').removeAttr('checked')
        $('[name="Scrape"][value="1"]').attr('checked', true)
        $('[name="IsDamaged"]').prop("disabled", true);
        $('[name="IsServiceable"]').prop("disabled", true);

    }
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" && $('#IsAvailable').val() == "NO") {
        $('[name="IsServiceable"][value="1"]').prop("disabled", true);
    }


    //if ($("input[name='IsServiceable']:checked").val() == 0) {
    //    $('[name="IsDamaged"]').prop("disabled", true);
    //    $('[name="Scrape"]').prop("disabled", true);    
    //}
    //if ($("input[name='IsServiceable']:checked").val() ==1) {
    //    $('[name="IsDamaged"]').prop("disabled", false);
    //    $('[name="Scrape"]').prop("disabled", false);
    //}





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
                            if (result.items[i].ValidationMessage == 'ULD STOCK ADDED SUCCESSFULLY.' || result.items[i].ValidationMessage == 'VALID') {
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
                    ShowMessage('info', 'ULD Stock-Excel Upload', "File is not valid.");
                    $("input[name='Preview']").removeAttr("disabled");
                }
                else {
                    ShowMessage('warning', 'ULD Stock-Excel Upload', '' + result.items[0].Error);
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

});


//function DownloadExcelSample() {
//    var path =''; 
//    if (location.hostname == "localhost")
//        path = "";
//    else
//        path = "http://" + location.hostname + "/" + window.location.pathname.replace(/^\/([^\/]*).*$/, '$1');

//    //if (location.hostname == "localhost")
//    //    path = "";
//    //else
//    //    path = window.location.href.split('/Default')[0].split('//')[1];

//    Excelpath = path;
//     Excelpath = Excelpath.replace(/,/g, "\\");     
//    FileName = "ULDStock.xls";
//    window.location.href = "Handler/SSIMUpload.ashx?Excelpath=" + Excelpath + "&FileName=" + FileName;

//}


$(document).on('click', '#IsServiceable', function () {
    RadioButtonSelectShow();
});

$(document).on('click', '#IsAvailable', function () {
    RadioButtonSelectShow();
});
function RadioButtonSelectShow() {


    if ($("input[name='IsServiceable']:checked").val() == 0) {
        $("input[id^='IsAvailable'][data-radioval='Yes']").prop('checked', true)
        //$('[name="IsDamaged"]').prop("disabled", true);
        //$('[name="Scrape"]').prop("disabled", true);
        $("input[id^='Scrape'][data-radioval='No']").prop('checked', true)
        $("input[id^='IsDamaged'][data-radioval='No']").prop('checked', true)
    }
    else if ($("input[name='IsServiceable']:checked").val() == 1) {

        $("input[id^='IsAvailable'][data-radioval='No']").prop('checked', true)
        $("input[id^='IsActive'][data-radioval='No']").prop('checked', true)
        $("input[id^='IsDamaged'][data-radioval='Yes']").prop('checked', true)
        //$('[name="IsDamaged"]').prop("disabled", false);
        //$('[name="Scrape"]').prop("disabled", false);
    }

}







$(document).on('click', '#IsDamaged', function () {
    if (($("input[name='IsDamaged']:checked").val() == 0)) {
        $("input[id^='IsAvailable'][data-radioval='No']").prop('checked', true)
        $("input[id^='IsServiceable'][data-radioval='No']").prop('checked', true)
        $("input[id^='IsActive'][data-radioval='Yes']").prop('checked', true)
        //    $('[name="IsServiceable"]').prop("disabled", true);
        //    $('[name="IsActive"]').prop("disabled", true);
    }
    else if (($("input[name='IsDamaged']:checked").val() == 1) && ($("input[name='Scrape']:checked").val() == 1)) {
        $("input[id^='IsAvailable'][data-radioval='Yes']").prop('checked', true)
        $("input[id^='IsServiceable'][data-radioval='Yes']").prop('checked', true)
        $("input[id^='IsActive'][data-radioval='No']").prop('checked', true)
        //$('[name="IsServiceable"]').prop("disabled", false);
        //$('[name="IsActive"]').prop("disabled", false);  
    }
});


$(document).on('click', '#Scrape', function () {
    RadioButtonShow();
});
function RadioButtonShow() {
    if (($("input[name='Scrape']:checked").val() == 1) && ($("input[name='IsDamaged']:checked").val() == 1)) {
        $("input[id^='IsAvailable'][data-radioval='Yes']").prop('checked', true)
        $("input[id^='IsServiceable'][data-radioval='Yes']").prop('checked', true)
        $("input[id^='IsActive'][data-radioval='Yes']").prop('checked', true)
        //$('[name="IsServiceable"]').prop("disabled", false);
        //$('[name="IsActive"]').prop("disabled", false);
    }
    else if ($("input[name='Scrape']:checked").val() == 0) {
        $("input[id^='IsAvailable'][data-radioval='No']").prop('checked', true)
        $("input[id^='IsServiceable'][data-radioval='No']").prop('checked', true)
        $("input[id^='IsActive'][data-radioval='No']").prop('checked', true)
        //$('[name="IsServiceable"]').prop("disabled", true);
        //$('[name="IsActive"]').prop("disabled", true);
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
    tableStr += "<html><body><table border='1px'><thead><tr style='background-color:cyan'><th>Airline Code</th><th>City Code</th><th>Airport Code</th><th>ULD Code</th><th>ULD SerialNo</th><th>Ownership</th><th>Owner Code</th><th>Purchase Date</th><th>Purchase From</th><th>Purchase At</th><th>TareWeight</th><th style='width:1000px'>Validation Message</th></tr></thead><tbody>";
    $(result.items).each(function (index, value) {
        tableStr += "<tr align='center' id='" + "tr" + value.SNo + "'><td>" + value.AirlineCode + "</td><td>" + value.CityCode + "</td><td>" + value.AirportCode + "</td><td>" + value.ULDCode + "</td><td>" + value.ULDSerialNo + "</td><td>" + value.Ownership + "</td><td>" + value.OwnerCode + "</td><td>" + value.PurchaseDate + "</td><td>" + value.PurchaseFrom + "</td><td>" + value.PurchaseAt + "</td><td>" + (value.TareWeight || '') + "</td><td style='text-align:left;'>" + value.ValidationMessage + "</td></tr>";
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
}
function onselect(e) {
    $('#Text_ULDTypeSNo').val('');
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

        }
        else {

            $("td[title='Select Purchased At'] font").html("*");
            $("td[title='Select Purchased Date'] font").html("*");
            $("td[title='Enter Purchased From'] font").html("*");
            $("#PurchaseDate").attr('data-valid', 'required');
            $("#Text_PurchaseAt").attr('data-valid', 'required');
            $("#PurchaseFrom").attr('data-valid', 'required');
            $('#PurchaseFrom').css('border-color', '');
        }
    }
}
//function changeCity()
//{
//  $('#Text_AirportSNo').val('');
//}
function onselectULD() {
    var ULDSNo = $("#ULDTypeSNo").val();
    if (ULDSNo.length > 0) {
        $.ajax({
            url: "./Services/ULD/ULDStockService.svc/GetTareWeight", async: false, type: "POST", dataType: "json", cache: false,
            //data: JSON.stringify(dataDetails),
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
    catch (exp) { }

}


function GetULDStockSpecialRights() {

    try {
        $.ajax({
            url: "./Services/ULD/ULDStockService.svc/GetULDStockSpecialRights", async: false, type: "POST", dataType: "json", cache: false,
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
    catch (exp) { }
}
//function CheckCityCode(obj) {
//    var CityCode = $("#CityCode").val();
//    if (CityCode != "0" && CityCode != "" ) {
//        $.ajax({
//            type: "POST",
//            url: "./Services/ULD/ULDStockService.svc/CheckCityCode?CityCode=" + CityCode,
//            data: { id: 1 },
//            dataType: "json",
//            success: function (response) {
//                if (response.Data[0] == "0") {
//                    ShowMessage('info', 'Need your Kind Attention!', "City Code does not exist.");
//                    $("#CityCode").val("");
//                }
//            }
//        });
//    }
//}