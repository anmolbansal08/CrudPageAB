
var uniqueindex='';
var prevrowuniqueindex='';

$(document).ready(function () {
   
  
      var SurchargeType = [{ Key: "1", Text: "Commodity" }, { Key: "2", Text: "SHC" }, { Key: "0", Text: "Pieces" }];
    var PageType = '';
    cfi.AutoCompleteV2("ProductSNo", "ProductName", "RateSurcharge_Product", null, "contains");
    cfi.AutoCompleteByDataSource("SurchargeTypeSNo", SurchargeType, ChangeSurcharge);
    cfi.AutoCompleteV2("OriginSNo", "AirportCode", "RateSurcharge_Airport", null, "contains");
    cfi.AutoCompleteV2("CommoditySNo", "CommodityDescription", "RateSurcharge_Commodity", null, "contains", ",");
    cfi.AutoCompleteV2("SHCSNo", "Code", "RateSurcharge_SPHC", null, "contains", ",");
    cfi.BindMultiValue("SHCSNo", $("#Text_SHCSNo").val(), $("#SHCSNo").val());
    cfi.BindMultiValue("CommoditySNo", $("#Text_CommoditySNo").val(), $("#CommoditySNo").val());
     
    PageType = getQueryStringValue("FormAction").toUpperCase();
   
    $("input[id^=ValidTo]").change(function (e) {
        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("To", "From");
        k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        if (dfrom > dto) {
            $(this).val("");
            ShowMessage('warning', 'Warning - Rate Surcharge', "Valid From date can not be greater than Valid To date.", "bottom-right");
           // alert('Valid From date can not be greater than Valid To date.');
        }
    })

    $("input[id^=ValidFrom]").change(function (e) {
        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("From", "To");
        k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        if (dfrom > dto) {
            $(this).val("");
            ShowMessage('warning', 'Warning - Rate Surcharge', "Valid From date can not be greater than Valid To date.", "bottom-right");
            //alert('Valid From date can not be greater than Valid To date.');
        }
    })

    if (PageType != "READ") {

             $("#ValidFrom").kendoDatePicker({
            change: function (e) {
                selectedDate = $("#ValidTo").data("kendoDatePicker").min($("#ValidFrom").val());
                console.warn(selectedDate);
                $("#ValidTo").data("kendoDatePicker").value('');
            }
        });
        if (PageType == 'NEW'==PageType=="EDIT")
        {
            $("#ValidFrom").data('kendoDatePicker').value('');
            $("#ValidTo").data('kendoDatePicker').value('');
            $("#ValidFrom").data('kendoDatePicker').min(new Date());
            $("#ValidTo").data('kendoDatePicker').min(new Date());

        }
        $("#ValidFrom").data('kendoDatePicker').min($("#ValidFrom").val());     
        $("#ValidTo").data('kendoDatePicker').min($("#ValidFrom").val());
       
       
    }
    
    $('#ValidFrom').css('width', '150px');
    $('.k-datepicker').css('width', '150px');
   
    CreateSlabGrid();
   
    if ($('#SurchargeTypeSNo').val() == "" || $('#SurchargeTypeSNo').val() == "0") {
        $('#ValidTo').closest('tr').nextAll().hide();
    }
    else
        ChangeSurcharge();
});

function ChangeSurcharge() {
   
    var svalue = $('#SurchargeTypeSNo').val();
    if (svalue == "2") {
        $('#Text_CommoditySNo').removeAttr("data-valid");
        $('#Text_SHCSNo').attr('data-valid', 'required');
        $('#ValidTo').closest('tr').nextAll().show();
        $('#Text_CommoditySNo').closest('tr').find('td:nth-last-child(4)').hide();
        $('#Text_CommoditySNo').closest('tr').find('td:nth-last-child(3)').hide();
        $('#Text_CommoditySNo').closest('tr').find('td:nth-last-child(2)').show();
        $('#Text_CommoditySNo').closest('tr').find('td:nth-last-child(1)').show();

    }
    else if (svalue == "1") {
        $('#Text_CommoditySNo').attr('data-valid', 'required');
        $('#Text_SHCSNo').removeAttr("data-valid");
        $('#ValidTo').closest('tr').nextAll().show();
        $('#Text_SHCSNo').closest('tr').find('td:nth-last-child(4)').show();
        $('#Text_SHCSNo').closest('tr').find('td:nth-last-child(3)').show();
        $('#Text_SHCSNo').closest('tr').find('td:nth-last-child(2)').hide();
        $('#Text_SHCSNo').closest('tr').find('td:nth-last-child(1)').hide();

    }
    else if (svalue == "0") {
        $('#Text_CommoditySNo').removeAttr("data-valid");
        $('#Text_SHCSNo').removeAttr("data-valid");
        $('#ValidTo').closest('tr').nextAll().show();
        $('#Text_SHCSNo').closest('tr').find('td:nth-last-child(4)').hide();
        $('#Text_SHCSNo').closest('tr').find('td:nth-last-child(3)').hide();
        $('#Text_SHCSNo').closest('tr').find('td:nth-last-child(2)').hide();
        $('#Text_SHCSNo').closest('tr').find('td:nth-last-child(1)').hide();

    }
}

var strData = [];
var pageType = $('#hdnPageType').val();

function CreateSlabGrid() {
    var dbtableName = "RateSurchargeSlab";
    $("#tbl" + dbtableName).appendGrid({
        tableID: "tbl" + dbtableName,
        contentEditable: true,
        masterTableSNo: $("#hdnRateSurchargeSlabSNo").val(),
        currentPage: 1, itemsPerPage: 50, whereCondition: null, sort: "",
        isGetRecord: true,
        servicePath: "./Services/Rate/RateSurchargeService.svc",
        getRecordServiceMethod: "GetRateSurchargeSlabRecord",
        deleteServiceMethod: "DeleteRateSurchargeSlab",
        caption: " Slab Information",
        initRows: 1,
        columns: [
            { name: "SNo", type: "hidden" },
           
                 { name: "StartWeight", display: "Start Weight", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "default",onkeypress:"return validate(event);", onblur: "return CheckValidation(this.id);" },  isRequired: true },
                 { name: "EndWeight", display: "End Weight", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "default", onkeypress: "return validate(event);", onblur: "return CheckValidation(this.id);" }, isRequired: true },
                  { name: "BasedOn", display: "Based On", type: "select", ctrlAttr: { maxlength: 100, onchange: "return ChangeUnitType(this.id);" }, ctrlOptions: { 0: "On Gross Weight", 1: "Per Piece", 2: "Flat", 3: "Percent on Freight" }, ctrlCss: { width: "150px",height:"20px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },
                 
               {
                   name: "Amount", display: "Value", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, controltype: "default", onkeypress: "return validate(event);", onblur: "return CheckValue(this.id);" }, isRequired: true, maxlength: 10, title: "Enter Amount"
               },
                { name: "BasedONSNo", type: "hidden" }

        ]
        ,

        afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
            if (addedRowIndex > 0) {              
                uniqueindex = $('#tblRateSurchargeSlab').appendGrid('getUniqueIndex', (Math.abs(addedRowIndex)));
                prevrowuniqueindex = $('#tblRateSurchargeSlab').appendGrid('getUniqueIndex', (Math.abs(parentRowIndex)));
                var end = Math.abs($('#tblRateSurchargeSlab_EndWeight_' + prevrowuniqueindex).val());
                $('#tblRateSurchargeSlab_StartWeight_' + uniqueindex).val(end + 1);
                $('#tblRateSurchargeSlab_StartWeight_' + uniqueindex).attr('disabled', true);
                $('#tblRateSurchargeSlab_EndWeight_' + uniqueindex).attr('disabled', false);
            
            }
            var action=$('#hdnPageType').val();
            var length = $("tr[id^='tblRateSurchargeSlab_Row']").find("select")[$("tr[id^='tblRateSurchargeSlab_Row']").find("select").length - 1].id.split("_")[2];
            for(var i=1;i<length;i++)
            {
               
                if (action == "EDIT" ||action=="NEW")
                    {
                $('#tblRateSurchargeSlab_StartWeight_' + i).attr('disabled', true);
                $('#tblRateSurchargeSlab_EndWeight_' + i).attr('disabled', true);
                $('#tblRateSurchargeSlab_BasedOn_' + i).attr('disabled', true);
                $('#tblRateSurchargeSlab_Amount_' + i).attr('disabled', true);
              $('#tblRateSurchargeSlab_Delete_' + i).hide();
                }
                if (action == "READ" || action == "DELETE") {
                    $('#tblRateSurchargeSlab_StartWeight_' + i).attr('disabled', true);
                    $('#tblRateSurchargeSlab_EndWeight_' + i).attr('disabled', true);
                    $('#tblRateSurchargeSlab_Amount_' + i).attr('disabled', true);
                }
            }
           
        },
        beforeRowRemove: function (caller, rowIndex) {

        },
        afterRowRemoved: function (caller, rowIndex) {
            if ($("tr[id^='tblRateSurchargeSlab_Row']").find("select").length > 0)
            {

            var getLastvalue = $("tr[id^='tblRateSurchargeSlab']").find("select")[$("tr[id^='tblRateSurchargeSlab_Row']").find("select").length - 1].id.split("_")[2];
           
            if ($("tr[id^='tblRateSurchargeSlab_Row']").find("select").length == 1) {
                $('#tblRateSurchargeSlab_StartWeight_' + getLastvalue).attr('disabled', false);
                //$('#tblRateSurchargeSlab_BasedOn_' + getLastvalue).attr('disabled', false);
               // $('#tblRateSurchargeSlab_Amount_' + getLastvalue).attr('disabled', false);
            }

            $('#tblRateSurchargeSlab_Delete_' + getLastvalue).show();


            
            $('#tblRateSurchargeSlab_EndWeight_' + getLastvalue).attr('disabled', false);
            $('#tblRateSurchargeSlab_BasedOn_' + getLastvalue).attr('disabled', false);
            $('#tblRateSurchargeSlab_Amount_' + getLastvalue).attr('disabled', false);
            }

          
       },
        dataLoaded: function (caller, parentRowIndex, addedRowIndex) {
            if ($("tr[id^='tblRateSurchargeSlab_Row']").find("select").length == 1)
                $("[id*='tblRateSurchargeSlab_StartWeight_']").attr('disabled', false);
            else
            $("[id*='tblRateSurchargeSlab_StartWeight_']").attr('disabled', true);
            if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
                $("[id*='tblRateSurchargeSlab_StartWeight_']").attr('disabled', true);
                $("[id*='tblRateSurchargeSlab_EndWeight_']").attr('disabled', true);
                $("[id*='tblRateSurchargeSlab_BasedOn_']").attr('disabled', true);
                $("[id*='tblRateSurchargeSlab_Amount_']").attr('disabled', true);
                $('#tblRateSurchargeSlab_btnRemoveLast').remove();
                $('#tblRateSurchargeSlab_btnAppendRow').remove(); 
            }
        },
        isPaging: true,
     //   hideButtons: { updateAll: true,  remove: pageType == "DUPLICATE"  || pageType == "EDIT" ? false : true, removeLast: true }
        hideButtons: { updateAll: true,insert:true,removeLast:true },
        showButtons: {removeAll:true,remove:true}

    });
    $("tr[id^='tblRateSurchargeSlab_Row']").each(function (index) {
        var page = getQueryStringValue("FormAction").toUpperCase();
            if (page == "READ" || page == "EDIT" ) {
                $('#tblRateSurchargeSlab_Insert_' + (index + 1)).remove();
                if ($("tr[id^='tblRateSurchargeSlab_Row']").find("select").length == 1)
                {
                    $('[id^="tblRateSurchargeSlab_StartWeight_"]').attr("disabled", false);
                }
         }
        if (page == "READ") {
            $('#tblRateSurchargeSlab_Insert_' + (index + 1)).remove();
            $('#tblRateSurchargeSlab_Delete_' + (index + 1)).remove();
        }
    });


}

function ChangeUnitType(obj) {
    var ChkValue = $("#" + obj).val();

   }
function CheckValidation(obj) {
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

    if (parseFloat(startValue) == 0)
    {
        ShowMessage('warning', 'Warning - Rate Surcharge', "Start Weight cannot be 0", "bottom-right");
        //alert("Start Weight cannot be 0");
        $("#" + obj.replace("End", "Start")).val("");
        $("#" + obj.replace("End", "Start")).attr("required", "required");
    }
    else if (parseFloat(endValue) == 0)
    {
        ShowMessage('warning', 'Warning - Rate Surcharge', "End Weight cannot be 0", "bottom-right");
       // alert("End Weight cannot be 0.");
        $("#" + obj.replace("Start", "End")).val("");
        $("#" + obj.replace("Start", "End")).attr("required", "required");
    }

    else if (parseFloat(startValue) > parseFloat(endValue))
    {
        ShowMessage('warning', 'Warning - Rate Surcharge', "Start Range can not be greater than End Range.", "bottom-right");
        //alert("Start Range can not be greater than End Range.");
        $("#" + obj).val("");
        $("#" + obj).attr("required", "required");
    }
}

function CheckValue(obj) {
    var Amount = 0;
    var startValue = 0;
    var endValue = 0;
    var index = $("#"+obj).attr('id').split('_')[2];
    amount = $('#' + obj).val();
    if (parseFloat(amount) <= 0) {
        ShowMessage('warning', 'Warning - Rate Surcharge', "Value should be greater than 0.", "bottom-right");
       // alert("Value should be greater than 0.");
        $("#" + obj).val("");
        $("#" + obj).attr("required", "required");
    }

    if($('#tblRateSurchargeSlab_BasedOn_'+index).val()==3)
    {
        if(amount>100)
        {
            ShowMessage('warning', 'Warning - Rate Surcharge', "Value should be smaller than 100.", "bottom-right");
            $("#" + obj).val("");
            $("#" + obj).attr("required", "required");
        }
    }
   
}

function validate(evt) {
   
   
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    var regex = /[0-9]|\./g;

    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }



}

$('input[type="submit"][name="operation"]]').click(function () {

    $('[id^="tblRateSurchargeSlab_StartWeight_"]').attr("disabled", false);
    $('[id^="tblRateSurchargeSlab_EndWeight_"]').attr("disabled", false);
    $('[id^="tblRateSurchargeSlab_BasedOn_"]').attr("disabled", false);
    $('[id^="tblRateSurchargeSlab_Amount_"]').attr("disabled", false);
   
    if ($('#tblRateSurchargeSlab_rowOrder').val() == "") {
        ShowMessage('warning', 'Warning -Rate Surcharge!', "Add Slab");
        return false;
    }


});


function ExtraCondition(textId) {
    var filterEmbargo = cfi.getFilter("AND");

    if (textId == "Text_CommoditySNo") {

        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_CommoditySNo").data("kendoAutoComplete").key())
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginCityAutoCompleteFilter2;
    }

    if (textId == "Text_SHCSNo") {

        cfi.setFilter(filterEmbargo, "SNo", "notin", $("#Text_SHCSNo").data("kendoAutoComplete").key())
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginCityAutoCompleteFilter2;
    }


}