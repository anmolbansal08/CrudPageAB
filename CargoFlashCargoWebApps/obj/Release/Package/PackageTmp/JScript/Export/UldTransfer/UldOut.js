/// <reference path="../../../Scripts/references.js" />

$(function () {
   
    $.ajax({
        url: 'HtmlFiles/Export/UldTransfer/UldOut.html',
        success: function (result) {
            $("body").html(result).append(footer);
            PageLoaded();

        }
    });

  

});
function PageLoaded() {
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "html",
        async: true,
        url: "./Services/Export/UldTransfer/UldOutService.svc/GetPageGrid",
        success: function (response) {
            $("#divMainGrid").html(response);
            // $(".k-grid").closest("table").find("tr:eq(1)").hide();

        }
    });

}
var EditSNo = 0;;
function GridReadAction(obj) {
    EditSNo = $(obj).attr("href").split('=')[1];
    $("#Text_IssuedBy").text('')
    $("#Text_TransferPoint").text('')
    $("#Text_Location").text('')
    $("#Text_Status").text('')
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "./Services/Export/UldTransfer/UldOutService.svc/EditData/" + EditSNo,
        success: function (r) {


            NewClick(EditSNo);
            //$("#Text_ULDNumber").attr("disabled", "disabled");
            //$("#Text_ULDNumber").next("span").remove()

            for (var key in r) {
                var $content = $('[id="' + key + '"]');
                if ($content.attr("type") == "checkbox") {
                    $content.attr("checked", r.Damaged);
                }
                if ($content) {
                    $content.val(r[key]);
                }

            }
            $('#Damaged').change(function () {
                if ($(this).is(":checked")) {
                    $('#Text_DamageCondition').attr("data-valid", "required");
                    $('#Text_DamageCondition').attr("data-valid-msg", "Enter Damage Description");
                    //$('#Text_ODLNCode').attr("data-valid", "required");
                    //$('#Text_ODLNCode').attr("data-valid-msg", "Select ODLN Code");
                    //$('#Text_DemurrageCode').attr("data-valid", "required");
                    //$('#Text_DemurrageCode').attr("data-valid-msg", "Select Demurrage Code");
                    //$("#ODLNCode").attr("enabled", true);
                    //$("#Text_ODLNCode").data("kendoAutoComplete").enable(true);
                    //$("#DemurrageCode").attr("enabled", true);
                    //$("#Text_DemurrageCode").data("kendoAutoComplete").enable(true);
                    $("#Text_DamageCondition").prop('disabled', false);
                }
                else {
                    $('#Text_DamageCondition').removeAttr("data-valid");
                    //$('#Text_ODLNCode').removeAttr("data-valid");
                    //$('#Text_DemurrageCode').removeAttr("data-valid");
                    $('#Text_DamageCondition').val('');
                    //$('#Text_ODLNCode').val('');
                    //$('#ODLNCode').val('');
                    //$('#Text_DemurrageCode').val('');
                    //$('#DemurrageCode').val('');
                    //$("#ODLNCode").attr("enabled", false);
                    //$("#Text_ODLNCode").data("kendoAutoComplete").enable(false);
                    //$("#DemurrageCode").attr("enabled", false);
                    //$("#Text_DemurrageCode").data("kendoAutoComplete").enable(false);
                    $("#Text_DamageCondition").prop('disabled', true);

                }
            });
            if (r.Damaged) {
                $('#Text_DamageCondition').attr("data-valid", "required");
                $('#Text_DamageCondition').attr("data-valid-msg", "Enter Damage Description");
                //$('#Text_ODLNCode').attr("data-valid", "required");
                //$('#Text_ODLNCode').attr("data-valid-msg", "Select ODLN Code");
                //$('#Text_DemurrageCode').attr("data-valid", "required");
                //$('#Text_DemurrageCode'NewClick).attr("data-valid-msg", "Select Demurrage Code");
            }
            else {
                //$("#ODLNCode").attr("enabled", false);
                //$("#Text_ODLNCode").data("kendoAutoComplete").enable(false);
                //$("#DemurrageCode").attr("enabled", false);
                //$("#Text_DemurrageCode").data("kendoAutoComplete").enable(false);
                $("#Text_DamageCondition").prop('disabled', true);
            }

            $(".tool-items").fadeOut();
            // ULDNumberOnSelect(null, $("#Text_ULDNumber").val(), null, $("#ULDNumber").val());
            cfi.BindMultiValue("ULDNumber", $("#Text_ULDNumber").val(), $("#ULDNumber").val());

            $("#Text_IssuedBy").text(r.Text_IssuedBy)
            $("#Text_TransferPoint").text(r.Text_TransferPoint)
            $("#Text_Location").text(r.CurrLocation)
            $("#Text_Status").text(r.IsAvailable)
          
        }
    });

}
function BindControls() {

    $("#Text_IssuedDate").kendoDatePicker();
    //$("#Text_IssuedTime").kendoTimePicker();
    cfi.AutoComplete("ULDNumber", "ULDNo,SNo", "vwULDStockULDTransferDropDown", "SNo", "ULDNo", ["ULDNo"], null, "contains", ",", "", "", "", ULDNumberOnSelect);
    //cfi.AutoComplete("ReceivedBy", "CityName,CityCode", "City", "SNo", "CityName", ["CityCode", "CityName"], ReceivedByOnSelect, "contains");
    // cfi.AutoComplete("StackUld", "ULDNo", "vwULDStockAuto", "ULDNo", "ULDNo", ["ULDNo"], BuildStack, "contains", ",", null, null, null, BuildStackRestriction, true);

    cfi.AutoComplete("ReceivedBy", "Name", "vwAccountAgentForwarderAirline", "SNo", "Name", ["Name"], null, "contains", null, null, null, null, ReceivedByOnSelect, true);
    cfi.AutoComplete("TransferBy", "Name", "vwAccountAgentForwarderAirline", "SNo", "Name", ["Name"], null, "contains", null, null, null, null, TransferByOnSelect, true);
    cfi.AutoComplete("DemurrageCode", "Code", "DamurrageCodes", "SNo", "Code", ["Code"], null, "contains");
    cfi.AutoComplete("ODLNCode", "Code,ODLNDesc", "ODLNCodes", "SNo", "Code", ["Code", "ODLNDesc"], null, "contains");
    cfi.AutoComplete("FinalDestination", "AirportCode,AirportName", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");
    var data = [{ Key: "2", Text: "Airline" }, { Key: "0", Text: "Forwarder" }, { Key: "1", Text: "Shipper" }, ];//,{ Key: "3", Text: "Agent" }
    cfi.AutoCompleteByDataSource("IssuedTo", data, Clear, null);
    //cfi.AutoCompleteByDataSource("IssuedBy", data);
    var dbtableName = "tblConsumables";

}
function OnSuccessGrid() {
    var TrHeader = $("div[id$='divMainGrid']").find("div[class^='k-grid-header'] thead tr");
    var IsMsgSentIndex = TrHeader.find("th[data-field='IsMsgSent']").index();
    var IsConsumables = TrHeader.find("th[data-field='IsConsumables']").index();

    $("div[id$='divMainGrid']").find("div[class^='k-grid-content'] tbody tr").each(function (row, tr) {
        if ($(tr).find("td:eq(" + IsMsgSentIndex + ")").text() == "1") {
            $(tr).find('input[type="button"][value="L"]').prop('disabled', true).prop('class', 'completeprocess');
        }
        else {
            $(tr).find('input[type="button"][value="L"]').prop('disabled', false);
        }
        if ($(tr).find("td:eq(" + IsConsumables + ")").text() == "1") {
            $(tr).find('input[type="button"][value="C"]').prop('class', 'completeprocess');
           // $(tr).find('input[type="button"][value="C"]').prop('disabled', true).prop('class', 'completeprocess');
        }
        else {
            $(tr).find('input[type="button"][value="C"]').prop('disabled', false);
        }
    });
}

function Clear() {
    cfi.ResetAutoComplete("ReceivedBy");
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
            alert('Please enter time in correct format');
            return false;
        }

    }
}
var data=""
function ExtraCondition(textId) {
    var f = cfi.getFilter("AND");

    //if (textId.indexOf("ReceivedBy") >= 0) {
    //    cfi.setFilter(f, "accounttypename", "eq", $('#IssuedTo').val() == "" ? "-1" : $('#IssuedTo').val());
    //}
    //if (textId.indexOf("TransferBy") >= 0) {
    //    cfi.setFilter(f, "accounttypename", "eq", '2');
    //}
    if (textId.indexOf("Text_ReceivedBy") >= 0) {
        var filterReceivedBy = cfi.getFilter("AND");
        cfi.setFilter(filterReceivedBy, "accounttypename", "eq", $('#IssuedTo').val() == "" ? "-1" : $('#IssuedTo').val());
        cfi.setFilter(filterReceivedBy, "SNo", "notin", $("#Text_TransferBy").data("kendoAutoComplete").key());
        f = cfi.autoCompleteFilter(filterReceivedBy);
        return f;
    }
    if (textId.indexOf("Text_TransferBy") >= 0) {
        var filterTransferBy = cfi.getFilter("AND");
        cfi.setFilter(filterTransferBy, "accounttypename", "eq", '2');
        cfi.setFilter(filterTransferBy, "SNo", "notin", $("#Text_ReceivedBy").data("kendoAutoComplete").key());
        f = cfi.autoCompleteFilter(filterTransferBy);
        return f;
    }

    //if (textId.indexOf("Text_ULDNumber") >= 0) {
    //    var SpuserContextAirlineName = userContext.AirlineName
    //    var last = SpuserContextAirlineName.split('-')
    //    alert(last[1])
    //    try {
    //        cfi.setFilter(filterEmbargo, "AirlineCode", "eq", last[1]);
    //        var ULDTypeAutoCompleteFilter = cfi.autoCompleteFilter([filterEmbargo]);
    //        return ULDTypeAutoCompleteFilter;
    //    }
    //    catch (exp) { }
    //}


    //if ("TransferBy" == textId)
    //    return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#Text_TransferBy").val()), filter = cfi.autoCompleteFilter(textId);
    //if ("ReceivedBy" == textId)
    //    return textId = cfi.getFilter("AND"), cfi.setFilter(textId, "SNo", "notin", $("#Text_TransferBy").val()), filter = cfi.autoCompleteFilter(textId);

    //if (textId.indexOf("ReceivedBy") >= 0 || textId.indexOf("TransferBy") >= 0) {
    //    cfi.setFilter(f, "SNo", "neq", $("#" + textId.replace("Text_ReceivedBy", "TransferBy").replace("Text_TransferBy", "ReceivedBy")).val());
    //}
    if (textId.indexOf("tblConsumables_Consumables") >= 0) {
        var row = textId.split("_");
        if ($("input:radio[name='tblConsumables_RbtnStock_" + row[2] + "']:checked").val() == "0") {
            cfi.setFilter(f, "AirlineSNo", "eq", $("#" + textId.replace('_Consumables_', '_TransferBy_')).val());
            cfi.setFilter(f, "CitySNo", "eq", userContext.CitySNo);
            //cfi.setFilter(f, "CitySNo", "eq", userContext.CitySNo);
            //var filtertblDimensionULDTab_ULDTypeSNo = cfi.getFilter("AND");
            //var len = (($("#tblConsumables tbody tr").length) / 2);
            for (var i = 0; i <= 50; i++) {
                if ($('#tblConsumables_Consumables_' + [i]).val() != undefined && $('#tblConsumables_Consumables_' + [i]).val() != '' && 'tblConsumables_Consumables_' + [i] != 'tblConsumables_Consumables_' + textId.split('_')[2])
                    cfi.setFilter(f, "SNo", "notin", $('#tblConsumables_HdnConsumables_' + [i]).val());
            }
            //f = cfi.autoCompleteFilter(filtertblDimensionULDTab_ULDTypeSNo);
            //return f;
        }
        else {
            cfi.setFilter(f, "Owner", "eq", "2");
            cfi.setFilter(f, "CitySNo", "eq", userContext.CitySNo);
        }
    }
    if (textId.indexOf("tblConsumables_ServiceName") >= 0) {
        cfi.setFilter(f, "CitySNo", "eq", userContext.CitySNo);
    }
    if (textId.indexOf("Text_ULDNumber") >= 0) {
        cfi.setFilter(f, "SNo", "notin", $("#Text_ULDNumber").data("kendoAutoComplete").key());
        cfi.setFilter(f, "CurrentCityCode", "eq", userContext.CityCode);
        cfi.setFilter(f, "AirlineSNo", "eq", userContext.AirlineSNo);
        //filterSHC = cfi.autoCompleteFilter(f);
        //return filterSHC;
    }


    return cfi.autoCompleteFilter([f]);
}
function ReceivedByClick(a, b, c, d) {

    var TransferBy = $("#Text_TransferBy").val();
    var IssuedTo = $("#IssuedTo").val();
    if (IssuedTo == "1" || IssuedTo == "0" || IssuedTo == "2") {


        if (TransferBy.trim() == b.trim()) {
            $('input[name="Text_ReceivedBy"]').val("");
            $('input[name="ReceivedBy"]').val("");
        }
    }
    // $("#ReceivedByCode").val(b.split('-')[0]);
}
function TransferByClick(a, b, c, d) {
    var ReceivedBy = $("#Text_ReceivedBy").val();
    var IssuedTo = $("#IssuedTo").val();
    if (IssuedTo == "1" || IssuedTo == "0" || IssuedTo == "2") {
        if (ReceivedBy.trim() == b.trim()) {
            $('input[name="Text_TransferBy"]').val("");
            $('input[name="TransferBy"]').val("");
        }
    }
    // $("#ReceivedByCode").val(b.split('-')[0]);
}


function ULDNumberOnSelect(e) {
    var Data = this.dataItem(e.item.index());

    var MultipleULD = $("#Multi_ULDNumber").val()// == "" ? 0 : 1;
    MultipleULD = MultipleULD.replace(",,", ",");


    var CommoExist = MultipleULD.substr(MultipleULD.length - 1);
    if (CommoExist == ',') {
        MultipleULD = MultipleULD.substring(0, MultipleULD.length - 1);
    }

    MultipleULD = MultipleULD == "" ? 0 : 1;
    if (Data.Key != "") {
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json", cache: false,
            url: "./Services/Export/UldTransfer/UldOutService.svc/GetUldDetails/" + Data.Key,
            success: function (response) {
                var data = jQuery.parseJSON(response);

                $('#Text_IssuedBy').html(userContext.UserName)
                $('#Text_IssuedBy').css('text-transform', 'uppercase')
                $("#Text_Status").text(data.Table0[0].IsAvailable);
                $("#Text_Location").text(data.Table0[0].City);
                //if (MultipleULD > 0) {
                //    $("#Text_ULDCode").text('');
                //    $("#lblULDType").text('');
                //}
                //else
                //    $("#Text_ULDCode").text(data.Table0[0].uldtype);
                if (Data.Key != "" && EditSNo == 0) {
                    $("#Text_IssuedTime").val(data.Table0[0].STime)
                }
                $("#Text_TransferredBy").text(userContext.UserName);
                $("#Text_TransferPoint").text(userContext.AirportCode);
                //$("#ULDCode").val(b.split('-')[0]);
                $("#UserSNo").val(userContext.UserSNo);
                $("#AirportSNo").val(userContext.AirportSNo);

                $("#Text_TransferBy").val("GARUDA AIRLINE");
                $("#TransferBy").val("1");
                
            }
        });
    }
    if (MultipleULD > 0) {
        // if ($("#Multi_ULDNumber").val().indexOf(',') != -1) {
        $('#Damaged').prop('disabled', true);
        $('#Damaged').removeAttr('checked', false);
        $('#Text_DamageCondition').removeAttr("data-valid");
        //$('#Text_ODLNCode').removeAttr("data-valid");
        //$('#Text_DemurrageCode').removeAttr("data-valid");
        $('#Text_DamageCondition').val('');
        //$('#Text_ODLNCode').val('');
        //$('#ODLNCode').val('');
        //$('#Text_DemurrageCode').val('');
        //$('#DemurrageCode').val('');
        //$("#ODLNCode").attr("enabled", false);
        //$("#Text_ODLNCode").data("kendoAutoComplete").enable(false);
        //$("#DemurrageCode").attr("enabled", false);
        //$("#Text_DemurrageCode").data("kendoAutoComplete").enable(false);
        $("#Text_DamageCondition").prop('disabled', true);
        //}
        // $("#Text_ULDCode").text('');
    }

}

var TransferBy = "";

function ReceivedByOnSelect(e) {

    //var ReceivedBy = $("#Text_TransferBy").val();
    //var TransferBy = $("#Text_ReceivedBy").val();

    //if (ReceivedBy.trim() == TransferBy.trim()) {

    //    e.preventDefault();
    //    $('input[name="Text_ReceivedBy"]').val("");
    //    $('input[name="ReceivedBy"]').val("");
    //}
}
function TransferByOnSelect(e) {

    //var ReceivedBy = $("#Text_TransferBy").val();
    //var TransferBy = $("#Text_ReceivedBy").val();
    //if (ReceivedBy.trim() == TransferBy.trim()) {
    //    e.preventDefault();
    //    $('input[name="Text_TransferBy"]').val("");
    //    $('input[name="TransferBy"]').val("");


    //}
}


function BindGridData_TransferBy(SNo, TransferBy, IsMsgSent, obj) {
    ProcessClick(SNo, TransferBy, IsMsgSent, obj);
}

function BindGridData(SNo, TransferBy, IsMsgSent, obj) {
    if ($(obj).attr("value") == "C") {
        ProcessClick(SNo, TransferBy, IsMsgSent, obj);
    }
    else if ($(obj).attr("value") == "E") {
        ProcessClick(SNo, TransferBy, IsMsgSent, obj);
    }
    else if ($(obj).attr("value") == "U") {
        BindUploadControl(SNo);
    }
    else if ($(obj).attr("value") == "L") {
        var urlnew = "";
        var closestTr = $(obj).closest("tr");
        var ULDNumber = closestTr.find("td[data-column='ULDNumber']").text();
        var ULDNumberSNo = closestTr.find("td[data-column='Text_ULDNumber']").text();
        if (location.hostname == "localhost")
            urlnew = "http://" + location.host + "/" + window.location.pathname + "?Module=Shipment&Apps=LUC&FormAction=INDEXVIEW&returnurl=ULDOut&ULDNumber=" + ULDNumber + "&ULDNumberSNo=" + ULDNumberSNo + "";
        else
            urlnew = "http://" + location.host + "/" + window.location.pathname + "?Module=Shipment&Apps=LUC&FormAction=INDEXVIEW&returnurl=ULDOut&ULDNumber=" + ULDNumber + "&ULDNumberSNo=" + ULDNumberSNo + "";
        window.location.href = urlnew
    }
}

function BindUploadControl(SNo) {
    CancelDetails();
    $('#tblConsumables').html('');
    $('#tblConsumables').addClass("appendGrid ui-widget");
    $('#tblConsumables').html("<form name='form1' method='post' ><table class='WebFormTable'><tr><td class='formSection' colspan='4'>ULD Image Upload</td></tr><tr><td class='formlabel'>Image upload</td><td class='formInputcolumn'> <div><input id='ImgFileUpload' name='ImgFileUpload' type='file' /></div><div><input type='hidden' id='hdnULDSNoImgupload' value='" + SNo + "'/></div></td><td class='formlabel'>Download File</td><td class='formInputcolumn' id='uldimageDownloadLink'></td></tr><tr><td class='formlabel'></td><td class='formInputcolumn'><input type='button'  value='Submit' onClick = 'UploadImage()' /></td><td class='formlabel'></td><td class='formInputcolumn'></td></tr></table></form>");

    $.ajax({
        url: "./Services/Export/UldTransfer/UldOutService.svc/GetULDImageFileName",
        async: false,
        type: "GET",
        dataType: "json",
        data: {
            ULDSNo: SNo
        },
        contentType: "application/json; charset=utf-8", cache: false,
        success: function (result) {

            if (result.length > 2) {
                var v = $.parseJSON(result);
                if (v[0].FName != '') {

                    var str = "<a href='Handler/FileUploadHandler.ashx?ULDImage=DBULDIMAGE&FlagSNo=" + SNo + "'>" + v[0].FName.toString() + "</a>"
                    $("#uldimageDownloadLink").html(str);
                }
            }
        },
        error: function (xhr) {
            var a = "";
        }
    });
}

function UploadImage() {
    var fileName = '';
    var nextctrlID = ''
    var fileSelect = document.getElementById('ImgFileUpload');
    var files = fileSelect.files;

    var data = new FormData();
    for (var i = 0; i < files.length; i++) {
        fileName = files[i].name;
        var uldsno = $('#hdnULDSNoImgupload').val();
        // data.append(files[i].name, files[i]);
        data.append(files[i].name + '~' + uldsno + '~1', files[i]);
    }
    $.ajax({
        url: "Handler/FileUploadHandler.ashx",
        type: "POST",
        data: data,
        contentType: false,
        processData: false,
        success: function (result) {
            if (result != 2001) {
                ShowMessage('success', '', "File Uploaded Successfully.", "bottom-right");
                var str = "<a href='Handler/FileUploadHandler.ashx?ULDImage=DBULDIMAGE&FlagSNo=" + result + "'>" + fileName.toString() + "</a>"
                $("#uldimageDownloadLink").html(str);
            }
        },
        error: function (err) {
            ShowMessage('info', 'File Upload!', "Unable to upload the selected file. Please try again.", "bottom-right");
        }
    });

}

function SaveImage() {
    var filename = String($('#file').val()).toLowerCase();
    if (filename == "") {
        alert('Please select file');
        return false;
    }
    if (filename != "" && (filename.indexOf('.jpg') == -1 && filename.indexOf('.gif') == -1 && filename.indexOf('.jpeg') == -1) && filename.indexOf('.bmp') == -1 && filename.indexOf('.png') == -1) {
        alert('Please upload valid file only');
        return false;
    }

    var form = $('#tblConsumables').get(0);
    AjaxPostwithFile(form, 'html', function (response) {
        if (String(response).indexOf('System.Exception: File size should be less than 1 MB.') == -1) {
            //alert(response);
            $('#divimgupload').html(response);
            hide_Verify();
        }
        else {
            alert('File size should be less than 1 MB.');
            //$('#spMessage').val();
        }
    });
}
function StockChangeClick(evt, rowIndex) {
    var index = rowIndex + 1;
    $("#tblConsumables_Consumables_" + index).val('');
    $("#tblConsumables_HdnConsumables_" + index).val('');
}

function uploadImage() {
    var filename = String($('#file').val()).toLowerCase();
    if (filename == "") {
        alert('Please select file');
        return false;
    }
    if (filename != "" && (filename.indexOf('.jpg') == -1 && filename.indexOf('.gif') == -1 && filename.indexOf('.jpeg') == -1) && filename.indexOf('.pdf') == -1 && filename.indexOf('.png') == -1) {
        alert('Please upload valid file only');
        return false;
    }

    var fileUpload = $("#file").get(0);

    //if (fileUpload.length > 0) {
    //    test.append("UploadedImage", fileUpload[0]);
    //}
    var files = fileUpload.files;
    var test = new FormData();
    for (var i = 0; i < files.length; i++) {
        test.append(files[i].name, files[i]);
    }

    $.ajax({
        url: "./Services/Export/UldTransfer/UldOutService.svc/uploadfile",
        type: "POST",
        contentType: false,
        processData: false,
        data: test,
        // dataType: "json",
        success: function (result) {
            alert(result);
        },
        error: function (err) {
            alert(err.statusText);
        }
    });
}

var RowIndex = 0;
function ProcessClick(SNo, TransferBy, IsMsgSent, obj) {

    RowIndex = 0;
    CancelDetails();
    if ($(obj).attr("value") == "C") {

        var dbtableName = "tblConsumables";
        $("#" + dbtableName).appendGrid({
            tableID: dbtableName,
            contentEditable: true,
            currentPage: 1, itemsPerPage: 10, whereCondition: null, sort: "",
            servicePath: './Services/Export/UldTransfer/UldOutService.svc',
            getRecordServiceMethod: "GetConsumablesRecord",
            createUpdateServiceMethod: "CreateConsumablesRecord",
            masterTableSNo: SNo,
            deleteServiceMethod: "DeleteConsumablesRecord",
            isGetRecord: true,
            hideButtons: { insert: true },
            caption: "Consumables",
            initRows: 1,
            columns: [
                    { name: 'SNo', type: 'hidden', value: 0 },
                    { name: 'TransferBy', type: 'hidden', value: TransferBy },
                    { name: 'ULDTransferSNo', type: 'hidden', value: SNo },
                    {
                        name: 'Stock', display: 'Stock', type: 'radiolist', ctrlOptions: { 0: 'Airline', 1: 'Self' }, selectedIndex: 0, onClick: function (evt, rowIndex) {
                            { StockChangeClick(evt, rowIndex) }
                        }
                    },
                    {
                        name: "Consumables", display: "Consumables", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete" }, ctrlCss: { width: "100px" }, isRequired: true, tableName: "VConsumables", textColumn: "Item", keyColumn: "SNo", filterCriteria: "contains"
                    },
                    {
                        name: 'GrossWt', display: 'Quantity', type: 'text', ctrlCss: { width: '50px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 7 }, isRequired: true, onChange: function (evt, rowIndex) {
                            CheckQuantity()
                        }
                    }
            ],
            hideButtons: { updateAll: IsMsgSent == 1 ? true : false, append: IsMsgSent == 1 ? true : false, insert: true, remove: IsMsgSent == 1 ? true : false, removeLast: true },
            OnUpdateSuccess: function () { PageLoaded(); },
            //afterRowRemoved: function (caller, rowIndex) {
            //    RefreshGrid(rowIndex);
            //},
            //    , dataLoaded: function (caller, parentRowIndex, addedRowIndex) {

            //        for (var i = 1; i <= RowIndex; i++) {

            //            $('#tblConsumables_Consumables_' + i).data("kendoAutoComplete").enable(false);
            //            $('#tblConsumables_PrimaryValue_' + i).prop('disabled', true);
            //            $('#tblConsumables_SecondaryValue_' + i).prop('disabled', true);
            //            $('#tblConsumables_RbtnStock_' + i + '_0').prop('disabled', true);
            //            $('#tblConsumables_RbtnStock_' + i + '_1').prop('disabled', true);
            //            $('#tblConsumables_GrossWt_' + i ).prop('disabled', true);


            //        }
            //    },

            //    afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            //    RowIndex = addedRowIndex.length;
            //}
        });
        //if(response != '')
        //    $("#" + dbtableName).appendGrid('load', response);
    }
    else {
        var dbtableName = "tblConsumables";
        $("#" + dbtableName).appendGrid({
            tableID: dbtableName,
            contentEditable: true,
            currentPage: 1, itemsPerPage: 10, whereCondition: null, sort: "",
            servicePath: './Services/Export/UldTransfer/UldOutService.svc',
            getRecordServiceMethod: "GetESSRecord",
            createUpdateServiceMethod: "CreateESSRecord",
            masterTableSNo: SNo,
            deleteServiceMethod: "DeleteESSRecord",
            isGetRecord: true,
            hideButtons: { insert: true },
            caption: "ESS",
            initRows: 1,
            columns: [{ name: 'SNo', type: 'hidden', value: 0 },
                      { name: 'ULDTransferSNo', type: 'hidden', value: SNo },
                    {
                        name: "ServiceName", display: "Service Name", type: "text", ctrlAttr: { maxlength: 50, controltype: "autocomplete" }, ctrlCss: { width: "150px" }, isRequired: true, addOnFunction: onchangeservicename, tableName: "vServicesHeaderLUC", textColumn: "ChargeName", keyColumn: "TariffSNo", filterCriteria: "contains"
                    },
                      {
                          name: 'Mode', display: 'Payment Type', type: 'radiolist', ctrlOptions: { 0: 'Cash', 1: 'Credit' }, selectedIndex: 1, isRequired: false, onClick: function (evt, rowIndex) { }
                      },
                    //{
                    //    name: 'PrimaryValue', display: 'Primary Value', type: 'text', ctrlCss: { width: '50px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 7, onBlur: "calculateAmount(this)" }, isRequired: true

                    //}
                    //,
                    //{
                    //    name: 'SecondaryValue', display: 'Secondary Value', type: 'text', ctrlCss: { width: '50px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 7, onBlur: "calculateAmount(this)" }, isRequired: true
                    //}
                    //,
                     {
                         name: 'PrimaryValue', display: 'Primary Value', type: 'div', isRequired: false, ctrlCss: { width: '150px' },
                         divElements:
                                [
                                    {
                                        divRowNo: 1, name: "PrimaryValue", display: '', type: "text", ctrlAttr: {
                                            maxlength: 10, controltype: "decimal2",
                                            onBlur: "calculateAmount(this)"
                                        }, ctrlCss: { width: "70px" }, isRequired: true
                                    }

                                ]
                     },
                 {
                     name: 'SecondaryValue', display: 'Secondary Value', type: 'div', isRequired: false, ctrlCss: { width: '150px' },
                     divElements:
                           [
                                 {
                                     divRowNo: 1, name: "SecondaryValue", display: '', type: "text", ctrlAttr: { maxlength: 10, controltype: "decimal2", onBlur: "calculateAmount(this)" }, ctrlCss: { width: "70px" }, isRequired: false
                                 }
                           ]
                 },
                    {
                        name: 'Charges', display: 'Charges', type: 'label', ctrlCss: { width: '50px', height: '20px' }
                    },
            {
                name: 'Charges', display: 'Charges', type: 'hidden', value: ''
            }
            ]
            , hideButtons: { updateAll: IsMsgSent == 1 ? true : false, append: IsMsgSent == 1 ? true : false, insert: true, remove: IsMsgSent == 1 ? true : false, removeLast: true },
            isPageRefresh: true,

            dataLoaded: function (caller, parentRowIndex, addedRowIndex) {

                for (var i = 1; i <= RowIndex; i++) {
                    var ChkId = "tblConsumables_SecondaryValue_" + i;
                    if ($("#" + ChkId).val() == "") {
                        $('#tableSecondaryValue' + i).hide();
                    }


                    if ($('#tblConsumables_ServiceName_' + i).val() != '' && $('#tblConsumables_ServiceName_' + i).val() != undefined) {
                        var ChkServiceID = $('#tblConsumables_ServiceName_' + i).val()
                        var serviceName = ChkServiceID.split('[')[1].split(']')[0];
                        if (serviceName.split('-').length > 1) {
                            $('#tblConsumables_lblPrimaryValue_' + i).text(serviceName.split('-')[0]);
                            $('#tblConsumables_lblSecondaryValue_' + i).text(serviceName.split('-')[1]);

                        } else {

                            $('#tblConsumables_lblPrimaryValue_' + i).text(serviceName.split('-')[0])
                        }
                    }
                    $('#tblConsumables_ServiceName_' + i).data("kendoAutoComplete").enable(false);
                    $('#tblConsumables_PrimaryValue_' + i).prop('disabled', true);
                    $('#tblConsumables_SecondaryValue_' + i).prop('disabled', true);
                    $('#tblConsumables_RbtnMode_' + i + '_0').prop('disabled', true);
                    $('#tblConsumables_RbtnMode_' + i + '_1').prop('disabled', true);

                }

            },
            afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
                RowIndex = addedRowIndex.length;
            }

        });
        // BindESS();
    }
}
function RefreshGrid(rowIndex)
{
    alert(rowIndex);
}
function CheckQuantity() {

}
function onchangeservicename(id, val) {

    var index = id.split('_')[2];
    var ss = $('#tblConsumables_ServiceName_1').val();
    if ($('#tblConsumables_ServiceName_' + index).val() != '') {
        var serviceName = val.split('[')[1].split(']')[0];
        if (serviceName.split('-').length > 1) {

            $('#tblConsumables_PrimaryValue_' + index).val('');
            $('#tblConsumables_SecondaryValue_' + index).val('');

            $('#_temptblConsumables_PrimaryValue_' + index).val('');
            $('#_temptblConsumables_SecondaryValue_' + index).val('');

            $('#tblConsumables_lblPrimaryValue_' + index).text('');
            $('#tblConsumables_lblSecondaryValue_' + index).text('');
            $('#tblConsumables_lblPrimaryValue_' + index).text(serviceName.split('-')[0]);
            $('#tblConsumables_lblSecondaryValue_' + index).text(serviceName.split('-')[1]);
            $('#tableSecondaryValue' + index).show();
            $('#tblConsumables_SecondaryValue_' + index).attr("data-valid", "required");
        } else {
            $('#_temptblConsumables_PrimaryValue_' + index).val('');
            $('#_temptblConsumables_SecondaryValue_' + index).val('');
            $('#tblConsumables_PrimaryValue_' + index).val('');
            $('#tblConsumables_SecondaryValue_' + index).val('');

            $('#tblConsumables_lblPrimaryValue_' + index).text('');
            $('#tblConsumables_lblSecondaryValue_' + index).text('');
            $('#tblConsumables_lblPrimaryValue_' + index).text(serviceName.split('-')[0])

            $('#tableSecondaryValue' + index).hide();
            $('#tblConsumables_SecondaryValue_' + index).removeAttr("required")
        }
    }

}
function calculateAmount(id) {
    var idvalIndex = id.id.split('_')[2]
    TariffSNo = $('#tblConsumables_HdnServiceName_' + idvalIndex + '').val(),
    PrimaryValue = $('#tblConsumables_PrimaryValue_' + idvalIndex).val() == '' ? '0' : $('#tblConsumables_PrimaryValue_' + idvalIndex).val(),
    SecondaryValue = $('#tblConsumables_SecondaryValue_' + idvalIndex).val() == '' ? '0' : $('#tblConsumables_SecondaryValue_' + idvalIndex).val();
    if (TariffSNo == "") {
        ShowMessage('warning', 'Warning - ULD Out', "Service Name is required.", "bottom-right");
    }
    else if (PrimaryValue != "0" || SecondaryValue != "0") {
        $.ajax({
            url: "./Services/Export/UldTransfer/UldOutService.svc/GetULDOutESSChargesTotal?TariffSNo=" + TariffSNo + "&PrimaryValue=" + PrimaryValue + "&SecondaryValue=" + SecondaryValue,
            async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                $('#tblConsumables_Charges_' + idvalIndex).text(data);
                $('#tblConsumables_Charges_' + idvalIndex).val(data);
            }
        });
    }
}

function BindESS() {



    var Issueinvoice = "Consumables";
    $('#tbl' + Issueinvoice).appendGrid({
        tableID: 'tbl' + Issueinvoice,
        contentEditable: true,
        // contentEditable: false,
        // tableColumns: 'SNo,CFTNumber,MawbNo,TotalPcs,TotalGrossWt,TotalCBM,NoOfBUP,ShipmentType,ForwarderName,AirlineName,IsSecure,Origin,SPHCSNo,FlightNo,Origin,Destination,FlightNo,CarrierCode',
        isGetRecord: false,
        masterTableSNo: 0,
        currentPage: 1, itemsPerPage: 10, whereCondition: '', sort: '',
        servicePath: './Services/Inventory/ConsumableStockService.svc',
        getRecordServiceMethod: null,
        createUpdateServiceMethod: 'createUpdateConsumableStock',
        deleteServiceMethod: 'deletetblConsumableStock',
        caption: "ESS",
        initRows: 1,
        rowNumColumnName: 'SNo',

        columns: [
              {
                  name: 'ServiceName', display: 'Service Name', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '150px', height: '20px' }, isRequired: true, addOnFunction: onchangeservicename, tableName: 'vServicesHeader', textColumn: 'ChargeName', keyColumn: 'TariffSNo', filterCriteria: "contains"
              },

              {
                  name: 'PaymentType', display: 'Payment Type', type: 'radiolist', ctrlOptions: { 0: 'Cash', 1: 'Credit' }, selectedIndex: 1, isRequired: false, onClick: function (evt, rowIndex) { }
              },

              {
                  name: 'PrimaryValue', display: 'Primary Value', type: 'div', isRequired: false, ctrlCss: { width: '150px' },
                  divElements:
                         [
                             {
                                 divRowNo: 1, name: "PrimaryValue", display: '', type: "text", ctrlAttr: { maxlength: 10, controltype: "decimal2", onBlur: "calculateAmount(this)" }, ctrlCss: { width: "70px" }, isRequired: false
                             }

                         ]
              },
                 {
                     name: 'SecondaryValue', display: 'Secondary Value', type: 'div', ctrlCss: { width: '150px' },
                     divElements:
                           [
                                 {
                                     divRowNo: 1, name: "SecondaryValue", display: '', type: "text", ctrlAttr: { maxlength: 10, controltype: "decimal2", onBlur: "calculateAmount(this)" }, ctrlCss: { width: "70px" },
                                 }
                           ]
                 },

          { name: "Amount", display: "Amount", type: "label", ctrlCss: { width: "50px" } },

        ],

        //  hideButtons: { remove: true, removeLast: true },
        //hideButtons: { append: true, remove: true, removeLast: true },
        hideButtons: { updateAll: true, append: false, insert: true, remove: true, removeLast: true },
        isPaging: true

    });
}

function NewClick(EditSNo) {
    $("#HeaderName").html('')
    EditSNo = EditSNo;

    $("#tblConsumables").html('');
    $.ajax({
        url: 'HtmlFiles/Export/UldTransfer/UldInformation.html',
        async: false,
        cache: false,
        success: function (result) {
            $("#divULDInformation").html(result);
            $("#btnSave").show();
            BindControls();
            if (EditSNo == undefined) {
                $('#Damaged').change(function () {
                    if ($(this).is(":checked")) {
                        $('#Text_DamageCondition').attr("data-valid", "required");
                        $('#Text_DamageCondition').attr("data-valid-msg", "Enter Damage Description");
                        //$('#Text_ODLNCode').attr("data-valid", "required");
                        //$('#Text_ODLNCode').attr("data-valid-msg", "Select ODLN Code");
                        //$('#Text_DemurrageCode').attr("data-valid", "required");
                        //$('#Text_DemurrageCode').attr("data-valid-msg", "Select Demurrage Code");
                        //$("#ODLNCode").attr("enabled", true);
                        //$("#Text_ODLNCode").data("kendoAutoComplete").enable(true);
                        //$("#DemurrageCode").attr("enabled", true);
                        //$("#Text_DemurrageCode").data("kendoAutoComplete").enable(true);
                        $("#Text_DamageCondition").prop('disabled', false);
                    }
                    else {
                        $('#Text_DamageCondition').removeAttr("data-valid");
                        //$('#Text_ODLNCode').removeAttr("data-valid");
                        //$('#Text_DemurrageCode').removeAttr("data-valid");
                        $('#Text_DamageCondition').val('');
                        //$('#Text_ODLNCode').val('');
                        //$('#ODLNCode').val('');
                        //$('#Text_DemurrageCode').val('');
                        //$('#DemurrageCode').val('');
                        //$("#ODLNCode").attr("enabled", false);
                        //$("#Text_ODLNCode").data("kendoAutoComplete").enable(false);
                        //$("#DemurrageCode").attr("enabled", false);
                        //$("#Text_DemurrageCode").data("kendoAutoComplete").enable(false);
                        $("#Text_DamageCondition").prop('disabled', true);

                    }
                });
                //$("#ODLNCode").attr("enabled", false);
                //$("#Text_ODLNCode").data("kendoAutoComplete").enable(false);
                //$("#DemurrageCode").attr("enabled", false);
                //$("#Text_DemurrageCode").data("kendoAutoComplete").enable(false);
                $("#Text_DamageCondition").prop('disabled', true);
            }
            $("div[id='divMultiULDNumber']").css("width", "60em");
        }
    });

    if (EditSNo == undefined) {
        $('#HeaderName').text('New ULD Information');
    } else {
        $("#HeaderName").text("Edit ULD Information")
    }
}

$("span.k-delete").live("click", function () { RemoveULD(this) });
function RemoveULD(input) {
    //var MultipleULD = $("#Multi_ULDNumber").val().split(',').length;
    var MultipleULD = $("#Multi_ULDNumber").val()// == "" ? 0 : 1;
    MultipleULD = MultipleULD.replace(",,", ",");
    var CommoExist = MultipleULD.substr(MultipleULD.length - 1);
    if (CommoExist == ',') {
        MultipleULD = MultipleULD.substring(0, MultipleULD.length - 1);
    }
    var CommaFirstExist = MultipleULD.substr(0, 1);
    if (CommaFirstExist == ',') {
        MultipleULD = MultipleULD.substring(1, MultipleULD.length);
    }
    MultipleULD = MultipleULD.replace(",,", ",");
    MultipleULD = MultipleULD.replace(",,,", ",");
    $("#Multi_ULDNumber").val(MultipleULD);
    $("#ULDNumber").val(MultipleULD);
    MultipleULD = MultipleULD.split(',').length;
    if (MultipleULD == 1) {
        $('#Damaged').prop('disabled', false);
        $("#lblULDType").text('ULD Type');
    }
}

function SaveDetails() {
    cfi.ValidateSubmitSection("divMainDiv");
    if (!cfi.IsValidSection($("#divMainDiv"))) {
        return false;
    }

    if ($('#Damaged').attr('checked')) {
        if ($('#Text_DamageCondition').val().toString().trim().length < 1) {
            alert('Please enter damage condition');
            return false;
        }
    }

    var res = $("#tblAdd").serializeToJSON();
    if (res.ODLNCode == "")
        res.ODLNCode = "0";
    if (res.DemurrageCode == "")
        res.DemurrageCode = "0";
    var action = EditSNo == "0" ? "SaveDetails" : "UpdateDetails/" + EditSNo;
    $("#btnSave").hide();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        async: true,
        dataType: "json",
        url: "./Services/Export/UldTransfer/UldOutService.svc/" + action,
        data: JSON.stringify(res),
        success: function (response) {
            if (response == "2000") {
                ShowMessage("success", "Success - ULD Out", "Saved successfully...");
                setTimeout(function () { location.reload(); }, 500);
            }
            if (response == "2001") {
                ShowMessage("success", "Success - ULD Out", "Updated successfully...");
                setTimeout(function () { location.reload(); }, 500);
            }
            if (response == "2002") {
                ShowMessage('info', 'Need your Kind Attention!', "Max 62 ULDs can be transferred");
            }
            else { }
        }
    });
}
function CancelDetails() {
    $("#divULDInformation").html('');
    $("#tblConsumables").html('');
    $("#btnSave").hide();
}
var footer = '<div id="divFooter" class="divFooter" style="height: 0px; padding-bottom: 30px; display: block;"><div><table style="margin-left:20px;"><tbody><tr><td> &nbsp; &nbsp;</td><td><input type="button" value="New" onclick="NewClick()" class="btn btn-info"></td><td> &nbsp; &nbsp;</td><td><input type="button" style="float:right;display:none;" onclick="SaveDetails(0)" id="btnSave"  value="Save" class="btn btn-success"></td><td> &nbsp; &nbsp;</td><td><button class="btn btn-block btn-danger btn-sm" id="btnCancel" onclick="CancelDetails()">Cancel</button></td></tr></tbody></table> </div></div>';

