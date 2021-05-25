
//
/*
*****************************************************************************
Javascript Name:	SlabMasterJS     
Purpose:		    This JS used to get autocomplete for Country and City.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    Tarun Kumar
Created On:		    11 Mar 2014
Updated By:         Arman Ali
Updated On:	        14-02-2016
Approved By:    
Approved On:	
*****************************************************************************
*/
var a, b;
var slabArea = [{ Key: "1", Text: "Airport" }, { Key: "2", Text: "City" }, { Key: "3", Text: "Region" }, { Key: "4", Text: "Zone" }, { Key: "5", Text: "Country" }];
$(document).ready(function () {
    cfi.ValidateForm();
    $('#aspnetForm').attr("enctype", "multipart/form-data");
    if (!$("#Text_" + $(this).attr("name")).data("kendoAutoComplete")) {
        cfi.AutoComplete("CityCode", "CityName,CityCode,SNo", "vCity", "SNo", "CityCode", ["CityCode", "CityName"], null, "contains");
    }
    cfi.AutoComplete("AirlineSNo", "AirlineCode,AirlineName", "Airline", "SNo", "AirlineCode", ["AirlineCode", "AirlineName"], null, "contains");

  //  cfi.AutoCompleteByDataSource("Slab", null);
    var tabStrip1 = $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");
    var aa = $('#SlabLevel').val();
    if (aa == "") {
        /// added to Clear Zone DropDown Clear On load  Added By Vsingh Task-57 on 12/01/2017
        cfi.AutoCompleteByDataSource("Slab", null);
        //  cfi.EnableAutoComplete("Slab", false, true, "grey");
        // cfi.AutoComplete("Slab", "AirportCode", "Airport", "SNo", "AirportCode", null, null, "contains", ",");
    }
    else {
        //if ((getQueryStringValue("FormAction").toUpperCase() == "EDIT") || (getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE"))
        //{
        // cfi.AutoComplete("Slab", "AirportCode", "Airport", "SNo", "AirportCode", null, null, "contains", ",");
        BindAutoComplete();
        cfi.BindMultiValue("Slab", $("#Text_Slab").val(), $("#Slab").val());


        //}
    }
    cfi.AutoCompleteByDataSource("SlabLevel", slabArea, getslab);

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").activateTab($('#liSlab'));
        CreateSlab();
    }
    //if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
    //   $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip").activateTab($('#liSlab'));
    //}

    //   by arman
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue

("FormAction").toUpperCase() == "DUPLICATE") {
        //  var Isactive = $('input:radio[name=IsDefault]:checked').val();
        if ($('input:radio[name=IsDefault]:checked').val() == "1") {
            cfi.AutoCompleteByDataSource("Slab", null);
            // cfi.EnableAutoComplete("Slab", false, true, "grey");
            $('#SlabLevel').val('');
            $('#Text_SlabLevel').val('');
            $('#Text_Slab').val('');
            $('#Slab').val('');
            //   cfi.AutoComplete("Slab", "AirportCode", "Airport", "SNo", "AirportCode", null, null, "contains", ",");
            $('#Text_SlabLevel').data("kendoAutoComplete").enable(false);
            $('#Text_Slab').data("kendoAutoComplete").enable(false);
            // $('input[type="radio"][id="IsActive"]').attr("disabled", true);
            $('#Text_SlabLevel').removeAttr("data-valid");
            $('#Text_Slab').removeAttr("data-valid");
            $('#spnSlabLevel').closest('td').find('font').text('');
            $('#spnSlab').closest('td').find('font').text('');
        
        }
        else {
            $('#Text_SlabLevel').data("kendoAutoComplete").enable(true);
            $('#Text_Slab').data("kendoAutoComplete").enable(true);
            //   cfi.AutoComplete("Slab", "AirportCode", "Airport", "SNo", "AirportCode", null, null, "contains", ",");
            //  $('input[type="radio"][id="IsActive"]').attr("disabled", false);
            $('#Text_SlabLevel').attr("data-valid", "required");
            $('#Text_Slab').attr("data-valid", "required");
            $('#spnSlabLevel').closest('td').find('font').text(' *');
            $('#spnSlab').closest('td').find('font').text(' *');
        }



    }



});






function ExtraCondition(textId) {
    if (textId.indexOf("Text_AirlineSNo") >= 0) {
        var filter1 = cfi.getFilter("AND");
        cfi.setFilter(filter1, "IsActive", "eq", "1");
        cfi.setFilter(filter1, "IsInterline", "eq", "0");
        filterAirlineSNo = cfi.autoCompleteFilter(filter1);
        return filterAirlineSNo;
    }
}

function getslab() {
    $('#divMultiSlab').remove();
    changetext();
    BindAutoComplete();
}
function CreateSlab() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowMessage('info', 'Need your Kind Attention!', "Slab Details can be added in Edit/Update mode only.");
        return;
    }
    else {
        var dbTableName = 'Slab';
        var pageType = $('#hdnPageType').val();
        cfi.ValidateForm();
        $('#tbl' + dbTableName).appendGrid({
            tableID: 'tbl' + dbTableName,
            isGetRecord: true,
            contentEditable: pageType != 'View',
            tableColumns: 'SNo,SlabMasterSNo,SlabName,StartWeight,EndWeight,CreatedBy,UpdatedBy',
            masterTableSNo: $('#hdnSlabMasterSNo').val(),
            currentPage: 1, itemsPerPage: 20, whereCondition: null, sort: '',
            servicePath: './Services/Master/' + dbTableName + 'Service.svc',
            getRecordServiceMethod: 'Get' + dbTableName + 'Record',
            createUpdateServiceMethod: 'createUpdate' + dbTableName,
            deleteServiceMethod: 'delete' + dbTableName,
            caption: 'Slab Details',
            initRows: 1,
            columns: [
                { name: 'SNo', type: 'hidden', value: 0 },
                { name: 'SlabMasterSNo', type: 'hidden', value: $('#hdnSlabMasterSNo').val() },
                { name: 'SlabName', display: 'Slab Name', type: 'text', ctrlAttr: { maxlength: 98 }, ctrlCss: { width: '150px' }, isRequired: true },
                {
                    name: 'StartWeight', display: 'Start Weight', type: 'text', ctrlAttr: { maxlength: 15, controltype: "number" }, ctrlClass: 'StartWeight', ctrlCss: {

                        width: '100px'
                    }, isRequired: true
                },
                {
                    name: 'EndWeight', display: 'End Weight', type: 'text', ctrlAttr: { maxlength: 15, controltype: "number", onblur: "return CheckRange(this.id);" },

                    ctrlClass: 'EndWeight', ctrlCss: { width: '100px' }, isRequired: true
                },
                { name: 'CreatedBy', type: 'hidden', value: $('#hdnCreatedBy').val() },
                { name: 'UpdatedBy', type: 'hidden', value: $('#hdnUpdatedBy').val() }
            ],



            isPaging: true,
        });

    }
}
function BindAutoComplete() {
    $('#Text_Slab').nextAll("span").remove();

    var Zonearea = $('#SlabLevel').val();
    if (Zonearea == 3) {
       
            cfi.AutoComplete("Slab", "RegionName", "Region", "SNo", "RegionName", null, null, "contains", ",");
       
    }
    else if (Zonearea == 5) {
       
            cfi.AutoComplete("Slab", "CountryCode", "Country", "SNo", "CountryCode", null, null, "contains", ",");
       
    }
    else if (Zonearea == 2) {
      
            cfi.AutoComplete("Slab", "CityCode", "City", "SNo", "CityCode", null, null, "contains", ",");
       
    }
    else if (Zonearea == 1) {
      
            cfi.AutoComplete("Slab", "AirportCode", "Airport", "SNo", "AirportCode", null, null, "contains", ",");
       
    }
    else if (Zonearea == 4) {
     
            cfi.AutoComplete("Slab", "ZoneName", "Zone", "SNo", "ZoneName", null, null, "contains", ",");
        
    }
}



function CheckRange(obj) {


    var startValue = 0;
    var endValue = 0;
    var Slabtext;
    //   alert(obj);
    if (obj.indexOf("StartWeight") >= 0) {
        startValue = $("#" + obj).val();
        endValue = $("#" + obj.replace("StartWeight", "EndWeight")).val();
        Slabtext = $("#" + obj.replace("StartWeight", "SlabName")).val();
        previousEndValue = $("#" + obj.replace("StartWeight", "EndWeight").replace(obj.split("_")[2], obj.split("_")[2] - 1)).val();
    }
    else {
        endValue = $("#" + obj).val();
        startValue = $("#" + obj.replace("EndWeight", "StartWeight")).val();
        Slabtext = $("#" + obj.replace("EndWeight", "SlabName")).val();

    }


    if (parseFloat(startValue) > parseFloat(endValue)) {
        ShowMessage('info', 'Need your Kind Attention!', "End Value must be greater than Start Value.");

        $("#" + obj).val("");
    }

}


function resetlevel() {

}

$("input[name='IsDefault']").change(function () {
    // alert($('input:radio[name=IsDefault]:checked').val());
    $("#divMultiSlab").remove()
    if ($('input:radio[name=IsDefault]:checked').val() == "1") {
        $('#SlabLevel').val('');
        $('#Text_SlabLevel').val('');
        $('#Text_Slab').val('');
        $('#Slab').val('');
        $('#Text_SlabLevel').data("kendoAutoComplete").enable(false);
        $('#Text_Slab').data("kendoAutoComplete").enable(false);
        $('#Text_SlabLevel').removeAttr("data-valid");
        $('#Text_Slab').removeAttr("data-valid");
        $('#spnSlabLevel').closest('td').find('font').text('');
        $('#spnSlab').closest('td').find('font').text('');
        $('#spnSlab').text('Slab');

    }
    else {

        $('#Text_SlabLevel').attr("data-valid", "required");
        $('#Text_Slab').attr("data-valid", "required");
        $('#Text_SlabLevel').data("kendoAutoComplete").enable(true);
        $('#Text_Slab').data("kendoAutoComplete").enable(true);
       // cfi.AutoCompleteByDataSource("Slab", null);
        $('#spnSlabLevel').closest('td').find('font').text(' *');
        $('#spnSlab').closest('td').find('font').text(' *');

        //   $("#Text_Slab").closest('td').prev().find('font').html('*');
        // $("#Text_SlabLevel").closest('td').prev().find('font').html('*');

    }
});


function changetext() {
    if ($('#Text_SlabLevel').val()!=''){
    $('#spnSlab').text($('#Text_SlabLevel').val().toUpperCase());
    }
    else
    {
        $('#spnSlab').text('Slab');
    }
}

if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
    if ($('#Text_SlabLevel').val() != "") {
        changetext();
    }
}

//$("#Text_SlabLevel").closest('td').prev().append('<font color="red">*</font> <span id="spnSlabTitle"> Slab Title</span>');



