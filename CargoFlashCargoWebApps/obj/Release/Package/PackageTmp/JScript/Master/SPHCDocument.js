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
    cfi.AutoComplete("DocumentName", "DocumentName", "DocumentMaster", "SNo", "DocumentName", null, null, "contains");
    cfi.AutoComplete("AirlineCode", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");
    cfi.AutoComplete("AirportCode", "AirportCode,AirportName", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains");

    cfi.AutoComplete("SPHC", "SNo,Code", "SPHC", "SNo", "Code", null, SPHConSelect, "contains");
    cfi.AutoComplete("SPHCSubGroupSNo", "SNo,SPHCCode", "vSPHCTrans", "SNo", "SPHCCode", null, null, "contains");

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

            var data = GetDataSource("SPHC", "SPHC", "SNo", "Code", ["Code"], null);
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

            var data = GetDataSource("SPHC", "SPHCGroup", "SNo", "Name", ["Name"], null);
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

            var data = GetDataSource("SPHC", "SPHCGroup", "SNo", "Name", ["Name"], null);
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