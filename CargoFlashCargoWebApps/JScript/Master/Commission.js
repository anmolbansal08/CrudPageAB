
//var RemoveRowNo = 0;
$(document).ready(function () {
   cfi.ValidateForm();
   $('#aspnetForm').attr("enctype", "multipart/form-data");
   if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
       $("#Text_AirlineSNo").val(userContext.AirlineCarrierCode);
       $("#AirlineSNo").val(userContext.AirlineSNo);
   }
   BindAutoComplete();
   CheckActionType();
   $('.k-picker-wrap').width(100);
   //$('input[name="operation"]').click(function (e) {
   //    debugger
   //    var SKeyValue = "";
   //    var FormAction = "";
   //    var KeyValue = "";
   //    var TerminalSNo = "";
   //    var TerminalName = "";
   //    var KeyColumn = "COMMISSION";
   //    FormAction = getQueryStringValue("FormAction").toUpperCase();
   //    KeyValue = document.getElementById('__SpanHeader__').innerText;
   //    TerminalSNo = userContext.TerminalSNo;
   //    TerminalName = userContext.NewTerminalName;
   //    Saveaudit(KeyColumn, FormAction, KeyValue, TerminalSNo, TerminalName);

   //});
    ///---
   CreateCommissionSlabGrid();
   CommissionIfelse();
   $('[id^="tblCommissionSlab_ValidFrom_"]').closest('td').find('span[class="k-icon k-i-calendar"]').click(function () {
       setdatevalue();
   });
   $('[id^="tblCommissionSlab_ValidTo_"]').closest('td').find('span[class="k-icon k-i-calendar"]').click(function () {
       setdatevalue();
   });
   if(getQueryStringValue("FormAction").toUpperCase() != "NEW")
   {
       var val = $("[type='hidden'][id='CustomerType']").val().toUpperCase();
       if (val == "BOTH") {
           $("[type='hidden'][id='CustomerType']").val("2");
       }
       else if (val = "DOMESTIC")
           $("[type='hidden'][id='CustomerType']").val("1");
       else
           $("[type='hidden'][id='CustomerType']").val("0");
   }
});
////Added by Shivali Thakur for Audit Log

//function Saveaudit(KeyColumn, FormAction, KeyValue, TerminalSNo, TerminalName) {
//    if (FormAction == "DELETE" || FormAction == "EDIT") {
//        SKeyValue = KeyValue.split(':');
//        AuditLogSaveNewValue("divbody", true, '', KeyColumn, SKeyValue[1], '', FormAction, TerminalSNo, TerminalName);
//    }
//    else if (FormAction == "NEW") {
//        KeyValue = document.getElementById('Text_AirlineSNo').value;
//        SKeyValue = KeyValue.toUpperCase();
//        AuditLogSaveNewValue("divbody", true, '', KeyColumn, SKeyValue, '', FormAction, TerminalSNo, TerminalName);
//    }
//}


function BindAutoComplete() {
    $('#Text_AirlineSNo').nextAll("span").remove();
    cfi.AutoCompleteV2("OfficeSNo", "Name", "Master_Commission_Office", clearAgent);
    cfi.AutoCompleteV2("Agent", "Name,ParticipantID", "Master_Commission_Agent", ResetAgent);  // add ParticipantID by arman ali Date : 2017-07-31 
    cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,AirlineName", "Master_Commission_Airline", null, "contains");
    cfi.AutoCompleteV2("AgentType", "PrefixCode,AccountTypeName", "Master_Commission_AgentType", null, "contains", null, null, null, null, ResetAgentType); // add AgentType by Devendra Singh on 26 JAN 2018 
    cfi.AutoCompleteV2("OriginCountrySNo", "CountryCode,CountryName", "Commission_CountryCode", null, "contains", null, null, null, null, ClearCity);
    cfi.AutoCompleteV2("DestinationCountrySNo", "CountryCode,CountryName", "Commission_CountryCode", null, "contains", null, null, null, null, ClearCity);
    cfi.AutoCompleteV2("OriginCitySNo", "CityCode,CityName", "Commission_CityCode", null, "contains");
    cfi.AutoCompleteV2("DestinationCitySNo", "CityCode,CityName", "Commission_CityCode", null, "contains");
  
}


function ExtraCondition(textId) {
    var filterForwarderCode = cfi.getFilter("AND");
    var filterForwarderName = cfi.getFilter("AND");

    if (textId == "Text_Agent") {
        var ForwarderFilter = "";
        var AgentType = $('#Text_AgentType').data('kendoAutoComplete').key() || "";
        if (AgentType != "" && AgentType != "0") {
            cfi.setFilter(filterForwarderCode, "AccountTypeSNo", "eq", AgentType);
            ForwarderFilter = cfi.autoCompleteFilter(filterForwarderCode);
        }

        if ($("#OfficeSNo").val() != "" && $("#OfficeSNo").val() != "0") {
            cfi.setFilter(filterForwarderCode, "OfficeSNo", "eq", $('#OfficeSNo').val());
             ForwarderFilter = cfi.autoCompleteFilter(filterForwarderCode);
        }
        else {
            cfi.setFilter(filterForwarderCode, "AirlineSNo", "eq", $('#AirlineSNo').val());
            ForwarderFilter = cfi.autoCompleteFilter(filterForwarderCode);
        }
        return ForwarderFilter;
    }
    if (textId.indexOf("Text_AirlineSNo") >= 0) {
        var filter1 = cfi.getFilter("AND");
        cfi.setFilter(filter1, "IsActive", "eq", "1");
        cfi.setFilter(filter1, "IsInterline", "eq", "0");
        filterAirlineSNo = cfi.autoCompleteFilter(filter1);
        return filterAirlineSNo;
    }
    if (textId.indexOf("Text_OfficeSNo") >= 0) {
        var filter2 = cfi.getFilter("AND");
        cfi.setFilter(filter2, "AirlineSNo", "eq", $('#AirlineSNo').val());
        filterAirlineSNo = cfi.autoCompleteFilter(filter2);
        return filterAirlineSNo;
    }
 
    if (textId == "Text_OriginCitySNo") {
        var filter1 = cfi.getFilter("AND");
        if ($("#Text_OriginCountrySNo").val()!= '')
            cfi.setFilter(filter1, "CountrySNo", "eq", $("#OriginCountrySNo").val());
        if ($("#Text_DestinationCitySNo").val()!= '')
            cfi.setFilter(filter1, "SNo", "neq", $("#DestinationCitySNo").val());
        filterAirlineSNo = cfi.autoCompleteFilter(filter1);
        return filterAirlineSNo;
    }
    if (textId == "Text_DestinationCitySNo") {
        var filter1 = cfi.getFilter("AND");
        if ($("#Text_DestinationCountrySNo").val()!= '')
            cfi.setFilter(filter1, "CountrySNo", "eq", $("#DestinationCountrySNo").val());
        if ($("#Text_OriginCitySNo").val()!= '')
            cfi.setFilter(filter1, "SNo", "neq", $("#OriginCitySNo").val());
        filterAirlineSNo = cfi.autoCompleteFilter(filter1);
        return filterAirlineSNo;
    }
}

function ResetDone() {
    //=============added by arman ali=========

    $("#OfficeSNo").val('');
    $("#Text_OfficeSNo").val('');
    $("#Agent").val('');
    $("#Text_Agent").val('');
   
}
  

function clearAgent() {
    $("#_tempCommission").val('');
    $("#_tempIncentive").val('');
    $("#Commission").val('');
    $("#Incentive").val('');
    $('input[type="radio"][name="CustomerType"]').attr("disabled", false);
    cfi.ResetAutoComplete("Agent");
    cfi.ResetAutoComplete("AgentType");
    $("#Text_OfficeSNo").select(function () {
        if ($("#Agent").val() == "") {
            $('#spanCommissionPercentage').remove();
            $('#spanIncentivePercentage').remove();
            $('#Text_Unit').val('Percentage');
            $('#Unit').val('0');
            $("#Commission").after("<span id ='spanCommissionPercentage'>%</span>");
            $("#Incentive").after("<span id ='spanIncentivePercentage'>%</span>");
            $('#Text_Unit').data("kendoAutoComplete").enable(false);
            //$('#Text_Unit').kendoAutoComplete.enable(false);
        }
        else {
            //$("#Commission").after("<span id ='spanPercentage'>%</span>");
            $('#spanCommissionPercentage').remove();
            $('#spanIncentivePercentage').remove();
        }
    });
   
}

function ResetAgent() {
   
    $("#_tempCommission").val('');
    $("#_tempIncentive").val('');
    $("#Commission").val('');
    $("#Incentive").val('');
    if ($("#Text_Agent").val() == '') {
      //  $('#Text_Unit').data("kendoAutoComplete").enable(false);
        $('input[type="radio"][name="CustomerType"]').attr("disabled", false);
    }
    var AgentControl = $("#Text_Agent");
    AgentControl.select(function () {
        if (AgentControl.val() != "" && AgentControl == "") {
            $('#Text_Unit').val('Percentage');
           // $('#Unit').val('0');
          //  $('#Text_Unit').data("kendoAutoComplete").enable(false);
        }
        else {
            var AgentCustomerType = $("#Agent").val().split('-')[1];
            if (AgentCustomerType == '0') {
                $('input[type="radio"][id="CustomerType"][value="0"]').attr('checked', true);
                $('input[type="radio"][name="CustomerType"]').attr("disabled", true);
            }
            else if (AgentCustomerType == '1') {
                $('input[type="radio"][id="CustomerType"][value="1"]').attr('checked', true);
                $('input[type="radio"][name="CustomerType"]').attr("disabled", true);
            }
            else {
                $('input[type="radio"][name="CustomerType"]').attr("disabled", false);
            }
          //  $('#Text_Unit').data("kendoAutoComplete").enable(true);
        }
    });
}

function ResetAgentType() {
    $('#Text_Agent').data('kendoAutoComplete').key('');
    $('#Text_Agent').data('kendoAutoComplete').value('')
}
//$('input[type="submit"][name="operation"]').click(function () {
   

//    var KeyValue = "";
//    var KeyColumn = "Commission";
//    KeyValue = document.getElementById('__SpanHeader__').innerText
//    var SKeyValue = KeyValue.split(':')

//    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {

//        AuditLogSaveNewValue("tbl", true, '', KeyColumn, SKeyValue[1]);
//    }

//    if ($("[id*='tblCommissionSlab_Incentive_']").val() == "") {
//        $("[id*='tblCommissionSlab_Incentive_']").val('0');
//    }
//});


$('input[type="submit"][name="operation"][value="Save"]').click(function () {
    BindAutoComplete();
   
});



$('#MasterSaveAndNew').click(function () {
    BindAutoComplete();
    
});

function CommissionIfelse() {
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        BindAutoComplete();
        $('#Text_OfficeSNo').data("kendoAutoComplete").enable(false);
        $('#Text_Agent').data("kendoAutoComplete").enable(false);
        $('#Text_AirlineSNo').data("kendoAutoComplete").enable(false);
        $('#Text_AgentType').data("kendoAutoComplete").enable(false);
        //    $('#Text_Unit').data("kendoAutoComplete").enable(false);
        //    $('#Text_Type').data("kendoAutoComplete").enable(false);
        $('input[type="radio"][name="CustomerType"]').attr("disabled", true);
        $('input[type="radio"][name="CommissionUnit"]').attr("disabled", true);
        //  setTimeout(function () { $("#ValidFrom").data("kendoDatePicker").enable(false); }, 100);
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "DELETE") {
        for (var count = 1; count <= $('#tblCommissionSlab_rowOrder').val().split(',').length; count++) {
            $('#tblCommissionSlab_StartWeight_' + count).attr("disabled", true);
            $('#tblCommissionSlab_EndWeight_' + count).attr("disabled", true);
            $('#tblCommissionSlab_Unit_' + count).attr("disabled", true);
            $('#tblCommissionSlab_Incentive_' + count).attr("disabled", true);
            $('#tblCommissionSlab_Commission_' + count).attr("disabled", true);
        }
    }

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        var RowCount = $('#tblCommissionSlab_rowOrder').val().split(',').length
        for (var count = 1; count <= $('#tblCommissionSlab_rowOrder').val().split(',').length; count++) {
            $('#tblCommissionSlab_StartWeight_' + count).attr("disabled", true);
            $('#tblCommissionSlab_EndWeight_' + count).attr("disabled", true);
        }
        $('#tblCommissionSlab_EndWeight_' + RowCount).attr("disabled", false);
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "DELETE" || getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        for (var count = 1; count <= $('#tblCommissionSlab_rowOrder').val().split(',').length; count++) {

        }
    }

}


var strData = [];
var pageType = $('#hdnPageType').val();

function CreateCommissionSlabGrid() {
    var dbtableName = "CommissionSlab";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: pageType != 'READ',
        masterTableSNo: $("#hdnCommissionSlabSNo").val(),
        currentPage: 1, itemsPerPage: 50, whereCondition: null, sort: "",
        isGetRecord: true,
        servicePath: "./Services/Master/CommissionService.svc",
        getRecordServiceMethod: "GetCommissionTransRecord",
        // deleteServiceMethod: "",
        caption: " Slab Information",
        
        initRows: 1,
       
        columns: [
            { name: "SNo", type: "hidden" },

                 { name: "StartWeight", display: "Start Weight", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 12, controltype: "default",onblur: "return CheckNumeric(this.id);" }, isRequired: true },
                 { name: "EndWeight", display: "End Weight", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 10, controltype: "default", onblur: "return CheckNumeric(this.id);" }, isRequired: true },
                       { name: "Unit", display: "Type", type: "select", ctrlAttr: { maxlength: 100, onchange: "return ChangeUnitType(this.id);" }, ctrlOptions: { 0: "Revenue", 1: "Weight" }, ctrlCss: { width: "100px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },
                       { name: "Incentive", display: "Incentive Amount (%)", type: "text", ctrlCss: { width: '50px' }, ctrlAttr: { maxlength: 2, controltype: "default" }, isRequired: false },
                           { name: "Commission", display: "Commission Amount (%)", type: "text", ctrlCss: { width: '50px' }, ctrlAttr: { maxlength: 2, controltype: "default", onblur: "return CheckZero(this.id);" }, isRequired: true },
                  { name: "ValidFrom", display: "Valid From", type: "text", ctrlCss: { width: '77px', height: '20px' }, ctrlAttr: { controltype: "datetype", onChange: "return Checkstart(this.id);" }, isRequired: true },
                   { name: "ValidTo", display: "Valid To", type: "text", ctrlCss: { width: '77px', height: '20px' }, ctrlAttr: { controltype: "datetype", onChange: "return CheckEnd(this.id);" }, isRequired: true },

                 //{
                  //    name: "BasedOn", display: "Based On", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", onchange: "return ChangeUnitType(this.id);" }, ctrlCss: { width: "100px" }, isRequired: true, tableName: "Country", textColumn: "CountryName", keyColumn: "SNo", onChange: function (evt, rowIndex) {

                  //    }
                  //},
 //{ name: "BasedOn", display: "Based On", type: "select", ctrlAttr: { maxlength: 100, onchange: "return ChangeUnitType(this.id);" }, ctrlOptions: { 0: "On Gross Weight", 1: "Per Piece", 2: "Flat", 3: "Percent on Freight" }, ctrlCss: { width: "100px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },

             
                { name: "BasedONSNo", type: "hidden" },
                //{ name: pageType == !"EDIT" ? "Active" : "IsActive", display: "Active", type: "radiolist", ctrlOptions: { 0: "No", 1: "Yes" }, selectedIndex: 1 }
        //{ name: pageType !='READ' ? 'IsActive' : 'Active', display: 'Active', type:'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' }, selectedIndex: 1, onClick: function (evt, rowIndex) { }}
        ]
        ,
       

        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {

            var uniqueindex;
            var prevrowuniqueindex;
            uniqueindex = $('#tblCommissionSlab').appendGrid('getUniqueIndex', (Math.abs(addedRowIndex)));
            prevrowuniqueindex = $('#tblCommissionSlab').appendGrid('getUniqueIndex', (Math.abs(parentRowIndex)));
         
            var end = Math.abs($('#tblCommissionSlab_EndWeight_' + prevrowuniqueindex).val());
            $('#tblCommissionSlab_StartWeight_' + uniqueindex).val(end + 1);
            if (addedRowIndex > 0) {
                var elem = $('#tblCommissionSlab').appendGrid('getCellCtrl', 'StartWeight', prevrowuniqueindex);

                $('#tblCommissionSlab_StartWeight_' + parseInt(prevrowuniqueindex)).attr("disabled", true);
          
                $('#tblCommissionSlab_StartWeight_' + parseInt(uniqueindex)).attr("disabled", true)
          

                $('#tblCommissionSlab_EndWeight_' + parseInt(prevrowuniqueindex)).attr("disabled", true);
                //    $('#tblCommissionSlab_Incentive_' + uniqueindex).after(" %");;
                //    $('#tblCommissionSlab_Commission_' + uniqueindex).after(" %");;
            }
            $('[id^="tblCommissionSlab_ValidFrom_"]').closest('td').find('span[class="k-icon k-i-calendar"]').click(function () {
                setdatevalue();
            });
            $('[id^="tblCommissionSlab_ValidTo_"]').closest('td').find('span[class="k-icon k-i-calendar"]').click(function () {
                setdatevalue();
            });

         //   setdatevalue();
        },
        //  beforeRowRemove: function (caller, rowIndex) {
        

        //  },
        afterRowRemoved: function (caller, rowIndex) {
            var Rowremovecount = $('#tblCommissionSlab_rowOrder').val().split(',').length;
            $("#" + $(caller)[0].id).find("tr:eq(" + (rowIndex + 1) + ")").find(':input').attr("disabled", false);
            // $("#" + $(caller)[0].id).find("tr:eq(" + (rowIndex + 1) + ")").find(':input').attr("enabled", true);
            $('#tblCommissionSlab_StartWeight_' + Rowremovecount).attr("disabled", true);

        },
        dataLoaded: function (caller, parentRowIndex, addedRowIndex) {


            if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "DELETE") {
                $('#tblCommissionSlab_btnRemoveLast').remove();
                $('#tblCommissionSlab_btnAppendRow').remove();
            }
          // setdatevalue();
        },
       
        isPaging: true,
        //   hideButtons: { updateAll: true,  remove: pageType == "DUPLICATE"  || pageType == "EDIT" ? false : true, removeLast: true }
        hideButtons: { updateAll: true, insert : true , remove : true},
        showButtons: { removeAll: true }
       
    });
    //$("tr[id^='tblCommissionSlab_Row']").each(function (index) {
    //    var page = getQueryStringValue("FormAction").toUpperCase();
    //    $('#tblCommissionSlab_BasedOn_' + (index + 1)).val($('#tblCommissionSlab_BasedONSNo_' + (index + 1)).val());
    //    if (page == "READ" || page == "EDIT" ) {
    //        $('#tblCommissionSlab_Insert_' + (index + 1)).remove();
    //        $('#tblCommissionSlab_Delete_' + (index + 1)).remove();
    //    }

    //    if (page == "READ" || page == "DELETE") {
    //        $('#tblCommissionSlab_Insert_' + (index + 1)).remove();
    //        $('#tblCommissionSlab_Delete_' + (index + 1)).remove();
    //    }
    //});


}


function CheckNumeric(obj) {
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
        alert("Start Weight can not be greater than End Weight.");
        $("#" + obj).val("");
        $("#" + obj).attr("required", "required");
    }
    if (parseFloat(endValue) == 0) {
        $("#" + obj).val("");

    }
    if ($.isNumeric($("#" + obj).val()) == false) {
      //  ShowMessage('warning', 'Warning -Commission!', "Numbers Only");
        $("#" + obj).val('');
        return false;
    }
    
}






$('input[type="submit"][name="operation"][value !="Delete"]').click(function () {
    //===========commented by arman ali Date : 2017-07-31==============
    //if ($("#Text_OfficeSNo").val() == "" && $("#Text_Agent").val() == "") {
    //    debugger;
    //    ShowMessage('warning', 'Warning -Commission!', "Select Office or Agent");
    //    return false;
    //}
    var array = $('#tblCommissionSlab_rowOrder').val().split(",");
    //  alert(array);
    var AgentType = $('#Text_AgentType').data('kendoAutoComplete').key();
    var Agent = $('#Text_Agent').data('kendoAutoComplete').key();
    if (AgentType!="" && Agent=="") {
        ShowMessage('warning', 'Warning - Commission  !', "Please Select Agent");
        return false;
}

    for (var count = 0; count < $('#tblCommissionSlab_rowOrder').val().split(',').length; count++) {
        $('#tblCommissionSlab_StartWeight_' + array[count]).attr("disabled", false);
        $('#tblCommissionSlab_EndWeight_' + array[count]).attr("disabled", false);
    }
    if ($('#tblCommissionSlab_rowOrder').val() == "")
    {
        ShowMessage('warning', 'Warning -Commission!', "Add Slab");
        return false;
    }
    return true;
});





function CheckZero(obj)
{
    if ($("#" + obj).val() == 0) {
        ShowMessage('warning', 'Warning -Commission!', "value Cannot Be Zero");
        $("#" + obj).val('');
        return false;
    } 
}

function Checkstart(obj) {
    var k = $('#'+obj).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    var dfrom = new Date(Date.parse(k));
    var validFrom = $('#' + obj).attr("id").replace("From", "To");
   // alert(validFrom);
    k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    var dto = new Date(Date.parse(k));
    if (dfrom > dto) {
        $('#' + obj).val("");
        alert('Valid From date can not be greater than Valid To date.');
    }
  //  setdatevalue();
}
function CheckEnd(obj) {

    var k = $('#' + obj).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    var dto = new Date(Date.parse(k));
    var validFrom = $('#' + obj).attr("id").replace("To", "From");
    k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
    var dfrom = new Date(Date.parse(k));
    if (dfrom > dto) {
        $('#' + obj).val("");
        alert('Valid From date can not be greater than Valid To date.');
    }
 //  setdatevalue();
}
function setdatevalue() {
    var date = new Date();
    $('[id^="tblCommissionSlab_ValidTo_"]').each(function () {
        var rowno = $(this).attr('id').split('_')[2]
        var minm = $("#" + $(this).attr('id')).val()
        var validfrom = $("#tblCommissionSlab_ValidFrom_" + rowno).val() == "" ? date : $("#tblCommissionSlab_ValidFrom_" + rowno).val()
        var validto = $("#tblCommissionSlab_ValidFrom_" + rowno).data("kendoDatePicker")
        validto.min(date);
        var abc = $("#" + $(this).attr('id')).data("kendoDatePicker")
        abc.min(validfrom)

    });
}

function CheckActionType() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE" || getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        $("#OriginCountrySNo").closest('tr').prev('tr').children().remove();
        $("#OriginCountrySNo").closest('tr').prev('tr').append("<td class='formSection'colspan='2'>Origin</td><td class='formSection'colspan='2'>Destination</td");
    }
    else {
        $("#Text_OriginCountrySNo").closest('tr').prev('tr').children().remove();
        $("#Text_OriginCountrySNo").closest('tr').prev('tr').append("<td class='formSection'colspan='2'>Origin</td><td class='formSection'colspan='2'>Destination</td");
    }
}

function ClearCity(obj) {
    var textID = obj.sender.element[0].id;
    if(textID == "Text_OriginCountrySNo")
    {
        $('#Text_OriginCitySNo').data("kendoAutoComplete").key('');
        $('#Text_OriginCitySNo').data("kendoAutoComplete").value('');
    }
    else if(textID == 'Text_DestinationCountrySNo')
    {
        $('#Text_DestinationCitySNo').data("kendoAutoComplete").key('');
        $('#Text_DestinationCitySNo').data("kendoAutoComplete").value('');
    }
}


function ExtraParameters(id) {
    var param = [];
    if (id == "Text_AirlineSNo") {
        var UserSNo = userContext.UserSNo;
        param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
        return param;
    }
}