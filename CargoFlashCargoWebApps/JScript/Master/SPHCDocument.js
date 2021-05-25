/*
*****************************************************************************
Javascript Name:	SPHCDocumentJS     
Purpose:		    This JS used to add SPHCDocumentClasss and Update SPHCDocumen.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Karan Kumar
Created On:		    2 feb 2016
Updated By:         
Updated On:	        
Approved By:        
Approved On:	    
*****************************************************************************
*/

$(function () {
    cfi.ValidateForm();
    $('#aspnetForm').attr("enctype", "multipart/form-data");
    $('#aspnetForm').attr("onsubmit", " return validateImgForm()");
    cfi.AutoCompleteV2("DocumentName", "DocumentName", "SHCDocument_DocumentName", null, "contains");
    cfi.AutoCompleteV2("AirlineCode", "CarrierCode,AirlineName", "SHCDocument_AirlineCode", null, "contains");
    cfi.AutoCompleteV2("AirportCode", "AirportCode,AirportName", "SHCDocument_AirportCode",  null, "contains");

    cfi.AutoCompleteV2("SPHC", "SNo,Code", "SHCDocument_SPHC", SPHConSelect, "contains");
    cfi.AutoCompleteV2("SPHCSubGroupSNo", "SNo,SPHCCode", "SHCDocument_SPHCSubGroupSNo", null, "contains");

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $("#AirportCode").val(userContext.AirportSNo);
        $("#Text_AirportCode").val(userContext.AirportCode + '-' + userContext.AirportName);

    }

    $('#SampleDocumentDownload').click(function () {


        DownloadEDoxFromDB($('#DocumentMasterSPHCSampleSno').val(), 's');
    })

    $("input[name=SPHCType]:radio").click(function () {
        if ($(this).attr("value") == "0") {
            cfi.ResetAutoComplete("SPHC");
            var dataSource = new kendo.data.DataSource({
                data: []
            });
            var autocomplete = $("#Text_SPHC").data("kendoAutoComplete");
            autocomplete.setDataSource(dataSource);

            var data = GetDataSourceV2("SPHC", "SHCDocument_SPHC",  null);
            cfi.ChangeAutoCompleteDataSource("SPHC", data, true, SPHConSelect, "Code", "contains");


            $('#spnSPHC').html('SHC');
            $('#SPHCSubGroupSNo').val('');
            $('#Text_SPHCSubGroupSNo').val('');
            $('#spnSPHCSubGroupSNo').show();
            $('#SPHCSubGroupSNo').closest('td').find('*').show();
        }
        else {
            cfi.ResetAutoComplete("SPHC");
            var dataSource = new kendo.data.DataSource({
                data: []
            });
            var autocomplete = $("#Text_SPHC").data("kendoAutoComplete");

            autocomplete.setDataSource(dataSource);

            var data = GetDataSourceV2("SPHC", "SHCDocument_SPHCGroup", null);
            cfi.ChangeAutoCompleteDataSource("SPHC", data, true, null, "Name", "contains");

            $('#spnSPHC').html('SHC Group');

            $('#SPHCSubGroupSNo').val('');
            $('#Text_SPHCSubGroupSNo').val('');
            $('#spnSPHCSubGroupSNo').hide();
            $('#SPHCSubGroupSNo').closest('td').find('*').hide();
        }
    });

    if (getQueryStringValue("FormAction").toUpperCase() == 'EDIT' || getQueryStringValue("FormAction").toUpperCase() == 'DUPLICATE') {

        if ($('input:radio[name=SPHCType]:checked').val() == 0) {
            $('#spnSPHC').html('SHC');
            $('#spnSPHCSubGroupSNo').show();
            $('#SPHCSubGroupSNo').closest('td').find('*').show();

        } else {
            var SPHC = $('#SPHC').val();
            var Text_SPHC = $('#Text_SPHC').val();
            cfi.ResetAutoComplete("SPHC");
            var dataSource = new kendo.data.DataSource({
                data: []
            });
            var autocomplete = $("#Text_SPHC").data("kendoAutoComplete");

            autocomplete.setDataSource(dataSource);

            var data = GetDataSourceV2("SPHC", "SHCDocument_SPHCGroup", null);
            cfi.ChangeAutoCompleteDataSource("SPHC", data, true, null, "Name", "contains");

            $('#spnSPHC').html('SHC Group');
            $('#SPHC').val(SPHC);
            $('#Text_SPHC').val(Text_SPHC);

            $('#spnSPHCSubGroupSNo').hide();
            $('#SPHCSubGroupSNo').closest('td').find('*').hide();
        }
    }
    else if (getQueryStringValue("FormAction").toUpperCase() == 'READ' || getQueryStringValue("FormAction").toUpperCase() == 'DELETE' || getQueryStringValue("FormAction").toUpperCase() == 'DUPLICATE') {

        if ($('#Text_SPHCType').html() == 'SHC') {
            $('#spnSPHC').html('SHC');
            $('#spnSPHCSubGroupSNo').show();
            $('#SPHCSubGroupSNo').closest('td').find('*').show();
        } else {
            $('#spnSPHC').html('SHC Group');
            $('#spnSPHCSubGroupSNo').hide();
            $('#SPHCSubGroupSNo').closest('td').find('*').hide();
        }
    }

});
function ExtraCondition(textId) {

    var filter = cfi.getFilter("AND");
    if (textId == "Text_SPHCSubGroupSNo") {
        cfi.setFilter(filter, "SPHCSNo", "neq", 0);
        cfi.setFilter(filter, "SPHCSNo", "eq", $('#SPHC').val())
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filter);
        return RegionAutoCompleteFilter;
    }
    //if (textId == "Text_SPHC") {
    //    $('#Text_SPHCSubGroupSNo').val('');
    //    $('#SPHCSubGroupSNo').val('');
    //}
}
function DownloadEDoxFromDB(DocSNo, DocFlag) {
    if (parseInt(DocSNo) > 0) {
        window.location.href = "Handler/FileUploadHandler.ashx?DocSNo=" + DocSNo + "&DocFlag=" + DocFlag;
    }
    else {
        ShowMessage('info', 'Download!', "Invalid attempt.", "bottom-right");
    }
}
function SPHConSelect() {
    $('#Text_SPHCSubGroupSNo').val('');
    $('#SPHCSubGroupSNo').val('');
}

function validateImgForm() {
    var fp = $("input[type='file'][id='SampleDocument']");
    if (fp.length != 0) {
        var lg = fp[0].files.length; // get length
        var items = fp[0].files;
        var name = fp[0].files[0].name;
        if (name.split('.')[0].length > 50) {
            ShowMessage('warning', 'Warning - Information', "File Name can not be longer than 50 character.");
            return false;
        }
        else {
            return true;
        }
    }
    else {
        return true;
    }
}