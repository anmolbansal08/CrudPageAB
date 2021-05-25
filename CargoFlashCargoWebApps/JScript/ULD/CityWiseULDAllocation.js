$(document).ready(function ()
{
    cfi.AutoCompleteV2("Airport", "AirportCode,AirportName", "ULD_Airport", BlankOfficeAndAirline, "contains");
    cfi.AutoCompleteV2("Airline", "CarrierCode,AirlineName", "ULD_Airline", BkankGrid, "contains");

    //if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
    $("#Office").hide();
    SelectULDAllocation();

    //if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "READ")
    //{
    //    var arr = new Array();
    //    var i = 0;
    //    $('#divULDAllocationTrans table:first tbody tr[id^="tblULDAllocationTrans_Row_"]').each(function (row, tr) {
    //        i = parseInt(i) + 1;
    //     var a = 'tblULDAllocationTrans_ULDCode_' + i;
    //     var b = $('#' + a).val();
    //      var c = 'tblULDAllocationTrans_HdnULDCode_' + i;
    //       var d = $(tr).find("td").find("input:hidden[id^='tblULDAllocationTrans_HdnULDCode_']").val();

    //       arr.push({
    //           a: a,
    //           b: b,
    //           c: c,
    //           d:d
    //       })

    //    });
    //    var i;
    //    for(i=0;i<arr.length;i++)
    //        CheckCurrentStock(arr[i].a, arr[i].b, arr[i].c, arr[i].d);    

    //}
    //$('#tblULDAllocationTrans_btnAppendRow').click(function () {
    //    alert('hi')
    //    $('#tblULDAllocationTrans tbody').find('tr.empty').remove();
    //})



    $("input[name='operation']").unbind('click').click(function ()
    {


        var k = ''; var L = ''; var M = '';
       
        for (var i = 0; i < $("ul#addlist1 li").text().split(' ').length - 1; i++)
        { L = L + $("ul#addlist1 li span").text().split(' ')[i] + ','; }

        $("#EmailAddress").val(L.substring(0, L.length - 1));
        if ($('#EmailAddress').val().length == 0) {
            ShowMessage('warning', '', "Email Address is Mandatory", "bottom-right");
           
            return false;
        } else
                {
            if (cfi.IsValidSubmitSection()) {
                dirtyForm.isDirty = false;//to track the changes
                _callBack();
                if (cfi.IsValidSubmitSection()) {
                    // GetAppendGridData();
                    var res = $("#tblULDAllocationTrans tr[id^='tblULDAllocationTrans']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
                    getUpdatedRowIndex(res, 'tblULDAllocationTrans');
                    var strData = $('#tblULDAllocationTrans').appendGrid('getStringJson');
                    strData = JSON.stringify(JSON.parse(strData))
                    if (strData == "[]" || strData == 'false' || strData === undefined) {
                        ShowMessage('warning', '', "ULD Allocation can not be blank", "bottom-right");
                        return false;
                    }
                    else {
                        $("#hdnFormData").val(btoa(JSON.stringify(JSON.parse(strData))));
                        return true;
                    }

                }
            }
              else {

                return false;
            }
        }
    });



    //function GetAppendGridData() {
    //    var res = $("#tblULDAllocationTrans tr[id^='tblULDAllocationTrans']").map(function () { return $(this).attr("id").split('_')[2] }).get().join(",");
    //    getUpdatedRowIndex(res, 'tblULDAllocationTrans');
    //    var data = $('#tblULDAllocationTrans').appendGrid('getStringJson');
    //    $("#hdnFormData").val(JSON.stringify(JSON.parse(data)));

    //}



});




function ExtraCondition(textId) {
    var filterEmbargo = cfi.getFilter("AND");
    //if (textId == "Text_Office") {

    //    cfi.setFilter(filterEmbargo, "AirportSNo", "eq", $("#Airport").val())//$("#Text_Airport").data("kendoAutoComplete").value().split("-")[0]
    //    var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
    //    // $('#Text_Airline').val("");
    //    return OriginCityAutoCompleteFilter2;

    //}
    //if (textId == "Text_Airline") {
    //    cfi.setFilter(filterEmbargo, "OfficeSNo", "eq", $("#Office").val())
    //    var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
    //    //$('#divULDAllocationTrans').html('');
    //    //strData = "[]"


    //    //$('#tblULDAllocationTrans tbody tr').remove();
    //    //$('#tblULDAllocationTrans tbody').append('<tr class="empty"><td colspan="9">This Grid Is Empty</td></tr>')
    //    //$('#tblULDAllocationTrans_btnRemoveLast').css('display','none')


    //    return OriginCityAutoCompleteFilter2;
    //}

    //if (textId == "Text_Airport") {
    //    $('#Text_Airline').val("");
    //    $('#Text_Office').val("");
    //}

    if (textId.indexOf("tblULDAllocationTrans_ULDCode_") >= 0) {
        var CarrierCode = $('#Text_Airline').val()
        CarrierCode = CarrierCode.slice(0, 2);
        var CityCode = $('#Text_Airport').data("kendoAutoComplete").key();

       /// cfi.setFilter(filterEmbargo, "CurrentAirportSNo", "eq", CityCode)
        cfi.setFilter(filterEmbargo, "CarrierCode", "eq", CarrierCode)
        // cfi.setFilter(filterEmbargo, "CurrentCityCode", "eq", CityCode.split("and"), "AirlineCode", "eq", AirlineCode.split("-")[0])
        // var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        // return OriginCityAutoCompleteFilter2;

    }

    if (textId.indexOf("tblULDAllocationTrans_ULDCode_") >= 0) {
        var noOfRows = $('#tblULDAllocationTrans_rowOrder').val();
        for (var i = 0; i <= noOfRows.split(',').length; i++) {

            if ($('#tblULDAllocationTrans_HdnULDCode_' + noOfRows.split(',')[i]).val() != undefined &&
                $('#tblULDAllocationTrans_HdnULDCode_' + noOfRows.split(',')[i]).val() != '' &&
                'tblULDAllocationTrans_HdnULDCode_' + noOfRows.split(',')[i] != 'tblULDAllocationTrans_HdnULDCode_' + textId.split('_')[2])
                cfi.setFilter(filterEmbargo, "UldTypeSNo", "notin", $('#tblULDAllocationTrans_HdnULDCode_' + noOfRows.split(',')[i]).val());
        }
        var SPHCAutoCompleteFilter = cfi.autoCompleteFilter(filterEmbargo);
        return SPHCAutoCompleteFilter;
    }


    ////if (textId.indexOf("tblContactInformation_CountryName") >= 0) {
    ////    $('#tblContactInformation_HdnCityName_' + textId.split('_')[2]).val("");
    ////    $('#tblContactInformation_CityName_' + textId.split('_')[2]).val()
    ////}
    //if (textId.indexOf("tblContactInformation_CityName") >= 0) {
    //    cfi.setFilter(filterEmbargo, "IsActive", "eq", 1);
    //    cfi.setFilter(filterEmbargo, "CountrySNo", "in", $('#tblContactInformation_HdnCountryName_' + textId.split('_')[2]).val());
    //    var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filterEmbargo);
    //    return RegionAutoCompleteFilter;
    //}
}


function BlankOfficeAndAirline(valueId, value, keyId, key) {

    if (key != "") {
        $.ajax({
            url: "./Services/ULD/CityWiseULDAllocationService.svc/GetCity?key=" + key, async: false, type: "get", dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var basis = JSON.parse(result);
                var res = basis.Table0;

                //basis = basis.replace('[', '').replace(']', '').replace('{', '').replace('}', '').split(':')[1].replace('"', '').replace('"', '');
                $("span[id=City]").html(" " + res[0].CityName);
                //$("#City").text();
            },
            //error: function (er) {
            //    debugger
            //}
        });
    }
    else
        $("span[id=City]").html("");


    $('#Text_Office').val("");
    $('#Text_Airline').val("");
    $('#tblULDAllocationTrans').html("");
    strData = "[]"
    $('#hdnofficSNo').val('')
    SelectULDAllocation();
}

function BkankAirline() {

    $('#Text_Airline').val("");
    $('#tblULDAllocationTrans').html("");
    strData = "[]"
    $('#hdnofficSNo').val('')
    SelectULDAllocation();
}

function BkankGrid() {

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        var CarrierCode = $('#Text_Airline').val();
        CarrierCode = CarrierCode.slice(0, 2);
        var AirportCode = $('#Text_Airport').val();
        AirportCode = AirportCode.slice(0, 3);
        $.ajax({
            url: "./Services/ULD/CityWiseULDAllocationService.svc/CheckAirlineExists", async: false, type: "post", dataType: "json", cache: false,
            data: JSON.stringify({ CarrierCode: CarrierCode, AirportCode: AirportCode }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result == '545') {
                    //ShowMessage("City wise ULD Allocation details already available for Airline '" + $('#Text_Airline').val() + "' . Kindly make relevant changes via Edit/Update mode.")

                    ShowMessage('warning', "City wise ULD Allocation details already available for Airline '" + $('#Text_Airline').val() + "' . Kindly make relevant changes via Edit/Update mode.", " ", "bottom-right");
                    $('#Text_Airline').val('');
                    return false;
                }
                else {
                    return true;
                }
            },



        });
    }

    $('#tblULDAllocationTrans').html("");
    strData = "[]"
    $('#hdnofficSNo').val('')
    SelectULDAllocation();



    //  alert(c);
    // var res = str.slice(0, 3);


}


var pageType = $('#hdnPageType').val();
function SelectULDAllocation(obj) {

    var ULDAllocationTrans = "ULDAllocationTrans";
    $('#tbl' + ULDAllocationTrans).appendGrid({
        tableID: 'tbl' + ULDAllocationTrans,
        contentEditable: pageType != 'READ',
        tableColume: 'SNo,OfficeSNo,AirlineSNo,ValidFrom,ValidTo,IsActive',
        masterTableSNo: $('#hdnofficSNo').val(),
        currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
        servicePath: './Services/ULD/CityWiseULDAllocationService.svc',
        getRecordServiceMethod: 'GetCityWiseULDAllocationRecordTrans',
        createUpdateServiceMethod: 'CreateUpdate' + ULDAllocationTrans,
        deleteServiceMethod: 'DeleteCityWiseULDAllocationRecordTrans',
        caption: 'ULD Allocation',
        isGetRecord: true,
        initRows: 1,
        //  controltype: pageType == "NEW" || pageType == "EDIT"
        columns: [
                 { name: 'SNo', type: 'hidden', value: 0 },
                 //{ name: 'OfficeSNo', type: 'hidden', value: $('#hdnofficSNo').val() },
                 {
                     name: 'ULDCode', display: 'ULD Code', type: 'text', ctrlAttr: { controltype: 'autocomplete' }, ctrlCss: { width: '120px', height: '20px' }, addOnFunction: function (a, b, c, d) {
                         CheckCurrentStock(a, b, c, d)
                     }, isRequired: true, AutoCompleteName: 'ULD_CityWiseUldAllocation', filterField: 'UldNameContainerType',filterCriteria: "contains"
                 },

                 {
                     name: 'CurrentULDStock', display: 'Current ULD Stock', type: 'label', ctrlCss: { width: '60px', height: '20px' }
                 },
                 {
                     name: 'MinAllocation', display: 'Min Required', type: 'text', isRequired: true, ctrlAttr: { minlength: 1, maxlength: 5, controltype: 'number', onblur: "return CheckValidation(this.id);", controltype: pageType == "NEW" || pageType == "EDIT" ? "number" : "" }, ctrlCss: { width: '60px', height: '20px' }
                 },
                   {
                       name: 'MinAlert', display: 'Min Alert(%)', type: 'text', isRequired: true, ctrlAttr: { controltype: 'number', onblur: "return CheckAlertValidation(this.id);", controltype: pageType == "NEW" || pageType == "EDIT" ? "number" : "" }, ctrlCss: { width: '60px', height: '20px' }
                   },
                    {
                        name: 'MaxAllocation', display: 'Max Required', type: 'text', isRequired: true, ctrlAttr: { minlength: 1, maxlength: 5, controltype: 'number', onblur: "return CheckValidation(this.id);", controltype: pageType == "NEW" || pageType == "EDIT" ? "number" : "" }, ctrlCss: { width: '60px', height: '20px' }
                    },
                   {
                       name: 'MaxAlert', display: 'Max Alert(%)', type: 'text', isRequired: true, ctrlAttr: { controltype: 'number', onblur: "return CheckAlertValidation(this.id);", controltype: pageType == "NEW" || pageType == "EDIT" ? "number" : "" }, ctrlCss: { width: '60px', height: '20px' }
                   },

                   //{
                   //    name: 'AlertEmail',  type: 'hidden', isRequired: true, ctrlAttr: { controltype: 'email', onblur: "return validateEmail(this.id);", controltype: pageType == "NEW" || pageType == "EDIT" ? "email" : "" }, ctrlCss: { width: '150px', height: '20px' }
                   //},
                    {
                        name: 'AlertEmail', type: 'hidden', value:''
                    },
        ],
        isPaging: true,
        hideButtons: { updateAll: true, append: false, insert: true, remove: false, removeLast: false },
        isPaging: true,
        afterRowAppended: function (caller, parentRowIndex, addedRowIndex)
        {
            //  $('#tblULDAllocationTrans tbody').find('tr.empty').remove();
            $('#tblULDAllocationTrans tbody tr.empty').remove();
            setTimeout(function () { 
                $('#tblULDAllocationTrans_btnRemoveLast').css("display", "none")
            }, 200)
        },
    });
}

function validateEmail(obj)
{
    var val = $('#' + obj).val();
    var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (filter.test(val)) {
        return true;
    }
    else
    {

        alert("Please Enter Valid Email")
        $('#' + obj).val("");
        return false;
    }

}

function CheckValidation(obj) {


    var MinValue = 0;
    var MaxValue = 0;
    if (obj.indexOf("Min") > 0) {
        MinValue = $("#" + obj).val();
        MaxValue = $("#" + obj.replace("Min", "Max")).val();
    }
    else {
        MaxValue = $("#" + obj).val();
        MinValue = $("#" + obj.replace("Max", "Min")).val();
    }
    if (parseFloat(MinValue) > parseFloat(MaxValue)) {
        alert("Max Required cannot be less than Min Required");

        $("#" + obj).val("");
        $("#" + obj).focus();
        return;
    }


    //if (id == "tblULDAllocationTrans_MaxAllocation_1")
    //var Max = $('#' + id).val();
    //alert(Max)
}


function CheckAlertValidation(obj) {

    var MinValue = 0;
    var MaxValue = 0;
    //var MaxLength = 0;
    //MaxLength = $("#" + obj).val();
    //if (parseFloat(MaxLength) > 99)
    //{
    //    alert("Min Alert (%) can not be more than 99 (%)");
    //    $("#" + obj).val("");
    //    return;
    //}



    if (obj.indexOf("Min") > 0) {
        MinValue = $("#" + obj).val();
        if (MinValue > 99) {
            alert("Min Alert (%) can not be more than 99 (%)");
            $("#" + obj).val("");
            return;

        }

        MaxValue = $("#" + obj.replace("Min", "Max")).val();

    }
    else {
        MaxValue = $("#" + obj).val();
        MinValue = $("#" + obj.replace("Max", "Min")).val();

        if (MaxValue > 99) {
            alert("Max Alert (%) can not be more than 99 (%)");
            $("#" + obj).val("");
            return;
        }
    }
    //if (parseFloat(MinValue) > parseFloat(MaxValue)) {
    //    alert("Max Alert can not be less then Min Alert");

    //    $("#" + obj).val("");
    //    $("#" + obj).focus();
    //    return;
    //}



    //if (id == "tblULDAllocationTrans_MaxAllocation_1")
    //var Max = $('#' + id).val();
    //alert(Max)
}

function CheckCurrentStock(a, b, c, d) {
    
    var rowNo = a.split("_")[2];
    var CarrierCode = $('#Text_Airline').val()
    CarrierCode = CarrierCode.slice(0, 2);
    var CityCode = $("#Text_Airport").data("kendoAutoComplete").key();
    //CityCode = CityCode.slice(0, 3);
    //  alert(c);
    // var res = str.slice(0, 3);
    var UldSNo = d;
    if (UldSNo != "" && CarrierCode != "" && CityCode != "") {
        $.ajax({
            url: "./Services/ULD/CityWiseULDAllocationService.svc/GetCurrentStock", async: false, type: "post", dataType: "json", cache: false,
            data: JSON.stringify({ UldSNo: UldSNo, CarrierCode: CarrierCode, CityCode: CityCode }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var basis = JSON.parse(result);
                var res = basis.Table0;
                $("#tblULDAllocationTrans_CurrentULDStock_" + (rowNo)).text(res[0].NoOfUld);
                //$('span[id^="_temptblULDAllocationTrans_CurrentULDStock_"' + rowNo + '"]').val(res[0].NoOfUld)


            },

        });
    }
    else {
        $("#tblULDAllocationTrans_CurrentULDStock_" + (rowNo)).text('0');
        return;
    }

}
if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
    
    divmail = $("<div id='divmailAdd' style='overflow:auto;'><ul id='addlist1' style='padding:3px 2px 2px 0px;margin-top:0px;'></ul></div>");
    var spnlbl1 = $("<span class='k-label'><strong>(Press space key to  add New E-mail ( If Required))</strong></span>");
    $("#EmailAddress").after(spnlbl1);
    if ($("#divmailAdd").length === 0)
        $("#EmailAddress").after(divmail);
            SettEMail();
}

function SettEMail() {
    $("#EmailAddress").keyup(function (e) {
        var addlen = $("#EmailAddress").val().toUpperCase();
        var iKeyCode = (e.which) ? e.which : e.keyCode
        if (iKeyCode == 32) {
            addlen = addlen.slice(0, -1);
            if (addlen != "") {
                if (ValidateEMail(addlen)) {
                    
                        var listlen = $("ul#addlist1 li").length;
                        $("ul#addlist1").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + addlen + " </span><span id='" + listlen + "' class='k-icon k-delete remove'></span></li>");

                    
                    
                    $("#EmailAddress").val('');
                }
                else {
                    alert("Please enter valid Email Address");
                }
            }
        }
        else
            e.preventDefault();
    });
    $("#EmailAddress").blur(function () {
        $("#EmailAddress").val('');
    });

    $("body").on("click", ".remove", function () {
        $(this).closest("li").remove();
    });
}

if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {

    var textval1 = $("#EmailAddress").val().toUpperCase();
    var len = textval1.split(",").length;
    if (textval1 != "") {
        for (var jk = 0; jk < len; jk++) {
            $("ul#addlist1").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + textval1.split(',')[jk] + " </span><span id='" + jk + "' class='k-icon k-delete remove'></span></li>");
        }

        $("#EmailAddress").val("");
        $("#EmailAddress").removeAttr("required");
    }
}
    function ValidateEMail(email) {
        var regex = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;;
        return regex.test(email);
    }

   
    
