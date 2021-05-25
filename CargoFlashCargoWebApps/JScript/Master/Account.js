var getCitydata = "";
var PageType = getQueryStringValue("FormAction").toUpperCase();
var CustomerTypeList = [{ Key: "2", Text: "Both" }, { Key: "3", Text: "Domestic" }, { Key: "1", Text: "International" }]
var TransactionTypeList = [{ Key: "0", Text: "Topup" }, { Key: "1", Text: "Credit" }, { Key: "2", Text: "CASS" }, { Key: "3", Text: "CASH" }]

var WorkingCustomerList = [{ Key: "5", Text: "Regular" }, { Key: "6", Text: "Contractual " }, { Key: "7", Text: "Corporate" }]
var InvoicingCycleType = [{ Key: "2", Text: "Weekly" }, { Key: "4", Text: "Fortnightly" }, { Key: "5", Text: "Monthly" }]
var FreightInvoicingype = [{ Key: "4", Text: "Fortnightly" }]; // Added by FreightInvoicingype by umar
var aHyphine = 0;
var bSpace = 0;
var cSlash = 0;
$(document).ready(function ()
{
	//$("#GSTNumber").hide();
	//if (userContext.SysSetting.ICMSEnvironment == 'I5')
	//{
	//	$("#GSTNumber").show(); 
    //}
    if (userContext.SysSetting.ClientEnvironment.toUpperCase() == 'GA') {
        $("#NoofReplan").closest('td').prev('td').text('Count of Re-Execution');
    }
    var AccountType = getQueryStringValue("FormAction").toUpperCase() == "READ" ? $("#AccountTypeSNo").val() : $("#Text_AccountTypeSNo").val()
    if ($("#Text_CountrySNo").val() == "IN-INDIA" && userContext.SysSetting.IsGSTApplicableForAgent == 'True' && AccountType != "POS" ) {
        $("#GSTNumber").closest('tr').prev().show();
        $("#GSTNumber").closest('tr').show();
        $("#GSTNumber").closest('tr').next().show();
        $("#RegCompanyName").closest('tr').show();


    }
    else {
        $("#GSTNumber").closest('tr').prev().hide();
        $("#GSTNumber").closest('tr').hide();
        $("#GSTNumber").closest('tr').next().hide();
        $("#RegCompanyName").closest('tr').hide();
        $("#GSTNumber").val("");
        $("#GSTADD").val("");
        $("#DefaultGSTNumber").val("");
        $("#DEFAULTGSTADD").val("");
        $("#RegCompanyName").val("");
    }


	if (userContext.SysSetting.ClientEnvironment == 'UK')
	{
		if(getQueryStringValue("FormAction").toUpperCase() == "EDIT")
		{
		    //$("#ParticipantID").attr("disabled", true);
		    $('#ParticipantID').prop('readonly', true);
		}
	}
	$(document.body).append('<style>#ApplicationTabs-3{overflow-x: scroll;}</style>');
   // $("table thead th:eq(2)").find('.k-link').text('Participant ID')  // added by arman Date: 2017-07-19 change text of Grid Column(Account No  to Participant ID ) :
	cfi.ValidateForm();
	// added by arman for hiding last two tabs
	$('#liAccountCommision,#liAccountVatExempt').hide();
	// end

	// for Credit Limti Transaction Type -----------------
	//<input type="checkbox" tabindex="50" onclick="ShowEmail(this);" class="" name="Message" id="Message" colname="message" validatename="Message[]">
	var strExclude = '';
	strExclude = '<tr><td class="formlabel">Exclude Bank Guarantee from Credit Limit</td><td class="formInputcolumn">'
	strExclude += '<input type="checkbox" class="" name="IsExcludeBankGuarantee" id="IsExcludeBankGuarantee" style="width: 20px; text-transform: uppercase;" tabindex="47">'
	strExclude += '</td><td class="formlabel" title="Enter Billing Code"></td><td class="formInputcolumn">'
	strExclude += '</td></tr>'
	//////////////////////// END //////////////////////////


	$('#aspnetForm').attr("enctype", "multipart/form-data");
	if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE")  // ADDED VY ARMAN ALI DATE(2017-11-23)
		$("input[type='radio'][id='VatExempt'][value='1']").attr('checked', true) 

	if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
		// disablecredit();
		cfi.AutoCompleteV2("BusinessTypeSno", "BusinessType", "Account_BusinessType", null, "contains");
		cfi.AutoCompleteV2("DesignationID", "DesignationName", "Account_Designation", null, "contains");
		cfi.AutoCompleteV2("AirlineSNo", "CarrierCode,AirlineName", "Account_AirlineName", null, "contains");
		cfi.AutoCompleteV2("OfficeSNo", "Name", "Account_Office", GetOfficeType, "contains");
		cfi.AutoCompleteV2("AccountTypeSNo", "AccountTypeName", "Account_AccountType",  readtruckvender, "contains");
		cfi.AutoCompleteV2("CurrencySNo", "CurrencyCode,CurrencyName", "Account_Currency", null, "contains");
		cfi.AutoCompleteV2("CitySNo", "CityCode,CityName", "Account_City",  null, "contains", null, null, null, null, SelectCity);
		cfi.AutoCompleteV2("Branch", "CityCode,Name", "Account_Branch",  null, "contains");
		cfi.AutoCompleteByDataSource("CustomerTypeSNo", CustomerTypeList, null, null);
		cfi.AutoCompleteByDataSource("TransactionTypeSNo", TransactionTypeList, checkCasswithTrans, null);
		cfi.AutoCompleteV2("CountrySNo", "CountryCode,CountryName", "Account_Country", HideGSTbillinginfo, "contains", null, null, null, null, ChangeCity);
		cfi.AutoCompleteV2("IndustryTypeSNO", "IndustryTypeName", "Account_IndustryType", null, "contains");
		cfi.AutoCompleteByDataSource("InvoicingCycle", InvoicingCycleType);
		//==  add by Umar ON Date : 05 June 2018 ===========================================
		cfi.AutoCompleteByDataSource("FreightInvoicingCycle", FreightInvoicingype);
		// ============================ End ================================================
		cfi.AutoCompleteV2("OtherAirlineSNo", "CarrierCode,AirlineName", "Account_AirlineName", null, "contains", ",");
		$('#spnName').text('Name');
		//================================added by  arman Date : 15 Apr 2017=================
		$("#ValidFrom").data('kendoDatePicker').min(new Date());

		cfi.BindMultiValue("OtherAirlineSNo", $("#Text_OtherAirlineSNo").val(), $("#OtherAirlineSNo").val());
		//===========================================end===========================================
		// getAirportSNo();
		//NEHAL
		if (userContext.GroupName.toUpperCase() == 'GSA') {
			if ((getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE")) {
				//if (userContext.SpecialRights.EOCA != undefined && userContext.SpecialRights.EOCA == true) {

				//Added By Shivam TFS id:15843
				//Purpose : To Disable All Mandatory Fields when the value of DisableEntryForGSAOnAccount in systemsettings is True but only in case of GSA 


				if (userContext.SysSetting.DisableEntryForGSAOnAccount.toUpperCase() == "TRUE")
				{
		            $("#CitySNo").val(userContext.CitySNo);
		            $("#Text_CitySNo").val(userContext.CityCode + '-' + userContext.CityName);
		            $("#OfficeSNo").val(userContext.OfficeSNo);
		            $("#Text_OfficeSNo").val(userContext.GroupName);                    //===============added by Ankit Kumar================//
		            $("#CountrySNo").val(userContext.CountrySNo);
		            $("#Text_CountrySNo").val(userContext.CountryName);                 //===============added by Ankit Kumar================//

		            $('#Text_CitySNo').data("kendoAutoComplete").enable(false);
		            $('#Text_OfficeSNo').data("kendoAutoComplete").enable(false);           //===============added by Ankit Kumar================//           
					$('#Text_CountrySNo').data("kendoAutoComplete").enable(false);          //===============added by Ankit Kumar================//



					// Only for G9 Enviroment in case of GSA//
					//Added By Shivam TFS id:15843

					$("input[type='radio'][name='IsHeadAccount'][data-radioval='Yes']").click();
					
					$("input[type='radio'][name='IsHeadAccount'][data-radioval='No']").attr("disabled", true);


						$("input[type='radio'][name='IsWarehouse'][data-radioval='No']").click();
						$("input[type='radio'][name='IsBlacklist'][data-radioval='No']").click();


						
					


						$('#Text_AccountTypeSNo').val('FORWARDER');
						$('#AccountTypeSNo').val(2);



						$('#Text_CustomerTypeSNo').val('BOTH');
						$('#CustomerTypeSNo').val(2);

						$('#Text_AirlineSNo').val(userContext.AirlineCarrierCode);
						$('#AirlineSNo').val(userContext.AirlineSNo);


						$('#Text_TransactionTypeSNo').val('CREDIT');
						$('#TransactionTypeSNo').val(1);


						$('#Text_IndustryTypeSNO').val('OTHER SERVICE ACTIVITIES');
						$('#IndustryTypeSNO').val(20);


						$('#Text_LoginColorCodeSno').val('BLUE');
						$('#LoginColorCodeSno').val(2);



						$('#Text_InvoicingCycle').val('MONTHLY');
						$('#InvoicingCycle').val(5);

						$('#Text_AccountTypeSNo').data("kendoAutoComplete").enable(false);
						$('#Text_AirlineSNo').data("kendoAutoComplete").enable(false);
						
				
	
		        }
		    }
		}
		
		/*Remove required attribute from transactiotype and customer type by arman ali  */
		$('#Text_CustomerTypeSNo').removeAttr("data-valid");
		$('#Text_TransactionTypeSNo').removeAttr("data-valid");
		$('#spnCustomerTypeSNo').closest('td').find('font').text('');
		$('#spnTransactionTypeSNo').closest('td').find('font').text('');
		var rem= '<tr><td class="formlabel"></td><td class="formlabel"></td><td class="formlabel" title="Enter Remarks"><span id="spnRemarks"><font color="red"><font><font class="">*</font></font></font> Remarks </span></td><td class="formInputcolumn"><textarea class="k-input" name="Remark" id="Remark" style="width: 250px; text-transform: uppercase;" controltype="alphanumericupper" allowchar="/-," tabindex="22" maxlength="190" data-role="alphabettextbox" data-valid="required" autocomplete="off"></textarea></td></tr>';
		cfi.AutoCompleteV2("LoginColorCodeSno", "Name", "Account_LoginColorCodeSno", AppendLoginColor, "contains");
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

			$('#IsAutoStock').closest('tr').after(strExclude); // Added by Umar for Exclude Bank BG.
			$("[type='checkbox'][id='IsExcludeBankGuarantee']").unbind('click').bind('click', function () {             
				$("[type='hidden'][id='hdnIsExcludeBankGuarantee']").val($(this).prop("checked") == true ? true : false)
				$("[type='checkbox'][id='IsExcludeBankGuarantee']").val($(this).prop("checked") == true ? true : false)
			})  

			if (userContext.SysSetting["IsAccountInvoiceCycleMandatory"].toUpperCase() == "TRUE") {
				if ($("#Text_TransactionTypeSNo").val().toUpperCase() == "TOPUP" || $("#Text_TransactionTypeSNo").val().toUpperCase() == "CREDIT" || $("#Text_TransactionTypeSNo").val().toUpperCase() == "CASS") {
					$("#Text_InvoicingCycle").attr('data-valid', 'required');
					$("#Text_InvoicingCycle").attr('data-valid-msg', 'Invoicing Cycle can not be blank');
				}
				else {
					$("#Text_InvoicingCycle").removeAttr('data-valid');
					$("#Text_InvoicingCycle").removeAttr('data-valid-msg');
				}
			}

            if (userContext.SysSetting["IsGSTApplicableForAgent"].toUpperCase() == "TRUE") {
                var AccountType = getQueryStringValue("FormAction").toUpperCase() == "READ" ? $("#AccountTypeSNo").val() : $("#Text_AccountTypeSNo").val()
                if ($("#Text_CountrySNo").val() == "IN-INDIA" && AccountType != "POS" ) {
			        $("#GSTNumber").attr('data-valid', 'maxlength[15],minlength[15],required');
			        $("#GSTNumber").attr('data-valid-msg', 'GSTNumber field can not be blank.GST Number should be of 15 characters');
			        $("#GSTADD").attr('data-valid', 'required');
			        $("#GSTADD").attr('data-valid-msg', 'GST Billing Address field can not be blank');
			    }
			    else {
			        $("#GSTNumber").removeAttr('data-valid');
			        $("#GSTNumber").removeAttr('data-valid-msg');
			        $("#GSTADD").removeAttr('data-valid');
                    $("#GSTADD").removeAttr('data-valid-msg');

			    }
			}
		

			GetOfficeType();        
		}         
		if (getQueryStringValue("FormAction").toUpperCase() == "NEW")
		{
			$("#ValidTo").data("kendoDatePicker").value(getDateNextYear());
			$("input:radio[name='AsAgreed'][value ='1']").prop('checked', true);
			$("input:radio[name='VisibilityofPriority'][value ='1']").prop('checked', true);
			$("input[id='SplitShipmentAllowed'][value ='0']").prop('checked', true);
			$('#IsExcludeBankGuarantee').attr('disabled', true);
		}

if (userContext.SysSetting.IsAsAgreedMaiontainOnAccountPage.toUpperCase() == 'TRUE')
	{
$("input:radio[name='AsAgreed'][value ='0']").prop('checked', true);
$('input:radio[name=AsAgreed]').attr('disabled', true);
}


	}
	
	if (getQueryStringValue("FormAction").toUpperCase() == "READ")
	{
		$('#AccountNo').closest('tr').after(strExclude);
		$("[type='checkbox'][id='IsExcludeBankGuarantee']").unbind('click').bind('click', function () {
			$("[type='hidden'][id='hdnIsExcludeBankGuarantee']").val($(this).prop("checked") == true ? true : false)
			$("[type='checkbox'][id='IsExcludeBankGuarantee']").val($(this).prop("checked") == true ? true : false)
		})
		  
		$('span#AlertCLPercentage').after('%');
		if ($("#Text_TransactionTypeSNo").val() == "Topup")
		{
			enablecredit();
			$('input:radio[name=IsAllowedCL]').attr('disabled', true);
			ChangeCreditLimitInformation();
		}
		// Transaction type=Credit and IsExcludeBankGuarantee=true then both true             
		if ($('#Text_TransactionTypeSNo').val().toUpperCase() == "CREDIT" && userContext.SysSetting["IsExcludeBankGuarantee"].toUpperCase() == "TRUE") { 
			if ($('#hdnIsExcludeBankGuarantee').val() == "True") {
				$('#IsExcludeBankGuarantee').attr('checked', true);
				$('#IsExcludeBankGuarantee').attr('disabled', true);
			}
			else {
				$('#IsExcludeBankGuarantee').attr('checked', false);
				$('#IsExcludeBankGuarantee').attr('disabled', true);
			}          
		}
		else {
			$('#IsExcludeBankGuarantee').attr('checked', false);
			$('#IsExcludeBankGuarantee').attr('disabled', true);
		}      
	}
	if (getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE")
	{
		if ($("#Text_TransactionTypeSNo").val().toUpperCase() == "CASS")
		{
			changeLabelText();          
		}
		if ($("#Text_TransactionTypeSNo").val().toUpperCase() == "TOPUP")
		{
			ChangeCreditLimitInformation();       
		}
		if ($("#Text_TransactionTypeSNo").val().toUpperCase() == "CREDIT")
		{
			changeLabelText();
		}
		if ($("#Text_TransactionTypeSNo").val().toUpperCase() == "CASH")
		{
			changeLabelText();         
		}
	   // $('#AccountNo').closest('tr').after(strExclude); // Added by Umar for Exclude Bank BG.
		if ($('#Text_TransactionTypeSNo').val().toUpperCase() == "CREDIT" && userContext.SysSetting["IsExcludeBankGuarantee"].toUpperCase() == "TRUE") { // Transaction type=Credit and IsExcludeBankGuarantee=true then both true
		  
			if ($("[type='hidden'][id='hdnIsExcludeBankGuarantee']").val() == "FALSE") {
				$('#IsExcludeBankGuarantee').attr('checked', false);
				$('#IsExcludeBankGuarantee').attr('disabled', true);
			}
			else {
				$('#IsExcludeBankGuarantee').attr('checked', false);
				$('#IsExcludeBankGuarantee').attr('disabled', false);
			}
		}
		else {
			$('#IsExcludeBankGuarantee').attr('checked', false);
			$('#IsExcludeBankGuarantee').attr('disabled', true);
}
	}
	if (getQueryStringValue("FormAction").toUpperCase() == "EDIT") {
		// commented by arman ali 02-05-2017
		$('#Text_AirlineSNo').data("kendoAutoComplete").enable(false);
		// end
		if ($("#Text_TransactionTypeSNo").val() == "Topup")
		{
			enablecredit();
			$('input:radio[name=IsAllowedCL]').attr('disabled', true);
			ChangeCreditLimitInformation();
			$('#IsExcludeBankGuarantee').attr('checked', false);
			$('#IsExcludeBankGuarantee').attr('disabled', true);
		}
		else if ($("#Text_TransactionTypeSNo").val() == "CASS")
		{
			changeLabelText();
			enablecredit();
			$('input:radio[name=IsAllowedCL]').attr('disabled', true);

			$('input:radio[name=IsAllowedConsolidatedCL]').attr('disabled', true);
			$('#IsExcludeBankGuarantee').attr('checked', false);
			$('#IsExcludeBankGuarantee').attr('disabled', true);
		}

		else if ($("#Text_TransactionTypeSNo").val() == "CASS")
		{
			changeLabelText();
			enablecredit();
			$('input:radio[name=IsAllowedCL]').attr('disabled', true);
			$('input:radio[name=IsAllowedConsolidatedCL]').attr('disabled', true);
			$('#IsExcludeBankGuarantee').attr('checked', false);
			$('#IsExcludeBankGuarantee').attr('disabled', true);
		}
		else if ($("#Text_TransactionTypeSNo").val() == "CASH") {
			changeLabelText();
			enablecredit();
			$("#_tempCreditLimit").attr('disabled', true);
			$('#IsExcludeBankGuarantee').attr('checked', false);
			$('#IsExcludeBankGuarantee').attr('disabled', true);
		}
		else
		{
			changeLabelText();
			enablecredit();
		}
		// Transaction type=Credit and IsExcludeBankGuarantee=true then both true       
	  
		if ($('#Text_TransactionTypeSNo').val().toUpperCase() == "CREDIT" && userContext.SysSetting["IsExcludeBankGuarantee"].toUpperCase() == "TRUE") {
		  
			if ($("[type='hidden'][id='hdnIsExcludeBankGuarantee']").val().toUpperCase() == "FALSE") {
				$('#IsExcludeBankGuarantee').attr('checked', false);
				$('#IsExcludeBankGuarantee').attr('disabled', false);
			}
			else {
				$('#IsExcludeBankGuarantee').attr('checked', true);
				$('#IsExcludeBankGuarantee').attr('disabled', true);
			}           
		}
		else {
			$('#IsExcludeBankGuarantee').attr('checked', false);
			
		}
				
	}
	function ChangeCity() {
		cfi.ResetAutoComplete("CitySNo");
		cfi.ResetAutoComplete("OfficeSNo");
		$("#GSTNumber").val("");
		$("#GSTADD").val("");
		$("#DefaultGSTNumber").val("");
		$("#DEFAULTGSTADD").val("");
		$("#RegCompanyName").val("");
        
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
			enablecredit();
		}
			//=========end
		else {
			enablecredit();
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
					$(this).text("Top Up Amount");
				}
				if ($(this).text() == "Allowed Credit Limit") {
					$(this).text("Allowed Top Up Amount");
				}
				if ($(this).text() == "Consolidated Credit Limit") {
					$(this).text("Consolidated Top Up");
				}
				if ($(this).text() == "Minimum Credit Limit") {
					$(this).text("Minimum Top Up Amount");
				}
				if ($(this).text() == "Alert Credit Limit(%)") {
					$(this).text("Alert Top Up Amount");
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
			if ($(this).text() == "Top Up Amount") {
				$(this).text(" Credit Limit");
				$(this).attr('title', 'Credit Limit');
			}
			if ($(this).text() == "Allowed Top Up Amount") {
				$(this).text("Allowed Credit Limit");
				$(this).attr('title', 'Allowed Credit Limit');
			}
			if ($(this).text() == "Consolidated Top Up") {
				$(this).text("Consolidated Credit Limit");
				$(this).attr('title', 'Consolidated Credit Limit');
			}
			if ($(this).text() == "Minimum Top Up Amount")
			{
				$(this).text("Minimum Credit Limit");
				$(this).attr('title', 'Minimum Credit Limit');
			}
			if ($(this).text() == "Alert Top Up Amount")
			{
				$(this).text("Alert Credit Limit(%)");
				$(this).attr('title', 'Alert Credit Limit(%)');
			}
		});
	}

	/////
	function checkCasswithTrans()
	{

		$("[type='hidden'][id='hdnIsExcludeBankGuarantee']").val($(this).prop("checked") == true ? true : false)
		$("#divBranch").remove();
		if ($("#Text_TransactionTypeSNo").val().toUpperCase()!= 'CASS') {
			$("#CASSNo").removeAttr('data-valid');
			$("#CASSNo").closest('td').prev().find('font').html('');
		}
		if (getQueryStringValue("FormAction").toUpperCase() == "NEW")
		{
			if ($("#Text_TransactionTypeSNo").val() == "CASS")
			{
				$('#CASSNo').attr("disabled", false);
				$("#CASSNo").closest('td').prev().find('span').show();
				$("#CASSNo").attr('data-valid', 'required');
				//$("#_tempMobile").attr('data-valid', 'required');
				$("#CASSNo").closest('td').prev().find('font').html('*');
				$("#CASSNo").val('');
				//$("#_tempMobile").val('');
				//$("#CASSNo").focus();
				changeLabelText();
				$('#IsExcludeBankGuarantee').attr('checked', false);
			}
			else if($("#Text_TransactionTypeSNo").val() != "")
			{
				$("#CASSNo").closest('td').prev().find('span').show();
				$("#CASSNo").removeAttr('data-valid');
				//$("#_tempMobile").attr('data-valid', 'required');
				$("#CASSNo").closest('td').prev().find('font').html('*');
				$("#CASSNo").val('');
				//$("#_tempMobile").val('');
				//$("#CASSNo").focus();
				$('#CASSNo').attr("disabled", true);
			}
			if($("#Text_TransactionTypeSNo").val().toUpperCase() == "TOPUP")
			{
				ChangeCreditLimitInformation();
				$('#IsExcludeBankGuarantee').attr('checked', false);
			}
			if($("#Text_TransactionTypeSNo").val().toUpperCase() == "CREDIT")
			{
				changeLabelText();
			}
				  
			if ($("#Text_TransactionTypeSNo").val().toUpperCase() == "CASH")
			{
				changeLabelText();
				$('#IsExcludeBankGuarantee').attr('checked', false);
			}
			// Transaction type=Credit and IsExcludeBankGuarantee=true then both true
			if ($('#Text_TransactionTypeSNo').val().toUpperCase() == "CREDIT" && userContext.SysSetting["IsExcludeBankGuarantee"].toUpperCase() == "TRUE") {
				$('#IsExcludeBankGuarantee').attr('disabled', false);
			}
			else {
				$('#IsExcludeBankGuarantee').attr('disabled', true);
			}

		  
		}
		else if (getQueryStringValue("FormAction").toUpperCase() == "EDIT")
		{
			if ($("#Text_TransactionTypeSNo").val() == "CASS")
			{
				$('#CASSNo').attr("disabled", false);
				$("#CASSNo").closest('td').prev().find('span').show();
				$("#CASSNo").attr('data-valid', 'required');
				//$("#_tempMobile").attr('data-valid', 'required');
				$("#CASSNo").closest('td').prev().find('font').html('*');
				$("#CASSNo").val('');
				//$("#_tempMobile").val('');
				//$("#CASSNo").focus();
				changeLabelText();
				$('#IsExcludeBankGuarantee').attr('checked', false);
				$('#IsExcludeBankGuarantee').attr('disabled', true);
			}
			if ($("#Text_TransactionTypeSNo").val().toUpperCase() == "TOPUP")
			{
				ChangeCreditLimitInformation();
				$('#IsExcludeBankGuarantee').attr('checked', false);
				$('#IsExcludeBankGuarantee').attr('disabled', true);
			}
			if ($("#Text_TransactionTypeSNo").val().toUpperCase() == "CREDIT")
			{
				changeLabelText();
			}
			// Transaction type=Credit and IsExcludeBankGuarantee=true then both true
			if ($('#Text_TransactionTypeSNo').val().toUpperCase() == "CREDIT" && userContext.SysSetting["IsExcludeBankGuarantee"].toUpperCase() == "TRUE") {  
				if ($("[type='hidden'][id='hdnIsExcludeBankGuarantee']").val() == "True") {
					$('#IsExcludeBankGuarantee').attr('checked', true);
					$('#IsExcludeBankGuarantee').attr('disabled', true);
			   }
			  
				else {
					$('#IsExcludeBankGuarantee').attr('checked', false);
					$('#IsExcludeBankGuarantee').attr('disabled', false);
				}               
			}
			else {
				$('#IsExcludeBankGuarantee').attr('checked', false);
				$('#IsExcludeBankGuarantee').attr('disabled', true);                
			}
			if ($("#Text_TransactionTypeSNo").val().toUpperCase() == "CASH")
			{
				changeLabelText();
				$('#IsExcludeBankGuarantee').attr('checked', false);
				$('#IsExcludeBankGuarantee').attr('disabled', true);
			}
			else if (getQueryStringValue("FormAction").toUpperCase() == "EDIT")
			{
				if ($("#Text_BusinessTypeSno").val() == "0")
				{
					$('#Text_BusinessTypeSno').attr("disabled", false);
				}
				else
				{
					cfi.AutoCompleteV2("BusinessTypeSno", "BusinessType", "Account_BusinessType", null, "contains");
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
			else
			{
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
		if (getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE")
		{
			if ($("#Text_TransactionTypeSNo").val().toUpperCase() == "CASS") {
				changeLabelText();
				$('#CASSNo').attr("disabled", false);
				$("#CASSNo").closest('td').prev().find('span').show();
				$("#CASSNo").attr('data-valid', 'required');
				$("#CASSNo").closest('td').prev().find('font').html('*');
				$("#CASSNo").val('');
				$('#IsExcludeBankGuarantee').attr('checked', false);
				$('#IsExcludeBankGuarantee').attr('disabled', true);
			}
			if ($("#Text_TransactionTypeSNo").val().toUpperCase() == "TOPUP") {
				ChangeCreditLimitInformation();
				$('#IsExcludeBankGuarantee').attr('checked', false);
				$('#IsExcludeBankGuarantee').attr('disabled', true);
			}
			if ($("#Text_TransactionTypeSNo").val().toUpperCase() == "CREDIT") {
				changeLabelText();
			}
			if ($("#Text_TransactionTypeSNo").val().toUpperCase() == "CASH") {
				changeLabelText();
			}
			// Transaction type=Credit and IsExcludeBankGuarantee=true then both true
			if ($('#Text_TransactionTypeSNo').val().toUpperCase() == "CREDIT" && userContext.SysSetting["IsExcludeBankGuarantee"].toUpperCase() == "TRUE") {
				$('#IsExcludeBankGuarantee').attr('checked', false);
				$('#IsExcludeBankGuarantee').attr('disabled', false);
			}
			else {
				$('#IsExcludeBankGuarantee').attr('checked', false);
				$('#IsExcludeBankGuarantee').attr('disabled', true);
			}
		}
		//------------ by arman date : 2017-11-29-----------
		//if ($("#Text_TransactionTypeSNo").val().toUpperCase() == "TOPUP") {
		//    var branch = '<span id="divBranch"><font id="req" color="red">&nbsp; *</font><b> Branch ID <b> &nbsp; <input id="BranchID" onblur="validateBranchID()" class="k-input" style="width: 60px; text-transform: uppercase;" tabindex="5" autocomplete="off" maxlength="3" name="BranchID" type="text" value="" data-valid-msg="Enter the Branch ID " controltype="alphanumericupper" data-role="alphabettextbox" data-valid="required"></span>';
		//    if ($("#BranchID").length < 1 )
		//    $("#Text_TransactionTypeSNo").closest('td').find('span:eq(0)').after(branch)
		//}

		if (userContext.SysSetting["IsAccountInvoiceCycleMandatory"].toUpperCase() == "TRUE") {
			if ($("#Text_TransactionTypeSNo").val().toUpperCase() == "TOPUP" || $("#Text_TransactionTypeSNo").val().toUpperCase() == "CREDIT" || $("#Text_TransactionTypeSNo").val().toUpperCase() == "CASS") {
				$("#Text_InvoicingCycle").attr('data-valid', 'required');
				$("#Text_InvoicingCycle").attr('data-valid-msg', 'Invoicing Cycle can not be blank');
			}
			else {
				$("#Text_InvoicingCycle").removeAttr('data-valid');
				$("#Text_InvoicingCycle").removeAttr('data-valid-msg');
			}
		}
		
	}
	// end here
	
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

	$("#Email").closest('td').prev().find('span').append(' (Max 6)');
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

   

	$("#tblContactInformation_btnAppendRow").live("click", function () {
		var lastRow = $("table tr[id^='tblContactInformation_Row_']").last().attr("id").split('_')[2];
		CountryCity(lastRow);
	  
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

	
	$("#spnBranch").prev().hide();
	$("#spnBranch").hide();
	$('#Text_Branch').removeAttr("data-valid");
	$('#Branch').closest('td').find('span').hide();

   



	readtruckvender();
  

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
		else
		{
			if (getQueryStringValue("FormAction").toUpperCase() == "NEW")
			{
				$('#CreditLimit').attr('readonly', false);
			}
			else
			{
				$('#CreditLimit').attr('readonly', true);
			}
		}
		//========== commented by arman ali Date : 2017 -07-11
		//if (parseInt(crlmt) < parseInt(minlmt)) {
		//    $("#_tempMinimumCL").val(oldminCl);
		//    $("#MinimumCL").val(oldminCl);
		//   // ShowMessage('warning', 'Warning - Account!', "Minimum Credit Limit can not exceed the Credit Limit");
		//}
	});


	$('input:radio[name=IsHeadAccount]').change(function () { RadioButtonSelectShow(); });
	var tabStrip1 = $("#ApplicationTabs").kendoTabStrip().data("kendoTabStrip");
	$("#AlertCLPercentage").bind("blur", function () {
		if ($(this).val() != undefined && $(this).val() > 100) {
	   
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
		//------------ by arman date : 2017-11-29-----------
		//$("[type='text'][id='BranchID']").remove();
		//if ($("#Text_TransactionTypeSNo").val().toUpperCase() == "TOPUP") {
		//    var branch = '<span id="divBranch"><font id="req" color="red">&nbsp; *</font> <b>Branch ID </b>&nbsp; <input id="BranchID"  onblur="validateBranchID()" class="k-input" style="width: 60px; text-transform: uppercase;" tabindex="5" autocomplete="off" maxlength="3" name="BranchID" type="text" value="" data-valid-msg="Enter the Branch ID " controltype="alphanumericupper" data-role="alphabettextbox" data-valid="required"></span>';
		//    $("#Text_TransactionTypeSNo").closest('td').find('span:eq(0)').after(branch)
		//    var val = $("[type='hidden'][id='HdnBranchID']").val().toUpperCase();
		//    $("[type='text'][id='BranchID']").val(val);


		//}
	}

	
	//$(document).keydown(function (event) {
	//    if (event.ctrlKey == true && (event.which == '118' || event.which == '86')) {
	//        event.preventDefault();
	//    }
	//});
   
	BindingGridonClick();
	function BindingGridonClick() {
		if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
			
		  
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
	   

			//var M = '';
			//for (var i = 0; i < $("ul#addlist2 li").text().split(' ').length - 1; i++)
			//{ M = M + $("ul#addlist2 li span").text().split(' ')[i] + ','; }


			//$("#Email").val(M.substring(0, M.length - 1));       //remove last comma   

			if ($("#addlist2 li").length > 0 && $("#Message").is(':checked') == true) {
				$("#Email").removeAttr("data-valid");
			}
			else if ($("#addlist2 li").length == 0 && $("#Message").is(':checked') == false) {
				$("#Email").removeAttr("data-valid");
			}
			else {
				$("#Email").attr("data-valid", "required");
			}
	}

	if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {

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
		//-- arman ali
		//------------ by arman date : 2017-11-29-----------
		//$("span#BranchID").remove();
		//if ($("#Text_TransactionTypeSNo").val().toUpperCase() == "TOPUP") {
		//    var branch = '<span id="divBranch"><b> &nbsp;  &nbsp; Branch ID : </b> &nbsp; <span id ="BranchID"> </span></span>';
		//    $("#Text_TransactionTypeSNo").closest('td').find('span:eq(0)').after(branch)
		//    var val = $("[type='hidden'][id='HdnBranchID']").val().toUpperCase();
		//    $("span[id='BranchID']").text(val);
		//}
		$("#IsBlacklist").closest('tr').after('<tr><td class="formlabel" title="Remarks">Remarks</td><td class="formInputcolumn"><span style="max-width: 250px;word-wrap: break-word;    display: inline-block;max-height: 50px;overflow: auto;" class="" id="Remark"></span></td><td class="formlabel"></td><td class="formlabel"></td></tr>');
		if ($("#IsBlacklist").val().toUpperCase() == "YES")
			$('#Remark').closest('tr').show();
		else if ($("#IsBlacklist").val().toUpperCase() == "NO")
			$('#Remark').closest('tr').hide();
		$('#Remark').text($("#Remarks").val());
		if ($("input[name='IsHeadAccount']").val() == "NO") {
		  
			$("#spnBranch").show();
			$("#spnBranch").prev().show();
			$('#Text_Branch').closest('td').find('span').show();
		}
		else {
		   
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


	
	if (getQueryStringValue("FormAction").toUpperCase() == "NEW") {
		$('#GarudaMile').on('blur', function () {
		   
			if ($("#GarudaMile").val().length != 0 && $("#GarudaMile").val().length != 9) {
				ShowMessage('warning', 'Need your Kind Attention!', 'Miles should be of minimum 9 digits');
				$("#GarudaMile").val('');
				 $('#_tempGarudaMile').val('');
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
				ShowMessage('warning', 'Need your Kind Attention!', 'Miles should be of minimum 9 digits');
				$("#GarudaMile").val('');
				$('#_tempGarudaMile').val('');
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
		$("#Text_AirlineSNo").data("kendoAutoComplete").enable(false); //added by devendra for issue 7338
	}
	if (getQueryStringValue("FormAction").toUpperCase() == "READ") {
		AppendLoginColor();
	}
   
	$('input[name=operation]').on('click', function () {
		var M = '';
		for (var i = 0; i < $("ul#addlist2 li").text().split(' ').length - 1; i++)
		{ M = M + $("ul#addlist2 li span").text().split(' ')[i] + ','; }
		$("#Email").val(M == '' ? '' : M.substring(0, M.length - 1));
		cfi.ValidateForm();
			if ($("#Mobile").val().length < 6 && $("#SMS").attr('checked') == "checked") {
				ShowMessage('info', 'Need your Kind Attention!', "Mobile Number Length Should Be Greater Than 5");
				// $("#Mobile,#_tempMobile").val('');
				return false;
			}
	});
   
	$('#OtherAirlineSNo').closest('td').prev('td').text('');
	$('#OtherAirlineSNo').closest('tr').prev('tr').text('');
	$('#Text_OtherAirlineSNo').closest('td').contents().hide();
  
	CreateOtherAirlineGrid();
	$('[id^=tblOtherAirlineSlab_SNo_]').val('0')// Added by devendra on  04/09/2018
	var TranType = $("#Text_TransactionTypeSNo").length > 0 ? $("#Text_TransactionTypeSNo").val().toUpperCase() : '';
	if (TranType != 'CASS') {
		$("#CASSNo").removeAttr('data-valid');
		$("#CASSNo").closest('td').prev().find('font').html('');
		$('#CASSNo').attr("disabled", true);
	}
});

function HideGSTbillinginfo() {

    var AccountType = getQueryStringValue("FormAction").toUpperCase() == "READ" ? $("#AccountTypeSNo").val() : $("#Text_AccountTypeSNo").val()
    if ($("#Text_CountrySNo").val() == "IN-INDIA" && userContext.SysSetting.IsGSTApplicableForAgent == 'True' && AccountType != "POS") {
        $("#GSTNumber").closest('tr').prev().show();
        $("#GSTNumber").closest('tr').show();
        $("#GSTNumber").closest('tr').next().show();
        $("#RegCompanyName").closest('tr').show();

        $("#GSTNumber").attr('data-valid', 'maxlength[15],minlength[15],required');
        $("#GSTNumber").attr('data-valid-msg', 'GSTNumber field can not be blank.GST Number should be of 15 characters');
        $("#GSTADD").attr('data-valid', 'required');
        $("#GSTADD").attr('data-valid-msg', 'GST Billing Address field can not be blank');
    }
    else {
        $("#GSTNumber").closest('tr').prev().hide();
        $("#GSTNumber").closest('tr').hide();
        $("#GSTNumber").closest('tr').next().hide();
        $("#RegCompanyName").closest('tr').hide();

        $("#GSTNumber").removeAttr('data-valid');
        $("#GSTNumber").removeAttr('data-valid-msg');
        $("#GSTADD").removeAttr('data-valid');
        $("#GSTADD").removeAttr('data-valid-msg');

        $("#GSTNumber").val("");
        $("#GSTADD").val("");
        $("#DefaultGSTNumber").val("");
        $("#DEFAULTGSTADD").val("");
        $("#RegCompanyName").val("");

    }


}

function CreateOtherAirlineGrid() {
	var Page = getQueryStringValue("FormAction").toUpperCase();
	var divtr = "<tr><td class='formSection' colspan='4'>Other Airline Information</td></tr><tr><td id='divTD' class='formInputcolumn' colspan='4'></td></tr>";

	var divOl = '<div id="divOtherAirlineSlab"><span id="spnOtherAirlineSlab"><table id="tblOtherAirlineSlab"></table></span></div>'
	$("#AWBPrintAllowedHour").closest('tr').prev('tr').before(divtr);
	$("#divTD").append(divOl);
	OtherAirlineDiv();
}
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
				$('span#LoginColorCodeSno').after(' <div id="divLoginColor" style="height:10px;width:25px;padding:5px;display:inline-flex;background-color:' + jQuery.parseJSON(response).Table0[0].ColorCode + '"></div> <div id="MaxUsersAdd" style="display:inline-flex;"> Max Users: ' + jQuery.parseJSON(response).Table0[0].MaxUsers + '</div>');
			}
			else {
				$('#divLoginColor').remove();
				$('#MaxUsersAdd').remove();


				//   $('#LoginColorCodeSno').parent().parent().parent().find('div').remove();
				$('#Text_LoginColorCodeSno').parent().parent().after('<div  id="divLoginColor" style="height:10px;width:25px;padding:5px;display:inline-flex;background-color:' + jQuery.parseJSON(response).Table0[0].ColorCode + '"></div><div id="MaxUsersAdd" style="display:inline-flex;"> Max Users: ' + jQuery.parseJSON(response).Table0[0].MaxUsers + '</div>');
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
$("input[name=GSTNumber]").keypress(function (evt) {

    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    var regex = /^[a-zA-Z0-9]+$/;    // allow only alphanumeric with nospace
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
});
$("input[name=DefaultGSTNumber]").keypress(function (evt) {

    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    var regex = /^[a-zA-Z0-9]+$/;    // allow only alphanumeric with nospace
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


function RadioButtonSelectShow() {
	if ($("input[name='IsHeadAccount']:checked").val() == 1 || $("input[name='IsHeadAccount']").val() == "No") {
	   
		$("#spnBranch").show();
		$("#spnBranch").prev().show();
		$('#Branch').closest('td').find('span').show();
		$('#Text_Branch').attr("data-valid", "required");
	}
	else {
	 
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
	$("#CreditLimit,#_tempCreditLimit").val(""); // by arman  Date : 2017-07-11
   
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

    HideGSTbillinginfo();

	if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {

		if ($('#Text_AccountTypeSNo').val() == "SHIPPER" || $('#Text_AccountTypeSNo').val() == "CONSIGNEE") {
			$('#Text_IndustryTypeSNO').data("kendoAutoComplete").enable(true);

			$('#Text_CustomerTypeSNo').data("kendoAutoComplete").enable(false);
			$('#Text_TransactionTypeSNo').data("kendoAutoComplete").enable(false);
			$('#CASSNo').attr("disabled", true);
			//     
			$("#Text_IndustryTypeSNO").attr('data-valid', 'required');
			$('#Text_AirlineSNo').data("kendoAutoComplete").enable(true);
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
		 //   $('#Text_CustomerTypeSNo').val('Domestic');
		//    $('#CustomerTypeSNo').val('3');
			$('#Text_TransactionTypeSNo').val('CASH');// By arman change CASS To CASH 2017-05-16
			$('#TransactionTypeSNo').val('3');
				$('#Text_AirlineSNo').data("kendoAutoComplete").enable(true);
				$('#Text_TransactionTypeSNo').data("kendoAutoComplete").enable(false);
		 //       $('#Text_CustomerTypeSNo').data("kendoAutoComplete").enable(false);
		 //       $('#Text_CustomerTypeSNo').val('Domestic');
		}
		else if ($('#Text_AccountTypeSNo').val() == 'POST OFFICE') {
		  // commented by Arman Ali date : 2018-02-01
			//$('#Text_CustomerTypeSNo').val('');
			//$('#CustomerTypeSNo').val('');
			$('#Text_TransactionTypeSNo').val('CREDIT');// By arman change CASS To CASH 2017-05-16
			$('#TransactionTypeSNo').val('1');
		  


			$('#Text_AirlineSNo').data("kendoAutoComplete").enable(true);
			//$('#Text_TransactionTypeSNo').data("kendoAutoComplete").enable(false);
			$('#Text_CustomerTypeSNo').data("kendoAutoComplete").enable(true);
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
			enablecredit();
		}
	}

	if (getQueryStringValue("FormAction").toUpperCase() == "READ" || getQueryStringValue("FormAction").toUpperCase() == "DELETE") {
		if ($('#Text_AccountTypeSNo').text() != 'TRUCK VENDOR') {
			$("#VendorType").text("");
			$("#VendorType").closest("td").prev().text("");
		}
	}

   

	if ($("#Text_AccountTypeSNo").val() == "FORWARDER") {
		$("#ForwarderAsConsignee:radio").closest('td').show();
		$("td[title='Select Forwarder (Agent) As Consignee']").show();
	}
	else {
		$("#ForwarderAsConsignee:radio").closest('td').hide();
		$("td[title='Select Forwarder (Agent) As Consignee']").hide();
	}
	
}
//NEHAL


//function getAirportSNo() {



//    $.ajax({
//        async: false,
//        type: "POST",
//        url: "./Services/Master/AccountService.svc/GetAirportDetails",
//        data: { id: $("#spnCityCode").text()},
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: function (response) {
//            alert("success");


//        },
//        error: function (msg) {

//        }
//    });
//}//function getAirportSNo() end

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

function ExtraParameters(id) {
	var param = [];
	if (id == "Text_AirlineSNo") {
		var UserSNo = userContext.UserSNo;
		param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
		return param;
	}
	var y = id.split('_')[2];
	if (id == "tblOtherAirlineSlab_AirlineSNo_" + y) {
		var UserSNo = userContext.UserSNo;
		param.push({ ParameterName: "UserSNo", ParameterValue: UserSNo });
		return param;
	}
}
function ExtraCondition(textId)
{
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
		if ($("#Branch").val() != "") {
			//alert($("#Branch").val())
			var data = branchAirline();
			cfi.setFilter(filterEmbargo, "SNo", "in", data);
		}
		var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
		return OriginCityAutoCompleteFilter2;
	}  
	// end here
	if (textId == "Text_OtherAirlineSNo") {
		if (userContext.SysSetting.ICMSEnvironment != 'JT')
			cfi.setFilter(filterEmbargo, "IsInterline", "eq", 0);
		cfi.setFilter(filterEmbargo, "SNo", "neq", $("#AirlineSNo").val());
		cfi.setFilter(filterEmbargo, "SNo", "notin", $("#OtherAirlineSNo").val());
		var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
		return OriginCityAutoCompleteFilter2;
	} 
	if (textId == "Text_AccountTypeSNo") {
		//$('#Text_CustomerTypeSNo').val('');
		cfi.setFilter(filterEmbargo, "AccountTypeName", "neq", "AGENT")
		var OriginCityAutoCompleteFilter2 = cfi.autoCompleteFilter([filterEmbargo]);
		return OriginCityAutoCompleteFilter2;
	}
   


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
	//autocomplete on grid
	var y = textId.split('_')[2];
	if (textId == "tblOtherAirlineSlab_AirlineSNo_" + y) {
		var arr = $("input[name^='tblOtherAirlineSlab_HdnAirlineSNo_']").map(function () {
			return this.value;
		}).get();
		if (userContext.SysSetting.ICMSEnvironment != 'JT')
		 cfi.setFilter(filterEmbargo, "IsInterline", "eq", 0);
		cfi.setFilter(filterEmbargo, "SNo", "neq", $("#AirlineSNo").val());
			if ($("#Branch").val() != "") {
				//alert($("#Branch").val())
				var data = branchAirline();
				cfi.setFilter(filterEmbargo, "SNo", "in", data);
			}
		if (y > 1) {
			var SNOs = arr.toString();
			cfi.setFilter(filterEmbargo, "SNo", "notin", SNOs);
		}
		// cfi.setFilter(filterEmbargo, "rtype", "eq", $("#tblOtherAirlineSlab_AirlineSNo_" + y).val());
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
		cfi.ValidateForm()
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
		var pageType = getQueryStringValue("FormAction").toUpperCase();
		$("#ApplicationTabs-3").css('overflow-x', 'scroll');
		cfi.ValidateForm();
		$("#tbl" + dbtableName).appendGrid({
			tableID: "tbl" + dbtableName,
			contentEditable: pageType != 'READ',
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
						   AutoCompleteName: 'Account_Designation_', filterField: 'DesignationName'
					   },
					   { name: "Position", display: "Position", type: "text", ctrlCss: { width: '80px' }, ctrlAttr: { maxlength: 100, controltype: "alphanumericupper" } },
						 {
							 name: "MobileNo", display: "Mobile No", type: "text", ctrlCss: { width: '77px' }, ctrlAttr: { maxlength: 16, minlength: 6, controltype: "number", onblur: "return checkForLength(this.id);" }, onChange: function (evt, rowIndex) {

							 }
						, isRequired: true
						 },
						 { name: "EmailId", display: "Email Id", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 50, onblur: "return checkForEmail(this.id);" }, },
					  { name: "CountryName", display: "Country", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", onSelect: "return RemoveCity(this.id);" }, ctrlCss: { width: "80px" }, isRequired: true, AutoCompleteName: "Account_CountryName_", filterField: "CountryName" },
					 { name: "CityName", display: "City", type: "text", ctrlAttr: { maxlength: 98, controltype: "autocomplete" }, ctrlCss: { width: "80px" }, isRequired: true, AutoCompleteName: "Account_City_", filterField: 'CityName', filterCriteria: "contains" },

					  { name: "State", display: "State", type: "text", ctrlCss: { width: '80px' }, ctrlAttr: { maxlength: 30, controltype: "alphanumericupper" }, },
						 { name: "District", display: "District", type: "text", ctrlCss: { width: '80px' }, ctrlAttr: { maxlength: 50, controltype: "alphanumericupper" }, },

							{ name: "SubDistrict", display: "Sub District", type: "text", ctrlCss: { width: '80px' }, ctrlAttr: { maxlength: 50, controltype: "alphanumericupper" }, },

							{ name: "Address", display: "Street 1", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, minlength: 1, controltype: "alphanumericupper", allowchar: "*@,-/()_;:<>$%" }, },
					 { name: "Address2", display: "Street 2", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 100, minlength: 1, controltype: "alphanumericupper", allowchar: "*@,-/()_;:<>$%" } },
					  { name: "PostalCode", display: "Postal Code", type: "text", ctrlCss: { width: '70px' }, ctrlAttr: { maxlength: 9, minlength: 1, controltype: "alphanumericupper" }, },

					 //{ name: "FaxNumber", display: "", type: "text", ctrlCss: { width: '70px' }, ctrlAttr: { maxlength: 4, controltype: "number" }},

					 { name: "PhoneNo", display: "Office Phone", type: "text", ctrlCss: { width: '70px' }, ctrlAttr: { maxlength: 16,minlength: 6, controltype: "number" }, },

						 { name: "Off_EmailId", display: "Off Email Id", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 50, onblur: "return checkForEmail(this.id);" }, },

					 { name: "Town", display: "Town / Place", type: "text", ctrlCss: { width: '70px' }, ctrlAttr: { maxlength: 100, minlength: 1, controltype: "alphanumericupper" }, },

					 { name: "Telex", display: "Telex", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { maxlength: 50, minlength: 1, controltype: "number" } },
					 { name: (pageType == "EDIT" ? "Active" : "IsActive"), display: "Active", type: "radiolist", ctrlOptions: { 0: "No", 1: "Yes" }, selectedIndex: 1 },


			],
			afterRowAppended: function (caller, parentRowIndex, addedRowIndex) {
			   // $("#ApplicationTabs-3").css('overflow-x', 'scroll');
			},
			dataLoaded: function (caller, parentRowIndex, addedRowIndex) {
			  
		  
				var count = $('#tblContactInformation  >tbody >tr').length;
			  
			 
				for (i = 1; i <= count; i++) {

					var sno = $("#tblContactInformation_HdnCountryName_" + i).val();
					//   alert(i);
					GetIsdCode(sno, i);
				}


			},
			isPaging: true
		});
		//setTimeout(setStyle, 500);
	}
	
}
//function setStyle() {
//    $("#ApplicationTabs-3").css('overflow-x', 'scroll')
//}
function RemoveCity(obj) {
   
	var id = obj.context.id.match(/\d+/g).map(Number);
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
	$("#ApplicationTabs-2").find("span[id='spnBranch']").show()
	var page = getQueryStringValue("FormAction").toUpperCase()
	if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
		ShowMessage('info', 'Need your Kind Attention!', "Account Branch Information can be added in Edit/Update mode only.");
		return;
	}
	else {
		var dbtableName = "Branch";
		$("#tbl" + dbtableName).appendGrid({
			tableID: "tbl" + dbtableName,
			contentEditable: true,
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
					 userContext.SysSetting.ICMSEnvironment == 'JT' && ($("#IsAllowedConsolidatedCL:checked").val() == "1" || $("#IsHeadAccount").val().toUpperCase() == "YES") ? { name: "CreditLimit", display: "Credit Limit", type: "text", ctrlCss: { width: '100px' }, ctrlAttr: { controltype: "number" } } : { name: "CreditLimit", type: "hidden" },
					 userContext.SysSetting.ICMSEnvironment == 'JT' && ($("#IsAllowedConsolidatedCL:checked").val() == "1" || $("#IsHeadAccount").val().toUpperCase() == "YES") ? { name: "RemainingCreditLimit", display: "Balance Credit Limit", type: "label" } : { name: "RemainingCreditLimit", type: "hidden" },
					 userContext.SysSetting.ICMSEnvironment == 'JT' ? { name: "UtilizedCL", display: "Utilized Credit Limit", type: "label", ctrlCss: { width: '100px' } } : { name: "UtilizedCL", type: "hidden" },
					 { name: "MasterCreditLimit", type: "hidden" },
					  { name: "TotalCreditLimit", type: "hidden" },
						{ name: "MasterRCL", type: "hidden" },
					 
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
			customFooterButtons: [
			{
				uiButton: { icon: 'ui-icon-check', label: 'Back' }, btnCss: {}, click: function (evt) {
					window.parent.$("#iMasterFrame").attr('src', 'Default.cshtml?Module=Master&Apps=Account&FormAction=Edit&UserID=0&RecID=' + $("#htmlkeysno").val())
				}, atTheFront: true
			},
		  
			],
			isPaging: true,
		 
			dataLoaded: function (caller, parentRowIndex, addedRowIndex) {
				if ($("#tblBranch_rowOrder").val() != "" && userContext.SysSetting.ICMSEnvironment == 'JT' && ($("#IsAllowedConsolidatedCL:checked").val() == "1" || $("#IsHeadAccount").val().toUpperCase() == "YES")) {
				 
					var Array = [];
					$('[id^="tblBranch_CreditLimit_"]').each(function () {
						var no = $(this).attr('id').split('_')[2];
						Array.push({
							Id: $(this).attr('id'),
							Value: parseFloat($(this).val() == "" ? 0 : $(this).val()) - parseFloat($("#tblBranch_RemainingCreditLimit_" + no).text() == "" ? 0 : $("#tblBranch_RemainingCreditLimit_" + no).text())
						})
					   
					})
			
					$("#masterName").closest('tr').remove();
					var abc = '<tr><td class="formSection" colspan="9"><div> Master Account : <span id="masterName"> ' + $("#Name").val() + ' </span> <br><br>Total Credit Limit : <span id="spanCreditLimit" style ="color:black;">  </span>  <span> <span style ="margin-left: 270px;">Master Branch Credit Limit : &nbsp</span> <label id="MasterCl" style = "color:black;"> </label>  </span> <span id ="RCLMaster" style="float: right;    margin-right: 133px;">Master Branch Balance Credit Limit : &nbsp<span id="MasterRCL" style = "color:black;"></span></span>   </div> </td></tr>'
					$("#tblBranch thead tr:eq(0)").before(abc)
					$("#MasterCl").text($("#tblBranch_MasterCreditLimit_1").val())
					$("#MasterRCL").text($("#tblBranch_MasterRCL_1").val())
					$("#spanCreditLimit").text($("#tblBranch_TotalCreditLimit_1").val())

					var MasterVal = parseFloat($("#MasterCl").text() == "" ? 0 : $("#MasterCl").text()) - parseFloat($("#MasterRCL").text() == "" ? 0 : $("#MasterRCL").text());
					$(document).on("input", "[id^='tblBranch_CreditLimit_']", function () {
						var RowNo = $(this).attr('id').split('_')[2];
					   // this.value = this.value.replace(/\D/g, '');
					//    checkCreditLimit($(this).attr('id'))
					  //  this.value = this.value.replace(/\D/g, '');
						var val = parseFloat($("#spanCreditLimit").text() == "" ? 0 : $("#spanCreditLimit").text());
					   // var val1 = parseFloat($("#MasterCl").val() == "" ? 0 : $("#MasterCl").val());
						var sum = 0;
					  //  var count = 0;
						$('[id^="tblBranch_CreditLimit_"]').each(function () {
							sum = parseFloat($(this).val() == "" ? 0 : $(this).val()) + sum
							$("#MasterCl").text((val - sum).toFixed(2))
							$("#MasterRCL").text( (parseFloat($("#MasterCl").text()) - MasterVal).toFixed(2))
						})
					   
						if ((sum) > (val)) {
							ShowMessage('warning', 'Warning - Account', "Distributed Credit Limit/Top Up Amount cannot be greater than Master Credit Limit/Top Up Amount");
							var abc = parseFloat( $("#" + $(this).attr('id')).val());
							sum = sum -abc
							$("#" + $(this).attr('id')).val('');
							$("#tblBranch_RemainingCreditLimit_" + RowNo).text('');
							$("#MasterCl").text((val - sum).toFixed(2))
							$("#MasterRCL").text(parseFloat(($("#MasterCl").text()) - MasterVal).toFixed(2))
							return false;
						}
						//-------- added by Arman Ali
						var newval = parseFloat($(this).val() == "" ? 0 : $(this).val()) - parseFloat(findByKey(Array, $(this).attr('id')))
						$("#tblBranch_RemainingCreditLimit_" + RowNo).text(newval.toFixed(2));
					});
					if (page != "EDIT") {
						$('table[id="tblBranch"] tbody tr td input[type="text"][id^="tblBranch_"]').each(function () {
							$("#" + $(this).attr('id')).attr('disabled', 'disabled')
							$("#_temp" + $(this).attr('id')).attr('disabled', 'disabled')
						})

					}

				}
			  
			},
			hideButtons: { updateAll: userContext.SysSetting.ICMSEnvironment == 'JT' && $("#IsAllowedConsolidatedCL:checked").val() == "1" ? false : true, insert: true, remove: true, append: true, removeLast: true }
		});
	} 
	$("#tblBranch_btnUpdateAll").unbind('click').bind('click', function () {
		//------------ do your code------------
		var BranchCreditLimit = [];
		var checkdebit = 0;
		$('#tblBranch tbody tr').each(function () {
			var rowNo = $(this).attr('id').split("_")[2]
			if (parseFloat($("#tblBranch_CreditLimit_" + rowNo).val()) < 0 || parseFloat($("#tblBranch_RemainingCreditLimit_" + rowNo).text()) < 0)
				checkdebit = 1
			var tempBrachCreditLimit = {
			  SNo :  $("#tblBranch_SNo_" + rowNo).val(),
			  CreditLimit: parseFloat($("#tblBranch_CreditLimit_" + rowNo).val() == "" ? 0 : $("#tblBranch_CreditLimit_" + rowNo).val())
			}
			BranchCreditLimit.push(tempBrachCreditLimit)

		})
		var MasterSNo = $("#htmlkeysno").val() ;
		var MasterAccountCL = parseFloat($("#MasterCl").text() == "" ? 0 : $("#MasterCl").text());
		if (parseFloat($("#MasterCl").text()) < 0 || parseFloat($("#MasterRCL").text()) < 0)
			checkdebit = 1
		if (checkdebit == 1) {
			ShowMessage('warning', 'Warning - Account', "Balance Credit Limit / Top Up amount cannot be a Negative Value.");
			return false;
		}
		$.ajax({
			
			url: "./Services/Master/AccountService.svc/UpdateBranchCreditLimit",
			async: false, type: "POST", dataType: "json", cache: false,
			data: JSON.stringify({
				BranchCreditLimit: BranchCreditLimit, MasterSNo: MasterSNo, MasterAccountCL: MasterAccountCL, UserSNo: userContext.UserSNo
			}),
			contentType: "application/json; charset=utf-8",
			success: function (result) {
				ShowMessage('success', 'Success', "Branch Credit Limit Updated Successfully", "bottom-right");
				AccountBranchGrid();
			},
			error: function () {
				alert("Problem In data")
			}

		})
	})

	//--------------- tabbing issue for Back Button------------------
	$(".ui-button-text").closest('span:contains("Update All")').closest('button').on('keydown', function (e) {
		if (e.keyCode == "9") { 
		e.stopPropagation();
		e.preventDefault();
		$(".ui-button-text").closest('span:contains("Back")').closest('button').focus()
		}
	});
}

//document.on('input', '[id^="tblBranch_CreditLimit_"]', function () {
//    var val = parseFloat($("#spanCreditLimit").text() == "" ? 0 : $("#spanCreditLimit").text());
//    var val1 = parseFloat($("#MasterCl").val() == "" ? 0 : $("#MasterCl").val());
//    var sum = 0;
//    $('[id^="tblBranch_CreditLimit_"]').each(function () {
//        sum = parseFloat($(this).val() == "" ? 0 : $(this).val()) + sum
//    })
//    if (sum > (val + val1)) {
//        ShowMessage('warning', 'Warning - Account', "Distributed Credit limit Cannnot Be Grater Than Tatal Credit Limit");
//        $("#" + $(this).attr('id')).val('');
//        return false;
//    }
//});
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
		$("#" + currObject).val('');
		$("#_temp" + currObject).val('');
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
					if ($("ul#addlist2 li").length < 6) {
						//-------added by arman For Duplicate Email --------------
						var abc = $("#addlist2 li span").text().split(' ')
						if (abc.includes(addlen)) {
							ShowMessage('warning', 'Warning - Account', "Email Already Entered");
							$("#Email").val('');
						}
							//---------------end
						else{
						var listlen = $("ul#addlist2 li").length;
						$("ul#addlist2").append("<li class='k-button' style='margin-right:3px;margin-bottom:3px;'><span>" + addlen + " </span><span id='" + listlen + "' class='k-icon k-delete remove'></span></li>");
						}
					}
					else {
						ShowMessage('warning', 'Warning - Account', "Maximum 6 E-mail Addresses allowed.");
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
if (getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
	if ($('#Text_AccountTypeSNo').val() == 'FORWARDER' || $('#Text_AccountTypeSNo').val() == 'PO MAIL') {
		$('#Text_CustomerTypeSNo').attr("data-valid", "required");
		$('#Text_TransactionTypeSNo').attr("data-valid", "required");
		$('#spnCustomerTypeSNo').closest('td').find('font').text(' *');
		$('#spnTransactionTypeSNo').closest('td').find('font').text(' *');
		if ($('#Text_AccountTypeSNo').val() == "FORWARDER") {
	   
		   // $('#Text_IndustryTypeSNO').data("kendoAutoComplete").enable(true);
			//$('#Text_IndustryTypeSNO').removeAttr("data-valid");
			//$("#spnIndustryTypeSNO").closest('td').find('font').text("");
		}
		//else
		// $('#Text_IndustryTypeSNO').data("kendoAutoComplete").enable(false);
		//$('#Text_IndustryTypeSNO').removeAttr("data-valid");
		//$("#spnIndustryTypeSNO").closest('td').find('font').text("");
		enablecredit();
	}
	else
	//    $('#Text_IndustryTypeSNO').removeAttr("data-valid");
	//$("#spnIndustryTypeSNO").closest('td').find('font').text("");
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
  //  $("#MinimumCL").val('');    // commented by arman ali
  //  $("#AlertCLPercentage").val('');
  //  $("#_tempMinimumCL").val('');
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
//function validateBranchID() {
//    //alert("1");
//    if ($("#BranchID").val() != '') {
//        var branch = $("#BranchID").val();
//        var recID= $("#htmlkeysno").val()
//        $.ajax({
//            type: "GET",
//            url: "./Services/Master/AccountService.svc/ValidateBranch",
//            data: { Branch: branch, recID: recID },
//            contentType: "application/json; charset=utf-8",
//            dataType: "json",
//            success: function (response) {
//                if (jQuery.parseJSON(response) != undefined) {
//                    if (jQuery.parseJSON(response).Table0.length > 0) {
//                        if (jQuery.parseJSON(response).Table0[0].data == "0") {

//                            ShowMessage('warning', 'Warning - Account!', "Branch ID Already Exist.");
//                            $('#BranchID').val('');
//                            return;

//                        }
//                    }

//                }


//            },
//        });
//    }
//}
/*------Added By Pankaj Kumar Ishwar on 13-02-18 to change field,Tooltip in case of Topup------*/

function ChangeCreditLimitInformation() {
	$("td").each(function () {
		if ($(this).text() == "Allowed Credit Limit") {
			$(this).text("Allowed Top Up Amount");
			$(this).attr('title', 'Allowed Top Up Amount');
		}
		if ($(this).text() == "Consolidated Credit Limit") {
			$(this).text("Consolidated Top Up");
			$(this).attr('title', 'Consolidated Top Up');
		}
		if ($(this).text() == "Minimum Credit Limit") {
			$(this).text("Minimum Top Up Amount");
			$(this).attr('title', 'Minimum Top Up Amount');
		}
		if ($(this).text() == "Alert Credit Limit(%)") {
			$(this).text("Alert Top Up Amount");
			$(this).attr('title', 'Alert Top Up Amount');
		}
		if ($(this).text().trim() == "Credit Limit") {
			$(this).text("Top Up Amount");
			$(this).attr('title', 'Top Up Amount');
		}
	});
}
//----------- serch by Key in Json object---------
function findByKey(Object, Key) {
	for (key in Object) {
		if (Object[key].Id == Key)
			return Object[key].Value
	}


}
/*--------------------------------------------------------------------------*/
$(window).on('beforeunload', function () {
   
	$('input[name="operation"]').prop("disabled", "disabled");
});

function OtherAirlineDiv() {
	var pageType = getQueryStringValue("FormAction").toUpperCase() ;
	var REcordID = $('#hdnAccountSNo').val() || $('#htmlkeysno').val()
	var dbtableName = "OtherAirlineSlab";
	$("#tbl" + dbtableName).appendGrid({
		tableID: "tbl" + dbtableName,
		contentEditable: pageType!= 'READ' && pageType!= 'DELETE' ? true : false,
		masterTableSNo: REcordID,
		currentPage: 1,
		itemsPerPage: 10,
		whereCondition: null,
		rowUpdateExtraFunction: null,
		dataLoaded: null,
		sort: "",
		isGetRecord: true,
		servicePath: "./Services/Master/AccountService.svc",
		getRecordServiceMethod: "GetOtherAirlinesRecord",
		//createUpdateServiceMethod: "CreateUpdateOtherAirlineRecord",
		caption: "Other Airline Access",
	   // deleteServiceMethod: "DeleteOtherAirlinesRecord",
		initRows: 1,
		columns: [{ name: "SNo", type: "hidden", value: 0 },
				 { name: 'AccountSNo', type: 'hidden', value: 0 },
				 { name: "AirlineSNo", display: "Airline", type: "text", ctrlAttr: { maxlength: 100, controltype: "autocomplete", onSelect: "" }, ctrlCss: { width: "200px" }, isRequired: true, AutoCompleteName: "Account_AirlineName", filterField: "CarrierCode,AirlineName" },
				 { name: "ReferenceNumber", display: "Reference Number", type: "text", ctrlAttr: { maxlength: 50, controltype: "alphanumericupper", onkeypress: "", }, ctrlCss: { width: "300px" }, isRequired: true },
		],
		hideButtons: { updateAll: true, append: false, insert:  true, remove: true, removeLast: false, },
		isPaging: true
	});
	
}

function CreateUpdateOtherAirlineRecord() {

	var OtherAirlines = [];
	$("tr[id^='tblOtherAirlineSlab_Row_']").each(function (row, tr) {
		var Model = {
			SNo: 0,
			AirlineSNo: $(tr).find("input[id^='tblOtherAirlineSlab_HdnAirlineSNo_']").val(),
			ReferenceNumber: $(tr).find("input[id^='tblOtherAirlineSlab_ReferenceNumber_']").val(),
			AccountSNo: $('#hdnAccountSNo').val() || 0
		}
		OtherAirlines.push(Model);

	});

	$.ajax({ 
		url: "./Services/Master/AccountService.svc/CreateUpdateOtherAirlineRecord",
		async: false,
		type: "POST",
		dataType: "json",
		data: JSON.stringify({ OtherAirlines }),
		contentType: "application/json; charset=utf-8",
		cache: false,
		success: function (result) {
			var ResultStatus = result;

			if (ResultStatus == "0") {

				//ShowMessage('success', 'Success - Account !', "");
			}
			else if (ResultStatus == "1001") {
			   // ShowMessage('warning', 'Warning - Account !', '');
			}
			else {
			  //  ShowMessage('info', 'Info - Account !', ' Related Information Not Found.');
			}
		}
	});

}

function branchAirline() {
	var data="";
	$.ajax({
	url: "./Services/Master/AccountService.svc/BranchAirline",
			async : false,
			type: "GET",
			dataType: "json",
			data: { MasterAccount: $("#Branch").val() || 0 },
				contentType: "application/json; charset=utf-8",
				cache: false,
				success: function (result) {
					var d = jQuery.parseJSON(result);
					data = d.Table0[0].AirlineSno;

				}
	});
	return data;
}

function GetOfficeType() {
	var OfficeName = $("#OfficeSNo").val();
	var OfficeType = "";
	if (OfficeName != undefined) {
		$.ajax({
			type: "POST",
			url: "./Services/Master/AccountService.svc/GetOfficeType?OfficeSno=" + OfficeName,
			data: { id: 1 },
			dataType: "json",
			success: function (response) {
				OfficeType = response.Data[0];
				if (OfficeType == "GSA") {
					$("#_tempORCPercentage").closest('tr').show();
				}
				else {
					$("#_tempORCPercentage").closest('tr').hide();
					$("#_tempORCPercentage").val('0');
					$("#ORCPercentage").val('0');
				}
			}
		});
	}
}


$(document).on('blur', '[id^=tblOtherAirlineSlab_ReferenceNumber_]', function (e) {
	var rowno = e.currentTarget.id.split('_')[2]
	$("table tr td input[id^=tblOtherAirlineSlab_ReferenceNumber_]").each(function () {
		var currRowID = $(this).attr('id').split('_')[2];
		if (currRowID != rowno) {
			var CuV = $("#tblOtherAirlineSlab_ReferenceNumber_" +rowno).val().toUpperCase();
			var Nv =$("#tblOtherAirlineSlab_ReferenceNumber_" +currRowID).val().toUpperCase();
			if ((CuV == Nv) && (CuV != "" && Nv !="")) {
				$('#' +e.currentTarget.id).val('');
				ShowMessage('warning', 'Warning - Account!', "Duplicate Reference Number is not allowed");
				return false;
		}


	}

})

});

