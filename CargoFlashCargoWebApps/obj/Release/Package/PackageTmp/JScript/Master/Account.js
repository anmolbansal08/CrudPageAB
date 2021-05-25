var getCitydata = "";
var PageType = getQueryStringValue("FormAction").toUpperCase();
var CustomerTypeList = [{ Key: "2", Text: "Both" }, { Key: "3", Text: "Domestic" }, { Key: "1", Text: "International" }]
var TransactionTypeList = [{ Key: "0", Text: "Topup" }, { Key: "1", Text: "Credit" }, { Key: "2", Text: "CASS" }, { Key: "3", Text: "CASH" }]

var WorkingCustomerList = [{ Key: "5", Text: "Regular" }, { Key: "6", Text: "Contractual " }, { Key: "7", Text: "Corporate" }]
var InvoicingCycleType = [{ Key: "1", Text: "1 Days" }, { Key: "2", Text: "7 Days" }, { Key: "3", Text: "10 Days" }, { Key: "4", Text: "Fortnightly" }, { Key: "5", Text: "Monthly" }]
var aHyphine = 0;
var bSpace = 0;
var cSlash = 0;
$(document).ready(function () {
    cfi.ValidateForm();
    // added by arman for hiding last two tabs
    $('#liAccountCommision,#liAccountVatExempt').hide();
    // end

    $('#aspnetForm').attr("enctype", "multipart/form-data");
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        // disablecredit();
        cfi.AutoComplete("BusinessTypeSno", "BusinessType", "AccountBusinessType", "BusinessTypeId", "BusinessType", null, null, "contains");
        cfi.AutoComplete("DesignationID", "DesignationName", "AccountDesignation", "DesignationID", "DesignationName", null, null, "contains");

        cfi.AutoComplete("AirlineSNo", "CarrierCode,AirlineName", "Airline", "SNo", "AirlineName", ["CarrierCode", "AirlineName"], null, "contains");
        cfi.AutoComplete("OfficeSNo", "Name", "VOffice", "SNo", "Name", null, null, "contains");
        cfi.AutoComplete("AccountTypeSNo", "AccountTypeName", "AccountType", "SNo", "AccountTypeName", null, readtruckvender, "contains");
        //cfi.AutoComplete("CurrencySNo", "CurrencyCode,CurrencyName", "Currency", "SNo", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
        cfi.AutoComplete("CurrencySNo", "CurrencyCode,CurrencyName", "vOfficeCurrency", "SNo", "CurrencyCode", ["CurrencyCode", "CurrencyName"], null, "contains");
        cfi.AutoComplete("CitySNo", "CityCode,CityName", "vCity", "SNo", "CityCode", ["CityCode", "CityName"], null, "contains", null, null, null, null, SelectCity);
        cfi.AutoComplete("Branch", "CityCode,Name", "vHeadBranch", "SNo", "CityCode", ["CityCode", "Name"], null, "contains");
        cfi.AutoCompleteByDataSource("CustomerTypeSNo", CustomerTypeList, null, null);
        //cfi.AutoCompleteByDataSource("CustomerTypeSNo", WorkingCustomerList, null, null);

        cfi.AutoCompleteByDataSource("TransactionTypeSNo", TransactionTypeList, checkCasswithTrans, null);
        cfi.AutoComplete("CountrySNo", "CountryCode", "vCountryListDetails", "CountrySNo", "CountryName", ["CountryCode", "CountryName"], null, "contains", null, null, null, null, ChangeCity);
        cfi.AutoComplete("IndustryTypeSNO", "IndustryTypeName", "vIndustryTYpeDetails", "IndustryTypeSNO", "IndustryTypeName");
        cfi.AutoCompleteByDataSource("InvoicingCycle", InvoicingCycleType);
        //abc
        //  $('#CreditLimit').attr('disabled', true);
        //  $('#MinimumCL').attr('disabled', false);
        //  $('#AlertCLPercentage').attr('disabled', false);
        $('#spnName').text('Name');
        //================================added by  arman Date : 15 Apr 2017=================
        $("#ValidFrom").data('kendoDatePicker').min(new Date());
        //===========================================end===========================================

        /*Remove required attribute from transactiotype and customer type by arman ali  */
        $('#Text_CustomerTypeSNo').removeAttr("data-valid");
        $('#Text_TransactionTypeSNo').removeAttr("data-valid");
        $('#spnCustomerTypeSNo').closest('td').find('font').text('');
        $('#spnTransactionTypeSNo').closest('td').find('font').text('');
        var rem= '<tr><td class="formlabel"></td><td class="formlabel"></td><td class="formlabel" title="Enter Remarks"><span id="spnRemarks"><font color="red"><font><font class="">*</font></font></font> Remarks </span></td><td class="formInputcolumn"><textarea class="k-input" name="Remark" id="Remark" style="width: 250px; text-transform: uppercase;" controltype="alphanumericupper" allowchar="/-," tabindex="22" maxlength="190" data-role="alphabettextbox" data-valid="required" autocomplete="off"></textarea></td></tr>';
        cfi.AutoComplete("LoginColorCodeSno", "Name", "LoginColorCode", "SNo", "Name", null, AppendLoginColor, "contains");
        if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
            $('#AlertCLPercentage').after('%');
            $("#IsBlacklist").closest('tr').after(rem);
            if ($("input[name=IsBlacklist]:radio:checked").val() == "1"){
                $("#Remark").closest('tr').hide();
                $("#Remark").removeAttr("data-valid");
               
            }
            

            else if ($("input[name=IsBlacklist]:radio:checked").val() == "0"){
                $("#Remark").closest('tr').show();
                $("#Remark").attr("data-valid", 'required');
            }
            $("#Remark").val($("#Remarks").val());


        }

        if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
            $("#ValidTo").data("kendoDatePicker").value(getDateNextYear());
        }
        if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
            $('span#AlertCLPercentage').after('%');
           
        }
    }

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        // commented by arman ali 02-05-2017
        $('#Text_AirlineSNo').data("kendoAutoComplete").enable(false);
        // end
        if ($("#Text_TransactionTypeSNo").val() == "Topup") {
            //  $('#spn#spnCreditLimit').val('TOPUP');
            enablecredit();
            $('input:radio[name=IsAllowedCL]').attr('disabled', true);
            // alert(value);
            $("td").each(function () {
                if ($(this).text() == " Credit Limit") {
                    $(this).text("Topup Amount");
                }
                if ($(this).text() == "Allowed Credit Limit") {
                    $(this).text("Allowed Topup Amount");
                }
                if ($(this).text() == "Consolidated Credit Limit") {
                    $(this).text("Consolidated Topup");
                }
                if ($(this).text() == "Minimum Credit Limit") {
                    $(this).text("Minimum Topup Amount");
                }
                if ($(this).text() == "Alert Credit Limit(%)") {
                    $(this).text("Alert Topup Amount");
                }
            });
        }
        else if ($("#Text_TransactionTypeSNo").val() == "CASS") {
            changeLabelText();
            enablecredit();
            $('input:radio[name=IsAllowedCL]').attr('disabled', true);

            $('input:radio[name=IsAllowedConsolidatedCL]').attr('disabled', true);
        }

        else if ($("#Text_TransactionTypeSNo").val() == "CASS") {
            changeLabelText();
            enablecredit();
            $('input:radio[name=IsAllowedCL]').attr('disabled', true);

            $('input:radio[name=IsAllowedConsolidatedCL]').attr('disabled', true);
        }
        else {
            changeLabelText();
            enablecredit();
        }
    }
    // cfi.AutoComplete("InvoicingCycle", "InvoicingCycle", "Account", "InvoicingCycle", "InvoicingCycle", ["InvoicingCycle"], null, "contains");
    //Sachin Change 26-12-2016
    //Customer Type
    //prop("disabled", false);
    //$("#CustomerTypeSNo").attr("readonly", true);
    //cfi.ResetAutoComplete("CustomerTypeSNo");
    //$('#Text_CustomerTypeSNo').data("kendoAutoComplete").enable(false);
    // $('#Text_CustomerTypeSNo').attr("disabled", true);
    $('#CASSNo').attr("disabled", true);
    $("#CASSNo").removeAttr('data-valid');
    //Transaction Type
    //$('#Text_TransactionTypeSNo').data("kendoAutoComplete").enable(false);
    //$('#Text_TransactionTypeSNo').attr("disabled", true);
    //CountryName
    //IndustryTYpe
    ///By Sachin
    ////By Shahbaz Akhtar

    function ChangeCity() {
        cfi.ResetAutoComplete("CitySNo");
        cfi.ResetAutoComplete("OfficeSNo");
    }
    $('#Text_AccountTypeSNo').select(function () {
        //function changeaccount()
        //{
       
       
        if ($("#Text_AccountTypeSNo").val() == "FORWARDER" || $("#Text_AccountTypeSNo").val() == "PO MAIL") {
            enablecredit();

        }
        else if ($("#Text_AccountTypeSNo").val() == "WALKING CUSTOMER") {
            //enablecredit();
            disablecredit();

        }
            //===========added by arman For clearing field  11 May, 2017==============================

        else if ($("#Text_AccountTypeSNo").val() != "POS" && $("#Text_AccountTypeSNo").val() != 'POST OFFICE') {
            $('#Text_TransactionTypeSNo').val("");
            $('#TransactionTypeSNo').val("");
            $('#Text_CustomerTypeSNo').val("");
            $('#CustomerTypeSNo').val("");
            $('#Text_AirlineSNo').data("kendoAutoComplete").enable(true);
        }
            //=========end
        else {
            disablecredit();
        }
    });

    $('#Text_TransactionTypeSNo').select(function () {
        var value = $("#Text_TransactionTypeSNo").val();
        //alert(value);
        if ($("#Text_TransactionTypeSNo").val() == "Topup") {
            //  $('#spn#spnCreditLimit').val('TOPUP');
            enablecredit();
            $('input:radio[name=IsAllowedCL]').attr('disabled', true);
            // alert(value);
            $("td").each(function () {
                if ($(this).text() == "Credit Limit") {
                    $(this).text("Topup Amount");
                }
                if ($(this).text() == "Allowed Credit Limit") {
                    $(this).text("Allowed Topup Amount");
                }
                if ($(this).text() == "Consolidated Credit Limit") {
                    $(this).text("Consolidated Topup");
                }
                if ($(this).text() == "Minimum Credit Limit") {
                    $(this).text("Minimum Topup Amount");
                }
                if ($(this).text() == "Alert Credit Limit(%)") {
                    $(this).text("Alert Topup Amount");
                }
            });
        }
        else if ($("#Text_TransactionTypeSNo").val() == "CASS") {
            changeLabelText();
            enablecredit();
            $('input:radio[name=IsAllowedConsolidatedCL]').attr('disabled', true);
            $('input:radio[name=IsAllowedCL]').attr('disabled', true);

        }
        else {
            changeLabelText();
            enablecredit();
        }

    });

    function changeLabelText() {
        $("td").each(function () {
            if ($(this).text() == "Topup Amount") {
                $(this).text(" Credit Limit");
            }
            if ($(this).text() == "Allowed Topup Amount") {
                $(this).text("Allowed Credit Limit");
            }
            if ($(this).text() == "Consolidated Topup") {
                $(this).text("Consolidated Credit Limit");
            }
            if ($(this).text() == "Minimum Topup Amount") {
                $(this).text("Minimum Credit Limit");
            }
            if ($(this).text() == "Alert Topup Amount") {
                $(this).text("Alert Credit Limit(%)");
            }
        });
    }


    /////
    function checkCasswithTrans() {

        if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
            if ($("#Text_TransactionTypeSNo").val() == "CASS") {
                $('#CASSNo').attr("disabled", false);
                $("#CASSNo").closest('td').prev().find('span').show();
                $("#CASSNo").attr('data-valid', 'required');
                //$("#_tempMobile").attr('data-valid', 'required');
                $("#CASSNo").closest('td').prev().find('font').html('*');
                $("#CASSNo").val('');
                //$("#_tempMobile").val('');
                //$("#CASSNo").focus();
            }
            else {

                $("#CASSNo").closest('td').prev().find('span').show();
                $("#CASSNo").removeAttr('data-valid');
                //$("#_tempMobile").attr('data-valid', 'required');
                $("#CASSNo").closest('td').prev().find('font').html('*');
                $("#CASSNo").val('');
                //$("#_tempMobile").val('');
                $("#CASSNo").focus();
                $('#CASSNo').attr("disabled", true);
            }
        }
        else if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
            if ($("#Text_TransactionTypeSNo").val() == "CASS") {
                $('#CASSNo').attr("disabled", false);
                $("#CASSNo").closest('td').prev().find('span').show();
                $("#CASSNo").attr('data-valid', 'required');
                //$("#_tempMobile").attr('data-valid', 'required');
                $("#CASSNo").closest('td').prev().find('font').html('*');
                $("#CASSNo").val('');
                //$("#_tempMobile").val('');
                //$("#CASSNo").focus();
            }


            else if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
                if ($("#Text_BusinessTypeSno").val() == "0") {
                    $('#Text_BusinessTypeSno').attr("disabled", false);

                    //cfi.AutoComplete("BusinessTypeSno", "BusinessType", "AccountBusinessType", "BusinessTypeId", "BusinessType", null, null, "contains");

                }

                else {
                    cfi.AutoComplete("BusinessTypeSno", "BusinessType", "AccountBusinessType", "BusinessTypeId", "BusinessType", null, null, "contains");
                    $('#Text_BusinessTypeSno').data("kendoAutoComplete").enable(true);
                    $('#Text_BusinessTypeSno').data("kendoAutoComplete").enable(true);
                    //$('#Text_TransactionTypeSNo').attr("disabled", false);
                    // $('#Text_IndustryTypeSNO').attr("disabled", true);
                    $('#Text_BusinessTypeSno').data("kendoAutoComplete").enable(false);
                }


            }


            else if ($("#Text_AccountTypeSNo").val() == "WALKING CUSTOMER") {

                cfi.AutoCompleteByDataSource("CustomerTypeSNo", WorkingCustomerList, null, null);

                $('#Text_CustomerTypeSNo').data("kendoAutoComplete").enable(true);
                $('#Text_TransactionTypeSNo').data("kendoAutoComplete").enable(true);
                //$('#Text_TransactionTypeSNo').attr("disabled", false);
                // $('#Text_IndustryTypeSNO').attr("disabled", true);
                $('#Text_IndustryTypeSNO').data("kendoAutoComplete").enable(false);
                $('#CASSNo').attr("disabled", true);

                $("#Text_IndustryTypeSNO").closest('td').prev().find('span').hide();
                $("#Text_IndustryTypeSNO").removeAttr('data-valid', 'required');

                $("#Text_CustomerTypeSNo").closest('td').prev().find('span').show();
                $("#Text_CustomerTypeSNo").attr('data-valid', 'required');

                $("#Text_CustomerTypeSNo").closest('td').prev().find('font').html('*');

                $("#Text_TransactionTypeSNo").closest('td').prev().find('span').show();
                $("#Text_TransactionTypeSNo").attr('data-valid', 'required');

                $("#Text_TransactionTypeSNo").closest('td').prev().find('font').html('*');
            }
            else {
                $("#CASSNo").closest('td').prev().find('span').show();
                $("#CASSNo").removeAttr('data-valid');
                //$("#_tempMobile").attr('data-valid', 'required');
                $("#CASSNo").closest('td').prev().find('font').html('*');
                $("#CASSNo").val('');
                //$("#_tempMobile").val('');
                $("#CASSNo").focus();
                $('#CASSNo').attr("disabled", true);
            }

        }
    }

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW")
        $('input[name=ForwarderAsConsignee][value=1]').prop('checked', 'checked');

    $("#SMS").after('SMS');
    $("#Message").after('Email');
    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        $("#SMS").attr('disabled', true);
        $("#Message").attr('disabled', true);
    }

    if ($("#SMS").is(':checked') == true) {
        $("#Mobile").attr('data-valid', 'required');
        $("#Mobile").closest('td').prev().find('font').html('*');
        //  $("#_tempMobile").show();
        $("#Mobile").show();
        $("#Mobile").closest('td').prev().find('span').show();
        $("#_tempMobile").focus();
    }
    else {
        $("#Mobile").removeAttr('data-valid');
        $("#Mobile").closest('td').prev().find('font').html('');
        $("#_tempMobile").hide();
        $("#Mobile").hide();
        $("#Mobile").closest('td').prev().find('span').hide();
    }

    $("#Email").closest('td').prev().find('span').append(' (Max 3)');
    if ($("#Message").is(':checked') == true) {
        $("#Email").attr('data-valid', 'required');
        $("#Email").closest('td').prev().find('font').html('*');
        $("#Email").show();
        $("#Email").closest('td').prev().find('span').show();

    }
    else {
        $("#Email").removeAttr('data-valid');
        $("#Email").closest('td').prev().find('font').html('');
        $("#Email").hide();
        $("#Email").closest('td').prev().find('span').hide();
    }

    //$("#Email").on('blur', function () {
    //    if (ValidateEMail($("#Email").val())) {

    //    }
    //    else {
    //        $("#Email").val('');
    //        ShowMessage('warning', 'Warning - Account', "Enter valid Email address");
    //    }
    //});

    $("#tblContactInformation_btnAppendRow").live("click", function () {
        var lastRow = $("table tr[id^='tblContactInformation_Row_']").last().attr("id").split('_')[2];
        CountryCity(lastRow);
        //$("#tblContactInformation").find("input[id^='tblContactInformation_Name']").each(function () {
        //    var ind = $(this).attr('id').split('_')[2];
        //    if (userContext.CitySNo != "") {
        //        $.ajax({
        //            url: "Services/Master/AccountService.svc/GetCountryAndCity", async: false, type: "POST", cache: false, contentType: "application/json; charset=utf-8",
        //            data: JSON.stringify({ CitySNo: userContext.CitySNo }),
        //            success: function (result) {
        //                var Data = jQuery.parseJSON(result);
        //                var resData = Data.Table0;
        //                if (resData.length > 0) {
        //                    $("#tblContactInformation_HdnCountryName_" + lastRow).val(resData[0].CountrySNo);
        //                    $("#tblContactInformation_CountryName_" + lastRow).val(resData[0].CountryName);
        //                    $("#tblContactInformation_HdnCityName_" + lastRow).val(resData[0].SNo);
        //                    $("#tblContactInformation_CityName_" + lastRow).val(resData[0].CityName);
        //                   // alert("sd"+countryid );
        //                    var countryid = $("#tblContactInformation_HdnCountryName_" + lastRow).val();
        //                   // GetIsdCode(countryid, lastrow);
        //                }
        //            }
        //        });
        //    }
        //    var countryid = $("#tblContactInformation_HdnCountryName_" + lastRow).val();

        //    alert("sd" + countryid);
        //});
        // GetIsdCode(countryid, lastrow);
    });




    $('#CreditLimit,#_tempCreditLimit').unbind('focusin').bind('focusin', function () {
        if (getQueryStringValue("FormAction").toUpperCase() != "NEW") {
            if ($('#CreditLimit').val() == '')
                $('#CreditLimit').val(0);
            if ($('input:radio[name=IsAllowedCL]:checked').val() == 1)
                $('#CreditLimit').attr('readonly', true);
            else if (parseInt($('#isCL').val()) != 1)
                $('#CreditLimit').attr('readonly', true);
            else
                $('#CreditLimit').attr('readonly', true);
        }
    })

    //$("#Text_Branch").prop("disabled", true);
    //$("#IsHeadAccount").closest("tr").find("td:gt(1)").css("display", "none");
    // $('#Branch').closest('td').parent().find('[title="Select Master Branch"]').text('');//.text('Master Branch');
    $("#spnBranch").prev().hide();
    $("#spnBranch").hide();
    $('#Text_Branch').removeAttr("data-valid");
    $('#Branch').closest('td').find('span').hide();

    //if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE" || getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
    //}

    //if (getQueryStringValue("FormAction").toUpperCase() != "READ" && getQueryStringValue("FormAction").toUpperCase() != "DELETE") {
    //  $("input[name='IsVendorType']").closest('td').prev().text(" ");
    //    $("input[name='IsVendorType']").parent().text("");

    //}



    readtruckvender();

    $('#CASSNo').keypress(function () {
        if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {

            var textLenghtCheck = $("#CASSNo").val();
            var textLenghtChecklenght = $("#CASSNo").val();
            if (textLenghtChecklenght.length == 2) {
                //textLenghtCheck = $("#CASSNo").val(textLenghtCheck + "-");
                $("input[name='CASSNo']").val(textLenghtCheck + "-");
                ///$("input[name='phone']").val("(" + curval + ")" + "-");
            }
            else if (textLenghtChecklenght.length == 4) {
                // textLenghtCheck = $("#CASSNo").val(textLenghtCheck + " ");
                $("input[name='CASSNo']").val(textLenghtCheck + " ");
            }
            else if (textLenghtChecklenght.length == 9) {
                // textLenghtCheck = $("#CASSNo").val(textLenghtCheck + " ");
                $("input[name='CASSNo']").val(textLenghtCheck + "/");
            }
            //if (textLenghtCheck.length > 0)
            //{
            //    if (aHyphine == 0 )
            //    {
            //        textLenghtCheck = textLenghtCheck.match(new RegExp('.{1,2}', 'g')).join("-");
            //        aHyphine = 1;
            //        $(this).val(textLenghtCheck);
            //    }
            //    else if (bSpace == 0)
            //    {
            //        textLenghtCheck = textLenghtCheck.match(new RegExp('.{1,5}', 'g')).join(" ");
            //        bSpace = 1;
            //        $(this).val(textLenghtCheck);
            //    }
            //    else if (cSlash == 0)
            //    {
            //        textLenghtCheck = textLenghtCheck.match(new RegExp('.{1,10}', 'g')).join("/");
            //        cSlash = 1;
            //       $(this).val(textLenghtCheck);
            //    }
            //    //$(this).val(textLenghtCheck);
            //}
            //if (textLenghtCheck.length > 2 && textLenghtCheck.length < 3) {

            //textLenghtCheck = textLenghtCheck.match(new RegExp('.{4,5}', 'g')).join(" ");
            //textLenghtCheck = textLenghtCheck.match(new RegExp('.{9,10}', 'g')).join("/");
            ///}
            //else if (textLenghtCheck.length  == 4)
            //{
            //    textLenghtCheck = textLenghtCheck.match(new RegExp('.{1,5}', 'g')).join(" ");
            //}
            //$(this).val(textLenghtCheck);
        }
        else if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
            var textLenghtCheck = $("#CASSNo").val();
            var textLenghtChecklenght = $("#CASSNo").val();
            if (textLenghtChecklenght.length == 2) {
                //textLenghtCheck = $("#CASSNo").val(textLenghtCheck + "-");
                $("input[name='CASSNo']").val(textLenghtCheck + "-");
                ///$("input[name='phone']").val("(" + curval + ")" + "-");
            }
            else if (textLenghtChecklenght.length == 4) {
                // textLenghtCheck = $("#CASSNo").val(textLenghtCheck + " ");
                $("input[name='CASSNo']").val(textLenghtCheck + " ");
            }
            else if (textLenghtChecklenght.length == 9) {
                // textLenghtCheck = $("#CASSNo").val(textLenghtCheck + " ");
                $("input[name='CASSNo']").val(textLenghtCheck + "/");
            }

        }
    });

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        
       // $("input[type='radio'][name='IsAutoStock'][data-radioval='Yes']").click();
        $("#CitySNo").val(userContext.CitySNo);
        $("#Text_CitySNo").val(userContext.CityCode + '-' + userContext.CityName);
        $('#OfficeSNo').val(userContext.OfficeSNo);
        $('#Text_OfficeSNo').val(userContext.OfficeName);
        $('#CurrencySNo').val(userContext.CurrencySNo);
        $('#Text_CurrencySNo').val(userContext.CurrencyCode + '-' + userContext.CurrencyName);
        if ($("#Text_AccountTypeSNo").val() == "") {
            $("input[type='radio'][name='IsWarehouse'][data-radioval='No']").click();
            $("input[type='radio'][name='IsBlacklist'][data-radioval='No']").click();
          //  $("input[type='radio'][name='IsAutoStock'][data-radioval='No']").click();
        }
    }

    var oldminCl = $("#MinimumCL").val();
    // commented by arman ali
    //$("#MinimumCL").bind("blur", function () {
    //    var crlmt = $("#CreditLimit").val();
    //    var minlmt = $("#MinimumCL").val();
    //    if (crlmt == '' || parseInt(crlmt) == 0) {
    //        $("#_tempMinimumCL").val(0);
    //        $("#MinimumCL").val(0);
    //        $("#_tempAlertClPerCentage").val(0);
    //        $("#AlertClPerCentage").val(0);
    //    }
    //    if (parseInt(crlmt) < parseInt(minlmt)) {
    //        $("#_tempMinimumCL").val(oldminCl);
    //        $("#MinimumCL").val(oldminCl);
    //        ShowMessage('warning', 'Warning - Account!', "Minimum Credit Limit can not exceed the Credit Limit");
    //    }

    //});

    // end  
    $("#CreditLimit").bind("blur", function () {
        var crlmt = $("#CreditLimit").val();
        var minlmt = $("#MinimumCL").val();


        if (crlmt == '' || parseInt(crlmt) == 0) {
            $("#CreditLimit").val(0);
            $("#_tempCreditLimit").val(0);
            $("#_tempMinimumCL").val(0);
            $("#MinimumCL").val(0);
            $("#_tempAlertClPerCentage").val(0);
            $("#AlertClPerCentage").val(0);
        }
        else {
            if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
                $('#CreditLimit').attr('readonly', false);
            }
            else {
                $('#CreditLimit').attr('readonly', true);
            }
        }
        if (parseInt(crlmt) < parseInt(minlmt)) {
            $("#_tempMinimumCL").val(oldminCl);
            $("#MinimumCL").val(oldminCl);
            ShowMessage('warning', 'Warning - Account!', "Minimum Credit Limit can not exceed the Credit Limit");
        }
    });


    $('input:radio[name=IsHeadAccount]').change(function () { RadioButtonSelectShow(); });
    var tabStrip1 = $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");
    $("#AlertCLPercentage").bind("blur", function () {
        if ($(this).val() != undefined && $(this).val() > 100) {
            // alert("Alert Credit Limit(%) can not greater than 100");
            ShowMessage('warning', 'Warning - Account!', "Alert Credit Limit(%) can not greater than 100");
            $("#AlertCLPercentage").val("");
            $("#AlertCLPercentage").val("");
            return false;
        }
        else
            $(this).val();
    });
    $("input[id^=ValidTo]").change(function (e) {
        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("To", "From");
        k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        if (dfrom > dto)
            $(this).val("");
    })
    $("input[id^=ValidFrom]").change(function (e) {
        var k = $(this).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dfrom = new Date(Date.parse(k));
        var validFrom = $(this).attr("id").replace("From", "To");
        k = $("#" + validFrom).val().replace(/^(\d+)\W+(\w+)\W+/, '$2 $1 ');
        var dto = new Date(Date.parse(k));
        if (dfrom > dto)
            $(this).val("");
    })

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowHideCreditLimitInformation();
    }

    //if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
    //    RadioButtonSelectShow();
    //}
    $(document).keydown(function (event) {
        if (event.ctrlKey == true && (event.which == '118' || event.which == '86')) {
            event.preventDefault();
        }
    });
    //$(document).on("contextmenu", function (e) {
    //    alert('Right click disabled');
    //    return false;
    //});
    BindingGridonClick();
    function BindingGridonClick() {
        if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
            //$("#liBranch").hide();
            //$("#liAccountContactInformation").hide();
            //$("#liAccountCommision").hide();
            //$("#liAccountVatExempt").hide();
            var tabStrip = $("#ApplicationTabs").data("kendoTabStrip");
            tabStrip.enable(tabStrip.tabGroup.children().eq(1), false);
            tabStrip.enable(tabStrip.tabGroup.children().eq(2), false);
            tabStrip.enable(tabStrip.tabGroup.children().eq(3), false);
            tabStrip.enable(tabStrip.tabGroup.children().eq(4), false);

        }
    }

    $(document).on('drop', function () {
        return false;
    });

    $('input:radio[name=IsAllowedCL]').click(function (e) {
        if ($(this).val() == '1') {
            $('#MinimumCL').val('');
            $('#AlertCLPercentage').val('');
            $('#_tempMinimumCL').val('');
            $('#_tempAlertCLPercentage').val('');
            $("#_tempCreditLimit").val('');
            $("#CreditLimit").val('');
            $('#MinimumCL').attr('readonly', true);
            $('#AlertCLPercentage').attr('readonly', true);
            $("input:radio[name='IsAllowedConsolidatedCL'][value ='1']").prop('checked', true);
            $('#IsAllowedConsolidatedCL').attr('disabled', true);
            $('#CreditLimit').attr('readonly', true);
        }
        else {
            if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
                var AccountSNo = $('#hdnAccountSNo').val();
                $.ajax({
                    type: "POST",
                    url: "./Services/Master/AccountService.svc/GetCreditLimit?recid=" + AccountSNo,
                    data: { id: 1 },
                    dataType: "json",
                    success: function (response) {
                        var CreditLimit = response.Data[0];
                        var MinimumCL = response.Data[1];
                        var AlertCLPercentage = response.Data[2];
                        $("#_tempCreditLimit").val(CreditLimit);
                        $("#CreditLimit").val(CreditLimit);
                        $("#MinimumCL").val(MinimumCL);
                        $("#AlertCLPercentage").val(AlertCLPercentage);
                        $("#_tempMinimumCL").val(MinimumCL);
                        $("#_tempAlertCLPercentage").val(AlertCLPercentage);

                    }
                });
            }
            if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
                //if($('#CreditLimit').val() == "0" || ($('#CreditLimit').val() == ""))
                //{
                $('#CreditLimit').attr('readonly', false);
                $('#MinimumCL').attr('readonly', false);
                $('#AlertCLPercentage').attr('readonly', false);
                $('#IsAllowedConsolidatedCL').attr('disabled', false);
                //}
            }
            else {
                $('#MinimumCL').attr('readonly', false);
                if ($('#CreditLimit').val() == "0")
                    $('#CreditLimit').attr('readonly', false);
                else
                    $('#CreditLimit').attr('readonly', true);
                $('#AlertCLPercentage').attr('readonly', false);
                $('#IsAllowedConsolidatedCL').attr('disabled', false);
            }
        }

        function onSelectContry(e) {
            $("#CitySNo").prop("disabled", false);
            $("#CitySNo").val('');
        }
    });



    //$('#tblAccountCommision_btnUpdateAll').click(function()
    //{
    //        var test = $('#tblAccountCommision_CommisionType_').val();
    //        if(test == '0')
    //        {
    //            //$("#msg").html("Please select a year");
    //            alert('Please Enter');
    //            return false;
    //        }
    //    });

    //if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE")
    //{
    //    RadioButtonSelectShow();
    //}

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        RadioButtonSelectShow();
        var spnlbl2 = $("<span class='k-label'id='EmailLabel'>(Press space key to capture receiver E-mail Address and Add New E-mail ( If Required))</span>");
        $("#Email").after(spnlbl2);
        $("#EmailLabel").hide();

        divemail = $("<div id='divemailAdd' style='overflow:auto;'><ul id='addlist2' style='padding:3px 2px 2px 0px;margin-top:0px;'></ul></div>");
        if ($("#divemailAdd").length == 0)
            $("#Email").after(divemail);
        SetEMailNew();
        $("#Email").css("text-transform", "uppercase");
        $('input[name="operation"]').click(function (e) {


            var KeyValue = "";
            var KeyColumn = "Account";
            KeyValue = document.getElementById('__SpanHeader__').innerText
            var SKeyValue = KeyValue.split(':')

            if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {             
                AuditLogSaveNewValue("tbl", true, '', KeyColumn, SKeyValue[1]);
            }

            var M = '';
            for (var i = 0; i < $("ul#addlist2 li").text().split(' ').length - 1; i++)
            { M = M + $("ul#addlist2 li span").text().split(' ')[i] + ','; }


            $("#Email").val(M.substring(0, M.length - 1));       //remove last comma   

            if ($("#addlist2 li").length > 0 && $("#Message").is(':checked') == true) {
                $("#Email").removeAttr("data-valid");
            }
            else if ($("#addlist2 li").length == 0 && $("#Message").is(':checked') == false) {
                $("#Email").removeAttr("data-valid");
            }
            else {
                $("#Email").attr("data-valid", "required");
            }
        });


    }

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {

        if ($("#Message").is(':checked') == true) {
            $("#EmailLabel").show();
            var textemail = $("#Email").val();
            $("#Email").val('');// added by arman ali
            var len = textemail.split(",").length;
            if (textemail != "") {
                for (var jk = 0; jk < len; jk++) {
                    $("ul#addlist2").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + textemail.split(',')[jk] + " </span><span id='" + jk + "' class='k-icon k-delete remove'></span></li>");
                }
                //$("#Email").val("");
                $("#Email").removeAttr('data-valid');
            }
        }
    }

    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        $("#IsBlacklist").closest('tr').after('<tr><td class="formlabel" title="Remarks">Remarks</td><td class="formInputcolumn"><span style="max-width: 250px;word-wrap: break-word;    display: inline-block;max-height: 50px;overflow: auto;" class="" id="Remark"></span></td><td class="formlabel"></td><td class="formlabel"></td></tr>');
        if ($("#IsBlacklist").val().toUpperCase() == "YES")
            $('#Remark').closest('tr').show();
        else if ($("#IsBlacklist").val().toUpperCase() == "NO")
            $('#Remark').closest('tr').hide();
        $('#Remark').text($("#Remarks").val());
        if ($("input[name='IsHeadAccount']").val() == "NO") {
            //$("#IsHeadAccount").closest("tr").find("td:gt(1)").css("display", "");
            //  $('#Text_Branch').closest('td').parent().find('[title="Master Branch"]').text('Master Branch');
            $("#spnBranch").show();
            $("#spnBranch").prev().show();
            $('#Text_Branch').closest('td').find('span').show();
        }
        else {
            //$("#IsHeadAccount").closest("tr").find("td:gt(1)").css("display", "none");
            //  $('#Text_Branch').closest('td').parent().find('[title="Master Branch"]').text('');//.text('Master Branch');
            $("#spnBranch").prev().hide();
            $("#spnBranch").hide();
            $('#Text_Branch').removeAttr("data-valid");
            $('#Text_Branch').closest('td').find('span').hide();
            $('#Branch').closest("td").prev().text('');

        }
        $('br:gt(1)').remove();
    }
    //Added By Pankaj Khanna (18-11-2016)
    $('#spnDisplayName').hide();
    $('#DisplayName').hide();
    $('span#DisplayName').hide();
    //END BY Pankaj Khanna


    //async: false, type: "POST", dataType: "json", cache: false,
    //data: JSON.stringify({ CountrySNo: objCountrySNo }),
    //contentType: "application/json; charset=utf-8",
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
        $('#GarudaMile').on('blur', function () {
           
            if ($("#GarudaMile").val() == "0" || $("#GarudaMile").val().length < 9) {
                ShowMessage('warning', 'Need your Kind Attention!', 'Garuda Miles should be 9 Digits');
                $("#GarudaMile").val('');
                return;
            }
            else {
                $.ajax({
                    async: false,
                    type: "POST",
                    url: "./Services/Master/AccountService.svc/GetGarudaMiles",
                    data: JSON.stringify({ GarudaMile: $('#GarudaMile').val(), Sno: 0 }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {
                        if (jQuery.parseJSON(response) != undefined) {
                            if (jQuery.parseJSON(response).Table0.length > 0) {
                                if (jQuery.parseJSON(response).Table0[0].data != 0) {

                                    ShowMessage('warning', 'Warning - Account!', "Garuda Miles Already Exist.");
                                    $('#GarudaMile').val('');
                                    return;

                                }
                            }
                          
                        }


                    },
                    error: function (msg) {

                    }
                });
            }
        });
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        $('#GarudaMile').on('blur', function () {
            if ($("#GarudaMile").val().length != 0 && $("#GarudaMile").val().length != 9) {
                ShowMessage('warning', 'Need your Kind Attention!', 'Garuda Miles should be 9 Digits');
                $("#GarudaMile").val('');
                return;
            }
            $.ajax({
                async: false,
                type: "POST",
                url: "./Services/Master/AccountService.svc/GetGarudaMiles",
                data: JSON.stringify({ GarudaMile: $('#GarudaMile').val(), Sno: getQueryStringValue("RecID") }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (jQuery.parseJSON(response).Table0[0].data != 0) {
                        ShowMessage('warning', 'Warning - Account!', "Garuda Miles Already Exist.");
                        $('#GarudaMile').val('');
                        return;
                    }
                },
                error: function (msg) {

                }
            });
        });


    }

   

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
        AppendLoginColor();
    }
    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        AppendLoginColor();
    }


 
});

function AppendLoginColor() {
    var sno = "";
    if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
        sno = $("#LoginColorCodeSno").val();
    }
    else {
        if ($("#Text_LoginColorCodeSno").data("kendoAutoComplete").value() == "") {
            // added by arman ali Date 27 mar, 2017
            $('#divLoginColor').remove();
            $('#MaxUsersAdd').remove();
            //$('#LoginColorCodeSno').parent().parent().parent().find('div').remove();
            //return;
            // End 
        }
        sno = $("#Text_LoginColorCodeSno").data("kendoAutoComplete").key();
    }
    // Added by arman 27- 04- 2017 for solving block bug
    if ($("#Text_LoginColorCodeSno").val()!=""){ 
    $.ajax({
        async: false,
        type: "POST",
        url: "./Services/Master/AccountService.svc/GetLoginColorCode",
        data: JSON.stringify({ Sno: sno }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (jQuery.parseJSON(response).Table0[0] == null) {
                return;
            }
            if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
                $('span#LoginColorCodeSno').text(jQuery.parseJSON(response).Table0[0].Name);

                $('#divLoginColor').remove();
                $('#MaxUsersAdd').remove();
                //  $('span#LoginColorCodeSno').parent().parent().parent().find('div').remove();
                $('span#LoginColorCodeSno').after(' <div id="divLoginColor" style="height:10px;width:25px;padding:5px;display:inline-flex;background-color:' + jQuery.parseJSON(response).Table0[0].ColorCode + '"></div> <div id="MaxUsersAdd" style="display:inline-flex;"> MaxUsers: ' + jQuery.parseJSON(response).Table0[0].MaxUsers + '</div>');
            }
            else {
                $('#divLoginColor').remove();
                $('#MaxUsersAdd').remove();


                //   $('#LoginColorCodeSno').parent().parent().parent().find('div').remove();
                $('#Text_LoginColorCodeSno').parent().parent().after('<div  id="divLoginColor" style="height:10px;width:25px;padding:5px;display:inline-flex;background-color:' + jQuery.parseJSON(response).Table0[0].ColorCode + '"></div><div id="MaxUsersAdd" style="display:inline-flex;"> MaxUsers: ' + jQuery.parseJSON(response).Table0[0].MaxUsers + '</div>');
            }
        },
        // ===============================================end=============================================================
        error: function (msg) {
        }
    });
    }
}

function SelectCity() {
    $('#OfficeSNo').val('');
    $('#Text_OfficeSNo').val('');
    $('#CurrencySNo').val('');
    $('#Text_CurrencySNo').val('');
}

function ValidateEMail(email) {
    var regex = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    ///^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/
    return regex.test(email);
}

function ShowMobile(obj) {

    if ($(obj).is(':checked') == true) {
        $("#_tempMobile").hide();
        $("#Mobile").show();
        $("#Mobile").closest('td').prev().find('span').show();
        $("#Mobile").attr('data-valid', 'required');
        $("#_tempMobile").attr('data-valid', 'required');
        $("#Mobile").closest('td').prev().find('font').html('*');
        $("#Mobile").val('');
        $("#_tempMobile").val('');
        $("#Mobile").focus();
    }
    else {
        $("#Mobile").removeAttr('data-valid');
        $("#_tempMobile").removeAttr('data-valid');
        $("#Mobile").closest('td').prev().find('font').html('');
        $("#_tempMobile").hide();
        $("#Mobile").hide();
        $("#Mobile").closest('td').prev().find('span').hide();
        $("#Mobile").val('');
        $("#CrMobile").val('');
    }
}

function ShowEmail(obj) {
    if ($(obj).is(':checked') == true) {
        $("#Email").attr('data-valid', 'required');
        $("#Email").closest('td').prev().find('font').html('*');
        $("#Email").show();
        $("#Email").val('');
        $("#_tempEmail").val('');
        $("#Email").closest('td').prev().find('span').show();
        $("#Email").closest('td').find('span').show();
        $("#EmailLabel").show();
        $("#Email").focus();
    }
    else {
        $("#Email").removeAttr('data-valid');
        $("#Email").closest('td').prev().find('font').html('');
        $("#Email").hide();
        $("#Email").closest('td').find('span').hide();
        $("#Email").closest('td').prev().find('span').hide();
        $("#EmailLabel").hide();
        $("#Email").val('');
        $("#eEmail").val('');
        $('#divemailAdd ul').find('li span[id]').click();
    }
}


$("input[name=IATANo]").keypress(function (evt) {

    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    var regex = /^[0-9]{0,9}$/;    // allow only numbers [0-9] 
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
});


$("input[name=RateMarkUp]").keypress(function (evt) {

    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    var regex = /^[0-9]{0,9}$/;    // allow only numbers [0-9] 
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
});





//$("input[name=CASSNo]").keypress(function (evt) {

//    var theEvent = evt || window.event;
//    var key = theEvent.keyCode || theEvent.which;
//    key = String.fromCharCode(key);
//    var regex = /^[0-9]{0,9}$/;    // allow only numbers [0-9] 
//    if (!regex.test(key)) {
//        theEvent.returnValue = false;
//        if (theEvent.preventDefault) theEvent.preventDefault();
//    }
//});



function RadioButtonSelectShow() {
    if ($("input[name='IsHeadAccount']:checked").val() == 1 || $("input[name='IsHeadAccount']").val() == "No") {
        //$("#IsHeadAccount").closest("tr").find("td:gt(1)").css("display", "");
        //  $('#Branch').closest('td').parent().find('[title="Select Master Branch"]').text('Master Branch');

        $("#spnBranch").show();
        $("#spnBranch").prev().show();
        $('#Branch').closest('td').find('span').show();
        $('#Text_Branch').attr("data-valid", "required");
    }
    else {
        //$("#IsHeadAccount").closest("tr").find("td:gt(1)").css("display", "none");
        //   $('#Branch').closest('td').parent().find('[title="Select Master Branch"]').text('');//.text('Master Branch');
        $("#spnBranch").prev().hide();
        $("#spnBranch").hide();
        $('#Text_Branch').removeAttr("data-valid");
        $('#Branch').closest('td').find('span').hide();
        cfi.ResetAutoComplete("Branch");
    }
    $('br:gt(1)').remove();

}

function ShowHideCreditLimitInformation() {
    if ($('input:radio[name=IsAllowedCL]:checked').val() == '1') {
        //  $('#MinimumCL').attr('readonly', true);
        $('#CreditLimit').attr('readonly', true);
        //  $('#AlertCLPercentage').attr('readonly', true);
    }
    else {
        $('#CreditLimit').attr('readonly', false);
        $('#MinimumCL').attr('readonly', false);
        $('#AlertCLPercentage').attr('readonly', false);
    }
}

if (getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
    if ($('#Text_AccountTypeSNo').val() != 'TRUCK VENDOR') {
        //  $("#spnAddress").closest("td").prev("td").prev("td").text("");
        $("#spnAddress").closest("td").prev("td").text("");
        $("#spnIsVendorType").hide();
        $("input[name='IsVendorType']").closest("td").html("");

    }
}

var radiohtml = '<input type="radio" tabindex="9" data-radioval="SAS" class="" name="IsVendorType" checked="True" id="IsVendorType" value="0">SAS <input type="radio" tabindex="9" data-radioval="Airline" class="" name="IsVendorType" id="IsVendorType" value="1">Airline';

function readtruckvender() {
    ///   $('#CustomerTypeSNo').val('');
    // $('#Text_CustomerTypeSNo').val('');
    //==================added by arman ali  24 Mar, 2017  ==========================================
    // $('#spnName').text($('#Text_AccountTypeSNo').val() + ' Name');
    //=========================end==================================================
    $('#Text_CustomerTypeSNo').removeAttr("data-valid");
    $('#Text_TransactionTypeSNo').removeAttr("data-valid");
    $('#spnCustomerTypeSNo').closest('td').find('font').text('');
    $('#spnTransactionTypeSNo').closest('td').find('font').text('');

    if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {

        if ($('#Text_AccountTypeSNo').val() == "SHIPPER" || $('#Text_AccountTypeSNo').val() == "CONSIGNEE") {
            $('#Text_IndustryTypeSNO').data("kendoAutoComplete").enable(true);

            $('#Text_CustomerTypeSNo').data("kendoAutoComplete").enable(false);
            $('#Text_TransactionTypeSNo').data("kendoAutoComplete").enable(false);
            $('#CASSNo').attr("disabled", true);
            //        $("#Text_IndustryTypeSNO").closest('td').prev().find('span').show();
            $("#Text_IndustryTypeSNO").attr('data-valid', 'required');
            $('#Text_AirlineSNo').data("kendoAutoComplete").enable(true);

            //      $("#Text_IndustryTypeSNO").closest('td').prev().find('font').html('*');


        }
        else if ($('#Text_AccountTypeSNo').val() == "FORWARDER" || $('#Text_AccountTypeSNo').val() == "PO MAIL") {
            // ADDED BY ARMAN 
            //==================added by arman ali  24 Mar, 2017  ==========================================
            //$('#spnName').text( Name');
            //=========================end==================================================
            $('#Text_CustomerTypeSNo').attr("data-valid", "required");
            $('#Text_TransactionTypeSNo').attr("data-valid", "required");
            $('#spnCustomerTypeSNo').closest('td').find('font').text(' *');
            $('#spnTransactionTypeSNo').closest('td').find('font').text(' *');
            // end

            cfi.AutoCompleteByDataSource("CustomerTypeSNo", CustomerTypeList, null, null);

            $('#Text_CustomerTypeSNo').data("kendoAutoComplete").enable(true);

            $('#Text_TransactionTypeSNo').data("kendoAutoComplete").enable(true);
            if ($('#Text_AccountTypeSNo').val() == "FORWARDER") {
          
                $('#Text_IndustryTypeSNO').data("kendoAutoComplete").enable(true);
            }
            else
                $('#Text_IndustryTypeSNO').data("kendoAutoComplete").enable(false);
            $('#CASSNo').attr("disabled", false);

            $("#Text_CustomerTypeSNo").closest('td').prev().find('span').show();
            $("#Text_CustomerTypeSNo").attr('data-valid', 'required');

            $("#Text_CustomerTypeSNo").closest('td').prev().find('font').html('*');

            $("#Text_TransactionTypeSNo").closest('td').prev().find('span').show();
            $("#Text_TransactionTypeSNo").attr('data-valid', 'required');

            $("#Text_TransactionTypeSNo").closest('td').prev().find('font').html('*');
            $('#Text_AirlineSNo').data("kendoAutoComplete").enable(true);


        }

        else if ($('#Text_AccountTypeSNo').val() == "WALKING CUSTOMER") {

            cfi.AutoCompleteByDataSource("CustomerTypeSNo", WorkingCustomerList, null, null);
            $('#Text_CustomerTypeSNo').data("kendoAutoComplete").enable(true);

            $('#Text_TransactionTypeSNo').data("kendoAutoComplete").enable(true);

            $('#Text_IndustryTypeSNO').data("kendoAutoComplete").enable(false);
            $('#CASSNo').attr("disabled", false);

            $("#Text_CustomerTypeSNo").closest('td').prev().find('span').show();
            $("#Text_CustomerTypeSNo").attr('data-valid', 'required');

            $("#Text_CustomerTypeSNo").closest('td').prev().find('font').html('*');

            $("#Text_TransactionTypeSNo").closest('td').prev().find('span').show();
            $("#Text_TransactionTypeSNo").attr('data-valid', 'required');

            $("#Text_TransactionTypeSNo").closest('td').prev().find('font').html('*');
            $('#Text_AirlineSNo').data("kendoAutoComplete").enable(true);

        }

        else if ($('#Text_AccountTypeSNo').val() == 'POS') {
            $('#Text_CustomerTypeSNo').val('Domestic');
            $('#CustomerTypeSNo').val('3');
            $('#Text_TransactionTypeSNo').val('CASH');// By arman change CASS To CASH 2017-05-16
            $('#TransactionTypeSNo').val('3');
          //  $('#Text_AirlineSNo').val('GA-GARUDA AIRLINE')
           // $('#AirlineSNo').val('1');


                $('#Text_AirlineSNo').data("kendoAutoComplete").enable(true);
                $('#Text_TransactionTypeSNo').data("kendoAutoComplete").enable(false);
                $('#Text_CustomerTypeSNo').data("kendoAutoComplete").enable(false);
                $('#Text_CustomerTypeSNo').val('Domestic');
             
              

        }
        else if ($('#Text_AccountTypeSNo').val() == 'POST OFFICE') {
          
            $('#Text_CustomerTypeSNo').val('');
            $('#CustomerTypeSNo').val('');
            $('#Text_TransactionTypeSNo').val('CREDIT');// By arman change CASS To CASH 2017-05-16
            $('#TransactionTypeSNo').val('1');
            //  $('#Text_AirlineSNo').val('GA-GARUDA AIRLINE')
            // $('#AirlineSNo').val('1');


            $('#Text_AirlineSNo').data("kendoAutoComplete").enable(true);
            $('#Text_TransactionTypeSNo').data("kendoAutoComplete").enable(false);
            $('#Text_CustomerTypeSNo').data("kendoAutoComplete").enable(false);
          //  $('#Text_CustomerTypeSNo').val('Domestic');



        }

        else if ($('#Text_AccountTypeSNo').val() != 'TRUCK VENDOR') {
            
            $("#spnIsVendorType").hide();

            $("input[name='IsVendorType']").closest("td").html("");
            //    $('#Text_AirlineSNo').data("kendoAutoComplete").enable(true);
            //Sachin 30-12-2016  Show AirLine Validation
            //$('#spnAirlineSNo').closest('td').find('font').remove();
            //$('#Text_AirlineSNo').removeAttr("data-valid-msg");
            //$('#Text_AirlineSNo').removeAttr("data-valid");
            //$('#Text_AirlineSNo').parent('span').css("border-color", "#b4d5e2");
           // $('#Text_IndustryTypeSNO').data("kendoAutoComplete").enable(false);
            if ($('#Text_AccountTypeSNo').val() == "FORWARDER")
                $('#Text_IndustryTypeSNO').data("kendoAutoComplete").enable(true);
            else
                $('#Text_IndustryTypeSNO').data("kendoAutoComplete").enable(false);
            $('#CASSNo').attr("disabled", false);
            if ($('#Text_AccountTypeSNo').val() == "POST OFFICE"){
                $('#Text_AirlineSNo').data("kendoAutoComplete").enable(true);
            }
            // $('#Text_IndustryTypeSNO').attr("disabled", true);
            //  $('#Text_CustomerTypeSNo').attr("disabled", true);
            $('#Text_CustomerTypeSNo').data("kendoAutoComplete").enable(false);
            // $('#Text_TransactionTypeSNo').attr("disabled", true);
            $('#Text_TransactionTypeSNo').data("kendoAutoComplete").enable(false);
            $('#CASSNo').attr("disabled", true);
        }


        else {
            
            if ($("input[name='IsVendorType']").length == 0) {

                $("#spnIsVendorType").show();
                $("#spnIsVendorType").closest("td").next("td").html(radiohtml);
                $('#Text_AirlineSNo').data("kendoAutoComplete").enable(false);

            }
            $('#Text_IndustryTypeSNO').data("kendoAutoComplete").enable(true);
            $('#Text_AirlineSNo').data("kendoAutoComplete").enable(true);

            $('#Text_CustomerTypeSNo').data("kendoAutoComplete").enable(true);

            $('#Text_TransactionTypeSNo').data("kendoAutoComplete").enable(true);

            $('#CASSNo').attr("disabled", false);
        }
    }




    if (getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        if ($('#Text_AccountTypeSNo').val() != 'TRUCK VENDOR') {
            $("input[name='IsVendorType']").closest("td").prev().html("");
            $("input[name='IsVendorType']").closest("td").html("");
            $('#spnAddress').closest("td").prev().prev().text("")
            //    $('#Text_AirlineSNo').data("kendoAutoComplete").enable(true);
            ///Sachin 30-12-2016 Show AirLine Validation
            //$('#spnAirlineSNo').closest('td').find('font').remove();
            //$('#Text_AirlineSNo').removeAttr("data-valid-msg");
            //$('#Text_AirlineSNo').removeAttr("data-valid");
            //$('#Text_AirlineSNo').parent('span').css("border-color", "#b4d5e2");
        }
        else {
            if ($("input[name='IsVendorType']").length == 0) {
                $("#spnAddress").closest("td").prev("td").html(radiohtml);
                $("input[name='IsVendorType']").closest("td").prev().html("Vendor Type");
                $('#Text_AirlineSNo').data("kendoAutoComplete").enable(false);
            }
        }
    }

    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {

        if ($('#Text_AccountTypeSNo').val() == "SHIPPER" || $('#Text_AccountTypeSNo').val() == "CONSIGNEE") {


            $('#Text_IndustryTypeSNO').data("kendoAutoComplete").enable(true);
            //$('#Text_IndustryTypeSNO').attr("disabled", false);
            // $('#Text_CustomerTypeSNo').attr("disabled", true);
            $('#Text_CustomerTypeSNo').data("kendoAutoComplete").enable(false);
            //$('#Text_TransactionTypeSNo').attr("disabled", true);
            $('#Text_TransactionTypeSNo').data("kendoAutoComplete").enable(false);
            $('#CASSNo').attr("disabled", false);

            $("#Text_IndustryTypeSNO").closest('td').prev().find('span').show();
            $("#Text_IndustryTypeSNO").attr('data-valid', 'required');

            $("#Text_IndustryTypeSNO").closest('td').prev().find('font').html('*');
        }
        else if ($('#Text_AccountTypeSNo').val() == "FORWARDER" || $('#Text_AccountTypeSNo').val() == "PO MAIL") {

            //$('#Text_CustomerTypeSNo').attr("disabled", false);
            //by arman 
            // $('#spnName').text($('#Text_AccountTypeSNo').val() + ' (Agent) Name');
            // end
            $('#Text_CustomerTypeSNo').data("kendoAutoComplete").enable(true);
            $('#Text_TransactionTypeSNo').data("kendoAutoComplete").enable(true);
            //$('#Text_TransactionTypeSNo').attr("disabled", false);
            // $('#Text_IndustryTypeSNO').attr("disabled", true);
            $('#Text_IndustryTypeSNO').data("kendoAutoComplete").enable(false);
            $('#CASSNo').attr("disabled", true);
            // ADDED BY Shahabz 
            // $("#Text_IndustryTypeSNO").closest('td').prev().find('span').hide();
            $("#Text_IndustryTypeSNO").closest('td').prev().find('span').prev().html("");

            if ($('#Text_AccountTypeSNo').val() == "FORWARDER") {
           
                $('#Text_IndustryTypeSNO').data("kendoAutoComplete").enable(true);
            }
            else
                $('#Text_IndustryTypeSNO').data("kendoAutoComplete").enable(false);
            // ADDED BY Shahabz 
            $("#Text_IndustryTypeSNO").removeAttr('data-valid', 'required');

            $("#Text_CustomerTypeSNo").closest('td').prev().find('span').show();
            $("#Text_CustomerTypeSNo").attr('data-valid', 'required');

            $("#Text_CustomerTypeSNo").closest('td').prev().find('font').html('*');

            $("#Text_TransactionTypeSNo").closest('td').prev().find('span').show();
            $("#Text_TransactionTypeSNo").attr('data-valid', 'required');

            $("#Text_TransactionTypeSNo").closest('td').prev().find('font').html('*');

            // $("#Text_IndustryTypeSNO").closest('td').prev().find('font').html('*');
        }

        else if ($('#Text_AccountTypeSNo').val() == "WALKING CUSTOMER") {

            //$('#Text_CustomerTypeSNo').attr("disabled", false);
            cfi.AutoCompleteByDataSource("CustomerTypeSNo", WorkingCustomerList, null, null);

            $('#Text_CustomerTypeSNo').data("kendoAutoComplete").enable(true);
            $('#Text_TransactionTypeSNo').data("kendoAutoComplete").enable(true);
            //$('#Text_TransactionTypeSNo').attr("disabled", false);
            // $('#Text_IndustryTypeSNO').attr("disabled", true);
            $('#Text_IndustryTypeSNO').data("kendoAutoComplete").enable(false);
            $('#CASSNo').attr("disabled", true);
            // ADDED BY Shahabz 
            //   $("#Text_IndustryTypeSNO").closest('td').prev().find('span').hide();
            $("#Text_IndustryTypeSNO").closest('td').prev().find('span').prev().html("");
            // ADDED BY Shahabz 
            $("#Text_IndustryTypeSNO").removeAttr('data-valid', 'required');

            $("#Text_CustomerTypeSNo").closest('td').prev().find('span').show();
            $("#Text_CustomerTypeSNo").attr('data-valid', 'required');

            $("#Text_CustomerTypeSNo").closest('td').prev().find('font').html('*');

            $("#Text_TransactionTypeSNo").closest('td').prev().find('span').show();
            $("#Text_TransactionTypeSNo").attr('data-valid', 'required');

            $("#Text_TransactionTypeSNo").closest('td').prev().find('font').html('*');

            // $("#Text_IndustryTypeSNO").closest('td').prev().find('font').html('*');
        }
        else if ($('#Text_AccountTypeSNo').val() != 'TRUCK VENDOR') {
            $("input[name='IsVendorType']").closest("td").prev().html("");
            $("input[name='IsVendorType']").closest("td").html("");
            //  $('#Text_AirlineSNo').data("kendoAutoComplete").enable(true);
            //Sachin 30-12-2016 Show AirLine Validation
            //$('#spnAirlineSNo').closest('td').find('font').remove();
            //$('#Text_AirlineSNo').removeAttr("data-valid-msg");
            //$('#Text_AirlineSNo').removeAttr("data-valid");
            //$('#Text_AirlineSNo').parent('span').css("border-color", "#b4d5e2");
            //$('#AirlineSNo').val('');
            //$('#Text_AirlineSNo').data("kendoAutoComplete").value('');
            //$('#Text_CustomerTypeSNo').attr("disabled", true);
            $('#Text_CustomerTypeSNo').data("kendoAutoComplete").enable(false);
            $('#Text_TransactionTypeSNo').data("kendoAutoComplete").enable(false);
            // $('#Text_TransactionTypeSNo').attr("disabled", true);
            $('#Text_IndustryTypeSNO').data("kendoAutoComplete").enable(false);
            if ($('#Text_AccountTypeSNo').val() == "FORWARDER") {
            
                $('#Text_IndustryTypeSNO').data("kendoAutoComplete").enable(true);
            }
            else
                $('#Text_IndustryTypeSNO').data("kendoAutoComplete").enable(false);
            // ADDED BY Shahabz 
            //   $("#Text_IndustryTypeSNO").closest('td').prev().find('span').hide();
            $("#Text_IndustryTypeSNO").closest('td').prev().find('span').prev().html("");
            // ADDED BY Shahabz 
            $("#Text_IndustryTypeSNO").removeAttr('data-valid', 'required');
        }

        else {
            $("#spnAddress").closest("td").prev("td").html(radiohtml);
            $("input[name='IsVendorType']").closest("td").prev().html("Vendor Type");
            $('#Text_AirlineSNo').data("kendoAutoComplete").enable(false);
            // $('#Text_CustomerTypeSNo').attr("disabled", true);
            $('#Text_CustomerTypeSNo').data("kendoAutoComplete").enable(false);
            $('#Text_TransactionTypeSNo').data("kendoAutoComplete").enable(false);
            // $('#Text_TransactionTypeSNo').attr("disabled", true);
            // $('#Text_IndustryTypeSNO').attr("disabled", true);
            $('#Text_IndustryTypeSNO').data("kendoAutoComplete").enable(false);

            //  $("#Text_IndustryTypeSNO").closest('td').prev().find('span').hide();
            $("#Text_IndustryTypeSNO").closest('td').prev().find('span').prev().html("");
            $("#Text_IndustryTypeSNO").removeAttr('data-valid', 'required');
        }

    }


    if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "DELETE") {
        if ($('#Text_AccountTypeSNo').text() != 'TRUCK VENDOR') {
            $("#VendorType").text("");
            $("#VendorType").closest("td").prev().text("");
        }
    }

    //===============commented by arman ali date : 19-04-2017 ==============================================

    //if (($('#Text_AccountTypeSNo').val() == "") ? $('#Text_AccountTypeSNo').text() : $('#Text_AccountTypeSNo').val() == 'TRUCK VENDOR') {
    //    $('#IATANo').closest('td').prev().text("Vendor Code");
    //    //$("#spnIsVendorType").show();
    //    //$("#spnIsVendorType").closest("td").next("td").html(radiohtml);

    //}
    //else {
    //    $('#IATANo').closest('td').prev().text("IATA Registration No");
    //}
    //=============================end======================================================

    if ($("#Text_AccountTypeSNo").val() == "FORWARDER") {
        $("#ForwarderAsConsignee:radio").closest('td').show();
        $("td[title='Select Forwarder (Agent) As Consignee']").show();
    }
    else {
        $("#ForwarderAsConsignee:radio").closest('td').hide();
        $("td[title='Select Forwarder (Agent) As Consignee']").hide();
    }
    //Added By Pankaj Khanna (18-11-2016)
    if ($('input[type="radio"][data-radioval="Airline"]').is(':checked') == true && $('#Text_AccountTypeSNo').val() == 'TRUCK VENDOR') {
        ////Sachin Show Validation in Airline
        //$('#spnAirlineSNo').closest('td').find('font').remove();
        //$('#spnAirlineSNo').before('<font color="red">*</font>');
        //$('#Text_AirlineSNo').attr("data-valid-msg", "Airline can not be blank");
        //$('#Text_AirlineSNo').attr("data-valid", "required");
        $('#Text_AirlineSNo').data("kendoAutoComplete").enable(true);
    }
    else if ($('input[type="radio"][data-radioval="SAS"]').is(':checked') == true && $('#Text_AccountTypeSNo').val() == 'TRUCK VENDOR') {
        ////Sachin Show Validation in Airline
        //$('#spnAirlineSNo').closest('td').find('font').remove();
        //$('#Text_AirlineSNo').removeAttr("data-valid-msg");
        //$('#Text_AirlineSNo').removeAttr("data-valid");
        //$('#Text_AirlineSNo').parent('span').css("border-color", "#b4d5e2");
        //$('#AirlineSNo').val('');
        //$('#Text_AirlineSNo').data("kendoAutoComplete").value('');
        $('#Text_AirlineSNo').data("kendoAutoComplete").enable(false);
    }
    $('input:radio[data-radioval="Airline"]').click(function () {
        if ($('input[type="radio"][data-radioval="Airline"]').is(':checked') == true) {
            ////Sachin Show Validation in Airline
            //$('#spnAirlineSNo').closest('td').find('font').remove();
            //$('#spnAirlineSNo').before('<font color="red">*</font>');
            //$('#Text_AirlineSNo').attr("data-valid-msg", "Airline can not be blank");
            //$('#Text_AirlineSNo').attr("data-valid", "required");
            //$('#AirlineSNo').val('');
            //$('#Text_AirlineSNo').data("kendoAutoComplete").value('');
            $('#Text_AirlineSNo').data("kendoAutoComplete").enable(true);
        }
    });
    $('input:radio[data-radioval="SAS"]').click(function () {
        if ($('input[type="radio"][data-radioval="SAS"]').is(':checked') == true) {
            //Sachin Show Validation in Airline
            //$('#spnAirlineSNo').closest('td').find('font').remove();
            //$('#Text_AirlineSNo').removeAttr("data-valid-msg");
            //$('#Text_AirlineSNo').removeAttr("data-valid");
            //$('#Text_AirlineSNo').parent('span').css("border-color", "#b4d5e2");
            //$('#AirlineSNo').val('');
            //$('#Text_AirlineSNo').data("kendoAutoComplete").value('');
            $('#Text_AirlineSNo').data("kendoAutoComplete").enable(false);
        }
    });
    //END By Pankaj Khanna (18-11-2016)
}

function OnSelectCity(e) {
    var Data = this.dataItem(e.item.index());
    $.ajax({
        type: "POST",
        url: "./Services/Master/AccountService.svc/GetOffice?recid=" + Data.Text,
        data: { id: 1 },
        dataType: "json",
        success: function (response) {
            var SNo = response.Data[0];
            var Name = response.Data[1];
            $("#OfficeSNo").val(SNo);
            $("#Text_OfficeSNo").val(Name);
        }
    });
}

function ExtraCondition(textId) {
    var filterEmbargo = cfi.getFilter("AND");

    if (textId == "Text_CitySNo") {
        try {
            var OriginCityAutoCompleteFilter2
            if ($('#CountrySNo').val() == "") {
                cfi.setFilter(filterEmbargo, "SNo", "eq", userContext.CitySNo)
                OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            }
            else{
            cfi.setFilter(filterEmbargo, "CountrySNo", "eq", $("#Text_CountrySNo").data("kendoAutoComplete").key())
            OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
            }
            return OriginCityAutoCompleteFilter2;
        }
        catch (exp)
        { }
    }
    if (textId == "Text_OfficeSNo") {
        cfi.setFilter(filterEmbargo, "CityCode", "eq", $("#Text_CitySNo").data("kendoAutoComplete").value().split("-")[0])
        cfi.setFilter(filterEmbargo, "AirlineSNo", "eq", $("#AirlineSNo").val())
        cfi.setFilter(filterEmbargo, "OfficeType", "neq", 2)
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginCityAutoCompleteFilter2;
    }
    // Added By Arman For Airline Filter IsInterline=0  date : 14-03-2017 ;
    if (textId == "Text_AirlineSNo") {
        cfi.setFilter(filterEmbargo, "IsInterline", "eq", 0)
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginCityAutoCompleteFilter2;
    }
    // end here
    if (textId == "Text_AccountTypeSNo") {
        //$('#Text_CustomerTypeSNo').val('');
        cfi.setFilter(filterEmbargo, "AccountTypeName", "neq", "AGENT")
        var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
        return OriginCityAutoCompleteFilter2;
    }
    //if (textId.indexOf("tblContactInformation_CountryName") >= 0) {
    //    $('#tblContactInformation_HdnCityName_' + textId.split('_')[2]).val("");
    //    $('#tblContactInformation_CityName_' + textId.split('_')[2]).val()
    //}


    if (textId.indexOf("tblContactInformation_CityName") >= 0) {
        cfi.setFilter(filterEmbargo, "IsActive", "eq", 1);
        cfi.setFilter(filterEmbargo, "CountrySNo", "in", $('#tblContactInformation_HdnCountryName_' + textId.split('_')[2]).val());
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filterEmbargo);
        return RegionAutoCompleteFilter;
    }


    if (textId.indexOf("tblContactInformation_Designation_1") >= 0) {
        cfi.setFilter(filterEmbargo, "IsActive", "eq", 1);
        cfi.setFilter(filterEmbargo, "CountrySNo", "in", $('#tblContactInformation_Designation_1' + textId.split('_')[2]).val());
        var RegionAutoCompleteFilter = cfi.autoCompleteFilter(filterEmbargo);
        return RegionAutoCompleteFilter;
    }
}

var dbTableName = 'AccountCommision';
function AccountCommisionGrid() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowMessage('info', 'Need your Kind Attention!', "Account Commission can be added in Edit/Update mode only.");
        return;
    }
    else {
        isDataLoad = false;
        var dbTableName = 'AccountCommision';
        var pageType = $('#hdnPageType').val();
        cfi.ValidateForm();
        $('#tbl' + dbTableName).appendGrid({
            tableID: 'tbl' + dbTableName,
            contentEditable: pageType != 'View',
            isGetRecord: true,
            tableColumns: 'SNo,CommisionType,CommisionAmount,IncentiveType,IncentiveAmount,NetNet,ValidFrom,ValidTo,IsActive',
            masterTableSNo: $('#hdnAccountSNo').val(),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Master/' + dbTableName + 'Service.svc',
            getRecordServiceMethod: 'Get' + dbTableName + 'Record',
            createUpdateServiceMethod: 'createUpdate' + dbTableName,
            deleteServiceMethod: 'delete' + dbTableName,
            caption: 'Account Commission',
            initRows: 1,



            columns: [
                      { name: 'SNo', type: 'hidden', value: 0 },
                      { name: 'AccountSNo', type: 'hidden', value: $('#hdnAccountSNo').val() },
                      { name: 'NetNet', type: 'hidden', value: 0 },
                      { name: pageType == 'EDIT' ? 'AccountCommisionType' : 'NetNetCommision', display: '', type: 'select', ctrlOptions: { 0: '--Select--', 1: 'NetNet', 2: 'Commission' }, onChange: function (evt, rowIndex) { CheckAccountCommision(rowIndex) } },
                      {
                          name: pageType == 'EDIT' ? 'CommisionType' : 'DisPlayCommisionType', display: 'Commission Type', type: 'select', ctrlOptions: { '-1': '--Select--', 1: 'Revenue', 2: 'Weight' }, onChange: function (evt, rowIndex) {
                              var Type = $('#' + 'tbl' + dbTableName).appendGrid('getCtrlValue', 'CommisionType', rowIndex);
                              var Amount = $('#' + 'tbl' + dbTableName).appendGrid('getCtrlValue', 'CommisionAmount', rowIndex);
                              var ret = CheckAmount(Type, Amount);
                              if (ret == false) {
                                  $('#' + 'tbl' + dbTableName).appendGrid('setCtrlValue', 'CommisionAmount', rowIndex, '0');
                              }
                          }, isRequired: true
                      },
                        {
                            name: 'CommisionAmount', display: 'Commission Amount', type: 'text', value: '0', ctrlAttr: { maxlength: 15, controltype: 'decimal3' }, ctrlCss: { width: '100px' }, onChange: function (evt, rowIndex) {
                                var Type = $('#' + 'tbl' + dbTableName).appendGrid('getCtrlValue', 'CommisionType', rowIndex);
                                var Amount = $('#' + 'tbl' + dbTableName).appendGrid('getCtrlValue', 'CommisionAmount', rowIndex);
                                var ret = CheckAmount(Type, Amount);
                                if (ret == false) {
                                    $('#' + 'tbl' + dbTableName).appendGrid('setCtrlValue', 'CommisionAmount', rowIndex, '0');
                                }

                            },

                        },
                         {
                             name: pageType == 'EDIT' ? 'IncentiveType' : 'DisPlayIncentiveType', display: 'Incentive Type', type: 'select', ctrlOptions: { 0: '--Select--', 1: 'Percentage', 2: 'Kg' }, onChange: function (evt, rowIndex) {
                                 var Type = $('#' + 'tbl' + dbTableName).appendGrid('getCtrlValue', 'IncentiveType', rowIndex);
                                 var Amount = $('#' + 'tbl' + dbTableName).appendGrid('getCtrlValue', 'IncentiveAmount', rowIndex);
                                 var ret = CheckAmount(Type, Amount);
                                 if (ret == false) {

                                     $('#' + 'tbl' + dbTableName).appendGrid('setCtrlValue', 'IncentiveAmount', rowIndex, '0');
                                 }

                             }
                         },
                        {
                            name: 'IncentiveAmount', display: 'Incentive Amount', type: 'text', value: '0', ctrlAttr: { maxlength: 15, controltype: 'decimal3' }, ctrlCss: { width: '100px' }, onChange: function (evt, rowIndex) {
                                var Type = $('#' + 'tbl' + dbTableName).appendGrid('getCtrlValue', 'IncentiveType', rowIndex);
                                var Amount = $('#' + 'tbl' + dbTableName).appendGrid('getCtrlValue', 'IncentiveAmount', rowIndex);
                                var ret = CheckAmount(Type, Amount);
                                if (ret == false) {
                                    $('#' + 'tbl' + dbTableName).appendGrid('setCtrlValue', 'IncentiveAmount', rowIndex, '0');
                                }

                            }
                        },
                       //   {
                       //       name: 'ValidFrom', display: 'Valid From', type: 'text',ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { controltype: 'datetype', startControl: 'StartDate', endControl: 'EndDate' }
                       //   },
                       //{
                       //    name: 'ValidTo', display: 'Valid To', type: 'text',ctrlCss: { width: '80px', height: '20px' }, ctrlAttr: { controltype: 'datetype', startControl: 'StartDate', endControl: 'EndDate' }
                       //},


                        {
                            name: 'ValidFrom', display: 'Valid From', type: 'text', isRequired: true, ctrlAttr: { controltype: 'datetype', startControl: 'ValidFrom', endControl: 'ValidTo' }, ctrlCss: { width: '90px', height: '20px' }
                        },
                     {
                         name: 'ValidTo', display: 'Valid To', type: 'text', isRequired: true, ctrlAttr: { controltype: 'datetype', startControl: 'ValidFrom', endControl: 'ValidTo' }, ctrlCss: { width: '90px', height: '20px' }
                     },

                       { name: pageType == 'EDIT' ? 'IsActive' : 'Active', display: 'Active', type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' }, selectedIndex: 1, onClick: function (evt, rowIndex) { } },
                       { name: 'CreatedBy', type: 'hidden', value: $('#hdnCreatedBy').val() },
                       { name: 'UpdatedBy', type: 'hidden', value: $('#hdnUpdatedBy').val() }
            ], afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
                // Copy data of `Year` from parent row to new added rows
                var parentValue = $(caller).appendGrid('getCtrlValue', 'Year', parentRowIndex);
                for (var z = 0; z < addedRowIndex.length; z++) {
                    $(caller).appendGrid('setCtrlValue', 'Year', addedRowIndex[z], parentValue);
                }
            },
            rowUpdateExtraFunction: function (caller) {
                AccountCommisionUpdate();
            }
        });
    }
}

function AccountCommisionUpdate() {
    $('#tblAccountCommision tr select[id*="tblAccountCommision_AccountCommisionType"]').each(function () {
        if ($(this).val() == '1') {
            var inputID = this.id;
            if (inputID.split('_').length == 3) {
                CheckAccountCommision(eval(inputID.split('_')[2]) - 1);
            }
        }
    });
}

function CheckAmount(Type, Amount) {
    if (Type == 1 && Amount > 100) {
        alert("Amount not greater than 100 percent");
        return false;
    }
}

function CheckAccountCommision(rowIndex) {
    var rowValue = $('#tbl' + dbTableName + '_AccountCommisionType_' + eval(eval(rowIndex) + 1)).val();
    if (rowValue == 1) {
        //  $('#tbl' + dbTableName + '_CommisionAmount_' + eval(rowIndex + 1)).attr("disabled", "disabled");
        $('#tbl' + dbTableName + '_CommisionAmount_' + eval(rowIndex + 1)).removeAttr("required");
        $('#tbl' + dbTableName + '_CommisionAmount_' + eval(rowIndex + 1)).val("0");
        $('#tbl' + dbTableName + '_CommisionType_' + eval(rowIndex + 1)).attr("disabled", "disabled");
        $('#tbl' + dbTableName + '_CommisionType_' + eval(rowIndex + 1)).val("0");
        $('#tbl' + dbTableName + '_NetNet_' + eval(rowIndex + 1)).val("1");
        document.getElementById('tbl' + dbTableName + '_CommisionType_' + eval(rowIndex + 1)).setAttribute("disabled", "disabled");
    }
    else {
        $('#tbl' + dbTableName + '_CommisionAmount_' + eval(rowIndex + 1)).removeAttr("disabled");
        $('#tbl' + dbTableName + '_CommisionType_' + eval(rowIndex + 1)).removeAttr("disabled", "disabled");
        $('#tbl' + dbTableName + '_NetNet_' + eval(rowIndex + 1)).val("0");
    }
}

function AccountVatExemptGrid() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowMessage('info', 'Need your Kind Attention!', "Account Vat can be added in Edit/Update mode only.");
        return;
    }
    else {
        isDataLoad = false;
        var dbTableName = 'AccountVatExempt';
        var pageType = $('#hdnPageType').val();
        cfi.ValidateForm();
        $('#tbl' + dbTableName).appendGrid({
            tableID: 'tbl' + dbTableName,
            contentEditable: pageType != 'View',
            isGetRecord: true,
            tableColumns: 'SNo,AccountSNo,IsDomsticVatExempt,Value,ValidFrom,ValidTo,IsActive',
            masterTableSNo: $('#hdnAccountSNo').val(),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: './Services/Master/' + dbTableName + 'Service.svc',
            getRecordServiceMethod: 'Get' + dbTableName + 'Record',
            createUpdateServiceMethod: 'createUpdate' + dbTableName,
            deleteServiceMethod: 'delete' + dbTableName,
            caption: 'Account Vat Exempt',
            initRows: 1,
            columns: [
                      { name: 'SNo', type: 'hidden', value: 0 },
                      { name: 'AccountSNo', type: 'hidden', value: $('#hdnAccountSNo').val() },
                      {
                          name: pageType == 'EDIT' ? 'IsDomsticVatExempt' : 'DomsticVatExempt', display: 'Vat Exempt', type: 'radiolist', ctrlOptions: { 0: 'Domestic ', 1: 'International' }, selectedIndex: 1, onClick: function (evt, rowIndex) { }
                      },

                      //{ name: 'Value', display: 'Value', type: 'text', value: '0', isRequired: true, ctrlAttr: { maxlength: 3, onblur: "return checkNumeric(this.id);" } , ctrlCss: { width: '90px' } },

                      { name: 'Value', display: 'Value', type: 'text', value: '0', ctrlAttr: { maxlength: 3, controltype: 'decimal2', onblur: "return CheckAndClearText(this);" }, ctrlCss: { width: '90px' }, isRequired: true },

                      {
                          name: 'ValidFrom', display: 'Valid From', type: 'text', isRequired: true, ctrlAttr: { controltype: 'datetype', startControl: 'ValidFrom', endControl: 'ValidTo' }, ctrlCss: { width: '90px', height: '20px' }
                      },
                     {
                         name: 'ValidTo', display: 'Valid To', type: 'text', isRequired: true, ctrlAttr: { controltype: 'datetype', startControl: 'ValidFrom', endControl: 'ValidTo' }, ctrlCss: { width: '90px', height: '20px' }
                     },

                     {
                         name: pageType == 'EDIT' ? 'IsActive' : 'Active', display: 'Active', type: 'radiolist', ctrlOptions: { 0: 'No', 1: 'Yes' }, selectedIndex: 1, onClick: function (evt, rowIndex) { }
                     },
                     {
                         name: 'CreatedBy', type: 'hidden', value: $('#hdnCreatedBy').val()
                     },
                     {
                         name: 'UpdatedBy', type: 'hidden', value: $('#hdnUpdatedBy').val()
                     }
            ],
            isPaging: true
        });

    }
}

function AccountContactInformationGrid() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowMessage('info', 'Need your Kind Attention!', "Account Contact Information can be added in Edit/Update mode only.");
        return;
    }
    else {
        isDataLoad = false;
        var dbtableName = "ContactInformation";
        // var pageType = getQueryStringValue("FormAction").toUpperCase();
        var pageType = $('#hdnPageType').val();;
        cfi.ValidateForm();
        $("#tbl" + dbtableName).appendGrid({
            tableID: "tbl" + dbtableName,
            contentEditable: pageType != 'View',
            masterTableSNo: $("#hdnAccountSNo").val(),
            currentPage: 1, itemsPerPage: 5, whereCondition: null, sort: '',
            servicePath: "./Services/Master/AccountService.svc",
            getRecordServiceMethod: "GetContactInformationRecord",
            createUpdateServiceMethod: "CreateUpdateAccountContact",
            caption: "Contact Information",
            deleteServiceMethod: "DeleteAccountContact",
            initRows: 1,
            isGetRecord: true,
            columns: [{ name: "SNo", type: "hidden", value: 0 },
                     { name: 'AccountSNo', type: 'hidden', value: $('#hdnAccountSNo').val() },
                //type: 'select', ctrlOptions: { 0: '--Select--', 1: 'NetNet', 2: 'Commission' }, onChange: function (evt, rowIndex) { CheckAccountCommision(rowIndex) } ,
                    // { name: "Name", display: "Name 1", type: "text", ctrlCss: { width: '80px' }, ctrlAttr: { maxlength: 35, controltype: "alphanumericupper" }, isRequired: true },
                    // { name: "Name2", display: "Name 2", type: "text", ctrlCss: { width: '80px' }, ctrlAttr: { maxlength: 35, controltype: "alphanumericupper" } },
                      { name: "Salutation", display: "Salutation", type: "select", ctrlOptions: { 0: '--Select--', 1: 'Mr.', 2: 'Mrs.', 3: 'Ms.' }, ctrlCss: { width: '80px' }, ctrlAttr: { maxlength: 35, controltype: "alphanumericupper" } },
                      { name: "FirstName", display: "First Name", type: "text", ctrlCss: { width: '80px' }, ctrlAttr: { maxlength: 100, controltype: "alphanumericupper" }, isRequired: true },
                       { name: "LastName", display: "Last Name", type: "text", ctrlCss: { width: '80px' }, ctrlAttr: { maxlength: 100, controltype: "alphanumericupper" }, isRequired: true },
                       {
                           name: "Designation", display: "Designation", type: "text", ctrlCss: { width: '80px' }, ctrlAttr: { maxlength: 35, controltype: "autocomplete" },
                           tableName: 'AccountDesignation', textColumn: 'DesignationName', keyColumn: 'DesignationID'
                       },
                       { name: "Position", display: "Position", type: "text", ctrlCss: { width: '80px' }, ctrlAttr: { maxlength: 100, controltype: "alphanumericupper" } },
                         {
                             name: "MobileNo", display: "Mobile No", type: "text", ctrlCss: { width: '77px' }, ctrlAttr: { maxlength: 11, minlength: 6, controltype: "number", onblur: "return checkForLength(this.id);" }, onChange: function (evt, rowIndex) {

                             }
                        , isRequired: true
                         },
                         { name: "EmailId", display: "Email Id", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 200, onblur: "return checkForEmail(this.id);" }, },
                      { name: "CountryName", display: "Country", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", onSelect: "return RemoveCity(this.id);" }, ctrlCss: { width: "80px" }, isRequired: true, tableName: "Country", textColumn: "CountryName", keyColumn: "SNo" },
                     { name: "CityName", display: "City", type: "text", ctrlAttr: { maxlength: 98, controltype: "autocomplete" }, ctrlCss: { width: "80px" }, isRequired: true, tableName: "City", textColumn: "CityName", keyColumn: "SNo", filterCriteria: "contains" },

                      { name: "State", display: "State", type: "text", ctrlCss: { width: '80px' }, ctrlAttr: { maxlength: 50, controltype: "alphanumericupper" }, },
                         { name: "District", display: "District", type: "text", ctrlCss: { width: '80px' }, ctrlAttr: { maxlength: 50, controltype: "alphanumericupper" }, },

                            { name: "SubDistrict", display: "Sub District", type: "text", ctrlCss: { width: '80px' }, ctrlAttr: { maxlength: 50, controltype: "alphanumericupper" }, },

                            { name: "Address", display: "Street 1", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 200, minlength: 1, controltype: "alphanumericupper", allowchar: "*@,-/()_;:<>$%" }, },
                     { name: "Address2", display: "Street 2", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 200, minlength: 1, controltype: "alphanumericupper", allowchar: "*@,-/()_;:<>$%" } },
                      { name: "PostalCode", display: "Postal Code", type: "text", ctrlCss: { width: '70px' }, ctrlAttr: { maxlength: 9, minlength: 1, controltype: "alphanumericupper" }, },

                     //{ name: "FaxNumber", display: "", type: "text", ctrlCss: { width: '70px' }, ctrlAttr: { maxlength: 4, controltype: "number" }},

                     { name: "PhoneNo", display: "Office Phone", type: "text", ctrlCss: { width: '70px' }, ctrlAttr: { maxlength: 10, controltype: "number" }, },

                         { name: "Off_EmailId", display: "Off Email Id", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 200, onblur: "return checkForEmail(this.id);" }, },

                     { name: "Town", display: "Town / Place", type: "text", ctrlCss: { width: '70px' }, ctrlAttr: { maxlength: 100, minlength: 1, controltype: "alphanumericupper" }, },

                     { name: "Telex", display: "Telex", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 50, minlength: 1, controltype: "number" } },
                     { name: (pageType == "EDIT" ? "Active" : "IsActive"), display: "Active", type: "radiolist", ctrlOptions: { 0: "No", 1: "Yes" }, selectedIndex: 1 },


            ],
            dataLoaded: function (caller, parentRowIndex, addedRowIndex) {

              
                var count = $('#tblContactInformation  >tbody >tr').length;
                // Copy data of `Year` from parent row to new added rows
                //var parentValue = $(caller).appendGrid('getCtrlValue', 'Year', parentRowIndex);
                //for (var z = 0; z < addedRowIndex.length; z++) {
                //    $(caller).appendGrid('setCtrlValue', 'Year', addedRowIndex[z], parentValue);
                //}
                //  alert(count);
                for (i = 1; i <= count; i++) {

                    var sno = $("#tblContactInformation_HdnCountryName_" + i).val();
                    //   alert(i);
                    GetIsdCode(sno, i);
                }


            },
            isPaging: true
        });
    }
}

function RemoveCity(obj) {
   
    var id = obj.match(/\d+/g).map(Number);
    $("#tblContactInformation_CityName_" + id[0] + "").val("");

    var objCountrySNo = $(obj).closest("tr").find("input[id^='tblContactInformation_HdnCountryName']").val();
    // alert(objCountrySNo);
    if (objCountrySNo != undefined) {
        $.ajax({
            url: "./Services/Master/AccountService.svc/GetAccountCity", async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ CountrySNo: objCountrySNo }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                var Data = jQuery.parseJSON(result);
                var resData = Data.Table0;
                if (resData.length > 0) {
                    $(obj).closest("tr").find("input[id^='tblContactInformation_HdnCityName']").val(resData[0].SNo);
                    $(obj).closest("tr").find("input[id^='tblContactInformation_CityName']").val(resData[0].CityName);
                }
            }
        });

    }
    var sno = $("#tblContactInformation_HdnCountryName_" + id).val();
    // alert(sno);
    GetIsdCode(sno, id);
}

function AccountBranchGrid() {
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        ShowMessage('info', 'Need your Kind Attention!', "Account Branch Information can be added in Edit/Update mode only.");
        return;
    }
    else {
        var dbtableName = "Branch";
        $("#tbl" + dbtableName).appendGrid({
            tableID: "tbl" + dbtableName,
            contentEditable: "EDIT",
            masterTableSNo: $("#hdnAccountSNo").val(),
            currentPage: 1, itemsPerPage: 10, whereCondition: null, sort: "",
            isGetRecord: true,
            servicePath: "./Services/Master/AccountService.svc",
            getRecordServiceMethod: "GetBranchRecord",
            caption: "Branch Information",
            initRows: 1,
            columns: [{ name: "SNo", type: "hidden" },
                     { name: "AccountSNo", type: "hidden", value: $("#hdnAccountSNo").val() },
                     { name: "CityCode", display: "City Code", type: "label", ctrlCss: { width: "100px" } },
                     { name: "CityName", display: "City Name", type: "label", ctrlCss: { width: "100px" } },
                     { name: "Name", display: "Name", type: "label", ctrlCss: { width: '100px' } },
                     { name: "Address", display: "Address", type: "label", ctrlCss: { width: '100px' } },
                     {
                         name: "Select", display: "Select", type: "hidden",
                         customBuilder: function (parent, idPrefix, name, uniqueIndex) {
                             var ctrlId = idPrefix + "_" + name + "_" + uniqueIndex;
                             var ctrl = document.createElement("span");
                             $(ctrl).attr({ id: ctrlId, name: ctrlId }).appendTo(parent);
                             $("<input>", { type: "button", maxLength: 1, id: ctrlId, name: ctrlId + "_btnSelect", value: "Select", onclick: "GetRecorde(" + uniqueIndex + ");" }).css("width", "75px").appendTo(ctrl).button();
                             return ctrl;
                         }
                     }
            ],
            isPaging: true,
            hideButtons: { updateAll: true, insert: true, remove: true, append: true, removeLast: true }
        });
    }
}

function GetRecorde(obj) {
    //tblBranch_SNo_1
    navigateUrl('Default.cshtml?Module=Master&Apps=Account&FormAction=EDIT&UserId=0&RecID=' + $('#tblBranch_SNo_' + obj).val());
}

function checkForEmail(currObject) {
    var emailaddress = $("#" + currObject).val();
    var emailexp = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if 
    (!emailexp.test(emailaddress)) {
        alert('Please enter valid email address.');
        //  $("#" + currObject).focus();
        return false;

    }
}

function CheckAndClearText(obj) {
    if ($("#" + obj.id).val() < 1)
        $("#" + obj.id).val("");
}

function SetEMailNew() {
    // var arm = $("#Email").val().toUpperCase()
    $("#Email").keyup(function (e) {
        var addlen = $("#Email").val().toUpperCase();
        var iKeyCode = (e.which) ? e.which : e.keyCode
        if (iKeyCode == 32) {
            addlen = addlen.slice(0, -1);
            if (addlen != "") {
                if (ValidateEMail(addlen)) {
                    if ($("ul#addlist2 li").length < 3) {
                        var listlen = $("ul#addlist2 li").length;
                        $("ul#addlist2").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + addlen + " </span><span id='" + listlen + "' class='k-icon k-delete remove'></span></li>");

                    }
                    else {
                        ShowMessage('warning', 'Warning - Account', "Maximum 3 E-mail Addresses allowed.");
                    }
                    $("#Email").val('');
                    $("#Email").removeAttr('data-valid');
                }
                else {
                    ShowMessage('warning', 'Warning - Account', "Please enter valid Email Address.");
                    $("#Email").val('');
                }
            }
        }
        else
            e.preventDefault();
    });
    $("#Email").blur(function () {
        $("#EmailAddress").val('');
    });

    $("body").on("click", ".remove", function () {
        $(this).closest("li").remove();

        if ($("ul#addlist2 li").length == 0 && $("#Message").is(':checked') == true) {
            $("#Email").attr('data-valid', 'required');
        }
        else {
            $("#Email").removeAttr('data-valid');
        }
    });
}

function ValidateEMail(email) {
    var regex = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;;
    return regex.test(email);
}

/* Author : shahbaz akhtar 
   Modification Date  : 10/01/2017
   Description : 
   1 To get isd code on he basis of selected country      
   
 */

function checkForLength(obj) {
    // alert(obj);
    var length = $("#" + obj).val().length;
    //alert(length);
    if (length < 6) {
        ShowMessage('info', 'Need your Kind Attention!', "You are not allow to enter Mobile number less than 6 .", "bottom-left");
        $('#' + obj).val('0');
        // $('#' + obj).focus();
    }

}
function CountryCity(id) {
    try {
        // alert("dgdfgd");

        $.ajax({
            type: "GET",
            url: "./Services/Master/OfficeService.svc/GetCurrencyInformation",
            async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ SNo: $("#CitySNo").val() }),
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                var ResultData = jQuery.parseJSON(response);
                var FinalData = ResultData.Table0;
                if (FinalData.length > 0) {

                    var values = FinalData[0].CountrySNo;
                    var citysno = $('#CitySNo').val();
                    var citytext = $('#Text_CitySNo').val();
                    //      alert(values);
                    $('#tblContactInformation_HdnCountryName_' + id).val(FinalData[0].CountrySNo);
                    $('#tblContactInformation_CountryName_' + id).val(FinalData[0].CountryName);
                    $('#tblContactInformation_HdnCityName_' + id).val(citysno);
                    $('#tblContactInformation_CityName_' + id).val(citytext);
                    GetIsdCode(values, id);
                    $('#tblContactInformation_CountryName_' + id).attr('disabled', true);
                    $('#tblContactInformation_CityName_' + id).attr('disabled', true);
                }
            }
        });
        // CurrencyChange();
    }
    catch (exp) { }

}


function GetIsdCode(id, controlid) {

    try {
        $.ajax({
            type: "GET",
            url: "./Services/Master/OfficeService.svc/GetIsdCode",
            async: false, type: "POST", dataType: "json", cache: false,
            data: JSON.stringify({ masterTableSNo: id }),
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                var ResultData = jQuery.parseJSON(response);
                var FinalData = ResultData.Table0;
                //  alert("dsds");
                if (FinalData.length > 0) {
                    //  $('#AirportSNo').val(FinalData[0].SNo);

                    //     $('#_temptblContactInformation_MobileNo_' + controlid).val(FinalData[0].ISD);
                    var gr = FinalData[0].ISD;
                    $('#_isdcode_' + controlid).remove();
                    $('#_temptblContactInformation_MobileNo_' + controlid).before('<span  id="_isdcode_' + controlid + '">' + gr + ' - ' + '</span>&nbsp;');
                    //   $('#_tempisd_' + controlid).val(gr);

                }
            }
        });
    }
    catch (exp) { }

}


/* Author : arman  ali 
   Modification Date  : 04/03/2017
   Description : required validation for transactiotype 
 */
if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
    if ($('#Text_AccountTypeSNo').val() == 'FORWARDER' || $('#Text_AccountTypeSNo').val() == 'PO MAIL') {
        $('#Text_CustomerTypeSNo').attr("data-valid", "required");
        $('#Text_TransactionTypeSNo').attr("data-valid", "required");
        $('#spnCustomerTypeSNo').closest('td').find('font').text(' *');
        $('#spnTransactionTypeSNo').closest('td').find('font').text(' *');
        if ($('#Text_AccountTypeSNo').val() == "FORWARDER") {
       
           // $('#Text_IndustryTypeSNO').data("kendoAutoComplete").enable(true);
            $('#Text_IndustryTypeSNO').removeAttr("data-valid");
        }
        //else
           // $('#Text_IndustryTypeSNO').data("kendoAutoComplete").enable(false);
        enablecredit();
    }
    else
        disablecredit();

}


function disablecredit() {

    $('input:radio[name=IsAllowedCL]').attr('disabled', true);
    $('input:radio[name=IsAllowedConsolidatedCL]').attr('disabled', true);
    $("#_tempCreditLimit").attr('disabled', true);
    $("#_tempMinimumCL").attr('disabled', true);
    $("#AlertCLPercentage").attr('disabled', true);
    $("#AccountNo").attr('disabled', true);
    $("#BillingCode").attr('disabled', true);
    $("#CreditLimit").attr('disabled', true);
    $("#MinimumCL").attr('disabled', true);
    $("#MinimumCL").val('');
    $("#AlertCLPercentage").val('');
    $("#_tempMinimumCL").val('');
    // abc   $("#Text_InvoicingCycle").attr('disabled', true);
}

function enablecredit() {
    
    $('input:radio[name=IsAllowedCL]').attr('disabled', false);
    $('input:radio[name=IsAllowedConsolidatedCL]').attr('disabled', false);
    $("#_tempCreditLimit").attr('disabled', true);
    $("#MinimumCL").attr('disabled', false);
    $("#CreditLimit").attr('disabled', false);
    $("#_tempMinimumCL").attr('disabled', false);
    $("#AlertCLPercentage").attr('disabled', false);
    $("#AccountNo").attr('disabled', false);
    $("#BillingCode").attr('disabled', false);
    // abc $("#Text_InvoicingCycle").attr('disabled', false);
    //  $("#_tempCreditLimit").attr('readonly', false);
    $("#_tempMinimumCL").attr('readonly', false);
    $("#AlertCLPercentage").attr('readonly', false);
}

$('input[type=radio][name=IsBlacklist]').change(function () {
        if (this.value == '0') {
            $("#Remark").closest('tr').show();
            $("#Remark").attr("data-valid", 'required');
            $("#Remark").val("");
        }
        else if (this.value == '1') {
            $("#Remark").closest('tr').hide();
            $("#Remark").removeAttr("data-valid")
            $("#Remark").val("");

        }


              
    });
