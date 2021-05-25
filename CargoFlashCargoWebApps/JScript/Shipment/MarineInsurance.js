

var PageType = "";
var AwbSno = "";
var Approve = "";
var Request = "";
var LoginType = "";
var SNo = 0;


$(document).ready(function () {


    var SurchargeType = [{ Key: "1", Text: "Commodity" }, { Key: "2", Text: "SHC" }, { Key: "0", Text: "Pieces" }];
    //  var PageType = '';

    //cfi.AutoCompleteV2("Commodity", "CommodityDescription", "RateSurcharge_Commodity", null, "contains", ",");



});


$(function () {


    if (window.opener) {
        userContext = window.opener.parent.userContext;
    }

    PageType = getQueryStringValue("FormAction").toUpperCase();




    if (PageType == "NEW") {


        $.ajax({
            url: 'HtmlFiles/Shipment/MarineInsurance.html',
            success: function (result) {
                $('#aspnetForm').on('submit', function (e) {
                    e.preventDefault();
                });
                $('#aspnetForm').append(result);
                cfi.AutoCompleteV2("AirlineSNo", "AirlineName", "MarineInsurance_Airline", fnCheckAirline, "contains");
                CreateGrid();
                /// $("#Text_AirlineSNo").data("kendoAutoComplete").setDefaultValue("1", "GA-GARUDA AIRLINE");
                $("#tblMarineInsuranceSlab_btnAppendRow").css("display", "none");
            }
        });
    }
    else if (PageType == "READ") {
        $('#Text_AirlineSNo').attr("disabled", "disabled");
        $.ajax({
            url: 'HtmlFiles/Shipment/MarineInsurance.html',
            success: function (result) {
                $('#aspnetForm').on('submit', function (e) {
                    e.preventDefault();
                });
                $('#aspnetForm').append(result);
                cfi.AutoCompleteV2("AirlineSNo", "AirlineName", "MarineInsurance_Airline", null, "contains");
                GetMarineInsuranceRecord();
                EditGrid();

            }
        });

    }

    else if (PageType == "EDIT") {

        $.ajax({
            url: 'HtmlFiles/Shipment/MarineInsurance.html',
            success: function (result) {
                $('#aspnetForm').on('submit', function (e) {
                    e.preventDefault();
                });
                $('#aspnetForm').append(result);
                cfi.AutoCompleteV2("AirlineSNo", "AirlineName", "MarineInsurance_Airline", null, "contains");
                GetMarineInsuranceRecord();
                EditGrid();

            }
        });

    }



});


function CreateGrid(obj) {

    var objid = $(obj).attr('id');
    var dbtableName = "MarineInsuranceSlab";
    $("#tbl" + dbtableName).appendGrid({
        V2: true,
        tableID: "tbl" + dbtableName,
        contentEditable: true,
        masterTableSNo: 0,
        currentPage: 1, itemsPerPage: 50, model: BindWhereConditionForResponse(), sort: "",
        isGetRecord: true,
        servicePath: "/Services/Shipment/MarineInsuranceService.svc",

        // getRecordServiceMethod:  "GetMarineInsuranceResponseRecord" ,
        createUpdateServiceMethod: 'createupdate' + dbtableName,
        //  deleteServiceMethod: "DeleteMarineInsuranceSlab",
        caption: " Marine Insurance",
        initRows: 1,
        columns: [
            { name: "SNo", type: "hidden" },
             { name: "CommoditySno", display: "Commodity Code", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "" }, ctrlCss: { width: "100px", height: "25px" }, isRequired: true, AutoCompleteName: 'Marine_Commodity', filterField: 'CommodityCode,CommodityDescription' },

                                    { name: "InsuranceBasedOn", display: "Insurance BasedOn", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "", onSelect: "return CheckBasedON(this.id)" }, ctrlCss: { width: "100px", height: "25px" }, isRequired: true, AutoCompleteName: 'MarineInsurance_BasedOn', filterField: 'Name' },


               {
                   name: "InsuranceValue", display: "Value", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 10, controltype: 'decimal2', onblur: "return CheckValue(this.id);" }, isRequired: true, title: "Enter Value"
               },
        { name: "CurrencyCode", display: "Currency", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "" }, ctrlCss: { width: "100px", height: "25px" }, isRequired: true, AutoCompleteName: 'CTM_CurrencyCode', filterField: 'CurrencyCode' },
                  { name: "ValidFrom", display: "Valid From", type: "text", ctrlCss: { width: '77px', height: '20px' }, ctrlAttr: { controltype: "datetype", onChange: "return Checkstart(this.id);" }, isRequired: true },
                   { name: "ValidTo", display: "Valid To", type: "text", ctrlCss: { width: '77px', height: '20px' }, ctrlAttr: { controltype: "datetype", onChange: "return CheckEnd(this.id);" }, isRequired: true },
                    { name: (PageType == "NEW" ? "Active" : "IsActive"), display: "Active", type: "radiolist", ctrlOptions: { 0: "No", 1: "Yes" }, selectedIndex: 1 },
                { name: "AirlineSno", type: "hidden" }

        ]
        ,

        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {

            $("[id^='tblMarineInsuranceSlab_AirlineSno_']").val($('#AirlineSNo').val());
            BindWhereConditionForResponse();

        },
        beforeRowRemove: function (caller, rowIndex) {

        },
        afterRowRemoved: function (caller, rowIndex) {



        },
        dataLoaded: function (caller, parentRowIndex, addedRowIndex) {

        },
        isPaging: true,


    });



}

function EditGrid(obj) {
    $('#Text_AirlineSNo').attr("disabled", "disabled");
    var objid = $(obj).attr('id');
    var dbtableName = "MarineInsuranceSlab";
    $("#tbl" + dbtableName).appendGrid({
        V2: true,
        tableID: "tbl" + dbtableName,
        contentEditable: true,
        masterTableSNo: 1,
        isExtraPaging: true,
        currentPage: 1, itemsPerPage: 50, whereCondition: null, model: BindWhereConditionForResponse(), sort: "",
        isGetRecord: true,
        servicePath: "/Services/Shipment/MarineInsuranceService.svc",
        getRecordServiceMethod: "GetMarineInsuranceResponseRecord",
        createUpdateServiceMethod: 'createupdate' + dbtableName,
        // deleteServiceMethod: "deleteInsurance",
        caption: " Marine Insurance",
        initRows: 1,
        columns: [
            { name: "SNo", type: "hidden" },
             { name: "CommoditySno", display: "Commodity Code", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "", disabled: PageType == "EDIT" ? false : true }, ctrlCss: { width: "100px", height: "25px" }, isRequired: true, AutoCompleteName: 'Marine_Commodity', filterField: 'CommodityCode,CommodityDescription' },

                                    { name: "InsuranceBasedOn", display: "Insurance BasedOn", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "", onSelect: "return CheckBasedON(this.id)", disabled: PageType == "EDIT" ? false : true }, ctrlCss: { width: "100px", height: "25px" }, isRequired: true, AutoCompleteName: 'MarineInsurance_BasedOn', filterField: 'Name' },

               {
                   name: "InsuranceValue", display: "Value", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 10, controltype: 'decimal2', disabled: PageType == "EDIT" ? false : true }, isRequired: true, title: "Enter Value"
               },
                { name: "CurrencyCode", display: "Currency", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", value: "", disabled: PageType == "EDIT" ? false : true }, ctrlCss: { width: "100px", height: "25px" }, isRequired: true, AutoCompleteName: 'CTM_CurrencyCode', filterField: 'CurrencyCode' },
                  { name: "ValidFrom", display: "Valid From", type: "text", ctrlCss: { width: '77px', height: '20px' }, ctrlAttr: { controltype: "datetype", onChange: "return Checkstart(this.id);" }, isRequired: true },
                   { name: "ValidTo", display: "Valid To", type: "text", ctrlCss: { width: '77px', height: '20px' }, ctrlAttr: { controltype: "datetype", onChange: "return CheckEnd(this.id);" }, isRequired: true },
                    { name: (PageType == "READ" || PageType == "EDIT" ? "Active" : "IsActive"), display: "Active", type: "radiolist", ctrlOptions: { 0: "No", 1: "Yes" }, selectedIndex: 1 },
                { name: "AirlineSno", type: "hidden" }

        ]
        ,

        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {

            $("[id^='tblMarineInsuranceSlab_AirlineSno_']").val($('#AirlineSNo').val());


        },
        beforeRowRemove: function (caller, rowIndex) {

        },
        afterRowRemoved: function (caller, rowIndex) {



        },
        dataLoaded: function (caller, parentRowIndex, addedRowIndex) {
            $("[id^='tblMarineInsuranceSlab_AirlineSno_']").val($('#AirlineSNo').val());



        },
        isPaging: true
        ,
        hideButtons: { updateAll: PageType == "DUPLICATE" || PageType == "EDIT" ? false : true, remove: PageType == "DUPLICATE" || PageType == "EDIT" ? false : true, removeLast: PageType == "DUPLICATE" || PageType == "EDIT" ? false : true, insert: PageType == "DUPLICATE" || PageType == "EDIT" ? false : true, append: PageType == "DUPLICATE" || PageType == "EDIT" ? false : true, remove: true, removeLast: true }

    });
    var row = $('#tblMarineInsuranceSlab_rowOrder').val().split(',');
    var page = getQueryStringValue("FormAction").toUpperCase();


    if (page == "EDIT") {
        for (var count = 0; count < row.length; count++) {
            if ($('#tblMarineInsuranceSlab_HdnInsuranceBasedOn_' + row[count]).val() == "1")
                $('#tblMarineInsuranceSlab_CurrencyCode_' + row[count]).attr('disabled', true);
            else
                $('#tblMarineInsuranceSlab_CurrencyCode_' + row[count]).attr('disabled', false);
        }
    }
}




var Model = [];
function BindWhereConditionForResponse() {

    Model = {
        Airline: $('#AirlineSNo').val() == "" ? "0" : $('#AirlineSNo').val(),
        SNo:SNo
    }
    return Model;

}


function CommodityInsuranceType(id) {
    try {

        var text = id.context.name.replace("tblMarineInsuranceSlab_CommodityDescription", "tblMarineInsuranceSlab_HdnCommodityDescription");

       // alert("aasas");
        var commoditysno = $('#' + text).val();
        // alert(commoditysno);

        //$.ajax({
        //    type: "GET",
        //    url: "./Services/Master/MarineInsuranceService.svc/GetInsuranceType",
        //    async: false, type: "POST", dataType: "json", cache: false,
        //    data: JSON.stringify({ SNo: $("#CitySNo").val() }),
        //    contentType: "application/json; charset=utf-8",
        //    success: function (response) {
        //        var ResultData = jQuery.parseJSON(response);
        //        var FinalData = ResultData.Table0;
        //        if (FinalData.length > 0) {

        //            var values = FinalData[0].CountrySNo;
        //            var citysno = $('#CitySNo').val();
        //            var citytext = $('#Text_CitySNo').val();
        //            //      alert(values);
        //            $('#tblContactInformation_HdnCountryName_' + id).val(FinalData[0].CountrySNo);
        //            $('#tblContactInformation_CountryName_' + id).val(FinalData[0].CountryName);
        //            $('#tblContactInformation_HdnCityName_' + id).val(citysno);
        //            $('#tblContactInformation_CityName_' + id).val(citytext);

        //            $('#tblContactInformation_CountryName_' + id).attr('disabled', true);
        //            $('#tblContactInformation_CityName_' + id).attr('disabled', true);
        //        }
        //    }
        //});

    }
    catch (exp) { }

}

function GetMarineInsuranceRecord() {
   
    var PageType = getQueryStringValue("FormAction").toUpperCase();
    if (PageType == "READ" || PageType == "EDIT") {
        SNo = getQueryStringValue("RecID").toUpperCase()

    }
    //else {

    //    if (SNo == "") {
    //        ShowMessage('info', 'Need your Kind Attention!', "Please enter AWB NO.", "bottom-left");
    //        return false;
    //    }
    //}



    if (SNo != "") {
        $.ajax({
            url: "Services/Shipment/MarineInsuranceService.svc/GetMarineInsuranceRecord", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ SNo: SNo }),
            success: function (result) {

                var GetSucessResult = JSON.parse(result);

                if (GetSucessResult != undefined) {

                    if (GetSucessResult.Table0.length > 0) {


                        $("#Text_AirlineSNo").data("kendoAutoComplete").setDefaultValue(GetSucessResult.Table0[0].AirlineSNo == "" ? "" : GetSucessResult.Table0[0].AirlineSNo, GetSucessResult.Table0[0].AirlineSNo == "" ? "" : GetSucessResult.Table0[0].Text_AirlineSNo);
                        // $('#AirlineSNo').val(GetSucessResult.Table0[0].AirlineSNo)
                        //  $("#Text_AirlineSNo").text(GetSucessResult.Table0[0].Text_AirlineSNo);


                    }

                }
            }
        });
    }
}


function CheckValue(id) {
    var rowIndex = id.split('_')[2];
    var basedonval = $('#tblMarineInsuranceSlab_HdnInsuranceBasedOn_' + rowIndex).val();
    var val = $('#tblMarineInsuranceSlab_InsuranceValue_' + rowIndex).val();

    if (basedonval == "1" && val > 100) {
        ShowMessage('warning', 'Information!', "Kindly Enter Value in Percentage");
        $('#tblMarineInsuranceSlab_InsuranceValue_' + rowIndex).val('');
        return;
    }
}

function Checkstart(id) {

}

function CheckEnd(id) {

}

function fnCheckAirline() {
    var AirlineSNo = $("#Text_AirlineSNo").data("kendoAutoComplete").value() == "" ? 0 : $("#Text_AirlineSNo").data("kendoAutoComplete").key()
    if (AirlineSNo > 0)
        $("#tblMarineInsuranceSlab_btnAppendRow").css("display", "block");
    else
        $("#tblMarineInsuranceSlab_btnAppendRow").css("display", "none");
}


function CheckBasedON(id) {

    var textname = id.context.name.replace("tblMarineInsuranceSlab_InsuranceBasedOn", "tblMarineInsuranceSlab_HdnInsuranceBasedOn");
    var rowIndex = id.context.name.replace("tblMarineInsuranceSlab_InsuranceBasedOn", "tblMarineInsuranceSlab_HdnInsuranceBasedOn").split('_')[2];

    var currencycode = textname.replace("tblMarineInsuranceSlab_HdnInsuranceBasedOn", "tblMarineInsuranceSlab_CurrencyCode");

    if ($('#' + textname).val() == "1") {
        $('#' + currencycode).attr("disabled", true);
        $('#' + currencycode).attr('required', false);
        $('#tblMarineInsuranceSlab_InsuranceValue_' + rowIndex).after("<span id='spnpercent'>%</span>");
    }
    else {
        $('#' + currencycode).attr("disabled", false);
        $('#' + currencycode).attr('required', true);
        $('#tblMarineInsuranceSlab_InsuranceValue_' + rowIndex).next('span').remove()
    }

}