var pageType = $('#hdnPageType').val();
$(function ()
{
    cfi.AutoComplete("AirportSNo", "AirportCode,AirportName", "Airport", "SNo", "AirportName", ["AirportCode", "AirportName"], null, "contains", null, null, null, null, OnSelectAirport);
    cfi.AutoComplete("AccountSNo", "Name,SNo", "Account", "SNo", "Name", ["Name"], null, "contains");
    cfi.AutoComplete("CurrencySNo", "CurrencyCode,CurrencyName", "Currency", "SNo", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
    cfi.AutoComplete("ProductSNo", "ProductName,SNo", "Product", "SNo", "ProductName", ["ProductName"], null, "contains");
    cfi.AutoComplete("FlightTypeSNo", "FlightTypeName,SNo", "FlightType", "SNo", "FlightTypeName", ["FlightTypeName"], null, "contains");
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT")
    {
       OnPageLoadAirport();
    }
    var tabStrip = $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");
});
var CitySno = "";
function OnSelectAirport(e) {
    var Data = this.dataItem(e.item.index());
    $("#AccountSNo").val('');
    $("#Text_AccountSNo").val('');
    $("#Name").val(''); 

     $.ajax({
        type: "POST",
        url: "./Services/Master/AccountTargetService.svc/GetAccount?recid=" + Data.Key,
        data: { id: 1 },
        dataType: "json",
        success: function (response) {
            var SNo = response.Data[0];
            var Name = response.Data[1];
            CitySno = response.Data[2];
            $("#AccountSNo").val(SNo);
            $("#Text_AccountSNo").val(Name);
            $("#Name").val(Name);
            
        }
    });
}


function OnPageLoadAirport()
{
    
        var Data = $("#AccountSNo").val();
        $.ajax({
            type: "POST",
            url: "./Services/Master/AccountTargetService.svc/GetAccount?recid=" + Data,
            data: { id: 1 },
            dataType: "json",
            success: function (response)
            {
               
                CitySno = response.Data[2];
            }
        });
    
}

function ExtraCondition(textId) {
    var filterEmbargo = cfi.getFilter("AND");
    if (textId == "Text_AccountSNo") {
        try {
            cfi.setFilter(filterEmbargo, "CitySNo", "eq", CitySno)
            var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
}
//Open For To make A Grid for AccountTargetCommission 
$('#liAccountTargetCommision').click(function () {
    CreateAccountTargetCommision();
});
function CreateAccountTargetCommision() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowMessage('info', 'Need your Kind Attention!', "Target Commission can be added in Edit/Update mode only.");
        return;
    }
    else {
        var dbtableName = "AccountTargetCommTrans";
        $('#tbl' + dbtableName).appendGrid({
            tableID: 'tbl' + dbtableName,
            contentEditable: pageType == 'EDIT',
            tableColume: 'SNo,AccountTargetSNo,CommisionType,CommisionValue,TargetStartValue,TargetEndValue,ValidFrom,ValidTo',
            masterTableSNo: $('#hdnAccountTargetSNo').val(),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Master/AccountTargetService.svc',
            getRecordServiceMethod: 'GetAccountTargetCommTransRecord',
            createUpdateServiceMethod: 'CreateUpdate' + dbtableName,
            isGetRecord: true,
            deleteServiceMethod: 'Delete' + dbtableName,
            caption: 'Target Commision',
            initRows: 1,
            columns: [
                    { name: 'SNo', type: 'hidden', value: 0 },
                     { name: 'AccountTargetSNo', type: 'hidden', value: $('#hdnAccountTargetSNo').val() },
                     {
                         name: pageType == 'EDIT' ? 'CommisionType' : 'CommisionTypeAccount', display: 'Commision Type', type: 'select', ctrlOptions: { 1: 'Percentage', 2: 'Kg', 3: 'Revenue' }, onChange: function (evt, rowIndex) { }, isRequired: true
                     },
                    {
                        name: 'CommisionValue', display: 'Commision Amount', type: 'text', value: 0, ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 10,  onblur: "return CheckComissionRange(this.id);" }, onChange: function (evt, rowIndex) { }
                    },
                      {
                          name: 'TargetStartValue', display: 'Start Value', type: 'text', ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, }, isRequired: true, value: 0
                      },
                     {
                         name: 'TargetEndValue', display: 'End Value', type: 'text', ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { controltype: 'decimal2', maxlength: 10, onblur: "return CheckRageofTargetAccountCommision(this.id);" }, isRequired: true, value: 0
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
    var dbtableName = "AccountTargetCommTrans";
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
function CheckComissionRange(rowIndex) {
    var dbtableName = "AccountTargetCommTrans";
    var commisonvalue = $('#tbl' + dbtableName + '_CommisionValue_' + eval(rowIndex.substring(eval(rowIndex.length)-1))).val();
    var commisontype = $('#tbl' + dbtableName + '_CommisionType_' + eval(rowIndex.substring(eval(rowIndex.length) - 1))).val();
    if (commisontype == '1')
    {
        if (commisonvalue > 100) {
            //alert('Value must be less than 100.');
            $("#tblAccountTargetCommTrans_btnAppendRow").hide();
            ShowMessage('info', 'Need your Kind Attention!', "Value must be less than 100.");
            $('#tbl' + dbtableName + '_CommisionValue_' + eval(rowIndex.substring(eval(rowIndex.length) - 1))).val('0.00');
            //  $(rowIndex).val('0.00');
        }
        else {
            $("#tblAccountTargetCommTrans_btnAppendRow").show();
        }
    }
  //  alert('End Value must be greater than Start Value.');
}
function CheckRageofTargetAccountCommision(rowIndex) {
    var dbtableName = "AccountTargetCommTrans";
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
//Close For To make A Grid for AccountTargetCommission 
//Open To make A Grid for AccountTargetPenalty
$('#liAccountTargetPenalty').click(function () {
    CreateAccountTargetPenalty();
});
function CreateAccountTargetPenalty() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowMessage('info', 'Need your Kind Attention!', "Target Penalty can be added in Edit/Update mode only.");
        return;
    }
    else {
        var dbtableTargetPenalty = "AccountTargetPenaltyTrans";
        $('#tbl' + dbtableTargetPenalty).appendGrid({
            tableID: 'tbl' + dbtableTargetPenalty,
            contentEditable: pageType == 'EDIT',
            tableColume: 'SNo,AccountTargetSNo,PenaltyType,PenaltyValue,TargetStartValue,TargetEndValue,ValidTo,ValidFrom',
            masterTableSNo: $('#hdnAccountTargetPenaltySNo').val(),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Master/AccountTargetService.svc',
            getRecordServiceMethod: 'GetAccountTargetPenaltyTransRecord',
            createUpdateServiceMethod: 'CreateUpdate' + dbtableTargetPenalty,
            deleteServiceMethod: 'Delete' + dbtableTargetPenalty,
            caption: 'Target Penalty',
            initRows: 1,
            isGetRecord: true,
            columns: [{ name: 'SNo', type: 'hidden', value: 0 },
                     { name: 'AccountTargetSNo', type: 'hidden', value: $('#hdnAccountTargetPenaltySNo').val() },
                     {
                         name: pageType == 'EDIT' ? 'PenaltyType' : 'PenaltyAccountType', display: 'Penalty Type', type: 'select', ctrlOptions: { 1: 'Percentage', 2: 'Kg', 3: 'Reveneue' }, onChange: function (evt, rowIndex) { }, isRequired: false
                     },
                     {
                         name: 'PenaltyValue', display: 'Penalty Value', type: 'text', isRequired: true, value: 0, ctrlCss: { width: '60px', height: '20px' }, ctrlAttr: { controltype: 'number', maxlength: 10, onblur: "return CheckPenaltyRange(this.id);" }, onChange: function (evt, rowIndex) { }
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
    var dbtableName = "AccountTargetPenaltyTrans";
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
    var dbtableName = "AccountTargetPenaltyTrans";
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
function CheckPenaltyRange(rowIndex) {
    var dbtableName = "AccountTargetPenaltyTrans";
    var commisonvalue = $('#tbl' + dbtableName + '_PenaltyValue_' + eval(rowIndex.substring(eval(rowIndex.length) - 1))).val();
    var commisontype = $('#tbl' + dbtableName + '_PenaltyType_' + eval(rowIndex.substring(eval(rowIndex.length) - 1))).val();
    if (commisontype == '1') {
        if (commisonvalue > 100) {
            //alert('Value must be less than 100.');
            $("#tblAccountTargetPenaltyTrans_btnAppendRow").hide();
            ShowMessage('info', 'Need your Kind Attention!', "Value must be less than 100.");
            $('#tbl' + dbtableName + '_PenaltyValue_' + eval(rowIndex.substring(eval(rowIndex.length) - 1))).val('0.00');
            //  $(rowIndex).val('0.00');
        }
        else {
            $("#tblAccountTargetPenaltyTrans_btnAppendRow").show();
        }
    }
    //  alert('End Value must be greater than Start Value.');
}