//cfi.AutoComplete("UserSNo", "UserName", "Users", "SNo", "UserName", null, null, "contains", null, null, null, null, UserDescription);
$(document).ready(function () {
  cfi.ValidateForm();
    var check = "";
    var PenaltyTypeKey = [{ Key: "0", Text: "No Show" }, { Key: "1", Text: "Void" }, { Key: "2", Text: "Late Acceptance" }, { Key: "3", Text: "Cancellation" }, { Key: "4", Text: "BKD Vs EXEC" }, { Key: "5", Text: "EXEC Vs RCS" }]
    cfi.AutoCompleteByDataSource("PenaltyType", PenaltyTypeKey, showall);
    var LocationType = [{ Key: "0", Text: "CITY" }, { Key: "1", Text: "COUNTRY" }];
    var ApplicableOnType = [{ Key: "0", Text: "Chargeable Weight" }, { Key: "1", Text: "Grosss Weight" }];
    var ChargeBaseKey = [{ Key: "0", Text: "Percentage" }, { Key: "1", Text: "Fixed" }, { Key: "2", Text: "PerKG" }]
    cfi.AutoComplete("AirlineSNo", "AirlineCode,AirlineName", "Airline", "SNo", "AirlineName", ["AirlineCode", "AirlineName"], null, "contains");
   // cfi.AutoComplete("AirlineSNo", "CarrierCode,AirlineName", "Airline", "SNo", "CarrierCode,AirlineName", ["CarrierCode,AirlineName"], null);
    cfi.AutoComplete("ProductSNo", "ProductName", "Product", "SNo", "ProductName", ["ProductName"]);
    cfi.AutoComplete("CountrySNo", "CountryCode,CountryName", "Country", "SNo", "CountryCode", ["CountryCode", "CountryName"], null, "contains", null, null, null, null, clearCity, null, null, true);
   // cfi.AutoComplete("CitySNo", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], clearAgent, "contains"  );
    cfi.AutoComplete("CitySNo", "CityCode,CityName", "City", "SNo", "CityName", ["CityCode", "CityName"], null, "contains", null, null, null, null, clearAgent, null, null, true);
   
    cfi.AutoComplete("SHCSNo", "Code", "SPHC", "SNo", "Code", ["Code"], null, "contains", ",", null, null, null, null, true);
    cfi.AutoComplete("AccountSNo", "Name", "Account", "SNo", "Name", ["Name"], checkcity, "contains", ",", null, null, null, null, true);

    cfi.BindMultiValue("SHCSNo", $("#Text_SHCSNo").val(), $("#SHCSNo").val());
    cfi.BindMultiValue("AccountSNo", $("#Text_AccountSNo").val(), $("#AccountSNo").val());

    // for date
  //  $("#ValidFrom").data("kendoDatePicker").value("");
    //  $("#ValidTo").data("kendoDatePicker").value("");
    //===========Added by Arman Ali
    $("#ValidFrom").attr('readOnly', 'true');
    $("#ValidTo").attr('readOnly', 'true');
// end
    var todaydate = new Date();
    var validfromdate = $("#ValidFrom").data("kendoDatePicker");
    validfromdate.min(todaydate);
    var validTodate = $("#ValidTo").data("kendoDatePicker");
    validTodate.min(todaydate);

    $("input[id^=ValidTo]").change(function (e) {
        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("To", "From");
        k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        if (dfrom > dto)
            {ShowMessage('warning', 'Warning -Penalty Parameters!', "Valid To Date Should greater or equal To Valid To date");
            $(this).val("");}
        
    });

    $("input[id^=ValidFrom]").change(function (e) {
        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("From", "To");
        k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        if (dfrom > dto) {
            ShowMessage('warning', 'Warning -Penalty Parameters!', "Valid From Date Shouls be lesser or Equal To Valid To date");
            $(this).val("");
        }
        

    });

   
});
function showall()
{
    $("[id*='tblPenaltyParametersSlab_BasedOn_'] option[value]").show();
    $("[id*='tblPenaltyParametersSlab_ChargeBasis_'] option[value]").show();
    $("[id*='tblPenaltyParametersSlab_AppliedOn_'] option[value]").show();
    $("[id*='tblPenaltyParametersSlab_BasedOn_']").val(0);
    $("[id*='tblPenaltyParametersSlab_ChargeBasis_']").val(0);
    $("[id*='tblPenaltyParametersSlab_AppliedOn_'] ").val(0);
    if ($("#PenaltyType").val() == '0' || $("#PenaltyType").val() == '1') {
        $("[id*='tblPenaltyParametersSlab_BasedOn_'] option[value='1']").hide();
        $("[id*='tblPenaltyParametersSlab_BasedOn_'] option[value='2']").hide();
        $("[id*='tblPenaltyParametersSlab_ChargeBasis_'] option[value='3']").hide();
        $("[id*='tblPenaltyParametersSlab_AppliedOn_'] option[value='1']").hide();
        $("[id*='tblPenaltyParametersSlab_AppliedOn_'] option[value='2']").hide();
    }
    if ($("#PenaltyType").val() == '2' || $("#PenaltyType").val() == '3') {
        $("[id*='tblPenaltyParametersSlab_BasedOn_'] option[value='1']").hide();
        $("[id*='tblPenaltyParametersSlab_BasedOn_'] option[value='2']").hide();
        $("[id*='tblPenaltyParametersSlab_ChargeBasis_'] option[value='3']").hide();

    }
    if ($("#PenaltyType").val() == '4' || $("#PenaltyType").val() == '5') {
        $("[id*='tblPenaltyParametersSlab_BasedOn_'] option[value='3']").hide();
        $("[id*='tblPenaltyParametersSlab_AppliedOn_'] option[value='3']").hide();
        $("[id*='tblPenaltyParametersSlab_AppliedOn_'] option[value='4']").hide();
    }
    if ($("#PenaltyType").val() == '2') {
        $("[id*='tblPenaltyParametersSlab_AppliedOn_'] option[value='3']").hide();
        $("[id*='tblPenaltyParametersSlab_AppliedOn_'] option[value='4']").hide();
    }

}

function checkcity()
{
    if ($('#CitySNo').val() == "") {
        alert('Select City first');
    }
}

CreatePenaltyParametersSlabGrid();

//$("#tblPenaltyParametersSlab_btnRemoveLast").unbind("click");
//$("#tblPenaltyParametersSlab_btnRemoveLast").bind("click", deleteRecord);
function CheckValidation(obj) {
    var startValue = 0;
    var endValue = 0;

    //   alert(obj);
    if (obj.indexOf("Start") >= 0) {
        startValue = $("#" + obj).val();
        endValue = $("#" + obj.replace("Start", "End")).val();
        previousEndValue = $("#" + obj.replace("Start", "End").replace(obj.split("_")[2], obj.split("_")[2] - 1)).val();
    }
    else {
        endValue = $("#" + obj).val();
        startValue = $("#" + obj.replace("End", "Start")).val();
    }
    // alert(obj );
    if (parseFloat(startValue) > parseFloat(endValue)) {
        alert("Start Range can not be greater than End Range.");
        $("#" + obj).val("");
        $("#" + obj).attr("required", "required");
    }
}

function checkslab() {


}

if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "DELETE") {
    for (var count = 1; count <= $('#tblPenaltyParametersSlab_rowOrder').val().split(',').length; count++) {
        $('#tblPenaltyParametersSlab_StartRange_' + count).attr("disabled", true);
        $('#tblPenaltyParametersSlab_EndRange_' + count).attr("disabled", true);
        $('#tblPenaltyParametersSlab_BasedOn_' + count).attr("disabled", true);
        $('#tblPenaltyParametersSlab_PenaltyCharge_' + count).attr("disabled", true);
        $('#tblPenaltyParametersSlab_ChargeBasis_' + count).attr("disabled", true);
        $('#tblPenaltyParametersSlab_AppliedOn_' + count).attr("disabled", true);
    }
}
if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
    var RowCount = $('#tblPenaltyParametersSlab_rowOrder').val().split(',').length
    for (var count = 1; count <= $('#tblPenaltyParametersSlab_rowOrder').val().split(',').length; count++) {
        $('#tblPenaltyParametersSlab_StartRange_' + count).attr("disabled", true);
        $('#tblPenaltyParametersSlab_EndRange_' + count).attr("disabled", true);
    }
    $('#tblPenaltyParametersSlab_EndRange_' + RowCount).attr("disabled", false);
    if ($('#tblPenaltyParametersSlab_ChargeBasis_' + RowCount).val() == '3') {
        $('#tblPenaltyParametersSlab_AppliedOn_' + RowCount).attr("disabled", true)
    }
    else {
        $('#tblPenaltyParametersSlab_AppliedOn_' + RowCount).attr('disabled', false)
    }


}
$('input[type="submit"][name="operation"]]').click(function () {



 

    var array = $('#tblPenaltyParametersSlab_rowOrder').val().split(',')
    for (var count = 0; count < $('#tblPenaltyParametersSlab_rowOrder').val().split(',').length; count++) {
        $('#tblPenaltyParametersSlab_StartRange_' + array[count]).attr("disabled", false);
        $('#tblPenaltyParametersSlab_EndRange_' + array[count]).attr("disabled", false);
    }
    if ($('#tblPenaltyParametersSlab_rowOrder').val() == "") {
        ShowMessage('warning', 'Warning -Penalty Parameters!', "Add Slab");
        return false;
    }


    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {

        AuditLogSaveNewValue("divbody");
    }

    //if ($('#CitySNo').val() != "" && $('#AccountSNo').val() == "")
    //{
    //    ShowMessage('warning', 'Warning -Penalty Parameters!', "Select Agent for Selected City ");
    //    return false;
    //}
});
function ExtraCondition(textId) {
    if (textId.indexOf("Text_AirlineSNo") >= 0) {

        var filter1 = cfi.getFilter("AND");
        cfi.setFilter(filter1, "IsActive", "eq", "1");
        cfi.setFilter(filter1, "IsInterline", "eq", "0");
        filterAirlineSNo = cfi.autoCompleteFilter(filter1);
        return filterAirlineSNo;
    }
    var filter1 = cfi.getFilter("AND");
    if (textId.indexOf("Text_CitySNo") >= 0) {

        cfi.setFilter(filter1, "CountrySNo", "eq", $('#CountrySNo').val());
        //  cfi.setFilter(filter1, "IsInterline", "eq", "0");
        filterCitySNo = cfi.autoCompleteFilter([filter1]);
        return filterCitySNo;
    }
  //  var filter2 = cfi.getFilter("AND");
    //if (textId.indexOf("Text_AccountSNo") >= 0) {
    //    cfi.setFilter(filter2, "CitySNo", "eq", "20");
    //    filterAccountSNo = cfi.autoCompleteFilter([filter2]);
    //    return filterAccountSNo;
    //}
    if (textId.indexOf("Text_AccountSNo") >= 0) {
        var filter2 = cfi.getFilter("AND");
        cfi.setFilter(filter2, "CitySNo", "eq", $('#CitySNo').val());
        //  cfi.setFilter(filter1, "IsInterline", "eq", "0");
        filterCitySNo = cfi.autoCompleteFilter([filter2]);
        return filterCitySNo;
    }
};
var strData = [];
var pageType = $('#hdnPageType').val();
var datatblPenaltyParametersSlab_BasedOn_1 = [{ 0: "Percentage", 1: "Fixed", 2: "Per KG" }]
function CreatePenaltyParametersSlabGrid() {
    var dbtableName = "PenaltyParametersSlab";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: true,
        masterTableSNo: $("#hdnPenaltyParametersSlabSNo").val(),
        currentPage: 1, itemsPerPage: 50, whereCondition: null, sort: "",
        isGetRecord: true,
        servicePath: "./Services/Master/PenaltyParametersService.svc",
        getRecordServiceMethod: "GetPenaltyParametersSlabRecord",
        deleteServiceMethod: null,
        caption: "Tolerance ",
        initRows: 1,
        columns: [
            { name: "Sno", type: "hidden" },
                { name: "StartRange", display: "Start Range", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "default", onblur: "return CheckNumeric(this.id);" }, isRequired: true },
                 { name: "EndRange", display: "End Range", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "default", onblur: "return CheckNumeric(this.id);" }, isRequired: true },
                       { name: "BasedOn", display: "Based On", type: "select", ctrlAttr: { maxlength: 100, onClick: "return CheckBasedOn(this.id);", onChange: "return CheckBasedOn(this.id);" }, ctrlOptions: { 0: "{Choose}", 1: "Weight", 2: "Weight Percent", 3: "Time In Min (ETD)" }, ctrlCss: { width: "120px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },
                     { name: "PenaltyCharge", display: "Penalty Charge", type: "text", ctrlCss: { width: '110px' }, ctrlAttr: { maxlength: 15, controltype: "number", onblur: "return CheckZero(this.id);" }, isRequired: true },
                           { name: "ChargeBasis", display: "Charge Basis", type: "select", ctrlAttr: { maxlength: 150, onClick: "return CheckChargeBasic(this.id);", onChange: "return CheckChargeBasic(this.id);" }, ctrlOptions: { 0: "{Choose}", 1: "Percentage", 2: "Fixed", 3: "Per KG" }, ctrlCss: { width: "120px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },
                             { name: "AppliedOn", display: "Applied On", type: "select", ctrlAttr: { maxlength: 150, onClick: "return CheckAppliedOn(this.id);", onChange: "return CheckAppliedOn(this.id);" }, ctrlOptions: { 0: "{Choose}", 1: "Revenue", 2: "Freight", 3: "Due Carrier", 4: "AWC" }, ctrlCss: { width: "120px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },
                             //  { name: 'StockIn', display: 'Stock In', type: 'text', ctrlAttr: { maxlength: 10 }, ctrlCss: { width: '80px' } },

        ]
        ,

        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
           // CheckChargeBasic();
        //    CheckBasedOn();
         //   CheckAppliedOn();
            var uniqueindex;
            var prevrowuniqueindex;
            uniqueindex = $('#tblPenaltyParametersSlab').appendGrid('getUniqueIndex', (Math.abs(addedRowIndex)));
            prevrowuniqueindex = $('#tblPenaltyParametersSlab').appendGrid('getUniqueIndex', (Math.abs(parentRowIndex)));
            var end = Math.abs($('#tblPenaltyParametersSlab_EndRange_' + prevrowuniqueindex).val());
            $('#tblPenaltyParametersSlab_StartRange_' + uniqueindex).val(end + 1);
            
            if (addedRowIndex > 0) {
                var elem = $('#tblPenaltyParametersSlab').appendGrid('getCellCtrl', 'StartRange', prevrowuniqueindex);

                $('#tblPenaltyParametersSlab_StartRange_' + parseInt(prevrowuniqueindex)).attr("disabled", true);

                $('#tblPenaltyParametersSlab_StartRange_' + parseInt(uniqueindex)).attr("disabled", true)


                $('#tblPenaltyParametersSlab_EndRange_' + parseInt(prevrowuniqueindex)).attr("disabled", true);
            }
        },
        afterRowRemoved: function (caller, rowIndex) {
            var Rowremovecount = $('#tblPenaltyParametersSlab_rowOrder').val().split(',').length;
            $("#" + $(caller)[0].id).find("tr:eq(" + (rowIndex + 1) + ")").find(':input').attr("disabled", false);
            // $("#" + $(caller)[0].id).find("tr:eq(" + (rowIndex + 1) + ")").find(':input').attr("enabled", true);
            $('#tblPenaltyParametersSlab_StartRange_' + Rowremovecount).attr("disabled", true);
            if (Rowremovecount == 1) {
                $('#tblPenaltyParametersSlab_StartRange_' + Rowremovecount).attr("disabled", false)
            }
        },
        dataLoaded: function (caller, parentRowIndex, addedRowIndex) {
            if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "DELETE") {
                $('#tblPenaltyParametersSlab_btnRemoveLast').remove();
                $('#tblPenaltyParametersSlab_btnAppendRow').remove();
               

            }
        },

        isPaging: true,
        hideButtons: { updateAll: true, insert: true, remove: true },
    });
}
function CheckBasedOn(obj) {
   // showall();
    $("#" + obj + " option[value='0']").hide();
    if ($("#PenaltyType").val() == '0' || $("#PenaltyType").val() == '1') {
        $("#" + obj + " option[value='1']").hide();
           $("#" + obj + " option[value='2']").hide();
    }
    if ($("#PenaltyType").val() == '2' || $("#PenaltyType").val() == '3') {
        $("#" + obj + " option[value='1']").hide();
        $("#" + obj + " option[value='2']").hide();
        
    }
    if ($("#PenaltyType").val() == '4' || $("#PenaltyType").val() =='5') {
        $("#" + obj + " option[value='3']").hide();
    }
}
function CheckChargeBasic(obj)
{
   // showall();
    $("#" + obj + " option[value='0']").hide();
    if ($("#PenaltyType").val() == '0' || $("#PenaltyType").val() == '1' || $("#PenaltyType").val() == '2' || $("#PenaltyType").val() == '3') {
        $("#" + obj + " option[value='3']").hide();
    }
    if ($("#" + obj).val() == '1' && $("#" + obj.replace("ChargeBasis", "PenaltyCharge")).val() > 100) {
        $("#_temp" + obj.replace("ChargeBasis", "PenaltyCharge")).focus();
        return false;
    }
    if ($("#" + obj).val() == '3' || $("#" + obj).val() == '2') {
        $("#" + obj.replace("ChargeBasis", "AppliedOn")).attr('disabled', true)
    }
    else {
       $("#" + obj.replace("ChargeBasis", "AppliedOn")).attr('disabled', false)
    }
}

function CheckAppliedOn(obj) {
  //  showall();
    $("#" + obj + " option[value='0']").hide();
    if ($("#PenaltyType").val() == '0' || $("#PenaltyType").val() == '1') {
        $("#" + obj + " option[value='1']").hide();
        $("#" + obj + " option[value='2']").hide();
    }
    if    ($("#PenaltyType").val() == '2' ) {
        $("#" + obj + " option[value='3']").hide();
        $("#" + obj + " option[value='4']").hide();
    }
    if ($("#PenaltyType").val() == '4' || $("#PenaltyType").val() == '5') {
        $("#" + obj + " option[value='3']").hide();
        $("#" + obj + " option[value='4']").hide();
    }
}

function CheckZero(obj) {
    if ($("#" + obj).val() == '0') {
        ShowMessage('warning', 'Warning -Penalty Parameters!', "Penalty Charge Cannot Be Zero");
        $("#" + obj).val('');
        return false;
    }
    if ($("#" + obj.replace("PenaltyCharge", "ChargeBasis")).val() == 1 && $("#" + obj).val() > 100)
    {
        ShowMessage('warning', 'Warning -Penalty Parameters!', "Penalty Charge Cannot Be greater Than 100");
        $("#" + obj).val('');
        $("#" + obj).focus();
    }
}
function CheckNumeric(obj) {
    var startValue = 0;
    var endValue = 0;
    if (obj.indexOf("Start") >= 0) {
        startValue = $("#" + obj).val();
        endValue = $("#" + obj.replace("Start", "End")).val();
        previousEndValue = $("#" + obj.replace("Start", "End").replace(obj.split("_")[2], obj.split("_")[2] - 1)).val();
    }
    else {
        endValue = $("#" + obj).val();
        startValue = $("#" + obj.replace("End", "Start")).val();
    }
    if (parseFloat(startValue) > parseFloat(endValue)) {
        alert("Start Range can not be greater than End Range.");
        $("#" + obj).val("");
        $("#" + obj).attr("required", "required");
    }
    if (parseFloat(endValue) == 0) {
        $("#" + obj).val("");

    }
    if ($.isNumeric($("#" + obj).val()) == false) {
        $("#" + obj).val('');
        return false;
    }

}
//===Added By arman Ali================ 
if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {

    var array = $('#tblPenaltyParametersSlab_rowOrder').val().split(',')
    for (var count = 0; count < $('#tblPenaltyParametersSlab_rowOrder').val().split(',').length; count++) {
        if ($('#tblPenaltyParametersSlab_ChargeBasis_' + array[count]).val() == '3' || $('#tblPenaltyParametersSlab_ChargeBasis_' + array[count]).val() == '2')
            $('#tblPenaltyParametersSlab_AppliedOn_' + array[count]).attr("disabled", true);

    }
}
//======End========================

//====Addeed by arman 21 apr 2017
function clearAgent()
{
    $('#Text_AccountSNo, #AccountSNo').val('');
    $('#divMultiAccountSNo').remove();
    cfi.AutoComplete("AccountSNo", "Name", "Account", "SNo", "Name", ["Name"], checkcity, "contains", ",", null, null, null, null, true);
    $('#Text_AccountSNo').closest('span').width(150);

}
function clearCity() {
    $('#Text_CitySNo, #CitySNo').val('');
    clearAgent();
}
// == end