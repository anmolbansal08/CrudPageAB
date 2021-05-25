var pageType = $('#hdnPageType').val();
$(document).ready(function () {
    cfi.AutoComplete("AirPortSNo", "AirportCode", "vwAirport", "SNo", "AirportCode", null, null, "contains");
    cfi.AutoComplete("OfficeSNo", "Name", "vOfficeAirPort", "SNo", "Name", null, null, "contains");
    cfi.AutoComplete("ProductSNo", "ProductName,ProductName", "vwProduct", "SNo", "ProductName", null, null, "contains");
    cfi.AutoComplete("CurrencySNo", "CurrencyCode,CurrencyCode", "vwCurrency", "SNo", "CurrencyCode", null, null, "contains");
    cfi.AutoComplete("FlightTypeSNo", "FlightTypename", "vwFlightType", "SNo", "FlightTypename", null, null, "contains");

    //if (pageType != "NEW") {
        var tabStrip = $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");
    //}
       
});


function ExtraCondition(textId) {
    var filterOffice = cfi.getFilter("AND");
    if (textId == "Text_OfficeSNo") {
        try {
            cfi.setFilter(filterOffice, "AirportSNo", "eq", $("#Text_AirportSNo").data("kendoAutoComplete").key())
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterOffice]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
}

$('#liOfficeTargetCommision').click(function () {
    CreateofficeTargetCommision();
});



$("input[id*=ValidTo]").change(function (e) {
    var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    var dto = new Date(Date.parse(k));
    var validFrom = $(this).attr("id").replace("To", "From");
    k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    var dfrom = new Date(Date.parse(k));
    if (dfrom > dto)
        $(this).val("");
});
$("input[id*=ValidFrom]").change(function (e) {
    var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    var dfrom = new Date(Date.parse(k));
    var validFrom = $(this).attr("id").replace("From", "To");
    k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    var dto = new Date(Date.parse(k));
    if (dfrom > dto)
        $(this).val("");
});

$('#liOfficeTargetPenalty').click(function () {
    CreateofficeTargetPenalty();
});


function SetDateRangeValue(containerId) {
    if (containerId == undefined) {
        $("input[controltype='datetype']").each(function () {
            var cntrlId = $(this).attr("id");
            var start = new Date();
            var end = $("#" + cntrlId).data("kendoDatePicker");
            end.min(start);
        });
    }
    else {
        $(containerId).find("input[controltype='datetype']").each(function () {
            var cntrlId = $(this).attr("id");
            var start = new Date();
            var end = $("#" + cntrlId).data("kendoDatePicker");
            end.min(start);
        });
    }
}

function CreateofficeTargetCommision() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowMessage('info', 'Need your Kind Attention!', "Target Commission can be added in Edit/Update mode only.");
        return;
    }
    else {
        var dbtableName = "OfficeTargetCommTrans";
        $('#tbl' + dbtableName).appendGrid({
            tableID: 'tbl' + dbtableName,
            contentEditable: pageType == 'EDIT',
            tableColume: 'SNo,OfficeTargetSNo,CommisionType,CommisionValue,TargetStartValue,TargetEndValue,ValidFrom,ValidTo',
            masterTableSNo: $('#hdnofficeTargetSNo').val(),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Master/OfficeTargetService.svc',
            getRecordServiceMethod: 'GetOfficeTargetCommTransRecord',
            createUpdateServiceMethod: 'CreateUpdate' + dbtableName,
            isGetRecord: true,
            deleteServiceMethod: 'Delete' + dbtableName,
            caption: 'Target Commision',
            initRows: 1,

            columns: [{ name: 'SNo', type: 'hidden', value: 0 },
                     { name: 'OfficeTargetSNo', type: 'hidden', value: $('#hdnofficeTargetSNo').val() },
                     {
                         name: pageType == 'EDIT' ? 'CommisionType' : 'CommisionTypeOffice', display: 'Commision Type', type: 'select', ctrlOptions: { 1: 'Percentage', 2: 'Kg', 3: 'Revenue' }, onChange: function (evt, rowIndex) { }, isRequired: true
                     },

                    {
                        name: 'CommisionValue', display: 'Commision Amount', type: 'text', value: 0, ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, }, onChange: function (evt, rowIndex) { }
                    },

                      {
                          name: 'TargetStartValue', display: 'Start Value', type: 'text', ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, }, isRequired: true, value: 0
                      },

                     {
                         name: 'TargetEndValue', display: 'End Value', type: 'text', ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { Controltype: 'decimal2', maxlength: 10, onblur: "return CheckRageofTargetOfficeCommision(this.id);" }, isRequired: true, value: 0
                     },
                      {
                          name: 'ValidFrom', display: 'Valid From', type: 'text', ctrlAttr: { controltype: 'datetype' }, ctrlCss: { width: '80px', height: '20px' }, isRequired: true, onChange: function (evt, rowIndex) {
                              CheckDateRangeTargetCommTrans(rowIndex)
                          }
                      },
                     {
                         name: 'ValidTo', display: 'Valid To', type: 'text', isRequired: true, ctrlAttr: { controltype: 'datetype' }, ctrlCss: { width: '80px', height: '20px' }
                     }

            ],

            isPaging: true,

        });
        
    }
}

function CheckDateRangeTargetCommTrans(rowIndex) {

    var dbtableName = "OfficeTargetCommTrans";
    var ValidFrom = $('#tbl' + dbtableName + '_ValidFrom_' + eval(eval(rowIndex) + 1)).val();
    var ValidTo = $('#tbl' + dbtableName + '_ValidTo_' + eval(eval(rowIndex) + 1)).val();
    $("input[id*=ValidTo]").change(function (e) {
        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("To", "From");
        k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        if (dfrom > dto)
            $(this).val("");
    });
    $("input[id*=ValidFrom]").change(function (e) {
        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("From", "To");
        k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        if (dfrom > dto)
            $(this).val("");
    });
}

function CheckRageofTargetOfficeCommision(rowIndex) {
    var dbtableName = "OfficeTargetCommTrans";
    var startvalue = $('#tbl' + dbtableName + '_TargetStartValue_' + eval(rowIndex.substring(eval(rowIndex.length) - 1))).val();
    var endValue = $('#tbl' + dbtableName + '_TargetEndValue_' + eval(rowIndex.substring(eval(rowIndex.length) - 1))).val();
    if (eval(startvalue) > eval(endValue)) {
        alert('End Value must be greater than Start Value.');
        $('#tbl' + dbtableName + '_TargetEndValue_' + eval(rowIndex.substring(eval(rowIndex.length) - 1))).css({
            "border": "1px solid red",
            "background": "#FFCECE"
        });
        return true;
    }
    else {
        $('#tbl' + dbtableName + '_TargetEndValue_' + eval(rowIndex.substring(eval(rowIndex.length) - 1))).css({
            "border": "",
            "background": ""
        });
        return true;
    }

}




function CreateofficeTargetPenalty() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowMessage('info', 'Need your Kind Attention!', "Target Penalty can be added in Edit/Update mode only.");
        return;
    }
    else {
        var dbtableTargetPenalty = "OfficeTargetPenaltyTrans";
        $('#tbl' + dbtableTargetPenalty).appendGrid({
            tableID: 'tbl' + dbtableTargetPenalty,
            contentEditable: pageType == 'EDIT',
            tableColume: 'SNo,OfficeTargetSNo,PenaltyType,PenaltyValue,TargetStartValue,TargetEndValue,ValidTo,ValidFrom',
            masterTableSNo: $('#hdnofficeTargetPenaltySNo').val(),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Master/OfficeTargetService.svc',
            getRecordServiceMethod: 'GetOfficeTargetPenaltyTransRecord',
            createUpdateServiceMethod: 'CreateUpdate' + dbtableTargetPenalty,
            deleteServiceMethod: 'Delete' + dbtableTargetPenalty,
            caption: 'Target Penalty',
            initRows: 1,
            isGetRecord: true,
            columns: [{ name: 'SNo', type: 'hidden', value: 0 },
                     { name: 'OfficeTargetSNo', type: 'hidden', value: $('#hdnofficeTargetPenaltySNo').val() },
                     {
                         name: pageType == 'EDIT' ? 'PenaltyType' : 'PenaltyOfficeType', display: 'Penalty Type', type: 'select', ctrlOptions: { 1: 'Percentage', 2: 'Kg', 3: 'Reveneue' }, onChange: function (evt, rowIndex) { }, isRequired: false
                     },
                     {
                         name: 'PenaltyValue', display: 'Penalty Value', type: 'text', isRequired: true, value: 0, ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, }, onChange: function (evt, rowIndex) { }
                     },


                      {
                          name: 'TargetStartValue', display: 'Start Value', type: 'text', ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10 }, isRequired: true, value: 0, onChange: function (evt, rowIndex) {

                          }
                      },

                     {
                         name: 'TargetEndValue', display: 'End Value', type: 'text', ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', onblur: "return CheckRageofTargetPenalty(this.id);" }, isRequired: true, value: 0, onChange: function (evt, rowIndex) {

                         }
                     },

                     {
                         name: 'ValidFrom', display: 'Valid From', type: 'text', ctrlAttr: { controltype: 'datetype' }, ctrlCss: { width: '80px', height: '20px' }, isRequired: true, onChange: function (evt, rowIndex) { CheckDateRangeTargetPenalty(rowIndex) }
                     },
                     {
                         name: 'ValidTo', display: 'Valid To', type: 'text', isRequired: true, ctrlAttr: { controltype: 'datetype' }, ctrlCss: { width: '80px', height: '20px' }
                     }


            ],

            isPaging: true,
        });
        
    }
}

function CheckRageofTargetPenalty(rowIndex) {
    var dbtableName = "OfficeTargetPenaltyTrans";
    var startvalue = $('#tbl' + dbtableName + '_TargetStartValue_' + eval(rowIndex.substring(eval(rowIndex.length) - 1))).val();
    var endValue = $('#tbl' + dbtableName + '_TargetEndValue_' + eval(rowIndex.substring(eval(rowIndex.length) - 1))).val();
    if (eval(startvalue) > eval(endValue)) {
        alert('End Value must be greater than Start Value.');
        $('#tbl' + dbtableName + '_TargetEndValue_' + eval(rowIndex.substring(eval(rowIndex.length) - 1))).css({
            "border": "1px solid red",
            "background": "#FFCECE"
        });
        return false;
    }
    else {
        $('#tbl' + dbtableName + '_TargetEndValue_' + eval(rowIndex.substring(eval(rowIndex.length) - 1))).css({
            "border": "",
            "background": ""
        });
        return true;
    }

}

function CheckDateRangeTargetPenalty(rowIndex) {

    var dbtableName = "OfficeTargetPenaltyTrans";
    var ValidFrom = $('#tbl' + dbtableName + '_ValidFrom_' + eval(eval(rowIndex) + 1)).val();
    var ValidTo = $('#tbl' + dbtableName + '_ValidTo_' + eval(eval(rowIndex) + 1)).val();
    $("input[id*=ValidTo]").change(function (e) {
        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("To", "From");
        k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        if (dfrom > dto)
            $(this).val("");
    });
    $("input[id*=ValidFrom]").change(function (e) {
        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("From", "To");
        k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        if (dfrom > dto)
            $(this).val("");
    });
}

