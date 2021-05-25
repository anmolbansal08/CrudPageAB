
//var RemoveRowNo = 0;
$(document).ready(function () {
    cfi.ValidateForm();
    $('#aspnetForm').attr("enctype", "multipart/form-data");
    BindAutoComplete();
    $('.k-picker-wrap').width(100);
    //$("#ValidFrom").data("kendoDatePicker").value("");
    //$("#ValidTo").data("kendoDatePicker").value("");
    //var todaydate = new Date();
    //var validfromdate = $("id*='[StartDate]'").data("kendoDatePicker");
    //validfromdate.min(todaydate);
    //var validTodate = $("id*='[EndDate]'").data("kendoDatePicker");
    //validTodate.min(todaydate);

    
   
});


function BindAutoComplete() {
    cfi.AutoComplete("OfficeSNo", "Name", "VOfficeAgent", "OfficeSNo", "Name", null, clearAgent);
    cfi.AutoComplete("Agent", "Name", "vAccount", "SNo", "Name", null, ResetAgent);
    cfi.AutoComplete("AirlineSNo", "AirlineName", "Airline", "SNo", "AirlineName", null, ResetDone);
}


function ExtraCondition(textId) {
    var filterForwarderCode = cfi.getFilter("AND");
    var filterForwarderName = cfi.getFilter("AND");

    if (textId == "Text_Agent") {
        cfi.setFilter(filterForwarderCode, "OfficeSNo", "eq", $('#OfficeSNo').val());
        var ForwarderFilter = cfi.autoCompleteFilter(filterForwarderCode);
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


$('input[type="submit"][name="operation"]').click(function () {
    var KeyValue = "";
    var KeyColumn = "Commission";
    KeyValue = document.getElementById('__SpanHeader__').innerText
    var SKeyValue = KeyValue.split(':')

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {

        AuditLogSaveNewValue("tbl", true, '', KeyColumn, SKeyValue[1]);
    }
});


$('input[type="submit"][name="operation"][value="Save"]').click(function () {
    BindAutoComplete();
   
});



$('#MasterSaveAndNew').click(function () {
    BindAutoComplete();
    
});

if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
    BindAutoComplete();
    $('#Text_OfficeSNo').data("kendoAutoComplete").enable(false);
    $('#Text_Agent').data("kendoAutoComplete").enable(false);
    $('#Text_AirlineSNo').data("kendoAutoComplete").enable(false);

//    $('#Text_Unit').data("kendoAutoComplete").enable(false);
//    $('#Text_Type').data("kendoAutoComplete").enable(false);
    $('input[type="radio"][name="CustomerType"]').attr("disabled", true);
    $('input[type="radio"][name="CommissionUnit"]').attr("disabled", true);
  //  setTimeout(function () { $("#ValidFrom").data("kendoDatePicker").enable(false); }, 100);
}






CreateCommissionSlabGrid();

var strData = [];
var pageType = $('#hdnPageType').val();

function CreateCommissionSlabGrid() {
    var dbtableName = "CommissionSlab";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: true,
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

                 { name: "StartWeight", display: "Start Weight", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "default",onblur: "return CheckNumeric(this.id);" }, isRequired: true },
                 { name: "EndWeight", display: "End Weight", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "default", onblur: "return CheckNumeric(this.id);" }, isRequired: true },
                       { name: "Unit", display: "Type", type: "select", ctrlAttr: { maxlength: 100, onchange: "return ChangeUnitType(this.id);" }, ctrlOptions: { 0: "Revenue", 1: "Weight" }, ctrlCss: { width: "100px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },
                       { name: "Incentive", display: "Incentive Amount (%)", type: "text", ctrlCss: { width: '50px' }, ctrlAttr: { maxlength: 2, controltype: "default", onblur: "return CheckZero(this.id);" }, isRequired: true },
                           { name: "Commission", display: "Commission Amount (%)", type: "text", ctrlCss: { width: '50px' }, ctrlAttr: { maxlength: 2, controltype: "default", onblur: "return CheckZero(this.id);" }, isRequired: true },
                  { name: "ValidFrom", display: "Valid From", type: "text", ctrlCss: { width: '77px', height: '20px' }, ctrlAttr: { controltype: "datetype", onChange: "return Checkstart(this.id);" }, isRequired: true },
                   { name: "ValidTo", display: "Valid To", type: "text", ctrlCss: { width: '77px', height: '20px' }, ctrlAttr: { controltype: "datetype", onChange: "return CheckEnd(this.id);" }, isRequired: true },

                 //{
                  //    name: "BasedOn", display: "Based On", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", onchange: "return ChangeUnitType(this.id);" }, ctrlCss: { width: "100px" }, isRequired: true, tableName: "Country", textColumn: "CountryName", keyColumn: "SNo", onChange: function (evt, rowIndex) {

                  //    }
                  //},
 //{ name: "BasedOn", display: "Based On", type: "select", ctrlAttr: { maxlength: 100, onchange: "return ChangeUnitType(this.id);" }, ctrlOptions: { 0: "On Gross Weight", 1: "Per Piece", 2: "Flat", 3: "Percent on Freight" }, ctrlCss: { width: "100px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },

             
                { name: "BasedONSNo", type: "hidden" }

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



if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "DELETE")
{
    for (var count = 1; count <= $('#tblCommissionSlab_rowOrder').val().split(',').length; count++)
        {
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


$('input[type="submit"][name="operation"]').click(function () {
    var array = $('#tblCommissionSlab_rowOrder').val().split(",");
  //  alert(array);
    
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




if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "DELETE" || getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
    for (var count = 1; count <= $('#tblCommissionSlab_rowOrder').val().split(',').length; count++) {
      
    }
}
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
  
}


