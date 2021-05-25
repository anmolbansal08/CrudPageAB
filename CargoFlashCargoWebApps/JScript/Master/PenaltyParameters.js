//cfi.AutoComplete("UserSNo", "UserName", "Users", "SNo", "UserName", null, null, "contains", null, null, null, null, UserDescription);
$(document).ready(function () {
  cfi.ValidateForm();
    var check = "";
    var PenaltyTypeKey = [{ Key: "0", Text: "No Show" }, { Key: "1", Text: "Void" }, { Key: "2", Text: "Late Acceptance" }, { Key: "3", Text: "Cancellation" }, { Key: "4", Text: "BKD Vs EXEC" }, { Key: "5", Text: "EXEC Vs RCS" }, {Key : "6", Text:"ITL"}]
     cfi.AutoCompleteV2("PenaltyType", "Name", "Manage_Penalty_PenaltyType", showall, "contains");
    var LocationType = [{ Key: "0", Text: "CITY" }, { Key: "1", Text: "COUNTRY" }];
    var ApplicableOnType = [{ Key: "0", Text: "Chargeable Weight" }, { Key: "1", Text: "Grosss Weight" }];
    var ChargeBaseKey = [{ Key: "0", Text: "Percentage" }, { Key: "1", Text: "Fixed" }, { Key: "2", Text: "PerKG" }]
    cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,AirlineName", "Manage_Penalty_Airline", null, "contains");
    cfi.AutoCompleteV2("OtherAirlineSNo", "CarrierCode,AirlineName", "Manage_Penalty_Airline", null, "contains", ",");
     cfi.AutoCompleteV2("ProductSNo", "ProductName", "Manage_Penalty_Product", null, "contains");
      cfi.AutoCompleteV2("CountrySNo", "CountryCode,CountryName", "Manage_Penalty_Country", null, "contains", null, null, null, null, clearCity, null, null, true);
      cfi.AutoCompleteV2("CurrencySNo", "CurrencyCode,CurrencyName", "PenaltyParameters_Currency", null, "contains");
    cfi.AutoCompleteV2("CitySNo", "CityCode,CityName", "Manage_Penalty_City",  null, "contains", null, null, null, null, clearAgent, null, null, true);
   cfi.AutoCompleteV2("SHCSNo", "Code", "Manage_Penalty_SHC",  null, "contains", ",", null, null, null, null, true);
   cfi.AutoCompleteV2("AccountSNo", "Name,ParticipantID", "Manage_Penalty_Account", null, "contains", ",");
   //cfi.AutoCompleteV2("AccountSNo", "ParticipantID,Name", "Manage_Penalty_Account", checkcity, "contains", ",", null, null, null, null, true);
   //cfi.AutoCompleteV2("AccountSNo", "ParticipantID,Name", "Embargo_Name", null, "contains", ",");
    //cfi.BindMultiValue("SHCSNo", $("#Text_SHCSNo").val(), $("#SHCSNo").val());
    //cfi.BindMultiValue("AccountSNo", $("#Text_AccountSNo").val(), $("#AccountSNo").val());
    cfi.AutoCompleteV2("Commodity", "CommodityCode,CommodityDescription", "PenaltyParameters_Commodity", null, "contains", ",");
    //cfi.BindMultiValue("Commodity", $("#Text_Commodity").val(), $("#Commodity").val());
    // for date
  //  $("#ValidFrom").data("kendoDatePicker").value("");
    //  $("#ValidTo").data("kendoDatePicker").value("");
    cfi.BindMultiValue("SHCSNo", $("#Text_SHCSNo").val(), $("#SHCSNo").val());
    //cfi.BindMultiValue("AccountSNo", $("#Text_AccountSNo").val(), $("#AccountSNo").val());
    cfi.BindMultiValue("Commodity", $("#Text_Commodity").val(), $("#Commodity").val());
   // cfi.BindMultiValue("AirlineSNo", $("#Text_AirlineSNo").val(), $("#AirlineSNo").val());
    //$("#AirlineSNo").val(userContext.AirlineSNo);
    //$("#Text_AirlineSNo").val(userContext.AirlineCarrierCode);
    cfi.BindMultiValue("OtherAirlineSNo", $("#Text_OtherAirlineSNo").val(), $("#OtherAirlineSNo").val());
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW")
    {
        $("#AirlineSNo").val(userContext.AirlineSNo);
        $("#Text_AirlineSNo").val(userContext.AirlineCarrierCode);
       // cfi.BindMultiValue("AirlineSNo", $("#Text_AirlineSNo").val(), $("#AirlineSNo").val());
    }
    //===========Added by Arman Ali
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        $("#ValidFrom").attr('readOnly', 'true');
        $("#ValidTo").attr('readOnly', 'true');
        // end
        cfi.BindMultiValue("AccountSNo", $("#Text_AccountSNo").val(), $("#AccountSNo").val());
       // cfi.BindMultiValue("AirlineSNo", $("#Text_AirlineSNo").val(), $("#AirlineSNo").val());
      
        var todaydate = new Date();
        var validfromdate = $("#ValidFrom").data("kendoDatePicker");
        validfromdate.min(todaydate);

        var validTodate = $("#ValidTo").data("kendoDatePicker");
        validTodate.min(todaydate);
   
                          
    }

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
        aw

    });

  //  if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        CreatePenaltyParametersSlabGrid();
        PenaltyForIFElse();
   // }
    //---------------------------------------------- tax on penalty percent check By : Arman Ali-------------------------------------------
        $("#TaxOnPenalty").keyup(function () {
            if ($(this).val() > 100) {
                $(this).val('')
            }
        });
    //-----------------------------------------------
});
//--------changes by arman ali , date: 2017-08-24
function showall()
{
    if ($("[id^='tblPenaltyParametersSlab_Row']").length > 0)
  {
    $("[id^='tblPenaltyParametersSlab_BasedOn_']").val('')
    $("[id^='tblPenaltyParametersSlab_ChargeBasis_']").val('');
    $("[id^='tblPenaltyParametersSlab_AppliedOn_']").val('');
    $("[id^='tblPenaltyParametersSlab_HdnBasedOn_']").val('')
    $("[id^='tblPenaltyParametersSlab_HdnChargeBasis_']").val('');
    $("[id^='tblPenaltyParametersSlab_HdnAppliedOn_']").val('');
    $("[id^='tblPenaltyParametersSlab_AppliedOn_']").data("kendoAutoComplete").enable(true);
  }

}

function checkcity()
{
    //if ($('#CitySNo').val() == "") {
    //    alert('Select City first');
    //}
}

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


function PenaltyForIFElse() {
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
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        showallOnEdit();
        var RowCount = $('#tblPenaltyParametersSlab_rowOrder').val().split(',').length
        for (var count = 1; count <= $('#tblPenaltyParametersSlab_rowOrder').val().split(',').length; count++) {
            $('#tblPenaltyParametersSlab_StartRange_' + count).attr("disabled", true);
            $('#tblPenaltyParametersSlab_EndRange_' + count).attr("disabled", true);
        }
        $('#tblPenaltyParametersSlab_EndRange_' + RowCount).attr("disabled", false);
        if ($('#tblPenaltyParametersSlab_ChargeBasis_' + RowCount).val() == 'Fixed') {
            $('#tblPenaltyParametersSlab_AppliedOn_' + RowCount).data("kendoAutoComplete").enable(false);
        }
        else {
            $('#tblPenaltyParametersSlab_AppliedOn_' + RowCount).data("kendoAutoComplete").enable(true);
        }


    }
    //===Added By arman Ali================ 
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {

        var array = $('#tblPenaltyParametersSlab_rowOrder').val().split(',')
        for (var count = 0; count < $('#tblPenaltyParametersSlab_rowOrder').val().split(',').length; count++) {
            if ($('#tblPenaltyParametersSlab_ChargeBasis_' + array[count]).val() == 'Fixed' || $('#tblPenaltyParametersSlab_ChargeBasis_' + array[count]).val() == '2')
                $('#tblPenaltyParametersSlab_AppliedOn_' + array[count]).data("kendoAutoComplete").enable(false);;

        }
    }
    //======End========================

    //====Addeed by arman 21 apr 2017
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
    if (userContext.SysSetting.ClientEnvironment.toUpperCase() == "G9") {
        if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
            if ($('#tblPenaltyParametersSlab_ChargeBasis_1').val() == "FIXED") {
                $("#MinimumCharge").removeAttr('data-valid');
                $("#MinimumCharge").val('0');
            } else { $("#MinimumCharge").attr('data-valid', 'required'); }   //added by ankit kumar tfs id :- 16439
        }
    }
});
function ExtraCondition(textId) {
    var filter1 = cfi.getFilter("AND");
    //var filter2 = cfi.getFilter("AND");
    if (textId.indexOf("Text_CitySNo") >= 0) {

        cfi.setFilter(filter1, "CountrySNo", "eq", $('#CountrySNo').val());
        //  cfi.setFilter(filter1, "IsInterline", "eq", "0");
        filterCitySNo = cfi.autoCompleteFilter([filter1]);
        return filterCitySNo;
    }
    if (textId.indexOf("Text_PenaltyType") >= 0) {

        cfi.setFilter(filter1, "CarrierCode", "eq", userContext.SysSetting.ICMSEnvironment);
        //  cfi.setFilter(filter1, "IsInterline", "eq", "0");
        filterCitySNo = cfi.autoCompleteFilter([filter1]);
        return filterCitySNo;
    }
    if (textId == "Text_AccountSNo") {
        var filter21 = cfi.getFilter("AND");
      
        if ($("#Text_CountrySNo").val() != "" && $("#Text_CountrySNo").val() !='') {

           cfi.setFilter(filter21, "CountrySNo", "in", $('#CountrySNo').val());
            //cfi.setFilter(filter2, "CountrySNo", "in", $('#CountrySNo').val());
        }
        if ($("#Text_CitySNo").val() != "") {
            cfi.setFilter(filter21, "CitySNo", "in", $("#CitySNo").val());
        }
        if ($("#Text_AirlineSNo").val() != "") {
            cfi.setFilter(filter21, "AirlineSNo", "in", $("#AirlineSNo").val());
        }
        cfi.setFilter(filter21, "SNo", "notin", $("#AccountSNo").val());
        filterCitySNo = cfi.autoCompleteFilter([filter21]);
        return filterCitySNo;
    }
    if (textId == "Text_SHCSNo") {
        var filter2 = cfi.getFilter("AND");
        cfi.setFilter(filter2, "SNo", "notin", $("#SHCSNo").val());
        filterCitySNo = cfi.autoCompleteFilter([filter2]);
        return filterCitySNo;
    }
    if (textId == "Text_Commodity") {
        var filter2 = cfi.getFilter("AND");
        cfi.setFilter(filter2, "SNo", "notin", $("#Commodity").val());
        filterCitySNo = cfi.autoCompleteFilter([filter2]);
        return filterCitySNo;
    }
    //cfi.setFilter(filterCityConnectionTime, "IsInterline", "eq", "0");
    //cfi.setFilter(filterCityConnectionTime, "SNo", "notin", $("#Text_OtherAirlineAccess").data("kendoAutoComplete").key())
    //var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterCityConnectionTime]);
    //return OriginCityAutoCompleteFilter2;

    if (textId == "Text_AirlineSNo") {
        var filter2 = cfi.getFilter("AND");
        cfi.setFilter(filter2, "SNo", "notin", $("#OtherAirlineSNo").val());
           var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filter2]);
         return OriginCityAutoCompleteFilter2;
    }


    if (textId == "Text_OtherAirlineSNo") {
        var filter2 = cfi.getFilter("AND");
      cfi.setFilter(filter2, "SNo", "notin", $("#AirlineSNo").val());
         var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filter2]);
        //return OriginCityAutoCompleteFilter2
        
        return OriginCityAutoCompleteFilter2;
    }
    //if (textId == "Text_CurrencySNo") {
        
    //    var filter2 = cfi.getFilter("AND");
    //    cfi.setFilter(filter2, "airlinesno", "eq", $("#AirlineSNo").val());
    //    filterCitySNo = cfi.autoCompleteFilter([filter2]);
    //    return filterCitySNo;
    //}
    //=====added by arman ali 
    if (textId.indexOf("tblPenaltyParametersSlab_BasedOn") >= 0) {
        var filter2 = cfi.getFilter("AND");
        var penalty = $("#Text_PenaltyType").val().toUpperCase();
        if (penalty == "BKD VS EXEC" || penalty == "EXEC VS RCS" || penalty == "RCS LESS THAN EXEC" || penalty == "RCS GREATER THAN EXEC" || penalty == "EXEC GREATER THAN BKD" || penalty == "EXEC LESS THAN BKD") {
            cfi.setFilter(filter2, "SNo", "in", "1,2");

            cfi.setFilter(filter2, "CarrierCode", "eq", userContext.SysSetting.ICMSEnvironment);
        }
        else if ((penalty == "CANCELLATION" || penalty == "LATE ACCEPTANCE") && (userContext.SysSetting.ICMSEnvironment == "GA")) {
            cfi.setFilter(filter2, "SNo", "in", "1,3");
            cfi.setFilter(filter2, "CarrierCode", "eq", userContext.SysSetting.ICMSEnvironment);
        }
      
        else if (( penalty == "NO SHOW") && (userContext.SysSetting.ICMSEnvironment=="GA")) {
            cfi.setFilter(filter2, "SNo", "in", "1");
            cfi.setFilter(filter2, "CarrierCode", "eq", userContext.SysSetting.ICMSEnvironment);
        }
        else if (penalty == "ITL") {
            cfi.setFilter(filter2, "SNo", "in", "1");
            cfi.setFilter(filter2, "CarrierCode", "eq", userContext.SysSetting.ICMSEnvironment);
        }
        else if ((penalty == "CANCELLATION" || penalty == "NO SHOW") && (userContext.SysSetting.ICMSEnvironment == "JT")) {
            cfi.setFilter(filter2, "SNo", "in", "5,6,7");
            cfi.setFilter(filter2, "CarrierCode", "eq", userContext.SysSetting.ICMSEnvironment);
        }
        else if ((penalty == "LATE ACCEPTANCE") && (userContext.SysSetting.ICMSEnvironment == "JT")) {
            cfi.setFilter(filter2, "SNo", "in", "8");
            cfi.setFilter(filter2, "CarrierCode", "eq", userContext.SysSetting.ICMSEnvironment);
        }
        else if (penalty == "AUTO NO SHOW") {
            cfi.setFilter(filter2, "SNo", "in", "4");
            cfi.setFilter(filter2, "CarrierCode", "eq", userContext.SysSetting.ICMSEnvironment);
        }
        else if (penalty == "AUTO NO SHOW ON NIL MANIFEST") {
            cfi.setFilter(filter2, "SNo", "in", "3");
            cfi.setFilter(filter2, "CarrierCode", "eq", userContext.SysSetting.ICMSEnvironment);
        }
        else if (penalty == "VOID") {
            cfi.setFilter(filter2, "SNo", "in", "1,3,4");
            cfi.setFilter(filter2, "CarrierCode", "eq", userContext.SysSetting.ICMSEnvironment);
        }
        filterCitySNo = cfi.autoCompleteFilter([filter2]);
        return filterCitySNo;
    }
    if (textId.indexOf("tblPenaltyParametersSlab_ChargeBasis") >= 0) {
        var filter2 = cfi.getFilter("AND");
        var penalty = $("#Text_PenaltyType").val().toUpperCase();
        if (penalty == "EXEC VS RCS" || penalty == "RCS LESS THAN EXEC" || penalty == "RCS GREATER THAN EXEC") {
            cfi.setFilter(filter2, "SNo", "in", "1,2,3");
        }
       
        else{
            cfi.setFilter(filter2, "SNo", "in", "1,2");
        }
        filterCitySNo = cfi.autoCompleteFilter([filter2]);
        return filterCitySNo;
    }
    if (textId.indexOf("tblPenaltyParametersSlab_AppliedOn") >= 0) {
        var RowNo = textId.split('_')[2];
        var filter2 = cfi.getFilter("AND");
        var penalty = $("#Text_PenaltyType").val().toUpperCase();
        var chargebasic = $("#tblPenaltyParametersSlab_ChargeBasis_" + RowNo).val();
        var BasedOn = $("#tblPenaltyParametersSlab_BasedOn_" + RowNo).val().toUpperCase();
        if (penalty == "EXEC VS RCS" || penalty == "RCS LESS THAN EXEC" || penalty == "RCS GREATER THAN EXEC") {
            cfi.setFilter(filter2, "SNo", "in", "1,2,3,5,6");
        }
        else if ((penalty == "NO SHOW" || penalty == "CANCELLATION") && BasedOn == "BETWEEN BCT & ACT") {
            cfi.setFilter(filter2, "SNo", "in", "7");
        }
        else {
            cfi.setFilter(filter2, "SNo", "in", "1,2,3,5");
        }
        //-----filter for per kg chargebasic only rate on awb----------------
        if (chargebasic.toUpperCase() == "PER KG") {
            cfi.setFilter(filter2, "SNo", "in", "6");
        }
        else {
            cfi.setFilter(filter2, "SNo", "notin", "6");
        }
        filterCitySNo = cfi.autoCompleteFilter([filter2]);
        return filterCitySNo;
    }
}

function CreatePenaltyParametersSlabGrid() {
    var strData = [];
    var pageType = $('#hdnPageType').val();
    var datatblPenaltyParametersSlab_BasedOn_1 = [{ 0: "Percentage", 1: "Fixed", 2: "Per KG" }]
    var page = getQueryStringValue("FormAction").toUpperCase();
    var dbtableName = "PenaltyParametersSlab";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: pageType == "READ" || pageType == "DELETE" ? false : true,
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
            { name: "StartRange", display: "Start Range", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "number", onblur: "return CheckNumeric(this.id);" }, isRequired: true },
            { name: "EndRange", display: "End Range", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "number", onblur: "return CheckNumeric(this.id);" }, isRequired: true },
            { name: "BasedOn", display: "Based On", type: "text", ctrlCss: { width: '150px', height: '20px' }, ctrlAttr: { maxlength: 100, onSelect: "return CheckBasedOn(this.id);", controltype: 'autocomplete' }, onChange: "return CheckBasedOn(this.id);", AutoCompleteName: 'PenaltyParameters_BasedOn', filterField: "Name", filterCriteria : "contains", isRequired : page == "NEW" || page == "DUPLICATE" || page == "EDIT" ? true: false
        },
            { name: "PenaltyCharge", display: "Penalty Charge", type: "text", ctrlCss: { width: '110px' }, ctrlAttr: { maxlength: 15, controltype: "number", onblur: "return CheckZero(this.id);" }, isRequired: true },
            { name: "ChargeBasis", display: "Charge Basis", type: "text", ctrlAttr: { controltype: 'autocomplete', onSelect: "return CheckChargeBasic(this.id);" }, ctrlCss: { width: '150px', height: '20px' }, onChange: "return CheckChargeBasic(this.id);" ,AutoCompleteName: 'PenaltyParameters_ChargeBasis', filterField: "Name", filterCriteria: "contains", isRequired: page == "NEW" || page == "DUPLICATE" || page == "EDIT" ? true : false },
           //  { name: 'ULDSNo', display: 'ULD Type', type: 'text', ctrlAttr: {  }, ctrlCss: { width: '150px', height: '20px' }, onChange: 'return GetULDMinimumCWt(this.id);', isRequired: true, AutoCompleteName: 'Rate_rate_ULDTypeName', filterField: "ULDName", filterCriteria: "contains" },
          { name: "AppliedOn", display: "Applied On", type: "text", ctrlCss: { width: '150px', height: '20px' },ctrlAttr: { maxlength: 150, onClick: "return CheckAppliedOn(this.id);", onChange: "return CheckAppliedOn(this.id);", controltype: 'autocomplete' }, AutoCompleteName: 'PenaltyParameters_AppliedOn', filterField: "Name", filterCriteria: "contains", isRequired: page == "NEW" || page == "DUPLICATE" || page == "EDIT" ? true : false },
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
         //   $("#tblPenaltyParametersSlab_BasedOn_" + uniqueindex).prop("selectedIndex", -1);
         //   $("#tblPenaltyParametersSlab_ChargeBasis_" + uniqueindex).prop("selectedIndex", -1);
        //    $("#tblPenaltyParametersSlab_AppliedOn_" + uniqueindex).prop("selectedIndex", -1);
            prevrowuniqueindex = $('#tblPenaltyParametersSlab').appendGrid('getUniqueIndex', (Math.abs(parentRowIndex)));
            var end = Math.abs($('#tblPenaltyParametersSlab_EndRange_' + prevrowuniqueindex).val());
            $('#tblPenaltyParametersSlab_StartRange_' + uniqueindex).val(end + 1);
            $('#_temptblPenaltyParametersSlab_StartRange_' + uniqueindex).val(end + 1);
            
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
            $('#_temptblPenaltyParametersSlab_StartRange_' + Rowremovecount).attr("disabled", true);
            if (Rowremovecount == 1) {
                $('#tblPenaltyParametersSlab_StartRange_' + Rowremovecount).attr("disabled", false)
                $('#_temptblPenaltyParametersSlab_StartRange_' + Rowremovecount).attr("disabled", false)
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
    var objec = $(obj).attr('id')
    $("#" + objec.replace("BasedOn", "AppliedOn")).val('');
    $("#" + objec.replace("BasedOn", "HdnAppliedOn")).val('');
}
function CheckChargeBasic(objec)
{
    var obj = $(objec).attr('id')

    //-------Per kg condition--------------
    if ($("#" + obj).val().toUpperCase() == "PER KG") {
        $("#_temptblPenaltyParametersSlab_PenaltyCharge_" + obj.split("_")[2]).attr("disabled", true);
        $("#tblPenaltyParametersSlab_PenaltyCharge_" + obj.split("_")[2]).attr("disabled", true);
        $("#_temptblPenaltyParametersSlab_PenaltyCharge_" + obj.split("_")[2]).val("");
        $("#tblPenaltyParametersSlab_PenaltyCharge_" + obj.split("_")[2]).val("");
        $("#_temptblPenaltyParametersSlab_PenaltyCharge_" + obj.split("_")[2]).removeAttr("required");
        $("#tblPenaltyParametersSlab_PenaltyCharge_" + obj.split("_")[2]).removeAttr("required");
    }
    else {
        $("#_temptblPenaltyParametersSlab_PenaltyCharge_" + obj.split("_")[2]).attr("disabled", false);
        $("#tblPenaltyParametersSlab_PenaltyCharge_" + obj.split("_")[2]).attr("disabled", false);
        $("#_temptblPenaltyParametersSlab_PenaltyCharge_" + obj.split("_")[2]).attr("required", 'required');
        $("#tblPenaltyParametersSlab_PenaltyCharge_" + obj.split("_")[2]).attr("required", 'required');
    }
    //-------Fixed condition--------------
    if ($("#" + obj).val().toUpperCase() == "FIXED") {
        //$("#" + textId).closest('td').next('td').attr('disabled', true);
        $("#" + obj.replace("ChargeBasis", "AppliedOn")).data("kendoAutoComplete").enable(false);
        $("#" + obj.replace("ChargeBasis", "AppliedOn")).removeAttr('required');
        $("#" + obj.replace("ChargeBasis", "AppliedOn")).val('');
        $("#" + obj.replace("ChargeBasis", "HdnAppliedOn")).val('');
    }
    else {
        $("#" + obj.replace("ChargeBasis", "AppliedOn")).data("kendoAutoComplete").enable(true);
        $("#" + obj.replace("ChargeBasis", "AppliedOn")).attr('required', 'required');
    }
    //----------------end-----------------
    if ($("#" + obj).val().toUpperCase() == "PERCENTAGE" && $("#" + obj.replace("ChargeBasis", "PenaltyCharge")).val() > 1000) {
        ShowMessage('warning', 'Warning -Penalty Parameters!', "Penalty Charge Cannot Be greater Than 1000");
        $("#" + obj.replace("ChargeBasis", "PenaltyCharge")).val('');
        $("#_temp" + obj.replace("ChargeBasis", "PenaltyCharge")).val('');   // by pankaj 2018-01-11
        $("#" + obj.replace("ChargeBasis", "PenaltyCharge")).focus();
        return false;
    }       
}

function CheckAppliedOn(obj) {
    //if ($("#" + obj.replace("AppliedOn", "ChargeBasis")).toUpperCase() == "FIXED") {
        
    //    //$("#" + textId).closest('td').next('td').attr('disabled', true);
    //    $("#" + obj).data("kendoAutoComplete").enable(false);
    //    $("#" + obj).removeAttr('required');
    //    $("#" + obj).val('');
    //    $("#" + obj.replace("AppliedOn", "HdnAppliedOn")).val('');
    //}
    //else {
    //    $("#" + obj).data("kendoAutoComplete").enable(true);
    //    $("#" + obj).attr('required', 'required');
    //}
    ////----------------end-----------------
    //if ($("#" + obj.replace("AppliedOn", "ChargeBasis")).val().toUpperCase() == "PERCENTAGE" && $("#" + obj.replace("AppliedOn", "PenaltyCharge")).val() > 100) {
    //    ShowMessage('warning', 'Warning -Penalty Parameters!', "Penalty Charge Cannot Be greater Than 100");
    //    $("#" + obj).val('');
    //    $("#" + obj).val('');
    //    $("#" + obj).focus();
    //    return false;
    //}
   
}

function CheckZero(obj) {
    var CEN = userContext.SysSetting.ClientEnvironment;
        if ($("#Text_PenaltyType").val().toUpperCase() != "AUTO NO SHOW") {
            if ($("#" + obj).val() == '0' && CEN!= "JT") {
                ShowMessage('warning', 'Warning -Penalty Parameters!', "Penalty Charge Cannot Be Zero");
                $("#" + obj).val('');
                return false;
            }
            if ($("#" + obj.replace("PenaltyCharge", "ChargeBasis")).val().toUpperCase() == "PERCENTAGE" && $("#" + obj).val() > 1000) {
                ShowMessage('warning', 'Warning -Penalty Parameters!', "Penalty Charge Cannot Be greater Than 1000");
                $("#" + obj).val('');
                $("#_temp" + obj).val('');   // by pankaj : 2018-01-11
                $("#" + obj).focus();
            }
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

function clearAgent()
{
   // $('#Text_AccountSNo, #AccountSNo').val('');
   //  $('#divMultiAccountSNo').remove();
   //  cfi.AutoCompleteV2("AccountSNo", "Name,ParticipantID", "Manage_Penalty_Account", null, "contains", ",");
   //// cfi.AutoCompleteV2("AccountSNo", "Name,ParticipantID", "Manage_Penalty_Account", null, "contains", ",");
   // // cfi.AutoCompleteV2("AccountSNo", "ParticipantID,Name", "Manage_Penalty_Account", checkcity, "contains", ",", null, null, null, null, true);
   // $('#Text_AccountSNo').closest('span').width(150);
    $("#divMultiAccountSNo").find('ul li').find('.k-delete').click();

}
function clearCity() {
    $('#Text_CitySNo, #CitySNo').val('');
    clearAgent();
}
// == end
function showallOnEdit() {
   

}


function ExtraParameters(id) {
    var param = [];
    if (id == "Text_AirlineSNo" || id == "Text_OtherAirlineSNo") {
        var UserSNo = userContext.UserSNo;
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }
}